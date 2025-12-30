const assert = require('node:assert/strict');
const appRoot = require('app-root-path');
const Problem = require(appRoot + '/lib/util/problem');
const { revokeSessions } = require(appRoot + '/lib/domain/vg-app-user-auth');

describe('domain/vg-app-user-auth', () => {
  it('should reject self revoke when current session is missing', async () => {
    const container = { Sessions: {}, VgAppUserAuth: null };
    await assert.rejects(
      () => revokeSessions(container, 1, null, true),
      (err) => err instanceof Problem && err.problemCode === Problem.user.authenticationFailed().problemCode
    );
  });
});
