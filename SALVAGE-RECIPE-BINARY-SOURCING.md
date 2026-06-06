# Salvage + recipe → binary-sourced (campaign leg #5)

_Started 2026-06-06. Pivoted ahead of the non-IO enhancement leg (which is a
formula reconstruction for stable constants — deferred to last). Salvage/recipe
has real value: incarnate salvage drifts, and invention salvage + recipes power
the planned **auction-house build-cost** feature (live CoH→Sidekick pipeline)._

This is **leg #5** of the data binary-sourcing campaign. See
[data-binary-sourcing-campaign] memory + GAME-DATA-PRINCIPLES.md.

---

## Source: `salvage.bin` (HC-only; Rebirth's pigg has none)

Parse7 struct array, 360 records. Per-record schema (verified — `_salvage.py`):

| Offset | Field | Notes |
|---|---|---|
| `@0` | name (str-ref) | internal, `S_ArcaneCantrip` |
| `@4` | display (str-ref) | P-hash → resolve via `clientmessages-en.bin` → "Arcane Cantrip" |
| `@8`/`@12` | desc / desc-category (str-ref) | "Invention Salvage", "Incarnate Ability Component", … |
| `@16` | icon (str-ref) | `salvage_ArcaneCantrip.tga` |
| `@20` | type-label (str-ref) | P-hash → "Legacy"/"Invention"/"Special"/"Incarnate" |
| `@28` | **rarity** (u4) | 1=common 2=uncommon 3=rare 4=very-rare |
| `@32` | **category** (u4) | 0=legacy 1=invention 2=special 3=incarnate |

**Category labels are AUTHORITATIVE** (resolved from `@20`, not guessed — an early
guess of 0=invention was wrong). Counts: legacy 179, invention **108** (36/36/36),
special 39, incarnate **34**. Rarity verified: incarnate matches the hand-port
(21/22, see below); invention matches known items (Boresight=common,
AlchemicalGold=uncommon, DeificWeapon=rare).

Pipeline: `parser/_salvage.py` → `export_salvage.py` → `exported_powers/salvage.json`
→ `convert-salvage.cjs` → `generated/invention-salvage.generated.ts`.

---

## ✅ Phase A.1 — Invention salvage DONE (2026-06-06)

Net-new: the planner had **no** invention salvage registry. Generated
`INVENTION_SALVAGE_REGISTRY` (108 items: id, displayName, rarity) from binary
category "Invention". Foundation for the auction-house feature (price lookup keys
on these identities). Exported via `src/data/index.ts`, wired into `regen-all.cjs`,
guarded by `src/data/invention-salvage.test.ts` (count == export, valid rarities,
known-item spot-checks). tsc clean.

> No cost in the registry — auction-house prices come from the live pipeline, not
> salvage.bin. Rarity is for display/categorization.

---

## ⬜ Phase A.2 — Incarnate salvage (decisions pending)

`incarnate-salvage.ts` (hand, 22 items) is **21/22 correct** vs the binary.
Open decisions before binary-sourcing it:

1. **`InfiniteTessellation`** — hand=`very-rare` (30 empyrean), binary=`uncommon`.
   Suspicious (generic icon `salvage_MagicalArtifact.tga`; contradicts the
   well-known very-rare classification). **Verify-don't-assume** — needs an
   authoritative check (in-game Combat/store, wiki, patch notes) before changing,
   like the Phase-3 damageCap reconciliation. Not auto-changed.
2. **34 binary vs 22 hand** — the binary "Incarnate" category includes 12 legacy
   crafting components (`IncarnateShard`, `IncarnateThread`, `Hero1DNASample`,
   `GraiMatter`, `NoticeOfTheWell`, `EssenceoftheIncarnate`, …) beyond the 22
   current thread/empyrean salvage. Include all (binary-complete, but changes the
   `SalvageId` type + may clutter the incarnate UI) or keep the curated current
   set + binary-verify rarity? Cost is rarity-derived (not in salvage.bin), so
   legacy items would get meaningless derived costs.

---

## ⬜ Phase B — Invention recipes (auction-house build costs)

`invrecipe.bin` — **32,345 records** (the full IO recipe DB across levels: each
recipe's salvage components + influence craft cost). The high-value auction-house
data, but the biggest/least-understood format (naive header parse mis-read it;
needs proper RE). Separate, larger effort. (`baserecipes.bin`, `invconcept.bin`
also present.)

## Files

- Parser: `tools/bin-crawler/bin_crawler/parser/_salvage.py` (+ `SalvageRecord`)
- Exporter: `tools/bin-crawler/bin_crawler/export_salvage.py`
- Converter: `scripts/convert-salvage.cjs`
- Generated: `src/data/generated/invention-salvage.generated.ts`
- Committed export: `exported_powers/salvage.json`
- Hand-curated (Phase A.2 pending): `src/data/incarnate-salvage.ts`
