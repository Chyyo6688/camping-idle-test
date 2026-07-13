# Camper Customization Architecture

## Asset Source

The current customization source is:

`assets/characters/`

Each source sheet is `896x864`, with a `7 x 6` grid of `128x144` frames.

Runtime no longer uses generated per-frame PNG folders. Each appearance option points to one full sheet, and CSS `background-position` selects the active `128x144` frame from that sheet.

Sheet validation lives at:

`tools/validate_camper_sheets.py`

## Layer Order

Runtime rendering stacks layers in this order:

1. `camper_body_base.png`
2. selected eye sheet
3. selected nose sheet
4. selected mouth sheet
5. selected clothes sheet
6. selected hair sheet
7. selected accessory sheet

The body base includes the wood logs, boots, base underclothes, and bald/no-feature face.

## Current Options

The UI exposes seven customization categories:

- `hair`
- `hairColor`
- `eyes`
- `nose`
- `mouth`
- `clothes`
- `accessory`

`hairColor` is stored as a hue value and applied as a filter to the selected hair layer. `accessory` supports a stable `none` option with no asset sheet.

## Updating Options

Runtime option wiring lives in `js/config/camperConfig.js` under `CAMPER_APPEARANCE_OPTIONS`.

- To change the in-game display name, edit the option's `label`.
- To point an option to a renamed PNG, edit the option's `assetSheet`.
- Keep option `id` stable when possible because saved camper profiles store the `id`.
- Add new options by adding another object with `id`, `label`, and `assetSheet`.
- After changing sheets or wiring, run `tools/validate_camper_sheets.py --write-manifest`.

## Profile Flow

New player flow:

`name -> appearance -> personality questions -> result`

Manual Camper button flow uses the same panel and can update the saved appearance without resetting camp progress.

The personality quiz always selects five questions. `CAMPER_PROFILE_QUESTION_CATEGORIES` contains five categories with multiple interchangeable questions, and runtime selects one question from each category before shuffling the five selected questions. Personality IDs remain stable. Answers store `personalityScores` with a clear primary score and optional secondary score, plus small `traitModifiers`.

## Save Shape

Each saved camper profile now includes:

```json
{
  "name": "Moss",
  "personalityId": "slowMood",
  "appearance": {
    "hair": "short",
    "hairColor": 0,
    "eyes": "bright",
    "nose": "tiny",
    "mouth": "small-smile",
    "clothes": "top-1",
    "accessory": "none"
  },
  "baseTraits": {
    "courage": 45,
    "curiosity": 58,
    "sociability": 45,
    "preparedness": 42,
    "observation": 72,
    "rationality": 56,
    "responsibility": 50,
    "comfortSeeking": 78
  }
}
```

Old saves get a normalized default appearance automatically when loaded. If `baseTraits` is absent, profile sanitization generates the personality's default preset from the saved `personalityId`; no quiz retake is required. `baseTraits` is currently persistence-only and does not drive Camper behavior or UI.

## Progression Data Layers

Future adventure-facing data remains separated:

```text
baseTraits
+ habitModifiers
+ dailyAdventureModifiers
```

`habitStats` and `habitModifiers` live on the Camper profile. Raw completed interaction counts are retained in `habitStats.totals`; only the first three completions per habit per day advance `habitStats.influenceTotals`. `habitModifiers` is always recalculated from those influence totals with logarithmic diminishing returns and a per-trait range of `-15..15`.

`dailyAdventureModifiers` lives on the root game state because it is date-scoped. It is rebuilt from the current day's saved divination records, uses an order-independent equal-weight merge when tarot and turtle-shell results both exist for a topic, and returns neutral zeroes for missing topics. Neither modifier layer mutates `baseTraits`, current behavior weights, rewards, animation, or UI.
