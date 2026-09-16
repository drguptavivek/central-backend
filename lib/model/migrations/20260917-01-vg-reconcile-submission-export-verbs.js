// Reconcile the role-level permission for submission exports.
//
// Export endpoints require submission.export.  Project Managers and
// Administrators are allowed to export; Project Viewers and Data Managers are
// intentionally not.  This repairs upgraded databases where earlier
// migrations left those role arrays out of sync with the intended policy.

const up = async (db) => {
  await db.raw(`
    UPDATE roles
    SET verbs = CASE
      WHEN system IN ('admin', 'manager')
        THEN (verbs - 'submission.export') || '["submission.export"]'::jsonb
      WHEN system IN ('viewer', 'data_mgr')
        THEN verbs - 'submission.export'
    END
    WHERE system IN ('admin', 'manager', 'viewer', 'data_mgr')
      AND verbs IS NOT NULL
      AND jsonb_typeof(verbs) = 'array'
  `);
};

// The correction is intentionally append-only.  There is no safe inverse for
// upgraded databases because this migration cannot know which role arrays had
// been changed by an administrator before it ran.
const down = async () => {};

module.exports = { up, down };
