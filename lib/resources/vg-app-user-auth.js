const Problem = require('../util/problem');
const { isBlank } = require('../util/util');
const { success } = require('../util/http');
const { getOrNotFound } = require('../util/promise');
const vgAuth = require('../domain/vg-app-user-auth');

module.exports = (service, endpoint, anonymousEndpoint) => {
  // Login (username/password) to get short-lived token.
  service.post('/projects/:projectId/app-users/login', anonymousEndpoint(
    ({ Projects, VgAppUserAuth, Sessions, Audits }, { body, params }, request) => {
      const { username, password } = body;
      if (isBlank(username) || isBlank(password))
        return Problem.user.missingParameters({ expected: ['username', 'password'], got: body });

      return Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then(() => vgAuth.login({ VgAppUserAuth, Sessions, Audits }, { username, password, ip: request.ip }));
    }
  ));

  // Change password (self).
  service.post('/projects/:projectId/app-users/:id/password/change', endpoint(
    ({ Projects, FieldKeys, VgAppUserAuth, Sessions, Audits }, { auth, body, params }) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
        .then(getOrNotFound)
        .then((fk) => {
          if (auth.actor.map((a) => a.id).orNull() !== fk.actor.id)
            return Problem.user.insufficientRights();
          const { oldPassword, newPassword } = body;
          if (isBlank(oldPassword) || isBlank(newPassword))
            return Problem.user.missingParameters({ expected: ['oldPassword', 'newPassword'], got: body });
          return vgAuth.changePassword({ VgAppUserAuth, Sessions, Audits }, fk.actor.id, { oldPassword, newPassword })
            .then(() => success);
        })
  ));

  // Reset password (admin).
  service.post('/projects/:projectId/app-users/:id/password/reset', endpoint(
    ({ Projects, FieldKeys, VgAppUserAuth, Sessions, Audits }, { auth, body, params }) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => auth.canOrReject('field_key.delete', project)
          .then(() => FieldKeys.getByProjectAndActorId(project.id, params.id)))
        .then(getOrNotFound)
        .then((fk) => {
          if (fk.aux.activeStatus?.active === false)
            throw Problem.user.invalidEntity({ reason: 'User is revoked.' });
          const { newPassword } = body;
          if (isBlank(newPassword))
            return Problem.user.missingParameters({ expected: ['newPassword'], got: body });
          return vgAuth.resetPassword({ VgAppUserAuth, Sessions, Audits }, fk.actor.id, { newPassword })
            .then(() => success);
        })
  ));

  // Self revoke sessions.
  service.post('/projects/:projectId/app-users/:id/revoke', endpoint(
    ({ Projects, FieldKeys, Sessions, Audits, VgAppUserAuth }, { auth, params }) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
        .then(getOrNotFound)
        .then((fk) => {
          if (auth.actor.map((a) => a.id).orNull() !== fk.actor.id)
            return Problem.user.insufficientRights();
          const currentToken = auth.session.map((s) => s.token).orNull();
          return vgAuth.revokeSessions({ Sessions, Audits, VgAppUserAuth }, fk.actor.id, currentToken)
            .then(() => success);
        })
  ));

  // Admin revoke access (deactivate).
  service.post('/projects/:projectId/app-users/:id/revoke-admin', endpoint(
    ({ Projects, FieldKeys, Sessions, Audits, VgAppUserAuth }, { auth, params }) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => auth.canOrReject('field_key.delete', project)
          .then(() => FieldKeys.getByProjectAndActorId(project.id, params.id)))
        .then(getOrNotFound)
        .then((fk) => vgAuth.setActive({ VgAppUserAuth, Sessions, Audits }, fk.actor.id, false)
          .then(() => success))
  ));

  // Deactivate/reactivate (admin).
  service.post('/projects/:projectId/app-users/:id/active', endpoint(
    ({ Projects, FieldKeys, VgAppUserAuth, Sessions, Audits }, { auth, body, params }) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => auth.canOrReject('field_key.delete', project)
          .then(() => FieldKeys.getByProjectAndActorId(project.id, params.id)))
        .then(getOrNotFound)
        .then((fk) => {
          const active = body?.active;
          if (typeof active !== 'boolean')
            return Problem.user.invalidDataTypeOfParameter({ field: 'active', expected: 'boolean' });
          return vgAuth.setActive({ VgAppUserAuth, Sessions, Audits }, fk.actor.id, active)
            .then(() => success);
        })
  ));
};
