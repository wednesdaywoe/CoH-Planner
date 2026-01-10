/**
 * Regeneration
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_REGENERATION_POWERSET = {
    name: "Regeneration",
    category: "Unknown",
    description: "Regeneration powerset",
    icon: "regeneration_set.png",
    powers: [
        {
            name: "Hide",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Hide makes you almost impossible to detect. When properly 'Hidden\", a Stalker can pull off Critical hits with his attacks, and even land a massive 'Assassins Strike' with an Assassins power. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense. Unlike most stealth powers, Hide can be used at the same time as other Concealment powers, giving you even greater stealth capability. No Endurance cost.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
            icon: "regeneration_hide.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                cast: 0.73,
                buffDuration: 0.75
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
                    toxic: 0.15
                },
                healing: {
                    scale: 301.18975,
                    perTarget: true
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Fast Healing",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You heal Hit Points and recovery Endurance at a faster rate than normal. This power is always on.",
            shortHelp: "Auto: Self +Regeneration, +Recovery",
            icon: "regeneration_fasthealing.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    regeneration: 0.2,
                    recovery: 0.2
                },
                buffDuration: 10.0
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
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    immobilize: 10.379999999999999
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
                    stun: 5.1899999999999995
                },
                resistance: {
                    smashing: 0.09375,
                    lethal: 0.09375,
                    fire: 0.09375,
                    cold: 0.09375,
                    energy: 0.09375,
                    negative: 0.09375,
                    psionic: 0.09375,
                    toxic: 0.09375
                },
                stun: 1.0,
                stunDuration: 10.25,
                buffDuration: 10.25
            }
        },
        {
            name: "Instant Healing",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "When you activate this power, you can regenerate your health at an astounding rate. This boost to your Regeneration Rate lasts about a minute and takes a long time to recharge once used.<br><br>This power is mutually exclusive from Reactive Regeneration.",
            shortHelp: "Click: Self +Regeneration",
            icon: "regeneration_instanthealing.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 650.0,
                endurance: 10.4,
                cast: 1.17,
                buffDuration: 90.0
            }
        },
        {
            name: "Reactive Regeneration",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "When you activate this power, you can regenerate your health at an astounding rate. This boost becomes stronger every time you take damage, as it scales you also become resistant to regeneration and recovery debuffs as well as endurance drain.<br><br>This power is mutually exclusive from Instant Healing.",
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
            allowedEnhancements: ["Recharge"],
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
    POWERSETS['stalker/regeneration'] = STALKER_REGENERATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_REGENERATION_POWERSET = STALKER_REGENERATION_POWERSET;
}