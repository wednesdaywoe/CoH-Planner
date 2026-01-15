/**
 * Kinetic Attack
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_KINETIC_ATTACK_POWERSET = {
    name: "Kinetic Attack",
    category: "Unknown",
    description: "Kinetic Attack powerset",
    icon: "kinetic-attack_set.png",
    powers: [
        {
            name: "Body Blow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "A much more powerful, yet slower version of Quick Strike. Body Blow is capable of stunning an opponent occasionally.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe Disorient",
            icon: "kineticattack_bodyblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 1.07,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.8143
                        },
                        {
                            type: "Energy",
                            scale: 0.6947
                        },
                        {
                            type: "Fire",
                            scale: 0.522
                        }
                    ],
                    scale: 3.031
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 0.85,
                            ticks: 2
                        }
                    ]
                },
                stun: 3.0,
                buffDuration: 5.0
            }
        },
        {
            name: "Quick Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee Damage", "Threat Duration", "Universal Damage Sets"],
            description: "A quick attack that sometimes knock foes down. Fast, but low damage.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe -DMG, Knockdown",
            icon: "kineticattack_quickstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.4007
                        },
                        {
                            type: "Energy",
                            scale: 0.5403
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 2.319
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 0.85,
                            ticks: 2
                        }
                    ]
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Smashing Blow",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "Smashing Blow is a slow attack, but makes up for it with a good amount of damage. Has a greater chance to stun than body blow.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe Disorient",
            icon: "kineticattack_smashingblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 7.0,
                endurance: 7.696,
                cast: 1.2,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.064
                        },
                        {
                            type: "Energy",
                            scale: 0.9359999999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.666
                        }
                    ],
                    scale: 3.666
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 0.85,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 0.85,
                            ticks: 2
                        }
                    ]
                },
                stun: 3.0,
                buffDuration: 5.0
            }
        },
        {
            name: "Power Siphon",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Power Siphon adds a small bonus to hit and modifies your other Kinetic Attack powers, so they are now capable of draining the strength of your enemies and adding that strength to you. This effect will stack up to 5 times.",
            shortHelp: "Self: +ToHit, +Special",
            icon: "kineticattack_powersiphon.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                recharge: 120.0,
                endurance: 5.2,
                cast: 1.93,
                buffDuration: 20.0,
                tohitBuff: 0.75
            }
        },
        {
            name: "Repulsing Torrent",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Ranged AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Repulsing Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying.",
            shortHelp: "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
            icon: "kineticattack_repulsingtorrent.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.5434999999999999
                        },
                        {
                            type: "Energy",
                            scale: 0.5145
                        },
                        {
                            type: "Fire",
                            scale: 0.495
                        }
                    ],
                    scale: 2.553
                }
            }
        },
        {
            name: "Taunt",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "kineticattack_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 12.0
            }
        },
        {
            name: "Burst",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "By focusing your energy into the muscles in your arms, you can launch a dizzying flurry of attacks against every foe in melee range. Some foes may be hit hard enough to be knocked down as well.",
            shortHelp: "PBAoE Melee, DMG(Smash/Energy), Foe Knockdown",
            icon: "kineticattack_burst.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.7281
                        },
                        {
                            type: "Energy",
                            scale: 0.8260000000000001
                        },
                        {
                            type: "Fire",
                            scale: 0.5625
                        }
                    ],
                    scale: 3.1166
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.7,
                            ticks: 3
                        },
                        {
                            type: "Lethal",
                            scale: 1.7,
                            ticks: 3
                        },
                        {
                            type: "Fire",
                            scale: 1.7,
                            ticks: 3
                        },
                        {
                            type: "Cold",
                            scale: 1.7,
                            ticks: 3
                        },
                        {
                            type: "Energy",
                            scale: 1.7,
                            ticks: 3
                        },
                        {
                            type: "Negative",
                            scale: 1.7,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 7.0
            }
        },
        {
            name: "Focused Burst",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Knockback", "Ranged Damage", "Threat Duration", "Universal Damage Sets"],
            description: "Projects a burst of focused power over a short distance. Focused Burst deals high damage and can possibly knock down your foe.",
            shortHelp: "Ranged, DMG(Smash/Energy), Foe Knockdown",
            icon: "kineticattack_focusedburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.8200000000000003
                        },
                        {
                            type: "Energy",
                            scale: 0.94
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 4.498
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.85,
                            ticks: 3
                        },
                        {
                            type: "Lethal",
                            scale: 0.85,
                            ticks: 3
                        },
                        {
                            type: "Fire",
                            scale: 0.85,
                            ticks: 3
                        },
                        {
                            type: "Cold",
                            scale: 0.85,
                            ticks: 3
                        },
                        {
                            type: "Energy",
                            scale: 0.85,
                            ticks: 3
                        },
                        {
                            type: "Negative",
                            scale: 0.85,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 7.0
            }
        },
        {
            name: "Concentrated Strike",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "Concentrated Strike is a slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Concentrated Strike, its recharge time is very long.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Disorient",
            icon: "kineticattack_totalfocus.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.83,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 4.7867
                        },
                        {
                            type: "Smashing",
                            scale: 1.9543
                        },
                        {
                            type: "Fire",
                            scale: 1.602
                        }
                    ],
                    scale: 8.343
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.85,
                            ticks: 4
                        },
                        {
                            type: "Lethal",
                            scale: 0.85,
                            ticks: 4
                        },
                        {
                            type: "Fire",
                            scale: 0.85,
                            ticks: 4
                        },
                        {
                            type: "Cold",
                            scale: 0.85,
                            ticks: 4
                        },
                        {
                            type: "Energy",
                            scale: 0.85,
                            ticks: 4
                        },
                        {
                            type: "Negative",
                            scale: 0.85,
                            ticks: 4
                        }
                    ]
                },
                stun: 3.0,
                buffDuration: 8.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/kinetic-attack'] = BRUTE_KINETIC_ATTACK_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_KINETIC_ATTACK_POWERSET = BRUTE_KINETIC_ATTACK_POWERSET;
}