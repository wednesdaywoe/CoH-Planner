"""Guard for ENT-1 and ENT-2: `commandable_pet` is READ from the villaindef tail,
not guessed from the character class name — and the tail is only reachable by
reading `levels` at each file's own element width.

`_entities.py` could not place the block after `levels`, so it read most of it
as anonymous "zero" slots and inferred `commandable_pet`/`can_zone` from
`"henchman" in character_class_name` — a game proper noun in parser logic,
standing in for a field that was in the bytes the whole time. The block is
`ParseVillainDef[]` (`Common/gameComm/VillainDef.c:165`) read straight down; the
old walk was two slots out because it counted the two `TOK_REDUNDANTNAME` reward
aliases as fields of their own. `PetCommandability` is authoritative — the
server assigns it verbatim (`MapServer/src/entity/character_pet.c:569`).

Why the guard is shaped this way. The heuristic was not merely imprecise: it was
wrong on 193 of Homecoming's 205 commandable pets, missing every Lore pet (whose
classes are named for the faction, not the tier) and overclaiming 17 that merely
have "henchman" in the class string. So a census of the count alone cannot tell
a read from a guess — a guess that happens to produce 205 rows would pass. What
separates them is DISAGREEMENT with the class name, asserted in both directions:

  * commandable entities whose class says nothing about henchmen, and
  * "henchman"-classed entities that are not commandable.

Reinstating the heuristic drives both populations to zero, which is the only
thing this test cares about. The vacuity floors are deliberately low (the point
is "not zero", not a pinned count) so a legitimate data patch does not turn it
red, and the shipped totals are recorded in the register rather than here.

All three forks are graded the same way since 2026-08-04. Rebirth was the last
holdout — its VillainDef.bin is Parse6 and the tail sits past a `levels` block
that had never been decoded — and it was carried here as a declared deviation,
asserted to match the class name EXACTLY so that decoding Parse6 would turn the
assertion red rather than let the entry rot. That is what happened, and the test
it tripped is gone with the deviation.

`levels` is graded alongside, in `test_the_level_element_width_is_read_per_file`,
because it is the same read: reaching the tail at all means having consumed the
`levels` array at the right element width, and that width is the one thing about
this record that genuinely forks.

Reads committed JSON plus two synthetic in-memory buffers — no .bin / .pigg
needed. The synthetic pair exists because mutation testing found two guards in
the parser that the real corpus cannot exercise at all: on correct data the
element width is right, so both the residue check and the ambiguity check are
tripwires for a state no shipped file is in. Removing either stays green against
all three forks. They are graded by construction instead — the sixth time this
project has met "a corpus cannot grade a scope it never violates."

Run directly:  python3 tools/bin-crawler/tests/test_entity_commandability.py
or under pytest (functions are named test_*).
"""
from __future__ import annotations

import json
import struct
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
EXPORTED = REPO_ROOT / "exported_powers"

sys.path.insert(0, str(REPO_ROOT / "tools" / "bin-crawler"))

sys.path.insert(0, str(Path(__file__).resolve().parent))
import _forks  # derived dataset roster; see test_export_roster.py

# Which forks this grades. Brainstorm exports entities too but has no row in
# LEVEL_INTS, so widening this needs its element width measured first (ENT-17).
DECODED_FORKS = ("homecoming", "rebirth", "thunderspy")

# Paths derived, so the root/nested split stays a fact about the tree rather
# than a literal that a fourth dataset silently invalidates.
ENTITY_DIRS = {fork: Path(_forks.FORKS[fork]) / "entities" for fork in DECODED_FORKS}

# Homecoming widened `ParseVillainLevelDef`'s `Level` into a range and writes two
# leading ints; the forks keep the stock i24 single `Level` and write one. This
# does NOT track the container — Thunderspy ships a Parse7 villaindef over the
# one-int element, which is exactly why the width is detected per file.
LEVEL_INTS = {"homecoming": 2, "rebirth": 1, "thunderspy": 1}


def load(fork: str) -> list[dict]:
    directory = ENTITY_DIRS[fork]
    entities = [
        json.loads(path.read_text())
        for path in sorted(directory.glob("*.json"))
        if path.name != "_export_manifest.json"
    ]
    assert entities, f"{directory} has no entity JSON — nothing to grade"
    return entities


def class_says_henchman(entity: dict) -> bool:
    return "henchman" in (entity.get("defaults", {}).get("character_class_name") or "").lower()


