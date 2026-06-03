### Use this space to document to-dos when we run into data gaps that require refining the bin parser. When complete, please mark completed. Please put new issues at the top, move old issues below

---NEW ISSUES---

_(none)_

---OLD ISSUES---

## ✅ Rebirth Inexhaustibility — no-rarity `boostsets.bin` record variant (FIXED 2026-06-02)

**Symptom.** Inexhaustibility (Secret Master 5th Column TF/SF reward, single-piece special that slots only into the Rest inherent) shipped with empty `pieces: []` and `bonuses: []`, so it couldn't be slotted. The other three Rebirth Challenge Enhancements (Liberty's Belt, Imperial Might, Forced Indoctrination) all use the standard layout and extract cleanly.

**Root cause (decoded from the binary).** Record #152 (rec_len=316) is a **no-rarity variant**: it omits both the rarity AND category strings, so the `power_count` u4 sits directly in the rarity slot. The parser read those bytes as a bogus empty pascal string, desynced, then read the first power string as `power_count` (garbage > rec_len) and the `> rec_len` guard bailed → empty record. Decoded contents:
- allowed power: `Inherent.Inherent.Rest`
- piece: `Boosts.Attuned_Inexhaustibility_A.Attuned_Inexhaustibility_A` — a `Set_Mode`/aspect=Strength special with no enhancement stat
- bonus: min 1 / max 6 → auto-power `Set_Bonus.Challenge_Set_Bonus.Inexhaustibility`, gated by an embedded `PowerBoostsSlotted 1 >=` requires expression
- effect (`powers.bin`): a Rest-only proc — 3 effect groups @ 50% chance: Heal (2.0×Melee_Heal), +Endurance (Current 0.10), +Regeneration (Current 2.0 / 10.25s). Proc-like and tied to Rest; does **not** fit the planner's flat `bonuses[].effects[]` (stat+value) model.

