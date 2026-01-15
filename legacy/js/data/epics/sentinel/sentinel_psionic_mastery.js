/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Psionic Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_psionic_mastery
 */

const EPIC_SENTINEL_PSIONIC_MASTERY = {
  "id": "sentinel_psionic_mastery",
  "name": "Psionic Mastery",
  "displayName": "Psionic Mastery",
  "archetype": "sentinel",
  "description": "You have advance Mastery over your Psionic abilities and are able to control your foes and aid your allies with them.",
  "icon": "sentinel_psionic_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mass Hypnosis",
      "fullName": "Epic.Sentinel_Psionic_Mastery.Mass_Hypnosis",
      "rank": 1,
      "available": 34,
      "description": "Hypnotizes a group of foes at a distance and puts them to Sleep. The targets will remain asleep for some time, but will awaken if attacked. This power deals no damage, but if done discreetly, the targets will never be aware of your presence.<br><br><color #fcfc95>Notes:<br>The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "Ranged (Targeted AoE), Foe Sleep",
      "icon": "mentalcontrol_masshypnosis.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Sleep",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Sleep"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 90.0,
        "endurance": 19.5,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 25.0,
        "protection": {
          "sleep": 4.0
        }
      }
    },
    {
      "name": "Mind Probe",
      "fullName": "Epic.Sentinel_Psionic_Mastery.Mind_Probe",
      "rank": 2,
      "available": 34,
      "description": "Grip the minds of your foe with a Mind Probe. You must be in close proximity to pull off this attack that wreaks havoc on your foes synapses, dealing high Psionic Damage while reducing their attack speed.",
      "shortHelp": "Melee, DMG(Psionic), Target -Recharge",
      "icon": "mentalcontrol_mindprobe.png",
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
        "Melee Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 20.0,
        "endurance": 12.74,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Psionic",
          "scale": 2.019,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Dominate",
      "fullName": "Epic.Sentinel_Psionic_Mastery.Dominate",
      "rank": 3,
      "available": 37,
      "description": "Painfully tears at the mind of a single foe. Dominate deals Psionic damage and renders a foe helpless, lost in their own mind and unable to defend themselves. You must be level 38 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Psionic), Foe Hold",
      "icon": "mentalcontrol_command.png",
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
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.1,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 4.0
        },
        "damage": {
          "type": "Psionic",
          "scale": 2.13,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Psychic Shockwave",
      "fullName": "Epic.Sentinel_Psionic_Mastery.Psychic_Shockwave",
      "rank": 4,
      "available": 40,
      "description": "Psychic Shockwave is a devastating Psionic attack that wracks the minds of all nearby foes. Affected foes may have a reduced attack rate and may be left Disoriented. You must be level 41 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE, DMG(Psionic), Foe Disorient -Recharge",
      "icon": "mentalcontrol_psionicshockwave.png",
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
        "Melee AoE Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 1.97,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Psionic",
          "scale": 0.7935,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "stun": 2.0
        }
      }
    },
    {
      "name": "Link Minds",
      "fullName": "Epic.Sentinel_Psionic_Mastery.Link_Minds",
      "rank": 5,
      "available": 43,
      "description": "Your Mind Link Power will enable you to link the minds of all your teammates who are near you for the next 90 seconds. This shared link improves your team's chance to hit foes, your defensive abilities and reduces psionic damage. You must be level 44 and have two other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE Team +To Hit, +DEF (All), +RES (Psionic)",
      "icon": "mentalcontrol_mindlink.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [
        "Defense Sets",
        "To Hit Buff"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 300.0,
        "endurance": 15.288,
        "activationTime": 3.67,
        "effectArea": "AoE",
        "radius": 35.0,
        "resistance": {
          "psionic": {
            "scale": 2.0,
            "table": "Ranged_Res_Dmg"
          }
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_psionic_mastery'] = EPIC_SENTINEL_PSIONIC_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
