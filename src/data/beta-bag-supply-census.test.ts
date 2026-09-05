/**
 * BPORT1 — the guard on `scripts/beta-bag-supply-census.cjs`.
 *
 * The census is the measurement the STRIP-1 beta port stands on: it decides, per bag slot,
 * whether a reader is spending something or standing over an empty shelf, and BPORT3/BPORT4
 * adjudicate their seams against its verdicts. A measurement nothing grades drifts, and this
 * one drifts in a particularly quiet way — a converter change moves supply, and the census
 * keeps reporting whatever it now finds without anyone noticing the answer changed.
 *
 * So this pins the SETS, not the counts. `own: 1065` moving to `own: 1071` is a re-export and
 * says nothing; a slot crossing from LIVE to DEAD, or from converter-supplied to minted-only,
 * changes what the port is allowed to delete. Counts stay out of the assertions for the same
 * reason `emit-totals-fixtures` freezes shapes rather than magnitudes.
 *
 * Run as a child process rather than required in-process: the census loads every generated
 * module on all four datasets (~12.5k modules, ~1.3 GB peak), and a vitest worker holding
 * that alongside the rest of the suite is how a runner gets OOM-killed. The child also
 * exercises the CLI the stream doc names as the artifact.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(__dirname, '../..');
const SCRIPT = path.join(REPO, 'scripts/beta-bag-supply-census.cjs');

interface Row {
  slot: string;
  own: number;
  cond: number;
  petReachable: number;
  petRoster: number;
  displayMint: number;
  pseudoPetMint: number;
  dataSupply: number;
  mintSupply: number;
  supply: number;
  verdict: 'LIVE' | 'DEAD';
  survivesStrip: boolean;
  diesWithStrip: boolean;
  readCount: number;
  readFiles: string[];
  readFilesOutsideDisplay: string[];
}

interface Census {
  datasets: string[];
  slots: string[];
  rows: Row[];
  counts: Record<string, {
    powers: number;
    conditionals: number;
    bagCarriers: number;
    bagWithoutAtoms: number;
    narrowMissed: number;
    displayFailures: number;
  }>;
  undeclaredInData: Record<string, number>;
  dynamicKeysUndeclared: Record<string, string[]>;
  undeclaredMints: Record<string, number>;
  buffPetMintedSlots: Record<string, string>;
  displayBagBuilders: string[];
}

/**
 * Slots a non-test reader spends that NO supplier fills, on any of the four datasets.
 *
 * These are the only branches the census proves dead outright, and each one is a deletion
 * BPORT3/BPORT4 may make without further evidence. A slot leaving this set has gained a
 * supplier; a slot joining it has lost its last one, which for a converter-supplied slot is
 * exactly the BPORT7 regression this file exists to catch early.
 *
 * `speedBuff` and `enduranceCrash` joined at BPORT3, and not because supply moved: both are
 * registered in `EFFECT_REGISTRY`, which is the domain of a reader the census could not see
 * until BPORT3 gave it an entry in `DYNAMIC_READ_SITES`. They were dead all along and
 * counted as unread. A registered display row that no supplier ever fills is dead in the
 * same way the other four are.
 */
const ZERO_SUPPLY_SLOTS = ['dot', 'elusivity', 'protection', 'flySpeed', 'speedBuff', 'enduranceCrash'];

/**
 * Slots the converters emit that genuinely nothing spends.
 *
 * BPORT1 reported fourteen. Eleven of those were read the whole time by
 * `resolvePowerMagnitudes`, which names no slot — it walks the bag and keeps whatever the
 * registry registers — so a census keyed on `effects.<slot>` saw no reader for
 * `defenseDebuff` (1,623 carriers), `enduranceDrain` (964) and nine more the info panel
 * renders on every power that has them. Three survive the correction, and they are the only
 * emitted keys a deletion may take on the "nothing reads it" argument alone.
 */
const UNREAD_BUT_SUPPLIED = ['activatePeriod', 'effectArea', 'onlyAffectsSelf'];

/**
 * Names a dynamic reader's roster claims that `PowerEffects` does not declare.
 *
 * A derived roster is the reading code's own statement about what the bag can hold, so a
 * name the type contradicts is an inert arm of that reader rather than a typo. All four are
 * `characterStateAdapter`'s: `adjusterAffectsSelfTotals` tests a conditional's keys against
 * a 32-name set, and these four can never match anything.
 */