**Fix (two parts).**
1. **Parser fidelity** — [_boostsets.py](tools/bin-crawler/bin_crawler/parser/_boostsets.py): added `_rarity_is_present()` (rarity tags are always alphabetic; the no-rarity variant has a u4 whose content byte is `0x00`). When absent, skip the rarity+category strings and read `power_count` from that slot. Generalizes to any future no-rarity record. Verified safe: of 233 Rebirth sets, exactly 1 (Inexhaustibility) is no-rarity; all 232 normal records parse identically (Jaunt still 28 powers / 3 boostlists / 2 bonuses). Inexhaustibility now extracts its allowed power + piece + bonus min/max. (The non-standard bonus-block tail still leaves `auto_powers` empty — acceptable, since the effect is proc-like and isn't modeled as a set bonus.)
2. **Data** — [io-sets-raw.ts](src/data/datasets/rebirth/io-sets-raw.ts): hand-added the single proc-special piece (`aspects: []`, `proc: true`, `unique: true`) so Inexhaustibility is **slottable into Rest**. Left `bonuses: []` — the Rest-buff is a power-effect proc, not a flat set bonus, so fabricating a stat+value bonus would mislead the SetBonusDisplay (which renders `{stat}: +{value}%`). Zero drift to other sets.

**Not done:** surfacing the Rest-proc effect numerically. The planner doesn't model "while resting" procs; the set is now functional (slottable) and labeled `Rest Buff`.

## ✅ Non-kExpression template `delay` field offset (FIXED 2026-05-21)

**Symptom.** Pet/pseudopet summon powers shipped with no `summon.duration` because the bin parser was reading `delay = 0` for every Silent_Kill template (the AttribMod that despawns the pet after a set time). Affected 11 player Click powers with EntCreate templates whose own Duration is 0 (Haunt, Hell on Earth, Dark Extraction, etc.). Without `summon.duration`, the perma tracker eligibility check skipped these powers, and Power Info couldn't show the pet's stay-alive time.

**Root cause.** `_parse_effect_template` in [tools/bin-crawler/bin_crawler/parser/_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py) had two parallel layouts for the post-magnitude field block:

- `kExpression` (typ_raw==3): `dur_expr_tokens (u4_array), mag_expr_tokens (u4_array), delay (f4)` — correct
- everything else: `delay (f4), dur_expr (string), mag_expr (string)` — **wrong**

Both branches actually use the kExpression layout in the binary. The non-kExpression branch happened to look right for templates with no Delay AND no expressions — the dur_expr/mag_expr token-array counts were 0, the parser read those 4 bytes as delay (got 0.0), then read the next two 4-byte slots as string offsets (got empty strings). The moment a template had a real Delay value (227 Silent_Kill templates across HC), the parser interpreted the dur_expr count (0) as the delay and the actual delay bytes as a stray string offset, silently dropping the value.

This is the same kind of bug the kExpression branch had originally; that one was fixed by reordering tokens-before-delay.

**Fix.** Merged both branches into one path that always reads tokens-then-delay. Verified against 227 Silent_Kill templates — all now match wiki-known pet lifespans (Pets_Shade 60s, Pets_Living_Hellfire 90s, Pets_Mastermind_Ghosts 300s, Pets_Warshade_Extraction 200s, etc.).

**Downstream wiring.**
- [scripts/convert-pet-entities.cjs](scripts/convert-pet-entities.cjs) extracts the Silent_Kill delay per pet entity by scanning its bundled `Self_Destruct` power (signature: target=Self, stack=Stack, table=Melee_Ones, no EntCreate params — needed because the binary's enum index 117 collision labels Silent_Kill as `Create_Entity`). Surfaces it on `PetEntity` as `lifespan?: number` and writes a CommonJS-friendly sidecar at `src/data/datasets/<id>/pet-lifespans.json` (33 HC entries).
- [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) loads the sidecar and falls back to `PET_LIFESPANS[entity_def]` when the summoning power's EntCreate AttribMod has `Duration=0`.

**Broader impact.** This bug affected every non-kExpression template that had a non-zero Delay. 227 templates fixed across HC. Worth a broader re-conversion sweep — anything that consumed `delay` (proc PPM activation gating, delayed-debuff effects, etc.) may have been silently reading 0 where it should have read a real value.

**Parse6 (Rebirth) is unaffected** — its template layout is `table, scale, app, type, delay, ...` (delay read directly after type, no expressions in between). Different parser path, never had this bug.

---

## ✅ Pseudopet lifespans (PL_StaticObject / Vines patches) (FIXED 2026-05-21)

**Symptom.** After the Silent_Kill fix above, four player Click powers still shipped without `summon.duration`:

| Power | entity_def | Lifespan |
|---|---|---|
| Gravity Distortion Field (Cont/Dom) | PL_StaticObject | 60s |
| Paralyzing Blast (Cont/Dom) | PL_StaticObject | 60s |
| Vines (Plant Control) | Vines pseudo-pet | 60s |
| Glue Arrow | P4234428342 (P-hash patch) | 30s |

**Why not solved by Silent_Kill fix.** These pseudopets aren't represented as pet entity files (`pets_*.json` / `mastermindpets_*.json`) — they're engine-side primitives that don't have their own bundled power list keyed on the entity record. So the entity-keyed lookup in `pet-lifespans.json` had no entry to consult.

**Root mechanism (turns out it's the same Silent_Kill data, just routed differently).** Each pseudopet's summoning AttribMod populates `params.redirects` with the redirect powers the pseudopet runs — and one of those redirects is a `*.Self_Destruct` power carrying the Silent_Kill delay. Examples:
- Gravity Distortion Field → `Redirects.Gravity_Control.Self_Destruct` (delay 60)
- Paralyzing Blast → `Redirects.Electric_Control.Self_Destruct` (delay 60)
- Vines → `Villain_Pets.Vines.Self_Destruct` (delay 60)
- Glue Arrow → no Self_Destruct in redirects, but `priority_list: "Pets_StickyArrow_Blaster"` names a real pet entity that's in the existing entity-keyed sidecar (delay 30)

**Fix.**
- [scripts/convert-pet-entities.cjs](scripts/convert-pet-entities.cjs) now also produces `src/data/datasets/<id>/self-destruct-delays.json` — a map of fully-qualified Self_Destruct power names to their Silent_Kill delay. Built by a recursive walk over the bin export for every `self_destruct.json`. 43 HC entries.
- [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) wraps the lookup in a three-stage `resolvePetLifespan` cascade: (1) entity_def in pet-lifespans, (2) any `*.Self_Destruct` in params.redirects → self-destruct-delays, (3) priority_list in pet-lifespans. First hit wins; returns 0 if nothing matches (matches pre-fix behavior).

**Verified live.** All four powers now ship with `summon.duration` set, and the perma-tracker eligibility check includes them.
