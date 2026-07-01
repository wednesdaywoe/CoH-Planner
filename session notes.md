# Session Notes

## 2026-07-01 — Bin Crawler parser: chain / max-targets expression fields

**Context:** User feedback said the export is missing two RPN expressions CoD surfaces:
`ChainTarget` (chain next-target selection) and `MaxTargetsExpr` (target cap). Both are
token lists like the requires/duration/magnitude expressions already exported.

### What got done (shipped, code only — NOT yet re-exported)

- Found the parser's chain region (`tools/bin-crawler/.../parser/_powers.py`, fields
  38/42/43) was reading several string-arrays and **discarding them under wrong labels**.
- **Field 42 = `ChainEff`** (per-jump continue-chance, e.g.
  `minmax(1.25 - 0.25 * @ChainJump, 0.5, 1)`) — **verified** against the local Veracity
  `.pigg` (`@ChainJump` resolves there). Now captured as `chain_eff_expression` (both
  Parse7 + Parse6) and exported **only for chain powers** (sparse, like `redirect`).
- Fixed two bogus labels: field 43's `chain_fork` (impossible — ChainFork is an int
  array) and field 38's invented `chain_effect_array`.
- Files touched: `parser/_powers.py`, `parser/_dataclasses.py`, `export_powers.py`,
  `parser_logs/BIN-PARSER-LOG.md` (finding logged), + new `probe_chain_fields.py`.
- Nothing committed (working-tree changes only).

### FOLLOW-UP — RESOLVED 2026-07-01 (code done + verified; committed re-export pending)

The blocker was wrong: the HC `.pigg` data is on **this Linux box**
(`/home/jiiwii/.wine/drive_c/Games/Homecoming/assets/live`, `bin_powers.pigg` 2026-06-18),
not "the PC/Laptop." Ran the probe here and finished the mapping:

- **MaxTargetsExpr = field 38** → `max_targets_expression` (verified: `GauntletTargetCap`,
  59 powers).
- **ChainTarget = field 43b** (NOT field 43!) → `chain_target_expression`. 43b was being
  read as a discarded `u4_array`; string_array vs u4_array are byte-identical in Parse7, so
  it read fine but threw away the strings. Circuits match the `.powers` oracle exactly
  (`Rejuvenating` HP / `Energizing` End / `Empowering` proximity), 55 powers.
- **ChainEff = field 42** → already shipped.

Code changes made (working tree, **uncommitted**): `parser/_dataclasses.py`,
`parser/_powers.py`, `export_powers.py`, `probe_chain_fields.py` (now a regression check),
`parser_logs/BIN-PARSER-LOG.md` (moved to RESOLVED with the full write-up). Scratch export
(§6 de-risk) is clean — circuit JSONs carry all three fields, ordinary attacks carry none.

**DONE (2026-07-01, follow-up session):** promoted + wired end-to-end.
- Focused promotion into committed `exported_powers/`: 122 JSONs, purely additive
  (+178/-0); the 6 files with incidental `duration/magnitude_expression` drift were
  reverted and re-injected with just the 3 keys.
- Planner wiring: `convert-powerset.cjs` carries both fields → regenerated the 51 affected
  player powersets (**83 `generated/` .ts, +99/-0**, zero drift). `src/types/power.ts` gains
  `chainTargetExpression`/`maxTargetsExpression`; Info panel shows humanized **Chain Target**
  / **Target Cap** rows (raw RPN on hover) via `src/utils/chain-expressions.ts`.
- Focused test `src/data/chain-target-expressions.test.ts` (7). `tsc` clean; full suite 655/655.

Everything is **uncommitted** working-tree — ready for review/commit. Not exercised: a live
app render of the new Info rows (low risk — same KvRow pattern, data + humanizer both tested).
Not covered: pets/redirects/inherent internals (other converters), if ever needed.

### Launcher can't open Bin Crawler — ROOT CAUSE FOUND + FIXED (launcher UX)

Symptom: Bin Crawler shows a **green light + "Open"** without being launched this session;
clicking Open does nothing (no terminal). Pigg Wrangler starts correctly (grey + Launch).

**Real cause (not the browser):** the launcher decided "running" from a bare TCP
`port_open(8090)` — so ANY process holding 8090 (a stale/wedged Bin Crawler that survives
closing the launcher, or a foreign app) made it show green + "Open", and it never spawned
the tool. The earlier HTTP/2-505 theory was a red herring — the socket-pool flush didn't
help because the browser was never the problem. (505 IS reproducible if a client leads with
an HTTP/2 preface, but that wasn't what was happening here.)

**Fix (implemented in `tools/sidekick-launcher/`):**

- `launcher.py`: replaced bare `port_open` with a real **HTTP health check** (`_http_ok`,
  HTTP/1.1 GET). New 3-state `tool_state()`: `stopped` / `running` (our tool answers HTTP) /
  `busy` (port held but not answering as our tool). Added `/api/kill` → `kill_port()`
  (cross-platform: Windows `netstat`+`taskkill /F /T`, POSIX `lsof`+SIGKILL) with
  `_pids_on_port` / `_proc_name`.
- `static/index.html`: amber "busy" dot + warning, **Stop** button (running) and **Kill**
  button (busy), `confirm()` before killing, state-based auto-open.
- Verified end-to-end on macOS: stopped / running / busy states + kill all correct.

So the user's fix now: relaunch the updated launcher → Bin Crawler will show an amber
"busy" state with a **Kill** button (stale process on 8090) → click **Kill**, then
**Launch**. No more PID hunting.

**Still open / optional:** if a browser genuinely does lead with HTTP/2 to the tool (the
separate 505 path), the durable server-side mitigations are a fresh port or an
`Alt-Svc: clear` header on Bin Crawler's responses — not implemented. (Boostset-export gap
was the failed build; user said that's fixed.)
