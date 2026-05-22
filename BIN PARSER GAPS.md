### Use this space to document to-dos when we run into data gaps that require refining the bin parser

---

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

## ⏳ Pseudopet lifespans (PL_StaticObject / Vines patches)

**Symptom.** Four player Click powers still ship without `summon.duration` after the Silent_Kill fix above:

| Power | entity_def | Real duration |
|---|---|---|
| Gravity Distortion Field (Cont/Dom) | PL_StaticObject | ~30s |
| Paralyzing Blast (Cont/Dom) | PL_StaticObject | ~30s |
| Glue Arrow | P4234428342 (patch) | ~13s |
| Vines (Plant Control) | Vines pseudo-pet | ~10-15s |

**Why not solved by Silent_Kill fix.** These pseudopets aren't represented as pet entity files (`pets_*.json` / `mastermindpets_*.json`) — they're engine-side primitives whose lifespan is governed by their granted/redirect power's rules instead of a bundled Self_Destruct. So the entity-keyed lookup in `pet-lifespans.json` has no entry for them.

**Likely fix paths (not yet investigated).**
- The granted redirect power (e.g. `Redirects.Gravity_Control.Gravity_Distortion_Field`) probably has the lifespan as its `LifeTime` or `Duration`. Worth confirming with raw .powers defs.
- Alternatively, the parent power's `chain_delay` or `power_lifetime` (fields 41-44 and 62-65 in powers.bin — currently read but discarded) might carry the value. See [`_parse_power`](tools/bin-crawler/bin_crawler/parser/_powers.py) line 928-935 for the discarded lifetime fields.

**Impact.** Perma tracker eligibility check still skips these four powers. Not blocking — small set of affected powers, all of them have wiki-known durations that could be hand-curated as a stopgap if needed.
