/**
 * Ice Melee
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_ICE_MELEE_POWERSET = {
    name: "Ice Melee",
    category: "Unknown",
    description: "Ice Melee powerset",
    icon: "ice-melee_set.png",
    powers: [
        {
            name: "Frozen Fists",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "Frozen Fists encrusts your hands in ice, giving them the ability to quickly inflict minor damage on villains. The foe's attack and movement speed is Slowed, due to the chills caused by the cold blows.",
            shortHelp: "Melee, DMG(Cold/Smash), Foe -Recharge, -SPD",
            icon: "icyonslaught_frozenfist.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 4.3185
                        },
                        {
                            type: "Smashing",
                            scale: 0.3154
                        },
                        {
                            type: "Fire",
                            scale: 0.225
                        }
                    ],
                    scale: 4.8589
                },
                dotDamage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 0.4,
                            ticks: 1
                        },
                        {
                            type: "Smashing",
                            scale: 0.1,
                            ticks: 1
                        }
                    ]
                },
                buffDuration: 0.3
            }
        },
        {
            name: "Ice Sword",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You create a blade of solid ice that deals good damage. Being hit by this Ice Sword will Slow a target's movement and attack speed, due to the intense chill.",
            shortHelp: "Melee, DMG(Cold/Lethal), Foe -Recharge, -SPD",
            icon: "icyonslaught_icesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 5.7627
                        },
                        {
                            type: "Lethal",
                            scale: 1.0441
                        },
                        {
                            type: "Fire",
                            scale: 0.594
                        }
                    ],
                    scale: 7.400799999999999
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Frost",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You create a short cone of Frost in front of you that can deal some damage and Slow a foe's speed, due to their uncontrollable shivering.",
            shortHelp: "Close (Cone), DoT(Cold), Foe -Recharge, -SPD",
            icon: "icyonslaught_frost.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 10.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.27,
                damage: {
                    type: "Cold",
                    scale: 2.808
                },
                dotDamage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 0.845,
                            ticks: 5
                        },
                        {
                            type: "Fire",
                            scale: 0.1215,
                            ticks: 5
                        }
                    ]
                },
                buffDuration: 1.1
            }
        },
        {
            name: "Build Up",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your Accuracy.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "icyonslaught_followup.png",
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
            name: "Ice Patch",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "You emanate a Patch of Ice around you. Foes that step onto the Ice Patch will slip and fall down. This effect lasts until the ice melts. You must be near the ground to activate this power.",
            shortHelp: "Location (PBAoE), Foe Knockdown",
            icon: "icyonslaught_icepatch.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 2.0,
                recharge: 35.0,
                endurance: 10.4,
                cast: 1.57,
                buffDuration: 30.0
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
            icon: "icyonslaught_taunt.png",
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
            name: "Greater Ice Sword",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "Your mastery of Ice allows you to create an enhanced blade of solid ice that deals above average damage. Being hit by the Greater Ice Sword will Slow a villain's attack and movement speed, due to the intense chill.",
            shortHelp: "Melee, DMG(Cold/Lethal), Foe -Recharge, -SPD",
            icon: "icyonslaught_greatericesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 2.33,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 8.2424
                        },
                        {
                            type: "Lethal",
                            scale: 2.0380000000000003
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 11.1624
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Freezing Touch",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Holds", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "This Freezing Touch will encase a single foe in a block of ice. This will deal high damage over time, as well as freezing him in his tracks, leaving him cold and helpless.",
            shortHelp: "Melee, DoT(Cold), Foe Hold",
            icon: "icyonslaught_freezingtouch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 16.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    type: "Cold",
                    scale: 5.84
                },
                dotDamage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 0.5519999999999999,
                            ticks: 10
                        },
                        {
                            type: "Fire",
                            scale: 0.1193,
                            ticks: 10
                        }
                    ]
                },
                buffDuration: 2.6
            }
        },
        {
            name: "Frozen Aura",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Sleep", "Universal Damage Sets"],
            description: "Your mastery of cold enables you to dramatically lower the temperature immediately around you. When you perform a Frozen Aura, nearby foes will be frozen within a fragile casing of ice and suffer a moderate amount of cold damage. These frozen foes will break free if attacked. Frozen Aura deals moderate damage.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
            shortHelp: "PBAoE, DMG(Cold), Foe Sleep",
            icon: "icyonslaught_frozenaura.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.1,
                damage: {
                    type: "Cold",
                    scale: 1.3809
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/ice-melee'] = SCRAPPER_ICE_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_ICE_MELEE_POWERSET = SCRAPPER_ICE_MELEE_POWERSET;
}