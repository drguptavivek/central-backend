// Namespaced vg telemetry queries.
const { sql } = require('slonik');
const { page, QueryOptions } = require('../../util/db');

const insertTelemetry = ({ actorId, deviceId, collectVersion, deviceDateTime, location }) => ({ one }) => {
  const loc = location || {};
  return one(sql`
    INSERT INTO vg_app_user_telemetry (
      "actorId",
      device_id,
      collect_version,
      device_date_time,
      location_lat,
      location_lng,
      location_altitude,
      location_accuracy,
      location_speed,
      location_bearing,
      location_provider
    )
    VALUES (
      ${actorId},
      ${deviceId},
      ${collectVersion},
      ${deviceDateTime},
      ${loc.latitude ?? null},
      ${loc.longitude ?? null},
      ${loc.altitude ?? null},
      ${loc.accuracy ?? null},
      ${loc.speed ?? null},
      ${loc.bearing ?? null},
      ${loc.provider ?? null}
    )
    RETURNING id, received_at
  `);
};

const telemetryFilterer = (filters) => {
  const conditions = [];
  if (filters.projectId != null) conditions.push(sql`fk."projectId"=${filters.projectId}`);
  if (filters.deviceId != null) conditions.push(sql`t.device_id=${filters.deviceId}`);
  if (filters.appUserId != null) conditions.push(sql`t."actorId"=${filters.appUserId}`);
  if (filters.dateFrom != null) conditions.push(sql`t.received_at >= ${filters.dateFrom}`);
  if (filters.dateTo != null) conditions.push(sql`t.received_at <= ${filters.dateTo}`);
  return (conditions.length === 0) ? sql`true` : sql.join(conditions, sql` and `);
};

const getTelemetry = (filters = {}, options = QueryOptions.none) => ({ all }) =>
  all(sql`
    SELECT
      t.id,
      t."actorId" AS "appUserId",
      fk."projectId",
      t.device_id,
      t.collect_version,
      t.device_date_time,
      t.received_at,
      t.location_lat,
      t.location_lng,
      t.location_altitude,
      t.location_accuracy,
      t.location_speed,
      t.location_bearing,
      t.location_provider
    FROM vg_app_user_telemetry t
    JOIN field_keys fk ON fk."actorId" = t."actorId"
    WHERE ${telemetryFilterer(filters)}
    ORDER BY t.received_at DESC, t.id DESC
    ${page(options)}
  `);

module.exports = { insertTelemetry, getTelemetry };
