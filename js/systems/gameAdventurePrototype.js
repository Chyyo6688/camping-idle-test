// Playable single-player deep-mountain adventure prototype.

const adventurePrototypeLayer = document.getElementById("adventurePrototypeLayer");
const adventurePrototype = document.getElementById("adventurePrototype");
const adventureScene = document.getElementById("adventureScene");
const adventureBackground = document.getElementById("adventureBackground");
const adventureHeader = document.getElementById("adventureHeader");
const adventureHeaderEyebrow = document.getElementById("adventureHeaderEyebrow");
const adventureHeaderTitle = document.getElementById("adventureHeaderTitle");
const adventureAtmosphere = document.getElementById("adventureAtmosphere");
const adventureRainLayer = document.getElementById("adventureRainLayer");
const adventureEventProp = document.getElementById("adventureEventProp");
const adventureEventAccent = document.getElementById("adventureEventAccent");
const adventureUsedItemVisual = document.getElementById("adventureUsedItemVisual");
const adventureCamper = document.getElementById("adventureCamper");
const adventureBubble = document.getElementById("adventureBubble");
const adventureItemFeedbackLayer = document.getElementById("adventureItemFeedbackLayer");
const adventurePhaseLabel = document.getElementById("adventurePhaseLabel");
const adventureResult = document.getElementById("adventureResult");
const adventureEventTitle = document.getElementById("adventureEventTitle");
const adventureResultText = document.getElementById("adventureResultText");
const adventureEffectText = document.getElementById("adventureEffectText");
const adventureEventCount = document.getElementById("adventureEventCount");
const adventureRunStamina = document.getElementById("adventureRunStamina");
const adventureRunBackpack = document.getElementById("adventureRunBackpack");
const adventureRunInjuries = document.getElementById("adventureRunInjuries");
const adventureEndEarlyButton = document.getElementById("adventureEndEarlyButton");
const adventureCenterButton = document.getElementById("adventureCenterButton");
const adventureStorageBadge = document.getElementById("adventureStorageBadge");
const adventureStorageLayer = document.getElementById("adventureStorageLayer");
const adventureStorageCloseButton = document.getElementById("adventureStorageCloseButton");
const adventureStorageLatestMeta = document.getElementById("adventureStorageLatestMeta");
const adventureStorageLatestList = document.getElementById("adventureStorageLatestList");
const adventureStorageCountLabel = document.getElementById("adventureStorageCountLabel");
const adventureStorageItemList = document.getElementById("adventureStorageItemList");
const adventureCenterPanel = document.getElementById("adventureCenterPanel");
const adventureCenterCloseButton = document.getElementById("adventureCenterCloseButton");
const adventureCenterStamina = document.getElementById("adventureCenterStamina");
const adventureCenterStorageCount = document.getElementById("adventureCenterStorageCount");
const adventureCenterJourneyCount = document.getElementById("adventureCenterJourneyCount");
const adventureCenterDepartButton = document.getElementById("adventureCenterDepartButton");
const adventureCenterStorageButton = document.getElementById("adventureCenterStorageButton");
const adventureCenterJournalButton = document.getElementById("adventureCenterJournalButton");
const adventureCenterPendingStories = document.getElementById("adventureCenterPendingStories");
const adventureJournalPanel = document.getElementById("adventureJournalPanel");
const adventureJournalCloseButton = document.getElementById("adventureJournalCloseButton");
const adventureJourneyTab = document.getElementById("adventureJourneyTab");
const adventureStoryArchiveTab = document.getElementById("adventureStoryArchiveTab");
const adventureJournalContent = document.getElementById("adventureJournalContent");

const adventureMapList = document.getElementById("adventureMapList");
const adventureMapMessage = document.getElementById("adventureMapMessage");
const adventureMapStamina = document.getElementById("adventureMapStamina");
const adventureMapStorageCount = document.getElementById("adventureMapStorageCount");
const adventureMapCloseButton = document.getElementById("adventureMapCloseButton");

const adventurePrepStaminaText = document.getElementById("adventurePrepStaminaText");
const adventurePrepPanel = document.getElementById("adventurePrepPanel");
const adventurePrepStaminaFill = document.getElementById("adventurePrepStaminaFill");
const adventureStaminaHint = document.getElementById("adventureStaminaHint");
const adventureStorageList = document.getElementById("adventureStorageList");
const adventureBackpackList = document.getElementById("adventureBackpackList");
const adventureBackpackCapacity = document.getElementById("adventureBackpackCapacity");
const adventurePrepMessage = document.getElementById("adventurePrepMessage");
const adventureStartButton = document.getElementById("adventureStartButton");
const adventurePrepResetButton = document.getElementById("adventurePrepResetButton");
const adventurePrepCloseButton = document.getElementById("adventurePrepCloseButton");
const adventurePrepMapEyebrow = document.getElementById("adventurePrepMapEyebrow");
const adventurePrepTitle = document.getElementById("adventurePrepTitle");
const adventureRouteStep = document.getElementById("adventureRouteStep");
const adventureBackpackStep = document.getElementById("adventureBackpackStep");
const adventureTripCardPanel = document.getElementById("adventureTripCardPanel");
const adventureTripCard = document.getElementById("adventureTripCard");
const adventureTripBackButton = document.getElementById("adventureTripBackButton");
const adventureRouteContinueButton = document.getElementById("adventureRouteContinueButton");
const adventureHookRerollButton = document.getElementById("adventureHookRerollButton");
const adventureHookSortButton = document.getElementById("adventureHookSortButton");
const adventureTripRouteName = document.getElementById("adventureTripRouteName");
const adventureTripSummary = document.getElementById("adventureTripSummary");
const adventureTripResourceTags = document.getElementById("adventureTripResourceTags");
const adventurePrepStaminaInfoButton = document.getElementById("adventurePrepStaminaInfoButton");
const adventurePrepStaminaPopover = document.getElementById("adventurePrepStaminaPopover");
const adventurePrepIllustration = document.getElementById("adventurePrepIllustration");
const adventurePrepIllustrationCaption = document.getElementById("adventurePrepIllustrationCaption");
const adventureRouteList = document.getElementById("adventureRouteList");
const adventureStrategyHint = document.getElementById("adventureStrategyHint");
const adventureHookPreview = document.getElementById("adventureHookPreview");
const adventureHookEyebrow = document.getElementById("adventureHookEyebrow");
const adventureHookTitle = document.getElementById("adventureHookTitle");
const adventureHookIntro = document.getElementById("adventureHookIntro");
const adventureHookClueMeta = document.getElementById("adventureHookClueMeta");
const adventureRecommendationText = document.getElementById("adventureRecommendationText");
const adventureRecommendationResetButton = document.getElementById("adventureRecommendationResetButton");

const adventureLogStatus = document.getElementById("adventureLogStatus");
const adventureLogIllustration = document.getElementById("adventureLogIllustration");
const adventureLogIllustrationProp = document.getElementById("adventureLogIllustrationProp");
const adventureLogIllustrationCaption = document.getElementById("adventureLogIllustrationCaption");
const adventureLogLocation = document.getElementById("adventureLogLocation");
const adventureLogEventCount = document.getElementById("adventureLogEventCount");
const adventureLogStamina = document.getElementById("adventureLogStamina");
const adventureLogEndReason = document.getElementById("adventureLogEndReason");
const adventureLogEventList = document.getElementById("adventureLogEventList");
const adventureLogHookStatus = document.getElementById("adventureLogHookStatus");
const adventureLogStoryTitle = document.getElementById("adventureLogStoryTitle");
const adventureLogStoryIntro = document.getElementById("adventureLogStoryIntro");
const adventureLogProgressBlock = document.getElementById("adventureLogProgressBlock");
const adventureLogStoryBody = document.getElementById("adventureLogStoryBody");
const adventureLogStoryEnding = document.getElementById("adventureLogStoryEnding");
const adventureLogDeparted = document.getElementById("adventureLogDeparted");
const adventureLogGained = document.getElementById("adventureLogGained");
const adventureLogLost = document.getElementById("adventureLogLost");
const adventureLogConsumed = document.getElementById("adventureLogConsumed");
const adventureLogUnlocked = document.getElementById("adventureLogUnlocked");
const adventureAgainButton = document.getElementById("adventureAgainButton");
const adventureLogMapButton = document.getElementById("adventureLogMapButton");
const adventureLogExitButton = document.getElementById("adventureLogExitButton");
const adventureLogResetButton = document.getElementById("adventureLogResetButton");
const adventureLogRouteMapButton = document.getElementById("adventureLogRouteMapButton");

const adventureRouteMapLayer = document.getElementById("adventureRouteMapLayer");
const adventureRouteMapCloseButton = document.getElementById("adventureRouteMapCloseButton");
const adventureRouteMapMapButton = document.getElementById("adventureRouteMapMapButton");
const adventureClueSortLayer = document.getElementById("adventureClueSortLayer");
const adventureClueSortTitle = document.getElementById("adventureClueSortTitle");
const adventureClueSortRule = document.getElementById("adventureClueSortRule");
const adventureClueSortInstruction = document.getElementById("adventureClueSortInstruction");
const adventureClueSortSlots = document.getElementById("adventureClueSortSlots");
const adventureClueSortList = document.getElementById("adventureClueSortList");
const adventureClueSortMessage = document.getElementById("adventureClueSortMessage");
const adventureClueSortHint = document.getElementById("adventureClueSortHint");
const adventureClueSortCompletion = document.getElementById("adventureClueSortCompletion");
const adventureClueSortCloseButton = document.getElementById("adventureClueSortCloseButton");
const adventureClueSortHintButton = document.getElementById("adventureClueSortHintButton");
const adventureClueSortResetButton = document.getElementById("adventureClueSortResetButton");
const adventureClueSortConfirmButton = document.getElementById("adventureClueSortConfirmButton");

const ADVENTURE_WALK_FRAMES = [
  "camper_walk_01.png",
  "camper_walk_02.png",
  "camper_walk_03.png",
  "camper_walk_04.png",
  "camper_walk_05.png",
  "camper_walk_06.png"
];
const ADVENTURE_ACTION_FRAMES = {
  idle: [CAMPER_IDLE_FRAME_NAME],
  walk: ADVENTURE_WALK_FRAMES,
  run: ADVENTURE_WALK_FRAMES,
  crouch: ["camper_sit_ground.png", "camper_activity_birdwatch_01.png"],
  inspect: ["camper_activity_birdwatch_01.png", "camper_activity_birdwatch_02.png", "camper_activity_birdwatch_03.png", "camper_activity_birdwatch_04.png"],
  lantern: ["camper_carry_wood _06.png", "camper_carry_wood.png"],
  open: ["camper_activity_cook_01.png", "camper_activity_cook_02.png", "camper_activity_cook_03.png", "camper_activity_cook_04.png"],
  call: ["camper_activity_birdwatch_01.png", CAMPER_IDLE_FRAME_NAME],
  brace: ["camper_carry_wood.png", "camper_carry_wood _06.png"],
  rest: ["camper_sit_ground.png", "camper_rest.png"],
  startled: [CAMPER_IDLE_FRAME_NAME, "camper_walk_01.png"]
};

const adventurePrototypeState = {
  active: false,
  mode: "map-select",
  busy: false,
  draftBackpack: {},
  draftBackpackTouched: false,
  draftMapId: "deepMountain",
  draftRouteId: "creekValley",
  draftAdventureHook: null,
  prepStep: "routes",
  routeCarouselIndex: 0,
  routeCarouselDrag: null,
  journalTab: "journeys",
  activeStorySortId: "",
  storySortOrder: [],
  storySortSelected: [],
  storySortAttempts: 0,
  storySortHintLevel: 0,
  storySortPinnedClueId: "",
  storySortSolved: false,
  storySortPointerStartX: 0,
  storySortPointerStartY: 0,
  storySortPointerMoved: false,
  storySortPointerClueId: "",
  storySortSuppressClick: false,
  draggedStoryClueId: "",
  recoveredTripSnapshot: null,
  trip: null,
  currentEvent: null,
  seenEventIds: [],
  timers: [],
  feedbackTimers: [],
  frameTimer: null,
  frameIndex: 0,
  pathIndex: 0,
  camperX: 46,
  camperY: 82,
  action: "idle"
};

function clampAdventureValue(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function cloneAdventureCountMap(source) {
  const clean = {};
  Object.keys(source && typeof source === "object" ? source : {}).forEach(function(key) {
    const count = Math.max(0, Math.floor(Number(source[key]) || 0));
    if (count > 0) {
      clean[key] = count;
    }
  });
  return clean;
}

function addAdventureCount(countMap, key, quantity) {
  const amount = Math.max(0, Math.floor(Number(quantity) || 0));
  if (!key || amount <= 0) {
    return 0;
  }
  countMap[key] = (Number(countMap[key]) || 0) + amount;
  return amount;
}

function removeAdventureCount(countMap, key, quantity) {
  const available = Math.max(0, Math.floor(Number(countMap[key]) || 0));
  const removed = Math.min(available, Math.max(0, Math.floor(Number(quantity) || 0)));
  if (removed <= 0) {
    return 0;
  }
  const remaining = available - removed;
  if (remaining > 0) {
    countMap[key] = remaining;
  } else {
    delete countMap[key];
  }
  return removed;
}

function getAdventureCountTotal(countMap) {
  return Object.keys(countMap || {}).reduce(function(total, key) {
    return total + Math.max(0, Math.floor(Number(countMap[key]) || 0));
  }, 0);
}

function cloneAdventureData(source) {
  if (Array.isArray(source)) {
    return source.map(cloneAdventureData);
  }
  if (source && typeof source === "object") {
    return Object.keys(source).reduce(function(copy, key) {
      copy[key] = cloneAdventureData(source[key]);
      return copy;
    }, {});
  }
  return source;
}

function getAdventureMap(mapId) {
  const maps = getAdventureMapRegistry();
  return maps[mapId] || maps[ADVENTURE_DEFAULT_MAP_ID] || DEEP_MOUNTAIN_ADVENTURE_MAP;
}

function getAdventureMapRegistry() {
  return typeof ADVENTURE_MAPS === "object" && ADVENTURE_MAPS ? ADVENTURE_MAPS : {};
}

function getDefaultAdventureMapId() {
  const fallback = getAdventureMap(ADVENTURE_DEFAULT_MAP_ID);
  return fallback ? fallback.id : "deepMountain";
}

function getAdventureMapIds() {
  const maps = getAdventureMapRegistry();
  const ids = Object.keys(maps);
  return ids.length ? ids : [getDefaultAdventureMapId()];
}

function isAdventureMapPlayable(mapId) {
  const map = getAdventureMapRegistry()[mapId];
  return Boolean(map && map.status === "ready" && map.scene && Object.keys(map.routes || {}).length && (map.events || []).length);
}

function isAdventureMapUnlocked(mapId, progress) {
  const adventureProgress = progress || ensureAdventureProgress();
  return isAdventureMapPlayable(mapId) && Array.isArray(adventureProgress.unlockedMaps) && adventureProgress.unlockedMaps.indexOf(mapId) !== -1;
}

function getAdventureMapHooks(mapId) {
  const map = getAdventureMap(mapId);
  if (map && map.adventureHooks) return map.adventureHooks;
  if (map && map.goals) return map.goals;
  return typeof DEEP_MOUNTAIN_ADVENTURE_HOOKS === "object" ? DEEP_MOUNTAIN_ADVENTURE_HOOKS : DEEP_MOUNTAIN_ADVENTURE_GOALS;
}

function getAdventureHookDefinition(mapId, hookId) {
  const hooks = getAdventureMapHooks(mapId);
  return hookId && hooks[hookId] ? hooks[hookId] : null;
}

function getAdventureHookClueDefinitions(mapId, hookId) {
  const hook = getAdventureHookDefinition(mapId, hookId);
  const seen = {};
  return (Array.isArray(hook && hook.clues) ? hook.clues : []).filter(function(clue) {
    if (!clue || typeof clue.id !== "string" || seen[clue.id]) return false;
    seen[clue.id] = true;
    return true;
  }).map(function(clue) {
    const parsedOrder = Math.floor(Number(clue.order));
    return {
      id: clue.id,
      label: typeof clue.label === "string" ? clue.label : clue.id,
      title: typeof clue.title === "string" && clue.title ? clue.title : (typeof clue.label === "string" ? clue.label : clue.id),
      text: typeof clue.text === "string" ? clue.text : "",
      order: Number.isFinite(parsedOrder) && parsedOrder > 0 ? parsedOrder : 0,
      relationHint: typeof clue.relationHint === "string" ? clue.relationHint : "",
      eventIds: sanitizeAdventureStringArray(clue.eventIds, 12),
      flagIds: sanitizeAdventureStringArray(clue.flagIds, 12),
      routeIds: sanitizeAdventureStringArray(clue.routeIds, 8)
    };
  });
}

function sanitizeAdventureHookClues(source) {
  const clean = {};
  const sourceClues = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  getAdventureMapIds().forEach(function(mapId) {
    const hooks = getAdventureMapHooks(mapId);
    const mapSource = sourceClues[mapId] && typeof sourceClues[mapId] === "object" && !Array.isArray(sourceClues[mapId])
      ? sourceClues[mapId]
      : sourceClues;
    const hookClean = {};
    Object.keys(hooks).forEach(function(hookId) {
      const validClueIds = getAdventureHookClueDefinitions(mapId, hookId).map(function(clue) { return clue.id; });
      const sourceIds = Array.isArray(mapSource[hookId]) ? mapSource[hookId] : [];
      const uniqueIds = Array.from(new Set(sourceIds.filter(function(clueId) {
        return validClueIds.indexOf(clueId) !== -1;
      })));
      if (uniqueIds.length) hookClean[hookId] = uniqueIds;
    });
    clean[mapId] = hookClean;
  });
  return clean;
}

function getAdventureKnownHookClueIds(progress, mapId, hookId) {
  const clueSource = progress && progress.hookClues && progress.hookClues[mapId] ? progress.hookClues[mapId][hookId] : [];
  const validClueIds = getAdventureHookClueDefinitions(mapId, hookId).map(function(clue) { return clue.id; });
  return Array.from(new Set((Array.isArray(clueSource) ? clueSource : []).filter(function(clueId) {
    return validClueIds.indexOf(clueId) !== -1;
  })));
}

function getAdventureHookClueProgress(progress, mapId, hookId) {
  const definitions = getAdventureHookClueDefinitions(mapId, hookId);
  const foundIds = getAdventureKnownHookClueIds(progress || ensureAdventureProgress(), mapId, hookId);
  return {
    found: foundIds.length,
    total: definitions.length,
    remaining: Math.max(0, definitions.length - foundIds.length),
    complete: definitions.length > 0 && foundIds.length >= definitions.length,
    discovered: foundIds.length > 0,
    foundIds: foundIds,
    clues: definitions
  };
}

function formatAdventureHookClueProgress(progressInfo) {
  if (!progressInfo || !progressInfo.total) return "尚未发现";
  if (!progressInfo.discovered) return "尚未发现";
  return "线索 " + progressInfo.found + " / " + progressInfo.total;
}

function isAdventureHookRouteEligible(mapId, hook, routeId, progress) {
  if (!hook) return false;
  if (Array.isArray(hook.routeIds) && hook.routeIds.length && hook.routeIds.indexOf(routeId) === -1) {
    return false;
  }
  const requirements = hook.routeProgressRequirements && hook.routeProgressRequirements[routeId];
  if (requirements && Number(requirements.minClues) > 0) {
    const clueProgress = getAdventureHookClueProgress(progress || ensureAdventureProgress(), mapId, hook.id);
    if (clueProgress.found < Number(requirements.minClues)) return false;
  }
  if (requirements && Array.isArray(requirements.keyClues)) {
    const knownKeyClues = progress && Array.isArray(progress.keyClues) ? progress.keyClues : [];
    if (!requirements.keyClues.every(function(clueId) { return knownKeyClues.indexOf(clueId) !== -1; })) return false;
  }
  return true;
}

function getAdventureIngredientName(ingredientId) {
  const catalog = typeof ingredientCatalog === "object" && ingredientCatalog ? ingredientCatalog : {};
  return catalog[ingredientId] ? catalog[ingredientId].displayName : ingredientId;
}

function getAdventureRecipeName(recipeId) {
  const recipes = typeof cookingRecipeCatalog === "object" && cookingRecipeCatalog ? cookingRecipeCatalog : {};
  const meals = typeof mealCatalog === "object" && mealCatalog ? mealCatalog : {};
  const recipe = recipes[recipeId];
  return recipe && recipe.displayName ? recipe.displayName : (meals[recipeId] ? meals[recipeId].displayName : recipeId);
}

function getAdventureKeyClueName(clueId) {
  const catalog = typeof ADVENTURE_KEY_CLUE_CATALOG === "object" && ADVENTURE_KEY_CLUE_CATALOG ? ADVENTURE_KEY_CLUE_CATALOG : {};
  return catalog[clueId] ? catalog[clueId].label : clueId;
}

function sanitizeAdventureKeyClues(source, unlockedMaps) {
  const catalog = typeof ADVENTURE_KEY_CLUE_CATALOG === "object" && ADVENTURE_KEY_CLUE_CATALOG ? ADVENTURE_KEY_CLUE_CATALOG : {};
  const clues = Array.from(new Set((Array.isArray(source) ? source : []).filter(function(clueId) {
    return Boolean(catalog[clueId]);
  })));
  if (Array.isArray(unlockedMaps) && unlockedMaps.indexOf("fogRainforest") !== -1 && catalog.dampSurveyRouteMap && clues.indexOf("dampSurveyRouteMap") === -1) {
    clues.push("dampSurveyRouteMap");
  }
  return clues;
}

function getAdventureRouteMapSummaryLines() {
  return [
    "旧林务网格：S-17 / E-04",
    "南侧补给路线：溪谷末端 → 低地调查站",
    "通联编号：R-03",
    "雨季后道路停用。",
    "若藤蔓覆盖路标，沿白色树标继续前进。"
  ];
}

const ADVENTURE_ROUTE_MAP_STORY_ID = "keyItem:dampRouteMap";

const ADVENTURE_STORY_SORT_RULES = ["时间顺序", "因果顺序", "行动步骤", "路线连接顺序"];
const ADVENTURE_STORY_ORDER_SYMBOLS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];

function getAdventureStoryRuleInstruction(sortingRule) {
  const instructions = {
    "时间顺序": "按事情发生的先后顺序整理线索。阅读日期、时段和前后承接，从最早发生排到最后确认。",
    "因果顺序": "按发现与结论之间的因果关系整理线索。先找起因，再排出它如何引出后续发现。",
    "行动步骤": "按行动实际执行的步骤整理线索。从第一步开始，依次排到最终确认。",
    "路线连接顺序": "按路线从起点到终点的连接顺序整理线索。留意每一段从哪里来、通向哪里。"
  };
  return instructions[sortingRule] || "阅读每张线索中的时间、地点和因果关系，将它们整理成能够互相印证的顺序。";
}

function getAdventureStoryPositionLabel(sortingRule, index, total) {
  const symbol = ADVENTURE_STORY_ORDER_SYMBOLS[index] || String(index + 1) + ".";
  if (sortingRule === "时间顺序") return symbol + " " + (index === 0 ? "最早发生" : (index === total - 1 ? "最后确认" : "随后发生"));
  if (sortingRule === "因果顺序") return symbol + " " + (index === 0 ? "起因" : (index === total - 1 ? "最终结论" : "后续发现"));
  if (sortingRule === "行动步骤") return symbol + " " + (index === total - 1 ? "最后一步" : "第 " + String(index + 1) + " 步");
  if (sortingRule === "路线连接顺序") return symbol + " " + (index === 0 ? "路线起点" : (index === total - 1 ? "路线终点" : "下一段"));
  return symbol + " 位置 " + String(index + 1);
}

function normalizeAdventureStoryClue(clue, index) {
  const source = clue && typeof clue === "object" ? clue : {};
  const label = typeof source.label === "string" && source.label ? source.label : (typeof source.title === "string" && source.title ? source.title : source.id);
  const parsedOrder = Math.floor(Number(source.order));
  return {
    id: source.id,
    label: label,
    title: typeof source.title === "string" && source.title ? source.title : label,
    text: typeof source.text === "string" && source.text ? source.text : "这份记录写着：“" + label + "”。请结合其他线索判断它的位置。",
    order: Number.isFinite(parsedOrder) && parsedOrder > 0 ? parsedOrder : index + 1,
    relationHint: typeof source.relationHint === "string" && source.relationHint ? source.relationHint : "留意这张记录与前后线索重复出现的地点或关键词。",
    eventIds: sanitizeAdventureStringArray(source.eventIds, 12),
    flagIds: sanitizeAdventureStringArray(source.flagIds, 12),
    routeIds: sanitizeAdventureStringArray(source.routeIds, 8)
  };
}

function createAdventureStoryDefinition(settings) {
  const source = settings && typeof settings === "object" ? settings : {};
  const sortingRule = ADVENTURE_STORY_SORT_RULES.indexOf(source.sortingRule) !== -1 ? source.sortingRule : "线索顺序";
  const clues = (Array.isArray(source.clues) ? source.clues : []).map(normalizeAdventureStoryClue).sort(function(a, b) {
    return a.order - b.order;
  });
  const configuredLabels = sanitizeAdventureStringArray(source.positionLabels, clues.length);
  const positionLabels = clues.map(function(clue, index) {
    return configuredLabels[index] || getAdventureStoryPositionLabel(sortingRule, index, clues.length);
  });
  return {
    id: source.id,
    mapId: source.mapId || "deepMountain",
    hookId: source.hookId || "",
    title: source.title || "未命名故事",
    sortingRule: sortingRule,
    instruction: typeof source.instruction === "string" && source.instruction ? source.instruction : getAdventureStoryRuleInstruction(sortingRule),
    positionLabels: positionLabels,
    clues: clues,
    failureHints: sanitizeAdventureStringArray(source.failureHints, 8),
    completionExplanation: typeof source.completionExplanation === "string" && source.completionExplanation ? source.completionExplanation : (source.archiveStory || "线索之间的前后关系已经能够互相印证。"),
    archiveStory: source.archiveStory || ("你把“" + (source.title || "这条故事") + "”的线索按经过整理在一起，沿途细节终于形成了一份能够反复查阅的完整记录。"),
    unlocks: Array.isArray(source.unlocks) ? source.unlocks.slice() : [],
    reward: source.reward || null,
    keyItemId: source.keyItemId || ""
  };
}

function getAdventureStoryCorrectOrder(story) {
  return story && Array.isArray(story.clues) ? story.clues.slice().sort(function(a, b) { return a.order - b.order; }).map(function(clue) { return clue.id; }) : [];
}

function isAdventureStoryOrderCorrect(story, clueOrder) {
  const correctOrder = getAdventureStoryCorrectOrder(story);
  return Array.isArray(clueOrder) && clueOrder.join("|") === correctOrder.join("|");
}

function getAdventureStoryProgressiveHint(story, level) {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  const hints = story && Array.isArray(story.failureHints) ? story.failureHints : [];
  if (hints.length) return hints[Math.min(safeLevel - 1, hints.length - 1)];
  const clues = story && Array.isArray(story.clues) ? story.clues : [];
  const clue = clues[Math.min(safeLevel - 1, Math.max(0, clues.length - 1))];
  return clue ? clue.relationHint : "比较线索中重复出现的日期、地点和关键词。";
}

function shouldPinAdventureStoryFirstClue(attempts, hintLevel) {
  return Math.max(Math.floor(Number(attempts) || 0), Math.floor(Number(hintLevel) || 0)) >= 3;
}

function getAdventureStoryDefinitions() {
  const stories = [];
  getAdventureMapIds().forEach(function(mapId) {
    const hooks = getAdventureMapHooks(mapId);
    Object.keys(hooks).forEach(function(hookId) {
      const hook = hooks[hookId];
      const clues = getAdventureHookClueDefinitions(mapId, hookId);
      if (!clues.length) return;
      stories.push(createAdventureStoryDefinition({
        id: mapId + ":" + hookId,
        mapId: mapId,
        hookId: hookId,
        title: hook.title,
        sortingRule: hook.sortingRule,
        instruction: hook.instruction,
        positionLabels: hook.positionLabels,
        clues: clues,
        failureHints: hook.failureHints,
        completionExplanation: hook.completionExplanation,
        archiveStory: hook.archiveStory || ("你把“" + hook.title + "”的线索按经过整理在一起，沿途细节终于形成了一份能够反复查阅的完整记录。"),
        unlocks: Array.isArray(hook.archiveUnlocks) ? hook.archiveUnlocks.slice() : [],
        reward: hook.reward || null,
        keyItemId: ""
      }));
    });
  });
  const fragmentIds = Array.isArray(typeof ADVENTURE_ROUTE_MAP_FRAGMENT_IDS !== "undefined" ? ADVENTURE_ROUTE_MAP_FRAGMENT_IDS : null)
    ? ADVENTURE_ROUTE_MAP_FRAGMENT_IDS
    : ["rangerLeafRouteMark", "southSupplyCode", "oldForestryCoordinate"];
  const routeMapConfig = typeof ADVENTURE_ROUTE_MAP_STORY_CONFIG === "object" && ADVENTURE_ROUTE_MAP_STORY_CONFIG ? ADVENTURE_ROUTE_MAP_STORY_CONFIG : {};
  const routeMapClueConfig = Array.isArray(routeMapConfig.clues) ? routeMapConfig.clues : [];
  stories.push(createAdventureStoryDefinition({
    id: ADVENTURE_ROUTE_MAP_STORY_ID,
    mapId: "deepMountain",
    hookId: "",
    title: "受潮的调查路线图",
    sortingRule: routeMapConfig.sortingRule,
    instruction: routeMapConfig.instruction,
    positionLabels: routeMapConfig.positionLabels,
    clues: fragmentIds.map(function(clueId) {
      const configured = routeMapClueConfig.find(function(clue) { return clue && clue.id === clueId; }) || {};
      return Object.assign({ id: clueId, label: getAdventureKeyClueName(clueId), eventIds: [], flagIds: [], routeIds: [] }, configured);
    }),
    failureHints: routeMapConfig.failureHints,
    completionExplanation: routeMapConfig.completionExplanation,
    archiveStory: "叶片标记对应溪谷末端，南行补给编号指向低地调查站，旧林务坐标则补全了 S-17 / E-04 网格。三条受潮记录拼成了一条通往雾雨林的停用路线。",
    unlocks: [{ type: "keyItem", keyItemId: "dampRouteMap" }, { type: "map", mapId: "fogRainforest" }],
    reward: null,
    keyItemId: "dampRouteMap"
  }));
  return stories;
}

function getAdventureStoryDefinition(storyId) {
  return getAdventureStoryDefinitions().find(function(story) { return story.id === storyId; }) || null;
}

function getAdventureStoryFoundClueIds(progress, story) {
  if (!story) return [];
  const validIds = story.clues.map(function(clue) { return clue.id; });
  const source = story.id === ADVENTURE_ROUTE_MAP_STORY_ID
    ? (progress && progress.keyClues)
    : (progress && progress.hookClues && progress.hookClues[story.mapId] && progress.hookClues[story.mapId][story.hookId]);
  return Array.from(new Set((Array.isArray(source) ? source : []).filter(function(clueId) {
    return validIds.indexOf(clueId) !== -1;
  })));
}

function sanitizeAdventureStoryStates(source, progressParts) {
  const sourceStates = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const progress = progressParts || {};
  const clean = {};
  getAdventureStoryDefinitions().forEach(function(story) {
    const saved = sourceStates[story.id] && typeof sourceStates[story.id] === "object" ? sourceStates[story.id] : {};
    const foundIds = getAdventureStoryFoundClueIds(progress, story);
    const complete = story.clues.length > 0 && foundIds.length >= story.clues.length;
    const legacyRouteMapArchive = story.id === ADVENTURE_ROUTE_MAP_STORY_ID && Array.isArray(progress.unlockedMaps) && progress.unlockedMaps.indexOf("fogRainforest") !== -1;
    const archived = saved.status === "archived" || legacyRouteMapArchive;
    const savedUnlockLabels = sanitizeAdventureStringArray(saved.unlockLabels, 12).filter(function(label) {
      return label.indexOf("记录：") !== 0 &&
        label !== "白影留下的雾痕记录" &&
        label !== "路线拓印" &&
        label !== "旧瞭望塔路线拓印";
    });
    const configuredUnlockLabels = archived ? getAdventureStoryUnlockLabels(story) : [];
    clean[story.id] = {
      status: archived ? "archived" : (complete ? "ready" : "collecting"),
      completedAt: archived ? Math.max(0, Number(saved.completedAt) || 0) : 0,
      clueOrder: archived
        ? getAdventureStoryCorrectOrder(story)
        : [],
      storyText: archived ? (typeof saved.storyText === "string" && saved.storyText ? saved.storyText.slice(0, 1600) : story.archiveStory) : "",
      unlockLabels: archived ? Array.from(new Set(savedUnlockLabels.concat(configuredUnlockLabels))) : []
    };
  });
  return clean;
}

function getAdventureStoryState(progress, storyId) {
  const story = getAdventureStoryDefinition(storyId);
  const saved = progress && progress.storyStates && progress.storyStates[storyId];
  if (saved) return saved;
  const found = getAdventureStoryFoundClueIds(progress, story).length;
  return { status: story && found >= story.clues.length ? "ready" : "collecting", completedAt: 0, clueOrder: [], storyText: "", unlockLabels: [] };
}

function refreshAdventureStoryStates(progress) {
  const target = progress || ensureAdventureProgress();
  target.storyStates = sanitizeAdventureStoryStates(target.storyStates, target);
  return target.storyStates;
}

function isAdventureStoryArchived(progress, mapId, hookId) {
  return getAdventureStoryState(progress || ensureAdventureProgress(), mapId + ":" + hookId).status === "archived";
}

function sanitizeAdventureKeyItemIds(source) {
  return Array.from(new Set((Array.isArray(source) ? source : []).filter(function(id) {
    return id === "dampRouteMap";
  })));
}

function sanitizeAdventureRecipeDiscoveryPity(source) {
  const clean = {};
  const values = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  Object.keys(typeof cookingRecipeCatalog === "object" && cookingRecipeCatalog ? cookingRecipeCatalog : {}).forEach(function(recipeId) {
    const recipe = cookingRecipeCatalog[recipeId];
    if (recipe.sourceType === "exploration") clean[recipeId] = clampAdventureValue(Math.floor(Number(values[recipeId]) || 0), 0, 3);
  });
  return clean;
}

function isAdventureRecipeUnlockedForDisplay(recipeId) {
  if (typeof isCookingRecipeUnlocked === "function") {
    return isCookingRecipeUnlocked(recipeId);
  }
  const cooking = gameState && gameState.cooking && Array.isArray(gameState.cooking.unlockedRecipes)
    ? gameState.cooking.unlockedRecipes
    : [];
  return cooking.indexOf(recipeId) !== -1;
}

function getAdventureRouteResourceSummary(mapId, routeId) {
  const routes = getAdventureMapRoutes(mapId);
  const route = routes[routeId] || routes[getAdventureMapDefaultRouteId(mapId)] || {};
  const ingredients = sanitizeAdventureStringArray(route.resourceIds, 12).map(getAdventureIngredientName);
  const lockedRecipes = sanitizeAdventureStringArray(route.recipeIds, 12).filter(function(recipeId) {
    return !isAdventureRecipeUnlockedForDisplay(recipeId);
  });
  const lines = [];
  lines.push("当前路线可能获得：" + (ingredients.length ? ingredients.join("、") : "暂无专属原料"));
  lines.push("尚未发现菜谱：" + lockedRecipes.length);
  if (lockedRecipes.length) {
    const sourceHints = Array.from(new Set(lockedRecipes.map(function(recipeId) {
      const recipe = cookingRecipeCatalog[recipeId];
      return recipe && recipe.sourceHint ? recipe.sourceHint : "继续探索";
    })));
    lines.push("可能来源：" + sourceHints.join(" / "));
  } else {
    lines.push("本路线菜谱已全部掌握");
  }
  return "\n" + lines.join("\n");
}

