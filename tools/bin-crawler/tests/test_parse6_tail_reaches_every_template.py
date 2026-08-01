"""Regression guard for the Parse6 AttribMod tail's CONSUMPTION (WRAP-2).

`_read_parse6_template_tail` has decoded Rebirth's post-magnitude tail correctly
since 2026-07-20. For most of that time nothing read the result: WS7 inserted a
`if attribs == ["Power_Redirect"] and primary_str_list:` guard directly above the
block that consumed it, and the block — already at that indentation — became the
guard's body. So the suppress list, the FX record, the six tail bools (and with
them the whole second flags word), `BoostModAllowed`, the radii and
`ProcsPerMinute` were assigned on 235 of 81,913 exported templates and dropped on
the rest.

Nothing caught it because the fields did not go WRONG, they went ABSENT, and an
absent field on a fork is indistinguishable from a fork that authors none — the
same shape as TSPY-5 and WRAP-1. It was visible only by asking why Rebirth's
second flags word was empty corpus-wide (DATA-GAP WRAP-2).

Pinned by CENSUS against the two forks that read the same fields through
different code, because the failure is a return to zero and only counting sees
it. `ProcsPerMinute` is called out separately: it is a proc's headline input, and
Rebirth shipped its entire corpus without one.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_parse6_tail_reaches_every_template.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

_FORK_DIR = {"homecoming": "", "rebirth": "rebirth", "thunderspy": "thunderspy"}


def _powers(fork):
    base = os.path.join(_EXPORT, _FORK_DIR[fork])
    for root, _dirs, files in os.walk(base):
        rel = os.path.relpath(root, _EXPORT).split(os.sep)
        if fork == "homecoming" and rel[0] in ("rebirth", "thunderspy"):
            continue
        for name in files:
            if not name.endswith(".json"):
                continue
            try:
                with open(os.path.join(root, name)) as fh:
                    record = json.load(fh)
            except (OSError, ValueError):
                continue
            if isinstance(record, dict) and "full_name" in record:
                yield record


def _groups_and_templates(record):
    """(group, template) for every template, nested groups included.

    `child_effects` is the exported key; the dataclass's `child_groups` names
    nothing in the JSON and would grade the top level alone (DATA-GAP WALK-1).
    """
    def walk(groups):
        for group in groups or []:
            for template in group.get("templates") or []:
                yield group, template
            yield from walk(group.get("child_effects"))
    return walk(record.get("effects"))


def _census(fork):
    counts = {"templates": 0, "fx": 0, "suppress_events": 0, "ppm": 0,
              "flags2_raw": 0}
    for record in _powers(fork):
        for group, template in _groups_and_templates(record):
            counts["templates"] += 1
            for field in ("fx", "suppress_events", "flags2_raw"):
                if template.get(field):
                    counts[field] += 1
            if group.get("ppm"):
                counts["ppm"] += 1
    return counts


_FORKS = ("homecoming", "rebirth", "thunderspy")
_CENSUS = {fork: _census(fork) for fork in _FORKS}


def test_no_fork_is_empty_on_a_tail_field_every_fork_authors():
    """A field present on two forks and absent on the third is a reader gap.

    All three forks author suppress windows, per-template FX and PPM. Rebirth
    reaching zero on any of them means the tail block stopped being applied.
    """
    for field in ("fx", "suppress_events", "ppm"):
        empty = [fork for fork in _FORKS if _CENSUS[fork][field] == 0]
        assert not empty, (
            f"{field} is zero corpus-wide on {empty} while the other forks "
            f"carry it — the decoded tail is not reaching the template. "
            f"Census: { {f: _CENSUS[f][field] for f in _FORKS} }")


def test_rebirth_carries_procs_per_minute():
    """The headline case, called out because it is a calculation input.

    Rebirth shipped 0 PPM across 81,913 templates while Homecoming carried 380;
    every proc on the fork was scored without the rate it is named for.
    """
    assert _CENSUS["rebirth"]["ppm"] > 0, (
        "no Rebirth template carries a ProcsPerMinute — the Parse6 tail's "
        "group_extras are being dropped again")


def test_parse6_second_flags_word_is_read():
    """Rebirth's second flags word, the question WRAP-2 was opened to answer.

    Parse6 serializes it as individual bools rather than a packed word, two of
    which (`VanishEntOnTimeout`, `DoNotTintCostume`) are HC second-word bits. A
    corpus-wide zero here is what made the fork look like it authored no
    second-word keyword at all.
    """
    assert _CENSUS["rebirth"]["flags2_raw"] > 0, (
        "no Rebirth template carries flags2_raw — the tail bools are not "
        "reaching the flags words")


def test_rebirth_authors_no_copyboosts():
    """The other half of WRAP-2, pinned so a future decode has to argue with it.

    With the tail block restored the reader works — it names two second-word
    keywords on real templates — and `CopyBoosts` is still absent. Parse6 has no
    slot for it: the six-bool block is closed (the reader raises on leftover
    bytes), and `eval_flags`/`BoostModAllowed` are 0 on every wrapper attrib.
    The i24-era engine source agrees, containing no `CopyBoosts` at all.

    So Rebirth's zero is a property of the schema generation, not a gap. If this
    ever goes red, the fork gained the field and WRAP-2's conclusion needs
    revisiting — which is the point of asserting an absence.
    """
    carriers = [record["full_name"]
                for record in _powers("rebirth")
                for _g, template in _groups_and_templates(record)
                if "CopyBoosts" in (template.get("flags") or [])]
    assert not carriers, (
        f"{len(carriers)} Rebirth template(s) now carry CopyBoosts — Parse6 was "
        f"believed to have no slot for it. First few: {carriers[:5]}")


if __name__ == "__main__":
    import sys
    failures = 0
    for _name, _fn in sorted(globals().items()):
        if not _name.startswith("test_") or not callable(_fn):
            continue
        try:
            _fn()
            print(f"PASS {_name}")
        except AssertionError as exc:
            failures += 1
            print(f"FAIL {_name}: {exc}")
    sys.exit(1 if failures else 0)
