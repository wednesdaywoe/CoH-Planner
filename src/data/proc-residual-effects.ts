import type { ProcEffect } from './proc-data';

/**
 * Hand-curated structured effects for the proc residual the binary generator
 * cannot derive (see PROC-DATA-BINARY-SOURCING.md, P4/P5). This is the "thin
 * hand-override layer for the genuinely underivable" the architecture decision
 * allows — it exists so `getProcEffects` never falls back to string parsing,
 * which lets `parseProcEffect` be retired entirely.
 *
 * Each entry is a FAITHFUL transcription of the proc's binary-sourced `mechanics`
 * string (the values were pulled from the bins by hand during the interim fix),
 * structured the way the generator would emit. Why each is here, by bucket:
 *
 *  - **Rebirth-only sets** (Witchcraft, Imperial Might, Endless Nightmare,
 *    Guardian's Gift, The Haunting, Vampire's Bite, Return From The Grave,
 *    Inexhaustibility, Absolute Resolution, Superior Winter's Gift): not present
 *    in the HC bins the generator reads — sourced from the Rebirth Parse6 bins.
 *  - **Create_Entity pet summons** (Fiery Orb, Energy Font, The Haunting): the
 *    binary encodes a `Create_Entity` redirect, not a dashboard stat → `Special`.
 *  - **PBAoE ally buffs** (Vigilant Assault, Scourging Blast, Defender's Bastion,
 *    Guardian's Gift): buff the caster + nearby allies; the value scales by the
 *    slotted power → no clean self contribution.
 *  - **Self meters / conditional stacks** (+Fury, +Opportunity, +Rage, +Damage
 *    stack, Recharge-Power): bespoke mechanics the dashboard does not model.
 *  - **Utility** (Convert Knockback→Knockdown, Recharge Build Up).
 *
 * Foe debuff/mez/knock effects carry `target:'foe'` so no dashboard path applies
 * them (they are display-only). NB two foe procs where the HC binary disagrees
 * with the hand string (flagged inline) are transcribed to MATCH the hand value
 * — resolving them is a separate in-game verification, not part of this campaign.
 */
