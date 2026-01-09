/**
 * Battle Axe
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_BATTLE_AXE_POWERSET = {
    name: "Battle Axe",
    category: "Unknown",
    description: "Battle Axe powerset",
    icon: "battle-axe_set.png",
    powers: [
        {
            name: "Beheader",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "This is an attempt to remove your opponent's head from his neck with your Battle Axe. This attack is fairly quick for such a large weapon, and has a chance to cut through your foe's defense and knock them down.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockdown, -Defense",
            icon: "battleaxe_chop.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.15,
                range: 7.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Lethal",
                    scale: 2.26
                }
            }
        },
        {
            name: "Chop",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "Chop deals heavy damage with your Battle Axe, although it is much slower than Gash. This attack has a chance to cut through your target's defense and knock them down.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockdown, -Defense",
            icon: "battleaxe_gash.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.15,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.2,
                damage: {
                    type: "Lethal",
                    scale: 3.2
                }
            }
        },
        {
            name: "Gash",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "Gashes your opponent with your Battle Axe dealing superior damage. This attack is very slow, but can deal a lot damage and knock the target down.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockdown",
            icon: "battleaxe_beheader.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.27,
                damage: {
                    type: "Lethal",
                    scale: 3.6489000000000003
                }
            }
        },
        {
            name: "Taunt",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Threat Duration"],
            description: "Taunts a foe, and some nearby foes, to attack you. Useful for pulling villains off an ally who find themselves in over their head. Taunted foes tend to ignore other Heroes and focus on you for quite a while, so use this power cautiously. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
            shortHelp: "Ranged (Targeted AoE), Foe Taunt",
            icon: "battleaxe_taunt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 10.0,
                cast: 1.67,
                buffDuration: 20.0
            }
        },
        {
            name: "Build Up",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "battleaxe_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Pendulum",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "This attack swings your Battle Axe directly in front of you. Foes struck by this attack are dealt heavy damage, and may be knocked down.",
            shortHelp: "Melee (Targeted AoE), DMG(Lethal), Foe Knockdown",
            icon: "battleaxe_taoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.0,
                damage: {
                    type: "Lethal",
                    scale: 2.5170000000000003
                }
            }
        },
        {
            name: "Swoop",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "A Swoop of your Battle Axe deals a superior amount of damage, and can send your target flying upwards.",
            shortHelp: "Melee, DMG(Lethal), Foe Knockup",
            icon: "battleaxe_swoop.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.05,
                range: 7.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.37,
                damage: {
                    type: "Lethal",
                    scale: 4.1189
                }
            }
        },
        {
            name: "Axe Cyclone",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You spin your Battle Axe in a huge circle, attacking all nearby foes. This attack deals moderate damage to any foe it hits, draws them into melee range and can knock them down.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "PBAoE Melee, DMG(Lethal), Foe Knockdown",
            icon: "battleaxe_whirlingaxe.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.05,
                recharge: 18.0,
                endurance: 16.848,
                cast: 2.1,
                buffDuration: 0.15
            }
        },
        {
            name: "Cleave",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "This is an attempt to split your opponent in two with one fell swoop of your Battle Axe. It is an extremely devastating attack that deals massive damage and can knock foes to the ground. The power of this attack can actually extend a short distance through multiple foes.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>5</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "Ranged, DMG(Lethal), Foe Knockdown",
            icon: "battleaxe_cleaveplayer.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.05,
                range: 40.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.33,
                damage: {
                    type: "Lethal",
                    scale: 4.5746
                }
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/battle-axe'] = TANKER_BATTLE_AXE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_BATTLE_AXE_POWERSET = TANKER_BATTLE_AXE_POWERSET;
}