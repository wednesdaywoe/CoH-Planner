/**
 * City of Heroes Planner - Enhancement Value Parsing
 * 
 * Parse IO set piece values and calculate enhancement bonuses
 */

/**
 * Parse IO set piece aspects into enhancement bonuses
 * IO pieces use an 'aspects' array with full names like "ToHit Debuff"
 * Each aspect uses its own schedule (A, B, C, or D)
 * 
 * Multi-aspect modifier (game balance):
 * - 1 aspect: 100% of base value
 * - 2 aspects: 70% of base value per aspect
 * - 3+ aspects: 50% of base value per aspect
 * 
 * @param {Array} aspects - Array of aspect names (e.g., ["ToHit Debuff", "Accuracy"])
 * @param {number} level - IO level (10-53)
 * @returns {Object} Enhancement bonuses by aspect
 */
function parseIOSetPieceValues(aspects, level = 50) {
    if (!aspects || !Array.isArray(aspects)) {
        console.warn('parseIOSetPieceValues: No aspects array provided');
        return {};
    }
    
    console.log('Parsing IO piece aspects:', aspects, 'at level', level);
    
    const bonuses = {};
    
    // Multi-aspect modifier (game balance)
    const aspectCount = aspects.length;
    let modifier = 1.0;
    if (aspectCount === 2) {
        modifier = 0.70; // Dual-aspect: 70% per aspect
    } else if (aspectCount >= 3) {
        modifier = 0.50; // Triple+: 50% per aspect
    }
    
    // Each aspect gets the schedule's value modified by aspect count
    aspects.forEach(aspect => {
        const normalized = normalizeAspectName(aspect);
        if (normalized) {
            const schedule = getAspectSchedule(normalized);
            const baseValue = getIOValueAtLevel(level, schedule);
            const value = baseValue * modifier;
            bonuses[normalized] = value;
            console.log(`  ${aspect} (${normalized}) -> Schedule ${schedule} = ${(baseValue * 100).toFixed(1)}% × ${modifier} = ${(value * 100).toFixed(1)}%`);
        } else {
            console.warn('Could not normalize aspect:', aspect);
        }
    });
    
    console.log('Parsed bonuses:', bonuses);
    return bonuses;
}

/**
 * Get the enhancement schedule for a given aspect
 * Based on official City of Heroes enhancement schedules
 * 
 * Schedule A: Most aspects (33.33% SO)
 * Schedule B: Defense Buff, Range, Resist Damage, ToHit Buff/Debuff (20% SO)
 * Schedule C: Interrupt Time (40% SO)
 * Schedule D: Knockback (60% SO)
 * 
 * @param {string} normalizedAspect - Normalized aspect key
 * @returns {string} Schedule letter ('A', 'B', 'C', or 'D')
 */
function getAspectSchedule(normalizedAspect) {
    // Schedule A: Accuracy, Confusion, Damage, Defense Debuff, Endurance Modification, 
    // Endurance Reduction, Fear, Fly, Healing, Hold Duration, Immobilization Duration, 
    // Jumping, Recharge Time, Run Speed, Sleep, Slow, Stun, Taunt
    const scheduleA = [
        'accuracy', 'confuse', 'damage', 'defenseDebuff', 'endurance', 'enduranceMod',
        'fear', 'fly', 'heal', 'hold', 'immobilize', 'jump', 'recharge', 'run',
        'sleep', 'slow', 'stun', 'taunt'
    ];
    
    // Schedule B: Defense Buff, Range Increase, Resist Damage, To Hit Buff, To Hit Debuff
    const scheduleB = ['defenseBuff', 'range', 'resistance', 'tohit', 'tohitBuff', 'tohitDebuff'];
    
    // Schedule C: Interrupt Time
    const scheduleC = ['interrupt'];
    
    // Schedule D: Knockback Distance
    const scheduleD = ['knockback'];
    
    if (scheduleA.includes(normalizedAspect)) return 'A';
    if (scheduleB.includes(normalizedAspect)) return 'B';
    if (scheduleC.includes(normalizedAspect)) return 'C';
    if (scheduleD.includes(normalizedAspect)) return 'D';
    
    console.warn('Unknown aspect schedule for:', normalizedAspect, '- defaulting to A');
    return 'A'; // Default schedule
}

