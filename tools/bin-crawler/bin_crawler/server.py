"""Bin Crawler — stdlib HTTP server with JSON API over parsed bin data.

Supports multiple data sources (e.g. Homecoming, Rebirth).
Usage:
  py -3 -m bin_crawler.server
  py -3 -m bin_crawler.server --source hc="G:/Homecoming/assets/live" --source rebirth="/tmp/rebirth_bins"
"""

import argparse
import json
import sys
import webbrowser
from dataclasses import asdict
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from socketserver import ThreadingMixIn
from urllib.parse import parse_qs, urlparse

from .parser import parse_powers as parse_power_stats, parse_powersets, parse_powercats, parse_classes, load_messages, BinResolver

DEFAULT_ASSETS_DIR = Path(r"G:\Homecoming\assets\live")


class DataSource:
    """Holds parsed data for one data source."""
    __slots__ = ("name", "label", "powers", "powers_dicts", "categories",
                 "cat_to_powersets", "total", "powerset_dicts", "powercat_dicts",
                 "class_dicts", "villain_class_dicts")

    def __init__(self, name: str, label: str):
        self.name = name
        self.label = label
        self.powers = []
        self.powers_dicts: list[dict] = []
        self.categories: list[str] = []
        self.cat_to_powersets: dict[str, list[str]] = {}
        self.total: int = 0
        self.powerset_dicts: list[dict] = []
        self.powercat_dicts: list[dict] = []
        self.class_dicts: list[dict] = []
        self.villain_class_dicts: list[dict] = []


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


