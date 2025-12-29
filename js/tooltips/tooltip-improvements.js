/**
 * City of Heroes Planner - Enhanced Tooltips
 * 
 * Improvements to tooltip system with horizontal layout and color coding
 */

// ============================================
// ENHANCEMENT PIECE TOOLTIPS (Modal)
// ============================================

/**
 * Get color class for an aspect
 * Maps enhancement aspects to stat color classes
 */
function getAspectColorClass(aspect) {
    const aspectMap = {
        'Damage': 'stat-damage',
        'Accuracy': 'stat-accuracy',
        'ToHit': 'stat-tohit',
        'Defense': 'stat-defense',
        'Resistance': 'stat-resistance',
        'Healing': 'stat-healing',
        'Regeneration': 'stat-regeneration',
        'Recovery': 'stat-recovery',
        'Endurance': 'stat-endurance',
        'End Reduction': 'stat-endurance',
        'EndMod': 'stat-endurance',
        'Recharge': 'stat-recharge',
        'Range': 'stat-range',
        'Run Speed': 'stat-speed',
        'Jump': 'stat-jump',
        'Flight': 'stat-fly',
        'Knockback': 'stat-knockback',
        'Hold': 'stat-hold',
        'Stun': 'stat-stun',
        'Immobilize': 'stat-immobilize',
        'Sleep': 'stat-sleep',
        'Confuse': 'stat-confuse',
        'Fear': 'stat-fear'
    };
    
    // Try direct match
    if (aspectMap[aspect]) {
        return aspectMap[aspect];
    }
    
    // Try partial match
    for (const [key, value] of Object.entries(aspectMap)) {
        if (aspect.includes(key) || key.includes(aspect)) {
            return value;
        }
    }
    
    return ''; // No color class
}

/**
 * Generate tooltip for an enhancement piece in the modal
 * Shows individual piece values + set bonuses
 * @param {Object} set - The IO set
 * @param {string} setId - The set ID string
 * @param {Object} piece - The specific piece
 * @returns {string} HTML for tooltip
 */
function generateEnhancementPieceTooltipHTML(set, setId, piece) {
    let html = `<div class="tooltip-title">${set.name}</div>`;
    
    // Piece name
    html += `<div class="tooltip-section">`;
    html += `<div style="font-weight: 600; font-size: 12px; color: var(--accent);">${piece.name}</div>`;
    html += `</div>`;
    
    // Individual enhancement values
    if (piece.aspects) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 6px;">Enhancement Values</div>`;
        
        // Get IO level
        const ioLevel = AppState.globalIOLevel || 50;
        const level = Math.min(ioLevel, set.maxLevel);
        
        // Multi-aspect modifier
        const aspectCount = piece.aspects.length;
        let modifier = 1.0;
        if (aspectCount === 2) {
            modifier = 0.70;
        } else if (aspectCount >= 3) {
            modifier = 0.50;
        }
        
        piece.aspects.forEach(aspect => {
            // Each aspect has its own schedule and gets modified by aspect count
            const normalized = normalizeAspectName(aspect);
            const schedule = normalized ? getAspectSchedule(normalized) : 'A';
            const baseValue = (typeof getIOValueAtLevel === 'function' ? getIOValueAtLevel(level, schedule) : 0.255);
            const enhValue = baseValue * modifier * 100;
            const colorClass = getAspectColorClass(aspect);
            html += `<div style="font-size: 11px; padding: 2px 0;">`;
            html += `<span class="${colorClass}" style="font-weight: 600;">${aspect}: +${enhValue.toFixed(1)}%</span>`;
            html += `</div>`;
        });
        
        html += `</div>`;
    }
    
    // Unique warning
    if (piece.unique) {
        html += `<div class="tooltip-section">`;
        html += `<div style="color: var(--warning); font-size: 10px; font-weight: 600;">⚠️ UNIQUE - Only one per build</div>`;
        html += `</div>`;
    }
    
    // Set bonuses section
    html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
    html += `<div class="tooltip-label" style="margin-bottom: 6px;">Set Bonuses</div>`;
    
    // Count how many pieces from this set are slotted in the current power
    let slottedPieceCount = 0;
    if (AppState.currentPowerName) {
        const result = findPower(AppState.currentPowerName);
        if (result && result.power.slots) {
            slottedPieceCount = result.power.slots.filter(slot => 
                slot && slot.type === 'io-set' && slot.setId === setId
            ).length;
            console.log(`Set bonus highlighting: ${slottedPieceCount} pieces of ${set.name} slotted in ${AppState.currentPowerName}`);
        } else {
            console.log('Could not find power or slots:', AppState.currentPowerName);
        }
    } else {
        console.log('No currentPowerName set');
    }
    
    // Group bonuses by piece count
    const bonusesByPieces = {};
    set.bonuses.forEach(bonus => {
        const pieces = bonus.pieces || 0;
        if (!bonusesByPieces[pieces]) {
            bonusesByPieces[pieces] = [];
        }
        bonusesByPieces[pieces].push(bonus);
    });
    
    // Display in order
    const pieceCounts = Object.keys(bonusesByPieces).map(Number).sort((a, b) => a - b);
    
    pieceCounts.forEach(pieceCount => {
        const bonuses = bonusesByPieces[pieceCount];
        const isActive = slottedPieceCount >= pieceCount;
        const opacity = isActive ? '1.0' : '0.5';
        const fontWeight = isActive ? '700' : '400';
        const checkmark = isActive ? ' ✓' : '';
        
        html += `<div style="margin-bottom: 6px; opacity: ${opacity};">`;
        html += `<div style="font-weight: ${fontWeight}; font-size: 10px; margin-bottom: 2px;">${pieceCount} pieces${checkmark}:</div>`;
        
        bonuses.forEach(bonus => {
            // Each bonus has an effects array
            if (bonus.effects && Array.isArray(bonus.effects)) {
                bonus.effects.forEach(effect => {
                    html += `<div style="padding-left: 12px; font-size: 10px;">`;
                    html += `${effect.desc || effect.stat}`; // Use desc or fallback to stat name
                    html += `</div>`;
                });
            }
        });
        
        html += `</div>`;
    });
    
    html += `</div>`;
    
    // Level range
    html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 4px; margin-top: 4px;">`;
    html += `<div style="font-size: 9px; opacity: 0.6; text-align: center;">Level ${set.minLevel}-${set.maxLevel}</div>`;
    html += `</div>`;
    
    return html;
}

