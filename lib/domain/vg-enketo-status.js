const Problem = require('../util/problem');
const { getOrNotFound } = require('../util/promise');
const { Form } = require('../model/frames');

const regenerateEnketoId = ({ Forms }, formId, projectId) => {
  return Forms.getByProjectAndNumericId(projectId, formId, Form.WithoutDef, Form.WithoutXml)
    .then(getOrNotFound)
    .then(async (form) => {
      // Check if form is open
      if (form.state !== 'open') {
        return {
          formId,
          success: false,
          error: `Form is ${form.state}, cannot regenerate Enketo ID`
        };
      }

      const oldEnketoId = form.enketoId;

      // Push the form to Enketo to get new IDs
      const enketoIds = await Forms.pushFormToEnketo({
        projectId: form.projectId,
        xmlFormId: form.xmlFormId,
        acteeId: form.acteeId
      }, 5);

      // Update the form with the new Enketo IDs
      await Forms._update(form, enketoIds);

      return {
        formId: form.id,
        xmlFormId: form.xmlFormId,
        success: true,
        oldEnketoId,
        newEnketoId: enketoIds.enketoId,
        newEnketoOnceId: enketoIds.enketoOnceId
      };
    })
    .catch(error => ({
      formId,
      success: false,
      error: error.message || 'Unknown error'
    }));
};

module.exports = { regenerateEnketoId };
