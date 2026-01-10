/**
 * Arsenal Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ARSENAL_ASSAULT_POWERSET = {
    name: "Arsenal Assault",
    category: "Unknown",
    description: "Arsenal Assault powerset",
    icon: "arsenal-assault_set.png",
    powers: [
        {
            name: "Burst",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
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
                    scale: 0.6859,
                    ticks: 3
                },
                buffDuration: 0.91,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Buttstroke",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Melee Damage", "Stuns", "Universal Damage Sets"],
            description: "A smash with the butt of your rifle with a high chance of disorienting.",
            shortHelp: "Melee, DMG(Smash), Foe Disorient",
            icon: "assaultweapons_riflebutt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.17,
                damage: {
                    type: "Smashing",
                    scale: 3.179
                }
            }
        },
        {
            name: "Buckshot",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
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
                    scale: 1.5351
                }
            }
        },
        {
            name: "Elbow Strike",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Universal Damage Sets"],
            description: "You strike your foe with a powerful punch dealing Smashing damage and knocking the target back.",
            shortHelp: "Melee, DMG(Smash), Foe Knockback",
            icon: "assaultweapons_heavyblow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.07,
                damage: {
                    type: "Smashing",
                    scale: 3.909
                }
            }
        },
        {
            name: "Power Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Boosts the damage and secondary effects of your powers. Your powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes and more, are all improved. The effects of Power Up last a short while, and only the next couple of attacks will be boosted.",
            shortHelp: "Self +Special, +Dmg(All)",
            icon: "assaultweapons_powerup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 7.8,
                cast: 1.17,
                buffDuration: 10.0,
                stun: 1.0,
                stunDuration: 10.0,
                tohitBuff: 0.5,
                defenseBuff: 0.5
            }
        },
        {
            name: "Trip Mine",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can place a Trip Mine on the ground. Any villains that pass near the Trip Mine will cause it to explode, damaging all nearby foes and sending them flying.",
            shortHelp: "Place Mine: PBAoE, DMG(Fire), Foe Knockback",
            icon: "assaultweapons_tripmine.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.93,
                buffDuration: 170.0
            }
        },
        {
            name: "Targeting Drone",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "When this device is activated, the small Targeting Drone hovers around your head and emits targeting laser sights. The lasers can dramatically improve your chance to hit, and increase your perception, allowing you to better see stealthy foes. Targeting Drone also grants you resistance to powers that debuff your chance to hit.",
            shortHelp: "Toggle: Self +To Hit, +Perception, Res(DeBuff To Hit)",
            icon: "assaultweapons_targetingdrone.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.156,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 0.75
            }
        },
        {
            name: "Sniper Rifle",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "Sniper Rifle is a powerful piece of hardware. It is very accurate and has a very long range. The impressive round can knock down its target. Like most sniper attacks, you must take your time to aim, so this attack can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Lethal), Foe Knockback",
            icon: "assaultweapons_sniperrifle.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 150.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 1.17
            }
        },
        {
            name: "Ignite",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Universal Damage Sets"],
            description: "Sprays a target with accelerant from your flamethrower, igniting it and causing extreme damage over time. Also sets the location on fire if the target is grounded, inflicting damage to additional foes that step in the area.",
            shortHelp: "Ranged, DoT(Fire)",
            icon: "assaultweapons_dot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.15,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.865,
                cast: 2.0,
                dotDamage: {
                    type: "Fire",
                    scale: 0.2508,
                    ticks: 22
                },
                buffDuration: 5.5
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/arsenal-assault'] = DOMINATOR_ARSENAL_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ARSENAL_ASSAULT_POWERSET = DOMINATOR_ARSENAL_ASSAULT_POWERSET;
}