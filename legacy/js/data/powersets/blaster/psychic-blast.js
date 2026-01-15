/**
 * Psychic Blast
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_PSYCHIC_BLAST_POWERSET = {
    name: "Psychic Blast",
    category: "Unknown",
    description: "Psychic Blast powerset",
    icon: "psychic-blast_set.png",
    powers: [
        {
            name: "Dominate Will",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged Damage", "Sleep", "Universal Damage Sets"],
            description: "This attack deals Psionic damage, and is capable of rendering its target unconscious. The victim is asleep, and will wake if disturbed.",
            shortHelp: "Ranged, DMG(Psionic), Foe Sleep",
            icon: "psychicblast_willdomination.png",
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
                    scale: 2.2602
                }
            }
        },
        {
            name: "Mental Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "This basic attack does high Psionic damage, and can slightly reduce a target's attack speed.",
            shortHelp: "Ranged, DMG(Psionic), Target -Recharge",
            icon: "psychicblast_mentalblast.png",
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
                    scale: 3.5292
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Telekinetic Blast",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You can use Telekinesis to Blast a targeted foe with the power of your mind. This attack deals Smashing and Psionic damage, and can knock your opponent back.",
            shortHelp: "Ranged, DMG(Smash/Psionic), Foe Knockback",
            icon: "psychicblast_telekineticblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 100.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Psionic",
                            scale: 3.0002
                        },
                        {
                            type: "Smashing",
                            scale: 0.46
                        }
                    ],
                    scale: 3.4602
                }
            }
        },
        {
            name: "Psionic Darts",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed, but has a very fast attack rate.",
            shortHelp: "Ranged, DMG(Psionic), Target -Recharge",
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
                cast: 1.0,
                damage: {
                    type: "Psionic",
                    scale: 1.4087999999999998
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Psychic Focus",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.",
            shortHelp: "Self +To Hit, +DMG",
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
            name: "Psionic Lance",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "This extremely long range Psionic attack has a bonus to Accuracy, and can Slow a target's attack rate. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Psionic), Target -Recharge, Self +Range",
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
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
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
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
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
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.0,
                damage: {
                    type: "Psionic",
                    scale: 4.0862
                }
            }
        },
        {
            name: "Psychic Wail",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
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
                    scale: 5.4065
                },
                stun: 3.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/psychic-blast'] = BLASTER_PSYCHIC_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_PSYCHIC_BLAST_POWERSET = BLASTER_PSYCHIC_BLAST_POWERSET;
}