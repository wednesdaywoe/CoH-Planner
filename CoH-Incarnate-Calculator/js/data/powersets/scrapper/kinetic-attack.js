/**
 * Kinetic Attack
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_KINETIC_ATTACK_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                            type: "Energy",
                            scale: 4.3637
                        },
                        {
                            type: "Smashing",
                            scale: 1.8143
                        },
                        {
                            type: "Fire",
                            scale: 0.522
                        }
                    ],
                    scale: 6.699999999999999
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 0.75,
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
            allowedSetCategories: ["Knockback", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            type: "Energy",
                            scale: 3.3213
                        },
                        {
                            type: "Smashing",
                            scale: 1.4007
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 5.1
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 0.75,
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
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                            type: "Energy",
                            scale: 5.416
                        },
                        {
                            type: "Smashing",
                            scale: 2.064
                        },
                        {
                            type: "Fire",
                            scale: 0.666
                        }
                    ],
                    scale: 8.146
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 0.75,
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
            shortHelp: "Self: +To Hit, +Special",
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
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            type: "Energy",
                            scale: 3.0725
                        },
                        {
                            type: "Smashing",
                            scale: 1.5434999999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.495
                        }
                    ],
                    scale: 5.111
                }
            }
        },
        {
            name: "Confront",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Challenges a foe to attack you. Useful to pull a villain off an ally who finds themselves in over their head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "kineticattack_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 3.0,
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
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                endurance: 14.3,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 4.6301000000000005
                        },
                        {
                            type: "Smashing",
                            scale: 1.7281
                        },
                        {
                            type: "Fire",
                            scale: 0.5625
                        }
                    ],
                    scale: 6.9207
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.5,
                            ticks: 3
                        },
                        {
                            type: "Lethal",
                            scale: 1.5,
                            ticks: 3
                        },
                        {
                            type: "Fire",
                            scale: 1.5,
                            ticks: 3
                        },
                        {
                            type: "Cold",
                            scale: 1.5,
                            ticks: 3
                        },
                        {
                            type: "Energy",
                            scale: 1.5,
                            ticks: 3
                        },
                        {
                            type: "Negative",
                            scale: 1.5,
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
            allowedSetCategories: ["Knockback", "Ranged Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                            type: "Energy",
                            scale: 6.34
                        },
                        {
                            type: "Smashing",
                            scale: 2.8200000000000003
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 9.898
                },
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.75,
                            ticks: 3
                        },
                        {
                            type: "Lethal",
                            scale: 0.75,
                            ticks: 3
                        },
                        {
                            type: "Fire",
                            scale: 0.75,
                            ticks: 3
                        },
                        {
                            type: "Cold",
                            scale: 0.75,
                            ticks: 3
                        },
                        {
                            type: "Energy",
                            scale: 0.75,
                            ticks: 3
                        },
                        {
                            type: "Negative",
                            scale: 0.75,
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
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Concentrated Strike is a slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Concentrated Strike, recharge time is very long. Concentrated Strike Criticals do not result in extra damage, instead it instantly recharges the Power Siphon power.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Disorient, Special",
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
                            scale: 0.75,
                            ticks: 4
                        },
                        {
                            type: "Lethal",
                            scale: 0.75,
                            ticks: 4
                        },
                        {
                            type: "Fire",
                            scale: 0.75,
                            ticks: 4
                        },
                        {
                            type: "Cold",
                            scale: 0.75,
                            ticks: 4
                        },
                        {
                            type: "Energy",
                            scale: 0.75,
                            ticks: 4
                        },
                        {
                            type: "Negative",
                            scale: 0.75,
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
    POWERSETS['scrapper/kinetic-attack'] = SCRAPPER_KINETIC_ATTACK_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_KINETIC_ATTACK_POWERSET = SCRAPPER_KINETIC_ATTACK_POWERSET;
}