/**
 * Show enhancement piece tooltip in modal
 * @param {Event} event - Mouse event
 * @param {string} setId - Set ID
 * @param {number} pieceNum - Piece number
 */
function showEnhancementPieceTooltip(event, setId, pieceNum) {
    const set = IO_SETS[setId];
    if (!set) return;
    
    const piece = set.pieces.find(p => p.num === pieceNum);
    if (!piece) return;
    
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = generateEnhancementPieceTooltipHTML(set, setId, piece);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// IMPROVED POWER TOOLTIPS (Horizontal Layout)
// ============================================

/**
 * Map enhancement class to stat key and display name
 */
function getStatInfoFromEnhancement(enhClass) {
    const map = {
        'Damage': { key: 'damage', name: 'Damage', format: val => val.toFixed(2), color: 'stat-damage' },
        'Accuracy': { key: 'accuracy', name: 'Accuracy', format: val => (val * 100).toFixed(0) + '%', color: 'stat-accuracy' },
        'Recharge': { key: 'recharge', name: 'Recharge', format: val => val.toFixed(1) + 's', color: 'stat-recharge' },
        'EnduranceReduction': { key: 'endurance', name: 'Endurance', format: val => val.toFixed(2), color: 'stat-endurance' },
        'Range': { key: 'range', name: 'Range', format: val => val.toFixed(0) + ' ft', color: 'stat-range' },
        'ToHitDebuff': { key: 'tohitDebuff', name: '-ToHit', format: val => '-' + val.toFixed(1) + '%', color: 'stat-tohit' },
        'DefenseDebuff': { key: 'defenseDebuff', name: '-Defense', format: val => '-' + val.toFixed(1) + '%', color: 'stat-defense' },
        'ToHitBuff': { key: 'tohitBuff', name: '+ToHit', format: val => '+' + (val * 100).toFixed(1) + '%', color: 'stat-tohit' },
        'DamageBuff': { key: 'damageBuff', name: '+Damage', format: val => '+' + (val * 100).toFixed(1) + '%', color: 'stat-damage' },
        'DefenseBuff': { key: 'defenseBuff', name: '+Defense', format: val => '+' + (val * 100).toFixed(1) + '%', color: 'stat-defense' },
        'Healing': { key: 'heal', name: 'Healing', format: val => val.toFixed(2), color: 'stat-healing' },
        'Hold': { key: 'duration', name: 'Hold Duration', format: val => val.toFixed(1) + 's', color: 'stat-hold' },
        'Immob': { key: 'duration', name: 'Immob Duration', format: val => val.toFixed(1) + 's', color: 'stat-immobilize' },
        'Stun': { key: 'duration', name: 'Stun Duration', format: val => val.toFixed(1) + 's', color: 'stat-stun' },
        'Sleep': { key: 'duration', name: 'Sleep Duration', format: val => val.toFixed(1) + 's', color: 'stat-sleep' },
        'Confuse': { key: 'duration', name: 'Confuse Duration', format: val => val.toFixed(1) + 's', color: 'stat-confuse' },
        'Fear': { key: 'duration', name: 'Fear Duration', format: val => val.toFixed(1) + 's', color: 'stat-fear' }
    };
    
    return map[enhClass] || null;
}

/**
 * Generate improved power tooltip with horizontal table layout
 * @param {Object} power - Power from build (or null for available powers)
 * @param {Object} basePower - Original power definition
 * @param {boolean} showModified - Whether to show enhanced/final values
 * @returns {string} HTML for tooltip
 */
function generateImprovedPowerTooltipHTML(power, basePower, showModified = false) {
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
    
    // Check if power has damage - use new damage calculation system
    if (basePower.effects && basePower.effects.damage && typeof calculatePowerDamage === 'function') {
        const damageCalc = calculatePowerDamage(power, basePower);
        
        if (damageCalc) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<table style="width: 100%; font-size: 11px; border-collapse: collapse;">`;
            html += `<thead>`;
            html += `<tr style="border-bottom: 1px solid var(--border);">`;
            html += `<th style="text-align: left; padding: 4px 8px 4px 0; opacity: 0.6;"></th>`;
            
            if (showModified) {
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Base</th>`;
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Enhanced</th>`;
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Final</th>`;
            } else {
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Value</th>`;
            }
            
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;
            
            // Damage row
            html += `<tr>`;
            html += `<td class="stat-damage" style="padding: 4px 0; font-weight: 600;">Damage (${damageCalc.type})</td>`;
            
            if (damageCalc.unknown) {
                // Unknown scale - just show the damage type
                html += `<td colspan="${showModified ? '3' : '1'}" style="text-align: right; padding: 4px 8px; font-style: italic; opacity: 0.7;">Scale varies</td>`;
            } else if (showModified) {
                html += `<td style="text-align: right; padding: 4px 8px;">${damageCalc.base.toFixed(2)}</td>`;
                html += `<td style="text-align: right; padding: 4px 8px;">${damageCalc.enhanced.toFixed(2)}</td>`;
                html += `<td class="stat-damage" style="text-align: right; padding: 4px 8px; font-weight: 600;">${damageCalc.final.toFixed(2)}</td>`;
            } else {
                html += `<td class="stat-damage" style="text-align: right; padding: 4px 8px; font-weight: 600;">${damageCalc.base.toFixed(2)}</td>`;
            }
            
            html += `</tr>`;
            html += `</tbody>`;
            html += `</table>`;
            html += `</div>`;
        }
    }
    
    // Build stats table for non-damage stats
    if (basePower.allowedEnhancements && basePower.allowedEnhancements.length > 0 && basePower.effects) {
        const statsToShow = [];
        
        // Map allowed enhancements to actual stats (skip Damage as it's handled above)
        basePower.allowedEnhancements.forEach(enhClass => {
            if (enhClass === 'Damage') return; // Skip - handled by damage calculation above
            
            const statInfo = getStatInfoFromEnhancement(enhClass);
            if (statInfo && basePower.effects[statInfo.key] !== undefined) {
                // Get base value
                let rawValue = basePower.effects[statInfo.key];
                if (typeof rawValue === 'object' && rawValue.scale !== undefined) {
                    rawValue = rawValue.scale;
                }
                
                // For debuffs/buffs, apply archetype modifier
                let baseValue = rawValue;
                if (enhClass === 'ToHitDebuff' || enhClass === 'DefenseDebuff' || 
                    enhClass === 'ToHitBuff' || enhClass === 'DamageBuff' || enhClass === 'DefenseBuff') {
                    const archetypeId = Build.archetype?.id;
                    if (archetypeId && typeof calculateBuffDebuffValue === 'function') {
                        baseValue = calculateBuffDebuffValue(rawValue, archetypeId);
                    } else {
                        // Fallback: assume 1.0 modifier
                        baseValue = rawValue * 10;
                    }
                }
                
                // Calculate enhanced and final values if showing modified
                let enhancedValue = baseValue;
                let finalValue = baseValue;
                
                if (showModified && power && typeof calculatePowerEnhancementBonuses === 'function') {
                    // Get enhancement bonus for this stat
                    const bonuses = calculatePowerEnhancementBonuses(power);
                    
                    // Apply enhancement bonus
                    if (enhClass === 'Healing') {
                        enhancedValue = baseValue * (1 + (bonuses.damage || 0));
                    } else if (enhClass === 'Accuracy') {
                        enhancedValue = baseValue * (1 + (bonuses.accuracy || 0));
                    } else if (enhClass === 'Recharge') {
                        enhancedValue = baseValue / (1 + (bonuses.recharge || 0));
                    } else if (enhClass === 'EnduranceReduction') {
                        enhancedValue = baseValue / (1 + (bonuses.endurance || 0));
                    } else if (enhClass === 'Range') {
                        enhancedValue = baseValue * (1 + (bonuses.range || 0));
                    } else if (enhClass === 'ToHitDebuff') {
                        enhancedValue = baseValue * (1 + (bonuses.tohitDebuff || 0));
                    } else if (enhClass === 'DefenseDebuff') {
                        enhancedValue = baseValue * (1 + (bonuses.defenseDebuff || 0));
                    } else if (enhClass === 'ToHitBuff') {
                        enhancedValue = baseValue * (1 + (bonuses.tohitBuff || 0));
                    } else if (enhClass === 'DamageBuff') {
                        enhancedValue = baseValue * (1 + (bonuses.damageBuff || 0));
                    } else if (enhClass === 'DefenseBuff') {
                        enhancedValue = baseValue * (1 + (bonuses.defenseBuff || 0));
                    } else if (enhClass === 'Hold' || enhClass === 'Immob' || enhClass === 'Stun' || enhClass === 'Sleep' || enhClass === 'Confuse' || enhClass === 'Fear') {
                        // Mez durations - use the specific mez type bonus
                        const mezKey = enhClass.toLowerCase();
                        enhancedValue = baseValue * (1 + (bonuses[mezKey] || 0));
                    }
                    
                    // Apply global bonuses for final value
                    const stats = CharacterStats || {};
                    if (enhClass === 'Healing') {
                        finalValue = enhancedValue * (1 + (stats.damage || 0) / 100);
                    } else if (enhClass === 'Accuracy') {
                        finalValue = enhancedValue * (1 + (stats.accuracy || 0) / 100);
                    } else if (enhClass === 'Recharge') {
                        finalValue = enhancedValue / (1 + (stats.recharge || 0) / 100);
                    } else if (enhClass === 'EnduranceReduction') {
                        finalValue = enhancedValue / (1 + (stats.endrdx || 0) / 100);
                    } else if (enhClass === 'Range') {
                        finalValue = enhancedValue * (1 + (stats.range || 0) / 100);
                    } else {
                        finalValue = enhancedValue; // No global bonuses for debuffs/buffs yet
                    }
                }
                
                statsToShow.push({
                    name: statInfo.name,
                    color: statInfo.color,
                    base: statInfo.format(baseValue),
                    enhanced: statInfo.format(enhancedValue),
                    final: statInfo.format(finalValue)
                });
            }
        });
        
        if (statsToShow.length > 0) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            
            // Table header
            html += `<table style="width: 100%; font-size: 11px; border-collapse: collapse;">`;
            html += `<thead>`;
            html += `<tr style="border-bottom: 1px solid var(--border);">`;
            html += `<th style="text-align: left; padding: 4px 8px 4px 0; opacity: 0.6;"></th>`;
            if (showModified) {
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Base</th>`;
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Enhanced</th>`;
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Final</th>`;
            } else {
                html += `<th style="text-align: right; padding: 4px 8px; opacity: 0.6;">Value</th>`;
            }
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;
            
            // Render each stat
            statsToShow.forEach(stat => {
                html += `<tr>`;
                html += `<td class="${stat.color}" style="padding: 4px 0; font-weight: 600;">${stat.name}</td>`;
                if (showModified) {
                    html += `<td style="text-align: right; padding: 4px 8px;">${stat.base}</td>`;
                    html += `<td style="text-align: right; padding: 4px 8px;">${stat.enhanced}</td>`;
                    html += `<td class="${stat.color}" style="text-align: right; padding: 4px 8px; font-weight: 600;">${stat.final}</td>`;
                } else {
                    html += `<td class="${stat.color}" style="text-align: right; padding: 4px 8px; font-weight: 600;">${stat.base}</td>`;
                }
                html += `</tr>`;
            });
            
            html += `</tbody>`;
            html += `</table>`;
            html += `</div>`;
        }
    }
    
    // Show available level
    html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 4px; margin-top: 4px;">`;
    html += `<div style="font-size: 9px; opacity: 0.6; text-align: center;">Available at Level ${basePower.available}</div>`;
    html += `</div>`;
    
    return html;
}

/**
 * Show power tooltip - works for all columns
 * Column 1: Base values only
 * Columns 2-4: Shows enhanced and final values
 * @param {Event} event - Mouse event
 * @param {Object} power - Power from build (null for column 1)
 * @param {Object} basePower - Original power definition
 */
function showImprovedPowerTooltip(event, power, basePower) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    // Determine if we should show modified values (columns 2-4 have power object)
    const showModified = power !== null && power !== undefined;
    
    tooltip.innerHTML = generateImprovedPowerTooltipHTML(power, basePower, showModified);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// Override the old function names to use new implementations
window.showSetPieceTooltip = showEnhancementPieceTooltip;
window.showPowerTooltip = showImprovedPowerTooltip;
window.showAvailablePowerTooltip = function(event, basePower) {
    showImprovedPowerTooltip(event, null, basePower);
};
