// Deep-mountain map configuration for the adventure prototype.

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
    resultByRequirement: {
      rainCape: "从雾雨林带回的雨披罩住背包和肩头，暴雨沿苔纹边缘滑落，没有浸湿任何物资。",
      ropeKit: "绳组迅速固定住防雨布，暴雨从两侧流过，背包和衣物都保持干燥。"
    },
    logByRequirement: {
      rainCape: "你用苔纹雨披护住自己和背包，避开了深山暴雨造成的损失。",
      ropeKit: "你用攀登绳组搭起遮蔽，避开了暴雨造成的损失。"
    },
    visualClass: "solution-shelter",
    requirementPriority: ["rainCape", "ropeKit"],
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
  },
  "morningFogPockets:readTrailMap": {
    result: "地图上的溪湾与雾中水声重合，你沿着不被晨雾遮住的缓坡继续前进。",
    log: "手绘山路图帮助你辨认晨雾中的溪谷轮廓。",
    visualClass: "solution-map",
    stamina: 2
  },
  "morningFogPockets:signalLantern": {
    result: "提灯在低雾里照出连续露珠，反光正好勾出一条没有积水的路。",
    log: "山行提灯照出了晨雾里的安全落脚点。",
    visualClass: "solution-lantern",
    stamina: 1
  },
  "ridgeWindGust:securePack": {
    result: "绳组绕过背包和岩钉，迎风处的装备很快全部固定稳妥。",
    log: "攀登绳组固定了山脊上的背包与松动物件。",
    visualClass: "solution-reinforced",
    stamina: 2
  },
  "fallenTrailMarker:repairMarker": {
    result: "工具重新锁紧歪斜支架，旧路标终于指回正确的山脊方向。",
    log: "旧工具套组修复了倒下的护林路标。",
    visualClass: "solution-repaired",
    stamina: 2
  },
  "fallenTrailMarker:compareMap": {
    result: "路标背面的刻痕与地图边注吻合，你确认它原本指向旧瞭望塔。",
    log: "手绘山路图确认了旧路标的原始方向。",
    visualClass: "solution-map",
    stamina: 1
  },
  "rangerNotebook:lightLantern": {
    result: "斜照的灯光让被水浸过的压痕重新显现，缺失的巡查日期也能辨认了。",
    log: "山行提灯照出了护林笔记纸页上的旧压痕。",
    visualClass: "solution-lantern",
    stamina: 1
  },
  "rangerNotebook:showRangerToken": {
    result: "木章纹路与笔记封面的印记完全一致，几处简写地点终于有了含义。",
    log: "护林员木章帮助你读懂了巡查笔记中的地点简写。",
    visualClass: "solution-token",
    stamina: 1
  },
  "snaredAnimal:cutSnare": {
    resultByRequirement: {
      vineCutter: "藤切刀的弯钩托住细线后轻轻割开套索，受困动物没有被刀刃碰到。",
      repairToolkit: "工具剪开生锈细线，受困动物很快挣脱，并从安全距离回头看了你一眼。"
    },
    logByRequirement: {
      vineCutter: "你用从雾雨林带回的藤切刀安全割开了废弃套索。",
      repairToolkit: "旧工具套组安全拆除了废弃套索。"
    },
    visualClass: "solution-tool",
    requirementPriority: ["vineCutter", "repairToolkit"],
    stamina: 2
  },
  "snaredAnimal:offerFish": {
    result: "鱼的气味让动物安静下来，你得以慢慢松开缠住它的细线。",
    log: "你用鱼安抚受困动物并帮它脱离套索。",
    visualClass: "solution-fish",
    consumeRequirements: ["category:fish"],
    stamina: 1
  },
  "mushroomRing:showCharm": {
    result: "护符亮起时，菌环中的微光依次熄灭，只在中央留下一个指向林间的空缺。",
    log: "林间护符回应了发光菌环，但没有解释那段空缺从何而来。",
    visualClass: "solution-charm",
    stamina: 1
  },
  "mushroomRing:raiseLantern": {
    result: "稳定灯光照清了菌环边缘，你确认发亮的是附着在枯木上的细小孢子。",
    log: "山行提灯帮助你安全观察发光菌环。",
    visualClass: "solution-lantern",
    stamina: 1
  },
  "washedOutCache:openCache": {
    resultByRequirement: {
      oldKey: "山纹旧钥匙转开积沙锁芯，补给箱里的纸包仍保持完整。",
      repairToolkit: "工具撬开变形箱扣，虽然进了些水，里面仍有可用补给。"
    },
    logByRequirement: {
      oldKey: "你用山纹旧钥匙完整打开了被溪水冲出的补给箱。",
      repairToolkit: "你用旧工具套组撬开了变形的补给箱。"
    },
    visualClass: "solution-unlocked",
    requirementPriority: ["oldKey", "repairToolkit"],
    consumeRequirements: ["oldKey"],
    forcedTierByRequirement: { oldKey: "rareGood", repairToolkit: "good" },
    staminaByRequirement: { repairToolkit: -1 }
  },
  "oldWaterGauge:repairGauge": {
    result: "工具松开锈住的浮标，刻度重新停在当前水位，也露出了背面的设施编号。",
    log: "旧工具套组让废弃水位尺恢复了读数。",
    visualClass: "solution-repaired",
    stamina: 2
  },
  "oldWaterGauge:checkCompass": {
    result: "指南针在刻度旁短暂偏转，指出一处被溪水掩住的金属补给箱。",
    log: "银色指南针在旧水位尺旁指出了异常方位。",
    visualClass: "solution-direction",
    stamina: 1
  },
  "watchtowerSignal:answerSignal": {
    result: "你用提灯按同样节奏回应，高处的微光随后指向一段仍可通行的旧台阶。",
    log: "山行提灯回应了旧瞭望塔方向的信号。",
    visualClass: "solution-lantern",
    stamina: 2
  },
  "watchtowerSignal:showRangerToken": {
    result: "木章上的反光纹路与远处信号节奏一致，你辨认出一组护林员通行标记。",
    log: "护林员木章帮助你确认了旧瞭望塔的通行信号。",
    visualClass: "solution-token",
    stamina: 1
  },
  "nightCampEcho:showCharm": {
    result: "护符在第三次回声前微微发亮，林间声音随即少了一拍，像有什么改变了重复方式。",
    log: "林间护符让夜间回声出现了一次无法解释的停顿。",
    visualClass: "solution-charm",
    stamina: 1
  },
  "nightCampEcho:eatMeal": {
    result: "热食让你安静下来；再听时，回声只是溪谷与树干之间普通的反弹。",
    log: "你在夜间休息时吃下一份料理，恢复精神并重新判断声音。",
    visualClass: "solution-meal",
    consumeRequirements: ["category:meal"],
    stamina: 8
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
  lostBeforeDark: { bubble: "这些路口都一样……手边没有可靠的方向线索。", result: "你缺少合适的辨路装备，只能先停在安全位置。" },
  morningFogPockets: { bubble: "雾把溪湾全遮住了……手边没有可靠参照。", result: "晨雾没有散开，你只能沿清楚的岸边慢慢折返。" },
  ridgeWindGust: { bubble: "风要把东西卷走了……没有合适的固定装备。", result: "你抱紧背包退到背风处，没能继续走上暴露山脊。" },
  fallenTrailMarker: { bubble: "路标能扶起来……可惜没带能校正它的东西。", result: "倒下的路标仍指向错误方向，你只记录了它的位置。" },
  rangerNotebook: { bubble: "纸上的压痕还在……现在却看不清。", result: "巡查笔记没有被破坏，但你暂时无法读出褪色记录。" },
  snaredAnimal: { bubble: "细线缠得太紧……不能空手硬拉。", result: "你保持安全距离守了一会儿，却没能在不伤到动物的情况下拆除套索。" },
  mushroomRing: { bubble: "这些光会变化……没有东西能安全确认。", result: "你没有踏进菌环，只从外围记下了微光亮灭的顺序。" },
  washedOutCache: { bubble: "箱扣还能处理……可惜没带合适工具。", result: "溪边补给箱仍然紧闭，你把它移到不会再次被水冲走的位置。" },
  oldWaterGauge: { bubble: "刻度后面有东西……但锈得完全动不了。", result: "旧水位尺没有恢复读数，你只抄下了露在外面的设施编号。" },
  watchtowerSignal: { bubble: "那道光像在等回应……可我没有合适凭证。", result: "远处信号很快熄灭，你没能确认它是否来自旧瞭望塔。" },
  nightCampEcho: { bubble: "回声每次都差一点……手边没有能验证的东西。", result: "夜间回声持续了一阵，最终和普通风声一起消失。" }
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
    presentation: {
      className: "route-creek-valley",
      opening: "你沿着水声进入溪谷，湿泥和低矮灌木把细小痕迹留得很清楚。",
      cameraPosition: "42% 58%",
      prepPosition: "center 58%",
      journalPosition: "center 58%",
      ambientClass: "is-creek-haze",
      journalTitle: "溪谷沿途手记",
      journalCaption: "水声旁留下的发现"
    },
    preparationHint: "潮湿的溪谷适合带上能处理水边物件或照顾体力的准备。",
    unlockAny: ["deepMountain"],
    lockedHint: "先熟悉深山入口附近的水声。",
    staminaCost: 0,
    recommendedItems: ["trailMap", "repairToolkit", "fieldLantern"],
    riskItems: ["trailRation", "firstAidPouch"],
    resourceIds: ["wildMushroom", "wildOnion", "pineNut"],
    recipeIds: ["wildMushroomFishSoup", "pineNutGrilledFish"],
    eventWeights: { streamSparkle: 2.4, animalTracks: 2.1, oldWaterGauge: 2.05, morningFogPockets: 1.9, washedOutCache: 1.7, snaredAnimal: 1.55, missingFood: 1.45, forestFootsteps: 1.3, suddenDownpour: 1.15, mushroomRing: 1.05, nightCampEcho: 0.65, unstableBridge: 0.65, whiteShadow: 0.65, fallenTrailMarker: 0.6, rangerNotebook: 0.55, ridgeWindGust: 0.35, watchtowerSignal: 0.35 }
  },
  denseForest: {
    id: "denseForest",
    name: "密林路线",
    riskLabel: "风险较高 · 异常频繁",
    description: "树影遮住方向，奇怪脚步、白影和隐藏支路更容易出现。",
    presentation: {
      className: "route-dense-forest",
      opening: "你钻进遮光的密林，脚步声很快被树叶吞没，远处的轮廓也变得难以分辨。",
      cameraPosition: "58% 44%",
      prepPosition: "center 38%",
      journalPosition: "center 38%",
      ambientClass: "is-forest-shade",
      journalTitle: "密林异响记录",
      journalCaption: "树影间没有消失的动静"
    },
    preparationHint: "林下光线复杂，照明、辨路或能回应异常的东西也许有帮助。",
    unlockAny: ["deepMountain"],
    lockedHint: "树影后似乎还有一条未被记录的入口。",
    staminaCost: 1,
    recommendedItems: ["fieldLantern", "forestCharm", "trailMap"],
    riskItems: ["trailRation", "firstAidPouch"],
    resourceIds: ["wildMushroom", "wildOnion", "pineNut"],
    recipeIds: ["wildMushroomFishSoup", "pineNutGrilledFish"],
    eventWeights: { forestFootsteps: 2.3, whiteShadow: 2.35, mushroomRing: 2.15, nightCampEcho: 2.05, lostBeforeDark: 1.9, hiddenFork: 1.75, morningFogPockets: 1.5, snaredAnimal: 1.4, animalTracks: 1.2, fallenTrailMarker: 1.05, rangerNotebook: 0.8, distantCry: 0.75, streamSparkle: 0.65, oldWaterGauge: 0.55, washedOutCache: 0.5, ridgeWindGust: 0.45, watchtowerSignal: 0.45 }
  },
  mountainRidge: {
    id: "mountainRidge",
    name: "山脊路线",
    riskLabel: "体力消耗高 · 远景线索多",
    description: "经过吊桥和迎风坡，暴雨、呼救与路线发现更常见。",
    presentation: {
      className: "route-mountain-ridge",
      opening: "你迎着山风登上高处，吊桥和远坡都暴露在变化很快的天气里。",
      cameraPosition: "66% 30%",
      prepPosition: "center 28%",
      journalPosition: "center 28%",
      ambientClass: "is-ridge-wind",
      journalTitle: "山脊风雨纪行",
      journalCaption: "高处风里看见的山路"
    },
    preparationHint: "迎风山脊考验固定、救援与方向判断，但也能看到更远的地方。",
    unlockAny: ["ridgeTrail"],
    lockedHint: "先找到一条能安全登上山脊的隐蔽小路。",
    staminaCost: 3,
    recommendedItems: ["ropeKit", "silverCompass", "fieldLantern"],
    riskItems: ["firstAidPouch", "trailRation"],
    resourceIds: ["wildOnion", "pineNut"],
    recipeIds: ["pineNutGrilledFish"],
    eventWeights: { unstableBridge: 2.5, ridgeWindGust: 2.45, suddenDownpour: 2.1, distantCry: 2.1, watchtowerSignal: 1.85, fallenTrailMarker: 1.75, hiddenFork: 1.6, lostBeforeDark: 1.45, nightCampEcho: 1.15, morningFogPockets: 0.8, abandonedCabin: 0.7, missingFood: 0.7, rangerNotebook: 0.65, snaredAnimal: 0.65, oldWaterGauge: 0.55, mushroomRing: 0.5, washedOutCache: 0.45 }
  },
  abandonedRangerRoad: {
    id: "abandonedRangerRoad",
    name: "废弃护林道",
    riskLabel: "线索密集 · 装备机会多",
    description: "旧设施散落在路旁，木屋、木箱和护林员留下的痕迹更常见。",
    presentation: {
      className: "route-ranger-road",
      opening: "你沿着废弃护林道前进，木屋、旧锁和褪色记录在路边断断续续出现。",
      cameraPosition: "30% 42%",
      prepPosition: "left 42%",
      journalPosition: "left 42%",
      ambientClass: "is-ranger-dust",
      journalTitle: "旧护林道调查簿",
      journalCaption: "旧设施旁重新拼起的记录"
    },
    preparationHint: "旧设施可能需要照明、简单修缮或能证明来意的随身物。",
    unlockAny: ["watchtowerRoute", "oldRangerStation"],
    lockedHint: "封蜡文件或护林员留下的凭证或许会指向这里。",
    staminaCost: 2,
    recommendedItems: ["fieldLantern", "repairToolkit", "oldKey", "rangerToken"],
    riskItems: ["firstAidPouch", "trailRation"],
    resourceIds: ["wildMushroom", "pineNut"],
    recipeIds: ["wildMushroomFishSoup"],
    eventWeights: { abandonedCabin: 2.6, rangerNotebook: 2.55, lockedChest: 2.4, watchtowerSignal: 2.3, distantCry: 2.15, fallenTrailMarker: 1.85, washedOutCache: 1.55, oldWaterGauge: 1.45, streamSparkle: 1.35, lostBeforeDark: 1.2, ridgeWindGust: 0.9, whiteShadow: 0.75, animalTracks: 0.75, snaredAnimal: 0.7, nightCampEcho: 0.65, morningFogPockets: 0.55, mushroomRing: 0.5 }
  }
};

