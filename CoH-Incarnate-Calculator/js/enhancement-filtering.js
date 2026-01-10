/**
 * City of Heroes Planner - Enhancement Filtering
 * 
 * Filters IO sets based on power compatibility using allowedSetCategories
 */

/**
 * Check if an IO set can be slotted into a power
 * Uses the new allowedSetCategories field for accurate filtering
 * 
 * @param {Object} ioSet - The IO set to check
 * @param {Array} allowedSetCategories - Power's allowed set categories from raw data
 * @returns {boolean} True if set can be slotted
 */
function canSlotSetInPower(ioSet, allowedSetCategories) {
    if (!ioSet || !allowedSetCategories || !ioSet.type) return false;
    
    // Direct match: check if the IO set's type is in the power's allowed categories
    // This is MUCH simpler and more accurate than the old mapping system!
    return allowedSetCategories.includes(ioSet.type);
}

/**
 * Get all IO sets compatible with a power
 * @param {string} powerName - Name of the power
 * @param {string} category - Category filter (io-set, purple, ato, event)
 * @returns {Array} Array of compatible IO sets with their IDs
 */
function getCompatibleSetsForPower(powerName, category) {
    // Find the power
    const result = findPower(powerName);
    if (!result) {
        console.error(`Power not found: ${powerName}`);
        return [];
    }
    
    const allowedSetCategories = result.power.allowedSetCategories || [];
    console.log(`${powerName} allowed set categories:`, allowedSetCategories);
    
    // Filter sets by category and compatibility
    const compatibleSets = [];
    for (const [setId, set] of Object.entries(IO_SETS)) {
        if (set.category === category) {
            const canSlot = canSlotSetInPower(set, allowedSetCategories);
            if (canSlot) {
                compatibleSets.push({ setId, set });
            }
        }
    }
    
    console.log(`Found ${compatibleSets.length} compatible sets in category ${category}`);
    return compatibleSets;
}

/**
 * Get unique set types that are compatible with a power
 * @param {Array} allowedSetCategories - Power's allowed set categories from raw data
 * @param {string} category - Category filter (io-set, purple, ato, event)
 * @returns {Array} Array of {type: string, count: number} objects
 */
function getCompatibleSetTypes(allowedSetCategories, category) {
    if (!allowedSetCategories) return [];
    
    // Get all sets in this category
    const setsInCategory = Object.entries(IO_SETS)
        .filter(([_, set]) => set.category === category)
        .map(([setId, set]) => ({ setId, set }));
    
    // Filter to compatible sets using the new field
    const compatibleSets = setsInCategory.filter(({ set }) => 
        canSlotSetInPower(set, allowedSetCategories)
    );
    
    // Count by type
    const typeCounts = {};
    compatibleSets.forEach(({ set }) => {
        if (!typeCounts[set.type]) {
            typeCounts[set.type] = 0;
        }
        typeCounts[set.type]++;
    });
    
    // Convert to array and sort by count (descending)
    return Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Filter sets by type
 * @param {Array} sets - Array of {setId, set} objects
 * @param {string} typeFilter - Type to filter by (or null for all)
 * @returns {Array} Filtered array
 */
function filterSetsByType(sets, typeFilter) {
    if (!typeFilter) return sets;
    return sets.filter(({ set }) => set.type === typeFilter);
}

// ============================================
// LEGACY SUPPORT - For powers without allowedSetCategories
// ============================================

// Map enhancement class names to IO set types
// This is ONLY used as a fallback for old power definitions
const ENHANCEMENT_TO_SET_TYPE_MAP = {
    // Damage types
    'Damage': ['Melee Damage', 'Ranged Damage', 'Targeted AoE Damage', 'PBAoE Damage', 'Pet Damage', 'Sniper Attacks', 'Universal Damage'],
    
    // Defense/Resistance
    'Defense Buff': ['Defense Sets'],
    'DefenseBuff': ['Defense Sets'],
    'Resist Damage': ['Resist Damage'],
    'ResistDamage': ['Resist Damage'],
    
    // Healing
    'Healing': ['Healing', 'Accurate Healing'],
    'Heal': ['Healing', 'Accurate Healing'],
    
    // Control
    'Hold Duration': ['Holds'],
    'HoldDuration': ['Holds'],
    'Hold': ['Holds'],
    'Disorient Duration': ['Stuns'],
    'DisorientDuration': ['Stuns'],
    'Disorient': ['Stuns'],
    'Dsrnt': ['Stuns'],
    'Immobilisation Duration': ['Immobilize'],
    'ImmobilizationDuration': ['Immobilize'],
    'Immobilize': ['Immobilize'],
    'Immob': ['Immobilize'],
    'Confuse Duration': ['Confuse'],
    'ConfuseDuration': ['Confuse'],
    'Confuse': ['Confuse'],
    'Conf': ['Confuse'],
    'Fear Duration': ['Fear'],
    'FearDuration': ['Fear'],
    'Fear': ['Fear'],
    'Sleep Duration': ['Sleep'],
    'SleepDuration': ['Sleep'],
    'Sleep': ['Sleep'],
    'Slow': ['Slow Movement'],
    
    // Debuffs
    'Defense Debuff': ['Defense Debuff', 'Accurate Defense Debuff'],
    'DefenseDebuff': ['Defense Debuff', 'Accurate Defense Debuff'],
    'DefDeb': ['Defense Debuff', 'Accurate Defense Debuff'],
    'To Hit Debuff': ['To Hit Debuff', 'Accurate To-Hit Debuff'],
    'ToHitDebuff': ['To Hit Debuff', 'Accurate To-Hit Debuff'],
    'ToHitDeb': ['To Hit Debuff', 'Accurate To-Hit Debuff'],
    
    // Movement
    'Flight Speed': ['Flight', 'Universal Travel'],
    'FlightSpeed': ['Flight', 'Universal Travel'],
    'Flight': ['Flight', 'Universal Travel'],
    'Jumping': ['Leaping', 'Universal Travel'],
    'Jump': ['Leaping', 'Universal Travel'],
    'Run Speed': ['Running', 'Universal Travel'],
    'RunSpeed': ['Running', 'Universal Travel'],
    'Run': ['Running', 'Universal Travel'],
    
    // Other
    'Endurance Modification': ['Endurance Modification'],
    'EnduranceModification': ['Endurance Modification'],
    'EndMod': ['Endurance Modification'],
    'Knockback Distance': ['Knockback'],
    'KnockbackDistance': ['Knockback'],
    'Knockback': ['Knockback'],
    'KBDist': ['Knockback'],
    'Taunt Duration': ['Threat Duration'],
    'TauntDuration': ['Threat Duration'],
    'Taunt': ['Threat Duration'],
    'To Hit Buff': ['To Hit Buff'],
    'ToHitBuff': ['To Hit Buff'],
    'ToHit': ['To Hit Buff']
};

/**
 * LEGACY: Get compatible set types from allowedEnhancements
 * Only used as fallback for old power definitions
 * @param {Array} allowedEnhancements - Power's allowed enhancement types
 * @returns {Set} Set of compatible IO set type names
 */
function legacyGetCompatibleTypes(allowedEnhancements) {
    const compatibleTypes = new Set();
    
    for (const allowed of allowedEnhancements) {
        const setTypes = ENHANCEMENT_TO_SET_TYPE_MAP[allowed];
        if (setTypes && setTypes.length > 0) {
            setTypes.forEach(type => compatibleTypes.add(type));
        }
    }
    
    return compatibleTypes;
}
