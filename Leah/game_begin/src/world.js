import { emptyFood, normalizeState } from "./items.js";
import { HOME_LAYOUT } from "./content.js";

export function defaultState() {
  return {
    scene: "home",
    gradeFloor: 1,
    shop: "food",
    day: 1,
    timeIndex: 0,
    gold: 6,
    health: 82,
    energy: 84,
    happy: 72,
    learn: 8,
    water: 1,
    bagFood: { ...emptyFood(), bread: 1 },
    fridgeFood: emptyFood(),
    birdFood: 0,
    cage: false,
    car: false,
    driving: false,
    wearing: { clothes: "home", hat: "", hair: "", shoes: "shoes-home" },
    owned: { clothes: ["home"], hats: [], hair: [], shoes: ["shoes-home"] },
    books: [],
    seeds: { apple: 0, tree: 0, flower: 0 },
    friends: [],
    classCount: 0,
    playerGrade: 1,
    plants: [],
    homeBirds: [],
    wildBirds: [],
    helpedToday: {},
    watchedTurtle: false,
    madeCoffee: false,
    tookWater: false,
    visitedPark: false,
    visitedYard: false,
    visitedSeedShop: false,
    visitedFoodShop: false,
    visitedBookShop: false,
    visitedPost: false,
    momQuestDone: false,
    dadQuestDone: false,
    turtles: [
      { x: 0.3, y: 0.45, s: 0.01 },
      { x: 0.62, y: 0.6, s: -0.013 },
    ],
  };
}

export function defaultPlayer() {
  return { x: 480, y: 360, r: 14, facing: 1, walk: 0, target: null };
}

export function defaultBrother() {
  return { x: HOME_LAYOUT.bro.x, y: HOME_LAYOUT.bro.y, scene: "home", following: false, walk: 0 };
}

export function defaultMom() {
  return { x: HOME_LAYOUT.mom.x, y: HOME_LAYOUT.mom.y, scene: "home", called: false, walk: 0, job: "在家做饭" };
}

export function defaultDad() {
  return { x: HOME_LAYOUT.dad.x, y: HOME_LAYOUT.dad.y, scene: "home", called: false, walk: 0, job: "在家看门" };
}

export function createWorld() {
  return {
    state: defaultState(),
    player: defaultPlayer(),
    brother: defaultBrother(),
    mom: defaultMom(),
    dad: defaultDad(),
    anim: 0,
    lastTs: 0,
    toastTimer: 0,
    pendingSpot: null,
    looping: false,
    keys: new Set(),
  };
}

export function resetWorld(world) {
  Object.assign(world.state, defaultState());
  normalizeState(world.state, world.state);
  Object.assign(world.player, defaultPlayer());
  Object.assign(world.brother, defaultBrother());
  Object.assign(world.mom, defaultMom());
  Object.assign(world.dad, defaultDad());
  world.pendingSpot = null;
  world.player.target = null;
}

export function currentScene(world, scenes) {
  return scenes[world.state.scene];
}

export function plantAt(state, index) {
  return state.plants.find((p) => p.plot === index);
}
