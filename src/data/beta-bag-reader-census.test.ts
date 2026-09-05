/**
 * BPORT4 — the guard on `scripts/beta-bag-reader-census.cjs`, and on the adjudication it carries.
 *
 * BPORT1 pinned supply. This pins the other half: which seams the strip turns into dead code
 * and which into a wrong number, plus the four finder behaviours the whole answer rests on. A
 * finder that quietly narrows is the failure mode here — every one of the three corrections
 * BPORT4 made to its own population was a finder seeing less than it looked like it saw, and
 * a narrowed finder reports FEWER casualties, which reads as progress.
 *
 * Split the way BPORT1's guard is: the full census runs as a child process (it walks all four
 * datasets to answer the coverage question), while the source-only finders are exercised
 * in-process, because those are the assertions that have to be cheap enough to keep.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const REPO = path.resolve(__dirname, '../..');
const SCRIPT = path.join(REPO, 'scripts/beta-bag-reader-census.cjs');
const read = (rel: string) => readFileSync(path.join(REPO, rel), 'utf8');
const require_ = createRequire(import.meta.url);
const { bagSeams, stripComments, guardExpr } = require_(SCRIPT) as {
  bagSeams: (rel: string) => Seam[];
  stripComments: (src: string) => string;
  guardExpr: (before: string) => string | null;
};

interface Seam {
  file: string;
  line: number | null;
  slot: string | null;
  binding: string;
  owner: string | null;
  guardedBy: string | null;
  guardCovers: boolean;
  verdict: string;
  display: string;
  supply: { own: number; cond: number; pet: number; disp: number; pspet: number } | null;
  /** Present only when the census ran with `--sibling`: what the other repo did with this seam. */
  sibling?: 'reads-too' | 'migrated-there' | 'absent';
  /** Atom-query symbols the sibling's copy of this file imports and ours does not. */
  atomArmGap?: string[];
}

interface Census {
  seams: Seam[];
  readerFiles: string[];
  sweep: string[];
  buckets: { bothRead: string[]; identical: string[]; betaOnly: string[]; migrated: string[] } | null;
  builders: string[];
  feeds: Record<string, string[]>;
  coverage: { powers: number; tally: Record<string, { stats: number; bag: number; bagOnly: number }> };
}

/**
 * The seams BPORT7 turns into dead code rather than into a zero.
 *
 * Each is a bag slot whose number ALSO rides `power.stats` or the power's own top level, on
 * every carrier — `bagOnly: 0` over 14,391 powers. That is the whole materiality line BPORT1
 * deferred: seven execution stats and `damage` survive the strip because a second arm already
 * answers, and no other dying slot has one.
 *
 * A pair leaving this set is the ENDSTAT-1 failure repeating — a fallback the code documents
 * and the data does not honour — so it reds here before BPORT7 ships it.
 */
const COVERED_ARMS = [
  'damage/damage',
  'stats.arc/arc',
  'stats.castTime/castTime',
  'stats.endurance/enduranceCost',
  'stats.maxTargets/maxTargets',
  'stats.radius/radius',
  'stats.range/range',
  'stats.recharge/recharge',
];

/**
 * Seams where canonical has ALREADY grown the atom arm and the beta has not.
 *
 * The stream doc scoped BPORT4 expecting "mostly leave, matching canonical". Per file that
 * reads right — both repos read the bag. Per SLOT it is the opposite: canonical calls
 * `movementCapBumpValue(p)` before it looks at `effects.movementCapBump`, and its
 * `character-totals` has no stack read left at all. So the answer for these is CARRY, not
 * leave, and the list is BPORT6's work order rather than a curiosity.
 *
 * A seam joining this map means canonical migrated something else and the beta is now one
 * more behind; a seam leaving it means the beta caught up, or — the case worth catching —
 * canonical grew a bag read back.
 */
const CANONICAL_MIGRATED_FIRST: Record<string, string[]> = {
  'src/components/info/BuffPetAuraToggle.tsx': ['summon'],
  'src/components/info/EnhancementInfoContent.tsx': ['summon'],
  'src/components/info/PowerInfoBlocks.tsx': ['summon'],
  'src/components/modals/CompareSlottingModal.tsx': ['summon'],
  'src/components/powers/power-row-utils.ts': ['debuffResistance', 'mezResistance'],
  'src/utils/calculations/attack-chain-powers.ts': ['summon'],
  'src/utils/calculations/character-totals.ts': ['maxStacks', 'specialBuff', 'stackCaps', 'stacksLinear'],
  'src/utils/calculations/inherents.ts': [
    'buffDuration', 'confuse', 'fear', 'hold', 'immobilize', 'recharge', 'sleep', 'stun',
  ],
  'src/utils/calculations/perma.ts': ['buffDuration', 'recharge'],
};

