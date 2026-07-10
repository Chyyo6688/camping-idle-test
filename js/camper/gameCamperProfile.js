// Onboarding, tutorials, camper appearance, personality quiz, and Camper Card.

function getOnboardingFirstGearItem() {
  return getGearItem(ONBOARDING_FIRST_GEAR_ID);
}

function getOnboardingStep() {
  if (activeGuideType !== "onboarding") {
    return standaloneGuides[activeStandaloneGuideId] || null;
  }

  return onboardingSteps[onboardingStepIndex] || null;
}

function isShopOpen() {
  return document.body.classList.contains("shop-open");
}

function getOnboardingFirstGearCard() {
  return shopCards[ONBOARDING_FIRST_GEAR_ID] || null;
}

function getInteractionGuideTargetItem() {
  const firstGear = getGearItem(ONBOARDING_FIRST_GEAR_ID);

  if (firstGear && ownsGear(firstGear.id) && isGearVisibleInScene(firstGear)) {
    return firstGear;
  }

  const tentItem = getEquippedGearItem("tent");

  if (tentItem && isGearVisibleInScene(tentItem)) {
    return tentItem;
  }

  return null;
}

function getOnboardingTarget(step) {
  if (!step) {
    return null;
  }

  if (step.id === "tapInteraction") {
    const targetItem = getInteractionGuideTargetItem();
    return targetItem ? getGearSceneElement(targetItem) : null;
  }

  if (step.id === "buildMode") {
    return buildModeToggle;
  }

  if (step.id === "gather") {
    return gatherWoodToggle;
  }

  if (step.id === "fire") {
    return campfire;
  }

  if (step.id === "warmth") {
    return warmthStatus;
  }

  if (step.id === "cozy") {
    return cozyPointStatus;
  }

  if (step.id === "shop") {
    return shopToggle;
  }

  if (step.id === "chair") {
    const chairCard = getOnboardingFirstGearCard();
    return chairCard && chairCard.detailLabel || chairCard && chairCard.button || null;
  }

  if (step.id === "comfort") {
    return comfortStatus;
  }

  return null;
}

function getOnboardingStepBody(step) {
  const firstGear = getOnboardingFirstGearItem();
  const firstGearName = firstGear ? firstGear.displayName : "first chair";
  const firstGearComfort = firstGear ? Number(firstGear.comfort) || 0 : 0;
  const firstGearCost = firstGear ? Number(firstGear.cost) || 0 : 0;
  const missingPoints = Math.max(0, firstGearCost - gameState.cozyPoints);

  if (!step) {
    return "";
  }

  if (step.body) {
    return step.body;
  }

  if (step.id === "gather") {
    return gameState.gatherWoodMode ?
      "Gather is on, so the camper automatically collects fallen branches. You can still tap a branch to send the camper to that one." :
      "Tap Gather to turn on automatic branch collecting. Even with Gather Off, you can tap fallen branches to send the camper to feed the fire.";
  }

  if (step.id === "fire") {
    return gameState.warmthSeconds > 0 ?
      "The fire is lit. Branches add Warmth after the camper carries them back to the campfire." :
      "The camper is bringing branches to the fire. You can also tap any fallen branch to send the camper over.";
  }

  if (step.id === "warmth") {
    return "Warmth shows how cozy and alive your camp feels. Keep the fire going to maintain Warmth. If Warmth reaches 0, your camp stops earning Cozy Points.";
  }

  if (step.id === "cozy") {
    return "Cozy Points are the main progress points. Spend them on gear, upgrades, and later unlocks.";
  }

  if (step.id === "shop") {
    return "Open Shop once the fire has earned points. The first useful goal is " + firstGearName + ".";
  }

  if (step.id === "chair") {
    if (ownsGear(ONBOARDING_FIRST_GEAR_ID)) {
      return firstGearName + " is owned. Its +" + firstGearComfort + " Comfort now helps the camp earn faster.";
    }

    if (missingPoints > 0) {
      return firstGearName + " costs " + formatNumber(firstGearCost) + " CP and gives +" + firstGearComfort + " Comfort. You need " + formatNumber(missingPoints) + " more CP, so keep Gather on or tap fallen branches to feed the fire.";
    }

    return "Tap the " + firstGearName + " card. It gives +" + firstGearComfort + " Comfort, and Comfort raises Cozy Point production.";
  }

  if (step.id === "comfort") {
    return "Comfort is now part of the loop: Gather, Warmth, Cozy Points, gear, Comfort, faster Cozy Points.";
  }

  return "";
}

function getOnboardingPrimaryLabel(step) {
  const firstGear = getOnboardingFirstGearItem();
  const firstGearName = firstGear ? firstGear.displayName : "chair";
  const firstGearCost = firstGear ? Number(firstGear.cost) || 0 : 0;
  const missingPoints = Math.max(0, firstGearCost - gameState.cozyPoints);

  if (!step) {
    return "Next";
  }

  if (step.primaryLabel) {
    return step.primaryLabel;
  }

  if (step.id === "gather") {
    return gameState.gatherWoodMode ? "Next" : "Tap Gather";
  }

  if (step.id === "shop") {
    return isShopOpen() ? "Next" : "Tap Shop";
  }

  if (step.id === "fire") {
    return gameState.warmthSeconds > 0 ? "Next" : "Waiting for wood";
  }

  if (step.id === "chair") {
    if (ownsGear(ONBOARDING_FIRST_GEAR_ID)) {
      return "Next";
    }

    if (missingPoints > 0) {
      return "Need " + formatNumber(missingPoints) + " CP";
    }

    return "Tap " + firstGearName;
  }

  if (step.id === "comfort") {
    return "Finish";
  }

  return "Next";
}

function canAdvanceOnboarding(step) {
  if (!step) {
    return false;
  }

  if (activeGuideType !== "onboarding") {
    return true;
  }

  if (step.id === "gather") {
    return gameState.gatherWoodMode;
  }

  if (step.id === "shop") {
    return isShopOpen();
  }

  if (step.id === "fire") {
    return gameState.warmthSeconds > 0;
  }

  if (step.id === "chair") {
    return ownsGear(ONBOARDING_FIRST_GEAR_ID);
  }

  return true;
}

function clearOnboardingHighlight() {
  if (onboardingHighlightedElement) {
    onboardingHighlightedElement.classList.remove("onboarding-highlight");
  }

  if (onboardingCardFocusElement) {
    onboardingCardFocusElement.classList.remove("onboarding-card-focus");
  }

  onboardingHighlightedElement = null;
  onboardingCardFocusElement = null;
}

