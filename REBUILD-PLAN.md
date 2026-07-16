# Rebuild Plan — Tauri + Dioxus, atom-native from line one

> A prospective ground-up rebuild of the planner surface. Status: **thinking/design**,
> nothing built. The premise: Sidekick's structural problems descend from building the
> planner before the data model was understood (the bag-of-slots calc, the baked-in
> column/row grid). The knowledge is now externalized — the parser, the validated atom
> dataset, the shadow gates, [GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md), and
> [COH-DATA-MODEL.md](COH-DATA-MODEL.md) — which is what makes a rebuild low-risk rather
> than a second-system disaster. **Read COH-DATA-MODEL.md first; this plan assumes it.**

## What carries over, and what gets rebuilt

The line is sharp and it is the most important decision in the whole plan:

| Carries over unchanged | Rebuilt in Rust |
|---|---|
| The Python parser (`tools/bin-crawler/`) | The calc (`coh_math` crate) |
| `exported_powers/` + the converters | The UI (Dioxus) |
| The generated **atom dataset** (`power.atoms`) | Build state / character model |
| The shadow-gate + docs discipline | — |

**The parser and converters are the crown jewel — do not touch them.** They are the
most-fought-over artifacts in the project (Parse6-vs-Parse7, the misalignments, the dropped
aspects, the Thunderspy vocabulary). Reimplementing binary parsing in Rust re-fights every
one of those battles for zero functional gain. The **atom list is the contract**: Python
produces it, Rust consumes it, and the boundary between them is the validated, gated
`AtomicEffect[]` on every power.

## 1. Stack — Tauri + Dioxus (and stop agonizing over the framework)

- **Tauri** for the desktop shell; **Dioxus** for the UI, compiling the *same* codebase to
  desktop (via Tauri's `wry` webview) and to web (WASM). Web-tech rendering keeps native
  scrollbars, fonts, copy-paste, accessibility, and CSS — the reasons not to use a
  canvas/GL toolkit (Iced/Slint) for a data-dense, text-heavy planner.
- **Dioxus over Leptos**, on ergonomics. Leptos's fine-grained reactivity is a real edge for
  apps with huge, frequently-mutating DOMs — but **CoH's recalc is whole-character** (one IO
  cascades through set bonuses, ED, caps, per-foe scaling), so fine-grained reactivity helps
  *rendering*, not the *math*, and the math finishes in microseconds regardless. Dioxus's
  React-shaped hooks (`use_signal`) are one mental model and the gentler path. **The
  framework choice is the least consequential decision here** — both work; the data model and
  the calc are what determine success.
- The UI motive is legitimate and specific: the current column/row grid is baked in (making
  cells rearrangeable was an ordeal). The rebuild's UI job is a **real, rearrangeable grid**
  as the main planner surface. That is worth a rebuild on its own.

## 2. Data architecture — atoms are OWNED, and the corpus is tiny

Two rules, both from COH-DATA-MODEL.md, both correcting the instinct to over-engineer:

**Atoms are owned per power — do NOT normalize them into a shared table.** Atoms are not
shared between powers: Temp Invuln's smashing-resist atom and Tough's are different rows
(different scale, table, duration, gated/PvE-PvP/per-foe stamps). There is nothing to
deduplicate, so an ECS / `Vec<AttribModId>` / shared `attrib_mods.json` design mints
thousands of near-identical entries plus a join for no benefit, and it fights the model. The
correct shape is the shape the data already has:

```rust
struct PowerDatabase { powers: Vec<Power> }   // indexed by PowerId — the only index needed
struct Power { id: PowerId, atoms: Vec<AtomicEffect>, /* meta… */ }
```

Each power owns its flat `Vec<AtomicEffect>`. That vector IS the "flat numerical array" you
loop; it does not need an ECS on top. ECS solves a game-engine problem (thousands of
entities sharing components, iterated at 60 fps) a build planner does not have — you
recompute one character on a click.

**Skip the performance engineering — the whole corpus is ~95,000 atoms across 10,321
powers.** That is a rounding error. Deserializing the entire dataset at startup is
single-digit milliseconds; the calc runs in microseconds no matter how naively written.
Concretely:

