CREATE TABLE IF NOT EXISTS inquiries (
  request_id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  payload_sha256 TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  topic TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  quantity TEXT NOT NULL DEFAULT '',
  finish TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  items_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(items_json)),
  inquiry_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  notes TEXT NOT NULL DEFAULT '',
  email_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'accepted', 'failed')),
  email_id TEXT NOT NULL DEFAULT '',
  email_updated_at TEXT
);

CREATE INDEX IF NOT EXISTS inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS inquiries_status_created_at ON inquiries(status, created_at);
