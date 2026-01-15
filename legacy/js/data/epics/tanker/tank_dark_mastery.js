/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Tanker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\tank_dark_mastery
 */

const EPIC_TANK_DARK_MASTERY = {
  "id": "tank_dark_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "tanker",
  "description": "You have Mastery over Darkness to control and blast your foes.",
  "icon": "sentinel_dark_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Penumbral Grasp",
      "fullName": "Epic.Tank_Dark_Mastery.Penumbral_Grasp",
      "rank": 1,
      "available": 34,
      "description": "Penumbral Grasp deals moderate Negative Energy damage, reduces their chance to hit and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.",
      "shortHelp": "Ranged, DOT(Negative), Foe Immobilize, -To Hit",
      "icon": "dark_mastery_penumbralgrasp.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Immobilize",
        "Ranged Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 8.0,
        "endurance": 8.405,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Negative",
          "scale": 0.3778,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Petrifying Gaze",
      "fullName": "Epic.Tank_Dark_Mastery.Petrifying_Gaze",
      "rank": 2,
      "available": 34,
      "description": "Petrifies a single targeted foe with a terrifying gaze. The victim is Held and defenseless.",
      "shortHelp": "Ranged, DMG(Negative), Foe Hold",
      "icon": "dark_mastery_petrifyinggaze.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
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
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Negative",
          "scale": 2.529,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Dark Blast",
      "fullName": "Epic.Tank_Dark_Mastery.Dark_Blast",
      "rank": 3,
      "available": 37,
      "description": "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's Accuracy. You must be level 35 and have Torrent or Petrifying Gaze before selecting this power. You must be level 38 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Negative), Foe -ACC",
      "icon": "dark_mastery_darkblast.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Ranged Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 0.5357,
          "table": "Melee_Damage"
        }
      }
    },
    {
      "name": "Night Fall",
      "fullName": "Epic.Tank_Dark_Mastery.Night_Fall",
      "rank": 4,
      "available": 40,
      "description": "Unleashes a cone shaped burst of particles from the Netherworld. All targets within the modest range of this power take Negative Energy damage and have a reduced chance to hit. You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Negative), Foe -To Hit",
      "icon": "dark_mastery_nightfall.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Ranged AoE Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 20.0,
        "endurance": 16.38,
        "activationTime": 2.0,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.3491,
        "damage": {
          "type": "Negative",
          "scale": 0.0938,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Tar Patch",
      "fullName": "Epic.Tank_Dark_Mastery.Tar_Patch",
      "rank": 5,
      "available": 43,
      "description": "Drops a large patch of viscous Negative Energy which dramatically slows down enemies that run through it and reduces their damage resistance. Affected targets stuck in the Tar Patch cannot jump or fly. You must be level 44 and have two other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Location AoE), Target -Speed, -Res, -Fly",
      "icon": "dark_mastery_tarpatch.png",
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
        "Slow Movement"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 180.0,
        "endurance": 9.75,
        "activationTime": 3.1,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['tank_dark_mastery'] = EPIC_TANK_DARK_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
