/**
 * Mental Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_MENTAL_MANIPULATION_POWERSET = {
    name: "Mental Manipulation",
    category: "Unknown",
    description: "Mental Manipulation powerset",
    icon: "mental-manipulation_set.png",
    powers: [
        {
            name: "Mind Probe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Universal Damage Sets"],
            description: "Grip the minds of your foe with a Mind Probe. You must be in close proximity to pull off this attack that wrecks havoc on your foes synapses, dealing moderate Psionic Damage while reducing their attack speed.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, Moderate DMG(Psionic), Target -Recharge",
            icon: "psionicassault_mindprobe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.17,
                damage: {
                    type: "Psionic",
                    scale: 3.1788999999999996
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Subdual",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Subdual deals moderate Psionic damage and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Moderate DOT(Psionic), Foe Immobilize",
            icon: "mentalcontrol_subdue.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.67,
                dotDamage: {
                    type: "Psionic",
                    scale: 0.5458000000000001,
                    ticks: 4
                },
                buffDuration: 9.2
            }
        },
        {
            name: "World of Confusion",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Confuse", "Melee AoE Damage", "Universal Damage Sets"],
            description: "This toggle power allows you to cause psionic damage and cause confusion within a group of foes, creating chaos. The chance of confusing an enemy is lower than then chance of damaging them, and it may take multiple hits to affect stronger opponents. All affected foes within the area will turn and attack each other, ignoring all heroes. You will not receive any Experience Points for foes defeated by Confused enemies.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: PBAoE, Minor DoT(Psionic), Foe Confuse",
            icon: "mentalcontrol_worldofconfusion.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.52,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 0.12
                }
            }
        },
        {
            name: "Psychic Scream",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Light DMG(Psionic), Foe -Recharge",
            icon: "psionicassault_psychicscream.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 2.67,
                damage: {
                    type: "Psionic",
                    scale: 2.0434
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Concentration",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "mentalcontrol_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Drain Psyche",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Endurance Modification", "Healing"],
            description: "You Drain the Psyche of nearby foes, thus weakening their Hit Point Regeneration and Endurance Recovery and boosting your own.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE Foe -Regen, -Recovery; Self +Regen, +Recovery",
            icon: "psionicassault_psychicsiphon.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 120.0,
                endurance: 13.0,
                cast: 1.33,
                buffDuration: 30.0
            }
        },
        {
            name: "Scare",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Fear", "Accuracy"],
            allowedSetCategories: ["Fear"],
            description: "You entwine a single foe within their deepest fears and cause them to helplessly tremble for a brief while.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe Fear",
            icon: "mentalcontrol_scare.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 20.0,
                endurance: 10.4,
                cast: 2.67,
                buffDuration: 10.17
            }
        },
        {
            name: "Psychic Shockwave",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Psychic Shockwave is a devastating Psionic attack that wracks the minds of all nearby foes. Affected foes may have a reduced attack rate and may be left Disoriented.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Close (AoE), Light DMG(Psionic), Foe Disorient -Recharge",
            icon: "psionicassault_psionicshockwave.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.97,
                damage: {
                    type: "Psionic",
                    scale: 1.8370000000000002
                },
                stun: 2.0,
                buffDuration: 20.0
            }
        },
        {
            name: "Telekinetic Thrust",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "A focused attack of intense mental power that violently sends a nearby foe flying. Deals minimal damage, but can be very effective.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Superior DMG(Psionic/Smash), Foe Knockback",
            icon: "psionicassault_telekineticthrust.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 3.6688
                        },
                        {
                            type: "Smashing",
                            scale: 1.46
                        }
                    ],
                    scale: 5.1288
                },
                buffDuration: 9.57
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/mental-manipulation'] = BLASTER_MENTAL_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_MENTAL_MANIPULATION_POWERSET = BLASTER_MENTAL_MANIPULATION_POWERSET;
}