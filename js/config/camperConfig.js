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

const CAMPER_TRAIT_KEYS = [
  "courage",
  "curiosity",
  "sociability",
  "preparedness",
  "observation",
  "rationality",
  "responsibility",
  "comfortSeeking"
];
const CAMPER_TRAIT_RANGE = { min: 0, max: 100 };
const CAMPER_DEFAULT_TRAITS = {
  slowMood: { courage: 45, curiosity: 58, sociability: 45, preparedness: 42, observation: 72, rationality: 56, responsibility: 50, comfortSeeking: 78 },
  lampKeeper: { courage: 55, curiosity: 48, sociability: 58, preparedness: 68, observation: 70, rationality: 62, responsibility: 82, comfortSeeking: 62 },
  sitFirst: { courage: 42, curiosity: 38, sociability: 55, preparedness: 50, observation: 52, rationality: 58, responsibility: 54, comfortSeeking: 80 },
  gearHoarder: { courage: 55, curiosity: 64, sociability: 48, preparedness: 80, observation: 60, rationality: 58, responsibility: 68, comfortSeeking: 60 },
  carefulArranger: { courage: 52, curiosity: 50, sociability: 50, preparedness: 82, observation: 78, rationality: 86, responsibility: 80, comfortSeeking: 48 },
  vanishSoftly: { courage: 38, curiosity: 52, sociability: 28, preparedness: 48, observation: 70, rationality: 60, responsibility: 46, comfortSeeking: 82 },
  prettyFrame: { courage: 58, curiosity: 72, sociability: 62, preparedness: 46, observation: 80, rationality: 48, responsibility: 52, comfortSeeking: 64 },
  forestWanderer: { courage: 82, curiosity: 82, sociability: 45, preparedness: 48, observation: 78, rationality: 44, responsibility: 50, comfortSeeking: 34 },
  campfireChatter: { courage: 68, curiosity: 62, sociability: 84, preparedness: 45, observation: 52, rationality: 45, responsibility: 58, comfortSeeking: 64 },
  picnicFirst: { courage: 50, curiosity: 58, sociability: 72, preparedness: 68, observation: 62, rationality: 52, responsibility: 64, comfortSeeking: 80 }
};