export const PROC_RESIDUAL_EFFECTS: Record<string, ProcEffect[]> = {
  // --- Foe debuffs / mez / knock (display-only; target:'foe') -----------------
  // Witchcraft / Superior Witchcraft (Rebirth): Foe(-Resistance 20%) for 10s
  'Witchcraft: Chance for -Res Debuff': [{ category: 'Debuff', value: -20, effectType: 'Resistance', duration: 10, target: 'foe' }],
  'Superior Witchcraft: Chance for -Res Debuff': [{ category: 'Debuff', value: -20, effectType: 'Resistance', duration: 10, target: 'foe' }],
  // Stupefy generic "Chance for Stun": Foe(Disorient Mag 2) for 8s
  'Chance for Stun': [{ category: 'Control', value: 2, effectType: 'Stun', duration: 8, target: 'foe' }],
  // Coercive Persuasion "Chance for Confusion": Foe(Confusion) for 10s (Execute_Power redirect — magnitude not in the string)
  'Chance for Confusion': [{ category: 'Control', effectType: 'Confuse', duration: 10, target: 'foe' }],
  // Imperial Might (Rebirth): Foe(Knockback Mag 0.67 = Knockdown)
  'Imperial Might: Chance for Knockdown': [{ category: 'Control', value: 0.67, effectType: 'Knockdown', target: 'foe' }],
  // Winter's Bite "Recharge Slow": hand Foe(-Recharge 20%) for 20s.
  // NB HC binary shows the proc as -Speed 20% (RunningSpeed), not -Recharge — transcribed to the hand value.
  "Winter's Bite: Chance for Recharge Slow": [{ category: 'Debuff', value: -20, effectType: 'Recharge', duration: 20, target: 'foe' }],
  // Superior Winter's Bite: Foe(-Recharge 20%, -Speed 20%) for 10s
  "Superior Winter's Bite: Recharge/Chance for -Recharge,Slow": [
    { category: 'Debuff', value: -20, effectType: 'Recharge', duration: 10, target: 'foe' },
    { category: 'Debuff', value: -20, effectType: 'Speed', duration: 10, target: 'foe' },
  ],
  // Superior Avalanche: hand Foe(Knockback Mag 6).
  // NB HC binary shows this proc as a knockdown-magnitude (<1), not Mag 6 — transcribed to the hand value.
  'Superior Avalanche: Recharge/Chance for Knockback': [{ category: 'Control', value: 6, effectType: 'Knockback', target: 'foe' }],
  // Endless Nightmare / Superior (Rebirth): Foe Fear(8s) + conditional Psionic damage (shown as a damage proc, as before)
  'Endless Nightmare: Recharge/Chance for Fear, Psionic Damage': [
    { category: 'Damage', value: 7, valueMax: 72, effectType: 'Psionic' },
    { category: 'Control', effectType: 'Fear', duration: 8, target: 'foe' },
  ],
  'Superior Endless Nightmare: Recharge/Chance for Fear, Psionic Damage': [
    { category: 'Damage', value: 10, valueMax: 107, effectType: 'Psionic' },
    { category: 'Control', effectType: 'Fear', duration: 8, target: 'foe' },
  ],

  // --- Damage procs not in the HC bins (Rebirth) -----------------------------
  // Absolute Resolution (Rebirth): Damage(Energy 7-72); Superior entered flat 72 in the hand string.
  'Absolute Resolution: Chance for Energy Damage': [{ category: 'Damage', value: 7, valueMax: 72, effectType: 'Energy' }],
  'Superior Absolute Resolution: Chance for Energy Damage': [{ category: 'Damage', value: 72, valueMax: 72, effectType: 'Energy' }],

  // --- Always-on global (Rebirth) — dashboard-relevant. Mirrors the HC
  //     "Winter's Gift: Slow Resistance" shape; values 25/25 per the mechanics. ---
  "Superior Winter's Gift: Slow Resistance": [
    { category: 'SlowResistance', value: 25 },
    { category: 'RechargeResistance', value: 25 },
  ],

  // --- PBAoE ally buffs (caster + nearby allies; slotted-power-scaled) --------
  'Vigilant Assault: Recharge/Chance for +Absorb': [{ category: 'Absorb' }],
  'Superior Vigilant Assault: Recharge/Chance for +Absorb': [{ category: 'Absorb' }],
  'Chance for Minor PBAoE Heal': [{ category: 'Heal' }],
  'Scourging Blast: Recharge/Chance for +Endurance,+Health': [{ category: 'Special' }],
  'Superior Scourging Blast: Recharge/Chance for +Endurance,+Health': [{ category: 'Special' }],
  "Superior Defender's Bastion: Recharge/Chance for +Health": [{ category: 'Heal' }],
  // Guardian's Gift / Superior (Rebirth): PBAoE allies Absorb + Mez Prot + Mez Resist for 15s
  "Guardian's Gift: Chance for PBAoE Resolve": [{ category: 'Special', duration: 15 }],
  "Superior Guardian's Gift: Chance for PBAoE Resolve": [{ category: 'Special', duration: 15 }],

  // --- Create_Entity pet summons ---------------------------------------------
  'Chance for Fiery Orb': [{ category: 'Special' }],
  'Chance for Energy Font': [{ category: 'Special' }],
  'Superior Dominating Grasp: Recharge/Chance for Fiery Orb': [{ category: 'Special' }],
  'Superior Overpowering Presence: Recharge/Chance for Energy Font': [{ category: 'Special' }],
  'The Haunting: Chance to Summon Haunts': [{ category: 'Special' }],
  'Superior Haunting: Chance to Summon Haunts': [{ category: 'Special' }],

  // --- Self meters / conditional stacks / utility (not dashboard-modeled) -----
  'Chance for +Fury': [{ category: 'Special' }],
  'Superior Brute\'s Fury: Recharge/Chance for +Rage': [{ category: 'Special' }],
  'Opportunity Strikes: Recharge/Chance for +Opportunity': [{ category: 'Special' }],
  'Superior Opportunity Strikes: Recharge/Chance for +Opportunity': [{ category: 'Special' }],
  'Chance for +Damage': [{ category: 'Special' }],
  'Superior Ascendancy of the Dominator: Recharge/Chance for +Dam(All)': [{ category: 'Special' }],
  "Superior Assassin's Mark: Recharge/Chance for Recharge Power": [{ category: 'Special' }],
  'Convert Knockback to Knockdown': [{ category: 'Special' }],
  'Chance to Recharge Build Up': [{ category: 'Special' }],

  // --- Self heal / resurrect (Rebirth) ---------------------------------------
  "Vampire's Bite: Chance for Heal": [{ category: 'Heal' }],
  "Superior Vampire's Bite: Chance for Heal": [{ category: 'Heal' }],
  'Return From The Grave: Chance for Self Resurrect': [{ category: 'Special' }],
  'Superior Return From The Grave: Chance for Self Resurrect': [{ category: 'Special' }],
  'Inexhaustibility: Chance for Heal/Endurance/Regen': [{ category: 'Special' }],
};
