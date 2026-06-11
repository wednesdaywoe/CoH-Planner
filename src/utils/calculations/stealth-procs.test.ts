import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';

/**
 * Regression: stealth IO procs (Celerity +Stealth, Unbounded Leap +Stealth,
 * Freebird, Time & Space Manipulation) must contribute to the stealth-radius
 * totals on the dashboard.
 *
 * Before the fix, applySingleProcEffect() had no `case 'Stealth'`, so these
 * always-on Proc120s globals fell through to the default no-op and never
 * reached globalBonuses.stealthRadiusPvE / …PvP. The binary-sourced structured
 * effect encodes the PvE radius as { value } and the PvP radius as { valueMax };
 * a stealth IO splits these across two effects:
 *   { value: 30 }                 → 30 ft PvE
 *   { value: 300, valueMax: 300 } → 300 ft PvP (value duplicates valueMax)
 * Stealth radius is ADDITIVE across all sources (powers + IO procs): a Stealth
 * IO stacks on top of a stealth power toward the invisibility cap, and two
 * different stealth IOs stack with each other.
 */

// A slotted always-on stealth proc. collectAlwaysOnProcs reads the raw build
// power, so `powerType: 'Toggle'` + `isActive` must be set explicitly for the
// Proc120s to count as always-on.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stealthProcSlot(setName: string, name: string): any {
  return { type: 'io-set', isProc: true, name, setName, setId: setName.toLowerCase(), pieceNum: 1 };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWithStealthProcs(procs: Array<{ setName: string; name: string }>): any {
  const b = createEmptyBuild();
  b.serverId = 'homecoming';
  b.level = 50;
  b.archetype = { id: 'sentinel', name: 'Sentinel', stats: null, inherent: null } as any;
  // Combat Jumping is a real Toggle that grants NO stealth of its own, so the
  // only stealth source in the build is the proc(s) we slot into it.
  b.pools = [{ id: 'leaping', name: 'Leaping', powers: [
    { internalName: 'Combat_Jumping', name: 'Combat Jumping', powerType: 'Toggle', isActive: true,
      slots: procs.map(p => stealthProcSlot(p.setName, p.name)) },
  ] }] as any;
  return b;
}

describe('stealth IO procs contribute to stealth radius (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('Celerity +Stealth adds 30 ft PvE / 300 ft PvP', () => {
    const t = calculateCharacterTotals(
      buildWithStealthProcs([{ setName: 'Celerity', name: 'Buff Stealth' }]),
      false, undefined, { combatMode: true },
    );
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(30, 4);
    expect(t.globalBonuses.stealthRadiusPvP).toBeCloseTo(300, 4);
  });

  it('Unbounded Leap +Stealth contributes the same radius', () => {
    const t = calculateCharacterTotals(
      buildWithStealthProcs([{ setName: 'Unbounded Leap', name: 'Unbounded Leap: +Stealth' }]),
      false, undefined, { combatMode: true },
    );
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(30, 4);
    expect(t.globalBonuses.stealthRadiusPvP).toBeCloseTo(300, 4);
  });

  it('two different stealth IOs stack additively', () => {
    const t = calculateCharacterTotals(
      buildWithStealthProcs([
        { setName: 'Celerity', name: 'Buff Stealth' },
        { setName: 'Unbounded Leap', name: 'Unbounded Leap: +Stealth' },
      ]),
      false, undefined, { combatMode: true },
    );
    // 30 + 30 = 60 ft PvE, 300 + 300 = 600 ft PvP
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(60, 4);
    expect(t.globalBonuses.stealthRadiusPvP).toBeCloseTo(600, 4);
  });

  it('no stealth proc → zero stealth radius (the pre-fix value, now a floor)', () => {
    const t = calculateCharacterTotals(
      buildWithStealthProcs([]),
      false, undefined, { combatMode: true },
    );
    expect(t.globalBonuses.stealthRadiusPvE).toBe(0);
    expect(t.globalBonuses.stealthRadiusPvP).toBe(0);
  });
});

