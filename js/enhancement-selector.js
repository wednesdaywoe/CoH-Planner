/**
 * City of Heroes Planner - Enhancement Picker
 * 
 * Functions for the enhancement selection modal
 */

// ============================================
// MODAL CONTROL
// ============================================

/**
 * Open enhancement picker modal
 * @param {string} powerName - Name of the power
 * @param {string} powerSet - Power set name
 */
function openPicker(powerName, powerSet) {
    AppState.currentPowerName = powerName;
    AppState.currentPowerSet = powerSet;
    document.getElementById('modalTitle').textContent = `${powerName} - Choose an enhancement`;
    document.getElementById('modal').classList.add('active');
    showCategoryView();
}

/**
 * Close enhancement picker modal
 */
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

/**
 * Show category selection view
 */
function showCategoryView() {
    AppState.currentView = 'category';
    AppState.currentCategory = null;
    document.getElementById('categoryView').classList.remove('hidden');
    document.getElementById('selectionViewSets').classList.remove('active');
    document.getElementById('selectionViewGeneric').classList.remove('active');
    document.getElementById('selectionViewSpecial').classList.remove('active');
    document.getElementById('selectionViewSO').classList.remove('active');
    document.getElementById('backBtn').classList.remove('visible');
}

/**
 * Go back to category view
 */
function goBack() {
    if (AppState.currentView === 'selection') {
        showCategoryView();
    }
}

// ============================================
// CATEGORY SELECTION
// ============================================

/**
 * Select an enhancement category
 * @param {string} category - Category ID
 */
function selectCategory(category) {
    AppState.currentCategory = category;
    AppState.currentView = 'selection';
    document.getElementById('categoryView').classList.add('hidden');
    document.getElementById('backBtn').classList.add('visible');
    
    // Hide all selection views
    document.getElementById('selectionViewSets').classList.remove('active');
    document.getElementById('selectionViewGeneric').classList.remove('active');
    document.getElementById('selectionViewSpecial').classList.remove('active');
    document.getElementById('selectionViewSO').classList.remove('active');
    
    // Show appropriate view
    if (category === 'io-set' || category === 'very-rare' || category === 'event' || category === 'archetype') {
        document.getElementById('selectionViewSets').classList.add('active');
        loadSetsForCategory(category);
    } else if (category === 'io-generic') {
        document.getElementById('selectionViewGeneric').classList.add('active');
        loadGenericIcons();
    } else if (category === 'special') {
        document.getElementById('selectionViewSpecial').classList.add('active');
        loadHamidonIcons();
    } else if (category === 'to-do-so') {
        document.getElementById('selectionViewSO').classList.add('active');
        loadOriginIcons();
    }
}

// ============================================
// IO SETS
// ============================================

/**
 * Load IO sets for selected category
 * @param {string} category - Category ID
 */
