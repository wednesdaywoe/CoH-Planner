/**
 * City of Heroes - Damage Calculation System
 * 
 * Converts damage scales to actual damage points based on:
 * - Character level
 * - Archetype damage modifiers
 * - Power damage scale
 * - Enhancement bonuses
 * - Active buffs
 */

/**
 * Base damage tables by level
 * These are the base damage values for a scale 1.0 attack at each level
 * Separate tables for melee and ranged (ranged is slightly lower)
 */
const DAMAGE_TABLES = {
    // Melee damage table (scale 1.0 at each level)
    melee: {
        1: 5.00,
        2: 5.72,
        3: 6.44,
        4: 7.16,
        5: 7.89,
        6: 8.61,
        7: 9.33,
        8: 10.06,
        9: 10.78,
        10: 11.50,
        11: 12.22,
        12: 12.94,
        13: 13.67,
        14: 14.39,
        15: 15.11,
        16: 15.83,
        17: 16.56,
        18: 17.28,
        19: 18.00,
        20: 18.72,
        21: 19.44,
        22: 20.17,
        23: 20.89,
        24: 21.61,
        25: 22.33,
        26: 23.06,
        27: 23.78,
        28: 24.50,
        29: 25.22,
        30: 25.94,
        31: 26.67,
        32: 27.39,
        33: 28.11,
        34: 28.83,
        35: 29.56,
        36: 30.28,
        37: 31.00,
        38: 31.72,
        39: 32.44,
        40: 33.17,
        41: 35.00,
        42: 36.11,
        43: 37.22,
        44: 38.33,
        45: 39.44,
        46: 40.56,
        47: 41.67,
        48: 42.78,
        49: 43.89,
        50: 45.00,
        51: 46.11,
        52: 47.22,
        53: 48.33
    },
    
    // Ranged damage table (scale 1.0 at each level) - ~5% lower than melee
    ranged: {
        1: 4.50,
        2: 5.15,
        3: 5.80,
        4: 6.44,
        5: 7.09,
        6: 7.74,
        7: 8.39,
        8: 9.04,
        9: 9.69,
        10: 10.34,
        11: 11.00,
        12: 11.65,
        13: 12.30,
        14: 12.95,
        15: 13.60,
        16: 14.25,
        17: 14.90,
        18: 15.55,
        19: 16.20,
        20: 16.85,
        21: 17.50,
        22: 18.15,
        23: 18.80,
        24: 19.45,
        25: 20.10,
        26: 20.75,
        27: 21.40,
        28: 22.05,
        29: 22.70,
        30: 23.35,
        31: 24.00,
        32: 24.65,
        33: 25.30,
        34: 25.95,
        35: 26.60,
        36: 27.25,
        37: 27.90,
        38: 28.55,
        39: 29.20,
        40: 29.85,
        41: 31.50,
        42: 32.50,
        43: 33.50,
        44: 34.50,
        45: 35.50,
        46: 36.50,
        47: 37.50,
        48: 38.50,
        49: 39.50,
        50: 40.50,
        51: 41.50,
        52: 42.50,
        53: 43.50
    }
};

/**
 * Get base damage for a given level and attack type
 * @param {number} level - Character level (1-53)
 * @param {string} damageType - 'melee' or 'ranged'
 * @returns {number} Base damage for scale 1.0
 */
function getBaseDamage(level, damageType = 'melee') {
    level = Math.max(1, Math.min(53, level)); // Clamp to 1-53
    const table = DAMAGE_TABLES[damageType] || DAMAGE_TABLES.melee;
    return table[level] || table[50]; // Default to level 50 if not found
}

/**
 * Calculate actual damage for a power
 * @param {Object} options - Calculation parameters
 * @param {number} options.scale - Power's damage scale
 * @param {string} options.damageType - Power's damage type ('melee', 'ranged', or 'aoe')
 * @param {number} options.level - Character level
 * @param {string} options.archetypeId - Archetype ID
 * @param {number} options.enhancementBonus - Total enhancement bonus (0.95 for 95%, etc.)
 * @param {number} options.damageBuffs - Active damage buffs (0.50 for +50%, etc.)
 * @returns {number} Actual damage in points
 */
