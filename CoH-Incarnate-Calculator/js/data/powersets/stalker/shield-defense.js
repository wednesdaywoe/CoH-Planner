/**
 * Shield Defense
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_SHIELD_DEFENSE_POWERSET = {
    name: "Shield Defense",
    category: "Unknown",
    description: "Shield Defense powerset",
    icon: "shield-defense_set.png",
    powers: [
        {
            name: "Deflection",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Resist Damage"],
            description: "Your mastery of the shield allows you to easily deflect melee attacks, and attacks that do get through your ironclad defenses tend to do less damage. While Deflection is active the user will gain defense to melee attacks and some minor resistance to lethal and smashing damage.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Melee), +Res(Lethal, Smashing)",
            icon: "shielddefense_activedefense.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 1.5,
                resistance: {
                    smashing: 0.11249999999999999,
                    lethal: 0.11249999999999999
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Hide",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Hide makes you almost impossible to detect. When properly 'Hidden\", a Stalker can pull off Critical hits with his attacks, and even land a massive 'Assassins Strike' with an Assassins power. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense. Unlike most stealth powers, Hide can be used at the same time as other Concealment powers, giving you even greater stealth capability. No Endurance cost.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
            icon: "shielddefense_hide.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                cast: 0.73,
                buffDuration: 0.75
            }
        },
        {
            name: "Battle Agility",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Your incredible agility allows you to position your shield to protect yourself from incoming ranged damage. While Battle Agility is active you will benefit from increased Ranged and AoE defense as well as some moderate protection from Defense Debuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Ranged, AoE), +Res(Defense Debuff)",
            icon: "shielddefense_deflection.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 1.5,
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "True Grit",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "Your intense training has left you tougher than even the hardiest of heroes. You gain additional hit points and resistance to fire, cold, energy, negative energy and toxic damage sources. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Res (Cold, Energy, Fire, Negative Energy, Toxic), +MaxHealth",
            icon: "shielddefense_truegrit.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.5,
                            ticks: 5
                        },
                        {
                            type: "Cold",
                            scale: 1.5,
                            ticks: 5
                        },
                        {
                            type: "Energy",
                            scale: 1.5,
                            ticks: 5
                        },
                        {
                            type: "Negative",
                            scale: 1.5,
                            ticks: 5
                        },
                        {
                            type: "Toxic",
                            scale: 1.5,
                            ticks: 5
                        }
                    ]
                },
                resistance: {
                    fire: 0.11249999999999999,
                    cold: 0.11249999999999999,
                    energy: 0.11249999999999999,
                    negative: 0.11249999999999999,
                    toxic: 0.11249999999999999
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Active Defense",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "When you activate this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusion, Repel, Knockback, Hold and Defense Debuff effects for a short duration.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback, Defense Debuff)",
            icon: "shielddefense_battleagility.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 200.0,
                endurance: 10.4,
                cast: 1.5,
                protection: {
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    immobilize: 10.379999999999999,
                    fear: 10.379999999999999,
                    confuse: 10.379999999999999
                },
                debuffResistance: {
                    tohit: 0.3,
                    defense: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                stun: 1.0,
                stunDuration: 120.0,
                buffDuration: 120.0,
                tohitBuff: 0.3,
                defenseBuff: 0.5
            }
        },
        {
            name: "Against All Odds",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "The harder pressed you are in combat the greater your offensive abilities become. Each enemy that stands toe-to-toe with you in combat will grant you a damage bonus. The first foe you engage in melee grants the highest damage bonus, and up to 10 foes can contribute to this effect. Each foe in melee range also suffers from reduced damage as your shield deflects a portion of their damage.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +DMG, Foe -DMG",
            icon: "shielddefense_againstallodds.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.208,
                cast: 2.5,
                buffDuration: 1.25
            }
        },
        {
            name: "Grant Cover",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You are able to use your shield to defend nearby allies. Any teammates who remain nearby gain a bonus to their defense. As a stalker, you can also provide stealth to your teammates if you too are hidden. Additionally, while this power is active, the user and his team mates will gain some resistance to defense and recharge rate debuffs.<br><br><color #fcfc95>Notes: The defense bonus from this power is only applied to nearby team mates, but not yourself.</color><br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "PBAoE, Team (but not self) +DEF(All but Psionic), Team +RES(Defense Debuff, Recharge Debuff)",
            icon: "shielddefense_grantcover.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.312,
                cast: 2.5,
                buffDuration: 2.25,
                defenseBuff: 0.4
            }
        },
        {
            name: "Shield Charge",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can throw all of your might behind your shield and charge through ranks of foes in the blink of an eye. Using this power allows you to teleport to a selected area to deal significant smashing damage to all foes near the location you teleport to, most foes that are struck by your Shield Charge will be knocked down.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE Superior DMG(Smashing), Foe Knockdown; Self Teleport",
            icon: "shielddefense_shieldcharge.png",
            powerType: "Click",
            targetType: "Location (Teleport)",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 90.0,
                endurance: 13.52,
                cast: 1.5,
                buffDuration: 4.0
            }
        },
        {
            name: "One with the Shield",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Resist Damage"],
            description: "When you activate this power, you gain strong resistance against most types of damage and also to Disorient, Immobilization, Hold, Knockback, Repel and Sleep effects. One with the Shield costs little Endurance to activate and increases your recovery and maximum hit points for its duration, but when it wears off you are left exhausted, and substantially drained of Endurance.<br><br><color #fcfc95>Notes: One with the Shield is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Self, +Res(Disorient, Sleep, Hold, Immobilize, Repel, Knockback, All DMG but Psi), +Recovery, +Max HP",
            icon: "shielddefense_onewiththeshield.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 360.0,
                endurance: 2.6,
                cast: 2.5,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 3.0,
                            ticks: 60
                        },
                        {
                            type: "Lethal",
                            scale: 3.0,
                            ticks: 60
                        },
                        {
                            type: "Fire",
                            scale: 1.5,
                            ticks: 60
                        },
                        {
                            type: "Cold",
                            scale: 1.5,
                            ticks: 60
                        },
                        {
                            type: "Energy",
                            scale: 1.5,
                            ticks: 60
                        },
                        {
                            type: "Negative",
                            scale: 1.5,
                            ticks: 60
                        },
                        {
                            type: "Toxic",
                            scale: 1.5,
                            ticks: 60
                        }
                    ]
                },
                protection: {
                    hold: 17.299999999999997,
                    stun: 17.299999999999997,
                    sleep: 17.299999999999997,
                    immobilize: 17.299999999999997
                },
                resistance: {
                    smashing: 0.22499999999999998,
                    lethal: 0.22499999999999998,
                    fire: 0.11249999999999999,
                    cold: 0.11249999999999999,
                    energy: 0.11249999999999999,
                    negative: 0.11249999999999999,
                    toxic: 0.11249999999999999
                },
                buffDuration: 120.0,
                stun: 1.0,
                stunDuration: 120.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/shield-defense'] = STALKER_SHIELD_DEFENSE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_SHIELD_DEFENSE_POWERSET = STALKER_SHIELD_DEFENSE_POWERSET;
}