/**
 * Frozen Aura
 * PBAoE, DMG(Cold), Foe Sleep
 *
 * Source: scrapper_melee/ice_melee/frozen_aura.json
 */

import type { Power } from '@/types';

export const FrozenAura: Power = {
  "name": "Frozen Aura",
  "internalName": "Frozen_Aura",
  "available": 25,
  "description": "Your mastery of cold enables you to dramatically lower the temperature immediately around you. When you perform a Frozen Aura, nearby foes will be frozen within a fragile casing of ice and suffer a moderate amount of cold damage. These frozen foes will break free if attacked. Frozen Aura deals moderate damage.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.",
  "shortHelp": "PBAoE, DMG(Cold), Foe Sleep",
  "icon": "icyonslaught_frozenaura.png",
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
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
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
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Cold",
      "scale": 1.424,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Cold",
      "scale": 1.424,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 1.424,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Cold",
      "scale": 1.424,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.6408,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "sleep": {
      "mag": 2,
      "scale": 10,
      "table": "Melee_Sleep"
    }
  }
};
