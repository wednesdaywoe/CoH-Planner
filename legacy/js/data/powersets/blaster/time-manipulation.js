/**
 * Time Manipulation
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_TIME_MANIPULATION_POWERSET = {
    name: "Time Manipulation",
    category: "Unknown",
    description: "Time Manipulation powerset",
    icon: "time-manipulation_set.png",
    powers: [
        {
            name: "Aging Touch",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee Damage", "Universal Damage Sets"],
            description: "You touch an enemy and accelerate their aging process causing exhaustion and psionic damage. Affected enemies will continue to age for a limited time, and suffering psionic damage over time. Targets affected by the Delayed effect will suffer from additional psionic damage over time.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, DMG(Psionic), DoT(Psionic), Foe -End Over Time",
            icon: "timemanipulation_agingtouch.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 6.0,
                endurance: 6.864,
                cast: 1.0,
                damage: {
                    type: "Psionic",
                    scale: 2.3599
                },
                dotDamage: {
                    type: "Psionic",
                    scale: 0.2,
                    ticks: 2
                },
                buffDuration: 2.1
            }
        },
        {
            name: "Time Wall",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You create a time barrier to immobilize a single enemy. Enemies behind this barrier will have time slow down around them reducing their attack rate. Enemies that are strong enough to cross the barrier will still have their movement speed reduced. Time is slowed to such an extreme that their wounds will take longer to heal, reducing their regeneration rate. Time Wall applies the Delayed effect on its target. Damage, debuff and control effects from other Temporal Manipulation powers are increased on targets affected by Delayed.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, DMG(Energy), Foe Immobilize, -SPD, -Recharge, -Regen, Special",
            icon: "timemanipulation_timewall.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.6,
                damage: {
                    type: "Energy",
                    scale: 2.6799999999999997
                },
                buffDuration: 20.0
            }
        },
        {
            name: "Time Stop",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds"],
            description: "You trap your target within the flow of time causing them to be held helpless. Even those resistant to the effects of Time Stop's hold will still have their regeneration rate and healing effects reduced for a brief period. Targets affected by the Delayed effect will suffer from a more powerful hold, however its benefits are brief.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe Hold, -Regen, -Heal",
            icon: "timemanipulation_timestop.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 16.0,
                endurance: 11.388,
                cast: 2.17,
                buffDuration: 20.0
            }
        },
        {
            name: "Chronos",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "You distort time around you, selecting a period of time where your abilities are at your highest. Your damage, attack rate and chance to hit are dramatically increased for a brief period. This power places the Accelerated effect on you. While this is in effect, the target has any healing and healing over time effects from Temporal Healing or Time Lord significantly increased.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self +DMG, +Recharge, +ToHit, Special",
            icon: "timemanipulation_chronologicalselection.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 1.17,
                buffDuration: 10.0,
                tohitBuff: 2.0
            }
        },
        {
            name: "End of Time",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You open a gate in time that can suck in enemies and send them into a distant unknown future. The affected enemies will be quickly returned to the present time, but not before being temporarily exposed to radiation and the bitter cold of an empty void, reducing their regeneration rate. Targets affected by the Delayed effect will suffer bonus damage.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, DMG(Cold/Energy), Foe -Regen",
            icon: "timemanipulation_endoftime.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 17.0,
                endurance: 16.016,
                cast: 2.03,
                damage: {
                    types: [
                        {
                            type: "Cold",
                            scale: 1.6742
                        },
                        {
                            type: "Energy",
                            scale: 1.1162
                        }
                    ],
                    scale: 2.7904
                },
                buffDuration: 20.0
            }
        },
        {
            name: "Temporal Healing",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You mend your wounds by placing your bodies in a past or future state where they are far less injured. Temporal Mending will immediately absorb damage as it's inflicted. Additionally, you will gain some resistance to slow effects and regeneration debuffs. If you are affected by the Accelerated effect, you absorb even more damage from this power.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +Absorb, +Recovery, +Resist(Slow, Regen Debuff)",
            icon: "timemanipulation_temporalhealing.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                cast: 2.03,
                buffDuration: 2.25
            }
        },
        {
            name: "Future Pain",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Fear", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Fear", "Melee Damage", "Universal Damage Sets"],
            description: "You lay your hands on your foe dig into his future timeline for the most painful experience the foe will ever go through and plant those memories on his present mind inflicting great psionic damage. The visions of this pain may be enough to make your foe cower in fear. Targets affected by the Delayed effect will suffer a more terrifying experience.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Melee, DMG(Psionic), Foe Fear",
            icon: "timemanipulation_futurepain.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 18.0,
                endurance: 16.848,
                cast: 1.67,
                damage: {
                    type: "Psionic",
                    scale: 5.5262
                },
                buffDuration: 9.17
            }
        },
        {
            name: "Time Shift",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Slow Movement", "Stuns", "To Hit Debuff"],
            description: "You shift time on an area, replacing your foes with future or past versions of themselves. This shift can be very disorienting and will incapacitate affected foes. Stronger foes may be able to resist the effect, but they still will have their movement speed and accuracy reduced. Targets affected by the Delayed effect will suffer from a more powerful disorientation, however its benefits are brief.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe Disorient, -SPD, -ToHit",
            icon: "timemanipulation_timeshift.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                range: 70.0,
                recharge: 90.0,
                endurance: 20.18,
                cast: 2.03,
                stun: 1.0,
                tohitDebuff: 0.5,
                buffDuration: 20.0
            }
        },
        {
            name: "Time Lord",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "You are a time lord, for you time is just a small hurdle that can easily be overcome or ignored. As a time lord, all your attacks recharge faster and you are resistant to energy attacks in addition to disorient effects, movement debuffs and recharge debuffs. If you are affected by the Accelerated effect, your powers will recharge even faster and you will become nearly immune to recharge debuffs. This power is always on and cost no endurance.",
            shortHelp: "Auto: Self +Recharge, +Resist(Energy, Disorient, Slow)",
            icon: "timemanipulation_timelord.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                resistance: {
                    energy: 0.035
                },
                debuffResistance: {
                    recharge: 0.6,
                    movement: 0.6
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.5
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/time-manipulation'] = BLASTER_TIME_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_TIME_MANIPULATION_POWERSET = BLASTER_TIME_MANIPULATION_POWERSET;
}