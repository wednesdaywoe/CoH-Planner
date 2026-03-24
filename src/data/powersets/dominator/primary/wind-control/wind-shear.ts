/**
 * Wind Shear
 * PBAoE (Toggle), -Speed (Foe, All), -Fly(Foe), -ToHit(Foe), -DMG(Foe, All)
 *
 * Source: dominator_control/wind_control/wind_shear.json
 */

import type { Power } from '@/types';

export const WindShear: Power = {
  "name": "Wind Shear",
  "internalName": "Wind_Shear",
  "available": 5,
  "description": "You create a sphere of high speed winds around yourself. This significantly slows the movement of any enemies caught within the sphere and makes their attacks less likely to hit. Damage potential is also reduced. Flying foes are brought to the ground. This power neither builds nor releases Pressure, but does have a continuous Endurance cost.Recharge: Slow.",
  "shortHelp": "PBAoE (Toggle), -Speed (Foe, All), -Fly(Foe), -ToHit(Foe), -DMG(Foe, All)",
  "icon": "windcontrol_windshear.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 15,
    "endurance": 2.6,
    "castTime": 2.03,
    "activatePeriod": 2,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Slow Movement",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "requires": "char>accesslevel >= 0"
};
