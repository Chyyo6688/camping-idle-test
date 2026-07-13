// Shared UI helpers, target controls, screen rendering, and settings UI.

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

function applyUiDisplayMode() {
  document.body.classList.toggle("queue-numbers-hidden", uiDisplayMode === 1);
  document.body.classList.toggle("ui-hidden", uiDisplayMode === 2);

  if (uiDisplayMode === 2 && isShopOpen()) {
    closeShop();
  }

  if (uiDisplayLabel) {
    uiDisplayLabel.textContent = uiDisplayMode === 0 ? "UI" : uiDisplayMode === 1 ? "#" : "Show";
  }

  if (uiDisplayToggle) {
    const label = uiDisplayMode === 0 ? "Hide queue numbers" : uiDisplayMode === 1 ? "Hide UI" : "Show UI";
    uiDisplayToggle.setAttribute("aria-label", label);
    uiDisplayToggle.setAttribute("title", label);
  }
}

function toggleUiDisplayMode() {
  uiDisplayMode = (uiDisplayMode + 1) % 3;
  applyUiDisplayMode();
}

function isCampfireUpgradeItem(item) {
  return Boolean(item && item.interactions && item.interactions.upgradeCampfire);
}

function getPurchasedNonCampfireGearCount(state) {
  const campState = state || gameState;

  return getOwnedGearItems(campState).filter(function(item) {
    return item && !item.defaultOwned && !isCampfireUpgradeItem(item);
  }).length;
}

function isBuildModeUnlocked(state) {
  return getPurchasedNonCampfireGearCount(state || gameState) >= BUILD_MODE_UNLOCK_PURCHASE_COUNT;
}

function isBuildModeActive() {
  return buildModeActive;
}

function updateBuildModeControls() {
  const unlocked = isBuildModeUnlocked();

  if (!unlocked && buildModeActive) {
    exitBuildMode();
    return;
  }

  document.body.classList.toggle("build-mode", buildModeActive);

  if (buildModeToggle) {
    buildModeToggle.classList.toggle("hidden", !unlocked);
    buildModeToggle.classList.toggle("active", buildModeActive);
    buildModeToggle.setAttribute("aria-pressed", buildModeActive ? "true" : "false");
    buildModeToggle.setAttribute("aria-label", buildModeActive ? "Exit Build Mode" : "Enter Build Mode");
    buildModeToggle.setAttribute("title", buildModeActive ? "Done" : "Build Mode");
  }

  if (buildModeLabel) {
    buildModeLabel.textContent = buildModeActive ? "Done" : "Build";
  }
}

function getDirectChildByClass(element, className) {
  if (!element) {
    return null;
  }

  for (let index = 0; index < element.children.length; index += 1) {
    const child = element.children[index];

    if (child.classList && child.classList.contains(className)) {
      return child;
    }
  }

  return null;
}

function getTargetOutlineElement(target) {
  let outlineImage = getDirectChildByClass(target, "target-outline-image");

  target.classList.add("target-outline-enabled");

  if (outlineImage && outlineImage.tagName !== "IMG") {
    const replacement = document.createElement("img");
    replacement.className = "target-outline-image";
    replacement.alt = "";
    replacement.setAttribute("aria-hidden", "true");
    outlineImage.replaceWith(replacement);
    outlineImage = replacement;
  }

  if (!outlineImage) {
    outlineImage = document.createElement("img");
    outlineImage.className = "target-outline-image";
    outlineImage.alt = "";
    outlineImage.setAttribute("aria-hidden", "true");
    target.insertBefore(outlineImage, target.firstChild);
  }

  return outlineImage;
}

function removeTargetOutlineElement(target) {
  const outlineImage = getDirectChildByClass(target, "target-outline-image");

  if (outlineImage) {
    outlineImage.remove();
  }

  target.classList.remove("target-outline-enabled");
}

function getGearOutlineBasePath(item) {
  if (!item || !item.image) {
    return "";
  }

  const imagePath = item.image.split("?")[0];

  if (!imagePath.startsWith("assets/gear/") || !imagePath.endsWith("/icon.png")) {
    return "";
  }

  return imagePath.replace(/\/icon\.png$/, "/icon_base.png");
}

function getTargetOutlineBaseAssetPath(target) {
  if (target && target.classList && target.classList.contains("wood-item")) {
    return assetPaths.resources.wood;
  }

  if (target === campfire) {
    return assetPaths.campfire.base[gameState.campfireLevel] || "";
  }

  const targetId = target && target.dataset ? target.dataset.actionTargetId : "";
  const item = getGearItem(targetId);

  return getGearOutlineBasePath(item);
}

function shouldUseTargetOutline(target) {
  return Boolean(getTargetOutlineBaseAssetPath(target));
}

