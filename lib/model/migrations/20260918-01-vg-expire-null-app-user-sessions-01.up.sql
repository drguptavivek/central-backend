-- Core bearer authentication reads sessions, so invalidate its matching row
-- before changing the VG metadata that identifies legacy sessions.
UPDATE sessions
SET "expiresAt" = statement_timestamp() - interval '1 second'
WHERE token IN (
  SELECT token
  FROM vg_app_user_sessions
  WHERE expires_at IS NULL
);

UPDATE vg_app_user_sessions
SET expires_at = statement_timestamp() - interval '1 second'
WHERE expires_at IS NULL;
