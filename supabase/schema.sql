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
  updated_at TIMESTAMPTZ DEFAULT now(),
  views INTEGER DEFAULT 0,
  owner_token_hash TEXT,
  user_id UUID REFERENCES auth.users(id),
  is_public BOOLEAN NOT NULL DEFAULT TRUE
);

-- Indexes for search and filtering
CREATE INDEX idx_shared_builds_archetype ON shared_builds(archetype);
CREATE INDEX idx_shared_builds_primary ON shared_builds(primary_set);
CREATE INDEX idx_shared_builds_secondary ON shared_builds(secondary_set);
CREATE INDEX idx_shared_builds_created ON shared_builds(created_at DESC);
CREATE INDEX idx_shared_builds_views ON shared_builds(views DESC);
CREATE INDEX idx_shared_builds_user_id ON shared_builds(user_id);
CREATE INDEX idx_shared_builds_search ON shared_builds
  USING GIN (to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || coalesce(author_name, '')));

-- Row Level Security
ALTER TABLE shared_builds ENABLE ROW LEVEL SECURITY;

-- Anon/public role: only public builds
CREATE POLICY "Public read" ON shared_builds
  FOR SELECT USING (is_public = TRUE);

-- Authenticated users: all public builds + their own private builds
CREATE POLICY "Owner read private" ON shared_builds
  FOR SELECT TO authenticated
  USING (is_public = TRUE OR user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies for anon role.
-- The edge functions use the service role key, which bypasses RLS.

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

-- ============================================
-- Migration: Owner token support (run on existing databases)
-- ============================================
-- ALTER TABLE shared_builds ADD COLUMN IF NOT EXISTS owner_token_hash TEXT;
-- ALTER TABLE shared_builds ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ============================================
-- Migration: Discord OAuth support (run on existing databases)
-- ============================================
-- ALTER TABLE shared_builds ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
-- CREATE INDEX IF NOT EXISTS idx_shared_builds_user_id ON shared_builds(user_id);

-- ============================================
-- Migration: Personal Vault support (run on existing databases)
-- ============================================
-- 1. Add the is_public column (defaults TRUE — all existing builds remain public)
-- ALTER TABLE shared_builds ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;
--
-- 2. Index for the filtered public browse query
-- CREATE INDEX IF NOT EXISTS idx_shared_builds_is_public ON shared_builds(is_public) WHERE is_public = TRUE;
--
-- 3. Replace the permissive read policy with visibility-aware policies
-- DROP POLICY IF EXISTS "Public read" ON shared_builds;
--
-- Anon/public role: only public builds
-- CREATE POLICY "Public read" ON shared_builds
--   FOR SELECT
--   USING (is_public = TRUE);
--
-- Authenticated users: their own builds (public or private) + all public builds
-- CREATE POLICY "Owner read private" ON shared_builds
--   FOR SELECT
--   TO authenticated
--   USING (is_public = TRUE OR user_id = auth.uid());

-- ============================================
-- Migration: Auction house price cache (run on existing databases)
-- ============================================
-- Caches average/min/max prices fetched from the HC auction API.
-- The auction-prices edge function is the only writer (service role).
-- Anon role can read prices (they're not sensitive).
--
-- CREATE TABLE auction_prices (
--   raw_identifier TEXT PRIMARY KEY,
--   avg_price BIGINT,
--   min_price BIGINT,
--   max_price BIGINT,
--   sample_count INTEGER,
--   last_sale_at TIMESTAMPTZ,
--   fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
--   not_found BOOLEAN NOT NULL DEFAULT FALSE
-- );
--
-- CREATE INDEX idx_auction_prices_fetched ON auction_prices(fetched_at);
--
-- ALTER TABLE auction_prices ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Public read prices" ON auction_prices
--   FOR SELECT USING (TRUE);
-- -- No INSERT/UPDATE policies: only service role (edge function) writes.

-- ============================================
-- Migration: Profiles + author handles (Phase 1 — APPLIED 2026-05-01)
-- ============================================
-- Adds a profiles table so users can pick a public handle (URL slug) and a
-- display name independent of their Discord identity. Per-build author_name
-- on shared_builds is preserved as-is (option 2: per-build name overrides).
--
-- Field-name mapping (verified against live auth.users rows, 2026-05-01):
--   Discord (iss = discord.com/api):
--     provider_id                  Discord snowflake (immutable)
--     full_name                    Discord username, e.g. "savant01"
--     name                         Username + legacy '#0' suffix, e.g. "savant01#0"
--     custom_claims.global_name    Discord display name, e.g. "Savant"  (NESTED — not top-level;
--                                  empty string "" when user hasn't set one)
--     avatar_url                   CDN URL
--   SimpleLogin (iss = app.simplelogin.io) and other providers:
--     none of the Discord fields are present; only email/sub
--
-- The COALESCE chain for display_name uses NULLIF(..., '') so empty Discord
-- global_names fall through to full_name, and a final email-prefix fallback
-- handles non-Discord providers.

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Reserved handle list. Stub seeded with system-level terms; CoH-specific
-- reserved words can be added later via plain INSERTs without schema changes.
-- Enforcement happens in the update-profile edge function (CHECK constraints
-- can't reference other tables).
CREATE TABLE reserved_handles (
  handle CITEXT PRIMARY KEY,
  reason TEXT DEFAULT ''
);

INSERT INTO reserved_handles (handle, reason) VALUES
  ('admin','system'), ('api','system'), ('auth','system'),
  ('author','route'), ('builds','route'), ('build','route'),
  ('login','route'), ('logout','route'), ('me','route'),
  ('settings','route'), ('profile','route'), ('public','route'),
  ('signup','route'), ('signin','route'), ('support','system'),
  ('help','system'), ('new','route'), ('edit','route'),
  ('delete','route'), ('undefined','sentinel'), ('null','sentinel'),
  ('anonymous','sentinel'), ('system','system');
-- TODO: add CoH-specific reserved handles here as we identify them.

CREATE TABLE profiles (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle            CITEXT UNIQUE,                -- public URL slug, nullable until claimed
  display_name      TEXT NOT NULL DEFAULT '',     -- shown on cards by default
  discord_id        TEXT,                         -- immutable Discord snowflake
  discord_username  TEXT,                         -- cached username, for "verified" badge
  avatar_url        TEXT,
  bio               TEXT NOT NULL DEFAULT '',
  handle_changed_at TIMESTAMPTZ,                  -- gates 30-day cooldown
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT handle_format CHECK (
    handle IS NULL OR handle::text ~ '^[a-z0-9][a-z0-9_-]{2,29}$'
  ),
  CONSTRAINT display_name_length CHECK (char_length(display_name) <= 30),
  CONSTRAINT bio_length CHECK (char_length(bio) <= 280)
);

CREATE INDEX idx_profiles_display_name_trgm ON profiles USING GIN (display_name gin_trgm_ops);
CREATE INDEX idx_profiles_handle_trgm       ON profiles USING GIN ((handle::text) gin_trgm_ops);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserved_handles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (TRUE);
-- reserved_handles has RLS enabled with no policies: only service role reads/writes.
-- Writes to profiles go through the update-profile edge function (service role).

-- Auto-touch updated_at
CREATE OR REPLACE FUNCTION touch_profile_updated_at()
RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_touch_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_profile_updated_at();

-- Seed a profile on first sign-up. Handle stays NULL until the user picks one.
-- NULLIF(..., '') is required because Discord stores an empty string for
-- global_name when the user hasn't set one — COALESCE only skips NULLs.
CREATE OR REPLACE FUNCTION seed_profile_on_signup()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id, display_name, discord_id, discord_username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->'custom_claims'->>'global_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'name', ''),
      NULLIF(split_part(NEW.email, '@', 1), ''),
      ''
    ),
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION seed_profile_on_signup();

-- Backfill profiles for users who already exist
INSERT INTO profiles (user_id, display_name, discord_id, discord_username, avatar_url)
SELECT
  id,
  COALESCE(
    NULLIF(raw_user_meta_data->'custom_claims'->>'global_name', ''),
    NULLIF(raw_user_meta_data->>'full_name', ''),
    NULLIF(raw_user_meta_data->>'name', ''),
    NULLIF(split_part(email, '@', 1), ''),
    ''
  ),
  raw_user_meta_data->>'provider_id',
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Joined view for build queries — replaces direct selects from shared_builds
-- in the search/list paths so cards can render handle + verified avatar.
CREATE VIEW shared_builds_with_author AS
SELECT b.*,
       p.handle       AS author_handle,
       p.display_name AS author_display_name,
       p.avatar_url   AS author_avatar_url
FROM shared_builds b
LEFT JOIN profiles p ON p.user_id = b.user_id;

-- Author-search RPC for the autocomplete dropdown.
-- Returns one row per profile, ranked by trigram similarity over both
-- display_name and handle, with a build_count tiebreaker.
CREATE OR REPLACE FUNCTION search_authors(q TEXT, lim INT DEFAULT 10)
RETURNS TABLE (
  user_id      UUID,
  handle       CITEXT,
  display_name TEXT,
  avatar_url   TEXT,
  build_count  BIGINT,
  sim          REAL
)
LANGUAGE sql STABLE AS $$
  SELECT p.user_id, p.handle, p.display_name, p.avatar_url,
         COUNT(b.id) FILTER (WHERE b.is_public) AS build_count,
         GREATEST(
           similarity(p.display_name, q),
           COALESCE(similarity(p.handle::text, q), 0)
         ) AS sim
  FROM profiles p
  LEFT JOIN shared_builds b ON b.user_id = p.user_id
  WHERE p.display_name % q OR p.handle::text % q
  GROUP BY p.user_id, p.handle, p.display_name, p.avatar_url
  ORDER BY sim DESC, build_count DESC
  LIMIT lim;
$$;

-- Resolver for /author/@handle URLs
CREATE OR REPLACE FUNCTION resolve_author(h TEXT)
RETURNS TABLE (
  user_id      UUID,
  handle       CITEXT,
  display_name TEXT,
  avatar_url   TEXT,
  bio          TEXT
)
LANGUAGE sql STABLE AS $$
  SELECT user_id, handle, display_name, avatar_url, bio
  FROM profiles
  WHERE handle = h::citext
$$;

-- ============================================
-- Admin: Assign an owner token to a legacy build
-- ============================================
-- 1. Pick a token (any string, e.g. a UUID):
--    SELECT gen_random_uuid();  -- generates something like 'a1b2c3d4-...'
--
-- 2. Set the hash on the build:
--    UPDATE shared_builds
--    SET owner_token_hash = encode(sha256(convert_to('YOUR-TOKEN-HERE', 'UTF8')), 'hex')
--    WHERE id = 'BUILD-ID-HERE';
--
-- 3. Use that token in the app's "Reclaim" button on the build detail page.
