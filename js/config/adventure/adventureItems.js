// Shared adventure constants and item storage rules.

const ADVENTURE_PROTOTYPE_TRAIT_RANGE = { min: 0, max: 100 };
const ADVENTURE_PROTOTYPE_OUTCOME_ORDER = ["rareBad", "bad", "mixed", "good", "rareGood"];
const ADVENTURE_SAVE_VERSION = 9;
const ADVENTURE_STARTER_KIT_MIGRATION_VERSION = 1;
const ADVENTURE_MAX_EVENTS_PER_TRIP = 5;
const ADVENTURE_BACKPACK_CAPACITY = 5;
const ADVENTURE_STAMINA_MAX = 100;
const ADVENTURE_STAMINA_TRIP_COST = 25;
const ADVENTURE_STAMINA_REGEN_MS_PER_POINT = 14.4 * 60 * 1000;
const ADVENTURE_DEFAULT_STORAGE = {
  ropeKit: 1,
  fieldLantern: 1,
  firstAidPouch: 1,
  trailRation: 2
};

const ADVENTURE_ITEM_CATALOG = {
  ropeKit: { id: "ropeKit", name: "攀登绳组", category: "tool", iconClass: "item-rope", detail: "结实耐磨，适合应付需要固定或攀爬的地方。", tradeable: true },
  fieldLantern: { id: "fieldLantern", name: "山行提灯", category: "tool", iconClass: "item-lantern", detail: "光线稳定，在昏暗环境里让人安心。", tradeable: true },
  firstAidPouch: { id: "firstAidPouch", name: "急救包", category: "consumable", iconClass: "item-first-aid", detail: "装着处理轻伤需要的基础用品。", tradeable: true },
  oldKey: { id: "oldKey", name: "山纹旧钥匙", category: "quest", iconClass: "item-key", detail: "齿纹很特别，似乎对应着某种老式锁具。", tradeable: true },
  sealedLetter: { id: "sealedLetter", name: "封蜡信件", category: "quest", iconClass: "item-letter", detail: "封口完整，收件地点已经有些模糊。", tradeable: true },
  repairToolkit: { id: "repairToolkit", name: "旧工具套组", category: "tool", iconClass: "item-toolkit", detail: "工具并不齐全，但处理简单修缮应该够用。", tradeable: true },
  mountainHerb: { id: "mountainHerb", name: "山地草药", category: "consumable", iconClass: "item-herb", detail: "带着清苦气味，看起来仍然很新鲜。", tradeable: true },
  trailMap: { id: "trailMap", name: "手绘山路图", category: "quest", iconClass: "item-map", detail: "画着几条没有出现在普通地图上的小路。", tradeable: true },
  silverCompass: { id: "silverCompass", name: "银色指南针", category: "tool", iconClass: "item-compass", detail: "指针仍然灵敏，只是偶尔会轻微摇晃。", tradeable: true },
  forestCharm: { id: "forestCharm", name: "林间护符", category: "quest", iconClass: "item-charm", detail: "靠近树林时，表面的纹路似乎会变得清晰。", tradeable: true },
  rangerToken: { id: "rangerToken", name: "护林员木章", category: "quest", iconClass: "item-token", detail: "刻着旧护林站的标记，像是某种身份证明。", tradeable: true },
  trailRation: { id: "trailRation", name: "干粮包", category: "food", iconClass: "item-ration", detail: "容易保存，适合在体力不足时补充一点能量。", tradeable: true },
  vineCutter: { id: "vineCutter", name: "藤切刀", category: "tool", image: "assets/adventure/fog-rainforest/rainforest-items.png", imagePosition: "0% 0%", imageSize: "300% 200%", detail: "带弯钩的短刃，适合处理缠紧的藤蔓，不适合粗暴砍伐。", tradeable: true },
  insectRepellent: { id: "insectRepellent", name: "驱虫叶露", category: "consumable", image: "assets/adventure/fog-rainforest/rainforest-items.png", imagePosition: "50% 0%", imageSize: "300% 200%", detail: "带着清凉叶香，能让雨林虫群暂时保持距离。", tradeable: true },
  luminousSpore: { id: "luminousSpore", name: "微光孢子", category: "material", image: "assets/adventure/fog-rainforest/rainforest-items.png", imagePosition: "100% 0%", imageSize: "300% 200%", detail: "密封瓶里漂着微弱蓝光，离开雨林后仍没有熄灭。", tradeable: true },
  pressedFernSpecimen: { id: "pressedFernSpecimen", name: "压叶标本", category: "collectible", image: "assets/adventure/fog-rainforest/rainforest-items.png", imagePosition: "0% 100%", imageSize: "300% 200%", detail: "保存在防潮框里的完整蕨叶，适合留在营地收藏。", tradeable: false },
  stationPass: { id: "stationPass", name: "调查站通行牌", category: "quest", image: "assets/adventure/fog-rainforest/rainforest-items.png", imagePosition: "50% 100%", imageSize: "300% 200%", detail: "叶片图案已经磨旧，仍能对应调查站的机械门扣。", tradeable: true },
  rainCape: { id: "rainCape", name: "苔纹雨披", category: "tool", image: "assets/adventure/fog-rainforest/rainforest-items.png", imagePosition: "100% 100%", imageSize: "300% 200%", detail: "轻薄防水，也能临时包住怕潮的背包和样本。", tradeable: true }
};