function getAdventureMapRoutes(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.routes ? map.routes : DEEP_MOUNTAIN_ADVENTURE_ROUTES;
}

function getAdventureRoutePresentation(mapId, routeId) {
  const routes = getAdventureMapRoutes(mapId);
  const route = routes[routeId] || routes[getAdventureMapDefaultRouteId(mapId)];
  return route && route.presentation ? route.presentation : {};
}

function getAdventureCssImage(path) {
  if (!path) return "none";
  const cleanPath = String(path).replace(/[\r\n\"]/g, "");
  let resolvedPath = cleanPath;
  try {
    resolvedPath = new URL(cleanPath, document.baseURI).href;
  } catch (error) {
    resolvedPath = cleanPath;
  }
  return "url(\"" + resolvedPath.replace(/\"/g, "") + "\")";
}

function applyAdventureMapPresentation(mapId) {
  const map = getAdventureMap(mapId);
  if (!map || !map.scene) return;
  const selection = map.selection || {};
  const scene = map.scene;
  if (adventurePrototype) {
    getAdventureMapIds().forEach(function(id) {
      const mapClass = getAdventureMap(id).selection && getAdventureMap(id).selection.className;
      if (mapClass) adventurePrototype.classList.remove(mapClass);
    });
    if (selection.className) adventurePrototype.classList.add(selection.className);
    adventurePrototype.style.setProperty("--adventure-event-prop-image", getAdventureCssImage(scene.eventPropSheet));
    adventurePrototype.style.setProperty("--adventure-foreground-image", getAdventureCssImage(scene.foreground));
    adventurePrototype.style.setProperty("--adventure-item-sheet-image", getAdventureCssImage(scene.itemSheet));
  }
  if (adventureScene) adventureScene.dataset.mapId = map.id;
  if (adventureBackground && scene.background) {
    adventureBackground.src = scene.background;
    adventureBackground.alt = map.name + "冒险场景";
  }
  const panelBackground = "linear-gradient(180deg, transparent 45%, rgba(7, 15, 10, 0.76)), " + getAdventureCssImage(scene.background);
  if (adventurePrepIllustration) adventurePrepIllustration.style.backgroundImage = panelBackground;
  if (adventureLogIllustration) adventureLogIllustration.style.backgroundImage = panelBackground;
  if (adventureHeaderEyebrow) adventureHeaderEyebrow.textContent = selection.eyebrow || "Solo Adventure";
  if (adventureHeaderTitle) adventureHeaderTitle.textContent = map.name;
  if (adventurePrepMapEyebrow) adventurePrepMapEyebrow.textContent = selection.eyebrow || map.name;
}

function applyAdventureRoutePresentation(mapId, routeId) {
  const map = getAdventureMap(mapId);
  applyAdventureMapPresentation(map.id);
  const routes = getAdventureMapRoutes(map.id);
  const route = routes[routeId] || routes[getAdventureMapDefaultRouteId(map.id)];
  const presentation = route && route.presentation ? route.presentation : {};
  if (adventurePrototype) {
    Object.keys(routes).forEach(function(id) {
      const routeClass = routes[id].presentation && routes[id].presentation.className;
      if (routeClass) adventurePrototype.classList.remove(routeClass);
    });
    if (presentation.className) adventurePrototype.classList.add(presentation.className);
  }
  if (adventureScene) adventureScene.dataset.routeId = route ? route.id : "";
  if (adventureBackground) adventureBackground.style.objectPosition = presentation.cameraPosition || "center";
  if (adventurePrepIllustration) adventurePrepIllustration.style.backgroundPosition = presentation.prepPosition || "center 42%";
  if (adventurePrepIllustrationCaption) adventurePrepIllustrationCaption.textContent = map.name + " · " + (route ? route.name : "自由探索");
}

function resetAdventureRouteAtmosphere() {
  if (!adventureAtmosphere) return;
  adventureAtmosphere.className = "adventure-atmosphere";
  const presentation = getAdventureRoutePresentation(getActiveAdventureMapId(), adventurePrototypeState.trip ? adventurePrototypeState.trip.routeId : adventurePrototypeState.draftRouteId);
  if (presentation.ambientClass) adventureAtmosphere.classList.add(presentation.ambientClass);
}

function getAdventureMapEvents(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.events ? map.events : DEEP_MOUNTAIN_ADVENTURE_EVENTS;
}

function getAdventureMapLocations(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.locations ? map.locations : ADVENTURE_LOCATION_CATALOG;
}

function getAllAdventureLocations() {
  return getAdventureMapIds().reduce(function(locations, mapId) {
    return Object.assign(locations, getAdventureMapLocations(mapId));
  }, {});
}

function isAdventureLocationId(locationId) {
  return Boolean(getAllAdventureLocations()[locationId]);
}

function getAdventureMapPathPoints(mapId) {
  const map = getAdventureMap(mapId);
  const points = map && map.scene && Array.isArray(map.scene.pathPoints) ? map.scene.pathPoints : ADVENTURE_PROTOTYPE_PATH_POINTS;
  return points.length ? points : ADVENTURE_PROTOTYPE_PATH_POINTS;
}

function getAdventureMapPropSheetPositions(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.scene && map.scene.propSheetPositions ? map.scene.propSheetPositions : DEEP_MOUNTAIN_PROP_SHEET_POSITIONS;
}

function getAdventureEventDefinitionById(mapId, eventId) {
  return getAdventureMapEvents(mapId).find(function(eventDefinition) {
    return eventDefinition.id === eventId;
  }) || null;
}

function getAdventureMapReactionRequirements(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.reactionItemRequirements ? map.reactionItemRequirements : ADVENTURE_REACTION_ITEM_REQUIREMENTS;
}

function getAdventureMapItemSolutionEffects(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.itemSolutionEffects ? map.itemSolutionEffects : ADVENTURE_ITEM_SOLUTION_EFFECTS;
}

function getAdventureMapMissingItemFeedback(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.missingItemFeedback ? map.missingItemFeedback : ADVENTURE_MISSING_ITEM_FEEDBACK;
}

function getAdventureMapEventConsequences(mapId) {
  const map = getAdventureMap(mapId);
  return map && map.eventConsequences ? map.eventConsequences : ADVENTURE_EVENT_CONSEQUENCES;
}

function isAdventureItemSolutionId(solutionId) {
  return getAdventureMapIds().some(function(mapId) {
    return Boolean(getAdventureMapItemSolutionEffects(mapId)[solutionId]);
  });
}

function getActiveAdventureMapId() {
  return adventurePrototypeState.trip && adventurePrototypeState.trip.mapId
    ? adventurePrototypeState.trip.mapId
    : (adventurePrototypeState.draftMapId || getDefaultAdventureMapId());
}

function getAdventureMapDefaultHookId(mapId) {
  const map = getAdventureMap(mapId);
  const hooks = getAdventureMapHooks(mapId);
  const configuredId = map && (map.defaultHookId || map.defaultGoalId);
  return configuredId && hooks[configuredId] ? configuredId : Object.keys(hooks)[0];
}

function getAdventureMapDefaultRouteId(mapId) {
  const map = getAdventureMap(mapId);
  const routes = getAdventureMapRoutes(mapId);
  return map && routes[map.defaultRouteId] ? map.defaultRouteId : Object.keys(routes)[0];
}

function createAdventureHookSnapshot(hook, source, introOverride) {
  if (!hook) return null;
  return {
    id: hook.id,
    title: hook.title || hook.name || "沿途的新动静",
    intro: introOverride || hook.intro || hook.rumorIntro || hook.shortDescription || "沿途也许会遇见一些没有预料到的事情。",
    relatedEventIds: sanitizeAdventureStringArray(hook.relatedEventIds || hook.relatedEvents, 12),
    source: ["unfinishedClue", "mapState", "recentHistory", "routeRumor", "fallback"].indexOf(source) !== -1 ? source : "fallback"
  };
}

function createFallbackAdventureHook(mapId, routeId) {
  const map = getAdventureMap(mapId);
  const routes = getAdventureMapRoutes(map.id);
  const route = routes[routeId] || routes[getAdventureMapDefaultRouteId(map.id)];
  const relatedEventIds = Object.keys(route && route.eventWeights ? route.eventWeights : {})
    .sort(function(left, right) { return Number(route.eventWeights[right]) - Number(route.eventWeights[left]); })
    .slice(0, 3);
  return {
    id: "openExploration",
    title: route ? route.name + "上的新动静" : map.name + "里的普通一天",
    intro: route ? "这次只沿着" + route.name + "走走，看看山里今天留下了什么。" : "这次没有特别牵挂，只是想看看沿途会发生什么。",
    relatedEventIds: relatedEventIds,
    source: "fallback"
  };
}

function sanitizeAdventureHookSnapshot(source, mapId, legacyHookId) {
  const hooks = getAdventureMapHooks(mapId);
  const sourceId = source && typeof source === "object" ? source.id : "";
  const hook = hooks[sourceId] || hooks[legacyHookId];
  if (hook) {
    return createAdventureHookSnapshot(
      hook,
      source && typeof source === "object" ? source.source : "recentHistory",
      source && typeof source.intro === "string" ? source.intro : ""
    );
  }
  if (source && typeof source === "object" && typeof source.title === "string") {
    return {
      id: typeof source.id === "string" ? source.id : "openExploration",
      title: source.title.slice(0, 80),
      intro: typeof source.intro === "string" ? source.intro.slice(0, 240) : "沿途也许会遇见一些没有预料到的事情。",
      relatedEventIds: sanitizeAdventureStringArray(source.relatedEventIds, 12).filter(function(eventId) {
        return Boolean(getAdventureEventDefinitionById(mapId, eventId));
      }),
      source: ["unfinishedClue", "mapState", "recentHistory", "routeRumor", "fallback"].indexOf(source.source) !== -1 ? source.source : "fallback"
    };
  }
  return null;
}

function getAdventureHookItemMatch(hook, backpack) {
  return (hook.relatedItems || []).some(function(requirement) {
    if (requirement.indexOf("category:") === 0) {
      const category = requirement.slice(9);
      return Object.keys(backpack || {}).some(function(key) {
        const descriptor = getAdventureItemDescriptor(key);
        return (Number(backpack[key]) || 0) > 0 && descriptor && (descriptor.type === category || descriptor.category === category);
      });
    }
    return (Number(backpack && backpack["item:" + requirement]) || 0) > 0;
  });
}

function chooseAdventureHook(mapId, routeId, progress, backpack, previousHookId, excludedHookId) {
  const map = getAdventureMap(mapId);
  const hooks = getAdventureMapHooks(mapId);
  const hookEntries = Object.keys(hooks).filter(function(hookId) {
    return hookId !== excludedHookId && isAdventureHookRouteEligible(mapId, hooks[hookId], routeId, progress);
  }).map(function(hookId) {
    const hook = hooks[hookId];
    let weight = Number(hook.routeWeight) || 4;
    let source = "routeRumor";
    let introOverride = "";
    const clueProgress = getAdventureHookClueProgress(progress, mapId, hookId);
    const clueStage = progress.clueStages && progress.clueStages[hookId];
    if ((clueProgress.discovered && !clueProgress.complete) || (clueStage && clueStage !== "complete" && clueStage !== "resolved")) {
      weight += 18;
      source = "unfinishedClue";
    }
    const mapState = progress.mapStates && progress.mapStates[mapId] ? progress.mapStates[mapId] : {};
    const memories = progress.adventureMemories || {};
    const continuation = map && typeof map.getHookContinuation === "function"
      ? map.getHookContinuation(hookId, mapState, memories)
      : null;
    if (continuation && Number(continuation.weight) > 0) {
      weight += Number(continuation.weight);
      introOverride = typeof continuation.intro === "string" ? continuation.intro : "";
      if (source !== "unfinishedClue" && Number(continuation.weight) >= 3) source = "mapState";
    }
    const recent = (progress.recentAdventureHistory || []).slice(-3).reverse().find(function(entry) {
      return (entry.mapId || getDefaultAdventureMapId()) === mapId && (entry.hookId || entry.goalId) === hookId;
    });
    if (recent && ["continuing", "noResult", "partial", "incomplete"].indexOf(recent.outcomeType) !== -1) {
      weight += 3.5;
      if (source === "routeRumor") source = "recentHistory";
    }
    if (getAdventureHookItemMatch(hook, backpack)) weight += 1.25;
    const latestOnRoute = (progress.recentAdventureHistory || []).slice().reverse().find(function(entry) {
      return (entry.mapId || getDefaultAdventureMapId()) === mapId && entry.routeId === routeId;
    });
    if (latestOnRoute && (latestOnRoute.hookId || latestOnRoute.goalId) === hookId && source !== "unfinishedClue") {
      weight *= latestOnRoute.outcomeType === "found" || latestOnRoute.outcomeType === "diverted" ? 0.3 : 0.58;
    }
    if (previousHookId === hookId) weight *= 0.55;
    return { hook: hook, source: source, intro: introOverride, weight: Math.max(0.05, weight * (0.86 + Math.random() * 0.28)) };
  });
  if (!hookEntries.length && excludedHookId) return chooseAdventureHook(mapId, routeId, progress, backpack, previousHookId, "");
  if (!hookEntries.length) return createFallbackAdventureHook(mapId, routeId);
  const selected = pickWeightedAdventureEntry(hookEntries);
  return createAdventureHookSnapshot(
    selected.hook,
    selected.source,
    selected.intro || (selected.source === "routeRumor" ? selected.hook.rumorIntro : selected.hook.intro)
  );
}

function ensureDraftAdventureHook(forceNew) {
  const progress = ensureAdventureProgress();
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routeId = adventurePrototypeState.draftRouteId || getAdventureMapDefaultRouteId(mapId);
  const current = sanitizeAdventureHookSnapshot(adventurePrototypeState.draftAdventureHook, mapId);
  if (!forceNew && current) {
    adventurePrototypeState.draftAdventureHook = current;
    return current;
  }
  adventurePrototypeState.draftAdventureHook = chooseAdventureHook(
    mapId,
    routeId,
    progress,
    adventurePrototypeState.draftBackpack,
    forceNew && current ? current.id : ""
  );
  return adventurePrototypeState.draftAdventureHook;
}

function rerollDraftAdventureHook() {
  const progress = ensureAdventureProgress();
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routeId = adventurePrototypeState.draftRouteId || getAdventureMapDefaultRouteId(mapId);
  const current = sanitizeAdventureHookSnapshot(adventurePrototypeState.draftAdventureHook, mapId);
  adventurePrototypeState.draftAdventureHook = chooseAdventureHook(
    mapId,
    routeId,
    progress,
    adventurePrototypeState.draftBackpack,
    current ? current.id : "",
    current ? current.id : ""
  );
  return adventurePrototypeState.draftAdventureHook;
}

function sanitizeAdventureStringArray(source, limit) {
  const values = Array.isArray(source) ? source : [];
  return Array.from(new Set(values.filter(function(value) {
    return typeof value === "string" && value.length > 0 && value.length <= 120;
  }))).slice(0, limit || 80);
}

function createDefaultAdventureMapStates() {
  return getAdventureMapIds().reduce(function(states, mapId) {
    const map = getAdventureMap(mapId);
    states[mapId] = cloneAdventureData(map && map.localStateDefaults ? map.localStateDefaults : {});
    return states;
  }, {});
}

function sanitizeAdventureMapStates(source) {
  const sourceStates = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const states = createDefaultAdventureMapStates();
  getAdventureMapIds().forEach(function(mapId) {
    const current = sourceStates[mapId];
    if (current && typeof current === "object" && !Array.isArray(current)) {
      states[mapId] = Object.assign(states[mapId], cloneAdventureData(current));
    }
    const map = getAdventureMap(mapId);
    if (map && typeof map.sanitizeLocalState === "function") {
      states[mapId] = map.sanitizeLocalState(states[mapId]);
    }
  });
  return states;
}

function createDefaultAdventureMapVisitCounts() {
  return getAdventureMapIds().reduce(function(counts, mapId) {
    counts[mapId] = 0;
    return counts;
  }, {});
}

function sanitizeAdventureMapVisitCounts(source) {
  const clean = createDefaultAdventureMapVisitCounts();
  const sourceCounts = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  getAdventureMapIds().forEach(function(mapId) {
    clean[mapId] = Math.max(0, Math.floor(Number(sourceCounts[mapId]) || 0));
  });
  return clean;
}

function hasVisitedAdventureMap(progress, mapId) {
  const visits = progress && progress.mapVisitCounts && Number(progress.mapVisitCounts[mapId]);
  if (visits > 0) return true;
  return (progress && Array.isArray(progress.recentAdventureHistory) ? progress.recentAdventureHistory : []).some(function(entry) {
    return (entry.mapId || getDefaultAdventureMapId()) === mapId;
  });
}

function createDefaultAdventureMemories() {
  return {
    rescuedSomeone: 0,
    supernaturalEncounters: 0,
    seriousFalls: 0,
    animalTrust: 0,
    frightenedByApparition: 0,
    canopyCrossings: 0,
    stationRecordsRecovered: 0,
    sharedSymbolEncounters: 0,
    preferredTools: []
  };
}

function sanitizeAdventureMemories(source) {
  const memories = createDefaultAdventureMemories();
  const sourceMemories = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  memories.rescuedSomeone = clampAdventureValue(Math.floor(Number(sourceMemories.rescuedSomeone) || 0), 0, 25);
  memories.supernaturalEncounters = clampAdventureValue(Math.floor(Number(sourceMemories.supernaturalEncounters) || 0), 0, 99);
  memories.seriousFalls = clampAdventureValue(Math.floor(Number(sourceMemories.seriousFalls) || 0), 0, 25);
  memories.animalTrust = clampAdventureValue(Math.floor(Number(sourceMemories.animalTrust) || 0), -5, 5);
  memories.frightenedByApparition = clampAdventureValue(Math.floor(Number(sourceMemories.frightenedByApparition) || 0), 0, 50);
  memories.canopyCrossings = clampAdventureValue(Math.floor(Number(sourceMemories.canopyCrossings) || 0), 0, 99);
  memories.stationRecordsRecovered = clampAdventureValue(Math.floor(Number(sourceMemories.stationRecordsRecovered) || 0), 0, 99);
  memories.sharedSymbolEncounters = clampAdventureValue(Math.floor(Number(sourceMemories.sharedSymbolEncounters) || 0), 0, 99);
  memories.preferredTools = sanitizeAdventureStringArray(sourceMemories.preferredTools, 12).filter(function(itemId) {
    return Boolean(ADVENTURE_ITEM_CATALOG[itemId]);
  });
  return memories;
}

function getAdventureItemRule(itemId) {
  return ADVENTURE_ITEM_RULES[itemId] || { maxOwned: Infinity, carryable: true, repeatable: true };
}

function createDefaultAdventureProgress(now) {
  const defaultMapId = getDefaultAdventureMapId();
  const hookClues = sanitizeAdventureHookClues();
  const keyClues = [];
  return {
    version: ADVENTURE_SAVE_VERSION,
    storage: Object.assign({}, ADVENTURE_DEFAULT_STORAGE),
    stamina: {
      value: ADVENTURE_STAMINA_MAX,
      updatedAt: Number(now) || Date.now()
    },
    unlockedMaps: [defaultMapId],
    mapStates: createDefaultAdventureMapStates(),
    mapVisitCounts: createDefaultAdventureMapVisitCounts(),
    adventureMemories: createDefaultAdventureMemories(),
    unlockedRoutes: ["deepMountain"],
    unlockedLocations: ["deepMountain"],
    discoveredKeyItems: [],
    discoveredClues: [],
    keyClues: keyClues,
    hookClues: hookClues,
    storyStates: sanitizeAdventureStoryStates({}, { unlockedMaps: [defaultMapId], keyClues: keyClues, hookClues: hookClues }),
    journeyLogs: [],
    pendingKeyItemReveal: "",
    revealedKeyItems: [],
    recipeDiscoveryPity: sanitizeAdventureRecipeDiscoveryPity(),
    clueStages: {},
    crossMapMysteryFlags: {},
    collectedClues: [],
    itemSolutionKnowledge: [],
    adventureStarterKitMigrationVersion: ADVENTURE_STARTER_KIT_MIGRATION_VERSION,
    completedTrips: 0,
    pendingBackpack: {},
    pendingLoot: {},
    pendingTripSnapshot: null,
    recentAdventureHistory: [],
    lastLog: null
  };
}

function isValidAdventureBackpackKey(key) {
  if (typeof key !== "string") {
    return false;
  }
  const parts = key.split(":");
  if (parts.length !== 2) {
    return false;
  }
  if (parts[0] === "fish") {
    return Boolean(fishCatalog[parts[1]]);
  }
  if (parts[0] === "meal") {
    return Boolean(mealCatalog[parts[1]]);
  }
  return parts[0] === "item" && Boolean(ADVENTURE_ITEM_CATALOG[parts[1]]);
}

function sanitizeAdventureBackpackMap(source) {
  const clean = {};
  Object.keys(source && typeof source === "object" ? source : {}).forEach(function(key) {
    const count = Math.max(0, Math.floor(Number(source[key]) || 0));
    if (count > 0 && isValidAdventureBackpackKey(key)) {
      clean[key] = count;
    }
  });
  return clean;
}

function sanitizeAdventureIngredientCountMap(source) {
  const catalog = typeof ingredientCatalog === "object" && ingredientCatalog ? ingredientCatalog : {};
  const clean = {};
  Object.keys(source && typeof source === "object" ? source : {}).forEach(function(key) {
    const count = Math.max(0, Math.floor(Number(source[key]) || 0));
    if (count > 0 && catalog[key]) clean[key] = count;
  });
  return clean;
}

function sanitizeAdventureImportantDiscoveries(source) {
  return (Array.isArray(source) ? source : []).filter(function(entry) {
    return entry && typeof entry.id === "string" && typeof entry.title === "string";
  }).slice(0, 8).map(function(entry) {
    return {
      id: entry.id.slice(0, 80),
      title: entry.title.slice(0, 100),
      lines: Array.isArray(entry.lines) ? entry.lines.filter(function(line) { return typeof line === "string"; }).slice(0, 8) : []
    };
  });
}

function sanitizeAdventureHookClueProgressSnapshot(source, mapId, hookId) {
  const snapshot = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const definitionTotal = getAdventureHookClueDefinitions(mapId, hookId).length;
  const total = Math.max(definitionTotal, Math.floor(Number(snapshot.total) || 0));
  const found = clampAdventureValue(Math.floor(Number(snapshot.found) || 0), 0, total || 0);
  return {
    found: found,
    total: total,
    remaining: Math.max(0, total - found),
    complete: total > 0 && found >= total,
    discovered: found > 0
  };
}

function sanitizeAdventureInjuryRecords(source) {
  return (Array.isArray(source) ? source : []).filter(function(record) {
    return record && ADVENTURE_INJURY_CATALOG[record.id];
  }).slice(0, 12).map(function(record) {
    const injury = ADVENTURE_INJURY_CATALOG[record.id];
    return {
      id: record.id,
      label: injury.label,
      description: typeof record.description === "string" ? record.description.slice(0, 180) : injury.description,
      treated: Boolean(record.treated)
    };
  });
}

function sanitizeAdventureTreatmentRecords(source) {
  return (Array.isArray(source) ? source : []).filter(function(record) {
    return record && Array.isArray(record.injuryIds);
  }).slice(0, 12).map(function(record) {
    return {
      injuryIds: record.injuryIds.filter(function(injuryId) { return Boolean(ADVENTURE_INJURY_CATALOG[injuryId]); }),
      text: typeof record.text === "string" ? record.text.slice(0, 360) : "使用急救包处理了伤势。"
    };
  });
}

function sanitizeAdventureLog(log) {
  if (!log || typeof log !== "object" || Array.isArray(log)) {
    return null;
  }
  const maps = getAdventureMapRegistry();
  const mapId = maps[log.mapId] && isAdventureMapPlayable(log.mapId)
    ? log.mapId
    : (maps[log.locationId] && isAdventureMapPlayable(log.locationId) ? log.locationId : getDefaultAdventureMapId());
  const map = getAdventureMap(mapId);
  const hooks = getAdventureMapHooks(map.id);
  const routes = getAdventureMapRoutes(map.id);
  const locations = getAdventureMapLocations(map.id);
  const legacyHookId = hooks[log.goalId] ? log.goalId : "";
  const hook = sanitizeAdventureHookSnapshot(log.adventureHook, map.id, legacyHookId) || createFallbackAdventureHook(map.id, log.routeId);
  const legacyResultMap = { complete: "found", partial: "continuing", incomplete: "noResult", unexpected: "diverted" };
  const hookResult = ["found", "continuing", "noResult", "diverted"].indexOf(log.hookResult) !== -1
    ? log.hookResult
    : (legacyResultMap[log.goalResult] || "noResult");
  return {
    id: typeof log.id === "string" ? log.id : "",
    createdAt: Math.max(0, Number(log.createdAt) || 0),
    mapId: map.id,
    locationId: locations[log.locationId] ? log.locationId : map.id,
    routeId: routes[log.routeId] ? log.routeId : getAdventureMapDefaultRouteId(map.id),
    adventureHook: hook,
    hookResult: hookResult,
    hookScore: Math.max(0, Math.floor(Number(log.hookScore !== undefined ? log.hookScore : log.goalScore) || 0)),
    storyIntro: typeof log.storyIntro === "string" ? log.storyIntro : "",
    storyBeats: Array.isArray(log.storyBeats) ? log.storyBeats.filter(function(beat) { return typeof beat === "string"; }).slice(0, ADVENTURE_MAX_EVENTS_PER_TRIP + 2) : [],
    storyEnding: typeof log.storyEnding === "string" ? log.storyEnding : "",
    participants: sanitizeAdventureParticipants(log.participants, ADVENTURE_FUTURE_PARTY_MAX),
    participantHighlights: sanitizeAdventureParticipantHighlights(log.participantHighlights),
    rewardNotes: Array.isArray(log.rewardNotes) ? log.rewardNotes.filter(function(note) { return typeof note === "string"; }).slice(0, 4).map(function(note) {
      return note.replace(/^目标奖励：/, "本次发现：");
    }) : [],
    newHookClues: Array.isArray(log.newHookClues) ? log.newHookClues.filter(function(clue) {
      return clue && typeof clue.id === "string" && typeof clue.label === "string";
    }).slice(0, 8).map(function(clue) {
      return { id: clue.id.slice(0, 80), label: clue.label.slice(0, 100) };
    }) : [],
    hookClueProgress: sanitizeAdventureHookClueProgressSnapshot(log.hookClueProgress, map.id, hook.id),
    keyCluesFound: sanitizeAdventureKeyClues(log.keyCluesFound),
    importantDiscoveries: sanitizeAdventureImportantDiscoveries(log.importantDiscoveries),
    events: Array.isArray(log.events) ? log.events.slice(0, ADVENTURE_MAX_EVENTS_PER_TRIP).map(function(entry) {
      return {
        eventId: typeof entry.eventId === "string" ? entry.eventId : "",
        title: typeof entry.title === "string" ? entry.title : "未知事件",
        reactionType: typeof entry.reactionType === "string" ? entry.reactionType : "观察",
        bubble: typeof entry.bubble === "string" ? entry.bubble : "",
        result: typeof entry.result === "string" ? entry.result : "",
        outcomeTier: ADVENTURE_PROTOTYPE_OUTCOME_ORDER.indexOf(entry.outcomeTier) !== -1 ? entry.outcomeTier : "mixed",
        effectText: typeof entry.effectText === "string" ? entry.effectText : "",
        itemNotes: Array.isArray(entry.itemNotes) ? entry.itemNotes.filter(function(note) { return typeof note === "string"; }).slice(0, 8) : [],
        storyText: typeof entry.storyText === "string" ? entry.storyText : "",
        chainId: typeof entry.chainId === "string" ? entry.chainId : "",
        usedItemKey: isValidAdventureBackpackKey(entry.usedItemKey) ? entry.usedItemKey : "",
        missedItemOpportunity: Boolean(entry.missedItemOpportunity),
        participants: sanitizeAdventureEventParticipantRefs(entry.participants),
        actorCamperId: typeof entry.actorCamperId === "string" ? entry.actorCamperId : "localCamper",
        helperCamperIds: sanitizeAdventureStringArray(entry.helperCamperIds, 3),
        itemOwnerId: typeof entry.itemOwnerId === "string" ? entry.itemOwnerId : "",
        contributorIds: sanitizeAdventureStringArray(entry.contributorIds, 4),
        decisionSource: ADVENTURE_PARTY_DECISION_SOURCES.indexOf(entry.decisionSource) !== -1 ? entry.decisionSource : "auto",
        participantObservations: sanitizeAdventureParticipantObservations(entry.participantObservations),
        participationText: typeof entry.participationText === "string" ? entry.participationText.slice(0, 360) : "",
        injuriesAdded: sanitizeAdventureInjuryRecords(entry.injuriesAdded),
        injuriesTreated: sanitizeAdventureTreatmentRecords(entry.injuriesTreated)
      };
    }) : [],
    gained: sanitizeAdventureBackpackMap(log.gained),
    gainedIngredients: sanitizeAdventureIngredientCountMap(log.gainedIngredients),
    departedWith: sanitizeAdventureBackpackMap(log.departedWith),
    lost: sanitizeAdventureBackpackMap(log.lost),
    consumed: sanitizeAdventureBackpackMap(log.consumed),
    unlockedRecipes: Array.isArray(log.unlockedRecipes) ? Array.from(new Set(log.unlockedRecipes.filter(function(recipeId) {
      const recipes = typeof cookingRecipeCatalog === "object" && cookingRecipeCatalog ? cookingRecipeCatalog : {};
      return Boolean(recipes[recipeId]);
    }))) : [],
    unlocked: Array.isArray(log.unlocked) ? log.unlocked.filter(function(id) { return Boolean(locations[id]); }) : [],
    unlockedMaps: Array.isArray(log.unlockedMaps) ? log.unlockedMaps.filter(function(id) { return Boolean(getAdventureMapRegistry()[id]) && isAdventureMapPlayable(id); }) : [],
    injuries: sanitizeAdventureInjuryRecords(log.injuries),
    treatments: sanitizeAdventureTreatmentRecords(log.treatments),
    staminaStart: clampAdventureValue(log.staminaStart, 0, ADVENTURE_STAMINA_MAX),
    staminaEnd: clampAdventureValue(log.staminaEnd, 0, ADVENTURE_STAMINA_MAX),
    endReason: typeof log.endReason === "string" ? log.endReason : "routeComplete",
    endLabel: typeof log.endLabel === "string" ? log.endLabel : "完成路线",
    highlightEventId: typeof log.highlightEventId === "string" ? log.highlightEventId : ""
  };
}

function sanitizeAdventureProgress(progress) {
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    return createDefaultAdventureProgress(Date.now());
  }
  const storageSource = progress.storage && typeof progress.storage === "object" ? progress.storage : {};
  const storage = {};
  const knownMaps = typeof ADVENTURE_MAPS === "object" && ADVENTURE_MAPS ? ADVENTURE_MAPS : {};
  const defaultMapId = getDefaultAdventureMapId();
  const unlockedMaps = sanitizeAdventureStringArray(progress.unlockedMaps, 20).filter(function(mapId) {
    return Boolean(knownMaps[mapId]);
  });
  if (unlockedMaps.indexOf(defaultMapId) === -1) {
    unlockedMaps.unshift(defaultMapId);
  }
  Object.keys(ADVENTURE_ITEM_CATALOG).forEach(function(itemId) {
    const rule = getAdventureItemRule(itemId);
    const count = Math.min(rule.maxOwned, Math.max(0, Math.floor(Number(storageSource[itemId]) || 0)));
    if (count > 0) {
      storage[itemId] = count;
    }
  });
  const staminaSource = progress.stamina && typeof progress.stamina === "object" ? progress.stamina : {};
  const routeSource = Array.isArray(progress.unlockedRoutes) ? progress.unlockedRoutes : progress.unlockedLocations;
  const unlocked = Array.isArray(routeSource)
    ? routeSource.filter(isAdventureLocationId)
    : ["deepMountain"];
  if (unlocked.indexOf("deepMountain") === -1) {
    unlocked.unshift("deepMountain");
  }
  const pendingBackpack = sanitizeAdventureBackpackMap(progress.pendingBackpack);
  const pendingLoot = sanitizeAdventureBackpackMap(progress.pendingLoot);
  const pendingSource = progress.pendingTripSnapshot && typeof progress.pendingTripSnapshot === "object" ? progress.pendingTripSnapshot : null;
  const pendingMapId = pendingSource && knownMaps[pendingSource.mapId] && isAdventureMapPlayable(pendingSource.mapId) ? pendingSource.mapId : defaultMapId;
  const pendingRoutes = getAdventureMapRoutes(pendingMapId);
  const pendingTripSnapshot = pendingSource ? {
    mapId: pendingMapId,
    routeId: pendingRoutes[pendingSource.routeId] ? pendingSource.routeId : getAdventureMapDefaultRouteId(pendingMapId),
    adventureHook: sanitizeAdventureHookSnapshot(pendingSource.adventureHook, pendingMapId, pendingSource.goalId)
  } : null;
  const log = sanitizeAdventureLog(progress.lastLog);
  const sourceVersion = Math.max(0, Math.floor(Number(progress.version) || 0));
  const recordedLetter = Boolean(storage.sealedLetter) || Boolean(log && log.gained["item:sealedLetter"]);
  const discoveredSource = sourceVersion >= 3
    ? (Array.isArray(progress.discoveredKeyItems) ? progress.discoveredKeyItems : progress.collectedClues)
    : (recordedLetter ? ["sealedLetter"] : []);
  const discoveredKeyItems = Array.from(new Set((Array.isArray(discoveredSource) ? discoveredSource : []).filter(function(id) {
    return id === "sealedLetter";
  })));
  const keyClueSource = Array.isArray(progress.keyClues) ? progress.keyClues : [];
  const keyClues = sanitizeAdventureKeyClues(keyClueSource, unlockedMaps);
  const hookClues = sanitizeAdventureHookClues(progress.hookClues);
  const storyStates = sanitizeAdventureStoryStates(progress.storyStates, {
    unlockedMaps: unlockedMaps,
    keyClues: keyClues,
    hookClues: hookClues
  });
  const journeyLogs = (Array.isArray(progress.journeyLogs) ? progress.journeyLogs : []).map(sanitizeAdventureLog).filter(Boolean);
  if (log && !journeyLogs.some(function(entry) { return entry.id && entry.id === log.id; })) journeyLogs.push(log);
  const oldRainforestUnlock = unlockedMaps.indexOf("fogRainforest") !== -1 && !progress.storyStates;
  const revealedKeyItems = sanitizeAdventureKeyItemIds(progress.revealedKeyItems);
  if (oldRainforestUnlock && revealedKeyItems.indexOf("dampRouteMap") === -1) revealedKeyItems.push("dampRouteMap");
  const pendingKeyItemReveal = progress.pendingKeyItemReveal === "dampRouteMap" && revealedKeyItems.indexOf("dampRouteMap") === -1
    ? "dampRouteMap"
    : "";
  let starterKitMigrationVersion = Math.max(0, Math.floor(Number(progress.adventureStarterKitMigrationVersion) || 0));
  if (starterKitMigrationVersion < ADVENTURE_STARTER_KIT_MIGRATION_VERSION) {
    const gatewayItemIds = ["fieldLantern", "ropeKit", "repairToolkit", "oldKey", "forestCharm", "trailMap", "silverCompass", "rangerToken"];
    const activeTripBackpack = typeof adventurePrototypeState !== "undefined" && adventurePrototypeState.trip
      ? adventurePrototypeState.trip.backpack
      : {};
    const activeTripLoot = typeof adventurePrototypeState !== "undefined" && adventurePrototypeState.trip
      ? adventurePrototypeState.trip.loot
      : {};
    const hasGatewayItem = gatewayItemIds.some(function(itemId) {
      return (Number(storage[itemId]) || 0) > 0 ||
        (Number(pendingBackpack["item:" + itemId]) || 0) > 0 ||
        (Number(pendingLoot["item:" + itemId]) || 0) > 0 ||
        (Number(activeTripBackpack && activeTripBackpack["item:" + itemId]) || 0) > 0 ||
        (Number(activeTripLoot && activeTripLoot["item:" + itemId]) || 0) > 0;
    });
    if (!hasGatewayItem) {
      storage.fieldLantern = Math.max(1, Number(storage.fieldLantern) || 0);
      storage.ropeKit = Math.max(1, Number(storage.ropeKit) || 0);
      storage.trailRation = Math.max(1, Number(storage.trailRation) || 0);
    }
    starterKitMigrationVersion = ADVENTURE_STARTER_KIT_MIGRATION_VERSION;
  }
  const uniqueRoutes = Array.from(new Set(unlocked));
  const discoveredClues = Array.from(new Set((Array.isArray(progress.discoveredClues) ? progress.discoveredClues : []).filter(function(id) {
    return typeof id === "string" && id.length <= 80;
  })));
  const clueStages = progress.clueStages && typeof progress.clueStages === "object" && !Array.isArray(progress.clueStages)
    ? cloneAdventureData(progress.clueStages)
    : {};
  const crossMapMysteryFlags = progress.crossMapMysteryFlags && typeof progress.crossMapMysteryFlags === "object" && !Array.isArray(progress.crossMapMysteryFlags)
    ? cloneAdventureData(progress.crossMapMysteryFlags)
    : {};
  const recentAdventureHistory = (Array.isArray(progress.recentAdventureHistory) ? progress.recentAdventureHistory : []).filter(function(entry) {
    const historyMapId = entry && knownMaps[entry.mapId] ? entry.mapId : defaultMapId;
    const hookId = entry && (entry.hookId || entry.goalId);
    return entry && (hookId === "openExploration" || getAdventureMapHooks(historyMapId)[hookId]) && getAdventureMapRoutes(historyMapId)[entry.routeId];
  }).slice(-8).map(function(entry) {
    const historyMapId = knownMaps[entry.mapId] ? entry.mapId : defaultMapId;
    const hookId = entry.hookId || entry.goalId;
    const legacyOutcomeMap = { complete: "found", partial: "continuing", incomplete: "noResult", unexpected: "diverted" };
    return {
      mapId: historyMapId,
      hookId: hookId,
      routeId: entry.routeId,
      eventIds: Array.isArray(entry.eventIds) ? entry.eventIds.filter(function(id) {
        return Boolean(getAdventureEventDefinitionById(historyMapId, id));
      }).slice(0, ADVENTURE_MAX_EVENTS_PER_TRIP) : [],
      outcomeType: ["found", "continuing", "noResult", "diverted"].indexOf(entry.outcomeType) !== -1 ? entry.outcomeType : (legacyOutcomeMap[entry.outcomeType] || "noResult"),
      createdAt: Math.max(0, Number(entry.createdAt) || 0)
    };
  });
  const mapVisitCounts = sanitizeAdventureMapVisitCounts(progress.mapVisitCounts);
  recentAdventureHistory.forEach(function(entry) {
    mapVisitCounts[entry.mapId] = Math.max(mapVisitCounts[entry.mapId] || 0, 1);
  });
  return {
    version: ADVENTURE_SAVE_VERSION,
    storage: storage,
    stamina: {
      value: clampAdventureValue(staminaSource.value, 0, ADVENTURE_STAMINA_MAX),
      updatedAt: Math.max(0, Number(staminaSource.updatedAt) || Date.now())
    },
    unlockedMaps: unlockedMaps,
    mapStates: sanitizeAdventureMapStates(progress.mapStates),
    mapVisitCounts: mapVisitCounts,
    adventureMemories: sanitizeAdventureMemories(progress.adventureMemories),
    unlockedRoutes: uniqueRoutes,
    unlockedLocations: uniqueRoutes.slice(),
    discoveredKeyItems: discoveredKeyItems,
    discoveredClues: discoveredClues,
    keyClues: keyClues,
    hookClues: hookClues,
    storyStates: storyStates,
    journeyLogs: journeyLogs,
    pendingKeyItemReveal: pendingKeyItemReveal,
    revealedKeyItems: revealedKeyItems,
    recipeDiscoveryPity: sanitizeAdventureRecipeDiscoveryPity(progress.recipeDiscoveryPity),
    clueStages: clueStages,
    crossMapMysteryFlags: crossMapMysteryFlags,
    collectedClues: discoveredKeyItems.slice(),
    itemSolutionKnowledge: Array.isArray(progress.itemSolutionKnowledge)
      ? Array.from(new Set(progress.itemSolutionKnowledge.filter(function(id) { return typeof id === "string" && isAdventureItemSolutionId(id); })))
      : [],
    completedTrips: Math.max(0, Math.floor(Number(progress.completedTrips) || 0)),
    adventureStarterKitMigrationVersion: starterKitMigrationVersion,
    pendingBackpack: pendingBackpack,
    pendingLoot: pendingLoot,
    pendingTripSnapshot: pendingTripSnapshot,
    recentAdventureHistory: recentAdventureHistory,
    lastLog: log
  };
}

function ensureAdventureProgress(state, now) {
  const campState = state || gameState;
  const currentTime = Number(now) || Date.now();
  if (!campState.adventure ||
    Number(campState.adventure.version) !== ADVENTURE_SAVE_VERSION ||
    !Array.isArray(campState.adventure.unlockedMaps) ||
    !campState.adventure.mapStates ||
    !campState.adventure.mapVisitCounts ||
    !campState.adventure.adventureMemories ||
    !Array.isArray(campState.adventure.unlockedRoutes) ||
    !Array.isArray(campState.adventure.discoveredKeyItems) ||
    !Array.isArray(campState.adventure.discoveredClues) ||
    !Array.isArray(campState.adventure.keyClues) ||
    !campState.adventure.hookClues ||
    !campState.adventure.storyStates ||
    !Array.isArray(campState.adventure.journeyLogs) ||
    !Array.isArray(campState.adventure.revealedKeyItems) ||
    !campState.adventure.recipeDiscoveryPity ||
    !campState.adventure.clueStages ||
    !campState.adventure.crossMapMysteryFlags ||
    !Array.isArray(campState.adventure.recentAdventureHistory) ||
    !campState.adventure.pendingLoot ||
    Number(campState.adventure.adventureStarterKitMigrationVersion) < ADVENTURE_STARTER_KIT_MIGRATION_VERSION) {
    campState.adventure = sanitizeAdventureProgress(campState.adventure);
  }
  const progress = campState.adventure;
  const stamina = progress.stamina;
  const elapsed = Math.max(0, currentTime - stamina.updatedAt);
  const recovered = Math.floor(elapsed / ADVENTURE_STAMINA_REGEN_MS_PER_POINT);
  if (recovered > 0 && stamina.value < ADVENTURE_STAMINA_MAX) {
    stamina.value = Math.min(ADVENTURE_STAMINA_MAX, stamina.value + recovered);
    stamina.updatedAt = stamina.value >= ADVENTURE_STAMINA_MAX
      ? currentTime
      : stamina.updatedAt + recovered * ADVENTURE_STAMINA_REGEN_MS_PER_POINT;
  } else if (stamina.value >= ADVENTURE_STAMINA_MAX) {
    stamina.updatedAt = currentTime;
  }
  return progress;
}

function getAdventureItemDescriptor(key) {
  const parts = String(key || "").split(":");
  const type = parts[0];
  const itemId = parts[1];
  if (type === "fish" && fishCatalog[itemId]) {
    return {
      key: key,
      id: itemId,
      type: "fish",
      category: "fish",
      name: fishCatalog[itemId].displayName,
      detail: fishCatalog[itemId].rarityLabel,
      image: fishCatalog[itemId].image
    };
  }
  if (type === "meal" && mealCatalog[itemId]) {
    return {
      key: key,
      id: itemId,
      type: "meal",
      category: "meal",
      name: mealCatalog[itemId].displayName,
      detail: mealCatalog[itemId].detail,
      image: mealCatalog[itemId].image
    };
  }
  const special = type === "item" ? ADVENTURE_ITEM_CATALOG[itemId] : null;
  return special ? {
    key: key,
    id: itemId,
    type: "item",
    category: special.category,
    name: special.name,
    detail: special.detail,
    iconClass: special.iconClass,
    image: special.image,
    imagePosition: special.imagePosition,
    imageSize: special.imageSize,
    carryable: getAdventureItemRule(itemId).carryable !== false
  } : null;
}

function getAdventureStorageCount(key) {
  const descriptor = getAdventureItemDescriptor(key);
  if (!descriptor) {
    return 0;
  }
  if (descriptor.type === "fish") {
    return Math.max(0, Math.floor(Number(gameState.inventory.fish[descriptor.id]) || 0));
  }
  if (descriptor.type === "meal") {
    return Math.max(0, Math.floor(Number(gameState.inventory.meals[descriptor.id]) || 0));
  }
  return Math.max(0, Math.floor(Number(ensureAdventureProgress().storage[descriptor.id]) || 0));
}

function changeAdventureStorageCount(key, quantity) {
  const descriptor = getAdventureItemDescriptor(key);
  const amount = Math.trunc(Number(quantity) || 0);
  if (!descriptor || amount === 0) {
    return 0;
  }
  let bucket;
  if (descriptor.type === "fish") {
    bucket = gameState.inventory.fish;
  } else if (descriptor.type === "meal") {
    bucket = gameState.inventory.meals;
  } else {
    bucket = ensureAdventureProgress().storage;
  }
  if (amount > 0) {
    const rule = descriptor.type === "item" ? getAdventureItemRule(descriptor.id) : { maxOwned: Infinity };
    const room = Math.max(0, rule.maxOwned - (Number(bucket[descriptor.id]) || 0));
    return addAdventureCount(bucket, descriptor.id, Math.min(amount, room));
  }
  return -removeAdventureCount(bucket, descriptor.id, Math.abs(amount));
}

function getAdventureStorageEntries() {
  const entries = [];
  Object.keys(fishCatalog).forEach(function(itemId) {
    const key = "fish:" + itemId;
    const count = getAdventureStorageCount(key);
    if (count > 0) {
      entries.push({ key: key, count: count, descriptor: getAdventureItemDescriptor(key) });
    }
  });
  Object.keys(mealCatalog).forEach(function(itemId) {
    const key = "meal:" + itemId;
    const count = getAdventureStorageCount(key);
    if (count > 0) {
      entries.push({ key: key, count: count, descriptor: getAdventureItemDescriptor(key) });
    }
  });
  Object.keys(ADVENTURE_ITEM_CATALOG).forEach(function(itemId) {
    const key = "item:" + itemId;
    const count = getAdventureStorageCount(key);
    if (count > 0 && getAdventureItemRule(itemId).carryable !== false) {
      entries.push({ key: key, count: count, descriptor: getAdventureItemDescriptor(key) });
    }
  });
  return entries;
}

function getAdventureBackpackDisplayEntries(countMap) {
  return Object.keys(countMap || {}).map(function(key) {
    return { key: key, count: countMap[key], descriptor: getAdventureItemDescriptor(key) };
  }).filter(function(entry) {
    return entry.descriptor && entry.count > 0;
  });
}

function applyAdventureItemIcon(icon, descriptor) {
  if (!icon || !descriptor) return;
  icon.className = "adventure-item-icon";
  icon.style.backgroundImage = "";
  if (descriptor.image) {
    icon.classList.add("is-external-item");
    icon.style.backgroundImage = getAdventureCssImage(descriptor.image);
    icon.style.backgroundPosition = descriptor.imagePosition || "center";
    icon.style.backgroundSize = descriptor.imageSize || "contain";
  } else if (descriptor.iconClass) {
    icon.classList.add(descriptor.iconClass);
  }
}

function getMainAdventureStorageEntries() {
  const progress = ensureAdventureProgress();
  return Object.keys(ADVENTURE_ITEM_CATALOG).map(function(itemId) {
    const key = "item:" + itemId;
    return {
      key: key,
      count: Math.max(0, Math.floor(Number(progress.storage[itemId]) || 0)),
      descriptor: getAdventureItemDescriptor(key)
    };
  }).filter(function(entry) {
    return entry.descriptor && entry.count > 0;
  });
}

function createMainAdventureStorageRow(entry) {
  const row = document.createElement("article");
  const icon = document.createElement("span");
  const copy = document.createElement("div");
  const nameLine = document.createElement("div");
  const name = document.createElement("strong");
  const carryable = document.createElement("span");
  const detail = document.createElement("p");
  const count = document.createElement("span");
  row.className = "adventure-storage-item";
  applyAdventureItemIcon(icon, entry.descriptor);
  copy.className = "adventure-storage-item-copy";
  nameLine.className = "adventure-storage-item-name";
  name.textContent = entry.descriptor.name;
  carryable.className = "adventure-storage-carryable";
  carryable.textContent = entry.descriptor.carryable === false ? "剧情线索 · 已归档" : "可带入下次冒险";
  carryable.classList.toggle("is-archived", entry.descriptor.carryable === false);
  detail.textContent = entry.descriptor.detail || "从山里带回的物件。";
  count.className = "adventure-storage-item-count";
  count.textContent = "×" + entry.count;
  nameLine.appendChild(name);
  nameLine.appendChild(carryable);
  copy.appendChild(nameLine);
  copy.appendChild(detail);
  row.appendChild(icon);
  row.appendChild(copy);
  row.appendChild(count);
  return row;
}

function createLatestAdventureStorageChip(entry) {
  const chip = document.createElement("div");
  const icon = document.createElement("span");
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  const count = document.createElement("small");
  chip.className = "adventure-storage-latest-item";
  applyAdventureItemIcon(icon, entry.descriptor);
  copy.className = "adventure-storage-latest-copy";
  name.textContent = entry.descriptor.name;
  count.textContent = "本次发现 ×" + entry.count;
  copy.appendChild(name);
  copy.appendChild(count);
  chip.appendChild(icon);
  chip.appendChild(copy);
  return chip;
}

function renderMainAdventureStorage() {
  if (!adventureStorageItemList) return;
  const progress = ensureAdventureProgress();
  const entries = getMainAdventureStorageEntries();
  const total = entries.reduce(function(sum, entry) { return sum + entry.count; }, 0);
  if (adventureStorageBadge) adventureStorageBadge.textContent = total > 99 ? "99+" : String(total);
  if (adventureStorageCountLabel) adventureStorageCountLabel.textContent = total + " 件";
  adventureStorageItemList.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "adventure-storage-empty";
    empty.textContent = "这里还没有从冒险中带回的物件。";
    adventureStorageItemList.appendChild(empty);
  } else {
    entries.forEach(function(entry) {
      adventureStorageItemList.appendChild(createMainAdventureStorageRow(entry));
    });
  }

  if (!adventureStorageLatestList) return;
  const latestLog = sanitizeAdventureLog(progress.lastLog);
  const latestEntries = latestLog ? getAdventureBackpackDisplayEntries(latestLog.gained).filter(function(entry) {
    return entry.descriptor.type === "item";
  }) : [];
  adventureStorageLatestList.innerHTML = "";
  if (adventureStorageLatestMeta) {
    adventureStorageLatestMeta.textContent = latestLog ? latestLog.events.length + " 个事件" : "暂无记录";
  }
  if (!latestEntries.length) {
    const empty = document.createElement("p");
    empty.className = "adventure-storage-empty adventure-storage-latest-empty";
    empty.textContent = latestLog ? "最近一次冒险没有发现新的冒险物件。" : "完成一次冒险后，这里会留下本次发现。";
    adventureStorageLatestList.appendChild(empty);
  } else {
    latestEntries.forEach(function(entry) {
      adventureStorageLatestList.appendChild(createLatestAdventureStorageChip(entry));
    });
  }
}

function openMainAdventureStorage() {
  if (!adventureStorageLayer) return;
  if (typeof closeInventoryPanel === "function") closeInventoryPanel();
  if (typeof closeSoundJournal === "function") closeSoundJournal();
  if (typeof closeDivinationPanel === "function") closeDivinationPanel();
  if (typeof closeSettingsMenu === "function") closeSettingsMenu();
  renderMainAdventureStorage();
  adventureStorageLayer.classList.remove("hidden");
  adventureStorageLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("adventure-storage-open");
}

function closeMainAdventureStorage() {
  if (!adventureStorageLayer) return;
  adventureStorageLayer.classList.add("hidden");
  adventureStorageLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("adventure-storage-open");
}

function createAdventureItemRow(entry, mode) {
  const button = document.createElement("button");
  const icon = document.createElement("span");
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  const detail = document.createElement("small");
  const count = document.createElement("span");
  button.type = "button";
  button.className = "adventure-item-row";
  applyAdventureItemIcon(icon, entry.descriptor);
  copy.className = "adventure-item-copy";
  name.textContent = entry.descriptor.name;
  detail.textContent = entry.descriptor.detail || entry.descriptor.category;
  count.className = "adventure-item-count";
  count.textContent = "×" + entry.count;
  copy.appendChild(name);
  copy.appendChild(detail);
  button.appendChild(icon);
  button.appendChild(copy);
  button.appendChild(count);
  button.setAttribute("aria-label", (mode === "storage" ? "装入 " : "取出 ") + entry.descriptor.name);
  button.addEventListener("click", function() {
    if (mode === "storage") {
      addItemToAdventureDraft(entry.key);
    } else {
      removeItemFromAdventureDraft(entry.key);
    }
  });
  return button;
}

function renderAdventureList(container, entries, mode, emptyText) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "adventure-empty-list";
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }
  entries.forEach(function(entry) {
    container.appendChild(createAdventureItemRow(entry, mode));
  });
}

