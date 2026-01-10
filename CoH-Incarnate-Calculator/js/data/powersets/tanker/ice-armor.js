/**
 * Ice Armor
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_ICE_ARMOR_POWERSET = {
    name: "Ice Armor",
    category: "Unknown",
    description: "Ice Armor powerset",
    icon: "ice-armor_set.png",
    powers: [
        {
            name: "Frozen Armor",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "While this power is active, you coat yourself in rock hard Frozen Armor. The hardness of the Frozen Armor offers good defense to Smashing and Lethal attack as well as reduces Cold damage. Also, Fire attacks deal slightly less damage and you can resist Defense DeBuffs.",
            shortHelp: "Self, +Def(Smash, Lethal), +Res(Cold, Fire, DeBuff DEF)",
            icon: "icearmor_icearmor.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.73,
                resistance: {
                    cold: 0.30000000000000004,
                    fire: 0.125
                },
                debuffResistance: {
                    defense: 0.17300000000000001
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "Hoarfrost",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "Activating this power covers you in a thick layer of Hoarfrost. The frost can absorb the impact from enemy attacks, effectively increasing your maximum Hit Points for a short time. Hoarfrost also grants you resistance to Toxic Damage.<br><br>This power is mutually exclusive from Rime",
            shortHelp: "Self Heal, +Max HP, Res(Toxic)",
            icon: "icearmor_hoarfrost.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 360.0,
                endurance: 14.56,
                cast: 0.73,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 60
                },
                resistance: {
                    toxic: 0.2
                },
                healing: {
                    scale: 749.6276,
                    perTarget: true
                },
                buffDuration: 120.0
            }
        },
        {
            name: "Rime",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "Activating this power covers you in a thick layer of rime. The rime can absorb the impact of a limited number of enemy attacks, the lingering moisture increasing your regeneration rate. Rime also grants you resistance to Toxic Damage.<br><br>This power is mutually exclusive from Hoarfrost",
            shortHelp: "Self +Regen, +Absorb, Res(Toxic)",
            icon: "icearmor_rime.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 0.73,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 30
                },
                resistance: {
                    toxic: 0.2
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Chilling Embrace",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Slow Movement", "Threat Duration"],
            description: "While active, you dramatically lower the temperature around yourself, Slowing the attack rate of all nearby foes, as well as their movement speed and damage.",
            shortHelp: "Toggle: PBAoE, Foe -Recharge, -Speed, -DMG",
            icon: "icearmor_chillingembrace.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.73,
                buffDuration: 5.0
            }
        },
        {
            name: "Wet Ice",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "When you activate this power, you cover yourself in a thick coating of slick, melting ice. This makes you slippery, leaving you nearly immune to Disorient, Immobilization, Hold, Sleep, Slow and Knockback effects. This power also adds a slight increase to your defense to all attacks. Wet Ice also reduces Cold damage and grants you resistance to Defense DeBuffs.",
            shortHelp: "Self, +DEF(All), +Res(Cold, Disorient, Immobilize, Hold, Sleep, Slow, Knockback, DeBuff DEF)",
            icon: "icearmor_wetice.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.73,
                protection: {
                    hold: 12.975,
                    stun: 12.975,
                    sleep: 12.975,
                    immobilize: 12.975
                },
                resistance: {
                    cold: 0.30000000000000004
                },
                debuffResistance: {
                    recharge: 0.6,
                    movement: 0.6,
                    tohit: 0.3,
                    defense: 0.3
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75,
                tohitBuff: 0.3,
                defenseBuff: 0.4
            }
        },
        {
            name: "Permafrost",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "Your body temperature permanently lowers to 33 degrees Fahrenheit. Permafrost gives you strong resistance to Cold damage, some resistance to Fire damage and minor Smashing, Lethal, Energy, Negative Energy, Toxic and Psionic resistance as well. You also gain an inherent resistance to Slow effects. This power is always on and does not cost Endurance.",
            shortHelp: "Auto: Self +Res(All damage, Slow)",
            icon: "icearmor_permafrost.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 3.0,
                            ticks: 5
                        },
                        {
                            type: "Fire",
                            scale: 1.25,
                            ticks: 5
                        },
                        {
                            type: "Smashing",
                            scale: 0.5,
                            ticks: 5
                        },
                        {
                            type: "Lethal",
                            scale: 0.5,
                            ticks: 5
                        },
                        {
                            type: "Energy",
                            scale: 0.5,
                            ticks: 5
                        },
                        {
                            type: "Negative",
                            scale: 0.5,
                            ticks: 5
                        },
                        {
                            type: "Psionic",
                            scale: 0.5,
                            ticks: 5
                        },
                        {
                            type: "Toxic",
                            scale: 0.5,
                            ticks: 5
                        }
                    ]
                },
                resistance: {
                    cold: 0.30000000000000004,
                    fire: 0.125,
                    smashing: 0.05,
                    lethal: 0.05,
                    energy: 0.05,
                    negative: 0.05,
                    psionic: 0.05,
                    toxic: 0.05
                },
                debuffResistance: {
                    recharge: 0.2,
                    movement: 0.2
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Icicles",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "While active, you form sharp icicles on your body that continuously cut all foes that attempt to enter melee range.",
            shortHelp: "Toggle: PBAoE, DoT(Cold)",
            icon: "icearmor_icicles.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 1.04,
                cast: 1.67,
                damage: {
                    type: "Cold",
                    scale: 0.1571
                }
            }
        },
        {
            name: "Glacial Armor",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "When you activate this power you cover yourself in Glacial ice. The crystalline matrix of the armor has refracting properties that make Energy and Negative Energy attacks less likely to land, and acts as a lens to increase your Perception to see hidden foes. The bitter cold of Glacial Armor also reduces Cold damage and also you to resist Defense DeBuffs.",
            shortHelp: "Toggle: Self +DEF(Energy, Negative), Res (Cold, DeBuff DEF), +Perception",
            icon: "icearmor_glacialarmor.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 2.03,
                resistance: {
                    cold: 0.30000000000000004
                },
                debuffResistance: {
                    defense: 0.17300000000000001
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "Energy Absorption",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Threat Duration"],
            description: "Activating this power draws moisture directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw moisture from adds to your own Endurance as well as Defense to all attacks. The first foe you absorb grants the highest Defense bonus, and you can absorb up to 10 foes. In addition to Defense, Energy Absorption also grants you resistance to Slow effects. If there are no foes within range, this power will fail.",
            shortHelp: "PBAoE, Self +End, +DEF(All), Res (Slow), Foe -End",
            icon: "icearmor_energyabsorption.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 13.0,
                cast: 1.33
            }
        },
        {
            name: "Icy Bastion",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Resist Damage"],
            description: "You encase yourself in a block of solid ice, rendering yourself invulnerable but unable to act. While the power is active you heal damage and recover endurance at an incredible rate. You can remain in this state for up to 30 seconds. Should you deactivate the power earlier, some of the resistance to damage and other effects will remain until the full 30 seconds window is over. <br><br><color #fcfc95>Notes:If you are under the effects of No Phase, this power will instantly deactivate and leave you only with the lingering effects for 30 seconds.</color>",
            shortHelp: "Toggle: Self +Res(All DMG, but Psionics), +Res(Knockback, Repel, Disorient, Hold, Immobilize, Sleep), +Regen, +Recovery, Invulnerable; Self Hold",
            icon: "icearmor_hybernate.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 300.0,
                endurance: 0.1085
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/ice-armor'] = TANKER_ICE_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_ICE_ARMOR_POWERSET = TANKER_ICE_ARMOR_POWERSET;
}