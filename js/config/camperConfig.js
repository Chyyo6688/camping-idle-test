// Editable Camper appearance, animation sheets, profile questions, and personality data.

const CAMPER_LAYER_SHEET_ROOT = "assets/characters";
const CAMPER_NIGHT_LAYER_SHEET_ROOT = "assets/characters/night";
const CAMPER_SHEET_COLUMNS = 7;
const CAMPER_IDLE_FRAME_NAME = "camper_idle.png";
const CAMPER_SHEET_FRAME_NAMES = [
  "camper_idle.png",
  "camper_walk_01.png",
  "camper_walk_02.png",
  "camper_walk_03.png",
  "camper_walk_04.png",
  "camper_walk_05.png",
  "camper_walk_06.png",
  "camper_carry_wood _01.png",
  "camper_carry_wood _02.png",
  "camper_carry_wood _03.png",
  "camper_carry_wood _04.png",
  "camper_carry_wood _05.png",
  "camper_carry_wood _06.png",
  "camper_carry_wood.png",
  "camper_sit.png",
  "camper_sit_ground.png",
  "camper_sit_chair.png",
  "camper_look_lake_back.png",
  "camper_rest.png",
  "__unused_01",
  "__unused_02",
  "camper_activity_cook_01.png",
  "camper_activity_cook_02.png",
  "camper_activity_cook_03.png",
  "camper_activity_cook_04.png",
  "camper_activity_birdwatch_01.png",
  "camper_activity_birdwatch_02.png",
  "camper_activity_birdwatch_03.png",
  "camper_activity_fish_01.png",
  "camper_activity_fish_02.png",
  "camper_activity_fish_03.png",
  "camper_activity_fish_04.png"
];
const CAMPER_SHEET_ROWS = 6;
const CAMPER_LAYER_RENDER_ORDER = [
  { id: "bodyBase", sheet: "camper_body_base.png" },
  { id: "eyes", sheet: "camper_eye_bright.png", appearanceCategory: "eyes" },
  { id: "nose", sheet: "camper_nose_tiny.png", appearanceCategory: "nose" },
  { id: "mouth", sheet: "camper_mouth_smallsmile.png", appearanceCategory: "mouth" },
  { id: "clothes", sheet: "camper_top_1.png", appearanceCategory: "clothes" },
  { id: "hair", sheet: "camper_hair_short.png", appearanceCategory: "hair" },
  { id: "accessory", sheet: "", appearanceCategory: "accessory" }
];
const CAMPER_HAIR_COLOR_RANGE = { min: 0, max: 360, step: 1, defaultValue: 0 };
const CAMPER_APPEARANCE_LEGACY_FIELD_MAP = {
  clothes: "top"
};
const CAMPER_APPEARANCE_CATEGORIES = [
  { id: "hair", label: "发型", renderLayerId: "hair" },
  { id: "hairColor", label: "发色", renderLayerId: "hair", control: "range", min: CAMPER_HAIR_COLOR_RANGE.min, max: CAMPER_HAIR_COLOR_RANGE.max, step: CAMPER_HAIR_COLOR_RANGE.step, defaultValue: CAMPER_HAIR_COLOR_RANGE.defaultValue },
  { id: "eyes", label: "眼睛", renderLayerId: "eyes" },
  { id: "nose", label: "鼻子", renderLayerId: "nose" },
  { id: "mouth", label: "嘴巴", renderLayerId: "mouth" },
  { id: "clothes", label: "衣服", renderLayerId: "clothes" },
  { id: "accessory", label: "配饰", renderLayerId: "accessory" },
];
const CAMPER_APPEARANCE_OPTIONS = {
  hair: [
    { id: "bob", label: "短发", assetSheet: "camper_hair_bob.png" },
    { id: "short", label: "少年发", assetSheet: "camper_hair_short.png" },
    { id: "short-curl", label: "短卷发", assetSheet: "camper_hair_shortcurl.png" },
    { id: "longb-braided", label: "麻花辫", assetSheet: "camper_hair_longbraided.png" }
  ],
  accessory: [
    { id: "none", label: "无配饰", assetSheet: "" },
    { id: "hat", label: "帽子", assetSheet: "camper_accessory_hat.png" },
    { id: "hat2", label: "帽兜", assetSheet: "camper_accessory_hat2.png" }
  ],
  eyes: [
    { id: "watering", label: "水汪汪", assetSheet: "camper_eye_watering.png" },
    { id: "bright", label: "明亮眼睛", assetSheet: "camper_eye_bright.png" },
    { id: "smile", label: "眯眯眼", assetSheet: "camper_eye_smile.png" },
    { id: "determined", label: "坚毅眼神", assetSheet: "camper_eye_determined.png" }
  ],
  nose: [
    { id: "tiny", label: "小鼻子", assetSheet: "camper_nose_tiny.png" },
    { id: "button", label: "圆鼻子", assetSheet: "camper_nose_button.png" },
    { id: "determined", label: "利落鼻子", assetSheet: "camper_nose_determined.png" }
  ],
  mouth: [
    { id: "small-smile", label: "微笑", assetSheet: "camper_mouth_smallsmile.png" },
    { id: "laugh", label: "开朗", assetSheet: "camper_mouth_laugh.png" },
    { id: "determined", label: "坚定", assetSheet: "camper_mouth_determined.png" }
  ],
  clothes: [
    { id: "top-1", label: "秋野漫步", assetSheet: "camper_top_1.png" }, 
    { id: "top-2", label: "雨林夜行", assetSheet: "camper_top_2.png" },
    { id: "top-3", label: "森间茶歇", assetSheet: "camper_top_3.png" },
    { id: "top-4", label: "山径轻装", assetSheet: "camper_top_4.png" },
    { id: "top-5", label: "松影斗篷", assetSheet: "camper_top_5.png" }
  ]
};


