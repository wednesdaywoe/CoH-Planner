/**
 * Thunderspy granted-power groups.
 *
 * Inherits HC's mapping wholesale (Adaptation stances, Dual Pistols ammo
 * swap, Fly → Afterburner, Kheldian forms, etc.). Thunderspy is an i23-era
 * snapshot that uses the same auto-grant model HC does for Kheldian forms
 * (unlike Rebirth's PowerRedirector mechanic), so nothing is stripped.
 *
 * The custom Primalist AT's Hunter/Prowler/Primal form mechanics are modeled
 * separately (see Phase F / kheldian-* form machinery), not here.
 */

export {
  GRANTED_POWER_GROUPS,
  hasGrantedPowers,
  getGrantedPowerGroup,
  getActiveDamageConversion,
} from '../homecoming/granted-powers';
export type { GrantedPowerGroup } from '../homecoming/granted-powers';