function renderAdventureSourceList(container, entries) {
  if (!container) return;
  container.innerHTML = "";
  const sourceGroups = [
    { type: "item", label: "冒险仓库" },
    { type: "fish", label: "鱼" },
    { type: "meal", label: "料理" }
  ];
  let renderedCount = 0;
  sourceGroups.forEach(function(group) {
    const groupEntries = entries.filter(function(entry) { return entry.descriptor.type === group.type; });
    if (!groupEntries.length) return;
    const section = document.createElement("section");
    const heading = document.createElement("h4");
    section.className = "adventure-prep-source-group source-" + group.type;
    heading.textContent = group.label;
    section.appendChild(heading);
    groupEntries.forEach(function(entry) { section.appendChild(createAdventureItemRow(entry, "storage")); });
    container.appendChild(section);
    renderedCount += groupEntries.length;
  });
  if (!renderedCount) {
    const empty = document.createElement("p");
    empty.className = "adventure-empty-list";
    empty.textContent = "冒险仓库、鱼和料理中都没有可携带物。";
    container.appendChild(empty);
  }
}

function getAdventureStaminaRecoveryText(progress) {
  if (progress.stamina.value >= ADVENTURE_STAMINA_MAX) {
    return "体力已恢复满。每次出发消耗 25 点。";
  }
  const nextPointAt = progress.stamina.updatedAt + ADVENTURE_STAMINA_REGEN_MS_PER_POINT;
  const minutes = Math.max(1, Math.ceil((nextPointAt - Date.now()) / 60000));
  return "每次出发消耗 25 点；约 " + minutes + " 分钟后恢复下一点。";
}

function isAdventureRouteUnlocked(mapId, routeDefinition, progress) {
  const unlocked = Array.isArray(progress.unlockedRoutes) ? progress.unlockedRoutes : progress.unlockedLocations;
  const unlockedMaps = Array.isArray(progress.unlockedMaps) ? progress.unlockedMaps : [getDefaultAdventureMapId()];
  if (!routeDefinition || unlockedMaps.indexOf(mapId || getDefaultAdventureMapId()) === -1) {
    return false;
  }
  return routeDefinition.unlockAny.some(function(locationId) {
    return locationId === mapId || unlocked.indexOf(locationId) !== -1;
  });
}

function isDeepMountainRouteUnlocked(routeDefinition, progress) {
  return isAdventureRouteUnlocked("deepMountain", routeDefinition, progress);
}

function getFirstUnlockedAdventureRouteId(progress, mapId) {
  const currentMapId = mapId || adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routes = getAdventureMapRoutes(currentMapId);
  return Object.keys(routes).find(function(routeId) {
    return isAdventureRouteUnlocked(currentMapId, routes[routeId], progress);
  }) || getAdventureMapDefaultRouteId(currentMapId);
}

function renderAdventureMapSelection() {
  const progress = ensureAdventureProgress();
  refreshAdventureMapUnlocks(progress);
  if (adventureMapStamina) adventureMapStamina.textContent = progress.stamina.value + " / " + ADVENTURE_STAMINA_MAX;
  if (adventureMapStorageCount) {
    const storedCount = getAdventureStorageEntries().reduce(function(total, entry) { return total + entry.count; }, 0);
    adventureMapStorageCount.textContent = storedCount + " 件";
  }
  if (!adventureMapList) return;
  adventureMapList.innerHTML = "";
  getAdventureMapIds().forEach(function(mapId) {
    const map = getAdventureMapRegistry()[mapId];
    const selection = map.selection || {};
    const playable = isAdventureMapPlayable(mapId);
    const unlocked = isAdventureMapUnlocked(mapId, progress);
    const card = document.createElement("button");
    const visual = document.createElement("span");
    const copy = document.createElement("span");
    const eyebrow = document.createElement("small");
    const title = document.createElement("strong");
    const description = document.createElement("span");
    const meta = document.createElement("em");
    card.type = "button";
    card.className = "adventure-map-card";
    card.classList.toggle("is-locked", !unlocked);
    card.classList.toggle("is-preview", !playable);
    card.disabled = !unlocked;
    card.setAttribute("aria-label", map.name + (unlocked ? "，选择地图" : "，尚未开放"));
    visual.className = "adventure-map-card-visual";
    if (selection.image) visual.style.backgroundImage = getAdventureCssImage(selection.image);
    copy.className = "adventure-map-card-copy";
    eyebrow.textContent = selection.eyebrow || "Adventure Map";
    title.textContent = map.name;
    description.textContent = selection.description || "还有许多沿途经历等待发现。";
    if (unlocked) {
      if (mapId === "fogRainforest" && progressHasRouteMapDiscovery()) {
        meta.textContent = "路线图已归档 · 点击查看";
        meta.className = "adventure-map-route-map-link";
        meta.addEventListener("click", function(event) {
          event.preventDefault();
          event.stopPropagation();
          openAdventureRouteMapReveal(false);
        });
      } else {
        meta.textContent = Object.keys(map.routes || {}).length + " 条路线 · " + (map.events || []).length + " 种沿途事件";
      }
      card.addEventListener("click", function() { chooseAdventureMapForPreparation(mapId); });
    } else if (!playable) {
      meta.textContent = "远行准备中 · " + (selection.unlockHint || "入口暂时还看不清");
    } else {
      meta.textContent = "尚未解锁 · " + (selection.unlockHint || "继续从营地出发看看");
    }
    copy.appendChild(eyebrow);
    copy.appendChild(title);
    copy.appendChild(description);
    copy.appendChild(meta);
    card.appendChild(visual);
    card.appendChild(copy);
    adventureMapList.appendChild(card);
  });
}

function chooseAdventureMapForPreparation(mapId) {
  const progress = ensureAdventureProgress();
  if (!isAdventureMapUnlocked(mapId, progress)) return false;
  adventurePrototypeState.draftMapId = mapId;
  adventurePrototypeState.draftRouteId = getFirstUnlockedAdventureRouteId(progress, mapId);
  adventurePrototypeState.routeCarouselIndex = Math.max(0, getAdventureRouteIds(mapId).indexOf(adventurePrototypeState.draftRouteId));
  adventurePrototypeState.draftAdventureHook = null;
  showAdventurePreparation("请选择一条路线。");
  return true;
}

function getAdventurePrepStep() {
  return ["routes", "itinerary", "backpack"].indexOf(adventurePrototypeState.prepStep) !== -1
    ? adventurePrototypeState.prepStep
    : "routes";
}

function getAdventureRouteIds(mapId) {
  return Object.keys(getAdventureMapRoutes(mapId));
}

function wrapAdventureIndex(index, length) {
  if (!length) return 0;
  return ((index % length) + length) % length;
}

