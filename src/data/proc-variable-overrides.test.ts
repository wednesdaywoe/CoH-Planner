import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import {
  PROC_DATABASE,
  getProcEffects,
  getProcControlType,
  isVariableProc,
  DEFAULT_STACK_COUNT,
  interpolateScalingValue,
  resolveProcContribution,
  procOverrideKey,
  isDefaultProcOverride,
  pruneProcOverridesForRemovedPowers,
  reindexProcOverridesForRemovedSlot,
  DEFAULT_PROC_OVERRIDE,
} from '@/data';
import { getTableValue } from '@/data/at-tables';
import { slimBuild, hydrateBuild } from '@/utils/build-serialization';
import { encodeBuildToHash } from '@/utils/url-build-sync';
import { decodeImportFragment } from '@/utils/import-url';
import { createEmptyBuild } from '@/types/build';
import type { ProcOverride } from '@/types';

/**
 * Per-proc toggles & variable-proc sliders. Locks the two data landmines the
 * plan glossed over: MotT's "By the Slotted Power" magnitude (generated value 50
 * is scale×100, resolved 50 × 0.10 Tanker Melee_Res_Dmg = 5%/stack) and
 * Reactive Defenses' HP-scaling floor→cap.
 */
beforeAll(async () => {
  await loadDataset('homecoming'); // MotT is an HC Tanker ATO; needs AT tables
});

describe('variable-proc data descriptors', () => {
  it('Might of the Tanker: stacks control, 5% Res(All)/stack on a Tanker', () => {
    const eff = getProcEffects(PROC_DATABASE['Chance for +RES(ALL)']).find((e) => e.category === 'Resistance')!;
    expect(eff.maxStacks).toBe(3);
    expect(eff.scaleTable).toBe('Melee_Res_Dmg');
    expect(getProcControlType(eff)).toBe('stacks');
    // value (50 = scale 0.5 × 100) resolved through the AT modifier table.
    const mod = getTableValue('tanker', 'Melee_Res_Dmg', 50) ?? 0;
    expect(mod).toBeCloseTo(0.1, 5);
    expect((eff.value ?? 0) * mod).toBeCloseTo(5.0, 4);
  });

  it('Reactive Defenses: HP control with 3% floor and 12.9% cap', () => {
    const eff = getProcEffects(PROC_DATABASE['Scaling +Res(All)']).find((e) => e.category === 'Resistance')!;
    expect(eff.scaling).toBe(true);
    expect(eff.value).toBe(3);
    expect(eff.valueMax).toBe(12.9);
    expect(eff.scaleTable).toBeUndefined(); // resolved literal, not table-scaled
    expect(getProcControlType(eff)).toBe('hp');
  });

  it('isVariableProc distinguishes variable procs from plain globals', () => {
    expect(isVariableProc(PROC_DATABASE['Chance for +RES(ALL)'])).toBe(true);
    expect(isVariableProc(PROC_DATABASE['Scaling +Res(All)'])).toBe(true);
    // Steadfast KB protection is a plain always-on global (toggle control only).
    expect(isVariableProc(PROC_DATABASE['Steadfast Protection: Knockback Protection'])).toBe(false);
  });
});

describe('HP-scaling interpolation endpoints', () => {
  it('full HP → floor; 0 HP → cap; linear midpoint', () => {
    expect(interpolateScalingValue(3, 12.9, 100)).toBeCloseTo(3, 5);
    expect(interpolateScalingValue(3, 12.9, 0)).toBeCloseTo(12.9, 5);
    expect(interpolateScalingValue(3, 12.9, 50)).toBeCloseTo((3 + 12.9) / 2, 5);
    // Clamps out-of-range %HP.
    expect(interpolateScalingValue(3, 12.9, 150)).toBeCloseTo(3, 5);
  });
});

