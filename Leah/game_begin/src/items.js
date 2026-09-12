export const FOOD_TYPES = {
  apple: { id: "apple", name: "苹果", icon: "🍎", health: 16 },
  bread: { id: "bread", name: "面包", icon: "🍞", health: 14 },
  rice: { id: "rice", name: "米饭", icon: "🍚", health: 18 },
};

export const FOOD_ORDER = ["apple", "bread", "rice"];

export function emptyFood() {
  return { apple: 0, bread: 0, rice: 0 };
}

export function foodTotal(box = {}) {
  return FOOD_ORDER.reduce((sum, key) => sum + (box[key] || 0), 0);
}

export function addFood(box, kind, n = 1) {
  box[kind] = (box[kind] || 0) + n;
}

export function takeFood(box, n = 1) {
  const taken = [];
  for (let i = 0; i < n; i += 1) {
    const key = FOOD_ORDER.find((k) => (box[k] || 0) > 0);
    if (!key) break;
    box[key] -= 1;
    taken.push(key);
  }
  return taken;
}

export function moveAllFood(from, to) {
  const moved = emptyFood();
  FOOD_ORDER.forEach((key) => {
    if ((from[key] || 0) > 0) {
      to[key] = (to[key] || 0) + from[key];
      moved[key] = from[key];
      from[key] = 0;
    }
  });
  return moved;
}

export function foodSummary(box = {}) {
  return FOOD_ORDER
    .filter((key) => (box[key] || 0) > 0)
    .map((key) => `${box[key]} 个${FOOD_TYPES[key].name}`)
    .join("、");
}

export const WARDROBE = {
  clothes: [
    { id: "home", name: "家里的衣服", look: { hair: "#f2b3c8", shirt: "#ee7aa0", skirt: "#f7c1d4" } },
    { id: "school", name: "校服", cost: 12, look: { hair: "#f2b3c8", shirt: "#f4f7ff", skirt: "#3d6fd8" } },
    { id: "sport", name: "运动服", cost: 14, look: { hair: "#f2b3c8", shirt: "#3cb89a", skirt: "#2a8f78" } },
    { id: "fancy", name: "紫色小裙子", cost: 18, look: { hair: "#f2b3c8", shirt: "#b56bdb", skirt: "#e7c4ff" } },
    { id: "skirt-pink", name: "粉色小裙子", cost: 16, look: { hair: "#f2b3c8", shirt: "#ffd0e0", skirt: "#ff8ab4" } },
    { id: "skirt-yellow", name: "小黄裙子", cost: 16, look: { hair: "#f2b3c8", shirt: "#fff4c8", skirt: "#f0c14a" } },
    { id: "skirt-flower", name: "碎花裙子", cost: 20, look: { hair: "#f2b3c8", shirt: "#ffe8f0", skirt: "#e07a9a" } },
  ],
  hats: [
    { id: "hat-straw", name: "小草帽", cost: 10, color: "#e8c96a" },
    { id: "hat-beret", name: "小贝雷帽", cost: 12, color: "#c45c4a" },
    { id: "hat-red", name: "红色小帽子", cost: 11, color: "#e0578b" },
  ],
  hair: [
    { id: "flower-pink", name: "粉色头花", cost: 8, color: "#ee7aa0" },
    { id: "flower-red", name: "红色头花", cost: 8, color: "#d45d5d" },
    { id: "flower-daisy", name: "小雏菊", cost: 9, color: "#f0c14a" },
  ],
  shoes: [
    { id: "shoes-home", name: "家里的小鞋", color: "#e8b68a" },
    { id: "shoes-white", name: "小白鞋", cost: 10, color: "#f4f7ff" },
    { id: "shoes-red", name: "红色小皮鞋", cost: 12, color: "#c45c4a" },
    { id: "shoes-sparkle", name: "闪亮的舞鞋", cost: 16, color: "#e7c4ff" },
    { id: "shoes-sport", name: "运动鞋", cost: 13, color: "#3cb89a" },
  ],
};

export const SLOT_NAMES = {
  clothes: "衣服",
  hats: "帽子",
  hair: "头花",
  shoes: "鞋子",
};

