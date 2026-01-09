/**
 * Inherent Powers Management
 * Functions to handle initialization and management of inherent powers for characters
 */

/**
 * Initialize inherent powers based on archetype
 * @param {string} archetypeId - The archetype ID
 * @returns {Array} Array of inherent power objects
 */
function initializeInherentPowers(archetypeId) {
    const inherentPowers = [];
    
    // Get the archetype definition
    const archetype = ARCHETYPES[archetypeId];
    if (!archetype || !archetype.inherent) {
        console.warn(`No inherent powers found for archetype: ${archetypeId}`);
        return inherentPowers;
    }
    
    // Fitness inherent powers (always available)
    const fitnessInherents = ['swift', 'hurdle', 'health', 'stamina'];
    
    // Add fitness inherents - preserve their category and initialize slots
    fitnessInherents.forEach(powerKey => {
        if (INHERENT_POWERS[powerKey]) {
            const basePower = INHERENT_POWERS[powerKey];
            inherentPowers.push({
                ...basePower,
                slots: basePower.maxSlots > 0 ? [null] : [], // Initialize with 1 empty slot if slottable
                isActive: false // For toggles
            });
        }
    });
    
    // Universal inherent powers (non-fitness) - only add if not already added
    const universalInherents = ['brawl', 'sprint', 'rest'];
    
    // Add universal inherents - preserve their category or set to 'universal', and initialize slots
    universalInherents.forEach(powerKey => {
        if (INHERENT_POWERS[powerKey]) {
            const power = INHERENT_POWERS[powerKey];
            inherentPowers.push({
                ...power,
                category: power.category || 'universal',
                slots: power.maxSlots > 0 ? [null] : [], // Initialize with 1 empty slot if slottable
                isActive: false // For toggles
            });
        }
    });
    
    // Add archetype-specific inherent powers with slots
    if (archetype.inherent.powers && Array.isArray(archetype.inherent.powers)) {
        archetype.inherent.powers.forEach(powerKey => {
            if (INHERENT_POWERS[powerKey]) {
                const power = INHERENT_POWERS[powerKey];
                // Only override category if it's 'archetype', otherwise use 'archetype-specific'
                inherentPowers.push({
                    ...power,
                    category: (power.category === 'archetype' || power.category === 'archetype-specific') ? 'archetype-specific' : power.category,
                    slots: power.maxSlots > 0 ? [null] : [], // Initialize with 1 empty slot if slottable
                    isActive: false // For toggles
                });
            }
        });
    }
    
    // Add level-based inherents if they exist in the inherent object
    if (archetype.inherent.name) {
        // Check if there's a specific inherent power with this name
        const inherentKey = archetype.inherent.name.toLowerCase().replace(/\s+/g, '-');
        if (INHERENT_POWERS[inherentKey]) {
            const power = INHERENT_POWERS[inherentKey];
            inherentPowers.push({
                ...power,
                category: (power.category === 'archetype' || power.category === 'archetype-specific') ? 'archetype-specific' : power.category,
                slots: power.maxSlots > 0 ? [null] : [], // Initialize with 1 empty slot if slottable
                isActive: false // For toggles
            });
        }
    }
    
    // Remove duplicates (in case of overlap)
    const uniquePowers = [];
    const seenNames = new Set();
    
    inherentPowers.forEach(power => {
        if (!seenNames.has(power.name)) {
            uniquePowers.push(power);
            seenNames.add(power.name);
        }
    });
    
    return uniquePowers;
}

/**
 * Get inherent power by name
 * @param {string} powerName - The power name
 * @returns {Object|null} Power object or null if not found
 */
function getInherentPowerByName(powerName) {
    const powerKey = powerName.toLowerCase().replace(/\s+/g, '-');
    return INHERENT_POWERS[powerKey] || null;
}

/**
 * Check if a power is an inherent power
 * @param {string} powerName - The power name
 * @returns {boolean} True if the power is an inherent
 */
function isInherentPower(powerName) {
    return getInherentPowerByName(powerName) !== null;
}

/**
 * Get all inherent powers for the current build
 * @returns {Array} Array of inherent power objects
 */
function getCurrentInherentPowers() {
    return Build.inherents || [];
}

/**
 * Find an inherent power in the current build
 * @param {string} powerName - The power name
 * @returns {Object|null} Power object or null if not found
 */
function findCurrentInherentPower(powerName) {
    const inherents = getCurrentInherentPowers();
    return inherents.find(p => p.name === powerName) || null;
}
