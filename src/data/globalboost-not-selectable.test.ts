import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset, getAllPowersets } from '@/data';
import { hydrateBuild } from '@/utils/build-serialization';

/**
 * The picker hides auto-granted powers with `available < 0`. The HC pigg/bin
 * source stores that -1 sentinel UNSIGNED, so it now arrives as 0xFFFFFFFF
 * (4294967295) — the same value the user saw leak granted toggles (Dual Pistols
 * ammo, Bio Armor adaptations, Staff forms) into the picker once their parent
 * power satisfied their `requires`. This predicate mirrors the picker's fixed
 * check (signed OR unsigned negative).
 */
const isAutoGrantedAvailable = (a: number) => a < 0 || a >= 0x80000000;

/**
 * Regression: hidden "GlobalBoost" procs must never appear as selectable powers.
 *
 * Martial Combat's `Build_Up_Proc` is a GlobalBoost (an auto-issued global
 * enhancement the engine fires behind "Reach for the Limit"). An HC data
 * regeneration emitted it as a powerset power; because it shares the display
 * name "Reach for the Limit", it showed up as a second, pickable copy that
 * reappeared on every reload. The converter now drops `type: 'GlobalBoost'`,
 * and the hydrator de-dupes a powerset's powers by internal name so any build
 * that already captured the proc self-heals.
 */

describe('GlobalBoost procs are not selectable powers', () => {
  describe('Homecoming', () => {
    beforeAll(async () => {
      await loadDataset('homecoming');
    });

    it('Martial Combat lists "Reach for the Limit" exactly once (no Build_Up_Proc)', () => {
      const ps = getPowerset('blaster/martial-combat');
      expect(ps).toBeTruthy();
      const named = ps!.powers.filter((p) => p.name === 'Reach for the Limit');
      expect(named).toHaveLength(1);
      expect(named[0].internalName).toBe('Reach_for_the_Limit');
      expect(ps!.powers.some((p) => p.internalName === 'Build_Up_Proc')).toBe(false);
    });

    it('no powerset exposes a "Global Enhancement" power as selectable', () => {
      const offenders: string[] = [];
      for (const [id, ps] of Object.entries(getAllPowersets())) {
        for (const p of ps.powers) {
          if (p.powerType === 'Global Enhancement') offenders.push(`${id}:${p.internalName}`);
        }
      }
      expect(offenders).toEqual([]);
    });

    it('the granted-toggle families the regen unhid are auto-granted (ammo, adaptations, forms)', () => {
      // Every non-slottable auto-granted toggle the sweep found leaking. Each
      // must read as auto-granted on `available` so the picker hides it even
      // after its parent satisfies the toggle's `requires`. (Slottable Kheldian
      // forms and pickable alternates like Boomerang_Slice are intentionally
      // not here — they aren't hidden via `available`.)
      const cases: Array<[string, string]> = [
        ['blaster/dual-pistols', 'Incendiary_Ammunition'],
        ['corruptor/dual-pistols', 'Cryo_Ammunition'],
        ['scrapper/bio-armor', 'Defensive_Adaptation'],
        ['tanker/bio-armor', 'Offensive_Adaptation'],
        ['scrapper/staff-fighting', 'Form_of_the_Body'],
        ['brute/staff-fighting', 'Form_of_the_Soul'],
        ['peacebringer/luminous-aura', 'Quantum_Boost'], // orphan: no granted group
      ];
      const leaking: string[] = [];
      for (const [powersetId, internalName] of cases) {
        const ps = getPowerset(powersetId);
        const p = ps?.powers.find((x) => x.internalName === internalName);
        if (!p) {
          leaking.push(`${powersetId}:${internalName} (missing)`);
          continue;
        }
        if (!isAutoGrantedAvailable(p.available)) {
          leaking.push(`${powersetId}:${internalName} (available=${p.available})`);
        }
      }
      expect(leaking).toEqual([]);
    });

    it('a saved build with the duplicate proc heals to a single power on hydrate', () => {
      const slim = {
        archetype: { id: 'blaster' },
        level: 50,
        secondary: {
          id: 'blaster/martial-combat',
          powers: [
            { name: 'Reach for the Limit', internalName: 'Reach_for_the_Limit', level: 4, slots: [] },
            // The retired proc — same display name, dead internal name. Resolves
            // by display name onto the real power, then de-dupes away.
            { name: 'Reach for the Limit', internalName: 'Build_Up_Proc', level: 4, slots: [] },
          ],
        },
      };
      const build = hydrateBuild(slim);
      const rftl = build.secondary.powers.filter((p) => p.name === 'Reach for the Limit');
      expect(rftl).toHaveLength(1);
      expect(rftl[0].internalName).toBe('Reach_for_the_Limit');
    });
  });

  describe('Rebirth', () => {
    beforeAll(async () => {
      await loadDataset('rebirth');
    });

    it('no powerset exposes a "Global Enhancement" power as selectable', () => {
      const offenders: string[] = [];
      for (const [id, ps] of Object.entries(getAllPowersets())) {
        for (const p of ps.powers) {
          if (p.powerType === 'Global Enhancement') offenders.push(`${id}:${p.internalName}`);
        }
      }
      expect(offenders).toEqual([]);
    });
  });
});
