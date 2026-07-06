#!/usr/bin/env python3
"""Smoke tests for diff_enh_oracle helper mappings.

Run:
  python3 tools/mids-oracle/test_diff_enh_oracle.py
"""

from __future__ import annotations

import unittest

import diff_enh_oracle


class TestDiffEnhOracle(unittest.TestCase):
    def test_name_aliases_canonicalize(self) -> None:
        self.assertEqual(
            diff_enh_oracle._canon_name("Ascendency of the Dominator"),
            "ascendancy of the dominator",
        )
        self.assertEqual(
            diff_enh_oracle._canon_name("Numina's Convalesence"),
            "numina's convalescence",
        )

    def test_oracle_effect_mapping_damagebuff(self) -> None:
        effect = {
            "effect_type": "DamageBuff",
            "damage_type": "Smashing",
            "aspect": "Str",
        }
        stat = diff_enh_oracle._oracle_effect_to_stat(effect)
        self.assertEqual(stat, "damage")
        # Gladiator's Javelin p4: scale 0.025 -> 2.5 = repo damage (default x100).
        val = abs(0.025) * diff_enh_oracle._bonus_multiplier(effect)
        self.assertAlmostEqual(val, 2.5, places=3)

    def test_oracle_effect_mapping_hpmax(self) -> None:
        effect = {
            "effect_type": "HitPoints",
            "damage_type": "None",
            "aspect": "Max",
        }
        stat = diff_enh_oracle._oracle_effect_to_stat(effect)
        self.assertEqual(stat, "maximum_hitpoints")
        val = abs(0.1125) * diff_enh_oracle._bonus_multiplier(effect)
        self.assertAlmostEqual(val, 1.125, places=3)


if __name__ == "__main__":
    unittest.main()
