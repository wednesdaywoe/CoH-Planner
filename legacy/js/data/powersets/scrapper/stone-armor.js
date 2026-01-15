/**
 * Stone Armor
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_STONE_ARMOR_POWERSET = {
    name: "Stone Armor",
    category: "Unknown",
    description: "Stone Armor powerset",
    icon: "stone-armor_set.png",
    powers: [
        {
            name: "Rock Armor",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Your skin becomes stone while this power is active. Stone Armor protects you from Smashing and Lethal attacks. They are less likely to land and affect you. Stone Armor also grants you resistance to Defense DeBuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Lethal, Smashing), Res(DeBuff DEF)",
            icon: "stonearmor_stonearmor.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 0.73,
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "Stone Skin",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets", "Resist Damage"],
            description: "Your tough skin is naturally resistant to most types of damage. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res(All but Psionics), +DEF(All but Psionics)",
            icon: "stonearmor_stoneskin.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    type: "Psionic",
                    scale: 1.0,
                    ticks: 5
                },
                resistance: {
                    smashing: 0.075,
                    lethal: 0.075,
                    fire: 0.075,
                    cold: 0.075,
                    energy: 0.075,
                    negative: 0.075,
                    toxic: 0.075,
                    psionic: 0.075
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Earth's Embrace",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "You are so connected to the Earth, you can draw upon its power to add to your health. Activating this power increases your maximum Hit Points and grants you resistance to Toxic Damage.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +HP, Res(Toxic)",
            icon: "stonearmor_earthsembrace.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 120.0,
                endurance: 10.4,
                cast: 1.0,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 30
                },
                resistance: {
                    toxic: 0.15
                },
                healing: {
                    scale: 180.71383500000002,
                    perTarget: true
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Mud Pots",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Scrapper Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "While this power is active, you draw upon the geothermal power of the Earth to create a bubbling pool of hot mud around you. All foes in melee range will become snared and entrapped in the mud, Immobilizing some and slowing others. The boiling heat from Mud Pots may also deal some damage over time to the snared foes.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: PBAoE, Minor DoT(Fire), Foe Immobilize, -SPD",
            icon: "stonearmor_clay.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 1.04,
                cast: 2.03,
                damage: {
                    type: "Fire",
                    scale: 0.18
                },
                buffDuration: 5.0
            }
        },
        {
            name: "Rooted",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "While this power is active, you merge with the Earth and draw forth its power to become resistant to Knockback, Sleep, Hold, Disorient and Endurance Drain effects, and increase your Hit Point Regeneration rate. Rooted also grants you resistance to Defense DeBuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +Res(Knockback, Sleep, Disorient, Hold, End Drain, DeBuff DEF), +Regeneration",
            icon: "stonearmor_rooted.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 1.17,
                protection: {
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    immobilize: 10.379999999999999
                },
                debuffResistance: {
                    defense: 0.3,
                    tohit: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                buffDuration: 0.75,
                defenseBuff: 0.3,
                stun: 1.0,
                stunDuration: 0.75,
                tohitBuff: 0.3
            }
        },
        {
            name: "Crystal Armor",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification"],
            description: "While this power is active, your skin becomes encrusted in various quartz crystals. Crystal Armor makes Energy and Negative Energy attacks less likely to hit. This power also grants you an Endurance recovery buff and resistance to Defense DeBuffs.<br><br>Crystal Armor also adds an Elusivity defense bonus to Energy and Negative Energy Attacks in PVP zones.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +Recovery, +DEF(Energy, Negative), Res(DeBuff DEF)",
            icon: "stonearmor_crystalarmor.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 1.0,
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "Minerals",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Activating this power summons several rare earth rock Minerals to orbit around you. These Minerals can disperse thought patterns and make Psionic attacks less likely to hit. They also bring clarity of the mind reducing the recharge time of your powers, increasing your Perception, and making you resistant to Confusion.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +Recharge, +DEF(Psionic), Res(Confuse), +Perception",
            icon: "stonearmor_mineralcrust.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 0.73,
                protection: {
                    confuse: 30.0
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Brimstone Armor",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "While this power is active, your skin becomes encrusted in cracked magma. Brimstone Armor makes you highly resistant to Fire, Cold and Toxic damage, and helps your attacks set enemies on fire, delivering damage over time.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +Res(Fire, Cold, Toxic), +Special",
            icon: "stonearmor_magmaarmor.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 0.73,
                resistance: {
                    fire: 0.22499999999999998,
                    cold: 0.22499999999999998,
                    toxic: 0.15
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Geode",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "When you activate this power, you encase yourself in various protective mineral layers that can absorb incoming damage while you heal and recover endurance at an incredible rate. You can emerge at will by deactivating the power, but you cannot stay in this Geode for more than 30 seconds. If enemies inflict enough damage, they can break you out of this effect.<br><br>If Brimstone Armor is owned, this power will also grant Geothermal Power every 5 seconds, increasing the damage inflicted by Brimstone's Fire by 8% per stack.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Toggle: Self +Regeneration, +Recovery, Invulnerable; Self Hold",
            icon: "stonearmor_geode.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 0.026,
                cast: 0.07,
                buffDuration: 0.2
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/stone-armor'] = SCRAPPER_STONE_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_STONE_ARMOR_POWERSET = SCRAPPER_STONE_ARMOR_POWERSET;
}