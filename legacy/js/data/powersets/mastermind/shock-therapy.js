/**
 * Shock Therapy
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_SHOCK_THERAPY_POWERSET = {
    name: "Shock Therapy",
    category: "Unknown",
    description: "Shock Therapy powerset",
    icon: "shock-therapy_set.png",
    powers: [
        {
            name: "Rejuvenating Circuit",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Create a circuit of healing energy between several nearby allies, healing them for a small amount. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Rejuvenating Circuit grants 1 stack of Static.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Chain), Ally Heal, Self +Static",
            icon: "shocktherapy_rejuvenatingcircuit.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "Chain",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 8.0,
                endurance: 16.25,
                cast: 1.17
            }
        },
        {
            name: "Shock",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Strike a single foe with a highly-charged electrical shock, draining some endurance and moderately reducing their recovery, regeneration and damage output.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe -DMG, -End, -Recovery, -Regen",
            icon: "shocktherapy_shock.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 12.0,
                endurance: 10.66,
                cast: 2.0,
                buffDuration: 25.0
            }
        },
        {
            name: "Discharge",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Unleash a blast of electrical energy around your target, draining them and all nearby enemies of some endurance. This will also reduce their regeneration, recovery, and damage dealt for a short period of time.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe -DMG, -End, -Recovery, -Regen",
            icon: "shocktherapy_discharge.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 20.0,
                endurance: 19.5,
                cast: 2.03,
                buffDuration: 25.0
            }
        },
        {
            name: "Energizing Circuit",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Create a circuit of pure energy between several nearby allies, restoring a small amount of their endurance and significantly increasing their attack rate for a short time. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Energizing Circuit grants 1 stack of Static.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Chain), Ally +End, +Recharge, Self +Static",
            icon: "shocktherapy_energizingcircuit.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "Chain",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 35.0,
                endurance: 16.25,
                cast: 1.67,
                buffDuration: 5.0
            }
        },
        {
            name: "Faraday Cage",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Create a large energy barrier at your location which provides all allies within resistance to all damage except Toxic. They are also protected from status effects, knockbacks, endurance drain, recovery debuffs and recharge debuffs. Casting this power again will move the energy barrier to your location. Standing inside your own Faraday Cage will grant you a stack of Static every 5 seconds.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Location (PBAoE), Team +Res(All DMG but Toxic, Status, Knockback, -Rech, -Rec, -End)",
            icon: "shocktherapy_faradaycage.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 25.0,
                recharge: 10.0,
                endurance: 16.25,
                cast: 1.07,
                buffDuration: 240.0
            }
        },
        {
            name: "Empowering Circuit",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "Create a circuit of empowering energy between several nearby allies, increasing their damage output and chance to hit for a short time. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Empowering Circuit grants 1 stack of Static.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Chain), Ally +DMG, +Tohit, Self +Static",
            icon: "shocktherapy_empoweringcircuit.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "Chain",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 16.25,
                cast: 1.0,
                buffDuration: 60.0,
                tohitBuff: 1.2
            }
        },
        {
            name: "Defibrillate",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Sleep"],
            description: "Strike a target with a highly-charged jolt of electricity, reviving all nearby allies and draining all nearby foes. Any enemies affected will be drained of some endurance, have their recovery reduced and be put to sleep for a short time. Defibrillate consumes all stacks of Static, and the strength of the offensive component of this power scales with the number of stacks consumed. Allies will always be revived with full health and endurance regardless of the number of Static stacks consumed.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Melee (Targeted AoE), Ally Rez, Foe Sleep, -End, -Recovery",
            icon: "shocktherapy_defibrillate.png",
            powerType: "Click",
            targetType: "Any",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 7.0,
                recharge: 120.0,
                endurance: 32.5,
                cast: 3.3
            }
        },
        {
            name: "Insulating Circuit",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Create a circuit of protective energy between several nearby allies, granting them a small protective shield. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Insulating Circuit grants 1 stack of Static.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Chain), Ally +Absorb, Self +Static",
            icon: "shocktherapy_insulatingcircuit.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "Chain",
            maxTargets: 5,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 20.0,
                endurance: 16.25,
                cast: 1.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Amp Up",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "Empower an ally with raw energy, causing all of their abilities to unleash chained bolts of electricity at nearby foes. These bolts drain a small amount of endurance and have a chance to knock up the target. Amp Up also moderately increases their attack rate and greatly boosts the secondary effects of their powers. Their power effects like heals, defense debuffs, endurance drains, disorients, holds, immobilizes and more, are all improved.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Ranged, Ally +Special, +Recharge",
            icon: "shocktherapy_ampup.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 300.0,
                endurance: 13.0,
                cast: 2.57,
                buffDuration: 90.0,
                stun: 1.0,
                stunDuration: 90.0,
                tohitBuff: 3.6,
                defenseBuff: 3.6
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/shock-therapy'] = MASTERMIND_SHOCK_THERAPY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_SHOCK_THERAPY_POWERSET = MASTERMIND_SHOCK_THERAPY_POWERSET;
}