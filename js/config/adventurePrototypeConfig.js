// Runtime-only data for the single-player deep-mountain adventure prototype.

const ADVENTURE_PROTOTYPE_TRAIT_RANGE = { min: 0, max: 100 };
const ADVENTURE_PROTOTYPE_OUTCOME_ORDER = ["rareBad", "bad", "mixed", "good", "rareGood"];
const ADVENTURE_SAVE_VERSION = 4;
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
  trailRation: { id: "trailRation", name: "干粮包", category: "food", iconClass: "item-ration", detail: "容易保存，适合在体力不足时补充一点能量。", tradeable: true }
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
  trailRation: { maxOwned: Infinity, carryable: true, repeatable: true }
};

const ADVENTURE_DUPLICATE_REWARD_POOL = [
  { type: "item", itemId: "firstAidPouch", label: "在旁边发现了未拆封的急救包" },
  { type: "item", itemId: "trailRation", label: "在旧布包里找到一份干粮" },
  { type: "item", itemId: "mountainHerb", label: "附近长着一株新鲜山地草药" },
  { type: "item", itemId: "ropeKit", label: "从废弃装备中整理出一组可用绳索" },
  { type: "stamina", amount: 3, label: "确认旧物已经收录后，你在原地稍作休整" },
  { type: "text", label: "旧物背面留着一行模糊的山路笔记" }
];

const ADVENTURE_ITEM_SOLUTION_EFFECTS = {
  "forestFootsteps:holdCharm": {
    result: "护符的纹路突然发亮，脚步声随即远离，并在树间留下一条安静兽径。",
    log: "林间护符回应了异常脚步，你避开了藏在暗处的东西。",
    visualClass: "solution-charm",
    stamina: 2
  },
  "hiddenFork:readTrailMap": {
    result: "纸页上的细线与眼前山势重合，树枝后的小路完整显露出来。",
    log: "你对照手绘山路图确认了隐藏岔路。",
    visualClass: "solution-map",
    unlockLocationId: "ridgeTrail",
    stamina: 1
  },
  "lockedChest:useTools": {
    resultByRequirement: {
      oldKey: "旧钥匙正好吻合锁芯，箱盖伴着清脆声响完全打开。",
      repairToolkit: "你用工具强行撬开锈死的锁扣，箱盖打开了，但里面一部分脆弱物件已经受损。"
    },
    logByRequirement: {
      oldKey: "你用山纹旧钥匙完整打开了老式锁具，箱内物品没有受到损坏。",
      repairToolkit: "你用旧工具套组强行撬开锁扣，但部分脆弱内容在撬动中损坏了。"
    },
    visualClass: "solution-unlocked",
    requirementPriority: ["oldKey", "repairToolkit"],
    consumeRequirements: ["oldKey"],
    forcedTierByRequirement: { oldKey: "rareGood", repairToolkit: "good" },
    staminaByRequirement: { repairToolkit: -2 }
  },
  "suddenDownpour:buildCover": {
    result: "绳组迅速固定住防雨布，暴雨从两侧流过，背包和衣物都保持干燥。",
    log: "你用攀登绳组搭起遮蔽，避开了暴雨造成的损失。",
    visualClass: "solution-shelter",
    stamina: 2
  },
  "suddenDownpour:eatMeal": {
    result: "你在避雨处吃下温热料理，雨势减弱时已经重新恢复精神。",
    log: "你在避雨时吃了一份料理，充分恢复了体力。",
    visualClass: "solution-meal",
    consumeRequirements: ["category:meal"],
    stamina: 10
  },
  "unstableBridge:reinforceBridge": {
    resultByRequirement: {
      ropeKit: "新绳绕过松动桥柱，晃动的桥面很快稳定下来。",
      repairToolkit: "你重新固定了松脱的金属扣，桥面终于不再摇晃。"
    },
    logByRequirement: {
      ropeKit: "你用攀登绳组加固了吊桥，安全抵达另一侧。",
      repairToolkit: "你用旧工具套组修好桥扣，安全抵达另一侧。"
    },
    visualClass: "solution-reinforced",
    stamina: 3
  },
  "animalTracks:offerFish": {
    result: "鱼被留在远离山路的石边，灌木里的动物循着气味离开，还露出了草药生长处。",
    log: "你用鱼把动物引离山路，发现了一处安全通过的位置。",
    visualClass: "solution-fish",
    consumeRequirements: ["category:fish"],
    stamina: 1
  },
  "distantCry:prepareAid": {
    result: "绳索跨过湿滑斜坡，为受困者搭出了一条安全返回线。",
    combinedResult: "你先用绳组把伤者拉回安全位置，再用急救包处理伤口，完成了一次完整救援。",
    log: "你用攀登绳组抵达危险位置并完成救援，伤情只能留待后续处理。",
    combinedLog: "你先用攀登绳组完成救援，再用急救包处理伤口。",
    visualClass: "solution-rescue",
    followUpRequirements: ["firstAidPouch"],
    consumeFollowUpRequirements: ["firstAidPouch"],
    combinedForcedTier: "rareGood",
    unlockLocationId: "oldRangerStation",
    stamina: 2
  },
  "distantCry:treatInjury": {
    result: "你确认伤者隔着危险落差，只能先通过喊话指导他固定伤处，等待更安全的救援路线。",
    log: "急救包已经准备好，但你无法安全抵达伤者，因此没有假装完成救援，也没有消耗用品。",
    visualClass: "solution-first-aid",
    forcedTier: "mixed"
  },
  "distantCry:showRangerToken": {
    result: "对方认出旧护林站的木章，立即说明身份，并告诉你附近补给箱的位置。",
    log: "护林员木章取得了对方信任，你获得了额外情报和补给线索。",
    visualClass: "solution-token",
    stamina: 1
  },
  "abandonedCabin:lightLantern": {
    result: "稳定灯光照亮了门轴和地板，木屋内可落脚的位置清楚显现。",
    log: "你用山行提灯照亮木屋，避开了腐朽地板。",
    visualClass: "solution-lantern",
    forcedTier: "rareGood",
    stamina: 3
  },
  "abandonedCabin:repairDoor": {
    result: "工具松开了卡死的门闩，门后露出一处保存完好的避风角。",
    log: "你用旧工具套组处理了木屋门闩。",
    visualClass: "solution-repaired",
    stamina: 3
  },
  "abandonedCabin:restWithSupplies": {
    resultByRequirement: {
      "category:meal": "你在干燥门廊吃下一份料理，热气让疲劳迅速散去。",
      mountainHerb: "你用热水泡开新鲜草药，短暂休息后身体轻松了一些。"
    },
    logByRequirement: {
      "category:meal": "你在木屋门廊吃了一份料理，充分恢复了体力。",
      mountainHerb: "你使用山地草药缓解了疲劳。"
    },
    visualClass: "solution-rest",
    consumeRequirements: ["category:meal", "mountainHerb"],
    staminaByRequirement: { "category:meal": 10, mountainHerb: 4 }
  },
  "whiteShadow:raiseLantern": {
    result: "灯光穿过白影，显出它只是被风卷起的旧斗篷，树后路标也随之露出。",
    log: "山行提灯照清了白影和被遮住的路标。",
    visualClass: "solution-lantern",
    stamina: 2
  },
  "whiteShadow:showCharm": {
    result: "护符纹路与白影同时闪烁，影子没有消失，而是退开并指向林中小路。",
    log: "林间护符引起白影回应，你发现了隐藏的林中小路。",
    visualClass: "solution-charm",
    unlockLocationId: "ridgeTrail",
    stamina: 1
  },
  "streamSparkle:usePole": {
    result: "工具稳稳夹住水下物件，你没有踏进急流便将它取了回来。",
    log: "你用旧工具套组安全取回了溪流里的物件。",
    visualClass: "solution-tool",
    stamina: 2
  },
  "lostBeforeDark:signalForHelp": {
    resultByRequirement: {
      silverCompass: "指南针稳定指向山脊缺口，你立即修正方向并找回主路。",
      fieldLantern: "提灯在雾中连续闪烁，远处很快传来护林站的回应。"
    },
    logByRequirement: {
      silverCompass: "你查看银色指南针后修正方向，顺利走出浓雾。",
      fieldLantern: "你用山行提灯发出信号，获得了远处回应。"
    },
    visualClass: "solution-direction",
    stamina: 3
  },
  "lostBeforeDark:readTrailMap": {
    result: "手绘地图上的溪流弯角与脚边地形完全一致，你沿着小路回到了主路。",
    log: "手绘山路图帮助你避开了错误岔路。",
    visualClass: "solution-map",
    stamina: 2
  }
};

