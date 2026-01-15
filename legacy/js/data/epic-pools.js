/**
 * City of Heroes Planner - Epic Pool Registry
 * 
 * Auto-loads and registers all epic pools
 * Epic pools unlock at level 35 and allow selection of only one pool
 */

// Epic pool registry (built dynamically from loaded epic pool data)
const EPIC_POOLS = {};

/**
 * Register an epic pool after it's loaded
 * @param {Object} epicPool - Epic pool data object (e.g., EPIC_BLASTER_DARK_MASTERY)
 */
function registerEpicPool(epicPool) {
    if (!epicPool || !epicPool.id) {
        console.warn('Invalid epic pool data:', epicPool);
        return;
    }
    
    EPIC_POOLS[epicPool.id] = epicPool;
    console.log(`Registered epic pool: ${epicPool.name} (${epicPool.archetype})`);
}

/**
 * Get an epic pool by ID
 * @param {string} poolId - The epic pool ID
 * @returns {Object|null} Epic pool data or null if not found
 */
function getEpicPool(poolId) {
    return EPIC_POOLS[poolId] || null;
}

/**
 * Get all epic pools for a specific archetype
 * @param {string} archetype - Archetype name
 * @returns {Array} Array of epic pools for that archetype
 */
function getEpicPoolsByArchetype(archetype) {
    return Object.values(EPIC_POOLS).filter(pool => pool.archetype === archetype);
}

/**
 * Get a specific power from an epic pool
 * @param {string} poolId - The epic pool ID
 * @param {string} powerName - The power name
 * @returns {Object|null} Power data or null if not found
 */
function getEpicPoolPower(poolId, powerName) {
    const pool = getEpicPool(poolId);
    if (!pool) return null;
    
    return pool.powers.find(p => p.name === powerName) || null;
}

/**
 * Get epic pool statistics
 * @returns {Object} Statistics about loaded epic pools
 */
function getEpicPoolStats() {
    const stats = {
        total: Object.keys(EPIC_POOLS).length,
        byArchetype: {}
    };
    
    Object.values(EPIC_POOLS).forEach(pool => {
        if (!stats.byArchetype[pool.archetype]) {
            stats.byArchetype[pool.archetype] = 0;
        }
        stats.byArchetype[pool.archetype]++;
    });
    
    return stats;
}

/**
 * Auto-register all epic pools that are loaded globally
 * This function is called after all epic pool data files are loaded
 */
function autoRegisterEpicPools() {
    let registered = 0;
    
    // Look for EPIC_* variables in the global scope
    for (const key in window) {
        if (key.startsWith('EPIC_') && typeof window[key] === 'object' && window[key].id) {
            registerEpicPool(window[key]);
            registered++;
        }
    }
    
    if (registered > 0) {
        console.log(`Auto-registered ${registered} epic pools`);
    }
    
    return registered;
}

// Auto-register when this script loads
autoRegisterEpicPools();

// Make functions available globally
window.registerEpicPool = registerEpicPool;
window.getEpicPool = getEpicPool;
window.getEpicPoolsByArchetype = getEpicPoolsByArchetype;
window.getEpicPoolPower = getEpicPoolPower;
window.getEpicPoolStats = getEpicPoolStats;
window.autoRegisterEpicPools = autoRegisterEpicPools;
window.EPIC_POOLS = EPIC_POOLS;