class StatsHandler(BaseHTTPRequestHandler):
    # Shared class-level state (set before server starts)
    sources: dict[str, DataSource] = {}
    default_source: str = ""
    static_dir: Path = Path(__file__).resolve().parent / "static"

    def log_message(self, fmt, *args):
        sys.stderr.write(f"{args[0]}\n")

    def _params(self):
        return {k: v[0] for k, v in parse_qs(urlparse(self.path).query).items()}

    def _get_source(self) -> DataSource:
        p = self._params()
        name = p.get("source", self.default_source)
        return self.sources.get(name, self.sources[self.default_source])

    def _json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_static(self, filename):
        fpath = self.static_dir / filename
        if not fpath.is_file():
            self.send_error(404)
            return
        data = fpath.read_bytes()
        ct_map = {".html": "text/html", ".css": "text/css", ".js": "application/javascript"}
        ext = fpath.suffix
        ct = ct_map.get(ext, "application/octet-stream")
        self.send_response(200)
        self.send_header("Content-Type", ct)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    # --- Routes ---

    def do_GET(self):
        path = urlparse(self.path).path
        routes = {
            "/": lambda: self._serve_static("index.html"),
            "/api/sources": self._api_sources,
            "/api/stats": self._api_stats,
            "/api/categories": self._api_categories,
            "/api/powersets": self._api_powersets,
            "/api/powers": self._api_powers,
            "/api/export": self._api_export,
            "/api/classes": self._api_classes,
        }
        handler = routes.get(path)
        if handler:
            try:
                handler()
            except Exception as e:
                self._json({"error": str(e)}, 500)
        else:
            self.send_error(404)

    def _api_sources(self):
        self._json([
            {"name": s.name, "label": s.label, "total": s.total,
             "categories": len(s.categories),
             "powersets": sum(len(v) for v in s.cat_to_powersets.values())}
            for s in self.sources.values()
        ])

    def _api_stats(self):
        src = self._get_source()
        self._json({
            "source": src.name,
            "total": src.total,
            "categories": len(src.categories),
            "powersets": sum(len(v) for v in src.cat_to_powersets.values()),
        })

    def _api_categories(self):
        src = self._get_source()
        self._json(src.categories)

    def _api_powersets(self):
        src = self._get_source()
        p = self._params()
        cat = p.get("category", "")
        if cat and cat in src.cat_to_powersets:
            self._json(src.cat_to_powersets[cat])
        else:
            all_ps = []
            for ps_list in src.cat_to_powersets.values():
                all_ps.extend(ps_list)
            self._json(sorted(set(all_ps)))

    def _api_powers(self):
        src = self._get_source()
        p = self._params()
        q = p.get("q", "").lower()
        category = p.get("category", "")
        powerset = p.get("powerset", "")
        area = p.get("area", "")
        sort_col = p.get("sort", "full_name")
        desc = p.get("desc", "") == "1"
        limit = int(p.get("limit", "200"))

        results = src.powers_dicts
        boost = p.get("boost", "")
        if q:
            results = [pw for pw in results
                       if q in pw["full_name"].lower()
                       or q in pw["display_name"].lower()]
        if category:
            results = [pw for pw in results if pw["category"] == category]
        if powerset:
            results = [pw for pw in results if pw["powerset"] == powerset]
        if area:
            results = [pw for pw in results if pw["effect_area_name"] == area]
        if boost:
            results = [pw for pw in results
                       if boost in pw["boosts_allowed"]]

        # Sort
        valid_cols = {
            "full_name", "display_name", "category", "powerset", "power_name",
            "effect_area_name", "max_targets_hit", "range", "radius",
            "activate_period", "recharge_time", "endurance_cost",
        }
        if sort_col not in valid_cols:
            sort_col = "full_name"
        results = sorted(results, key=lambda r: r.get(sort_col, ""),
                         reverse=desc)

        total_matched = len(results)
        if limit:
            results = results[:limit]

        self._json({"source": src.name, "count": total_matched, "powers": results})

    def _api_classes(self):
        src = self._get_source()
        p = self._params()
        name = p.get("name", "")
        include_villain = p.get("villain", "") == "1"

        classes = src.class_dicts
        if include_villain:
            classes = classes + src.villain_class_dicts
        if name:
            classes = [c for c in classes if c["name"] == name]

        self._json({"source": src.name, "count": len(classes), "classes": classes})

    def _api_export(self):
        src = self._get_source()
        p = self._params()
        category = p.get("category", "")
        powerset = p.get("powerset", "")

        if powerset and category:
            # Export a single powerset + its powers
            ps_key = category + "." + powerset
            ps = next((ps for ps in src.powerset_dicts if ps["key"] == ps_key), None)
            powers = [pw for pw in src.powers_dicts
                      if pw["category"] == category and pw["powerset"] == powerset]
            self._json({
                "source": src.name,
                "powerset": ps,
                "powers": powers,
            })
        elif powerset:
            # Powerset without category — match all categories
            matching_ps = [ps for ps in src.powerset_dicts
                           if ps["key"].endswith("." + powerset)]
            powers = [pw for pw in src.powers_dicts if pw["powerset"] == powerset]
            self._json({
                "source": src.name,
                "powersets": matching_ps,
                "powers": powers,
            })
        elif category:
            # Export a category + its powersets + all powers
            pc = next((pc for pc in src.powercat_dicts if pc["key"] == category), None)
            cat_ps_names = src.cat_to_powersets.get(category, [])
            ps_keys = {category + "." + ps_name for ps_name in cat_ps_names}
            powersets = [ps for ps in src.powerset_dicts if ps["key"] in ps_keys]
            powers = [pw for pw in src.powers_dicts if pw["category"] == category]
            self._json({
                "source": src.name,
                "powercat": pc,
                "powersets": powersets,
                "powers": powers,
            })
        else:
            # Export everything
            self._json({
                "source": src.name,
                "powers": src.powers_dicts,
                "powersets": src.powerset_dicts,
                "powercats": src.powercat_dicts,
            })


