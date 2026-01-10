/**
 * Willpower
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_WILLPOWER_POWERSET = {
    name: "Willpower",
    category: "Unknown",
    description: "Willpower powerset",
    icon: "willpower_set.png",
    powers: [
        {
            name: "High Pain Tolerance",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "You have a greater tolerance to pain than others. You are also slightly resistant to all types of damage. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res (All), +MaxHealth",
            icon: "willpower_highpaintolerance.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                resistance: {
                    smashing: 0.056249999999999994,
                    lethal: 0.056249999999999994,
                    fire: 0.056249999999999994,
                    cold: 0.056249999999999994,
                    energy: 0.056249999999999994,
                    negative: 0.056249999999999994,
                    psionic: 0.056249999999999994,
                    toxic: 0.056249999999999994
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Mind Over Body",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "When you toggle on this power, you empower your Mind Over Body to become highly resistant to Smashing, Lethal and Psionic damage.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self +Res(Smash, Lethal, Psionics)",
            icon: "willpower_mindoverbody.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.104,
                cast: 0.67,
                resistance: {
                    smashing: 0.16874999999999998,
                    lethal: 0.16874999999999998,
                    psionic: 0.15
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Fast Healing",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Healing"],
            description: "You heal Hit Points at a faster rate than normal. This power is always on.",
            shortHelp: "Auto: Self +Regeneration",
            icon: "willpower_fasthealing.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    regeneration: 0.25949999999999995
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Indomitable Will",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "When you toggle on this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusions, Repel, Knockback and Hold effects. Indomitable Will also grants a moderate defense to Psionic based attacks.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback). DEF(Psionics)",
            icon: "willpower_indomitablewill.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 0.73,
                protection: {
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    fear: 10.379999999999999,
                    confuse: 10.379999999999999,
                    immobilize: 10.379999999999999
                },
                debuffResistance: {
                    tohit: 0.3,
                    defense: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                stun: 1.0,
                stunDuration: 0.75,
                buffDuration: 0.75,
                tohitBuff: 0.3,
                defenseBuff: 0.3
            }
        },
        {
            name: "Rise to the Challenge",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Threat Duration", "To Hit Debuff"],
            description: "The more the odds are against you, the more determined you become. When surrounded by foes, your ability to regenerate health increases greatly. Additionally, your resolve and the look in your eye is enough to leave most foes shaken, so their attacks are less accurate. The first foe you engage in melee grants the highest regeneration bonus, and up to 10 foes can contribute to this effect.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +Regen, Foe -To Hit",
            icon: "willpower_risetothechallenge.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.208,
                cast: 3.0,
                tohitDebuff: 0.5,
                buffDuration: 1.0
            }
        },
        {
            name: "Quick Recovery",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Endurance Modification"],
            description: "You recover Endurance at a faster rate than normal. This power is always on.",
            shortHelp: "Auto: Self +Recovery",
            icon: "willpower_quickrecovery.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                buffDuration: 10.25
            }
        },
        {
            name: "Heightened Senses",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You become more aware of your environment and its hazards while this power is activated. This will increase your Defense versus environmental damage as long as it is active. Your Heightened Senses also allow you to perceive stealthy foes and resist Defense DeBuffs.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Smash, Lethal, Fire, Cold, Energy, Negative Energy), +Per",
            icon: "willpower_heightenedsenses.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.104,
                cast: 0.67,
                debuffResistance: {
                    defense: 0.173
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Resurgence",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Should you fall in battle, you can Revive yourself from the brink of death. You will revive with most of your Hit Points and half your Endurance and be protected from XP Debt for 90 seconds. Additionally, for 90 seconds, your damage and chance to hit will be improved, then for another 45 seconds, your damage and chance to hit will be diminished. You will also have 15 seconds of immunity to most damage.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Self Rez, Special",
            icon: "willpower_resurgence.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 300.0,
                cast: 1.5,
                buffDuration: 0.5,
                tohitBuff: 3.0,
                tohitDebuff: 3.0
            }
        },
        {
            name: "Strength of Will",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "When you activate this power, you not only become extremely resistant to most damage, but also to Disorient, Immobilization, Hold, Knockback, Repel and Sleep effects. Strength of Will costs little Endurance to activate and increases your recovery for its duration, but when it wears off you are left exhausted, and substantially drained of Endurance.<br><br><color #fcfc95>Notes: Strength of Will is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Self, +Res(Disorient, Sleep, Hold, Immobilize, Repel, Knockback, All DMG), +Recovery",
            icon: "willpower_strengthofwill.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 300.0,
                endurance: 2.6,
                cast: 3.1,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.5,
                            ticks: 60
                        },
                        {
                            type: "Lethal",
                            scale: 2.5,
                            ticks: 60
                        },
                        {
                            type: "Fire",
                            scale: 1.25,
                            ticks: 60
                        },
                        {
                            type: "Cold",
                            scale: 1.25,
                            ticks: 60
                        },
                        {
                            type: "Energy",
                            scale: 1.25,
                            ticks: 60
                        },
                        {
                            type: "Negative",
                            scale: 1.25,
                            ticks: 60
                        },
                        {
                            type: "Psionic",
                            scale: 1.25,
                            ticks: 60
                        },
                        {
                            type: "Toxic",
                            scale: 1.25,
                            ticks: 60
                        }
                    ]
                },
                protection: {
                    stun: 17.299999999999997,
                    sleep: 17.299999999999997,
                    immobilize: 17.299999999999997,
                    hold: 17.299999999999997
                },
                resistance: {
                    smashing: 0.1875,
                    lethal: 0.1875,
                    fire: 0.09375,
                    cold: 0.09375,
                    energy: 0.09375,
                    negative: 0.09375,
                    psionic: 0.09375,
                    toxic: 0.09375
                },
                buffDuration: 120.0,
                stun: 1.0,
                stunDuration: 120.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/willpower'] = SCRAPPER_WILLPOWER_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_WILLPOWER_POWERSET = SCRAPPER_WILLPOWER_POWERSET;
}