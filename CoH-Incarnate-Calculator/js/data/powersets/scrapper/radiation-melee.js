/**
 * Radiation Melee
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_RADIATION_MELEE_POWERSET = {
    name: "Radiation Melee",
    category: "Unknown",
    description: "Radiation Melee powerset",
    icon: "radiation-melee_set.png",
    powers: [
        {
            name: "Contaminated Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You charge your fist with harmful radioactive particles and quickly strike your foe dealing Light Energy and Smashing damage as well as reducing their defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe -Def, Special",
            icon: "radiationmelee_contaminatedstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.5414
                        },
                        {
                            type: "Smashing",
                            scale: 1.1804
                        },
                        {
                            type: "Fire",
                            scale: 0.378
                        }
                    ],
                    scale: 5.0998
                },
                defenseDebuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Radioactive Smash",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You channel a greater amount of radiation into your fists and deliver a hard hitting blow that deals Moderate Energy and Smashing damage to the target as well as reducing their Defense for a short time. Affected targets also have a chance to be knocked down and have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe -Def, Knockdown, Special",
            icon: "radiationmelee_radioactivesmash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 7.0,
                endurance: 7.696,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 5.925000000000001
                        },
                        {
                            type: "Smashing",
                            scale: 1.975
                        },
                        {
                            type: "Fire",
                            scale: 0.666
                        }
                    ],
                    scale: 8.566
                },
                defenseDebuff: 1.5,
                buffDuration: 10.0
            }
        },
        {
            name: "Proton Sweep",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You release a cloud of deadly radioactive particles in front of you inflicting Moderate Energy and Toxic damage over a short time as well as reducing the targets' defense. Affected enemies have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Melee Cone, DoT(Energy/Toxic), Foe -Def, Special",
            icon: "radiationmelee_protonsweep.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.309,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                dotDamage: {
                    types: [
                        {
                            type: "Toxic",
                            scale: 1.3429,
                            ticks: 3
                        },
                        {
                            type: "Energy",
                            scale: 0.49899999999999994,
                            ticks: 3
                        },
                        {
                            type: "Fire",
                            scale: 0.1609,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 3.1,
                defenseDebuff: 1.2
            }
        },
        {
            name: "Fusion",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Fusion boosts your damage and chance to hit moderately and also causes your next few attacks to have a 100% chance to inflict Contaminated on your enemies.",
            shortHelp: "Self +DMG, +To Hit, Special",
            icon: "radiationmelee_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Radiation Siphon",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate Healing", "Defense Debuff", "Healing", "Melee Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "You pummel your foe with a deadly smashing attack dealing High Energy and Smashing damage and reducing their defense. Hitting Contaminated targets will also heal you for a large amount of health over 3 seconds and remove the Contaminated effect from the target. However, uncontaminated targets have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe, -Def, -Contaminated, Special",
            icon: "radiationmelee_radiationsiphon.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 2.23,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 7.9514
                        },
                        {
                            type: "Smashing",
                            scale: 2.6504000000000003
                        },
                        {
                            type: "Fire",
                            scale: 0.882
                        }
                    ],
                    scale: 11.4838
                },
                healing: {
                    scale: 89.24586206999999,
                    perTarget: true
                },
                defenseDebuff: 1.5,
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
            description: "Challenges a foe to attack you. Useful to pull a foe off an ally who finds themselves in over their head. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged, Foe Taunt",
            icon: "radiationmelee_confront.png",
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
            name: "Irradiated Ground",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Scrapper Archetype Sets", "Universal Damage Sets"],
            description: "While active you will scorch the earth beneath you leaving toxic clouds of radioactive gas in your wake. Foes that enter these clouds will suffer Minor Toxic damage, have their defense reduced and also have a tiny chance of being Contaminated. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Toggle, DoT(Toxic) Patch, Foe -Def, Special",
            icon: "radiationmelee_irradiatedground.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 2.6,
                cast: 2.03
            }
        },
        {
            name: "Devastating Blow",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You hammer your foe with a brutal smashing attack charged with a lethal dose of radiation. Your target will suffer Extreme Energy and Smashing damage, will have its defense reduced and will be disoriented for a short time. Affected enemies will be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Melee, DMG(Energy/Smash), Foe -Def, Disorient, Special",
            icon: "radiationmelee_devastatingblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 17.0,
                endurance: 16.016,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 11.3534
                        },
                        {
                            type: "Smashing",
                            scale: 3.7844
                        },
                        {
                            type: "Fire",
                            scale: 1.386
                        }
                    ],
                    scale: 16.5238
                },
                defenseDebuff: 2.0,
                buffDuration: 10.0,
                stun: 3.0
            }
        },
        {
            name: "Atom Smasher",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Scrapper Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You charge up a dangerously unstable amount of radioactive energy into a single fist before driving it into the ground and causing a small explosion. Foes caught in the blast will suffer High Energy and Toxic damage and have their defense reduced. Enemies also have a moderate chance to be disoriented for a short time. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "PBAoE, DMG(Energy/Toxic), Foe -Def, Disorient, Special",
            icon: "radiationmelee_atomsmasher.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 22.0,
                endurance: 20.176,
                cast: 2.93,
                damage: {
                    types: [
                        {
                            type: "Toxic",
                            scale: 5.4861
                        },
                        {
                            type: "Energy",
                            scale: 1.8287
                        },
                        {
                            type: "Fire",
                            scale: 0.6975
                        }
                    ],
                    scale: 8.0123
                },
                defenseDebuff: 1.2,
                buffDuration: 10.0,
                stun: 2.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/radiation-melee'] = SCRAPPER_RADIATION_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_RADIATION_MELEE_POWERSET = SCRAPPER_RADIATION_MELEE_POWERSET;
}