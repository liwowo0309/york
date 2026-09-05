# Family follow, save/load, labeled doors

## Changes

- Player name is **依月**, English Leah.
- Walk with arrow keys only. **D** calls dad; WASD would steal that key.
- **P** brother follows. **M** / **D** phone mom and dad to the current scene.
- Parents have daytime errands when not called.
- Daily parent quests pay gold after the child does the asked thing.
- Save/load on the start screen; autosave on actions and every 8 seconds.
- Doors are large and labeled so a child can see where they go.
- Street walls were cleared so buildings do not block walking.

## Rationale

Family presence is the product, not a side NPC. Save/load is required before anyone will play more than one sitting. Visible doors beat hidden hotspots.

## Pitfalls kept in mind

- Movement uses `dt` so low FPS does not crawl.
- Key repeat is ignored for P/M/D so holding D does not toggle dad on and off.
- `requestAnimationFrame` can stall in some embedded browsers; an interval still ticks the loop.
