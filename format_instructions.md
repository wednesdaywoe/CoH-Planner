---
standard: progress-doc
doc: authoring-guide
version: 0.1
canonical-source: <fill in once a home repo exists>   # this file is copied per-repo; edit the canonical copy, not this one
---

# How to write a progress doc

**You are Claude Code. This file tells you how to write a progress or stream doc
that the project tracker can parse.** It is the same in every repo. Follow it
when asked to create or update a progress doc (e.g. "write a progress doc for
this feature using the format in format_instructions.md").

It teaches *format only*. It says nothing about how to prioritize work or make
technical decisions in this repo — that lives in this project's CC instructions,
not here. Keep the two separate (see §11).

---

## 1. The one idea

You are writing a **source of truth**, not a report. A separate read-only tool
reads these docs from committed git state and derives views from them — a
cross-project rollup, a blocker index, a "what changed" digest. You write
**facts**; the tool computes **views**. This split is the whole point, so:

- **Write each fact once.** Don't restate a task's status in three places. If it
  needs to be referenced elsewhere, reference it (§7), don't copy it.
- **Never hand-write a rollup.** A consolidated cross-doc summary
  (`kind: rollup`) is *generated* by the tool and overwritten on every run. If
  you write one by hand, your work is destroyed on the next regeneration. Write
  the source docs; let the rollup be derived.
- **Only committed docs are seen.** The tool reads git, not your working tree. An
  uncommitted doc does not exist as far as the tracker is concerned. Commit
  progress-doc updates (ideally as their own small commits — it improves the
  history the tool reads).

---

## 2. Frontmatter

Every doc starts with YAML frontmatter. Required for all kinds:

```yaml
---
project: cophony          # which product this doc belongs to
kind: plan                # the doc's role — see §3
title: MIDI Recording Plan
---
```

Optional, add when relevant:

```yaml
id-prefix: REC            # if this doc's items will be referenced, their ID prefix (§6)
status-ext: []            # extra status states this doc declares (§5.1)
relates:                  # sibling docs this one points at
  - MIDI_PLAN.md
```

You write `kind: plan`, `roadmap`, `issue`, or `checklist`. **You never write
`kind: rollup`** — that one is the tool's output, not your input.

---

## 3. Pick the right kind

| kind        | use it for |
|-------------|------------|
| `plan`      | one workstream broken into slices/phases (most common) |
| `roadmap`   | a looser, forward-looking feature wishlist |
| `issue`     | a single problem or gap with a fix plan |
| `checklist` | a repeatable verification/QA pass |

If unsure between `plan` and `issue`: a `plan` has several related slices; an
`issue` is one thing. When unsure between `plan` and `roadmap`: `plan` is
committed work with structure; `roadmap` is "things we might do."

---

## 4. Status — use the checkbox triad

Record every task's status as a markdown checkbox. This is the **only** canonical
status encoding. Do not use ✅/🟡/⬜ emoji as the status — the tool reads the
checkbox, not the emoji.

- `- [ ]` planned / not started
- `- [~]` partial / in progress
- `- [x]` done

That's it. Three states.

### 4.1 Extra states (rare, must be declared)

Some docs need more — a QA checklist might need "skipped" or "failed." Declare
them in frontmatter and use them as a trailing tag:

```yaml
status-ext:
  - "skip: cannot verify automatically"
  - "fail: defect found"
```
```
- [ ] Clone Stamp behaves correctly   @skip
```

Only use extension states the doc has declared. Don't invent states inline.

---

## 5. Dependencies — write `needs:`, never describe blocking in prose

If a task can't complete until something else is done, say so with `needs:`
pointing at the blocker. Do **not** write "blocked on…", "gated by…", "depends
on…" in prose — the tool can't query prose.

```
- [ ] **REC3** — wire midi-note echo into recording    needs: MIDI_PLAN#M3
```

- A target is another item (`doc#ID`) or a cross-cutting blocker
  (`blockers/apple-signing`).
- **You do not write "blocked".** Blocked is *computed*: an item with an unmet
  `needs:` is blocked automatically. Status (the checkbox) and blocked (the
  `needs:`) are two independent axes — a task can be `[ ]` planned *and* have an
  unmet `needs:`. Set the checkbox for progress; set `needs:` for dependency;
  let the tool combine them.
- **You never write the reverse direction.** "What does M3 unblock?" is derived
  by the tool scanning every `needs:`. Write the forward reference once.

### 5.1 Cross-cutting blockers

If a blocker spans products (e.g. "waiting on the Apple Developer account"), it
lives in its own file under `blockers/` and items reference it. Don't restate the
blocker's detail in each doc — point at the one file.

---

## 6. IDs — mint one only when something references the item

Most tasks are plain lines with no ID. Give a task a stable ID **only when
another item or doc needs to point at it.** Don't number every line.

- ID = the doc's `id-prefix` + a number, written as a bold lead-in:
  `- [ ] **REC3** — …`
- Reference it from elsewhere as `doc#ID`: `needs: MIDI_RECORDING_PLAN#REC3`.

If nothing references a task, leave it a plain `- [ ]` line. Identity is a cost;
pay it only where a reference demands a target.

---

## 7. Sections — Active / (backlog) / Deferred

Separate live work from parked work. The tool recognizes these headings:

- `## Active` — the live frontier (what's in flight / next-up).
- *(no heading)* — anything not under a recognized heading is backlog.
- `## Deferred` — intentionally not-now. Items here are tracked but excluded from
  active rollups, so parked work never reads as forgotten work.

Always put deliberately-postponed work under `## Deferred`, not deleted and not
mixed into the active list.

---

## 8. `verify:` — make "done" checkable

When you mark something `- [x]` done and there's a cheap way to prove it from the
code, attach a `verify:` clause. The tool re-runs these against the current
commit and raises an alarm if a "done" item's proof no longer holds — this is
what keeps the rollup honest instead of just freshly-dated.

```
- [x] **REC2** — capture spine   verify: file:src/recording.ts, fn:recordNoteOn
- [x] Engine-core suite green     verify: tests:engine-core>=89
```

Supported clauses: `file:<path>` (must exist), `fn:<name>` (symbol must appear),
`tests:<suite><op><n>` (test-count assertion). Optional — add them where a claim
is cheaply checkable; don't force them on everything.

---

## 9. House voice — log decisions and provenance

These docs read like a thoughtful engineer explaining choices to a future reader.
Match that:

- When a decision is made, record it inline with a date and that it was chosen:
  `(decision 2026-06-22, user-chosen)`.
- When you reject an alternative, say why briefly: `Rejected: quantize-both
  (gridded but loses feel)`.
- Link code with normal markdown links: `[recordNoteOn](../src/recording.ts)`.
- State scope at the top in one prose paragraph: what this doc is the truth about.

Reference prose, tables, and rationale are free-form. The format structures
*items and sections*, not your explanations — keep the "why" in plain prose.

---

## 10. What the tool will NOT do for you (write accordingly)

Three deliberate limitations. Knowing them changes how you write:

1. **It won't rank your work.** The generated rollup aggregates status but does
   not order the active edge by importance — there's no priority signal in the
   format (by design; priority is project policy, §11). Don't expect the rollup
   to tell you what to do first.
2. **It won't see uncommitted or undocumented work.** A thread that lives only in
   your head, a scratch file, or an uncommitted edit is invisible. **If a thread
   is real, capture it as a committed doc** (a small `issue` or a line in the
   relevant `plan`) — otherwise it won't appear anywhere.
3. **It won't invent structure from prose.** It reads the conventions above and
   treats everything else as opaque text. If you bury a task in a paragraph
   instead of a `- [ ]` line, it doesn't exist as a task. Make every trackable
   thing an item.

---

## 11. Priority and policy are NOT your job here

How to rank work, and how to make technical decisions in this repo (e.g.
data-handling rules, fix-root-cause-vs-patch policy), come from **this project's
CC instructions**, not from this format and not from the doc you're writing. This
guide is identical across every project; policy differs per project. Do not
encode priority or policy into a progress doc — record the facts, and let project
policy (and the human) drive what matters.

---

## 12. Worked example — a conforming `plan`

```markdown
---
project: cophony
kind: plan
title: MIDI Recording Plan
id-prefix: REC
relates:
  - MIDI_PLAN.md
---

# MIDI Recording Plan

Source of truth for recording live input into the piano roll. Capture is
input-source-agnostic; MIDI is one caller, musical typing another.

## Active
- [x] **REC1** — metronome + count-in primitive
- [x] **REC2** — capture / quantize / commit spine   verify: file:src/recording.ts, fn:recordNoteOn
- [ ] **REC3** — midi-note echo → capture   needs: MIDI_PLAN#M3
- [ ] **REC4** — overdub + loop-seam handling

## Deferred
- variable quantize strength + swing
- song-mode recording
```

See `WORK_STREAMS.generated.md` for what the tool *produces* from docs like this
— note that you never write that file; the tool does.

---

## 13. Before you commit — quick check

- [ ] Frontmatter has `project` and `kind`; `kind` is not `rollup`.
- [ ] Every task is a `- [ ]` / `- [~]` / `- [x]` line (no emoji-only status).
- [ ] Dependencies use `needs:`, not prose; no hand-written "blocked".
- [ ] IDs exist only on items something references.
- [ ] Postponed work is under `## Deferred`.
- [ ] `[x]` items have `verify:` clauses where cheaply checkable.
- [ ] No priority/policy baked into the doc.
- [ ] You committed it — uncommitted means invisible.