function getAdventureCarouselOffset(index, activeIndex, length) {
  if (!length) return 0;
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function getAdventureRouteFaceTags(route, unlocked) {
  if (!unlocked) return ["未解锁"];
  return String(route && route.riskLabel ? route.riskLabel : "")
    .split("·")
    .map(function(tag) { return tag.trim(); })
    .filter(Boolean)
    .slice(0, 2);
}

function getAdventureRouteRewardTags(mapId, route) {
  const eventWeights = route && route.eventWeights ? route.eventWeights : {};
  const tags = sanitizeAdventureStringArray(route && route.resourceIds, 12).map(getAdventureIngredientName);
  if ((eventWeights.animalTracks || eventWeights.riverbankTracks || eventWeights.frogChorus) && tags.indexOf("动物线索") === -1) tags.push("动物线索");
  if ((eventWeights.washedOutCache || eventWeights.flashFloodDebris || eventWeights.floodedSupplyCrate) && tags.indexOf("漂流物") === -1) tags.push("漂流物");
  if ((eventWeights.abandonedCabin || eventWeights.researchStation || eventWeights.lockedChest) && tags.indexOf("旧设施") === -1) tags.push("旧设施");
  if ((eventWeights.whiteShadow || eventWeights.luminousPlants || eventWeights.symbolStone) && tags.indexOf("异常痕迹") === -1) tags.push("异常痕迹");
  if (!tags.length) tags.push(getAdventureMap(mapId).name + "发现");
  return Array.from(new Set(tags)).slice(0, 3);
}

function formatAdventureTripClueProgress(progressInfo) {
  const found = progressInfo && Number(progressInfo.found) ? Number(progressInfo.found) : 0;
  const total = progressInfo && Number(progressInfo.total) ? Number(progressInfo.total) : 0;
  return "线索 " + found + " / " + total;
}

function getCurrentAdventureCarouselRouteId() {
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routeIds = getAdventureRouteIds(mapId);
  return routeIds[wrapAdventureIndex(adventurePrototypeState.routeCarouselIndex, routeIds.length)] || getAdventureMapDefaultRouteId(mapId);
}

function selectAdventureDraftRoute(routeId, forceNewHook) {
  const progress = ensureAdventureProgress();
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const route = getAdventureMapRoutes(mapId)[routeId];
  if (!route || !isAdventureRouteUnlocked(mapId, route, progress)) return false;
  const changed = adventurePrototypeState.draftRouteId !== routeId;
  adventurePrototypeState.draftRouteId = routeId;
  if (changed || forceNewHook) ensureDraftAdventureHook(true);
  applyAdventureRoutePresentation(mapId, routeId);
  resetAdventureRouteAtmosphere();
  return true;
}

function setAdventurePrepStep(step, message) {
  adventurePrototypeState.prepStep = ["routes", "itinerary", "backpack"].indexOf(step) !== -1 ? step : "routes";
  if (typeof message === "string") setAdventurePrepMessage(message, false);
  if (adventurePrepPanel) adventurePrepPanel.scrollTop = 0;
  renderAdventurePreparation();
  restoreAdventureViewportOrigin();
}

function updateAdventurePrepFrame(progress) {
  const step = getAdventurePrepStep();
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const map = getAdventureMap(mapId);
  if (adventurePrepTitle) adventurePrepTitle.textContent = step === "backpack" ? "整理背包" : map.name;
  if (adventurePrepMapEyebrow) adventurePrepMapEyebrow.textContent = map.selection && map.selection.eyebrow ? map.selection.eyebrow : map.name;
  if (adventurePrepCloseButton) {
    const label = step === "backpack" ? "返回本次行程" : (step === "itinerary" ? "返回选择路线" : "返回选择地图");
    adventurePrepCloseButton.setAttribute("aria-label", label);
    adventurePrepCloseButton.title = label;
  }
  if (adventureRouteStep) {
    adventureRouteStep.classList.toggle("hidden", step === "backpack");
    adventureRouteStep.classList.toggle("is-route-selection", step === "routes");
    adventureRouteStep.classList.toggle("is-itinerary", step === "itinerary");
  }
  if (adventureBackpackStep) adventureBackpackStep.classList.toggle("hidden", step !== "backpack");
  if (adventureTripCardPanel) adventureTripCardPanel.classList.toggle("hidden", step !== "itinerary");
  if (adventurePrototype) {
    adventurePrototype.classList.toggle("is-prep-routes", step === "routes");
    adventurePrototype.classList.toggle("is-prep-itinerary", step === "itinerary");
    adventurePrototype.classList.toggle("is-prep-backpack", step === "backpack");
  }
  if (adventurePrepStaminaText) adventurePrepStaminaText.textContent = progress.stamina.value + " / " + ADVENTURE_STAMINA_MAX;
}

function closeAdventureStaminaPopover() {
  if (adventurePrepStaminaPopover) adventurePrepStaminaPopover.classList.add("hidden");
  if (adventurePrepStaminaInfoButton) adventurePrepStaminaInfoButton.setAttribute("aria-expanded", "false");
}

function positionAdventureStaminaPopover() {
  if (!adventurePrepStaminaPopover || !adventurePrepStaminaInfoButton || !gameViewport ||
    adventurePrepStaminaPopover.classList.contains("hidden")) return;

  const viewportRect = gameViewport.getBoundingClientRect();
  const buttonRect = adventurePrepStaminaInfoButton.getBoundingClientRect();
  const scaleX = viewportRect.width / gameViewport.clientWidth;
  const scaleY = viewportRect.height / gameViewport.clientHeight;

  if (!Number.isFinite(scaleX) || scaleX <= 0 || !Number.isFinite(scaleY) || scaleY <= 0) return;

  const fontSize = Number.parseFloat(window.getComputedStyle(adventurePrepStaminaPopover).fontSize) || 16;
  const margin = fontSize;
  const gap = fontSize * 0.6;
  const buttonLeft = (buttonRect.left - viewportRect.left) / scaleX;
  const buttonRight = (buttonRect.right - viewportRect.left) / scaleX;
  const buttonTop = (buttonRect.top - viewportRect.top) / scaleY;
  const buttonBottom = (buttonRect.bottom - viewportRect.top) / scaleY;

  adventurePrepStaminaPopover.style.left = margin + "px";
  adventurePrepStaminaPopover.style.top = margin + "px";
  const popoverRect = adventurePrepStaminaPopover.getBoundingClientRect();
  const popoverWidth = popoverRect.width / scaleX;
  const popoverHeight = popoverRect.height / scaleY;
  const maxLeft = Math.max(margin, gameViewport.clientWidth - popoverWidth - margin);
  const left = clamp(buttonRight - popoverWidth, margin, maxLeft);
  const belowTop = buttonBottom + gap;
  const aboveTop = buttonTop - popoverHeight - gap;
  const placeAbove = belowTop + popoverHeight > gameViewport.clientHeight - margin && aboveTop >= margin;
  const top = clamp(placeAbove ? aboveTop : belowTop, margin, gameViewport.clientHeight - popoverHeight - margin);

  adventurePrepStaminaPopover.style.left = left + "px";
  adventurePrepStaminaPopover.style.top = top + "px";
  adventurePrepStaminaPopover.classList.toggle("is-above", placeAbove);
  adventurePrepStaminaPopover.style.setProperty("--stamina-anchor-x", clamp((buttonLeft + buttonRight) / 2 - left, margin, popoverWidth - margin) + "px");
}

function toggleAdventureStaminaPopover() {
  if (!adventurePrepStaminaPopover || !adventurePrepStaminaInfoButton) return;
  const willOpen = adventurePrepStaminaPopover.classList.contains("hidden");
  adventurePrepStaminaPopover.classList.toggle("hidden", !willOpen);
  adventurePrepStaminaInfoButton.setAttribute("aria-expanded", willOpen ? "true" : "false");
  if (willOpen) requestAnimationFrame(positionAdventureStaminaPopover);
}

function renderAdventureHookPreview() {
  const progress = ensureAdventureProgress();
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const hook = ensureDraftAdventureHook(false);
  const clueProgress = getAdventureHookClueProgress(progress, mapId, hook.id);
  const storyState = getAdventureStoryState(progress, mapId + ":" + hook.id);
  const ready = storyState.status === "ready";
  if (adventureHookPreview) adventureHookPreview.dataset.hookSource = hook.source;
  if (adventureHookEyebrow) adventureHookEyebrow.textContent = "当前目标";
  if (adventureHookTitle) adventureHookTitle.textContent = hook.title;
  if (adventureHookClueMeta) adventureHookClueMeta.textContent = formatAdventureTripClueProgress(clueProgress);
  if (adventureHookIntro) adventureHookIntro.textContent = hook.intro;
  if (adventureHookSortButton) {
    adventureHookSortButton.classList.toggle("hidden", !ready);
    adventureHookSortButton.onclick = ready ? function() { openAdventureClueSorter(mapId + ":" + hook.id); } : null;
  }
}

function addAdventureRecommendationCandidate(candidates, key, priority, label) {
  const descriptor = getAdventureItemDescriptor(key);
  if (!descriptor || descriptor.carryable === false || getAdventureStorageCount(key) <= 0) return;
  const existing = candidates.find(function(entry) { return entry.key === key; });
  if (existing) {
    existing.priority = Math.min(existing.priority, priority);
    return;
  }
  candidates.push({ key: key, priority: priority, label: label || "" });
}

function addAdventureRecommendationRequirement(candidates, requirement, priority, label) {
  if (!requirement) return;
  if (String(requirement).indexOf("category:") === 0) {
    const category = String(requirement).slice("category:".length);
    getAdventureStorageEntries().filter(function(entry) {
      return entry.descriptor && entry.descriptor.carryable !== false && (
        entry.descriptor.category === category ||
        entry.descriptor.type === category ||
        (category === "food" && (entry.descriptor.category === "food" || entry.descriptor.type === "meal"))
      );
    }).sort(function(left, right) {
      if (left.descriptor.type !== right.descriptor.type) return left.descriptor.type === "meal" ? -1 : 1;
      return left.descriptor.name.localeCompare(right.descriptor.name);
    }).slice(0, 2).forEach(function(entry) {
      addAdventureRecommendationCandidate(candidates, entry.key, priority, label);
    });
    return;
  }
  addAdventureRecommendationCandidate(candidates, "item:" + requirement, priority, label);
}

function getAdventureRecommendationCandidates(mapId, routeId, hook) {
  const route = getAdventureMapRoutes(mapId)[routeId] || {};
  const candidates = [];
  (hook && Array.isArray(hook.relatedItems) ? hook.relatedItems : []).forEach(function(requirement) {
    addAdventureRecommendationRequirement(candidates, requirement, 1, "hook");
  });
  sanitizeAdventureStringArray(route.recommendedItems, 12).forEach(function(itemId) {
    addAdventureRecommendationRequirement(candidates, itemId, 2, "route");
  });
  sanitizeAdventureStringArray(route.riskItems, 12).forEach(function(itemId) {
    addAdventureRecommendationRequirement(candidates, itemId, 3, "risk");
  });
  ["trailRation", "firstAidPouch", "mountainHerb", "insectRepellent"].forEach(function(itemId) {
    addAdventureRecommendationRequirement(candidates, itemId, 4, "consumable");
  });
  const memories = ensureAdventureProgress().adventureMemories || {};
  sanitizeAdventureStringArray(memories.preferredTools, 12).concat(["fieldLantern", "ropeKit", "trailMap", "repairToolkit"]).forEach(function(itemId) {
    addAdventureRecommendationRequirement(candidates, itemId, 5, "habit");
  });
  return candidates.sort(function(left, right) {
    if (left.priority !== right.priority) return left.priority - right.priority;
    const leftDescriptor = getAdventureItemDescriptor(left.key);
    const rightDescriptor = getAdventureItemDescriptor(right.key);
    return (leftDescriptor ? leftDescriptor.name : left.key).localeCompare(rightDescriptor ? rightDescriptor.name : right.key);
  });
}

function buildRecommendedAdventureBackpack(mapId, routeId, hook) {
  const backpack = {};
  getAdventureRecommendationCandidates(mapId, routeId, hook).some(function(candidate) {
    if (getAdventureCountTotal(backpack) >= ADVENTURE_BACKPACK_CAPACITY) return true;
    const available = getAdventureStorageCount(candidate.key);
    const selected = Number(backpack[candidate.key]) || 0;
    if (available > selected) addAdventureCount(backpack, candidate.key, 1);
    return getAdventureCountTotal(backpack) >= ADVENTURE_BACKPACK_CAPACITY;
  });
  return backpack;
}

function applyAdventureBackpackRecommendation(force) {
  if (adventurePrototypeState.draftBackpackTouched && !force) return false;
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routeId = adventurePrototypeState.draftRouteId || getAdventureMapDefaultRouteId(mapId);
  const hook = ensureDraftAdventureHook(false);
  adventurePrototypeState.draftBackpack = buildRecommendedAdventureBackpack(mapId, routeId, hook);
  adventurePrototypeState.draftBackpackTouched = false;
  return true;
}

function renderAdventureRecommendationStatus() {
  if (!adventureRecommendationText) return;
  const selectedCount = getAdventureCountTotal(adventurePrototypeState.draftBackpack);
  adventureRecommendationText.textContent = "按当前路线和目标整理，可自由调整。";
}

function updateAdventureRouteCarouselTransforms(dragOffset) {
  if (!adventureRouteList) return;
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routeIds = getAdventureRouteIds(mapId);
  const activeIndex = wrapAdventureIndex(adventurePrototypeState.routeCarouselIndex, routeIds.length);
  const drag = Number(dragOffset) || 0;
  const width = adventureRouteList.getBoundingClientRect().width || 320;
  const step = Math.min(width * 0.48, 178);
  adventureRouteList.querySelectorAll(".route-choice").forEach(function(card) {
    const index = Number(card.dataset.routeIndex) || 0;
    const baseOffset = getAdventureCarouselOffset(index, activeIndex, routeIds.length);
    const offset = baseOffset + drag;
    const abs = Math.abs(offset);
    const clamped = Math.min(abs, 2.2);
    const scale = Math.max(0.72, 1 - clamped * 0.14);
    const rotate = Math.max(-10, Math.min(10, offset * 7 + drag * 4));
    const translateX = offset * step;
    const translateY = clamped * 0.42;
    card.style.setProperty("--route-x", translateX.toFixed(2) + "px");
    card.style.setProperty("--route-y", translateY.toFixed(2) + "rem");
    card.style.setProperty("--route-scale", scale.toFixed(3));
    card.style.setProperty("--route-rotate", rotate.toFixed(2) + "deg");
    card.style.zIndex = String(50 - Math.round(clamped * 10));
    card.style.opacity = abs > 2.25 ? "0" : String(Math.max(0.18, 1 - clamped * 0.28).toFixed(2));
    card.classList.toggle("is-current", index === activeIndex);
    card.setAttribute("aria-current", index === activeIndex ? "true" : "false");
  });
}

function setAdventureRouteCarouselIndex(index, shouldRender, message) {
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routeIds = getAdventureRouteIds(mapId);
  adventurePrototypeState.routeCarouselIndex = wrapAdventureIndex(index, routeIds.length);
  const routeId = getCurrentAdventureCarouselRouteId();
  const progress = ensureAdventureProgress();
  const route = getAdventureMapRoutes(mapId)[routeId];
  if (route && isAdventureRouteUnlocked(mapId, route, progress)) {
    selectAdventureDraftRoute(routeId, adventurePrototypeState.draftRouteId !== routeId);
  } else {
    applyAdventureRoutePresentation(mapId, routeId);
    resetAdventureRouteAtmosphere();
  }
  if (typeof message === "string") setAdventurePrepMessage(message, false);
  if (shouldRender) renderAdventurePreparation();
  else updateAdventureRouteCarouselTransforms(0);
}

function renderAdventureRouteChoices(progress) {
  if (!adventureRouteList) return;
  adventureRouteList.innerHTML = "";
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const map = getAdventureMap(mapId);
  const routes = getAdventureMapRoutes(mapId);
  const routeIds = Object.keys(routes);
  if (!routeIds.length) return;
  if (!routes[adventurePrototypeState.draftRouteId] || !isAdventureRouteUnlocked(mapId, routes[adventurePrototypeState.draftRouteId], progress)) {
    adventurePrototypeState.draftRouteId = getFirstUnlockedAdventureRouteId(progress, mapId);
  }
  if (!Number.isFinite(Number(adventurePrototypeState.routeCarouselIndex)) || !routeIds[adventurePrototypeState.routeCarouselIndex]) {
    adventurePrototypeState.routeCarouselIndex = Math.max(0, routeIds.indexOf(adventurePrototypeState.draftRouteId));
  }
  routeIds.forEach(function(routeId, index) {
    const route = routes[routeId];
    const unlocked = isAdventureRouteUnlocked(mapId, route, progress);
    const button = document.createElement("button");
    const visual = document.createElement("span");
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    const tagList = document.createElement("span");
    const presentation = route.presentation || {};
    button.type = "button";
    button.className = "adventure-choice-card route-choice";
    button.classList.toggle("is-locked", !unlocked);
    button.dataset.routeId = routeId;
    button.dataset.routeIndex = String(index);
    button.setAttribute("aria-disabled", unlocked ? "false" : "true");
    button.setAttribute("aria-label", route.name + (unlocked ? "，点击查看本次行程" : "，尚未解锁"));
    visual.className = "route-choice-visual";
    visual.style.backgroundImage = getAdventureCssImage(map.scene && map.scene.background ? map.scene.background : map.selection && map.selection.image);
    visual.style.backgroundPosition = presentation.prepPosition || presentation.cameraPosition || "center";
    copy.className = "route-choice-copy";
    title.textContent = route.name;
    tagList.className = "route-choice-tags";
    getAdventureRouteFaceTags(route, unlocked).forEach(function(label) {
      const tag = document.createElement("em");
      tag.textContent = label;
      tagList.appendChild(tag);
    });
    copy.appendChild(title);
    copy.appendChild(tagList);
    button.appendChild(visual);
    button.appendChild(copy);
    adventureRouteList.appendChild(button);
  });
  if (adventureStrategyHint) {
    adventureStrategyHint.textContent = "";
    adventureStrategyHint.classList.add("hidden");
  }
  updateAdventureRouteCarouselTransforms(0);
  applyAdventureRoutePresentation(mapId, getCurrentAdventureCarouselRouteId());
  resetAdventureRouteAtmosphere();
}

function renderAdventureTripCard() {
  const progress = ensureAdventureProgress();
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routes = getAdventureMapRoutes(mapId);
  const route = routes[adventurePrototypeState.draftRouteId] || routes[getAdventureMapDefaultRouteId(mapId)];
  if (!route) return;
  if (adventureTripRouteName) adventureTripRouteName.textContent = route.name;
  if (adventureTripSummary) adventureTripSummary.textContent = route.description || route.preparationHint || "沿当前路线前进。";
  if (adventureTripResourceTags) {
    adventureTripResourceTags.innerHTML = "";
    getAdventureRouteRewardTags(mapId, route).forEach(function(label) {
      const tag = document.createElement("span");
      tag.textContent = label;
      adventureTripResourceTags.appendChild(tag);
    });
  }
  renderAdventureHookPreview();
  if (adventureRouteContinueButton) {
    adventureRouteContinueButton.disabled = !isAdventureRouteUnlocked(mapId, route, progress);
  }
}

function renderAdventurePreparation() {
  const progress = ensureAdventureProgress();
  const selectedCount = getAdventureCountTotal(adventurePrototypeState.draftBackpack);
  const storageEntries = getAdventureStorageEntries().map(function(entry) {
    return {
      key: entry.key,
      descriptor: entry.descriptor,
      count: Math.max(0, entry.count - (adventurePrototypeState.draftBackpack[entry.key] || 0))
    };
  }).filter(function(entry) { return entry.count > 0; });
  const backpackEntries = getAdventureBackpackDisplayEntries(adventurePrototypeState.draftBackpack);
  const staminaPercent = progress.stamina.value / ADVENTURE_STAMINA_MAX * 100;
  updateAdventurePrepFrame(progress);
  if (adventurePrepStaminaFill) {
    adventurePrepStaminaFill.style.width = staminaPercent + "%";
  }
  if (adventureStaminaHint) {
    const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
    const routes = getAdventureMapRoutes(mapId);
    const route = routes[adventurePrototypeState.draftRouteId] || routes[getAdventureMapDefaultRouteId(mapId)];
    adventureStaminaHint.textContent = getAdventureStaminaRecoveryText(progress) + (route.staminaCost ? " 此路线额外消耗 " + route.staminaCost + " 点。" : "");
  }
  if (adventureBackpackCapacity) {
    adventureBackpackCapacity.textContent = selectedCount + " / " + ADVENTURE_BACKPACK_CAPACITY;
  }
  renderAdventureSourceList(adventureStorageList, storageEntries);
  renderAdventureList(adventureBackpackList, backpackEntries, "backpack", "背包还是空的。可以空手出发。 ");
  renderAdventureRouteChoices(progress);
  renderAdventureTripCard();
  renderAdventureRecommendationStatus();
  if (adventureStorageList && selectedCount >= ADVENTURE_BACKPACK_CAPACITY) {
    adventureStorageList.querySelectorAll("button").forEach(function(button) { button.disabled = true; });
  }
  if (adventureStartButton) {
    const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
    const routes = getAdventureMapRoutes(mapId);
    const selectedRoute = routes[adventurePrototypeState.draftRouteId] || routes[getAdventureMapDefaultRouteId(mapId)];
    adventureStartButton.disabled = progress.stamina.value < ADVENTURE_STAMINA_TRIP_COST + selectedRoute.staminaCost;
  }
}

function setAdventurePrepMessage(message, isError) {
  if (!adventurePrepMessage) {
    return;
  }
  adventurePrepMessage.textContent = message;
  adventurePrepMessage.classList.toggle("is-error", Boolean(isError));
}

function addItemToAdventureDraft(key) {
  const descriptor = getAdventureItemDescriptor(key);
  if (!descriptor || descriptor.carryable === false) {
    setAdventurePrepMessage("这件剧情线索已经归档，不需要再次携带。", true);
    return;
  }
  if (getAdventureCountTotal(adventurePrototypeState.draftBackpack) >= ADVENTURE_BACKPACK_CAPACITY) {
    setAdventurePrepMessage("冒险背包最多携带 " + ADVENTURE_BACKPACK_CAPACITY + " 件。", true);
    return;
  }
  const selected = adventurePrototypeState.draftBackpack[key] || 0;
  if (selected >= getAdventureStorageCount(key)) {
    return;
  }
  addAdventureCount(adventurePrototypeState.draftBackpack, key, 1);
  adventurePrototypeState.draftBackpackTouched = true;
  setAdventurePrepMessage("已装入 " + getAdventureItemDescriptor(key).name + "。", false);
  renderAdventurePreparation();
}

function removeItemFromAdventureDraft(key) {
  if (removeAdventureCount(adventurePrototypeState.draftBackpack, key, 1) > 0) {
    adventurePrototypeState.draftBackpackTouched = true;
    setAdventurePrepMessage("已将 " + getAdventureItemDescriptor(key).name + " 放回 Storage。", false);
    renderAdventurePreparation();
  }
}

function getAdventureRouteCardFromEvent(event) {
  return event && event.target && typeof event.target.closest === "function"
    ? event.target.closest(".route-choice")
    : null;
}

function handleAdventureRouteCardClick(event) {
  const card = getAdventureRouteCardFromEvent(event);
  if (!card || !adventureRouteList) return;
  if (adventurePrototypeState.routeCarouselDrag && adventurePrototypeState.routeCarouselDrag.moved) return;
  const index = Number(card.dataset.routeIndex) || 0;
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const routeIds = getAdventureRouteIds(mapId);
  const activeIndex = wrapAdventureIndex(adventurePrototypeState.routeCarouselIndex, routeIds.length);
  if (index !== activeIndex) {
    setAdventureRouteCarouselIndex(index, true, "");
    return;
  }
  const routeId = card.dataset.routeId || getCurrentAdventureCarouselRouteId();
  const route = getAdventureMapRoutes(mapId)[routeId];
  if (!route || !isAdventureRouteUnlocked(mapId, route, ensureAdventureProgress())) {
    setAdventurePrepMessage(route && route.lockedHint ? route.lockedHint : "这条路线尚未解锁。", true);
    return;
  }
  selectAdventureDraftRoute(routeId, adventurePrototypeState.draftRouteId !== routeId);
  setAdventurePrepStep("itinerary", "已选择“" + route.name + "”。");
}

function beginAdventureRouteDrag(event) {
  if (!adventureRouteList || getAdventurePrepStep() !== "routes") return;
  adventurePrototypeState.routeCarouselDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    deltaX: 0,
    active: false,
    moved: false
  };
  adventureRouteList.classList.add("is-dragging");
}

function moveAdventureRouteDrag(event) {
  const drag = adventurePrototypeState.routeCarouselDrag;
  if (!drag || drag.pointerId !== event.pointerId || !adventureRouteList) return;
  const deltaX = event.clientX - drag.startX;
  const deltaY = event.clientY - drag.startY;
  drag.deltaX = deltaX;
  if (!drag.active && Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY) * 1.08) {
    drag.active = true;
    if (typeof adventureRouteList.setPointerCapture === "function") {
      try { adventureRouteList.setPointerCapture(event.pointerId); } catch (error) {}
    }
  }
  if (!drag.active) return;
  drag.moved = Math.abs(deltaX) > 4;
  event.preventDefault();
  const width = adventureRouteList.getBoundingClientRect().width || 320;
  const dragOffset = Math.max(-0.9, Math.min(0.9, deltaX / Math.max(120, width * 0.42)));
  updateAdventureRouteCarouselTransforms(dragOffset);
}

function endAdventureRouteDrag(event) {
  const drag = adventurePrototypeState.routeCarouselDrag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  if (adventureRouteList) adventureRouteList.classList.remove("is-dragging");
  const routeIds = getAdventureRouteIds(adventurePrototypeState.draftMapId || getDefaultAdventureMapId());
  const width = adventureRouteList ? (adventureRouteList.getBoundingClientRect().width || 320) : 320;
  const threshold = Math.max(42, width * 0.16);
  if (drag.active && Math.abs(drag.deltaX) > threshold && routeIds.length > 1) {
    const direction = drag.deltaX > 0 ? -1 : 1;
    setAdventureRouteCarouselIndex(adventurePrototypeState.routeCarouselIndex + direction, true, "");
  } else {
    updateAdventureRouteCarouselTransforms(0);
  }
  window.setTimeout(function() {
    if (adventurePrototypeState.routeCarouselDrag === drag) adventurePrototypeState.routeCarouselDrag = null;
  }, 0);
}

function restoreAdventureViewportOrigin() {
  if (gameViewport) {
    gameViewport.scrollLeft = 0;
    gameViewport.scrollTop = 0;
  }
}

function setAdventureMode(mode) {
  adventurePrototypeState.mode = mode;
  if (!adventurePrototype) {
    return;
  }
  adventurePrototype.classList.toggle("is-center", mode === "center");
  adventurePrototype.classList.toggle("is-journal", mode === "journal");
  adventurePrototype.classList.toggle("is-map-select", mode === "map-select");
  adventurePrototype.classList.toggle("is-preparing", mode === "preparing");
  adventurePrototype.classList.toggle("is-running", mode === "running");
  adventurePrototype.classList.toggle("is-log", mode === "log");
  restoreAdventureViewportOrigin();
}

function createNeutralAdventureTraitMap() {
  return CAMPER_TRAIT_KEYS.reduce(function(traits, traitId) {
    traits[traitId] = 50;
    return traits;
  }, {});
}

function createNeutralAdventureLuck() {
  return { generalLuck: 0, treasureLuck: 0, socialLuck: 0, healthLuck: 0, dangerSense: 0 };
}

function getAdventureProfileSnapshot() {
  const profile = typeof getActiveCamperProfile === "function" ? getActiveCamperProfile(gameState) : null;
  const baseTraits = profile && profile.baseTraits && typeof profile.baseTraits === "object" ? profile.baseTraits : createNeutralAdventureTraitMap();
  const habitModifiers = profile && profile.habitModifiers && typeof profile.habitModifiers === "object" ? profile.habitModifiers : {};
  const finalTraits = CAMPER_TRAIT_KEYS.reduce(function(traits, traitId) {
    const baseValue = Number(baseTraits[traitId]);
    traits[traitId] = clampAdventureValue((Number.isFinite(baseValue) ? baseValue : 50) + (Number(habitModifiers[traitId]) || 0), 0, 100);
    return traits;
  }, {});
  const savedLuck = gameState && gameState.dailyAdventureModifiers;
  return {
    profile: profile,
    appearance: typeof normalizeCamperAppearance === "function" ? normalizeCamperAppearance(profile && profile.appearance) : null,
    personalityId: profile && profile.personalityId || "neutralPrototype",
    baseTraits: Object.assign({}, baseTraits),
    habitModifiers: Object.assign({}, habitModifiers),
    finalTraits: finalTraits,
    dailyAdventureModifiers: Object.assign(createNeutralAdventureLuck(), savedLuck && typeof savedLuck === "object" ? savedLuck : {})
  };
}

function getAdventureCamperId(snapshot) {
  const profile = snapshot && snapshot.profile;
  return profile && (profile.id || profile.camperId || profile.createdAt)
    ? String(profile.id || profile.camperId || profile.createdAt)
    : "localCamper";
}

function createSoloAdventureParticipants(snapshot, backpack, adventureMemories) {
  return createLocalAdventureParty(1, snapshot, {
    lead: { camperId: getAdventureCamperId(snapshot) },
    leadItemKeys: Object.keys(backpack || {}),
    leadMemories: adventureMemories || {}
  });
}

function createAdventureEventParticipation(trip, eventDefinition, reaction, outcome, participationPlan) {
  return completeAdventureEventParticipation(trip, eventDefinition, reaction, outcome, participationPlan);
}

function pickAdventureArrayValue(values) {
  return Array.isArray(values) && values.length ? values[Math.floor(Math.random() * values.length)] : "";
}

function pickWeightedAdventureEntry(entries) {
  const total = entries.reduce(function(sum, entry) { return sum + Math.max(0, Number(entry.weight) || 0); }, 0);
  if (total <= 0) {
    return entries[Math.floor(Math.random() * entries.length)];
  }
  let roll = Math.random() * total;
  for (let index = 0; index < entries.length; index += 1) {
    roll -= Math.max(0, Number(entries[index].weight) || 0);
    if (roll <= 0) {
      return entries[index];
    }
  }
  return entries[entries.length - 1];
}

function backpackHasAdventureItem(countMap, itemId) {
  return (Number(countMap && countMap["item:" + itemId]) || 0) > 0;
}

function getAdventureRequirementItemKey(backpack, requirement) {
  if (String(requirement).indexOf("category:") === 0) {
    const category = String(requirement).slice("category:".length);
    return Object.keys(backpack || {}).find(function(key) {
      const descriptor = getAdventureItemDescriptor(key);
      return descriptor && descriptor.category === category && (Number(backpack[key]) || 0) > 0;
    }) || "";
  }
  return backpackHasAdventureItem(backpack, requirement) ? "item:" + requirement : "";
}

function backpackHasAdventureRequirement(backpack, requirement) {
  return Boolean(getAdventureRequirementItemKey(backpack, requirement));
}

function getAdventureRequirementLabel(requirement) {
  if (requirement === "category:meal") return "料理";
  if (requirement === "category:fish") return "鱼";
  if (requirement === "category:food") return "干粮";
  return ADVENTURE_ITEM_CATALOG[requirement] ? ADVENTURE_ITEM_CATALOG[requirement].name : "合适装备";
}

function getAdventureReactionLuckAdjustment(reaction, luck) {
  let adjustment = 0;
  if (reaction.action === "call") {
    adjustment += (Number(luck.socialLuck) || 0) * 1.3;
  }
  if (reaction.action === "open" || reaction.action === "crouch") {
    adjustment += (Number(luck.treasureLuck) || 0) * 0.45;
  }
  if (["inspect", "crouch", "brace"].indexOf(reaction.action) !== -1) {
    adjustment += (Number(luck.dangerSense) || 0) * 0.7;
  }
  if (reaction.action === "rest" || reaction.action === "run") {
    adjustment += (Number(luck.healthLuck) || 0) * 0.55;
  }
  return adjustment;
}

function getAdventureReactionCandidates(eventDefinition, snapshot, backpack) {
  const requirementMap = getAdventureMapReactionRequirements(getActiveAdventureMapId())[eventDefinition.id] || {};
  return eventDefinition.reactions.map(function(reaction) {
    const requirements = requirementMap[reaction.id] || [];
    let hasRequiredItem = !requirements.length || requirements.some(function(itemId) {
      return backpackHasAdventureRequirement(backpack, itemId);
    });
    if (eventDefinition.id === "distantCry" && reaction.id === "treatInjury" && backpackHasAdventureItem(backpack, "ropeKit")) {
      hasRequiredItem = false;
    }
    const traitContribution = Object.keys(reaction.traitWeights).reduce(function(total, traitId) {
      return total + (Number(snapshot.finalTraits[traitId]) || 0) * (Number(reaction.traitWeights[traitId]) || 0);
    }, 0);
    const itemBonus = requirements.length && hasRequiredItem ? 140 : 0;
    const luckAdjustment = getAdventureReactionLuckAdjustment(reaction, snapshot.dailyAdventureModifiers);
    return {
      reaction: reaction,
      weight: hasRequiredItem ? Math.max(1, reaction.baseWeight + traitContribution + itemBonus + luckAdjustment) : 0,
      hasRequiredItem: hasRequiredItem,
      requirements: requirements.slice(),
      matchedItemKey: requirements.map(function(requirement) { return getAdventureRequirementItemKey(backpack, requirement); }).find(Boolean) || ""
    };
  });
}

function chooseAdventureReaction(eventDefinition, snapshot, backpack) {
  const candidates = getAdventureReactionCandidates(eventDefinition, snapshot, backpack);
  return { reaction: pickWeightedAdventureEntry(candidates).reaction, candidates: candidates };
}

function getAdventureMissingItemOpportunity(eventDefinition, reactionSelection, progress) {
  if (eventDefinition.id === "hiddenFork") return null;
  const itemSolutionEffects = getAdventureMapItemSolutionEffects(getActiveAdventureMapId());
  const solutionCandidates = reactionSelection.candidates.filter(function(candidate) {
    return candidate.requirements.length > 0 && itemSolutionEffects[eventDefinition.id + ":" + candidate.reaction.id];
  });
  if (!solutionCandidates.length || solutionCandidates.some(function(candidate) { return candidate.hasRequiredItem; })) return null;
  const feedback = getAdventureMapMissingItemFeedback(getActiveAdventureMapId())[eventDefinition.id];
  if (!feedback) return null;
  const known = solutionCandidates.some(function(candidate) {
    return progress.itemSolutionKnowledge.indexOf(eventDefinition.id + ":" + candidate.reaction.id) !== -1;
  });
  const labels = [];
  solutionCandidates.forEach(function(candidate) {
    candidate.requirements.forEach(function(requirement) {
      const label = getAdventureRequirementLabel(requirement);
      if (labels.indexOf(label) === -1) labels.push(label);
    });
  });
  return {
    bubble: feedback.bubble,
    result: feedback.result,
    note: "错过的机会：" + (known ? "未携带 " + labels.join("、") : "缺少合适装备"),
    known: known,
    labels: labels
  };
}

function getCarriedButUnusedItemNotes(reactionSelection, selectedReaction, outcome) {
  const notes = [];
  const usedItemKeys = outcome && outcome.itemSolution
    ? [outcome.itemSolution.itemKey, outcome.itemSolution.followUpItemKey].filter(Boolean)
    : [];
  reactionSelection.candidates.forEach(function(candidate) {
    if (candidate.reaction.id === selectedReaction.id || !candidate.requirements.length || !candidate.matchedItemKey) return;
    if (usedItemKeys.indexOf(candidate.matchedItemKey) !== -1) return;
    const descriptor = getAdventureItemDescriptor(candidate.matchedItemKey);
    const note = descriptor ? "携带了 " + descriptor.name + "，但这次选择了其他反应。" : "携带了合适物品，但这次选择了其他反应。";
    if (notes.indexOf(note) === -1) notes.push(note);
  });
  return notes;
}

function getAdventureReactionAlignment(reaction, traits) {
  const traitIds = Object.keys(reaction.traitWeights);
  const totalWeight = traitIds.reduce(function(total, traitId) { return total + Math.abs(Number(reaction.traitWeights[traitId]) || 0); }, 0);
  const weightedValue = traitIds.reduce(function(total, traitId) {
    return total + (Number(traits[traitId]) || 0) * Math.abs(Number(reaction.traitWeights[traitId]) || 0);
  }, 0);
  return totalWeight > 0 ? weightedValue / totalWeight : 50;
}

function resolveAdventureOutcome(eventDefinition, reaction, snapshot, backpack) {
  const luck = snapshot.dailyAdventureModifiers;
  const eventLuck = Number(luck[eventDefinition.luckKey]) || 0;
  const dangerSense = Number(luck.dangerSense) || 0;
  const alignment = getAdventureReactionAlignment(reaction, snapshot.finalTraits);
  const mapId = getActiveAdventureMapId();
  const requirements = (getAdventureMapReactionRequirements(mapId)[eventDefinition.id] || {})[reaction.id] || [];
  const solutionId = eventDefinition.id + ":" + reaction.id;
  const configuredSolution = getAdventureMapItemSolutionEffects(mapId)[solutionId] || null;
  const orderedRequirements = configuredSolution && configuredSolution.requirementPriority
    ? configuredSolution.requirementPriority.concat(requirements.filter(function(requirement) {
      return configuredSolution.requirementPriority.indexOf(requirement) === -1;
    }))
    : requirements;
  const usedRequirement = orderedRequirements.find(function(requirement) { return backpackHasAdventureRequirement(backpack, requirement); }) || "";
  const usedItemKey = usedRequirement ? getAdventureRequirementItemKey(backpack, usedRequirement) : "";
  const preparedBonus = usedItemKey ? 7 : 0;
  const luckAdjustment = eventLuck * 1.7 + (Number(luck.generalLuck) || 0) * 0.85 + dangerSense * eventDefinition.risk * 0.58;
  const adjustedRoll = clampAdventureValue(Math.random() * 100 + luckAdjustment + (alignment - 50) * 0.14 + preparedBonus, 0, 100);
  let tier = "mixed";
  if (adjustedRoll < 7) tier = "rareBad";
  else if (adjustedRoll < 29) tier = "bad";
  else if (adjustedRoll < 63) tier = "mixed";
  else if (adjustedRoll < 91) tier = "good";
  else tier = "rareGood";
  const solutionDefinition = usedItemKey ? configuredSolution : null;
  const followUpRequirement = solutionDefinition && (solutionDefinition.followUpRequirements || []).find(function(requirement) {
    return backpackHasAdventureRequirement(backpack, requirement);
  }) || "";
  const followUpItemKey = followUpRequirement ? getAdventureRequirementItemKey(backpack, followUpRequirement) : "";
  if (solutionDefinition) {
    const forcedTier = followUpItemKey && solutionDefinition.combinedForcedTier
      ? solutionDefinition.combinedForcedTier
      : ((solutionDefinition.forcedTierByRequirement && solutionDefinition.forcedTierByRequirement[usedRequirement]) || solutionDefinition.forcedTier || "");
    if (forcedTier) tier = forcedTier;
    else if (["rareBad", "bad", "mixed"].indexOf(tier) !== -1) tier = "good";
  }
  const solutionResult = solutionDefinition
    ? ((followUpItemKey && solutionDefinition.combinedResult) || (solutionDefinition.resultByRequirement && solutionDefinition.resultByRequirement[usedRequirement]) || solutionDefinition.result)
    : "";
  return {
    tier: tier,
    text: solutionResult || pickAdventureArrayValue(eventDefinition.outcomes[tier]),
    adjustedRoll: adjustedRoll,
    luckAdjustment: luckAdjustment,
    alignment: alignment,
    preparedBonus: preparedBonus,
    itemSolution: solutionDefinition ? {
      id: solutionId,
      definition: solutionDefinition,
      requirement: usedRequirement,
      itemKey: usedItemKey,
      followUpRequirement: followUpRequirement,
      followUpItemKey: followUpItemKey,
      isCombined: Boolean(followUpItemKey && solutionDefinition.combinedResult)
    } : null
  };
}

function calculateAdventureHookScore(hookDefinition, eventFlags) {
  return Object.keys(hookDefinition && hookDefinition.progressFlags ? hookDefinition.progressFlags : {}).reduce(function(total, flagId) {
    if (!eventFlags[flagId]) return total;
    const multiplier = typeof eventFlags[flagId] === "number" ? Math.max(1, eventFlags[flagId]) : 1;
    return total + hookDefinition.progressFlags[flagId] * Math.min(2, multiplier);
  }, 0);
}

function doesAdventureTripMeetHookClue(clue, trip) {
  if (Array.isArray(clue.routeIds) && clue.routeIds.length && clue.routeIds.indexOf(trip.routeId) === -1) return false;
  const eventIds = Array.isArray(clue.eventIds) ? clue.eventIds : [];
  const flagIds = Array.isArray(clue.flagIds) ? clue.flagIds : [];
  const eventFound = eventIds.some(function(eventId) {
    return (trip.events || []).some(function(entry) { return entry.eventId === eventId; });
  });
  const flagFound = flagIds.some(function(flagId) {
    return Boolean(trip.eventFlags && trip.eventFlags[flagId]);
  });
  return eventFound || flagFound;
}

function collectAdventureHookClues(trip, progress) {
  const mapId = trip.mapId || getDefaultAdventureMapId();
  const hookId = trip.adventureHook && trip.adventureHook.id ? trip.adventureHook.id : trip.goalId;
  const definitions = getAdventureHookClueDefinitions(mapId, hookId);
  if (!definitions.length) {
    trip.newHookClues = [];
    trip.hookClueProgress = getAdventureHookClueProgress(progress, mapId, hookId);
    return trip.newHookClues;
  }
  if (!progress.hookClues || typeof progress.hookClues !== "object" || Array.isArray(progress.hookClues)) {
    progress.hookClues = sanitizeAdventureHookClues();
  }
  if (!progress.hookClues[mapId]) progress.hookClues[mapId] = {};
  if (!Array.isArray(progress.hookClues[mapId][hookId])) progress.hookClues[mapId][hookId] = [];
  const known = progress.hookClues[mapId][hookId];
  const newClues = [];
  definitions.forEach(function(clue) {
    if (known.indexOf(clue.id) !== -1 || !doesAdventureTripMeetHookClue(clue, trip)) return;
    known.push(clue.id);
    newClues.push({ id: clue.id, label: clue.label });
    const keyCatalog = typeof ADVENTURE_KEY_CLUE_CATALOG === "object" && ADVENTURE_KEY_CLUE_CATALOG ? ADVENTURE_KEY_CLUE_CATALOG : {};
    if (keyCatalog[clue.id]) {
      grantAdventureKeyClue(trip, clue.id, [], []);
    }
  });
  const clueProgress = getAdventureHookClueProgress(progress, mapId, hookId);
  if (!progress.clueStages || typeof progress.clueStages !== "object" || Array.isArray(progress.clueStages)) progress.clueStages = {};
  if (clueProgress.complete) progress.clueStages[hookId] = "ready";
  else if (clueProgress.found > 0) progress.clueStages[hookId] = "seenAgain";
  trip.newHookClues = newClues;
  trip.hookClueProgress = clueProgress;
  refreshAdventureStoryStates(progress);
  return newClues;
}

function evaluateAdventureHookProgress(trip) {
  const mapId = trip.mapId || getDefaultAdventureMapId();
  const hookId = trip.adventureHook && trip.adventureHook.id ? trip.adventureHook.id : trip.goalId;
  const hook = getAdventureMapHooks(mapId)[hookId];
  const score = calculateAdventureHookScore(hook, trip.eventFlags || {});
  if (!hook) return { score: 0, status: "noResult" };
  if (trip.hookClueProgress && trip.hookClueProgress.total) {
    if (trip.hookClueProgress.complete) return { score: Math.max(score, hook.successScore || trip.hookClueProgress.total), status: "found" };
    if (trip.newHookClues && trip.newHookClues.length) return { score: Math.max(score, trip.hookClueProgress.found), status: "continuing" };
  }
  return {
    score: score,
    status: score >= hook.successScore ? "found" : (score >= hook.partialScore ? "continuing" : "noResult")
  };
}

function getAdventureChainWeight(eventId, flags, mapId) {
  const map = getAdventureMap(mapId || getDefaultAdventureMapId());
  return map && typeof map.getChainWeight === "function" ? map.getChainWeight(eventId, flags || {}) : 1;
}

function getAdventureHistoryWeight(eventId, trip, progress) {
  const recent = progress.recentAdventureHistory || [];
  const mapId = trip.mapId || getDefaultAdventureMapId();
  const hookId = trip.adventureHook && trip.adventureHook.id ? trip.adventureHook.id : trip.goalId;
  const sameRoute = recent.filter(function(entry) {
    return (entry.mapId || getDefaultAdventureMapId()) === mapId && entry.routeId === trip.routeId;
  }).slice(-3);
  let multiplier = 1;
  sameRoute.forEach(function(entry, historyIndex) {
    const isLatest = historyIndex === sameRoute.length - 1;
    const sameHook = (entry.hookId || entry.goalId) === hookId;
    if (entry.eventIds.indexOf(eventId) !== -1) multiplier *= isLatest ? 0.5 : 0.76;
    if (entry.eventIds[trip.events.length] === eventId) multiplier *= isLatest ? 0.36 : 0.62;
    if (sameHook && entry.eventIds.indexOf(eventId) !== -1) multiplier *= 0.84;
  });
  return Math.max(0.12, multiplier);
}

function getEligibleAdventureExplorationRecipes(mapId, routeId) {
  const recipes = typeof cookingRecipeCatalog === "object" && cookingRecipeCatalog ? cookingRecipeCatalog : {};
  return Object.keys(recipes).filter(function(recipeId) {
    const recipe = recipes[recipeId];
    return recipe.sourceType === "exploration" && recipe.sourceMapId === mapId &&
      Array.isArray(recipe.sourceRouteIds) && recipe.sourceRouteIds.indexOf(routeId) !== -1;
  });
}

function getAdventureRecipeEventWeight(eventId, trip, progress) {
  let multiplier = 1;
  getEligibleAdventureExplorationRecipes(trip.mapId, trip.routeId).forEach(function(recipeId) {
    const recipe = cookingRecipeCatalog[recipeId];
    const pity = Math.max(0, Number(progress.recipeDiscoveryPity && progress.recipeDiscoveryPity[recipeId]) || 0);
    if (!isAdventureRecipeUnlockedForDisplay(recipeId) && pity >= 2 && recipe.sourceEventIds.indexOf(eventId) !== -1) multiplier *= 4;
  });
  return multiplier;
}

function getGuaranteedAdventureRecipeEvent(remaining, trip) {
  const guaranteeIds = Array.isArray(trip.recipeGuarantees) ? trip.recipeGuarantees : [];
  const pendingRecipeId = guaranteeIds.find(function(recipeId) {
    if (isAdventureRecipeUnlockedForDisplay(recipeId) || (trip.unlockedRecipes || []).indexOf(recipeId) !== -1) return false;
    const recipe = cookingRecipeCatalog[recipeId];
    return recipe && remaining.some(function(eventDefinition) { return recipe.sourceEventIds.indexOf(eventDefinition.id) !== -1; });
  });
  if (!pendingRecipeId) return null;
  const recipe = cookingRecipeCatalog[pendingRecipeId];
  return remaining.find(function(eventDefinition) { return recipe.sourceEventIds.indexOf(eventDefinition.id) !== -1; }) || null;
}

