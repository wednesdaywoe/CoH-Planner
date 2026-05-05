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

const KHELDIAN_FORM_PARENTS = new Set([
  'Bright_Nova', 'White_Dwarf',
  'Dark_Nova',   'Black_Dwarf',
]);

export const GRANTED_POWER_GROUPS = Object.fromEntries(
  Object.entries(HC_GRANTED_POWER_GROUPS).filter(
    ([key]) => !KHELDIAN_FORM_PARENTS.has(key),
  ),
);

// Re-export accessor helpers unchanged — they read from whichever
// GRANTED_POWER_GROUPS is in scope.
export {
  hasGrantedPowers,
  getGrantedPowerGroup,
  getActiveDamageConversion,
} from '../homecoming/granted-powers';
export type { GrantedPowerGroup } from '../homecoming/granted-powers';
