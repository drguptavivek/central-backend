// Copyright 2018 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

const { getOrNotFound } = require('../util/promise');
const { success } = require('../util/http');
const vgAuth = require('../domain/vg-app-user-auth');

module.exports = (service, endpoint) => {

  service.get('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects }, { auth, params, queryOptions }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.list', project))
      .then((project) => FieldKeys.getAllForProject(project, queryOptions))
      // VG: do not expose active session tokens in listings.
      .then((keys) => keys.map((fk) => ({ ...fk.forApi(), token: null, session: undefined, active: fk.aux.activeStatus?.active, username: fk.aux.activeStatus?.username, phone: fk.aux.activeStatus?.phone })))));

  service.post('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects, VgAppUserAuth, Sessions, Audits }, { auth, body, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.create', project)
        .then(() => vgAuth.createAppUser({ FieldKeys, VgAppUserAuth, Sessions, Audits }, project, body, auth.actor.map((actor) => actor.id).orNull())))));

  service.patch('/projects/:projectId/app-users/:id', endpoint(async ({ Actors, FieldKeys, Projects, VgAppUserAuth }, { auth, body, params }) => {
    const project = await Projects.getById(params.projectId).then(getOrNotFound);
    const canUpdate = await auth.can('field_key.update', project);
    if (!canUpdate) await auth.canOrReject('field_key.create', project);
    const fk = await FieldKeys.getByProjectAndActorId(project.id, params.id).then(getOrNotFound);

    const payload = (body == null) ? {} : body;
    await vgAuth.updateAppUser({ Actors, VgAppUserAuth, context: { auth } }, fk.actorId, project.id, payload);

    // Return the latest data (no token, include phone/active/username).
    const refreshed = await FieldKeys.getByProjectAndActorId(project.id, params.id).then(getOrNotFound);
    const activeStatus = refreshed.aux.activeStatus || {};
    return {
      ...refreshed.forApi(),
      token: null,
      session: undefined,
      active: activeStatus.active,
      username: activeStatus.username,
      phone: activeStatus.phone
    };
  }));

  service.delete('/projects/:projectId/app-users/:id', endpoint(({ Actors, FieldKeys, Projects }, { auth, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.delete', project))
      .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
      .then(getOrNotFound)
      .then((fk) => Actors.del(fk.actor))
      .then(success)));

};
