/**
 * Radiation Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_RADIATION_MELEE_POWERSET = {
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                            scale: 1.4557
                        },
                        {
                            type: "Smashing",
                            scale: 0.48519999999999996
                        }
                    ],
                    scale: 1.9409
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                            scale: 2.4075
                        },
                        {
                            type: "Smashing",
                            scale: 0.8025
                        }
                    ],
                    scale: 3.21
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
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You release a cloud of deadly radioactive particles in front of you inflicting Moderate Energy and Toxic damage over a short time as well as reducing the targets' defense. Affected enemies have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Melee Cone, DoT(Energy/Toxic), Foe -Def, Special",
            icon: "radiationmelee_protonsweep.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
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
                            scale: 0.5566,
                            ticks: 3
                        },
                        {
                            type: "Energy",
                            scale: 0.1856,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 3.1,
                defenseDebuff: 1.2
            }
        },
        {
            name: "Assassin's Corruption",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior energy and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not. Assassin's Corruption also has a very high chance to inflict Contaminated while hidden and a high chance while unhidden. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "Melee, DMG(Smashing, Energy)",
            icon: "radiationmelee_assassinsstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.0
            }
        },
        {
            name: "Build Up",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "radiationmelee_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Placate",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Strike. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "radiationmelee_placate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                cast: 0.8,
                buffDuration: 10.0
            }
        },
        {
            name: "Radiation Siphon",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate Healing", "Defense Debuff", "Healing", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
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
                            scale: 3.2407
                        },
                        {
                            type: "Smashing",
                            scale: 1.0802
                        }
                    ],
                    scale: 4.3209
                },
                healing: {
                    scale: 80.32128252999999,
                    perTarget: true
                },
                defenseDebuff: 1.5,
                buffDuration: 10.0
            }
        },
        {
            name: "Devastating Blow",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
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
                            scale: 4.5217
                        },
                        {
                            type: "Smashing",
                            scale: 1.5072
                        }
                    ],
                    scale: 6.0289
                },
                defenseDebuff: 2.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Atom Smasher",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You charge up a dangerously unstable amount of radioactive energy into a single fist before driving it into the ground and causing a small explosion. Foes caught in the blast will suffer High Energy and Toxic damage and have their defense reduced. Enemies also have a moderate chance to be disoriented for a short time. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
            shortHelp: "PBAoE, DMG(Energy/Toxic), Foe -Def, Disorient, Special",
            icon: "radiationmelee_atomsmasher.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 22.0,
                endurance: 20.176,
                cast: 2.93,
                damage: {
                    types: [
                        {
                            type: "Toxic",
                            scale: 2.1618
                        },
                        {
                            type: "Energy",
                            scale: 0.7206
                        }
                    ],
                    scale: 2.8824
                },
                defenseDebuff: 1.2,
                buffDuration: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/radiation-melee'] = STALKER_RADIATION_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_RADIATION_MELEE_POWERSET = STALKER_RADIATION_MELEE_POWERSET;
}