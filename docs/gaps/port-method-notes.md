---
project: coh-sidekick-beta
kind: gap
title: Port method notes
relates:
  - ../ISSUE-REGISTER.md
---

# Port method notes

Beta-side method for the engine port. Named `port-method-notes.md` rather than `method-notes.md`
because canonical holds a different document under that name — its data-gap METHOD-1..6 catalogue,
which `DATA-GAP-REGISTER.md` links to by relative path. Two disjoint documents sharing one path
meant every register link resolved to whichever repo the reader happened to be in.

## Ruling out "it's a regression" before filing anything

`powerProjectionParity.test.ts` fails loudly and often carries real diagnostic value in its
console output, but a red test on a branch proves nothing about WHERE the defect was introduced.
Before root-causing, check whether the same test already failed on `main` before the branch's
own changes: `gh run list --branch main --workflow CI --limit 5` to find the last run, then
`gh run view <id> --log-failed` and diff the failure text against the branch's run. Both PARITY-1
and PARITY-2 turned out byte-identical to `main`'s prior run — same power, same numbers, same
assertion line — which is what justified filing them as pre-existing gaps instead of bisecting
the branch's own commits.

## Telling a beta-side gap from an engine regression

This test's whole design is "engine vs beta calculators" — when it goes red, the first question
is which side is wrong, and the test's own diagnostic labels (`console.warn`/`console.error`
blocks tagged `[PROD6C ...]`) usually name the exact power and the exact deltas, which is enough
to go read the generated power data directly (`src/data/datasets/<fork>/generated/.../<power>.ts`)
rather than guess. From there: if canonical's Rust source (`coh-sidekick-1.0/crates/coh_math`)
already has a named, closed gate for the mechanism (`form_variant_gate.rs`, `snipe_form_gate.rs`,
etc. — `grep -rl` the gate name across `crates/*/tests`), the engine is very likely right and the
defect is in beta's own JS mirror of it. Both entries here followed that path: canonical had
already closed the underlying gap (form variants 2026-08-07, SNIPE-2 earlier), the converter
already exports the data beta needs, and only the JS-side consumer never got written.

## The cross-repo cwd trap

Investigating a beta-side gap by cross-referencing canonical's Rust source means `cd`-ing between
`/Users/brian/github/CoH-Sidekick` and `/Users/brian/github/coh-sidekick-1.0` mid-session. Forgetting
to `cd` back produces silent false results, not errors — a `grep -rln <name> src` after an
un-returned `cd` into canonical will happily search canonical's OWN parallel `src/` tree (yes,
canonical still carries one, mid-Dioxus-migration) and report real-looking hits or misses that
have nothing to do with beta. This nearly produced a false "resolveEffectivePower has zero
production importers" conclusion here — the truth (several real importers) only surfaced after
rerunning the same grep with an explicit `cd` back to beta first. Prefer absolute paths for
anything that has to be right the first time; if using relative paths after a repo switch, `pwd`
before trusting the result.

## Port the formula, not a guess at the formula

Fixing PARITY-2 needed the caster's "current ToHit" as a real number, and the naive derivation
(archetype base + global ToHit bonus, clamped 5–95% the way the display layer clamps hit chance)
would have been quietly wrong — the actual gate reads the UNCLAMPED value. The right number only
surfaced by finding the ONE place canonical computes it for this exact purpose
(`crates/coh_math/src/projection.rs`'s `gate_context`: `caps.to_hit_base + g.to_hit / 100.0`, no
clamp) rather than reasoning from the display formula in `calc-debug.ts`, which answers a
different question. Same pattern for the `k`-prefix mode duality (`gather.rs`'s
`collect_source_modes`) and the exact operator semantics of `==` vs `eq` (`expr.rs`'s
`apply_operator`/`comparison` — `==` is numeric-only, `eq` is the case-insensitive one, easy to
get backwards by name alone). When porting a JS mirror of engine behavior, grep canonical for the
literal mechanism name first; its own doc comments usually state the formula outright.
