/**
 * Fire Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_FIRE_BLAST_POWERSET = {
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
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.<br><br><color #fcfc95>Damage: Heavy.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DMG(Fire), DoT(Fire)",
            icon: "fireblast_fireblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 5.0,
                endurance: 6.03,
                cast: 1.2,
                damage: {
                    type: "Fire",
                    scale: 2.5999999999999996
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
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A quick attack that throws Flares at the target. Little damage, but very fast.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, DMG(Fire)",
            icon: "fireblast_flare.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 2.0,
                endurance: 3.536,
                cast: 1.0,
                damage: {
                    type: "Fire",
                    scale: 1.8599999999999999
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
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Hurls an exploding Fireball that consumes a targeted foe, and all nearby enemies. Anyone in that explosion is burned and set ablaze.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), DMG(Fire/Smash), DoT(Fire)",
            icon: "fireblast_fireball.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.2353999999999998
                        },
                        {
                            type: "Smashing",
                            scale: 0.2
                        }
                    ],
                    scale: 1.4353999999999998
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
            name: "Blaze",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A devastating flame attack.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, DMG(Fire), DoT(Fire)",
            icon: "fireblast_blaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    type: "Fire",
                    scale: 3.46
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
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and range.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +ToHit, +DMG, +Range",
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
            name: "Fire Breath",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can breathe forth a torrent of fire that burns all foes within its narrow cone. Very accurate and very deadly at medium range.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), DoT(Fire)",
            icon: "fireblast_arcoffire.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
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
            name: "Blazing Blast",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "An extremely quick long range beam of fire that blasts your foes and pushes them away.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, DMG(Fire), DoT(Fire), Foe Knockback, Repel",
            icon: "fireblast_heavy.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.67,
                damage: {
                    type: "Fire",
                    scale: 1.8195999999999999
                },
                buffDuration: 0.61
            }
        },
        {
            name: "Rain of Fire",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Summons a Rain of Fire over a targeted location, burning foes and reducing their movement speed within a large area.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Location AoE), DoT(Fire), Foe -SPD",
            icon: "fireblast_rainoffire.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 2.0,
                range: 40.0,
                recharge: 60.0,
                endurance: 26.0,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Inferno",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Unleashes a massive fiery explosion to devastate all nearby enemies and set them ablaze. Inferno deals Extreme Fire damage to all nearby foes and inflicts Moderate Fire damage over time.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, DMG(Fire/Smash), DoT(Fire)",
            icon: "fireblast_inferno.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                recharge: 90.0,
                endurance: 15.6,
                cast: 3.0,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 3.778
                        },
                        {
                            type: "Smashing",
                            scale: 0.928
                        }
                    ],
                    scale: 4.706
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 2
                },
                buffDuration: 2.1
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/fire-blast'] = SENTINEL_FIRE_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_FIRE_BLAST_POWERSET = SENTINEL_FIRE_BLAST_POWERSET;
}