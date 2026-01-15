/**
 * Thorny Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_THORNY_ASSAULT_POWERSET = {
    name: "Thorny Assault",
    category: "Unknown",
    description: "Thorny Assault powerset",
    icon: "thorny-assault_set.png",
    powers: [
        {
            name: "Skewer",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee Damage", "Universal Damage Sets"],
            description: "You lunge forward with this melee attack and Skewer your foe with the large Thorn on your arm. Deals high damage and poisons your foe. Poison from the Thorns deals additional Toxic damage and can reduce your foes Defense.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Melee, Moderate DMG(Lethal), DoT(Toxic) -DEF",
            icon: "thornyassault_skewer.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 0.83,
                damage: {
                    type: "Lethal",
                    scale: 2.4628
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.0805,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 2.0
            }
        },
        {
            name: "Thorny Darts",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "Hurls small Thorny Darts at your foes. Thorny Darts deal moderate damage. Poison from the Darts deals additional Toxic damage and can reduce your foes Defense.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Lethal), DoT(Toxic) -DEF",
            icon: "thornyassault_darts.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.33,
                damage: {
                    type: "Lethal",
                    scale: 2.7733
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.0595,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 2.0
            }
        },
        {
            name: "Fling Thorns",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can throw dozens of Thorns in a wide cone in front of you, impaling foes caught within the area. These Thorns deals moderate damage, and poisons any targets it hits. Thorn poison deals additional Toxic damage and can reduce your foes' Defense.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Cone), Light DMG(Lethal), DoT(Toxic) -DEF",
            icon: "thornyassault_flingthorns.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 30.0,
                recharge: 10.0,
                endurance: 11.1754,
                cast: 1.63,
                damage: {
                    type: "Lethal",
                    scale: 2.7158
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.086,
                    ticks: 4
                },
                buffDuration: 4.1,
                defenseDebuff: 2.0
            }
        },
        {
            name: "Impale",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Dominator Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You can throw a small cluster of large Thorns at a targeted foe. These Thorns carry a large amount of the toxin. In addition to dealing Toxic damage, a successful attack can slow a target, preventing Running, Jumping or Flying. Most foes will likely be completely Immobilized, unable to run.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, High DMG(Lethal), DoT(Toxic), Immobilize, -DEF, -SPD, -Fly, -Jump",
            icon: "thornyassault_impale.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.433,
                damage: {
                    type: "Lethal",
                    scale: 3.4348
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1195,
                    ticks: 6
                },
                buffDuration: 15.0,
                defenseDebuff: 3.0
            }
        },
        {
            name: "Build Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +To Hit",
            icon: "thornyassault_aim.png",
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
            name: "Thorn Burst",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can explode dozens of Thorns in all directions around you. These Thorns only travel a short distance, but they can deal moderate damage and poison any target close to you. Toxic damage from the thorns can reduce the Defense of affected foes.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, Light DMG(Lethal), DoT(Toxic) -DEF",
            icon: "thornyassault_thornburst.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 17.0,
                endurance: 16.016,
                cast: 3.0,
                damage: {
                    type: "Lethal",
                    scale: 2.7671
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 3.0
            }
        },
        {
            name: "Thorntrops",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You fling dozens of Thorns into the ground at a targeted location. The small Thorns pepper the ground over a large area. Any enemy that pass over the Thorntrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed",
            icon: "thornyassault_thorntrops.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 25.0,
                recharge: 45.0,
                endurance: 7.8,
                cast: 1.63,
                buffDuration: 45.0
            }
        },
        {
            name: "Ripper",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can unleash a spectacular slashing maneuver that attacks all foes in a wide arc directly in front of you. Ripper deals massive damage and poisons multiple targets. It can even knock foes down. Thorn poison deals additional Toxic damage and can reduce your foes Defense.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee (Cone), Superior DMG(Lethal), DoT(Toxic) -DEF, Knockback, -SPD",
            icon: "thornyassault_ripper.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.0472,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.33,
                damage: {
                    type: "Lethal",
                    scale: 4.4925
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.2,
                    ticks: 4
                },
                buffDuration: 4.1,
                defenseDebuff: 3.0
            }
        },
        {
            name: "Thorn Barrage",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "A devastating attack, Thorn Barrage unleashes your Thorns at high velocity causing severe damage at range. The impact of this attack can knock most foes on their back. Thorn poison deals additional Toxic damage and can reduce your foes Defense.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Extreme DMG(Lethal), DoT(Toxic) -DEF",
            icon: "thornyassault_thornbarrage.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 18.0,
                endurance: 15.5765,
                cast: 2.0,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.4401000000000002,
                            ticks: 3
                        },
                        {
                            type: "Toxic",
                            scale: 0.1529,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 1.75,
                defenseDebuff: 3.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/thorny-assault'] = DOMINATOR_THORNY_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_THORNY_ASSAULT_POWERSET = DOMINATOR_THORNY_ASSAULT_POWERSET;
}