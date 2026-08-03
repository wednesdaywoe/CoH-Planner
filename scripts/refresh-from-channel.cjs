#!/usr/bin/env node
/**
 * refresh-from-channel.cjs — rebuild a committed bin-crawler export from a
 * registered game-install ring, then regenerate that dataset. One command per
 * refresh.
 *
 *   node scripts/refresh-from-channel.cjs [ring] [options]
 *
 *   [ring]              A ring named in assets_sources.json for the dataset
 *                       (homecoming: live | open_beta | closed_beta).
 *                       Default: the dataset's exportable_ring.
 *   --dataset <id>      homecoming (default) | rebirth | thunderspy
 *   --no-apply          export + diff only; leave the committed export alone
 *   --no-regen          export + apply, but skip regen-all
 *   --skip-tsc          skip the final typecheck gate
 *
 * Which install it reads is not configured here. The registry lists every root
 * a dataset has been seen at, one per workstation, and picks whichever exists
 * on this machine — so the same command works on any box without editing paths.
 * If two registered roots are present it refuses rather than guesses; set
 * BIN_CRAWLER_ASSETS_HOST=<host label> to name one.
 *
 * Flow:  export ring → JSON scratch  →  diff vs committed (de-risk)
 *        →  apply (wholesale-replace each top-level entry)
 *        →  regen-all --dataset <id>  →  tsc.
 *
 * ONLY the dataset's `exportable_ring` may be applied. Non-exportable rings
 * (open beta, closed beta) exist to be READ — to see what a patch is about to
 * do — never to be baked into the tree users get. Ask for one and this script
 * runs export + diff and stops, regardless of flags. That rule is the registry's
 * (see assets_sources.json), not this script's; `resolve_export_source` enforces
 * the same thing one layer down.
 *
 * The ONE manual prerequisite is syncing the target ring in the game launcher so
 * its .pigg files are current. Everything after that is this script.
 *
 * See OPEN-BETA-WORKFLOW.md for the full workflow + rationale.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const BIN = path.join(REPO, 'tools', 'bin-crawler');
const REGISTRY = path.join(BIN, 'bin_crawler', 'assets_sources.json');

// Where each dataset's committed export lives. Mirrors EXPORT_ROOTS in
// scripts/convert-pet-entities.cjs — HC flat at the root, the others nested
// under it — so every converter and this script agree on one input tree.
const COMMITTED_ROOTS = {
  homecoming: 'exported_powers',
  rebirth: path.join('exported_powers', 'rebirth'),
  thunderspy: path.join('exported_powers', 'thunderspy'),
};

// Player archetype table stems consumed by convert-archetypes / extract-at-tables.
// Keep in sync with PLAYER_ARCHETYPES in scripts/convert-archetypes.cjs. NPC /
// critter class tables (boss_*, henchman_*, …) also ship in tables/, but nothing
// downstream reads them — so the apply step refreshes only these, avoiding
// unrelated NPC drift in the diff on every refresh.
const PLAYER_AT_TABLES = [
  'blaster', 'brute', 'controller', 'corruptor', 'defender', 'dominator',
  'guardian', 'mastermind', 'scrapper', 'sentinel', 'stalker', 'tanker',
  'peacebringer', 'warshade', 'arachnos_soldier', 'arachnos_widow',
  'primalist', // Thunderspy-only custom AT
];

// The bin-crawler is a Python package invoked as a module. Windows ships the
// `py` launcher; everywhere else python3 is the entry point. Override with
// PYTHON=... for a venv or a non-default interpreter.
const PY = process.env.PYTHON || (process.platform === 'win32' ? 'py -3' : 'python3');

// ---- args ----
const argv = process.argv.slice(2);
const has = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const positional = argv.filter((a) => !a.startsWith('--'));
const flagValues = new Set(['--dataset'].map((n) => opt(n, null)).filter(Boolean));
const ringArg = positional.find((a) => !flagValues.has(a)) || null;
const dataset = opt('--dataset', 'homecoming');

const die = (msg) => { console.error(`\n${msg}\n`); process.exit(1); };
const banner = (m) => console.log(`\n========== ${m} ==========`);
const run = (cmd, cwd) => { console.log(`$ ${cmd}`); execSync(cmd, { stdio: 'inherit', cwd: cwd || REPO }); };

// ---- 0. resolve the ring against the registry ----
//
// Resolution is asked of bin_crawler.assets_sources rather than reimplemented
// here: it owns root selection, the ambiguity refusal and the rejected-subpath
// list, and a second copy of that logic in JS would be a copy that drifts. The
// exporters this script drives resolve through the very same module, so what we
// print is necessarily what they will read.
if (!fs.existsSync(REGISTRY)) die(`No assets registry at ${REGISTRY}.`);

const RESOLVER = `
import json, os, sys
from pathlib import Path
from bin_crawler import assets_sources as a

ds = os.environ["RESOLVE_DATASET"]
want = os.environ.get("RESOLVE_RING") or ""
try:
    if ds not in a.datasets():
        raise a.UnknownSource("Unknown dataset %r. Registered: %s" % (ds, ", ".join(a.datasets())))
    exportable = a.exportable_ring(ds)
    ring = want or exportable
    if ring not in a.rings(ds):
        raise a.UnknownSource(
            "Unknown ring %r for dataset %r.\\n  Registered rings: %s\\n  Exportable ring:  %s"
            % (ring, ds, ", ".join(a.rings(ds)), exportable))
    rep = a.root_report(ds)
    path = a.resolve("%s:%s" % (ds, ring))[2]
    print(json.dumps({
        "dataset": ds, "ring": ring, "path": path, "exists": Path(path).is_dir(),
        "exportable_ring": exportable, "note": a.ring_note(ds, ring),
        "root": rep["chosen"], "via": rep["via"], "candidates": rep["candidates"],
    }))
except Exception as e:
    print(json.dumps({"error": str(e), "kind": type(e).__name__}))
`;

let resolved;
try {
  const out = execSync(`${PY} -`, {
    cwd: BIN, encoding: 'utf8', input: RESOLVER,
    env: { ...process.env, RESOLVE_DATASET: dataset, RESOLVE_RING: ringArg || '' },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  resolved = JSON.parse(out);
} catch (e) {
  die(`Could not ask the registry to resolve '${dataset}${ringArg ? ':' + ringArg : ''}'.\n` +
      `  Ran: ${PY} (cwd ${path.relative(REPO, BIN)})\n` +
      `  ${(e.stderr || e.message || '').toString().trim().split('\n').slice(-4).join('\n  ')}\n` +
      `  Set PYTHON=… if the interpreter is elsewhere.`);
}
if (resolved.error) die(resolved.error);

const { ring, exportable_ring: exportableRing, root, candidates } = resolved;
if (!resolved.exists) {
  const others = candidates.filter((c) => c.path !== root.path);
  die(`'${dataset}:${ring}' resolves to:\n  ${resolved.path}\n` +
      `…which does not exist on this machine.\n` +
      `  Root in use: ${root.host} (${root.path})\n` +
      (others.length
        ? `  Other registered roots: ${others.map((c) => `${c.host} ${c.exists ? '(present)' : '(absent)'}`).join(', ')}\n`
        : '') +
      `  Add this machine's root to ${path.relative(REPO, REGISTRY)} if it is missing,\n` +
      `  then sync the '${ring}' ring in the launcher so its .pigg files are current.`);
}

const committedRel = COMMITTED_ROOTS[dataset];
if (!committedRel) die(`No committed export root known for dataset '${dataset}'.`);
const COMMITTED = path.join(REPO, committedRel);
const scratch = path.join(BIN, 'exported_powers', `${dataset}-${ring}`);

// Other datasets' committed roots nested inside this one (HC is flat at
// exported_powers/, so rebirth/ and thunderspy/ sit inside it). The apply step
// only touches entries the export produced, so these survive untouched — but
// the diff would report them as "committed-only" noise on every run.
const nested = Object.entries(COMMITTED_ROOTS)
  .filter(([id, rel]) => id !== dataset && path.dirname(rel) === committedRel)
  .map(([, rel]) => path.basename(rel));

// ---- the apply gate: only the exportable ring may become committed data ----
const readOnlyRing = ring !== exportableRing;
const applying = !readOnlyRing && !has('--no-apply');
if (readOnlyRing) {
  console.log(
    `\nNOTE: '${dataset}:${ring}' is not the exportable ring (${dataset}:${exportableRing}).\n` +
    `      ${resolved.note || 'A read-only ring.'}\n` +
    `      Running export + diff only — the committed export will not be modified.`
  );
}

banner(`REFRESH ${dataset}:${ring}`);
console.log(`  root:          ${root.host} — ${root.path}${resolved.via === 'BIN_CRAWLER_ASSETS_HOST' ? '  (forced by BIN_CRAWLER_ASSETS_HOST)' : ''}`);
console.log(`  source ring:   ${resolved.path}`);
console.log(`  scratch:       ${path.relative(REPO, scratch)}`);
console.log(`  committed:     ${committedRel}${nested.length ? `  (preserving ${nested.join(', ')})` : ''}`);
console.log(`  will apply:    ${applying ? 'yes' : 'no'}`);

// ---- 1. export the ring → scratch (mirrors the committed layout: <category>/…
//         power dirs + tables/ classes + entities/ + salvage.json) ----
banner(`EXPORT ${dataset}:${ring}`);
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });
const py = (mod, out, outFlag = '--output-dir') =>
  run(`${PY} -m bin_crawler.${mod} --source ${dataset}:${ring} ${outFlag} "${out}"`, BIN);
py('export_powers', scratch);
py('export_classes', path.join(scratch, 'tables'));
py('export_entities', path.join(scratch, 'entities'));
py('export_salvage', path.join(scratch, 'salvage.json'), '--output');

// ---- 2. de-risk diff: scratch vs committed ----
banner(`DIFF ${dataset}:${ring} vs committed ${committedRel}/`);
const excludes = nested.map((d) => `--exclude=${d}`).join(' ');
const raw = execSync(`diff -rq "${COMMITTED}" "${scratch}" ${excludes} || true`, { encoding: 'utf8', cwd: REPO });
const lines = raw.split('\n').filter(Boolean);
const changed = lines.filter((l) => l.endsWith('differ')).length;
const added = lines.filter((l) => l.includes(`Only in ${scratch}`)).length;
const removed = lines.filter((l) => l.includes(`Only in ${COMMITTED}`)).length;
console.log(`  changed: ${changed}   added (in ${ring}): ${added}   removed (committed-only): ${removed}`);
console.log(lines.slice(0, 30).map((l) => '  ' + l).join('\n') + (lines.length > 30 ? `\n  … (${lines.length - 30} more)` : ''));

if (!applying) {
  const why = readOnlyRing ? `'${ring}' is a read-only ring` : '--no-apply';
  console.log(`\n${why}: scratch is at ${path.relative(REPO, scratch)}; committed ${committedRel}/ untouched.`);
  process.exit(0);
}

// ---- 3. apply: replace each scratch top-level entry into committed, keeping
//         committed-only entries. Wholesale per-entry replace so removed powers
//         (e.g. a deleted Phoenix Rising) drop out cleanly. ----
banner(`APPLY scratch → ${committedRel}/`);
fs.mkdirSync(COMMITTED, { recursive: true });
for (const name of fs.readdirSync(scratch)) {
  const src = path.join(scratch, name);
  const dst = path.join(COMMITTED, name);
  if (name === 'tables') {
    // Refresh only the player AT tables; leave NPC/critter class tables committed.
    fs.mkdirSync(dst, { recursive: true });
    for (const stem of [...PLAYER_AT_TABLES, '_export_manifest']) {
      const f = path.join(src, `${stem}.json`);
      if (fs.existsSync(f)) fs.cpSync(f, path.join(dst, `${stem}.json`));
    }
    continue;
  }
  fs.rmSync(dst, { recursive: true, force: true });
  fs.cpSync(src, dst, { recursive: true });
}
console.log(`  applied (NPC tables${nested.length ? ` + ${nested.join('/')}` : ''} preserved).`);

// ---- 4. regenerate the dataset ----
if (!has('--no-regen')) {
  banner(`REGEN ${dataset} dataset`);
  run(`node scripts/regen-all.cjs --dataset ${dataset}`);
}

// ---- 5. report + typecheck gate ----
const touched = `${committedRel} src/data/datasets/${dataset}`;
banner('CHANGES (git)');
run(`git status --short -- ${touched} | sed -n "1,40p"`);
const counts = execSync(`git status --short -- ${touched} | wc -l`, { encoding: 'utf8', cwd: REPO }).trim();
console.log(`  ${counts} changed path(s) total.`);

if (!has('--skip-tsc')) { banner('TYPECHECK'); run('npx tsc --noEmit'); console.log('  tsc OK'); }

console.log(`\n✅ Refreshed ${dataset} from '${ring}'. Next: \`npx vitest run\`, review \`git diff\`, commit on a branch.`);