function isOutlineSourceImage(image) {
  return Boolean(
    image &&
    image.classList &&
    image.classList.contains("object-image") &&
    !image.classList.contains("target-outline-image") &&
    !image.classList.contains("tent-glow") &&
    !image.classList.contains("lantern-glow") &&
    !image.classList.contains("string-lights-glow") &&
    !image.classList.contains("fire-glow-img") &&
    !image.classList.contains("campfire-flame-img")
  );
}

function getTargetOutlineSourceImage(target) {
  if (!target) {
    return null;
  }

  if (target.classList.contains("wood-item")) {
    return target.querySelector(".wood-image");
  }

  if (target === campfire) {
    return campfireBaseImage;
  }

  return target.querySelector(".gear-layer-base") || Array.from(target.querySelectorAll(".object-image")).find(isOutlineSourceImage);
}

function syncTargetOutlineLayout(outlineImage, sourceImage) {
  if (!outlineImage || !sourceImage) {
    return;
  }

  outlineImage.style.right = "auto";
  outlineImage.style.bottom = "auto";
  outlineImage.style.objectFit = "contain";

  if (!sourceImage.classList.contains("object-image") || typeof window === "undefined") {
    outlineImage.style.left = "0";
    outlineImage.style.top = "0";
    outlineImage.style.width = "100%";
    outlineImage.style.height = "100%";
    return;
  }

  const sourceStyles = window.getComputedStyle(sourceImage);

  outlineImage.style.left = sourceStyles.left === "auto" ? "0" : sourceStyles.left;
  outlineImage.style.top = sourceStyles.top === "auto" ? "0" : sourceStyles.top;
  outlineImage.style.width = sourceStyles.width && sourceStyles.width !== "auto" ? sourceStyles.width : "100%";
  outlineImage.style.height = sourceStyles.height && sourceStyles.height !== "auto" ? sourceStyles.height : "100%";
  outlineImage.style.objectFit = sourceStyles.objectFit || "contain";
}

function updateTargetOutline(target, sourceImage) {
  if (!target || !shouldUseTargetOutline(target)) {
    removeTargetOutlineElement(target);
    return;
  }

  const outlineImage = getTargetOutlineElement(target);
  const outlineBaseAssetPath = getTargetOutlineBaseAssetPath(target);

  if (sourceImage) {
    syncTargetOutlineLayout(outlineImage, sourceImage);
  }

  if (outlineBaseAssetPath) {
    const nextSrc = withVersion(outlineBaseAssetPath);

    if (outlineImage.getAttribute("src") !== nextSrc) {
      outlineImage.src = nextSrc;
    }
  } else {
    outlineImage.removeAttribute("src");
  }
}

function updateTargetOutlineForElement(target) {
  updateTargetOutline(target, getTargetOutlineSourceImage(target));
}

function refreshTargetOutlines() {
  document.querySelectorAll(".wood-item, .interactive-action-target").forEach(updateTargetOutlineForElement);
}

function clearSceneDepthControlHideTimer() {
  if (depthControlHideTimer !== null) {
    clearTimeout(depthControlHideTimer);
    depthControlHideTimer = null;
  }
}

function getSceneDepthControlLayer() {
  if (!sceneDepthControlLayer && sceneContent) {
    sceneDepthControlLayer = document.createElement("div");
    sceneDepthControlLayer.className = "scene-depth-control-layer";
    sceneDepthControlLayer.setAttribute("aria-hidden", "false");
    sceneContent.appendChild(sceneDepthControlLayer);
  }

  return sceneDepthControlLayer;
}

function createSceneDepthControlButton(action, label, ariaLabel) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "scene-depth-control-button";
  button.dataset.depthAction = action;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);

  return button;
}

function isSceneDepthControlEventTarget(event) {
  return Boolean(event && event.target && event.target.closest && event.target.closest(".scene-depth-controls"));
}