function focusOnboardingShopCard() {
  const chairCard = getOnboardingFirstGearCard();

  if (!chairCard || !chairCard.button) {
    return;
  }

  chairCard.button.scrollIntoView({ block: "center", inline: "nearest" });
}

function applyOnboardingStepSetup(step) {
  if (!step) {
    return;
  }

  if (step.id === "tapInteraction" || step.id === "buildMode") {
    if (isShopOpen()) {
      closeShop();
    }
    return;
  }

  if (step.id === "chair") {
    openShop();
    setShopFilter("living");
    requestAnimationFrame(function() {
      focusOnboardingShopCard();
      positionOnboardingLayer();
    });
    return;
  }

  if (step.id !== "shop" && isShopOpen()) {
    closeShop();
  }
}

function positionOnboardingLayer() {
  if (!onboardingActive || !onboardingLayer || !onboardingPanel || !onboardingPointer || !gameViewport) {
    return;
  }

  const target = onboardingHighlightedElement || getOnboardingTarget(getOnboardingStep());

  if (!target) {
    return;
  }

  const viewportRect = gameViewport.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  if (viewportRect.width <= 0 || viewportRect.height <= 0 || targetRect.width <= 0 || targetRect.height <= 0) {
    return;
  }

  const targetCenterX = targetRect.left - viewportRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top - viewportRect.top + targetRect.height / 2;
  const targetTop = targetRect.top - viewportRect.top;
  const targetBottom = targetRect.bottom - viewportRect.top;
  const margin = Math.max(8, Math.min(14, viewportRect.width * 0.035));
  const gap = 18;

  onboardingPanel.style.left = margin + "px";
  onboardingPanel.style.top = margin + "px";
  onboardingPanel.style.bottom = "auto";

  const panelRect = onboardingPanel.getBoundingClientRect();
  const panelWidth = Math.min(panelRect.width, viewportRect.width - margin * 2);
  const panelHeight = Math.min(panelRect.height, viewportRect.height - margin * 2);
  const maxLeft = Math.max(margin, viewportRect.width - panelWidth - margin);
  const maxTop = Math.max(margin, viewportRect.height - panelHeight - margin);
  const left = clamp(targetCenterX - panelWidth / 2, margin, maxLeft);
  const belowTop = targetBottom + gap;
  const aboveTop = targetTop - panelHeight - gap;
  const hasRoomBelow = belowTop + panelHeight <= viewportRect.height - margin;
  const hasRoomAbove = aboveTop >= margin;
  let top = belowTop;
  let pointsUp = true;

  if ((!hasRoomBelow && hasRoomAbove) || targetCenterY > viewportRect.height * 0.58) {
    top = aboveTop;
    pointsUp = false;
  }

  top = clamp(top, margin, maxTop);

  onboardingPanel.style.left = left + "px";
  onboardingPanel.style.top = top + "px";

  if (pointsUp) {
    onboardingPointer.classList.add("point-up");
    onboardingPointer.classList.remove("point-down");
    onboardingPointer.style.top = clamp(top - 10, margin, viewportRect.height - margin) + "px";
  } else {
    onboardingPointer.classList.add("point-down");
    onboardingPointer.classList.remove("point-up");
    onboardingPointer.style.top = clamp(top + panelHeight + 10, margin, viewportRect.height - margin) + "px";
  }

  onboardingPointer.style.left = clamp(targetCenterX, left + 16, left + panelWidth - 16) + "px";
}

function updateOnboardingView() {
  if (!onboardingActive || !onboardingLayer) {
    return;
  }

  const step = getOnboardingStep();
  const target = getOnboardingTarget(step);

  clearOnboardingHighlight();

  if (target) {
    target.classList.add("onboarding-highlight");
    onboardingHighlightedElement = target;
  }

  if (step && step.id === "chair") {
    const chairCard = getOnboardingFirstGearCard();

    if (chairCard && chairCard.button) {
      chairCard.button.classList.add("onboarding-card-focus");
      onboardingCardFocusElement = chairCard.button;
    }
  }

  onboardingStepLabel.textContent = activeGuideType === "onboarding" ?
    "Guide " + (onboardingStepIndex + 1) + " / " + onboardingSteps.length :
    (step && step.stepLabel || "Guide");
  onboardingTitle.textContent = step ? step.title : "";
  onboardingBody.textContent = getOnboardingStepBody(step);
  onboardingPrimaryButton.textContent = getOnboardingPrimaryLabel(step);
  onboardingPrimaryButton.disabled = !canAdvanceOnboarding(step);
  onboardingSkipButton.textContent = onboardingManual || activeGuideType !== "onboarding" ? "Close" : "Skip";

  requestAnimationFrame(positionOnboardingLayer);
}

function showOnboardingStep() {
  const step = getOnboardingStep();

  if (!step || !onboardingLayer) {
    return;
  }

  onboardingLayer.classList.remove("hidden");
  onboardingLayer.setAttribute("aria-hidden", "false");
  applyOnboardingStepSetup(step);
  updateOnboardingView();
}

function completeOnboarding(markSeen) {
  const completedGuideType = activeGuideType;
  const completedStandaloneGuideId = activeStandaloneGuideId;

  onboardingActive = false;
  clearOnboardingHighlight();

  if (onboardingLayer) {
    onboardingLayer.classList.add("hidden");
    onboardingLayer.setAttribute("aria-hidden", "true");
  }

  if (markSeen) {
    if (completedGuideType === "onboarding") {
      gameState.onboardingSeen = true;
    } else if (completedStandaloneGuideId === "tapInteraction") {
      gameState.interactionGuideSeen = true;
    } else if (completedStandaloneGuideId === "buildMode") {
      gameState.buildModeGuideSeen = true;
    }

    saveGame();
  }

  activeGuideType = "onboarding";
  activeStandaloneGuideId = "";
}

function advanceOnboarding() {
  if (!onboardingActive) {
    return;
  }

  const step = getOnboardingStep();

  if (!canAdvanceOnboarding(step)) {
    updateOnboardingView();
    return;
  }

  if (activeGuideType !== "onboarding") {
    completeOnboarding(true);
    return;
  }

  if (onboardingStepIndex >= onboardingSteps.length - 1) {
    completeOnboarding(true);
    setStatus("Guide complete. Keep the fire warm and make camp cozier.");
    maybeStartInteractionGuide();
    return;
  }

  onboardingStepIndex += 1;
  showOnboardingStep();
}