export const BOOKS = [
  { id: "pic", name: "好看的图画书", need: 0, cost: 6, learn: 5, happy: 8, text: "书里有小猫和太阳。你一页一页看得很开心。" },
  { id: "cat", name: "小猫咪去钓鱼", need: 12, cost: 8, learn: 7, happy: 8, text: "小猫钓到一条小鱼。这个故事你记住了。" },
  { id: "star", name: "星星为什么会亮", need: 28, cost: 12, learn: 9, happy: 7, text: "原来星星那么远，还会自己发光。你觉得世界好大。" },
  { id: "river", name: "小河去哪里", need: 46, cost: 14, learn: 11, happy: 8, text: "小河走到海里。你把难的地方又读了一遍。" },
  { id: "sky", name: "很难的天空书", need: 68, cost: 18, learn: 13, happy: 10, text: "云、风和月亮都写在里面。你已经能读很难的书了。" },
  { id: "world", name: "世界很大很大", need: 86, cost: 22, learn: 15, happy: 12, text: "好多国家和大海。越厉害，读的书就越好玩。" },
];

export function findWearable(slot, id) {
  return (WARDROBE[slot] || []).find((item) => item.id === id) || null;
}

export function shopWearables() {
  return ["clothes", "hats", "hair", "shoes"].flatMap((slot) => (
    WARDROBE[slot]
      .filter((item) => item.cost)
      .map((item) => ({ ...item, slot }))
  ));
}

export function playerLook(state) {
  const clothes = findWearable("clothes", state.wearing?.clothes) || WARDROBE.clothes[0];
  const hat = findWearable("hats", state.wearing?.hat);
  const flower = findWearable("hair", state.wearing?.hair);
  const shoes = findWearable("shoes", state.wearing?.shoes);
  return {
    ...clothes.look,
    hatColor: hat?.color,
    flowerColor: flower?.color,
    shoesColor: shoes?.color,
  };
}

export function normalizeState(state, incoming = {}) {
  if (!incoming.bagFood) {
    state.bagFood = emptyFood();
    if (typeof incoming.food === "number" && incoming.food > 0) state.bagFood.bread = incoming.food;
  }
  if (!incoming.fridgeFood) state.fridgeFood = emptyFood();
  state.bagFood = state.bagFood || emptyFood();
  state.fridgeFood = state.fridgeFood || emptyFood();
  FOOD_ORDER.forEach((key) => {
    state.bagFood[key] = state.bagFood[key] || 0;
    state.fridgeFood[key] = state.fridgeFood[key] || 0;
  });
  if (!incoming.owned) {
    const oldClothes = Array.isArray(incoming.clothes) && incoming.clothes.length ? incoming.clothes : ["home"];
    state.owned = {
      clothes: [...new Set(["home", ...oldClothes])],
      hats: [],
      hair: [],
      shoes: ["shoes-home"],
    };
  }
  state.owned = state.owned || { clothes: ["home"], hats: [], hair: [], shoes: ["shoes-home"] };
  ["clothes", "hats", "hair", "shoes"].forEach((slot) => {
    if (!Array.isArray(state.owned[slot])) state.owned[slot] = slot === "clothes" ? ["home"] : slot === "shoes" ? ["shoes-home"] : [];
  });
  if (!state.owned.clothes.includes("home")) state.owned.clothes.unshift("home");
  if (!state.owned.shoes.includes("shoes-home")) state.owned.shoes.unshift("shoes-home");
  if (!incoming.wearing) {
    state.wearing = {
      clothes: incoming.outfit || "home",
      hat: "",
      hair: "",
      shoes: "shoes-home",
    };
  }
  state.wearing = state.wearing || { clothes: "home", hat: "", hair: "", shoes: "shoes-home" };
  if (!state.owned.clothes.includes(state.wearing.clothes)) state.wearing.clothes = "home";
  if (incoming.learn == null && state.learn == null) state.learn = 8;
  if (state.learn == null) state.learn = 8;
  if (!Array.isArray(state.books)) state.books = [];
  return state;
}
