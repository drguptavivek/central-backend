// Copyright 2017 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

const { getOrReject } = require('../util/promise');
const Problem = require('../util/problem');
const { success } = require('../util/http');
const { SESSION_COOKIE } = require('../http/sessions');
const oidc = require('../util/oidc');
const { pick } = require('ramda');
const vgWebAuth = require('../domain/vg-web-user-auth');

module.exports = (service, endpoint, anonymousEndpoint) => {
  if (!oidc.isEnabled()) {
    service.post('/sessions', anonymousEndpoint((container, requestData, request) =>
      vgWebAuth.login(container, requestData, request)));
  }

  service.get('/sessions/restore', endpoint((_, { auth }) =>
    auth.session
      .map(pick(['createdAt', 'expiresAt']))
      .orElse(Problem.user.notFound())));

  const logOut = (Sessions, auth, session) =>
    auth.canOrReject('session.end', session.actor)
      .then(() => Sessions.terminate(session))
      .then(() => (_, response) => {
        // revoke the cookies associated w the session, if the session was used to
        // terminate itself.
        // TODO: repetitive w above.
        if (session.token === auth.session.map((s) => s.token).orNull()) {
          response.cookie(SESSION_COOKIE, 'null', { path: '/', expires: new Date(0),
            httpOnly: true, secure: true, sameSite: 'strict' });
          response.cookie('__csrf', 'null', { expires: new Date(0),
            secure: true, sameSite: 'strict' });
        }

        return success;
      });

  service.delete('/sessions/current', endpoint(({ Sessions }, { auth }) =>
    auth.session.map(session => logOut(Sessions, auth, session))
      .orElse(Problem.user.notFound())));

  // here we always throw a 403 even if the token doesn't exist to prevent
  // information leakage.
  // TODO: but a timing attack still exists here. :(
  service.delete('/sessions/:token', endpoint(({ Sessions }, { auth, params }) =>
    Sessions.getByBearerToken(params.token)
      .then(getOrReject(Problem.user.insufficientRights()))
      .then(session => logOut(Sessions, auth, session))));
};

