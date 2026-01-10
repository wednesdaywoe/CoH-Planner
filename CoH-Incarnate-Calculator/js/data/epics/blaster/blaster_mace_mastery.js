/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mace Mastery
 * Archetype: Blaster
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\blaster_mace_mastery
 */

const EPIC_BLASTER_MACE_MASTERY = {
  "id": "blaster_mace_mastery",
  "name": "Mace Mastery",
  "displayName": "Mace Mastery",
  "archetype": "blaster",
  "description": "Black Scorpion has granted you access to the advanced technology of the Nullifier Mace. The signature weapon of the Wolf Spider TacOps troops, it is not a typical clumsy mace. The Nullifier Mace is capable of firing a variety of energy projectiles and grenades. It can even be modified to summon and command some or Black Scorpion's RV technologies.",
  "icon": "blaster_mace_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Web Envelope",
      "fullName": "Epic.Blaster_Mace_Mastery.Web_Envelope",
      "rank": 1,
      "available": 34,
      "description": "The Nullifier Mace can lob a modified Web Grenade. Upon impact, the Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize most targets in a wide area. This device deals toxic damage over time and does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.",
      "shortHelp": "Ranged (Targeted AoE) DoT(Toxic), Immobilize, -Recharge, -Fly, -Jump",
      "icon": "arachnos_patron_rangedaoeimmobilize.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Blaster) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
      "fullName": "Epic.Blaster_Mace_Mastery.Scorpion_Shield",
      "rank": 2,
      "available": 34,
      "description": "Black Scorpion's technologies are impressive indeed. This energy shield grants you Defense to Lethal, Smashing and Energy attacks, as well as improves your damage resistance to Toxic damage.",
      "shortHelp": "Toggle: Self, +Def(Smash,Lethal,Energy), +Res(Toxic)",
      "icon": "arachnos_patron_defensebuff.png",
      "powerType": "Toggle",
      "requires": "($archetype == @Class_Blaster) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
      "name": "Mace Beam Volley",
      "fullName": "Epic.Blaster_Mace_Mastery.Mace_Beam_Volley",
      "rank": 3,
      "available": 37,
      "description": "Fires a volley of multiple kinetic energy blasts from your Nullifier Mace. These blast spread out in a wide cone and are powerful enough to knock down some foes. You must be level 38 and have one other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Energy), Foe Knockback",
      "icon": "arachnos_patron_rangedconemoderatedmg.png",
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
        "range": 50.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 2.0,
        "effectArea": "Cone",
        "radius": 50.0,
        "arc": 0.6109,
        "damage": {
          "type": "Energy",
          "scale": 1.2118,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Summon Spiderlings",
      "fullName": "Epic.Blaster_Mace_Mastery.Power_Boost",
      "rank": 4,
      "available": 40,
      "description": "Black Scorpion has granted you access to a small squadron of Arachnobot Spiderlings. Three Spiderlings that are one level less than you will show up when summoned. Your access to these Arachnobots is very limited. You must be level 41 and have one other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Summon Spiderlings: Ranged DMG(Lethal)",
      "icon": "arachnos_patron_summononepet.png",
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
        "Pet Damage",
        "Recharge Intensive Pets",
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
    },
    {
      "name": "Web Cocoon",
      "fullName": "Epic.Blaster_Mace_Mastery.Web_Cocoon",
      "rank": 5,
      "available": 43,
      "description": "The Bane Mace can fire a more powerful version the common web grenade. The sinewy fibers of this grenade are strong enough to completely Hold one target. Targets able to resist the Hold are still likely to have their attack and movement speed dramatically slowed. Web Cocoon can also bring down flying targets and prevent foes from jumping. You must be level 44 and have two other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, Foe Hold, -Recharge, -Fly, -Jump, Slow, DoT(Toxic)",
      "icon": "arachnos_patron_targetedhold.png",
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
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['blaster_mace_mastery'] = EPIC_BLASTER_MACE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
