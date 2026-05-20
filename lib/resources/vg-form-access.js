const { Form } = require('../model/frames');
const { getOrNotFound, getOrReject, reject } = require('../util/promise');
const { QueryOptions } = require('../util/db');
const Problem = require('../util/problem');

module.exports = (service, endpoint) => {
  service.put('/projects/:id/form-access', endpoint(({ Actors, Assignments, FieldKeys, Forms, Projects, Roles }, { auth, body, params }) =>
    Projects.getById(params.id)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('vg_form_access.update', project)
        .then(() => Promise.all([
          Forms.getByProjectId(auth, project.id, Form.AnyVersion),
          Assignments.getForFormsByProjectId(project.id, QueryOptions.extended),
          Roles.getBySystemName('app-user').then(getOrNotFound)
        ]))
        .then(([forms, assignments, appUserRole]) => {
          const payload = body ?? {};
          if (!Array.isArray(payload.forms))
            return reject(Problem.user.missingParameter({ field: 'forms' }));
          if (payload.forms.length !== forms.length)
            return reject(Problem.internal.unexpectedFormsList());

          const queries = [];
          const seen = new Set();
          for (const given of payload.forms) {
            const keys = Object.keys(given);
            if (keys.some((key) => !['xmlFormId', 'state', 'assignments'].includes(key)))
              return reject(Problem.user.unexpectedValue({ field: 'form', value: keys.join(','), reason: 'only xmlFormId, state, and assignments are allowed' }));
            if (seen.has(given.xmlFormId))
              return reject(Problem.user.unexpectedValue({ field: 'xmlFormId', value: given.xmlFormId, reason: 'duplicate value' }));
            seen.add(given.xmlFormId);

            const extant = forms.find((form) => form.xmlFormId === given.xmlFormId);
            if (extant == null) return reject(Problem.internal.unexpectedFormsList());
            if (!['open', 'closing', 'closed'].includes(given.state))
              return reject(Problem.user.unexpectedValue({ field: 'state', value: given.state, reason: 'must be open, closing, or closed' }));
            if (given.state !== extant.state)
              queries.push(() => Forms.update(extant, { state: given.state }));

            if (!Array.isArray(given.assignments))
              return reject(Problem.user.missingParameter({ field: 'assignments' }));
            for (const assignment of given.assignments) {
              if (assignment.actorId == null)
                return reject(Problem.user.missingParameter({ field: 'assignment actorId' }));
              if (Number(assignment.roleId) !== appUserRole.id)
                return reject(Problem.user.unexpectedValue({ field: 'roleId', value: assignment.roleId, reason: 'only app-user assignments are allowed' }));
            }

            const currentAppUserAssignments = assignments.filter((assigned) =>
              assigned.roleId === appUserRole.id && assigned.aux.form.xmlFormId === given.xmlFormId);
            const removals = currentAppUserAssignments.filter((assigned) =>
              !given.assignments.some((givenAssign) => Number(givenAssign.actorId) === assigned.actorId));
            queries.push(...removals.map((removal) => () =>
              Assignments.revoke(removal.actor, removal.roleId, removal.aux.form)));

            const additions = given.assignments.filter((givenAssign) =>
              !currentAppUserAssignments.some((assigned) => assigned.actorId === Number(givenAssign.actorId)));
            queries.push(...additions.map((addition) => () =>
              FieldKeys.getByProjectAndActorId(project.id, addition.actorId)
                .then(getOrReject(Problem.user.keyDoesNotExist({ field: 'actorId', value: addition.actorId, table: 'field_keys' })))
                .then(() => Actors.getById(addition.actorId))
                .then(getOrReject(Problem.user.keyDoesNotExist({ field: 'actorId', value: addition.actorId, table: 'actors' })))
                .then((actor) => Assignments.grant(actor, appUserRole, extant))));
          }

          return Promise.all(queries.map((query) => query()))
            .then(() => Projects.getById(params.id))
            .then(getOrNotFound);
        }))));
};