def load_source(name: str, label: str, assets_dir: Path) -> DataSource:
    """Load and parse all binary data from an assets directory into a DataSource.

    Accepts either a directory containing .pigg archives (preferred) or a
    directory of loose .bin files (legacy). Pigg archives are always preferred
    as they contain the most up-to-date data from the game client.
    """
    src = DataSource(name, label)

    resolver = BinResolver(assets_dir)
    print(f"  [{name}] Source: {resolver.source_description}", flush=True)

    if not resolver.has("powers.bin"):
        print(f"  Warning: powers.bin not found via {resolver.source_description}", file=sys.stderr)
        return src

    # Load message table for display name resolution
    msgs = None
    if resolver.has("clientmessages-en.bin"):
        print(f"  [{name}] Loading message table...", flush=True)
        msgs = load_messages(resolver.read("clientmessages-en.bin"))
        print(f"  [{name}] {len(msgs)} messages loaded.", flush=True)

    # Parse powers
    print(f"  [{name}] Parsing powers.bin...", flush=True)
    powers = parse_power_stats(resolver.read("powers.bin"))
    print(f"  [{name}] {len(powers)} power records loaded.", flush=True)

    # Parse powersets
    if resolver.has("powersets.bin"):
        print(f"  [{name}] Parsing powersets.bin...", flush=True)
        ps_records = parse_powersets(resolver.read("powersets.bin"))
        src.powerset_dicts = [asdict(ps) for ps in ps_records]
        print(f"  [{name}] {len(ps_records)} powerset records loaded.", flush=True)

    # Parse powercats
    if resolver.has("powercats.bin"):
        print(f"  [{name}] Parsing powercats.bin...", flush=True)
        pc_records = parse_powercats(resolver.read("powercats.bin"))
        src.powercat_dicts = [asdict(pc) for pc in pc_records]
        print(f"  [{name}] {len(pc_records)} powercat records loaded.", flush=True)

    # Parse classes
    if resolver.has("classes.bin"):
        print(f"  [{name}] Parsing classes.bin...", flush=True)
        cls_records = parse_classes(resolver.read("classes.bin"))
        src.class_dicts = [asdict(c) for c in cls_records]
        print(f"  [{name}] {len(cls_records)} class records loaded.", flush=True)

    if resolver.has("villain_classes.bin"):
        print(f"  [{name}] Parsing villain_classes.bin...", flush=True)
        vcls_records = parse_classes(resolver.read("villain_classes.bin"))
        src.villain_class_dicts = [asdict(c) for c in vcls_records]
        print(f"  [{name}] {len(vcls_records)} villain class records loaded.", flush=True)

    # Resolve P-hash display names
    if msgs:
        for pw in powers:
            pw.display_name = msgs.resolve(pw.display_name)
            pw.display_help = msgs.resolve(pw.display_help)
            pw.short_help = msgs.resolve(pw.short_help)

    # Build lookup structures
    powers_dicts = []
    cat_set = set()
    cat_to_ps: dict[str, set[str]] = {}
    for pw in powers:
        d = asdict(pw)
        d["category"] = pw.category
        d["powerset"] = pw.powerset
        d["power_name"] = pw.power_name
        d["effect_area_name"] = pw.effect_area_name
        powers_dicts.append(d)
        cat_set.add(pw.category)
        cat_to_ps.setdefault(pw.category, set()).add(pw.powerset)

    src.powers = powers
    src.powers_dicts = powers_dicts
    src.total = len(powers)
    src.categories = sorted(cat_set)
    src.cat_to_powersets = {k: sorted(v) for k, v in cat_to_ps.items()}

    return src


def main():
    ap = argparse.ArgumentParser(description="Power Stats Browser")
    ap.add_argument("--assets-dir", type=Path, default=None,
                    help="Path to assets directory (with .pigg files or bin/ subdir)")
    ap.add_argument("--source", action="append", metavar="NAME=PATH",
                    help="Named data source, e.g. --source hc=G:/Homecoming/assets/live")
    ap.add_argument("--port", "-p", type=int, default=8090)
    ap.add_argument("--no-browser", action="store_true")
    args = ap.parse_args()

    # Build source list
    source_specs: list[tuple[str, str, Path]] = []  # (name, label, path)

    if args.source:
        for spec in args.source:
            if "=" not in spec:
                print(f"Invalid --source format: {spec!r} (expected NAME=PATH)", file=sys.stderr)
                sys.exit(1)
            name, path_str = spec.split("=", 1)
            label = name.replace("_", " ").title()
            source_specs.append((name, label, Path(path_str)))
    elif args.assets_dir:
        source_specs.append(("default", "Default", args.assets_dir))
    else:
        # Default: load Homecoming from assets/live (reads pigg archives)
        source_specs.append(("hc", "Homecoming", DEFAULT_ASSETS_DIR))

    if not source_specs:
        print("No data sources specified.", file=sys.stderr)
        sys.exit(1)

    # Load all sources
    sources: dict[str, DataSource] = {}
    for name, label, path in source_specs:
        print(f"Loading source '{name}' from {path}...", flush=True)
        sources[name] = load_source(name, label, path)

    StatsHandler.sources = sources
    StatsHandler.default_source = source_specs[0][0]

    addr = ("127.0.0.1", args.port)
    server = ThreadingHTTPServer(addr, StatsHandler)
    url = f"http://127.0.0.1:{args.port}"
    total_powers = sum(s.total for s in sources.values())
    print(f"\nServing {len(sources)} source(s), {total_powers} total powers on {url}", flush=True)

    if not args.no_browser:
        webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.shutdown()


if __name__ == "__main__":
    main()
