/**
 * City of Heroes Planner - Other Enhancements Library
 * 
 * Contains non-IO set enhancement data:
 * - Hamidon Origin enhancements (HOs)
 * - Common IO formulas
 * - TO/DO/SO tier data
 */

// ============================================
// HAMIDON ORIGIN ENHANCEMENTS
// ============================================

const HAMIDON_ENHANCEMENTS = {
    nucleolus: {
        name: 'Nucleolus Exposure',
        aspects: ['Damage', 'Accuracy'],
        value: 50 // +50% to each aspect
    },
    centriole: {
        name: 'Centriole Exposure',
        aspects: ['Damage', 'Range'],
        value: 50
    },
    enzyme: {
        name: 'Enzyme Exposure',
        aspects: ['ToHit Debuff', 'Defense Debuff'],
        value: 50
    },
    lysosome: {
        name: 'Lysosome Exposure',
        aspects: ['Accuracy', 'ToHit Debuff'],
        value: 50
    },
    membrane: {
        name: 'Membrane Exposure',
        aspects: ['ToHit Debuff', 'Recharge'],
        value: 50
    },
    peroxisome: {
        name: 'Peroxisome Exposure',
        aspects: ['Damage', 'Mez Duration'],
        value: 50
    }
};

// ============================================
// COMMON IO CALCULATION
// ============================================

/**
 * Calculate Common IO enhancement value based on level
 * @param {number} level - IO level (10-53)
 * @returns {number} Enhancement value as percentage
 */
function calculateCommonIOValue(level) {
    const baseValue = 0.256; // Level 25 base
    const levelBonus = (level - 25) * 0.004;
    return (baseValue + levelBonus) * 100;
}

const COMMON_IO_TYPES = [
    'damage',
    'accuracy',
    'recharge',
    'endurance',
    'range',
    'defense',
    'resistance',
    'healing',
    'tohit',
    'hold',
    'stun',
    'immobilize',
    'sleep',
    'confuse',
    'fear',
    'knockback',
    'run-speed',
    'jump',
    'fly'
];

// ============================================
// TO/DO/SO TIERS
// ============================================

const ORIGIN_TIERS = [
    {
        name: 'Training Origin',
        short: 'TO',
        value: 8.3,
        description: 'These are the least potent of all Enhancements.'
    },
    {
        name: 'Dual Origin',
        short: 'DO',
        value: 16.7,
        description: 'These are twice as potent as TO Enhancements, Limited to 2 specific Origins.'
    },
    {
        name: 'Single Origin',
        short: 'SO',
        value: 33.3,
        description: 'These are twice as potent as DO Enhancements. Limited to a single Origin.'
    }
];

const ORIGINS = [
    'Magic',
    'Mutation',
    'Natural',
    'Science',
    'Technology'
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HAMIDON_ENHANCEMENTS,
        calculateCommonIOValue,
        COMMON_IO_TYPES,
        ORIGIN_TIERS,
        ORIGINS
    };
}
