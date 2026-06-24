/**
 * Rebirth granted-power groups.
 *
 * Mostly inherits HC's mapping (Adaptation stances, Dual Pistols ammo
 * swap, Fly → Afterburner, etc. are server-agnostic in shape). Diverges
 * on Kheldian forms: Rebirth uses the game's PowerRedirector mechanic
 * for Bright Nova / White Dwarf / Dark Nova / Black Dwarf, where
 * form-specific variants are activation-time redirect targets of the
 * human-form base powers — not separate slottable picks. So those
 * entries are stripped from the Rebirth copy.
 *
 * See [./kheldian-redirects.ts](./kheldian-redirects.ts) for the
 * Rebirth-specific form mapping table that replaces the auto-grant
 * model.
 */

import { GRANTED_POWER_GROUPS as HC_GRANTED_POWER_GROUPS } from '../homecoming/granted-powers';
import type { GrantedPowerGroup } from '../homecoming/granted-powers';

const KHELDIAN_FORM_PARENTS = new Set([
  'Bright_Nova', 'White_Dwarf',
  'Dark_Nova',   'Black_Dwarf',
]);

// Rebirth reworked the Flight pool: Fly no longer grants Afterburner. Instead
// the two tier-4 powers each unlock a free bonus power WHEN Fly is also trained:
//   • Aerobatics  (internalName "Group_Fly")  + Fly → unlocks Group Fly
//     (internalName "Group_Fly_Free", a Team Fly toggle).
//   • Dive Attack (internalName "Afterburner") + Fly → unlocks Afterburner
//     (internalName "Fly_Afterburner", the +max-fly-speed boost).
// The reused internal names ("Group_Fly" = Aerobatics, "Afterburner" = Dive
// Attack) are a Rebirth quirk — verified against z_rebirth_bin.pigg, where both
// bonus powers carry auto_issue=true and `requires` naming only their tier-4
// parent. The "also Fly" conjunction lives in the parent's grant effect in-game,
// so we model it here with `alsoRequires`. HC's `Fly → Fly_Boost` mapping does
// not apply on Rebirth (no Fly_Boost power exists), so it is dropped.
const REBIRTH_FLIGHT_GRANTS: Record<string, GrantedPowerGroup> = {
  Group_Fly: {
    parentPower: 'Group_Fly', // display name "Aerobatics"
    grantedPowers: ['Group_Fly_Free'],
    mutuallyExclusive: false,
    alsoRequires: ['Fly'],
    description: 'Group Fly is unlocked while both Aerobatics and Fly are trained',
  },
  Afterburner: {
    parentPower: 'Afterburner', // display name "Dive Attack"
    grantedPowers: ['Fly_Afterburner'],
    mutuallyExclusive: false,
    alsoRequires: ['Fly'],
    description: 'Afterburner is unlocked while both Dive Attack and Fly are trained',
  },
};

const REBIRTH_DROPPED_PARENTS = new Set([
  ...KHELDIAN_FORM_PARENTS,
  'Fly', // HC's Fly → Fly_Boost does not exist on Rebirth's reworked Flight pool
]);

export const GRANTED_POWER_GROUPS = {
  ...Object.fromEntries(
    Object.entries(HC_GRANTED_POWER_GROUPS).filter(
      ([key]) => !REBIRTH_DROPPED_PARENTS.has(key),
    ),
  ),
  ...REBIRTH_FLIGHT_GRANTS,
};

// Re-export accessor helpers unchanged — they read from whichever
// GRANTED_POWER_GROUPS is in scope.
export {
  hasGrantedPowers,
  getGrantedPowerGroup,
  getActiveDamageConversion,
} from '../homecoming/granted-powers';
export type { GrantedPowerGroup } from '../homecoming/granted-powers';
