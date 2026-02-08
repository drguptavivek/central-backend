BEGIN;

ALTER TABLE vg_settings DROP COLUMN IF EXISTS created_at;
ALTER TABLE vg_settings DROP COLUMN IF EXISTS updated_at;

ALTER TABLE vg_project_settings DROP COLUMN IF EXISTS created_at;
ALTER TABLE vg_project_settings DROP COLUMN IF EXISTS updated_at;

COMMIT;
