/**
 * City of Heroes: Homecoming - Epic Power Pools Registry
 * 
 * Central registry for all epic/ancillary power pools.
 * Individual epic pool files will register themselves here.
 * 
 * Epic pools are:
 * - Archetype-specific
 * - Unlocked at level 35
 * - Registered with archetype namespace: 'archetype/pool_name'
 */

const EPIC_POOLS = {};

/**
 * Get an epic pool by archetype and pool ID
 * @param {string} archetypeId - The archetype ID
 * @param {string} poolId - The pool ID
 * @returns {Object|null} Epic pool data or null if not found
 */
function getEpicPool(archetypeId, poolId) {
    const key = `${archetypeId}/${poolId}`;
    return EPIC_POOLS[key] || null;
}

/**
 * Get all epic pools available to a specific archetype
 * @param {string} archetypeId - The archetype ID
 * @returns {Array} Array of available epic pool objects
 */
function getEpicPoolsForArchetype(archetypeId) {
    const pools = [];
    
    Object.entries(EPIC_POOLS).forEach(([key, pool]) => {
        if (pool.archetype === archetypeId) {
            pools.push(pool);
        }
    });
    
    return pools;
}

/**
 * Get a specific power from an epic pool
 * @param {string} archetypeId - The archetype ID
 * @param {string} poolId - The pool ID
 * @param {string} powerName - The power name
 * @returns {Object|null} Power data or null if not found
 */
function getEpicPower(archetypeId, poolId, powerName) {
    const pool = getEpicPool(archetypeId, poolId);
    if (!pool) return null;
    
    return pool.powers.find(p => p.name === powerName) || null;
}

/**
 * Get powers from epic pool by rank
 * @param {string} archetypeId - The archetype ID
 * @param {string} poolId - The pool ID
 * @param {number} rank - The rank (1-5)
 * @returns {Array} Array of powers at that rank
 */
function getEpicPowersByRank(archetypeId, poolId, rank) {
    const pool = getEpicPool(archetypeId, poolId);
    if (!pool) return [];
    
    return pool.powers.filter(p => p.rank === rank);
}

/**
 * Check if epic pools are unlocked for current level
 * @param {Object} build - Current build state
 * @returns {boolean} True if epic pools are available
 */
function areEpicPoolsUnlocked(build) {
    return build.level >= 35;
}

/**
 * Check if an epic power meets prerequisites
 * Epic pools have simpler rules than regular pools:
 * - Must be level 35+
 * - All powers available immediately once pool is selected
 * - Only one epic pool can be selected per character
 * 
 * @param {string} archetypeId - The archetype ID
 * @param {string} poolId - The pool ID
 * @param {string} powerName - The power name
 * @param {Object} build - Current build state
 * @returns {Object} { canSelect: boolean, reason: string }
 */
function checkEpicPowerPrerequisites(archetypeId, poolId, powerName, build) {
    const pool = getEpicPool(archetypeId, poolId);
    if (!pool) {
        return { canSelect: false, reason: 'Epic pool not found' };
    }
    
    const power = pool.powers.find(p => p.name === powerName);
    if (!power) {
        return { canSelect: false, reason: 'Power not found' };
    }
    
    // Check level requirement
    if (build.level < 35) {
        return { canSelect: false, reason: 'Epic pools unlock at level 35' };
    }
    
    // Check if character already has a different epic pool selected
    if (build.epicPool && build.epicPool.id !== poolId) {
        return { canSelect: false, reason: 'Only one epic pool can be selected' };
    }
    
    // Check specific power level requirement
    if (build.level < power.available) {
        return { canSelect: false, reason: `Requires level ${power.available}` };
    }
    
    // All epic powers in a pool are available once the pool is selected
    return { canSelect: true, reason: '' };
}

/**
 * Check if an epic pool can be selected
 * @param {string} archetypeId - The archetype ID
 * @param {string} poolId - The pool ID
 * @param {Object} build - Current build state
 * @returns {Object} { canSelect: boolean, reason: string }
 */
function canSelectEpicPool(archetypeId, poolId, build) {
    // Must be level 35+
    if (build.level < 35) {
        return { canSelect: false, reason: 'Epic pools unlock at level 35' };
    }
    
    // Can only have one epic pool
    if (build.epicPool && build.epicPool.id !== poolId) {
        return { canSelect: false, reason: `Already selected ${build.epicPool.name}` };
    }
    
    // Must be available to this archetype
    const pool = getEpicPool(archetypeId, poolId);
    if (!pool) {
        return { canSelect: false, reason: 'Not available to this archetype' };
    }
    
    return { canSelect: true, reason: '' };
}

/**
 * Get epic pool statistics
 * @returns {Object} Statistics about loaded epic pools
 */
function getEpicPoolStats() {
    const pools = Object.values(EPIC_POOLS);
    const totalPowers = pools.reduce((sum, pool) => sum + pool.powers.length, 0);
    
    // Group by archetype
    const byArchetype = {};
    pools.forEach(pool => {
        if (!byArchetype[pool.archetype]) {
            byArchetype[pool.archetype] = 0;
        }
        byArchetype[pool.archetype]++;
    });
    
    return {
        totalPools: pools.length,
        totalPowers: totalPowers,
        byArchetype: byArchetype,
        pools: pools.map(p => ({
            id: p.id,
            name: p.name,
            archetype: p.archetype,
            powerCount: p.powers.length
        }))
    };
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EPIC_POOLS = EPIC_POOLS;
    window.getEpicPool = getEpicPool;
    window.getEpicPoolsForArchetype = getEpicPoolsForArchetype;
    window.getEpicPower = getEpicPower;
    window.getEpicPowersByRank = getEpicPowersByRank;
    window.areEpicPoolsUnlocked = areEpicPoolsUnlocked;
    window.checkEpicPowerPrerequisites = checkEpicPowerPrerequisites;
    window.canSelectEpicPool = canSelectEpicPool;
    window.getEpicPoolStats = getEpicPoolStats;
}

// Log when loaded
console.log('Epic Pools registry loaded');
