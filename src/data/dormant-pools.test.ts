import { describe, it, expect } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerPool } from '@/data';

/**
 * Per-server availability of the two pre-shutdown pools, Gadgetry and Utility
 * Belt. Ground truth (server devs, 2026-07-08): Homecoming has NEITHER, Rebirth
 * has Gadgetry only, Thunderspy has BOTH.
 *
 * Gadgetry is fully derived from the bins: a server that hasn't released a pool
 * locks its powers behind a dev-only `accesslevel > 0` gate, which `deriveDormant`
 * flags and the app hides. HC gates it (hidden); Rebirth/Thunderspy stripped the
 * gate on release (shown).
 *
 * Utility Belt is the same on HC (gated → hidden) and Thunderspy (ungated →
 * shown), but Rebirth is the exception: it's still working on the set and has
 * stripped the per-power gate, yet the pool is NOT live — and nothing in the
 * client bins encodes that (Rebirth's not-live UB is byte-identical to its live
 * Gadgetry at every gate). So Rebirth UB is hidden via an explicit server-side
 * override (POOL_DORMANCY_OVERRIDES in scripts/convert-pool-powers.cjs), not
 * derivation.
 */
describe('per-server pool availability (Gadgetry / Utility Belt)', () => {
  it('Homecoming has neither', async () => {
    await loadDataset('homecoming');
    expect(getPowerPool('gadgetry')).toBeUndefined();
    expect(getPowerPool('utility_belt')).toBeUndefined();
    expect(getPowerPool('fighting')).toBeDefined(); // standard pool unaffected
  });

  it('Rebirth has Gadgetry but not Utility Belt (UB held by server-side override)', async () => {
    await loadDataset('rebirth');
    expect(getPowerPool('gadgetry')).toBeDefined();
    expect(getPowerPool('utility_belt')).toBeUndefined();
  });

  it('Thunderspy has both', async () => {
    await loadDataset('thunderspy');
    expect(getPowerPool('gadgetry')).toBeDefined();
    expect(getPowerPool('utility_belt')).toBeDefined();
  });
});
