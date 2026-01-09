/**
 * Archery
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_ARCHERY_POWERSET = {
    name: "Archery",
    category: "Unknown",
    description: "Archery powerset",
    icon: "archery_set.png",
    powers: [
        {
            name: "Aimed Shot",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Though it takes longer to execute, your Aimed Shot deals greater damage than Snap Shot.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Lethal)",
            icon: "archery_mediumarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 60.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 2.26
                }
            }
        },
        {
            name: "Snap Shot",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A quick attack that fires an arrow at your foe after only minimal aiming. Fast, but little damage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Light DMG(Lethal)",
            icon: "archery_quickarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 60.0,
                recharge: 2.0,
                endurance: 3.54,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 2.02
                }
            }
        },
        {
            name: "Fistful of Arrows",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You fire a fistful of arrows at foes in a cone in front of you. Good at close range.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Cone), Light DMG(Lethal)",
            icon: "archery_conearrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.8727,
            effects: {
                accuracy: 1.155,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.53,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 1.5373
                }
            }
        },
        {
            name: "Stunning Shot",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You fire a blunt, weighted arrow at your target's chest. The Stunning Shot inflicts high damage and has a good chance of stunning your foe.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged Disorient, Moderate DMG(Smashing)",
            icon: "archery_stunarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.53,
                cast: 1.0,
                damage: {
                    type: "Smashing",
                    scale: 3.0599999999999996
                },
                stun: 3.0
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
            shortHelp: "Self +To Hit, +DMG, +Range",
            icon: "archery_aim.png",
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
            name: "Explosive Arrow",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You fire a grenade-tipped arrow at long range. This explosion affects all within the blast radius, and can knock them back.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Light DMG(Lethal/Fire), Knockback",
            icon: "archery_explodingarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.155,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.18,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.8777
                        },
                        {
                            type: "Lethal",
                            scale: 1.2976999999999999
                        }
                    ],
                    scale: 3.1754
                }
            }
        },
        {
            name: "Blazing Arrow",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You fire a Blazing Arrow at your foe, dealing some Lethal damage and causing them to catch on fire and burn.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Superior DMG(Lethal), Minor DoT(Fire)",
            icon: "archery_flamingarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 60.0,
                recharge: 10.0,
                endurance: 10.19,
                cast: 1.83,
                damage: {
                    type: "Lethal",
                    scale: 4.041
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.125,
                    ticks: 4
                },
                buffDuration: 4.125
            }
        },
        {
            name: "Perfect Shot",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "A perfectly aimed and fast shot that blasts your foes.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, High DMG(Lethal)",
            icon: "archery_heavy.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.386,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.86,
                cast: 1.67,
                damage: {
                    type: "Lethal",
                    scale: 4.329
                }
            }
        },
        {
            name: "Rain of Arrows",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You unleash a Rain of Arrows on a targeted location, damaging foes within a large area.",
            shortHelp: "Ranged (Location AoE), Extreme DoT(Lethal)",
            icon: "archery_rainofarrows.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.0,
                buffDuration: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/archery'] = SENTINEL_ARCHERY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_ARCHERY_POWERSET = SENTINEL_ARCHERY_POWERSET;
}