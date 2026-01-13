/**
 * Power Enhancement Calculator
 * Calculates enhancement bonuses for individual powers based on slotted enhancements
 */

/**
 * Calculate enhancement bonuses for a specific power
 * @param {Object} power - Power object with slots
 * @returns {Object} Enhancement bonuses by aspect (as percentages)
 */
function calculatePowerEnhancementBonuses(power) {
    if (!power || !power.slots || power.slots.length === 0) {
        return {};
    }

    const bonuses = {};

    // Iterate through all slots
    power.slots.forEach(slot => {
        if (!slot.enhancement) return;

        // Calculate enhancement values (with ED curve already applied)
        const enhValues = calculateEnhancementValues(slot.enhancement, slot.level || 50);

        if (!enhValues) return;

        // Accumulate bonuses by aspect
        Object.entries(enhValues).forEach(([aspect, value]) => {
            if (typeof value === 'number' && value !== 0) {
                bonuses[aspect] = (bonuses[aspect] || 0) + value;
            }
        });
    });

    return bonuses;
}

/**
 * Calculate three-tier stats for a power (base, enhanced, final)
 * @param {Object} power - Power object
 * @param {Object} options - Calculation options
 * @returns {Object} Stats with base/enhanced/final values
 */
function calculatePowerStats(power, options = {}) {
    if (!power || !power.effects) {
        return {};
    }

    const stats = {};
    const enhancementBonuses = calculatePowerEnhancementBonuses(power);
    const globalBonuses = getRelevantBonusesForPower(power);

    // Map of effects to process
    const effectsToProcess = [
        { key: 'damage', base: power.effects.damage },
        { key: 'accuracy', base: power.effects.accuracy },
        { key: 'recharge', base: power.effects.recharge },
        { key: 'endurance', base: power.effects.endurance },
        { key: 'range', base: power.effects.range },
        { key: 'defense', base: power.effects.defense },
        { key: 'resistance', base: power.effects.resistance },
        { key: 'healing', base: power.effects.healing }
    ];

    effectsToProcess.forEach(({ key, base }) => {
        if (base === undefined || base === null) return;

        // Handle different types of values
        if (typeof base === 'object') {
            // Complex objects (damage with types, defense/resistance with types, etc.)
            stats[key] = calculateComplexStat(key, base, enhancementBonuses, globalBonuses);
        } else if (typeof base === 'number') {
            // Simple numeric values
            stats[key] = calculateSimpleStat(key, base, enhancementBonuses, globalBonuses);
        }
    });

    return stats;
}

/**
 * Calculate simple stat with three tiers
 * @param {string} aspect - Aspect name (damage, accuracy, etc.)
 * @param {number} baseValue - Base value
 * @param {Object} enhBonuses - Enhancement bonuses
 * @param {Object} globalBonuses - Global bonuses (set + active powers)
 * @returns {Object} Three-tier stat object
 */
function calculateSimpleStat(aspect, baseValue, enhBonuses, globalBonuses) {
    const enhBonus = enhBonuses[aspect] || 0;
    const globalBonus = globalBonuses[aspect] || 0;

    let enhanced, final;

    // Apply formulas based on aspect type
    switch (aspect) {
        case 'damage':
        case 'accuracy':
        case 'tohit':
            // Multiplicative: base * (1 + bonus%)
            enhanced = baseValue * (1 + enhBonus / 100);
            final = enhanced * (1 + globalBonus / 100);
            break;

        case 'endurance':
            // Reduction: base * (1 - reduction%)
            enhanced = baseValue * Math.max(0, 1 - enhBonus / 100);
            final = enhanced * Math.max(0, 1 - globalBonus / 100);
            break;

        case 'recharge':
            // Reduction (division): base / (1 + reduction%)
            enhanced = baseValue / Math.max(1, 1 + enhBonus / 100);
            final = enhanced / Math.max(1, 1 + globalBonus / 100);
            break;

        case 'range':
            // Multiplicative increase
            enhanced = baseValue * (1 + enhBonus / 100);
            final = enhanced * (1 + globalBonus / 100);
            break;

        default:
            // Default to additive
            enhanced = baseValue + (enhBonus / 100);
            final = enhanced + (globalBonus / 100);
            break;
    }

    return {
        base: roundToDecimal(baseValue, 2),
        enhanced: roundToDecimal(enhanced, 2),
        final: roundToDecimal(final, 2)
    };
}

/**
 * Calculate complex stat (objects with sub-properties)
 * @param {string} aspect - Aspect name
 * @param {Object} baseObject - Base object with properties
 * @param {Object} enhBonuses - Enhancement bonuses
 * @param {Object} globalBonuses - Global bonuses
 * @returns {Object} Complex stat result
 */