const ADVENTURE_ITEM_RULES = {
  ropeKit: { maxOwned: Infinity, carryable: true, repeatable: true },
  fieldLantern: { maxOwned: 1, carryable: true, repeatable: false },
  firstAidPouch: { maxOwned: Infinity, carryable: true, repeatable: true },
  oldKey: { maxOwned: 3, carryable: true, repeatable: true },
  sealedLetter: { maxOwned: 1, carryable: false, repeatable: false, keyItemId: "sealedLetter", unlockLocationId: "watchtowerRoute" },
  repairToolkit: { maxOwned: 1, carryable: true, repeatable: false },
  mountainHerb: { maxOwned: Infinity, carryable: true, repeatable: true },
  trailMap: { maxOwned: 1, carryable: true, repeatable: false },
  silverCompass: { maxOwned: 1, carryable: true, repeatable: false },
  forestCharm: { maxOwned: 1, carryable: true, repeatable: false },
  rangerToken: { maxOwned: 1, carryable: true, repeatable: false },
  trailRation: { maxOwned: Infinity, carryable: true, repeatable: true },
  vineCutter: { maxOwned: 1, carryable: true, repeatable: false },
  insectRepellent: { maxOwned: Infinity, carryable: true, repeatable: true },
  luminousSpore: { maxOwned: Infinity, carryable: true, repeatable: true },
  pressedFernSpecimen: { maxOwned: 1, carryable: false, repeatable: false },
  stationPass: { maxOwned: 1, carryable: true, repeatable: false },
  rainCape: { maxOwned: 1, carryable: true, repeatable: false }
};

const ADVENTURE_DUPLICATE_REWARD_POOL = [
  { type: "item", itemId: "firstAidPouch", label: "在旁边发现了未拆封的急救包" },
  { type: "item", itemId: "trailRation", label: "在旧布包里找到一份干粮" },
  { type: "item", itemId: "mountainHerb", label: "附近长着一株新鲜山地草药" },
  { type: "item", itemId: "ropeKit", label: "从废弃装备中整理出一组可用绳索" },
  { type: "stamina", amount: 3, label: "确认旧物已经收录后，你在原地稍作休整" },
  { type: "text", label: "旧物背面留着一行模糊的山路笔记" }
];

const ADVENTURE_KEY_CLUE_CATALOG = {
  rangerLeafRouteMark: {
    id: "rangerLeafRouteMark",
    label: "护林员记录中的叶片标记",
    routeMapFragment: true
  },
  southSupplyCode: {
    id: "southSupplyCode",
    label: "密封信上的南行补给编号",
    routeMapFragment: true
  },
  oldForestryCoordinate: {
    id: "oldForestryCoordinate",
    label: "瞭望塔记录中的旧林务坐标",
    routeMapFragment: true
  },
  dampSurveyRouteMap: {
    id: "dampSurveyRouteMap",
    label: "受潮的调查路线图",
    important: true
  }
};

const ADVENTURE_ROUTE_MAP_FRAGMENT_IDS = ["rangerLeafRouteMark", "southSupplyCode", "oldForestryCoordinate"];
const ADVENTURE_ROUTE_MAP_KEY_CLUE_ID = "dampSurveyRouteMap";
