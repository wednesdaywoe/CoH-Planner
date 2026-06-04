"""
Phase 1 extraction-completeness audit: diff the authoritative `.powers` raw defs
against our `exported_powers` JSON to find what the bin parser drops.

Per power it compares two things and aggregates across the whole set:
  1. ATTRIBS  — every attrib named in a `.powers` AttribMod should appear in some
     exported template. Attribs present in `.powers` but absent from our export are
     candidates the parser drops (the "unmapped exotic attrib" class).
  2. POWER FIELDS — every `.powers` power-level scalar should map to an export field
     (asset-reference fields are expected-skips and are reported separately).

Usage:
  py -3 tools/extraction-audit/audit.py [--limit N] [--power Energy_Torrent] [--json out.json]

Output: a ranked report (most-frequently-missing first) so we can prioritise parser
fixes by impact, not anecdote.
"""

from __future__ import annotations
import sys, json, argparse
from pathlib import Path
from collections import Counter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from parse_powers import parse_powers_file, iter_attribmods  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
RAW_DEFS = ROOT / "raw defs"
EXPORT = ROOT / "exported_powers"

# `.powers` power-level fields that are pure asset/presentation references — we
# deliberately don't import these (2026-06-04 rule: capture mechanics, skip asset
# refs). Reported separately, never counted as gaps.
ASSET_FIELDS = {
    "visualfx", "include", "iconname", "fxstart", "fxidle", "fxstop", "fxattack",
    "fxblock", "fxhit", "fxdeath", "fxstartfidget", "fxfidget", "deviceanim",
    "displayname", "displayhelp", "displayshorthelp", "displaypowerdefault",
    # presentation / targeting-UI strings — not mechanics
    "displaytargetshorthelp", "displaytargethelp", "displayattackerhit",
    "displayvictimhit", "displayattackerhitself", "displayfloat", "displaycaster",
    "highlightring", "highlighteval", "highlighticon",
}

# Normalised `.powers` field names we KNOW are captured in the export (possibly
# under a renamed key — e.g. TimeToActivate -> activation_time). Anything not here
# and not an asset ref surfaces as a genuine "field we don't capture" candidate.
CAPTURED_FIELDS = {
    "name", "type", "accuracy", "attacktypes", "entsaffected", "entsautohit",
    "target", "targetsecondary", "range", "rangesecondary", "endurancecost",
    "timetoactivate", "rechargetime", "effectarea", "radius", "arc",
    "boostsallowed", "maxtargetshit", "requires", "activaterequires",
    "targetrequires", "interrupttime", "activateperiod", "numallowed",
    "numcharges", "usagetime", "lifetime", "shortname", "castthrough",
    "targetsautohit", "targetsaffected",
}


def norm_field(name: str) -> str:
    return name.lower().replace("_", "")


def norm_attrib(name: str) -> str:
    """Normalise a `.powers` (kEnergy) or export (Energy_Dmg) attrib to a common key."""
    s = name.strip()
    if s.startswith("k") and len(s) > 1 and s[1].isupper():
        s = s[1:]
    s = s.lower().replace("_", "")
    for suf in ("dmg", "attack", "boost"):
        if s.endswith(suf) and len(s) > len(suf):
            s = s[: -len(suf)]
    return s


def powers_path_to_export(fullname: str) -> Path:
    # Blaster_Ranged.Energy_Blast.Energy_Torrent -> exported_powers/blaster_ranged/energy_blast/energy_torrent.json
    parts = fullname.split(".")
    return EXPORT.joinpath(*[p.lower() for p in parts]).with_suffix(".json")


def collect_export_attribs(power_json: dict) -> set[str]:
    out: set[str] = set()

    def walk(groups):
        for g in groups or []:
            if not isinstance(g, dict):
                continue
            for t in g.get("templates", []) or []:
                if isinstance(t, dict):
                    for a in t.get("attribs", []) or []:
                        if a:
                            out.add(norm_attrib(str(a)))
            walk(g.get("child_effects"))

    walk(power_json.get("effects"))
    return out


