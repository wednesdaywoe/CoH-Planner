"""Export-side guard for the AttribMod `type` -> atom `attribType` mapping (ATTRTYPE-1).

The parser decodes four `ATTRIB_MOD_TYPE` values — Duration, Magnitude, Constant,
Expression (`_enums.py`, verified against the Ghidra keyword table) — and the
converter's `mapAttribType` is supposed to map all four onto the atom's
`attribType`. It used to map three and fall through, folding `Constant` onto
`Magnitude`:

    return 'Magnitude'; # Magnitude, Constant, undefined

That is the STACK-3 shape — a soft default in a converter turning a parse fact
into plausible data.

What this grades: **every template `type` in the export is one of the four.** An
unmapped value is the defect's own shape — a parse fact the converter would have
to fold or guess at — so membership here IS the assertion (the STACK-3
`Unknown(...)` census, run the other way). It catches a parser that starts
emitting a fifth `ATTRIB_MOD_TYPE` spelling, which `mapAttribType`'s throw then
turns into a loud regen failure (Rule 1) rather than a silent fold.

The converter-side half of the fix — that `Constant` actually maps and the fold
is retired — is graded directly on `mapAttribType` in
`src/data/atomic-effect.test.ts`; this leg is the export census that proves no
template in the corpus would ever reach that mapper with an unlisted spelling.

A second census pins where `Constant` is allowed to LAND. The engine reads a
`kModType_Constant` mod off the template's own two numbers and never touches the
modifier table (`mod_Fill`, `Common/entity/attribmod.c:1074`; the client's
power-info window agrees at `Game/src/UI/uiPowerInfo.c:130`, computing
`scale x table` and discarding it). Every reader downstream that resolves a
`scale x table` product is therefore wrong for such a row, and the display side
(`GrantedQuantity::MezConstant`) refuses to state a number rather than guess one.
That refusal is only affordable while the MEZ population is empty, which it is.
Be precise about which claim is doing the work: the 4,746 `Constant` templates sit
on meta attribs -- `Set_Mode` (2,636), `Set_Costume` (1,125), `Power_Redirect`,
`Grant_Power`, `Token_Add` -- and they DO become atoms, 1,296 `effectType: Meta`
rows across the shipped datasets. ATTRTYPE-1 claimed they never become atoms and
that was wrong. What is true, and all the display needs, is that none of them
lands on a MEZ attrib. This leg fails the day one does, which is the day someone
has a real row to resolve it against.

The parser's table is also one member SHORT of the engine's: `ModTypeEnum`
(`Common/entity/attribmod.h:524`) carries a fifth, `kSkillMagnitude`. Zero
templates use it across all four forks, and a `type` of 5 would decode as
`Unknown(5)` and red the first census above rather than fold, so this is recorded
rather than fixed.

Reads the committed `exported_powers/` trees only — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_attrib_type.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json

_REPO = _os.path.normpath(_os.path.join(_os.path.dirname(__file__), "..", "..", ".."))
# Prune the nested fork trees (rebirth / thunderspy / brainstorm) when walking the
# root dataset's export, so the root census doesn't double-count a nested fork.
_FORK_ROOTS = {_os.path.join(_REPO, "exported_powers", fork)
               for fork in _forks.NESTED_DIRS}

# The four members of the parser's ATTRIB_MOD_TYPE. Anything outside this set is
# the defect's shape: a parse fact the converter would have to fold into plausible
# data. Membership here IS the assertion.
ATTRIB_MOD_TYPE = {"Duration", "Magnitude", "Constant", "Expression"}

# The attribs a mez template lands on. Spelled here rather than read from the
# converter's routing map, so the two are independent: a converter that re-routed a
# sub-type reds instead of agreeing with itself. Measured across all four forks --
# Thunderspy respells elsewhere (`bridge_tspy_vocab.rs`) but writes these same names
# in `attribs`, and the coverage floor below fails rather than passes vacuously if
# that ever stops being true.
MEZ_ATTRIBS = {
    "Held", "Immobilized", "Stunned", "Sleep", "Confused", "Terrorized", "Afraid",
    "Knockback", "Knockup", "Repel", "Taunt", "Placate",
}


def _templates(power):
    """Every template in a power, walking nested `child_effects` too.

    The export serialises nested groups as `child_effects`; walking the parser's
    dataclass key `child_groups` silently grades nothing, so the walk follows the
    exported shape.
    """
    def walk(groups):
        for group in groups:
            for template in group.get("templates") or []:
                yield template
            yield from walk(group.get("child_effects") or [])
    yield from walk(power.get("effects") or [])
    yield from walk(power.get("activation_effects") or [])


def _powers(fork):
    """Every power JSON in one fork's tree, excluding the nested fork trees."""
    root = _forks.FORKS[fork]
    for path, dirs, files in _os.walk(root):
        if path == root:
            dirs[:] = [d for d in dirs
                       if _os.path.join(path, d) not in _FORK_ROOTS]
        for name in sorted(files):
            if not name.endswith(".json"):
                continue
            with open(_os.path.join(path, name)) as f:
                try:
                    power = json.load(f)
                except ValueError:
                    continue
            if isinstance(power, dict) and "effects" in power:
                yield power


