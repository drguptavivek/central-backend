const should = require('should');
require('../assertions');
const { testService } = require('../setup');

describe('api: vg enketo status endpoints', () => {
  it('should return enketo status for all forms', testService(async (service) => {
    const asAlice = await service.login('alice');

    // Create some test forms
    await asAlice.post('/v1/projects/1/forms')
      .set('Content-Type', 'application/xml')
      .send(`<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>Form 1</h:title>
    <model>
      <instance>
        <data id="test_api_form1">
          <meta><instanceID/></meta>
          <name/>
        </data>
      </instance>
      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/name"><label>Name</label></input>
  </h:body>
</h:html>`)
      .expect(200);

    // Get enketo status
    const result = await asAlice.get('/v1/system/enketo-status')
      .expect(200);

    result.body.should.be.an.Object();
    result.body.should.have.property('data');
    result.body.data.should.be.an.Array();
    result.body.should.have.property('meta');
    result.body.meta.should.have.property('total');
    result.body.meta.should.have.property('healthy');
    result.body.meta.should.have.property('never_pushed');
    result.body.meta.should.have.property('draft_only');
    result.body.meta.should.have.property('closed');
  }));

  it('should require config.read permission to view enketo status', testService((service) => {
    // Try without auth - should fail
    return service.get('/v1/system/enketo-status')
      .expect(401);
  }));

  it('should regenerate enketoId for specified forms', testService(async (service, container) => {
    const asAlice = await service.login('alice');

    // Create a form
    await asAlice.post('/v1/projects/1/forms')
      .set('Content-Type', 'application/xml')
      .send(`<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>Form 2</h:title>
    <model>
      <instance>
        <data id="test_api_regenerate">
          <meta><instanceID/></meta>
          <name/>
        </data>
      </instance>
      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/name"><label>Name</label></input>
  </h:body>
</h:html>`)
      .expect(200);

    // Get the form to find its ID
    const { Form } = require('../../../lib/model/frames');
    const form = await container.Forms.getByProjectAndXmlFormId(1, 'test_api_regenerate', Form.WithoutDef);
    const formObj = form.get();

    // Regenerate enketoId
    const result = await asAlice.post('/v1/system/enketo-status/regenerate')
      .send({
        forms: [{ formId: formObj.id, projectId: 1 }]
      })
      .expect(200);

    result.body.should.be.an.Object();
    result.body.should.have.property('results');
    result.body.results.should.be.an.Array();
  }));

  it('should require config.set permission to regenerate enketoIds', testService((service) => {
    // Try without auth - should fail
    return service.post('/v1/system/enketo-status/regenerate')
      .send({ forms: [{ formId: 1, projectId: 1 }] })
      .expect(401);
  }));

  it('should filter by projectId query parameter', testService(async (service) => {
    const asAlice = await service.login('alice');

    // Filter by projectId
    const result = await asAlice.get('/v1/system/enketo-status?projectId=1')
      .expect(200);

    result.body.should.be.an.Object();
    result.body.should.have.property('data');
    result.body.data.should.be.an.Array();
    // All results should be from project 1
    result.body.data.forEach(item => {
      item.projectId.should.equal(1);
    });
  }));

  it('should filter by xmlFormId query parameter', testService(async (service) => {
    const asAlice = await service.login('alice');

    // Create a specific form
    await asAlice.post('/v1/projects/1/forms')
      .set('Content-Type', 'application/xml')
      .send(`<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>Filter Test</h:title>
    <model>
      <instance>
        <data id="filter_test_form">
          <meta><instanceID/></meta>
          <name/>
        </data>
      </instance>
      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/name" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/name"><label>Name</label></input>
  </h:body>
</h:html>`)
      .expect(200);

    // Filter by xmlFormId
    const result = await asAlice.get('/v1/system/enketo-status?xmlFormId=filter_test_form')
      .expect(200);

    result.body.should.be.an.Object();
    result.body.should.have.property('data');
    result.body.data.should.be.an.Array();
    result.body.data.length.should.be.above(0);
    // Check that our form is in the results
    const filteredForm = result.body.data.find(f => f.xmlFormId === 'filter_test_form');
    should.exist(filteredForm);
    filteredForm.xmlFormId.should.equal('filter_test_form');
  }));
});
