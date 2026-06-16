const SAVE_KEY = "cozyCampfireSave";
const APP_VERSION = typeof window !== "undefined" && window.APP_VERSION ? window.APP_VERSION : "2.5";

function withVersion(path) {
  const separator = path.includes("?") ? "&" : "?";
  return path + separator + "v=" + APP_VERSION;
}

function versionAssetPaths(value) {
  if (typeof value === "string") {
    return value.startsWith("assets/") ? withVersion(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map(versionAssetPaths);
  }

  if (value && typeof value === "object") {
    const versionedObject = {};

    Object.keys(value).forEach(function(key) {
      versionedObject[key] = versionAssetPaths(value[key]);
    });

    return versionedObject;
  }

  return value;
}

const gearCatalog = typeof window !== "undefined" && window.GEAR_CATALOG ? window.GEAR_CATALOG : {};
const shopGroupData = typeof window !== "undefined" && window.SHOP_GROUPS ? window.SHOP_GROUPS : {};
const legacyGearIdMap = typeof window !== "undefined" && window.LEGACY_GEAR_ID_MAP ? window.LEGACY_GEAR_ID_MAP : {};

function getGearItems() {
  return Object.keys(gearCatalog).map(function(id) {
    return gearCatalog[id];
  });
}

function getGearItem(id) {
  return id && gearCatalog[id] ? gearCatalog[id] : null;
}

function normalizeGearId(id) {
  return legacyGearIdMap[id] || id;
}

function getDefaultOwnedGearIds() {
  return getGearItems().filter(function(item) {
    return item.defaultOwned;
  }).map(function(item) {
    return item.id;
  });
}

function getDefaultEquippedGear() {
  const equipped = {};

  getGearItems().forEach(function(item) {
    if (item.defaultEquipped) {
      equipped[item.category] = item.id;
    }
  });

  return equipped;
}

// This object is the starting save file for a new player.
const defaultGameState = {
  cozyPoints: 0,
  comfort: 0,
  warmthSeconds: 0,
  campfireLevel: 1,
  ownedGear: getDefaultOwnedGearIds(),
  placedGear: [],
  equippedGear: getDefaultEquippedGear(),
  vehiclePlacementMigrated: true,
  nightUnlocked: false,
  isNight: false,
  gatherWoodMode: true,
  lastSaveTime: Date.now()
};

function createDefaultGameState() {
  return {
    ...defaultGameState,
    ownedGear: defaultGameState.ownedGear.slice(),
    placedGear: defaultGameState.placedGear.slice(),
    equippedGear: { ...defaultGameState.equippedGear },
    vehiclePlacementMigrated: defaultGameState.vehiclePlacementMigrated,
    lastSaveTime: Date.now()
  };
}

const campfireUpgradeCosts = {
  1: 45,
  2: 140
};

const campfireBaseRates = {
  1: 1,
  2: 2.2,
  3: 4
};

const campfireBurnRates = {
  1: 1,
  2: 0.85,
  3: 0.55
};

const baseOfflineSeconds = 1800;
const maxWoodItems = 5;
const camperFrameDurationMs = 200;
const camperSpriteRefreshMs = 100;

// All visual assets are listed here so art can be replaced without hunting
// through the game logic.
const assetPaths = versionAssetPaths({
  backgrounds: {
    campsiteDay: "assets/backgrounds/campsite_day.png",
    campsiteNight: "assets/backgrounds/campsite_night.png",
    lakeDay: "assets/backgrounds/lake_day.png",
    lakeNight: "assets/backgrounds/lake_night.png",
    treelineDay: "assets/backgrounds/treeline_day.png",
    treelineNight: "assets/backgrounds/treeline_night.png"
  },
  characters: {
    idle: "assets/characters/camper_idle.png",
    walk1: "assets/characters/camper_walk_01.png",
    walk2: "assets/characters/camper_walk_02.png",
    carry1: "assets/characters/camper_carry_wood _01.png",
    carry2: "assets/characters/camper_carry_wood _02.png",
    carry: "assets/characters/camper_carry_wood.png",
    sitGround: "assets/characters/camper_sit_ground.png",
    sitChair: "assets/characters/camper_sit_chair.png",
    lookLakeBack: "assets/characters/camper_look_lake_back.png",
    rest: "assets/characters/camper_rest.png"
  },
  campfire: {
    glow: "assets/campfire/glow_fire.png",
    spark: "assets/campfire/spark.png",
    base: {
      1: "assets/campfire/campfire_lv1_base.png",
      2: "assets/campfire/campfire_lv2_base.png",
      3: "assets/campfire/campfire_lv3_base.png"
    },
    flame1: {
      1: "assets/campfire/campfire_lv1_flame_01.png",
      2: "assets/campfire/campfire_lv2_flame_01.png",
      3: "assets/campfire/campfire_lv3_flame_01.png"
    },
    flame2: {
      1: "assets/campfire/campfire_lv1_flame_02.png",
      2: "assets/campfire/campfire_lv2_flame_02.png",
      3: "assets/campfire/campfire_lv3_flame_02.png"
    }
  },
  resources: {
    wood: "assets/resources/wood_item.png"
  },
  ui: {
    day: "assets/ui/icon_day.png",
    night: "assets/ui/icon_night.png"
  }
});

let gameState = createDefaultGameState();

// The camper is not saved. It is just the current animation state.
let camper = {
  x: 34,
  y: 75,
  state: "idle",
  pose: "idle",
  target: null,
  actionAfterArrival: null,
  currentAction: null,
  actionTimer: 0,
  targetWoodId: null,
  carryingWood: false,
  facing: "right",
  animationStartedAt: Date.now()
};

let woodItems = [];
let nextWoodId = 1;

// These variables connect JavaScript to the HTML.
const cozyPointsAmount = document.getElementById("cozyPointsAmount");
const comfortAmount = document.getElementById("comfortAmount");
const warmthSecondsAmount = document.getElementById("warmthSecondsAmount");
const cozyPointStatus = document.getElementById("cozyPointStatus");
const cozyGainLayer = document.getElementById("cozyGainLayer");
const welcomeMessage = document.getElementById("welcomeMessage");
const campScene = document.getElementById("campScene");
const sceneBackground = document.getElementById("sceneBackground");
const treelineImage = document.getElementById("treelineImage");
const lakeImage = document.getElementById("lakeImage");
const woodLayer = document.getElementById("woodLayer");
const sceneContent = document.getElementById("sceneContent");
const gearLayer = document.getElementById("gearLayer");
const campfire = document.getElementById("campfire");
const fireGlowImage = document.getElementById("fireGlowImage");
const campfireBaseImage = document.getElementById("campfireBaseImage");
const campfireFlameImage = document.getElementById("campfireFlameImage");
const camperElement = document.getElementById("camper");
const camperThoughtBubble = document.getElementById("camperThoughtBubble");
const camperStateText = document.getElementById("camperStateText");
const shopToggle = document.getElementById("shopToggle");
const shopDrawer = document.getElementById("shopDrawer");
const shopBackdrop = document.getElementById("shopBackdrop");
const closeShopButton = document.getElementById("closeShopButton");
const shopContent = document.getElementById("shopContent");
const shopTabsContainer = document.getElementById("shopTabs");
let shopTabs = [];
let shopSections = [];
let shopCards = {};
const gatherWoodToggle = document.getElementById("gatherWoodToggle");
const gatherModeLabel = document.getElementById("gatherModeLabel");
const dayNightToggle = document.getElementById("dayNightToggle");
const dayNightIcon = document.getElementById("dayNightIcon");
const dayNightLabel = document.getElementById("dayNightLabel");
const resetSaveButton = document.getElementById("resetSaveButton");
const campfireLevelAmount = document.getElementById("campfireLevelAmount");
const cozyRateAmount = document.getElementById("cozyRateAmount");
const offlineCapAmount = document.getElementById("offlineCapAmount");
const statusLine = document.getElementById("statusLine");

// These are points in the scene. The camper walks between them.
const campSpots = {
  fire: { x: 39, y: 79 },
  fireSeat: { x: 33, y: 80 },
  lake: { x: 25, y: 64 },
  tent: { x: 54, y: 69.5 },
  rest: { x: 24, y: 81 }
};

let activeShopFilter = "all";
let statusToastTimer = null;
let welcomeToastTimer = null;
let saveWasResetFromUrl = false;

const camperActionLabels = {
  idle: "Pausing around camp",
  wandering: "Wandering around camp",
  movingToWood: "Walking over to fallen wood",
  pickupWood: "Picking up wood",
  carryingWoodToFire: "Carrying wood to the campfire",
  addingWoodToFire: "Adding wood to the fire",
  resting: "Resting in the quiet grass",
  lookingAtLake: "Looking across the lake",
  sittingByFire: "Sitting by the campfire",
  sittingOnFurniture: "Settling into camp seating",
  sittingOnChair: "Settling into the camp chair",
  tentRest: "Resting inside the tent"
};

const camperThoughtLines = {
  wandering: "\u968f\u4fbf\u8d70\u8d70--",
  lookingAtLake: "\u770b\u770b\u6e56\u5427",
  sittingByFire: "\u70e4\u4f1a\u513f\u706b\u5427",
  sittingOnFurniture: "\u5750\u4e00\u4f1a\u513f",
  sittingOnChair: "\u5750\u4e00\u4f1a\u513f",
  resting: "\u5c0f\u772f\u4e00\u4f1a\u513f",
  tentRest: "\u94bb\u8fdb\u5e10\u7bf7--"
};

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function formatNumber(number) {
  const safeNumber = Number.isFinite(number) ? number : 0;

  if (safeNumber < 100) {
    return safeNumber.toLocaleString(undefined, {
      maximumFractionDigits: 1
    });
  }

  return Math.floor(safeNumber).toLocaleString();
}

function formatShortTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) {
    return hours + "h " + minutes + "m";
  }

  if (safeSeconds < 60) {
    return safeSeconds + "s";
  }

  return minutes + " min";
}

