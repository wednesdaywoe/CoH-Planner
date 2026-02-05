/**
 * Tar Patch
 * Ranged (Location AoE), Target -Speed, -Res, -Fly
 *
 * Source: defender_buff/dark_miasma/tar_patch.json
 */

import type { Power } from '@/types';

export const TarPatch: Power = {
  "name": "Tar Patch",
  "internalName": "Tar_Patch",
  "available": 0,
  "description": "Drops a large patch of viscous Negative Energy which dramatically slows down enemies that run through it and reduces their damage resistance. Affected targets stuck in the Tar Patch cannot jump or fly.",
  "shortHelp": "Ranged (Location AoE), Target -Speed, -Res, -Fly",
  "icon": "darkmiasma_tarpatch.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 90,
    "recharge": 90,
    "endurance": 7.8,
    "castTime": 3.1
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Tar Patch",
      "powers": [
        "Redirects.Dark_Miasma.Tar"
      ],
      "duration": 45
    }
  }
};
