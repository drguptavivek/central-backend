const Problem = require('../util/problem');
const { isBlank } = require('../util/util');
const { success } = require('../util/http');
const { getOrNotFound } = require('../util/promise');
const vgAuth = require('../domain/vg-app-user-auth');
const { Config } = require('../model/frames');

module.exports = (service, endpoint, anonymousEndpoint) => {
  const parsePositiveInt = (value, field) => {
    if (value == null) return null;
    const num = Number(value);
    if (!Number.isFinite(num) || !Number.isInteger(num) || num <= 0)
      throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'positive integer' });
    return num;
  };
  const parseIntParam = (value, field) => {
    if (value == null) return null;
    const num = Number(value);
    if (!Number.isFinite(num) || !Number.isInteger(num))
      throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'integer' });
    return num;
  };
  const parseDateParam = (value, field) => {
    if (value == null) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime()))
      throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'ISO datetime' });
    return parsed;
  };

  // Login (username/password) to get short-lived token.
  service.post('/projects/:projectId/app-users/login', anonymousEndpoint(
    ({ Projects, VgAppUserAuth, Sessions, Audits }, { body, params }, request) => {
      const { username, password, deviceId, comments } = body;
      if (isBlank(username) || isBlank(password))
        return Problem.user.missingParameters({ expected: ['username', 'password'], got: body });
      const userAgent = request.get('user-agent') || null;

      return Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then(() => vgAuth.login({ VgAppUserAuth, Sessions, Audits }, { username, password, ip: request.ip, userAgent, deviceId, comments, projectId: params.projectId }));
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
    ({ Projects, FieldKeys, Sessions, Audits, VgAppUserAuth }, { auth, params, body }) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
        .then(getOrNotFound)
        .then((fk) => {
          if (auth.actor.map((a) => a.id).orNull() !== fk.actor.id)
            return Problem.user.insufficientRights();
          const currentSession = auth.session.orNull();
          return vgAuth.revokeSessions({ Sessions, Audits, VgAppUserAuth, context: { auth } }, fk.actor.id, currentSession, true, body?.deviceId)
            .then(() => success);
        })
  ));

  // List app-user session history (admin/manager).
  service.get('/projects/:projectId/app-users/:id/sessions', endpoint(
    ({ Projects, FieldKeys, VgAppUserAuth }, { auth, params, queryOptions }, __, response) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => auth.canOrReject('field_key.list', project)
          .then(() => FieldKeys.getByProjectAndActorId(project.id, params.id)))
        .then(getOrNotFound)
        .then((fk) => vgAuth.listSessions({ VgAppUserAuth }, fk.actor.id, queryOptions))
        .then((sessions) => {
          const total = sessions.length !== 0 && Number.isFinite(Number(sessions[0].total_count))
            ? Number(sessions[0].total_count)
            : sessions.length;
          response.set('X-Total-Count', total);
          return sessions.map((s) => ({
          id: s.id,
          createdAt: s.createdAt,
          expiresAt: s.expires_at,
          ip: s.ip,
          userAgent: s.user_agent,
          deviceId: s.device_id,
          comments: s.comments
          }));
        })
  ));

  // List app-user session history for a project (admin/manager).
  service.get('/projects/:projectId/app-users/sessions', endpoint(
    ({ Projects, VgAppUserAuth }, { auth, params, queryOptions }, __, response) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => auth.canOrReject('field_key.list', project))
        .then(() => {
          const options = queryOptions.allowArgs('appUserId', 'dateFrom', 'dateTo');
          const args = options.args || {};
          const filters = {
            projectId: parseIntParam(params.projectId, 'projectId'),
            appUserId: parseIntParam(args.appUserId, 'appUserId'),
            dateFrom: parseDateParam(args.dateFrom, 'dateFrom'),
            dateTo: parseDateParam(args.dateTo, 'dateTo')
          };

          if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo)
            throw Problem.user.invalidEntity({ reason: 'dateFrom must be before dateTo.' });

          return vgAuth.listProjectSessions({ VgAppUserAuth }, filters, options);
        })
        .then((sessions) => {
          const total = sessions.length !== 0 && Number.isFinite(Number(sessions[0].total_count))
            ? Number(sessions[0].total_count)
            : sessions.length;
          response.set('X-Total-Count', total);
          return sessions.map((s) => ({
            id: s.id,
            appUserId: s.appUserId,
            createdAt: s.createdAt,
            expiresAt: s.expires_at,
            ip: s.ip,
            userAgent: s.user_agent,
            deviceId: s.device_id,
            comments: s.comments
          }));
        })
  ));

  // Revoke a single app-user session (admin/manager).
  service.post('/projects/:projectId/app-users/sessions/:sessionId/revoke', endpoint(
    ({ Projects, VgAppUserAuth, Sessions, Audits }, { auth, params }) =>
      Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => auth.canOrReject('session.end', project))
        .then(() => VgAppUserAuth.getSessionById(parsePositiveInt(params.sessionId, 'sessionId')))
        .then(getOrNotFound)
        .then((session) => {
          if (session.projectId !== Number(params.projectId))
            return Problem.user.notFound();
          const revokedBy = auth.actor.orNull();
          return vgAuth.revokeSessionById({ Sessions, VgAppUserAuth, Audits }, session, revokedBy)
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

  // Get session settings (admin).
  service.get('/system/settings', endpoint(
    ({ VgAppUserAuth }, { auth }) =>
      auth.canOrReject('config.read', Config.species)
        .then(() => Promise.all([
          VgAppUserAuth.getSessionTtlDays(),
          VgAppUserAuth.getSessionCap()
        ]))
        .then(([ttl, cap]) => ({ vg_app_user_session_ttl_days: ttl, vg_app_user_session_cap: cap }))
  ));

  // Update session settings (admin).
  service.put('/system/settings', endpoint(
    ({ VgAppUserAuth }, { auth, body }) =>
      auth.canOrReject('config.set', Config.species)
        .then(() => {
          const { vg_app_user_session_ttl_days, vg_app_user_session_cap } = body;
          const ttlDays = parsePositiveInt(vg_app_user_session_ttl_days, 'vg_app_user_session_ttl_days');
          const cap = parsePositiveInt(vg_app_user_session_cap, 'vg_app_user_session_cap');
          const promises = [];
          if (ttlDays != null)
            promises.push(VgAppUserAuth.upsertSetting('vg_app_user_session_ttl_days', ttlDays));
          if (cap != null)
            promises.push(VgAppUserAuth.upsertSetting('vg_app_user_session_cap', cap));
          return Promise.all(promises);
        })
        .then(() => success)
  ));

  // Clear login lockouts (admin).
  service.post('/system/app-users/lockouts/clear', endpoint(
    ({ VgAppUserAuth, Audits }, { auth, body }) =>
      auth.canOrReject('config.set', Config.species)
        .then(() => vgAuth.clearLockout({ VgAppUserAuth, Audits, context: { auth } }, body))
        .then(() => success)
  ));
};