function calculateActualDamage(options) {
    const {
        scale,
        damageType = 'melee',
        level = 50,
        archetypeId,
        enhancementBonus = 0,
        damageBuffs = 0
    } = options;
    
    if (!scale || scale === 0) return 0;
    
    // Get archetype damage modifier for this damage type
    let atModifier = 1.0;
    if (archetypeId && ARCHETYPES[archetypeId]) {
        const archetype = ARCHETYPES[archetypeId];
        
        // AoE attacks use the aoe modifier, everything else uses melee/ranged
        if (damageType === 'aoe' && archetype.stats.damageModifier.aoe) {
            atModifier = archetype.stats.damageModifier.aoe;
        } else if (damageType === 'ranged') {
            atModifier = archetype.stats.damageModifier.ranged;
        } else {
            atModifier = archetype.stats.damageModifier.melee;
        }
    }
    
    // Get base damage for this level and type
    // For AoE, use the base damage type (melee or ranged) from the table
    const tableType = (damageType === 'aoe') ? 'melee' : damageType;
    const baseDamage = getBaseDamage(level, tableType);
    
    // Calculate: Base × AT Modifier × Scale × (1 + Enhancements) × (1 + Buffs)
    const actualDamage = baseDamage * atModifier * scale * (1 + enhancementBonus) * (1 + damageBuffs);
    
    return actualDamage;
}

/**
 * Calculate damage for a power from build
 * @param {Object} power - Power from build
 * @param {Object} basePower - Original power definition
 * @returns {Object} { base, enhanced, final, type } damage values
 */
