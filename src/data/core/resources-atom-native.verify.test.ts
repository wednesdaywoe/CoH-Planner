/**
 * Plan B Slice 6 — regression guard for the atom-native regen/recovery appliers.
 *
 * `legacy-totals.oracle.ts` now sources +Regeneration/+Recovery and their two
 * `*Unenhanced` twins from `regenBuffValue` / `recoveryBuffValue` (atoms) instead of
 * `effects.regenBuff` / `effects.regenBuffUnenhanced` / `effects.recoveryBuff` /
 * `effects.recoveryBuffUnenhanced` — the LAST two of the five parallel slots the bag
 * minted for the single `ignoreStrength` axis. This asserts the LIVE atom path returns
 * the values the calc needs, on the real generated data, for the shapes the migration
 * had to get right:
 *
 *   - the **per-foe increment through a REDIRECT** (Consume Psyche): its RefreshToCount
 *     ×10 +Regen/+Recovery lives entirely in `Redirects.Psionic_Armor.*`, so the
 *     converter's `_perTargetIncrement` stamp landed on redirect template objects that
 *     never reach `allTemplates`. Slice 6 extends the emit-site reconciliation to replay
 *     the AoE-path signatures; without that fix these read as flat buffs with no
 *     `perTarget`.
 *   - the **IgnoreStrength self-increment discriminator** (Reactive Regeneration): its
 *     increment is an IgnoreStrength pseudo-pet buff, so it must NOT be counted at one
 *     target (2, not 2.25) and must NOT mint a phantom `regenBuffUnenhanced` — the
 *     `!ignoreStrength` test in the N=1 sum is the only thing separating it from Consume
 *     Psyche's non-IgnoreStrength increment, which IS counted.
 *   - the **clean enhanceable + IgnoreStrength twin** (Metabolic Acceleration: 1.125 +
 *     1.125), the shape the parallel slots existed for.
 *   - the **Thunderspy target-trap** (Equip Thugs): a pet-equip power whose `_Ones`
 *     +Recovery buffs the HENCHMEN, not the Mastermind. The bag deletes the slot; the
 *     atom must be excluded via the converter's `notOnCaster` stamp, or the caster gains
 *     a phantom +Recovery the moment the applier stops reading the bag.
 *   - the **deliberate PUNT** (Icy Bastion): its StackByAttribAndKey burst/tail is the
 *     one family whose bag value is a suspected latent bug (regen drops the lingering →
 *     +6, recovery sums it → +4, from the same two-template shape). The helper returns
 *     `undefined` so the applier keeps the unchanged bag rather than baking either
 *     number onto the wire — pending in-game/Mids verification. This pins the punt so a
 *     later change can't silently start auto-matching it.
 *
 * Corpus-wide equality vs the bag is proven separately by
 * `scripts/planb-shadow-resources.cjs`; this pins the headline cases in CI.
 */
import { describe, it, expect } from 'vitest';
import { regenBuffValue, recoveryBuffValue } from '@/data/core/atom-query';
import { ConsumePsyche } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/psionic-armor/consume-psyche';
import { InstantRegeneration } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/regeneration/instant-regeneration';
import { MetabolicAcceleration } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/atomic-manipulation/metabolic-acceleration';
import { IcyBastion } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/ice-armor/icy-bastion';
import { EquipThugs } from '@/data/datasets/thunderspy/generated/powersets/mastermind/primary/thugs/equip-thugs';

const unenh = { ignoreStrength: true } as const;

describe('atom-native resources — Consume Psyche (per-foe increment through a redirect)', () => {
  it('recovers the +Regen per-target increment the redirect stamp-gap used to lose', () => {
    const r = regenBuffValue(ConsumePsyche)!;
    expect(r).toBeDefined();
    expect(r.scale).toBeCloseTo(0.85);
    expect(r.perTarget).toBeCloseTo(0.35);
    expect(r.table).toBe('Melee_Ones');
  });
  it('recovers the +Recovery per-target increment likewise', () => {
    const r = recoveryBuffValue(ConsumePsyche)!;
    expect(r.scale).toBeCloseTo(0.15);
    expect(r.perTarget).toBeCloseTo(0.05);
  });
  it('routes the increment to the enhanceable half, never the Unenhanced twin', () => {
    expect(regenBuffValue(ConsumePsyche, unenh)).toBeUndefined();
    expect(recoveryBuffValue(ConsumePsyche, unenh)).toBeUndefined();
  });
  it('scales per foe at the calc formula (scale + perTarget × (N−1))', () => {
    const r = regenBuffValue(ConsumePsyche)!;
    // 10 foes (RefreshToCount ×10): 0.85 + 0.35 × 9 = 4.0
    expect(r.scale + (r.perTarget ?? 0) * 9).toBeCloseTo(4.0);
  });
});

