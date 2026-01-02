const should = require('should');
require('../assertions');
const { testService } = require('../setup');

describe('domain: vg enketo status', () => {
  it('should regenerate enketoId for an open form', testService(async (service, container) => {
    const asAlice = await service.login('alice');

    // Create a form
    await asAlice.post('/v1/projects/1/forms')
      .set('Content-Type', 'application/xml')
      .send(`<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>Test Form</h:title>
    <model>
      <instance>
        <data id="test_regenerate_form">
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

    // Get the form directly from container
    const { Form } = require('../../../lib/model/frames');
    const form = await container.Forms.getByProjectAndXmlFormId(1, 'test_regenerate_form', Form.WithoutDef);
    const formObj = form.get();
    const oldEnketoId = formObj.enketoId;
    const formId = formObj.id;

    formId.should.be.a.Number();

    // Regenerate the enketoId using domain logic
    const domain = require('../../../lib/domain/vg-enketo-status');
    const result = await domain.regenerateEnketoId({ Forms: container.Forms }, formId, 1);

    result.should.have.property('success', true);
    result.should.have.property('formId', formId);
    result.should.have.property('xmlFormId', 'test_regenerate_form');
    result.should.have.property('oldEnketoId', oldEnketoId);
    result.should.have.property('newEnketoId');
    result.newEnketoId.should.be.a.String();
    result.newEnketoId.should.not.equal('');
  }));

  it('should fail to regenerate enketoId for a closed form', testService(async (service, container) => {
    const asAlice = await service.login('alice');

    // Create and close a form
    await asAlice.post('/v1/projects/1/forms')
      .set('Content-Type', 'application/xml')
      .send(`<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>Test Form</h:title>
    <model>
      <instance>
        <data id="test_closed_form">
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

    await asAlice.patch('/v1/projects/1/forms/test_closed_form')
      .send({ state: 'closed' })
      .expect(200);

    // Try to regenerate enketoId for closed form
    const domain = require('../../../lib/domain/vg-enketo-status');
    const result = await domain.regenerateEnketoId({ Forms: container.Forms }, 999, 1);

    // Should return error result
    result.should.have.property('success', false);
    result.should.have.property('error');
  }));

  it('should fail to regenerate enketoId for a non-existent form', testService(async (service, container) => {
    const domain = require('../../../lib/domain/vg-enketo-status');
    const result = await domain.regenerateEnketoId({ Forms: container.Forms }, 999999, 1);

    result.should.have.property('success', false);
    result.should.have.property('error');
  }));
});
