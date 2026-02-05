/**
 * Lancer Shot
 * Ranged, DMG(Energy), Foe Stun, Special
 *
 * Source: sentinel_ranged/beam_rifle/lancer_shot.json
 */

import type { Power } from '@/types';

export const LancerShot: Power = {
  "name": "Lancer Shot",
  "internalName": "Lancer_Shot",
  "available": 11,
  "description": "You charge up your Beam Rifle and deliver an incredibly focused ray of energy at a nearby foe that deals Superior Energy damage and will briefly stun the target. Lancer Shot will cause additional damage if the target is suffering from the Disintegrating effect. In addition, targets already affected by the Disintegrating effect have a chance to spread to 3 nearby targets. This Disintegrate Spread effect can only hit targets that aren't already affected by the Disintegration effect. Disintegrate Spread causes Energy damage over time.",
  "shortHelp": "Ranged, DMG(Energy), Foe Stun, Special",
  "icon": "beamrifle_lancershot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 60,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 1.9
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 2.12,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.424,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
