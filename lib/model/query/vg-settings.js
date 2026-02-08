// VG Settings Query Module
//
// Access to vg_settings table for custom system configuration

const { sql } = require('slonik');

/**
 * Get a setting value by key
 */
const get = (key) => ({ maybeOne }) =>
  maybeOne(sql`
    SELECT vg_key_value
    FROM vg_settings
    WHERE vg_key_name = ${key}
  `).then((opt) => opt.map((row) => row.vg_key_value).orElse(null));

/**
 * Set a setting value by key
 */
const set = (key, value) => ({ run }) =>
  run(sql`
    INSERT INTO vg_settings (vg_key_name, vg_key_value)
    VALUES (${key}, ${value})
    ON CONFLICT (vg_key_name)
    DO UPDATE SET vg_key_value = ${value}
  `);

module.exports = { get, set };