def test_commandability_disagrees_with_the_class_name_in_both_directions():
    """The read-vs-guess separator. Both populations are empty under the
    heuristic and non-empty under a real read."""
    for fork in DECODED_FORKS:
        entities = load(fork)
        commandable = [e for e in entities if e.get("commandable_pet")]
        assert commandable, f"{fork}: no commandable entity at all — the field is not reaching the export"

        unnamed = [e for e in commandable if not class_says_henchman(e)]
        assert len(unnamed) > 50, (
            f"{fork}: only {len(unnamed)} commandable entities have a class that does not say "
            f"'henchman'. Under the old heuristic this is 0 by construction. A collapse here "
            f"means commandability is being guessed from the class name again."
        )

        overclaimed = [e for e in entities if class_says_henchman(e) and not e.get("commandable_pet")]
        assert overclaimed, (
            f"{fork}: every 'henchman'-classed entity is commandable. The binary says some are "
            f"not (cosmetic poses, pseudo-pets), so this is the heuristic's signature."
        )


def test_the_decoded_tail_lands_where_the_parse_table_says():
    """Alignment oracle. A walk one slot over still yields plausible-looking
    booleans, so the check is on fields whose CONTENT is self-evidently right:
    `rank` is a small enum the old walk never assigned at all, and every entity
    resolves a real `DEFS/...VILLAIN` source path from the string table."""
    for fork in DECODED_FORKS:
        entities = load(fork)
        ranks = {e.get("defaults", {}).get("rank") for e in entities}
        assert ranks - {0}, f"{fork}: every rank is 0 — `rank_raw` is declared but never assigned"
        assert all(isinstance(r, int) and 0 <= r < 64 for r in ranks), (
            f"{fork}: rank values {sorted(ranks)} are not a small enum — the walk is misaligned"
        )

        sources = [e.get("source_file", "") for e in entities]
        named = [s for s in sources if s]
        assert len(named) > len(entities) // 2, (
            f"{fork}: only {len(named)}/{len(entities)} entities resolved a source path — a "
            f"misaligned string read yields empty or garbage offsets"
        )
        assert all(s.upper().startswith("DEFS/") for s in named), (
            f"{fork}: source paths are not DEFS/-rooted, e.g. {named[:3]}"
        )


def test_the_level_element_width_is_read_per_file():
    """`max_level` exists only where the schema has it.

    The failure this pins is not a missing field but a SHIFTED one. Read a fork's
    one-int element as Homecoming's two-int range and the display-names COUNT
    lands in `max_level` — a small plausible integer, on a field nothing reads,
    while the reader that consumed it goes on to take the first display name for
    an array count. It shipped that way: 5,139 Thunderspy level elements had
    `display_names` AND `costumes` emptied by the recovery that papered over it,
    every one of them an element with a count other than 1.

    So the assertion is the schema fact itself: `max_level` is non-null on every
    Homecoming element and null on every fork one. That is sharply gradeable —
    before the fix, Thunderspy shipped `max_level: 1` on all 33,102 elements
    (the display-names count) and Rebirth shipped a synthesized 1-50 on all 619.

    WHAT THIS CANNOT GRADE, because the tree it reads is the pet-filtered subset:
    the emptied display names. Every one of those 5,139 Thunderspy elements is an
    NPC outside `PET_PREFIXES`, and in the shipped scope both forks have exactly
    zero elements with more than one display name — so a guard asserting that
    population would be red on correct data, not on the bug. Only the width claim
    survives here; the damage itself is graded by the census in the register.
    """
    for fork in DECODED_FORKS:
        entities = load(fork)
        elements = [level for e in entities for level in e.get("levels", [])]
        assert elements, f"{fork}: no level elements at all"

        widened = [L for L in elements if L.get("max_level") is not None]
        if LEVEL_INTS[fork] == 2:
            assert len(widened) == len(elements), (
                f"{fork}: {len(elements) - len(widened)} of {len(elements)} level elements have a "
                f"null max_level, but this fork writes the two-int range on every one."
            )
        else:
            assert not widened, (
                f"{fork}: {len(widened)} level elements carry a max_level, but this fork's "
                f"`ParseVillainLevelDef` has only `Level`. A non-null value here is the "
                f"display-names count read one slot early — the whole element is shifted."
            )

        assert all(L.get("display_names") for L in elements), (
            f"{fork}: some level element has NO display name. That is what the deleted "
            f"`except ValueError` produced when the element shape was wrong."
        )


