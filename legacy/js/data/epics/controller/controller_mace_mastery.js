/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mace Mastery
 * Archetype: Controller
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\controller_mace_mastery
 */

const EPIC_CONTROLLER_MACE_MASTERY = {
  "id": "controller_mace_mastery",
  "name": "Mace Mastery",
  "displayName": "Mace Mastery",
  "archetype": "controller",
  "description": "Black Scorpion has granted you access to the advanced technology of the Nullifier Mace. The signature weapon of the Bane Spider Commandos, it is not a typical clumsy mace. The Bane Mace is capable of firing a variety of energy projectiles and grenades. It can even be modified to summon and command some or Black Scorpion's RV technologies.",
  "icon": "controller_mace_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Poisonous Ray",
      "fullName": "Epic.Controller_Mace_Mastery.Poisonous_Ray",
      "rank": 1,
      "available": 34,
      "description": "The Bane Mace can fire a nasty Poison Ray. This toxin is suspended in a polarized plasma field and delivered like an energy blast. Upon impact, the toxin directly attacks the immune system, reducing the affected targets Defense and Damage Resistance as it deals toxic damage.",
      "shortHelp": "Ranged DoT(Poison), Foe -RES, -DEF",
      "icon": "arachnos_patron_targeteddebuffdefense.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Controller) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate Defense Debuff",
        "Defense Debuff",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 80.0,
        "recharge": 24.0,
        "endurance": 13.0,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 2.76,
          "table": "Ranged_PvPDamage"
        },
        "defense": {
          "all": {
            "scale": 2.0,
            "table": "Ranged_Debuff_Def"
          }
        },
        "resistance": {
          "smashing": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          },
          "lethal": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          },
          "fire": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          },
          "cold": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          },
          "energy": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          },
          "negative": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          },
          "psionic": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          },
          "toxic": {
            "scale": -2.5,
            "table": "Ranged_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Scorpion Shield",
      "fullName": "Epic.Controller_Mace_Mastery.Scorpion_Shield",
      "rank": 2,
      "available": 34,
      "description": "Black Scorpion's technologies are impressive indeed. This energy shield grants you Defense to Lethal, Smashing and Energy attacks, as well as improves your damage resistance to Toxic damage.",
      "shortHelp": "Toggle: Self, +Def(Smash,Lethal,Energy), +Res(Toxic)",
      "icon": "arachnos_patron_defensebuff.png",
      "powerType": "Toggle",
      "requires": "($archetype == @Class_Controller) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
      "name": "Disruptor Blast",
      "fullName": "Epic.Controller_Mace_Mastery.Disruptor_Blast",
      "rank": 3,
      "available": 37,
      "description": "Fires a tremendous charge of kinetic energy from your Bane Mace. This charge is so powerful it will explode on impact, blasting all nearby foes. Some affected foes may be knocked back by the force of the blast. You must be level 38 and have one other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Smashing/Energy), Foe Knockback",
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
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Focused Accuracy",
      "fullName": "Epic.Controller_Mace_Mastery.Personal_Force_Field",
      "rank": 4,
      "available": 40,
      "description": "When this power is activated, the Villain focuses their senses to dramatically improve their range and accuracy. Additionally, Focused Accuracy increase your Perception, allowing you to better see stealthy foes. It also grants you resistance to powers that DeBuff your Accuracy. Focused Accuracy is a toggle power and must be activated and deactivated manually. Like all toggle powers, while active, Focused Accuracy drains Endurance while active. You must be level 41 and have one other Mace Mastery Powers before selecting this power.",
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
      "name": "Summon Tarantula",
      "fullName": "Epic.Controller_Mace_Mastery.Summon_Tarantula",
      "rank": 5,
      "available": 43,
      "description": "Black Scorpion has granted you an Toxic Tarantula for you to command. Weaver One developed the Tarantula Exoskeleton Armor, which so radically transforms an Arachnos troop that hardly anything human is recognizable. Your access to this Tarantula is very limited. You must be level 44 and have two other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Summon Tarantula: Ranged DMG(Toxic)",
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
    EPIC_POOLS['controller_mace_mastery'] = EPIC_CONTROLLER_MACE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
