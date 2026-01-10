/**
 * Energy Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_ENERGY_MELEE_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                            scale: 0.9713,
                            ticks: 1
                        },
                        {
                            type: "Smashing",
                            scale: 0.47419999999999995,
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
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                        }
                    ],
                    scale: 2.341
                }
            }
        },
        {
            name: "Bone Smasher",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                            scale: 1.9654
                        },
                        {
                            type: "Smashing",
                            scale: 1.2835999999999999
                        }
                    ],
                    scale: 3.2489999999999997
                }
            }
        },
        {
            name: "Assassin's Strike",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior energy and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Smash/Energy)",
            icon: "powerpunch_assassinstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.0
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
            name: "Placate",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Strike. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "powerpunch_placate.png",
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
            name: "Power Crash",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.8,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.0237
                        },
                        {
                            type: "Smashing",
                            scale: 1.4655
                        }
                    ],
                    scale: 3.4892
                }
            }
        },
        {
            name: "Total Focus",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Total Focus is complete mastery over Energy Melee. This melee attack is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long. This power will enter Energy Focus mode. Total Focus Criticals do not result in double damage, instead it grants double Energy Focus.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe DisorientMelee, Extreme(Energy/Smash), Foe Disorient, +Energy Focus",
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
                            scale: 4.699
                        },
                        {
                            type: "Smashing",
                            scale: 1.8319
                        }
                    ],
                    scale: 6.5309
                },
                stun: 3.0
            }
        },
        {
            name: "Energy Transfer",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
    POWERSETS['stalker/energy-melee'] = STALKER_ENERGY_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_ENERGY_MELEE_POWERSET = STALKER_ENERGY_MELEE_POWERSET;
}