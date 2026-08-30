import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { importMidsBuild } from '@/utils/mids-import';
import { countBudgetPowerPicks } from '@/utils/build-budget';

/**
 * The import dialog's "Powers: N" and the dashboard's `Pwr N/24` are the same claim, and
 * they used to be two different numbers: the summary tallied its own count as it resolved
 * entries and reported 31 for a build the dashboard then showed as 23 of 24 picks. It was
 * counting inherent slot-data entries, accolades and incarnate slots as powers, and
 * entries that resolved but were dropped as duplicates.
 *
 * The count now comes from the finished build. What is guarded here is that it keeps
 * coming from there — an assertion on a literal 3 would stay green if someone reinstated
 * the tally and it happened to agree on this fixture.
 */

beforeAll(async () => {
  await loadDataset('homecoming');
});

const ACCOLADES = ['The_Atlas_Medallion', 'Portal_Jockey'];

/** A build carrying every kind of entry that is NOT a power pick. */
function mbd(): string {
  return JSON.stringify({
    BuiltWith: { App: 'Mids Reborn', Version: '3.7.5.21', Database: 'Homecoming' },
    Level: '49',
    Class: 'Class_Blaster',
    Origin: 'Technology',
    Name: 'summary counts',
    PowerSets: ['Blaster_Ranged.Assault_Rifle', 'Blaster_Support.Electricity_Manipulation'],
    PowerEntries: [
      { PowerName: 'Blaster_Ranged.Assault_Rifle.Burst', Level: 1 },
      { PowerName: 'Blaster_Support.Electricity_Manipulation.Charged_Brawl', Level: 1 },
      // Two spellings of one power: the second resolves, collides, and is dropped. The
      // old tally counted it, which is the "increments before it lands" half.
      { PowerName: 'Blaster_Support.Electricity_Manipulation.Havok_Punch', Level: 10 },
      { PowerName: 'Blaster_Support.Electricity_Manipulation.Havoc_Punch', Level: 10 },
      // Neither of these consumes a power pick.
      ...ACCOLADES.map((name) => ({ PowerName: `Temporary_Powers.Accolades.${name}`, Level: 50 })),
      { PowerName: 'Incarnate.Alpha.Musculature_Radial_Paragon', Level: 50 },
      // Inherents arrive as entries too, carrying slot data rather than a pick.
      { PowerName: 'Inherent.Inherent.Health', Level: 1 },
      { PowerName: 'Inherent.Inherent.Stamina', Level: 1 },
    ].map((e) => ({ ...e, StatInclude: true, SlotEntries: [] })),
  });
}

describe('Mids .mbd import — summary counts', () => {
  it('reports the picks the build actually holds, not the entries it resolved', () => {
    const result = importMidsBuild(mbd());
    expect(result.build).toBeTruthy();

    // The load-bearing assertion: the dialog's number IS the dashboard's number.
    expect(result.summary.powersImported).toBe(countBudgetPowerPicks(result.build!));

    // And that number is the three distinct powers — not the four power-ish entries, and
    // not the nine entries the file carries.
    expect(result.summary.powersImported).toBe(3);
  });

  it('counts accolades and incarnates apart from powers', () => {
    const result = importMidsBuild(mbd());

    expect(result.summary.accoladesImported).toBe(ACCOLADES.length);
    expect(result.summary.incarnatesImported).toBe(1);
    // Stated against the build, so a counter that drifted from what landed reds here.
    expect(result.build?.accolades).toHaveLength(ACCOLADES.length);
    expect(result.build?.incarnates.alpha).toBeTruthy();
  });

  it('does not count an accolade the user excluded from their Mids totals', () => {
    // Stated against the included case above, which lands: a bare `toBe(0)` would pass
    // for an importer that counted no accolade at all.
    const excluded = importMidsBuild(JSON.stringify({
      BuiltWith: { App: 'Mids Reborn', Version: '3.7.5.21', Database: 'Homecoming' },
      Level: '49', Class: 'Class_Blaster', Origin: 'Technology', Name: 'excluded',
      PowerSets: ['Blaster_Ranged.Assault_Rifle', 'Blaster_Support.Electricity_Manipulation'],
      PowerEntries: [
        { PowerName: 'Blaster_Ranged.Assault_Rifle.Burst', Level: 1, StatInclude: true, SlotEntries: [] },
        { PowerName: 'Temporary_Powers.Accolades.Portal_Jockey', Level: 50, StatInclude: false, SlotEntries: [] },
      ],
    }));

    expect(excluded.summary.accoladesImported).toBe(0);
    expect(excluded.build?.accolades).toEqual([]);
  });
});
