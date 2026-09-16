const { testService } = require('../setup');
require('../assertions');
const { sql } = require('slonik');
const testData = require('../../data/xml');

const exportSurfaces = [
  { name: 'published CSV', path: '/v1/projects/1/forms/simple/submissions.csv' },
  { name: 'published CSV ZIP', path: '/v1/projects/1/forms/simple/submissions.csv.zip' },
  { name: 'draft CSV', path: '/v1/projects/1/forms/simple/draft/submissions.csv' },
  { name: 'draft CSV ZIP', path: '/v1/projects/1/forms/simple/draft/submissions.csv.zip' },
  { name: 'published OData service', path: '/v1/projects/1/forms/simple.svc' },
  { name: 'published OData metadata', path: '/v1/projects/1/forms/simple.svc/$metadata' },
  { name: 'published OData collection', path: '/v1/projects/1/forms/simple.svc/Submissions' },
  { name: 'published OData row', path: "/v1/projects/1/forms/simple.svc/Submissions('one')" },
  { name: 'draft OData service', path: '/v1/projects/1/forms/simple/draft.svc' },
  { name: 'draft OData metadata', path: '/v1/projects/1/forms/simple/draft.svc/$metadata' },
  { name: 'draft OData collection', path: '/v1/projects/1/forms/simple/draft.svc/Submissions' },
  { name: 'draft OData row', path: "/v1/projects/1/forms/simple/draft.svc/Submissions('draft-one')" }
];

const roleCases = [
  { name: 'admin', user: 'alice', status: 200 },
  { name: 'manager', user: 'bob', status: 200 },
  { name: 'viewer', user: 'chelsea', assignment: 'viewer', status: 403 },
  { name: 'data manager', user: 'chelsea', assignment: 'data_mgr', status: 403 },
  {
    name: 'custom exporter',
    user: 'chelsea',
    assignment: 'cst_exp',
    verbs: [ 'submission.export' ],
    status: 200
  },
  {
    name: 'custom reader',
    user: 'chelsea',
    assignment: 'cst_read',
    verbs: [ 'project.read', 'form.list', 'form.read', 'submission.list', 'submission.read' ],
    status: 403
  }
];

const setupSubmissions = async (service) => {
  const asAlice = await service.login('alice');

  await asAlice.post('/v1/projects/1/forms/simple/submissions')
    .send(testData.instances.simple.one)
    .set('Content-Type', 'application/xml')
    .expect(200);

  await asAlice.post('/v1/projects/1/forms/simple/draft')
    .expect(200);
  await asAlice.post('/v1/projects/1/forms/simple/draft/submissions')
    .send(testData.instances.simple.one.replace('<instanceID>one</instanceID>', '<instanceID>draft-one</instanceID>'))
    .set('Content-Type', 'application/xml')
    .expect(200);

  // Keep the viewer read-path checks in this regression test independent from
  // the export form by giving the binary form one known attachment.
  await asAlice.post('/v1/projects/1/forms?publish=true')
    .send(testData.forms.binaryType)
    .set('Content-Type', 'application/xml')
    .expect(200);
  await asAlice.post('/v1/projects/1/forms/binaryType/submissions')
    .send(testData.instances.binaryType.one)
    .set('Content-Type', 'application/xml')
    .expect(200);
  await asAlice.post('/v1/projects/1/forms/binaryType/submissions/bone/attachments/my_file1.mp4')
    .send('content')
    .expect(200);
};

const actorForRole = async (service, container, roleCase) => {
  if (roleCase.assignment == null) return service.login(roleCase.user);

  if (roleCase.verbs != null) {
    await container.run(sql`
      INSERT INTO roles (name, system, verbs)
      VALUES (${roleCase.name}, ${roleCase.assignment}, ${JSON.stringify(roleCase.verbs)}::jsonb)
    `);
  }

  const asChelsea = await service.login(roleCase.user);
  const { body: chelsea } = await asChelsea.get('/v1/users/current').expect(200);
  const asAlice = await service.login('alice');
  await asAlice.post(`/v1/projects/1/assignments/${roleCase.assignment}/${chelsea.id}`)
    .expect(200);
  return asChelsea;
};

describe('VG submission export authorization', () => {
  for (const roleCase of roleCases) {
    it(`${roleCase.name} export access follows submission.export`, testService(async (service, container) => {
      await setupSubmissions(service);
      const actor = await actorForRole(service, container, roleCase);

      /* eslint-disable no-await-in-loop */
      for (const surface of exportSurfaces)
        await actor.get(surface.path).expect(roleCase.status);
      /* eslint-enable no-await-in-loop */

      if (roleCase.name === 'viewer') {
        await actor.get('/v1/projects/1/forms/simple/submissions').expect(200);
        await actor.get('/v1/projects/1/forms/simple/submissions/one').expect(200);
        await actor.get('/v1/projects/1/forms/binaryType/submissions/bone/attachments/my_file1.mp4')
          .expect(200)
          .then(({ text }) => text.should.equal('content'));
      }
    }));
  }
});
