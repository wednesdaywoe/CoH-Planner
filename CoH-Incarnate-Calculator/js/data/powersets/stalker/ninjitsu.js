/**
 * Ninjitsu
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_NINJITSU_POWERSET = {
    name: "Ninjitsu",
    category: "Unknown",
    description: "Ninjitsu powerset",
    icon: "ninjitsu_set.png",
    powers: [
        {
            name: "Hide",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Hide makes you almost impossible to detect. When properly 'Hidden\", a Stalker can pull off Critical hits with his attacks, and even land a massive 'Assassin's Strike' with an Assassin's power. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense. Unlike most stealth powers, Hide can be used at the same time as other Concealment powers, giving you even greater stealth capability. No Endurance cost.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
            icon: "ninjitsu_hide.png",
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
            name: "Ninja Reflexes",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Activating your Ninja Reflexes enables you to be more evasive to melee attacks. This will increase your Defense versus melee as long as it is active. Ninja Reflexes also grants you resistance to Defense DeBuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Melee), Res(DeBuff DEF)",
            icon: "ninjitsu_ninjareflexes.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.13,
                cast: 1.53,
                debuffResistance: {
                    defense: 0.173
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Danger Sense",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You become more evasive against ranged and area attacks while you have Danger Sense activated. This will increase your Defense versus ranged and Area of Effect attacks as long as it is active. Your Danger Sense also allow you to perceive stealthy foes and resist Defense DeBuffs.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Self +DEF(Ranged, AoE), +Perception, Res(DeBuff DEF)",
            icon: "ninjitsu_dangersense.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.182,
                cast: 0.83,
                debuffResistance: {
                    defense: 0.173
                },
                buffDuration: 0.75,
                defenseBuff: 0.5
            }
        },
        {
            name: "Caltrops",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any enemy that passes over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed",
            icon: "ninjitsu_caltrops.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 25.0,
                recharge: 45.0,
                endurance: 7.8,
                cast: 1.07,
                buffDuration: 45.0
            }
        },
        {
            name: "Kuji-In Rin",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Leaping", "Leaping & Sprints", "Resist Damage", "Running", "Running & Sprints", "Universal Travel"],
            description: "Kuji-In Rin is the strength of mind and body. By focusing your power on this exercise, you gain a resistance to Disorient, Hold, Sleep, Immobilization, Confusion, and fear, as well as resistance to Psionic damage for a few minutes. Your running speed and jumping height are also increased.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +SPD, +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Psionics)",
            icon: "ninjitsu_kujinrin.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 200.0,
                endurance: 10.4,
                cast: 1.83,
                dotDamage: {
                    type: "Psionic",
                    scale: 3.0,
                    ticks: 60
                },
                protection: {
                    hold: 10.379999999999999,
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999,
                    immobilize: 10.379999999999999,
                    fear: 10.379999999999999,
                    confuse: 10.379999999999999
                },
                resistance: {
                    psionic: 0.22499999999999998
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
                defenseBuff: 0.3
            }
        },
        {
            name: "Kuji-In Sha",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing", "Resist Damage"],
            description: "Kuji-In Sha invokes the power of Sha, or healing. Focusing your inner power, you can heal your body of its wounds and leave yourself resistant to the effects of Toxic damage for a while.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Self Heal, Res(Toxic)",
            icon: "ninjitsu_kujinsha.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
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
                    scale: 301.18975,
                    perTarget: true
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Smoke Flash",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "You throw a smoke bomb at your feet. The resulting flash of light and smoke can briefly distract your foes and Placate them so they can no longer find or target you. Combined with Hide, Smoke Flash is the perfect distraction to get out of a bad situation.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE, Foe Placate",
            icon: "ninjitsu_smokeflash.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                recharge: 120.0,
                endurance: 2.6,
                cast: 1.83
            }
        },
        {
            name: "Blinding Powder",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Confuse", "To Hit Debuff"],
            description: "You throw a handful of Blinding powder in a wide arc at your foes. Most foes will be blinded, and unable to see. Some affected targets may be overcome by the powder that they may start attacking their own allies. If you attack the blinded foes, they will be alerted to your presence, but will continue to suffer a penalty to their chance to hit.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Cone), Foe -To Hit, Sleep, Confuse, -Perception",
            icon: "ninjitsu_blindingpowder.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.7854,
            effects: {
                accuracy: 1.0,
                range: 25.0,
                recharge: 120.0,
                endurance: 7.8,
                cast: 1.07,
                buffDuration: 20.0,
                tohitDebuff: 1.0
            }
        },
        {
            name: "Kuji-In Retsu",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Running", "Running & Sprints", "Universal Travel"],
            description: "Kuji-In Retsu is the mastery of space and time. Focusing your power on Retsu enables you to control your own time to easily defeat your foes. Mastery of this power enables you to avoid almost any attack, be it ranged, melee, or area effect. Your running speed, jumping height and Endurance Recovery are also increased. Retsu also grants you high resistance to Defense DeBuffs. When Retsu wears off, you are left drained of all Endurance and unable to recover Endurance for a while.<br><br><color #fcfc95>Recharge: Extremely Long.</color>",
            shortHelp: "Self +DEF, +SPD, +Recovery, Res(DeBuff DEF), +Special",
            icon: "ninjitsu_kujinzen.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 1000.0,
                endurance: 2.6,
                cast: 1.83,
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
    POWERSETS['stalker/ninjitsu'] = STALKER_NINJITSU_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_NINJITSU_POWERSET = STALKER_NINJITSU_POWERSET;
}