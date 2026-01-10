/**
 * Regeneration
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_REGENERATION_POWERSET = {
    name: "Regeneration",
    category: "Unknown",
    description: "Regeneration powerset",
    icon: "regeneration_set.png",
    powers: [
        {
            name: "Fast Healing",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Healing"],
            description: "You heal Hit Points at a faster rate than normal. This power is always on.",
            shortHelp: "Auto: Self +Regeneration",
            icon: "regeneration_fasthealing.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    regeneration: 0.2
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Reconstruction",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "Through perfect control of your body, you can concentrate for a few moments and heal yourself. The effects of Reconstruction also leaves you resistant to Toxic damage for a while.",
            shortHelp: "Self Heal, Res(Toxic)",
            icon: "regeneration_reconstruction.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 10.4,
                cast: 0.73,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 30
                },
                resistance: {
                    toxic: 0.14
                },
                healing: {
                    scale: 301.18975,
                    perTarget: true
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Quick Recovery",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Endurance Modification"],
            description: "You recover Endurance at a faster rate than normal. This power is always on.",
            shortHelp: "Auto: Self +Recovery",
            icon: "regeneration_quickrecovery.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    recovery: 0.2
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Ailment Resistance",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Healing"],
            description: "Your superior immune system makes you resilient to disease and multiple ailments. Healing techniques also become more effective. This power is always on.",
            shortHelp: "Auto: Self +Max HP, -Res(Heal), Res(-Defense, -Endurance, -Speed, -Regeneration, -Recovery, -Recharge, -Range, -ToHit)",
            icon: "regeneration_resiststun.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    tohit: 0.2,
                    defense: 0.2,
                    recharge: 0.2,
                    movement: 0.2,
                    regeneration: 0.2,
                    recovery: 0.2,
                    endurance: 0.2
                },
                buffDuration: 10.3,
                tohitBuff: 0.2,
                defenseBuff: 0.2
            }
        },
        {
            name: "Integration",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can Integrate your mind and body, making you resistant to Knockback, Disorient, Hold, Sleep, and Immobilization effects, as well as increase your regeneration rate, for as long as you can keep this toggle power active.",
            shortHelp: "Toggle: Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize), +Regeneration",
            icon: "regeneration_integration.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.13,
                cast: 3.1,
                protection: {
                    hold: 8.304,
                    stun: 8.304,
                    sleep: 8.304,
                    immobilize: 8.304
                },
                debuffResistance: {
                    tohit: 0.3,
                    defense: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75,
                tohitBuff: 0.3,
                defenseBuff: 0.3
            }
        },
        {
            name: "Resilience",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "You are more Resilient. This power allows you to build up a resistance to Disorientation effects. You tend not to get Disoriented, and if you do, it wears off quickly. This resistance to Disorientation gets stronger as you go up in level. Resilience also grants some resistance to all types of damage. This power is always on.",
            shortHelp: "Auto: Self +Res(Disorient, All DMG)",
            icon: "regeneration_resist.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                protection: {
                    stun: 4.152
                },
                resistance: {
                    smashing: 0.08750000000000001,
                    lethal: 0.08750000000000001,
                    fire: 0.08750000000000001,
                    cold: 0.08750000000000001,
                    energy: 0.08750000000000001,
                    negative: 0.08750000000000001,
                    psionic: 0.08750000000000001,
                    toxic: 0.08750000000000001
                },
                stun: 1.0,
                stunDuration: 10.25,
                buffDuration: 10.25
            }
        },
        {
            name: "Reactive Regeneration",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "When you activate this power, you can regenerate your health at an astounding rate. This boost becomes stronger every time you take damage, as it scales you also become resistant to regeneration and recovery debuffs as well as endurance drain.",
            shortHelp: "Toggle: Self +Regeneration, +Res(-Regeneration, -End, -Recovery)",
            icon: "regeneration_instanthealing.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.52,
                cast: 1.17
            }
        },
        {
            name: "Second Wind",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "When you use this power you will recover a percentage of your missing health, in addition to increasing your maximum hit points. Should you fall in battle after using this power, you can stand up and fight again. If used while defeated, you will enter stand back up and be protected from XP Debt for 90 seconds and immune to most damage for 15 seconds.<br><br><color #fcfc95>Note: the self resurect granted if this power is activated while alive can not be enhanced.</color>",
            shortHelp: "Self +Max HP, Rez(Special)",
            icon: "regeneration_dullpain.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 360.0,
                endurance: 10.4,
                cast: 0.73
            }
        },
        {
            name: "Moment of Glory",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Resist Damage"],
            description: "When you activate this power, you deal increased damage, recover Endurance more quickly, gain Resistance and Defense to all damage types, and are highly resistant to Knock Back, Sleep, Disorient, Immobilization, and Hold effects.",
            shortHelp: "Self +DMG, +Res(All DMG, Knock Back, Repel, Stun, Hold, Sleep, Immobilize), +DEF(All DMG), +Recovery",
            icon: "regeneration_momentofglory.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 240.0,
                endurance: 2.6,
                cast: 1.5
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/regeneration'] = SENTINEL_REGENERATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_REGENERATION_POWERSET = SENTINEL_REGENERATION_POWERSET;
}