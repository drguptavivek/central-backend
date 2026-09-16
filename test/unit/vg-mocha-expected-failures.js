const assert = require('node:assert/strict');

const { createExpectedFailureHooks } = require('../vg/mocha-expected-failures');

const entry = (fullTitle, failureMessage = 'expected failure') => ({
  fullTitle,
  failureMessage,
  reason: 'VG test harness contract'
});

const testWithResult = (fullTitle, result) => ({
  fullTitle: () => fullTitle,
  fn: () => result
});

const installHook = (runtime, test) => {
  runtime.hooks.beforeEach.call({ currentTest: test });
  return test.fn;
};

const runMatchingFailure = async (runtime, title, failureMessage = 'expected failure') => {
  const test = testWithResult(title, Promise.reject(new Error(failureMessage)));
  let skipped = false;
  await installHook(runtime, test).call({ skip: () => { skipped = true; } });
  runtime.hooks.afterEach();
  return skipped;
};

describe('VG expected-failure Mocha hooks', () => {
  it('records one matching rejection and accepts the exact-once result', async () => {
    const title = 'suite: expected rejection';
    const runtime = createExpectedFailureHooks([entry(title, 'contract failure')]);
    const skipped = await runMatchingFailure(runtime, title, 'contract failure');

    assert.equal(skipped, true);
    assert.equal(runtime.observedFailures.get(title), 1);
    assert.doesNotThrow(() => runtime.hooks.afterAll());
  });

  it('fails teardown when a declaration is stale or renamed', () => {
    const runtime = createExpectedFailureHooks([entry('suite: old title')]);
    const test = testWithResult('suite: renamed title', Promise.resolve());

    installHook(runtime, test);

    assert.throws(
      () => runtime.hooks.afterAll(),
      /not observed: suite: old title/
    );
  });

  it('fails teardown when a declared failure is observed more than once', () => {
    const title = 'suite: duplicate execution';
    const runtime = createExpectedFailureHooks([entry(title)]);

    return runMatchingFailure(runtime, title)
      .then(() => runMatchingFailure(runtime, title))
      .then(() => assert.throws(
        () => runtime.hooks.afterAll(),
        /observed 2 times: suite: duplicate execution/
      ));
  });

  it('fails the test when a declared failure unexpectedly passes', async () => {
    const title = 'suite: unexpected pass';
    const runtime = createExpectedFailureHooks([entry(title)]);
    const test = testWithResult(title, Promise.resolve());

    await assert.rejects(
      installHook(runtime, test).call({ skip() {} }),
      /VG expected failure unexpectedly passed: suite: unexpected pass/
    );
  });

  it('propagates an unexpected failure instead of reclassifying it', async () => {
    const title = 'suite: wrong failure';
    const runtime = createExpectedFailureHooks([entry(title, 'expected text')]);
    const test = testWithResult(title, Promise.reject(new Error('different failure')));

    await assert.rejects(
      installHook(runtime, test).call({ skip() {} }),
      /different failure/
    );
    assert.equal(runtime.observedFailures.get(title), 0);
  });

  it('leaves an undeclared failing test untouched', async () => {
    const runtime = createExpectedFailureHooks([entry('suite: declared')]);
    const original = () => Promise.reject(new Error('undeclared failure'));
    const test = { fullTitle: () => 'suite: undeclared', fn: original };

    installHook(runtime, test);

    assert.equal(test.fn, original);
    await assert.rejects(test.fn(), /undeclared failure/);
  });
});
