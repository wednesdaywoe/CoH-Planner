/**
 * Thermal Radiation
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_THERMAL_RADIATION_POWERSET = {
    name: "Thermal Radiation",
    category: "Unknown",
    description: "Thermal Radiation powerset",
    icon: "thermal-radiation_set.png",
    powers: [
        {
            name: "Thermal Shield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Casts a Thermal Shield on one of your allies and grants them damage resistance to Lethal, Smashing and Fire damage. Thermal Shield also provides minimal resistance to Cold damage. You cannot stack multiple Thermal Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Plasma Shield. You cannot use this power on yourself.",
            shortHelp: "Ranged, Ally +Res(Fire, Lethal, Smash, Cold)",
            icon: "thermalradiation_fireshield.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Lethal",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Fire",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Cold",
                            scale: 1.0,
                            ticks: 120
                        }
                    ]
                },
                buffDuration: 240.0
            }
        },
        {
            name: "Warmth",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can use your Warmth to heal some of your wounds, and the wounds of your group. This power has a small radius, so your allies need to be near you if they wish to be affected.",
            shortHelp: "PBAoE, Team +Heal",
            icon: "thermalradiation_warmth.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 8.0,
                endurance: 13.0,
                cast: 2.03
            }
        },
        {
            name: "Cauterize",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Heals a single targeted ally by cauterizing their wounds. You cannot use this power to heal yourself.",
            shortHelp: "Ally Heal",
            icon: "thermalradiation_cauterize.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 13.0,
                cast: 2.27
            }
        },
        {
            name: "Plasma Shield",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Envelope an ally in pure plasma. The Plasma Shield gives your ally resistance to Energy, Negative Energy, and Fire damage. You cannot stack multiple Plasma Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Fire Shield. You cannot use this power on yourself.",
            shortHelp: "Ranged, Ally +Res(Energy, Negative, Fire)",
            icon: "thermalradiation_plasmashield.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Energy",
                            scale: 2.0,
                            ticks: 120
                        },
                        {
                            type: "Negative",
                            scale: 2.0,
                            ticks: 120
                        }
                    ]
                },
                buffDuration: 240.0
            }
        },
        {
            name: "Power of the Phoenix",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Ranged AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "Revives a fallen ally. The fiery resurrection blasts nearby foes with an explosion and knocks them down and Disorients them. Your ally will revive with most of their Hit Points and Endurance. They will also be invulnerable for a brief time, as well as protected from XPDebt for 90 seconds.",
            shortHelp: "Ally Rez, Special",
            icon: "thermalradiation_phoenix.png",
            powerType: "Click",
            targetType: "Player Ally (Dead)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 15.0,
                recharge: 300.0,
                endurance: 49.4,
                cast: 1.67,
                buffDuration: 0.5
            }
        },
        {
            name: "Thaw",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Warms an ally and frees them from any Disorient, Hold, Sleep, Confuse, Fear, Slow and Immobilize effects and leaves them resistant to such effects for a good while. Thaw also grants the target some resistance to Cold damage. Some of the effects of this power will improve with multiple applications and as you advance in level.",
            shortHelp: "Ally +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Cold, Slow)",
            icon: "thermalradiation_thaw.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 2.17,
                dotDamage: {
                    type: "Cold",
                    scale: 1.0,
                    ticks: 45
                },
                stun: 1.0,
                stunDuration: 90.0,
                buffDuration: 90.0
            }
        },
        {
            name: "Forge",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Forge a single ally target into a killing machine. Forge immensely enhances a single ally's Damage and chance to hit.",
            shortHelp: "Ally +DMG, +To Hit",
            icon: "thermalradiation_forge.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 60.0,
                endurance: 10.4,
                cast: 2.27,
                tohitBuff: 2.0,
                buffDuration: 120.0
            }
        },
        {
            name: "Heat Exhaustion",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "Overwhelm a single foe with waves of exhausting heat. The initial effect will drain the target of some Endurance, but the heat is so overwhelming that the affected target will be weakened. Their Damage output, Endurance Recovery and Hit Point Regeneration will all be reduced.",
            shortHelp: "Ranged Foe -DMG, -END, -Recovery, -Regeneration",
            icon: "thermalradiation_heatexhaustion.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 120.0,
                endurance: 13.0,
                cast: 2.07,
                buffDuration: 40.0
            }
        },
        {
            name: "Melt Armor",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff"],
            description: "The searing heat from this power is enough to melt the armor and defenses of all targets in the affected area. Melt Armor significantly weakens the Defense and Damage Resistance of the affected targets.",
            shortHelp: "Ranged (Targeted AoE), Foe -Res, -DEF",
            icon: "thermalradiation_meltarmor.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 100.0,
                endurance: 18.2,
                cast: 1.5,
                defenseDebuff: 2.0,
                buffDuration: 40.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/thermal-radiation'] = CONTROLLER_THERMAL_RADIATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_THERMAL_RADIATION_POWERSET = CONTROLLER_THERMAL_RADIATION_POWERSET;
}