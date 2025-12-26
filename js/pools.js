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
    // Check pool limit
    const poolsUsed = Build.pool.poolsUsed.length;
    const newPool = !Build.pool.poolsUsed.includes(pool);
    
    if (newPool && poolsUsed >= 4) {
        alert('Cannot select more than 4 different power pools!');
        return;
    }
    
    // Check if power already exists
    const existing = Build.pool.powers.find(p => p.name === powerName);
    if (existing) {
        alert(`${powerName} is already in your build!`);
        return;
    }
    
    // Create and add power
    const power = createPower(powerName, `${pool} Pool`, level, 6);
    addPower('pool', power);
    
    // Add to DOM
    addPoolPowerToDOM(power);
    
    // Update pool counter
    updatePoolCounter();
    
    closePoolModal();
}
