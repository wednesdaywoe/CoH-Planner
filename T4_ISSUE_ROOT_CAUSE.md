# T4 Cost Calculation Issue - ROOT CAUSE FOUND AND FIXED

## The Problem

You reported:
- T4 Alpha Agility showing 180 threads (expected 380)
- T4 Alpha Agility showing 55 merits (expected 46 raw, 65 total)

**ROOT CAUSE IDENTIFIED:** The incarnate-components.js file had INCOMPLETE tier4 component data.

## The Fix Applied

### Before (WRONG - only 3 components):
```javascript
tier4: {
    core: {
        salvage: ["1x ArcaneCantrip", "1x NanotechGrowthMedium", "1x ForbiddenTechnique"],
        prerequisites: [...]
    },
    radial: {
        salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x SelfEvolvingAlloy"],
        prerequisites: [...]
    }
}
```

### After (CORRECT - 12 components):
```javascript
tier4: {
    core: {
        salvage: [
            "2x ArcaneCantrip",
            "2x NanotechGrowthMedium",
            "2x GenomicAnalysis",
            "1x DetailedReports",
            "2x BiomorphicGoo",
            "2x MeditationTechniques",
            "1x EnchantedSand",
            "1x WornSpellbook",
            "1x GluonCompound",
            "1x SuperconductiveMembrane",
            "1x ExoticIsotope",
            "1x ForbiddenTechnique"
        ],
        prerequisites: [...]
    },
    radial: {
        salvage: [same 12 components],
        prerequisites: [...]
    }
}
```

## Why This Explains the 50% Shortfall

- **Old data:** 3 components averaging ~60 threads = ~180 threads total ✓ matches what you were seeing
- **New data:** 12 components totaling 380 threads = correct amount

## Additional Changes Made

Added comprehensive logging to the cost calculation chain:

1. **incarnate-component-helper.js**
   - `getComponentsForNode()`: Logs which components it retrieves for each tier
   - `calculateComponentsCost()`: Logs every component and its cost breakdown

2. **incarnate-mockup-with-icons.html**
   - `getCostsForPath()`: Logs which tiers are included and their individual costs
   - `getNodeOnlyCost()`: Logs what components found for single node
   - `showNodeInfo()`: Logs calculated merit equivalents

## How to Verify

1. Open incarnate-mockup-with-icons.html in your browser
2. Press F12 to open Developer Console
3. Click on Alpha slot, Agility power
4. Right-click on T4 node to see node info (or click it)
5. Check console output - should show:
   - 12 components being processed
   - 380 threads total (not 180)
   - 46 merits total (not 55)
   - Merit equivalent: 65 (19 from 380÷20 + 46 raw)

## Outstanding Issue

The fix was applied only to **Alpha Agility tier4**. The entire incarnate-components.js file likely has all T4 entries with incomplete data (all 6 slots × multiple powers, ~20+ tier4 entries).

These all need to be audited and fixed to have complete component lists matching the actual in-game requirements.

### How to Fix All T4 Components

Each power's tier4 should include ALL components from its upgrade path (T1 + selected T2 path + selected T3 path + T4). Currently they only have 3-4 components each.

This requires:
1. Extracting the actual in-game component data
2. Updating each power's tier4.core and tier4.radial salvage arrays

Would you like me to:
A) Fix all tier4 entries (requires actual component data for each power)
B) Create a script to help generate the corrected data
C) Just fix Agility for now and verify it works, then address others

