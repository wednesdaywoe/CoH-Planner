/**
 * Dark Armor
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_DARK_ARMOR_POWERSET = {
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
            description: "You tap into the energy of the Netherworld to protect yourself from damage. This Dark Embrace shrouds you and grants resistance to Lethal, Smashing, Negative Energy and Toxic damage.<br><br><color #fcfc95>Recharge: Fast.</color>",
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
                    smashing: 0.22499999999999998,
                    lethal: 0.22499999999999998,
                    negative: 0.15,
                    toxic: 0.15
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
            icon: "darkarmor_stealth.png",
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
            name: "Murky Cloud",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You create a Murky Cloud enshrouding you. This cloud can absorb all forms of energy, making you more resistant to Fire, Cold, Energy, and Negative Energy attacks, as well as Endurance Drain effects.<br><br><color #fcfc95>Recharge: Fast.</color>",
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
                    fire: 0.22499999999999998,
                    cold: 0.22499999999999998,
                    energy: 0.15,
                    negative: 0.15
                },
                debuffResistance: {
                    recovery: 0.692,
                    endurance: 0.692
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Shadow Dweller",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets", "Healing"],
            description: "You are a true Shadow Dweller of the Netherworld. Your affinity for the shadows grants you an inherent bonus to all Defense, as well as an increased regeneration, Perception and a resistance to Immobilization. Your Perception bonus and resistance to Immobilization improves over level. Shadow Dweller is an Auto power. It is always on and costs no Endurance.",
            shortHelp: "Auto: Self +Regen, +DEF(All), +Res(Immobilize), +Perception",
            icon: "darkarmor_selfbuffdefense.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                protection: {
                    immobilize: 4.0
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Obsidian Shield",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You can create a special Obsidian Shield that grants good resistance to Psionic damage. With your mind enshrouded in darkness you are protected from Sleep, Fear, Hold and Disorient attacks.<br><br><color #fcfc95>Recharge: Fast.</color>",
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
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    fear: 10.379999999999999
                },
                resistance: {
                    psionic: 0.375
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
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Healing", "Melee AoE Damage", "Universal Damage Sets"],
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
            available: 19,
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
                    tohit: 0.25949999999999995,
                    regeneration: 0.25949999999999995
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
            description: "The Netherworld has many mutable properties, such as the Oppressive Gloom. This power allows you to use your own Hit Points to keep enemies near you Disoriented and unable to use any powers. Endurance cost for this is minimal, but the power can be dangerous to use.<br><br><color #fcfc95>Recharge: Moderate.</color>",
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
    POWERSETS['stalker/dark-armor'] = STALKER_DARK_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_DARK_ARMOR_POWERSET = STALKER_DARK_ARMOR_POWERSET;
}