const DEEP_MOUNTAIN_ADVENTURE_HOOKS = {
  investigateWhiteShadow: {
    id: "investigateWhiteShadow",
    title: "树林中的白影",
    intro: "上次听见的动静消失在密林深处，雾里也许还留着它的痕迹。",
    rumorIntro: "有人说密林深处偶尔会掠过一道看不清轮廓的白影。",
    routeIds: ["denseForest", "mountainRidge"],
    relatedEventIds: ["whiteShadow", "forestFootsteps", "mushroomRing", "nightCampEcho", "lostBeforeDark", "hiddenFork"],
    relatedItems: ["fieldLantern", "forestCharm", "trailMap"],
    routeProgressRequirements: { mountainRidge: { minClues: 1 } },
    clues: [
      { id: "oddPaleFootprints", label: "异常脚步旁的浅色泥印", eventIds: ["forestFootsteps"], flagIds: ["heardStrangeFootsteps"] },
      { id: "whiteFiberOnBranches", label: "树枝上的白色纤维", eventIds: ["whiteShadow", "hiddenFork"], flagIds: ["sawWhiteShadow"] },
      { id: "mushroomRingGap", label: "菌环中央的空缺方向", eventIds: ["mushroomRing"], flagIds: ["foundMushroomRing"] },
      { id: "missingEchoStep", label: "夜间回声少掉的一步", eventIds: ["nightCampEcho"], flagIds: ["heardNightEcho"] },
      { id: "shadowedTrailMarker", label: "白影停留处露出的旧路标", eventIds: ["lostBeforeDark", "hiddenFork"], flagIds: ["whiteShadowGuided", "supernaturalTrail"] }
    ],
    progressFlags: { heardStrangeFootsteps: 1, sawWhiteShadow: 1, foundMushroomRing: 1, heardNightEcho: 1, whiteShadowResolved: 2, whiteShadowGuided: 2, supernaturalTrail: 2 },
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
    title: "旧瞭望塔留下的痕迹",
    intro: "旧设施上的标记似乎彼此相连，也许还指向山里某座瞭望塔。",
    rumorIntro: "护林道旁的旧锁和木屋，据说曾属于同一座瞭望塔。",
    routeIds: ["abandonedRangerRoad", "mountainRidge"],
    relatedEventIds: ["abandonedCabin", "rangerNotebook", "fallenTrailMarker", "watchtowerSignal", "lockedChest", "streamSparkle", "hiddenFork"],
    relatedItems: ["fieldLantern", "repairToolkit", "oldKey"],
    clues: [
      { id: "cabinDeskNumbers", label: "木屋旧桌下重复出现的编号", eventIds: ["abandonedCabin"], flagIds: ["discoveredCabinClue"] },
      { id: "rangerNotebookDates", label: "巡查笔记里的缺失日期", eventIds: ["rangerNotebook"], flagIds: ["foundRangerNotebook"] },
      { id: "fallenMarkerTriangle", label: "倒伏路标背面的三角记号", eventIds: ["fallenTrailMarker"], flagIds: ["restoredTrailMarker"] },
      { id: "oldForestryCoordinate", label: "瞭望塔记录中的旧林务坐标", eventIds: ["watchtowerSignal"], flagIds: ["answeredWatchtowerSignal"] },
      { id: "southSupplyCode", label: "密封信上的南行补给编号", eventIds: ["lockedChest"], flagIds: ["archivedSealedLetter", "openedChest"] }
    ],
    progressFlags: { discoveredCabinClue: 1, foundRangerNotebook: 1, restoredTrailMarker: 2, answeredWatchtowerSignal: 3, foundLockedChest: 1, openedChest: 2, archivedSealedLetter: 3, foundOldKey: 1, foundStreamClue: 1 },
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
    title: "山谷里的回应",
    intro: "旧护林设施附近曾传来过模糊回应，声音的来源还没有弄清。",
    rumorIntro: "山谷里偶尔会传来像呼救又像风声的回响。",
    routeIds: ["abandonedRangerRoad", "mountainRidge"],
    relatedEventIds: ["distantCry", "rangerNotebook", "watchtowerSignal", "snaredAnimal", "abandonedCabin", "lockedChest", "unstableBridge"],
    relatedItems: ["ropeKit", "firstAidPouch", "rangerToken"],
    clues: [
      { id: "valleyResponseDirection", label: "山谷回应传来的逆风方向", eventIds: ["distantCry"], flagIds: ["heardRescueCall"] },
      { id: "rangerTokenIdentity", label: "木章确认的护林员身份", eventIds: ["distantCry"], flagIds: ["rangerTrusted"] },
      { id: "rescueLineMarks", label: "救援绳线上磨出的旧站标记", eventIds: ["distantCry", "unstableBridge"], flagIds: ["reachedRanger"] },
      { id: "rangerLeafRouteMark", label: "护林员记录中的叶片标记", eventIds: ["rangerNotebook", "abandonedCabin"], flagIds: ["foundRangerNotebook", "foundRangerEvidence"] },
      { id: "rescueCoordinateNote", label: "救援补记里的旧林务坐标", eventIds: ["distantCry", "watchtowerSignal"], flagIds: ["completedRescue", "sawWatchtowerSignal"] }
    ],
    progressFlags: { foundRangerEvidence: 1, foundRangerNotebook: 1, sawWatchtowerSignal: 1, heardRescueCall: 1, rangerTrusted: 2, reachedRanger: 2, completedRescue: 3 },
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
    title: "溪边的新鲜脚印",
    intro: "溪边留下了一串新鲜脚印，它们在灌木前突然改变了方向。",
    rumorIntro: "溪谷附近最近常见被翻动的食物和不熟悉的小脚印。",
    routeIds: ["creekValley", "denseForest"],
    relatedEventIds: ["animalTracks", "snaredAnimal", "missingFood", "forestFootsteps", "streamSparkle"],
    relatedItems: ["category:fish", "trailRation", "trailMap"],
    routeProgressRequirements: { denseForest: { minClues: 1 } },
    clues: [
      { id: "freshCreekFootprints", label: "溪边新鲜脚印的步距", eventIds: ["animalTracks"], flagIds: ["foundAnimalTracks"] },
      { id: "quietFeedingStone", label: "溪石旁安全留下食物的位置", eventIds: ["animalTracks"], flagIds: ["befriendedAnimal"] },
      { id: "snareTrailBend", label: "废弃套索旁弯折的兽径", eventIds: ["snaredAnimal"], flagIds: ["foundSnaredAnimal", "rescuedAnimal"] },
      { id: "foodThiefPath", label: "食物袋碎屑连成的动物路线", eventIds: ["missingFood"], flagIds: ["identifiedFoodThief"] },
      { id: "reusedAnimalTrail", label: "反复使用的安全兽径", eventIds: ["forestFootsteps", "animalTracks"], flagIds: ["observedAnimal"] }
    ],
    progressFlags: { foundAnimalTracks: 1, followedAnimal: 1, foundSnaredAnimal: 1, rescuedAnimal: 2, observedAnimal: 2, befriendedAnimal: 2, identifiedFoodThief: 2 },
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
    title: "还没有走通的山路",
    intro: "几处岔路和旧桥还没有连成可靠的往返路线。",
    rumorIntro: "最近的雨水冲开了旧路，也露出了一些从前看不见的岔口。",
    routeIds: ["mountainRidge", "denseForest"],
    relatedEventIds: ["hiddenFork", "unstableBridge", "fallenTrailMarker", "morningFogPockets", "ridgeWindGust", "oldWaterGauge", "lostBeforeDark", "suddenDownpour"],
    relatedItems: ["trailMap", "silverCompass", "ropeKit", "repairToolkit"],
    clues: [
      { id: "hiddenForkSketch", label: "隐藏岔路的手绘草图", eventIds: ["hiddenFork"], flagIds: ["foundHiddenFork", "mappedFork"] },
      { id: "bridgeAnchorPoint", label: "吊桥备用固定点", eventIds: ["unstableBridge"], flagIds: ["repairedBridge"] },
      { id: "waterGaugeFacilityNumber", label: "旧水位尺背面的设施编号", eventIds: ["oldWaterGauge"], flagIds: ["readWaterGauge"] },
      { id: "morningFogSlope", label: "晨雾里没有积水的缓坡方向", eventIds: ["morningFogPockets"], flagIds: ["crossedMorningFog"] },
      { id: "ridgeWindMarker", label: "山脊横风后校正的路标朝向", eventIds: ["ridgeWindGust", "fallenTrailMarker"], flagIds: ["restoredTrailMarker", "securedWindGear"] }
    ],
    progressFlags: { enduredDownpour: 1, enduredRidgeWind: 1, crossedMorningFog: 1, foundHiddenFork: 1, restoredTrailMarker: 2, mappedFork: 2, repairedBridge: 2, routeRecovered: 2, securedRoute: 3 },
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

// Legacy tests and old saves may still refer to goals; runtime semantics use hooks.
const DEEP_MOUNTAIN_ADVENTURE_GOALS = DEEP_MOUNTAIN_ADVENTURE_HOOKS;

const ADVENTURE_REACTION_ITEM_REQUIREMENTS = {
  forestFootsteps: { holdCharm: ["forestCharm"] },
  hiddenFork: { readTrailMap: ["trailMap"] },
  lockedChest: { useTools: ["oldKey", "repairToolkit"] },
  suddenDownpour: { buildCover: ["rainCape", "ropeKit"], eatMeal: ["category:meal"] },
  unstableBridge: { reinforceBridge: ["ropeKit", "repairToolkit"] },
  animalTracks: { offerFish: ["category:fish"] },
  distantCry: { prepareAid: ["ropeKit"], treatInjury: ["firstAidPouch"], showRangerToken: ["rangerToken"] },
  abandonedCabin: { lightLantern: ["fieldLantern"], repairDoor: ["repairToolkit"], restWithSupplies: ["category:meal", "mountainHerb"] },
  whiteShadow: { raiseLantern: ["fieldLantern"], showCharm: ["forestCharm"] },
  streamSparkle: { usePole: ["repairToolkit"] },
  lostBeforeDark: { signalForHelp: ["silverCompass", "fieldLantern"], readTrailMap: ["trailMap"] },
  morningFogPockets: { readTrailMap: ["trailMap"], signalLantern: ["fieldLantern"] },
  ridgeWindGust: { securePack: ["ropeKit"] },
  fallenTrailMarker: { repairMarker: ["repairToolkit"], compareMap: ["trailMap"] },
  rangerNotebook: { lightLantern: ["fieldLantern"], showRangerToken: ["rangerToken"] },
  snaredAnimal: { cutSnare: ["vineCutter", "repairToolkit"], offerFish: ["category:fish"] },
  mushroomRing: { showCharm: ["forestCharm"], raiseLantern: ["fieldLantern"] },
  washedOutCache: { openCache: ["oldKey", "repairToolkit"] },
  oldWaterGauge: { repairGauge: ["repairToolkit"], checkCompass: ["silverCompass"] },
  watchtowerSignal: { answerSignal: ["fieldLantern"], showRangerToken: ["rangerToken"] },
  nightCampEcho: { showCharm: ["forestCharm"], eatMeal: ["category:meal"] }
};

const ADVENTURE_EVENT_CONSEQUENCES = {
  forestFootsteps: {
    rareGood: [{ type: "gain", itemId: "trailMap", quantity: 1 }, { type: "gainIngredient", ingredientId: "pineNut", quantity: 1 }, { type: "stamina", amount: 2 }],
    good: [{ type: "gainIngredient", ingredientId: "pineNut", quantity: 1 }, { type: "status", id: "tracksRead", label: "辨清兽径" }, { type: "stamina", amount: 1 }],
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
    rareGood: [{ type: "gain", itemId: "sealedLetter", quantity: 1 }, { type: "keyClue", clueId: "southSupplyCode" }, { type: "gain", itemId: "repairToolkit", quantity: 1 }],
    good: [{ type: "gain", itemId: "sealedLetter", quantity: 1 }, { type: "keyClue", clueId: "southSupplyCode" }],
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
    rareGood: [{ type: "gain", itemId: "mountainHerb", quantity: 2 }, { type: "gainIngredient", ingredientId: "wildOnion", quantity: 1 }],
    good: [{ type: "gain", itemId: "mountainHerb", quantity: 1 }, { type: "gainIngredient", ingredientId: "wildOnion", quantity: 1 }],
    mixed: [{ type: "status", id: "animalTrail", label: "记录动物路线" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -3 }],
    rareBad: [{ type: "stamina", amount: -6 }]
  },
  distantCry: {
    rareGood: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "keyClue", clueId: "oldForestryCoordinate" }, { type: "gain", itemId: "firstAidPouch", quantity: 1 }],
    good: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "keyClue", clueId: "oldForestryCoordinate" }, { type: "gain", itemId: "firstAidPouch", quantity: 1 }],
    mixed: [{ type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -7 }]
  },
  missingFood: {
    rareGood: [{ type: "gainIngredient", ingredientId: "pineNut", quantity: 1 }, { type: "status", id: "foodRecovered", label: "找回食物" }, { type: "stamina", amount: 1 }],
    good: [{ type: "gainIngredient", ingredientId: "pineNut", quantity: 1 }, { type: "status", id: "suppliesSecured", label: "重新收好物资" }],
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
  },
  morningFogPockets: {
    rareGood: [{ type: "gain", itemId: "trailMap", quantity: 1 }, { type: "stamina", amount: 2 }],
    good: [{ type: "gain", itemId: "mountainHerb", quantity: 1 }, { type: "gainIngredient", ingredientId: "wildOnion", quantity: 1 }],
    mixed: [{ type: "status", id: "fogCrossed", label: "穿过晨雾" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "consumeCategory", categories: ["meal", "fish", "food"], quantity: 1 }, { type: "stamina", amount: -6 }]
  },
  ridgeWindGust: {
    rareGood: [{ type: "gain", itemId: "ropeKit", quantity: 1 }, { type: "stamina", amount: 1 }],
    good: [{ type: "status", id: "ridgeWindRead", label: "辨清山脊风向" }],
    mixed: [{ type: "stamina", amount: -2 }],
    bad: [{ type: "loseCategory", categories: ["meal", "fish", "food"], quantity: 1 }, { type: "stamina", amount: -5 }],
    rareBad: [{ type: "loseItem", itemId: "ropeKit", quantity: 1 }, { type: "stamina", amount: -8 }]
  },
  fallenTrailMarker: {
    rareGood: [{ type: "gain", itemId: "trailMap", quantity: 1 }, { type: "unlock", locationId: "ridgeTrail" }],
    good: [{ type: "unlock", locationId: "ridgeTrail" }],
    mixed: [{ type: "status", id: "markerRecorded", label: "记下倒伏路标" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -6 }]
  },
  rangerNotebook: {
    rareGood: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "keyClue", clueId: "rangerLeafRouteMark" }, { type: "gain", itemId: "trailMap", quantity: 1 }],
    good: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "keyClue", clueId: "rangerLeafRouteMark" }],
    mixed: [{ type: "keyClue", clueId: "rangerLeafRouteMark" }, { type: "gain", itemId: "trailRation", quantity: 1 }],
    bad: [{ type: "stamina", amount: -2 }],
    rareBad: [{ type: "stamina", amount: -4 }]
  },
  snaredAnimal: {
    rareGood: [{ type: "gain", itemId: "mountainHerb", quantity: 2 }, { type: "stamina", amount: 1 }],
    good: [{ type: "gain", itemId: "mountainHerb", quantity: 1 }],
    mixed: [{ type: "status", id: "snareMarked", label: "标记废弃套索" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -7 }]
  },
  mushroomRing: {
    rareGood: [{ type: "gain", itemId: "forestCharm", quantity: 1 }, { type: "gainIngredient", ingredientId: "wildMushroom", quantity: 2 }, { type: "unlockRecipe", recipeId: "wildMushroomFishSoup" }, { type: "stamina", amount: 2 }],
    good: [{ type: "gain", itemId: "mountainHerb", quantity: 2 }, { type: "gainIngredient", ingredientId: "wildMushroom", quantity: 1 }],
    mixed: [{ type: "gain", itemId: "mountainHerb", quantity: 1 }, { type: "gainIngredient", ingredientId: "wildMushroom", quantity: 1 }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -7 }]
  },
  washedOutCache: {
    rareGood: [{ type: "gain", itemId: "oldKey", quantity: 1 }, { type: "gainIngredient", ingredientId: "pineNut", quantity: 1 }, { type: "unlockRecipe", recipeId: "pineNutGrilledFish" }, { type: "gain", itemId: "trailRation", quantity: 2 }],
    good: [{ type: "gain", itemId: "firstAidPouch", quantity: 1 }, { type: "gainIngredient", ingredientId: "pineNut", quantity: 1 }, { type: "gain", itemId: "trailRation", quantity: 1 }],
    mixed: [{ type: "gain", itemId: "trailRation", quantity: 1 }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -3 }],
    rareBad: [{ type: "stamina", amount: -6 }]
  },
  oldWaterGauge: {
    rareGood: [{ type: "gain", itemId: "silverCompass", quantity: 1 }, { type: "gain", itemId: "mountainHerb", quantity: 1 }],
    good: [{ type: "gain", itemId: "trailMap", quantity: 1 }],
    mixed: [{ type: "status", id: "waterGaugeRead", label: "抄下水位记录" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -3 }],
    rareBad: [{ type: "stamina", amount: -5 }]
  },
  watchtowerSignal: {
    rareGood: [{ type: "gain", itemId: "rangerToken", quantity: 1 }, { type: "keyClue", clueId: "oldForestryCoordinate" }, { type: "gain", itemId: "trailMap", quantity: 1 }],
    good: [{ type: "keyClue", clueId: "oldForestryCoordinate" }, { type: "status", id: "watchtowerLocated", label: "定位旧瞭望塔" }, { type: "stamina", amount: 1 }],
    mixed: [{ type: "keyClue", clueId: "oldForestryCoordinate" }, { type: "status", id: "signalRecorded", label: "记下信号节奏" }, { type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -7 }]
  },
  nightCampEcho: {
    rareGood: [{ type: "gain", itemId: "forestCharm", quantity: 1 }, { type: "stamina", amount: 2 }],
    good: [{ type: "status", id: "echoUnderstood", label: "辨清夜间回声" }, { type: "stamina", amount: 1 }],
    mixed: [{ type: "stamina", amount: -1 }],
    bad: [{ type: "stamina", amount: -4 }],
    rareBad: [{ type: "stamina", amount: -8 }]
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

const DEEP_MOUNTAIN_PROP_SHEET_POSITIONS = {
  "prop-footprints": ["0%", "0%"],
  "prop-chest-closed": ["33.333%", "0%"],
  "prop-chest-open": ["66.667%", "0%"],
  "prop-ghost": ["100%", "0%"],
  "prop-branches": ["0%", "50%"],
  "prop-food": ["33.333%", "50%"],
  "prop-sparkle": ["66.667%", "50%"],
  "prop-hiker": ["100%", "50%"],
  "prop-lantern": ["0%", "100%"],
  "prop-cabin": ["33.333%", "100%"],
  "prop-bridge": ["66.667%", "100%"],
  "prop-sign": ["100%", "100%"]
};

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
    tags: ["fatigue"],
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
    tags: ["injury", "fatigue"],
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
    tags: ["injury"],
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
    tags: ["fatigue"],
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
  },
  {
    id: "morningFogPockets",
    title: "溪谷里迟迟不散的晨雾",
    approach: { x: 41, y: 66 },
    prop: { className: "prop-sign", x: 31, y: 58 },
    resolvedPropClass: "is-revealed",
    luckKey: "dangerSense",
    risk: 1,
    atmosphere: "dawn",
    timeOfDay: "dawn",
    tags: ["fatigue"],
    phase: "晨雾把溪湾分成几段",
    reactions: [
      adventureReaction("waitForSun", "等阳光升高", "rest", ["雾会慢慢变薄。", "先别踩进看不清的水边。"], { comfortSeeking: 0.48, rationality: 0.44 }, 18),
      adventureReaction("readDew", "观察露水方向", "crouch", ["这边的草刚被风吹过。", "露珠能看出坡面。"], { observation: 0.72, rationality: 0.34 }, 18),
      adventureReaction("readTrailMap", "对照手绘地图", "inspect", ["水声和图上的弯角一致。", "缓坡应该在左边。"], { observation: 0.56, preparedness: 0.52 }, 18),
      adventureReaction("signalLantern", "用提灯照露珠", "lantern", ["反光连成了一条线。", "灯光能照出积水边缘。"], { preparedness: 0.58, curiosity: 0.36 }, 17)
    ],
    outcomes: {
      rareGood: ["第一束阳光穿过雾层，照出一条铺满露珠的旧石阶。"],
      good: ["你顺着水声与坡度穿过薄雾，没有踩进湿滑岸边。"],
      mixed: ["雾散得很慢，你多绕了一小段才回到溪边主路。"],
      bad: ["湿草遮住落脚点，你在雾里滑了几次才退回原处。"],
      rareBad: ["水声从两侧同时传来，你只好等到日光完全升高。"]
    }
  },
  {
    id: "ridgeWindGust",
    title: "山脊上突然增强的风",
    approach: { x: 59, y: 43 },
    prop: { className: "prop-branches", x: 68, y: 37 },
    luckKey: "healthLuck",
    risk: 2,
    atmosphere: "windy",
    tags: ["injury", "fatigue"],
    phase: "横风卷起背包外侧的布带",
    reactions: [
      adventureReaction("lowerCenter", "压低重心", "brace", ["先站稳再走。", "风口不能急。"], { courage: 0.42, rationality: 0.5 }, 18),
      adventureReaction("readWind", "观察草叶风向", "inspect", ["阵风之间有空隙。", "等下一次风弱。"], { observation: 0.7, rationality: 0.3 }, 19),
      adventureReaction("securePack", "用绳组固定装备", "crouch", ["把外侧东西全绑紧。", "岩钉可以借力。"], { preparedness: 0.72, responsibility: 0.34 }, 18),
      adventureReaction("retreatLeeward", "退到背风坡", "walk", ["另一侧会安静些。", "不和横风硬顶。"], { comfortSeeking: 0.5, responsibility: 0.44 }, 18)
    ],
    outcomes: {
      rareGood: ["阵风掀开低云，远处旧瞭望塔的轮廓短暂露了出来。"],
      good: ["你踩着风势间隙通过暴露处，背包也保持稳妥。"],
      mixed: ["几件外挂物不停拍打，你放慢速度走过山脊。"],
      bad: ["一阵横风把松动物件卷向坡边，你费力才追回来。"],
      rareBad: ["持续强风封住前方，你只能从更低的碎石坡折返。"]
    }
  },
  {
    id: "fallenTrailMarker",
    title: "倒在草丛里的旧路标",
    approach: { x: 46, y: 51 },
    prop: { className: "prop-sign", x: 55, y: 47 },
    resolvedPropClass: "is-cleared",
    luckKey: "generalLuck",
    risk: 1,
    phase: "褪色箭头朝着山坡下方",
    reactions: [
      adventureReaction("liftMarker", "扶起路标", "brace", ["先看看原来的底座。", "箭头不该朝这里。"], { responsibility: 0.58, courage: 0.28 }, 18),
      adventureReaction("inspectBase", "检查断裂底座", "crouch", ["土里还有旧螺栓。", "倒下不是最近的事。"], { observation: 0.72, rationality: 0.36 }, 19),
      adventureReaction("repairMarker", "修好路标支架", "open", ["支架还能重新固定。", "把方向先校正。"], { preparedness: 0.7, responsibility: 0.4 }, 18),
      adventureReaction("compareMap", "对照地图边注", "inspect", ["这个符号在图角见过。", "箭头原本指向高处。"], { observation: 0.56, preparedness: 0.5 }, 18)
    ],
    outcomes: {
      rareGood: ["路标背面刻着一条已从普通地图上消失的瞭望塔旧路。"],
      good: ["你根据底座痕迹找回正确朝向，附近小路也重新清楚。"],
      mixed: ["箭头能扶起，却仍缺少确认方向的最后一处参照。"],
      bad: ["腐朽木柱再次倒下，你只能留下醒目的警告标记。"],
      rareBad: ["错误箭头把你带到碎石坡边，你及时发现才没有继续。"]
    }
  },
  {
    id: "rangerNotebook",
    title: "被雨水粘住的巡查笔记",
    approach: { x: 37, y: 47 },
    prop: { className: "prop-lantern", x: 28, y: 43 },
    resolvedPropClass: "is-revealed",
    luckKey: "treasureLuck",
    risk: 0,
    phase: "旧桌上压着一本潮湿笔记",
    reactions: [
      adventureReaction("separatePages", "慢慢分开纸页", "open", ["别把字迹一起撕掉。", "先从边角松开。"], { responsibility: 0.54, rationality: 0.44 }, 18),
      adventureReaction("readIndentations", "辨认纸页压痕", "crouch", ["墨没了，笔迹还在。", "下一页留下了轮廓。"], { observation: 0.76, curiosity: 0.3 }, 19),
      adventureReaction("lightLantern", "用斜光照纸页", "lantern", ["换个角度会看得见。", "压痕开始显出来了。"], { preparedness: 0.54, observation: 0.5 }, 18),
      adventureReaction("showRangerToken", "比对护林员木章", "inspect", ["封面印记和木章一样。", "这些简写也许是地点。"], { preparedness: 0.5, rationality: 0.46 }, 18)
    ],
    outcomes: {
      rareGood: ["最后一页记录着旧瞭望塔信号和一条仍可通行的维护路。"],
      good: ["你读出几处巡查地点，木屋与山脊路标的编号互相吻合。"],
      mixed: ["大部分字迹已经散开，只剩日期和几个重复出现的箭头。"],
      bad: ["潮湿纸页粘得太紧，你没有继续冒险翻动。"],
      rareBad: ["桌面突然渗水，你及时把笔记移到干燥处才免于损坏。"]
    }
  },
  {
    id: "snaredAnimal",
    title: "被废弃套索缠住的动物",
    approach: { x: 44, y: 69 },
    prop: { className: "prop-footprints", x: 52, y: 65 },
    resolvedPropClass: "is-retreating",
    luckKey: "socialLuck",
    risk: 1,
    tags: ["injury"],
    phase: "灌木里传来压低的挣扎声",
    reactions: [
      adventureReaction("approachSlowly", "慢慢靠近", "crouch", ["别怕，我不会突然碰你。", "先让它看见我的手。"], { sociability: 0.52, responsibility: 0.5 }, 18),
      adventureReaction("studySnare", "观察套索结构", "inspect", ["线从树根绕过去了。", "先找不会收紧的位置。"], { observation: 0.68, rationality: 0.42 }, 19),
      adventureReaction("cutSnare", "用工具拆套索", "open", ["剪开这一段就能松。", "别让断线弹回去。"], { preparedness: 0.68, responsibility: 0.42 }, 18),
      adventureReaction("offerFish", "用鱼安抚动物", "open", ["先闻闻这个。", "慢一点，我来松开细线。"], { preparedness: 0.5, sociability: 0.44 }, 17)
    ],
    outcomes: {
      rareGood: ["动物脱困后停在草药旁，像是故意让你看见那处生长点。"],
      good: ["你松开缠住前腿的细线，动物很快安全跑回树林。"],
      mixed: ["套索没有继续收紧，你记下位置准备带合适工具回来。"],
      bad: ["动物受惊挣扎，细线变得更紧，你只能先退开。"],
      rareBad: ["灌木后还有第二道套索，你立即封住这段兽径避免更多动物靠近。"]
    }
  },
  {
    id: "mushroomRing",
    title: "林下缓慢发光的菌环",
    approach: { x: 52, y: 57 },
    prop: { className: "prop-sparkle", x: 61, y: 54 },
    resolvedPropClass: "is-revealed",
    luckKey: "treasureLuck",
    risk: 1,
    atmosphere: "dim",
    phase: "一圈微光在树根间依次亮起",
    reactions: [
      adventureReaction("watchPattern", "观察亮灭顺序", "crouch", ["它们不是一起亮的。", "空缺总在同一个方向。"], { observation: 0.7, curiosity: 0.42 }, 18),
      adventureReaction("circleOutside", "从外围绕行", "walk", ["不踩进去也能看清。", "先找普通的解释。"], { rationality: 0.58, responsibility: 0.34 }, 18),
      adventureReaction("showCharm", "把护符靠近菌环", "lantern", ["纹路也亮了。", "它们在互相回应吗？"], { curiosity: 0.62, courage: 0.3 }, 18),
      adventureReaction("raiseLantern", "用提灯照孢子", "lantern", ["稳定光下会更清楚。", "先确认是不是反光。"], { preparedness: 0.56, observation: 0.46 }, 18)
    ],
    outcomes: {
      rareGood: ["菌环中央没有植物，却留着一道像脚印又不像脚印的浅色痕迹。"],
      good: ["你确认微光来自枯木孢子，并安全采到几株山地草药。"],
      mixed: ["微光顺序改变了一次，很快又恢复普通而安静的亮灭。"],
      bad: ["风把孢子吹得四处飘散，你退到上风处等待它们落下。"],
      rareBad: ["菌环外突然多亮起一点，你没有踏入那段无法确认的空地。"]
    }
  },
  {
    id: "washedOutCache",
    title: "被溪水冲出的旧补给箱",
    approach: { x: 57, y: 68 },
    prop: { className: "prop-chest-closed", x: 67, y: 64 },
    resolvedProp: "prop-chest-open",
    luckKey: "treasureLuck",
    risk: 1,
    phase: "湿沙里卡着一只金属补给箱",
    reactions: [
      adventureReaction("dragToBank", "拖到干岸上", "brace", ["先别让水再冲走。", "箱子比看起来沉。"], { responsibility: 0.5, courage: 0.34 }, 18),
      adventureReaction("inspectSeal", "检查设施封条", "crouch", ["编号和水位尺很像。", "锁芯里全是沙。"], { observation: 0.7, rationality: 0.4 }, 19),
      adventureReaction("openCache", "使用钥匙或工具", "open", ["先把锁里的沙清掉。", "这个旧扣还能处理。"], { preparedness: 0.72, curiosity: 0.28 }, 18),
      adventureReaction("leaveCache", "移到高处保留", "walk", ["打不开也别留在水里。", "先放到醒目的地方。"], { responsibility: 0.64, rationality: 0.34 }, 18)
    ],
    outcomes: {
      rareGood: ["补给箱密封完好，里面的钥匙、干粮和旧标签都没有进水。"],
      good: ["箱内仍有一份急救用品和几包可以使用的干粮。"],
      mixed: ["大部分纸张泡坏了，角落还有一包保持干燥的补给。"],
      bad: ["变形箱扣没有松动，你只把箱子搬离涨水线。"],
      rareBad: ["上游水位突然升高，你必须先撤回安全岸边。"]
    }
  },
  {
    id: "oldWaterGauge",
    title: "溪边废弃的水位尺",
    approach: { x: 55, y: 62 },
    prop: { className: "prop-sign", x: 65, y: 58 },
    resolvedPropClass: "is-revealed",
    luckKey: "generalLuck",
    risk: 1,
    tags: ["injury"],
    phase: "锈住的浮标停在旧洪水刻度",
    reactions: [
      adventureReaction("copyMarks", "抄下水位记录", "crouch", ["日期还能辨认。", "最高水位旁有编号。"], { observation: 0.68, responsibility: 0.34 }, 19),
      adventureReaction("traceCable", "沿旧线缆查找", "inspect", ["线缆通向下游。", "这里以前连接过设施。"], { curiosity: 0.58, rationality: 0.42 }, 18),
      adventureReaction("repairGauge", "尝试恢复浮标", "open", ["锈点可以松开。", "先别碰弯刻度。"], { preparedness: 0.68, rationality: 0.4 }, 18),
      adventureReaction("checkCompass", "观察指南针偏转", "inspect", ["指针在这里不太稳定。", "金属物也许埋在水下。"], { observation: 0.48, preparedness: 0.54 }, 18)
    ],
    outcomes: {
      rareGood: ["恢复的浮标带起一枚旧指南针，也露出通往下游补给点的编号。"],
      good: ["你读懂水位变化，找出一条不会被涨水截断的溪边小路。"],
      mixed: ["浮标没有移动，但背面设施编号仍能完整抄下。"],
      bad: ["锈蚀结构突然晃动，你及时停手没有让它倒进溪里。"],
      rareBad: ["旧线缆被水流绷紧，你只能封住附近落脚点并退开。"]
    }
  },
  {
    id: "watchtowerSignal",
    title: "高处重复三次的微光",
    approach: { x: 61, y: 39 },
    prop: { className: "prop-lantern", x: 74, y: 32 },
    resolvedPropClass: "is-revealed",
    luckKey: "socialLuck",
    risk: 1,
    atmosphere: "night",
    timeOfDay: "dusk",
    phase: "远处微光按固定节奏闪烁",
    reactions: [
      adventureReaction("countPattern", "记录闪光节奏", "inspect", ["三短，一长。", "它每隔同样时间重复。"], { observation: 0.7, rationality: 0.36 }, 19),
      adventureReaction("callTowardRidge", "向山脊回应", "call", ["瞭望塔方向有人吗？", "我看见信号了！"], { sociability: 0.7, courage: 0.26 }, 18),
      adventureReaction("answerSignal", "用提灯回应", "lantern", ["按同样节奏回过去。", "看看它会不会改变。"], { preparedness: 0.58, sociability: 0.42 }, 18),
      adventureReaction("showRangerToken", "举起护林员木章", "lantern", ["反光纹路也许是凭证。", "让高处看见这个标记。"], { preparedness: 0.5, responsibility: 0.42 }, 18)
    ],
    outcomes: {
      rareGood: ["微光改变节奏，随后照亮一段通往旧瞭望塔的完整台阶。"],
      good: ["你确认信号来自高处旧设施，并记录下一条可继续接近的路线。"],
      mixed: ["三次微光没有回应，却与护林笔记里的节奏完全一致。"],
      bad: ["云层遮住高处，你没能确认微光的准确位置。"],
      rareBad: ["另一侧山坡也亮起相同节奏，你无法判断哪一处才是来源。"]
    }
  },
  {
    id: "nightCampEcho",
    title: "夜里总少一拍的回声",
    approach: { x: 47, y: 53 },
    prop: { className: "prop-ghost", x: 69, y: 45 },
    resolvedPropClass: "is-retreating",
    luckKey: "dangerSense",
    risk: 2,
    atmosphere: "night",
    timeOfDay: "night",
    tags: ["fatigue"],
    phase: "林间回声重复着白天的脚步",
    reactions: [
      adventureReaction("countEchoes", "安静数回声", "rest", ["第三次总会少一拍。", "先别发出新的声音。"], { observation: 0.66, rationality: 0.42 }, 19),
      adventureReaction("answerEcho", "对树林喊话", "call", ["是谁还在那边？", "这不是普通回声吧。"], { sociability: 0.58, courage: 0.42 }, 17),
      adventureReaction("showCharm", "握住护符等待", "lantern", ["它又开始发亮。", "等下一次声音。"], { curiosity: 0.56, preparedness: 0.46 }, 18),
      adventureReaction("eatMeal", "吃份热食休息", "rest", ["先把自己安顿好。", "安静下来再听。"], { comfortSeeking: 0.62, preparedness: 0.34 }, 18)
    ],
    outcomes: {
      rareGood: ["回声停下后，远处白影替你踏完了缺少的那一步。"],
      good: ["你找出溪谷与树干之间的反射点，夜路重新变得普通。"],
      mixed: ["回声确实少了一拍，却没有留下能够继续追踪的方向。"],
      bad: ["近处忽然多出一声脚步，你立即收好营地准备离开。"],
      rareBad: ["两个方向同时重复你的声音，你没有在原地继续过夜。"]
    }
  }
];

