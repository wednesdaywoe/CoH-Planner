/**
 * Assault Rifle
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_ASSAULT_RIFLE_POWERSET = {
    name: "Assault Rifle",
    category: "Unknown",
    description: "Assault Rifle powerset",
    icon: "assault-rifle_set.png",
    powers: [
        {
            name: "Burst",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Quickly fires a Burst of rounds at a single target at very long range. Damage is average, but the fire rate is fast. Can also reduce the target's defense.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DMG(Lethal), Foe -DEF",
            icon: "assaultweapons_arburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 60.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.69,
                    ticks: 3
                },
                buffDuration: 0.91,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Disorienting Shot",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "Fires a single non lethal rubber bullet that can seriously Disorient a target. Deals average damage but renders most targets unable to attack for a good while.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DMG(Smash), Foe Disorient",
            icon: "assaultweapons_shotgunbeanbag.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 60.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 0.9,
                damage: {
                    type: "Smashing",
                    scale: 2.3899999999999997
                },
                stun: 3.0
            }
        },
        {
            name: "Buckshot",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Good at close range. Fires a cone of Buckshot pellets and can knock some foes down.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Cone), DMG(Lethal), Foe Knockback",
            icon: "assaultweapons_shotgunbuckshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.5236,
            effects: {
                accuracy: 1.05,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.53,
                cast: 0.9,
                damage: {
                    type: "Lethal",
                    scale: 1.5350000000000001
                }
            }
        },
        {
            name: "Slug",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Fires a single Slug at a targeted foe. Firing a single Slug is slower than firing a Burst, but deals more damage and can knock down foes.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, DMG(Lethal), Foe Knockback",
            icon: "assaultweapons_shotgunslug.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.4,
                damage: {
                    type: "Lethal",
                    scale: 3.34
                }
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
            icon: "assaultweapons_aim.png",
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
            name: "M30 Grenade",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Launches a Grenade at long range from beneath the barrel of your Assault Rifle. This explosion affects all within the blast radius, and can knock them back.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), DMG(Fire/Lethal), Foe Knockback",
            icon: "assaultweapons_arm30grenade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.8944
                        },
                        {
                            type: "Lethal",
                            scale: 1.8943
                        }
                    ],
                    scale: 3.7887000000000004
                }
            }
        },
        {
            name: "Flamethrower",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Spews forth a cone of flames from underneath the barrel of your assault rifle, setting foes on fire. Very accurate and very deadly at medium range.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), DoT(Fire)",
            icon: "assaultweapons_arflamethrower.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.7854,
            effects: {
                accuracy: 1.3,
                range: 40.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.33,
                dotDamage: {
                    type: "Fire",
                    scale: 0.6251,
                    ticks: 4
                },
                buffDuration: 4.7
            }
        },
        {
            name: "Ignite",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Sprays a target with accelerant from your flamethrower, igniting it and causing extreme damage over time. Also sets the location on fire if the target is grounded, inflicting damage to additional foes that step in the area.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, DoT(Fire), Location AoE, DoT(Fire)",
            icon: "assaultweapons_dot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.15,
                range: 40.0,
                recharge: 14.0,
                endurance: 13.52,
                cast: 2.0,
                damage: {
                    type: "Fire",
                    scale: 1.9077
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.19490000000000002,
                    ticks: 21
                },
                buffDuration: 5.25
            }
        },
        {
            name: "Full Auto",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Opens up your assault rifle on Full Auto to lay down a massive spray of bullets at your target. Although very slow to reload, damage from this attack is massive, shredding all targets within the cone of effect. There's a chance you may land a lucky shot for extra damage.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Cone), DoT(Lethal), +Special",
            icon: "assaultweapons_arfullauto.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.35,
                range: 40.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.5,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.5086999999999999,
                    ticks: 10
                },
                buffDuration: 2.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/assault-rifle'] = SENTINEL_ASSAULT_RIFLE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_ASSAULT_RIFLE_POWERSET = SENTINEL_ASSAULT_RIFLE_POWERSET;
}