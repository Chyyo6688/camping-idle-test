const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const configSources = [
  "js/config/adventure/adventureItems.js",
  "js/config/adventure/maps/deepMountain.js",
  "js/config/adventure/maps/fogRainforest.js",
  "js/config/adventure/adventureMaps.js"
].map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8")).join("\n");
const partySource = fs.readFileSync(path.join(root, "js/systems/adventure/adventureParty.js"), "utf8");
const systemSource = fs.readFileSync(path.join(root, "js/systems/gameAdventurePrototype.js"), "utf8");
const checks = [];
function check(name, passed, detail) { checks.push({ name, passed: Boolean(passed), detail: detail || "" }); }

const sandbox = {
  console: { log() {}, info() {}, warn() {}, error() {}, groupCollapsed() {}, groupEnd() {}, table() {} },
  document: { getElementById() { return null; }, addEventListener() {}, createElement() { return null; }, body: { classList: { add() {}, remove() {} } } },
  CAMPER_IDLE_FRAME_NAME: "idle.png",
  CAMPER_TRAIT_KEYS: ["courage", "curiosity", "sociability", "preparedness", "observation", "rationality", "responsibility", "comfortSeeking"],
  fishCatalog: { fish: { displayName: "鱼", rarityLabel: "普通", image: "fish.png" } },
  mealCatalog: { meal: { displayName: "料理", detail: "热食", image: "meal.png" } },
  gameState: { inventory: { fish: {}, meals: {} }, adventure: null, dailyAdventureModifiers: {}, camperProfile: null },
  saveGame() {}, Date, Math, JSON, Object, Array, Number, String, Boolean, Infinity
};
sandbox.window = sandbox;
sandbox.window.setTimeout = function() { return 0; };
sandbox.window.clearTimeout = function() {};
sandbox.window.setInterval = function() { return 0; };
sandbox.window.clearInterval = function() {};
sandbox.window.requestAnimationFrame = function() {};
sandbox.window.addEventListener = function() {};

vm.runInNewContext(configSources + "\n" + partySource + "\n" + systemSource + `
globalThis.__finalRuntime = {
  version: ADVENTURE_SAVE_VERSION,
  regenMs: ADVENTURE_STAMINA_REGEN_MS_PER_POINT,
  maps: ADVENTURE_MAPS,
  createDefaultAdventureProgress,
  sanitizeAdventureProgress,
  sanitizeAdventureLog,
  ensureAdventureProgress,
  refreshAdventureMapUnlocks,
  isAdventureMapUnlocked,
  isAdventureRouteUnlocked,
  createAdventureHookSnapshot,
  collectAdventureHookClues,
  grantAdventureKeyClue,
  getAdventureStoryState,
  getAdventureStoryDefinition,
  archiveAdventureStory,
  routeMapStoryId: ADVENTURE_ROUTE_MAP_STORY_ID,
  buildRecommendedAdventureBackpack,
  recoverInterruptedAdventureBackpack,
  deepHooks: DEEP_MOUNTAIN_ADVENTURE_HOOKS,
  setProgress(progress) { gameState.adventure = progress; },
  setTrip(trip) { adventurePrototypeState.trip = trip; },
  getProgress() { return gameState.adventure; }
};`, sandbox);

const runtime = sandbox.__finalRuntime;
const now = Date.now();
const fresh = runtime.createDefaultAdventureProgress(now);
check("新档具备 v10、满体力、故事与日记容器及两张独立地图状态", fresh.version === 10 && fresh.stamina.value === 100 && fresh.storage.ropeKit === 1 && fresh.storage.fieldLantern === 1 && fresh.unlockedMaps.join("|") === "deepMountain" && Array.isArray(fresh.keyClues) && fresh.hookClues && fresh.storyStates && Array.isArray(fresh.journeyLogs) && Array.isArray(fresh.revealedKeyItems) && fresh.mapStates.deepMountain !== fresh.mapStates.fogRainforest, JSON.stringify({ version: fresh.version, stamina: fresh.stamina, storage: fresh.storage, unlockedMaps: fresh.unlockedMaps, keyClues: fresh.keyClues }));