const camperActionLabels = {
  idle: "Pausing around camp",
  wandering: "Wandering around camp",
  movingToWood: "Walking over to fallen branches",
  pickupWood: "Picking up branches",
  carryingWoodToFire: "Carrying branches to the campfire",
  addingWoodToFire: "Adding branches to the fire",
  resting: "Resting in the quiet grass",
  lookingAtLake: "Looking across the lake",
  sittingByFire: "Sitting by the campfire",
  sittingOnFurniture: "Settling into camp seating",
  sittingOnChair: "Settling into the camp chair",
  observingGear: "Inspecting camp gear",
  tentRest: "Resting inside the tent",
  cook: "Cooking at camp",
  fish: "Fishing by the lake",
  birdwatch: "Birdwatching"
};

const camperThoughtLines = {
  wandering: ["随便走走", "看看营地", "今天风不错", "找个舒服角落", "慢慢来就好"],
  lookingAtLake: ["看看湖吧", "水面好安静", "那边有光", "发会儿呆", "湖风刚刚好"],
  sittingByFire: ["烤会儿火吧", "火苗真暖", "添点柴更好", "这里最舒服", "听木柴噼啪"],
  sittingOnFurniture: ["坐一会儿", "这椅子不错", "休息一下", "舒服多了", "营地越来越像样"],
  sittingOnChair: ["坐一会儿", "这椅子不错", "休息一下", "舒服多了", "看看火光"],
  observingGear: ["看看这个", "这里好像不错", "检查一下小角落", "这个位置可以"],
  resting: ["小累一会儿", "闭眼休息", "草地很软", "先躺一下", "慢慢恢复"],
  tentRest: ["钻进帐篷", "帐篷里好安心", "小睡一会儿", "外面风声好轻", "今晚睡这里"]
};

camperThoughtLines.cook = ["锅里开始香了", "先搅一搅", "营地要有热乎气", "这一口会很安心"];
camperThoughtLines.fish = ["水面动了一下", "线要慢慢放", "湖边很适合等", "今天也许有收获"];
camperThoughtLines.birdwatch = ["那边有翅膀声", "先别惊动它", "树影里有小动静", "看到一闪而过"];

