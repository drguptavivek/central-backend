-- VG: Rollback Service Account Flag

BEGIN;

DROP INDEX IF EXISTS idx_users_service_account;

ALTER TABLE users
  DROP COLUMN IF EXISTS is_service_account,
  DROP COLUMN IF EXISTS service_account_marked_at;

COMMIT;
