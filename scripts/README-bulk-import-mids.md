# Bulk Mids .mbd → Supabase importer

Script: [`bulk-import-mids.ts`](./bulk-import-mids.ts)

Imports large archives of Mids Reborn `.mbd` files directly into the `shared_builds` Supabase table, bypassing the normal SK sharing UI and edge-function rate limits. Designed for a one-time archive migration of 4,000+ builds.

## Why this exists

- The SK UI shares builds one at a time through a rate-limited edge function (5 public / 20 vaulted per IP per hour). Uploading thousands of builds through that path isn't viable.
- The same `importMidsBuild()` pipeline the UI uses is pure and portable, so we can reuse it in Node and insert directly with the service role key.
- The aggregated warnings produced during a bulk run are a great feedstock for improving the Mids importer's mapping reliability — see the mapping report section.

## Prerequisites

1. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in a `.env` file at the repo root (or exported in your shell). See `.env.example`.
2. The target user must already exist in `auth.users` (i.e. they've logged in at least once via Discord OAuth).

⚠️ The service role key bypasses ALL RLS policies. Keep it out of commits and client bundles.

## Usage

### 1. Find the target user's UUID

```bash
npm run import-mids -- --lookup-discord-username wednesdaywoe
```

Prints each matching user's UUID, Discord name, email, and account-creation date. Substring match is supported.

### 2. Dry run on the archive

```bash
npm run import-mids -- --dir ./path/to/archive --user-id <uuid> --dry-run
```

Parses every `.mbd` file, aggregates warnings, and writes the mapping report. No database changes. Use this to:

- Validate that your archive parses correctly.
- Discover unmapped enhancements / powers / pools before committing to a real import.
- Estimate the success rate.

### 3. Real import

```bash
# Private (vault-only, default)
npm run import-mids -- --dir ./path/to/archive --user-id <uuid>

# Public (appear in Shared Builds)
npm run import-mids -- --dir ./path/to/archive --user-id <uuid> --public
```

## Outputs

All outputs land in `./import-output/` (override with `--output-dir <path>`):

- **`import-state.json`** — list of successfully-processed filenames. Re-runs skip files already in this list. Delete or edit to force re-import.
- **`import-failures.csv`** — one row per file that failed to parse. Columns: filename, archetype, error message.
- **`mapping-report.md`** — **the most valuable artifact.** Ranked markdown of every warning across the run, grouped by type:

  ```markdown
  ## Top Unmapped Enhancements (...)
  | Mids name | Builds affected | Example files | Message |
  | Crafted_Gladiators_Armor_F | 384 | ...          | ...     |
  | Attuned_Stupefy_ChanceHold | 213 | ...          | ...     |
  ```

  Top 25 entries per category. Use it to file focused mapping fixes for the SK importer.

## CLI flags

| Flag | Description |
| --- | --- |
| `--dir <path>` | Archive directory (walked recursively for `.mbd`). |
| `--user-id <uuid>` | Target `auth.users.id`. All builds attribute to this user. |
| `--public` | Make imports public. Default: private (vault). |
| `--dry-run` | Parse + aggregate only. No DB writes. |
| `--lookup-discord-username <name>` | Alternative mode: find UUIDs by Discord name. |
| `--output-dir <path>` | Output directory (default `./import-output`). |
| `-h`, `--help` | Print usage. |

## Recovery

- **A batch fails mid-run**: the failed batch's filenames are not added to state. Just re-run; the next run retries from the failed batch onward.
- **You want to re-import everything**: delete `import-output/import-state.json`.
- **A specific file keeps failing**: it stays out of state, so each run will retry. Investigate it via `import-failures.csv`.

## Limitations

- Dedup is filename-based, not content-based. Renaming a file will cause a re-import.
- The script attributes all builds to a single user. For per-user mapping, extend it with a subfolder / CSV strategy.
- Public imports do not go through the `share-build` rate limiter, so they don't affect the per-IP throttle counters. Use `--public` sparingly — it will flood the public gallery.
- Supabase auth admin API pagination caps at 1000 users per page. The lookup helper handles pagination, but very large instances may take a few seconds.