const CAMPER_PROFILE_VERSION = 1;
const CAMPER_PROFILE_QUESTION_COUNT = 5;
const CAMPER_PERSONALITIES = {
  slowMood: {
    title: "慢半拍氛围型",
    description: "总是比世界慢一点点，但刚好慢到能听见风声。这个 Camper 会把营地过成一段软软的留白。",
    catchphrase: "不急，风会替我计时。",
    cardBackground: "assets/backgrounds/camper-card/slowMood.png",
    idleWeights: { wandering: 2, lookingAtLake: 5, sittingByFire: 3, resting: 4, tentRest: 2 },
    bubbles: {
      wandering: ["不急，路会自己出现", "先绕一下也不错"],
      lookingAtLake: ["湖面替我想事情", "这里适合慢慢发呆"],
      resting: ["暂停也算一种进度", "让我缓冲一下"],
      sittingByFire: ["火苗慢慢跳就好"]
    }
  },
  lampKeeper: {
    title: "小灯守护型",
    description: "会默默确认每个角落都有一点光。不是很大声，但营地一暗下来就会让人安心。",
    catchphrase: "亮一点，心就稳一点。",
    cardBackground: "assets/backgrounds/camper-card/lampKeeper.png",
    idleWeights: { wandering: 2, lookingAtLake: 2, sittingByFire: 4, resting: 2, tentRest: 3 },
    nightWeights: { tentRest: 3, sittingByFire: 2 },
    bubbles: {
      wandering: ["那边有点暗，我看看", "小灯应该够亮吧"],
      sittingByFire: ["守一下这团光", "亮着就安心"],
      tentRest: ["灯留一盏就好"],
      lookingAtLake: ["水上有一点光"]
    }
  },
  sitFirst: {
    title: "坐下再说型",
    description: "遇事先找一个能坐的地方。坐稳以后，连空气都会变得比较好商量。",
    catchphrase: "先坐下，其他事等会儿说。",
    cardBackground: "assets/backgrounds/camper-card/sitFirst.png",
    idleWeights: { sittingOnFurniture: 6, sittingByFire: 4, resting: 3, wandering: 1 },
    bubbles: {
      sittingOnFurniture: ["坐下再决定", "这个位置有前途", "先让膝盖同意"],
      sittingByFire: ["这边也能坐", "坐着看火比较对"],
      wandering: ["找找有没有能坐的"]
    }
  },
  gearHoarder: {
    title: "囤装备妖怪型",
    description: "看到空地就想象那里能放点什么。营地不是乱，是很多小心思暂时住在一起。",
    catchphrase: "这个以后肯定用得上。",
    cardBackground: "assets/backgrounds/camper-card/gearHoarder.png",
    idleWeights: { observingGear: 5, wandering: 3, sittingByFire: 2, sittingOnFurniture: 2 },
    bubbles: {
      observingGear: ["这个放这儿有道理", "再多一点点就完美", "我只是看看库存"],
      wandering: ["空地在召唤我", "那里好像还能摆点什么"],
      sittingOnFurniture: ["装备多了，心就稳了"]
    }
  },
  carefulArranger: {
    title: "认真摆放型",
    description: "会认真对齐看不见的线。别人看到的是营地，它看到的是刚刚好的位置。",
    catchphrase: "再挪一点点就刚好。",
    cardBackground: "assets/backgrounds/camper-card/carefulArranger.png",
    idleWeights: { observingGear: 6, wandering: 2, lookingAtLake: 2, sittingOnFurniture: 2 },
    bubbles: {
      observingGear: ["这里差半步", "角度好像可以更乖", "摆正一点点"],
      wandering: ["从这边看比较顺", "我检查一下动线"],
      lookingAtLake: ["湖边这条线很好"]
    }
  },
  vanishSoftly: {
    title: "消失一下型",
    description: "不是离开，只是需要把自己收进安静里。过一会儿会带着一点点电量回来。",
    catchphrase: "我在，只是先安静一下。",
    cardBackground: "assets/backgrounds/camper-card/vanishSoftly.png",
    idleWeights: { tentRest: 5, resting: 5, lookingAtLake: 3, wandering: 1 },
    nightWeights: { tentRest: 4, resting: 2 },
    bubbles: {
      tentRest: ["我离线一下", "帐篷里信号比较软"],
      resting: ["把自己放低一点", "安静充电中"],
      lookingAtLake: ["我在，但先不说话"]
    }
  },
  prettyFrame: {
    title: "精致摆拍型",
    description: "会在普通时刻里找到好看的角度。连一根树枝，都可能被它看成今日主角。",
    catchphrase: "等一下，这个角度很会。",
    cardBackground: "assets/backgrounds/camper-card/prettyFrame.png",
    idleWeights: { observingGear: 4, lookingAtLake: 4, wandering: 2, sittingOnFurniture: 3 },
    bubbles: {
      observingGear: ["这个角度很上镜", "先别动，画面刚好", "这里有点可爱"],
      lookingAtLake: ["湖面像滤镜", "这光线很会"],
      sittingOnFurniture: ["坐姿也要有构图"]
    }
  },
  forestWanderer: {
    title: "森林乱逛型",
    description: "总能被树影、小路和远处的山吸走注意力。它不是迷路，只是在认真收集营地附近的风。",
    catchphrase: "我去那边看看，很快回来。",
    cardBackground: "assets/backgrounds/camper-card/forestWanderer.png",
    idleWeights: { wandering: 6, lookingAtLake: 3, resting: 2, observingGear: 1, sittingByFire: 1 },
    bubbles: {
      wandering: ["那边好像有条小路", "我去看一眼树影", "木牌后面会是什么"],
      lookingAtLake: ["远处山影很好看", "湖边也算路线的一部分"],
      resting: ["散步回来，草地刚好"],
      observingGear: ["这个像路标吗"]
    }
  },
  campfireChatter: {
    title: "篝火话很多型",
    description: "火一亮，话匣子也跟着亮起来。喜欢有人一起坐着，把普通夜晚聊成暖乎乎的小故事。",
    catchphrase: "火都点起来了，聊两句吧。",
    cardBackground: "assets/backgrounds/camper-card/campfireChatter.png",
    idleWeights: { sittingByFire: 6, sittingOnFurniture: 3, wandering: 1, observingGear: 1, resting: 1 },
    nightWeights: { sittingByFire: 4, sittingOnFurniture: 2 },
    bubbles: {
      sittingByFire: ["火都在听呢", "再讲一个小故事吧", "有人一起坐就更暖"],
      sittingOnFurniture: ["这个座位适合聊天", "先坐近一点"],
      wandering: ["我去喊大家过来"],
      observingGear: ["这盏灯很有聊天氛围"]
    }
  },
  picnicFirst: {
    title: "野餐第一型",
    description: "相信很多事情都可以先从一杯热饮开始。桌上有小零食，日子就会自动慢下来一点。",
    catchphrase: "先喝点什么再说。",
    cardBackground: "assets/backgrounds/camper-card/picnicFirst.png",
    idleWeights: { sittingOnFurniture: 4, observingGear: 3, sittingByFire: 2, resting: 2, wandering: 1 },
    bubbles: {
      sittingOnFurniture: ["杯子放这里刚好", "先吃一点再决定", "这张桌子很懂野餐"],
      observingGear: ["炉子也要有好位置", "小零食库存确认"],
      sittingByFire: ["热饮靠近火会更认真"],
      resting: ["吃完以后慢慢坐着"]
    }
  }
};

