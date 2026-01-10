/**
 * City of Heroes: Rule of 5 System
 * 
 * Tracks set bonuses and enforces the "Rule of 5":
 * Identical set bonus values can only stack 5 times maximum.
 * 
 * Example:
 * - Thunderstrike 4pc gives +9% Accuracy (can stack 5x)
 * - OtherSet 6pc gives +9% Accuracy (counts toward same cap)
 * - DifferentSet 2pc gives +5% Accuracy (separate cap, can stack 5x)
 */

// ============================================
// RULE OF 5 TRACKING
// ============================================

/**
 * Normalize stat names from IO set bonuses to internal stat keys
 * @param {string} statName - Stat name from IO set data
 * @returns {string|null} Normalized stat key or null if unknown
 */
function normalizeStatName(statName) {
    if (!statName) return null;
    
    // Map of stat names from IO sets to internal stat keys
    const statMap = {
        // Offense (various formats)
        'Damage': 'damage',
        'damage': 'damage',
        'DamageBuff': 'damage',
        'Accuracy': 'accuracy',
        'accuracy': 'accuracy',
        'ToHit': 'tohit',
        'tohit': 'tohit',
        'Recharge': 'recharge',
        'recharge': 'recharge',
        'RechargeTime': 'recharge',
        'EnduranceDiscount': 'endrdx',
        'endurance_discount': 'endrdx',
        'EnduranceReduction': 'endrdx',
        
        // Defense - Positional
        'MeleeDef': 'defMelee',
        'melee_defense': 'defMelee',
        'RangedDef': 'defRanged',
        'ranged_defense': 'defRanged',
        'AoEDef': 'defAoE',
        'aoe_defense': 'defAoE',
        
        // Defense - Typed
        'SmashingDef': 'defSmashing',
        'smashing_defense': 'defSmashing',
        'LethalDef': 'defLethal',
        'lethal_defense': 'defLethal',
        'FireDef': 'defFire',
        'fire_defense': 'defFire',
        'ColdDef': 'defCold',
        'cold_defense': 'defCold',
        'EnergyDef': 'defEnergy',
        'energy_defense': 'defEnergy',
        'defense_(energy)': 'defEnergy',
        'NegativeDef': 'defNegative',
        'negative_defense': 'defNegative',
        'defense_(negative)': 'defNegative',
        'PsionicDef': 'defPsionic',
        'psionic_defense': 'defPsionic',
        'defense_(psionic)': 'defPsionic',
        'ToxicDef': 'defToxic',
        'toxic_defense': 'defToxic',
        'defense_(toxic)': 'defToxic',
        
        // Defense - Positional (also aliased from numbered format)
        'defense_(melee)': 'defMelee',
        'defense_(ranged)': 'defRanged',
        'defense_(aoe)': 'defAoE',
        
        // Defense - Typed (also aliased from numbered format)
        'defense_(smashing)': 'defSmashing',
        'defense_(lethal)': 'defLethal',
        'defense_(fire)': 'defFire',
        'defense_(cold)': 'defCold',
        
        // Resistance
        'SmashingRes': 'resSmashing',
        'damage_resistance_(smashing)': 'resSmashing',
        'LethalRes': 'resLethal',
        'damage_resistance_(lethal)': 'resLethal',
        'FireRes': 'resFire',
        'damage_resistance_(fire)': 'resFire',
        'ColdRes': 'resCold',
        'damage_resistance_(cold)': 'resCold',
        'EnergyRes': 'resEnergy',
        'damage_resistance_(energy)': 'resEnergy',
        'NegativeRes': 'resNegative',
        'damage_resistance_(negative)': 'resNegative',
        'PsionicRes': 'resPsionic',
        'damage_resistance_(psionic)': 'resPsionic',
        'ToxicRes': 'resToxic',
        'damage_resistance_(toxic)': 'resToxic',
        
        // Recovery & HP
        'Recovery': 'recovery',
        'recovery': 'recovery',
        'Regeneration': 'regeneration',
        'regeneration': 'regeneration',
        'MaxHitPoints': 'maxhp',
        'maximum_hitpoints': 'maxhp',
        'MaxHealth': 'maxhp',
        'MaxEndurance': 'maxend',
        'maximum_endurance': 'maxend',
        
        // Movement
        'RunSpeed': 'runspeed',
        'run_speed': 'runspeed',
        'increased_movement': 'runspeed',
        'FlySpeed': 'flyspeed',
        'fly_speed': 'flyspeed',
        'JumpSpeed': 'jumpspeed',
        'jump_speed': 'jumpspeed',
        'JumpHeight': 'jumpheight',
        'jump_height': 'jumpheight',
        
        // Special stats (not yet in dashboard, but won't cause errors)
        'mez_resistance_(all)': null,  // Mez resistance not tracked yet
        'MezRes': null
    };
    
    // Return the mapped stat, null for explicitly ignored stats, or undefined for unknown stats
    return statMap.hasOwnProperty(statName) ? statMap[statName] : undefined;
}

