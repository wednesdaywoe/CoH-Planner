"""Export pet entity data from villaindef.bin as CoD2-shape JSON.

Produces one JSON file per player-relevant pet entity, matching the schema
that `scripts/convert-pet-entities.cjs` expects (the same shape City of
Data 2.0 used to produce). Wildcards in `defaults.powers` are expanded
against `powersets.bin` so `defaults.power_full_names` matches what the
game actually grants.

Output:
  <output-dir>/<entity_name_lowercased>.json

Filtered to the prefixes the planner cares about: `Pets_*`,
`MastermindPets_*`, `IncarnatePets_*`, `Villain_Pets_*`. Skipping the
several thousand NPC/critter records keeps the output small and matches
the file set that `convert-pet-entities.cjs` already iterates.

Usage:
  py -3 -m bin_crawler.export_entities [--assets-dir DIR] [--output-dir DIR]

Defaults: --assets-dir G:/Homecoming/assets/live, output to
./exported_powers/<assets-dir-name>/entities/.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from bin_crawler.parser._pigg import BinResolver
from bin_crawler.parser._entities import parse_entities, EntityRecord
from bin_crawler.parser._powersets import parse_powersets
from bin_crawler.parser._messages import load_messages


PET_PREFIXES = ("pets_", "mastermindpets_", "incarnatepets_", "villain_pets_")

# villaindef.bin filename varies by case across servers (HC ships
# `villaindef.bin`, Rebirth ships `VillainDef.bin`). Try both.
VILLAINDEF_CANDIDATES = ("villaindef.bin", "VillainDef.bin")


def _normalize_class(name: str) -> str:
    """`Class_Minion_Pets` -> `minion_pets` (matches CoD2's encoding)."""
    if name.lower().startswith("class_"):
        name = name[len("class_"):]
    return name.lower()


def _build_powerset_index(ps_records) -> dict[str, list[tuple[str, str]]]:
    """Return {`Cat.Set` -> [(short_name, display_name)]} for wildcard
    expansion. Only retains the Pets / Mastermind_Pets / Villain_Pets
    categories — that's where pet powers live.
    """
    index: dict[str, list[tuple[str, str]]] = {}
    for ps in ps_records:
        if not ps.powers:
            continue
        # ps.key is e.g. "Pets.Tornado", powers are full dotted names.
        powers = []
        for full in ps.powers:
            short = full.rsplit(".", 1)[-1]
            powers.append((short, short.replace("_", " ")))
        index[ps.key] = powers
    return index


def _expand_powers(rec: EntityRecord, ps_index: dict[str, list[tuple[str, str]]]):
    """Return parallel arrays (full_names, display_names, levels) with
    `*` wildcards expanded against the powerset's actual power list.
    """
    full_names: list[str] = []
    display_names: list[str] = []
    levels: list[int] = []
    for entry in rec.powers:
        if entry.power == "*":
            ps_key = f"{entry.power_category}.{entry.power_set}"
            for short, disp in ps_index.get(ps_key, []):
                full_names.append(f"{ps_key}.{short}")
                display_names.append(disp)
                levels.append(entry.level)
        else:
            full_names.append(f"{entry.power_category}.{entry.power_set}.{entry.power}")
            display_names.append(entry.power.replace("_", " "))
            levels.append(entry.level)
    return full_names, display_names, levels


def entity_to_dict(rec: EntityRecord, ps_index, msgs=None) -> dict:
    full_names, display_names, levels = _expand_powers(rec, ps_index)

    # Resolve the level display name (P-hash → real string) when we have a
    # message table available. Falls back to a name-derived label so the
    # planner UI shows something sensible even when nothing resolves.
    primary_display = ""
    if rec.levels and rec.levels[0].display_names:
        primary_display = rec.levels[0].display_names[0]
        if msgs:
            primary_display = msgs.resolve(primary_display)

    return {
        "name": rec.name,
        "group_name": rec.name.split("_")[0] if "_" in rec.name else "",
        "commandable_pet": int(rec.commandable_pet),
        "power_tags": rec.power_tags,
        "copy_creator_mods": bool(rec.copy_creator_mods),
        "can_zone": bool(rec.can_zone),
        "defaults": {
            "rank": rec.rank_raw,
            "ai_config": rec.ai_config,
            "character_class_name": _normalize_class(rec.character_class_name),
            "description": msgs.resolve(rec.description) if msgs else rec.description,
            "display_name": msgs.resolve(rec.display_name) if msgs else rec.display_name,
            "display_class_name": rec.display_class_name,
            "power_full_names": full_names,
            "power_display_names": display_names,
            "power_levels": levels,
            "powers": [
                {
                    "power_category": p.power_category,
                    "power_set": p.power_set,
                    "power": p.power,
                    "level": p.level,
                }
                for p in rec.powers
            ],
        },
        "levels": [
            {
                "min_level": L.min_level,
                "max_level": L.max_level,
                "experience": L.experience,
                "display_names": [msgs.resolve(d) if msgs else d for d in L.display_names],
                "costumes": L.costumes,
            }
            for L in rec.levels
        ] if rec.levels else [{
            # Synthesize a single-level entry when the bin's levels list was
            # empty / unparseable (Parse6 path) so downstream tooling can
            # still pull a display name without null-checking the array.
            "min_level": 1,
            "max_level": 50,
            "experience": 0,
            "display_names": [primary_display or rec.name.split("_", 1)[-1].replace("_", " ")],
            "costumes": [],
        }],
        "source_file": rec.source_file,
    }


def main():
    ap = argparse.ArgumentParser(description="Export pet entity data as JSON")
    ap.add_argument("--assets-dir", default=r"G:\Homecoming\assets\live",
                    help="Path to assets directory containing .pigg archives")
    ap.add_argument("--output-dir", default=None,
                    help="Output directory (default: ./exported_powers/<assets-dir-name>/entities)")
    args = ap.parse_args()

    if args.output_dir is None:
        source_name = Path(args.assets_dir).name or "export"
        output_dir = Path("./exported_powers") / source_name / "entities"
    else:
        output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    resolver = BinResolver(args.assets_dir)
    print(f"Source: {resolver.source_description}")
    print(f"Output: {output_dir}")

    villaindef_name = next((n for n in VILLAINDEF_CANDIDATES if resolver.has(n)), None)
    if villaindef_name is None:
        print("villaindef.bin not found in this assets dir.")
        return 1
    print(f"Reading {villaindef_name}...")
    entities = parse_entities(resolver.read(villaindef_name))
    print(f"  {len(entities)} entity records.")

    ps_records = parse_powersets(resolver.read("powersets.bin"))
    ps_index = _build_powerset_index(ps_records)
    print(f"  {len(ps_records)} powersets, {len(ps_index)} indexed for expansion.")

    msgs = None
    if resolver.has("clientmessages-en.bin"):
        msgs = load_messages(resolver.read("clientmessages-en.bin"))
        print(f"  {len(msgs)} messages loaded.")

    written = 0
    skipped_no_powers = 0
    for rec in entities:
        if not rec.name.lower().startswith(PET_PREFIXES):
            continue
        if not rec.powers:
            skipped_no_powers += 1
            continue
        d = entity_to_dict(rec, ps_index, msgs=msgs)
        out_file = output_dir / f"{rec.name.lower()}.json"
        out_file.write_text(json.dumps(d, indent=2), encoding="utf-8")
        written += 1

    print(f"\nWrote {written} pet entity files (skipped {skipped_no_powers} with no powers).")


if __name__ == "__main__":
    sys.exit(main() or 0)
