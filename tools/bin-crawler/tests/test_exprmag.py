"""Guard for the AttribMod `duration_expression` / `magnitude_expression` read
(EXPRMAG-1).

An `Expression`-typed AttribMod takes one of its two scalars from a stack-machine
program. The parser reads BOTH programs as string_arrays between `duration` and
`magnitude` (`_powers.py`, Parse7 layout: `dur_expr`, `mag_expr`, `delay`), and
the converter evaluates `magnitude_expression` downstream. EXPRMAG-1 was filed
because a set of Expression-typed templates exported with an EMPTY
`magnitude_expression` and asked whether the parser was dropping the program.

The binary settled it: reading the carriers out of `powers.bin` directly, the
`magnitude_expression` string_array is genuinely count=0 on the wire — it is not
folded or dropped — while the `duration_expression` carries a real RPN list for
the ones that matter (Defibrillate's Sleep, Vacuum's Create_Entity/Set_Mode). So
the parser is faithful and no reader fix was needed; the exit condition's
outcome (b) applied — the type is what the game stores.

What this grades is not the fix (there is none) but a FUTURE regression that
stops reading either array: that would silently turn populated programs into
empty lists and move the planner's durations/magnitudes with no red light. The
two floors are the light — one per array, per fork — so a re-read that drops
either fails loud. The `neither` bound pins the adjudicated sentinels (an
`Expression` row with neither program, e.g. Defiance's `Null`); it is a ceiling,
not a floor, because a growth in that count is exactly what a drop would produce.

Reads the committed `exported_powers/` trees only — no .bin / .pigg needed. Set
`EXPRMAG_EXPORT_ROOT` to re-point at a re-export (e.g. a mutated parser output)
for the mutation test.

Run directly:  python3 tools/bin-crawler/tests/test_exprmag.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json

_REPO = _os.path.normpath(_os.path.join(_os.path.dirname(__file__), "..", "..", ".."))
_EXPORT_ROOT = _os.environ.get("EXPRMAG_EXPORT_ROOT", _os.path.join(_REPO, "exported_powers"))
_FORK_ROOTS = {_os.path.join(_EXPORT_ROOT, fork)
               for fork in _forks.NESTED_DIRS}

# Per-fork floors on Expression templates that carry each program. Measured on
# the current export; a reader that stops reading an array sends its count to
# zero and fails the floor.
#   mag_expr populated:  HC 774 / RB 711 / TP 522 / BS 791
#   dur_expr populated:  HC 117 / RB 6 / TP 4 / BS 117
MAG_EXPR_FLOORS = {"homecoming": 700, "rebirth": 650,
                   "thunderspy": 470, "brainstorm": 720}
DUR_EXPR_FLOORS = {"homecoming": 100, "rebirth": 5,
                   "thunderspy": 3, "brainstorm": 100}
# Expression templates carrying NEITHER program: the adjudicated sentinels
# (Defiance's `Null`, a few Kinetic_Assault damage rows). Measured HC 1 / RB 5 /
# TP 5 / BS 1. A regression that drops an array pushes its carriers here, so the
# ceiling is the assertion, not a floor.
NEITHER_CEILINGS = {"homecoming": 4, "rebirth": 8,
                    "thunderspy": 8, "brainstorm": 4}


def _templates(power):
    """Every template in a power, walking nested `child_effects` too."""
    def walk(groups):
        for group in groups:
            for template in group.get("templates") or []:
                yield template
            yield from walk(group.get("child_effects") or [])
    yield from walk(power.get("effects") or [])
    yield from walk(power.get("activation_effects") or [])


def _powers(root, fork):
    """Every power JSON in one fork's tree, excluding the nested fork trees."""
    for path, dirs, files in _os.walk(root):
        if path == root:
            dirs[:] = [d for d in dirs
                       if _os.path.join(path, d) not in _FORK_ROOTS]
        for name in sorted(files):
            if not name.endswith(".json"):
                continue
            with open(_os.path.join(path, name)) as f:
                try:
                    power = json.load(f)
                except ValueError:
                    continue
            if isinstance(power, dict) and "effects" in power:
                yield power


def _census(fork):
    # homecoming is the export root itself; the other datasets nest under it. This
    # mirrors _forks.FORKS but stays under _EXPORT_ROOT so EXPRMAG_EXPORT_ROOT can
    # redirect the whole census at a re-export for the mutation test.
    root = _EXPORT_ROOT if fork == _forks.ROOT_DATASET else _os.path.join(_EXPORT_ROOT, fork)
    mag = dur = neither = 0
    for power in _powers(root, fork):
        for template in _templates(power):
            if template.get("type") != "Expression":
                continue
            if template.get("magnitude_expression"):
                mag += 1
            if template.get("duration_expression"):
                dur += 1
            if not template.get("magnitude_expression") and not template.get("duration_expression"):
                neither += 1
    return mag, dur, neither


def test_magnitude_expression_survives_the_read_per_fork():
    """`magnitude_expression` reaches the export as its own array. A reader that
    stops reading it (or folds it) zeroes every fork and fails this floor."""
    for fork, floor in MAG_EXPR_FLOORS.items():
        mag, _dur, _neither = _census(fork)
        assert mag >= floor, (
            f"{fork}: only {mag} Expression templates carry a magnitude_expression "
            f"(floor {floor}); the read is regressing")


def test_duration_expression_survives_the_read_per_fork():
    """`duration_expression` reaches the export as its own array — this is the
    array the carriers actually carry on, so it is the load-bearing floor. A
    reader that discards it (the STACK-3/WRAP-1 shape) sends these to zero."""
    for fork, floor in DUR_EXPR_FLOORS.items():
        _mag, dur, _neither = _census(fork)
        assert dur >= floor, (
            f"{fork}: only {dur} Expression templates carry a duration_expression "
            f"(floor {floor}); the read is regressing")


def test_expression_neither_count_within_adjudicated_sentinels():
    """Expression templates carrying neither program stay at the adjudicated
    sentinels. Growth here is what a drop of either array produces, so a
    regression shows as a count over the ceiling rather than a missing floor."""
    for fork, ceiling in NEITHER_CEILINGS.items():
        _mag, _dur, neither = _census(fork)
        assert neither <= ceiling, (
            f"{fork}: {neither} Expression templates carry neither program "
            f"(ceiling {ceiling}); a program read is regressing")


if __name__ == "__main__":
    for fork in sorted(_forks.FORKS):
        mag, dur, neither = _census(fork)
        print(f"{fork}: mag_expr={mag} dur_expr={dur} neither={neither}")
    test_magnitude_expression_survives_the_read_per_fork()
    test_duration_expression_survives_the_read_per_fork()
    test_expression_neither_count_within_adjudicated_sentinels()
    print("OK")
