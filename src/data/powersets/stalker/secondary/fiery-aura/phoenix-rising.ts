/**
 * Phoenix Rising
 * Self Rez, Special
 *
 * Source: stalker_defense/fiery_aura/rise_of_the_phoenix.json
 */

import type { Power } from '@/types';

export const PhoenixRising: Power = {
  "name": "Phoenix Rising",
  "internalName": "Rise_of_the_Phoenix",
  "available": 29,
  "description": "If you are defeated, you can rise from the ashes. The fiery resurrection blasts nearby foes with an explosion and knocks them down and Disorients them. You will revive with about half of your Hit Points and Endurance. Gift of the Phoenix will leave you invulnerable for a brief time, and protected from XP Debt for 90 seconds.You can also use this power even if you have not been defeated, with weakend effects. The closer you are to being defeated, the stronger the effects will be. You need to be under 75% health to activate this power.Damage: Extreme.Recharge: Very Long.",
  "shortHelp": "Self Rez, Special",
  "icon": "flamingshield_riseofthephoenix.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "castTime": 2
  },
  "allowedEnhancements": [
    "Stun",
    "Recharge",
    "Healing",
    "Damage"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
