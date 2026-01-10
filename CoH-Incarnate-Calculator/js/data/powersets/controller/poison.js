/**
 * Poison
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_POISON_POWERSET = {
    name: "Poison",
    category: "Unknown",
    description: "Poison powerset",
    icon: "poison_set.png",
    powers: [
        {
            name: "Alkaloid",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "When used correctly, poisons can be used to heal, as well as harm. Alkaloid consists of just the right amount of amino acids to safely heal a single targeted ally. The healed target is also left with some resistance to Toxic Damage (This Toxic Damage Resistance cannot be Enhanced). You cannot use this power to heal yourself.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally Heal, +Res(Toxic)",
            icon: "poison_alkaloid.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 4.0,
                endurance: 13.0,
                cast: 1.53,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 30
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Envenom",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff"],
            description: "You Envenom your foe with a nasty poison, the poison then spreads to nearby foes. The toxin directly attacks the immune system, reducing the affected target's Defense, Damage Resistance and Hit Point Regeneration Rate. The poison is so potent, that the target actually responds less to Healing while affected by the poison. Secondary foes struck by this power will have a lesser effect placed on them while the primary target receives the full effectiveness of the power.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe -RES, -DEF, -Regen, -Heal",
            icon: "poison_envenomaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 12.0,
                endurance: 10.4,
                cast: 1.33,
                defenseDebuff: 1.5,
                buffDuration: 30.0
            }
        },
        {
            name: "Weaken",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "To Hit Debuff"],
            description: "You poison a single foe with a venom that significantly Weakens their strength and and that of nearby foes. The affected primary target's chance to hit and Damage output is severely reduced Additionally, the affected targets secondary power effects are all weakened. The targets power effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all weakened. Secondary foes struck by this power will have a lesser effect placed on them while the primary target receives the full effectiveness of the power.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Targeted AoE) Foe -DMG -To Hit, -Special",
            icon: "poison_weakenaoe.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 16.0,
                endurance: 10.4,
                cast: 2.07,
                buffDuration: 30.0,
                tohitDebuff: 0.75
            }
        },
        {
            name: "Neurotoxic Breath",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Slow Movement"],
            description: "You can breath a cone of Neurotoxin gas that quickly start to anesthetize any nearby foes. Affected targets may choke on the gas as their movement and attack rate are severely reduced.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Cone), Foe -SPD, -Recharge",
            icon: "poison_neurotoxicbreath.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 0.5236,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 30.0,
                endurance: 10.4,
                cast: 2.67,
                buffDuration: 20.0
            }
        },
        {
            name: "Elixir of Life",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Resist Damage"],
            description: "With this Elixir, you can revive a fallen ally and turn him into a killing machine. The revived target has increased damage, chance to hit, Endurance recovery, and attack speed, and gains a resistance to Toxic damage. A brew of this sort is not without its side effects. The revived target will soon become very sick and severely weak after about 90 seconds. All effects of the Elixir will eventually wear off. Elixir of Life can only be used on Players and cannot be used on your Henchmen.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Close, Ally Rez, Special",
            icon: "poison_elixiroflife.png",
            powerType: "Click",
            targetType: "Player Ally (Dead)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 15.0,
                recharge: 180.0,
                endurance: 26.0,
                cast: 1.83,
                dotDamage: {
                    type: "Toxic",
                    scale: 2.0,
                    ticks: 45
                },
                buffDuration: 0.5,
                tohitBuff: 3.0,
                tohitDebuff: 3.0
            }
        },
        {
            name: "Antidote",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "This Antidote can free an ally from any Disorient, Hold, Sleep, Slow, Confuse, Fear and Immobilize effects and leaves them resistant to such effects for a good while. The Antidote also grants the target some resistance to Cold and Toxic damage. Some of the effects of this power will improve with Multiple applications and as you advance in level.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ally +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Slow, Cold, Toxic)",
            icon: "poison_antidote.png",
            powerType: "Click",
            targetType: "Ally (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 4.0,
                endurance: 5.2,
                cast: 1.53,
                dotDamage: {
                    types: [
                        {
                            type: "Toxic",
                            scale: 2.0,
                            ticks: 45
                        },
                        {
                            type: "Cold",
                            scale: 1.0,
                            ticks: 45
                        }
                    ]
                },
                stun: 1.0,
                stunDuration: 90.0,
                buffDuration: 90.0
            }
        },
        {
            name: "Paralytic Poison",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds"],
            description: "This Paralytic Poison viciously attacks a foe's nervous system and can leave an affected target completely Held and defenseless.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged Hold",
            icon: "poison_paralytic.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 16.0,
                endurance: 7.8,
                cast: 2.0
            }
        },
        {
            name: "Poison Trap",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Controller Archetype Sets", "Endurance Modification", "Holds", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can build a Poison Trap on the ground. Any foes that pass near the Poison Trap will cause it to detonate and release its toxic vapors. The poison is a highly toxic nerve gas, and any foes in the affected area may be drained of much of their Endurance and quickly Held or begin choking while suffering a minor amount of Toxic damage over time. The trap is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trap will detonate.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Place Trap: PBAoE Foe Hold, -END, -Recovery, Chance to Hold, Minor DoT(Toxic)",
            icon: "poison_poison_trap.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 10.4,
                cast: 1.0,
                buffDuration: 260.0
            }
        },
        {
            name: "Venomous Gas",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Debuff", "To Hit Debuff"],
            description: "You surround yourself in a cloud of toxic vapors that significantly weaken any enemies that get near you. Affected foes have their defense, damage resistance, damage and chance to hit reduced moderately.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: PBAoE, Foe -Res(All), -DMG(All), -Def(All), -To(Hit)",
            icon: "poison_venomousgas.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 8.0,
                endurance: 0.26,
                cast: 2.03,
                buffDuration: 0.75,
                defenseDebuff: 1.0,
                tohitDebuff: 1.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/poison'] = CONTROLLER_POISON_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_POISON_POWERSET = CONTROLLER_POISON_POWERSET;
}