const legacy = runtime.sanitizeAdventureProgress({
  version: 2,
  selectedGoal: "investigateWhiteShadow",
  storage: { fieldLantern: 1, oldKey: 2 },
  stamina: { value: 61, updatedAt: now - 1000 },
  unlockedLocations: ["deepMountain", "ridgeTrail"],
  mapStates: { deepMountain: { bridgeRepaired: true, cabinSearched: true } },
  pendingBackpack: {}, pendingLoot: {}, recentAdventureHistory: []
});
check("旧档迁移保留库存、体力、路线和深山状态", legacy.version === 10 && legacy.storage.fieldLantern === 1 && legacy.storage.oldKey === 2 && legacy.stamina.value === 61 && legacy.unlockedRoutes.includes("ridgeTrail") && legacy.mapStates.deepMountain.bridgeRepaired && legacy.mapStates.deepMountain.cabinSearched === 1 && !("selectedGoal" in legacy), JSON.stringify({ version: legacy.version, storage: legacy.storage, stamina: legacy.stamina, routes: legacy.unlockedRoutes, state: legacy.mapStates.deepMountain }));

const emptyStorage = runtime.sanitizeAdventureProgress(Object.assign({}, fresh, { storage: {}, adventureStarterKitMigrationVersion: 1 }));
check("已完成迁移的空 Adventure Storage 异常档不会重复补发", Object.keys(emptyStorage.storage).length === 0 && emptyStorage.adventureStarterKitMigrationVersion === 1, JSON.stringify(emptyStorage.storage));

const malformed = runtime.sanitizeAdventureProgress(Object.assign({}, fresh, {
  storage: { ropeKit: -4, firstAidPouch: 2.8, fakeItem: 99, fieldLantern: 20 },
  pendingBackpack: { "item:ropeKit": -1, "item:fake": 4, "fish:fish": 1 },
  pendingLoot: { "meal:meal": 2, "item:luminousSpore": 1 }
}));
check("异常数量与未知物品安全清洗", malformed.storage.firstAidPouch === 2 && malformed.storage.fieldLantern === 1 && !("ropeKit" in malformed.storage) && !("fakeItem" in malformed.storage) && malformed.pendingBackpack["fish:fish"] === 1 && malformed.pendingLoot["meal:meal"] === 2 && malformed.pendingLoot["item:luminousSpore"] === 1, JSON.stringify({ storage: malformed.storage, backpack: malformed.pendingBackpack, loot: malformed.pendingLoot }));

const offlineState = { adventure: runtime.createDefaultAdventureProgress(now) };
offlineState.adventure.stamina.value = 20;
offlineState.adventure.stamina.updatedAt = now - runtime.regenMs * 10 - Math.floor(runtime.regenMs / 2);
runtime.ensureAdventureProgress(offlineState, now);
check("离线体力按 14.4 分钟一点恢复并保留余量", offlineState.adventure.stamina.value === 30 && offlineState.adventure.stamina.updatedAt === now - Math.floor(runtime.regenMs / 2), JSON.stringify(offlineState.adventure.stamina));
const futureState = { adventure: runtime.createDefaultAdventureProgress(now) };
futureState.adventure.stamina.value = 40;
futureState.adventure.stamina.updatedAt = now + runtime.regenMs;
runtime.ensureAdventureProgress(futureState, now);
check("未来时间戳不会反向或额外恢复体力", futureState.adventure.stamina.value === 40 && futureState.adventure.stamina.updatedAt === now + runtime.regenMs, JSON.stringify(futureState.adventure.stamina));
const cappedState = { adventure: runtime.createDefaultAdventureProgress(now) };
cappedState.adventure.stamina.value = 98;
cappedState.adventure.stamina.updatedAt = now - runtime.regenMs * 20;
runtime.ensureAdventureProgress(cappedState, now);
check("离线恢复不会超过体力上限", cappedState.adventure.stamina.value === 100 && cappedState.adventure.stamina.updatedAt === now, JSON.stringify(cappedState.adventure.stamina));

const oldLog = runtime.sanitizeAdventureLog({
  id: "legacy-log", locationId: "deepMountain", routeId: "creekValley", goalId: "investigateWildlife", goalResult: "partial", goalScore: 2,
  events: [{ eventId: "animalTracks", title: "脚印", reactionType: "观察", result: "留下记录。" }],
  gained: {}, departedWith: {}, lost: {}, consumed: {}, unlocked: [], staminaStart: 100, staminaEnd: 75
});
check("日志页刷新可读取旧 goal 日志并迁移为 hook 语气", oldLog.adventureHook.id === "investigateWildlife" && oldLog.hookResult === "continuing" && oldLog.events[0].actorCamperId === "localCamper" && oldLog.participants.length === 0, JSON.stringify(oldLog));