function startOnboarding(isManual) {
  if (!hasCamperProfile(gameState) || camperProfileActive) {
    return;
  }

  onboardingManual = Boolean(isManual);
  activeGuideType = "onboarding";
  activeStandaloneGuideId = "";
  onboardingActive = true;
  onboardingStepIndex = 0;
  showOnboardingStep();
}

function startStandaloneGuide(guideId) {
  if (!hasCamperProfile(gameState) || camperProfileActive || onboardingActive || !standaloneGuides[guideId]) {
    return;
  }

  onboardingManual = false;
  activeGuideType = "standalone";
  activeStandaloneGuideId = guideId;
  onboardingActive = true;
  onboardingStepIndex = 0;
  showOnboardingStep();
}

function sanitizeCamperName(name) {
  return String(name || "").trim().replace(/\s+/g, " ").slice(0, 18);
}

function sanitizeCamperCatchphrase(catchphrase) {
  return String(catchphrase || "").trim().replace(/\s+/g, " ").slice(0, 42);
}

function getCamperPersonality(personalityId) {
  return CAMPER_PERSONALITIES[personalityId] || CAMPER_PERSONALITIES.slowMood;
}

function getDefaultCamperCatchphrase(personalityId) {
  const personality = getCamperPersonality(personalityId);
  return personality && personality.catchphrase || "慢慢来，营地会等我。";
}

function getCamperCardBackgroundPath(personalityId) {
  const personality = getCamperPersonality(personalityId);
  return personality && personality.cardBackground || CAMPER_PERSONALITIES.slowMood.cardBackground;
}

function getRandomCamperName() {
  const names = ["Moss", "Juniper", "Pudding", "Nori", "Pebble", "Miso", "Bramble", "Sunny", "Pickle", "Maple", "Toast", "Kiki"];
  return names[Math.floor(Math.random() * names.length)];
}

function getCamperAppearanceOptions(categoryId) {
  return CAMPER_APPEARANCE_OPTIONS[categoryId] || [];
}

function getCamperAppearanceCategory(categoryId) {
  return CAMPER_APPEARANCE_CATEGORIES.find(function(category) {
    return category.id === categoryId;
  }) || null;
}

function isCamperAppearanceRangeCategory(category) {
  return Boolean(category && category.control === "range");
}

function getCamperAppearanceRangeValue(value, category) {
  const min = Number.isFinite(category && category.min) ? category.min : 0;
  const max = Number.isFinite(category && category.max) ? category.max : min;
  const step = Number.isFinite(category && category.step) && category.step > 0 ? category.step : 1;
  const defaultValue = Number.isFinite(category && category.defaultValue) ? category.defaultValue : min;
  const requestedValue = Number(value);
  const safeValue = Number.isFinite(requestedValue) ? requestedValue : defaultValue;
  const steppedValue = min + Math.round((clamp(safeValue, min, max) - min) / step) * step;

  return clamp(steppedValue, min, max);
}

function getRandomCamperAppearanceRangeValue(category) {
  const min = Number.isFinite(category && category.min) ? category.min : 0;
  const max = Number.isFinite(category && category.max) ? category.max : min;
  const step = Number.isFinite(category && category.step) && category.step > 0 ? category.step : 1;
  const stepCount = Math.max(0, Math.floor((max - min) / step));

  return clamp(min + Math.floor(Math.random() * (stepCount + 1)) * step, min, max);
}

function getCamperAppearanceInputValue(input, category) {
  if (!category) {
    return undefined;
  }

  if (input[category.id] !== undefined) {
    return input[category.id];
  }

  const legacyField = CAMPER_APPEARANCE_LEGACY_FIELD_MAP[category.id];
  return legacyField ? input[legacyField] : undefined;
}

function getDefaultCamperAppearance() {
  return CAMPER_APPEARANCE_CATEGORIES.reduce(function(appearance, category) {
    if (isCamperAppearanceRangeCategory(category)) {
      appearance[category.id] = getCamperAppearanceRangeValue(category.defaultValue, category);
      return appearance;
    }

    const options = getCamperAppearanceOptions(category.id);
    appearance[category.id] = options[0] ? options[0].id : "";
    return appearance;
  }, {});
}

function normalizeCamperAppearance(appearance) {
  const input = appearance && typeof appearance === "object" ? appearance : {};
  const fallback = getDefaultCamperAppearance();

  CAMPER_APPEARANCE_CATEGORIES.forEach(function(category) {
    if (isCamperAppearanceRangeCategory(category)) {
      fallback[category.id] = getCamperAppearanceRangeValue(getCamperAppearanceInputValue(input, category), category);
      return;
    }

    const options = getCamperAppearanceOptions(category.id);
    const requestedId = getCamperAppearanceInputValue(input, category);
    const validOption = options.find(function(option) {
      return option.id === requestedId;
    });

    fallback[category.id] = validOption ? validOption.id : fallback[category.id];
  });

  return fallback;
}

function getRandomCamperAppearance() {
  return CAMPER_APPEARANCE_CATEGORIES.reduce(function(appearance, category) {
    if (isCamperAppearanceRangeCategory(category)) {
      appearance[category.id] = getRandomCamperAppearanceRangeValue(category);
      return appearance;
    }

    const options = getCamperAppearanceOptions(category.id);
    const option = options[Math.floor(Math.random() * options.length)] || options[0];
    appearance[category.id] = option ? option.id : "";
    return appearance;
  }, {});
}

function getCamperAppearanceOption(categoryId, appearance) {
  const options = getCamperAppearanceOptions(categoryId);
  const normalizedAppearance = normalizeCamperAppearance(appearance);
  return options.find(function(option) {
    return option.id === normalizedAppearance[categoryId];
  }) || options[0] || null;
}

function getCamperAppearanceOptionIndex(categoryId, appearance) {
  const options = getCamperAppearanceOptions(categoryId);
  const normalizedAppearance = normalizeCamperAppearance(appearance);
  const index = options.findIndex(function(option) {
    return option.id === normalizedAppearance[categoryId];
  });

  return index === -1 ? 0 : index;
}

function getActiveCamperAppearance() {
  const profile = getActiveCamperProfile(gameState);
  return normalizeCamperAppearance(profile && profile.appearance);
}

function getCamperLayerAssetSheet(layer, appearance) {
  if (!layer.appearanceCategory) {
    return layer.sheet;
  }

  const option = getCamperAppearanceOption(layer.appearanceCategory, appearance);
  return option && Object.prototype.hasOwnProperty.call(option, "assetSheet") ? option.assetSheet : layer.sheet;
}

function isNightFishingFrame(frameName) {
  const fishFrames = assetPaths.characters.frameNames.activityFrames.fish || [];

  return Boolean(gameState && gameState.isNight && fishFrames.indexOf(frameName) !== -1);
}

