/**
 * Atom Smasher
 * PBAoE, DMG(Energy/Toxic), Foe -Def, Disorient, Special
 *
 * Source: stalker_melee/radiation_melee/atom_smasher.json
 */

import type { Power } from '@/types';

export const AtomSmasher: Power = {
  "name": "Atom Smasher",
  "internalName": "Atom_Smasher",
  "available": 25,
  "description": "You charge up a dangerously unstable amount of radioactive energy into a single fist before driving it into the ground and causing a small explosion. Foes caught in the blast will suffer High Energy and Toxic damage and have their defense reduced. Enemies also have a moderate chance to be disoriented for a short time. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
  "shortHelp": "PBAoE, DMG(Energy/Toxic), Foe -Def, Disorient, Special",
  "icon": "radiationmelee_atomsmasher.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 22,
    "endurance": 20.176,
    "castTime": 2.93,
    "maxTargets": 10
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
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.3875,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 1.1625,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.2,
      "table": "Melee_Debuff_Def"
    }
  }
};
