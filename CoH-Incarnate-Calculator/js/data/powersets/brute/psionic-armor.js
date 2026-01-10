/**
 * Psionic Armor
 * Character Level: 50
 * Archetype: brute
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BRUTE_PSIONIC_ARMOR_POWERSET = {
    name: "Psionic Armor",
    category: "Unknown",
    description: "Psionic Armor powerset",
    icon: "psionic-armor_set.png",
    powers: [
        {
            name: "Psionic Shield",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "This power generates a psionic shield that dampens most energy and elemental damage types while also reducing the effect of endurance drain effects.",
            shortHelp: "Toggle: Self +Res(Fire, Cold, Energy, Negative, Toxic, End Drain)",
            icon: "psionicarmor_psionicshield.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.104,
                cast: 1.17
            }
        },
        {
            name: "Psychic Wall",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "You focus to create a psychic wall that dampens the smashing, lethal and psionic damage.",
            shortHelp: "Toggle: Self +Res(Smash, Lethal, Psionic)",
            icon: "psionicarmor_psychicwall.png",
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
                    psionic: 0.22499999999999998,
                    lethal: 0.15
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Impenetrable Mind",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "When you toggle on this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusion, Knockback and Hold effects. Impenetrable Mind also grants moderate resistance to Psionic based attacks.",
            shortHelp: "Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Knockback)",
            icon: "psionicarmor_impenetrablemind.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 0.104,
                cast: 0.73
            }
        },
        {
            name: "Consume Psyche",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing", "Threat Duration"],
            description: "You Consume the Psyche of nearby foes, thus weakening their Hit Point Regeneration and Endurance Recovery and boosting your own. Hitting any foe with this power will refresh all existing stacks you currently have.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>5</color> seconds and each affected foe will increase the recharge by <color #FF7F27>5.5</color> seconds for a maximum total of <color #FF7F27>60</color> seconds.</color>",
            shortHelp: "PBAoE Foe -Regen, -Heal, -Recovery; Self +Regen, +Recovery",
            icon: "psionicarmor_consumepsyche.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 10.5,
                cast: 1.33
            }
        },
        {
            name: "Impose Presence",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Threat Duration", "To Hit Buff"],
            description: "Impose your presence on nearby enemies, slowing their attack rate down and increasing your defense and chance to hit.",
            shortHelp: "Toggle: Self +DEF(Melee, Ranged), +To Hit, Foe -Recharge",
            icon: "psionicarmor_imposepresence.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.208,
                cast: 0.73,
                tohitBuff: 0.2,
                buffDuration: 1.0
            }
        },
        {
            name: "Psychokinetic Barrier",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can erect a temporary wall of crystalized psionic energy that will absorb a large amount of damage before breaking off. Psychokinetic Barrier will grant a moderate amount of absorption and reduce the effect debuffs have on you.",
            shortHelp: "Self, +Absorb, +MaxHP, +Regeneration, +Res(-Regeneration, -Recovery, -Recharge, -Endurance)",
            icon: "psionicarmor_psychokineticbarrier.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 10.4,
                cast: 1.17,
                debuffResistance: {
                    recharge: 0.2,
                    regeneration: 0.2,
                    recovery: 0.2,
                    endurance: 0.2
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Precognition",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Defense Sets"],
            description: "Precognition allows you to read your enemies' minds, letting you see their attacks before they happen and increasing your perception. This power is always on and costs no Endurance.",
            shortHelp: "Auto: Self +DEF(Melee, Ranged, AoE, Psionic), Res(DeBuff DEF), +Perception",
            icon: "psionicarmor_precognition.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    defense: 0.07999519999999999
                },
                buffDuration: 10.25,
                defenseBuff: 0.2312
            }
        },
        {
            name: "Aura of Insanity",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Sleep", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Confuse", "Fear", "Holds", "Melee AoE Damage", "Sleep", "Stuns", "Threat Duration", "Universal Damage Sets"],
            description: "You emit a powerful psychic aura that causes the minds of those around you to become weak and distracted. Foes may be stunned, held, terrified or even confused in your presence, in addition to suffering a debuff derived from the applied control effect. Those that resist these effects will suffer damage over time. This power allows you to use your own Hit Points to keep enemies near you disabled. The power costs no endurance but can be dangerous to use.<br><br><color #fcfc95>Notes: Mez enhancements on this power enhance its magnitude instead of its duration.</color>",
            shortHelp: "Toggle: PBAoE, Foe Confuse, Disorient, Sleep, Hold, Fear, DoT(Psionic), +Special",
            icon: "psionicarmor_worldofconfusion.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                recharge: 10.0,
                cast: 1.67
            }
        },
        {
            name: "Memento Mori",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Fear"],
            allowedSetCategories: ["Endurance Modification", "Fear", "Healing"],
            description: "Terrify your foes projecting images of their own impending demise into their minds. Memento Mori inflicts fear on targets while healing you even if you have been defeated. Each affected foe will increase your maximum hit points and heal you. Using this power while conscious will give you one opportunity to get back up should you be defeated while its effects are active.<br><br><color #fcfc95>Notes: This power recharges in <color #FF7F27>10</color> seconds if no foes are hit. Otherwise, it recharges in <color #FF7F27>300</color> seconds.</color>",
            shortHelp: "Self Rez, +Max HP, Special",
            icon: "psionicarmor_mementomori.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.2,
                recharge: 300.0,
                endurance: 10.4,
                cast: 1.33
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['brute/psionic-armor'] = BRUTE_PSIONIC_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BRUTE_PSIONIC_ARMOR_POWERSET = BRUTE_PSIONIC_ARMOR_POWERSET;
}