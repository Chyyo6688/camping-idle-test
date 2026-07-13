// Activity progress, inventory, fishing, cooking, and inventory UI.

function getActivityDefinition(activityId) {
  return activityId && activityDefinitions[activityId] ? activityDefinitions[activityId] : null;
}

function getActivityIds() {
  return Object.keys(activityDefinitions);
}

function isActivityId(activityId) {
  return Boolean(getActivityDefinition(activityId));
}

function getActivityZoneTargetId(zoneId) {
  return ACTIVITY_ZONE_TARGET_PREFIX + zoneId;
}

function getActivityZoneIdFromTargetId(targetId) {
  return typeof targetId === "string" && targetId.indexOf(ACTIVITY_ZONE_TARGET_PREFIX) === 0 ?
    targetId.slice(ACTIVITY_ZONE_TARGET_PREFIX.length) :
    "";
}

function getActivityZone(zoneId) {
  return zoneId && activityZones[zoneId] ? activityZones[zoneId] : null;
}

function getActivityZoneElementId(zoneId) {
  return "activity-zone-" + zoneId;
}

function getActivityZoneElement(zoneId) {
  return document.getElementById(getActivityZoneElementId(zoneId));
}

function getActivityStatsMap(state) {
  const campState = state || gameState;

  if (!campState.activityStats || typeof campState.activityStats !== "object" || Array.isArray(campState.activityStats)) {
    campState.activityStats = {};
  }

  return campState.activityStats;
}

function getActivityStats(activityId, state) {
  const statsMap = getActivityStatsMap(state);

  if (!statsMap[activityId] || typeof statsMap[activityId] !== "object") {
    statsMap[activityId] = {
      completed: 0,
      lastCompletedAt: 0
    };
  }

  statsMap[activityId].completed = Math.max(0, Number(statsMap[activityId].completed) || 0);
  statsMap[activityId].lastCompletedAt = Number(statsMap[activityId].lastCompletedAt) || 0;
  return statsMap[activityId];
}

function sanitizeActivityStats(stats) {
  const cleanStats = {};

  if (!stats || typeof stats !== "object" || Array.isArray(stats)) {
    return cleanStats;
  }

  getActivityIds().forEach(function(activityId) {
    const savedStats = stats[activityId];
    const completed = savedStats && typeof savedStats === "object" ? Number(savedStats.completed) : Number(savedStats);
    const lastCompletedAt = savedStats && typeof savedStats === "object" ? Number(savedStats.lastCompletedAt) : 0;

    cleanStats[activityId] = {
      completed: Math.max(0, Number.isFinite(completed) ? Math.floor(completed) : 0),
      lastCompletedAt: Number.isFinite(lastCompletedAt) ? Math.max(0, lastCompletedAt) : 0
    };
  });

  return cleanStats;
}

function recordActivityCompletion(activityId) {
  if (!isActivityId(activityId)) {
    return;
  }

  const stats = getActivityStats(activityId);
  stats.completed += 1;
  stats.lastCompletedAt = Date.now();
  saveGame();
}

function getActivityCompletionCount(activityId) {
  return getActivityStats(activityId).completed;
}

function cloneCountMap(counts) {
  const cleanCounts = {};
  const sourceCounts = counts && typeof counts === "object" && !Array.isArray(counts) ? counts : {};

  Object.keys(sourceCounts).forEach(function(id) {
    const count = Math.max(0, Math.floor(Number(sourceCounts[id]) || 0));

    if (count > 0) {
      cleanCounts[id] = count;
    }
  });

  return cleanCounts;
}

function cloneInventory(inventory) {
  const sourceInventory = inventory && typeof inventory === "object" && !Array.isArray(inventory) ? inventory : {};

  return {
    fish: cloneCountMap(sourceInventory.fish),
    meals: cloneCountMap(sourceInventory.meals),
    ingredients: cloneCountMap(sourceInventory.ingredients)
  };
}

function sanitizeCountMap(counts, catalog) {
  const cleanCounts = {};
  const sourceCounts = counts && typeof counts === "object" && !Array.isArray(counts) ? counts : {};

  Object.keys(catalog || {}).forEach(function(id) {
    const count = Math.max(0, Math.floor(Number(sourceCounts[id]) || 0));

    if (count > 0) {
      cleanCounts[id] = count;
    }
  });

  return cleanCounts;
}

function getFishStoragePriority(id) {
  const fish = getFishDefinition(id);
  const rarityPriority = {
    rare: 0,
    uncommon: 1,
    common: 2
  };

  return fish && Object.prototype.hasOwnProperty.call(rarityPriority, fish.rarity) ? rarityPriority[fish.rarity] : 3;
}

