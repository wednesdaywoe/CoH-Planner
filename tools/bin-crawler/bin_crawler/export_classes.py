"""Export per-archetype/per-pet-class data from classes.bin and
villain_classes.bin as JSON files.

Output shape matches the legacy CoD2 `tables/<at>.json` files that the
planner's `scripts/extract-at-tables.cjs` consumes:

    {
      "primary_category": "Blaster_RANGED",
      "secondary_category": "Blaster_SUPPORT",
      "named_tables": { "Melee_Damage": [...50 or 105 floats...], ... }
    }

Usage:
  py -3 -m bin_crawler.export_classes [--assets-dir DIR] [--output-dir DIR]

Defaults: --assets-dir G:/Homecoming/assets/live, output to
./exported_powers/<assets-dir-name>/tables/.
"""

import argparse
import json
import sys
from dataclasses import asdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from bin_crawler.parser._pigg import BinResolver
from bin_crawler.parser._classes import parse_classes


def _normalize_class_name(name: str) -> str:
    """`Class_Blaster` -> `blaster`, `Class_Minion_Pets` -> `minion_pets`."""
    if name.lower().startswith("class_"):
        name = name[len("class_"):]
    return name.lower()


def main():
    ap = argparse.ArgumentParser(description="Export AT class/pet tables as JSON")
    ap.add_argument("--assets-dir", default=r"G:\Homecoming\assets\live",
                    help="Path to assets directory containing .pigg archives")
    ap.add_argument("--output-dir", default=None,
                    help="Output directory (default: ./exported_powers/<assets-dir-name>/tables)")
    args = ap.parse_args()

    if args.output_dir is None:
        source_name = Path(args.assets_dir).name or "export"
        output_dir = Path("./exported_powers") / source_name / "tables"
    else:
        output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    resolver = BinResolver(args.assets_dir)
    print(f"Source: {resolver.source_description}", flush=True)
    print(f"Output: {output_dir}", flush=True)

    written = 0

    for bin_name in ("classes.bin", "villain_classes.bin"):
        if not resolver.has(bin_name):
            print(f"  {bin_name}: not found, skipping")
            continue

        records = parse_classes(resolver.read(bin_name))
        print(f"  {bin_name}: {len(records)} records")

        for c in records:
            key = _normalize_class_name(c.name)
            if not key:
                continue
            out_file = output_dir / f"{key}.json"
            out = {
                "name": c.name,
                "display_name": c.display_name,
                "icon": c.icon,
                "primary_category": c.primary_category,
                "secondary_category": c.secondary_category,
                "pool_category": c.pool_category,
                "named_tables": c.named_tables,
            }
            out_file.write_text(json.dumps(out, indent=2), encoding="utf-8")
            written += 1

    print(f"Wrote {written} class JSON files to {output_dir}")


if __name__ == "__main__":
    main()
