// Fog-rainforest map configuration. It plugs into the shared adventure engine.

function fogRainforestReaction(id, type, action, bubbles, traitWeights, baseWeight) {
  return {
    id: id,
    type: type,
    action: action,
    bubbles: bubbles,
    traitWeights: traitWeights,
    baseWeight: Number(baseWeight) || 18
  };
}

const FOG_RAINFOREST_LOCATIONS = {
  fogRainforest: { id: "fogRainforest", name: "雾雨林" },
  canopyRoute: { id: "canopyRoute", name: "树冠旧路" },
  rainforestStation: { id: "rainforestStation", name: "废弃调查站" }
};

const FOG_RAINFOREST_ROUTES = {
  riverWetlands: {
    id: "riverWetlands",
    name: "河岸湿地",
    riskLabel: "积水较深 · 补给机会多",
    description: "沿缓流和泥地前进，水位痕迹、漂流补给与两栖动物更常见。",
    presentation: {
      className: "route-river-wetlands",
      opening: "你沿着被雨水漫过的河岸进入雨林，泥地把新旧足迹都留得格外清楚。",
      cameraPosition: "43% 63%",
      prepPosition: "center 62%",
      journalPosition: "center 62%",
      ambientClass: "is-rainforest-wetlands",
      journalTitle: "河岸湿地手记",
      journalCaption: "水线与泥地留下的发现"
    },
    preparationHint: "积水会拖慢脚步，防潮装备和能处理漂流物的工具更有用。",
    unlockAny: ["fogRainforest"],
    lockedHint: "先找到雾雨林入口。",
    staminaCost: 0,
    recommendedItems: ["rainCape", "ropeKit", "repairToolkit"],
    riskItems: ["trailRation", "insectRepellent"],
    resourceIds: ["rainGinger", "sourBerry", "aromaticLeaf"],
    recipeIds: ["rainforestSourFishSoup", "aromaticLeafGrilledFish"],
    eventWeights: { muddyCrossing: 2.5, riverbankTracks: 2.25, flashFloodDebris: 2.2, floodedSupplyCrate: 2.05, frogChorus: 1.8, lostSupplyBeacon: 1.45, luminousPlants: 1.25, insectSwarm: 1.15, sporeCloud: 0.8, vineBarricade: 0.75, researchStation: 0.55, weatherConsole: 0.45, canopyWalkway: 0.35, wrongMemoryPlot: 0.35, symbolStone: 0.3 }
  },
  vineThicket: {
    id: "vineThicket",
    name: "藤蔓密径",
    riskLabel: "虫群活跃 · 路线会变化",
    description: "藤蔓和发光植物覆盖旧路，植被变化与虫群事件更常见。",
    presentation: {
      className: "route-vine-thicket",
      opening: "你从垂落藤蔓之间挤进密径，昨夜的雨让许多枝条换了位置。",
      cameraPosition: "57% 47%",
      prepPosition: "center 44%",
      journalPosition: "center 44%",
      ambientClass: "is-rainforest-glow",
      journalTitle: "藤蔓密径观察簿",
      journalCaption: "叶影下不断变化的路径"
    },
    preparationHint: "这里需要温和处理藤蔓，也要留意孢子和靠近灯光的虫群。",
    unlockAny: ["fogRainforest"],
    lockedHint: "先找到雾雨林入口。",
    staminaCost: 1,
    recommendedItems: ["vineCutter", "fieldLantern", "rainCape"],
    riskItems: ["insectRepellent", "trailRation"],
    resourceIds: ["aromaticLeaf", "rainforestMushroom", "rainGinger"],
    recipeIds: ["aromaticLeafGrilledFish", "wildGingerMushroomSoup"],
    eventWeights: { vineBarricade: 2.55, movingVines: 2.35, luminousPlants: 2.25, sporeCloud: 2.05, insectSwarm: 2, canopyOrchids: 1.55, canopyWalkway: 1.35, frogChorus: 1.05, symbolStone: 0.95, fieldNotebook: 0.65, muddyCrossing: 0.6, floodedSupplyCrate: 0.45, wrongMemoryPlot: 0.4 }
  },
  canopyOldWay: {
    id: "canopyOldWay",
    name: "树冠旧路",
    riskLabel: "落差较大 · 稀有植物多",
    description: "沿旧木梯和高处步道前进，视野开阔，也更考验体力与固定。",
    presentation: {
      className: "route-canopy-old-way",
      opening: "你沿着重新显露的木梯爬上树冠，雨声从脚下的叶层传来。",
      cameraPosition: "54% 29%",
      prepPosition: "center 28%",
      journalPosition: "center 28%",
      ambientClass: "is-rainforest-canopy",
      journalTitle: "树冠旧路纪行",
      journalCaption: "高处枝桥旁看见的雨林"
    },
    preparationHint: "高处旧路需要稳妥固定，雨披也能保护背包里的样本。",
    unlockAny: ["canopyRoute"],
    lockedHint: "先从改变位置的藤蔓后找到旧木梯。",
    staminaCost: 3,
    recommendedItems: ["ropeKit", "rainCape", "vineCutter"],
    riskItems: ["firstAidPouch", "trailRation"],
    resourceIds: ["aromaticLeaf", "rainforestMushroom"],
    recipeIds: ["aromaticLeafGrilledFish", "wildGingerMushroomSoup"],
    eventWeights: { canopyWalkway: 2.65, canopyOrchids: 2.55, movingVines: 1.95, luminousPlants: 1.8, lostSupplyBeacon: 1.65, flashFloodDebris: 1.25, fieldNotebook: 1.15, insectSwarm: 1.05, symbolStone: 0.9, wrongMemoryPlot: 0.75, sporeCloud: 0.7, muddyCrossing: 0.35 }
  },
  abandonedSurveyZone: {
    id: "abandonedSurveyZone",
    name: "废弃调查区",
    riskLabel: "设施密集 · 记录保存较多",
    description: "旧调查站和监测设施散落在雨林里，能找到装备、记录和异常读数。",
    presentation: {
      className: "route-survey-zone",
      opening: "你沿褪色标牌进入废弃调查区，雨水仍在敲打没有完全停摆的屋顶。",
      cameraPosition: "30% 43%",
      prepPosition: "left 43%",
      journalPosition: "left 43%",
      ambientClass: "is-rainforest-station",
      journalTitle: "调查站旧档案",
      journalCaption: "潮湿设备中恢复的记录"
    },
    preparationHint: "调查设施可能需要通行牌、照明或简单修缮，也可能留下可用补给。",
    unlockAny: ["rainforestStation"],
    lockedHint: "先找到仍能辨认的调查站入口或通行牌。",
    staminaCost: 2,
    recommendedItems: ["stationPass", "repairToolkit", "fieldLantern", "rainCape"],
    riskItems: ["firstAidPouch", "trailRation"],
    resourceIds: ["rainGinger", "sourBerry", "rainforestMushroom"],
    recipeIds: ["rainforestSourFishSoup", "wildGingerMushroomSoup"],
    eventWeights: { researchStation: 2.75, weatherConsole: 2.65, fieldNotebook: 2.5, lostSupplyBeacon: 2.15, floodedSupplyCrate: 1.85, wrongMemoryPlot: 1.5, symbolStone: 1.4, flashFloodDebris: 1.15, luminousPlants: 0.9, insectSwarm: 0.85, vineBarricade: 0.8, canopyWalkway: 0.65, frogChorus: 0.55 }
  }
};

