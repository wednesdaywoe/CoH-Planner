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

// Fallback mapping for effect keys when allowedEnhancements is not provided
const EFFECT_KEY_INFO = {
    tohitBuff: { name: '+ToHit', format: v => '+' + (v * 100).toFixed(1) + '%', color: 'stat-tohit' },
    damageBuff: { name: '+Damage', format: v => '+' + (v * 100).toFixed(1) + '%', color: 'stat-damage' },
    defenseBuff: { name: '+Defense', format: v => '+' + (v * 100).toFixed(1) + '%', color: 'stat-defense' },
    resistanceBuff: { name: '+Resistance', format: v => '+' + (v * 100).toFixed(1) + '%', color: 'stat-resistance' },
    tohitDebuff: { name: '-ToHit', format: v => '-' + (v * 100).toFixed(1) + '%', color: 'stat-tohit' },
    defenseDebuff: { name: '-Defense', format: v => '-' + (v * 100).toFixed(1) + '%', color: 'stat-defense' },
    heal: { name: 'Healing', format: v => v.toFixed(2), color: 'stat-healing' },
    accuracy: { name: 'Accuracy', format: v => (v * 100).toFixed(0) + '%', color: 'stat-accuracy' },
    recharge: { name: 'Recharge', format: v => v.toFixed(1) + 's', color: 'stat-recharge' },
    endurance: { name: 'Endurance', format: v => v.toFixed(2), color: 'stat-endurance' },
    range: { name: 'Range', format: v => v.toFixed(0) + ' ft', color: 'stat-range' },
    cast: { name: 'Cast Time', format: v => v.toFixed(2) + 's', color: 'stat-cast' },
    buffDuration: { name: 'Duration', format: v => v.toFixed(1) + 's', color: 'stat-duration' },
    stun: { name: 'Stun Magnitude', format: v => 'Mag ' + v.toFixed(0), color: 'stat-stun' },
    stunDuration: { name: 'Stun Duration', format: v => v.toFixed(1) + 's', color: 'stat-stun' },
    armor: { name: 'Armor', format: v => v.toFixed(2), color: 'stat-defense' },
    absorption: { name: 'Absorption', format: v => v.toFixed(2), color: 'stat-defense' }
};

/**
 * Generate improved power tooltip with horizontal table layout
 * @param {Object} power - Power from build (or null for available powers)
 * @param {Object} basePower - Original power definition
 * @param {boolean} showModified - Whether to show enhanced/final values
 * @returns {string} HTML for tooltip
 */
