/**
 * Dark Blast
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_DARK_BLAST_POWERSET = {
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's chance to hit.",
            shortHelp: "Ranged, DMG(Negative), Foe -To Hit",
            icon: "darkcast_darkblast.png",
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
                    type: "Negative",
                    scale: 2.2602
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "Gloom slowly drains a target of life, while reducing their chance to hit. Slower than Dark Blast, but deals more damage over time.",
            shortHelp: "Ranged, DoT(Negative), Foe -To Hit",
            icon: "darkcast_souldrain.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.1,
                dotDamage: {
                    type: "Negative",
                    scale: 0.4063,
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Knockback", "Ranged AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You summon a wave of mire that sweeps away foes within its arc. This attack deals moderate Negative Energy damage to foes, reduces their chance to hit and sends them flying.",
            shortHelp: "Ranged (Cone), DMG(Negative), Foe -To Hit, Knockback",
            icon: "darkcast_torrent.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 14.352,
                cast: 1.03,
                damage: {
                    type: "Negative",
                    scale: 1.4784
                },
                tohitDebuff: 0.75,
                buffDuration: 10.0
            }
        },
        {
            name: "Aim",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.",
            shortHelp: "Self +To-hit, +DMG",
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
            name: "Moonbeam",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["InterruptReduction", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Ranged Damage", "Sniper Attacks", "To Hit Debuff", "Universal Damage Sets"],
            description: "An extremely long range and accurate beam of Negative Energy that deals tremendous damage and reduces the target's chance to hit. This is a sniper attack, and like most sniper attacks, is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
            shortHelp: "Sniper, DMG(Negative), Target -To Hit, Self +Range",
            icon: "darkcast_moonbeam.png",
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
            name: "Tenebrous Tentacles",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Immobilize", "Ranged AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can create a cone shaped rift to the Netherworld that allows its native creatures to slip their oily Tentacles into our reality. These creatures will snare all foes within range, Immobilizing them while the Tentacles drain their life and reduce their chance to hit.",
            shortHelp: "Ranged (Cone), DMG(Negative), Foe Immobilize, -To Hit",
            icon: "darkcast_tenebroustentacles.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 10,
            arc: 0.6981,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.67,
                damage: {
                    type: "Negative",
                    scale: 1.2743
                },
                dotDamage: {
                    type: "Negative",
                    scale: 0.3104,
                    ticks: 7
                },
                buffDuration: 7.1,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Abyssal Gaze",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Holds", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You gaze into your foe's eyes giving them a glimpse into the terrifying netherworld rendering them held, reducing their chance to hit and dealing High Negative Energy damage over the next couple of seconds.",
            shortHelp: "Ranged, DoT(Negative), Foe Hold, -To Hit",
            icon: "darkcast_abyssalgaze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 1.67,
                dotDamage: {
                    type: "Negative",
                    scale: 1.3767,
                    ticks: 2
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
            allowedSetCategories: ["Accurate Healing", "Accurate To-Hit Debuff", "Blaster Archetype Sets", "Healing", "Ranged Damage", "To Hit Debuff", "Universal Damage Sets"],
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
                    scale: 3.7112999999999996
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
            allowedSetCategories: ["Accurate To-Hit Debuff", "Blaster Archetype Sets", "Melee AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can unleash a devastating blast of Negative Energy around yourself, dealing massive Negative Energy and Smashing damage and severely reducing affected foes' chance to hit.",
            shortHelp: "PBAoE, DMG(Negative), Foe -To Hit",
            icon: "darkcast_blackstar.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.4,
                recharge: 145.0,
                endurance: 27.7316,
                cast: 3.0,
                damage: {
                    type: "Negative",
                    scale: 5.4065
                },
                tohitDebuff: 5.0,
                buffDuration: 20.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/dark-blast'] = BLASTER_DARK_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_DARK_BLAST_POWERSET = BLASTER_DARK_BLAST_POWERSET;
}