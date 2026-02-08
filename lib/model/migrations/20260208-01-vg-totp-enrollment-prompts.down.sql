-- Rollback TOTP enrollment prompt tracking

-- Remove system setting
DELETE FROM vg_settings WHERE vg_key_name = 'vg_totp_mandatory_roles';

-- Remove index
DROP INDEX IF EXISTS idx_vg_web_user_totp_prompt_remind;

-- Remove columns
ALTER TABLE vg_web_user_totp
  DROP COLUMN IF EXISTS totp_prompt_remind_after,
  DROP COLUMN IF EXISTS totp_prompt_dismissed_at;

-- Restore NOT NULL constraint on totp_secret
-- (Only safe if all rows have totp_secret populated)
ALTER TABLE vg_web_user_totp
  ALTER COLUMN totp_secret SET NOT NULL;
