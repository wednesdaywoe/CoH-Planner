/**
 * Fiery Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_FIERY_ASSAULT_POWERSET = {
    name: "Fiery Assault",
    category: "Unknown",
    description: "Fiery Assault powerset",
    icon: "fiery-assault_set.png",
    powers: [
        {
            name: "Flares",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "A quick attack that throws Flares at the target.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Light DMG(Fire)",
            icon: "fireassault_flare.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.0,
                damage: {
                    type: "Fire",
                    scale: 2.0978
                }
            }
        },
        {
            name: "Incinerate",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Universal Damage Sets"],
            description: "Intense concentration can allow you to Incinerate an opponent at melee range. This will set your foe ablaze, dealing damage over time.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DoT(Fire)",
            icon: "fireassault_incinerate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                dotDamage: {
                    type: "Fire",
                    scale: 0.4089,
                    ticks: 9
                },
                buffDuration: 4.6
            }
        },
        {
            name: "Fire Breath",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can breathe forth a torrent of fire that burns all foes within its narrow cone. Very accurate and very deadly at medium range.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Close (Cone), Moderate DoT(Fire)",
            icon: "fireassault_breathoffire.png",
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
                    scale: 1.2584,
                    ticks: 2
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Fire Blast",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, High DMG(Fire)",
            icon: "fireassault_fireblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.2,
                damage: {
                    type: "Fire",
                    scale: 3.2
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
            name: "Embrace of Fire",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Significantly boosts the damage of all your Fire attacks for quite a while. Also increases the damage of all your other non-fire based attacks for a short while.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG",
            icon: "fireassault_fieryembrace.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 7.8,
                cast: 0.73,
                buffDuration: 30.0
            }
        },
        {
            name: "Combustion",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Universal Damage Sets"],
            description: "Your mastery of fire allows you to violently raise the temperature around yourself in an attempt to spontaneously combust any nearby foes and set them ablaze, dealing damage over time.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Moderate DoT(Fire)",
            icon: "fireassault_combustion.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 17.0,
                endurance: 15.964,
                cast: 3.0,
                damage: {
                    type: "Fire",
                    scale: 1.46
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.1,
                    ticks: 7
                },
                buffDuration: 7.1
            }
        },
        {
            name: "Consume",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can drain body heat from all nearby foes in order to replenish your own Endurance. The more foes affected, the more Endurance is gained. Foes suffer minimal Fire damage.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE DMG(Fire), Self +End",
            icon: "fireassault_consume.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 0.52,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Blazing Bolt",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "A long range beam of fire that blasts your foes. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Fire)",
            icon: "fireassault_blazingbolt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.67
            }
        },
        {
            name: "Blaze",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Universal Damage Sets"],
            description: "A devastating flame attack.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Superior DMG(Fire)",
            icon: "fireassault_blaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.0,
                damage: {
                    type: "Fire",
                    scale: 3.86
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.225,
                    ticks: 4
                },
                buffDuration: 4.1
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/fiery-assault'] = DOMINATOR_FIERY_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_FIERY_ASSAULT_POWERSET = DOMINATOR_FIERY_ASSAULT_POWERSET;
}