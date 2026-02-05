/**
 * DNA Siphon
 * Click, PBAoE Minor DMG(Lethal/Toxic) Foe -Regen, Taunt, Self +HP, +End, +Special
 *
 * Source: tanker_defense/bio_organic_armor/dna_siphon.json
 */

import type { Power } from '@/types';

export const DNASiphon: Power = {
  "name": "DNA Siphon",
  "internalName": "DNA_Siphon",
  "available": 17,
  "description": "You can siphon genetic material from nearby enemies, causing a minor amount of Lethal damage and a minor amount of Toxic damage over time. Living enemies will provide the user with a small boost to health and endurance. These foes will have their regeneration rate reduced for a short period of time. Defeated enemies provide a weaker sample of material and thus will boost recovery and regeneration for a short while. While Efficient Adaptation is active, this power will grant bonus regeneration and recovery per defeated target hit. While Defensive Adaptation is active, this power will grant bonus health per living target hit. While Offensive Adaptation is active this power's regeneration debuff is increased in effectiveness.Damage: Minor.Recharge: Long.",
  "shortHelp": "Click, PBAoE Minor DMG(Lethal/Toxic) Foe -Regen, Taunt, Self +HP, +End, +Special",
  "icon": "bioorganicarmor_dnasiphon.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 90,
    "endurance": 13,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Endurance Modification",
    "Healing",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.2,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 1
    },
    {
      "type": "Heal",
      "scale": 1.25,
      "table": "Melee_HealSelf"
    },
    {
      "type": "Heal",
      "scale": 0.375,
      "table": "Melee_HealSelf"
    }
  ],
  "effects": {
    "enduranceGain": {
      "scale": 5,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.06,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.0938,
      "table": "Melee_Ones"
    },
    "regenDebuff": {
      "scale": 1.33,
      "table": "Melee_Ones"
    }
  }
};
