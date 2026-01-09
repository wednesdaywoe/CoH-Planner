/**
 * Ice Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_ICE_MELEE_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                dotDamage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 0.9511000000000001,
                            ticks: 1
                        },
                        {
                            type: "Smashing",
                            scale: 0.27449999999999997,
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
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                            scale: 1.794
                        },
                        {
                            type: "Lethal",
                            scale: 1.0974
                        }
                    ],
                    scale: 2.8914
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
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                dotDamage: {
                    type: "Cold",
                    scale: 0.5575,
                    ticks: 5
                },
                buffDuration: 1.1
            }
        },
        {
            name: "Assassin's Ice Sword",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does cold damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous cold damage, as you impale your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Cold)",
            icon: "icyonslaught_assassin.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.67
            }
        },
        {
            name: "Placate",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Strike. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "icyonslaught_placate.png",
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
            name: "Build Up",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Burmal lowers the temperature of your hands even further, making all your icy attacks do additional cold damage over time. It also greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your Accuracy.",
            shortHelp: "Self +DMG, +To Hit, +Special",
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
            available: 17,
            tier: 4,
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
            name: "Freezing Touch",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Holds", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                dotDamage: {
                    type: "Cold",
                    scale: 0.4227,
                    ticks: 10
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
            allowedSetCategories: ["Melee AoE Damage", "Sleep", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                    scale: 1.068
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/ice-melee'] = STALKER_ICE_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_ICE_MELEE_POWERSET = STALKER_ICE_MELEE_POWERSET;
}