function getCamperLayerSheetPath(layer, appearance, frameName) {
  const assetSheet = getCamperLayerAssetSheet(layer, appearance);
  if (!assetSheet) {
    return "";
  }

  const sheetRoot = layer.id === "clothes" && isNightFishingFrame(frameName) ? CAMPER_NIGHT_LAYER_SHEET_ROOT : CAMPER_LAYER_SHEET_ROOT;
  return withVersion(sheetRoot + "/" + assetSheet);
}

function getCamperHairColorFilter(appearance) {
  const hairColorCategory = getCamperAppearanceCategory("hairColor");
  const normalizedAppearance = normalizeCamperAppearance(appearance);
  const hue = getCamperAppearanceRangeValue(normalizedAppearance.hairColor, hairColorCategory);

  if (hue === CAMPER_HAIR_COLOR_RANGE.defaultValue) {
    return "";
  }

  return "hue-rotate(" + hue + "deg) saturate(1.08)";
}

function getCamperSheetFrameIndex(frameName) {
  const index = CAMPER_SHEET_FRAME_NAMES.indexOf(frameName);
  return index === -1 ? 0 : index;
}

function getCamperSheetPosition(frameName) {
  const frameIndex = getCamperSheetFrameIndex(frameName);
  const column = frameIndex % CAMPER_SHEET_COLUMNS;
  const row = Math.floor(frameIndex / CAMPER_SHEET_COLUMNS);
  const x = CAMPER_SHEET_COLUMNS <= 1 ? 0 : column / (CAMPER_SHEET_COLUMNS - 1) * 100;
  const y = CAMPER_SHEET_ROWS <= 1 ? 0 : row / (CAMPER_SHEET_ROWS - 1) * 100;

  return {
    x,
    y
  };
}

function ensureCamperLayerElement(container, layer) {
  if (!container) {
    return null;
  }

  let element = container.querySelector('[data-camper-layer="' + layer.id + '"]');

  if (element && element.tagName !== "DIV") {
    element.remove();
    element = null;
  }

  if (!element) {
    element = document.createElement("div");
    element.className = "camper-layer camper-layer-" + layer.id;
    element.dataset.camperLayer = layer.id;
    container.appendChild(element);
  }

  return element;
}

function removeUnusedCamperLayerElements(container) {
  const activeLayerIds = CAMPER_LAYER_RENDER_ORDER.map(function(layer) {
    return layer.id;
  });

  Array.from(container.querySelectorAll("[data-camper-layer]")).forEach(function(element) {
    if (activeLayerIds.indexOf(element.dataset.camperLayer) === -1) {
      element.remove();
    }
  });
}

function applyCamperLayerAppearance(element, layer, appearance) {
  if (!element) {
    return;
  }

  if (layer.id === "hair") {
    const nextFilter = getCamperHairColorFilter(appearance);

    if (element.dataset.camperHairColorFilter !== nextFilter) {
      element.style.filter = nextFilter;
      element.dataset.camperHairColorFilter = nextFilter;
    }

    return;
  }

  if (element.dataset.camperHairColorFilter !== undefined) {
    element.style.filter = "";
    delete element.dataset.camperHairColorFilter;
  }
}

function renderCamperLayerStack(container, appearance, frameName) {
  if (!container) {
    return;
  }

  const normalizedAppearance = normalizeCamperAppearance(appearance);
  const activeFrameName = frameName || CAMPER_IDLE_FRAME_NAME;
  const sheetPosition = getCamperSheetPosition(activeFrameName);
  const backgroundPosition = sheetPosition.x + "% " + sheetPosition.y + "%";
  const backgroundSize = (CAMPER_SHEET_COLUMNS * 100) + "% " + (CAMPER_SHEET_ROWS * 100) + "%";

  removeUnusedCamperLayerElements(container);

  CAMPER_LAYER_RENDER_ORDER.forEach(function(layer) {
    const element = ensureCamperLayerElement(container, layer);
    const nextPath = getCamperLayerSheetPath(layer, normalizedAppearance, activeFrameName);

    if (!element) {
      return;
    }

    if (!nextPath) {
      if (element.dataset.camperLayerSrc !== "") {
        element.style.backgroundImage = "";
        element.dataset.camperLayerSrc = "";
      }
      element.style.display = "none";
      return;
    }

    if (element.style.display === "none") {
      element.style.display = "";
    }

    if (element.dataset.camperLayerSrc !== nextPath) {
      element.style.backgroundImage = 'url("' + nextPath + '")';
      element.dataset.camperLayerSrc = nextPath;
    }

    if (element.dataset.camperFramePosition !== backgroundPosition) {
      element.style.backgroundPosition = backgroundPosition;
      element.dataset.camperFramePosition = backgroundPosition;
    }

    if (element.dataset.camperBackgroundSize !== backgroundSize) {
      element.style.backgroundSize = backgroundSize;
      element.dataset.camperBackgroundSize = backgroundSize;
    }

    applyCamperLayerAppearance(element, layer, normalizedAppearance);
  });
}

function getCamperFrameNameForPose() {
  const frameNames = assetPaths.characters.frameNames;
  const activityId = camper.currentActivityId || "";

  if (activityId) {
    const activityFrames = frameNames.activityFrames && frameNames.activityFrames[activityId];
    return getCamperAnimationFrame(activityFrames, frameNames.idle, camperActivityFrameDurationMs);
  }

  if (camper.pose === "walking") {
    return getCamperAnimationFrame(frameNames.walkFrames, frameNames.idle);
  }

  if (camper.pose === "carryingWood" || camper.pose === "addingWoodToFire") {
    return getCamperAnimationFrame(frameNames.carryFrames, frameNames.carry);
  }

  if (camper.pose === "sittingGround") {
    return frameNames.sitGround;
  }

  if (camper.pose === "sittingChair") {
    return frameNames.sitChair;
  }

  if (camper.pose === "lookingLakeBack") {
    return frameNames.lookLakeBack;
  }

  if (camper.pose === "resting" || camper.pose === "tentRest") {
    return frameNames.rest;
  }

  return frameNames.idle;
}

