// Copyright 2017 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

const { sql } = require('slonik');
const { Frame, readable } = require('../frame');
const { Actor, FieldKey } = require('../frames');
const { QueryOptions, extender, sqlEquals } = require('../../util/db');

const create = (fk, project) => ({ Actors, Sessions }) =>
  Actors.createSubtype(fk.with({ projectId: project.id }), project)
    .then((created) => Sessions.create(created.actor, new Date('9999-12-31T23:59:59z'))
      .then((session) => created.withAux('session', session)));

create.audit = (result) => (log) => log('field_key.create', result.actor);
create.audit.withResult = true;

// createWithoutSession lets us create a field key without auto-issuing
//  the legacy 9999-year session. The vg flow needs to create the actor
//  field_key row, attach the vg auth record, and then issue a short-
//  lived session only after a successful login/password check. Using the
//  existing create would still mint the long-lived token, which we want
//  to avoid.

const createWithoutSession = (fk, project) => ({ Actors }) =>
  Actors.createSubtype(fk.with({ projectId: project.id }), project);

const _get = extender(FieldKey, Actor, Frame.define('token', readable), Frame.define('active', readable, 'username', readable, 'phone', readable).into('activeStatus'))(Actor.alias('created_by', 'createdBy'), Frame.define('lastUsed', readable))((fields, extend, options) => sql`
select ${fields} from field_keys
  join actors on field_keys."actorId"=actors.id
  left outer join lateral (
    select token, "actorId"
      from sessions
     where sessions."actorId" = field_keys."actorId"
     order by "createdAt" desc
     limit 1
  ) as sessions on true
  left outer join (select "actorId", coalesce(vg_active, true) as active, vg_username as username, vg_phone as phone from vg_field_key_auth) as vg_auth on field_keys."actorId"=vg_auth."actorId"
  ${extend || sql`join actors as created_by on field_keys."createdBy"=created_by.id`}
  ${extend || sql`left outer join
    (select "actorId", max("loggedAt") as "lastUsed" from audits
      where action='submission.create'
      group by "actorId") as last_usage
    on last_usage."actorId"=actors.id`}
  where ${sqlEquals(options.condition)} and actors."deletedAt" is null
  order by (sessions.token is not null) desc, actors."createdAt" desc`);

const getAllForProject = (project, options = QueryOptions.none) => ({ all }) =>
  _get(all, options.withCondition({ projectId: project.id }));

const getByProjectAndActorId = (projectId, actorId, options = QueryOptions.none) => ({ maybeOne }) =>
  _get(maybeOne, options.withCondition({ projectId, 'field_keys.actorId': actorId }));

module.exports = { create, createWithoutSession, getAllForProject, getByProjectAndActorId };
