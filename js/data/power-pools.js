/**
 * City of Heroes - Power Pool Definitions
 * 
 * Power Pool Structure:
 * - Rank 1-2: Available at level 4 (when pools unlock)
 * - Rank 3: Requires 1 power from pool + level requirement
 * - Rank 4: Requires 2 powers from pool + level requirement
 */

const POWER_POOLS = {
    'flight': {
        name: 'Flight',
        id: 'flight',
        icon: 'flight',
        powers: [
            {
                name: 'Hover',
                rank: 1,
                available: 4,
                type: 'toggle',
                description: 'You hover slowly through the air, granting increased defense while attacking.',
                allowedEnhancements: ['Defense Buff', 'Endurance Reduction', 'Flight Speed'],
                effects: {
                    defense: 0.025,
                    flySpeed: 0.5,
                    endurance: 0.18
                }
            },
            {
                name: 'Air Superiority',
                rank: 2,
                available: 4,
                type: 'melee',
                description: 'A melee attack that can knock flying foes from the sky.',
                allowedEnhancements: ['Accuracy', 'Damage Increase', 'Endurance Reduction', 'Recharge Reduction'],
                effects: {
                    damage: { type: 'smashing', scale: 1.0 },
                    knockup: { magnitude: 2 },
                    accuracy: 1.0,
                    recharge: 4,
                    endurance: 5.2
                }
            },
            {
                name: 'Fly',
                rank: 3,
                available: 14,
                prerequisiteCount: 1,
                type: 'toggle',
                description: 'Fly through the air at high speed.',
                allowedEnhancements: ['Flight Speed', 'Endurance Reduction'],
                effects: {
                    flySpeed: 1.0,
                    endurance: 0.65
                }
            },
            {
                name: 'Group Fly',
                rank: 4,
                available: 20,
                prerequisiteCount: 2,
                type: 'toggle-aura',
                description: 'Grant flight to nearby allies.',
                allowedEnhancements: ['Flight Speed', 'Endurance Reduction'],
                effects: {
                    flySpeed: 0.8,
                    radius: 60,
                    endurance: 0.78
                }
            }
        ]
    },
    
    'speed': {
        name: 'Speed',
        id: 'speed',
        icon: 'speed',
        powers: [
            {
                name: 'Hasten',
                rank: 1,
                available: 4,
                type: 'self-buff',
                description: 'Greatly increase your recharge speed for 120 seconds.',
                allowedEnhancements: ['Recharge Reduction'],
                effects: {
                    rechargeBuff: 0.70,
                    duration: 120,
                    recharge: 450,
                    endurance: 5.2
                }
            },
            {
                name: 'Flurry',
                rank: 2,
                available: 4,
                type: 'melee',
                description: 'Pummel your foe with a flurry of rapid punches.',
                allowedEnhancements: ['Accuracy', 'Damage Increase', 'Endurance Reduction', 'Recharge Reduction'],
                effects: {
                    damage: { type: 'smashing', scale: 1.32 },
                    accuracy: 1.0,
                    recharge: 8,
                    endurance: 8.528
                }
            },
            {
                name: 'Super Speed',
                rank: 3,
                available: 14,
                prerequisiteCount: 1,
                type: 'toggle',
                description: 'Run at super speed.',
                allowedEnhancements: ['Run Speed', 'Endurance Reduction'],
                effects: {
                    runSpeed: 1.0,
                    endurance: 0.26
                }
            },
            {
                name: 'Burnout',
                rank: 4,
                available: 20,
                prerequisiteCount: 2,
                type: 'self-buff',
                description: 'Immediately recharge all powers (long recharge).',
                allowedEnhancements: ['Recharge Reduction'],
                effects: {
                    recharge: 600,
                    endurance: 0
                }
            }
        ]
    },
    
    'leaping': {
        name: 'Leaping',
        id: 'leaping',
        icon: 'leaping',
        powers: [
            {
                name: 'Combat Jumping',
                rank: 1,
                available: 4,
                type: 'toggle',
                description: 'Jump while in combat, providing defense and immobilize protection.',
                allowedEnhancements: ['Defense Buff', 'Endurance Reduction', 'Jumping'],
                effects: {
                    defense: 0.025,
                    immobilizeProtection: 10.38,
                    jumpHeight: 1.0,
                    endurance: 0.065
                }
            },
            {
                name: 'Jump Kick',
                rank: 2,
                available: 4,
                type: 'melee',
                description: 'A jumping kick that deals damage and knockback.',
                allowedEnhancements: ['Accuracy', 'Damage Increase', 'Endurance Reduction', 'Recharge Reduction'],
                effects: {
                    damage: { type: 'smashing', scale: 1.0 },
                    knockback: { magnitude: 2 },
                    accuracy: 1.0,
                    recharge: 6,
                    endurance: 6.864
                }
            },
            {
                name: 'Super Jump',
                rank: 3,
                available: 14,
                prerequisiteCount: 1,
                type: 'toggle',
                description: 'Jump great heights and distances.',
                allowedEnhancements: ['Jumping', 'Endurance Reduction'],
                effects: {
                    jumpHeight: 2.0,
                    endurance: 0.065
                }
            },
            {
                name: 'Acrobatics',
                rank: 4,
                available: 20,
                prerequisiteCount: 2,
                type: 'toggle',
                description: 'Provides protection from holds and knockback.',
                allowedEnhancements: ['Endurance Reduction'],
                effects: {
                    holdProtection: 10.38,
                    knockbackProtection: 12,
                    endurance: 0.26
                }
            }
        ]
    },
    
    'fighting': {
        name: 'Fighting',
        id: 'fighting',
        icon: 'fighting',
        powers: [
            {
                name: 'Boxing',
                rank: 1,
                available: 4,
                type: 'melee',
                description: 'A quick punch that has a chance to disorient.',
                allowedEnhancements: ['Accuracy', 'Damage Increase', 'Endurance Reduction', 'Recharge Reduction', 'Disorient Duration'],
                effects: {
                    damage: { type: 'smashing', scale: 0.84 },
                    stun: { magnitude: 2, chance: 0.2, duration: 5.96 },
                    accuracy: 1.0,
                    recharge: 3,
                    endurance: 5.2
                }
            },
            {
                name: 'Kick',
                rank: 2,
                available: 4,
                type: 'melee',
                description: 'A strong kick with knockback.',
                allowedEnhancements: ['Accuracy', 'Damage Increase', 'Endurance Reduction', 'Recharge Reduction', 'Knockback Distance'],
                effects: {
                    damage: { type: 'smashing', scale: 1.0 },
                    knockback: { magnitude: 2 },
                    accuracy: 1.0,
                    recharge: 6,
                    endurance: 6.864
                }
            },
            {
                name: 'Tough',
                rank: 3,
                available: 14,
                prerequisiteCount: 1,
                type: 'toggle',
                description: 'Provides resistance to smashing and lethal damage.',
                allowedEnhancements: ['Resist Damage', 'Endurance Reduction'],
                effects: {
                    resistance: { smashing: 0.15, lethal: 0.15 },
                    endurance: 0.26
                }
            },
            {
                name: 'Weave',
                rank: 4,
                available: 20,
                prerequisiteCount: 2,
                type: 'toggle',
                description: 'Provides defense to melee, ranged, and AoE attacks.',
                allowedEnhancements: ['Defense Buff', 'Endurance Reduction'],
                effects: {
                    defense: { melee: 0.05, ranged: 0.05, aoe: 0.05 },
                    endurance: 0.26
                }
            }
        ]
    },
    
    'leadership': {
        name: 'Leadership',
        id: 'leadership',
        icon: 'leadership',
        powers: [
            {
                name: 'Maneuvers',
                rank: 1,
                available: 4,
                type: 'toggle-aura',
                description: 'Provides defense bonus to nearby allies.',
                allowedEnhancements: ['Defense Buff', 'Endurance Reduction'],
                effects: {
                    defense: { melee: 0.035, ranged: 0.035, aoe: 0.035 },
                    radius: 60,
                    endurance: 0.26
                }
            },
            {
                name: 'Assault',
                rank: 2,
                available: 4,
                type: 'toggle-aura',
                description: 'Provides damage bonus to nearby allies.',
                allowedEnhancements: ['Endurance Reduction'],
                effects: {
                    damageBuff: 0.10,
                    radius: 60,
                    endurance: 0.26
                }
            },
            {
                name: 'Tactics',
                rank: 3,
                available: 14,
                prerequisiteCount: 1,
                type: 'toggle-aura',
                description: 'Provides accuracy and perception bonus to nearby allies.',
                allowedEnhancements: ['To Hit Buff', 'Endurance Reduction'],
                effects: {
                    tohitBuff: 0.07,
                    radius: 60,
                    endurance: 0.26
                }
            },
            {
                name: 'Vengeance',
                rank: 4,
                available: 20,
                prerequisiteCount: 2,
                type: 'pbaoe',
                description: 'Grant bonuses to nearby allies when a team member is defeated.',
                allowedEnhancements: ['Defense Buff', 'To Hit Buff', 'Recharge Reduction'],
                effects: {
                    defense: 0.15,
                    tohitBuff: 0.20,
                    damageBuff: 0.25,
                    duration: 90,
                    radius: 30,
                    recharge: 300,
                    endurance: 15.6
                }
            }
        ]
    },
    
    'concealment': {
        name: 'Concealment',
        id: 'concealment',
        icon: 'concealment',
        powers: [
            {
                name: 'Stealth',
                rank: 1,
                available: 4,
                type: 'toggle',
                description: 'Become stealthy, reducing enemy perception range.',
                allowedEnhancements: ['Defense Buff', 'Endurance Reduction'],
                effects: {
                    stealth: 35,
                    defense: { melee: 0.0125, ranged: 0.0125, aoe: 0.0125 },
                    endurance: 0.26
                }
            },
            {
                name: 'Grant Invisibility',
                rank: 2,
                available: 4,
                type: 'ally-buff',
                description: 'Grant invisibility to an ally.',
                allowedEnhancements: ['Defense Buff', 'Endurance Reduction', 'Recharge Reduction'],
                effects: {
                    stealth: 55,
                    defense: 0.025,
                    duration: 120,
                    recharge: 3,
                    endurance: 5.2
                }
            },
            {
                name: 'Invisibility',
                rank: 3,
                available: 14,
                prerequisiteCount: 1,
                type: 'toggle',
                description: 'Become invisible (cannot attack while active).',
                allowedEnhancements: ['Defense Buff', 'Endurance Reduction'],
                effects: {
                    stealth: 55,
                    defense: 0.025,
                    endurance: 0.26
                }
            },
            {
                name: 'Phase Shift',
                rank: 4,
                available: 20,
                prerequisiteCount: 2,
                type: 'toggle',
                description: 'Become intangible and untargetable (cannot attack).',
                allowedEnhancements: ['Endurance Reduction'],
                effects: {
                    intangible: true,
                    endurance: 0.65
                }
            }
        ]
    },
    
    'medicine': {
        name: 'Medicine',
        id: 'medicine',
        icon: 'medicine',
        powers: [
            {
                name: 'Aid Other',
                rank: 1,
                available: 4,
                type: 'ally-heal',
                description: 'Heal a targeted ally.',
                allowedEnhancements: ['Healing', 'Endurance Reduction', 'Recharge Reduction', 'Interrupt Decrease'],
                effects: {
                    heal: { scale: 1.46 },
                    interrupt: 2.0,
                    recharge: 10,
                    endurance: 13
                }
            },
            {
                name: 'Stimulant',
                rank: 2,
                available: 4,
                type: 'ally-buff',
                description: 'Free an ally from sleep, hold, stun, immobilize, and fear.',
                allowedEnhancements: ['Recharge Reduction', 'Interrupt Decrease'],
                effects: {
                    mezzProtection: true,
                    interrupt: 1.5,
                    recharge: 4,
                    endurance: 7.8
                }
            },
            {
                name: 'Aid Self',
                rank: 3,
                available: 14,
                prerequisiteCount: 1,
                type: 'self-heal',
                description: 'Heal yourself.',
                allowedEnhancements: ['Healing', 'Endurance Reduction', 'Recharge Reduction', 'Interrupt Decrease'],
                effects: {
                    heal: { scale: 1.46 },
                    interrupt: 2.0,
                    recharge: 30,
                    endurance: 13
                }
            },
            {
                name: 'Resuscitate',
                rank: 4,
                available: 20,
                prerequisiteCount: 2,
                type: 'ally-rez',
                description: 'Revive a defeated ally.',
                allowedEnhancements: ['Healing', 'Endurance Reduction', 'Recharge Reduction', 'Interrupt Decrease'],
                effects: {
                    resurrect: true,
                    heal: { scale: 0.5 },
                    interrupt: 3.0,
                    recharge: 300,
                    endurance: 26
                }
            }
        ]
    }
};
