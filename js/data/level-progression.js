/**
 * City of Heroes - Level Progression Data
 * Parsed from NLevels.txt
 */

const LEVEL_PROGRESSION = [
    { level: 1, powers: 1, slots: 0, notes: "First primary power" },
    { level: 2, powers: 1, slots: 0, notes: "First secondary power" },
    { level: 3, powers: 0, slots: 2 },
    { level: 4, powers: 1, slots: 0 },
    { level: 5, powers: 0, slots: 2 },
    { level: 6, powers: 1, slots: 0 },
    { level: 7, powers: 0, slots: 2 },
    { level: 8, powers: 1, slots: 0 },
    { level: 9, powers: 0, slots: 3 },
    { level: 10, powers: 1, slots: 0 },
    { level: 11, powers: 0, slots: 2 },
    { level: 12, powers: 1, slots: 0 },
    { level: 13, powers: 0, slots: 2 },
    { level: 14, powers: 1, slots: 0 },
    { level: 15, powers: 0, slots: 2 },
    { level: 16, powers: 1, slots: 3, notes: "Power AND 3 slots" },
    { level: 17, powers: 0, slots: 2 },
    { level: 18, powers: 1, slots: 0 },
    { level: 19, powers: 0, slots: 2 },
    { level: 20, powers: 1, slots: 0, notes: "Cape unlocked" },
    { level: 21, powers: 0, slots: 2 },
    { level: 22, powers: 1, slots: 0 },
    { level: 23, powers: 0, slots: 3 },
    { level: 24, powers: 1, slots: 0 },
    { level: 25, powers: 0, slots: 2 },
    { level: 26, powers: 1, slots: 0 },
    { level: 27, powers: 0, slots: 2 },
    { level: 28, powers: 1, slots: 0 },
    { level: 29, powers: 0, slots: 2 },
    { level: 30, powers: 1, slots: 0, notes: "Aura unlocked" },
    { level: 31, powers: 0, slots: 3 },
    { level: 32, powers: 1, slots: 0 },
    { level: 33, powers: 0, slots: 3 },
    { level: 34, powers: 0, slots: 3 },
    { level: 35, powers: 1, slots: 0 },
    { level: 36, powers: 0, slots: 3 },
    { level: 37, powers: 0, slots: 3 },
    { level: 38, powers: 1, slots: 0 },
    { level: 39, powers: 0, slots: 3 },
    { level: 40, powers: 0, slots: 3, notes: "New costume slot" },
    { level: 41, powers: 1, slots: 0 },
    { level: 42, powers: 0, slots: 3 },
    { level: 43, powers: 0, slots: 3 },
    { level: 44, powers: 1, slots: 0 },
    { level: 45, powers: 0, slots: 3 },
    { level: 46, powers: 0, slots: 3 },
    { level: 47, powers: 1, slots: 0 },
    { level: 48, powers: 0, slots: 3 },
    { level: 49, powers: 1, slots: 0 },
    { level: 50, powers: 0, slots: 3, notes: "Final level!" }
];

/**
 * Get levels that grant power picks
 * @returns {Array<number>} Array of levels that grant powers
 */
function getPowerLevels() {
    return LEVEL_PROGRESSION
        .filter(entry => entry.powers > 0)
        .map(entry => entry.level);
}

/**
 * Get the next level that grants a power pick
 * @param {number} currentLevel - Current character level
 * @returns {number|null} Next power level, or null if at max
 */
function getNextPowerLevel(currentLevel) {
    const powerLevels = getPowerLevels();
    const nextLevel = powerLevels.find(level => level > currentLevel);
    return nextLevel || null;
}

/**
 * Get progression data for a specific level
 * @param {number} level - Level to query
 * @returns {Object|null} Progression data or null
 */
function getProgressionData(level) {
    return LEVEL_PROGRESSION.find(entry => entry.level === level) || null;
}

/**
 * Count total power picks up to a given level
 * @param {number} level - Level to count to
 * @returns {number} Total power picks available
 */
function getTotalPowerPicks(level) {
    return LEVEL_PROGRESSION
        .filter(entry => entry.level <= level && entry.powers > 0)
        .reduce((sum, entry) => sum + entry.powers, 0);
}

/**
 * Count total slots awarded up to a given level
 * @param {number} level - Level to count to
 * @returns {number} Total slots awarded
 */
function getTotalSlots(level) {
    return LEVEL_PROGRESSION
        .filter(entry => entry.level <= level)
        .reduce((sum, entry) => sum + entry.slots, 0);
}

/**
 * Calculate the character level based on number of powers selected
 * Uses actual CoH progression: powers at 1,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,35,38,41,44,47,49
 * This replaces manual level tracking with progression-based auto-level
 * 
 * @param {number} totalPowerCount - Total powers selected (primary + secondary + pools + epics)
 * @returns {number} Appropriate character level for that power count
 */
function calculateLevelFromPowerCount(totalPowerCount) {
    if (totalPowerCount === 0) return 1;
    
    // Count how many levels we need to go through to get this many power picks
    let powerPicksAccumulated = 0;
    
    for (let i = 0; i < LEVEL_PROGRESSION.length; i++) {
        const entry = LEVEL_PROGRESSION[i];
        if (entry.powers > 0) {
            powerPicksAccumulated += entry.powers;
            if (powerPicksAccumulated >= totalPowerCount) {
                return entry.level;
            }
        }
    }
    
    // If we somehow exceed all power picks, stay at max level
    return LEVEL_PROGRESSION[LEVEL_PROGRESSION.length - 1].level;
}
