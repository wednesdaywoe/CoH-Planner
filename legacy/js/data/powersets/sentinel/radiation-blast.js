/**
 * Radiation Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_RADIATION_BLAST_POWERSET = {
    name: "Radiation Blast",
    category: "Unknown",
    description: "Radiation Blast powerset",
    icon: "radiation-blast_set.png",
    powers: [
        {
            name: "Neutrino Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A very quick, but low damage attack. Neutrino Bolt can reduce the target's Defense.",
            shortHelp: "Ranged, DMG(Energy), Foe -DEF",
            icon: "radiationburst_neutrinoblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Energy",
                    scale: 2.26
                },
                defenseDebuff: 1.0,
                buffDuration: 3.0
            }
        },
        {
            name: "X-Ray Beam",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can emit a beam of X-Ray energy from your eyes, dealing moderate Energy damage. This attack can bypass some defenses and can reduce the target's Defense.",
            shortHelp: "Ranged, DMG(Energy), Foe -DEF",
            icon: "radiationburst_xraybeam.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 3.529
                },
                defenseDebuff: 2.0,
                buffDuration: 6.0
            }
        },
        {
            name: "Irradiate",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can emit lethal amounts of radiation in all directions, damaging all nearby foes for a short time. Like other Radiation attacks, this power can bypass some of a target's defenses. Irradiate severely reduces the target's Defense.",
            shortHelp: "Close (AoE), DoT(Energy), Foe -DEF",
            icon: "radiationburst_irradiate.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.1,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.07,
                dotDamage: {
                    type: "Energy",
                    scale: 0.14880000000000002,
                    ticks: 9
                },
                buffDuration: 4.6,
                defenseDebuff: 3.0
            }
        },
        {
            name: "Cosmic Burst",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Cosmic Burst smashes the target with cosmic particles. The attack is devastating and can leave most targets Disoriented and with reduced Defense.",
            shortHelp: "Ranged, DMG(Energy), Foe Disorient, -DEF",
            icon: "radiationburst_cosmicburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.07,
                damage: {
                    type: "Energy",
                    scale: 4.409000000000001
                },
                stun: 3.0,
                defenseDebuff: 3.0,
                buffDuration: 12.0
            }
        },
        {
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and range.",
            shortHelp: "Self +To Hit, +DMG, +Range",
            icon: "radiationburst_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.625,
                damageBuff: 0.425,
                buffDuration: 10.0
            }
        },
        {
            name: "Electron Haze",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A short range conical blast of free electrons. This attack can bypass some of a target's defenses and reduce the target's Defense. It can also knock some targets down.",
            shortHelp: "Close, DMG(Energy), Foe -DEF, Knockback",
            icon: "radiationburst_electronhaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.5236,
            effects: {
                accuracy: 1.1,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.37,
                damage: {
                    type: "Energy",
                    scale: 5.2989999999999995
                },
                defenseDebuff: 2.0,
                buffDuration: 8.0
            }
        },
        {
            name: "Proton Stream",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Hurls a volley of alpha particles at your target. Proton Volley is highly accurate and will reduce the target's Defense.",
            shortHelp: "Ranged, DMG(Energy), Foe -DEF",
            icon: "radiationburst_heavy.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.67,
                dotDamage: {
                    type: "Energy",
                    scale: 1.0823,
                    ticks: 3
                },
                buffDuration: 0.41,
                defenseDebuff: 3.0
            }
        },
        {
            name: "Neutron Bomb",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "This devastating attack lobs an explosive sphere of deadly radiation, damaging the target and all nearby foes. Neutron Bomb can bypass some of a target's defenses and reduce the target's Defense.",
            shortHelp: "Ranged (Targeted AoE), DMG(Energy), Foe -DEF",
            icon: "radiationburst_radiationblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.1,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 1.5796999999999999
                },
                defenseDebuff: 2.0,
                buffDuration: 16.0
            }
        },
        {
            name: "Atomic Blast",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "This attack taps most of your stored energy to deal a devastating Atomic Blast which deals Extreme Energy and Smashing damage. Any foes left standing will have their Defense greatly reduced and may be left helplessly choking on toxic vapors.",
            shortHelp: "PBAoE, DMG(Energy/Smash), Foe Hold, -DEF",
            icon: "radiationburst_atomicblast.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.93,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.3120000000000003
                        },
                        {
                            type: "Smashing",
                            scale: 1.3818000000000001
                        }
                    ],
                    scale: 4.6938
                },
                defenseDebuff: 4.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/radiation-blast'] = SENTINEL_RADIATION_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_RADIATION_BLAST_POWERSET = SENTINEL_RADIATION_BLAST_POWERSET;
}