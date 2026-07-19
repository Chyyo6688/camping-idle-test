const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const activities = read("js/systems/gameActivities.js");
const game = read("js/core/game.js");
const camper = read("js/camper/gameCamper.js");
const scene = read("js/systems/gameScene.js");
const shopCss = read("css/camper-shop.css");
const sceneCss = read("css/scene-hud.css");
const sceneConfig = read("js/config/sceneConfig.js");

assert.match(activities, /actionHint\.textContent = "点击操作"/);
assert.match(activities, /menuPrompt\.textContent = "点击选择操作"/);
assert.match(activities, /createFishActionMenuButton\("放生", "放回湖里"/);
assert.match(activities, /createFishActionMenuButton\("烹饪", "选择菜谱"/);
assert.match(activities, /createFishActionMenuButton\("交易", "换取补给"/);
assert.match(activities, /row\.dataset\.fishId = item\.id/);
assert.match(activities, /function syncOpenFishActionMenuAnchor\(\)/);
assert.match(activities, /syncOpenFishActionMenuAnchor\(\);\s*\n}/);
assert.match(game, /inventorySections\.addEventListener\("scroll", syncOpenFishActionMenuAnchor/);
assert.match(shopCss, /\.inventory-item-action-hint\s*{/);
assert.match(shopCss, /\.inventory-fish-menu::before\s*{/);

assert.match(camper, /moveOptions\.requireReachedTarget && !movePath\.reachedTarget/);
assert.match(camper, /requireReachedTarget: activityId === "fish"/);
assert.match(camper, /showCamperThought\("去湖边的路被挡住了。", 3600\)/);

assert.match(sceneCss, /\.campfire:not\(\.lit\) \.fire-glow-img,\s*\n\.campfire:not\(\.lit\) \.campfire-flame-img\s*{[^}]*opacity:\s*0;[^}]*visibility:\s*hidden;/s);

assert.match(scene, /function getGearInteractionDepthY\(item\)[\s\S]*?getSceneDisplayDepthY\(item, getDisplayedGearLayoutOverride\(item\)\)/);
assert.match(scene, /setSceneElementDepth\(camperElement, getCamperDepthY\(\), CAMPER_DEPTH_OFFSET\)/);

function pointSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (!lengthSquared) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return Math.hypot(point.x - (start.x + ratio * dx), point.y - (start.y + ratio * dy));
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const currentPoint = polygon[index];
    const previousPoint = polygon[previous];
    const crosses = (currentPoint.y > point.y) !== (previousPoint.y > point.y) &&
      point.x < (previousPoint.x - currentPoint.x) * (point.y - currentPoint.y) /
        (previousPoint.y - currentPoint.y) + currentPoint.x;

    if (crosses) {
      inside = !inside;
    }
  }

  return inside;
}

function hasGridPath(zones, obstacles, startPoint, targetPoint) {
  const gridSize = 24;
  const columns = Math.ceil(900 / gridSize);
  const rows = Math.ceil(1600 / gridSize);
  const start = { col: Math.floor(startPoint.x / gridSize), row: Math.floor(startPoint.y / gridSize) };
  const target = { col: Math.floor(targetPoint.x / gridSize), row: Math.floor(targetPoint.y / gridSize) };
  const queue = [start];
  const visited = new Set([start.col + ":" + start.row]);

  function isBlocked(col, row) {
    const point = { x: col * gridSize + gridSize / 2, y: row * gridSize + gridSize / 2 };
    const zoneBlocked = zones.some(function(zone) {
      return pointInPolygon(point, zone.points) || zone.points.some(function(edgeStart, index) {
        return pointSegmentDistance(point, edgeStart, zone.points[(index + 1) % zone.points.length]) <= zone.padding;
      });
    });

    return zoneBlocked || obstacles.some(function(rect) {
      return point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height;
    });
  }

  while (queue.length) {
    const current = queue.shift();

    if (current.col === target.col && current.row === target.row) {
      return true;
    }

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (!rowOffset && !colOffset) continue;

        const col = current.col + colOffset;
        const row = current.row + rowOffset;
        const key = col + ":" + row;

        if (col < 0 || col >= columns || row < 0 || row >= rows || visited.has(key) || isBlocked(col, row)) {
          continue;
        }

        if (colOffset && rowOffset && (isBlocked(current.col + colOffset, current.row) || isBlocked(current.col, current.row + rowOffset))) {
          continue;
        }

        visited.add(key);
        queue.push({ col: col, row: row });
      }
    }
  }

  return false;
}

const sceneConfigContext = {};
vm.runInNewContext(
  sceneConfig + ";globalThis.testNoWalkZones=SCENE_NO_WALK_ZONES;globalThis.testFishingTarget=activityZones.lakeFishing.target;",
  sceneConfigContext
);

const fishingTarget = {
  x: sceneConfigContext.testFishingTarget.x / 100 * 900,
  y: sceneConfigContext.testFishingTarget.y / 100 * 1600
};
// Use a conservative large-tent footprint plus an item that seals the normal left passage.
const routeObstacles = [
  { x: 376, y: 1028, width: 220, height: 108 },
  { x: 280, y: 990, width: 125, height: 165 }
];

assert.equal(
  hasGridPath(sceneConfigContext.testNoWalkZones, routeObstacles, { x: 450, y: 1200 }, fishingTarget),
  true,
  "Fishing should remain reachable from the right when an item blocks the tent's left route."
);

console.log("Camp interaction acceptance checks passed.");
