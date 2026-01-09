/**
 * Fire Blast
 * Character Level: 50
 * Archetype: defender
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DEFENDER_FIRE_BLAST_POWERSET = {
    name: "Fire Blast",
    category: "Unknown",
    description: "Fire Blast powerset",
    icon: "fire-blast_set.png",
    powers: [
        {
            name: "Fire Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.",
            shortHelp: "Ranged, DMG(Fire)",
            icon: "fireblast_fireblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.2,
                damage: {
                    type: "Fire",
                    scale: 2.3998999999999997
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Flares",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "A quick attack that throws Flares at the target. Little damage, but very fast.",
            shortHelp: "Ranged, DMG(Fire)",
            icon: "fireblast_flare.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 2.18,
                endurance: 3.692,
                cast: 1.0,
                damage: {
                    type: "Fire",
                    scale: 1.8971
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Fire Ball",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Hurls an exploding Fireball that consumes a targeted foe, and all nearby enemies. Anyone in that explosion is burned and set ablaze.",
            shortHelp: "Ranged (Targeted AoE), DMG(Fire/Smash)",
            icon: "fireblast_fireball.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.164
                        },
                        {
                            type: "Smashing",
                            scale: 0.2
                        }
                    ],
                    scale: 1.3639999999999999
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 2
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Rain of Fire",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Summons a Rain of Fire over a targeted location, burning foes and reducing their movement speed within a large area.",
            shortHelp: "Ranged (Location AoE), DoT(Fire), -SPD",
            icon: "fireblast_rainoffire.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 26.0,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Fire Breath",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can breathe forth a torrent of fire that burns all foes within its narrow cone. Very accurate and very deadly at medium range.",
            shortHelp: "Close (Cone), DoT(Fire)",
            icon: "fireblast_arcoffire.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.2,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.67,
                dotDamage: {
                    type: "Fire",
                    scale: 2.0036,
                    ticks: 2
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Aim",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.",
            shortHelp: "Self +To Hit, +DMG",
            icon: "fireblast_aim.png",
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
            name: "Blaze",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "A devastating flame attack.",
            shortHelp: "Ranged, DMG(Fire)",
            icon: "fireblast_blaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.4,
                cast: 1.0,
                damage: {
                    type: "Fire",
                    scale: 3.6199000000000003
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.225,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        },
        {
            name: "Blazing Bolt",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "A long range beam of fire that blasts your foes. Like most sniper attacks, this power has a bonus to Accuracy, but is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Fire)",
            icon: "fireblast_blazingbolt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.67
            }
        },
        {
            name: "Inferno",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Melee AoE Damage", "Universal Damage Sets"],
            description: "Unleashes a massive fiery explosion to devastate all nearby enemies and set them ablaze. Inferno deals Extreme Fire damage to all nearby foes and inflicts Moderate Fire damage over time.",
            shortHelp: "PBAoE, DMG(Fire/Smash), Foe DoT(Fire)",
            icon: "fireblast_inferno.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.4,
                recharge: 145.0,
                endurance: 27.716,
                cast: 3.0,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 4.7473
                        },
                        {
                            type: "Smashing",
                            scale: 1.0
                        }
                    ],
                    scale: 5.7473
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.3,
                    ticks: 8
                },
                buffDuration: 8.1
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['defender/fire-blast'] = DEFENDER_FIRE_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DEFENDER_FIRE_BLAST_POWERSET = DEFENDER_FIRE_BLAST_POWERSET;
}