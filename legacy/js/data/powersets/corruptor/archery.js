/**
 * Archery
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_ARCHERY_POWERSET = {
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
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "Though it takes longer to execute, your Aimed Shot deals greater damage than Snap Shot.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, High DMG(Lethal)",
            icon: "archery_mediumarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 4.5198
                }
            }
        },
        {
            name: "Snap Shot",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "A quick attack that fires an arrow at your foe after only minimal aiming. Fast, but little damage.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Moderate DMG(Lethal)",
            icon: "archery_quickarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 80.0,
                recharge: 2.0,
                endurance: 3.536,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 3.7198
                }
            }
        },
        {
            name: "Fistful of Arrows",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You fire a fistful of arrows at foes in a cone in front of you. Good at close range.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Cone), Moderate DMG(Lethal)",
            icon: "archery_conearrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.155,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.17,
                damage: {
                    type: "Lethal",
                    scale: 3.245
                }
            }
        },
        {
            name: "Blazing Arrow",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "You fire a Blazing Arrow at your foe, dealing some Lethal damage and causing them to catch on fire and burn.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Extreme DMG(Lethal), Minor DoT(Fire)",
            icon: "archery_flamingarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.83,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 4.1618
                        },
                        {
                            type: "Lethal",
                            scale: 3.92
                        }
                    ],
                    scale: 8.081800000000001
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
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +To-hit, +DMG",
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
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You fire a grenade-tipped arrow at long range. This explosion affects all within the blast radius, and can knock them back.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Moderate DMG(Lethal/Fire), Knockback",
            icon: "archery_explodingarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.155,
                range: 80.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 3.4023000000000003
                        },
                        {
                            type: "Lethal",
                            scale: 1.2085
                        }
                    ],
                    scale: 4.6108
                }
            }
        },
        {
            name: "Ranged Shot",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "A long range shot that blasts your foes. Like most sniper attacks, this power has a bonus to Accuracy, but is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Sniper, Extreme DMG(Lethal)",
            icon: "archery_sniperarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 150.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.67
            }
        },
        {
            name: "Stunning Shot",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Stuns", "Universal Damage Sets"],
            description: "You fire a blunt, weighted arrow at your target's chest. The Stunning Shot has a good chance of stunning your foe.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged Disorient, Minor DMG(Smashing)",
            icon: "archery_stunarrow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.155,
                range: 60.0,
                recharge: 20.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    type: "Smashing",
                    scale: 0.6848
                },
                stun: 3.0
            }
        },
        {
            name: "Rain of Arrows",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You unleash a Rain of Arrows on a targeted location, damaging foes within a large area.",
            shortHelp: "Ranged (Location AoE), DoT(Lethal)",
            icon: "archery_rainofarrows.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 90.0,
                recharge: 65.0,
                endurance: 20.8,
                cast: 2.0,
                buffDuration: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/archery'] = CORRUPTOR_ARCHERY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_ARCHERY_POWERSET = CORRUPTOR_ARCHERY_POWERSET;
}