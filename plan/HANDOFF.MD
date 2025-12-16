I couldn’t complete the last edits due to filesystem
  permission/tooling issues, but here’s a concise
  handoff so you can resume.

  ## Current state

  - Repo: /Users/vivekgupta/workspace/ODK/central with
    submodule server on master at commit 70ea57e9 (vg
    changes pushed).
  - Stack: Docker compose up with --profile central;
    Postgres, Redis, etc. are running. Service is bind-
    mounted to ./server and nodemon is active.
  - Test DB: odk_integration_test exists with vg tables
    (applied via server/plan/sql/vg_app_user_auth.sql).
    Test user odk_test_user and DB were created earlier.

  ## Tests

  - Unit vg-password passed:

    docker compose -f docker-compose.yml -f docker-
  compose.override.yml -f docker-compose.dev.yml
  --profile central exec service sh -lc 'cd /usr/odk &&
  NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha test/
  unit/util/vg-password.js'
  - Integration vg-app-user-auth currently failing
    2 assertions:
      - should create app users without long-lived
        sessions... -> login.token undefined; .should
        on undefined.
      - should allow password change... ->
        loginAfter.token.should.be.a.token is not
        a function (token missing or not using
        assertions).

  ## Likely fixes

  - Import custom assertions in test/integration/api/vg-
    app-user-auth.js so token assertion exists:

    const should = require('should');
    require('../assertions'); // add this
  - Ensure login response returns { token, projectId }
    as expected; if route returns { token } only, adjust
    the test to check for presence instead of .should
    on undefined.
  - For the second failure, ensure loginAfter.token
    exists before calling .should.be.a.token(). If the
    API returns no token, adjust expectations.

  ## Useful commands

  - Run integration test:

    docker compose -f docker-compose.yml -f docker-
  compose.override.yml -f docker-compose.dev.yml
  --profile central exec service sh -lc 'cd /usr/odk
  && NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha
  --recursive test/integration/api/vg-app-user-auth.js'
  - Service logs:

    docker compose -f docker-compose.yml -f docker-
  compose.override.yml -f docker-compose.dev.yml
  --profile central logs -f service

  ## Files to edit

  - server/lib/model/query/vg-app-user-auth.js (already
    fixed import; currently const { Frame, readable,
    table, embedded } = require('../frame'); at top).
  - server/test/integration/api/vg-app-user-auth.js (add
    assertions require, adjust expectations).

  ## Caution

  - Filesystem edits from host were blocked earlier
    (Operation not permitted); if that persists, edit
    via docker compose ... exec service sh inside
    container or adjust macOS permissions.

  This should get you to green tests. If permissions
  block host edits, open a shell in the service
  container and edit /usr/odk/test/integration/api/vg-
  app-user-auth.js directly.