"""Regression guard for case-folded availability lookups (SOURCE-1 item 5).

powers.bin and powersets.bin legitimately disagree on CASE for some powers —
the game engine matches names case-insensitively, so the binaries never had to
agree. The exporter's availability/order/record lookups historically matched
case-SENSITIVELY, so those powers fell through to the silent `available_level = 0`
default and lost their powerset-record metadata. The three value-bearing
casualties, each carrying a real unlock level in its powerset record:

  - Rebirth  `Epic.Martial_Mastery_Tanker.Art_of_War`  (record: `Art_Of_War`, 40)
    — the register's "epic-unlock available = 0" item; the level was in the
    binary all along, and the epic converter's requires-shape inference (`||` →
    40) had been guessing it.
  - Rebirth  `Guardian_Assault.Hellfire_Assault.*`     (record set: `HellFire_Assault`)
    — the whole Guardian secondary read available 0 (= level 1) and its
    index.json lost display_name/help/icon.
  - Thunderspy `*_Defense.Invulnerability.Tough_Hide`  (record: `Tough_hide`,
    Scrapper 34 / Tanker 25).

This asserts the recovered values from the COMMITTED `exported_powers/` (the
direct parser output, git-tracked) so a future re-export can't silently undo
the fix (GAME-DATA-PRINCIPLES §9). It reads only committed JSON — no .bin /
.pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_available_levels.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")


def _load(*rel_path: str) -> dict:
    with open(os.path.join(_EXPORT, *rel_path)) as f:
        return json.load(f)


def test_rebirth_art_of_war_available_level_is_sourced():
    power = _load("rebirth", "epic", "martial_mastery_tanker", "art_of_war.json")
    assert power["available_level"] == 40, power["available_level"]

    index = _load("rebirth", "epic", "martial_mastery_tanker", "index.json")
    by_name = dict(zip(index["powers"], index["available_level"]))
    assert by_name["Epic.Martial_Mastery_Tanker.Art_of_War"] == 40, by_name
    # Native game order: Art of War sits between Bodkin Bolt and Valiance, not
    # dumped at the end by an order-lookup miss.
    leaves = [name.split(".")[-1] for name in index["powers"]]
    assert leaves == [
        "Throwing_Dagger", "Battle_Hardened", "Bodkin_Bolt",
        "Art_of_War", "Valiance",
    ], leaves


def test_rebirth_hellfire_assault_recovers_record_data():
    index = _load("rebirth", "guardian_assault", "hellfire_assault", "index.json")
    # The record lookup miss zeroed every level and blanked the set metadata.
    assert any(level > 0 for level in index["available_level"]), index["available_level"]
    assert index["help"], "powerset record help lost — record lookup missed"

    by_leaf = {
        name.split(".")[-1]: level
        for name, level in zip(index["powers"], index["available_level"])
    }
    assert by_leaf["Crack_Whip"] == 1, by_leaf
    assert by_leaf["Wrath_Of_Hell"] == 31, by_leaf


def test_thunderspy_tough_hide_available_levels():
    scrapper = _load("thunderspy", "scrapper_defense", "invulnerability",
                     "tough_hide.json")
    assert scrapper["available_level"] == 34, scrapper["available_level"]

    tanker = _load("thunderspy", "tanker_defense", "invulnerability",
                   "tough_hide.json")
    assert tanker["available_level"] == 25, tanker["available_level"]


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"{name}: OK")