const clueProgress = runtime.createDefaultAdventureProgress(now);
const clueTrip = {
  mapId: "deepMountain",
  routeId: "denseForest",
  adventureHook: runtime.createAdventureHookSnapshot(runtime.deepHooks.investigateWhiteShadow, "routeRumor"),
  eventFlags: { sawWhiteShadow: true },
  events: [{ eventId: "whiteShadow", outcomeTier: "good" }],
  keyCluesFound: [],
  importantDiscoveries: [],
  newHookClues: []
};
runtime.collectAdventureHookClues(clueTrip, clueProgress);
runtime.collectAdventureHookClues(clueTrip, clueProgress);
check("Hook 线索唯一计数且不会重复累计", clueTrip.newHookClues.length === 0 && clueProgress.hookClues.deepMountain.investigateWhiteShadow.length === 1, JSON.stringify({ hookClues: clueProgress.hookClues.deepMountain.investigateWhiteShadow, tripNew: clueTrip.newHookClues }));

const routeMapClueProgress = runtime.createDefaultAdventureProgress(now);
const routeMapTrip = { unlockedMaps: [], unlocked: [], keyCluesFound: [], importantDiscoveries: [] };
runtime.setProgress(routeMapClueProgress);
runtime.grantAdventureKeyClue(routeMapTrip, "rangerLeafRouteMark", [], []);
runtime.grantAdventureKeyClue(routeMapTrip, "southSupplyCode", [], []);
runtime.grantAdventureKeyClue(routeMapTrip, "oldForestryCoordinate", [], []);
const routeMapStory = runtime.getAdventureStoryDefinition(runtime.routeMapStoryId);
const routeMapReady = runtime.getAdventureStoryState(routeMapClueProgress, runtime.routeMapStoryId);
const wrongRouteMapOrder = routeMapStory.clues.map((clue) => clue.id).reverse();
const correctRouteMapOrder = routeMapStory.clues.map((clue) => clue.id);
const wrongArchive = runtime.archiveAdventureStory(runtime.routeMapStoryId, wrongRouteMapOrder);
check("三条关键线索收齐后等待玩家整理，不会自动解锁雨林", routeMapReady.status === "ready" && !wrongArchive && !routeMapClueProgress.keyClues.includes("dampSurveyRouteMap") && !runtime.isAdventureMapUnlocked("fogRainforest", routeMapClueProgress), JSON.stringify({ state: routeMapReady, keyClues: routeMapClueProgress.keyClues, unlockedMaps: routeMapClueProgress.unlockedMaps }));
const archivedRouteMap = runtime.archiveAdventureStory(runtime.routeMapStoryId, correctRouteMapOrder);
check("路线图排序正确后生成关键物品、记录 pending reveal 并解锁雨林", archivedRouteMap && routeMapClueProgress.keyClues.includes("dampSurveyRouteMap") && routeMapClueProgress.pendingKeyItemReveal === "dampRouteMap" && runtime.isAdventureMapUnlocked("fogRainforest", routeMapClueProgress), JSON.stringify({ state: routeMapClueProgress.storyStates[runtime.routeMapStoryId], keyClues: routeMapClueProgress.keyClues, pending: routeMapClueProgress.pendingKeyItemReveal, unlockedMaps: routeMapClueProgress.unlockedMaps }));
check("已归档故事重复提交不会重复发放", !runtime.archiveAdventureStory(runtime.routeMapStoryId, correctRouteMapOrder) && routeMapClueProgress.unlockedMaps.filter((id) => id === "fogRainforest").length === 1, JSON.stringify(routeMapClueProgress.unlockedMaps));

const recProgress = runtime.createDefaultAdventureProgress(now);
recProgress.storage = { fieldLantern: 1, forestCharm: 1, trailMap: 1, trailRation: 2, firstAidPouch: 1 };
runtime.setProgress(recProgress);
const recommendedBackpack = runtime.buildRecommendedAdventureBackpack("deepMountain", "denseForest", runtime.deepHooks.investigateWhiteShadow);
check("推荐背包只使用真实拥有物品且不超过 5 格", Object.keys(recommendedBackpack).length <= 5 && Object.keys(recommendedBackpack).every((key) => recommendedBackpack[key] <= (recProgress.storage[key.replace("item:", "")] || 0)) && recommendedBackpack["item:fieldLantern"] === 1 && recommendedBackpack["item:forestCharm"] === 1, JSON.stringify(recommendedBackpack));