function showToast(element, message, duration, timerName) {
  if (!element || !message) {
    return;
  }

  element.textContent = message;
  element.classList.add("show");

  if (timerName === "welcome") {
    clearTimeout(welcomeToastTimer);
    welcomeToastTimer = setTimeout(function() {
      element.classList.remove("show");
    }, duration);
    return;
  }

  clearTimeout(statusToastTimer);
  statusToastTimer = setTimeout(function() {
    element.classList.remove("show");
  }, duration);
}

function showWelcome(message) {
  showToast(welcomeMessage, message, 3600, "welcome");
}

function setStatus(message) {
  showToast(statusLine, message, 2400, "status");
}

function resetSaveIfRequestedByUrl() {
  const query = new URLSearchParams(window.location.search);

  if (query.get("reset") === "1") {
    localStorage.removeItem(SAVE_KEY);
    saveWasResetFromUrl = true;
  }
}

function addUniqueGear(ownedGear, id) {
  const normalizedId = normalizeGearId(id);

  if (getGearItem(normalizedId) && ownedGear.indexOf(normalizedId) === -1) {
    ownedGear.push(normalizedId);
  }
}

function addUniquePlacedGear(placedGear, id) {
  const normalizedId = normalizeGearId(id);
  const item = getGearItem(normalizedId);

  if (item && isGearPlaceable(item) && placedGear.indexOf(normalizedId) === -1) {
    placedGear.push(normalizedId);
  }
}

function ownsGear(id, state) {
  const campState = state || gameState;
  const normalizedId = normalizeGearId(id);

  return Array.isArray(campState.ownedGear) && campState.ownedGear.indexOf(normalizedId) !== -1;
}

function isGearPlaced(id, state) {
  const campState = state || gameState;
  const normalizedId = normalizeGearId(id);

  return Array.isArray(campState.placedGear) && campState.placedGear.indexOf(normalizedId) !== -1;
}

function removePlacedGear(id) {
  const normalizedId = normalizeGearId(id);

  gameState.placedGear = (gameState.placedGear || []).filter(function(placedId) {
    return placedId !== normalizedId;
  });
}

function getOwnedGearItems(state) {
  const campState = state || gameState;

  return (campState.ownedGear || []).map(function(id) {
    return getGearItem(id);
  }).filter(Boolean);
}

function ownsAnyGearInCategory(category, state) {
  return getOwnedGearItems(state).some(function(item) {
    return item.category === category;
  });
}

function getEquippedGearId(category, state) {
  const campState = state || gameState;
  return campState.equippedGear && campState.equippedGear[category] ? campState.equippedGear[category] : null;
}

function getEquippedGearItem(category, state) {
  return getGearItem(getEquippedGearId(category, state));
}

function getRequirementLabel(requirement) {
  if (getGearItem(requirement)) {
    return getGearItem(requirement).displayName;
  }

  return String(requirement);
}

function getMissingGearRequirements(item, state) {
  const campState = state || gameState;
  const missing = [];
  const requires = item && item.requires ? item.requires : {};

  if (Array.isArray(requires)) {
    requires.forEach(function(requiredId) {
      if (!ownsGear(requiredId, campState)) {
        missing.push(getRequirementLabel(requiredId));
      }
    });
  }

  (requires.all || []).forEach(function(requiredId) {
    if (!ownsGear(requiredId, campState)) {
      missing.push(getRequirementLabel(requiredId));
    }
  });

  (requires.anyOwnedCategory || []).forEach(function(category) {
    if (!ownsAnyGearInCategory(category, campState)) {
      missing.push("Requires " + category);
    }
  });

  if (Array.isArray(requires.any) && requires.any.length > 0) {
    const hasAny = requires.any.some(function(requiredId) {
      return ownsGear(requiredId, campState);
    });

    if (!hasAny) {
      missing.push("Requires " + requires.any.map(getRequirementLabel).join(" or "));
    }
  }

  return missing;
}

function hasNightUnlock(state) {
  return getOwnedGearItems(state).some(function(item) {
    return item.unlocks && item.unlocks.nightMode;
  });
}

function isTentItem(item) {
  return Boolean(item && item.category === "tent");
}

function isTarpItem(item) {
  return Boolean(item && item.category === "tarp");
}

function isVehicleItem(item) {
  return Boolean(item && item.category === "vehicle");
}

function isRooftopTentItem(item) {
  return Boolean(item && item.id === "rooftopTent");
}

function isEquippableGear(item) {
  return Boolean(item && (isTentItem(item) || isTarpItem(item) || isVehicleItem(item)));
}

function isGearPlaceable(item) {
  if (!item || item.interactions && item.interactions.upgradeCampfire) {
    return false;
  }

  if (isVehicleItem(item)) {
    return Boolean(item.scene);
  }

  if (isTentItem(item) || isTarpItem(item)) {
    return false;
  }

  return Boolean(item.scene || item.attachment);
}

function isCurrentRooftopTentEquipped(state) {
  return getEquippedGearId("tent", state || gameState) === "rooftopTent";
}

function isGearVisibleInShop(item) {
  const group = item && shopGroupData[item.shopGroup];

  return Boolean(item && group && group.visible !== false);
}

function calculateComfort(state) {
  let comfort = 0;

  getOwnedGearItems(state).forEach(function(item) {
    if (isEquippableGear(item) && getEquippedGearId(item.category, state) !== item.id) {
      return;
    }

    comfort += Number(item.comfort) || 0;
  });

  return comfort;
}

function getComfortMultiplier() {
  return 1 + gameState.comfort * 0.025;
}

function getCozyPointsPerSecond() {
  return campfireBaseRates[gameState.campfireLevel] * getComfortMultiplier();
}

function getWarmthBurnRate() {
  return campfireBurnRates[gameState.campfireLevel];
}

function getWarmthAutoRestore() {
  if (gameState.campfireLevel >= 3) {
    return 0.15;
  }

  return 0;
}

function getNetWarmthBurnRate() {
  return Math.max(0.1, getWarmthBurnRate() - getWarmthAutoRestore());
}

function getWoodWarmthValue() {
  return 18 + gameState.campfireLevel * 6;
}

function getOfflineCapSeconds() {
  const tentItem = getEquippedGearItem("tent");
  return baseOfflineSeconds + (tentItem && Number(tentItem.offlineBonusSeconds) || 0);
}

function getCampfireUpgradeCost() {
  return campfireUpgradeCosts[gameState.campfireLevel] || 0;
}

function getCampfireShopImage() {
  const displayLevel = Math.min(gameState.campfireLevel + 1, 3);
  return assetPaths.campfire.base[displayLevel] || assetPaths.campfire.base[gameState.campfireLevel];
}

function getCurrentFlameImage() {
  const flameSet = Math.floor(Date.now() / 450) % 2 === 0 ? assetPaths.campfire.flame1 : assetPaths.campfire.flame2;
  return flameSet[gameState.campfireLevel];
}

