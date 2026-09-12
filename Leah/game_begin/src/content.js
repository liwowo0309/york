export const WORK_SLOTS = [
  { x: 220, y: 280 },
  { x: 480, y: 240 },
  { x: 720, y: 300 },
  { x: 360, y: 400 },
];

export const HELP_JOB_POOL = [
  {
    id: "grandpa-bag",
    name: "老爷爷",
    color: "#8a6a48",
    hard: 1,
    gold: 12,
    energyCost: 4,
    talk: "袋子有点重，可以帮我拿到门口吗？",
    done: "谢谢你。帮助别人，才是真正的挣钱。",
  },
  {
    id: "sister-shoes",
    name: "小妹妹",
    color: "#ee7aa0",
    hard: 1,
    gold: 11,
    energyCost: 3,
    talk: "我的鞋带散了，你能帮我系好吗？",
    done: "系好啦！你的手好巧。",
  },
  {
    id: "post-letters",
    name: "邮递员叔叔",
    color: "#5aa0d6",
    hard: 1,
    gold: 13,
    energyCost: 4,
    talk: "几封信被风吹到地上了，帮我捡起来好不好？",
    done: "信都回来了。你帮了邮局一个大忙。",
  },
  {
    id: "flower-nana",
    name: "卖花奶奶",
    color: "#d45d6b",
    hard: 1,
    gold: 12,
    energyCost: 4,
    talk: "花从篮子里掉出来了，帮我捡回篮子里吧。",
    done: "花又香香的了。这是给你的工钱。",
  },
  {
    id: "bird-feed",
    name: "养鸟的姐姐",
    color: "#6aae6d",
    hard: 1,
    gold: 13,
    energyCost: 4,
    talk: "鸟食洒了一地，帮我扫干净好不好？",
    done: "小鸟又有吃的了。谢谢你。",
  },
  {
    id: "park-aunt",
    name: "公园阿姨",
    color: "#4f7d53",
    hard: 2,
    gold: 18,
    energyCost: 8,
    talk: "操场上纸屑好多，帮我一起捡干净好不好？",
    done: "公园又漂亮了。这件事有一点累，工钱也多一点。",
  },
  {
    id: "kite-kid",
    name: "放风筝的小朋友",
    color: "#4d8fdb",
    hard: 2,
    gold: 17,
    energyCost: 8,
    talk: "我的风筝飞到树上去了，你能想办法拿下来吗？",
    done: "风筝回来啦！你是热心的大朋友。",
  },
  {
    id: "hungry",
    name: "肚子饿的人",
    color: "#c9844a",
    hard: 2,
    gold: 20,
    energyCost: 5,
    needFood: 1,
    talk: "我有点饿。如果你有多余的食物，可以分一点给我吗？",
    done: "谢谢你分食物给我。帮助别人比只挣钱更重要。",
  },
  {
    id: "garden-water",
    name: "种花的叔叔",
    color: "#6aae6d",
    hard: 2,
    gold: 19,
    energyCost: 7,
    needWater: 1,
    talk: "花都渴了。你能分一桶水给我浇浇地吗？",
    done: "花喝饱了。谢谢你带着水来帮忙。",
  },
  {
    id: "lost-boy",
    name: "迷路的弟弟",
    color: "#b56bdb",
    hard: 2,
    gold: 18,
    energyCost: 8,
    talk: "我找不到家里人了。你能送我到门口，帮我等一等吗？",
    done: "门口有人来接他了。你把迷路的弟弟照顾得很好。",
  },
  {
    id: "box-aunt",
    name: "搬箱子的阿姨",
    color: "#c45c4a",
    hard: 3,
    gold: 28,
    energyCost: 16,
    timeSteps: 2,
    talk: "这些箱子又多又重，要搬好久。你愿意帮我一起搬吗？",
    done: "箱子都搬完了。很难的事情，工钱也更多。",
  },
  {
    id: "dog-brother",
    name: "找不到狗的哥哥",
    color: "#355f96",
    hard: 3,
    gold: 30,
    energyCost: 15,
    timeSteps: 2,
    talk: "小狗跑丢了，可能躲在好远的地方。你能陪我到处找吗？",
    done: "小狗找到了！找了好久，你真有耐心。",
  },
  {
    id: "rain-nana",
    name: "淋雨的老奶奶",
    color: "#8a6a48",
    hard: 3,
    gold: 32,
    energyCost: 16,
    timeSteps: 2,
    talk: "雨好大，我走得很慢。你能送我走很长的路，回我住的地方吗？",
    done: "老奶奶安全到家了。这么难的路，你也走完了。",
  },
  {
    id: "sick-person",
    name: "生病的人",
    color: "#c9894a",
    hard: 3,
    gold: 34,
    energyCost: 12,
    needFood: 1,
    needWater: 1,
    talk: "我生病了，又饿又渴。如果你有食物和水，可以分给我吗？",
    done: "好一点了。又要食物又要水，这件事很难，工钱也最多。",
  },
  {
    id: "slide-worker",
    name: "修滑梯的工人",
    color: "#5b6b4a",
    hard: 3,
    gold: 29,
    energyCost: 14,
    timeSteps: 2,
    talk: "修理工具散了一地，有的还滚到角落里。帮我找齐好不好？",
    done: "工具找齐了。很难找，所以工钱也多。",
  },
];

