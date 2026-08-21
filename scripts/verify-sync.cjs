#!/usr/bin/env node
/**
 * verify-sync.cjs — the two repos share a pipeline; this is what notices when they stop.
 *
 * `scripts/` is copied between coh-sidekick-1.0 (canonical) and CoH-Sidekick (beta) by hand,
 * and the working belief was that the copies stayed byte-identical. On 2026-08-20 that belief
 * was measured: 17 of the 49 shared scripts differed, and `convert-powerset.cjs` was 714 lines
 * apart with content on BOTH sides that the other repo's history never held. Not one side
 * lagging. Two forks. Canonical had the register's gate-classification and caster-meter work;
 * beta had a `dual_pistols` proper noun in a converter conditional, which is the Rule 0 breach
 * drift let hide. See FORK-1 in docs/gaps/pipeline-provenance.md.
 *
 * So this guard does not try to keep the copies equal. It makes an unequal pair impossible to
 * be UNAWARE of, which is the failure that actually happened. Every shared path is adjudicated
 * in sync-manifest.json as `identical` or `forked`, a fork must name a reason and a gap id, and
 * either repo editing a shared file without re-adjudicating turns this red.
 *
 * Paths only one repo runs are declared instead, in `canonicalOnly`, and checked from the other
 * direction: the beta must neither hold the file nor name it anywhere tracked.
 *
 * Two modes, because only one repo can see the other. Beta is public and canonical's CI already
 * checks it out (see the beta-engine-staleness job), but canonical is private and beta's CI
 * cannot check it out at all:
 *
 *   paired  both trees present, so the manifest is verified against reality on both sides, and
 *           a shared file present in both repos but absent from the manifest is an error.
 *   solo    one tree, so this repo's files are verified against the hashes the manifest records
 *           for THIS repo's role. Weaker, but not weak: the manifest is itself a shared entry,
 *           so moving a hash means editing the manifest in both repos, and a hash edited on one
 *           side reds the other side's solo run.
 *
 *   node scripts/verify-sync.cjs                          # solo, report
 *   node scripts/verify-sync.cjs --gate                   # exit 1 on any error
 *   node scripts/verify-sync.cjs --sibling ../CoH-Sidekick --gate    # paired
 *   node scripts/verify-sync.cjs --sibling ../CoH-Sidekick --write   # re-adjudicate
 *
 * `--write` needs both trees. It records what's actually there and carries every existing
 * annotation forward; a path that newly differs is written as `forked` with a null reason, and
 * a null reason is an error. That's deliberate, and it's the same door CLAUDE.md puts in front
 * of a Rule 0 deviation: a fork becomes legitimate by being named and given an exit, never by
 * being noticed and left alone.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MANIFEST = path.join(__dirname, 'sync-manifest.json');
// The manifest cannot record its own hash, so it is not one of its own entries and is checked
// separately below. That leaves one hole worth naming: a solo run cannot tell that its manifest
// has been loosened, only that its files match whatever the local manifest says. Closing it is
// what the paired run in canonical's CI is for.
const SELF_MANIFEST = 'scripts/sync-manifest.json';

const argv = process.argv.slice(2);
const gate = argv.includes('--gate');
const write = argv.includes('--write');
const siblingArg = ((i) => (i < 0 ? null : argv[i + 1]))(argv.indexOf('--sibling'));

/** sha256 of a file's bytes, or null if it isn't there. */
function sha(file) {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  } catch {
    return null;
  }
}

/**
 * Which repo is this? Keyed on package.json `name` rather than the directory, because the
 * directory is whatever a checkout called it — canonical's own CI checks the two out as
 * `rebuild/` and `beta/`, so a path-shaped answer would be wrong in the one place it matters.
 */
const ROLES = { 'coh-sidekick-pipeline': 'canonical', 'coh-sidekick': 'beta' };
function roleOf(root) {
  const name = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).name;
  const role = ROLES[name];
  if (!role) throw new Error(`${root}: package.json name "${name}" is neither repo`);
  return role;
}

const selfRole = roleOf(ROOT);
const siblingRoot = siblingArg ? path.resolve(siblingArg) : null;
const siblingRole = siblingRoot ? roleOf(siblingRoot) : null;
if (siblingRoot && siblingRole === selfRole)
  throw new Error(`--sibling ${siblingRoot} is another ${selfRole} checkout, not the other repo`);
const paired = !!siblingRoot;
const rootFor = (role) => (role === selfRole ? ROOT : siblingRoot);

if (write && !paired) throw new Error('--write needs --sibling: it records both repos');

