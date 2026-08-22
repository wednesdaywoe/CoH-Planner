"""Regression guard for the Thunderspy AttribMod Params union (WRAP-1).

Thunderspy exported `params` on nothing but `Create_Entity`: every template
whose attrib names another power — Grant_Power, Revoke_Power, Execute_Power,
Recharge_Power — shipped with the pointer missing, so a whole class of
power-to-power edges was absent from the fork while Homecoming and Rebirth
carried it on 100% of theirs. The block was there all along; the reader stopped
at a fixed offset short of it.

Pinned by CENSUS, like `test_strengths_disallowed`, because the failure mode is
a silent return to zero: an empty result is indistinguishable from "this fork
authors none", which is exactly why nothing caught it for as long as it lasted.

The Knock and flag2 cases are here rather than in a file of their own because
they ride the same walk — if the tail ever slips again, whichever of these goes
red first names the record and the slot.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_thunderspy_params.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os
import collections

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

# Attribs whose Params block names another power. `Global_Chance_Mod` is
# deliberately absent: it carries an EffectFilter payload, not a Power one, on
# Homecoming (0 of 607) exactly as on Thunderspy (0 of 439).
_POWER_ATTRIBS = ("Grant_Power", "Revoke_Power", "Execute_Power", "Recharge_Power")

_FORK_DIR = {"homecoming": "", "rebirth": "rebirth", "thunderspy": "thunderspy"}


def _powers(fork):
    """Every exported power record for `fork`."""
    base = os.path.join(_EXPORT, _FORK_DIR[fork])
    for root, _dirs, files in os.walk(base):
        rel = os.path.relpath(root, _EXPORT).split(os.sep)
        if fork == "homecoming" and rel[0] in _forks.NESTED_DIRS:
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
    def walk(groups):
        for group in groups or []:
            for template in group.get("templates") or []:
                yield template
            yield from walk(group.get("child_effects"))
    yield from walk(record.get("effects"))
    yield from walk(record.get("activation_effects"))


def _named_targets(record):
    """{attrib: {lowercased power name, ...}} for this record's Params Power blocks."""
    out = collections.defaultdict(set)
    for template in _templates(record):
        names = (template.get("params") or {}).get("power_names") or []
        for attrib in template.get("attribs") or []:
            out[attrib].update(name.lower() for name in names)
    return out


def test_every_fork_names_the_powers_its_attribs_point_at():
    """No fork publishes zero targets for a power-referencing attrib it authors.

    Zero is the WRAP-1 signature. Thunderspy sat at 0 of 2,371 Grant_Power,
    0 of 1,300 Revoke_Power and 0 of 76 Execute_Power while both other forks
    named 100% of theirs.
    """
    for fork in _FORK_DIR:
        authored = collections.Counter()
        named = collections.Counter()
        for record in _powers(fork):
            for template in _templates(record):
                has_target = bool((template.get("params") or {}).get("power_names"))
                for attrib in set(template.get("attribs") or []) & set(_POWER_ATTRIBS):
                    authored[attrib] += 1
                    named[attrib] += has_target
        for attrib, count in authored.items():
            assert named[attrib] > 0, (
                f"{fork} authors {count} {attrib} template(s) and names a target "
                f"power on none of them — the Params union is being missed again"
            )


def test_thunderspy_points_at_the_powers_homecoming_points_at():
    """The recovered targets are the same powers HC names, not neighbouring bytes.

    Over the (power, attrib) pairs both forks give a target for, the two name
    the identical set on 86.6% and overlapping sets on a further 7.1%. A read
    landing on some other field could not reproduce that; the residual is the
    fork's own rebalancing (see [[tspy-parser-parity]]).
    """
    homecoming = {r["full_name"]: _named_targets(r) for r in _powers("homecoming")}
    thunderspy = {r["full_name"]: _named_targets(r) for r in _powers("thunderspy")}

    shared = identical = overlapping = 0
    for name, tspy_targets in thunderspy.items():
        hc_targets = homecoming.get(name)
        if not hc_targets:
            continue
        for attrib in _POWER_ATTRIBS:
            if attrib not in tspy_targets or attrib not in hc_targets:
                continue
            shared += 1
            if tspy_targets[attrib] == hc_targets[attrib]:
                identical += 1
            elif tspy_targets[attrib] & hc_targets[attrib]:
                overlapping += 1

    assert shared >= 1000, f"only {shared} shared (power, attrib) pairs to grade"
    assert identical / shared >= 0.80, (
        f"only {identical}/{shared} ({100.0 * identical / shared:.1f}%) of shared "
        f"targets are identical to Homecoming's — was 86.6% when the union was decoded"
    )
    assert (identical + overlapping) / shared >= 0.90, (
        f"only {identical + overlapping}/{shared} shared targets even overlap "
        f"Homecoming's"
    )


