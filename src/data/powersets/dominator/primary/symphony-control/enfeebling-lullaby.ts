/**
 * Enfeebling Lullaby
 * Ranged (Cone), DMG(Psionic), Foe Deep Sleep, -DMG
 *
 * Source: dominator_control/symphony_control/enfeebling_lullaby.json
 */

import type { Power } from '@/types';

export const EnfeeblingLullaby: Power = {
  "name": "Enfeebling Lullaby",
  "internalName": "Enfeebling_Lullaby",
  "available": 11,
  "description": "A song that will put even elephants to sleep. Enfeebling Lullaby will relax foes, causing them to sleep and their attacks will do reduced damage for some time.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "Ranged (Cone), DMG(Psionic), Foe Deep Sleep, -DMG",
  "icon": "symphonycontrol_sleepst.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 70,
    "arc": 0.7854,
    "recharge": 45,
    "endurance": 15.6,
    "castTime": 2.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Ranged AoE Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.2,
    "table": "Ranged_Damage"
  },
  "effects": {
    "damageDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Dam"
    },
    "sleep": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Sleep"
    }
  }
};