function calculateComplexStat(aspect, baseObject, enhBonuses, globalBonuses) {
    const result = {
        base: baseObject
    };

    if (aspect === 'damage' && baseObject.scale !== undefined) {
        // Damage with scale value
        const enhBonus = enhBonuses.damage || 0;
        const globalBonus = globalBonuses.damage || 0;

        const baseScale = baseObject.scale;
        const enhancedScale = baseScale * (1 + enhBonus / 100);
        const finalScale = enhancedScale * (1 + globalBonus / 100);

        result.enhanced = {
            ...baseObject,
            scale: roundToDecimal(enhancedScale, 2)
        };
        result.final = {
            ...baseObject,
            scale: roundToDecimal(finalScale, 2)
        };
    } else if (aspect === 'defense' || aspect === 'resistance') {
        // Defense/Resistance with typed values (S/L, E/N, etc.)
        result.enhanced = {};
        result.final = {};

        const enhBonus = enhBonuses[aspect] || 0;
        const globalBonus = globalBonuses[aspect] || 0;

        Object.entries(baseObject).forEach(([type, value]) => {
            if (typeof value === 'number') {
                // For defense/resistance, bonuses are additive percentages
                const basePercent = value * 100; // Convert to percentage
                const enhancedPercent = basePercent + enhBonus;
                const finalPercent = enhancedPercent + globalBonus;

                result.enhanced[type] = roundToDecimal(enhancedPercent / 100, 4);
                result.final[type] = roundToDecimal(finalPercent / 100, 4);
            }
        });
    } else if (aspect === 'healing' && baseObject.scale !== undefined) {
        // Healing with scale
        const enhBonus = enhBonuses.healing || 0;
        const globalBonus = globalBonuses.healing || 0;

        const baseScale = baseObject.scale;
        const enhancedScale = baseScale * (1 + enhBonus / 100);
        const finalScale = enhancedScale * (1 + globalBonus / 100);

        result.enhanced = {
            ...baseObject,
            scale: roundToDecimal(enhancedScale, 2)
        };
        result.final = {
            ...baseObject,
            scale: roundToDecimal(finalScale, 2)
        };
    }

    return result;
}

/**
 * Get relevant global bonuses for a power (set bonuses + active power buffs)
 * @param {Object} power - Power object
 * @returns {Object} Combined bonuses by aspect
 */
function getRelevantBonusesForPower(power) {
    const bonuses = {};

    // Get set bonuses
    if (typeof getAggregatedSetBonuses === 'function') {
        const setBonuses = getAggregatedSetBonuses();
        Object.entries(setBonuses).forEach(([stat, value]) => {
            bonuses[stat] = (bonuses[stat] || 0) + value;
        });
    }

    // Get active power buffs
    if (typeof calculateActivePowerBufsBonuses === 'function') {
        const activeBonuses = calculateActivePowerBufsBonuses();
        Object.entries(activeBonuses).forEach(([stat, value]) => {
            bonuses[stat] = (bonuses[stat] || 0) + value;
        });
    }

    return bonuses;
}

/**
 * Round number to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
function roundToDecimal(value, decimals) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Format stat value for display in tooltip
 * @param {Object} stat - Stat object with base/enhanced/final
 * @param {string} format - Format type ('number', 'percentage', 'seconds')
 * @returns {string} Formatted string
 */
function formatStatForTooltip(stat, format = 'number') {
    if (!stat) return '';

    const { base, enhanced, final } = stat;

    let baseStr, enhancedStr, finalStr;

    switch (format) {
        case 'percentage':
            baseStr = `${(base * 100).toFixed(1)}%`;
            enhancedStr = `${(enhanced * 100).toFixed(1)}%`;
            finalStr = `${(final * 100).toFixed(1)}%`;
            break;
        case 'seconds':
            baseStr = `${base.toFixed(2)}s`;
            enhancedStr = `${enhanced.toFixed(2)}s`;
            finalStr = `${final.toFixed(2)}s`;
            break;
        default:
            baseStr = base.toFixed(2);
            enhancedStr = enhanced.toFixed(2);
            finalStr = final.toFixed(2);
            break;
    }

    // Return format: base (enhanced) [final]
    // Only show enhanced if different from base
    // Only show final if different from enhanced
    if (base === enhanced && enhanced === final) {
        return baseStr;
    } else if (enhanced === final) {
        return `${baseStr} (${enhancedStr})`;
    } else {
        return `${baseStr} (${enhancedStr}) [${finalStr}]`;
    }
}
