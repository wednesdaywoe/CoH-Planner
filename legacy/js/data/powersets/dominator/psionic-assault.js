/**
 * Psionic Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_PSIONIC_ASSAULT_POWERSET = {
    name: "Psionic Assault",
    category: "Unknown",
    description: "Psionic Assault powerset",
    icon: "psionic-assault_set.png",
    powers: [
        {
            name: "Mind Probe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Universal Damage Sets"],
            description: "Grip the minds of your foe with a Mind Probe. You must be in close proximity to pull off this attack that wrecks havoc on your foes synapses, dealing high Psionic Damage while reducing their attack speed.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Psionic), Target -Recharge",
            icon: "psionicassault_mindprobe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.17,
                damage: {
                    type: "Psionic",
                    scale: 3.5789999999999997
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Psionic Dart",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Light DMG(Psionic), Target -Recharge",
            icon: "psionicassault_mentaldart.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    type: "Psionic",
                    scale: 1.9409999999999998
                },
                buffDuration: 5.0
            }
        },
        {
            name: "Telekinetic Thrust",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "A focused attack of intense mental power that violently sends a nearby foe flying and deals a high amount of Psionic and Smashing damage.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, Moderate DMG(Psionic/Smash), Foe Knockback",
            icon: "psionicassault_telekineticthrust.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 7.0,
                endurance: 7.696,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 2.145
                        },
                        {
                            type: "Smashing",
                            scale: 0.715
                        }
                    ],
                    scale: 2.86
                }
            }
        },
        {
            name: "Mental Blast",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "This basic attack does high Psionic damage, and can slightly reduce a target's attack speed.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Moderate DMG(Psionic), Target -Recharge",
            icon: "psionicassault_mentalblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 3.5290999999999997
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Psychic Scream",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Universal Damage Sets"],
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
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.67,
                damage: {
                    type: "Psionic",
                    scale: 2.3617
                },
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
            name: "Subdue",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Subdue deals high Psionic damage and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Moderate DMG(Psionic), Foe Immobilize",
            icon: "psionicassault_subdue.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 3.5476
                }
            }
        },
        {
            name: "Psionic Lance",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "This extremely long range Psionic attack has a bonus to Accuracy, and can Slow a target's attack rate. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Psionic), Target -Recharge",
            icon: "psionicassault_psioniclance.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 175.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.33
            }
        },
        {
            name: "Psychic Shockwave",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Psychic Shockwave is a devastating Psionic attack that wracks the minds of all nearby foes. Affected foes may have a reduced attack rate and may be left Disoriented.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Light DMG(Psionic), Foe Disorient -Recharge",
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
                    scale: 2.5690999999999997
                },
                stun: 1.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/psionic-assault'] = DOMINATOR_PSIONIC_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_PSIONIC_ASSAULT_POWERSET = DOMINATOR_PSIONIC_ASSAULT_POWERSET;
}