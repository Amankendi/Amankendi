-- Control-plane metadata only. No customer business records or provider tokens.
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('internal','client')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  repository TEXT NOT NULL UNIQUE,
  worker_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'provisioning' CHECK (status IN ('provisioning','ready','approved','dispatched','error')),
  approved_sha TEXT,
  last_deploy_run_id TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS projects_kind_idx ON projects(kind,created_at DESC);
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS audit_project_idx ON audit_events(project_id, created_at DESC);
