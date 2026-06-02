import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset, getGrantedPowerGroup } from '@/data';

/**
 * Bio Armor's adaptation form-switcher has crossed internal/display names, and
 * the internal name differs by archetype:
 *
 *   Scrapper/Brute/Tanker: internal "Evolution"  → displays "Adaptation"   (L10, grants stances)
 *                          internal "Adaptation" → displays "Evolving Armor" (L20, +Res toggle)
 *   Stalker/Sentinel:      internal "Adaptation" → displays "Adaptation"   (grants stances; no Evolution power)
 *
 * A stale DISPLAY_NAME_OVERRIDES entry (written for the old clientmessages
 * source) re-swapped the already-correct pigg display names, so Scrapper saw
 * "Evolving Armor" at L10 and "Adaptation" at L20. These tests pin the correct
 * names and the granted-stance wiring (keyed by both internal names; stances
 * `requires` the right parent per AT).
 */

const STANCES = ['Defensive_Adaptation', 'Efficient_Adaptation', 'Offensive_Adaptation'];

function powerBy(powersetId: string, internalName: string) {
  return getPowerset(powersetId)?.powers.find((p) => p.internalName === internalName);
}

for (const ds of ['homecoming', 'rebirth'] as const) {
  describe(`Bio Armor naming — ${ds}`, () => {
    beforeAll(async () => {
      await loadDataset(ds);
    });

    for (const setId of [`scrapper/bio-armor`, `brute/bio-armor`, `tanker/bio-armor`]) {
      it(`${setId}: form-switcher "Evolution" displays "Adaptation"; "Adaptation" displays "Evolving Armor" (earlier)`, () => {
        const evolution = powerBy(setId, 'Evolution');
        const adaptation = powerBy(setId, 'Adaptation');
        expect(evolution, `${setId} Evolution`).toBeTruthy();
        expect(adaptation, `${setId} Adaptation`).toBeTruthy();
        expect(evolution!.name).toBe('Adaptation');
        expect(adaptation!.name).toBe('Evolving Armor');
        // The switcher unlocks before the +Res "Evolving Armor" toggle (exact
        // levels vary by AT — Tanker is a primary set, so it's earlier).
        expect(evolution!.available).toBeLessThan(adaptation!.available);
      });

      it(`${setId}: stances require the "Evolution" switcher`, () => {
        for (const stance of STANCES) {
          const p = powerBy(setId, stance);
          expect(p, `${setId} ${stance}`).toBeTruthy();
          expect(p!.requires?.endsWith('.Evolution'), `${stance} requires=${p!.requires}`).toBe(true);
        }
      });
    }

    it('Stalker: internal "Adaptation" is the switcher (displays "Adaptation"); stances require it', () => {
      const adaptation = powerBy('stalker/bio-armor', 'Adaptation');
      expect(adaptation, 'stalker Adaptation').toBeTruthy();
      expect(adaptation!.name).toBe('Adaptation');
      // Stalker has no separate "Evolution" power.
      expect(powerBy('stalker/bio-armor', 'Evolution')).toBeUndefined();
      for (const stance of STANCES) {
        const p = powerBy('stalker/bio-armor', stance);
        expect(p, `stalker ${stance}`).toBeTruthy();
        expect(p!.requires?.endsWith('.Adaptation'), `${stance} requires=${p!.requires}`).toBe(true);
      }
    });

    it('GRANTED_POWER_GROUPS registers both internal-name keys for the stances', () => {
      for (const key of ['Adaptation', 'Evolution']) {
        const group = getGrantedPowerGroup(key);
        expect(group, `group ${key}`).toBeTruthy();
        expect(group!.grantedPowers).toEqual(STANCES);
        expect(group!.mutuallyExclusive).toBe(true);
      }
    });
  });
}