function renderCamperAppearanceControls() {
  if (!camperAppearanceControls) {
    return;
  }

  const appearance = normalizeCamperAppearance(camperProfileDraftAppearance);
  camperAppearanceControls.innerHTML = "";

  CAMPER_APPEARANCE_CATEGORIES.forEach(function(category) {
    const row = document.createElement("div");
    const label = document.createElement("span");

    row.className = "camper-appearance-row";
    label.className = "camper-appearance-label";
    label.textContent = category.label;

    if (isCamperAppearanceRangeCategory(category)) {
      const rangeValue = getCamperAppearanceRangeValue(appearance[category.id], category);
      const slider = document.createElement("input");
      const value = document.createElement("strong");

      row.className += " camper-appearance-range-row";
      slider.className = "camper-appearance-slider";
      slider.type = "range";
      slider.min = String(category.min);
      slider.max = String(category.max);
      slider.step = String(category.step);
      slider.value = String(rangeValue);
      slider.setAttribute("aria-label", category.label);
      slider.addEventListener("input", function(event) {
        const nextValue = changeCamperAppearanceRange(category.id, event.currentTarget.value);
        value.textContent = Math.round(nextValue) + "°";
      });

      value.className = "camper-appearance-value camper-appearance-color-value";
      value.textContent = Math.round(rangeValue) + "°";

      row.appendChild(label);
      row.appendChild(slider);
      row.appendChild(value);
      camperAppearanceControls.appendChild(row);
      return;
    }

    const options = getCamperAppearanceOptions(category.id);
    const optionIndex = getCamperAppearanceOptionIndex(category.id, appearance);
    const option = options[optionIndex] || options[0];
    const previousButton = document.createElement("button");
    const value = document.createElement("strong");
    const nextButton = document.createElement("button");

    previousButton.className = "camper-appearance-arrow";
    previousButton.type = "button";
    previousButton.textContent = "‹";
    previousButton.setAttribute("aria-label", "Previous " + category.label);
    previousButton.title = "Previous " + category.label;
    previousButton.addEventListener("click", function() {
      changeCamperAppearanceOption(category.id, -1);
    });

    value.className = "camper-appearance-value";
    value.textContent = option ? option.label : "Default";

    nextButton.className = "camper-appearance-arrow";
    nextButton.type = "button";
    nextButton.textContent = "›";
    nextButton.setAttribute("aria-label", "Next " + category.label);
    nextButton.title = "Next " + category.label;
    nextButton.addEventListener("click", function() {
      changeCamperAppearanceOption(category.id, 1);
    });

    row.appendChild(label);
    row.appendChild(previousButton);
    row.appendChild(value);
    row.appendChild(nextButton);
    camperAppearanceControls.appendChild(row);
  });
}

function updateCamperAppearancePreview() {
  renderCamperLayerStack(camperAppearancePreview, camperProfileDraftAppearance, CAMPER_IDLE_FRAME_NAME);
}

function changeCamperAppearanceOption(categoryId, direction) {
  const options = getCamperAppearanceOptions(categoryId);

  if (!options.length) {
    return;
  }

  const currentAppearance = normalizeCamperAppearance(camperProfileDraftAppearance);
  const currentIndex = getCamperAppearanceOptionIndex(categoryId, currentAppearance);
  const nextIndex = (currentIndex + direction + options.length) % options.length;

  currentAppearance[categoryId] = options[nextIndex].id;
  camperProfileDraftAppearance = currentAppearance;
  renderCamperAppearanceControls();
  updateCamperAppearancePreview();
  updateCamperSprite();
}

function changeCamperAppearanceRange(categoryId, value) {
  const category = getCamperAppearanceCategory(categoryId);

  if (!isCamperAppearanceRangeCategory(category)) {
    return 0;
  }

  const currentAppearance = normalizeCamperAppearance(camperProfileDraftAppearance);
  const nextValue = getCamperAppearanceRangeValue(value, category);

  currentAppearance[categoryId] = nextValue;
  camperProfileDraftAppearance = currentAppearance;
  updateCamperAppearancePreview();
  updateCamperSprite();

  return nextValue;
}

function getActiveCamperProfile(state) {
  const campState = state || gameState;
  const campers = Array.isArray(campState.campers) ? campState.campers : [];
  const index = Number.isInteger(campState.activeCamperIndex) ? campState.activeCamperIndex : 0;

  return campers[index] || campers[0] || null;
}

function hasCamperProfile(state) {
  const profile = getActiveCamperProfile(state);
  return Boolean(
    state &&
    Number(state.camperProfileVersion) >= CAMPER_PROFILE_VERSION &&
    profile &&
    sanitizeCamperName(profile.name) &&
    CAMPER_PERSONALITIES[profile.personalityId]
  );
}

function getActiveCamperPersonality() {
  const profile = getActiveCamperProfile(gameState);
  return profile && CAMPER_PERSONALITIES[profile.personalityId] ? CAMPER_PERSONALITIES[profile.personalityId] : null;
}

function sanitizeCamperProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  const personality = CAMPER_PERSONALITIES[profile.personalityId];
  const name = sanitizeCamperName(profile.name);

  if (!personality || !name) {
    return null;
  }

  const catchphrase = sanitizeCamperCatchphrase(profile.catchphrase) || getDefaultCamperCatchphrase(profile.personalityId);
  const catchphraseEdited = Boolean(profile.catchphraseEdited && sanitizeCamperCatchphrase(profile.catchphrase));

  return {
    id: profile.id || "camper-" + Date.now().toString(36),
    name: name,
    personalityId: profile.personalityId,
    title: personality.title,
    description: personality.description,
    catchphrase: catchphrase,
    catchphraseEdited: catchphraseEdited,
    appearance: normalizeCamperAppearance(profile.appearance),
    traits: profile.traits && typeof profile.traits === "object" ? { ...profile.traits } : {},
    quiz: profile.quiz && typeof profile.quiz === "object" ? { ...profile.quiz } : {},
    createdAt: Number(profile.createdAt) || Date.now(),
    updatedAt: Number(profile.updatedAt) || Date.now()
  };
}

function getShuffledCopy(items) {
  const result = items.slice();

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const item = result[index];
    result[index] = result[swapIndex];
    result[swapIndex] = item;
  }

  return result;
}

function pickCamperProfileQuestions() {
  return getShuffledCopy(CAMPER_PROFILE_QUESTIONS).slice(0, CAMPER_PROFILE_QUESTION_COUNT);
}

