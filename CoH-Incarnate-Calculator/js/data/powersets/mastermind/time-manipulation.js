/**
 * Time Manipulation
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_TIME_MANIPULATION_POWERSET = {
    name: "Time Manipulation",
    category: "Unknown",
    description: "Time Manipulation powerset",
    icon: "time-manipulation_set.png",
    powers: [
        {
            name: "Temporal Mending",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You mend the wounds of yourself and nearby allies by placing your bodies in a past or future state where they are far less injured. Temporal Mending will immediately heal its targets and continue to heal them for an equal amount over the next 6 seconds. Additionally, affected allies will gain some resistance to slow effects and regeneration debuffs. Allies affected by the Accelerated effect will receive additional healing from this power.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Ally +Heal, Heal Over Time, +Res(Slow, Regen Debuff)",
            icon: "timemanipulation_temporalmending.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 18.0,
                endurance: 16.25,
                cast: 2.03,
                buffDuration: 30.0
            }
        },
        {
            name: "Time Crawl",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Slow Movement"],
            description: "You're able to dramatically slow the time around a single enemy, reducing their movement speed and attack rate. Time is slowed to such an extreme that their wounds will take longer to heal, reducing their regeneration rate. Time Crawl applies the Delayed effect on its target. Debuff and control effects from other Time Manipulation powers are increased on targets affected by Delayed.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged Foe, -Speed, -Recharge, -Regen, Special",
            icon: "timemanipulation_timecrawl.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 13.0,
                cast: 1.6,
                buffDuration: 20.0
            }
        },
        {
            name: "Time's Juncture",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Slow Movement", "To Hit Debuff"],
            description: "You create a time dilation field around you causing enemies who get too close to be slowed to a crawl, their movement speed, damage and chance to hit will be decreased substantially. Enemies affected by Delayed have these affects increased.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: PBAoE Foe (-Damage, -Speed, -To Hit)",
            icon: "timemanipulation_timesjuncture.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.4875,
                cast: 0.67,
                tohitDebuff: 1.5,
                buffDuration: 1.0
            }
        },
        {
            name: "Temporal Selection",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You distort time around an ally, selecting a period of time where their abilities are at their highest. Their damage, attack rate and regeneration rates are dramatically increased for a brief period. This power places the Accelerated effect on the target. While this is in effect, the target has any healing and healing over time effects from Temporal Mending or Chrono Shift significantly increased.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ally +Damage, +Recharge, +Regeneration",
            icon: "timemanipulation_temporalselection.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 120.0,
                endurance: 13.0,
                cast: 2.27,
                buffDuration: 120.0
            }
        },
        {
            name: "Distortion Field",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Holds", "Slow Movement"],
            description: "You can choose an area to slow the flow of time down to a crawl. Enemies who enter the field will have their attack rate and speed slowed dramatically. In addition, affected enemies might become held as they are frozen in time. Targets affected by Time Crawl will have the chance to be held increased.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Foe(-Recharge, -Speed), Chance for Hold",
            icon: "timemanipulation_distortionfield.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 60.0,
                endurance: 18.2,
                cast: 2.03,
                buffDuration: 45.0
            }
        },
        {
            name: "Time Stop",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds"],
            description: "You trap your target within the flow of time causing them to be held helpless. Even those resistant to the effects of Time Stop's hold will still have their regeneration rate and healing effects reduced for a brief period. Targets affected by Time Crawl will suffer from a more powerful hold, however its benefits are brief.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged Hold, Foe -Regen, -Heal",
            icon: "timemanipulation_timestop.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 16.0,
                endurance: 11.05,
                cast: 2.17,
                buffDuration: 20.0
            }
        },
        {
            name: "Farsight",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets", "To Hit Buff"],
            description: "You give your allies a brief glimpse of the future and what is to come. This provides you and your team a moderate increase to your chance to hit and defense for a short period of time.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "PBAoE Team, +To-Hit, +Defense(All), +Perception",
            icon: "timemanipulation_farsight.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 240.0,
                endurance: 19.5,
                cast: 2.03,
                buffDuration: 120.0,
                tohitBuff: 1.0
            }
        },
        {
            name: "Slowed Response",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff"],
            description: "You manipulate time around a targeted foe causing their reflexes to become slowed and sluggish. This causes them to have decreased defense and damage resistance. A target affected by Time Crawl will suffer from a more powerful effect.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe -Defense, -Resistance",
            icon: "timemanipulation_slowedresponse.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 90.0,
                endurance: 19.5,
                cast: 2.27,
                buffDuration: 30.0,
                defenseDebuff: 2.5
            }
        },
        {
            name: "Chrono Shift",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You cause nearby allies to act more quickly by allowing them to slip through the time stream seamlessly. When Chrono Shift is activated, you and nearby allies will immediately recover a portion of your health and endurance. Chrono Shift will greatly increase the Recharge Speed of nearby allies for the duration of the power, additionally for a short while the flow of time will constantly undo a portion of your allies' wounds causing them to periodically recover health and recover endurance. An ally affected by Temporal Selection will recover additional health from Chrono Shift.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "PBAoE, Team +Recharge, Moderate Healing over Time",
            icon: "timemanipulation_chronoshift.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 360.0,
                endurance: 26.0,
                cast: 2.03,
                buffDuration: 30.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/time-manipulation'] = MASTERMIND_TIME_MANIPULATION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_TIME_MANIPULATION_POWERSET = MASTERMIND_TIME_MANIPULATION_POWERSET;
}