const DEEP_MOUNTAIN_LOCAL_STATE_DEFAULTS = {
  bridgeRepaired: false,
  cabinSearched: 0,
  rangerCluesFound: 0,
  animalTrust: 0,
  whiteShadowTrust: 0,
  animalEncounters: 0,
  whiteShadowEncounters: 0,
  recurringEncounters: {}
};

function clampDeepMountainStateValue(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Math.floor(Number(value) || 0)));
}

function sanitizeDeepMountainLocalState(source) {
  const current = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const recurringSource = current.recurringEncounters && typeof current.recurringEncounters === "object" && !Array.isArray(current.recurringEncounters)
    ? current.recurringEncounters
    : {};
  const knownEventIds = DEEP_MOUNTAIN_ADVENTURE_EVENTS.reduce(function(ids, eventDefinition) {
    ids[eventDefinition.id] = true;
    return ids;
  }, {});
  const recurringEncounters = Object.keys(recurringSource).reduce(function(counts, eventId) {
    if (knownEventIds[eventId]) counts[eventId] = clampDeepMountainStateValue(recurringSource[eventId], 0, 99);
    return counts;
  }, {});
  const cabinStage = current.cabinSearched === true ? 1 : (current.cabinSearched === false ? 0 : current.cabinSearched);
  return Object.assign({}, current, {
    bridgeRepaired: Boolean(current.bridgeRepaired),
    cabinSearched: clampDeepMountainStateValue(cabinStage, 0, 3),
    rangerCluesFound: clampDeepMountainStateValue(current.rangerCluesFound, 0, 5),
    animalTrust: clampDeepMountainStateValue(current.animalTrust, -3, 3),
    whiteShadowTrust: clampDeepMountainStateValue(current.whiteShadowTrust, -3, 3),
    animalEncounters: clampDeepMountainStateValue(current.animalEncounters, 0, 99),
    whiteShadowEncounters: clampDeepMountainStateValue(current.whiteShadowEncounters, 0, 99),
    recurringEncounters: recurringEncounters
  });
}

