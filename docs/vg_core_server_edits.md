# VG Core Server Edits (Required Log)

This log must include only VG fork modifications and exclude upstream master changes introduced by rebases or merges.

This file must document every edit made to upstream core server files
in `getodk/central-backend`. Use it to keep rebases manageable.

## Log Format (one entry per change)

- Date:
- File:
- Change summary:
- Reason:
- Risk/notes:
- Related commits/PRs:

## Entries

- Date: 2025-12-21
  File: docs/database.md
  Change summary: Documented VG auth tables and settings.
  Reason: Track vg_* schema additions.
  Risk/notes: Low.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/docs/database.md b/docs/database.md
  index 299498f5..f49d104f 100644
  --- a/docs/database.md
  +++ b/docs/database.md
  @@ -162,4 +162,5 @@ This area of the database deals with the users, their access rights and audit lo
   These are few stand-alone tables. 
   
   - `configs` table hold different application configurations related analytics, backups, etc
  +- `vg_settings` stores vg-specific key/value configuration such as `vg_app_user_session_ttl_days` (default seeded to 3 days for app-user session expiry).
   - `knex_migrations` and `knex_migrations_lock` are used internally by Knex.js for keeping database migrations history.
  ```

- Date: 2025-12-21
  File: lib/http/service.js
  Change summary: Wired vg auth resources and auth behavior.
  Reason: Expose new VG endpoints.
  Risk/notes: Medium; core request routing.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/http/service.js b/lib/http/service.js
  index fa114174..c83c8a80 100644
  --- a/lib/http/service.js
  +++ b/lib/http/service.js
  @@ -98,6 +98,7 @@ module.exports = (container) => {
     require('../resources/forms')(service, endpoint, anonymousEndpoint);
     require('../resources/users')(service, endpoint, anonymousEndpoint);
     require('../resources/sessions')(service, endpoint, anonymousEndpoint);
  +  require('../resources/vg-app-user-auth')(service, endpoint, anonymousEndpoint);
     require('../resources/geo-extracts')(service, endpoint);
     require('../resources/submissions')(service, endpoint, anonymousEndpoint);
     require('../resources/config')(service, endpoint);
  @@ -159,4 +160,3 @@ module.exports = (container) => {
     return service;
   
   };
  -
  ```

- Date: 2025-12-21
  File: lib/model/container.js
  Change summary: Container bindings updated for VG auth components.
  Reason: Register vg auth domain/query resources.
  Risk/notes: Low.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/model/container.js b/lib/model/container.js
  index e2c209fd..04055d75 100644
  --- a/lib/model/container.js
  +++ b/lib/model/container.js
  @@ -113,10 +113,10 @@ const withDefaults = (base, queries) => {
       Entities: require('./query/entities'),
       UserPreferences: require('./query/user-preferences'),
       GeoExtracts: require('./query/geo-extracts'),
  +    VgAppUserAuth: require('./query/vg-app-user-auth'),
     };
   
     return injector(base, mergeRight(defaultQueries, queries));
   };
   
   module.exports = { queryModuleBuilder, injector, withDefaults };
  -
  ```

- Date: 2025-12-21
  File: lib/model/query/actors.js
  Change summary: Actor query updates for VG app-user auth metadata.
  Reason: Support username/phone fields and active flags.
  Risk/notes: Medium.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/model/query/actors.js b/lib/model/query/actors.js
  index 7cdb49f3..4935b7f6 100644
  --- a/lib/model/query/actors.js
  +++ b/lib/model/query/actors.js
  @@ -48,5 +48,7 @@ const getById = (id) => ({ maybeOne }) =>
     maybeOne(sql`select * from actors where id=${id} and "deletedAt" is null`)
       .then(map(construct(Actor)));
   
  -module.exports = { create, createSubtype, consume, _del, del, getById };
  +const updateDisplayName = (actorId, displayName) => ({ run }) =>
  +  run(sql`UPDATE actors SET "displayName"=${displayName} WHERE id=${actorId}`);
   
  +module.exports = { create, createSubtype, consume, _del, del, getById, updateDisplayName };
  ```

