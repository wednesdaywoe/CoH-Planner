/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Scrapper
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\darkness_mastery
 */

const EPIC_DARKNESS_MASTERY = {
  "id": "darkness_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "scrapper",
  "description": "You have Mastery over Darkness to control and blast your foes.",
  "icon": "darkness_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Umbral Torrent",
      "fullName": "Epic.Darkness_Mastery.Torrent",
      "rank": 1,
      "available": 34,
      "description": "You summon a wave of mire that sweeps away foes within its arc. The attack deals minimal Negative Energy damage, but sends foes flying and reduces their chance to hit.",
      "shortHelp": "Ranged (Cone), DMG(Smashing), Foe -To Hit, Knockback",
      "icon": "darkcast_torrent.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker)",
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
        "Knockback",
        "Ranged AoE Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 30.0,
        "endurance": 17.94,
        "activationTime": 1.03,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.5236,
        "damage": {
          "type": "Fire",
          "scale": 0.4533,
          "table": "Melee_Damage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Petrifying Gaze",
      "fullName": "Epic.Darkness_Mastery.Petrifying_Gaze",
      "rank": 2,
      "available": 34,
      "description": "Petrifies a single targeted foe with a terrifying gaze. The victim is Held and defenseless.",
      "shortHelp": "Ranged, DMG(Negative), Foe Hold",
      "icon": "darknessmastery_petrifyinggaze.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker)",
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
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Dark Blast",
      "fullName": "Epic.Darkness_Mastery.Dark_Blast",
      "rank": 3,
      "available": 37,
      "description": "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's Accuracy. You must be level 38 and have one other Dark Mastery Powers before selecting this power",
      "shortHelp": "Ranged, DMG(Negative), Foe -ACC",
      "icon": "darkcast_darkblast.png",
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
      "fullName": "Epic.Darkness_Mastery.Night_Fall",
      "rank": 4,
      "available": 40,
      "description": "Unleashes a cone shaped burst of particles from the Netherworld. All targets within the modest range of this power take Negative Energy damage and have a reduced chance to hit. You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Negative), Foe -To Hit",
      "icon": "darkcast_nightfall.png",
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
          "type": "Fire",
          "scale": 0.0495,
          "table": "Melee_Damage"
        }
      }
    },
    {
      "name": "Tenebrous Tentacles",
      "fullName": "Epic.Darkness_Mastery.Tenebrous_Tentacles",
      "rank": 5,
      "available": 43,
      "description": "You can create a cone shaped rift to the Netherworld that allows its native creatures to slip their oily Tentacles into our reality. These creatures will snare all foes within range, Immobilizing them while the Tentacles drain their life and reduce their Accuracy. You must be level 44 and have two other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Negative), Foe Immobilize, -ACC",
      "icon": "darkcast_tenebroustentacles.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Ranged AoE Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 1.67,
        "effectArea": "Cone",
        "radius": 50.0,
        "arc": 0.5236,
        "damage": {
          "type": "Fire",
          "scale": 0.0368,
          "table": "Melee_Damage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['darkness_mastery'] = EPIC_DARKNESS_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
