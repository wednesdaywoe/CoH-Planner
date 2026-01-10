/**
 * Martial Arts
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_MARTIAL_ARTS_POWERSET = {
    name: "Martial Arts",
    category: "Unknown",
    description: "Martial Arts powerset",
    icon: "martial-arts_set.png",
    powers: [
        {
            name: "Storm Kick",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can unleash a roundhouse kick that pummels your foe for moderate damage. Storm Kick has a greater then average chance to score a critical hit.",
            shortHelp: "Melee, DMG(Smashing)",
            icon: "martialarts_stormkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 0.83,
                damage: {
                    type: "Smashing",
                    scale: 2.5410000000000004
                }
            }
        },
        {
            name: "Thunder Kick",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You can perform a strong Thunder Kick that hits so hard it can Disorient your target.",
            shortHelp: "Melee, DMG(Smashing), Minor Disorient",
            icon: "martialarts_thunderkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    type: "Smashing",
                    scale: 1.9409999999999998
                }
            }
        },
        {
            name: "Crippling Axe Kick",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Immobilize", "Melee Damage", "Slow Movement", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can perform a Crippling Axe Kick that deals moderate smashing damage, reduces the targets defense, may Immobilize, and Slowing their run speed. Crippling Axe Kick may also knock some flying entities out of the sky.",
            shortHelp: "Melee, DMG(Smashing), Foe Immobilize, -SPD, -Fly, -DEF",
            icon: "martialarts_cripplinghookkick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.6,
                damage: {
                    type: "Smashing",
                    scale: 4.0799
                },
                buffDuration: 8.0,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Assassin's Blow",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Smashing)",
            icon: "martialarts_assassinstrike.png",
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
            name: "Focus Chi",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Tapping into your inner Chi greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "martialarts_focuschi.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Blow. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "martialarts_placate.png",
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
            name: "Cobra Strike",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Using intense martial arts focus, you can perform a Cobra Strike that deals minor damage, but has a great chance of Disorienting your target.",
            shortHelp: "Melee, DMG(Smashing), Foe Disorient",
            icon: "martialarts_cobrastrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                damage: {
                    type: "Smashing",
                    scale: 3.9290000000000003
                }
            }
        },
        {
            name: "Crane Kick",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can perform a slow, high smashing damage kick that will likely knock your target back.",
            shortHelp: "Melee, DMG(Smashing), Knockback",
            icon: "martialarts_cranekick.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 11.856,
                cast: 1.67,
                damage: {
                    type: "Smashing",
                    scale: 3.9289
                }
            }
        },
        {
            name: "Eagles Claw",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You can perform a devastating smashing damage kick that can severely Disorient most opponents. Eagle's Claw has an exceptionally good critical hit capability. In addition to the normal Critical from attacking while Hidden, there is also a small chance you may land a Critical hit even if you are not Hidden.",
            shortHelp: "Melee, DMG(Smashing), Foe Minor Disorient, +Special",
            icon: "martialarts_eaglesclaw.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.53,
                damage: {
                    type: "Smashing",
                    scale: 5.731
                },
                stun: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/martial-arts'] = STALKER_MARTIAL_ARTS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_MARTIAL_ARTS_POWERSET = STALKER_MARTIAL_ARTS_POWERSET;
}