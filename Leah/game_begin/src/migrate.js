import { emptyFood, FOOD_ORDER, findWearable } from "./items.js";
import { defaultBrother, defaultDad, defaultMom, defaultState } from "./world.js";
import { HOME_LAYOUT } from "./content.js";

const LEGACY_KEYS = new Set(["food", "clothes", "outfit"]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function overlayProgress(state, incoming) {
  Object.keys(state).forEach((key) => {
    if (LEGACY_KEYS.has(key)) return;
    if (incoming[key] === undefined) return;
    if (isPlainObject(state[key]) && isPlainObject(incoming[key])) {
      Object.assign(state[key], incoming[key]);
    } else {
      state[key] = clone(incoming[key]);
    }
  });
}

function fillFoodBox(box) {
  const next = emptyFood();
  FOOD_ORDER.forEach((key) => {
    next[key] = Math.max(0, Number(box?.[key]) || 0);
  });
  return next;
}

function mergeClothes(owned, incoming) {
  const fromOld = Array.isArray(incoming.clothes) ? incoming.clothes : [];
  const next = [...new Set(["home", ...(owned || []), ...fromOld])].filter((id) => findWearable("clothes", id));
  return next.length ? next : ["home"];
}

function applyV2(state, incoming) {
  if (!incoming.bagFood) {
    state.bagFood = emptyFood();
    if (typeof incoming.food === "number" && incoming.food > 0) {
      state.bagFood.bread = incoming.food;
    }
  }
  if (!incoming.fridgeFood) state.fridgeFood = emptyFood();
  if (!incoming.owned) {
    state.owned = {
      clothes: mergeClothes([], incoming),
      hats: [],
      hair: [],
      shoes: ["shoes-home"],
    };
  }
  if (!incoming.wearing) {
    const outfit = incoming.outfit || "home";
    state.wearing = {
      clothes: state.owned.clothes.includes(outfit) ? outfit : "home",
      hat: "",
      hair: "",
      shoes: "shoes-home",
    };
  }
  if (incoming.learn == null) state.learn = 8;
  if (!Array.isArray(incoming.books)) state.books = incoming.books || [];
}

function harden(state, incoming) {
  state.bagFood = fillFoodBox(state.bagFood);
  state.fridgeFood = fillFoodBox(state.fridgeFood);
  if (typeof incoming.food === "number" && incoming.food > 0 && FOOD_ORDER.every((key) => !state.bagFood[key])) {
    state.bagFood.bread = incoming.food;
  }
  state.owned = state.owned || { clothes: ["home"], hats: [], hair: [], shoes: ["shoes-home"] };
  state.owned.clothes = mergeClothes(state.owned.clothes, incoming);
  ["hats", "hair", "shoes"].forEach((slot) => {
    if (!Array.isArray(state.owned[slot])) state.owned[slot] = slot === "shoes" ? ["shoes-home"] : [];
  });
  if (!state.owned.shoes.includes("shoes-home")) state.owned.shoes.unshift("shoes-home");
  state.wearing = state.wearing || { clothes: "home", hat: "", hair: "", shoes: "shoes-home" };
  if (!state.owned.clothes.includes(state.wearing.clothes)) {
    state.wearing.clothes = incoming.outfit && state.owned.clothes.includes(incoming.outfit)
      ? incoming.outfit
      : "home";
  }
  if (state.learn == null || Number.isNaN(Number(state.learn))) state.learn = 8;
  if (!Array.isArray(state.books)) state.books = [];
  if (!state.seeds) state.seeds = { apple: 0, tree: 0, flower: 0 };
  state.seeds = { apple: 0, tree: 0, flower: 0, ...state.seeds };
  if (!Array.isArray(state.friends)) state.friends = [];
  if (!Array.isArray(state.plants)) state.plants = [];
  if (!Array.isArray(state.homeBirds)) state.homeBirds = [];
  if (!Array.isArray(state.wildBirds)) state.wildBirds = [];
  if (!state.helpedToday || typeof state.helpedToday !== "object") state.helpedToday = {};
  if (!state.day || state.day < 1) state.day = 1;
  if (state.gold == null) state.gold = 0;
  return state;
}

export function migrateSave(data) {
  const incoming = data?.state && typeof data.state === "object" ? data.state : {};
  const fromVersion = Number(data?.version) || 1;
  const state = defaultState();
  overlayProgress(state, incoming);
  if (fromVersion < 2) applyV2(state, incoming);
  harden(state, incoming);
  return {
    fromVersion,
    state,
    player: {
      x: data?.player?.x ?? incoming.x ?? 480,
      y: data?.player?.y ?? incoming.y ?? 360,
      facing: data?.player?.facing ?? 1,
    },
    brother: placeAtHome({ ...defaultBrother(), ...(data?.brother || {}) }, HOME_LAYOUT.bro, "following"),
    mom: placeAtHome({ ...defaultMom(), ...(data?.mom || {}) }, HOME_LAYOUT.mom, "called"),
    dad: placeAtHome({ ...defaultDad(), ...(data?.dad || {}) }, HOME_LAYOUT.dad, "called"),
  };
}

function placeAtHome(person, seat, busyKey) {
  if (person.scene === "home" && !person[busyKey]) {
    person.x = seat.x;
    person.y = seat.y;
  }
  return person;
}
