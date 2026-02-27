/**
 * Proton Volley
 * Sniper, DMG(Energy), Foe -DEF
 *
 * Source: corruptor_ranged/radiation_blast/proton_volley.json
 */

import type { Power } from '@/types';

export const ProtonVolley: Power = {
  "name": "Proton Volley",
  "internalName": "Proton_Volley",
  "available": 7,
  "description": "Hurls a volley of alpha particles over an extremely long range. Proton Volley can bypass some of a target's defenses and reduce the target's Defense. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Energy), Foe -DEF",
  "icon": "radiationburst_protonvolley.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Corruptor Archetype Sets",
    "Defense Debuff",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