function saveGame() {
  gameState.lastSaveTime = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function resetCamperForNewGame() {
  camper = {
    x: 34,
    y: 75,
    state: "idle",
    pose: "idle",
    target: null,
    actionAfterArrival: null,
    currentAction: null,
    actionTimer: 0,
    targetWoodId: null,
    carryingWood: false,
    facing: "right",
    animationStartedAt: Date.now()
  };
}

function resetGameToFreshStart(message) {
  localStorage.removeItem(SAVE_KEY);
  gameState = createDefaultGameState();
  gameState.comfort = calculateComfort();
  woodItems = [];
  nextWoodId = 1;
  woodLayer.innerHTML = "";

  resetCamperForNewGame();
  closeShop();
  spawnWood();
  spawnWood();
  setShopFilter(activeShopFilter);
  updateScreen();
  updateCamperView();
  chooseNextCamperAction();
  saveGame();
  showWelcome(message || "Save reset. Camp starts fresh.");
}

function confirmResetSave() {
  const shouldReset = window.confirm("Reset this local save and start a fresh camp?");

  if (shouldReset) {
    resetGameToFreshStart("Save reset. Camp starts fresh.");
  }
}

function sanitizeSave(savedGame) {
  const cleanState = createDefaultGameState();

  // This gently migrates the Version 1 save shape if it exists.
  if (savedGame && savedGame.warmth !== undefined && savedGame.warmthSeconds === undefined) {
    cleanState.warmthSeconds = savedGame.warmth;
  }

  if (savedGame && savedGame.lastSavedTime !== undefined && savedGame.lastSaveTime === undefined) {
    cleanState.lastSaveTime = savedGame.lastSavedTime;
  }

  if (savedGame) {
    cleanState.cozyPoints = savedGame.cozyPoints;
    if (savedGame.warmthSeconds !== undefined) {
      cleanState.warmthSeconds = savedGame.warmthSeconds;
    }
    cleanState.campfireLevel = savedGame.campfireLevel;
    cleanState.nightUnlocked = savedGame.nightUnlocked;
    cleanState.isNight = savedGame.isNight;
    cleanState.gatherWoodMode = savedGame.gatherWoodMode;
    cleanState.vehiclePlacementMigrated = Boolean(savedGame.vehiclePlacementMigrated);
    if (savedGame.lastSaveTime !== undefined) {
      cleanState.lastSaveTime = savedGame.lastSaveTime;
    }
  }

  const ownedGear = getDefaultOwnedGearIds();

  if (savedGame && Array.isArray(savedGame.ownedGear)) {
    savedGame.ownedGear.forEach(function(id) {
      addUniqueGear(ownedGear, id);
    });
  }

  if (savedGame && Array.isArray(savedGame.ownedTentTypes)) {
    savedGame.ownedTentTypes.forEach(function(type) {
      addUniqueGear(ownedGear, type);
    });
  }

  if (savedGame && savedGame.tentType !== undefined) {
    addUniqueGear(ownedGear, savedGame.tentType);
  }

  if (savedGame && savedGame.currentTentType !== undefined) {
    addUniqueGear(ownedGear, savedGame.currentTentType);
  }

  if (savedGame && Array.isArray(savedGame.ownedEquipment)) {
    savedGame.ownedEquipment.forEach(function(type) {
      addUniqueGear(ownedGear, type);
    });
  }

  const oldEquipmentFields = {
    hasChair: "chair",
    hasLantern: "lantern",
    hasTable: "table",
    hasKettle: "kettle",
    hasAxe: "axe",
    hasStove: "stove",
    hasStringLights: "stringLights"
  };

  Object.keys(oldEquipmentFields).forEach(function(fieldName) {
    if (savedGame && savedGame[fieldName]) {
      addUniqueGear(ownedGear, oldEquipmentFields[fieldName]);
    }
  });

  const savedPlacedGear = savedGame && Array.isArray(savedGame.placedGear) ? savedGame.placedGear.map(normalizeGearId) : [];

  cleanState.ownedGear = ownedGear;
  cleanState.placedGear = [];

  if (savedPlacedGear.length > 0) {
    savedPlacedGear.forEach(function(normalizedId) {
      if (ownedGear.indexOf(normalizedId) !== -1) {
        addUniquePlacedGear(cleanState.placedGear, normalizedId);
      }
    });
  } else if (savedGame) {
    ownedGear.forEach(function(id) {
      const item = getGearItem(id);

      if (item && isGearPlaceable(item)) {
        addUniquePlacedGear(cleanState.placedGear, id);
      }
    });
  }

  cleanState.equippedGear = { ...getDefaultEquippedGear() };

  if (savedGame && savedGame.equippedGear) {
    Object.keys(savedGame.equippedGear).forEach(function(category) {
      const normalizedId = normalizeGearId(savedGame.equippedGear[category]);

      if (ownedGear.indexOf(normalizedId) !== -1 && getGearItem(normalizedId)) {
        cleanState.equippedGear[category] = normalizedId;
      }
    });
  }

  const savedTentId = savedGame && (savedGame.currentTentType || savedGame.tentType);

  if (savedTentId) {
    const normalizedTentId = normalizeGearId(savedTentId);

    if (ownedGear.indexOf(normalizedTentId) !== -1 && getGearItem(normalizedTentId)) {
      cleanState.equippedGear.tent = normalizedTentId;
    }
  }

  if (!getGearItem(cleanState.equippedGear.tent) || ownedGear.indexOf(cleanState.equippedGear.tent) === -1) {
    cleanState.equippedGear.tent = defaultGameState.equippedGear.tent;
  }

  if (cleanState.equippedGear.tarp) {
    const equippedTarp = getGearItem(cleanState.equippedGear.tarp);

    if (!equippedTarp || !isTarpItem(equippedTarp) || ownedGear.indexOf(equippedTarp.id) === -1) {
      delete cleanState.equippedGear.tarp;
    }
  }

  if (!cleanState.equippedGear.tarp) {
    const placedTarpId = savedPlacedGear.find(function(id) {
      const item = getGearItem(id);
      return item && isTarpItem(item) && ownedGear.indexOf(id) !== -1;
    });

    if (placedTarpId) {
      cleanState.equippedGear.tarp = placedTarpId;
    }
  }

  if (cleanState.equippedGear.vehicle) {
    const equippedVehicle = getGearItem(cleanState.equippedGear.vehicle);

    if (!equippedVehicle || !isVehicleItem(equippedVehicle) || ownedGear.indexOf(equippedVehicle.id) === -1) {
      delete cleanState.equippedGear.vehicle;
    }
  }

  if (!cleanState.vehiclePlacementMigrated && cleanState.equippedGear.vehicle) {
    addUniquePlacedGear(cleanState.placedGear, cleanState.equippedGear.vehicle);
    cleanState.vehiclePlacementMigrated = true;
  }

  if (cleanState.equippedGear.tent === "rooftopTent") {
    if (!cleanState.equippedGear.vehicle) {
      const ownedVehicle = ownedGear.find(function(id) {
        return isVehicleItem(getGearItem(id));
      });

      if (ownedVehicle) {
        cleanState.equippedGear.vehicle = ownedVehicle;
      }
    }

    if (cleanState.equippedGear.vehicle) {
      addUniquePlacedGear(cleanState.placedGear, cleanState.equippedGear.vehicle);
    }
  }

  cleanState.cozyPoints = Math.max(0, Number(cleanState.cozyPoints) || 0);
  cleanState.warmthSeconds = Math.max(0, Number(cleanState.warmthSeconds) || 0);
  cleanState.campfireLevel = clamp(Number(cleanState.campfireLevel) || 1, 1, 3);
  cleanState.nightUnlocked = Boolean(cleanState.nightUnlocked || hasNightUnlock(cleanState));
  cleanState.isNight = Boolean(cleanState.isNight && cleanState.nightUnlocked);
  cleanState.gatherWoodMode = cleanState.gatherWoodMode !== false;
  cleanState.lastSaveTime = Number(cleanState.lastSaveTime) || Date.now();
  cleanState.comfort = calculateComfort(cleanState);

  return cleanState;
}

function loadGame() {
  const savedText = localStorage.getItem(SAVE_KEY);

  if (!savedText) {
    gameState.comfort = calculateComfort();
    if (saveWasResetFromUrl) {
      showWelcome("Save reset. A quiet day begins beside the lake.");
    } else {
      showWelcome("A quiet day begins beside the lake.");
    }
    return;
  }

  try {
    gameState = sanitizeSave(JSON.parse(savedText));
    applyOfflineEarnings();
    saveGame();
  } catch (error) {
    gameState = createDefaultGameState();
    gameState.comfort = calculateComfort();
    showWelcome("The save was reset, so camp starts fresh.");
  }
}

function applyOfflineEarnings() {
  const now = Date.now();
  const secondsAway = Math.max(0, Math.floor((now - gameState.lastSaveTime) / 1000));
  const offlineCap = getOfflineCapSeconds();
  const netBurnRate = getNetWarmthBurnRate();
  const possibleFireSeconds = gameState.warmthSeconds / netBurnRate;
  const activeSeconds = Math.min(secondsAway, offlineCap, possibleFireSeconds);

  if (activeSeconds > 0) {
    const earnedPoints = activeSeconds * getCozyPointsPerSecond();
    gameState.cozyPoints += earnedPoints;
    gameState.warmthSeconds = Math.max(0, gameState.warmthSeconds - activeSeconds * netBurnRate);
    showWelcome("Welcome back: +" + formatNumber(earnedPoints) + " Cozy Points from " + formatShortTime(activeSeconds) + " of firelight.");
  } else if (secondsAway > 60) {
    showWelcome("Welcome back. The campfire is waiting for more wood.");
  }

  gameState.lastSaveTime = now;
}

function updateScreen() {
  gameState.comfort = calculateComfort();

  cozyPointsAmount.textContent = formatNumber(gameState.cozyPoints);
  comfortAmount.textContent = formatNumber(gameState.comfort);
  warmthSecondsAmount.textContent = Math.floor(gameState.warmthSeconds).toLocaleString();
  campfireLevelAmount.textContent = gameState.campfireLevel;
  cozyRateAmount.textContent = formatNumber(getCozyPointsPerSecond());
  offlineCapAmount.textContent = formatShortTime(getOfflineCapSeconds());

  document.body.classList.toggle("night", gameState.isNight);
  document.body.classList.toggle("day", !gameState.isNight);

  gatherWoodToggle.classList.toggle("active", gameState.gatherWoodMode);
  gatherModeLabel.textContent = gameState.gatherWoodMode ? "On" : "Off";

  dayNightToggle.classList.toggle("hidden", !gameState.nightUnlocked);
  dayNightLabel.textContent = gameState.isNight ? "Day" : "Night";

  updateShopCards();
  updateSceneEquipment();
}

function getShopGroupsInOrder() {
  return Object.keys(shopGroupData).filter(function(groupId) {
    const group = shopGroupData[groupId];
    return group && group.visible !== false;
  });
}

function getShopItemsForGroup(groupId) {
  return getGearItems().filter(function(item) {
    return isGearVisibleInShop(item) && item.shopGroup === groupId;
  });
}

function createShopIcon(src) {
  const image = document.createElement("img");
  image.src = withVersion(src);
  image.alt = "";
  return image;
}

function createShopTab(groupId, group) {
  const button = document.createElement("button");
  button.className = "shop-tab";
  button.type = "button";
  button.setAttribute("data-shop-filter", groupId);
  button.appendChild(createShopIcon(group.icon || "assets/ui/icon_tools.png"));

  const label = document.createElement("span");
  label.textContent = group.label;
  button.appendChild(label);

  button.addEventListener("click", function() {
    setShopFilter(groupId);
  });

  return button;
}

function createGearShopCard(item) {
  const button = document.createElement("button");
  button.className = item.interactions && item.interactions.upgradeCampfire ? "shop-card featured" : "shop-card";
  button.type = "button";
  button.setAttribute("data-gear-id", item.id);

  const image = document.createElement("img");
  image.className = "item-art";
  image.src = withVersion(item.image);
  image.alt = "";
  button.appendChild(image);

  const copy = document.createElement("span");
  copy.className = "item-copy";

  const name = document.createElement("span");
  name.className = "item-name";
  name.textContent = item.displayName;
  copy.appendChild(name);

  const detail = document.createElement("span");
  detail.className = "item-detail";
  detail.textContent = item.detail;
  copy.appendChild(detail);

  button.appendChild(copy);

  const action = document.createElement("strong");
  action.className = "item-action";
  action.textContent = "Buy";
  button.appendChild(action);

  button.addEventListener("click", function() {
    handleGearAction(item.id);
  });

  shopCards[item.id] = {
    button: button,
    actionLabel: action,
    detailLabel: detail,
    image: image
  };

  return button;
}

function createShopSection(groupId, group) {
  const section = document.createElement("section");
  section.className = "shop-section";
  section.setAttribute("data-shop-group", groupId);
  section.setAttribute("aria-label", group.label + " shop");

  const heading = document.createElement("h2");
  heading.appendChild(createShopIcon(group.icon || "assets/ui/icon_tools.png"));
  heading.appendChild(document.createTextNode(" " + group.label));
  section.appendChild(heading);

  getShopItemsForGroup(groupId).forEach(function(item) {
    section.appendChild(createGearShopCard(item));
  });

  return section;
}

function renderShopFromCatalog() {
  shopCards = {};
  shopTabsContainer.innerHTML = "";
  shopContent.innerHTML = "";

  const allTab = createShopTab("all", {
    label: "All",
    icon: "assets/ui/icon_tools.png"
  });
  allTab.classList.add("active");
  shopTabsContainer.appendChild(allTab);

  getShopGroupsInOrder().forEach(function(groupId) {
    const group = shopGroupData[groupId];
    shopTabsContainer.appendChild(createShopTab(groupId, group));
    shopContent.appendChild(createShopSection(groupId, group));
  });

  shopTabs = Array.prototype.slice.call(shopTabsContainer.querySelectorAll(".shop-tab"));
  shopSections = Array.prototype.slice.call(shopContent.querySelectorAll(".shop-section"));
}

function updateCampfireShopCard(item, card) {
  card.image.src = getCampfireShopImage();

  if (gameState.campfireLevel >= 3) {
    card.button.disabled = true;
    card.button.classList.add("owned", "action-equipped");
    card.button.classList.remove("locked", "equipped", "placed", "action-buy", "action-place", "action-pack", "action-equip", "action-locked");
    card.detailLabel.textContent = "Lv 3 complete";
    card.actionLabel.textContent = "MAX";
    card.button.setAttribute("data-price", "MAX");
    return;
  }

  const cost = getCampfireUpgradeCost();
  card.button.disabled = gameState.cozyPoints < cost;
  card.button.classList.add("action-buy");
  card.button.classList.remove("owned", "locked", "equipped", "placed", "action-place", "action-pack", "action-equip", "action-equipped", "action-locked");
  card.detailLabel.textContent = gameState.campfireLevel === 1 ? "Lv 2 fire pit" : "Lv 3 ember stove";
  card.actionLabel.textContent = "UPGRADE";
  card.button.setAttribute("data-price", cost + "CP");
}

function updateVehicleShopCard(item, card, isOwned, isEquipped, isPlaced, isLocked) {
  const rooftopMounted = isCurrentRooftopTentEquipped() && isEquipped && isPlaced;

  if (isEquipped && isPlaced) {
    if (rooftopMounted) {
      card.button.disabled = true;
      card.button.classList.add("action-equipped");
      card.actionLabel.textContent = "MOUNTED";
      card.button.setAttribute("data-price", "ROOF");
      card.detailLabel.textContent = "Rooftop tent mounted";
      return true;
    }

    card.button.disabled = false;
    card.button.classList.add("action-pack");
    card.actionLabel.textContent = "STOW";
    card.button.setAttribute("data-price", "PLACED");
    return true;
  }

  if (isEquipped && isOwned) {
    card.button.disabled = false;
    card.button.classList.add("action-place");
    card.actionLabel.textContent = "PLACE";
    card.button.setAttribute("data-price", "OWNED");
    return true;
  }

  if (isOwned) {
    card.button.disabled = false;
    card.button.classList.add("action-equip");
    card.actionLabel.textContent = "EQUIP";
    card.button.setAttribute("data-price", "0CP");
    return true;
  }

  if (isLocked) {
    card.button.disabled = true;
    card.button.classList.add("action-locked");
    card.actionLabel.textContent = "LOCKED";
    card.button.setAttribute("data-price", "?CP");
    return true;
  }

  card.button.disabled = gameState.cozyPoints < item.cost;
  card.button.classList.add("action-buy");
  card.actionLabel.textContent = "BUY";
  card.button.setAttribute("data-price", item.cost + "CP");
  return true;
}

function updateGearShopCard(item) {
  const card = shopCards[item.id];

  if (!card) {
    return;
  }

  card.image.src = withVersion(item.image);

  if (item.interactions && item.interactions.upgradeCampfire) {
    updateCampfireShopCard(item, card);
    return;
  }

  const isOwned = ownsGear(item.id);
  const isEquipped = isEquippableGear(item) && getEquippedGearId(item.category) === item.id;
  const isPlaceable = isGearPlaceable(item);
  const isPlaced = isPlaceable && isGearPlaced(item.id);
  const missingRequirements = getMissingGearRequirements(item);
  const isLocked = missingRequirements.length > 0;

  card.button.classList.toggle("owned", isOwned);
  card.button.classList.toggle("equipped", isEquipped);
  card.button.classList.toggle("placed", isPlaced);
  card.button.classList.toggle("locked", isLocked && !isOwned);
  card.button.classList.remove("action-buy", "action-place", "action-pack", "action-equip", "action-equipped", "action-locked");
  card.detailLabel.textContent = isLocked && !isOwned ? missingRequirements.join(", ") : item.detail;

  if (isVehicleItem(item) && updateVehicleShopCard(item, card, isOwned, isEquipped, isPlaced, isLocked)) {
    return;
  }

  if (isEquipped) {
    card.button.disabled = true;
    card.button.classList.add("action-equipped");
    card.actionLabel.textContent = "EQUIPPED";
    card.button.setAttribute("data-price", "0CP");
  } else if (isOwned && isEquippableGear(item)) {
    card.button.disabled = false;
    card.button.classList.add("action-equip");
    card.actionLabel.textContent = "EQUIP";
    card.button.setAttribute("data-price", "0CP");
  } else if (isOwned && isPlaceable && isPlaced) {
    card.button.disabled = false;
    card.button.classList.add("action-pack");
    card.actionLabel.textContent = "PACK";
    card.button.setAttribute("data-price", "PLACED");
  } else if (isOwned && isPlaceable) {
    card.button.disabled = false;
    card.button.classList.add("action-place");
    card.actionLabel.textContent = "PLACE";
    card.button.setAttribute("data-price", "OWNED");
  } else if (isOwned) {
    card.button.disabled = true;
    card.button.classList.add("action-equipped");
    card.actionLabel.textContent = "OWNED";
    card.button.setAttribute("data-price", "0CP");
  } else if (isLocked) {
    card.button.disabled = true;
    card.button.classList.add("action-locked");
    card.actionLabel.textContent = "LOCKED";
    card.button.setAttribute("data-price", "?CP");
  } else {
    card.button.disabled = gameState.cozyPoints < item.cost;
    card.button.classList.add("action-buy");
    card.actionLabel.textContent = "BUY";
    card.button.setAttribute("data-price", item.cost + "CP");
  }
}

function updateShopCards() {
  getGearItems().forEach(updateGearShopCard);
}

function setVersionedLayerSource(image, path) {
  if (image && path) {
    image.src = withVersion(path);
  }
}

function ensureLayerImage(element, className) {
  let image = element.querySelector("." + className);

  if (!image) {
    image = document.createElement("img");
    image.className = "object-image gear-layer " + className;
    image.alt = "";
    element.appendChild(image);
  }

  return image;
}

function getGearSceneElementId(item) {
  return "gear-" + item.id;
}

function getGearFrontElementId(item) {
  return "gear-" + item.id + "-front";
}

function getGearSceneElement(item) {
  if (!item || !item.scene) {
    return null;
  }

  if (item.scene.renderMode === "campfire") {
    return campfire;
  }

  return document.getElementById(getGearSceneElementId(item));
}

function getOrCreateGearSceneElement(item) {
  let element = getGearSceneElement(item);

  if (!element && item.scene && gearLayer) {
    element = document.createElement("div");
    element.id = getGearSceneElementId(item);
    element.className = "gear-object asset-object hidden";
    element.setAttribute("aria-label", item.displayName);
    gearLayer.appendChild(element);
  }

  return element;
}

function getOrCreateGearFrontElement(item) {
  const frontElementId = getGearFrontElementId(item);
  let frontElement = document.getElementById(frontElementId);

  if (!frontElement && gearLayer) {
    frontElement = document.createElement("div");
    frontElement.id = frontElementId;
    frontElement.className = "gear-front-layer asset-object hidden";
    frontElement.setAttribute("aria-hidden", "true");
    gearLayer.appendChild(frontElement);
  }

  return frontElement;
}

function getSceneSpriteSize(item) {
  const scene = item && item.scene ? item.scene : {};

  return scene.spriteSize || item && item.spriteSize || { width: 80, height: 80 };
}

function getSceneGroundAnchor(item) {
  const spriteSize = getSceneSpriteSize(item);
  const anchors = item && item.anchors ? item.anchors : {};
  const scene = item && item.scene ? item.scene : {};

  return scene.anchor || anchors.ground || { x: spriteSize.width / 2, y: spriteSize.height };
}

function getCurrentVehicleItem(state) {
  return getEquippedGearItem("vehicle", state || gameState);
}

function isVehiclePlaced(item, state) {
  return Boolean(item && isVehicleItem(item) && getEquippedGearId("vehicle", state || gameState) === item.id && isGearPlaced(item.id, state));
}

function getScenePointFromSpritePoint(item, point) {
  const spriteSize = getSceneSpriteSize(item);
  const groundAnchor = getSceneGroundAnchor(item);
  const scene = item.scene || {};
  const position = scene.position || { x: 0, y: 0 };
  const widthPercent = scene.widthPercent || 0;
  const sceneWidthToHeightRatio = getSceneWidthToHeightRatio();

  return {
    x: position.x + ((point.x - groundAnchor.x) / spriteSize.width) * widthPercent,
    y: position.y + ((point.y - groundAnchor.y) / spriteSize.width) * widthPercent * sceneWidthToHeightRatio
  };
}

function getVehicleRoofMount(vehicleItem) {
  const spriteSize = getSceneSpriteSize(vehicleItem);
  const scene = vehicleItem && vehicleItem.scene ? vehicleItem.scene : {};

  return scene.roofMount || {
    x: spriteSize.width / 2,
    y: spriteSize.height * 0.34,
    widthPercent: (scene.widthPercent || 0) * 0.74,
    zIndex: (scene.zIndex || 14) + 2
  };
}

function getRooftopTentLayout(item) {
  if (!isRooftopTentItem(item)) {
    return null;
  }

  const vehicleItem = getCurrentVehicleItem();

  if (!isVehiclePlaced(vehicleItem)) {
    return null;
  }

  const mount = getVehicleRoofMount(vehicleItem);
  const position = getScenePointFromSpritePoint(vehicleItem, mount);

  return {
    position: position,
    widthPercent: mount.widthPercent || item.scene.widthPercent,
    zIndex: mount.zIndex || item.scene.zIndex || 16
  };
}

function getSceneLayoutOverride(item) {
  if (item && item.scene && item.scene.mountTo === "vehicleRoof") {
    return getRooftopTentLayout(item);
  }

  return null;
}

function applyGearSceneLayout(element, item, zIndex) {
  const spriteSize = getSceneSpriteSize(item);
  const groundAnchor = getSceneGroundAnchor(item);
  const scene = item.scene || {};
  const layoutOverride = getSceneLayoutOverride(item);
  const position = layoutOverride && layoutOverride.position || scene.position || { x: 0, y: 0 };
  const widthPercent = layoutOverride && layoutOverride.widthPercent || scene.widthPercent || 0;

  element.style.left = position.x + "%";
  element.style.top = position.y + "%";
  element.style.width = widthPercent + "%";
  element.style.aspectRatio = scene.aspectRatio || spriteSize.width + " / " + spriteSize.height;
  element.style.zIndex = layoutOverride && layoutOverride.zIndex || zIndex;
  element.style.setProperty("--object-anchor-x", -groundAnchor.x / spriteSize.width * 100 + "%");
  element.style.setProperty("--object-anchor-y", -groundAnchor.y / spriteSize.height * 100 + "%");
  element.style.setProperty("--object-scale-x", scene.mirrored ? "-1" : "1");
}

function updateGearSceneElement(item) {
  if (!item.scene || item.scene.renderMode === "campfire") {
    return;
  }

  const element = getOrCreateGearSceneElement(item);
  const scene = item.scene || {};
  const layers = scene.layers || { base: item.image };

  if (!element) {
    return;
  }

  element.className = "gear-object asset-object category-" + item.category + " hidden";
  applyGearSceneLayout(element, item, scene.zIndex || 20);

  Object.keys(layers).forEach(function(layerName) {
    if (layerName === "front" || !layers[layerName]) {
      return;
    }

    const layerClassName = "gear-layer-" + layerName;
    const image = ensureLayerImage(element, layerClassName);
    image.classList.toggle("tent-glow", layerName === "glow");
    image.classList.toggle("lantern-glow", layerName === "glow" && item.category === "light");
    image.classList.toggle("string-lights-glow", layerName === "glow" && item.id === "warmStringLights");
    setVersionedLayerSource(image, layers[layerName]);
  });

  if (!layers.base && item.image) {
    setVersionedLayerSource(ensureLayerImage(element, "gear-layer-base"), item.image);
  }

  const frontElement = layers.front ? getOrCreateGearFrontElement(item) : document.getElementById(getGearFrontElementId(item));

  if (frontElement) {
    applyGearSceneLayout(frontElement, item, scene.frontZIndex || 31);

    if (layers.front) {
      setVersionedLayerSource(ensureLayerImage(frontElement, "gear-layer-front"), layers.front);
    }
  }
}

function isCamperAttachmentItem(item) {
  return Boolean(item && item.attachment && item.attachment.target === "camperHead");
}

function getOrCreateCamperAttachmentElement(item, layerName) {
  const normalizedLayerName = layerName || "base";
  let element = document.getElementById("gear-attachment-" + item.id + "-" + normalizedLayerName);

  if (!element && gearLayer) {
    element = document.createElement("img");
    element.id = "gear-attachment-" + item.id + "-" + normalizedLayerName;
    element.className = "camper-attachment camper-attachment-" + normalizedLayerName + " hidden";
    element.alt = "";
    gearLayer.appendChild(element);
  }

  return element;
}

function isCamperBackPose() {
  return camper.pose === "lookingLakeBack";
}

function getCamperAttachmentFacingKey() {
  return isCamperBackPose() ? "back" : normalizeFacing(camper.facing);
}

function getCamperAttachmentOffset(attachment, offsetGroupName, facingKey) {
  const group = attachment[offsetGroupName] || {};

  return group[facingKey] || group.right || { x: 0, y: 0, rotate: 0 };
}

function applyCamperAttachmentLayout(element, item, layerName, options) {
  const layerOptions = options || {};
  const attachment = item.attachment || {};
  const spriteSize = layerOptions.spriteSize || getSceneSpriteSize(item);
  const facingKey = getCamperAttachmentFacingKey();
  const offset = layerOptions.offset || getCamperAttachmentOffset(attachment, "offsets", facingKey);
  const facing = normalizeFacing(camper.facing);

  element.style.left = camper.x + offset.x + "%";
  element.style.top = camper.y + offset.y + "%";
  element.style.width = (layerOptions.widthPercent || attachment.widthPercent || 3) + "%";
  element.style.aspectRatio = spriteSize.width + " / " + spriteSize.height;
  element.style.zIndex = layerOptions.zIndex || attachment.zIndex || 32;
  element.style.setProperty("--attachment-scale-x", layerOptions.mirrorWithFacing === false ? "1" : facing === "left" ? "-1" : "1");
  element.style.setProperty("--attachment-rotate", (offset.rotate || 0) + "deg");
  element.classList.toggle("camper-attachment-back-pose", facingKey === "back");
  element.classList.toggle("camper-attachment-" + item.id, true);
  element.classList.toggle("camper-attachment-layer-" + layerName, true);
}

function updateCamperAttachmentElement(item) {
  if (!isCamperAttachmentItem(item)) {
    return;
  }

  const attachment = item.attachment || {};
  const layers = attachment.layers || { front: item.image };
  const facingKey = getCamperAttachmentFacingKey();
  const shouldShow = ownsGear(item.id) && isGearPlaced(item.id);
  const frontElement = getOrCreateCamperAttachmentElement(item, "front");
  const backElement = getOrCreateCamperAttachmentElement(item, "back");
  const coneElement = getOrCreateCamperAttachmentElement(item, "cone");

  if (frontElement && layers.front) {
    frontElement.src = withVersion(layers.front);
    frontElement.className = "camper-attachment camper-attachment-front camper-attachment-" + item.id + (shouldShow && facingKey !== "back" ? "" : " hidden");
    applyCamperAttachmentLayout(frontElement, item, "front", {
      spriteSize: { width: 64, height: 44 },
      widthPercent: attachment.widthPercent,
      zIndex: attachment.zIndex
    });
  }

  if (backElement && layers.back) {
    backElement.src = withVersion(layers.back);
    backElement.className = "camper-attachment camper-attachment-back camper-attachment-" + item.id + (shouldShow && facingKey === "back" ? "" : " hidden");
    applyCamperAttachmentLayout(backElement, item, "back", {
      spriteSize: { width: 64, height: 44 },
      widthPercent: attachment.backWidthPercent || attachment.widthPercent,
      zIndex: attachment.backZIndex || attachment.zIndex
    });
  }

  if (coneElement && layers.cone) {
    const coneOffset = getCamperAttachmentOffset(attachment, "coneOffsets", facingKey);

    coneElement.src = withVersion(layers.cone);
    coneElement.className = "camper-attachment camper-attachment-cone camper-attachment-" + item.id + (shouldShow ? "" : " hidden");
    applyCamperAttachmentLayout(coneElement, item, "cone", {
      spriteSize: { width: 220, height: 92 },
      offset: coneOffset,
      widthPercent: attachment.coneWidthPercent,
      zIndex: facingKey === "back" ? attachment.backZIndex || 29 : attachment.coneZIndex || 31
    });
  }
}

function updateCamperAttachments() {
  getGearItems().forEach(function(item) {
    if (isCamperAttachmentItem(item)) {
      updateCamperAttachmentElement(item);
    }
  });
}

function isGearVisibleInScene(item) {
  if (!item.scene) {
    return false;
  }

  if (item.scene.renderMode === "campfire") {
    return true;
  }

  if (isRooftopTentItem(item)) {
    return getEquippedGearId("tent") === item.id && isVehiclePlaced(getCurrentVehicleItem());
  }

  if (isVehicleItem(item)) {
    return isVehiclePlaced(item);
  }

  if (isTentItem(item) || isTarpItem(item)) {
    return getEquippedGearId(item.category) === item.id;
  }

  return ownsGear(item.id) && isGearPlaced(item.id);
}

function updateSceneGearVisibility(item) {
  const element = getGearSceneElement(item);
  const frontElement = document.getElementById(getGearFrontElementId(item));
  const isVisible = isGearVisibleInScene(item);
  const layers = item.scene && item.scene.layers ? item.scene.layers : {};

  if (element && item.scene.renderMode !== "campfire") {
    element.classList.toggle("hidden", !isVisible);
  }

  if (frontElement) {
    frontElement.classList.toggle("hidden", !isVisible || !layers.front);
  }
}

function updateSceneEquipment() {
  sceneBackground.src = gameState.isNight ? assetPaths.backgrounds.campsiteNight : assetPaths.backgrounds.campsiteDay;
  treelineImage.src = gameState.isNight ? assetPaths.backgrounds.treelineNight : assetPaths.backgrounds.treelineDay;
  lakeImage.src = gameState.isNight ? assetPaths.backgrounds.lakeNight : assetPaths.backgrounds.lakeDay;

  getGearItems().forEach(function(item) {
    updateGearSceneElement(item);
    updateSceneGearVisibility(item);
  });
  updateCamperAttachments();

  campfire.className = "campfire asset-object level-" + gameState.campfireLevel;
  campfire.classList.toggle("lit", gameState.warmthSeconds > 0);
  fireGlowImage.src = assetPaths.campfire.glow;
  campfireBaseImage.src = assetPaths.campfire.base[gameState.campfireLevel];
  campfireFlameImage.src = getCurrentFlameImage();

  dayNightIcon.src = gameState.isNight ? assetPaths.ui.day : assetPaths.ui.night;
}

function spendCozyPoints(cost) {
  if (gameState.cozyPoints < cost) {
    return false;
  }

  gameState.cozyPoints -= cost;
  return true;
}

function upgradeCampfire() {
  const cost = getCampfireUpgradeCost();

  if (cost > 0 && spendCozyPoints(cost)) {
    gameState.campfireLevel += 1;
    setStatus("The campfire burns cleaner and warmer.");
    updateScreen();
    saveGame();
  }
}

function equipGear(item) {
  if (!isEquippableGear(item) || !ownsGear(item.id)) {
    return false;
  }

  gameState.equippedGear[item.category] = item.id;

  if (isRooftopTentItem(item)) {
    ensureVehicleForRooftopTent();
  }

  return true;
}

function ensureVehicleForRooftopTent() {
  let vehicleItem = getCurrentVehicleItem();

  if (!vehicleItem || !ownsGear(vehicleItem.id)) {
    vehicleItem = getOwnedGearItems().find(isVehicleItem);

    if (vehicleItem) {
      gameState.equippedGear.vehicle = vehicleItem.id;
    }
  }

  if (vehicleItem) {
    placeGear(vehicleItem);
  }
}

function placeGear(item) {
  if (!isGearPlaceable(item) || !ownsGear(item.id)) {
    return false;
  }

  addUniquePlacedGear(gameState.placedGear, item.id);
  return true;
}

function packGear(item) {
  if (!isGearPlaceable(item) || !ownsGear(item.id) || !isGearPlaced(item.id)) {
    return false;
  }

  removePlacedGear(item.id);
  return true;
}

function unlockGearRewards(item) {
  if (item.unlocks && item.unlocks.nightMode) {
    gameState.nightUnlocked = true;
  }
}

function buyGear(item) {
  if (!item || ownsGear(item.id) || getMissingGearRequirements(item).length > 0) {
    return false;
  }

  if (!spendCozyPoints(item.cost)) {
    return false;
  }

  addUniqueGear(gameState.ownedGear, item.id);
  unlockGearRewards(item);

  if (isEquippableGear(item)) {
    equipGear(item);
  }

  if (isGearPlaceable(item)) {
    placeGear(item);
  }

  return true;
}

function handleVehicleAction(item) {
  const isEquipped = getEquippedGearId("vehicle") === item.id;
  const isPlaced = isGearPlaced(item.id);

  if (!ownsGear(item.id)) {
    return false;
  }

  if (!isEquipped) {
    equipGear(item);
    placeGear(item);
    setStatus("The camper parks " + item.displayName + " at camp.");
  } else if (!isPlaced) {
    placeGear(item);
    setStatus(item.displayName + " returns to the campsite.");
  } else if (isCurrentRooftopTentEquipped()) {
    setStatus("The rooftop tent is mounted. Switch tents before stowing the vehicle.");
  } else {
    packGear(item);
    setStatus(item.displayName + " is stowed away.");
  }

  updateScreen();
  saveGame();
  return true;
}

function handleGearAction(id) {
  const item = getGearItem(id);

  if (!item) {
    return;
  }

  if (item.interactions && item.interactions.upgradeCampfire) {
    upgradeCampfire();
    return;
  }

  if (isVehicleItem(item) && handleVehicleAction(item)) {
    return;
  }

  if (ownsGear(item.id) && isEquippableGear(item)) {
    if (equipGear(item)) {
      setStatus("The camper switches to " + item.displayName + ".");
      updateScreen();
      saveGame();
    }
    return;
  }

  if (ownsGear(item.id) && isGearPlaceable(item)) {
    if (isGearPlaced(item.id)) {
      if (packGear(item)) {
        setStatus(item.displayName + " is packed away.");
        updateScreen();
        saveGame();
      }
    } else if (placeGear(item)) {
      setStatus(item.displayName + " is placed in camp.");
      updateScreen();
      saveGame();
    }
    return;
  }

  if (buyGear(item)) {
    setStatus(isEquippableGear(item) || isGearPlaceable(item) ? item.displayName + " joins the campsite." : item.displayName + " is owned.");
    updateScreen();
    saveGame();
  }
}

function openShop() {
  document.body.classList.add("shop-open");
  shopDrawer.setAttribute("aria-hidden", "false");
  setShopFilter(activeShopFilter);
}

function closeShop() {
  document.body.classList.remove("shop-open");
  shopDrawer.setAttribute("aria-hidden", "true");
}

function toggleShop() {
  if (document.body.classList.contains("shop-open")) {
    closeShop();
  } else {
    openShop();
  }
}

function setShopFilter(filter) {
  activeShopFilter = filter || "all";

  shopTabs.forEach(function(tab) {
    tab.classList.toggle("active", tab.getAttribute("data-shop-filter") === activeShopFilter);
  });

  shopSections.forEach(function(section) {
    const group = section.getAttribute("data-shop-group");
    const shouldShow = activeShopFilter === "all" || group === activeShopFilter;
    section.classList.toggle("filtered-hidden", !shouldShow);
  });

  shopContent.classList.toggle("single-category", activeShopFilter !== "all");
  shopContent.scrollLeft = 0;
  shopContent.scrollTop = 0;
}

function toggleGatherWoodMode() {
  gameState.gatherWoodMode = !gameState.gatherWoodMode;
  camper.actionTimer = 0;
  setStatus(gameState.gatherWoodMode ? "The camper is focused on firewood." : "The camper returns to slow camp life.");
  updateScreen();
  saveGame();
}

function toggleDayNight() {
  if (!gameState.nightUnlocked) {
    return;
  }

  gameState.isNight = !gameState.isNight;
  setStatus(gameState.isNight ? "Night settles over the lake." : "Morning light returns to camp.");
  updateScreen();
  saveGame();
}

function spawnWood() {
  if (woodItems.length >= maxWoodItems) {
    return;
  }

  const wood = {
    id: nextWoodId,
    x: randomBetween(14, 68),
    y: randomBetween(67, 82),
    rotate: randomBetween(-22, 22)
  };

  nextWoodId += 1;
  woodItems.push(wood);
  renderWoodItem(wood);
}

function renderWoodItem(wood) {
  const woodElement = document.createElement("img");
  woodElement.className = "wood-item";
  woodElement.id = "wood-" + wood.id;
  woodElement.src = assetPaths.resources.wood;
  woodElement.alt = "";
  woodElement.style.left = wood.x + "%";
  woodElement.style.top = wood.y + "%";
  woodElement.style.setProperty("--wood-rotate", wood.rotate + "deg");
  woodLayer.appendChild(woodElement);
}

function removeWoodItem(woodId) {
  woodItems = woodItems.filter(function(wood) {
    return wood.id !== woodId;
  });

  const woodElement = document.getElementById("wood-" + woodId);

  if (woodElement) {
    woodElement.remove();
  }
}

function findClosestWood() {
  let closestWood = null;
  let closestDistance = Infinity;

  woodItems.forEach(function(wood) {
    const distance = Math.abs(wood.x - camper.x) + Math.abs(wood.y - camper.y);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestWood = wood;
    }
  });

  return closestWood;
}

