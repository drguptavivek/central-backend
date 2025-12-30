# VG Core Server Edits

This file tracks VG changes made directly to upstream core files.

## lib/resources/vg-app-user-auth.js
- Ensure login handles missing JSON body by defaulting to an empty payload and returning missingParameters instead of throwing.