function applyDeepMountainTripLocalState(source, trip) {
  const state = sanitizeDeepMountainLocalState(source);
  const flags = trip && trip.eventFlags ? trip.eventFlags : {};
  const events = trip && Array.isArray(trip.events) ? trip.events : [];
  const eventIds = events.map(function(entry) { return entry.eventId; });
  eventIds.forEach(function(eventId) {
    state.recurringEncounters[eventId] = clampDeepMountainStateValue((state.recurringEncounters[eventId] || 0) + 1, 0, 99);
  });

  if (flags.repairedBridge) state.bridgeRepaired = true;
  if (eventIds.indexOf("abandonedCabin") !== -1 && flags.discoveredCabinClue) {
    state.cabinSearched = clampDeepMountainStateValue(state.cabinSearched + 1, 0, 3);
  }

  const rangerClueCount = ["foundRangerEvidence", "foundRangerNotebook", "restoredTrailMarker", "answeredWatchtowerSignal", "rangerTrusted", "reachedRanger", "completedRescue", "archivedSealedLetter"].reduce(function(total, flagId) {
    return total + (flags[flagId] ? 1 : 0);
  }, 0);
  if (rangerClueCount > 0) {
    state.rangerCluesFound = clampDeepMountainStateValue(state.rangerCluesFound + Math.min(2, rangerClueCount), 0, 5);
  }

  const metAnimal = eventIds.some(function(eventId) {
    return ["animalTracks", "forestFootsteps", "missingFood", "snaredAnimal"].indexOf(eventId) !== -1;
  }) && (flags.foundAnimalTracks || flags.foundSnaredAnimal || flags.rescuedAnimal || flags.observedAnimal || flags.befriendedAnimal || flags.animalStartled || flags.identifiedFoodThief);
  if (metAnimal) state.animalEncounters = clampDeepMountainStateValue(state.animalEncounters + 1, 0, 99);
  let animalTrustDelta = 0;
  if (flags.befriendedAnimal || flags.rescuedAnimal) animalTrustDelta = 2;
  else if (flags.observedAnimal || flags.animalGivenSpace) animalTrustDelta = 1;
  if (flags.animalStartled || flags.animalFoodStolen) animalTrustDelta -= 1;
  state.animalTrust = clampDeepMountainStateValue(state.animalTrust + animalTrustDelta, -3, 3);

  if (flags.sawWhiteShadow) {
    state.whiteShadowEncounters = clampDeepMountainStateValue(state.whiteShadowEncounters + 1, 0, 99);
    state.whiteShadowTrust = clampDeepMountainStateValue(state.whiteShadowTrust + (Number(flags.whiteShadowTrust) || 0), -3, 3);
  }
  return sanitizeDeepMountainLocalState(state);
}

