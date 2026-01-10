/**
 * Ice Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_ICE_BLAST_POWERSET = {
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
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage.",
            shortHelp: "Ranged, DMG(Cold), Foe -Recharge, -SPD",
            icon: "iceblast_iceblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.67,
                damage: {
                    type: "Cold",
                    scale: 3.129
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
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "Ice Bolt quickly pelts an enemy with small icy daggers; their chill Slows a foe's attacks and movement for a time. Fast, but little damage.",
            shortHelp: "Ranged, DMG(Cold), Foe -Recharge, -SPD",
            icon: "iceblast_bolt.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 3.0,
                endurance: 4.368,
                cast: 1.0,
                damage: {
                    type: "Cold",
                    scale: 2.06
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
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "Unleashes a cone of frosty breath that can Slow your opponents' movement and attacks. Very accurate and very deadly at medium range.",
            shortHelp: "Close (Cone), DoT(Cold), Foe -Recharge, -SPD",
            icon: "iceblast_frostbreath.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.5236,
            effects: {
                accuracy: 1.2,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.67,
                dotDamage: {
                    type: "Cold",
                    scale: 2.8278999999999996,
                    ticks: 1
                },
                buffDuration: 0.6
            }
        },
        {
            name: "Chilling Ray",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Sleep", "Slow Movement", "Universal Damage Sets"],
            description: "Chilling Ray encases your foe in a frail block of ice, holding them helpless in place for a while. The block of ice will break if attacked.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
            shortHelp: "Ranged, DMG(Cold), Foe Sleep",
            icon: "iceblast_freezeray.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                damage: {
                    type: "Cold",
                    scale: 1.889
                },
                buffDuration: 6.0
            }
        },
        {
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and range.",
            shortHelp: "Self +To Hit, +DMG, +Range",
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
            name: "Ice Storm",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Sentinel Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "Shred your foes with this Ice Storm. This power deals a lot of damage in a large area and can Slow all affected targets movement and attack speed.",
            shortHelp: "Ranged (Location AoE), Minor DoT(Cold, Lethal), Foe -Recharge, -SPD",
            icon: "iceblast_freezingrain.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 2.0,
                range: 40.0,
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Slow Movement", "To Hit Debuff", "Universal Damage Sets"],
            description: "A slower yet more powerful version of Ice Blast, Bitter Ice Blast deals much more damage and can also reduce your enemy's chance to hit. Like other Ice Blast powers, Bitter Ice Blast can Slow a target's movement and attack speed.",
            shortHelp: "Ranged, High DMG(Cold), Foe -Recharge, -SPD, -To Hit",
            icon: "iceblast_bitterfrostblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
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
            allowedSetCategories: ["Holds", "Ranged Damage", "Sentinel Archetype Sets", "Slow Movement", "Universal Damage Sets"],
            description: "This power can Hold your opponent frozen solid in a block of ice. The victim can be attacked and will remain frozen and helpless. After the ice thaws, the victim emerges chilled and Slowed.",
            shortHelp: "Ranged, Superior DMG(Cold), Foe Hold",
            icon: "iceblast_bitterfreezeray.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 2.5,
                damage: {
                    type: "Cold",
                    scale: 5.71
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged AoE Damage", "Sentinel Archetype Sets", "Slow Movement", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can conjure a Blizzard that inflicts Extreme Cold and Lethal damage over time and can Slow the attack rate of all your opponents in a large area, reducing their chance to hit and possibly knocking them back.",
            shortHelp: "Ranged (Location AoE), Extreme DoT(Cold), Foe -To Hit, -SPD, -Recharge, Knockback",
            icon: "iceblast_blizzard.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 2.0,
                range: 40.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.03,
                buffDuration: 8.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/ice-blast'] = SENTINEL_ICE_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_ICE_BLAST_POWERSET = SENTINEL_ICE_BLAST_POWERSET;
}