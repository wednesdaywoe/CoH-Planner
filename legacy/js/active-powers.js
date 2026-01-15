/**
 * City of Heroes: Active Power Bonuses
 * 
 * Calculates bonuses from active buff powers (Aim, Build Up, etc.)
 */

/**
 * Get all active power bonuses that affect a power
 * @param {Object} targetPower - Power being affected (null for general check)
 * @returns {Object} Bonuses { damage, tohit, recharge }
 */
function getActivePowerBonuses(targetPower = null) {
    const bonuses = {
        damage: 0,
        tohit: 0,
        recharge: 0
    };
    
    // Don't apply buffs to the buff power itself
    const targetPowerName = targetPower ? targetPower.name : null;
    
    // Helper to check all powers in the build
    const checkPowerCategory = (powers) => {
        if (!powers) return;
        
        powers.forEach(power => {
            // Skip if this is the target power itself
            if (targetPowerName && power.name === targetPowerName) return;
            
            // Skip if not active
            if (!power.isActive) return;
            
            // Skip if no effects
            if (!power.effects) return;
            
            // Add damage buff
            if (power.effects.damageBuff) {
                bonuses.damage += power.effects.damageBuff;
            }
            
            // Add to-hit buff
            if (power.effects.tohitBuff) {
                bonuses.tohit += power.effects.tohitBuff;
            }
            
            // Add recharge buff (if any)
            if (power.effects.rechargeBuff) {
                bonuses.recharge += power.effects.rechargeBuff;
            }
        });
    };
    
    // Check all power categories
    if (Build.primary && Build.primary.powers) {
        checkPowerCategory(Build.primary.powers);
    }
    
    if (Build.secondary && Build.secondary.powers) {
        checkPowerCategory(Build.secondary.powers);
    }
    
    if (Build.pools) {
        Build.pools.forEach(pool => {
            checkPowerCategory(pool.powers);
        });
    }
    
    return bonuses;
}

/**
 * Get list of currently active buff powers
 * @returns {Array} Array of active buff powers
 */
function getActiveBuffPowers() {
    const activeBuffs = [];
    
    const checkCategory = (powers) => {
        if (!powers) return;
        
        powers.forEach(power => {
            if (power.isActive && power.effects && 
                (power.effects.damageBuff || power.effects.tohitBuff)) {
                activeBuffs.push({
                    name: power.name,
                    damageBuff: power.effects.damageBuff || 0,
                    tohitBuff: power.effects.tohitBuff || 0,
                    duration: power.effects.duration || 0
                });
            }
        });
    };
    
    if (Build.primary && Build.primary.powers) {
        checkCategory(Build.primary.powers);
    }
    
    if (Build.secondary && Build.secondary.powers) {
        checkCategory(Build.secondary.powers);
    }
    
    if (Build.pools) {
        Build.pools.forEach(pool => {
            checkCategory(pool.powers);
        });
    }
    
    return activeBuffs;
}