function capFishCountMapToCapacity(counts) {
  const cleanCounts = {};
  const sourceCounts = counts && typeof counts === "object" && !Array.isArray(counts) ? counts : {};
  let remaining = fishInventoryCapacity;

  Object.keys(sourceCounts)
    .sort(function(firstId, secondId) {
      const priorityDifference = getFishStoragePriority(firstId) - getFishStoragePriority(secondId);
      return priorityDifference !== 0 ? priorityDifference : Object.keys(fishCatalog).indexOf(firstId) - Object.keys(fishCatalog).indexOf(secondId);
    })
    .forEach(function(id) {
      const count = Math.max(0, Math.floor(Number(sourceCounts[id]) || 0));
      const keptCount = Math.min(count, remaining);

      if (keptCount > 0) {
        cleanCounts[id] = keptCount;
        remaining -= keptCount;
      }
    });

  return cleanCounts;
}

function sanitizeInventory(inventory) {
  const sourceInventory = inventory && typeof inventory === "object" && !Array.isArray(inventory) ? inventory : {};
  const fish = sanitizeCountMap(sourceInventory.fish, fishCatalog);

  return {
    fish: capFishCountMapToCapacity(fish),
    meals: sanitizeCountMap(sourceInventory.meals, mealCatalog),
    ingredients: sanitizeCountMap(sourceInventory.ingredients, ingredientCatalog)
  };
}

function sanitizeFishingProgress(progress) {
  const sourceProgress = progress && typeof progress === "object" && !Array.isArray(progress) ? progress : {};

  return {
    attempts: Math.max(0, Math.floor(Number(sourceProgress.attempts) || 0)),
    caught: Math.max(0, Math.floor(Number(sourceProgress.caught) || 0)),
    released: Math.max(0, Math.floor(Number(sourceProgress.released) || 0)),
    releasedByPlayer: Math.max(0, Math.floor(Number(sourceProgress.releasedByPlayer) || 0)),
    koiReleaseAnimationSeen: Boolean(sourceProgress.koiReleaseAnimationSeen),
    firstStoredFishGuideSeen: Boolean(sourceProgress.firstStoredFishGuideSeen)
  };
}

function sanitizeCookingProgress(progress) {
  const sourceProgress = progress && typeof progress === "object" && !Array.isArray(progress) ? progress : {};
  const unlockedRecipes = Array.from(new Set((Array.isArray(sourceProgress.unlockedRecipes) ? sourceProgress.unlockedRecipes : [])
    .filter(function(recipeId) { return Boolean(cookingRecipeCatalog[recipeId]); })));

  Object.keys(cookingRecipeCatalog).forEach(function(recipeId) {
    if (cookingRecipeCatalog[recipeId].defaultUnlocked && unlockedRecipes.indexOf(recipeId) === -1) {
      unlockedRecipes.unshift(recipeId);
    }
  });

  return {
    cooked: Math.max(0, Math.floor(Number(sourceProgress.cooked) || 0)),
    autoCookDate: typeof sourceProgress.autoCookDate === "string" ? sourceProgress.autoCookDate : "",
    autoCookedToday: Math.max(0, Math.floor(Number(sourceProgress.autoCookedToday) || 0)),
    unlockedRecipes: unlockedRecipes
  };
}

function getInventory(state) {
  const campState = state || gameState;

  if (!campState.inventory || typeof campState.inventory !== "object" || Array.isArray(campState.inventory)) {
    campState.inventory = cloneInventory(defaultGameState.inventory);
  }

  if (!campState.inventory.fish || typeof campState.inventory.fish !== "object" || Array.isArray(campState.inventory.fish)) {
    campState.inventory.fish = {};
  }

  if (!campState.inventory.meals || typeof campState.inventory.meals !== "object" || Array.isArray(campState.inventory.meals)) {
    campState.inventory.meals = {};
  }

  if (!campState.inventory.ingredients || typeof campState.inventory.ingredients !== "object" || Array.isArray(campState.inventory.ingredients)) {
    campState.inventory.ingredients = {};
  }

  return campState.inventory;
}

function getInventoryBucket(type, state) {
  const inventory = getInventory(state);
  const bucketName = type === "meals" ? "meals" : (type === "ingredients" ? "ingredients" : "fish");

  return inventory[bucketName];
}

function getInventoryCatalog(type) {
  if (type === "meals") return mealCatalog;
  if (type === "ingredients") return ingredientCatalog;
  return fishCatalog;
}

function getInventoryItemCount(type, id, state) {
  const bucket = getInventoryBucket(type, state);
  return Math.max(0, Math.floor(Number(bucket[id]) || 0));
}

function getInventoryTotal(type, state) {
  const bucket = getInventoryBucket(type, state);

  return Object.keys(bucket).reduce(function(total, id) {
    return total + Math.max(0, Math.floor(Number(bucket[id]) || 0));
  }, 0);
}