function chooseNextAdventureEvent(snapshot) {
  const trip = adventurePrototypeState.trip;
  const progress = ensureAdventureProgress();
  const mapId = trip.mapId || getDefaultAdventureMapId();
  const remaining = getAdventureMapEvents(mapId).filter(function(eventDefinition) {
    return adventurePrototypeState.seenEventIds.indexOf(eventDefinition.id) === -1;
  });
  const guaranteedEvent = getGuaranteedAdventureRecipeEvent(remaining, trip);
  if (guaranteedEvent) return guaranteedEvent;
  const dangerSense = Number(snapshot.dailyAdventureModifiers.dangerSense) || 0;
  const route = getAdventureMapRoutes(mapId)[trip.routeId];
  const hookEventIds = trip.adventureHook && Array.isArray(trip.adventureHook.relatedEventIds) ? trip.adventureHook.relatedEventIds : [];
  const entries = remaining.map(function(eventDefinition) {
    const routeWeight = Number(route.eventWeights[eventDefinition.id]) || 1;
    const hookWeight = hookEventIds.indexOf(eventDefinition.id) !== -1 ? 1.55 : 1;
    const dangerWeight = clampAdventureValue(1 - dangerSense * eventDefinition.risk * 0.025, 0.3, 1.7);
    const chainWeight = getAdventureChainWeight(eventDefinition.id, trip.eventFlags || {}, mapId);
    const historyWeight = getAdventureHistoryWeight(eventDefinition.id, trip, progress);
    const recipeWeight = getAdventureRecipeEventWeight(eventDefinition.id, trip, progress);
    return { eventDefinition: eventDefinition, weight: Math.max(0.05, routeWeight * hookWeight * dangerWeight * chainWeight * historyWeight * recipeWeight) };
  });
  return pickWeightedAdventureEntry(entries).eventDefinition;
}

function applyAdventureStoryContext(eventDefinition, reaction, outcome, trip) {
  const flags = trip.eventFlags || {};
  const map = getAdventureMap(trip.mapId || getDefaultAdventureMapId());
  const mapStoryContext = map && (map.getStoryContext || map.getRecurringStoryContext);
  const recurringContext = typeof mapStoryContext === "function"
    ? mapStoryContext(eventDefinition, reaction, outcome, trip)
    : null;
  const context = Object.assign({ bubble: "", result: "", chainId: "", visualClass: "" }, recurringContext || {});
  if (eventDefinition.id === "forestFootsteps" && flags.foundAnimalTracks) {
    context.bubble = flags.followedAnimal ? "是刚才那串脚印，它又转进树林了。" : "这步子和溪边的痕迹很像。";
    context.result = flags.befriendedAnimal
      ? "熟悉的动物在林边短暂停下，没有再躲开你。"
      : (flags.animalStartled ? "受惊的动物又从灌木后冲过，脚步比先前更加慌乱。" : "你把树林里的声音与先前脚印对应起来，确认了动物移动的方向。");
    context.chainId = "animalTrail";
    context.visualClass = flags.befriendedAnimal ? "story-friendly-animal" : (flags.animalStartled ? "story-startled-animal" : "story-tracked-animal");
  } else if (eventDefinition.id === "missingFood" && flags.foundAnimalTracks) {
    context.bubble = flags.befriendedAnimal ? "看来它记住了鱼的味道。" : (flags.animalStartled ? "是刚才被惊动的那只……" : "这些小爪印和刚才的是同一组。");
    context.result = flags.befriendedAnimal
      ? "那只动物只翻动了外袋，旁边还留下几枚完整坚果。"
      : (flags.animalStartled ? "被惊动的动物一路跟到休息点，叼走食物后只留下凌乱抓痕。" : "先前的脚印终于有了解释：动物一路跟到了休息点。");
    context.chainId = "animalTrail";
    context.visualClass = flags.befriendedAnimal ? "story-friendly-animal" : (flags.animalStartled ? "story-food-theft" : "story-tracked-animal");
    if (flags.animalStartled && ["rareGood", "good"].indexOf(outcome.tier) !== -1) outcome.tier = "mixed";
  } else if (eventDefinition.id === "whiteShadow" && flags.heardStrangeFootsteps) {
    context.bubble = "刚才跟着我的脚步声，是你吗？";
    context.result = "白影在同样的脚步声中停下，像是在等你先表明来意。";
    context.chainId = "whiteShadow";
  } else if (eventDefinition.id === "lostBeforeDark" && flags.sawWhiteShadow) {
    context.bubble = flags.whiteShadowTrust > 0
      ? "它又在路口出现了……是在等我吗？"
      : (flags.whiteShadowTrust < 0 ? "它又把我带回同一个路口了。" : "那道影子只在雾外看着我。它想让我跟吗？");
    context.result = flags.whiteShadowTrust > 0
      ? "白影在雾中停了两次，留下的间隔正好把你引回清楚路标。"
      : (flags.whiteShadowTrust < 0 ? "白影故意在错误路标旁停留，你跟出一段才发现自己被引回原地。" : "白影始终隔着雾旁观，你没有贸然跟随，而是靠自己的痕迹退回安全处。");
    context.chainId = "whiteShadow";
    context.visualClass = flags.whiteShadowTrust > 0 ? "story-guiding-shadow" : (flags.whiteShadowTrust < 0 ? "story-misleading-shadow" : "story-distant-shadow");
    if (flags.whiteShadowTrust > 0 && ["bad", "rareBad"].indexOf(outcome.tier) !== -1) outcome.tier = "good";
    if (flags.whiteShadowTrust < 0 && ["rareGood", "good"].indexOf(outcome.tier) !== -1) outcome.tier = "bad";
  } else if (eventDefinition.id === "hiddenFork" && flags.sawWhiteShadow) {
    context.bubble = "白影刚才就在这堆树枝后消失。";
    context.result = "树枝后的路留着与白影相同的淡色痕迹，至少证明它确实来过这里。";
    context.chainId = "whiteShadow";
  } else if (eventDefinition.id === "lockedChest" && flags.discoveredCabinClue) {
    context.bubble = "木屋里的刮痕，和这只锁正好对得上。";
    context.result = outcome.itemSolution
      ? outcome.text + " 木屋记录中的锁具编号也在箱盖内侧出现。"
      : "木箱的锁具与木屋线索一致，但这次仍缺少完整处理条件。";
    context.chainId = "rangerLegacy";
  } else if (eventDefinition.id === "distantCry" && (flags.discoveredCabinClue || flags.openedChest)) {
    context.bubble = "我看过山腰木屋里的记录，你是护林员吗？";
    context.result = outcome.itemSolution
      ? outcome.text + " 对方也确认了木屋和旧护林站之间的联系。"
      : "呼喊者回应了木屋的旧编号，你确认自己没有找错方向。";
    context.chainId = "rangerLegacy";
  } else if (eventDefinition.id === "unstableBridge" && flags.enduredDownpour) {
    context.bubble = "刚才的暴雨把桥绳泡得更松了。";
    context.result = outcome.itemSolution ? outcome.text + " 你也重新处理了被雨水冲松的固定点。" : "暴雨留下的水痕暴露了桥面最危险的受力位置。";
    context.chainId = "safeRoute";
  } else if (eventDefinition.id === "hiddenFork" && flags.repairedBridge) {
    context.bubble = "这条支路也许能绕回刚修好的桥。";
    context.result = "你从岔路回望到加固后的桥面，终于能把两段路线连在一起。";
    context.chainId = "safeRoute";
  } else if (eventDefinition.id === "lostBeforeDark" && (flags.mappedFork || flags.repairedBridge)) {
    context.bubble = "桥和岔路都在同一个方向，路线能接回去。";
    context.result = "前面留下的桥面与岔路标记互相印证，你顺利把返程路线闭合。";
    context.chainId = "safeRoute";
    if (["bad", "rareBad"].indexOf(outcome.tier) !== -1) outcome.tier = "mixed";
  }
  return context;
}

function clearAdventureTimers() {
  adventurePrototypeState.timers.forEach(function(timerId) { window.clearTimeout(timerId); });
  adventurePrototypeState.timers = [];
}

function scheduleAdventureStep(callback, delayMs) {
  const timerId = window.setTimeout(function() {
    adventurePrototypeState.timers = adventurePrototypeState.timers.filter(function(activeId) { return activeId !== timerId; });
    if (adventurePrototypeState.active && adventurePrototypeState.mode === "running") {
      callback();
    }
  }, delayMs);
  adventurePrototypeState.timers.push(timerId);
  return timerId;
}

function renderAdventureCamperFrame(frameName) {
  if (adventureCamper && typeof renderCamperLayerStack === "function") {
    renderCamperLayerStack(adventureCamper, getAdventureProfileSnapshot().appearance, frameName || CAMPER_IDLE_FRAME_NAME);
  }
}

function stopAdventureFrameAnimation() {
  if (adventurePrototypeState.frameTimer) {
    window.clearInterval(adventurePrototypeState.frameTimer);
    adventurePrototypeState.frameTimer = null;
  }
}

function playAdventureAction(actionId) {
  stopAdventureFrameAnimation();
  adventurePrototypeState.action = actionId;
  adventurePrototypeState.frameIndex = 0;
  if (!adventureCamper) {
    return;
  }
  adventureCamper.className = "adventure-camper";
  adventureCamper.classList.toggle("is-walking", actionId === "walk" || actionId === "run");
  adventureCamper.classList.toggle("action-startled", actionId === "startled");
  adventureCamper.classList.toggle("action-brace", actionId === "brace");
  adventureCamper.classList.toggle("action-call", actionId === "call" || actionId === "lantern");
  const frames = ADVENTURE_ACTION_FRAMES[actionId] || ADVENTURE_ACTION_FRAMES.idle;
  renderAdventureCamperFrame(frames[0]);
  if (frames.length > 1) {
    adventurePrototypeState.frameTimer = window.setInterval(function() {
      adventurePrototypeState.frameIndex = (adventurePrototypeState.frameIndex + 1) % frames.length;
      renderAdventureCamperFrame(frames[adventurePrototypeState.frameIndex]);
    }, actionId === "run" ? 82 : actionId === "walk" ? 110 : 260);
  }
}

function setAdventureCamperPosition(point, shouldWalk) {
  if (!adventureCamper || !point) return;
  const nextX = clampAdventureValue(point.x, 8, 92);
  const nextY = clampAdventureValue(point.y, 20, 86);
  const facing = nextX < adventurePrototypeState.camperX ? -1 : 1;
  adventurePrototypeState.camperX = nextX;
  adventurePrototypeState.camperY = nextY;
  adventureCamper.style.left = nextX + "%";
  adventureCamper.style.top = nextY + "%";
  adventureCamper.style.zIndex = String(20 + Math.round(nextY));
  adventureCamper.style.setProperty("--adventure-facing", String(facing));
  if (shouldWalk) playAdventureAction("walk");
}

function showAdventureBubble(text) {
  if (!adventureBubble) return;
  adventureBubble.textContent = text;
  adventureBubble.style.left = clampAdventureValue(adventurePrototypeState.camperX, 22, 78) + "%";
  adventureBubble.style.top = clampAdventureValue(adventurePrototypeState.camperY - 9.5, 17, 72) + "%";
  adventureBubble.classList.add("is-visible");
}

function hideAdventureBubble() {
  if (adventureBubble) adventureBubble.classList.remove("is-visible");
}

function showAdventureUsedItemVisual(itemKey, eventDefinition, visualClass) {
  if (!adventureUsedItemVisual) return;
  const descriptor = getAdventureItemDescriptor(itemKey);
  if (!descriptor) return;
  const prop = eventDefinition && eventDefinition.prop ? eventDefinition.prop : {
    x: adventurePrototypeState.camperX + 6,
    y: adventurePrototypeState.camperY
  };
  const icon = document.createElement("span");
  adventureUsedItemVisual.innerHTML = "";
  applyAdventureItemIcon(icon, descriptor);
  adventureUsedItemVisual.appendChild(icon);
  adventureUsedItemVisual.className = "adventure-used-item-visual is-visible " + (visualClass || "solution-tool");
  adventureUsedItemVisual.style.left = clampAdventureValue(prop.x - 8, 12, 82) + "%";
  adventureUsedItemVisual.style.top = clampAdventureValue(prop.y - 13, 20, 70) + "%";
}

function showAdventureMissingItemVisual(eventDefinition) {
  if (!adventureUsedItemVisual) return;
  adventureUsedItemVisual.innerHTML = '<span class="adventure-missing-item-mark">?</span>';
  adventureUsedItemVisual.className = "adventure-used-item-visual is-visible is-missing";
  adventureUsedItemVisual.style.left = clampAdventureValue(eventDefinition.prop.x - 8, 12, 82) + "%";
  adventureUsedItemVisual.style.top = clampAdventureValue(eventDefinition.prop.y - 13, 20, 70) + "%";
}

function resetAdventureVisuals() {
  resetAdventureRouteAtmosphere();
  if (adventureRainLayer) adventureRainLayer.className = "adventure-rain-layer";
  if (adventureEventProp) {
    adventureEventProp.className = "adventure-event-prop";
    adventureEventProp.removeAttribute("style");
  }
  if (adventureEventAccent) {
    adventureEventAccent.className = "adventure-event-accent";
    adventureEventAccent.removeAttribute("style");
  }
  if (adventureUsedItemVisual) {
    adventureUsedItemVisual.className = "adventure-used-item-visual";
    adventureUsedItemVisual.innerHTML = "";
    adventureUsedItemVisual.removeAttribute("style");
  }
  hideAdventureBubble();
}

function showAdventureEventVisual(eventDefinition) {
  if (adventureEventProp) {
    const propSheetPositions = getAdventureMapPropSheetPositions(getActiveAdventureMapId());
    const propPosition = propSheetPositions[eventDefinition.prop.className];
    adventureEventProp.className = "adventure-event-prop " + eventDefinition.prop.className;
    if (propPosition) {
      adventureEventProp.style.setProperty("--prop-position-x", propPosition[0]);
      adventureEventProp.style.setProperty("--prop-position-y", propPosition[1]);
    }
    adventureEventProp.style.left = eventDefinition.prop.x + "%";
    adventureEventProp.style.top = eventDefinition.prop.y + "%";
    adventureEventProp.style.zIndex = String(18 + Math.round(eventDefinition.prop.y));
    window.requestAnimationFrame(function() {
      adventureEventProp.classList.add("is-visible");
      if (eventDefinition.propStateClass) adventureEventProp.classList.add(eventDefinition.propStateClass);
    });
  }
  if (adventureEventAccent) {
    adventureEventAccent.style.left = eventDefinition.prop.x + "%";
    adventureEventAccent.style.top = eventDefinition.prop.y + "%";
    adventureEventAccent.classList.remove("is-active");
    void adventureEventAccent.offsetWidth;
    adventureEventAccent.classList.add("is-active");
  }
  if (adventureAtmosphere && eventDefinition.atmosphere) adventureAtmosphere.classList.add("is-" + eventDefinition.atmosphere);
  if (adventureRainLayer && eventDefinition.rain) adventureRainLayer.classList.add("is-active");
}

function applyAdventureResolvedVisual(eventDefinition, outcome) {
  if (!adventureEventProp) return;
  if (outcome.missedItemOpportunity) {
    adventureEventProp.classList.remove("is-revealed", "is-cleared", "is-retreating");
    adventureEventProp.classList.add("is-unresolved");
    return;
  }
  if (outcome.itemSolution) {
    adventureEventProp.classList.remove("is-swaying");
    if (eventDefinition.resolvedProp) {
      adventureEventProp.className = "adventure-event-prop " + eventDefinition.resolvedProp + " is-visible is-revealed is-item-solved";
    } else if (eventDefinition.resolvedPropClass) {
      adventureEventProp.classList.add(eventDefinition.resolvedPropClass, "is-item-solved");
    } else {
      adventureEventProp.classList.add("is-revealed", "is-item-solved");
    }
    if (outcome.itemSolution.definition.visualClass) adventureEventProp.classList.add(outcome.itemSolution.definition.visualClass);
    if (adventureRainLayer && ["solution-shelter", "solution-meal"].indexOf(outcome.itemSolution.definition.visualClass) !== -1) {
      adventureRainLayer.classList.add("is-softened");
    }
    return;
  }
  const positive = ["mixed", "good", "rareGood"].indexOf(outcome.tier) !== -1;
  if (positive && eventDefinition.resolvedProp) {
    adventureEventProp.className = "adventure-event-prop " + eventDefinition.resolvedProp + " is-visible is-revealed";
  } else if (positive && eventDefinition.resolvedPropClass) {
    adventureEventProp.classList.add(eventDefinition.resolvedPropClass);
  } else if (positive) {
    adventureEventProp.classList.add("is-revealed");
  } else {
    adventureEventProp.classList.add("is-swaying");
  }
  if (outcome.storyVisualClass) adventureEventProp.classList.add(outcome.storyVisualClass);
}

function updateAdventureStatus(title, text, effectText, active) {
  if (adventureEventTitle) adventureEventTitle.textContent = title;
  if (adventureResultText) adventureResultText.textContent = text;
  if (adventureEffectText) adventureEffectText.textContent = effectText || "";
  if (adventureResult) adventureResult.classList.toggle("is-active", Boolean(active));
}

function updateAdventureRunHud(pendingEventNumber) {
  const progress = ensureAdventureProgress();
  const trip = adventurePrototypeState.trip;
  const eventNumber = pendingEventNumber || (trip ? trip.events.length : 0);
  if (adventureEventCount) adventureEventCount.textContent = "事件 " + eventNumber + " / " + ADVENTURE_MAX_EVENTS_PER_TRIP;
  if (adventureRunStamina) adventureRunStamina.textContent = "体力 " + progress.stamina.value + " / " + ADVENTURE_STAMINA_MAX;
  if (adventureRunBackpack) {
    adventureRunBackpack.textContent = "背包 " + (trip ? getAdventureCountTotal(trip.backpack) : 0) + " / " + ADVENTURE_BACKPACK_CAPACITY +
      " · 发现 " + (trip ? getAdventureCountTotal(trip.loot) : 0);
  }
  if (adventureRunInjuries) {
    const injuryIds = getActiveAdventureInjuryIds(trip);
    adventureRunInjuries.innerHTML = "";
    adventureRunInjuries.classList.toggle("hidden", !injuryIds.length);
    injuryIds.forEach(function(injuryId) {
      const injury = ADVENTURE_INJURY_CATALOG[injuryId];
      const tag = document.createElement("span");
      tag.className = "adventure-injury-tag";
      tag.textContent = injury.label + " · " + injury.impact;
      adventureRunInjuries.appendChild(tag);
    });
  }
}

function getNextAdventurePathPoint() {
  const pathPoints = getAdventureMapPathPoints(getActiveAdventureMapId());
  adventurePrototypeState.pathIndex = (adventurePrototypeState.pathIndex + 1) % pathPoints.length;
  return pathPoints[adventurePrototypeState.pathIndex];
}

function formatAdventureEffectItem(key, quantity) {
  const descriptor = getAdventureItemDescriptor(key);
  return descriptor ? descriptor.name + (quantity > 1 ? " ×" + quantity : "") : "未知物品";
}

function getAdventureOwnedItemCount(progress, trip, itemId) {
  return Math.max(0, Number(progress.storage[itemId]) || 0) +
    Math.max(0, Number(trip && trip.backpack["item:" + itemId]) || 0) +
    Math.max(0, Number(trip && trip.loot && trip.loot["item:" + itemId]) || 0);
}

function unlockAdventureLocation(progress, trip, locationId, messages, itemNotes, mapId) {
  const locations = getAdventureMapLocations(mapId || (trip && trip.mapId) || getActiveAdventureMapId());
  const routes = Array.isArray(progress.unlockedRoutes) ? progress.unlockedRoutes : progress.unlockedLocations;
  if (!locations[locationId] || routes.indexOf(locationId) !== -1) return false;
  routes.push(locationId);
  progress.unlockedRoutes = routes;
  progress.unlockedLocations = routes.slice();
  if (trip.unlocked.indexOf(locationId) === -1) trip.unlocked.push(locationId);
  messages.push("解锁 " + locations[locationId].name);
  if (itemNotes) itemNotes.push("永久解锁路线：" + locations[locationId].name);
  return true;
}

function unlockAdventureMap(progress, trip, mapId, messages, itemNotes) {
  const map = getAdventureMapRegistry()[mapId];
  if (!map || !isAdventureMapPlayable(mapId) || progress.unlockedMaps.indexOf(mapId) !== -1) return false;
  progress.unlockedMaps.push(mapId);
  if (trip) {
    if (!Array.isArray(trip.unlockedMaps)) trip.unlockedMaps = [];
    if (trip.unlockedMaps.indexOf(mapId) === -1) trip.unlockedMaps.push(mapId);
  }
  if (messages) messages.push("解锁地图 " + map.name);
  if (itemNotes) itemNotes.push("永久解锁地图：" + map.name);
  return true;
}

function refreshAdventureMapUnlocks(progress, trip, messages, itemNotes) {
  const adventureProgress = progress || ensureAdventureProgress();
  getAdventureMapIds().forEach(function(mapId) {
    const map = getAdventureMapRegistry()[mapId];
    if (!map || !isAdventureMapPlayable(mapId) || adventureProgress.unlockedMaps.indexOf(mapId) !== -1) return;
    const eligible = typeof map.isUnlockEligible === "function"
      ? map.isUnlockEligible(adventureProgress, trip || null)
      : false;
    if (eligible) unlockAdventureMap(adventureProgress, trip || null, mapId, messages, itemNotes);
  });
  return adventureProgress.unlockedMaps;
}

function addAdventureLoot(trip, key, quantity) {
  if (!trip.loot) trip.loot = {};
  const added = addAdventureCount(trip.loot, key, quantity);
  if (added > 0) addAdventureCount(trip.gained, key, added);
  return added;
}

function grantAdventureReplacementReward(trip, originalItemId, messages, itemFeedback, itemNotes) {
  const reward = ADVENTURE_DUPLICATE_REWARD_POOL[Math.floor(Math.random() * ADVENTURE_DUPLICATE_REWARD_POOL.length)];
  const originalName = ADVENTURE_ITEM_CATALOG[originalItemId].name;
  if (reward.type === "item") {
    const key = "item:" + reward.itemId;
    addAdventureLoot(trip, key, 1);
    messages.push(reward.label);
    itemFeedback.push({ kind: "gain", key: key, quantity: 1 });
    itemNotes.push(originalName + " 已拥有；" + reward.label + "。");
    return { type: "item", key: key };
  }
  if (reward.type === "stamina") {
    const recovered = changeAdventureStamina(reward.amount, trip);
    if (recovered > 0) messages.push(reward.label + "，体力 +" + recovered);
    itemNotes.push(originalName + " 已拥有；" + reward.label + "。");
    return { type: "stamina", amount: recovered };
  }
  messages.push(reward.label);
  itemNotes.push(originalName + " 已拥有；额外发现：" + reward.label + "。");
  return { type: "text" };
}

function grantAdventureItem(trip, itemId, quantity, messages, itemFeedback, itemNotes) {
  const progress = ensureAdventureProgress();
  const rule = getAdventureItemRule(itemId);
  let granted = 0;
  const requested = Math.max(1, Math.floor(Number(quantity) || 1));
  for (let index = 0; index < requested; index += 1) {
    const discoveredKeyItems = Array.isArray(progress.discoveredKeyItems) ? progress.discoveredKeyItems : progress.collectedClues;
    const keyItemAlreadyDiscovered = Boolean(rule.keyItemId) && discoveredKeyItems.indexOf(rule.keyItemId) !== -1;
    const atOwnershipLimit = getAdventureOwnedItemCount(progress, trip, itemId) >= rule.maxOwned;
    if (keyItemAlreadyDiscovered || atOwnershipLimit) {
      grantAdventureReplacementReward(trip, itemId, messages, itemFeedback, itemNotes);
      continue;
    }
    const key = "item:" + itemId;
    if (rule.keyItemId) {
      addAdventureCount(trip.gained, key, 1);
    } else {
      addAdventureLoot(trip, key, 1);
    }
    granted += 1;
    messages.push("发现 " + ADVENTURE_ITEM_CATALOG[itemId].name);
    itemFeedback.push({ kind: "gain", key: key, quantity: 1 });
    itemNotes.push("本次发现：" + ADVENTURE_ITEM_CATALOG[itemId].name + " ×1");
    if (rule.keyItemId) {
      if (discoveredKeyItems.indexOf(rule.keyItemId) === -1) discoveredKeyItems.push(rule.keyItemId);
      progress.discoveredKeyItems = discoveredKeyItems;
      progress.collectedClues = discoveredKeyItems.slice();
      itemNotes.push("获得剧情线索：" + ADVENTURE_ITEM_CATALOG[itemId].name);
      if (rule.unlockLocationId) unlockAdventureLocation(progress, trip, rule.unlockLocationId, messages, itemNotes);
    }
  }
  return granted;
}

function changeAdventureIngredientCount(ingredientId, quantity) {
  const catalog = typeof ingredientCatalog === "object" && ingredientCatalog ? ingredientCatalog : {};
  const amount = Math.max(1, Math.floor(Number(quantity) || 1));
  if (!catalog[ingredientId] || !gameState) return 0;
  if (typeof addInventoryItem === "function") {
    return addInventoryItem("ingredients", ingredientId, amount) ? amount : 0;
  }
  if (!gameState.inventory || typeof gameState.inventory !== "object" || Array.isArray(gameState.inventory)) {
    gameState.inventory = { fish: {}, meals: {}, ingredients: {} };
  }
  if (!gameState.inventory.ingredients || typeof gameState.inventory.ingredients !== "object" || Array.isArray(gameState.inventory.ingredients)) {
    gameState.inventory.ingredients = {};
  }
  gameState.inventory.ingredients[ingredientId] = Math.max(0, Math.floor(Number(gameState.inventory.ingredients[ingredientId]) || 0)) + amount;
  return amount;
}

function unlockAdventureCookingRecipe(recipeId) {
  const recipes = typeof cookingRecipeCatalog === "object" && cookingRecipeCatalog ? cookingRecipeCatalog : {};
  if (!recipes[recipeId] || !gameState) return false;
  if (typeof unlockCookingRecipe === "function") {
    const unlocked = unlockCookingRecipe(recipeId);
    if (unlocked) {
      const progress = ensureAdventureProgress();
      if (progress.recipeDiscoveryPity && Object.prototype.hasOwnProperty.call(progress.recipeDiscoveryPity, recipeId)) progress.recipeDiscoveryPity[recipeId] = 0;
    }
    return unlocked;
  }
  if (!gameState.cooking || typeof gameState.cooking !== "object" || Array.isArray(gameState.cooking)) {
    gameState.cooking = {
      cooked: 0,
      autoCookDate: "",
      autoCookedToday: 0,
      unlockedRecipes: [],
      manuallyCookedRecipes: [],
      recentAutoCookedRecipes: [],
    };
  }
  if (!Array.isArray(gameState.cooking.unlockedRecipes)) gameState.cooking.unlockedRecipes = [];
  if (gameState.cooking.unlockedRecipes.indexOf(recipeId) !== -1) return false;
  gameState.cooking.unlockedRecipes.push(recipeId);
  const progress = ensureAdventureProgress();
  if (progress.recipeDiscoveryPity && Object.prototype.hasOwnProperty.call(progress.recipeDiscoveryPity, recipeId)) progress.recipeDiscoveryPity[recipeId] = 0;
  return true;
}

function ensureAdventureTripArray(trip, key) {
  if (!Array.isArray(trip[key])) trip[key] = [];
  return trip[key];
}

function grantAdventureKeyClue(trip, clueId, messages, itemNotes) {
  const progress = ensureAdventureProgress();
  const catalog = typeof ADVENTURE_KEY_CLUE_CATALOG === "object" && ADVENTURE_KEY_CLUE_CATALOG ? ADVENTURE_KEY_CLUE_CATALOG : {};
  if (!catalog[clueId]) return false;
  if (!Array.isArray(progress.keyClues)) progress.keyClues = [];
  if (progress.keyClues.indexOf(clueId) !== -1) return false;
  progress.keyClues.push(clueId);
  ensureAdventureTripArray(trip, "keyCluesFound").push(clueId);
  messages.push("获得关键线索：" + getAdventureKeyClueName(clueId));
  if (itemNotes) itemNotes.push("关键线索：" + getAdventureKeyClueName(clueId));
  refreshAdventureStoryStates(progress);
  return true;
}

function clearAdventureItemFeedback() {
  adventurePrototypeState.feedbackTimers.forEach(function(timerId) { window.clearTimeout(timerId); });
  adventurePrototypeState.feedbackTimers = [];
  if (adventureItemFeedbackLayer) adventureItemFeedbackLayer.innerHTML = "";
}

function scheduleAdventureItemFeedback(callback, delay) {
  const timerId = window.setTimeout(callback, delay);
  adventurePrototypeState.feedbackTimers.push(timerId);
  return timerId;
}

function showAdventureItemFeedback(entry) {
  if (!adventureItemFeedbackLayer) return;
  const descriptor = getAdventureItemDescriptor(entry.key);
  if (!descriptor) return;
  const toast = document.createElement("div");
  const icon = document.createElement("span");
  const copy = document.createElement("span");
  const verb = entry.kind === "gain" ? "获得" : (entry.kind === "lost" ? "丢失" : "消耗");
  toast.className = "adventure-item-feedback is-" + entry.kind;
  applyAdventureItemIcon(icon, descriptor);
  copy.className = "adventure-item-feedback-copy";
  copy.textContent = verb + "：" + descriptor.name + (entry.quantity > 1 ? " ×" + entry.quantity : "");
  toast.appendChild(icon);
  toast.appendChild(copy);
  adventureItemFeedbackLayer.appendChild(toast);
  scheduleAdventureItemFeedback(function() { toast.classList.add("is-visible"); }, 16);
  scheduleAdventureItemFeedback(function() { toast.classList.add("is-leaving"); }, 780);
  scheduleAdventureItemFeedback(function() { toast.remove(); }, 1080);
}

function playAdventureItemFeedback(entries) {
  clearAdventureItemFeedback();
  (entries || []).forEach(function(entry, index) {
    scheduleAdventureItemFeedback(function() { showAdventureItemFeedback(entry); }, index * 340);
  });
}

function removeAdventureItemsByCategory(trip, categories, quantity, ledgerType) {
  let remaining = Math.max(0, Math.floor(Number(quantity) || 0));
  const removedEntries = [];
  Object.keys(trip.backpack).some(function(key) {
    const descriptor = getAdventureItemDescriptor(key);
    if (!descriptor || categories.indexOf(descriptor.category) === -1 || remaining <= 0) return false;
    const removed = removeAdventureCount(trip.backpack, key, remaining);
    if (removed > 0) {
      addAdventureCount(trip[ledgerType], key, removed);
      removedEntries.push({ key: key, quantity: removed });
      remaining -= removed;
    }
    return remaining <= 0;
  });
  return removedEntries;
}

function changeAdventureStamina(amount, trip) {
  const progress = ensureAdventureProgress();
  const before = progress.stamina.value;
  progress.stamina.value = clampAdventureValue(before + amount, 0, ADVENTURE_STAMINA_MAX);
  progress.stamina.updatedAt = Date.now();
  const applied = progress.stamina.value - before;
  trip.staminaEventDelta += applied;
  return applied;
}

const ADVENTURE_INJURY_CATALOG = {
  sprain: { id: "sprain", label: "扭伤", treatmentTarget: "扭伤的脚踝", description: "脚踝发不上力", impact: "经过危险地形会额外消耗体力，持续恶化可能提前返回。" },
  cut: { id: "cut", label: "割伤", treatmentTarget: "割伤的手指", description: "手指被锐边割伤", impact: "处理工具和攀爬时会更吃力。" },
  scratch: { id: "scratch", label: "抓伤", treatmentTarget: "抓伤的手臂", description: "手臂留下抓痕", impact: "靠近动物或穿过灌木时会额外谨慎。" },
  insectBite: { id: "insectBite", label: "虫咬红肿", treatmentTarget: "虫咬红肿处", description: "虫咬处开始红肿", impact: "潮湿与虫群事件会让不适加重。" },
  abrasion: { id: "abrasion", label: "擦伤", treatmentTarget: "擦伤处", description: "跌倒时擦伤了皮肤", impact: "继续赶路会额外消耗少量体力。" }
};

function getAdventureInjuryType(eventDefinition) {
  const eventId = eventDefinition && eventDefinition.id;
  if (["unstableBridge", "ridgeWindGust", "canopyWalkway", "muddyCrossing"].indexOf(eventId) !== -1) return "sprain";
  if (["streamSparkle", "floodedSupplyCrate", "lockedChest", "oldWaterGauge", "vineBarricade"].indexOf(eventId) !== -1) return "cut";
  if (["snaredAnimal"].indexOf(eventId) !== -1) return "scratch";
  if (["insectSwarm"].indexOf(eventId) !== -1) return "insectBite";
  return "abrasion";
}

function getAdventureInjuryLabel(eventDefinition) {
  return ADVENTURE_INJURY_CATALOG[getAdventureInjuryType(eventDefinition)].treatmentTarget;
}

function getActiveAdventureInjuryIds(trip) {
  return Object.keys(trip && trip.injuries && typeof trip.injuries === "object" ? trip.injuries : {}).filter(function(injuryId) {
    return Boolean(ADVENTURE_INJURY_CATALOG[injuryId] && trip.injuries[injuryId]);
  });
}

function addAdventureInjury(trip, injuryId, sourceEventId) {
  if (!trip || !ADVENTURE_INJURY_CATALOG[injuryId]) return null;
  if (!trip.injuries || typeof trip.injuries !== "object" || Array.isArray(trip.injuries)) trip.injuries = {};
  if (trip.injuries[injuryId]) return null;
  trip.injuries[injuryId] = { id: injuryId, sourceEventId: sourceEventId || "test", createdAt: Date.now() };
  return ADVENTURE_INJURY_CATALOG[injuryId];
}

function consumeAdventureFirstAidForInjuries(trip, messages, itemFeedback, itemNotes, treatmentRecords) {
  const injuryIds = getActiveAdventureInjuryIds(trip);
  if (!injuryIds.length || !backpackHasAdventureItem(trip.backpack, "firstAidPouch")) return false;
  removeAdventureCount(trip.backpack, "item:firstAidPouch", 1);
  addAdventureCount(trip.consumed, "item:firstAidPouch", 1);
  const labels = injuryIds.map(function(injuryId) { return ADVENTURE_INJURY_CATALOG[injuryId].treatmentTarget; });
  injuryIds.forEach(function(injuryId) { delete trip.injuries[injuryId]; });
  const recovered = changeAdventureStamina(4, trip);
  const treatmentText = "使用急救包处理了" + labels.join("和") + "，避免伤势继续恶化。" + (recovered > 0 ? " 体力稍微恢复。" : "");
  messages.push(treatmentText);
  itemFeedback.push({ kind: "consumed", key: "item:firstAidPouch", quantity: 1 });
  itemNotes.push("治疗记录：" + treatmentText + " 消耗：急救包 ×1");
  treatmentRecords.push({ injuryIds: injuryIds, text: treatmentText });
  showAdventureUsedItemVisual("item:firstAidPouch", adventurePrototypeState.currentEvent, "solution-first-aid");
  playAdventureAction("open");
  trip.injuryStrain = 0;
  return true;
}

