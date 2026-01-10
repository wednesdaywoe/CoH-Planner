/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Weapon Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_ninja_mastery
 */

const EPIC_SENTINEL_NINJA_MASTERY = {
  "id": "sentinel_ninja_mastery",
  "name": "Weapon Mastery",
  "displayName": "Weapon Mastery",
  "archetype": "sentinel",
  "description": "A Ninja is a master of many tools and weapons, from the deadly Ninja Blade to deadly Tashibishi, in addition to various poisons.",
  "icon": "sentinel_ninja_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Tashibishi",
      "fullName": "Epic.Sentinel_Ninja_Mastery.Caltrops",
      "rank": 1,
      "available": 34,
      "description": "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any villains that pass over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.",
      "shortHelp": "Ranged (Location AoE), DoT(Lethal), Foe -Speed",
      "icon": "ninjatools_slow.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage"
      ],
      "allowedSetCategories": [
        "Ranged AoE Damage",
        "Sentinel Archetype Sets",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 25.0,
        "recharge": 45.0,
        "endurance": 9.75,
        "activationTime": 1.07,
        "effectArea": "Location"
      }
    },
    {
      "name": "Sting of the Wasp",
      "fullName": "Epic.Sentinel_Ninja_Mastery.Sting_of_the_Wasp",
      "rank": 2,
      "available": 34,
      "description": "You perform a standard attack with your Ninja Blade. This attack is slower than Gambler's Cut, but deals more lethal damage. Sting of the Wasp can reduce a target's Defense, making them easier to hit.",
      "shortHelp": "Melee, DMG(Lethal), Foe -Def",
      "icon": "ninjatools_katanalight.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate Defense Debuff",
        "Defense Debuff",
        "Melee Damage",
        "Sentinel Archetype Sets",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 7.0,
        "recharge": 10.0,
        "endurance": 7.54,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Lethal",
          "scale": 1.619,
          "table": "Melee_PvPDamage"
        },
        "defense": {
          "all": {
            "scale": 1.0,
            "table": "Melee_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Paralyzing Dart",
      "fullName": "Epic.Sentinel_Ninja_Mastery.Paralizing_Dart",
      "rank": 3,
      "available": 37,
      "description": "Paralyzing Darts do minor toxic damage over time and incapacitate your foe. You must be level 38 and have one other Weapon Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Toxic), Foe Hold",
      "icon": "ninjatools_hold.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Hold",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Holds",
        "Ranged Damage",
        "Sentinel Archetype Sets",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Toxic",
          "scale": 0.6025,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "The Lotus Drops",
      "fullName": "Epic.Sentinel_Ninja_Mastery.The_Lotus_Drops",
      "rank": 4,
      "available": 40,
      "description": "You perform The Lotus Drops maneuver, attacking all foes in melee range. This attack wounds your opponents, causing them to take moderate damage over time and reduces their Defense. You must be level 41 and have one other Weapon Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE Melee, DMG(Lethal), Foe -Def",
      "icon": "ninjatools_katanaaoe.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate Defense Debuff",
        "Defense Debuff",
        "Melee AoE Damage",
        "Sentinel Archetype Sets",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "recharge": 28.0,
        "endurance": 16.25,
        "activationTime": 1.83,
        "effectArea": "AoE",
        "radius": 8.0,
        "damage": {
          "type": "Lethal",
          "scale": 1.2732,
          "table": "Melee_PvPDamage"
        },
        "defense": {
          "all": {
            "scale": 1.0,
            "table": "Melee_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Kemuridama",
      "fullName": "Epic.Sentinel_Ninja_Mastery.Kemuridama",
      "rank": 5,
      "available": 43,
      "description": "You activate a kemuridama smoke bomb at your feet. The resulting flash of light and smoke can briefly distract your foes and Placate them so they can no longer find or target you. A mixture of toxins in the smoke also weaken your foes, reducing how much damage they inflict in addition to lowering their chance to hit. You must be level 44 and have two other Weapon Mastery Powers before selecting this power.<br>",
      "shortHelp": "PBAoE, Foe Placate -DMG -To Hit",
      "icon": "ninjatools_placate.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Threat Duration",
        "To Hit Debuff"
      ],
      "effects": {
        "accuracy": 1.4,
        "recharge": 120.0,
        "endurance": 19.5,
        "activationTime": 1.83,
        "effectArea": "AoE",
        "radius": 20.0
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_ninja_mastery'] = EPIC_SENTINEL_NINJA_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