const CAMPER_PROFILE_QUESTIONS = [
  {
    text: "空出来的晚上突然很长，你通常会怎么浪费？",
    options: [
      { text: "开一盏小灯，假装自己在经营深夜小店", traits: { lampKeeper: 2, vanishSoftly: 1 } },
      { text: "坐着不动，等脑袋自己变安静", traits: { sitFirst: 2, slowMood: 1 } },
      { text: "把桌面上所有东西重新排一遍", traits: { carefulArranger: 2, prettyFrame: 1 } },
      { text: "翻出一个很久没用的小东西，并觉得它马上会派上用场", traits: { gearHoarder: 2 } }
    ]
  },
  {
    text: "朋友迟到二十分钟，你比较像哪一种？",
    options: [
      { text: "找个地方坐下，顺便把这二十分钟过得很完整", traits: { sitFirst: 2, slowMood: 1 } },
      { text: "沿着附近慢慢走一圈，像在检查地图边缘", traits: { forestWanderer: 2, slowMood: 1, prettyFrame: 1 } },
      { text: "去便利店买一个本来不需要的小玩意", traits: { gearHoarder: 2, lampKeeper: 1 } },
      { text: "回一句没事，然后短暂消失在自己的世界里", traits: { vanishSoftly: 2 } }
    ]
  },
  {
    text: "房间里最容易自己变多的东西是？",
    options: [
      { text: "收纳盒、袋子、备用袋子、备用备用袋子", traits: { gearHoarder: 2, carefulArranger: 1 } },
      { text: "小灯、香薰、杯垫这种不太必要但很安心的东西", traits: { lampKeeper: 2, prettyFrame: 1 } },
      { text: "椅子上临时放一下的衣服", traits: { sitFirst: 1, vanishSoftly: 2 } },
      { text: "空白本子和没有写完的清单", traits: { carefulArranger: 2, slowMood: 1 } }
    ]
  },
  {
    text: "你今天最像哪种天气？",
    options: [
      { text: "阴天，但云很柔软", traits: { slowMood: 2, vanishSoftly: 1 } },
      { text: "傍晚的小晴天，适合拍照", traits: { prettyFrame: 2, lampKeeper: 1 } },
      { text: "小雨，正好适合躲起来", traits: { vanishSoftly: 2 } },
      { text: "晴一阵忙一阵，还想整理阳台", traits: { carefulArranger: 2, gearHoarder: 1 } }
    ]
  },
  {
    text: "看到一个空角落，你第一反应是？",
    options: [
      { text: "这里可以放一张椅子", traits: { sitFirst: 2 } },
      { text: "这里需要一点点光", traits: { lampKeeper: 2 } },
      { text: "这里适合放一个不解释用途的箱子", traits: { gearHoarder: 2 } },
      { text: "先别放，空着也有构图", traits: { prettyFrame: 2, slowMood: 1 } }
    ]
  },
  {
    text: "朋友说“随便弄点吃的”，你会？",
    options: [
      { text: "认真把随便变成三种选择", traits: { carefulArranger: 2 } },
      { text: "先问能不能坐着等", traits: { sitFirst: 2 } },
      { text: "拿出一个刚好能用上的小工具", traits: { gearHoarder: 2 } },
      { text: "说好，然后做出一份很有氛围的简单东西", traits: { picnicFirst: 2, lampKeeper: 1, prettyFrame: 1 } }
    ]
  },
  {
    text: "哪句话最像你？",
    options: [
      { text: "等一下，我把这个角度摆好。", traits: { carefulArranger: 2, prettyFrame: 1 } },
      { text: "我先坐下，坐下以后什么都能谈。", traits: { sitFirst: 2 } },
      { text: "我有一个东西，虽然现在用不上。", traits: { gearHoarder: 2 } },
      { text: "我在听，只是看起来像没开机。", traits: { vanishSoftly: 2, slowMood: 1 } }
    ]
  },
  {
    text: "一张很普通的桌子，你会先注意什么？",
    options: [
      { text: "有没有刚好放杯子的地方", traits: { picnicFirst: 2, sitFirst: 1, carefulArranger: 1 } },
      { text: "桌面会不会反光，很适合拍东西", traits: { prettyFrame: 2 } },
      { text: "下面还能不能塞个篮子", traits: { gearHoarder: 2 } },
      { text: "旁边如果有小灯就好了", traits: { lampKeeper: 2 } }
    ]
  },
  {
    text: "突然有一小时没人找你，你会把它放在哪里？",
    options: [
      { text: "放在窗边，慢慢发呆", traits: { slowMood: 2, vanishSoftly: 1 } },
      { text: "放进被窝或帐篷这种地方", traits: { vanishSoftly: 2 } },
      { text: "放在要整理的小角落", traits: { carefulArranger: 2 } },
      { text: "放在一个新买但没拆的小东西旁边", traits: { gearHoarder: 2 } }
    ]
  },
  {
    text: "你的包里最可能多带什么？",
    options: [
      { text: "一盏小灯或备用电池", traits: { lampKeeper: 2 } },
      { text: "不一定用得上但很有安全感的工具", traits: { gearHoarder: 2 } },
      { text: "小本子，写两行又合上", traits: { slowMood: 1, carefulArranger: 1 } },
      { text: "一块布，因为也许能当背景", traits: { prettyFrame: 2 } }
    ]
  },
  {
    text: "别人来你房间前十分钟，你会？",
    options: [
      { text: "只整理他们看得到的那一面", traits: { prettyFrame: 2 } },
      { text: "突然进入认真摆放模式", traits: { carefulArranger: 2 } },
      { text: "把东西收到一个神秘袋子里", traits: { gearHoarder: 1, vanishSoftly: 1 } },
      { text: "先坐下来冷静，房间会理解我的", traits: { sitFirst: 2, slowMood: 1 } }
    ]
  },
  {
    text: "如果要给今天加一个背景音，你选？",
    options: [
      { text: "很远的水声", traits: { slowMood: 2 } },
      { text: "小灯泡轻轻亮起来的声音", traits: { lampKeeper: 2 } },
      { text: "拉链打开、盒子扣上的声音", traits: { gearHoarder: 2 } },
      { text: "椅子被拖到刚好位置的声音", traits: { sitFirst: 1, carefulArranger: 1 } }
    ]
  },
  {
    text: "走进一家很小的杂货店，你会先？",
    options: [
      { text: "看最角落那排奇怪但实用的东西", traits: { gearHoarder: 2 } },
      { text: "看灯和杯子摆得好不好", traits: { lampKeeper: 1, prettyFrame: 1 } },
      { text: "找店里有没有能坐一下的位置", traits: { sitFirst: 2 } },
      { text: "慢慢逛，不急着买", traits: { forestWanderer: 2, slowMood: 1 } }
    ]
  },
  {
    text: "大家都在聊天，你忽然安静下来是因为？",
    options: [
      { text: "在看窗外一块很好看的光", traits: { prettyFrame: 2, slowMood: 1 } },
      { text: "电量下降，需要藏一小会儿", traits: { vanishSoftly: 2 } },
      { text: "想到一个东西应该换个位置", traits: { carefulArranger: 2 } },
      { text: "椅子太舒服，语言系统暂停", traits: { sitFirst: 2 } }
    ]
  },
  {
    text: "如果周末只能完成一件小事，你选？",
    options: [
      { text: "把某个角落布置得像样一点", traits: { carefulArranger: 2, prettyFrame: 1 } },
      { text: "补齐一个缺了很久的小装备", traits: { gearHoarder: 2 } },
      { text: "找到一个新的固定休息点", traits: { sitFirst: 2 } },
      { text: "什么也不完成，但认真休息", traits: { vanishSoftly: 2, slowMood: 1 } }
    ]
  },
  {
    text: "你最能接受哪种混乱？",
    options: [
      { text: "看起来乱，但每样东西都有故事", traits: { gearHoarder: 2 } },
      { text: "桌面乱，但灯光必须温柔", traits: { lampKeeper: 2 } },
      { text: "过程乱，最后画面好看就行", traits: { prettyFrame: 2 } },
      { text: "外面乱，我躲一下就好了", traits: { vanishSoftly: 2 } }
    ]
  },
  {
    text: "有人问你想去哪儿，你脑中先出现的是？",
    options: [
      { text: "能看到水的地方", traits: { slowMood: 2 } },
      { text: "有舒服座位的地方", traits: { sitFirst: 2 } },
      { text: "有小灯和木头味道的地方", traits: { lampKeeper: 1, campfireChatter: 2 } },
      { text: "可以拍到自然光的地方", traits: { prettyFrame: 2 } }
    ]
  },
  {
    text: "你对“以后可能会用到”的态度是？",
    options: [
      { text: "这是宇宙给我的合理借口", traits: { gearHoarder: 2 } },
      { text: "可以，但要放在对的位置", traits: { carefulArranger: 2 } },
      { text: "如果能让我更安心，就留下", traits: { lampKeeper: 1, vanishSoftly: 1 } },
      { text: "先拍一张，之后再决定", traits: { prettyFrame: 2 } }
    ]
  },
  {
    text: "营地旁边突然多出一条没见过的小路，你会？",
    options: [
      { text: "先走五分钟，看树影把我带到哪儿", traits: { forestWanderer: 2, slowMood: 1 } },
      { text: "喊大家一起去，回来围着火讲发现", traits: { campfireChatter: 2, forestWanderer: 1 } },
      { text: "带上杯子和小点心，走累了就坐下", traits: { picnicFirst: 2, sitFirst: 1 } },
      { text: "先记一下路牌，免得快乐地找不到回来的方向", traits: { carefulArranger: 2, forestWanderer: 1 } }
    ]
  },
  {
    text: "篝火刚烧旺，旁边还空着几把椅子，你最想？",
    options: [
      { text: "把大家叫过来，故事从第一根火星开始", traits: { campfireChatter: 2, lampKeeper: 1 } },
      { text: "坐近一点，安静看它慢慢亮", traits: { lampKeeper: 2, slowMood: 1 } },
      { text: "确认每把椅子的位置都刚好不挡路", traits: { carefulArranger: 2, sitFirst: 1 } },
      { text: "趁热把杯子捧起来，像在给夜晚加糖", traits: { picnicFirst: 2, campfireChatter: 1 } }
    ]
  },
  {
    text: "夜色刚落下来，大家还没决定要不要散场，你会？",
    options: [
      { text: "往火边挪挪，说一个刚想到的小故事", traits: { campfireChatter: 2 } },
      { text: "把灯调亮一点，让回去的路看起来安心", traits: { lampKeeper: 2 } },
      { text: "拿热饮和小点心，把散场拖慢一点点", traits: { picnicFirst: 2, campfireChatter: 1 } },
      { text: "说我去看看树后面那条暗暗的小路", traits: { forestWanderer: 2, vanishSoftly: 1 } }
    ]
  },
  {
    text: "清晨阳光落在野餐桌上，你第一件事是？",
    options: [
      { text: "找杯子、热饮和一口不会掉屑的小点心", traits: { picnicFirst: 2 } },
      { text: "看影子从哪边过来，顺便发现一条能散步的路", traits: { forestWanderer: 2, prettyFrame: 1 } },
      { text: "把桌面整理到看起来很会生活", traits: { carefulArranger: 2, prettyFrame: 1 } },
      { text: "先坐下，让早晨自己慢慢开始", traits: { sitFirst: 2, slowMood: 1 } }
    ]
  },
  {
    text: "如果今天只负责让营地多一点人味，你会加什么？",
    options: [
      { text: "一圈能把大家聚到一起的椅子", traits: { campfireChatter: 2, sitFirst: 1 } },
      { text: "一块指向森林深处的小木牌", traits: { forestWanderer: 2 } },
      { text: "一张永远有热饮位置的小桌子", traits: { picnicFirst: 2, lampKeeper: 1 } },
      { text: "一个不解释但很有用的收纳篮", traits: { gearHoarder: 2, carefulArranger: 1 } }
    ]
  }
];
