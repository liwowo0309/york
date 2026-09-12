import { CONFIG, chineseGrade, shopTitle, timeName } from "./config.js";
import { clamp, dist } from "./math.js";
import {
  MY_CLASSMATES,
  SHOP_STREET_POS,
  classmatesAt,
  createDadQuests,
  createMomQuests,
  createScenes,
  HOME_LAYOUT,
  helpHardLabel,
  jobsForDay,
  parentErrand,
} from "./content.js";
import {
  BOOKS,
  FOOD_ORDER,
  FOOD_TYPES,
  SLOT_NAMES,
  addFood,
  findWearable,
  foodSummary,
  foodTotal,
  moveAllFood,
  normalizeState,
  shopWearables,
  takeFood,
} from "./items.js";
import { createWorld, plantAt, resetWorld } from "./world.js";
import { createSave } from "./save.js";
import { createUI } from "./ui.js?v=dock";
import { createRenderer } from "./render.js?v=home";

export function createGame() {
  const canvas = document.getElementById("game");
  const world = createWorld();
  const scenes = createScenes();
  const { state, player, brother, mom, dad, keys } = world;
  const saveApi = createSave(world);
  const ui = createUI();
  const renderer = createRenderer(canvas, world, scenes);
  const momQuests = createMomQuests(state);
  const dadQuests = createDadQuests(state);
  const W = CONFIG.canvasWidth;
  const H = CONFIG.canvasHeight;

  function currentScene() {
    return scenes[state.scene];
  }

  function sceneTitle() {
    if (state.scene === "shop") return shopTitle(state.shop);
    if (state.scene === "classroom") return `${chineseGrade(state.gradeFloor)}的教室`;
    return CONFIG.sceneTitles[state.scene] || "外面";
  }

  function currentQuest(who) {
    const list = (who === "mom" ? momQuests : dadQuests).filter((quest) => !quest.extra);
    return list[(Math.max(0, state.day) - 1) % list.length];
  }

  function chip(icon, count) {
    return count == null ? icon : `${icon}${count}`;
  }

  function foodChips(box) {
    const foods = box || {};
    return FOOD_ORDER
      .filter((key) => (foods[key] || 0) > 0)
      .map((key) => chip(FOOD_TYPES[key].icon, foods[key]));
  }

  function inventoryHtml() {
    const bits = [
      ...foodChips(state.bagFood),
      state.water ? chip("💧", state.water) : "",
      ...Object.entries(state.seeds)
        .filter(([, n]) => n)
        .map(([key, n]) => chip(key === "apple" ? "🍏" : key === "flower" ? "🌸" : "🌳", n)),
      state.birdFood ? chip("🌾", state.birdFood) : "",
      state.books.length ? chip("📚", state.books.length) : "",
      ...foodChips(state.fridgeFood),
      state.cage ? "🪺" : "",
      state.homeBirds.length ? chip("🐦", state.homeBirds.length) : "",
      state.car ? "🚗" : "",
      state.friends.length ? chip("💕", state.friends.length) : "",
    ].filter(Boolean);
    const momQ = currentQuest("mom");
    const dadQ = currentQuest("dad");
    if (momQ && !state.momQuestDone) bits.push("💗");
    if (dadQ && !state.dadQuestDone) bits.push("💙");
    return bits.join(" ") || "🎒";
  }

  function refreshHud() {
    ui.refreshHud({
      sceneName: sceneTitle(),
      dayLabel: `第 ${state.day} 天 · ${timeName(state.timeIndex)}`,
      gold: state.gold,
      health: Math.round(state.health),
      energy: Math.round(state.energy),
      happy: Math.round(state.happy),
      learn: Math.round(state.learn),
      bag: inventoryHtml(),
    });
  }

  function pay(cost) {
    if (state.gold < cost) {
      ui.toast("金币还不够。先去帮助别人挣钱吧。");
      return false;
    }
    state.gold -= cost;
    refreshHud();
    return true;
  }

  function addHappy(n) {
    state.happy = clamp(state.happy + n, 0, 100);
  }

  function addHealth(n) {
    state.health = clamp(state.health + n, 0, 100);
  }

  function addEnergy(n) {
    state.energy = clamp(state.energy + n, 0, 100);
  }

  function addLearn(n) {
    state.learn = clamp(state.learn + n, 0, 100);
  }

  function availableFood() {
    return foodTotal(state.bagFood) + foodTotal(state.fridgeFood);
  }

  function consumeFood(n = 1) {
    const fromBag = takeFood(state.bagFood, n);
    if (fromBag.length >= n) return fromBag;
    return fromBag.concat(takeFood(state.fridgeFood, n - fromBag.length));
  }

  function placeParentsForTime() {
    if (!mom.called) {
      const errand = parentErrand("mom", state.timeIndex);
      mom.scene = errand.scene;
      mom.x = errand.x;
      mom.y = errand.y;
      mom.job = errand.job;
    }
    if (!dad.called) {
      const errand = parentErrand("dad", state.timeIndex);
      dad.scene = errand.scene;
      dad.x = errand.x;
      dad.y = errand.y;
      dad.job = errand.job;
    }
  }

  function spawnWildBirds() {
    state.wildBirds = [
      { x: 220, y: 210, vx: 0.9, vy: 0.2, color: "#4d7fe8" },
      { x: 430, y: 160, vx: -0.7, vy: 0.15, color: "#e0578b" },
      { x: 620, y: 250, vx: 0.5, vy: -0.2, color: "#f0c14a" },
    ];
  }

  function advanceTime(steps = 1) {
    for (let i = 0; i < steps; i += 1) {
      state.timeIndex += 1;
      if (state.timeIndex > 2) {
        state.timeIndex = 2;
        ui.toast("天快黑了，回家睡觉吧。");
      }
      state.energy = clamp(state.energy - 6, 8, 100);
      state.health = clamp(state.health - 4, 12, 100);
    }
    placeParentsForTime();
    refreshHud();
    saveApi.save();
  }

  function newDay() {
    state.day += 1;
    state.timeIndex = 0;
    state.energy = 92;
    state.helpedToday = {};
    state.watchedTurtle = false;
    state.madeCoffee = false;
    state.tookWater = false;
    state.visitedPark = false;
    state.visitedYard = false;
    state.visitedSeedShop = false;
    state.visitedFoodShop = false;
    state.visitedBookShop = false;
    state.visitedPost = false;
    state.momQuestDone = false;
    state.dadQuestDone = false;
    state.plants.forEach((plant) => {
      if (plant.watered && plant.stage < 3) {
        plant.stage += 1;
        plant.watered = false;
      } else {
        plant.watered = false;
      }
      if (plant.cooldown > 0) plant.cooldown -= 1;
    });
    spawnWildBirds();
    placeParentsForTime();
    ui.toast(`早上好，依月，这是第 ${state.day} 天。`);
    refreshHud();
    saveApi.save();
  }

  function go(scene, x, y, extra = {}) {
    state.scene = scene;
    Object.assign(state, extra);
    player.x = x;
    player.y = y;
    player.target = null;
    world.pendingSpot = null;
    state.driving = scene === "street" ? state.driving : false;
    if (scene === "park") {
      state.visitedPark = true;
      if (state.wildBirds.length === 0) spawnWildBirds();
    }
    if (scene === "schoolYard") state.visitedYard = true;
    const followers = [];
    if (brother.following) followers.push(brother);
    if (mom.called) followers.push(mom);
    if (dad.called) followers.push(dad);
    followers.forEach((person, i) => {
      person.scene = scene;
      person.x = x + (i - 1) * 30;
      person.y = y + 14;
    });
    refreshHud();
    saveApi.save();
  }

  function nearestSpot() {
    const scene = currentScene();
    let best = null;
    let bestD = 999;
    scene.spots.forEach((spot) => {
      if (spot.id === "mycar" && !state.car) return;
      if (spot.id === "readTable" && state.shop !== "book") return;
      if (spot.id === "bro" && (brother.scene !== "home" || dist(brother.x, brother.y, spot.x, spot.y) > 40)) return;
      if (spot.id === "mom" && (mom.scene !== "home" || dist(mom.x, mom.y, spot.x, spot.y) > 50)) return;
      if (spot.id === "dad" && (dad.scene !== "home" || dist(dad.x, dad.y, spot.x, spot.y) > 50)) return;
      const d = dist(player.x, player.y, spot.x, spot.y);
      if (d < spot.r + 10 && d < bestD) {
        best = spot;
        bestD = d;
      }
    });
    return best;
  }

  function nearestBird() {
    let best = null;
    let bestD = 40;
    state.wildBirds.forEach((bird, i) => {
      const d = dist(player.x, player.y, bird.x, bird.y);
      if (d < bestD) {
        best = { bird, i };
        bestD = d;
      }
    });
    return best;
  }

  function useSpot(spot) {
    if (!spot) return;
    const id = spot.id;
    if (id === "turtle") watchTurtles();
    else if (id === "coffee") makeCoffee();
    else if (id === "fridge") useFridge();
    else if (id === "wardrobe") openWardrobe();
    else if (id === "study") openStudy(false);
    else if (id === "readTable") openStudy(true);
    else if (id === "water") takeWater();
    else if (id === "cage") useCage();
    else if (id === "bed") sleep();
    else if (id === "door" || id === "homeDoor") {
      if (state.scene === "home") go("street", 170, 948);
      else go("home", 480, 350);
    } else if (spot.npc) talkFamily(spot.npc);
    else if (id === "schoolA") pickSchool(1, 4, "第一栋楼有 4 层，每一层一个年级。");
    else if (id === "schoolB") pickSchool(5, 10, "旁边这栋楼有 6 层，从五年级到十年级。");
    else if (id === "toA") pickSchool(1, 4, "第一栋楼：一年级到四年级。");
    else if (id === "toB") pickSchool(5, 10, "旁边的楼：五年级到十年级。一共 10 个年级。");
    else if (id === "schoolYard") go("schoolYard", 800, 420);
    else if (id === "leaveYard") go("street", 720, 390);
    else if (id === "park") go("park", 90, 600);
    else if (id === "leavePark") go("street", 1180, 340);
    else if (id === "work") go("work", 480, 430);
    else if (id === "leaveWork") go("street", 475, 948);
    else if (id === "foodshop") enterShop("food");
    else if (id === "clothesshop") enterShop("clothes");
    else if (id === "bookstore") enterShop("book");
    else if (id === "seedshop") enterShop("seed");
    else if (id === "birdshop") enterShop("bird");
    else if (id === "carshop") enterShop("car");
    else if (id === "leaveShop") go("street", SHOP_STREET_POS[state.shop].x, SHOP_STREET_POS[state.shop].y);
    else if (id === "counter") openShop();
    else if (id === "slide") playToy("你从滑梯上滑下来，风呼呼的！", 8, 6);
    else if (id === "swing") playToy("秋千越荡越高，哥哥好像也喜欢这个。", 7, 8);
    else if (id === "sand") playToy("你在沙滩上堆了一座小小的沙城堡。", 6, 7);
    else if (id.startsWith("plot")) tendPlot(Number(id.replace("plot", "")));
    else if (id === "basketball") playToy("你投进了一个球！操场上好朋友拍手。", 7, 8);
    else if (id === "rope") playToy("跳绳跳到 20 下，老师说你很认真。", 6, 7);
    else if (id === "soccer") playToy("足球滚过草地，你和同学一起追。", 8, 7);
    else if (id === "teacher") startClass();
    else if (id === "desk") startClass();
    else if (id.startsWith("friend")) talkFriend(Number(id.replace("friend", "")));
    else if (id === "bathDoor") go("bath", 480, 340);
    else if (id === "leaveClass") go("schoolYard", 200, 430);
    else if (id === "sink") {
      addHappy(3);
      ui.toast("洗手洗得干干净净。");
    } else if (id === "stall") {
      addEnergy(4);
      ui.toast("上完厕所，舒服多了。");
    } else if (id === "leaveBath") go("classroom", 800, 250);
    else if (id === "other1") {
      state.visitedPost = true;
      ui.toast("这是邮局。爸爸有时候会来寄信。");
      saveApi.save();
    } else if (id === "clinic") {
      if (pay(8)) {
        addHealth(25);
        ui.toast("医生说你很健康，记得每天吃饭。");
      }
    } else if (id === "mycar") {
      state.driving = !state.driving;
      ui.toast(state.driving ? "坐上大车啦！在大街上开得更快。" : "你下车了。");
    } else if (spot.helpSlot != null) doJob(spot.helpSlot);
  }

  function enterShop(kind) {
    if (kind === "food") state.visitedFoodShop = true;
    if (kind === "seed") state.visitedSeedShop = true;
    if (kind === "book") state.visitedBookShop = true;
    go("shop", 480, 430, { shop: kind });
  }

  function watchTurtles() {
    state.watchedTurtle = true;
    addHappy(6);
    addEnergy(2);
    ui.toast("乌龟慢慢爬，慢慢游。一家人站在旁边看，心里就安静了。");
    saveApi.save();
  }

  function makeCoffee() {
    state.madeCoffee = true;
    addEnergy(10);
    addHappy(3);
    advanceTime();
    ui.toast("咖啡咕噜咕噜。妈妈说，大人喝一口，小朋友闻一闻就好。");
  }

  function useFridge() {
    const bagCount = foodTotal(state.bagFood);
    const fridgeCount = foodTotal(state.fridgeFood);
    if (!bagCount && !fridgeCount) {
      ui.toast("冰箱是空的，书包里也没有食物。先去食物店买，再拿回家放进冰箱。");
      return;
    }
    const bagText = bagCount ? `书包里有${foodSummary(state.bagFood)}。` : "书包里没有食物。";
    const fridgeText = fridgeCount ? `冰箱里有${foodSummary(state.fridgeFood)}。` : "冰箱现在是空的。";
    ui.openModal("冰箱", `<p>${fridgeText}${bagText}要放进去，还是吃一点？</p><div class="choices"><button class="choice" id="fridge-put" ${bagCount ? "" : "disabled"}>放进冰箱</button><button class="choice" id="fridge-eat" ${fridgeCount || bagCount ? "" : "disabled"}>吃一点</button></div>`);
    const putBtn = document.getElementById("fridge-put");
    const eatBtn = document.getElementById("fridge-eat");
    if (putBtn) {
      putBtn.onclick = () => {
        if (!foodTotal(state.bagFood)) {
          ui.toast("书包里没有可以放的食物。");
          return;
        }
        const moved = moveAllFood(state.bagFood, state.fridgeFood);
        ui.closeModal();
        ui.toast(`你把${foodSummary(moved)}放进冰箱了。想吃的时候再打开冰箱。`);
        refreshHud();
        saveApi.save();
      };
    }
    if (eatBtn) {
      eatBtn.onclick = () => {
        const fromFridge = foodTotal(state.fridgeFood) > 0;
        const eaten = fromFridge ? takeFood(state.fridgeFood, 1) : takeFood(state.bagFood, 1);
        if (!eaten.length) {
          ui.toast("没有食物可以吃。");
          return;
        }
        const kind = FOOD_TYPES[eaten[0]];
        addHealth(kind.health);
        addHappy(4);
        ui.closeModal();
        ui.toast(fromFridge
          ? `你从冰箱里拿出${kind.icon}${kind.name}吃了一口，身体暖暖的。`
          : `你吃了书包里的${kind.icon}${kind.name}。下次可以先放进冰箱。`);
        refreshHud();
        saveApi.save();
      };
    }
  }

  function takeWater() {
    if (state.water >= 6) {
      ui.toast("水已经带够了。");
      return;
    }
    state.water += 1;
    state.tookWater = true;
    ui.toast("你提了一小桶水。种东西的时候会用到。");
    refreshHud();
  }

  function useCage() {
    if (!state.cage) {
      ui.toast("还没有笼子。去大街上的鸟笼子店看看吧。");
      return;
    }
    if (state.homeBirds.length === 0) {
      ui.toast("笼子空着。去游乐场轻轻抓一只好看的鸟吧。");
      return;
    }
    if (state.birdFood <= 0) {
      ui.toast("鸟也要吃饭。鸟笼子店会卖鸟食。");
      return;
    }
    state.birdFood -= 1;
    addHappy(8);
    ui.toast("你给鸟喂了食。它们在家里唱歌。");
    refreshHud();
  }

  function sleep() {
    if (state.timeIndex === 0 && state.energy > 70) {
      ui.toast("现在还早，先去上学或者帮助别人吧。");
      return;
    }
    player.x = HOME_LAYOUT.bed.x;
    player.y = HOME_LAYOUT.bed.y;
    brother.following = false;
    brother.scene = "home";
    brother.x = HOME_LAYOUT.bro.x;
    brother.y = HOME_LAYOUT.bro.y;
    mom.called = false;
    dad.called = false;
    newDay();
    addHealth(10);
    ui.toast("你睡着了。爸爸、妈妈、哥哥也在家里。新的一天开始了。");
  }

  function nearPerson(person) {
    return person.scene === state.scene && dist(player.x, player.y, person.x, person.y) < 56;
  }

  function callParent(who) {
    if (ui.isModalOpen()) return;
    const person = who === "妈妈" ? mom : dad;
    if (person.called) {
      person.called = false;
      const errand = parentErrand(who === "妈妈" ? "mom" : "dad", state.timeIndex);
      person.scene = errand.scene;
      person.x = errand.x;
      person.y = errand.y;
      person.job = errand.job;
      ui.toast(`${who}：好，那我去${errand.job}啦。依月有事再打电话。`);
      saveApi.save();
      return;
    }
    person.called = true;
    person.scene = state.scene;
    person.x = player.x + (who === "妈妈" ? -36 : 36);
    person.y = player.y + 10;
    addHappy(5);
    ui.toast(`你给${who}打电话。${who}：依月，我马上到！`);
    saveApi.save();
  }

  function talkParent(who) {
    const key = who === "妈妈" ? "mom" : "dad";
    const quest = currentQuest(key);
    const done = key === "mom" ? "momQuestDone" : "dadQuestDone";
    if (state[done]) {
      ui.toast(`${who}：依月今天已经帮过忙了，真乖。按 ${who === "妈妈" ? "M" : "D"} 可以再叫我过来。`);
      return;
    }
    if (quest.check()) {
      state[done] = true;
      state.gold += quest.gold;
      addHappy(8);
      ui.toast(`${who}：谢谢依月！这是 ${quest.gold} 金币。`);
      refreshHud();
      saveApi.save();
      return;
    }
    ui.toast(`${who}：${quest.ask} ${quest.hint}`);
  }

  function toggleBrotherFollow() {
    if (ui.isModalOpen()) return;
    if (brother.following) {
      brother.following = false;
      ui.toast("哥哥：那我在这儿等你。再靠近我按 P，我又可以跟着你。");
      return;
    }
    if (!nearPerson(brother)) {
      ui.toast("先走到哥哥旁边，再按 P，他才会跟着你。");
      return;
    }
    brother.following = true;
    brother.scene = state.scene;
    addHappy(6);
    ui.toast("哥哥：好呀！你去哪儿，我就去哪儿。");
    saveApi.save();
  }

  function followPlayer(person, slot, dt) {
    const scene = currentScene();
    person.scene = state.scene;
    const followX = player.x + (slot === 0 ? -34 : slot === 1 ? 34 : 0);
    const followY = player.y + 12 + (slot === 2 ? 18 : 0);
    const dx = followX - person.x;
    const dy = followY - person.y;
    const d = Math.hypot(dx, dy);
    if (d > 18) {
      const speed = 4.4 * dt;
      person.x = clamp(person.x + (dx / d) * Math.min(speed, d), 20, scene.w - 20);
      person.y = clamp(person.y + (dy / d) * Math.min(speed, d), 20, scene.h - 20);
      person.walk += 1;
    } else {
      person.walk *= 0.8;
    }
  }

  function updateBrother(dt) {
    if (!brother.following) {
      brother.walk *= 0.8;
      return;
    }
    const scene = currentScene();
    brother.scene = state.scene;
    const followX = player.x - (player.facing || 1) * 32;
    const followY = player.y + 10;
    const dx = followX - brother.x;
    const dy = followY - brother.y;
    const d = Math.hypot(dx, dy);
    if (d > 18) {
      const speed = 4.4 * dt;
      brother.x = clamp(brother.x + (dx / d) * Math.min(speed, d), 20, scene.w - 20);
      brother.y = clamp(brother.y + (dy / d) * Math.min(speed, d), 20, scene.h - 20);
      brother.walk += 1;
    } else {
      brother.walk *= 0.8;
    }
  }

  function talkFamily(who) {
    if (who === "妈妈" || who === "爸爸") {
      talkParent(who);
      return;
    }
    const lines = {
      哥哥: brother.following
        ? [
            "你去哪儿，我就去哪儿！",
            "我们一起去游乐场好不好？",
            "再按一次 P，我就在这儿等你。",
          ]
        : [
            "靠近我按 P，我就跟着你走。",
            "学校操场可以打球！我们一起去。",
            "游乐场的滑梯我先占了——开玩笑的，一起玩。",
          ],
    };
    const pool = lines[who];
    addHappy(4);
    ui.toast(`${who}：${pool[(state.day + who.length) % pool.length]}`);
  }

  function playToy(text, happy, energy) {
    addHappy(happy);
    addEnergy(-Math.max(2, 10 - energy));
    advanceTime();
    ui.toast(text);
  }

  function tendPlot(index) {
    const plant = plantAt(state, index);
    if (!plant) {
      const options = Object.entries(state.seeds)
        .filter(([, n]) => n > 0)
        .map(([key]) => `<button class="choice" data-seed="${key}">种${CONFIG.seedNames[key]}</button>`)
        .join("");
      if (!options) {
        ui.toast("没有种子。先去种子店买你想种的那种。");
        return;
      }
      ui.openModal("选一颗种子", `<p>今天想种什么？种下去以后还要浇水。</p><div class="choices">${options}</div>`);
      ui.modalBody.querySelectorAll("[data-seed]").forEach((btn) => {
        btn.onclick = () => {
          const key = btn.dataset.seed;
          state.seeds[key] -= 1;
          state.plants.push({ plot: index, type: key, stage: 0, watered: false, cooldown: 0 });
          ui.closeModal();
          ui.toast(`你把${CONFIG.seedNames[key]}种进土里了。`);
          refreshHud();
        };
      });
      return;
    }
    if (plant.stage < 3 && !plant.watered) {
      if (state.water <= 0) {
        ui.toast("没有水。回家提一桶水，或者以后再买一些水。");
        return;
      }
      state.water -= 1;
      plant.watered = true;
      ui.toast("浇好水了。睡一觉，它就会再长高一点。");
      refreshHud();
      return;
    }
    if (plant.stage >= 3 && plant.type === "apple" && plant.cooldown <= 0) {
      addFood(state.bagFood, "apple", 2);
      plant.cooldown = 1;
      addHappy(6);
      ui.toast("苹果成熟了！你摘了两颗，可以放进冰箱。");
      refreshHud();
      return;
    }
    const grown = ["刚发芽", "小苗", "树苗", plant.type === "apple" ? "苹果树" : plant.type === "tree" ? "大树" : "花丛"][plant.stage];
    ui.toast(`这块地里是${grown}。${plant.watered ? "今天已经浇过水了。" : "还可以再浇水。"}`);
  }

  function catchBird() {
    const found = nearestBird();
    if (!found) return false;
    if (!state.cage) {
      ui.toast("鸟飞来飞去。要先买一个笼子，才能把鸟带回家。");
      return true;
    }
    if (state.homeBirds.length >= 3) {
      ui.toast("家里的笼子已经住满了。");
      return true;
    }
    const bird = state.wildBirds.splice(found.i, 1)[0];
    state.homeBirds.push({ color: bird.color });
    if (state.birdFood < 1) state.birdFood = 1;
    addHappy(10);
    ui.toast("你轻轻把好看的鸟带回了家。记得喂食。");
    refreshHud();
    return true;
  }

  function todayJobs() {
    return jobsForDay(state.day);
  }

  function doJob(slot) {
    const job = todayJobs()[slot];
    if (!job) return;
    if (state.helpedToday[job.id]) {
      ui.toast(`${job.name}今天已经被你帮助过了。明天再来吧。`);
      return;
    }
    if (job.needFood && availableFood() < job.needFood) {
      ui.toast("你还没有食物可以分。先去买一点，再来帮助别人。");
      return;
    }
    if (job.needWater && state.water < job.needWater) {
      ui.toast("你还没有水可以分。先提一桶水，再来帮助别人。");
      return;
    }
    const needEnergy = job.energyCost || 4;
    if (state.energy < needEnergy + 6) {
      ui.toast("你现在太累了。先回家休息，明天再来帮这个忙。");
      return;
    }
    const hardText = helpHardLabel(job.hard);
    const extra = job.hard >= 3
      ? "这件事很难，会比较累，也要花更多时间，但工钱更多。"
      : job.hard === 2
        ? "这件事有一点难。"
        : "这件事不太难。";
    ui.openModal(job.name, `<p>${job.talk}</p><p>${extra}工钱 ${job.gold} 金币。</p><div class="choices"><button class="choice" id="help-yes">${job.hard >= 3 ? "我来试试（很难）" : "我来帮助你"}</button></div>`);
    document.getElementById("help-yes").onclick = () => {
      if (job.needFood) consumeFood(job.needFood);
      if (job.needWater) state.water -= job.needWater;
      state.helpedToday[job.id] = true;
      state.gold += job.gold;
      addHappy(job.hard >= 3 ? 14 : 10);
      addEnergy(-needEnergy);
      advanceTime(job.timeSteps || 1);
      ui.closeModal();
      ui.toast(`${job.done} +${job.gold} 金币（${hardText}）`);
      refreshHud();
      saveApi.save();
    };
  }

  function pickSchool(from, to, story) {
    const buttons = [];
    for (let g = from; g <= to; g += 1) {
      buttons.push(`<button class="choice" data-grade="${g}">${chineseGrade(g)}（第 ${g - from + 1} 层）</button>`);
    }
    ui.openModal("进学校", `<p>${story}</p><div class="choices">${buttons.join("")}</div>`);
    ui.modalBody.querySelectorAll("[data-grade]").forEach((btn) => {
      btn.onclick = () => {
        const grade = Number(btn.dataset.grade);
        ui.closeModal();
        go("classroom", 120, 430, { gradeFloor: grade });
        startClass();
      };
    });
  }

  function startClass() {
    state.classCount += 1;
    addHappy(8);
    addEnergy(-6);
    addLearn(4);
    if (state.gradeFloor === state.playerGrade) {
      ui.toast(`老师看见依月来了，马上开课。${MY_CLASSMATES.join("、")}都坐好了。`);
      if (state.classCount % 3 === 0 && state.playerGrade < 10) {
        state.playerGrade += 1;
        ui.toast(`你升级了！下次你是${chineseGrade(state.playerGrade)}的学生。`);
      }
    } else {
      ui.toast(`老师看见有小朋友来听课，马上开课。你在${chineseGrade(state.gradeFloor)}坐下来。`);
    }
    if (state.wearing.clothes !== "school" && state.owned.clothes.includes("school")) {
      ui.toast("穿上校服再来上课会更整齐哦。回家到衣柜那里可以换上。");
    }
    advanceTime();
    refreshHud();
  }

  function talkFriend(index) {
    const names = classmatesAt(state.gradeFloor, state.playerGrade);
    const name = names[index];
    if (!name) {
      ui.toast("这张桌子现在没人坐。");
      return;
    }
    if (!state.friends.includes(name)) {
      state.friends.push(name);
      addHappy(8);
      ui.toast(`${name}：我们做朋友吧！学校里好朋友会越来越多。`);
    } else {
      addHappy(3);
      ui.toast(`${name}：下课去操场打球还是跳绳？`);
    }
    refreshHud();
  }

  function ownWearable(slot, id) {
    if (!state.owned[slot].includes(id)) state.owned[slot].push(id);
  }

  function wearItem(slot, id) {
    if (id && !state.owned[slot].includes(id)) return;
    state.wearing[slot] = id || "";
    const item = id ? findWearable(slot, id) : null;
    addHappy(4);
    if (!id) ui.toast(slot === "hats" ? "你把帽子放回衣柜了。" : "你把头花放回衣柜了。");
    else ui.toast(`你从衣柜里拿出${item.name}，穿上了。`);
    ui.closeModal();
    refreshHud();
    saveApi.save();
  }

  function openWardrobe() {
    const sections = ["clothes", "hats", "hair", "shoes"].map((slot) => {
      const canClear = (slot === "hats" || slot === "hair") && state.wearing[slot];
      const owned = state.owned[slot]
        .map((id) => {
          const item = findWearable(slot, id);
          if (!item) return "";
          const on = state.wearing[slot] === id;
          return `<button class="wear-item ${on ? "wearing" : ""}" data-slot="${slot}" data-id="${id}">${on ? "正在穿 · " : ""}${item.name}</button>`;
        })
        .join("");
      const clear = canClear ? `<button class="wear-item" data-slot="${slot}" data-id="">放回去</button>` : "";
      return `<h3 class="wear-h">${SLOT_NAMES[slot]}</h3><div class="wear-grid">${owned}${clear}</div>`;
    }).join("");
    ui.openModal("衣柜", `<p>校服、裙子、帽子、头花和鞋子都在这里。想穿哪一件，点一下就好。</p>${sections}`);
    ui.modalBody.querySelectorAll("[data-slot]").forEach((btn) => {
      btn.onclick = () => wearItem(btn.dataset.slot, btn.dataset.id);
    });
  }

  function readBook(book, atStore) {
    if (state.learn < book.need) {
      ui.toast(`《${book.name}》现在有点难。学习到 ${book.need} 再来读。你可以先在书桌前写字。`);
      return;
    }
    addLearn(book.learn);
    addHappy(book.happy);
    addEnergy(-5);
    advanceTime();
    ui.closeModal();
    ui.toast(`${book.text} 学习 +${book.learn}${atStore ? "（在书店读的）" : ""}`);
    refreshHud();
    saveApi.save();
  }

  function openStudy(atStore) {
    if (atStore && state.shop !== "book") {
      ui.toast("这张桌子是书店里看书用的。");
      return;
    }
    const ownedBooks = BOOKS.filter((book) => state.books.includes(book.id));
    const bookButtons = ownedBooks.map((book) => {
      const hard = state.learn < book.need;
      return `<button class="choice" data-book="${book.id}">${hard ? "还太难 · " : "读"}《${book.name}》${hard ? `（要学习 ${book.need}）` : ""}</button>`;
    }).join("");
    const studyBtn = atStore ? "" : `<button class="choice" id="study-write">在书桌前写字学习</button>`;
    const intro = atStore
      ? (ownedBooks.length ? "坐下来读你买的书。学习越高，越难的书也能读。" : "先到柜台买一本书，再坐下来读。")
      : "写字可以提高学习。学习高了，就能读更难、更好玩的书。";
    ui.openModal(atStore ? "书店的小桌子" : "书桌", `<p>${intro}现在学习 ${Math.round(state.learn)}。</p><div class="choices">${studyBtn}${bookButtons || (atStore ? "" : "<p>还没有书。去大街上的书店买一本吧。</p>")}</div>`);
    const writeBtn = document.getElementById("study-write");
    if (writeBtn) {
      writeBtn.onclick = () => {
        addLearn(6);
        addEnergy(-6);
        addHappy(3);
        advanceTime();
        ui.closeModal();
        ui.toast(`你在书桌前认真写字。学习更高了，以后能读更厉害的书。`);
        refreshHud();
        saveApi.save();
      };
    }
    ui.modalBody.querySelectorAll("[data-book]").forEach((btn) => {
      btn.onclick = () => {
        const book = BOOKS.find((item) => item.id === btn.dataset.book);
        if (book) readBook(book, atStore);
      };
    });
  }

  function openShop() {
    const catalogs = {
      food: [
        { name: "苹果", cost: 6, buy: () => { addFood(state.bagFood, "apple", 1); } },
        { name: "面包", cost: 6, buy: () => { addFood(state.bagFood, "bread", 1); } },
        { name: "米饭", cost: 7, buy: () => { addFood(state.bagFood, "rice", 1); } },
        { name: "好多苹果", cost: 16, buy: () => { addFood(state.bagFood, "apple", 3); } },
        { name: "一桶水", cost: 4, buy: () => { state.water += 2; state.tookWater = true; } },
      ],
      clothes: shopWearables().map((item) => ({
        name: `${SLOT_NAMES[item.slot]} · ${item.name}`,
        cost: item.cost,
        skip: state.owned[item.slot].includes(item.id),
        buy: () => ownWearable(item.slot, item.id),
        toast: `你买下了${item.name}，店员帮你放进衣柜了。回家到衣柜那里可以穿上。`,
      })),
      book: BOOKS.map((book) => ({
        name: `《${book.name}》${book.need ? `（学习 ${book.need} 才能读懂）` : "（谁都能读）"}`,
        cost: book.cost,
        skip: state.books.includes(book.id),
        buy: () => { if (!state.books.includes(book.id)) state.books.push(book.id); },
        toast: `你买下了《${book.name}》。可以在店里的小桌子读，也可以带回家读。`,
      })),
      seed: [
        { name: "能长出苹果的种子", cost: 10, buy: () => { state.seeds.apple += 1; } },
        { name: "大树种子", cost: 12, buy: () => { state.seeds.tree += 1; } },
        { name: "花种子", cost: 6, buy: () => { state.seeds.flower += 1; } },
      ],
      bird: [
        { name: "鸟笼子（带一点鸟食）", cost: 22, buy: () => { state.cage = true; state.birdFood += 2; }, skip: state.cage },
        { name: "鸟食", cost: 6, buy: () => { state.birdFood += 2; } },
      ],
      car: [
        { name: "家里的大车", cost: 80, buy: () => { state.car = true; }, skip: state.car },
      ],
    };
    const blurb = {
      food: "买回来的食物在书包里。回家到冰箱前面，可以按「放进冰箱」。",
      clothes: "衣服、小裙子、帽子、头花和鞋子都在这家店。买好会放进家里的衣柜。",
      book: "越厉害，能读的书就越好玩、越难。先买回家，再到小桌子或书桌前读。",
    };
    const items = catalogs[state.shop]
      .map((item, i) => {
        const owned = item.skip;
        return `<button class="shop-item" data-i="${i}" ${owned || state.gold < item.cost ? "disabled" : ""}><span>${owned ? "已经有了 · " : ""}${item.name}</span><span>${item.cost} 金币</span></button>`;
      })
      .join("");
    ui.openModal(shopTitle(state.shop), `<p>${blurb[state.shop] || "用帮助别人挣来的钱买东西。"}</p><div class="shop-list">${items}</div>`);
    ui.modalBody.querySelectorAll(".shop-item").forEach((btn) => {
      btn.onclick = () => {
        const item = catalogs[state.shop][Number(btn.dataset.i)];
        if (!pay(item.cost)) return;
        item.buy();
        ui.closeModal();
        ui.toast(item.toast || `你买下了${item.name}。`);
        refreshHud();
        saveApi.save();
      };
    });
  }

  function collide(nx, ny) {
    const walls = currentScene().walls || [];
    const r = player.r;
    for (const wall of walls) {
      const cx = clamp(nx, wall.x, wall.x + wall.w);
      const cy = clamp(ny, wall.y, wall.y + wall.h);
      if (Math.hypot(nx - cx, ny - cy) < r) return true;
    }
    return false;
  }

  function tryMove(dx, dy, dt) {
    const speed = (state.driving && state.scene === "street" ? 5.2 : state.scene === "street" ? 3.8 : 3) * dt * (state.energy < 25 ? 0.7 : 1);
    let nx = player.x + dx * speed;
    let ny = player.y + dy * speed;
    const scene = currentScene();
    nx = clamp(nx, player.r, scene.w - player.r);
    ny = clamp(ny, player.r, scene.h - player.r);
    if (!collide(nx, player.y)) player.x = nx;
    if (!collide(player.x, ny)) player.y = ny;
    if (dx !== 0) player.facing = dx > 0 ? 1 : -1;
    if (dx || dy) player.walk += 1;
  }

  function update(dt) {
    world.anim += dt;
    ui.tickToast(dt);
    if (ui.isModalOpen()) return;

    let dx = 0;
    let dy = 0;
    if (keys.has("arrowleft")) dx -= 1;
    if (keys.has("arrowright")) dx += 1;
    if (keys.has("arrowup")) dy -= 1;
    if (keys.has("arrowdown")) dy += 1;
    if (dx || dy) {
      const m = Math.hypot(dx, dy) || 1;
      tryMove(dx / m, dy / m, dt);
      player.target = null;
      world.pendingSpot = null;
    } else if (player.target) {
      const tx = player.target.x - player.x;
      const ty = player.target.y - player.y;
      const d = Math.hypot(tx, ty);
      if (d < 8 || (world.pendingSpot && dist(player.x, player.y, world.pendingSpot.x, world.pendingSpot.y) < world.pendingSpot.r + 8)) {
        player.target = null;
        const arrived = world.pendingSpot;
        world.pendingSpot = null;
        if (arrived) useSpot(arrived);
      } else tryMove(tx / d, ty / d, dt);
    } else {
      player.walk *= 0.8;
    }

    updateBrother(dt);
    if (mom.called) followPlayer(mom, 0, dt);
    else mom.walk *= 0.8;
    if (dad.called) followPlayer(dad, 1, dt);
    else dad.walk *= 0.8;

    if (state.scene === "park") {
      state.wildBirds.forEach((bird) => {
        bird.x += bird.vx * dt;
        bird.y += bird.vy * dt;
        if (bird.x < 80 || bird.x > 1040) bird.vx *= -1;
        if (bird.y < 80 || bird.y > 620) bird.vy *= -1;
      });
    }

    const spot = nearestSpot();
    if (nearPerson(mom)) ui.setHint("靠近了妈妈。空格听她说今天的事。按 M 打电话，她会过来。");
    else if (nearPerson(dad)) ui.setHint("靠近了爸爸。空格听他说今天的事。按 D 打电话，他会过来。");
    else if (nearPerson(brother) && !brother.following) ui.setHint("靠近了哥哥。按 P，他就会跟着你一起走。");
    else if (brother.following) ui.setHint("哥哥正跟着你。再按 P，他会停下来等你。");
    else if (mom.called) ui.setHint("妈妈正过来陪你。再按 M，她去忙自己的事。");
    else if (dad.called) ui.setHint("爸爸正过来陪你。再按 D，他去忙自己的事。");
    else if (spot && spot.id.startsWith("friend")) {
      const names = classmatesAt(state.gradeFloor, state.playerGrade);
      const name = names[Number(spot.id.replace("friend", ""))] || "空桌子";
      ui.setHint(`靠近了${name}。按空格或再点一下。`);
    } else if (spot && spot.helpSlot != null) {
      const job = todayJobs()[spot.helpSlot];
      const label = job ? `${job.name}（${helpHardLabel(job.hard)}）` : spot.name;
      ui.setHint(`靠近了${label}。按空格或再点一下。`);
    } else if (spot) ui.setHint(`靠近了${spot.name}。按空格或再点一下。`);
    else if (state.scene === "park" && nearestBird()) ui.setHint("一只好看的鸟就在旁边。按空格试试抓住它。");
    else ui.setHint(currentScene().hint);
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const cam = renderer.camera();
    return {
      x: (event.clientX - rect.left) * scaleX + cam.x,
      y: (event.clientY - rect.top) * scaleY + cam.y,
    };
  }

  function interact() {
    if (nearPerson(mom) && (!nearestSpot() || nearestSpot().npc === "妈妈")) {
      talkFamily("妈妈");
      return;
    }
    if (nearPerson(dad) && (!nearestSpot() || nearestSpot().npc === "爸爸")) {
      talkFamily("爸爸");
      return;
    }
    const spot = nearestSpot();
    if ((!spot || spot.npc === "哥哥") && nearPerson(brother)) {
      talkFamily("哥哥");
      return;
    }
    if (state.scene === "park" && catchBird()) return;
    useSpot(spot);
  }

  function loop(ts) {
    const now = ts || performance.now();
    if (now - world.lastTs < 12) return;
    const dt = Math.min(50, now - world.lastTs) / 16.67 || 1;
    world.lastTs = now;
    update(dt);
    renderer.draw();
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (ui.isModalOpen()) return;
    const p = canvasPoint(event);
    const scene = currentScene();
    const spot = scene.spots.find((s) => {
      if (s.id === "mycar" && !state.car) return false;
      return dist(p.x, p.y, s.x, s.y) < s.r + 18;
    });
    if (spot && dist(player.x, player.y, spot.x, spot.y) < spot.r + 16) {
      world.pendingSpot = null;
      useSpot(spot);
      return;
    }
    if (state.scene === "park") {
      const bird = state.wildBirds.find((b) => dist(p.x, p.y, b.x, b.y) < 20);
      if (bird && dist(player.x, player.y, bird.x, bird.y) < 42) {
        catchBird();
        return;
      }
    }
    player.target = spot ? { x: spot.x, y: spot.y } : p;
    world.pendingSpot = spot || null;
    loop(performance.now());
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (!["m", "d", "p"].includes(key)) keys.add(key);
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key) || event.key === " ") {
      event.preventDefault();
    }
    if (event.repeat) {
      loop(performance.now());
      return;
    }
    if (event.key === " " || event.key === "Enter" || key === "e") {
      if (!ui.isModalOpen()) interact();
    }
    if (key === "p") {
      event.preventDefault();
      if (!ui.isModalOpen()) toggleBrotherFollow();
    }
    if (key === "m") {
      event.preventDefault();
      if (!ui.isModalOpen()) callParent("妈妈");
    }
    if (key === "d") {
      event.preventDefault();
      if (!ui.isModalOpen()) callParent("爸爸");
    }
    if (event.key === "Escape") ui.closeModal();
    loop(performance.now());
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.key.toLowerCase());
  });

  function saveLine(save) {
    const s = save?.state;
    if (!s) return "";
    const extras = [
      s.cage ? "有鸟笼子" : "",
      Array.isArray(s.homeBirds) && s.homeBirds.length ? `${s.homeBirds.length} 只鸟` : "",
    ].filter(Boolean);
    return `第 ${s.day || 1} 天，${s.gold ?? 0} 金币${extras.length ? `，${extras.join("，")}` : ""}`;
  }

  function refreshSaveInfo() {
    const save = saveApi.read();
    const continueBtn = document.getElementById("continue-btn");
    const exportBtn = document.getElementById("export-btn");
    const info = document.getElementById("save-info");
    if (!save || !save.state) {
      continueBtn.disabled = true;
      exportBtn.disabled = true;
      info.textContent = "这个地址里还没有存档。第 6 天的进度在 http://127.0.0.1:8777 ，请打开那个。也可以点「导入进度」。";
      return;
    }
    continueBtn.disabled = false;
    exportBtn.disabled = false;
    info.textContent = `找到进度：${saveLine(save)}。请点「从上次加载」，不要点「从头开始」。`;
  }

  function beginPlay(message) {
    normalizeState(world.state, world.state);
    ui.showGame();
    if (state.scene === "park" && state.wildBirds.length === 0) spawnWildBirds();
    refreshHud();
    ui.toast(message);
    if (!world.looping) {
      world.looping = true;
      world.lastTs = performance.now() - 16;
      const tick = () => {
        loop(performance.now());
        requestAnimationFrame(tick);
      };
      tick();
      setInterval(() => loop(performance.now()), 33);
      setInterval(saveApi.save, 8000);
    }
  }

  refreshSaveInfo();

  document.getElementById("continue-btn").onclick = () => {
    const save = saveApi.read();
    if (!save) return;
    try {
      saveApi.apply(save);
      saveApi.save();
      beginPlay(`欢迎回来，依月。这是第 ${state.day} 天。按 M 叫妈妈，按 D 叫爸爸。`);
    } catch {
      refreshSaveInfo();
      ui.toast("存档还在，这一次没打开。再点一次「从上次加载」。");
    }
  };

  document.getElementById("export-btn").onclick = () => {
    const text = saveApi.exportText();
    const blob = new Blob([text], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `yiyue-day-${saveApi.read()?.state?.day || 1}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    ui.toast("进度已导出。换电脑或换网址时，用「导入进度」打开这个文件。");
  };

  document.getElementById("import-btn").onclick = () => {
    document.getElementById("import-file").click();
  };

  document.getElementById("import-file").onchange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (!saveApi.importText(String(reader.result || ""))) return;
        beginPlay(`进度回来了。这是第 ${state.day} 天。`);
      } catch {
        ui.toast("这个文件不是游戏进度。请选导出的那个 json。");
      }
    };
    reader.readAsText(file);
  };

  document.getElementById("start-btn").onclick = () => {
    if (saveApi.read() && !window.confirm("从头开始会丢掉上次的进度，确定吗？")) return;
    saveApi.clear();
    resetWorld(world);
    spawnWildBirds();
    beginPlay("欢迎回家，依月。按 M 叫妈妈，按 D 叫爸爸。靠近他们按空格，可以帮他们做事赚金币。");
    saveApi.save();
  };
}
