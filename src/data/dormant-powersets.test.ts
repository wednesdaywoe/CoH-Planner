import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllPowersets, getPowerset } from '@/data';
import { MODULAR_POWERSETS as HC_RAW } from '@/data/datasets/homecoming/powersets/index';

/**
 * Dormant-set derivation (replaces the former hand-maintained HC_HIDDEN_POWERSETS).
 *
 * A powerset present in a server's bins but not released to players has its
 * powers locked behind a dev-only `accesslevel > 0` gate. `deriveDormant`
 * (scripts/convert-powerset.cjs) flags such sets `dormant: true` at convert
 * time when the majority of their powers carry that gate; src/data/powersets.ts
 * drops flagged sets from the pickable registry for every dataset.
 *
 * On HC the only dormant player-selectable powersets are Wind Control
 * (controller + dominator) — an unfinished pre-shutdown set. This is exactly
 * what the old hand-list hid, now derived from the bins instead.
 */
describe('dormant powerset derivation', () => {
  const HC_DORMANT = ['controller/wind-control', 'dominator/wind-control'];

  describe('convert-time flag', () => {
    it('flags HC Wind Control (controller + dominator) as dormant', () => {
      for (const id of HC_DORMANT) {
        expect(HC_RAW[id], `${id} should exist in the generated registry`).toBeDefined();
        expect(HC_RAW[id].dormant, `${id} should be flagged dormant`).toBe(true);
      }
    });

    it('does not flag a released HC set as dormant (anchor)', () => {
      // Fire Control is a normal, released HC controller primary.
      expect(HC_RAW['controller/fire-control']).toBeDefined();
      expect(HC_RAW['controller/fire-control'].dormant).toBeFalsy();
    });
  });

  describe('runtime filtering (HC)', () => {
    beforeAll(async () => {
      await loadDataset('homecoming');
    });

    it('drops dormant sets from the pickable registry', () => {
      for (const id of HC_DORMANT) {
        expect(getPowerset(id), `${id} should be hidden from pickers`).toBeUndefined();
      }
    });

    it('never exposes a dormant set through getAllPowersets (invariant)', () => {
      const leaked = Object.entries(getAllPowersets())
        .filter(([, ps]) => ps.dormant)
        .map(([id]) => id);
      expect(leaked).toEqual([]);
    });

    it('still exposes released sets', () => {
      expect(getPowerset('controller/fire-control')).toBeDefined();
    });
  });
});
