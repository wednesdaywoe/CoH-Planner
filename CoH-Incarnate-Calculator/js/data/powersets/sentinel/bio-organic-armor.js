/**
 * Bio Organic Armor
 * Character Level: 50
 * Archetype: sentinel
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const SENTINEL_BIO_ORGANIC_ARMOR_POWERSET = {
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
            description: "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become dense and durable. While active Hardened Carapace grants additional resistance to Lethal, Smashing and Toxic damage, Inexhaustible grants additional Maximum HP, Environmental Adaptation grants additional defense and a small amount of Maximum HP, Ablative Carapace grants additional damage absorption, Rebuild DNA restores additional health, Athletic Regulation will make you more resistant to run and fly speed debuffs, Genomic Evolution will grant a small amount of additional damage resistance, Parasitic Leech grants additional damage absorption and increases the effectiveness of it's damage debuff. Additionally, many of your damaging attacks will heal you for a minor amount of health. However, the bulkiness of this adaptation reduces your damage moderately.<br><br>Defensive Adaptation costs no endurance.",
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
            description: "Efficient Adaptation<br><br>By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become evenly distributed along your body. While active Hardened Carapace grants a minor Endurance Discount, Inexhaustible and Parasitic Leech will grant additional regeneration and recovery, Ablative Carapace grants a bonus to regeneration, Rebuild DNA grants a massive bonus to recovery, Athletic Regulation will increase your run and flight speeds, and Genomic Evolution will increase your maximum endurance.<br><br>Efficient Adaptation costs no endurance.",
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
            description: "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to sprout spines and become much lighter. While active Hardened Carapace increases your damage slightly, Environmental Adaptation grants you a moderate to hit buff, Athletic Regulation will increase your run and flight speeds, Genomic Evolution grants a small range buff, and the regeneration debuff from Parasitic Leech will be increased. Additionally, many of your damaging powers will inflict a minor amount of additional Toxic damage. While Offensive Adaptation is active your Defense and Damage Resistance is reduced slightly.<br><br>Offensive Adaptation costs no endurance.",
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
            description: "With a little concentration you can cause your skin to become hard as stone, boosting your constitution to reject toxins. While active, this power will boost your resistance to Lethal, Smashing and Toxic damage, and grant protection to Disorient and Sleep effects.<br><br><color #fac39b>*While Offensive Adaptation is active, this power will grant a minor boost to damage.</color><br><color #9efa9b>*While Defensive Adaptation is active, Hardened Carapace will grant additional resistance to Lethal, Smashing and Toxic damage.</color><br><color #9bfafa>*While Efficient Adaptation is active, Hardened Carapace will grant an Endurance Discount.</color><br><br>Bonuses granted from Adaptations are unenhanceable.",
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
                    stun: 8.304,
                    sleep: 8.304
                },
                resistance: {
                    smashing: 0.052500000000000005,
                    lethal: 0.052500000000000005,
                    toxic: 0.052500000000000005
                },
                buffDuration: 0.75,
                stun: 1.0,
                stunDuration: 0.75
            }
        },
        {
            name: "Inexhaustible",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "Your body constantly evolves and addresses weaknesses. As a result you receive a moderate bonus to maximum hit points, regeneration, and recovery, as well as gaining a measure of Slow and Endurance Drain Resistance. Half of this power's maximum hit point increase is unenhanceable.<br><br><color #fac39b>*This power doesn't grant any bonuses to Offensive Adaptation.</color><br><color #9efa9b>*While Defensive Adaptation is active you gain a small amount of additional maximum hit points.</color><br><color #9bfafa>*While Efficient Adaptation is active, this power grants a small bonus to recovery and regeneration.</color><br><br>Bonuses granted from Adaptations are unenhanceable.<br><br>This power is always active and costs no endurance.",
            shortHelp: "Auto: +Max HP, +Regen, +Recovery, +Res(Slow, End Drain), +Special",
            icon: "bioorganicarmor_inexhaustible.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    endurance: 0.5536,
                    recharge: 0.3,
                    movement: 0.3
                },
                buffDuration: 5.25
            }
        },
        {
            name: "Environmental Adaptation",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "Your body can spontaneously adapt to its surroundings and your mind has learned to shield itself from harmful effects by constant exposure to these dangers. While active you gain moderate defense to Fire, Cold, Energy and Negative Energy damage, and a small amount of defense to Psionic damage. Additionally you are protected against hold, knockdown and immobilize effects.<br><br><color #fac39b>*While Offensive Adaptation is active you'll gain a moderate To Hit bonus.</color><br><color #9efa9b>*While Defensive Adaptation is active you gain a minor amount of Lethal, Smashing, Fire, Cold, Energy, Negative Energy and Psionic defense, as well as a minor amount of maximum hit points.</color><br><color #9bfafa>*This power doesn't grant any bonuses to Efficient Adaptation.</color><br><br>These special bonuses are unenhanceable.",
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
                    hold: 8.304,
                    immobilize: 8.304
                },
                buffDuration: 0.75,
                tohitBuff: 0.75
            }
        },
        {
            name: "Adaptation",
            available: 9,
            tier: 3,
            maxSlots: 0,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "By purchasing this power you gain access to three mutually exclusive toggle powers: Efficient Adaptation, Defensive Adaptation and Offensive Adaptation.<br><br><color #fac39b>While Offensive Adaptation is active you gain bonus damage from Hardened Carapace, additional To Hit from Environmental Adaptation, increased run and flight speeds from Athletic Regulation, small range buff from Genomic Evolution, and increased regeneration debuff from Parasitic Leech.</color><br><br><color #9efa9b>While Defensive Adaptation is active you gain improved damage resistance from Hardened Carapace and Genomic Evolution, additional defense and increased Maximum HP from Environmental Adaptation, additional damage absorption from Ablative Carapace, gain run and fly speed debuff resistance from Athletic Regulation, and increased damage absorption and damage debuff from Parasitic Leech.</color><br><br><color #9bfafa>While Efficient Adaptation is active Hardened Carapace will provide a moderate endurance discount, Inexhaustible and Parasitic Leech has increased Regeneration and Recovery, Ablative Carapace grants additional regeneration, Rebuild DNA grants a massive bonus to recovery, Athletic Regulation increases your run and flight speeds, and Genomic Evolution will increase your max endurance</color>",
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
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "When needed, you're able to cause your Bio Armor to gain a thick, but brittle outer layer that will absorb a large amount of damage before breaking off. Ablative Carapace will grant a moderate amount of damage absorption and a high amount of regeneration for a short time.<br><br><color #fac39b>*This power doesn't grant any bonuses to Offensive Adaptation.</color><br><color #9efa9b>*While Efficient Adaptation is active, this power grants a slightly larger regeneration buff.</color><br><color #9bfafa>*While Defensive Adaptation is active, this power grants a bonus to damage absorption.</color><br><br>Bonuses granted from Adaptations are unenhanceable.",
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
            name: "Rebuild DNA",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "You rebuild your genetic makeup to restore some of your health and endurance.<br><br><color #fac39b>*While Offensive Adaptation is active, this power's will increase your perception.</color><br><color #9efa9b>*While Defensive Adaptation is active, this power will grant bonus health.</color><br><color #9bfafa>*While Efficient Adaptation is active, this power will grant bonus endurance.</color><br><br>Bonuses granted from Adaptations are unenhanceable.",
            shortHelp: "Self +HP, +End, +Special",
            icon: "bioorganicarmor_rebuilddna.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 13.0,
                cast: 0.73,
                healing: {
                    scale: 108.42831,
                    perTarget: true
                },
                buffDuration: 30.0
            }
        },
        {
            name: "Athletic Regulation",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: [],
            description: "Your body is continually regulating your athletic capabilities to best fit your current need. You also gain a small amount of defense debuff resistance.<br><br><color #fac39b>*While Offensive Adaptation is active you gain increased movement speed. </color><br><color #9efa9b>*While Defensive Adaptation is active you are more resistant to run and fly speed debuffs. </color><br><color #9bfafa>*While Efficient Adaptation is active all your run and fly powers have their speeds boosted.</color><br><br>Bonuses granted from Adaptations are unenhanceable.<br><br>This power is always on and permanently increases your movement speed, regardless your Adaptation.",
            shortHelp: "Auto: Self +SPD, +Special",
            icon: "bioorganicarmor_athleticaugmentation.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                debuffResistance: {
                    defense: 0.2076,
                    movement: 0.4
                },
                buffDuration: 2.25,
                defenseBuff: 0.75
            }
        },
        {
            name: "Genomic Evolution",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Damage", "Accuracy", "Recharge", "EnduranceReduction"],
            allowedSetCategories: ["Resist Damage"],
            description: "Your body has evolved to protect you from all damage types. As a result you receive a moderate bonus to damage resistance against all types.<br><br><color #fac39b>*While Offensive Adaptation is active you gain increased range buff.</color><br><color #9efa9b>*While Defensive Adaptation is active you gain a bonus to damage resistance.</color><br><color #9bfafa>*While Efficient Adaptation is active you gain a power bonus to your max endurance.</color><br><br>Bonuses granted from Adaptations are unenhanceable.<br><br>This power is always active and cost no endurance.",
            shortHelp: "Auto: +Res(All), +Special",
            icon: "bioorganicarmor_genomicevolution.png",
            powerType: "Auto",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                dotDamage: {
                    types: [
                        {
                            type: "Toxic",
                            scale: 1.3,
                            ticks: 2
                        },
                        {
                            type: "Smashing",
                            scale: 0.975,
                            ticks: 2
                        },
                        {
                            type: "Lethal",
                            scale: 0.975,
                            ticks: 2
                        },
                        {
                            type: "Psionic",
                            scale: 0.78,
                            ticks: 2
                        },
                        {
                            type: "Fire",
                            scale: 0.65,
                            ticks: 2
                        },
                        {
                            type: "Cold",
                            scale: 0.65,
                            ticks: 2
                        },
                        {
                            type: "Energy",
                            scale: 0.65,
                            ticks: 2
                        },
                        {
                            type: "Negative",
                            scale: 0.65,
                            ticks: 2
                        }
                    ]
                },
                resistance: {
                    smashing: 0.015750000000000004,
                    lethal: 0.015750000000000004,
                    fire: 0.0105,
                    cold: 0.0105,
                    energy: 0.0105,
                    negative: 0.0105,
                    psionic: 0.0126,
                    toxic: 0.021
                },
                buffDuration: 5.25
            }
        },
        {
            name: "Parasitic Leech",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Healing", "Endurance Modification", "Healing"],
            description: "You release a wave of parasites around you that draw out your enemies' genetic material. These parasites dramatically increase your survivability by gaining damage absorption while boosting your regeneration and recovery rate for a short time. Affected foes will be infected and have reduced regeneration for a short while.<br><br><color #fac39b>*While Offensive Adaptation is active, this power will apply a stronger regeneration debuff.</color><br><color #9efa9b>*While Defensive Adaptation is active, this power will grant a small amount of additional damage absorption and inflict a damage debuff.</color><br><color #9bfafa>*While Efficient Adaptation is active, this power will grant additional regeneration and recovery per target hit.</color>",
            shortHelp: "PBAoE, Self +Absorb, +Regeneration, +Recovery, Foe -DMG",
            icon: "bioorganicarmor_parasiticleech.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 5,
            arc: 1.5708,
            effects: {
                accuracy: 1.5,
                range: 40.0,
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
    POWERSETS['sentinel/bio-organic-armor'] = SENTINEL_BIO_ORGANIC_ARMOR_POWERSET;
} else if (typeof window !== 'undefined') {
    window.SENTINEL_BIO_ORGANIC_ARMOR_POWERSET = SENTINEL_BIO_ORGANIC_ARMOR_POWERSET;
}