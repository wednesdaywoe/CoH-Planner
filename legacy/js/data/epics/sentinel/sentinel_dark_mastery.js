/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_dark_mastery
 */

const EPIC_SENTINEL_DARK_MASTERY = {
  "id": "sentinel_dark_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "sentinel",
  "description": "You have Mastery over Darkness to control and blast your foes.",
  "icon": "sentinel_dark_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Netherworld Tentacles",
      "fullName": "Epic.Sentinel_Dark_Mastery.Netherworld_Tentacles",
      "rank": 1,
      "available": 34,
      "description": "You can create a cone shaped rift to the Netherworld that allows its native creatures to slip their oily Tentacles into our reality. These creatures will snare all foes within range, Immobilizing them while the Tentacles drain their life and reduce their chance to hit.",
      "shortHelp": "Ranged (Cone), DoT(Negative), Foe Immobilize, -To Hit, -Fly",
      "icon": "darknesscontrol_livingshadows.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
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
          "type": "Negative",
          "scale": 0.2166,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Smite",
      "fullName": "Epic.Sentinel_Dark_Mastery.Smite",
      "rank": 2,
      "available": 34,
      "description": "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a Smite that deals more damage than Shadow Punch, but has a longer recharge time. Smite clouds the target's vision, lowering their chance to hit for a short time.",
      "shortHelp": "Melee, DMG(Smash/Negative), Foe -To Hit",
      "icon": "darknesscontrol_punch.png",
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
        "Accurate To-Hit Debuff",
        "Melee Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 12.0,
        "endurance": 8.58,
        "activationTime": 0.97,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Negative",
          "scale": 1.1693,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Netherworld Grasp",
      "fullName": "Epic.Sentinel_Dark_Mastery.Netherworld_Grasp",
      "rank": 3,
      "available": 37,
      "description": "Mastery over the forces of the Netherworld allows you to summon dark tentacles to render your target helpless and inflicting moderate negative energy damage. Even if the target is powerful enough to resist the power's hold effect they will have their chance to hit reduced. You must be level 38 and have one other Dark Mastery Powers before selecting this power.<br>",
      "shortHelp": "Ranged, DMG(Negative), Foe Hold, -To Hit",
      "icon": "darknesscontrol_darkgrasp.png",
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
        "Accurate To-Hit Debuff",
        "Holds",
        "Ranged Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 2.07,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 4.0
        },
        "damage": {
          "type": "Negative",
          "scale": 2.809,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Engulfing Darkness",
      "fullName": "Epic.Sentinel_Dark_Mastery.Engulfing_Darkness",
      "rank": 4,
      "available": 40,
      "description": "You release a burst of negative energy to foes around you dealing moderate Negative Energy damage, reducing their chance to hit and sapping their health over time. You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE, DMG(Negative), Foe -To Hit, DoT(Negative)",
      "icon": "darknesscontrol_pbaoe.png",
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
        "Accurate To-Hit Debuff",
        "Melee AoE Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 36.0,
        "endurance": 21.06,
        "activationTime": 2.0,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Negative",
          "scale": 0.9969,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Darkest Night",
      "fullName": "Epic.Sentinel_Dark_Mastery.Darkest_Night",
      "rank": 5,
      "available": 43,
      "description": "While active, you channel Negative Energy onto a targeted foe. Darkest Night decreases the damage potential and chance to hit of the target, and all foes nearby, as long as you keep the power active. You must be level 44 and have two other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -DMG -To Hit",
      "icon": "darknesscontrol_debuff.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge"
      ],
      "allowedSetCategories": [
        "To Hit Debuff"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 70.0,
        "recharge": 20.0,
        "endurance": 0.325,
        "activationTime": 3.17,
        "effectArea": "AoE",
        "radius": 15.0
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_dark_mastery'] = EPIC_SENTINEL_DARK_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