/**
 * Get IO enhancement value at a specific level for a given schedule
 * Based on Maths.txt "Level-Based IO Effectiveness" table
 * 
 * @param {number} level - IO level (10-53)
 * @param {string} schedule - Schedule letter ('A', 'B', 'C', or 'D')
 * @returns {number} Enhancement value (as decimal)
 */
function getIOValueAtLevel(level, schedule = 'A') {
    // From Maths.txt - Level-Based IO Effectiveness
    const scheduleValues = {
        'A': {
            10: 0.117, 15: 0.192, 20: 0.256, 25: 0.320, 30: 0.348,
            35: 0.367, 40: 0.386, 45: 0.405, 50: 0.424, 53: 0.435
        },
        'B': {
            10: 0.070, 15: 0.115, 20: 0.154, 25: 0.192, 30: 0.209,
            35: 0.220, 40: 0.232, 45: 0.243, 50: 0.255, 53: 0.261
        },
        'C': {
            10: 0.140, 15: 0.231, 20: 0.308, 25: 0.385, 30: 0.418,
            35: 0.441, 40: 0.464, 45: 0.486, 50: 0.509, 53: 0.523
        },
        'D': {
            10: 0.210, 15: 0.346, 20: 0.462, 25: 0.577, 30: 0.627,
            35: 0.661, 40: 0.695, 45: 0.730, 50: 0.764, 53: 0.784
        }
    };
    
    const ioValues = scheduleValues[schedule] || scheduleValues['A'];
    
    // Clamp level to valid range
    level = Math.max(10, Math.min(53, level));
    
    // If exact level exists, return it
    if (ioValues[level]) {
        return ioValues[level];
    }
    
    // Otherwise interpolate between levels
    const lowerLevel = Math.floor(level / 5) * 5;
    const upperLevel = lowerLevel + 5;
    const ratio = (level - lowerLevel) / 5;
    
    return ioValues[lowerLevel] + (ioValues[upperLevel] - ioValues[lowerLevel]) * ratio;
}

/**
 * Normalize aspect names from IO pieces to internal keys
 * Handles both abbreviations (Acc, Dmg) and full names (Accuracy, ToHit Debuff)
 * 
 * @param {string} aspect - Aspect name from IO piece
 * @returns {string|null} Normalized aspect key
 */
function normalizeAspectName(aspect) {
    // Trim whitespace
    aspect = aspect.trim();
    
    const map = {
        // Abbreviations
        'Acc': 'accuracy',
        'Dmg': 'damage',
        'Dam': 'damage',
        'Rech': 'recharge',
        'EndRdx': 'endurance',
        'EndMod': 'enduranceMod',
        'Range': 'range',
        'Heal': 'heal',
        'Def': 'defense',
        'Res': 'resistance',
        'ToHit': 'tohit',
        'ToHitDeb': 'tohitDebuff',
        'DefDeb': 'defenseDebuff',
        'DefBuff': 'defenseBuff',
        'Hold': 'hold',
        'Stun': 'stun',
        'Immob': 'immobilize',
        'Sleep': 'sleep',
        'Confuse': 'confuse',
        'Fear': 'fear',
        'KB': 'knockback',
        'Slow': 'slow',
        
        // Full names (from aspects array)
        'Accuracy': 'accuracy',
        'Damage': 'damage',
        'Recharge': 'recharge',
        'Endurance': 'endurance',
        'End Reduction': 'endurance',
        'Endurance Discount': 'endurance',
        'Endurance Modification': 'enduranceMod',
        'Healing': 'heal',
        'Defense': 'defense',
        'Defense Buff': 'defenseBuff',
        'Defense Debuff': 'defenseDebuff',
        'Resist Damage': 'resistance',
        'Resistance': 'resistance',
        'ToHit Buff': 'tohit',
        'To Hit Buff': 'tohit',
        'ToHit Debuff': 'tohitDebuff',
        'To Hit Debuff': 'tohitDebuff',
        'Hold Duration': 'hold',
        'Stun Duration': 'stun',
        'Immobilization Duration': 'immobilize',
        'Sleep': 'sleep',
        'Sleep Duration': 'sleep',
        'Confuse': 'confuse',
        'Confusion': 'confuse',
        'Confuse Duration': 'confuse',
        'Fear': 'fear',
        'Fear Duration': 'fear',
        'Knockback': 'knockback',
        'Knockback Distance': 'knockback',
        'Slow': 'slow',
        'Snare': 'slow',
        'Range': 'range',
        'Range Increase': 'range',
        'Fly': 'fly',
        'Run Speed': 'run',
        'Jumping': 'jump',
        'Jump': 'jump',
        'Taunt': 'taunt',
        'Interrupt Time': 'interrupt',
        'Activation Acceleration': 'interrupt'
    };
    
    return map[aspect] || null;
}