function dayRng(day) {
  let seed = (day * 997 + 17) >>> 0;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function shuffleWith(list, rng) {
  const items = list.slice();
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const swap = items[i];
    items[i] = items[j];
    items[j] = swap;
  }
  return items;
}

export function jobsForDay(day) {
  const rng = dayRng(Math.max(1, day));
  const byHard = { 1: [], 2: [], 3: [] };
  HELP_JOB_POOL.forEach((job) => {
    byHard[job.hard].push(job);
  });
  const easy = shuffleWith(byHard[1], rng);
  const mid = shuffleWith(byHard[2], rng);
  const hard = shuffleWith(byHard[3], rng);
  const picked = [easy[0], mid[0], hard[0]];
  const leftover = shuffleWith([...easy.slice(1), ...mid.slice(1), ...hard.slice(1)], rng);
  picked.push(leftover[0]);
  return shuffleWith(picked, rng).map((job, i) => ({
    ...job,
    x: WORK_SLOTS[i].x,
    y: WORK_SLOTS[i].y,
  }));
}

export function helpHardLabel(hard) {
  if (hard >= 3) return "很难";
  if (hard === 2) return "有一点难";
  return "不太难";
}

export const CLASSROOM_FRIENDS = {
  1: ["小雨", "安安", "果果"],
  2: ["小宇", "圆圆", "豆豆"],
  3: ["星星", "毛毛", "欢欢"],
  4: ["桃子", "乐乐", "米米"],
  5: ["小凯", "南南", "花花"],
  6: ["晨晨", "果冻", "皮皮"],
  7: ["月亮", "可可", "糖糖"],
  8: ["大伟", "林林", "秋秋"],
  9: ["小北", "暖暖", "点点"],
  10: ["毕业班的宁宁", "言言", "希希"],
};

export const MY_CLASSMATES = ["如意", "然然", "杨鹏一", "伊丽娜", "杨乐彤"];

export const CLASSMATE_SEATS = [
  { x: 470, y: 300 },
  { x: 640, y: 300 },
  { x: 300, y: 400 },
  { x: 470, y: 400 },
  { x: 640, y: 400 },
];

export function classmatesAt(gradeFloor, playerGrade) {
  if (gradeFloor === playerGrade) return MY_CLASSMATES;
  return CLASSROOM_FRIENDS[gradeFloor] || CLASSROOM_FRIENDS[1];
}

export const DOOR_SIGNS = {
  door: "出门去大街",
  homeDoor: "进门回家",
  leaveWork: "出门回大街",
  leaveShop: "出门回大街",
  leavePark: "出门回大街",
  leaveClass: "出门去操场",
  leaveBath: "出门回教室",
  leaveYard: "出门回大街",
  bathDoor: "去厕所",
  toA: "去4层教学楼",
  toB: "去6层教学楼",
  schoolA: "进4层教学楼",
  schoolB: "进6层教学楼",
  schoolYard: "进大操场",
  park: "进游乐场",
  carshop: "进大车店",
  other1: "进邮局",
  foodshop: "进食物店",
  clothesshop: "进衣服和鞋子店",
  bookstore: "进书店",
  seedshop: "进种子店",
  birdshop: "进鸟笼店",
  work: "进帮助站",
  clinic: "进诊所",
};

export const INDOOR_DOORS = [
  "door", "leaveWork", "leaveShop", "leavePark", "leaveClass",
  "leaveBath", "leaveYard", "bathDoor", "toA", "toB",
];

