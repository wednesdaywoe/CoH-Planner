/**
 * City of Heroes: Homecoming - Powerset Definitions
 * 
 * Complete powerset data with individual power details
 */

const POWERSETS = {
    
    // ============================================
    // BLASTER PRIMARY: FIRE BLAST
    // ============================================
    
    'fire-blast': {
        name: 'Fire Blast',
        archetype: 'blaster',
        category: 'primary',
        type: 'ranged',
        description: 'Fire Blast is a potent offensive set focused on damage over time effects and area attacks.',
        
        powers: [
            {
                name: 'Flares',
                level: 1,
                tier: 1,
                available: 1, // Can be selected at level 1
                type: 'ranged-single',
                description: 'A quick attack that shoots flames at a single target.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance', 'range'],
                effects: {
                    damage: { type: 'fire', scale: 1.0 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    recharge: 4.0,
                    endurance: 5.2,
                    range: 80,
                    accuracy: 1.0
                }
            },
            {
                name: 'Fire Blast',
                level: 1,
                tier: 1,
                available: 1,
                type: 'ranged-single',
                description: 'Sends a blast of fire at a targeted foe and sets them ablaze.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance', 'range'],
                effects: {
                    damage: { type: 'fire', scale: 1.64 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    recharge: 8.0,
                    endurance: 8.53,
                    range: 80,
                    accuracy: 1.0
                }
            },
            {
                name: 'Fire Ball',
                level: 2,
                tier: 2,
                available: 2,
                type: 'ranged-aoe',
                description: 'Hurls an exploding Fireball that deals damage in an area.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance', 'range'],
                effects: {
                    damage: { type: 'fire', scale: 1.0 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    radius: 15,
                    maxTargets: 16,
                    recharge: 16.0,
                    endurance: 15.18,
                    range: 80,
                    accuracy: 1.0
                }
            },
            {
                name: 'Rain of Fire',
                level: 6,
                tier: 3,
                available: 6,
                type: 'location-aoe',
                description: 'Summons a rain of fire over a targeted location.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance', 'slow'],
                effects: {
                    damage: { type: 'fire', scale: 0.15, ticks: 15 },
                    radius: 25,
                    duration: 15,
                    recharge: 60.0,
                    endurance: 15.18,
                    range: 60,
                    accuracy: 1.0
                }
            },
            {
                name: 'Fire Breath',
                level: 8,
                tier: 4,
                available: 8,
                type: 'cone',
                description: 'Breathes forth a cone of fire that burns all foes within its narrow area.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance', 'range'],
                effects: {
                    damage: { type: 'fire', scale: 1.33 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    cone: { range: 40, arc: 30 },
                    maxTargets: 10,
                    recharge: 16.0,
                    endurance: 15.18,
                    accuracy: 1.0
                }
            },
            {
                name: 'Aim',
                level: 12,
                tier: 5,
                available: 12,
                type: 'self-buff',
                description: 'Greatly increases accuracy and damage for a short time.',
                maxSlots: 6,
                allowedEnhancements: ['recharge', 'tohit'],
                effects: {
                    tohitBuff: 0.2,
                    damageBuff: 0.625,
                    duration: 10.0,
                    recharge: 90.0,
                    endurance: 5.2,
                    accuracy: 1.0
                }
            },
            {
                name: 'Blaze',
                level: 18,
                tier: 6,
                available: 18,
                type: 'ranged-single',
                description: 'A short range but devastating attack that incinerates foes.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance', 'range'],
                effects: {
                    damage: { type: 'fire', scale: 2.76 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    recharge: 10.0,
                    endurance: 14.35,
                    range: 40,
                    accuracy: 1.0
                }
            },
            {
                name: 'Blazing Bolt',
                level: 26,
                tier: 7,
                available: 26,
                type: 'ranged-snipe',
                description: 'A long range sniper attack that deals massive fire damage.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance', 'range', 'interrupt'],
                effects: {
                    damage: { type: 'fire', scale: 3.56 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    interrupt: 4.0,
                    recharge: 12.0,
                    endurance: 14.35,
                    range: 150,
                    accuracy: 1.2
                }
            },
            {
                name: 'Inferno',
                level: 32,
                tier: 8,
                available: 32,
                type: 'pbaoe',
                description: 'Unleashes a massive fiery explosion around yourself.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance'],
                effects: {
                    damage: { type: 'fire', scale: 3.0 },
                    dotDamage: { type: 'fire', scale: 0.4, ticks: 3 },
                    radius: 25,
                    maxTargets: 16,
                    recharge: 360.0,
                    endurance: 20.8,
                    accuracy: 1.0
                }
            }
        ]
    },
    
    // ============================================
    // BLASTER SECONDARY: FIRE MANIPULATION
    // ============================================
    
    'fire-manipulation': {
        name: 'Fire Manipulation',
        archetype: 'blaster',
        category: 'secondary',
        type: 'manipulation',
        description: 'Fire Manipulation provides melee attacks, control powers, and utility abilities to complement ranged attacks.',
        
        powers: [
            {
                name: 'Ring of Fire',
                level: 1,
                tier: 1,
                available: 1,
                type: 'ranged-single',
                description: 'Immobilizes a single target in a ring of fire, dealing damage over time.',
                maxSlots: 6,
                allowedEnhancements: ['accuracy', 'recharge', 'endurance', 'immobilize', 'range'],
                effects: {
                    dotDamage: { type: 'fire', scale: 0.15, ticks: 10 },
                    immobilize: { magnitude: 3, duration: 14.9 },
                    recharge: 4.0,
                    endurance: 7.8,
                    range: 80,
                    accuracy: 1.0
                }
            },
            {
                name: 'Fire Sword',
                level: 1,
                tier: 1,
                available: 1,
                type: 'melee',
                description: 'Forms a sword of flame to strike down foes in melee.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance'],
                effects: {
                    damage: { type: 'fire', scale: 1.96 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    recharge: 8.0,
                    endurance: 8.53,
                    range: 7,
                    accuracy: 1.0
                }
            },
            {
                name: 'Combustion',
                level: 4,
                tier: 2,
                available: 4,
                type: 'pbaoe',
                description: 'Ignites yourself in flames, damaging all nearby enemies.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance'],
                effects: {
                    damage: { type: 'fire', scale: 1.0 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    radius: 8,
                    maxTargets: 10,
                    recharge: 16.0,
                    endurance: 13.0,
                    accuracy: 1.0
                }
            },
            {
                name: 'Cauterize',
                level: 10,
                tier: 3,
                available: 10,
                type: 'self-heal',
                description: 'Uses fire to cauterize wounds and heal yourself.',
                maxSlots: 6,
                allowedEnhancements: ['healing', 'recharge', 'endurance'],
                effects: {
                    heal: { scale: 0.25 }, // 25% max HP
                    recharge: 60.0,
                    endurance: 13.0,
                    interrupt: 2.03,
                    accuracy: 1.0
                }
            },
            {
                name: 'Build Up',
                level: 16,
                tier: 4,
                available: 16,
                type: 'self-buff',
                description: 'Greatly increases your damage and to-hit for a short time.',
                maxSlots: 6,
                allowedEnhancements: ['recharge', 'tohit'],
                effects: {
                    tohitBuff: 0.2,
                    damageBuff: 0.8,
                    duration: 10.0,
                    recharge: 90.0,
                    endurance: 5.2,
                    accuracy: 1.0
                }
            },
            {
                name: 'Consume',
                level: 20,
                tier: 5,
                available: 20,
                type: 'pbaoe',
                description: 'Drains endurance from nearby foes to restore your own.',
                maxSlots: 6,
                allowedEnhancements: ['accuracy', 'recharge', 'endurance'],
                effects: {
                    enduranceDrain: 10.0,
                    enduranceGain: 7.5, // per target hit
                    radius: 10,
                    maxTargets: 10,
                    recharge: 180.0,
                    endurance: 13.0,
                    accuracy: 1.0
                }
            },
            {
                name: 'Hot Feet',
                level: 28,
                tier: 6,
                available: 28,
                type: 'toggle-aura',
                description: 'Creates burning patches around your feet that damage and fear nearby foes.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'endurance', 'fear', 'slow'],
                effects: {
                    damage: { type: 'fire', scale: 0.13, tickRate: 0.5 },
                    fear: { magnitude: 2, duration: 8.0 },
                    runSpeedDebuff: -0.3,
                    radius: 10,
                    endurancePerSecond: 0.52,
                    accuracy: 1.0
                }
            },
            {
                name: 'Fire Sword Circle',
                level: 35,
                tier: 7,
                available: 35,
                type: 'pbaoe',
                description: 'Swings a fire sword in a wide arc, damaging all nearby enemies.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance'],
                effects: {
                    damage: { type: 'fire', scale: 1.0 },
                    dotDamage: { type: 'fire', scale: 0.2, ticks: 3 },
                    radius: 10,
                    maxTargets: 10,
                    recharge: 20.0,
                    endurance: 18.51,
                    accuracy: 1.0
                }
            },
            {
                name: 'Burn',
                level: 41,
                tier: 8,
                available: 41,
                type: 'location-aoe',
                description: 'Summons a patch of fire at a location that damages enemies.',
                maxSlots: 6,
                allowedEnhancements: ['damage', 'accuracy', 'recharge', 'endurance'],
                effects: {
                    damage: { type: 'fire', scale: 0.15, ticks: 25 },
                    fear: { magnitude: 2, duration: 5.0 },
                    radius: 15,
                    duration: 25,
                    recharge: 60.0,
                    endurance: 15.6,
                    range: 60,
                    accuracy: 1.0
                }
            }
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POWERSETS };
}
