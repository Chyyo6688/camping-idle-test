const SAVE_KEY = "cozyCampfireSave";

// This object is the starting save file for a new player.
const defaultGameState = {
  cozyPoints: 0,
  comfort: 0,
  warmthSeconds: 0,
  campfireLevel: 1,
  ownedTentTypes: ["backpacking"],
  currentTentType: "backpacking",
  ownedEquipment: [],
  nightUnlocked: false,
  isNight: false,
  gatherWoodMode: true,
  lastSaveTime: Date.now()
};

function createDefaultGameState() {
  return {
    ...defaultGameState,
    ownedTentTypes: defaultGameState.ownedTentTypes.slice(),
    ownedEquipment: defaultGameState.ownedEquipment.slice(),
    lastSaveTime: Date.now()
  };
}

// Equipment data lives in one place so prices and bonuses are easy to change.
const tentData = {
  basic: {
    cost: 0,
    comfort: 0,
    offlineBonusSeconds: 0,
    image: "assets/tents/tent_backpacking.png"
  },
  backpacking: {
    cost: 35,
    comfort: 4,
    offlineBonusSeconds: 1800,
    image: "assets/tents/tent_backpacking.png"
  },
  lowDome: {
    cost: 80,
    comfort: 10,
    offlineBonusSeconds: 7200,
    image: "assets/tents/tent_low_dome.png"
  },
  vestibule: {
    cost: 150,
    comfort: 18,
    offlineBonusSeconds: 14400,
    image: "assets/tents/tent_vestibule.png"
  }
};

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

// All visual assets are listed here so art can be replaced without hunting
// through the game logic.
const assetPaths = {
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
  tents: {
    backpacking: "assets/tents/tent_backpacking.png",
    lowDome: "assets/tents/tent_low_dome.png",
    vestibule: "assets/tents/tent_vestibule.png",
    glow: "assets/tents/tent_glow_overlay.png"
  },
  furniture: {
    axe: "assets/furniture/axe.png",
    chair: "assets/furniture/chair.png",
    kettle: "assets/furniture/kettle.png",
    stove: "assets/furniture/stove.png",
    table: "assets/furniture/table.png"
  },
  lighting: {
    lantern: "assets/lighting/lantern.png",
    lanternGlow: "assets/lighting/lantern_glow.png",
    stringLights: "assets/lighting/string_lights.png",
    stringLightsGlow: "assets/lighting/string_lights_glow.png"
  },
  resources: {
    wood: "assets/resources/wood_item.png"
  },
  ui: {
    day: "assets/ui/icon_day.png",
    night: "assets/ui/icon_night.png"
  }
};

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
  carryingWood: false
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
const tent = document.getElementById("tent");
const tentImage = document.getElementById("tentImage");
const tentGlowImage = document.getElementById("tentGlowImage");
const axe = document.getElementById("axe");
const chair = document.getElementById("chair");
const kettle = document.getElementById("kettle");
const lantern = document.getElementById("lantern");
const lanternImage = document.getElementById("lanternImage");
const lanternGlowImage = document.getElementById("lanternGlowImage");
const stove = document.getElementById("stove");
const stringLights = document.getElementById("stringLights");
const table = document.getElementById("table");
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
const shopTabs = Array.prototype.slice.call(document.querySelectorAll(".shop-tab"));
const shopSections = Array.prototype.slice.call(document.querySelectorAll(".shop-section"));
const gatherWoodToggle = document.getElementById("gatherWoodToggle");
const gatherModeLabel = document.getElementById("gatherModeLabel");
const dayNightToggle = document.getElementById("dayNightToggle");
const dayNightIcon = document.getElementById("dayNightIcon");
const dayNightLabel = document.getElementById("dayNightLabel");
const resetSaveButton = document.getElementById("resetSaveButton");
const upgradeCampfireButton = document.getElementById("upgradeCampfireButton");
const campfireUpgradeDescription = document.getElementById("campfireUpgradeDescription");
const campfireUpgradeCost = document.getElementById("campfireUpgradeCost");
const campfireShopImage = document.getElementById("campfireShopImage");
const buyBackpackingTentButton = document.getElementById("buyBackpackingTentButton");
const buyLowDomeTentButton = document.getElementById("buyLowDomeTentButton");
const buyVestibuleTentButton = document.getElementById("buyVestibuleTentButton");
const buyAxeButton = document.getElementById("buyAxeButton");
const buyChairButton = document.getElementById("buyChairButton");
const buyKettleButton = document.getElementById("buyKettleButton");
const buyLanternButton = document.getElementById("buyLanternButton");
const buyStoveButton = document.getElementById("buyStoveButton");
const buyStringLightsButton = document.getElementById("buyStringLightsButton");
const buyTableButton = document.getElementById("buyTableButton");
const campfireLevelAmount = document.getElementById("campfireLevelAmount");
const cozyRateAmount = document.getElementById("cozyRateAmount");
const offlineCapAmount = document.getElementById("offlineCapAmount");
const statusLine = document.getElementById("statusLine");

