# Author Features — Plan & Progress

Planning two related features for Shared Builds:

1. **Robust author search** — find builds by author with fuzzy/typo-tolerant matching.
2. **Shareable author links** — public URL listing all of an author's public builds.

Both depend on a shared foundation: a `profiles` table that gives each Discord-authenticated user a stable, customizable public identity.

---

## Design decisions (locked in)

- **Custom handles, not Discord names.** Users pick their own `handle` (URL slug) and `display_name`, separate from their Discord identity. Discord username is cached for a "verified" badge only.
- **Per-build author name preserved** (option 2). `shared_builds.author_name` stays as a per-build override that defaults to the user's profile `display_name` at publish time. Renaming the profile doesn't rewrite history. Mirrors GitHub's commit-name vs. profile-name model.
- **Handle format:** `^[a-z0-9][a-z0-9_-]{2,29}$` (3–30 chars, lowercase alphanumeric + `_` + `-`, no leading dash/underscore). CITEXT for case-insensitive uniqueness.
- **Handle change cooldown:** once per 30 days, tracked via `handle_changed_at`.
- **Reserved handles:** stored in a `reserved_handles` table (extensible without schema changes). Seeded with system terms. CoH-specific entries to be added later.
- **Anonymous author URLs:** not shipping. `/author/@handle` only works for users with a profile + handle. Anonymous/legacy builds render author name as plain text.
- **Search backend:** Postgres `pg_trgm` extension; trigram GIN indexes on `display_name` and `handle`; `search_authors(q, lim)` RPC for autocomplete.
- **URL shape:** `/author/@{handle}` (resolved via `resolve_author(h)` RPC).

---

## Rollout plan

Each step is independently deployable and reversible.

- [x] **Step 0 — Plan & migration draft.** Migration SQL appended to [supabase/schema.sql](supabase/schema.sql) as a commented-out block. Not yet applied.
- [x] **Step 1 — Apply migration (2026-05-01).** Verified Discord OAuth metadata against live `auth.users` rows, corrected COALESCE chain, applied migration in Supabase SQL editor, backfilled all existing profiles. `schema.sql` now uncommented and matches live DB. See **Step 1 lessons** below.
- [ ] **Step 2 — `update-profile` edge function.** Handle/display_name/bio writes; reserved-handle check via `reserved_handles` table; 30-day handle cooldown; refresh `discord_username` / `avatar_url` from JWT each call.
- [ ] **Step 3 — Profile settings page.** New route `/settings/profile` (auth-required), accessible from user menu. Shows avatar (read-only), display_name, handle (with availability check + cooldown notice), bio, verified Discord username. First-publish prompt to claim a handle.
- [ ] **Step 4 — Switch reads to the joined view.** `searchSharedBuilds` selects from `shared_builds_with_author` instead of `shared_builds`. Linkify author names on `BuildCard` + `BuildDetailPage` when `user_id` + `handle` exist; render plain text + "unverified" label otherwise.
- [ ] **Step 5 — `/author/@handle` route + page.** New `AuthorPage.tsx` showing profile header (display_name, avatar, bio, build count) + filterable build grid pre-scoped to `authorId`.
- [ ] **Step 6 — Fuzzy author search in filters.** Add author input to `BuildFilters` with debounced autocomplete via `search_authors` RPC. Selecting a result sets `authorId` and re-queries.

---

## Schema additions (live in [supabase/schema.sql](supabase/schema.sql))

```
profiles
  user_id           UUID PK → auth.users(id)
  handle            CITEXT UNIQUE                -- nullable until claimed
  display_name      TEXT (≤30)
  discord_id        TEXT                         -- immutable
  discord_username  TEXT                         -- for verified badge
  avatar_url        TEXT
  bio               TEXT (≤280)
  handle_changed_at TIMESTAMPTZ
  created_at, updated_at

reserved_handles
  handle  CITEXT PK
  reason  TEXT

shared_builds_with_author    -- VIEW: shared_builds LEFT JOIN profiles
search_authors(q, lim)       -- RPC: fuzzy author autocomplete
resolve_author(h)            -- RPC: handle → profile
```

Triggers:
- `seed_profile_on_signup` on `auth.users` INSERT — auto-creates profile row with `handle = NULL`.
- `touch_profile_updated_at` on `profiles` UPDATE.

Plus a one-time backfill INSERT for existing users.

---

## Step 1 lessons (kept for future migrations touching `auth.users`)

The original plan's COALESCE chain was wrong in two places, only caught by inspecting real rows:

1. **`global_name` is nested under `custom_claims`**, not top-level. The original chain (`full_name → name → global_name`) would never have found it, defaulting all users to their cryptic Discord username instead of their display name.
2. **There is no top-level `user_name` key** in Supabase's Discord OAuth metadata. The closest equivalents are `full_name` (clean username) and `name` (with legacy `#0` discriminator suffix).

After fixing those, two more edge cases surfaced from the backfill:

3. **Discord stores empty `""` for `global_name`** when a user hasn't set a display name (4 of our users). `COALESCE` only skips NULLs, not empty strings — so the chain stopped on `""` and produced empty display_names. Fix: wrap each candidate in `NULLIF(value, '')`.
4. **Non-Discord providers** (we have one SimpleLogin user) have *none* of the Discord fields. Final fallback added: `NULLIF(split_part(email, '@', 1), '')` so they at least get an email-prefix display name.

Final COALESCE chain (in [supabase/schema.sql](supabase/schema.sql)):

```sql
COALESCE(
  NULLIF(raw_user_meta_data->'custom_claims'->>'global_name', ''),
  NULLIF(raw_user_meta_data->>'full_name', ''),
  NULLIF(raw_user_meta_data->>'name', ''),
  NULLIF(split_part(email, '@', 1), ''),
  ''
)
```

`discord_username` is sourced from `full_name` (clean, no `#0` suffix) and is NULL for non-Discord providers — correctly suppresses the "verified" badge for them.

---

## Files touched so far

- [supabase/schema.sql](supabase/schema.sql) — migration block appended, applied, and uncommented.
- This file.
