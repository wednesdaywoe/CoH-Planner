/**
 * Super Reflexes
 * Character Level: 50
 * Archetype: scrapper
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SCRAPPER_SUPER_REFLEXES_POWERSET = {
    name: "Super Reflexes",
    category: "Unknown",
    description: "Super Reflexes powerset",
    icon: "super-reflexes_set.png",
    powers: [
        {
            name: "Focused Fighting",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You become more evasive to melee attacks while you have Focused Fighting activated. This will increase your Defense versus melee as long as it is active. Your Focus also offers you resistance to Confuse effects and DeBuffs to Defense.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Melee), Res(Confuse, DeBuff DEF)",
            icon: "superreflexes_focusedfighting.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 0.67,
                protection: {
                    confuse: 10.379999999999999
                },
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "Focused Senses",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You become more evasive against ranged attacks while you have Focused Senses activated. This will increase your Defense versus ranged attacks as long as it is active. Your Improved Senses also allow you to perceive stealthy foes as well as resist Defense DeBuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Ranged), +Perception, Res(DeBuff DEF)",
            icon: "superreflexes_focusedsenses.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 2.03,
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "Agile",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets"],
            description: "You become innately more Agile, and are able to naturally avoid some ranged attacks and resist Defense DeBuffs. Your Agility also grants you minor Damage Resistance to all damage except Toxic and Psionic. This Damage Resistance is only available as you lose Health but it improves as your HP declines. This power is always on, and will permanently increase your Defense versus ranged attacks.",
            shortHelp: "Auto: Self +DEF(Ranged), Res(DeBuff DEF), Res(DMG, Special)",
            icon: "superreflexes_agile.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                resistance: {
                    smashing: 0.0,
                    lethal: 0.0,
                    fire: 0.0,
                    cold: 0.0,
                    energy: 0.0,
                    negative: 0.0,
                    toxic: 0.0
                },
                debuffResistance: {
                    defense: 0.0692
                },
                buffDuration: 0.75,
                defenseBuff: 0.2
            }
        },
        {
            name: "Practiced Brawler",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: [],
            description: "Your training has allowed you to become a Practiced Brawler, tuning you into a perfect fighting machine. You gain a resistance to Knockback, Disorient, Hold, Sleep, and Immobilization powers for a short duration.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize)",
            icon: "superreflexes_practicedbrawler.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 200.0,
                endurance: 10.4,
                cast: 1.53,
                protection: {
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    immobilize: 10.379999999999999
                },
                debuffResistance: {
                    tohit: 0.3,
                    defense: 0.3,
                    recharge: 0.3,
                    movement: 0.5
                },
                buffDuration: 120.0,
                stun: 1.0,
                stunDuration: 120.0,
                tohitBuff: 0.3,
                defenseBuff: 0.3
            }
        },
        {
            name: "Dodge",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets"],
            description: "You have the ability to innately Dodge some melee attacks and you resist Defense DeBuffs. Dodge also grants you minor Damage Resistance to all damage except Toxic and Psionic. This Damage Resistance is only available as you lose Health but it improves as your HP declines. This power is always on, and will permanently increase your Defense versus melee attacks.",
            shortHelp: "Auto: Self +DEF(Melee), Res(DeBuff DEF), Res(DMG, Special)",
            icon: "superreflexes_dodge.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                resistance: {
                    smashing: 0.0,
                    lethal: 0.0,
                    fire: 0.0,
                    cold: 0.0,
                    energy: 0.0,
                    negative: 0.0,
                    toxic: 0.0
                },
                debuffResistance: {
                    defense: 0.0692
                },
                buffDuration: 0.75,
                defenseBuff: 0.2
            }
        },
        {
            name: "Quickness",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "Your Quick reflexes allow you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
            shortHelp: "Auto: Self +Recharge, +SPD, Res (Slow)",
            icon: "superreflexes_quickness.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    recharge: 0.4,
                    movement: 0.4
                },
                buffDuration: 10.25
            }
        },
        {
            name: "Lucky",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets"],
            description: "Your superior reflexes make you seem incredibly Lucky. Lucky improves your Defense to Area of Effect attacks and grants you resistance to Defense DeBuffs. Lucky also grants you minor Damage Resistance to all damage except Toxic and Psionic. This Damage Resistance is only available as you lose Health but it improves as your HP declines. This power is always on, and permanently increases your chance to evade area effects and cone shaped attacks.",
            shortHelp: "Auto: Self +DEF(vs. AoE), Res(DeBuff DEF), Res(DMG, Special)",
            icon: "superreflexes_lucky.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                resistance: {
                    smashing: 0.0,
                    lethal: 0.0,
                    fire: 0.0,
                    cold: 0.0,
                    energy: 0.0,
                    negative: 0.0,
                    toxic: 0.0
                },
                debuffResistance: {
                    defense: 0.0692
                },
                buffDuration: 0.75,
                defenseBuff: 0.2
            }
        },
        {
            name: "Evasion",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You are Evasive against area effect and cone shaped attacks. This power increases your Defense versus such attacks as long as it is active. Evasion also helps you resist Defense DeBuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(vs. AoE), Res(DeBuff DEF)",
            icon: "superreflexes_evasion.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 3.0,
                debuffResistance: {
                    defense: 0.1384
                },
                buffDuration: 0.75,
                defenseBuff: 0.4
            }
        },
        {
            name: "Elude",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Running", "Running & Sprints", "Universal Travel"],
            description: "You can improve your reflexes, making yourself so quick you can Elude almost any attack, be it ranged, melee, or area effect. Your running speed, jumping height, and Endurance Recovery are also increased. Elude also grants you high resistance to Defense DeBuffs. When Elude wears off, you are left drained of all Endurance and unable to recover Endurance for a while.<br><br><color #fcfc95>Recharge: Extremely Long.</color>",
            shortHelp: "Self +DEF, + SPD, +Recovery, Res(DeBuff DEF), +Special",
            icon: "superreflexes_elude.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 1000.0,
                endurance: 2.6,
                cast: 2.0,
                debuffResistance: {
                    defense: 0.346
                },
                buffDuration: 180.0,
                defenseBuff: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['scrapper/super-reflexes'] = SCRAPPER_SUPER_REFLEXES_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SCRAPPER_SUPER_REFLEXES_POWERSET = SCRAPPER_SUPER_REFLEXES_POWERSET;
}