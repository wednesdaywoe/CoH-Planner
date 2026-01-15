/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mace Mastery
 * Archetype: Stalker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\stalker_mace_mastery
 */

const EPIC_STALKER_MACE_MASTERY = {
  "id": "stalker_mace_mastery",
  "name": "Mace Mastery",
  "displayName": "Mace Mastery",
  "archetype": "stalker",
  "description": "Black Scorpion has granted you access to the advanced technology of the Nullifier Mace. The signature weapon of the Bane Spider Commandos, it is not a typical clumsy mace. The Bane Mace is capable of firing a variety of energy projectiles and grenades. It can even be modified to summon and command some or Black Scorpion's RV technologies.",
  "icon": "stalker_mace_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mace Blast",
      "fullName": "Epic.Stalker_Mace_Mastery.Mace_Blast",
      "rank": 1,
      "available": 34,
      "description": "The Bane Mace is capable of firing a bolt of kinetic energy. The blast is powerful enough that it may knockback some foes. Arachnos Bane Spider Troopers call this the Power Blast. The Arbiters who invented it scoff at this simple term.",
      "shortHelp": "Ranged, DMG(Energy), Foe Knockback",
      "icon": "arachnos_patron_targetedrangedmoddmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker))",
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
      "name": "Mace Beam",
      "fullName": "Epic.Stalker_Mace_Mastery.Mace_Beam",
      "rank": 2,
      "available": 34,
      "description": "Fires an extremely long range and accurate beam of kinetic Energy from the Bane Mace that deals tremendous damage and knocks the target back.This is a sniper attack, and like most sniper attacks, is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
      "shortHelp": "Sniper, DMG(Energy), Foe Knockback",
      "icon": "arachnos_patron_targetedrangedsnipe.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Knockback",
        "Ranged Damage",
        "Sniper Attacks",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 150.0,
        "recharge": 24.0,
        "endurance": 17.94,
        "activationTime": 2.0,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Disruptor Blast",
      "fullName": "Epic.Stalker_Mace_Mastery.Disruptor_Blast",
      "rank": 3,
      "available": 37,
      "description": "Fires a tremendous charge of kinetic energy from your Executioner's Mace. This charge is so powerful it will explode on impact, blasting all nearby foes. Some affected foes may be knocked back by the force of the blast. You must be level 44 and have two other Mace Mastery powers before selecting this power. You must be level 38 and have one other Mace Mastery Powers before selecting this power.",
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
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Web Cocoon",
      "fullName": "Epic.Stalker_Mace_Mastery.Web_Cocoon",
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
      "name": "Summon Spiderlings",
      "fullName": "Epic.Stalker_Mace_Mastery.Summon_Spiderlings",
      "rank": 5,
      "available": 43,
      "description": "Black Scorpion has granted you access to a small squadron of Arachnobot Spiderlings. Three Spiderlings that are one level less than you will show up when summoned. Your access to these Arachnobots is very limited. You must be level 44 and have two other Mace Mastery Powers before selecting this power.",
      "shortHelp": "Summon Spiderlings: Ranged DMG(Lethal)",
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
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['stalker_mace_mastery'] = EPIC_STALKER_MACE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
