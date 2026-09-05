# 我们的家 · 过日子

Family life simulation for **依月 (Leah)**. Offline browser game. Prototype toward a commercial product.

All rights reserved. See `package.json` (`license: UNLICENSED`). Do not copy, sell, or redistribute without permission.

## Play

This game uses ES modules. Open it through a local HTTP server, not `file://`.

```bash
cd Leah/game_begin
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Controls

- Arrow keys: walk (D is reserved for calling dad)
- Space / click: interact
- P: brother follows
- M: call mom
- D: call dad
- Esc: close dialogs

Progress saves in the browser (`localStorage` key `yiyue-home-save-v1`).

## Layout

```
index.html          entry page
css/main.css        styles
src/main.js         boot
src/app.js          gameplay loop and interactions
src/config.js       names, outfits, save key
src/content.js      scenes, jobs, quests
src/world.js        default world state
src/save.js         localStorage save/load
src/ui.js           HUD, toast, modal
src/render.js       canvas drawing
src/math.js         clamp / distance
development_log/    why each key change was made
wobble.md           original design notes from play
```

No bundler is required. Keep it that way until a store build or packaging step is needed.

## License

Private / unlicensed. Intended for later commercialization. Source in this repository is not an open-source grant.
