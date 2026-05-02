/**
 * Rebirth purple-patch — re-exports HC's tables.
 *
 * Combat scaling math hasn't meaningfully diverged between HC and Rebirth
 * at this snapshot's era (both trace back to retail i24/i25). If Rebirth
 * ever tunes these values, replace the re-export with concrete tables.
 */

export { getBaseToHit, getCombatModifier } from '../homecoming/purple-patch';