export const SHOP_STREET_POS = {
  food: { x: 640, y: 680 },
  clothes: { x: 880, y: 680 },
  book: { x: 995, y: 948 },
  seed: { x: 1120, y: 680 },
  bird: { x: 1360, y: 680 },
  car: { x: 150, y: 670 },
};

export function createMomQuests(state) {
  return [
    { short: "去看乌龟", ask: "依月，去看看乌龟好不好？看完回来找我，妈妈给你金币。", hint: "乌龟缸在家里左边。", check: () => state.watchedTurtle, gold: 8 },
    { short: "去买食物", ask: "冰箱有点空。依月去食物店买一点食物，回来告诉妈妈。", hint: "大街上有食物店的门。", check: () => state.visitedFoodShop, gold: 10 },
    { short: "去提一桶水", ask: "帮妈妈提一桶水吧，种东西和做饭都要用。", hint: "家里的水桶，或者食物店也可以买水。", check: () => state.tookWater, gold: 8 },
    { short: "去游乐场玩", ask: "去游乐场玩一会儿，玩开心了再回来。", hint: "出门往北走，有游乐场的门。", check: () => state.visitedPark, gold: 9 },
  ];
}

export function createDadQuests(state) {
  return [
    { short: "去帮助别人", ask: "依月，去帮助站帮别人一次。帮助别人，爸爸才给你工钱。", hint: "家里旁边就是帮助站。", check: () => Object.keys(state.helpedToday).length > 0, gold: 12 },
    { short: "去学校操场", ask: "去学校大操场跑一跑，对身体好。", hint: "大街北边有大操场的门。", check: () => state.visitedYard, gold: 8 },
    { short: "去种子店看看", ask: "爸爸想种花。依月去种子店看一看，回来告诉我。", hint: "大街上有种子店的门。", check: () => state.visitedSeedShop, gold: 10 },
    { short: "去闻闻咖啡", ask: "帮爸爸看看家里的咖啡机好不好用，闻一闻就行。", hint: "咖啡机在家里。", check: () => state.madeCoffee, gold: 7 },
    { short: "去邮局一趟", ask: "帮爸爸去邮局看看，有时候要寄信。", hint: "大街上有邮局的门。", check: () => state.visitedPost, gold: 9 },
    { short: "去书店看看", ask: "依月去书店看一看，买书读书都会让人更厉害。", hint: "家里旁边往东走，有书店的门。", check: () => state.visitedBookShop, gold: 10, extra: true },
  ];
}

export const HOME_LAYOUT = {
  turtle: { x: 170, y: 155 },
  sofa: { x: 170, y: 340 },
  cage: { x: 300, y: 160 },
  coffee: { x: 400, y: 128 },
  fridge: { x: 500, y: 125 },
  water: { x: 600, y: 128 },
  study: { x: 800, y: 158 },
  wardrobe: { x: 680, y: 158 },
  bed: { x: 820, y: 300 },
  door: { x: 480, y: 455 },
  mom: { x: 500, y: 240 },
  dad: { x: 200, y: 360 },
  bro: { x: 680, y: 340 },
};

export function parentErrand(who, timeIndex) {
  if (who === "mom") {
    if (timeIndex === 0) return { scene: "home", x: HOME_LAYOUT.mom.x, y: HOME_LAYOUT.mom.y, job: "在家做饭" };
    if (timeIndex === 1) return { scene: "street", x: 640, y: 700, job: "去买菜" };
    return { scene: "home", x: HOME_LAYOUT.fridge.x, y: HOME_LAYOUT.fridge.y + 80, job: "在家收拾" };
  }
  if (timeIndex === 0) return { scene: "street", x: 475, y: 900, job: "去外面办事" };
  if (timeIndex === 1) return { scene: "park", x: 390, y: 200, job: "在游乐场散步" };
  return { scene: "home", x: HOME_LAYOUT.dad.x, y: HOME_LAYOUT.dad.y, job: "在家休息" };
}

