---
name: Game Data Pipeline
description: Rules for editing game data, the generated/overrides/composed layers, and regen scripts.
globs:
  - "src/data/**"
  - "scripts/**"
  - "exported_powers/**"
  - "tools/bin-crawler/**"
---

# Game Data Pipeline

Game data flows through three committed layers, each derived from the previous one. **Never hand-edit a derived layer — fix the source.**

```
Live .pigg archives  ──Bin Crawler──►  exported_powers/  ──convert──►  generated/  ──+overrides──►  composed powersets/
```

1. `.pigg` → `exported_powers/<cat>/<set>/<power>.json` — via `tools/bin-crawler` (Python). This JSON **is committed**.
2. `exported_powers/` → `src/data/datasets/<server>/generated/*.ts` — via `scripts/convert-*.cjs`. **`generated/` is pristine and never hand-edited** — it is overwritten on every regen. Run `npm run regen`.
3. `generated/` + `overrides/` → composed `powersets/*.ts` — merged by `withOverrides()` in `src/data/_layer.ts`.

## Rules
- **Prefer fixing the root cause (parser/converter) over adding an override.** Overrides that pin a numeric value usually freeze a *stale* value over correct generated data. Reserve overrides for planner-only enrichments the parser doesn't extract.
- After any change to `exported_powers/`, a converter, or `scripts/`, run `npm run regen` and commit the regenerated `generated/` output. CI has a regen-diff guard that asserts byte-for-byte reproducibility — your generated output must match a fresh regen exactly.
- Two servers exist (`homecoming`, `rebirth`); changes to converters affect both. `regen-all.cjs` runs every converter for both datasets in dependency order.
- **Verify against the binary, don't assume.** When data looks wrong, check the actual `.pigg`/`exported_powers` source before patching. Read `GAME-DATA-PRINCIPLES.md` before touching the bin parser, converters, or calc.
- Don't create one-shot `fix-*`/`patch-*` scripts — they rot and break idempotency. Fix the pipeline instead.
