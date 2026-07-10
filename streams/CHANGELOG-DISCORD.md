# Changelog → Discord auto-publisher

Automatically posts new entries from [`src/data/changelog-manual.ts`](../src/data/changelog-manual.ts)
to a Discord channel when you commit them. New entries only, deduped across machines via git.

## One-time setup (per machine)

Do this on **each computer** you commit from. Steps 1 and 3 are per-machine; the webhook URL
from step 1 can be reused.

### 1. Create a Discord webhook (once, reused on all machines)

Discord → **Server Settings → Integrations → Webhooks → New Webhook** → pick the target
channel → **Copy Webhook URL**. Keep this URL secret — anyone with it can post to the channel.

### 2. Add the secret to `.env` (per machine)

`.env` is gitignored, so it does **not** travel with the repo — you must add it on every machine.

```bash
cp .env.example .env
# then edit .env and set:
# DISCORD_CHANGELOG_WEBHOOK_URL=https://discord.com/api/webhooks/....
```

### 3. Install the git hook (per machine)

```bash
npm run hooks:install
```

This runs `git config core.hooksPath scripts/git-hooks`, activating
[`scripts/git-hooks/post-commit`](../scripts/git-hooks/post-commit). It's a local repo config,
so it must be run on each clone. Verify with:

```bash
git config core.hooksPath   # should print: scripts/git-hooks
```

That's it. The next commit that changes `changelog-manual.ts` will post its new entries.

## How it works

1. You add entries to `MANUAL_CHANGELOG_GROUPS` in `changelog-manual.ts` and commit.
2. The `post-commit` hook notices the file changed and runs `npm run changelog:push`.
3. The push script ([`scripts/push-changelog-discord.ts`](../scripts/push-changelog-discord.ts))
   hashes every entry (`date|type|message`), compares against the committed state file
   [`.changelog-posted.json`](../.changelog-posted.json), and POSTs only the entries not yet
   posted — as rich Discord embeds, one per date group, colored/emoji'd by type.
4. On a successful post it appends the new hashes to `.changelog-posted.json`, and the hook
   makes a small follow-up commit (`chore(changelog): record entries posted to Discord`) so the
   dedup record travels in git. That follow-up commit doesn't touch the changelog source, so it
   can't re-trigger the hook — no loop.

Because the state file is committed, both your machines share the same "already posted" record.
Whichever machine you commit from, only genuinely new entries go out.

### Entry types → Discord styling

| `type` | Emoji | Label | Accent color |
|---|---|---|---|
| `feat` | ✨ | New | green |
| `fix` | 🐛 | Fix | red |
| `update` | 🔧 | Update | blue |
| `known-issue` | ⚠️ | Known issue | amber |

## Manual usage

```bash
npm run changelog:push                  # post new entries now (respects .env + state file)
npm run changelog:push -- --dry-run     # preview what WOULD post; no POST, no state change
npm run changelog:push -- --init        # mark ALL current entries as posted, send nothing (re-baseline)
npm run changelog:push -- --force-backlog  # post every entry, even already-posted ones
```

- If `.env` has no webhook URL, the script skips posting (and does not fail your commit).
- If there's no state file yet, the first run **baselines silently** (records everything as
  posted, sends nothing) so you don't spam the channel with the whole backlog. Use
  `--force-backlog` if you actually want to blast the full history.

## Gotchas

- **Rewording an already-posted entry reposts it.** Dedup is by content hash, so changing the
  wording produces a new hash. Finalize wording before committing the changelog. (If this
  becomes a problem, add a stable `id` field per entry and hash on that instead.)
- **The hook adds a follow-up commit.** Intentional — keeps the posted-state in git without
  rewriting your original commit. It's skipped during rebase/merge/cherry-pick to avoid spam.
- **`core.hooksPath` is per-clone.** A fresh clone won't have the hook until you run
  `npm run hooks:install` again.

## Files

| Path | Role |
|---|---|
| `scripts/push-changelog-discord.ts` | The publisher script |
| `scripts/git-hooks/post-commit` | Git hook that triggers it on commit |
| `.changelog-posted.json` | Committed dedup state (shared across machines) |
| `.env` / `.env.example` | Webhook secret (local, gitignored) / its template |
| `package.json` | `changelog:push` and `hooks:install` scripts |
