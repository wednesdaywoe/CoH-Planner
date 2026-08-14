"""Regression guard for the Parse6 AttribMod `Aspect` decode (MOVEMAP-2).

MOVEMAP-2 opened on the claim that no Parse6 movement atom carries
`aspect: Max` on any axis, which left two readings open: the forks author no
travel-cap rows, or Parse6 never reads the aspect and some cap rows ship
labelled `Cur`. The second would be a live wrong number — a cap summed into a
speed. Measured 2026-08-13: the aspect IS read, and both forks DO author
positive movement caps. The claim came from a census scoped to the self-buff
rows one applier reads.

Parse6 stores the aspect as `value * 4` where Parse7 uses `value * 8`
(`_parse_effect_template_parse6`, `parser/_powers.py`), immediately after the
attrib word and before the `BoostIgnoreDiminishing` bool. This pins four
things a future parser change could quietly undo:

1. The decoded vocabulary is closed — an off-by-one divisor or a shifted
   offset produces `Unknown(...)`.
2. Every aspect, `Maximum` included, is non-vacuous per fork. A fork that
   resolves NOTHING passes every value check ever written, so the floors are
   part of the claim.
3. The Parse6 forks carry the travel-cap-bump SHAPE — positive, self-targeted,
   a movement attrib on a `*_Ones` table at `Maximum`. This is the assertion
   MOVEMAP-2 turned on: if the aspect stopped decoding, these rows would ship
   as `Current` speed buffs and the count would go to zero.
4. `BoostIgnoreDiminishing` — the bool immediately after the aspect word — is
   set somewhere on each fork. If the aspect read were one word early or late
   it would be consuming that bool, whose only values are 0 and 1, and the
   flag could never appear. This is the alignment half; (1) alone cannot see a
   swap between two adjacent fields whose values both happen to be in range.

Probes are selected by property, never by power name (the cap rows sit on
different powers per fork).

WHAT IT CANNOT SEE: it reads the committed `exported_powers/` trees, so it
grades the export, not the binary — a re-export is what moves these numbers.
It says nothing about whether a fork's cap VALUE is right, only that the
aspect that separates a cap from a speed survives the decode. Homecoming is
included as the cross-fork comparison; the floors are per fork and deliberately
not must-equal-HC, because the forks rebalance travel deliberately.

Run directly:  python3 tools/bin-crawler/tests/test_parse6_aspect.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

# Nested fork trees, skipped when walking the Homecoming root.
_FORK_DIRS = {"rebirth", "thunderspy"}

_FORKS = {
    "homecoming": _EXPORT,
    "rebirth": os.path.join(_EXPORT, "rebirth"),
    "thunderspy": os.path.join(_EXPORT, "thunderspy"),
}

# The whole `ATTRIB_MOD_ASPECT` table (`parser/_enums.py`). Anything else is a
# decode failure, which the parser surfaces as `Unknown(<raw>)`.
_ASPECTS = {"Current", "Maximum", "Strength", "Resistance", "Absolute"}

# The movement attribs a travel cap can sit on. Deliberately excludes
# MovementControl / MovementFriction, which have no cap row on any fork.
_MOVEMENT_ATTRIBS = {"RunningSpeed", "JumpingSpeed", "JumpHeight", "FlyingSpeed"}

_BOOST_IGNORE_DIMINISHING = 0x000002

# Floors sit just under the counts measured 2026-08-13 (MOVEMAP-2), which are
# recorded in the comment beside each so a shift is legible rather than silent.
_FLOORS = {
    #                 aspect totals              movement   cap    ignore-
    #                 Cur    Max  Str  Res  Abs   Maximum  shape   diminishing
    "homecoming":  (17000,   550, 7500, 4300, 12000,  190,    20,      80),
    "rebirth":     (23000,   430, 21000, 12000, 15000, 110,     6,     200),
    "thunderspy":  (16000,   460, 9000, 4200, 15000,  130,     2,      80),
}
# measured: HC   Cur 19427 Max 609 Str 8629 Res 4813 Abs 14427 · move-Max 211 · cap 23 · bid 108
#           RB   Cur 25757 Max 473 Str 24305 Res 13658 Abs 17720 · move-Max 124 · cap  8 · bid 282
#           TS   Cur 18672 Max 512 Str 10261 Res 4676 Abs 17563 · move-Max 146 · cap  3 · bid 106


def scan(root: str, *, skip_nested: bool) -> dict:
    """Walk one exported tree and count what the aspect decode produced.

    Kept as a plain function over a root so a mutation harness can point it at
    a doctored copy of the tree and watch the assertions go red.
    """
    stats = {
        "files": 0,
        "templates": 0,
        "aspects": {},
        "movement_maximum": 0,
        "cap_shape": [],
        "boost_ignore_diminishing": 0,
    }
    for dirpath, dirnames, filenames in os.walk(root):
        if skip_nested:
            dirnames[:] = [d for d in dirnames if d not in _FORK_DIRS]
        for filename in sorted(filenames):
            if not filename.endswith(".json"):
                continue
            with open(os.path.join(dirpath, filename)) as f:
                try:
                    power = json.load(f)
                except ValueError:
                    continue
            if not isinstance(power, dict) or "effects" not in power:
                continue  # tables/, entities/, index files
            stats["files"] += 1
            for effect in power["effects"] or []:
                for template in effect.get("templates") or []:
                    stats["templates"] += 1
                    aspect = template.get("aspect")
                    stats["aspects"][aspect] = stats["aspects"].get(aspect, 0) + 1
                    if (template.get("flags_raw") or 0) & _BOOST_IGNORE_DIMINISHING:
                        stats["boost_ignore_diminishing"] += 1
                    attribs = template.get("attribs") or []
                    if aspect != "Maximum" or not _MOVEMENT_ATTRIBS & set(attribs):
                        continue
                    stats["movement_maximum"] += 1
                    if (template.get("scale") or 0) > 0 \
                            and template.get("target") == "Self" \
                            and str(template.get("table") or "").endswith("_Ones"):
                        stats["cap_shape"].append(
                            (power.get("full_name"), tuple(attribs),
                             template.get("scale"), template.get("table")))
    return stats


_CACHE: dict[str, dict] = {}


def _stats(fork: str) -> dict:
    if fork not in _CACHE:
        _CACHE[fork] = scan(_FORKS[fork], skip_nested=(fork == "homecoming"))
    return _CACHE[fork]


def check_vocabulary(fork: str, stats: dict) -> None:
    unknown = {a: n for a, n in stats["aspects"].items() if a not in _ASPECTS}
    assert not unknown, (
        f"{fork}: aspect decoded outside the ATTRIB_MOD_ASPECT table: {unknown}. "
        "On Parse6 that means the *4 divisor or the field offset moved"
    )
    assert stats["templates"] > 0, f"{fork}: no templates scanned — wrong root?"


def check_floors(fork: str, stats: dict) -> None:
    cur, mx, st, res, ab, move_max, cap, bid = _FLOORS[fork]
    for aspect, floor in (("Current", cur), ("Maximum", mx), ("Strength", st),
                          ("Resistance", res), ("Absolute", ab)):
        got = stats["aspects"].get(aspect, 0)
        assert got >= floor, (
            f"{fork}: only {got} templates on aspect {aspect} (floor {floor}). "
            "An aspect that resolves nowhere looks exactly like a fork that "
            "authors none — this floor is the difference"
        )
    assert stats["movement_maximum"] >= move_max, (
        f"{fork}: {stats['movement_maximum']} movement templates on aspect "
        f"Maximum (floor {move_max}). A movement cap read as Current is a cap "
        "summed into a speed (MOVEMAP-2)"
    )
    assert stats["boost_ignore_diminishing"] >= bid, (
        f"{fork}: BoostIgnoreDiminishing set on {stats['boost_ignore_diminishing']} "
        f"templates (floor {bid}). On Parse6 that bool sits immediately after the "
        "aspect word — a zero here means the aspect read is consuming it"
    )


def check_cap_shape(fork: str, stats: dict) -> None:
    _, _, _, _, _, _, floor, _ = _FLOORS[fork]
    rows = stats["cap_shape"]
    assert len(rows) >= floor, (
        f"{fork}: {len(rows)} travel-cap-shaped rows (positive, Self, movement "
        f"attrib, *_Ones table, aspect Maximum) — floor {floor}. This is the "
        "shape MOVEMAP-2 was filed over; the forks DO author it, so a zero here "
        f"means the aspect stopped decoding. Got: {rows[:5]}"
    )


def test_aspect_vocabulary_is_closed():
    """No fork decodes an aspect outside the five-value table."""
    for fork in _FORKS:
        check_vocabulary(fork, _stats(fork))


def test_every_aspect_is_non_vacuous():
    """Each aspect, each fork, above a floor — plus the alignment bool."""
    for fork in _FORKS:
        check_floors(fork, _stats(fork))


def test_parse6_forks_author_movement_caps():
    """Both Parse6 forks state positive movement caps on `*_Ones`, which is
    what settled MOVEMAP-2 as a fork content difference rather than a parse gap.
    Homecoming is here as the cross-fork comparison, not as the target."""
    for fork in _FORKS:
        check_cap_shape(fork, _stats(fork))


def _run():
    fns = [v for k, v in sorted(globals().items())
           if k.startswith("test_") and callable(v)]
    failed = 0
    for fn in fns:
        try:
            fn()
            print(f"PASS {fn.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"FAIL {fn.__name__}: {e}")
    if failed:
        print(f"\n{failed}/{len(fns)} failed")
        raise SystemExit(1)
    for fork in sorted(_CACHE):
        s = _CACHE[fork]
        print(f"  {fork:12s} templates {s['templates']:6d}  aspects "
              f"{ {k: v for k, v in sorted(s['aspects'].items())} }  "
              f"move-Max {s['movement_maximum']:4d}  cap-shape {len(s['cap_shape']):3d}")
    print(f"\nall {len(fns)} passed")


if __name__ == "__main__":
    _run()