function getDeepMountainHookContinuation(hookId, sourceState, memories) {
  const state = sanitizeDeepMountainLocalState(sourceState);
  const camperMemories = memories && typeof memories === "object" ? memories : {};
  if (hookId === "investigateWhiteShadow" && state.whiteShadowEncounters > 0) {
    return {
      weight: state.whiteShadowEncounters < 4 ? 12 : 5,
      intro: state.whiteShadowTrust < 0
        ? "那道白影上次把你引回了错误路标，这次最好先确认它的距离。"
        : "白影已经不止一次出现在熟悉的路口，它似乎也记得你停下的位置。"
    };
  }
  if (hookId === "findWatchtowerClue" && state.cabinSearched > 0 && state.cabinSearched < 3) {
    return {
      weight: 10,
      intro: state.cabinSearched === 1
        ? "山间木屋还有几处没有查完，旧桌下的刮痕也许能和护林道上的锁对应起来。"
        : "木屋里反复出现的编号只差最后一段出处，也许藏在更深处的旧设施里。"
    };
  }
  if (hookId === "findMissingRanger" && state.rangerCluesFound > 0 && state.rangerCluesFound < 5) {
    return { weight: 8, intro: "已经找到的护林员痕迹仍没有完整去向，山谷里的回应值得再确认一次。" };
  }
  if (hookId === "investigateWildlife" && state.animalEncounters > 0 && Math.abs(state.animalTrust) < 3) {
    return {
      weight: 6,
      intro: state.animalTrust < 0
        ? "上次受惊的动物没有再靠近，但溪边又出现了同样的脚印。"
        : "那串逐渐熟悉的脚印再次经过溪边，动物似乎开始接受你留下的距离。"
    };
  }
  if (hookId === "findSafeRoute" && !state.bridgeRepaired && Number(state.recurringEncounters.unstableBridge) > 0) {
    return { weight: 9, intro: "那座旧吊桥仍在山风里摇晃，之前记下的受力点也许足够支持一次加固。" };
  }
  if (hookId === "investigateWhiteShadow" && Number(camperMemories.supernaturalEncounters) > 0) return { weight: 1.5 };
  if (hookId === "investigateWildlife" && Number(camperMemories.animalTrust) !== 0) return { weight: 1.25 };
  if (hookId === "findMissingRanger" && Number(camperMemories.rescuedSomeone) > 0) return { weight: 1 };
  return null;
}

