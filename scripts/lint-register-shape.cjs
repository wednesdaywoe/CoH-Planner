#!/usr/bin/env node
/**
 * lint-register-shape.cjs — keep docs/DATA-GAP-REGISTER.md a checklist, not a story.
 *
 * The register's own header rule is the spec: closed entries "keep their narrative
 * in docs/gaps/", and the frontier "stays a pointer list and doesn't accumulate
 * closure prose." The rule was written in 32c7786fe2 (2026-08-11), and the wall
 * that violated it (12,764 chars of closure narrative under "Recent closures")
 * landed in the very next commit — the rule said what was forbidden but nowhere
 * said where the story goes, so it grew back. This guard makes the shape
 * measurable, and src/data/docs/register-shape.test.ts fails CI when it drifts.
 *
 *   node scripts/lint-register-shape.cjs          # report
 *   node scripts/lint-register-shape.cjs --gate   # exit 1 on any error
 *
 * Limits are measured against the 2026-08-18 register before the fix — observed
 * maxima of the LEGITIMATE shape, not guesses:
 *
 *   1. an id-prefixed line (like "COND-10, the Parse6 forks' …") is a closure
 *      narrative wearing a checkbox's hat — ids may only start a checkbox row.
 *   2. the header's "N open, of M entries" count agrees with the file (stale
 *      counts are how "0 open" sat above an open entry).
 *   3. the Current frontier section exists and names every OPEN entry — an open
 *      gap that is not up front is invisible to /frontier.
 *   4. prose paragraphs: max 400 chars in Current frontier (observed max of the
 *      legitimate frontier prose: 226; the wall: 12,764), max 550 elsewhere
 *      (observed max in the legitimate file: the 503-char header intro).
 *   5. a checkbox row (with wrapped continuations) stays under 542 chars
 *      (observed max legitimate row: ATOM-BAG-8 at 542) — a growing row is a
 *      story being filed in the wrong place.
 *   6. every checkbox ID has a narrative section (## ID / ### ID header) in
 *      docs/gaps/ — "a gap leaves this file only as fixed-with-a-guard, never
 *      by silent deletion," and the narrative is the other half of that. This
 *      one is canonical-only: the narratives quote the private source defs, so
 *      the public repo cannot hold them. The beta's report says so out loud
 *      rather than skipping quietly.
 *   7. each section's "[Full detail](...) — N of M closed" line agrees with the
 *      rows under it. Rule 2 grades the same claim for the file as a whole, and
 *      the per-section copies rotted underneath it precisely because nothing
 *      did: on 2026-08-24 four of eight had drifted, and two of them ("26 of 27",
 *      "35 of 36") still advertised an open entry while the header correctly
 *      said 0 open. A count nobody grades is a comment.
 *
 * Rules 1, 3 and 6 all key on the id pattern, and until 2026-08-18 that pattern
 * ended in `\d+`, which only matches an id whose digits follow a letter directly.
 * Every id here puts them after a hyphen, so the pattern saw 16 of 164 rows and
 * rule 1, the one this guard exists for, could not see a prose line starting
 * "INHERENT-6, ...". See ID below.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REGISTER = path.join(ROOT, 'docs', 'DATA-GAP-REGISTER.md');
const GAPS_DIR = path.join(ROOT, 'docs', 'gaps');

/**
 * Which repo is this? Both hold the register — it is hand-mirrored between them and its rows are
 * cited from the beta's converters — so both run this guard. Only rule 6 differs, and the reason
 * is in NARRATED_HERE below. Keyed on package.json `name` rather than the directory, for the same
 * reason verify-sync.cjs is: the directory is whatever a checkout called it.
 */
const ROLE = { 'coh-sidekick-pipeline': 'canonical', 'coh-sidekick': 'beta' }[
  JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).name
];
if (!ROLE) throw new Error('package.json name is neither repo');

/**
 * Rule 6 grades the register against the narratives, and only canonical holds them. The gaps tree
 * quotes the private HC and CoH source defs at length, so it cannot be vendored into the public
 * repo, and porting it to make a guard green would be the wrong way round. So rule 6 runs where
 * the narratives are and the beta's report SAYS it did not run — an unstated skip is how a guard
 * goes quiet, and the beta's 182 unnarrated ids are a real thing about the beta's copy of the
 * register (a row there points at a story the reader cannot reach), not a thing to hide.
 */
