BEGIN;

-- Add timestamps to vg_settings
ALTER TABLE vg_settings ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE vg_settings ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Add timestamps to vg_project_settings
ALTER TABLE vg_project_settings ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE vg_project_settings ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

COMMIT;
