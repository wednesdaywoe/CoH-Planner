"""Regression guard for the per-fork event enum (WRAP-3).

An AttribMod's Suppress and CancelEvents arrays store an event as an INDEX into
a per-fork enum. Homecoming renumbers that enum on patch — the reason
`recalibrate_event_names` exists — so a fork that never had HC's numbering must
not be resolved through HC's table, or every id lands on its neighbour's name.
Thunderspy was therefore left deliberately unnamed (`Event_<n>` corpus-wide),
which is honest and also useless: `convert-powerset.cjs` decides combat
suppression by testing event NAMES, so all 1,167 of the fork's suppress-carrying
templates matched nothing and every Thunderspy travel power read as
un-suppressible in combat. Both halves right, wrong together.

WRAP-3 resolves Thunderspy through `EVENT_NAME_PARSE6`, the numbering it shares
with the rest of the Parse6 lineage. The evidence for that claim is in the
table's own comment; what this file guards is the pair of failure modes that
made the gap invisible for so long:

  * a fork that names NOTHING passes every value check ever written about these
    arrays, because absence and "this fork authors none" have the same shape;
  * a fork named through the WRONG table also passes them, because the names
    are all real event names — just the neighbouring ones.

Only a cross-fork comparison separates those, and it has to compare SETS. The
five-element mez block is written in a different ORDER on each side, so a guard
that compared name lists positionally would red on correct data and green on a
shifted table — exactly backwards.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_fork_event_enum.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from bin_crawler.parser._enums import EVENT_NAME, EVENT_NAME_PARSE6  # noqa: E402

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

_FORK_DIR = _forks.FORK_SUBDIR
_FORKS = tuple(_FORK_DIR)


def _powers(fork):
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
    """Every template, nested groups included (`child_effects` is the exported
    key — `child_groups` names nothing in the JSON, DATA-GAP WALK-1)."""
    def walk(groups):
        for group in groups or []:
            yield from group.get("templates") or []
            yield from walk(group.get("child_effects"))
    return walk(record.get("effects"))


def _suppress_names(template):
    return {rec["event"] for rec in template.get("suppress_events") or []}


def _cancel_names(template):
    return set(template.get("cancel_events") or [])


def _load(fork):
    return {r["full_name"].lower(): list(_templates(r)) for r in _powers(fork)}


_CORPUS = {fork: _load(fork) for fork in _FORKS}


def _named_counts(fork):
    named = unnamed = 0
    for templates in _CORPUS[fork].values():
        for template in templates:
            for name in _suppress_names(template) | _cancel_names(template):
                if name.startswith("Event_"):
                    unnamed += 1
                else:
                    named += 1
    return named, unnamed


def _suppress_multiset(templates):
    """Every suppress event a power authors, sorted, duplicates kept.

    Compared per POWER rather than per template because the templates within a
    power are not in the same order on every fork (Repulsion Bomb's Knocked and
    Stunned rows swap places, and both carry attrib None, so nothing pairs
    them). Order is not the datum here; which events the power suppresses on
    is, and a shifted enum renames every one of them.
    """
    return sorted(
        name for template in templates for name in _suppress_names(template)
    )


def test_no_fork_leaves_its_whole_event_corpus_unnamed():
    """The state WRAP-3 closed: names present but none of them resolved.

    Thunderspy shipped every suppress and cancel event as `Event_<n>`, which no
    downstream name test can match. Pinned as a share rather than a count so a
    corpus that grows or shrinks doesn't need the number retuned.
    """
    for fork in _FORKS:
        named, unnamed = _named_counts(fork)
        assert named + unnamed > 0, f"{fork} carries no events at all"
        assert named / (named + unnamed) > 0.9, (
            f"{fork} resolves only {named}/{named + unnamed} of its event ids "
            f"to names. An id absent from the fork's table is honest; a whole "
            f"corpus of them means no table is being applied, and every "
            f"name-keyed consumer (COMBAT_SUPPRESS_EVENTS) silently matches "
            f"nothing."
        )


def test_the_forks_agree_on_the_events_a_shared_power_suppresses():
    """The wrong-table failure: real names, shifted by one enum slot.

    Order-blind by construction (see `_suppress_multiset`) and still fully
    sensitive to a shift, because a shift renames every member. A guard that
    compared these positionally would red on correct data instead.
    """
    homecoming = _CORPUS["homecoming"]
    for fork in ("rebirth", "thunderspy"):
        agree = 0
        disagree = []
        for full_name, templates in _CORPUS[fork].items():
            theirs = homecoming.get(full_name)
            if theirs is None:
                continue
            hc_names = _suppress_multiset(theirs)
            names = _suppress_multiset(templates)
            # An event one fork authors and the other doesn't is a rebalance —
            # Thunderspy rebalances rather than misreads, so this may NOT be a
            # must-equal-HC comparison. An id one fork names and the other
            # leaves as Event_<n> is a table coverage gap, which the count
            # check above grades. Only same-shape rows discriminate a shift.
            if not hc_names or len(hc_names) != len(names):
                continue
            if any(n.startswith("Event_") for n in hc_names + names):
                continue
            if hc_names == names:
                agree += 1
            else:
                disagree.append((full_name, hc_names, names))
        # Disagreement is asserted BEFORE the vacuity floor: a shifted table
        # renames so many powers that `agree` collapses too, and tripping the
        # floor first would report "grading nothing" for what is really a
        # wrong-table read.
        assert not disagree, (
            f"{len(disagree)}/{agree + len(disagree)} shared powers name "
            f"different suppress events on homecoming vs {fork}, e.g. "
            f"{disagree[:3]}. Same power, same number of resolved events: the "
            f"fork is being resolved through the wrong enum generation."
        )
        assert agree > 100, (
            f"only {agree} {fork} powers were comparable against Homecoming "
            f"— the pairing broke, so this test is grading nothing"
        )


def test_the_wrong_table_would_actually_change_the_names():
    """Negative control — the table choice has to be load-bearing.

    If EVENT_NAME and EVENT_NAME_PARSE6 agreed on the ids the forks use, the
    test above would pass no matter which one the reader applied, and WRAP-3
    would be guarding nothing. They must disagree on ids that are actually in
    the corpus.
    """
    used = {
        rec["event_id"]
        for templates in _CORPUS["thunderspy"].values()
        for template in templates
        for rec in template.get("suppress_events") or []
    }
    shifted = {
        event_id for event_id in used
        if event_id in EVENT_NAME_PARSE6
        and EVENT_NAME.get(event_id) != EVENT_NAME_PARSE6[event_id]
    }
    assert len(shifted) >= 6, (
        f"only {sorted(shifted)} of Thunderspy's suppress ids are named "
        f"differently by the two tables — resolving through HC's would be "
        f"nearly harmless, so the cross-fork check above proves little"
    )


def test_the_intangibility_powers_carry_untouchable():
    """Semantic anchor for id 25, which no shift arithmetic reaches.

    Detention Field / Sonic Cage / Black Hole / Dimension Shift phase their
    target out, and the suppression rides `Untouchable`. Both Parse6-lineage
    forks shipped it as the fail-loud `Event_25` before WRAP-3; Homecoming
    names the same power's event, which is what pins the meaning.
    """
    for fork in _FORKS:
        carriers = {
            full_name
            for full_name, templates in _CORPUS[fork].items()
            for template in templates
            if "Untouchable" in _suppress_names(template)
        }
        assert carriers, (
            f"{fork} names no Untouchable suppress event. Every fork authors "
            f"the intangibility powers; a fork reporting none is a table gap, "
            f"the shape TSPY-5 and WRAP-2 both hid behind."
        )


def test_every_fork_suppresses_its_travel_powers_on_attacking():
    """The consequence WRAP-3 was opened for.

    A travel buff drops when its owner clicks an attack, and that is the only
    suppress event on one. It is also the one `COMBAT_SUPPRESS_EVENTS` needs to
    see for the planner's in-combat toggle to remove the buff — so a fork
    reaching zero here reads as having no combat-suppressed movement at all.
    """
    for fork in _FORKS:
        carriers = {
            full_name
            for full_name, templates in _CORPUS[fork].items()
            for template in templates
            if "ActivateAttackClick" in _suppress_names(template)
        }
        assert len(carriers) >= 5, (
            f"{fork} names ActivateAttackClick on only {sorted(carriers)}. "
            f"Every fork ships Super Speed and its siblings; zero or near-zero "
            f"means the fork's ids never reached a table."
        )


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if not name.startswith("test_") or not callable(fn):
            continue
        try:
            fn()
            print(f"PASS {name}")
        except AssertionError as exc:
            failures += 1
            print(f"FAIL {name}\n  {exc}")
    print("\nall passed" if not failures else f"\n{failures} failed")
    raise SystemExit(1 if failures else 0)
