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

### FOLLOW-UP / TODO (the two fields the user actually wanted)
`ChainTarget` + `MaxTargetsExpr` live in the **HC/Parse7** layout. Could NOT verify them
here — the only local data is **Veracity/Parse6** (different layout §7: no field 38, and
`prevdistance`/`maintarget>` absent entirely). Deliberately NOT shipped to avoid guessing.

**To finish (needs HC `.pigg` data — on the PC/Laptop):**

1. Run the probe against HC:
   `py -3 tools/bin-crawler/probe_chain_fields.py --assets-dir "G:/Homecoming/assets/live"`
2. Read where the tokens land:
   - `prevdistance` / `maintarget>` → that slot is **ChainTarget** (probably `_field43_str`)
   - `GauntletTargetCap` (a Tanker Gauntlet attack) → that slot is **MaxTargetsExpr**
     (probably `_field38_str`)
3. Promote the confirmed candidates: `_field38_str` → `max_targets_expression`,
   `_field43_str` (or wherever `prevdistance` lands) → `chain_target_expression`.
4. Wire all three chain expressions into `export_powers.py` `power_to_dict` in ONE change
   (avoids a double re-export, §6), add a focused test, then re-export + commit `.json`.

Parser already stashes the two Parse7 candidates (`_field38_str`, `_field43_str`) for the
probe. Full write-up: `parser_logs/BIN-PARSER-LOG.md` (top, NEW ISSUES).

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
