// VG-only Mocha wiring for upstream tests that assert the removed long-lived
// app-user field-key session contract.
require('../assertions');

const manifest = require('./expected-failures.json');
const legacyFixture = require('./legacy-app-user-fixture');

const buildExpectedFailures = (entries) => {
  const expectedFailures = new Map();
  entries.forEach((entry) => {
    if (typeof entry.fullTitle !== 'string' || entry.fullTitle.length === 0)
      throw new Error('VG expected-failure entries require an exact fullTitle');
    if (typeof entry.failureMessage !== 'string' || entry.failureMessage.length === 0)
      throw new Error(`VG expected-failure entry has no failure message: ${entry.fullTitle}`);
    if (typeof entry.reason !== 'string' || entry.reason.length === 0)
      throw new Error(`VG expected-failure entry has no reason: ${entry.fullTitle}`);
    if (expectedFailures.has(entry.fullTitle))
      throw new Error(`Duplicate VG expected-failure title: ${entry.fullTitle}`);
    expectedFailures.set(entry.fullTitle, entry);
  });
  return expectedFailures;
};

const unexpectedPass = (title, reason) => new Error(
  `VG expected failure unexpectedly passed: ${title}\nReason: ${reason}`
);

const isExpectedFailure = (error, expected) =>
  typeof error?.message === 'string' && error.message.includes(expected.failureMessage);

const assertExpectedFailuresObserved = (expectedFailures, observedFailures) => {
  const missing = [];
  const repeated = [];

  expectedFailures.forEach((_, title) => {
    const count = observedFailures.get(title) || 0;
    if (count === 0) missing.push(title);
    else if (count !== 1) repeated.push({ count, title });
  });

  if (missing.length === 0 && repeated.length === 0) return;

  const details = [
    ...missing.map((title) => `not observed: ${title}`),
    ...repeated.map(({ count, title }) => `observed ${count} times: ${title}`)
  ];
  throw new Error(`VG expected failures must be observed exactly once:\n${details.join('\n')}`);
};

const createExpectedFailureHooks = (entries, onCurrentTitle = () => {}) => {
  const expectedFailures = buildExpectedFailures(entries);
  const observedFailures = new Map(
    [...expectedFailures.keys()].map((title) => [title, 0])
  );
  let currentTestTitle;

  const observeExpectedFailure = (title) => {
    observedFailures.set(title, observedFailures.get(title) + 1);
  };

  const hooks = {
    beforeEach() {
      const test = this.currentTest;
      currentTestTitle = test.fullTitle();
      onCurrentTitle(currentTestTitle);
      const expected = expectedFailures.get(currentTestTitle);
      if (expected == null) return;

      const original = test.fn;
      // All currently allowlisted tests use testService and return a Promise.
      // Keep the wrapper deliberately narrow so callback-style tests cannot be
      // silently reclassified by this hook.
      if (original.length !== 0)
        throw new Error(`VG expected-failure test must be promise-style: ${currentTestTitle}`);

      const title = currentTestTitle;
      test.fn = function vgExpectedFailureWrapper() {
        let result;
        try {
          result = original.call(this);
        } catch (error) {
          if (!isExpectedFailure(error, expected)) throw error;
          observeExpectedFailure(title);
          this.skip();
          return undefined;
        }

        if (result == null || typeof result.then !== 'function')
          throw unexpectedPass(title, expected.reason);

        return result.then(
          () => { throw unexpectedPass(title, expected.reason); },
          (error) => {
            if (!isExpectedFailure(error, expected)) throw error;
            observeExpectedFailure(title);
            this.skip();
          }
        );
      };
    },
    afterEach() {
      currentTestTitle = undefined;
      onCurrentTitle(undefined);
    },
    afterAll() {
      assertExpectedFailuresObserved(expectedFailures, observedFailures);
    }
  };

  return {
    excludedTitles: new Map(
      [...expectedFailures].filter(([, entry]) => entry.adaptLegacyFixture !== true)
    ),
    hooks,
    observedFailures
  };
};

let currentTestTitle;
const runtime = createExpectedFailureHooks(manifest, (title) => {
  currentTestTitle = title;
});

runtime.hooks.beforeAll = () => legacyFixture.install({
  getCurrentTitle: () => currentTestTitle,
  excludedTitles: runtime.excludedTitles
});

exports.mochaHooks = runtime.hooks;
exports.assertExpectedFailuresObserved = assertExpectedFailuresObserved;
exports.createExpectedFailureHooks = createExpectedFailureHooks;