function buildCamperProfileResult(name, questions, answers, appearance) {
  const scores = {};

  Object.keys(CAMPER_PERSONALITIES).forEach(function(personalityId) {
    scores[personalityId] = 0;
  });

  answers.forEach(function(answer) {
    const traits = answer && answer.traits ? answer.traits : {};

    Object.keys(traits).forEach(function(personalityId) {
      if (scores[personalityId] === undefined) {
        scores[personalityId] = 0;
      }

      scores[personalityId] += Number(traits[personalityId]) || 0;
    });
  });

  const personalityId = Object.keys(CAMPER_PERSONALITIES).sort(function(firstId, secondId) {
    return scores[secondId] - scores[firstId];
  })[0] || "slowMood";
  const personality = CAMPER_PERSONALITIES[personalityId];
  const existingProfile = getActiveCamperProfile(gameState);
  const existingCatchphrase = existingProfile && sanitizeCamperCatchphrase(existingProfile.catchphrase);
  const catchphraseEdited = Boolean(existingProfile && existingProfile.catchphraseEdited && existingCatchphrase);

  return {
    id: existingProfile && existingProfile.id || "camper-" + Date.now().toString(36),
    name: sanitizeCamperName(name) || getRandomCamperName(),
    personalityId: personalityId,
    title: personality.title,
    description: personality.description,
    catchphrase: catchphraseEdited ? existingCatchphrase : getDefaultCamperCatchphrase(personalityId),
    catchphraseEdited: catchphraseEdited,
    appearance: normalizeCamperAppearance(appearance),
    traits: scores,
    quiz: {
      questionCount: questions.length,
      questions: questions.map(function(question) {
        return question.text;
      }),
      answers: answers.map(function(answer) {
        return answer && answer.text || "";
      })
    },
    createdAt: existingProfile && existingProfile.createdAt || Date.now(),
    updatedAt: Date.now()
  };
}

function getCamperProfileIntroBody() {
  if (camperProfileMode === "manual") {
    return "重新认识一下这位 Camper。只会更新名字、称号和小气泡，不会重置营地进度。";
  }

  if (loadedExistingSaveWithoutCamperProfile) {
    return "你的营地已经准备好了，现在来认识一下住在这里的 Camper 吧。原来的 Cozy Points、装备、摆放和引导进度都会保留。";
  }

  return "先认识一下住进营地的 Camper。答几个轻松的小问题，然后它就会带着自己的小性格开始生活。";
}

function setCamperProfileStep(step) {
  camperProfileStep = step;
  updateCamperProfileView();
}

function renderCamperQuestionOptions(question) {
  camperQuestionOptions.innerHTML = "";

  question.options.forEach(function(option, optionIndex) {
    const optionButton = document.createElement("button");
    const selectedAnswer = camperProfileAnswers[camperProfileQuestionIndex];

    optionButton.className = "camper-question-option" + (selectedAnswer === option ? " selected" : "");
    optionButton.type = "button";
    optionButton.textContent = option.text;
    optionButton.addEventListener("click", function() {
      camperProfileAnswers[camperProfileQuestionIndex] = option;
      renderCamperQuestionOptions(question);
      updateCamperProfileView();
    });

    camperQuestionOptions.appendChild(optionButton);
  });
}

function getCamperProfileForCard() {
  return camperProfileDraftResult || getActiveCamperProfile(gameState);
}

function syncCamperCardEditingUi(profile) {
  const cardProfile = profile || getCamperProfileForCard();
  const catchphrase = cardProfile ? sanitizeCamperCatchphrase(cardProfile.catchphrase) || getDefaultCamperCatchphrase(cardProfile.personalityId) : "";
  const editingName = camperCardEditingField === "name";
  const editingCatchphrase = camperCardEditingField === "catchphrase";

  if (camperResultName) {
    camperResultName.classList.toggle("hidden", editingName);
  }

  if (camperCatchphraseText) {
    camperCatchphraseText.classList.toggle("hidden", editingCatchphrase);
  }

  if (camperNameEditInput) {
    camperNameEditInput.classList.toggle("hidden", !editingName);
    if (!editingName && cardProfile) {
      camperNameEditInput.value = cardProfile.name;
    }
  }

  if (camperCatchphraseEditInput) {
    camperCatchphraseEditInput.classList.toggle("hidden", !editingCatchphrase);
    if (!editingCatchphrase) {
      camperCatchphraseEditInput.value = catchphrase;
    }
  }

  if (camperNameEditButton) {
    camperNameEditButton.textContent = editingName ? "✓" : "✎";
    camperNameEditButton.setAttribute("aria-label", editingName ? "Save nickname" : "Edit nickname");
    camperNameEditButton.title = editingName ? "Save nickname" : "Edit nickname";
  }

  if (camperCatchphraseEditButton) {
    camperCatchphraseEditButton.textContent = editingCatchphrase ? "✓" : "✎";
    camperCatchphraseEditButton.setAttribute("aria-label", editingCatchphrase ? "Save catchphrase" : "Edit catchphrase");
    camperCatchphraseEditButton.title = editingCatchphrase ? "Save catchphrase" : "Edit catchphrase";
  }
}

function setCamperCardEditingField(field) {
  camperCardEditingField = field || "";
  renderCamperCard();

  if (camperCardEditingField === "name" && camperNameEditInput) {
    requestAnimationFrame(function() {
      camperNameEditInput.focus();
      camperNameEditInput.select();
    });
  } else if (camperCardEditingField === "catchphrase" && camperCatchphraseEditInput) {
    requestAnimationFrame(function() {
      camperCatchphraseEditInput.focus();
      camperCatchphraseEditInput.select();
    });
  }
}

function renderCamperCard(profile) {
  const cardProfile = profile || getCamperProfileForCard();

  if (!cardProfile) {
    return;
  }

  const personality = getCamperPersonality(cardProfile.personalityId);
  const catchphrase = sanitizeCamperCatchphrase(cardProfile.catchphrase) || getDefaultCamperCatchphrase(cardProfile.personalityId);

  if (camperCardBackground) {
    camperCardBackground.src = withVersion(getCamperCardBackgroundPath(cardProfile.personalityId));
  }

  if (camperCardPortrait) {
    camperCardPortrait.setAttribute("aria-label", cardProfile.name + " camper portrait");
  }

  if (camperCardCamper) {
    renderCamperLayerStack(camperCardCamper, cardProfile.appearance, CAMPER_IDLE_FRAME_NAME);
  }

  if (camperResultName) {
    camperResultName.textContent = cardProfile.name;
  }

  if (camperResultTitle) {
    camperResultTitle.textContent = personality.title;
  }

  if (camperResultDescription) {
    camperResultDescription.textContent = personality.description;
  }

  if (camperCatchphraseText) {
    camperCatchphraseText.textContent = "“" + catchphrase + "”";
  }

  syncCamperCardEditingUi(cardProfile);
}

