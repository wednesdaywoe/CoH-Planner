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
    const typesPanel = document.querySelector('#selectionViewSets .types-panel');
    
    // Map UI category buttons to IO set categories
    const categoryMap = {
        'io-set': 'io-set',
        'very-rare': 'purple',
        'event': 'event',
        'archetype': 'ato'
    };
    
    const ioCategory = categoryMap[category];
    
    // Get compatible sets for this power
    let compatibleSets = getCompatibleSetsForPower(AppState.currentPowerName, ioCategory);
    
    // Store for type filtering
    AppState.currentCompatibleSets = compatibleSets;
    AppState.currentTypeFilter = null;
    
    // Generate type filter buttons
    generateTypeFilterButtons(typesPanel, compatibleSets);
    
    // Render sets
    renderSetsList(setsPanel, compatibleSets);
}

/**
 * Generate type filter buttons based on compatible sets
 * @param {HTMLElement} typesPanel - The types panel element
 * @param {Array} compatibleSets - Array of compatible {setId, set} objects
 */
function generateTypeFilterButtons(typesPanel, compatibleSets) {
    // Count sets by type
    const typeCounts = {};
    compatibleSets.forEach(({ set }) => {
        if (!typeCounts[set.type]) {
            typeCounts[set.type] = 0;
        }
        typeCounts[set.type]++;
    });
    
    // Sort by count (descending)
    const sortedTypes = Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1]);
    
    let html = '<div class="types-title">Types</div>';
    
    // "All" button - use data attribute instead of onclick
    html += `<div class="type-option selected" data-type-filter="all">All (${compatibleSets.length})</div>`;
    
    // Type buttons - use data attributes
    sortedTypes.forEach(([type, count]) => {
        html += `<div class="type-option" data-type-filter="${type}">${type} (${count})</div>`;
    });
    
    typesPanel.innerHTML = html;
    
    // Set up event delegation for type filter clicks
    setupTypeFilterEvents(typesPanel);
}

/**
 * Setup event handlers for type filter buttons
 */
function setupTypeFilterEvents(typesPanel) {
    // Check if listeners are already set up
    if (typesPanel.dataset.listenersAttached === 'true') {
        return;
    }
    
    // Mark as having listeners attached
    typesPanel.dataset.listenersAttached = 'true';
    
    // Click handler
    typesPanel.addEventListener('click', (e) => {
        const button = e.target.closest('.type-option');
        if (!button) return;
        
        const typeFilter = button.dataset.typeFilter;
        
        // Update button styles
        typesPanel.querySelectorAll('.type-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        
        // Filter and render
        const type = typeFilter === 'all' ? null : typeFilter;
        AppState.currentTypeFilter = type;
        const filtered = filterSetsByType(AppState.currentCompatibleSets, type);
        const setsPanel = document.querySelector('#selectionViewSets .sets-panel');
        renderSetsList(setsPanel, filtered);
    });
}


/**
 * Render list of sets
 * @param {HTMLElement} setsPanel - The sets panel element
 * @param {Array} setsToShow - Array of {setId, set} objects
 */
function renderSetsList(setsPanel, setsToShow) {
    if (setsToShow.length === 0) {
        setsPanel.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-tertiary);">No compatible sets found</div>';
        return;
    }
    
    // Sort alphabetically
    setsToShow.sort((a, b) => a.set.name.localeCompare(b.set.name));
    
    let html = '';
    setsToShow.forEach(({ setId, set }) => {
        const iconPath = getSetIcon(setId) || 'img/Enhancements/Damage.png';
        const purpleClass = set.category === 'purple' ? ' purple' : '';
        
        html += `
            <div class="set-row">
                <div class="set-row-header${purpleClass}">
                    ${set.name}
                    <span class="set-row-meta">Lv ${set.minLevel}-${set.maxLevel} • ${set.pieces.length} pieces</span>
                </div>
                <div class="set-pieces-grid" data-set-id="${setId}">
        `;
        
        set.pieces.forEach(piece => {
            const uniqueClass = piece.unique ? ' unique' : '';
            const procClass = piece.proc ? ' proc' : '';
            // Use data attributes instead of inline onclick
            html += `
                <div class="set-piece-icon${uniqueClass}${procClass}" 
                     data-set-id="${setId}"
                     data-piece-num="${piece.num}">
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
    
    // Add event delegation for clicks and tooltips
    setupSetPieceEvents(setsPanel);
}

/**
 * Setup event handlers for set pieces using event delegation
 * Only sets up once per panel to avoid accumulating listeners
 */
function setupSetPieceEvents(setsPanel) {
    // Check if listeners are already set up
    if (setsPanel.dataset.listenersAttached === 'true') {
        // Just refresh drag selection
        initDragSelection();
        return;
    }
    
    // Mark as having listeners attached
    setsPanel.dataset.listenersAttached = 'true';
    
    // Click handler
    setsPanel.addEventListener('click', (e) => {
        const piece = e.target.closest('.set-piece-icon');
        if (!piece) return;
        
        const setId = piece.dataset.setId;
        const pieceNum = parseInt(piece.dataset.pieceNum);
        handlePieceClick(e, setId, pieceNum);
    });
    
    // Tooltip handlers
    setsPanel.addEventListener('mouseenter', (e) => {
        const piece = e.target.closest('.set-piece-icon');
        if (!piece) return;
        
        const setId = piece.dataset.setId;
        const pieceNum = parseInt(piece.dataset.pieceNum);
        // Use enhanced tooltip from tooltip-improvements.js
        if (typeof showEnhancementPieceTooltip === 'function') {
            showEnhancementPieceTooltip(e, setId, pieceNum);
        }
    }, true);
    
    setsPanel.addEventListener('mouseleave', (e) => {
        const piece = e.target.closest('.set-piece-icon');
        if (!piece) return;
        hideTooltip();
    }, true);
    
    // Add drag selection handlers
    initDragSelection();
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
        recalculateStats();
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
        recalculateStats();
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
    const bonusList = set.bonuses.map(b => `<li>${b.desc}</li>`).join('');
    const html = `
        <div class="tooltip-title">${set.name}</div>
        <div class="tooltip-section">
            <div class="tooltip-label">Set Bonuses</div>
            <ul class="bonus-list">
                ${bonusList}
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
 * Uses unified tooltip system
 * @param {Event} event - Mouse event
 * @param {string} setId - Set identifier
 * @param {number} pieceNum - Piece number
 */
function showSetPieceTooltip(event, setId, pieceNum) {
    const set = IO_SETS[setId];
    if (!set) return;
    
    // Use unified tooltip system (defined in unified-tooltips.js)
    if (typeof showSetTooltip === 'function') {
        showSetTooltip(event, set, 0); // 0 = none slotted yet in modal view
    }
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