/**
 * Calculate total enhancement bonuses from slotted enhancements
 * Applies Enhancement Diversification (ED) limits
 * 
 * @param {Object} power - Power from build with slots array
 * @returns {Object} Bonuses by aspect with ED applied
 */
function calculatePowerEnhancementBonuses(power) {
    if (!power || !power.slots) {
        console.log('calculatePowerEnhancementBonuses: No power or slots');
        return {};
    }
    
    console.log('Calculating bonuses for power:', power.name, 'with', power.slots.length, 'slots');
    
    const rawBonuses = {};
    
    // Accumulate bonuses from all slots
    power.slots.forEach((slot, index) => {
        if (!slot) return;
        
        console.log(`  Slot ${index}: type=${slot.type}`);
        
        if (slot.type === 'io-set') {
            // Parse IO set piece values
            const set = IO_SETS[slot.setId];
            if (!set) {
                console.log(`  Set ${slot.setId} not found!`);
                return;
            }
            
            const piece = set.pieces.find(p => p.num === slot.pieceNum);
            if (!piece || !piece.aspects) {
                console.log(`  Piece ${slot.pieceNum} not found or no aspects`);
                return;
            }
            
            // Use global IO level or set's max level
            const ioLevel = Math.min(AppState.globalIOLevel || 50, set.maxLevel);
            const bonuses = parseIOSetPieceValues(piece.aspects, ioLevel);
            
            console.log(`  IO Set: ${set.name} - ${piece.name}`);
            console.log(`  Piece aspects: ${piece.aspects.join(', ')}`);
            console.log(`  Parsed bonuses:`, bonuses);
            
            // Add to raw bonuses
            Object.keys(bonuses).forEach(aspect => {
                rawBonuses[aspect] = (rawBonuses[aspect] || 0) + bonuses[aspect];
            });
            
        } else if (slot.type === 'io-generic') {
            // Common IO
            const aspect = slot.aspect;
            const value = slot.value / 100; // Convert percentage to decimal
            rawBonuses[aspect] = (rawBonuses[aspect] || 0) + value;
            
        } else if (slot.type === 'hamidon') {
            // Hamidon enhancements - 50% per aspect (0.50 or 50%)
            slot.aspects.forEach(aspectName => {
                const aspect = aspectName.toLowerCase().replace(/ /g, '');
                rawBonuses[aspect] = (rawBonuses[aspect] || 0) + 0.50;
            });
            
        } else if (slot.type === 'origin') {
            // TO/DO/SO
            const aspect = slot.aspect;
            const value = slot.value / 100; // Convert percentage to decimal
            rawBonuses[aspect] = (rawBonuses[aspect] || 0) + value;
        }
    });
    
    // Apply Enhancement Diversification
    const edBonuses = {};
    Object.keys(rawBonuses).forEach(aspect => {
        const schedule = getAspectSchedule(aspect);
        const rawValue = rawBonuses[aspect];
        const edValue = applyED(rawValue, schedule);
        edBonuses[aspect] = edValue;
        
        // Detailed logging for ToHit Debuff
        if (aspect === 'tohitDebuff') {
            console.log('=== ED Calculation for ToHit Debuff ===');
            console.log(`Raw value: ${(rawValue * 100).toFixed(2)}%`);
            console.log(`Schedule: ${schedule}`);
            console.log(`After ED: ${(edValue * 100).toFixed(2)}%`);
            console.log(`Enhancement factor: ${((1 + edValue) * 100).toFixed(2)}%`);
        }
    });
    
    console.log('Raw bonuses (before ED):', rawBonuses);
    console.log('Final bonuses (after ED):', edBonuses);
    
    return edBonuses;
}

