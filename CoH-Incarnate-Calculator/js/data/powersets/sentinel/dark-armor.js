/**
 * Dark Armor
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_DARK_ARMOR_POWERSET = {
    name: "Dark Armor",
    category: "Unknown",
    description: "Dark Armor powerset",
    icon: "dark-armor_set.png",
    powers: [
        {
            name: "Dark Embrace",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You tap into the energy of the Netherworld to protect yourself from damage. This Dark Embrace shrouds you and grants resistance to Lethal, Smashing, Negative Energy and Toxic damage.",
            shortHelp: "Toggle: Self +Res(Smash, Lethal, Negative, Toxic)",
            icon: "darkarmor_darkembrace.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.104,
                cast: 0.67,
                resistance: {
                    smashing: 0.21000000000000002,
                    lethal: 0.21000000000000002,
                    negative: 0.14,
                    toxic: 0.14
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Shadow Dweller",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets", "Healing"],
            description: "You are a true Shadow Dweller of the Netherworld. Your affinity for the shadows grants you an inherent bonus to all Defense, as well as an increased regeneration, Perception and a resistance to Immobilization. Your Perception bonus and resistance to Immobilization improves over level. Shadow Dweller is an Auto power. It is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Regen, +DEF(All but Toxic and Psionic), +Res(Immobilize), +Perception",
            icon: "darkarmor_selfbuffdefense.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                buffDuration: 10.25
            }
        },
        {
            name: "Murky Cloud",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You create a Murky Cloud enshrouding you. This cloud can absorb all forms of energy, making you more resistant to Fire, Cold, Energy, and Negative Energy attacks, as well as Endurance Drain effects.",
            shortHelp: "Toggle: Self +Res(Fire, Cold, Energy, Negative, End Drain)",
            icon: "darkarmor_defractingcloud.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.104,
                cast: 1.17,
                resistance: {
                    fire: 0.21000000000000002,
                    cold: 0.21000000000000002,
                    energy: 0.14,
                    negative: 0.14
                },
                debuffResistance: {
                    recovery: 0.5536,
                    endurance: 0.5536
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Obsidian Shield",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You can create a special Obsidian Shield that grants good resistance to Psionic damage. With your mind enshrouded in darkness you are protected from Sleep, Fear, Hold and Disorient attacks.",
            shortHelp: "Toggle: Self +Res(Psionic, Sleep, Hold, Disorient, Fear)",
            icon: "darkarmor_obsidianshield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 1.17,
                protection: {
                    hold: 8.304,
                    stun: 8.304,
                    sleep: 8.304,
                    fear: 8.304
                },
                resistance: {
                    psionic: 0.35000000000000003
                },
                debuffResistance: {
                    tohit: 0.3,
                    defense: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75,
                tohitBuff: 0.3,
                defenseBuff: 0.3
            }
        },
        {
            name: "Dark Regeneration",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Healing", "Melee AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You can tap the dark essence of the Netherworld to drain a small amount of life from all enemies nearby, thus healing yourself. The more foes affected, the more you will be healed.<br><br>This power is mutually exclusive from Obscure Sustenance.",
            shortHelp: "PBAoE DMG(Negative), Self +HP",
            icon: "darkarmor_darkregeneration.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 30.0,
                endurance: 33.8,
                cast: 1.17,
                damage: {
                    type: "Negative",
                    scale: 0.2
                },
                healing: {
                    scale: 361.42769999999996,
                    perTarget: true
                }
            }
        },
        {
            name: "Obscure Sustenance",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can tap the dark essence of the Netherworld increase your regeneration and recovery rate, as well as making you resistance to -ToHit and -Regeneration debuffs.<br><br>This power is mutually exclusive from Dark Regeneration.",
            shortHelp: "Self Heal, +Regen, Res(-ToHit, -Regeneration), +Recovery(Special)",
            icon: "darkarmor_darkregeneration.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 2.0,
                recharge: 60.0,
                endurance: 10.4,
                cast: 1.93,
                debuffResistance: {
                    tohit: 0.2076,
                    regeneration: 0.2076
                },
                healing: {
                    scale: 301.18975,
                    perTarget: true
                },
                buffDuration: 10.0,
                tohitBuff: 0.75
            }
        },
        {
            name: "Cloak of Darkness",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "A shroud of Netherworld darkness envelops you, making you difficult to spot at a distance. You can be seen only at close range, or if you attack a target. Even if seen, the Cloak of Darkness grants you a bonus to Defense to all attacks and some protection from Immobilization. This Netherworld Cloak also allows you to see things in a new light, allowing you to better see stealthy foes.",
            shortHelp: "Toggle: Self Stealth, +DEF(All), +Perception, Res (Immobilize)",
            icon: "darkarmor_cloakofdarkness.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 1.17,
                protection: {
                    immobilize: 8.304
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Cloak of Fear",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Fear", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Fear", "To Hit Debuff"],
            description: "You can wrap yourself in a nightmarish Cloak of Fear. Foes close to you are treated to visions most horrific, lowering their damage ouptupt and forcing them to tremble in terror, only attacking if attacked, and even then, with a reduced chance to hit. Feeding on your enemies fear will increase your protection against knockback effects.<br><br><color #fcfc95>Notes: Mez enhancements on this power enhance its magnitude instead of its duration.</color>",
            shortHelp: "Toggle: PBAoE Self +Res(Knockback), Foe Fear, -ACC",
            icon: "darkarmor_fearfulaura.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                recharge: 4.0,
                endurance: 0.26,
                cast: 1.17
            }
        },
        {
            name: "Oppressive Gloom",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Stuns"],
            description: "The Netherworld has many mutable properties, such as the Oppressive Gloom. This power allows you to use your own Hit Points to keep enemies near you Disoriented and unable to use any powers. Endurance cost for this is minimal, but the power can be dangerous to use.",
            shortHelp: "Toggle: PBAoE, Foe Disorient, Self -HP",
            icon: "darkarmor_oppressivegloom.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 8.0,
                endurance: 0.156,
                cast: 1.17,
                stun: 2.0
            }
        },
        {
            name: "Soul Transfer",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Endurance Modification", "Healing", "Melee AoE Damage", "Stuns", "Universal Damage Sets"],
            description: "You transfer the souls of nearby enemies into yourself, stunning them while making you able to absorb some damage. This will also make you resistant to control effects, -ToHit debuffs and endurance drain for a short time. You can use this power while concious or after defeat. If used while concious and are defeated soon after, you will automatically bounce back into the fight. If used after defeat, Soul Transfer will also inflict damage as you suck the life force of all foes around you and bring yourself back from the brink of death. This form of the power is much more likely to stun foes.<br><br><color #fcfc95>Notes: This power recharges in <color #FF7F27>10</color> seconds if no foes are hit. Otherwise, it recharges in <color #FF7F27>300</color> seconds.</color>",
            shortHelp: "Self Rez, +Absorb, +Res(Disorient, Sleep, Hold, Immobilize, Knockback, -ToHit, -Endurance), +Special, Foe Disorient",
            icon: "darkarmor_soultransfer.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 10.4,
                cast: 1.17
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/dark-armor'] = SENTINEL_DARK_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_DARK_ARMOR_POWERSET = SENTINEL_DARK_ARMOR_POWERSET;
}