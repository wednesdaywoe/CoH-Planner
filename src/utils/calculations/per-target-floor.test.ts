/**
 * An untouched targets-hit slider must not delete a base the game gives unconditionally.
 *
 * Phalanx Fighting is `EntsAffected kLeaguemate, kCaster` over a 12-foot sphere with
 * `maxTargets 3`: an unconditional `Replace` base of 0.5 beside a `target ≠ source` increment of
 * 0.3. The caster fills the first of those three seats for as long as the power is on, so N never
 * reaches zero — and reading the untouched slider as "no foes" deleted the 5% melee/ranged/AoE
 * defence the game hands out with no ally in sight (PERFOE-3, filed from a beta bug report).
 *
 * The engine is where the shipped number comes from and `coh_math::stacking` is graded there
 * (`per_target_floor.rs`, plus the two `Per-target floor` totals fixtures). This is the TS half:
 * the oracle's arithmetic, and the slider control that has to agree with it about where its axis
 * starts.
 */

import { describe, it, expect } from 'vitest';
import { adjustForStackCap, casterOccupiesATargetSlot } from './character-totals';
import { getStackingInfo } from '@/components/info/buildDisplayEffects';
import type { Power } from '@/types/power';

/** Phalanx Fighting's shape, as the converter emits it. */
const phalanx = {
  name: 'Phalanx Fighting',
  internalName: 'Phalanx_Fighting',
  powerType: 'Auto',
  targetType: 'Self',
  targetsAffected: ['Leaguemate', 'Self'],
  effectArea: 'AoE',
  stats: { maxTargets: 3 },
  effects: { defenseBuff: { melee: { scale: 0.5, table: 'Melee_Buff_Def', perTarget: 0.3 } } },
};

/** Invincibility's: a foe aura, whose caster is reached only through a target. */
const invincibility = {
  name: 'Invincibility',
  internalName: 'Invincibility',
  powerType: 'Toggle',
  targetType: 'Self',
  targetsAffected: ['Foe'],
  effectArea: 'AoE',
  stats: { maxTargets: 10 },
  effects: { defenseBuff: { melee: { scale: 0.6, table: 'Melee_Buff_Def', perTarget: 0.1 } } },
};

/** Reactive Regeneration's: `perTarget` from the `Execute_Power` redirect branch, counting how
 *  recently you were hit rather than seats in a sphere. No geometry at all. */
const reactiveRegeneration = {
  name: 'Reactive Regeneration',
  internalName: 'Instant_Regeneration',
  powerType: 'Toggle',
  targetType: 'Self',
  targetsAffected: ['Self'],
  effectArea: 'SingleTarget',
  stats: {},
  effects: { regenBuff: { scale: 0.25, table: 'Melee_Ones', perTarget: 0.25 } },
};

const defenseValue = { scale: 0.5, table: 'Melee_Buff_Def', perTarget: 0.3 };

describe('casterOccupiesATargetSlot', () => {
  it('needs both the recipient list and the AoE geometry', () => {
    expect(casterOccupiesATargetSlot(phalanx as never)).toBe(true);
    // The caster is not among the entities counted.
    expect(casterOccupiesATargetSlot(invincibility as never)).toBe(false);
    // The count is not an entity count, so there is no seat to hold.
    expect(casterOccupiesATargetSlot(reactiveRegeneration as never)).toBe(false);
    // An unbounded team-wide spread is not an axis, and neither is a missing list.
    expect(casterOccupiesATargetSlot({ ...phalanx, stats: { maxTargets: 255 } } as never)).toBe(false);
    expect(casterOccupiesATargetSlot({ ...phalanx, targetsAffected: undefined } as never)).toBe(false);
  });
});

describe('adjustForStackCap — the per-target floor', () => {
  it('reads an untouched slider as the solo value when the caster holds a seat', () => {
    for (const n of [undefined, 0, 1]) {
      expect(adjustForStackCap(defenseValue, n, undefined, phalanx as never)).toMatchObject({
        scale: 0.5,
      });
    }
  });

  it('still grows above the floor', () => {
    expect(adjustForStackCap(defenseValue, 2, undefined, phalanx as never)).toMatchObject({ scale: 0.8 });
    const three = adjustForStackCap(defenseValue, 3, undefined, phalanx as never) as { scale: number };
    expect(three.scale).toBeCloseTo(1.1, 12);
  });

  it('leaves a foe aura at zero, which is what nobody-in-radius means for it', () => {
    const foeValue = { scale: 0.6, table: 'Melee_Buff_Def', perTarget: 0.1 };
    expect(adjustForStackCap(foeValue, undefined, undefined, invincibility as never)).toMatchObject({ scale: 0 });
    expect(adjustForStackCap(foeValue, 0, undefined, invincibility as never)).toMatchObject({ scale: 0 });
    expect(adjustForStackCap(foeValue, 1, undefined, invincibility as never)).toMatchObject({ scale: 0.6 });
  });

  it('does not floor a stack depth — N there counts casts, not entities', () => {
    const stacking = { scale: 5, table: 'Melee_Ones' };
    expect(adjustForStackCap(stacking, 0, 2, phalanx as never)).toMatchObject({ scale: 0 });
  });
});

describe('getStackingInfo — where the slider starts', () => {
  it('starts the targets axis at one seat when the caster holds one', () => {
    expect(getStackingInfo(phalanx as unknown as Power)).toEqual({
      maxStacks: 3,
      minStacks: 1,
      label: 'Targets Hit',
    });
  });

  it('starts a foe aura at zero', () => {
    expect(getStackingInfo(invincibility as unknown as Power)).toEqual({
      maxStacks: 10,
      minStacks: 0,
      label: 'Targets Hit',
    });
  });

  it('starts a stack count at zero', () => {
    const buildUp = { effects: { maxStacks: 2 }, stats: {} };
    expect(getStackingInfo(buildUp as unknown as Power)).toMatchObject({ minStacks: 0, label: 'Stacks' });
  });
});
