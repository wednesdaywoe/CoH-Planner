import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getArchetype, getArchetypeIds } from '@/data/archetypes';
import { getAllPowersets } from '@/data/powersets';
import type { Archetype, ArchetypeId } from '@/types';
import { declaredFields } from './declared-fields';

/**
 * `archetype.ts` has to answer for what the archetype pipeline emits, and for what its own doc
 * comments claim.
 *
 * Both halves failed when the two repos' copies were reconciled on 2026-08-21. The beta's copy
 * declared neither absorb field while its own generated module has always emitted them, and
 * BOTH copies were missing the five fields `convert-archetypes.cjs` writes onto every
 * archetype's `stats` (movementBase/Floor/CapTable, defenseFloor, className) — undeclared for
 * as long as they have existed, because `stats: { ...ARCHETYPE_BINARY_STATS[at], … }` is a
 * spread and a spread is exempt from excess-property checking.
 *
 * The doc half is the same class one layer up. Both copies said the regeneration and recovery
 * ceilings are "the published 2000/2500/3000%" and "500/625/750%" caps, and a census of the
 * shipped rows says four values each: the Arachnos classes author a higher base under the same
 * ceiling and so cap at 1667% / 476%. So this pins the exception rather than the rule — a doc
 * or a reader that treats the ceiling as a per-class constant times a published percentage has
 * to red something.
 */

const FORKS = ['homecoming', 'rebirth', 'thunderspy'] as const;
const TYPE_FILE = 'src/types/archetype.ts';

/** cap-at-50 over the class's own base, which is the only way a percentage exists here. */
const ratio = (table: number[], base: number) => Math.round((table[49] / base) * 1e4) / 1e4;

