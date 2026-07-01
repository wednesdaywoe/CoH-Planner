#!/usr/bin/env python3
"""Locate the chain / max-targets expression fields in the powers.bin layout.

Why this exists: the parser's chain region (fields 38/42/43) reads several
string_arrays that were historically discarded under GUESSED labels. Field 42
is confirmed `ChainEff`. The other two the planner wants —
  - `MaxTargetsExpr`  (field 38, HC/Parse7 only)  → the target-cap expression
  - `ChainTarget`     (next-target selection weighting)
— are NOT confirmed: the only locally-available dataset (Veracity) is Parse6,
which has no field 38 at all and whose field-43 slot resolves to VisualFX refs
(…NictusFX), and whose powers don't use ChainTarget (`prevdistance`/`maintarget>`
are absent from the whole bin). So this must be run against **HC (Parse7)** data.

Run it against the HC assets dir; it prints the two candidate string_arrays
(_field38_str, _field43_str) plus ChainEff for known chain / cap powers, so we
can match them to the .powers oracle values and finalize the mapping:

  py -3 probe_chain_fields.py --assets-dir "G:/Homecoming/assets/live"

Oracle values to match against (from `raw defs/`):
  Scrapper_Melee.Electrical_Melee.Chain_Induction
      ChainEff  = 1 0.20 @ChainJump 1 - * - 0.20 1 minmax   (MaxTargetsHit 5)
  Dominator_Control.Electric_Control.Jolting_Chain
      ChainFork = 1 2 3 … 16  (a u4 int-array, NOT a string_array)
  Defender_Buff.Shock_Therapy.Rejuvenating_Circuit  (and the other circuits)
      ChainTarget = 101 kHitPoints% target> - enttype maintarget> enttype
                    target> eq 99 * 1 + * 1 prevdistance / +
  A Tanker melee attack (Gauntlet)
      MaxTargetsExpr = 16 kDisable_GauntletTargetCap source.Mode? 6 * -

DECISION RULE:
  - If `prevdistance`/`maintarget>` lands in _field43_str → field 43 IS
    ChainTarget (Parse7 differs from Parse6). Promote it.
  - If a known Gauntlet MaxTargetsExpr lands in _field38_str → field 38 IS
    MaxTargetsExpr. Promote it.
  - Wherever a token lands is the authoritative slot — trust the data, not this
    script's guesses.
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from bin_crawler.parser._powers import parse_powers
from bin_crawler.parser._pigg import BinResolver
from bin_crawler.assets_dir import resolve_assets_dir

TOKENS = ("prevdistance", "maintarget", "@ChainJump", "GauntletTargetCap",
          "source.Mode", "NictusFX")

# Substring anchors for a few known chain / cap powers (leaf name, lowercased).
KNOWN = ("chain_induction", "jolting_chain", "synaptic_overload",
         "rejuvenating_circuit", "empowering_circuit", "energizing_circuit")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--assets-dir", default=None)
    ap.add_argument("--pick", action="store_true")
    args = ap.parse_args()
    assets = resolve_assets_dir(args.assets_dir, pick=args.pick)

    res = BinResolver(assets)
    print("source:", res.source_description)
    raw = res.read("powers.bin")
    print("raw-byte token presence:")
    for t in TOKENS:
        print(f"   {t:20} {'present' if t.encode() in raw else 'ABSENT'}")

    powers = parse_powers(raw)
    print(f"\n{len(powers)} powers parsed\n")

    # Token → which captured field it lands in, across the whole dataset.
    print("token → field tally (across all powers):")
    for t in TOKENS:
        n38 = sum(1 for p in powers if t in p._field38_str)
        n42 = sum(1 for p in powers if t in p.chain_eff_expression)
        n43 = sum(1 for p in powers if t in p._field43_str)
        print(f"   {t:20} field38={n38:5}  field42(ChainEff)={n42:5}  field43={n43:5}")

    print("\nknown chain / cap powers:")
    for p in powers:
        leaf = p.full_name.rsplit(".", 1)[-1].lower()
        if not any(k in leaf for k in KNOWN):
            continue
        if not (p._field38_str or p.chain_eff_expression or p._field43_str):
            continue
        print("::", p.full_name, f"(MaxTargetsHit={p.max_targets_hit})")
        if p._field38_str:            print("   field38          :", p._field38_str)
        if p.chain_eff_expression:    print("   field42 ChainEff :", p.chain_eff_expression)
        if p._field43_str:            print("   field43          :", p._field43_str)


if __name__ == "__main__":
    main()
