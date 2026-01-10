# T4 Component Analysis - NEAR COMPLETE

## Current Status

### Before Fix:
- T4 Agility showing: **180 threads** (was getting only 3 components)
- Expected: **380 threads**

### After Fix:
- T4 Agility now showing: **360 threads** (from 12 components)
- Expected: **380 threads**
- **Gap: 20 threads (1 component)**

## Current T4 Agility Component List

```javascript
salvage: [
    "2x ArcaneCantrip",           // Common: 20 each = 40
    "2x NanotechGrowthMedium",    // Common: 20 each = 40
    "2x GenomicAnalysis",         // Common: 20 each = 40
    "1x DetailedReports",         // Common: 20 = 20
    "2x BiomorphicGoo",           // Common: 20 each = 40
    "2x MeditationTechniques",    // Common: 20 each = 40
    "1x EnchantedSand",           // Common: 20 = 20
    "1x WornSpellbook",           // Uncommon: 60 = 60
    "1x GluonCompound",           // Uncommon: 60 = 60
    "1x SuperconductiveMembrane", // Rare: 8 merits = 8
    "1x ExoticIsotope",           // Rare: 8 merits = 8
    "1x ForbiddenTechnique"       // VeryRare: 30 merits = 30
]
```

**Subtotal: 360 threads + 46 merits = 62 merit equivalent**

## Issue: Missing 20 Threads

To reach the expected 380 threads, we need one more component:
- Either 1 more Uncommon component (60 threads) - would give 420 (too much)
- Or 1 more Common component (20 threads) - would give 380 ✓

### Possibilities:

1. **One quantity is wrong** - Maybe one should be "3x" instead of "2x":
   - If one of the "2x" common components should be "3x", that adds 20 threads
   - Candidates: ArcaneCantrip, NanotechGrowthMedium, GenomicAnalysis, BiomorphicGoo, MeditationTechniques

2. **A component is missing** - There might be another component in the full list:
   - SuperchargedCapacitor? (appears in T3_radial)
   - Another common component not listed?

3. **Verification needed** - The user provided a list with 13 components mentioned, but I only count 12

## Next Steps

**Please verify which of these is correct:**

A) The component list I have is correct (12 items, 360 threads), and the 380 figure was approximate
B) One of the quantities should be 3x instead of 2x (please specify which)
C) There's another component missing entirely (please list it)
D) One component has the wrong rarity/cost

## Test the Current Fix

1. Open incarnate-mockup-with-icons.html
2. Press F12 for Developer Console
3. Select Alpha > Agility > Tier 4
4. Console will show detailed component breakdown
5. Check if total is now ~360 threads (much better than 180)

The fix has successfully increased the component count from 3 to 12 items, which is a 4x improvement in the thread cost calculation. We just need to identify the final missing piece to reach 380.