const ADVENTURE_MISSING_ITEM_FEEDBACK = {
  forestFootsteps: { bubble: "这声音不太对……可惜没有能确认异常的东西。", result: "脚步声仍藏在树林里，你因准备不足没有继续追查。" },
  hiddenFork: { bubble: "这条支路有点眼熟……可惜手边没有可靠参照。", result: "树枝后的路线无法确认，你只能暂时留在主路。" },
  lockedChest: { bubble: "锁还能打开……可惜没带合适的装备。", result: "木箱仍然紧锁，你记下位置后暂时离开。" },
  suddenDownpour: { bubble: "要是有合适的固定装备就好了。", result: "你没能搭起稳定遮蔽，只能冒雨转移到较安全的位置。" },
  unstableBridge: { bubble: "这座桥应该还能加固……装备却没带够。", result: "吊桥仍在摇晃，你因缺少合适装备没有冒险通过。" },
  animalTracks: { bubble: "灌木里还有东西……手边没有能引开它的东西。", result: "动物仍守在前方，你没有找到安全靠近的方法。" },
  distantCry: { bubble: "我听见了，可这次的救援准备不够。", result: "你确认了呼救方向，却因缺少合适装备无法安全靠近。" },
  abandonedCabin: { bubble: "门和里面都不太对……可惜准备得不够。", result: "木屋保持原样，你没有合适物品继续安全检查。" },
  whiteShadow: { bubble: "它在等什么……但我没带能试探它的东西。", result: "白影仍停在树后，你因准备不足没有发现更多线索。" },
  streamSparkle: { bubble: "水流太急了……没有合适工具够不到。", result: "闪光物仍在溪流中，你没能安全取回它。" },
  lostBeforeDark: { bubble: "这些路口都一样……手边没有可靠的方向线索。", result: "你缺少合适的辨路装备，只能先停在安全位置。" }
};

const ADVENTURE_LOCATION_CATALOG = {
  deepMountain: { id: "deepMountain", name: "深山" },
  ridgeTrail: { id: "ridgeTrail", name: "隐秘山脊路" },
  watchtowerRoute: { id: "watchtowerRoute", name: "旧瞭望塔路线" },
  oldRangerStation: { id: "oldRangerStation", name: "旧护林站" }
};

