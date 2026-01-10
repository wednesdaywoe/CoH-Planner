# Incarnate System UI Design Document

## Overview
The Incarnate UI will allow users to select powers for each of the 6 main Incarnate slots and automatically calculate all components, threads, and Empyrean Merits needed to craft those powers, aggregating requirements across all tiers.

## Key Features
1. **Slot Selection Interface** - Visual grid showing all 6 Incarnate slots
2. **Power Browser** - Select specific abilities within each slot
3. **Shopping List** - Automatic calculation of all crafting requirements
4. **Progress Tracking** - "What I Have" vs "What I Need"
5. **Conversion Calculator** - Thread ↔ Component ↔ Empyrean Merit conversions

---

## Data Structure

### Incarnate Slots (6 total)
```javascript
const INCARNATE_SLOTS = {
    alpha: {
        name: 'Alpha',
        icon: 'incarnate_alpha.png',
        trees: ['Cardiac', 'Musculature', 'Nerve', 'Spiritual', 'Agility', 'Intuition', 'Resilient', 'Vigor'],
        description: 'Global enhancement bonuses + Level Shift'
    },
    judgement: {
        name: 'Judgement',
        icon: 'incarnate_judgement.png',
        trees: ['Cryonic', 'Ion', 'Pyronic', 'Void'],
        description: 'Powerful AoE/Cone attacks'
    },
    interface: {
        name: 'Interface',
        icon: 'incarnate_interface.png',
        trees: ['Diamagnetic', 'Gravitic', 'Paralytic', 'Reactive'],
        description: 'Proc-based debuffs on all attacks'
    },
    lore: {
        name: 'Lore',
        icon: 'incarnate_lore.png',
        trees: ['Clockwork', 'Warworks', 'IDF', 'Seers', 'Arachnos', /* +20 more */],
        description: 'Summonable combat pets'
    },
    destiny: {
        name: 'Destiny',
        icon: 'incarnate_destiny.png',
        trees: ['Ageless', 'Barrier', 'Clarion', 'Rebirth'],
        description: 'Powerful team buffs'
    },
    hybrid: {
        name: 'Hybrid',
        icon: 'incarnate_hybrid.png',
        trees: ['Assault', 'Control', 'Melee', 'Ranged', 'Support'],
        description: 'Mixed offensive/defensive bonuses'
    }
};
```

### Tier Structure (4 tiers per tree, 2 variants per tier)
```javascript
const TIER_NAMES = {
    1: { common: 'Boost', core: 'Core Boost', radial: 'Radial Boost' },
    2: { common: 'Paragon', core: 'Core Paragon', radial: 'Radial Paragon' },
    3: { common: 'Revamp', core: 'Partial Core Revamp', radial: 'Partial Radial Revamp' },
    4: { core: 'Total Core Revamp', radial: 'Total Radial Revamp' }
};
```

### Crafting Requirements

#### Alpha Slot (Unique Crafting Path)
```javascript
const ALPHA_RECIPES = {
    tier1: {
        threads: 20,
        // OR
        shards: 12,  // 3 Common Components × 4 shards each
    },
    tier2: {
        threads: 60,
        // OR
        shards: 32,  // 1 Uncommon (12 shards) + 2 Common (8 shards) + T1 consumed
        requires: ['tier1']  // Consumes the T1 ability
    },
    tier3: {
        threads: 100,
        empyreanMerits: 8,  // To craft Rare Component
        // OR
        noticeOfWell: 1,  // From Weekly Strike Target
        requires: ['tier2']
    },
    tier4: {
        empyreanMerits: 60,  // 30 per T3, need both Core and Radial
        // OR
        threads: 600,  // 300 per T3
        requires: ['tier3_core', 'tier3_radial']  // Need BOTH variants
    }
};
```

#### Other Slots (Standard Path)
```javascript
const STANDARD_RECIPES = {
    tier1: {
        threads: 60
    },
    tier2: {
        threads: 240,  // 4 Uncommon Components × 60 threads each
        requires: ['tier1']
    },
    tier3: {
        threads: 100,
        empyreanMerits: 8,  // For Rare Component
        requires: ['tier2']
    },
    tier4: {
        threads: 300,  // For Very Rare Component
        empyreanMerits: 30,  // For Very Rare Component
        requires: ['tier3_core', 'tier3_radial']  // Need BOTH variants
    }
};
```

### Component Conversion Rates
```javascript
const CONVERSIONS = {
    threadsToEmpyrean: 0,  // Cannot convert threads to Empyrean
    empyreanToThreads: 20,  // 1 Empyrean = 20 Threads
    
    // Alpha-specific
    shardsToThreads: 5,  // 1 Shard = 5 Threads
    noticeOfWellToThreads: 40,
    favorOfWellToThreads: 100
};
```

---

## UI Layout

