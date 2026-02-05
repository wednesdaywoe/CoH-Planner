/**
 * Kuji-In Sha
 * Self Heal, Res(Toxic)
 *
 * Source: stalker_defense/ninjitsu/kuji-in_sha.json
 */

import type { Power } from '@/types';

export const KujiInSha: Power = {
  "name": "Kuji-In Sha",
  "internalName": "Kuji-In_Sha",
  "available": 19,
  "description": "Kuji-In Sha invokes the power of Sha, or healing. Focusing your inner power, you can heal your body of its wounds and leave yourself resistant to the effects of Toxic damage for a while.Recharge: Slow.",
  "shortHelp": "Self Heal, Res(Toxic)",
  "icon": "ninjitsu_kujinsha.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 2.5,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