/**
 * Apply Enhancement Diversification to a bonus value
 * ED reduces effectiveness of enhancements beyond certain thresholds
 * Different schedules have different ED thresholds (from Math.txt)
 * 
 * @param {number} value - Raw enhancement value (as decimal)
 * @param {string} schedule - Schedule letter ('A', 'B', 'C', or 'D')
 * @returns {number} Value after ED is applied
 */
function applyED(value, schedule = 'A') {
    // ED thresholds from Math.txt
    const thresholds = {
        'A': { t1: 0.70, t2: 0.90, t3: 1.00 },
        'B': { t1: 0.40, t2: 0.50, t3: 0.60 },
        'C': { t1: 0.80, t2: 1.00, t3: 1.20 },
        'D': { t1: 1.20, t2: 1.50, t3: 1.80 }
    };
    
    const { t1, t2, t3 } = thresholds[schedule] || thresholds['A'];
    
    if (value <= t1) {
        // No penalty
        return value;
    } else if (value <= t2) {
        // Slight penalty (90% effective)
        const result = t1 + (value - t1) * 0.90;
        if (schedule === 'B') {
            console.log(`  ED tier 1-2: ${(t1*100).toFixed(1)}% + (${((value-t1)*100).toFixed(1)}% × 0.90) = ${(result*100).toFixed(2)}%`);
        }
        return result;
    } else if (value <= t3) {
        // Moderate penalty (60% effective)
        const tier2 = t1 + (t2 - t1) * 0.90;
        const result = tier2 + (value - t2) * 0.60;
        if (schedule === 'B') {
            console.log(`  ED tier 1-2: ${(t1*100).toFixed(1)}% + (${((t2-t1)*100).toFixed(1)}% × 0.90) = ${(tier2*100).toFixed(2)}%`);
            console.log(`  ED tier 2-3: ${(tier2*100).toFixed(2)}% + (${((value-t2)*100).toFixed(1)}% × 0.60) = ${(result*100).toFixed(2)}%`);
        }
        return result;
    } else {
        // Heavy penalty (15% effective)
        const tier2 = t1 + (t2 - t1) * 0.90;
        const tier3 = tier2 + (t3 - t2) * 0.60;
        const result = tier3 + (value - t3) * 0.15;
        if (schedule === 'B') {
            console.log(`  ED tier 1-2: ${(t1*100).toFixed(1)}% + (${((t2-t1)*100).toFixed(1)}% × 0.90) = ${(tier2*100).toFixed(2)}%`);
            console.log(`  ED tier 2-3: ${(tier2*100).toFixed(2)}% + (${((t3-t2)*100).toFixed(1)}% × 0.60) = ${(tier3*100).toFixed(2)}%`);
            console.log(`  ED tier 3+: ${(tier3*100).toFixed(2)}% + (${((value-t3)*100).toFixed(1)}% × 0.15) = ${(result*100).toFixed(2)}%`);
        }
        return result;
    }
}

/**
 * Calculate actual debuff/buff value using archetype modifier
 * 
 * @param {number} scale - Scale value from power effects (e.g., 2.5)
 * @param {string} archetypeId - Archetype ID (e.g., 'defender')
 * @returns {number} Actual percentage value (e.g., 0.3125 for 31.25%)
 */
function calculateBuffDebuffValue(scale, archetypeId) {
    if (!scale || !archetypeId) return 0;
    
    const archetype = ARCHETYPES[archetypeId];
    if (!archetype) return scale * 10; // Fallback: assume 1.0 modifier
    
    const modifier = archetype.stats.buffDebuffModifier || 1.0;
    
    // Formula: scale * archetypeModifier * 10 = percentage value
    // Example: 2.5 * 1.25 * 10 = 31.25 (for display as 31.25%)
    return scale * modifier * 10;
}
