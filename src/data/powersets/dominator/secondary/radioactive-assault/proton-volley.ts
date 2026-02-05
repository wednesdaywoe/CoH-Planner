/**
 * Proton Volley
 * Sniper, Extreme DMG(Energy), Foe -DEF
 *
 * Source: dominator_assault/radioactive_assault/proton_volley.json
 */

import type { Power } from '@/types';

export const ProtonVolley: Power = {
  "name": "Proton Volley",
  "internalName": "Proton_Volley",
  "available": 27,
  "description": "Hurls a volley of alpha particles over an extremely long range. Proton Volley can bypass some of a target's defenses and reduce the target's Defense. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Energy), Foe -DEF",
  "icon": "radioactiveassault_protonvolley.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
