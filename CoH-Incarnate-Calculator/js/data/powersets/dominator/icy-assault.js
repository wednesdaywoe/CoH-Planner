/**
 * Icy Assault
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ICY_ASSAULT_POWERSET = {
    name: "Icy Assault",
    category: "Unknown",
    description: "Icy Assault powerset",
    icon: "icy-assault_set.png",
    powers: [
        {
            name: "Ice Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Ice Bolt quickly pelts an enemy with small icy daggers; their chill Slows a foe's attacks and movement for a time. Fast, but little damage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Cold/Smash), Foe -Recharge, -SPD",
            icon: "iceassault_bolt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 5.0,
                endurance: 6.032,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 1.968
                        },
                        {
                            type: "Smashing",
                            scale: 0.492
                        }
                    ],
                    scale: 2.46
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Ice Sword",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You create a blade of solid ice that deals good damage. Being hit by this Ice Sword will Slow a target's movement and attack speed, due to the intense chill.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Cold/Lethal), Foe -Recharge, -SPD",
            icon: "iceassault_icesword.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.33,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 2.2337
                        },
                        {
                            type: "Lethal",
                            scale: 1.4573
                        }
                    ],
                    scale: 3.691
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Ice Sword Circle",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Mastery of your Ice Sword has enabled you to make an attack on every foe within melee distance. This will slash and chill your enemies, dealing moderate damage and slowing all affected targets' movement and attack speed.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE Melee, Light DMG(Cold/Lethal), Foe -Recharge, -SPD",
            icon: "iceassault_iceswordcircle.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 22.0,
                endurance: 20.176,
                cast: 2.67,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.4947
                        },
                        {
                            type: "Cold",
                            scale: 1.4947
                        }
                    ],
                    scale: 2.9894
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Ice Blast",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Light DMG(Cold/Smash), Foe -Recharge, -SPD",
            icon: "iceassault_iceblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 2.005
                        },
                        {
                            type: "Smashing",
                            scale: 0.655
                        }
                    ],
                    scale: 2.66
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Power Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Boosts the damage and secondary effects of your powers. Your powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes and more, are all improved. The effects of Power Up last a short while, and only the next couple of attacks will be boosted.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +Special, +Dmg(All)",
            icon: "iceassault_powerboost.png",
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
            name: "Frost Breath",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Unleashes a cone of frosty breath that can Slow your opponents' movement and attacks. Very accurate and very deadly at medium range.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Close (Cone), Moderate DoT(Cold), Foe -Recharge, -SPD",
            icon: "iceassault_frost.png",
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
                    type: "Cold",
                    scale: 1.3734,
                    ticks: 1
                },
                buffDuration: 0.6
            }
        },
        {
            name: "Chilling Embrace",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "While active, you dramatically lower the temperature around yourself, Slowing the attack rate of all nearby foes, as well as their damage and movement speed. The low air temperatures may also deal some damage over time to the snared foes.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: PBAoE, Minor DoT(Cold), Foe -Recharge, -Speed",
            icon: "iceassault_chillingembrace.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.52,
                cast: 0.73,
                damage: {
                    type: "Cold",
                    scale: 0.14
                },
                buffDuration: 5.0
            }
        },
        {
            name: "Ice Slash",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Ice Slash allows the user to create a blade of solid ice and strike a foe for high damage. Being hit by Ice Slash will Slow a foes' attack and movement speed, due to the intense chill.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, Superior DMG(Cold/Lethal), Foe -Recharge, -SPD",
            icon: "iceassault_iceswordcleave.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 17.0,
                endurance: 16.016,
                cast: 1.83,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.7205000000000004
                        },
                        {
                            type: "Cold",
                            scale: 2.7205000000000004
                        }
                    ],
                    scale: 5.441000000000001
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Bitter Ice Blast",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "Slow Movement", "To Hit Debuff", "Universal Damage Sets"],
            description: "A slower yet more powerful version of Ice Blast, Bitter Ice Blast deals much more damage and can also reduce your enemy's chance to hit. Like other Ice Blast powers, Bitter Ice Blast can Slow a target's movement and attack speed.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, High DMG(Cold/Smash), Foe -Recharge, -SPD, -To Hit",
            icon: "iceassault_bitterblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.07,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 2.2086
                        },
                        {
                            type: "Smashing",
                            scale: 1.7005
                        }
                    ],
                    scale: 3.9091
                },
                tohitDebuff: 1.0,
                buffDuration: 6.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['dominator/icy-assault'] = DOMINATOR_ICY_ASSAULT_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ICY_ASSAULT_POWERSET = DOMINATOR_ICY_ASSAULT_POWERSET;
}