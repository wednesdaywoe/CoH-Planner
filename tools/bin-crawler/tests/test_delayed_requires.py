"""Regression guard for the AttribMod's own `DelayedRequires` (STACK-3).

The field is a string_array sitting between the tick block and the stack
quadruple — `ppchApplicationRequires` in the source parse table
(`Common/entity/attribmod.h`), authored as `DelayedRequires` in the HC `.powers`
defs. It is an APPLICATION-time gate, distinct from the enclosing EffectGroup's
cast-time `Requires`, and each of the three forks was mishandling it differently:

  * **Homecoming** read the array (so its alignment was right) and then threw the
    tokens away — 339 templates' gates discarded, `jit_requires` hardcoded to ''.
  * **Rebirth** read it and kept it. The only fork that was already correct.
  * **Thunderspy** did not read it at all. The stack quadruple was read at a FIXED
    offset that is only correct when the array is empty, so the 63 sub-records
    carrying one had their caster_stack / stack / limit / key — and the whole tail
    walk behind them, i.e. flags, cancel_events, messages and FX — read
    4*(1+N) bytes early. 61 surfaced as `Unknown(<string offset>)`; **2 landed on a
    valid enum name and were silently wrong**, which is why a census of the
    `Unknown` values alone under-counted the population.

What this grades: that the field is READ on every fork, and that the fields
BEHIND it on Thunderspy land on their enums. What it cannot grade: whether an
expression is semantically right — the tokens are opaque RPN here, and the
authored-def round-trip (`raw defs/`, HC only) is what settled that.

Reads the committed `exported_powers/` trees only — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_delayed_requires.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORTS = {
    "homecoming": os.path.join(_REPO, "exported_powers"),
    "rebirth": os.path.join(_REPO, "exported_powers", "rebirth"),
    "thunderspy": os.path.join(_REPO, "exported_powers", "thunderspy"),
}
_FORK_ROOTS = {os.path.join(_REPO, "exported_powers", fork)
               for fork in ("rebirth", "thunderspy")}

# The 11 members of `StackTypeEnum` and the 2 of `CasterStackTypeEnum`. An
# unmapped raw exports as `Unknown(<raw>)`, which is what the misalignment
# produced, so membership here IS the assertion.
_STACK = {"Stack", "Ignore", "Extend", "Replace", "Overlap", "StackThenIgnore",
          "Refresh", "RefreshToCount", "Maximize", "Suppress", "Continuous"}
_CASTER_STACK = {"Individual", "Collective"}


def _templates(power):
    """Every (group, template) pair, walking nested children too.

    The export serializes nested groups as `child_effects`; walking
    `child_groups` (the parser's dataclass name) silently grades nothing.
    """
    def walk(groups):
        for group in groups:
            for template in group.get("templates") or []:
                yield group, template
            yield from walk(group.get("child_effects") or [])
    yield from walk(power.get("effects") or [])
    yield from walk(power.get("activation_effects") or [])


def _powers(fork):
    """Every power JSON in one fork's tree, excluding the nested fork trees."""
    root = _EXPORTS[fork]
    for path, dirs, files in os.walk(root):
        if path == root:
            dirs[:] = [d for d in dirs if os.path.join(path, d) not in _FORK_ROOTS]
        for name in sorted(files):
            if not name.endswith(".json"):
                continue
            with open(os.path.join(path, name)) as f:
                try:
                    power = json.load(f)
                except ValueError:
                    continue
            if isinstance(power, dict) and "effects" in power:
                yield power


def _gated(fork):
    return [(power["full_name"], template["jit_requires"])
            for power in _powers(fork)
            for _group, template in _templates(power)
            if template.get("jit_requires")]


def test_every_fork_reads_the_field():
    """Non-vacuity, per fork. A reader that stops resolving the tokens leaves the
    field empty everywhere, and an empty field is indistinguishable from a fork
    that authors none — so the floor is the assertion, not the shape.

    Rebirth's is three orders larger for a schema reason, not a content one: it
    has no EffectGroup, so its AttribMod `Requires` carries every gate the other
    two forks put on the group, and the parser lifts that same string onto the
    synthetic group as well.
    """
    floors = {"homecoming": 180, "rebirth": 20000, "thunderspy": 55}  # 210 / 24792 / 63
    for fork, floor in floors.items():
        found = _gated(fork)
        assert len(found) >= floor, (
            f"{fork}: only {len(found)} templates carry a DelayedRequires "
            f"(floor {floor}); the field is being read but not resolved")


def test_thunderspy_stack_quadruple_is_never_read_from_a_shifted_offset():
    """The fields BEHIND the array. Every one of the four must land on its enum
    or its plausible range on every sub-record — a shifted read produces a string
    offset, which is what `Unknown(...)` and a five-digit stack limit were."""
    bad = []
    for power in _powers("thunderspy"):
        for _group, template in _templates(power):
            stack = template.get("stack")
            caster = template.get("caster_stack")
            limit = template.get("stack_limit")
            if stack and stack not in _STACK:
                bad.append((power["full_name"], "stack", stack))
            if caster and caster not in _CASTER_STACK:
                bad.append((power["full_name"], "caster_stack", caster))
            if limit is not None and not 0 <= limit <= 64:
                bad.append((power["full_name"], "stack_limit", limit))
    assert not bad, f"{len(bad)} shifted stack reads, first 5: {bad[:5]}"


def test_thunderspy_names_both_caster_stack_values():
    """`caster_stack` was never assigned on this fork at all — it exported as ''
    on every record, so "reads its enum" would pass on a reader that still writes
    nothing. Both values must be present for the read to be doing any work."""
    seen = {template.get("caster_stack")
            for power in _powers("thunderspy")
            for _group, template in _templates(power)}
    assert _CASTER_STACK <= seen, f"caster_stack only ever reads {seen - {''}}"


def test_the_recovered_records_match_their_uncorrupted_twins():
    """Combat Flight states its +Defense twice — once plain, once gated on not
    owning Weave — and the two AttribMods are otherwise byte-identical. That makes
    the gated one its own control: every field the misalignment corrupted
    (stack, limit, key, flags, cancel_events) must equal the ungated one's, and
    only `jit_requires` may differ. Found by shape, so it survives a rename."""
    power = next(p for p in _powers("thunderspy")
                 if p["full_name"].endswith("Flight.Combat_Flight"))
    defense = [t for _g, t in _templates(power) if t.get("table") == "Melee_Buff_Def"]
    assert len(defense) == 2, f"expected the +Def pair, found {len(defense)}"
    plain, gated = sorted(defense, key=lambda t: bool(t.get("jit_requires")))
    assert not plain["jit_requires"] and gated["jit_requires"], \
        "neither +Def template carries the gate that distinguishes them"
    differ = {k for k in set(plain) | set(gated) if plain.get(k) != gated.get(k)}
    assert differ == {"jit_requires"}, \
        f"the gated twin still differs from its control in {sorted(differ - {'jit_requires'})}"


def test_the_map_gate_splits_share_pain_into_a_pve_and_a_pvp_copy():
    """`isPVPMap?` is the forks' map-scoped spelling of the combat split, and on
    Share Pain it rides the AttribMod rather than the element. With the field
    unread the two +ToHit copies were indistinguishable same-slot duplicates and
    the PvE build read the PvP value (0.5 where the game grants 1.0). Asserted on
    the pair's shape — one negated gate, one not, with opposite verdicts."""
    for fork_power in (p for p in _powers("thunderspy")
                       if p["full_name"].endswith("Pain_Domination.Share_Pain")):
        pairs = [(g, t) for g, t in _templates(fork_power)
                 if "isPVPMap?" in (t.get("jit_requires") or [])]
        assert len(pairs) == 2, f"{fork_power['full_name']}: {len(pairs)} map-gated templates"
        verdicts = {g["is_pvp"]: t["jit_requires"] for g, t in pairs}
        assert set(verdicts) == {"PVE_ONLY", "PVP_ONLY"}, \
            f"{fork_power['full_name']}: map-gated pair reads {set(verdicts)}"
        assert verdicts["PVE_ONLY"][-1:] == ["!"] and verdicts["PVP_ONLY"][-1:] != ["!"], \
            f"{fork_power['full_name']}: the negated gate is on the wrong side"


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if not name.startswith("test_") or not callable(fn):
            continue
        try:
            fn()
            print(f"PASS {name}")
        except AssertionError as e:
            failures += 1
            print(f"FAIL {name}: {e}")
    print(f"\n{failures} failed" if failures else "\nall passed")
    raise SystemExit(1 if failures else 0)