/**
 * Files whose canonical copy calls atom-native readers this repo's copy does not.
 *
 * The complement of the map above, and the reason that map is a LOWER bound. `StatsDashboard`
 * still names `effects.movementCapBump` in both repos, so a per-slot comparison calls it
 * "reads-too" and stops — but canonical calls `movementCapBumpValue(p)` first and only falls
 * back, while this repo calls nothing. Canonical's own comment on that seam records what the
 * difference costs: at its strip, "Quantum Acceleration on all four forks and Energy Flight on
 * Homecoming/Brainstorm answered no cap raise at all, with nothing red to say so".
 */
const ATOM_ARM_BEHIND = [
  'src/components/layout/StatsDashboard.tsx',
  'src/components/powers/power-row-utils.ts',
  'src/utils/calculations/character-totals.ts',
  'src/utils/calculations/inherents.ts',
];

/** Files handed a display bag as a prop — the hop BPORT1 could not see by import edge. */
const PROP_FED = [
  'src/components/info/DamageBlock.tsx',
  'src/components/info/PowerInfoBlocks.tsx',
  'src/components/info/SharedPowerComponents.tsx',
];

let census: Census;

beforeAll(() => {
  const sibling = path.resolve(REPO, '../coh-sidekick-1.0');
  const args = [SCRIPT, '--json', ...(existsSync(sibling) ? ['--sibling', sibling] : [])];
  census = JSON.parse(execFileSync('node', args, {
    cwd: REPO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
  })) as Census;
}, 300_000);

describe('BPORT4 census — what the strip costs, per seam', () => {
  it('finds exactly these slots with a second arm that already answers', () => {
    const covered = Object.entries(census.coverage.tally)
      .filter(([, v]) => v.bagOnly === 0)
      .map(([k]) => k)
      .sort();
    expect(covered).toEqual([...COVERED_ARMS].sort());
  });

  it('proves the second arm on every carrier, not on a sample', () => {
    // The claim is `bagOnly === 0`, and it is only worth anything against the whole
    // population: a covered pair measured on one dataset would say nothing about the three
    // forks whose converters wrote the bag differently.
    expect(census.coverage.powers).toBeGreaterThan(14_000);
    for (const pair of COVERED_ARMS) {
      expect(census.coverage.tally[pair].bagOnly, pair).toBe(0);
    }
  });

  it('leaves no dying slot silently credited with an arm it does not have', () => {
    // The complement, stated so a NEW covered pair has to be adjudicated rather than
    // inherited: every other dying slot must report every carrier as a casualty.
    for (const [pair, v] of Object.entries(census.coverage.tally)) {
      if (COVERED_ARMS.includes(pair)) continue;
      expect(v.bagOnly, pair).toBe(v.bag);
    }
  });

  it('resolves the prop hop BPORT1 left open, and finds only builders behind it', () => {
    expect(Object.keys(census.feeds).sort()).toEqual([...PROP_FED].sort());
    for (const [fed, from] of Object.entries(census.feeds)) {
      expect(from.every((f) => census.builders.includes(f)), fed).toBe(true);
    }
  });

  it('reproduces the population the stream doc scoped BPORT4 against', () => {
    if (!census.buckets) {
      // Stated rather than silent: without the sibling checkout there is nothing to
      // partition against, and a skipped assertion that says so is not a passing one.
      expect(existsSync(path.resolve(REPO, '../coh-sidekick-1.0'))).toBe(false);
      return;
    }
    const b = census.buckets;
    expect(b.bothRead.length + b.identical.length + b.betaOnly.length + b.migrated.length)
      .toBe(census.sweep.length);
    expect(b.bothRead).toHaveLength(27);
    expect(b.betaOnly).toHaveLength(6);
  });

  it('names the seams canonical migrated first, which the beta owes BPORT6', () => {
    if (!census.buckets) return; // no sibling: the disposition is unmeasurable, not empty
    const carried: Record<string, string[]> = {};
    for (const s of census.seams) {
      if (s.sibling !== 'migrated-there') continue;
      if (s.verdict !== 'dies' && s.verdict !== 'caller-decides') continue;
      (carried[s.file] ??= []).push(s.slot!);
    }
    for (const k of Object.keys(carried)) carried[k] = [...new Set(carried[k])].sort();
    expect(carried).toEqual(CANONICAL_MIGRATED_FIRST);
  });

  it('names the files whose atom arm canonical has and this repo does not', () => {
    if (!census.buckets) return; // no sibling: the disposition is unmeasurable, not empty
    const behind = [...new Set(census.seams
      .filter((s) => (s.atomArmGap ?? []).length > 0)
      .map((s) => s.file))].sort();
    expect(behind).toEqual([...ATOM_ARM_BEHIND].sort());
    // The one that makes the point: named in both copies, depended on in only one.
    const dash = census.seams.find((s) => s.file === 'src/components/layout/StatsDashboard.tsx')!;
    expect(dash.sibling).toBe('reads-too');
    expect(dash.atomArmGap).toContain('movementCapBumpValue');
  });

  it('finds the two bag readers the file-level sweep cannot see', () => {
    // Both take the bag as a PARAMETER and never write `.effects` themselves, so the
    // instrument that built the 27 has no way to reach them. `types/power.ts` is one of the
    // 175 paths verify-sync calls identical, which is why this matters: the same blind spot
    // is in the canonical repo's copy of the same census.
    const missed = census.readerFiles.filter((f) => !census.sweep.includes(f));
    expect(missed.sort()).toEqual([
      'src/components/info/SharedPowerComponents.tsx',
      'src/types/power.ts',
    ]);
  });
});

