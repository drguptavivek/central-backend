-- Preserve valid event numbers and assign only missing legacy events after the
-- current maximum. The update does not fire the blanking trigger because each
-- affected row has OLD.event IS NULL.
WITH event_base AS (
  SELECT coalesce(max(event), 0) AS max_event
  FROM submissions
), numbered AS (
  SELECT
    submissions.id,
    event_base.max_event + row_number() OVER (
      ORDER BY coalesce(submissions."updatedAt", submissions."createdAt"), submissions.id
    ) AS event
  FROM submissions
  CROSS JOIN event_base
  WHERE submissions.event IS NULL
)
UPDATE submissions
SET event = numbered.event
FROM numbered
WHERE submissions.id = numbered.id;

UPDATE current_event
SET event = (SELECT coalesce(max(event), 0) FROM submissions);
