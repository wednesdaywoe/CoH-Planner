"""
Patch power data files to add activatePeriod field.

Reads powers.bin to get activate_period for each toggle power,
then patches the corresponding TypeScript data files.

Data file locations:
  - power-pools-raw.ts:  effects.endurance → add effects.activatePeriod
  - epic-pools-raw.ts:   effects.endurance → add effects.activatePeriod
  - powersets/**/*.ts:    stats.endurance   → add stats.activatePeriod
  - levels.ts:           effects.enduranceCost → add effects.activatePeriod
"""

import json
import re
import sys
from pathlib import Path

# Add project root so we can import the binary parser
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "power_stats"))

from power_stats.binparser import parse_powers

BIN_PATH = Path(r"G:\Homecoming\assets\live\bin\powers.bin")
SRC_DATA = PROJECT_ROOT / "src" / "data"

DEFAULT_PERIOD = 0.5


def get_toggle_periods():
    """Parse powers.bin and return {fullName: activate_period} for all toggles."""
    powers = parse_powers(str(BIN_PATH))
    periods = {}
    for p in powers:
        if p.power_type != 2:  # Toggle = 2
            continue
        if p.endurance_cost <= 0:
            continue
        periods[p.full_name] = round(p.activate_period, 4)
    return periods


def patch_raw_pools(filepath, periods, field_name="endurance"):
    """
    Patch power-pools-raw.ts or epic-pools-raw.ts.
    These have fullName fields we can match on.
    Adds activatePeriod after the endurance line.
    """
    text = filepath.read_text(encoding="utf-8")
    lines = text.split("\n")

    patched = 0
    new_lines = []
    current_fullname = None

    for i, line in enumerate(lines):
        new_lines.append(line)

        # Track current fullName
        fn_match = re.search(r'"fullName":\s*"([^"]+)"', line)
        if fn_match:
            current_fullname = fn_match.group(1)

        # Find endurance lines and add activatePeriod after them
        end_match = re.search(rf'(\s*)"({field_name})":\s*([\d.]+)', line)
        if end_match and current_fullname:
            period = periods.get(current_fullname, DEFAULT_PERIOD)
            if abs(period - DEFAULT_PERIOD) > 0.001:
                indent = end_match.group(1)
                # Check next line to determine if we need a comma
                new_lines.append(f'{indent}"activatePeriod": {period},')
                patched += 1

    if patched > 0:
        filepath.write_text("\n".join(new_lines), encoding="utf-8")
    return patched


def patch_powerset_files(periods):
    """
    Patch individual powerset power files under src/data/powersets/.
    These use stats.endurance and may not have fullName.
    We match by constructing the fullName from the file path.
    """
    # Build a lookup by power_name (last segment of fullName) for each AT/category/set
    # fullName format: "Tanker_Defense.Dark_Armor.Death_Shroud"
    # file path format: powersets/tanker/primary/dark-armor/death-shroud.ts

    # Map: (archetype_prefix, powerset_slug) -> {power_slug: period}
    at_map = {
        "tanker": {"primary": "Tanker_Defense", "secondary": "Tanker_Melee"},
        "scrapper": {"primary": "Scrapper_Melee", "secondary": "Scrapper_Defense"},
        "brute": {"primary": "Brute_Melee", "secondary": "Brute_Defense"},
        "stalker": {"primary": "Stalker_Melee", "secondary": "Stalker_Defense"},
        "blaster": {"primary": "Blaster_Ranged", "secondary": "Blaster_Support"},
        "controller": {"primary": "Controller_Control", "secondary": "Controller_Buff"},
        "dominator": {"primary": "Dominator_Control", "secondary": "Dominator_Assault"},
        "corruptor": {"primary": "Corruptor_Ranged", "secondary": "Corruptor_Buff"},
        "defender": {"primary": "Defender_Buff", "secondary": "Defender_Ranged"},
        "mastermind": {"primary": "Mastermind_Summon", "secondary": "Mastermind_Buff"},
        "sentinel": {"primary": "Sentinel_Ranged", "secondary": "Sentinel_Defense"},
        "kheldian": {"primary": "Kheldian_Human_Form", "secondary": "Kheldian_Human_Form"},
        "arachnos-soldier": {"epic": "Epic"},
        "arachnos-widow": {"epic": "Epic"},
    }

    # Build fullName -> period lookup indexed by normalized power name
    period_by_parts = {}  # (category_prefix, powerset_name, power_name) -> period
    for fullname, period in periods.items():
        parts = fullname.split(".")
        if len(parts) != 3:
            continue
        period_by_parts[(parts[0], parts[1], parts[2])] = period

    powersets_dir = SRC_DATA / "powersets"
    patched = 0

    for power_file in powersets_dir.rglob("*.ts"):
        if power_file.name == "index.ts":
            continue

        text = power_file.read_text(encoding="utf-8")

        # Only patch files with stats.endurance
        if '"endurance":' not in text:
            continue

        # Check if it's a toggle
        if '"powerType": "Toggle"' not in text and "'powerType': 'Toggle'" not in text:
            # Also check for powerType: "Toggle" without quotes pattern
            if "powerType" not in text or "Toggle" not in text:
                continue

        # Try to find fullName in the file
        fn_match = re.search(r'fullName["\']?\s*[:=]\s*["\']([^"\']+)', text)
        if fn_match:
            fullname = fn_match.group(1)
            period = periods.get(fullname)
            if period and abs(period - DEFAULT_PERIOD) > 0.001:
                text = add_activate_period_to_stats(text, period)
                power_file.write_text(text, encoding="utf-8")
                patched += 1
                continue

        # No fullName — try to construct it from path
        # Path: powersets/tanker/primary/dark-armor/death-shroud.ts
        rel = power_file.relative_to(powersets_dir)
        parts = rel.parts  # ('tanker', 'primary', 'dark-armor', 'death-shroud.ts')
        if len(parts) < 4:
            continue

        archetype = parts[0]
        category = parts[1]  # primary, secondary, epic
        powerset_slug = parts[2]  # dark-armor
        power_slug = parts[3].replace(".ts", "")  # death-shroud

        # Convert slugs to game names
        powerset_name = slug_to_game_name(powerset_slug)
        power_name = slug_to_game_name(power_slug)

        # Get category prefix
        cat_prefixes = at_map.get(archetype, {})
        cat_prefix = cat_prefixes.get(category, "")

        if not cat_prefix:
            continue

        # Try exact match
        period = period_by_parts.get((cat_prefix, powerset_name, power_name))

        # Try fuzzy match if exact didn't work
        if period is None:
            for (cp, ps, pn), per in period_by_parts.items():
                if cp == cat_prefix and ps.lower().replace("_", "") == powerset_name.lower().replace("_", "") and pn.lower().replace("_", "") == power_name.lower().replace("_", ""):
                    period = per
                    break

        if period and abs(period - DEFAULT_PERIOD) > 0.001:
            text = add_activate_period_to_stats(text, period)
            power_file.write_text(text, encoding="utf-8")
            patched += 1

    return patched


