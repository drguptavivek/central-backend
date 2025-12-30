# VG Core Server Edits

This file tracks VG changes made directly to upstream core files.

## lib/resources/vg-app-user-auth.js
- Ensure login handles missing JSON body by defaulting to an empty payload and returning missingParameters instead of throwing.
- Treat whitespace-only username/password as missingParameters during login.
- Validate login deviceId/comments as strings before recording sessions.
- Validate change-password old/new password types and treat whitespace-only values as missing.
- Restrict session settings numeric strings to integer values.
- Validate reset-password newPassword type and treat whitespace-only values as missing.
- Validate self-revoke deviceId as string.
- Allow admin session revoke when the session's projectId is null (field_keys deleted) without returning 404.

## lib/domain/vg-app-user-auth.js
- Return invalidDataTypeOfParameter when patching fullName/phone with non-string values.
- Normalize whitespace-only phone values to null.
- When revoking sessions without a projectId, skip audit acteeId and synthesize a field_key actor for session termination.
- Reject self revoke when the current auth session is missing.

## lib/model/query/vg-app-user-auth.js
- Use a LEFT JOIN to field_keys for session lookups to allow revoke after field key deletion.
- When ip is missing, scope lockout status/clears to rows with null ip instead of all IPs.
