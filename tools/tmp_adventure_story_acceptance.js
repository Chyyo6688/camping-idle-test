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
const htmlSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const systemSource = fs.readFileSync(path.join(root, "js/systems/gameAdventurePrototype.js"), "utf8");
const partySource = fs.readFileSync(path.join(root, "js/systems/adventure/adventureParty.js"), "utf8");
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
globalThis.__storyRuntime = {
  hooks: DEEP_MOUNTAIN_ADVENTURE_HOOKS,
  routes: DEEP_MOUNTAIN_ADVENTURE_ROUTES,
  events: DEEP_MOUNTAIN_ADVENTURE_EVENTS,
  maps: ADVENTURE_MAPS,
  requirements: ADVENTURE_REACTION_ITEM_REQUIREMENTS,
  solutions: ADVENTURE_ITEM_SOLUTION_EFFECTS,
  consequences: ADVENTURE_EVENT_CONSEQUENCES,
  createDefaultAdventureProgress,
  sanitizeAdventureProgress,
  sanitizeAdventureMapStates,
  sanitizeAdventureMemories,
  isAdventureMapPlayable,
  isAdventureMapUnlocked,
  createAdventureHookSnapshot,
  createFallbackAdventureHook,
  chooseAdventureHook,
  getAdventureRoutePresentation,
  chooseNextAdventureEvent,
  evaluateAdventureHookProgress,
  applyAdventureStoryContext,
  updateAdventureEventFlags,
  applyAdventureTripMapState,
  applyAdventureTripMemories,
  getAdventureHistoryWeight,
  resolveAdventureHookResult,
  createAdventureStoryIntro,
  createAdventureHookEnding,
  isDeepMountainRouteUnlocked,
  setTrip(trip) { adventurePrototypeState.trip = trip; },
  setSeen(ids) { adventurePrototypeState.seenEventIds = ids.slice(); },
  setProgress(progress) { gameState.adventure = progress; },
  getProgress() { return gameState.adventure; }
};`, sandbox);

const runtime = sandbox.__storyRuntime;
const neutralSnapshot = { dailyAdventureModifiers: { dangerSense: 0 } };
function makeTrip(hookId, routeId) {
  const hook = runtime.hooks[hookId];
  const activeProgress = runtime.getProgress() || runtime.createDefaultAdventureProgress(Date.now());
  return {
    mapId: "deepMountain", routeId,
    adventureHook: runtime.createAdventureHookSnapshot(hook, "routeRumor"),
    mapStateSnapshot: JSON.parse(JSON.stringify(activeProgress.mapStates.deepMountain)),
    adventureMemorySnapshot: JSON.parse(JSON.stringify(activeProgress.adventureMemories)),
    eventFlags: {}, hookProgress: { score: 0, status: "noResult" }, storyBeats: [],
    backpack: {}, departedWith: {}, loot: {}, gained: {}, lost: {}, consumed: {}, unlocked: [], statuses: [], events: [],
    staminaEventDelta: 0, staminaStart: 100
  };
}
function event(id) { return runtime.events.find((entry) => entry.id === id); }
function reaction(eventId, reactionId) { return event(eventId).reactions.find((entry) => entry.id === reactionId); }
function outcome(tier, text, itemSolution) { return { tier, text: text || "结果。", itemSolution: itemSolution || null }; }
function advance(trip, eventId, reactionId, eventOutcome) {
  const definition = event(eventId);
  const selectedReaction = reaction(eventId, reactionId);
  const context = runtime.applyAdventureStoryContext(definition, selectedReaction, eventOutcome, trip);
  if (context.result) eventOutcome.text = context.result;
  const update = runtime.updateAdventureEventFlags(definition, selectedReaction, eventOutcome, context, trip);
  trip.events.push({ eventId, outcomeTier: eventOutcome.tier, storyText: update.storyText, chainId: update.chainId });
  return { context, update };
}

check("5 个后台契机完整定义", Object.keys(runtime.hooks).length === 5 && Object.values(runtime.hooks).every((hook) => hook.relatedEventIds.length >= 4 && hook.title && hook.intro && hook.routeIds.length), Object.keys(runtime.hooks).join(", "));
check("准备页不再包含手动目标控件", !htmlSource.includes("adventureGoalList") && !htmlSource.includes("adventure-goal-grid") && !htmlSource.includes('aria-label="本次目标"'), "manual goal controls removed");
check("准备页契机提示只读且不可点击", /<aside id="adventureHookPreview"[\s\S]*?<\/aside>/.test(htmlSource) && !/<button[^>]*adventureHookPreview/.test(htmlSource), "readonly adventureHook preview");
const startTripSource = systemSource.slice(systemSource.indexOf("function startAdventureTrip"), systemSource.indexOf("function showAdventurePreparation"));
check("出发不依赖旧目标字段", !/draftGoalId|selectedGoal|goalProgress/.test(startTripSource) && startTripSource.includes("ensureDraftAdventureHook(false)"), "route + stamina + backpack validation only");
check("trip 与中断快照保存同一契机", startTripSource.includes("adventureHook: adventureHook") && startTripSource.includes("adventureHook: cloneAdventureData(adventureHook)"), "trip and pendingTripSnapshot");
check("地图注册表包含两张可玩地图", Object.keys(runtime.maps).length === 2 && Object.values(runtime.maps).every((map) => map.status === "ready" && map.scene) && Object.keys(runtime.maps.fogRainforest.routes).length === 4 && runtime.maps.fogRainforest.events.length === 18, JSON.stringify(Object.fromEntries(Object.entries(runtime.maps).map(([id, map]) => [id, { status: map.status, routes: Object.keys(map.routes || {}).length, events: (map.events || []).length }]))));
check("地图选择页具有锁定预览与共享状态", htmlSource.includes('id="adventureMapList"') && htmlSource.includes('id="adventureMapStamina"') && htmlSource.includes('id="adventureMapStorageCount"') && runtime.maps.fogRainforest.selection.unlockHint && !runtime.maps.fogRainforest.selection.unlockHint.includes("回途"), runtime.maps.fogRainforest.selection.unlockHint);
check("准备页与日志都能返回地图选择", htmlSource.includes('id="adventurePrepCloseButton"') && htmlSource.includes('id="adventureLogMapButton"') && systemSource.includes('showAdventureMapSelection("换个方向看看。 ")') && systemSource.includes('showAdventureMapSelection("上一趟已经安全结算，可以选择下一处目的地。 ")'), "prep and log return actions");
const defaultMapProgress = runtime.createDefaultAdventureProgress(Date.now());
check("地图状态隔离且体力仓库记忆保持共享", defaultMapProgress.mapStates.deepMountain !== defaultMapProgress.mapStates.fogRainforest && defaultMapProgress.unlockedMaps.join("|") === "deepMountain" && defaultMapProgress.stamina && defaultMapProgress.storage && defaultMapProgress.adventureMemories && !("stamina" in defaultMapProgress.mapStates.deepMountain) && !("storage" in defaultMapProgress.mapStates.fogRainforest), JSON.stringify({ unlockedMaps: defaultMapProgress.unlockedMaps, mapStates: defaultMapProgress.mapStates }));
const disallowedMapBranches = (systemSource.match(/mapId\s*={2,3}\s*["'][^"']+["']/g) || []).filter((fragment) => fragment !== 'mapId === "fogRainforest"');
check("通用引擎没有按地图 id 状态机分叉", disallowedMapBranches.length === 0, disallowedMapBranches.join(", "));
check("4 条路线完整定义", Object.keys(runtime.routes).length === 4 && Object.values(runtime.routes).every((route) => route.unlockAny.length && Object.keys(route.eventWeights).length >= 7), Object.keys(runtime.routes).join(", "));
check("4 条路线具有独立镜头、开场和日志表现", new Set(Object.values(runtime.routes).map((route) => route.presentation.cameraPosition)).size === 4 && Object.values(runtime.routes).every((route) => route.presentation.opening && route.presentation.ambientClass && route.presentation.journalTitle && route.presentation.journalCaption), JSON.stringify(Object.fromEntries(Object.entries(runtime.routes).map(([id, route]) => [id, route.presentation]))));
check("深山正式内容规模为 20–25 个基础事件", runtime.events.length >= 20 && runtime.events.length <= 25, String(runtime.events.length));
check("每个事件有 3–5 个反应和完整五档结果", runtime.events.every((entry) => entry.reactions.length >= 3 && entry.reactions.length <= 5 && ["rareGood", "good", "mixed", "bad", "rareBad"].every((tier) => Array.isArray(entry.outcomes[tier]) && entry.outcomes[tier].length)), runtime.events.filter((entry) => entry.reactions.length < 3 || entry.reactions.length > 5 || ["rareGood", "good", "mixed", "bad", "rareBad"].some((tier) => !entry.outcomes[tier]?.length)).map((entry) => entry.id).join(", "));
check("每个事件都有结算且至少被一条路线明确偏好", runtime.events.every((entry) => runtime.consequences[entry.id] && ["rareGood", "good", "mixed", "bad", "rareBad"].every((tier) => Array.isArray(runtime.consequences[entry.id][tier])) && Object.values(runtime.routes).some((route) => Number(route.eventWeights[entry.id]) > 1)), runtime.events.filter((entry) => !runtime.consequences[entry.id] || !Object.values(runtime.routes).some((route) => Number(route.eventWeights[entry.id]) > 1)).map((entry) => entry.id).join(", "));
check("物品反应都有对应携带要求与实际效果", Object.entries(runtime.requirements).every(([eventId, reactions]) => Object.keys(reactions).every((reactionId) => reaction(eventId, reactionId) && runtime.solutions[eventId + ":" + reactionId])), Object.entries(runtime.requirements).flatMap(([eventId, reactions]) => Object.keys(reactions).filter((reactionId) => !reaction(eventId, reactionId) || !runtime.solutions[eventId + ":" + reactionId]).map((reactionId) => eventId + ":" + reactionId)).join(", "));
check("黎明、山风和夜间氛围都有实际事件", ["dawn", "windy", "night"].every((atmosphere) => runtime.events.some((entry) => entry.atmosphere === atmosphere)), runtime.events.filter((entry) => entry.atmosphere).map((entry) => entry.id + ":" + entry.atmosphere).join(", "));

const distribution = {};
Object.keys(runtime.routes).forEach((routeId) => {
  const counts = {};
  const progress = runtime.createDefaultAdventureProgress(Date.now());
  progress.unlockedRoutes = ["deepMountain", "ridgeTrail", "watchtowerRoute", "oldRangerStation"];
  progress.unlockedLocations = progress.unlockedRoutes.slice();
  runtime.setProgress(progress);
  for (let index = 0; index < 8000; index += 1) {
    const trip = makeTrip("investigateWildlife", routeId);
    runtime.setTrip(trip);
    runtime.setSeen([]);
    const selected = runtime.chooseNextAdventureEvent(neutralSnapshot).id;
    counts[selected] = (counts[selected] || 0) + 1;
  }
  distribution[routeId] = counts;
});
check("溪谷明显偏向溪流事件", distribution.creekValley.streamSparkle > distribution.mountainRidge.streamSparkle * 2, JSON.stringify({ creek: distribution.creekValley.streamSparkle, ridge: distribution.mountainRidge.streamSparkle }));
check("密林明显偏向白影", distribution.denseForest.whiteShadow > distribution.creekValley.whiteShadow * 2, JSON.stringify({ forest: distribution.denseForest.whiteShadow, creek: distribution.creekValley.whiteShadow }));
check("山脊明显偏向吊桥", distribution.mountainRidge.unstableBridge > distribution.denseForest.unstableBridge * 2, JSON.stringify({ ridge: distribution.mountainRidge.unstableBridge, forest: distribution.denseForest.unstableBridge }));
check("护林道明显偏向木屋", distribution.abandonedRangerRoad.abandonedCabin > distribution.creekValley.abandonedCabin * 2, JSON.stringify({ road: distribution.abandonedRangerRoad.abandonedCabin, creek: distribution.creekValley.abandonedCabin }));
check("新增内容继续服从路线差异", distribution.creekValley.oldWaterGauge > distribution.mountainRidge.oldWaterGauge * 2 && distribution.denseForest.mushroomRing > distribution.creekValley.mushroomRing * 1.5 && distribution.mountainRidge.ridgeWindGust > distribution.denseForest.ridgeWindGust * 3 && distribution.abandonedRangerRoad.rangerNotebook > distribution.creekValley.rangerNotebook * 2.5, JSON.stringify({ creekGauge: distribution.creekValley.oldWaterGauge, ridgeGauge: distribution.mountainRidge.oldWaterGauge, forestMushroom: distribution.denseForest.mushroomRing, creekMushroom: distribution.creekValley.mushroomRing, ridgeWind: distribution.mountainRidge.ridgeWindGust, forestWind: distribution.denseForest.ridgeWindGust, roadNotebook: distribution.abandonedRangerRoad.rangerNotebook, creekNotebook: distribution.creekValley.rangerNotebook }));

let progress = runtime.createDefaultAdventureProgress(Date.now());
progress.unlockedRoutes = ["deepMountain", "ridgeTrail", "watchtowerRoute", "oldRangerStation"];
progress.unlockedLocations = progress.unlockedRoutes.slice();
runtime.setProgress(progress);
let trip = makeTrip("findSafeRoute", "mountainRidge");
runtime.setTrip(trip);
runtime.setSeen([]);
for (let index = 0; index < 5; index += 1) {
  const selected = runtime.chooseNextAdventureEvent(neutralSnapshot).id;
  trip.events.push({ eventId: selected, outcomeTier: "mixed" });
  runtime.setSeen(trip.events.map((entry) => entry.eventId));
}
check("每趟最多五个且基础事件不重复", trip.events.length === 5 && new Set(trip.events.map((entry) => entry.eventId)).size === 5, trip.events.map((entry) => entry.eventId).join(" → "));

trip = makeTrip("investigateWildlife", "creekValley");
advance(trip, "animalTracks", "followTracks", outcome("good"));
const animalContext = advance(trip, "forestFootsteps", "readTracks", outcome("good"));
advance(trip, "missingFood", "inspectBag", outcome("good"));
check("动物链实际贯通三事件", trip.eventFlags.foundAnimalTracks && trip.eventFlags.followedAnimal && trip.eventFlags.observedAnimal && trip.eventFlags.identifiedFoodThief && animalContext.context.chainId === "animalTrail", JSON.stringify(trip.eventFlags));

const friendlyAnimalTrip = makeTrip("investigateWildlife", "creekValley");
advance(friendlyAnimalTrip, "animalTracks", "offerFish", outcome("good", "动物接受了鱼。", { itemKey: "fish:fish" }));
const friendlyFoodContext = advance(friendlyAnimalTrip, "missingFood", "inspectBag", outcome("good"));
const startledAnimalTrip = makeTrip("investigateWildlife", "creekValley");
advance(startledAnimalTrip, "animalTracks", "followTracks", outcome("bad"));
const stolenFoodOutcome = outcome("good");
const stolenFoodContext = advance(startledAnimalTrip, "missingFood", "inspectBag", stolenFoodOutcome);
check("动物链跑通信任与受惊失窃两种结局", friendlyAnimalTrip.eventFlags.befriendedAnimal && friendlyFoodContext.context.result.includes("完整坚果") && friendlyFoodContext.context.visualClass === "story-friendly-animal" && startledAnimalTrip.eventFlags.animalStartled && startledAnimalTrip.eventFlags.animalFoodStolen && stolenFoodOutcome.tier === "mixed" && stolenFoodContext.context.result.includes("叼走食物") && stolenFoodContext.context.visualClass === "story-food-theft", JSON.stringify({ friendly: friendlyAnimalTrip.eventFlags, startled: startledAnimalTrip.eventFlags }));

trip = makeTrip("investigateWhiteShadow", "denseForest");
advance(trip, "forestFootsteps", "findCause", outcome("mixed"));
const shadowContext = advance(trip, "whiteShadow", "speakToGhost", outcome("good"));
const guidedContext = advance(trip, "lostBeforeDark", "retraceSteps", outcome("good"));
check("白影链改变后续气泡与结果", trip.eventFlags.sawWhiteShadow && trip.eventFlags.whiteShadowTrust > 0 && trip.eventFlags.whiteShadowGuided && shadowContext.context.bubble.includes("脚步声") && guidedContext.context.result.includes("引回"), guidedContext.context.bubble + " / " + guidedContext.context.result);

const misledShadowTrip = makeTrip("investigateWhiteShadow", "denseForest");
advance(misledShadowTrip, "forestFootsteps", "findCause", outcome("mixed"));
advance(misledShadowTrip, "whiteShadow", "approachGhost", outcome("bad"));
const misledOutcome = outcome("good");
const misledContext = advance(misledShadowTrip, "lostBeforeDark", "retraceSteps", misledOutcome);
check("白影链跑通引路与误导两种结局", trip.eventFlags.whiteShadowGuided && misledShadowTrip.eventFlags.whiteShadowMisled && misledOutcome.tier === "bad" && misledContext.context.result.includes("引回原地") && misledContext.context.visualClass === "story-misleading-shadow", JSON.stringify({ guided: trip.eventFlags, misled: misledShadowTrip.eventFlags }));

trip = makeTrip("findMissingRanger", "abandonedRangerRoad");
advance(trip, "abandonedCabin", "lightLantern", outcome("rareGood", "", { itemKey: "item:fieldLantern" }));
trip.gained["item:sealedLetter"] = 1;
const chestContext = advance(trip, "lockedChest", "useTools", outcome("rareGood", "完整开箱。", { itemKey: "item:oldKey" }));
const rescueContext = advance(trip, "distantCry", "prepareAid", outcome("rareGood", "完整救援。", { itemKey: "item:ropeKit", isCombined: true }));
check("护林员旧设施链贯通三事件", trip.eventFlags.discoveredCabinClue && trip.eventFlags.openedChest && trip.eventFlags.archivedSealedLetter && trip.eventFlags.completedRescue && chestContext.context.result.includes("锁具编号") && rescueContext.context.bubble.includes("护林员"), JSON.stringify(trip.eventFlags));

trip = makeTrip("findSafeRoute", "mountainRidge");
advance(trip, "suddenDownpour", "runForCabin", outcome("mixed"));
const bridgeContext = advance(trip, "unstableBridge", "reinforceBridge", outcome("good", "桥已加固。", { itemKey: "item:ropeKit" }));
advance(trip, "hiddenFork", "readTrailMap", outcome("good", "岔路已确认。", { itemKey: "item:trailMap" }));
const routeContext = advance(trip, "lostBeforeDark", "retraceSteps", outcome("good"));
check("安全路线链贯通四事件", trip.eventFlags.enduredDownpour && trip.eventFlags.repairedBridge && trip.eventFlags.mappedFork && trip.eventFlags.securedRoute && bridgeContext.context.bubble.includes("暴雨") && routeContext.context.result.includes("闭合"), JSON.stringify(trip.eventFlags));

trip = makeTrip("findSafeRoute", "creekValley");
advance(trip, "streamSparkle", "usePole", outcome("good", "取回溪中旧物。", { itemKey: "item:repairToolkit" }));
const gaugeContext = advance(trip, "oldWaterGauge", "repairGauge", outcome("good", "恢复水位尺。", { itemKey: "item:repairToolkit" }));
const cacheContext = advance(trip, "washedOutCache", "openCache", outcome("rareGood", "完整打开补给箱。", { itemKey: "item:oldKey" }));
check("溪流旧设施链贯通三事件", trip.eventFlags.foundStreamClue && trip.eventFlags.readWaterGauge && trip.eventFlags.repairedWaterGauge && trip.eventFlags.openedWashedOutCache && gaugeContext.context.chainId === "streamFacility" && gaugeContext.context.bubble.includes("山纹") && cacheContext.context.result.includes("水文设施"), JSON.stringify(trip.eventFlags));

trip = makeTrip("findWatchtowerClue", "abandonedRangerRoad");
advance(trip, "rangerNotebook", "lightLantern", outcome("good", "读出巡查笔记。", { itemKey: "item:fieldLantern" }));
const markerContext = advance(trip, "fallenTrailMarker", "repairMarker", outcome("good", "修复路标。", { itemKey: "item:repairToolkit" }));
const signalContext = advance(trip, "watchtowerSignal", "answerSignal", outcome("rareGood", "回应高处信号。", { itemKey: "item:fieldLantern" }));
check("巡查笔记与瞭望塔信号链贯通三事件", trip.eventFlags.foundRangerNotebook && trip.eventFlags.decodedRangerNotebook && trip.eventFlags.restoredTrailMarker && trip.eventFlags.answeredWatchtowerSignal && markerContext.context.chainId === "watchtowerSignal" && markerContext.context.bubble.includes("三角记号") && signalContext.context.result.includes("同一处高地"), JSON.stringify(trip.eventFlags));

trip = makeTrip("investigateWildlife", "creekValley");
advance(trip, "animalTracks", "followTracks", outcome("good"));
const snareContext = advance(trip, "snaredAnimal", "cutSnare", outcome("good", "拆除套索。", { itemKey: "item:repairToolkit" }));
check("动物链新增救援中段", trip.eventFlags.foundSnaredAnimal && trip.eventFlags.rescuedAnimal && trip.eventFlags.observedAnimal && snareContext.context.chainId === "animalTrail" && snareContext.context.result.includes("危险兽径"), JSON.stringify(trip.eventFlags));

trip = makeTrip("investigateWhiteShadow", "denseForest");
advance(trip, "mushroomRing", "showCharm", outcome("good", "护符回应。", { itemKey: "item:forestCharm" }));
const echoContext = advance(trip, "nightCampEcho", "countEchoes", outcome("mixed"));
check("白影链新增菌环与夜间回声中段", trip.eventFlags.foundMushroomRing && trip.eventFlags.supernaturalTrail && trip.eventFlags.heardNightEcho && echoContext.context.chainId === "whiteShadow" && echoContext.context.bubble.includes("菌环"), JSON.stringify(trip.eventFlags));
const expandedWhiteEnding = runtime.createAdventureHookEnding(trip, { status: "found", score: 4 });

const expandedWatchTrip = makeTrip("findWatchtowerClue", "abandonedRangerRoad");
expandedWatchTrip.eventFlags = { restoredTrailMarker: true, answeredWatchtowerSignal: true };
const expandedAnimalTrip = makeTrip("investigateWildlife", "creekValley");
expandedAnimalTrip.eventFlags = { rescuedAnimal: true };
const expandedRouteTrip = makeTrip("findSafeRoute", "creekValley");
expandedRouteTrip.eventFlags = { crossedMorningFog: true, readWaterGauge: true };
check("新增事件链都有对应故事化日志结尾", expandedWhiteEnding.includes("菌环空缺") && runtime.createAdventureHookEnding(expandedWatchTrip, { status: "found", score: 4 }).includes("高处信号") && runtime.createAdventureHookEnding(expandedAnimalTrip, { status: "found", score: 3 }).includes("废弃套索") && runtime.createAdventureHookEnding(expandedRouteTrip, { status: "found", score: 4 }).includes("旧水位记录"), JSON.stringify({ white: expandedWhiteEnding, watch: runtime.createAdventureHookEnding(expandedWatchTrip, { status: "found", score: 4 }), animal: runtime.createAdventureHookEnding(expandedAnimalTrip, { status: "found", score: 3 }), route: runtime.createAdventureHookEnding(expandedRouteTrip, { status: "found", score: 4 }) }));

const whitePathA = makeTrip("investigateWhiteShadow", "denseForest");
whitePathA.eventFlags = { heardStrangeFootsteps: true, sawWhiteShadow: true, whiteShadowResolved: true };
const whitePathB = makeTrip("investigateWhiteShadow", "denseForest");
whitePathB.eventFlags = { sawWhiteShadow: true, whiteShadowGuided: true };
check("同一契机至少两条发现路径", runtime.evaluateAdventureHookProgress(whitePathA).status === "found" && runtime.evaluateAdventureHookProgress(whitePathB).status === "found", JSON.stringify([runtime.evaluateAdventureHookProgress(whitePathA), runtime.evaluateAdventureHookProgress(whitePathB)]));

const noToolTrip = makeTrip("findWatchtowerClue", "abandonedRangerRoad");
noToolTrip.eventFlags = { foundLockedChest: true };
check("缺关键物仍可让线索继续", runtime.evaluateAdventureHookProgress(noToolTrip).status === "continuing", JSON.stringify(runtime.evaluateAdventureHookProgress(noToolTrip)));

progress = runtime.createDefaultAdventureProgress(Date.now());
progress.unlockedRoutes = ["deepMountain", "ridgeTrail", "watchtowerRoute", "oldRangerStation"];
progress.unlockedLocations = progress.unlockedRoutes.slice();
runtime.setProgress(progress);
const combinations = [];
for (let run = 0; run < 24; run += 1) {
  trip = makeTrip("investigateWhiteShadow", "denseForest");
  runtime.setTrip(trip);
  runtime.setSeen([]);
  for (let index = 0; index < 5; index += 1) {
    const selected = runtime.chooseNextAdventureEvent(neutralSnapshot).id;
    trip.events.push({ eventId: selected, outcomeTier: "mixed" });
    runtime.setSeen(trip.events.map((entry) => entry.eventId));
  }
  const combo = trip.events.map((entry) => entry.eventId);
  combinations.push(combo.join("|"));
  progress.recentAdventureHistory.push({ mapId: "deepMountain", hookId: trip.adventureHook.id, routeId: trip.routeId, eventIds: combo, outcomeType: "continuing", createdAt: Date.now() + run });
  progress.recentAdventureHistory = progress.recentAdventureHistory.slice(-8);
}
let consecutiveDuplicates = 0;
for (let index = 1; index < combinations.length; index += 1) if (combinations[index] === combinations[index - 1]) consecutiveDuplicates += 1;
check("连续同契机组合不会完全重复", consecutiveDuplicates === 0 && new Set(combinations).size >= 20, JSON.stringify({ unique: new Set(combinations).size, consecutiveDuplicates }));

trip = makeTrip("investigateWildlife", "creekValley");
advance(trip, "animalTracks", "followTracks", outcome("good"));
advance(trip, "forestFootsteps", "readTracks", outcome("good"));
const intro = runtime.createAdventureStoryIntro(trip);
check("日志故事具备路线开场和连续叙述", intro.includes("沿着水声进入溪谷") && intro.includes("溪边的新鲜脚印") && trip.storyBeats.length === 2 && trip.storyBeats[1].includes("继续深入后"), intro + " / " + trip.storyBeats.join(" "));
const contextualEnding = runtime.createAdventureHookEnding(trip, { status: "found", score: 3 });
check("契机结尾只引用本趟实际线索", contextualEnding.includes("脚印") && contextualEnding.includes("树林") && !contextualEnding.includes("食物"), contextualEnding);

progress = runtime.createDefaultAdventureProgress(Date.now());
runtime.setProgress(progress);
trip = makeTrip("investigateWildlife", "creekValley");
trip.eventFlags = { foundAnimalTracks: true, observedAnimal: true };
const hookResult = runtime.resolveAdventureHookResult(trip);
check("契机有所发现但不额外发任务奖励", hookResult.status === "found" && Object.keys(trip.loot).length === 0 && Object.keys(trip.gained).length === 0, JSON.stringify({ hookResult, loot: trip.loot }));

progress = runtime.createDefaultAdventureProgress(Date.now());
const routeHookCounts = {};
Object.keys(runtime.routes).forEach((routeId) => {
  routeHookCounts[routeId] = {};
  for (let index = 0; index < 1200; index += 1) {
    const selectedHook = runtime.chooseAdventureHook("deepMountain", routeId, progress, {}, "");
    routeHookCounts[routeId][selectedHook.id] = (routeHookCounts[routeId][selectedHook.id] || 0) + 1;
  }
});
check("路线只抽取适合当前路线的契机", Object.keys(runtime.routes).every((routeId) => Object.keys(routeHookCounts[routeId]).every((hookId) => runtime.hooks[hookId].routeIds.includes(routeId))), JSON.stringify(routeHookCounts));

progress.clueStages.investigateWhiteShadow = "seenAgain";
const unfinishedHookSamples = Array.from({ length: 120 }, () => runtime.chooseAdventureHook("deepMountain", "denseForest", progress, {}, ""));
check("未完成线索优先并标记来源", unfinishedHookSamples.filter((hook) => hook.id === "investigateWhiteShadow" && hook.source === "unfinishedClue").length > 75, JSON.stringify(unfinishedHookSamples.reduce((counts, hook) => ({ ...counts, [hook.id]: (counts[hook.id] || 0) + 1 }), {})));

const fallbackHook = runtime.createFallbackAdventureHook("deepMountain", "creekValley");
check("无适合内容时具备普通探索 fallback", fallbackHook.source === "fallback" && fallbackHook.relatedEventIds.length > 0 && fallbackHook.title.includes("溪谷路线"), JSON.stringify(fallbackHook));

const snapshotHook = runtime.createAdventureHookSnapshot(runtime.hooks.investigateWhiteShadow, "routeRumor");
progress.mapStates.deepMountain.whiteShadowTrust = 9;
check("出发 hook 是不随地图状态变化的快照", snapshotHook.source === "routeRumor" && snapshotHook.relatedEventIds.join("|") === runtime.hooks.investigateWhiteShadow.relatedEventIds.join("|"), JSON.stringify(snapshotHook));

const migrated = runtime.sanitizeAdventureProgress({ version: 3, selectedGoal: "investigateWhiteShadow", goalProgress: { score: 3 }, storage: { fieldLantern: 1 }, stamina: { value: 70, updatedAt: Date.now() }, unlockedRoutes: ["deepMountain"], discoveredKeyItems: [], pendingBackpack: {}, pendingLoot: {}, recentAdventureHistory: [{ goalId: "investigateWildlife", routeId: "creekValley", eventIds: ["animalTracks"], outcomeType: "partial", createdAt: Date.now() }] });
check("旧目标字段安全忽略且历史迁移为 hook", migrated.version === 9 && !("selectedGoal" in migrated) && !("goalProgress" in migrated) && migrated.recentAdventureHistory[0].hookId === "investigateWildlife" && migrated.recentAdventureHistory[0].outcomeType === "continuing", JSON.stringify({ version: migrated.version, history: migrated.recentAdventureHistory }));

const personalizedLegacy = runtime.sanitizeAdventureProgress({
  version: 4,
  storage: { fieldLantern: 1 },
  stamina: { value: 64, updatedAt: Date.now() },
  unlockedRoutes: ["deepMountain", "ridgeTrail"],
  unlockedMaps: ["deepMountain"],
  mapStates: { deepMountain: { bridgeRepaired: true, cabinSearched: true, rangerCluesFound: 4, animalTrust: 2, whiteShadowTrust: -2, animalEncounters: 7, whiteShadowEncounters: 3, recurringEncounters: { animalTracks: 5 } } },
  adventureMemories: { rescuedSomeone: 3, supernaturalEncounters: 8, seriousFalls: 2, animalTrust: -2, frightenedByApparition: 4, preferredTools: ["fieldLantern"] },
  discoveredKeyItems: [], discoveredClues: [], clueStages: {}, crossMapMysteryFlags: {}, pendingBackpack: {}, pendingLoot: {}, recentAdventureHistory: []
});
check("v4 旧档补齐长期字段且保留已有状态", personalizedLegacy.version === 9 && Array.isArray(personalizedLegacy.keyClues) && personalizedLegacy.hookClues && personalizedLegacy.mapStates.deepMountain.bridgeRepaired && personalizedLegacy.mapStates.deepMountain.cabinSearched === 1 && personalizedLegacy.mapStates.deepMountain.rangerCluesFound === 4 && personalizedLegacy.mapStates.deepMountain.animalTrust === 2 && personalizedLegacy.mapStates.deepMountain.whiteShadowTrust === -2 && personalizedLegacy.mapStates.deepMountain.recurringEncounters.animalTracks === 5 && personalizedLegacy.adventureMemories.rescuedSomeone === 3 && personalizedLegacy.adventureMemories.frightenedByApparition === 4 && personalizedLegacy.adventureMemories.canopyCrossings === 0 && personalizedLegacy.adventureMemories.stationRecordsRecovered === 0 && personalizedLegacy.adventureMemories.sharedSymbolEncounters === 0 && personalizedLegacy.adventureMemories.preferredTools[0] === "fieldLantern", JSON.stringify({ state: personalizedLegacy.mapStates.deepMountain, memories: personalizedLegacy.adventureMemories, keyClues: personalizedLegacy.keyClues }));

const boundedStates = runtime.sanitizeAdventureMapStates({ deepMountain: { cabinSearched: 99, rangerCluesFound: 99, animalTrust: -99, whiteShadowTrust: 99, animalEncounters: 1000, whiteShadowEncounters: -3, recurringEncounters: { whiteShadow: 1000, unknownEvent: 7 } } });
const boundedMemories = runtime.sanitizeAdventureMemories({ rescuedSomeone: 99, supernaturalEncounters: 1000, seriousFalls: -2, animalTrust: 99, frightenedByApparition: 500, canopyCrossings: 200, stationRecordsRecovered: -3, sharedSymbolEncounters: 999, preferredTools: ["fieldLantern", "notReal"] });
check("长期地图状态与 Camper 记忆具有边界", boundedStates.deepMountain.cabinSearched === 3 && boundedStates.deepMountain.rangerCluesFound === 5 && boundedStates.deepMountain.animalTrust === -3 && boundedStates.deepMountain.whiteShadowTrust === 3 && boundedStates.deepMountain.animalEncounters === 99 && boundedStates.deepMountain.whiteShadowEncounters === 0 && boundedStates.deepMountain.recurringEncounters.whiteShadow === 99 && !("unknownEvent" in boundedStates.deepMountain.recurringEncounters) && boundedMemories.rescuedSomeone === 25 && boundedMemories.supernaturalEncounters === 99 && boundedMemories.seriousFalls === 0 && boundedMemories.animalTrust === 5 && boundedMemories.frightenedByApparition === 50 && boundedMemories.canopyCrossings === 99 && boundedMemories.stationRecordsRecovered === 0 && boundedMemories.sharedSymbolEncounters === 99 && boundedMemories.preferredTools.length === 1, JSON.stringify({ state: boundedStates.deepMountain, memories: boundedMemories }));

progress = runtime.createDefaultAdventureProgress(Date.now());
progress.adventureMemories.canopyCrossings = 2;
progress.adventureMemories.stationRecordsRecovered = 1;
progress.adventureMemories.sharedSymbolEncounters = 3;
runtime.setProgress(progress);
const returnedBridge = advance(makeTrip("findSafeRoute", "mountainRidge"), "unstableBridge", event("unstableBridge").reactions[0].id, outcome("rareBad"));
const returnedNotebook = advance(makeTrip("findMissingRanger", "abandonedRangerRoad"), "rangerNotebook", event("rangerNotebook").reactions[0].id, outcome("good"));
const returnedSymbol = advance(makeTrip("investigateWhiteShadow", "denseForest"), "mushroomRing", event("mushroomRing").reactions[0].id, outcome("mixed"));
check("雨林经历返场改变深山桥、笔记与符号观察", returnedBridge.context.chainId === "crossMapCanopyMemory" && returnedBridge.context.bubble.includes("树冠旧道") && returnedNotebook.context.chainId === "crossMapStationMemory" && returnedNotebook.context.result.includes("相似缺口") && returnedSymbol.context.chainId === "crossMapSymbolMemory" && returnedSymbol.context.result.includes("无法确认"), JSON.stringify({ bridge: returnedBridge.context, notebook: returnedNotebook.context, symbol: returnedSymbol.context }));
check("跨地图暗线仍保留解释空间", ![returnedBridge.context.result, returnedNotebook.context.result, returnedSymbol.context.result].join(" ").includes("回途"), [returnedBridge.context.result, returnedNotebook.context.result, returnedSymbol.context.result].join(" | "));

progress = runtime.createDefaultAdventureProgress(Date.now());
runtime.setProgress(progress);
trip = makeTrip("findSafeRoute", "mountainRidge");
trip.eventFlags = { repairedBridge: true, discoveredCabinClue: true, foundRangerEvidence: true, befriendedAnimal: true, observedAnimal: true, sawWhiteShadow: true, whiteShadowTrust: 1 };
trip.events = [{ eventId: "unstableBridge", outcomeTier: "good" }, { eventId: "abandonedCabin", outcomeTier: "good" }, { eventId: "animalTracks", outcomeTier: "good" }, { eventId: "whiteShadow", outcomeTier: "good" }];
runtime.applyAdventureTripMapState(trip, progress);
check("一趟结算分别推进桥、木屋、动物与白影长期状态", progress.mapStates.deepMountain.bridgeRepaired && progress.mapStates.deepMountain.cabinSearched === 1 && progress.mapStates.deepMountain.rangerCluesFound === 1 && progress.mapStates.deepMountain.animalTrust === 2 && progress.mapStates.deepMountain.animalEncounters === 1 && progress.mapStates.deepMountain.whiteShadowTrust === 1 && progress.mapStates.deepMountain.whiteShadowEncounters === 1 && progress.mapStates.deepMountain.recurringEncounters.unstableBridge === 1 && progress.mapStates.deepMountain.recurringEncounters.whiteShadow === 1, JSON.stringify(progress.mapStates.deepMountain));

trip = makeTrip("investigateWhiteShadow", "denseForest");
trip.eventFlags = { sawWhiteShadow: true, whiteShadowTrust: -1, animalStartled: true };
trip.events = [{ eventId: "whiteShadow", outcomeTier: "bad", usedItemKey: "item:fieldLantern" }, { eventId: "unstableBridge", outcomeTier: "rareBad", usedItemKey: "item:ropeKit" }];
runtime.applyAdventureTripMemories(trip, progress);
check("只把跨地图有意义的经历写入 Camper 记忆", progress.adventureMemories.supernaturalEncounters === 1 && progress.adventureMemories.frightenedByApparition === 1 && progress.adventureMemories.seriousFalls === 1 && progress.adventureMemories.animalTrust === -1 && progress.adventureMemories.preferredTools.includes("fieldLantern") && progress.adventureMemories.preferredTools.includes("ropeKit"), JSON.stringify(progress.adventureMemories));

const repeatProgress = runtime.createDefaultAdventureProgress(Date.now());
repeatProgress.mapStates.deepMountain = runtime.sanitizeAdventureMapStates({ deepMountain: { bridgeRepaired: true, cabinSearched: 2, animalTrust: 2, animalEncounters: 4, whiteShadowTrust: 1, whiteShadowEncounters: 4, recurringEncounters: { unstableBridge: 3, abandonedCabin: 2, animalTracks: 4, whiteShadow: 4 } } }).deepMountain;
repeatProgress.adventureMemories.frightenedByApparition = 0;
runtime.setProgress(repeatProgress);
const rememberedBridgeTrip = makeTrip("findSafeRoute", "mountainRidge");
const rememberedBridgeOutcome = outcome("rareBad");
const rememberedBridge = runtime.applyAdventureStoryContext(event("unstableBridge"), reaction("unstableBridge", "testBridge"), rememberedBridgeOutcome, rememberedBridgeTrip);
const rememberedCabinTrip = makeTrip("findWatchtowerClue", "abandonedRangerRoad");
const rememberedCabin = runtime.applyAdventureStoryContext(event("abandonedCabin"), reaction("abandonedCabin", "circleCabin"), outcome("good"), rememberedCabinTrip);
const rememberedAnimalTrip = makeTrip("investigateWildlife", "creekValley");
const rememberedAnimal = runtime.applyAdventureStoryContext(event("animalTracks"), reaction("animalTracks", "measureTracks"), outcome("good"), rememberedAnimalTrip);
const rememberedShadowTrip = makeTrip("investigateWhiteShadow", "denseForest");
const rememberedShadow = runtime.applyAdventureStoryContext(event("whiteShadow"), reaction("whiteShadow", "raiseLantern"), outcome("mixed"), rememberedShadowTrip);
check("桥、木屋、动物与白影具有再次和多次相遇文案", rememberedBridgeOutcome.tier === "mixed" && rememberedBridge.bubble.includes("上次") && rememberedCabin.bubble.includes("编号") && rememberedAnimal.bubble.includes("又") && rememberedAnimal.result.includes("熟悉") && rememberedShadow.bubble.includes("同一个路口") && rememberedShadow.result.includes("曾经停步"), JSON.stringify({ bridge: rememberedBridge, cabin: rememberedCabin, animal: rememberedAnimal, shadow: rememberedShadow }));

const unfinishedStateProgress = runtime.createDefaultAdventureProgress(Date.now());
unfinishedStateProgress.mapStates.deepMountain.whiteShadowEncounters = 2;
unfinishedStateProgress.mapStates.deepMountain.whiteShadowTrust = 1;
const continuedWhiteHooks = Array.from({ length: 400 }, () => runtime.chooseAdventureHook("deepMountain", "denseForest", unfinishedStateProgress, {}, ""));
const continuedWhiteCount = continuedWhiteHooks.filter((hook) => hook.id === "investigateWhiteShadow" && hook.source === "mapState" && hook.intro.includes("不止一次")).length;
check("自动契机优先未结束的白影经历", continuedWhiteCount > 220, JSON.stringify({ continuedWhiteCount }));

const historyProgress = runtime.createDefaultAdventureProgress(Date.now());
historyProgress.recentAdventureHistory.push({ mapId: "deepMountain", hookId: "investigateWhiteShadow", routeId: "denseForest", eventIds: ["whiteShadow", "forestFootsteps", "lostBeforeDark"], outcomeType: "found", createdAt: Date.now() });
const historyTrip = makeTrip("investigateWhiteShadow", "denseForest");
historyTrip.events = [];
const repeatedEventWeight = runtime.getAdventureHistoryWeight("whiteShadow", historyTrip, historyProgress);
const unseenEventWeight = runtime.getAdventureHistoryWeight("abandonedCabin", historyTrip, historyProgress);
const nextHookCounts = Array.from({ length: 500 }, () => runtime.chooseAdventureHook("deepMountain", "denseForest", historyProgress, {}, "")).reduce((counts, hook) => ({ ...counts, [hook.id]: (counts[hook.id] || 0) + 1 }), {});
check("同路线近期事件与已结束契机都会降权", repeatedEventWeight < 0.25 && unseenEventWeight === 1 && (nextHookCounts.investigateWhiteShadow || 0) < 150, JSON.stringify({ repeatedEventWeight, unseenEventWeight, nextHookCounts }));

const fallbackHistory = runtime.sanitizeAdventureProgress({ version: 5, storage: {}, stamina: { value: 80, updatedAt: Date.now() }, unlockedMaps: ["deepMountain"], mapStates: {}, adventureMemories: {}, unlockedRoutes: ["deepMountain"], discoveredKeyItems: [], discoveredClues: [], clueStages: {}, crossMapMysteryFlags: {}, pendingBackpack: {}, pendingLoot: {}, recentAdventureHistory: [{ mapId: "deepMountain", hookId: "openExploration", routeId: "creekValley", eventIds: ["streamSparkle"], outcomeType: "diverted", createdAt: Date.now() }] });
check("普通探索历史也参与近期防重复", fallbackHistory.recentAdventureHistory.length === 1 && fallbackHistory.recentAdventureHistory[0].hookId === "openExploration", JSON.stringify(fallbackHistory.recentAdventureHistory));

const multiMapProgress = runtime.createDefaultAdventureProgress(Date.now());
multiMapProgress.unlockedMaps.push("fogRainforest");
check("第二张可玩地图复用状态机且仍可返回深山", runtime.isAdventureMapPlayable("fogRainforest") && runtime.isAdventureMapUnlocked("fogRainforest", multiMapProgress) && runtime.isAdventureMapUnlocked("deepMountain", multiMapProgress), JSON.stringify({ unlockedMaps: multiMapProgress.unlockedMaps }));

const failed = checks.filter((entry) => !entry.passed);
console.table(checks);
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length, routeDistribution: distribution }, null, 2));
if (failed.length) {
  console.error("Failed checks", failed);
  process.exitCode = 1;
}
