-- The Call API schema (D1 / SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS magic_links (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS trays (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  blurb TEXT NOT NULL DEFAULT '',
  official INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  track TEXT NOT NULL,
  proposed_label TEXT,
  diagnosis TEXT NOT NULL,
  plain TEXT NOT NULL,
  scientific TEXT NOT NULL,
  lookalikes TEXT NOT NULL,
  blurb TEXT NOT NULL,
  about TEXT NOT NULL DEFAULT '',
  stain TEXT NOT NULL DEFAULT '',
  mag TEXT NOT NULL DEFAULT '',
  difficulty INTEGER NOT NULL DEFAULT 3,
  credit TEXT NOT NULL DEFAULT 'contributor',
  created_at INTEGER NOT NULL,
  reviewed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS submission_files (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  content_type TEXT NOT NULL DEFAULT 'image/jpeg',
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

-- One counted call per player per daily field. Logged-in players use users.id;
-- anonymous players use a hash of the HttpOnly call_anon cookie.
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

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_files_submission ON submission_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_field_calls_player
  ON field_calls(day_key, tray_id, field_index, player_kind, player_key);
CREATE INDEX IF NOT EXISTS idx_field_calls_field
  ON field_calls(day_key, tray_id, field_index);

INSERT OR IGNORE INTO trays (id, label, blurb, official) VALUES
  ('morphology', 'Human morphology', 'Liver, skin, muscle, nerves, squamous sheets, and normal blood cells.', 1),
  ('organisms', 'Parasites & organisms', 'Malaria, worms, bacteria, fungi, and the rest of the menagerie.', 1),
  ('abnormal', 'Abnormal morphology', 'Sickle cells, leukemias, schistocytes of TTP, and other disease shapes.', 1),
  ('cytology', 'Cytology', 'Pap smears: koilocytes, HSIL, clue cells, herpes, and the rest of the tray.', 1);
