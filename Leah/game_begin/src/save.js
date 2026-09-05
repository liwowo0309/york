import { CONFIG } from "./config.js";
import { defaultDad, defaultMom, defaultBrother, defaultState } from "./world.js";

export function createSave(world) {
  function save() {
    try {
      localStorage.setItem(CONFIG.saveKey, JSON.stringify({
        version: CONFIG.saveVersion,
        state: world.state,
        player: {
          x: world.player.x,
          y: world.player.y,
          facing: world.player.facing,
        },
        brother: world.brother,
        mom: world.mom,
        dad: world.dad,
      }));
    } catch {
      /* quota or private mode */
    }
  }

  function read() {
    try {
      const raw = localStorage.getItem(CONFIG.saveKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function apply(data) {
    Object.assign(world.state, defaultState(), data.state || {});
    if (!world.state.seeds) world.state.seeds = { apple: 0, tree: 0, flower: 0 };
    if (!world.state.helpedToday) world.state.helpedToday = {};
    world.player.x = data.player?.x ?? 480;
    world.player.y = data.player?.y ?? 360;
    world.player.facing = data.player?.facing ?? 1;
    world.player.target = null;
    Object.assign(world.brother, defaultBrother(), data.brother || {});
    Object.assign(world.mom, defaultMom(), data.mom || {});
    Object.assign(world.dad, defaultDad(), data.dad || {});
  }

  function clear() {
    localStorage.removeItem(CONFIG.saveKey);
  }

  return { save, read, apply, clear };
}
