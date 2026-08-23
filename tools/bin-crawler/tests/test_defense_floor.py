"""Guard for the defense FLOOR — AttribMin's typed-defense scalar (ATTRMIN-1).

`ClampCur` holds `attrCur.fDefenseType[]` between two rows and the parser read
only the upper one, so a defense debuff had no value to resolve to. It matters
because the game writes "your defense is negated" as a saturating magnitude
rather than as a switch, the same idiom MOVEMIN-1 found on movement: Thunderspy's
Organic Armor states `Defense −500 × Melee_Buff_Def` on all seven typed slots
while Defensive Adaptation is up, and its own description says why — it "negates
your defense, instead applying a constant 1 percent absorb shield."

Two failure modes, both silent, so both are pinned:

  * **the value.** Every player archetype of all three datasets floors typed
    defense at exactly −1.0, and the neighbouring struct AttribBase holds 0.0 at
    those same slots — so a reader that took the wrong table would report "defense
    cannot be debuffed below zero," which is a plausible sentence and the wrong
    number. Asserting the sign is what separates the two.
  * **authorship.** Both forks stop authoring typed defense at Psionic and leave
    Toxic a bare `0.0` in AttribMin, where Homecoming authors all eleven. A `0.0`
    is a legal floor — one NPC class really does carry it — so it cannot be told
    from real data by inspection, and a reader that ignored authorship would ship
    the forks a zero floor. The three datasets agreeing at −1.0 is what catches
    that, and `test_a_genuine_zero_floor_survives_the_export` is what stops the
    fix from becoming "filter out zeros," which would launder the real one.

**Stated blind spot:** ToHit's AttribMin is also −1.0 (slot 25, immediately
before the defense band), so a one-slot slide off the front of the band is
invisible to every value check here — a corpus cannot grade a distinction it does
not contain. What rules it out is that the slots are resolved by attribute NAME
through `_attrib_struct_index`, which raises when a name matches zero or several
indices.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_defense_floor.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_DATASETS = tuple(_forks.DATASETS)

# Every player archetype of every dataset authors this floor, and it is the same
# number on all 45 — which is what makes a per-class divergence a finding.
_PLAYER_DEFENSE_FLOOR = -1.0

# The one class in the corpus that floors defense at 0.0 rather than −1.0, on all
# three datasets. It is the control for "the export does not launder zeros."
_GENUINE_ZERO_FLOOR_CLASS = "boss_rularuucop"


def _tables_dir(dataset: str) -> str:
    if dataset == "homecoming":
        return os.path.join(_REPO, "exported_powers", "tables")
    return os.path.join(_REPO, "exported_powers", dataset, "tables")


def _is_player(record: dict) -> bool:
    """The export's own membership signal, matching `scripts/_player-classes.cjs`."""
    if "villain_rank" in record:
        return record["villain_rank"] == 0
    restrictions = record.get("special_restrictions")
    return isinstance(restrictions, list) and len(restrictions) > 0


def _player_archetypes(dataset: str) -> dict[str, dict]:
    out = {}
    tables = _tables_dir(dataset)
    for entry in sorted(os.listdir(tables)):
        if not entry.endswith(".json") or entry.startswith("_"):
            continue
        with open(os.path.join(tables, entry)) as f:
            record = json.load(f)
        if _is_player(record):
            out[entry[: -len(".json")]] = record
    return out


def _check_floor(archetype: str, attribs: dict) -> None:
    floor = attribs.get("defense_floor")
    assert isinstance(floor, (int, float)), (
        f"{archetype}: defense_floor is {floor!r} — the AttribMin scalar did "
        f"not reach the export, so a defense debuff has nothing to resolve "
        f"against"
    )
    assert floor == _PLAYER_DEFENSE_FLOOR, (
        f"{archetype}: defense_floor is {floor}, expected "
        f"{_PLAYER_DEFENSE_FLOOR}. A 0.0 here is the AttribBase read (that "
        f"struct holds 0.0 at every typed-defense slot) or an unauthored fork "
        f"slot — either way it claims defense can never be debuffed negative"
    )


