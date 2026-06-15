# Test Build Instructions

Current test build: V2.5.

## Cache Busting Workflow

The current release version is controlled by `window.APP_VERSION` in `index.html`.

`game.js` reads that value as `APP_VERSION`, and all runtime `assetPaths` go through `withVersion(...)`.

For each new release:

- Update only `window.APP_VERSION` to the new version number, for example `"2.6"`.
- `index.html` will load `style.css?v=<APP_VERSION>` and `game.js?v=<APP_VERSION>`.
- `game.js` will load PNG assets as `assets/...png?v=<APP_VERSION>`.
- Sync the updated files into `share-build/`.
- Do not use `?reset=1` for normal releases; old player saves remain in `localStorage`.
- Use `?reset=1` only when intentionally testing a fresh save.

## What To Share

Use the `share-build/` folder for friend testing.

It should contain only the files needed to run the static game:

- `index.html`
- `style.css`
- `game.js`
- `assets/`

It should not contain development-only files such as:

- `assets/reference/`
- `assets/generated_sources/`
- generated preview images
- hidden files
- `.env`
- API keys
- tokens

## Local Test

Open `share-build/index.html` in a browser.

For a fresh save test, open:

```text
share-build/index.html?reset=1
```

The `?reset=1` query clears only this game's browser `localStorage` save.

## Web Link Sharing

To let friends play from a phone without downloading files, upload the contents of `share-build/` to a static hosting platform.

Good options:

- GitHub Pages
- Netlify drag-and-drop deploy
- Cloudflare Pages
- Vercel static project
- itch.io HTML5 game page

Important: upload the contents inside `share-build/`, not the whole development folder.

V2.5 `share-build/` should contain only:

- `index.html`
- `style.css`
- `game.js`
- `assets/`

Do not upload root-level review sheets such as `character_review_sheet.png` or `tent_review_sheet.png`.

After upload, the host will give you a URL. Send that URL to friends and they can open it directly in a mobile browser.

## Privacy Note

This is a pure frontend static webpage.

It has:

- no backend
- no login
- no cloud save
- no API key
- no ads
- no analytics
- no tracking
- no third-party scripts

This test build stores only local game progress in browser localStorage and does not collect personal data.

## Quick Acceptance Test

New save:

- Open with `?reset=1`.
- New game starts with Backpacking Tent, unlit Level 1 campfire, scattered wood, and base environment decor.
- Table, Kettle, Axe, Stove, String Lights, Chair, and Lantern do not appear before purchase.

Shop:

- Shop bottom sheet opens and closes.
- Shop still shows unpurchased items.
- Table can be purchased.
- Kettle and Stove are locked until Table is owned.
- Purchased equipment appears in the campsite.

UI:

- Status bar is not covered by safe area.
- Welcome/status text appears as a short toast and fades out.
- Toast does not block campfire, tent, table, chair, or camper for long.
- Reset button asks for confirmation before clearing save.

Systems:

- Gather Wood toggle works.
- Day / Night appears only after Lantern is bought.
- Refreshing the browser keeps local progress.
- Opening with `?reset=1` clears the local progress again.

Mobile viewport checks:

- iPhone 12 Pro: 390 x 844
- iPhone 15 Pro: 393 x 852
- iPhone 16 / 17 Pro: 402 x 874
- Pro Max-ish: 430-440 x 932-956

Check that the main campsite objects remain visible when the shop is open.
