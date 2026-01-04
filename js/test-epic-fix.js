// Test script to verify epic pool fix
console.log('=== Epic Pool Fix Verification ===');
console.log('Waiting for epic pools to load...');

// Wait a bit for pools to load
setTimeout(() => {
    if (typeof EPIC_POOLS === 'undefined') {
        console.error('EPIC_POOLS not found!');
        return;
    }
    
    console.log(`✓ EPIC_POOLS found with ${Object.keys(EPIC_POOLS).length} pools`);
    
    // Test looking up a specific pool
    const testPoolId = 'blaster_mu_mastery';
    console.log(`\nTesting lookup of: ${testPoolId}`);
    
    if (EPIC_POOLS[testPoolId]) {
        console.log(`✓ SUCCESS: Found pool "${testPoolId}"`);
        console.log(`  Name: ${EPIC_POOLS[testPoolId].name}`);
        console.log(`  Archetype: ${EPIC_POOLS[testPoolId].archetype}`);
        console.log(`  Powers: ${EPIC_POOLS[testPoolId].powers.length}`);
    } else {
        console.error(`✗ FAILED: Pool "${testPoolId}" not found!`);
        console.log('Available pools:');
        Object.keys(EPIC_POOLS).slice(0, 10).forEach(key => {
            console.log(`  - ${key}`);
        });
    }
    
    // Test the full epic pool selection flow
    console.log('\n=== Testing Full Selection Flow ===');
    if (typeof getEpicPool === 'function') {
        const pool = getEpicPool(testPoolId);
        if (pool) {
            console.log(`✓ getEpicPool("${testPoolId}") returned pool: ${pool.name}`);
        } else {
            console.error(`✗ getEpicPool("${testPoolId}") returned null`);
        }
    }
    
}, 2000);
