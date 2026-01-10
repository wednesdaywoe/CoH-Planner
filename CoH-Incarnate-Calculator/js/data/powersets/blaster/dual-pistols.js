/**
 * Dual Pistols
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_DUAL_PISTOLS_POWERSET = {
    name: "Dual Pistols",
    category: "Unknown",
    description: "Dual Pistols powerset",
    icon: "dual-pistols_set.png",
    powers: [
        {
            name: "Chemical Ammunition",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "While this toggle is active you will be equipped with 'Chemical Rounds.' Most of your Dual Pistol attacks will have their secondary damage converted to toxic damage and inflict a minor damage debuff effect on the target.<br><br>In order to earn this power, you must purchase the Swap Ammo power.",
            shortHelp: "Toggle: Ammo Change (Toxic), Special",
            icon: "dualpistols_chemicalammo.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.63,
                buffDuration: 0.75
            }
        },
        {
            name: "Cryo Ammunition",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "While this toggle is active you will be equipped with 'Cryo Rounds'. Most of your Dual Pistol attacks will have their secondary damage converted to cold damage and inflict a minor slow effect on the target.<br><br>In order to earn this power, you must purchase the Swap Ammo power.",
            shortHelp: "Toggle: Ammo Change (Cold), Special",
            icon: "dualpistols_cryoammo.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.63,
                buffDuration: 0.75
            }
        },
        {
            name: "Incendiary Ammunition",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "While this toggle is active you will be equipped with 'Incendiary Rounds.' Most of your Dual Pistol attacks will have their secondary damage converted to fire damage and inflict a minor damage over time effect.<br><br>In order to earn this power, you must purchase the Swap Ammo power.",
            shortHelp: "Toggle: Ammo Change (Fire), Special",
            icon: "dualpistols_incendiaryammo.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.63,
                buffDuration: 0.75
            }
        },
        {
            name: "Dual Pistols",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "You're a master of akimbo pistols, wielding a high caliber firearm in each hand. Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your \"Swap Ammo\" power to change out your ammo mid-battle. Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.",
            shortHelp: "Dual Pistols",
            icon: "dual_pistols_set.png"
        },
        {
            name: "Dual Wield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Dual Wield fires both pistols in rapid succession at its desired target. This power is slower than Pistols, but deals more damage, and the target may get knocked back by the force of the impact.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.<br><br>Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockback to:<br><br><color #9bfafa>*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*A minor damage over time effect if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*A -damage effect if 'Chemical Ammo' is loaded.</color>",
            shortHelp: "Ranged, DMG(Lethal/Special), Foe Knockback/Special",
            icon: "dualpistols_dualwield.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 3.1292999999999997
                        },
                        {
                            type: "Fire",
                            scale: 0.9388
                        },
                        {
                            type: "Cold",
                            scale: 0.9388
                        },
                        {
                            type: "Toxic",
                            scale: 0.9388
                        }
                    ],
                    scale: 5.9456999999999995
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.113,
                    ticks: 3
                },
                buffDuration: 3.1
            }
        },
        {
            name: "Pistols",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "Quickly fires a round from one of your heavy automatic pistols. Damage is average, but the fire rate is very fast. If standard ammo is used, Pistols will also reduce the target's Defense.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.<br><br>Additionally, changing your ammunition type will also change the secondary effect of this attack from -Defense to:<br><br><color #9bfafa>*A -minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*A -minor damage over time effect if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*A -damage debuff effect if 'Chemical Ammo' is loaded.</color>",
            shortHelp: "Ranged, DMG(Lethal/Special), Foe -Defense",
            icon: "dualpistols_pistols.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 2.2601
                        },
                        {
                            type: "Fire",
                            scale: 0.6779999999999999
                        },
                        {
                            type: "Cold",
                            scale: 0.6779999999999999
                        },
                        {
                            type: "Toxic",
                            scale: 0.6779999999999999
                        }
                    ],
                    scale: 4.2941
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.113,
                    ticks: 2
                },
                buffDuration: 2.1,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Empty Clips",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Knockback", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You empty the clips of both your pistols in an arc of suppression fire. This attack can blast multiple foes in the affected cone area, and has a small chance of knocking some foes down. Affected targets will have their defense reduced slightly as well if Standard Ammo is equipped.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.<br><br>Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockdown to:<br><br><color #9bfafa>*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*A minor damage over time effect if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*A -damage effect if 'Chemical Ammo' is loaded.</color>",
            shortHelp: "Ranged (Cone), DMG(Lethal/Special), Foe -Defense, Knockdown/Special",
            icon: "dualpistols_emptyclips.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.1,
                range: 40.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.48790000000000006,
                            ticks: 3
                        },
                        {
                            type: "Fire",
                            scale: 0.2594,
                            ticks: 3
                        },
                        {
                            type: "Cold",
                            scale: 0.1464,
                            ticks: 3
                        },
                        {
                            type: "Toxic",
                            scale: 0.1464,
                            ticks: 3
                        }
                    ]
                },
                buffDuration: 1.6,
                defenseDebuff: 1.0
            }
        },
        {
            name: "Swap Ammo",
            available: 5,
            tier: 3,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "By purchasing this power, you will be granted the Cryo Ammunition, Incendiary Ammunition and Chemical Ammunition toggles. Activating these toggles will change your secondary damage type on most Dual Pistols attacks from lethal (Standard Rounds) to cold (Cryo Rounds), fire (Incendiary Rounds) or toxic (Chemical Rounds).<br><br>These toggles are mutually exclusive and only one can be active at a time. If no Swap Ammo toggles are active, the player will revert to Standard Ammunition.<br><br>Different ammo types also have different secondary effects. Examine your Dual Pistols powers for more information.",
            shortHelp: "Change Secondary Damage/Effects",
            icon: "dualpistols_swapammo.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                buffDuration: 2.25
            }
        },
        {
            name: "Bullet Rain",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You fire your pistols faster than the human eye can follow, causing your bullet trajectory to arc, dealing moderate Lethal damage and possibly knocking your foes back.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.<br><br>Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockback to:<br><br><color #9bfafa>*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*A minor damage over time effect if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*A -damage effect if 'Chemical Ammo' is loaded.</color>",
            shortHelp: "Ranged (Targeted AoE), DMG(Lethal/Special), Knockback/Special",
            icon: "dualpistols_explosiveclip.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 18.0,
                endurance: 16.848,
                cast: 1.67,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 1.0957,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.2831,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.1701,
                            ticks: 2
                        },
                        {
                            type: "Toxic",
                            scale: 0.1701,
                            ticks: 2
                        }
                    ]
                },
                buffDuration: 1.1
            }
        },
        {
            name: "Suppressive Fire",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Ranged Damage", "Stuns", "Universal Damage Sets"],
            description: "Suppressive Fire allows the user to quickly stun their target for a short time and deal a very minor amount of Lethal damage.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.<br><br>Additionally, changing your ammunition type will lower the power's base recharge to 8 seconds and change the secondary effect of this attack from Disorient effect to a Hold effect if <color #9bfafa>'Cryo Ammo'</color>, <color #fac39b>'Incendiary Ammo'</color> or <color #9efa9b>'Chemical Ammo'</color> are loaded.<br><br><color #9bfafa>*Significantly higher damage and boss-stopping hold if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*Significantly higher damage and minor hold if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*Somewhat increased damage and long duration hold if 'Chemical Ammo' is loaded.</color>",
            shortHelp: "Ranged, DMG(Lethal/Special), Foe Disorient/Special",
            icon: "dualpistols_suppressivefire.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 60.0,
                recharge: 20.0,
                endurance: 10.192,
                cast: 1.5
            }
        },
        {
            name: "Executioner's Shot",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Blaster Archetype Sets", "Defense Debuff", "Knockback", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Executioner's Shot is a deadly ranged attack. Foes struck by this attack will suffer lethal damage and will likely be knocked back by the impact of this attack. Targets struck by Executioner's Shot while no special ammunition is equipped will have their defenses reduced for a short time.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.<br><br>Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockback to:<br><br><color #9bfafa>*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*A minor damage over time effect if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*A -damage effect if 'Chemical Ammo' is loaded.</color>",
            shortHelp: "Ranged, DMG(Lethal/Special), Foe -Defense, Knockback/Special",
            icon: "dualpistols_executionersshot.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.25,
                range: 80.0,
                recharge: 10.0,
                endurance: 10.4,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.0893
                        },
                        {
                            type: "Fire",
                            scale: 1.2268
                        },
                        {
                            type: "Cold",
                            scale: 1.2268
                        },
                        {
                            type: "Toxic",
                            scale: 1.2268
                        }
                    ],
                    scale: 7.769699999999999
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.169,
                    ticks: 3
                },
                buffDuration: 3.1,
                defenseDebuff: 1.25
            }
        },
        {
            name: "Piercing Rounds",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You fire your pistols with deadly precision in a very narrow cone, piercing up to three enemies. Piercing Rounds deals Superior lethal damage and reduces targets' Damage Resistance for a short time.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic, and a secondary effect will be included in this attack:<br><br><color #9bfafa>*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*A minor damage over time effect if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*A -damage effect if 'Chemical Ammo' is loaded.</color><br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Narrow Ranged (Cone), DMG(Lethal/Special), Foes -Res(All)/Special",
            icon: "dualpistols_piercingrounds.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 3,
            arc: 0.0873,
            effects: {
                accuracy: 1.1,
                range: 80.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.5,
                damage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 4.5920000000000005
                        },
                        {
                            type: "Fire",
                            scale: 1.3776
                        },
                        {
                            type: "Cold",
                            scale: 1.3776
                        },
                        {
                            type: "Toxic",
                            scale: 1.3026
                        }
                    ],
                    scale: 8.6498
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.169,
                    ticks: 2
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Hail of Bullets",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You fire a hail of bullets at all enemies around you dealing Extreme lethal damage. Enemies that are struck have a chance to be knocked down. Having Standard Rounds will dramatically increase this chance to knockdown your foes. If you hit at least one target you will gain a moderate melee, ranged and AoE Defense bonus for a brief period.<br><br>Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.<br><br>Additionally, changing your ammunition type will also change the secondary effect of this attack from a guaranteed knockdown effect to:<br><br><color #9bfafa>*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.</color><br><color #fac39b>*A minor damage over time effect if 'Incendiary Ammo' is loaded.</color><br><color #9efa9b>*A -damage effect if 'Chemical Ammo' is loaded.</color>",
            shortHelp: "PBAoE, DMG(Lethal/Special), Self +Def(Melee, Ranged, AoE), Foe Knockdown/Special",
            icon: "dualpistols_hailofbullets.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.4,
                recharge: 105.0,
                endurance: 20.8,
                cast: 2.47,
                dotDamage: {
                    types: [
                        {
                            type: "Lethal",
                            scale: 0.6443,
                            ticks: 11
                        },
                        {
                            type: "Fire",
                            scale: 0.393,
                            ticks: 11
                        },
                        {
                            type: "Cold",
                            scale: 0.193,
                            ticks: 11
                        },
                        {
                            type: "Toxic",
                            scale: 0.193,
                            ticks: 11
                        }
                    ]
                },
                buffDuration: 2.3
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/dual-pistols'] = BLASTER_DUAL_PISTOLS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_DUAL_PISTOLS_POWERSET = BLASTER_DUAL_PISTOLS_POWERSET;
}