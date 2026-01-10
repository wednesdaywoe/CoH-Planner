/**
 * Radiation Blast
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_RADIATION_BLAST_POWERSET = {
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
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "A very quick, but low damage attack. Neutrino Bolt can reduce the target's Defense.",
            shortHelp: "Ranged, DMG(Energy), Foe -DEF",
            icon: "radiationburst_neutrinoblast.png",
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
                    scale: 2.2602
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
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "You can emit a beam of X-Ray energy from your eyes, dealing moderate Energy damage. This attack can bypass some defenses and can reduce the target's Defense.",
            shortHelp: "Ranged, DMG(Energy), Foe -DEF",
            icon: "radiationburst_xraybeam.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 3.5292
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
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can emit lethal amounts of radiation in all directions, damaging all nearby foes for a short time. Like other Radiation attacks, this power can bypass some of a target's defenses. Irradiate severely reduces the target's Defense.",
            shortHelp: "Close (AoE), DoT(Energy), Foe -DEF",
            icon: "radiationburst_irradiate.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.1,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.07,
                dotDamage: {
                    type: "Energy",
                    scale: 0.1287,
                    ticks: 9
                },
                buffDuration: 4.6,
                defenseDebuff: 3.0
            }
        },
        {
            name: "Electron Haze",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "A short range conical blast of free electrons. This attack can bypass some of a target's defenses and reduce the target's Defense. It can also knock some targets down.",
            shortHelp: "Close, DMG(Energy), Foe -DEF, Knockback",
            icon: "radiationburst_electronhaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.1,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.37,
                damage: {
                    type: "Energy",
                    scale: 5.2985
                },
                defenseDebuff: 2.0,
                buffDuration: 8.0
            }
        },
        {
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.",
            shortHelp: "Self +To-hit, +DMG",
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
            name: "Proton Volley",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "Hurls a volley of alpha particles over an extremely long range. Proton Volley can bypass some of a target's defenses and reduce the target's Defense. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Energy), Foe -DEF, Self +Range",
            icon: "radiationburst_protonvolley.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.33
            }
        },
        {
            name: "Cosmic Burst",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Ranged Damage", "Stuns", "Universal Damage Sets"],
            description: "Cosmic Burst smashes the target with cosmic particles. The attack is devastating and can leave most targets Disoriented and with reduced Defense.",
            shortHelp: "Ranged, DMG(Energy), Foe Disorient, -DEF",
            icon: "radiationburst_cosmicburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.4,
                cast: 2.07,
                damage: {
                    type: "Energy",
                    scale: 4.3693
                },
                stun: 3.0,
                defenseDebuff: 3.0,
                buffDuration: 12.0
            }
        },
        {
            name: "Neutron Bomb",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "This devastating attack lobs an explosive sphere of deadly radiation, damaging the target and all nearby foes. Neutron Bomb can bypass some of a target's defenses and reduce the target's Defense.",
            shortHelp: "Ranged (Targeted AoE), DMG(Energy), Foe -DEF",
            icon: "radiationburst_radiationblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 1.5798
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
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Melee AoE Damage", "Universal Damage Sets"],
            description: "This attack taps most of your stored energy to deal a devastating Atomic Blast which deals Extreme Energy and Smashing damage. Any foes left standing will have their Defense greatly reduced and may be left helplessly choking on toxic vapors.",
            shortHelp: "PBAoE, DMG(Energy/Smash), Foe Hold, -DEF",
            icon: "radiationburst_atomicblast.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.4,
                recharge: 145.0,
                endurance: 27.716,
                cast: 2.93,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.9424
                        },
                        {
                            type: "Smashing",
                            scale: 1.4641
                        }
                    ],
                    scale: 5.4065
                },
                defenseDebuff: 4.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/radiation-blast'] = BLASTER_RADIATION_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_RADIATION_BLAST_POWERSET = BLASTER_RADIATION_BLAST_POWERSET;
}