function applyAdventureConsequences(eventDefinition, reaction, outcome) {
  const trip = adventurePrototypeState.trip;
  const progress = ensureAdventureProgress();
  const effects = outcome.skipBaseConsequences ? [] : ((getAdventureMapEventConsequences(trip.mapId || getDefaultAdventureMapId())[eventDefinition.id] || {})[outcome.tier] || []);
  const messages = [];
  const itemFeedback = [];
  const itemNotes = [];
  let eventStaminaDelta = 0;
  let usedRecoveryConsumable = false;
  let consumedSolutionItem = false;
  let consumedFollowUpItem = false;
  const injuryRecords = [];
  const treatmentRecords = [];

  if (outcome.missedItemOpportunity) {
    const applied = changeAdventureStamina(-1, trip);
    eventStaminaDelta += applied;
    if (applied) messages.push("准备不足，体力 " + applied);
  }

  if (outcome.itemSolution) {
    const earlySolution = outcome.itemSolution;
    const earlyDefinition = earlySolution.definition;
    const shouldConsumeEarly = (earlyDefinition.consumeRequirements || []).indexOf(earlySolution.requirement) !== -1;
    if (shouldConsumeEarly) {
      const removed = removeAdventureCount(trip.backpack, earlySolution.itemKey, 1);
      const descriptor = getAdventureItemDescriptor(earlySolution.itemKey);
      if (removed > 0) {
        addAdventureCount(trip.consumed, earlySolution.itemKey, removed);
        messages.push("消耗 " + formatAdventureEffectItem(earlySolution.itemKey, removed));
        itemFeedback.push({ kind: "consumed", key: earlySolution.itemKey, quantity: removed });
        itemNotes.push("消耗：" + formatAdventureEffectItem(earlySolution.itemKey, removed));
        consumedSolutionItem = true;
        usedRecoveryConsumable = descriptor && (descriptor.type === "meal" || ["firstAidPouch", "mountainHerb", "trailRation"].indexOf(descriptor.id) !== -1);
      }
    }
    const shouldConsumeFollowUp = earlySolution.followUpItemKey &&
      (earlyDefinition.consumeFollowUpRequirements || []).indexOf(earlySolution.followUpRequirement) !== -1;
    if (shouldConsumeFollowUp) {
      const removedFollowUp = removeAdventureCount(trip.backpack, earlySolution.followUpItemKey, 1);
      const followUpDescriptor = getAdventureItemDescriptor(earlySolution.followUpItemKey);
      if (removedFollowUp > 0) {
        addAdventureCount(trip.consumed, earlySolution.followUpItemKey, removedFollowUp);
        messages.push("消耗 " + formatAdventureEffectItem(earlySolution.followUpItemKey, removedFollowUp));
        itemFeedback.push({ kind: "consumed", key: earlySolution.followUpItemKey, quantity: removedFollowUp });
        itemNotes.push("消耗：" + formatAdventureEffectItem(earlySolution.followUpItemKey, removedFollowUp));
        consumedFollowUpItem = true;
        usedRecoveryConsumable = followUpDescriptor && (followUpDescriptor.type === "meal" || ["firstAidPouch", "mountainHerb", "trailRation"].indexOf(followUpDescriptor.id) !== -1);
      }
    }
  }

  effects.forEach(function(effect) {
    if (effect.type === "gain" && ADVENTURE_ITEM_CATALOG[effect.itemId]) {
      grantAdventureItem(trip, effect.itemId, effect.quantity || 1, messages, itemFeedback, itemNotes);
    } else if (effect.type === "gainIngredient") {
      const gained = changeAdventureIngredientCount(effect.ingredientId, effect.quantity || 1);
      if (gained > 0) {
        if (!trip.gainedIngredients) trip.gainedIngredients = {};
        addAdventureCount(trip.gainedIngredients, effect.ingredientId, gained);
        messages.push("获得料理原料：" + getAdventureIngredientName(effect.ingredientId) + (gained > 1 ? " ×" + gained : ""));
        itemNotes.push("料理原料：" + getAdventureIngredientName(effect.ingredientId) + (gained > 1 ? " ×" + gained : ""));
      }
    } else if (effect.type === "unlockRecipe") {
      const recipe = typeof cookingRecipeCatalog === "object" ? cookingRecipeCatalog[effect.recipeId] : null;
      if (recipe && recipe.sourceType !== "story" && unlockAdventureCookingRecipe(effect.recipeId)) {
        ensureAdventureTripArray(trip, "unlockedRecipes").push(effect.recipeId);
        messages.push("解锁菜谱：" + getAdventureRecipeName(effect.recipeId));
        itemNotes.push("永久菜谱：" + getAdventureRecipeName(effect.recipeId));
      }
    } else if (effect.type === "keyClue") {
      grantAdventureKeyClue(trip, effect.clueId, messages, itemNotes);
    } else if (effect.type === "loseCategory") {
      const removed = removeAdventureItemsByCategory(trip, effect.categories || [], effect.quantity || 1, "lost");
      messages.push(removed.length ? "丢失 " + removed.map(function(entry) { return formatAdventureEffectItem(entry.key, entry.quantity); }).join("、") : "背包中没有可丢失的食物");
      removed.forEach(function(entry) {
        itemFeedback.push({ kind: "lost", key: entry.key, quantity: entry.quantity });
        itemNotes.push("物品丢失：" + formatAdventureEffectItem(entry.key, entry.quantity));
      });
    } else if (effect.type === "consumeCategory") {
      const consumed = removeAdventureItemsByCategory(trip, effect.categories || [], effect.quantity || 1, "consumed");
      messages.push(consumed.length ? "消耗 " + consumed.map(function(entry) { return formatAdventureEffectItem(entry.key, entry.quantity); }).join("、") : "没有携带可消耗的食物");
      consumed.forEach(function(entry) {
        itemFeedback.push({ kind: "consumed", key: entry.key, quantity: entry.quantity });
        itemNotes.push("消耗：" + formatAdventureEffectItem(entry.key, entry.quantity));
      });
    } else if (effect.type === "loseItem") {
      const key = "item:" + effect.itemId;
      const lost = removeAdventureCount(trip.backpack, key, effect.quantity || 1);
      if (lost > 0) {
        addAdventureCount(trip.lost, key, lost);
        messages.push("丢失 " + formatAdventureEffectItem(key, lost));
        itemFeedback.push({ kind: "lost", key: key, quantity: lost });
        itemNotes.push("物品丢失：" + formatAdventureEffectItem(key, lost));
      }
    } else if (effect.type === "stamina") {
      const applied = changeAdventureStamina(effect.amount, trip);
      eventStaminaDelta += applied;
      if (applied !== 0) messages.push("体力 " + (applied > 0 ? "+" : "") + applied);
    } else if (effect.type === "unlock" && getAdventureMapLocations(trip.mapId || getDefaultAdventureMapId())[effect.locationId]) {
      unlockAdventureLocation(progress, trip, effect.locationId, messages, itemNotes);
    } else if (effect.type === "unlockMap") {
      unlockAdventureMap(progress, trip, effect.mapId, messages, itemNotes);
    } else if (effect.type === "status") {
      if (trip.statuses.indexOf(effect.label) === -1) trip.statuses.push(effect.label);
      messages.push(effect.label);
    }
  });

  (trip.recipeGuarantees || []).forEach(function(recipeId) {
    const recipe = cookingRecipeCatalog[recipeId];
    if (!recipe || recipe.sourceEventIds.indexOf(eventDefinition.id) === -1 || isAdventureRecipeUnlockedForDisplay(recipeId)) return;
    if (unlockAdventureCookingRecipe(recipeId)) {
      ensureAdventureTripArray(trip, "unlockedRecipes").push(recipeId);
      messages.push("在" + eventDefinition.title + "发现菜谱：" + getAdventureRecipeName(recipeId));
      itemNotes.push("探索保底发现菜谱：" + getAdventureRecipeName(recipeId));
    }
  });

  if (outcome.itemSolution) {
    const solution = outcome.itemSolution;
    const definition = solution.definition;
    const descriptor = getAdventureItemDescriptor(solution.itemKey);
    const solutionLog = (solution.isCombined && definition.combinedLog) || (definition.logByRequirement && definition.logByRequirement[solution.requirement]) || definition.log || "携带物品发挥了作用。";
    if (progress.itemSolutionKnowledge.indexOf(solution.id) === -1) progress.itemSolutionKnowledge.push(solution.id);
    itemNotes.push(solutionLog);
    if (!consumedSolutionItem && descriptor) {
      itemNotes.push("物品发挥作用：" + descriptor.name + "（未消耗）");
      messages.push("使用 " + descriptor.name + "（未消耗）");
    }
    if (solution.followUpItemKey && !consumedFollowUpItem) {
      const followUpDescriptor = getAdventureItemDescriptor(solution.followUpItemKey);
      if (followUpDescriptor) itemNotes.push("物品发挥作用：" + followUpDescriptor.name + "（未消耗）");
    }
    const solutionStamina = definition.staminaByRequirement
      ? Number(definition.staminaByRequirement[solution.requirement]) || 0
      : Number(definition.stamina) || 0;
    if (solutionStamina) {
      const applied = changeAdventureStamina(solutionStamina, trip);
      if (applied) messages.push("体力 " + (applied > 0 ? "+" : "") + applied);
    }
    if (definition.unlockLocationId) unlockAdventureLocation(progress, trip, definition.unlockLocationId, messages, itemNotes);
  }

  const eventTags = Array.isArray(eventDefinition.tags) ? eventDefinition.tags : [];
  const injuryEvent = eventTags.indexOf("injury") !== -1 || ["unstableBridge", "streamSparkle", "ridgeWindGust", "snaredAnimal", "oldWaterGauge", "flashFloodDebris", "floodedSupplyCrate", "insectSwarm", "canopyWalkway"].indexOf(eventDefinition.id) !== -1;
  const fatigueEvent = eventTags.indexOf("fatigue") !== -1 || ["suddenDownpour", "unstableBridge", "streamSparkle", "lostBeforeDark", "morningFogPockets", "ridgeWindGust", "fallenTrailMarker", "mushroomRing", "washedOutCache", "watchtowerSignal", "nightCampEcho"].indexOf(eventDefinition.id) !== -1;
  const existingInjuries = getActiveAdventureInjuryIds(trip);
  if (!usedRecoveryConsumable && existingInjuries.length && backpackHasAdventureItem(trip.backpack, "firstAidPouch")) {
    usedRecoveryConsumable = consumeAdventureFirstAidForInjuries(trip, messages, itemFeedback, itemNotes, treatmentRecords);
  } else if (existingInjuries.length && (injuryEvent || fatigueEvent)) {
    const activeLabels = existingInjuries.map(function(injuryId) { return ADVENTURE_INJURY_CATALOG[injuryId].label; });
    const penalty = changeAdventureStamina(-2, trip);
    eventStaminaDelta += penalty;
    trip.injuryStrain = Math.max(0, Number(trip.injuryStrain) || 0) + 1;
    const feedback = activeLabels.join("和") + "让这段路更难处理，体力额外消耗 2 点。";
    messages.push(feedback);
    itemNotes.push("伤势影响：" + feedback);
    if (trip.injuryStrain >= 2) trip.forceEarlyReturnReason = "伤势恶化";
  }
  if (!usedRecoveryConsumable && injuryEvent && eventStaminaDelta <= -4 && backpackHasAdventureItem(trip.backpack, "firstAidPouch")) {
    const injuryId = getAdventureInjuryType(eventDefinition);
    const injury = addAdventureInjury(trip, injuryId, eventDefinition.id);
    if (injury) injuryRecords.push({ id: injuryId, label: injury.label, description: injury.description, treated: true });
    usedRecoveryConsumable = consumeAdventureFirstAidForInjuries(trip, messages, itemFeedback, itemNotes, treatmentRecords);
  } else if (injuryEvent && eventStaminaDelta <= -4) {
    const injuryId = getAdventureInjuryType(eventDefinition);
    const injury = addAdventureInjury(trip, injuryId, eventDefinition.id);
    if (injury) {
      const injuryText = "受伤：" + injury.description + "。当前影响：" + injury.impact;
      injuryRecords.push({ id: injuryId, label: injury.label, description: injury.description, treated: false });
      messages.push(injuryText);
      itemNotes.push("受伤记录：" + injuryText);
    }
  } else if (!usedRecoveryConsumable && fatigueEvent && eventStaminaDelta <= -2 && backpackHasAdventureItem(trip.backpack, "mountainHerb")) {
    removeAdventureCount(trip.backpack, "item:mountainHerb", 1);
    addAdventureCount(trip.consumed, "item:mountainHerb", 1);
    const recovered = changeAdventureStamina(4, trip);
    messages.push("使用 山地草药，体力 +" + recovered);
    itemFeedback.push({ kind: "consumed", key: "item:mountainHerb", quantity: 1 });
    itemNotes.push("你用山地草药缓解了疲劳。消耗：山地草药 ×1");
    showAdventureUsedItemVisual("item:mountainHerb", eventDefinition, "solution-herb");
    playAdventureAction("rest");
    usedRecoveryConsumable = true;
  }
  if (!usedRecoveryConsumable && progress.stamina.value <= 15 && backpackHasAdventureItem(trip.backpack, "trailRation")) {
    removeAdventureCount(trip.backpack, "item:trailRation", 1);
    addAdventureCount(trip.consumed, "item:trailRation", 1);
    const recovered = changeAdventureStamina(6, trip);
    messages.push("自动吃下干粮包补充体力，脚步稳了一些。");
    itemFeedback.push({ kind: "consumed", key: "item:trailRation", quantity: 1 });
    itemNotes.push("干粮只补充体力，没有处理伤势。消耗：干粮包 ×1" + (recovered > 0 ? "，体力恢复 " + recovered + " 点。" : "。"));
    showAdventureUsedItemVisual("item:trailRation", eventDefinition, "solution-ration");
    playAdventureAction("rest");
  }

  progress.pendingBackpack = cloneAdventureCountMap(trip.backpack);
  progress.pendingLoot = cloneAdventureCountMap(trip.loot);
  saveGame();
  if (typeof renderInventoryPanel === "function") renderInventoryPanel();
  playAdventureItemFeedback(itemFeedback);
  return { messages: messages, itemNotes: itemNotes, injuryRecords: injuryRecords, treatmentRecords: treatmentRecords };
}

function updateAdventureEventFlags(eventDefinition, reaction, outcome, storyContext, trip) {
  const flags = trip.eventFlags;
  const favorable = ["good", "rareGood"].indexOf(outcome.tier) !== -1;
  if (eventDefinition.id === "animalTracks") {
    flags.foundAnimalTracks = true;
    if (reaction.id === "followTracks" && !outcome.missedItemOpportunity) flags.followedAnimal = true;
    if (reaction.id === "offerFish" && outcome.itemSolution) flags.befriendedAnimal = true;
    if (["followTracks", "markArea"].indexOf(reaction.id) !== -1 && ["bad", "rareBad"].indexOf(outcome.tier) !== -1) flags.animalStartled = true;
    if (reaction.id === "giveSpace") flags.animalGivenSpace = true;
    if (favorable || (!outcome.missedItemOpportunity && ["followTracks", "measureTracks"].indexOf(reaction.id) !== -1)) flags.observedAnimal = true;
  } else if (eventDefinition.id === "forestFootsteps") {
    flags.heardStrangeFootsteps = true;
    if (flags.foundAnimalTracks && favorable) flags.observedAnimal = true;
    if (reaction.id === "holdCharm" && outcome.itemSolution) flags.supernaturalTrail = true;
  } else if (eventDefinition.id === "missingFood") {
    if (flags.foundAnimalTracks && ["rareBad", "bad"].indexOf(outcome.tier) === -1) flags.identifiedFoodThief = true;
    if (flags.animalStartled) flags.animalFoodStolen = true;
  } else if (eventDefinition.id === "whiteShadow") {
    flags.sawWhiteShadow = true;
    flags.whiteShadowTrust = Number(flags.whiteShadowTrust) || 0;
    if (["showCharm", "speakToGhost", "raiseLantern"].indexOf(reaction.id) !== -1) flags.whiteShadowTrust += 1;
    if (reaction.id === "approachGhost" && ["bad", "rareBad"].indexOf(outcome.tier) !== -1) flags.whiteShadowTrust -= 1;
    if (favorable || outcome.itemSolution) flags.whiteShadowResolved = true;
    if (reaction.id === "showCharm" && outcome.itemSolution) flags.supernaturalTrail = true;
  } else if (eventDefinition.id === "abandonedCabin") {
    if (favorable || outcome.itemSolution || reaction.id === "circleCabin") flags.discoveredCabinClue = true;
    if (reaction.id === "circleCabin" || favorable) flags.foundRangerEvidence = true;
  } else if (eventDefinition.id === "lockedChest") {
    flags.foundLockedChest = true;
    if (outcome.itemSolution) flags.openedChest = true;
    if (trip.gained["item:sealedLetter"]) flags.archivedSealedLetter = true;
  } else if (eventDefinition.id === "streamSparkle") {
    flags.foundStreamClue = true;
    if (trip.gained["item:oldKey"]) flags.foundOldKey = true;
  } else if (eventDefinition.id === "distantCry") {
    flags.heardRescueCall = true;
    if (reaction.id === "showRangerToken" && outcome.itemSolution) flags.rangerTrusted = true;
    if (reaction.id === "prepareAid" && outcome.itemSolution) flags.reachedRanger = true;
    if (outcome.itemSolution && outcome.itemSolution.isCombined) flags.completedRescue = true;
    if (favorable) flags.foundRangerEvidence = true;
  } else if (eventDefinition.id === "suddenDownpour") {
    flags.enduredDownpour = true;
  } else if (eventDefinition.id === "unstableBridge") {
    if (reaction.id === "reinforceBridge" && outcome.itemSolution) flags.repairedBridge = true;
  } else if (eventDefinition.id === "hiddenFork") {
    flags.foundHiddenFork = true;
    if (reaction.id === "readTrailMap" && outcome.itemSolution) flags.mappedFork = true;
    if (favorable && (flags.repairedBridge || flags.sawWhiteShadow || flags.mappedFork)) flags.securedRoute = true;
  } else if (eventDefinition.id === "lostBeforeDark") {
    if (favorable) flags.routeRecovered = true;
    if (flags.sawWhiteShadow && flags.whiteShadowTrust > 0 && favorable) flags.whiteShadowGuided = true;
    if (flags.sawWhiteShadow && flags.whiteShadowTrust < 0) flags.whiteShadowMisled = true;
    if (flags.sawWhiteShadow && flags.whiteShadowTrust === 0) flags.whiteShadowObserved = true;
    if (favorable && (flags.mappedFork || flags.repairedBridge)) flags.securedRoute = true;
  } else if (eventDefinition.id === "morningFogPockets") {
    flags.crossedMorningFog = true;
    if (outcome.itemSolution || favorable) flags.mappedMorningFog = true;
  } else if (eventDefinition.id === "ridgeWindGust") {
    flags.enduredRidgeWind = true;
    if (reaction.id === "securePack" && outcome.itemSolution) flags.securedWindGear = true;
  } else if (eventDefinition.id === "fallenTrailMarker") {
    flags.foundFallenTrailMarker = true;
    if (outcome.itemSolution || favorable) flags.restoredTrailMarker = true;
  } else if (eventDefinition.id === "rangerNotebook") {
    flags.foundRangerNotebook = true;
    if (outcome.itemSolution || favorable) flags.decodedRangerNotebook = true;
    if (favorable) flags.foundRangerEvidence = true;
  } else if (eventDefinition.id === "snaredAnimal") {
    flags.foundSnaredAnimal = true;
    if (outcome.itemSolution || favorable) {
      flags.rescuedAnimal = true;
      flags.observedAnimal = true;
    }
    if (["bad", "rareBad"].indexOf(outcome.tier) !== -1) flags.animalStartled = true;
  } else if (eventDefinition.id === "mushroomRing") {
    flags.foundMushroomRing = true;
    if (reaction.id === "showCharm" && outcome.itemSolution) flags.supernaturalTrail = true;
  } else if (eventDefinition.id === "washedOutCache") {
    flags.foundWashedOutCache = true;
    if (outcome.itemSolution) flags.openedWashedOutCache = true;
  } else if (eventDefinition.id === "oldWaterGauge") {
    flags.foundOldWaterGauge = true;
    if (outcome.itemSolution || favorable) flags.readWaterGauge = true;
    if (reaction.id === "repairGauge" && outcome.itemSolution) flags.repairedWaterGauge = true;
  } else if (eventDefinition.id === "watchtowerSignal") {
    flags.sawWatchtowerSignal = true;
    if (outcome.itemSolution || favorable) flags.answeredWatchtowerSignal = true;
    if (favorable) flags.foundRangerEvidence = true;
  } else if (eventDefinition.id === "nightCampEcho") {
    flags.heardNightEcho = true;
    if (reaction.id === "showCharm" && outcome.itemSolution) flags.supernaturalTrail = true;
  }
  const map = getAdventureMap(trip.mapId || getDefaultAdventureMapId());
  if (map && typeof map.updateEventFlags === "function") {
    map.updateEventFlags(eventDefinition, reaction, outcome, storyContext, trip);
  }
  trip.hookProgress = evaluateAdventureHookProgress(trip);
  const connectors = ["最初，", "继续深入后，", "沿着先前的痕迹，", "接近返程时，", "最后，"];
  const storyText = connectors[Math.min(trip.events.length, connectors.length - 1)] +
    "你遇到了“" + eventDefinition.title + "”。" + outcome.text;
  trip.storyBeats.push(storyText);
  return { storyText: storyText, chainId: storyContext.chainId || "" };
}

function logAdventureDecision(eventDefinition, snapshot, reactionSelection, outcome, effectMessages) {
  console.groupCollapsed("[Adventure Trip] " + eventDefinition.title);
  console.log("Final traits", snapshot.finalTraits);
  console.log("Habit modifiers", snapshot.habitModifiers);
  console.log("Daily adventure modifiers", snapshot.dailyAdventureModifiers);
  console.table(reactionSelection.candidates.map(function(candidate) {
    return { id: candidate.reaction.id, type: candidate.reaction.type, weight: Number(candidate.weight.toFixed(2)), itemReady: candidate.hasRequiredItem };
  }));
  console.log("Selected reaction", reactionSelection.reaction.id, reactionSelection.reaction.type);
  console.log("Outcome", outcome.tier, Number(outcome.adjustedRoll.toFixed(2)));
  console.log("Applied effects", effectMessages);
  console.groupEnd();
}

function finishAdventureEventCycle() {
  const trip = adventurePrototypeState.trip;
  if (!trip || adventurePrototypeState.mode !== "running") return;
  adventurePrototypeState.busy = false;
  const progress = ensureAdventureProgress();
  updateAdventureRunHud();
  if (trip.forceEarlyReturnReason) {
    scheduleAdventureStep(function() { finishAdventureTrip("injuryReturn", "伤势恶化，提前返回"); }, 1300);
  } else if (progress.stamina.value <= 0) {
    scheduleAdventureStep(function() { finishAdventureTrip("staminaEmpty", "体力耗尽"); }, 1300);
  } else if (trip.events.length >= ADVENTURE_MAX_EVENTS_PER_TRIP) {
    scheduleAdventureStep(function() { finishAdventureTrip("routeComplete", "完成五个事件"); }, 1300);
  } else {
    scheduleAdventureStep(triggerNextAdventureEvent, 1500);
  }
}

function triggerNextAdventureEvent() {
  const trip = adventurePrototypeState.trip;
  if (!trip || adventurePrototypeState.busy || adventurePrototypeState.mode !== "running") return;
  clearAdventureTimers();
  adventurePrototypeState.busy = true;
  const leadSnapshot = getAdventureProfileSnapshot();
  const eventDefinition = chooseNextAdventureEvent(leadSnapshot);
  const participationPlan = prepareAdventureEventParticipation(trip, eventDefinition, leadSnapshot);
  const snapshot = participationPlan.actorSnapshot;
  const reactionSelection = chooseAdventureReaction(eventDefinition, snapshot, trip.backpack);
  const reaction = reactionSelection.reaction;
  const outcome = resolveAdventureOutcome(eventDefinition, reaction, snapshot, trip.backpack);
  const storyContext = applyAdventureStoryContext(eventDefinition, reaction, outcome, trip);
  if (storyContext.result) outcome.text = storyContext.result;
  outcome.storyVisualClass = storyContext.visualClass;
  const missingItemCandidate = getAdventureMissingItemOpportunity(eventDefinition, reactionSelection, ensureAdventureProgress());
  const missingItemOpportunity = missingItemCandidate && ["rareBad", "bad", "mixed"].indexOf(outcome.tier) !== -1
    ? missingItemCandidate
    : null;
  const carriedButUnusedNotes = getCarriedButUnusedItemNotes(reactionSelection, reaction, outcome);
  let bubbleText = storyContext.bubble || pickAdventureArrayValue(reaction.bubbles);
  if (missingItemOpportunity) {
    bubbleText = missingItemOpportunity.bubble;
    outcome.tier = "mixed";
    outcome.text = missingItemOpportunity.result;
    outcome.itemSolution = null;
    outcome.missedItemOpportunity = missingItemOpportunity;
    outcome.skipBaseConsequences = true;
  }
  const eventNumber = trip.events.length + 1;
  adventurePrototypeState.currentEvent = eventDefinition;
  adventurePrototypeState.seenEventIds.push(eventDefinition.id);
  resetAdventureVisuals();
  updateAdventureStatus(eventDefinition.title, "Camper 正在靠近发生动静的地方。", "", false);
  updateAdventureRunHud(eventNumber);
  if (adventurePhaseLabel) adventurePhaseLabel.textContent = "前往事件位置";
  setAdventureCamperPosition(eventDefinition.approach, true);

  scheduleAdventureStep(function() {
    playAdventureAction("idle");
    showAdventureEventVisual(eventDefinition);
    if (adventurePhaseLabel) adventurePhaseLabel.textContent = eventDefinition.phase;
  }, 1750);
  scheduleAdventureStep(function() {
    showAdventureBubble(bubbleText);
    playAdventureAction(reaction.action);
    if (outcome.itemSolution) {
      showAdventureUsedItemVisual(outcome.itemSolution.itemKey, eventDefinition, outcome.itemSolution.definition.visualClass);
    } else if (missingItemOpportunity) {
      showAdventureMissingItemVisual(eventDefinition);
    }
    if (adventurePhaseLabel) adventurePhaseLabel.textContent = reaction.type;
  }, 2250);
  scheduleAdventureStep(function() {
    applyAdventureResolvedVisual(eventDefinition, outcome);
    if (adventureEventProp && outcome.storyVisualClass) adventureEventProp.classList.add(outcome.storyVisualClass);
  }, 3150);
  scheduleAdventureStep(function() {
    const staminaBefore = ensureAdventureProgress().stamina.value;
    const consequenceResult = applyAdventureConsequences(eventDefinition, reaction, outcome);
    const effectMessages = consequenceResult.messages;
    if (consequenceResult.injuryRecords.length) {
      outcome.text += " " + consequenceResult.injuryRecords.map(function(record) { return record.description + "。"; }).join(" ");
    }
    const itemNotes = consequenceResult.itemNotes.concat(
      missingItemOpportunity ? [missingItemOpportunity.note] : [],
      carriedButUnusedNotes
    );
    const storyUpdate = updateAdventureEventFlags(eventDefinition, reaction, outcome, storyContext, trip);
    const participation = createAdventureEventParticipation(trip, eventDefinition, reaction, outcome, participationPlan);
    const eventLog = {
      eventId: eventDefinition.id,
      title: eventDefinition.title,
      reactionId: reaction.id,
      reactionType: reaction.type,
      bubble: bubbleText,
      outcomeTier: outcome.tier,
      result: outcome.text,
      effectText: effectMessages.join(" · "),
      itemNotes: itemNotes,
      storyText: storyUpdate.storyText,
      chainId: storyUpdate.chainId,
      usedItemKey: outcome.itemSolution ? outcome.itemSolution.itemKey : "",
      missedItemOpportunity: Boolean(missingItemOpportunity),
      participants: participation.participants,
      actorCamperId: participation.actorCamperId,
      helperCamperIds: participation.helperCamperIds,
      itemOwnerId: participation.itemOwnerId,
      contributorIds: participation.contributorIds,
      decisionSource: participation.decisionSource,
      participantObservations: participation.participantObservations,
      participationText: participation.participationText,
      injuriesAdded: cloneAdventureData(consequenceResult.injuryRecords),
      injuriesTreated: cloneAdventureData(consequenceResult.treatmentRecords),
      staminaBefore: staminaBefore,
      staminaAfter: ensureAdventureProgress().stamina.value
    };
    trip.events.push(eventLog);
    trip.eventIndex = trip.events.length;
    updateAdventureStatus(eventDefinition.title, outcome.text, eventLog.effectText, true);
    updateAdventureRunHud();
    logAdventureDecision(eventDefinition, snapshot, reactionSelection, outcome, effectMessages.concat(itemNotes));
  }, 3650);
  scheduleAdventureStep(function() {
    hideAdventureBubble();
    setAdventureCamperPosition(getNextAdventurePathPoint(), true);
    if (adventurePhaseLabel) adventurePhaseLabel.textContent = "继续前进";
  }, 5050);
  scheduleAdventureStep(function() {
    playAdventureAction("idle");
    resetAdventureRouteAtmosphere();
    if (adventureRainLayer) adventureRainLayer.className = "adventure-rain-layer";
    finishAdventureEventCycle();
  }, 6500);
}

function returnAdventureBackpackToStorage(countMap) {
  Object.keys(countMap || {}).forEach(function(key) {
    changeAdventureStorageCount(key, countMap[key]);
  });
}

function chooseAdventureLogHighlight(events) {
  const rare = events.find(function(entry) { return entry.outcomeTier === "rareGood"; });
  const good = events.find(function(entry) { return entry.outcomeTier === "good"; });
  return rare || good || events[events.length - 1] || null;
}

function resolveAdventureHookResult(trip) {
  const progress = evaluateAdventureHookProgress(trip);
  const hasUnexpectedDiscovery = trip.unlocked.length > 0 || (trip.unlockedMaps || []).length > 0 || Object.keys(trip.gained).length > 0 || trip.events.some(function(entry) {
    return entry.outcomeTier === "rareGood";
  });
  if (progress.status === "noResult" && hasUnexpectedDiscovery) progress.status = "diverted";
  return progress;
}

function createAdventureStoryIntro(trip) {
  const map = getAdventureMap(trip.mapId || getDefaultAdventureMapId());
  const route = getAdventureMapRoutes(map.id)[trip.routeId];
  const presentation = getAdventureRoutePresentation(map.id, trip.routeId);
  const hook = trip.adventureHook || createFallbackAdventureHook(map.id, trip.routeId);
  const opening = presentation.opening || ("你沿着" + route.name + "进入" + map.name + "。");
  const participants = sanitizeAdventureParticipants(trip.participants, ADVENTURE_FUTURE_PARTY_MAX);
  const teamText = participants.length > 1
    ? " 这次由" + participants.map(function(participant) { return participant.displayName; }).join("、") + "一同出发。"
    : "";
  return opening + teamText + " 出发前仍挂心着“" + hook.title + "”。";
}

function createAdventureHookEnding(trip, hookResult) {
  const map = getAdventureMap(trip.mapId || getDefaultAdventureMapId());
  if (map && typeof map.createHookEnding === "function") {
    const mapEnding = map.createHookEnding(trip, hookResult);
    if (mapEnding) return mapEnding;
  }
  const hook = trip.adventureHook || createFallbackAdventureHook(trip.mapId || getDefaultAdventureMapId(), trip.routeId);
  const hookId = hook.id;
  const flags = trip.eventFlags || {};
  if (hookResult.status === "continuing") return "沿途出现了与“" + hook.title + "”有关的新痕迹，这件事还会继续留在心上。";
  if (hookResult.status === "noResult") return "这次没有找到与“" + hook.title + "”有关的确切痕迹，山里仍有许多事情没有答案。";
  if (hookResult.status === "diverted") return "没有沿着“" + hook.title + "”继续下去，不过途中出现了别的发现。";
  if (hookId === "investigateWhiteShadow") {
    if (flags.whiteShadowGuided) return "白影在浓雾中为你停下脚步，留下了一段能够再次辨认的隐蔽山路。";
    if (flags.foundMushroomRing && flags.heardNightEcho) return "菌环空缺与夜间回声少掉的那一步朝向一致，却仍不足以解释白影。";
    if (flags.supernaturalTrail) return "异常脚步与护符的回应互相印证，你确认白影并非普通雾气。";
  }
  if (hookId === "findWatchtowerClue") {
    if (flags.archivedSealedLetter) return "木屋、旧锁与封蜡信件终于连成了一条清楚的旧瞭望塔路线。";
    if (flags.answeredWatchtowerSignal && flags.restoredTrailMarker) return "修复后的路标与高处信号彼此对应，你把旧瞭望塔的位置缩小到一段明确山脊。";
    if (flags.decodedRangerNotebook) return "巡查笔记里的日期、路标编号与信号节奏互相吻合，旧瞭望塔留下了新的定位依据。";
    return "旧设施上的锁具编号彼此吻合，你整理出一份可继续追查的瞭望塔勘察记录。";
  }
  if (hookId === "findMissingRanger") {
    if (flags.completedRescue) return "你用绳组抵达受困位置并处理伤情，把护林员安全带回清楚山路。";
    if (flags.rangerTrusted) return "护林员认出木章并确认自己已经安全，同时交给你后续搜救所需的情报。";
    if (flags.foundRangerNotebook && flags.sawWatchtowerSignal) return "巡查笔记与高处信号证明有人仍在使用旧护林路线，但山谷里的回应还需继续确认。";
  }
  if (hookId === "investigateWildlife") {
    if (flags.identifiedFoodThief) return "脚印、兽径和被翻动的食物互相印证，你确认了动物在山中的活动范围。";
    if (flags.rescuedAnimal) return "你沿脚印找到废弃套索并帮助动物脱困，也标记了需要再次清理的危险兽径。";
    if (flags.befriendedAnimal) return "动物接受了你留下的食物，并在不受惊扰的距离里短暂停留。";
    return "溪边脚印与树林里的动静互相吻合，你记录下动物移动的方向和安全距离。";
  }
  if (hookId === "findSafeRoute") {
    if (flags.repairedBridge && flags.mappedFork) return "加固后的吊桥与手绘岔路接成了一条能够再次通行的安全路线。";
    if (flags.restoredTrailMarker && flags.enduredRidgeWind) return "你在山风间修正了倒伏路标，高处路线终于有了可靠方向。";
    if (flags.crossedMorningFog && flags.readWaterGauge) return "晨雾中的溪湾与旧水位记录连成一条不会被涨水截断的低地路线。";
    if (flags.whiteShadowGuided) return "白影留下的停顿位置意外组成了一条避开险路的返程路线。";
    return "岔路标记与返程方向互相印证，这段山路的轮廓变得清楚起来。";
  }
  return "沿途的细节彼此呼应，你带回了与“" + hook.title + "”有关的新发现。";
}

function applyAdventureTripMapState(trip, progress) {
  const mapId = trip.mapId || getDefaultAdventureMapId();
  const states = progress.mapStates || sanitizeAdventureMapStates(progress.mapStates);
  const map = getAdventureMap(mapId);
  const state = states[mapId] || cloneAdventureData(map.localStateDefaults || {});
  const updated = map && typeof map.applyTripLocalState === "function"
    ? map.applyTripLocalState(state, trip)
    : state;
  states[mapId] = map && typeof map.sanitizeLocalState === "function" ? map.sanitizeLocalState(updated) : updated;
  progress.mapStates = states;
}

