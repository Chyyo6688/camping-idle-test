from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path

from PIL import Image


FRAME_WIDTH = 128
FRAME_HEIGHT = 144
COLUMNS = 7

FRAME_NAMES = [
    "camper_idle.png",
    "camper_walk_01.png",
    "camper_walk_02.png",
    "camper_walk_03.png",
    "camper_walk_04.png",
    "camper_walk_05.png",
    "camper_walk_06.png",
    "camper_carry_wood _01.png",
    "camper_carry_wood _02.png",
    "camper_carry_wood _03.png",
    "camper_carry_wood _04.png",
    "camper_carry_wood _05.png",
    "camper_carry_wood _06.png",
    "camper_carry_wood.png",
    "camper_sit.png",
    "camper_sit_ground.png",
    "camper_sit_chair.png",
    "camper_look_lake_back.png",
    "camper_rest.png",
    "camper_activity_cook_01.png",
    "camper_activity_cook_02.png",
    "camper_activity_cook_03.png",
    "camper_activity_cook_04.png",
    "camper_activity_fish_01.png",
    "camper_activity_fish_02.png",
    "camper_activity_fish_03.png",
    "camper_activity_fish_04.png",
    "camper_activity_birdwatch_01.png",
    "camper_activity_birdwatch_02.png",
    "camper_activity_birdwatch_03.png",
    "camper_activity_birdwatch_04.png",
]
ROWS = math.ceil(len(FRAME_NAMES) / COLUMNS)
EXPECTED_SIZE = (FRAME_WIDTH * COLUMNS, FRAME_HEIGHT * ROWS)


def read_game_asset_sheets(game_js_path: Path) -> list[str]:
    game_js = game_js_path.read_text(encoding="utf-8")
    sheets = set(re.findall(r'assetSheet:\s*"([^"]+)"', game_js))
    sheets.update(re.findall(r'sheet:\s*"([^"]+\.png)"', game_js))
    sheets.discard("")
    return sorted(sheets)


def validate_sheet(sheet_dir: Path, sheet_name: str) -> dict[str, object]:
    sheet_path = sheet_dir / sheet_name

    if not sheet_path.exists():
        raise FileNotFoundError(sheet_path)

    image = Image.open(sheet_path)

    if image.size != EXPECTED_SIZE:
        raise ValueError(f"{sheet_path} is {image.size}, expected {EXPECTED_SIZE}")

    if image.mode != "RGBA":
        raise ValueError(f"{sheet_path} is {image.mode}, expected RGBA")

    alpha = image.getchannel("A")
    extrema = alpha.getextrema()

    if extrema[0] == 255:
        raise ValueError(f"{sheet_path} has no transparent pixels")

    return {
        "path": sheet_path.as_posix(),
        "size": list(image.size),
        "mode": image.mode,
        "alphaExtrema": list(extrema),
        "bbox": list(image.getbbox() or ()),
    }


def write_manifest(sheet_dir: Path, sheets: list[str], details: dict[str, dict[str, object]]) -> None:
    manifest = {
        "frameWidth": FRAME_WIDTH,
        "frameHeight": FRAME_HEIGHT,
        "columns": COLUMNS,
        "rows": ROWS,
        "frameNames": FRAME_NAMES,
        "sourceDir": sheet_dir.as_posix(),
        "renderMode": "css-sheet-background-position",
        "sheets": sheets,
        "details": details,
    }
    (sheet_dir / "layer_manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sheet-dir", type=Path, default=Path("assets/characters"))
    parser.add_argument("--game-js", type=Path, default=Path("game.js"))
    parser.add_argument("--write-manifest", action="store_true")
    args = parser.parse_args()

    sheets = read_game_asset_sheets(args.game_js)

    if not sheets:
        raise SystemExit("No assetSheet entries found in game.js")

    details = {}

    for sheet in sheets:
        details[sheet] = validate_sheet(args.sheet_dir, sheet)

    if args.write_manifest:
        write_manifest(args.sheet_dir, sheets, details)

    print(f"Validated {len(sheets)} camper sheets in {args.sheet_dir.as_posix()}")


if __name__ == "__main__":
    main()
