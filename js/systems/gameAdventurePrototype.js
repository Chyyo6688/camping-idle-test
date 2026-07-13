// Playable single-player deep-mountain adventure prototype.

const adventurePrototypeLayer = document.getElementById("adventurePrototypeLayer");
const adventurePrototype = document.getElementById("adventurePrototype");
const adventureScene = document.getElementById("adventureScene");
const adventureHeader = document.getElementById("adventureHeader");
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
const adventureEndEarlyButton = document.getElementById("adventureEndEarlyButton");
const settingsAdventurePrototypeItem = document.getElementById("settingsAdventurePrototypeItem");
const adventureStorageButton = document.getElementById("adventureStorageButton");
const adventureStorageBadge = document.getElementById("adventureStorageBadge");
const adventureStorageLayer = document.getElementById("adventureStorageLayer");
const adventureStorageCloseButton = document.getElementById("adventureStorageCloseButton");
const adventureStorageLatestMeta = document.getElementById("adventureStorageLatestMeta");
const adventureStorageLatestList = document.getElementById("adventureStorageLatestList");
const adventureStorageCountLabel = document.getElementById("adventureStorageCountLabel");
const adventureStorageItemList = document.getElementById("adventureStorageItemList");

const adventurePrepStaminaText = document.getElementById("adventurePrepStaminaText");
const adventurePrepStaminaFill = document.getElementById("adventurePrepStaminaFill");
const adventureStaminaHint = document.getElementById("adventureStaminaHint");
const adventureStorageList = document.getElementById("adventureStorageList");
const adventureBackpackList = document.getElementById("adventureBackpackList");
const adventureBackpackCapacity = document.getElementById("adventureBackpackCapacity");
const adventurePrepMessage = document.getElementById("adventurePrepMessage");
const adventureStartButton = document.getElementById("adventureStartButton");
const adventurePrepResetButton = document.getElementById("adventurePrepResetButton");
const adventurePrepCloseButton = document.getElementById("adventurePrepCloseButton");
const adventureGoalList = document.getElementById("adventureGoalList");
const adventureRouteList = document.getElementById("adventureRouteList");
const adventureStrategyHint = document.getElementById("adventureStrategyHint");

const adventureLogStatus = document.getElementById("adventureLogStatus");
const adventureLogIllustration = document.getElementById("adventureLogIllustration");
const adventureLogIllustrationProp = document.getElementById("adventureLogIllustrationProp");
const adventureLogIllustrationCaption = document.getElementById("adventureLogIllustrationCaption");
const adventureLogLocation = document.getElementById("adventureLogLocation");
const adventureLogEventCount = document.getElementById("adventureLogEventCount");
const adventureLogStamina = document.getElementById("adventureLogStamina");
const adventureLogEndReason = document.getElementById("adventureLogEndReason");
const adventureLogEventList = document.getElementById("adventureLogEventList");
const adventureLogGoalStatus = document.getElementById("adventureLogGoalStatus");
const adventureLogStoryTitle = document.getElementById("adventureLogStoryTitle");
const adventureLogStoryIntro = document.getElementById("adventureLogStoryIntro");
const adventureLogStoryBody = document.getElementById("adventureLogStoryBody");
const adventureLogStoryEnding = document.getElementById("adventureLogStoryEnding");
const adventureLogDeparted = document.getElementById("adventureLogDeparted");
const adventureLogGained = document.getElementById("adventureLogGained");
const adventureLogLost = document.getElementById("adventureLogLost");
const adventureLogConsumed = document.getElementById("adventureLogConsumed");
const adventureLogUnlocked = document.getElementById("adventureLogUnlocked");
const adventureAgainButton = document.getElementById("adventureAgainButton");
const adventureLogExitButton = document.getElementById("adventureLogExitButton");
const adventureLogResetButton = document.getElementById("adventureLogResetButton");

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