function getDeepMountainChainWeight(eventId, flags) {
  let multiplier = 1;
  if (flags.foundAnimalTracks && ["forestFootsteps", "missingFood", "snaredAnimal"].indexOf(eventId) !== -1) multiplier *= 2.2;
  if (flags.rescuedAnimal && ["animalTracks", "missingFood"].indexOf(eventId) !== -1) multiplier *= 1.6;
  if (flags.heardStrangeFootsteps && ["whiteShadow", "mushroomRing"].indexOf(eventId) !== -1) multiplier *= 2.5;
  if (flags.foundMushroomRing && eventId === "nightCampEcho") multiplier *= 2.55;
  if (flags.heardNightEcho && eventId === "whiteShadow") multiplier *= 2.35;
  if (flags.sawWhiteShadow && ["lostBeforeDark", "hiddenFork", "nightCampEcho", "mushroomRing"].indexOf(eventId) !== -1) multiplier *= 2.15;
  if (flags.discoveredCabinClue && ["rangerNotebook", "lockedChest"].indexOf(eventId) !== -1) multiplier *= 2.6;
  if (flags.foundRangerNotebook && ["fallenTrailMarker", "watchtowerSignal", "distantCry"].indexOf(eventId) !== -1) multiplier *= 2.35;
  if (flags.restoredTrailMarker && eventId === "watchtowerSignal") multiplier *= 2.7;
  if (flags.openedChest && ["distantCry", "rangerNotebook"].indexOf(eventId) !== -1) multiplier *= 1.8;
  if (flags.foundStreamClue && eventId === "oldWaterGauge") multiplier *= 2.5;
  if (flags.readWaterGauge && eventId === "washedOutCache") multiplier *= 2.75;
  if (flags.enduredDownpour && ["unstableBridge", "oldWaterGauge"].indexOf(eventId) !== -1) multiplier *= 2.4;
  if (flags.enduredRidgeWind && ["fallenTrailMarker", "watchtowerSignal"].indexOf(eventId) !== -1) multiplier *= 1.9;
  if (flags.crossedMorningFog && ["oldWaterGauge", "hiddenFork"].indexOf(eventId) !== -1) multiplier *= 1.8;
  if (flags.repairedBridge && ["hiddenFork", "lostBeforeDark", "fallenTrailMarker"].indexOf(eventId) !== -1) multiplier *= 2.1;
  return multiplier;
}

