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

    def test_extra_proc_classification_uses_staleness_bucket_for_missing_set(self) -> None:
        bucket, reason = diff_enh_oracle._classify_extra_proc_pair(
            "absolute resolution",
            "chance for energy damage",
            {"categories": {"damage"}},
            {"aegis", "stupefy"},
            {"stupefy": {"chance for knockback"}},
        )
        self.assertEqual(bucket, "likely_oracle_set_staleness")
        self.assertIn("absent", reason)

    def test_extra_proc_classification_keeps_mapping_gap_when_set_exists(self) -> None:
        bucket, reason = diff_enh_oracle._classify_extra_proc_pair(
            "guardian's gift",
            "chance for stun",
            {"categories": {"control"}},
            {"aegis", "guardian's gift"},
            {},
        )
        self.assertEqual(bucket, "likely_mapping_gap")
        self.assertIn("triggered", reason)

    def test_extra_proc_classification_oracle_proc_staleness_for_set_present_extra(self) -> None:
        bucket, reason = diff_enh_oracle._classify_extra_proc_pair(
            "stupefy",
            "chance for stun",
            {"categories": {"control"}, "ppm": 3.5},
            {"stupefy"},
            {"stupefy": {"chance for knockback"}},
        )
        self.assertEqual(bucket, "likely_oracle_proc_staleness")
        self.assertIn("no oracle counterpart", reason)

    def test_extra_proc_classification_conversion_is_non_proc_bucket(self) -> None:
        bucket, reason = diff_enh_oracle._classify_extra_proc_pair(
            "sudden acceleration",
            "convert knockback to knockdown",
            {"categories": {"special"}, "ppm": None},
            {"sudden acceleration"},
            {},
        )
        self.assertEqual(bucket, "likely_non_proc_global_or_passive")
        self.assertIn("conversion", reason)


if __name__ == "__main__":
    unittest.main()