function getFishInventoryTotal(state) {
  return getInventoryTotal("fish", state);
}

function getAvailableFishStorageSlots(state) {
  return Math.max(0, fishInventoryCapacity - getFishInventoryTotal(state));
}

function isFishInventoryFull(state) {
  return getAvailableFishStorageSlots(state) <= 0;
}

function addInventoryItem(type, id, count, state) {
  const catalog = getInventoryCatalog(type);

  if (!catalog[id]) {
    return false;
  }

  const bucket = getInventoryBucket(type, state);
  const addCount = Math.max(1, Math.floor(Number(count) || 1));
  const availableCount = type === "fish" ? Math.min(addCount, getAvailableFishStorageSlots(state)) : addCount;

  if (availableCount <= 0) {
    return false;
  }

  bucket[id] = getInventoryItemCount(type, id, state) + availableCount;
  return true;
}

function removeInventoryItem(type, id, count, state) {
  const bucket = getInventoryBucket(type, state);
  const removeCount = Math.max(1, Math.floor(Number(count) || 1));
  const currentCount = getInventoryItemCount(type, id, state);

  if (currentCount < removeCount) {
    return false;
  }

  const nextCount = currentCount - removeCount;

  if (nextCount > 0) {
    bucket[id] = nextCount;
  } else {
    delete bucket[id];
  }

  return true;
}

function getFishDefinition(id) {
  return id && fishCatalog[id] ? fishCatalog[id] : null;
}

function getMealDefinition(id) {
  return id && mealCatalog[id] ? mealCatalog[id] : null;
}

function getFishingProgress(state) {
  const campState = state || gameState;

  if (!campState.fishing || typeof campState.fishing !== "object" || Array.isArray(campState.fishing)) {
    campState.fishing = sanitizeFishingProgress();
  }

  campState.fishing = sanitizeFishingProgress(campState.fishing);
  return campState.fishing;
}

function getCookingProgress(state) {
  const campState = state || gameState;

  if (!campState.cooking || typeof campState.cooking !== "object" || Array.isArray(campState.cooking)) {
    campState.cooking = sanitizeCookingProgress();
  }

  campState.cooking = sanitizeCookingProgress(campState.cooking);
  return campState.cooking;
}

function getCookingDailyProgress(state) {
  const progress = getCookingProgress(state);
  const dateKey = getLocalDateKey();

  if (progress.autoCookDate !== dateKey) {
    progress.autoCookDate = dateKey;
    progress.autoCookedToday = 0;
  }

  return progress;
}

function getAutoCookedToday(state) {
  return getCookingDailyProgress(state).autoCookedToday;
}

function canAutoCookToday(state) {
  return getAutoCookedToday(state) < dailyAutoCookingLimit;
}

function recordAutoCookingCompletion(state) {
  const progress = getCookingDailyProgress(state);
  progress.autoCookedToday = Math.min(dailyAutoCookingLimit, progress.autoCookedToday + 1);
}

function isCoolerItem(item) {
  return Boolean(item && item.category === "cooler");
}

function getCoolerItems() {
  return getGearItems().filter(isCoolerItem);
}

function hasInventoryStorageUnlocked(state) {
  return getCoolerItems().some(function(item) {
    return ownsGear(item.id, state);
  });
}

function hasPlacedInventoryCooler(state) {
  return getCoolerItems().some(function(item) {
    return ownsGear(item.id, state) && isGearPlaced(item.id, state);
  });
}

function canOpenInventoryFromCooler(item, state) {
  return Boolean(isCoolerItem(item) && ownsGear(item.id, state) && isGearPlaced(item.id, state));
}

function isCookingStationItem(item) {
  return Boolean(item && (item.category === "stove" || item.id === "igtCampKitchenSet" || item.id === "kitchenCarryCase"));
}

function hasCookingStationAvailable(state) {
  return getGearItems().some(function(item) {
    return isCookingStationItem(item) && ownsGear(item.id, state) && isGearPlaced(item.id, state);
  });
}

function getFirstAvailableFishId(state) {
  return Object.keys(fishCatalog).find(function(id) {
    return getInventoryItemCount("fish", id, state) > 0;
  }) || "";
}

function hasCookableFish(state) {
  return Boolean(getFirstAvailableFishId(state));
}

function getRecipeDefinition(recipeId) {
  return recipeId && cookingRecipeCatalog[recipeId] ? cookingRecipeCatalog[recipeId] : null;
}

function getDefaultCookingRecipeId() {
  return Object.keys(cookingRecipeCatalog).find(function(recipeId) {
    return cookingRecipeCatalog[recipeId].defaultUnlocked;
  }) || "simpleGrilledFish";
}

