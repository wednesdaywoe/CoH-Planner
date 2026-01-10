/**
 * Energy Aura
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_ENERGY_AURA_POWERSET = {
    name: "Energy Aura",
    category: "Unknown",
    description: "Energy Aura powerset",
    icon: "energy-aura_set.png",
    powers: [
        {
            name: "Kinetic Dampening",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "Your ability to channel energy makes you naturally resistant to Energy, Negative Energy, Lethal, Smashing and Toxic damage. Additionally, the user gains a moderate level of resistance to slow effects. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res (Energy, Negative, Toxic, Lethal, Smashing, Slow)",
            icon: "energyaura_protection.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.5,
                            ticks: 5
                        },
                        {
                            type: "Negative",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Toxic",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Smashing",
                            scale: 1.0,
                            ticks: 5
                        },
                        {
                            type: "Lethal",
                            scale: 1.0,
                            ticks: 5
                        }
                    ]
                },
                resistance: {
                    energy: 0.10500000000000001,
                    negative: 0.08750000000000001,
                    toxic: 0.08750000000000001,
                    smashing: 0.07,
                    lethal: 0.07
                },
                debuffResistance: {
                    recharge: 0.2,
                    movement: 0.2
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Kinetic Shield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Kinetic Shield creates a harmonic Energy Aura that can deflect physical attacks. Your Defense to Smashing and Lethal attacks is increased as weapons and powers like bullets, blades and punches tend to deflect off the shield. Kinetic Shield also grants you good resistance to Defense Debuffs. The Energy based nature of Kinetic Shield also offers some minimal Defense to Energy attacks. Kinetic Shield also adds an Elusivity defense bonus to Smashing, Lethal, and Energy Attacks in PVP zones.",
            shortHelp: "Toggle: Self +DEF(Smashing, Lethal, Energy), Res(DeBuff DEF)",
            icon: "energyaura_kineticshield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 0.73,
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Power Shield",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "This Power Shield creates a Electro-Magnetic shield around you that can deflect non-physical attacks. Your Defense to Fire, Cold, Energy and Negative Energy attacks is increased as these attacks are reflected or refracted off the shield. Power Shield also grants you good resistance to Defense Debuffs. Power Shield also adds Psionic Defense and an Elusivity defense bonus to Fire, Cold, Energy and Psionic Attacks in PVP zones.",
            shortHelp: "Toggle: Self +DEF(Fire, Cold, Energy, Negative), Res(DeBuff DEF)",
            icon: "energyaura_powershield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 1.67,
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Energize",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can channel a tremendous amount of energy through your body for a short period of time. Doing so will heal some hit points, reduce the endurance cost of your powers and boost your regeneration for a short time.",
            shortHelp: "Self Endurance Discount, Heal, +Regen",
            icon: "energyaura_energize.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 1.17,
                healing: {
                    scale: 301.18975,
                    perTarget: true
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Entropy Shield",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Entropy Shield diminishes and dampens the energy of controlling type effects. The shield makes you resistant to Knockback, Repel, Disorient, Hold, Sleep, Immobilization, and enemy Teleportation for as long as you can keep this toggle power active. Entropy Shield also grants you good resistance to Defense Debuffs. Additionally, this power grants the user a moderate recharge bonus while active and resistance to endurance drain effects.",
            shortHelp: "Toggle: Self +Res(Knockback, Repel, Disorient, Hold, Sleep, Immobilize, Teleport, DeBuff DEF), +Rech",
            icon: "energyaura_entropy.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.13,
                cast: 0.73,
                protection: {
                    hold: 8.304,
                    stun: 8.304,
                    sleep: 8.304,
                    immobilize: 8.304
                },
                debuffResistance: {
                    defense: 0.3,
                    tohit: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75,
                defenseBuff: 0.3,
                tohitBuff: 0.3
            }
        },
        {
            name: "Power Armor",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "Power Armor increases Hit Points and resistance to all damage types. This power is always on and costs no endurance.",
            shortHelp: "Auto: Self +MaxHP, +Resist(All DMG)",
            icon: "energyaura_powerarmor.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                resistance: {
                    smashing: 0.052500000000000005,
                    lethal: 0.052500000000000005,
                    fire: 0.052500000000000005,
                    cold: 0.052500000000000005,
                    energy: 0.052500000000000005,
                    negative: 0.052500000000000005,
                    psionic: 0.052500000000000005,
                    toxic: 0.052500000000000005
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Repelling Force",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets"],
            description: "Your innate power over energies manifest itself naturally as a repelling force, increasing your defense against all types. This power is always on and costs no endurance.",
            shortHelp: "Auto: Self +DEF(Smash, Lethal, Fire, Cold, Energy, Negative, Psionic, Toxic)",
            icon: "energyaura_repellingforce.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                buffDuration: 10.3
            }
        },
        {
            name: "Power Drain",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Power Drain leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance. If there are no foes within range, you will not gain any Endurance.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Autohit: PBAoE, Self +End, Foe -End, -Recovery",
            icon: "energyaura_drain.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 13.0,
                cast: 2.37,
                buffDuration: 4.0
            }
        },
        {
            name: "Overload",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Healing"],
            description: "You can Overload your Energy Aura and dramatically improve your defense to all attack types. Overload also grants you high resistance to Defense Debuffs. This Energy Aura is so powerful, that it can even absorb some damage, effectively increasing your Max Hit Points. However, when Overload wears off, you are left drained of all Endurance and unable to recover Endurance for a while. Overload also adds a moderate Elusivity defense bonus to all attacks in PVP zones.",
            shortHelp: "Self +DEF(All), +Recovery, +Max HP, Res(DeBuff DEF), +Special",
            icon: "energyaura_overload.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 1000.0,
                endurance: 2.6,
                cast: 3.0,
                debuffResistance: {
                    defense: 0.2768
                },
                buffDuration: 180.0,
                defenseBuff: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/energy-aura'] = SENTINEL_ENERGY_AURA_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_ENERGY_AURA_POWERSET = SENTINEL_ENERGY_AURA_POWERSET;
}