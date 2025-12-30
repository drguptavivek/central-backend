# VG API Additions

This document captures VG-specific API additions/changes in this fork.

## Telemetry

### POST `/projects/:projectId/app-users/telemetry`

Records app-user telemetry (device metadata, timestamps, optional location).

**Auth**: `Authorization: Bearer <app-user-session-token>`

**Response**

```json
{
  "id": 55,
  "appUserId": 123,
  "deviceId": "device-1",
  "dateTime": "2025-12-21T10:02:00.000Z",
  "serverTime": "2025-12-21T10:02:00.500Z",
  "status": "ok"
}
```

`status` becomes `"invalidated"` if the current bearer token no longer resolves as a valid session by the time the telemetry record is processed.

## App Users

### POST `/projects/:projectId/app-users/:id/active`

Activates or deactivates an app user.

**Auth**: `Authorization: Bearer <admin-session-token>`

**Request body**

```json
{ "active": true }
```

`active` must be a boolean. Non-boolean values (for example `"true"` or `1`) return an `invalidDataTypeOfParameter` problem response.