function updateCamperProfileView() {
  if (!camperProfileActive || !camperProfileLayer) {
    return;
  }

  const isNameStep = camperProfileStep === "name";
  const isAppearanceStep = camperProfileStep === "appearance";
  const isQuestionStep = camperProfileStep === "question";
  const isResultStep = camperProfileStep === "result";
  const currentQuestion = camperProfileQuestions[camperProfileQuestionIndex];

  if (camperProfilePanel) {
    camperProfilePanel.classList.toggle("camper-card-panel", isResultStep);
  }

  camperNameStep.classList.toggle("hidden", !isNameStep);
  camperAppearanceStep.classList.toggle("hidden", !isAppearanceStep);
  camperQuestionStep.classList.toggle("hidden", !isQuestionStep);
  camperResultStep.classList.toggle("hidden", !isResultStep);

  if (isNameStep) {
    camperProfileStepLabel.textContent = "Create Camper";
    camperProfileTitle.textContent = "Who lives here?";
    camperProfileBody.textContent = getCamperProfileIntroBody();
    camperProfilePrimaryButton.textContent = "Next: look";
    camperProfilePrimaryButton.disabled = !sanitizeCamperName(camperNameInput.value);
    camperProfileSecondaryButton.textContent = hasCamperProfile(gameState) ? "Close" : "Random camper";
  } else if (isAppearanceStep) {
    camperProfileStepLabel.textContent = camperProfileMode === "appearanceOnly" ? "Re-customize Camper" : "Customize Camper";
    camperProfileTitle.textContent = camperProfileDraftName;
    camperProfileBody.textContent = camperProfileMode === "appearanceOnly" ? "只会更新小人外观，昵称、性格、口头禅和背景都会保留。" : "先捏一下小人，再答几个轻松的小问题。";
    camperProfilePrimaryButton.textContent = camperProfileMode === "appearanceOnly" ? "保存外观" : "Start questions";
    camperProfilePrimaryButton.disabled = false;
    camperProfileSecondaryButton.textContent = "随机";
    renderCamperAppearanceControls();
    updateCamperAppearancePreview();
  } else if (isQuestionStep && currentQuestion) {
    camperProfileStepLabel.textContent = "Question " + (camperProfileQuestionIndex + 1) + " / " + camperProfileQuestions.length;
    camperProfileTitle.textContent = camperProfileDraftName;
    camperProfileBody.textContent = camperProfileMode === "retakeQuiz" ? "只会更新性格、描述和名片背景，不会重置昵称或外观。" : "选一个最像它今天状态的答案。";
    camperQuestionText.textContent = currentQuestion.text;
    renderCamperQuestionOptions(currentQuestion);
    camperProfilePrimaryButton.textContent = camperProfileQuestionIndex >= camperProfileQuestions.length - 1 ? "See card" : "Next";
    camperProfilePrimaryButton.disabled = !camperProfileAnswers[camperProfileQuestionIndex];
    camperProfileSecondaryButton.textContent = hasCamperProfile(gameState) ? "Cancel" : "Random camper";
  } else if (isResultStep && camperProfileDraftResult) {
    camperProfileStepLabel.textContent = "Camper Card";
    camperProfileTitle.textContent = "Camper Card";
    camperProfileBody.textContent = "";
    renderCamperCard(camperProfileDraftResult);
    camperProfilePrimaryButton.textContent = "Close";
    camperProfilePrimaryButton.disabled = false;
    camperProfileSecondaryButton.textContent = "Retake";
  }
}

function startCamperProfileFlow(mode) {
  if (!camperProfileLayer) {
    return;
  }

  if (onboardingActive) {
    completeOnboarding(false);
  }

  if (isShopOpen()) {
    closeShop();
  }

  closeInventoryPanel();

  if (isBuildModeActive()) {
    exitBuildMode();
  }

  const existingProfile = getActiveCamperProfile(gameState);
  const hasExistingProfile = hasCamperProfile(gameState);

  camperProfileActive = true;
  camperProfileMode = mode || "required";
  camperProfileStep = "name";
  camperProfileQuestionIndex = 0;
  camperProfileQuestions = pickCamperProfileQuestions();
  camperProfileAnswers = [];
  camperProfileDraftName = existingProfile && existingProfile.name || "";
  camperProfileDraftResult = null;
  camperProfileDraftAppearance = normalizeCamperAppearance(existingProfile && existingProfile.appearance);

  if (camperProfileMode === "card" && hasExistingProfile) {
    camperProfileStep = "result";
    camperProfileDraftResult = sanitizeCamperProfile(existingProfile);
  } else if (camperProfileMode === "retakeQuiz" && hasExistingProfile) {
    camperProfileStep = "question";
  } else if (camperProfileMode === "appearanceOnly" && hasExistingProfile) {
    camperProfileStep = "appearance";
  }

  camperNameInput.value = camperProfileDraftName;
  camperProfileLayer.classList.remove("hidden");
  camperProfileLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("camper-profile-open");
  updateCamperProfileView();

  if (camperProfileStep === "name") {
    requestAnimationFrame(function() {
      if (camperNameInput) {
        camperNameInput.focus();
        camperNameInput.select();
      }
    });
  }
}

function closeCamperProfileFlow() {
  camperProfileActive = false;
  camperCardEditingField = "";
  camperProfileLayer.classList.add("hidden");
  camperProfileLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("camper-profile-open");
  if (camperProfilePanel) {
    camperProfilePanel.classList.remove("camper-card-panel");
  }
  updateCamperSprite();
}

function randomizeCamperProfileDraft() {
  const name = sanitizeCamperName(camperNameInput.value) || getRandomCamperName();

  camperProfileQuestions = pickCamperProfileQuestions();
  camperProfileAnswers = camperProfileQuestions.map(function(question) {
    return question.options[Math.floor(Math.random() * question.options.length)];
  });
  camperProfileDraftName = name;
  camperProfileDraftAppearance = getRandomCamperAppearance();
  camperProfileDraftResult = buildCamperProfileResult(name, camperProfileQuestions, camperProfileAnswers, camperProfileDraftAppearance);
  saveCamperProfileResult(true);
  setCamperProfileStep("result");
}

function setActiveCamperProfile(profile) {
  const cleanProfile = sanitizeCamperProfile(profile);

  if (!cleanProfile) {
    return null;
  }

  const campers = Array.isArray(gameState.campers) ? gameState.campers.slice() : [];

  campers[0] = cleanProfile;
  gameState.campers = campers;
  gameState.activeCamperIndex = 0;
  gameState.camperProfileVersion = CAMPER_PROFILE_VERSION;
  saveGame();
  return cleanProfile;
}