def _census(fork):
    bad = []
    for power in _powers(fork):
        for template in _templates(power):
            ty = template.get("type")
            if ty not in ATTRIB_MOD_TYPE:
                bad.append((power["full_name"], repr(ty)))
    return bad


def _mez_census(fork):
    """`(constant-typed mez templates, per-attrib template counts)` in one fork."""
    landed, seen = [], {a: 0 for a in MEZ_ATTRIBS}
    for power in _powers(fork):
        for template in _templates(power):
            hit = MEZ_ATTRIBS.intersection(template.get("attribs") or [])
            if not hit:
                continue
            for attrib in hit:
                seen[attrib] += 1
            if template.get("type") == "Constant":
                landed.append((power["full_name"], sorted(hit)))
    return landed, seen


def test_every_template_type_maps_to_the_four_member_vocabulary():
    """No template `type` falls outside the parser's four `ATTRIB_MOD_TYPE`
    values — an unmapped value is the STACK-3 shape, a parse fact the converter
    would fold into plausible data.
    """
    bad = []
    for fork in _forks.FORKS:
        bad.extend(_census(fork))
    assert not bad, f"{len(bad)} templates with an unmapped attrib type, first 5: {bad[:5]}"


def test_no_constant_template_lands_on_a_mez_attrib():
    """`Constant` stays off the mez attribs.

    A `kModType_Constant` mod takes both its numbers off the template and never
    reads the modifier table, so `scale x table` -- the product every mez reader
    resolves -- is precisely the number the engine discards for it. The display
    refuses to state a value for such a row (`GrantedQuantity::MezConstant`), and
    that refusal is only affordable while nothing lands here.

    Floored on both sides, PER ATTRIB rather than in total: an empty `landed`
    proves nothing about an attrib the walk never found, and a lump floor cannot
    see that -- drop `Held` and `Immobilized` from the set and 8,516 templates
    still answer for Homecoming, which is a dominant subpopulation hiding the
    mutant. So every member has to be observed somewhere, and a respelling that
    silently empties one reds here.
    """
    landed, missing = [], {a: [] for a in MEZ_ATTRIBS}
    for fork in _forks.FORKS:
        hits, seen = _mez_census(fork)
        landed.extend((fork, *hit) for hit in hits)
        for attrib, count in seen.items():
            if not count:
                missing[attrib].append(fork)
    absent = {a: f for a, f in missing.items() if f}
    assert not absent, (
        f"MEZ_ATTRIBS names {len(absent)} attribs a fork does not use, so the census "
        f"is blind there -- a per-fork respelling (the Thunderspy shape), or a set "
        f"member that was never right: {absent}"
    )
    assert not landed, (
        f"{len(landed)} Constant-typed mez templates; the display cannot resolve one "
        f"and now has a real row to be built against, first 5: {landed[:5]}"
    )


if __name__ == "__main__":
    total = 0
    for fork in sorted(_forks.FORKS):
        bad = _census(fork)
        hits, seen = _mez_census(fork)
        total += len(bad)
        print(f"{fork}: {len(bad)} unmapped attrib types, {len(hits)} constant mez "
              f"of {sum(seen.values())} mez templates over {len(MEZ_ATTRIBS)} attribs "
              f"({sum(1 for c in seen.values() if not c)} unseen)")
    test_every_template_type_maps_to_the_four_member_vocabulary()
    test_no_constant_template_lands_on_a_mez_attrib()
    print(f"OK ({total} unmapped)")
