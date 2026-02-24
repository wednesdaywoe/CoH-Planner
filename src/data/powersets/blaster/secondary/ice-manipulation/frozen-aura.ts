/**
 * Frozen Aura
 * PBAoE Melee, Moderate DMG(Smashing), Foe Sleep
 *
 * Source: blaster_support/ice_manipulation/frozen_aura.json
 */

import type { Power } from '@/types';

export const FrozenAura: Power = {
  "name": "Frozen Aura",
  "internalName": "Frozen_Aura",
  "available": 29,
  "description": "Your mastery of cold enables you to dramatically lower the temperature immediately around you. Foes near you when you perform a Frozen Aura will be caught in a fragile casing of ice. Frozen foes will break free if attacked. Frozen Aura deals no significant damage.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Moderate DMG(Smashing), Foe Sleep",
  "icon": "icemanipulation_frozenaura.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Cold",
      "scale": 1.424,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 1.424,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    },
    "sleep": {
      "mag": 2,
      "scale": 20,
      "table": "Ranged_Sleep"
    }
  }
};
