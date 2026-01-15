/**
 * Psychic Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_PSYCHIC_BLAST_POWERSET = {
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
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Psionic), Target -Recharge",
            icon: "psychicblast_mentalblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 75.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 2.729
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Telekinetic Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can use Telekinesis to Blast a targeted foe with the power of your mind. This attack deals Smashing and Psionic damage, and can knock your opponent back.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Smash/Psionic), Foe Knockback",
            icon: "psychicblast_telekineticblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 75.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 2.34
                        },
                        {
                            type: "Smashing",
                            scale: 0.32
                        }
                    ],
                    scale: 2.6599999999999997
                }
            }
        },
        {
            name: "Psychic Scream",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Light DMG(Psionic), Foe -Recharge",
            icon: "psychicblast_psychicscream.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 1.2217,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.87,
                damage: {
                    type: "Psionic",
                    scale: 1.7277
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Will Domination",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Sleep", "Universal Damage Sets"],
            description: "This powerful attack deals Psionic damage, and is so painful it usually renders its target unconscious. The victim is asleep, and will wake if disturbed.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, High DMG(Psionic), Foe Sleep",
            icon: "psychicblast_willdomination.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 75.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.1,
                damage: {
                    type: "Psionic",
                    scale: 3.5300000000000002
                }
            }
        },
        {
            name: "Psychic Focus",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and range.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +To Hit, +DMG, +Range",
            icon: "psychicblast_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 5.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Psionic Strike",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "This extremely accurate attack does moderate Psionic damage and can Slow a target's attack rate.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Superior DMG(Psionic), Target -Recharge",
            icon: "psychicblast_heavy.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 75.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.67,
                damage: {
                    type: "Psionic",
                    scale: 5.429
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Psionic Tornado",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Unleashes a whirlwind of Psionic energy on a target, tossing nearby foes into the air. The Psionic Tornado damages foes and Slows their attack speed.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Moderate DoT(Psionic), Foe Knockback",
            icon: "psychicblast_psionictornado.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.83,
                dotDamage: {
                    type: "Psionic",
                    scale: 0.3021,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        },
        {
            name: "Scramble Thoughts",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Painfully scrambles the synapses of a targeted foe, leaving them dramatically Disoriented for a short duration. Deals a little Psionic Damage.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Extreme DMG(Psionic), Foe Disorient",
            icon: "psychicblast_scramblethoughts.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 75.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 3.0,
                damage: {
                    type: "Psionic",
                    scale: 6.859999999999999
                },
                stun: 3.0
            }
        },
        {
            name: "Psychic Wail",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Psychic Wail is a devastating Psionic attack that wracks the minds of all nearby foes which deals Extreme Psionic damage. Those that survive will have a severely reduced attack rate and may be left Disoriented.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Superior DMG(Psionic), Foe Disorient -Recharge",
            icon: "psychicblast_psychicwail.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.5,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.97,
                damage: {
                    type: "Psionic",
                    scale: 3.598
                },
                stun: 3.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/psychic-blast'] = SENTINEL_PSYCHIC_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_PSYCHIC_BLAST_POWERSET = SENTINEL_PSYCHIC_BLAST_POWERSET;
}