const DEEP_MOUNTAIN_ADVENTURE_ROUTES = {
  creekValley: {
    id: "creekValley",
    name: "溪谷路线",
    riskLabel: "较安全 · 适合收集",
    description: "沿溪水和缓坡前进，草药、动物痕迹与水边发现更常见。",
    preparationHint: "潮湿的溪谷适合带上能处理水边物件或照顾体力的准备。",
    unlockAny: ["deepMountain"],
    lockedHint: "先熟悉深山入口附近的水声。",
    staminaCost: 0,
    eventWeights: { streamSparkle: 2.4, animalTracks: 2.1, missingFood: 1.45, forestFootsteps: 1.3, suddenDownpour: 1.15, unstableBridge: 0.65, whiteShadow: 0.65 }
  },
  denseForest: {
    id: "denseForest",
    name: "密林路线",
    riskLabel: "风险较高 · 异常频繁",
    description: "树影遮住方向，奇怪脚步、白影和隐藏支路更容易出现。",
    preparationHint: "林下光线复杂，照明、辨路或能回应异常的东西也许有帮助。",
    unlockAny: ["deepMountain"],
    lockedHint: "树影后似乎还有一条未被记录的入口。",
    staminaCost: 1,
    eventWeights: { forestFootsteps: 2.3, whiteShadow: 2.35, lostBeforeDark: 1.9, hiddenFork: 1.75, animalTracks: 1.2, streamSparkle: 0.65, distantCry: 0.75 }
  },
  mountainRidge: {
    id: "mountainRidge",
    name: "山脊路线",
    riskLabel: "体力消耗高 · 远景线索多",
    description: "经过吊桥和迎风坡，暴雨、呼救与路线发现更常见。",
    preparationHint: "迎风山脊考验固定、救援与方向判断，但也能看到更远的地方。",
    unlockAny: ["ridgeTrail"],
    lockedHint: "先找到一条能安全登上山脊的隐蔽小路。",
    staminaCost: 3,
    eventWeights: { unstableBridge: 2.5, suddenDownpour: 2.1, distantCry: 2.1, hiddenFork: 1.6, lostBeforeDark: 1.45, abandonedCabin: 0.7, missingFood: 0.7 }
  },
  abandonedRangerRoad: {
    id: "abandonedRangerRoad",
    name: "废弃护林道",
    riskLabel: "线索密集 · 装备机会多",
    description: "旧设施散落在路旁，木屋、木箱和护林员留下的痕迹更常见。",
    preparationHint: "旧设施可能需要照明、简单修缮或能证明来意的随身物。",
    unlockAny: ["watchtowerRoute", "oldRangerStation"],
    lockedHint: "封蜡文件或护林员留下的凭证或许会指向这里。",
    staminaCost: 2,
    eventWeights: { abandonedCabin: 2.6, lockedChest: 2.4, distantCry: 2.15, streamSparkle: 1.35, lostBeforeDark: 1.2, whiteShadow: 0.75, animalTracks: 0.75 }
  }
};

const DEEP_MOUNTAIN_ADVENTURE_GOALS = {
  investigateWhiteShadow: {
    id: "investigateWhiteShadow",
    name: "调查树林里的白影",
    shortDescription: "追查白影留下的痕迹，判断它是在警告、引路，还是单纯躲避来客。",
    relatedEvents: ["whiteShadow", "forestFootsteps", "lostBeforeDark", "hiddenFork"],
    relatedItems: ["fieldLantern", "forestCharm", "trailMap"],
    progressFlags: { heardStrangeFootsteps: 1, sawWhiteShadow: 1, whiteShadowResolved: 2, whiteShadowGuided: 2, supernaturalTrail: 2 },
    successScore: 3,
    partialScore: 1,
    logTitle: "雾中白影调查记录",
    endings: {
      complete: "白影最终回应了你的行动，并把一段隐藏山路留在雾后。",
      partial: "你找到了白影活动的痕迹，但它的真正身份仍藏在树林深处。",
      incomplete: "白影没有再次出现，只留下几处无法确认的动静。",
      unexpected: "没有找到白影，却在追踪途中记录了另一项罕见发现。"
    },
    reward: { type: "clue", clueId: "whiteShadowTrace", label: "白影留下的雾痕记录" }
  },
  findWatchtowerClue: {
    id: "findWatchtowerClue",
    name: "寻找旧瞭望塔的线索",
    shortDescription: "调查旧设施和锁具，拼出通往旧瞭望塔的路线。",
    relatedEvents: ["abandonedCabin", "lockedChest", "streamSparkle", "hiddenFork"],
    relatedItems: ["fieldLantern", "repairToolkit", "oldKey"],
    progressFlags: { discoveredCabinClue: 1, foundLockedChest: 1, openedChest: 2, archivedSealedLetter: 3, foundOldKey: 1, foundStreamClue: 1 },
    successScore: 4,
    partialScore: 1,
    logTitle: "旧瞭望塔线索簿",
    endings: {
      complete: "木屋、旧锁与封蜡文件终于连成了一条清楚的瞭望塔路线。",
      partial: "你确认旧设施之间存在联系，但最关键的路线记录仍未完整出现。",
      incomplete: "这次没有找到足以确认瞭望塔方向的旧设施。",
      unexpected: "瞭望塔线索没有进展，另一处山路发现却值得单独记录。"
    },
    reward: { type: "clue", clueId: "watchtowerSurvey", label: "旧瞭望塔路线拓印" }
  },
  findMissingRanger: {
    id: "findMissingRanger",
    name: "寻找失踪的护林员",
    shortDescription: "沿旧护林设施寻找呼救者，并尽可能完成安全救援。",
    relatedEvents: ["distantCry", "abandonedCabin", "lockedChest", "unstableBridge"],
    relatedItems: ["ropeKit", "firstAidPouch", "rangerToken"],
    progressFlags: { foundRangerEvidence: 1, heardRescueCall: 1, rangerTrusted: 2, reachedRanger: 2, completedRescue: 3 },
    successScore: 4,
    partialScore: 1,
    logTitle: "失踪护林员搜救记录",
    endings: {
      complete: "你找到了呼救者，并把护林员安全带回了能够辨认的山路。",
      partial: "你确认了护林员活动的方向，但仍需要一次准备更充分的搜救。",
      incomplete: "山谷里没有传来可靠回应，搜救范围只能留待下次扩大。",
      unexpected: "没有找到护林员，却发现了一条可能与旧护林站有关的旁证。"
    },
    reward: { type: "item", itemId: "firstAidPouch", quantity: 1 }
  },
  investigateWildlife: {
    id: "investigateWildlife",
    name: "调查山中的野生动物",
    shortDescription: "辨认脚印、食物痕迹和兽径，尽量在不惊扰动物的情况下完成观察。",
    relatedEvents: ["animalTracks", "missingFood", "forestFootsteps", "streamSparkle"],
    relatedItems: ["category:fish", "trailRation", "trailMap"],
    progressFlags: { foundAnimalTracks: 1, followedAnimal: 1, observedAnimal: 2, befriendedAnimal: 2, identifiedFoodThief: 2 },
    successScore: 3,
    partialScore: 1,
    logTitle: "溪谷动物观察手记",
    endings: {
      complete: "脚印、兽径和被翻动的食物互相印证，你完成了一次不惊扰动物的观察。",
      partial: "你记录了新鲜痕迹，但动物始终保持着安全距离。",
      incomplete: "山林很安静，这次没有留下足以辨认动物的线索。",
      unexpected: "动物没有露面，溪边却留下了另一项值得带回的发现。"
    },
    reward: { type: "item", itemId: "mountainHerb", quantity: 1 }
  },
  findSafeRoute: {
    id: "findSafeRoute",
    name: "寻找一条安全的新路线",
    shortDescription: "检查岔路、桥面和方向标记，找出能够稳定往返的路径。",
    relatedEvents: ["hiddenFork", "unstableBridge", "lostBeforeDark", "suddenDownpour"],
    relatedItems: ["trailMap", "silverCompass", "ropeKit", "repairToolkit"],
    progressFlags: { enduredDownpour: 1, foundHiddenFork: 1, mappedFork: 2, repairedBridge: 2, routeRecovered: 2, securedRoute: 3 },
    successScore: 4,
    partialScore: 1,
    logTitle: "深山安全路线勘察",
    endings: {
      complete: "你把桥面、岔路和返程方向连成了一条能够再次通行的安全路线。",
      partial: "你确认了几处关键路标，但整条路线还需要继续勘察。",
      incomplete: "天气和地形没有留下足够稳定的路线依据。",
      unexpected: "新路线尚未确认，但沿途意外发现了值得再次调查的地点。"
    },
    reward: { type: "unlock", locationId: "ridgeTrail" }
  }
};

