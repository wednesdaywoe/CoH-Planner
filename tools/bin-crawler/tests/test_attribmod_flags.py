"""Regression guard for the AttribMod flag decode (FLAGS-1).

The binary stores AttribMod flags in two consecutive u4s. The first word holds
global authored keywords plus, in bits 8-11, the compiler-baked effective
Resist/CombatMod {Magnitude,Duration} mode (raw-only, never decoded into
`flags`). The second word is a per-attrib-class UNION: bit 0 means DeepSleep on
a Sleep mod, RevokeAll on Revoke_Power, SetTimer on Recharge_Power,
VanishEntOnTimeout on Create_Entity — so decoding is gated on the attrib
(`_FLAG2_BITS_BY_ATTRIB` in `parser/_powers.py`).

An earlier decode mistook first-word bit 11 (CombatModDuration) for DeepSleep:
every genuine DeepSleep is a duration mod, so recall looked perfect while the
flag false-fired on every Hold / Stun / plain-Sleep in the corpus (~4.3k
templates). This asserts known-truth samples from the COMMITTED HC
`exported_powers/` (validated against the authored `.powers` defs, 2026-07-20
census) so a parser regression or stale re-export can't silently reintroduce
the false flag or drop the union decode. Reads only committed JSON — no
.bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_attribmod_flags.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_HC_EXPORT = os.path.join(_REPO, "exported_powers")


def _load(rel_path: str) -> dict:
    with open(os.path.join(_HC_EXPORT, rel_path)) as f:
        return json.load(f)


def _templates(power: dict):
    def walk(groups):
        for effect in groups or []:
            yield from effect.get("templates", [])
            yield from walk(effect.get("child_effects"))
    yield from walk(power.get("effects"))
    yield from walk(power.get("activation_effects"))


def _flags(template) -> set:
    return set(template.get("flags") or [])


def test_true_deepsleep_is_decoded():
    """Flash Freeze's main Sleep mods are authored `Flags DeepSleep` (one of
    them `IgnoreResistance DeepSleep`) — every Sleep template whose second
    word has bit 0 set must decode it, and the pairing with IgnoreResistance
    must survive. (The live binary also carries unflagged Sleep variants the
    beta-era def drop lacks; those correctly stay bare.)"""
    power = _load(os.path.join("dominator_control", "ice_control", "flash_freeze.json"))
    sleeps = [t for t in _templates(power) if t["attribs"] == ["Sleep"]]
    assert sleeps, "Flash Freeze has no Sleep template"
    flagged = [t for t in sleeps if t.get("flags2_raw", 0) & 0x1]
    assert flagged, "no Sleep template carries second-word bit 0"
    assert all("DeepSleep" in _flags(t) for t in flagged), \
        [(_flags(t), t.get("flags2_raw")) for t in flagged]
    assert any(_flags(t) >= {"DeepSleep", "IgnoreResistance"} for t in flagged)
    bare = [t for t in sleeps if not t.get("flags2_raw")]
    assert all("DeepSleep" not in _flags(t) for t in bare)


def test_plain_duration_mez_has_no_deepsleep():
    """Block of Ice is a Hold — no DeepSleep anywhere in its authored def. The
    old bit-11 decode false-fired here on every duration-aspect template."""
    power = _load(os.path.join("dominator_control", "ice_control", "block_of_ice.json"))
    templates = list(_templates(power))
    assert templates, "Block of Ice parsed no templates"
    offenders = [t for t in templates if "DeepSleep" in _flags(t)]
    assert not offenders, [(t["attribs"], _flags(t)) for t in offenders]


def test_plain_sleep_without_deepsleep_keyword():
    """Sirens Song sleeps WITHOUT the DeepSleep keyword (authored def carries
    none) — same attrib as Flash Freeze, so this pins the flags2 gate, not an
    attrib heuristic."""
    power = _load(os.path.join("blaster_ranged", "sonic_attack", "sirens_song.json"))
    sleeps = [t for t in _templates(power) if "Sleep" in t["attribs"]]
    assert sleeps, "Sirens Song has no Sleep template"
    assert all("DeepSleep" not in _flags(t) for t in sleeps)


def test_revoke_all_union_decode():
    """Dehydrate revokes the Tidal Power stack with authored
    `Flags IgnoreStrength IgnoreResistance RevokeAll` — second-word bit 0
    decodes as RevokeAll on a Revoke_Power mod."""
    power = _load(os.path.join("blaster_ranged", "water_blast", "dehydrate.json"))
    revokes = [t for t in _templates(power) if t["attribs"] == ["Revoke_Power"]]
    assert revokes, "Dehydrate has no Revoke_Power template"
    assert any("RevokeAll" in _flags(t) for t in revokes), \
        [(_flags(t), t.get("flags2_raw")) for t in revokes]


def test_entity_class_union_decode():
    """Blizzard's Create_Entity carries CopyBoosts (0x4 in the entity class);
    the same bit is Cooldown on a Recharge_Power mod (Icy Bastion's authored
    `Flags ... Cooldown`), pinning the per-attrib union."""
    blizzard = _load(os.path.join("blaster_ranged", "ice_blast", "blizzard.json"))
    creates = [t for t in _templates(blizzard) if t["attribs"] == ["Create_Entity"]]
    assert creates, "Blizzard has no Create_Entity template"
    assert any("CopyBoosts" in _flags(t) for t in creates)

    bastion = _load(os.path.join("stalker_defense", "ice_armor", "icy_bastion.json"))
    recharges = [t for t in _templates(bastion) if t["attribs"] == ["Recharge_Power"]]
    assert recharges, "Icy Bastion has no Recharge_Power template"
    joined = set().union(*(_flags(t) for t in recharges))
    assert "Cooldown" in joined and "CopyBoosts" not in joined, joined


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            try:
                fn()
                print(f"ok   {name}")
            except AssertionError as failure:
                failures += 1
                print(f"FAIL {name}: {failure}")
    raise SystemExit(1 if failures else 0)
