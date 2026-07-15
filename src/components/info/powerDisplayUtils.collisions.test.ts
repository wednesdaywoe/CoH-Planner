/**
 * Regression guard — `internalName` is NOT globally unique.
 *
 * CoH identity is **powerset + name**. HC freely reuses an internal slot name
 * when it reworks a power, so every dataset ships ~23-28 REACHABLE collisions:
 * two different powers sharing one internal name that a SINGLE build can hold
 * at once. Examples (from the 2026-07-15 audit):
 *
 *   [dominator] Consume      = Consume (secondary)  vs Melt Armor (epic)
 *   [dominator] Fire_Blast   = Fire Blast (secondary) vs Rain of Fire (epic)
 *   [blaster]   Power_Boost  = Power Boost (secondary) vs Summon Spiderlings (epic)
 *   [controller] Invisibility = Superior Invisibility (primary) vs Infiltration (pool)
 *
 * WHAT THIS GATES, and what it deliberately does NOT:
 *
 * It does NOT assert "no collisions exist in the data". They DO exist, they are
 * CORRECT, and a future HC patch will add more — a test asserting their absence
 * would fail on good data and get muted, which is worse than no test.
 *
 * It asserts **no lookup resolves a power by bare name**: given a build holding
 * BOTH halves of a collision, each must resolve to its own slots. That is the
 * property that was broken (the display read the wrong power's slots while the
 * build data stayed correct — invisible unless you looked), and it is the
 * property that must survive every future collision the game introduces.
 */

import { describe, it, expect } from 'vitest';
import type { SelectedPower } from '@/types';
import { findSelectedPowerInBuild } from './powerDisplayUtils';

/** A build-shaped fixture holding both halves of a real collision. */
function selected(over: Partial<SelectedPower> & { internalName: string; powerSet: string }): SelectedPower {
  return {
    name: over.internalName, level: 1, slots: [], effects: {},
    ...over,
  } as unknown as SelectedPower;
}

function buildWith(opts: {
  primary?: SelectedPower[]; secondary?: SelectedPower[];
  pools?: SelectedPower[][]; epic?: SelectedPower[]; inherents?: SelectedPower[];
}) {
  return {
    primary: { powers: opts.primary ?? [] },
    secondary: { powers: opts.secondary ?? [] },
    pools: (opts.pools ?? []).map((powers) => ({ powers })),
    epicPool: opts.epic ? { powers: opts.epic } : null,
    inherents: opts.inherents ?? [],
  };
}

describe('findSelectedPowerInBuild — collision safety', () => {
  it('resolves the EPIC half of a secondary/epic collision, not the secondary', () => {
    // Dominator: secondary Fire Blast and epic Rain of Fire are BOTH `Fire_Blast`.
    // Bare-name search hits secondary first and returns its (wrong) slots.
    const secondaryFireBlast = selected({
      internalName: 'Fire_Blast', powerSet: 'fire_assault', name: 'Fire Blast',
      slots: [null, null],
    });
    const epicRainOfFire = selected({
      internalName: 'Fire_Blast', powerSet: 'fire_mastery_dominator', name: 'Rain of Fire',
      slots: [null, null, null, null, null, null],
    });
    const build = buildWith({ secondary: [secondaryFireBlast], epic: [epicRainOfFire] });

    const epic = findSelectedPowerInBuild('Fire_Blast', 'fire_mastery_dominator', build);
    expect(epic?.name).toBe('Rain of Fire');
    expect(epic?.slots).toHaveLength(6);

    const secondary = findSelectedPowerInBuild('Fire_Blast', 'fire_assault', build);
    expect(secondary?.name).toBe('Fire Blast');
    expect(secondary?.slots).toHaveLength(2);
  });

  it('resolves a primary/secondary collision to the right side', () => {
    // [dominator] Electric_Fence = Electric Fence (primary) vs Charged Bolts (secondary).
    const build = buildWith({
      primary: [selected({ internalName: 'Electric_Fence', powerSet: 'electric_control', name: 'Electric Fence', slots: [null] })],
      secondary: [selected({ internalName: 'Electric_Fence', powerSet: 'electricity_assault', name: 'Charged Bolts', slots: [null, null, null] })],
    });
    expect(findSelectedPowerInBuild('Electric_Fence', 'electric_control', build)?.name).toBe('Electric Fence');
    expect(findSelectedPowerInBuild('Electric_Fence', 'electricity_assault', build)?.name).toBe('Charged Bolts');
  });

  it('resolves a primary/pool collision to the right side', () => {
    // [controller] Invisibility = Superior Invisibility (primary) vs Infiltration (pool).
    const build = buildWith({
      primary: [selected({ internalName: 'Invisibility', powerSet: 'illusion_control', name: 'Superior Invisibility', slots: [null, null] })],
      pools: [[selected({ internalName: 'Invisibility', powerSet: 'concealment', name: 'Infiltration', slots: [null] })]],
    });
    expect(findSelectedPowerInBuild('Invisibility', 'illusion_control', build)?.name).toBe('Superior Invisibility');
    expect(findSelectedPowerInBuild('Invisibility', 'concealment', build)?.name).toBe('Infiltration');
  });

  it('returns null when the name matches but the powerset does not', () => {
    // The failure mode a bare-name search cannot have: it would happily return
    // the other powerset's power. Correct behaviour is "not in this build".
    const build = buildWith({
      secondary: [selected({ internalName: 'Consume', powerSet: 'fiery_assault', name: 'Consume', slots: [null] })],
    });
    expect(findSelectedPowerInBuild('Consume', 'mu_mastery', build)).toBeNull();
  });

  it('still resolves a non-colliding power normally', () => {
    const build = buildWith({
      inherents: [selected({ internalName: 'Sprint', powerSet: 'Inherent', name: 'Sprint', slots: [null] })],
    });
    expect(findSelectedPowerInBuild('Sprint', 'Inherent', build)?.name).toBe('Sprint');
  });
});
