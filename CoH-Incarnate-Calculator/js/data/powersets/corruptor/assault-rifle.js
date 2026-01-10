/**
 * Assault Rifle
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_ASSAULT_RIFLE_POWERSET = {
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
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "Quickly fires a Burst of rounds at a single target at very long range. Damage is average, but the fire rate is fast. Can also reduce the target's defense.",
            shortHelp: "Ranged, DMG(Lethal), Foe -DEF",
            icon: "assaultweapons_arburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 90.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                dotDamage: {
                    type: "Lethal",
                    scale: 0.585,
                    ticks: 3
                },
                buffDuration: 0.91,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Slug",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "Fires a single Slug at a targeted foe. Firing a single Slug is slower than firing a Burst, but deals more damage, is longer range, and can knock down foes.",
            shortHelp: "Ranged, DMG(Lethal), Foe Knockback",
            icon: "assaultweapons_shotgunslug.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 100.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.4,
                damage: {
                    type: "Lethal",
                    scale: 3.3399
                }
            }
        },
        {
            name: "Buckshot",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Good at close range. Fires a cone of Buckshot pellets and can knock some foes down.",
            shortHelp: "Ranged (Cone), DMG(Lethal), Foe Knockback",
            icon: "assaultweapons_shotgunbuckshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.05,
                range: 40.0,
                recharge: 8.0,
                endurance: 10.192,
                cast: 0.9,
                damage: {
                    type: "Lethal",
                    scale: 1.5350000000000001
                }
            }
        },
        {
            name: "M30 Grenade",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Launches a Grenade at long range from beneath the barrel of your Assault Rifle. This explosion affects all within the blast radius, and can knock them back.",
            shortHelp: "Ranged (Targeted AoE), DMG(Lethal/Fire), Knockback",
            icon: "assaultweapons_arm30grenade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.05,
                range: 80.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 2.0031
                        },
                        {
                            type: "Lethal",
                            scale: 1.7788
                        }
                    ],
                    scale: 3.7819
                }
            }
        },
        {
            name: "Beanbag",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Stuns", "Universal Damage Sets"],
            description: "Fires a single non lethal Beanbag that can seriously Disorient a target. Deals little damage and takes a long time to reload, but renders most targets unable to attack for a good while.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Minor DMG(Smash), Foe Disorient",
            icon: "assaultweapons_shotgunbeanbag.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 60.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 0.9,
                damage: {
                    type: "Smashing",
                    scale: 4.82
                },
                stun: 3.0
            }
        },
        {
            name: "Sniper Rifle",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "Sniper Rifle is a powerful piece of hardware. It is very accurate and has a very long range. The impressive round can knock down its target. Like most sniper attacks, you must take your time to aim, so this attack can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Lethal), Foe Knockback",
            icon: "assaultweapons_sniperrifle.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.17
            }
        },
        {
            name: "Flamethrower",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Spews forth a cone of flames from underneath the barrel of your assault rifle, setting foes on fire. Very accurate and very deadly at medium range.",
            shortHelp: "Ranged (Cone), DoT(Fire)",
            icon: "assaultweapons_arflamethrower.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
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
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Sprays a target with accelerant from your flamethrower, igniting it and causing extreme damage over time. Also sets the location on fire if the target is grounded, inflicting damage to additional foes that step in the area.",
            shortHelp: "Ranged, DoT(Fire)",
            icon: "assaultweapons_dot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.15,
                range: 60.0,
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
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Opens up your assault rifle on Full Auto to lay down a massive spray of bullets at your target. Although very slow to reload, damage from this attack is massive, shredding all targets within the cone of effect. There's a chance you may land a lucky shot for extra damage.",
            shortHelp: "Ranged (Cone), DMG(Lethal), +Special",
            icon: "assaultweapons_arfullauto.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 1.5708,
            effects: {
                accuracy: 1.35,
                range: 80.0,
                recharge: 60.0,
                endurance: 15.6,
                cast: 2.5,
                damage: {
                    type: "Lethal",
                    scale: 0.5958
                },
                dotDamage: {
                    type: "Lethal",
                    scale: 0.4386,
                    ticks: 10
                },
                buffDuration: 2.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/assault-rifle'] = CORRUPTOR_ASSAULT_RIFLE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_ASSAULT_RIFLE_POWERSET = CORRUPTOR_ASSAULT_RIFLE_POWERSET;
}