const ADVENTURE_PROP_SHEET_POSITIONS = {
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

const adventurePrototypeState = {
  active: false,
  mode: "preparing",
  busy: false,
  draftBackpack: {},
  draftGoalId: "investigateWhiteShadow",
  draftRouteId: "creekValley",
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

function getAdventureItemRule(itemId) {
  return ADVENTURE_ITEM_RULES[itemId] || { maxOwned: Infinity, carryable: true, repeatable: true };
}

function createDefaultAdventureProgress(now) {
  return {
    version: ADVENTURE_SAVE_VERSION,
    storage: Object.assign({}, ADVENTURE_DEFAULT_STORAGE),
    stamina: {
      value: ADVENTURE_STAMINA_MAX,
      updatedAt: Number(now) || Date.now()
    },
    unlockedRoutes: ["deepMountain"],
    unlockedLocations: ["deepMountain"],
    discoveredKeyItems: [],
    discoveredClues: [],
    collectedClues: [],
    itemSolutionKnowledge: [],
    adventureStarterKitMigrationVersion: ADVENTURE_STARTER_KIT_MIGRATION_VERSION,
    completedTrips: 0,
    pendingBackpack: {},
    pendingLoot: {},
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

function sanitizeAdventureLog(log) {
  if (!log || typeof log !== "object" || Array.isArray(log)) {
    return null;
  }
  return {
    id: typeof log.id === "string" ? log.id : "",
    createdAt: Math.max(0, Number(log.createdAt) || 0),
    locationId: ADVENTURE_LOCATION_CATALOG[log.locationId] ? log.locationId : "deepMountain",
    goalId: DEEP_MOUNTAIN_ADVENTURE_GOALS[log.goalId] ? log.goalId : "investigateWhiteShadow",
    routeId: DEEP_MOUNTAIN_ADVENTURE_ROUTES[log.routeId] ? log.routeId : "creekValley",
    goalResult: ["complete", "partial", "incomplete", "unexpected"].indexOf(log.goalResult) !== -1 ? log.goalResult : "incomplete",
    goalScore: Math.max(0, Math.floor(Number(log.goalScore) || 0)),
    storyIntro: typeof log.storyIntro === "string" ? log.storyIntro : "",
    storyBeats: Array.isArray(log.storyBeats) ? log.storyBeats.filter(function(beat) { return typeof beat === "string"; }).slice(0, ADVENTURE_MAX_EVENTS_PER_TRIP + 2) : [],
    storyEnding: typeof log.storyEnding === "string" ? log.storyEnding : "",
    rewardNotes: Array.isArray(log.rewardNotes) ? log.rewardNotes.filter(function(note) { return typeof note === "string"; }).slice(0, 4) : [],
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
        missedItemOpportunity: Boolean(entry.missedItemOpportunity)
      };
    }) : [],
    gained: sanitizeAdventureBackpackMap(log.gained),
    departedWith: sanitizeAdventureBackpackMap(log.departedWith),
    lost: sanitizeAdventureBackpackMap(log.lost),
    consumed: sanitizeAdventureBackpackMap(log.consumed),
    unlocked: Array.isArray(log.unlocked) ? log.unlocked.filter(function(id) { return Boolean(ADVENTURE_LOCATION_CATALOG[id]); }) : [],
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
    ? routeSource.filter(function(id) { return Boolean(ADVENTURE_LOCATION_CATALOG[id]); })
    : ["deepMountain"];
  if (unlocked.indexOf("deepMountain") === -1) {
    unlocked.unshift("deepMountain");
  }
  const pendingBackpack = sanitizeAdventureBackpackMap(progress.pendingBackpack);
  const pendingLoot = sanitizeAdventureBackpackMap(progress.pendingLoot);
  const log = sanitizeAdventureLog(progress.lastLog);
  const sourceVersion = Math.max(0, Math.floor(Number(progress.version) || 0));
  const recordedLetter = Boolean(storage.sealedLetter) || Boolean(log && log.gained["item:sealedLetter"]);
  const discoveredSource = sourceVersion >= 3
    ? (Array.isArray(progress.discoveredKeyItems) ? progress.discoveredKeyItems : progress.collectedClues)
    : (recordedLetter ? ["sealedLetter"] : []);
  const discoveredKeyItems = Array.from(new Set((Array.isArray(discoveredSource) ? discoveredSource : []).filter(function(id) {
    return id === "sealedLetter";
  })));
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
  const recentAdventureHistory = (Array.isArray(progress.recentAdventureHistory) ? progress.recentAdventureHistory : []).filter(function(entry) {
    return entry && DEEP_MOUNTAIN_ADVENTURE_GOALS[entry.goalId] && DEEP_MOUNTAIN_ADVENTURE_ROUTES[entry.routeId];
  }).slice(-8).map(function(entry) {
    return {
      goalId: entry.goalId,
      routeId: entry.routeId,
      eventIds: Array.isArray(entry.eventIds) ? entry.eventIds.filter(function(id) {
        return DEEP_MOUNTAIN_ADVENTURE_EVENTS.some(function(eventDefinition) { return eventDefinition.id === id; });
      }).slice(0, ADVENTURE_MAX_EVENTS_PER_TRIP) : [],
      outcomeType: ["complete", "partial", "incomplete", "unexpected"].indexOf(entry.outcomeType) !== -1 ? entry.outcomeType : "incomplete",
      createdAt: Math.max(0, Number(entry.createdAt) || 0)
    };
  });
  return {
    version: ADVENTURE_SAVE_VERSION,
    storage: storage,
    stamina: {
      value: clampAdventureValue(staminaSource.value, 0, ADVENTURE_STAMINA_MAX),
      updatedAt: Math.max(0, Number(staminaSource.updatedAt) || Date.now())
    },
    unlockedRoutes: uniqueRoutes,
    unlockedLocations: uniqueRoutes.slice(),
    discoveredKeyItems: discoveredKeyItems,
    discoveredClues: discoveredClues,
    collectedClues: discoveredKeyItems.slice(),
    itemSolutionKnowledge: Array.isArray(progress.itemSolutionKnowledge)
      ? Array.from(new Set(progress.itemSolutionKnowledge.filter(function(id) { return typeof id === "string" && ADVENTURE_ITEM_SOLUTION_EFFECTS[id]; })))
      : [],
    completedTrips: Math.max(0, Math.floor(Number(progress.completedTrips) || 0)),
    adventureStarterKitMigrationVersion: starterKitMigrationVersion,
    pendingBackpack: pendingBackpack,
    pendingLoot: pendingLoot,
    recentAdventureHistory: recentAdventureHistory,
    lastLog: log
  };
}

function ensureAdventureProgress(state, now) {
  const campState = state || gameState;
  const currentTime = Number(now) || Date.now();
  if (!campState.adventure ||
    Number(campState.adventure.version) !== ADVENTURE_SAVE_VERSION ||
    !Array.isArray(campState.adventure.unlockedRoutes) ||
    !Array.isArray(campState.adventure.discoveredKeyItems) ||
    !Array.isArray(campState.adventure.discoveredClues) ||
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
    icon.style.backgroundImage = 'url("' + descriptor.image + '")';
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

function isDeepMountainRouteUnlocked(routeDefinition, progress) {
  const unlocked = Array.isArray(progress.unlockedRoutes) ? progress.unlockedRoutes : progress.unlockedLocations;
  return routeDefinition.unlockAny.some(function(locationId) { return unlocked.indexOf(locationId) !== -1; });
}

function getFirstUnlockedAdventureRouteId(progress) {
  return Object.keys(DEEP_MOUNTAIN_ADVENTURE_ROUTES).find(function(routeId) {
    return isDeepMountainRouteUnlocked(DEEP_MOUNTAIN_ADVENTURE_ROUTES[routeId], progress);
  }) || "creekValley";
}

function renderAdventureGoalChoices() {
  if (!adventureGoalList) return;
  adventureGoalList.innerHTML = "";
  Object.keys(DEEP_MOUNTAIN_ADVENTURE_GOALS).forEach(function(goalId) {
    const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[goalId];
    const button = document.createElement("button");
    const title = document.createElement("strong");
    const description = document.createElement("span");
    button.type = "button";
    button.className = "adventure-choice-card goal-choice";
    button.classList.toggle("is-selected", adventurePrototypeState.draftGoalId === goalId);
    button.setAttribute("aria-pressed", adventurePrototypeState.draftGoalId === goalId ? "true" : "false");
    title.textContent = goal.name;
    description.textContent = goal.shortDescription;
    button.appendChild(title);
    button.appendChild(description);
    button.addEventListener("click", function() {
      adventurePrototypeState.draftGoalId = goalId;
      setAdventurePrepMessage("本次目标已改为：“" + goal.name + "”。", false);
      renderAdventurePreparation();
    });
    adventureGoalList.appendChild(button);
  });
}

function renderAdventureRouteChoices(progress) {
  if (!adventureRouteList) return;
  adventureRouteList.innerHTML = "";
  if (!DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId] ||
    !isDeepMountainRouteUnlocked(DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId], progress)) {
    adventurePrototypeState.draftRouteId = getFirstUnlockedAdventureRouteId(progress);
  }
  Object.keys(DEEP_MOUNTAIN_ADVENTURE_ROUTES).forEach(function(routeId) {
    const route = DEEP_MOUNTAIN_ADVENTURE_ROUTES[routeId];
    const unlocked = isDeepMountainRouteUnlocked(route, progress);
    const button = document.createElement("button");
    const title = document.createElement("strong");
    const risk = document.createElement("em");
    const description = document.createElement("span");
    button.type = "button";
    button.className = "adventure-choice-card route-choice";
    button.classList.toggle("is-selected", adventurePrototypeState.draftRouteId === routeId);
    button.classList.toggle("is-locked", !unlocked);
    button.disabled = !unlocked;
    button.setAttribute("aria-pressed", adventurePrototypeState.draftRouteId === routeId ? "true" : "false");
    title.textContent = route.name;
    risk.textContent = unlocked ? route.riskLabel : "尚未解锁";
    description.textContent = unlocked ? route.description : route.lockedHint;
    button.appendChild(title);
    button.appendChild(risk);
    button.appendChild(description);
    if (unlocked) {
      button.addEventListener("click", function() {
        adventurePrototypeState.draftRouteId = routeId;
        setAdventurePrepMessage("已选择“" + route.name + "”。", false);
        renderAdventurePreparation();
      });
    }
    adventureRouteList.appendChild(button);
  });
  if (adventureStrategyHint) {
    const route = DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId];
    const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[adventurePrototypeState.draftGoalId];
    adventureStrategyHint.textContent = route.preparationHint + " “" + goal.name + "”也可能从不同线索取得进展。";
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
  if (adventurePrepStaminaText) {
    adventurePrepStaminaText.textContent = progress.stamina.value + " / " + ADVENTURE_STAMINA_MAX;
  }
  if (adventurePrepStaminaFill) {
    adventurePrepStaminaFill.style.width = staminaPercent + "%";
  }
  if (adventureStaminaHint) {
    const route = DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId] || DEEP_MOUNTAIN_ADVENTURE_ROUTES.creekValley;
    adventureStaminaHint.textContent = getAdventureStaminaRecoveryText(progress) + (route.staminaCost ? " 此路线额外消耗 " + route.staminaCost + " 点。" : "");
  }
  if (adventureBackpackCapacity) {
    adventureBackpackCapacity.textContent = "已携带 " + selectedCount + " / " + ADVENTURE_BACKPACK_CAPACITY;
  }
  renderAdventureSourceList(adventureStorageList, storageEntries);
  renderAdventureList(adventureBackpackList, backpackEntries, "backpack", "背包还是空的。可以空手出发。 ");
  renderAdventureGoalChoices();
  renderAdventureRouteChoices(progress);
  if (adventureStorageList && selectedCount >= ADVENTURE_BACKPACK_CAPACITY) {
    adventureStorageList.querySelectorAll("button").forEach(function(button) { button.disabled = true; });
  }
  if (adventureStartButton) {
    const selectedRoute = DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId] || DEEP_MOUNTAIN_ADVENTURE_ROUTES.creekValley;
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
  setAdventurePrepMessage("已装入 " + getAdventureItemDescriptor(key).name + "。", false);
  renderAdventurePreparation();
}

function removeItemFromAdventureDraft(key) {
  if (removeAdventureCount(adventurePrototypeState.draftBackpack, key, 1) > 0) {
    setAdventurePrepMessage("已将 " + getAdventureItemDescriptor(key).name + " 放回 Storage。", false);
    renderAdventurePreparation();
  }
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
  const requirementMap = ADVENTURE_REACTION_ITEM_REQUIREMENTS[eventDefinition.id] || {};
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
  const solutionCandidates = reactionSelection.candidates.filter(function(candidate) {
    return candidate.requirements.length > 0 && ADVENTURE_ITEM_SOLUTION_EFFECTS[eventDefinition.id + ":" + candidate.reaction.id];
  });
  if (!solutionCandidates.length || solutionCandidates.some(function(candidate) { return candidate.hasRequiredItem; })) return null;
  const feedback = ADVENTURE_MISSING_ITEM_FEEDBACK[eventDefinition.id];
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
  const requirements = (ADVENTURE_REACTION_ITEM_REQUIREMENTS[eventDefinition.id] || {})[reaction.id] || [];
  const solutionId = eventDefinition.id + ":" + reaction.id;
  const configuredSolution = ADVENTURE_ITEM_SOLUTION_EFFECTS[solutionId] || null;
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

function calculateAdventureGoalScore(goalDefinition, eventFlags) {
  return Object.keys(goalDefinition.progressFlags).reduce(function(total, flagId) {
    if (!eventFlags[flagId]) return total;
    const multiplier = typeof eventFlags[flagId] === "number" ? Math.max(1, eventFlags[flagId]) : 1;
    return total + goalDefinition.progressFlags[flagId] * Math.min(2, multiplier);
  }, 0);
}

function evaluateAdventureGoalProgress(trip) {
  const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[trip.goalId];
  const score = calculateAdventureGoalScore(goal, trip.eventFlags || {});
  return {
    score: score,
    status: score >= goal.successScore ? "complete" : (score >= goal.partialScore ? "partial" : "incomplete")
  };
}

function getAdventureChainWeight(eventId, flags) {
  let multiplier = 1;
  if (flags.foundAnimalTracks && ["forestFootsteps", "missingFood"].indexOf(eventId) !== -1) multiplier *= 2.2;
  if (flags.heardStrangeFootsteps && eventId === "whiteShadow") multiplier *= 2.5;
  if (flags.sawWhiteShadow && ["lostBeforeDark", "hiddenFork"].indexOf(eventId) !== -1) multiplier *= 2.15;
  if (flags.discoveredCabinClue && eventId === "lockedChest") multiplier *= 2.6;
  if (flags.openedChest && eventId === "distantCry") multiplier *= 1.8;
  if (flags.enduredDownpour && eventId === "unstableBridge") multiplier *= 2.4;
  if (flags.repairedBridge && ["hiddenFork", "lostBeforeDark"].indexOf(eventId) !== -1) multiplier *= 2.1;
  return multiplier;
}

function getAdventureHistoryWeight(eventId, trip, progress) {
  const recent = progress.recentAdventureHistory || [];
  const sameGoal = recent.filter(function(entry) { return entry.goalId === trip.goalId; }).slice(-2);
  let multiplier = 1;
  sameGoal.forEach(function(entry, reverseIndex) {
    if (entry.eventIds.indexOf(eventId) !== -1) multiplier *= reverseIndex === sameGoal.length - 1 ? 0.58 : 0.78;
    if (entry.eventIds[trip.events.length] === eventId) multiplier *= 0.45;
  });
  return Math.max(0.18, multiplier);
}

function chooseNextAdventureEvent(snapshot) {
  const trip = adventurePrototypeState.trip;
  const progress = ensureAdventureProgress();
  const remaining = DEEP_MOUNTAIN_ADVENTURE_EVENTS.filter(function(eventDefinition) {
    return adventurePrototypeState.seenEventIds.indexOf(eventDefinition.id) === -1;
  });
  const dangerSense = Number(snapshot.dailyAdventureModifiers.dangerSense) || 0;
  const route = DEEP_MOUNTAIN_ADVENTURE_ROUTES[trip.routeId];
  const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[trip.goalId];
  const goalProgress = evaluateAdventureGoalProgress(trip);
  const remainingSlots = ADVENTURE_MAX_EVENTS_PER_TRIP - trip.events.length;
  const entries = remaining.map(function(eventDefinition) {
    const routeWeight = Number(route.eventWeights[eventDefinition.id]) || 1;
    let goalWeight = goal.relatedEvents.indexOf(eventDefinition.id) !== -1 ? 1.85 : 1;
    if (remainingSlots <= 2 && goalProgress.score === 0 && goal.relatedEvents.indexOf(eventDefinition.id) !== -1) goalWeight *= 3.2;
    const dangerWeight = clampAdventureValue(1 - dangerSense * eventDefinition.risk * 0.025, 0.3, 1.7);
    const chainWeight = getAdventureChainWeight(eventDefinition.id, trip.eventFlags || {});
    const historyWeight = getAdventureHistoryWeight(eventDefinition.id, trip, progress);
    return { eventDefinition: eventDefinition, weight: Math.max(0.05, routeWeight * goalWeight * dangerWeight * chainWeight * historyWeight) };
  });
  return pickWeightedAdventureEntry(entries).eventDefinition;
}

function applyAdventureStoryContext(eventDefinition, reaction, outcome, trip) {
  const flags = trip.eventFlags || {};
  const context = { bubble: "", result: "", chainId: "", visualClass: "" };
  if (eventDefinition.id === "forestFootsteps" && flags.foundAnimalTracks) {
    context.bubble = flags.followedAnimal ? "是刚才那串脚印，它又转进树林了。" : "这步子和溪边的痕迹很像。";
    context.result = flags.befriendedAnimal ? "熟悉的动物在林边短暂停下，没有再躲开你。" : "你把树林里的声音与先前脚印对应起来，确认了动物移动的方向。";
    context.chainId = "animalTrail";
  } else if (eventDefinition.id === "missingFood" && flags.foundAnimalTracks) {
    context.bubble = flags.befriendedAnimal ? "看来它记住了鱼的味道。" : "这些小爪印和刚才的是同一组。";
    context.result = flags.befriendedAnimal ? "那只动物只翻动了外袋，旁边还留下几枚完整坚果。" : "先前的脚印终于有了解释：动物一路跟到了休息点。";
    context.chainId = "animalTrail";
  } else if (eventDefinition.id === "whiteShadow" && flags.heardStrangeFootsteps) {
    context.bubble = "刚才跟着我的脚步声，是你吗？";
    context.result = "白影在同样的脚步声中停下，像是在等你先表明来意。";
    context.chainId = "whiteShadow";
  } else if (eventDefinition.id === "lostBeforeDark" && flags.sawWhiteShadow) {
    context.bubble = flags.whiteShadowTrust > 0 ? "它又在路口出现了……是在等我吗？" : "那道影子怎么又挡在前面？";
    context.result = flags.whiteShadowTrust > 0
      ? "白影在雾中停了两次，留下的间隔正好把你引回清楚路标。"
      : "白影忽远忽近，你没有贸然跟随，而是靠自己的痕迹退回安全处。";
    context.chainId = "whiteShadow";
    context.visualClass = flags.whiteShadowTrust > 0 ? "story-guiding-shadow" : "story-distant-shadow";
    if (flags.whiteShadowTrust > 0 && ["bad", "rareBad"].indexOf(outcome.tier) !== -1) outcome.tier = "good";
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
  const icon = document.createElement("span");
  adventureUsedItemVisual.innerHTML = "";
  applyAdventureItemIcon(icon, descriptor);
  adventureUsedItemVisual.appendChild(icon);
  adventureUsedItemVisual.className = "adventure-used-item-visual is-visible " + (visualClass || "solution-tool");
  adventureUsedItemVisual.style.left = clampAdventureValue(eventDefinition.prop.x - 8, 12, 82) + "%";
  adventureUsedItemVisual.style.top = clampAdventureValue(eventDefinition.prop.y - 13, 20, 70) + "%";
}

function showAdventureMissingItemVisual(eventDefinition) {
  if (!adventureUsedItemVisual) return;
  adventureUsedItemVisual.innerHTML = '<span class="adventure-missing-item-mark">?</span>';
  adventureUsedItemVisual.className = "adventure-used-item-visual is-visible is-missing";
  adventureUsedItemVisual.style.left = clampAdventureValue(eventDefinition.prop.x - 8, 12, 82) + "%";
  adventureUsedItemVisual.style.top = clampAdventureValue(eventDefinition.prop.y - 13, 20, 70) + "%";
}

function resetAdventureVisuals() {
  if (adventureAtmosphere) adventureAtmosphere.className = "adventure-atmosphere";
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
    adventureEventProp.className = "adventure-event-prop " + eventDefinition.prop.className;
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
}

function getNextAdventurePathPoint() {
  adventurePrototypeState.pathIndex = (adventurePrototypeState.pathIndex + 1) % ADVENTURE_PROTOTYPE_PATH_POINTS.length;
  return ADVENTURE_PROTOTYPE_PATH_POINTS[adventurePrototypeState.pathIndex];
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

function unlockAdventureLocation(progress, trip, locationId, messages, itemNotes) {
  const routes = Array.isArray(progress.unlockedRoutes) ? progress.unlockedRoutes : progress.unlockedLocations;
  if (!ADVENTURE_LOCATION_CATALOG[locationId] || routes.indexOf(locationId) !== -1) return false;
  routes.push(locationId);
  progress.unlockedRoutes = routes;
  progress.unlockedLocations = routes.slice();
  if (trip.unlocked.indexOf(locationId) === -1) trip.unlocked.push(locationId);
  messages.push("解锁 " + ADVENTURE_LOCATION_CATALOG[locationId].name);
  if (itemNotes) itemNotes.push("永久解锁路线：" + ADVENTURE_LOCATION_CATALOG[locationId].name);
  return true;
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

function applyAdventureConsequences(eventDefinition, reaction, outcome) {
  const trip = adventurePrototypeState.trip;
  const progress = ensureAdventureProgress();
  const effects = outcome.skipBaseConsequences ? [] : ((ADVENTURE_EVENT_CONSEQUENCES[eventDefinition.id] || {})[outcome.tier] || []);
  const messages = [];
  const itemFeedback = [];
  const itemNotes = [];
  let eventStaminaDelta = 0;
  let usedRecoveryConsumable = false;
  let consumedSolutionItem = false;
  let consumedFollowUpItem = false;

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
    } else if (effect.type === "unlock" && ADVENTURE_LOCATION_CATALOG[effect.locationId]) {
      unlockAdventureLocation(progress, trip, effect.locationId, messages, itemNotes);
    } else if (effect.type === "status") {
      if (trip.statuses.indexOf(effect.label) === -1) trip.statuses.push(effect.label);
      messages.push(effect.label);
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

  const injuryEvent = ["suddenDownpour", "unstableBridge", "whiteShadow", "streamSparkle"].indexOf(eventDefinition.id) !== -1;
  const fatigueEvent = ["suddenDownpour", "unstableBridge", "streamSparkle", "lostBeforeDark"].indexOf(eventDefinition.id) !== -1;
  if (!usedRecoveryConsumable && injuryEvent && eventStaminaDelta <= -4 && backpackHasAdventureItem(trip.backpack, "firstAidPouch")) {
    removeAdventureCount(trip.backpack, "item:firstAidPouch", 1);
    addAdventureCount(trip.consumed, "item:firstAidPouch", 1);
    const recovered = changeAdventureStamina(8, trip);
    messages.push("及时使用 急救包，体力 +" + recovered);
    itemFeedback.push({ kind: "consumed", key: "item:firstAidPouch", quantity: 1 });
    itemNotes.push("伤口得到及时处理。消耗：急救包 ×1");
    showAdventureUsedItemVisual("item:firstAidPouch", eventDefinition, "solution-first-aid");
    playAdventureAction("open");
    usedRecoveryConsumable = true;
  } else if (!usedRecoveryConsumable && fatigueEvent && eventStaminaDelta <= -2 && backpackHasAdventureItem(trip.backpack, "mountainHerb")) {
    removeAdventureCount(trip.backpack, "item:mountainHerb", 1);
    addAdventureCount(trip.consumed, "item:mountainHerb", 1);
    const recovered = changeAdventureStamina(4, trip);
    messages.push("使用 山地草药，体力 +" + recovered);
    itemFeedback.push({ kind: "consumed", key: "item:mountainHerb", quantity: 1 });
    itemNotes.push("你用山地草药缓解了伤痛。消耗：山地草药 ×1");
    showAdventureUsedItemVisual("item:mountainHerb", eventDefinition, "solution-herb");
    playAdventureAction("rest");
    usedRecoveryConsumable = true;
  }
  if (!usedRecoveryConsumable && progress.stamina.value <= 15 && backpackHasAdventureItem(trip.backpack, "trailRation")) {
    removeAdventureCount(trip.backpack, "item:trailRation", 1);
    addAdventureCount(trip.consumed, "item:trailRation", 1);
    const recovered = changeAdventureStamina(6, trip);
    messages.push("自动吃下 干粮包，体力 +" + recovered);
    itemFeedback.push({ kind: "consumed", key: "item:trailRation", quantity: 1 });
    itemNotes.push("体力不足时补充了干粮。消耗：干粮包 ×1");
    showAdventureUsedItemVisual("item:trailRation", eventDefinition, "solution-ration");
    playAdventureAction("rest");
  }

  progress.pendingBackpack = cloneAdventureCountMap(trip.backpack);
  progress.pendingLoot = cloneAdventureCountMap(trip.loot);
  saveGame();
  playAdventureItemFeedback(itemFeedback);
  return { messages: messages, itemNotes: itemNotes };
}

function updateAdventureEventFlags(eventDefinition, reaction, outcome, storyContext, trip) {
  const flags = trip.eventFlags;
  const favorable = ["good", "rareGood"].indexOf(outcome.tier) !== -1;
  if (eventDefinition.id === "animalTracks") {
    flags.foundAnimalTracks = true;
    if (reaction.id === "followTracks" && !outcome.missedItemOpportunity) flags.followedAnimal = true;
    if (reaction.id === "offerFish" && outcome.itemSolution) flags.befriendedAnimal = true;
    if (favorable || (!outcome.missedItemOpportunity && ["followTracks", "measureTracks"].indexOf(reaction.id) !== -1)) flags.observedAnimal = true;
  } else if (eventDefinition.id === "forestFootsteps") {
    flags.heardStrangeFootsteps = true;
    if (flags.foundAnimalTracks && favorable) flags.observedAnimal = true;
    if (reaction.id === "holdCharm" && outcome.itemSolution) flags.supernaturalTrail = true;
  } else if (eventDefinition.id === "missingFood") {
    if (flags.foundAnimalTracks && ["rareBad", "bad"].indexOf(outcome.tier) === -1) flags.identifiedFoodThief = true;
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
    if (favorable && (flags.mappedFork || flags.repairedBridge)) flags.securedRoute = true;
  }
  trip.goalProgress = evaluateAdventureGoalProgress(trip);
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
  if (progress.stamina.value <= 0) {
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
  const snapshot = getAdventureProfileSnapshot();
  const eventDefinition = chooseNextAdventureEvent(snapshot);
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
  scheduleAdventureStep(function() { applyAdventureResolvedVisual(eventDefinition, outcome); }, 3150);
  scheduleAdventureStep(function() {
    const staminaBefore = ensureAdventureProgress().stamina.value;
    const consequenceResult = applyAdventureConsequences(eventDefinition, reaction, outcome);
    const effectMessages = consequenceResult.messages;
    const itemNotes = consequenceResult.itemNotes.concat(
      missingItemOpportunity ? [missingItemOpportunity.note] : [],
      carriedButUnusedNotes
    );
    const storyUpdate = updateAdventureEventFlags(eventDefinition, reaction, outcome, storyContext, trip);
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
      staminaBefore: staminaBefore,
      staminaAfter: ensureAdventureProgress().stamina.value
    };
    trip.events.push(eventLog);
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
    if (adventureAtmosphere) adventureAtmosphere.className = "adventure-atmosphere";
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

function resolveAdventureGoalResult(trip) {
  const progress = evaluateAdventureGoalProgress(trip);
  const hasUnexpectedDiscovery = trip.unlocked.length > 0 || Object.keys(trip.gained).length > 0 || trip.events.some(function(entry) {
    return entry.outcomeTier === "rareGood";
  });
  if (progress.status === "incomplete" && hasUnexpectedDiscovery) progress.status = "unexpected";
  return progress;
}

function applyAdventureGoalReward(trip, goalResult) {
  const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[trip.goalId];
  const progress = ensureAdventureProgress();
  const notes = [];
  if (goalResult.status !== "complete") return notes;
  if (goal.reward.type === "item") {
    const messages = [];
    grantAdventureItem(trip, goal.reward.itemId, goal.reward.quantity || 1, messages, [], notes);
    notes.unshift("目标奖励：" + messages.join("、"));
  } else if (goal.reward.type === "clue") {
    if (progress.discoveredClues.indexOf(goal.reward.clueId) === -1) {
      progress.discoveredClues.push(goal.reward.clueId);
      notes.push("收藏记录：" + goal.reward.label);
    } else {
      notes.push("已补充记录：" + goal.reward.label);
    }
  } else if (goal.reward.type === "unlock") {
    const messages = [];
    if (!unlockAdventureLocation(progress, trip, goal.reward.locationId, messages, notes)) {
      const surveyClue = "routeSurvey:" + trip.goalId;
      if (progress.discoveredClues.indexOf(surveyClue) === -1) progress.discoveredClues.push(surveyClue);
      notes.push("路线已解锁，本次勘察转为安全路线补充记录。");
    }
  }
  return notes;
}

function createAdventureStoryIntro(trip) {
  const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[trip.goalId];
  const route = DEEP_MOUNTAIN_ADVENTURE_ROUTES[trip.routeId];
  return "你沿着" + route.name + "进入深山，本次想要“" + goal.name + "”。" + route.description;
}

function createAdventureGoalEnding(trip, goalResult) {
  const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[trip.goalId];
  const flags = trip.eventFlags || {};
  if (goalResult.status !== "complete") return goal.endings[goalResult.status];
  if (trip.goalId === "investigateWhiteShadow") {
    if (flags.whiteShadowGuided) return "白影在浓雾中为你停下脚步，留下了一段能够再次辨认的隐蔽山路。";
    if (flags.supernaturalTrail) return "异常脚步与护符的回应互相印证，你确认白影并非普通雾气。";
  }
  if (trip.goalId === "findWatchtowerClue") {
    if (flags.archivedSealedLetter) return "木屋、旧锁与封蜡信件终于连成了一条清楚的旧瞭望塔路线。";
    return "旧设施上的锁具编号彼此吻合，你整理出一份可继续追查的瞭望塔勘察记录。";
  }
  if (trip.goalId === "findMissingRanger") {
    if (flags.completedRescue) return "你用绳组抵达受困位置并处理伤情，把护林员安全带回清楚山路。";
    if (flags.rangerTrusted) return "护林员认出木章并确认自己已经安全，同时交给你后续搜救所需的情报。";
  }
  if (trip.goalId === "investigateWildlife") {
    if (flags.identifiedFoodThief) return "脚印、兽径和被翻动的食物互相印证，你确认了动物在山中的活动范围。";
    if (flags.befriendedAnimal) return "动物接受了你留下的食物，并在不受惊扰的距离里短暂停留。";
    return "溪边脚印与树林里的动静互相吻合，你记录下动物移动的方向和安全距离。";
  }
  if (trip.goalId === "findSafeRoute") {
    if (flags.repairedBridge && flags.mappedFork) return "加固后的吊桥与手绘岔路接成了一条能够再次通行的安全路线。";
    if (flags.whiteShadowGuided) return "白影留下的停顿位置意外组成了一条避开险路的返程路线。";
    return "岔路标记与返程方向互相印证，你完成了这段山路的安全勘察。";
  }
  return goal.endings.complete;
}

function finishAdventureTrip(endReason, endLabel) {
  const trip = adventurePrototypeState.trip;
  if (!trip) return;
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  adventurePrototypeState.busy = false;
  const progress = ensureAdventureProgress();
  const goalResult = resolveAdventureGoalResult(trip);
  const rewardNotes = applyAdventureGoalReward(trip, goalResult);
  returnAdventureBackpackToStorage(trip.backpack);
  returnAdventureBackpackToStorage(trip.loot);
  progress.pendingBackpack = {};
  progress.pendingLoot = {};
  progress.completedTrips += 1;
  const highlight = chooseAdventureLogHighlight(trip.events);
  const log = {
    id: "deep-mountain-" + Date.now(),
    createdAt: Date.now(),
    locationId: "deepMountain",
    goalId: trip.goalId,
    routeId: trip.routeId,
    goalResult: goalResult.status,
    goalScore: goalResult.score,
    storyIntro: createAdventureStoryIntro(trip),
    storyBeats: trip.storyBeats.slice(),
    storyEnding: createAdventureGoalEnding(trip, goalResult),
    rewardNotes: rewardNotes,
    events: trip.events.slice(),
    departedWith: cloneAdventureCountMap(trip.departedWith),
    gained: cloneAdventureCountMap(trip.gained),
    lost: cloneAdventureCountMap(trip.lost),
    consumed: cloneAdventureCountMap(trip.consumed),
    unlocked: trip.unlocked.slice(),
    staminaStart: trip.staminaStart,
    staminaEnd: progress.stamina.value,
    endReason: endReason,
    endLabel: endLabel,
    highlightEventId: highlight ? highlight.eventId : ""
  };
  progress.lastLog = log;
  progress.recentAdventureHistory.push({
    goalId: trip.goalId,
    routeId: trip.routeId,
    eventIds: trip.events.map(function(entry) { return entry.eventId; }),
    outcomeType: goalResult.status,
    createdAt: log.createdAt
  });
  progress.recentAdventureHistory = progress.recentAdventureHistory.slice(-8);
  adventurePrototypeState.trip = null;
  saveGame();
  renderMainAdventureStorage();
  renderAdventureLog(log);
  setAdventureMode("log");
}

function formatAdventureLedger(countMap, emptyText) {
  const entries = getAdventureBackpackDisplayEntries(countMap);
  return entries.length ? entries.map(function(entry) { return formatAdventureEffectItem(entry.key, entry.count); }).join("、") : emptyText;
}

function renderAdventureLog(logSource) {
  const log = sanitizeAdventureLog(logSource) || sanitizeAdventureLog(ensureAdventureProgress().lastLog);
  if (!log) return;
  const location = ADVENTURE_LOCATION_CATALOG[log.locationId] || ADVENTURE_LOCATION_CATALOG.deepMountain;
  const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[log.goalId] || DEEP_MOUNTAIN_ADVENTURE_GOALS.investigateWhiteShadow;
  const route = DEEP_MOUNTAIN_ADVENTURE_ROUTES[log.routeId] || DEEP_MOUNTAIN_ADVENTURE_ROUTES.creekValley;
  const goalResultLabels = { complete: "完成", partial: "部分完成", incomplete: "未完成", unexpected: "意外发现" };
  const highlight = log.events.find(function(entry) { return entry.eventId === log.highlightEventId; }) || log.events[log.events.length - 1];
  const highlightDefinition = highlight && DEEP_MOUNTAIN_ADVENTURE_EVENTS.find(function(eventDefinition) { return eventDefinition.id === highlight.eventId; });
  if (adventureLogStatus) adventureLogStatus.textContent = log.endLabel;
  if (adventureLogLocation) adventureLogLocation.textContent = route.name;
  if (adventureLogEventCount) adventureLogEventCount.textContent = log.events.length + " / " + ADVENTURE_MAX_EVENTS_PER_TRIP;
  if (adventureLogStamina) {
    const delta = log.staminaEnd - log.staminaStart;
    adventureLogStamina.textContent = log.staminaStart + " → " + log.staminaEnd + " (" + (delta > 0 ? "+" : "") + delta + ")";
  }
  if (adventureLogEndReason) adventureLogEndReason.textContent = log.endLabel;
  if (adventureLogGoalStatus) {
    adventureLogGoalStatus.textContent = "目标：" + goal.name + " · " + goalResultLabels[log.goalResult];
    adventureLogGoalStatus.className = "adventure-goal-status is-" + log.goalResult;
  }
  if (adventureLogStoryTitle) adventureLogStoryTitle.textContent = goal.logTitle;
  if (adventureLogStoryIntro) adventureLogStoryIntro.textContent = log.storyIntro || ("你沿着" + route.name + "进入" + location.name + "。");
  if (adventureLogStoryBody) {
    adventureLogStoryBody.innerHTML = "";
    (log.storyBeats || []).forEach(function(beatText) {
      const paragraph = document.createElement("p");
      paragraph.textContent = beatText;
      adventureLogStoryBody.appendChild(paragraph);
    });
  }
  if (adventureLogStoryEnding) {
    adventureLogStoryEnding.textContent = (log.storyEnding || goal.endings[log.goalResult]) +
      (log.rewardNotes.length ? " " + log.rewardNotes.join(" ") : "");
  }
  if (adventureLogIllustrationCaption) adventureLogIllustrationCaption.textContent = highlight ? highlight.title + " · " + highlight.reactionType : "深山里的一个片刻";
  if (adventureLogIllustrationProp) {
    const propClass = highlightDefinition ? highlightDefinition.prop.className : "prop-sign";
    const position = ADVENTURE_PROP_SHEET_POSITIONS[propClass] || ADVENTURE_PROP_SHEET_POSITIONS["prop-sign"];
    adventureLogIllustrationProp.className = "adventure-log-illustration-prop " + propClass;
    adventureLogIllustrationProp.style.setProperty("--prop-position-x", position[0]);
    adventureLogIllustrationProp.style.setProperty("--prop-position-y", position[1]);
  }
  if (adventureLogIllustration) {
    adventureLogIllustration.style.setProperty("--journal-position-y", highlightDefinition && highlightDefinition.atmosphere ? "34%" : "48%");
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
  if (adventureLogGained) adventureLogGained.textContent = formatAdventureLedger(log.gained, "没有新物品");
  if (adventureLogLost) adventureLogLost.textContent = formatAdventureLedger(log.lost, "没有丢失物品");
  if (adventureLogConsumed) adventureLogConsumed.textContent = formatAdventureLedger(log.consumed, "没有消耗物品");
  if (adventureLogUnlocked) adventureLogUnlocked.textContent = log.unlocked.length ? log.unlocked.map(function(id) { return ADVENTURE_LOCATION_CATALOG[id].name; }).join("、") : "没有新路线";
}

function recoverInterruptedAdventureBackpack() {
  const progress = ensureAdventureProgress();
  if (adventurePrototypeState.trip || getAdventureCountTotal(progress.pendingBackpack) + getAdventureCountTotal(progress.pendingLoot) <= 0) return false;
  returnAdventureBackpackToStorage(progress.pendingBackpack);
  returnAdventureBackpackToStorage(progress.pendingLoot);
  progress.pendingBackpack = {};
  progress.pendingLoot = {};
  saveGame();
  return true;
}

function startAdventureTrip() {
  const progress = ensureAdventureProgress();
  const goal = DEEP_MOUNTAIN_ADVENTURE_GOALS[adventurePrototypeState.draftGoalId];
  const route = DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId];
  if (!goal || !route || !isDeepMountainRouteUnlocked(route, progress)) {
    setAdventurePrepMessage("请先选择一个可用目标和已解锁路线。", true);
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
  adventurePrototypeState.trip = {
    startedAt: Date.now(),
    staminaStart: staminaStart,
    staminaEventDelta: 0,
    goalId: goal.id,
    routeId: route.id,
    eventFlags: {},
    goalProgress: { score: 0, status: "incomplete" },
    storyBeats: [],
    backpack: cloneAdventureCountMap(selected),
    departedWith: cloneAdventureCountMap(selected),
    loot: {},
    gained: {},
    lost: {},
    consumed: {},
    unlocked: [],
    statuses: [],
    events: []
  };
  adventurePrototypeState.seenEventIds = [];
  adventurePrototypeState.pathIndex = 0;
  adventurePrototypeState.busy = false;
  adventurePrototypeState.draftBackpack = {};
  clearAdventureItemFeedback();
  saveGame();
  setAdventureMode("running");
  resetAdventureVisuals();
  setAdventureCamperPosition(ADVENTURE_PROTOTYPE_PATH_POINTS[0], false);
  playAdventureAction("idle");
  updateAdventureStatus(goal.name, "Camper 整理好背包，沿" + route.name + "出发。", "体力 -" + tripStaminaCost, true);
  updateAdventureRunHud();
  if (adventurePhaseLabel) adventurePhaseLabel.textContent = route.name + " · " + goal.name;
  scheduleAdventureStep(function() {
    setAdventureCamperPosition(ADVENTURE_PROTOTYPE_PATH_POINTS[1], true);
  }, 450);
  scheduleAdventureStep(function() {
    playAdventureAction("idle");
    triggerNextAdventureEvent();
  }, 2200);
}

function showAdventurePreparation(message) {
  clearAdventureTimers();
  clearAdventureItemFeedback();
  stopAdventureFrameAnimation();
  adventurePrototypeState.busy = false;
  adventurePrototypeState.draftBackpack = {};
  if (!DEEP_MOUNTAIN_ADVENTURE_GOALS[adventurePrototypeState.draftGoalId]) adventurePrototypeState.draftGoalId = "investigateWhiteShadow";
  const progress = ensureAdventureProgress();
  if (!DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId] ||
    !isDeepMountainRouteUnlocked(DEEP_MOUNTAIN_ADVENTURE_ROUTES[adventurePrototypeState.draftRouteId], progress)) {
    adventurePrototypeState.draftRouteId = getFirstUnlockedAdventureRouteId(progress);
  }
  setAdventureMode("preparing");
  setAdventurePrepMessage(message || "背包最多携带 5 件，途中发现的物品会另行收好。", false);
  renderAdventurePreparation();
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
  const recovered = recoverInterruptedAdventureBackpack();
  showAdventurePreparation(recovered ? "上次中断的携带物与途中发现已安全放回对应仓库。" : "背包最多携带 5 件，途中发现的物品会另行收好。");
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
  adventurePrototypeState.draftGoalId = "investigateWhiteShadow";
  adventurePrototypeState.draftRouteId = "creekValley";
  adventurePrototypeState.seenEventIds = [];
  saveGame();
  renderMainAdventureStorage();
  if (adventurePrototypeState.active) {
    showAdventurePreparation("测试状态已重置：体力已满，基础工具已补充。鱼和料理库存未重置。 ");
  }
  console.info("[Adventure Test] reset complete", gameState.adventure);
  return {
    stamina: gameState.adventure.stamina.value,
    storage: Object.assign({}, gameState.adventure.storage),
    command: "resetDeepMountainAdventureTest()"
  };
}

window.resetDeepMountainAdventureTest = resetDeepMountainAdventureTestState;

if (adventureStorageButton) adventureStorageButton.addEventListener("click", openMainAdventureStorage);
if (adventureStorageCloseButton) adventureStorageCloseButton.addEventListener("click", closeMainAdventureStorage);
if (adventureStorageLayer) adventureStorageLayer.addEventListener("click", function(event) {
  if (event.target === adventureStorageLayer) closeMainAdventureStorage();
});
if (settingsAdventurePrototypeItem) settingsAdventurePrototypeItem.addEventListener("click", openAdventurePrototype);
if (adventureStartButton) adventureStartButton.addEventListener("click", startAdventureTrip);
if (adventurePrepCloseButton) adventurePrepCloseButton.addEventListener("click", closeAdventurePrototypeLayer);
if (adventurePrepResetButton) adventurePrepResetButton.addEventListener("click", resetDeepMountainAdventureTestState);
if (adventureEndEarlyButton) adventureEndEarlyButton.addEventListener("click", function() { finishAdventureTrip("earlyReturn", "提前返回"); });
if (adventureAgainButton) adventureAgainButton.addEventListener("click", function() { showAdventurePreparation("上一趟物品已经结算回 Storage。 "); });
if (adventureLogExitButton) adventureLogExitButton.addEventListener("click", closeAdventurePrototypeLayer);
if (adventureLogResetButton) adventureLogResetButton.addEventListener("click", resetDeepMountainAdventureTestState);

document.addEventListener("keydown", function(event) {
  if (event.key !== "Escape") return;
  if (adventureStorageLayer && !adventureStorageLayer.classList.contains("hidden")) {
    closeMainAdventureStorage();
    return;
  }
  if (!adventurePrototypeState.active) return;
  if (adventurePrototypeState.mode === "running") {
    finishAdventureTrip("earlyReturn", "提前返回");
  } else {
    closeAdventurePrototypeLayer();
  }
});

window.addEventListener("load", renderMainAdventureStorage);

window.setInterval(function() {
  if (adventurePrototypeState.active && adventurePrototypeState.mode === "preparing") {
    renderAdventurePreparation();
  }
}, 60000);