- Date: 2025-12-21
  File: lib/model/query/field-keys.js
  Change summary: Field key queries updated for VG auth and active status.
  Reason: Support short-lived token model and list behavior.
  Risk/notes: Medium.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/model/query/field-keys.js b/lib/model/query/field-keys.js
  index ddaf98e3..b2abb55c 100644
  --- a/lib/model/query/field-keys.js
  +++ b/lib/model/query/field-keys.js
  @@ -20,12 +20,29 @@ const create = (fk, project) => ({ Actors, Sessions }) =>
   create.audit = (result) => (log) => log('field_key.create', result.actor);
   create.audit.withResult = true;
   
  -const _get = extender(FieldKey, Actor, Frame.define('token', readable))(Actor.alias('created_by', 'createdBy'), Frame.define('lastUsed', readable))((fields, extend, options) => sql`
  +// createWithoutSession lets us create a field key without auto-issuing
  +//  the legacy 9999-year session. The vg flow needs to create the actor
  +//  field_key row, attach the vg auth record, and then issue a short-
  +//  lived session only after a successful login/password check. Using the
  +//  existing create would still mint the long-lived token, which we want
  +//  to avoid.
  +
  +const createWithoutSession = (fk, project) => ({ Actors }) =>
  +  Actors.createSubtype(fk.with({ projectId: project.id }), project);
  +
  +const _get = extender(FieldKey, Actor, Frame.define('token', readable), Frame.define('active', readable, 'username', readable, 'phone', readable).into('activeStatus'))(Actor.alias('created_by', 'createdBy'), Frame.define('lastUsed', readable))((fields, extend, options) => sql`
   select ${fields} from field_keys
     join actors on field_keys."actorId"=actors.id
  -  left outer join sessions on field_keys."actorId"=sessions."actorId"
  -  ${extend|| sql`join actors as created_by on field_keys."createdBy"=created_by.id`}
  -  ${extend|| sql`left outer join
  +  left outer join lateral (
  +    select token, "actorId"
  +      from sessions
  +     where sessions."actorId" = field_keys."actorId"
  +     order by "createdAt" desc
  +     limit 1
  +  ) as sessions on true
  +  left outer join (select "actorId", coalesce(vg_active, true) as active, vg_username as username, vg_phone as phone from vg_field_key_auth) as vg_auth on field_keys."actorId"=vg_auth."actorId"
  +  ${extend || sql`join actors as created_by on field_keys."createdBy"=created_by.id`}
  +  ${extend || sql`left outer join
       (select "actorId", max("loggedAt") as "lastUsed" from audits
         where action='submission.create'
         group by "actorId") as last_usage
  @@ -39,5 +56,4 @@ const getAllForProject = (project, options = QueryOptions.none) => ({ all }) =>
   const getByProjectAndActorId = (projectId, actorId, options = QueryOptions.none) => ({ maybeOne }) =>
     _get(maybeOne, options.withCondition({ projectId, 'field_keys.actorId': actorId }));
   
  -module.exports = { create, getAllForProject, getByProjectAndActorId };
  -
  +module.exports = { create, createWithoutSession, getAllForProject, getByProjectAndActorId };
  ```

- Date: 2025-12-21
  File: lib/model/query/sessions.js
  Change summary: Session logic updated for TTL/cap and VG auth.
  Reason: Enforce session limits for app-user logins.
  Risk/notes: High; auth/session integrity.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/model/query/sessions.js b/lib/model/query/sessions.js
  index 1cc7ca48..0275bb09 100644
  --- a/lib/model/query/sessions.js
  +++ b/lib/model/query/sessions.js
  @@ -42,13 +42,27 @@ const _unjoiner = unjoiner(Session, Actor);
   const getByBearerToken = (token) => ({ maybeOne }) => (isValidToken(token) ? maybeOne(sql`
   select ${_unjoiner.fields} from sessions
   join actors on actors.id=sessions."actorId"
  -where token=${token} and sessions."expiresAt" > now()`)
  +left join vg_field_key_auth on vg_field_key_auth."actorId"=sessions."actorId"
  +where token=${token} and sessions."expiresAt" > now()
  +  and (actors.type <> 'field_key' or coalesce(vg_field_key_auth.vg_active, true) = true)`)
     .then(map(_unjoiner)) : Promise.resolve(Option.none()));
   
   const terminateByActorId = (actorId, current = undefined) => ({ run }) =>
     run(sql`DELETE FROM sessions WHERE "actorId"=${actorId}
   ${current == null ? sql`` : sql`AND token <> ${current}`}`);
   
  +const trimByActorId = (actorId, limit) => ({ run }) =>
  +  run(sql`
  +    DELETE FROM sessions
  +    WHERE "actorId"=${actorId}
  +      AND token NOT IN (
  +        SELECT token FROM sessions
  +        WHERE "actorId"=${actorId}
  +        ORDER BY "createdAt" DESC
  +        LIMIT ${limit}
  +      )
  +  `);
  +
   const terminate = (session) => ({ run }) =>
     run(sql`delete from sessions where token=${session.token}`);
   
  @@ -62,5 +76,4 @@ terminate.audit = (session) => (log) => {
   const reap = () => ({ run }) =>
     run(sql`delete from sessions where "expiresAt" < now()`);
   
  -module.exports = { create, getByBearerToken, terminateByActorId, terminate, reap };
  -
  +module.exports = { create, getByBearerToken, terminateByActorId, trimByActorId, terminate, reap };
  ```

- Date: 2025-12-30
  File: lib/model/query/sessions.js
  Change summary: Require vg_field_key_auth presence to authenticate field_key sessions.
  Reason: Block legacy long-lived field-key tokens without VG auth records.
  Risk/notes: High; app-user authentication behavior.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/model/query/sessions.js b/lib/model/query/sessions.js
  index 0275bb09..5e8a7d2f 100644
  --- a/lib/model/query/sessions.js
  +++ b/lib/model/query/sessions.js
  @@ -44,7 +44,7 @@ const getByBearerToken = (token) => ({ maybeOne }) => (isValidToken(token) ? maybeOne(sql`
   select ${_unjoiner.fields} from sessions
   join actors on actors.id=sessions."actorId"
   left join vg_field_key_auth on vg_field_key_auth."actorId"=sessions."actorId"
   where token=${token} and sessions."expiresAt" > now()
  -  and (actors.type <> 'field_key' or coalesce(vg_field_key_auth.vg_active, true) = true)`)
  +  and (actors.type <> 'field_key' or (vg_field_key_auth."actorId" is not null and vg_field_key_auth.vg_active = true))`)
  ```
- Date: 2025-12-21
  File: lib/resources/app-users.js
  Change summary: App user API updated to support new fields and behavior.
  Reason: Add username/phone, active status, and admin actions.
  Risk/notes: Medium.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/resources/app-users.js b/lib/resources/app-users.js
  index 98b5674b..a8dc78af 100644
  --- a/lib/resources/app-users.js
  +++ b/lib/resources/app-users.js
  @@ -7,9 +7,9 @@
   // including this file, may be copied, modified, propagated, or distributed
   // except according to the terms contained in the LICENSE file.
   
  -const { FieldKey } = require('../model/frames');
   const { getOrNotFound } = require('../util/promise');
   const { success } = require('../util/http');
  +const vgAuth = require('../domain/vg-app-user-auth');
   
   module.exports = (service, endpoint) => {
   
  @@ -17,17 +17,36 @@ module.exports = (service, endpoint) => {
       Projects.getById(params.projectId)
         .then(getOrNotFound)
         .then((project) => auth.canOrReject('field_key.list', project))
  -      .then((project) => FieldKeys.getAllForProject(project, queryOptions))));
  +      .then((project) => FieldKeys.getAllForProject(project, queryOptions))
  +      // VG: do not expose active session tokens in listings.
  +      .then((keys) => keys.map((fk) => ({ ...fk.forApi(), token: null, session: undefined, active: fk.aux.activeStatus?.active, username: fk.aux.activeStatus?.username, phone: fk.aux.activeStatus?.phone })))));
   
  -  service.post('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects }, { auth, body, params }) =>
  +  service.post('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects, VgAppUserAuth, Sessions, Audits }, { auth, body, params }) =>
       Projects.getById(params.projectId)
         .then(getOrNotFound)
  -      .then((project) => auth.canOrReject('field_key.create', project))
  -      .then((project) => {
  -        const fk = FieldKey.fromApi(body)
  -          .with({ createdBy: auth.actor.map((actor) => actor.id).orNull() });
  -        return FieldKeys.create(fk, project);
  -      })));
  +      .then((project) => auth.canOrReject('field_key.create', project)
  +        .then(() => vgAuth.createAppUser({ FieldKeys, VgAppUserAuth, Sessions, Audits }, project, body, auth.actor.map((actor) => actor.id).orNull())))));
  +
  +  service.patch('/projects/:projectId/app-users/:id', endpoint(async ({ Actors, FieldKeys, Projects, VgAppUserAuth }, { auth, body, params }) => {
  +    const project = await Projects.getById(params.projectId).then(getOrNotFound);
  +    const canUpdate = await auth.can('field_key.update', project);
  +    if (!canUpdate) await auth.canOrReject('field_key.create', project);
  +    const fk = await FieldKeys.getByProjectAndActorId(project.id, params.id).then(getOrNotFound);
  +
  +    await vgAuth.updateAppUser({ Actors, VgAppUserAuth, context: { auth } }, fk.actorId, project.id, body);
  +
  +    // Return the latest data (no token, include phone/active/username).
  +    const refreshed = await FieldKeys.getByProjectAndActorId(project.id, params.id).then(getOrNotFound);
  +    const activeStatus = refreshed.aux.activeStatus || {};
  +    return {
  +      ...refreshed.forApi(),
  +      token: null,
  +      session: undefined,
  +      active: activeStatus.active,
  +      username: activeStatus.username,
  +      phone: activeStatus.phone
  +    };
  +  }));
   
     service.delete('/projects/:projectId/app-users/:id', endpoint(({ Actors, FieldKeys, Projects }, { auth, params }) =>
       Projects.getById(params.projectId)
  @@ -39,4 +58,3 @@ module.exports = (service, endpoint) => {
         .then(success)));
   
   };
  -
  ```

- Date: 2025-12-21
  File: lib/util/problem.js
  Change summary: Added VG-specific problem codes/messages.
  Reason: Provide clear errors for app-user auth flows.
  Risk/notes: Low.
  Related commits/PRs: vg-work history
  Diff:
  ```diff
  diff --git a/lib/util/problem.js b/lib/util/problem.js
  index 1611a15f..6cda4a86 100644
  --- a/lib/util/problem.js
  +++ b/lib/util/problem.js
  @@ -99,6 +99,8 @@ const problems = {
   
       expectedDeprecation: problem(400.19, () => 'This PUT endpoint expects a deprecatedID metadata tag pointing at the current version instanceID. I cannot find that tag in your request.'),
   
  +    passwordWeak: problem(400.20, () => 'The password provided does not meet the policy requirements.'),
  +
       passwordTooShort: problem(400.21, () => 'The password or passphrase provided does not meet the required length.'),
   
       valueOutOfRangeForType: problem(400.22, ({ value, type }) => `Provided value '${value}' is out of range for type '${type}'`),
  ```
