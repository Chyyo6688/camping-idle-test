// Shop rendering, purchases, equipment, placement controls, and mode toggles.

function getShopGroupsInOrder() {
  return Object.keys(shopGroupData).filter(function(groupId) {
    const group = shopGroupData[groupId];
    return group && group.visible !== false;
  });
}

function getShopItemsForGroup(groupId) {
  const group = shopGroupData[groupId];
  const categoryOrder = group && Array.isArray(group.categories) ? group.categories : [];

  return getGearItems()
    .filter(function(item) {
      return isGearVisibleInShop(item) && item.shopGroup === groupId;
    })
    .sort(function(a, b) {
      const categoryA = categoryOrder.indexOf(a.category);
      const categoryB = categoryOrder.indexOf(b.category);

      const orderA = categoryA === -1 ? 999 : categoryA;
      const orderB = categoryB === -1 ? 999 : categoryB;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return (Number(a.cost) || 0) - (Number(b.cost) || 0);
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
  setImageSourceIfChanged(card.image, getCampfireShopImage());

  if (campfireUpgradeInFlight) {
    card.button.disabled = true;
    card.button.classList.add("action-buy");
    card.detailLabel.textContent = "Loading campfire assets";
    card.actionLabel.textContent = "UPGRADING…";
    return;
  }

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

  if (item.interactions && item.interactions.upgradeCampfire) {
    updateCampfireShopCard(item, card);
    return;
  }

  setImageSourceIfChanged(card.image, withVersion(item.image));

  const isOwned = ownsGear(item.id);
  const isEquipped = isEquippableGear(item) && getEquippedGearId(item.category) === item.id;
  const isPlaceable = isGearPlaceable(item);
  const isPlaced = isPlaceable && isGearPlaced(item.id);
  const isTarpInScene = isTarpItem(item) && isEquipped;
  const missingRequirements = getMissingGearRequirements(item);
  const isLocked = missingRequirements.length > 0;

  // Tarps use the equip slot internally, but should carry the same visual
  // classes as placeable gear (placed, not equipped) so the PACK/PLACE button
  // colours match the rest of the shop.
  card.button.classList.toggle("owned", isOwned);
  card.button.classList.toggle("equipped", isEquipped && !isTarpItem(item));
  card.button.classList.toggle("placed", isPlaced || isTarpInScene);
  card.button.classList.toggle("locked", isLocked && !isOwned);
  card.button.classList.remove("action-buy", "action-place", "action-pack", "action-equip", "action-equipped", "action-locked");
  card.detailLabel.textContent = isLocked && !isOwned ? missingRequirements.join(", ") : item.detail;

  if (isVehicleItem(item) && updateVehicleShopCard(item, card, isOwned, isEquipped, isPlaced, isLocked)) {
    return;
  }

  if (isTarpItem(item) && isOwned) {
    // Tarps reuse the same PLACE / PACK button styling as other placeable gear.
    card.button.disabled = false;

    if (isEquipped) {
      card.button.classList.add("action-pack");
      card.actionLabel.textContent = "PACK";
      card.button.setAttribute("data-price", "PLACED");
    } else {
      card.button.classList.add("action-place");
      card.actionLabel.textContent = "PLACE";
      card.button.setAttribute("data-price", "OWNED");
    }
  } else if (isEquipped) {
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

function spendCozyPoints(cost) {
  if (gameState.cozyPoints < cost) {
    return false;
  }

  gameState.cozyPoints -= cost;
  return true;
}

function upgradeCampfire() {
  if (campfireUpgradeInFlight || gameState.campfireLevel >= 3) {
    return;
  }

  const sourceLevel = gameState.campfireLevel;
  const nextLevel = sourceLevel + 1;
  const cost = getCampfireUpgradeCost();

  if (cost <= 0 || gameState.cozyPoints < cost) {
    return;
  }

  campfireUpgradeInFlight = true;
  updateShopCards();

  preloadCampfireLevelAssets(nextLevel).then(function() {
    if (gameState.campfireLevel !== sourceLevel || !spendCozyPoints(cost)) {
      return;
    }

    gameState.campfireLevel = nextLevel;
    setStatus("The campfire burns cleaner and warmer.");
    updateScreen();
    saveGame();
  }).catch(function() {
    setStatus("The campfire upgrade image could not be loaded. Please try again.");
  }).finally(function() {
    campfireUpgradeInFlight = false;
    updateShopCards();
  });
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

function packTarp(item) {
  if (!isTarpItem(item) || getEquippedGearId(item.category) !== item.id) {
    return false;
  }

  delete gameState.equippedGear[item.category];
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

  if (ownsGear(item.id) && isTarpItem(item)) {
    // Tarps keep the single-slot equip behaviour, but present the same
    // place / pack flow (and button styling) as other placeable gear.
    if (getEquippedGearId(item.category) === item.id) {
      if (packTarp(item)) {
        setStatus(item.displayName + " is packed away.");
        updateScreen();
        saveGame();
      }
    } else if (equipGear(item)) {
      setStatus(item.displayName + " is placed in camp.");
      updateScreen();
      saveGame();
    }
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

  const wasBuildModeUnlocked = isBuildModeUnlocked();

  if (buyGear(item)) {
    const buildModeJustUnlocked = !wasBuildModeUnlocked && isBuildModeUnlocked();
    setStatus(buildModeJustUnlocked ? "Build Mode unlocked. Tap Build to move camp items." : isEquippableGear(item) || isGearPlaceable(item) ? item.displayName + " joins the campsite." : item.displayName + " is owned.");
    updateScreen();
    saveGame();

    if (onboardingActive && getOnboardingStep() && getOnboardingStep().id === "chair" && item.id === ONBOARDING_FIRST_GEAR_ID) {
      advanceOnboarding();
    }
  }
}

function openShop() {
  closeInventoryPanel();
  document.body.classList.add("shop-open");
  shopDrawer.setAttribute("aria-hidden", "false");
  setShopFilter(activeShopFilter);

  if (onboardingActive && getOnboardingStep() && getOnboardingStep().id === "shop") {
    advanceOnboarding();
  }
}

function closeShop() {
  document.body.classList.remove("shop-open");
  shopDrawer.setAttribute("aria-hidden", "true");
}

function toggleShop() {
  if (isBuildModeActive()) {
    setStatus("Tap Done before opening Shop.");
    return;
  }

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
  const shouldChooseGatherAction = gameState.gatherWoodMode ? interruptRelaxingActionForGatherMode() : false;

  if (!gameState.gatherWoodMode || !shouldChooseGatherAction) {
    camper.actionTimer = 0;
  }

  setStatus(gameState.gatherWoodMode ? "The camper will automatically collect fallen branches." : "Gather is off. You can still tap branches by hand.");
  updateScreen();
  saveGame();

  if (shouldChooseGatherAction) {
    chooseNextCamperAction();
  }

  if (onboardingActive && getOnboardingStep() && getOnboardingStep().id === "gather" && gameState.gatherWoodMode) {
    advanceOnboarding();
  }
}

function interruptRelaxingActionForGatherMode() {
  if (activeQueuedAction || camper.carryingWood) {
    return false;
  }

  if (camperMotionFrameId !== null && typeof window !== "undefined" && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(camperMotionFrameId);
    camperMotionFrameId = null;
  }

  camper.state = "idle";
  camper.pose = "idle";
  camper.target = null;
  camper.actionAfterArrival = null;
  camper.currentAction = "idle";
  camper.currentActivityId = "";
  camper.actionTimer = 0;
  camper.targetWoodId = null;
  camper.woodCollectionSource = null;
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathStartedAt = 0;
  camper.pathDurationMs = 0;
  camper.pathLength = 0;
  camper.interactionTargetId = "";

  updateCamperView();
  return true;
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

function pauseCamperForBuildMode() {
  if (camperMotionFrameId !== null && typeof window !== "undefined" && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(camperMotionFrameId);
    camperMotionFrameId = null;
  }

  if (activeQueuedAction) {
    actionQueue.unshift(activeQueuedAction);
    activeQueuedAction = null;
  }

  camper.state = "idle";
  camper.pose = "idle";
  camper.target = null;
  camper.actionAfterArrival = null;
  camper.currentAction = "idle";
  camper.currentActivityId = "";
  camper.actionTimer = Number.POSITIVE_INFINITY;
  camper.targetWoodId = null;
  camper.woodCollectionSource = null;
  camper.carryingWood = false;
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathStartedAt = 0;
  camper.pathDurationMs = 0;
  camper.pathLength = 0;
  camper.interactionTargetId = "";

  updateActionQueueIndicators();
  updateCamperView();
}

function refreshCamperBesideCampfire() {
  camper.x = campSpots.fireSeat.x;
  camper.y = campSpots.fireSeat.y;
  camper.state = "idle";
  camper.pose = "idle";
  camper.target = null;
  camper.actionAfterArrival = null;
  camper.currentAction = "idle";
  camper.currentActivityId = "";
  camper.actionTimer = Date.now() + 250;
  camper.targetWoodId = null;
  camper.woodCollectionSource = null;
  camper.carryingWood = false;
  camper.facing = "right";
  camper.animationStartedAt = Date.now();
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathStartedAt = 0;
  camper.pathDurationMs = 0;
  camper.pathLength = 0;
  camper.interactionTargetId = "";

  updateCamperView();
}

function enterBuildMode() {
  if (!isBuildModeUnlocked()) {
    setStatus("Buy more camp gear to unlock Build Mode.");
    return;
  }

  if (buildModeActive) {
    return;
  }

  closeShop();
  closeInventoryPanel();
  clearSelectedActionTarget();
  clearSelectedBuildTarget();
  buildModeActive = true;
  depthControlHoverTargetId = "";
  pauseCamperForBuildMode();
  updateBuildModeControls();
  updateSceneEquipment();
  setStatus("Build Mode: drag placed items, then tap Done.");
}

function exitBuildMode() {
  if (!buildModeActive) {
    updateBuildModeControls();
    return;
  }

  finishBuildDrag();
  depthControlHoverTargetId = "";
  clearSelectedBuildTarget();
  buildModeActive = false;
  clearSelectedActionTarget();
  refreshCamperBesideCampfire();
  updateBuildModeControls();
  updateSceneEquipment();
  updateActionQueueIndicators();
  saveGame();
  setStatus("Done. The camper returns to the fire.");
  chooseNextCamperAction();
}

function toggleBuildMode() {
  if (buildModeActive) {
    exitBuildMode();
  } else {
    enterBuildMode();
  }
}