describe('resolveProcContribution', () => {
  const auto: ProcOverride = { enabled: true, mode: 'auto' };
  it('disabled proc contributes nothing', () => {
    expect(
      resolveProcContribution({ controlType: 'stacks', perUnitValue: 5, maxStacks: 3, override: { enabled: false, mode: 'auto' } }),
    ).toBe(0);
  });
  it('auto stacks → discrete default (1 stack); pinned → perUnit × stacks (clamped)', () => {
    expect(DEFAULT_STACK_COUNT).toBe(1);
    // auto = 1 stack, NOT a fractional average.
    expect(resolveProcContribution({ controlType: 'stacks', perUnitValue: 5, maxStacks: 3, override: auto })).toBeCloseTo(5, 5);
    expect(resolveProcContribution({ controlType: 'stacks', perUnitValue: 5, maxStacks: 3, override: { enabled: true, mode: 'stacks', stacks: 3 } })).toBeCloseTo(15, 5);
    expect(resolveProcContribution({ controlType: 'stacks', perUnitValue: 5, maxStacks: 3, override: { enabled: true, mode: 'stacks', stacks: 0 } })).toBe(0);
    expect(resolveProcContribution({ controlType: 'stacks', perUnitValue: 5, maxStacks: 3, override: { enabled: true, mode: 'stacks', stacks: 9 } })).toBeCloseTo(15, 5); // clamped to cap
  });
  it('auto HP → floor; hp override interpolates', () => {
    expect(resolveProcContribution({ controlType: 'hp', perUnitValue: 3, capValue: 12.9, override: auto })).toBeCloseTo(3, 5);
    expect(resolveProcContribution({ controlType: 'hp', perUnitValue: 3, capValue: 12.9, override: { enabled: true, mode: 'hp', hpPct: 0 } })).toBeCloseTo(12.9, 5);
  });
  it('toggle proc → full value when enabled', () => {
    expect(resolveProcContribution({ controlType: 'toggle', perUnitValue: 3, override: auto })).toBe(3);
  });
});

describe('override precedence & map helpers', () => {
  it('default override prunes to absent', () => {
    expect(isDefaultProcOverride(DEFAULT_PROC_OVERRIDE)).toBe(true);
    expect(isDefaultProcOverride({ enabled: false, mode: 'auto' })).toBe(false);
    expect(isDefaultProcOverride({ enabled: true, mode: 'stacks', stacks: 2 })).toBe(false);
  });
  it('pruneProcOverridesForRemovedPowers drops removed-power keys', () => {
    const map = { [procOverrideKey('Tough', 1)]: { enabled: false, mode: 'auto' } as ProcOverride, [procOverrideKey('Weave', 0)]: DEFAULT_PROC_OVERRIDE };
    const pruned = pruneProcOverridesForRemovedPowers(map, new Set(['Tough']));
    expect(pruned && Object.keys(pruned)).toEqual([procOverrideKey('Weave', 0)]);
  });
  it('reindexProcOverridesForRemovedSlot drops the slot and shifts higher indices down', () => {
    const map: Record<string, ProcOverride> = {
      [procOverrideKey('Tough', 1)]: { enabled: true, mode: 'stacks', stacks: 1 },
      [procOverrideKey('Tough', 2)]: { enabled: true, mode: 'stacks', stacks: 2 },
      [procOverrideKey('Weave', 2)]: { enabled: false, mode: 'auto' },
    };
    const next = reindexProcOverridesForRemovedSlot(map, 'Tough', 1)!;
    // Tough:1 removed, Tough:2 → Tough:1; Weave untouched.
    expect(next[procOverrideKey('Tough', 1)]).toEqual({ enabled: true, mode: 'stacks', stacks: 2 });
    expect(next[procOverrideKey('Tough', 2)]).toBeUndefined();
    expect(next[procOverrideKey('Weave', 2)]).toEqual({ enabled: false, mode: 'auto' });
  });
});

describe('procOverrides serialization round-trip', () => {
  const overrides: Record<string, ProcOverride> = {
    'Bash:0': { enabled: true, mode: 'stacks', stacks: 2 },
    'Tough:1': { enabled: false, mode: 'auto' },
    'Weave:0': { enabled: true, mode: 'hp', hpPct: 35 },
  };

  it('survives slimBuild → JSON → hydrateBuild', () => {
    const build = createEmptyBuild();
    build.procOverrides = overrides;
    const roundTripped = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    expect(roundTripped.procOverrides).toEqual(overrides);
  });

  it('travels through the share hash (build-identity data, not dropped)', () => {
    const build = createEmptyBuild();
    build.procOverrides = overrides;
    const hash = encodeBuildToHash(build);
    const decoded = JSON.parse(decodeImportFragment(hash));
    expect(decoded.build.procOverrides).toEqual(overrides);
  });

  it('a build with no overrides hydrates without the field', () => {
    const build = createEmptyBuild();
    const roundTripped = hydrateBuild(JSON.parse(JSON.stringify(slimBuild(build))));
    // slimBuild emits {} default; hydrate keeps it absent/empty — either way no entries.
    expect(roundTripped.procOverrides ?? {}).toEqual({});
  });
});