export function createScenes() {
  const scenes = {
    home: {
      w: 960,
      h: 540,
      hint: "左边客厅看乌龟，中间是厨房，右边睡觉、换衣服、读书。大门在下面。",
      walls: [
        { x: 0, y: 0, w: 960, h: 46 },
        { x: 0, y: 0, w: 18, h: 540 },
        { x: 942, y: 0, w: 18, h: 540 },
        { x: 0, y: 510, w: 960, h: 30 },
      ],
      spots: [
        { id: "turtle", x: HOME_LAYOUT.turtle.x, y: HOME_LAYOUT.turtle.y, r: 54, name: "乌龟缸" },
        { id: "coffee", x: HOME_LAYOUT.coffee.x, y: HOME_LAYOUT.coffee.y, r: 40, name: "咖啡机" },
        { id: "fridge", x: HOME_LAYOUT.fridge.x, y: HOME_LAYOUT.fridge.y, r: 42, name: "冰箱" },
        { id: "water", x: HOME_LAYOUT.water.x, y: HOME_LAYOUT.water.y, r: 40, name: "水桶" },
        { id: "study", x: HOME_LAYOUT.study.x, y: HOME_LAYOUT.study.y, r: 44, name: "书桌" },
        { id: "wardrobe", x: HOME_LAYOUT.wardrobe.x, y: HOME_LAYOUT.wardrobe.y, r: 42, name: "衣柜" },
        { id: "cage", x: HOME_LAYOUT.cage.x, y: HOME_LAYOUT.cage.y, r: 46, name: "鸟笼子" },
        { id: "bed", x: HOME_LAYOUT.bed.x, y: HOME_LAYOUT.bed.y, r: 50, name: "依月的床" },
        { id: "door", x: HOME_LAYOUT.door.x, y: HOME_LAYOUT.door.y, r: 62, name: "出门去大街" },
        { id: "mom", x: HOME_LAYOUT.mom.x, y: HOME_LAYOUT.mom.y, r: 36, name: "妈妈", npc: "妈妈" },
        { id: "dad", x: HOME_LAYOUT.dad.x, y: HOME_LAYOUT.dad.y, r: 36, name: "爸爸", npc: "爸爸" },
        { id: "bro", x: HOME_LAYOUT.bro.x, y: HOME_LAYOUT.bro.y, r: 36, name: "哥哥", npc: "哥哥" },
      ],
    },
    street: {
      w: 1600,
      h: 1000,
      hint: "走到房子前面那扇棕色的门，门上写着要去的地方。",
      walls: [],
      spots: [
        { id: "schoolA", x: 165, y: 360, r: 52, name: "4层教学楼的门" },
        { id: "schoolB", x: 445, y: 410, r: 52, name: "6层教学楼的门" },
        { id: "schoolYard", x: 720, y: 360, r: 52, name: "大操场的门" },
        { id: "park", x: 1180, y: 300, r: 56, name: "游乐场的门" },
        { id: "carshop", x: 150, y: 650, r: 50, name: "大车店的门" },
        { id: "other1", x: 400, y: 660, r: 48, name: "邮局的门" },
        { id: "foodshop", x: 640, y: 660, r: 50, name: "食物店的门" },
        { id: "clothesshop", x: 880, y: 660, r: 50, name: "衣服店的门" },
        { id: "seedshop", x: 1120, y: 660, r: 50, name: "种子店的门" },
        { id: "birdshop", x: 1360, y: 660, r: 50, name: "鸟笼子店的门" },
        { id: "homeDoor", x: 170, y: 948, r: 56, name: "回家的门" },
        { id: "work", x: 475, y: 948, r: 56, name: "帮助站的门" },
        { id: "clinic", x: 755, y: 948, r: 50, name: "诊所的门" },
        { id: "bookstore", x: 995, y: 948, r: 50, name: "书店的门" },
        { id: "mycar", x: 318, y: 940, r: 42, name: "家里的大车" },
      ],
    },
    park: {
      w: 1100,
      h: 700,
      hint: "左边下面有一扇门，可以回大街。",
      walls: [
        { x: 0, y: 0, w: 1100, h: 20 },
        { x: 0, y: 0, w: 20, h: 700 },
        { x: 1080, y: 0, w: 20, h: 700 },
        { x: 0, y: 680, w: 1100, h: 20 },
      ],
      spots: [
        { id: "slide", x: 180, y: 180, r: 48, name: "滑梯" },
        { id: "swing", x: 390, y: 170, r: 48, name: "荡秋千" },
        { id: "sand", x: 220, y: 430, r: 56, name: "沙滩" },
        { id: "plot0", x: 620, y: 220, r: 34, name: "种植地" },
        { id: "plot1", x: 740, y: 220, r: 34, name: "种植地" },
        { id: "plot2", x: 860, y: 220, r: 34, name: "种植地" },
        { id: "plot3", x: 620, y: 340, r: 34, name: "种植地" },
        { id: "plot4", x: 740, y: 340, r: 34, name: "种植地" },
        { id: "plot5", x: 860, y: 340, r: 34, name: "种植地" },
        { id: "leavePark", x: 140, y: 630, r: 56, name: "出门回大街" },
      ],
    },
    work: {
      w: 960,
      h: 540,
      hint: "每天来的人都不一样。难的事情会更累，但工钱更多。帮完走下面的门。",
      walls: [
        { x: 0, y: 0, w: 960, h: 30 },
        { x: 0, y: 510, w: 960, h: 30 },
        { x: 0, y: 0, w: 20, h: 540 },
        { x: 940, y: 0, w: 20, h: 540 },
      ],
      spots: [
        { id: "leaveWork", x: 480, y: 455, r: 62, name: "出门回大街" },
        ...WORK_SLOTS.map((slot, i) => ({
          id: `help-${i}`,
          x: slot.x,
          y: slot.y,
          r: 38,
          name: "需要帮助的人",
          helpSlot: i,
        })),
      ],
    },
    shop: {
      w: 960,
      h: 540,
      hint: "走到柜台买东西。书店里左边有看书的小桌子。下面的门回大街。",
      walls: [
        { x: 0, y: 0, w: 960, h: 30 },
        { x: 0, y: 510, w: 960, h: 30 },
        { x: 0, y: 0, w: 20, h: 540 },
        { x: 940, y: 0, w: 20, h: 540 },
      ],
      spots: [
        { id: "counter", x: 480, y: 220, r: 50, name: "柜台" },
        { id: "readTable", x: 200, y: 250, r: 46, name: "看书的小桌子" },
        { id: "leaveShop", x: 480, y: 455, r: 62, name: "出门回大街" },
      ],
    },
    schoolYard: {
      w: 960,
      h: 540,
      hint: "下面有三扇门：4层教学楼、6层教学楼，还有回大街。",
      walls: [
        { x: 0, y: 0, w: 960, h: 24 },
        { x: 0, y: 516, w: 960, h: 24 },
        { x: 0, y: 0, w: 18, h: 540 },
        { x: 942, y: 0, w: 18, h: 540 },
      ],
      spots: [
        { id: "basketball", x: 200, y: 240, r: 50, name: "篮球场" },
        { id: "rope", x: 480, y: 230, r: 46, name: "跳绳的地方" },
        { id: "soccer", x: 760, y: 260, r: 54, name: "足球场" },
        { id: "toA", x: 160, y: 455, r: 56, name: "4层教学楼的门" },
        { id: "toB", x: 480, y: 455, r: 56, name: "6层教学楼的门" },
        { id: "leaveYard", x: 800, y: 455, r: 56, name: "出门回大街" },
      ],
    },
    classroom: {
      w: 960,
      h: 540,
      hint: "你一进教室，老师就会开课。左边下面是出门去操场。右边可以去厕所。",
      walls: [
        { x: 0, y: 0, w: 960, h: 30 },
        { x: 0, y: 510, w: 960, h: 30 },
        { x: 0, y: 0, w: 18, h: 540 },
        { x: 942, y: 0, w: 18, h: 540 },
      ],
      spots: [
        { id: "teacher", x: 480, y: 110, r: 42, name: "老师" },
        { id: "desk", x: 300, y: 280, r: 40, name: "小桌子" },
        { id: "friend0", x: 470, y: 300, r: 34, name: "如意" },
        { id: "friend1", x: 640, y: 300, r: 34, name: "然然" },
        { id: "friend2", x: 300, y: 400, r: 34, name: "杨鹏一" },
        { id: "friend3", x: 470, y: 400, r: 34, name: "伊丽娜" },
        { id: "friend4", x: 640, y: 400, r: 34, name: "杨乐彤" },
        { id: "bathDoor", x: 860, y: 250, r: 56, name: "去厕所的门" },
        { id: "leaveClass", x: 110, y: 455, r: 62, name: "出门去操场" },
      ],
    },
    bath: {
      w: 960,
      h: 540,
      hint: "这里是厕所。下面那扇门可以回教室。",
      walls: [
        { x: 0, y: 0, w: 960, h: 30 },
        { x: 0, y: 510, w: 960, h: 30 },
        { x: 0, y: 0, w: 18, h: 540 },
        { x: 942, y: 0, w: 18, h: 540 },
      ],
      spots: [
        { id: "sink", x: 300, y: 240, r: 44, name: "洗手台" },
        { id: "stall", x: 620, y: 250, r: 46, name: "小隔间" },
        { id: "leaveBath", x: 480, y: 455, r: 62, name: "出门回教室" },
      ],
    },
  };

  return scenes;
}
