/**
 * Electrical Melee
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_ELECTRICAL_MELEE_POWERSET = {
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
            allowedSetCategories: ["Endurance Modification", "Melee Damage", "Sleep", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "Your fists become electrically charged and deliver a powerful punch. Charged Brawl can drain some Endurance from the target and may overload their synapses, leaving them writhing for a moment. A portion of drained Endurance may be returned to you. Disturbing an overloaded target will disperse the electrical charge and release him.",
            shortHelp: "Melee, DMG(Smash/Energy), Target Sleep, -End",
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
            allowedSetCategories: ["Endurance Modification", "Melee Damage", "Sleep", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with a greater damage. Havoc Punch can drain some Endurance from your target and may overload their synapses, leaving them writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release him.",
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
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee AoE Damage", "Sleep", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You are able to generate a strong current between your arms and snap a powerful bolt of electricity in an arc in front of you. This melee attack can electrocute all foes within the arc dealing High energy damage. Jacobs Ladder can drain some Endurance from your target and may overload their synapses, leaving them writhing for a moment. Disturbing an overloaded target will disperse the electrical charge and release him.",
            shortHelp: "Melee (Cone), DMG(Energy), Foe Sleep, -End",
            icon: "electricmelee_conemoderatedmg.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 0.8727,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Energy",
                    scale: 3.0986000000000002
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Assassin's Shock",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "A signature Stalker attack. This attack does superior energy and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
            shortHelp: "Melee, DMG(Energy)",
            icon: "electricmelee_assassinstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 7.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 3.0
            }
        },
        {
            name: "Build Up",
            available: 7,
            tier: 3,
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
            name: "Placate",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Range", "Recharge"],
            allowedSetCategories: ["Threat Duration"],
            description: "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Strike. However, if you attack a Placated Foe, he will be able to attack you back.",
            shortHelp: "Ranged, Foe Placate, Self Stealth/Hide",
            icon: "electricmelee_placate.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                cast: 0.8,
                buffDuration: 10.0
            }
        },
        {
            name: "Chain Induction",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Melee Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "This Electric Melee attack deals moderate Smashing and Energy damage and may drain some of the targets Endurance. However, this attack also induces an unstable electric charge that may jump to another enemy target. The charge will jump to the closest enemy in range that has not been previously hit, until it inevitably dissipates. Enhancements will boost the effectiveness of the initial attack as well as the jumping charge.",
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
            name: "Thunder Strike",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave as well as have some endurance drained.",
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
            name: "Lightning Rod",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can polarize your body and become a living Lightning Rod. This power calls forth a massive lightning bolt from the sky to strike you. You can then ride this bolt and instantly Teleport a short distance. You rematerialize in a massive bolt of electricity, dealing massive damage and knocking down all nearby foes. Damage from the lightning bolt is superior.",
            shortHelp: "PBAoE, Foe Knockback; Self Teleport;",
            icon: "electricmelee_pbaoeteleport.png",
            powerType: "Click",
            targetType: "Location (Teleport)",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 90.0,
                endurance: 13.52,
                cast: 2.57,
                buffDuration: 4.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/electrical-melee'] = STALKER_ELECTRICAL_MELEE_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_ELECTRICAL_MELEE_POWERSET = STALKER_ELECTRICAL_MELEE_POWERSET;
}