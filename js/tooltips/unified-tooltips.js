/**
 * Generate tooltip HTML for an available power (Column 1)
 * Shows description and base values only
 * @param {Object} basePower - Original power definition
 * @returns {string} HTML for tooltip
 */
function generateAvailablePowerTooltipHTML(basePower) {
    if (!basePower) return '';
    
    let html = `<div class="tooltip-title">${basePower.name}</div>`;
    
    // Show description
    if (basePower.description) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-desc" style="font-size: 11px; font-style: italic; opacity: 0.9; line-height: 1.4;">${basePower.description}</div>`;
        html += `</div>`;
    }
    
    // Show short help if available
    if (basePower.shortHelp) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-value" style="font-size: 11px; color: var(--accent);">${basePower.shortHelp}</div>`;
        html += `</div>`;
    }
    
    // Show all base values
    if (basePower.effects) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 6px;">Base Values</div>`;
        
        const effects = basePower.effects;
        
        // Helper function to format effect name nicely
        const formatEffectName = (key) => {
            const nameMap = {
                'accuracy': 'Accuracy',
                'damage': 'Damage Scale',
                'recharge': 'Recharge Time',
                'endurance': 'Endurance Cost',
                'range': 'Range',
                'radius': 'Radius',
                'cast': 'Cast Time',
                'dotDamage': 'DoT Damage',
                'dotTicks': 'DoT Ticks',
                'tohitBuff': 'ToHit Buff',
                'tohitDebuff': 'ToHit Debuff',
                'damageBuff': 'Damage Buff',
                'damageDebuff': 'Damage Debuff',
                'defenseBuff': 'Defense Buff',
                'defenseDebuff': 'Defense Debuff',
                'resistanceBuff': 'Resistance Buff',
                'resistanceDebuff': 'Resistance Debuff',
                'rechargeBuff': 'Recharge Buff',
                'rechargeDebuff': 'Recharge Debuff',
                'speedBuff': 'Speed Buff',
                'slow': 'Slow',
                'buffDuration': 'Buff Duration',
                'duration': 'Duration',
                'heal': 'Heal',
                'absorption': 'Absorption'
            };
            return nameMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        };
        
        // Helper function to format effect value
        const formatEffectValue = (key, value) => {
            // Percentage values (buffs/debuffs)
            if (key.includes('Buff') || key.includes('Debuff') || key === 'slow') {
                // Debuffs should show as negative (matching in-game display)
                const isDebuff = key.includes('Debuff') || key === 'slow';
                const displayValue = isDebuff ? -value : value;
                const sign = displayValue > 0 ? '+' : '';
                const color = isDebuff ? '#ff6b6b' : 'var(--accent)';
                return `<span style="font-weight: 600; color: ${color};">${sign}${(displayValue * 100).toFixed(0)}%</span>`;
            }
            
            // Accuracy
            if (key === 'accuracy') {
                return `<span style="font-weight: 600;">${(value * 100).toFixed(0)}%</span>`;
            }
            
            // Time values
            if (key.includes('Time') || key === 'recharge' || key === 'cast' || key.includes('Duration')) {
                return `<span style="font-weight: 600;">${value.toFixed(1)}s</span>`;
            }
            
            // Distance values
            if (key === 'range' || key === 'radius') {
                return `<span style="font-weight: 600;">${value.toFixed(0)} ft</span>`;
            }
            
            // Damage object
            if (key === 'damage' && typeof value === 'object') {
                return `<span style="font-weight: 600;">${value.scale.toFixed(2)}</span>`;
            }
            
            // Default numeric
            return `<span style="font-weight: 600;">${value.toFixed(2)}</span>`;
        };
        
        // Order effects in a logical way
        const effectOrder = [
            'damage', 'accuracy', 'tohitBuff', 'damageBuff', 'rechargeBuff', 'speedBuff',
            'tohitDebuff', 'damageDebuff', 'defenseBuff', 'defenseDebuff',
            'resistanceBuff', 'resistanceDebuff', 'rechargeDebuff', 'slow',
            'heal', 'absorption',
            'recharge', 'endurance', 'range', 'radius',
            'cast', 'duration', 'buffDuration',
            'dotDamage', 'dotTicks'
        ];
        
        // Show effects in order
        let shownAny = false;
        effectOrder.forEach(key => {
            if (effects[key] !== undefined) {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0;">`;
                html += `<span style="opacity: 0.8;">${formatEffectName(key)}:</span>`;
                html += formatEffectValue(key, effects[key]);
                html += `</div>`;
                shownAny = true;
            }
        });
        
        // Show any remaining effects not in our ordered list
        Object.keys(effects).forEach(key => {
            if (!effectOrder.includes(key)) {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0;">`;
                html += `<span style="opacity: 0.8;">${formatEffectName(key)}:</span>`;
                const value = effects[key];
                if (typeof value === 'object') {
                    html += `<span style="font-weight: 600;">${JSON.stringify(value)}</span>`;
                } else {
                    html += formatEffectValue(key, value);
                }
                html += `</div>`;
                shownAny = true;
            }
        });
        
        if (!shownAny) {
            html += `<div style="opacity: 0.6; font-style: italic; font-size: 11px;">No numeric effects</div>`;
        }
        
        html += `</div>`;
    }
    
    // Show available level
    html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
    html += `<div style="font-size: 10px; opacity: 0.7; text-align: center;">Available at Level ${basePower.available}</div>`;
    html += `</div>`;
    
    return html;
}

