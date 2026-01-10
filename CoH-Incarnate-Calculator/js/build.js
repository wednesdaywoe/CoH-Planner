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
    epicPool: {
        id: null,
        name: '',
        powers: []
    },
    inherents: [], // ADD THIS LINE
    inherent: {
        powers: []
    },
    
    // Accolades
    accolades: [],
    
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
 * @returns {Array} Array of active bonus objects
 */
function getActiveSetBonuses() {
    const bonuses = [];
    
    for (const [setId, tracking] of Object.entries(Build.sets)) {
        const set = IO_SETS[setId];
        if (!set || !set.bonuses) continue;
        
        const count = tracking.count;
        
        // Check each bonus level
        set.bonuses.forEach(bonus => {
            if (count >= bonus.pieces) {
                bonuses.push({
                    setId: setId,
                    setName: set.name,
                    pieces: bonus.pieces,
                    stat: bonus.stat,
                    value: bonus.value,
                    desc: bonus.desc
                });
            }
        });
    }
    
    return bonuses;
}

/**
 * Calculate total set bonuses and apply to CharacterStats
 */
function calculateSetBonuses() {
    const bonuses = getActiveSetBonuses();
    
    // Group bonuses by stat
    const statTotals = {};
    
    bonuses.forEach(bonus => {
        if (!statTotals[bonus.stat]) {
            statTotals[bonus.stat] = 0;
        }
        statTotals[bonus.stat] += bonus.value;
    });
    
    return statTotals;
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

/**
 * Export build to JSON (data only)
 * @returns {string} JSON string of build
 */
function exportBuildData() {
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
 * Import build from JSON (data only)
 * @param {string} jsonData - JSON string
 */
function importBuildData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        // Restore character info
        Build.name = data.name || 'Untitled Build';
        Build.level = data.level || 1;
        Build.progressionMode = data.progressionMode || 'auto';
        
        // Restore archetype
        Build.archetype = data.archetype || {
            id: null,
            name: '',
            stats: null,
            inherent: null
        };
        
        // Restore power sets
        Build.primary = data.primary || { id: null, name: '', powers: [] };
        Build.secondary = data.secondary || { id: null, name: '', powers: [] };
        Build.pools = data.pools || [];
        Build.epicPool = data.epicPool || { id: null, name: '', powers: [] };
        Build.inherents = data.inherents || [];
        Build.inherent = data.inherent || { powers: [] };
        
        // Restore accolades
        Build.accolades = data.accolades || [];
        
        // Restore settings
        Build.settings = data.settings || {
            globalIOLevel: 50,
            origin: 'Natural'
        };
        
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

// ============================================
// UI-FACING EXPORT/IMPORT FUNCTIONS
// ============================================

/**
 * Export build and download as JSON file
 * This is the function called by the UI Export button
 */
function exportBuild() {
    try {
        // Get the build data as JSON
        const jsonData = exportBuildData();
        
        // Create a blob from the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename from build name and date
        const buildName = Build.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const date = new Date().toISOString().split('T')[0];
        link.download = `${buildName}_${date}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
        console.log('Build exported successfully');
        alert('Build exported successfully!');
    } catch (error) {
        console.error('Failed to export build:', error);
        alert('Failed to export build: ' + error.message);
    }
}

/**
 * Trigger the file input for importing a build
 * This is the function called by the UI Import button
 */
function importBuild() {
    const fileInput = document.getElementById('importFileInput');
    if (fileInput) {
        fileInput.click();
    } else {
        console.error('Import file input not found');
        alert('Import feature not available');
    }
}

/**
 * Handle the file selection from import
 * This is called when a file is selected
 */
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    
    // Check if it's a JSON file
    if (!file.name.endsWith('.json')) {
        alert('Please select a valid JSON build file');
        return;
    }
    
    // Read the file
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = e.target.result;
            
            // Import the build data
            const success = importBuildData(jsonData);
            
            if (success) {
                // Refresh the UI to show the imported build
                refreshUIAfterImport();
                alert('Build imported successfully!');
            } else {
                alert('Failed to import build. Please check the file format.');
            }
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to read build file: ' + error.message);
        }
        
        // Reset the file input so the same file can be imported again
        event.target.value = '';
    };
    
    reader.onerror = function() {
        alert('Failed to read file');
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

/**
 * Refresh the UI after importing a build
 * This updates all the dropdowns, power lists, and other UI elements
 */
function refreshUIAfterImport() {
    // Update build name
    const buildNameInput = document.getElementById('buildName');
    if (buildNameInput) {
        buildNameInput.value = Build.name;
    }
    
    // Update archetype selection
    const archetypeSelect = document.getElementById('archetypeSelect');
    if (archetypeSelect && Build.archetype.id) {
        archetypeSelect.value = Build.archetype.id;
        // This will trigger the change event which loads the powersets
        onArchetypeChange();
    }
    
    // Update primary selection
    const primarySelect = document.getElementById('primarySelect');
    if (primarySelect && Build.primary.id) {
        primarySelect.value = Build.primary.id;
        onPrimaryChange();
    }
    
    // Update secondary selection
    const secondarySelect = document.getElementById('secondarySelect');
    if (secondarySelect && Build.secondary.id) {
        secondarySelect.value = Build.secondary.id;
        onSecondaryChange();
    }
    
    // Update progression mode
    const progressionMode = document.getElementById('progressionMode');
    if (progressionMode) {
        progressionMode.value = Build.progressionMode;
    }
    
    // Update global IO level
    const globalIOLevel = document.getElementById('globalIOLevel');
    if (globalIOLevel) {
        globalIOLevel.value = Build.settings.globalIOLevel;
    }
    
    // Update character level display
    const charLevelSpan = document.getElementById('charLevel');
    if (charLevelSpan) {
        charLevelSpan.textContent = Build.level;
    }
    
    // Refresh power displays
    if (typeof refreshPowerDisplay === 'function') {
        refreshPowerDisplay();
    }
    
    // Recalculate stats and bonuses
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    
    console.log('UI refreshed after import');
}
