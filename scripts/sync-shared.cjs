#!/usr/bin/env node
/**
 * sync-shared.cjs — take canonical's copy of every shared pipeline file, by machine.
 *
 * `scripts/verify-sync.cjs` measures whether the two repos' shared surface agrees. It does not
 * make it agree; that was left to hand-copying, and FORK-1's own opening census is the argument
 * against hand-copying anything:
 *
 *     exported_powers/   58,445 files   copied wholesale by machine   0 drifted
 *     scripts/               49 files   copied by hand                17 drifted
 *
 * Same rule on both rows, same two people following it. The only surface that held was the one
 * nobody had to remember. So this is the machine copy for the rest of the shared surface — the
 * 60 converters, the 21 `src/` modules the converters execute, and the register both repos cite
 * by id — and `sync-bin-crawler.sh` is its sibling, not its competitor: that one mirrors the two
 * enormous trees (`tools/bin-crawler`, `exported_powers`) with a tar, this one moves 3 MB of
 * hand-written code and is instant.
 *
 *   npm run sync:shared                       # take everything canonical has moved
 *   npm run sync:shared -- --dry-run          # what would change, touching nothing
 *   npm run sync:shared -- --only scripts/convert-powerset.cjs …   # a staged take
 *   npm run sync:shared -- ../coh-sidekick-1.0                     # explicit canonical
 *
 * The flow is one-way, the same as the vendored sync: edit it THERE, run this HERE. What makes
 * that enforceable rather than aspirational is that this script overwrites, so a beta-side edit
 * to a shared file is destroyed rather than forked. It therefore refuses to run when a file it
 * would overwrite has diverged from the hash the beta's OWN manifest records for it — that is a
 * beta-authored edit, and silently deleting one is how you lose the `dual_pistols` argument in
 * the other direction. `--force` says you know.
 *
 * WHICH FILES. Every manifest entry with status `identical`, read from CANONICAL's manifest
 * because the beta's may be the stale one. `forked` and `per-repo` entries are skipped on
 * purpose: both are declared disagreements, and copying over one would close it by accident
 * instead of by the door in CLAUDE.md.
 *
 * THE RE-ADJUDICATION IS PART OF THE COPY. A shared file moving means the manifest moves too,
 * and both repos hold the manifest, so the old flow was four commits' worth of bookkeeping for
 * one edit — 61 of the beta's last 90 days of shared-surface commits were `sync-manifest.json`
 * alone. This script has both trees in hand, which is exactly what `verify-sync --write` needs,
 * so it runs it in CANONICAL (the manifest is canonical's to author) and copies the result back
 * here like any other shared file. That leaves one staged file in canonical to commit, which is
 * the whole remaining manual step.
 *
 * A `--only` run re-adjudicates only what it took. It cannot use `--write`, which records the
 * whole surface and would drag an unrelated in-flight fork into the same commit; the entries it
 * splices are `identical` by construction, because it just made the two files equal.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const BETA = path.join(__dirname, '..');
const MANIFEST_REL = 'scripts/sync-manifest.json';
const GUARD_REL = 'scripts/verify-sync.cjs';

const step = (s) => process.stdout.write(`\n\x1b[1;36m▶ ${s}\x1b[0m\n`);
const pass = (s) => process.stdout.write(`\x1b[1;32m✓ ${s}\x1b[0m\n`);
const warn = (s) => process.stdout.write(`\x1b[1;33m! ${s}\x1b[0m\n`);
const die = (s) => {
  process.stderr.write(`\x1b[1;31m✗ ${s}\x1b[0m\n`);
  process.exit(1);
};

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const force = argv.includes('--force');
// `--only` is variadic and stops at the next flag, so the canonical path stays positional and
// `--only a b -- ../repo` is not a thing anyone has to remember.
const onlyAt = argv.indexOf('--only');
let only = null;
if (onlyAt >= 0) {
  only = new Set();
  for (let i = onlyAt + 1; i < argv.length && !argv[i].startsWith('-'); i++) only.add(argv[i]);
  if (!only.size) die('--only needs at least one path');
  argv.splice(onlyAt, only.size + 1);
}
const explicit = argv.find((a) => !a.startsWith('-'));

const sha = (f) => {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  } catch {
    return null;
  }
};

// ---- locate canonical ------------------------------------------------------------
// Shared with the vendored sync rather than re-derived: it already knows the three places a
// canonical checkout can be named from (argument, SIDEKICK_CANONICAL_REPO, ../coh-sidekick-1.0),
// and two answers to "where is canonical" is one more than this pair can afford.
step('Locate the canonical checkout');
let CANONICAL;
(async () => {
  const m = await import('./bin-crawler-fingerprint.mjs');
  CANONICAL = m.resolveCanonicalRepo(explicit);
  main();
})().catch((e) => die(e.message));

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });
}

function main() {
  if (!CANONICAL)
    die(
      'cannot find the canonical checkout.\n' +
        'Pass it as an argument, or set SIDEKICK_CANONICAL_REPO, or place it at ../coh-sidekick-1.0.'
    );
  if (path.resolve(CANONICAL) === path.resolve(BETA))
    die('canonical resolves to this repo — nothing to sync from');
  pass(`canonical: ${CANONICAL}`);

  const theirManifestPath = path.join(CANONICAL, MANIFEST_REL);
  if (!fs.existsSync(theirManifestPath)) die(`${CANONICAL} has no ${MANIFEST_REL}`);
  const theirs = JSON.parse(fs.readFileSync(theirManifestPath, 'utf8'));
  const mine = JSON.parse(fs.readFileSync(path.join(BETA, MANIFEST_REL), 'utf8'));

  // ---- what to take --------------------------------------------------------------
  step('Select the shared files');
  let take = theirs.entries.filter((e) => e.status === 'identical').map((e) => e.path);
  const skipped = theirs.entries.filter((e) => e.status !== 'identical');
  if (only) {
    const known = new Set(take);
    const unknown = [...only].filter((p) => !known.has(p));
    if (unknown.length)
      die(
        `--only names ${unknown.join(', ')}, which canonical's manifest does not carry as ` +
          `\`identical\` — a path that is forked, per-repo, or not shared surface at all is not ` +
          `something this script may take`
      );
    take = take.filter((p) => only.has(p));
  }
  pass(`${take.length} shared path(s) selected${only ? ' (--only)' : ''}`);
  if (!only)
    for (const e of skipped)
      warn(`skipped ${e.path} — declared ${e.status}, so it is a decision, not a copy`);

  // A path this repo still holds that canonical has stopped tracking. The paired guard cannot
  // see it — its shared surface is read from canonical, so a file canonical deleted simply
  // leaves the intersection and is graded by nothing. Deleting it here is a decision about the
  // pair, so this reports rather than acts.
  for (const e of mine.entries)
    if (!fs.existsSync(path.join(CANONICAL, e.path)) && fs.existsSync(path.join(BETA, e.path)))
      warn(
        `${e.path}: in this repo's manifest, absent from canonical — retired there and left ` +
          `here, or moved; one file at two paths pairs with nothing`
      );

  // ---- refuse to destroy a beta-authored edit -------------------------------------
  step('Check no local edit is about to be overwritten');
  const recorded = new Map(
    mine.entries.filter((e) => e.status === 'identical').map((e) => [e.path, e.sha256])
  );
  const clobbered = take.filter((p) => {
    const here = sha(path.join(BETA, p));
    if (here === null) return false; // new shared file: nothing to lose
    const was = recorded.get(p);
    return was !== undefined && here !== was;
  });
  if (clobbered.length && !force) {
    for (const p of clobbered) process.stderr.write(`  ${p}\n`);
    die(
      `${clobbered.length} file(s) differ from the hash THIS repo's manifest records for them — ` +
        `that is an edit made here, and this script overwrites.\n` +
        `The flow is one-way: land it in canonical and take it back. \`--force\` discards it.`
    );
  }
  if (clobbered.length) warn(`--force: discarding local edits to ${clobbered.length} file(s)`);
  pass(clobbered.length ? 'proceeding under --force' : 'clean');

  // ---- refuse to record a provenance that is not reproducible ---------------------
  // The manifest about to be written names canonical's bytes. If canonical has uncommitted work
  // under the paths being copied, the record describes a tree that exists on one disk.
  step('Check the canonical working tree is clean under those paths');
  const dirty = git(CANONICAL, ['status', '--porcelain', '--', ...take, MANIFEST_REL]).trim();
  if (dirty) {
    process.stderr.write(dirty.split('\n').slice(0, 20).join('\n') + '\n');
    die('canonical has uncommitted changes under the synced paths — commit there first');
  }
  pass('clean');

  // ---- copy ------------------------------------------------------------------------
  step(dryRun ? 'Files that would change' : 'Copy');
  const changed = [];
  for (const p of take) {
    const src = path.join(CANONICAL, p);
    const dst = path.join(BETA, p);
    if (!fs.existsSync(src)) die(`${p}: canonical's manifest carries it and canonical does not`);
    if (sha(src) === sha(dst)) continue;
    changed.push(p);
    if (dryRun) continue;
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
  for (const p of changed) process.stdout.write(`  ${p}\n`);
  pass(`${changed.length} file(s)${dryRun ? ' would change' : ' copied'}`);

  if (dryRun) {
    step('Dry run — nothing was written');
    process.stdout.write(
      changed.length
        ? `Run without --dry-run to take ${changed.length} file(s) and re-adjudicate.\n`
        : 'Already in sync with canonical.\n'
    );
    return;
  }

  // ---- re-adjudicate ---------------------------------------------------------------
  // The manifest is canonical's to author, so it is written THERE and copied here like any
  // other shared file. Doing it the other way round would make this repo the source of the one
  // file every check trusts, which is the direction the whole mechanism exists to prevent.
  step('Re-adjudicate the manifest in canonical');
  if (only) {
    // A scoped take may not use --write: that records the WHOLE surface, and an unrelated
    // in-flight fork would be dragged into this commit and re-stamped as an unexplained one.
    // These entries are `identical` by construction — the copy above just made them equal.
    const byPath = new Map(theirs.entries.map((e) => [e.path, e]));
    for (const p of take) byPath.set(p, { path: p, status: 'identical', sha256: sha(path.join(CANONICAL, p)) });
    theirs.entries = [...byPath.values()].sort((a, b) => (a.path < b.path ? -1 : 1));
    fs.writeFileSync(theirManifestPath, JSON.stringify(theirs, null, 2) + '\n');
    pass(`spliced ${take.length} entry/entries (scoped take — the rest of the surface untouched)`);
  } else {
    process.stdout.write(
      execFileSync('node', [path.join(CANONICAL, GUARD_REL), '--sibling', BETA, '--write'], {
        cwd: CANONICAL,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    );
  }
  fs.copyFileSync(theirManifestPath, path.join(BETA, MANIFEST_REL));
  pass('manifest written in canonical and copied here');

  // ---- stage, then let the guard speak ---------------------------------------------
  step('Stage the copy');
  const staged = [...changed, MANIFEST_REL];
  git(BETA, ['add', '--', ...staged]);
  git(CANONICAL, ['add', '--', MANIFEST_REL]);
  pass(`${staged.length} path(s) staged here, ${MANIFEST_REL} staged in canonical`);

  step('Verify paired');
  let verdict;
  try {
    verdict = execFileSync('node', [path.join(CANONICAL, GUARD_REL), '--sibling', BETA, '--gate'], {
      cwd: CANONICAL,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    process.stdout.write(verdict);
    pass('the pair agrees');
  } catch (e) {
    process.stdout.write(e.stdout ?? '');
    process.stderr.write(e.stderr ?? '');
    warn('the pair does not agree yet — the errors above are what is left');
  }

  step('Result');
  process.stdout.write(
    `  this repo:  ${staged.length} staged path(s) — review and commit\n` +
      `  canonical:  ${MANIFEST_REL} staged — commit it there too, or the pair holds two manifests\n`
  );
  // Deliberately the same coarse rule regen-diff.yml filters on — any `scripts/` or `src/` path,
  // not a guess at which ones are converters. A guard and a converter are indistinguishable by
  // name, and the failure mode of the tight version is a stale `generated/` tree nobody rebuilt.
  if (changed.some((p) => p.startsWith('scripts/') || p.startsWith('src/')))
    process.stdout.write(
      '\n  Something under scripts/ or src/ moved — the same paths regen-diff.yml watches.\n' +
        '  If any of it is on the converter path: `npm run regen`.\n'
    );
}
