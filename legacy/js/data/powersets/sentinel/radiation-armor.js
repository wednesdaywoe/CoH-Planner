/**
 * Radiation Armor
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_RADIATION_ARMOR_POWERSET = {
    name: "Radiation Armor",
    category: "Unknown",
    description: "Radiation Armor powerset",
    icon: "radiation-armor_set.png",
    powers: [
        {
            name: "Alpha Barrier",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You cloak yourself in a field of protective radiation that grants you a good deal of resistance to Lethal, Smashing and Toxic damage.",
            shortHelp: "Toggle: Self +Res(Lethal, Smash, Toxic)",
            icon: "radiationarmor_alphabarrier.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.67,
                resistance: {
                    smashing: 0.21000000000000002,
                    lethal: 0.21000000000000002,
                    toxic: 0.24500000000000002
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Gamma Boost",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "Gamma Boost grants you a passive boost to both regeneration and recovery. The lower your current health is, the greater the regeneration bonus you'll receive from Gamma Boost. The higher your current health is, the greater the recovery bonus you'll receive from Gamma Boost. This power is always active.",
            shortHelp: "Auto: Self +Regen, +Recovery, Special",
            icon: "radiationarmor_gammaboost.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    regeneration: 0.1384
                },
                buffDuration: 1.25
            }
        },
        {
            name: "Proton Armor",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "When active, your body is encased in a shield-like radiation barrier that gives you good resistance to Energy and Fire damage and moderate resistance to Cold and Negative Energy attacks.",
            shortHelp: "Toggle: Self, +Res(Energy, Fire, Cold and Negative)",
            icon: "radiationarmor_protonarmor.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.67,
                resistance: {
                    energy: 0.28,
                    fire: 0.21000000000000002,
                    negative: 0.21000000000000002,
                    cold: 0.052500000000000005
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Fallout Shelter",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "While active you are protected from recharge, movement, hold, sleep, immobilize, stun and knockdown effects. Additionally Fallout Shelter grants you minor resistance to toxic and psionic damage as well as a measure of resistance against slow effects.",
            shortHelp: "Toggle: Self +Res(Hold, Sleep, Immobilize, Stun, Knockdown, Toxic, Psi, Slow)",
            icon: "radiationarmor_falloutshelter.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 0.73,
                protection: {
                    hold: 8.304,
                    stun: 8.304,
                    sleep: 8.304,
                    immobilize: 8.304
                },
                resistance: {
                    fire: 0.035,
                    energy: 0.035,
                    negative: 0.035,
                    psionic: 0.10500000000000001,
                    toxic: 0.10500000000000001
                },
                debuffResistance: {
                    recharge: 0.29064,
                    movement: 0.29064,
                    tohit: 0.3
                },
                stun: 1.0,
                stunDuration: 0.75,
                buffDuration: 0.75,
                tohitBuff: 0.3
            }
        },
        {
            name: "Proton Therapy",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You concentrate your energies to harness the healing powers of radiation to mend your wounds. The effects of Proton Therapy also leaves you resistant to Toxic damage and regeneration debuffs for a while, in addition to giving you some endurance over time.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Self Heal, Endurance over time, Res(Toxic, -Regen)",
            icon: "radiationarmor_protontherapy.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 50.0,
                endurance: 10.4,
                cast: 1.03,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 30
                },
                resistance: {
                    toxic: 0.14
                },
                debuffResistance: {
                    regeneration: 0.2076
                },
                healing: {
                    scale: 301.18975
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Particle Acceleration",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "Your Particles have been accelerated allowing you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
            shortHelp: "Auto: Self +Recharge, +SPD, Res (Slow)",
            icon: "radiationarmor_particleacceleration.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    recharge: 0.4,
                    movement: 0.4
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Particle Shielding",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You channel a tremendous amount of radiation into a barrier around you. For a short time you will have a strong absorption shield in addition to a regeneration and recovery buff.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self, +Absorb, +Regeneration",
            icon: "radiationarmor_particleshielding.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 120.0,
                endurance: 10.4,
                cast: 0.73,
                buffDuration: 60.0
            }
        },
        {
            name: "Ground Zero",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate Healing", "Defense Debuff", "Healing", "Melee AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You release a mixture of radiation into the area. Nearby foes will be barraged with harmful radiation and will suffer Moderate Energy damage immediately, followed by moderate toxic damage over time. Affected foes will also have their defense reduced. Nearby allies will be healed for a moderate amount and will recover health over time. This power can affect a total of 30 targets. This includes both friends and foes. Ground Zero has no effect on the caster, only nearby allies and enemies.",
            shortHelp: "PBAoE, Foe DMG(Energy), DoT (Toxic), -DEF(All), Ally +HP, +Heal over time",
            icon: "radiationarmor_groundzero.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.2,
                recharge: 90.0,
                endurance: 13.0,
                cast: 3.0
            }
        },
        {
            name: "Meltdown",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Resist Damage"],
            description: "After building up a dangerous amount of radiation you release it to both shield and empower yourself. While active you will gain a good amount of damage resistance to all types of damage, recover endurance more quickly and deal more damage for a short time. When this power wears off you will lose a small amount endurance.",
            shortHelp: "Self, +Res(All), +Recovery, +DMG(All)",
            icon: "radiationarmor_meltdown.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 480.0,
                endurance: 2.6,
                cast: 2.93,
                resistance: {
                    smashing: 0.14,
                    lethal: 0.14,
                    fire: 0.14,
                    cold: 0.14,
                    energy: 0.14,
                    negative: 0.14,
                    psionic: 0.14,
                    toxic: 0.14
                },
                debuffResistance: {
                    recovery: 1.0
                },
                buffDuration: 60.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/radiation-armor'] = SENTINEL_RADIATION_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_RADIATION_ARMOR_POWERSET = SENTINEL_RADIATION_ARMOR_POWERSET;
}