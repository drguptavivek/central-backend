-- VG: Service Account Flag
-- Add columns to users table to mark service accounts (automated systems)
--
-- Service accounts are automated systems (CI/CD, bots, dashboards) that:
-- - Cannot perform interactive 2FA verification
-- - Rely on mandatory IP whitelist security instead
-- - Are excluded from TOTP enrollment prompts
-- - Get shorter session lifetimes (1 hour vs 24 hours)

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_service_account BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS service_account_marked_at TIMESTAMPTZ NULL;

-- Index for performance (partial index, only service accounts)
CREATE INDEX IF NOT EXISTS idx_users_service_account ON users (is_service_account)
  WHERE is_service_account = true;

COMMIT;
