/**
 * Traps
 * Character Level: 50
 * Archetype: corruptor
 * Extracted from raw_data_homecoming with archetype modifiers applied
 */

const CORRUPTOR_TRAPS_POWERSET = {
    name: "Traps",
    category: "Unknown",
    description: "Traps powerset",
    icon: "traps_set.png",
    powers: [
        {
            name: "Caltrops",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Damage"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Ranged AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any enemy that pass over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.",
            shortHelp: "Ranged (Location AoE), DoT(Lethal), Foe -Speed",
            icon: "traps_droppedaoedebuffrunspeed.png",
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
            name: "Web Grenade",
            available: 0,
            tier: 1,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Range", "Recharge", "Accuracy"],
            allowedSetCategories: ["Immobilize", "Slow Movement"],
            description: "Upon impact, the Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize most targets. This non-lethal device deals no damage and does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.",
            shortHelp: "Ranged, Target Immobilize, -Recharge, -Fly",
            icon: "traps_targetedimmoblize.png",
            powerType: "Click",
            targetType: "Foe (Alive)",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                range: 70.0,
                recharge: 4.0,
                endurance: 7.8,
                cast: 1.37,
                buffDuration: 15.0
            }
        },
        {
            name: "Triage Beacon",
            available: 3,
            tier: 2,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Healing"],
            description: "You can plant a Triage Beacon into the ground. The Beacon is immobile, but it emits a powerful healing aura. The Regeneration Rate of you, or your allies, will be greatly increased as long as you are near the Triage Beacon. The Beacon is invulnerable.",
            shortHelp: "Place Beacon: PBAoE +Regen",
            icon: "traps_droppedaoebuffregen.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 200.0,
                endurance: 13.0,
                cast: 2.77,
                buffDuration: 90.0
            }
        },
        {
            name: "Acid Mortar",
            available: 9,
            tier: 3,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate Defense Debuff", "Corruptor Archetype Sets", "Defense Debuff", "Ranged Damage", "Universal Damage Sets"],
            description: "You can place a small Mortar on the ground. If an enemy passes nearby, the Mortar will fire an Acid grenade at the target. The grenade will explodes in a small shower of acid on impact. This acid eats through armor, causing minor damage over time. It reduces the target's Defense as well as his Damage Resistance. The mortar will last up to 60 seconds and will fire up to 10 grenades. It can be destroyed by your foes.<br>",
            shortHelp: "Place Trap: Ranged (AoE), DoT(Toxic), Foe -Res(All), -DEF",
            icon: "traps_droppedaoedebuffdefense.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 13.0,
                cast: 2.77,
                buffDuration: 60.0
            }
        },
        {
            name: "Force Field Generator",
            available: 15,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge"],
            allowedSetCategories: ["Defense Sets"],
            description: "You can build a Force Field Generator Drone. The Drone will generate a Dispersion Bubble that gives all nearby allies increased Defense against all attacks including Psionic. The Dispersion Bubble also protects allies from Immobilization, Disorient, and Hold effects. The Done will follow you and can be buffed and healed or even destroyed like any friendly entity. However, the Drone is not a Henchman and cannot be given commands. You can only ever have one Force Field Generator.<br>",
            shortHelp: "Place Drone: PBAoE, Team +DEF, +Res(Hold, Immobilize, Disorient)",
            icon: "traps_droppedaoebuffdefense.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.0,
                range: 20.0,
                recharge: 15.0,
                endurance: 13.0,
                cast: 2.03,
                buffDuration: 240.0
            }
        },
        {
            name: "Poison Trap",
            available: 19,
            tier: 4,
            maxSlots: 6,
            allowedEnhancements: ["Hold", "EnduranceReduction", "Recharge", "Accuracy"],
            allowedSetCategories: ["Holds"],
            description: "You can build a Poison Gas Trap on the ground. Any foes that pass near the Poison Trap will cause it to detonate and release its toxic vapors. The poison is a very noxious gas, and any foes in the affected area may start to choke or even vomit. Affected Foes Regeneration rate and attack rate will be reduced as well. The trap is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trap will detonate.<br>",
            shortHelp: "Place Trap: PBAoE Foe Choke, Vomit, -Regen, -Recharge",
            icon: "traps_droppedaoedebuffattackspeed.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.0,
                recharge: 90.0,
                endurance: 13.0,
                cast: 2.77,
                buffDuration: 260.0
            }
        },
        {
            name: "Seeker Drones",
            available: 23,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Range", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Accurate To-Hit Debuff", "Corruptor Archetype Sets", "Pet Damage", "Stuns", "To Hit Debuff", "Universal Damage Sets"],
            description: "You create two Seeker Drones. These Seeker Drones will follow you until they detect an enemy and then they will zero in on their targets and detonate on impact. The small explosive flash of energy does only minor damage, but the concussion can weaken foes. Affected targets will have reduced Damage, Accuracy and Perception and may even be Disoriented for a short while. You can only ever have Two Seeker Drones out at one time and they can be destroyed by your foes.<br>",
            shortHelp: "Summon Seekers: Ranged Disorient, -DMG, -ACC, -Perception, DMG(Energy)",
            icon: "traps_droppedaoedebuffdamage.png",
            powerType: "Click",
            targetType: "Location",
            effectArea: "Location",
            effects: {
                accuracy: 1.2,
                range: 60.0,
                recharge: 90.0,
                endurance: 15.6,
                cast: 2.03,
                buffDuration: 240.0
            }
        },
        {
            name: "Trip Mine",
            available: 27,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Knockback", "Melee AoE Damage", "Universal Damage Sets"],
            description: "You can place a Trip Mine on the ground. Any foes that pass near the Trip Mine will cause it to explode, severely damaging all nearby foes and sending them flying. The Trip Mine is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trip Mine will detonate. Setting a mine is delicate work, and if you are interrupted, you will fail.",
            shortHelp: "Place Mine: PBAoE, DMG(Lethal/Fire), Foe Knockback",
            icon: "traps_droppedaoedamage.png",
            powerType: "Click",
            targetType: "Self",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 1.2,
                recharge: 20.0,
                endurance: 13.0,
                cast: 5.0,
                buffDuration: 260.0
            }
        },
        {
            name: "Temporal Bomb",
            available: 29,
            tier: 5,
            maxSlots: 6,
            allowedEnhancements: ["Slow", "EnduranceReduction", "Recharge", "Damage", "Accuracy"],
            allowedSetCategories: ["Corruptor Archetype Sets", "Endurance Modification", "Knockback", "Melee AoE Damage", "Slow Movement", "Universal Damage Sets"],
            description: "You can place a Temporal Bomb on the ground. The Temporal Bomb will detonate once the power is activated a second time, resulting in a massive explosion that can damage all nearby foes and send them flying, as well as create a Temporal Bubble that speeds up yourself and allies, while slowing down all enemies inside. If used while targeting an enemy in melee range, you can attach the Temporal Bomb to them instead!<br><br>The Temporal Bomb is small, and almost impossible to detect.",
            shortHelp: "Place Bomb: PBAoE, DMG(Lethal/Fire), Foe Knockback, Special",
            icon: "traps_remotebomb.png",
            powerType: "Click",
            targetType: "Anything",
            effectArea: "SingleTarget",
            effects: {
                accuracy: 2.0
            }
        }
    ]
};

// Register to POWERSETS
if (typeof POWERSETS !== 'undefined') {
    POWERSETS['corruptor/traps'] = CORRUPTOR_TRAPS_POWERSET;
} else if (typeof window !== 'undefined') {
    window.CORRUPTOR_TRAPS_POWERSET = CORRUPTOR_TRAPS_POWERSET;
}