const FOG_RAINFOREST_HOOKS = {
  followChangingVines: {
    id: "followChangingVines",
    title: "换了位置的藤蔓",
    intro: "上次标记的藤蔓绕到了另一棵树上，后面那段旧路也许重新露出来了。",
    rumorIntro: "雨林里的藤蔓会在几场雨后改道，有人曾在枝叶后看见旧木梯。",
    routeIds: ["vineThicket", "canopyOldWay"],
    offRouteWeight: 0.12,
    relatedEventIds: ["vineBarricade", "movingVines", "canopyWalkway", "canopyOrchids", "symbolStone"],
    relatedItems: ["vineCutter", "ropeKit", "rainCape"],
    clues: [
      { id: "vineBarrierMark", label: "藤墙后露出的旧木梯刻痕", eventIds: ["vineBarricade"], flagIds: ["foundVineBarrier"] },
      { id: "movingVineKnot", label: "与昨日标记错开的藤结", eventIds: ["movingVines"], flagIds: ["tracedMovingVines"] },
      { id: "canopySteps", label: "树冠旧路的缺板位置", eventIds: ["canopyWalkway"], flagIds: ["foundCanopySteps", "crossedCanopy"] },
      { id: "orchidRoutePattern", label: "树冠兰花开合指向的旧路", eventIds: ["canopyOrchids"], flagIds: ["studiedOrchids"] }
    ],
    progressFlags: { foundVineBarrier: 1, tracedMovingVines: 1, foundCanopySteps: 2, crossedCanopy: 2, studiedOrchids: 2 },
    successScore: 4,
    partialScore: 1,
    logTitle: "藤蔓改道记录"
  },
  traceStationRecords: {
    id: "traceStationRecords",
    title: "调查站缺失的记录",
    intro: "潮湿终端里还留着没有读完的编号，它们似乎指向另一处监测点。",
    rumorIntro: "旧调查站偶尔会自动亮起一盏灯，但记录日期已经对不上。",
    routeIds: ["abandonedSurveyZone", "riverWetlands"],
    offRouteWeight: 0.12,
    relatedEventIds: ["researchStation", "weatherConsole", "fieldNotebook", "lostSupplyBeacon", "floodedSupplyCrate", "wrongMemoryPlot"],
    relatedItems: ["stationPass", "repairToolkit", "fieldLantern"],
    clues: [
      { id: "stationDoorCode", label: "调查站门扣旁的设施编号", eventIds: ["researchStation"], flagIds: ["foundStation"] },
      { id: "weatherConsoleDate", label: "天气终端跳过的缺失日期", eventIds: ["weatherConsole"], flagIds: ["restoredConsole"] },
      { id: "fieldNotebookSample", label: "调查笔记夹页里的植物样本号", eventIds: ["fieldNotebook"], flagIds: ["readFieldNotebook"] },
      { id: "supplyBeaconSignal", label: "根系下信标的回传节奏", eventIds: ["lostSupplyBeacon"], flagIds: ["foundSupplyBeacon", "recoveredStationRecord"] }
    ],
    progressFlags: { foundStation: 1, restoredConsole: 2, readFieldNotebook: 2, foundSupplyBeacon: 1, recoveredStationRecord: 3 },
    successScore: 4,
    partialScore: 1,
    logTitle: "调查站记录复原簿"
  },
  studyLuminousPlants: {
    id: "studyLuminousPlants",
    title: "雨后亮起的植物",
    intro: "雨停后，低处叶片仍按不一致的节奏发光，可能不只是普通反光。",
    rumorIntro: "有些植物只在连续降雨后发亮，而且会沿着旧步道成片出现。",
    routeIds: ["vineThicket", "canopyOldWay"],
    offRouteWeight: 0.12,
    relatedEventIds: ["luminousPlants", "sporeCloud", "canopyOrchids", "insectSwarm", "frogChorus"],
    relatedItems: ["luminousSpore", "rainCape", "fieldLantern"],
    clues: [
      { id: "leafGlowOrder", label: "雨后叶片依次亮起的顺序", eventIds: ["luminousPlants"], flagIds: ["foundLuminousPlants"] },
      { id: "sporeSampleTrail", label: "低处孢子云的上风路径", eventIds: ["sporeCloud"], flagIds: ["crossedSporeCloud"] },
      { id: "orchidGlowMatch", label: "树冠兰花里的同色微光", eventIds: ["canopyOrchids"], flagIds: ["studiedOrchids"] },
      { id: "frogGlowRhythm", label: "蛙鸣与发光水线的节奏", eventIds: ["frogChorus"], flagIds: ["readFrogWaterline"] }
    ],
    progressFlags: { foundLuminousPlants: 1, collectedSpores: 2, crossedSporeCloud: 1, studiedOrchids: 2, followedGlowPattern: 2 },
    successScore: 3,
    partialScore: 1,
    logTitle: "发光植物观察手记"
  },
  recoverLostSupplies: {
    id: "recoverLostSupplies",
    title: "被水冲走的补给",
    intro: "河岸下游又出现了旧绑带和防水布，遗失补给也许还没有被冲远。",
    rumorIntro: "最近涨水把几只调查箱冲出了储藏区，河弯处偶尔能看见反光。",
    routeIds: ["riverWetlands", "abandonedSurveyZone"],
    offRouteWeight: 0.12,
    relatedEventIds: ["muddyCrossing", "flashFloodDebris", "floodedSupplyCrate", "lostSupplyBeacon", "riverbankTracks"],
    relatedItems: ["ropeKit", "rainCape", "repairToolkit"],
    clues: [
      { id: "floodDebrisBand", label: "洪水漂流物上的调查箱绑带", eventIds: ["flashFloodDebris"], flagIds: ["foundFloodDebris"] },
      { id: "floodedCrateLabel", label: "泡水调查箱侧面的补给标签", eventIds: ["floodedSupplyCrate"], flagIds: ["foundSupplyCrate", "openedSupplyCrate"] },
      { id: "beaconBagList", label: "信标旁防水袋里的补给清单", eventIds: ["lostSupplyBeacon"], flagIds: ["foundSupplyBeacon"] },
      { id: "mudWaterline", label: "泥水退去后留下的稳定水线", eventIds: ["muddyCrossing", "riverbankTracks"], flagIds: ["crossedMudSafely", "readRiverbankTracks"] }
    ],
    progressFlags: { crossedMudSafely: 1, foundFloodDebris: 1, openedSupplyCrate: 2, foundSupplyBeacon: 2, recoveredRainforestSupplies: 3 },
    successScore: 4,
    partialScore: 1,
    logTitle: "雨林补给寻回记录"
  }
};

const FOG_RAINFOREST_REACTION_ITEM_REQUIREMENTS = {
  muddyCrossing: { securePack: ["rainCape", "ropeKit"] },
  riverbankTracks: { compareMap: ["trailMap"] },
  flashFloodDebris: { anchorLine: ["ropeKit"] },
  floodedSupplyCrate: { openCrate: ["stationPass", "repairToolkit"] },
  luminousPlants: { collectSample: ["rainCape", "fieldLantern"] },
  sporeCloud: { coverUp: ["rainCape", "insectRepellent"] },
  insectSwarm: { useRepellent: ["insectRepellent"] },
  vineBarricade: { trimVines: ["vineCutter", "repairToolkit"] },
  movingVines: { markVines: ["trailMap", "vineCutter"] },
  canopyWalkway: { secureWalkway: ["ropeKit"] },
  canopyOrchids: { protectSample: ["rainCape"] },
  researchStation: { enterStation: ["stationPass", "repairToolkit"] },
  weatherConsole: { restoreConsole: ["repairToolkit", "stationPass"] },
  fieldNotebook: { dryPages: ["rainCape", "fieldLantern"] },
  lostSupplyBeacon: { recoverBeacon: ["ropeKit", "repairToolkit"] },
  frogChorus: { offerFish: ["category:fish"] },
  symbolStone: { compareCharm: ["forestCharm"] },
  wrongMemoryPlot: { checkCompass: ["silverCompass", "trailMap"] }
};

const FOG_RAINFOREST_ITEM_SOLUTION_EFFECTS = {
  "muddyCrossing:securePack": { result: "你把背包固定在高处并包紧怕潮物品，顺着浅色水线稳稳通过泥地。", log: "防潮或固定装备保护了背包。", visualClass: "solution-reinforced", stamina: 2 },
  "riverbankTracks:compareMap": { result: "旧地图的河弯与脚印方向重合，绕水的落脚点也变得清楚。", log: "手绘地图帮助你判断河岸足迹。", visualClass: "solution-map", stamina: 1 },
  "flashFloodDebris:anchorLine": { result: "绳组固定住漂浮木料，你从水线上方取回一截调查箱绑带。", log: "攀登绳组安全固定了洪水漂流物。", visualClass: "solution-reinforced", stamina: 2 },
  "floodedSupplyCrate:openCrate": { resultByRequirement: { stationPass: "通行牌压下机械扣，密封箱在水边完整打开。", repairToolkit: "工具松开变形箱扣，里面大部分补给仍能使用。" }, log: "你打开了泡水补给箱。", visualClass: "solution-unlocked", forcedTierByRequirement: { stationPass: "rareGood", repairToolkit: "good" }, unlockLocationId: "rainforestStation" },
  "luminousPlants:collectSample": { result: "你遮住雨水和杂光，完整收下一小瓶仍在发亮的孢子。", log: "随身装备帮助你安全采集微光孢子。", visualClass: "solution-lantern", forcedTier: "rareGood" },
  "sporeCloud:coverUp": { resultByRequirement: { rainCape: "雨披挡住迎面散开的孢子，你沿上风处顺利通过。", insectRepellent: "叶露改变了周围气味，孢子附近聚集的虫群很快散开。" }, log: "你避开了浓密孢子云。", visualClass: "solution-shelter", consumeRequirements: ["insectRepellent"], stamina: 2 },
  "insectSwarm:useRepellent": { result: "清凉叶香沿着袖口散开，虫群很快退回潮湿叶层。", log: "驱虫叶露让虫群保持距离。", visualClass: "solution-herb", consumeRequirements: ["insectRepellent"], stamina: 1 },
  "vineBarricade:trimVines": { resultByRequirement: { vineCutter: "弯刃只切开缠紧的旧藤，活枝被完整引向两侧。", repairToolkit: "工具撑开藤结，露出一段仍能通行的木梯。" }, log: "你温和处理了挡路藤蔓。", visualClass: "solution-cleared", unlockLocationId: "canopyRoute", stamina: 1 },
  "movingVines:markVines": { resultByRequirement: { trailMap: "你把新旧藤结画在地图边缘，变化规律逐渐清楚。", vineCutter: "刀背留下不会伤到植株的浅标记，旧木梯的位置终于能被再次找到。" }, log: "你标出了藤蔓改变路线的规律。", visualClass: "solution-map", unlockLocationId: "canopyRoute", stamina: 1 },
  "canopyWalkway:secureWalkway": { result: "绳组跨过缺失木板，把摇晃步道重新连成一条安全线。", log: "攀登绳组加固了树冠步道。", visualClass: "solution-reinforced", stamina: 3 },
  "canopyOrchids:protectSample": { result: "雨披遮住突来的水滴，你记录下兰花完整开合的一次变化。", log: "苔纹雨披保护了树冠植物样本。", visualClass: "solution-shelter", forcedTier: "rareGood" },
  "researchStation:enterStation": { resultByRequirement: { stationPass: "通行牌仍能拨开机械门扣，室内设备没有再次进水。", repairToolkit: "工具从外侧松开卡死门轴，露出干燥的记录台。" }, log: "你安全进入了废弃调查站。", visualClass: "solution-unlocked", unlockLocationId: "rainforestStation", stamina: 2 },
  "weatherConsole:restoreConsole": { result: "终端短暂亮起，连续几日的雨量和一组异常回传编号重新出现。", log: "你恢复了调查站天气终端。", visualClass: "solution-repaired", forcedTier: "rareGood", stamina: 1 },
  "fieldNotebook:dryPages": { result: "温和灯光和遮雨层让纸页慢慢展开，最后几行调查记录重新可读。", log: "你保护并读出了受潮调查笔记。", visualClass: "solution-lantern", stamina: 1 },
  "lostSupplyBeacon:recoverBeacon": { result: "固定或修缮工具把信标从根系下取出，微弱指示灯重新亮起。", log: "你回收了遗失补给信标。", visualClass: "solution-repaired", stamina: 2 },
  "frogChorus:offerFish": { result: "鱼被留在远离水线的石面，蛙群移开后露出一枚被泥盖住的标牌。", log: "你用鱼把蛙群温和引离标记点。", visualClass: "solution-fish", consumeRequirements: ["category:fish"], stamina: 1 },
  "symbolStone:compareCharm": { result: "护符纹路与石面符号短暂重合，随后又像普通水痕一样散开。", log: "林间护符回应了雨林石面符号，但没有给出解释。", visualClass: "solution-charm", stamina: 1 },
  "wrongMemoryPlot:checkCompass": { result: "方向工具确认这里并不是记忆中的地点，可几处摆放仍像有人照着熟悉营地复原过。", log: "方向记录排除了普通迷路，却没有解释那份熟悉感。", visualClass: "solution-direction", stamina: 1 }
};

