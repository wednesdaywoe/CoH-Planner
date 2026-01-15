/**
 * Seismic Blast
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_SEISMIC_BLAST_POWERSET = {
    name: "Seismic Blast",
    category: "Unknown",
    description: "Seismic Blast powerset",
    icon: "seismic-blast_set.png",
    powers: [
        {
            name: "Encase",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Encase a foe in stone for a short moment, dealing damage and lowering their defense. The enemy will also become heavy, limiting their ability to jump and fly for a short time. <br><br>Encase grants two stacks of Seismic Pressure.",
            shortHelp: "Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF",
            icon: "seismicblast_shatter.png",
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
                    type: "Smashing",
                    scale: 2.26
                },
                defenseDebuff: 0.5,
                buffDuration: 3.0
            }
        },
        {
            name: "Seismic Shockwaves",
            available: 0,
            tier: 1,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "While on the ground, nearby enemies might be knocked down and some of your attacks are empowered.<br><br>This power is only for short periods of times after being triggered by Seismic Pressure.",
            shortHelp: "Foe Knock Down, Self Special",
            icon: "seismic_power.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 1,
            effects: {
                accuracy: 0.8
            }
        },
        {
            name: "Shatter",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Cover a foe in stone shards and shatter them, inflicting light damage and lowering their defense. They will also become heavy, limiting their ability to jump and fly for a short time. <br><br>Shatter grants two stacks of Seismic Pressure.",
            shortHelp: "Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF",
            icon: "seismicblast_encase.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 7.0,
                endurance: 7.696,
                cast: 1.33,
                damage: {
                    type: "Smashing",
                    scale: 3.091
                },
                defenseDebuff: 1.0,
                buffDuration: 6.0
            }
        },
        {
            name: "Rock Shards",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You launch a volley of stone shards at your target in a sweeping cone. These shards stab into the target, causing lethal damage. They will also continue to suffer additional lethal damage over time.<br><br>If affected by Seismic Shockwaves, this power will halt the shockwaves, the up front damage will be increased and damage over time accelerated, foes will be knocked down, range will be increased to 60ft and arc to 40 degrees.<br><br>Rock Shards grants two stacks of Seismic Pressure.",
            shortHelp: "Ranged Cone, DMG(Smash), -Defense, Special",
            icon: "seismicblast_rockshards.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 6,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.07
            }
        },
        {
            name: "Entomb",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Entomb foes in a giant boulder, dealing high damage and lowering their defense. They will also become heavy, limiting their ability to jump and fly for a short time. <br><br>Entomb grants two stacks of Seismic Pressure.",
            shortHelp: "Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF",
            icon: "seismicblast_entomb.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 11.0,
                endurance: 11.024,
                cast: 2.07,
                damage: {
                    type: "Smashing",
                    scale: 4.409000000000001
                },
                defenseDebuff: 1.0,
                buffDuration: 12.0
            }
        },
        {
            name: "Seismic Force",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Greatly increases your attacks' chance to hit for a few seconds. Slightly increases damage and range.<br><br>If affected by Seismic Shockwaves, this power will halt the shockwaves and will decrease the cooldown of all recharging Seismic Blast attacks by a moderate amount.",
            shortHelp: "Self +To Hit, +DMG, +Range, +Special",
            icon: "seismicblast_aim.png",
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
            name: "Upthrust",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You channel seismic energy into the earth, causing a micro-fault to erupt under your target. This causes a shard of rock to thrust upward out of the ground, dealing smashing damage and lowering their defense. Affected foes will become heavy, limiting their ability to jump and fly for a short time. The force of the eruption can knockback enemies.<br><br>Upthrust grants two stacks of Seismic Pressure.",
            shortHelp: "Targeted AoE, DMG(Smash), -Fly, -Defense, Chance to Knockback",
            icon: "seismicblast_upthrust.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 16.0,
                endurance: 15.184,
                cast: 1.2,
                damage: {
                    type: "Smashing",
                    scale: 2.7785
                },
                defenseDebuff: 0.7,
                buffDuration: 16.0
            }
        },
        {
            name: "Gravestone",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "Create a giant pillar of stone, creating a Gravestone around your target, dealing extreme damage and limiting their ability to jump and fly for a short time.<br><br>Gravestone grants two stacks of Seismic Pressure.",
            shortHelp: "Ranged, DMG(Smash), Foe -Jump, -Fly",
            icon: "seismicblast_gravestone.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 12.0,
                endurance: 11.856,
                cast: 1.67,
                damage: {
                    type: "Smashing",
                    scale: 4.329
                },
                buffDuration: 16.0
            }
        },
        {
            name: "Stalagmite",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged Damage", "Sentinel Archetype Sets", "Stuns", "Universal Damage Sets"],
            description: "You can cause a Stalagmite to erupt under an enemy dealing minimal Lethal damage, and Disorienting them for a good while. You must be on the ground to activate this power.<br><br>If affected by Seismic Shockwaves, this power will halt the shockwaves and deal extreme damage.<br><br>Stalagmite grants two stacks of Seismic Pressure.",
            shortHelp: "Ranged, DMG(Smash), Foe Disorient, Special",
            icon: "seismicblast_stalagmite.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 8.0,
                endurance: 10.192,
                cast: 1.0
            }
        },
        {
            name: "Meteor",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged AoE Damage", "Sentinel Archetype Sets", "Universal Damage Sets"],
            description: "You call down a meteor strike from the sky at a specified location. All targets within 25' are caught in the blast radius, taking extreme damage and being knocked back.",
            shortHelp: "Ranged (Location AoE), DMG(Smash/Fire), Foe Knockback",
            icon: "seismicblast_meteor.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.57,
                buffDuration: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['sentinel/seismic-blast'] = SENTINEL_SEISMIC_BLAST_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_SEISMIC_BLAST_POWERSET = SENTINEL_SEISMIC_BLAST_POWERSET;
}