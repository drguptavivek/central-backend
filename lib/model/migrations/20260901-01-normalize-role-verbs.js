// Repair role verb arrays written by earlier VG migrations. Role verbs are a
// set semantically; duplicate entries make role and project metadata disagree,
// while retaining each role's upstream permissions.

const up = async (db) => {
  await db.raw(`
    UPDATE roles
    SET verbs = COALESCE((
      SELECT jsonb_agg(verb ORDER BY first_position)
      FROM (
        SELECT value AS verb, min(ordinality) AS first_position
        FROM jsonb_array_elements(roles.verbs) WITH ORDINALITY
        GROUP BY value
      ) AS unique_verbs
    ), '[]'::jsonb)
    WHERE verbs IS NOT NULL AND jsonb_typeof(verbs) = 'array'
  `);
};

// This migration repairs persisted role metadata and is intentionally not
// reversible: restoring duplicate verbs would reintroduce the defect.
const down = async () => {};

module.exports = { up, down };