const FOG_RAINFOREST_MISSING_ITEM_FEEDBACK = {
  muddyCrossing: { bubble: "背包快贴到水面了……先找浅一点的地方。", result: "你没有冒险涉过深泥，只记下了较稳的水线。" },
  riverbankTracks: { bubble: "河弯一直重复，没有参照很难判断方向。", result: "足迹在水边中断，你暂时无法确认它从哪里来。" },
  flashFloodDebris: { bubble: "水流还在拉扯这些木料，空手不能靠近。", result: "你没有伸手抓漂流物，只记下它被冲向的河弯。" },
  floodedSupplyCrate: { bubble: "箱扣泡得变形了，这次没有合适工具。", result: "补给箱仍保持密封，你把它推到不易再被冲走的位置。" },
  luminousPlants: { bubble: "水滴和孢子混在一起，不能直接装进背包。", result: "你只从远处记下发光节奏，没有破坏植物。" },
  sporeCloud: { bubble: "孢子太密了，先绕到上风处。", result: "你绕开浓密孢子云，没能检查里面的植物。" },
  insectSwarm: { bubble: "它们全跟着热气过来了……先别停。", result: "你退到水边避开虫群，错过了近处的调查标记。" },
  vineBarricade: { bubble: "这些藤还活着，不能用手硬扯。", result: "你没有破坏藤蔓，只把可能的旧路位置记了下来。" },
  movingVines: { bubble: "昨天的标记不见了，需要更可靠的参照。", result: "藤蔓变化没有留下足够清楚的规律。" },
  canopyWalkway: { bubble: "木板落差太大，固定不住就不能过去。", result: "你在安全处停下，没有踏上缺损步道。" },
  canopyOrchids: { bubble: "这场雨会把样本冲坏，先只观察。", result: "兰花很快在雨里合拢，你没有强行采集。" },
  researchStation: { bubble: "门扣还在，但空手弄不开。", result: "调查站保持原样，你记下入口后离开。" },
  weatherConsole: { bubble: "终端还有电，可接口已经锈住。", result: "天气记录闪过一次便熄灭，没能完整读出。" },
  fieldNotebook: { bubble: "纸页太湿，直接翻会把字一起带走。", result: "你把笔记移到干燥处，留待准备充分时再读。" },
  lostSupplyBeacon: { bubble: "信标卡在根系下面，不能硬拉。", result: "微光仍在根系深处闪烁，你只确认了位置。" },
  frogChorus: { bubble: "蛙群守着那块标牌，别惊动它们。", result: "你保持距离听完叫声，没有靠近水边标牌。" },
  symbolStone: { bubble: "这个纹路像见过，可手边没有能核对的东西。", result: "水痕很快盖住石面符号，你没有得出结论。" },
  wrongMemoryPlot: { bubble: "这里太熟悉了……先确认自己没有绕圈。", result: "熟悉感没有消失，但你无法判断它来自路线还是记忆。" }
};

function fogRainforestConsequences(rareItem, goodItem, options) {
  const settings = options || {};
  const rare = rareItem ? [{ type: "gain", itemId: rareItem, quantity: 1 }] : [{ type: "status", id: settings.statusId || "rainforestDiscovery", label: settings.rareLabel || "记录罕见发现" }];
  const good = goodItem ? [{ type: "gain", itemId: goodItem, quantity: 1 }] : [{ type: "status", id: settings.statusId || "rainforestProgress", label: settings.goodLabel || "记下当地线索" }];
  if (settings.unlock) rare.push({ type: "unlock", locationId: settings.unlock });
  if (settings.goodUnlock) good.push({ type: "unlock", locationId: settings.goodUnlock });
  return {
    rareGood: rare.concat(settings.rareStamina ? [{ type: "stamina", amount: settings.rareStamina }] : []),
    good: good.concat(settings.goodStamina ? [{ type: "stamina", amount: settings.goodStamina }] : []),
    mixed: [{ type: "status", id: settings.mixedId || "rainforestNote", label: settings.mixedLabel || "留下观察记录" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: settings.badStamina || -4 }],
    rareBad: (settings.rareBadLose ? [{ type: "loseCategory", categories: ["meal", "fish", "food"], quantity: 1 }] : []).concat([{ type: "stamina", amount: settings.rareBadStamina || -7 }])
  };
}

const FOG_RAINFOREST_EVENT_CONSEQUENCES = {
  muddyCrossing: fogRainforestConsequences("rainCape", null, { goodLabel: "找到稳定水线", badStamina: -5, rareBadLose: true, rareBadStamina: -8 }),
  riverbankTracks: fogRainforestConsequences("insectRepellent", null, { goodLabel: "辨清河岸足迹", goodStamina: 1 }),
  flashFloodDebris: fogRainforestConsequences("stationPass", "insectRepellent", { mixedLabel: "记录漂流方向", badStamina: -5, rareBadStamina: -9 }),
  floodedSupplyCrate: fogRainforestConsequences("vineCutter", "insectRepellent", { unlock: "rainforestStation", mixedLabel: "固定泡水补给箱" }),
  luminousPlants: fogRainforestConsequences("pressedFernSpecimen", "luminousSpore", { goodStamina: 1 }),
  sporeCloud: fogRainforestConsequences("luminousSpore", null, { goodLabel: "穿过孢子云", badStamina: -5, rareBadStamina: -8 }),
  insectSwarm: fogRainforestConsequences("insectRepellent", null, { goodLabel: "避开虫群", badStamina: -4, rareBadStamina: -7 }),
  vineBarricade: fogRainforestConsequences("vineCutter", null, { goodLabel: "找到藤后旧路", unlock: "canopyRoute", goodUnlock: "canopyRoute" }),
  movingVines: fogRainforestConsequences("pressedFernSpecimen", null, { goodLabel: "标出藤蔓变化", unlock: "canopyRoute", goodUnlock: "canopyRoute" }),
  canopyWalkway: fogRainforestConsequences("rainCape", null, { goodLabel: "通过树冠步道", badStamina: -6, rareBadStamina: -10 }),
  canopyOrchids: fogRainforestConsequences("pressedFernSpecimen", "luminousSpore", { goodStamina: 1 }),
  researchStation: fogRainforestConsequences("stationPass", "repairToolkit", { unlock: "rainforestStation", goodUnlock: "rainforestStation" }),
  weatherConsole: fogRainforestConsequences("rainCape", null, { goodLabel: "恢复天气读数", goodStamina: 1 }),
  fieldNotebook: fogRainforestConsequences("pressedFernSpecimen", "luminousSpore", { mixedLabel: "保存受潮笔记" }),
  lostSupplyBeacon: fogRainforestConsequences("rainCape", "insectRepellent", { goodStamina: 1 }),
  frogChorus: fogRainforestConsequences("luminousSpore", null, { goodLabel: "记录蛙群水位信号", goodStamina: 1 }),
  symbolStone: fogRainforestConsequences("luminousSpore", null, { goodLabel: "拓下石面符号" }),
  wrongMemoryPlot: fogRainforestConsequences(null, null, { rareLabel: "记录不一致的营地痕迹", goodLabel: "确认路线没有绕圈", goodStamina: 1 })
};

function addFogRainforestRewards(eventId, rewardsByTier) {
  Object.keys(rewardsByTier).forEach(function(tier) {
    FOG_RAINFOREST_EVENT_CONSEQUENCES[eventId][tier] = FOG_RAINFOREST_EVENT_CONSEQUENCES[eventId][tier].concat(rewardsByTier[tier]);
  });
}

addFogRainforestRewards("muddyCrossing", {
  rareGood: [{ type: "gainIngredient", ingredientId: "rainGinger", quantity: 1 }],
  good: [{ type: "gainIngredient", ingredientId: "rainGinger", quantity: 1 }]
});
addFogRainforestRewards("riverbankTracks", {
  rareGood: [{ type: "gainIngredient", ingredientId: "sourBerry", quantity: 2 }],
  good: [{ type: "gainIngredient", ingredientId: "sourBerry", quantity: 1 }]
});
addFogRainforestRewards("flashFloodDebris", {
  rareGood: [{ type: "gainIngredient", ingredientId: "rainGinger", quantity: 1 }, { type: "gainIngredient", ingredientId: "sourBerry", quantity: 1 }],
  good: [{ type: "gainIngredient", ingredientId: "rainGinger", quantity: 1 }]
});
addFogRainforestRewards("floodedSupplyCrate", {
  rareGood: [{ type: "gainIngredient", ingredientId: "sourBerry", quantity: 1 }, { type: "unlockRecipe", recipeId: "rainforestSourFishSoup" }],
  good: [{ type: "gainIngredient", ingredientId: "rainGinger", quantity: 1 }, { type: "unlockRecipe", recipeId: "rainforestSourFishSoup" }]
});
addFogRainforestRewards("luminousPlants", {
  rareGood: [{ type: "gainIngredient", ingredientId: "aromaticLeaf", quantity: 2 }, { type: "unlockRecipe", recipeId: "aromaticLeafGrilledFish" }],
  good: [{ type: "gainIngredient", ingredientId: "aromaticLeaf", quantity: 1 }]
});
addFogRainforestRewards("sporeCloud", {
  rareGood: [{ type: "gainIngredient", ingredientId: "rainforestMushroom", quantity: 2 }, { type: "unlockRecipe", recipeId: "wildGingerMushroomSoup" }],
  good: [{ type: "gainIngredient", ingredientId: "rainforestMushroom", quantity: 1 }]
});
addFogRainforestRewards("insectSwarm", {
  rareGood: [{ type: "gainIngredient", ingredientId: "aromaticLeaf", quantity: 1 }, { type: "unlockRecipe", recipeId: "aromaticLeafGrilledFish" }],
  good: [{ type: "gainIngredient", ingredientId: "aromaticLeaf", quantity: 1 }]
});
addFogRainforestRewards("canopyOrchids", {
  rareGood: [{ type: "gainIngredient", ingredientId: "aromaticLeaf", quantity: 1 }, { type: "gainIngredient", ingredientId: "rainforestMushroom", quantity: 1 }, { type: "unlockRecipe", recipeId: "aromaticLeafGrilledFish" }],
  good: [{ type: "gainIngredient", ingredientId: "rainforestMushroom", quantity: 1 }]
});
addFogRainforestRewards("fieldNotebook", {
  rareGood: [{ type: "gainIngredient", ingredientId: "rainforestMushroom", quantity: 1 }, { type: "unlockRecipe", recipeId: "wildGingerMushroomSoup" }],
  good: [{ type: "gainIngredient", ingredientId: "rainforestMushroom", quantity: 1 }]
});
addFogRainforestRewards("frogChorus", {
  rareGood: [{ type: "gainIngredient", ingredientId: "sourBerry", quantity: 1 }, { type: "unlockRecipe", recipeId: "rainforestSourFishSoup" }],
  good: [{ type: "gainIngredient", ingredientId: "sourBerry", quantity: 1 }]
});
addFogRainforestRewards("symbolStone", {
  rareGood: [{ type: "gainIngredient", ingredientId: "rainforestMushroom", quantity: 1 }],
  good: [{ type: "gainIngredient", ingredientId: "aromaticLeaf", quantity: 1 }]
});

