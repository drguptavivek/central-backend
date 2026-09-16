const assert = require('node:assert');
const { LEGACY_PASSWORD,
  adaptLegacyAppUserPayload,
  isLegacyCreateRequest } = require('../vg/legacy-app-user-fixture');

const request = {
  method: 'POST',
  url: 'http://127.0.0.1/v1/projects/42/app-users'
};

describe('VG legacy app-user fixture adapter', () => {
  it('adds deterministic valid credentials only to a legacy create payload', () => {
    const body = { displayName: 'david', properties: { region: 'north' } };
    const adapted = adaptLegacyAppUserPayload({
      ...request,
      body,
      title: 'unlisted test',
      excludedTitles: new Set(),
      sequence: 7
    });

    assert.deepStrictEqual(adapted, {
      ...body,
      username: 'vg-legacy-000007',
      password: LEGACY_PASSWORD,
      fullName: 'david'
    });
    assert.deepStrictEqual(body, { displayName: 'david', properties: { region: 'north' } });
  });

  it('leaves secure payloads, unrelated routes, and excluded titles untouched', () => {
    const body = { displayName: 'david' };
    const excludedTitles = new Set(['secure-contract test']);
    const cases = [
      { ...request, body: { ...body, username: 'david', password: LEGACY_PASSWORD } },
      { ...request, url: 'http://127.0.0.1/v1/projects/42/app-users/1', body },
      { ...request, method: 'PATCH', body },
      { ...request, body, title: 'secure-contract test' }
    ];

    cases.forEach((candidate) => {
      assert.strictEqual(isLegacyCreateRequest({
        ...candidate,
        excludedTitles,
        sequence: 1
      }), false);
      assert.strictEqual(adaptLegacyAppUserPayload({
        ...candidate,
        excludedTitles,
        sequence: 1
      }), candidate.body);
    });
  });

});
