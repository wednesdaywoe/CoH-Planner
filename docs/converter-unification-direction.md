---
name: converter-unification-direction
description: "Post-DSH goal is unifying the three parallel converters on the shared AtomicEffect core; user confirmed the separation was historical accident, not design"
metadata: 
  node_type: memory
  type: project
  originSessionId: 287aaed1-5590-477c-bdd9-3a164ee11e3c
---

The three converters (powerset / incarnate / IO-set) each independently reinvented the bag-of-slots model because the user (a non-programmer who learned CoH internals incrementally) originally modeled data around player-visible game categories before discovering that under the hood they're all the same AttribMod structure. As of 2026-07-06 the user explicitly confirmed this separation exists "for no reason at all" and is working toward fixing it.

**Why:** A 2026-07 architecture review comparing against MidsReborn confirmed: Mids models everything (powers, incarnates, set bonuses) as flat atomic effect arrays through one pipeline; Sidekick's DSH migration (AtomicEffect as working model, PowerEffects projected late) converges on that same proven design.

**How to apply:** When touching converters or incarnate/IO-set effect handling, prefer moves that route through the shared AtomicEffect core (`src/data/core/atomic-effect.ts`) over per-converter fixes. The goal is one shared template→AtomicEffect routing module consumed by all three converters — not necessarily one literal script. Also flagged as trimmable: ~90%-empty overrides stub trees, the 11 incarnate-specific effect interfaces, and the stats/effects fallback duplication — candidates for deletion once the atomic model lands.
