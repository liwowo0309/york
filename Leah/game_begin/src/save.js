import { CONFIG } from "./config.js";
import { migrateSave } from "./migrate.js";

export function unwrapSave(data) {
  if (!data || typeof data !== "object") return null;
  if (data.state && typeof data.state === "object") return data;
  if (data.day != null || data.gold != null || data.scene) {
    return {
      version: Number(data.version) || 1,
      state: data,
      player: data.player || { x: data.x, y: data.y, facing: data.facing },
      brother: data.brother,
      mom: data.mom,
      dad: data.dad,
    };
  }
  return null;
}

export function saveScore(data) {
  const save = unwrapSave(data);
  if (!save?.state) return -1;
  return (Number(save.state.day) || 0) * 100000 + (Number(save.state.gold) || 0);
}

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

  function backupIfNeeded(raw, data) {
    const fromVersion = Number(data?.version) || 1;
    if (fromVersion >= CONFIG.saveVersion) return;
    const backupKey = `${CONFIG.saveKey}-backup-v${fromVersion}`;
    try {
      if (!localStorage.getItem(backupKey)) localStorage.setItem(backupKey, raw);
    } catch {
      /* quota or private mode */
    }
  }

  function parseKey(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const data = unwrapSave(JSON.parse(raw));
      if (!data) return null;
      return { raw, data, score: saveScore(data) };
    } catch {
      return null;
    }
  }

  function allSaveKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith("yiyue-home-save")) keys.push(key);
    }
    if (!keys.includes(CONFIG.saveKey)) keys.push(CONFIG.saveKey);
    return keys;
  }

  function readBest() {
    let best = null;
    allSaveKeys().forEach((key) => {
      const found = parseKey(key);
      if (found && (!best || found.score > best.score)) best = found;
    });
    return best;
  }

  function readMain() {
    return parseKey(CONFIG.saveKey);
  }

  function read() {
    const best = readBest();
    if (best?.raw) backupIfNeeded(best.raw, best.data);
    return best?.data || null;
  }

  function apply(data) {
    const migrated = migrateSave(unwrapSave(data) || data);
    Object.keys(world.state).forEach((key) => {
      if (!(key in migrated.state)) delete world.state[key];
    });
    Object.assign(world.state, migrated.state);
    world.player.x = migrated.player.x;
    world.player.y = migrated.player.y;
    world.player.facing = migrated.player.facing;
    world.player.target = null;
    Object.assign(world.brother, migrated.brother);
    Object.assign(world.mom, migrated.mom);
    Object.assign(world.dad, migrated.dad);
  }

  function importText(text) {
    const data = unwrapSave(JSON.parse(text));
    if (!data) throw new Error("empty");
    const existing = read();
    if (existing && saveScore(existing) > saveScore(data)) {
      if (!window.confirm(`现在已有第 ${existing.state.day} 天的进度。确定换成导入的第 ${data.state.day || 1} 天吗？`)) {
        return false;
      }
    }
    try {
      const stamp = `${CONFIG.saveKey}-backup-import-${Date.now()}`;
      const current = localStorage.getItem(CONFIG.saveKey);
      if (current) localStorage.setItem(stamp, current);
    } catch {
      /* ignore */
    }
    apply(data);
    save();
    return true;
  }

  function exportText() {
    const best = readBest();
    if (best?.raw) return best.raw;
    return JSON.stringify({
      version: CONFIG.saveVersion,
      state: world.state,
      player: { x: world.player.x, y: world.player.y, facing: world.player.facing },
      brother: world.brother,
      mom: world.mom,
      dad: world.dad,
    });
  }

  function clear() {
    localStorage.removeItem(CONFIG.saveKey);
  }

  return { save, read, readMain, readBest, apply, clear, importText, exportText };
}