/**
 * The reported scenario, end-to-end: a DP/NIN Sentinel running Shinobi-Iri (a
 * stealth Toggle, 35.5 ft PvE / 390 ft PvP) with a Celerity +Stealth IO slotted
 * into it. Stealth is additive, so the IO stacks ON TOP of the power — the IO is
 * NOT masked by the stronger power (the pre-fix / max-wins behavior).
 */
describe('stealth power + stealth IO stack additively (homecoming, Sentinel Ninjitsu)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function ninjitsuBuild(withProc: boolean): any {
    const b = createEmptyBuild();
    b.serverId = 'homecoming';
    b.level = 50;
    b.archetype = { id: 'sentinel', name: 'Sentinel', stats: null, inherent: null } as any;
    b.secondary = { id: 'sentinel/ninjitsu', name: 'Ninjitsu', powers: [
      { internalName: 'Shinobi-Iri', name: 'Shinobi-Iri', powerType: 'Toggle', isActive: true,
        slots: withProc ? [stealthProcSlot('Celerity', 'Buff Stealth')] : [] },
    ] } as any;
    return b;
  }

  it('Shinobi-Iri alone = 35.5 ft PvE / 390 ft PvP (baseline)', () => {
    const t = calculateCharacterTotals(ninjitsuBuild(false), false, undefined, { combatMode: true });
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(35.5, 3);
    expect(t.globalBonuses.stealthRadiusPvP).toBeCloseTo(390, 3);
  });

  it('Shinobi-Iri + Celerity +Stealth = 65.5 ft PvE / 690 ft PvP (the IO stacks on top)', () => {
    const t = calculateCharacterTotals(ninjitsuBuild(true), false, undefined, { combatMode: true });
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(35.5 + 30, 3);
    expect(t.globalBonuses.stealthRadiusPvP).toBeCloseTo(390 + 300, 3);
  });
});

/**
 * The suppress-group rule: stealth powers sharing the binary "NictusFX"
 * stack_key (pool Stealth/Super Speed, Shinobi-Iri, the cloak toggles) do NOT
 * stack — only the largest radius applies. An IO proc is a separate group, so it
 * still adds on top. This is the case the stack-key model fixes over naive
 * additive stacking.
 */
describe('suppress-group stealth powers do NOT stack (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function build(opts: { shinobi?: boolean; superSpeed?: boolean; celerity?: boolean }): any {
    const b = createEmptyBuild();
    b.serverId = 'homecoming';
    b.level = 50;
    b.archetype = { id: 'sentinel', name: 'Sentinel', stats: null, inherent: null } as any;
    if (opts.shinobi) {
      b.secondary = { id: 'sentinel/ninjitsu', name: 'Ninjitsu', powers: [
        { internalName: 'Shinobi-Iri', name: 'Shinobi-Iri', powerType: 'Toggle', isActive: true,
          slots: opts.celerity ? [stealthProcSlot('Celerity', 'Buff Stealth')] : [] },
      ] } as any;
    }
    if (opts.superSpeed) {
      b.pools = [{ id: 'speed', name: 'Speed', powers: [
        { internalName: 'Super_Speed', name: 'Super Speed', powerType: 'Toggle', isActive: true, slots: [] },
      ] }] as any;
    }
    return b;
  }

  it('Super Speed alone = 35 ft PvE (sanity: the pool power loads & contributes)', () => {
    const t = calculateCharacterTotals(build({ superSpeed: true }), false, undefined, { combatMode: true });
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(35, 3);
  });

  it('Shinobi-Iri (35.5) + Super Speed (35) = 35.5 ft, NOT 70.5 — same NictusFX group', () => {
    const t = calculateCharacterTotals(build({ shinobi: true, superSpeed: true }), false, undefined, { combatMode: true });
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(35.5, 3); // max(35.5, 35), not the sum
  });

  it('two suppress powers + a Celerity IO = max(35.5, 35) + 30 = 65.5 ft (IO is its own group)', () => {
    const t = calculateCharacterTotals(build({ shinobi: true, superSpeed: true, celerity: true }), false, undefined, { combatMode: true });
    expect(t.globalBonuses.stealthRadiusPvE).toBeCloseTo(65.5, 3);
  });
});
