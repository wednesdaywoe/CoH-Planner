/**
 * Kinetic Attack
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_KINETIC_ATTACK_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                        }
                    ],
                    scale: 2.509
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
                buffDuration: 5.0
            }
        },
        {
            name: "Quick Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                        }
                    ],
                    scale: 1.941
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
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                            scale: 2.1399999999999997
                        },
                        {
                            type: "Energy",
                            scale: 0.86
                        }
                    ],
                    scale: 2.9999999999999996
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
                buffDuration: 5.0
            }
        },
        {
            name: "Assassin's Strike",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior energy and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Smashing, Energy)",
            icon: "kineticattack_assassinsstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.67
            }
        },
        {
            name: "Build Up",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "kineticattack_powersiphon.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Placate",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Strike. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "kineticattack_placate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                cast: 0.8,
                buffDuration: 10.0
            }
        },
        {
            name: "Burst",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                        }
                    ],
                    scale: 2.5541
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
            allowedSetCategories: ["Knockback", "Ranged Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                            scale: 2.714
                        },
                        {
                            type: "Energy",
                            scale: 1.046
                        }
                    ],
                    scale: 3.76
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
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Concentrated Strike is a slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Concentrated Strike, its recharge time is very long. Concentrated Strike Criticals do not result in extra damage, instead they instantly recharge the Build Up power.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe Disorient, +Special",
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
                        }
                    ],
                    scale: 6.741
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
                buffDuration: 8.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/kinetic-attack'] = STALKER_KINETIC_ATTACK_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_KINETIC_ATTACK_POWERSET = STALKER_KINETIC_ATTACK_POWERSET;
}