function getDeepMountainRecurringStoryContext(eventDefinition, reaction, outcome, trip) {
  const state = sanitizeDeepMountainLocalState(trip && trip.mapStateSnapshot);
  const memories = trip && trip.adventureMemorySnapshot && typeof trip.adventureMemorySnapshot === "object"
    ? trip.adventureMemorySnapshot
    : {};
  const seenCount = Number(state.recurringEncounters[eventDefinition.id]) || 0;
  const context = { bubble: "", result: "", chainId: "", visualClass: "" };

  if (eventDefinition.id === "unstableBridge" && state.bridgeRepaired) {
    context.bubble = "上次补过的绳结还在，先看看桥面经不经得住这阵风。";
    context.result = "你检查了曾经加固的位置，旧桥依然摇晃，却没有再出现危险的松脱。";
    context.chainId = "rememberedBridge";
    if (["bad", "rareBad"].indexOf(outcome.tier) !== -1) outcome.tier = "mixed";
  } else if (eventDefinition.id === "unstableBridge" && Number(memories.canopyCrossings) > 0) {
    context.bubble = "雨林树冠旧道的主绳也是这样受力，先沿固定点一段段检查。";
    context.result = "走过树冠步道的经验让你避开最松的桥板；两处旧设施很像，却没有证据说明它们有关。";
    context.chainId = "crossMapCanopyMemory";
    if (outcome.tier === "rareBad") outcome.tier = "bad";
  } else if (eventDefinition.id === "unstableBridge" && seenCount >= 2) {
    context.bubble = "还是同一段松绳，这次我知道该先看哪里。";
    context.result = "凭前几次留下的观察，你很快找到了桥面最容易晃动的固定点。";
    context.chainId = "rememberedBridge";
  } else if (eventDefinition.id === "abandonedCabin" && state.cabinSearched >= 3) {
    context.bubble = "这间木屋已经熟悉了，门廊内侧是最稳妥的落脚处。";
    context.result = "你避开腐朽地板，径直检查上次留下的标记；木屋这次没有再藏住新的危险。";
    context.chainId = "rememberedCabin";
    if (["bad", "rareBad"].indexOf(outcome.tier) !== -1) outcome.tier = "mixed";
  } else if (eventDefinition.id === "abandonedCabin" && state.cabinSearched > 0) {
    context.bubble = state.cabinSearched === 1 ? "上次只查到门边，里面还有没看完的地方。" : "旧桌下的编号还差最后一段。";
    context.result = state.cabinSearched === 1
      ? "你沿着上次停下的位置继续检查，在更深处找到了一组重复出现的护林标记。"
      : "你把木屋里分散的编号重新对齐，缺失的记录范围又缩小了一段。";
    context.chainId = "rememberedCabin";
  } else if (eventDefinition.id === "animalTracks" && state.animalEncounters >= 3) {
    context.bubble = state.animalTrust > 0 ? "它又走这条路，而且没有刻意避开我的脚印。" : "这串脚印认得出来，先别再让它受惊。";
    context.result = state.animalTrust > 0
      ? "熟悉的动物在灌木后停了一会儿，留下的步距比最初几次放松许多。"
      : "你认出同一只动物留下的急促痕迹，主动绕开了它正在使用的兽径。";
    context.chainId = "rememberedAnimal";
    context.visualClass = state.animalTrust > 0 ? "story-friendly-animal" : "story-startled-animal";
  } else if (eventDefinition.id === "animalTracks" && state.animalEncounters > 0) {
    context.bubble = "这组步距见过，它又回到溪边了。";
    context.result = "你把新脚印与上次记录叠在一起，确认动物正在重复使用同一段安全兽径。";
    context.chainId = "rememberedAnimal";
  } else if (eventDefinition.id === "whiteShadow" && state.whiteShadowEncounters >= 3) {
    context.bubble = state.whiteShadowTrust < 0 || Number(memories.frightenedByApparition) > 0
      ? "它知道我会在这里停下……先保持距离。"
      : "又是同一个路口，它也记得我吗？";
    context.result = state.whiteShadowTrust > 0
      ? "白影在你曾经停步的位置等了一瞬，随后让开了通往林间的视线。"
      : "白影重复了熟悉的停顿，却没有给出能够确认善意或恶意的答案。";
    context.chainId = "rememberedWhiteShadow";
    context.visualClass = state.whiteShadowTrust > 0 ? "story-guiding-shadow" : "story-distant-shadow";
  } else if (eventDefinition.id === "whiteShadow" && state.whiteShadowEncounters > 0) {
    context.bubble = "又是它，连出现的位置都和上次很像。";
    context.result = "白影在近似的距离里再次停下，像是认出了你，也像只是重复一段旧痕迹。";
    context.chainId = "rememberedWhiteShadow";
    context.visualClass = "story-distant-shadow";
  } else if (eventDefinition.id === "rangerNotebook" && Number(memories.stationRecordsRecovered) > 0) {
    context.bubble = "雨林调查站也有这种被跳过的日期，先看页码有没有同样的断口。";
    context.result = "你用恢复调查站记录时学到的办法核对页码，找到一段相似缺口；它也可能只是旧记录常见的受潮损失。";
    context.chainId = "crossMapStationMemory";
  } else if (eventDefinition.id === "mushroomRing" && Number(memories.sharedSymbolEncounters) > 0) {
    context.bubble = "菌环的空缺和雨林石纹有一点像，但先别把相似当成答案。";
    context.result = "你把两处轮廓记在同一页上：线条能够对应，来源仍然完全无法确认。";
    context.chainId = "crossMapSymbolMemory";
  }
  if (!context.chainId && eventDefinition.id === "snaredAnimal" && trip.eventFlags.foundAnimalTracks) {
    context.bubble = trip.eventFlags.befriendedAnimal ? "是那只熟悉的动物，先别让套索再收紧。" : "这些脚印就在套索旁停下了。";
    context.result = trip.eventFlags.befriendedAnimal
      ? "动物认出你留下的距离，安静下来让你处理缠住它的细线。"
      : "先前的脚印把你带到废弃套索旁，你及时封住了危险兽径。";
    context.chainId = "animalTrail";
    context.visualClass = trip.eventFlags.befriendedAnimal ? "story-friendly-animal" : "story-tracked-animal";
  } else if (!context.chainId && eventDefinition.id === "mushroomRing" && (trip.eventFlags.heardStrangeFootsteps || trip.eventFlags.sawWhiteShadow)) {
    context.bubble = trip.eventFlags.sawWhiteShadow ? "白影刚才绕开了这圈微光。" : "脚步声正好在菌环外停过。";
    context.result = "菌环的空缺朝着异常动静消失的方向，微光却没有解释两者为什么一致。";
    context.chainId = "whiteShadow";
  } else if (!context.chainId && eventDefinition.id === "nightCampEcho" && (trip.eventFlags.foundMushroomRing || trip.eventFlags.sawWhiteShadow)) {
    context.bubble = trip.eventFlags.foundMushroomRing ? "回声少掉的那一步，正好朝着菌环的空缺。" : "这串脚步和白影出现时一样。";
    context.result = "夜间回声与白天留下的异常位置互相对应，却仍可能只是山谷制造的巧合。";
    context.chainId = "whiteShadow";
  } else if (!context.chainId && eventDefinition.id === "oldWaterGauge" && trip.eventFlags.foundStreamClue) {
    context.bubble = "溪里的旧物和这支水位尺有相同山纹。";
    context.result = "你把溪流发现与水位刻度并在一起，确认下游曾设有一处护林补给点。";
    context.chainId = "streamFacility";
  } else if (!context.chainId && eventDefinition.id === "washedOutCache" && trip.eventFlags.readWaterGauge) {
    context.bubble = "水位尺背面的编号，就是这只补给箱。";
    context.result = outcome.itemSolution
      ? outcome.text + " 箱内标签也确认它属于旧溪流水文设施。"
      : "水位记录准确指向了补给箱，但变形箱扣仍需要合适工具。";
    context.chainId = "streamFacility";
  } else if (!context.chainId && eventDefinition.id === "fallenTrailMarker" && trip.eventFlags.foundRangerNotebook) {
    context.bubble = "笔记里的三角记号，就刻在这根路标背面。";
    context.result = "巡查笔记补全了路标原本的朝向，高处微光也有了可以核对的位置。";
    context.chainId = "watchtowerSignal";
  } else if (!context.chainId && eventDefinition.id === "watchtowerSignal" && (trip.eventFlags.foundRangerNotebook || trip.eventFlags.restoredTrailMarker)) {
    context.bubble = trip.eventFlags.restoredTrailMarker ? "修好的路标正对着那三次微光。" : "这就是巡查笔记里反复记录的节奏。";
    context.result = outcome.itemSolution
      ? outcome.text + " 路标、笔记与信号终于指向同一处高地。"
      : "高处微光与已有记录完全吻合，你把通往旧瞭望塔的范围缩小了。";
    context.chainId = "watchtowerSignal";
  } else if (!context.chainId && eventDefinition.id === "lostBeforeDark" && trip.eventFlags.crossedMorningFog) {
    context.bubble = "早上的水声还在左侧，沿同一坡面就能回去。";
    context.result = "晨雾里记下的坡度再次发挥作用，你沿溪谷轮廓找回了主路。";
    context.chainId = "safeRoute";
    if (["bad", "rareBad"].indexOf(outcome.tier) !== -1) outcome.tier = "mixed";
  }
  return context;
}

