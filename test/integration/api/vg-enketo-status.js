const should = require('should');
const { sql } = require('slonik');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg enketo status', () => {
  it('should return enketo status for all forms across all projects', testService(async (service, container) => {
    // Test getEnketoStatus query through the container
    const results = await container.VgEnketoStatus.getEnketoStatus();
    results.should.be.an.Array();
    results.length.should.be.above(0);

    // Check that all results have required fields
    results.forEach(result => {
      result.should.have.property('projectId');
      result.should.have.property('projectName');
      result.should.have.property('formId');
      result.should.have.property('xmlFormId');
      result.should.have.property('formName');
      result.should.have.property('status');
      result.should.have.property('reason');
      result.should.have.property('enketoId');
      result.should.have.property('enketoOnceId');
      result.should.have.property('lastUpdatedAt');
    });

    // Check that statuses are valid
    const validStatuses = ['healthy', 'never_pushed', 'draft_only', 'closed', 'push_failed'];
    results.forEach(result => {
      validStatuses.should.containEql(result.status);
    });
  }));

  it('should return status summary with counts by status type', testService(async (service, container) => {
    const summary = await container.VgEnketoStatus.getStatusSummary();

    summary.should.be.an.Object();
    summary.should.have.property('healthy');
    summary.should.have.property('never_pushed');
    summary.should.have.property('draft_only');
    summary.should.have.property('closed');

    // All counts should be numbers
    summary.healthy.should.be.a.Number();
    summary.never_pushed.should.be.a.Number();
    summary.draft_only.should.be.a.Number();
    summary.closed.should.be.a.Number();
  }));

  it('should filter by projectId when specified', testService(async (service, container) => {
    const results = await container.VgEnketoStatus.getEnketoStatus({ projectId: 1 });

    results.should.be.an.Array();
    results.forEach(result => {
      result.projectId.should.equal(1);
    });
  }));

  it('should determine closed status correctly', testService(async (service, container) => {
    const asAlice = await service.login('alice');

    // Create and close a form
    await asAlice.post('/v1/projects/1/forms')
      .set('Content-Type', 'application/xml')
      .send(`<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>Closed Form Test</h:title>
    <model>
      <instance>
        <data id="closed_form_test">
          <meta>
            <instanceID/>
          </meta>
          <name/>
        </data>
      </instance>
      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>Name</label>
    </input>
  </h:body>
</h:html>`)
      .expect(200);

    await asAlice.patch('/v1/projects/1/forms/closed_form_test')
      .send({ state: 'closed' })
      .expect(200);

    const results = await container.VgEnketoStatus.getEnketoStatus();
    const closedForm = results.find(r => r.xmlFormId === 'closed_form_test');

    should.exist(closedForm);
    closedForm.status.should.equal('closed');
    closedForm.reason.should.equal('Form is closed');
  }));

  it('should determine status for forms with and without Enketo IDs', testService(async (service, container) => {
    const asAlice = await service.login('alice');

    // Create a form (it will have an Enketo ID after publishing)
    await asAlice.post('/v1/projects/1/forms')
      .set('Content-Type', 'application/xml')
      .send(`<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>Enketo Status Test</h:title>
    <model>
      <instance>
        <data id="enketo_status_test">
          <meta>
            <instanceID/>
          </meta>
          <name/>
        </data>
      </instance>
      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/name">
      <label>Name</label>
    </input>
  </h:body>
</h:html>`)
      .expect(200);

    const results = await container.VgEnketoStatus.getEnketoStatus();
    const form = results.find(r => r.xmlFormId === 'enketo_status_test');

    should.exist(form);
    // Form should have an enketoId after publishing
    // Status should be either healthy or never_pushed
    ['healthy', 'never_pushed', 'draft_only'].should.containEql(form.status);
  }));
});