/**
 * Global bonus tracking object
 * Structure:
 * {
 *   'accuracy': {
 *     '9.0': { count: 3, sources: [...], capped: false },
 *     '5.0': { count: 5, sources: [...], capped: true }
 *   },
 *   'damage': { ... }
 * }
 */
const BonusTracking = {};

/**
 * Reset bonus tracking (call when build changes)
 */
function resetBonusTracking() {
    Object.keys(BonusTracking).forEach(key => delete BonusTracking[key]);
}

/**
 * Get all set bonuses from the build with Rule of 5 applied
 * @returns {Object} Aggregated bonuses by stat
 */
function getAggregatedSetBonuses() {
    // Reset tracking
    resetBonusTracking();
    
    // Collect all bonuses from all powers
    const allBonuses = collectAllSetBonuses();
    
    // Track each bonus by stat and value
    allBonuses.forEach(bonus => {
        const stat = bonus.stat;
        const value = parseFloat(bonus.value);
        const valueKey = value.toFixed(2); // Use 2 decimal precision as key
        
        // Initialize stat tracking if needed
        if (!BonusTracking[stat]) {
            BonusTracking[stat] = {};
        }
        
        // Initialize value tracking if needed
        if (!BonusTracking[stat][valueKey]) {
            BonusTracking[stat][valueKey] = {
                count: 0,
                sources: [],
                capped: false,
                value: value
            };
        }
        
        const tracking = BonusTracking[stat][valueKey];
        
        // Only count if under cap
        if (tracking.count < 5) {
            tracking.count++;
            tracking.sources.push(bonus.source);
        } else {
            tracking.capped = true;
        }
    });
    
    // Aggregate totals by stat
    const aggregated = {};
    
    Object.keys(BonusTracking).forEach(stat => {
        let total = 0;
        
        Object.keys(BonusTracking[stat]).forEach(valueKey => {
            const tracking = BonusTracking[stat][valueKey];
            total += tracking.value * tracking.count;
        });
        
        aggregated[stat] = total;
    });
    
    return aggregated;
}

/**
 * Collect all set bonuses from all powers in build
 * @returns {Array} Array of bonus objects
 */