const DEEP_MOUNTAIN_PARTICIPANT_OBSERVATIONS = {
  whiteShadow: [
    { traitId: "observation", min: 65, text: "{name}注意到白影肩侧有一道像背包束带的轮廓，雾一合拢就无法再确认。" },
    { traitId: "sociability", min: 65, text: "{name}听见脚步在回应气泡后停了一拍，像是在听，也可能只是山谷回声。" },
    { memoryKey: "supernaturalEncounters", min: 1, text: "{name}觉得这次停顿与自己记得的异常相遇很像，但没有把熟悉感当作答案。" }
  ],
  rangerNotebook: [
    { traitId: "observation", min: 65, text: "{name}在页边发现一组被不同笔压重复描过的日期。" },
    { traitId: "rationality", min: 65, text: "{name}确认缺页前后的巡查路线并不连续，记录可能来自不同批次。" }
  ],
  unstableBridge: [
    { traitId: "preparedness", min: 65, text: "{name}先看见了桥柱背面的备用固定环，并提醒队伍保留退路。" },
    { traitId: "observation", min: 65, text: "{name}注意到最响的桥板并不是晃动最大的一块。" }
  ]
};

const DEEP_MOUNTAIN_ADVENTURE_SCENE = {
  background: "assets/adventure/deep-mountain/deep-mountain-background.png",
  foreground: "assets/adventure/deep-mountain/foreground.png",
  eventPropSheet: "assets/adventure/deep-mountain/event-props.png",
  itemSheet: "assets/adventure/deep-mountain/adventure-items.png",
  pathPoints: ADVENTURE_PROTOTYPE_PATH_POINTS,
  propSheetPositions: DEEP_MOUNTAIN_PROP_SHEET_POSITIONS
};

const DEEP_MOUNTAIN_ADVENTURE_MAP = {
  id: "deepMountain",
  name: ADVENTURE_LOCATION_CATALOG.deepMountain.name,
  status: "ready",
  selection: {
    eyebrow: "DEEP MOUNTAIN",
    description: "溪谷、密林、山脊与旧护林道仍在留下新的痕迹。",
    unlockHint: "营地附近最先开放的冒险地点。",
    image: "assets/adventure/deep-mountain/deep-mountain-background.png",
    className: "map-deep-mountain"
  },
  scene: DEEP_MOUNTAIN_ADVENTURE_SCENE,
  routes: DEEP_MOUNTAIN_ADVENTURE_ROUTES,
  adventureHooks: DEEP_MOUNTAIN_ADVENTURE_HOOKS,
  events: DEEP_MOUNTAIN_ADVENTURE_EVENTS,
  itemPool: ["ropeKit", "fieldLantern", "firstAidPouch", "oldKey", "sealedLetter", "repairToolkit", "mountainHerb", "trailMap", "silverCompass", "forestCharm", "rangerToken", "trailRation"],
  localStateDefaults: DEEP_MOUNTAIN_LOCAL_STATE_DEFAULTS,
  sanitizeLocalState: sanitizeDeepMountainLocalState,
  applyTripLocalState: applyDeepMountainTripLocalState,
  getHookContinuation: getDeepMountainHookContinuation,
  getChainWeight: getDeepMountainChainWeight,
  getStoryContext: getDeepMountainRecurringStoryContext,
  participantObservations: DEEP_MOUNTAIN_PARTICIPANT_OBSERVATIONS,
  locations: ADVENTURE_LOCATION_CATALOG,
  reactionItemRequirements: ADVENTURE_REACTION_ITEM_REQUIREMENTS,
  itemSolutionEffects: ADVENTURE_ITEM_SOLUTION_EFFECTS,
  missingItemFeedback: ADVENTURE_MISSING_ITEM_FEEDBACK,
  eventConsequences: ADVENTURE_EVENT_CONSEQUENCES,
  defaultHookId: "investigateWhiteShadow",
  defaultRouteId: "creekValley"
};
