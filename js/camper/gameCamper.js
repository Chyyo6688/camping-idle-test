// Wood collection, pathfinding, camper animation, movement, and autonomous actions.

function spawnWood() {
  if (woodItems.length >= maxWoodItems) {
    return;
  }

  const woodPoint = getRandomWalkablePercentPoint(
    { minX: 14, maxX: 68, minY: 67, maxY: 82 },
    { x: 42, y: 76 }
  );
  const wood = {
    id: nextWoodId,
    x: woodPoint.x,
    y: woodPoint.y,
    rotate: randomBetween(-22, 22)
  };

  nextWoodId += 1;
  woodItems.push(wood);
  renderWoodItem(wood);
}

function renderWoodItem(wood) {
  const woodElement = document.createElement("button");
  const woodImage = document.createElement("img");

  woodElement.className = "wood-item";
  woodElement.id = "wood-" + wood.id;
  woodElement.type = "button";
  woodElement.setAttribute("aria-label", "Send camper to collect fallen branches");
  woodElement.style.left = sceneXFromPercent(wood.x) + "px";
  woodElement.style.top = sceneYFromPercent(wood.y) + "px";
  woodElement.style.setProperty("--wood-rotate", wood.rotate + "deg");
  updateWoodDepth(woodElement, wood);

  woodImage.className = "wood-image";
  woodImage.src = assetPaths.resources.wood;
  woodImage.alt = "";
  woodElement.appendChild(woodImage);

  woodElement.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    collectWoodManually(wood.id);
  });
  woodElement.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      collectWoodManually(wood.id);
    }
  });
  woodLayer.appendChild(woodElement);
  updateTargetOutline(woodElement, woodImage);
}

function updateWoodDepth(woodElement, wood) {
  if (!woodElement || !wood) {
    return;
  }

  setSceneElementDepth(woodElement, sceneYFromPercent(wood.y), -1);
}

function setTargetWood(woodId) {
  camper.targetWoodId = woodId;
}

function addWarmthFromBranches(source) {
  const warmthGain = getWoodWarmthValue();

  gameState.warmthSeconds += warmthGain;

  if (source === "manual") {
    setStatus("The camper adds your chosen branches. Warmth rises.");
  } else {
    setStatus("Branches become Warmth. The fire keeps working.");
  }

  updateScreen();
  saveGame();
  return warmthGain;
}

function collectWoodManually(woodId) {
  if (isBuildModeActive()) {
    return;
  }

  const wood = woodItems.find(function(item) {
    return item.id === woodId;
  });

  if (!wood) {
    return;
  }

  clearSelectedActionTarget();
  enqueueAction("wood", wood.id);
}

