# Author Features — Plan & Progress

**Status: complete (2026-05-01).** All six rollout steps shipped in a single session. See [Lessons & gotchas](#lessons--gotchas) below for the non-obvious bumps along the way.

Two related features for Shared Builds:

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
- **Anonymous author URLs:** not shipping. `/author/{handle}` only works for users with a profile + handle. Anonymous/legacy builds render author name as plain text.
- **Search backend:** Postgres `pg_trgm` extension; trigram GIN indexes on `display_name` and `handle`; `search_authors(q, lim)` RPC for autocomplete (combines ILIKE substring/prefix with trigram fuzzy — pure trigram failed for short autocomplete queries).
- **URL shape:** `/author/{handle}` (resolved via `resolve_author(h)` RPC). Handle is shown as `@handle` in UI but the URL itself is plain — TanStack Router doesn't bind `$param` cleanly when prefixed with non-alnum literals like `@`.

---

## Rollout plan

Each step is independently deployable and reversible.

- [x] **Step 0 — Plan & migration draft.** Migration SQL appended to [supabase/schema.sql](supabase/schema.sql) as a commented-out block.
- [x] **Step 1 — Apply migration.** Verified Discord OAuth metadata against live `auth.users` rows, corrected COALESCE chain, applied migration, backfilled all existing profiles. `schema.sql` now uncommented and matches live DB.
- [x] **Step 2 — `update-profile` edge function.** Handle/display_name/bio writes; reserved-handle check via `reserved_handles` table; 30-day handle cooldown; refreshes `discord_username` / `avatar_url` from JWT each call.
- [x] **Step 3 — Profile settings page.** `/settings` refactored into a layout with tab nav. New `/settings/profile` (auth-required) accessible from user menu. Shows avatar + verified Discord username (read-only), editable display_name / handle / bio, with cooldown notice when `handle_changed_at` is recent. First-publish prompt deferred (lives in the publish flow, not this page).
- [x] **Step 4 — Switch reads to the joined view.** `searchSharedBuilds`, `getSharedBuild`, `getMyBuilds`, `getFavoriteBuilds` all read from `shared_builds_with_author`. Author bylines linkify to `/author/{handle}` when `user_id` + `handle` exist; plain text otherwise. ("Unverified" label on anonymous builds dropped — felt harsh; can revisit.)
- [x] **Step 5 — `/author/{handle}` route + page.** `AuthorPage.tsx` shows profile header (display_name, avatar, @handle, bio, build count) + builds grid scoped to `authorId`, with search + sort + pagination. Archetype/powerset filters intentionally omitted (too narrow on a single author's catalogue).
- [x] **Step 6 — Fuzzy author search in filters.** `AuthorAutocomplete` sub-component in `BuildFilters` with 250ms debounce, click-outside-to-close, results showing avatar + display_name + @handle + build count. RPC combines ILIKE substring/prefix matching with trigram similarity for typo tolerance.

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

## Lessons & gotchas

Worth keeping for future work that touches Supabase auth, Postgres views, or TanStack routing.

### Discord OAuth metadata (Step 1)

The original plan's COALESCE chain was wrong in two places, only caught by inspecting real rows:

1. **`global_name` is nested under `custom_claims`**, not top-level. Without this fix, all users would default to their cryptic Discord username instead of their chosen display name.
2. **There is no top-level `user_name` key** in Supabase's Discord OAuth metadata. The closest equivalents are `full_name` (clean username) and `name` (with legacy `#0` discriminator suffix).

After fixing those, two more edge cases surfaced from the backfill:

3. **Discord stores empty `""` for `global_name`** when a user hasn't set one. `COALESCE` only skips NULLs, not empty strings. Fix: wrap each candidate in `NULLIF(value, '')`.
4. **Non-Discord providers** (we have one SimpleLogin user) have *none* of the Discord fields. Final fallback: `NULLIF(split_part(email, '@', 1), '')`.

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

### Edge function debugging (Step 2)

The `getUserFromAuth` helper in `supabase/functions/update-profile/` originally swallowed JWT validation errors in a `catch {}` block, returning a generic 401 with no diagnostic. Reproduced live: a copy-paste artifact `<` at the start of the JWT failed base64 decoding silently. Rewrote the helper to log the underlying error message via `console.warn` when `getUser` rejects — the cost is one log line per bad request, the value is "we know exactly why auth failed when triaging." Pattern to copy for future auth-gated edge functions.

### Postgres view security & schema cache (Step 4)

Two non-obvious issues with `shared_builds_with_author`:

1. **Views default to `security_definer`** in Postgres, meaning they bypass RLS on the underlying table. Initial create was missing `WITH (security_invoker = on)`; without that, anon role could see private builds via the view. Fix: `ALTER VIEW … SET (security_invoker = on)`.
2. **PostgREST caches the schema** and didn't pick up the joined columns until `NOTIFY pgrst, 'reload schema'` was run manually. Symptom: SQL editor returned `author_handle = 'wednesdaywoe'`, but `.from('shared_builds_with_author').select('*')` from the client returned the row without the column at all. Always reload the PostgREST schema after creating/altering views or RPCs that the client will use.

### TanStack Router literals (Step 5)

Tried `path: '/author/@$handle'` to keep the social-style URL. Route matched, but `useParams({ from: '/author/@$handle' }).handle` came back undefined — TanStack v1 doesn't bind `$param` cleanly when prefixed with non-alphanumeric literals inside a segment. Dropped the `@` from the path; URLs are now `/author/wednesdaywoe`. The `@` is purely a UI display convention — banner, profile header, build cards all show `@handle` while the URL stays clean.

### Trigram autocomplete threshold (Step 6)

Pure trigram similarity (`%` operator with default 0.3 threshold) failed for short autocomplete queries: "wed" vs "wednesdaywoe" only shares 3 trigrams out of 15 total, scoring ~0.2. Solved by combining ILIKE substring/prefix matching with trigram fuzzy in the same RPC (substring catches autocomplete-style typing, trigram catches typos when query length is similar to target). Trigram alone is fine for spellcheck / fuzzy-find UX, but inadequate for autocomplete.

---

## Files touched

**Database** ([supabase/schema.sql](supabase/schema.sql)):
- New tables: `profiles`, `reserved_handles`
- New view: `shared_builds_with_author` (with `security_invoker = on`)
- New RPCs: `search_authors(q, lim)`, `resolve_author(h)`
- New triggers: `seed_profile_on_signup`, `touch_profile_updated_at`

**Edge function:**
- New: [supabase/functions/update-profile/index.ts](supabase/functions/update-profile/index.ts)
- Modified: [supabase/config.toml](supabase/config.toml)

**Frontend:**
- New: [src/services/profile.ts](src/services/profile.ts), [src/pages/ProfileSettingsPage.tsx](src/pages/ProfileSettingsPage.tsx), [src/pages/AuthorPage.tsx](src/pages/AuthorPage.tsx), [src/components/layout/SettingsLayout.tsx](src/components/layout/SettingsLayout.tsx)
- Renamed: `SettingsPage.tsx` → [src/pages/GeneralSettings.tsx](src/pages/GeneralSettings.tsx)
- Modified: [src/types/shared.ts](src/types/shared.ts), [src/services/sharedBuilds.ts](src/services/sharedBuilds.ts), [src/components/shared/BuildCard.tsx](src/components/shared/BuildCard.tsx), [src/components/shared/BuildFilters.tsx](src/components/shared/BuildFilters.tsx), [src/pages/BuildDetailPage.tsx](src/pages/BuildDetailPage.tsx), [src/pages/BuildsPage.tsx](src/pages/BuildsPage.tsx), [src/pages/index.ts](src/pages/index.ts), [src/router.tsx](src/router.tsx), [src/components/layout/Header.tsx](src/components/layout/Header.tsx), [src/components/layout/index.ts](src/components/layout/index.ts)

---

## Future enhancements (deferred)

- **First-publish prompt to claim a handle.** When a logged-in user without a handle clicks Share/Publish, prompt them to claim one. Lives in the publish flow, not the profile page.
- **Live handle availability check** in the profile editor (debounced query as user types). Currently format is checked client-side and uniqueness is checked at Save (server returns 409 if taken).
- **Route-level auth gating.** Currently `/settings/profile` checks auth in the component and redirects on miss. A proper route-level guard would be cleaner.
- **Verification UI.** "Unverified author" indicator on anonymous builds was in the original plan but felt harsh; revisit if users get confused.
- **Open in new tab on author click.** Current pattern (`<span role="button" onClick>`) loses Cmd-click → new tab. Switching to a real `<a>`/`<Link>` would require either restructuring `BuildCard` (current root is `<button>`, can't nest interactive elements) or detecting modifier keys in the click handler.
