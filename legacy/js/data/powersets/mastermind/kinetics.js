/**
 * Kinetics
 * Character Level: 50
 * Archetype: mastermind
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const MASTERMIND_KINETICS_POWERSET = {
    name: "Kinetics",
    category: "Unknown",
    description: "Kinetics powerset",
    icon: "kinetics_set.png",
    powers: [
        {
            name: "Siphon Power",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "You can Siphon the Power from a targeted foe, reducing his damage potential. The power is transferred back to you, increasing your own damage potential and that of all nearby allies.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe -DMG, Team +DMG",
            icon: "kineticboost_siphonpower.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 20.0,
                endurance: 13.0,
                cast: 1.93,
                buffDuration: 30.0
            }
        },
        {
            name: "Transfusion",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Endurance Modification", "Healing"],
            description: "Transfusion drains an enemy of some Endurance and reduces the target's Regeneration rate, and transfers that energy, in the form of Hit Points, to all allies near the affected foe. You can use Transfusion to heal yourself as well as your allies.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Foe -End, -Regen, Team Heal",
            icon: "kineticboost_transfusion.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 8.0,
                endurance: 9.75,
                cast: 1.17,
                buffDuration: 20.0
            }
        },
        {
            name: "Repel",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Knockback"],
            description: "Repel creates a zone of kinetic energy that violently repels nearby foes. Each foe that is repelled costs additional Endurance.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Toggle: Self AoE Knockback",
            icon: "kineticboost_repel.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 0.4063,
                cast: 1.07,
                buffDuration: 0.5
            }
        },
        {
            name: "Siphon Speed",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Slow Movement"],
            description: "You can Siphon the speed from a targeted foe, Slowing his movement and attack rate while boosting your own.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe -Speed, -Rech, Self +Speed, +Rech",
            icon: "kineticboost_siphonspeed.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 60.0,
                endurance: 9.75,
                cast: 1.93,
                buffDuration: 60.0
            }
        },
        {
            name: "Increase Density",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "Increases an ally's mass, freeing him from any Disorient, Immobilization, or Hold effects and leaving him resistant to such effects for a while. Increase Density also protects the target from Knockback, Repel and enemy Teleportation, as well as Smashing and Energy damage. Because the target grows more dense, their movement speed is Slowed. Although the Damage Resistance and slowing effect will not stack with multiple applications, the rest of the effects of Increase Density will. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Ally Special",
            icon: "kineticboost_increasedensity.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 3.0,
                endurance: 6.5,
                cast: 2.07,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.5,
                            ticks: 30
                        },
                        {
                            type: "Energy",
                            scale: 2.5,
                            ticks: 30
                        }
                    ]
                },
                buffDuration: 60.0,
                stun: 1.0,
                stunDuration: 60.0
            }
        },
        {
            name: "Speed Boost",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Running", "Running & Sprints", "Universal Travel"],
            description: "You can hasten a targeted ally and its nearby allies. The allies' movement speed, attack rate, and Endurance recovery are all greatly increased and they gain resistance to Slow effects. You cannot use this power on yourself.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Ranged, Allies +SPD, +Recharge, +Recovery, Res Slow",
            icon: "kineticboost_speedboost.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                range: 50.0,
                recharge: 2.0,
                endurance: 9.75,
                cast: 1.0,
                buffDuration: 120.0
            }
        },
        {
            name: "Inertial Reduction",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Leaping", "Leaping & Sprints", "Universal Travel"],
            description: "You can reduce your Inertia, along with that of all nearby allies. The affected allies can then jump incredible distances for a while.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE, Allies +Jump",
            icon: "kineticboost_initialreductions.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 29.25,
                cast: 2.03,
                buffDuration: 60.0
            }
        },
        {
            name: "Transference",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Transference drains an enemy of some of their Endurance and transfers that Endurance to all allies near the affected foe. You can use Transference to recover Endurance for yourself as well as your allies.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Target -End, Team +Recovery, Special",
            icon: "kineticboost_transferance.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.1,
                range: 60.0,
                recharge: 30.0,
                endurance: 3.25,
                cast: 2.27
            }
        },
        {
            name: "Fulcrum Shift",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: [],
            description: "Fulcrum Shift drains the power of a targeted foe and all foes nearby, transferring it to all adjacent allies, you, and those near you. Affected foes will deal less damage, while your affected allies will deal more. The more foes that are affected, the more power you and your allies receive. Fulcrum Shift can dramatically turn the tide of a battle.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Foe AoE), Foe -DMG, Team +DMG",
            icon: "kineticboost_kinetictransfer.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 60.0,
                endurance: 19.5,
                cast: 2.17
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['mastermind/kinetics'] = MASTERMIND_KINETICS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.MASTERMIND_KINETICS_POWERSET = MASTERMIND_KINETICS_POWERSET;
}