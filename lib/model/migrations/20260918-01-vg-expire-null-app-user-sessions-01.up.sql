UPDATE vg_app_user_sessions
SET expires_at = statement_timestamp() - interval '1 second'
WHERE expires_at IS NULL;