function generateImprovedPowerTooltipHTML(power, basePower, showModified = false) {
    if (!basePower) return '';
    // Debug: log base power to help trace where tooltip data comes from
    console.debug('generateImprovedPowerTooltipHTML - basePower:', basePower);
    
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

    // Fallback: if no allowedEnhancements were present or nothing matched,
    // scan basePower.effects for relevant keys (useful for buffs/debuffs/armor)
    if ((!basePower.allowedEnhancements || basePower.allowedEnhancements.length === 0) && basePower.effects) {
        const fallbackStats = [];
        const effects = basePower.effects;

        Object.keys(EFFECT_KEY_INFO).forEach(key => {
            if (effects[key] !== undefined) {
                let rawValue = effects[key];
                if (typeof rawValue === 'object' && rawValue.scale !== undefined) rawValue = rawValue.scale;

                const info = EFFECT_KEY_INFO[key];
                // Compute enhanced/final values similarly to above if requested
                let baseValue = rawValue;
                if ((key === 'tohitDebuff' || key === 'defenseDebuff' || key === 'tohitBuff' || key === 'damageBuff' || key === 'defenseBuff') &&
                    typeof calculateBuffDebuffValue === 'function') {
                    const archetypeId = Build.archetype?.id;
                    baseValue = calculateBuffDebuffValue(rawValue, archetypeId);
                }

                let enhancedValue = baseValue;
                let finalValue = baseValue;
                if (showModified && power && typeof calculatePowerEnhancementBonuses === 'function') {
                    const bonuses = calculatePowerEnhancementBonuses(power);
                    // Try to apply a sensible mapping from key to bonus
                    if (key === 'accuracy') enhancedValue = baseValue * (1 + (bonuses.accuracy || 0));
                    else if (key === 'recharge') enhancedValue = baseValue / (1 + (bonuses.recharge || 0));
                    else if (key === 'endurance') enhancedValue = baseValue / (1 + (bonuses.endurance || 0));
                    else if (key === 'range') enhancedValue = baseValue * (1 + (bonuses.range || 0));
                    else if (key === 'tohitBuff') enhancedValue = baseValue * (1 + (bonuses.tohitBuff || 0));
                    else if (key === 'damageBuff') enhancedValue = baseValue * (1 + (bonuses.damageBuff || 0));

                    // Apply global stats for final value where applicable
                    const stats = CharacterStats || {};
                    if (key === 'accuracy') finalValue = enhancedValue * (1 + (stats.accuracy || 0) / 100);
                    else if (key === 'recharge') finalValue = enhancedValue / (1 + (stats.recharge || 0) / 100);
                    else finalValue = enhancedValue;
                }

                fallbackStats.push({
                    name: info.name,
                    color: info.color,
                    base: info.format(baseValue),
                    enhanced: info.format(enhancedValue),
                    final: info.format(finalValue)
                });
            }
        });

        if (fallbackStats.length > 0) {
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

            fallbackStats.forEach(stat => {
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

    // Additional section: display buff/debuff effects not covered by allowedEnhancements
    // This ensures powers like Aim and Build Up show their buff values even if not in allowedEnhancements
    if (basePower.effects && basePower.allowedEnhancements) {
        const extraStats = [];
        const effects = basePower.effects;
        const buffDebuffKeys = ['tohitBuff', 'damageBuff', 'defenseBuff', 'resistanceBuff', 'tohitDebuff', 'defenseDebuff', 'buffDuration'];
        
        buffDebuffKeys.forEach(key => {
            if (effects[key] !== undefined && EFFECT_KEY_INFO[key]) {
                let rawValue = effects[key];
                if (typeof rawValue === 'object' && rawValue.scale !== undefined) rawValue = rawValue.scale;

                const info = EFFECT_KEY_INFO[key];
                let baseValue = rawValue;
                
                if ((key === 'tohitDebuff' || key === 'defenseDebuff' || key === 'tohitBuff' || key === 'damageBuff' || key === 'defenseBuff') &&
                    typeof calculateBuffDebuffValue === 'function') {
                    const archetypeId = Build.archetype?.id;
                    baseValue = calculateBuffDebuffValue(rawValue, archetypeId);
                }

                let enhancedValue = baseValue;
                let finalValue = baseValue;
                
                if (showModified && power && typeof calculatePowerEnhancementBonuses === 'function') {
                    const bonuses = calculatePowerEnhancementBonuses(power);
                    if (key === 'tohitBuff') enhancedValue = baseValue * (1 + (bonuses.tohitBuff || 0));
                    else if (key === 'damageBuff') enhancedValue = baseValue * (1 + (bonuses.damageBuff || 0));
                    else enhancedValue = baseValue;
                    
                    const stats = CharacterStats || {};
                    finalValue = enhancedValue;
                }

                extraStats.push({
                    name: info.name,
                    color: info.color,
                    base: info.format(baseValue),
                    enhanced: info.format(enhancedValue),
                    final: info.format(finalValue)
                });
            }
        });

        if (extraStats.length > 0) {
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

            extraStats.forEach(stat => {
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

    // === NEW EFFECT TYPES SECTION ===
    if (basePower.effects) {
        const effects = basePower.effects;
        
        // POOL POWER EFFECTS SECTION
        const poolEffects = [
            { key: 'recovery', label: 'Recovery', color: 'stat-recovery' },
            { key: 'regeneration', label: 'Regeneration', color: 'stat-regeneration' },
            { key: 'runSpeed', label: 'Run Speed', color: 'stat-speed' },
            { key: 'flySpeed', label: 'Fly Speed', color: 'stat-fly' },
            { key: 'jumpHeight', label: 'Jump Height', color: 'stat-jump' },
            { key: 'jumpSpeed', label: 'Jump Speed', color: 'stat-jump' },
            { key: 'maxEndurance', label: 'Max Endurance', color: 'stat-endurance' },
            { key: 'maxHealth', label: 'Max Health', color: 'stat-healing' }
        ];
        
        const poolBonuses = poolEffects.filter(e => {
            const val = effects[e.key];
            if (typeof val === 'object' && val.scale !== undefined) return true;
            return val !== undefined && val !== 0;
        });
        
        if (poolBonuses.length > 0) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px; color: var(--accent);">POOL POWER BONUS</div>`;
            poolBonuses.forEach(({ key, label, color }) => {
                let value = effects[key];
                if (typeof value === 'object' && value.scale !== undefined) {
                    value = value.scale;
                }
                const displayValue = (value * 100).toFixed(1);
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">${label}:</span>`;
                html += `<span style="font-weight: 600; color: var(--accent);">+${displayValue}%</span>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // DEBUFFS SECTION
        const debuffData = [
            { key: 'resistanceDebuff', label: 'Resistance Debuff', color: '#ff6b6b' },
            { key: 'defenseDebuff', label: 'Defense Debuff', color: '#ff6b6b' },
            { key: 'tohitDebuff', label: 'ToHit Debuff', color: '#ff6b6b' },
            { key: 'damageDebuff', label: 'Damage Debuff', color: '#ff6b6b' },
            { key: 'rechargeDebuff', label: 'Recharge Debuff', color: '#ff6b6b' },
            { key: 'movementDebuff', label: 'Movement Debuff', color: '#ff6b6b' },
            { key: 'regenerationDebuff', label: 'Regeneration Debuff', color: '#ff6b6b' },
            { key: 'recoveryDebuff', label: 'Recovery Debuff', color: '#ff6b6b' }
        ];
        
        const debuffs = debuffData.filter(d => effects[d.key] !== undefined);
        if (debuffs.length > 0) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">DEBUFFS</div>`;
            debuffs.forEach(({ key, label, color }) => {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">${label}:</span>`;
                html += `<span style="font-weight: 600; color: ${color};">-${(effects[key] * 100).toFixed(0)}%</span>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // ADDITIONAL BUFFS SECTION (beyond what's in allowed enhancements)
        const buffData = [
            { key: 'rechargeBuff', label: 'Recharge Buff' },
            { key: 'movementBuff', label: 'Movement Buff' },
            { key: 'regenerationBuff', label: 'Regeneration Buff' },
            { key: 'recoveryBuff', label: 'Recovery Buff' },
            { key: 'maxHPBuff', label: 'Max HP Buff' }
        ];
        
        const buffs = buffData.filter(b => effects[b.key] !== undefined);
        if (buffs.length > 0) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">ADDITIONAL BUFFS</div>`;
            buffs.forEach(({ key, label }) => {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">${label}:</span>`;
                html += `<span style="font-weight: 600; color: var(--accent);">+${(effects[key] * 100).toFixed(0)}%</span>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // TYPED RESISTANCE SECTION (for armor powers)
        if (effects.resistance && typeof effects.resistance === 'object') {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">RESISTANCE</div>`;
            
            // Sort damage types for consistent display
            const damageTypes = Object.keys(effects.resistance).sort();
            damageTypes.forEach(type => {
                const value = effects.resistance[type];
                const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">${typeLabel}:</span>`;
                html += `<span style="font-weight: 600; color: var(--accent);">+${(value * 100).toFixed(1)}%</span>`;
                html += `</div>`;
            });
            
            html += `</div>`;
        }
        
        // TYPED DEFENSE SECTION (for armor powers)
        if (effects.defense && typeof effects.defense === 'object') {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">DEFENSE</div>`;
            
            // Sort defense types for consistent display
            const defenseTypes = Object.keys(effects.defense).sort();
            defenseTypes.forEach(type => {
                const value = effects.defense[type];
                const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">${typeLabel}:</span>`;
                html += `<span style="font-weight: 600; color: var(--accent);">+${(value * 100).toFixed(1)}%</span>`;
                html += `</div>`;
            });
            
            html += `</div>`;
        }
        
        // DEBUFF RESISTANCE SECTION (for armor/buff powers)
        if (effects.debuffResistance && typeof effects.debuffResistance === 'object') {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">DEBUFF RESISTANCE</div>`;
            
            const debuffResLabels = {
                tohit: 'ToHit Debuffs',
                defense: 'Defense Debuffs',
                damage: 'Damage Debuffs',
                recharge: 'Recharge Debuffs',
                movement: 'Movement Debuffs',
                regeneration: 'Regeneration Debuffs',
                recovery: 'Recovery Debuffs',
                endurance: 'Endurance Debuffs',
                healing: 'Healing Debuffs'
            };
            
            // Sort for consistent display
            Object.keys(effects.debuffResistance).sort().forEach(type => {
                const value = effects.debuffResistance[type];
                const label = debuffResLabels[type] || (type.charAt(0).toUpperCase() + type.slice(1));
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">${label}:</span>`;
                html += `<span style="font-weight: 600; color: #22c55e;">+${(value * 100).toFixed(1)}%</span>`;
                html += `</div>`;
            });
            
            html += `</div>`;
        }
        
        // HEALING SECTION (for powers like Dark Regeneration)
        if (effects.healing && typeof effects.healing === 'object') {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">HEALING</div>`;
            
            const healScale = effects.healing.scale || 0;
            const perTarget = effects.healing.perTarget || false;
            
            if (perTarget) {
                // Per-target healing (like Dark Regeneration)
                const maxTargets = basePower.maxTargets || 10;
                const totalHeal = healScale * maxTargets;
                
                html += `<div style="margin-bottom: 4px;">`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">Per Enemy:</span>`;
                html += `<span style="font-weight: 600; color: #4ade80;">${healScale.toFixed(1)} HP</span>`;
                html += `</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">Max Targets:</span>`;
                html += `<span style="font-weight: 600;">${maxTargets}</span>`;
                html += `</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 2px; padding-top: 4px;">`;
                html += `<span style="opacity: 0.8;">Max Heal:</span>`;
                html += `<span style="font-weight: 700; color: #22c55e;">${totalHeal.toFixed(1)} HP</span>`;
                html += `</div>`;
                html += `</div>`;
            } else {
                // Single-target or self-only healing
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">Heal:</span>`;
                html += `<span style="font-weight: 600; color: #4ade80;">${healScale.toFixed(1)} HP</span>`;
                html += `</div>`;
            }
            
            html += `</div>`;
        }
        
        // HEALING/ABSORB SECTION (legacy format)
        if ((effects.healing !== undefined && typeof effects.healing !== 'object') || effects.absorb !== undefined) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">HEALING</div>`;
            
            if (effects.healing !== undefined && typeof effects.healing !== 'object') {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">Healing:</span>`;
                html += `<span style="font-weight: 600; color: #4ade80;">${(effects.healing * 100).toFixed(1)}% HP</span>`;
                html += `</div>`;
            }
            
            if (effects.absorb !== undefined) {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">Absorb Shield:</span>`;
                html += `<span style="font-weight: 600; color: #60a5fa;">${(effects.absorb * 100).toFixed(1)}% HP</span>`;
                html += `</div>`;
            }
            
            html += `</div>`;
        }
        
        // CONTROL EFFECTS SECTION
        const controlData = [
            { key: 'hold', durKey: 'holdDuration', label: 'Hold', color: '#a78bfa' },
            { key: 'immobilize', durKey: 'immobilizeDuration', label: 'Immobilize', color: '#fb923c' },
            { key: 'sleep', durKey: 'sleepDuration', label: 'Sleep', color: '#94a3b8' },
            { key: 'confuse', durKey: 'confuseDuration', label: 'Confuse', color: '#c084fc' },
            { key: 'fear', durKey: 'fearDuration', label: 'Fear', color: '#f87171' },
            { key: 'knockback', label: 'Knockback', color: '#38bdf8' }
        ];
        
        // Note: stun is already handled in EFFECT_KEY_INFO above, so skip it here
        const controls = controlData.filter(c => effects[c.key] !== undefined && typeof effects[c.key] !== 'object');
        if (controls.length > 0) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">CONTROL EFFECTS</div>`;
            
            controls.forEach(({ key, durKey, label, color }) => {
                html += `<div style="margin-bottom: 4px;">`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">${label} Magnitude:</span>`;
                html += `<span style="font-weight: 600; color: ${color};">Mag ${(typeof effects[key] === 'number' ? effects[key].toFixed(1) : effects[key])}</span>`;
                html += `</div>`;
                
                if (durKey && effects[durKey] !== undefined && typeof effects[durKey] === 'number') {
                    html += `<div style="display: flex; justify-content: space-between; font-size: 10px; padding: 2px 0; padding-left: 12px;">`;
                    html += `<span style="opacity: 0.6;">Duration:</span>`;
                    html += `<span style="font-weight: 600;">${effects[durKey].toFixed(1)}s</span>`;
                    html += `</div>`;
                }
                html += `</div>`;
            });
            
            html += `</div>`;
        }
        
        // STATUS PROTECTION SECTION
        // Check for nested protection object or flat protection keys
        if (effects.protection && typeof effects.protection === 'object') {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">STATUS PROTECTION</div>`;
            
            const protectionLabels = {
                hold: 'Hold',
                stun: 'Stun', 
                immobilize: 'Immobilize',
                sleep: 'Sleep',
                confuse: 'Confuse',
                fear: 'Fear',
                knockback: 'Knockback'
            };
            
            Object.keys(effects.protection).sort().forEach(type => {
                const value = effects.protection[type];
                if (typeof value === 'number') {
                    const label = protectionLabels[type] || (type.charAt(0).toUpperCase() + type.slice(1));
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                    html += `<span style="opacity: 0.8;">${label} Protection:</span>`;
                    html += `<span style="font-weight: 600; color: #10b981;">Mag ${value.toFixed(1)}</span>`;
                    html += `</div>`;
                }
            });
            
            html += `</div>`;
        } else {
            // Fallback: check for flat protection keys (legacy format)
            const protectionData = [
                { key: 'holdProtection', label: 'Hold Protection' },
                { key: 'stunProtection', label: 'Stun Protection' },
                { key: 'immobilizeProtection', label: 'Immobilize Protection' },
                { key: 'sleepProtection', label: 'Sleep Protection' },
                { key: 'confuseProtection', label: 'Confuse Protection' },
                { key: 'fearProtection', label: 'Fear Protection' },
                { key: 'knockbackProtection', label: 'Knockback Protection' }
            ];
            
            const protections = protectionData.filter(p => effects[p.key] !== undefined);
            if (protections.length > 0) {
                html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
                html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px;">STATUS PROTECTION</div>`;
                
                protections.forEach(({ key, label }) => {
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                    html += `<span style="opacity: 0.8;">${label}:</span>`;
                    html += `<span style="font-weight: 600; color: #10b981;">Mag ${effects[key].toFixed(1)}</span>`;
                    html += `</div>`;
                });
                
                html += `</div>`;
            }
        }
        
        // DURATION (if not shown in control effects)
        if (effects.duration !== undefined && controls.length === 0) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
            html += `<span style="opacity: 0.8;">Duration:</span>`;
            html += `<span style="font-weight: 600;">${effects.duration.toFixed(1)}s</span>`;
            html += `</div>`;
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