function applyAdventureTripMemories(trip, progress) {
  const memories = sanitizeAdventureMemories(progress.adventureMemories);
  const flags = trip.eventFlags || {};
  const events = Array.isArray(trip.events) ? trip.events : [];
  if (flags.completedRescue) memories.rescuedSomeone = clampAdventureValue(memories.rescuedSomeone + 1, 0, 25);
  if (flags.supernaturalTrail || flags.sawWhiteShadow) {
    memories.supernaturalEncounters = clampAdventureValue(memories.supernaturalEncounters + 1, 0, 99);
  }
  let animalTrustDelta = 0;
  if (flags.befriendedAnimal || flags.rescuedAnimal) animalTrustDelta = 2;
  else if (flags.observedAnimal || flags.animalGivenSpace) animalTrustDelta = 1;
  if (flags.animalStartled || flags.animalFoodStolen) animalTrustDelta -= 1;
  memories.animalTrust = clampAdventureValue(memories.animalTrust + animalTrustDelta, -5, 5);
  const frighteningWhiteShadow = flags.sawWhiteShadow && ((Number(flags.whiteShadowTrust) || 0) < 0 || events.some(function(entry) {
    return entry.eventId === "whiteShadow" && ["bad", "rareBad"].indexOf(entry.outcomeTier) !== -1;
  }));
  if (frighteningWhiteShadow) {
    memories.frightenedByApparition = clampAdventureValue(memories.frightenedByApparition + 1, 0, 50);
  }
  const mapId = trip.mapId || getDefaultAdventureMapId();
  if (events.some(function(entry) {
    const eventDefinition = getAdventureEventDefinitionById(mapId, entry.eventId);
    const hasInjuryRisk = eventDefinition && Array.isArray(eventDefinition.tags) && eventDefinition.tags.indexOf("injury") !== -1;
    return entry.outcomeTier === "rareBad" && (hasInjuryRisk || ["unstableBridge", "streamSparkle", "lostBeforeDark", "morningFogPockets", "ridgeWindGust"].indexOf(entry.eventId) !== -1);
  })) {
    memories.seriousFalls = clampAdventureValue(memories.seriousFalls + 1, 0, 25);
  }
  events.forEach(function(entry) {
    const descriptor = getAdventureItemDescriptor(entry.usedItemKey);
    if (descriptor && descriptor.type === "item" && descriptor.category === "tool") {
      memories.preferredTools = memories.preferredTools.filter(function(itemId) { return itemId !== descriptor.id; });
      memories.preferredTools.push(descriptor.id);
    }
  });
  memories.preferredTools = memories.preferredTools.slice(-12);
  const map = getAdventureMap(mapId);
  const updatedMemories = map && typeof map.applyTripMemories === "function"
    ? map.applyTripMemories(memories, trip)
    : memories;
  progress.adventureMemories = sanitizeAdventureMemories(updatedMemories || memories);
}

function updateAdventureRecipeDiscoveryPity(trip, progress) {
  if (!progress.recipeDiscoveryPity) progress.recipeDiscoveryPity = sanitizeAdventureRecipeDiscoveryPity();
  (trip.eligibleRecipeIds || []).forEach(function(recipeId) {
    if (isAdventureRecipeUnlockedForDisplay(recipeId) || (trip.unlockedRecipes || []).indexOf(recipeId) !== -1) {
      progress.recipeDiscoveryPity[recipeId] = 0;
    } else {
      progress.recipeDiscoveryPity[recipeId] = clampAdventureValue((Number(progress.recipeDiscoveryPity[recipeId]) || 0) + 1, 0, 3);
    }
  });
}

function finishAdventureTrip(endReason, endLabel) {
  const trip = adventurePrototypeState.trip;
  if (!trip) return;
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  adventurePrototypeState.busy = false;
  const progress = ensureAdventureProgress();
  trip.status = endReason || "complete";
  collectAdventureHookClues(trip, progress);
  const hookResult = resolveAdventureHookResult(trip);
  applyAdventureTripMapState(trip, progress);
  applyAdventureTripMemories(trip, progress);
  returnAdventureBackpackToStorage(trip.backpack);
  returnAdventureBackpackToStorage(trip.loot);
  progress.pendingBackpack = {};
  progress.pendingLoot = {};
  progress.pendingTripSnapshot = null;
  progress.completedTrips += 1;
  progress.mapVisitCounts = sanitizeAdventureMapVisitCounts(progress.mapVisitCounts);
  const completedMapId = trip.mapId || getDefaultAdventureMapId();
  progress.mapVisitCounts[completedMapId] = Math.max(0, Math.floor(Number(progress.mapVisitCounts[completedMapId]) || 0)) + 1;
  updateAdventureRecipeDiscoveryPity(trip, progress);
  refreshAdventureMapUnlocks(progress, trip);
  const highlight = chooseAdventureLogHighlight(trip.events);
  const log = {
    id: (trip.mapId || getDefaultAdventureMapId()) + "-" + Date.now(),
    createdAt: Date.now(),
    mapId: trip.mapId || getDefaultAdventureMapId(),
    locationId: trip.mapId || getDefaultAdventureMapId(),
    adventureHook: trip.adventureHook,
    routeId: trip.routeId,
    hookResult: hookResult.status,
    hookScore: hookResult.score,
    storyIntro: createAdventureStoryIntro(trip),
    storyBeats: trip.storyBeats.slice(),
    storyEnding: createAdventureHookEnding(trip, hookResult),
    participants: cloneAdventureData(trip.participants || []),
    participantHighlights: buildAdventureParticipantHighlights(trip),
    rewardNotes: [],
    events: trip.events.slice(),
    departedWith: cloneAdventureCountMap(trip.departedWith),
    gained: cloneAdventureCountMap(trip.gained),
    gainedIngredients: cloneAdventureCountMap(trip.gainedIngredients),
    lost: cloneAdventureCountMap(trip.lost),
    consumed: cloneAdventureCountMap(trip.consumed),
    unlocked: trip.unlocked.slice(),
    unlockedMaps: (trip.unlockedMaps || []).slice(),
    unlockedRecipes: (trip.unlockedRecipes || []).slice(),
    keyCluesFound: (trip.keyCluesFound || []).slice(),
    importantDiscoveries: cloneAdventureData(trip.importantDiscoveries || []),
    injuries: trip.events.reduce(function(records, event) { return records.concat(event.injuriesAdded || []); }, []),
    treatments: trip.events.reduce(function(records, event) { return records.concat(event.injuriesTreated || []); }, []),
    newHookClues: cloneAdventureData(trip.newHookClues || []),
    hookClueProgress: cloneAdventureData(trip.hookClueProgress || null),
    staminaStart: trip.staminaStart,
    staminaEnd: progress.stamina.value,
    endReason: endReason,
    endLabel: endLabel,
    highlightEventId: highlight ? highlight.eventId : ""
  };
  progress.lastLog = log;
  progress.journeyLogs.push(cloneAdventureData(log));
  progress.recentAdventureHistory.push({
    mapId: trip.mapId || getDefaultAdventureMapId(),
    hookId: trip.adventureHook.id,
    routeId: trip.routeId,
    eventIds: trip.events.map(function(entry) { return entry.eventId; }),
    outcomeType: hookResult.status,
    createdAt: log.createdAt
  });
  progress.recentAdventureHistory = progress.recentAdventureHistory.slice(-8);
  adventurePrototypeState.trip = null;
  adventurePrototypeState.draftAdventureHook = null;
  saveGame();
  renderMainAdventureStorage();
  renderAdventureLog(log);
  setAdventureMode("log");
  if (logHasRouteMapDiscovery(log)) {
    openAdventureRouteMapReveal(true);
  }
}

function formatAdventureLedger(countMap, emptyText) {
  const entries = getAdventureBackpackDisplayEntries(countMap);
  return entries.length ? entries.map(function(entry) { return formatAdventureEffectItem(entry.key, entry.count); }).join("、") : emptyText;
}

function formatAdventureIngredientLedger(countMap, emptyText) {
  const entries = Object.keys(countMap || {}).filter(function(ingredientId) {
    return Number(countMap[ingredientId]) > 0;
  }).map(function(ingredientId) {
    const count = Math.max(0, Math.floor(Number(countMap[ingredientId]) || 0));
    return getAdventureIngredientName(ingredientId) + (count > 1 ? " ×" + count : "");
  });
  return entries.length ? entries.join("、") : emptyText;
}

function formatAdventureRecipeLedger(recipeIds, emptyText) {
  const entries = Array.from(new Set(Array.isArray(recipeIds) ? recipeIds : [])).map(getAdventureRecipeName);
  return entries.length ? entries.join("、") : emptyText;
}

function logHasRouteMapDiscovery(log) {
  return (Array.isArray(log && log.importantDiscoveries) ? log.importantDiscoveries : []).some(function(entry) {
    return entry.id === "dampSurveyRouteMap";
  });
}

function progressHasRouteMapDiscovery() {
  const progress = ensureAdventureProgress();
  const routeMapId = typeof ADVENTURE_ROUTE_MAP_KEY_CLUE_ID === "string" ? ADVENTURE_ROUTE_MAP_KEY_CLUE_ID : "dampSurveyRouteMap";
  return (Array.isArray(progress.keyClues) && progress.keyClues.indexOf(routeMapId) !== -1) ||
    getAdventureStoryState(progress, ADVENTURE_ROUTE_MAP_STORY_ID).status === "archived";
}

function openAdventureKeyItem(keyItemId, options) {
  const normalizedId = keyItemId === "dampSurveyRouteMap" ? "dampRouteMap" : keyItemId;
  const progress = ensureAdventureProgress();
  if (normalizedId !== "dampRouteMap" || !progressHasRouteMapDiscovery() || !adventureRouteMapLayer) return false;
  const showMapAction = !options || options.showMapAction !== false;
  adventureRouteMapLayer.classList.remove("hidden");
  adventureRouteMapLayer.setAttribute("aria-hidden", "false");
  adventureRouteMapLayer.classList.toggle("can-open-map", Boolean(showMapAction));
  document.body.classList.add("adventure-route-map-open");
  if (progress.revealedKeyItems.indexOf(normalizedId) === -1) progress.revealedKeyItems.push(normalizedId);
  if (progress.pendingKeyItemReveal === normalizedId) progress.pendingKeyItemReveal = "";
  saveGame();
  return true;
}

function openAdventureRouteMapReveal(showMapAction) {
  return openAdventureKeyItem("dampRouteMap", { showMapAction: showMapAction !== false });
}

function closeAdventureRouteMapReveal() {
  if (!adventureRouteMapLayer) return;
  adventureRouteMapLayer.classList.add("hidden");
  adventureRouteMapLayer.setAttribute("aria-hidden", "true");
  adventureRouteMapLayer.classList.remove("can-open-map");
  document.body.classList.remove("adventure-route-map-open");
}

function getAdventureStoryUnlockLabels(story) {
  const labels = [];
  (story.unlocks || []).forEach(function(unlock) {
    if (unlock.type === "recipe") labels.push("菜谱：" + getAdventureRecipeName(unlock.recipeId));
    if (unlock.type === "map") labels.push("地图：" + (getAdventureMapRegistry()[unlock.mapId] ? getAdventureMapRegistry()[unlock.mapId].name : unlock.mapId));
    if (unlock.type === "keyItem") labels.push("关键物品：受潮的调查路线图");
    if (unlock.type === "gear" && getGearItem(unlock.gearId)) labels.push("Gear：" + getGearItem(unlock.gearId).displayName);
  });
  if (story.reward && story.reward.type === "unlock") {
    const location = getAdventureMapLocations(story.mapId)[story.reward.locationId];
    if (location) labels.push("路线：" + location.name);
  }
  if (story.reward && story.reward.type === "item" && ADVENTURE_ITEM_CATALOG[story.reward.itemId]) {
    labels.push("物品：" + ADVENTURE_ITEM_CATALOG[story.reward.itemId].name);
  }
  return labels;
}

function grantAdventureStoryGear(gearId) {
  const item = getGearItem(gearId);
  if (!item || !gameState || !Array.isArray(gameState.ownedGear)) return false;
  const alreadyOwned = ownsGear(gearId);
  addUniqueGear(gameState.ownedGear, gearId);
  return !alreadyOwned && ownsGear(gearId);
}

function applyAdventureStoryArchiveUnlocks(progress, story) {
  const labels = [];
  const mockTrip = { mapId: story.mapId, unlocked: [], unlockedMaps: [] };
  (story.unlocks || []).forEach(function(unlock) {
    if (unlock.type === "recipe" && unlockAdventureCookingRecipe(unlock.recipeId)) {
      labels.push("菜谱：" + getAdventureRecipeName(unlock.recipeId));
    } else if (unlock.type === "map" && unlockAdventureMap(progress, mockTrip, unlock.mapId, [], [])) {
      labels.push("地图：" + getAdventureMap(unlock.mapId).name);
    } else if (unlock.type === "keyItem" && unlock.keyItemId === "dampRouteMap") {
      const routeMapId = typeof ADVENTURE_ROUTE_MAP_KEY_CLUE_ID === "string" ? ADVENTURE_ROUTE_MAP_KEY_CLUE_ID : "dampSurveyRouteMap";
      if (progress.keyClues.indexOf(routeMapId) === -1) progress.keyClues.push(routeMapId);
      labels.push("关键物品：受潮的调查路线图");
    } else if (unlock.type === "gear" && grantAdventureStoryGear(unlock.gearId)) {
      labels.push("Gear：" + getGearItem(unlock.gearId).displayName);
    }
  });
  const reward = story.reward;
  if (reward && reward.type === "unlock") {
    const notes = [];
    if (unlockAdventureLocation(progress, mockTrip, reward.locationId, [], notes, story.mapId)) {
      const location = getAdventureMapLocations(story.mapId)[reward.locationId];
      labels.push("路线：" + (location ? location.name : reward.locationId));
    }
  } else if (reward && reward.type === "item" && ADVENTURE_ITEM_CATALOG[reward.itemId]) {
    const rule = getAdventureItemRule(reward.itemId);
    const before = Math.max(0, Number(progress.storage[reward.itemId]) || 0);
    progress.storage[reward.itemId] = Math.min(rule.maxOwned, before + Math.max(1, Number(reward.quantity) || 1));
    if (progress.storage[reward.itemId] > before) labels.push("物品：" + ADVENTURE_ITEM_CATALOG[reward.itemId].name);
  } else if (reward && reward.type === "clue" && reward.clueId) {
    if (progress.discoveredClues.indexOf(reward.clueId) === -1) progress.discoveredClues.push(reward.clueId);
    labels.push("记录：" + (reward.label || reward.clueId));
  }
  return Array.from(new Set(labels));
}

function addRouteMapDiscoveryToLatestLog(progress) {
  const discovery = { id: "dampSurveyRouteMap", title: "受潮的调查路线图", lines: getAdventureRouteMapSummaryLines() };
  const append = function(log) {
    if (!log) return;
    if (!Array.isArray(log.importantDiscoveries)) log.importantDiscoveries = [];
    if (!log.importantDiscoveries.some(function(entry) { return entry.id === discovery.id; })) log.importantDiscoveries.push(cloneAdventureData(discovery));
    if (!Array.isArray(log.keyCluesFound)) log.keyCluesFound = [];
    if (log.keyCluesFound.indexOf("dampSurveyRouteMap") === -1) log.keyCluesFound.push("dampSurveyRouteMap");
    if (!Array.isArray(log.unlockedMaps)) log.unlockedMaps = [];
    if (log.unlockedMaps.indexOf("fogRainforest") === -1) log.unlockedMaps.push("fogRainforest");
  };
  append(progress.lastLog);
  if (progress.lastLog) {
    const archivedLog = progress.journeyLogs.find(function(log) { return log.id === progress.lastLog.id; });
    append(archivedLog);
  }
}

function archiveAdventureStory(storyId, clueOrder) {
  const progress = ensureAdventureProgress();
  const story = getAdventureStoryDefinition(storyId);
  const state = getAdventureStoryState(progress, storyId);
  if (!story || state.status !== "ready") return false;
  const correctOrder = getAdventureStoryCorrectOrder(story);
  if (!isAdventureStoryOrderCorrect(story, clueOrder)) return false;
  const unlockLabels = applyAdventureStoryArchiveUnlocks(progress, story);
  progress.storyStates[storyId] = {
    status: "archived",
    completedAt: Date.now(),
    clueOrder: correctOrder,
    storyText: story.archiveStory,
    unlockLabels: unlockLabels
  };
  const gearRewards = unlockLabels.filter(function(label) { return label.indexOf("Gear：") === 0; });
  if (gearRewards.length) {
    setStatus("获得 " + gearRewards.join("、") + "，已放入营地 Gear，可在 Build Mode 中摆放。");
    showCamperThought(gearRewards.map(function(label) { return label.replace("Gear：", ""); }).join("、") + "已经带回营地了。");
    if (typeof renderShopFromCatalog === "function") {
      renderShopFromCatalog();
      if (typeof setShopFilter === "function") setShopFilter(typeof activeShopFilter === "string" ? activeShopFilter : "all");
    }
  }
  if (storyId === ADVENTURE_ROUTE_MAP_STORY_ID) {
    addRouteMapDiscoveryToLatestLog(progress);
    progress.pendingKeyItemReveal = "dampRouteMap";
  }
  saveGame();
  renderMainAdventureStorage();
  if (adventurePrototypeState.mode === "log" && progress.lastLog) renderAdventureLog(progress.lastLog);
  if (adventurePrototypeState.mode === "journal") renderAdventureJournal();
  if (adventurePrototypeState.mode === "center") renderAdventureCenter();
  if (storyId === ADVENTURE_ROUTE_MAP_STORY_ID) {
    window.setTimeout(function() { openAdventureKeyItem("dampRouteMap"); }, 0);
  }
  return true;
}

function getInitialAdventureStorySortOrder(story) {
  const ids = getAdventureStoryCorrectOrder(story);
  return ids.length > 1 ? ids.slice(1).concat(ids[0]) : ids;
}

function getAdventureStorySorterOrder(story) {
  if (!story) return [];
  return adventurePrototypeState.storySortSelected.length === story.clues.length
    ? adventurePrototypeState.storySortSelected.slice()
    : adventurePrototypeState.storySortOrder.slice();
}

function ensureAdventureStoryFirstCluePinned(story) {
  const firstClueId = getAdventureStoryCorrectOrder(story)[0];
  if (!firstClueId) return;
  adventurePrototypeState.storySortPinnedClueId = firstClueId;
  adventurePrototypeState.storySortOrder = [firstClueId].concat(adventurePrototypeState.storySortOrder.filter(function(clueId) {
    return clueId !== firstClueId;
  }));
  if (adventurePrototypeState.storySortSelected[0] !== firstClueId) {
    adventurePrototypeState.storySortSelected = [firstClueId];
  }
}

function moveAdventureStoryClue(story, draggedId, targetId) {
  if (!story || adventurePrototypeState.storySortSolved || !draggedId || !targetId || draggedId === targetId) return false;
  if (draggedId === adventurePrototypeState.storySortPinnedClueId || targetId === adventurePrototypeState.storySortPinnedClueId) return false;
  const from = adventurePrototypeState.storySortOrder.indexOf(draggedId);
  const to = adventurePrototypeState.storySortOrder.indexOf(targetId);
  if (from === -1 || to === -1) return false;
  adventurePrototypeState.storySortOrder.splice(from, 1);
  adventurePrototypeState.storySortOrder.splice(to, 0, draggedId);
  adventurePrototypeState.storySortSelected = adventurePrototypeState.storySortPinnedClueId ? [adventurePrototypeState.storySortPinnedClueId] : [];
  return true;
}

function renderAdventureClueSortSlots(story) {
  if (!adventureClueSortSlots) return;
  const selected = adventurePrototypeState.storySortSelected;
  const displayOrder = selected.length ? selected : adventurePrototypeState.storySortOrder;
  adventureClueSortSlots.innerHTML = "";
  story.clues.forEach(function(clue, index) {
    const slot = document.createElement("div");
    const label = document.createElement("strong");
    const assigned = document.createElement("span");
    const assignedClue = story.clues.find(function(entry) { return entry.id === displayOrder[index]; });
    slot.className = "adventure-clue-sort-slot";
    slot.classList.toggle("is-empty", !assignedClue);
    slot.classList.toggle("is-pinned", Boolean(assignedClue && assignedClue.id === adventurePrototypeState.storySortPinnedClueId));
    label.textContent = story.positionLabels[index] || getAdventureStoryPositionLabel(story.sortingRule, index, story.clues.length);
    assigned.textContent = assignedClue ? assignedClue.title : "待选择";
    slot.appendChild(label);
    slot.appendChild(assigned);
    adventureClueSortSlots.appendChild(slot);
  });
}

function renderAdventureClueSortFeedback(story) {
  const hintLevel = Math.max(adventurePrototypeState.storySortAttempts, adventurePrototypeState.storySortHintLevel);
  if (adventureClueSortHint) {
    adventureClueSortHint.classList.toggle("hidden", hintLevel < 1 || adventurePrototypeState.storySortSolved);
    adventureClueSortHint.textContent = hintLevel > 0 && !adventurePrototypeState.storySortSolved
      ? "提示：" + getAdventureStoryProgressiveHint(story, hintLevel)
      : "";
  }
  if (adventureClueSortCompletion) {
    adventureClueSortCompletion.innerHTML = "";
    adventureClueSortCompletion.classList.toggle("hidden", !adventurePrototypeState.storySortSolved);
    if (adventurePrototypeState.storySortSolved) {
      const title = document.createElement("strong");
      const explanation = document.createElement("p");
      title.textContent = "顺序为什么成立";
      explanation.textContent = story.completionExplanation;
      adventureClueSortCompletion.appendChild(title);
      adventureClueSortCompletion.appendChild(explanation);
    }
  }
  if (adventureClueSortHintButton) {
    const maxHints = Math.max(3, story.failureHints.length);
    adventureClueSortHintButton.disabled = adventurePrototypeState.storySortSolved || adventurePrototypeState.storySortHintLevel >= maxHints;
    adventureClueSortHintButton.textContent = adventurePrototypeState.storySortHintLevel >= maxHints ? "提示已给出" : "获得一点提示";
  }
  if (adventureClueSortResetButton) adventureClueSortResetButton.disabled = adventurePrototypeState.storySortSolved;
  if (adventureClueSortConfirmButton) adventureClueSortConfirmButton.textContent = adventurePrototypeState.storySortSolved ? "归档并领取" : "确认整理";
}

function renderAdventureClueSorter() {
  const story = getAdventureStoryDefinition(adventurePrototypeState.activeStorySortId);
  if (!story || !adventureClueSortList) return;
  renderAdventureClueSortSlots(story);
  adventureClueSortList.innerHTML = "";
  adventurePrototypeState.storySortOrder.forEach(function(clueId) {
    const clue = story.clues.find(function(entry) { return entry.id === clueId; });
    if (!clue) return;
    const card = document.createElement("button");
    const number = document.createElement("span");
    const copy = document.createElement("span");
    const clueTitle = document.createElement("strong");
    const clueText = document.createElement("span");
    const relation = document.createElement("small");
    const selectedIndex = adventurePrototypeState.storySortSelected.indexOf(clueId);
    const isPinned = clueId === adventurePrototypeState.storySortPinnedClueId;
    card.type = "button";
    card.className = "adventure-clue-sort-card";
    card.draggable = !adventurePrototypeState.storySortSolved && !isPinned;
    card.disabled = adventurePrototypeState.storySortSolved;
    card.dataset.clueId = clueId;
    card.classList.toggle("is-numbered", selectedIndex !== -1);
    card.classList.toggle("is-pinned", isPinned);
    number.className = "adventure-clue-order-number";
    number.textContent = selectedIndex === -1 ? "↕" : (ADVENTURE_STORY_ORDER_SYMBOLS[selectedIndex] || String(selectedIndex + 1));
    number.title = isPinned ? "提示已固定此位置" : "按住拖动";
    copy.className = "adventure-clue-sort-copy";
    clueTitle.textContent = clue.title;
    clueText.textContent = clue.text;
    relation.textContent = "关系提示：" + clue.relationHint;
    copy.appendChild(clueTitle);
    copy.appendChild(clueText);
    copy.appendChild(relation);
    card.appendChild(number);
    card.appendChild(copy);
    card.addEventListener("click", function() {
      if (adventurePrototypeState.storySortSolved || isPinned || adventurePrototypeState.storySortSuppressClick) {
        adventurePrototypeState.storySortSuppressClick = false;
        return;
      }
      const index = adventurePrototypeState.storySortSelected.indexOf(clueId);
      if (index === -1) adventurePrototypeState.storySortSelected.push(clueId);
      else adventurePrototypeState.storySortSelected.splice(index, 1);
      renderAdventureClueSorter();
    });
    card.addEventListener("dragstart", function(event) {
      adventurePrototypeState.draggedStoryClueId = clueId;
      if (event.dataTransfer) event.dataTransfer.setData("text/plain", clueId);
    });
    card.addEventListener("dragend", function() { adventurePrototypeState.draggedStoryClueId = ""; });
    card.addEventListener("dragover", function(event) { event.preventDefault(); });
    card.addEventListener("drop", function(event) {
      event.preventDefault();
      const draggedId = adventurePrototypeState.draggedStoryClueId || (event.dataTransfer && event.dataTransfer.getData("text/plain"));
      if (moveAdventureStoryClue(story, draggedId, clueId)) renderAdventureClueSorter();
    });
    number.addEventListener("pointerdown", function(event) {
      if (adventurePrototypeState.storySortSolved || isPinned) return;
      adventurePrototypeState.storySortPointerClueId = clueId;
      adventurePrototypeState.storySortPointerStartX = event.clientX;
      adventurePrototypeState.storySortPointerStartY = event.clientY;
      adventurePrototypeState.storySortPointerMoved = false;
    });
    adventureClueSortList.appendChild(card);
  });
  renderAdventureClueSortFeedback(story);
}

function openAdventureClueSorter(storyId) {
  const progress = ensureAdventureProgress();
  const story = getAdventureStoryDefinition(storyId);
  if (!story || getAdventureStoryState(progress, storyId).status !== "ready" || !adventureClueSortLayer) return false;
  adventurePrototypeState.activeStorySortId = storyId;
  adventurePrototypeState.storySortOrder = getInitialAdventureStorySortOrder(story);
  adventurePrototypeState.storySortSelected = [];
  adventurePrototypeState.storySortAttempts = 0;
  adventurePrototypeState.storySortHintLevel = 0;
  adventurePrototypeState.storySortPinnedClueId = "";
  adventurePrototypeState.storySortSolved = false;
  if (adventureClueSortTitle) adventureClueSortTitle.textContent = "整理线索 · " + story.title;
  if (adventureClueSortRule) adventureClueSortRule.textContent = "排序规则：" + story.sortingRule;
  if (adventureClueSortInstruction) adventureClueSortInstruction.textContent = story.instruction;
  if (adventureClueSortMessage) adventureClueSortMessage.textContent = "";
  renderAdventureClueSorter();
  adventureClueSortLayer.classList.remove("hidden");
  adventureClueSortLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("adventure-clue-sort-open");
  return true;
}

function closeAdventureClueSorter() {
  if (!adventureClueSortLayer) return;
  adventureClueSortLayer.classList.add("hidden");
  adventureClueSortLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("adventure-clue-sort-open");
  adventurePrototypeState.activeStorySortId = "";
  adventurePrototypeState.storySortOrder = [];
  adventurePrototypeState.storySortSelected = [];
  adventurePrototypeState.storySortAttempts = 0;
  adventurePrototypeState.storySortHintLevel = 0;
  adventurePrototypeState.storySortPinnedClueId = "";
  adventurePrototypeState.storySortSolved = false;
  adventurePrototypeState.storySortPointerClueId = "";
  adventurePrototypeState.storySortSuppressClick = false;
  adventurePrototypeState.draggedStoryClueId = "";
}

function renderAdventureLogProgressBlock(log, hook) {
  if (!adventureLogProgressBlock) return;
  const progress = ensureAdventureProgress();
  const hookStoryId = (log.mapId || getDefaultAdventureMapId()) + ":" + hook.id;
  const hookStoryState = getAdventureStoryState(progress, hookStoryId);
  const clueProgress = log.hookClueProgress || { found: 0, total: 0, remaining: 0, complete: false, discovered: false };
  const hasNewClues = Array.isArray(log.newHookClues) && log.newHookClues.length > 0;
  adventureLogProgressBlock.innerHTML = "";
  adventureLogProgressBlock.classList.toggle("has-important-discovery", Boolean(log.importantDiscoveries && log.importantDiscoveries.length));
  (log.importantDiscoveries || []).forEach(function(discovery) {
    const section = document.createElement("section");
    const title = document.createElement("strong");
    const body = document.createElement("p");
    section.className = "adventure-important-discovery";
    title.textContent = "重要发现：" + discovery.title;
    body.textContent = discovery.lines && discovery.lines.length ? discovery.lines.join(" / ") : "新的路线信息已经归档。";
    section.appendChild(title);
    section.appendChild(body);
    adventureLogProgressBlock.appendChild(section);
  });
  if (hasNewClues) {
    const section = document.createElement("section");
    const title = document.createElement("strong");
    const list = document.createElement("div");
    section.className = "adventure-new-clues";
    title.textContent = "发现新线索：";
    list.className = "adventure-new-clue-list";
    log.newHookClues.forEach(function(clue) {
      const clueLine = document.createElement("span");
      clueLine.textContent = clue.label;
      list.appendChild(clueLine);
    });
    section.appendChild(title);
    section.appendChild(list);
    adventureLogProgressBlock.appendChild(section);
  }
  const progressLine = document.createElement("section");
  const title = document.createElement("strong");
  const remain = document.createElement("p");
  progressLine.className = "adventure-hook-progress-summary";
  if (clueProgress.total && clueProgress.discovered) {
    title.textContent = hook.title + (hookStoryState.status === "archived" ? " · 已查清" : "") + "：" + clueProgress.found + " / " + clueProgress.total;
    remain.textContent = hookStoryState.status === "archived"
      ? "故事已整理归档。"
      : (clueProgress.complete ? "线索已收齐，等待整理。" : "还剩 " + clueProgress.remaining + " 条");
  } else {
    title.textContent = hook.title + "：尚未发现";
    remain.textContent = "当前还没有确认的新线索。";
  }
  progressLine.appendChild(title);
  progressLine.appendChild(remain);
  if (hookStoryState.status === "ready") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "adventure-mini-control";
    button.textContent = "整理线索";
    button.addEventListener("click", function() { openAdventureClueSorter(hookStoryId); });
    progressLine.appendChild(button);
  }
  adventureLogProgressBlock.appendChild(progressLine);
  const routeMapStoryState = getAdventureStoryState(progress, ADVENTURE_ROUTE_MAP_STORY_ID);
  if (routeMapStoryState.status === "ready") {
    const routeMapSection = document.createElement("section");
    const routeMapTitle = document.createElement("strong");
    const routeMapBody = document.createElement("p");
    const routeMapButton = document.createElement("button");
    routeMapSection.className = "adventure-important-discovery";
    routeMapTitle.textContent = "受潮的调查路线图：3 / 3";
    routeMapBody.textContent = "三条关键记录已经收齐，等待整理。";
    routeMapButton.type = "button";
    routeMapButton.className = "adventure-mini-control";
    routeMapButton.textContent = "整理线索";
    routeMapButton.addEventListener("click", function() { openAdventureClueSorter(ADVENTURE_ROUTE_MAP_STORY_ID); });
    routeMapSection.appendChild(routeMapTitle);
    routeMapSection.appendChild(routeMapBody);
    routeMapSection.appendChild(routeMapButton);
    adventureLogProgressBlock.appendChild(routeMapSection);
  }
}

function renderAdventureLog(logSource) {
  const log = sanitizeAdventureLog(logSource) || sanitizeAdventureLog(ensureAdventureProgress().lastLog);
  if (!log) return;
  const map = getAdventureMap(log.mapId || log.locationId);
  const locations = getAdventureMapLocations(map.id);
  const location = locations[log.locationId] || locations[map.id];
  const routes = getAdventureMapRoutes(map.id);
  const route = routes[log.routeId] || routes[getAdventureMapDefaultRouteId(map.id)];
  const presentation = getAdventureRoutePresentation(map.id, route.id);
  const hook = log.adventureHook || createFallbackAdventureHook(map.id, route.id);
  const hookResultLabels = { found: "有所发现", continuing: "线索继续", noResult: "暂无结果", diverted: "意外偏离" };
  const highlight = log.events.find(function(entry) { return entry.eventId === log.highlightEventId; }) || log.events[log.events.length - 1];
  const highlightDefinition = highlight && getAdventureEventDefinitionById(map.id, highlight.eventId);
  if (adventureLogStatus) adventureLogStatus.textContent = log.endLabel;
  if (adventureLogLocation) adventureLogLocation.textContent = route.name;
  if (adventureLogEventCount) adventureLogEventCount.textContent = log.events.length + " / " + ADVENTURE_MAX_EVENTS_PER_TRIP;
  if (adventureLogStamina) {
    const delta = log.staminaEnd - log.staminaStart;
    adventureLogStamina.textContent = log.staminaStart + " → " + log.staminaEnd + " (" + (delta > 0 ? "+" : "") + delta + ")";
  }
  if (adventureLogEndReason) adventureLogEndReason.textContent = log.endLabel;
  if (adventureLogHookStatus) {
    adventureLogHookStatus.textContent = "这次挂心的事：" + hook.title + " · " + hookResultLabels[log.hookResult];
    adventureLogHookStatus.className = "adventure-hook-status is-" + log.hookResult;
  }
  applyAdventureRoutePresentation(map.id, route.id);
  if (adventureLogStoryTitle) adventureLogStoryTitle.textContent = (presentation.journalTitle ? presentation.journalTitle + " · " : "") + hook.title;
  if (adventureLogStoryIntro) adventureLogStoryIntro.textContent = log.storyIntro || ("你沿着" + route.name + "进入" + location.name + "。");
  renderAdventureLogProgressBlock(log, hook);
  if (adventureLogStoryBody) {
    adventureLogStoryBody.innerHTML = "";
    (log.storyBeats || []).forEach(function(beatText) {
      const paragraph = document.createElement("p");
      paragraph.textContent = beatText;
      adventureLogStoryBody.appendChild(paragraph);
    });
    if ((log.participants || []).length > 1 && (log.participantHighlights || []).length) {
      const teamSummary = document.createElement("p");
      teamSummary.textContent = "队伍记录：" + log.participantHighlights.map(function(entry) { return entry.text; }).join(" ");
      adventureLogStoryBody.appendChild(teamSummary);
    }
  }
  if (adventureLogStoryEnding) {
    adventureLogStoryEnding.textContent = (log.storyEnding || "这次的经历仍会留在之后的山路上。") +
      (log.rewardNotes.length ? " " + log.rewardNotes.join(" ") : "");
  }
  if (adventureLogIllustrationCaption) {
    const highlightText = highlight ? highlight.title + " · " + highlight.reactionType : "沿途没有停留太久";
    adventureLogIllustrationCaption.textContent = (presentation.journalCaption ? presentation.journalCaption + " · " : "") + highlightText;
  }
  if (adventureLogIllustrationProp) {
    const propClass = highlightDefinition ? highlightDefinition.prop.className : "prop-sign";
    const propSheetPositions = getAdventureMapPropSheetPositions(map.id);
    const position = propSheetPositions[propClass] || propSheetPositions["prop-sign"];
    adventureLogIllustrationProp.className = "adventure-log-illustration-prop " + propClass;
    adventureLogIllustrationProp.style.setProperty("--prop-position-x", position[0]);
    adventureLogIllustrationProp.style.setProperty("--prop-position-y", position[1]);
  }
  if (adventureLogIllustration) {
    adventureLogIllustration.style.backgroundPosition = presentation.journalPosition || (highlightDefinition && highlightDefinition.atmosphere ? "center 34%" : "center 48%");
  }
  if (adventureLogEventList) {
    adventureLogEventList.innerHTML = "";
    log.events.forEach(function(entry, index) {
      const row = document.createElement("article");
      const number = document.createElement("span");
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      const reaction = document.createElement("span");
      const result = document.createElement("small");
      const notes = document.createElement("div");
      row.className = "adventure-log-event-entry";
      number.className = "adventure-log-event-number";
      number.textContent = String(index + 1);
      copy.className = "adventure-log-event-copy";
      title.textContent = entry.title;
      reaction.textContent = entry.reactionType + (entry.bubble ? " · “" + entry.bubble + "”" : "");
      result.textContent = entry.result + (entry.effectText ? " · " + entry.effectText : "");
      notes.className = "adventure-log-item-notes";
      (entry.itemNotes || []).forEach(function(noteText) {
        const note = document.createElement("em");
        note.textContent = noteText;
        notes.appendChild(note);
      });
      if (entry.participationText) {
        const participationNote = document.createElement("em");
        participationNote.textContent = entry.participationText;
        notes.appendChild(participationNote);
      }
      (entry.participantObservations || []).forEach(function(observation) {
        const observationNote = document.createElement("em");
        observationNote.textContent = observation.text;
        notes.appendChild(observationNote);
      });
      copy.appendChild(title);
      copy.appendChild(reaction);
      copy.appendChild(result);
      if (notes.childElementCount) copy.appendChild(notes);
      row.appendChild(number);
      row.appendChild(copy);
      adventureLogEventList.appendChild(row);
    });
    if (!log.events.length) {
      const empty = document.createElement("p");
      empty.className = "adventure-empty-list";
      empty.textContent = "这次在遇到事件前就返回了营地。";
      adventureLogEventList.appendChild(empty);
    }
  }
  if (adventureLogDeparted) adventureLogDeparted.textContent = formatAdventureLedger(log.departedWith, "空背包出发");
  if (adventureLogGained) {
    const gainedItems = formatAdventureLedger(log.gained, "");
    const gainedIngredients = formatAdventureIngredientLedger(log.gainedIngredients, "");
    const recipes = formatAdventureRecipeLedger(log.unlockedRecipes, "");
    adventureLogGained.textContent = [gainedItems, gainedIngredients, recipes ? "菜谱：" + recipes : ""].filter(Boolean).join("、") || "没有新物品";
  }
  if (adventureLogLost) adventureLogLost.textContent = formatAdventureLedger(log.lost, "没有丢失物品");
  if (adventureLogConsumed) adventureLogConsumed.textContent = formatAdventureLedger(log.consumed, "没有消耗物品");
  if (adventureLogUnlocked) {
    const routeLabels = log.unlocked.map(function(id) { return locations[id].name; });
    const mapLabels = (log.unlockedMaps || []).map(function(id) { return getAdventureMap(id).name; });
    adventureLogUnlocked.textContent = routeLabels.concat(mapLabels).join("、") || "没有新路线或地图";
  }
  if (adventureLogRouteMapButton) {
    adventureLogRouteMapButton.classList.toggle("hidden", !progressHasRouteMapDiscovery());
  }
}