function loadSetsForCategory(category) {
    const setsPanel = document.querySelector('#selectionViewSets .sets-panel');
    
    // Filter sets by category
    let setsToShow = [];
    if (category === 'io-set') {
        setsToShow = ['positrons', 'bombardment', 'thunderstrike'];
    } else if (category === 'very-rare') {
        setsToShow = ['apocalypse', 'ragnarok'];
    } else if (category === 'event') {
        setsToShow = ['avalanche', 'winters-bite'];
    } else if (category === 'archetype') {
        setsToShow = ['blasters-wrath', 'defiant-barrage'];
    }
    
    // Build HTML - each set gets its own row
    let html = '';
    
    setsToShow.forEach(setId => {
        const set = IO_SETS[setId];
        if (!set) return;
        
        const iconPath = getSetIcon(setId);
        const purpleClass = set.purple ? ' purple' : '';
        
        html += `
            <div class="set-row">
                <div class="set-row-header${purpleClass}">
                    ${set.name}
                    <span class="set-row-meta">Lv ${set.minLevel}-${set.maxLevel} • ${set.pieces.length} pieces</span>
                </div>
                <div class="set-pieces-grid">
        `;
        
        set.pieces.forEach(piece => {
            html += `
                <div class="set-piece-icon" 
                     onmouseenter="showSetPieceTooltip(event, '${setId}', ${piece.num})" 
                     onmouseleave="hideTooltip()" 
                     onclick="addEnhancement('${setId}', ${piece.num})">
                    <img src="${iconPath}" alt="${set.name}">
                    <div class="set-piece-number">${piece.num}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    setsPanel.innerHTML = html;
}

/**
 * Add enhancement from IO set
 * @param {string} setId - Set identifier
 * @param {number} pieceNum - Piece number
 */
function addEnhancement(setId, pieceNum) {
    const set = IO_SETS[setId];
    const piece = set.pieces.find(p => p.num === pieceNum);
    
    // Check if this piece is already slotted in this power
    const result = findPower(AppState.currentPowerName);
    if (result) {
        const hasDuplicate = result.power.slots.some(slot => 
            slot && slot.type === 'io-set' && slot.setId === setId && slot.pieceNum === pieceNum
        );
        
        if (hasDuplicate) {
            console.log(`Cannot slot duplicate piece #${pieceNum} - already slotted in this power`);
            return;
        }
    }
    
    // Create enhancement object
    const enhancement = createEnhancement('io-set', {
        setId: setId,
        pieceNum: pieceNum,
        setName: set.name,
        pieceName: piece.name,
        values: piece.values,
        unique: piece.unique || false
    });
    
    // Add to build
    const success = addEnhancementToPower(AppState.currentPowerName, AppState.currentSlotIndex, enhancement);
    
    if (success) {
        // Update UI
        updatePowerSlots(AppState.currentPowerName);
        updateStatsDisplay();
        closeModal();
    }
}

// ============================================
// COMMON IO
// ============================================

/**
 * Load generic IO icons
 */
function loadGenericIcons() {
    const genericGrid = document.querySelector('#selectionViewGeneric .generic-grid');
    if (!genericGrid) {
        console.error('Generic grid not found');
        return;
    }
    
    const aspects = [
        { id: 'damage', name: 'Damage' },
        { id: 'accuracy', name: 'Accuracy' },
        { id: 'recharge', name: 'Recharge' },
        { id: 'endurance', name: 'End Reduc' },
        { id: 'defense', name: 'Defense' },
        { id: 'resistance', name: 'Resistance' },
        { id: 'healing', name: 'Healing' },
        { id: 'tohit', name: 'To-Hit' },
        { id: 'range', name: 'Range' },
        { id: 'hold', name: 'Hold' },
        { id: 'stun', name: 'Stun' },
        { id: 'immobilize', name: 'Immob' },
        { id: 'sleep', name: 'Sleep' },
        { id: 'confuse', name: 'Confuse' },
        { id: 'fear', name: 'Fear' },
        { id: 'knockback', name: 'KB' },
        { id: 'fly', name: 'Flight' },
        { id: 'jump', name: 'Jump' },
        { id: 'run', name: 'Run' }
    ];
    
    let html = '';
    aspects.forEach(aspect => {
        const iconPath = getAspectIcon(aspect.id);
        html += `
            <div class="enhancement-type-icon" 
                 onmouseenter="showGenericTooltip(event, '${aspect.id}', '${aspect.name}')" 
                 onmouseleave="hideTooltip()" 
                 onclick="addGenericIO('${aspect.id}', '${aspect.name}')">
                <div class="enhancement-icon-layered">
                    <img src="${iconPath}" class="enhancement-icon-base">
                    <img src="img/Overlay/IO.png" class="enhancement-icon-overlay">
                </div>
                <div class="enhancement-type-label">${aspect.name}</div>
            </div>
        `;
    });
    
    genericGrid.innerHTML = html;
}

/**
 * Show tooltip for generic IO
 */
function showGenericTooltip(event, aspectId, aspectName) {
    const level = AppState.globalIOLevel;
    const value = calculateCommonIOValue(level);
    
    const tooltip = document.getElementById('tooltip');
    const html = `
        <div class="tooltip-title">Common IO - ${aspectName}</div>
        <div class="tooltip-section">
            <div class="tooltip-label">Level ${level}</div>
            <div class="tooltip-value">+${value.toFixed(1)}%</div>
        </div>
        <div class="tooltip-section" style="margin-top: 8px; font-size: 11px; color: var(--text-tertiary);">
            Uses Global IO Level setting
        </div>
    `;
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Add generic IO enhancement
 */
function addGenericIO(aspect, aspectName) {
    // Create enhancement object
    const enhancement = createEnhancement('io-generic', {
        aspect: aspect,
        aspectName: aspectName,
        level: AppState.globalIOLevel,
        value: calculateCommonIOValue(AppState.globalIOLevel)
    });
    
    // Add to build
    const success = addEnhancementToPower(AppState.currentPowerName, AppState.currentSlotIndex, enhancement);
    
    if (success) {
        // Update UI
        updatePowerSlots(AppState.currentPowerName);
        updateStatsDisplay();
        closeModal();
    }
}

// ============================================
// HAMIDON ORIGINS
// ============================================

/**
 * Load Hamidon enhancement icons
 */
function loadHamidonIcons() {
    const specialGrid = document.querySelector('#selectionViewSpecial .special-grid');
    if (!specialGrid) {
        console.error('Special grid not found');
        return;
    }
    
    const hamiTypes = [
        { id: 'nucleolus', name: 'Nucleolus', aspects: ['Damage', 'Accuracy'] },
        { id: 'centriole', name: 'Centriole', aspects: ['Damage', 'Range'] },
        { id: 'enzyme', name: 'Enzyme', aspects: ['ToHit', 'Defense Debuff'] },
        { id: 'lysosome', name: 'Lysosome', aspects: ['Accuracy', 'ToHit Debuff'] },
        { id: 'membrane', name: 'Membrane', aspects: ['Recharge', 'Defense Debuff'] },
        { id: 'peroxisome', name: 'Peroxisome', aspects: ['Damage', 'Mez'] },
        { id: 'cytoskeleton', name: 'Cytoskeleton', aspects: ['Defense', 'ToHit'] },
        { id: 'endoplasm', name: 'Endoplasm', aspects: ['Accuracy', 'Mez'] },
        { id: 'golgi', name: 'Golgi', aspects: ['Healing', 'Endurance'] },
        { id: 'microfilament', name: 'Microfilament', aspects: ['Travel', 'Endurance'] },
        { id: 'ribosome', name: 'Ribosome', aspects: ['Resist', 'Endurance'] }
    ];
    
    let html = '';
    hamiTypes.forEach(hami => {
        const hamiData = HAMIDON_ENHANCEMENTS[hami.id];
        if (!hamiData) return;
        
        const iconPath = `img/Enhancements/HO${hami.name}.png`;
        html += `
            <div class="enhancement-type-icon"
                 onmouseenter="showHamidonTooltip(event, '${hami.id}', '${hami.name}')"
                 onmouseleave="hideTooltip()"
                 onclick="addSpecialEnhancement('${hami.id}')">
                <img src="${iconPath}" style="width:48px;height:48px;">
                <div class="enhancement-type-label">${hami.name}</div>
            </div>
        `;
    });
    
    specialGrid.innerHTML = html;
}

/**
 * Show tooltip for Hamidon enhancement
 */
function showHamidonTooltip(event, hamiId, hamiName) {
    const hami = HAMIDON_ENHANCEMENTS[hamiId];
    if (!hami) return;
    
    const tooltip = document.getElementById('tooltip');
    const html = `
        <div class="tooltip-title">${hami.name}</div>
        <div class="tooltip-section">
            <div class="tooltip-value">+${hami.value}% ${hami.aspects[0]}</div>
            <div class="tooltip-value">+${hami.value}% ${hami.aspects[1]}</div>
        </div>
        <div class="tooltip-section" style="margin-top: 8px; font-size: 11px; color: var(--text-tertiary);">
            Hamidon Origin Enhancement
        </div>
    `;
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Add special enhancement (Hamidon)
 */
function addSpecialEnhancement(hamiType) {
    const hami = HAMIDON_ENHANCEMENTS[hamiType];
    
    // Create enhancement object
    const enhancement = createEnhancement('hamidon', {
        hamiType: hamiType,
        name: hami.name,
        aspects: hami.aspects,
        value: hami.value
    });
    
    // Add to build
    const success = addEnhancementToPower(AppState.currentPowerName, AppState.currentSlotIndex, enhancement);
    
    if (success) {
        // Update UI
        updatePowerSlots(AppState.currentPowerName);
        updateStatsDisplay();
        closeModal();
    }
}

// ============================================
// TO/DO/SO
// ============================================

/**
 * Load origin enhancement icons (TO/DO/SO)
 */
function loadOriginIcons() {
    const soGrid = document.querySelector('#selectionViewSO .so-grid');
    if (!soGrid) {
        console.error('SO grid not found');
        return;
    }
    
    const tiers = [
        { tier: 0, name: 'Training' },
        { tier: 1, name: 'Dual Origin' },
        { tier: 2, name: 'Single Origin' }
    ];
    
    const aspects = [
        { id: 'damage', name: 'Damage' },
        { id: 'accuracy', name: 'Accuracy' },
        { id: 'recharge', name: 'Recharge' },
        { id: 'endurance', name: 'End Reduc' },
        { id: 'defense', name: 'Defense' },
        { id: 'resistance', name: 'Resistance' },
        { id: 'healing', name: 'Healing' },
        { id: 'range', name: 'Range' }
    ];
    
    let html = '';
    
    tiers.forEach(t => {
        aspects.forEach(aspect => {
            const iconPath = getAspectIcon(aspect.id);
            const overlayPath = getOriginOverlay(t.tier);
            const tierData = ORIGIN_TIERS[t.tier];
            
            html += `
                <div class="enhancement-type-icon"
                     onmouseenter="showOriginTooltip(event, ${t.tier}, '${t.name}', '${aspect.name}', ${tierData.value})"
                     onmouseleave="hideTooltip()"
                     onclick="addSO(${t.tier}, '${t.name}', '${aspect.id}', '${aspect.name}')">
                    <div class="enhancement-icon-layered">
                        <img src="${iconPath}" class="enhancement-icon-base">
                        <img src="${overlayPath}" class="enhancement-icon-overlay">
                    </div>
                    <div class="enhancement-type-label">${t.name} ${aspect.name}</div>
                </div>
            `;
        });
    });
    
    soGrid.innerHTML = html;
}

/**
 * Show tooltip for origin enhancement
 */
function showOriginTooltip(event, tier, tierName, aspectName, value) {
    const origin = Build.settings.origin;
    
    const tooltip = document.getElementById('tooltip');
    const html = `
        <div class="tooltip-title">${tierName} - ${aspectName}</div>
        <div class="tooltip-section">
            <div class="tooltip-label">Origin: ${origin}</div>
            <div class="tooltip-value">+${value}%</div>
        </div>
    `;
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Add origin enhancement (TO/DO/SO)
 */
function addSO(tier, tierName, aspect, aspectName) {
    const tierData = ORIGIN_TIERS[tier];
    
    // Create enhancement object
    const enhancement = createEnhancement('origin', {
        tier: tier,
        tierName: tierName,
        aspect: aspect,
        aspectName: aspectName,
        value: tierData.value
    });
    
    // Add to build
    const success = addEnhancementToPower(AppState.currentPowerName, AppState.currentSlotIndex, enhancement);
    
    if (success) {
        // Update UI
        updatePowerSlots(AppState.currentPowerName);
        updateStatsDisplay();
        closeModal();
    }
}

// ============================================
// TOOLTIPS
// ============================================

/**
 * Show tooltip for IO set bonuses
 * @param {Event} event - Mouse event
 * @param {string} setId - Set identifier
 */
function showSetTooltip(event, setId) {
    const set = IO_SETS[setId];
    if (!set) return;
    
    const tooltip = document.getElementById('tooltip');
    const html = `
        <div class="tooltip-title">${set.name}</div>
        <div class="tooltip-section">
            <div class="tooltip-label">Set Bonuses</div>
            <ul class="bonus-list">
                ${set.bonuses.map(b => `<li>${b}</li>`).join('')}
            </ul>
        </div>
    `;
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Show tooltip for enhancement piece
 * @param {Event} event - Mouse event
 * @param {string} setId - Set identifier
 * @param {number} pieceNum - Piece number
 */
function showPieceTooltip(event, setId, pieceNum) {
    const set = IO_SETS[setId];
    if (!set) return;
    
    const piece = set.pieces.find(p => p.num === pieceNum);
    if (!piece) return;
    
    const tooltip = document.getElementById('tooltip');
    const html = `
        <div class="tooltip-title">${set.name} - ${piece.name}</div>
        <div class="tooltip-section">
            <div class="tooltip-label">Enhancement Values</div>
            <div class="tooltip-value">${piece.values}</div>
        </div>
        ${piece.unique ? '<div class="tooltip-section"><div class="tooltip-value" style="color: var(--warning)">⚠ Unique - Only one per build</div></div>' : ''}
    `;
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Show enhanced tooltip for set piece in icon grid
 * @param {Event} event - Mouse event
 * @param {string} setId - Set identifier
 * @param {number} pieceNum - Piece number
 */
function showSetPieceTooltip(event, setId, pieceNum) {
    const set = IO_SETS[setId];
    if (!set) return;
    
    const piece = set.pieces.find(p => p.num === pieceNum);
    if (!piece) return;
    
    const tooltip = document.getElementById('tooltip');
    const html = `
        <div class="tooltip-title">${set.name}</div>
        <div class="tooltip-section">
            <div class="tooltip-label">${piece.name} (Piece ${piece.num})</div>
            <div class="tooltip-value">${piece.values}</div>
        </div>
        <div class="tooltip-section" style="margin-top: 8px;">
            <div class="tooltip-label">Set Bonuses (${set.pieces.length} pieces)</div>
            <ul class="bonus-list">
                ${set.bonuses.map(b => `<li>${b}</li>`).join('')}
            </ul>
        </div>
        ${piece.unique ? '<div class="tooltip-section"><div class="tooltip-value" style="color: var(--warning)">⚠ Unique</div></div>' : ''}
    `;
    
    tooltip.innerHTML = html;
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    document.getElementById('tooltip').classList.remove('visible');
}

/**
 * Position tooltip near cursor
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {Event} event - Mouse event
 */
function positionTooltip(tooltip, event) {
    const x = event.clientX + 15;
    const y = event.clientY + 15;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    
    // Keep tooltip on screen
    const rect = tooltip.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        tooltip.style.left = (window.innerWidth - rect.width - 10) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
        tooltip.style.top = (window.innerHeight - rect.height - 10) + 'px';
    }
}
