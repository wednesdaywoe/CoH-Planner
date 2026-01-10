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
    // Open directly into the selection view (category screen removed)
    AppState.currentView = 'selection';
    AppState.viewStack = [];
    document.getElementById('categoryView')?.classList?.add('hidden');
    document.getElementById('selectionViewSets').classList.add('active');
    document.getElementById('backBtn').classList.remove('visible');
    // Load default group (all sets)
    loadSetsForCategory('io-set');
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
    // Category view removed; fall back to default selection view (All Sets)
    AppState.currentView = 'selection';
    AppState.currentCategory = null;
    document.getElementById('selectionViewSets').classList.add('active');
    document.getElementById('backBtn').classList.remove('visible');
    loadSetsForCategory('io-set');
}

/**
 * Go back to category view
 */
function goBack() {
    // Pop previous view from stack and restore; if none, close modal
    const prev = AppState.viewStack && AppState.viewStack.length ? AppState.viewStack.pop() : null;
    if (!prev) {
        closeModal();
        return;
    }
    restoreModalView(prev);
}

/**
 * Restore modal view by id key
 * @param {string} viewKey - 'sets'|'generic'|'special'|'so'
 */
function restoreModalView(viewKey) {
    // Always restore into the main sets view and render the appropriate content
    document.getElementById('selectionViewSets').classList.add('active');
    const setsPanel = document.querySelector('#selectionViewSets .sets-panel');
    setsPanel.dataset.listenersAttached = 'false';
    if (viewKey === 'generic') {
        renderGenericRow(setsPanel);
    } else if (viewKey === 'special') {
        renderSpecialRow(setsPanel);
    } else if (viewKey === 'so') {
        renderOriginRows(setsPanel);
    } else {
        loadSetsForCategory('io-set');
    }
    // Show back button when there is history
    if (AppState.viewStack && AppState.viewStack.length) {
        document.getElementById('backBtn').classList.add('visible');
    } else {
        document.getElementById('backBtn').classList.remove('visible');
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
    document.getElementById('backBtn').classList.add('visible');
    
    // Hide all selection views
    // Always use the sets view and render the requested category inline
    document.getElementById('selectionViewSets').classList.add('active');
    const setsPanel = document.querySelector('#selectionViewSets .sets-panel');
    setsPanel.dataset.listenersAttached = 'false';
    if (category === 'io-set' || category === 'very-rare' || category === 'event' || category === 'archetype') {
        loadSetsForCategory(category);
    } else if (category === 'io-generic') {
        renderGenericRow(setsPanel);
    } else if (category === 'special') {
        renderSpecialRow(setsPanel);
    } else if (category === 'to-do-so') {
        renderOriginRows(setsPanel);
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
    
    // Store allowed set categories for later filtering of generic/special/origin rows
    const result = findPower(AppState.currentPowerName);
    AppState.currentAllowedSetCategories = result ? (result.power.allowedSetCategories || []) : [];

    // Ensure group filter events are wired
    setupGroupFilterEvents(typesPanel);
    // Generate type filter buttons
    generateTypeFilterButtons(typesPanel, compatibleSets);
    
    // Render sets
    renderSetsList(setsPanel, compatibleSets);
}

/**
 * Check if an enhancement aspect is allowed for the current power
 * Uses ENHANCEMENT_TO_SET_TYPE_MAP when available; if unknown, allow by default
 */
function isAspectAllowedByPower(aspectName) {
    const allowed = AppState.currentAllowedSetCategories || [];
    if (!allowed || !allowed.length) return true;
    const mapped = ENHANCEMENT_TO_SET_TYPE_MAP[aspectName];
    if (!mapped || !mapped.length) return true;
    return mapped.some(m => allowed.includes(m));
}

/**
 * Render a single-row Common IO section inside the sets panel
 */
function renderGenericRow(setsPanel) {
    const aspects = [
        { id: 'damage', name: 'Damage' },
        { id: 'accuracy', name: 'Accuracy' },
        { id: 'recharge', name: 'Recharge' },
        { id: 'endurance', name: 'Endurance' },
        { id: 'defense', name: 'Defense' },
        { id: 'resistance', name: 'Resistance' },
        { id: 'healing', name: 'Healing' },
        { id: 'tohit', name: 'To Hit Buff' },
        { id: 'range', name: 'Range' },
        { id: 'hold', name: 'Hold' },
        { id: 'stun', name: 'Stun' },
        { id: 'immobilize', name: 'Immobilize' },
        { id: 'sleep', name: 'Sleep' },
        { id: 'confuse', name: 'Confuse' },
        { id: 'fear', name: 'Fear' },
        { id: 'knockback', name: 'Knockback' },
        { id: 'fly', name: 'Flight' },
        { id: 'jump', name: 'Jump' },
        { id: 'run', name: 'Run' }
    ];

    let html = `<div class="set-row">
                    <div class="set-row-header">Common IO</div>
                    <div class="set-pieces-grid common-io-grid">`;

    aspects.forEach(aspect => {
        const iconPath = getAspectIcon(aspect.id);
        const allowed = isAspectAllowedByPower(aspect.name);
        const disabledClass = allowed ? '' : ' disabled';
        html += `
            <div class="set-piece-icon${disabledClass}" data-aspect-id="${aspect.id}" data-aspect-name="${aspect.name}">
                <div class="enhancement-icon-layered">
                    <img src="${iconPath}" class="enhancement-icon-base">
                    <img src="img/Overlay/IO.png" class="enhancement-icon-overlay">
                </div>
                <div class="set-piece-number">${aspect.name}</div>
            </div>`;
    });

    html += `</div></div>`;
    setsPanel.innerHTML = html;

    // Wire click handlers (delegated)
    setsPanel.querySelector('.common-io-grid').addEventListener('click', (e) => {
        const el = e.target.closest('.set-piece-icon');
        if (!el || el.classList.contains('disabled')) return;
        const aspectId = el.dataset.aspectId;
        const aspectName = el.dataset.aspectName;
        addGenericIO(aspectId, aspectName);
    });
}

/**
 * Render a single-row Special (Hamidon) section
 */
function renderSpecialRow(setsPanel) {
    const hamiTypes = [
        { id: 'nucleolus', name: 'Nucleolus', aspects: ['Damage', 'Accuracy'] },
        { id: 'centriole', name: 'Centriole', aspects: ['Damage', 'Range'] },
        { id: 'enzyme', name: 'Enzyme', aspects: ['To Hit Buff', 'Defense Debuff'] },
        { id: 'lysosome', name: 'Lysosome', aspects: ['Accuracy', 'To Hit Debuff'] },
        { id: 'membrane', name: 'Membrane', aspects: ['Recharge', 'Defense Debuff'] },
        { id: 'peroxisome', name: 'Peroxisome', aspects: ['Damage', 'Mez'] },
        { id: 'cytoskeleton', name: 'Cytoskeleton', aspects: ['Defense', 'To Hit Buff'] },
        { id: 'endoplasm', name: 'Endoplasm', aspects: ['Accuracy', 'Mez'] },
        { id: 'golgi', name: 'Golgi', aspects: ['Healing', 'Endurance'] },
        { id: 'microfilament', name: 'Microfilament', aspects: ['Travel', 'Endurance'] },
        { id: 'ribosome', name: 'Ribosome', aspects: ['Resist', 'Endurance'] }
    ];

    let html = `<div class="set-row">
                    <div class="set-row-header">Special</div>
                    <div class="set-pieces-grid special-grid-inline">`;

    hamiTypes.forEach(hami => {
        const iconPath = `img/Enhancements/HO${hami.name}.png`;
        // Determine allowed by checking any aspect mapping
        const allowed = hami.aspects.some(a => isAspectAllowedByPower(a));
        const disabledClass = allowed ? '' : ' disabled';
        html += `
            <div class="set-piece-icon${disabledClass}" data-hami-id="${hami.id}">
                <img src="${iconPath}" style="width:48px;height:48px;">
                <div class="set-piece-number">${hami.name}</div>
            </div>`;
    });

    html += `</div></div>`;
    setsPanel.innerHTML = html;

    setsPanel.querySelector('.special-grid-inline').addEventListener('click', (e) => {
        const el = e.target.closest('.set-piece-icon');
        if (!el || el.classList.contains('disabled')) return;
        const hamiId = el.dataset.hamiId;
        addSpecialEnhancement(hamiId);
    });
}

/**
 * Render SO/DO/TO as three rows (Single Origin, Dual Origin, Training)
 */
function renderOriginRows(setsPanel) {
    const tiers = [
        { tier: 2, name: 'Single Origin' },
        { tier: 1, name: 'Dual Origin' },
        { tier: 0, name: 'Training' }
    ];

    const aspects = [
        { id: 'damage', name: 'Damage' },
        { id: 'accuracy', name: 'Accuracy' },
        { id: 'recharge', name: 'Recharge' },
        { id: 'endurance', name: 'Endurance' },
        { id: 'defense', name: 'Defense' },
        { id: 'resistance', name: 'Resistance' },
        { id: 'healing', name: 'Healing' },
        { id: 'range', name: 'Range' }
    ];

    let html = '';
    tiers.forEach(t => {
        html += `<div class="set-row">
                    <div class="set-row-header">${t.name}</div>
                    <div class="set-pieces-grid origin-grid-tier-${t.tier}">`;

        aspects.forEach(aspect => {
            const iconPath = getAspectIcon(aspect.id);
            const allowed = isAspectAllowedByPower(aspect.name);
            const disabledClass = allowed ? '' : ' disabled';
            html += `
                <div class="set-piece-icon${disabledClass}" data-tier="${t.tier}" data-aspect-id="${aspect.id}" data-aspect-name="${aspect.name}">
                    <div class="enhancement-icon-layered">
                        <img src="${iconPath}" class="enhancement-icon-base">
                        <img src="${getOriginOverlay(t.tier)}" class="enhancement-icon-overlay">
                    </div>
                    <div class="set-piece-number">${aspect.name}</div>
                </div>`;
        });

        html += `</div></div>`;
    });

    setsPanel.innerHTML = html;

    // Delegated click
    setsPanel.addEventListener('click', function originClickHandler(e) {
        const el = e.target.closest('.set-piece-icon');
        if (!el || el.classList.contains('disabled')) return;
        if (el.dataset.tier !== undefined) {
            const tier = parseInt(el.dataset.tier);
            const aspect = el.dataset.aspectId;
            const aspectName = el.dataset.aspectName;
            addSO(tier, tier === 2 ? 'Single Origin' : tier === 1 ? 'Dual Origin' : 'Training', aspect, aspectName);
        }
    });
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
    
    // Put buttons inside the types-list subpanel (render only actual subcategories)
    const typesList = typesPanel.querySelector('.types-list') || typesPanel;
    let html = '';
    // Render subcategory buttons (no single 'All' button here)
    sortedTypes.forEach(([type, count]) => {
        html += `<div class="type-option" data-type-filter="${type}">${type} (${count})</div>`;
    });
    // Ensure 'Universal Damage' appears as a prominent filter when applicable
    const hasUniversal = compatibleSets.some(({ set }) => /universal/i.test(set.type));
    if (hasUniversal && !sortedTypes.some(([t]) => /universal/i.test(t))) {
        html += `<div class="type-option" data-type-filter="Universal Damage">Universal Damage (1+)</div>`;
    }
    typesList.innerHTML = html;
    // Set up event delegation for type filter clicks
    setupTypeFilterEvents(typesPanel);
}

/**
 * Setup event handlers for type filter buttons
 */
function setupTypeFilterEvents(typesPanel) {
    // Check if listeners are already set up
    const typesList = typesPanel.querySelector('.types-list') || typesPanel;
    if (typesList.dataset.listenersAttached === 'true') return;
    // Mark as having listeners attached
    typesList.dataset.listenersAttached = 'true';
    // Click handler
    typesList.addEventListener('click', (e) => {
        const button = e.target.closest('.type-option');
        if (!button) return;

        const typeFilter = button.dataset.typeFilter;

        // Update button styles
        typesList.querySelectorAll('.type-option').forEach(btn => btn.classList.remove('selected'));
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
 * Setup group filter buttons (Very Rare, Event, Special, IO generic, TO/DO/SO)
 */
function setupGroupFilterEvents(typesPanel) {
    const groupPanel = typesPanel.querySelector('.group-filters');
    if (!groupPanel) return;
    if (groupPanel.dataset.listenersAttached === 'true') return;
    groupPanel.dataset.listenersAttached = 'true';

    groupPanel.addEventListener('click', (e) => {
        const btn = e.target.closest('.group-filter-option');
        if (!btn) return;
        // Update button styles
        groupPanel.querySelectorAll('.group-filter-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const category = btn.dataset.category || 'io-set';
        // Push current view key onto history (use AppState.currentView)
        AppState.viewStack = AppState.viewStack || [];
        AppState.viewStack.push(AppState.currentView || 'selection');
        // Show back button
        document.getElementById('backBtn').classList.add('visible');

        // All rendering now happens inside the main sets view
        const setsPanel = document.querySelector('#selectionViewSets .sets-panel');
        // Clear any previous listenersAttached flag so new content can wire handlers
        setsPanel.dataset.listenersAttached = 'false';

        if (category === 'io-generic') {
            // Render common IO in a single row
            renderGenericRow(setsPanel);
        } else if (category === 'special') {
            // Render special (Hamidon) in a single row
            renderSpecialRow(setsPanel);
        } else if (category === 'to-do-so') {
            // Render SO/DO/TO as three rows
            renderOriginRows(setsPanel);
        } else {
            // Default to sets view and load matching sets
            loadSetsForCategory(category);
        }
    });
}


/**
 * Check if a piece from a set is already slotted in the current power
 * @param {string} setId - Set identifier
 * @param {number} pieceNum - Piece number
 * @returns {boolean} True if already slotted
 */
function isPieceAlreadySlotted(setId, pieceNum) {
    if (!AppState.currentPowerName) return false;
    
    const result = findPower(AppState.currentPowerName);
    if (!result || !result.power.slots) return false;
    
    return result.power.slots.some(slot => 
        slot && slot.type === 'io-set' && slot.setId === setId && slot.pieceNum === pieceNum
    );
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
            // Check if this piece is already slotted in the current power
            const alreadySlotted = isPieceAlreadySlotted(setId, piece.num);
            const disabledClass = alreadySlotted ? ' disabled' : '';
            // Use data attributes instead of inline onclick
            html += `
                <div class="set-piece-icon${uniqueClass}${procClass}${disabledClass}" 
                     data-set-id="${setId}"
                     data-piece-num="${piece.num}">
                    <img src="${iconPath}" alt="${set.name}" onerror="this.onerror=null;this.src='img/Enhancements/Damage.png'">
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
        
        // Ignore clicks on disabled pieces
        if (piece.classList.contains('disabled')) return;
        
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
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
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
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
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
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
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
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
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
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + html;
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