function isCookingRecipeUnlocked(recipeId, state) {
  return getCookingProgress(state).unlockedRecipes.indexOf(recipeId) !== -1;
}

function unlockCookingRecipe(recipeId, state) {
  if (!cookingRecipeCatalog[recipeId]) return false;
  const progress = getCookingProgress(state);
  if (progress.unlockedRecipes.indexOf(recipeId) !== -1) return false;
  progress.unlockedRecipes.push(recipeId);
  return true;
}

function hasRecipeIngredientCosts(recipe, state) {
  const costs = recipe && recipe.ingredientCosts ? recipe.ingredientCosts : {};
  return Object.keys(costs).every(function(ingredientId) {
    return getInventoryItemCount("ingredients", ingredientId, state) >= Math.max(0, Math.floor(Number(costs[ingredientId]) || 0));
  });
}

function consumeRecipeIngredients(recipe, state) {
  const costs = recipe && recipe.ingredientCosts ? recipe.ingredientCosts : {};
  Object.keys(costs).forEach(function(ingredientId) {
    removeInventoryItem("ingredients", ingredientId, costs[ingredientId], state);
  });
}

function chooseCookableRecipeForFish(state) {
  const progress = getCookingProgress(state);
  return progress.unlockedRecipes
    .map(getRecipeDefinition)
    .filter(function(recipe) {
      return recipe && mealCatalog[recipe.mealId] && hasRecipeIngredientCosts(recipe, state);
    })
    .sort(function(left, right) {
      return (Number(right.priority) || 0) - (Number(left.priority) || 0);
    })[0] || getRecipeDefinition(getDefaultCookingRecipeId());
}

function calculateCookingComfortBonus(state) {
  return Math.min(cookingComfortMealCap, getInventoryTotal("meals", state));
}

function chooseFishIdForRarity(rarity) {
  const fishIds = fishIdsByRarity[rarity] || fishIdsByRarity.common;

  return fishIds[Math.floor(Math.random() * fishIds.length)];
}

function chooseFishingResult() {
  const outcome = chooseWeightedAction(fishingOutcomeTable);

  if (outcome === "none") {
    return {
      caught: false,
      type: "none",
      rarity: "none",
      fishId: ""
    };
  }

  if (outcome === "turtle") {
    return {
      caught: true,
      type: "turtle",
      rarity: "special",
      fishId: ""
    };
  }

  return {
    caught: true,
    type: "fish",
    rarity: outcome,
    fishId: chooseFishIdForRarity(outcome)
  };
}

function unlockTurtleShellDivination() {
  if (!gameState.divinationUnlocks || typeof gameState.divinationUnlocks !== "object" || Array.isArray(gameState.divinationUnlocks)) {
    gameState.divinationUnlocks = sanitizeDivinationUnlocks();
  }

  if (gameState.divinationUnlocks.turtleShell) {
    showCamperThought("小乌龟又来湖边看了一眼。");
    setStatus("小乌龟慢慢游回湖里。");
    return false;
  }

  gameState.divinationUnlocks.turtleShell = true;
    showCamperThought("小乌龟拨开湖边石缝，露出三枚旧铜钱。", 4200);
    setStatus("铜钱筮占解锁了。乌龟不会进冷藏箱，也不会成为食材。");
  return true;
}

function getCoolerFullMessage() {
  return "冷藏箱已满，请清理。";
}

function getAutoCookingLimitMessage() {
  return "今天自动做菜已经到 " + dailyAutoCookingLimit + " 道，小人先不继续做饭。";
}

function handleFishingActivityCompletion() {
  const progress = getFishingProgress();

  if (hasInventoryStorageUnlocked() && isFishInventoryFull()) {
    progress.attempts += 1;
    setStatus(getCoolerFullMessage());
    showCamperThought("冷藏箱已经满了。");
    updateScreen();
    saveGame();
    return;
  }

  const result = chooseFishingResult();

  progress.attempts += 1;

  if (result.type === "turtle") {
    unlockTurtleShellDivination();
    updateScreen();
    saveGame();
    return;
  }

  if (!result.caught) {
    showCamperThought("湖面安静了一会儿，今天先空手。");
    saveGame();
    return;
  }

  const fish = getFishDefinition(result.fishId);

  if (!fish) {
    saveGame();
    return;
  }

  progress.caught += 1;

  if (!hasInventoryStorageUnlocked()) {
    progress.released += 1;
    showCamperThought("钓到" + fish.displayName + "，但没有冷藏箱，只好放回湖里。");
    saveGame();
    return;
  }

  if (!addInventoryItem("fish", fish.id, 1)) {
    progress.released += 1;
    showCamperThought("钓到" + fish.displayName + "，但冷藏箱满了，只好放回湖里。");
    setStatus(getCoolerFullMessage());
    updateScreen();
    saveGame();
    return;
  }

  showCamperThought("钓到" + fish.displayName + "。");

  if (!progress.firstStoredFishGuideSeen && hasPlacedInventoryCooler()) {
    progress.firstStoredFishGuideSeen = true;
    setStatus("第一条鱼进冷藏箱了。点击已放置的冷藏箱查看库存。");
  } else if (isFishInventoryFull()) {
    setStatus(fish.rarityLabel + "：" + fish.displayName + " 已放进冷藏箱。冷藏箱已满，请清理。");
  } else {
    setStatus(fish.rarityLabel + "：" + fish.displayName + " 已放进冷藏箱。");
  }

  updateScreen();
  saveGame();
}

