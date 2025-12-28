/**
 * Fire Blast - Blaster Primary
 * Extracted from raw_data_homecoming-20250617_6916
 */

const FIRE_BLAST_POWERSET = {
    name: "Fire Blast",
    category: "Blaster_RANGED",
    description: "Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.",
    icon: "fire_blast_set.png",
    powers: [
        {
            name: "Flares",
            available: 1,
            tier: 1,
            description: "A quick attack that throws Flares at the target. Little damage, but very fast.",
            shortHelp: "Ranged, DMG(Fire)",
            icon: "fireblast_flare.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Range",
                "Recharge Reduction"
            ],
            effects: {
                damage: {
                    type: "Fire",
                    scale: 1.0
                },
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 5.2,
                range: 80
            }
        },
        {
            name: "Fire Blast",
            available: 1,
            tier: 1,
            description: "Sends a Blast of Fire at a targeted foe and sets them ablaze for a short period of time. Slower recharge than Flares, but more damage.",
            shortHelp: "Ranged, DMG(Fire)",
            icon: "fireblast_fireblast.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Range",
                "Recharge Reduction"
            ],
            effects: {
                damage: {
                    type: "Fire",
                    scale: 1.64
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 3
                },
                accuracy: 1.0,
                recharge: 8.0,
                endurance: 8.528,
                range: 80
            }
        },
        {
            name: "Fire Ball",
            available: 2,
            tier: 2,
            description: "Hurls an exploding Fireball that consumes a targeted foe, and all nearby enemies. Anyone in the blast is set ablaze, and may continue to burn for a short period of time.",
            shortHelp: "Ranged (Targeted AoE), DMG(Fire/Smash)",
            icon: "fireblast_fireball.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Range",
                "Recharge Reduction"
            ],
            effects: {
                damage: {
                    type: "Fire",
                    scale: 0.9
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 3
                },
                accuracy: 1.0,
                recharge: 16.0,
                endurance: 15.184,
                range: 80,
                radius: 15
            }
        },
        {
            name: "Rain of Fire",
            available: 6,
            tier: 3,
            description: "Summons a Rain of Fire over a targeted location, burning foes within a large area. This slow rain of flames causes fire damage over time.",
            shortHelp: "Ranged (Location AoE), DoT(Fire), -SPD",
            icon: "fireblast_rainoffire.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Range",
                "Recharge Reduction",
                "Slow"
            ],
            effects: {
                dotDamage: {
                    type: "Fire",
                    scale: 0.0833,
                    ticks: 15
                },
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 15.6,
                range: 60,
                radius: 25,
                duration: 15
            }
        },
        {
            name: "Fire Breath",
            available: 8,
            tier: 4,
            description: "Unleashes a cone of fire that can burn all foes in front of you. Very accurate and very deadly at medium range.",
            shortHelp: "Close (Cone), DoT(Fire)",
            icon: "fireblast_firebreath.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Range",
                "Recharge Reduction"
            ],
            effects: {
                damage: {
                    type: "Fire",
                    scale: 1.03
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.186,
                    ticks: 4
                },
                accuracy: 1.0,
                recharge: 16.0,
                endurance: 15.184,
                cone: {
                    range: 40,
                    arc: 30
                }
            }
        },
        {
            name: "Aim",
            available: 10,
            tier: 5,
            description: "Greatly increases your Accuracy and Damage for a short period of time. Slightly increases Perception. Aim does not require you to stop, thus can be activated while moving.",
            shortHelp: "Self +To Hit, +DMG",
            icon: "fireblast_aim.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "To Hit Buff",
                "Endurance Reduction",
                "Recharge Reduction"
            ],
            effects: {
                tohitBuff: 0.625,  // +62.5% to-hit
                damageBuff: 0.625, // +62.5% damage
                duration: 10.25,
                recharge: 90.0,
                endurance: 5.2
            }
        },
        {
            name: "Blaze",
            available: 18,
            tier: 6,
            description: "A short range, but devastating flame attack. Blaze engulfs your target in flames and does considerable fire damage over time.",
            shortHelp: "Ranged, DMG(Fire)",
            icon: "fireblast_blaze.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Range",
                "Recharge Reduction"
            ],
            effects: {
                damage: {
                    type: "Fire",
                    scale: 2.12
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 3
                },
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 14.352,
                range: 40
            }
        },
        {
            name: "Blazing Bolt",
            available: 26,
            tier: 7,
            description: "This is a Sniper attack. If uninterrupted, this power unleashes a great bolt of fire on a single target at very long range. Blazing Bolt sets the target ablaze and can cause extreme damage over time.",
            shortHelp: "Sniper, DMG(Fire), Self +Range",
            icon: "fireblast_blazingbolt.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Range",
                "Recharge Reduction",
                "Interrupt Reduction"
            ],
            effects: {
                damage: {
                    type: "Fire",
                    scale: 2.76
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.15,
                    ticks: 3
                },
                accuracy: 1.2,  // Sniper attacks have bonus accuracy
                recharge: 12.0,
                endurance: 14.352,
                range: 150,
                interruptTime: 4.0
            }
        },
        {
            name: "Inferno",
            available: 32,
            tier: 8,
            description: "Unleashes a massive fiery explosion to devastate all nearby foes and set them ablaze. Inferno deals massive damage to all nearby foes, although the damage does vary. Activating this power leaves you drained of Endurance and unable to recover Endurance for a while.",
            shortHelp: "PBAoE, DMG(Fire/Smash), Foe DoT(Fire)",
            icon: "fireblast_inferno.png",
            type: "Click",
            maxSlots: 6,
            allowedEnhancements: [
                "Damage",
                "Accuracy",
                "Endurance Reduction",
                "Recharge Reduction"
            ],
            effects: {
                damage: {
                    type: "Fire",
                    scale: 3.0
                },
                dotDamage: {
                    type: "Fire",
                    scale: 0.2,
                    ticks: 4
                },
                accuracy: 1.0,
                recharge: 360.0,
                endurance: 20.8,
                radius: 25
            }
        }
    ]
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FIRE_BLAST_POWERSET;
}