function recoverInterruptedAdventureBackpack() {
  const progress = ensureAdventureProgress();
  const snapshot = progress.pendingTripSnapshot ? cloneAdventureData(progress.pendingTripSnapshot) : null;
  if (adventurePrototypeState.trip || (!snapshot && getAdventureCountTotal(progress.pendingBackpack) + getAdventureCountTotal(progress.pendingLoot) <= 0)) return null;
  returnAdventureBackpackToStorage(progress.pendingBackpack);
  returnAdventureBackpackToStorage(progress.pendingLoot);
  progress.pendingBackpack = {};
  progress.pendingLoot = {};
  progress.pendingTripSnapshot = null;
  adventurePrototypeState.recoveredTripSnapshot = snapshot;
  saveGame();
  return snapshot || { mapId: getDefaultAdventureMapId(), routeId: getAdventureMapDefaultRouteId(getDefaultAdventureMapId()), adventureHook: null };
}

function startAdventureTrip() {
  const progress = ensureAdventureProgress();
  const mapId = adventurePrototypeState.draftMapId || getDefaultAdventureMapId();
  const map = getAdventureMap(mapId);
  const route = getAdventureMapRoutes(map.id)[adventurePrototypeState.draftRouteId];
  if (!route || !isAdventureRouteUnlocked(map.id, route, progress)) {
    setAdventurePrepMessage("请先选择一条已解锁路线。", true);
    renderAdventurePreparation();
    return;
  }
  const tripStaminaCost = ADVENTURE_STAMINA_TRIP_COST + route.staminaCost;
  if (progress.stamina.value < tripStaminaCost) {
    setAdventurePrepMessage("体力不足，需要至少 " + tripStaminaCost + " 点才能从这条路线出发。", true);
    renderAdventurePreparation();
    return;
  }
  const selected = sanitizeAdventureBackpackMap(adventurePrototypeState.draftBackpack);
  if (getAdventureCountTotal(selected) > ADVENTURE_BACKPACK_CAPACITY) {
    setAdventurePrepMessage("背包超过容量，请减少携带物。", true);
    return;
  }
  const valid = Object.keys(selected).every(function(key) { return selected[key] <= getAdventureStorageCount(key); });
  if (!valid) {
    setAdventurePrepMessage("Storage 内容已经变化，请重新选择。", true);
    renderAdventurePreparation();
    return;
  }
  Object.keys(selected).forEach(function(key) { changeAdventureStorageCount(key, -selected[key]); });
  const staminaStart = progress.stamina.value;
  progress.stamina.value -= tripStaminaCost;
  progress.stamina.updatedAt = Date.now();
  progress.pendingBackpack = cloneAdventureCountMap(selected);
  progress.pendingLoot = {};
  const adventureHook = cloneAdventureData(ensureDraftAdventureHook(false));
  const snapshot = getAdventureProfileSnapshot();
  const eligibleRecipeIds = getEligibleAdventureExplorationRecipes(map.id, route.id).filter(function(recipeId) {
    return !isAdventureRecipeUnlockedForDisplay(recipeId);
  });
  adventurePrototypeState.trip = {
    startedAt: Date.now(),
    mapId: map.id,
    staminaStart: staminaStart,
    staminaEventDelta: 0,
    adventureHook: adventureHook,
    routeId: route.id,
    participants: createSoloAdventureParticipants(snapshot, selected, progress.adventureMemories),
    mapStateSnapshot: cloneAdventureData(progress.mapStates[map.id] || map.localStateDefaults || {}),
    adventureMemorySnapshot: cloneAdventureData(progress.adventureMemories || createDefaultAdventureMemories()),
    eventFlags: {},
    hookProgress: { score: 0, status: "noResult" },
    storyBeats: [],
    eventIndex: 0,
    status: "running",
    backpack: cloneAdventureCountMap(selected),
    departedWith: cloneAdventureCountMap(selected),
    loot: {},
    gained: {},
    gainedIngredients: {},
    lost: {},
    consumed: {},
    unlocked: [],
    unlockedMaps: [],
    unlockedRecipes: [],
    eligibleRecipeIds: eligibleRecipeIds,
    recipeGuarantees: eligibleRecipeIds.filter(function(recipeId) {
      return Math.max(0, Number(progress.recipeDiscoveryPity[recipeId]) || 0) >= 3;
    }),
    keyCluesFound: [],
    importantDiscoveries: [],
    newHookClues: [],
    hookClueProgress: null,
    injuries: {},
    injuryStrain: 0,
    forceEarlyReturnReason: "",
    statuses: [],
    events: []
  };
  progress.pendingTripSnapshot = {
    mapId: map.id,
    routeId: route.id,
    adventureHook: cloneAdventureData(adventureHook)
  };
  adventurePrototypeState.seenEventIds = [];
  adventurePrototypeState.pathIndex = 0;
  adventurePrototypeState.busy = false;
  adventurePrototypeState.draftBackpack = {};
  adventurePrototypeState.draftBackpackTouched = false;
  clearAdventureItemFeedback();
  saveGame();
  setAdventureMode("running");
  applyAdventureRoutePresentation(map.id, route.id);
  resetAdventureVisuals();
  const pathPoints = getAdventureMapPathPoints(map.id);
  setAdventureCamperPosition(pathPoints[0], false);
  playAdventureAction("idle");
  updateAdventureStatus(adventureHook.title, "Camper 整理好背包，沿" + route.name + "出发。", "体力 -" + tripStaminaCost, true);
  updateAdventureRunHud();
  if (adventurePhaseLabel) adventurePhaseLabel.textContent = route.name + " · " + adventureHook.title;
  scheduleAdventureStep(function() {
    setAdventureCamperPosition(pathPoints[1] || pathPoints[0], true);
  }, 450);
  scheduleAdventureStep(function() {
    playAdventureAction("idle");
    triggerNextAdventureEvent();
  }, 2200);
}

function formatAdventureArchiveTime(timestamp) {
  if (!Number(timestamp)) return "旧存档记录";
  try {
    return new Date(timestamp).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return "已归档";
  }
}

function renderAdventureCenter() {
  const progress = ensureAdventureProgress();
  const storageCount = getMainAdventureStorageEntries().reduce(function(total, entry) { return total + entry.count; }, 0);
  if (adventureCenterStamina) adventureCenterStamina.textContent = progress.stamina.value + " / " + ADVENTURE_STAMINA_MAX;
  if (adventureCenterStorageCount) adventureCenterStorageCount.textContent = storageCount + " 件";
  if (adventureCenterJourneyCount) adventureCenterJourneyCount.textContent = progress.journeyLogs.length + " 篇";
  if (!adventureCenterPendingStories) return;
  adventureCenterPendingStories.innerHTML = "";
  const readyStories = getAdventureStoryDefinitions().filter(function(story) {
    return getAdventureStoryState(progress, story.id).status === "ready";
  });
  if (!readyStories.length) return;
  const heading = document.createElement("strong");
  heading.textContent = "线索已收齐，等待整理";
  adventureCenterPendingStories.appendChild(heading);
  readyStories.forEach(function(story) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "adventure-center-story-button";
    button.textContent = story.title + " · 整理线索";
    button.addEventListener("click", function() { openAdventureClueSorter(story.id); });
    adventureCenterPendingStories.appendChild(button);
  });
}

function createAdventureJourneyCard(log) {
  const map = getAdventureMap(log.mapId);
  const route = getAdventureMapRoutes(map.id)[log.routeId];
  const hook = log.adventureHook || createFallbackAdventureHook(map.id, log.routeId);
  const card = document.createElement("article");
  const header = document.createElement("header");
  const title = document.createElement("div");
  const heading = document.createElement("strong");
  const meta = document.createElement("span");
  const date = document.createElement("time");
  const story = document.createElement("p");
  const ledger = document.createElement("div");
  card.className = "adventure-journey-card";
  heading.textContent = map.name + " · " + (route ? route.name : "沿途路线");
  meta.textContent = hook.title + " · " + (log.events || []).length + " 个事件";
  date.textContent = formatAdventureArchiveTime(log.createdAt);
  title.appendChild(heading);
  title.appendChild(meta);
  header.appendChild(title);
  header.appendChild(date);
  story.textContent = [log.storyIntro].concat(log.storyBeats || [], [log.storyEnding]).filter(Boolean).join(" ");
  ledger.className = "adventure-journey-ledger";
  ledger.textContent = [
    "获得：" + formatAdventureLedger(log.gained, "无"),
    "原料：" + formatAdventureIngredientLedger(log.gainedIngredients, "无"),
    "消耗：" + formatAdventureLedger(log.consumed, "无"),
    "丢失：" + formatAdventureLedger(log.lost, "无"),
    "菜谱：" + formatAdventureRecipeLedger(log.unlockedRecipes, "无")
  ].join(" · ");
  card.appendChild(header);
  card.appendChild(story);
  if (log.newHookClues && log.newHookClues.length) {
    const clues = document.createElement("p");
    clues.className = "adventure-journey-clues";
    clues.textContent = "新线索：" + log.newHookClues.map(function(clue) { return clue.label; }).join("、");
    card.appendChild(clues);
  }
  if ((log.injuries && log.injuries.length) || (log.treatments && log.treatments.length)) {
    const injuryLine = document.createElement("p");
    injuryLine.className = "adventure-journey-injuries";
    injuryLine.textContent = [
      log.injuries && log.injuries.length ? "受伤：" + log.injuries.map(function(record) { return record.label; }).join("、") : "",
      log.treatments && log.treatments.length ? "治疗：" + log.treatments.map(function(record) { return record.text; }).join("、") : ""
    ].filter(Boolean).join(" · ");
    card.appendChild(injuryLine);
  }
  card.appendChild(ledger);
  if (logHasRouteMapDiscovery(log)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "adventure-mini-control";
    button.textContent = "查看路线图";
    button.addEventListener("click", function() { openAdventureKeyItem("dampRouteMap"); });
    card.appendChild(button);
  }
  return card;
}

function createAdventureStoryArchiveCard(story, progress) {
  const state = getAdventureStoryState(progress, story.id);
  const foundIds = getAdventureStoryFoundClueIds(progress, story);
  const card = document.createElement("article");
  const header = document.createElement("header");
  const title = document.createElement("strong");
  const status = document.createElement("span");
  const clueMeta = document.createElement("p");
  const clueList = document.createElement("div");
  const labels = { collecting: "线索收集中", ready: "线索已收齐，等待整理", archived: "故事已整理归档" };
  card.className = "adventure-story-archive-card is-" + state.status;
  title.textContent = story.title;
  status.textContent = labels[state.status];
  header.appendChild(title);
  header.appendChild(status);
  clueMeta.textContent = "线索 " + foundIds.length + " / " + story.clues.length;
  clueList.className = "adventure-story-clue-list";
  if (!foundIds.length) {
    const empty = document.createElement("span");
    empty.textContent = "尚未发现";
    clueList.appendChild(empty);
  } else {
    story.clues.filter(function(clue) { return foundIds.indexOf(clue.id) !== -1; }).forEach(function(clue) {
      const item = document.createElement("span");
      item.textContent = clue.label;
      clueList.appendChild(item);
    });
  }
  card.appendChild(header);
  card.appendChild(clueMeta);
  card.appendChild(clueList);
  if (state.status === "ready") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "adventure-control adventure-control-primary";
    button.textContent = "整理线索";
    button.addEventListener("click", function() { openAdventureClueSorter(story.id); });
    card.appendChild(button);
  } else if (state.status === "archived") {
    const fullStory = document.createElement("p");
    const completed = document.createElement("small");
    fullStory.className = "adventure-archived-story-text";
    fullStory.textContent = state.storyText || story.archiveStory;
    completed.textContent = "完成时间：" + formatAdventureArchiveTime(state.completedAt);
    card.appendChild(fullStory);
    card.appendChild(completed);
    if (state.unlockLabels && state.unlockLabels.length) {
      const unlocks = document.createElement("p");
      unlocks.className = "adventure-story-unlocks";
      unlocks.textContent = "归档奖励：" + state.unlockLabels.join("、");
      card.appendChild(unlocks);
    }
    if (story.keyItemId === "dampRouteMap") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "adventure-mini-control";
      button.textContent = "查看路线图";
      button.addEventListener("click", function() { openAdventureKeyItem("dampRouteMap"); });
      card.appendChild(button);
    }
  }
  return card;
}

function renderAdventureJournal() {
  const progress = ensureAdventureProgress();
  if (adventureJourneyTab) {
    const active = adventurePrototypeState.journalTab === "journeys";
    adventureJourneyTab.classList.toggle("is-active", active);
    adventureJourneyTab.setAttribute("aria-selected", active ? "true" : "false");
  }
  if (adventureStoryArchiveTab) {
    const active = adventurePrototypeState.journalTab === "stories";
    adventureStoryArchiveTab.classList.toggle("is-active", active);
    adventureStoryArchiveTab.setAttribute("aria-selected", active ? "true" : "false");
  }
  if (!adventureJournalContent) return;
  adventureJournalContent.innerHTML = "";
  if (adventurePrototypeState.journalTab === "stories") {
    getAdventureStoryDefinitions().forEach(function(story) {
      adventureJournalContent.appendChild(createAdventureStoryArchiveCard(story, progress));
    });
    return;
  }
  const logs = progress.journeyLogs.slice().reverse();
  if (!logs.length) {
    const empty = document.createElement("p");
    empty.className = "adventure-journal-empty";
    empty.textContent = "完成一次冒险后，旅程会保存在这里。";
    adventureJournalContent.appendChild(empty);
    return;
  }
  logs.forEach(function(log) { adventureJournalContent.appendChild(createAdventureJourneyCard(log)); });
}

function showAdventureCenter() {
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  adventurePrototypeState.busy = false;
  setAdventureMode("center");
  renderAdventureCenter();
  const progress = ensureAdventureProgress();
  if (progress.pendingKeyItemReveal) {
    window.setTimeout(function() { openAdventureKeyItem(progress.pendingKeyItemReveal); }, 0);
  }
}

function showAdventureJournal(tab) {
  adventurePrototypeState.journalTab = tab === "stories" ? "stories" : "journeys";
  setAdventureMode("journal");
  renderAdventureJournal();
}

function showAdventurePreparation(message) {
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  adventurePrototypeState.busy = false;
  adventurePrototypeState.draftBackpack = {};
  adventurePrototypeState.draftBackpackTouched = false;
  adventurePrototypeState.prepStep = "routes";
  const progress = ensureAdventureProgress();
  const maps = getAdventureMapRegistry();
  if (!maps[adventurePrototypeState.draftMapId] || !isAdventureMapUnlocked(adventurePrototypeState.draftMapId, progress)) {
    adventurePrototypeState.draftMapId = getDefaultAdventureMapId();
  }
  const mapId = adventurePrototypeState.draftMapId;
  const routes = getAdventureMapRoutes(mapId);
  if (!routes[adventurePrototypeState.draftRouteId] ||
    !isAdventureRouteUnlocked(mapId, routes[adventurePrototypeState.draftRouteId], progress)) {
    adventurePrototypeState.draftRouteId = getFirstUnlockedAdventureRouteId(progress, mapId);
  }
  adventurePrototypeState.routeCarouselIndex = Math.max(0, getAdventureRouteIds(mapId).indexOf(adventurePrototypeState.draftRouteId));
  ensureDraftAdventureHook(false);
  setAdventureMode("preparing");
  if (adventurePrepPanel) adventurePrepPanel.scrollTop = 0;
  setAdventurePrepMessage(message || "请选择一条路线。", false);
  renderAdventurePreparation();
}

function showAdventureMapSelection(message) {
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  adventurePrototypeState.busy = false;
  adventurePrototypeState.draftBackpack = {};
  adventurePrototypeState.draftBackpackTouched = false;
  adventurePrototypeState.draftAdventureHook = null;
  adventurePrototypeState.prepStep = "routes";
  setAdventureMode("map-select");
  if (adventureMapMessage) adventureMapMessage.textContent = message || "今天想去哪里走走？";
  renderAdventureMapSelection();
}

function closeAdventurePrototypeLayer() {
  if (!adventurePrototypeLayer) return;
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  adventurePrototypeState.active = false;
  adventurePrototypeLayer.classList.add("hidden");
  adventurePrototypeLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("adventure-prototype-open");
  restoreAdventureViewportOrigin();
}

function openAdventurePrototype() {
  if (!adventurePrototypeLayer) return;
  if (typeof closeSettingsMenu === "function") closeSettingsMenu();
  adventurePrototypeState.active = true;
  adventurePrototypeLayer.classList.remove("hidden");
  adventurePrototypeLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("adventure-prototype-open");
  const recovered = recoverInterruptedAdventureBackpack() || adventurePrototypeState.recoveredTripSnapshot;
  if (recovered) {
    adventurePrototypeState.draftMapId = recovered.mapId;
    adventurePrototypeState.draftRouteId = recovered.routeId;
    adventurePrototypeState.draftAdventureHook = recovered.adventureHook;
  }
  adventurePrototypeState.recoveredTripSnapshot = null;
  showAdventureCenter();
  if (recovered && adventureCenterPendingStories) {
    adventureCenterPendingStories.insertAdjacentHTML("afterbegin", '<p class="adventure-center-recovery">上次中断的携带物与途中发现已安全放回对应仓库。</p>');
  }
}

function resetDeepMountainAdventureTestState() {
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  const trip = adventurePrototypeState.trip;
  if (trip) {
    Object.keys(trip.backpack).forEach(function(key) {
      const descriptor = getAdventureItemDescriptor(key);
      if (descriptor && (descriptor.type === "fish" || descriptor.type === "meal")) {
        changeAdventureStorageCount(key, trip.backpack[key]);
      }
    });
  }
  gameState.adventure = createDefaultAdventureProgress(Date.now());
  adventurePrototypeState.trip = null;
  adventurePrototypeState.busy = false;
  adventurePrototypeState.draftBackpack = {};
  adventurePrototypeState.draftBackpackTouched = false;
  adventurePrototypeState.draftMapId = getDefaultAdventureMapId();
  adventurePrototypeState.draftRouteId = getAdventureMapDefaultRouteId(adventurePrototypeState.draftMapId);
  adventurePrototypeState.draftAdventureHook = null;
  adventurePrototypeState.prepStep = "routes";
  adventurePrototypeState.routeCarouselIndex = 0;
  adventurePrototypeState.routeCarouselDrag = null;
  adventurePrototypeState.recoveredTripSnapshot = null;
  adventurePrototypeState.seenEventIds = [];
  saveGame();
  renderMainAdventureStorage();
  if (adventurePrototypeState.active) {
    showAdventureMapSelection("测试状态已重置：体力已满，基础工具已补充。 ");
  }
  console.info("[Adventure Test] reset complete", gameState.adventure);
  return {
    stamina: gameState.adventure.stamina.value,
    storage: Object.assign({}, gameState.adventure.storage),
    command: "resetDeepMountainAdventureTest()"
  };
}

window.resetDeepMountainAdventureTest = resetDeepMountainAdventureTestState;
window.resetAdventureTestState = resetDeepMountainAdventureTestState;
window.configureDeepMountainAdventureTestState = function(options) {
  const source = options && typeof options === "object" ? options : {};
  const progress = ensureAdventureProgress();
  const map = getAdventureMap("deepMountain");
  const currentState = progress.mapStates.deepMountain || map.localStateDefaults || {};
  const nextState = Object.assign({}, currentState, source.mapState || {});
  progress.mapStates.deepMountain = typeof map.sanitizeLocalState === "function" ? map.sanitizeLocalState(nextState) : nextState;
  progress.adventureMemories = sanitizeAdventureMemories(Object.assign({}, progress.adventureMemories, source.adventureMemories || {}));
  if (source.unfinishedHookId && getAdventureMapHooks("deepMountain")[source.unfinishedHookId]) {
    progress.clueStages[source.unfinishedHookId] = "seenAgain";
  }
  adventurePrototypeState.draftAdventureHook = null;
  saveGame();
  if (adventurePrototypeState.active && adventurePrototypeState.mode === "preparing") renderAdventurePreparation();
  return {
    mapState: cloneAdventureData(progress.mapStates.deepMountain),
    adventureMemories: cloneAdventureData(progress.adventureMemories)
  };
};
window.getAdventureTestSnapshot = function() {
  const progress = ensureAdventureProgress();
  return {
    version: progress.version,
    mapStates: cloneAdventureData(progress.mapStates),
    adventureMemories: cloneAdventureData(progress.adventureMemories),
    recentAdventureHistory: cloneAdventureData(progress.recentAdventureHistory),
    trip: adventurePrototypeState.trip ? cloneAdventureData(adventurePrototypeState.trip) : null
  };
};
window.simulateLocalAdventurePartyTest = function(options) {
  const source = options && typeof options === "object" ? options : {};
  return simulateLocalAdventurePartyTrip(
    source.mapId || getDefaultAdventureMapId(),
    source.size || 3,
    source.eventIds,
    getAdventureProfileSnapshot(),
    source.partyOptions
  );
};
window.openAdventureKeyItem = openAdventureKeyItem;
window.testAdventureInjury = function(injuryId) {
  const trip = adventurePrototypeState.trip;
  if (!trip || adventurePrototypeState.mode !== "running") {
    return { ok: false, message: "请先开始一趟冒险，再运行伤势测试命令。" };
  }
  const injury = addAdventureInjury(trip, injuryId, "consoleTest");
  if (!injury) return { ok: false, message: "未知或已存在的伤势类型。", validTypes: Object.keys(ADVENTURE_INJURY_CATALOG) };
  updateAdventureStatus("伤势测试：" + injury.label, injury.description + "。", "当前影响：" + injury.impact, true);
  updateAdventureRunHud();
  saveGame();
  return { ok: true, injury: cloneAdventureData(injury), activeInjuries: getActiveAdventureInjuryIds(trip) };
};
window.testAdventureFirstAid = function() {
  const trip = adventurePrototypeState.trip;
  if (!trip || adventurePrototypeState.mode !== "running") return { ok: false, message: "请先开始一趟冒险。" };
  const messages = [];
  const itemFeedback = [];
  const itemNotes = [];
  const treatments = [];
  const treated = consumeAdventureFirstAidForInjuries(trip, messages, itemFeedback, itemNotes, treatments);
  if (treated) {
    playAdventureItemFeedback(itemFeedback);
    updateAdventureStatus("急救处理", messages.join(" "), itemNotes.join(" "), true);
    updateAdventureRunHud();
    saveGame();
  }
  return { ok: treated, messages: messages, activeInjuries: getActiveAdventureInjuryIds(trip) };
};

if (adventureCenterButton) adventureCenterButton.addEventListener("click", openAdventurePrototype);
if (adventureStorageCloseButton) adventureStorageCloseButton.addEventListener("click", closeMainAdventureStorage);
if (adventureStorageLayer) adventureStorageLayer.addEventListener("click", function(event) {
  if (event.target === adventureStorageLayer) closeMainAdventureStorage();
});
if (adventureCenterCloseButton) adventureCenterCloseButton.addEventListener("click", closeAdventurePrototypeLayer);
if (adventureCenterDepartButton) adventureCenterDepartButton.addEventListener("click", function() { showAdventureMapSelection("今天想去哪里走走？"); });
if (adventureCenterStorageButton) adventureCenterStorageButton.addEventListener("click", openMainAdventureStorage);
if (adventureCenterJournalButton) adventureCenterJournalButton.addEventListener("click", function() { showAdventureJournal("journeys"); });
if (adventureJournalCloseButton) adventureJournalCloseButton.addEventListener("click", showAdventureCenter);
if (adventureJourneyTab) adventureJourneyTab.addEventListener("click", function() { showAdventureJournal("journeys"); });
if (adventureStoryArchiveTab) adventureStoryArchiveTab.addEventListener("click", function() { showAdventureJournal("stories"); });
if (adventureStartButton) adventureStartButton.addEventListener("click", startAdventureTrip);
if (adventureMapCloseButton) adventureMapCloseButton.addEventListener("click", showAdventureCenter);
if (adventurePrepCloseButton) adventurePrepCloseButton.addEventListener("click", function() {
  const step = getAdventurePrepStep();
  if (step === "backpack") {
    setAdventurePrepStep("itinerary", "已返回本次行程。");
    return;
  }
  if (step === "itinerary") {
    setAdventurePrepStep("routes", "可以重新选择路线。");
    return;
  }
  showAdventureMapSelection("换个方向看看。 ");
});
if (adventureRouteList) {
  adventureRouteList.addEventListener("pointerdown", beginAdventureRouteDrag);
  adventureRouteList.addEventListener("pointermove", moveAdventureRouteDrag);
  adventureRouteList.addEventListener("pointerup", endAdventureRouteDrag);
  adventureRouteList.addEventListener("pointercancel", endAdventureRouteDrag);
  adventureRouteList.addEventListener("click", handleAdventureRouteCardClick);
}
if (adventureTripBackButton) adventureTripBackButton.addEventListener("click", function() {
  setAdventurePrepStep("routes", "可以重新选择路线。");
});
if (adventureRouteContinueButton) adventureRouteContinueButton.addEventListener("click", function() {
  setAdventurePrepStep("backpack", "整理背包后再正式出发。");
});
if (adventureHookRerollButton) adventureHookRerollButton.addEventListener("click", function() {
  const previous = adventurePrototypeState.draftAdventureHook && adventurePrototypeState.draftAdventureHook.title;
  const next = rerollDraftAdventureHook();
  setAdventurePrepMessage(next && next.title !== previous ? "当前目标已更换为“" + next.title + "”。" : "当前路线暂时没有别的目标可换。", false);
  renderAdventurePreparation();
});
if (adventurePrepStaminaInfoButton) adventurePrepStaminaInfoButton.addEventListener("click", function(event) {
  event.stopPropagation();
  toggleAdventureStaminaPopover();
});
if (adventurePrepStaminaPopover && gameViewport) {
  gameViewport.appendChild(adventurePrepStaminaPopover);
  window.addEventListener("resize", positionAdventureStaminaPopover);
  window.addEventListener("orientationchange", positionAdventureStaminaPopover);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", positionAdventureStaminaPopover);
  if (adventurePrepPanel) adventurePrepPanel.addEventListener("scroll", positionAdventureStaminaPopover, { passive: true });
}
if (adventurePrepStaminaPopover) adventurePrepStaminaPopover.addEventListener("click", function(event) {
  event.stopPropagation();
});
if (adventureRecommendationResetButton) adventureRecommendationResetButton.addEventListener("click", function() {
  applyAdventureBackpackRecommendation(true);
  setAdventurePrepMessage("已按当前路线和目标重新整理背包草稿。", false);
  renderAdventurePreparation();
});
if (adventurePrepResetButton) adventurePrepResetButton.addEventListener("click", resetDeepMountainAdventureTestState);
if (adventureEndEarlyButton) adventureEndEarlyButton.addEventListener("click", function() { finishAdventureTrip("earlyReturn", "提前返回"); });
if (adventureAgainButton) adventureAgainButton.addEventListener("click", function() { showAdventurePreparation("上一趟物品已经结算回 Storage。 "); });
if (adventureLogMapButton) adventureLogMapButton.addEventListener("click", function() { showAdventureMapSelection("上一趟已经安全结算，可以选择下一处目的地。 "); });
if (adventureLogExitButton) adventureLogExitButton.addEventListener("click", showAdventureCenter);
if (adventureLogResetButton) adventureLogResetButton.addEventListener("click", resetDeepMountainAdventureTestState);
if (adventureLogRouteMapButton) adventureLogRouteMapButton.addEventListener("click", function() { openAdventureRouteMapReveal(false); });
if (adventureRouteMapCloseButton) adventureRouteMapCloseButton.addEventListener("click", closeAdventureRouteMapReveal);
if (adventureRouteMapMapButton) adventureRouteMapMapButton.addEventListener("click", function() {
  closeAdventureRouteMapReveal();
  showAdventureMapSelection("新地图已记录，可以从这里前往雾雨林。");
});
if (adventureRouteMapLayer) adventureRouteMapLayer.addEventListener("click", function(event) {
  if (event.target === adventureRouteMapLayer) closeAdventureRouteMapReveal();
});
document.addEventListener("click", closeAdventureStaminaPopover);
if (adventureClueSortCloseButton) adventureClueSortCloseButton.addEventListener("click", closeAdventureClueSorter);
if (adventureClueSortHintButton) adventureClueSortHintButton.addEventListener("click", function() {
  const story = getAdventureStoryDefinition(adventurePrototypeState.activeStorySortId);
  if (!story || adventurePrototypeState.storySortSolved) return;
  adventurePrototypeState.storySortHintLevel += 1;
  if (shouldPinAdventureStoryFirstClue(adventurePrototypeState.storySortAttempts, adventurePrototypeState.storySortHintLevel)) {
    ensureAdventureStoryFirstCluePinned(story);
  }
  if (adventureClueSortMessage) adventureClueSortMessage.textContent = "只揭开一小部分关系，其余顺序仍要由你判断。";
  renderAdventureClueSorter();
});
if (adventureClueSortResetButton) adventureClueSortResetButton.addEventListener("click", function() {
  const story = getAdventureStoryDefinition(adventurePrototypeState.activeStorySortId);
  if (!story || adventurePrototypeState.storySortSolved) return;
  adventurePrototypeState.storySortOrder = getInitialAdventureStorySortOrder(story);
  adventurePrototypeState.storySortSelected = adventurePrototypeState.storySortPinnedClueId ? [adventurePrototypeState.storySortPinnedClueId] : [];
  if (adventurePrototypeState.storySortPinnedClueId) ensureAdventureStoryFirstCluePinned(story);
  if (adventureClueSortMessage) adventureClueSortMessage.textContent = "";
  renderAdventureClueSorter();
});
if (adventureClueSortConfirmButton) adventureClueSortConfirmButton.addEventListener("click", function() {
  const story = getAdventureStoryDefinition(adventurePrototypeState.activeStorySortId);
  if (!story) return;
  const order = getAdventureStorySorterOrder(story);
  if (adventurePrototypeState.storySortSolved && archiveAdventureStory(adventurePrototypeState.activeStorySortId, order)) {
    closeAdventureClueSorter();
    return;
  }
  if (isAdventureStoryOrderCorrect(story, order)) {
    adventurePrototypeState.storySortSolved = true;
    if (adventureClueSortMessage) adventureClueSortMessage.textContent = "顺序已经对上。读完整理结果后，再将故事归档。";
    renderAdventureClueSorter();
    return;
  }
  adventurePrototypeState.storySortAttempts += 1;
  if (shouldPinAdventureStoryFirstClue(adventurePrototypeState.storySortAttempts, adventurePrototypeState.storySortHintLevel)) {
    ensureAdventureStoryFirstCluePinned(story);
  }
  if (adventureClueSortMessage) adventureClueSortMessage.textContent = "有些线索似乎还没有对上。";
  renderAdventureClueSorter();
});
if (adventureClueSortLayer) adventureClueSortLayer.addEventListener("click", function(event) {
  if (event.target === adventureClueSortLayer) closeAdventureClueSorter();
});
document.addEventListener("pointermove", function(event) {
  if (!adventurePrototypeState.storySortPointerClueId) return;
  const distance = Math.abs(event.clientX - adventurePrototypeState.storySortPointerStartX) + Math.abs(event.clientY - adventurePrototypeState.storySortPointerStartY);
  if (distance > 8) adventurePrototypeState.storySortPointerMoved = true;
});
document.addEventListener("pointerup", function(event) {
  const clueId = adventurePrototypeState.storySortPointerClueId;
  if (!clueId) return;
  const story = getAdventureStoryDefinition(adventurePrototypeState.activeStorySortId);
  const target = document.elementFromPoint ? document.elementFromPoint(event.clientX, event.clientY) : null;
  const targetCard = target && target.closest ? target.closest("[data-clue-id]") : null;
  if (story && adventurePrototypeState.storySortPointerMoved && targetCard) {
    adventurePrototypeState.storySortSuppressClick = true;
    if (moveAdventureStoryClue(story, clueId, targetCard.dataset.clueId)) renderAdventureClueSorter();
    window.setTimeout(function() { adventurePrototypeState.storySortSuppressClick = false; }, 0);
  }
  adventurePrototypeState.storySortPointerClueId = "";
  adventurePrototypeState.storySortPointerMoved = false;
});
document.addEventListener("pointercancel", function() {
  adventurePrototypeState.storySortPointerClueId = "";
  adventurePrototypeState.storySortPointerMoved = false;
});

document.addEventListener("keydown", function(event) {
  if (event.key !== "Escape") return;
  if (adventureRouteMapLayer && !adventureRouteMapLayer.classList.contains("hidden")) {
    closeAdventureRouteMapReveal();
    return;
  }
  if (adventureClueSortLayer && !adventureClueSortLayer.classList.contains("hidden")) {
    closeAdventureClueSorter();
    return;
  }
  if (adventureStorageLayer && !adventureStorageLayer.classList.contains("hidden")) {
    closeMainAdventureStorage();
    return;
  }
  if (!adventurePrototypeState.active) return;
  if (adventurePrototypeState.mode === "running") {
    finishAdventureTrip("earlyReturn", "提前返回");
  } else if (adventurePrototypeState.mode === "center") {
    closeAdventurePrototypeLayer();
  } else {
    showAdventureCenter();
  }
});

window.addEventListener("load", renderMainAdventureStorage);

window.setInterval(function() {
  if (adventurePrototypeState.active && adventurePrototypeState.mode === "preparing") {
    renderAdventurePreparation();
  } else if (adventurePrototypeState.active && adventurePrototypeState.mode === "map-select") {
    renderAdventureMapSelection();
  }
}, 60000);
