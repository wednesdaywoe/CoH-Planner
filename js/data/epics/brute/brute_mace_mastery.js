/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mace Mastery
 * Archetype: Brute
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\brute_mace_mastery
 */

const EPIC_BRUTE_MACE_MASTERY = {
  "id": "brute_mace_mastery",
  "name": "Mace Mastery",
  "displayName": "Mace Mastery",
  "archetype": "brute",
  "description": "Black Scorpion has granted you access to the advanced technology of the Executioner's Mace. The signature weapon of the Bane Spider Executioner, it is not a typical clumsy mace. The Executioner's Mace is capable of firing a variety of energy projectiles and grenades. It can even be modified to summon and command some or Black Scorpion's RV technologies.",
  "icon": "brute_mace_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mace Blast",
      "fullName": "Epic.Brute_Mace_Mastery.Mace_Blast",
      "rank": 1,
      "available": 34,
      "description": "The Executioner's Mace is capable of firing a powerful bolt of kinetic energy. The blast is powerful enough that it may knock some foes back. Arachnos Bane Spider Troopers call this the Power Blast. The Arbiters who invented it scoff at this simple term.",
      "shortHelp": "Ranged, DMG(Energy), Foe Knockback",
      "icon": "arachnos_patron_targetedrangedhighdmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Brute) || ($archetype == @Class_Tanker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Knockback",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 80.0,
        "recharge": 12.0,
        "endurance": 8.58,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 2.16,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Web Envelope",
      "fullName": "Epic.Brute_Mace_Mastery.Web_Envelope",
      "rank": 2,
      "available": 34,
      "description": "The Executioner's Mace can lob a modified Web Grenade. Upon impact, the Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize most targets in a wide area. This device deals toxic damage over time and does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.",
      "shortHelp": "Ranged (Targeted AoE) DoT(Toxic), Immobilize, -Recharge, -Fly, -Jump",
      "icon": "arachnos_patron_rangedaoeimmobilize.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Brute) || ($archetype == @Class_Tanker))",
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
      "name": "Focused Accuracy",
      "fullName": "Epic.Brute_Mace_Mastery.Focused_Accuracy",
      "rank": 3,
      "available": 37,
      "description": "When this power is activated, the Villain focuses their senses to dramatically improve their accuracy. Additionally, Focused Accuracy increase your Perception, allowing you to better see stealthy foes. It also grants you resistance to powers that DeBuff your Accuracy. Focused Accuracy is a toggle power and must be activated and deactivated manually. Like all toggle powers, while active, Focused Accuracy drains Endurance while active. You must be level 38 and have one other Mace Mastery Powers before selecting this power.",
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
      "name": "Disruptor Blast",
      "fullName": "Epic.Brute_Mace_Mastery.Disruptor_Blast",
      "rank": 4,
      "available": 40,
      "description": "Fires a tremendous charge of kinetic energy from your Executioner's Mace. This charge is so powerful it will explode on impact, blasting all nearby foes. Some affected foes may be knocked back by the force of the blast. You must be level 41 and have one other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Energy), Foe Knockback",
      "icon": "arachnos_patron_rangedaoemoderatedmg.png",
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
        "Knockback",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 2.0,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Energy",
          "scale": 0.9477,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Summon Blaster",
      "fullName": "Epic.Brute_Mace_Mastery.Summon_Blaster",
      "rank": 5,
      "available": 43,
      "description": "Black Scorpion has granted you an Arachnobot Blaster for you to command. Arachnobot Blasters were created by Arachnos Orb Weavers to take down particularly powerful super-powered threats. Your access to this Arachnobot is very limited. You must be level 44 and have two other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Summon Arachnobot: Ranged DMG(Energy)",
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
        "Immobilize",
        "Knockback",
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
    EPIC_POOLS['brute_mace_mastery'] = EPIC_BRUTE_MACE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