const ADVENTURE_REACTION_ITEM_REQUIREMENTS = {
  forestFootsteps: { holdCharm: ["forestCharm"] },
  hiddenFork: { readTrailMap: ["trailMap"] },
  lockedChest: { useTools: ["oldKey", "repairToolkit"] },
  suddenDownpour: { buildCover: ["ropeKit"], eatMeal: ["category:meal"] },
  unstableBridge: { reinforceBridge: ["ropeKit", "repairToolkit"] },
  animalTracks: { offerFish: ["category:fish"] },
  distantCry: { prepareAid: ["ropeKit"], treatInjury: ["firstAidPouch"], showRangerToken: ["rangerToken"] },
  abandonedCabin: { lightLantern: ["fieldLantern"], repairDoor: ["repairToolkit"], restWithSupplies: ["category:meal", "mountainHerb"] },
  whiteShadow: { raiseLantern: ["fieldLantern"], showCharm: ["forestCharm"] },
  streamSparkle: { usePole: ["repairToolkit"] },
  lostBeforeDark: { signalForHelp: ["silverCompass", "fieldLantern"], readTrailMap: ["trailMap"] }
};

const ADVENTURE_EVENT_CONSEQUENCES = {
  forestFootsteps: {
    rareGood: [{ type: "gain", itemId: "trailMap", quantity: 1 }, { type: "stamina", amount: 2 }],
    good: [{ type: "status", id: "tracksRead", label: "辨清兽径" }, { type: "stamina", amount: 1 }],
    mixed: [{ type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -3 }],
    rareBad: [{ type: "stamina", amount: -6 }]
  },
  hiddenFork: {
    rareGood: [{ type: "gain", itemId: "trailMap", quantity: 1 }, { type: "unlock", locationId: "ridgeTrail" }, { type: "stamina", amount: 1 }],
    good: [{ type: "unlock", locationId: "ridgeTrail" }],
    mixed: [{ type: "status", id: "forkMarked", label: "标记岔路" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -3 }],
    rareBad: [{ type: "stamina", amount: -5 }]
  },
  lockedChest: {
    rareGood: [{ type: "gain", itemId: "sealedLetter", quantity: 1 }, { type: "gain", itemId: "repairToolkit", quantity: 1 }],
    good: [{ type: "gain", itemId: "sealedLetter", quantity: 1 }],
    mixed: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -2 }],
    rareBad: [{ type: "stamina", amount: -4 }]
  },
  suddenDownpour: {
    rareGood: [{ type: "status", id: "rainShelter", label: "找到避雨处" }, { type: "stamina", amount: 1 }],
    good: [{ type: "status", id: "keptDry", label: "物资保持干燥" }],
    mixed: [{ type: "stamina", amount: -2 }],
    bad: [{ type: "consumeCategory", categories: ["meal", "fish", "food"], quantity: 1 }, { type: "stamina", amount: -5 }],
    rareBad: [{ type: "consumeCategory", categories: ["meal", "fish", "food"], quantity: 1 }, { type: "stamina", amount: -8 }]
  },
  unstableBridge: {
    rareGood: [{ type: "gain", itemId: "ropeKit", quantity: 1 }, { type: "unlock", locationId: "ridgeTrail" }],
    good: [{ type: "stamina", amount: -1 }],
    mixed: [{ type: "stamina", amount: -3 }],
    bad: [{ type: "stamina", amount: -7 }],
    rareBad: [{ type: "loseItem", itemId: "ropeKit", quantity: 1 }, { type: "stamina", amount: -10 }]
  },
  animalTracks: {
    rareGood: [{ type: "gain", itemId: "mountainHerb", quantity: 2 }],
    good: [{ type: "gain", itemId: "mountainHerb", quantity: 1 }],
    mixed: [{ type: "status", id: "animalTrail", label: "记录动物路线" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -3 }],
    rareBad: [{ type: "stamina", amount: -6 }]
  },
  distantCry: {
    rareGood: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "gain", itemId: "firstAidPouch", quantity: 1 }],
    good: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "gain", itemId: "firstAidPouch", quantity: 1 }],
    mixed: [{ type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -7 }]
  },
  missingFood: {
    rareGood: [{ type: "status", id: "foodRecovered", label: "找回食物" }, { type: "stamina", amount: 1 }],
    good: [{ type: "status", id: "suppliesSecured", label: "重新收好物资" }],
    mixed: [{ type: "loseCategory", categories: ["meal", "fish", "food"], quantity: 1 }],
    bad: [{ type: "loseCategory", categories: ["meal", "fish", "food"], quantity: 1 }, { type: "stamina", amount: -2 }],
    rareBad: [{ type: "loseCategory", categories: ["meal", "fish", "food"], quantity: 2 }, { type: "stamina", amount: -3 }]
  },
  abandonedCabin: {
    rareGood: [{ type: "gain", itemId: "repairToolkit", quantity: 1 }, { type: "gain", itemId: "firstAidPouch", quantity: 1 }],
    good: [{ type: "gain", itemId: "firstAidPouch", quantity: 1 }],
    mixed: [{ type: "gain", itemId: "trailRation", quantity: 1 }, { type: "stamina", amount: 1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -7 }]
  },
  whiteShadow: {
    rareGood: [{ type: "gain", itemId: "forestCharm", quantity: 1 }, { type: "unlock", locationId: "ridgeTrail" }],
    good: [{ type: "gain", itemId: "forestCharm", quantity: 1 }],
    mixed: [{ type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -8 }]
  },
  streamSparkle: {
    rareGood: [{ type: "gain", itemId: "oldKey", quantity: 1 }, { type: "gain", itemId: "silverCompass", quantity: 1 }],
    good: [{ type: "gain", itemId: "oldKey", quantity: 1 }],
    mixed: [{ type: "gain", itemId: "mountainHerb", quantity: 1 }],
    bad: [{ type: "stamina", amount: -2 }],
    rareBad: [{ type: "stamina", amount: -6 }]
  },
  lostBeforeDark: {
    rareGood: [{ type: "gain", itemId: "trailMap", quantity: 1 }, { type: "unlock", locationId: "ridgeTrail" }, { type: "stamina", amount: 2 }],
    good: [{ type: "status", id: "routeFound", label: "找回主路" }, { type: "stamina", amount: -1 }],
    mixed: [{ type: "stamina", amount: -3 }],
    bad: [{ type: "consumeCategory", categories: ["meal", "fish", "food"], quantity: 1 }, { type: "stamina", amount: -7 }],
    rareBad: [{ type: "consumeCategory", categories: ["meal", "fish", "food"], quantity: 1 }, { type: "stamina", amount: -10 }]
  }
};
const ADVENTURE_PROTOTYPE_PATH_POINTS = [
  { x: 46, y: 82 },
  { x: 37, y: 72 },
  { x: 52, y: 64 },
  { x: 42, y: 56 },
  { x: 56, y: 48 },
  { x: 48, y: 40 }
];