- **No zero-copy / Bincode / FlatBuffers.** They trade real borrow-checker complexity (the
  wall you're wary of) for an invisible win at this scale. `serde` into *owned* structs.
- **No DOM virtualization until you measure lag.** A CoH UI shows one archetype's ~18 powers
  plus a picker of a few hundred *when open* — not thousands at once. Add virtualization the
  day a list actually stutters, not before.
- **No build-time codegen into Rust literals.** Codegen-ing 95k struct literals makes
  `rustc` crawl. Prefer `include_str!` the JSON + parse once into a `OnceLock<PowerDatabase>`.
  "Zero runtime parsing" is a false economy: runtime parsing is already instant, and
  build-time codegen buys you slow builds in exchange.

## 3. Build pipeline — JSON is the *generated* contract, not a hand-edit surface

```
   .pigg binary ──Python parser──> exported_powers/ ──converters──> atom dataset (JSON)
                                                                          │  ← the contract
                                                        build.rs: include_str! + serde
                                                                          ▼
                                              Rust binary: OnceLock<PowerDatabase>
```

One correction to the "community edits JSON, submits PRs" story: **the atom JSON is
GENERATED, not hand-authored.** Hand-edits to it get flattened on the next regen — that is
the entire `overrides/` rot saga (GAME-DATA-PRINCIPLES §13: ~2,000 override lines that
*inverted* from corrections into stale-value-freezers once the source was fixed). So:

- The **editable surface is the parser and the scoped override layer**, not the baked atoms.
- `build.rs` bakes the *generated* dataset read-only. Editors fix the parser or add an
  override; regen produces truth; the app consumes it.
- Keep the per-powerset file split (`tanker_invulnerability.json`) — it avoids git merge
  conflicts and mirrors how `generated/` already shards. Just don't reference atoms by ID
  into a shared table (rule from §2).

## 4. The `AtomicEffect` struct (Rust) — faithful mirror of the TS core

The single most valuable thing Rust buys here: **the discriminator invariant becomes a
compile error instead of a discipline.** `EffectType` as an enum consumed through exhaustive
`match` means adding a new effect type or discriminator *fails to compile* at every consumer
that doesn't handle it — exactly the Plan-B Definition of Done ("forgetting to handle a
discriminator is impossible to do silently"), enforced mechanically.

```rust
// Mirrors src/data/core/atomic-effect.ts. One record per (template × affected attrib).
// Every field is a discriminator or a value; NOTHING here is a named bag slot.
pub struct AtomicEffect {
    // --- identity-bearing (what makes two atoms "the same effect") ---
    pub effect_type:  EffectType,
    pub sub_type:     Option<SubType>, // damage type / mez kind / defense position / move axis
    pub pv_mode:      PvMode,
    pub resistible:   bool,            // absence of IgnoreResistance ⇒ true (never agnostic)
    pub to_who:       ToWho,
    pub attrib_type:  AttribType,
    pub aspect:       Aspect,          // Cur | Max | Res | Str | Abs | Unspecified (NOT defaulted!)
    pub modifier_table: TableId,       // interned; the scale is meaningless without it
    pub scale:        f32,             // SIGNED — a debuff is negative

    // --- value / context (non-identity) ---
    pub magnitude:        f32,
    pub duration:         f32,
    pub ticks:            Option<u16>,
    pub application_period: Option<f32>,
    pub stacking:         Stacking,
    pub stack_cap:        Option<u16>,
    pub stack_key:        Option<StackKeyId>, // suppress GROUP (TravelBuff…); parser field, on-wire
    pub base_probability: f32,
    pub procs_per_minute: Option<f32>,

    // --- enhancement / calc flags ---
    pub ignore_strength:  bool,        // caster's Strength (enh + global buff) does NOT boost it
    pub ignore_ed:        bool,
    pub ignore_scaling:   bool,
    pub buffable:         bool,

    // --- gate / provenance ---
    pub special_case:        Option<SpecialCase>, // e.g. OutOfCombat
    pub requires_expression: Option<Box<str>>,    // raw CoH stack-machine gate string

    // --- CONVERTER-STAMPED VERDICTS (not re-derivable at runtime — see COH-DATA-MODEL §5) ---
    pub gated:        bool,          // NOT part of the unconditional base (mode/stance/PvP/…)
    pub per_target:   Option<f32>,   // per-foe increment of an AoE self-buff (Soul Drain)
    pub suppressible: bool,          // switches off in combat (Hide's +Def, travel buffs)
    pub not_on_caster: bool,         // Thunderspy pet/foe target-trap — skip in caster totals
}

// The discriminators as exhaustive enums — this is where the invariant lives.
pub enum EffectType {
    Damage, DamageBuff, Heal, HealResistance, Absorb, Defense, Resistance, Elusivity,
    ToHit, Accuracy, Mez, MezResist, Enhancement, Endurance, EnduranceDiscount, Recovery,
    Regeneration, MaxHp, MaxEndurance, RechargeTime, Range, ThreatLevel, Perception,
    Stealth, Movement, GrantPower, ExecutePower, RechargePower, GlobalChanceMod, EntCreate,
    Meta, Unmapped,
}
pub enum Aspect   { Cur, Max, Res, Str, Abs, Unspecified }   // Unspecified is a MEMBER, not a default
pub enum PvMode   { Any, PvE, PvP }
pub enum ToWho    { Unspecified, Target, Self_, All }
pub enum AttribType { Magnitude, Duration, Expression }
pub enum Stacking { No, Yes, Stack, Replace, Extend, Refresh, RefreshToCount, Overlap,
                    Maximize, Ignore, Suppress }
// SubType holds the "variant within a type": damage type, mez kind, defense position,
// movement axis (Run | Fly | FlyMode | Jump | JumpHeight | Control | Friction), etc.
// FlyMode (kFly grant) is DISTINCT from Fly (FlyingSpeed) — collapsing them double-counts
// Fly by +200% (COH-DATA-MODEL §3). Model it so the two can never be confused.

// Interned string ids keep AtomicEffect Copy-cheap and small (tables/keys repeat heavily).
pub struct TableId(u16);
pub struct StackKeyId(u16);
```

`serde` can deserialize either the current positional-tuple wire form (compact, bake-ready)
or a named form; the *in-memory* representation is this named struct regardless. The
converter's tuple field order (`ATOM_TUPLE_FIELDS`) is the authority if you keep the tuple.

## 5. The `coh_math` pipeline — a pure crate, and it's your migration oracle

A pure `coh_math` crate — zero knowledge of Dioxus/HTML — is the best idea in the plan and
the thing the current codebase conspicuously lacks. Build it first, keep it pure, because
**a headless calc crate is exactly what lets the current app grade the new one** (§6).

The correction to the "single flat loop" sketch: the calc is a **staged pipeline**, not a
sum. Pass *order* is load-bearing game fidelity (ED before caps; Strength split before the
IgnoreStrength halves; per-foe after base). That order is the hardest-won knowledge in
`character-totals.ts` — port it deliberately, don't reconstruct it.

```rust
pub struct CharacterState {
    pub archetype:  ArchetypeId,
    pub build_level: u8,
    pub active_powers: Vec<PowerId>,                 // toggles + autos considered active
    pub slotting:   HashMap<SlotId, EnhancementId>,  // what's in each slot
    pub incarnates: IncarnateLoadout,
    pub combat:     CombatContext,                   // nearby_foes, in_combat, enemy_level…
}

pub struct CalculatedTotals { /* defenses, resistances, regen, recovery, movement, … */ }

/// Runs on every click. Pure loops over owned atom vectors → microseconds.
pub fn recalculate(state: &CharacterState, db: &PowerDatabase) -> CalculatedTotals {
    // Pass 0 — GATHER. Active powers → their BASE atoms (baseAtoms: drop `gated`), plus the
    //          synthetic active-stance powers for the selected modes (Bio adaptations).
    //          ↳ character-totals.ts: collectAllPowers / expandActiveConditionals
    let atoms = gather_active_atoms(state, db);

    // Pass 1 — STRENGTH. Sum the caster's per-aspect Strength (enhancement values after ED,
    //          + global buffs). Must precede application: a buff scales by its aspect's
    //          Strength, and the ignore_strength half must NOT.
    //          ↳ collectStrengthBuffs (+ ED curve, ignore_ed)
    let strength = gather_strength(&atoms, state, db);

    // Pass 2 — APPLY PER POWER. The core. For each atom, route by DISCRIMINATOR (never slot
    //          name): effect_type × aspect × sign × to_who. Apply Strength unless
    //          ignore_strength; apply per_target × combat.nearby_foes; respect suppressible
    //          × combat.in_combat; skip not_on_caster. Accumulate into per-effect buckets.
    //          ↳ applyActivePowerBonuses (the ~1000-line loop) + adjustForStacking/adjustForPerTarget
    let mut totals = apply_atoms(&atoms, &strength, state, db);

    // Pass 3 — INHERENTS. Fitness (Health/Stamina), accolades.
    //          ↳ applyFitnessPowerBonuses / applyAccoladeBonuses
    apply_inherents(&mut totals, state, db);

    // Pass 4 — SET BONUSES. IO set bonuses (Rule of 5, paired stats).
    //          ↳ applySetBonusesToGlobal
    apply_set_bonuses(&mut totals, state, db);

    // Pass 5 — PROCS. Always-on globals, PPM, Build-Up-style, variable.
    //          ↳ collectAlwaysOnProcs / applyProcBonuses / applyPPMProcBonuses / …
    apply_procs(&mut totals, state, db);

    // Pass 6 — INCARNATES. Alpha (enhances, gated by boosts_allowed), Destiny (decay),
    //          Hybrid, Genesis.
    //          ↳ applyIncarnateBonuses / getAlphaEnhancementBonuses / scaleDestinyEffects
    apply_incarnates(&mut totals, state, db);

    // Pass 7 — MOVEMENT RESOLVE. Strongest-per-suppress-group (stack_key) + combat
    //          suppression; null-key entries stack additively.
    //          ↳ resolveMovementTotals
    resolve_movement(&mut totals, state);

    // Pass 8 — CAPS / PROJECTION. Apply archetype caps last, project to display stats.
    //          ↳ convertToCharacterStats
    finalize(totals, state, db)
}
```

Each pass is small and testable in isolation, and each maps to a named function in
`character-totals.ts` — so porting is "lift this pass, gate it against the old one, move on,"
not a rewrite from a blank page.

## 6. Migration strategy — the current app is a free oracle

Do not big-bang. Use the project's own discipline (GAME-DATA-PRINCIPLES §5, §14): **the TS
calc's per-power totals are ground truth; the Rust `coh_math` gets graded against them
corpus-wide, power-by-power** — the same shadow-gate pattern that graded atoms against the
bag, now cross-implementation.

1. Stand up `coh_math` + the `AtomicEffect` deserialize. No UI yet.
2. Port one pass (start with Pass 2's simplest effect types — resistance, defense — which are
   already atom-native and gated in the current app).
3. **Gate it:** a harness loads every power, computes the total both ways (TS via a dumped
   fixture set, Rust live), asserts equality across all three datasets and BOTH directions.
   Mutation-test the harness so you know it can go red.
4. Divergence = a finding, investigated against Mids/in-game, not auto-accepted (a known bag
   bug *should* diverge — that's the fix landing).
5. Repeat pass by pass. The UI can start in parallel against the passes already green.

This converts "scary Rust rewrite" into a gated migration where correctness is provable at
every step, and it reuses the exact machinery and instincts already built.

## 7. Explicitly do NOT do

- ❌ Reimplement the binary parser in Rust (re-fights every won battle; keep Python).
- ❌ Normalize atoms into a shared `attrib_mods` table / ECS (atoms are owned; §2).
- ❌ Zero-copy, Bincode, FlatBuffers, or DOM virtualization up front (corpus is tiny; §2).
- ❌ Build-time codegen of atoms into Rust literals (slow compiles; `include_str!` + parse).
- ❌ Invite hand-edits to the baked atom JSON (override rot; edit the parser/overrides; §3).
- ❌ Agonize over Dioxus vs Leptos (framework is the least consequential choice; §1).
- ❌ A single flat calc loop (it's an ordered pipeline; pass order is fidelity; §5).

## 8. Risks

- **Rust's ownership model is a real wall for a non-programmer.** Dioxus's React shape softens
  the UI; the borrow checker doesn't care that the JSX looks familiar. How much you write
  yourself vs. drive through an agent changes the calculus — favor owned data + interned ids
  (§4) to keep lifetimes out of the hot path.
- **The calc surface is irreducibly large.** The atom model makes it *cleaner*, not
  *smaller* — AT tables, ED, set bonuses, incarnates, procs, stacking, suppression all still
  exist. The pass pipeline (§5) is the map; the oracle migration (§6) is the safety net.
- **Data-quality issues follow the dataset**, not the UI: the Thunderspy movement blackout,
  the epic-tier Fiery Embrace contamination, `internalName` collisions. Fix them in the
  Python pipeline; they are orthogonal to the rebuild.
- **Long-lived rewrite branches stall.** Antidote: §6's pass-by-pass, always-green migration —
  never a cutover.

---

*Companion to [COH-DATA-MODEL.md](COH-DATA-MODEL.md) (the model this builds on) and
[GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md) (the traps that still apply on the
Python side). This is a design sketch, not a commitment — refine freely.*
