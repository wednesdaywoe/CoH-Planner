-- ============================================
-- CoH-Planner Shared Builds — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project
-- ============================================

-- Shared builds table
CREATE TABLE shared_builds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  archetype TEXT NOT NULL,
  archetype_name TEXT NOT NULL,
  primary_set TEXT NOT NULL,
  primary_name TEXT NOT NULL,
  secondary_set TEXT NOT NULL,
  secondary_name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 50,
  author_name TEXT DEFAULT '',
  server TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  build_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  views INTEGER DEFAULT 0
);

-- Indexes for search and filtering
CREATE INDEX idx_shared_builds_archetype ON shared_builds(archetype);
CREATE INDEX idx_shared_builds_primary ON shared_builds(primary_set);
CREATE INDEX idx_shared_builds_secondary ON shared_builds(secondary_set);
CREATE INDEX idx_shared_builds_created ON shared_builds(created_at DESC);
CREATE INDEX idx_shared_builds_views ON shared_builds(views DESC);
CREATE INDEX idx_shared_builds_search ON shared_builds
  USING GIN (to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || coalesce(author_name, '')));

-- Row Level Security
ALTER TABLE shared_builds ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public read" ON shared_builds
  FOR SELECT USING (true);

-- No INSERT/UPDATE/DELETE policies for anon role.
-- The edge function uses the service role key, which bypasses RLS.

-- ============================================
-- Rate limiting table
-- ============================================

CREATE TABLE rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(ip, action, created_at);

-- RLS enabled with no policies = only service role can access
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Auto-cleanup: delete rate limit entries older than 2 hours
-- (Run as a cron job via pg_cron or Supabase scheduled function)

-- ============================================
-- View counter RPC function
-- ============================================

CREATE OR REPLACE FUNCTION increment_views(build_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shared_builds SET views = views + 1 WHERE id = build_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
