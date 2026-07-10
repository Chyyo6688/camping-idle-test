// Scene placement, depth, drag/build interactions, action queue, and occlusion.

function getGearActionMetadata(item) {
  const activityId = getActivityIdForGear(item);

  return activityId ? { activityId: activityId } : {};
}

function isGearPositionLocked(item) {
  return Boolean(item && item.scene && item.scene.movable === false);
}

function isSceneDepthAdjustableItem(item) {
  return Boolean(item && item.scene && item.scene.renderMode !== "campfire");
}

function getSceneAssetBounds(item) {
  if (!isSceneDepthAdjustableItem(item)) {
    return null;
  }

  const element = getGearSceneElement(item);
  const layoutOverride = getSceneLayoutOverride(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(item.scene || {}, layoutOverride);

  return {
    left: position.x - groundAnchor.x,
    top: position.y - groundAnchor.y,
    width: logicalSize.width,
    height: logicalSize.height
  };
}

function showSceneDepthControlsForItem(itemOrId) {
  const item = typeof itemOrId === "string" ? getGearItem(itemOrId) : itemOrId;

  if (!isBuildModeActive()) {
    return;
  }

  if (!isSceneDepthAdjustableItem(item) || !isGearVisibleInScene(item)) {
    return;
  }

  clearSceneDepthControlHideTimer();
  depthControlHoverTargetId = item.id;
  syncSceneDepthControls();
}

function scheduleHideSceneDepthControls() {
  clearSceneDepthControlHideTimer();

  depthControlHideTimer = setTimeout(function() {
    if (!depthControlPanelHovered && !getSelectedDepthControlTargetId()) {
      depthControlHoverTargetId = "";
      syncSceneDepthControls();
    }
  }, 320);
}

function formatDepthOffsetValue(value) {
  if (!value) {
    return "Auto";
  }

  return value > 0 ? "+" + value : String(value);
}

function shouldShowMountAttachControl(item) {
  return Boolean(
    item &&
    item.scene &&
    item.scene.mountTo &&
    isSelectedBuildItem(item)
  );
}

function getMountControlAction(item) {
  if (!shouldShowMountAttachControl(item)) {
    return "";
  }

  return isMountedGearDetached(item) ? "attach" : "detach";
}

function syncSceneDepthControls() {
  const panel = getSceneDepthControlPanel();
  const item = getActiveDepthControlTargetItem();
  const bounds = getSceneAssetBounds(item);

  if (!panel || !isBuildModeActive() || !item || !bounds || !isGearVisibleInScene(item)) {
    if (panel) {
      panel.classList.add("hidden");
    }

    return;
  }

  const mountControlAction = getMountControlAction(item);
  const shouldShowAttach = Boolean(mountControlAction);
  const negativeOffsetValue = panel.querySelector("[data-depth-offset-side='negative']");
  const positiveOffsetValue = panel.querySelector("[data-depth-offset-side='positive']");
  const attachButton = panel.querySelector(".scene-depth-control-attach");
  const depthOffsetY = getUserDepthOffsetY(item);

  if (attachButton) {
    attachButton.classList.toggle("hidden", !shouldShowAttach);
    attachButton.dataset.depthAction = mountControlAction || "attach";
    attachButton.textContent = mountControlAction === "detach" ? "Detach" : "Attach";
    attachButton.setAttribute(
      "aria-label",
      mountControlAction === "detach" ? "Detach selected gear from its mount point" : "Attach selected gear to its default mount point"
    );
  }

  panel.dataset.depthTargetId = item.id;
  panel.classList.toggle("scene-depth-controls-with-attach", shouldShowAttach);
  panel.classList.remove("hidden");

  if (negativeOffsetValue) {
    negativeOffsetValue.textContent = depthOffsetY < 0 ? formatDepthOffsetValue(depthOffsetY) : "";
  }

  if (positiveOffsetValue) {
    positiveOffsetValue.textContent = depthOffsetY >= 0 ? formatDepthOffsetValue(depthOffsetY) : "";
  }

  const sceneScale = parseFloat(sceneContent && sceneContent.style.getPropertyValue("--scene-scale")) || 1;
  const controlScale = clamp(1 / sceneScale, 1, 2.4);
  panel.style.setProperty("--depth-control-scale", String(controlScale));

  const panelWidth = (panel.offsetWidth || 50) * controlScale;
  const panelHeight = (panel.offsetHeight || (shouldShowAttach ? 120 : 93)) * controlScale;
  const left = clamp(bounds.left + bounds.width + 10, 8, BASE_SCENE_WIDTH - panelWidth - 8);
  const top = clamp(bounds.top + bounds.height * 0.34, 8, BASE_SCENE_HEIGHT - panelHeight - 8);

  panel.style.left = left + "px";
  panel.style.top = top + "px";
}

function getUserDepthOffsetMap() {
  if (!gameState.userDepthOffsetY || typeof gameState.userDepthOffsetY !== "object") {
    gameState.userDepthOffsetY = {};
  }

  return gameState.userDepthOffsetY;
}

function setUserDepthOffsetY(item, offsetY) {
  if (!isSceneDepthAdjustableItem(item)) {
    return;
  }

  const offsets = getUserDepthOffsetMap();
  const nextOffset = Number.isFinite(offsetY) ? offsetY : 0;

  if (nextOffset === 0) {
    delete offsets[item.id];
  } else {
    offsets[item.id] = nextOffset;
  }

  refreshGearSceneLayout(item);
  saveGame();
  setStatus(item.displayName + " layer " + formatDepthOffsetValue(nextOffset) + ".");
}

function handleSceneDepthControlAction(action) {
  const item = getActiveDepthControlTargetItem();

  if (!isBuildModeActive() || !isSceneDepthAdjustableItem(item)) {
    return;
  }

  if (action === "forward") {
    setUserDepthOffsetY(item, getUserDepthOffsetY(item) + USER_DEPTH_OFFSET_STEP);
    return;
  }

  if (action === "backward") {
    setUserDepthOffsetY(item, getUserDepthOffsetY(item) - USER_DEPTH_OFFSET_STEP);
    return;
  }

  if (action === "reset") {
    setUserDepthOffsetY(item, 0);
    return;
  }

  if (action === "attach" && isSelectedBuildItem(item)) {
    attachMountedGearItem(item);
    syncSceneDepthControls();
    return;
  }

  if (action === "detach" && isSelectedBuildItem(item)) {
    detachMountedGearItem(item);
    syncSceneDepthControls();
  }
}

function refreshGearSceneLayout(item) {
  if (!isSceneDepthAdjustableItem(item)) {
    return;
  }

  const scene = item.scene || {};
  const element = getGearSceneElement(item);
  const frontElement = document.getElementById(getGearFrontElementId(item));
  const layers = scene.layers || {};

  if (element) {
    applyGearSceneLayout(element, item, scene.zIndex || 20);
  }

  if (frontElement && layers.front) {
    applyGearSceneLayout(frontElement, item, scene.frontZIndex || 31, SCENE_FRONT_LAYER_OFFSET);
  }

  updateSceneOcclusion();
  syncSceneDepthControls();
}

function refreshMountedGearSceneLayouts() {
  getGearItems().forEach(function(item) {
    if (!item || !item.scene || !item.scene.mountTo || !isGearVisibleInScene(item)) {
      return;
    }

    refreshGearSceneLayout(item);
  });
}

function configureGearDepthAdjustTarget(element, item) {
  if (!element || !item || !item.scene || item.scene.renderMode === "campfire") {
    return;
  }

  element.dataset.depthTargetId = item.id;
  element.classList.add("depth-adjustable-target");

  if (element.dataset.depthAdjustHandlersBound === "true") {
    return;
  }

  element.dataset.depthAdjustHandlersBound = "true";
  element.addEventListener("pointerenter", function(event) {
    const targetItem = getGearItem(event.currentTarget.dataset.depthTargetId);
    showSceneDepthControlsForItem(targetItem);
  });
  element.addEventListener("pointerleave", scheduleHideSceneDepthControls);
  element.addEventListener("focusin", function(event) {
    const targetItem = getGearItem(event.currentTarget.dataset.depthTargetId);
    showSceneDepthControlsForItem(targetItem);
  });
  element.addEventListener("focusout", scheduleHideSceneDepthControls);
  element.addEventListener("pointerdown", function(event) {
    const targetItem = getGearItem(event.currentTarget.dataset.depthTargetId);
    showSceneDepthControlsForItem(targetItem);
  });
}

function getBuildSelectionKey(item) {
  if (!item || !item.id) {
    return "";
  }

  const explicitInstanceKey = item.instanceKey || item.instanceId || item.placementKey || item.placementId;
  const placedIndex = Array.isArray(gameState.placedGear) ? gameState.placedGear.indexOf(item.id) : -1;
  const instanceKey = explicitInstanceKey || item.id + "#" + (placedIndex >= 0 ? placedIndex : "catalog");

  return getActionTargetKey("build", String(instanceKey));
}

function getBuildItemBySelectionKey(selectionKey) {
  if (!selectionKey) {
    return null;
  }

  return getGearItems().find(function(item) {
    return getBuildSelectionKey(item) === selectionKey;
  }) || null;
}

function getSelectedBuildItem() {
  return getBuildItemBySelectionKey(selectedBuildItemKey);
}

function isSelectedBuildItem(item) {
  return Boolean(item && selectedBuildItemKey && getBuildSelectionKey(item) === selectedBuildItemKey);
}

function reconcileSelectedBuildTarget() {
  if (selectedBuildItemKey && !isBuildDraggableItem(getSelectedBuildItem())) {
    clearSelectedBuildTarget();
  }
}

function isBuildDraggableItem(item) {
  return Boolean(
    item &&
    item.scene &&
    !isGearPositionLocked(item) &&
    item.scene.renderMode !== "campfire" &&
    isGearVisibleInScene(item)
  );
}

function selectBuildTarget(element, item) {
  const selectionKey = getBuildSelectionKey(item);

  if (!element || !item || !selectionKey) {
    return;
  }

  clearSelectedBuildTarget();
  clearSelectedActionTarget();
  selectedBuildItemKey = selectionKey;
  element.dataset.buildItemKey = selectionKey;
  updateTargetOutlineForElement(element);
  element.classList.add("build-selected-target");
  showSceneDepthControlsForItem(item);
}

function getScenePointFromPointerEvent(event) {
  if (!event || !sceneContent) {
    return null;
  }

  const contentRect = sceneContent.getBoundingClientRect();
  const scaleX = contentRect.width / BASE_SCENE_WIDTH;
  const scaleY = contentRect.height / BASE_SCENE_HEIGHT;

  if (scaleX <= 0 || scaleY <= 0) {
    return null;
  }

  return {
    x: clamp((event.clientX - contentRect.left) / scaleX, 0, BASE_SCENE_WIDTH),
    y: clamp((event.clientY - contentRect.top) / scaleY, 0, BASE_SCENE_HEIGHT)
  };
}

function isPointInViewportRect(clientX, clientY, rect) {
  return Boolean(
    rect &&
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function getBuildHitSourceImages(element) {
  if (!element) {
    return [];
  }

  return Array.from(element.querySelectorAll(".object-image")).filter(isOutlineSourceImage);
}

function getBuildHitCanvasContext(width, height) {
  if (typeof document === "undefined" || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  if (!buildHitCanvas) {
    buildHitCanvas = document.createElement("canvas");
  }

  if (!buildHitCanvasContext) {
    buildHitCanvasContext = buildHitCanvas.getContext("2d", { willReadFrequently: true }) || buildHitCanvas.getContext("2d");
  }

  if (!buildHitCanvasContext) {
    return null;
  }

  if (buildHitCanvas.width !== width || buildHitCanvas.height !== height) {
    buildHitCanvas.width = width;
    buildHitCanvas.height = height;
  } else {
    buildHitCanvasContext.clearRect(0, 0, width, height);
  }

  return buildHitCanvasContext;
}

function isBuildHitImageMirrored(image) {
  const objectElement = image && image.closest ? image.closest(".asset-object") : null;

  if (!objectElement || typeof window === "undefined") {
    return false;
  }

  return window.getComputedStyle(objectElement).getPropertyValue("--object-scale-x").trim() === "-1";
}

function isBuildHitElementMirrored(element) {
  if (!element || typeof window === "undefined") {
    return false;
  }

  return window.getComputedStyle(element).getPropertyValue("--object-scale-x").trim() === "-1";
}

function getBuildHitFallbackZones(item) {
  if (!item) {
    return [];
  }

  if (BUILD_HIT_FALLBACK_ZONES[item.id]) {
    return BUILD_HIT_FALLBACK_ZONES[item.id];
  }

  if (item.scene && item.scene.buildHitZones) {
    return item.scene.buildHitZones;
  }

  const occlusionFootprint = getOcclusionFootprint(item);

  if (occlusionFootprint) {
    return [occlusionFootprint];
  }

  const collisionFootprint = getCollisionFootprint(item);

  if (collisionFootprint) {
    return [collisionFootprint];
  }

  return [
    { ratioX: 0.16, ratioY: 0.22, ratioWidth: 0.68, ratioHeight: 0.62 }
  ];
}

function doesBuildHitFallbackZone(element, item, clientX, clientY) {
  const rect = element ? element.getBoundingClientRect() : null;

  if (!isPointInViewportRect(clientX, clientY, rect) || rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  const ratioX = clamp((clientX - rect.left) / rect.width, 0, 1);
  const ratioY = clamp((clientY - rect.top) / rect.height, 0, 1);
  const sampleRatioX = isBuildHitElementMirrored(element) ? 1 - ratioX : ratioX;

  return getBuildHitFallbackZones(item).some(function(zone) {
    return Boolean(
      zone &&
      sampleRatioX >= zone.ratioX &&
      sampleRatioX <= zone.ratioX + zone.ratioWidth &&
      ratioY >= zone.ratioY &&
      ratioY <= zone.ratioY + zone.ratioHeight
    );
  });
}

function isBuildHitVisibleImagePixel(image, clientX, clientY) {
  if (!image) {
    return false;
  }

  const rect = image.getBoundingClientRect();

  if (!isPointInViewportRect(clientX, clientY, rect) || rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  if (!naturalWidth || !naturalHeight || !image.complete) {
    return null;
  }

  const ratioX = clamp((clientX - rect.left) / rect.width, 0, 1);
  const ratioY = clamp((clientY - rect.top) / rect.height, 0, 1);
  const sampleRatioX = isBuildHitImageMirrored(image) ? 1 - ratioX : ratioX;
  const sampleX = clamp(Math.floor(sampleRatioX * naturalWidth), 0, naturalWidth - 1);
  const sampleY = clamp(Math.floor(ratioY * naturalHeight), 0, naturalHeight - 1);
  const context = getBuildHitCanvasContext(naturalWidth, naturalHeight);

  if (!context) {
    return null;
  }

  try {
    context.drawImage(image, 0, 0, naturalWidth, naturalHeight);
    return context.getImageData(sampleX, sampleY, 1, 1).data[3] >= BUILD_HIT_ALPHA_THRESHOLD;
  } catch (error) {
    return null;
  }
}

function doesBuildHitElementVisiblePixel(element, item, clientX, clientY) {
  const images = getBuildHitSourceImages(element);
  let hasUnreadableImage = images.length === 0;

  for (let index = 0; index < images.length; index += 1) {
    const hitResult = isBuildHitVisibleImagePixel(images[index], clientX, clientY);

    if (hitResult === true) {
      return true;
    }

    if (hitResult === null) {
      hasUnreadableImage = true;
    }
  }

  return hasUnreadableImage ? doesBuildHitFallbackZone(element, item, clientX, clientY) : false;
}

function getBuildHitElementZIndex(element) {
  if (!element) {
    return 0;
  }

  const inlineZIndex = parseInt(element.style.zIndex, 10);

  if (Number.isFinite(inlineZIndex)) {
    return inlineZIndex;
  }

  if (typeof window !== "undefined") {
    const computedZIndex = parseInt(window.getComputedStyle(element).zIndex, 10);

    if (Number.isFinite(computedZIndex)) {
      return computedZIndex;
    }
  }

  return Number(element.dataset && element.dataset.sceneDisplayDepthY) || 0;
}

function getBuildHitCandidates() {
  return Array.from(document.querySelectorAll(".gear-object, .gear-front-layer")).map(function(element, index) {
    const item = getOccluderItemForElement(element);

    return {
      element: element,
      dragElement: item ? getGearSceneElement(item) : null,
      item: item,
      zIndex: getBuildHitElementZIndex(element),
      sourceOrder: index
    };
  }).filter(function(candidate) {
    return Boolean(
      candidate.item &&
      candidate.dragElement &&
      isBuildDraggableItem(candidate.item) &&
      !candidate.element.classList.contains("hidden") &&
      !candidate.dragElement.classList.contains("hidden")
    );
  }).sort(function(first, second) {
    if (first.zIndex !== second.zIndex) {
      return second.zIndex - first.zIndex;
    }

    return second.sourceOrder - first.sourceOrder;
  });
}

function getBuildHitTarget(event) {
  if (!event) {
    return null;
  }

  const candidates = getBuildHitCandidates();

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const rect = candidate.element.getBoundingClientRect();

    if (
      isPointInViewportRect(event.clientX, event.clientY, rect) &&
      doesBuildHitElementVisiblePixel(candidate.element, candidate.item, event.clientX, event.clientY)
    ) {
      return {
        element: candidate.dragElement,
        item: candidate.item
      };
    }
  }

  return null;
}

function handleBuildScenePointerDown(event) {
  if (!isBuildModeActive()) {
    return;
  }

  if (event.button !== undefined && event.button !== 0) {
    return;
  }

  if (isSceneDepthControlEventTarget(event)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const hitTarget = getBuildHitTarget(event);

  if (!hitTarget) {
    clearSelectedBuildTarget();
    depthControlHoverTargetId = "";
    syncSceneDepthControls();
    return;
  }

  suppressNextBuildClick = true;
  startBuildDrag(event, hitTarget.element, hitTarget.item);
}

function handleCampSceneClick(event) {
  if (isSceneDepthControlEventTarget(event)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (isBuildModeActive() && suppressNextBuildClick) {
    suppressNextBuildClick = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (isBuildModeActive()) {
    clearSelectedBuildTarget();
  } else {
    clearSelectedActionTarget();
  }
}

function startBuildDrag(event, element, item) {
  const pointerPoint = getScenePointFromPointerEvent(event);
  const layoutOverride = getSceneLayoutOverride(item);
  const startPosition = getScenePixelPosition(item.scene || {}, layoutOverride);

  if (!pointerPoint || !isBuildDraggableItem(item)) {
    return;
  }

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  selectBuildTarget(element, item);

  if (isMountedGearItem(item) && !isMountedGearDetached(item)) {
    return;
  }

  element.classList.add("build-dragging");

  const captureElement = event && event.currentTarget && event.currentTarget.setPointerCapture ? event.currentTarget : element;

  buildDragState = {
    itemKey: getBuildSelectionKey(item),
    itemId: item.id,
    pointerId: event.pointerId,
    startPointer: pointerPoint,
    startPosition: startPosition,
    captureElement: captureElement,
    moved: false
  };

  if (captureElement && captureElement.setPointerCapture && event.pointerId !== undefined) {
    captureElement.setPointerCapture(event.pointerId);
  }
}

function updateBuildDrag(event) {
  if (!buildDragState || !isBuildModeActive()) {
    return;
  }

  if (event && buildDragState.pointerId !== undefined && event.pointerId !== buildDragState.pointerId) {
    return;
  }

  const item = getBuildItemBySelectionKey(buildDragState.itemKey) || getGearItem(buildDragState.itemId);
  const pointerPoint = getScenePointFromPointerEvent(event);

  if (!item || !pointerPoint) {
    return;
  }

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const delta = {
    x: pointerPoint.x - buildDragState.startPointer.x,
    y: pointerPoint.y - buildDragState.startPointer.y
  };
  const nextPoint = clampScenePoint({
    x: buildDragState.startPosition.x + delta.x,
    y: buildDragState.startPosition.y + delta.y
  });

  if (getScenePointDistance(nextPoint, buildDragState.startPosition) > 2) {
    buildDragState.moved = true;
  }

  if (isMountedGearItem(item) && !isMountedGearDetached(item)) {
    return;
  }

  setUserGearPosition(item, scenePointToPercent(nextPoint), false);

  refreshMountedGearSceneLayouts();
  syncSceneDepthControls();
}

function finishBuildDrag(event) {
  if (!buildDragState) {
    return;
  }

  if (event && buildDragState.pointerId !== undefined && event.pointerId !== buildDragState.pointerId) {
    return;
  }

  const endedDragState = buildDragState;
  const item = getBuildItemBySelectionKey(endedDragState.itemKey) || getGearItem(endedDragState.itemId);
  const element = getGearSceneElement(item);

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (element) {
    element.classList.remove("build-dragging");
  }

  if (endedDragState.captureElement && endedDragState.captureElement.releasePointerCapture && endedDragState.pointerId !== undefined) {
    try {
      endedDragState.captureElement.releasePointerCapture(endedDragState.pointerId);
    } catch (error) {
      // Pointer capture may already be released by the browser.
    }
  }

  buildDragState = null;

  if (item && element) {
    selectBuildTarget(element, item);
  }

  if (item) {
    refreshGearSceneLayout(item);
    refreshMountedGearSceneLayouts();
    saveGame();
  }
}

function configureGearBuildDragTarget(element, item) {
  if (!element || !item || !item.scene || item.scene.renderMode === "campfire") {
    return;
  }

  element.dataset.buildTargetId = item.id;
  element.dataset.buildItemKey = getBuildSelectionKey(item);

  if (element.dataset.buildDragHandlersBound === "true") {
    return;
  }

  element.dataset.buildDragHandlersBound = "true";
  element.addEventListener("click", function(event) {
    if (!isBuildModeActive()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  });
  element.addEventListener("pointerdown", function(event) {
    const targetItem = getBuildItemBySelectionKey(event.currentTarget.dataset.buildItemKey) || getGearItem(event.currentTarget.dataset.buildTargetId);

    if (!isBuildModeActive() || !isBuildDraggableItem(targetItem)) {
      return;
    }

    startBuildDrag(event, event.currentTarget, targetItem);
  });
}

function getActionTargetKey(type, targetId, metadata) {
  const actionMetadata = metadata || {};

  if (type === "activity" && actionMetadata.activityId) {
    return type + ":" + actionMetadata.activityId + ":" + targetId;
  }

  return type + ":" + targetId;
}

function getActionKey(action) {
  return action ? getActionTargetKey(action.type, action.targetId, action) : "";
}

function clearSelectedActionTarget() {
  if (selectedActionTargetElement) {
    selectedActionTargetElement.classList.remove("selected-action-target");
  }

  selectedActionTargetElement = null;
  selectedActionTargetKey = "";
  syncSceneDepthControls();
}

function clearSelectedBuildTarget() {
  if (selectedBuildItemKey) {
    document.querySelectorAll(".build-selected-target").forEach(function(element) {
      element.classList.remove("build-selected-target");
    });
  }

  selectedBuildItemKey = "";
  syncSceneDepthControls();
}

function getGearSelectionKey(item) {
  const actionType = getGearActionType(item);

  return actionType && item ? getActionTargetKey(actionType, item.id, getGearActionMetadata(item)) : "";
}

function getGearTouchPrompt(item) {
  const actionType = getGearActionType(item);

  if (actionType === "activity") {
    const activity = getActivityDefinition(getActivityIdForGear(item));
    return "Tap again to send the camper to " + (activity ? activity.label.toLowerCase() : "do an activity") + " near " + item.displayName + ".";
  }

  if (actionType === "chair") {
    return "Tap again to send the camper to sit at " + item.displayName + ".";
  }

  if (actionType === "tent") {
    return "Tap again to send the camper to rest in " + item.displayName + ".";
  }

  return "Tap again to send the camper to " + item.displayName + ".";
}

function isSelectedActionTarget(element, item) {
  return selectedActionTargetElement === element && selectedActionTargetKey === getGearSelectionKey(item);
}

function selectActionTarget(element, item) {
  const selectionKey = getGearSelectionKey(item);

  if (!element || !selectionKey) {
    return;
  }

  clearSelectedActionTarget();
  updateTargetOutlineForElement(element);
  element.classList.add("selected-action-target");
  selectedActionTargetElement = element;
  selectedActionTargetKey = selectionKey;
  showSceneDepthControlsForItem(item);
  setStatus(getGearTouchPrompt(item));
}

function isTouchLikeActionEvent(event, element) {
  const pointerType = (event && event.pointerType) || (element && element.dataset && element.dataset.lastPointerType) || "";

  return pointerType === "touch" || pointerType === "pen";
}

function rememberActionPointerType(event, element) {
  if (!element || !element.dataset) {
    return;
  }

  element.dataset.lastPointerType = (event && event.pointerType) || "";
}

function handleGearActionClick(event, element, item) {
  const actionType = getGearActionType(item);
  const actionMetadata = getGearActionMetadata(item);

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (isBuildModeActive()) {
    return;
  }

  if (!actionType || !isGearVisibleInScene(item)) {
    clearSelectedActionTarget();
    return;
  }

  if (actionType === "inventory") {
    clearSelectedActionTarget();
    openInventoryPanel();
    return;
  }

  if (hasQueuedAction(actionType, item.id, actionMetadata)) {
    clearSelectedActionTarget();
    queueGearAction(item);
    return;
  }

  if (isTouchLikeActionEvent(event, element)) {
    if (isSelectedActionTarget(element, item)) {
      clearSelectedActionTarget();
      queueGearAction(item);
    } else {
      selectActionTarget(element, item);
    }

    return;
  }

  clearSelectedActionTarget();
  queueGearAction(item);
}

function getQueuedActionsInOrder() {
  const queuedActions = activeQueuedAction && activeQueuedAction.indicatorVisible !== false ? [activeQueuedAction] : [];

  return queuedActions.concat(actionQueue);
}

function getActionTargetElement(action) {
  if (!action) {
    return null;
  }

  if (action.type === "activity") {
    const zoneId = getActivityZoneIdFromTargetId(action.targetId);

    if (zoneId) {
      return getActivityZoneElement(zoneId);
    }
  }

  if (action.type === "wood") {
    return document.getElementById("wood-" + action.targetId);
  }

  if (action.type === "fire") {
    return campfire;
  }

  const item = getGearItem(action.targetId);

  return getGearSceneElement(item);
}

function clearActionQueueIndicators() {
  document.querySelectorAll(".queue-order-badge").forEach(function(badge) {
    badge.remove();
  });

  document.querySelectorAll(".queued-action-target, .active-action-target").forEach(function(element) {
    element.classList.remove("queued-action-target", "active-action-target");
    element.removeAttribute("data-queue-order");
  });
}

function updateActionQueueIndicators() {
  clearActionQueueIndicators();

  if (isBuildModeActive()) {
    return;
  }

  getQueuedActionsInOrder().forEach(function(action, index) {
    const target = getActionTargetElement(action);

    if (!target || target.classList.contains("hidden")) {
      return;
    }

    const order = index + 1;
    const badge = document.createElement("span");

    updateTargetOutlineForElement(target);
    target.classList.add("queued-action-target");
    target.classList.toggle("active-action-target", index === 0);
    target.setAttribute("data-queue-order", String(order));

    badge.className = "queue-order-badge";
    badge.textContent = order;
    badge.setAttribute("aria-hidden", "true");
    target.appendChild(badge);
  });
}

function hasQueuedAction(type, targetId, metadata) {
  const key = getActionTargetKey(type, targetId, metadata);

  if (getActionKey(activeQueuedAction) === key) {
    return true;
  }

  return actionQueue.some(function(action) {
    return getActionKey(action) === key;
  });
}

function getQueuedActionLabel(type, targetId, metadata) {
  if (type === "activity") {
    const activity = getActivityDefinition(metadata && metadata.activityId || targetId);
    return activity ? activity.label : "activity";
  }

  if (type === "wood") {
    return "fallen branches";
  }

  if (type === "fire") {
    return "campfire";
  }

  const item = getGearItem(targetId);

  return item ? item.displayName : "target";
}

function enqueueAction(type, targetId, metadata) {
  const actionMetadata = metadata || {};
  const label = getQueuedActionLabel(type, targetId, actionMetadata);

  if (isBuildModeActive()) {
    return false;
  }

  if (hasQueuedAction(type, targetId, actionMetadata)) {
    if (selectedActionTargetKey === getActionTargetKey(type, targetId, actionMetadata)) {
      clearSelectedActionTarget();
    }

    setStatus(label + " is already in the queue.");
    return false;
  }

  actionQueue.push({
    id: nextActionQueueId,
    type: type,
    targetId: targetId,
    activityId: actionMetadata.activityId || ""
  });
  nextActionQueueId += 1;
  clearSelectedActionTarget();
  updateActionQueueIndicators();

  if (!beginNextQueuedAction()) {
    setStatus(label + " added to the queue.");
  }

  return true;
}

function clearActionQueue() {
  actionQueue = [];
  activeQueuedAction = null;
  updateActionQueueIndicators();
}

function canStartQueuedAction() {
  return !isBuildModeActive() && !activeQueuedAction && actionQueue.length > 0 && !camper.carryingWood;
}

function beginNextQueuedAction() {
  if (!canStartQueuedAction()) {
    return false;
  }

  activeQueuedAction = actionQueue.shift();
  activeQueuedAction.indicatorVisible = true;
  updateActionQueueIndicators();
  executeQueuedAction(activeQueuedAction);
  return true;
}

function hideActiveQueuedActionIndicator() {
  if (!activeQueuedAction || activeQueuedAction.indicatorVisible === false) {
    return;
  }

  activeQueuedAction.indicatorVisible = false;
  updateActionQueueIndicators();
}

function completeActiveQueuedAction() {
  activeQueuedAction = null;
  updateActionQueueIndicators();

  if (!beginNextQueuedAction()) {
    chooseNextCamperAction();
  }
}

function isGearQueueInteractive(item) {
  if (!item || !item.scene) {
    return false;
  }

  if (canOpenInventoryFromCooler(item)) {
    return true;
  }

  if (item.category === "chair" && item.interactions && item.interactions.seatable) {
    return true;
  }

  if (isTentItem(item) && item.interactions && item.interactions.tentRest) {
    return true;
  }

  return Boolean(getActivityIdForGear(item));
}

function getGearActionType(item) {
  if (canOpenInventoryFromCooler(item)) {
    return "inventory";
  }

  if (getActivityIdForGear(item)) {
    return "activity";
  }

  if (item && item.category === "chair" && item.interactions && item.interactions.seatable) {
    return "chair";
  }

  if (item && isTentItem(item) && item.interactions && item.interactions.tentRest) {
    return "tent";
  }

  return "";
}

function queueGearAction(item) {
  const actionType = getGearActionType(item);
  const actionMetadata = getGearActionMetadata(item);

  if (!actionType || actionType === "inventory" || !isGearVisibleInScene(item)) {
    return;
  }

  enqueueAction(actionType, item.id, actionMetadata);
}

function executeQueuedAction(action) {
  if (!action) {
    return;
  }

  if (action.type === "wood") {
    executeQueuedWoodAction(action);
    return;
  }

  if (action.type === "chair") {
    executeQueuedChairAction(action);
    return;
  }

  if (action.type === "tent") {
    executeQueuedTentAction(action);
    return;
  }

  if (action.type === "fire") {
    executeQueuedFireAction();
    return;
  }

  if (action.type === "activity") {
    executeQueuedActivityAction(action);
    return;
  }

  completeActiveQueuedAction();
}

function setVersionedLayerSource(image, path) {
  if (image && path) {
    const nextSrc = withVersion(path);

    setDatasetValue(image, "assetPath", path);

    if (image.getAttribute("src") !== nextSrc) {
      setDatasetValue(image, "imageLoadError", "");
      image.src = nextSrc;
    }

    image.onerror = function() {
      image.dataset.imageLoadError = "true";
    };
  }
}

function reapplyGearSceneLayoutWhenImageReady(element, item, zIndex, depthOffset) {
  const sourceImage = getSceneAssetSourceImage(element);

  if (!sourceImage) {
    return;
  }

  const reapplyLayout = function() {
    applyGearSceneLayout(element, item, zIndex, depthOffset);
    updateTargetOutlineForElement(element);
    updateActionQueueIndicators();
    updateSceneOcclusion();
    syncSceneDepthControls();
  };

  if (sourceImage.naturalWidth && sourceImage.naturalHeight) {
    reapplyLayout();
    return;
  }

  sourceImage.addEventListener("load", reapplyLayout, { once: true });
  sourceImage.addEventListener("error", reapplyLayout, { once: true });
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

  configureGearActionTarget(element, item);
  configureGearDepthAdjustTarget(element, item);
  configureGearBuildDragTarget(element, item);

  return element;
}

function configureGearActionTarget(element, item) {
  if (!element || !item) {
    return;
  }

  element.setAttribute("data-action-target-id", item.id);

  if (!isGearQueueInteractive(item)) {
    if (selectedActionTargetElement === element) {
      clearSelectedActionTarget();
    }

    element.onclick = null;
    element.onpointerdown = null;
    element.ontouchstart = null;
    element.onkeydown = null;
    element.removeAttribute("role");
    element.removeAttribute("tabindex");
    return;
  }

  element.setAttribute("role", "button");
  element.tabIndex = 0;
  element.onpointerdown = function(event) {
    rememberActionPointerType(event, element);
  };
  element.ontouchstart = function() {
    element.dataset.lastPointerType = "touch";
  };
  element.onclick = function(event) {
    handleGearActionClick(event, element, item);
  };
  element.onkeydown = function(event) {
    if (event.key === "Enter" || event.key === " ") {
      handleGearActionClick(event, element, item);
    }
  };
}

function getOrCreateActivityZoneLayer() {
  if (!activityZoneLayer && sceneContent) {
    activityZoneLayer = document.createElement("div");
    activityZoneLayer.className = "activity-zone-layer";
    activityZoneLayer.setAttribute("aria-label", "Activity areas");
    sceneContent.appendChild(activityZoneLayer);
  }

  return activityZoneLayer;
}

function queueActivityZoneAction(zone) {
  if (!zone || isBuildModeActive()) {
    return;
  }

  clearSelectedActionTarget();
  enqueueAction("activity", getActivityZoneTargetId(zone.id), { activityId: zone.activityId });
}

function configureActivityZoneElement(element, zone) {
  if (!element || !zone) {
    return;
  }

  element.type = "button";
  element.setAttribute("aria-label", zone.label);
  element.setAttribute("data-action-target-id", getActivityZoneTargetId(zone.id));
  element.dataset.activityId = zone.activityId;
  element.dataset.activityZoneId = zone.id;
  element.style.left = zone.bounds.x + "%";
  element.style.top = zone.bounds.y + "%";
  element.style.width = zone.bounds.width + "%";
  element.style.height = zone.bounds.height + "%";
  element.classList.toggle("interactive-action-target", isActivityAvailable(zone.activityId) && !isBuildModeActive());
  element.classList.toggle("hidden", !isActivityAvailable(zone.activityId) || isBuildModeActive());
  element.tabIndex = isActivityAvailable(zone.activityId) && !isBuildModeActive() ? 0 : -1;
  element.onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    queueActivityZoneAction(zone);
  };
  element.onkeydown = function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      queueActivityZoneAction(zone);
    }
  };
}

function updateActivityZoneElements() {
  const layer = getOrCreateActivityZoneLayer();

  if (!layer) {
    return;
  }

  Object.keys(activityZones).forEach(function(zoneId) {
    const zone = activityZones[zoneId];
    let element = getActivityZoneElement(zoneId);

    if (!element) {
      element = document.createElement("button");
      element.id = getActivityZoneElementId(zoneId);
      element.className = "activity-zone";
      layer.appendChild(element);
    }

    configureActivityZoneElement(element, zone);
  });
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

function getNaturalSceneAssetLogicalSize(image) {
  if (!image || !image.naturalWidth || !image.naturalHeight) {
    return null;
  }

  return {
    width: image.naturalWidth / SCENE_ASSET_SCALE,
    height: image.naturalHeight / SCENE_ASSET_SCALE,
    source: "natural"
  };
}

function getSceneAssetSourceImage(element) {
  if (!element) {
    return null;
  }

  return element.querySelector(".gear-layer-base") || Array.from(element.querySelectorAll(".object-image")).find(isOutlineSourceImage);
}

function getSceneAssetPathForLog(item, image) {
  return image && image.dataset && image.dataset.assetPath || item && item.image || "missing image path";
}

function reportSceneAssetSizeState(element, item, status, image) {
  const path = getSceneAssetPathForLog(item, image);
  const id = item && item.id ? item.id : element && element.id || "unknown";
  const key = status + ":" + id + ":" + path;

  if (element && element.dataset.sceneSizeLogKey === key) {
    return;
  }

  if (element) {
    element.dataset.sceneSizeLogKey = key;
  }

  const message = "[scene asset] " + status + " for gear " + id + ": " + path;

  if (status === "loading") {
    console.warn(message);
  } else {
    console.error(message);
  }
}

function getScenePlaceholderLogicalSize(source) {
  return {
    width: DEV_SCENE_PLACEHOLDER_SIZE,
    height: DEV_SCENE_PLACEHOLDER_SIZE,
    source: source
  };
}

function getElementSceneLogicalSize(element) {
  if (!element) {
    return null;
  }

  const width = element.offsetWidth || parseFloat(window.getComputedStyle(element).width);
  const height = element.offsetHeight || parseFloat(window.getComputedStyle(element).height);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return {
    width: width,
    height: height,
    source: "dom"
  };
}

function getSceneAssetLogicalSize(item, element, sourceImage) {
  if (item && item.scene && item.scene.renderMode === "campfire") {
    const elementSize = getElementSceneLogicalSize(element);

    if (elementSize) {
      return elementSize;
    }
  }

  const image = sourceImage || getSceneAssetSourceImage(element);
  const naturalSize = getNaturalSceneAssetLogicalSize(image);

  if (naturalSize) {
    if (element) {
      element.dataset.sceneSizeLogKey = "";
    }

    return naturalSize;
  }

  if (!image) {
    reportSceneAssetSizeState(element, item, "missing-image", image);
    return getScenePlaceholderLogicalSize("missing-image");
  }

  if (image.dataset && image.dataset.imageLoadError === "true") {
    reportSceneAssetSizeState(element, item, "error", image);
    return getScenePlaceholderLogicalSize("error");
  }

  if (!image.complete) {
    reportSceneAssetSizeState(element, item, "loading", image);
    return getScenePlaceholderLogicalSize("loading");
  }

  reportSceneAssetSizeState(element, item, "error", image);
  return getScenePlaceholderLogicalSize("error");
}

function getScenePixelPosition(scene, layoutOverride) {
  const override = layoutOverride || {};

  if (typeof override.sceneX === "number" && typeof override.sceneY === "number") {
    return { x: override.sceneX, y: override.sceneY };
  }

  if (override.position) {
    return percentPointToScenePoint(override.position);
  }

  if (scene && typeof scene.sceneX === "number" && typeof scene.sceneY === "number") {
    return { x: scene.sceneX, y: scene.sceneY };
  }

  if (scene && scene.position) {
    return percentPointToScenePoint(scene.position);
  }

  return { x: 0, y: 0 };
}

function getScenePercentPosition(scene, layoutOverride) {
  const override = layoutOverride || {};

  if (override.position) {
    return override.position;
  }

  if (typeof override.sceneX === "number" && typeof override.sceneY === "number") {
    return scenePointToPercent({ x: override.sceneX, y: override.sceneY });
  }

  if (scene && scene.position) {
    return scene.position;
  }

  if (scene && typeof scene.sceneX === "number" && typeof scene.sceneY === "number") {
    return scenePointToPercent({ x: scene.sceneX, y: scene.sceneY });
  }

  return { x: 0, y: 0 };
}

function getSceneAssetLogicalPoint(item, point, logicalSize) {
  if (!point) {
    return { x: 0, y: 0 };
  }

  if (typeof point.ratioX === "number" && typeof point.ratioY === "number") {
    return {
      x: point.ratioX * logicalSize.width,
      y: point.ratioY * logicalSize.height
    };
  }

  console.error("[scene asset] missing normalized point ratio for gear " + (item && item.id ? item.id : "unknown"));

  return {
    x: logicalSize.width / 2,
    y: logicalSize.height
  };
}

function getSceneGroundAnchor(item, logicalSize) {
  const assetSize = logicalSize || getScenePlaceholderLogicalSize("missing-image");
  const anchors = item && item.anchors ? item.anchors : {};
  const scene = item && item.scene ? item.scene : {};
  const anchor = scene.anchor || anchors.ground;

  if (anchor) {
    return getSceneAssetLogicalPoint(item, anchor, assetSize);
  }

  return { x: assetSize.width / 2, y: assetSize.height };
}

function getSceneDepthY(item, layoutOverride) {
  return getScenePixelPosition(item && item.scene ? item.scene : {}, layoutOverride).y;
}

function getScenePlacementLayer(item, layoutOverride) {
  const scene = item && item.scene ? item.scene : {};

  return layoutOverride && layoutOverride.placementLayer || scene.placementLayer || "ground";
}

function getAutoDepthOffsetY(item, layoutOverride) {
  const scene = item && item.scene ? item.scene : {};
  const placementLayer = getScenePlacementLayer(item, layoutOverride);

  if (layoutOverride && typeof layoutOverride.depthOffsetY === "number") {
    return layoutOverride.depthOffsetY;
  }

  if (typeof scene.depthOffsetY === "number") {
    return scene.depthOffsetY;
  }

  if (scene.mountTo || placementLayer === "mounted") {
    return DEFAULT_MOUNTED_DEPTH_OFFSET_Y;
  }

  if (placementLayer === "surface") {
    return DEFAULT_SURFACE_DEPTH_OFFSET_Y;
  }

  if (placementLayer === "stacked") {
    return DEFAULT_STACKED_DEPTH_OFFSET_Y;
  }

  return 0;
}

function getUserDepthOffsetY(item) {
  const offsets = gameState && gameState.userDepthOffsetY ? gameState.userDepthOffsetY : {};

  if (!item || !item.id || typeof offsets[item.id] !== "number" || !Number.isFinite(offsets[item.id])) {
    return 0;
  }

  return offsets[item.id];
}

function getUserGearPositionMap() {
  if (!gameState.userGearPositions || typeof gameState.userGearPositions !== "object") {
    gameState.userGearPositions = {};
  }

  return gameState.userGearPositions;
}

function getUserGearMountOffsetMap() {
  if (!gameState.userGearMountOffsets || typeof gameState.userGearMountOffsets !== "object") {
    gameState.userGearMountOffsets = {};
  }

  return gameState.userGearMountOffsets;
}

function getUserGearPosition(item) {
  if (isGearPositionLocked(item)) {
    return null;
  }

  const positions = gameState && gameState.userGearPositions ? gameState.userGearPositions : {};
  const position = item && item.id ? positions[item.id] : null;

  if (!position || typeof position.x !== "number" || typeof position.y !== "number") {
    return null;
  }

  return {
    x: clamp(position.x, 0, 100),
    y: clamp(position.y, 0, 100)
  };
}

function isMountedGearItem(item) {
  return Boolean(item && item.scene && item.scene.mountTo);
}

function isMountedGearDetached(item) {
  return Boolean(isMountedGearItem(item) && getUserGearPosition(item));
}

function setUserGearPosition(item, position, shouldSave) {
  if (!item || !item.scene || isGearPositionLocked(item) || !position) {
    return;
  }

  const positions = getUserGearPositionMap();

  positions[item.id] = {
    x: clamp(position.x, 0, 100),
    y: clamp(position.y, 0, 100)
  };

  refreshGearSceneLayout(item);

  if (shouldSave) {
    saveGame();
  }
}

function clearUserGearPosition(item, shouldSave) {
  if (!item || !item.id) {
    return;
  }

  delete getUserGearPositionMap()[item.id];
  refreshGearSceneLayout(item);

  if (shouldSave) {
    saveGame();
  }
}

function clearLegacyGearMountOffset(item) {
  if (!item || !item.id) {
    return;
  }

  delete getUserGearMountOffsetMap()[item.id];
}

function getDisplayedGearLayoutOverride(item) {
  return getSceneLayoutOverride(item);
}

function getDisplayedGearScenePosition(item) {
  if (!item || !item.scene) {
    return null;
  }

  return getScenePixelPosition(item.scene || {}, getDisplayedGearLayoutOverride(item));
}

function getCurrentGearScenePosition(item) {
  return getDisplayedGearScenePosition(item);
}

function detachMountedGearItem(item) {
  if (!isMountedGearItem(item) || isMountedGearDetached(item)) {
    return;
  }

  const currentPosition = getCurrentGearScenePosition(item);

  if (!currentPosition) {
    return;
  }

  clearLegacyGearMountOffset(item);
  setUserGearPosition(item, scenePointToPercent(currentPosition), false);
  refreshMountedGearSceneLayouts();
  saveGame();
  setStatus(item.displayName + " detached from its mount point.");
}

function attachMountedGearItem(item) {
  if (!isMountedGearItem(item)) {
    return;
  }

  clearLegacyGearMountOffset(item);
  clearUserGearPosition(item, false);
  refreshMountedGearSceneLayouts();
  saveGame();
  setStatus(item.displayName + " attached to its mount point.");
}

function getSceneDepthOffsetY(item, layoutOverride, layerOffset) {
  return getAutoDepthOffsetY(item, layoutOverride) + getUserDepthOffsetY(item) + (layerOffset || 0);
}

function getSceneDisplayDepthY(item, layoutOverride, layerOffset) {
  return getSceneDepthY(item, layoutOverride) + getSceneDepthOffsetY(item, layoutOverride, layerOffset);
}

function getDepthZ(depthY, offset) {
  const safeDepthY = Number.isFinite(depthY) ? depthY : 0;
  return SCENE_DEPTH_Z_BASE + Math.round(safeDepthY) + (offset || 0);
}

function setSceneElementDepth(element, depthY, offset) {
  if (!element) {
    return;
  }

  const safeDepthY = Number.isFinite(depthY) ? depthY : 0;
  const depthOffset = Number.isFinite(offset) ? offset : 0;
  const displayDepthY = safeDepthY + depthOffset;

  setStyleValue(element, "zIndex", getDepthZ(displayDepthY, 0));
  setDatasetValue(element, "sceneDepthY", depthY);
  setDatasetValue(element, "sceneDisplayDepthY", displayDepthY);
  setDatasetValue(element, "sceneDepthOffsetY", depthOffset);
}

function getSceneMirrored(item, layoutOverride) {
  const scene = item && item.scene ? item.scene : {};
  return Boolean(layoutOverride && typeof layoutOverride.mirrored === "boolean" ? layoutOverride.mirrored : scene.mirrored);
}

function getCollisionConfig(item) {
  return item && item.scene && item.scene.collision ? item.scene.collision : {};
}

function isValidCollisionFootprint(footprint) {
  return Boolean(
    footprint &&
    typeof footprint.ratioX === "number" &&
    typeof footprint.ratioY === "number" &&
    typeof footprint.ratioWidth === "number" &&
    typeof footprint.ratioHeight === "number" &&
    footprint.ratioWidth > 0 &&
    footprint.ratioHeight > 0
  );
}

function getCollisionFootprint(item) {
  if (!item || !item.scene) {
    return null;
  }

  const collision = getCollisionConfig(item);

  if (collision.enabled === false) {
    return null;
  }

  if (item.scene.mountTo && collision.enabled !== true) {
    return null;
  }

  const footprint = collision.footprint || DEFAULT_COLLISION_FOOTPRINTS[item.category] || {
    ratioX: 0.25,
    ratioY: 0.74,
    ratioWidth: 0.5,
    ratioHeight: 0.2
  };

  return isValidCollisionFootprint(footprint) ? footprint : null;
}

function getMirroredCollisionFootprint(footprint) {
  return {
    ratioX: 1 - footprint.ratioX - footprint.ratioWidth,
    ratioY: footprint.ratioY,
    ratioWidth: footprint.ratioWidth,
    ratioHeight: footprint.ratioHeight
  };
}

function getSceneCollisionRect(item, layoutOverride) {
  const footprint = getCollisionFootprint(item);

  if (!footprint) {
    return null;
  }

  const element = getGearSceneElement(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(item.scene || {}, layoutOverride);
  const activeFootprint = getSceneMirrored(item, layoutOverride) ? getMirroredCollisionFootprint(footprint) : footprint;
  const assetLeft = position.x - groundAnchor.x;
  const assetTop = position.y - groundAnchor.y;

  return {
    id: item.id,
    x: assetLeft + activeFootprint.ratioX * logicalSize.width,
    y: assetTop + activeFootprint.ratioY * logicalSize.height,
    width: activeFootprint.ratioWidth * logicalSize.width,
    height: activeFootprint.ratioHeight * logicalSize.height,
    depthY: position.y
  };
}

function getOcclusionConfig(item) {
  return item && item.scene && item.scene.occlusion ? item.scene.occlusion : {};
}

function getOcclusionFootprint(item) {
  if (!item || !item.scene) {
    return null;
  }

  const occlusion = getOcclusionConfig(item);

  if (occlusion.enabled === false) {
    return null;
  }

  const footprint = occlusion.rect || occlusion.footprint || DEFAULT_OCCLUSION_RECTS[item.category] || getCollisionFootprint(item);
  return isValidCollisionFootprint(footprint) ? footprint : null;
}

function getSceneAssetRatioRect(item, footprint, layoutOverride) {
  if (!item || !item.scene || !footprint) {
    return null;
  }

  const element = getGearSceneElement(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(item.scene || {}, layoutOverride);
  const activeFootprint = getSceneMirrored(item, layoutOverride) ? getMirroredCollisionFootprint(footprint) : footprint;
  const assetLeft = position.x - groundAnchor.x;
  const assetTop = position.y - groundAnchor.y;

  return {
    id: item.id,
    x: assetLeft + activeFootprint.ratioX * logicalSize.width,
    y: assetTop + activeFootprint.ratioY * logicalSize.height,
    width: activeFootprint.ratioWidth * logicalSize.width,
    height: activeFootprint.ratioHeight * logicalSize.height,
    depthY: position.y
  };
}

function getSceneOcclusionRect(item, layoutOverride) {
  const rect = getSceneAssetRatioRect(item, getOcclusionFootprint(item), layoutOverride);

  if (rect) {
    rect.depthY = getSceneDisplayDepthY(item, layoutOverride);
  }

  return rect;
}

function sceneRectToViewportRect(sceneRect) {
  if (!sceneRect || !sceneContent) {
    return null;
  }

  const contentRect = sceneContent.getBoundingClientRect();
  const scaleX = contentRect.width / BASE_SCENE_WIDTH;
  const scaleY = contentRect.height / BASE_SCENE_HEIGHT;

  return {
    left: contentRect.left + sceneRect.x * scaleX,
    top: contentRect.top + sceneRect.y * scaleY,
    right: contentRect.left + (sceneRect.x + sceneRect.width) * scaleX,
    bottom: contentRect.top + (sceneRect.y + sceneRect.height) * scaleY
  };
}

function getViewportRatioRect(baseRect, ratioRect) {
  return {
    left: baseRect.left + baseRect.width * ratioRect.ratioX,
    top: baseRect.top + baseRect.height * ratioRect.ratioY,
    right: baseRect.left + baseRect.width * (ratioRect.ratioX + ratioRect.ratioWidth),
    bottom: baseRect.top + baseRect.height * (ratioRect.ratioY + ratioRect.ratioHeight)
  };
}

function getRectArea(rect) {
  return Math.max(0, rect.right - rect.left) * Math.max(0, rect.bottom - rect.top);
}

function getRectOverlapArea(firstRect, secondRect) {
  if (!rectsOverlap(firstRect, secondRect)) {
    return 0;
  }

  return Math.max(0, Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.left, secondRect.left)) *
    Math.max(0, Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.top, secondRect.top));
}

function getOverlapRatioAgainstCamper(overlapRect, camperBodyRect) {
  const camperArea = getRectArea(camperBodyRect);
  return camperArea > 0 ? getRectOverlapArea(overlapRect, camperBodyRect) / camperArea : 0;
}

function inflateRect(rect, amount) {
  return {
    id: rect.id,
    x: rect.x - amount,
    y: rect.y - amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
    depthY: rect.depthY
  };
}

function pointInRect(point, rect) {
  return Boolean(
    point &&
    rect &&
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function getCurrentVehicleItem(state) {
  return getEquippedGearItem("vehicle", state || gameState);
}

function isVehiclePlaced(item, state) {
  return Boolean(item && isVehicleItem(item) && getEquippedGearId("vehicle", state || gameState) === item.id && isGearPlaced(item.id, state));
}

function getScenePointFromAssetPoint(item, point, layoutOverride) {
  const scene = item.scene || {};
  const logicalSize = getSceneAssetLogicalSize(item, getGearSceneElement(item));
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const assetPoint = getSceneAssetLogicalPoint(item, point, logicalSize);
  const position = getScenePixelPosition(scene, layoutOverride);

  return {
    x: position.x + assetPoint.x - groundAnchor.x,
    y: position.y + assetPoint.y - groundAnchor.y
  };
}

function getVehicleRoofMount(vehicleItem) {
  const scene = vehicleItem && vehicleItem.scene ? vehicleItem.scene : {};

  return scene.roofMount || {
    ratioX: 0.5,
    ratioY: 0.34,
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
  const vehicleLayoutOverride = getSceneLayoutOverride(vehicleItem);
  const scenePoint = getScenePointFromAssetPoint(vehicleItem, mount, vehicleLayoutOverride);

  return {
    sceneX: scenePoint.x,
    sceneY: scenePoint.y,
    position: scenePointToPercent(scenePoint),
    zIndex: mount.zIndex || item.scene.zIndex || 16,
    placementLayer: "mounted"
  };
}
function getVehicleMountLayout(item, mountKey) {
  const vehicleItem = getCurrentVehicleItem();

  if (!isVehiclePlaced(vehicleItem)) {
    return null;
  }

  const vehicleScene = vehicleItem.scene || {};
  const mount = vehicleScene[mountKey];

  if (!mount) {
    return null;
  }

  const vehicleLayoutOverride = getSceneLayoutOverride(vehicleItem);
  const scenePoint = getScenePointFromAssetPoint(vehicleItem, mount, vehicleLayoutOverride);

  return {
    sceneX: scenePoint.x,
    sceneY: scenePoint.y,
    position: scenePointToPercent(scenePoint),
    zIndex: mount.zIndex || item.scene.zIndex || 20,
    placementLayer: "mounted",
    mirrored: typeof mount.mirrored === "boolean" ? mount.mirrored : item.scene.mirrored
  };
}
function getSceneLayoutOverride(item) {
  const userPosition = getUserGearPosition(item);

  if (item && item.scene && item.scene.mountTo && userPosition) {
    return {
      position: userPosition,
      placementLayer: "detached"
    };
  }

  if (item && item.scene && item.scene.mountTo === "vehicleRoof") {
    return getRooftopTentLayout(item);
  }

  if (item && item.scene && item.scene.mountTo === "vehicleAwning") {
    return getVehicleMountLayout(item, "awningMount");
  }

  if (userPosition) {
    return {
      position: userPosition
    };
  }

  return null;
}

function applyGearSceneLayout(element, item, zIndex, depthOffset) {
  const scene = item.scene || {};
  const layoutOverride = getSceneLayoutOverride(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(scene, layoutOverride);
  const mirrored = layoutOverride && typeof layoutOverride.mirrored === "boolean" ? layoutOverride.mirrored : scene.mirrored;
  const depthY = getSceneDepthY(item, layoutOverride);
  const sceneDepthOffsetY = getSceneDepthOffsetY(item, layoutOverride, depthOffset);

  setStyleValue(element, "left", position.x + "px");
  setStyleValue(element, "top", position.y + "px");
  setStyleValue(element, "width", logicalSize.width + "px");
  setStyleValue(element, "height", logicalSize.height + "px");
  setStyleValue(element, "aspectRatio", logicalSize.width + " / " + logicalSize.height);
  setSceneElementDepth(element, depthY, sceneDepthOffsetY);
  setStyleProperty(element, "--object-anchor-x", -groundAnchor.x / logicalSize.width * 100 + "%");
  setStyleProperty(element, "--object-anchor-y", -groundAnchor.y / logicalSize.height * 100 + "%");
  setStyleProperty(element, "--object-scale-x", mirrored ? "-1" : "1");
  element.classList.toggle("gear-mirrored", Boolean(mirrored));
  setDatasetValue(element, "sceneSizeSource", logicalSize.source);
  setDatasetValue(element, "scenePlacementLayer", getScenePlacementLayer(item, layoutOverride));
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

  setElementClassName(
    element,
    "gear-object asset-object category-" + item.category + (element.classList.contains("hidden") ? " hidden" : "")
  );
  configureGearDepthAdjustTarget(element, item);
  configureGearBuildDragTarget(element, item);

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

  applyGearSceneLayout(element, item, scene.zIndex || 20);
  reapplyGearSceneLayoutWhenImageReady(element, item, scene.zIndex || 20);

  const frontElement = layers.front ? getOrCreateGearFrontElement(item) : document.getElementById(getGearFrontElementId(item));

  if (frontElement) {
    if (layers.front) {
      setVersionedLayerSource(ensureLayerImage(frontElement, "gear-layer-front"), layers.front);
      applyGearSceneLayout(frontElement, item, scene.frontZIndex || 31, SCENE_FRONT_LAYER_OFFSET);
      reapplyGearSceneLayoutWhenImageReady(frontElement, item, scene.frontZIndex || 31, SCENE_FRONT_LAYER_OFFSET);
    }
  }
}

function updateCampfireDepth() {
  const campfireItem = getGearItem("campfire");
  const depthY = campfireItem && campfireItem.scene ? getSceneDepthY(campfireItem) : sceneYFromPercent(campSpots.fire.y);
  setSceneElementDepth(campfire, depthY, 0);
}

function getSceneOccluderElements() {
  const occluders = Array.from(document.querySelectorAll(".gear-object, .gear-front-layer"));

  if (campfire) {
    occluders.push(campfire);
  }

  return occluders;
}

function rectsOverlap(firstRect, secondRect) {
  return Boolean(
    firstRect &&
    secondRect &&
    firstRect.left < secondRect.right &&
    firstRect.right > secondRect.left &&
    firstRect.top < secondRect.bottom &&
    firstRect.bottom > secondRect.top
  );
}

function getCamperBodyViewportRect() {
  const camperRect = camperElement.getBoundingClientRect();
  const bodyRect = CAMPER_BODY_RECTS[camper.pose] || CAMPER_BODY_RECTS.default;
  return getViewportRatioRect(camperRect, bodyRect);
}

function getOccluderItemForElement(element) {
  if (!element) {
    return null;
  }

  if (element === campfire) {
    return getGearItem("campfire");
  }

  if (element.dataset && element.dataset.actionTargetId) {
    return getGearItem(element.dataset.actionTargetId);
  }

  if (element.id && element.id.indexOf("gear-") === 0 && element.id.endsWith("-front")) {
    return getGearItem(element.id.slice(5, -6));
  }

  return null;
}

function shouldIgnoreOccluderItem(item) {
  return Boolean(item && camper.interactionTargetId && item.id === camper.interactionTargetId);
}

function getCamperGearInteractionDepthItem(targetId) {
  const item = getGearItem(targetId);

  return (
    item &&
    item.scene &&
    item.scene.renderMode !== "campfire" &&
    isGearVisibleInScene(item)
  ) ? item : null;
}

function getGearInteractionDepthY(item) {
  if (!item || !item.scene) {
    return null;
  }

  const depthY = getSceneDepthY(item, getDisplayedGearLayoutOverride(item));
  return Number.isFinite(depthY) ? depthY : null;
}

function getCamperInteractionApproachDepthY(currentDepthY) {
  const targetItem = getCamperGearInteractionDepthItem(camper.interactionTargetId);

  if (
    camper.state !== "moving" ||
    !camper.target ||
    !targetItem ||
    !Number.isFinite(camper.target.x) ||
    !Number.isFinite(camper.target.y)
  ) {
    return currentDepthY;
  }

  const currentPoint = {
    x: sceneXFromPercent(camper.x),
    y: currentDepthY
  };
  const targetPoint = percentPointToScenePoint(camper.target);
  const targetDistance = getScenePointDistance(currentPoint, targetPoint);

  if (targetDistance > CAMPER_INTERACTION_DEPTH_APPROACH_DISTANCE) {
    return currentDepthY;
  }

  const targetDepthY = getGearInteractionDepthY(targetItem);

  return Math.max(currentDepthY, targetPoint.y, targetDepthY === null ? currentDepthY : targetDepthY);
}

function getCamperSeatedDepthY(currentDepthY) {
  if (
    camper.state !== "acting" ||
    (camper.currentAction !== "sittingOnFurniture" && camper.currentAction !== "sittingOnChair")
  ) {
    return currentDepthY;
  }

  const targetDepthY = getGearInteractionDepthY(getCamperGearInteractionDepthItem(camper.interactionTargetId));
  return Math.max(currentDepthY, targetDepthY === null ? currentDepthY : targetDepthY);
}

function getCamperDepthY() {
  const currentDepthY = sceneYFromPercent(camper.y);
  return getCamperSeatedDepthY(getCamperInteractionApproachDepthY(currentDepthY));
}

function updateCamperDepth() {
  setSceneElementDepth(camperElement, getCamperDepthY(), CAMPER_DEPTH_OFFSET);
}

function updateSceneOcclusion() {
  if (!camperElement) {
    return;
  }

  if (isBuildModeActive()) {
    getSceneOccluderElements().forEach(function(element) {
      element.classList.remove("camper-occluder");
    });
    return;
  }

  const camperDepthY = getCamperDepthY();
  const camperBodyRect = getCamperBodyViewportRect();

  getSceneOccluderElements().forEach(function(element) {
    const item = getOccluderItemForElement(element);
    const layoutOverride = item ? getDisplayedGearLayoutOverride(item) : null;
    const occlusionRect = item ? getSceneOcclusionRect(item, layoutOverride) : null;
    const viewportOcclusionRect = sceneRectToViewportRect(occlusionRect);
    const depthY = occlusionRect ? occlusionRect.depthY : Number(element.dataset.sceneDepthY);
    const isHidden = element.classList.contains("hidden");
    const isAlreadyFaded = element.classList.contains("camper-occluder");
    const overlapRatio = viewportOcclusionRect ? getOverlapRatioAgainstCamper(viewportOcclusionRect, camperBodyRect) : 0;
    const overlapThreshold = isAlreadyFaded ? OCCLUSION_HIDE_OVERLAP_RATIO : OCCLUSION_SHOW_OVERLAP_RATIO;
    const shouldFade = !isHidden &&
      item &&
      !shouldIgnoreOccluderItem(item) &&
      Number.isFinite(depthY) &&
      depthY > camperDepthY + OCCLUSION_DEPTH_GAP &&
      overlapRatio >= overlapThreshold;

    element.classList.toggle("camper-occluder", shouldFade);
  });
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
  const poseOffsetGroupName = offsetGroupName === "coneOffsets" ? "conePoseOffsets" : "poseOffsets";
  const poseGroup = attachment[poseOffsetGroupName] && attachment[poseOffsetGroupName][camper.pose] ?
    attachment[poseOffsetGroupName][camper.pose] :
    null;

  if (poseGroup) {
    return poseGroup[facingKey] || poseGroup.right || group[facingKey] || group.right || { x: 0, y: 0, rotate: 0 };
  }

  return group[facingKey] || group.right || { x: 0, y: 0, rotate: 0 };
}

function isCamperAttachmentHiddenForPose(attachment) {
  const hiddenPoses = attachment.hiddenPoses || [];
  return hiddenPoses.indexOf(camper.pose) !== -1 || hiddenPoses.indexOf(camper.currentAction) !== -1;
}

function applyCamperAttachmentLayout(element, item, layerName, options) {
  const layerOptions = options || {};
  const attachment = item.attachment || {};
  const facingKey = getCamperAttachmentFacingKey();
  const offset = layerOptions.offset || getCamperAttachmentOffset(attachment, "offsets", facingKey);
  const facing = normalizeFacing(camper.facing);
  const logicalSize = getSceneAssetLogicalSize(item, element, element);

  setStyleValue(element, "left", sceneXFromPercent(camper.x + offset.x) + "px");
  setStyleValue(element, "top", sceneYFromPercent(camper.y + offset.y) + "px");
  setStyleValue(element, "width", logicalSize.width + "px");
  setStyleValue(element, "height", logicalSize.height + "px");
  setStyleValue(element, "aspectRatio", logicalSize.width + " / " + logicalSize.height);
  setStyleValue(element, "zIndex", getDepthZ(getCamperDepthY(), layerOptions.depthOffset || 3));
  setStyleProperty(element, "--attachment-scale-x", layerOptions.mirrorWithFacing === false ? "1" : facing === "left" ? "-1" : "1");
  setStyleProperty(element, "--attachment-rotate", (offset.rotate || 0) + "deg");
  element.classList.toggle("camper-attachment-back-pose", facingKey === "back");
  element.classList.toggle("camper-attachment-" + item.id, true);
  element.classList.toggle("camper-attachment-layer-" + layerName, true);
  setDatasetValue(element, "sceneSizeSource", logicalSize.source);

  if (!element.naturalWidth || !element.naturalHeight) {
    const relayout = function() {
      applyCamperAttachmentLayout(element, item, layerName, options);
    };

    element.addEventListener("load", relayout, { once: true });
    element.addEventListener("error", relayout, { once: true });
  }
}

function updateCamperAttachmentElement(item) {
  if (!isCamperAttachmentItem(item)) {
    return;
  }

  const attachment = item.attachment || {};
  const layers = attachment.layers || { front: item.image };
  const facingKey = getCamperAttachmentFacingKey();
  const shouldShow = ownsGear(item.id) && isGearPlaced(item.id) && !isCamperAttachmentHiddenForPose(attachment);
  const frontElement = getOrCreateCamperAttachmentElement(item, "front");
  const backElement = getOrCreateCamperAttachmentElement(item, "back");
  const coneElement = getOrCreateCamperAttachmentElement(item, "cone");

  if (frontElement && layers.front) {
    setVersionedLayerSource(frontElement, layers.front);
    setElementClassName(frontElement, "camper-attachment camper-attachment-front camper-attachment-" + item.id + (shouldShow && facingKey !== "back" ? "" : " hidden"));
    applyCamperAttachmentLayout(frontElement, item, "front", {
      depthOffset: 3
    });
  }

  if (backElement && layers.back) {
    setVersionedLayerSource(backElement, layers.back);
    setElementClassName(backElement, "camper-attachment camper-attachment-back camper-attachment-" + item.id + (shouldShow && facingKey === "back" ? "" : " hidden"));
    applyCamperAttachmentLayout(backElement, item, "back", {
      depthOffset: 1
    });
  }

  if (coneElement && layers.cone) {
    const coneOffset = getCamperAttachmentOffset(attachment, "coneOffsets", facingKey);

    setVersionedLayerSource(coneElement, layers.cone);
    setElementClassName(coneElement, "camper-attachment camper-attachment-cone camper-attachment-" + item.id + (shouldShow ? "" : " hidden"));
    applyCamperAttachmentLayout(coneElement, item, "cone", {
      offset: coneOffset,
      depthOffset: facingKey === "back" ? 0 : 4
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
  const isInteractive = isVisible && isGearQueueInteractive(item) && !isBuildModeActive();
  const isBuildDraggable = isBuildModeActive() && isVisible && isBuildDraggableItem(item);
  const isBuildSelected = isSelectedBuildItem(item);

  if (element && item.scene.renderMode !== "campfire") {
    element.classList.toggle("hidden", !isVisible);
    element.classList.toggle("interactive-action-target", isInteractive);
    element.classList.toggle("build-draggable-target", isBuildDraggable);
    element.classList.toggle("build-selected-target", isBuildSelected && isBuildDraggable);
    element.classList.toggle("build-dragging", buildDragState && buildDragState.itemKey === getBuildSelectionKey(item));
    element.tabIndex = isInteractive || isBuildDraggable ? 0 : -1;

    if (isBuildSelected && !isBuildDraggable) {
      clearSelectedBuildTarget();
    }

    if (!isInteractive && selectedActionTargetElement === element) {
      clearSelectedActionTarget();
    }

    if (isInteractive || isBuildDraggable) {
      updateTargetOutlineForElement(element);
    }
  }

  if (frontElement) {
    frontElement.classList.toggle("hidden", !isVisible || !layers.front);
  }

  if (!isVisible && depthControlHoverTargetId === item.id) {
    depthControlHoverTargetId = "";
    syncSceneDepthControls();
  }
}

function configureCampfireActionTarget() {
  campfire.classList.add("interactive-action-target", "campfire-action-target");
  campfire.setAttribute("role", "button");
  campfire.tabIndex = 0;
  campfire.onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (isBuildModeActive()) {
      return;
    }
    clearSelectedActionTarget();
    enqueueAction("fire", "campfire");
  };
  campfire.onkeydown = function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isBuildModeActive()) {
        return;
      }
      clearSelectedActionTarget();
      enqueueAction("fire", "campfire");
    }
  };
}

function updateSceneEquipment() {
  sceneBackground.src = gameState.isNight ? assetPaths.backgrounds.campsiteNight : assetPaths.backgrounds.campsiteDay;
  treelineImage.src = gameState.isNight ? assetPaths.backgrounds.treelineNight : assetPaths.backgrounds.treelineDay;
  lakeImage.src = gameState.isNight ? assetPaths.backgrounds.lakeNight : assetPaths.backgrounds.lakeDay;
  updateWeatherLayer();

  getGearItems().forEach(function(item) {
    updateGearSceneElement(item);
    updateSceneGearVisibility(item);
  });
  updateActivityZoneElements();
  reconcileSelectedBuildTarget();
  updateCamperAttachments();

  campfire.className = "campfire asset-object level-" + gameState.campfireLevel;
  campfire.classList.toggle("lit", gameState.warmthSeconds > 0);
  configureCampfireActionTarget();
  fireGlowImage.src = assetPaths.campfire.glow;
  campfireBaseImage.src = assetPaths.campfire.base[gameState.campfireLevel];
  campfireFlameImage.src = getCurrentFlameImage();
  updateTargetOutline(campfire, campfireBaseImage);
  updateCampfireDepth();

  dayNightIcon.src = gameState.isNight ? assetPaths.ui.day : assetPaths.ui.night;
  updateActionQueueIndicators();
  updateSceneOcclusion();
  syncSceneDepthControls();
}
