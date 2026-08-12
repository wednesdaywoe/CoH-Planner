import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllPowerPools, getExcludedPools, POOL_EXCLUSION_GROUPS } from '@/data/power-pools';

/**
 * The game allows one Specialized power pool per build, and says so itself: each of these
 * five powersets carries a `SetBuyRequires` naming the other four's powers, failing with
 * "You can only have one Specialized power pool in your build." All three forks gate the
 * same five.
 *
 * `POOL_EXCLUSION_GROUPS` restates that by hand because the converter does not emit
 * `buyRequires` yet, so nothing downstream can notice the table drifting from the export.
 * These tests are the stand-in. Retire them with the hardcode when `getExcludedPools` reads
 * the exported gate.
 *
 * The group names all five REGARDLESS OF DORMANCY. Gadgetry and Utility Belt are dormant on
 * Homecoming (dev-only `accesslevel` gate) and Utility Belt on Rebirth, so the live registry
 * drops them and no Homecoming build can reach them today. That is a release state, not the
 * rule — the rule is on the powerset record either way, and a pool that goes live later must
 * arrive already excluded rather than needing this table edited again. So the per-fork test
 * below asserts the property that survives a release (every LIVE specialized pool excludes
 * every other LIVE one) and deliberately does not pin which pools are dormant.
 */

const SPECIALIZED = ['experimentation', 'force_of_will', 'gadgetry', 'sorcery', 'utility_belt'];

const FORKS = ['homecoming', 'rebirth', 'thunderspy'] as const;

describe('the Specialized pools are mutually exclusive', () => {
  it('names exactly the five pools the export gates', () => {
    expect(POOL_EXCLUSION_GROUPS).toHaveLength(1);
    expect([...POOL_EXCLUSION_GROUPS[0]].sort()).toEqual([...SPECIALIZED].sort());
  });

  it('excludes every other member from each member', () => {
    for (const pool of SPECIALIZED) {
      const excluded = getExcludedPools(pool);
      expect(excluded, `${pool} is in no exclusion group`).not.toBeNull();
      expect([...excluded!].sort()).toEqual(SPECIALIZED.filter((p) => p !== pool).sort());
    }
  });

  it('leaves an ordinary pool unrestricted', () => {
    expect(getExcludedPools('fighting')).toBeNull();
    expect(getExcludedPools('leaping')).toBeNull();
  });
});

describe.each(FORKS)('%s blocks a second Specialized pool', (fork) => {
  beforeAll(async () => {
    await loadDataset(fork);
  }, 60_000);

  it('has at least two live Specialized pools, so the rule is reachable here', () => {
    const shipped = new Set(Object.keys(getAllPowerPools()));
    const live = SPECIALIZED.filter((p) => shipped.has(p));
    // Below two there is nothing to exclude and this fork would grade nothing.
    expect(live.length).toBeGreaterThanOrEqual(2);
  });

  it('excludes every other live Specialized pool from each one', () => {
    const shipped = new Set(Object.keys(getAllPowerPools()));
    const live = SPECIALIZED.filter((p) => shipped.has(p));
    for (const pool of live) {
      const excluded = new Set(getExcludedPools(pool) ?? []);
      const unblocked = live.filter((other) => other !== pool && !excluded.has(other));
      expect(unblocked, `${fork}: ${pool} does not block ${unblocked.join(', ')}`).toEqual([]);
    }
  });
});