function getTravelTime(targetX, targetY) {
  const distance = Math.abs(targetX - camper.x) + Math.abs(targetY - camper.y);
  return clamp(0.8 + distance / 24, 1.1, 3.4);
}

function normalizeFacing(facing) {
  return facing === "left" || facing === "right" ? facing : "right";
}

function getOppositeFacing(facing) {
  return normalizeFacing(facing) === "left" ? "right" : "left";
}

function getMovementFacing(fromX, toX) {
  if (toX < fromX) {
    return "left";
  }

  if (toX > fromX) {
    return "right";
  }

  return "right";
}

function getSeatableFurnitureEntries() {
  return getGearItems().filter(function(item) {
    return item.category === "chair" && item.interactions && item.interactions.seatable;
  }).map(function(item) {
    return {
      id: item.id,
      def: item
    };
  }).filter(function(entry) {
    return Boolean(entry.def);
  });
}

function getSeatableFurnitureDef(id) {
  const item = getGearItem(id);

  if (item && item.interactions && item.interactions.seatable) {
    return item;
  }

  return null;
}

function getSeatableElement(def) {
  return getGearSceneElement(def);
}

function getSeatableSpriteSize(def) {
  return getSceneSpriteSize(def);
}

function getSeatableGroundAnchor(def) {
  return getSceneGroundAnchor(def);
}

