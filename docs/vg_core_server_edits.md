# VG Core Server Edits

This file tracks VG changes made directly to upstream core files.

## lib/resources/vg-app-user-auth.js
- Ensure login handles missing JSON body by defaulting to an empty payload and returning missingParameters instead of throwing.
- Treat whitespace-only username/password as missingParameters during login.
- Validate login deviceId/comments as strings before recording sessions.
- Validate change-password old/new password types and treat whitespace-only values as missing.

## lib/domain/vg-app-user-auth.js
- Return invalidDataTypeOfParameter when patching fullName/phone with non-string values.
