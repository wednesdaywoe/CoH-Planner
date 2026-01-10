# Debugging T4 Component Cost Calculation

## What Was Changed

Added comprehensive logging to trace the exact flow of component cost calculation:

### 1. getComponentsForNode() in incarnate-component-helper.js (line ~51)
- Now logs exactly what components are being retrieved for each tier
- Format: `getComponentsForNode(alpha, Agility, t4_core): tier4.core = salvage=[component1, component2, ...]`

### 2. calculateComponentsCost() in incarnate-component-helper.js (line ~116)
- Logs every component being processed with quantity and calculated cost
- Shows final totals at end: `calculateComponentsCost TOTAL: {threads:XX, empyrean:YY}`

### 3. getCostsForPath() in incarnate-mockup-with-icons.html (line ~1175)
- Logs which tiers are included in the path: `getCostsForPath(t3_core_1): nodeIds=[t1, t2_core, t3_core_1]`
- Shows cost breakdown for each tier
- Shows final total

### 4. getNodeOnlyCost() in incarnate-mockup-with-icons.html (line ~1143)
- Logs what components it finds for a single node
- Shows the salvage array and final cost

### 5. showNodeInfo() in incarnate-mockup-with-icons.html (line ~1884)
- Logs the calculated merit equivalents
- Shows both node-only and full-path costs

## How to Debug

1. Open incarnate-mockup-with-icons.html in your browser
2. Open the browser's Developer Console (F12)
3. Click on an Alpha slot power (e.g., Agility)
4. Click on Tier 4 node
5. Watch the console output - you should see:

```
getComponentsForNode(alpha, Agility, t4_core): tier4.core = salvage=[...]
calculateComponentsCost: Processing X components
  component1 (qty:...) -> {threads:..., emp:...}
  component2 (qty:...) -> {threads:..., emp:...}
  ...
calculateComponentsCost TOTAL: {threads:380, empyrean:46}
getCostsForPath(t3_core_1): nodeIds=[t1, t2_core, t3_core_1]
  t1: salvage=[...], cost={threads:..., emp:...}
  t2_core: salvage=[...], cost={threads:..., emp:...}
  t3_core_1: salvage=[...], cost={threads:..., emp:...}
getCostsForPath final: {threads:XXX, empyrean:YY}
```

## Expected Values (from user's data)

For Alpha Agility T4 node only:
- Components: 13 items including ArcaneCantrip, NanotechGrowthMedium, etc.
- Threads: 380
- Merits: 46
- Merit Equivalent: 65 (19 from threads + 46 from merits)

Currently showing:
- Threads: 180 (50% of expected)
- Merits: 55 (wrong components being counted)

## Likely Issues

1. **T4 component data missing in incarnate-components.js**
   - Check if IncarnateComponents.alpha.Agility.tier4.core exists
   - Check if the salvage array has all 13 components

2. **Component names not matching**
   - The component rarity lookup uses exact name matching
   - If names are spelled differently in the data vs. the rarity list, they'll default to common (20 threads)

3. **Quantity not being parsed correctly**
   - Components might be stored as "2x ArcaneCantrip" or "ArcaneCantrip (2)" or just "ArcaneCantrip"
   - The regex at line ~131 in helper tries both formats

4. **Missing T4 variants**
   - T4 can have core and radial variants
   - Make sure both are defined in incarnate-components.js

## Next Steps

1. Run the page and check console output
2. Verify the component list matches user's expectations
3. If components are missing, check incarnate-components.js
4. If components are there but names don't match, update the rarity lists in getComponentRarity()
