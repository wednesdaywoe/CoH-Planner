"""Regression guard for Thunderspy AttribMod TYPING recovery (TSPY-3).

Thunderspy's AttribMod carries the canonical typing block — aspect / application /
type / target — in HC's Parse7 field order, at fixed offsets immediately BEFORE the
modifier-table string the parser locates by scanning (aspect ÷8 at table−20,
application at −16, type at −12, target at −8). This was long thought to be "left
all-zero" only because the earlier parser looked at the element-header words after
the chance (the group's PPM + Delay), never at the pre-table block. `_parse_effect_
template_thunderspy` now reads it (see `parser/_powers.py`), so ~95% of tspy
templates carry a real aspect/target/type instead of blank — which is what lets the
atom-native calc stop falling back to the transitional bag for Thunderspy.

This asserts the recovered typing from the COMMITTED `exported_powers/` (the direct
parser output, git-tracked), so a future re-export can't silently drop it. It reads
only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_thunderspy_typing.py
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


def test_foe_attack_damage_is_typed():
    """A foe attack's damage template types as aspect=Absolute (base damage),
    type=Magnitude, target=AnyAffected — the HC/Rebirth shape for any damage row.
    Hail of Bullets (Blaster / Dual Pistols) is the stable example.

    The selector reads the real per-type damage attrib rather than the generic
    `Damage` category token: TSPY-4 established that the token is the ELEMENT's
    front, and that each AttribMod's own attrib comes from its index array."""
    hob = _load(os.path.join("blaster_ranged", "dual_pistols", "hail_of_bullets.json"))
    dmg = [t for t in _templates(hob)
           if len(t["attribs"]) == 1 and t["attribs"][0].endswith("_Dmg")
           and t["table"] == "Ranged_Damage"]
    assert dmg, "Hail of Bullets has no per-type damage template on Ranged_Damage"
    t = dmg[0]
    assert t["aspect"] == "Absolute", t["aspect"]
    assert t["type"] == "Magnitude", t["type"]
    assert t["target"] == "AnyAffected", t["target"]


def test_self_toggle_movement_is_typed():
    """A self movement toggle types target=Self (lands on the caster) — the
    discriminator the bag needs to route it as a self-buff, not a foe effect.
    Combat Jumping's recovered JumpHeight (TSPY-2) is the stable example."""
    cj = _load(os.path.join("pool", "leaping", "combat_jumping.json"))
    jump = [t for t in _templates(cj) if "JumpHeight" in t["attribs"]]
    assert jump, "Combat Jumping has no JumpHeight template"
    t = jump[0]
    assert t["aspect"] == "Current", t["aspect"]
    assert t["target"] == "Self", t["target"]
    assert t["type"] == "Magnitude", t["type"]


def test_corpus_typing_coverage():
    """Corpus-wide, the overwhelming majority of Thunderspy templates carry a real
    aspect+target+type (HC/Rebirth are at 100%). Pre-recovery this was ~0%. A
    threshold well below the measured 95.2% catches a wholesale typing regression
    (e.g. a re-export from a parser that lost the pre-table read) without being
    brittle to the ~5% out-of-enum tail (a handful of templates whose tail-scan
    lands on a spurious table string, decoded honestly to '')."""
    total = typed = 0
    for dirpath, _dirs, files in os.walk(_TSPY_EXPORT):
        for fn in files:
            if not fn.endswith(".json") or fn.startswith("_"):
                continue
            try:
                data = json.load(open(os.path.join(dirpath, fn)))
            except (json.JSONDecodeError, OSError):
                continue
            if not isinstance(data, dict) or not isinstance(data.get("effects"), list):
                continue
            for eff in data["effects"]:
                for t in eff.get("templates", []):
                    if not t.get("table"):
                        continue
                    total += 1
                    if t.get("aspect") and t.get("target") and t.get("type"):
                        typed += 1
    assert total > 20000, f"suspiciously few tspy templates scanned ({total})"
    coverage = typed / total
    assert coverage >= 0.90, f"tspy typing coverage {coverage:.1%} < 90% — typing recovery regressed"


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
