/**
 * Wind Control
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_WIND_CONTROL_POWERSET = {
    name: "Wind Control",
    category: "Unknown",
    description: "Wind Control powerset",
    icon: "wind-control_set.png",
    powers: [
        {
            name: "Clear Skies",
            available: 0,
            tier: 1,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "When training yourself in the creation of a Vortex, you also learn how to create the Clear Skies effect. If you use Vacuum on your own Vortex, you will gain a boost to your chance to hit foes, your attack speed and your recovery. Additionally, the endurance cost of all your powers will be reduced. While the strength of the Clear Skies effect cannot be stacked and cannot be increased, the duration of the effect can be extended from the minimum duration of 30 seconds. The more Pressure you consume when you execute Vacuum, the greater the duration of the Clear Skies bonuses, up to a maximum of 60 seconds. When the bonuses of Clear Skies end, you will be under the Clouded Skies effect, which prevents another Clear Skies buff from applying, for several minutes. Clear Skies is granted automatically when both Vacuum and Vortex have been trained.",
            shortHelp: "Self (Auto), +ToHit, +Rech, +Rec, -EndCost",
            icon: "windcontrol_clearskies.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                tohitBuff: 2.5,
                buffDuration: 2.1
            }
        },
        {
            name: "Downdraft",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Holds", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You gather air above your target before forcefully pressurizing it into a downward flowing vortex. The force of the downdraft prevents your target from moving, effectively holding them in place and preventing flight. The force of the downdraft leaves the target winded, reducing their movement and attack speeds for a short time while they recover. This power builds Pressure.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged, Hold(Foe), -Movement(Foe), -Rech(Foe), -Fly(Foe), Pressure Builder (Self)",
            icon: "windcontrol_downdraft.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 8.0,
                endurance: 8.528,
                cast: 1.87,
                damage: {
                    type: "Smashing",
                    scale: 5.0436
                },
                buffDuration: 12.0
            }
        },
        {
            name: "Updraft",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Ranged Damage", "Universal Damage Sets"],
            description: "You gather air at the feet of your target before forcefully pressurizing it into an upward flowing vortex. The force of the updraft pulls your target into the sky. When the updraft dissipates, your target falls to the ground and suffers moderate smashing damage. The affected target is also unable to fly for a short time. This power builds Pressure.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, High DMG(Smashing), Knockup(Foe), -Fly(Foe), Pressure Builder (Self)",
            icon: "windcontrol_updraft.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.03,
                damage: {
                    type: "Smashing",
                    scale: 3.9214999999999995
                },
                buffDuration: 10.0
            }
        },
        {
            name: "Breathless",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Immobilize", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You release all available Pressure to create a localized high pressure sphere at a location of your choosing. This high pressure crushes foes continually while they remain within the sphere, causing lethal damage over time. Affected foes will be immobilized and suffer from a reduced attack speed. In normal combat, affected foes will also suffer reduced damage potential, while in PvP, affected foes will suffer from increased endurance cost of their powers. The damage done increases in proportion to the amount of Pressure released when using this power. Also, Breathless can reduce the damage potential of all targets, in PvE or PvP, if used at the lowest levels of Pressure accumulation.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Ranged (Targeted AoE), Minor DMG(Lethal), Immobilize (Foe), -DMG(Foe, All), +EndCost(Foe, PvP), Consumes Pressure",
            icon: "windcontrol_breathless.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.9,
                range: 80.0,
                recharge: 8.0,
                endurance: 15.6,
                cast: 2.07,
                damage: {
                    type: "Lethal",
                    scale: 1.1916
                },
                buffDuration: 15.0
            }
        },
        {
            name: "Wind Shear",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Controller Archetype Sets", "Slow Movement", "To Hit Debuff"],
            description: "You create a sphere of high speed winds around yourself. This significantly slows the movement of any enemies caught within the sphere and makes their attacks less likely to hit. Damage potential is also reduced. Flying foes are brought to the ground. This power neither builds nor releases Pressure, but does have a continuous Endurance cost.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "PBAoE (Toggle), -Speed (Foe, All), -Fly(Foe), -ToHit(Foe), -DMG(Foe, All)",
            icon: "windcontrol_windshear.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 2.08,
                cast: 2.03,
                tohitDebuff: 0.75,
                buffDuration: 2.1
            }
        },
        {
            name: "Thundergust",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Knockback", "Ranged AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "You unleash a powerful gust of wind in the direction of your foes. This gust has enough force to deal minor smashing damage to your foes and knock them to the ground. The debris blown at your opponent temporarily blinds them, reducing their chance to hit. This power builds Pressure.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Minor DMG(Smashing), Knockdown(Foe), -ToHit(Foe), Pressure Builder (Self)",
            icon: "windcontrol_thundergust.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 0.6981,
            effects: {
                accuracy: 1.0,
                recharge: 30.0,
                endurance: 10.4,
                cast: 2.17,
                damage: {
                    type: "Smashing",
                    scale: 1.21
                },
                tohitDebuff: 1.5,
                buffDuration: 12.0
            }
        },
        {
            name: "Microburst",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Controller Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Slow Movement", "Stuns", "Universal Damage Sets"],
            description: "You release all available Pressure to create an extremely powerful blast of air that descends from the skies and spreads out over a large radius. Any foes caught within the burst are immediately stunned by the force of the wind and suffer smashing damage.Flying foes are knocked out of the sky, while all foes suffer reduced movement speed that lingers for some time. The damage done increases in proportion to the amount of Pressure released when using this power. Also, Microburst can reduce your target's defenses at the when the highest levels of Pressure are released.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Minor DMG(Smashing), Stun(Foe), -Speed(Foe, All), -Fly(Foe), -Rech(Foe), Chance for -DEF(Foe, All), Consumes Pressure",
            icon: "windcontrol_microburst.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.37,
                damage: {
                    type: "Smashing",
                    scale: 0.5789
                },
                stun: 1.0,
                buffDuration: 12.0,
                defenseDebuff: 2.5
            }
        },
        {
            name: "Keening Winds",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Confuse", "Controller Archetype Sets", "Endurance Modification"],
            description: "You create a sphere of variable speed winds that generate strong friction within the turbulence of the air. This creates odd echoes and sounds that confuse foes caught within the burst. The loss of confidence your foes suffer due their confusion causes them to lose endurance over a few seconds, while you gain endurance due to a boost in confidence you enjoy from seeing your foes struggle. This power builds Pressure.<br><br><color #fcfc95>Damage: None.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Confuse(Foe), EndDrain(Foe), +End(Self)",
            icon: "windcontrol_keeningwinds.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 0.8,
                range: 80.0,
                recharge: 120.0,
                endurance: 10.4,
                cast: 1.67,
                buffDuration: 2.1
            }
        },
        {
            name: "Vacuum",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Controller Archetype Sets", "Holds", "Ranged AoE Damage", "Slow Movement", "To Hit Debuff", "Universal Damage Sets"],
            description: "You release all Pressure to create a vacuum space around a target. With a foe target, the foe is held. Nearby foes may also be held. Foes in the field suffer lethal damage and persistent movement, attack speed, and chance to hit debuffs that grow stronger the longer they are in the field. If centered on an ally, the main target is not held, but foes are affected as normal. For each Pressure released, the Vacuum field persists for 2 seconds more. At your highest Pressure level, the main target will take extra damage and the field will persist long enough to reapply its hold. If Vacuum is targeted on your Vortex, you will gain the Clear Skies boon, but at the expense of using the power to harm foes. The boon lasts 5 seconds more for each Pressure released. Both Vacuum and Vortex are required to unlock Clear Skies.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Hold (Foe), Moderate DoT (Lethal), -Movement(Foe), -Rech(Foe), -ToHit(Foe), Special(Pet), Pressure Consumer (Self)",
            icon: "windcontrol_vacuum.png",
            powerType: "Click",
            targetType: "Any (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 240.0,
                endurance: 15.6,
                cast: 2.03,
                damage: {
                    type: "Lethal",
                    scale: 0.4789
                },
                buffDuration: 8.0
            }
        },
        {
            name: "Vortex",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Pet Damage", "Recharge Intensive Pets", "Slow Movement", "Stuns", "To Hit Debuff", "Universal Damage Sets"],
            description: "You can create a true Vortex cloud to assist you in battle. This Vortex will build Pressure along with you as you use your powers. This will allow its attacks to have a chance, proportional to current pressure, for critical damage. However, at higher pressures, the Vortex will be unable to use some of its powers. The Manipulation of Pressure on this pet through the use of Vacuum upon it will grant you the Clear Skies buff. Both this power and Vacuum are required to automatically unlock Clear Skies.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Summon Vortex",
            icon: "windcontrol_vortex.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 240.0,
                endurance: 20.8,
                cast: 1.87
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/wind-control'] = CONTROLLER_WIND_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_WIND_CONTROL_POWERSET = CONTROLLER_WIND_CONTROL_POWERSET;
}