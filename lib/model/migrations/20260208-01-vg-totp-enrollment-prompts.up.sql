-- Make totp_secret nullable for enrollment tracking
-- (users who haven't set up TOTP yet won't have a secret)
ALTER TABLE vg_web_user_totp
  ALTER COLUMN totp_secret DROP NOT NULL;

-- Add columns for tracking TOTP enrollment prompt state
ALTER TABLE vg_web_user_totp
  ADD COLUMN IF NOT EXISTS totp_prompt_dismissed_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS totp_prompt_remind_after timestamptz NULL;

-- Index for efficient prompt status queries
-- Only index rows where prompt is pending (not dismissed and not already enrolled)
CREATE INDEX IF NOT EXISTS idx_vg_web_user_totp_prompt_remind
  ON vg_web_user_totp(totp_prompt_remind_after)
  WHERE totp_prompt_remind_after IS NOT NULL AND totp_enabled = false;

-- Add system setting for roles that require mandatory TOTP enrollment
-- Default: only admin role requires 2FA
INSERT INTO vg_settings (vg_key_name, vg_key_value)
VALUES (
  'vg_totp_mandatory_roles',
  '["admin"]'
)
ON CONFLICT (vg_key_name) DO NOTHING;
