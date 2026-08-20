import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { ioSetSlot } from '@/test/build-fixtures';
import type { Build, ProcOverride } from '@/types';

/**
 * Calc integration for variable procs (`applyVariableProcBonuses`, legacy-totals.oracle).
 * Might of the Tanker is a "By the Slotted Power" +Res(All) stacking buff — 5% per
 * stack on a Tanker (generated 50 × 0.10 Melee_Res_Dmg) — and Reactive Defenses is
 * an HP-scaling +Res(All) global (3% floor → 12.9% cap). Both were previously
 * dropped/floored; per-proc overrides now drive their steady-state contribution.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function motSlot() {
  return ioSetSlot('might_of_the_tanker', 'Recharge/Chance for +Res(All)');
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reactiveSlot() {
  return ioSetSlot('reactive_defenses', 'Scaling Damage Resistance');
}

function tankerBuild(
  slot: unknown,
  powerName = 'Bash',
  overrides?: Record<string, ProcOverride>,
  // Real click ATTACK powers carry isActive === undefined (buildStore only sets
  // true for toggles/autos/long self-buffs). Default to that so the calc gate is
  // exercised the way real builds hit it — a regression guard for the bug where
  // click-hosted MotT contributed nothing because it wasn't isActive === true.
  power: { powerType?: string; isActive?: boolean } = { powerType: 'Click', isActive: undefined },
): Build {
  const b = createEmptyBuild();
  b.serverId = 'homecoming';
  b.level = 50;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null } as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  b.primary = { id: 'super_strength', name: 'Super Strength', powers: [{
    internalName: powerName, name: powerName, powerSet: 'super_strength', level: 1, powerType: power.powerType, isActive: power.isActive,
    stats: { recharge: 8, castTime: 1.5, radius: 0 },
    slots: [slot],
  }] } as any;
  if (overrides) b.procOverrides = overrides;
  return b;
}

function resSources(build: Build) {
  const t = calculateCharacterTotals(build, false, undefined, {});
  return t.breakdown.get('resSmashing')?.sources ?? [];
}

describe('Might of the Tanker (+Res All, stacking)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('auto default contributes exactly 1 stack (5% Res(All)) from MotT', () => {
    const sources = resSources(tankerBuild(motSlot()));
    const mot = sources.find((s) => s.type === 'proc' && /Might of the Tanker/.test(s.name));
    expect(mot).toBeDefined();
    // Discrete default = 1 stack × 5%/stack (no fractional average).
    expect(mot!.value).toBeCloseTo(5, 4);
  });

  it('pinned to 3 stacks → exactly 15% Res(All)', () => {
    const ov = { 'Bash:0': { enabled: true, mode: 'stacks', stacks: 3 } as ProcOverride };
    const sources = resSources(tankerBuild(motSlot(), 'Bash', ov));
    const mot = sources.find((s) => s.type === 'proc' && /Might of the Tanker/.test(s.name));
    expect(mot?.value).toBeCloseTo(15, 4); // 5% × 3 stacks
  });

  it('disabled override → no MotT contribution', () => {
    const ov = { 'Bash:0': { enabled: false, mode: 'auto' } as ProcOverride };
    const sources = resSources(tankerBuild(motSlot(), 'Bash', ov));
    expect(sources.some((s) => /Might of the Tanker/.test(s.name))).toBe(false);
  });

  it('contributes from a click attack whose isActive is undefined (real-build shape)', () => {
    // Regression: the host gate must not require isActive === true — a picked
    // click attack (isActive undefined) is in-rotation and must contribute.
    const ov = { 'Bash:0': { enabled: true, mode: 'stacks', stacks: 3 } as ProcOverride };
    const sources = resSources(tankerBuild(motSlot(), 'Bash', ov, { powerType: 'Click', isActive: undefined }));
    const mot = sources.find((s) => /Might of the Tanker/.test(s.name));
    expect(mot?.value).toBeCloseTo(15, 4);
  });

  it('the host\'s TYPE comes from the dataset, not the build object', () => {
    // The engine resolves Bash's def from the contract, where it is a Click — so declaring the
    // fixture a toggled-off Toggle does not suppress the proc, and a click attack is in
    // rotation. The pre-engine calc read `powerType`/`isActive` off the build object, which let
    // this case fabricate a toggled-off attack; the wire has no such state (`is_active` is a
    // plain bool, and a never-toggled click sends `false` like an explicitly-off one), so host
    // suppression is decided by the DEF's type. The reachable way to switch this proc off is
    // its own override, covered above.
    const ov = { 'Bash:0': { enabled: true, mode: 'stacks', stacks: 3 } as ProcOverride };
    const sources = resSources(tankerBuild(motSlot(), 'Bash', ov, { powerType: 'Toggle', isActive: false }));
    expect(sources.some((s) => /Might of the Tanker/.test(s.name))).toBe(true);
  });
});

describe('Reactive Defenses (+Res All, HP-scaling)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('auto default contributes the 3% floor', () => {
    const sources = resSources(tankerBuild(reactiveSlot()));
    const rd = sources.find((s) => s.type === 'proc' && /Reactive Defenses/.test(s.name));
    expect(rd?.value).toBeCloseTo(3, 4);
  });

  it('%HP override at 0 HP → the 12.9% cap', () => {
    const ov = { 'Bash:0': { enabled: true, mode: 'hp', hpPct: 0 } as ProcOverride };
    const sources = resSources(tankerBuild(reactiveSlot(), 'Bash', ov));
    const rd = sources.find((s) => s.type === 'proc' && /Reactive Defenses/.test(s.name));
    expect(rd?.value).toBeCloseTo(12.9, 4);
  });

  it('disabled override → no Reactive contribution', () => {
    const ov = { 'Bash:0': { enabled: false, mode: 'auto' } as ProcOverride };
    const sources = resSources(tankerBuild(reactiveSlot(), 'Bash', ov));
    expect(sources.some((s) => /Reactive Defenses/.test(s.name))).toBe(false);
  });
});

describe('regression: no variable procs', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('a build with no procs has no variable-proc resistance source', () => {
    const b = tankerBuild(null);
    const sources = resSources(b);
    expect(sources.some((s) => s.type === 'proc')).toBe(false);
  });
});
