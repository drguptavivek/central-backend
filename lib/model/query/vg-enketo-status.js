const { sql } = require('slonik');
const { QueryOptions, page } = require('../../util/db');

// Status determination logic
const determineStatus = (form) => {
  if (form.state !== 'open') {
    return { status: 'closed', reason: 'Form is closed' };
  }
  if (form.enketoId != null && form.enketoOnceId != null) {
    return { status: 'healthy', reason: 'Has Enketo ID' };
  }
  if (form.defEnketoId != null && form.enketoId == null) {
    return { status: 'draft_only', reason: 'Draft only, not published' };
  }
  if (form.enketoId == null) {
    return { status: 'never_pushed', reason: 'Never pushed to Enketo' };
  }
  return { status: 'push_failed', reason: 'Last push attempt failed' };
};

const getEnketoStatus = (filters = {}, options = QueryOptions.none) => (container) => {
  const conditions = [];

  if (filters.projectId != null) {
    conditions.push(sql`p.id = ${filters.projectId}`);
  }
  if (filters.xmlFormId != null) {
    conditions.push(sql`f."xmlFormId" = ${filters.xmlFormId}`);
  }

  const whereClause = conditions.length > 0
    ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
    : sql``;

  return container.all(sql`
    SELECT
      count(*) OVER () as total_count,
      p.id AS "projectId",
      p.name AS "projectName",
      f.id AS "formId",
      f."xmlFormId",
      fd.name AS "formName",
      f.state,
      f."enketoId",
      f."enketoOnceId",
      f."updatedAt" AS "lastUpdatedAt",
      fd."enketoId" AS "defEnketoId"
    FROM forms f
    INNER JOIN projects p ON p.id = f."projectId"
    LEFT JOIN form_defs fd ON fd.id = f."currentDefId"
    ${whereClause}
    ORDER BY p.name, fd.name
    ${page(options)}
  `).then(rows => rows.map(row => ({
    ...row,
    ...determineStatus(row)
  })));
};

const getStatusSummary = () => (container) => {
  return container.one(sql`
    SELECT
      COUNT(*) FILTER (WHERE f.state = 'open' AND f."enketoId" IS NOT NULL AND f."enketoOnceId" IS NOT NULL) AS healthy,
      COUNT(*) FILTER (WHERE f.state = 'open' AND f."enketoId" IS NULL) AS never_pushed,
      COUNT(*) FILTER (WHERE f.state = 'open' AND f."enketoId" IS NULL AND fd."enketoId" IS NOT NULL) AS draft_only,
      COUNT(*) FILTER (WHERE f.state != 'open') AS closed
    FROM forms f
    LEFT JOIN form_defs fd ON fd.id = f."currentDefId"
  `).then(result => ({
    healthy: Number(result.healthy),
    never_pushed: Number(result.never_pushed),
    draft_only: Number(result.draft_only),
    closed: Number(result.closed)
  }));
};

module.exports = {
  getEnketoStatus,
  getStatusSummary,
  determineStatus
};
