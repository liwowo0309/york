export const CONFIG = {
  canvasWidth: 960,
  canvasHeight: 540,
  saveKey: "yiyue-home-save-v1",
  saveVersion: 1,
  playerName: "依月",
  playerNameEn: "Leah",
  times: ["早上", "下午", "傍晚"],
  seedNames: {
    apple: "苹果种子",
    tree: "大树种子",
    flower: "花种子",
  },
  grades: ["", "一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "七年级", "八年级", "九年级", "十年级"],
  shopTitles: {
    food: "食物店",
    clothes: "衣服店",
    seed: "种子店",
    bird: "鸟笼子店",
    car: "大车店",
  },
  sceneTitles: {
    home: "家里",
    street: "大街",
    park: "游乐场和花园",
    work: "帮助别人的地方",
    schoolYard: "学校大操场",
    bath: "学校厕所",
  },
  outfits: {
    home: { hair: "#f2b3c8", shirt: "#ee7aa0", skirt: "#f7c1d4" },
    school: { hair: "#f2b3c8", shirt: "#f4f7ff", skirt: "#3d6fd8" },
    sport: { hair: "#f2b3c8", shirt: "#3cb89a", skirt: "#2a8f78" },
    fancy: { hair: "#f2b3c8", shirt: "#b56bdb", skirt: "#e7c4ff" },
  },
  familyLooks: {
    哥哥: { hair: "#5c3d2e", shirt: "#4d8fdb", skirt: "#355f96", skin: "#f3c7a3" },
    妈妈: { hair: "#6b3a2a", shirt: "#d45d6b", skirt: "#a83d4d", skin: "#f0c09a" },
    爸爸: { hair: "#3b2b22", shirt: "#5b6b4a", skirt: "#3f4b34", skin: "#e8b68a" },
  },
};

export function chineseGrade(n) {
  return CONFIG.grades[n] || "";
}

export function shopTitle(kind) {
  return CONFIG.shopTitles[kind] || "商店";
}

export function timeName(index) {
  return CONFIG.times[index] || "";
}