def _villaindef(level_element: bytes) -> bytes:
    """A minimal Parse7 villaindef holding one record with one levels element.

    Enough of the container for `detect_level_ints` to walk: header, an empty
    string table, then `[block_size][count][rec_len][record]`. The record is
    `ParseVillainDef[]` down to `Power` — seven strings and two u4s, every one
    zero — followed by the levels struct_array carrying `level_element`.
    """
    u4 = lambda *v: struct.pack(f"<{len(v)}I", *v)
    record = u4(0, 0, 0, 0, 0, 0, 0, 0)      # name..villain_group (strings are offsets)
    record += u4(0)                           # powers struct_array: count 0
    record += u4(1, len(level_element)) + level_element
    block = u4(1) + u4(len(record)) + record  # record_count, rec_len, record
    block = u4(len(block) + 4) + block        # data_block_size prefix
    return b"CrypticS" + u4(0) + struct.pack("<H", 6) + b"Parse7" + u4(0) + block


def test_a_level_element_that_underconsumes_is_refused():
    """The residue check, graded by construction.

    Mutation M4 removes `if r.remaining(): raise` from the element reader and
    every fork still exports clean, because a correctly-detected width consumes
    exactly and the branch is never taken. The state it guards is a wrong width
    that UNDER-consumes rather than overrunning — no shipped file is in it, so
    only a built case can grade it.

    Five zero-ish words: read with one leading int that is `level=0`, an empty
    display-names array, an empty costumes array and `xp` — four words, leaving a
    fifth. Under two leading ints it consumes all five.
    """
    from bin_crawler.parser._entities import _make_level_sub
    from bin_crawler.parser._reader import BinReader

    element = struct.pack("<5I", 0, 0, 0, 0, 0)
    reader = lambda: BinReader(element, _string_table=(0, memoryview(b"")), _offset=0,
                               _length=len(element))

    _make_level_sub(2)(reader())  # the width this element is: consumes all 20 bytes

    try:
        _make_level_sub(1)(reader())
    except ValueError as exc:
        assert "left over" in str(exc), f"raised, but not about residue: {exc}"
    else:
        raise AssertionError(
            "a level element read 4 bytes short returned a record instead of raising. "
            "The residue check in `_make_level_sub` is what turns a wrong element width "
            "into a parse failure rather than a plausible one."
        )


def test_an_undecidable_villaindef_is_refused_rather_than_guessed():
    """The ambiguity check, graded by construction.

    Mutation M7 replaces `if len(fits) != 1: raise` with first-fit and stays green,
    because exactly one width ever fits a real file. Both branches it guards are
    buildable:

      * BOTH fit — `[0, 1, 0, 0, 0]`. One leading int reads `level=0` and a
        one-element display-names array whose single entry is the next word, then
        empty costumes and `xp`: five words. Two leading ints read `level=0`,
        `max=1`, then three empty/zero fields: also five words. The element is
        genuinely ambiguous, and first-fit would silently answer 1.
      * NEITHER fits — a stub too short for either width.
    """
    from bin_crawler.parser._entities import detect_level_ints, _parse_power_sub
    from bin_crawler.parser._reader import open_parse7

    # Positive control first: the negative cases below all assert that detection
    # RAISES, and a `_villaindef` that built an unreadable container would raise
    # too — for the wrong reason, with both tests still green. These prove the
    # helper builds something the detector can actually read and decide.
    for expected, element in ((1, struct.pack("<4I", 7, 0, 0, 0)),
                              (2, struct.pack("<5I", 7, 9, 0, 0, 0))):
        got = detect_level_ints(_villaindef(element), open_parse7, _parse_power_sub)
        assert got == expected, (
            f"a hand-built {expected}-int element was detected as {got}-int — the detector is "
            f"not reading width off the element, so the refusals below prove nothing."
        )

    for label, element in (
        ("both widths fit", struct.pack("<5I", 0, 1, 0, 0, 0)),
        ("neither width fits", struct.pack("<3I", 0, 0, 0)),
    ):
        data = _villaindef(element)
        try:
            chosen = detect_level_ints(data, open_parse7, _parse_power_sub)
        except ValueError as exc:
            assert "undecidable" in str(exc), f"{label}: raised, but not about ambiguity: {exc}"
        else:
            raise AssertionError(
                f"{label}: detect_level_ints answered {chosen} instead of refusing. A width "
                f"picked from an ambiguous file is a guess, and it would be wrong silently "
                f"on every record after it."
            )


if __name__ == "__main__":
    test_commandability_disagrees_with_the_class_name_in_both_directions()
    test_the_decoded_tail_lands_where_the_parse_table_says()
    test_the_level_element_width_is_read_per_file()
    test_a_level_element_that_underconsumes_is_refused()
    test_an_undecidable_villaindef_is_refused_rather_than_guessed()
    print("OK — entity commandability is read from the tail on all three forks, "
          "the levels element is read at each file's own width, and both parser "
          "tripwires the corpus cannot exercise are graded by construction.")
