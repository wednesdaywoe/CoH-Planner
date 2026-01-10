/**
 * City of Heroes Planner - Pool Powers
 * 
 * Functions for pool power selection
 */

/**
 * Open pool power selection modal
 */
function openPoolPowerModal() {
    document.getElementById('poolModal').classList.add('active');
}

/**
 * Close pool power selection modal
 */
function closePoolModal() {
    document.getElementById('poolModal').classList.remove('active');
}

/**
 * Add a pool power to the build
 * @param {string} pool - Pool name (e.g., 'Flight', 'Speed')
 * @param {string} powerName - Power name (e.g., 'Hover', 'Hasten')
 * @param {number} level - Minimum level required
 */
function addPoolPower(pool, powerName, level) {
    // Use Build.pools (array of pools) rather than deprecated Build.pool
    // Check pool limit (max 4 distinct pools)
    const poolsUsed = Build.pools.length;
    let poolData = Build.pools.find(p => p.name === pool || p.id === pool);
    const newPool = !poolData;

    if (newPool && poolsUsed >= 4) {
        alert('Cannot select more than 4 different power pools!');
        return;
    }

    // Check if power already exists across all pools
    const existing = Build.pools.some(p => p.powers && p.powers.some(pp => pp.name === powerName));
    if (existing) {
        alert(`${powerName} is already in your build!`);
        return;
    }

    // Ensure pool entry exists
    if (!poolData) {
        poolData = { id: pool, name: pool, powers: [] };
        Build.pools.push(poolData);
    }

    // Create and add power to the pool
    const power = createPower(powerName, `${pool} Pool`, level, 6);
    poolData.powers.push(power);

    // Add to DOM
    addPoolPowerToDOM(power);

    // Update pool counter
    updatePoolCounter();

    closePoolModal();
}
