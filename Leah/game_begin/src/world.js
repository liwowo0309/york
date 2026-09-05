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
    water: 1,
    food: 1,
    birdFood: 0,
    cage: false,
    car: false,
    driving: false,
    outfit: "home",
    seeds: { apple: 0, tree: 0, flower: 0 },
    clothes: ["home"],
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
  return { x: 200, y: 400, scene: "home", following: false, walk: 0 };
}

export function defaultMom() {
  return { x: 280, y: 300, scene: "home", called: false, walk: 0, job: "在家做饭" };
}

export function defaultDad() {
  return { x: 420, y: 340, scene: "home", called: false, walk: 0, job: "在家看门" };
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