function getSeatableFacing(def) {
  return normalizeFacing(def && def.scene && def.scene.facing);
}

function isSeatableMirrored(def) {
  return Boolean(def && def.scene && def.scene.mirrored);
}

function mirrorSeatOffset(spriteSize, offset) {
  return {
    x: spriteSize.width - offset.x,
    y: offset.y
  };
}

function getSeatableSeatOffset(def, facing) {
  const spriteSize = getSeatableSpriteSize(def);
  const seatable = def && def.interactions ? def.interactions.seatable : null;
  const seatOffsets = seatable && seatable.seatOffsets ? seatable.seatOffsets : {};
  const normalizedFacing = normalizeFacing(facing);
  const explicitOffset = seatOffsets[normalizedFacing];

  if (explicitOffset) {
    return explicitOffset;
  }

  const oppositeOffset = seatOffsets[getOppositeFacing(normalizedFacing)];

  if (oppositeOffset) {
    return mirrorSeatOffset(spriteSize, oppositeOffset);
  }

  const fallbackOffset = seatOffsets.default || getSeatableGroundAnchor(def);
  return isSeatableMirrored(def) ? mirrorSeatOffset(spriteSize, fallbackOffset) : fallbackOffset;
}

function getSceneWidthToHeightRatio() {
  const sceneRect = campScene.getBoundingClientRect();

  if (sceneRect.width > 0 && sceneRect.height > 0) {
    return sceneRect.width / sceneRect.height;
  }

  return 9 / 16;
}

