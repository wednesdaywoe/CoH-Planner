/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mace Mastery
 * Archetype: Corruptor
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\corruptor_mace_mastery
 */

const EPIC_CORRUPTOR_MACE_MASTERY = {
  "id": "corruptor_mace_mastery",
  "name": "Mace Mastery",
  "displayName": "Mace Mastery",
  "archetype": "corruptor",
  "description": "Black Scorpion has granted you access to the advanced technology of the Nullifier Mace. The signature weapon of the Bane Spider Commandos, it is not a typical clumsy mace. The Bane Mace is capable of firing a variety of energy projectiles and grenades. It can even be modified to summon and command some or Black Scorpion's RV technologies.",
  "icon": "corruptor_mace_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Web Envelope",
      "fullName": "Epic.Corruptor_Mace_Mastery.Web_Envelope",
      "rank": 1,
      "available": 34,
      "description": "The Executioner's Mace can lob a modified Web Grenade. Upon impact, the Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize most targets in a wide area. This device deals toxic damage over time and does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.",
      "shortHelp": "Ranged (Targeted AoE) DoT(Toxic), Immobilize, -Recharge, -Fly, -Jump",
      "icon": "arachnos_patron_rangedaoeimmobilize.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Corruptor) || ($archetype == @Class_Defender))",
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
      "name": "Scorpion Shield",
      "fullName": "Epic.Corruptor_Mace_Mastery.Scorpion_Shield",
      "rank": 2,
      "available": 34,
      "description": "Black Scorpion's technologies are impressive indeed. This energy shield grants you Defense to Lethal, Smashing and Energy attacks, as well as improves your damage resistance to Toxic damage.",
      "shortHelp": "Toggle: Self, +Def(Smash,Lethal,Energy), +Res(Toxic)",
      "icon": "arachnos_patron_defensebuff.png",
      "powerType": "Toggle",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Corruptor) || ($archetype == @Class_Defender))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Defense Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 8.0,
        "endurance": 0.1625,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "resistance": {
          "toxic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Focused Accuracy",
      "fullName": "Epic.Corruptor_Mace_Mastery.Focused_Accuracy",
      "rank": 3,
      "available": 37,
      "description": "When this power is activated, the Villain focuses their senses to dramatically improve their range and accuracy. Additionally, Focused Accuracy increase your Perception, allowing you to better see stealthy foes. It also grants you resistance to powers that DeBuff your Accuracy. Focused Accuracy is a toggle power and must be activated and deactivated manually. Like all toggle powers, while active, Focused Accuracy drains Endurance while active. You must be level 38 and have one other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +To Hit, +ACC, +Perception, Res(DeBuff To Hit)",
      "icon": "arachnos_patron_selftohitbuff.png",
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
        "endurance": 0.195,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "resistance": {}
      }
    },
    {
      "name": "Web Cocoon",
      "fullName": "Epic.Corruptor_Mace_Mastery.Web_Cocoon",
      "rank": 4,
      "available": 40,
      "description": "The Bane Mace can fire a more powerful version the common web grenade. The sinewy fibers of this grenade are strong enough to completely Hold one target. Targets able to resist the Hold are still likely to have their attack and movement speed dramatically slowed. Web Cocoon can also bring down flying targets and prevent foes from jumping. You must be level 41 and have one other Mace Mastery Powers before selecting this power.",
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
      "name": "Summon Disruptor",
      "fullName": "Epic.Corruptor_Mace_Mastery.Summon_Disruptor",
      "rank": 5,
      "available": 43,
      "description": "Black Scorpion has granted you an Arachnobot Disruptor for you to command. Arachnobots were created by Arachnos Orb Weavers to take down particularly powerful super-powered threats. Your access to this Arachnobot is very limited. You must be level 44 and have two other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Summon Arachnobot: Ranged DMG(Energy)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Holds",
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
    EPIC_POOLS['corruptor_mace_mastery'] = EPIC_CORRUPTOR_MACE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
