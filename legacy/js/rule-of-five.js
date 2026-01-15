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

        console.log(`[Rule of 5] Processing power: ${powerName}, slots:`, power.slots);

        // Track which sets are slotted in this power
        const setsInPower = {};

        power.slots.forEach((slot, idx) => {
            console.log(`[Rule of 5] Slot ${idx}:`, slot, `type="${slot?.type}", setId="${slot?.setId}", pieceNum=${slot?.pieceNum}`);
            if (slot && slot.type === 'io-set') {
                const setId = slot.setId;
                console.log(`[Rule of 5] Found io-set slot, setId: "${setId}", pieceNum: ${slot.pieceNum}`);

                // Check if this IO's set bonuses are suppressed by exemplar level
                const effectiveLevel = Build.exemplarLevel || Build.level;
                let bonusesActive = true;

                if (slot.attuned) {
                    // Attuned: bonuses active down to (minLevel - 3)
                    const minBonusLevel = (slot.minLevel || 1) - 3;
                    bonusesActive = effectiveLevel >= minBonusLevel;
                    console.log(`[Rule of 5] Attuned check: effectiveLevel=${effectiveLevel}, minBonusLevel=${minBonusLevel}, active=${bonusesActive}`);
                } else {
                    // Non-attuned: bonuses active if exemplar level >= (IO level - 3)
                    const ioLevel = slot.level || 50;
                    bonusesActive = effectiveLevel >= (ioLevel - 3);
                    console.log(`[Rule of 5] Non-attuned check: effectiveLevel=${effectiveLevel}, ioLevel=${ioLevel}, active=${bonusesActive}`);
                }

                // Only count this piece if bonuses are active
                if (bonusesActive) {
                    if (!setsInPower[setId]) {
                        setsInPower[setId] = [];
                    }
                    setsInPower[setId].push(slot.pieceNum);
                    console.log(`[Rule of 5] Added piece ${slot.pieceNum} to set ${setId}, now has ${setsInPower[setId].length} pieces`);
                }
            } else if (slot) {
                console.log(`[Rule of 5] Slot ${idx} is not io-set, type: "${slot.type}"`);
            }
        });
        
        // For each set, check how many pieces are slotted
        console.log(`[Rule of 5] setsInPower for ${powerName}:`, setsInPower);
        Object.keys(setsInPower).forEach(setId => {
            const set = IO_SETS[setId];
            console.log(`[Rule of 5] Looking up set "${setId}" in IO_SETS:`, set ? `Found: ${set.name}` : 'NOT FOUND');
            if (!set) return;

            const pieces = setsInPower[setId];
            const pieceCount = pieces.length;
            console.log(`[Rule of 5] Set ${set.name} has ${pieceCount} pieces slotted, bonuses:`, set.bonuses);

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
    console.log('[Rule of 5] Build.primary:', Build.primary);
    console.log('[Rule of 5] Build.secondary:', Build.secondary);
    console.log('[Rule of 5] Build.pools:', Build.pools);
    if (Build.primary && Build.primary.powers) {
        console.log('[Rule of 5] Processing', Build.primary.powers.length, 'primary powers');
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
    
    console.log('[Rule of 5] Total bonuses collected:', bonuses);
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