const DYNAMIC_KEYS_UNDECLARED = {
  SELF_TOTAL_EFFECT_KEYS: ['regeneration', 'recovery', 'maxEndurance', 'maxHealth'],
};

/**
 * Slots with no converter supply at all — spent only where a mint reaches.
 *
 * The distinction the port turns on: BPORT7's regen empties the authored bag and cannot touch
 * these, because they come from `power.stats`, a pseudo-pet, or a pet entity's auras. Deleting
 * one of these reads because "the bag is gone" would break a live surface.
 */
const MINT_ONLY_SLOTS = [
  'enduranceCost', 'castTime', 'defense', 'healing',
  'runSpeed', 'runSpeedUnenhanced', 'jumpHeight', 'jumpSpeed', 'fly',
];

/**
 * Keys the converters emit into the bag that `PowerEffects` does not declare.
 *
 * `endurance` / `activationTime` are the un-renamed execution stats — the same pair
 * `transformEpicPower` destructures away into `enduranceCost` / `castTime` — so the bag and the
 * type disagree about their spelling on every primary and secondary power. A fourth name
 * appearing here means a converter started emitting something no reader is typed for.
 */
const UNDECLARED_IN_DATA = ['activationTime', 'endurance', 'interruptTime'];

/** Keys `buildDisplayEffects` mints that `PowerEffects` does not declare. */
const UNDECLARED_MINTS = ['flyUnenhanced', 'jumpHeightUnenhanced'];

let census: Census;

