/**
 * Tactical Arrow
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_TACTICAL_ARROW_POWERSET = {
    name: "Tactical Arrow",
    category: "Unknown",
    description: "Tactical Arrow powerset",
    icon: "tactical-arrow_set.png",
    powers: [
        {
            name: "Electrified Net Arrow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Upon impact, the Electrified Net Arrow releases an electrically charged net that can Immobilize most targets. This device deals electric damage over time but does not prevent targets from attacking. The Electrified Net Arrow can bring down flying entities, halts jumping and slows all of their actions.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DoT(Energy), Foe Immobilize, -Fly, -Recharge, -SPD, -Jump",
            icon: "tacticalarrow_immobilize.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.0,
                dotDamage: {
                    type: "Energy",
                    scale: 0.452,
                    ticks: 4
                },
                buffDuration: 0.75
            }
        },
        {
            name: "Glue Arrow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "This arrow carries a cartridge of intensely sticky glue, which explodes on impact. The glue slows the movement and attack rates of any foes in the area.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), DoT(Toxic), Foe -SPD, -Recharge, -Fly, -Jump",
            icon: "tacticalarrow_slow.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 45.0,
                endurance: 7.8,
                cast: 1.16
            }
        },
        {
            name: "Ice Arrow",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Holds", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "This arrow can freeze a single foe in a block of ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be Held, but all affected targets will be Slowed.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, DoT(Cold), Foe Hold, -SPD, -Recharge",
            icon: "tacticalarrow_hold.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 16.0,
                endurance: 11.388,
                cast: 1.67,
                dotDamage: {
                    type: "Cold",
                    scale: 0.05,
                    ticks: 8
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Upshot",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit and recharge time of all your powers for 10 seconds.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +ToHit, +Recharge",
            icon: "tacticalarrow_buildup.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 5.2,
                cast: 1.17,
                tohitBuff: 1.5,
                buffDuration: 10.0
            }
        },
        {
            name: "Flash Arrow",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "To Hit Debuff"],
            description: "This arrow explodes in a dazzling flash of light and sound. The targets are so blinded that they can hardly see a thing. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe -Perception, -ToHit",
            icon: "tacticalarrow_blind.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 7.8,
                cast: 1.0,
                buffDuration: 60.0,
                tohitDebuff: 0.7
            }
        },
        {
            name: "Eagle Eye",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You have developed an incredible eyesight. Your accuracy is dramatically improved and your perception increased allowing you to better see distant and stealthy foes. You have also become resistant to powers that debuff your accuracy or chance to hit. In addition to being more accurate, your training also allows you to regenerate health and recovery endurance at an accelerated rate while this power is active. However, only half of this regeneration bonus is enhanceable.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +ACC, +Perception, +Res(DeBuff ToHit), +Regeneration, +Recovery",
            icon: "tacticalarrow_eagleeye.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 1.17,
                tohitBuff: 2.0,
                buffDuration: 0.75
            }
        },
        {
            name: "Gymnastics",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Leaping", "Leaping & Sprints", "Running", "Running & Sprints", "Universal Travel"],
            description: "Years of training have made you extremely agile and quick on your feet. This power slightly increases your defense, attack rate and movement speed, in addition of protecting you from knockback.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +Recharge, +DEF(All), +SPD, +Res(Slow, Knockback)",
            icon: "tacticalarrow_quickness.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.13,
                debuffResistance: {
                    recharge: 0.4,
                    movement: 0.4
                },
                buffDuration: 0.5
            }
        },
        {
            name: "ESD Arrow",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Holds", "Stuns"],
            description: "This arrow can unleash a massive electrostatic discharge on impact. This ESD can affect machines, and is even powerful enough to affect synaptic brain patterns. It will stun all foes in its radius. Additionally, most machines and robots will be held and take moderate high damage.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Disorient, -End, Special vs. Robots",
            icon: "tacticalarrow_stun.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 20.18,
                cast: 1.83,
                damage: {
                    type: "Energy",
                    scale: 1.64
                },
                stun: 3.0
            }
        },
        {
            name: "Oil Slick Arrow",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "On impact, this arrow creates an oil slick that Slows foes in the area and may cause them to slip and fall. The oil slick is very flammable and may burst into flames if fire is used near it.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Location AoE), Foe Knockdown, -SPD, -Jump, +Special",
            icon: "tacticalarrow_knockdown.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.16,
                buffDuration: 30.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/tactical-arrow'] = BLASTER_TACTICAL_ARROW_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_TACTICAL_ARROW_POWERSET = BLASTER_TACTICAL_ARROW_POWERSET;
}