const tentButtons = {
  backpacking: buyBackpackingTentButton,
  lowDome: buyLowDomeTentButton,
  vestibule: buyVestibuleTentButton
};

const equipmentData = {
  chair: {
    name: "Camp Chair",
    cost: 55,
    comfort: 5,
    detail: "+5 Comfort",
    button: buyChairButton,
    sceneElement: chair,
    status: "The camper now has a proper chair by the fire."
  },
  table: {
    name: "Camping Table",
    cost: 60,
    comfort: 6,
    detail: "+6 Comfort",
    button: buyTableButton,
    sceneElement: table,
    status: "A sturdy table gives small camp gear a home."
  },
  kettle: {
    name: "Kettle",
    cost: 45,
    comfort: 3,
    detail: "+3 Comfort",
    button: buyKettleButton,
    sceneElement: kettle,
    requires: ["table"],
    status: "The kettle settles neatly on the camp table."
  },
  axe: {
    name: "Camp Axe",
    cost: 40,
    comfort: 2,
    detail: "+2 Comfort",
    button: buyAxeButton,
    sceneElement: axe,
    status: "The axe is tucked near the woodpile."
  },
  stove: {
    name: "Camp Stove",
    cost: 110,
    comfort: 5,
    detail: "+5 Comfort",
    button: buyStoveButton,
    sceneElement: stove,
    requires: ["table"],
    status: "The stove is ready on the camping table."
  },
  lantern: {
    name: "Lantern",
    cost: 90,
    comfort: 6,
    detail: "Unlock Night",
    button: buyLanternButton,
    sceneElement: lantern,
    unlocksNight: true,
    status: "Lantern light unlocks Night Mode."
  },
  stringLights: {
    name: "String Lights",
    cost: 140,
    comfort: 8,
    detail: "+8 Comfort",
    button: buyStringLightsButton,
    sceneElement: stringLights,
    status: "Warm string lights make the trees feel close."
  }
};

// These are points in the scene. The camper walks between them.
const campSpots = {
  fire: { x: 39, y: 79 },
  fireSeat: { x: 33, y: 80 },
  chair: { x: 57, y: 79 },
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
  sittingOnChair: "Settling into the camp chair",
  tentRest: "Resting inside the tent"
};

