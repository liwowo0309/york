import { CONFIG, chineseGrade, shopTitle } from "./config.js";
import { clamp } from "./math.js";
import {
  CLASSMATE_SEATS,
  DOOR_SIGNS,
  HOME_LAYOUT,
  INDOOR_DOORS,
  TEACHER_LOOKS,
  carFormation,
  classmatesAt,
  jobsForDay,
  nextLesson,
  scheduleLine,
} from "./content.js";
import { playerLook } from "./items.js";
import { plantAt } from "./world.js";

export function createRenderer(canvas, world, scenes) {
  const ctx = canvas.getContext("2d");
  const W = CONFIG.canvasWidth;
  const H = CONFIG.canvasHeight;

  function camera() {
    const scene = scenes[world.state.scene];
    return {
      x: clamp(world.player.x - W / 2, 0, Math.max(0, scene.w - W)),
      y: clamp(world.player.y - H / 2, 0, Math.max(0, scene.h - H)),
    };
  }

  function roundRect(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }

  function drawLabel(x, y, text) {
    ctx.font = "12px PingFang SC, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,246,232,0.92)";
    const w = Math.max(36, ctx.measureText(text).width + 12);
    roundRect(x - w / 2, y - 18, w, 18, 8, "rgba(255,246,232,0.92)");
    ctx.fillStyle = "#5a3b24";
    ctx.fillText(text, x, y - 5);
  }

  function drawDoor(x, y, label, opts = {}) {
    const w = opts.w || 74;
    const h = opts.h || 102;
    const bounce = Math.sin(world.anim * 0.14) * 2;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(x, y + 6, w * 0.42, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    roundRect(x - w / 2 - 7, y - h + bounce, w + 14, h + 8, 8, "#5a3218");
    roundRect(x - w / 2, y - h + 8 + bounce, w, h - 8, 6, "#d4924a");
    roundRect(x - w / 2 + 8, y - h + 16 + bounce, w - 16, (h - 36) / 2, 4, "#e8b56a");
    roundRect(x - w / 2 + 8, y - h / 2 + 2 + bounce, w - 16, (h - 36) / 2, 4, "#e8b56a");
    ctx.beginPath();
    ctx.fillStyle = "#f0c14a";
    ctx.arc(x + w / 2 - 16, y - h / 2 + 6 + bounce, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "#fff6e8";
    ctx.moveTo(x - 8, y - h - 6 + bounce);
    ctx.lineTo(x + 8, y - h - 6 + bounce);
    ctx.lineTo(x, y - h - 18 + bounce);
    ctx.closePath();
    ctx.fill();
    ctx.font = "bold 14px PingFang SC, sans-serif";
    ctx.textAlign = "center";
    const tw = Math.max(86, ctx.measureText(label).width + 18);
    roundRect(x - tw / 2, y + 10, tw, 22, 10, "#c45c4a");
    ctx.fillStyle = "#fff6e8";
    ctx.fillText(label, x, y + 26);
  }

  function drawSceneDoors() {
    scenes[world.state.scene].spots.forEach((spot) => {
      const label = DOOR_SIGNS[spot.id];
      if (!label) return;
      const indoor = INDOOR_DOORS.includes(spot.id);
      drawDoor(spot.x, spot.y, label, indoor ? { w: 80, h: 108 } : { w: 62, h: 88 });
    });
  }

  function drawPerson(x, y, look, name, bounce = 0) {
    const g = 3 * Math.sin(bounce);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = look.skirt;
    roundRect(x - 11, y - 2 + g, 22, 16, 6, look.skirt);
    ctx.fillStyle = look.shirt;
    roundRect(x - 10, y - 12 + g, 20, 14, 6, look.shirt);
    ctx.beginPath();
    ctx.fillStyle = look.skin || "#f3c7a3";
    ctx.arc(x, y - 20 + g, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = look.hair;
    ctx.arc(x, y - 24 + g, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3b2a1a";
    ctx.beginPath();
    ctx.arc(x - 3.5, y - 20 + g, 1.3, 0, Math.PI * 2);
    ctx.arc(x + 3.5, y - 20 + g, 1.3, 0, Math.PI * 2);
    ctx.fill();
    if (look.hatColor) {
      ctx.fillStyle = look.hatColor;
      ctx.beginPath();
      ctx.ellipse(x, y - 28 + g, 13, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      roundRect(x - 8, y - 35 + g, 16, 9, 4, look.hatColor);
    }
    if (look.flowerColor) {
      ctx.beginPath();
      ctx.fillStyle = look.flowerColor;
      ctx.arc(x + 8, y - 22 + g, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#f7e27a";
      ctx.arc(x + 8, y - 22 + g, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (look.shoesColor) {
      ctx.fillStyle = look.shoesColor;
      ctx.beginPath();
      ctx.ellipse(x - 6, y + 16 + g, 5, 2.8, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 6, y + 16 + g, 5, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (name) drawLabel(x, y + 32, name);
  }

  function drawHouse(x, y, w, h, roof, body, floors, title) {
    ctx.fillStyle = roof;
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 36);
    ctx.lineTo(x + w / 2, y - 10);
    ctx.lineTo(x + w + 10, y + 36);
    ctx.closePath();
    ctx.fill();
    roundRect(x, y + 28, w, h, 8, body);
    const rows = floors;
    const cols = 3;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        roundRect(x + 18 + c * ((w - 36) / cols), y + 44 + r * ((h - 70) / rows), 28, 16, 3, "#fff3b8");
      }
    }
    const dx = x + w / 2;
    const dy = y + 28 + h;
    roundRect(dx - 28, dy - 52, 56, 52, 6, "#5a3218");
    roundRect(dx - 22, dy - 46, 44, 46, 5, "#d4924a");
    ctx.beginPath();
    ctx.fillStyle = "#f0c14a";
    ctx.arc(dx + 10, dy - 24, 4, 0, Math.PI * 2);
    ctx.fill();
    drawLabel(x + w / 2, y + 24, title);
  }

  function drawTree(x, y, color = "#3f8f4a") {
    ctx.fillStyle = "#7a4e2a";
    ctx.fillRect(x - 4, y, 8, 22);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y - 6, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTurtle(x, y) {
    ctx.fillStyle = "#5d8f4f";
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8fbf6a";
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4d7a42";
    ctx.beginPath();
    ctx.arc(x + 12, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBird(x, y, color) {
    const flap = Math.sin(world.anim * 0.2 + x) * 5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10, y - 6 - flap);
    ctx.lineTo(x - 4, y);
    ctx.fill();
  }

  function drawEmoji(x, y, emoji, size = 18) {
    ctx.font = `${size}px Apple Color Emoji, Segoe UI Emoji, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(emoji, x, y);
  }

  function drawFlag(x, y) {
    ctx.strokeStyle = "#8a5a32";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y - 36);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
    ctx.fillStyle = "#e0578b";
    ctx.beginPath();
    ctx.moveTo(x, y - 34);
    ctx.lineTo(x + 26, y - 24);
    ctx.lineTo(x, y - 14);
    ctx.fill();
    ctx.lineWidth = 1;
  }

  function drawCar(x, y, moving, label) {
    roundRect(x - 34, y - 14, 68, 28, 10, "#d94c4c");
    roundRect(x - 18, y - 24, 36, 16, 6, "#bfe9ff");
    ctx.fillStyle = "#2c2118";
    ctx.beginPath();
    ctx.arc(x - 22, y + 14, 7, 0, Math.PI * 2);
    ctx.arc(x + 22, y + 14, 7, 0, Math.PI * 2);
    ctx.fill();
    if (label) drawLabel(x, y - 28, label);
    else if (!moving) drawLabel(x, y - 28, "车");
  }

  function drawHome() {
    const { state, anim } = world;
    const L = HOME_LAYOUT;
    ctx.fillStyle = "#f0d9b0";
    ctx.fillRect(0, 0, 960, 540);
    roundRect(40, 60, 880, 430, 18, "#f7e4c4");
    roundRect(56, 76, 292, 396, 16, "#f4d4ae");
    roundRect(356, 76, 272, 168, 16, "#efe4cf");
    roundRect(636, 76, 276, 396, 16, "#ead6c0");
    drawLabel(200, 70, "客厅");
    drawLabel(492, 70, "厨房");
    drawLabel(774, 70, "卧室");

    roundRect(70, 96, 200, 130, 16, "#9ad4de");
    state.turtles.forEach((t, i) => {
      const tx = 110 + Math.sin(anim * t.s + i) * 50 + t.x * 80;
      const ty = 136 + Math.cos(anim * t.s * 0.8 + i) * 22;
      drawTurtle(tx, ty);
    });
    drawLabel(L.turtle.x, 90, "乌龟");
    roundRect(70, 290, 210, 88, 16, "#e07a6a");
    drawLabel(L.sofa.x, 282, "沙发");
    roundRect(L.cage.x - 58, 96, 116, 128, 12, "#f6e7c8");
    (state.pets || []).slice(0, 12).forEach((pet, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      drawEmoji(L.cage.x - 40 + col * 26, 128 + row * 28, pet.emoji || "🐾", 18);
    });
    drawLabel(L.cage.x, 90, state.pets?.length ? `宠物 ${state.pets.length}` : "宠物角");

    roundRect(370, 96, 244, 88, 12, "#e8d5b5");
    roundRect(L.coffee.x - 40, 104, 80, 62, 10, "#d9d3c7");
    ctx.fillStyle = "#c9834a";
    ctx.fillRect(L.coffee.x - 16, 118, 32, 26);
    drawLabel(L.coffee.x, 98, "咖啡");
    roundRect(L.fridge.x - 34, 100, 68, 80, 8, "#d5e8ef");
    ctx.fillStyle = "#8bb8c9";
    ctx.fillRect(L.fridge.x - 26, 108, 52, 18);
    drawLabel(L.fridge.x, 94, "冰箱");
    roundRect(L.water.x - 32, 108, 64, 58, 12, "#7eb6e6");
    drawLabel(L.water.x, 102, "水");

    roundRect(L.wardrobe.x - 40, 96, 82, 118, 10, "#8a5a32");
    ctx.fillStyle = "#c9894a";
    ctx.fillRect(L.wardrobe.x - 30, 108, 26, 94);
    ctx.fillRect(L.wardrobe.x + 4, 108, 26, 94);
    drawLabel(L.wardrobe.x, 90, "衣柜");
    roundRect(L.study.x - 48, 92, 52, 88, 8, "#6b4226");
    [["#c45c4a", 0], ["#4d8fdb", 10], ["#f0c14a", 20], ["#6aae6d", 30]].forEach(([color, dx]) => {
      ctx.fillStyle = color;
      ctx.fillRect(L.study.x - 40 + dx, 104, 8, 22);
      ctx.fillRect(L.study.x - 40 + dx, 136, 8, 22);
    });
    roundRect(L.study.x - 8, 132, 86, 50, 8, "#c9894a");
    ctx.fillStyle = "#fff6e8";
    ctx.fillRect(L.study.x + 4, 140, 28, 34);
    ctx.fillRect(L.study.x + 38, 140, 28, 34);
    drawLabel(L.study.x + 10, 88, "书桌");

    [
      [660, 250, "哥哥"],
      [780, 250, "依月"],
      [660, 380, "爸爸"],
      [780, 380, "妈妈"],
    ].forEach(([x, y, name]) => {
      roundRect(x, y, 110, 46, 10, "#f4f0e4");
      drawLabel(x + 55, y + 8, name);
    });
    roundRect(430, 488, 100, 14, 6, "#e8d0a0");
  }

  function drawStreet() {
    const { state } = world;
    ctx.fillStyle = "#8fbc6b";
    ctx.fillRect(0, 0, 1600, 1000);
    ctx.fillStyle = "#d9c08a";
    ctx.fillRect(0, 400, 1600, 90);
    ctx.fillRect(0, 680, 1600, 70);
    ctx.fillRect(230, 400, 80, 600);
    drawHouse(50, 50, 230, 250, "#d45d5d", "#f3efe4", 4, "教学楼 4 层");
    drawHouse(330, 40, 230, 300, "#4f7dbe", "#eef3fa", 6, "旁边的楼 6 层");
    roundRect(600, 60, 250, 280, 12, "#7ecf7a");
    drawLabel(725, 54, "学校操场");
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.strokeRect(640, 110, 80, 80);
    ctx.beginPath();
    ctx.arc(820, 200, 36, 0, Math.PI * 2);
    ctx.stroke();
    roundRect(920, 40, 620, 340, 16, "#b7e3ef");
    drawLabel(1230, 36, "游乐场 · 沙滩 · 花园");
    drawTree(980, 160);
    drawTree(1400, 120, "#5aae61");
    roundRect(960, 220, 160, 70, 10, "#e7d39a");
    drawHouse(50, 480, 200, 120, "#c9844a", "#f7e0c4", 1, "大车店");
    drawHouse(310, 500, 180, 110, "#8a8a8a", "#ececec", 2, "邮局");
    drawHouse(550, 500, 180, 110, "#e07a6a", "#ffe4d6", 1, "食物店");
    drawHouse(790, 500, 180, 110, "#b56bdb", "#f3e5ff", 1, "衣服鞋子店");
    drawHouse(1030, 500, 180, 110, "#6aae6d", "#e5f6d6", 1, "种子店");
    drawHouse(1270, 500, 180, 110, "#e7a04a", "#fff1d6", 1, "宠物店");
    drawHouse(50, 770, 240, 130, "#c45c4a", "#f8d7b0", 1, "我们的家");
    drawHouse(370, 780, 210, 120, "#e8a54b", "#fff0d2", 1, "帮助站");
    drawHouse(650, 780, 210, 120, "#7eb6e6", "#e4f4ff", 1, "诊所");
    drawHouse(880, 780, 230, 120, "#8a6a48", "#efe4c8", 1, "书店");
    if (!(state.driving && state.rideMode === "separate")) {
      const parked = Math.max(0, state.carCount - (state.driving ? 1 : 0));
      [{ x: 70, y: 715 }, { x: 150, y: 715 }, { x: 230, y: 715 }, { x: 310, y: 715 }]
        .slice(0, parked)
        .forEach((spot) => drawCar(spot.x, spot.y, false, "车"));
    }
    drawLabel(250, 390, "往北：学校 · 操场 · 游乐场");
    for (let i = 0; i < 8; i += 1) {
      ctx.fillStyle = i % 2 ? "#f4f0e4" : "#d45d5d";
      ctx.fillRect(260 + i * 22, 430, 18, 8);
    }
  }

  function drawPark() {
    const { state, anim } = world;
    ctx.fillStyle = "#8fbc6b";
    ctx.fillRect(0, 0, 1100, 700);
    roundRect(40, 40, 500, 280, 18, "#7ecf7a");
    ctx.fillStyle = "#d45d5d";
    ctx.fillRect(120, 80, 18, 120);
    ctx.fillStyle = "#f0c14a";
    ctx.beginPath();
    ctx.moveTo(138, 80);
    ctx.lineTo(220, 180);
    ctx.lineTo(138, 180);
    ctx.fill();
    ctx.strokeStyle = "#c9844a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(340, 80);
    ctx.lineTo(340, 200);
    ctx.moveTo(430, 80);
    ctx.lineTo(430, 200);
    ctx.moveTo(340, 90);
    ctx.quadraticCurveTo(385, 140 + Math.sin(anim * 0.08) * 10, 430, 90);
    ctx.stroke();
    ctx.lineWidth = 1;
    roundRect(60, 340, 360, 220, 18, "#e7d39a");
    drawLabel(240, 360, "沙滩");
    roundRect(560, 80, 500, 360, 18, "#c9e8a8");
    for (let i = 0; i < 6; i += 1) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 590 + col * 120;
      const y = 170 + row * 120;
      roundRect(x, y, 70, 70, 10, "#a57a48");
      const plant = plantAt(state, i);
      if (plant) {
        const colors = { apple: "#d45d5d", tree: "#2f7a3a", flower: "#e07a6a" };
        if (plant.stage === 0) {
          ctx.fillStyle = "#7a4e2a";
          ctx.fillRect(x + 32, y + 40, 6, 12);
        } else {
          drawTree(x + 35, y + 40, colors[plant.type]);
        }
      }
    }
  }

  function drawWork() {
    const { state, anim } = world;
    ctx.fillStyle = "#f7e4c4";
    ctx.fillRect(0, 0, 960, 540);
    roundRect(40, 40, 880, 430, 16, "#fff6e8");
    ctx.font = "22px PingFang SC, sans-serif";
    ctx.fillStyle = "#c45c4a";
    ctx.textAlign = "center";
    ctx.fillText("帮助别人，才能拿到工钱", 480, 80);
    jobsForDay(state.day).forEach((job, i) => {
      drawPerson(job.x, job.y, { hair: "#4a3328", shirt: job.color, skirt: "#6b5344", skin: "#e8b68a" }, job.name, anim * (0.04 + i * 0.01));
      if (!state.helpedToday[job.id]) {
        ctx.fillStyle = job.hard >= 3 ? "#c45c4a" : "#e8a54b";
        ctx.beginPath();
        ctx.arc(job.x, job.y - 48, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawShop() {
    const palettes = {
      food: "#ffe4d6",
      clothes: "#f3e5ff",
      book: "#efe4c8",
      seed: "#e5f6d6",
      bird: "#fff1d6",
      car: "#f7e0c4",
    };
    ctx.fillStyle = palettes[world.state.shop] || "#fff6e8";
    ctx.fillRect(0, 0, 960, 540);
    roundRect(200, 80, 560, 200, 18, "#fff6e8");
    drawPerson(480, 220, { hair: "#6b3a2a", shirt: "#c9894a", skirt: "#8a5a32", skin: "#f0c09a" }, "店员", 0);
    if (world.state.shop === "bird") {
      ["🐟", "🐱", "🐶", "🐸", "🐰", "🐹", "🐦", "🐢"].forEach((emoji, i) => {
        drawEmoji(230 + i * 70, 150, emoji, 28);
      });
    }
    if (world.state.shop === "book") {
      roundRect(150, 200, 110, 70, 10, "#c9894a");
      ctx.fillStyle = "#fff6e8";
      ctx.fillRect(160, 208, 36, 42);
      ctx.fillRect(214, 208, 36, 42);
      drawLabel(205, 194, "看书");
    }
    ctx.font = "28px PingFang SC, sans-serif";
    ctx.fillStyle = "#5a3b24";
    ctx.textAlign = "center";
    ctx.fillText(shopTitle(world.state.shop), 480, 70);
  }

  function drawSchoolYard() {
    const { state } = world;
    ctx.fillStyle = "#7ecf7a";
    ctx.fillRect(0, 0, 960, 540);
    ctx.strokeStyle = "#f4f0e4";
    ctx.lineWidth = 4;
    ctx.strokeRect(120, 120, 160, 200);
    ctx.beginPath();
    ctx.arc(200, 220, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#e0578b";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(480, 248 + i * 28, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(760, 230, 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    drawLabel(200, 108, "篮球");
    drawLabel(480, 220, "跳绳");
    drawLabel(760, 140, "足球");
    const lesson = nextLesson(state);
    if (lesson && lesson.id === "pe") {
      drawFlag(500, 108);
      drawPerson(430, 132, TEACHER_LOOKS["马老师"], "马老师", 0);
      drawPerson(560, 148, TEACHER_LOOKS["于老师"], "于老师", 0);
      drawPerson(340, 150, TEACHER_LOOKS["李老师"], "李老师", 0);
    }
  }

  function drawClassroom() {
    const { state, anim } = world;
    ctx.fillStyle = "#f3efe4";
    ctx.fillRect(0, 0, 960, 540);
    roundRect(160, 36, 640, 86, 8, "#3f8f4a");
    ctx.fillStyle = "white";
    ctx.font = "18px PingFang SC, sans-serif";
    ctx.textAlign = "center";
    const ownClass = state.gradeFloor === state.playerGrade;
    const lesson = nextLesson(state);
    ctx.fillText(`${chineseGrade(state.gradeFloor)}  ·  第 ${state.gradeFloor <= 4 ? state.gradeFloor : state.gradeFloor - 4} 层`, 480, 68);
    ctx.font = "15px PingFang SC, sans-serif";
    ctx.fillText(ownClass ? scheduleLine(state.day) : "这是别的年级", 480, 96);
    if (ownClass && lesson && lesson.id === "pe") {
      drawFlag(600, 130);
      drawPerson(480, 168, TEACHER_LOOKS["马老师"], "马老师", 0);
      drawPerson(640, 186, TEACHER_LOOKS["于老师"], "于老师", 0);
      drawPerson(360, 186, TEACHER_LOOKS["李老师"], "李老师", 0);
    } else {
      const teacherName = ownClass && lesson ? lesson.teacher : "老师";
      drawPerson(480, 168, TEACHER_LOOKS[teacherName] || TEACHER_LOOKS["老师"], teacherName, 0);
    }
    [[300, 280], [470, 300], [640, 300], [300, 400], [470, 400], [640, 400]].forEach(([x, y]) => {
      roundRect(x - 28, y - 8, 56, 28, 6, "#e0c090");
    });
    const looks = [
      { hair: "#c9844a", shirt: "#ee7aa0", skirt: "#d45d6b", skin: "#f3c7a3" },
      { hair: "#6b3a2a", shirt: "#e8a0c0", skirt: "#c56b8a", skin: "#f0c09a" },
      { hair: "#5c3d2e", shirt: "#4d8fdb", skirt: "#355f96", skin: "#f3c7a3" },
      { hair: "#3b2b22", shirt: "#b56bdb", skirt: "#e7c4ff", skin: "#f0c09a" },
      { hair: "#8b5a2b", shirt: "#6aae6d", skirt: "#4f7d53", skin: "#f3c7a3" },
    ];
    const names = classmatesAt(state.gradeFloor, state.playerGrade);
    names.forEach((name, i) => {
      const seat = CLASSMATE_SEATS[i];
      if (!seat) return;
      drawPerson(seat.x, seat.y, looks[i], name, anim * (0.03 + i * 0.008));
    });
    roundRect(800, 90, 120, 200, 12, "#d5e8ef");
    ctx.font = "16px PingFang SC, sans-serif";
    ctx.fillStyle = "#355f96";
    ctx.textAlign = "center";
    ctx.fillText("厕所在这边", 860, 120);
  }

  function drawDance() {
    ctx.fillStyle = "#ffe4ef";
    ctx.fillRect(0, 0, 960, 540);
    roundRect(70, 70, 820, 340, 16, "#fff6f8");
    ctx.strokeStyle = "#c9844a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(120, 150);
    ctx.lineTo(840, 150);
    ctx.stroke();
    ctx.lineWidth = 1;
    drawPerson(480, 240, TEACHER_LOOKS["美老师"], "美老师", 0);
    drawLabel(480, 330, "坐在这里上课");
  }

  function drawMusic() {
    ctx.fillStyle = "#f3e5ff";
    ctx.fillRect(0, 0, 960, 540);
    roundRect(70, 70, 820, 340, 16, "#faf4ff");
    roundRect(160, 250, 220, 70, 10, "#3b2b22");
    ctx.fillStyle = "#f4f0e4";
    for (let i = 0; i < 8; i += 1) ctx.fillRect(176 + i * 24, 262, 14, 36);
    drawPerson(620, 240, TEACHER_LOOKS["音乐老师"], "音乐老师", 0);
    drawLabel(270, 236, "钢琴");
    drawLabel(620, 320, "坐在这里上课");
  }

  function drawBath() {
    ctx.fillStyle = "#e4f4ff";
    ctx.fillRect(0, 0, 960, 540);
    roundRect(220, 160, 160, 140, 12, "#d5e8ef");
    roundRect(540, 150, 180, 180, 12, "#f4f0e4");
    drawLabel(300, 150, "洗手");
    drawLabel(630, 140, "隔间");
  }

  function draw() {
    const { state, player, brother, mom, dad } = world;
    ctx.clearRect(0, 0, W, H);
    const cam = camera();
    ctx.save();
    ctx.translate(-cam.x, -cam.y);

    if (state.scene === "home") drawHome();
    else if (state.scene === "street") drawStreet();
    else if (state.scene === "park") drawPark();
    else if (state.scene === "work") drawWork();
    else if (state.scene === "shop") drawShop();
    else if (state.scene === "schoolYard") drawSchoolYard();
    else if (state.scene === "classroom") drawClassroom();
    else if (state.scene === "dance") drawDance();
    else if (state.scene === "music") drawMusic();
    else if (state.scene === "bath") drawBath();

    drawSceneDoors();

    if (state.scene === "park") {
      state.wildBirds.forEach((bird) => drawBird(bird.x, bird.y, bird.color));
    }

    const riding = state.driving && state.scene === "street";
    if (!riding && brother.scene === state.scene) {
      drawPerson(
        brother.x,
        brother.y,
        CONFIG.familyLooks["哥哥"],
        brother.following ? "哥哥（跟着）" : "哥哥",
        brother.walk * 0.35
      );
    }
    if (!riding && mom.scene === state.scene) {
      drawPerson(mom.x, mom.y, CONFIG.familyLooks["妈妈"], mom.called ? "妈妈（过来了）" : "妈妈", mom.walk * 0.35);
    }
    if (!riding && dad.scene === state.scene) {
      drawPerson(dad.x, dad.y, CONFIG.familyLooks["爸爸"], dad.called ? "爸爸（过来了）" : "爸爸", dad.walk * 0.35);
    }
    const bounce = player.walk * 0.35;
    if (riding) {
      carFormation(state.rideMode, player).forEach((car) => {
        if (car.draw) drawCar(car.x, car.y, true, car.label);
      });
    } else drawPerson(player.x, player.y, playerLook(state), CONFIG.playerName, bounce);

    ctx.restore();
  }

  return { draw, camera };
}