function getNoFoodCookingMessage() {
  if (!hasInventoryStorageUnlocked()) {
    return "没有可用食材。先准备冷藏箱，再把钓到的鱼存起来。";
  }

  return "没有可用食材。先去湖边钓一条鱼吧。";
}

function getCookingSuccessStatus(recipe, fish, source) {
  const autoProgressText = source === "auto" ?
    " 今日自动做菜 " + getAutoCookedToday() + "/" + dailyAutoCookingLimit + "。" :
    "";
  const recipeName = recipe && recipe.displayName ? recipe.displayName : "烤湖鱼";

  if (cookingCozyReward > 0) {
    return "做出" + recipeName + "：+" + cookingCozyReward + " Cozy Points。消耗了" + fish.displayName + "。" + autoProgressText;
  }

  return "做出" + recipeName + "，消耗了" + fish.displayName + "。" + autoProgressText;
}

function cookFishFromInventory(fishId, options) {
  const actionOptions = options || {};
  const source = actionOptions.source || "manual";
  const fish = getFishDefinition(fishId);

  if (source === "auto" && !canAutoCookToday()) {
    setStatus(getAutoCookingLimitMessage());
    showCamperThought("今天先不再开火了。");
    saveGame();
    return false;
  }

  if (!hasCookingStationAvailable()) {
    setStatus("需要炉具或 camp kitchen 才能做饭。");
    showCamperThought("还没有能做饭的地方。");
    saveGame();
    return false;
  }

  const recipe = chooseCookableRecipeForFish();

  if (!fish || !recipe || !removeInventoryItem("fish", fishId, 1)) {
    const message = getNoFoodCookingMessage();
    setStatus(message);
    showCamperThought("没有可用食材。");
    saveGame();
    return false;
  }

  consumeRecipeIngredients(recipe);
  addInventoryItem("meals", recipe.mealId, 1);
  getCookingProgress().cooked += 1;

  if (source === "auto") {
    recordAutoCookingCompletion();
  }

  if (cookingCozyReward > 0) {
    gameState.cozyPoints += cookingCozyReward;
  }

  showCamperThought("把" + fish.displayName + "做成了" + recipe.displayName + "。");
  setStatus(getCookingSuccessStatus(recipe, fish, source));
  updateScreen();
  saveGame();
  return true;
}

function handleCookingActivityCompletion(options) {
  const actionOptions = options || {};
  const source = actionOptions.source || "auto";

  if (source === "auto" && !canAutoCookToday()) {
    setStatus(getAutoCookingLimitMessage());
    showCamperThought("今天先不再开火了。");
    saveGame();
    return;
  }

  cookFishFromInventory(getFirstAvailableFishId(), { source: source, fromActivity: true });
}

function handleActivityCompletionResult(activityId, options) {
  if (activityId === "fish") {
    handleFishingActivityCompletion();
    return;
  }

  if (activityId === "cook") {
    handleCookingActivityCompletion(options);
  }
}

function itemMatchesActivityGear(item, activityId) {
  const activity = getActivityDefinition(activityId);

  if (!item || !activity) {
    return false;
  }

  const gearCategories = activity.gearCategories || [];
  const gearIds = activity.gearIds || [];

  return gearIds.indexOf(item.id) !== -1 || gearCategories.indexOf(item.category) !== -1;
}

function getActivityIdForGear(item) {
  if (!item || !item.scene) {
    return "";
  }

  return getActivityIds().find(function(activityId) {
    return itemMatchesActivityGear(item, activityId);
  }) || "";
}

function activityHasRequiredGear(activity) {
  const requirements = activity && activity.requires ? activity.requires : {};
  const requiredCategories = requirements.anyGearCategory || [];
  const requiredIds = requirements.anyGearId || [];

  if (requiredCategories.length === 0 && requiredIds.length === 0) {
    return true;
  }

  return getGearItems().some(function(item) {
    return item &&
      isGearVisibleInScene(item) &&
      (requiredIds.indexOf(item.id) !== -1 || requiredCategories.indexOf(item.category) !== -1);
  });
}