def test_thunderspy_knock_params_carry_the_motion_each_mez_authors():
    """The Knock payload's field order, pinned by what the motion has to be.

    Thunderspy keeps the same eight Knock fields as Homecoming in 40 bytes, with
    `vec_adjust_pyr` LAST rather than third. Reading it in HC's order puts the
    velocity and height words inside the PYR vector and the priority, which is
    how the misread announces itself — but only if something checks the physics:
    a Knockup must move the target up and not away, a Repel away and not up.
    """
    seen = collections.Counter()
    for record in _powers("thunderspy"):
        for template in _templates(record):
            params = template.get("params") or {}
            if params.get("type") != "Knock":
                continue
            attribs = set(template.get("attribs") or [])
            for mez in attribs & {"Knockup", "Repel"}:
                seen[(mez, bool(params.get("vel")), bool(params.get("height")))] += 1

    knockups = {key: n for key, n in seen.items() if key[0] == "Knockup"}
    repels = {key: n for key, n in seen.items() if key[0] == "Repel"}
    assert knockups and repels, "no Thunderspy Knock params to grade"

    lifting = sum(n for (_mez, vel, height), n in knockups.items() if height and not vel)
    assert lifting == sum(knockups.values()), (
        f"only {lifting} of {sum(knockups.values())} Knockup params carry a height "
        f"and no velocity — the payload's field order has moved"
    )
    pushing = sum(n for (_mez, vel, height), n in repels.items() if not height)
    assert pushing == sum(repels.values()), (
        f"{sum(repels.values()) - pushing} Repel param(s) carry a height — a Repel "
        f"pushes away, not up; the payload's field order has moved"
    )


def test_thunderspy_carries_the_second_flags_word():
    """CopyBoosts / RevokeAll reach the fork's flags, from the same slot HC uses.

    The word sits between Flags and Messages and is decoded through the same
    per-attrib gate (`_FLAG2_BITS_BY_ATTRIB`). CopyBoosts on an Execute_Power
    template is HC-4's marker — the fork's exposure to it was unmeasurable while
    this word went unread.
    """
    flag_carriers = collections.Counter()
    for record in _powers("thunderspy"):
        for template in _templates(record):
            flags = set(template.get("flags") or [])
            for attrib in template.get("attribs") or []:
                for flag in flags & {"CopyBoosts", "RevokeAll"}:
                    flag_carriers[(flag, attrib)] += 1

    for key in (("CopyBoosts", "Create_Entity"),
                ("CopyBoosts", "Execute_Power"),
                ("RevokeAll", "Revoke_Power")):
        assert flag_carriers[key] > 0, (
            f"no Thunderspy {key[1]} template carries {key[0]} — the second flags "
            f"word is unread again, and with it the fork's HC-4 exposure"
        )


def test_thunderspy_templates_resolve_their_combat_messages():
    """Messages decode against the fork's own message store, not into offsets.

    A record whose 16-byte Messages block were read at the wrong place would
    still produce four u4s; what it could not produce is text out of
    clientmessages-en.bin.
    """
    resolved = 0
    for record in _powers("thunderspy"):
        for template in _templates(record):
            messages = template.get("messages") or {}
            if any(isinstance(v, str) and " " in v for v in messages.values()):
                resolved += 1
    assert resolved > 1000, (
        f"only {resolved} Thunderspy template(s) resolve a message to text"
    )


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if not name.startswith("test_") or not callable(fn):
            continue
        try:
            fn()
            print(f"PASS {name}")
        except AssertionError as err:
            failures += 1
            print(f"FAIL {name}: {err}")
    print("all passed" if not failures else f"{failures} failure(s)")
    raise SystemExit(1 if failures else 0)
