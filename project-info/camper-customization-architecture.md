# Camper Customization Architecture

## Asset Source

The current customization source is:

`assets/characters/`

Each source sheet is `896x432`, with a `7 x 3` grid of `128x144` frames.

Runtime no longer uses generated per-frame PNG folders. Each appearance option points to one full sheet, and CSS `background-position` selects the active `128x144` frame from that sheet.

Sheet validation lives at:

`tools/validate_camper_sheets.py`

## Layer Order

Runtime rendering stacks layers in this order:

1. `camper_body_base.png`
2. selected eye sheet
3. selected nose sheet
4. selected mouth sheet
5. selected hair sheet
6. selected bottoms sheet
7. selected top sheet

The body base includes the wood logs, boots, base underclothes, and bald/no-feature face.

## Current Options

The UI exposes eight customization categories:

- `body`
- `skin`
- `hair`
- `eyes`
- `nose`
- `mouth`
- `top`
- `bottoms`

Some choices are still placeholders, but every `camper_*.png` sheet in `assets/characters/` is wired into the UI.

`skin` is saved in the profile schema now, but it does not change rendering yet because there is no separate skin overlay layer. Future skin work should split skin from `body_base` or add a tint-safe body variant pipeline.

## Updating Options

Runtime option wiring lives in `gameContent.js` under `CAMPER_APPEARANCE_OPTIONS`.

- To change the in-game display name, edit the option's `label`.
- To point an option to a renamed PNG, edit the option's `assetSheet`.
- Keep option `id` stable when possible because saved camper profiles store the `id`.
- Add new options by adding another object with `id`, `label`, and `assetSheet`.
- After changing sheets or wiring, run `tools/validate_camper_sheets.py --write-manifest`.

## Profile Flow

New player flow:

`name -> appearance -> personality questions -> result`

Manual Camper button flow uses the same panel and can update the saved appearance without resetting camp progress.

## Save Shape

Each saved camper profile now includes:

```json
{
  "name": "Moss",
  "personalityId": "slowMood",
  "appearance": {
    "body": "base",
    "skin": "warm",
    "hair": "short",
    "eyes": "bright",
    "nose": "tiny",
    "mouth": "small-smile",
    "top": "top-1",
    "bottoms": "denim"
  }
}
```

Old saves get a default appearance automatically when loaded.