function saveCamperProfileResult(keepOpen) {
  if (!camperProfileDraftResult) {
    return null;
  }

  const savedProfile = setActiveCamperProfile(camperProfileDraftResult);

  if (!savedProfile) {
    return null;
  }

  camperProfileDraftResult = savedProfile;
  renderCamperCard(savedProfile);
  setStatus(savedProfile.name + " is ready for camp.");
  updateCamperProfileControls();
  updateCamperSprite();
  chooseNextCamperAction();

  if (keepOpen) {
    return savedProfile;
  }

  closeCamperProfileFlow();
  maybeStartOnboarding();
  return savedProfile;
}

function advanceCamperProfileFlow() {
  if (!camperProfileActive) {
    return;
  }

  if (camperProfileStep === "name") {
    const name = sanitizeCamperName(camperNameInput.value);

    if (!name) {
      setStatus("Give your Camper a name first.");
      updateCamperProfileView();
      return;
    }

    camperProfileDraftName = name;
    setCamperProfileStep("appearance");
    return;
  }

  if (camperProfileStep === "appearance") {
    camperProfileDraftAppearance = normalizeCamperAppearance(camperProfileDraftAppearance);

    if (camperProfileMode === "appearanceOnly") {
      const existingProfile = getActiveCamperProfile(gameState);

      if (!existingProfile) {
        closeCamperProfileFlow();
        return;
      }

      camperProfileDraftResult = {
        ...existingProfile,
        appearance: camperProfileDraftAppearance,
        updatedAt: Date.now()
      };
      saveCamperProfileResult(true);
      setCamperProfileStep("result");
      return;
    }

    setCamperProfileStep("question");
    return;
  }

  if (camperProfileStep === "question") {
    if (!camperProfileAnswers[camperProfileQuestionIndex]) {
      updateCamperProfileView();
      return;
    }

    if (camperProfileQuestionIndex >= camperProfileQuestions.length - 1) {
      camperProfileDraftResult = buildCamperProfileResult(camperProfileDraftName, camperProfileQuestions, camperProfileAnswers, camperProfileDraftAppearance);
      saveCamperProfileResult(true);
      setCamperProfileStep("result");
    } else {
      camperProfileQuestionIndex += 1;
      setCamperProfileStep("question");
    }

    return;
  }

  if (camperProfileStep === "result") {
    closeCamperProfileFlow();
    maybeStartOnboarding();
  }
}

function handleCamperProfileSecondaryAction() {
  if (camperProfileStep === "result") {
    startCamperProfileFlow("retakeQuiz");
    return;
  }

  if (camperProfileStep === "appearance") {
    camperProfileDraftAppearance = getRandomCamperAppearance();
    renderCamperAppearanceControls();
    updateCamperAppearancePreview();
    updateCamperSprite();
    return;
  }

  if (hasCamperProfile(gameState)) {
    if (camperProfileMode === "retakeQuiz" || camperProfileMode === "appearanceOnly") {
      startCamperProfileFlow("card");
      return;
    }

    closeCamperProfileFlow();
    return;
  }

  randomizeCamperProfileDraft();
}

function closeCamperCardAndResume() {
  closeCamperProfileFlow();
  maybeStartOnboarding();
}

function editActiveCamperName() {
  const profile = getActiveCamperProfile(gameState);

  if (!profile) {
    return;
  }

  if (camperCardEditingField !== "name") {
    setCamperCardEditingField("name");
    return;
  }

  const nextName = sanitizeCamperName(camperNameEditInput && camperNameEditInput.value);

  if (!nextName) {
    setStatus("Give your Camper a name first.");
    return;
  }

  const savedProfile = setActiveCamperProfile({
    ...profile,
    name: nextName,
    updatedAt: Date.now()
  });

  if (savedProfile) {
    camperProfileDraftResult = savedProfile;
    camperCardEditingField = "";
    renderCamperCard(savedProfile);
    updateCamperProfileControls();
    setStatus("Camper name updated.");
  }
}

function editActiveCamperCatchphrase() {
  const profile = getActiveCamperProfile(gameState);

  if (!profile) {
    return;
  }

  if (camperCardEditingField !== "catchphrase") {
    setCamperCardEditingField("catchphrase");
    return;
  }

  const nextCatchphrase = sanitizeCamperCatchphrase(camperCatchphraseEditInput && camperCatchphraseEditInput.value);

  if (!nextCatchphrase) {
    setStatus("Catchphrase cannot be empty.");
    return;
  }

  const savedProfile = setActiveCamperProfile({
    ...profile,
    catchphrase: nextCatchphrase,
    catchphraseEdited: true,
    updatedAt: Date.now()
  });

  if (savedProfile) {
    camperProfileDraftResult = savedProfile;
    camperCardEditingField = "";
    renderCamperCard(savedProfile);
    setStatus("Catchphrase updated.");
  }
}

function handleCamperCardInlineInputKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (event.currentTarget === camperNameEditInput) {
      editActiveCamperName();
    } else if (event.currentTarget === camperCatchphraseEditInput) {
      editActiveCamperCatchphrase();
    }
  } else if (event.key === "Escape") {
    event.preventDefault();
    setCamperCardEditingField("");
  }
}

function updateCamperProfileControls() {
  const profile = getActiveCamperProfile(gameState);

  if (!camperProfileButton) {
    return;
  }

  camperProfileButton.setAttribute("title", profile ? profile.name + ": " + profile.title : "Create camper");
}

function maybeStartInteractionGuide() {
  if (!hasCamperProfile(gameState) || camperProfileActive || !gameState.onboardingSeen || gameState.interactionGuideSeen || onboardingActive) {
    return;
  }

  if (!getInteractionGuideTargetItem()) {
    return;
  }

  startStandaloneGuide("tapInteraction");
}

function maybeStartBuildModeGuide() {
  if (!hasCamperProfile(gameState) || camperProfileActive || gameState.buildModeGuideSeen || onboardingActive) {
    return;
  }

  // Prompt the player toward the Build button once it is unlocked and visible.
  // The button lives in the floating controls, which are hidden while the shop
  // is open, so wait until the shop is closed before pointing at it.
  if (!gameState.onboardingSeen || !isBuildModeUnlocked() || buildModeActive) {
    return;
  }

  if (document.body.classList.contains("shop-open")) {
    return;
  }

  startStandaloneGuide("buildMode");
}

function maybeStartOnboarding() {
  if (!hasCamperProfile(gameState)) {
    startCamperProfileFlow("required");
    return;
  }

  if (camperProfileActive) {
    return;
  }

  if (!gameState.onboardingSeen) {
    startOnboarding(false);
    return;
  }

  maybeStartInteractionGuide();
}
