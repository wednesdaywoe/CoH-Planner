"""Regression guard for the special-attrib BAND BASE calibration.

The band's base is not a constant of the format — it is
`sizeof(CharacterAttributes)`, so a fork that adds one attrib to that struct
slides the whole band up 4 and every name in it becomes its neighbour's.
Thunderspy did exactly that on 2026-07-30 by appending `ReflectDamage`:

    Create_Entity 465 -> 469    Drop_Toggles 476 -> 480
    Grant_Power   477 -> 481    Revoke_Power 478 -> 482

Nothing in powers.bin announces it (the header checksum is content-derived and
`_detect_format` still passes, because the LAYOUT did not change — only the
struct's size), so the base is calibrated from the corpus instead.

Two things make this worth a guard rather than a constant bump:

  * the failure was SILENT and plausible — a summon read `Set_Mode` instead of
    `Create_Entity`, which looks like data rather than a bug;
  * the base has THREE consumers, and the third one DELETES. The special map and
    the collapsed 4-aligned view in `ATTRIB_NAME_THUNDERSPY` merely rename, but
    `_TSPY_CREATE_ENTITY_MARKER` drives a byte-scan that decides which templates
    EXIST — a stale marker matched nothing and silently dropped 2,523 summon
    templates. Fixing any one or two of the three leaves a corrupt export that
    still looks self-consistent.

Pure-function test (no .bin / .pigg needed). Run directly:
    python3 tools/bin-crawler/tests/test_special_attrib_band_base.py
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from bin_crawler.parser import _powers  # noqa: E402
from bin_crawler.parser._enums import (  # noqa: E402
    SPECIAL_ATTRIB_BAND,
    SPECIAL_ATTRIB_CREATE_ENTITY,
    select_special_attrib_base,
    special_attrib_table,
    thunderspy_attrib_table,
)


def _corpus(base, weights=((1, 2523), (13, 2606), (14, 1818), (12, 170))):
    """A synthetic index-array histogram for a build whose band sits at `base`.

    Offsets/counts mirror the real Thunderspy corpus (Create_Entity,
    Grant_Power, Revoke_Power, Drop_Toggles), plus the 4-aligned normal attribs
    that dominate any real corpus and must not sway the vote.
    """
    hist = {i * 4: 500 for i in range(0, 88)}
    for off, n in weights:
        hist[base + off] = n
    return hist


def test_calibrates_each_generation():
    """The two struct generations seen in the wild are told apart."""
    assert select_special_attrib_base(_corpus(464)) == 464
    assert select_special_attrib_base(_corpus(468)) == 468


def test_normal_attribs_do_not_sway_the_vote():
    """Only byte-granular raws are evidence; the 4-aligned majority is ignored.

    Both bases 'cover' most 4-aligned values equally, so counting them would
    make the score nearly base-independent.
    """
    only_normals = {i * 4: 10_000 for i in range(0, 116)}
    # No band evidence at all -> falls back to the default rather than guessing.
    assert select_special_attrib_base(only_normals) == 464
    # One band raw is enough to decide, even buried under 1.16M normal uses.
    assert select_special_attrib_base({**only_normals, 469: 1}) == 468


def test_decided_by_the_bottom_edge_not_by_coverage():
    """The case that broke the first implementation.

    The band is 44 wide, so sliding it 4 leaves nearly every value inside either
    window: on the real 2026-07-30 corpus the two bases score 99.965% vs 99.988%
    coverage — a 0.02pp margin, which is noise, and the wrong base won on the
    equivalent synthetic corpus. Here EVERY unaligned raw sits inside both
    windows, so coverage cannot separate them at all; only the bottom edge can.
    """
    both_windows = {469: 2523, 481: 2606, 482: 1818, 473: 604}
    assert all(464 <= v < 464 + 44 and 468 <= v < 468 + 44 for v in both_windows)
    assert select_special_attrib_base(both_windows) == 468

    # And the mirror: the same shape one group lower must give 464.
    assert select_special_attrib_base({465: 2523, 477: 2606, 478: 1818}) == 464


def test_a_stray_low_raw_cannot_drag_the_base_down():
    """A single unsupported value must not outvote the band's real population."""
    corpus = _corpus(468)
    corpus[465] = 1  # one stray in the group below
    assert select_special_attrib_base(corpus) == 468


def test_unknown_generation_raises_instead_of_guessing():
    """A third generation must fail loud, not silently pick the nearest band.

    This is the mutation that proves the gate can go red: shift the band far
    enough that neither candidate window contains it.
    """
    try:
        select_special_attrib_base(_corpus(600))
    except ValueError as e:
        assert "CharacterAttributes" in str(e)
        assert "601" in str(e)  # names the most-used unnamed raw
    else:
        raise AssertionError("a band at 600 must raise, not resolve to a "
                             "candidate base")


def test_band_names_shift_together():
    """Re-anchoring renames the whole band by exactly one slot."""
    t464, t468 = special_attrib_table(464), special_attrib_table(468)
    assert t464[465] == "Create_Entity" and t468[469] == "Create_Entity"
    assert t464[477] == "Grant_Power" and t468[481] == "Grant_Power"
    assert t464[478] == "Revoke_Power" and t468[482] == "Revoke_Power"
    # The old reading of the new build's raws: the neighbour's name, not an error.
    assert t464[469] == "Set_Mode"
    assert t464[481] == "Power_Chance_Mod"


def test_collapsed_view_moves_with_the_band():
    """`ATTRIB_NAME_THUNDERSPY`'s top entries are the band's 4-aligned view.

    The index-array reader tries that table FIRST, so a band raw that happens to
    be 4-aligned is named from there. Leaving it behind is what still mislabeled
    866 powers after the special map alone had been re-anchored.
    """
    t464, t468 = thunderspy_attrib_table(464), thunderspy_attrib_table(468)
    assert t464[116] == "Create_Entity"
    assert t468[117] == "Create_Entity"
    assert t468.get(116) is None
    # Normal attribs below the band are untouched — the corpus shows their raw
    # counts unchanged across the 2026-07-30 build.
    for i in (0, 50, 87, 115):
        assert t464.get(i) == t468.get(i), f"normal index {i} must not move"


def test_summon_marker_is_derived_from_the_base():
    """The deleting consumer. A literal here is the bug that dropped 2,523
    templates; it must follow the base automatically."""
    for base in (464, 468):
        _powers._set_tspy_band_base(base)
        assert _powers._TSPY_CREATE_ENTITY_MARKER == base + SPECIAL_ATTRIB_CREATE_ENTITY
        assert (_powers._TSPY_SPECIAL_BY_RAW[_powers._TSPY_CREATE_ENTITY_MARKER]
                == "Create_Entity")
        assert _powers._TSPY_ATTRIB_NAME[base // 4] == "Create_Entity"
    _powers._set_tspy_band_base(464)  # restore the default


def test_band_is_contiguous_and_unique():
    assert len(set(SPECIAL_ATTRIB_BAND)) == len(SPECIAL_ATTRIB_BAND)
    assert SPECIAL_ATTRIB_BAND[SPECIAL_ATTRIB_CREATE_ENTITY] == "Create_Entity"


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            try:
                fn()
                print(f"PASS {name}")
            except Exception as exc:  # noqa: BLE001
                failures += 1
                print(f"FAIL {name}: {exc}")
    print(f"\n{'all passed' if not failures else f'{failures} FAILED'}")
    sys.exit(1 if failures else 0)
