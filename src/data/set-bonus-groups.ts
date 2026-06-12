/**
 * Categorization for the Set Bonus Totals popup, grouped the way a CoH player
 * expects (General / Health & Endurance / Defense / Resistance / Mez-Debuff
 * Resistance / Movement).
 *
 * Keyed by the *normalized* stat names produced by `collectAllSetBonuses` /
 * `normalizeStatName` (e.g. "defEnergy", "resLethal", "mezresist") — NOT the
 * raw "defense_(energy)" form. Each entry assigns a group and a row label;
 * paired defense/resistance stats (S/L, F/C, E/N) deliberately share a label so
 * the duplicate the engine emits for the pair collapses to one row.
 *
 * `set-bonus-groups.test.ts` asserts every normalized stat the engine can emit
 * has an entry here, so a new bonus stat can't silently fall into "Misc".
 */

export interface StatGroupInfo {
  group: string;
  label: string;
}

export const STAT_GROUP_INFO: Record<string, StatGroupInfo> = {
  // General — offense buffs, recharge, range, knockback
  damage: { group: 'General', label: 'Damage' },
  accuracy: { group: 'General', label: 'Accuracy' },
  tohit: { group: 'General', label: 'ToHit' },
  recharge: { group: 'General', label: 'Recharge' },
  range: { group: 'General', label: 'Range' },
  perceptionradius: { group: 'General', label: 'Perception' },
  kbprotection: { group: 'General', label: 'KB Protection' },
  kbresistance: { group: 'General', label: 'KB Resistance' },
  // Health & Endurance
  maxhp: { group: 'Health & Endurance', label: 'Max HP' },
  regeneration: { group: 'Health & Endurance', label: 'Regeneration' },
  maxend: { group: 'Health & Endurance', label: 'Max Endurance' },
  recovery: { group: 'Health & Endurance', label: 'Recovery' },
  endrdx: { group: 'Health & Endurance', label: 'End Discount' },
  healOther: { group: 'Health & Endurance', label: 'Heal' },
  // Defense (positional + typed; pairs share a label)
  defMelee: { group: 'Defense', label: 'Melee' },
  defRanged: { group: 'Defense', label: 'Ranged' },
  defAoE: { group: 'Defense', label: 'AoE' },
  defSmashing: { group: 'Defense', label: 'Smashing/Lethal' },
  defLethal: { group: 'Defense', label: 'Smashing/Lethal' },
  defFire: { group: 'Defense', label: 'Fire/Cold' },
  defCold: { group: 'Defense', label: 'Fire/Cold' },
  defEnergy: { group: 'Defense', label: 'Energy/Negative' },
  defNegative: { group: 'Defense', label: 'Energy/Negative' },
  defPsionic: { group: 'Defense', label: 'Psionic' },
  defToxic: { group: 'Defense', label: 'Toxic' },
  // Resistance (typed; pairs share a label)
  resSmashing: { group: 'Resistance', label: 'Smashing/Lethal' },
  resLethal: { group: 'Resistance', label: 'Smashing/Lethal' },
  resFire: { group: 'Resistance', label: 'Fire/Cold' },
  resCold: { group: 'Resistance', label: 'Fire/Cold' },
  resEnergy: { group: 'Resistance', label: 'Energy/Negative' },
  resNegative: { group: 'Resistance', label: 'Energy/Negative' },
  resPsionic: { group: 'Resistance', label: 'Psionic' },
  resToxic: { group: 'Resistance', label: 'Toxic' },
  resAll: { group: 'Resistance', label: 'All' },
  // Mez / Debuff Resistance
  mezresist: { group: 'Mez/Debuff Res', label: 'Mez Resistance' },
  debuffresistrecharge: { group: 'Mez/Debuff Res', label: 'Slow Res (Rech)' },
  debuffresistslow: { group: 'Mez/Debuff Res', label: 'Slow Res (Move)' },
  // Mez / control duration (offensive — boosts the mez you apply)
  immobilizeDuration: { group: 'Mez Duration', label: 'Immobilize' },
  holdDuration: { group: 'Mez Duration', label: 'Hold' },
  stunDuration: { group: 'Mez Duration', label: 'Stun' },
  sleepDuration: { group: 'Mez Duration', label: 'Sleep' },
  confuseDuration: { group: 'Mez Duration', label: 'Confuse' },
  terrorDuration: { group: 'Mez Duration', label: 'Fear' },
  // Movement
  runspeed: { group: 'Movement', label: 'Run Speed' },
  flyspeed: { group: 'Movement', label: 'Fly Speed' },
  jumpspeed: { group: 'Movement', label: 'Jump Speed' },
  jumpheight: { group: 'Movement', label: 'Jump Height' },
};

/** Display order for the broad groups. Unlisted groups (e.g. "Misc") sort last. */
export const SET_BONUS_GROUP_ORDER = [
  'General', 'Health & Endurance', 'Defense', 'Resistance', 'Mez Duration', 'Mez/Debuff Res', 'Movement', 'Misc',
];

/**
 * Maps a dashboard `breakdown` map key → the normalized `STAT_GROUP_INFO` key.
 *
 * Always-on global IO procs (LotG +Recharge, Numina/Miracle +Rec/+Reg, Steadfast
 * /Gladiator's +Def(All), Kismet +ToHit, …) are NOT set bonuses, so they never
 * enter the set-bonus Rule-of-5 map the Set Bonus Totals popup reads. They DO
 * land in the per-stat `breakdown` (as `type: 'proc'` sources), which the
 * dashboard tiles and Detailed Totals modal already display. To surface them in
 * the Set Bonus Totals popup too, we fold those proc sources into the matching
 * row — but the breakdown's stat keys differ from the popup's grouping keys for
 * a handful of stats (`toHit` vs `tohit`, `maxHP` vs `maxhp`, `protKnockback` vs
 * `kbprotection`, …). This map covers exactly the keys `applySingleProcEffect`
 * can emit; anything not listed (e.g. Build Up proc `damage`) is intentionally
 * excluded from the totals window.
 */
export const PROC_BREAKDOWN_KEY_TO_GROUP_KEY: Record<string, string> = {
  recharge: 'recharge',
  recovery: 'recovery',
  regeneration: 'regeneration',
  maxHP: 'maxhp',
  toHit: 'tohit',
  runSpeed: 'runspeed',
  // Defense (positional + typed) — keys already match STAT_GROUP_INFO
  defMelee: 'defMelee',
  defRanged: 'defRanged',
  defAoE: 'defAoE',
  defSmashing: 'defSmashing',
  defLethal: 'defLethal',
  defFire: 'defFire',
  defCold: 'defCold',
  defEnergy: 'defEnergy',
  defNegative: 'defNegative',
  defPsionic: 'defPsionic',
  defToxic: 'defToxic',
  // Resistance (typed) — keys already match STAT_GROUP_INFO
  resSmashing: 'resSmashing',
  resLethal: 'resLethal',
  resFire: 'resFire',
  resCold: 'resCold',
  resEnergy: 'resEnergy',
  resNegative: 'resNegative',
  resPsionic: 'resPsionic',
  resToxic: 'resToxic',
  // Mez / Debuff Resistance
  mezResist: 'mezresist',
  debuffResistSlow: 'debuffresistslow',
  debuffResistRecharge: 'debuffresistrecharge',
  protKnockback: 'kbprotection',
};
