/**
 * Dark Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_DARK_BLAST_POWERSET = {
    name: "Dark Blast",
    category: "Unknown",
    description: "Dark Blast powerset",
    icon: "dark-blast_set.png",
    powers: [
        {
            name: "Dark Blast",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's chance to hit.",
            shortHelp: "Ranged, DMG(Negative), Foe -To Hit",
            icon: "darkcast_darkblast.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                damage: {
                    type: "Negative",
                    scale: 2.26
                },
                tohitDebuff: 0.75,
                buffDuration: 6.0
            }
        },
        {
            name: "Gloom",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "Gloom slowly drains a target of life, while reducing their chance to hit. Slower than Dark Blast, but deals more damage over time.",
            shortHelp: "Ranged, DoT(Negative), Foe -To Hit",
            icon: "darkcast_souldrain.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.67,
                dotDamage: {
                    type: "Negative",
                    scale: 0.4561,
                    ticks: 7
                },
                buffDuration: 3.6,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Umbral Torrent",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You summon a wave of mire that sweeps away foes within its arc. This attack deals moderate Negative Energy damage to foes, reduces their chance to hit and sends them flying.",
            shortHelp: "Ranged (Cone), DMG(Negative), Foe -To Hit, Knockback",
            icon: "darkcast_torrent.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 1.03,
                damage: {
                    type: "Negative",
                    scale: 2.0768
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Abyssal Gaze",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Holds", "Ranged Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You gaze into your foe's eyes giving them a glimpse into the terrifying netherworld rendering them held, reducing their chance to hit and dealing High Negative Energy damage over the next couple of seconds.",
            shortHelp: "Ranged, DoT(Negative), Foe Hold, -To Hit",
            icon: "darkcast_abyssalgaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.67,
                dotDamage: {
                    type: "Negative",
                    scale: 1.3767,
                    ticks: 2
                },
                buffDuration: 2.1,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Aim",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and range.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +To Hit, +DMG, +Range",
            icon: "darkcast_aim.png",
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
            name: "Dark Obliteration",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged AoE Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You hurl a large blast of negative energy that violently explodes on impact, exposing the dark power of the Netherworld to all foes near the target. Dark Obliteration can reduce the Accuracy of all affected targets.",
            shortHelp: "Ranged (Targeted AoE), DMG(Negative), Foe -ACC",
            icon: "darkcast_darkobliteration.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.0,
                damage: {
                    type: "Negative",
                    scale: 1.4354
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Antumbral Beam",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Ranged Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "An extremely focused beam of Negative Energy that deals tremendous damage and reduces the target's chance to hit.",
            shortHelp: "Ranged, DMG(Negative), Target -To Hit",
            icon: "darkcast_heavy.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 2.07,
                damage: {
                    type: "Negative",
                    scale: 5.209
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Life Drain",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Healing", "Ranged Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can tap the power of the Netherworld to steal some life from a target foe and reduce their chance to hit. Some of that stolen life is transferred to you in the form of Hit Points.",
            shortHelp: "Ranged, DMG(Negative), Target -To Hit, Self +HP",
            icon: "darkcast_lifedrain.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.93,
                damage: {
                    type: "Negative",
                    scale: 3.7110000000000003
                },
                healing: {
                    scale: 120.4759,
                    perTarget: true
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Blackstar",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Melee AoE Damage", "Sentinel Archetype Sets", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can unleash a devastating blast of Negative Energy around yourself, dealing massive Negative Energy and Smashing damage and severely reducing affected foes' chance to hit.",
            shortHelp: "PBAoE, DMG(Negative), Foe -To Hit",
            icon: "darkcast_blackstar.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.4,
                recharge: 90.0,
                endurance: 15.6,
                cast: 3.0,
                damage: {
                    type: "Negative",
                    scale: 4.7059999999999995
                },
                tohitDebuff: 5.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/dark-blast'] = SENTINEL_DARK_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_DARK_BLAST_POWERSET = SENTINEL_DARK_BLAST_POWERSET;
}