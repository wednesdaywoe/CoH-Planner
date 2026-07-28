import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals } from './character-totals';
import { createDefaultIncarnateActiveState } from '@/types/incarnate';

/**
 * END COST and NET END are real numbers (reported 2026-07-28).
 *
 * The engine swap (2026-07-23) made the Rust engine the only calc path, and its output mapper
 * hardcoded `toggleEndCost` / `netEndPerSec` to 0 on the stated grounds that they fed no
 * dashboard total. They feed two: the Survival & Mobility card's END COST and NET END. Every
 * build read 0.00/s for five days, and the Attack Chain builder's endurance sim ran on the
 * same zero. The parity gate said nothing because both fields sat in its UNMAPPED excuse list.
 *
 * `serverParity` now grades them against the legacy oracle across the corpus, which is the
 * real fidelity check. This is the symptom guard beside it: a build with running toggles must
 * show a drain, and NET END must be recovery minus that drain. It fails on a re-zeroing even
 * if someone re-adds the excuse.
 */
describe('Toggle endurance totals (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  /** Three Leadership toggles at 0.39 end/sec each. Maneuvers' internal name is `Defense`. */
  function leadershipBuild(active: boolean) {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as any;
    b.pools = [{
      id: 'leadership', name: 'Leadership',
      powers: [
        { internalName: 'Defense', name: 'Maneuvers', powerSet: 'leadership', level: 4, isActive: active, slots: [] },
        { internalName: 'Assault', name: 'Assault', powerSet: 'leadership', level: 6, isActive: active, slots: [] },
        { internalName: 'Tactics', name: 'Tactics', powerSet: 'leadership', level: 14, isActive: active, slots: [] },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }] as any;
    return b;
  }

  const totals = (active: boolean) =>
    calculateCharacterTotals(leadershipBuild(active), false, createDefaultIncarnateActiveState(), {}).globalBonuses;

  it('sums the running toggles into END COST', () => {
    const g = totals(true);
    // 3 × 0.39/s, unslotted and undiscounted.
    expect(g.toggleEndCost).toBeCloseTo(1.17, 4);
  });

  it('NET END is recovery minus the drain', () => {
    const g = totals(true);
    // Base 100 endurance + flat +MaxEnd, recovered over 60s, scaled by +Recovery.
    const recoveryPerSec = ((100 + g.maxEndurance) / 60) * (1 + g.recovery / 100);
    expect(g.netEndPerSec).toBeCloseTo(recoveryPerSec - g.toggleEndCost, 6);
    // The whole point: a build running three toggles is NOT net-neutral.
    expect(g.netEndPerSec).toBeLessThan(recoveryPerSec);
  });

  it('toggles switched off cost nothing, and NET END is then pure recovery', () => {
    const g = totals(false);
    expect(g.toggleEndCost).toBe(0);
    expect(g.netEndPerSec).toBeCloseTo(((100 + g.maxEndurance) / 60) * (1 + g.recovery / 100), 6);
  });
});
