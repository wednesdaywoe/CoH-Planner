/**
 * Claws
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_CLAWS_POWERSET = {
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
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You perform a deadly Strike with your claws. This is a basic attack that deals a moderate amount of lethal damage.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "claws_clawsstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.2,
                endurance: 4.16,
                cast: 1.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 5.9338
                        },
                        {
                            type: "Fire",
                            scale: 0.486
                        }
                    ],
                    scale: 6.4197999999999995
                }
            }
        },
        {
            name: "Swipe",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "A quick Swipe with your claws. Does minor lethal damage, but has a quick recharge rate.",
            shortHelp: "Melee, DMG(Lethal)",
            icon: "claws_clawsswipe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 1.7,
                endurance: 2.912,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.4059
                        },
                        {
                            type: "Fire",
                            scale: 0.47700000000000004
                        }
                    ],
                    scale: 4.8829
                }
            }
        },
        {
            name: "Slash",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You Slash at your foe with your claws, dealing a good amount of lethal damage, but with a longer recharge rate than Swipe or Strike . This attack can reduce a target's Defense, making him easier to hit.",
            shortHelp: "Melee, DMG(Lethal), Foe -DEF",
            icon: "claws_slash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 4.8,
                endurance: 5.4912,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 7.0059000000000005
                        },
                        {
                            type: "Fire",
                            scale: 0.594
                        }
                    ],
                    scale: 7.599900000000001
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Spin",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You spin around in a circle, attacking everyone within melee range with a Strike attack.",
            shortHelp: "PBAoE Melee, DMG(Lethal)",
            icon: "claws_spinningclawsattack.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 9.2,
                endurance: 9.152,
                cast: 2.5,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 7.6176
                        },
                        {
                            type: "Fire",
                            scale: 0.711
                        }
                    ],
                    scale: 8.3286
                }
            }
        },
        {
            name: "Follow Up",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "To Hit Buff", "Universal Damage Sets"],
            description: "You perform a feint attack that deals moderate damage. After this attack hits, it gives you a large bonus Damage and chance to hit for a brief time.",
            shortHelp: "Melee, DMG(Lethal), Self +DMG +To Hit",
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
                            scale: 5.3218000000000005
                        },
                        {
                            type: "Fire",
                            scale: 0.36
                        }
                    ],
                    scale: 5.681800000000001
                },
                tohitBuff: 1.0,
                buffDuration: 10.0
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
            shortHelp: "Ranged, Foe Taunt",
            icon: "claws_taunt.png",
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
            name: "Focus",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "Projects a burst of focused power over a short distance. Focus deals high damage and can possibly knock down your foe.",
            shortHelp: "Ranged, DMG(Lethal), Knockback",
            icon: "claws_focus.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 6.4,
                endurance: 6.8224,
                cast: 1.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 6.529799999999999
                        },
                        {
                            type: "Fire",
                            scale: 0.6255
                        }
                    ],
                    scale: 7.155299999999999
                }
            }
        },
        {
            name: "Eviscerate",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You spin and slash violently, Eviscerating all foes in a wide arc in front of you. This attack has an exceptionally good critical hit capability, better than other Claw attacks, that can sometimes deal double damage.",
            shortHelp: "Melee (Cone), DMG(Lethal), +Special",
            icon: "claws_evicerate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.867,
                endurance: 8.875,
                cast: 2.33,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 7.7818000000000005
                        },
                        {
                            type: "Fire",
                            scale: 0.8955
                        }
                    ],
                    scale: 8.6773
                }
            }
        },
        {
            name: "Shockwave",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
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
                recharge: 12.1,
                endurance: 11.5648,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.4022
                        },
                        {
                            type: "Fire",
                            scale: 0.4725
                        }
                    ],
                    scale: 4.8747
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/claws'] = SCRAPPER_CLAWS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_CLAWS_POWERSET = SCRAPPER_CLAWS_POWERSET;
}