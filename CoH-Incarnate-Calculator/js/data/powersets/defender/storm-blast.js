/**
 * Storm Blast
 * Character Level: 50
 * Archetype: defender
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DEFENDER_STORM_BLAST_POWERSET = {
    name: "Storm Blast",
    category: "Unknown",
    description: "Storm Blast powerset",
    icon: "storm-blast_set.png",
    powers: [
        {
            name: "Gust",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "You create a chaotic change in atmospheric pressure, causing a sudden gust of wind to deliver a small amount of Smashing damage and knock your foe out of the sky. <br><br>While in a <color #fcfc95>Storm Cell</color>, targets experience additional Smashing damage over time.",
            shortHelp: "Ranged, DMG(Smash), -Fly",
            icon: "stormblast_gust.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.17,
                damage: {
                    type: "Smashing",
                    scale: 2.379
                },
                buffDuration: 4.0
            }
        },
        {
            name: "Hailstones",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You cause the air around the foe to rapidly condense, causing hailstones to crash down, dealing Cold damage. There is a chance that an especially large chunk of hail will form, knocking the target down. <br><br>While in a <color #fcfc95>Storm Cell</color>, targets are much more likely to get knocked down by large chunks of hail.",
            shortHelp: "Ranged, DMG(Cold), Chance for Knockdown",
            icon: "stormblast_hailstones.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Cold",
                    scale: 2.529
                },
                dotDamage: {
                    type: "Cold",
                    scale: 0.25,
                    ticks: 3
                },
                buffDuration: 1.0
            }
        },
        {
            name: "Jet Stream",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You call forth a cone of rapidly moving air that repels enemies, causing Smashing damage. <br><br>Enemies who are within a <color #fcfc95>Storm Cell</color> will not be repelled, but instead will be knocked down.",
            shortHelp: "Ranged (Cone), DMG(Smashing), Foe Knockdown or Repel",
            icon: "stormblast_jetstream.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                damage: {
                    type: "Smashing",
                    scale: 1.6037
                }
            }
        },
        {
            name: "Storm Cell",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Endurance Modification", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "You conjure a storm in the area that defines the boundaries of your stormy powers. Rain from this power will slightly lower a foe's movement and chance to hit. The use of your Storm Blast attacks may create high winds and lightning within the storm cell, delivering stronger debuffs and causing damage. Additionally, Storm Blast attacks will be enhanced when used against foes victimized by Storm Cell.",
            shortHelp: "Ranged (Location AoE), Foe -Recharge, -SPD, +Wet, Special",
            icon: "stormblast_stormcell.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 15.6,
                cast: 2.03,
                buffDuration: 60.0
            }
        },
        {
            name: "Intensify",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks, and slightly increases damage for a few seconds. Moderately increases the chance for Storm Blast powers to summon high winds and lightning from your Storm Cell and Category Five while active.",
            shortHelp: "Self +To Hit, +DMG, Special",
            icon: "stormblast_aim.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 5.0,
                buffDuration: 10.0
            }
        },
        {
            name: "Direct Strike",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Endurance Modification", "Ranged Damage", "Sniper Attacks", "Universal Damage Sets"],
            description: "You channel your storm powers into a direct hit, jolting the enemy with a bolt of lightning that deals Energy damage and saps some endurance. If fired outside of combat, it can be interrupted by enemies, but will do bonus damage. If you are engaged in battle, this attack becomes instant-cast. <br><br>While in a <color #fcfc95>Storm Cell</color>, targets have a chance to be stunned. The odds of creating High Winds and Lightning are much greater when Direct Strike is cast out of combat.",
            shortHelp: "Sniper, DMG(Energy), Foe -End, Special",
            icon: "stormblast_directstrike.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 150.0,
                recharge: 12.0,
                endurance: 14.352,
                cast: 1.33
            }
        },
        {
            name: "Chain Lightning",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Endurance Modification", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Calls a bolt of lightning from the clouds to strike your target, which then chains outward to additional enemies. Creatures unfortunate enough to be struck will be dealt Energy damage and be sapped of some endurance.<br><br>While in a <color #fcfc95>Storm Cell</color>, the main target of Chain Lightning will experience additional endurance drain over time.",
            shortHelp: "Ranged Chain, DoT(Energy), Foe -End",
            icon: "stormblast_chainlightning.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Chain",
            maxTargets: 16,
            effects: {
                accuracy: 1.15,
                range: 80.0,
                recharge: 16.0,
                endurance: 15.18,
                cast: 1.17,
                damage: {
                    type: "Energy",
                    scale: 1.324
                },
                dotDamage: {
                    type: "Energy",
                    scale: 0.08,
                    ticks: 3
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Cloudburst",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Ranged Damage", "Universal Damage Sets"],
            description: "Unleashes a cloud that drops a torrent of freezing rain on your target, causing Cold damage. <br><br>While in a <color #fcfc95>Storm Cell</color>, targets experience Recharge, ToHit, and Movement speed debuffs.",
            shortHelp: "Ranged, DoT(Cold), +Wet, Special",
            icon: "stormblast_cloudburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.67,
                dotDamage: {
                    type: "Cold",
                    scale: 0.4285,
                    ticks: 9
                },
                buffDuration: 2.9
            }
        },
        {
            name: "Category Five",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Defender Archetype Sets", "Knockback", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "Summons a severe storm that begins light, but grows in power until it becomes a raging engine of destruction. Left on its own, the Category Five storm is capable of delivering moderate damage. As it grows in power, foes may begin to fling through the air. <br><br>In addition, each use of your Storm Blast powers is capable of delivering lightning attacks within the Category Five storm, delivering energy damage.",
            shortHelp: "Ranged (Location AoE), DoT(Energy), +Wet",
            icon: "stormblast_categoryfive.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 2.0,
                range: 60.0,
                recharge: 170.0,
                endurance: 27.716,
                cast: 2.5,
                buffDuration: 30.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['defender/storm-blast'] = DEFENDER_STORM_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DEFENDER_STORM_BLAST_POWERSET = DEFENDER_STORM_BLAST_POWERSET;
}