function adventureReaction(id, type, action, bubbles, traitWeights, baseWeight) {
  return {
    id: id,
    type: type,
    action: action,
    bubbles: bubbles,
    traitWeights: traitWeights,
    baseWeight: Number(baseWeight) || 18
  };
}

const DEEP_MOUNTAIN_ADVENTURE_EVENTS = [
  {
    id: "forestFootsteps",
    title: "树林里的脚步声",
    approach: { x: 34, y: 68 },
    prop: { className: "prop-footprints", x: 28, y: 64 },
    luckKey: "dangerSense",
    risk: 1,
    phase: "树影里传来脚步声",
    reactions: [
      adventureReaction("followSound", "主动追查", "lantern", ["声音就在前面。", "我去看一眼。"], { courage: 0.72, curiosity: 0.42 }, 17),
      adventureReaction("readTracks", "查看痕迹", "crouch", ["先看看脚印。", "它往那边去了。"], { observation: 0.76, rationality: 0.28 }, 18),
      adventureReaction("findCause", "寻找解释", "inspect", ["不像人的步子。", "风声会重复吗？"], { rationality: 0.7, observation: 0.32 }, 17),
      adventureReaction("stepBack", "退到亮处", "startled", ["先回到看得清的地方。", "别在暗处逞强。"], { comfortSeeking: 0.66, responsibility: 0.26 }, 19),
      adventureReaction("holdCharm", "握住护符感应", "lantern", ["纹路变清楚了。", "它在提醒我什么。"], { curiosity: 0.5, preparedness: 0.48 }, 18)
    ],
    outcomes: {
      rareGood: ["脚印尽头是一只受惊的小鹿，旁边还露出一条平缓兽径。"],
      good: ["你辨认出脚印的方向，顺利绕开了浓密灌木。"],
      mixed: ["声音消失了，只留下几枚还很新鲜的脚印。"],
      bad: ["枝叶突然晃动，你被吓退了几步。"],
      rareBad: ["黑暗里又响起一串更近的脚步，你决定立刻离开。"]
    }
  },
  {
    id: "hiddenFork",
    title: "被树枝遮住的岔路",
    approach: { x: 48, y: 52 },
    prop: { className: "prop-branches", x: 53, y: 47 },
    resolvedPropClass: "is-cleared",
    luckKey: "generalLuck",
    risk: 0,
    phase: "路口被枯枝挡住了",
    reactions: [
      adventureReaction("moveBranches", "清开树枝", "inspect", ["这后面像有条路。", "先把树枝挪开。"], { courage: 0.42, responsibility: 0.58 }, 18),
      adventureReaction("takeHiddenPath", "钻进支路", "walk", ["小路在邀请我。", "去看看通向哪里。"], { curiosity: 0.78, courage: 0.25 }, 17),
      adventureReaction("markJunction", "记录路口", "crouch", ["先把路口记下来。", "回程会用得上。"], { observation: 0.58, preparedness: 0.48 }, 18),
      adventureReaction("pauseAndListen", "停下判断", "rest", ["先听听哪边更安静。", "不用急着选。"], { rationality: 0.52, comfortSeeking: 0.46 }, 19),
      adventureReaction("readTrailMap", "对照手绘地图", "inspect", ["这条细线就在这里。", "山势和图上对得上。"], { observation: 0.54, preparedness: 0.58 }, 18)
    ],
    outcomes: {
      rareGood: ["树枝后是一条干燥近路，正好通向山脊。"],
      good: ["隐藏小路完整露了出来，路面比主路更平缓。"],
      mixed: ["小路确实存在，但很快又分成了两条。"],
      bad: ["树枝下全是湿滑碎石，这条路暂时不好走。"],
      rareBad: ["松动的枯枝滚落下来，你及时退回了主路。"]
    }
  },
  {
    id: "lockedChest",
    title: "上锁的旧木箱",
    approach: { x: 43, y: 58 },
    prop: { className: "prop-chest-closed", x: 37, y: 55 },
    resolvedProp: "prop-chest-open",
    luckKey: "treasureLuck",
    risk: 1,
    phase: "苔藓间露出一只木箱",
    reactions: [
      adventureReaction("forceLock", "试着撬锁", "open", ["这把锁已经很旧了。", "轻一点，也许能开。"], { courage: 0.54, curiosity: 0.38 }, 16),
      adventureReaction("inspectLock", "检查锁孔", "crouch", ["锁上有新的刮痕。", "先别急着动。"], { observation: 0.72, rationality: 0.38 }, 18),
      adventureReaction("useTools", "使用随身工具", "lantern", ["带工具果然有用。", "让我试试合适的那把。"], { preparedness: 0.74, responsibility: 0.28 }, 18),
      adventureReaction("leaveChest", "保持原样", "inspect", ["不属于我的东西。", "记下位置就好。"], { responsibility: 0.58, rationality: 0.42 }, 18)
    ],
    outcomes: {
      rareGood: ["锁扣轻响一声，箱里亮起温暖金光，露出一张旧路线图。"],
      good: ["木箱打开了，里面是一套保存完好的旧登山工具。"],
      mixed: ["箱盖终于松开，里面只有几封被雨浸过的信。"],
      bad: ["锁芯彻底卡死，箱盖纹丝不动。"],
      rareBad: ["腐朽的箱底突然塌下，里面的东西滑进了石缝。"]
    }
  },
  {
    id: "suddenDownpour",
    title: "突然落下的暴雨",
    approach: { x: 54, y: 66 },
    prop: { className: "prop-lantern", x: 71, y: 43 },
    atmosphere: "storm",
    rain: true,
    luckKey: "healthLuck",
    risk: 2,
    phase: "山雨一下子压了下来",
    reactions: [
      adventureReaction("runForCabin", "跑向木屋", "run", ["木屋在那边！", "先去屋檐下。"], { preparedness: 0.62, responsibility: 0.38 }, 18),
      adventureReaction("buildCover", "临时搭遮雨处", "brace", ["绳布还能挡一阵。", "先把背风面固定。"], { rationality: 0.5, preparedness: 0.58 }, 17),
      adventureReaction("walkInRain", "迎雨继续", "walk", ["这场雨来得真快。", "路还看得清。"], { courage: 0.58, curiosity: 0.32 }, 16),
      adventureReaction("waitUnderTree", "树下等雨", "rest", ["先躲一会儿。", "雨小了再走。"], { comfortSeeking: 0.66, observation: 0.28 }, 19),
      adventureReaction("eatMeal", "避雨时吃份料理", "rest", ["趁雨没停，先吃点热的。", "吃饱再赶路。"], { comfortSeeking: 0.58, preparedness: 0.42 }, 18)
    ],
    outcomes: {
      rareGood: ["你刚站稳，雨幕里便出现了一道短暂彩虹。"],
      good: ["你及时避进干燥处，装备也没有被淋湿。"],
      mixed: ["雨来得急去得也快，山路只湿了一小段。"],
      bad: ["鞋袜进了水，接下来的路走得有些狼狈。"],
      rareBad: ["一阵冷风卷过雨幕，你只能暂时中止前进。"]
    }
  },
  {
    id: "unstableBridge",
    title: "不太稳定的吊桥",
    approach: { x: 57, y: 57 },
    prop: { className: "prop-bridge", x: 66, y: 53 },
    propStateClass: "is-swaying",
    luckKey: "dangerSense",
    risk: 2,
    phase: "桥板在溪水上轻轻晃动",
    reactions: [
      adventureReaction("testBridge", "试探桥面", "brace", ["先踩近处这一块。", "绳结还撑得住吗？"], { courage: 0.5, observation: 0.5 }, 17),
      adventureReaction("reinforceBridge", "加固绳结", "crouch", ["这里需要再绑一道。", "先让桥稳一点。"], { preparedness: 0.6, responsibility: 0.48 }, 18),
      adventureReaction("findDetour", "寻找浅滩", "inspect", ["溪边可能有浅处。", "绕一点更稳妥。"], { rationality: 0.64, observation: 0.34 }, 18),
      adventureReaction("turnBack", "暂时折返", "walk", ["不拿安全赌运气。", "换条路也没关系。"], { comfortSeeking: 0.56, responsibility: 0.4 }, 18)
    ],
    outcomes: {
      rareGood: ["你找到隐藏的加固绳，桥面很快稳了下来。"],
      good: ["桥虽然晃，最关键的几块木板依旧结实。"],
      mixed: ["你慢慢通过，桥在身后继续轻晃。"],
      bad: ["一块桥板突然翘起，你只好退回岸边。"],
      rareBad: ["旧绳发出断裂声，幸好你在踏上桥前就停住了。"]
    }
  },
  {
    id: "animalTracks",
    title: "野生动物的脚印",
    approach: { x: 42, y: 70 },
    prop: { className: "prop-footprints", x: 46, y: 67 },
    luckKey: "generalLuck",
    risk: 1,
    phase: "湿泥里留着清晰脚印",
    reactions: [
      adventureReaction("followTracks", "跟随脚印", "walk", ["刚留下不久。", "它往溪边去了。"], { curiosity: 0.68, courage: 0.32 }, 17),
      adventureReaction("measureTracks", "蹲下辨认", "crouch", ["爪印比想象中小。", "步距很整齐。"], { observation: 0.76, rationality: 0.25 }, 19),
      adventureReaction("markArea", "标记区域", "inspect", ["回程要避开这里。", "留个不惊扰它的标记。"], { responsibility: 0.56, preparedness: 0.4 }, 18),
      adventureReaction("giveSpace", "安静绕开", "walk", ["别打扰它。", "我们走另一边。"], { comfortSeeking: 0.48, responsibility: 0.42 }, 18),
      adventureReaction("offerFish", "用鱼引开动物", "open", ["把鱼放远一点。", "希望它喜欢这个。"], { preparedness: 0.56, observation: 0.42 }, 18)
    ],
    outcomes: {
      rareGood: ["脚印旁出现一根漂亮的羽毛，远处的小鹿也回头看了你一眼。"],
      good: ["你判断出动物已经走远，前方路线很安全。"],
      mixed: ["脚印在溪边消失了，你没有再追下去。"],
      bad: ["灌木里忽然一响，未知动物快速跑远。"],
      rareBad: ["更大的脚印覆盖了原来的痕迹，你决定马上改道。"]
    }
  },
  {
    id: "distantCry",
    title: "远处传来的呼救声",
    approach: { x: 50, y: 48 },
    prop: { className: "prop-hiker", x: 76, y: 38 },
    luckKey: "socialLuck",
    risk: 1,
    phase: "山谷另一侧有人呼喊",
    reactions: [
      adventureReaction("callBack", "大声回应", "call", ["听得到吗？", "我在这边！"], { sociability: 0.78, courage: 0.26 }, 18),
      adventureReaction("locateVoice", "判断方位", "inspect", ["声音从逆风处来。", "先确认具体位置。"], { observation: 0.58, rationality: 0.5 }, 18),
      adventureReaction("prepareAid", "架绳前往救援", "brace", ["先把绳索固定好。", "我把你拉到安全位置！"], { responsibility: 0.66, preparedness: 0.46 }, 17),
      adventureReaction("treatInjury", "准备处理伤口", "open", ["我带了急救用品。", "先别乱动，我得找到安全路线。"], { responsibility: 0.62, rationality: 0.4 }, 18),
      adventureReaction("showRangerToken", "亮出护林员木章", "call", ["我带着旧护林站的木章！", "先确认彼此身份。"], { sociability: 0.58, responsibility: 0.48 }, 18)
    ],
    outcomes: {
      rareGood: ["对方很快回应，原来只是迷路的护林员；他指给你一条安全近路。"],
      good: ["你确认了呼喊者的位置，并帮他找到醒目的路标。"],
      mixed: ["声音断断续续，最后传来一句已经安全的回应。"],
      bad: ["山谷回声扰乱了方向，你没有找到声音的来源。"],
      rareBad: ["呼喊突然停了，雾气也盖住了对面的山坡。"]
    }
  },
  {
    id: "missingFood",
    title: "食物莫名少了",
    approach: { x: 45, y: 76 },
    prop: { className: "prop-food", x: 39, y: 72 },
    luckKey: "generalLuck",
    risk: 0,
    phase: "背包旁散着碎屑",
    reactions: [
      adventureReaction("inspectBag", "检查痕迹", "crouch", ["这里有小爪印。", "袋口被翻过了。"], { observation: 0.7, rationality: 0.3 }, 18),
      adventureReaction("secureSupplies", "重新收好物资", "open", ["剩下的先收紧。", "食物要挂高一点。"], { responsibility: 0.68, preparedness: 0.44 }, 19),
      adventureReaction("callToThief", "朝树林喊话", "call", ["是谁偷吃啦？", "至少把袋子还我吧。"], { sociability: 0.62, curiosity: 0.34 }, 16),
      adventureReaction("rationFood", "重新安排口粮", "inspect", ["剩下的也够用。", "把份量重新算一遍。"], { rationality: 0.64, comfortSeeking: 0.28 }, 18)
    ],
    outcomes: {
      rareGood: ["一只松鼠把果干藏在树根后，竟然大半都还在。"],
      good: ["你及时找到被拖走的食物袋，只少了一小块面包。"],
      mixed: ["痕迹指向树林，但偷吃者已经跑远了。"],
      bad: ["包装被咬破，剩下的食物只能重新整理。"],
      rareBad: ["附近出现更多抓痕，这个休息点已经不适合放食物。"]
    }
  },
  {
    id: "abandonedCabin",
    title: "废弃的山间木屋",
    approach: { x: 39, y: 44 },
    prop: { className: "prop-cabin", x: 25, y: 39 },
    luckKey: "generalLuck",
    risk: 1,
    phase: "木屋的门半掩着",
    reactions: [
      adventureReaction("enterCabin", "推门进入", "open", ["有人在吗？", "我只看一眼。"], { courage: 0.5, curiosity: 0.55 }, 16),
      adventureReaction("lightLantern", "举灯探看", "lantern", ["里面太暗了。", "让灯先进去。"], { preparedness: 0.58, observation: 0.38 }, 18),
      adventureReaction("repairDoor", "处理卡死的门闩", "open", ["门闩只是锈住了。", "工具应该能松开它。"], { preparedness: 0.68, rationality: 0.36 }, 18),
      adventureReaction("restWithSupplies", "在门廊补给", "rest", ["这里干燥，正好休息。", "先把身体暖起来。"], { comfortSeeking: 0.62, preparedness: 0.34 }, 19),
      adventureReaction("circleCabin", "绕屋检查", "inspect", ["窗边没有新脚印。", "先看屋外。"], { observation: 0.72, rationality: 0.27 }, 18)
    ],
    outcomes: {
      rareGood: ["屋内的旧灯忽然亮起，墙上挂着一张保存完好的山林图。"],
      good: ["木屋里很安静，还留着一处干燥可靠的避风角落。"],
      mixed: ["门轴吱呀作响，屋里只有旧桌椅和落叶。"],
      bad: ["腐朽地板发出闷响，你没有继续深入。"],
      rareBad: ["楼上传来沉重拖动声，你立刻退出木屋。"]
    }
  },
  {
    id: "whiteShadow",
    title: "树林中的白色影子",
    approach: { x: 53, y: 60 },
    prop: { className: "prop-ghost", x: 72, y: 53 },
    resolvedPropClass: "is-retreating",
    luckKey: "dangerSense",
    risk: 2,
    atmosphere: "dim",
    phase: "白色影子在树后闪了一下",
    reactions: [
      adventureReaction("approachGhost", "主动靠近", "startled", ["它刚刚是不是动了？", "我想看清楚。"], { courage: 0.62, curiosity: 0.44 }, 16),
      adventureReaction("raiseLantern", "举灯观察", "lantern", ["别动，让我照一下。", "光过去了。"], { preparedness: 0.5, observation: 0.5 }, 18),
      adventureReaction("speakToGhost", "试着交谈", "call", ["你需要帮忙吗？", "我没有恶意。"], { sociability: 0.7, courage: 0.24 }, 17),
      adventureReaction("retreatQuietly", "安静后退", "walk", ["先离开它的视线。", "不必什么都弄明白。"], { comfortSeeking: 0.56, rationality: 0.42 }, 18),
      adventureReaction("showCharm", "让护符靠近白影", "lantern", ["纹路和它一起亮了。", "它好像认得这个。"], { curiosity: 0.58, courage: 0.34 }, 18)
    ],
    outcomes: {
      rareGood: ["白影退入树林，树后竟露出一条原本被遮住的小路。"],
      good: ["灯光照过去，白影像雾一样散开，留下清晰路标。"],
      mixed: ["白影闪了一下便消失，周围重新安静下来。"],
      bad: ["白影突然贴近又消失，你惊得后退了好几步。"],
      rareBad: ["树林深处同时亮起两道白影，你没有继续停留。"]
    }
  },
  {
    id: "streamSparkle",
    title: "溪流边的闪光物",
    approach: { x: 59, y: 63 },
    prop: { className: "prop-sparkle", x: 69, y: 62 },
    resolvedPropClass: "is-revealed",
    luckKey: "treasureLuck",
    risk: 1,
    phase: "水边有什么在闪光",
    reactions: [
      adventureReaction("wadeCloser", "踏入浅水", "walk", ["就在那块石头旁。", "水不算深。"], { courage: 0.44, curiosity: 0.58 }, 17),
      adventureReaction("watchReflection", "先看水流", "crouch", ["闪光会跟着水动。", "先等它再出现。"], { observation: 0.72, rationality: 0.34 }, 18),
      adventureReaction("usePole", "用工具拨近", "inspect", ["不用踩进水里。", "拿长杆试试。"], { preparedness: 0.66, rationality: 0.3 }, 18),
      adventureReaction("leaveSparkle", "不冒险靠近", "rest", ["水边的石头太滑。", "远远看看就好。"], { responsibility: 0.46, comfortSeeking: 0.44 }, 18)
    ],
    outcomes: {
      rareGood: ["闪光来自一枚刻着山纹的旧指南针，指针仍在转动。"],
      good: ["你从浅水里捡起一块透亮的蓝色矿石。"],
      mixed: ["那只是光滑石片，却在阳光下格外漂亮。"],
      bad: ["闪光物顺着水流滑走，只留下一圈波纹。"],
      rareBad: ["脚边石头突然松动，你及时退回了岸上。"]
    }
  },
  {
    id: "lostBeforeDark",
    title: "天黑前找不到回去的路",
    approach: { x: 48, y: 49 },
    prop: { className: "prop-sign", x: 51, y: 44 },
    luckKey: "dangerSense",
    risk: 2,
    atmosphere: "foggy",
    phase: "雾里每个路口都很相似",
    reactions: [
      adventureReaction("climbAndLook", "登高找方向", "inspect", ["高处也许看得见山脊。", "我去找个开阔点。"], { courage: 0.38, observation: 0.62 }, 17),
      adventureReaction("retraceSteps", "沿痕迹折返", "crouch", ["来时踩过这块湿泥。", "按原路一点点退。"], { rationality: 0.6, observation: 0.46 }, 19),
      adventureReaction("signalForHelp", "发出求助信号", "call", ["这里有人迷路了！", "让声音传远一点。"], { sociability: 0.62, preparedness: 0.34 }, 17),
      adventureReaction("makeSafeCamp", "原地安全休息", "rest", ["天黑前别再乱走。", "先找个背风处。"], { responsibility: 0.54, comfortSeeking: 0.52 }, 18),
      adventureReaction("readTrailMap", "对照手绘地图", "inspect", ["溪流弯角就在图上。", "这条小路能接回主路。"], { observation: 0.54, preparedness: 0.58 }, 18)
    ],
    outcomes: {
      rareGood: ["雾短暂散开，熟悉的木屋屋顶正好出现在山腰。"],
      good: ["你找到自己留下的痕迹，很快回到清楚的主路。"],
      mixed: ["虽然多绕了一段，你还是在天黑前找到路标。"],
      bad: ["雾越来越浓，你只能先停在安全位置。"],
      rareBad: ["错误路标把你带回原地，今晚只能等待雾散。"]
    }
  }
];
