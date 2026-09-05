# Commercial-oriented restructure

## Change

Split the monolith into ES modules under `src/`, styles under `css/`, and this `development_log/`. Removed debug globals (`window.clickWorld`, `window.gameState`, `window.__frames`, `window.gameLoop`). Marked the package `private` and `UNLICENSED`.

## Layout rationale

| Module | Owns |
| --- | --- |
| `config.js` | Product constants (name, save key, outfits) |
| `content.js` | Scenes, jobs, quests — data, not loop |
| `world.js` | Default runtime state |
| `save.js` | Persistence only |
| `ui.js` | DOM HUD / modal / toast |
| `render.js` | Canvas drawing |
| `app.js` | Gameplay composition |
| `main.js` | Boot |

Data and rendering do not import gameplay. `app.js` is the composition root so later store, account, or build steps can wrap one entry without rewriting scenes.

## Why no bundler yet

The game still runs from a static HTTP server. A bundler is a packaging step for a store build, not a requirement for the source of truth.

## License stance

Keep all rights reserved until a real commercial license is chosen. Publishing the repo is not an open-source grant.
