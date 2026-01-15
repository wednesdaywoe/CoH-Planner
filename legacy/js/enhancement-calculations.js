/**
 * City of Heroes: Enhancement Calculation System
 * 
 * Calculates enhancement bonuses with ED (Enhancement Diversification)
 * Uses data from Maths.txt for ED thresholds and IO effectiveness
 */

// ============================================
// ED THRESHOLDS (from Maths.txt)
// ============================================

const ED_THRESHOLDS = {
    // Schedule A (most common: Damage, Accuracy, Endurance Reduction, etc.)
    A: {
        threshold1: 0.70,  // 70% - First diminishing return kicks in
        threshold2: 0.90,  // 90% - Second diminishing return
        threshold3: 1.00,  // 100% - Third diminishing return
        multiplier1: 0.15, // Returns above threshold1 multiply by this
        multiplier2: 0.15, // Returns above threshold2 multiply by this
        multiplier3: 0.15  // Returns above threshold3 multiply by this
    },
    // Schedule B (Defense, Resistance, etc.)
    B: {
        threshold1: 0.40,
        threshold2: 0.50,
        threshold3: 0.60,
        multiplier1: 0.15,
        multiplier2: 0.15,
        multiplier3: 0.15
    },
    // Schedule C (ToHit Buff, Recharge, etc.)
    C: {
        threshold1: 0.80,
        threshold2: 1.00,
        threshold3: 1.20,
        multiplier1: 0.15,
        multiplier2: 0.15,
        multiplier3: 0.15
    },
    // Schedule D (Heal, Absorb, etc.)
    D: {
        threshold1: 1.20,
        threshold2: 1.50,
        threshold3: 1.80,
        multiplier1: 0.15,
        multiplier2: 0.15,
        multiplier3: 0.15
    }
};

// Map aspect types to ED schedules
const ASPECT_ED_SCHEDULE = {
    'Damage': 'A',
    'Accuracy': 'A',
    'Endurance Reduction': 'A',
    'Range': 'A',
    'Recharge Reduction': 'C',
    'Defense Buff': 'B',
    'Defense Debuff': 'A',
    'Resist Damage': 'B',
    'Healing': 'D',
    'To Hit Buff': 'C',
    'To Hit Debuff': 'A',
    'Hold Duration': 'A',
    'Immobilize Duration': 'A',
    'Stun Duration': 'A',
    'Sleep Duration': 'A',
    'Fear Duration': 'A',
    'Confuse Duration': 'A',
    'Slow': 'A',
    'Knockback Distance': 'A',
    'Run Speed': 'A',
    'Flight Speed': 'A',
    'Jumping': 'A'
};

// ============================================
// IO EFFECTIVENESS BY LEVEL (from Maths.txt)
// ============================================

const IO_EFFECTIVENESS = {
    // Schedule A values
    A: {
        10: 0.117, 15: 0.192, 20: 0.256, 25: 0.320, 30: 0.348,
        35: 0.367, 40: 0.386, 45: 0.405, 50: 0.424, 53: 0.435
    },
    // Schedule B values
    B: {
        10: 0.070, 15: 0.115, 20: 0.154, 25: 0.192, 30: 0.209,
        35: 0.220, 40: 0.232, 45: 0.243, 50: 0.255, 53: 0.261
    },
    // Schedule C values
    C: {
        10: 0.140, 15: 0.231, 20: 0.308, 25: 0.385, 30: 0.418,
        35: 0.441, 40: 0.464, 45: 0.486, 50: 0.509, 53: 0.523
    },
    // Schedule D values
    D: {
        10: 0.210, 15: 0.346, 20: 0.462, 25: 0.577, 30: 0.627,
        35: 0.661, 40: 0.695, 45: 0.730, 50: 0.764, 53: 0.784
    }
};

// ============================================
// ENHANCEMENT VALUE CALCULATION
// ============================================

/**
 * Get IO effectiveness value for a given level and schedule
 * @param {number} level - Enhancement level (10-53)
 * @param {string} schedule - ED schedule ('A', 'B', 'C', 'D')
 * @returns {number} Effectiveness value
 */
function getIOEffectiveness(level, schedule = 'A') {
    // Clamp level to valid range
    level = Math.max(10, Math.min(53, level));
    
    // Find closest level in table
    const levels = [10, 15, 20, 25, 30, 35, 40, 45, 50, 53];
    let closestLevel = levels[0];
    for (const l of levels) {
        if (l <= level) closestLevel = l;
    }
    
    return IO_EFFECTIVENESS[schedule][closestLevel];
}

/**
 * Parse IO set piece values
 * Example: "Acc/Dmg/Rech" returns { Accuracy: 31.8%, Damage: 31.8%, Recharge: 31.8% }
 * @param {string} values - Value string from IO set piece
 * @param {number} level - Set level
 * @returns {Object} Parsed bonuses by aspect
 */
