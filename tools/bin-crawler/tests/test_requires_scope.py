"""Regression guard for `requires_pv` — the structural PvE/PvP read (MAPGATE-1).

A group's `Requires` can confine it to one side of the PvE/PvP split by testing
the target's entity type. Every consumer used to answer "which side?" by
substring-testing the RPN for `enttype target> player eq`. That is right for the
bare case and backwards for two shapes that ship in quantity:

  * the clause NEGATED — `arch target> Class_Minion_* eq … enttype target>
    player eq || !`, i.e. "not a minion and not a player". This is the
    Scrapper/Stalker critical-hit branch against lieutenants and bosses: the
    *primary PvE crit rate*, read as PvP-only and dropped from PvE entirely.
  * the clause as one branch of an `||` — `Raid target.HasTag? enttype target>
    player eq || …`, which neither implies nor forbids PvP.

`parser/_requires.entity_scope` now answers it by satisfiability instead:
treating the target's entity type as one variable and every other boolean leaf
as free, can the group ever apply against a critter, and against a player? The
verdict is exported per group as `requires_pv`, so there is one implementation
and the JS consumers (`scripts/_pv-scope.cjs`) read it rather than re-deriving.

What this grades: that the field is present and on-vocabulary everywhere, that
the three shapes above read the way three independent oracles say they should,
and that the structural read still DISAGREES with the substring test on the
measured population — so reverting to a token scan goes red.

What it cannot grade: whether a gate is satisfied in play. That needs a target,
which is the engine's question, not the export's — see
`crates/coh_math/src/expr.rs`.

Reads the committed `exported_powers/` trees only — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_requires_scope.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py
import json
import os
import sys

REPO = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                     '..', '..', '..'))
EXPORT = os.path.join(REPO, 'exported_powers')
FORKS = dict(_forks.FORKS)

# Total effect groups per fork. Floors, not equalities — a fork gaining powers
# must not red this. Measured 2026-08-02: 37280 / 81913 / 51699; Brainstorm 38176 (2026-08-23).
GROUP_FLOOR = {'homecoming': 35000, 'rebirth': 78000, 'thunderspy': 49000, 'brainstorm': 36000}

# Records where the structural verdict DISAGREES with the old substring test.
# This is the anti-revert floor: swap `entity_scope` back for a token scan and
# these go to zero. Measured 2026-08-02: 220 / 338 / 303; Brainstorm 221 (2026-08-23).
FLIP_FLOOR = {'homecoming': 200, 'rebirth': 320, 'thunderspy': 285, 'brainstorm': 200}

VOCAB = {'EITHER', 'PVE_ONLY', 'PVP_ONLY'}

_CRIT_LARGE = ('arch target> Class_Minion_Grunt eq arch target> Class_Minion_Small eq || '
               'arch target> Class_Minion_Pets eq || arch target> Class_Minion_Swarm eq || '
               'enttype target> player eq || !')
_CRIT_SMALL = ('arch target> Class_Minion_Grunt eq arch target> Class_Minion_Small eq || '
               'arch target> Class_Minion_Pets eq || arch target> Class_Minion_Swarm eq ||')

_SELF_EXCLUSION = 'entref target> entref source> eq !'


def _files(base, fork):
    for dirpath, dirnames, fnames in os.walk(base):
        if fork == 'homecoming' and dirpath == base:
            dirnames[:] = [d for d in dirnames if d not in _forks.NESTED_DIRS]
        for f in fnames:
            if f.endswith('.json'):
                yield os.path.join(dirpath, f)


def _groups(g):
    yield g
    for c in (g.get('child_effects') or []):
        yield from _groups(c)


def _walk(fork):
    """(power_name, group) for every effect group in a fork."""
    for fp in _files(FORKS[fork], fork):
        try:
            d = json.load(open(fp))
        except Exception:
            continue
        if not isinstance(d, dict):
            continue
        for key in ('effects', 'activation_effects'):
            for top in (d.get(key) or []):
                for g in _groups(top):
                    yield d.get('full_name') or fp, g


def _substring_verdict(expr):
    """What every consumer did before MAPGATE-1. Kept here so the guard can
    prove the structural read is still doing work rather than agreeing."""
    if 'target> player eq' in expr:
        return 'PVP_ONLY'
    if 'target> critter eq' in expr:
        return 'PVE_ONLY'
    return 'EITHER'


def test_every_group_carries_an_on_vocabulary_verdict():
    """No group may be missing `requires_pv`, and none may carry `UNPARSED`.

    `UNPARSED` is the parser saying it met a requires vocabulary it has no arity
    for. It is exportable on purpose — an explicit unknown beats a plausible
    default — but it must never be *present*, because an unreadable gate that
    nobody notices is how a soft default gets reinvented. `NEVER` likewise:
    an expression that cannot be satisfied either way is a finding.
    """
    for fork in FORKS:
        total = missing = 0
        offenders = []
        for name, g in _walk(fork):
            total += 1
            pv = g.get('requires_pv')
            if pv is None:
                missing += 1
                if len(offenders) < 5:
                    offenders.append(f'{name}: field absent')
            elif pv not in VOCAB:
                if len(offenders) < 5:
                    offenders.append(
                        f'{name}: {pv} — {" ".join(g.get("requires_expression") or ())}')
        assert total >= GROUP_FLOOR[fork], (
            f'{fork}: only {total} effect groups, floor {GROUP_FLOOR[fork]} — '
            f'this guard is reading less than it should')
        assert missing == 0 and not offenders, (
            f'{fork}: {missing} groups missing requires_pv; offenders: {offenders}')


def test_the_negated_clause_reads_pve_not_pvp():
    """The Scrapper/Stalker crit pair, which is the whole finding in one power.

    The two Effects differ by exactly `enttype target> player eq ||` and the
    trailing `!`. `CritSmall` fires against minions; `CritLarge` fires against
    everything that is neither a minion nor a player — lieutenants, bosses, AVs.
    Three independent oracles agree it is PvE content: the authored HC def pairs
    them with 0.05 / 0.10 chances, the engine's own evaluator asserts the
    negated form true against a boss critter
    (`crates/coh_math/src/expr.rs::the_crit_rank_gates_partition_the_target_classes`),
    and the structural read lands on PVE_ONLY.
    """
    seen_large = seen_small = 0
    for fork in FORKS:
        for name, g in _walk(fork):
            expr = ' '.join(g.get('requires_expression') or ())
            if expr == _CRIT_LARGE:
                seen_large += 1
                assert g['requires_pv'] == 'PVE_ONLY', (
                    f'{fork} {name}: negated player clause read as '
                    f'{g["requires_pv"]}, not PVE_ONLY')
            elif expr == _CRIT_SMALL:
                # The control: same clause list, no `player eq`, no negation.
                # It names only archetypes, so it constrains rank, not side.
                seen_small += 1
                assert g['requires_pv'] == 'EITHER', (
                    f'{fork} {name}: minion-only clause read as {g["requires_pv"]}')
    assert seen_large >= 400, f'only {seen_large} CritLarge groups found'
    assert seen_small >= 400, f'only {seen_small} CritSmall controls found'


def test_the_bare_clause_still_reads_pvp():
    """The common case the substring test got right must not regress."""
    n = 0
    for fork in FORKS:
        for name, g in _walk(fork):
            if (g.get('requires_expression') or []) == ['enttype', 'target>', 'player', 'eq']:
                n += 1
                assert g['requires_pv'] == 'PVP_ONLY', (
                    f'{fork} {name}: bare player clause read as {g["requires_pv"]}')
    assert n >= 3000, f'only {n} bare `player eq` groups found'


def test_a_disjunct_clause_constrains_nothing():
    """`Raid … || player eq` — one branch of an `||`, so neither side is implied.

    Rebirth/Thunderspy state their per-hit Fury grant this way. Both forks ALSO
    carry a bare `player eq` Fury grant, which is the genuine PvP one, so this
    is a second and separate gate rather than the PvP half of a pair.
    """
    n = 0
    for fork in FORKS:
        for name, g in _walk(fork):
            expr = ' '.join(g.get('requires_expression') or ())
            if expr.startswith('Raid target.HasTag? enttype target> player eq ||'):
                n += 1
                assert g['requires_pv'] == 'EITHER', (
                    f'{fork} {name}: disjunct player clause read as '
                    f'{g["requires_pv"]}, not EITHER')
    assert n >= 250, f'only {n} Raid-disjunction groups found'


def test_the_entity_type_test_is_case_insensitive():
    """`enttype target> Critter eq` — capital C, which the substring test missed.

    Two Rebirth Warburg pet groups spell it this way and were reading EITHER.
    """
    n = 0
    for fork in FORKS:
        for name, g in _walk(fork):
            expr = ' '.join(g.get('requires_expression') or ())
            if expr == 'enttype target> Critter eq':
                n += 1
                assert g['requires_pv'] == 'PVE_ONLY', (
                    f'{fork} {name}: {expr!r} read as {g["requires_pv"]}')
    assert n >= 2, f'only {n} mixed-case enttype groups found — control is vacuous'


def test_the_structural_read_still_disagrees_with_a_token_scan():
    """The anti-revert floor.

    If someone swaps `entity_scope` back for a substring test — or the field
    silently stops being computed — the two verdicts converge and this reds.
    Without it, every other test here would still pass on a token scan.
    """
    for fork in FORKS:
        flips = 0
        for name, g in _walk(fork):
            if g.get('requires_pv') != _substring_verdict(
                    ' '.join(g.get('requires_expression') or ())):
                flips += 1
        assert flips >= FLIP_FLOOR[fork], (
            f'{fork}: only {flips} groups where the structural verdict differs '
            f'from a substring scan (floor {FLIP_FLOOR[fork]}) — the structural '
            f'read may have been reverted')


def test_fork_is_pvp_tracks_requires_pv_except_the_two_carve_outs():
    """Parse6/Thunderspy have no declared PvP flag, so `is_pvp` is synthesized
    from `requires_pv` — and must agree with it except where a documented rule
    says otherwise. Exactly two do:

      * a Self-targeted AttribMod carrying the self-exclusion clause, where
        `target` in the requires names the entity being SCANNED and the clause
        is an ally-type filter (Phalanx Fighting);
      * an AttribMod whose own `DelayedRequires` names the map (STACK-3's
        `isPVPMap?`), which overrides the element's verdict per sub-record.

    Any third divergence is an unaccounted-for rule.
    """
    for fork in ('rebirth', 'thunderspy'):
        unexplained = []
        carve_outs = 0
        for name, g in _walk(fork):
            pv, is_pvp = g.get('requires_pv'), g.get('is_pvp')
            if pv == is_pvp:
                continue
            expr = ' '.join(g.get('requires_expression') or ()).lower()
            tmpls = g.get('templates') or []
            self_excl = (_SELF_EXCLUSION in expr
                         and any(t.get('target') == 'Self' for t in tmpls))
            map_gated = any('isPVPMap?' in (t.get('jit_requires') or [])
                            for t in tmpls)
            if self_excl or map_gated:
                carve_outs += 1
            else:
                unexplained.append(
                    f'{name}: requires_pv={pv} is_pvp={is_pvp} req={expr[:80]!r}')
        assert not unexplained, (
            f'{fork}: {len(unexplained)} groups diverge for no documented '
            f'reason: {unexplained[:5]}')
        assert carve_outs > 0, (
            f'{fork}: no carve-out divergences at all — either the carve-outs '
            f'were removed or this control grades nothing')


if __name__ == '__main__':
    failures = 0
    for fn_name, fn in sorted(list(globals().items())):
        if not fn_name.startswith('test_') or not callable(fn):
            continue
        try:
            fn()
            print(f'PASS {fn_name}')
        except AssertionError as e:
            failures += 1
            print(f'FAIL {fn_name}\n     {e}')
    sys.exit(1 if failures else 0)
