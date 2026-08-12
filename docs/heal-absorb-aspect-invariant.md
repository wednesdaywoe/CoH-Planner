---
name: heal-absorb-aspect-invariant
description: Healing/Accurate-Healing enhancement pieces must pair Absorb with Heal as a separate diluting aspect
metadata: 
  node_type: memory
  type: project
  originSessionId: 334bbbd0-3ce1-49ec-8849-70b619b3e806
---

In CoH Homecoming/Rebirth, every enhancement that boosts Heal also boosts **Absorb**, and the planner treats Heal and Absorb as **separate, value-diluting aspects** (counterintuitive but confirmed by the user 2026-06-05). So a piece named `Heal` is really `Heal/Absorb` (2 aspects), `Endurance/Heal/Recharge` → `Endurance/Heal/Absorb/Recharge`, etc. Adding Absorb lowers the per-aspect Heal value via `getEffectiveAspectCount`/`getMultiAspectModifier` in [src/utils/calculations/enhancement-values.ts](src/utils/calculations/enhancement-values.ts) — that drop is correct, matching the game.

Fixed 2026-06-05: inserted `Absorb` right after `Heal` (in both the `name` and `aspects`) on all non-proc Heal pieces of the 7 Healing sets (Panacea, Doctored Wounds, Harmonized Healing, Miracle, Numina's Convalescence, Preventive Medicine, Regenerative Tissue) + 2 Accurate Healing sets (Touch of the Nictus, Theft of Essence), across both `src/data/datasets/homecoming/io-sets-raw.ts` and `.../rebirth/io-sets-raw.ts`. Also added Absorb to the Golgi Exposure HamiO in [src/data/enhancements.ts](src/data/enhancements.ts). Triage and the Amyloplast/Chloroplast HamiOs already had it.

**Regen gap (unresolved):** the generators (`scripts/extract-rebirth-io-sets-v2.py`, `scripts/convert-io-sets.js`) have no `Absorb` in their attrib→aspect maps and would silently drop these on a re-run. The python `ATTRIB_TO_ASPECT` maps `HitPoints: 'Healing'` only. A proper generator fix needs the binary verified on the PC/laptop (is there a distinct Absorb attrib on the boost templates, or must `HitPoints` emit both Heal+Absorb?) and must force `Heal/Absorb` adjacency (canonical sort would otherwise alphabetize to `Absorb/Heal`). Until then, re-apply by hand or via the `/tmp/add-absorb.cjs`-style scoped transform. See [[heal-absorb-invariant]].
