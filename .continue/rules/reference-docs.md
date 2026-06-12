---
name: Reference Documentation
description: Pointers to in-repo design docs to read before non-trivial work. Always loaded.
alwaysApply: true
---

# Reference Documentation

Before non-trivial work, read the relevant in-repo doc — these explain *why* the code is shaped the way it is. Do not re-derive their conclusions; consult them.

- **`ARCHITECTURE.md`** — full system map: stack, project structure, the three-layer data pipeline (generated → overrides → composed), boot sequence, extraction scripts, and the companion tools (Pigg Wrangler, Bin Crawler, Sidekick Launcher). Read before any structural or data-flow change.
- **`GAME-DATA-PRINCIPLES.md`** — **mandatory before touching the bin parser, converters, or calc engine.** Covers the durable principles and specific gotchas: strength meta-templates, resistance-aspect traps, proc/pet exclusions, the verify-don't-assume discipline, and the re-export de-risk workflow.
- **`parser_logs/BIN-PARSER-LOG.md`** — running issue log for the binary parser.
- **`CLAUDE.md`** — development notes: data sourcing (live `.pigg` archives), the Bin Crawler export, binary layout notes, and player-relevant categories.
- **`parser_logs/REBIRTH_DATA_GAPS.md`** — known data gaps/bugs for the Rebirth server dataset.

When a task touches game-data correctness, prefer tracing the pipeline (composed → generated → `exported_powers/` → binary) over guessing. The binary/`exported_powers` data is authoritative.