describe('atom-native resources — Reactive Regeneration (IgnoreStrength increment)', () => {
  it('does NOT count its IgnoreStrength self-increment at one target (2, not 2.25)', () => {
    const r = regenBuffValue(InstantRegeneration)!;
    expect(r).toBeDefined();
    expect(r.scale).toBeCloseTo(2);
    expect(r.perTarget).toBeCloseTo(0.25);
  });
  it('does not mint a phantom regenBuffUnenhanced from that increment', () => {
    expect(regenBuffValue(InstantRegeneration, unenh)).toBeUndefined();
  });
});

describe('atom-native resources — Metabolic Acceleration (the enhanceable/IgnoreStrength twin)', () => {
  it('splits the two co-applying regen halves on the ignoreStrength flag (1.125 + 1.125)', () => {
    const e = regenBuffValue(MetabolicAcceleration)!;
    const u = regenBuffValue(MetabolicAcceleration, unenh)!;
    expect(e.scale).toBeCloseTo(1.125);
    expect(u.scale).toBeCloseTo(1.125);
    expect(e.table).toBe('Melee_Ones');
  });
  it('keeps recovery single-sided (enhanceable only) on the same power', () => {
    expect(recoveryBuffValue(MetabolicAcceleration)!.scale).toBeCloseTo(0.5);
    expect(recoveryBuffValue(MetabolicAcceleration, unenh)).toBeUndefined();
  });
});

describe('atom-native resources — Equip Thugs (the Thunderspy target-trap)', () => {
  it('excludes the pet-directed _Ones buffs from the CASTER via the notOnCaster stamp', () => {
    // The bag DELETES these slots (guardThunderspyOnesBuffs); the atom path must agree,
    // or the Mastermind silently gains its henchmen's +Recovery.
    expect(EquipThugs.effects?.recoveryBuff).toBeUndefined();
    expect(recoveryBuffValue(EquipThugs)).toBeUndefined();
    expect(regenBuffValue(EquipThugs)).toBeUndefined();
  });
});

describe('atom-native resources — Icy Bastion (the StackByAttribAndKey burst/tail)', () => {
  // A temp toggle (activate_period 0.5): its own effects carry the larger +6 regen /
  // +2 recovery at 0.75s — re-applied every tick, so alive only while the toggle is up —
  // while an OnActivate Execute_Power applies the +4 / +2 @30s lingering half that survives
  // an early detoggle. Both are active for the 30s the power is doing its job, so the
  // value is their SUM. Confirmed in-game and by the power's own display_help.
  it('sums the toggle-gated burst and the 30s lingering half (+10 regen)', () => {
    const r = regenBuffValue(IcyBastion)!;
    expect(r).toBeDefined();
    expect(r.scale).toBeCloseTo(10); // 6 (toggle-refreshed) + 4 (lingering)
    expect(r.table).toBe('Melee_Ones');
  });
  it('sums recovery the same way (+4), the half that was always right', () => {
    expect(recoveryBuffValue(IcyBastion)!.scale).toBeCloseTo(4); // 2 + 2
  });
  it('reconstructs rather than punting — the bag now agrees on both halves', () => {
    // Regression pin for the converter fix: the regen routing used to skip
    // `StackByAttribAndKey` outright, dropping the lingering +4 and reporting +6 while
    // recovery (no such skip) summed to +4. Reading the flag as "ignore me" rather than
    // "refresh, don't stack" was the bug; regen and recovery must never diverge again.
    expect((IcyBastion.effects?.regenBuff as { scale: number }).scale).toBeCloseTo(10);
    expect((IcyBastion.effects?.recoveryBuff as { scale: number }).scale).toBeCloseTo(4);
  });
});