const CAMPER_PROFILE_QUESTION_CATEGORIES = [
  {
    id: "unknownRisk",
    label: "面对未知与风险",
    questions: [
      {
        text: "营地旁突然出现一条地图上没有的小路，你会？",
        options: [
          { text: "先停一会儿，听风和脚步声再决定", personalityScores: { slowMood: 3, lampKeeper: 1 }, traitModifiers: { observation: 3, courage: -1 } },
          { text: "看地图、天气和回程时间，划出安全范围", personalityScores: { carefulArranger: 3, sitFirst: 1 }, traitModifiers: { rationality: 3, preparedness: 2 } },
          { text: "先站远一点看光线和地形，记住最好看的方向", personalityScores: { prettyFrame: 3, vanishSoftly: 1 }, traitModifiers: { observation: 4, curiosity: 1 } },
          { text: "走进去看看，回来再把发现讲给大家", personalityScores: { forestWanderer: 3, campfireChatter: 1 }, traitModifiers: { courage: 4, curiosity: 3 } }
        ]
      },
      {
        text: "半夜帐篷外传来没听过的窸窣声，你第一反应是？",
        options: [
          { text: "先不惊动它，安静听一会儿声音会不会离开", personalityScores: { slowMood: 3, lampKeeper: 1 }, traitModifiers: { observation: 3, rationality: 1 } },
          { text: "确认灯、出口和同伴位置，再判断是什么", personalityScores: { carefulArranger: 3, sitFirst: 1 }, traitModifiers: { preparedness: 3, responsibility: 2 } },
          { text: "掀开一条缝，看月光里到底晃过了什么", personalityScores: { prettyFrame: 3, vanishSoftly: 1 }, traitModifiers: { observation: 4, courage: 1 } },
          { text: "拿好手电出去看一眼，顺便找找脚印", personalityScores: { forestWanderer: 3, campfireChatter: 1 }, traitModifiers: { courage: 4, curiosity: 3 } }
        ]
      },
      {
        text: "原定路线突然封闭，手机也没有信号，你会？",
        options: [
          { text: "接受今天慢一点，先等环境给出更多线索", personalityScores: { slowMood: 3, lampKeeper: 1 }, traitModifiers: { rationality: 2, comfortSeeking: 2 } },
          { text: "清点水和时间，按最稳妥的备选路线行动", personalityScores: { carefulArranger: 3, sitFirst: 1 }, traitModifiers: { preparedness: 4, responsibility: 3 } },
          { text: "留在安全处观察地貌，找一个清楚的参照点", personalityScores: { prettyFrame: 3, vanishSoftly: 1 }, traitModifiers: { observation: 4, rationality: 2 } },
          { text: "沿着明显地标探一小段，边走边留下回程记号", personalityScores: { forestWanderer: 3, campfireChatter: 1 }, traitModifiers: { courage: 3, curiosity: 3 } }
        ]
      }
    ]
  },
  {
    id: "socialTeam",
    label: "社交与团队反应",
    questions: [
      {
        text: "一群人走岔了路，气氛开始有点紧张，你会？",
        options: [
          { text: "先确认每个人都在，用灯和几句话让大家安心", personalityScores: { lampKeeper: 3, campfireChatter: 1 }, traitModifiers: { responsibility: 4, sociability: 2 } },
          { text: "提议坐下来喝口水，再一起想下一步", personalityScores: { sitFirst: 3, picnicFirst: 1 }, traitModifiers: { rationality: 2, comfortSeeking: 3 } },
          { text: "安静接下清点装备的任务，让争论先停一停", personalityScores: { vanishSoftly: 3, gearHoarder: 1 }, traitModifiers: { sociability: -2, responsibility: 3 } },
          { text: "让大家轮流说线索，把混乱聊成一个方案", personalityScores: { campfireChatter: 3, carefulArranger: 1 }, traitModifiers: { sociability: 4, rationality: 2 } }
        ]
      },
      {
        text: "有个不太熟的人第一次坐到篝火边，你会？",
        options: [
          { text: "把灯和毯子往那边挪一点，让对方不用开口求助", personalityScores: { lampKeeper: 3, campfireChatter: 1 }, traitModifiers: { responsibility: 3, observation: 2 } },
          { text: "拍拍旁边的座位，先让大家都坐舒服", personalityScores: { sitFirst: 3, picnicFirst: 1 }, traitModifiers: { sociability: 2, comfortSeeking: 4 } },
          { text: "友好地点点头，给对方留出不说话也自在的空间", personalityScores: { vanishSoftly: 3, gearHoarder: 1 }, traitModifiers: { observation: 2, sociability: -1 } },
          { text: "从一个轻松的小故事开始，把人自然地拉进话题", personalityScores: { campfireChatter: 3, carefulArranger: 1 }, traitModifiers: { sociability: 4, courage: 2 } }
        ]
      },
      {
        text: "队友对下一步安排意见完全不同，你通常会？",
        options: [
          { text: "先照顾最不安的人，再帮大家找共同点", personalityScores: { lampKeeper: 3, campfireChatter: 1 }, traitModifiers: { responsibility: 4, observation: 2 } },
          { text: "建议暂停五分钟，坐稳以后再作决定", personalityScores: { sitFirst: 3, picnicFirst: 1 }, traitModifiers: { rationality: 2, comfortSeeking: 3 } },
          { text: "暂时退出争论，独自把可行选项整理出来", personalityScores: { vanishSoftly: 3, gearHoarder: 1 }, traitModifiers: { sociability: -2, rationality: 3 } },
          { text: "主持一轮短讨论，让每个人都说清最在意的事", personalityScores: { campfireChatter: 3, carefulArranger: 1 }, traitModifiers: { sociability: 4, responsibility: 2 } }
        ]
      }
    ]
  },
  {
    id: "suppliesOrder",
    label: "物资、计划与秩序",
    questions: [
      {
        text: "出发前收拾公共物资，你最自然会做什么？",
        options: [
          { text: "多装几件备用工具，也给大家塞点零食", personalityScores: { gearHoarder: 3, picnicFirst: 1 }, traitModifiers: { preparedness: 4, comfortSeeking: 2 } },
          { text: "列清单、分袋，再特意留一点机动空间", personalityScores: { carefulArranger: 3, slowMood: 1 }, traitModifiers: { preparedness: 3, rationality: 4 } },
          { text: "边收边确认谁拿什么，保证所有人都听明白", personalityScores: { campfireChatter: 3, sitFirst: 1 }, traitModifiers: { sociability: 3, responsibility: 3 } },
          { text: "先定热饮和吃饭计划，其他东西围着它来装", personalityScores: { picnicFirst: 3, vanishSoftly: 1 }, traitModifiers: { comfortSeeking: 4, preparedness: 2 } }
        ]
      },
      {
        text: "今晚只剩不多的干柴，大家还想做很多事，你会？",
        options: [
          { text: "拿出之前留的备用燃料，顺便翻翻还有什么能用", personalityScores: { gearHoarder: 3, picnicFirst: 1 }, traitModifiers: { preparedness: 4, curiosity: 1 } },
          { text: "算好每项消耗，排出最稳妥的使用顺序", personalityScores: { carefulArranger: 3, slowMood: 1 }, traitModifiers: { rationality: 4, responsibility: 3 } },
          { text: "把大家叫到一起，很快谈妥轮班和优先级", personalityScores: { campfireChatter: 3, sitFirst: 1 }, traitModifiers: { sociability: 4, responsibility: 2 } },
          { text: "先保证一顿热乎的，剩下的火慢慢用", personalityScores: { picnicFirst: 3, vanishSoftly: 1 }, traitModifiers: { comfortSeeking: 4, responsibility: 1 } }
        ]
      },
      {
        text: "准备离开营地时，哪一步最像你？",
        options: [
          { text: "逐件摸一遍装备，连可能被忘掉的小工具也带走", personalityScores: { gearHoarder: 3, picnicFirst: 1 }, traitModifiers: { preparedness: 4, observation: 2 } },
          { text: "按区域检查并勾清单，最后再走一遍动线", personalityScores: { carefulArranger: 3, slowMood: 1 }, traitModifiers: { rationality: 4, responsibility: 4 } },
          { text: "大声报项目，让每个人回应自己负责的部分", personalityScores: { campfireChatter: 3, sitFirst: 1 }, traitModifiers: { sociability: 3, responsibility: 3 } },
          { text: "收好保温杯和路上吃的，确保回程不会饿", personalityScores: { picnicFirst: 3, vanishSoftly: 1 }, traitModifiers: { comfortSeeking: 4, preparedness: 3 } }
        ]
      }
    ]
  },
  {
    id: "restComfort",
    label: "休息、情绪与舒适",
    questions: [
      {
        text: "忙了一整天终于停下来，你最想怎么恢复？",
        options: [
          { text: "慢慢看天色变化，让脑袋自己降速", personalityScores: { slowMood: 3, prettyFrame: 1 }, traitModifiers: { observation: 3, comfortSeeking: 3 } },
          { text: "先找到最稳最舒服的位置，好好坐一会儿", personalityScores: { sitFirst: 3, lampKeeper: 1 }, traitModifiers: { comfortSeeking: 4, rationality: 1 } },
          { text: "悄悄离开人群，在安静里充一小会儿电", personalityScores: { vanishSoftly: 3, forestWanderer: 1 }, traitModifiers: { sociability: -3, observation: 2 } },
          { text: "拿出热饮和小点心，把休息变成一顿迷你野餐", personalityScores: { picnicFirst: 3, gearHoarder: 1 }, traitModifiers: { comfortSeeking: 4, preparedness: 1 } }
        ]
      },
      {
        text: "原本的休闲时间突然下起雨，你会？",
        options: [
          { text: "听着雨声发呆，顺便看水珠怎么挂在叶子上", personalityScores: { slowMood: 3, prettyFrame: 1 }, traitModifiers: { observation: 4, comfortSeeking: 2 } },
          { text: "把椅子移到最干燥的角落，安稳坐好", personalityScores: { sitFirst: 3, lampKeeper: 1 }, traitModifiers: { preparedness: 2, comfortSeeking: 4 } },
          { text: "躲到雨声最轻的地方，暂时谁也不用招呼", personalityScores: { vanishSoftly: 3, forestWanderer: 1 }, traitModifiers: { sociability: -3, comfortSeeking: 3 } },
          { text: "架起小锅热东西吃，让雨天有自己的菜单", personalityScores: { picnicFirst: 3, gearHoarder: 1 }, traitModifiers: { comfortSeeking: 4, preparedness: 2 } }
        ]
      },
      {
        text: "情绪有点低的时候，哪种照顾方式最适合你？",
        options: [
          { text: "不催自己，慢慢注意身边一两件好看的小事", personalityScores: { slowMood: 3, prettyFrame: 1 }, traitModifiers: { observation: 3, rationality: 1 } },
          { text: "找个可靠的位置坐下，先让身体觉得安全", personalityScores: { sitFirst: 3, lampKeeper: 1 }, traitModifiers: { comfortSeeking: 4, responsibility: 1 } },
          { text: "一个人安静待着，想走走就沿着树边走一段", personalityScores: { vanishSoftly: 3, forestWanderer: 1 }, traitModifiers: { sociability: -3, curiosity: 1 } },
          { text: "准备熟悉的饮料和食物，用小仪式把心情接住", personalityScores: { picnicFirst: 3, gearHoarder: 1 }, traitModifiers: { comfortSeeking: 4, preparedness: 2 } }
        ]
      }
    ]
  },
  {
    id: "environmentExploration",
    label: "环境、审美与探索",
    questions: [
      {
        text: "第一次走进一片新的林间空地，你最先注意什么？",
        options: [
          { text: "哪里天黑后需要一盏温柔又不刺眼的灯", personalityScores: { lampKeeper: 3, slowMood: 1 }, traitModifiers: { observation: 3, responsibility: 2 } },
          { text: "地面是否平整，哪些装备能在这里派上用场", personalityScores: { gearHoarder: 3, carefulArranger: 1 }, traitModifiers: { preparedness: 3, rationality: 2 } },
          { text: "光从哪边落下，站在哪里能看到最完整的画面", personalityScores: { prettyFrame: 3, forestWanderer: 1 }, traitModifiers: { observation: 4, curiosity: 2 } },
          { text: "空地后面通向哪里，最近的小路是哪一条", personalityScores: { forestWanderer: 3, prettyFrame: 1 }, traitModifiers: { curiosity: 4, courage: 3 } }
        ]
      },
      {
        text: "湖面在傍晚变了颜色，你会怎么靠近它？",
        options: [
          { text: "看倒影一点点亮起来，等到该开灯的时候", personalityScores: { lampKeeper: 3, slowMood: 1 }, traitModifiers: { observation: 4, responsibility: 1 } },
          { text: "顺便看看岸边有没有适合扎营或放装备的位置", personalityScores: { gearHoarder: 3, carefulArranger: 1 }, traitModifiers: { preparedness: 3, observation: 2 } },
          { text: "找出颜色最好看的那一格，安静记住它", personalityScores: { prettyFrame: 3, forestWanderer: 1 }, traitModifiers: { observation: 4, curiosity: 1 } },
          { text: "沿着岸线继续走，看看颜色会在何处消失", personalityScores: { forestWanderer: 3, prettyFrame: 1 }, traitModifiers: { curiosity: 4, courage: 2 } }
        ]
      },
      {
        text: "只能给今天加一个短短的营地支线，你选？",
        options: [
          { text: "黄昏去找萤火虫，回来前确认每个人都有光", personalityScores: { lampKeeper: 3, slowMood: 1 }, traitModifiers: { responsibility: 3, observation: 3 } },
          { text: "研究一种新装备，看看它在不同地形怎么摆", personalityScores: { gearHoarder: 3, carefulArranger: 1 }, traitModifiers: { preparedness: 3, curiosity: 3 } },
          { text: "爬到日出视野最好的地方，等一张完美画面", personalityScores: { prettyFrame: 3, forestWanderer: 1 }, traitModifiers: { observation: 4, courage: 2 } },
          { text: "跟着一条没有路牌的小径走到下一个转弯", personalityScores: { forestWanderer: 3, prettyFrame: 1 }, traitModifiers: { courage: 4, curiosity: 4 } }
        ]
      }
    ]
  }
];
