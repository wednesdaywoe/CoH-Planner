#!/usr/bin/env python3
"""Smoke regression checks for the EnhDB reader.

Run:
  python3 tools/mids-oracle/test_read_enhdb.py
"""

from __future__ import annotations

import os
import unittest

import read_enhdb


class TestReadEnhDb(unittest.TestCase):
    def test_homecoming_enhdb_parses_and_has_expected_shapes(self) -> None:
        path = os.path.abspath(read_enhdb.DEFAULT_MHD)
        self.assertTrue(os.path.isfile(path), f"missing EnhDB at {path}")

        with open(path, "rb") as fh:
            enhancements, sets, version, aligned = read_enhdb.read_enhdb(fh.read())

        self.assertTrue(aligned)
        self.assertGreaterEqual(version, 0)
        self.assertGreater(len(enhancements), 1000)
        self.assertGreater(len(sets), 100)

        proc_count = sum(1 for e in enhancements if e.get("is_proc"))
        self.assertGreater(proc_count, 50)

        # Stable identity anchors: these names have existed across DB revisions.
        set_names = {s.get("display_name", "") for s in sets}
        self.assertIn("Luck of the Gambler", set_names)

        enh_names = {e.get("name", "") for e in enhancements}
        self.assertIn("Chance for Build Up", enh_names)


if __name__ == "__main__":
    unittest.main()