def test_every_player_archetype_carries_the_defense_floor():
    for dataset in _DATASETS:
        archetypes = _player_archetypes(dataset)
        assert len(archetypes) == 15, (
            f"{dataset}: {len(archetypes)} player archetypes, expected 15 — "
            f"the census cannot be read as coverage if the population moved"
        )
        for archetype, record in archetypes.items():
            _check_floor(f"{dataset}/{archetype}", record["attribs"])


def test_the_floor_sits_below_the_ceiling_it_is_paired_with():
    """The two bounds of one clamp. A floor at or above the ceiling would make
    every defense total a single pinned number rather than a range, and it is
    the shape that catches the two rows being read out of the same table."""
    for dataset in _DATASETS:
        for archetype, record in _player_archetypes(dataset).items():
            attribs = record["attribs"]
            floor = attribs["defense_floor"]
            ceiling = attribs["defense_cap"]
            assert floor < min(ceiling), (
                f"{dataset}/{archetype}: defense floor {floor} is not below "
                f"its ceiling (min {min(ceiling)}) — these are supposed to be "
                f"opposite bounds of the same clamp"
            )


def test_the_forks_agree_with_homecoming_despite_the_unauthored_toxic_slot():
    """The authorship check, stated as a value. Both forks leave AttribMin's
    Toxic slot at 0.0 where Homecoming authors it, so a reader that took the
    whole defense band without asking which slots the dataset authors would
    report −1.0 on Homecoming and 0.0 on the forks — a per-fork divergence that
    reads like a real difference between the games."""
    floors = {}
    for dataset in _DATASETS:
        seen = {record["attribs"]["defense_floor"]
                for record in _player_archetypes(dataset).values()}
        assert len(seen) == 1, (
            f"{dataset}: player archetypes disagree about the defense floor "
            f"({sorted(seen)}) — defense has become a per-class floor"
        )
        floors[dataset] = seen.pop()
    assert len(set(floors.values())) == 1, (
        f"the datasets disagree about the defense floor ({floors}) — the "
        f"likeliest cause is the forks' unauthored Toxic slot reaching the "
        f"export as a 0.0 floor"
    )


def test_a_genuine_zero_floor_survives_the_export():
    """The counter-control to the check above: `Class_Boss_RularuuCoP` really
    does floor every defense slot at 0.0 on all three datasets. It is the reason
    the unauthored-slot problem cannot be solved by discarding zeros — that fix
    would pass every other test here and silently rewrite this class."""
    for dataset in _DATASETS:
        path = os.path.join(_tables_dir(dataset),
                            f"{_GENUINE_ZERO_FLOOR_CLASS}.json")
        assert os.path.exists(path), (
            f"{dataset}: {_GENUINE_ZERO_FLOOR_CLASS}.json is gone — this test "
            f"is the zero-laundering control and now grades nothing"
        )
        with open(path) as f:
            attribs = json.load(f)["attribs"]
        assert attribs.get("defense_floor") == 0.0, (
            f"{dataset}/{_GENUINE_ZERO_FLOOR_CLASS}: defense_floor is "
            f"{attribs.get('defense_floor')!r}, expected a genuine 0.0 — a "
            f"reader that drops or rewrites zeros has laundered real data"
        )


def test_a_zero_floor_fails_the_value_check():
    """Negative control. The AttribBase misread and the unauthored fork slot
    both land on 0.0, so that is the number the check has to reject."""
    attribs = dict(_player_archetypes("homecoming")["scrapper"]["attribs"])
    attribs["defense_floor"] = 0.0
    try:
        _check_floor("scrapper", attribs)
    except AssertionError:
        return
    raise AssertionError(
        "a 0.0 defense floor passed the value check — it cannot tell the "
        "AttribBase row from the AttribMin one"
    )


def test_a_missing_floor_fails_the_value_check():
    """The other failure mode: a floor that stops reaching the export reads as
    'this archetype has no floor', not as an error."""
    attribs = dict(_player_archetypes("homecoming")["scrapper"]["attribs"])
    attribs.pop("defense_floor")
    try:
        _check_floor("scrapper", attribs)
    except AssertionError:
        return
    raise AssertionError("a dropped defense floor passed the value check")


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"ok  {name}")
    print("\nall defense-floor checks passed")
