"""Regression guard for `requires_default` — the structural base-case read (COND-1).

An effect group's `Requires` decides whether the group is part of the power's
unconditional base or a branch that applies only under some condition. The
converter used to answer that with `stripped.endsWith('!')`: the last token of
the `&&`-flattened expression read as if it were the top-level operator. That is
right for a conjunction of negations and backwards when the `!` negates ONE
conjunct — 3,230 groups across 223 expressions were exposed, and two facets
carried hand patches.

`parser/_gate_default.default_verdict` now parses the expression and evaluates
the tree three-valued under a documented default situation (see that module's
docstring). The verdict is exported per group as `requires_default`, so there is
one implementation and the JS consumers (`scripts/_gate-default.cjs`) read it
rather than re-deriving.

What this grades: that the field is present and on-vocabulary on every group in
every fork, that the shapes COND-1 was filed for read the way the powers'
own data says they should, and that the structural read still DISAGREES with the
last-token shortcut on the measured population — so reverting to it goes red.

What it cannot grade: whether a gate is satisfied in play. That needs a target,
which is the engine's question, not the export's — see
`crates/coh_math/src/expr.rs`.

Reads the committed `exported_powers/` trees only — no .bin / .pigg needed.
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(REPO, "tools", "bin-crawler"))

from bin_crawler.parser._gate_default import (  # noqa: E402
    INDETERMINATE,
    INDETERMINATE_ARCHETYPE,
    SATISFIED,
    UNSATISFIED,
    VERDICTS,
    default_verdict,
    evaluate,
)
from bin_crawler.parser._requires import parse  # noqa: E402


def _toks(text):
    """Tokenize an expression WRITTEN as text in this file.

    Export data arrives already tokenized — a `requires_expression` is the token
    list the wire holds (COND-8). Only the literals authored below need this, and
    naming it keeps the two apart.
    """
    return text.split()

FORKS = dict(_forks.FORKS)
_NESTED = set(_forks.NESTED_DIRS)


def _player_classes(fork):
    """A fork's player archetypes, read from its own exported class tables.

    The same membership signal `_classes.is_player_class` uses, asked one hop
    downstream — so a test that hard-coded the roster could not drift from the
    export the way a hand list would.
    """
    tables = os.path.join(FORKS[fork], "tables")
    names = []
    for name in sorted(os.listdir(tables)):
        if not name.endswith(".json") or name.startswith("_"):
            continue
        with open(os.path.join(tables, name), encoding="utf-8") as handle:
            record = json.load(handle)
        player = (record["villain_rank"] == 0 if "villain_rank" in record
                  else bool(record.get("special_restrictions")))
        if player:
            names.append(record["name"])
    return names


PLAYER_CLASSES = {fork: _player_classes(fork) for fork in FORKS}

_failures: list[str] = []


def check(condition, message):
    if not condition:
        _failures.append(message)


def _last_token_shortcut(expr: list[str]) -> bool:
    """The pre-COND-1 rule, reproduced for the anti-revert floor below.

    Deliberately NOT the converter's full function — only the part COND-1
    replaced: strip the `&&`/`||` connectives and ask whether the last surviving
    token is `!`. That is the proxy whose disagreement with the tree is the
    measurement this floor pins.
    """
    tokens = [t for t in expr if t not in ("&&", "||")]
    return bool(tokens) and tokens[-1] == "!"


def _walk(groups, out):
    for group in groups or ():
        if not isinstance(group, dict):
            continue
        out.append(group)
        _walk(group.get("child_effects"), out)


def _load_groups():
    """Every effect group in every fork, as `(fork, power_path, group)`."""
    for fork, root in FORKS.items():
        for dirpath, dirnames, filenames in os.walk(root):
            if fork == "homecoming":
                dirnames[:] = [d for d in dirnames if d not in _NESTED]
            for name in filenames:
                if not name.endswith(".json"):
                    continue
                path = os.path.join(dirpath, name)
                try:
                    with open(path, encoding="utf-8") as handle:
                        doc = json.load(handle)
                except Exception:
                    continue
                if not isinstance(doc, dict) or "effects" not in doc:
                    continue
                groups = []
                _walk(doc.get("effects"), groups)
                for group in groups:
                    yield fork, doc.get("full_name") or path, group


ALL_GROUPS = list(_load_groups())


def test_every_group_carries_an_on_vocabulary_verdict():
    """No group may be missing `requires_default`, and none may be unreadable.

    `UNPARSED` (the RPN did not reduce) and `UNCLASSIFIED` (it reduced but names
    a clause with no reading) are both explicit rather than folded into a
    verdict, exactly as `requires_pv` keeps `UNPARSED` separate from `EITHER`.
    Both sit at zero corpus-wide; a fork patch that introduces new requires
    vocabulary lands here rather than silently becoming a base effect.
    """
    check(len(ALL_GROUPS) > 100_000, f"vacuous sweep: only {len(ALL_GROUPS)} groups walked")
    missing, unreadable = [], []
    for fork, power, group in ALL_GROUPS:
        verdict = group.get("requires_default")
        if verdict is None:
            missing.append(f"{fork} {power}")
        elif verdict not in VERDICTS:
            unreadable.append(f"{fork} {power}: {verdict!r}")
        elif verdict in ("UNPARSED", "UNCLASSIFIED"):
            unreadable.append(
                f"{fork} {power}: {verdict} on "
                f"{' '.join(group.get('requires_expression') or ())!r}")
    check(not missing,
          f"{len(missing)} groups missing requires_default (stale export?); "
          f"first: {missing[:3]}")
    check(not unreadable,
          f"{len(unreadable)} groups with an unusable verdict; first: {unreadable[:3]}")


def test_an_absent_gate_is_the_base_case():
    """A group with no `Requires` at all is unconditional, and says so."""
    ungated = [
        (fork, power, group)
        for fork, power, group in ALL_GROUPS
        if not (group.get("requires_expression") or ())
    ]
    check(len(ungated) > 10_000, f"vacuous: only {len(ungated)} ungated groups")
    wrong = [f"{f} {p}" for f, p, g in ungated if g["requires_default"] != SATISFIED]
    check(not wrong, f"{len(wrong)} ungated groups not SATISFIED; first: {wrong[:3]}")


def test_the_shapes_cond1_was_filed_for():
    """The tree reading, on the expressions that motivated it.

    Each pairing is the point: a shape and its complement must not both land in
    base, and the `!` in a conjunct must not decide the whole expression.
    """
    cases = [
        # The Dispersion Bubble shape COND-1 opened on: the `!` belongs to the
        # entref conjunct, the root operator is `&&`, and a PvP-map gate is never
        # the base case for a PvE planner.
        ("isPVPMap? entref target> entref source> eq ! &&", UNSATISFIED),
        # Its PvE twin.
        ("isPVPMap? ! entref target> entref source> eq ! &&", SATISFIED),
        # "The target is not the caster" alone IS the base case — the planner's
        # recipient is somebody else, and caster exclusion rides `not_on_caster`.
        ("entref target> entref source> eq !", SATISFIED),
        # A mode that is off by default, with the `!` on a different conjunct.
        ("kHunterMode Source.Mode? entref target> entref source> eq ! &&", UNSATISFIED),
        # The complementary halves of a meter fork: below the threshold is the
        # default, above it is the conditional. Both used to read conditional,
        # so a Stalker's non-hidden branch never reached base.
        ("kMeter source> .9 <", SATISFIED),
        ("kMeter source> 0 >", UNSATISFIED),
        # The same fork spelled as a stack count.
        ("Temporary_Powers.Temporary_Powers.Tidal_Power source.ownPowerNum? 0 ==", SATISFIED),
        ("Temporary_Powers.Temporary_Powers.Tidal_Power source.ownPowerNum? 1 >=", UNSATISFIED),
        # An unmezzed caster and a living, unmezzed target are the default.
        ("cur.kUntouchable target> 0 <=", SATISFIED),
        ("kHeld target> 0 >", UNSATISFIED),
        # A rank fork stays out of base in BOTH halves — reading the negated one
        # as the default is what put Thunderous Blast's rank-gated -0.3 endurance
        # drain over its ungated -0.55 (MAPGATE-1).
        ("rank target> Class_Minion_Grunt eq", INDETERMINATE),
        ("rank target> Class_Minion_Grunt eq !", INDETERMINATE),
        # A visual-only customization gate drops out either way: the engine
        # stores `@CustomFX` to pick a VISUAL, and Rebirth Cinders carries the
        # same Held 8.0/6.0 on both branches.
        ("@customFX BrightFieryBinds eq", SATISFIED),
        ("@customFX BrightFieryBinds eq !", SATISFIED),
        ("enttype target> critter eq @customFX BrightFieryBinds eq ! && @customFX DarkFieryBinds eq ! &&",
         SATISFIED),
        # The bare always-true sentinel.
        ("1", SATISFIED),
    ]
    for expr, want in cases:
        got = default_verdict(_toks(expr))
        check(got == want, f"{expr!r} read as {got}, not {want}")


def test_the_verdict_disagrees_with_the_last_token_shortcut():
    """The anti-revert floor.

    If someone swaps the tree evaluation back for the last-token proxy — or the
    field stops being computed and defaults everywhere — this measured
    disagreement collapses and the test goes red. The population is what COND-1
    measured: thousands of groups, not a handful.
    """
    disagreements = 0
    graded = 0
    for _fork, _power, group in ALL_GROUPS:
        expr = group.get("requires_expression") or []
        if not expr:
            continue
        graded += 1
        shortcut_says_base = _last_token_shortcut(expr)
        tree_says_base = group["requires_default"] == SATISFIED
        if shortcut_says_base != tree_says_base:
            disagreements += 1
    check(graded > 40_000, f"vacuous: only {graded} gated groups graded")
    check(disagreements > 2_000,
          f"only {disagreements} groups where the tree and the last-token shortcut "
          f"disagree — the structural read has been reverted to a token scan")


def test_the_three_questions_arch_asks():
    """`arch` is one attribute asking three things; only the class names which.

    Reading the attribute SPELLING instead — which is what the retired carve-out
    did — merged a caster fork, a teammate test and a critter-rank test into one
    verdict, and 73% of that population was the rank test, for which this module
    already had the right answer (AT-FORK-1).
    """
    hc = PLAYER_CLASSES["homecoming"]
    rb = PLAYER_CLASSES["rebirth"]

    # 1. The CASTER's archetype: resolvable, and resolved — the fork's SATISFIED
    #    side is named rather than shrugged at.
    scrapper = evaluate(_toks("arch source> Class_Scrapper eq"), player_classes=hc)
    check(scrapper.verdict == INDETERMINATE_ARCHETYPE,
          f"caster fork read as {scrapper.verdict}")
    check(list(scrapper.archetypes) == ["Class_Scrapper"],
          f"caster fork resolved to {scrapper.archetypes}, not just the Scrapper")

    # 2. A named PLAYER archetype on the TARGET: the default situation has a
    #    generic critter and no teammate, and neither is a Controller. This is
    #    Cosmic Balance, the acceptance case — a solo build must not carry the
    #    teammate branch's mez protection in its base.
    cosmic = "arch target> Class_Controller eq arch target> Class_Dominator eq || isPVPMap? ! &&"
    check(default_verdict(_toks(cosmic), player_classes=hc) == UNSATISFIED,
          "Cosmic Balance's teammate gate read as "
          f"{default_verdict(_toks(cosmic), player_classes=hc)}")
    # Its NEGATION is the base case for the same reason, which is what keeps
    # Rebirth Hurricane's -0.6 range debuff on a critter it does apply to.
    hurricane = ("arch target> Class_Scrapper eq arch target> Class_Tanker eq || "
                 "arch target> Class_Stalker eq || arch target> Class_Brute eq || !")
    check(default_verdict(_toks(hurricane), player_classes=rb) == SATISFIED,
          "Hurricane's negated melee-archetype clause left base")

    # 3. A critter class on the TARGET is a RANK test wearing `arch`, and rank
    #    stays unknown in both directions (MAPGATE-1) — the same pair the `rank`
    #    spelling is held to above.
    for expr in ("arch target> Class_Minion_Grunt eq", "arch target> Class_Minion_Grunt eq !"):
        got = default_verdict(_toks(expr), player_classes=hc)
        check(got == INDETERMINATE, f"{expr!r} read as {got}, not {INDETERMINATE}")

    # A critter class on the CASTER, by contrast, IS decidable: no build is an
    # Archvillain, so every archetype agrees and there is no fork to report.
    check(default_verdict(_toks("arch source> Class_Boss_Archvillain eq"), player_classes=hc)
          == UNSATISFIED, "a build read as possibly being an Archvillain")

    # `source.owner>` asks about whoever SUMMONED the caster — a pet's master,
    # not the build — so binding the build there would answer a question the
    # selector exists to distinguish.
    check(default_verdict(_toks("arch source.owner> Class_Controller eq"), player_classes=hc)
          == INDETERMINATE, "the pet-owner archetype was answered as the build's")

    # Without a catalogue nothing above is decidable, and the module says so
    # rather than guessing — the loud failure a caller that forgot it deserves.
    check(default_verdict(_toks("arch target> Class_Controller eq")) == "UNCLASSIFIED",
          "an `arch` gate was decided with no player-class catalogue")


def test_a_reported_archetype_fork_carries_its_resolution():
    """`INDETERMINATE_ARCHETYPE` must name the caster fork it resolves.

    The verdict is no longer a flavour of unknown: it means "base for THESE
    archetypes", and the consumer keys on the list. A group carrying it without
    an `arch source>` clause, or naming an archetype the fork does not define,
    would be a resolution nothing can apply.
    """
    leaked, unknown = [], []
    resolved = 0
    for fork, power, group in ALL_GROUPS:
        if group.get("requires_default") != INDETERMINATE_ARCHETYPE:
            continue
        expr = " ".join(group.get("requires_expression") or ()).lower()
        if "arch source>" not in expr:
            leaked.append(f"{fork} {power}: {expr!r}")
        named = group.get("requires_archetypes") or []
        if named:
            resolved += 1
        catalogue = set(PLAYER_CLASSES[fork])
        for archetype in named:
            if archetype not in catalogue:
                unknown.append(f"{fork} {power}: {archetype}")
    check(not leaked,
          f"{len(leaked)} archetype forks with no `arch source>` clause; first: {leaked[:3]}")
    check(not unknown,
          f"{len(unknown)} forks naming a class the dataset does not define as playable; "
          f"first: {unknown[:3]}")
    check(resolved > 300,
          f"only {resolved} forks carry a resolution — the archetype list has gone inert")


def test_the_caster_fork_is_always_resolved():
    """No `arch source>` gate may still read as a plain unknown.

    The caster's archetype is the one unknown the export CAN retire, by running
    the tree once per archetype the dataset defines. A group left INDETERMINATE
    with a caster-archetype clause means that pass did not happen.
    """
    unresolved = [
        f"{fork} {power}: {' '.join(group.get('requires_expression') or ())!r}"
        for fork, power, group in ALL_GROUPS
        if "arch source>" in " ".join(group.get("requires_expression") or ()).lower()
        and group.get("requires_default") == INDETERMINATE
    ]
    graded = sum(1 for _f, _p, g in ALL_GROUPS
                 if "arch source>" in " ".join(g.get("requires_expression") or ()).lower())
    check(graded > 1_000, f"vacuous: only {graded} caster-archetype gates in the corpus")
    check(not unresolved,
          f"{len(unresolved)} caster-archetype gates left unresolved; first: {unresolved[:3]}")


def test_a_forks_arms_partition_the_archetypes_they_split():
    """Rebirth's pool defences fork into arms that cover every archetype once.

    Tough, Weave and Combat Jumping each carry a Kheldian arm and an
    everyone-else arm. Both used to land in base, so every Rebirth build got
    BOTH — Tough read 3.0 S/L resistance against Homecoming's and Thunderspy's
    1.5. The arms are a partition, which is why the doubling was exact, and that
    is the property worth pinning: a build matches one arm, never two.
    """
    catalogue = set(PLAYER_CLASSES["rebirth"])
    checked = 0
    for fork, power, group in ALL_GROUPS:
        if fork != "rebirth" or not str(power).endswith((".Tough", ".Weave")):
            continue
        if group.get("requires_default") != INDETERMINATE_ARCHETYPE:
            continue
        named = set(group.get("requires_archetypes") or [])
        check(named and named < catalogue,
              f"{power}: arm {sorted(named)} is not a proper non-empty subset")
        checked += 1
    check(checked > 0, "vacuous: no Rebirth Tough/Weave archetype fork found")

    # And together the two arms of one power cover the roster exactly once.
    arms = {}
    for fork, power, group in ALL_GROUPS:
        if fork != "rebirth" or group.get("requires_default") != INDETERMINATE_ARCHETYPE:
            continue
        if not str(power).endswith(".Tough"):
            continue
        arms[frozenset(group.get("requires_archetypes") or ())] = True
    covered = set()
    overlap = set()
    for arm in arms:
        overlap |= covered & arm
        covered |= arm
    check(not overlap, f"Rebirth Tough's arms overlap on {sorted(overlap)} — a build gets both")
    check(covered == catalogue,
          f"Rebirth Tough's arms cover {len(covered)} of {len(catalogue)} archetypes")


def test_every_committed_expression_parses():
    """The arity table covers the shipped vocabulary, in every fork.

    Ported from the game's own evaluator registrations rather than established by
    stack balance; `source.mapTeamArea>` was registered here with the wrong arity
    for as long as `entity_scope`'s `enttype` short-circuit kept it off the path.
    """
    unparsed = []
    seen = set()
    for fork, power, group in ALL_GROUPS:
        expr = group.get("requires_expression") or []
        key = tuple(expr)
        if not expr or key in seen:
            continue
        seen.add(key)
        try:
            parse(expr)
        except Exception as err:
            unparsed.append(f"{fork} {power}: {expr!r} — {err}")
    check(len(seen) > 1_000, f"vacuous: only {len(seen)} distinct expressions")
    check(not unparsed,
          f"{len(unparsed)} expressions do not reduce; first: {unparsed[:3]}")


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
    if _failures:
        for failure in _failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        sys.exit(1)
    print(f"OK — requires_default verified over {len(ALL_GROUPS)} effect groups.")
