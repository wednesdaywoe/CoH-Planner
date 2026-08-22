"""Regression guard for the gate token array — COND-8.

A `Requires` is a string-offset array on the wire: one offset per token, and the
boundaries between tokens are stated by the file, not inferred from it. The
parser used to hand each one to `' '.join(...)` at fifteen sites, and every
consumer recovered the tokens with `.split()`. That round trip is lossless only
while no token contains a space.

Homecoming's costume-FX values contain spaces. `Minimal FX`, `Color Tintable`,
`Undefined Evil` and nine more each sit in `powers.bin` as one standalone
null-terminated entry, and the join erased the boundary the split then had to
guess. Nothing shipped a wrong NUMBER — the mis-split expressions failed loud as
`UNPARSED` — but the export was stating a gate the game does not carry.

What this grades, over the committed export of all three forks:

* **Shape.** No gate field anywhere is a string. Re-introducing a join at any of
  the fifteen sites puts a `str` where a list belongs and this goes red.
* **Boundaries.** The multi-word tokens survive as SINGLE tokens, pinned by
  value and by census. A join followed by a split leaves `Minimal` and `FX` as
  two tokens, so this is the assertion that a rejoin-equivalent regression
  cannot slip past — the shape check above would still pass on a
  join-then-resplit producer.
* **Non-vacuity.** The population is measured, not assumed: 50 groups over 12
  powers, all Homecoming. If a future export stops carrying them the census
  moves and this says so, rather than passing on an empty sweep.

What it cannot grade: the JS and Rust consumers. Those fail loud instead —
`scripts/_gate-tokens.cjs` THROWS on a string rather than splitting it, and
`coh_data::power` rejects a non-list `requires` at decode.

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

FORKS = {
    "homecoming": os.path.join(REPO, "exported_powers"),
    "rebirth": os.path.join(REPO, "exported_powers", "rebirth"),
    "thunderspy": os.path.join(REPO, "exported_powers", "thunderspy"),
}
_NESTED = tuple(f"exported_powers/{d}/" for d in _forks.NESTED_DIRS)

# Every gate field the export carries as a token array. Most are `list[str]` on a
# dataclass in `parser/_dataclasses.py`; three (`condition_expression`,
# `script_id`, `script_value`) are emitted straight into a dict literal in
# `parser/_powers.py`. A new one added to either and forgotten here would be
# swept by nothing, so the names are cross-checked against both files below.
GATE_FIELDS = frozenset({
    "activate_requires",
    "chain_eff_expression",
    "chain_target_expression",
    "condition_expression",
    "duration_expression",
    "jit_requires",
    "magnitude_expression",
    "max_targets_expression",
    "requires",
    "requires_expression",
    "script_id",
    "script_value",
    "slot_requires",
    "target_requires",
})

# The measured COND-8 population: every gate token in any fork's export that
# contains a space, with how many times it occurs. All twelve are Homecoming
# costume-FX values, and all twelve are what a join/split pair destroys.
EXPECTED_MULTIWORD = {
    "All Original": 3,
    "All Tintable": 12,
    "Always Glow": 2,
    "Color Tintable": 11,
    "Color Tintable Alt": 2,
    "Color Tintable Minimal": 2,
    "Minimal FX": 14,
    "Overgrowth Original": 6,
    "Overgrowth Tintable": 6,
    "Sepia Tone": 2,
    "Undefined Evil": 14,
    "Undefined Silver": 14,
}
EXPECTED_GROUPS = 50   # effect groups (and other gate carriers) holding one
EXPECTED_POWERS = 12   # power files holding one

_failures: list[str] = []


def check(condition, message):
    if not condition:
        _failures.append(message)


def _pairs(node, out):
    """Every (key, value) in a decoded power file, at any depth."""
    if isinstance(node, dict):
        for key, value in node.items():
            out.append((key, value))
            _pairs(value, out)
    elif isinstance(node, list):
        for value in node:
            _pairs(value, out)


def _sweep():
    """(fork -> stats) over every committed power file."""
    stats = {}
    for fork, root in FORKS.items():
        strings = []
        fields = 0
        multiword = {}
        carriers = 0
        powers = set()
        for dirpath, _dirs, files in os.walk(root):
            posix = dirpath.replace(os.sep, "/") + "/"
            if fork == "homecoming" and any(n in posix for n in _NESTED):
                continue
            for name in files:
                if not name.endswith(".json"):
                    continue
                path = os.path.join(dirpath, name)
                with open(path, encoding="utf-8") as handle:
                    try:
                        record = json.load(handle)
                    except ValueError:
                        continue  # not a power file; other exporters share the tree
                pairs = []
                _pairs(record, pairs)
                held = False
                for key, value in pairs:
                    if key not in GATE_FIELDS:
                        continue
                    fields += 1
                    if isinstance(value, str):
                        strings.append(f"{path}: {key} = {value!r}")
                        continue
                    if not isinstance(value, list):
                        continue
                    spaced = [t for t in value if isinstance(t, str) and " " in t]
                    if spaced:
                        carriers += 1
                        held = True
                        for token in spaced:
                            multiword[token] = multiword.get(token, 0) + 1
                if held:
                    powers.add(path)
        stats[fork] = {
            "fields": fields,
            "strings": strings,
            "multiword": multiword,
            "carriers": carriers,
            "powers": powers,
        }
    return stats


STATS = _sweep()


def test_the_field_list_matches_the_parser():
    """The fields swept here are the fields the parser emits as token lists.

    A gate added to the parser and not to `GATE_FIELDS` would be swept by
    nothing, and the guard would keep reporting green over a shrinking corpus.
    """
    parser = os.path.join(REPO, "tools", "bin-crawler", "bin_crawler", "parser")
    text = ""
    for name in ("_dataclasses.py", "_powers.py"):
        with open(os.path.join(parser, name), encoding="utf-8") as handle:
            text += handle.read()
    missing = [f for f in sorted(GATE_FIELDS)
               if not any(spelling in text for spelling in
                          (f"{f}:", f"'{f}':", f'"{f}":'))]
    check(not missing,
          f"GATE_FIELDS names {missing}, which the parser does not emit")


def test_no_gate_is_a_string():
    """The shape: a gate is the token array the wire holds, never a joined string."""
    for fork, stat in STATS.items():
        check(stat["fields"] > 100_000,
              f"vacuous: {fork} swept only {stat['fields']} gate fields")
        check(not stat["strings"],
              f"{fork}: {len(stat['strings'])} gate fields are joined strings; "
              f"first: {stat['strings'][:3]}")


def test_multi_word_tokens_survive_as_one_token():
    """The boundaries: a value with a space in it is still ONE token.

    This is the assertion a join-then-resplit producer cannot pass. `Minimal FX`
    would come back as `Minimal` and `FX`, which reads as a well-formed list of
    the right TYPE — so shape alone would not see it.
    """
    found = dict(STATS["homecoming"]["multiword"])
    for fork in ("rebirth", "thunderspy"):
        for token, count in STATS[fork]["multiword"].items():
            found[token] = found.get(token, 0) + count

    check(found == EXPECTED_MULTIWORD,
          "the multi-word gate-token census moved — a boundary was lost or the "
          f"export changed.\n  expected {EXPECTED_MULTIWORD}\n  found    {found}")

    carriers = sum(s["carriers"] for s in STATS.values())
    powers = sum(len(s["powers"]) for s in STATS.values())
    check(carriers == EXPECTED_GROUPS,
          f"{carriers} gate fields carry a multi-word token, expected {EXPECTED_GROUPS}")
    check(powers == EXPECTED_POWERS,
          f"{powers} powers carry one, expected {EXPECTED_POWERS}")


if __name__ == "__main__":
    for _name, _fn in sorted(globals().items()):
        if _name.startswith("test_") and callable(_fn):
            _fn()
    if _failures:
        for failure in _failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        sys.exit(1)
    total = sum(s["fields"] for s in STATS.values())
    print(f"OK — {total} gate fields are token arrays; "
          f"{EXPECTED_GROUPS} carry a multi-word token across {EXPECTED_POWERS} powers.")
