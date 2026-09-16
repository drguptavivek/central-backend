const assert = require('node:assert/strict');

const { recordSession } = require('../../../../lib/model/query/vg-app-user-auth');

describe('VG app-user session query', () => {
  it('requires a non-null expiry when recording a session', () => {
    for (const expiresAt of [ undefined, null ]) {
      assert.throws(
        () => recordSession({ token: 'token', actorId: 1, expiresAt })({ run: () => {} }),
        /recordSession: expiresAt is required/
      );
    }
  });
});
