/**
 * Tactical Training: Vengeance
 * Ranged (Targeted AoE), Teammates +DMG, +To Hit, +DEF(All), Res(Effects)
 *
 * Source: arachnos-widow/fortunata-teamwork
 */

import type { Power } from '@/types';

export const TacticalTrainingVengeance: Power = {
  "name": "Tactical Training: Vengeance",
  "available": 27,
  "description": "The loss of a comrade enrages the team. When a teammate is defeated in combat, activate this power to grant you and your teammates a bonus to chance to hit, Damage and Defense to all attacks. A Vengeful team has no fear, and Vengeance protects you and your Teammates from Fear effects. It also gives you and your team great resistance to Sleep, Hold, Disorient, Immobilize, Confuse, Taunt, Placate and Knockback. This power does not stack with multiple castings.",
  "shortHelp": "Ranged (Targeted AoE), Teammates +DMG, +To Hit, +DEF(All), Res(Effects)",
  "icon": "fortunatateamwork_tacticaltrainingvengeance.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Range",
    "Healing",
    "ToHit",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Healing",
    "To Hit Buff"
  ],
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 300,
    "castTime": 1.17,
    "radius": 100,
    "maxTargets": 255
  },
  "targetType": "Leaguemate (Dead)"
};