function getSeatableSceneFallbackTarget(id, def, facing) {
  const spriteSize = getSeatableSpriteSize(def);
  const groundAnchor = getSeatableGroundAnchor(def);
  const seatOffset = getSeatableSeatOffset(def, facing);
  const scene = def.scene || {};
  const position = scene.position || { x: 0, y: 0 };
  const widthPercent = scene.widthPercent || 0;
  const sceneWidthToHeightRatio = getSceneWidthToHeightRatio();

  return {
    x: position.x + ((seatOffset.x - groundAnchor.x) / spriteSize.width) * widthPercent,
    y: position.y + ((seatOffset.y - groundAnchor.y) / spriteSize.width) * widthPercent * sceneWidthToHeightRatio,
    seatableId: id,
    furnitureFacing: facing
  };
}

function getSeatableSeatTarget(id, def) {
  const element = getSeatableElement(def);
  const spriteSize = getSeatableSpriteSize(def);
  const facing = getSeatableFacing(def);

  if (!element || element.classList.contains("hidden")) {
    return getSeatableSceneFallbackTarget(id, def, facing);
  }

  const sceneRect = campScene.getBoundingClientRect();
  const furnitureRect = element.getBoundingClientRect();

  if (sceneRect.width <= 0 || sceneRect.height <= 0 || furnitureRect.width <= 0 || furnitureRect.height <= 0) {
    return getSeatableSceneFallbackTarget(id, def, facing);
  }

  const seatOffset = getSeatableSeatOffset(def, facing);
  const seatX = furnitureRect.left - sceneRect.left + seatOffset.x * (furnitureRect.width / spriteSize.width);
  const seatY = furnitureRect.top - sceneRect.top + seatOffset.y * (furnitureRect.height / spriteSize.height);

  return {
    x: seatX / sceneRect.width * 100,
    y: seatY / sceneRect.height * 100,
    seatableId: id,
    furnitureFacing: facing
  };
}

