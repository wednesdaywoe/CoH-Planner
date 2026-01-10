/**
 * Bio Organic Armor
 * Character Level: 50
 * Archetype: stalker
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const STALKER_BIO_ORGANIC_ARMOR_POWERSET = {
    name: "Bio Organic Armor",
    category: "Unknown",
    description: "Bio Organic Armor powerset",
    icon: "bio-organic-armor_set.png",
    powers: [
        {
            name: "Defensive Adaptation",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become dense and durable. While active Hardened Carapace grants additional resistance to Lethal, Smashing and Toxic damage, Boundless Energy grants additional Maximum HP, Environmental Modification grants additional defense and also grants a small amount of Maximum HP, Ablative Carapace grants additional damage absorption, DNA Siphon grants additional health per target hit and Parasitic Aura grants additional damage absorption per target hit. Genetic Corruption will also grant a small amount of additional damage resistance and increase the potency of the power's damage debuff. Additionally, many of your damaging attacks will heal you for a minor amount of health. However, the bulkiness of this adaptation reduces your damage moderately. Defensive Adaptation costs no endurance.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Bio Armor Defensive Mode",
            icon: "bioorganicarmor_defensiveadaptation.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 1.0,
                buffDuration: 1.1
            }
        },
        {
            name: "Efficient Adaptation",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become evenly distributed along your body. While active Hardened Carapace grants a minor Endurance Discount, Boundless Energy grants additional regeneration and recovery, Ablative Carapace grants a bonus to regeneration and both DNA Siphon and Parasitic Aura grant increased regeneration and recovery and Genetic Corruption grants a minor regeneration buff. Efficient Adaptation costs no endurance.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Bio Armor Efficient Mode",
            icon: "bioorganicarmor_efficientadaptation.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.67,
                buffDuration: 1.1
            }
        },
        {
            name: "Offensive Adaptation",
            available: -1,
            tier: 2,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to sprout spines and become much lighter. While active Hardened Carapace increases your damage slightly, Environmental Modification grants you a moderate to hit buff, and debuff effects from DNA Siphon and Parasitic Aura are increased moderately. Genetic Corruption will have its chance to put enemies to sleep increased. Additionally, many of your damaging powers will inflict a minor amount of additional Toxic damage. While Offensive Adaptation is active your Defense and Damage Resistance is reduced slightly. Offensive Adaptation costs no endurance.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: Bio Armor Offensive Mode",
            icon: "bioorganicarmor_offensiveadaptation.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                cast: 0.67,
                resistance: {
                    smashing: -0.075,
                    lethal: -0.075,
                    fire: -0.075,
                    cold: -0.075,
                    energy: -0.075,
                    negative: -0.075,
                    psionic: -0.075,
                    toxic: -0.075
                },
                buffDuration: 1.1
            }
        },
        {
            name: "Hardened Carapace",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Resist Damage"],
            description: "With a little concentration you can cause your skin to become hard as stone, boosting your constitution to reject toxins and recovering from wounds more quickly. While active, this power will boost your resistance to Lethal, Smashing and Toxic damage, grant a minor amount of regeneration, and protection from Disorient and Sleep effects. If Efficient Adaptation is active, Hardened Carapace will grant an Endurance Discount. If Defensive Adaptation is active, Hardened Carapace will grant additional resistance to Lethal, Smashing and Toxic damage. While Offensive Adaptation is active, this power will grant a minor boost to damage. Bonuses granted from Adaptations are unenhanceable.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Self Toggle, +Res(Lethal, Smash, Toxic, Disorient, Sleep), +Special",
            icon: "bioorganicarmor_hardenedskin.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.67,
                protection: {
                    stun: 10.379999999999999,
                    sleep: 10.379999999999999
                },
                resistance: {
                    smashing: 0.056249999999999994,
                    lethal: 0.056249999999999994,
                    toxic: 0.056249999999999994
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75
            }
        },
        {
            name: "Hide",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Hide makes you almost impossible to detect. When properly 'Hidden\", a Stalker can pull off Critical hits with his attacks, and even land a massive 'Assassins Strike' with an Assassins power. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense. Unlike most stealth powers, Hide can be used at the same time as other Concealment powers, giving you even greater stealth capability. No Endurance cost.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
            icon: "bioorganicarmor_hide.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                cast: 0.73,
                buffDuration: 0.75
            }
        },
        {
            name: "Boundless Energy",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "Your body constantly evolves and addresses weaknesses. As a result you receive a moderate bonus to maximum hit points, regeneration, recovery as well as gaining a measure of Slow and Endurance Drain Resistance. Half of this power's maximum hit point increase is unenhanceable. While Efficient Adaptation is active, this power grants a small bonus to recovery and regeneration. While Defensive Adaptation is active you gain a small amount of additional maximum hit points. This power doesn't grant any bonuses to Offensive Adaptation. These special bonuses are unenhanceable. Boundless Energy is always active.",
            shortHelp: "Auto: +Max HP, +Regen, +Recovery, +Res(Slow, End Drain), +Special",
            icon: "bioorganicarmor_inexhaustible.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    endurance: 0.692,
                    recharge: 0.3,
                    movement: 0.3
                },
                buffDuration: 5.25
            }
        },
        {
            name: "Environmental Modification",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Your body can spontaneously adapt to its surroundings and your mind has learned to shield itself from harmful effects by constant exposure to these dangers. While active you gain moderate defense to Fire, Cold, Energy and Negative Energy damage, and a small amount of defense to Psionic damage. Additionally you are protected against hold, knockdown and immobilize effects. While Defensive Adaptation is active you gain a minor amount of Lethal, Smashing, Fire, Cold, Energy, Negative Energy and Psionic defense, as well as a minor amount of maximum hit points. If Offensive Adaptation is active you'll gain a moderate To Hit bonus. These special bonuses are unenhanceable.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Self Toggle, +Res(Hold, Knockdown, Immobilize), +Def(Energy, Negative, Fire, Cold, Psionic), +Special",
            icon: "bioorganicarmor_environmentalmodification.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 2.0,
                endurance: 0.13,
                cast: 0.73,
                protection: {
                    hold: 10.379999999999999,
                    immobilize: 10.379999999999999
                },
                buffDuration: 0.75,
                tohitBuff: 0.75
            }
        },
        {
            name: "Adaptation",
            available: 15,
            tier: 4,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "By purchasing this power you gain access to three mutually exclusive toggle powers: Efficient Adaptation, Defensive Adaptation and Offensive Adaptation. If Defensive Adaptation is active you gain improved damage resistance from Hardened Carapace and Genetic Corruption, additional defense from Environmental Modification, and increased Maximum HP from Environmental Modification and Boundless Energy. If Offensive Adaptation is active you gain bonus damage from Hardened Carapace, additional To Hit from Environmental Modification, empowered debuff effects from DNA Siphon, and Parasitic Aura and increased sleep chance from Genetic Corruption. While Efficient Adaptation is active Hardened Carapace will provide a moderate endurance discount, Boundless Energy has increased Regeneration and Recovery, Genetic Corruption grants additional regeneration, DNA Siphon grants additional regeneration and recovery for each defeated target and Parasitic Aura grants additional regeneration and recovery for each nearby target.",
            shortHelp: "Gain Efficient, Defensive and Offensive Adaptations",
            icon: "bioorganicarmor_adaptation.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0
            }
        },
        {
            name: "Ablative Carapace",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "When needed, you're able to cause your Bio Armor to gain a thick, but brittle outer layer that will absorb a large amount of damage before breaking off. Ablative Carapace will grant a moderate amount of damage absorption and a high amount of regeneration for a short time. While Efficient Adaptation is active, this power grants a slightly larger regeneration buff. While Defensive Adaptation is active, this power grants a bonus to damage absorption.<br><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Self, +Absorption, +Regeneration",
            icon: "bioorganicarmor_ablativecarapace.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 2.03,
                buffDuration: 30.0
            }
        },
        {
            name: "DNA Siphon",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Endurance Modification", "Healing", "Melee AoE Damage", "Stalker Archetype Sets", "Universal Damage Sets"],
            description: "You can siphon genetic material from nearby enemies, causing a minor amount of Lethal damage and a minor amount of Toxic damage over time. Living enemies will provide the user with a small boost to health and endurance. These foes will have their regeneration rate reduced for a short period of time. Defeated enemies provide a weaker sample of material and thus will boost recovery and regeneration for a short while. While Efficient Adaptation is active, this power will grant bonus regeneration and recovery per defeated target hit. While Defensive Adaptation is active, this power will grant bonus health per living target hit. While Offensive Adaptation is active this power's regeneration debuff is increased in effectiveness.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Click, PBAoE Minor DMG(Lethal/Toxic) Foe -Regen, Taunt, Self +HP, +End, +Special",
            icon: "bioorganicarmor_dnasiphon.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 13.0,
                cast: 1.67,
                damage: {
                    type: "Lethal",
                    scale: 0.2
                },
                dotDamage: {
                    type: "Toxic",
                    scale: 0.1,
                    ticks: 2
                },
                healing: {
                    scale: 45.178462499999995,
                    perTarget: true
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Genetic Corruption",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Sleep", "Recharge", "Accuracy"],
            allowedSetCategories: ["Sleep"],
            description: "Your Bio Armor is capable of corrupting the genetic code of nearby foes, reducing the damage they deal. Lesser foes may be put to sleep for a short time. While Efficiency Adaptation is active, this power grants a moderate bonus to Regeneration. While Defensive Adaptation is active you gain a minor bonus to all types of damage resistance and increase the potency of this power's damage debuff. If Offensive Adaptation is active enemies are more likely to fall asleep. These special bonuses are unenhanceable.<br><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Toggle: PBAoE, Foe Sleep, -Damage(All), Self +Special",
            icon: "bioorganicarmor_geneticcorruption.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                recharge: 4.0,
                endurance: 2.08,
                cast: 1.07,
                dotDamage: {
                    types: [
                        {
                            type: "Fire",
                            scale: 1.0,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 1.0,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 1.0,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 1.0,
                            ticks: 2
                        },
                        {
                            type: "Psionic",
                            scale: 1.0,
                            ticks: 2
                        },
                        {
                            type: "Smashing",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.75,
                            ticks: 2
                        },
                        {
                            type: "Toxic",
                            scale: 0.75,
                            ticks: 2
                        }
                    ]
                },
                resistance: {
                    smashing: 0.056249999999999994,
                    lethal: 0.056249999999999994,
                    toxic: 0.056249999999999994,
                    fire: 0.075,
                    cold: 0.075,
                    energy: 0.075,
                    negative: 0.075,
                    psionic: 0.075
                },
                buffDuration: 4.25
            }
        },
        {
            name: "Parasitic Aura",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Endurance Modification", "Healing"],
            description: "You release a cloud of parasites around you that draw out your enemies' genetic material. These parasites dramatically increase your survivability by gaining damage absorption while boosting your regeneration and recovery rate for a short time. Affected foes will be infected and deal reduced damage for a short while. While Efficient Adaptation is active, this power will grant additional regeneration and recovery per target hit. While Defensive Adaptation is active, this power will grant a small amount of additional damage absorption and increase the effectiveness of this power's damage debuff.<br><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "PBAoE, Self +Absorb, +Regeneration, +Recovery, Foe -DMG",
            icon: "bioorganicarmor_parasiticaura.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.5,
                recharge: 270.0,
                endurance: 18.2,
                cast: 1.87,
                buffDuration: 45.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['stalker/bio-organic-armor'] = STALKER_BIO_ORGANIC_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.STALKER_BIO_ORGANIC_ARMOR_POWERSET = STALKER_BIO_ORGANIC_ARMOR_POWERSET;
}