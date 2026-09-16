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
const { QueryOptions } = require('../util/db');
const vgAuth = require('../domain/vg-app-user-auth');

module.exports = (service, endpoint) => {

  service.get('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects }, { auth, params, queryOptions }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.list', project))
      .then((project) => FieldKeys.getAllForProject(project, queryOptions))
      .then((keys) => keys.map(vgAuth.forApi))));

  service.post('/projects/:projectId/app-users', endpoint(async ({ ActorProperties, Actors, Projects, VgAppUserAuth, Sessions, Audits }, { auth, body, params }) => {
    const project = await Projects.getById(params.projectId).then(getOrNotFound);
    await auth.canOrReject('field_key.create', project);
    const fieldKey = await vgAuth.createAppUser(
      { Actors, VgAppUserAuth, Sessions, Audits },
      project,
      body ?? {},
      auth.actor.map((actor) => actor.id).orNull()
    );
    await vgAuth.setProperties(ActorProperties, project, fieldKey, body?.properties);
    return vgAuth.forCreateApi(fieldKey);
  }));

  service.get('/projects/:projectId/app-users/:id', endpoint(({ FieldKeys, Projects }, { auth, params, queryOptions }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.list', project))
      .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id, queryOptions))
      .then(getOrNotFound)
      .then(vgAuth.forApi)));

  service.patch('/projects/:projectId/app-users/:id', endpoint(async ({ ActorProperties, Actors, FieldKeys, Projects, VgAppUserAuth }, { auth, body, params }) => {
    const project = await Projects.getById(params.projectId).then(getOrNotFound);
    const canUpdate = await auth.can('field_key.update', project);
    if (!canUpdate) await auth.canOrReject('field_key.create', project);
    const fk = await FieldKeys.getByProjectAndActorId(project.id, params.id).then(getOrNotFound);

    const payload = body ?? {};
    if (payload.fullName !== undefined || payload.displayName !== undefined || payload.phone !== undefined) {
      await vgAuth.updateAppUser({ Actors, VgAppUserAuth, context: { auth } }, fk.actorId, project.id, payload);
    }
    await vgAuth.setProperties(ActorProperties, project, fk, payload.properties);

    // Return the latest extended data so property updates are visible.
    const refreshed = await FieldKeys.getByProjectAndActorId(project.id, params.id, QueryOptions.extended).then(getOrNotFound);
    return vgAuth.forApi(refreshed);
  }));

  service.delete('/projects/:projectId/app-users/:id', endpoint(({ Actors, FieldKeys, Projects, VgAppUserAuth }, { auth, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.delete', project))
      .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
      .then(getOrNotFound)
      .then(async (fk) => {
        await VgAppUserAuth.setActive(fk.actor.id, false);
        await Actors.del(fk.actor);
      })
      .then(success)));

};
