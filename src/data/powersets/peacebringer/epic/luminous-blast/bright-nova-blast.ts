/**
 * Bright Nova Blast
 * Ranged, Light DMG(Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer_offensive/luminous_blast/bright_nova_blast.json
 */

import type { Power } from '@/types';

export const BrightNovaBlast: Power = {
  "name": "Bright Nova Blast",
  "available": 3,
  "description": "A much more powerful, yet slower version of Bright Nova Bolt. Bright Nova Blast sends a focused blast of Kheldian energy at a foe that can knock him back and reduce his defense. This power is only available while in Bright Nova Form.  Damage: Light. Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Energy), Foe -DEF, Knockback",
  "icon": "luminousblast_gleamingblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Kheldian Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "Bright Nova",
  "damage": {
    "type": "Energy",
    "scale": 1,
    "table": "Ranged_InherentDamage"
  },
  "effects": {
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    },
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    }
  }
};
