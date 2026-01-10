/**
 * Claws
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_CLAWS_POWERSET = {
    name: "Claws",
    category: "Unknown",
    description: "Claws powerset",
    icon: "claws_set.png",
    powers: [
        {
            name: "Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You perform a deadly Strike with your claws. This is a basic attack that deals a moderate amount of lethal damage.<br>",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "claws_clawsstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 4.8,
                endurance: 5.4912,
                cast: 1.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.651
                        },
                        {
                            type: "Fire",
                            scale: 0.558
                        }
                    ],
                    scale: 3.2089999999999996
                }
            }
        },
        {
            name: "Swipe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "A quick Swipe with your claws. Does minor lethal damage, but has a quick recharge rate.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "claws_clawsswipe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 2.4,
                endurance: 3.4944,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.907
                        },
                        {
                            type: "Fire",
                            scale: 0.3735
                        }
                    ],
                    scale: 2.2805
                }
            }
        },
        {
            name: "Slash",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You Slash at your foe with your claws, dealing a good amount of lethal damage, but with a longer recharge rate than Swipe or Strike . This attack can reduce a target's Defense, making him easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -DEF",
            icon: "claws_slash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.4,
                endurance: 6.8224,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.0669999999999997
                        },
                        {
                            type: "Fire",
                            scale: 0.666
                        }
                    ],
                    scale: 3.7329999999999997
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Taunt",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To-Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "claws_tauntaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 20.0
            }
        },
        {
            name: "Spin",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You spin around in a circle, attacking everyone within melee range with a Strike attack.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "PBAoE Melee, DMG(Lethal)",
            icon: "claws_spinningclawsattack.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.1456,
                cast: 2.5,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.2039
                        },
                        {
                            type: "Fire",
                            scale: 0.8505
                        }
                    ],
                    scale: 4.0544
                }
            }
        },
        {
            name: "Follow Up",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Tanker Archetype Sets", "Threat Duration", "To Hit Buff", "Universal Damage Sets"],
            description: "You perform a feint attack that deals moderate damage. After this attack hits, it gives you a large bonus Damage and chance to hit for a brief time.",
            shortHelp: "Melee, DMG(Lethal), Self +DMG +To-hit",
            icon: "claws_feint.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 7.8,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.261
                        },
                        {
                            type: "Fire",
                            scale: 0.36
                        }
                    ],
                    scale: 2.621
                },
                tohitBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Focus",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "Projects a burst of focused power over a short distance. Focus deals high damage and can possibly knock down your foe.",
            shortHelp: "Ranged, DMG(Lethal), Knockback",
            icon: "claws_focus.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.1536,
                cast: 1.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.6243
                        },
                        {
                            type: "Fire",
                            scale: 0.6795
                        }
                    ],
                    scale: 3.3038
                }
            }
        },
        {
            name: "Eviscerate",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You spin and slash violently, Eviscerating all foes in a wide arc in front of you.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>5</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe -DEF",
            icon: "claws_evicerate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 11.4816,
                cast: 2.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.9991000000000003
                        },
                        {
                            type: "Fire",
                            scale: 0.9815
                        }
                    ],
                    scale: 4.980600000000001
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Shockwave",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "Projects a Shockwave of focused power that can travel a short distance. Shockwave travels in a wide arc in front of you dealing moderate damage and, possibly knocking back foes.",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe Knockback",
            icon: "claws_wave.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 14.4,
                endurance: 13.4784,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.9222000000000001
                        },
                        {
                            type: "Fire",
                            scale: 0.5084
                        }
                    ],
                    scale: 2.4306
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/claws'] = TANKER_CLAWS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_CLAWS_POWERSET = TANKER_CLAWS_POWERSET;
}