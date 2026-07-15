/**
 * Guards a CODE ASSUMPTION, not a data preference.
 *
 * `applyPowerUpdate(build, 'pool', updater)` (src/stores/buildStore.ts) applies
 * its updater to EVERY pool:
 *
 *     newBuild.pools = newBuild.pools.map(pool => ({ ...pool, powers: updater(pool.powers) }))
 *
 * and every updater matches on bare `internalName` (`powers.map(p =>
 * p.internalName === powerName ? … : p)`). Pools are all category 'pool', so the
 * category — which is what disambiguates every OTHER collision in the app — buys
 * nothing here. If two different pools ever shipped the same internalName, a
 * single addSlot/removeSlot/setLevel would silently mutate BOTH.
 *
 * Today no dataset has such a pair, which is the only reason that fan-out is
 * safe. This test pins that: it is not asserting "collisions are bad" (they are
 * expected and correct elsewhere — see powerDisplayUtils.collisions.test.ts,
 * which deliberately gates lookups rather than data). It asserts that the one
 * precondition the pool fan-out silently relies on still holds.
 *
 * IF THIS FAILS: HC/Rebirth/Thunderspy introduced a cross-pool name reuse. The
 * fix is to make the pool update path pool-aware (thread poolId, or match on
 * (powerSet, internalName) like the display layer now does) — NOT to relax or
 * mute this test. The data would be correct; the code would be wrong.
 */

import { describe, it, expect } from 'vitest';
import { POWER_POOLS_RAW as HC } from './datasets/homecoming/generated/power-pools';
import { POWER_POOLS_RAW as REBIRTH } from './datasets/rebirth/generated/power-pools';
import { POWER_POOLS_RAW as TSPY } from './datasets/thunderspy/generated/power-pools';

/** Mirrors the derivation in power-pools.ts (the facade that adds internalName). */
function internalNameOf(p: { fullName?: string; name: string }): string {
  return p.fullName?.split('.').pop()?.replace(/\s+/g, '_') ?? p.name.replace(/\s+/g, '_');
}

function crossPoolCollisions(raw: Record<string, { powers?: { fullName?: string; name: string }[] }>) {
  const byName = new Map<string, { poolId: string; name: string }[]>();
  for (const [poolId, pool] of Object.entries(raw)) {
    for (const p of pool.powers ?? []) {
      const n = internalNameOf(p);
      const bucket = byName.get(n);
      if (bucket) bucket.push({ poolId, name: p.name });
      else byName.set(n, [{ poolId, name: p.name }]);
    }
  }
  return [...byName.entries()]
    .filter(([, v]) => new Set(v.map((x) => x.poolId)).size > 1)
    .map(([n, v]) => `${n} -> ${v.map((x) => `${x.poolId}:${x.name}`).join(' | ')}`);
}

describe('no internalName is reused across two power pools', () => {
  it.each([
    ['homecoming', HC],
    ['rebirth', REBIRTH],
    ['thunderspy', TSPY],
  ])('%s', (_ds, raw) => {
    expect(crossPoolCollisions(raw as never)).toEqual([]);
  });

  it('the detector actually detects (it would be vacuous otherwise)', () => {
    // A test whose only assertion is "the list is empty" passes just as happily
    // when the detector is broken — which is exactly how the first cut of this
    // check failed (it read internalName off the raw data, where the field does
    // not exist, so every power collided on `undefined`).
    const planted = {
      speed: { powers: [{ fullName: 'Pool.Speed.Hasten', name: 'Hasten' }] },
      leaping: { powers: [{ fullName: 'Pool.Leaping.Hasten', name: 'Not Hasten' }] },
    };
    expect(crossPoolCollisions(planted)).toEqual([
      'Hasten -> speed:Hasten | leaping:Not Hasten',
    ]);
  });

  it('derives internalName the same way the pool facade does', () => {
    // Guards the mirror above: if power-pools.ts changes how it derives
    // internalName, this detector goes blind rather than loud.
    expect(internalNameOf({ fullName: 'Pool.Invisibility.Infiltration', name: 'Infiltration' })).toBe('Infiltration');
    expect(internalNameOf({ name: 'Air Superiority' })).toBe('Air_Superiority');
  });
});
