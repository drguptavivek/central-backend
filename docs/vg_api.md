# VG API Additions

This document captures VG-specific API additions/changes in this fork.

## Submission export authorization

CSV, ZIP, and OData export requires the explicit `submission.export` verb.
`submission.read` permits submission listing, individual submission detail, and
attachment retrieval, but never grants export access.

| Project role | Read/list submissions | CSV, ZIP, and OData export |
| --- | --- | --- |
| Administrator (`admin`) | Allowed | Allowed |
| Project Manager (`manager`) | Allowed | Allowed |
| Project Viewer (`viewer`) | Allowed | Denied |
| Data Manager (`data_mgr`) | Allowed, including review workflows | Denied |
| Custom role | According to assigned verbs | Allowed only with `submission.export` |

The rule applies to published and draft CSV/ZIP endpoints and to OData service,
metadata, collection, and row endpoints. Migration
`20260917-01-vg-reconcile-submission-export-verbs` reconciles older databases
that retained the historical Viewer verb with the fresh-install role matrix.

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

The bearer must identify an active, undeleted App User with a non-null VG
session expiry later than the authentication statement. Expired, revoked,
null-expiry, inactive, or deleted credentials return 401 and record no
telemetry. `status` can become `"invalidated"` only if the core session is
invalidated concurrently after that strict check.

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
