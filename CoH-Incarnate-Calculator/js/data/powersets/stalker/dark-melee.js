/**
 * Dark Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_DARK_MELEE_POWERSET = {
    name: "Dark Melee",
    category: "Unknown",
    description: "Dark Melee powerset",
    icon: "dark-melee_set.png",
    powers: [
        {
            name: "Shadow Punch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee Damage", "Stalker Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a quick punch that deals minor damage. Shadow Punches cloud the target's vision, lowering their chance to hit for a short time.",
            shortHelp: "Melee, DMG(Smash/Negative), Foe -To Hit",
            icon: "shadowfighting_shadowpunch.png",
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
                            type: "Negative",
                            scale: 1.1606
                        },
                        {
                            type: "Smashing",
                            scale: 0.7804
                        }
                    ],
                    scale: 1.941
                },
                tohitDebuff: 0.75,
                buffDuration: 6.0
            }
        },
        {
            name: "Smite",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee Damage", "Stalker Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a Smite that deals more damage than Shadow Punch, but has a longer recharge time. Smite clouds the target's vision, lowering their chance to hit for a short time.",
            shortHelp: "Melee, DMG(Smash/Negative), Foe -To Hit",
            icon: "shadowfighting_smite.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 0.97,
                damage: {
                    types: [
                        {
                            type: "Negative",
                            scale: 1.9891999999999999
                        },
                        {
                            type: "Smashing",
                            scale: 0.6496999999999999
                        }
                    ],
                    scale: 2.6388999999999996
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Shadow Maul",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee AoE Damage", "Stalker Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You wrap your entire arms with Negative Energy channeled from the Netherworlds, then perform a series of blows that deal a lot of damage over a short period of time to multiple targets in front of you. These blows cloud your target's vision, lowering their chance to hit for a short time.",
            shortHelp: "Melee (Cone), DoT(Smash/Negative), Foe -To Hit",
            icon: "shadowfighting_shadowmaul.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 2.0944,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.37,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 0.44079999999999997,
                            ticks: 3
                        },
                        {
                            type: "Negative",
                            scale: 0.44079999999999997,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 2.0,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Assassin's Eclipse",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior smashing and negative damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Smashing, Negative)",
            icon: "shadowfighting_assassinstrike.png",
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
            icon: "shadowfighting_buildup.png",
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
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Blow. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "shadowfighting_placate.png",
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
            name: "Siphon Life",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Melee Damage", "Stalker Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You tap the power of the Netherworld and create a life transferring conduit between a foe and yourself. This will transfer Hit Points from your enemy to yourself. Foes Siphoned in this manner have their chance to hit reduced.",
            shortHelp: "Melee, DMG(Negative), Foe -To Hit, Self +HP",
            icon: "shadowfighting_siphonlife.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.93,
                damage: {
                    type: "Negative",
                    scale: 4.1109
                },
                healing: {
                    scale: 120.4759,
                    perTarget: true
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Touch of Fear",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "Melee AoE Damage", "Stalker Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "The Netherworld is one scary place, and with but a touch, you can give your enemy a glimpse into this dark world. This will cause them to helplessly tremble in Fear. Foes in this state of panic have their chance to hit reduced.",
            shortHelp: "Melee (Targeted AoE), DMG(Negative), Fear, Foe -To Hit",
            icon: "shadowfighting_touchoffearaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.97
            }
        },
        {
            name: "Midnight Grasp",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Immobilize", "Melee Damage", "Stalker Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe and continuously drain their life force as well as reducing their chance to hit.",
            shortHelp: "Melee, DMG(Negative), Foe Immobilize, -To Hit",
            icon: "shadowfighting_midnightgrasp.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 15.0,
                endurance: 11.96,
                cast: 2.07,
                damage: {
                    type: "Negative",
                    scale: 4.1167
                },
                dotDamage: {
                    type: "Negative",
                    scale: 0.11,
                    ticks: 4
                },
                tohitDebuff: 0.75,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/dark-melee'] = STALKER_DARK_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_DARK_MELEE_POWERSET = STALKER_DARK_MELEE_POWERSET;
}