function getSceneDepthControlPanel() {
  const layer = getSceneDepthControlLayer();

  if (!layer) {
    return null;
  }

  if (!sceneDepthControlPanel) {
    sceneDepthControlPanel = document.createElement("div");
    sceneDepthControlPanel.className = "scene-depth-controls hidden";
    sceneDepthControlPanel.setAttribute("role", "group");
    sceneDepthControlPanel.setAttribute("aria-label", "Layer order controls");

    sceneDepthControlPanel.appendChild(createSceneDepthControlButton("forward", "↑", "Bring selected gear forward"));
    sceneDepthControlPanel.appendChild(createSceneDepthControlButton("backward", "↓", "Send selected gear backward"));

    const resetRow = document.createElement("div");
    resetRow.className = "scene-depth-reset-row";

    const negativeOffsetLabel = document.createElement("span");
    negativeOffsetLabel.className = "scene-depth-control-value scene-depth-control-value-left";
    negativeOffsetLabel.dataset.depthOffsetSide = "negative";
    resetRow.appendChild(negativeOffsetLabel);

    const resetButton = createSceneDepthControlButton("reset", "Reset", "Reset selected gear layer order");
    resetButton.classList.add("scene-depth-control-reset");
    resetRow.appendChild(resetButton);

    const positiveOffsetLabel = document.createElement("span");
    positiveOffsetLabel.className = "scene-depth-control-value scene-depth-control-value-right";
    positiveOffsetLabel.dataset.depthOffsetSide = "positive";
    resetRow.appendChild(positiveOffsetLabel);

    sceneDepthControlPanel.appendChild(resetRow);

    const attachButton = createSceneDepthControlButton("attach", "Attach", "Attach selected gear to its default mount point");
    attachButton.classList.add("scene-depth-control-attach", "hidden");
    sceneDepthControlPanel.appendChild(attachButton);

    sceneDepthControlPanel.addEventListener("pointerenter", function() {
      depthControlPanelHovered = true;
      clearSceneDepthControlHideTimer();
    });

    sceneDepthControlPanel.addEventListener("pointerleave", function() {
      depthControlPanelHovered = false;
      scheduleHideSceneDepthControls();
    });

    sceneDepthControlPanel.addEventListener("pointerdown", function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    sceneDepthControlPanel.addEventListener("pointerup", function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    sceneDepthControlPanel.addEventListener("click", function(event) {
      const eventTarget = event.target && event.target.closest ? event.target : event.target && event.target.parentElement;
      const button = eventTarget ? eventTarget.closest("[data-depth-action]") : null;

      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handleSceneDepthControlAction(button.dataset.depthAction);
    });

    layer.appendChild(sceneDepthControlPanel);
  }

  return sceneDepthControlPanel;
}

function getSelectedActionTargetId() {
  return selectedActionTargetElement && selectedActionTargetElement.dataset ? selectedActionTargetElement.dataset.actionTargetId : "";
}

function getSelectedDepthControlTargetItem() {
  if (isBuildModeActive()) {
    return getSelectedBuildItem();
  }

  return getGearItem(getSelectedActionTargetId());
}

function getSelectedDepthControlTargetId() {
  const item = getSelectedDepthControlTargetItem();

  return item ? item.id : "";
}

function getActiveDepthControlTargetItem() {
  if (isBuildModeActive()) {
    return getSelectedBuildItem();
  }

  return getGearItem(getSelectedActionTargetId() || depthControlHoverTargetId);
}

function updateScreen() {
  ensureDailyWeatherForToday();
  ensureTodayDivinationsForToday();
  ensureDailyAdventureModifiersForToday();
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
  updateCamperProfileControls();
  updateBuildModeControls();
  updateDailyCampCard();
  syncDivinationEntryState();

  updateShopCards();
  updateSceneEquipment();
  syncInventoryPanel();
  updateCoolerFullHint();
  updateOnboardingView();
  maybeStartBuildModeGuide();
}

// ---------------------------------------------------------------------------
// Settings menu (opened from the Help button). Houses the tutorials and Reset.
// ---------------------------------------------------------------------------
function isSettingsMenuOpen() {
  return Boolean(settingsLayer && !settingsLayer.classList.contains("hidden"));
}

function openSettingsMenu() {
  if (!settingsLayer) {
    return;
  }

  closeShop();
  closeInventoryPanel();
  closeSoundJournal();
  collapseTutorialList();
  settingsLayer.classList.remove("hidden");
  settingsLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("settings-open");
}

function closeSettingsMenu() {
  if (!settingsLayer) {
    return;
  }

  settingsLayer.classList.add("hidden");
  settingsLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("settings-open");
}

function collapseTutorialList() {
  if (settingsTutorialList) {
    settingsTutorialList.classList.add("hidden");
  }
  if (settingsTutorialToggle) {
    settingsTutorialToggle.setAttribute("aria-expanded", "false");
    settingsTutorialToggle.classList.remove("expanded");
  }
}

function toggleTutorialList() {
  if (!settingsTutorialList || !settingsTutorialToggle) {
    return;
  }
  const expanded = settingsTutorialList.classList.toggle("hidden") === false;
  settingsTutorialToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  settingsTutorialToggle.classList.toggle("expanded", expanded);
}

// Replay a tutorial from the menu. "onboarding" is the original Help guide;
// "buildMode" is the Build Mode standalone guide.
function playTutorialFromMenu(guideId) {
  closeSettingsMenu();

  if (guideId === "onboarding") {
    startOnboarding(true);
    return;
  }

  if (guideId === "buildMode") {
    startStandaloneGuide("buildMode");
    if (!onboardingActive) {
      // guards blocked it (e.g. another guide is open); nudge instead.
      setStatus("先关掉其它引导再重看建造模式指引。");
    }
  }
}
