/**
 * Devastating Blow
 * Melee, Extreme DMG(Energy/Smash), Foe -Def, Disorient, Special
 *
 * Source: dominator_assault/radioactive_assault/devastating_blow.json
 */

import type { Power } from '@/types';

export const DevastatingBlow: Power = {
  "name": "Devastating Blow",
  "internalName": "Devastating_Blow",
  "available": 29,
  "description": "You hammer your foe with a brutal smashing attack charged with a lethal dose of radiation. Your target will suffer Extreme Energy and Smashing damage, will have its defense reduced and will be disoriented for a short time. Devastating Blow has an increased change to critically hit. Affected enemies will be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Energy/Smash), Foe -Def, Disorient, Special",
  "icon": "radioactiveassault_devastatingblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Dominator Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.89,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.67,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Def"
    },
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    }
  }
};