const NARRATED_HERE = ROLE === 'canonical';
const MAX_FRONTIER_PROSE = 400; // observed max of the legitimate frontier (intro: 226)
const MAX_OTHER_PROSE = 550; // observed max elsewhere (header intro: 503)
const MAX_ROW = 542; // observed max legitimate checkbox row (ATOM-BAG-8)

/**
 * An entry id: uppercase segments joined by hyphens, with a digit somewhere (INHERENT-6,
 * ATOM-BAG-8, WRAP-1a, TSPY-4). The lookahead is what makes it an id rather than a shouted
 * word, and it replaces a `\d+` tail that only matched an id whose digits followed a LETTER
 * directly. Every real id ends its digits after a hyphen, so the old pattern saw 16 of the
 * register's 164 rows and rules 1, 3 and 6 were quietly grading a sixteenth of the file.
 */
const ID = '(?=[A-Z0-9-]*\\d)[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*';

const gate = process.argv.includes('--gate');

const text = fs.readFileSync(REGISTER, 'utf8');
const lines = text.split('\n');
const errors = [];

// -- 1: an id-prefixed line is a checkbox row or a continuation ------------------
for (const [i, line] of lines.entries()) {
  if (line.startsWith('#') || line.startsWith('  ') || line.startsWith('\t')) continue;
  const m = line.match(new RegExp(`^(\\*\\*|[-*] \\[[ x]\\] \\*\\*)?(${ID})\\b`));
  if (!m) continue;
  if (!/^[-*] \[[ x]\] \*\*/.test(line)) {
    errors.push(
      `line ${i + 1}: id-prefixed prose line "${m[2]}" — a closure narrative belongs in docs/gaps/, ` +
        `the row stays a checkbox`
    );
  }
}

// -- 2: stated counts agree with the file ----------------------------------------
const openBoxes = lines.filter((l) => /^[-*] \[ \] \*\*/.test(l)).length;
const allBoxes = lines.filter((l) => /^[-*] \[[ x]\] \*\*/.test(l)).length;
const stated = text.match(/\*\*(\d+) open, of (\d+) entries\.\*\*/);
if (!stated) {
  errors.push('header count "**N open, of M entries.**" not found');
} else {
  if (Number(stated[1]) !== openBoxes)
    errors.push(`stated "${stated[1]} open" but the file lists ${openBoxes} unchecked rows`);
  if (Number(stated[2]) !== allBoxes)
    errors.push(`stated "of ${stated[2]} entries" but the file lists ${allBoxes} checkbox rows`);
}

// -- 3: frontier lists every open entry ------------------------------------------
const fh = lines.findIndex((l) => l === '## Current frontier');
let frontier = [];
if (fh === -1) {
  errors.push('no "## Current frontier" section');
} else {
  const fhEnd = lines.slice(fh + 1).findIndex((l) => l.startsWith('## '));
  frontier = fhEnd === -1 ? lines.slice(fh + 1) : lines.slice(fh + 1, fh + 1 + fhEnd);
  const named = new Set(
    [...frontier.join('\n').matchAll(new RegExp(`\\b${ID}\\b`, 'g'))].map((m) => m[0])
  );
  for (const line of lines) {
    const m = line.match(new RegExp(`^[-*] \\[ \\] \\*\\*(${ID})\\*\\*`));
    if (m && !named.has(m[1])) errors.push(`open entry ${m[1]} is not listed under Current frontier`);
  }
}

// -- 4: prose paragraph caps ------------------------------------------------------
const paraCap = (slice, cap, where) => {
  let para = [];
  let start = -1;
  const flush = () => {
    if (!para.length) return;
    const size = para.join('').length;
    if (size > cap)
      errors.push(
        `${where}: prose paragraph of ${size} chars (max ${cap}), starting line ${start + 1}: ` +
          `"${para[0].slice(0, 60)}…" — closure narrative belongs in docs/gaps/`
      );
    para = [];
  };
  slice.forEach((l, i) => {
    const blank = l.trim() === '';
    const structural = l === '---' || l.startsWith('## ') || l.startsWith('### ') || /^[-*] /.test(l);
    if (blank || structural) {
      flush();
      return;
    }
    if (!para.length) start = i;
    para.push(l);
  });
  flush();
};
if (fh !== -1) {
  const fhEnd = lines.slice(fh + 1).findIndex((l) => l.startsWith('## '));
  paraCap(frontier, MAX_FRONTIER_PROSE, 'Current frontier');
  const body = fhEnd === -1 ? [] : lines.slice(fh + 1 + fhEnd);
  paraCap(lines.slice(0, fh).concat(body), MAX_OTHER_PROSE, 'register body');
}