function executeQueuedWoodAction(action) {
  const wood = woodItems.find(function(item) {
    return item.id === action.targetId;
  });

  if (!wood) {
    completeActiveQueuedAction();
    return;
  }

  setTargetWood(wood.id);
  camper.woodCollectionSource = activeQueuedAction ? "manual" : "auto";
  if (!startMovingTo(
    { x: wood.x, y: wood.y },
    "pickupWood",
    { labelAction: "movingToWood" }
  )) {
    setStatus("No clear path to those fallen branches.");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads over to those fallen branches.");
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

function getWoodDistanceFromCamper(wood) {
  if (!wood) {
    return Infinity;
  }

  return Math.abs(wood.x - camper.x) + Math.abs(wood.y - camper.y);
}

function getWoodItemsByDistance() {
  return woodItems.slice().filter(Boolean).sort(function(firstWood, secondWood) {
    return getWoodDistanceFromCamper(firstWood) - getWoodDistanceFromCamper(secondWood);
  });
}

function startAutoWoodCollection() {
  const candidates = getWoodItemsByDistance();

  for (let index = 0; index < candidates.length; index += 1) {
    const wood = candidates[index];

    if (!woodItems.some(function(currentWood) {
      return currentWood.id === wood.id;
    })) {
      continue;
    }

    if (startMovingTo(
      { x: wood.x, y: wood.y },
      "pickupWood",
      { labelAction: "movingToWood" }
    )) {
      setTargetWood(wood.id);
      camper.woodCollectionSource = "auto";
      setStatus("The camper spotted fallen branches.");
      return true;
    }
  }

  setTargetWood(null);
  camper.woodCollectionSource = null;
  return false;
}

function getTravelTime(targetX, targetY) {
  const distance = Math.abs(targetX - camper.x) + Math.abs(targetY - camper.y);
  return clamp(0.8 + distance / 24, 1.1, 3.4);
}

function getTravelTimeForPathLength(pathLength) {
  return clamp(pathLength / PATH_MOVE_SPEED_PX_PER_SECOND + 0.2, PATH_MIN_DURATION_MS / 1000, PATH_MAX_DURATION_MS / 1000);
}

function getScenePointDistance(firstPoint, secondPoint) {
  const dx = secondPoint.x - firstPoint.x;
  const dy = secondPoint.y - firstPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function clampScenePoint(point) {
  return {
    x: clamp(point.x, 0, BASE_SCENE_WIDTH),
    y: clamp(point.y, 0, BASE_SCENE_HEIGHT)
  };
}

function getPointSegmentDistance(point, segmentStart, segmentEnd) {
  const dx = segmentEnd.x - segmentStart.x;
  const dy = segmentEnd.y - segmentStart.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared <= 0) {
    return getScenePointDistance(point, segmentStart);
  }

  const ratio = clamp(
    ((point.x - segmentStart.x) * dx + (point.y - segmentStart.y) * dy) / lengthSquared,
    0,
    1
  );
  const closestPoint = {
    x: segmentStart.x + dx * ratio,
    y: segmentStart.y + dy * ratio
  };

  return getScenePointDistance(point, closestPoint);
}

function pointInPolygon(point, polygonPoints) {
  if (!point || !Array.isArray(polygonPoints) || polygonPoints.length < 3) {
    return false;
  }

  let inside = false;

  for (let index = 0, previousIndex = polygonPoints.length - 1; index < polygonPoints.length; previousIndex = index, index += 1) {
    const currentPoint = polygonPoints[index];
    const previousPoint = polygonPoints[previousIndex];
    const intersects = currentPoint.y > point.y !== previousPoint.y > point.y &&
      point.x < (previousPoint.x - currentPoint.x) * (point.y - currentPoint.y) / (previousPoint.y - currentPoint.y) + currentPoint.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function pointNearPolygonEdge(point, polygonPoints, padding) {
  if (!point || !Array.isArray(polygonPoints) || polygonPoints.length < 2 || padding <= 0) {
    return false;
  }

  for (let index = 0; index < polygonPoints.length; index += 1) {
    const startPoint = polygonPoints[index];
    const endPoint = polygonPoints[(index + 1) % polygonPoints.length];

    if (getPointSegmentDistance(point, startPoint, endPoint) <= padding) {
      return true;
    }
  }

  return false;
}

function isSceneNoWalkPoint(point) {
  return SCENE_NO_WALK_ZONES.some(function(zone) {
    const points = zone.points || [];
    const padding = Math.max(0, Number(zone.padding) || 0);

    return pointInPolygon(point, points) || pointNearPolygonEdge(point, points, padding);
  });
}

function isScenePercentPointWalkable(point) {
  return Boolean(point && !isSceneNoWalkPoint(percentPointToScenePoint(point)));
}

function getRandomWalkablePercentPoint(bounds, fallbackPoint) {
  const safeBounds = bounds || {};
  const fallback = fallbackPoint || {
    x: (safeBounds.minX + safeBounds.maxX) / 2,
    y: (safeBounds.minY + safeBounds.maxY) / 2
  };

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const point = {
      x: randomBetween(safeBounds.minX, safeBounds.maxX),
      y: randomBetween(safeBounds.minY, safeBounds.maxY)
    };

    if (isScenePercentPointWalkable(point)) {
      return point;
    }
  }

  return fallback;
}

function getSceneCollisionObstacles(options) {
  const pathOptions = options || {};
  const ignoreObstacleId = pathOptions.ignoreObstacleId || "";
  const startPoint = pathOptions.startPoint || null;
  const obstacles = [];

  getGearItems().forEach(function(item) {
    if (!item || !item.scene || item.id === ignoreObstacleId || !isGearVisibleInScene(item)) {
      return;
    }

    const rect = getSceneCollisionRect(item, getSceneLayoutOverride(item));

    if (!rect) {
      return;
    }

    const obstacle = inflateRect(rect, CAMPER_COLLISION_RADIUS);

    if (startPoint && pointInRect(startPoint, obstacle)) {
      return;
    }

    obstacles.push(obstacle);
  });

  return obstacles;
}

function pointToPathCell(point) {
  return {
    col: clamp(Math.floor(point.x / PATH_GRID_SIZE), 0, Math.ceil(BASE_SCENE_WIDTH / PATH_GRID_SIZE) - 1),
    row: clamp(Math.floor(point.y / PATH_GRID_SIZE), 0, Math.ceil(BASE_SCENE_HEIGHT / PATH_GRID_SIZE) - 1)
  };
}

function getPathCellKey(cell) {
  return cell.col + ":" + cell.row;
}

function pathCellToScenePoint(cell) {
  return {
    x: clamp(cell.col * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 0, BASE_SCENE_WIDTH),
    y: clamp(cell.row * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 0, BASE_SCENE_HEIGHT)
  };
}

function isScenePointBlocked(point, obstacles) {
  return isSceneNoWalkPoint(point) || obstacles.some(function(obstacle) {
    return pointInRect(point, obstacle);
  });
}

function isPathCellBlocked(cell, obstacles, startCell) {
  if (startCell && cell.col === startCell.col && cell.row === startCell.row) {
    return false;
  }

  return isScenePointBlocked(pathCellToScenePoint(cell), obstacles);
}

function createPathNode(cell, targetPoint, parent, gCost) {
  const point = pathCellToScenePoint(cell);
  const hCost = getScenePointDistance(point, targetPoint);

  return {
    cell: cell,
    key: getPathCellKey(cell),
    parent: parent || null,
    g: gCost || 0,
    h: hCost,
    f: (gCost || 0) + hCost
  };
}

function buildPathPointsFromNode(node, startPoint, targetPoint, useTargetPoint) {
  const cells = [];
  let currentNode = node;

  while (currentNode) {
    cells.push(currentNode.cell);
    currentNode = currentNode.parent;
  }

  cells.reverse();

  const points = [startPoint];

  cells.slice(1).forEach(function(cell) {
    points.push(pathCellToScenePoint(cell));
  });

  points.push(useTargetPoint ? targetPoint : pathCellToScenePoint(node.cell));

  return points.filter(function(point, index) {
    return index === 0 || getScenePointDistance(point, points[index - 1]) > 0.5;
  });
}

function getPathSegmentLengths(points) {
  const segmentLengths = [];

  for (let index = 1; index < points.length; index += 1) {
    segmentLengths.push(getScenePointDistance(points[index - 1], points[index]));
  }

  return segmentLengths;
}

function getPathLengthFromSegments(segmentLengths) {
  return segmentLengths.reduce(function(total, length) {
    return total + length;
  }, 0);
}

function findPathOnGrid(startPoint, targetPoint, obstacles) {
  const startCell = pointToPathCell(startPoint);
  const targetCell = pointToPathCell(targetPoint);
  const targetKey = getPathCellKey(targetCell);
  const targetBlocked = isScenePointBlocked(targetPoint, obstacles) || isPathCellBlocked(targetCell, obstacles, startCell);
  const openNodes = [];
  const nodesByKey = {};
  const closedKeys = {};
  const maxCol = Math.ceil(BASE_SCENE_WIDTH / PATH_GRID_SIZE) - 1;
  const maxRow = Math.ceil(BASE_SCENE_HEIGHT / PATH_GRID_SIZE) - 1;
  let bestNode = createPathNode(startCell, targetPoint, null, 0);
  let iterations = 0;

  openNodes.push(bestNode);
  nodesByKey[bestNode.key] = bestNode;

  while (openNodes.length > 0 && iterations < 6000) {
    iterations += 1;
    openNodes.sort(function(firstNode, secondNode) {
      return firstNode.f - secondNode.f;
    });

    const currentNode = openNodes.shift();

    if (closedKeys[currentNode.key]) {
      continue;
    }

    closedKeys[currentNode.key] = true;

    if (currentNode.h < bestNode.h) {
      bestNode = currentNode;
    }

    if (!targetBlocked && currentNode.key === targetKey) {
      const points = buildPathPointsFromNode(currentNode, startPoint, targetPoint, true);
      const segmentLengths = getPathSegmentLengths(points);

      return {
        points: points,
        segmentLengths: segmentLengths,
        length: getPathLengthFromSegments(segmentLengths),
        reachedTarget: true
      };
    }

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const nextCell = {
          col: currentNode.cell.col + colOffset,
          row: currentNode.cell.row + rowOffset
        };

        if (nextCell.col < 0 || nextCell.col > maxCol || nextCell.row < 0 || nextCell.row > maxRow) {
          continue;
        }

        if (closedKeys[getPathCellKey(nextCell)] || isPathCellBlocked(nextCell, obstacles, startCell)) {
          continue;
        }

        if (rowOffset !== 0 && colOffset !== 0) {
          const horizontalCell = { col: currentNode.cell.col + colOffset, row: currentNode.cell.row };
          const verticalCell = { col: currentNode.cell.col, row: currentNode.cell.row + rowOffset };

          if (isPathCellBlocked(horizontalCell, obstacles, startCell) || isPathCellBlocked(verticalCell, obstacles, startCell)) {
            continue;
          }
        }

        const nextKey = getPathCellKey(nextCell);
        const stepCost = rowOffset !== 0 && colOffset !== 0 ? Math.SQRT2 * PATH_GRID_SIZE : PATH_GRID_SIZE;
        const nextG = currentNode.g + stepCost;
        const existingNode = nodesByKey[nextKey];

        if (existingNode && existingNode.g <= nextG) {
          continue;
        }

        const nextNode = createPathNode(nextCell, targetPoint, currentNode, nextG);
        nodesByKey[nextKey] = nextNode;
        openNodes.push(nextNode);
      }
    }
  }

  if (!bestNode || bestNode.key === getPathCellKey(startCell)) {
    return null;
  }

  const points = buildPathPointsFromNode(bestNode, startPoint, targetPoint, false);
  const segmentLengths = getPathSegmentLengths(points);

  return {
    points: points,
    segmentLengths: segmentLengths,
    length: getPathLengthFromSegments(segmentLengths),
    reachedTarget: false
  };
}

function getCamperMovePath(target, options) {
  const targetPoint = clampScenePoint(percentPointToScenePoint(target));
  const startPoint = clampScenePoint(percentPointToScenePoint({ x: camper.x, y: camper.y }));
  const obstacles = getSceneCollisionObstacles({
    ignoreObstacleId: options && options.ignoreObstacleId,
    startPoint: startPoint
  });

  if (!isScenePointBlocked(targetPoint, obstacles) && getScenePointDistance(startPoint, targetPoint) <= 1) {
    return {
      points: [startPoint, targetPoint],
      segmentLengths: [0],
      length: 0,
      reachedTarget: true
    };
  }

  return findPathOnGrid(startPoint, targetPoint, obstacles);
}

const FIRE_APPROACH_SPOTS = [campSpots.fireSeat, campSpots.fireSeatRight];

function startMovingToFire(actionAfterArrival, moveOptions) {
  // Walk around the campfire to a spot beside it rather than straight through
  // the flames. Try each side approach (nearest first) with the fire treated
  // as a real obstacle; only if the fire is fully boxed in do we fall back to
  // a direct approach that ignores it.
  const orderedSpots = FIRE_APPROACH_SPOTS.slice().sort(function(firstSpot, secondSpot) {
    const firstDistance = Math.abs(firstSpot.x - camper.x) + Math.abs(firstSpot.y - camper.y);
    const secondDistance = Math.abs(secondSpot.x - camper.x) + Math.abs(secondSpot.y - camper.y);
    return firstDistance - secondDistance;
  });

  for (let index = 0; index < orderedSpots.length; index += 1) {
    const target = Object.assign({}, orderedSpots[index], { interactionTargetId: "campfire" });
    const path = getCamperMovePath(target);

    if (path && path.reachedTarget) {
      return startMovingTo(target, actionAfterArrival, moveOptions);
    }
  }

  return startMovingTo(
    Object.assign({}, campSpots.fireSeat, { interactionTargetId: "campfire", ignoreObstacleId: "campfire" }),
    actionAfterArrival,
    moveOptions
  );
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

function getSeatableLogicalSize(def) {
  return getSceneAssetLogicalSize(def, getSeatableElement(def));
}

function getSeatableGroundAnchor(def, logicalSize) {
  return getSceneGroundAnchor(def, logicalSize || getSeatableLogicalSize(def));
}

function getSeatableFacing(def) {
  const facing = normalizeFacing(def && def.scene && def.scene.facing);
  return isSeatableMirrored(def) ? getOppositeFacing(facing) : facing;
}

function isSeatableMirrored(def) {
  return Boolean(def && def.scene && def.scene.mirrored);
}

function mirrorSeatOffset(logicalSize, offset) {
  return {
    x: logicalSize.width - offset.x,
    y: offset.y
  };
}

function getSeatableSeatOffset(def, facing, logicalSize) {
  const assetLogicalSize = logicalSize || getSeatableLogicalSize(def);
  const seatable = def && def.interactions ? def.interactions.seatable : null;
  const seatOffsets = seatable && seatable.seatOffsets ? seatable.seatOffsets : {};
  const normalizedFacing = normalizeFacing(facing);
  const explicitOffset = seatOffsets[normalizedFacing];

  if (explicitOffset) {
    return getSceneAssetLogicalPoint(def, explicitOffset, assetLogicalSize);
  }

  const oppositeOffset = seatOffsets[getOppositeFacing(normalizedFacing)];

  if (oppositeOffset) {
    return mirrorSeatOffset(assetLogicalSize, getSceneAssetLogicalPoint(def, oppositeOffset, assetLogicalSize));
  }

  const defaultSeatOffset = seatOffsets.default ? getSceneAssetLogicalPoint(def, seatOffsets.default, assetLogicalSize) : getSeatableGroundAnchor(def, assetLogicalSize);
  return isSeatableMirrored(def) ? mirrorSeatOffset(assetLogicalSize, defaultSeatOffset) : defaultSeatOffset;
}

function getSceneWidthToHeightRatio() {
  return BASE_SCENE_WIDTH / BASE_SCENE_HEIGHT;
}

function getSeatableSceneTarget(id, def, facing) {
  const logicalSize = getSeatableLogicalSize(def);
  const groundAnchor = getSeatableGroundAnchor(def, logicalSize);
  const seatOffset = getSeatableSeatOffset(def, facing, logicalSize);
  const layoutOverride = getDisplayedGearLayoutOverride(def);
  const position = getScenePixelPosition(def.scene || {}, layoutOverride);
  const seatPoint = {
    x: position.x + seatOffset.x - groundAnchor.x,
    y: position.y + seatOffset.y - groundAnchor.y
  };
  const percentPoint = scenePointToPercent(seatPoint);

  return {
    x: percentPoint.x,
    y: percentPoint.y,
    seatableId: id,
    furnitureFacing: facing,
    ignoreObstacleId: id
  };
}

function getSeatableSeatTarget(id, def) {
  const facing = getSeatableFacing(def);

  return getSeatableSceneTarget(id, def, facing);
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

function executeQueuedChairAction(action) {
  const item = getGearItem(action.targetId);

  if (!item || !isGearVisibleInScene(item) || !isGearQueueInteractive(item)) {
    completeActiveQueuedAction();
    return;
  }

  if (!startMovingTo(getSeatableSeatTarget(item.id, item), "sittingOnFurniture")) {
    setStatus("No clear path to " + item.displayName + ".");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads over to " + item.displayName + ".");
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
  const activity = getActivityDefinition(action);

  if (activity) {
    if (target && target.activityFacing) {
      return normalizeFacing(target.activityFacing);
    }

    if (target && target.faceToward) {
      return getFacingTowardPoint(target.faceToward);
    }

    return action === "birdwatch" ? getRandomFacing() : "right";
  }

  if (action === "sittingOnFurniture" || action === "sittingOnChair") {
    return getCamperFacingForSeatable(target);
  }

  if (action === "sittingByFire") {
    return getFacingTowardPoint(campSpots.fire);
  }

  if (action === "observingGear") {
    return getFacingTowardPoint(target);
  }

  if (action === "lookingAtLake" || action === "resting") {
    return getRandomFacing();
  }

  return "right";
}

function getCamperAnimationFrameIndex(frameCount, frameDurationMs) {
  const animationStartedAt = camper.animationStartedAt || Date.now();
  const safeFrameCount = Math.max(1, frameCount || 1);
  const duration = frameDurationMs || camperFrameDurationMs;

  return Math.floor((Date.now() - animationStartedAt) / duration) % safeFrameCount;
}

function getCamperAnimationFrame(frames, fallbackFrame, frameDurationMs) {
  if (!Array.isArray(frames) || frames.length === 0) {
    return fallbackFrame || "";
  }

  return frames[getCamperAnimationFrameIndex(frames.length, frameDurationMs)] || fallbackFrame || frames[0];
}

function updateCamperPathMotion(now) {
  if (camper.state !== "moving" || !camper.pathPoints || camper.pathPoints.length === 0) {
    return;
  }

  const durationMs = camper.pathDurationMs || 1;
  const elapsedMs = clamp(now - camper.pathStartedAt, 0, durationMs);
  const pathLength = camper.pathLength || 0;
  let remainingDistance = pathLength * (elapsedMs / durationMs);
  let nextPoint = camper.pathPoints[camper.pathPoints.length - 1];
  let previousPoint = camper.pathPoints[0];

  for (let index = 0; index < camper.pathSegmentLengths.length; index += 1) {
    const segmentLength = camper.pathSegmentLengths[index];
    const segmentStart = camper.pathPoints[index];
    const segmentEnd = camper.pathPoints[index + 1];

    if (remainingDistance <= segmentLength || index === camper.pathSegmentLengths.length - 1) {
      const progress = segmentLength > 0 ? clamp(remainingDistance / segmentLength, 0, 1) : 1;
      nextPoint = {
        x: segmentStart.x + (segmentEnd.x - segmentStart.x) * progress,
        y: segmentStart.y + (segmentEnd.y - segmentStart.y) * progress
      };
      previousPoint = segmentStart;
      break;
    }

    remainingDistance -= segmentLength;
  }

  if (Math.abs(nextPoint.x - previousPoint.x) > 0.5) {
    camper.facing = nextPoint.x < previousPoint.x ? "left" : "right";
  }

  camper.x = sceneXToPercent(nextPoint.x);
  camper.y = sceneYToPercent(nextPoint.y);
  updateCamperView();
}

function requestCamperMotionFrame() {
  if (camperMotionFrameId !== null || typeof window === "undefined" || !window.requestAnimationFrame) {
    return;
  }

  camperMotionFrameId = window.requestAnimationFrame(function() {
    camperMotionFrameId = null;
    updateCamperPathMotion(Date.now());

    if (camper.state === "moving" && Date.now() < camper.actionTimer) {
      requestCamperMotionFrame();
    }
  });
}

function getInteractionTargetId(target) {
  return target && (target.interactionTargetId || target.ignoreObstacleId || target.seatableId) || "";
}

function startMovingTo(target, actionAfterArrival, options) {
  const moveOptions = options || {};
  const actionName = moveOptions.labelAction || actionAfterArrival;
  const now = Date.now();
  const ignoreObstacleId = moveOptions.ignoreObstacleId || target.ignoreObstacleId || target.seatableId || "";
  const interactionTargetId = moveOptions.interactionTargetId || getInteractionTargetId(target) || "";
  const movePath = getCamperMovePath(target, { ignoreObstacleId: ignoreObstacleId });

  if (!movePath || movePath.points.length < 2) {
    camper.pathPoints = [];
    camper.pathSegmentLengths = [];
    camper.pathLength = 0;
    camper.pathDurationMs = 0;
    camper.pathStartedAt = 0;
    camper.state = "idle";
    camper.pose = "idle";
    camper.currentAction = "idle";
    camper.currentActivityId = "";
    camper.actionAfterArrival = null;
    camper.target = null;
    camper.interactionTargetId = "";
    camper.actionTimer = now + 600;
    updateCamperView();
    return false;
  }

  const travelTime = getTravelTimeForPathLength(movePath.length);
  const firstMovePoint = movePath.points[1] || movePath.points[0];

  camper.target = target;
  camper.actionAfterArrival = actionAfterArrival;
  camper.currentAction = actionName;
  camper.currentActivityId = "";
  camper.interactionTargetId = interactionTargetId;
  camper.state = "moving";
  camper.pose = moveOptions.carryingWood ? "carryingWood" : "walking";
  camper.facing = getMovementFacing(sceneXToPercent(movePath.points[0].x), sceneXToPercent(firstMovePoint.x));
  camper.animationStartedAt = now;
  camper.pathPoints = movePath.points;
  camper.pathSegmentLengths = movePath.segmentLengths;
  camper.pathLength = movePath.length;
  camper.pathDurationMs = travelTime * 1000;
  camper.pathStartedAt = now;
  camper.actionTimer = now + camper.pathDurationMs;

  updateCamperPathMotion(now);
  updateCamperView();
  requestCamperMotionFrame();
  return true;
}

function startActing(action, durationSeconds, options) {
  const now = Date.now();
  const actionTarget = camper.target;
  const actingOptions = options || {};
  const activityId = actingOptions.activityId || (isActivityId(action) ? action : "");

  handleActivitySoundStart(action, activityId);

  camper.state = "acting";
  camper.currentAction = action;
  camper.currentActivityId = activityId;
  camper.actionAfterArrival = null;
  camper.target = null;
  camper.interactionTargetId = getInteractionTargetId(actionTarget);
  camper.pose = activityId ? getActivityDefinition(activityId).pose : getPoseForAction(action);
  camper.facing = getFacingForAction(action, actionTarget);
  camper.animationStartedAt = now;
  camper.actionTimer = now + durationSeconds * 1000;
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathLength = 0;
  camper.pathDurationMs = 0;
  camper.pathStartedAt = 0;

  updateCamperView();
}

function getPoseForAction(action) {
  const activity = getActivityDefinition(action);

  if (activity) {
    return activity.pose;
  }

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

function isActivityDebugEnabled() {
  return typeof window !== "undefined" && window.location && window.location.search.indexOf("activityDebug=1") !== -1;
}

function getCamperStateLabel() {
  const action = camper.currentActivityId || camper.currentAction;
  const activity = getActivityDefinition(action);
  const baseLabel = activity ? activity.actionLabel : camperActionLabels[camper.currentAction] || camperActionLabels.idle;

  if (!activity || !isActivityDebugEnabled()) {
    return baseLabel;
  }

  return baseLabel + " [" + activity.id + ": " + getActivityCompletionCount(activity.id) + "]";
}

function updateCamperView() {
  setStyleValue(camperElement, "left", sceneXFromPercent(camper.x) + "px");
  setStyleValue(camperElement, "top", sceneYFromPercent(camper.y) + "px");
  updateCamperDepth();
  updateCamperSprite();
  updateCamperAttachments();
  updateCamperThought();
  camperStateText.textContent = getCamperStateLabel();

  document.body.classList.toggle("camper-in-tent", camper.pose === "tentRest" && hasNightUnlock());
  updateSceneOcclusion();
}

function getRandomCamperThought(action) {
  const personality = getActiveCamperPersonality();
  const genericThoughts = camperThoughtLines[action] || [];
  const personalityThoughts = personality && personality.bubbles ? personality.bubbles[action] || [] : [];
  const divinationThoughts = getCurrentDivinationThoughtLines();

  if (Array.isArray(divinationThoughts) && divinationThoughts.length > 0 && Math.random() < 0.28) {
    return divinationThoughts[Math.floor(Math.random() * divinationThoughts.length)];
  }

  const shouldUsePersonalityThought = personalityThoughts.length > 0 && Math.random() < 0.65;
  const thoughts = shouldUsePersonalityThought ? personalityThoughts : genericThoughts;

  if (!Array.isArray(thoughts) || thoughts.length === 0) {
    return "";
  }

  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

function getCamperThoughtText(action) {
  if (camperThoughtAction !== action) {
    camperThoughtAction = action;
    camperThoughtText = getRandomCamperThought(action);
  }

  return camperThoughtText;
}

function updateCamperThoughtPosition() {
  if (!sceneContent || !camperThoughtBubble) {
    return;
  }

  const contentRect = sceneContent.getBoundingClientRect();
  const camperRect = camperElement.getBoundingClientRect();
  const scaleX = contentRect.width / BASE_SCENE_WIDTH;
  const scaleY = contentRect.height / BASE_SCENE_HEIGHT;
  const thoughtAnchor = CAMPER_THOUGHT_RECTS[camper.pose] || CAMPER_THOUGHT_RECTS.default;

  if (scaleX <= 0 || scaleY <= 0 || camperRect.width <= 0 || camperRect.height <= 0) {
    camperThoughtBubble.style.left = sceneXFromPercent(camper.x) + "px";
    camperThoughtBubble.style.top = sceneYFromPercent(Math.max(8, camper.y - 8)) + "px";
    return;
  }

  const bubbleGapPx = 14;
  const anchorClientX = camperRect.left + camperRect.width * thoughtAnchor.ratioX;
  const anchorClientY = camperRect.top + camperRect.height * thoughtAnchor.ratioY - bubbleGapPx;
  const sceneX = clamp((anchorClientX - contentRect.left) / scaleX, 24, BASE_SCENE_WIDTH - 24);
  const sceneY = clamp((anchorClientY - contentRect.top) / scaleY, 24, BASE_SCENE_HEIGHT - 24);

  camperThoughtBubble.style.left = sceneX + "px";
  camperThoughtBubble.style.top = sceneY + "px";
}

function showCamperThought(message, durationMs) {
  if (!message) {
    return;
  }

  forcedCamperThoughtText = message;
  forcedCamperThoughtUntil = Date.now() + (Number(durationMs) || 2800);
  updateCamperThought();
}

function updateCamperThought() {
  const now = Date.now();
  const hasForcedThought = forcedCamperThoughtText && forcedCamperThoughtUntil > now;
  const thought = hasForcedThought ? forcedCamperThoughtText : getCamperThoughtText(camper.currentAction);
  const shouldShowThought = !isBuildModeActive() && (hasForcedThought || !gameState.gatherWoodMode) && thought;

  if (forcedCamperThoughtText && forcedCamperThoughtUntil <= now) {
    forcedCamperThoughtText = "";
    forcedCamperThoughtUntil = 0;
  }

  camperThoughtBubble.textContent = shouldShowThought ? thought : "";
  updateCamperThoughtPosition();
  camperThoughtBubble.classList.toggle("show", Boolean(shouldShowThought));
}

function updateCamperSprite() {
  const frameName = getCamperFrameNameForPose();
  const appearance = camperProfileActive && camperProfileDraftAppearance ? camperProfileDraftAppearance : getActiveCamperAppearance();
  const className = "camper asset-object " + camper.state + " " + camper.pose;
  setStyleProperty(camperElement, "--object-scale-x", normalizeFacing(camper.facing) === "left" ? "-1" : "1");

  renderCamperLayerStack(camperElement, appearance, frameName);

  setElementClassName(camperElement, className);
}

function chooseNextCamperAction() {
  if (isBuildModeActive() || camperProfileActive || !hasCamperProfile(gameState)) {
    return;
  }

  if (beginNextQueuedAction()) {
    return;
  }

  if (gameState.gatherWoodMode && woodItems.length > 0) {
    if (startAutoWoodCollection()) {
      return;
    }
  }

  if (gameState.gatherWoodMode) {
    const wanderPoint = getRandomWanderPoint();
    startMovingTo(wanderPoint, "wandering", { labelAction: "wandering" });
    setStatus(woodItems.length > 0 ? "The camper is looking for a clear path to branches." : "The camper is searching for fallen branches.");
    return;
  }

  chooseRelaxingAction();
}

function chooseWeightedAction(actionEntries) {
  const totalWeight = actionEntries.reduce(function(total, entry) {
    return total + Math.max(0, Number(entry.weight) || 0);
  }, 0);
  let roll = Math.random() * Math.max(totalWeight, 1);

  for (let index = 0; index < actionEntries.length; index += 1) {
    roll -= Math.max(0, Number(actionEntries[index].weight) || 0);

    if (roll <= 0) {
      return actionEntries[index].id;
    }
  }

  return actionEntries.length > 0 ? actionEntries[actionEntries.length - 1].id : "wandering";
}

function getRandomObservableGearTarget() {
  const candidates = getGearItems().map(function(item) {
    if (item &&
      item.scene &&
      item.id !== "campfire" &&
      isGearVisibleInScene(item) &&
      (isGearPlaced(item.id) || isEquippableGear(item) && getEquippedGearId(item.category) === item.id)) {
      const position = getDisplayedGearScenePosition(item);

      if (!position) {
        return null;
      }

      return {
        item: item,
        target: {
          x: clamp(sceneXToPercent(position.x) + randomBetween(-4, 4), 16, 76),
          y: clamp(sceneYToPercent(position.y) + 2, 62, 86),
          interactionTargetId: item.id,
          ignoreObstacleId: item.id
        }
      };
    }

    return null;
  }).filter(function(entry) {
    return entry && isScenePercentPointWalkable(entry.target);
  });

  if (candidates.length === 0) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)].target;
}

function getRelaxingActionEntries() {
  const personality = getActiveCamperPersonality();
  const bonuses = personality && personality.idleWeights ? personality.idleWeights : {};
  const nightBonuses = gameState.isNight && personality && personality.nightWeights ? personality.nightWeights : {};
  const weatherBonuses = getCurrentWeatherActivityWeights();
  const timeBonuses = getCurrentTimeActivityWeights();
  const divinationBonuses = getCurrentDivinationActivityWeights();
  const entries = [
    { id: "wandering", weight: 4 },
    { id: "lookingAtLake", weight: 4 },
    { id: "sittingByFire", weight: 4 },
    { id: "resting", weight: 3 },
    { id: "tentRest", weight: 3 }
  ];

  if (getAvailableSeatableFurnitureEntries().length > 0) {
    entries.push({ id: "sittingOnFurniture", weight: 4 });
  }

  if (getRandomObservableGearTarget()) {
    entries.push({ id: "observingGear", weight: 2 });
  }

  getActivityIds().forEach(function(activityId) {
    const activity = getActivityDefinition(activityId);

    if (activityId === "cook" && !canAutonomouslyCook()) {
      return;
    }

    if (activityId === "fish" && isFishInventoryFull()) {
      return;
    }

    if (activity && isActivityAvailable(activityId)) {
      entries.push({ id: activityId, weight: activity.weight });
    }
  });

  return entries.map(function(entry) {
    return {
      id: entry.id,
      weight: entry.weight +
        (Number(bonuses[entry.id]) || 0) +
        (Number(nightBonuses[entry.id]) || 0) +
        (Number(weatherBonuses[entry.id]) || 0) +
        (Number(timeBonuses[entry.id]) || 0) +
        (Number(divinationBonuses[entry.id]) || 0)
    };
  });
}

function chooseRelaxingAction() {
  const action = chooseWeightedAction(getRelaxingActionEntries());
  const activity = getActivityDefinition(action);

  if (activity) {
    const cookingPlan = action === "cook" ? chooseAutonomousCookingPlan() : null;
    if (action === "cook" && !cookingPlan) {
      startMovingTo(getRandomWanderPoint(), "wandering", { labelAction: "wandering" });
    } else if (!startActivity(action)) {
      if (action === "cook") cancelAutonomousCooking();
      startMovingTo(getRandomWanderPoint(), "wandering", { labelAction: "wandering" });
    } else if (cookingPlan) {
      beginAutonomousCooking(cookingPlan);
    }
  } else if (action === "lookingAtLake") {
    startMovingTo(campSpots.lake, "lookingAtLake");
  } else if (action === "sittingByFire") {
    startMovingToFire("sittingByFire");
  } else if (action === "sittingOnFurniture") {
    const seatTarget = getRandomSeatableSeatTarget();

    if (seatTarget) {
      startMovingTo(seatTarget, "sittingOnFurniture");
    } else {
      startMovingTo(getRandomWanderPoint(), "wandering", { labelAction: "wandering" });
    }
  } else if (action === "observingGear") {
    const gearTarget = getRandomObservableGearTarget();

    if (gearTarget) {
      startMovingTo(gearTarget, "observingGear");
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

function startActivity(activityId, preferredTargetId) {
  const activity = getActivityDefinition(activityId);
  const target = resolveActivityTarget(activityId, preferredTargetId);

  if (!activity || !target) {
    return false;
  }

  return startMovingTo(target, activity.id);
}

function getRandomWanderPoint() {
  return getRandomWalkablePercentPoint(
    { minX: 18, maxX: 64, minY: 68, maxY: 80 },
    { x: 43, y: 75 }
  );
}

function withIgnoredObstacle(point, item) {
  if (!point || !item) {
    return point;
  }

  return Object.assign({}, point, {
    ignoreObstacleId: item.id
  });
}

function getTentRestSpotForItem(tentItem) {
  const tentRest = tentItem && tentItem.interactions ? tentItem.interactions.tentRest : null;
  const layout = getDisplayedGearLayoutOverride(tentItem);

  if (tentItem && tentRest && tentRest.point) {
    return withIgnoredObstacle(scenePointToPercent(getScenePointFromAssetPoint(tentItem, tentRest.point, layout)), tentItem);
  }

  const displayedPosition = getDisplayedGearScenePosition(tentItem);

  if (displayedPosition) {
    return withIgnoredObstacle(scenePointToPercent(displayedPosition), tentItem);
  }

  if (tentRest && tentRest.position) {
    return withIgnoredObstacle(tentRest.position, tentItem);
  }

  if (tentItem && tentItem.scene) {
    return withIgnoredObstacle(getScenePercentPosition(tentItem.scene, layout), tentItem);
  }

  return campSpots.tent;
}

function getTentRestSpot() {
  return getTentRestSpotForItem(getEquippedGearItem("tent"));
}

function executeQueuedTentAction(action) {
  const item = getGearItem(action.targetId);

  if (!item || !isGearVisibleInScene(item) || !isGearQueueInteractive(item)) {
    completeActiveQueuedAction();
    return;
  }

  if (!startMovingTo(getTentRestSpotForItem(item), "tentRest")) {
    setStatus("No clear path to " + item.displayName + ".");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads into " + item.displayName + ".");
}

function executeQueuedFireAction() {
  if (!startMovingToFire("sittingByFire")) {
    setStatus("No clear path to the campfire.");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads closer to the campfire.");
}

function executeQueuedActivityAction(action) {
  const activityId = action && action.activityId || "";
  const activity = getActivityDefinition(activityId);

  if (!activity || !isActivityAvailable(activityId)) {
    setStatus(activityId === "cook" ? "需要炉具或 camp kitchen 才能做饭。" : "That activity is not available yet.");
    completeActiveQueuedAction();
    return;
  }

  if (activityId === "cook" && !hasCookableFish()) {
    setStatus(getNoFoodCookingMessage());
    showCamperThought("没有可用食材。");
    completeActiveQueuedAction();
    return;
  }

  if (activityId === "fish" && isFishInventoryFull()) {
    setStatus(getCoolerFullMessage());
    showCamperThought("冷藏箱已经满了。");
    completeActiveQueuedAction();
    return;
  }

  if (!startActivity(activityId, action.targetId)) {
    setStatus("No clear path to " + activity.targetLabel + ".");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads over to " + activity.targetLabel + ".");
}

function updateCamperAI() {
  if (camperProfileActive || !hasCamperProfile(gameState)) {
    setImageSourceIfChanged(campfireFlameImage, getCurrentFlameImage());
    return;
  }

  if (isBuildModeActive()) {
    setImageSourceIfChanged(campfireFlameImage, getCurrentFlameImage());
    return;
  }

  updateCamperPathMotion(Date.now());
  updateCamperSprite();
  setImageSourceIfChanged(campfireFlameImage, getCurrentFlameImage());

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

  if (beginNextQueuedAction()) {
    return;
  }

  chooseNextCamperAction();
}

function arriveAtTarget() {
  const action = camper.actionAfterArrival;
  const activity = getActivityDefinition(action);

  hideActiveQueuedActionIndicator();

  if (activity) {
    startActing(activity.id, activity.durationSeconds, { activityId: activity.id });
    return;
  }

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

  if (action === "observingGear") {
    startActing("observingGear", 3.4);
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
    if (!startMovingToFire(
      "addingWoodToFire",
      { carryingWood: true, labelAction: "carryingWoodToFire" }
    )) {
      camper.carryingWood = false;
      camper.woodCollectionSource = null;
      setStatus("No clear path to the campfire.");

      if (activeQueuedAction) {
        completeActiveQueuedAction();
      } else {
        chooseNextCamperAction();
      }
    }

    return;
  }

  if (camper.currentAction === "addingWoodToFire") {
    const source = camper.woodCollectionSource === "manual" ? "manual" : "auto";

    camper.carryingWood = false;
    camper.woodCollectionSource = null;
    addWarmthFromBranches(source);
    if (source === "manual") {
      recordCamperHabitCompletion("campfireCare");
    }

    if (activeQueuedAction) {
      completeActiveQueuedAction();
    } else {
      chooseNextCamperAction();
    }

    return;
  }

  if (camper.currentActivityId) {
    const completedActivityId = camper.currentActivityId;
    const completedByQueuedAction = Boolean(activeQueuedAction);
    stopActivityAmbience();
    recordActivityCompletion(completedActivityId);
    handleActivityCompletionResult(completedActivityId, {
      source: completedByQueuedAction ? "queued" : "auto"
    });
    if (completedByQueuedAction) {
      recordCamperActivityHabitCompletion(completedActivityId);
    }
    camper.currentActivityId = "";

    if (activeQueuedAction) {
      completeActiveQueuedAction();
    } else {
      chooseNextCamperAction();
    }

    return;
  }

  if (activeQueuedAction) {
    recordCamperActionHabitCompletion(camper.currentAction);
  }

  if (activeQueuedAction) {
    completeActiveQueuedAction();
    return;
  }

  chooseNextCamperAction();
}

function pickupTargetWood() {
  const wood = woodItems.find(function(item) {
    return item.id === camper.targetWoodId;
  });

  if (!wood) {
    if (activeQueuedAction) {
      completeActiveQueuedAction();
    } else {
      chooseNextCamperAction();
    }
    return;
  }

  removeWoodItem(wood.id);
  setTargetWood(null);
  camper.carryingWood = true;
  startActing("pickupWood", 0.55);
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