### Main Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────┐
│ INCARNATE POWERS                                      [Export]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ ALPHA   │  │JUDGEMENT│  │INTERFACE│  │  LORE   │            │
│  │  [+]    │  │   Ion   │  │Reactive │  │Warworks │            │
│  │         │  │  T4Core │  │ T3 Radial│  │  T2     │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                   │
│  ┌─────────┐  ┌─────────┐                                       │
│  │ DESTINY │  │ HYBRID  │                                       │
│  │ Barrier │  │  [+]    │                                       │
│  │ T4Radial│  │         │                                       │
│  └─────────┘  └─────────┘                                       │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ SHOPPING LIST                                   [Toggle Details]│
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Total Requirements:                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📊 Threads:          1,640      [I have: _____ ] Need: 1,640   │
│  ⭐ Empyrean Merits:     68      [I have: _____ ] Need: 68      │
│  💎 Alpha Shards:         0      [I have: _____ ] Need: 0       │
│                                                                   │
│  ▼ Judgement: Ion (Tier 4 Core)                                 │
│     ├─ Tier 4: Very Rare Component (30 Emp OR 300 Threads)      │
│     ├─ Tier 3 Core: Rare Component (8 Emp OR 100 Threads)       │
│     ├─ Tier 3 Radial: Rare Component (8 Emp OR 100 Threads)     │
│     ├─ Tier 2: 4× Uncommon Component (240 Threads)              │
│     └─ Tier 1: 60 Threads                                        │
│                                                                   │
│  ▼ Interface: Reactive (Tier 3 Radial)                          │
│     ├─ Tier 3: Rare Component (8 Emp OR 100 Threads)            │
│     ├─ Tier 2: 4× Uncommon Component (240 Threads)              │
│     └─ Tier 1: 60 Threads                                        │
│                                                                   │
│  [...more slots]                                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### Slot Cards
Each slot displays as a card showing:
- Slot icon (centered)
- Slot name
- Selected power name (if any)
- Tier indicator (T1-T4)
- Variant indicator (Core/Radial)
- [+] button if empty

**States:**
- **Empty**: Gray background, [+] button, "Click to select"
- **Selected**: Colored background based on slot type, power name + tier

**Click Behavior:**
- Empty: Open power selector modal
- Filled: Open power selector modal (can change selection)

---

### Power Selector Modal
```
┌─────────────────────────────────────────────────────────────────┐
│ Select Judgement Power                                    [✕]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Select Tree:                                                    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │Cryonic │ │  Ion   │ │Pyronic │ │ Void   │                  │
│  │ (Cold) │ │(Energy)│ │ (Fire) │ │ (Neg)  │                  │
│  └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                                   │
│  [Ion Selected]                                                  │
│  Ranged Cone, Extreme DMG (Energy), Recharge: Very Long         │
│                                                                   │
│  Select Tier & Variant:                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tier 1 (Common)                                     60T   │  │
│  │  ⚪ Core    ⚪ Radial                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tier 2 (Uncommon)                             Requires T1│  │
│  │  ⚪ Core    ⚪ Radial                                240T  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tier 3 (Rare) + Level Shift                 Requires T2 │  │
│  │  ⚪ Core    ⚪ Radial                      8E OR 100T ea. │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tier 4 (Very Rare)              Requires BOTH T3 variants│  │
│  │  🔘 Core    ⚪ Radial                   30E OR 300T      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│                                    [Cancel]  [Select: Ion T4 Core]│
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Tree selection at top (shows icons + damage type)
- Tier progression shows dependencies clearly
- Cost displayed for each tier
- Core/Radial toggle for each tier
- T4 requires BOTH T3 variants (visually indicated)

---

### Shopping List Panel

#### Aggregation Logic
1. User selects "Ion Judgement T4 Core"
2. System calculates ALL requirements:
   - T4 needs: Very Rare Component (30 Emp OR 300 Threads)
   - T4 needs: Ion T3 Core + Ion T3 Radial (both consumed)
   - Each T3 needs: Rare Component (8 Emp OR 100 Threads)
   - Each T3 needs: Ion T2 (consumed)
   - T2 needs: 4× Uncommon Component (240 Threads)
   - T2 needs: T1 (consumed)
   - T1 needs: 60 Threads

**Total for Ion T4 Core:**
- Threads: 60 + 240 + 240 + 100 + 100 + 300 = 1,040
- Empyrean: 8 + 8 + 30 = 46
- **OR** (mixing): Some combination

#### Display Modes
1. **Summary View** (Default)
   - Total threads needed across all slots
   - Total Empyrean Merits needed
   - Total Alpha Shards (if any)
   - Input fields for "What I Have"
   - Calculated "What I Still Need"

2. **Detailed View** (Expandable)
   - Breakdown by slot
   - Shows tier-by-tier requirements
   - Indicates which components are consumed (T1→T2→T3→T4)
   - Shows alternative crafting paths (Threads vs Empyrean)

#### Smart Recommendations
- "You can convert X Empyrean to Y Threads to save merits"
- "You need X more threads for optimal path"
- "Consider: Craft T3 with Threads, T4 with Empyrean (saves 200 threads)"

---

## Implementation Plan

### Phase 1: Data Structure
- [ ] Create `incarnate.js` with slot definitions
- [ ] Create `incarnate-recipes.js` with crafting requirements
- [ ] Add to Build object: `Build.incarnate = {alpha: null, judgement: null, ...}`

### Phase 2: Basic UI
- [ ] Create `incarnate-ui.js`
- [ ] Render 6 slot cards in grid layout
- [ ] Add "Select Power" button to each slot
- [ ] Style incarnate cards with slot-specific colors

### Phase 3: Power Selector
- [ ] Create modal for power selection
- [ ] Tree selection interface
- [ ] Tier/Variant selection with radio buttons
- [ ] Show power descriptions/effects
- [ ] Validate tier dependencies (can't select T4 without selecting T3s)

### Phase 4: Shopping List
- [ ] Create `incarnate-calculator.js`
- [ ] Implement tier aggregation logic
- [ ] Calculate total threads/merits needed
- [ ] Display summary view
- [ ] Add "What I Have" input fields

### Phase 5: Advanced Features
- [ ] Expandable detailed breakdown per slot
- [ ] Component conversion calculator
- [ ] Export shopping list to text/JSON
- [ ] Save incarnate selections with build
- [ ] Smart optimization suggestions

---

## CSS Styling

### Slot Colors (from game)
```css
:root {
    --incarnate-alpha: #FFD700;      /* Gold */
    --incarnate-judgement: #FF4500;  /* Orange-Red */
    --incarnate-interface: #00CED1;  /* Cyan */
    --incarnate-lore: #9370DB;       /* Purple */
    --incarnate-destiny: #32CD32;    /* Green */
    --incarnate-hybrid: #FF69B4;     /* Pink */
    
    --tier-common: #FFFFFF;
    --tier-uncommon: #00FF00;
    --tier-rare: #FFA500;
    --tier-very-rare: #FF00FF;
}
```

### Slot Card
```css
.incarnate-slot-card {
    width: 160px;
    height: 180px;
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.incarnate-slot-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
}

