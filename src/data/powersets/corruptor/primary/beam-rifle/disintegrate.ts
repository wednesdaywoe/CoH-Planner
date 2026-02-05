/**
 * Disintegrate
 * Ranged, DoT(Energy), Foe -Regen, Special
 *
 * Source: corruptor_ranged/beam_rifle/disintegrate.json
 */

import type { Power } from '@/types';

export const Disintegrate: Power = {
  "name": "Disintegrate",
  "internalName": "Disintegrate",
  "available": 5,
  "description": "You fire a stream of energy at your foe which causes them to slowly disintegrate and suffer High Energy damage over time. Even after the damage over time effect wears off the target will have their regeneration rate reduced and suffer from the Disintegration effect for an additional period of time. Using Beam Rifle powers on targets affected by Disintegrate will inflict additional effects. Additionally if Single Shot, Charged Shot, Lancer Shot and Penetrating Ray are used on a target suffering from Disintegrating, they have a chance to cause this effect to spread to up 3 nearby targets that aren't already suffering from Disintegrating. Targets affected by this Disintegrate Spread will also suffer some Minor Energy damage over time.",
  "shortHelp": "Ranged, DoT(Energy), Foe -Regen, Special",
  "icon": "beamrifle_disintegrate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.9
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.216,
      "table": "Ranged_Damage",
      "duration": 10.5,
      "tickRate": 1.11
    },
    {
      "type": "Energy",
      "scale": 2.156,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "regenDebuff": {
      "scale": 1.5,
      "table": "Ranged_Ones"
    }
  }
};
