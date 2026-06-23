/**
 * Thunderspy granted-power groups.
 *
 * Inherits HC's mapping wholesale (Adaptation stances, Dual Pistols ammo
 * swap, Fly → Afterburner, Kheldian forms, etc.) and adds the custom
 * Primalist AT's form grants on top. Thunderspy is an i23-era snapshot that
 * uses the same auto-grant model HC does for Kheldian forms (unlike Rebirth's
 * PowerRedirector mechanic), so nothing is stripped.
 *
 * Primalist forms behave exactly like Kheldian Nova/Dwarf forms: taking the
 * form toggle auto-grants a slottable sub-power that nests under the form in
 * the build and does NOT consume one of the 24 power picks.
 *   - Hunter Form  → Hunter's Howl  (PBAoE debuff — "It can be slotted as normal")
 *   - Prowler Form → Pounce         (melee attack — "This power can be slotted as normal")
 * Both granted powers live in the same Feral Might powerset, carry
 * `available: -1` + `requires: Feral_Might.Feral_Might.<Form>`, and are hidden
 * from the picker — so they're only obtainable via the form grant, matching
 * the game.
 *
 * Note: the Primal/Hunter/Prowler form-shell *attack redirects* are a
 * separate mechanic (see [./primalist-redirects.ts](./primalist-redirects.ts)),
 * not granted sub-powers.
 */

import {
  GRANTED_POWER_GROUPS as HC_GRANTED_POWER_GROUPS,
  type GrantedPowerGroup,
} from '../homecoming/granted-powers';

export const GRANTED_POWER_GROUPS: Record<string, GrantedPowerGroup> = {
  ...HC_GRANTED_POWER_GROUPS,

  // ============================================
  // PRIMALIST (Thunderspy) - form grants
  // ============================================
  'Hunter_Form': {
    parentPower: 'Hunter_Form',
    grantedPowers: ['Hunters_Howl'],
    mutuallyExclusive: false,
    slottable: true,
    description: "Hunter Form grants the slottable Hunter's Howl power",
  },
  'Prowler_Form': {
    parentPower: 'Prowler_Form',
    grantedPowers: ['Pounce'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'Prowler Form grants the slottable Pounce power',
  },
};

// Re-export accessor helpers unchanged — they read from whichever
// GRANTED_POWER_GROUPS is in scope.
export {
  hasGrantedPowers,
  getGrantedPowerGroup,
  getActiveDamageConversion,
} from '../homecoming/granted-powers';
export type { GrantedPowerGroup } from '../homecoming/granted-powers';