describe('archetype stats: the type answers for the emitted keys and the docs for the data', () => {
  const perFork = new Map<string, Archetype[]>();
  const specializeAts = new Map<string, number[]>();

  beforeAll(async () => {
    for (const fork of FORKS) {
      await loadDataset(fork);
      perFork.set(
        fork,
        getArchetypeIds().map((id) => getArchetype(id as ArchetypeId)!),
      );
      specializeAts.set(
        fork,
        Object.values(getAllPowersets())
          .map((set) => set?.specializeAt ?? 0)
          .filter((level) => level > 0),
      );
    }
  }, 300_000);

  const rows = () => FORKS.flatMap((f) => perFork.get(f)!);

  it('the census is non-empty on every fork, so an all-green run means something', () => {
    for (const fork of FORKS) expect(perFork.get(fork)!.length, fork).toBeGreaterThan(12);
    expect(rows().length).toBeGreaterThan(40);
  });

  it('ArchetypeStats declares every key the pipeline writes onto stats', () => {
    const declared = declaredFields(TYPE_FILE, 'ArchetypeStats');
    expect(declared.has('baseHP')).toBe(true);
    expect(declared.size).toBeGreaterThan(20);
    for (const fork of FORKS) {
      const emitted = new Set(perFork.get(fork)!.flatMap((at) => Object.keys(at.stats)));
      expect([...emitted].filter((k) => !declared.has(k)).sort(), `${fork}: emitted, undeclared`)
        .toEqual([]);
    }
  });

  it('Archetype and its nested types declare every key the registry carries', () => {
    for (const [iface, pick] of [
      ['Archetype', (at: Archetype) => [at]],
      ['InherentPower', (at: Archetype) => [at.inherent]],
      ['ArchetypeBranch', (at: Archetype) => Object.values(at.branches ?? {})],
    ] as const) {
      const declared = declaredFields(TYPE_FILE, iface);
      expect(declared.size, iface).toBeGreaterThan(2);
      for (const fork of FORKS) {
        const emitted = new Set(
          perFork.get(fork)!.flatMap((at) => pick(at).flatMap((o) => Object.keys(o ?? {}))),
        );
        expect([...emitted].filter((k) => !declared.has(k)).sort(), `${fork} ${iface}`).toEqual([]);
      }
    }
  });

  it('the five fields the reconciliation added are the ones the data carries', () => {
    const declared = declaredFields(TYPE_FILE, 'ArchetypeStats');
    for (const f of ['movementBase', 'movementFloor', 'movementCapTable', 'defenseFloor',
      'className', 'absorbCap', 'absorbCapTable']) {
      expect(declared.has(f), `ArchetypeStats.${f} must stay declared`).toBe(true);
      for (const fork of FORKS)
        expect(
          perFork.get(fork)!.every((at) => f in at.stats),
          `${fork} must still emit stats.${f}`,
        ).toBe(true);
    }
  });

  it('a branch states no unlock level; its own powersets carry specializeAt', () => {
    for (const fork of FORKS) {
      for (const at of perFork.get(fork)!) {
        for (const [id, branch] of Object.entries(at.branches ?? {})) {
          expect(Object.keys(branch), `${fork} ${at.name}/${id}`).not.toContain('level');
        }
      }
    }
    // The value a hand-typed `level: 24` was restating. 23 on the raw 0-based scale, so
    // `set_gate` unlocks the branch at 24; nothing else may re-derive it.
    for (const fork of FORKS) {
      const levels = specializeAts.get(fork)!;
      expect(levels.length, `${fork} specialization sets`).toBeGreaterThan(4);
      expect([...new Set(levels)], fork).toEqual([23]);
    }
  });

  it('the uniform clamp scalars are uniform on all three forks', () => {
    for (const at of rows()) {
      const s = at.stats;
      expect(s.rechargeFloor, at.name).toBe(0.25);
      expect(s.rechargeCap, at.name).toBe(5);
      expect(s.enduranceFloor, at.name).toBe(0.0001);
      expect(s.enduranceCap, at.name).toBe(5);
      expect(s.toHitBase, at.name).toBe(0.75);
      expect(s.toHitCapTable[0], at.name).toBe(0.95);
      expect(s.toHitCapTable[49], at.name).toBe(2.0035);
      expect(s.defenseFloor, at.name).toBe(-1);
      expect(s.movementFloor, at.name).toEqual({ runSpeed: 0.1, flySpeed: 0.1, jumpSpeed: 0, jumpHeight: 0 });
      expect(new Set(s.maxEnduranceTable).size, at.name).toBe(1);
      expect(s.maxEnduranceTable[0], at.name).toBe(100);
      expect(s.maxEnduranceCapTable[0], at.name).toBe(120);
      expect(s.maxEnduranceCapTable[49], at.name).toBe(365);
    }
  });

  it('the regen/recovery ceilings are absolute, so the percentage is not a class constant', () => {
    const regen = new Map<number, string[]>(), recov = new Map<number, string[]>();
    for (const fork of FORKS)
      for (const at of perFork.get(fork)!) {
        const s = at.stats;
        const tag = `${fork[0]}:${at.name}`;
        regen.set(ratio(s.regenerationCapTable, s.regenerationBase),
          [...(regen.get(ratio(s.regenerationCapTable, s.regenerationBase)) ?? []), tag]);
        recov.set(ratio(s.recoveryCapTable, s.recoveryBase),
          [...(recov.get(ratio(s.recoveryCapTable, s.recoveryBase)) ?? []), tag]);
      }
    expect([...regen.keys()].sort((a, b) => a - b)).toEqual([16.6667, 20, 25, 30]);
    expect([...recov.keys()].sort((a, b) => a - b)).toEqual([4.7619, 5, 6.25, 7.5]);

    // The retired doc's rule, stated as the thing that must NOT hold. Without this the test
    // above passes on any data whose ratios happen to land on four values.
    for (const fork of FORKS) {
      const veats = perFork.get(fork)!.filter((at) => at.name.startsWith('Arachnos'));
      expect(veats.length, fork).toBe(2);
      for (const at of veats) {
        expect(at.stats.regenerationBase, at.name).toBe(0.3);
        expect(at.stats.recoveryBase, at.name).toBe(1.05);
        expect(ratio(at.stats.regenerationCapTable, at.stats.regenerationBase)).not.toBe(20);
        expect(ratio(at.stats.recoveryCapTable, at.stats.recoveryBase)).not.toBe(5);
      }
    }
  });

  it('the absorb ceiling is its own row, not a second statement of the HP one', () => {
    for (const fork of FORKS) {
      const dom = perFork.get(fork)!.find((at) => at.name === 'Dominator')!;
      expect(dom.stats.absorbCap, fork).not.toBe(dom.stats.baseHP);
      expect(dom.stats.absorbCap, fork).toBeCloseTo(1070.8967, 4);
      expect(dom.stats.absorbCapTable[49], fork).toBeCloseTo(dom.stats.absorbCap, 4);
    }
  });
});
