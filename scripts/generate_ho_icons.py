"""Generate colored arc overlays for Hamidon Origin enhancement icons.

Outputs arc-only PNGs on transparent backgrounds, ready for manual
compositing with HamidonCore.png and e_frame_HO.png.

Usage:
    py -3 scripts/generate_ho_icons.py
"""

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    print("Pillow is required: py -3 -m pip install Pillow")
    raise SystemExit(1)

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SPECIAL_DIR = PROJECT_ROOT / "public" / "img" / "Enhancements" / "Special"
OUT_DIR = SPECIAL_DIR / "arcs"

# The 9 missing HO enhancements and their aspect colors
MISSING_HOS = {
    "HOVesicle": [
        ("EnduranceModification", (96, 165, 250)),   # blue-400
        ("Recharge",              (203, 213, 225)),   # slate-300
    ],
    "HOStereocilia": [
        ("Slow",                  (45, 212, 191)),    # teal-400
        ("Recharge",              (203, 213, 225)),   # slate-300
        ("EnduranceReduction",    (96, 165, 250)),    # blue-400
    ],
    "HOMicrotubule": [
        ("EnduranceModification", (96, 165, 250)),    # blue-400
        ("Accuracy",              (250, 204, 21)),    # yellow-400
    ],
    "HOKaryoplasm": [
        ("Damage",                (248, 113, 113)),   # red-400
        ("EnduranceReduction",    (96, 165, 250)),    # blue-400
    ],
    "HOMicrovillus": [
        ("Accuracy",              (250, 204, 21)),    # yellow-400
        ("Range",                 (203, 213, 225)),   # slate-300
    ],
    "HOChromatin": [
        ("Damage",                (248, 113, 113)),   # red-400
        ("Recharge",              (203, 213, 225)),   # slate-300
    ],
    "HOEctosome": [
        ("Taunt",                 (249, 168, 212)),   # pink-400
        ("Accuracy",              (250, 204, 21)),    # yellow-400
        ("Recharge",              (203, 213, 225)),   # slate-300
    ],
    "HOAmyloplast": [
        ("Recharge",              (203, 213, 225)),   # slate-300
        ("Healing",               (74, 222, 128)),    # green-400
        ("Absorb",                (74, 222, 128)),    # green-400
    ],
    "HOChloroplast": [
        ("Accuracy",              (250, 204, 21)),    # yellow-400
        ("Healing",               (74, 222, 128)),    # green-400
        ("Absorb",                (74, 222, 128)),    # green-400
    ],
}


def dedupe_colors(aspects: list[tuple[str, tuple]]) -> list[tuple]:
    """Merge aspects with identical colors into single arcs."""
    seen = []
    for _, color in aspects:
        if color not in seen:
            seen.append(color)
    return seen


def draw_arc_overlay(size: int, colors: list[tuple], thickness: int = 7) -> Image.Image:
    """Draw colored arc segments on a transparent background.

    Arcs are evenly distributed around the circle with soft glow edges.
    """
    # Work at 4x resolution for smooth anti-aliasing
    scale = 4
    big = size * scale
    overlay = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    n = len(colors)
    arc_span = 360 / n
    arc_draw = arc_span          # no gaps — segments meet edge-to-edge

    t = int(thickness * 1.5 * scale)  # 1.5x thicker
    # Keep outer radius the same — expand inward by increasing margin only for bbox calc
    margin = scale * 2            # small outer margin
    bbox = [margin, margin, big - margin, big - margin]

    for i, color in enumerate(colors):
        start = i * arc_span - 90
        end = start + arc_draw
        r, g, b = color
        draw.arc(bbox, start, end, fill=(r, g, b, 255), width=t)

        # Inner glow
        inner_bbox = [b + scale * 2 for b in bbox[:2]] + [b - scale * 2 for b in bbox[2:]]
        draw.arc(inner_bbox, start, end, fill=(r, g, b, 160), width=t // 2)

    # Soft glow
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=scale * 1.5))

    # Crisp arcs on top
    draw2 = ImageDraw.Draw(overlay)
    t_crisp = int(t * 0.7)
    for i, color in enumerate(colors):
        start = i * arc_span - 90
        end = start + arc_draw
        r, g, b = color
        draw2.arc(bbox, start, end, fill=(r, g, b, 230), width=t_crisp)

    overlay = overlay.resize((size, size), Image.LANCZOS)
    return overlay


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Use 64x64 to match HamidonCore.png dimensions
    size = 64

    for name, aspects in MISSING_HOS.items():
        colors = dedupe_colors(aspects)
        arcs = draw_arc_overlay(size, colors)
        out_path = OUT_DIR / f"{name}_arcs.png"
        arcs.save(out_path, "PNG")
        color_names = [a[0] for a in aspects]
        print(f"  OK   {name}_arcs.png ({', '.join(color_names)}) -> {len(colors)} arcs")

    print(f"\nDone: {len(MISSING_HOS)} arc overlays saved to {OUT_DIR}")


if __name__ == "__main__":
    main()
