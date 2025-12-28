const Problem = require('../util/problem');
const { getOrNotFound } = require('../util/promise');
const vgTelemetry = require('../domain/vg-telemetry');
const { Config } = require('../model/frames');

const parseIntParam = (value, field) => {
  if (value == null) return null;
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num))
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'integer' });
  return num;
};

const parseDateParam = (value, field) => {
  if (value == null) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'ISO datetime' });
  return date.toISOString();
};

const parseStringParam = (value, field) => {
  if (value == null) return null;
  if (typeof value !== 'string')
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'string' });
  const trimmed = value.trim();
  if (trimmed === '')
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'non-empty string' });
  return trimmed;
};

const mapLocation = (row) => {
  const hasLocation = row.location_lat != null || row.location_lng != null || row.location_altitude != null ||
    row.location_accuracy != null || row.location_speed != null || row.location_bearing != null || row.location_provider != null;
  if (!hasLocation) return null;
  return {
    latitude: row.location_lat,
    longitude: row.location_lng,
    altitude: row.location_altitude,
    accuracy: row.location_accuracy,
    speed: row.location_speed,
    bearing: row.location_bearing,
    provider: row.location_provider
  };
};

module.exports = (service, endpoint) => {
  // App-user telemetry capture.
  service.post('/projects/:projectId/app-users/telemetry', endpoint(
    ({ Projects, FieldKeys, VgTelemetry }, { auth, body, params }) => {
      const actor = auth.actor.orNull();
      if (actor == null || actor.type !== 'field_key')
        return Problem.user.insufficientRights();

      return Projects.getById(params.projectId)
        .then(getOrNotFound)
        .then((project) => FieldKeys.getByProjectAndActorId(project.id, actor.id))
        .then(getOrNotFound)
        .then(() => vgTelemetry.recordTelemetry({ VgTelemetry }, actor.id, body || {}))
        .then(({ id, received_at }) => ({ id, dateTime: received_at, serverTime: new Date().toISOString() }));
    }
  ));

  // Admin telemetry listing with filters.
  service.get('/system/app-users/telemetry', endpoint(
    ({ VgTelemetry }, { auth, queryOptions }, __, response) =>
      auth.canOrReject('config.read', Config.species)
        .then(() => {
          const options = queryOptions.allowArgs('projectId', 'deviceId', 'appUserId', 'dateFrom', 'dateTo');
          const args = options.args || {};
          const filters = {
            projectId: parseIntParam(args.projectId, 'projectId'),
            deviceId: parseStringParam(args.deviceId, 'deviceId'),
            appUserId: parseIntParam(args.appUserId, 'appUserId'),
            dateFrom: parseDateParam(args.dateFrom, 'dateFrom'),
            dateTo: parseDateParam(args.dateTo, 'dateTo')
          };

          if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo)
            throw Problem.user.invalidEntity({ reason: 'dateFrom must be before dateTo.' });

          return VgTelemetry.getTelemetry(filters, options);
        })
        .then((rows) => {
          const total = rows.length !== 0 && Number.isFinite(Number(rows[0].total_count))
            ? Number(rows[0].total_count)
            : rows.length;
          response.set('X-Total-Count', total);
          return rows.map((row) => ({
          id: row.id,
          appUserId: row.appUserId,
          projectId: row.projectId,
          deviceId: row.device_id,
          collectVersion: row.collect_version,
          deviceDateTime: row.device_date_time,
          dateTime: row.received_at,
          location: mapLocation(row)
          }));
        })
  ));
};