// -- 5: checkbox row cap (row + its wrapped continuations) -------------------------
for (let i = 0; i < lines.length; i++) {
  if (!/^[-*] \[[ x]\] \*\*/.test(lines[i])) continue;
  let n = lines[i].length;
  let j = i + 1;
  while (j < lines.length && /^[ \t]+\S/.test(lines[j]) && !/^[-*] \[/.test(lines[j])) {
    n += lines[j].length;
    j++;
  }
  if (n > MAX_ROW)
    errors.push(
      `line ${i + 1}: checkbox row of ${n} chars (max ${MAX_ROW}) — the row is a checklist line, ` +
        `the story goes in docs/gaps/`
    );
  i = j - 1;
}

// -- 7: per-section counts agree with the rows under them -------------------------
// The section header states "N of M closed" over its own rows. Only lines carrying that
// shape are graded — `gaps/method-notes.md` is linked with a description instead of a
// count, and a pointer is not a claim about a population.
{
  let cur = null; // { line, stated, closed, total, file }
  const flushSection = () => {
    if (!cur) return;
    if (cur.stated.closed !== cur.closed || cur.stated.total !== cur.total) {
      errors.push(
        `line ${cur.line}: section "${cur.file}" states "${cur.stated.closed} of ${cur.stated.total} ` +
          `closed" but the rows under it are ${cur.closed} of ${cur.total}`
      );
    }
    cur = null;
  };
  for (const [i, line] of lines.entries()) {
    const head = line.match(/^\[Full detail\]\((gaps\/[^)]+)\)\s+—\s+(\d+) of (\d+) closed\s*$/);
    if (head) {
      flushSection();
      cur = {
        line: i + 1,
        file: head[1],
        stated: { closed: Number(head[2]), total: Number(head[3]) },
        closed: 0,
        total: 0,
      };
      continue;
    }
    // any other [Full detail] pointer ends the previous section without opening one
    if (line.startsWith('[Full detail](')) {
      flushSection();
      continue;
    }
    if (line.startsWith('## ')) flushSection();
    if (!cur) continue;
    if (/^[-*] \[x\] \*\*/.test(line)) {
      cur.closed++;
      cur.total++;
    } else if (/^[-*] \[ \] \*\*/.test(line)) {
      cur.total++;
    }
  }
  flushSection();
}

// -- 6: every checkbox ID has a narrative section in docs/gaps/ --------------------
const gapSections = new Map();
for (const f of NARRATED_HERE ? fs.readdirSync(GAPS_DIR).filter((f) => f.endsWith('.md')) : []) {
  const t = fs.readFileSync(path.join(GAPS_DIR, f), 'utf8');
  for (const m of t.matchAll(new RegExp(`^#{2,3} (${ID})\\b`, 'gm'))) {
    if (!gapSections.has(m[1])) gapSections.set(m[1], f);
  }
}
const checkboxIds = [
  ...text.matchAll(new RegExp(`^[-*] \\[[ x]\\] \\*\\*(${ID})\\*\\*`, 'gm')),
].map((m) => m[1]);
for (const id of NARRATED_HERE ? checkboxIds : []) {
  if (!gapSections.has(id))
    errors.push(`${id}: no narrative section (## ${id}) in docs/gaps/ — the row has no companion file`);
}

// -- report ------------------------------------------------------------------------
if (errors.length) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.error(`\n${errors.length} error(s) — the register is no longer a checklist.`);
  if (gate) process.exit(1);
} else {
  console.log(
    `ok: ${allBoxes} entries (${openBoxes} open), section counts agree, ` +
      `frontier prose under ${MAX_FRONTIER_PROSE} chars/paragraph, ` +
      `rows under ${MAX_ROW} chars, ` +
      (NARRATED_HERE
        ? `all ${checkboxIds.length} ids narrated in docs/gaps/`
        : `${checkboxIds.length} ids NOT checked for narratives — they live in the private ` +
          `canonical repo, so rule 6 runs there`)
  );
}
