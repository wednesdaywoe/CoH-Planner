/**
 * Psychic Blast
 * Character Level: 50
 * Archetype: defender
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DEFENDER_PSYCHIC_BLAST_POWERSET = {
    name: "Psychic Blast",
    category: "Unknown",
    description: "Psychic Blast powerset",
    icon: "psychic-blast_set.png",
    powers: [
        {
            name: "Mental Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.",
            shortHelp: "Ranged, DMG(Psionic), Target -Recharge",
            icon: "psychicblast_mentalblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 3.1289
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Subdue",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Immobilize", "Ranged Damage", "Universal Damage Sets"],
            description: "Subdue deals moderate Psionic damage and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.",
            shortHelp: "Ranged, DMG(Psionic), Foe Immobilize",
            icon: "psychicblast_subdue.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Psionic",
                    scale: 2.2599
                }
            }
        },
        {
            name: "Telekinetic Blast",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You can use Telekinesis to Blast a targeted foe with the power of your mind. This attack deals Smashing and Psionic damage, and can knock your opponent back.",
            shortHelp: "Ranged, DMG(Smash/Psionic), Foe Knockback",
            icon: "psychicblast_telekineticblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 2.42
                        },
                        {
                            type: "Smashing",
                            scale: 0.64
                        }
                    ],
                    scale: 3.06
                }
            }
        },
        {
            name: "Psychic Scream",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.",
            shortHelp: "Ranged (Cone), DMG(Psionic), Foe -Recharge",
            icon: "psychicblast_psychicscream.png",
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
                cast: 1.87,
                damage: {
                    type: "Psionic",
                    scale: 1.8388
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Will Domination",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Sleep", "Universal Damage Sets"],
            description: "This powerful attack deals Psionic damage, and is so painful it usually renders its target unconscious. The victim is asleep, and will wake if disturbed.",
            shortHelp: "Ranged, DMG(Psionic), Foe Sleep",
            icon: "psychicblast_willdomination.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 10.0,
                endurance: 11.856,
                cast: 1.1,
                damage: {
                    type: "Psionic",
                    scale: 3.9299
                }
            }
        },
        {
            name: "Psionic Lance",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "This extremely long range Psionic attack has a bonus to Accuracy, and can Slow a target's attack rate. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Psionic), Target -Recharge",
            icon: "psychicblast_psioniclance.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 175.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.33
            }
        },
        {
            name: "Psionic Tornado",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Unleashes a whirlwind of Psionic energy on a target, tossing nearby foes into the air. The Psionic Tornado damages foes and Slows their attack speed.",
            shortHelp: "Ranged (Targeted AoE), Dmg(Psionic), Foe Knockback",
            icon: "psychicblast_psionictornado.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.83,
                damage: {
                    type: "Psionic",
                    scale: 1.8634
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Scramble Minds",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Painfully scrambles the synapses of a targeted foe, leaving them dramatically Disoriented for a short duration. The effects of this power can jump from one foe to another in a chain dealing damage and applying a random mental effects to each target.",
            shortHelp: "Chain, DMG(Psionic), Foe Disorient",
            icon: "psychicblast_scrambleminds.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Chain",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 20.0,
                endurance: 10.4,
                cast: 2.0,
                damage: {
                    type: "Psionic",
                    scale: 4.0862
                }
            }
        },
        {
            name: "Psychic Wail",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Psychic Wail is a devastating Psionic attack that wracks the minds of all nearby foes which deals Extreme Psionic damage. Those that survive will have a severely reduced attack rate and may be left Disoriented.",
            shortHelp: "PBAoE, DMG(Psionic), Foe Disorient -Recharge",
            icon: "psychicblast_psychicwail.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.5,
                recharge: 145.0,
                endurance: 27.716,
                cast: 1.97,
                damage: {
                    type: "Psionic",
                    scale: 5.5954999999999995
                },
                stun: 3.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['defender/psychic-blast'] = DEFENDER_PSYCHIC_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DEFENDER_PSYCHIC_BLAST_POWERSET = DEFENDER_PSYCHIC_BLAST_POWERSET;
}