.incarnate-slot-card.filled {
    border-width: 3px;
}

.incarnate-slot-card.alpha { border-color: var(--incarnate-alpha); }
.incarnate-slot-card.judgement { border-color: var(--incarnate-judgement); }
/* ... etc */
```

---

## User Experience Flow

### Example: Selecting Ion Judgement T4 Core

1. **User clicks** empty Judgement slot card
2. **Modal opens** showing 4 trees (Cryonic, Ion, Pyronic, Void)
3. **User selects** Ion
4. **UI updates** to show tier selection
5. **User selects** T4 Core radio button
6. **UI shows warning**: "T4 requires crafting BOTH T3 variants"
7. **Automatically selects** T3 Core + T3 Radial as dependencies
8. **Shows in selector**: "Will craft: T1 → T2 → T3 Core → T3 Radial → T4 Core"
9. **User confirms** selection
10. **Shopping list updates** with all aggregated costs
11. **Card updates** to show "Ion T4 Core" with orange-red border

### Example: Tracking Progress

1. User crafts T1 Ion in-game
2. User enters "1" in "T1 Judgement Common crafted" field
3. Shopping list updates: "Need 1 less T1 (saves 60 threads)"
4. Progress bar shows: T1 ✓ → T2 (next) → T3 → T3 → T4
5. User can see exactly what's left to craft

---

## Technical Notes

### Save/Load
```javascript
// In Build object
Build.incarnate = {
    alpha: { tree: 'Musculature', tier: 4, variant: 'core' },
    judgement: { tree: 'Ion', tier: 4, variant: 'core' },
    interface: { tree: 'Reactive', tier: 3, variant: 'radial' },
    lore: { tree: 'Warworks', tier: 2, variant: 'core' },
    destiny: { tree: 'Barrier', tier: 4, variant: 'radial' },
    hybrid: null
};
```

### Cost Calculation Function
```javascript
function calculateIncarnateShoppingList(incarnateSelections) {
    let totalThreads = 0;
    let totalEmpyrean = 0;
    let totalShards = 0;
    let breakdown = [];
    
    for (const [slot, selection] of Object.entries(incarnateSelections)) {
        if (!selection) continue;
        
        const costs = calculateSlotCosts(slot, selection.tree, selection.tier, selection.variant);
        totalThreads += costs.threads;
        totalEmpyrean += costs.empyrean;
        totalShards += costs.shards;
        
        breakdown.push({
            slot,
            tree: selection.tree,
            tier: selection.tier,
            variant: selection.variant,
            costs
        });
    }
    
    return { totalThreads, totalEmpyrean, totalShards, breakdown };
}
```

---

## Future Enhancements

1. **Visual Crafting Tree** - D3.js tree diagram showing T1→T2→T3→T4 progression
2. **Merit Calculator** - "How many trials needed for X Empyrean?"
3. **Component Inventory** - Track actual components owned
4. **Optimal Path Finder** - Algorithm to minimize total cost
5. **Incarnate Stats Display** - Show actual stat bonuses on character
6. **Mobile-Responsive** - Collapsible panels for mobile

---

## Open Questions

1. Should we allow users to select multiple paths to T4? (e.g., craft both Core and Radial T4)
2. Should shopping list default to Thread costs, Empyrean costs, or mixed optimization?
3. Should we include Astral Merits in the calculator? (mainly for Alpha unlocking)
4. Should we track Incarnate XP for slot unlocking?

