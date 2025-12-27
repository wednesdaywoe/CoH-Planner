/**
 * City of Heroes Planner - Build Management
 * 
 * Core build data structure and manipulation functions
 */

// ============================================
// BUILD DATA STRUCTURE
// ============================================

/**
 * Main build object - represents a complete character build
 */
const Build = {
    // Character info
    name: 'Untitled Build',
    archetype: {
        id: null,
        name: '',
        stats: null,
        inherent: null
    },
    level: 1, // Current character level
    progressionMode: 'auto', // 'auto' or 'freeform'
    
    // Power sets
    primary: {
        id: null,
        name: '',
        powers: []
    },
    secondary: {
        id: null,
        name: '',
        powers: []
    },
    pools: [], // Array of {id, name, powers: []}
    inherent: {
        powers: []
    },
    
    // Settings
    settings: {
        globalIOLevel: 50,
        origin: 'Natural'
    },
    
    // Set tracking for bonuses
    sets: {}
};

// ============================================
// POWER STRUCTURE
// ============================================

/**
 * Create a new power object
 * @param {string} name - Power name
 * @param {string} powerSet - Power set name
 * @param {number} level - Level power was taken
 * @param {number} maxSlots - Maximum enhancement slots (usually 6)
 * @returns {Object} Power object
 */
function createPower(name, powerSet, level, maxSlots = 6) {
    return {
        name: name,
        powerSet: powerSet,
        level: level,
        slots: [null], // Start with 1 empty slot
        maxSlots: maxSlots
    };
}

/**
 * Create a new enhancement object
 * @param {string} type - Enhancement type (io-set, io-generic, hamidon, origin)
 * @param {Object} data - Enhancement-specific data
 * @returns {Object} Enhancement object
 */
function createEnhancement(type, data) {
    const enhancement = {
        type: type,
        ...data
    };
    
    // Add timestamp for ordering
    enhancement.addedAt = Date.now();
    
    return enhancement;
}

// ============================================
// BUILD MANIPULATION
// ============================================

/**
 * Add a power to the build (LEGACY - use character-creator.js functions instead)
 * @param {string} category - 'primary', 'secondary', or 'inherent'
 * @param {Object} power - Power object
 */
function addPower(category, power) {
    // Pool powers are now managed in character-creator.js via Build.pools array
    if (category === 'pool') {
        console.warn('addPower(pool) is deprecated - use character-creator.js pool functions');
        return;
    }
    
    Build[category].powers.push(power);
    console.log(`Added power: ${power.name} to ${category}`);
}

/**
 * Remove a power from the build (LEGACY)
 * @param {string} category - Power category
 * @param {string} powerName - Name of power to remove
 */
function removePower(category, powerName) {
    // Pool powers are now managed in character-creator.js
    if (category === 'pool') {
        console.warn('removePower(pool) is deprecated - use character-creator.js pool functions');
        return;
    }
    
    const collection = Build[category];
    const index = collection.powers.findIndex(p => p.name === powerName);
    
    if (index !== -1) {
        collection.powers.splice(index, 1);
        console.log(`Removed power: ${powerName} from ${category}`);
    }
}

/**
 * Find a power in the build
 * @param {string} powerName - Power name
 * @returns {Object|null} Power object or null if not found
 */
function findPower(powerName) {
    // Check primary/secondary/inherent
    const categories = ['primary', 'secondary', 'inherent'];
    for (const category of categories) {
        const power = Build[category].powers.find(p => p.name === powerName);
        if (power) {
            return { category, power };
        }
    }
    
    // Check all pool powers
    for (const pool of Build.pools) {
        const power = pool.powers.find(p => p.name === powerName);
        if (power) {
            return { category: 'pool', power, poolId: pool.id };
        }
    }
    
    return null;
}

/**
 * Add a slot to a power
 * @param {string} powerName - Power name
 * @returns {boolean} Success status
 */
function addSlotToPower(powerName) {
    const result = findPower(powerName);
    if (!result) {
        console.error(`Power not found: ${powerName}`);
        return false;
    }
    
    const { power } = result;
    
    if (power.slots.length >= power.maxSlots) {
        console.error(`Power ${powerName} already has maximum slots`);
        return false;
    }
    
    power.slots.push(null);
    console.log(`Added slot to ${powerName} (${power.slots.length}/${power.maxSlots})`);
    return true;
}

/**
 * Remove a slot from a power
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index to remove
 * @returns {boolean} Success status
 */
function removeSlotFromPower(powerName, slotIndex) {
    const result = findPower(powerName);
    if (!result) {
        console.error(`Power not found: ${powerName}`);
        return false;
    }
    
    const { power } = result;
    
    // Must keep at least 1 slot
    if (power.slots.length <= 1) {
        console.error(`Cannot remove last slot from ${powerName}`);
        return false;
    }
    
    if (slotIndex < 0 || slotIndex >= power.slots.length) {
        console.error(`Invalid slot index: ${slotIndex}`);
        return false;
    }
    
    const enhancement = power.slots[slotIndex];
    
    // Remove from set tracking if it's an IO set
    if (enhancement && enhancement.type === 'io-set') {
        untrackSetBonus(enhancement.setId, enhancement.pieceNum);
    }
    
    power.slots.splice(slotIndex, 1);
    console.log(`Removed slot from ${powerName} (${power.slots.length}/${power.maxSlots})`);
    return true;
}

