/**
 * Radioactive Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_RADIOACTIVE_ASSAULT_POWERSET = {
    name: "Radioactive Assault",
    category: "Unknown",
    description: "Radioactive Assault powerset",
    icon: "radioactive-assault_set.png",
    powers: [
        {
            name: "Contaminated Strike",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Universal Damage Sets"],
            description: "You charge your fist with harmful radioactive particles and quickly strike your foe dealing Light Energy and Smashing damage as well as reducing their defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Energy/Smash), Foe -Def, Special",
            icon: "radioactiveassault_contaminatedstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 2.2058
                        },
                        {
                            type: "Smashing",
                            scale: 0.7353
                        }
                    ],
                    scale: 2.9411
                },
                defenseDebuff: 1.39,
                buffDuration: 10.0
            }
        },
        {
            name: "Neutrino Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "A very quick, but low damage attack. Neutrino Bolt can reduce the target's Defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Energy), Foe -DEF",
            icon: "radioactiveassault_neutrinoblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Energy",
                    scale: 2.2572
                },
                defenseDebuff: 1.0,
                buffDuration: 3.0
            }
        },
        {
            name: "X-Ray Beam",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "You can emit a beam of X-Ray energy from your eyes, dealing moderate Energy damage. This attack can bypass some defenses and can reduce the target's Defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Superior DMG(Energy), Foe -DEF",
            icon: "radioactiveassault_xraybeam.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 4.131600000000001
                },
                defenseDebuff: 2.0,
                buffDuration: 6.0
            }
        },
        {
            name: "Electron Haze",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "A short range conical blast of free electrons. This attack can bypass some of a target's defenses and reduce the target's Defense. It can also knock some targets down. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Close, Moderate Moderate DMG(Energy), Foe -DEF, Knockback",
            icon: "radioactiveassault_electronhaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.37,
                damage: {
                    type: "Energy",
                    scale: 2.6
                },
                defenseDebuff: 2.0,
                buffDuration: 8.0
            }
        },
        {
            name: "Fusion",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Fusion boosts your damage and chance to hit moderately and also causes your next few attacks to have a 100% chance to inflict Contaminated on your enemies.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit, Special",
            icon: "radioactiveassault_buildup.png",
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
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate Healing", "Defense Debuff", "Healing", "Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "You pummel your foe with a deadly smashing attack dealing High Energy and Smashing damage and reducing their defense. Hitting Contaminated targets will also heal you for a large amount of health over 3 seconds and remove the Contaminated effect from the target. However, uncontaminated targets have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Superior DMG(Energy/Smash), Foe, -Def, -Contaminated, Special",
            icon: "radioactiveassault_radiationsiphon.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 12.0,
                endurance: 10.192,
                cast: 2.23,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.5385999999999997
                        },
                        {
                            type: "Smashing",
                            scale: 1.1770999999999998
                        }
                    ],
                    scale: 4.7157
                },
                healing: {
                    scale: 68.16258400000001,
                    perTarget: true
                },
                defenseDebuff: 1.5,
                buffDuration: 10.0
            }
        },
        {
            name: "Atom Smasher",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Dominator Archetype Sets", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "You charge up a dangerously unstable amount of radioactive energy into a single fist before driving it into the ground and causing a small explosion. Foes caught in the blast will suffer High Energy and Toxic damage and have their defense reduced. Enemies also have a moderate chance to be disoriented for a short time. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Moderate DMG(Energy/Toxic), Foe -Def, Disorient, Special",
            icon: "radioactiveassault_atomsmasher.png",
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
                            scale: 2.16
                        },
                        {
                            type: "Energy",
                            scale: 0.7257
                        }
                    ],
                    scale: 2.8857
                },
                defenseDebuff: 1.2,
                buffDuration: 10.0,
                stun: 2.0
            }
        },
        {
            name: "Proton Volley",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "Hurls a volley of alpha particles over an extremely long range. Proton Volley can bypass some of a target's defenses and reduce the target's Defense. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Energy), Foe -DEF",
            icon: "radioactiveassault_protonvolley.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.33
            }
        },
        {
            name: "Devastating Blow",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Dominator Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "You hammer your foe with a brutal smashing attack charged with a lethal dose of radiation. Your target will suffer Extreme Energy and Smashing damage, will have its defense reduced and will be disoriented for a short time. Devastating Blow has an increased change to critically hit. Affected enemies will be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Extreme DMG(Energy/Smash), Foe -Def, Disorient, Special",
            icon: "radioactiveassault_devastatingblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 4.972799999999999
                        },
                        {
                            type: "Smashing",
                            scale: 1.6601
                        }
                    ],
                    scale: 6.632899999999999
                },
                defenseDebuff: 2.0,
                buffDuration: 10.0,
                stun: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/radioactive-assault'] = DOMINATOR_RADIOACTIVE_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_RADIOACTIVE_ASSAULT_POWERSET = DOMINATOR_RADIOACTIVE_ASSAULT_POWERSET;
}