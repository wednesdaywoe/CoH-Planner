"""The two note-free sweeps in `diff_exports` (docs/HC-BETA-2026-07.md).

Both compare a build against itself and against the SHAPE of the previous one,
never against a patch note, which is why they keep working when a note is wrong,
missing, or describes a different build. On the 2026-07-30 Homecoming beta they
produced two of the four Tier 1 findings, and nothing else in that pass found
either of them.

The case worth naming here is `a_third_never_matching_copy_does_not_mask_a_split`.
The first version of the cross-archetype sweep asked whether EVERY copy of a
power agreed, and Foot Stomp — the build's strongest finding — ships a third
`mission_maker_attacks` copy that has always differed. That one copy made the
question "did they all agree?" answer no on live, so the whole power was skipped
and the sweep reported the finding it was written to catch as clean. Comparing
per agreeing-set rather than per power is what fixes it.

Synthetic fixtures only — no .bin / .pigg / export tree needed.

Run directly:  python3 tools/bin-crawler/tests/test_diff_sweeps.py
or under pytest (functions are named test_*).
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from bin_crawler.diff_exports import (  # noqa: E402
    find_cross_at_divergence,
    find_powerset_losses,
)


def power(scale: float, *, extra_template: bool = False) -> dict:
    """A minimal power carrying one damage template, optionally a second."""
    templates = [{
        "attribs": ["Smashing_Dmg"], "aspect": "Absolute",
        "table": "Melee_Damage", "target": "AnyAffected",
        "type": "Magnitude", "application_type": "OnTick",
        "stack_key": None, "scale": scale,
    }]
    if extra_template:
        templates.append({
            "attribs": ["Fly"], "aspect": "Current", "table": "Melee_Ones",
            "target": "AnyAffected", "type": "Duration",
            "application_type": "OnTick", "stack_key": None, "scale": -1.6,
        })
    return {"name": "whatever", "effects": [{"templates": templates}]}


def test_copies_that_stop_agreeing_are_reported():
    left = {
        "brute_melee/super_strength/foot_stomp": power(1.0),
        "tanker_melee/super_strength/foot_stomp": power(1.0),
    }
    right = {
        "brute_melee/super_strength/foot_stomp": power(1.0),
        "tanker_melee/super_strength/foot_stomp": power(1.0, extra_template=True),
    }
    hits, agreeing_sets = find_cross_at_divergence(left, right)
    assert agreeing_sets == 1
    assert len(hits) == 1
    (powerset, name), _copies, groups = hits[0]
    assert (powerset, name) == ("super_strength", "foot_stomp")
    assert sorted(sorted(cats) for cats in groups.values()) == [
        ["brute_melee"], ["tanker_melee"]]


def test_identical_builds_report_nothing():
    """The vacuity check: a sweep that fires on an unchanged pair is noise."""
    same = {
        "brute_melee/super_strength/foot_stomp": power(1.0),
        "tanker_melee/super_strength/foot_stomp": power(1.0),
    }
    hits, agreeing_sets = find_cross_at_divergence(same, dict(same))
    assert agreeing_sets == 1
    assert hits == []


def test_copies_that_never_agreed_are_not_this_sweeps_business():
    """Per-AT differences that predate the patch are ordinary game design. The
    sweep only asks about copies the previous build had agreeing."""
    left = {
        "brute_melee/x/p": power(1.0),
        "tanker_melee/x/p": power(2.0),
    }
    right = {
        "brute_melee/x/p": power(1.0),
        "tanker_melee/x/p": power(3.0),
    }
    hits, agreeing_sets = find_cross_at_divergence(left, right)
    assert agreeing_sets == 0
    assert hits == []


def test_a_third_never_matching_copy_does_not_mask_a_split():
    """The Foot Stomp regression. Two copies agreed on live and split on beta,
    beside a third that never matched either. Asking whether ALL copies agreed
    answers no on live and skips the power — reporting the build's strongest
    finding as clean."""
    left = {
        "brute_melee/super_strength/foot_stomp": power(1.0),
        "tanker_melee/super_strength/foot_stomp": power(1.0),
        "mission_maker_attacks/super_strength/foot_stomp": power(9.0),
    }
    right = {
        "brute_melee/super_strength/foot_stomp": power(1.0),
        "tanker_melee/super_strength/foot_stomp": power(1.0, extra_template=True),
        "mission_maker_attacks/super_strength/foot_stomp": power(9.0),
    }
    hits, agreeing_sets = find_cross_at_divergence(left, right)
    assert agreeing_sets == 1, "the two player copies are the one agreeing set"
    assert len(hits) == 1
    groups = hits[0][2]
    reported = sorted(cat for cats in groups.values() for cat in cats)
    assert reported == ["brute_melee", "tanker_melee"], \
        "the third copy is excluded from the comparison, not used to suppress it"


def test_a_powerset_that_lost_a_power_is_separated_from_one_that_renamed_it():
    """Display-name keying makes a rename look like a loss, so the sweep reports
    what each powerset GAINED beside what it lost: a rename pairs up, a real
    deletion stands alone. Both halves of that distinction are asserted here."""
    left = {
        "pets/rainofarrows": {"power_display_names": ["RainofArrows", "Avoid"]},
        "controller_buff/empathy": {"power_display_names": ["Adrenalin Boost", "Fortitude"]},
        "pets/gone_entirely": {"power_display_names": ["Whatever"]},
    }
    right = {
        "pets/rainofarrows": {"power_display_names": ["RainofArrows"]},
        "controller_buff/empathy": {"power_display_names": ["Adrenaline Boost", "Fortitude"]},
    }
    gone, shrunk = find_powerset_losses(left, right)
    assert gone == ["pets/gone_entirely"]
    assert shrunk == [
        ("controller_buff/empathy", ["Adrenalin Boost"], ["Adrenaline Boost"]),
        ("pets/rainofarrows", ["Avoid"], []),
    ]


def test_a_powerset_that_only_gained_is_not_a_loss():
    left = {"x/y": {"power_display_names": ["A"]}}
    right = {"x/y": {"power_display_names": ["A", "B"]}}
    assert find_powerset_losses(left, right) == ([], [])


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
    sys.exit(1 if failures else 0)
