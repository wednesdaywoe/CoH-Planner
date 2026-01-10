/**
 * Radiation Armor
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_RADIATION_ARMOR_POWERSET = {
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
                    smashing: 0.22499999999999998,
                    lethal: 0.22499999999999998,
                    toxic: 0.2625
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
                    regeneration: 0.173
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
                    energy: 0.3,
                    fire: 0.22499999999999998,
                    negative: 0.22499999999999998,
                    cold: 0.056249999999999994
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
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    immobilize: 10.379999999999999
                },
                resistance: {
                    fire: 0.0375,
                    energy: 0.0375,
                    negative: 0.0375,
                    psionic: 0.11249999999999999,
                    toxic: 0.11249999999999999
                },
                debuffResistance: {
                    recharge: 0.3633,
                    movement: 0.3633,
                    tohit: 0.3
                },
                stun: 1.0,
                stunDuration: 0.75,
                buffDuration: 0.75,
                tohitBuff: 0.3
            }
        },
        {
            name: "Radiation Therapy",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Brute Archetype Sets", "Endurance Modification", "Healing", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You channel a tremendous amount of radiation into a barrier around you. For a short time you will have a strong absorption shield in addition to a regeneration and recovery buff.<br><br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>15</color> </color> seconds and each affected foe will increase the recharge by a varying amount. First target adds <color #FF7F27>12</color> seconds for a maximum total of <color #FF7F27>60</color> seconds.</color>",
            shortHelp: "PBAoE, Minor DMG(Energy), Minor DoT(Toxic), Foe -Regen, Self +HP, +End, Res(-Regen)",
            icon: "radiationarmor_radiationtherapy.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.2,
                recharge: 60.0,
                endurance: 13.0,
                cast: 1.03
            }
        },
        {
            name: "Beta Decay",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Debuff", "Threat Duration", "To Hit Debuff"],
            description: "While Beta Decay is active, nearby foes will have their chance to hit and defense decreased slightly and will be taunted. You will gain a recharge bonus per nearby target up to 10 targets. The first target grants the largest benefit.",
            shortHelp: "Toggle: Foe, Taunt, -To Hit, -Defense, Self +Recharge",
            icon: "radiationarmor_betadecay.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.208,
                cast: 0.67,
                tohitDebuff: 0.75,
                buffDuration: 1.0,
                defenseDebuff: 1.5
            }
        },
        {
            name: "Particle Shielding",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
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
            allowedSetCategories: ["Accurate Defense Debuff", "Brute Archetype Sets", "Defense Debuff", "Healing", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
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
            description: "After building up a dangerous amount of radiation you release it to both shield and empower yourself. While active you will gain a good amount of damage resistance to all types of damage, recover endurance more quickly and deal more damage for a short time. When this power wears off you will lose a small amount of endurance.<br><br><color #fcfc95>Recharge: Very Long.</color>",
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
                    smashing: 0.15,
                    lethal: 0.15,
                    fire: 0.15,
                    cold: 0.15,
                    energy: 0.15,
                    negative: 0.15,
                    psionic: 0.15,
                    toxic: 0.15
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
    POWERSETS['brute/radiation-armor'] = BRUTE_RADIATION_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_RADIATION_ARMOR_POWERSET = BRUTE_RADIATION_ARMOR_POWERSET;
}