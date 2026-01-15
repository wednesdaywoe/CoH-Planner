/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mu Mastery
 * Archetype: Stalker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\stalker_mu_mastery
 */

const EPIC_STALKER_MU_MASTERY = {
  "id": "stalker_mu_mastery",
  "name": "Mu Mastery",
  "displayName": "Mu Mastery",
  "archetype": "stalker",
  "description": "Scirocco has taught you the ancient powers of the Mu. In their eternal struggle against the Oranbega, the Mu have unlocked many mystical powers, including their very signature crimson lightning. Now you possess their secrets.",
  "icon": "stalker_mu_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mu Bolts",
      "fullName": "Epic.Stalker_Mu_Mastery.Mu_Bolts",
      "rank": 1,
      "available": 34,
      "description": "You can quickly hurl small bolts of Mu electricity at foes, dealing some damage and draining some Endurance. Some of this Endurance may transfer back to you. Mu Bolts deals light damage but recharges quickly.",
      "shortHelp": "Ranged, DMG(Energy), Foe -End",
      "icon": "arachnos_patron_targetedrangedmoddmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 1.459,
          "table": "Melee_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Zapp",
      "fullName": "Epic.Stalker_Mu_Mastery.Zapp",
      "rank": 2,
      "available": 34,
      "description": "A focused blast of Mu electrical energy that can travel great distances with high Accuracy. Zapp drains Endurance, some of which may transfer back to you.This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast.",
      "shortHelp": "Sniper, DMG(Energy), Foe -End",
      "icon": "arachnos_patron_targetedrangedsnipe.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "InterruptReduction",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Ranged Damage",
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
      "name": "Ball Lightning",
      "fullName": "Epic.Stalker_Mu_Mastery.Ball_Lightning",
      "rank": 3,
      "available": 37,
      "description": "Hurls a highly charged ball of Mu lightning that explodes on contact. Ball Lightning deals good damage in an area of effect, and drains some Endurance from each target it hits. You must be level 38 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Energy), Foe -End",
      "icon": "arachnos_patron_rangedaoemoderatedmg.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.07,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Energy",
          "scale": 0.1046,
          "table": "Melee_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Electric Shackles",
      "fullName": "Epic.Stalker_Mu_Mastery.Electric_Shackles",
      "rank": 4,
      "available": 40,
      "description": "Electric Shackles binds a foes limbs, leaving the target held and helpless. The target is drained of some Endurance and some of that Endurance may be transferred back to you. You must be level 41 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Energy), Foe Hold, -End",
      "icon": "arachnos_patron_targetedhold.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Holds",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 2.17,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Energy",
          "scale": 0.4113,
          "table": "Melee_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Summon Adept",
      "fullName": "Epic.Stalker_Mu_Mastery.Summon_Adept",
      "rank": 5,
      "available": 43,
      "description": "Scirocco has shown you how to call upon a mystical Mu Adept to assist you. The Mu pulse with the blood of their slaughtered ancestors in their veins, and are well practiced in the dark arts. Your access to this Adept is very limited. You must be level 44 and have two other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Summon Mu Adept: Ranged DMG(Energy)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Holds",
        "Pet Damage",
        "Recharge Intensive Pets",
        "Sleep",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 900.0,
        "endurance": 26.0,
        "activationTime": 1.17,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['stalker_mu_mastery'] = EPIC_STALKER_MU_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