/** Tracked files under scripts/, relative to the repo root. */
function trackedScripts(root) {
  return execFileSync('git', ['ls-files', 'scripts'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .filter((f) => f !== SELF_MANIFEST);
}

/**
 * The `src/` modules the pipeline loads at RUNTIME, plus everything they import.
 *
 * `scripts/` alone is not the shared surface, and believing it was cost a day: the three
 * converters were byte-identical in both repos and still produced different files, because
 * `convert-powerset.cjs` pulls its atom encoder from `src/data/core/atomic-effect.ts` through
 * `tsx` and that file had forked 309 lines. A guard that watches only the scripts reports green
 * while the thing the scripts EXECUTE disagrees.
 *
 * Discovered rather than listed: the `require('../src/…')` edges are read out of the tracked
 * scripts and the TypeScript imports are followed from there, so a script that starts loading a
 * new module widens the guarded surface by itself. A hardcoded list would need remembering,
 * which is the same failure one level up.
 *
 * Files under `generated/` or `datasets/` are dropped. They are data, they are enormous, and the
 * regen-diff guard already owns them; what belongs here is the code that PRODUCES them.
 */
function pipelineSources(root) {
  const tracked = new Set(
    execFileSync('git', ['ls-files', 'src'], { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }).split('\n').filter(Boolean)
  );
  const resolve = (spec, from) => {
    let base;
    if (spec.startsWith('@/')) base = `src/${spec.slice(2)}`;
    else if (spec.startsWith('.')) base = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
    else return null;
    for (const c of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) if (tracked.has(c)) return c;
    return null;
  };
  const queue = [];
  for (const f of trackedScripts(root)) {
    if (!f.endsWith('.cjs')) continue;
    // Tracked and not on disk = deleted without `git rm`. Both the manifest loop and the
    // canonical-only check name that file explicitly; reading it here first turned their
    // report into an ENOENT stack trace, which is loud but says nothing.
    if (!fs.existsSync(path.join(root, f))) continue;
    const src = fs.readFileSync(path.join(root, f), 'utf8');
    for (const m of src.matchAll(/require\('\.\.\/(src\/[^']+)'\)/g)) queue.push(m[1]);
  }
  const seen = new Set();
  while (queue.length) {
    const f = queue.pop();
    if (seen.has(f) || !tracked.has(f)) continue;
    seen.add(f);
    const src = fs.readFileSync(path.join(root, f), 'utf8');
    for (const m of src.matchAll(/from\s+'([^']+)'/g)) {
      const r = resolve(m[1], f);
      if (r && !seen.has(r)) queue.push(r);
    }
  }
  return [...seen].filter((f) => !f.includes('/generated/') && !f.includes('/datasets/'));
}

/** Every path the two repos are expected to share: the scripts, and what the scripts execute. */
function sharedSurface(root) {
  return [...new Set([...trackedScripts(root), ...pipelineSources(root)])];
}

const errors = [];
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

// -- --write: re-adjudicate against both trees -------------------------------------
if (write) {
  const prior = new Map(manifest.entries.map((e) => [e.path, e]));
  const shared = sharedSurface(rootFor('canonical')).filter((f) =>
    fs.existsSync(path.join(rootFor('beta'), f))
  );
  manifest.entries = shared.sort().map((p) => {
    const canonical = sha(path.join(rootFor('canonical'), p));
    const beta = sha(path.join(rootFor('beta'), p));
    const was = prior.get(p);
    if (canonical === beta) return { path: p, status: 'identical', sha256: canonical };
    return {
      path: p,
      status: 'forked',
      sha256: { canonical, beta },
      reason: was?.reason ?? null,
      exit: was?.exit ?? null,
      gap: was?.gap ?? null,
    };
  });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  const forked = manifest.entries.filter((e) => e.status === 'forked');
  console.log(
    `wrote ${manifest.entries.length} shared paths (${forked.length} forked) to scripts/sync-manifest.json`
  );
}

// -- verify -------------------------------------------------------------------------
for (const e of manifest.entries) {
  if (e.status === 'identical' && typeof e.sha256 !== 'string')
    errors.push(`${e.path}: status "identical" but no single sha256`);
  if (e.status === 'forked') {
    if (!e.reason)
      errors.push(
        `${e.path}: forked with no reason — a fork is legitimate by being NAMED, ` +
          `not by being noticed (CLAUDE.md, the deviation door)`
      );
    if (!e.gap)
      errors.push(`${e.path}: forked with no gap id — an undeclared fork is debt, not precedent`);
  }

  const roles = paired ? ['canonical', 'beta'] : [selfRole];
  for (const role of roles) {
    const want = e.status === 'identical' ? e.sha256 : e.sha256[role];
    const got = sha(path.join(rootFor(role), e.path));
    if (got === null) {
      errors.push(`${e.path}: listed in the manifest, missing from ${role}`);
    } else if (got !== want) {
      errors.push(
        `${e.path}: ${role}'s copy is not the hash the manifest records — a shared file ` +
          `changed without re-adjudicating (run --sibling <path> --write, then say why)`
      );
    }
  }
}

/**
 * Tracked files in `root` that WIRE `needle` — name it somewhere it could be run from.
 *
 * Scoped rather than corpus-wide, for two reasons that pull the same way. The question this
 * answers is whether the repo runs the script, and the places a script gets run from are the
 * scripts themselves, the modules they load, the npm scripts, and CI. And the beta has a
 * committed `.ua/.trash-*` dump that names half of `scripts/` in tool scratch JSON; an
 * unscoped grep is permanently red on it, which is the way a gate stops being read.
 *
 * The two files that exist to DESCRIBE the declaration are excluded, or it would report itself.
 */
const WIRING_PATHS = ['scripts', 'src', 'package.json', '.github'];
const SELF_GUARD = 'scripts/verify-sync.cjs';
function referencesTo(root, needle) {
  try {
    return execFileSync('git', ['grep', '-l', '--fixed-strings', needle, '--', ...WIRING_PATHS], {
      cwd: root,
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean)
      .filter((f) => f !== SELF_MANIFEST && f !== SELF_GUARD);
  } catch {
    return []; // git grep exits 1 on no match
  }
}

/**
 * Scripts only canonical runs, declared rather than shared.
 *
 * Most of canonical's audits were never on the shared surface at all — they exist here, the beta
 * has no copy, and nothing noticed because the manifest discovers its entries from the paths the
 * two repos both hold. `audit-converter-twins.cjs` and `audit-coverage-census.cjs` were the
 * exception only by accident: the beta held a copy, so they were adjudicated as forks and given
 * exit conditions, when the truth was that neither had ever been wired into anything there and
 * neither could run — both read a `*-baseline.json` the beta does not have, so `--gate` was an
 * ENOENT away from the first line it mattered on.
 *
 * So the rule the other audits already follow gets written down: a script only canonical runs is
 * not shared surface. And written down is not enough on its own, because the reason those two
 * became drift is that a convention nobody measures decays into one. This is the measurement. A
 * declaration goes stale in two directions and both are errors: the script disappearing from
 * canonical, and the beta growing the file back or naming it anywhere tracked. The second is the
 * live one — the day the beta wires one of these in, it is shared surface again, and nothing else
 * here would say so.
 */
for (const d of manifest.canonicalOnly ?? []) {
  if (!d.reason)
    errors.push(`${d.path}: declared canonical-only with no reason — same door as a fork`);

  if (paired || selfRole === 'canonical') {
    if (!fs.existsSync(path.join(rootFor('canonical'), d.path)))
      errors.push(`${d.path}: declared canonical-only and absent from canonical — a stale declaration`);
  }

  if (paired || selfRole === 'beta') {
    const betaRoot = rootFor('beta');
    if (fs.existsSync(path.join(betaRoot, d.path)))
      errors.push(
        `${d.path}: declared canonical-only but present in beta — either that copy is dead and ` +
          `should go, or the declaration is wrong and this is shared surface`
      );
    const refs = referencesTo(betaRoot, path.basename(d.path));
    if (refs.length)
      errors.push(
        `${d.path}: declared canonical-only, and beta names it in ${refs.join(', ')} — a script ` +
          `beta RUNS is shared surface, so re-adjudicate it as an entry`
      );
  }
}

// A shared path nobody adjudicated is the original failure in miniature, so paired runs look
// for it. Solo runs cannot: the intersection is only knowable with both trees in hand.
if (paired) {
  const listed = new Set(manifest.entries.map((e) => e.path));
  const shared = sharedSurface(rootFor('canonical')).filter((f) =>
    fs.existsSync(path.join(rootFor('beta'), f))
  );
  for (const p of shared)
    if (!listed.has(p))
      errors.push(`${p}: present in both repos and in no manifest entry — unadjudicated shared surface`);
}

// The manifest is the thing every other check trusts, so a paired run verifies it directly.
if (paired) {
  const mine = sha(MANIFEST);
  const theirs = sha(path.join(siblingRoot, SELF_MANIFEST));
  if (theirs === null) errors.push(`${SELF_MANIFEST}: missing from ${siblingRole}`);
  else if (mine !== theirs)
    errors.push(
      `${SELF_MANIFEST}: the two repos hold different manifests — every other check here ` +
        `trusts this file, so an unequal pair means both sides were grading themselves`
    );
}

// -- report -------------------------------------------------------------------------
if (errors.length) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.error(`\n${errors.length} error(s) — the shared pipeline drifted unadjudicated.`);
  if (gate) process.exit(1);
} else {
  const forked = manifest.entries.filter((e) => e.status === 'forked').length;
  console.log(
    `ok: ${manifest.entries.length} shared paths verified ${paired ? 'paired' : `solo (${selfRole})`}, ` +
      `${manifest.entries.length - forked} identical, ${forked} forked and declared`
  );
}
