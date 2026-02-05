/**
 * Whitecap
 * Ranged (Targeted AoE), DMG(Cold), Foe Knockdown, -Resist(All), Self Teleport, Special
 *
 * Source: mastermind_buff/marine_affinity/whitecap.json
 */

import type { Power } from '@/types';

export const Whitecap: Power = {
  "name": "Whitecap",
  "internalName": "Whitecap",
  "available": 9,
  "description": "You summon a burst of water underfoot that hurls from your present location to a location of your choosing. When you splash down, any enemies in the surrounding area will be swept off their feet, and will experience a damage resistance debuff for a period of time. Enemies close to where you splash down will receive harsher debuffs for a brief time.If you direct a Whitecap on targets inside a Tide Pool, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Cold), Foe Knockdown, -Resist(All), Self Teleport, Special",
  "icon": "marineaffinity_whitecap.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 30,
    "endurance": 22.5,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "teleport": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
