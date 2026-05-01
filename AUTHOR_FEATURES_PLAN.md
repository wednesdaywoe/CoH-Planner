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
- [ ] **Step 1 — Apply migration.** Verify Discord OAuth metadata field names against a live `auth.users.raw_user_meta_data` row, uncomment the block, run it in the Supabase SQL editor. Invisible to users.
- [ ] **Step 2 — `update-profile` edge function.** Handle/display_name/bio writes; reserved-handle check via `reserved_handles` table; 30-day handle cooldown; refresh `discord_username` / `avatar_url` from JWT each call.
- [ ] **Step 3 — Profile settings page.** New route `/settings/profile` (auth-required), accessible from user menu. Shows avatar (read-only), display_name, handle (with availability check + cooldown notice), bio, verified Discord username. First-publish prompt to claim a handle.
- [ ] **Step 4 — Switch reads to the joined view.** `searchSharedBuilds` selects from `shared_builds_with_author` instead of `shared_builds`. Linkify author names on `BuildCard` + `BuildDetailPage` when `user_id` + `handle` exist; render plain text + "unverified" label otherwise.
- [ ] **Step 5 — `/author/@handle` route + page.** New `AuthorPage.tsx` showing profile header (display_name, avatar, bio, build count) + filterable build grid pre-scoped to `authorId`.
- [ ] **Step 6 — Fuzzy author search in filters.** Add author input to `BuildFilters` with debounced autocomplete via `search_authors` RPC. Selecting a result sets `authorId` and re-queries.

---

## Schema additions (pending — see commented block in schema.sql)

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

## Open verification before applying step 1

Run in Supabase SQL editor and inspect the JSON:

```sql
SELECT id, raw_user_meta_data FROM auth.users LIMIT 3;
```

Confirm the keys used in `seed_profile_on_signup()` match what Discord/Supabase actually populated (`full_name`, `name`, `global_name`, `user_name`, `provider_id`, `avatar_url`). Adjust the COALESCE chain if needed.

---

## Files touched so far

- [supabase/schema.sql](supabase/schema.sql) — migration block appended (commented out, no runtime effect).
- This file.

Nothing else has been modified. Safe to commit and resume later.