const camperThoughtLines = {
  wandering: "\u968f\u4fbf\u8d70\u8d70--",
  lookingAtLake: "\u770b\u770b\u6e56\u5427",
  sittingByFire: "\u70e4\u4f1a\u513f\u706b\u5427",
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

function normalizeTentType(type) {
  if (type === "basic") {
    return "backpacking";
  }

  if (type === "dome") {
    return "lowDome";
  }

  if (tentData[type]) {
    return type;
  }

  return "backpacking";
}

function ownsTent(type, state) {
  const campState = state || gameState;
  return campState.ownedTentTypes.indexOf(type) !== -1;
}

function ownsEquipment(type, state) {
  const campState = state || gameState;
  return Array.isArray(campState.ownedEquipment) && campState.ownedEquipment.indexOf(type) !== -1;
}

function getMissingEquipmentRequirements(type, state) {
  const equipment = equipmentData[type];
  const requirements = equipment.requires || [];

  return requirements.filter(function(requiredType) {
    return !ownsEquipment(requiredType, state);
  });
}

function canBuyEquipment(type) {
  const equipment = equipmentData[type];

  return Boolean(
    equipment &&
    !ownsEquipment(type) &&
    getMissingEquipmentRequirements(type).length === 0 &&
    gameState.cozyPoints >= equipment.cost
  );
}

function calculateComfort(state) {
  const campState = state || gameState;
  let comfort = tentData[campState.currentTentType].comfort;

  Object.keys(equipmentData).forEach(function(type) {
    if (ownsEquipment(type, campState)) {
      comfort += equipmentData[type].comfort;
    }
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
  return baseOfflineSeconds + tentData[gameState.currentTentType].offlineBonusSeconds;
}

function getCampfireUpgradeCost() {
  return campfireUpgradeCosts[gameState.campfireLevel] || 0;
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
    carryingWood: false
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
  const cleanState = { ...createDefaultGameState(), ...savedGame };

  // This gently migrates the Version 1 save shape if it exists.
  if (savedGame && savedGame.warmth !== undefined && savedGame.warmthSeconds === undefined) {
    cleanState.warmthSeconds = savedGame.warmth;
  }

  if (savedGame && savedGame.lastSavedTime !== undefined && savedGame.lastSaveTime === undefined) {
    cleanState.lastSaveTime = savedGame.lastSavedTime;
  }

  let currentTentType = normalizeTentType(cleanState.currentTentType);

  if (savedGame && savedGame.tentType !== undefined && currentTentType === defaultGameState.currentTentType) {
    currentTentType = normalizeTentType(savedGame.tentType);
  }

  let ownedTentTypes = ["backpacking"];

  if (Array.isArray(savedGame.ownedTentTypes)) {
    savedGame.ownedTentTypes.forEach(function(type) {
      const normalizedType = normalizeTentType(type);

      if (ownedTentTypes.indexOf(normalizedType) === -1) {
        ownedTentTypes.push(normalizedType);
      }
    });
  }

  if (savedGame && savedGame.tentType !== undefined) {
    const oldTentType = normalizeTentType(savedGame.tentType);

    if (ownedTentTypes.indexOf(oldTentType) === -1) {
      ownedTentTypes.push(oldTentType);
    }
  }

  if (ownedTentTypes.indexOf(currentTentType) === -1) {
    ownedTentTypes.push(currentTentType);
  }

  cleanState.ownedTentTypes = ownedTentTypes;
  cleanState.currentTentType = currentTentType;
  delete cleanState.tentType;

  let ownedEquipment = [];

  if (savedGame && Array.isArray(savedGame.ownedEquipment)) {
    savedGame.ownedEquipment.forEach(function(type) {
      if (equipmentData[type] && ownedEquipment.indexOf(type) === -1) {
        ownedEquipment.push(type);
      }
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
    const equipmentType = oldEquipmentFields[fieldName];

    if (savedGame && savedGame[fieldName] && ownedEquipment.indexOf(equipmentType) === -1) {
      ownedEquipment.push(equipmentType);
    }
  });

  cleanState.ownedEquipment = ownedEquipment;
  Object.keys(oldEquipmentFields).forEach(function(fieldName) {
    delete cleanState[fieldName];
  });

  cleanState.cozyPoints = Math.max(0, Number(cleanState.cozyPoints) || 0);
  cleanState.warmthSeconds = Math.max(0, Number(cleanState.warmthSeconds) || 0);
  cleanState.campfireLevel = clamp(Number(cleanState.campfireLevel) || 1, 1, 3);
  cleanState.nightUnlocked = Boolean(cleanState.nightUnlocked || ownsEquipment("lantern", cleanState));
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

  updateCampfireButton();
  updateTentButtons();
  updateEquipmentButtons();
  updateSceneEquipment();
}

function updateCampfireButton() {
  if (gameState.campfireLevel >= 3) {
    upgradeCampfireButton.disabled = true;
    upgradeCampfireButton.classList.add("owned");
    campfireUpgradeDescription.textContent = "Lv 3 complete";
    campfireUpgradeCost.textContent = "MAX";
    upgradeCampfireButton.setAttribute("data-price", "MAX");
    return;
  }

  const cost = getCampfireUpgradeCost();
  upgradeCampfireButton.disabled = gameState.cozyPoints < cost;
  upgradeCampfireButton.classList.remove("owned");
  campfireUpgradeDescription.textContent = gameState.campfireLevel === 1 ? "Lv 2 fire pit" : "Lv 3 ember stove";
  campfireUpgradeCost.textContent = "UPGRADE";
  upgradeCampfireButton.setAttribute("data-price", cost + "CP");
}

function updateTentButtons() {
  Object.keys(tentButtons).forEach(function(type) {
    const button = tentButtons[type];
    const actionLabel = button.querySelector("strong");
    const isOwned = ownsTent(type);
    const isCurrent = gameState.currentTentType === type;

    button.classList.toggle("owned", isOwned);
    button.classList.toggle("equipped", isCurrent);

    if (isCurrent) {
      button.disabled = true;
      actionLabel.textContent = "EQUIPPED";
      button.setAttribute("data-price", "0CP");
    } else if (isOwned) {
      button.disabled = false;
      actionLabel.textContent = "EQUIP";
      button.setAttribute("data-price", "0CP");
    } else {
      button.disabled = gameState.cozyPoints < tentData[type].cost;
      actionLabel.textContent = "BUY";
      button.setAttribute("data-price", tentData[type].cost + "CP");
    }
  });
}

function updateEquipmentButtons() {
  Object.keys(equipmentData).forEach(function(type) {
    const equipment = equipmentData[type];
    const button = equipment.button;
    const actionLabel = button.querySelector("strong");
    const detailLabel = button.querySelector(".item-detail");
    const isOwned = ownsEquipment(type);
    const missingRequirements = getMissingEquipmentRequirements(type);
    const isLocked = missingRequirements.length > 0;

    button.classList.toggle("owned", isOwned);
    button.classList.toggle("locked", isLocked && !isOwned);
    button.disabled = isOwned || isLocked || gameState.cozyPoints < equipment.cost;

    if (isOwned) {
      actionLabel.textContent = "OWNED";
      button.setAttribute("data-price", "0CP");
    } else if (isLocked) {
      actionLabel.textContent = "LOCKED";
      button.setAttribute("data-price", "?CP");
    } else {
      actionLabel.textContent = "BUY";
      button.setAttribute("data-price", equipment.cost + "CP");
    }

    if (isLocked && detailLabel) {
      detailLabel.textContent = "Requires " + missingRequirements.map(function(requiredType) {
        return equipmentData[requiredType].name || requiredType;
      }).join(", ");
    } else if (detailLabel) {
      detailLabel.textContent = equipment.detail;
    }
  });
}

function updateSceneEquipmentVisibility() {
  Object.keys(equipmentData).forEach(function(type) {
    const equipment = equipmentData[type];

    if (equipment.sceneElement) {
      equipment.sceneElement.classList.toggle("hidden", !ownsEquipment(type));
    }
  });
}

function updateSceneEquipment() {
  sceneBackground.src = gameState.isNight ? assetPaths.backgrounds.campsiteNight : assetPaths.backgrounds.campsiteDay;
  treelineImage.src = gameState.isNight ? assetPaths.backgrounds.treelineNight : assetPaths.backgrounds.treelineDay;
  lakeImage.src = gameState.isNight ? assetPaths.backgrounds.lakeNight : assetPaths.backgrounds.lakeDay;

  tentImage.src = tentData[gameState.currentTentType].image;
  tentGlowImage.src = assetPaths.tents.glow;

  axe.src = assetPaths.furniture.axe;
  chair.src = assetPaths.furniture.chair;
  kettle.src = assetPaths.furniture.kettle;
  lanternImage.src = assetPaths.lighting.lantern;
  lanternGlowImage.src = assetPaths.lighting.lanternGlow;
  stove.src = assetPaths.furniture.stove;
  table.src = assetPaths.furniture.table;
  updateSceneEquipmentVisibility();

  campfire.className = "campfire asset-object level-" + gameState.campfireLevel;
  campfire.classList.toggle("lit", gameState.warmthSeconds > 0);
  fireGlowImage.src = assetPaths.campfire.glow;
  campfireBaseImage.src = assetPaths.campfire.base[gameState.campfireLevel];
  campfireFlameImage.src = getCurrentFlameImage();
  campfireShopImage.src = assetPaths.campfire.base[gameState.campfireLevel];

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

function buyTent(type) {
  if (gameState.currentTentType === type) {
    return;
  }

  if (ownsTent(type)) {
    gameState.currentTentType = type;
    setStatus("The camper switches to a different tent.");
    updateScreen();
    saveGame();
    return;
  }

  if (spendCozyPoints(tentData[type].cost)) {
    gameState.ownedTentTypes.push(type);
    gameState.currentTentType = type;
    setStatus("A new tent changes the whole mood of camp.");
    updateScreen();
    saveGame();
  }
}

function buyEquipment(type) {
  const equipment = equipmentData[type];

  if (!equipment || ownsEquipment(type) || getMissingEquipmentRequirements(type).length > 0) {
    return;
  }

  if (spendCozyPoints(equipment.cost)) {
    gameState.ownedEquipment.push(type);

    if (equipment.unlocksNight) {
      gameState.nightUnlocked = true;
    }

    setStatus(equipment.status);
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
    const category = section.getAttribute("data-shop-category");
    const shouldShow = activeShopFilter === "all" || category === activeShopFilter;
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

function startMovingTo(target, actionAfterArrival, options) {
  const moveOptions = options || {};
  const actionName = moveOptions.labelAction || actionAfterArrival;

  camper.target = target;
  camper.actionAfterArrival = actionAfterArrival;
  camper.currentAction = actionName;
  camper.state = "moving";
  camper.pose = moveOptions.carryingWood ? "carryingWood" : "walking";
  camper.actionTimer = Date.now() + getTravelTime(target.x, target.y) * 1000;
  camper.x = target.x;
  camper.y = target.y;

  updateCamperView();
}

function startActing(action, durationSeconds) {
  camper.state = "acting";
  camper.currentAction = action;
  camper.actionAfterArrival = null;
  camper.target = null;
  camper.pose = getPoseForAction(action);
  camper.actionTimer = Date.now() + durationSeconds * 1000;

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

  if (action === "sittingOnChair") {
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
  updateCamperThought();
  camperStateText.textContent = camperActionLabels[camper.currentAction] || camperActionLabels.idle;

  document.body.classList.toggle("camper-in-tent", camper.pose === "tentRest" && ownsEquipment("lantern"));
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
    return Math.floor(Date.now() / 350) % 2 === 0 ? assetPaths.characters.walk1 : assetPaths.characters.walk2;
  }

  if (camper.pose === "carryingWood" || camper.pose === "addingWoodToFire") {
    return assetPaths.characters.carry;
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
  const isMovingPose = camper.pose === "walking" || camper.pose === "carryingWood";
  camperElement.src = getCamperImageForPose();
  const movementClass = isMovingPose && camper.pose !== "walking" ? " walking" : "";
  camperElement.className = "camper asset-object " + camper.state + " " + camper.pose + movementClass;
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

  if (ownsEquipment("chair")) {
    actions.push("sittingOnChair");
  }

  const action = actions[Math.floor(Math.random() * actions.length)];

  if (action === "lookingAtLake") {
    startMovingTo(campSpots.lake, "lookingAtLake");
  } else if (action === "sittingByFire") {
    startMovingTo(campSpots.fireSeat, "sittingByFire");
  } else if (action === "sittingOnChair") {
    startMovingTo(campSpots.chair, "sittingOnChair");
  } else if (action === "tentRest") {
    startMovingTo(campSpots.tent, "tentRest");
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

  if (action === "sittingOnChair") {
    startActing("sittingOnChair", 5);
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
shopTabs.forEach(function(tab) {
  tab.addEventListener("click", function() {
    setShopFilter(tab.getAttribute("data-shop-filter"));
  });
});
gatherWoodToggle.addEventListener("click", toggleGatherWoodMode);
dayNightToggle.addEventListener("click", toggleDayNight);
resetSaveButton.addEventListener("click", confirmResetSave);
upgradeCampfireButton.addEventListener("click", upgradeCampfire);
buyBackpackingTentButton.addEventListener("click", function() {
  buyTent("backpacking");
});
buyLowDomeTentButton.addEventListener("click", function() {
  buyTent("lowDome");
});
buyVestibuleTentButton.addEventListener("click", function() {
  buyTent("vestibule");
});
Object.keys(equipmentData).forEach(function(type) {
  equipmentData[type].button.addEventListener("click", function() {
    buyEquipment(type);
  });
});

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", saveGame);
}

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
setInterval(function() {
  if (Math.random() < 0.7) {
    spawnWood();
  }
}, 3500);