/**
 * Show available power tooltip (Column 1)
 * @param {Event} event - Mouse event
 * @param {Object} basePower - Original power definition
 */
function showAvailablePowerTooltip(event, basePower) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = generateAvailablePowerTooltipHTML(basePower);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Unified Tooltip System
 * Handles all tooltips for the City of Heroes Planner
 */

// ============================================
// ENHANCEMENT SET TOOLTIPS
// ============================================

/**
 * Generate tooltip HTML for an enhancement set
 * Shows bonuses grouped by piece count
 * @param {Object} set - The IO set data
 * @param {number} currentPieces - How many pieces are currently slotted (optional)
 * @returns {string} HTML for tooltip
 */
function generateSetTooltipHTML(set, currentPieces = 0) {
    let html = `<div class="tooltip-title">${set.name}</div>`;
    
    // Set info
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">Level Range:</div>`;
    html += `<div class="tooltip-value">${set.minLevel}-${set.maxLevel}</div>`;
    html += `</div>`;
    
    // Group bonuses by piece count
    const bonusesByPieces = {};

    // Helper to normalize bonus entries (support objects and legacy strings)
    const normalizeBonus = (bonus) => {
        if (!bonus) return null;
        if (typeof bonus === 'string') {
            // Try to parse strings like "2 pieces: +3% Damage"
            const m = bonus.match(/(\d+)\s*pieces\s*:\s*\+?([\d.]+)%\s*(.+)/i);
            if (m) {
                return {
                    pieces: parseInt(m[1], 10),
                    value: parseFloat(m[2]),
                    desc: bonus,
                    label: m[3].trim()
                };
            }
            // Fallback: put the whole string as desc under undefined pieces
            return { pieces: undefined, desc: bonus };
        }

        // Assume structured object with pieces/stat/value/desc
        return {
            pieces: bonus.pieces,
            stat: bonus.stat,
            value: bonus.value,
            desc: bonus.desc || (typeof bonus === 'string' ? bonus : JSON.stringify(bonus))
        };
    };

    set.bonuses.forEach(bonus => {
        const b = normalizeBonus(bonus);
        const key = b && b.pieces !== undefined ? b.pieces : 'none';
        if (!bonusesByPieces[key]) bonusesByPieces[key] = [];
        bonusesByPieces[key].push(b);
    });
    
    // Display bonuses grouped by pieces
    html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
    html += `<div class="tooltip-label" style="margin-bottom: 6px;">Set Bonuses</div>`;
    
    const pieceCounts = Object.keys(bonusesByPieces).map(Number).sort((a, b) => a - b);
    
    pieceCounts.forEach(pieceCount => {
        const bonuses = bonusesByPieces[pieceCount];
        const isActive = currentPieces >= pieceCount;
        
        html += `<div class="set-bonus-tier" style="margin-bottom: 8px; ${isActive ? 'color: var(--accent);' : 'opacity: 0.5;'}">`;
        html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 4px;">${pieceCount} pieces:</div>`;
        
        bonuses.forEach(bonus => {
            html += `<div style="padding-left: 12px; font-size: 11px;">`;
            html += `${bonus.desc}`;
            html += `</div>`;
        });
        
        html += `</div>`;
    });
    
    html += `</div>`;
    
    // Show pieces
    if (set.pieces && set.pieces.length > 0) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 4px;">Enhancements (${set.pieces.length})</div>`;
        
        set.pieces.forEach(piece => {
            html += `<div style="font-size: 11px; padding: 2px 0;">`;
            html += `<span style="opacity: 0.7;">${piece.num}.</span> `;
            html += `${piece.name}`;
            if (piece.values) {
                html += ` <span style="opacity: 0.6; font-size: 10px;">(${piece.values})</span>`;
            }
            html += `</div>`;
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Show enhancement set tooltip
 * @param {Event} event - Mouse event
 * @param {Object} set - IO set data
 * @param {number} currentPieces - Currently slotted pieces
 */
function showSetTooltip(event, set, currentPieces = 0) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = generateSetTooltipHTML(set, currentPieces);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// POWER TOOLTIPS
// ============================================

/**
 * Calculate enhanced power stats
 * @param {Object} power - Power data from build
 * @param {Object} basePower - Original power definition from powerset
 * @returns {Object} Enhanced stats
 */
function calculateEnhancedPowerStats(power, basePower) {
    // Get base stats
    const base = {
        damage: basePower.effects?.damage?.scale || 0,
        accuracy: basePower.effects?.accuracy || 1.0,
        recharge: basePower.effects?.recharge || 0,
        endurance: basePower.effects?.endurance || 0,
        range: basePower.effects?.range || 0
    };
    
    // If no power from build (just viewing in available powers), return base
    if (!power || !power.slots) {
        return base;
    }
    
    // Calculate enhancement bonuses (if enhancement-calculations.js is loaded)
    let bonuses = { damage: 0, accuracy: 0, recharge: 0, endurance: 0, range: 0 };
    if (typeof calculatePowerEnhancementBonuses === 'function') {
        bonuses = calculatePowerEnhancementBonuses(power);
    }
    
    // Apply bonuses to base stats
    const enhanced = {
        damage: base.damage * (1 + bonuses.damage),
        accuracy: base.accuracy * (1 + bonuses.accuracy),
        recharge: base.recharge / (1 + bonuses.recharge),  // Recharge is reduced
        endurance: base.endurance / (1 + bonuses.endurance),  // Endurance is reduced
        range: base.range * (1 + bonuses.range)
    };
    
    return enhanced;
}

/**
 * Calculate final power stats (with global bonuses + active buffs)
 * @param {Object} enhancedStats - Enhanced stats
 * @param {Object} power - Power from build (to check if it's active)
 * @returns {Object} Final stats
 */
function calculateFinalPowerStats(enhancedStats, power = null) {
    const stats = CharacterStats || {};
    
    // Get active power bonuses if function exists
    let activeBonuses = { damage: 0, tohit: 0, recharge: 0 };
    if (typeof getActivePowerBonuses === 'function') {
        activeBonuses = getActivePowerBonuses(power);
    }
    
    return {
        damage: enhancedStats.damage * (1 + (stats.damage || 0) / 100) * (1 + activeBonuses.damage),
        accuracy: enhancedStats.accuracy * (1 + (stats.accuracy || 0) / 100) * (1 + activeBonuses.tohit),
        recharge: enhancedStats.recharge / (1 + (stats.recharge || 0) / 100) / (1 + activeBonuses.recharge),
        endurance: enhancedStats.endurance / (1 + (stats.endrdx || 0) / 100),
        range: enhancedStats.range * (1 + (stats.range || 0) / 100)
    };
}

/**
 * Generate tooltip HTML for a power
 * Shows base, enhanced, and final stats
 * @param {Object} power - Power from build
 * @param {Object} basePower - Original power definition
 * @returns {string} HTML for tooltip
 */
function generatePowerTooltipHTML(power, basePower) {
    if (!basePower) return '';
    
    let html = `<div class="tooltip-title">${basePower.name}</div>`;
    
    // Show type if available
    if (basePower.type) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-label">Type</div>`;
        html += `<div class="tooltip-value">${basePower.type}</div>`;
        html += `</div>`;
    }
    
    // Show description
    if (basePower.description) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-desc" style="font-size: 11px; font-style: italic; opacity: 0.9;">${basePower.description}</div>`;
        html += `</div>`;
    }
    
    // Show short help if available
    if (basePower.shortHelp) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-value" style="font-size: 11px; color: var(--accent);">${basePower.shortHelp}</div>`;
        html += `</div>`;
    }
    
    // Only show stats table if effects exist
    if (basePower.effects) {
        // Get stats
        const baseStats = {
            damage: basePower.effects?.damage?.scale || 0,
            accuracy: basePower.effects?.accuracy || 1.0,
            recharge: basePower.effects?.recharge || 0,
            endurance: basePower.effects?.endurance || 0,
            range: basePower.effects?.range || 0
        };
        
        const enhancedStats = calculateEnhancedPowerStats(power, basePower);
        const finalStats = calculateFinalPowerStats(enhancedStats, power);
        
        // Only show stats that exist for this power
        const hasStats = baseStats.damage > 0 || baseStats.recharge > 0 || baseStats.endurance > 0;
        
        if (hasStats) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            
            // Damage
            if (baseStats.damage > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Damage Scale</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.damage.toFixed(2)}</div>`;
                html += `<div>${enhancedStats.damage.toFixed(2)}</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.damage.toFixed(2)}</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Accuracy
            html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
            html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Accuracy</div>`;
            html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
            html += `<div></div>`;
            html += `<div style="opacity: 0.6;">Base</div>`;
            html += `<div style="opacity: 0.6;">Enhanced</div>`;
            html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
            html += `<div style="opacity: 0.7;">→</div>`;
            html += `<div>${(baseStats.accuracy * 100).toFixed(0)}%</div>`;
            html += `<div>${(enhancedStats.accuracy * 100).toFixed(0)}%</div>`;
            html += `<div style="color: var(--accent); font-weight: 600;">${(finalStats.accuracy * 100).toFixed(0)}%</div>`;
            html += `</div>`;
            html += `</div>`;
            
            // Recharge
            if (baseStats.recharge > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Recharge Time</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.recharge.toFixed(1)}s</div>`;
                html += `<div>${enhancedStats.recharge.toFixed(1)}s</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.recharge.toFixed(1)}s</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Endurance
            if (baseStats.endurance > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Endurance Cost</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.endurance.toFixed(2)}</div>`;
                html += `<div>${enhancedStats.endurance.toFixed(2)}</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.endurance.toFixed(2)}</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Range
            if (baseStats.range > 0) {
                html += `<div class="power-stat-row">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Range</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.range.toFixed(0)} ft</div>`;
                html += `<div>${enhancedStats.range.toFixed(0)} ft</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.range.toFixed(0)} ft</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            html += `</div>`;
        }
    }
    
    // Show slotted enhancements if this is a power from build
    const hasSlottedEnhancements = power && power.slots && power.slots.some(slot => slot !== null);
    if (hasSlottedEnhancements) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 4px;">Slotted Enhancements</div>`;
        
        power.slots.forEach((slot, index) => {
            if (slot) {
                const set = IO_SETS[slot.setId];
                html += `<div style="font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.7;">${index + 1}.</span> `;
                html += `${set?.name || 'Unknown'}: ${slot.pieceName}`;
                html += `</div>`;
            }
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Show power tooltip
 * @param {Event} event - Mouse event
 * @param {Object} power - Power from build
 * @param {Object} basePower - Original power definition
 */
function showPowerTooltip(event, power, basePower) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = generatePowerTooltipHTML(power, basePower);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// DASHBOARD STAT TOOLTIPS
// ============================================

/**
 * Get all contributors to a stat
 * Uses Rule of 5 system to show unique bonus values with counts
 * @param {string} stat - Stat name (e.g., 'damage', 'accuracy')
 * @returns {Array} Array of contributor objects
 */
function getStatContributors(stat) {
    // Use Rule of 5 system if available
    if (typeof getStatBreakdown === 'function') {
        const breakdown = getStatBreakdown(stat);
        return breakdown.map(item => ({
            value: item.value,
            count: item.count,
            sources: item.sources,
            capped: item.capped,
            total: item.total,
            type: 'set'
        }));
    }
    
    // Fallback to old system (should not happen if rule-of-five.js is loaded)
    const contributors = [];
    
    if (typeof getActiveSetBonuses === 'function') {
        const activeBonuses = getActiveSetBonuses();
        activeBonuses.forEach(bonus => {
            if (bonus.stat === stat) {
                contributors.push({
                    source: bonus.source,
                    value: bonus.value,
                    type: 'set'
                });
            }
        });
    }
    
    // TODO: Add passive power bonuses
    // TODO: Add active power bonuses (if toggled on)
    
    return contributors;
}

/**
 * Generate tooltip HTML for a dashboard stat
 * Shows total and breakdown with Rule of 5 tracking
 * @param {string} statName - Display name of stat
 * @param {string} statKey - Key for stat in CharacterStats
 * @param {number} totalValue - Total value of stat
 * @returns {string} HTML for tooltip
 */
function generateStatTooltipHTML(statName, statKey, totalValue) {
    let html = `<div class="tooltip-title">${statName}</div>`;
    
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">Total:</div>`;
    html += `<div class="tooltip-value" style="color: var(--accent); font-weight: 600; font-size: 14px;">+${totalValue.toFixed(2)}%</div>`;
    html += `</div>`;
    
    const contributors = getStatContributors(statKey);
    
    if (contributors.length > 0) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 4px;">Contributors</div>`;
        
        // Check if using Rule of 5 system (has count/sources)
        const usingRuleOfFive = contributors[0] && contributors[0].count !== undefined;
        
        if (usingRuleOfFive) {
            // Display using Rule of 5 breakdown
            html += `<div style="margin-bottom: 8px;">`;
            html += `<div style="font-weight: 600; font-size: 10px; opacity: 0.7; margin-bottom: 4px;">ENHANCEMENT SETS</div>`;
            
            contributors.forEach(c => {
                const cappedIndicator = c.capped ? ' ⚠️ CAPPED' : '';
                const countDisplay = c.capped ? '5/5' : `${c.count}/5`;
                const cappedStyle = c.capped ? 'color: var(--warning);' : '';
                
                // Header for this bonus value
                html += `<div style="font-weight: 600; font-size: 11px; margin-top: 6px; margin-bottom: 2px; ${cappedStyle}">`;
                html += `+${c.value.toFixed(2)}% × ${countDisplay}${cappedIndicator}`;
                html += `</div>`;
                
                // List sources
                c.sources.forEach(source => {
                    html += `<div style="padding-left: 12px; font-size: 10px; opacity: 0.8;">`;
                    html += `• ${source}`;
                    html += `</div>`;
                });
                
                // Show total from this unique value
                html += `<div style="padding-left: 12px; font-size: 10px; font-weight: 600; color: var(--accent); margin-top: 2px;">`;
                html += `= +${c.total.toFixed(2)}%`;
                html += `</div>`;
            });
            
            html += `</div>`;
            
            // Show Rule of 5 explanation if any are capped
            if (contributors.some(c => c.capped)) {
                html += `<div style="font-size: 10px; font-style: italic; opacity: 0.7; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border);">`;
                html += `⚠️ Rule of 5: Identical bonus values can only stack 5 times`;
                html += `</div>`;
            }
        } else {
            // Old system - simple list
            html += `<div style="margin-bottom: 8px;">`;
            html += `<div style="font-weight: 600; font-size: 10px; opacity: 0.7; margin-bottom: 4px;">ENHANCEMENT SETS</div>`;
            contributors.forEach(c => {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span>${c.source}</span>`;
                html += `<span style="color: var(--accent);">+${c.value.toFixed(2)}%</span>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        html += `</div>`;
    } else {
        html += `<div class="tooltip-section" style="opacity: 0.6; font-style: italic; font-size: 11px;">`;
        html += `No bonuses active`;
        html += `</div>`;
    }
    
    return html;
}

/**
 * Show dashboard stat tooltip
 * @param {Event} event - Mouse event
 * @param {string} statName - Display name
 * @param {string} statKey - Stat key
 * @param {number} totalValue - Total value
 */
function showStatTooltip(event, statName, statKey, totalValue) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = generateStatTooltipHTML(statName, statKey, totalValue);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

/**
 * Position tooltip near mouse cursor
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {Event} event - Mouse event
 */
function positionTooltip(tooltip, event) {
    const offset = 10;
    let x = event.clientX + offset;
    let y = event.clientY + offset;
    
    // Set initial position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    
    // Get tooltip dimensions for edge detection
    const rect = tooltip.getBoundingClientRect();
    
    // Adjust if tooltip goes off right edge
    if (rect.right > window.innerWidth) {
        x = event.clientX - rect.width - offset;
    }
    
    // Adjust if tooltip goes off bottom edge
    if (rect.bottom > window.innerHeight) {
        y = event.clientY - rect.height - offset;
    }
    
    // Apply final position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}
