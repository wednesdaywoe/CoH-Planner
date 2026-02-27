/**
 * Entropic Aura
 * Toggle: Self +Res(Knockback, Repel, Disorient, Hold, Sleep, Immobilize, Teleport, DeBuff DEF), Self +Recharge, Foe -Recharge
 *
 * Source: brute_defense/energy_aura/entropy_shield.json
 */

import type { Power } from '@/types';

export const EntropicAura: Power = {
  "name": "Entropic Aura",
  "internalName": "Entropy_Shield",
  "available": 9,
  "description": "Entropic Aura diminishes and dampens the energy of controlling type effects. The shield makes you resistant to Knockback, Repel, Disorient, Hold, Sleep, Immobilization, and enemy Teleportation for as long as you can keep this toggle power active. Entropic Aura also grants you good resistance to Defense Debuffs as well as providing you a recharge bonus for each foe in melee, up to the first 10 foes. Foes that get close to the user will have their own recharge rate reduced and may be taunted.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Res(Knockback, Repel, Disorient, Hold, Sleep, Immobilize, Teleport, DeBuff DEF), Self +Recharge, Foe -Recharge",
  "icon": "energyaura_entropy.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 10,
    "endurance": 0.52,
    "castTime": 0.73,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.05,
      "table": "Melee_Ones"
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    }
  }
};