function isActivityAvailable(activityId) {
  const activity = getActivityDefinition(activityId);

  if (!activity) {
    return false;
  }

  return activityHasRequiredGear(activity);
}

function getActivityGearCandidates(activityId) {
  return getGearItems().filter(function(item) {
    return itemMatchesActivityGear(item, activityId) && isGearVisibleInScene(item);
  });
}

function getActivityTargetFromGear(item, activityId) {
  const activity = getActivityDefinition(activityId);

  if (!item || !activity || !isGearVisibleInScene(item)) {
    return null;
  }

  const layout = getDisplayedGearLayoutOverride(item);
  const scenePoint = getScenePointFromAssetPoint(item, activity.targetPoint || { ratioX: 0.5, ratioY: 1 }, layout);
  const percentPoint = scenePointToPercent(scenePoint);
  const targetOffset = activity.targetOffset || { x: 0, y: 0 };
  const itemPosition = getDisplayedGearScenePosition(item);
  const faceToward = itemPosition ? scenePointToPercent(itemPosition) : null;

  return {
    x: clamp(percentPoint.x + targetOffset.x, 8, 92),
    y: clamp(percentPoint.y + targetOffset.y, 36, 90),
    interactionTargetId: item.id,
    ignoreObstacleId: item.id,
    faceToward: faceToward
  };
}

function getActivityTargetFromZone(zone, activityId) {
  const activity = getActivityDefinition(activityId || zone && zone.activityId);

  if (!zone || !activity || zone.activityId !== activity.id) {
    return null;
  }

  return Object.assign({}, zone.target || activity.fallbackTarget, {
    interactionTargetId: getActivityZoneTargetId(zone.id)
  });
}

function getActivityFallbackTarget(activity) {
  if (!activity || !activity.fallbackTarget) {
    return null;
  }

  return Object.assign({}, activity.fallbackTarget, {
    interactionTargetId: "activity:" + activity.id
  });
}

function getFixedActivityTarget(activity, preferredTargetId) {
  if (!activity) {
    return null;
  }

  const preferredZoneId = getActivityZoneIdFromTargetId(preferredTargetId);
  const preferredZone = getActivityZone(preferredZoneId);

  if (preferredZone) {
    return getActivityTargetFromZone(preferredZone, activity.id);
  }

  const zoneIds = activity.zoneIds || [];

  for (let index = 0; index < zoneIds.length; index += 1) {
    const zoneTarget = getActivityTargetFromZone(getActivityZone(zoneIds[index]), activity.id);

    if (zoneTarget) {
      return zoneTarget;
    }
  }

  return getActivityFallbackTarget(activity);
}

function resolveActivityTarget(activityId, preferredTargetId) {
  const activity = getActivityDefinition(activityId);

  if (!activity || !isActivityAvailable(activityId)) {
    return null;
  }

  if (activity.fixedTarget) {
    const fixedTarget = getFixedActivityTarget(activity, preferredTargetId);
    const preferredItem = getGearItem(preferredTargetId);

    if (fixedTarget && preferredItem && itemMatchesActivityGear(preferredItem, activityId)) {
      fixedTarget.interactionTargetId = preferredItem.id;
      fixedTarget.ignoreObstacleId = preferredItem.id;
    }

    return fixedTarget;
  }

  const preferredZoneId = getActivityZoneIdFromTargetId(preferredTargetId);
  const preferredZone = getActivityZone(preferredZoneId);

  if (preferredZone) {
    return getActivityTargetFromZone(preferredZone, activityId);
  }

  const preferredItem = getGearItem(preferredTargetId);

  if (preferredItem && itemMatchesActivityGear(preferredItem, activityId)) {
    const gearTarget = getActivityTargetFromGear(preferredItem, activityId);

    if (gearTarget) {
      return gearTarget;
    }
  }

  const gearCandidates = getActivityGearCandidates(activityId);

  if (gearCandidates.length > 0) {
    const item = gearCandidates[Math.floor(Math.random() * gearCandidates.length)];
    const gearTarget = getActivityTargetFromGear(item, activityId);

    if (gearTarget) {
      return gearTarget;
    }
  }

  const zoneIds = activity.zoneIds || [];

  for (let index = 0; index < zoneIds.length; index += 1) {
    const zoneTarget = getActivityTargetFromZone(getActivityZone(zoneIds[index]), activityId);

    if (zoneTarget) {
      return zoneTarget;
    }
  }

  return getActivityFallbackTarget(activity);
}

function isInventoryPanelOpen() {
  return Boolean(inventoryLayer && !inventoryLayer.classList.contains("hidden"));
}

