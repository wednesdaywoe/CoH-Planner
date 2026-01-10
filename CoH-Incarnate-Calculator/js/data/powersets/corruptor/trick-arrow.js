/**
 * Trick Arrow
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_TRICK_ARROW_POWERSET = {
    name: "Trick Arrow",
    category: "Unknown",
    description: "Trick Arrow powerset",
    icon: "trick-arrow_set.png",
    powers: [
        {
            name: "Entangling Arrow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Immobilize", "Slow Movement"],
            description: "You entangle a targeted foe causing their reflexes to become slowed and sluggish. This grounds them and causes them to have decreased movement speed and damage resistance. Weaker foes will also be immobilized.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Target Immobilize, -Res(All), -Fly, Slow",
            icon: "trickarrow_immobilize.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.0,
                buffDuration: 30.0
            }
        },
        {
            name: "Flash Arrow",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "To Hit Debuff"],
            description: "This arrow explodes in a dazzling flash of light and sound. The targets are so blinded that they can hardly see a thing. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to chance to hit.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe -Visibility, -To Hit",
            icon: "trickarrow_blind.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 7.8,
                cast: 1.0,
                tohitDebuff: 0.5,
                buffDuration: 60.0
            }
        },
        {
            name: "Glue Arrow",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Slow Movement"],
            description: "This arrow carries a cartridge of intensely sticky glue, which explodes on impact. The glue Slows the movement and attack rates of any foes in the area.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Foe -Speed, -Recharge",
            icon: "trickarrow_slow.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 60.0,
                endurance: 7.8,
                cast: 1.16,
                buffDuration: 60.0
            }
        },
        {
            name: "Ice Arrow",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds", "Slow Movement"],
            description: "This arrow can freeze a single foe in a block of ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be Held, but all affected targets will be Slowed, have their secondary effects weakened, and damage output reduced.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged, Foe Hold, -SPD, -Recharge, -DMG, -Special",
            icon: "trickarrow_hold.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 18.0,
                endurance: 8.528,
                cast: 1.67,
                buffDuration: 10.0
            }
        },
        {
            name: "Poison Gas Arrow",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Sleep"],
            description: "This arrow carries a capsule cloud of poisonous gas, which explodes on impact and weakens all foes in its vicinity. Affected foes damage potential will be severely reduced. Some foes will react badly to the poison and choke for a time, though they will react if attacked.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged AoE, Foe -DMG, Sleep",
            icon: "trickarrow_debuffdamage.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.5,
                range: 70.0,
                recharge: 45.0,
                endurance: 10.4,
                cast: 1.16,
                buffDuration: 20.0
            }
        },
        {
            name: "Acid Arrow",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Universal Damage Sets"],
            description: "This arrow explodes in a small shower of acid on impact. This acid eats through armor, causing damage over time, reducing target's Defense as well as their resistance to debuffs, while making it harder for them to be healed.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged AoE Minor DoT(Toxic), Foe -Res(Special), Res(Heal), -DEF",
            icon: "trickarrow_debuffdefense.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 20.0,
                endurance: 7.8,
                cast: 1.83,
                dotDamage: {
                    type: "Toxic",
                    scale: 0.01,
                    ticks: 20
                },
                buffDuration: 20.0,
                defenseDebuff: 2.0
            }
        },
        {
            name: "Disruption Arrow",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "This arrow plants a sonic resonator at a target location. The vibrations of the resonator weaken the Damage Resistance and Max Endurance of all nearby foes.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), -Res(All), -MaxEnd",
            icon: "trickarrow_debuffdamres.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 30.0,
                endurance: 14.56,
                cast: 1.16,
                buffDuration: 45.0
            }
        },
        {
            name: "Oil Slick Arrow",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Defense Debuff", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "On impact, this arrow creates an oil slick that Slows foes in the area and may cause them to slip and fall. The oil slick is very flammable and may burst into flames if fire is used near it.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Location AoE), Knockdown, -Speed, -DEF, +Special",
            icon: "trickarrow_knockdown.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 180.0,
                endurance: 15.6,
                cast: 1.16,
                buffDuration: 30.0
            }
        },
        {
            name: "EMP Arrow",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Holds"],
            description: "EMP Arrow unleashes a massive pulse of electromagnetic energy on impact. Allies that enter the field will see an increase to their damage resistances against all damage except Toxic. They are also protected from status effects, knockbacks, endurance drain, recovery debuffs and recharge debuffs. Only one EMP Field can be sustained at once. This EMP will affect enemy machines adversively, and is even powerful enough to affect synaptic brain patterns. It will incapacitate all foes in its radius. Machines and robots are more likely to take high damage.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "AoE, Foe Hold, Special",
            icon: "trickarrow_stun.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 300.0,
                endurance: 23.4,
                cast: 1.83,
                buffDuration: 240.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/trick-arrow'] = CORRUPTOR_TRICK_ARROW_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_TRICK_ARROW_POWERSET = CORRUPTOR_TRICK_ARROW_POWERSET;
}