describe('BPORT4 finders — the four ways a bag read hides from a regex', () => {
  it('does not count prose', () => {
    // `atom-query.ts` names the bag slot each atom query replaces, 49 times, in doc comments.
    // Counted as reads they made the file the second-largest bag reader in the repo — a file
    // whose entire purpose is to not read the bag.
    expect(bagSeams('src/data/core/atom-query.ts')).toHaveLength(0);
    expect(stripComments('a; // effects.damage\nb;')).not.toContain('effects.damage');
    expect(stripComments('const s = "// effects.damage";')).toContain('effects.damage');
  });

  it('follows an alias', () => {
    const seams = bagSeams('src/components/modals/PowersetCompareModal.tsx');
    expect(seams.length).toBeGreaterThan(0);
    expect(seams.every((s) => s.binding === 'alias:power')).toBe(true);
    expect(seams.map((s) => s.slot)).toContain('summon');
  });

  it('follows an alias bound through a chain, not just an identifier', () => {
    // `const domEffects = getArchetype('dominator')?.inherent?.effects` — two optional hops,
    // and an identifier-only pattern reported `getDominationInfo` as reading nothing at all.
    const seams = bagSeams('src/utils/calculations/inherents.ts')
      .filter((s) => s.binding.startsWith('alias:'));
    expect(seams.map((s) => s.slot).sort()).toEqual(['buffDuration', 'recharge']);
  });

  it('does not count an assignment as a read', () => {
    // The oracle MINTS the seven buff-pet aura slots onto a synthesized bag
    // (`effects.regenBuff = sc`). Those are supplier 3 writing, not a reader spending, and
    // counting them made the mint look like the mint being consumed — the exact inversion the
    // supply census exists to prevent. Stated on lines that would otherwise land: each one
    // matches the direct finder's pattern exactly and is excluded only by the assignment test.
    const seams = bagSeams('src/utils/calculations/legacy-totals.oracle.ts');
    const src = read('src/utils/calculations/legacy-totals.oracle.ts').split('\n');
    const mints = src
      .map((l, i) => ({ line: i + 1, l }))
      .filter(({ l }) => /^\s*effects\.\w+ = (?!effects\.)/.test(l));
    expect(mints.length).toBeGreaterThanOrEqual(5);
    for (const { line } of mints) {
      expect(seams.some((s) => s.line === line), `line ${line}`).toBe(false);
    }
  });

  it('tells a real guard from a chain of dying reads', () => {
    expect(guardExpr('const c = p.stats?.recharge ?? ')).toBe('p.stats?.recharge');
    expect(guardExpr('if (e?.hold || ')).toBe('e?.hold');
    expect(guardExpr('if (p.stats?.castTime == null && ')).toBe('p.stats?.castTime');
    expect(guardExpr('const hasDamage = !!p.damage || !!')).toBe('p.damage');
    expect(guardExpr('const x = ')).toBeNull();
    // `e?.hold || e?.stun` reads as guarded and is not: both arms are the same bag and die
    // together. The alias set is what makes that decidable, so this is asserted on a real
    // file rather than on a string.
    const cmp = bagSeams('src/components/modals/PowersetCompareModal.tsx');
    expect(cmp.filter((s) => s.guardedBy && s.guardCovers)).toHaveLength(0);
  });
});
