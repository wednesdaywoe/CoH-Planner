/**
 * Energy Melee
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_ENERGY_MELEE_POWERSET = {
    name: "Energy Melee",
    category: "Unknown",
    description: "Energy Melee powerset",
    icon: "energy-melee_set.png",
    powers: [
        {
            name: "Barrage",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a quick punch that deals moderate damage. Coupled with other energy punches, Barrage can Disorient a foe. This power will have a 100% chance to stun and weaken the target's secondary effects and regeneration rate if used while in Energy Focus mode.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe Disorient, Special",
            icon: "powerpunch_quick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.33,
                dotDamage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.0891,
                            ticks: 1
                        },
                        {
                            type: "Smashing",
                            scale: 0.3564,
                            ticks: 1
                        },
                        {
                            type: "Fire",
                            scale: 0.297,
                            ticks: 1
                        }
                    ]
                },
                buffDuration: 0.3
            }
        },
        {
            name: "Energy Punch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a powerful Energy Punch that deals moderate damage. When used with other Energy Melee attacks, Energy Punch can Disorient your opponent.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe Disorient",
            icon: "powerpunch_energypunch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.6387
                        },
                        {
                            type: "Smashing",
                            scale: 0.7022999999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.522
                        }
                    ],
                    scale: 2.863
                }
            }
        },
        {
            name: "Bone Smasher",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "This melee attack deals a good amount of damage and has a good chance to Disorient the target.",
            shortHelp: "Melee, DMG(Smash/Energy), Disorient",
            icon: "powerpunch_bonesmasher.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.27,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.0780000000000003
                        },
                        {
                            type: "Smashing",
                            scale: 1.171
                        },
                        {
                            type: "Fire",
                            scale: 0.738
                        }
                    ],
                    scale: 3.987
                }
            }
        },
        {
            name: "Build Up",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "powerpunch_buildup.png",
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
            name: "Whirling Hands",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee AoE Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "By focusing your energy into the muscles in your arms, you can launch a dizzying flurry of attacks against every foe in melee range. Some foes may be hit hard enough to be Disoriented as well.",
            shortHelp: "PBAoE Melee, DMG(Smash/Energy)",
            icon: "powerpunch_flurry.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.0,
                cast: 2.5,
                damage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 1.4
                        },
                        {
                            type: "Energy",
                            scale: 1.0138
                        },
                        {
                            type: "Fire",
                            scale: 0.5318
                        }
                    ],
                    scale: 2.9455999999999998
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
            icon: "powerpunch_taunt.png",
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
            name: "Total Focus",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "Total Focus is complete mastery over Energy Melee. This melee attack is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long. This power will enter Energy Focus mode.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe Disorient, +Energy Focus",
            icon: "powerpunch_totalfocus.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.53,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 4.6396
                        },
                        {
                            type: "Smashing",
                            scale: 1.8913
                        }
                    ],
                    scale: 6.5309
                },
                stun: 3.0
            }
        },
        {
            name: "Power Crash",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee AoE Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "You focus your internal energy on your fists and release it once you hit your target unleashing an energy wave that hurts and disorients multiple enemies. This power will hit up to 5 additional foes if used while in Energy Focus mode.<br><br><color #fcfc95>Notes: Power Crash is unaffected by Arc changes.</color>",
            shortHelp: "Melee (Cone), DMG(Smash/Energy), Foe Disorient, Special",
            icon: "powerpunch_powercrash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.0944,
            effects: {
                accuracy: 1.0,
                range: 10.0,
                recharge: 9.0,
                endurance: 9.36,
                cast: 1.8,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.4809
                        },
                        {
                            type: "Smashing",
                            scale: 1.0725
                        },
                        {
                            type: "Fire",
                            scale: 0.5414
                        }
                    ],
                    scale: 3.0948
                }
            }
        },
        {
            name: "Energy Transfer",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee Damage", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "Mastery of Energy Melee culminates with the ability to transfer your own Hit Points into a punch that deals extreme damage. Energy Transfer has a good chance of Disorienting the target. This power will execute extremely quickly if under Energy Focus mode.",
            shortHelp: "Melee, DMG(Energy), Foe Disorient, Self -HP, Special",
            icon: "powerpunch_energytransfer.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 10.0,
                cast: 2.67
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/energy-melee'] = BRUTE_ENERGY_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_ENERGY_MELEE_POWERSET = BRUTE_ENERGY_MELEE_POWERSET;
}