// Namespaced vg telemetry queries.
const { sql } = require('slonik');
const { page, QueryOptions } = require('../../util/db');

const upsertTelemetry = ({ actorId, deviceId, collectVersion, deviceDateTime, location, clientEventId = null, event = null }) => ({ one }) => {
  const loc = location || {};
  const eventValue = (event == null) ? null : sql.json(event);
  return one(sql`
    INSERT INTO vg_app_user_telemetry (
      "actorId",
      device_id,
      collect_version,
      device_date_time,
      client_event_id,
      event,
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
      ${clientEventId},
      ${eventValue},
      ${loc.latitude ?? null},
      ${loc.longitude ?? null},
      ${loc.altitude ?? null},
      ${loc.accuracy ?? null},
      ${loc.speed ?? null},
      ${loc.bearing ?? null},
      ${loc.provider ?? null}
    )
    ON CONFLICT ("actorId", device_id, client_event_id) WHERE client_event_id IS NOT NULL
    DO UPDATE SET
      collect_version = EXCLUDED.collect_version,
      device_date_time = EXCLUDED.device_date_time,
      received_at = now(),
      event = EXCLUDED.event,
      location_lat = EXCLUDED.location_lat,
      location_lng = EXCLUDED.location_lng,
      location_altitude = EXCLUDED.location_altitude,
      location_accuracy = EXCLUDED.location_accuracy,
      location_speed = EXCLUDED.location_speed,
      location_bearing = EXCLUDED.location_bearing,
      location_provider = EXCLUDED.location_provider
    RETURNING id, received_at, client_event_id
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
      count(*) OVER () AS total_count,
      t.id,
      t."actorId" AS "appUserId",
      fk."projectId",
      t.device_id,
      t.collect_version,
      t.device_date_time,
      t.received_at,
      t.client_event_id,
      t.event,
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

module.exports = { upsertTelemetry, getTelemetry };
