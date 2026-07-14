// Save, sanitization, migrations, reset, offline earnings, and daily reset loading.

function saveGame() {
  const now = Date.now();
  ensureDailyAdventureModifiersForToday(new Date(), gameState);
  if (typeof ensureAdventureProgress === "function") {
    ensureAdventureProgress(gameState, now);
  }
  gameState.lastSeen = now;
  gameState.lastSaveTime = now;
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
    currentActivityId: "",
    actionTimer: 0,
    targetWoodId: null,
    woodCollectionSource: null,
    carryingWood: false,
    facing: "right",
    animationStartedAt: Date.now(),
    pathPoints: [],
    pathSegmentLengths: [],
    pathStartedAt: 0,
    pathDurationMs: 0,
    pathLength: 0,
    interactionTargetId: ""
  };
}

function resetGameToFreshStart(message) {
  localStorage.removeItem(SAVE_KEY);
  gameState = createDefaultGameState();
  gameState.comfort = calculateComfort();
  woodItems = [];
  nextWoodId = 1;
  woodLayer.innerHTML = "";
  clearActionQueue();

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
  maybeStartOnboarding();
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
    if (savedGame.gatherWoodMode !== undefined) {
      cleanState.gatherWoodMode = savedGame.gatherWoodMode;
    } else {
      cleanState.gatherWoodMode = true;
    }
    if (savedGame.onboardingSeen !== undefined) {
      cleanState.onboardingSeen = Boolean(savedGame.onboardingSeen);
    } else {
      cleanState.onboardingSeen = true;
    }
    if (savedGame.interactionGuideSeen !== undefined) {
      cleanState.interactionGuideSeen = Boolean(savedGame.interactionGuideSeen);
    } else {
      cleanState.interactionGuideSeen = Boolean(cleanState.onboardingSeen);
    }
    if (savedGame.buildModeGuideSeen !== undefined) {
      cleanState.buildModeGuideSeen = Boolean(savedGame.buildModeGuideSeen);
    }
    cleanState.activityStats = sanitizeActivityStats(savedGame.activityStats);
    cleanState.inventory = sanitizeInventory(savedGame.inventory);
    cleanState.adventure = typeof sanitizeAdventureProgress === "function"
      ? sanitizeAdventureProgress(savedGame.adventure)
      : cleanState.adventure;
    cleanState.fishing = sanitizeFishingProgress(savedGame.fishing);
    cleanState.cooking = sanitizeCookingProgress(savedGame.cooking);
    cleanState.dailyWeather = sanitizeDailyWeather(savedGame.dailyWeather);
    cleanState.todayDivinations = sanitizeTodayDivinations(savedGame.todayDivinations, getDivinationDateKey(), savedGame.todayDivination);
    cleanState.dailyAdventureModifiers = sanitizeDailyAdventureModifiers(
      savedGame.dailyAdventureModifiers,
      getDivinationDateKey(),
      cleanState.todayDivinations
    );
    cleanState.divinationUnlocks = sanitizeDivinationUnlocks(savedGame.divinationUnlocks);
    cleanState.soundJournal = sanitizeSoundJournal(savedGame.soundJournal);
    cleanState.economyResetTo500Applied = Boolean(savedGame.economyResetTo500Applied);
    cleanState.fishingCookingResetV48Applied = Boolean(savedGame.fishingCookingResetV48Applied);
    cleanState.vehiclePlacementMigrated = Boolean(savedGame.vehiclePlacementMigrated);
    if (savedGame.lastSeen !== undefined) {
      cleanState.lastSeen = savedGame.lastSeen;
    }
    if (savedGame.lastSaveTime !== undefined) {
      cleanState.lastSaveTime = savedGame.lastSaveTime;
    }
  }

  cleanState.camperProfileVersion = 0;
  cleanState.activeCamperIndex = 0;
  cleanState.campers = [];

  if (savedGame && Array.isArray(savedGame.campers)) {
    cleanState.campers = savedGame.campers.map(sanitizeCamperProfile).filter(Boolean);
  }

  if (savedGame && Number.isInteger(savedGame.activeCamperIndex)) {
    cleanState.activeCamperIndex = clamp(savedGame.activeCamperIndex, 0, Math.max(0, cleanState.campers.length - 1));
  }

  if (cleanState.campers.length > 0 && hasCamperProfile({
    camperProfileVersion: savedGame && Number(savedGame.camperProfileVersion) || CAMPER_PROFILE_VERSION,
    activeCamperIndex: cleanState.activeCamperIndex,
    campers: cleanState.campers
  })) {
    cleanState.camperProfileVersion = CAMPER_PROFILE_VERSION;
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

  const storyGearRewards = typeof STORY_ARCHIVE_GEAR_REWARDS === "object" && STORY_ARCHIVE_GEAR_REWARDS
    ? STORY_ARCHIVE_GEAR_REWARDS
    : {};
  const storyStates = cleanState.adventure && cleanState.adventure.storyStates || {};
  Object.keys(storyGearRewards).forEach(function(storyId) {
    if (storyStates[storyId] && storyStates[storyId].status === "archived") {
      addUniqueGear(ownedGear, storyGearRewards[storyId]);
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

  cleanState.userDepthOffsetY = {};
  const savedUserDepthOffsetY = savedGame && savedGame.userDepthOffsetY && typeof savedGame.userDepthOffsetY === "object" ? savedGame.userDepthOffsetY : {};
  Object.keys(savedUserDepthOffsetY).forEach(function(id) {
    const normalizedId = normalizeGearId(id);
    const item = getGearItem(normalizedId);
    const offsetY = Number(savedUserDepthOffsetY[id]);

    if (item && item.scene && Number.isFinite(offsetY) && offsetY !== 0) {
      cleanState.userDepthOffsetY[normalizedId] = offsetY;
    }
  });

  cleanState.userGearPositions = {};
  const savedUserGearPositions = savedGame && savedGame.userGearPositions && typeof savedGame.userGearPositions === "object" ? savedGame.userGearPositions : {};
  Object.keys(savedUserGearPositions).forEach(function(id) {
    const normalizedId = normalizeGearId(id);
    const item = getGearItem(normalizedId);
    const savedPosition = savedUserGearPositions[id] || {};
    const x = Number(savedPosition.x);
    const y = Number(savedPosition.y);

    if (item && item.scene && !isGearPositionLocked(item) && Number.isFinite(x) && Number.isFinite(y)) {
      cleanState.userGearPositions[normalizedId] = {
        x: clamp(x, 0, 100),
        y: clamp(y, 0, 100)
      };
    }
  });

  cleanState.userGearMountOffsets = {};

  cleanState.cozyPoints = Math.max(0, Number(cleanState.cozyPoints) || 0);
  cleanState.warmthSeconds = Math.max(0, Number(cleanState.warmthSeconds) || 0);
  cleanState.campfireLevel = clamp(Number(cleanState.campfireLevel) || 1, 1, 3);
  cleanState.nightUnlocked = Boolean(cleanState.nightUnlocked || hasNightUnlock(cleanState));
  cleanState.isNight = Boolean(cleanState.isNight && cleanState.nightUnlocked);
  cleanState.gatherWoodMode = Boolean(cleanState.gatherWoodMode);
  cleanState.lastSaveTime = Number(cleanState.lastSaveTime) || Date.now();
  cleanState.lastSeen = Number(cleanState.lastSeen) || cleanState.lastSaveTime;
  ensureDailyWeatherForToday(new Date(), cleanState);
  ensureTodayDivinationsForToday(new Date(), cleanState);
  ensureDailyAdventureModifiersForToday(new Date(), cleanState);
  cleanState.comfort = calculateComfort(cleanState);

  return cleanState;
}

function applyOneTimeEconomyResetMigration() {
  if (!gameState || gameState.economyResetTo500Applied) {
    return false;
  }

  const now = Date.now();
  gameState.cozyPoints = economyResetCozyPoints;
  gameState.economyResetTo500Applied = true;
  gameState.lastSeen = now;
  gameState.lastSaveTime = now;
  showWelcome("Economy reset: Cozy Points set to " + formatNumber(economyResetCozyPoints) + ". Offline earnings start fresh from now.");
  return true;
}

function applyOneTimeFishingCookingResetMigration() {
  if (!gameState || gameState.fishingCookingResetV48Applied) {
    return false;
  }

  gameState.inventory = cloneInventory(defaultGameState.inventory);
  gameState.fishing = { ...defaultGameState.fishing };
  gameState.cooking = {
    ...defaultGameState.cooking,
    unlockedRecipes: defaultGameState.cooking.unlockedRecipes.slice(),
    manuallyCookedRecipes: defaultGameState.cooking.manuallyCookedRecipes.slice(),
    recentAutoCookedRecipes: defaultGameState.cooking.recentAutoCookedRecipes.slice()
  };

  const activityStats = getActivityStatsMap(gameState);
  delete activityStats.fish;
  delete activityStats.cook;

  gameState.fishingCookingResetV48Applied = true;
  showWelcome("本次更新已一次性重置钓鱼和烹饪进度；已解锁的小乌龟占卜仍然保留。");
  return true;
}

function loadGame() {
  const savedText = localStorage.getItem(SAVE_KEY);
  loadedExistingSaveWithoutCamperProfile = false;

  if (!savedText) {
    gameState.comfort = calculateComfort();
    ensureDailyWeatherForToday();
    ensureTodayDivinationsForToday();
    ensureDailyAdventureModifiersForToday();
    if (saveWasResetFromUrl) {
      showWelcome("Save reset. A quiet day begins beside the lake.");
    } else {
      showWelcome("A quiet day begins beside the lake.");
    }
    return;
  }

  try {
    gameState = sanitizeSave(JSON.parse(savedText));
    if (typeof recoverInterruptedAdventureBackpack === "function") {
      recoverInterruptedAdventureBackpack();
    }
    loadedExistingSaveWithoutCamperProfile = !hasCamperProfile(gameState);
    if (!applyOneTimeEconomyResetMigration()) {
      applyOfflineEarnings();
    }
    applyOneTimeFishingCookingResetMigration();
    saveGame();
  } catch (error) {
    gameState = createDefaultGameState();
    gameState.comfort = calculateComfort();
    loadedExistingSaveWithoutCamperProfile = false;
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
  const earnedPoints = activeSeconds * getCozyPointsPerSecond();
  const reachedOfflineEarningsLimit = secondsAway > maxOfflineEarningsSeconds;

  if (activeSeconds > 0) {
    gameState.cozyPoints += earnedPoints;
    gameState.warmthSeconds = Math.max(0, gameState.warmthSeconds - activeSeconds * netBurnRate);
  }

  if (activeSeconds > 0 || secondsAway > 60) {
    let message = "Welcome back: offline " + formatShortTime(secondsAway) +
      "; settled " + formatShortTime(activeSeconds) +
      "; earned +" + formatNumber(earnedPoints) + " Cozy Points.";

    if (reachedOfflineEarningsLimit) {
      message += " 离线收益已达到上限。";
    }

    if (activeSeconds <= 0) {
      message += " The campfire is waiting for more branches.";
    }

    showWelcome(message);
  }

  gameState.lastSeen = now;
  gameState.lastSaveTime = now;
}