const FOG_RAINFOREST_PROP_SHEET_POSITIONS = {
  "prop-rainforest-tracks": ["0%", "0%"],
  "prop-glow-plants": ["33.333%", "0%"],
  "prop-insects": ["66.667%", "0%"],
  "prop-vine-barrier": ["100%", "0%"],
  "prop-station-console": ["0%", "50%"],
  "prop-flooded-crate": ["33.333%", "50%"],
  "prop-canopy-walkway": ["66.667%", "50%"],
  "prop-water-debris": ["100%", "50%"],
  "prop-orchid": ["0%", "100%"],
  "prop-field-notebook": ["33.333%", "100%"],
  "prop-frog": ["66.667%", "100%"],
  "prop-symbol-stone": ["100%", "100%"]
};

const FOG_RAINFOREST_EVENTS = [
  {
    id: "muddyCrossing", title: "没过靴边的泥水", approach: { x: 43, y: 76 }, prop: { className: "prop-water-debris", x: 54, y: 70 }, resolvedPropClass: "is-cleared", luckKey: "dangerSense", risk: 1, rain: true, tags: ["fatigue"], phase: "浑水盖住了原本的落脚点",
    reactions: [fogRainforestReaction("testDepth", "试探水深", "crouch", ["先找底下的硬地。", "水流不快，泥很深。"], { observation: 0.7, rationality: 0.34 }, 19), fogRainforestReaction("securePack", "固定防潮", "open", ["先把怕潮的东西收好。", "绳扣再紧一点。"], { preparedness: 0.72, responsibility: 0.3 }, 18), fogRainforestReaction("leapStones", "踩石跳过", "jump", ["那几块石头能落脚。", "一步就过去。"], { courage: 0.62, preparedness: 0.36 }, 17), fogRainforestReaction("findDetour", "沿水线绕行", "inspect", ["浅色水线会更稳。", "多走一点没关系。"], { responsibility: 0.55, comfortSeeking: 0.36 }, 19)],
    outcomes: { rareGood: ["浅水下压着一件完整雨披，你也找到了可重复使用的稳固水线。"], good: ["你沿硬地通过，背包和样本都没有进水。"], mixed: ["靴子陷进泥里一次，但你留下了返程可辨认的踩点。"], bad: ["泥水突然加深，你花了不少体力才退回岸边。"], rareBad: ["水流卷过膝边，一件没有收紧的食物被冲离背包。"] }
  },
  {
    id: "riverbankTracks", title: "沿河又折回的足迹", approach: { x: 37, y: 68 }, prop: { className: "prop-rainforest-tracks", x: 29, y: 65 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 0, phase: "细小足迹在同一河弯来回出现",
    reactions: [fogRainforestReaction("measureTracks", "量一量步距", "crouch", ["这不是同一时间留下的。", "步距在雨后变短了。"], { observation: 0.75, rationality: 0.3 }, 19), fogRainforestReaction("followDryEdge", "沿干边追踪", "inspect", ["它避开了最深的水。", "看看会走到哪里。"], { curiosity: 0.62, courage: 0.3 }, 18), fogRainforestReaction("compareMap", "对照河弯", "open", ["地图上的转弯就在这里。", "足迹像是绕回旧路。"], { preparedness: 0.6, observation: 0.38 }, 18), fogRainforestReaction("giveSpace", "留出距离", "rest", ["别把它逼向水里。", "从下风处观察。"], { responsibility: 0.64, comfortSeeking: 0.3 }, 19)],
    outcomes: { rareGood: ["足迹把你带到一片驱虫叶旁，附近还留着调查员的旧标记。"], good: ["你辨认出蛙类和小型兽类交叠的路线，没有惊扰它们。"], mixed: ["足迹在水边消失，只留下一个能与下次雨量对照的深度。"], bad: ["一阵新雨洗掉细节，你只能退回较干的河岸。"], rareBad: ["足迹忽然从身后继续出现，你没有在涨水前继续追踪。"] }
  },
  {
    id: "flashFloodDebris", title: "卡在根系间的洪水漂流物", approach: { x: 48, y: 63 }, prop: { className: "prop-water-debris", x: 64, y: 59 }, resolvedPropClass: "is-cleared", luckKey: "dangerSense", risk: 2, rain: true, tags: ["injury", "fatigue"], phase: "漂浮木料被暗流反复拉扯",
    reactions: [fogRainforestReaction("readWater", "观察水势", "inspect", ["每第三次水流会弱一点。", "先等漂木停下来。"], { observation: 0.72, rationality: 0.4 }, 19), fogRainforestReaction("anchorLine", "固定漂流物", "open", ["把绳子绕过外侧树根。", "先别碰最重的那块。"], { preparedness: 0.7, responsibility: 0.34 }, 18), fogRainforestReaction("pullCrate", "直接拉回箱带", "pull", ["那根绑带还连着东西。", "趁水小一点拉。"], { courage: 0.63, preparedness: 0.36 }, 17), fogRainforestReaction("markDownstream", "记录下游方向", "crouch", ["它们都停在同一个河弯。", "补给箱不会离这里太远。"], { rationality: 0.55, observation: 0.45 }, 19)],
    outcomes: { rareGood: ["漂流物间夹着调查站通行牌，下游方向也出现了完整箱带。"], good: ["你取回一份可用叶露，并确认补给被冲往同一河弯。"], mixed: ["你没能拉回漂流物，但记录了水势和箱带编号。"], bad: ["暗流突然加快，你擦伤手臂才退回安全位置。"], rareBad: ["木料猛烈转向，你失去食物并耗费许多体力才脱离水线。"] }
  },
  {
    id: "floodedSupplyCrate", title: "半浸在水里的调查箱", approach: { x: 54, y: 59 }, prop: { className: "prop-flooded-crate", x: 67, y: 61 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 1, rain: true, tags: ["injury"], phase: "密封箱扣被泥沙挤得变形",
    reactions: [fogRainforestReaction("readLabel", "清理箱侧标签", "crouch", ["编号还看得清。", "这是调查站的补给。"], { observation: 0.7, rationality: 0.34 }, 19), fogRainforestReaction("openCrate", "处理机械箱扣", "open", ["这个扣和通行牌一样宽。", "先把泥沙拨开。"], { preparedness: 0.72, curiosity: 0.28 }, 18), fogRainforestReaction("dragToShore", "拖到高处", "pull", ["先别让它继续泡水。", "岸边那棵树能固定。"], { responsibility: 0.62, preparedness: 0.32 }, 18), fogRainforestReaction("leaveMarker", "留下回收标记", "inspect", ["这次打不开也别让它丢。", "标出水位。"], { responsibility: 0.58, rationality: 0.38 }, 19)],
    outcomes: { rareGood: ["箱内的藤切刀保存完好，底层地图也指向废弃调查区。"], good: ["你整理出一瓶驱虫叶露和仍可辨认的调查站方向。"], mixed: ["箱扣没有打开，但你把补给箱固定在高水线以上。"], bad: ["箱体突然滑回泥水，你只能先保住自己的落脚点。"], rareBad: ["变形箱扣弹开又闭合，夹伤手指后仍没有松动。"] }
  },
  {
    id: "luminousPlants", title: "雨后仍在发亮的叶片", approach: { x: 47, y: 55 }, prop: { className: "prop-glow-plants", x: 62, y: 50 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 0, atmosphere: "dim", phase: "蓝绿微光沿叶脉依次亮起",
    reactions: [fogRainforestReaction("watchPattern", "记录发光顺序", "crouch", ["不是同时亮的。", "顺序和水滴方向相反。"], { observation: 0.76, comfortSeeking: 0.28 }, 19), fogRainforestReaction("collectSample", "保护性取样", "open", ["只收落下的孢子。", "别碰完整叶片。"], { responsibility: 0.62, preparedness: 0.38 }, 18), fogRainforestReaction("followGlow", "沿微光前进", "lantern", ["下一簇在更高处。", "像是在标一条路。"], { curiosity: 0.68, courage: 0.25 }, 17), fogRainforestReaction("compareRain", "比较雨滴位置", "inspect", ["被遮住的叶片也在亮。", "这不只是反光。"], { rationality: 0.65, observation: 0.38 }, 19)],
    outcomes: { rareGood: ["你完整记录一次发光循环，并保存下一片未受损的压叶标本。"], good: ["落下的微光孢子被安全装瓶，离开叶层后仍没有熄灭。"], mixed: ["光序没有重复，但与附近水线形成一份可继续比较的记录。"], bad: ["靠近后微光同时熄灭，你只好退回原来的观察点。"], rareBad: ["受扰的孢子突然散开，你迅速离开才避开最浓的一团。"] }
  },
  {
    id: "sporeCloud", title: "低处扩散的孢子云", approach: { x: 52, y: 51 }, prop: { className: "prop-glow-plants", x: 67, y: 47 }, resolvedPropClass: "is-cleared", luckKey: "dangerSense", risk: 2, atmosphere: "dim", tags: ["fatigue"], phase: "发光孢子在呼吸高度缓慢聚集",
    reactions: [fogRainforestReaction("findUpwind", "寻找上风口", "inspect", ["左边叶面晃得更快。", "从高一点的根上过去。"], { observation: 0.65, rationality: 0.42 }, 19), fogRainforestReaction("coverUp", "遮住口鼻通过", "open", ["把边角压紧。", "别停在最亮的地方。"], { preparedness: 0.7, responsibility: 0.34 }, 18), fogRainforestReaction("dashThrough", "快速穿过", "run", ["这一段不长。", "闭气跑过去。"], { courage: 0.6, preparedness: 0.4 }, 17), fogRainforestReaction("waitForRain", "等待雨水压低孢子", "rest", ["下一阵雨会让它们落下。", "先在高处等等。"], { comfortSeeking: 0.64, responsibility: 0.3 }, 19)],
    outcomes: { rareGood: ["孢子云落下时显出一条干燥旧步道，你也收到了完整样本。"], good: ["你从上风处安全通过，并确认孢子来自更高处的植物。"], mixed: ["等待让孢子变薄，但这段路仍需要慢慢通过。"], bad: ["孢子刺激呼吸，你退到河边休息了好一阵。"], rareBad: ["风向突然改变，浓密孢子迫使你耗费体力绕远路。"] }
  },
  {
    id: "insectSwarm", title: "追着体温靠近的虫群", approach: { x: 44, y: 58 }, prop: { className: "prop-insects", x: 58, y: 54 }, resolvedPropClass: "is-retreating", luckKey: "dangerSense", risk: 1, tags: ["injury", "fatigue"], phase: "细小虫群从湿叶下同时升起",
    reactions: [fogRainforestReaction("lowerLight", "收低灯光", "lantern", ["别让光照到雾里。", "它们在跟亮处。"], { observation: 0.62, preparedness: 0.36 }, 19), fogRainforestReaction("useRepellent", "使用驱虫叶露", "open", ["袖口和背包边缘都抹一点。", "清凉味已经散开了。"], { preparedness: 0.74, comfortSeeking: 0.25 }, 18), fogRainforestReaction("moveToWater", "靠近流水", "run", ["水声那边风更大。", "别停在叶堆旁。"], { courage: 0.45, rationality: 0.44 }, 18), fogRainforestReaction("standStill", "静止等它们散开", "rest", ["慢动作，不拍打。", "它们会失去热源。"], { comfortSeeking: 0.68, responsibility: 0.3 }, 19)],
    outcomes: { rareGood: ["虫群退开后露出一丛驱虫叶，你补充了一瓶新鲜叶露。"], good: ["你让虫群失去目标，安全通过潮湿叶层。"], mixed: ["虫群跟了一小段，最终在水声附近散开。"], bad: ["你被迫加快脚步，错过了沿途一处标记。"], rareBad: ["虫群持续追赶，你绕远路并消耗许多体力才摆脱。"] }
  },
  {
    id: "vineBarricade", title: "缠住整段旧路的藤蔓", approach: { x: 50, y: 48 }, prop: { className: "prop-vine-barrier", x: 65, y: 43 }, resolvedPropClass: "is-cleared", luckKey: "generalLuck", risk: 1, phase: "新藤与旧扶手缠成一道厚墙",
    reactions: [fogRainforestReaction("traceLivingStems", "分辨活枝", "inspect", ["浅色的是新长的。", "旧藤才压着扶手。"], { observation: 0.68, responsibility: 0.4 }, 19), fogRainforestReaction("trimVines", "温和清理藤结", "open", ["只处理缠死的部分。", "木梯就在后面。"], { preparedness: 0.7, responsibility: 0.34 }, 18), fogRainforestReaction("pushThrough", "从缝隙挤过", "pull", ["中间能看见空处。", "别让背包挂住。"], { courage: 0.55, preparedness: 0.38 }, 17), fogRainforestReaction("markBarrier", "记录藤墙位置", "crouch", ["下次雨后再比较。", "它的方向可能会变。"], { rationality: 0.58, comfortSeeking: 0.36 }, 19)],
    outcomes: { rareGood: ["藤墙后保存着一把藤切刀，也露出通往树冠的完整旧木梯。"], good: ["你找到了不会伤到活枝的通行缝隙，并标出树冠旧路。"], mixed: ["藤蔓暂时没有移动，但你记录了所有主要缠结点。"], bad: ["背包被细藤钩住，你耗费体力才完整退出来。"], rareBad: ["受力旧枝突然落下，你避开后只能封住这段路。"] }
  },
  {
    id: "movingVines", title: "与昨日标记错开的藤结", approach: { x: 55, y: 44 }, prop: { className: "prop-vine-barrier", x: 69, y: 39 }, resolvedPropClass: "is-swaying", luckKey: "generalLuck", risk: 1, rain: true, phase: "旧标记留在空处，藤结却移到了另一棵树",
    reactions: [fogRainforestReaction("compareKnots", "比较新旧藤结", "crouch", ["移动的不是整根藤。", "它在沿着光长。"], { observation: 0.74, rationality: 0.3 }, 19), fogRainforestReaction("markVines", "留下温和标记", "open", ["不用切断也能认出来。", "把木梯方向画下来。"], { preparedness: 0.6, responsibility: 0.38 }, 18), fogRainforestReaction("followNewGap", "跟随新缝隙", "inspect", ["今天开的路在右边。", "它通向更高处。"], { curiosity: 0.68, courage: 0.25 }, 17), fogRainforestReaction("waitForLight", "等雾后光线", "rest", ["它们都朝亮处弯。", "等云薄一点。"], { comfortSeeking: 0.62, rationality: 0.38 }, 19)],
    outcomes: { rareGood: ["变化规律指向一片完整蕨叶，也把树冠木梯重新显露出来。"], good: ["你确认藤蔓会追随雾后光线，下一次也能找到旧路。"], mixed: ["藤结再次轻微改变，但新旧位置足以形成比较。"], bad: ["雾光突然消失，你在相似藤墙间绕了一段路。"], rareBad: ["藤结回弹打落路标，你花了许多时间才找回主径。"] }
  },
  {
    id: "canopyWalkway", title: "缺了两块木板的树冠步道", approach: { x: 53, y: 35 }, prop: { className: "prop-canopy-walkway", x: 69, y: 30 }, resolvedPropClass: "is-revealed", luckKey: "dangerSense", risk: 2, rain: true, tags: ["injury", "fatigue"], phase: "高处步道在雨风里轻轻摇晃",
    reactions: [fogRainforestReaction("testSupports", "检查支撑", "inspect", ["主绳还牢。", "缺板旁的结最松。"], { observation: 0.65, rationality: 0.42 }, 19), fogRainforestReaction("secureWalkway", "加固步道", "open", ["先拉一条安全线。", "每次只过一段。"], { preparedness: 0.74, responsibility: 0.3 }, 18), fogRainforestReaction("crossQuickly", "快速跨过缺口", "jump", ["抓住上面的藤。", "不要往下看。"], { courage: 0.72, preparedness: 0.3 }, 16), fogRainforestReaction("observeFromBranch", "从侧枝观察", "crouch", ["高处能看见调查站屋顶。", "先确认另一端。"], { responsibility: 0.55, observation: 0.45 }, 19)],
    outcomes: { rareGood: ["步道另一端挂着一件完整雨披，高处也显出调查区屋顶。"], good: ["你安全通过缺口，并留下返程仍能使用的固定点。"], mixed: ["步道没有继续恶化，但这次只能到达中段观察台。"], bad: ["木板突然下沉，你抓住主绳才退回稳固枝干。"], rareBad: ["旧结在脚下松开，你重重撞上护栏并立刻结束高处探索。"] }
  },
  {
    id: "canopyOrchids", title: "只在雨停时张开的兰花", approach: { x: 59, y: 31 }, prop: { className: "prop-orchid", x: 72, y: 27 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 0, atmosphere: "dim", phase: "树冠兰花在短暂天光里缓慢展开",
    reactions: [fogRainforestReaction("watchOpening", "等待花瓣展开", "rest", ["再等一小会儿。", "光线正在移过来。"], { comfortSeeking: 0.72, observation: 0.32 }, 19), fogRainforestReaction("protectSample", "遮雨记录样本", "open", ["别让新雨打到叶脉。", "只收自然落下的部分。"], { responsibility: 0.66, preparedness: 0.34 }, 18), fogRainforestReaction("compareSpores", "比较微光孢子", "inspect", ["颜色和低处那瓶不同。", "它在花瓣内侧发亮。"], { curiosity: 0.62, rationality: 0.36 }, 18), fogRainforestReaction("photographPattern", "记下开合顺序", "crouch", ["外圈先开。", "它在回应雨滴间隔。"], { observation: 0.7, curiosity: 0.3 }, 19)],
    outcomes: { rareGood: ["一片完整蕨叶落进干燥枝杈，你制成了没有损伤植物的压叶标本。"], good: ["花瓣合拢前落下少量微光孢子，样本仍保持活性。"], mixed: ["兰花只展开一半，但开合顺序被完整记录。"], bad: ["新雨提前落下，花瓣很快闭合。"], rareBad: ["强风晃动步道，你只能放弃观察并退回低处。"] }
  },
  {
    id: "researchStation", title: "被藤蔓包住的调查站", approach: { x: 39, y: 45 }, prop: { className: "prop-station-console", x: 26, y: 41 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 1, rain: true, phase: "机械门扣还露在垂落藤蔓外",
    reactions: [fogRainforestReaction("readStationSign", "辨认褪色标牌", "inspect", ["编号和河边箱子一致。", "这里负责植物调查。"], { observation: 0.68, rationality: 0.36 }, 19), fogRainforestReaction("enterStation", "处理调查站门扣", "open", ["通行牌的宽度正合适。", "门轴先松外侧。"], { preparedness: 0.72, curiosity: 0.28 }, 18), fogRainforestReaction("clearDrain", "清理屋檐排水", "pull", ["先别让雨继续灌进去。", "这条沟还能通。"], { responsibility: 0.68, preparedness: 0.28 }, 18), fogRainforestReaction("callInside", "向室内喊话", "call", ["里面有人吗？", "我只是来避雨。"], { sociability: 0.64, courage: 0.3 }, 18)],
    outcomes: { rareGood: ["调查站内找到仍可使用的通行牌，干燥墙面也标出了另一入口。"], good: ["你打开一处器材柜，整理出旧工具并确认调查区位置。"], mixed: ["门没有打开，但屋檐下的编号足以确认设施用途。"], bad: ["门轴突然下沉，你及时停手才没有让雨水灌入。"], rareBad: ["屋顶积水倾泻而下，你受惊退开并丢失不少体力。"] }
  },
  {
    id: "weatherConsole", title: "仍在跳动的天气终端", approach: { x: 34, y: 42 }, prop: { className: "prop-station-console", x: 24, y: 45 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 1, atmosphere: "dim", phase: "终端反复显示同一段雨量记录",
    reactions: [fogRainforestReaction("copyReadings", "抄下雨量", "crouch", ["日期跳过了一天。", "湿度曲线没有归零。"], { observation: 0.72, rationality: 0.36 }, 19), fogRainforestReaction("restoreConsole", "恢复终端接口", "open", ["接口只是锈住。", "先保存现有画面。"], { preparedness: 0.7, rationality: 0.34 }, 18), fogRainforestReaction("traceCable", "沿线缆查看", "inspect", ["它通向林子里的信标。", "备用电源还在。"], { curiosity: 0.6, observation: 0.4 }, 18), fogRainforestReaction("waitForCycle", "等下一次刷新", "rest", ["它每隔三分钟重播。", "看看最后一帧。"], { comfortSeeking: 0.7, rationality: 0.3 }, 19)],
    outcomes: { rareGood: ["终端恢复完整读数，并弹出一件存放在设备柜里的苔纹雨披。"], good: ["你确认异常雨量来自更深处的监测点，并保存了设施编号。"], mixed: ["终端仍不断重播，但最后一帧的坐标被抄了下来。"], bad: ["潮湿接口冒出火花，你立即断开电源。"], rareBad: ["终端重启后清空当前画面，你只能保住已经抄下的几行。"] }
  },
  {
    id: "fieldNotebook", title: "粘在一起的调查笔记", approach: { x: 38, y: 48 }, prop: { className: "prop-field-notebook", x: 27, y: 51 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 0, phase: "受潮纸页间仍夹着完整植物样本",
    reactions: [fogRainforestReaction("readEdges", "先读纸页边缘", "crouch", ["页码还连续。", "最后几行没有完全晕开。"], { observation: 0.72, comfortSeeking: 0.3 }, 19), fogRainforestReaction("dryPages", "温和干燥纸页", "lantern", ["不能让热源靠太近。", "先从封面内侧开始。"], { preparedness: 0.64, responsibility: 0.4 }, 18), fogRainforestReaction("catalogSample", "整理夹页标本", "open", ["叶片还能保存。", "编号和发光植物相同。"], { responsibility: 0.6, rationality: 0.38 }, 18), fogRainforestReaction("compareConsole", "对照终端编号", "inspect", ["缺掉的日期就在这里。", "它记录了同一场雨。"], { rationality: 0.66, observation: 0.34 }, 19)],
    outcomes: { rareGood: ["笔记和夹页标本都被完整保存，最后一页还写着补给信标位置。"], good: ["你读出发光植物的采样编号，并收下一小瓶旧孢子。"], mixed: ["大部分字迹仍模糊，但页码和日期足以继续核对。"], bad: ["一页边角碎裂，你停手避免损坏更多内容。"], rareBad: ["突来的水滴打湿已展开纸页，你只能先封存整本笔记。"] }
  },
  {
    id: "lostSupplyBeacon", title: "根系下微弱闪烁的信标", approach: { x: 42, y: 53 }, prop: { className: "prop-water-debris", x: 31, y: 56 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 1, rain: true, phase: "橙色指示灯隔着泥水每隔一阵闪烁",
    reactions: [fogRainforestReaction("countFlashes", "记录闪烁节奏", "inspect", ["两短一长。", "它在回应调查站。"], { observation: 0.7, rationality: 0.36 }, 19), fogRainforestReaction("recoverBeacon", "从根系下取出", "pull", ["先固定上面的树根。", "线缆不能硬扯。"], { preparedness: 0.68, responsibility: 0.34 }, 18), fogRainforestReaction("followCable", "沿埋线追踪", "crouch", ["线缆朝高处去了。", "补给点就在附近。"], { curiosity: 0.62, observation: 0.38 }, 18), fogRainforestReaction("answerLight", "用提灯回应", "lantern", ["按同样节奏照回去。", "看看调查站有没有反应。"], { preparedness: 0.5, sociability: 0.42 }, 18)],
    outcomes: { rareGood: ["信标旁的防水袋里保存着一件苔纹雨披和完整补给清单。"], good: ["你取回一瓶驱虫叶露，也确认信标属于上游调查站。"], mixed: ["信标没有被取出，但埋线方向和闪烁节奏都被记录。"], bad: ["根系突然下沉，你只能放弃拉动并退到稳固地面。"], rareBad: ["信标短路熄灭，你耗费体力才保住埋线位置。"] }
  },
  {
    id: "frogChorus", title: "随水位改变节奏的蛙鸣", approach: { x: 46, y: 61 }, prop: { className: "prop-frog", x: 61, y: 58 }, resolvedPropClass: "is-retreating", luckKey: "socialLuck", risk: 0, rain: true, phase: "蛙鸣从河岸两侧依次响起",
    reactions: [fogRainforestReaction("listenPattern", "安静听节奏", "rest", ["左岸先开始。", "水涨时会少一拍。"], { observation: 0.66, comfortSeeking: 0.38 }, 19), fogRainforestReaction("answerCall", "轻声模仿回应", "call", ["别太大声。", "看看哪一边会接上。"], { sociability: 0.64, curiosity: 0.34 }, 18), fogRainforestReaction("offerFish", "用鱼引开蛙群", "open", ["把鱼留在干石上。", "别靠近产卵的水边。"], { responsibility: 0.62, preparedness: 0.32 }, 18), fogRainforestReaction("checkWaterline", "对照水线", "crouch", ["叫声变化就在这条刻度。", "它们比终端更早知道涨水。"], { rationality: 0.6, observation: 0.4 }, 19)],
    outcomes: { rareGood: ["蛙群移开后露出一小瓶微光孢子，封口仍然完整。"], good: ["你把蛙鸣变化与水位对应起来，找到安全离岸时间。"], mixed: ["节奏只变化一次，但足以留下下一场雨可比较的记录。"], bad: ["你的动静让蛙群同时安静，观察只能提前结束。"], rareBad: ["上游水声突然变大，你立即离开低洼河岸。"] }
  },
  {
    id: "symbolStone", title: "反复出现的三叶石纹", approach: { x: 56, y: 46 }, prop: { className: "prop-symbol-stone", x: 70, y: 44 }, resolvedPropClass: "is-revealed", luckKey: "generalLuck", risk: 1, atmosphere: "dim", phase: "雨水流过石面，显出三片相连叶形",
    reactions: [fogRainforestReaction("copySymbol", "拓下石纹", "crouch", ["线条不像自然裂缝。", "调查站标牌上也有一部分。"], { observation: 0.72, rationality: 0.32 }, 19), fogRainforestReaction("compareCharm", "用护符对照", "lantern", ["纹路宽度刚好一样。", "它们为什么会重合？"], { curiosity: 0.62, preparedness: 0.38 }, 18), fogRainforestReaction("washSurface", "沿水痕清理", "inspect", ["只清掉松泥。", "下面还有旧刻度。"], { responsibility: 0.62, observation: 0.36 }, 18), fogRainforestReaction("leaveUntouched", "保持原样观察", "rest", ["等雨把图案完整显出来。", "别先决定它是什么。"], { comfortSeeking: 0.68, rationality: 0.32 }, 19)],
    outcomes: { rareGood: ["石纹中心残留少量微光孢子，图案却与任何已记录植物都不一致。"], good: ["你完整拓下三叶符号，并确认调查站旧标牌也使用了相同边线。"], mixed: ["石纹随雨水出现又消失，只留下足够继续比较的轮廓。"], bad: ["水流很快混浊，你没有看清图案中心。"], rareBad: ["附近石面同时显出相反方向的纹路，你无法判断哪一个才是原记号。"] }
  },
  {
    id: "wrongMemoryPlot", title: "像是曾经扎过营的空地", approach: { x: 49, y: 42 }, prop: { className: "prop-symbol-stone", x: 64, y: 39 }, resolvedPropClass: "is-revealed", luckKey: "dangerSense", risk: 1, atmosphere: "dim", phase: "空地摆放痕迹与你熟悉的营地异常相似",
    reactions: [fogRainforestReaction("inspectMarks", "检查摆放痕迹", "crouch", ["火堆位置太熟悉了。", "绑绳方向也一样。"], { observation: 0.72, rationality: 0.34 }, 19), fogRainforestReaction("checkCompass", "确认方向记录", "inspect", ["我没有走回原路。", "地图上不该有这块空地。"], { preparedness: 0.62, rationality: 0.4 }, 18), fogRainforestReaction("callOut", "向雾里喊话", "call", ["有人刚离开吗？", "这里是谁的营地？"], { sociability: 0.6, courage: 0.34 }, 18), fogRainforestReaction("leaveQuietly", "安静绕开", "rest", ["先不要动这里的东西。", "熟悉不等于安全。"], { responsibility: 0.58, comfortSeeking: 0.4 }, 19)],
    outcomes: { rareGood: ["你确认空地不是自己的旧营地，却找到一行仿佛熟悉笔迹留下的雨量数字。"], good: ["方向记录证明路线没有绕圈，空地的相似布局被完整记下。"], mixed: ["熟悉感没有答案，但所有物件都保持原样。"], bad: ["雾里传来与你步调一致的动静，你提前离开空地。"], rareBad: ["返身时摆放痕迹像少了一件物品，你无法确认是记错还是发生了变化。"] }
  }
];

const FOG_RAINFOREST_LOCAL_STATE_DEFAULTS = {
  trailSaturation: 0,
  vineRouteState: 0,
  stationResearchStage: 0,
  insectPressure: 0,
  wetlandKnowledge: 0,
  luminousPlantStudies: 0,
  recurringEncounters: {}
};

function clampFogRainforestStateValue(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Math.floor(Number(value) || 0)));
}

function sanitizeFogRainforestLocalState(source) {
  const current = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const recurringSource = current.recurringEncounters && typeof current.recurringEncounters === "object" && !Array.isArray(current.recurringEncounters) ? current.recurringEncounters : {};
  const knownIds = FOG_RAINFOREST_EVENTS.reduce(function(ids, eventDefinition) { ids[eventDefinition.id] = true; return ids; }, {});
  const recurringEncounters = Object.keys(recurringSource).reduce(function(counts, eventId) {
    if (knownIds[eventId]) counts[eventId] = clampFogRainforestStateValue(recurringSource[eventId], 0, 99);
    return counts;
  }, {});
  return Object.assign({}, current, {
    trailSaturation: clampFogRainforestStateValue(current.trailSaturation, 0, 3),
    vineRouteState: clampFogRainforestStateValue(current.vineRouteState, 0, 3),
    stationResearchStage: clampFogRainforestStateValue(current.stationResearchStage, 0, 4),
    insectPressure: clampFogRainforestStateValue(current.insectPressure, -2, 3),
    wetlandKnowledge: clampFogRainforestStateValue(current.wetlandKnowledge, 0, 4),
    luminousPlantStudies: clampFogRainforestStateValue(current.luminousPlantStudies, 0, 4),
    recurringEncounters: recurringEncounters
  });
}

function applyFogRainforestTripLocalState(source, trip) {
  const state = sanitizeFogRainforestLocalState(source);
  const flags = trip && trip.eventFlags ? trip.eventFlags : {};
  const eventIds = trip && Array.isArray(trip.events) ? trip.events.map(function(entry) { return entry.eventId; }) : [];
  eventIds.forEach(function(eventId) {
    state.recurringEncounters[eventId] = clampFogRainforestStateValue((state.recurringEncounters[eventId] || 0) + 1, 0, 99);
  });
  if (eventIds.some(function(id) { return ["muddyCrossing", "flashFloodDebris", "floodedSupplyCrate"].indexOf(id) !== -1; })) {
    state.trailSaturation = clampFogRainforestStateValue(Math.max(state.trailSaturation, Number(flags.rainforestMoisture) || 0), 0, 3);
  }
  if (flags.foundVineBarrier) state.vineRouteState = Math.max(state.vineRouteState, 1);
  if (flags.tracedMovingVines) state.vineRouteState = Math.max(state.vineRouteState, 2);
  if (flags.foundCanopySteps || flags.crossedCanopy) state.vineRouteState = 3;
  if (flags.foundStation) state.stationResearchStage = Math.max(state.stationResearchStage, 1);
  if (flags.restoredConsole) state.stationResearchStage = Math.max(state.stationResearchStage, 2);
  if (flags.readFieldNotebook) state.stationResearchStage = Math.max(state.stationResearchStage, 3);
  if (flags.recoveredStationRecord) state.stationResearchStage = 4;
  if (flags.usedRepellent || flags.avoidedInsects) state.insectPressure -= 1;
  if (flags.stirredInsects || flags.crossedSporeCloud) state.insectPressure += 1;
  if (flags.crossedMudSafely || flags.foundFloodDebris || flags.openedSupplyCrate || flags.readFrogWaterline) state.wetlandKnowledge += 1;
  if (flags.foundLuminousPlants || flags.collectedSpores || flags.studiedOrchids) state.luminousPlantStudies += 1;
  return sanitizeFogRainforestLocalState(state);
}

function applyFogRainforestTripMemories(source, trip) {
  const memories = source && typeof source === "object" ? source : {};
  const flags = trip && trip.eventFlags ? trip.eventFlags : {};
  if (flags.crossedCanopy) memories.canopyCrossings = (Number(memories.canopyCrossings) || 0) + 1;
  if (flags.recoveredStationRecord) memories.stationRecordsRecovered = (Number(memories.stationRecordsRecovered) || 0) + 1;
  if (flags.sawRainforestSymbol || flags.foundWrongMemoryPlot) {
    memories.sharedSymbolEncounters = (Number(memories.sharedSymbolEncounters) || 0) + 1;
  }
  return memories;
}

function getFogRainforestHookContinuation(hookId, sourceState) {
  const state = sanitizeFogRainforestLocalState(sourceState);
  if (hookId === "followChangingVines" && state.vineRouteState > 0 && state.vineRouteState < 3) {
    return { weight: 10, intro: state.vineRouteState === 1 ? "藤墙后已经露出木梯边缘，下一场雨也许会让入口更清楚。" : "藤蔓移动规律已经记下，只差确认它通往哪一段树冠旧路。" };
  }
  if (hookId === "traceStationRecords" && state.stationResearchStage > 0 && state.stationResearchStage < 4) {
    return { weight: 9, intro: "调查站里还有一段没有恢复的记录，现有编号正好能继续向下核对。" };
  }
  if (hookId === "studyLuminousPlants" && state.luminousPlantStudies > 0 && state.luminousPlantStudies < 4) {
    return { weight: 7, intro: "此前记录的发光顺序在雨后又发生变化，树冠样本可能给出新的比较。" };
  }
  if (hookId === "recoverLostSupplies" && state.wetlandKnowledge > 0 && state.wetlandKnowledge < 4) {
    return { weight: 7, intro: "之前标出的水线仍指向下游河弯，被冲走的补给可能停在同一片根系附近。" };
  }
  return null;
}

function getFogRainforestChainWeight(eventId, flags) {
  let multiplier = 1;
  if (flags.crossedMudSafely && ["flashFloodDebris", "riverbankTracks"].indexOf(eventId) !== -1) multiplier *= 2.2;
  if (flags.foundFloodDebris && ["floodedSupplyCrate", "lostSupplyBeacon"].indexOf(eventId) !== -1) multiplier *= 2.8;
  if (flags.foundLuminousPlants && ["sporeCloud", "canopyOrchids"].indexOf(eventId) !== -1) multiplier *= 2.45;
  if (flags.crossedSporeCloud && eventId === "canopyOrchids") multiplier *= 2.7;
  if (flags.foundVineBarrier && ["movingVines", "canopyWalkway"].indexOf(eventId) !== -1) multiplier *= 2.5;
  if (flags.tracedMovingVines && eventId === "canopyWalkway") multiplier *= 2.8;
  if (flags.foundStation && ["weatherConsole", "fieldNotebook"].indexOf(eventId) !== -1) multiplier *= 2.6;
  if (flags.restoredConsole && ["fieldNotebook", "lostSupplyBeacon"].indexOf(eventId) !== -1) multiplier *= 2.5;
  if ((Number(flags.rainforestMoisture) || 0) >= 3 && ["flashFloodDebris", "frogChorus", "sporeCloud"].indexOf(eventId) !== -1) multiplier *= 1.65;
  if ((Number(flags.rainforestMoisture) || 0) <= 1 && ["canopyOrchids", "canopyWalkway"].indexOf(eventId) !== -1) multiplier *= 1.35;
  return multiplier;
}

function getFogRainforestStoryContext(eventDefinition, reaction, outcome, trip) {
  const flags = trip.eventFlags || {};
  const state = sanitizeFogRainforestLocalState(trip.mapStateSnapshot);
  const memories = trip && trip.adventureMemorySnapshot && typeof trip.adventureMemorySnapshot === "object"
    ? trip.adventureMemorySnapshot
    : {};
  const moisture = Number.isFinite(Number(flags.rainforestMoisture)) ? Number(flags.rainforestMoisture) : (trip.routeId === "riverWetlands" ? 2 : 1);
  const seenCount = Number(state.recurringEncounters[eventDefinition.id]) || 0;
  const context = { bubble: "", result: "", chainId: "", visualClass: "" };
  if (eventDefinition.id === "flashFloodDebris" && flags.crossedMudSafely) {
    context.bubble = "刚才水线上的绑带，就是从这些漂流物里扯下来的。";
    context.result = "泥地水线和漂流方向互相印证，被冲走的补给就在下游河弯。";
    context.chainId = "wetlandSupplies";
  } else if (eventDefinition.id === "floodedSupplyCrate" && flags.foundFloodDebris) {
    context.bubble = "箱侧编号和上游那截绑带完全一样。";
    context.result = outcome.itemSolution ? outcome.text + " 漂流物上的编号也确认了它来自调查站。" : "你确认这就是洪水带走的调查箱，但箱扣仍需要合适准备。";
    context.chainId = "wetlandSupplies";
  } else if (eventDefinition.id === "sporeCloud" && flags.foundLuminousPlants) {
    context.bubble = "这些孢子就是从刚才那片发光叶层飘来的。";
    context.result = "叶片光序与孢子扩散方向相连，你找到通往高处样本区的上风路径。";
    context.chainId = "luminousPlants";
  } else if (eventDefinition.id === "canopyOrchids" && (flags.foundLuminousPlants || flags.crossedSporeCloud)) {
    context.bubble = "花瓣里的微光和低处孢子是同一种颜色。";
    context.result = "低处叶片、孢子云与树冠兰花形成一条完整的雨后开合记录。";
    context.chainId = "luminousPlants";
  } else if (eventDefinition.id === "movingVines" && flags.foundVineBarrier) {
    context.bubble = "这就是刚才挡路的那一组藤，它真的换了支点。";
    context.result = "前后两处藤结位置显示它们沿雾后光线移动，旧木梯不再只是偶然露出。";
    context.chainId = "changingVines";
  } else if (eventDefinition.id === "canopyWalkway" && flags.tracedMovingVines) {
    context.bubble = "藤蔓变化标出的方向，正好通到这段步道。";
    context.result = "改变位置的藤蔓最终把你带到树冠旧路，路线线索连成了完整一段。";
    context.chainId = "changingVines";
  } else if (eventDefinition.id === "weatherConsole" && flags.foundStation) {
    context.bubble = "入口编号就在终端启动画面上。";
    context.result = "调查站位置与终端记录对应起来，缺失数据指向林中的补给信标。";
    context.chainId = "stationRecords";
  } else if (eventDefinition.id === "fieldNotebook" && flags.restoredConsole) {
    context.bubble = "终端跳过的日期，正好夹在这几页之间。";
    context.result = "天气终端与调查笔记补上了彼此缺失的日期，但最后一条回传仍没有来源。";
    context.chainId = "stationRecords";
  } else if (eventDefinition.id === "lostSupplyBeacon" && (flags.restoredConsole || flags.readFieldNotebook)) {
    context.bubble = "记录里的回传节奏，就是根系下这盏灯。";
    context.result = "调查记录最终指向遗失信标，设施与漂流补给也有了共同出处。";
    context.chainId = "stationRecords";
  } else if (seenCount > 0 && eventDefinition.id === "movingVines") {
    context.bubble = "上次的浅标记还在空处，藤结又往亮处挪了一段。";
    context.result = "这次变化与旧记录一致，藤蔓确实在多次降雨之间缓慢改道。";
    context.chainId = "rememberedVines";
  } else if (seenCount > 0 && eventDefinition.id === "weatherConsole") {
    context.bubble = "终端又停在同一个缺失日期，但雨量数字变了。";
    context.result = "重复出现的终端画面保留着新的读数，旧记录并没有简单重播。";
    context.chainId = "rememberedStation";
  }
  if (!context.chainId && eventDefinition.id === "canopyWalkway" && Number(memories.seriousFalls) > 0) {
    context.bubble = "上次在深山高处吃过亏，先确认主绳和退路，再碰缺板。";
    context.result = "深山留下的高处经验让你把每个固定点都检查了一遍，步道的晃动没有再催促你冒险。";
    context.chainId = "crossMapFallMemory";
    if (["bad", "rareBad"].indexOf(outcome.tier) !== -1) outcome.tier = "mixed";
  } else if (!context.chainId && eventDefinition.id === "lostSupplyBeacon" && Number(memories.rescuedSomeone) > 0) {
    context.bubble = "这种间歇信号很像深山里的求救回应，先保住位置，再判断是谁留下的。";
    context.result = "过去的救援经历让你先固定根系和信标，没有把一段可能仍有用的回应扯断。";
    context.chainId = "crossMapRescueMemory";
  } else if (!context.chainId && ["symbolStone", "wrongMemoryPlot"].indexOf(eventDefinition.id) !== -1 && Number(memories.supernaturalEncounters) > 0) {
    context.bubble = "深山里也有过这种熟悉得不合理的停顿，先把细节原样记下。";
    context.result = "你没有急着给异常取名，只把它与深山经历并排记录；两者之间仍只是一种无法确认的相似。";
    context.chainId = "crossMapAnomalyMemory";
  } else if (!context.chainId && eventDefinition.id === "frogChorus" && Number(memories.animalTrust) > 0) {
    context.bubble = "像在深山观察动物那样留出距离，它们会自己恢复节奏。";
    context.result = "你保持熟悉的观察距离，蛙鸣很快重新接续，也显出水位变化的规律。";
    context.chainId = "crossMapAnimalMemory";
  }
  if (!context.chainId && moisture >= 3 && ["flashFloodDebris", "floodedSupplyCrate", "frogChorus"].indexOf(eventDefinition.id) !== -1) {
    context.bubble = "这趟雨水一直没有退，水线比进来时又高了一点。";
    context.result = "持续潮湿改变了河岸落脚点，也让新的漂流痕迹更容易辨认。";
    context.chainId = "rainforestMoisture";
  } else if (!context.chainId && moisture <= 1 && ["luminousPlants", "canopyOrchids"].indexOf(eventDefinition.id) !== -1) {
    context.bubble = "叶面水滴变少了，微光轮廓反而更清楚。";
    context.result = "较干的短暂间隙让植物纹路完整显现，观察没有被新雨打断。";
    context.chainId = "rainforestMoisture";
  }
  return context;
}

function updateFogRainforestEventFlags(eventDefinition, reaction, outcome, storyContext, trip) {
  const flags = trip.eventFlags;
  const favorable = ["good", "rareGood"].indexOf(outcome.tier) !== -1;
  const itemSolved = Boolean(outcome.itemSolution);
  let moisture = Number.isFinite(Number(flags.rainforestMoisture)) ? Number(flags.rainforestMoisture) : (trip.routeId === "riverWetlands" ? 2 : 1);
  if (eventDefinition.rain || ["muddyCrossing", "flashFloodDebris", "sporeCloud"].indexOf(eventDefinition.id) !== -1) moisture += 1;
  if (["canopyWalkway", "canopyOrchids", "researchStation", "weatherConsole"].indexOf(eventDefinition.id) !== -1 && !eventDefinition.rain) moisture -= 1;
  flags.rainforestMoisture = Math.min(5, Math.max(0, moisture));
  if (eventDefinition.id === "muddyCrossing") flags.crossedMudSafely = favorable || itemSolved;
  else if (eventDefinition.id === "riverbankTracks") flags.readRiverbankTracks = favorable || itemSolved;
  else if (eventDefinition.id === "flashFloodDebris") flags.foundFloodDebris = true;
  else if (eventDefinition.id === "floodedSupplyCrate") { flags.foundSupplyCrate = true; flags.openedSupplyCrate = favorable || itemSolved; if (flags.openedSupplyCrate) flags.recoveredRainforestSupplies = true; }
  else if (eventDefinition.id === "luminousPlants") { flags.foundLuminousPlants = true; flags.followedGlowPattern = reaction.id === "followGlow" && favorable; flags.collectedSpores = itemSolved || favorable; }
  else if (eventDefinition.id === "sporeCloud") flags.crossedSporeCloud = favorable || itemSolved;
  else if (eventDefinition.id === "insectSwarm") { flags.usedRepellent = itemSolved; flags.avoidedInsects = favorable || itemSolved; flags.stirredInsects = !flags.avoidedInsects; }
  else if (eventDefinition.id === "vineBarricade") flags.foundVineBarrier = true;
  else if (eventDefinition.id === "movingVines") flags.tracedMovingVines = favorable || itemSolved;
  else if (eventDefinition.id === "canopyWalkway") { flags.foundCanopySteps = true; flags.crossedCanopy = favorable || itemSolved; }
  else if (eventDefinition.id === "canopyOrchids") flags.studiedOrchids = favorable || itemSolved;
  else if (eventDefinition.id === "researchStation") flags.foundStation = true;
  else if (eventDefinition.id === "weatherConsole") flags.restoredConsole = favorable || itemSolved;
  else if (eventDefinition.id === "fieldNotebook") { flags.readFieldNotebook = favorable || itemSolved; if (flags.restoredConsole && flags.readFieldNotebook) flags.recoveredStationRecord = true; }
  else if (eventDefinition.id === "lostSupplyBeacon") { flags.foundSupplyBeacon = true; if (favorable || itemSolved) flags.recoveredRainforestSupplies = true; }
  else if (eventDefinition.id === "frogChorus") flags.readFrogWaterline = favorable || itemSolved;
  else if (eventDefinition.id === "symbolStone") flags.sawRainforestSymbol = true;
  else if (eventDefinition.id === "wrongMemoryPlot") flags.foundWrongMemoryPlot = true;
}

function createFogRainforestHookEnding(trip, hookResult) {
  const hook = trip.adventureHook || {};
  const flags = trip.eventFlags || {};
  if (hookResult.status === "diverted") return "没有沿着“" + hook.title + "”继续下去，不过雨林途中出现了别的发现。";
  if (hookResult.status === "noResult") return "这次没有找到与“" + hook.title + "”直接相连的痕迹，雨声仍盖住了更深处的线索。";
  if (hookResult.status === "continuing") return "与“" + hook.title + "”有关的痕迹已经多了一段，这件事还会继续留在心上。";
  if (hook.id === "followChangingVines" && flags.crossedCanopy) return "变化的藤蔓最终指向树冠旧路，你确认它们并不是毫无规律地生长。";
  if (hook.id === "traceStationRecords" && flags.recoveredStationRecord) return "终端、笔记与信标补上了彼此缺失的记录，却仍有一段回传没有来源。";
  if (hook.id === "studyLuminousPlants" && flags.studiedOrchids) return "低处叶片、孢子云与树冠兰花形成了完整的雨后发光记录。";
  if (hook.id === "recoverLostSupplies" && flags.recoveredRainforestSupplies) return "水线、漂流绑带与调查箱彼此对应，被冲散的补给终于找到一部分。";
  return "这次沿着“" + hook.title + "”有所发现，但雨林仍保留着下一次才能看清的部分。";
}

const FOG_RAINFOREST_PARTICIPANT_OBSERVATIONS = {
  wrongMemoryPlot: [
    { traitId: "observation", min: 65, text: "{name}发现地面压痕比这场雨更早，摆放方式相似却并非刚刚留下。" },
    { traitId: "sociability", min: 65, text: "{name}向雾里问话时听见了半句重叠回应，字音无法分清。" },
    { memoryKey: "supernaturalEncounters", min: 1, text: "{name}认得这种不合时宜的熟悉感，仍把它记作未确认观察。" }
  ],
  symbolStone: [
    { traitId: "observation", min: 65, text: "{name}注意到三叶石纹下还有一道方向相反的浅线。" },
    { traitId: "rationality", min: 65, text: "{name}确认图案与调查站边线比例接近，但材质和年代无法对应。" }
  ],
  lostSupplyBeacon: [
    { traitId: "sociability", min: 65, text: "{name}听出闪烁间隔像等待回应，而不是普通低电量警告。" },
    { traitId: "preparedness", min: 65, text: "{name}先固定埋线与树根，避免队友拉动时扯断信标。" }
  ]
};

const FOG_RAINFOREST_SCENE = {
  background: "assets/adventure/fog-rainforest/fog-rainforest-background.png",
  foreground: "assets/adventure/fog-rainforest/foreground.png",
  eventPropSheet: "assets/adventure/fog-rainforest/event-props.png",
  itemSheet: "assets/adventure/deep-mountain/adventure-items.png",
  pathPoints: [{ x: 45, y: 82 }, { x: 36, y: 72 }, { x: 52, y: 64 }, { x: 43, y: 56 }, { x: 57, y: 48 }, { x: 48, y: 40 }],
  propSheetPositions: FOG_RAINFOREST_PROP_SHEET_POSITIONS
};

const FOG_RAINFOREST_ADVENTURE_MAP = {
  id: "fogRainforest",
  name: "雾雨林",
  status: "ready",
  selection: {
    eyebrow: "FOG RAINFOREST",
    description: "持续雨声覆盖河岸、藤蔓旧路与一座废弃植物调查站。",
    unlockHint: "拼出受潮的调查路线图后开放。",
    image: "assets/adventure/fog-rainforest/fog-rainforest-background.png",
    className: "map-fog-rainforest"
  },
  scene: FOG_RAINFOREST_SCENE,
  routes: FOG_RAINFOREST_ROUTES,
  adventureHooks: FOG_RAINFOREST_HOOKS,
  events: FOG_RAINFOREST_EVENTS,
  itemPool: ["vineCutter", "insectRepellent", "luminousSpore", "pressedFernSpecimen", "stationPass", "rainCape"],
  localStateDefaults: FOG_RAINFOREST_LOCAL_STATE_DEFAULTS,
  sanitizeLocalState: sanitizeFogRainforestLocalState,
  applyTripLocalState: applyFogRainforestTripLocalState,
  applyTripMemories: applyFogRainforestTripMemories,
  getHookContinuation: getFogRainforestHookContinuation,
  getChainWeight: getFogRainforestChainWeight,
  getStoryContext: getFogRainforestStoryContext,
  participantObservations: FOG_RAINFOREST_PARTICIPANT_OBSERVATIONS,
  updateEventFlags: updateFogRainforestEventFlags,
  createHookEnding: createFogRainforestHookEnding,
  isUnlockEligible: function(progress) {
    const keyClues = progress && Array.isArray(progress.keyClues) ? progress.keyClues : [];
    return keyClues.indexOf("dampSurveyRouteMap") !== -1;
  },
  locations: FOG_RAINFOREST_LOCATIONS,
  reactionItemRequirements: FOG_RAINFOREST_REACTION_ITEM_REQUIREMENTS,
  itemSolutionEffects: FOG_RAINFOREST_ITEM_SOLUTION_EFFECTS,
  missingItemFeedback: FOG_RAINFOREST_MISSING_ITEM_FEEDBACK,
  eventConsequences: FOG_RAINFOREST_EVENT_CONSEQUENCES,
  defaultHookId: "recoverLostSupplies",
  defaultRouteId: "riverWetlands"
};