const noAutoUnlockProgress = runtime.createDefaultAdventureProgress(now);
noAutoUnlockProgress.completedTrips = 9;
noAutoUnlockProgress.mapStates.deepMountain.rangerCluesFound = 5;
runtime.refreshAdventureMapUnlocks(noAutoUnlockProgress, null);
check("冒险次数和 rangerClues 不再自动解锁雨林", !runtime.isAdventureMapUnlocked("fogRainforest", noAutoUnlockProgress) && runtime.isAdventureMapUnlocked("deepMountain", noAutoUnlockProgress), JSON.stringify({ unlockedMaps: noAutoUnlockProgress.unlockedMaps, keyClues: noAutoUnlockProgress.keyClues }));
const unlockProgress = runtime.createDefaultAdventureProgress(now);
unlockProgress.keyClues.push("dampSurveyRouteMap");
runtime.refreshAdventureMapUnlocks(unlockProgress, null);
check("获得受潮调查路线图后解锁雨林且仍可返回深山", runtime.isAdventureMapUnlocked("fogRainforest", unlockProgress) && runtime.isAdventureMapUnlocked("deepMountain", unlockProgress) && unlockProgress.unlockedMaps.includes("fogRainforest"), JSON.stringify(unlockProgress.unlockedMaps));
check("雨林入口路线开放而进阶路线仍服从各自解锁", runtime.isAdventureRouteUnlocked("fogRainforest", runtime.maps.fogRainforest.routes.riverWetlands, unlockProgress) && runtime.isAdventureRouteUnlocked("fogRainforest", runtime.maps.fogRainforest.routes.vineThicket, unlockProgress) && !runtime.isAdventureRouteUnlocked("fogRainforest", runtime.maps.fogRainforest.routes.canopyOldWay, unlockProgress), JSON.stringify(unlockProgress.unlockedRoutes));

unlockProgress.mapStates.deepMountain.bridgeRepaired = true;
unlockProgress.mapStates.fogRainforest.stationResearchStage = 3;
check("深山与雨林 mapState 双向修改仍互不污染", unlockProgress.mapStates.deepMountain.bridgeRepaired && unlockProgress.mapStates.deepMountain.stationResearchStage === undefined && unlockProgress.mapStates.fogRainforest.stationResearchStage === 3 && unlockProgress.mapStates.fogRainforest.bridgeRepaired === undefined, JSON.stringify(unlockProgress.mapStates));

const interrupted = runtime.createDefaultAdventureProgress(now);
interrupted.storage.ropeKit = 0;
interrupted.pendingBackpack = { "item:ropeKit": 1, "fish:fish": 1 };
interrupted.pendingLoot = { "item:luminousSpore": 1, "meal:meal": 1 };
interrupted.pendingTripSnapshot = { mapId: "fogRainforest", routeId: "riverWetlands", adventureHook: { id: "recoverLostSupplies", title: "被水冲走的补给", intro: "沿水线看看。", relatedEventIds: ["flashFloodDebris"], source: "routeRumor" } };
runtime.setProgress(interrupted);
runtime.setTrip(null);
const recovered = runtime.recoverInterruptedAdventureBackpack();
const repeated = runtime.recoverInterruptedAdventureBackpack();
check("刷新中断按来源返还 backpack 与 loot 且第二次不复制", recovered.mapId === "fogRainforest" && interrupted.storage.ropeKit === 1 && interrupted.storage.luminousSpore === 1 && sandbox.gameState.inventory.fish.fish === 1 && sandbox.gameState.inventory.meals.meal === 1 && Object.keys(interrupted.pendingBackpack).length === 0 && Object.keys(interrupted.pendingLoot).length === 0 && repeated === null, JSON.stringify({ recovered, storage: interrupted.storage, fish: sandbox.gameState.inventory.fish, meals: sandbox.gameState.inventory.meals, repeated }));

const disallowedMapBranches = (systemSource.match(/mapId\s*={2,3}\s*["'][^"']+["']/g) || []).filter((fragment) => fragment !== 'mapId === "fogRainforest"');
check("最终引擎仍只注册两张地图且没有地图 id 状态机分叉", Object.keys(runtime.maps).join("|") === "deepMountain|fogRainforest" && disallowedMapBranches.length === 0, Object.keys(runtime.maps).join(", ") + " / " + disallowedMapBranches.join(", "));

const failed = checks.filter((entry) => !entry.passed);
console.table(checks);
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length }, null, 2));
if (failed.length) {
  console.error("Failed checks", failed);
  process.exitCode = 1;
}
