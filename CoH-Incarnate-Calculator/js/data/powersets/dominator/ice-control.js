/**
 * Ice Control
 * Character Level: 50
 * Archetype: dominator
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const DOMINATOR_ICE_CONTROL_POWERSET = {
    name: "Ice Control",
    category: "Unknown",
    description: "Ice Control powerset",
    icon: "ice-control_set.png",
    powers: [
        {
            name: "Block of Ice",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You can freeze a single foe in a Block of Ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be held, but all affected targets will be Slowed and take some Cold damage.",
            shortHelp: "Ranged, DMG(Cold), Foe Hold, -SPD, -Recharge",
            icon: "iceformation_blockofice.png",
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
                    type: "Cold",
                    scale: 3.0291
                },
                buffDuration: 18.0
            }
        },
        {
            name: "Chilblain",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Immobilizes your target in an icy trap, dealing some Cold damage over time as well as slightly slowing the target's attack and movement speed.",
            shortHelp: "Ranged, DoT (Cold), Foe Immobilize, -SPD, -Recharge",
            icon: "iceformation_chillblains.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                range: 80.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.17,
                dotDamage: {
                    type: "Cold",
                    scale: 0.4758,
                    ticks: 4
                },
                buffDuration: 9.2
            }
        },
        {
            name: "Frostbite",
            available: 1,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Immobilize", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Immobilizes a group of foes in icy traps. Deals minimal Cold damage over time and slightly Slows the targets. Slower and less damaging than Chilblain, but can capture multiple targets. More resilient foes may only be Slowed.",
            shortHelp: "Ranged (Targeted AoE), DoT (Cold), Foe Immobilize, -SPD, -Recharge",
            icon: "iceformation_frostbite.png",
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
                dotDamage: {
                    type: "Cold",
                    scale: 0.2301,
                    ticks: 2
                },
                buffDuration: 5.2
            }
        },
        {
            name: "Arctic Air",
            available: 5,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Confuse", "Dominator Archetype Sets", "Slow Movement"],
            description: "While this power is active, you are surrounded in a fog of Arctic Air that dramatically slows the attack and movement speed of nearby foes. The chill of Arctic Air is so bitter that many foes are forced to flee, albeit very slowly, from the immediate area. Others may attack their own allies, as the fog from the Arctic Air is thick and can cause much confusion. The cold air can also reduce the stealth capability of affected foes.",
            shortHelp: "Toggle: PBAoE, Foe Confuse(Special), -SPD, -Recharge, -Stealth",
            icon: "iceformation_articair.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                recharge: 15.0,
                endurance: 2.08,
                cast: 2.03,
                buffDuration: 2.25
            }
        },
        {
            name: "Cold Snap",
            available: 7,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Fear", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Fear", "Slow Movement"],
            description: "You blast forth a wide cone of chilling air that dramatically slows the enemies' movement and attack rate and might leave nearby foes trembling.<br><br><color #fcfc95>Notes: The Fear component applies only to enemies in the center area of effect.</color>",
            shortHelp: "Ranged (Cone), Foe Fear, -SPD, -Recharge",
            icon: "iceformation_shiver.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "Cone",
            maxTargets: 16,
            arc: 2.3562,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 40.0,
                endurance: 10.4,
                cast: 2.17,
                buffDuration: 18.0
            }
        },
        {
            name: "Ice Slick",
            available: 11,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Ranged AoE Damage", "Universal Damage Sets"],
            description: "You can create a large patch of ice at a targeted area, causing all foes that pass through it to lose their footing. Those caught in the Ice Slick are dramatically slowed, take cold damage over time, tend to fall down and will be unable to jump.",
            shortHelp: "Target (Location AoE), Foe DoT (Cold), Knockdown, -SPD",
            icon: "iceformation_iceslick.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 90.0,
                endurance: 10.4,
                cast: 1.67,
                buffDuration: 30.0
            }
        },
        {
            name: "Flash Freeze",
            available: 17,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Sleep", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Ranged AoE Damage", "Sleep", "Universal Damage Sets"],
            description: "You can Flash Freeze a large patch of ground beneath a targeted foe, instantly forming dozens of deadly ice shards that do Cold damage to all enemies in the area. The victims are left trapped within the icicles, but can break free if disturbed. Only targets near the ground can be affected.<br><br><color #fcfc95>Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.</color>",
            shortHelp: "Ranged (Targeted AoE), DMG(Cold), Foe Deep Sleep",
            icon: "iceformation_flashfreeze.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 45.0,
                endurance: 15.6,
                cast: 2.37,
                damage: {
                    type: "Cold",
                    scale: 0.2
                }
            }
        },
        {
            name: "Glacier",
            available: 21,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Dominator Archetype Sets", "Holds", "Slow Movement"],
            description: "You can freeze all foes around yourself in blocks of Glacial ice. The targets are frozen solid, helpless, and can be attacked. Even after the victims emerge, they remain chilled and their attack and movement speed is Slowed for a while. This power can only be cast near the ground.<br><br><color #fcfc95>Notes: This power has adaptive recharge. It has a base recharge of <color #FF7F27>8</color> seconds and each affected foe will increase the recharge by <color #FF7F27>14.5</color> seconds for a maximum total of <color #FF7F27>240</color> seconds.</color>",
            shortHelp: "PBAoE, Foe Hold, -Recharge, -SPD",
            icon: "iceformation_glacier.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "AoE",
            maxTargets: 16,
            effects: {
                accuracy: 0.8,
                recharge: 8.0,
                endurance: 8.528,
                cast: 2.03,
                buffDuration: 8.0
            }
        },
        {
            name: "Jack Frost",
            available: 25,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Pet Damage", "Recharge Intensive Pets", "Universal Damage Sets"],
            description: "You can create a very powerful entity of animated ice at a targeted location. Jack Frost possesses several ice powers to attack any nearby foes and can be healed and buffed like any teammate.",
            shortHelp: "Summon Jack Frost: Melee DMG(Lethal/Cold)",
            icon: "iceformation_jackfrost.png",
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
    POWERSETS['dominator/ice-control'] = DOMINATOR_ICE_CONTROL_POWERSET;
} else if (typeof window !== 'undefined') {
    window.DOMINATOR_ICE_CONTROL_POWERSET = DOMINATOR_ICE_CONTROL_POWERSET;
}