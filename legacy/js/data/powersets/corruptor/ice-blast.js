/**
 * Ice Blast
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_ICE_BLAST_POWERSET = {
    name: "Ice Blast",
    category: "Unknown",
    description: "Ice Blast powerset",
    icon: "ice-blast_set.png",
    powers: [
        {
            name: "Ice Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage.",
            shortHelp: "Ranged, DMG(Cold), Foe -Recharge, -SPD",
            icon: "iceblast_iceblast.png",
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
                    scale: 3.529
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Ice Bolt",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Ice Bolt quickly pelts an enemy with small icy daggers; their chill Slows a foe's attacks and movement for a time. Fast, but little damage.",
            shortHelp: "Ranged, DMG(Cold), Foe -Recharge, -SPD",
            icon: "iceblast_bolt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Cold",
                    scale: 2.26
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Frost Breath",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Unleashes a cone of frosty breath that can Slow your opponents' movement and attacks. Very accurate and very deadly at medium range.",
            shortHelp: "Close (Cone), DoT(Cold), Foe -Recharge, -SPD",
            icon: "iceblast_frostbreath.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.2,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.67,
                dotDamage: {
                    type: "Cold",
                    scale: 2.8278,
                    ticks: 1
                },
                buffDuration: 0.6
            }
        },
        {
            name: "Aim",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases your chance to hit with attacks for a few seconds. Slightly increases damage.",
            shortHelp: "Self +To Hit, +DMG",
            icon: "iceblast_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 0.625,
                damageBuff: 0.425,
                buffDuration: 10.0
            }
        },
        {
            name: "Freeze Ray",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Holds", "Ranged Damage", "Universal Damage Sets"],
            description: "Freeze Ray encases your foe in a block of ice, holding him helpless in place for a while. While frozen, your foe will take Cold damage over time.",
            shortHelp: "Ranged, DMG(Cold), Foe Hold",
            icon: "iceblast_freezeray.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.0,
                dotDamage: {
                    type: "Cold",
                    scale: 0.3531,
                    ticks: 10
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Ice Storm",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Shred your foes with this Ice Storm. This power deals a lot of damage in a large area and can Slow all affected targets' movement and attack speed.",
            shortHelp: "Ranged (Location AoE), DoT(Cold, Lethal), Foe -Recharge, -SPD",
            icon: "iceblast_freezingrain.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 15.6,
                cast: 2.03,
                buffDuration: 15.0
            }
        },
        {
            name: "Bitter Ice Blast",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Corruptor Archetype Sets", "Ranged Damage", "Slow Movement", "To Hit Debuff", "Universal Damage Sets"],
            description: "A slower yet more powerful version of Ice Blast, Bitter Ice Blast deals much more damage and can also reduce your enemy's chance to hit. Like other Ice Blast powers, Bitter Ice Blast can Slow a target's movement and attack speed.",
            shortHelp: "Ranged, DMG(Cold), Foe -Recharge, -SPD, -To Hit",
            icon: "iceblast_bitterfrostblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.07,
                damage: {
                    type: "Cold",
                    scale: 3.909
                },
                tohitDebuff: 1.0,
                buffDuration: 6.0
            }
        },
        {
            name: "Bitter Freeze Ray",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Holds", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "This power can Hold your opponent frozen solid in a block of ice. The victim can be attacked and will remain frozen and helpless. After the ice thaws, the victim emerges chilled and Slowed. Bitter Freeze Ray deals medium damage.",
            shortHelp: "Ranged, DMG(Cold), Foe Hold",
            icon: "iceblast_bitterfreezeray.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.5,
                damage: {
                    type: "Cold",
                    scale: 5.5099
                },
                buffDuration: 18.0
            }
        },
        {
            name: "Blizzard",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Corruptor Archetype Sets", "Ranged AoE Damage", "Slow Movement", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can conjure a Blizzard that inflicts Extreme Cold and Lethal damage over time and can Slow the attack rate of all your opponents in a large area, reducing their chance to hit and possibly knocking them back.",
            shortHelp: "Ranged (Location AoE), DoT(Cold), Foe -To Hit, -SPD, -Recharge, Knockback",
            icon: "iceblast_blizzard.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 2.0,
                range: 60.0,
                recharge: 170.0,
                endurance: 27.7316,
                cast: 2.03,
                buffDuration: 15.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/ice-blast'] = CORRUPTOR_ICE_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_ICE_BLAST_POWERSET = CORRUPTOR_ICE_BLAST_POWERSET;
}