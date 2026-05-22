### Use this space to document to-dos when we run into data gaps that require refining the bin parser. When complete, please mark completed. Please put new issues at the top, move old issues below

---NEW ISSUES---



---OLD ISSUES---

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