function createInventoryEmptyRow(message) {
  const row = document.createElement("p");
  row.className = "inventory-empty";
  row.textContent = message;
  return row;
}

function closeFishActionMenu() {
  activeInventoryFishMenuId = "";

  if (!inventoryFishMenu) {
    return;
  }

  inventoryFishMenu.classList.add("hidden");
  inventoryFishMenu.setAttribute("aria-hidden", "true");
  inventoryFishMenu.innerHTML = "";
}

function positionFishActionMenu(anchor) {
  if (!inventoryFishMenu || !inventoryPanel || !anchor) {
    return;
  }

  const panelRect = inventoryPanel.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const menuWidth = 136;
  const menuHeight = 122;
  const left = clamp(anchorRect.right - panelRect.left - menuWidth, 8, Math.max(8, panelRect.width - menuWidth - 8));
  const top = clamp(anchorRect.top - panelRect.top + 8, 8, Math.max(8, panelRect.height - menuHeight - 8));

  inventoryFishMenu.style.left = left + "px";
  inventoryFishMenu.style.top = top + "px";
}

function createFishActionMenuButton(label, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "inventory-fish-menu-item";
  button.setAttribute("role", "menuitem");
  button.textContent = label;
  button.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    action();
  });
  return button;
}

function openFishActionMenu(fishId, anchor) {
  const fish = getFishDefinition(fishId);

  if (!inventoryFishMenu || !fish) {
    return;
  }

  activeInventoryFishMenuId = fishId;
  inventoryFishMenu.innerHTML = "";
  inventoryFishMenu.appendChild(createFishActionMenuButton("放生", function() {
    releaseFishFromInventory(fishId);
  }));
  inventoryFishMenu.appendChild(createFishActionMenuButton("烹饪", function() {
    cookFishFromInventory(fishId, { source: "menu" });
    closeFishActionMenu();
  }));
  inventoryFishMenu.appendChild(createFishActionMenuButton("交易", function() {
    tradeFishFromInventory(fishId);
  }));
  inventoryFishMenu.classList.remove("hidden");
  inventoryFishMenu.setAttribute("aria-hidden", "false");
  positionFishActionMenu(anchor);

  const firstButton = inventoryFishMenu.querySelector("button");
  if (firstButton) {
    firstButton.focus();
  }
}

function updateFishInventoryAfterAction() {
  closeFishActionMenu();
  renderInventoryPanel();
  updateScreen();
  saveGame();
}

function closeKoiReleaseCinematic() {
  if (koiReleaseCinematicTimer) {
    clearTimeout(koiReleaseCinematicTimer);
    koiReleaseCinematicTimer = null;
  }

  if (!koiReleaseCinematic) {
    return;
  }

  if (koiReleaseVideo) {
    koiReleaseVideo.pause();
    koiReleaseVideo.currentTime = 0;
  }

  koiReleaseCinematic.classList.add("hidden");
  koiReleaseCinematic.setAttribute("aria-hidden", "true");
}

function startKoiReleaseCinematic() {
  setStatus("好像有什么改变了……");

  if (!koiReleaseCinematic) {
    return;
  }

  closeKoiReleaseCinematic();
  koiReleaseCinematic.classList.remove("hidden");
  koiReleaseCinematic.setAttribute("aria-hidden", "false");

  if (koiReleaseVideo) {
    koiReleaseVideo.currentTime = 0;
    const playPromise = koiReleaseVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function() {});
    }
  }

  koiReleaseCinematicTimer = setTimeout(closeKoiReleaseCinematic, 8500);
}

function maybeUnlockKoiReleaseCinematic() {
  const progress = getFishingProgress();

  if (progress.koiReleaseAnimationSeen || progress.releasedByPlayer < koiReleaseAnimationThreshold) {
    return false;
  }

  progress.koiReleaseAnimationSeen = true;
  startKoiReleaseCinematic();
  return true;
}

function releaseFishFromInventory(fishId) {
  const fish = getFishDefinition(fishId);

  if (!fish || !removeInventoryItem("fish", fishId, 1)) {
    setStatus("这条鱼已经不在冷藏箱里了。");
    updateFishInventoryAfterAction();
    return false;
  }

  const progress = getFishingProgress();
  progress.released += 1;
  progress.releasedByPlayer += 1;
  showCamperThought(fish.displayName + "回到湖里了。");
  setStatus("放生了" + fish.displayName + "。冷藏箱 " + getFishInventoryTotal() + "/" + fishInventoryCapacity + "。");
  maybeUnlockKoiReleaseCinematic();
  updateFishInventoryAfterAction();
  return true;
}

