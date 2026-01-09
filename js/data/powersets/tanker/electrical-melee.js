/**
 * Electrical Melee
 * Character Level: 50
 * Archetype: tanker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const TANKER_ELECTRICAL_MELEE_POWERSET = {
    name: "Electrical Melee",
    category: "Unknown",
    description: "Electrical Melee powerset",
    icon: "electrical-melee_set.png",
    powers: [
        {
            name: "Charged Brawl",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee Damage", "Sleep", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "Your fists become electrically charged and deliver a powerful punch. Charged Brawl can drain some Endurance from the target and may overload their synapses, leaving them writhing for a moment. A portion of drained Endurance may be returned to you. Disturbing an overloaded target will disperse the electrical charge and release them.",
            shortHelp: "Melee, DMG(Smash/Energy), Target Sleep, -End,",
            icon: "electricmelee_targetedminordmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 0.83,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.1606
                        },
                        {
                            type: "Smashing",
                            scale: 0.7804
                        }
                    ],
                    scale: 1.941
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Havoc Punch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee Damage", "Sleep", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with a greater damage. Havoc Punch can drain some Endurance from your target and may overload their synapses, leaving him writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release him.",
            shortHelp: "Melee, DMG(Smash/Energy), Foe Sleep, -End",
            icon: "electricmelee_targetedmoderatedmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.5,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 1.814
                        },
                        {
                            type: "Smashing",
                            scale: 1.1960000000000002
                        }
                    ],
                    scale: 3.0100000000000002
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Jacobs Ladder",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee AoE Damage", "Sleep", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "You are able to generate a strong current between your arms and snap a powerful bolt of electricity in an arc in front of you. This melee attack can electrocute all foes within the arc dealing High energy damage. Jacobs Ladder can drain some Endurance from your target and may overload their synapses, leaving him writhing for a moment. Disturbing an overloaded target will disperse the electrical charge and release him.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>5</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "Melee (Cone), DMG(Energy), Foe Sleep, -End",
            icon: "electricmelee_conemoderatedmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.309,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    types: [
                        {
                            type: "Energy",
                            scale: 3.0986000000000002
                        },
                        {
                            type: "Fire",
                            scale: 0.675
                        }
                    ],
                    scale: 3.7736
                },
                buffDuration: 2.0
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
            shortHelp: "Ranged, Foe Taunt",
            icon: "electricmelee_targetedtaunt.png",
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
            name: "Thunder Strike",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stuns", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave as well as have some endurance drained.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "Melee (AoE), DMG(Energy), Foe Disorient, Knockback, -End",
            icon: "electricmelee_targetedaoeheavydmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 20.0,
                endurance: 18.512,
                cast: 2.53
            }
        },
        {
            name: "Build Up",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
            shortHelp: "Self +DMG, +To Hit",
            icon: "electricmelee_selfbuffdmg.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.20,
                damageBuff: 1.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Chain Induction",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets"],
            description: "This Electric Melee attack deals moderate Smashing and Energy damage and may drain some of the targets Endurance. However, this attack also induces an unstable electric charge that may jump to another enemy target. The charge will jump to the closest enemy in range that has not been previously hit, until it inevitably dissipates.",
            shortHelp: "Melee, DMG(Energy), Foe -End +Special",
            icon: "electricmelee_targetedchaininduction.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 14.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    type: "Energy",
                    scale: 2.98
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Lightning Clap",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Knockback", "Stuns", "Threat Duration"],
            description: "You can clap your hands together to release a violent Lightning Clap. The Lightning Clap can knock down most nearby foes, Disorienting many of them. Lightning Clap deals no damage.<br><br><color #fcfc95>Notes: Thanks to gauntlet, this power can hit up to <color #FF7F27>6</color> targets above its cap at 1/3rd effectiveness.</color>",
            shortHelp: "PBAoE, Foe Disorient, Knockback",
            icon: "electricmelee_pbaoestun.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                recharge: 30.0,
                endurance: 13.0,
                cast: 1.23,
                stun: 2.0
            }
        },
        {
            name: "Lightning Rod",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Tanker Archetype Sets", "Threat Duration", "Universal Damage Sets", "Universal Travel"],
            description: "You can polarize your body and become a living Lightning Rod. This power calls forth a massive lightning bolt from the sky to strike you. You can then ride this bolt and instantly Teleport a short distance. You rematerialize in a massive bolt of electricity, dealing massive damage and knocking down all nearby foes. Damage from the lightning bolt is superior.",
            shortHelp: "PBAoE DMG(Energy), Foe Knockback; Self Teleport;",
            icon: "electricmelee_pbaoeteleport.png",
            powerType: "Click",
            targetType: "Location (Teleport)",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 90.0,
                endurance: 13.52,
                cast: 2.57
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['tanker/electrical-melee'] = TANKER_ELECTRICAL_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.TANKER_ELECTRICAL_MELEE_POWERSET = TANKER_ELECTRICAL_MELEE_POWERSET;
}