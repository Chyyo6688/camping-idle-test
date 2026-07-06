from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


ROOT = Path(__file__).resolve().parents[2]
REF = ROOT / "assets" / "characters" / "polished" / "camper_sprite_sheet_polished_all.png"
OUT = ROOT / "assets" / "characters" / "layers_redraw"
SHEETS = OUT / "sheets"
FRAMES = OUT / "frames"
PREVIEW = OUT / "preview"

FRAME_W = 128
FRAME_H = 144
COLS = 7
ROWS = 3
SHEET_W = FRAME_W * COLS
SHEET_H = FRAME_H * ROWS
ORDER = ["body_base", "eyes", "nose", "mouth", "hair", "bottoms", "top"]


def ensure_dirs() -> None:
    for path in (SHEETS, FRAMES, PREVIEW):
        path.mkdir(parents=True, exist_ok=True)


def open_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def validate(path: Path) -> dict:
    image = open_rgba(path)
    alpha = image.getchannel("A")
    stat = ImageStat.Stat(alpha)
    opaque = sum(1 for v in alpha.getdata() if v > 0)
    bbox = alpha.getbbox()
    return {
        "path": str(path),
        "width": image.width,
        "height": image.height,
        "ok_size": image.size == (SHEET_W, SHEET_H),
        "has_alpha": image.mode == "RGBA",
        "alpha_min": int(stat.extrema[0][0]),
        "alpha_max": int(stat.extrema[0][1]),
        "nontransparent_pixels": opaque,
        "alpha_bbox": bbox,
    }


def fit_to_sheet(src: Path, dst: Path) -> None:
    image = open_rgba(src)
    if image.size != (SHEET_W, SHEET_H):
        image = image.resize((SHEET_W, SHEET_H), Image.Resampling.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    image.save(dst)


def split_sheet(sheet: Path, layer: str) -> None:
    image = open_rgba(sheet)
    if image.size != (SHEET_W, SHEET_H):
        raise SystemExit(f"{sheet} must be {SHEET_W}x{SHEET_H}, got {image.width}x{image.height}")
    target = FRAMES / layer
    target.mkdir(parents=True, exist_ok=True)
    for row in range(ROWS):
        for col in range(COLS):
            index = row * COLS + col
            frame = image.crop((col * FRAME_W, row * FRAME_H, (col + 1) * FRAME_W, (row + 1) * FRAME_H))
            frame.save(target / f"{layer}_{index:02d}.png")


def composite(layers: list[str]) -> dict:
    ensure_dirs()
    base = Image.new("RGBA", (SHEET_W, SHEET_H), (0, 0, 0, 0))
    present = []
    for layer in layers:
        path = SHEETS / f"camper_{layer}.png"
        if not path.exists():
            continue
        image = open_rgba(path)
        if image.size != (SHEET_W, SHEET_H):
            raise SystemExit(f"{path} must be {SHEET_W}x{SHEET_H}, got {image.width}x{image.height}")
        base.alpha_composite(image)
        present.append(layer)

    comp_path = PREVIEW / "camper_layers_composite.png"
    diff_path = PREVIEW / "camper_layers_diff.png"
    metrics_path = PREVIEW / "camper_layers_metrics.json"
    base.save(comp_path)

    ref = open_rgba(REF)
    diff = ImageChops.difference(ref, base)
    diff.save(diff_path)
    rgb_diff = diff.convert("RGB")
    stat = ImageStat.Stat(rgb_diff)
    diff_pixels = 0
    frame_metrics = []
    for row in range(ROWS):
        for col in range(COLS):
            box = (col * FRAME_W, row * FRAME_H, (col + 1) * FRAME_W, (row + 1) * FRAME_H)
            crop = rgb_diff.crop(box)
            hot = sum(1 for px in crop.getdata() if max(px) > 12)
            diff_pixels += hot
            frame_metrics.append(
                {
                    "frame": row * COLS + col,
                    "x": box[0],
                    "y": box[1],
                    "changed_pixels_gt12": hot,
                }
            )

    metrics = {
        "reference": str(REF),
        "layers": present,
        "composite": str(comp_path),
        "diff": str(diff_path),
        "sheet_size": [SHEET_W, SHEET_H],
        "mean_rgb_abs_diff": [round(v, 3) for v in stat.mean],
        "changed_pixels_gt12": diff_pixels,
        "frames": frame_metrics,
    }
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


def manifest() -> None:
    ensure_dirs()
    data = {
        "reference": str(REF.relative_to(ROOT)),
        "frameWidth": FRAME_W,
        "frameHeight": FRAME_H,
        "columns": COLS,
        "rows": ROWS,
        "layerOrder": ORDER,
        "sheets": {layer: str((SHEETS / f"camper_{layer}.png").relative_to(ROOT)) for layer in ORDER},
    }
    (OUT / "layer_manifest.json").write_text(json.dumps(data, indent=2), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_validate = sub.add_parser("validate")
    p_validate.add_argument("paths", nargs="+")

    p_fit = sub.add_parser("fit")
    p_fit.add_argument("src")
    p_fit.add_argument("dst")

    p_split = sub.add_parser("split")
    p_split.add_argument("sheet")
    p_split.add_argument("layer")

    p_comp = sub.add_parser("composite")
    p_comp.add_argument("layers", nargs="*", default=ORDER)

    sub.add_parser("manifest")

    args = parser.parse_args()
    ensure_dirs()

    if args.cmd == "validate":
        print(json.dumps([validate(Path(p)) for p in args.paths], indent=2))
    elif args.cmd == "fit":
        fit_to_sheet(Path(args.src), Path(args.dst))
    elif args.cmd == "split":
        split_sheet(Path(args.sheet), args.layer)
    elif args.cmd == "composite":
        print(json.dumps(composite(args.layers), indent=2))
    elif args.cmd == "manifest":
        manifest()


if __name__ == "__main__":
    main()
