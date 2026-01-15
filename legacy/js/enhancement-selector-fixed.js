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
