#!/usr/bin/env node
/**
 * audit-dataset-roster.cjs — find the hand-copied dataset rosters a new dataset falls out of.
 *
 * Adding a dataset is two jobs, and only the first one fails loudly. The enum gains a variant
 * and `cargo` stops at every exhaustive `match`, which is Rule 1 working. The second job has no
 * such compiler: a roster written as a LITERAL — `['homecoming', 'rebirth', 'thunderspy']` in a
 * converter, `[DatasetId; 3]` in a corpus gate — keeps its three names, sweeps three datasets,
 * and reports PASS. Nothing is wrong with the output; the fourth dataset simply was not asked
 * about. That is the shape the register calls a silent partition blackout, and it is worse than
 * a red gate because a green one is read as coverage.
 *
 * Measured when `brainstorm` was added on 2026-08-21: 20 script rosters and 22 Rust corpus
 * gates carried a hand-copied three. All 22 Rust files listed the SAME three in the SAME order,
 * which is what a copy looks like — none of them was a deliberate subset. The 69 gates that
 * already read `DatasetId::ALL` swept the new dataset the moment the variant existed.
 *
 *   node scripts/audit-dataset-roster.cjs           # report
 *   node scripts/audit-dataset-roster.cjs --gate    # exit 1 on any finding
 *
 * What it grades: a COLLECTION literal (array, Set) that names all but ONE dataset. That
 * asymmetry is the whole heuristic, and it is worth stating plainly: a literal naming two of
 * four is nearly always a deliberate pair — `[Rebirth, Thunderspy]` is "the Parse6 forks", an
 * answer rather than a roster — while a literal naming three of four is what a roster looks
 * like the day after a fourth dataset arrives. So the gate flags the near-complete list and
 * stays quiet on the small partition. A stale roster that falls TWO datasets behind slips
 * through; that is the accepted cost of not drowning the real finding in fork pairs.
 *
 * What it deliberately does NOT grade, because these are legitimate and common:
 *   - a `match` arm partitioning datasets (`Rebirth | Thunderspy => 10`) — that is a per-fork
 *     ANSWER, and the compiler already forces it to be total;
 *   - a table KEYED by dataset name (`{ homecoming: 405, rebirth: 281 }`). Those need a value
 *     per dataset, but a missing key is a different defect with a different fix, and folding
 *     the two together would bury both. They are listed separately as advisories.
 *
 * Deliberate subsets belong in ALLOWLIST below, each with the reason it is not the whole roster.
 * An entry with no reason is the thing this gate exists to catch, so the reason is required.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { ALL_DATASETS, REPO_ROOT } = require('./_dataset-paths.cjs');

const GATE = process.argv.includes('--gate');

/** Deliberate subsets: file → why it is not the full roster. */
const ALLOWLIST = {
  // The four fixture emitters USED to sit here, on the reasoning that they dump from the beta's
  // frozen TypeScript calc and that calc has no brainstorm dataset. That was never true of this
  // repo: the emitters import `../src/data/dataset`, which is the vendored calc HERE, and the
  // brainstorm tree was scaffolded into it when BRAIN-1 landed. The allowance outlived its
  // premise and held the door open — three of the four had already been widened by hand while
  // their allowlist rows still said they could not be, and the audit reported the subset it was
  // told to expect rather than the one on disk. An allowance that names a blocker is only worth
  // what re-checking the blocker costs; this one was never re-checked, and the four fixture
  // corpora stayed three-dataset until `movement_gate`'s per-dataset floor said so out loud.
  // Three beta-runtime rows used to sit here, excused because `build:engine` had not yet
  // produced `public/engine/contract/brainstorm.json.gz` and widening them would have pointed
  // the beta at a missing bundle. The bundle landed with the dataset and nobody re-checked the
  // allowance, so the server picker stayed three-dataset and Brainstorm shipped unselectable.
  // All three read DATASET_IDS now. This is the paragraph above, happening again: an allowance
  // is only worth what re-checking its blocker costs.
  'src/utils/per-server-builds.test.ts': 'grades the beta runtime list above, so it moves with it',
  // The Mids oracle was retired as an authority (register: "Mids retired as an authority",
  // 2026-07-19). Its CLI still resolves the three datasets it was built against; pointing it at
  // a fourth would imply a Mids cross-check for Brainstorm that nobody intends to run.
  'tools/mids-oracle/diff_enh_oracle.py': 'retired oracle; no Brainstorm cross-check is intended',
};

const SCAN_DIRS = ['scripts', 'src', 'crates', 'tools'];
const SKIP_DIRS = new Set(['node_modules', 'target', 'generated', 'datasets', '.git', 'attic']);
const EXTS = new Set(['.js', '.cjs', '.mjs', '.ts', '.tsx', '.rs', '.py']);

/** `DatasetId::Homecoming` → `homecoming`, for comparing Rust variants against the roster. */
const variantOf = (id) => id.charAt(0).toUpperCase() + id.slice(1);
const VARIANTS = new Map(ALL_DATASETS.map((d) => [variantOf(d), d]));

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

