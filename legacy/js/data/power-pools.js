/**
 * City of Heroes: Homecoming - Power Pools Registry
 * 
 * Central registry for all power pools.
 * Individual pool files will register themselves here.
 */

const POWER_POOLS = {};

/**
 * Get a power pool by ID
 * @param {string} poolId - The pool ID (e.g., 'fighting', 'speed')
 * @returns {Object|null} Pool data or null if not found
 */
function getPool(poolId) {
    return POWER_POOLS[poolId] || null;
}

/**
 * Get all available power pools
 * @returns {Array} Array of pool objects
 */
function getAllPools() {
    return Object.values(POWER_POOLS);
}

/**
 * Get pools available to a specific archetype
 * @param {string} archetypeId - The archetype ID
 * @returns {Array} Array of available pool objects
 */
function getPoolsForArchetype(archetypeId) {
    // Most pools are available to all archetypes
    // Special pools like Utility Belt have requirements
    return getAllPools().filter(pool => {
        // Check if pool has archetype restrictions
        if (pool.requires && pool.requires.includes('arch')) {
            // Parse requirements (simplified)
            // For now, most pools are available to all
            return true;
        }
        return true;
    });
}

/**
 * Get a specific power from a pool
 * @param {string} poolId - The pool ID
 * @param {string} powerName - The power name
 * @returns {Object|null} Power data or null if not found
 */
function getPoolPower(poolId, powerName) {
    const pool = getPool(poolId);
    if (!pool) return null;
    
    return pool.powers.find(p => p.name === powerName) || null;
}

/**
 * Get powers from pool by rank
 * @param {string} poolId - The pool ID
 * @param {number} rank - The rank (1-5)
 * @returns {Array} Array of powers at that rank
 */
function getPoolPowersByRank(poolId, rank) {
    const pool = getPool(poolId);
    if (!pool) return [];
    
    return pool.powers.filter(p => p.rank === rank);
}

/**
 * Check if a pool power meets prerequisites
 * @param {string} poolId - The pool ID
 * @param {string} powerName - The power name
 * @param {Object} build - Current build state
 * @returns {Object} { canSelect: boolean, reason: string }
 */
function checkPoolPowerPrerequisites(poolId, powerName, build) {
    const pool = getPool(poolId);
    if (!pool) {
        return { canSelect: false, reason: 'Pool not found' };
    }
    
    const power = pool.powers.find(p => p.name === powerName);
    if (!power) {
        return { canSelect: false, reason: 'Power not found' };
    }
    
    // Check level requirement
    if (build.level < 4) {
        return { canSelect: false, reason: 'Power pools unlock at level 4' };
    }
    
    // Rank 1-2: Available immediately at level 4+
    if (power.rank <= 2) {
        return { canSelect: true, reason: '' };
    }
    
    // Special handling for travel powers that unlock at level 4
    // These rank 3+ powers bypass normal level requirements
    const travelPowersLevel4 = [
        { pool: 'flight', power: 'Fly' },
        { pool: 'teleportation', power: 'Teleport' },
        { pool: 'leaping', power: 'Super Jump' },
        { pool: 'speed', power: 'Super Speed' },
        { pool: 'experimentation', power: 'Speed of Sound' },
        { pool: 'invisibility', power: 'Infiltration' },
        { pool: 'sorcery', power: 'Mystic Flight' }
    ];
    
    const isTravelPowerLevel4 = travelPowersLevel4.some(t => t.pool === poolId && t.power === power.name);
    
    // Travel powers at level 4: Available immediately at level 4+ with no prerequisites
    if (isTravelPowerLevel4) {
        if (build.level < 4) {
            return { canSelect: false, reason: 'Requires level 4' };
        }
        return { canSelect: true, reason: '' };
    }
    
    // All other rank 3+: Require level 14
    if (build.level < 14) {
        return { canSelect: false, reason: 'Requires level 14' };
    }
    
    // Check if pool is selected
    const poolData = build.pools.find(p => p.id === poolId);
    if (!poolData) {
        return { canSelect: false, reason: 'Must select a rank 1-2 power first' };
    }
    
    // Rank 3: Need 1 other power
    if (power.rank === 3) {
        if (poolData.powers.length < 1) {
            return { canSelect: false, reason: 'Requires 1 other power from this pool' };
        }
        return { canSelect: true, reason: '' };
    }
    
    // Rank 4-5: Need 2 other powers
    if (power.rank >= 4) {
        if (poolData.powers.length < 2) {
            const needed = 2 - poolData.powers.length;
            return { canSelect: false, reason: `Requires ${needed} more power(s) from this pool` };
        }
        return { canSelect: true, reason: '' };
    }
    
    return { canSelect: true, reason: '' };
}

/**
 * Get power pool statistics
 * @returns {Object} Statistics about loaded pools
 */
function getPoolStats() {
    const pools = getAllPools();
    const totalPowers = pools.reduce((sum, pool) => sum + pool.powers.length, 0);
    
    return {
        totalPools: pools.length,
        totalPowers: totalPowers,
        pools: pools.map(p => ({
            id: p.id,
            name: p.name,
            powerCount: p.powers.length
        }))
    };
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.POWER_POOLS = POWER_POOLS;
    window.getPool = getPool;
    window.getAllPools = getAllPools;
    window.getPoolsForArchetype = getPoolsForArchetype;
    window.getPoolPower = getPoolPower;
    window.getPoolPowersByRank = getPoolPowersByRank;
    window.checkPoolPowerPrerequisites = checkPoolPowerPrerequisites;
    window.getPoolStats = getPoolStats;
}

// Log when loaded
console.log('Power Pools registry loaded');
