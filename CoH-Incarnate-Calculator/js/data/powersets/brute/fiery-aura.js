/**
 * Fiery Aura
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_FIERY_AURA_POWERSET = {
    name: "Fiery Aura",
    category: "Unknown",
    description: "Fiery Aura powerset",
    icon: "fiery-aura_set.png",
    powers: [
        {
            name: "Blazing Aura",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "While active, you are surrounded by flames that burn all foes that attempt to enter melee range.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: PBAoE, DoT (Fire)",
            icon: "flamingshield_fieryaura.png",
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
                    scale: 0.319
                }
            }
        },
        {
            name: "Fire Shield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "While this power is active, Fire Shield gives you good resistance to Lethal, Smashing and Fire damage. Fire Shield also provides minimal resistance to Cold damage as well as protection from Disorient effects.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self +Res(Fire, Lethal, Smash, Cold, Disorient)",
            icon: "flamingshield_flamingshield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 1.67,
                protection: {
                    stun: 10.379999999999999
                },
                resistance: {
                    smashing: 0.22499999999999998,
                    lethal: 0.22499999999999998,
                    fire: 0.22499999999999998,
                    cold: 0.075
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75
            }
        },
        {
            name: "Phoenix Rising",
            available: 0,
            tier: 1,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "If you are defeated, you can rise from the ashes. The fiery resurrection blasts nearby foes with an explosion and knocks them down and Disorients them. You will revive with about half of your Hit Points and Endurance. Gift of the Phoenix will leave you invulnerable for a brief time, and protected from XP Debt for 90 seconds.<br><br>You can also use this power even if you have not been defeated, with weakend effects. The closer you are to being defeated, the stronger the effects will be. You need to be under 75% health to activate this power.",
            shortHelp: "Self Rez, Special",
            icon: "flamingshield_temperatureprotection.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                buffDuration: 0.5
            }
        },
        {
            name: "Healing Flames",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "You can concentrate for a few moments to heal yourself. The power of the flames can also protect you from Toxic Damage for a while.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Self Heal, +Res(Toxic)",
            icon: "flamingshield_healingflames.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 40.0,
                endurance: 10.4,
                cast: 0.73,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 30
                },
                resistance: {
                    toxic: 0.15
                },
                healing: {
                    scale: 374.81375,
                    perTarget: true
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Temperature Protection",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "Temperature Protection gives you strong resistance to Fire damage, some resistance to Cold damage and slow effects, and grants minor, unenhanceable regeneration as well as provide very minor Knockback Protection. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res(Fire, Cold, Slow, Knock), +Regen",
            icon: "flamingshield_temperatureprotection.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 3.0,
                            ticks: 5
                        },
                        {
                            type: "Cold",
                            scale: 1.0,
                            ticks: 5
                        }
                    ]
                },
                resistance: {
                    cold: 0.075,
                    fire: 0.22499999999999998
                },
                debuffResistance: {
                    recharge: 0.2,
                    movement: 0.2
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Plasma Shield",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "While this power is active, you are surrounded by pure plasma. The Plasma Shield gives you resistance to Energy, Negative Energy, and Fire damage. Plasma Shield also gives your protection from Sleep and Hold effects.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self +Res(Energy, Negative, Fire, Hold, Sleep)",
            icon: "flamingshield_plasmasheild.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 3.0,
                protection: {
                    hold: 10.379999999999999,
                    sleep: 10.379999999999999
                },
                resistance: {
                    fire: 0.22499999999999998,
                    energy: 0.22499999999999998,
                    negative: 0.22499999999999998,
                    psionic: 0.22499999999999998
                },
                debuffResistance: {
                    tohit: 0.3,
                    defense: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                buffDuration: 0.75,
                tohitBuff: 0.3,
                defenseBuff: 0.3
            }
        },
        {
            name: "Consume",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Endurance Modification", "Healing", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You can drain body heat from all nearby foes, and even from the air itself, increasing your health, resistance against endurance drain, as well as replenishing your own Endurance. The more foes affected, the more Endurance is gained. Foes suffer minimal Fire damage.<br><br>HP and End Drain resistance do not scale with enemy count, but will be granted even if there are no enemies nearby.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, DMG(Fire), Self +End, +Max HP",
            icon: "flamingshield_consume.png",
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
            name: "Burn",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Brute Archetype Sets", "Melee AoE Damage", "Threat Duration", "Universal Damage Sets"],
            description: "You can ignite the ground beneath you, freeing yourself from Immobilization effects. Foes that enter the flames you leave behind will take damage. You must be near the ground to activate this power.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Location (PBAoE), DoT (Fire), Self Res(Immobilize)",
            icon: "flamingshield_burn.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                recharge: 25.0,
                endurance: 5.2,
                cast: 2.03,
                damage: {
                    type: "Fire",
                    scale: 1.44
                }
            }
        },
        {
            name: "Fiery Embrace",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Fiery Embrace causes all your damaging powers to do bonus fire damage.<br><br>In PvP, this power significantly boosts the damage of all your Fire attacks for quite a while. Also increases the damage of all your other non-fire based attacks for a short while.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG",
            icon: "flamingshield_fieryembrace.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 7.8,
                cast: 0.73,
                buffDuration: 20.0
            }
        },
        {
            name: "Phoenix Rising",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Damage"],
            allowedSetCategories: ["Brute Archetype Sets", "Endurance Modification", "Healing", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "If you are defeated, you can rise from the ashes. The fiery resurrection blasts nearby foes with an explosion and knocks them down and Disorients them. You will revive with about half of your Hit Points and Endurance. Gift of the Phoenix will leave you invulnerable for a brief time, and protected from XP Debt for 90 seconds.<br><br>You can also use this power even if you have not been defeated, with weakend effects. The closer you are to being defeated, the stronger the effects will be. You need to be under 75% health to activate this power.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Self Rez, Special",
            icon: "flamingshield_riseofthephoenix.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 300.0,
                cast: 2.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/fiery-aura'] = BRUTE_FIERY_AURA_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_FIERY_AURA_POWERSET = BRUTE_FIERY_AURA_POWERSET;
}