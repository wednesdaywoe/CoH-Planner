/**
 * Plan B Slice 5 — regression guard for the atom-native max-HP appliers.
 *
 * `character-totals.ts` now sources +MaxHP from `maxHPBuffValue(power)` and its
 * IgnoreStrength twin from `maxHPBuffValue(power, {ignoreStrength:true})` (atoms)
 * instead of `effects.maxHPBuff` / `effects.maxHPBuffUnenhanced`. This asserts the
 * LIVE atom path returns the values the calc needs, on the real generated data, for
 * the shapes the migration had to get right:
 *   - the enhanceable + IgnoreStrength TWIN (High Pain Tolerance: 1 + 1, both halves
 *     co-apply and sum to +20% MaxHP — the split is the whole point of the slice),
 *   - a power carrying ONLY the IgnoreStrength half (Black Dwarf: 7.5 unenhanced, no
 *     enhanceable half — proves the twin filter isolates each side),
 *   - a twin sourced through a redirect / activation_effects, whose base `effects`
 *     is empty (Dull Pain: 2 + 2 — proves the atoms come from `allTemplates`, not
 *     just `powerJson.effects`).
 * Corpus-wide equality vs the bag is proven separately by
 * `scripts/planb-shadow-maxhp.cjs`; this pins the headline cases in CI.
 */
import { describe, it, expect } from 'vitest';
import { maxHPBuffValue } from '@/data/core/atom-query';
import { HighPainTolerance } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/willpower/high-pain-tolerance';
import { BlackDwarf } from '@/data/datasets/homecoming/generated/powersets/warshade/epic/umbral-aura/black-dwarf';
import { DullPain } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/invulnerability/dull-pain';

const enh = (p: Parameters<typeof maxHPBuffValue>[0]) => maxHPBuffValue(p);
const unenh = (p: Parameters<typeof maxHPBuffValue>[0]) => maxHPBuffValue(p, { ignoreStrength: true });

describe('atom-native MaxHP — High Pain Tolerance (enhanceable + IgnoreStrength twin)', () => {
  it('splits the two co-applying halves onto the ignoreStrength flag (1 + 1)', () => {
    const e = enh(HighPainTolerance)!;
    const u = unenh(HighPainTolerance)!;
    expect(e).toBeDefined();
    expect(u).toBeDefined();
    expect(e.scale).toBeCloseTo(1);
    expect(u.scale).toBeCloseTo(1);
    expect(e.table).toBe('Melee_HealSelf');
    // Both halves carry no per-target increment (MaxHP is never per-foe).
    expect(e.perTarget ?? 0).toBe(0);
    expect(u.perTarget ?? 0).toBe(0);
  });
  it('sums to +20% MaxHP at the calc formula (scale × 10, both halves)', () => {
    // The applier adds scale×10×(1+heal) for the enhanceable half and scale×10 for
    // the IgnoreStrength half. At no enhancement: 1×10 + 1×10 = +20.
    const total = enh(HighPainTolerance)!.scale * 10 + unenh(HighPainTolerance)!.scale * 10;
    expect(total).toBeCloseTo(20);
  });
});

describe('atom-native MaxHP — Black Dwarf (IgnoreStrength-only)', () => {
  it('returns the IgnoreStrength half (7.5) and no enhanceable half', () => {
    expect(enh(BlackDwarf)).toBeUndefined();
    expect(unenh(BlackDwarf)!.scale).toBeCloseTo(7.5);
  });
});

describe('atom-native MaxHP — Dull Pain (twin via redirect / activation_effects)', () => {
  it('reconstructs 2 + 2 from atoms even though the base effects bag is redirect-sourced', () => {
    expect(enh(DullPain)!.scale).toBeCloseTo(2);
    expect(unenh(DullPain)!.scale).toBeCloseTo(2);
  });
});
