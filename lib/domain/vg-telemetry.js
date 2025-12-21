// Domain logic for vg app-user telemetry.
const Problem = require('../util/problem');
const { isBlank } = require('../util/util');

const parseRequiredString = (value, field, payload) => {
  if (value == null) throw Problem.user.missingParameters({ expected: [field], got: payload });
  if (typeof value !== 'string')
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'string' });
  const trimmed = value.trim();
  if (trimmed === '') throw Problem.user.missingParameters({ expected: [field], got: payload });
  return trimmed;
};

const parseDateTime = (value, field, payload) => {
  if (value == null) throw Problem.user.missingParameters({ expected: [field], got: payload });
  if (typeof value !== 'string')
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'UTC ISO datetime string' });
  const trimmed = value.trim();
  if (trimmed === '')
    throw Problem.user.missingParameters({ expected: [field], got: payload });
  const utcSuffix = trimmed.endsWith('Z') || trimmed.endsWith('+00:00') || trimmed.endsWith('-00:00');
  if (!utcSuffix)
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'UTC ISO datetime (Z or +00:00)' });
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime()))
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'UTC ISO datetime' });
  return date;
};

const parseNumber = (value, field) => {
  if (value == null) return null;
  if (typeof value === 'string' && value.trim() === '')
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'number' });
  const num = (typeof value === 'string') ? Number(value) : value;
  if (typeof num !== 'number' || !Number.isFinite(num))
    throw Problem.user.invalidDataTypeOfParameter({ field, expected: 'number' });
  return num;
};

const parseLocation = (location, payload) => {
  if (location == null) return null;
  if (typeof location !== 'object' || Array.isArray(location))
    throw Problem.user.invalidDataTypeOfParameter({ field: 'location', expected: 'object' });

  const latitude = parseNumber(location.latitude, 'location.latitude');
  const longitude = parseNumber(location.longitude, 'location.longitude');
  const altitude = parseNumber(location.altitude, 'location.altitude');
  const accuracy = parseNumber(location.accuracy, 'location.accuracy');
  const speed = parseNumber(location.speed, 'location.speed');
  const bearing = parseNumber(location.bearing, 'location.bearing');
  let provider = null;
  if (location.provider != null) {
    if (typeof location.provider !== 'string')
      throw Problem.user.invalidDataTypeOfParameter({ field: 'location.provider', expected: 'string' });
    provider = location.provider.trim();
  }

  if (latitude == null || longitude == null)
    throw Problem.user.missingParameters({ expected: ['location.latitude', 'location.longitude'], got: payload });

  return {
    latitude,
    longitude,
    altitude,
    accuracy,
    speed,
    bearing,
    provider: isBlank(provider) ? null : provider
  };
};

const recordTelemetry = async ({ VgTelemetry }, actorId, payload) => {
  if (actorId == null) throw Problem.user.insufficientRights();
  const deviceId = parseRequiredString(payload.deviceId, 'deviceId', payload);
  const collectVersion = parseRequiredString(payload.collectVersion, 'collectVersion', payload);
  const deviceDateTime = parseDateTime(payload.deviceDateTime, 'deviceDateTime', payload);
  const location = parseLocation(payload.location, payload);

  return VgTelemetry.insertTelemetry({
    actorId,
    deviceId,
    collectVersion,
    deviceDateTime,
    location
  });
};

module.exports = { recordTelemetry };