/**
 * Collection literals naming datasets. Matched on the bracketed span rather than line by line,
 * because every Rust roster and half the JS ones are written across four lines.
 */
function rostersIn(text, rust) {
  const found = [];
  tupleTables.length = 0;
  // The span cap is deliberately generous. It was 400 and that is how the display slot-presence
  // gate's adjudication table — a `(dataset, power, key, reason)` tuple array longer than 400
  // chars — fell out of the scan entirely and reported nothing, while Brainstorm was in fact
  // missing two of its rows. A cap that silently drops the biggest tables drops exactly the ones
  // worth reading.
  const brackets = text.matchAll(/\[[^[\]]{0,6000}?\]/gs);
  for (const m of brackets) {
    const span = m[0];
    // A ROSTER is a list of datasets to sweep. A TABLE pairs each dataset with an expectation
    // — `[(DatasetId::Homecoming, 612), …]` — and a missing row there is the advisory class
    // below, not this one. They are told apart by the tuple, because the fix differs: a roster
    // is repointed at the one source, while a table needs a MEASURED value per dataset and
    // cannot be filled in mechanically.
    if (/\(\s*DatasetId::[A-Za-z]+\s*,/.test(span)) {
      const line = text.slice(0, m.index).split('\n').length;
      const named = [...span.matchAll(/DatasetId::([A-Za-z]+)/g)]
        .map((v) => VARIANTS.get(v[1]))
        .filter(Boolean);
      const gap = ALL_DATASETS.filter((d) => !named.includes(d));
      if (named.length >= 2 && gap.length) tupleTables.push({ line, missing: gap });
      continue;
    }
    const names = new Set();
    if (rust) {
      for (const v of span.matchAll(/DatasetId::([A-Za-z]+)/g)) {
        if (VARIANTS.has(v[1])) names.add(VARIANTS.get(v[1]));
      }
    } else {
      for (const q of span.matchAll(/['"]([a-z]+)['"]/g)) {
        if (ALL_DATASETS.includes(q[1])) names.add(q[1]);
      }
    }
    // A span that is really a table KEYED by dataset belongs to the advisory class below, and
    // saying so here keeps one shape from being reported twice under two different fixes. The
    // widened cap made this reachable: `SURFACES` names three datasets as quoted path segments
    // inside `join(...)` while `homecoming:` is an unquoted key whose path is the tree root, so
    // the quoted-name count reads as a roster missing Homecoming. It is not a roster at all.
    const keyed = ALL_DATASETS.filter((d) => new RegExp(`['"]?${d}['"]?\\s*:`).test(span));
    if (keyed.length >= 2) continue;
    if (names.size === ALL_DATASETS.length - 1) {
      const line = text.slice(0, m.index).split('\n').length;
      found.push({ line, missing: ALL_DATASETS.filter((d) => !names.has(d)) });
    }
  }
  // A Rust roster can also declare its size in the TYPE, which is the form that silently
  // stays at three: `const DATASETS: [DatasetId; 3]`.
  //
  // Both the bare roster and the TUPLE-TABLE form are matched, because only the first was, and
  // the gap cost a runtime panic. `movement_cap_atom_bag_parity.rs` declared
  // `[(DatasetId, usize, usize); 3]` and looped over `DatasetId::ALL`, so Brainstorm found no
  // row and the `.expect` fired. The audit did name both lines — as two entries in an advisory
  // list 74 long, which is a list nobody reads. A literal arity that disagrees with the roster
  // is mechanical and needs no measurement to spot, so it is a GATE finding even though a
  // MISSING ROW in the same table is only advisory: the arity is the part that can be checked
  // without knowing what the right number is. Writing the length as `DatasetId::ALL.len()`
  // demotes the whole class to a compile error, which is where it belongs.
  if (rust) {
    const arity = /\[\s*(?:DatasetId|\(\s*DatasetId\s*,[^;\]]{0,120}?\))\s*;\s*(\d+)\s*\]/g;
    for (const m of text.matchAll(arity)) {
      if (Number(m[1]) !== ALL_DATASETS.length) {
        found.push({
          line: text.slice(0, m.index).split('\n').length,
          missing: [`array typed \`; ${m[1]}\`, roster has ${ALL_DATASETS.length}`],
        });
      }
    }
  }
  return found;
}

/**
 * `match dataset { DatasetId::X => …, _ => … }` — a wildcard arm partitioning datasets.
 *
 * This is the one shape that defeats Rule 1's exhaustive match, and it is worse than a stale
 * roster because it does not merely skip the new dataset: it silently ASSIGNS it another
 * dataset's answer. Both times it bit here the wrong answer was a fork's — Brainstorm was
 * handed Thunderspy's snipe floor of `(0, 8)`, which a dataset trading damage on all 48 of its
 * snipes clears while grading none of them. A vacuous pass, reported as coverage.
 *
 * `_ => panic!(…)` / `unreachable!(…)` is exempt: refusing an unexpected dataset is the
 * opposite failure mode, and it is loud.
 */
function wildcardArmsIn(text) {
  const out = [];
  for (const m of text.matchAll(/^[ \t]*_ =>(.*)$/gm)) {
    if (/panic!|unreachable!|todo!/.test(m[1])) continue;
    const before = text.slice(Math.max(0, m.index - 1200), m.index);
    const lastMatch = before.lastIndexOf('match ');
    if (lastMatch === -1) continue;
    if (!/DatasetId::[A-Za-z]+\s*(=>|\|)/.test(before.slice(lastMatch))) continue;
    out.push({ line: text.slice(0, m.index).split('\n').length });
  }
  return out;
}

/** Tables keyed by dataset name — advisory: a missing key is a different defect. */
function keyedTablesIn(text) {
  const out = [];
  for (const m of text.matchAll(/[{[]\s*(?:\/\/[^\n]*\n\s*)*['"]?homecoming['"]?\s*:/g)) {
    const span = text.slice(m.index, m.index + 600);
    const present = ALL_DATASETS.filter((d) => new RegExp(`['"]?${d}['"]?\\s*:`).test(span));
    const missing = ALL_DATASETS.filter((d) => !present.includes(d));
    if (present.length >= 2 && missing.length) {
      out.push({ line: text.slice(0, m.index).split('\n').length, missing });
    }
  }
  return out;
}

/**
 * The same defect one level down: a pin table whose key is `<dataset>|<power>|<axis>`
 * rather than a bare dataset name. `keyedTablesIn` can't see these, because the
 * character after the dataset name is a delimiter and not a colon, so
 * planb-shadow-movement's three TARGETS-3 tables sat a dataset behind while its two
 * sibling gates were flagged and widened (MOVE-4).
 *
 * Scoped to a bracket-matched `const NAME = { ... }` / `[ ... ]` so the whole table is
 * one span (the sibling gates pin theirs as arrays). The
 * 600-char window `keyedTablesIn` uses would cut a long pin table in half and report
 * every prefix past the cut as missing.
 */
function compositeKeyedTablesIn(text) {
  const out = [];
  for (const m of text.matchAll(/const\s+\w+\s*=\s*[{[]/g)) {
    const start = m.index + m[0].length - 1;
    const open = text[start], close = open === '{' ? '}' : ']';
    let depth = 0, end = -1;
    for (let i = start; i < text.length; i++) {
      if (text[i] === open) depth++;
      else if (text[i] === close && --depth === 0) { end = i; break; }
    }
    if (end < 0) continue;
    const span = text.slice(start, end);
    const present = ALL_DATASETS.filter((d) => new RegExp(`['"\`]${d}\\|`).test(span));
    const missing = ALL_DATASETS.filter((d) => !present.includes(d));
    if (present.length >= 2 && missing.length) {
      out.push({ line: text.slice(0, m.index).split('\n').length, missing });
    }
  }
  return out;
}

const findings = [];
const advisories = [];
/** Filled by `rostersIn`: `(DatasetId, expectation)` tables missing a dataset. */
const tupleTables = [];

for (const dir of SCAN_DIRS) {
  const root = path.join(REPO_ROOT, dir);
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const rel = path.relative(REPO_ROOT, file);
    if (rel === path.join('scripts', 'audit-dataset-roster.cjs')) continue;
    const text = fs.readFileSync(file, 'utf-8');
    if (!ALL_DATASETS.some((d) => text.includes(d) || text.includes(variantOf(d)))) continue;
    const rust = file.endsWith('.rs');
    for (const hit of rostersIn(text, rust)) {
      if (ALLOWLIST[rel]) continue;
      findings.push({ rel, ...hit });
    }
    for (const hit of tupleTables) advisories.push({ rel, ...hit });
    if (rust) {
      for (const hit of wildcardArmsIn(text)) {
        if (!ALLOWLIST[rel]) findings.push({ rel, ...hit, missing: ['`_ =>` arm over datasets'] });
      }
    }
    for (const hit of keyedTablesIn(text)) advisories.push({ rel, ...hit });
    for (const hit of compositeKeyedTablesIn(text)) advisories.push({ rel, ...hit });
  }
}

console.log(`roster: ${ALL_DATASETS.join(', ')}`);
console.log(`allowlisted files: ${Object.keys(ALLOWLIST).length}`);
for (const [file, why] of Object.entries(ALLOWLIST)) console.log(`  ${file} — ${why}`);

console.log(`\nkeyed tables missing a dataset (advisory, ${advisories.length}):`);
for (const a of advisories) console.log(`  ${a.rel}:${a.line}  missing ${a.missing.join(', ')}`);

console.log(`\npartial rosters (${findings.length}):`);
for (const f of findings) console.log(`  ${f.rel}:${f.line}  missing ${f.missing.join(', ')}`);

if (!findings.length) console.log('  none — every roster literal names the whole set.');

if (GATE && findings.length) {
  console.error(
    `\nGATE FAIL — ${findings.length} literal roster(s) name a subset of the datasets. ` +
      `Point them at ALL_DATASETS / DatasetId::ALL, or allowlist each with its reason.`,
  );
  process.exit(1);
}
console.log(GATE ? '\nGATE PASS' : '');
