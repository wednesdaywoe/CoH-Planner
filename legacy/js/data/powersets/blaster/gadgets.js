/**
 * Gadgets
 * Character Level: 50
 * Archetype: blaster
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const BLASTER_GADGETS_POWERSET = {
    name: "Gadgets",
    category: "Unknown",
    description: "Gadgets powerset",
    icon: "gadgets_set.png",
    powers: [
        {
            name: "Caltrops",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any villains that pass over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.<br><br><color #fcfc95>Damage: Minor(DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed",
            icon: "gadgets_caltrops.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 25.0,
                recharge: 45.0,
                endurance: 7.8,
                cast: 1.07,
                buffDuration: 45.0
            }
        },
        {
            name: "Toxic Web Grenade",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Immobilize", "Ranged Damage", "Slow Movement", "Universal Damage Sets"],
            description: "Upon impact, the Toxic Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize and corrode most targets, dealing moderate Toxic damage. This device does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
            shortHelp: "Ranged, Moderate DoT(Toxic), Target Immobilize, -Recharge, -Fly",
            icon: "gadgets_webgrenade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 60.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.37,
                dotDamage: {
                    type: "Toxic",
                    scale: 0.5038,
                    ticks: 4
                },
                buffDuration: 8.2
            }
        },
        {
            name: "Taser",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged Damage", "Stuns", "Universal Damage Sets"],
            description: "The High Voltage Taser is an overcharged stun-gun, releasing a high-voltage, high-amperage electrical charge that can Disorient most opponents with major tissue damage. The Taser has a very short range.<br><br><color #fcfc95>Damage: High.</color><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Melee, High DMG(Energy), Foe Disorient",
            icon: "gadgets_taser.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 20.0,
                recharge: 10.0,
                endurance: 10.192,
                cast: 1.0,
                damage: {
                    type: "Energy",
                    scale: 3.46
                },
                stun: 3.0
            }
        },
        {
            name: "Targeting Drone",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["To Hit Buff"],
            description: "When this device is activated, the small Targeting Drone hovers around your head and emits targeting laser sights. The lasers can dramatically improve your chance to hit, slightly increase the damage you deal, and increase your perception, allowing you to better see stealthy foes. If not engaged in combat, this power will give a large damage buff to your opening attack. Targeting Drone also grants you resistance to powers that debuff your chance to hit.<br><br><color #fcfc95>Recharge: Moderate.</color>",
            shortHelp: "Toggle: Self +To Hit, +Damage, +Perception, Res(DeBuff To Hit)",
            icon: "gadgets_targetingdrone.png",
            powerType: "Toggle",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 10.0,
                endurance: 0.156,
                cast: 1.17,
                buffDuration: 0.6,
                tohitBuff: 2.0
            }
        },
        {
            name: "Smoke Grenade",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["To Hit Debuff"],
            description: "The Smoke Grenade envelops all those in the affected area in a cloud of smoke. Most villains will not be able to see past normal melee range, although some may have better perception. If the villains are attacked, they will be alerted to your presence, but will suffer a penalty to their chance to hit.<br><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Ranged (Target AoE), Foe -Perception, -To Hit",
            icon: "gadgets_smokegrenade.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "AoE",
            maxTargets: 10,
            effects: {
                accuracy: 1.0,
                range: 80.0,
                recharge: 15.0,
                endurance: 7.8,
                cast: 1.37,
                tohitDebuff: 0.7,
                buffDuration: 60.0
            }
        },
        {
            name: "Field Operative",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Recharge"],
            allowedSetCategories: ["Defense Sets", "Endurance Modification", "Healing"],
            description: "Through a mixture of combat training and highly sophisticated devices you are considered a Field Operative. You use an LCD body coating to become partially invisible. While concealed you can only be seen at very close range. If you attack while concealed, you will be discovered. Even if discovered, you are hard to see but will retain some of your Defense bonus to all attacks. Unlike some stealth powers, Field Operative has no movement penalty. This power's stealth component will not work with any other form of Concealment power such as Shadow Fall or Steamy Mist. In addition to being stealthy, your training also allows you to regenerate health and recovery endurance at an accelerated rate while this power is active. However, only half of this regeneration bonus is enhanceable.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
            shortHelp: "Toggle: Self Stealth, +DEF(All), +Special, +Regeneration, +Recovery",
            icon: "gadgets_cloak.png",
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
            name: "Trip Mine",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can place a Trip Mine on the ground. Any villains that pass near the Trip Mine will cause it to explode, severely damaging all nearby foes and sending them flying. The Trip Mine is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trip Mine will detonate.<br><br><color #fcfc95>Damage: Superior.</color><br><color #fcfc95>Recharge: Slow.</color>",
            shortHelp: "Place Mine: PBAoE, Superior DMG(Lethal/Fire), Foe Knockback",
            icon: "gadgets_mine.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 30.0,
                endurance: 13.0,
                cast: 2.77,
                buffDuration: 260.0
            }
        },
        {
            name: "Remote Bomb",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can place a Remote Bomb on the ground. The Remote Bomb will detonate once the power is activated a second time, resulting in a massive explosion that can devastate all nearby foes and send them flying. If used while targeting an enemy in melee range, you can attach the Remote Bomb to them instead!<br><br>The Remote Bomb is small, and almost impossible to detect.<br><br><color #fcfc95>Damage: Extreme.</color><br><color #fcfc95>Recharge: Very Long.</color>",
            shortHelp: "Place Bomb: PBAoE, Extreme DMG(Lethal/Fire), Foe Knockback",
            icon: "gadgets_remotebomb.png",
            powerType: "Click",
            targetType: "Anything",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 2.0
            }
        },
        {
            name: "Gun Drone",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Blaster Archetype Sets", "Ranged Damage", "Recharge Intensive Pets", "Threat Duration", "Universal Damage Sets"],
            description: "You can summon a Gun Drone. The Drone has an extremely fast fire rate and is equipped with a customized tracking system. Once locked on, the Drone will continue to unload a volley of lead into the target until it is destroyed. Enemies hit by the drone, as well as those near it, will prioritize attacking it over it's owner. The Drone is armored, but can be destroyed.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Long.</color>",
            shortHelp: "Build Turret: Ranged, Moderate DMG(Lethal)",
            icon: "gadgets_turret.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                recharge: 180.0,
                endurance: 39.0,
                cast: 1.0,
                buffDuration: 90.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['blaster/gadgets'] = BLASTER_GADGETS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.BLASTER_GADGETS_POWERSET = BLASTER_GADGETS_POWERSET;
}