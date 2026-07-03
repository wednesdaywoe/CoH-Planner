import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { importMidsBuild } from '@/utils/mids-import';

/**
 * Regression coverage for the duplicate-power-pool loophole.
 *
 * A Mids `.mbd` whose `PowerSets` array lists the same pool twice used to slip
 * straight through: the step-7 loop pushed the pool id into `poolIds` with no
 * dedup guard (unlike the guarded PowerEntries stage), and the final
 * `poolIds.map(...)` then emitted two identical PoolSelection objects sharing
 * one `poolPowersMap[id]` array — a byte-for-byte duplicate pool that consumed a
 * pool slot. This is the exact origin of the "two Flight pools" build.
 *
 * The importer must now yield exactly one entry per pool id regardless of how
 * many times the source names it.
 */

/** Build one Mids PowerEntry. */
function mp(PowerName: string, Level: number, StatInclude = false) {
  return { PowerName, Level, StatInclude, SlotEntries: [] };
}

beforeAll(async () => {
  await loadDataset('homecoming');
});

describe('Mids .mbd import — duplicate pool guard', () => {
  // Controller build whose PowerSets array names Pool.Flight TWICE (indices 2
  // and 4, straddling Pool.Speed) — the shape that produced the artifact.
  const mbd = JSON.stringify({
    BuiltWith: { App: 'Mids Reborn', Version: '3.8.1.0', Database: 'Homecoming' },
    Level: '49',
    Class: 'Class_Controller',
    Origin: 'Natural',
    Name: 'Dup Flight',
    PowerSets: [
      'Controller_Control.Illusion_Control',
      'Controller_Buff.Radiation_Emission',
      'Pool.Flight',
      'Pool.Speed',
      'Pool.Flight',
    ],
    PowerEntries: [
      mp('Pool.Flight.Fly', 10),
      mp('Pool.Flight.Combat_Flight', 20, true),
      mp('Pool.Speed.Hasten', 4, true),
    ],
  });

  let result: ReturnType<typeof importMidsBuild>;
  beforeAll(() => {
    result = importMidsBuild(mbd);
  });

  it('imports successfully', () => {
    expect(result.success).toBe(true);
    expect(result.build).not.toBeNull();
  });

  it('produces exactly ONE Flight pool despite the doubled PowerSets entry', () => {
    const flight = result.build!.pools.filter((p) => p.id === 'flight');
    expect(flight).toHaveLength(1);
  });

  it('never emits any duplicate pool id', () => {
    const ids = result.build!.pools.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps the Flight pool powers on the single surviving entry', () => {
    const flight = result.build!.pools.find((p) => p.id === 'flight')!;
    const names = flight.powers.map((p) => p.internalName);
    expect(names).toContain('Fly');
    expect(names).toContain('Combat_Flight');
  });
});