function calculatePowerDamage(power, basePower) {
    if (!basePower.effects || !basePower.effects.damage) {
        return null;
    }
    
    const damageEffect = basePower.effects.damage;
    
    // Extract scale - handle both old and new formats
    let scale;
    let damageTypeName;
    
    if (typeof damageEffect === 'number') {
        // Very old format: just a number
        scale = damageEffect;
        damageTypeName = 'Unknown';
    } else if (typeof damageEffect === 'object') {
        if (damageEffect.types) {
            // New format with multiple damage types
            // Sum all the scales
            scale = damageEffect.scale || damageEffect.types.reduce((sum, t) => sum + t.scale, 0);
            // Display all types
            damageTypeName = damageEffect.types.map(t => t.type).join('/');
        } else {
            // Single damage type
            scale = damageEffect.scale;
            damageTypeName = damageEffect.type || 'Unknown';
        }
    }
    
    if (!scale || scale === 0) {
        // For powers with unknown scale (redirect/pseudo-pet powers), return type info only
        if (damageTypeName && damageTypeName !== 'Unknown') {
            return {
                base: 0,
                enhanced: 0,
                final: 0,
                type: damageTypeName,
                unknown: true  // Flag to indicate scale is unknown
            };
        }
        return null;
    }
    
    // If still unknown, try to infer from power/powerset name (fallback)
    if (damageTypeName === 'Unknown') {
        const powerName = basePower.name.toLowerCase();
        const powerSetName = (Build.primary?.name || Build.secondary?.name || '').toLowerCase();
        
        if (powerName.includes('fire') || powerSetName.includes('fire') || powerSetName.includes('fiery')) {
            damageTypeName = 'Fire';
        } else if (powerName.includes('ice') || powerName.includes('frost') || powerName.includes('cold') || powerSetName.includes('ice')) {
            damageTypeName = 'Cold';
        } else if (powerName.includes('dark') || powerSetName.includes('dark')) {
            damageTypeName = 'Negative';
        } else if (powerName.includes('electric') || powerName.includes('lightning') || powerSetName.includes('electric')) {
            damageTypeName = 'Energy';
        } else if (powerName.includes('radiation') || powerName.includes('rad') || powerSetName.includes('radiation')) {
            damageTypeName = 'Energy';
        } else if (powerName.includes('psychic') || powerName.includes('mental') || powerSetName.includes('psychic') || powerSetName.includes('mental')) {
            damageTypeName = 'Psionic';
        } else if (powerName.includes('sonic') || powerSetName.includes('sonic')) {
            damageTypeName = 'Energy';
        } else if (powerName.includes('toxic') || powerName.includes('poison')) {
            damageTypeName = 'Toxic';
        } else if (powerName.includes('arrow') || powerName.includes('archery')) {
            damageTypeName = 'Lethal';
        } else if (powerName.includes('rifle') || powerName.includes('bullet')) {
            damageTypeName = 'Lethal';
        } else if (powerName.includes('smash') || powerName.includes('punch') || powerName.includes('kick')) {
            damageTypeName = 'Smashing';
        } else if (powerName.includes('slash') || powerName.includes('sword') || powerName.includes('blade')) {
            damageTypeName = 'Lethal';
        }
    }

    // If the power also applies DoT, include DoT type in the type string
    if (basePower.effects && basePower.effects.dotDamage) {
        try {
            const dot = basePower.effects.dotDamage;
            let dotTypeName = '';
            if (typeof dot === 'object') {
                if (dot.types) {
                    dotTypeName = dot.types.map(t => t.type).join('/');
                } else if (dot.type) {
                    dotTypeName = dot.type;
                }
            } else if (typeof dot === 'string') {
                dotTypeName = dot;
            }

            if (dotTypeName) {
                // Avoid duplicating if main damage already mentions the same type
                if (!damageTypeName.includes(dotTypeName)) {
                    damageTypeName = `${damageTypeName} + DoT(${dotTypeName})`;
                }
            }
        } catch (e) {
            // Fail silently — don't break damage calc on unexpected dot formats
        }
    }
    
    // Determine damage type (melee, ranged, or aoe)
    let damageType = 'melee';
    
    // Check powerset category/type from Build object
    let powersetCategory = '';
    if (Build.primary?.id && POWERSETS[Build.primary.id]) {
        const ps = POWERSETS[Build.primary.id];
        powersetCategory = ps.category || ps.type || '';
    } else if (Build.secondary?.id && POWERSETS[Build.secondary.id]) {
        const ps = POWERSETS[Build.secondary.id];
        powersetCategory = ps.category || ps.type || '';
    }
    
    // Determine if ranged based on multiple factors
    const powersetName = (Build.primary?.name || Build.secondary?.name || '').toLowerCase();
    const isRangedSet = powersetName.includes('blast') || 
                        powersetName.includes('assault') ||
                        powersetName.includes('archery') ||
                        powersetName.includes('rifle');
    
    // Check if ranged from powerset category, shortHelp, or powerset name
    if (powersetCategory.includes('RANGED') || 
        (basePower.shortHelp && basePower.shortHelp.toLowerCase().includes('ranged')) ||
        isRangedSet ||
        basePower.effects.range > 20) {  // Powers with >20ft range are typically ranged
        damageType = 'ranged';
    }
    
    // Check if it's AoE by looking for radius or target count
    if (basePower.effects.radius || basePower.effects.maxTargets > 1) {
        damageType = 'aoe';
    }
    
    const level = Build.level || 50;
    const archetypeId = Build.archetype?.id;
    
    // Base damage (no enhancements)
    const baseDamage = calculateActualDamage({
        scale,
        damageType,
        level,
        archetypeId,
        enhancementBonus: 0,
        damageBuffs: 0
    });
    
    // Enhanced damage (with slot enhancements)
    let enhancementBonus = 0;
    if (power && typeof calculatePowerEnhancementBonuses === 'function') {
        const bonuses = calculatePowerEnhancementBonuses(power);
        enhancementBonus = bonuses.damage || 0;
    }
    
    const enhancedDamage = calculateActualDamage({
        scale,
        damageType,
        level,
        archetypeId,
        enhancementBonus,
        damageBuffs: 0
    });
    
    // Final damage (with global buffs from active powers)
    let globalDamageBonus = 0;
    if (typeof CharacterStats !== 'undefined' && CharacterStats.damage) {
        globalDamageBonus = CharacterStats.damage / 100; // Convert from percentage
    }
    
    // Also check for active buff powers (like Aim, Build Up)
    let activeBuffs = 0;
    if (Build && Build.primary && Build.primary.powers) {
        Build.primary.powers.forEach(p => {
            if (p.isActive && p.effects && p.effects.damageBuff) {
                activeBuffs += p.effects.damageBuff;
            }
        });
    }
    if (Build && Build.secondary && Build.secondary.powers) {
        Build.secondary.powers.forEach(p => {
            if (p.isActive && p.effects && p.effects.damageBuff) {
                activeBuffs += p.effects.damageBuff;
            }
        });
    }
    
    const finalDamage = calculateActualDamage({
        scale,
        damageType,
        level,
        archetypeId,
        enhancementBonus,
        damageBuffs: globalDamageBonus + activeBuffs
    });
    
    return {
        base: baseDamage,
        enhanced: enhancedDamage,
        final: finalDamage,
        type: damageTypeName
    };
}

/**
 * Format damage for display
 * @param {number} damage - Damage value
 * @returns {string} Formatted damage string
 */
function formatDamage(damage) {
    return damage.toFixed(2);
}
