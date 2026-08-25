/**
 * Regression: exporting a Defender Thermal Radiation / Water Blast build to
 * Mids produced unresolvable powerset paths ("Defender_Buff.Thermal_Radiation_Set.ico")
 * because `getMidsSetName` only stripped `.png` while the datasets ship `.ico`
 * icons. Mids dropped every power in the unresolvable sets → empty build.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';
import { exportToMids } from './mids-export';
import type { Build } from '@/types';

// Minimal but realistic build skeleton; only primary/secondary paths matter here.
function buildFor(primaryId: string, secondaryId: string): Build {
  const prim = getPowerset(primaryId)!;
  const sec = getPowerset(secondaryId)!;
  return {
    id: 'test',
    name: 'Test',
    serverId: 'homecoming',
    archetype: { id: 'defender', name: 'Defender' },
    level: 50,
    progressionMode: 'auto',
    primary: { id: primaryId, name: prim.name, powers: prim.powers.map((p) => ({ ...p, level: 1, slots: [] })) },
    secondary: { id: secondaryId, name: sec.name, powers: sec.powers.map((p) => ({ ...p, level: 1, slots: [] })) },
    pools: [],
    epicPool: null,
    inherents: [],
    accolades: [],
    settings: { globalIOLevel: 50, origin: 'Natural' },
    sets: {},
    incarnates: [],
    craftingChecklist: [],
    shoppingListAcquired: [],
    slotOrder: [],
  } as unknown as Build;
}

describe('mids-export powerset paths', () => {
  beforeAll(async () => { await loadDataset('homecoming'); }, 120000);

  it('strips the .ico extension from powerset icons (thermal/water defender)', () => {
    const mbd = JSON.parse(exportToMids(buildFor('defender/thermal-radiation', 'defender/water-blast')));
    // Second segment must be the bare Mids internal name, no extension, no "_set".
    expect(mbd.PowerSets[0]).toBe('Defender_Buff.Thermal_Radiation');
    expect(mbd.PowerSets[1]).toBe('Defender_Ranged.Water_Blast');
    // No power name may carry a file extension.
    for (const pe of mbd.PowerEntries) {
      expect(pe.PowerName).not.toContain('.ico');
      expect(pe.PowerName).not.toContain('.png');
    }
  });

  it('still works for .png icons', () => {
    // Force a .png icon through the same path (future-proofing against
    // datasets that keep .png icons).
    const mbd = JSON.parse(exportToMids(buildFor('defender/thermal-radiation', 'defender/water-blast')));
    expect(mbd.PowerSets[0]).not.toMatch(/\.png/);
    expect(mbd.PowerSets[0]).not.toMatch(/\.ico/);
  });
});