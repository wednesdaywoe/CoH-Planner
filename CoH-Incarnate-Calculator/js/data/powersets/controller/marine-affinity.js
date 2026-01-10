/**
 * Marine Affinity
 * Character Level: 50
 * Archetype: controller
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CONTROLLER_MARINE_AFFINITY_POWERSET = {
    name: "Marine Affinity",
    category: "Unknown",
    description: "Marine Affinity powerset",
    icon: "marine-affinity_set.png",
    powers: [
        {
            name: "Shoal Rush",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Defense Debuff", "Slow Movement"],
            description: "By sensing the water in an area, you can direct a shoal of marine life to harass your foes. This lowers the defense and movement speed of all enemies struck.<br><br>If you direct a Shoal Rush on targets inside a <color #fcfc95>Tide Pool</color>, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
            shortHelp: "Ranged (Targeted AoE), Foe -DEF, -SPD, Special",
            icon: "marineaffinity_shoalrush.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            arc: 1.5708,
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 15.0,
                endurance: 10.4,
                cast: 2.17,
                defenseDebuff: 1.6,
                buffDuration: 20.0
            }
        },
        {
            name: "Soothing Wave",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "Send forth a calming wave of water, washing over friend and foe alike. Allies will be healed by this power, while enemies will have their offensive power watered down.",
            shortHelp: "Ranged (Facing Cone), Foe -DMG, Team Heal",
            icon: "marineaffinity_soothingwave.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "Cone",
            maxTargets: 255,
            arc: 1.5708,
            effects: {
                accuracy: 1.0,
                range: 45.0,
                recharge: 10.0,
                endurance: 13.52,
                cast: 2.0
            }
        },
        {
            name: "Toroidal Bubble",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Leaping", "Leaping & Sprints", "Resist Damage", "Universal Travel"],
            description: "You create a ring of Bubbles that surrounds your allies, hydrating them to replenish endurance and reducing the effects of endurance drain. The bubble also reduces all incoming damage, providing extra resistance to Smashing and Fire damage, and also increases jump height thanks to added buoyancy.",
            shortHelp: "PBAoE, Team +Res(All DMG, End Drain), +End, +Recovery, +Jump",
            icon: "marineaffinity_toroidalbubble.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 60.0,
                endurance: 8.0,
                cast: 1.77,
                dotDamage: {
                    types: [
                        {
                            type: "Smashing",
                            scale: 2.5,
                            ticks: 30
                        },
                        {
                            type: "Fire",
                            scale: 2.5,
                            ticks: 30
                        },
                        {
                            type: "Lethal",
                            scale: 1.25,
                            ticks: 30
                        },
                        {
                            type: "Cold",
                            scale: 1.25,
                            ticks: 30
                        },
                        {
                            type: "Energy",
                            scale: 1.25,
                            ticks: 30
                        },
                        {
                            type: "Negative",
                            scale: 1.25,
                            ticks: 30
                        },
                        {
                            type: "Psionic",
                            scale: 1.25,
                            ticks: 30
                        },
                        {
                            type: "Toxic",
                            scale: 1.25,
                            ticks: 30
                        }
                    ]
                },
                buffDuration: 60.0
            }
        },
        {
            name: "Whitecap",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You summon a burst of water underfoot that hurls from your present location to a location of your choosing. When you splash down, any enemies in the surrounding area will be swept off their feet, and will experience a damage resistance debuff for a period of time. Enemies close to where you splash down will receive harsher debuffs for a brief time.<br><br>If you direct a Whitecap on targets inside a <color #fcfc95>Tide Pool</color>, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
            shortHelp: "Ranged (Targeted AoE), DMG(Cold), Foe Knockdown, -Resist(All), Self Teleport, Special",
            icon: "marineaffinity_whitecap.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 30.0,
                endurance: 18.0,
                cast: 2.0
            }
        },
        {
            name: "Tide Pool",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Slow Movement"],
            description: "You summon a large pool of water at a targeted location to swell the damage that your allies deal, while reducing the damage, movement speeds, and stealth of enemies within the Tide Pool. <br><br>If an enemy is <color #fcfc95>defeated</color> in the pool, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
            shortHelp: "Ranged (Location AoE), Team +DMG, Foe -DMG, -SPD, -Jump, -Stealth, Special",
            icon: "marineaffinity_tidepool.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 10.0,
                endurance: 13.0,
                cast: 2.33,
                buffDuration: 240.0
            }
        },
        {
            name: "Brine",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Accurate Healing"],
            description: "You coat an enemy in an extremely salinated layer of deep-sea brine that reduces your foe's resistance to damage and maximum hitpoints.<br><br>If <color #fcfc95>Shifting Tides</color> is active, Brine will consume up to <color #fcfc95>3</color> stacks upon use to reduce its base recharge by 15 seconds per stack.",
            shortHelp: "Ranged, Foe -Resist(All), -MaxHP",
            icon: "marineaffinity_brine.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 60.0,
                endurance: 7.0,
                cast: 2.07,
                buffDuration: 60.0
            }
        },
        {
            name: "Shifting Tides",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage"],
            allowedSetCategories: ["Ranged AoE Damage", "To Hit Buff", "Universal Damage Sets"],
            description: "Select either a friend or foe to create a field of shifting tides around them.<br><br>When attacked, foes within the shifting tides will provide you and your allies a stacking Rising Tide buff that increases ToHit, Damage, and Recharge. Enemies may also take bonus damage, with the odds increasing per stack.",
            shortHelp: "Toggle: Ranged (Targeted AoE), Team +DMG, +ToHit, +Recharge, Special Damage",
            icon: "marineaffinity_shiftingtides.png",
            powerType: "Toggle",
            targetType: "Any",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 0.078,
                cast: 1.17,
                damage: {
                    type: "Cold",
                    scale: 0.5
                },
                buffDuration: 2.0
            }
        },
        {
            name: "Barrier Reef",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge"],
            allowedSetCategories: ["Defense Sets", "Healing"],
            description: "Create a Barrier Reef teeming with life at your target location. The Barrier Reef will emit an aura that washes over allies in range, providing them with a defensive cover of water that will absorb and deflect some damage.",
            shortHelp: "Summon Barrier Reef: Team +Absorb, +DEF(All)",
            icon: "marineaffinity_wellspring.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 40.0,
                recharge: 30.0,
                endurance: 13.52,
                cast: 2.37,
                buffDuration: 240.0
            }
        },
        {
            name: "Power of the Depths",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Endurance Modification", "Healing"],
            description: "Becoming a conduit of the ocean itself, you acclimate your allies to the incredible forces of the deep! This boosts the maximum hit points, maximum endurance, regeneration, and attack range of all nearby allies. Some of these effects will decay over time to a lower value.<br><br>If Power of the Depths is activated inside a <color #fcfc95>Tide Pool</color>, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
            shortHelp: "PBAoE, Team +MaxHP, +MaxEnd, +Regen, +Range",
            icon: "marineaffinity_powerofthedepths.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 255,
            effects: {
                accuracy: 1.0,
                recharge: 240.0,
                endurance: 26.0,
                cast: 3.0,
                buffDuration: 60.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['controller/marine-affinity'] = CONTROLLER_MARINE_AFFINITY_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CONTROLLER_MARINE_AFFINITY_POWERSET = CONTROLLER_MARINE_AFFINITY_POWERSET;
}