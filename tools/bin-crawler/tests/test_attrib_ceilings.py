"""Guard for the attribute ceilings CAPS-1 recovered from AttribMaxTable.

`_classes.py` used to read four rows out of the class attrib tables (HitPoints,
Absorb, the travel axes, the two clamped strengths) and discard the rest, so no
ceiling reached the export for ToHit, regeneration, recovery, defense or max
endurance — and `finalize` clamped none of them. DATA-GAP-REGISTER CAPS-1.

Pinned by CENSUS and by an independent ORACLE, because both failure modes are
silent. A row read one slot over still looks like a plausible curve (the
neighbouring rows in this region are 1.0 / 4.0 / 5.0 constants), and a row that
stops reaching the export reads as "this archetype has no ceiling". So:

  * every player archetype of every dataset must carry every key, with a
    50-level row where the row is per-level;
  * the regeneration and recovery ceilings must reproduce the game's published
    per-archetype caps once expressed against each class's own base — Scrapper
    and Stalker 3000% regeneration, Tanker/Brute 2500%, everyone else 2000%;
    Controller/Dominator/Mastermind 750% recovery, Defender 625%, everyone else
    500%. That is the oracle: a slid row cannot land on those numbers by luck.

Both checks take the attribs dict as an argument so the negative control can
feed them a deliberately slid one, which is what
`test_a_slid_row_fails_the_oracle` does.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_attrib_ceilings.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_LEVELS = 50

# The per-level ceiling rows, and the base each is only meaningful against.
_CEILINGS = {
    "to_hit_cap": "to_hit_base",
    "regeneration_cap": "regeneration_base",
    "recovery_cap": "recovery_base",
    "defense_cap": None,
    "max_endurance_cap": None,
    "max_endurance": None,
}

# The published per-archetype caps, as a percentage of that class's own base.
# Rounded to whole percent: the Arachnos classes author a higher base under the
# same absolute ceiling, which is why these are ratios and not raw values, and
# why the two of them land on 1667% / 476% rather than a round number.
_PUBLISHED_REGENERATION_CAP_PERCENT = {
    "scrapper": 3000, "stalker": 3000,
    "tanker": 2500, "brute": 2500,
    "blaster": 2000, "controller": 2000, "defender": 2000, "corruptor": 2000,
    "dominator": 2000, "mastermind": 2000, "sentinel": 2000,
    "peacebringer": 2000, "warshade": 2000,
    "arachnos_soldier": 1667, "arachnos_widow": 1667,
}
_PUBLISHED_RECOVERY_CAP_PERCENT = {
    "controller": 750, "dominator": 750, "mastermind": 750,
    "defender": 625,
    "blaster": 500, "corruptor": 500, "scrapper": 500, "sentinel": 500,
    "stalker": 500, "tanker": 500, "brute": 500,
    "peacebringer": 500, "warshade": 500,
    "arachnos_soldier": 476, "arachnos_widow": 476,
}

# Every mez attribute, none of which has an archetype ceiling to export: their
# AttribMax/AttribMaxMax rows are a flat 1.0 bound on the mez STATE, and
# protection is a negative summand into the same per-tick accumulation rather
# than a capped attribute. A key here appearing in the export means someone read
# that flat row as a cap (CAPS-1).
_MEZ_KEYS_THAT_MUST_NOT_EXIST = [
    "held_cap", "immobilized_cap", "stunned_cap", "sleep_cap",
    "terrorized_cap", "confused_cap", "afraid_cap", "mez_cap",
    "mez_protection_cap",
]


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


def _check_shape(archetype: str, attribs: dict) -> None:
    for cap_key, base_key in _CEILINGS.items():
        row = attribs.get(cap_key)
        assert isinstance(row, list) and len(row) == _LEVELS, (
            f"{archetype}: {cap_key} is {type(row).__name__} of "
            f"{len(row) if isinstance(row, list) else '—'} levels, expected a "
            f"{_LEVELS}-level row — the AttribMaxTable row did not reach the export"
        )
        assert all(v > 0 for v in row), (
            f"{archetype}: {cap_key} carries a non-positive ceiling — a zero "
            f"ceiling clamps the stat to zero, so it is a misread, not data"
        )
        if base_key is not None:
            base = attribs.get(base_key)
            assert isinstance(base, (int, float)) and base > 0, (
                f"{archetype}: {base_key} is {base!r} — the ceiling is an "
                f"absolute attribute value and means nothing without it"
            )


def _check_oracle(archetype: str, attribs: dict) -> None:
    for cap_key, base_key, published in (
        ("regeneration_cap", "regeneration_base", _PUBLISHED_REGENERATION_CAP_PERCENT),
        ("recovery_cap", "recovery_base", _PUBLISHED_RECOVERY_CAP_PERCENT),
    ):
        if archetype not in published:
            continue
        measured = round(attribs[cap_key][_LEVELS - 1] / attribs[base_key] * 100)
        assert measured == published[archetype], (
            f"{archetype}: {cap_key} reads {measured}% of base, the game "
            f"publishes {published[archetype]}% — the row is not the one the "
            f"game clamps against"
        )


def test_every_player_archetype_carries_every_ceiling():
    for dataset in ("homecoming", "rebirth", "thunderspy"):
        archetypes = _player_archetypes(dataset)
        assert len(archetypes) == 15, (
            f"{dataset}: {len(archetypes)} player archetypes, expected 15 — "
            f"the census cannot be read as coverage if the population moved"
        )
        for archetype, record in archetypes.items():
            _check_shape(f"{dataset}/{archetype}", record["attribs"])


def test_regeneration_and_recovery_reproduce_the_published_caps():
    for dataset in ("homecoming", "rebirth", "thunderspy"):
        graded = 0
        for archetype, record in _player_archetypes(dataset).items():
            if archetype in _PUBLISHED_REGENERATION_CAP_PERCENT:
                graded += 1
            _check_oracle(archetype, record["attribs"])
        assert graded >= 13, (
            f"{dataset}: only {graded} archetypes matched the published-cap "
            f"table — the oracle is grading almost nothing"
        )


def test_a_slid_row_fails_the_oracle():
    """Negative control. Reading one slot over lands on the neighbouring row,
    which is a plausible-looking curve — the oracle is what rejects it."""
    scrapper = _player_archetypes("homecoming")["scrapper"]["attribs"]
    slid = dict(scrapper)
    slid["regeneration_cap"] = scrapper["recovery_cap"]
    try:
        _check_oracle("scrapper", slid)
    except AssertionError:
        return
    raise AssertionError(
        "the oracle accepted the recovery row in the regeneration slot — it "
        "does not distinguish neighbouring rows and grades nothing"
    )


def test_a_missing_row_fails_the_shape_check():
    """Negative control for the other failure mode: a row that stops reaching
    the export reads as 'this archetype has no ceiling', not as an error."""
    scrapper = dict(_player_archetypes("homecoming")["scrapper"]["attribs"])
    scrapper.pop("defense_cap")
    try:
        _check_shape("scrapper", scrapper)
    except AssertionError:
        return
    raise AssertionError("a dropped ceiling row passed the shape check")


def test_the_to_hit_ceiling_is_per_level_and_fork_invariant():
    """It rises with level (0.95 at L1 to 2.0035 at L50), so exemplaring lowers
    it — carrying only the L50 scalar would be wrong below 50. And every player
    archetype of every fork authors the same curve, which is what makes a
    per-AT divergence a finding rather than noise."""
    curves = set()
    for dataset in ("homecoming", "rebirth", "thunderspy"):
        for archetype, record in _player_archetypes(dataset).items():
            row = record["attribs"]["to_hit_cap"]
            assert row[0] < row[_LEVELS - 1], (
                f"{dataset}/{archetype}: to_hit_cap is flat across levels — "
                f"the per-level row was collapsed to a scalar somewhere"
            )
            curves.add(tuple(round(v, 4) for v in row))
    assert len(curves) == 1, (
        f"{len(curves)} distinct ToHit ceiling curves across the three forks' "
        f"45 player archetypes — it was uniform when CAPS-1 was measured"
    )


def test_max_endurance_ceiling_sits_above_its_base_row():
    """Max endurance is HitPoints' shape, not ToHit's: the base is itself an
    AttribMaxTable row (a flat 100) and the ceiling is the AttribMaxMaxTable row
    over it (120 rising to 365). Reading one table for both would make the cap
    equal the base and silently forbid every +MaxEnd buff."""
    for dataset in ("homecoming", "rebirth", "thunderspy"):
        for archetype, record in _player_archetypes(dataset).items():
            attribs = record["attribs"]
            base, cap = attribs["max_endurance"], attribs["max_endurance_cap"]
            assert all(c > b for b, c in zip(base, cap)), (
                f"{dataset}/{archetype}: max_endurance_cap does not exceed "
                f"max_endurance at every level — both rows came from one table"
            )


def test_no_mez_ceiling_is_invented():
    """A deliberate absence, not an omission: the mez rows are a flat 1.0 bound
    on the mez STATE and protection has no per-archetype ceiling at all, so
    there is nothing here to export. See CAPS-1."""
    for dataset in ("homecoming", "rebirth", "thunderspy"):
        for archetype, record in _player_archetypes(dataset).items():
            present = [k for k in _MEZ_KEYS_THAT_MUST_NOT_EXIST
                       if k in record["attribs"]]
            assert not present, (
                f"{dataset}/{archetype} exports {present} — the mez rows are a "
                f"state bound, not a protection cap (CAPS-1)"
            )


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
    print(f"\nall {len(fns)} passed")


if __name__ == "__main__":
    _run()