/**
 * Add an enhancement to a power at specific slot
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index
 * @param {Object} enhancement - Enhancement object
 * @returns {boolean} Success status
 */
function addEnhancementToPower(powerName, slotIndex, enhancement) {
    const result = findPower(powerName);
    if (!result) {
        console.error(`Power not found: ${powerName}`);
        return false;
    }
    
    const { power } = result;
    
    if (slotIndex < 0 || slotIndex >= power.slots.length) {
        console.error(`Invalid slot index: ${slotIndex}`);
        return false;
    }
    
    if (power.slots[slotIndex] !== null) {
        console.error(`Slot ${slotIndex} already has an enhancement`);
        return false;
    }
    
    // Add enhancement to slot
    power.slots[slotIndex] = enhancement;
    
    // Track set bonuses if it's an IO set enhancement
    if (enhancement.type === 'io-set') {
        trackSetBonus(enhancement.setId);
    }
    
    console.log(`Added ${enhancement.type} enhancement to ${powerName} slot ${slotIndex}`);
    return true;
}

/**
 * Remove an enhancement from a power
 * @param {string} powerName - Power name
 * @param {number} slotIndex - Slot index to clear
 * @returns {boolean} Success status
 */
function removeEnhancementFromPower(powerName, slotIndex) {
    const result = findPower(powerName);
    if (!result) {
        console.error(`Power not found: ${powerName}`);
        return false;
    }
    
    const { power } = result;
    
    if (slotIndex < 0 || slotIndex >= power.slots.length) {
        console.error(`Invalid slot index: ${slotIndex}`);
        return false;
    }
    
    const enhancement = power.slots[slotIndex];
    
    // Remove from set tracking if it's an IO set
    if (enhancement.type === 'io-set') {
        untrackSetBonus(enhancement.setId, enhancement.pieceNum);
    }
    
    // Remove enhancement
    power.slots.splice(slotIndex, 1);
    
    console.log(`Removed enhancement from ${powerName} slot ${slotIndex}`);
    return true;
}

// ============================================
// SET BONUS TRACKING
// ============================================

/**
 * Track IO set for bonus calculation
 * @param {string} setId - Set identifier
 */
function trackSetBonus(setId) {
    if (!Build.sets[setId]) {
        Build.sets[setId] = {
            count: 0,
            pieces: new Set()
        };
    }
    Build.sets[setId].count++;
}

/**
 * Remove tracking for IO set piece
 * @param {string} setId - Set identifier
 * @param {number} pieceNum - Piece number
 */
function untrackSetBonus(setId, pieceNum) {
    if (Build.sets[setId]) {
        Build.sets[setId].count--;
        Build.sets[setId].pieces.delete(pieceNum);
        
        if (Build.sets[setId].count === 0) {
            delete Build.sets[setId];
        }
    }
}

/**
 * Get active set bonuses for display
 * @returns {Array} Array of active bonus descriptions
 */
function getActiveSetBonuses() {
    const bonuses = [];
    
    for (const [setId, tracking] of Object.entries(Build.sets)) {
        const set = IO_SETS[setId];
        if (!set) continue;
        
        const count = tracking.count;
        
        // Add bonuses for 2-6 pieces
        for (let i = 2; i <= count && i <= 6; i++) {
            if (set.bonuses[i - 2]) { // bonuses array is 0-indexed
                bonuses.push({
                    setName: set.name,
                    pieces: i,
                    bonus: set.bonuses[i - 2]
                });
            }
        }
    }
    
    return bonuses;
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the build with demo data (DEPRECATED - not used in current implementation)
 */
function initializeDemoBuild() {
    // Note: Pool powers are now managed through character-creator.js
    // This function is kept for reference only
    console.warn('initializeDemoBuild() is deprecated');
}

// ============================================
// EXPORT
// ============================================

/**
 * Export build to JSON
 * @returns {string} JSON string of build
 */
function exportBuild() {
    // Convert sets Map to object for JSON serialization
    const exportData = {
        ...Build,
        sets: {}
    };
    
    for (const [setId, tracking] of Object.entries(Build.sets)) {
        exportData.sets[setId] = {
            count: tracking.count,
            pieces: Array.from(tracking.pieces)
        };
    }
    
    return JSON.stringify(exportData, null, 2);
}

/**
 * Import build from JSON
 * @param {string} jsonData - JSON string
 */
function importBuild(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        // Clear current build
        Build.primary.powers = data.primary.powers || [];
        Build.secondary.powers = data.secondary.powers || [];
        Build.pools = data.pools || []; // Use new pools array
        Build.inherent.powers = data.inherent.powers || [];
        
        // Restore sets
        Build.sets = {};
        if (data.sets) {
            for (const [setId, tracking] of Object.entries(data.sets)) {
                Build.sets[setId] = {
                    count: tracking.count,
                    pieces: new Set(tracking.pieces)
                };
            }
        }
        
        console.log('Build imported successfully');
        return true;
    } catch (error) {
        console.error('Failed to import build:', error);
        return false;
    }
}