function collectAllSetBonuses() {
    const bonuses = [];
    
    // Helper to process a single power
    const processPower = (power, powerName) => {
        if (!power.slots) return;
        
        // Track which sets are slotted in this power
        const setsInPower = {};
        
        power.slots.forEach(slot => {
            if (slot && slot.type === 'io-set') {
                const setId = slot.setId;
                if (!setsInPower[setId]) {
                    setsInPower[setId] = [];
                }
                setsInPower[setId].push(slot.pieceNum);
            }
        });
        
        // For each set, check how many pieces are slotted
        Object.keys(setsInPower).forEach(setId => {
            const set = IO_SETS[setId];
            if (!set) return;
            
            const pieces = setsInPower[setId];
            const pieceCount = pieces.length;
            
            // Check each set bonus
            set.bonuses.forEach(bonus => {
                if (!bonus || !bonus.pieces) return;
                
                // Only count if we have enough pieces slotted
                if (pieceCount < bonus.pieces) return;
                
                // Handle bonuses with effects array (our format)
                if (bonus.effects && Array.isArray(bonus.effects)) {
                    bonus.effects.forEach(effect => {
                        const stat = normalizeStatName(effect.stat);
                        if (stat === undefined) {
                            // Unknown stat - not in our mapping at all
                            console.warn('Unknown stat in set bonus:', effect.stat, 'in', set.name);
                            return;
                        }
                        if (stat === null) {
                            // Explicitly ignored stat (like mez resistance)
                            return;
                        }
                        
                        bonuses.push({
                            stat: stat,
                            value: effect.value,
                            source: `${set.name} (${bonus.pieces}pc in ${powerName})`,
                            setName: set.name,
                            pieceCount: bonus.pieces,
                            powerName: powerName
                        });
                    });
                }
                // Legacy format support: direct stat/value on bonus object
                else if (bonus.stat && bonus.value !== undefined) {
                    const stat = normalizeStatName(bonus.stat);
                    if (stat) {
                        bonuses.push({
                            stat: stat,
                            value: bonus.value,
                            source: `${set.name} (${bonus.pieces}pc in ${powerName})`,
                            setName: set.name,
                            pieceCount: bonus.pieces,
                            powerName: powerName
                        });
                    }
                }
            });
        });
    };
    
    // Process primary powers
    if (Build.primary && Build.primary.powers) {
        Build.primary.powers.forEach(power => {
            processPower(power, power.name);
        });
    }
    
    // Process secondary powers
    if (Build.secondary && Build.secondary.powers) {
        Build.secondary.powers.forEach(power => {
            processPower(power, power.name);
        });
    }
    
    // Process pool powers
    if (Build.pools) {
        Build.pools.forEach(pool => {
            if (pool.powers) {
                pool.powers.forEach(power => {
                    processPower(power, power.name);
                });
            }
        });
    }
    
    return bonuses;
}

/**
 * Get detailed breakdown for a specific stat
 * Shows each unique value with count and sources
 * @param {string} stat - Stat name (e.g., 'accuracy', 'damage')
 * @returns {Array} Array of tracking objects
 */
function getStatBreakdown(stat) {
    if (!BonusTracking[stat]) return [];
    
    const breakdown = [];
    
    Object.keys(BonusTracking[stat]).forEach(valueKey => {
        const tracking = BonusTracking[stat][valueKey];
        breakdown.push({
            value: tracking.value,
            count: tracking.count,
            sources: tracking.sources,
            capped: tracking.capped,
            total: tracking.value * tracking.count
        });
    });
    
    // Sort by value descending
    breakdown.sort((a, b) => b.value - a.value);
    
    return breakdown;
}

/**
 * Check if a specific bonus value is at cap for a stat
 * @param {string} stat - Stat name
 * @param {number} value - Bonus value
 * @returns {boolean} True if capped
 */
function isBonusCapped(stat, value) {
    const valueKey = value.toFixed(2);
    return BonusTracking[stat] && 
           BonusTracking[stat][valueKey] && 
           BonusTracking[stat][valueKey].capped;
}

/**
 * Get count of a specific bonus value for a stat
 * @param {string} stat - Stat name
 * @param {number} value - Bonus value
 * @returns {number} Count (0-5)
 */
function getBonusCount(stat, value) {
    const valueKey = value.toFixed(2);
    return BonusTracking[stat] && BonusTracking[stat][valueKey]
        ? BonusTracking[stat][valueKey].count
        : 0;
}

// ============================================
// LEGACY COMPATIBILITY
// ============================================

/**
 * Legacy function - now uses Rule of 5 system
 * @returns {Object} Set bonuses by stat
 */
function calculateSetBonuses() {
    return getAggregatedSetBonuses();
}

/**
 * Legacy function - now uses Rule of 5 system
 * @returns {Array} Active set bonuses
 */
function getActiveSetBonuses() {
    const bonuses = [];
    
    Object.keys(BonusTracking).forEach(stat => {
        Object.keys(BonusTracking[stat]).forEach(valueKey => {
            const tracking = BonusTracking[stat][valueKey];
            
            tracking.sources.forEach(source => {
                bonuses.push({
                    stat: stat,
                    value: tracking.value,
                    source: source,
                    type: 'set'
                });
            });
        });
    });
    
    return bonuses;
}
