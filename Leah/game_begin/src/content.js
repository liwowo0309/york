export const HELP_JOBS = [
  {
    id: "grandpa",
    name: "老爷爷",
    x: 220,
    y: 280,
    color: "#8a6a48",
    need: "carry",
    talk: "袋子有点重，可以帮我拿到门口吗？",
    done: "谢谢你。帮助别人，才是真正的挣钱。",
    gold: 14,
  },
  {
    id: "kid",
    name: "小朋友",
    x: 480,
    y: 240,
    color: "#5aa0d6",
    need: "find",
    talk: "我的风筝飞走了，你能帮我找回来吗？",
    done: "风筝回来啦！你是热心的大朋友。",
    gold: 12,
  },
  {
    id: "cleaner",
    name: "公园阿姨",
    x: 720,
    y: 300,
    color: "#6aae6d",
    need: "clean",
    talk: "操场上有纸屑，帮我一起捡干净好不好？",
    done: "公园又漂亮了。这是给你的工钱。",
    gold: 13,
  },
  {
    id: "hungry",
    name: "需要食物的人",
    x: 360,
    y: 400,
    color: "#c9844a",
    need: "food",
    talk: "我有点饿。如果你有多余的食物，可以分一点给我吗？",
    done: "谢谢你分食物给我。帮助别人比只挣钱更重要。",
    gold: 16,
  },
];

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
  clothesshop: "进衣服店",
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
  ];
}

export function parentErrand(who, timeIndex) {
  if (who === "mom") {
    if (timeIndex === 0) return { scene: "home", x: 280, y: 300, job: "在家做饭" };
    if (timeIndex === 1) return { scene: "street", x: 640, y: 700, job: "去买菜" };
    return { scene: "home", x: 560, y: 200, job: "在家收拾" };
  }
  if (timeIndex === 0) return { scene: "street", x: 475, y: 900, job: "去外面办事" };
  if (timeIndex === 1) return { scene: "park", x: 390, y: 200, job: "在游乐场散步" };
  return { scene: "home", x: 420, y: 340, job: "在家休息" };
}

export function createScenes() {
  const scenes = {
    home: {
      w: 960,
      h: 540,
      hint: "棕色的大门在屋子下面，上面写着「出门去大街」。按 M 叫妈妈，按 D 叫爸爸。",
      walls: [
        { x: 0, y: 0, w: 960, h: 46 },
        { x: 0, y: 0, w: 18, h: 540 },
        { x: 942, y: 0, w: 18, h: 540 },
        { x: 0, y: 510, w: 960, h: 30 },
      ],
      spots: [
        { id: "turtle", x: 150, y: 150, r: 54, name: "乌龟缸" },
        { id: "coffee", x: 390, y: 128, r: 40, name: "咖啡机" },
        { id: "fridge", x: 560, y: 122, r: 42, name: "冰箱" },
        { id: "water", x: 700, y: 128, r: 40, name: "水桶" },
        { id: "cage", x: 840, y: 150, r: 46, name: "鸟笼子" },
        { id: "bed", x: 820, y: 390, r: 50, name: "依月的床" },
        { id: "door", x: 480, y: 455, r: 62, name: "出门去大街" },
        { id: "mom", x: 280, y: 300, r: 36, name: "妈妈", npc: "妈妈" },
        { id: "dad", x: 420, y: 340, r: 36, name: "爸爸", npc: "爸爸" },
        { id: "bro", x: 200, y: 400, r: 36, name: "哥哥", npc: "哥哥" },
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
      hint: "帮完忙，走下面那扇「出门回大街」的门。",
      walls: [
        { x: 0, y: 0, w: 960, h: 30 },
        { x: 0, y: 510, w: 960, h: 30 },
        { x: 0, y: 0, w: 20, h: 540 },
        { x: 940, y: 0, w: 20, h: 540 },
      ],
      spots: [
        { id: "leaveWork", x: 480, y: 455, r: 62, name: "出门回大街" },
      ],
    },
    shop: {
      w: 960,
      h: 540,
      hint: "走到柜台买东西。下面那扇门可以回大街。",
      walls: [
        { x: 0, y: 0, w: 960, h: 30 },
        { x: 0, y: 510, w: 960, h: 30 },
        { x: 0, y: 0, w: 20, h: 540 },
        { x: 940, y: 0, w: 20, h: 540 },
      ],
      spots: [
        { id: "counter", x: 480, y: 220, r: 50, name: "柜台" },
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
      hint: "左边下面是出门去操场。右边有一扇门，可以去厕所。",
      walls: [
        { x: 0, y: 0, w: 960, h: 30 },
        { x: 0, y: 510, w: 960, h: 30 },
        { x: 0, y: 0, w: 18, h: 540 },
        { x: 942, y: 0, w: 18, h: 540 },
      ],
      spots: [
        { id: "teacher", x: 480, y: 110, r: 42, name: "老师" },
        { id: "desk", x: 300, y: 280, r: 40, name: "小桌子" },
        { id: "friend0", x: 470, y: 300, r: 34, name: "好朋友" },
        { id: "friend1", x: 640, y: 300, r: 34, name: "好朋友" },
        { id: "friend2", x: 470, y: 400, r: 34, name: "好朋友" },
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

  HELP_JOBS.forEach((job) => {
    scenes.work.spots.push({
      id: `job-${job.id}`,
      x: job.x,
      y: job.y,
      r: 38,
      name: job.name,
      jobId: job.id,
    });
  });

  return scenes;
}
