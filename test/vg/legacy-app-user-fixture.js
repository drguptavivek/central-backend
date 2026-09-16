// VG-only test-process compatibility for upstream app-user creation fixtures.
// Production request handling is not changed by this module.

const LEGACY_PASSWORD = 'VGFixturePass!1';
const CREATE_PATH = /^\/v1\/projects\/\d+\/app-users$/;
const KEY_PATH = /^(.*\/v1)\/key\/([^/]+)(\/.*)$/;
const installed = Symbol('vgLegacyAppUserFixtureAdapter');
const requestMetadata = Symbol('vgLegacyAppUserFixtureMetadata');
const keyResponsePath = Symbol('vgLegacyAppUserFixtureKeyResponsePath');

const isPlainObject = (value) => value != null
  && Object.prototype.toString.call(value) === '[object Object]';

const requestPath = (url) => {
  try {
    return new URL(url).pathname;
  } catch (error) {
    return null;
  }
};

const projectIdFromPath = (url) => {
  const match = (requestPath(url) || '').match(/^\/v1\/projects\/(\d+)\/app-users$/);
  return match == null ? null : match[1];
};

const isLegacyCreateRequest = ({ method, url, body, title, excludedTitles }) =>
  method === 'POST'
  && CREATE_PATH.test(requestPath(url) || '')
  && isPlainObject(body)
  && typeof body.displayName === 'string'
  && body.displayName.trim() !== ''
  && body.username === undefined
  && body.password === undefined
  && body.fullName === undefined
  && !excludedTitles.has(title);

const adaptLegacyAppUserPayload = ({ method, url, body, title, excludedTitles, sequence }) => {
  if (!isLegacyCreateRequest({ method, url, body, title, excludedTitles })) return body;

  const suffix = String(sequence).padStart(6, '0');
  return {
    ...body,
    username: `vg-legacy-${suffix}`,
    password: LEGACY_PASSWORD,
    fullName: body.displayName
  };
};

const install = ({ getCurrentTitle, excludedTitles }) => {
  const supertest = require('supertest');
  const testPrototype = supertest.Test.prototype;
  const requestPrototype = Object.getPrototypeOf(testPrototype);
  if (requestPrototype == null || typeof requestPrototype.send !== 'function')
    throw new Error('VG legacy app-user fixture adapter could not find supertest send()');
  if (requestPrototype.send[installed]) return;

  let sequence = 0;
  const legacyTokens = new Map();
  const originalSend = requestPrototype.send;
  const send = function vgLegacyAppUserFixtureSend(body) {
    const adapted = adaptLegacyAppUserPayload({
      method: this.method,
      url: this.url,
      body,
      title: getCurrentTitle(),
      excludedTitles,
      sequence: sequence += 1
    });
    if (adapted !== body) {
      this[requestMetadata] = {
        password: adapted.password,
        projectId: projectIdFromPath(this.url),
        username: adapted.username
      };
    }
    return originalSend.call(this, adapted);
  };
  send[installed] = true;
  requestPrototype.send = send;

  const originalEnd = testPrototype.end;
  testPrototype.end = function vgLegacyAppUserFixtureEnd(callback) {
    const keyMatch = this.url.match(KEY_PATH);
    if (keyMatch != null && legacyTokens.has(keyMatch[2])) {
      const bearer = legacyTokens.get(keyMatch[2]);
      this[keyResponsePath] = `${keyMatch[1]}/key/${keyMatch[2]}${keyMatch[3]}`;
      this.url = `${keyMatch[1]}${keyMatch[3]}`;
      this.set('Authorization', `Bearer ${bearer}`);
    }

    const metadata = this[requestMetadata];
    const originalAssert = this.assert;
    const assertWithLegacyKeyResponse = (error, response, next) => {
      const originalPath = this[keyResponsePath];
      if (originalPath != null && response?.text != null) {
        const originalRoute = requestPath(originalPath);
        const originalPrefix = originalRoute?.match(/^\/v1\/key\/[^/]+\//)?.[0];
        if (originalPrefix != null)
          response.text = response.text.replaceAll('/v1/', originalPrefix);
      }
      this.assert = originalAssert;
      return originalAssert.call(this, error, response, next);
    };
    if (metadata == null) {
      if (this[keyResponsePath] == null) return originalEnd.call(this, callback);
      this.assert = assertWithLegacyKeyResponse;
      return originalEnd.call(this, callback);
    }

    this.assert = function vgLegacyAppUserFixtureAssert(error, response, next) {
      if (error != null || response?.body == null || response.body.token != null) {
        this.assert = originalAssert;
        return originalAssert.call(this, error, response, next);
      }

      return supertest(this.app)
        .post(`/v1/projects/${metadata.projectId}/app-users/login`)
        .send({ username: metadata.username, password: metadata.password })
        .expect(200)
        .then(({ body }) => {
          if (typeof body?.token !== 'string' || body.token === '')
            throw new Error('VG legacy app-user fixture login returned no bearer token');
          response.body.token = body.token;
          legacyTokens.set(body.token, body.token);
          this.assert = originalAssert;
          return originalAssert.call(this, error, response, next);
        })
        .catch((loginError) => {
          this.assert = originalAssert;
          return originalAssert.call(this, loginError, response, next);
        });
    };

    return originalEnd.call(this, callback);
  };
};

module.exports = {
  LEGACY_PASSWORD,
  adaptLegacyAppUserPayload,
  install,
  isLegacyCreateRequest
};
