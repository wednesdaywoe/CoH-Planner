/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mace Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_mace_mastery
 */

const EPIC_SENTINEL_MACE_MASTERY = {
  "id": "sentinel_mace_mastery",
  "name": "Mace Mastery",
  "displayName": "Mace Mastery",
  "archetype": "sentinel",
  "description": "Black Scorpion has granted you access to the advanced technology of the Executioner's Mace. The signature weapon of the Bane Spider Executioner, it is not a typical clumsy mace. The Executioner's Mace is capable of firing a variety of energy projectiles and grenades. It can even be modified to summon and command some or Black Scorpion's RV technologies.",
  "icon": "sentinel_mace_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Web Envelope",
      "fullName": "Epic.Sentinel_Mace_Mastery.Web_Envelope",
      "rank": 1,
      "available": 34,
      "description": "The Executioner's Mace can lob a modified Web Grenade. Upon impact, the Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize most targets in a wide area. This device deals toxic damage over time and does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.",
      "shortHelp": "Ranged (Targeted AoE) DoT(Toxic), Immobilize, -Recharge, -Fly, -Jump",
      "icon": "arachnos_patron_rangedaoeimmobilize.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Sentinel) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
        "Ranged AoE Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 50.0,
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 2.0,
        "effectArea": "AoE",
        "radius": 15.0,
        "protection": {
          "immobilize": 3.0
        },
        "damage": {
          "type": "Toxic",
          "scale": 0.2503,
          "table": "Ranged_PvPDamage"
        },
        "resistance": {}
      }
    },
    {
      "name": "Pulverize",
      "fullName": "Epic.Sentinel_Mace_Mastery.Pulverize",
      "rank": 2,
      "available": 34,
      "description": "You are capable of Pulverizing a foe with your Nullifier Mace dealing high damage, causing toxic damage over time. Pulverize will occasionally disorient foes as well.",
      "shortHelp": "Melee, High DMG(Smash), Minor DoT(Toxic), Foe Disorient",
      "icon": "arachnos_patron_pulverize.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Sentinel) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 7.0,
        "recharge": 16.0,
        "endurance": 10.66,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 2.09,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "stun": 2.0
        }
      }
    },
    {
      "name": "Web Cocoon",
      "fullName": "Epic.Sentinel_Mace_Mastery.Web_Cocoon",
      "rank": 3,
      "available": 37,
      "description": "The Bane Mace can fire a more powerful version the common web grenade. The sinewy fibers of this grenade are strong enough to completely Hold one target. Targets able to resist the Hold are still likely to have their attack and movement speed dramatically slowed. Web Cocoon can also bring down flying targets and prevent foes from jumping. You must be level 38 and have one other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, Foe Hold, -Recharge, -Fly, -Jump, Slow, DoT(Toxic)",
      "icon": "arachnos_patron_targetedhold.png",
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
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Toxic",
          "scale": 0.345,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Coordinated Targeting",
      "fullName": "Epic.Sentinel_Mace_Mastery.Focused_Accuracy",
      "rank": 4,
      "available": 40,
      "description": "When this power is activated, the Villain and allies focus their offensive to dramatically improve their accuracy. Additionally, Coordinated Targeting increases the team's Perception, allowing to better see stealthy foes. It also grants resistance to powers that DeBuff Accuracy. Coordinated Targeting is a toggle power and must be activated and deactivated manually. Like all toggle powers, while active, Coordinated Targeting drains Endurance while active. You must be level 41 and have one other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Team +To Hit, +ACC, +Perception, Res(DeBuff To Hit)",
      "icon": "arachnos_patron_teamtohitbuff.png",
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
        "recharge": 10.0,
        "endurance": 0.39,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 25.0,
        "resistance": {}
      }
    },
    {
      "name": "Summon Tarantula",
      "fullName": "Epic.Sentinel_Mace_Mastery.Summon_Tarantula",
      "rank": 5,
      "available": 43,
      "description": "Black Scorpion has granted you an Toxic Tarantula for you to command. Weaver One developed the Tarantula Exoskeleton Armor, which so radically transforms an Arachnos troop that hardly anything human is recognizable. Your access to this Tarantula is very limited. You must be level 44 and have two other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Summon Tarantula: Ranged Moderate DMG(Toxic)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Immobilize",
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
        "activationTime": 3.03,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_mace_mastery'] = EPIC_SENTINEL_MACE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