def audit_power(powers_file: Path):
    """Return (fullname, missing_attribs:set, missing_fields:set, asset_fields:set) or None."""
    try:
        pw = parse_powers_file(powers_file)
    except Exception as e:  # noqa: BLE001
        return ("PARSE_ERROR:" + powers_file.name, {str(e)}, set(), set())
    fullname = pw.get("fullname") or powers_file.stem
    export_path = powers_path_to_export(fullname)
    if not export_path.exists():
        return None  # no matching export (e.g. category we don't export) — skip
    try:
        ej = json.loads(export_path.read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return None
    if isinstance(ej, list):
        ej = ej[0] if ej else {}

    # --- attribs ---
    powers_attribs: set[str] = set()
    for _ei, am in iter_attribmods(pw):
        a = am.get("Attrib")
        raw_vals = a if isinstance(a, list) else [a]
        for item in raw_vals:
            if not item:
                continue
            # A single Attrib line may list several space-separated attribs
            # (e.g. `Attrib kSmashing kLethal kFire ...`).
            for tok in str(item).split():
                powers_attribs.add(norm_attrib(tok))
    export_attribs = collect_export_attribs(ej)
    missing_attribs = {a for a in powers_attribs if a and a not in export_attribs}

    # --- power-level fields ---
    export_field_norms = {norm_field(k) for k in ej.keys()}
    missing_fields: set[str] = set()
    asset_fields: set[str] = set()
    for k, v in pw.items():
        if k in ("fullname",):
            continue
        if isinstance(v, list) and v and isinstance(v[0], dict):
            continue  # block (Effect/AttribMod/etc.), handled via attribs
        nf = norm_field(k)
        if nf in ASSET_FIELDS:
            asset_fields.add(k)
        elif nf in CAPTURED_FIELDS or nf in export_field_norms:
            continue  # captured (possibly under a renamed key)
        else:
            missing_fields.add(k)
    return (fullname, missing_attribs, missing_fields, asset_fields)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--power", type=str, default=None, help="filter to powers whose file stem contains this")
    ap.add_argument("--json", type=str, default=None)
    args = ap.parse_args()

    files = sorted(RAW_DEFS.rglob("*.powers"))
    if args.power:
        files = [f for f in files if args.power.lower() in f.stem.lower()]
    if args.limit:
        files = files[: args.limit]

    attrib_counter: Counter = Counter()
    field_counter: Counter = Counter()
    asset_counter: Counter = Counter()
    attrib_examples: dict[str, str] = {}
    field_examples: dict[str, str] = {}
    audited = 0
    no_export = 0

    for f in files:
        res = audit_power(f)
        if res is None:
            no_export += 1
            continue
        fullname, miss_a, miss_f, asset_f = res
        audited += 1
        for a in miss_a:
            attrib_counter[a] += 1
            attrib_examples.setdefault(a, fullname)
        for fld in miss_f:
            field_counter[fld] += 1
            field_examples.setdefault(fld, fullname)
        for af in asset_f:
            asset_counter[af] += 1

    print(f"\n=== EXTRACTION AUDIT (Phase 1: .powers vs exported_powers) ===")
    print(f"raw .powers files: {len(files)}   audited (have export): {audited}   no-export (skipped): {no_export}\n")

    print(f"--- ATTRIBS in .powers but MISSING from our export (top 40 by power count) ---")
    for a, c in attrib_counter.most_common(40):
        print(f"  {c:5d}  {a:24s}  e.g. {attrib_examples[a]}")
    if not attrib_counter:
        print("  (none — every .powers attrib appears in our export)")

    print(f"\n--- POWER-LEVEL FIELDS in .powers but MISSING from our export (top 40) ---")
    for fld, c in field_counter.most_common(40):
        print(f"  {c:5d}  {fld:24s}  e.g. {field_examples[fld]}")
    if not field_counter:
        print("  (none)")

    print(f"\n--- ASSET-REF fields (intentionally skipped, for reference) ---")
    for af, c in asset_counter.most_common(15):
        print(f"  {c:5d}  {af}")

    if args.json:
        Path(args.json).write_text(json.dumps({
            "audited": audited, "no_export": no_export,
            "missing_attribs": attrib_counter.most_common(),
            "missing_fields": field_counter.most_common(),
            "asset_fields": asset_counter.most_common(),
        }, indent=2), encoding="utf-8")
        print(f"\nwrote {args.json}")


if __name__ == "__main__":
    main()
