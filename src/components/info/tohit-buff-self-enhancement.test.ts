import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';
import { createEmptyBuild } from '@/types/build';
import { createDefaultIncarnateActiveState } from '@/types/incarnate';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { EFFECT_REGISTRY } from '@/data/core/effect-registry';
import { calcThreeTier, convertGlobalBonusesToAspects, withStrengthBonuses } from './powerDisplayUtils';

/**
 * A +ToHit buff must not be enhanced by the character's ToHit TOTAL (reported 2026-07-31).
 *
 * Rage's power-effects pane showed its own +ToHit row scaled by its own +ToHit, and nothing
 * outside that pane agreed — the dashboard total was right. The display layer mapped the
 * `tohit` aspect onto `globalBonuses.toHit`, which is the sum of every running +ToHit buff
 * (Rage, Tactics, Kismet, set bonuses…) and therefore includes the very row being rendered.
 * Fed into `calcThreeTier` as a strength multiplier, every ToHit buff enhanced itself, and
 * two stacks compounded it: 40% became 40 × 1.40.
 *
 * What actually scales a ToHit buff is slotted ToHit enhancement plus ToHit STRENGTH (the
 * Power Boost family) — `1 + enhBonuses.tohit + strengthBuffs.toHit`, which is what the
 * dashboard accumulator has always used. The display now reads the same two terms.
 */
describe('+ToHit buff does not enhance itself', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  /** Tanker / Super Strength with Rage active — `stacks` drives the stack slider. */
  function rageBuild() {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null } as any;
    const powerset = getPowerset('tanker/super-strength');
    const rage = powerset?.powers.find((p) => p.internalName === 'Rage');
    expect(rage, 'Rage is in tanker/super-strength').toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.secondary = {
      id: 'tanker/super-strength',
      name: 'Super Strength',
      powers: [{ ...rage, powerSet: 'tanker/super-strength', level: 28, isActive: true, slots: [] }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    return b;
  }

  const totalsAt = (stacks: number) =>
    calculateCharacterTotals(rageBuild(), false, createDefaultIncarnateActiveState(), {
      targetsHitValues: { Rage: stacks },
    }).globalBonuses;

  it('the tohitBuff row is still enhanceable — the fix is WHICH global it reads', () => {
    expect(EFFECT_REGISTRY.tohitBuff.enhancementAspect).toBe('tohit');
  });

  it('the character ToHit total never reaches the display globals', () => {
    const globals = totalsAt(1);
    expect(globals.toHit, 'Rage is contributing ToHit to the totals').toBeGreaterThan(0);

    const aspects = withStrengthBonuses(convertGlobalBonusesToAspects(globals), globals);
    // No Power Boost in this build, so the tohit aspect has nothing to carry. Before the
    // fix it carried globals.toHit / 100 — the row's own output.
    expect(aspects.tohit ?? 0).toBe(0);

    const row = calcThreeTier('tohit', globals.toHit, {}, aspects);
    expect(row.final).toBeCloseTo(globals.toHit, 6);
  });

  it('a second stack does not compound — two stacks is exactly twice one', () => {
    const one = totalsAt(1);
    const two = totalsAt(2);
    // The self-enhancement was quadratic in the stack count: 2 stacks read
    // 2×base × (1 + 2×base), not 2×base.
    expect(two.toHit).toBeCloseTo(one.toHit * 2, 6);

    const rowTwo = calcThreeTier(
      'tohit',
      two.toHit,
      {},
      withStrengthBonuses(convertGlobalBonusesToAspects(two), two),
    );
    expect(rowTwo.final).toBeCloseTo(one.toHit * 2, 6);
  });

  it('ToHit Strength (Power Boost) still scales the row', () => {
    const globals = totalsAt(1);
    // The channel the fix routes through, exercised directly: strengthToHit is a fraction.
    const boosted = withStrengthBonuses(convertGlobalBonusesToAspects(globals), {
      ...globals,
      strengthToHit: 0.6,
    });
    expect(boosted.tohit).toBeCloseTo(0.6, 6);
    expect(calcThreeTier('tohit', 20, {}, boosted).final).toBeCloseTo(32, 6);
  });
});
