import { describe, it, expect } from 'vitest';
import { applyQuickSnipe } from '@/utils/quick-snipe';
import { RangedShot } from './datasets/homecoming/generated/powersets/blaster/primary/archery/ranged-shot';
import { RangedShot as RebirthRangedShot } from './datasets/rebirth/generated/powersets/blaster/primary/archery/ranged-shot';
import { LightningClap } from './datasets/homecoming/generated/powersets/dominator/secondary/electricity-assault/lightning-clap';

/**
 * Snipe base timing comes from the Normal (not-in-combat) redirect variant, not
 * the redirect shell — see extractSnipeBaseTiming in convert-powerset.cjs. The
 * shell's activation_time mirrors the fast (Quick) anim, so reading it made the
 * slotted snipe look instant even when slow. These load real snipes from the
 * committed dataset and lock in the fix against a future regen reverting it.
 */
describe('snipe base timing (Normal-variant cast, not the redirect shell)', () => {
  it('Ranged Shot: slow base cast 3.67s + 2s interrupt; fast form on quickSnipe', () => {
    expect(RangedShot.stats?.castTime).toBe(3.67); // NOT the shell's 1.67
    expect(RangedShot.stats?.interruptTime).toBe(2);
    expect(RangedShot.quickSnipe?.stats.castTime).toBe(1.67); // in-combat fast form

    // The fast form must not inherit the base's interrupt window.
    const fast = applyQuickSnipe(RangedShot, true);
    expect(fast.stats?.castTime).toBe(1.67);
    expect(fast.stats?.interruptTime).toBeUndefined();
  });

  it('detects snipes by the redirect pattern, not the (recycled) internal name', () => {
    // internalName "lightning_clap" is the Electricity Assault snipe "Zapp" —
    // recycled name; classified as a snipe via its Experienced-Marksman gate.
    expect(LightningClap.name).toBe('Zapp');
    expect(LightningClap.stats?.castTime).toBe(3.33);
    expect(LightningClap.stats?.interruptTime).toBe(2);
    expect(LightningClap.quickSnipe).toBeTruthy();
  });

  it('Rebirth snipe is single-form (no redirect) — slow cast + interrupt baked on the base', () => {
    // Rebirth bakes the slow timing onto the base power (no Quick/Normal
    // redirect), so castTime is already the full slow cast and interruptTime
    // is captured by the base stats builder — kept consistent with HC snipes.
    expect(RebirthRangedShot.stats?.castTime).toBe(4.67);
    expect(RebirthRangedShot.stats?.interruptTime).toBe(3);
    expect(RebirthRangedShot.quickSnipe).toBeUndefined();
  });
});
