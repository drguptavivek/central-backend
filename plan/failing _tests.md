
  1) api: /projects/:id/app-users
       POST
         should return the created key:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:17:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  2) api: /projects/:id/app-users
       POST
         should allow project managers to create:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:27:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  3) api: /projects/:id/app-users
       POST
         should not allow the created user any form access:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:33:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  4) api: /projects/:id/app-users
       POST
         should create a long session:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:44:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  5) api: /projects/:id/app-users
       POST
         should log the action in the audit log:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:56:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  6) api: /projects/:id/app-users
       GET
         should return a list of tokens in order with merged data:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:73:82
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  7) api: /projects/:id/app-users
       GET
         should only return tokens from the requested project:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:88:82
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  8) api: /projects/:id/app-users
       GET
         should leave tokens out if the session is ended:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:103:87
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  9) api: /projects/:id/app-users
       GET
         should sort revoked field keys to the bottom:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:116:82
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  10) api: /projects/:id/app-users
       GET
         should join through additional data if extended metadata is requested:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:130:82
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  11) api: /projects/:id/app-users
       GET
         should correctly report last used in extended metadata:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:143:82
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  12) api: /projects/:id/app-users
       GET
         should sort revoked field keys to the bottom in extended metadata:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:164:82
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  13) api: /projects/:id/app-users
       /:id DELETE
         should return 403 unless the user can delete:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:181:85
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  14) api: /projects/:id/app-users
       /:id DELETE
         should delete the token:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:187:85
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  15) api: /projects/:id/app-users
       /:id DELETE
         should allow project managers to delete:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:195:83
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  16) api: /projects/:id/app-users
       /:id DELETE
         should delete assignments on the token:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:200:85
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  17) api: /projects/:id/app-users
       /:id DELETE
         should only delete the token if it is part of the project:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:216:14
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  18) api: /projects/:id/app-users
       /:id DELETE
         should log the action in the audit log:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:222:85
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  19) api: /key/:key
       should passthrough to the appropriate route with successful auth:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:249:12
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  20) api: /key/:key
       should not be able access closed forms and its sub-resources:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/app-users.js:263:8
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  21) api: /projects/:id/assignments/forms
       GET
         should return all assignments on forms:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/assignments.js:21:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  22) api: /projects/:id/assignments/forms
       GET
         should return extended assignments on forms:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/assignments.js:21:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  23) api: /projects/:id/assignments/forms
       /:roleId GET
         should return filtered assignments on forms:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/assignments.js:21:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  24) api: /projects/:id/assignments/forms
       /:roleId GET
         should return filtered extended assignments on forms:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/assignments.js:21:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  25) api: /projects/:projectId/forms/:xmlFormId/assignments
       should return all form assignments:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/assignments.js:545:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  26) api: /projects/:projectId/forms/:xmlFormId/assignments
       should return all form assignments for a role:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/assignments.js:561:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  27) api: /projects/:projectId/forms/:xmlFormId/assignments
       should delete assignments:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/assignments.js:579:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  28) /audits
       GET
         audit logs of deleted and purged actees
           should get the deletedAt date of a deleted app user:
     TypeError: Cannot read properties of undefined (reading 'actee')
      at /usr/odk/test/integration/api/audits.js:807:44
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  29) datasets and entities
       GET /datasets/:name/integrity
         should return data for app-user with access to consuming Form:
     Error: expected 200 "OK", got 401 "Unauthorized"
      at /usr/odk/test/integration/api/datasets.js:6809:10
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/datasets.js:38:3)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  30) datasets and entities
       GET /datasets/:name/integrity
         should reject for app-user if consuming Form is closed:
     Error: expected 200 "OK", got 500 "Internal Server Error"
      at /usr/odk/test/integration/api/datasets.js:6832:10
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/datasets.js:38:3)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  31) api: /projects/:id/forms (delete, restore)
       /:id DELETE
         should not return associated assignments for a deleted form:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/forms/delete-restore.js:43:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  32) api: /projects/:id/forms (delete, restore)
       /:id DELETE
         should not return associated assignments for a specific role for a deleted form:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/forms/delete-restore.js:64:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  33) api: /projects/:id/forms (delete, restore)
       /:id/restore (undeleting trashed forms)
         restoring access to undeleted forms
           should restore app user submission access:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/forms/delete-restore.js:201:16
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  34) api: /projects/:id/forms (delete, restore)
       /:id/restore (undeleting trashed forms)
         restoring access to undeleted forms
           should not be able to access assignments of deleted form thru the form:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/forms/delete-restore.js:223:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  35) api: /projects/:id/forms (drafts)
       /:id/draft
         /attachments
           /:name POST
             should upload form definition and form attachment with cookie auth:
     Error: expected 200 "OK", got 401 "Unauthorized"
      at Context.<anonymous> (test/integration/api/forms/draft.js:2125:14)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  36) api: /projects/:id/forms (listing forms)
       ../formList GET
         should return auth-filtered results for app users:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/forms/list.js:194:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  37) api: /projects/:id/forms (listing forms)
       ../formList GET
         should prefix returned routes for app users:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/forms/list.js:222:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  38) api: /datasets/:name.svc
       GET /Entities
         should return nextURL:

      AssertionError: expected 'https://central.local/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24skiptoken=01eyJ1dWlkIjoiMzIzYTlmY2ItYTFiNS00OWYyLWFiYzAtMTEwZGU4ZGMzMGE0In0%3D' to be 'http://localhost:8989/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24skiptoken=01eyJ1dWlkIjoiMzIzYTlmY2ItYTFiNS00OWYyLWFiYzAtMTEwZGU4ZGMzMGE0In0%3D'
      + expected - actual

      -https://central.local/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24skiptoken=01eyJ1dWlkIjoiMzIzYTlmY2ItYTFiNS00OWYyLWFiYzAtMTEwZGU4ZGMzMGE0In0%3D
      +http://localhost:8989/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24skiptoken=01eyJ1dWlkIjoiMzIzYTlmY2ItYTFiNS00OWYyLWFiYzAtMTEwZGU4ZGMzMGE0In0%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata-entities.js:236:45
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata-entities.js:229:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  39) api: /datasets/:name.svc
       GET /Entities
         should not duplicate or skip entities - opaque cursor:

      AssertionError: expected 'https://central.local/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24count=true&%24skiptoken=01eyJ1dWlkIjoiY2MxMDNjYWItN2UwMi00MjVjLWE5NDQtN2ZhZWNiMTFjNTBmIn0%3D' to be 'http://localhost:8989/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24count=true&%24skiptoken=01eyJ1dWlkIjoiY2MxMDNjYWItN2UwMi00MjVjLWE5NDQtN2ZhZWNiMTFjNTBmIn0%3D'
      + expected - actual

      -https://central.local/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24count=true&%24skiptoken=01eyJ1dWlkIjoiY2MxMDNjYWItN2UwMi00MjVjLWE5NDQtN2ZhZWNiMTFjNTBmIn0%3D
      +http://localhost:8989/v1/projects/1/datasets/people.svc/Entities?%24top=1&%24count=true&%24skiptoken=01eyJ1dWlkIjoiY2MxMDNjYWItN2UwMi00MjVjLWE5NDQtN2ZhZWNiMTFjNTBmIn0%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata-entities.js:258:45
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata-entities.js:250:24)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  40) api: /datasets/:name.svc
       GET /Entities
         should not return deleted entities - opaque cursor:

      AssertionError: expected 'https://central.local/v1/projects/1/datasets/people.svc/Entities?%24top=2&%24count=true&%24skiptoken=01eyJ1dWlkIjoiN2RmOTMwMDAtZDUyNi00ZDQ3LWFlZTQtOGE5NWZiYjY4NDJjIn0%3D' to be 'http://localhost:8989/v1/projects/1/datasets/people.svc/Entities?%24top=2&%24count=true&%24skiptoken=01eyJ1dWlkIjoiN2RmOTMwMDAtZDUyNi00ZDQ3LWFlZTQtOGE5NWZiYjY4NDJjIn0%3D'
      + expected - actual

      -https://central.local/v1/projects/1/datasets/people.svc/Entities?%24top=2&%24count=true&%24skiptoken=01eyJ1dWlkIjoiN2RmOTMwMDAtZDUyNi00ZDQ3LWFlZTQtOGE5NWZiYjY4NDJjIn0%3D
      +http://localhost:8989/v1/projects/1/datasets/people.svc/Entities?%24top=2&%24count=true&%24skiptoken=01eyJ1dWlkIjoiN2RmOTMwMDAtZDUyNi00ZDQ3LWFlZTQtOGE5NWZiYjY4NDJjIn0%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata-entities.js:297:45
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata-entities.js:288:24)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  41) api: /datasets/:name.svc
       GET /Entities
         should return only searched entities with pagination:
     TypeError: Invalid URL
      at new URL (node:internal/url:827:25)
      at Request.request (node_modules/superagent/lib/node/index.js:678:15)
      at Request.end (node_modules/superagent/lib/node/index.js:909:8)
      at Test.end (node_modules/supertest/lib/test.js:136:11)
      at /usr/odk/node_modules/superagent/lib/request-base.js:265:12
      at new Promise (<anonymous>)
      at RequestBase.then (node_modules/superagent/lib/request-base.js:249:31)
      at Context.<anonymous> (test/integration/api/odata-entities.js:472:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  42) api: /datasets/:name.svc
       GET /Entities
         should return filtered entities with pagination:
     TypeError: Invalid URL
      at new URL (node:internal/url:827:25)
      at Request.request (node_modules/superagent/lib/node/index.js:678:15)
      at Request.end (node_modules/superagent/lib/node/index.js:909:8)
      at Test.end (node_modules/supertest/lib/test.js:136:11)
      at /usr/odk/node_modules/superagent/lib/request-base.js:265:12
      at new Promise (<anonymous>)
      at RequestBase.then (node_modules/superagent/lib/request-base.js:249:31)
      at Context.<anonymous> (test/integration/api/odata-entities.js:564:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  43) api: /datasets/:name.svc
       GET service document
         should return service document:

      AssertionError: expected Object {
  '@odata.context': 'https://central.local/v1/projects/1/datasets/people.svc/$metadata',
  value: Array [
    Object { name: 'Entities', kind: 'EntitySet', url: 'Entities' }
  ]
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/datasets/people.svc/$metadata',
  value: Array [
    Object { name: 'Entities', kind: 'EntitySet', url: 'Entities' }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/datasets/people.svc/$metadata' and B has 'http://localhost:8989/v1/projects/1/datasets/people.svc/$metadata')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/datasets/people.svc/$metadata"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/datasets/people.svc/$metadata"
         "value": [
           {
             "kind": "EntitySet"
             "name": "Entities"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata-entities.js:910:26
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata-entities.js:907:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  44) api: /forms/:id.svc
       GET
         should return an OData service document:

      AssertionError: expected Object {
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' },
    Object {
      name: 'Submissions.children.child',
      kind: 'EntitySet',
      url: 'Submissions.children.child'
    }
  ]
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' },
    Object {
      name: 'Submissions.children.child',
      kind: 'EntitySet',
      url: 'Submissions.children.child'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata"
         "value": [
           {
             "kind": "EntitySet"
             "name": "Submissions"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:50:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  45) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return a single row result:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'double' },
      name: 'Vick',
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      __id: 'double',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: 'testid',
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'double',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: 'testid',
        edits: 0,
        formVersion: '1.0'
      },
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      meta: Object { instanceID: 'double' },
      name: 'Vick'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "double"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:152:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  46) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return a single encrypted frame (no formdata):

      AssertionError: expected Object {
  value: Array [
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 2,
        status: 'missingEncryptedFormData',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 2,
        status: 'missingEncryptedFormData',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "uuid:dcf4a151-5088-453f-99e6-369d67828f7a"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:222:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  47) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return a single encrypted frame (has formdata):

      AssertionError: expected Object {
  value: Array [
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 1,
        attachmentsExpected: 2,
        status: 'notDecrypted',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 1,
        attachmentsExpected: 2,
        status: 'notDecrypted',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "uuid:dcf4a151-5088-453f-99e6-369d67828f7a"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:261:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  48) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return subtable results:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Alice',
      toys: Object {},
      __id: '46ebf42ee83ddec5028c42b2c054402d1e700208',
      '__Submissions-id': 'double'
    },
    Object {
      name: 'Bob',
      toys: Object {
        'toy@odata.navigationLink': 'Submissions(\'double\')/children/child(\'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d\')/toys/toy'
      },
      __id: 'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d',
      '__Submissions-id': 'double'
    },
    Object {
      name: 'Chelsea',
      toys: Object {
        'toy@odata.navigationLink': 'Submissions(\'double\')/children/child(\'8954b393f82c1833abb19be08a3d6cb382171f54\')/toys/toy'
      },
      __id: '8954b393f82c1833abb19be08a3d6cb382171f54',
      '__Submissions-id': 'double'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child',
  value: Array [
    Object {
      __id: '46ebf42ee83ddec5028c42b2c054402d1e700208',
      '__Submissions-id': 'double',
      name: 'Alice',
      toys: Object {}
    },
    Object {
      __id: 'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d',
      '__Submissions-id': 'double',
      name: 'Bob',
      toys: Object {
        'toy@odata.navigationLink': 'Submissions(\'double\')/children/child(\'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d\')/toys/toy'
      }
    },
    Object {
      __id: '8954b393f82c1833abb19be08a3d6cb382171f54',
      '__Submissions-id': 'double',
      name: 'Chelsea',
      toys: Object {
        'toy@odata.navigationLink': 'Submissions(\'double\')/children/child(\'8954b393f82c1833abb19be08a3d6cb382171f54\')/toys/toy'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
         "value": [
           {
             "__Submissions-id": "double"
             "__id": "46ebf42ee83ddec5028c42b2c054402d1e700208"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:288:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  49) api: /forms/:id.svc
       /Submissions(id)/… GET
         should limit and offset subtable results:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Bob',
      toys: Object {
        'toy@odata.navigationLink': 'Submissions(\'double\')/children/child(\'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d\')/toys/toy'
      },
      __id: 'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d',
      '__Submissions-id': 'double'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child',
  '@odata.nextLink': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/Submissions(\'double\')/children/child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6ImI2ZTkzYTgxYTUzZWVkMDU2NmU2NWU0NzJkNGE0YjlhZTM4M2VlNmQifQ%3D%3D'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child',
  '@odata.nextLink': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/Submissions(\'double\')/children/child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6ImI2ZTkzYTgxYTUzZWVkMDU2NmU2NWU0NzJkNGE0YjlhZTM4M2VlNmQifQ%3D%3D',
  value: Array [
    Object {
      __id: 'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d',
      '__Submissions-id': 'double',
      name: 'Bob',
      toys: Object {
        'toy@odata.navigationLink': 'Submissions(\'double\')/children/child(\'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d\')/toys/toy'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
      -  "@odata.nextLink": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/Submissions('double')/children/child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6ImI2ZTkzYTgxYTUzZWVkMDU2NmU2NWU0NzJkNGE0YjlhZTM4M2VlNmQifQ%3D%3D"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.nextLink": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/Submissions('double')/children/child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6ImI2ZTkzYTgxYTUzZWVkMDU2NmU2NWU0NzJkNGE0YjlhZTM4M2VlNmQifQ%3D%3D"
         "value": [
           {
             "__Submissions-id": "double"
             "__id": "b6e93a81a53eed0566e65e472d4a4b9ae383ee6d"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:318:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  50) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return just a count if asked:

      AssertionError: expected Object {
  value: Array [],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child',
  '@odata.count': 3
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child',
  '@odata.count': 3,
  value: Array []
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
         "@odata.count": 3
         "value": []
       }
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:338:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  51) api: /forms/:id.svc
       /Submissions(id)/… GET
         should gracefully degrade on encrypted subtables:

      AssertionError: expected Object {
  value: Array [],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child',
  value: Array []
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
         "value": []
       }
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:362:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  52) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return mixed encoded/decoded URLs as supplied:
     AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'uuid:17b09e96-4141-43f5-9a70-611eb0e8f6b4' },
      name: 'Vick',
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'uuid%3A17b09e96-4141-43f5-9a70-611eb0e8f6b4\')/children/child'
      },
      __id: 'uuid:17b09e96-4141-43f5-9a70-611eb0e8f6b4',
      __system: Object {
        submissionDate: '2025-12-16T19:02:21.841Z',
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/double%20repeat.svc/$metadata#Submissions'
} to contain Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/double%20repeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'uuid%3A17b09e96-4141-43f5-9a70-611eb0e8f6b4\')/children/child'
      }
    }
  ]
}
    expected 'https://central.local/v1/projects/1/forms/double%20repeat.svc/$metadata#Submissions' to contain 'http://localhost:8989/v1/projects/1/forms/double%20repeat.svc/$metadata#Submissions'
        expected 'https://central.local/v1/projects/1/forms/double%20repeat.svc/$metadata#Submissions' to be 'http://localhost:8989/v1/projects/1/forms/double%20repeat.svc/$metadata#Submissions'
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value [as containDeep] (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:390:31
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Promise.all (index 0)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  53) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return a single row result with all properties:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'double' },
      name: 'Vick',
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      __id: 'double',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: 'testid',
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'double',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: 'testid',
        edits: 0,
        formVersion: '1.0'
      },
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      meta: Object { instanceID: 'double' },
      name: 'Vick'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "double"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:416:46
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  54) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return a single row result with selected properties:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'double' },
      name: 'Vick',
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      __id: 'double',
      __system: Object { status: null }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'double',
      __system: Object { status: null },
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      meta: Object { instanceID: 'double' },
      name: 'Vick'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "double"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:452:46
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  55) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return a single row result with all system properties:

      AssertionError: expected Object {
  value: Array [
    Object {
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: 'testid',
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: 'testid',
        edits: 0,
        formVersion: '1.0'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__system": {
               "attachmentsExpected": 0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:478:46
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  56) api: /forms/:id.svc
       /Submissions(id)/… GET
         should return subtable results with selected properties:

      AssertionError: expected Object {
  value: Array [
    Object { name: 'Rainbow Dash' },
    Object { name: 'Rarity' },
    Object { name: 'Fluttershy' },
    Object { name: 'Princess Luna' }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child.toys.toy'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child.toys.toy',
  value: Array [
    Object { name: 'Rainbow Dash' },
    Object { name: 'Rarity' },
    Object { name: 'Fluttershy' },
    Object { name: 'Princess Luna' }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child.toys.toy' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child.toys.toy')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child.toys.toy"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child.toys.toy"
         "value": [
           {
             "name": "Rainbow Dash"
           }
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:504:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  57) api: /forms/:id.svc
       /Submissions(id)/… GET
         should not return parent IDs if __id is selected:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Alice',
      __id: '46ebf42ee83ddec5028c42b2c054402d1e700208'
    },
    Object { name: 'Bob', __id: 'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d' },
    Object {
      name: 'Chelsea',
      __id: '8954b393f82c1833abb19be08a3d6cb382171f54'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child',
  value: Array [
    Object {
      __id: '46ebf42ee83ddec5028c42b2c054402d1e700208',
      name: 'Alice'
    },
    Object { __id: 'b6e93a81a53eed0566e65e472d4a4b9ae383ee6d', name: 'Bob' },
    Object {
      __id: '8954b393f82c1833abb19be08a3d6cb382171f54',
      name: 'Chelsea'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
         "value": [
           {
             "__id": "46ebf42ee83ddec5028c42b2c054402d1e700208"
             "name": "Alice"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:523:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  58) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return toplevel rows:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      },
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    },
    Object {
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      },
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    },
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      }
    },
    Object {
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      }
    },
    Object {
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rthree"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:592:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  59) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should exclude a deleted submission from rows:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      },
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    },
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      }
    },
    Object {
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rtwo"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:670:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  60) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return deleted submission:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      },
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rthree"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:730:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  61) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return subtable results:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Candace',
      age: 2,
      __id: '32809ae2b3dc404ea292205eb884b21fa4e9acc5',
      '__Submissions-id': 'rthree'
    },
    Object {
      name: 'Billy',
      age: 4,
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c',
      '__Submissions-id': 'rtwo'
    },
    Object {
      name: 'Blaine',
      age: 6,
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3',
      '__Submissions-id': 'rtwo'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child',
  value: Array [
    Object {
      __id: '32809ae2b3dc404ea292205eb884b21fa4e9acc5',
      '__Submissions-id': 'rthree',
      name: 'Candace',
      age: 2
    },
    Object {
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c',
      '__Submissions-id': 'rtwo',
      name: 'Billy',
      age: 4
    },
    Object {
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3',
      '__Submissions-id': 'rtwo',
      name: 'Blaine',
      age: 6
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
         "value": [
           {
             "__Submissions-id": "rthree"
             "__id": "32809ae2b3dc404ea292205eb884b21fa4e9acc5"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:769:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  62) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should limit and offset toplevel rows:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      },
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  '@odata.nextLink': 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  '@odata.nextLink': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9',
  value: Array [
    Object {
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      -  "@odata.nextLink": "https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.nextLink": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9"
         "value": [
           {
             "__id": "rtwo"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:796:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  63) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should limit Submissions:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:839:45
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:832:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  64) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should ignore $skip when $skipToken is given:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:858:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:846:24)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  65) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should have no impact on skipToken when a new submission is created:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=2&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=2&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=2&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=2&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnR3byJ9
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:888:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:875:24)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  66) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should limit and filter Submissions:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24filter=not+__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24filter=not+__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24filter=not+__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24filter=not+__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1028:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1021:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  67) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should limit and return selected fields of Submissions:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24select=age&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24select=age&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24select=age&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24select=age&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1041:45
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1035:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  68) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should provide toplevel row count if requested:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      },
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  '@odata.nextLink': 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24count=true&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D',
  '@odata.count': 3
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  '@odata.nextLink': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24count=true&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D',
  '@odata.count': 3,
  value: Array [
    Object {
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "@odata.count": 3
      -  "@odata.nextLink": "https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24count=true&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D"
      +  "@odata.nextLink": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions?%24top=1&%24count=true&%24skiptoken=01eyJpbnN0YW5jZUlkIjoicnRocmVlIn0%3D"
         "value": [
           {
             "__id": "rthree"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1052:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  69) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return id-filtered toplevel rows if requested:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rone"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1106:29
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  70) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return submitter-filtered toplevel rows if requested:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      },
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    },
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      }
    },
    Object {
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rthree"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1213:29
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  71) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return submissionDate-filtered toplevel rows if requested:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        submissionDate: '2010-06-01T00:00:00.000Z',
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rone',
      __system: Object {
        submissionDate: '2010-06-01T00:00:00.000Z',
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rone"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1275:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  72) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return submissionDate-filtered toplevel rows with a function:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        submissionDate: '2010-06-01T00:00:00.000Z',
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rone',
      __system: Object {
        submissionDate: '2010-06-01T00:00:00.000Z',
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rone"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1345:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  73) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return updatedAt-filtered toplevel rows if requested:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rone"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1388:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  74) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return reviewState-filtered toplevel rows if requested:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      },
      __id: 'rtwo',
      __system: Object {
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: 'rejected',
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rtwo',
      __system: Object {
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: 'rejected',
        deviceId: null,
        edits: 0,
        deletedAt: null,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rtwo"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1435:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  75) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should filter toplevel rows by $root expression:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      },
      __id: 'rtwo',
      __system: Object {
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: 'rejected',
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rtwo',
      __system: Object {
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: 'rejected',
        deviceId: null,
        edits: 0,
        deletedAt: null,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rtwo"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1477:23
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1468:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  76) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return encrypted frames (no formdata):

      AssertionError: expected Object {
  value: Array [
    Object {
      __id: 'uuid:99b303d9-6494-477b-a30d-d8aae8867335',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 2,
        status: 'missingEncryptedFormData',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3',
        deletedAt: null
      }
    },
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 2,
        status: 'missingEncryptedFormData',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'uuid:99b303d9-6494-477b-a30d-d8aae8867335',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 2,
        status: 'missingEncryptedFormData',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3'
      }
    },
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 2,
        status: 'missingEncryptedFormData',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "uuid:99b303d9-6494-477b-a30d-d8aae8867335"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1738:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  77) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return encrypted frames (has formdata):

      AssertionError: expected Object {
  value: Array [
    Object {
      __id: 'uuid:99b303d9-6494-477b-a30d-d8aae8867335',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 1,
        attachmentsExpected: 2,
        status: 'notDecrypted',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3',
        deletedAt: null
      }
    },
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 1,
        attachmentsExpected: 2,
        status: 'notDecrypted',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'uuid:99b303d9-6494-477b-a30d-d8aae8867335',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 1,
        attachmentsExpected: 2,
        status: 'notDecrypted',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3'
      }
    },
    Object {
      __id: 'uuid:dcf4a151-5088-453f-99e6-369d67828f7a',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 1,
        attachmentsExpected: 2,
        status: 'notDecrypted',
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: 'working3'
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/encrypted.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "uuid:99b303d9-6494-477b-a30d-d8aae8867335"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1800:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  78) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should limit and offset subtable results:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Billy',
      age: 4,
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c',
      '__Submissions-id': 'rtwo'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child',
  '@odata.nextLink': 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child',
  '@odata.nextLink': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D',
  value: Array [
    Object {
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c',
      '__Submissions-id': 'rtwo',
      name: 'Billy',
      age: 4
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
      -  "@odata.nextLink": "https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.nextLink": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D"
         "value": [
           {
             "__Submissions-id": "rtwo"
             "__id": "52eff9ea82550183880b9d64c20487642fa6e60c"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1843:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  79) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should filter subtable results:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Billy',
      age: 4,
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c',
      '__Submissions-id': 'rtwo'
    },
    Object {
      name: 'Blaine',
      age: 6,
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3',
      '__Submissions-id': 'rtwo'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child',
  value: Array [
    Object {
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c',
      '__Submissions-id': 'rtwo',
      name: 'Billy',
      age: 4
    },
    Object {
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3',
      '__Submissions-id': 'rtwo',
      name: 'Blaine',
      age: 6
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
         "value": [
           {
             "__Submissions-id": "rtwo"
             "__id": "52eff9ea82550183880b9d64c20487642fa6e60c"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1877:23
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1874:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  80) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should filter and paginate subtable results:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Blaine',
      age: 6,
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3',
      '__Submissions-id': 'rtwo'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child',
  value: Array [
    Object {
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3',
      '__Submissions-id': 'rtwo',
      name: 'Blaine',
      age: 6
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
         "value": [
           {
             "__Submissions-id": "rtwo"
             "__id": "1291953ccbe2e5e866f7ab3fefa3036d649186d3"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1904:23
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1901:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  81) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should limit subtable results:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1938:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1933:24)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  82) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should reject unmatched repeatId:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=2&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1959:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1954:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  83) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should limit and filter subtable:

      AssertionError: expected 'https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24filter=%24root%2FSubmissions%2F__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D' to equal 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24filter=%24root%2FSubmissions%2F__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D'
      + expected - actual

      -https://central.local/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24filter=%24root%2FSubmissions%2F__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D
      +http://localhost:8989/v1/projects/1/forms/withrepeat.svc/Submissions.children.child?%24top=1&%24filter=%24root%2FSubmissions%2F__system%2FreviewState+eq+%27rejected%27&%24skiptoken=01eyJyZXBlYXRJZCI6IjUyZWZmOWVhODI1NTAxODM4ODBiOWQ2NGMyMDQ4NzY0MmZhNmU2MGMifQ%3D%3D
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:1983:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:1979:24)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  84) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should gracefully degrade on encrypted subtables:

      AssertionError: expected Object {
  value: Array [],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  value: Array [],
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child'
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat.svc/$metadata#Submissions.children.child"
         "value": []
       }
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2025:27
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  85) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return toplevel rows with selected properties:

      AssertionError: expected Object {
  value: Array [
    Object { name: 'Chelsea', __id: 'rthree' },
    Object { name: 'Bob', __id: 'rtwo' },
    Object { name: 'Alice', __id: 'rone' }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object { __id: 'rthree', name: 'Chelsea' },
    Object { __id: 'rtwo', name: 'Bob' },
    Object { __id: 'rone', name: 'Alice' }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rthree"
             "name": "Chelsea"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2036:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  86) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return toplevel rows with group properties:

      AssertionError: expected Object {
  value: Array [
    Object { meta: Object { instanceID: 'rthree' } },
    Object { meta: Object { instanceID: 'rtwo' } },
    Object { meta: Object { instanceID: 'rone' } }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions',
  value: Array [
    Object { meta: Object { instanceID: 'rthree' } },
    Object { meta: Object { instanceID: 'rtwo' } },
    Object { meta: Object { instanceID: 'rone' } }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions"
         "value": [
           {
             "meta": {
               "instanceID": "rthree"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2057:23
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:2054:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  87) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return toplevel row with nested group properties:

      AssertionError: expected Object {
  value: Array [
    Object {
      text: 'xyz',
      hospital: Object {
        name: 'AKUH',
        hiv_medication: Object { have_hiv_medication: 'Yes' }
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/nestedGroup.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/nestedGroup.svc/$metadata#Submissions',
  value: Array [
    Object {
      text: 'xyz',
      hospital: Object {
        name: 'AKUH',
        hiv_medication: Object { have_hiv_medication: 'Yes' }
      }
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/nestedGroup.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/nestedGroup.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/nestedGroup.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/nestedGroup.svc/$metadata#Submissions"
         "value": [
           {
             "hospital": {
               "hiv_medication": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2084:23
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:2081:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  88) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return subtable results with selected properties:

      AssertionError: expected Object {
  value: Array [
    Object {
      name: 'Candace',
      __id: '32809ae2b3dc404ea292205eb884b21fa4e9acc5'
    },
    Object {
      name: 'Billy',
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c'
    },
    Object {
      name: 'Blaine',
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3'
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child',
  value: Array [
    Object {
      __id: '32809ae2b3dc404ea292205eb884b21fa4e9acc5',
      name: 'Candace'
    },
    Object {
      __id: '52eff9ea82550183880b9d64c20487642fa6e60c',
      name: 'Billy'
    },
    Object {
      __id: '1291953ccbe2e5e866f7ab3fefa3036d649186d3',
      name: 'Blaine'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat.svc/$metadata#Submissions.children.child"
         "value": [
           {
             "__id": "32809ae2b3dc404ea292205eb884b21fa4e9acc5"
             "name": "Candace"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2106:25
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  89) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return subtable results with group properties:

      AssertionError: expected Object {
  value: Array [
    Object { address: Object { city: 'Toronto', country: 'Canada' } },
    Object { address: Object { city: 'New York', country: 'US' } }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/groupRepeat.svc/$metadata#Submissions.child_repeat'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/groupRepeat.svc/$metadata#Submissions.child_repeat',
  value: Array [
    Object { address: Object { city: 'Toronto', country: 'Canada' } },
    Object { address: Object { city: 'New York', country: 'US' } }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/groupRepeat.svc/$metadata#Submissions.child_repeat' and B has 'http://localhost:8989/v1/projects/1/forms/groupRepeat.svc/$metadata#Submissions.child_repeat')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/groupRepeat.svc/$metadata#Submissions.child_repeat"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/groupRepeat.svc/$metadata#Submissions.child_repeat"
         "value": [
           {
             "address": {
               "city": "Toronto"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2158:23
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:2155:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  90) api: /forms/:id.svc
       /Submissions.xyz.* GET
         should return results even when repeat name is not a valid OData name :

      AssertionError: expected Object {
  '@odata.context': 'https://central.local/v1/projects/1/forms/odata_sanitize_repeat_name.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' },
    Object {
      name: 'Submissions.q1_8_test',
      kind: 'EntitySet',
      url: 'Submissions.q1_8_test'
    }
  ]
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/odata_sanitize_repeat_name.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' },
    Object {
      name: 'Submissions.q1_8_test',
      kind: 'EntitySet',
      url: 'Submissions.q1_8_test'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/odata_sanitize_repeat_name.svc/$metadata' and B has 'http://localhost:8989/v1/projects/1/forms/odata_sanitize_repeat_name.svc/$metadata')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/odata_sanitize_repeat_name.svc/$metadata"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/odata_sanitize_repeat_name.svc/$metadata"
         "value": [
           {
             "kind": "EntitySet"
             "name": "Submissions"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2225:26
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/odata.js:2221:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  91) api: /forms/:id.svc
       /draft.svc
         GET
           should return an OData service document:

      AssertionError: expected Object {
  '@odata.context': 'https://central.local/v1/projects/1/forms/simple/draft.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' }
  ]
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/simple/draft.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/simple/draft.svc/$metadata' and B has 'http://localhost:8989/v1/projects/1/forms/simple/draft.svc/$metadata')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/simple/draft.svc/$metadata"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/simple/draft.svc/$metadata"
         "value": [
           {
             "kind": "EntitySet"
             "name": "Submissions"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2305:29
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  92) api: /forms/:id.svc
       /draft.svc
         GET
           should return the appropriate document for the draft:

      AssertionError: expected Object {
  '@odata.context': 'https://central.local/v1/projects/1/forms/simple/draft.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' },
    Object {
      name: 'Submissions.children.child',
      kind: 'EntitySet',
      url: 'Submissions.children.child'
    }
  ]
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/simple/draft.svc/$metadata',
  value: Array [
    Object { name: 'Submissions', kind: 'EntitySet', url: 'Submissions' },
    Object {
      name: 'Submissions.children.child',
      kind: 'EntitySet',
      url: 'Submissions.children.child'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/simple/draft.svc/$metadata' and B has 'http://localhost:8989/v1/projects/1/forms/simple/draft.svc/$metadata')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/simple/draft.svc/$metadata"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/simple/draft.svc/$metadata"
         "value": [
           {
             "kind": "EntitySet"
             "name": "Submissions"
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2322:29
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  93) api: /forms/:id.svc
       /draft.svc
         /Submissions('xyz')
           should return a single row result:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'double' },
      name: 'Vick',
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      __id: 'double',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'double',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'double\')/children/child'
      },
      meta: Object { instanceID: 'double' },
      name: 'Vick'
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "double"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2393:29
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  94) api: /forms/:id.svc
       /draft.svc
         /Submissions.xyz
           should return toplevel rows:

      AssertionError: expected Object {
  value: Array [
    Object {
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      },
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    },
    Object {
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      },
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    },
    Object {
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {},
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0',
        deletedAt: null
      }
    }
  ],
  '@odata.context': 'https://central.local/v1/projects/1/forms/withrepeat/draft.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/withrepeat/draft.svc/$metadata#Submissions',
  value: Array [
    Object {
      __id: 'rthree',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rthree' },
      name: 'Chelsea',
      age: 38,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rthree\')/children/child'
      }
    },
    Object {
      __id: 'rtwo',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rtwo' },
      name: 'Bob',
      age: 34,
      children: Object {
        'child@odata.navigationLink': 'Submissions(\'rtwo\')/children/child'
      }
    },
    Object {
      __id: 'rone',
      __system: Object {
        updatedAt: null,
        deletedAt: null,
        submitterId: '5',
        submitterName: 'Alice',
        attachmentsPresent: 0,
        attachmentsExpected: 0,
        status: null,
        reviewState: null,
        deviceId: null,
        edits: 0,
        formVersion: '1.0'
      },
      meta: Object { instanceID: 'rone' },
      name: 'Alice',
      age: 30,
      children: Object {}
    }
  ]
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/withrepeat/draft.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/withrepeat/draft.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/withrepeat/draft.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/withrepeat/draft.svc/$metadata#Submissions"
         "value": [
           {
             "__id": "rthree"
             "__system": {
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2471:29
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  95) api: /forms/:id.svc
       /draft.svc
         /Submissions.xyz
           should not return results from the published form:

      AssertionError: expected Object {
  value: Array [],
  '@odata.context': 'https://central.local/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions'
} to equal Object {
  '@odata.context': 'http://localhost:8989/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions',
  value: Array []
} (at '@odata.context', A has 'https://central.local/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions' and B has 'http://localhost:8989/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions')
      + expected - actual

       {
      -  "@odata.context": "https://central.local/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions"
      +  "@odata.context": "http://localhost:8989/v1/projects/1/forms/doubleRepeat/draft.svc/$metadata#Submissions"
         "value": []
       }
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/odata.js:2558:29
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  96) api: /projects
       GET
         should return extended metadata if requested:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:116:16
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  97) api: /projects
       GET
         should return extended metadata if requested:

      AssertionError: expected 2 to be 1
      + expected - actual

      -2
      +1
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/projects.js:173:34
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  98) api: /projects
       GET
         should order extended metadata projects appropriately:

      AssertionError: expected 5 to be 4
      + expected - actual

      -5
      +4
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/projects.js:197:38
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  99) api: /projects
       /:id GET
         should return extended metadata if requested:
     AssertionError: expected '2025-12-16T19:02:46.026Z' to not exist
      at /usr/odk/test/integration/api/projects.js:321:22
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/projects.js:314:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  100) api: /projects
       /:id GET
         should not count deleted app users:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:367:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  101) api: /projects
       /:id DELETE
         should delete the project:

      AssertionError: expected Array [
  Object {
    id: 7,
    name: 'A Test Project',
    description: null,
    archived: null,
    keyId: null,
    createdAt: '2025-12-16T19:02:46.037Z',
    updatedAt: null,
    deletedAt: null,
    verbs: Array [
      'analytics.read',
      'assignment.create',
      'assignment.delete',
      'assignment.list',
      'audit.read',
      'backup.run',
      'config.read',
      'config.set',
      'dataset.create',
      'dataset.list',
      'dataset.read',
      'dataset.update',
      'entity.create',
      'entity.delete',
      'entity.list',
      'entity.read',
      'entity.restore',
      'entity.update',
      'field_key.create',
      'field_key.delete',
      'field_key.list',
      'form.create',
      'form.delete',
      'form.list',
      'form.read',
      'form.restore',
      'form.update',
      'project.create',
      'project.delete',
      'project.read',
      'project.update',
      'public_link.create',
      'public_link.delete',
      'public_link.list',
      'public_link.read',
      'public_link.update',
      'role.create',
      'role.delete',
      'role.update',
      'session.end',
      'submission.create',
      'submission.delete',
      'submission.list',
      'submission.read',
      'submission.restore',
      'submission.update',
      'user.create',
      'user.delete',
      'user.list',
      'user.password.invalidate',
      'user.read',
      'user.update'
    ]
  }
] to equal Array [] (at length, A has 1 and B has 0)
      + expected - actual

      -[
      -  {
      -    "archived": [null]
      -    "createdAt": "2025-12-16T19:02:46.037Z"
      -    "deletedAt": [null]
      -    "description": [null]
      -    "id": 7
      -    "keyId": [null]
      -    "name": "A Test Project"
      -    "updatedAt": [null]
      -    "verbs": [
      -      "analytics.read"
      -      "assignment.create"
      -      "assignment.delete"
      -      "assignment.list"
      -      "audit.read"
      -      "backup.run"
      -      "config.read"
      -      "config.set"
      -      "dataset.create"
      -      "dataset.list"
      -      "dataset.read"
      -      "dataset.update"
      -      "entity.create"
      -      "entity.delete"
      -      "entity.list"
      -      "entity.read"
      -      "entity.restore"
      -      "entity.update"
      -      "field_key.create"
      -      "field_key.delete"
      -      "field_key.list"
      -      "form.create"
      -      "form.delete"
      -      "form.list"
      -      "form.read"
      -      "form.restore"
      -      "form.update"
      -      "project.create"
      -      "project.delete"
      -      "project.read"
      -      "project.update"
      -      "public_link.create"
      -      "public_link.delete"
      -      "public_link.list"
      -      "public_link.read"
      -      "public_link.update"
      -      "role.create"
      -      "role.delete"
      -      "role.update"
      -      "session.end"
      -      "submission.create"
      -      "submission.delete"
      -      "submission.list"
      -      "submission.read"
      -      "submission.restore"
      -      "submission.update"
      -      "user.create"
      -      "user.delete"
      -      "user.list"
      -      "user.password.invalidate"
      -      "user.read"
      -      "user.update"
      -    ]
      -  }
      -]
      +[]
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/projects.js:565:45
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  102) api: /projects
       /:id/key POST
         should not delete live submissions on project encryption:
     Error: expected 200 "OK", got 409 "Conflict"
      at Context.<anonymous> (test/integration/api/projects.js:773:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  103) api: /projects
       /:id PUT
         should reject if the roleId is not given:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1019:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  104) api: /projects
       /:id PUT
         should reject if the roleId is not recognized:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1039:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  105) api: /projects
       /:id PUT
         should reject if the user lacks the verbs to be granted:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1107:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  106) api: /projects
       /:id PUT
         should create the requested assignments:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1131:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  107) api: /projects
       /:id PUT
         should log the creation action in the audit log:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1173:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  108) api: /projects
       /:id PUT
         should delete the requested assignments:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1209:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  109) api: /projects
       /:id PUT
         should not delete enketo formviewer assignments:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1242:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  110) api: /projects
       /:id PUT
         should log the deletion action in the audit log:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1317:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  111) api: /projects
       /:id PUT
         should leave assignments alone if no array is given:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1351:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  112) api: /projects
       /:id PUT
         should leave assignments alone if there is no change:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/projects.js:1377:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  113) api: /projects?forms=true
       GET
         should return projects with verbs and nested extended forms:

      AssertionError: expected 2 to be 1
      + expected - actual

      -2
      +1
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at Context.<anonymous> (test/integration/api/projects.js:1415:30)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  114) api: /projects?forms=true
       GET
         should set project data from formList even on non-extended projects:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/projects.js:1566:10
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  115) api: /projects?forms=true
       GET
         should set project data from datasetList even on non-extended projects:

      AssertionError: expected 2 to be 1
      + expected - actual

      -2
      +1
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/projects.js:1627:30
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Context.<anonymous> (test/integration/api/projects.js:1624:7)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  116) api: /projects/:id/forms/:id/public-links
       POST
         should allow the created user to submit to the given form:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/public-links.js:49:14
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  117) api: /key/:key
       should passthrough to the appropriate route with successful auth:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/public-links.js:218:12
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  118) api: /sessions
       POST
         should set cookie information when the session returns:
     AssertionError: expected null to exist
      at /usr/odk/test/integration/api/sessions.js:88:18
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  119) api: /sessions
       POST
         should log the action in the audit log:

      AssertionError: expected 3 to be 1
      + expected - actual

      -3
      +1
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/sessions.js:109:32
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  120) api: /sessions
       /restore GET
         should return the active session if it exists:
     Error: expected 200 "OK", got 401 "Unauthorized"
      at /usr/odk/test/integration/api/sessions.js:172:12
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  121) api: /sessions
       /:token DELETE
         should log the action in the audit log if it is a field key:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/sessions.js:206:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  122) api: /sessions
       /:token DELETE
         should allow managers to delete project app user sessions:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/sessions.js:229:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  123) api: /sessions
       /:token DELETE
         should not allow app users to delete their own sessions:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/sessions.js:251:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  124) api: /sessions
       /:token DELETE
         should clear cookies if successful for the current session:

      AssertionError: expected Array [
  '__Host-session=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
  '__csrf=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict'
] to equal Array [
  'session=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
  '__csrf=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict'
] (at '0', A has '__Host-session=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict' and B has 'session=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict')
      + expected - actual

       [
      -  "__Host-session=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
      +  "session=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
         "__csrf=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict"
       ]
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/sessions.js:262:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  125) api: /sessions
       /:token DELETE
         should not log the action in the audit log for users:

      AssertionError: expected 4 to be 2
      + expected - actual

      -4
      +2
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/sessions.js:286:36
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  126) api: /sessions
       /:token DELETE
         should log the action in the audit log for app users:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/sessions.js:309:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  127) api: /sessions
       /current DELETE
         should not allow app users to delete their own sessions:
     Error: expected 200 "OK", got 400 "Bad Request"
      at Context.<anonymous> (test/integration/api/sessions.js:348:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  128) api: /sessions
       cookie CSRF auth
         should succeed if the CSRF token is correct:
     Error: expected 200 "OK", got 401 "Unauthorized"
      at /usr/odk/test/integration/api/sessions.js:379:12
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  129) api: /sessions
       cookie CSRF auth
         should succeed if it is ajax/xhr request:
     Error: expected 200 "OK", got 401 "Unauthorized"
      at /usr/odk/test/integration/api/sessions.js:388:12
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  130) api: /submission
       POST
         should save the submission to the appropriate form with device id and user agent:
     TypeError: Cannot read properties of null (reading 'should')
      at /usr/odk/test/integration/api/submissions.js:210:31
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Promise.all (index 0)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  131) api: /submission
       POST
         should accept a submission for an old form version:
     Error: expected 201 "Created", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:236:14
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  132) api: /submission
       POST
         should store the correct formdef and actor ids:

      AssertionError: expected 2 to be 1
      + expected - actual

      -2
      +1
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/submissions.js:257:39
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  133) api: /submission
       POST
         versioning
           should reject if the deprecatedId is not current:
     Error: expected 201 "Created", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:680:16
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  134) api: /submission
       POST
         versioning
           should reject if the new instanceId is a duplicate:
     Error: expected 201 "Created", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:698:16
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  135) api: /submission
       POST
         versioning
           should accept the new submission:
     Error: expected 201 "Created", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:727:16
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  136) api: /submission
       POST
         versioning
           should set the submission review state to edited:
     Error: expected 201 "Created", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:780:16
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  137) api: /submission
       [draft] POST
         should save the submission into the form draft:
     Error: expected 404 "Not Found", got 200 "OK"
      at /usr/odk/test/integration/api/submissions.js:899:18
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  138) api: /submission
       [draft] /test POST
         should save the submission into the form draft:
     Error: expected 404 "Not Found", got 200 "OK"
      at /usr/odk/test/integration/api/submissions.js:1051:20
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  139) api: /forms/:id/submissions
       POST
         should submit if all details are provided:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1134:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  140) api: /forms/:id/submissions
       POST
         should record a deviceId and userAgent if given:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1147:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  141) api: /forms/:id/submissions
       POST
         should not fail if longer userAgent and deviceId is provided:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1166:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  142) api: /forms/:id/submissions
       POST
         should accept a submission for an old form version:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1190:14
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  143) api: /forms/:id/submissions
       POST
         should store the correct formdef and actor ids:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1224:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  144) api: /forms/:id/submissions
       POST
         should reject duplicate submissions:
     Error: expected 200 "OK", got 409 "Conflict"
      at Context.<anonymous> (test/integration/api/submissions.js:1266:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  145) api: /forms/:id/submissions
       [draft] POST
         should accept even if the form is not taking submissions:
     Error: expected 404 "Not Found", got 200 "OK"
      at /usr/odk/test/integration/api/submissions.js:1314:72
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  146) api: /forms/:id/submissions
       /:instanceId PUT
         should reject notfound if the submission does not exist:
     Error: expected 404 "Not Found", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1334:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  147) api: /forms/:id/submissions
       /:instanceId PUT
         should reject if the user cannot edit:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1341:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  148) api: /forms/:id/submissions
       /:instanceId PUT
         should update the submission:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1354:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  149) api: /forms/:id/submissions
       /:instanceId PUT
         should reject if the deprecated submission is not current:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1377:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  150) api: /forms/:id/submissions
       /:instanceId/edit GET
         should reject if the submission does not exist:
     Error: expected 404 "Not Found", got 302 "Found"
      at /usr/odk/test/integration/api/submissions.js:1420:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  151) api: /forms/:id/submissions
       /:instanceId/edit GET
         should reject if the form does not have an enketoId:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1427:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  152) api: /forms/:id/submissions
       /:instanceId/edit GET
         should reject if the form is closing:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1437:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  153) api: /forms/:id/submissions
       /:instanceId/edit GET
         should redirect to the edit_url:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1454:14
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  154) api: /forms/:id/submissions
       /:instanceId/edit GET
         should pass the appropriate parameters to the enketo module:

      AssertionError: expected 'https://central.local/v1/projects/1' to be 'http://localhost:8989/v1/projects/1'
      + expected - actual

      -https://central.local/v1/projects/1
      +http://localhost:8989/v1/projects/1
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/submissions.js:1479:41
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  155) api: /forms/:id/submissions
       /:instanceId PATCH
         should reject notfound if the submission does not exist:
     Error: expected 404 "Not Found", got 200 "OK"
      at /usr/odk/test/integration/api/submissions.js:1492:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  156) api: /forms/:id/submissions
       /:instanceId PATCH
         should reject if the user cannot update:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1499:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  157) api: /forms/:id/submissions
       /:instanceId PATCH
         should set the review state:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1510:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  158) api: /forms/:id/submissions
       /:instanceId DELETE
         should reject notfound if the submission does not exist:
     Error: expected 404 "Not Found", got 200 "OK"
      at /usr/odk/test/integration/api/submissions.js:1523:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  159) api: /forms/:id/submissions
       /:instanceId DELETE
         should reject if the user cannot delete:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1530:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  160) api: /forms/:id/submissions
       /:instanceId DELETE
         should soft-delete the submission and not be able to access it again:
     Error: expected 200 "OK", got 409 "Conflict"
      at /usr/odk/test/integration/api/submissions.js:1540:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  161) api: /forms/:id/submissions
       /:instanceId DELETE
         should not let a submission with the same instanceId as a deleted submission be sent:
     Error: expected 200 "OK", got 409 "Conflict"
      at Context.<anonymous> (test/integration/api/submissions.js:1564:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  162) api: /forms/:id/submissions
       /:instanceId/attachments/:name POST
         App user should be able to upload attachment for the Submission:
     Error: expected 200 "OK", got 400 "Bad Request"
      at Context.<anonymous> (test/integration/api/submissions.js:4596:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  163) api: /users
       POST
         with standard uname/password auth
           should send an email to provisioned users:

      AssertionError: expected 12 to be 0
      + expected - actual

      -12
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:192:44
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  164) api: /users
       /reset/initiate POST, /reset/verify POST
         with standard uname/password auth
           should not send any email if no account exists:

      AssertionError: expected 14 to be 0
      + expected - actual

      -14
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:291:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  165) api: /users
       /reset/initiate POST, /reset/verify POST
         with standard uname/password auth
           should send a specific email if an account existed but was deleted:

      AssertionError: expected 14 to be 0
      + expected - actual

      -14
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:306:50
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  166) api: /users
       /reset/initiate POST, /reset/verify POST
         with standard uname/password auth
           should send an email with a token which can reset the user password:

      AssertionError: expected 14 to be 0
      + expected - actual

      -14
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:318:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  167) api: /users
       /reset/initiate POST, /reset/verify POST
         with standard uname/password auth
           should invalidate the existing password if requested:

      AssertionError: expected 14 to be 0
      + expected - actual

      -14
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:398:44
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  168) api: /users
       /reset/initiate POST, /reset/verify POST
         with standard uname/password auth
           should return 200 if user has rights to invalidate but account doesn'nt exist:

      AssertionError: expected 16 to be 0
      + expected - actual

      -16
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:446:44
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  169) api: /users
       /users/current GET
         should return 404 for app user:
     Error: expected 200 "OK", got 400 "Bad Request"
      at /usr/odk/test/integration/api/users.js:511:12
      at service.login (test/integration/setup.js:140:9)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)
  ----
      at Test._assertStatus (node_modules/supertest/lib/test.js:309:14)
      at /usr/odk/node_modules/supertest/lib/test.js:365:13
      at Test._assertFunction (node_modules/supertest/lib/test.js:342:13)
      at Test.assert (node_modules/supertest/lib/test.js:195:23)
      at localAssert (node_modules/supertest/lib/test.js:138:14)
      at Server.<anonymous> (node_modules/supertest/lib/test.js:152:11)
      at Object.onceWrapper (node:events:633:28)
      at Server.emit (node:events:519:28)
      at Server.emit (node:domain:489:12)
      at Object.apply (node_modules/@sentry/node/node_modules/@sentry/node-core/build/cjs/integrations/http/httpServerIntegration.js:93:23)
      at emitCloseNT (node:net:2419:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)

  170) api: /users
       /users/:id PATCH
         should send an email to the user's previous email when their email changes:

      AssertionError: expected 18 to be 0
      + expected - actual

      -18
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:663:44
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  171) api: /users
       /users/:id PATCH
         should not send an email to a user when their email does not change:

      AssertionError: expected 18 to be 0
      + expected - actual

      -18
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:678:42
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)

  172) api: /users
       /users/:id/password PUT
         with standard uname/password auth
           should send an email to a user when their password changes:

      AssertionError: expected 22 to be 0
      + expected - actual

      -22
      +0
      
      at Assertion.fail (node_modules/should/cjs/should.js:275:17)
      at Assertion.value (node_modules/should/cjs/should.js:356:19)
      at /usr/odk/test/integration/api/users.js:803:46
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Object.transaction (node_modules/slonik/dist/src/connectionMethods/transaction.js:22:24)
      at async Object.createConnection (node_modules/slonik/dist/src/factories/createConnection.js:97:18)



