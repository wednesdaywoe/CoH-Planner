"""Regression guard for the Thunderspy CHANCE decode (RB5-b2).

A Thunderspy effect element is HC's EffectGroup, and its header carries the
group's `Chance` where the parser long read a per-template "magnitude default".
Two consequences the parser shipped for as long as it has read the record:

  * every rolled effect on the fork exported as CERTAIN — the whole fork looked
    like it rolled nothing, which a corpus gate had pinned as a rebalance;
  * the chance itself surfaced in the export under the name `magnitude`, so a
    50% knockback read as a magnitude-0.5 knockback.

Beside it, each AttribMod's own `TickChance` sits in the tick block the reader
used to step over. The two are DIFFERENT fields — they disagree on 10,158
records — and Fire Sword shows both at once: a group that always applies
(`chance` 1.0) whose burn lands on 80% of its ticks.

This asserts the recovered values from the COMMITTED `exported_powers/` tree, so
a future re-export can't silently drop them. It reads only committed JSON — no
.bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_thunderspy_chance.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_TSPY_EXPORT = os.path.join(_REPO, "exported_powers", "thunderspy")


def _load(rel_path: str) -> dict:
    with open(os.path.join(_TSPY_EXPORT, rel_path)) as f:
        return json.load(f)


def _groups(power: dict):
    """Every (group, template) pair, walking nested children as well."""
    def walk(groups):
        for group in groups:
            for template in group.get("templates") or []:
                yield group, template
            yield from walk(group.get("child_effects") or [])
    return walk(power["effects"])


def _all_powers():
    for root, _dirs, files in os.walk(_TSPY_EXPORT):
        for name in files:
            if not name.endswith(".json"):
                continue
            with open(os.path.join(root, name)) as f:
                try:
                    power = json.load(f)
                except ValueError:
                    continue
            if isinstance(power, dict) and "effects" in power:
                yield power


def test_a_rolled_effect_carries_its_chance_not_a_magnitude():
    """Frag Grenade's Knockback rolls at 50% — the value Homecoming and Rebirth
    both author as `Chance 0.5`. It is the anchor for the whole decode because
    the parser used to export exactly this 0.5 in the `magnitude` slot, which is
    self-consistent enough that no downstream gate could see it."""
    grenade = _load(os.path.join("arachnos_soldiers", "arachnos_soldier",
                                 "frag_grenade.json"))
    knockbacks = [(g, t) for g, t in _groups(grenade)
                  if t["attribs"] == ["Knockback"]]
    assert knockbacks, "Frag Grenade has no Knockback template"
    for group, template in knockbacks:
        assert abs(group["chance"] - 0.5) < 1e-6, group["chance"]
        # The magnitude slot must no longer be holding the probability.
        assert abs(template["magnitude"] - 1.0) < 1e-6, template["magnitude"]


def test_the_group_chance_and_the_tick_chance_are_different_fields():
    """Fire Sword carries both at once, and reads template-for-template like its
    Homecoming twin: a burn that always applies but lands on 80% of its ticks,
    and a dormant Fiery-Embrace component at chance 0."""
    sword = _load(os.path.join("scrapper_melee", "fiery_melee", "fire_sword.json"))
    burn = [(g, t) for g, t in _groups(sword)
            if t["application_period"] > 0 and abs(t["scale"] - 0.1) < 1e-6]
    assert len(burn) == 1, f"expected one 0.1-scale burn, got {len(burn)}"
    group, template = burn[0]
    assert abs(group["chance"] - 1.0) < 1e-6, group["chance"]
    assert abs(template["tick_chance"] - 0.8) < 1e-6, template["tick_chance"]

    dormant = [g for g, t in _groups(sword) if g["chance"] == 0.0]
    assert dormant, "Fire Sword has no chance-0 component"


def test_the_fork_ships_rolled_and_inert_effects():
    """The census that retires the old "Thunderspy rolls nothing" pin. Both
    columns are asserted non-empty rather than pinned to an exact count: what
    this guards is a field reverting to its dataclass default, and a default
    shows up as a column that is 100% one value — which is precisely how the
    gap survived a corpus gate the first time."""
    rolled = inert = per_tick = total = 0
    for power in _all_powers():
        for group, template in _groups(power):
            total += 1
            if 0.0 < group["chance"] < 1.0:
                rolled += 1
            if group["chance"] == 0.0:
                inert += 1
            if template["tick_chance"] < 1.0:
                per_tick += 1
    assert total > 50000, f"only {total} templates swept — export truncated?"
    assert rolled > 3000, f"only {rolled} rolled groups (measured 4,237)"
    assert inert > 1500, f"only {inert} inert groups (measured 2,402)"
    assert per_tick > 500, f"only {per_tick} per-tick rolls (measured 785)"


def test_a_proc_enhancement_carries_its_rate():
    """The element header's PPM was discarded along with the chance, so no
    Thunderspy proc had a rate at all. Asserted as a corpus property — the fork's
    proc pieces are data, and naming one here would pin a specific set."""
    with_ppm = [power for power in _all_powers()
                if any(group["ppm"] > 0 for group, _ in _groups(power))]
    assert len(with_ppm) > 120, f"only {len(with_ppm)} powers carry a PPM rate (measured 191)"


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
