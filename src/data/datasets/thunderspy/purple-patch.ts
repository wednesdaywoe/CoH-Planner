/**
 * Thunderspy purple-patch — re-exports HC's tables.
 *
 * Combat scaling math hasn't meaningfully diverged between HC and the
 * Thunderspy (i23-era) snapshot. If Thunderspy ever tunes these values,
 * replace the re-export with concrete tables.
 */

export { getBaseToHit, getCombatModifier, getDefenseSoftcap } from '../homecoming/purple-patch';