function tradeFishFromInventory(fishId) {
  const fish = getFishDefinition(fishId);

  if (!fish || !removeInventoryItem("fish", fishId, 1)) {
    setStatus("这条鱼已经不在冷藏箱里了。");
    updateFishInventoryAfterAction();
    return false;
  }

  showCamperThought("冷藏箱空出一点位置。");
  setStatus("用" + fish.displayName + "换成了一点营地补给。暂无额外数值收益。");
  updateFishInventoryAfterAction();
  return true;
}

function createInventoryItemRow(item, count, type) {
  const row = document.createElement("article");
  const image = document.createElement("img");
  const copy = document.createElement("div");
  const name = document.createElement("h3");
  const detail = document.createElement("p");
  const countBadge = document.createElement("strong");

  row.className = "inventory-item";
  image.className = "inventory-item-icon";
  image.src = withVersion(item.image);
  image.alt = "";
  copy.className = "inventory-item-copy";
  name.textContent = item.displayName;
  detail.textContent = item.rarityLabel || item.detail || "";
  countBadge.className = "inventory-item-count";
  countBadge.textContent = "x" + count;

  copy.appendChild(name);
  copy.appendChild(detail);
  row.appendChild(image);
  row.appendChild(copy);
  row.appendChild(countBadge);

  if (type === "fish") {
    row.classList.add("inventory-item-actionable");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-haspopup", "menu");
    row.setAttribute("aria-label", item.displayName + "，数量 " + count + "。打开操作菜单。");
    row.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      openFishActionMenu(item.id, row);
    });
    row.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      event.stopPropagation();
      openFishActionMenu(item.id, row);
    });
    row.addEventListener("keydown", function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFishActionMenu(item.id, row);
      } else if (event.key === "Escape") {
        closeFishActionMenu();
      }
    });
  }

  return row;
}

function renderInventoryGroup(container, type, emptyMessage) {
  const bucket = getInventoryBucket(type);
  const catalog = getInventoryCatalog(type);
  let renderedCount = 0;

  if (!container) {
    return;
  }

  container.innerHTML = "";

  Object.keys(catalog).forEach(function(id) {
    const count = Math.max(0, Math.floor(Number(bucket[id]) || 0));

    if (count <= 0) {
      return;
    }

    container.appendChild(createInventoryItemRow(catalog[id], count, type));
    renderedCount += 1;
  });

  if (renderedCount === 0) {
    container.appendChild(createInventoryEmptyRow(emptyMessage));
  }
}

function renderInventoryPanel() {
  if (!inventoryLayer) {
    return;
  }

  renderInventoryGroup(inventoryFishList, "fish", "还没有存放的鱼。");
  renderInventoryGroup(inventoryMealList, "meals", "还没有做好的料理。");
  renderInventoryGroup(inventoryIngredientList, "ingredients", "还没有冒险带回的料理原料。");

  if (inventoryStatsLine) {
    const fishing = getFishingProgress();
    const cooking = getCookingProgress();
    inventoryStatsLine.textContent = "Fish " + getFishInventoryTotal() + "/" + fishInventoryCapacity +
      " · Fishing " + fishing.attempts + " / caught " + fishing.caught +
      " / released " + fishing.released + " · Cooked " + cooking.cooked +
      " · Recipes " + cooking.unlockedRecipes.length + "/" + Object.keys(cookingRecipeCatalog).length +
      " · Auto today " + getAutoCookedToday() + "/" + dailyAutoCookingLimit;
  }
}

function openInventoryPanel() {
  if (!inventoryLayer) {
    return;
  }

  if (!hasPlacedInventoryCooler()) {
    setStatus("放置一个冷藏箱后才能查看 inventory。");
    return;
  }

  closeShop();
  triggerInteractionSounds("coolerOpen");
  renderInventoryPanel();
  inventoryLayer.classList.remove("hidden");
  inventoryLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("inventory-open");
}

function closeInventoryPanel() {
  if (!inventoryLayer) {
    return;
  }

  inventoryLayer.classList.add("hidden");
  inventoryLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("inventory-open");
  closeFishActionMenu();
}

function syncInventoryPanel() {
  if (!isInventoryPanelOpen()) {
    closeFishActionMenu();
    return;
  }

  if (!hasPlacedInventoryCooler()) {
    closeInventoryPanel();
    return;
  }

  renderInventoryPanel();
}

function updateCoolerFullHint() {
  const shouldShow = Boolean(coolerFullHint && hasInventoryStorageUnlocked() && isFishInventoryFull());

  if (!coolerFullHint) {
    return;
  }

  coolerFullHint.classList.toggle("hidden", !shouldShow);
  coolerFullHint.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  coolerFullHint.setAttribute("title", getCoolerFullMessage());
  coolerFullHint.setAttribute("aria-label", getCoolerFullMessage());
}
