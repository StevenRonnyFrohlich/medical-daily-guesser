-- Incremental apply for the existing remote D1 `the-call`.
-- Safe to re-run. Does not drop users or sessions.
--
--   npx wrangler d1 execute the-call --remote --file=worker/migrations/0001_field_calls.sql
--   npx wrangler d1 execute the-call --local --file=worker/migrations/0001_field_calls.sql

CREATE TABLE IF NOT EXISTS field_calls (
  id TEXT PRIMARY KEY,
  day_key TEXT NOT NULL,
  tray_id TEXT NOT NULL,
  field_index INTEGER NOT NULL,
  specimen_id TEXT NOT NULL DEFAULT '',
  guess TEXT NOT NULL,
  player_kind TEXT NOT NULL,
  player_key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_field_calls_player
  ON field_calls(day_key, tray_id, field_index, player_kind, player_key);
CREATE INDEX IF NOT EXISTS idx_field_calls_field
  ON field_calls(day_key, tray_id, field_index);