def slug_to_game_name(slug):
    """Convert kebab-case slug to PascalCase/underscore game name."""
    # death-shroud -> Death_Shroud
    return "_".join(word.capitalize() for word in slug.split("-"))


def add_activate_period_to_stats(text, period):
    """Add activatePeriod after endurance in a stats block."""
    # Match "endurance": 0.78 (with or without trailing comma)
    pattern = r'("endurance":\s*[\d.]+)(,?)'

    def replacer(m):
        endurance_part = m.group(1)
        comma = m.group(2)
        # Ensure there's a comma after endurance
        if not comma:
            endurance_part += ","
        else:
            endurance_part += comma
        # Get indentation
        line_start = text.rfind("\n", 0, m.start()) + 1
        indent = ""
        for ch in text[line_start:]:
            if ch in " \t":
                indent += ch
            else:
                break
        return f'{endurance_part}\n{indent}"activatePeriod": {period},'

    return re.sub(pattern, replacer, text, count=1)


def patch_levels_file(periods):
    """Patch src/data/levels.ts for inherent toggle powers."""
    filepath = SRC_DATA / "levels.ts"
    text = filepath.read_text(encoding="utf-8")

    # Find toggle powers with enduranceCost
    patched = 0
    lines = text.split("\n")
    new_lines = []
    current_fullname = None

    for line in lines:
        new_lines.append(line)

        fn_match = re.search(r"fullName['\"]?\s*[:=]\s*['\"]([^'\"]+)", line)
        if fn_match:
            current_fullname = fn_match.group(1)

        end_match = re.search(r'(\s*)enduranceCost:\s*([\d.]+)', line)
        if end_match and current_fullname:
            period = periods.get(current_fullname, DEFAULT_PERIOD)
            if abs(period - DEFAULT_PERIOD) > 0.001:
                indent = end_match.group(1)
                new_lines.append(f'{indent}activatePeriod: {period},')
                patched += 1

    if patched > 0:
        filepath.write_text("\n".join(new_lines), encoding="utf-8")
    return patched


def main():
    print("Parsing powers.bin for activate_period data...")
    periods = get_toggle_periods()
    toggle_count = len(periods)
    non_default = sum(1 for p in periods.values() if abs(p - DEFAULT_PERIOD) > 0.001)
    print(f"  {toggle_count} toggle powers found, {non_default} with non-default activate_period")

    print("\nPatching power-pools-raw.ts...")
    n = patch_raw_pools(SRC_DATA / "power-pools-raw.ts", periods)
    print(f"  {n} powers patched")

    print("Patching epic-pools-raw.ts...")
    n = patch_raw_pools(SRC_DATA / "epic-pools-raw.ts", periods)
    print(f"  {n} powers patched")

    print("Patching powerset files...")
    n = patch_powerset_files(periods)
    print(f"  {n} powers patched")

    print("Patching levels.ts...")
    n = patch_levels_file(periods)
    print(f"  {n} powers patched")

    print("\nDone! Run `npx tsc --noEmit` to verify.")


if __name__ == "__main__":
    main()
