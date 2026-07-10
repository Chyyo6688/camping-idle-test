// Gear ownership rules, unlock requirements, comfort, warmth, and economy math.

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

  comfort += calculateCookingComfortBonus(state);

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
  const gearCapSeconds = baseOfflineSeconds + (tentItem && Number(tentItem.offlineBonusSeconds) || 0);
  return Math.min(maxOfflineEarningsSeconds, gearCapSeconds);
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
