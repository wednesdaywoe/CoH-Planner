/**
 * Radiation Emission
 * Extracted from raw_data_homecoming with redirect and entity support
 */

const RADIATION_EMISSION_POWERSET = {
    name: "Radiation Emission",
    category: "UNKNOWN",
    description: "Radiation Emission powerset",
    icon: "radiation-emission_set.png",
    powers: [
        {
            name: "Radiant Aura",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can use Radiant Aura to heal some of your wounds, and the wounds of your group. This power has a small radius, so your allies need to be near you if they wish to be affected.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "PBAoE, Ally +Heal",
            icon: "radiationpoisoning_radiationemission.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            radius: 25.0,
            effects: {
                accuracy: 1.0,
                recharge: 8.0,
                endurance: 13.0,
                cast: 2.03,
                healing: 1.0
            }
        },
        {
            name: "Radiation Infection",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Debuff", "To Hit Debuff"],
            description: "Infects a targeted foe with deadly radiation, severely reducing their chance to hit and Defense. All foes that come near the target will also become infected. The Radiation Infection will last until you deactivate it, or until the original target is defeated.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Ranged (Targeted AoE), Foe -DEF, -To Hit",
            icon: "radiationpoisoning_enervatingfield.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 16,
            radius: 15.0,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 8.0,
                endurance: 0.26,
                cast: 1.5,
                tohitDebuff: 2.5,
                duration: 0.75,
                defenseDebuff: 2.5
            }
        },
        {
            name: "Accelerate Metabolism",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Running", "Running & Sprints", "Universal Travel"],
            description: "Activating this power emits radiation that increases the running speed, attack speed, Endurance recovery, and damage potential of all nearby allies. Affected heroes' metabolisms are increased so much that they become resistant to effects such as Sleep, Hold, Disorient, Immobilization and Endurance Drain.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "PBAoE, Ally +SPD, +Recharge, +Recovery, +DMG +Res(Effects)",
            icon: "radiationpoisoning_acceleratemetabolism.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            radius: 25.0,
            effects: {
                accuracy: 1.0,
                recharge: 422.0,
                endurance: 15.6,
                cast: 2.03,
                resistanceDebuff: 1.5,
                duration: 120.0,
                hold: 1.0,
                holdDuration: 120.0,
                stun: 1.0,
                stunDuration: 120.0,
                immobilize: 1.0,
                immobilizeDuration: 120.0,
                sleep: 1.0,
                sleepDuration: 120.0,
                rechargeDebuff: 0.3,
                recoveryDebuff: 0.3,
                movementDebuff: 0.3
            }
        },
        {
            name: "Enervating Field",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: [],
            description: "While this power is active, you irradiate a targeted foe, and all foes nearby, with a deadly dose of radiation. This radiation weakens exposed targets, decreasing the damage of their attacks. It also significantly weakens their resistance, so they will take much more damage from other attacks.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Ranged (Targeted AoE), Foe -DMG, -Res",
            icon: "radiationpoisoning_radiationinfection.png",
            powerType: "Toggle",
            targetType: "Foe",
            effectArea: "AoE",
            maxTargets: 16,
            radius: 15.0,
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 8.0,
                endurance: 0.26,
                cast: 1.5,
                resistanceDebuff: 4.0,
                duration: 0.75
            }
        },
        {
            name: "Mutation",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Endurance Modification"],
            description: "Using a concentrated burst of radiation, you can revive a fallen hero and Mutate them into a killing machine. The Mutated hero has increased damage, chance to hit, Endurance recovery, and attack speed and is protected from XP Debt fort 90 seconds. The entire experience is very taxing on the Mutated hero, and they will soon be severely weakened. All effects of the Mutation will eventually wear off.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Close, Ally Rez, Special",
            icon: "radiationpoisoning_mutation.png",
            powerType: "Click",
            targetType: "Player Ally (Dead)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 15.0,
                recharge: 180.0,
                endurance: 26.0,
                cast: 3.2,
                healing: 1.0,
                recoveryDebuff: 2.0,
                rechargeDebuff: 1.0,
                duration: 90.0,
                tohitDebuff: 3.0
            }
        },
        {
            name: "Lingering Radiation",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Slow Movement"],
            description: "You can emit Lingering Radiation that reduces the attack rate, movement speed, and Regeneration rate of the target, and all nearby foes.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Ranged (Targeted AoE), Foe -Speed, -Recharge, -Regen",
            icon: "radiationpoisoning_lingeringradiation.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            radius: 25.0,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 1.5,
                movementDebuff: 1.0,
                duration: 30.0,
                rechargeDebuff: 0.6,
                regenerationDebuff: 20.0
            }
        },
        {
            name: "Choking Cloud",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Holds"],
            description: "While active, you generate toxic radioactive gas around yourself. Any nearby foes may be overcome by the gas, leaving them choking and helpless.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Toggle: PBAoE, Foe Hold",
            icon: "radiationpoisoning_chokingcloud.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            radius: 15.0,
            effects: {
                accuracy: 1.0,
                recharge: 20.0,
                endurance: 1.3,
                cast: 1.0,
                hold: 2.0
            }
        },
        {
            name: "Fallout",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Accurate To-Hit Debuff", "Defense Debuff", "Ranged AoE Damage", "To Hit Debuff", "Universal Damage Sets"],
            description: "After an ally falls in battle, you can activate this power to extract the energy from their body to deal a massive amount of Energy damage to any nearby foes. All affected foes are extremely weakened by the Fallout, and their chance to hit, Defense, Damage and Damage Resistance is severely reduced.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Post-Defeat: PBAoE, Extreme DMG(Energy), Foe -To Hit, -DEF, -DMG, -Res(All)",
            icon: "radiationpoisoning_fallout.png",
            powerType: "Click",
            targetType: "Leaguemate (Dead)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 300.0,
                endurance: 20.8,
                cast: 3.2,
                damage: {
                    type: "Energy",
                    scale: 29.23
                },
                tohitDebuff: 2.4,
                duration: 30.0,
                defenseDebuff: 2.4,
                resistanceDebuff: 3.75
            }
        },
        {
            name: "EM Pulse",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Endurance Modification", "Holds"],
            description: "You can unleash a massive pulse of electromagnetic energy. This EMP can affect machines, and is even powerful enough to affect synaptic brain patterns. It will drain the Endurance and HP Regeneration of all affected targets and leave them incapacitated and Held for a long while. Additionally, most machines and robots will take moderate high damage. However, this power uses a lot of Endurance and leaves you unable to recover Endurance for a while.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "PBAoE, Foe Hold, -END, -Regen, Special vs. Robots; Self -Recovery",
            icon: "radiationpoisoning_emppulse.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            radius: 60.0,
            effects: {
                accuracy: 1.0,
                recharge: 300.0,
                endurance: 20.8,
                cast: 2.93,
                damage: {
                    type: "Energy",
                    scale: 1.64
                },
                hold: 3.0,
                regenerationDebuff: 30.0,
                recoveryDebuff: 10.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['radiation-emission'] = RADIATION_EMISSION_POWERSET;
} else if (typeof window !== 'undefined') {
    window.RADIATION_EMISSION_POWERSET = RADIATION_EMISSION_POWERSET;
}