function isSeatableFurnitureAvailable(def) {
  return Boolean(def && ownsGear(def.id) && isGearPlaced(def.id));
}

function getAvailableSeatableFurnitureEntries() {
  return getSeatableFurnitureEntries().filter(function(entry) {
    return isSeatableFurnitureAvailable(entry.def);
  });
}

function getRandomSeatableSeatTarget() {
  const entries = getAvailableSeatableFurnitureEntries();

  if (entries.length === 0) {
    return null;
  }

  const entry = entries[Math.floor(Math.random() * entries.length)];
  return getSeatableSeatTarget(entry.id, entry.def);
}

function getCamperFacingForSeatable(target) {
  const def = getSeatableFurnitureDef(target && target.seatableId);

  if (!def) {
    return "right";
  }

  const furnitureFacing = normalizeFacing(target.furnitureFacing || getSeatableFacing(def));

  const seatable = def.interactions && def.interactions.seatable ? def.interactions.seatable : {};

  if (seatable.camperFacingMode === "oppositeFurniture") {
    return getOppositeFacing(furnitureFacing);
  }

  if (seatable.camperFacingMode === "sameAsFurniture") {
    return furnitureFacing;
  }

  return "right";
}

function getFacingTowardPoint(point) {
  if (!point || typeof point.x !== "number") {
    return "right";
  }

  if (camper.x < point.x) {
    return "right";
  }

  if (camper.x > point.x) {
    return "left";
  }

  return "right";
}

function getRandomFacing() {
  return Math.random() < 0.5 ? "left" : "right";
}

function getFacingForAction(action, target) {
  if (action === "sittingOnFurniture" || action === "sittingOnChair") {
    return getCamperFacingForSeatable(target);
  }

  if (action === "sittingByFire") {
    return getFacingTowardPoint(campSpots.fire);
  }

  if (action === "lookingAtLake" || action === "resting") {
    return getRandomFacing();
  }

  return "right";
}

function getCamperAnimationFrameIndex() {
  const animationStartedAt = camper.animationStartedAt || Date.now();

  return Math.floor((Date.now() - animationStartedAt) / camperFrameDurationMs) % 2;
}

function getAlternatingCamperImage(firstFrame, secondFrame, fallbackFrame) {
  if (!firstFrame || !secondFrame) {
    return fallbackFrame || firstFrame || secondFrame;
  }

  return getCamperAnimationFrameIndex() === 0 ? firstFrame : secondFrame;
}

function startMovingTo(target, actionAfterArrival, options) {
  const moveOptions = options || {};
  const actionName = moveOptions.labelAction || actionAfterArrival;
  const now = Date.now();
  const startX = camper.x;
  const travelTime = getTravelTime(target.x, target.y);

  camper.target = target;
  camper.actionAfterArrival = actionAfterArrival;
  camper.currentAction = actionName;
  camper.state = "moving";
  camper.pose = moveOptions.carryingWood ? "carryingWood" : "walking";
  camper.facing = getMovementFacing(startX, target.x);
  camper.animationStartedAt = now;
  camper.actionTimer = now + travelTime * 1000;
  camper.x = target.x;
  camper.y = target.y;

  updateCamperView();
}

function startActing(action, durationSeconds) {
  const now = Date.now();
  const actionTarget = camper.target;

  camper.state = "acting";
  camper.currentAction = action;
  camper.actionAfterArrival = null;
  camper.target = null;
  camper.pose = getPoseForAction(action);
  camper.facing = getFacingForAction(action, actionTarget);
  camper.animationStartedAt = now;
  camper.actionTimer = now + durationSeconds * 1000;

  if (action === "addingWoodToFire") {
    gameState.warmthSeconds += getWoodWarmthValue();
    camper.carryingWood = false;
    setStatus("Wood becomes Warmth. The fire keeps working.");
    updateScreen();
    saveGame();
  }

  updateCamperView();
}

function getPoseForAction(action) {
  if (action === "sittingByFire") {
    return "sittingGround";
  }

  if (action === "sittingOnFurniture" || action === "sittingOnChair") {
    return "sittingChair";
  }

  if (action === "resting") {
    return "resting";
  }

  if (action === "tentRest") {
    return "tentRest";
  }

  if (action === "lookingAtLake") {
    return "lookingLakeBack";
  }

  if (action === "addingWoodToFire") {
    return "addingWoodToFire";
  }

  return "idle";
}

