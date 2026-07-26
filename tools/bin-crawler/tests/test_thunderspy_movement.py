"""Regression guard for Thunderspy `Ones`-front movement-attrib recovery (TSPY-2).

Thunderspy encodes movement MAGNITUDE attribs (JumpHeight, JumpingSpeed,
MovementFriction, ...) with a catch-all `['Ones']` FRONT on a `*_Ones` unit
table; the real modified stat is named only in the AttribMod's own INDEX array
(the element front is a group-level category token — see
`_parse_effect_template_thunderspy` in `parser/_powers.py`). The parser
historically left these as a bare `['Ones']`, so e.g. Combat Jumping's jumpHeight
was invisible downstream (DATA-GAP-REGISTER TSPY-2).

This asserts the recovered shape from the COMMITTED `exported_powers/` (the direct
parser output, git-tracked) so a future re-export can't silently undo the fix
(GAME-DATA-PRINCIPLES §9). It reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_thunderspy_movement.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_TSPY_EXPORT = os.path.join(_REPO, "exported_powers", "thunderspy")


def _load(rel_path: str) -> dict:
    with open(os.path.join(_TSPY_EXPORT, rel_path)) as f:
        return json.load(f)


def _templates(power: dict):
    for effect in power["effects"]:
        for template in effect["templates"]:
            yield template


def test_combat_jumping_recovers_jumpheight():
    """The 2.0 `Ones`-front `Melee_Ones` template on Combat Jumping is really
    JumpHeight (HC names it `JumpHeight`, Melee_Ones, scale 2.0). The recovery
    relabels the front from the index array; the scale is already correct, so no
    magnitude recovery is needed — a pure relabel."""
    cj = _load(os.path.join("pool", "leaping", "combat_jumping.json"))
    jump = [t for t in _templates(cj) if "JumpHeight" in t["attribs"]]
    assert jump, (
        "Combat Jumping has no JumpHeight template — the `Ones`-front movement "
        "attrib was not recovered from the index array (TSPY-2)"
    )
    t = jump[0]
    assert t["attribs"] == ["JumpHeight"], t["attribs"]
    assert t["table"] == "Melee_Ones", t["table"]
    assert t["scale"] == 2.0, t["scale"]
    # No phantom `['Ones']` movement template should remain on Melee_Ones.
    leftover = [t for t in _templates(cj)
                if t["attribs"] == ["Ones"] and t["table"] == "Melee_Ones"]
    assert not leftover, "a bare ['Ones'] Melee_Ones template still remains"


def test_combat_jumping_recovers_movementcontrol():
    """Thunderspy also fronts MovementControl with the invalid label `['Control']`
    (not a real CoH attrib — absent from ATTRIB_NAME), naming the real stat only in
    the canonical index array — the SAME shape as the `Ones`-front recovery, just a
    different bogus front. Rebirth (also Parse6) decodes the identical
    `Melee_Control` 10.0 template as `MovementControl`. So `['Control']` + a lone
    `MovementControl` index attrib relabels to it; scale/table are already correct
    (a pure relabel). Corpus-wide 338 tspy templates carry this shape (DATA-GAP
    TSPY-2 deferred item)."""
    cj = _load(os.path.join("pool", "leaping", "combat_jumping.json"))
    mc = [t for t in _templates(cj) if "MovementControl" in t["attribs"]]
    assert mc, (
        "Combat Jumping has no MovementControl template — the `Control`-front "
        "movement attrib was not recovered from the index array (TSPY-2)"
    )
    t = mc[0]
    assert t["attribs"] == ["MovementControl"], t["attribs"]
    assert t["table"] == "Melee_Control", t["table"]
    assert t["scale"] == 10.0, t["scale"]
    # No phantom `['Control']` template should remain — `Control` is not a valid
    # attrib and would convert to an `Unmapped` atom, losing the movementControl.
    leftover = [t for t in _templates(cj) if t["attribs"] == ["Control"]]
    assert not leftover, "a bare ['Control'] template still remains"


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