beforeAll(() => {
  const raw = execFileSync('node', [SCRIPT, '--json'], {
    cwd: REPO,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  census = JSON.parse(raw) as Census;
}, 300_000);

const row = (slot: string): Row => {
  const r = census.rows.find((x) => x.slot === slot);
  if (!r) throw new Error(`census has no row for slot "${slot}"`);
  return r;
};

describe('BPORT1 census — the population it walks', () => {
  it('covers all four datasets', () => {
    expect([...census.datasets].sort()).toEqual(['brainstorm', 'homecoming', 'rebirth', 'thunderspy']);
  });

  it('finds no power carrying a bag without atoms', () => {
    // The shared sweep's `isPower` requires an `atoms` array, which is right for a gate
    // comparing the two and wrong for a supply census — a bagged power with no atoms is the
    // most interesting row there is. The census walks a wider predicate and reconciles; this
    // asserts the two populations still agree, so the narrowing costs nothing today.
    for (const ds of census.datasets) {
      expect(census.counts[ds].bagWithoutAtoms, ds).toBe(0);
      expect(census.counts[ds].narrowMissed, ds).toBe(0);
    }
  });

  it('builds a display bag for every power', () => {
    // A power the display path throws on is a slot count the census never took.
    for (const ds of census.datasets) {
      expect(census.counts[ds].displayFailures, ds).toBe(0);
    }
  });

  it('walks a non-trivial corpus on each dataset', () => {
    for (const ds of census.datasets) {
      expect(census.counts[ds].powers, ds).toBeGreaterThan(2000);
      expect(census.counts[ds].conditionals, ds).toBeGreaterThan(100);
    }
  });
});

describe('BPORT1 census — the verdicts BPORT3 and BPORT4 adjudicate against', () => {
  it('proves exactly these read slots dead in all five suppliers', () => {
    const dead = census.rows.filter((r) => r.readCount > 0 && r.verdict === 'DEAD').map((r) => r.slot);
    expect(dead.sort()).toEqual([...ZERO_SUPPLY_SLOTS].sort());
  });

  it('finds exactly these read slots minted-only — the strip cannot empty them', () => {
    const mintOnly = census.rows.filter((r) => r.survivesStrip).map((r) => r.slot);
    expect(mintOnly.sort()).toEqual([...MINT_ONLY_SLOTS].sort());
  });

  it('keeps every mint-only slot free of converter supply', () => {
    for (const slot of MINT_ONLY_SLOTS) {
      const r = row(slot);
      expect(r.own, slot).toBe(0);
      expect(r.cond, slot).toBe(0);
      expect(r.mintSupply, slot).toBeGreaterThan(0);
    }
  });

  it('names the totals oracle as an out-of-display-closure reader of the movement mints', () => {
    // The four flattened movement axes are minted by `buildDisplayEffects` out of the nested
    // `movement` container, and read by `legacy-totals.oracle.ts`, which does not build a
    // display bag. For that reader the slot has no supply — which is why canonical retired
    // the same four. Pinned so the mint is never mistaken for supply on the totals path.
    for (const slot of ['runSpeed', 'runSpeedUnenhanced', 'jumpHeight', 'jumpSpeed']) {
      expect(row(slot).readFilesOutsideDisplay, slot)
        .toContain('src/utils/calculations/legacy-totals.oracle.ts');
    }
    expect(census.displayBagBuilders).not.toContain('src/utils/calculations/legacy-totals.oracle.ts');
  });
});

describe('BPORT1 census — supplier 3, the buff-pet mint', () => {
  it('mints seven slots, one per ally-aura PetEffect type', () => {
    expect(Object.keys(census.buffPetMintedSlots)).toHaveLength(7);
  });

  it('still agrees with the switch inside the frozen oracle', () => {
    // The census restates the oracle's mapping rather than importing it, because the oracle
    // exports nothing and its header forbids editing it into agreement with anything. A
    // restatement needs a tripwire or it is just a second, quieter source of truth.
    const src = readFileSync(path.join(REPO, 'src/utils/calculations/legacy-totals.oracle.ts'), 'utf8');
    const start = src.indexOf('function buffPetAuraEffects(');
    expect(start, 'buffPetAuraEffects not found in the oracle').toBeGreaterThan(-1);
    const body = src.slice(start, src.indexOf('\n}', start));
    for (const [type, slot] of Object.entries(census.buffPetMintedSlots)) {
      const caseAt = body.indexOf(`case '${type}':`);
      expect(caseAt, `oracle has no case for PetEffect type ${type}`).toBeGreaterThan(-1);
      const nextCase = body.indexOf("case '", caseAt + 6);
      const arm = body.slice(caseAt, nextCase === -1 ? undefined : nextCase);
      expect(arm, `${type} no longer writes effects.${slot}`).toContain(`effects.${slot}`);
    }
  });

  it('has no source for the seventh slot on any dataset', () => {
    // `RechargeBuff` is in the oracle's switch and in the aura-type set, and no pet entity in
    // any of the four datasets carries one — reachable AND roster are zero. The branch is
    // unreachable today; `rechargeBuff` stays LIVE only through its 317 converter carriers.
    const r = row('rechargeBuff');
    expect(r.petReachable).toBe(0);
    expect(r.petRoster).toBe(0);
    expect(r.own).toBeGreaterThan(0);
  });
});

describe('BPORT1 census — where the bag and its type disagree', () => {
  it('finds exactly the known undeclared keys in the emitted data', () => {
    expect(Object.keys(census.undeclaredInData).sort()).toEqual([...UNDECLARED_IN_DATA].sort());
  });

  it('finds exactly the known undeclared keys minted at the display edge', () => {
    expect(Object.keys(census.undeclaredMints).sort()).toEqual([...UNDECLARED_MINTS].sort());
  });

  it('finds exactly the known inert names in the dynamic readers\' rosters', () => {
    expect(census.dynamicKeysUndeclared).toEqual(DYNAMIC_KEYS_UNDECLARED);
  });
});

describe('BPORT1 census — the slots nothing spends', () => {
  it('finds exactly these emitted slots with no reader at all', () => {
    const unread = census.rows.filter((r) => r.readCount === 0 && r.supply > 0).map((r) => r.slot);
    expect(unread.sort()).toEqual([...UNREAD_BUT_SUPPLIED].sort());
  });

  it('credits the registry-driven reader for the eleven slots BPORT1 called unread', () => {
    // The correction itself, pinned. Each of these is emitted by a converter, named by no
    // `effects.<slot>` read anywhere, and rendered by `RegistryEffectsDisplay` on every power
    // carrying it. If the registry stops registering one, it rejoins UNREAD_BUT_SUPPLIED and
    // BPORT7 is once again allowed to delete a live row.
    for (const slot of ['accuracy', 'threatBuff', 'defenseDebuff', 'regenDebuff', 'recoveryDebuff',
      'enduranceDrain', 'threatDebuff', 'perceptionDebuff', 'specialDebuff', 'fly', 'untouchable']) {
      expect(row(slot).readFiles, slot).toContain('src/components/info/resolvePowerMagnitudes.ts');
      expect(row(slot).supply, slot).toBeGreaterThan(0);
    }
  });
});
