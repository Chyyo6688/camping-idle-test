# Privacy Checklist - Cozy Camping Idle Test Build

## Summary

This test build stores only local game progress in browser localStorage and does not collect personal data.

## Runtime Behavior

- No backend server.
- No login.
- No cloud save.
- No ads.
- No analytics.
- No tracking pixels.
- No third-party scripts.
- No external packages loaded by the game.
- No API key or token required by the static game.
- No personal identity data is stored.
- Game progress is stored only in browser `localStorage` under the key `cozyCampfireSave`.

## V2.5 Checks

Checked runtime files and handoff documentation for:

- `api_key`
- `apikey`
- `token`
- `.env`
- `analytics`
- `tracking`
- `gtag`
- `segment`
- `mixpanel`
- `amplitude`
- third-party script URLs
- local absolute paths in runtime files

## Share Build Rules

`share-build/` should include only:

- `index.html`
- `style.css`
- `game.js`
- `assets/`

Development-only files should be excluded:

- `assets/reference/`
- `assets/generated_sources/`
- preview images
- hidden files
- temporary files

## Notes

Reset Save clears only local browser progress for this game.

The static test build can be uploaded to a static host and shared by URL. It does not send gameplay data anywhere.

V2.5 share-build has been refreshed as a static-only test build. It contains runtime files only and excludes reference images, generated source images, review sheets, preview images, hidden files, API keys, tokens, and `.env` files.
