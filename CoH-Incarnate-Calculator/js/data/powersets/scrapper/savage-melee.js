/**
 * Savage Melee
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_SAVAGE_MELEE_POWERSET = {
    name: "Savage Melee",
    category: "Unknown",
    description: "Savage Melee powerset",
    icon: "savage-melee_set.png",
    powers: [
        {
            name: "Maiming Slash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "You execute a savage slash at your foe's lower body causing moderate lethal damage and minor damage over time. The foe will also have their movement speed reduced moderately. Maiming Slash grants 1 stack of Blood Frenzy.",
            shortHelp: "Melee, DMG(Lethal), DoT (Lethal), Foe -Speed, Self +1 Blood Frenzy",
            icon: "savagemelee_maimingslash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 5.0,
                endurance: 6.03,
                cast: 1.17,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.5788
                        },
                        {
                            type: "Fire",
                            scale: 0.522
                        }
                    ],
                    scale: 3.1008000000000004
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Savage Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You quickly tear at your foe dealing minor lethal damage and causing minor lethal damage over time. This power can bruise an enemy, making them more vulnerable to damage. Savage Strikes grants you 1 stack of Blood Frenzy.",
            shortHelp: "Melee, DMG(Lethal), Foe DoT (Lethal), Self +1 Blood Frenzy",
            icon: "savagemelee_savagestrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 2.5,
                endurance: 3.952,
                cast: 0.8,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.9101,
                            ticks: 1
                        },
                        {
                            type: "Fire",
                            scale: 0.171,
                            ticks: 1
                        }
                    ]
                },
                buffDuration: 0.4
            }
        },
        {
            name: "Shred",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You rapidly slash at your foes several times causing a moderate amount of damage to all enemies in front of you and reduce their defense. Shred also causes minor lethal damage over time. This power grants 1 stack of Blood Frenzy.",
            shortHelp: "Melee (Cone), DMG(Lethal), Foe DoT (Lethal), -Def(All), Self +1 Blood Frenzy",
            icon: "savagemelee_shred.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.3963,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 7.5,
                endurance: 8.11,
                cast: 2.17,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.5091,
                            ticks: 5
                        },
                        {
                            type: "Fire",
                            scale: 0.0946,
                            ticks: 5
                        }
                    ]
                },
                buffDuration: 2.0,
                defenseDebuff: 1.2
            }
        },
        {
            name: "Blood Thirst",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "You unleash your frenzy, increasing your chance to inflict Bleed to 100% as well as increasing your damage and chance to hit moderately. Blood Thirst also grants 5 stacks of Frenzy Fury.",
            shortHelp: "Self +DMG, +To Hit, +Special, +5 Blood Frenzy",
            icon: "savagemelee_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 7.8,
                cast: 2.0,
                tohitBuff: 1.0,
                buffDuration: 15.0
            }
        },
        {
            name: "Vicious Slash",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You tear at your foe with both hands dealing high lethal damage and causing minor lethal damage over time. Foes struck by this attack have a high chance to be knocked down.",
            shortHelp: "Melee, DMG(Lethal), Foe DoT (Lethal), Knockdown, Self +2 Blood Frenzy",
            icon: "savagemelee_viciousslash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 9.0,
                endurance: 9.36,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.7289000000000003
                        },
                        {
                            type: "Fire",
                            scale: 0.81
                        }
                    ],
                    scale: 4.5389
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
            shortHelp: "Ranged, Foe Taunt",
            icon: "savagemelee_confront.png",
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
            name: "Rending Flurry",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You wildly slash at nearby foes to deal moderate lethal damage and cause minor lethal damage over time. This power consumes all Blood Frenzy and will deal additional damage per stack of Blood Frenzy consumed. If you have 5 stacks of Blood Frenzy while activating this power, its radius is greatly increased, but causes you to become Exhausted for a short time. While exhausted you cannot gain Blood Frenzy.",
            shortHelp: "PBAoE, DMG(Lethal), Foe DoT (Lethal), -Blood Frenzy",
            icon: "savagemelee_rendingflurry.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.17
            }
        },
        {
            name: "Hemorrhage",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You viciously tear at your foe causing a light amount of lethal damage. Additionally, the target will suffer from lethal damage over time. Hemorrhage consumes all stacks of Blood Frenzy. This power's damage over time effect will scale with the number of stacks of Blood Frenzy. Using this power with 5 stacks of Blood Frenzy causes you to become Exhausted for a short time, but the duration of Hemorrhage's damage over time effect is increased. While exhausted you cannot gain Blood Frenzy.",
            shortHelp: "Melee, DMG(Lethal), Foe Special DoT (Lethal), -Blood Frenzy",
            icon: "savagemelee_hemorrhage.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.0,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.4498
                        },
                        {
                            type: "Fire",
                            scale: 0.351
                        }
                    ],
                    scale: 1.8008
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1638,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        },
        {
            name: "Savage Leap",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Teleport", "Universal Damage Sets", "Universal Travel"],
            description: "You throw yourself at your distant foes while slashing and tearing wildly dealing moderate lethal damage and causing your foes to suffer from additional minor lethal damage over time. The damage of this power can increase based on how far away you leap from, with up to double damage dealt at its strongest. Savage Leap build 1 stacks of Blood Frenzy for every 20 ft in between your target and you, up to 3 stacks.>",
            shortHelp: "PBAoE, DMG(Lethal), Foe DoT (Lethal), Self 1 to 3 Blood Frenzy, Teleport",
            icon: "savagemelee_savageleap.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 40.0,
                endurance: 17.58,
                cast: 1.17
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/savage-melee'] = SCRAPPER_SAVAGE_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_SAVAGE_MELEE_POWERSET = SCRAPPER_SAVAGE_MELEE_POWERSET;
}