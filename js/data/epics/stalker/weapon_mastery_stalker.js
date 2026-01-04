/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Weapon Mastery
 * Archetype: Stalker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\weapon_mastery_stalker
 */

const EPIC_WEAPON_MASTERY_STALKER = {
  "id": "weapon_mastery_stalker",
  "name": "Weapon Mastery",
  "displayName": "Weapon Mastery",
  "archetype": "stalker",
  "description": "Devices are equipment you have constructed for use in combat. By using them strategically, you can gain a great tactical advantage. Traps, non-lethal munitions, and demolitions are available in this power set.",
  "icon": "weapon_mastery_stalker_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Web Grenade",
      "fullName": "Epic.Weapon_Mastery_Stalker.Web_Grenade",
      "rank": 1,
      "available": 34,
      "description": "Upon impact, the Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize most targets. This non-lethal device deals no damage and does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.",
      "shortHelp": "Ranged, Target Immobilize, -Recharge, -Fly",
      "icon": "gadgets_webgrenade.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Stalker",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Immobilize",
        "Ranged Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.37,
        "effectArea": "SingleTarget",
        "protection": {
          "immobilize": 3.0
        },
        "damage": {
          "type": "Smashing",
          "scale": 1.679,
          "table": "Melee_PvPDamage"
        },
        "resistance": {}
      }
    },
    {
      "name": "Physical Perfection",
      "fullName": "Epic.Weapon_Mastery_Stalker.Caltrops",
      "rank": 2,
      "available": 34,
      "description": "By achieving perfect harmony of body, mind and spirit you are able to regenerate health and endurance slightly faster than normal. This power is always active and consumes no endurance.",
      "shortHelp": "Auto: Self, +Regeneration, +Recovery",
      "icon": "bodymastery_physicalperfection.png",
      "powerType": "Auto",
      "requires": "$archetype == @Class_Stalker",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Heal"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "regeneration": {
          "scale": 0.2,
          "table": "Melee_Ones"
        },
        "recovery": {
          "scale": 0.125,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Shuriken",
      "fullName": "Epic.Weapon_Mastery_Stalker.Shuriken",
      "rank": 3,
      "available": 37,
      "description": "A classic small throwing weapon, you can throw Shurikens at a pretty fast rate of fire. You must be level 38 and have one other Weapon Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Lethal)",
      "icon": "weaponmastery_shuriken.png",
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
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 70.0,
        "recharge": 6.0,
        "endurance": 5.46,
        "activationTime": 1.07,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Lethal",
          "scale": 1.389,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Targeting Drone",
      "fullName": "Epic.Weapon_Mastery_Stalker.Targeting_Drone",
      "rank": 4,
      "available": 40,
      "description": "When this device is activated, the small Targeting Drone hovers around your head and emits targeting laser sights. The lasers can dramatically improve your chance to hit and increase your perception, allowing you to better see stealthy foes. Targeting Drone also grants you resistance to powers that debuff your chance to hit. This is a toggle power and must be activated and deactivated manually. Like all toggle powers, Targeting Drone costs endurance while active. You must be level 41 and have one other Weapon Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +To Hit, +ACC, +Perception, Res(DeBuff To Hit)",
      "icon": "weaponmastery_targetingdrone.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "To Hit Buff"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 20.0,
        "endurance": 0.195,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "resistance": {}
      }
    },
    {
      "name": "Exploding Shuriken",
      "fullName": "Epic.Weapon_Mastery_Stalker.Exploding_Shuriken",
      "rank": 5,
      "available": 43,
      "description": "This small throwing star is rigged to explode on impact. You must be level 44 and have two other Weapon Mastery Powers before selecting this power.<br>",
      "shortHelp": "Ranged (Targeted AoE), DMG(Lethal)",
      "icon": "weaponmastery_explodingshuriken.png",
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
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.0,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Lethal",
          "scale": 0.7323,
          "table": "Melee_PvPDamage"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['weapon_mastery_stalker'] = EPIC_WEAPON_MASTERY_STALKER;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
