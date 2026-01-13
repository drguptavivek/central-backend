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

## Settings

### GET `/v1/system/settings`

Gets global default settings for app users (admin only).

**Auth**: `Authorization: Bearer <admin-session-token>`

**Response**

```json
{
  "vg_app_user_session_ttl_days": 3,
  "vg_app_user_session_cap": 3,
  "vg_app_user_ip_max_failures": 20,
  "vg_app_user_ip_window_minutes": 15,
  "vg_app_user_ip_lock_duration_minutes": 30,
  "admin_pw": "secret"
}
```

### PUT `/v1/system/settings`

Updates global default settings for app users (admin only).

**Auth**: `Authorization: Bearer <admin-session-token>`

**Request body**

```json
{
  "vg_app_user_session_ttl_days": 7,
  "vg_app_user_ip_max_failures": 10
}
```

At least one setting must be provided. All settings are optional.

### GET `/v1/projects/:projectId/app-users/settings`

Gets app user settings for a project, including project-level overrides (admin only).

**Auth**: `Authorization: Bearer <admin-session-token>`

**Response**

```json
{
  "vg_app_user_session_ttl_days": 3,
  "vg_app_user_session_cap": 3,
  "vg_app_user_ip_max_failures": 20,
  "vg_app_user_ip_window_minutes": 15,
  "vg_app_user_ip_lock_duration_minutes": 30,
  "admin_pw": "secret"
}
```

### PUT `/v1/projects/:projectId/app-users/settings`

Updates app user settings for a project (admin only). Creates project-level overrides.

**Auth**: `Authorization: Bearer <admin-session-token>`

**Request body**

```json
{
  "vg_app_user_ip_max_failures": 15,
  "admin_pw": "project-secret"
}
```

## App Users

### POST `/projects/:projectId/app-users/:id/active`

Activates or deactivates an app user.

**Auth**: `Authorization: Bearer <admin-session-token>`

**Request body**

```json
{ "active": true }
```

`active` must be a boolean. Non-boolean values (for example `"true"` or `1`) return an `invalidDataTypeOfParameter` problem response.

If the app user does not belong to the provided `projectId`, this endpoint returns `404 Not Found`.
