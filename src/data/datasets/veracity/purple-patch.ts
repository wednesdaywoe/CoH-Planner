/**
 * Veracity purple-patch — re-exports HC's tables.
 *
 * Veracity is a heavily-modified i25-derived (SCoRE-Neptune-lineage) server, but
 * the combat scaling math (level-difference to-hit, combat modifiers, defense
 * softcap) hasn't diverged from standard CoH. If Veracity ever tunes these,
 * replace the re-export with concrete tables.
 */

export { getBaseToHit, getCombatModifier, getDefenseSoftcap } from '../homecoming/purple-patch';
