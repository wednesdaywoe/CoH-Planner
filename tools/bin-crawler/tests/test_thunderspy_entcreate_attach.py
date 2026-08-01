"""Regression guard for the structurally-attached Thunderspy EntCreate (WRAP-1 residue).

Thunderspy's summon pets used to reach the export through a byte-scan of the
whole effect element (`_extract_thunderspy_summons`), which split the element on
a Create_Entity marker and pulled the first entity-def-SHAPED string out of each
region. The Params union WRAP-1 opened carries the same pets as a real field, so
the scan is gone and the payload rides on the AttribMod that authored it.

Pinned by CENSUS rather than by example, because both failure modes are silent:

  - Re-stripping the payload (the hold-back this replaced) leaves a
    `Create_Entity` template with no `params` at all — which reads downstream as
    "this power summons nothing" rather than as an error.
  - Attaching the payload while the byte-scan still runs hands the converter
    every pet TWICE. That is not hypothetical: the pre-fix export carried 2,980
    `Create_Entity` templates against Homecoming's 1,626, exactly half of them
    with params and half stripped.

`test_mirage_names_its_entity_not_a_message_key` is the byte-scan's signature
failure kept as a live example: picking strings by shape means a message key or
a costume marker can win, and on Mirage it did — on a real player power, in two
archetypes, while every gate stayed green.

There is deliberately no "every entity_def resolves to an exported entity file"
guard here. It was written and dropped: the miss rate is ~30% on the pre-fix and
post-fix exports alike (442 vs 445), because it measures the export's PLAYER
category filter — critter pets have no file — and not the reader at all.
Narrowing it to player categories moves 5 misses to 2, which no honest threshold
separates. Mirage grades that defect instead, and goes red on the old export.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_thunderspy_entcreate_attach.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

_FORK_DIR = {"homecoming": "", "rebirth": "rebirth", "thunderspy": "thunderspy"}


def _powers(fork):
    """Every exported power record for `fork`."""
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


def _templates(record):
    """Every template in `record`, including those in nested effect groups.

    Nested groups serialize as `child_effects`; asking for the dataclass's
    `child_groups` here would walk the top level alone and silently grade 95%
    of the corpus (DATA-GAP WALK-1).
    """
    def walk(groups):
        for group in groups or []:
            yield from group.get("templates") or []
            yield from walk(group.get("child_effects"))
    return walk(record.get("effects"))


def _entity_templates(fork):
    """(power full_name, template) for every Create_Entity template in `fork`."""
    for record in _powers(fork):
        for template in _templates(record):
            if "Create_Entity" in (template.get("attribs") or []):
                yield record["full_name"], template


def test_every_create_entity_template_carries_params():
    """A Create_Entity template with no params names no pet at all.

    This is the hold-back's exact shape: the payload decoded, then was dropped
    on the floor to keep the byte-scan from double-counting.
    """
    stripped = [name for name, t in _entity_templates("thunderspy")
                if not t.get("params")]
    assert not stripped, (
        f"{len(stripped)} thunderspy Create_Entity template(s) carry no params "
        f"— the payload is being dropped again. First few: {stripped[:5]}")


def test_create_entity_count_is_in_family_with_the_other_forks():
    """Both readings running at once doubles the fork's pets.

    Graded as a ratio against the two forks that have only ever had one reading,
    so this stays meaningful as the corpus changes. Pre-fix thunderspy sat at
    1.83× Homecoming; the forks otherwise sit within 10% of each other.
    """
    counts = {fork: sum(1 for _ in _entity_templates(fork))
              for fork in ("homecoming", "rebirth", "thunderspy")}
    reference = counts["homecoming"]
    assert reference, "no Homecoming Create_Entity templates — export missing?"
    ratio = counts["thunderspy"] / reference
    assert 0.5 < ratio < 1.5, (
        f"thunderspy has {counts['thunderspy']} Create_Entity templates vs "
        f"Homecoming's {reference} ({ratio:.2f}×) — a ratio near 2 means the "
        f"byte-scan is emitting pets alongside the structural payload. "
        f"All counts: {counts}")


def test_mirage_names_its_entity_not_a_message_key():
    """The byte-scan's signature failure, kept as a live example.

    `MirageAttackerHit` is a message key that happens to be entity-def-shaped,
    so a scan choosing by shape picked it over the real `Pets_Mirage*` — on a
    player power, in two archetypes. Each variant has its own exported entity
    file, which is what makes the wrong name provable rather than merely odd.
    """
    found = {name: (t.get("params") or {}).get("entity_def")
             for name, t in _entity_templates("thunderspy")
             if name.endswith("Illusion_Control.Mirage")}
    assert found, "no thunderspy Illusion Control Mirage found in the export"
    for full_name, entity_def in found.items():
        assert entity_def and entity_def.startswith("Pets_Mirage"), (
            f"{full_name} summons {entity_def!r} — expected a Pets_Mirage* "
            f"entity, not a message key")


def test_redirects_survive_on_the_entity_template():
    """`resolvePetLifespan` reads redirects off the Create_Entity template.

    They are authored on a SIBLING AttribMod's Power payload, so dropping the
    cross-element carry in `_attach_thunderspy_redirects` would empty this
    silently — the field would simply stop existing rather than go wrong.

    Unlike the three above, this one does NOT go red against the pre-fix export:
    the byte-scan found the same names by proximity, so it guards the forward
    direction only.
    """
    redirects = [r for _n, t in _entity_templates("thunderspy")
                 for r in ((t.get("params") or {}).get("redirects") or [])]
    assert redirects, (
        "no thunderspy Create_Entity template carries redirects — the sibling "
        "Power payload is no longer being carried onto the pet's template")


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