function updateCamperView() {
  camperElement.style.left = camper.x + "%";
  camperElement.style.top = camper.y + "%";
  updateCamperSprite();
  updateCamperAttachments();
  updateCamperThought();
  camperStateText.textContent = camperActionLabels[camper.currentAction] || camperActionLabels.idle;

  document.body.classList.toggle("camper-in-tent", camper.pose === "tentRest" && hasNightUnlock());
}

function updateCamperThought() {
  const thought = camperThoughtLines[camper.currentAction] || "";
  const shouldShowThought = !gameState.gatherWoodMode && thought;

  camperThoughtBubble.textContent = shouldShowThought ? thought : "";
  camperThoughtBubble.style.left = camper.x + "%";
  camperThoughtBubble.style.top = Math.max(8, camper.y - 10.5) + "%";
  camperThoughtBubble.classList.toggle("show", Boolean(shouldShowThought));
}

function getCamperImageForPose() {
  if (camper.pose === "walking") {
    return getAlternatingCamperImage(assetPaths.characters.walk1, assetPaths.characters.walk2, assetPaths.characters.walk1);
  }

  if (camper.pose === "carryingWood" || camper.pose === "addingWoodToFire") {
    return getAlternatingCamperImage(assetPaths.characters.carry1, assetPaths.characters.carry2, assetPaths.characters.carry);
  }

  if (camper.pose === "sittingGround") {
    return assetPaths.characters.sitGround;
  }

  if (camper.pose === "sittingChair") {
    return assetPaths.characters.sitChair;
  }

  if (camper.pose === "lookingLakeBack") {
    return assetPaths.characters.lookLakeBack;
  }

  if (camper.pose === "resting" || camper.pose === "tentRest") {
    return assetPaths.characters.rest;
  }

  return assetPaths.characters.idle;
}

function updateCamperSprite() {
  const image = getCamperImageForPose();
  const className = "camper asset-object " + camper.state + " " + camper.pose;
  camperElement.style.setProperty("--object-scale-x", normalizeFacing(camper.facing) === "left" ? "-1" : "1");

  if (camperElement.getAttribute("src") !== image) {
    camperElement.src = image;
  }

  if (camperElement.className !== className) {
    camperElement.className = className;
  }
}

function chooseNextCamperAction() {
  if (gameState.gatherWoodMode && woodItems.length > 0) {
    const wood = findClosestWood();
    camper.targetWoodId = wood.id;
    startMovingTo(
      { x: wood.x, y: wood.y },
      "pickupWood",
      { labelAction: "movingToWood" }
    );
    setStatus("The camper spotted fallen wood.");
    return;
  }

  if (gameState.gatherWoodMode) {
    const wanderPoint = getRandomWanderPoint();
    startMovingTo(wanderPoint, "wandering", { labelAction: "wandering" });
    setStatus("The camper is searching the ground for wood.");
    return;
  }

  chooseRelaxingAction();
}

function chooseRelaxingAction() {
  const actions = ["wandering", "lookingAtLake", "sittingByFire", "resting", "tentRest"];

  if (getAvailableSeatableFurnitureEntries().length > 0) {
    actions.push("sittingOnFurniture");
  }

  const action = actions[Math.floor(Math.random() * actions.length)];

  if (action === "lookingAtLake") {
    startMovingTo(campSpots.lake, "lookingAtLake");
  } else if (action === "sittingByFire") {
    startMovingTo(campSpots.fireSeat, "sittingByFire");
  } else if (action === "sittingOnFurniture") {
    const seatTarget = getRandomSeatableSeatTarget();

    if (seatTarget) {
      startMovingTo(seatTarget, "sittingOnFurniture");
    } else {
      startMovingTo(getRandomWanderPoint(), "wandering", { labelAction: "wandering" });
    }
  } else if (action === "tentRest") {
    startMovingTo(getTentRestSpot(), "tentRest");
  } else if (action === "resting") {
    startMovingTo(campSpots.rest, "resting");
  } else {
    const wanderPoint = getRandomWanderPoint();
    startMovingTo(wanderPoint, "wandering", { labelAction: "wandering" });
  }

  updateCamperThought();
}

function getRandomWanderPoint() {
  return {
    x: randomBetween(18, 64),
    y: randomBetween(68, 80)
  };
}

function getTentRestSpot() {
  const tentItem = getEquippedGearItem("tent");

  if (isRooftopTentItem(tentItem)) {
    const layout = getRooftopTentLayout(tentItem);

    if (layout && layout.position) {
      return layout.position;
    }
  }

  const tentRest = tentItem && tentItem.interactions ? tentItem.interactions.tentRest : null;

  if (tentRest && tentRest.position) {
    return tentRest.position;
  }

  if (tentItem && tentItem.scene && tentItem.scene.position) {
    return tentItem.scene.position;
  }

  return campSpots.tent;
}

function updateCamperAI() {
  updateCamperSprite();
  campfireFlameImage.src = getCurrentFlameImage();

  if (Date.now() < camper.actionTimer) {
    return;
  }

  if (camper.state === "moving") {
    arriveAtTarget();
    return;
  }

  if (camper.state === "acting") {
    finishCurrentAction();
    return;
  }

  chooseNextCamperAction();
}

function arriveAtTarget() {
  const action = camper.actionAfterArrival;

  if (action === "pickupWood") {
    pickupTargetWood();
    return;
  }

  if (action === "addingWoodToFire") {
    startActing("addingWoodToFire", 0.9);
    return;
  }

  if (action === "wandering") {
    startActing("wandering", 1.2);
    return;
  }

  if (action === "lookingAtLake") {
    startActing("lookingAtLake", 4);
    return;
  }

  if (action === "sittingByFire") {
    startActing("sittingByFire", 4);
    return;
  }

  if (action === "sittingOnFurniture" || action === "sittingOnChair") {
    startActing(action, 5);
    return;
  }

  if (action === "tentRest") {
    startActing("tentRest", 5);
    return;
  }

  if (action === "resting") {
    startActing("resting", 4);
    return;
  }

  startActing("idle", 1);
}

function finishCurrentAction() {
  if (camper.currentAction === "pickupWood") {
    startMovingTo(
      campSpots.fire,
      "addingWoodToFire",
      { carryingWood: true, labelAction: "carryingWoodToFire" }
    );
    return;
  }

  chooseNextCamperAction();
}

function pickupTargetWood() {
  const wood = woodItems.find(function(item) {
    return item.id === camper.targetWoodId;
  });

  if (!wood) {
    chooseNextCamperAction();
    return;
  }

  removeWoodItem(wood.id);
  camper.carryingWood = true;
  startActing("pickupWood", 0.55);
}

function gameTick() {
  if (gameState.warmthSeconds > 0) {
    const cozyGain = getCozyPointsPerSecond();
    gameState.cozyPoints += cozyGain;
    gameState.warmthSeconds -= getWarmthBurnRate();
    gameState.warmthSeconds += getWarmthAutoRestore();
    gameState.warmthSeconds = Math.max(0, gameState.warmthSeconds);

    showCozyGain(cozyGain);
  }

  updateScreen();
  saveGame();
}

function showCozyGain(amount) {
  showFloatingGain(amount);
  createCozySpark();
}

function showFloatingGain(amount) {
  const gainText = document.createElement("span");
  gainText.className = "gain-pop";
  gainText.textContent = "+" + formatNumber(amount);
  cozyGainLayer.appendChild(gainText);

  setTimeout(function() {
    gainText.remove();
  }, 1000);
}

function createCozySpark() {
  const fireRect = campfire.getBoundingClientRect();
  const targetRect = cozyPointStatus.getBoundingClientRect();

  if (fireRect.width === 0 || targetRect.width === 0) {
    return;
  }

  const startX = fireRect.left + fireRect.width / 2;
  const startY = fireRect.top + fireRect.height / 3;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  const spark = document.createElement("img");

  spark.className = "cozy-spark";
  spark.src = assetPaths.campfire.spark;
  spark.alt = "";
  spark.style.setProperty("--spark-start-x", startX + "px");
  spark.style.setProperty("--spark-start-y", startY + "px");
  spark.style.setProperty("--spark-move-x", targetX - startX + "px");
  spark.style.setProperty("--spark-move-y", targetY - startY + "px");
  document.body.appendChild(spark);

  setTimeout(function() {
    spark.remove();
  }, 900);
}

shopToggle.addEventListener("click", toggleShop);
closeShopButton.addEventListener("click", closeShop);
shopBackdrop.addEventListener("click", closeShop);
gatherWoodToggle.addEventListener("click", toggleGatherWoodMode);
dayNightToggle.addEventListener("click", toggleDayNight);
resetSaveButton.addEventListener("click", confirmResetSave);

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", saveGame);
}

renderShopFromCatalog();
resetSaveIfRequestedByUrl();
loadGame();
spawnWood();
spawnWood();
setShopFilter("all");
updateScreen();
updateCamperView();
chooseNextCamperAction();

setInterval(gameTick, 1000);
setInterval(updateCamperAI, 400);
setInterval(updateCamperSprite, camperSpriteRefreshMs);
setInterval(function() {
  if (Math.random() < 0.7) {
    spawnWood();
  }
}, 3500);
