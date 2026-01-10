/**
 * Regeneration
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_REGENERATION_POWERSET = {
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
                    toxic: 0.2
                },
                healing: {
                    scale: 468.51725,
                    perTarget: true
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Quick Recovery",
            available: 1,
            tier: 1,
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
            available: 5,
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
                recharge: 360.0,
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
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Threat Duration"],
            description: "You can Integrate your mind and body, making you resistant to Knockback, Disorient, Hold, Sleep, and Immobilization effects, as well as increase your regeneration rate, for as long as you can keep this toggle power active. Integration also taunts nearby foes.",
            shortHelp: "Toggle: Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize), +Regeneration, Taunt",
            icon: "regeneration_integration.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.52,
                cast: 3.1,
                protection: {
                    hold: 12.975,
                    stun: 12.975,
                    sleep: 12.975,
                    immobilize: 12.975
                },
                debuffResistance: {
                    tohit: 0.3,
                    defense: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                buffDuration: 2.25,
                stun: 1.0,
                stunDuration: 2.25,
                tohitBuff: 0.3,
                defenseBuff: 0.3
            }
        },
        {
            name: "Resilience",
            available: 11,
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
                    stun: 6.4875
                },
                resistance: {
                    smashing: 0.125,
                    lethal: 0.125,
                    fire: 0.125,
                    cold: 0.125,
                    energy: 0.125,
                    negative: 0.125,
                    psionic: 0.125,
                    toxic: 0.125
                },
                stun: 1.0,
                stunDuration: 10.25,
                buffDuration: 10.25
            }
        },
        {
            name: "Reactive Regeneration",
            available: 17,
            tier: 4,
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
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "When you use this power you will recover a percentage of your missing health, in addition to increasing your maximum hit points. Should you fall in battle after using this power, you can stand up and fight again. If used while defeated, you will enter stand back up and be protected from XP Debt for 90 seconds and immune to most damage for 15 seconds.",
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
            available: 25,
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
    POWERSETS['tanker/regeneration'] = TANKER_REGENERATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_REGENERATION_POWERSET = TANKER_REGENERATION_POWERSET;
}