import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import {
  getPowerPool,
  hasGrantedPowers,
  getGrantedPowerGroup,
  getInherentPowers,
  getInherentPowerDef,
} from '@/data';
import { TRAVEL_CAP_BUMPS } from '@/data/core/movement-constants';

/**
 * @Redlynne Rebirth Flight pool report:
 *
 *   3) Group Fly should be unlocked by Fly + Aerobatics, but wasn't.
 *   4) Dive Attack + Fly should unlock Afterburner (increased max fly speed).
 *   2) Athletic Run was showing under Inherents (Rebirth has no Prestige
 *      Athletic Run — it ships Pool.Utility_Belt.Athletics instead).
 *
 * Rebirth reworked the Flight pool with reused internal names — Aerobatics is
 * internally "Group_Fly" and Dive Attack is "Afterburner". Each grants a free
 * bonus power (Group_Fly_Free / Fly_Afterburner) ONLY when Fly is also trained.
 * Verified against z_rebirth_bin.pigg: both bonus powers carry auto_issue=true.
 */

describe('Rebirth Flight pool bonus-power fixes', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  // ---- Issue 1: the bonus powers exist in the Flight pool data ------------
  it('the Flight pool carries both auto-granted bonus powers', () => {
    const flight = getPowerPool('flight');
    const names = flight?.powers.map((p) => p.internalName) ?? [];
    expect(names).toContain('Group_Fly_Free'); // free Group Fly
    expect(names).toContain('Fly_Afterburner'); // free Afterburner
    // Both are auto-granted (hidden from the picker).
    expect(flight?.powers.find((p) => p.internalName === 'Group_Fly_Free')?.available).toBeLessThan(0);
    expect(flight?.powers.find((p) => p.internalName === 'Fly_Afterburner')?.available).toBeLessThan(0);
  });

  // ---- Issues 3 & 4: conjunctive grant wiring (Aerobatics+Fly, Dive+Fly) --
  it('Aerobatics (Group_Fly) grants Group Fly and also requires Fly', () => {
    expect(hasGrantedPowers('Group_Fly')).toBe(true);
    const group = getGrantedPowerGroup('Group_Fly');
    expect(group?.grantedPowers).toContain('Group_Fly_Free');
    expect(group?.alsoRequires).toContain('Fly');
  });

  it('Dive Attack (Afterburner) grants Afterburner and also requires Fly', () => {
    expect(hasGrantedPowers('Afterburner')).toBe(true);
    const group = getGrantedPowerGroup('Afterburner');
    expect(group?.grantedPowers).toContain('Fly_Afterburner');
    expect(group?.alsoRequires).toContain('Fly');
  });

  it('HC\'s Fly -> Fly_Boost grant does not apply on Rebirth (no Fly_Boost power)', () => {
    expect(hasGrantedPowers('Fly')).toBe(false);
  });

  // ---- Issue 4: Afterburner raises the max fly-speed cap ------------------
  it('Rebirth Afterburner (Fly_Afterburner) bumps the fly-speed cap', () => {
    const bump = TRAVEL_CAP_BUMPS['Pool.Flight.Fly_Afterburner'];
    expect(bump).toBeDefined();
    expect(bump.stat).toBe('flySpeed');
    expect(bump.cap).toBeGreaterThan(TRAVEL_CAP_BUMPS['Pool.Flight.Fly'].cap);
  });

  // ---- Issue 2: Athletic Run is not granted on Rebirth -------------------
  it('Athletic Run is excluded from Rebirth inherents', () => {
    expect(getInherentPowers().some((p) => p.internalName === 'Athletic_Run')).toBe(false);
    expect(getInherentPowerDef('Athletic_Run')).toBeUndefined();
    // Sibling prestige runs are unaffected.
    expect(getInherentPowerDef('Ninja_Run')).toBeDefined();
  });
});
