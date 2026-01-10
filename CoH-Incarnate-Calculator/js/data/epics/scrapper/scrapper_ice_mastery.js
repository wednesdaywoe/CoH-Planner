/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Ice Mastery
 * Archetype: Scrapper
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\scrapper_ice_mastery
 */

const EPIC_SCRAPPER_ICE_MASTERY = {
  "id": "scrapper_ice_mastery",
  "name": "Ice Mastery",
  "displayName": "Ice Mastery",
  "archetype": "scrapper",
  "description": "You have Mastery over Ice and snow to blast your foes and control your foes.",
  "icon": "arctic_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Ice Bolt",
      "fullName": "Epic.Scrapper_Ice_Mastery.Ice_Bolt",
      "rank": 1,
      "available": 34,
      "description": "Ice Bolt quickly pelts an enemy with small icy daggers; their chill Slows a foe's attacks and movement for a time. Fast, but little damage.",
      "shortHelp": "Ranged, DMG(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_icebolt.png",
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
        "Ranged Damage",
        "Slow Movement",
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
          "type": "Cold",
          "scale": 1.2602,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Frozen Spear",
      "fullName": "Epic.Scrapper_Ice_Mastery.Frozen_Spear",
      "rank": 2,
      "available": 34,
      "description": "A focused spear of ice that can travel great distances with high Accuracy. Frozen Spear slows its target and has a high chance of encasing them in a frail block of ice, but can break free if disturbed. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast.",
      "shortHelp": "Sniper, DMG(Cold), Foe Sleep, -Recharge, -SPD",
      "icon": "ice_mastery_frozenspear.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Range",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged Damage",
        "Sleep",
        "Slow Movement",
        "Sniper Attacks",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 150.0,
        "recharge": 24.0,
        "endurance": 17.94,
        "activationTime": 1.33,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Shiver",
      "fullName": "Epic.Scrapper_Ice_Mastery.Shiver",
      "rank": 3,
      "available": 37,
      "description": "You can blast forth a wide cone of chilling air that dramatically Slows the movement and attack rate of nearby foes. You must be level 38 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), Foe -SPD, -Recharge",
      "icon": "ice_mastery_shiver.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "recharge": 24.0,
        "endurance": 15.6,
        "activationTime": 2.17,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 2.3562
      }
    },
    {
      "name": "Frigid Wind",
      "fullName": "Epic.Scrapper_Ice_Mastery.Frigid_Wind",
      "rank": 4,
      "available": 40,
      "description": "Unleashes a cone of icy wind that can Slow your opponents' movement and attacks. You must be level 41 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Close (Cone), DoT(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_frigidwind.png",
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
        "Ranged AoE Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 36.0,
        "endurance": 21.06,
        "activationTime": 1.6,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.5236,
        "damage": {
          "type": "Cold",
          "scale": 0.1958,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Ice Elemental",
      "fullName": "Epic.Scrapper_Ice_Mastery.Ice_Elemental",
      "rank": 5,
      "available": 43,
      "description": "You can create a very powerful entity of animated ice at a targeted location. Ice Elemental possesses several ice powers to attack any nearby foes and can be healed and buffed like any teammate. You must be level 44 and have two other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Summon Ice Elemental: Melee DMG(Lethal/Cold)",
      "icon": "ice_mastery_iceelemental.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Pet Damage",
        "Recharge Intensive Pets",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 900.0,
        "endurance": 26.0,
        "activationTime": 1.87,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['scrapper_ice_mastery'] = EPIC_SCRAPPER_ICE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