function parseIOSetPieceValues(values, level = 50) {
    const bonuses = {};
    
    if (!values) return bonuses;
    
    // Split by / or comma
    const parts = values.split(/[\/,]/).map(v => v.trim());
    
    // Common IO set piece patterns
    const aspectMap = {
        'Acc': 'Accuracy',
        'Dmg': 'Damage',
        'Rech': 'Recharge Reduction',
        'End': 'Endurance Reduction',
        'Heal': 'Healing',
        'Def': 'Defense Buff',
        'Res': 'Resist Damage',
        'ToHit': 'To Hit Buff',
        'Range': 'Range'
    };
    
    // Map short names to full names
    const aspects = parts.map(p => aspectMap[p] || p);
    
    // Each aspect gets equal share
    aspects.forEach(aspect => {
        const schedule = ASPECT_ED_SCHEDULE[aspect] || 'A';
        const value = getIOEffectiveness(level, schedule);
        bonuses[aspect] = value;
    });
    
    return bonuses;
}

/**
 * Calculate Common IO value by level
 * @param {number} level - IO level (10-53)
 * @param {string} aspect - Aspect name
 * @returns {number} Bonus value (0.0 - 1.0)
 */
function calculateCommonIOValue(level, aspect = 'Damage') {
    const schedule = ASPECT_ED_SCHEDULE[aspect] || 'A';
    return getIOEffectiveness(level, schedule);
}

// ============================================
// ED (ENHANCEMENT DIVERSIFICATION) APPLICATION
// ============================================

/**
 * Apply ED to a total bonus value
 * @param {number} totalBonus - Sum of all enhancements (0.0 - X.X)
 * @param {string} schedule - ED schedule ('A', 'B', 'C', 'D')
 * @returns {number} ED-modified bonus
 */
function applyED(totalBonus, schedule = 'A') {
    const thresholds = ED_THRESHOLDS[schedule];
    
    if (totalBonus <= thresholds.threshold1) {
        // Below first threshold - no ED
        return totalBonus;
    } else if (totalBonus <= thresholds.threshold2) {
        // Between threshold 1 and 2
        const base = thresholds.threshold1;
        const excess = totalBonus - thresholds.threshold1;
        return base + (excess * thresholds.multiplier1);
    } else if (totalBonus <= thresholds.threshold3) {
        // Between threshold 2 and 3
        const tier1 = thresholds.threshold1;
        const tier2Excess = (thresholds.threshold2 - thresholds.threshold1) * thresholds.multiplier1;
        const tier3Excess = (totalBonus - thresholds.threshold2) * thresholds.multiplier2;
        return tier1 + tier2Excess + tier3Excess;
    } else {
        // Above threshold 3
        const tier1 = thresholds.threshold1;
        const tier2Excess = (thresholds.threshold2 - thresholds.threshold1) * thresholds.multiplier1;
        const tier3Excess = (thresholds.threshold3 - thresholds.threshold2) * thresholds.multiplier2;
        const tier4Excess = (totalBonus - thresholds.threshold3) * thresholds.multiplier3;
        return tier1 + tier2Excess + tier3Excess + tier4Excess;
    }
}

/**
 * Calculate total enhancement bonus for a specific aspect in a power
 * @param {Object} power - Power from build with slots
 * @param {string} aspect - Aspect to calculate (e.g., 'Damage', 'Accuracy')
 * @returns {number} Total bonus with ED applied (0.0 - X.X)
 */
function calculateAspectBonus(power, aspect) {
    if (!power || !power.slots) return 0;
    
    let totalBonus = 0;
    
    power.slots.forEach(slot => {
        if (!slot) return;
        
        if (slot.type === 'io-set') {
            // IO Set piece
            const set = IO_SETS[slot.setId];
            if (!set) return;
            
            const piece = set.pieces.find(p => p.num === slot.pieceNum);
            if (!piece || !piece.values) return;
            
            const bonuses = parseIOSetPieceValues(piece.values, set.maxLevel);
            if (bonuses[aspect]) {
                totalBonus += bonuses[aspect];
            }
        } else if (slot.type === 'io-generic') {
            // Common IO
            if (slot.aspect === aspect) {
                const value = calculateCommonIOValue(slot.level, aspect);
                totalBonus += value;
            }
        } else if (slot.type === 'origin') {
            // TO/DO/SO
            if (slot.aspect === aspect) {
                totalBonus += slot.value;
            }
        } else if (slot.type === 'hamidon') {
            // Hamidon Origin enhancement
            const hami = HAMIDON_ENHANCEMENTS[slot.hamiType];
            if (hami && hami.aspects.includes(aspect)) {
                totalBonus += hami.value;
            }
        }
    });
    
    // Apply ED
    const schedule = ASPECT_ED_SCHEDULE[aspect] || 'A';
    return applyED(totalBonus, schedule);
}

/**
 * Calculate all enhancement bonuses for a power
 * @param {Object} power - Power from build
 * @returns {Object} Bonuses by aspect
 */
function calculatePowerEnhancementBonuses(power) {
    const bonuses = {
        damage: calculateAspectBonus(power, 'Damage'),
        accuracy: calculateAspectBonus(power, 'Accuracy'),
        recharge: calculateAspectBonus(power, 'Recharge Reduction'),
        endurance: calculateAspectBonus(power, 'Endurance Reduction'),
        range: calculateAspectBonus(power, 'Range')
    };
    
    return bonuses;
}
