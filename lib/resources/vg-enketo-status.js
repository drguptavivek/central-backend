const { Config } = require('../model/frames');
const vgEnketoStatusDomain = require('../domain/vg-enketo-status');

module.exports = (service, endpoint) => {
  // GET /v1/system/enketo-status
  service.get('/system/enketo-status', endpoint(({ VgEnketoStatus }, { auth, queryOptions }, __, response) =>
    auth.canOrReject('config.read', Config.species)
      .then(() => VgEnketoStatus.getEnketoStatus({}, queryOptions))
      .then(async (rows) => {
        const total = rows[0]?.total_count ?? rows.length;
        response.set('X-Total-Count', total);
        const summary = await VgEnketoStatus.getStatusSummary();
        return { data: rows, meta: { total, ...summary } };
      })
  ));

  // POST /v1/system/enketo-status/regenerate
  service.post('/system/enketo-status/regenerate', endpoint(({ Forms }, { auth, body }) =>
    auth.canOrReject('config.set', Config.species)
      .then(() => Promise.all(
        (body.forms || []).map(({ formId, projectId }) =>
          vgEnketoStatusDomain.regenerateEnketoId({ Forms }, formId, projectId)
        )
      ))
      .then(results => ({
        results: results.filter(r => r.success),
        errors: results.filter(r => !r.success)
      }))
  ));
};
