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
globalThis.__rainforestRuntime = {
  map: FOG_RAINFOREST_ADVENTURE_MAP,
  deepMap: DEEP_MOUNTAIN_ADVENTURE_MAP,
  items: ADVENTURE_ITEM_CATALOG,
  rules: ADVENTURE_ITEM_RULES,
  createDefaultAdventureProgress,
  sanitizeAdventureProgress,
  sanitizeAdventureMapStates,
  sanitizeAdventureMemories,
  chooseAdventureHook,
  chooseNextAdventureEvent,
  getAdventureChainWeight,
  getAdventureReactionCandidates,
  resolveAdventureOutcome,
  applyAdventureStoryContext,
  updateAdventureEventFlags,
  applyAdventureTripMapState,
  applyAdventureTripMemories,
  evaluateAdventureHookProgress,
  createAdventureHookEnding,
  recoverInterruptedAdventureBackpack,
  refreshAdventureMapUnlocks,
  isAdventureMapUnlocked,
  isAdventureRouteUnlocked,
  setTrip(trip) { adventurePrototypeState.trip = trip; },
  setSeen(ids) { adventurePrototypeState.seenEventIds = ids.slice(); },
  setProgress(progress) { gameState.adventure = progress; },
  getProgress() { return gameState.adventure; }
};`, sandbox);

const runtime = sandbox.__rainforestRuntime;
const map = runtime.map;
const routeIds = Object.keys(map.routes);
const eventIds = map.events.map((entry) => entry.id);
const hookIds = Object.keys(map.adventureHooks);
const neutralSnapshot = {
  finalTraits: { courage: 50, curiosity: 50, sociability: 50, preparedness: 50, observation: 50, rationality: 50, responsibility: 50, comfortSeeking: 50 },
  dailyAdventureModifiers: { generalLuck: 0, dangerSense: 0, socialLuck: 0, treasureLuck: 0, healthLuck: 0 }
};

function event(id) { return map.events.find((entry) => entry.id === id); }
function reaction(eventId, reactionId) { return event(eventId).reactions.find((entry) => entry.id === reactionId); }
function makeTrip(hookId, routeId) {
  const progress = runtime.getProgress() || runtime.createDefaultAdventureProgress(Date.now());
  const hook = map.adventureHooks[hookId];
  return {
    mapId: "fogRainforest",
    routeId: routeId,
    adventureHook: { id: hook.id, title: hook.title, intro: hook.intro, relatedEventIds: hook.relatedEventIds.slice(), source: "routeRumor" },
    mapStateSnapshot: JSON.parse(JSON.stringify(progress.mapStates.fogRainforest)),
    adventureMemorySnapshot: JSON.parse(JSON.stringify(progress.adventureMemories)),
    eventFlags: {}, hookProgress: { score: 0, status: "noResult" }, storyBeats: [],
    backpack: {}, departedWith: {}, loot: {}, gained: {}, lost: {}, consumed: {}, unlocked: [], unlockedMaps: [], statuses: [], events: [],
    staminaEventDelta: 0, staminaStart: 100
  };
}
function outcome(tier, text, itemSolution) { return { tier, text: text || "结果。", itemSolution: itemSolution || null }; }
function advance(trip, eventId, reactionId, eventOutcome) {
  const definition = event(eventId);
  const selectedReaction = reaction(eventId, reactionId);
  const context = runtime.applyAdventureStoryContext(definition, selectedReaction, eventOutcome, trip);
  if (context.result) eventOutcome.text = context.result;
  const update = runtime.updateAdventureEventFlags(definition, selectedReaction, eventOutcome, context, trip);
  trip.events.push({ eventId: eventId, outcomeTier: eventOutcome.tier, storyText: update.storyText, chainId: update.chainId });
  return { context, update };
}

check("雾雨林作为 ready 地图注册", map.status === "ready" && map.scene && map.scene.background.includes("fog-rainforest"), JSON.stringify({ status: map.status, scene: map.scene }));
check("4 条路线与 18 个事件完整", routeIds.length === 4 && eventIds.length === 18, JSON.stringify({ routeIds, eventIds }));
check("4 个自动契机各自关联路线和事件", hookIds.length === 4 && Object.values(map.adventureHooks).every((hook) => hook.routeIds.length === 2 && hook.relatedEventIds.length >= 5 && hook.progressFlags && hook.successScore > hook.partialScore), hookIds.join(", "));
check("每个事件具有 4 个性格反应和五档结果", map.events.every((entry) => entry.reactions.length === 4 && ["rareGood", "good", "mixed", "bad", "rareBad"].every((tier) => Array.isArray(entry.outcomes[tier]) && entry.outcomes[tier].length)), eventIds.join(", "));
check("每个事件都有五档真实结算", map.events.every((entry) => map.eventConsequences[entry.id] && ["rareGood", "good", "mixed", "bad", "rareBad"].every((tier) => Array.isArray(map.eventConsequences[entry.id][tier]))), "18 event consequence tables");
check("物品反应都有携带要求与解法", Object.entries(map.reactionItemRequirements).every(([eventId, reactions]) => Object.keys(reactions).every((reactionId) => reaction(eventId, reactionId) && map.itemSolutionEffects[eventId + ":" + reactionId])), "requirements and solutions aligned");
check("6 种当地物品使用独立雨林图集", map.itemPool.length === 6 && map.itemPool.every((itemId) => runtime.items[itemId] && runtime.items[itemId].image.includes("rainforest-items")), map.itemPool.join(", "));
check("收藏与可补充消耗品规则明确", runtime.rules.pressedFernSpecimen.maxOwned === 1 && !runtime.rules.pressedFernSpecimen.carryable && runtime.rules.insectRepellent.maxOwned === Infinity && runtime.rules.luminousSpore.maxOwned === Infinity, JSON.stringify(map.itemPool.map((itemId) => runtime.rules[itemId])));
const consequenceText = JSON.stringify(map.eventConsequences);
check("每种当地物品都有事件获得来源", map.itemPool.every((itemId) => consequenceText.includes('"itemId":"' + itemId + '"')), map.itemPool.filter((itemId) => !consequenceText.includes('"itemId":"' + itemId + '"')).join(", "));
check("两种可补充物品具有多个稳定来源", (consequenceText.match(/"itemId":"insectRepellent"/g) || []).length >= 4 && (consequenceText.match(/"itemId":"luminousSpore"/g) || []).length >= 4, "repellent and spore sources");

let progress = runtime.createDefaultAdventureProgress(Date.now());
runtime.setProgress(progress);
check("新档默认保留雨林当地状态但地图未提前解锁", !runtime.isAdventureMapUnlocked("fogRainforest", progress) && progress.mapStates.fogRainforest.trailSaturation === 0 && progress.mapStates.fogRainforest.stationResearchStage === 0, JSON.stringify(progress.mapStates.fogRainforest));
progress.completedTrips = 2;
runtime.refreshAdventureMapUnlocks(progress, null);
check("普通冒险次数不再解锁雨林", !runtime.isAdventureMapUnlocked("fogRainforest", progress), JSON.stringify(progress.unlockedMaps));
const clueUnlockProgress = runtime.createDefaultAdventureProgress(Date.now());
clueUnlockProgress.mapStates.deepMountain.rangerCluesFound = 2;
runtime.refreshAdventureMapUnlocks(clueUnlockProgress, null);
check("单纯 rangerCluesFound 不再解锁雨林", !runtime.isAdventureMapUnlocked("fogRainforest", clueUnlockProgress), JSON.stringify(clueUnlockProgress.unlockedMaps));
const routeMapProgress = runtime.createDefaultAdventureProgress(Date.now());
routeMapProgress.keyClues.push("dampSurveyRouteMap");
runtime.refreshAdventureMapUnlocks(routeMapProgress, null);
check("受潮调查路线图是雨林新解锁条件", runtime.isAdventureMapUnlocked("fogRainforest", routeMapProgress), JSON.stringify(routeMapProgress.unlockedMaps));
const oldUnlockedRainforest = runtime.sanitizeAdventureProgress({ version: 8, storage: {}, stamina: { value: 60, updatedAt: Date.now() }, unlockedMaps: ["deepMountain", "fogRainforest"], unlockedRoutes: ["deepMountain"], pendingBackpack: {}, pendingLoot: {}, recentAdventureHistory: [] });
check("旧存档已解锁雨林继续保持", runtime.isAdventureMapUnlocked("fogRainforest", oldUnlockedRainforest) && oldUnlockedRainforest.keyClues.includes("dampSurveyRouteMap"), JSON.stringify({ unlockedMaps: oldUnlockedRainforest.unlockedMaps, keyClues: oldUnlockedRainforest.keyClues }));

check("两条入口路线默认开放且两条进阶路线锁定", runtime.isAdventureRouteUnlocked("fogRainforest", map.routes.riverWetlands, routeMapProgress) && runtime.isAdventureRouteUnlocked("fogRainforest", map.routes.vineThicket, routeMapProgress) && !runtime.isAdventureRouteUnlocked("fogRainforest", map.routes.canopyOldWay, routeMapProgress) && !runtime.isAdventureRouteUnlocked("fogRainforest", map.routes.abandonedSurveyZone, routeMapProgress), JSON.stringify(routeMapProgress.unlockedRoutes));

const distribution = {};
routeIds.forEach((routeId) => {
  const counts = {};
  for (let index = 0; index < 6000; index += 1) {
    const trip = makeTrip("recoverLostSupplies", routeId);
    runtime.setTrip(trip);
    runtime.setSeen([]);
    const selected = runtime.chooseNextAdventureEvent(neutralSnapshot).id;
    counts[selected] = (counts[selected] || 0) + 1;
  }
  distribution[routeId] = counts;
});
check("数万次抽取覆盖全部 18 个事件", eventIds.every((eventId) => routeIds.some((routeId) => Number(distribution[routeId][eventId]) > 0)), JSON.stringify(distribution));
check("河岸显著偏向泥水和漂流物", distribution.riverWetlands.muddyCrossing > distribution.canopyOldWay.muddyCrossing * 4 && distribution.riverWetlands.flashFloodDebris > distribution.vineThicket.flashFloodDebris * 1.7, JSON.stringify({ wetMud: distribution.riverWetlands.muddyCrossing, canopyMud: distribution.canopyOldWay.muddyCrossing, wetFlood: distribution.riverWetlands.flashFloodDebris, vineFlood: distribution.vineThicket.flashFloodDebris }));
check("藤径显著偏向藤墙与发光植物", distribution.vineThicket.vineBarricade > distribution.riverWetlands.vineBarricade * 2 && distribution.vineThicket.luminousPlants > distribution.riverWetlands.luminousPlants * 1.5, JSON.stringify({ vineBarrier: distribution.vineThicket.vineBarricade, wetBarrier: distribution.riverWetlands.vineBarricade, vineGlow: distribution.vineThicket.luminousPlants, wetGlow: distribution.riverWetlands.luminousPlants }));
check("树冠显著偏向步道与兰花", distribution.canopyOldWay.canopyWalkway > distribution.riverWetlands.canopyWalkway * 4 && distribution.canopyOldWay.canopyOrchids > distribution.vineThicket.canopyOrchids * 1.3, JSON.stringify({ canopyWalk: distribution.canopyOldWay.canopyWalkway, wetWalk: distribution.riverWetlands.canopyWalkway, canopyOrchid: distribution.canopyOldWay.canopyOrchids, vineOrchid: distribution.vineThicket.canopyOrchids }));
check("调查区显著偏向调查站三联事件", ["researchStation", "weatherConsole", "fieldNotebook"].every((eventId) => distribution.abandonedSurveyZone[eventId] > distribution.riverWetlands[eventId] * 1.8), JSON.stringify({ station: distribution.abandonedSurveyZone, wetland: distribution.riverWetlands }));

progress = runtime.createDefaultAdventureProgress(Date.now());
progress.unlockedMaps.push("fogRainforest");
progress.unlockedRoutes.push("fogRainforest", "canopyRoute", "rainforestStation");
progress.unlockedLocations = progress.unlockedRoutes.slice();
runtime.setProgress(progress);

let trip = makeTrip("recoverLostSupplies", "riverWetlands");
advance(trip, "muddyCrossing", "securePack", outcome("good", "安全过泥。", { itemKey: "item:rainCape" }));
const floodContext = advance(trip, "flashFloodDebris", "anchorLine", outcome("good", "固定漂流物。", { itemKey: "item:ropeKit" }));
const crateContext = advance(trip, "floodedSupplyCrate", "openCrate", outcome("rareGood", "打开补给箱。", { itemKey: "item:stationPass" }));
check("湿地补给链贯通三事件", trip.eventFlags.crossedMudSafely && trip.eventFlags.foundFloodDebris && trip.eventFlags.openedSupplyCrate && trip.eventFlags.recoveredRainforestSupplies && floodContext.context.chainId === "wetlandSupplies" && crateContext.context.chainId === "wetlandSupplies", JSON.stringify(trip.eventFlags));

trip = makeTrip("studyLuminousPlants", "vineThicket");
advance(trip, "luminousPlants", "collectSample", outcome("rareGood", "采集孢子。", { itemKey: "item:rainCape" }));
const sporeContext = advance(trip, "sporeCloud", "coverUp", outcome("good", "穿过孢子云。", { itemKey: "item:rainCape" }));
const orchidContext = advance(trip, "canopyOrchids", "protectSample", outcome("rareGood", "记录兰花。", { itemKey: "item:rainCape" }));
check("发光植物链贯通三事件", trip.eventFlags.foundLuminousPlants && trip.eventFlags.crossedSporeCloud && trip.eventFlags.studiedOrchids && sporeContext.context.chainId === "luminousPlants" && orchidContext.context.chainId === "luminousPlants", JSON.stringify(trip.eventFlags));

trip = makeTrip("followChangingVines", "vineThicket");
advance(trip, "vineBarricade", "trimVines", outcome("good", "处理藤墙。", { itemKey: "item:vineCutter" }));
const movingContext = advance(trip, "movingVines", "markVines", outcome("good", "标记藤蔓。", { itemKey: "item:trailMap" }));
const canopyContext = advance(trip, "canopyWalkway", "secureWalkway", outcome("good", "通过步道。", { itemKey: "item:ropeKit" }));
check("变化藤蔓链贯通三事件", trip.eventFlags.foundVineBarrier && trip.eventFlags.tracedMovingVines && trip.eventFlags.crossedCanopy && movingContext.context.chainId === "changingVines" && canopyContext.context.chainId === "changingVines", JSON.stringify(trip.eventFlags));

trip = makeTrip("traceStationRecords", "abandonedSurveyZone");
advance(trip, "researchStation", "enterStation", outcome("good", "进入调查站。", { itemKey: "item:stationPass" }));
const consoleContext = advance(trip, "weatherConsole", "restoreConsole", outcome("rareGood", "恢复终端。", { itemKey: "item:repairToolkit" }));
const notebookContext = advance(trip, "fieldNotebook", "dryPages", outcome("good", "读出笔记。", { itemKey: "item:rainCape" }));
check("调查站记录链贯通三事件", trip.eventFlags.foundStation && trip.eventFlags.restoredConsole && trip.eventFlags.readFieldNotebook && trip.eventFlags.recoveredStationRecord && consoleContext.context.chainId === "stationRecords" && notebookContext.context.chainId === "stationRecords", JSON.stringify(trip.eventFlags));

check("湿润度只存于本趟并改变链权重", trip.eventFlags.rainforestMoisture >= 1 && !Object.prototype.hasOwnProperty.call(progress.mapStates.fogRainforest, "rainforestMoisture") && runtime.getAdventureChainWeight("sporeCloud", { rainforestMoisture: 4 }, "fogRainforest") > runtime.getAdventureChainWeight("sporeCloud", { rainforestMoisture: 1 }, "fogRainforest"), JSON.stringify({ tripMoisture: trip.eventFlags.rainforestMoisture, state: progress.mapStates.fogRainforest }));

runtime.applyAdventureTripMapState(trip, progress);
check("调查站结果只推进雨林当地状态", progress.mapStates.fogRainforest.stationResearchStage === 4 && progress.mapStates.deepMountain.rangerCluesFound === 0 && progress.mapStates.fogRainforest.recurringEncounters.researchStation === 1, JSON.stringify(progress.mapStates));
runtime.applyAdventureTripMemories(trip, progress);
check("雨林结算写入共享 Camper 经历而不污染深山 mapState", progress.adventureMemories.stationRecordsRecovered === 1 && progress.mapStates.deepMountain.rangerCluesFound === 0 && progress.mapStates.fogRainforest.stationResearchStage === 4, JSON.stringify({ memories: progress.adventureMemories, maps: progress.mapStates }));

progress.adventureMemories.seriousFalls = 1;
progress.adventureMemories.rescuedSomeone = 2;
progress.adventureMemories.supernaturalEncounters = 3;
progress.adventureMemories.animalTrust = 2;
const cautiousCanopyOutcome = outcome("rareBad");
const cautiousCanopy = advance(makeTrip("followChangingVines", "canopyOldWay"), "canopyWalkway", "testSupports", cautiousCanopyOutcome);
const rescueBeacon = advance(makeTrip("traceStationRecords", "abandonedSurveyZone"), "lostSupplyBeacon", "countFlashes", outcome("mixed"));
const familiarSymbol = advance(makeTrip("studyLuminousPlants", "vineThicket"), "symbolStone", "copySymbol", outcome("mixed"));
const trustedFrogs = advance(makeTrip("recoverLostSupplies", "riverWetlands"), "frogChorus", "listenPattern", outcome("good"));
check("深山经历改变雨林高处、救援、异常与动物气泡", cautiousCanopy.context.chainId === "crossMapFallMemory" && cautiousCanopyOutcome.tier === "mixed" && rescueBeacon.context.chainId === "crossMapRescueMemory" && familiarSymbol.context.chainId === "crossMapAnomalyMemory" && trustedFrogs.context.chainId === "crossMapAnimalMemory", JSON.stringify({ canopy: cautiousCanopy.context, beacon: rescueBeacon.context, symbol: familiarSymbol.context, frogs: trustedFrogs.context }));

const memoryTrip = makeTrip("followChangingVines", "canopyOldWay");
memoryTrip.eventFlags = { crossedCanopy: true, sawRainforestSymbol: true, recoveredStationRecord: true };
memoryTrip.events = [{ eventId: "canopyWalkway", outcomeTier: "good" }, { eventId: "symbolStone", outcomeTier: "good" }, { eventId: "fieldNotebook", outcomeTier: "good" }];
runtime.applyAdventureTripMemories(memoryTrip, progress);
check("雨林三类低成本经历跨地图共享且有上限", progress.adventureMemories.canopyCrossings === 1 && progress.adventureMemories.stationRecordsRecovered === 2 && progress.adventureMemories.sharedSymbolEncounters === 1 && runtime.sanitizeAdventureMemories({ canopyCrossings: 999, stationRecordsRecovered: -2, sharedSymbolEncounters: 500 }).canopyCrossings === 99, JSON.stringify(progress.adventureMemories));

const bounded = runtime.sanitizeAdventureMapStates({ fogRainforest: { trailSaturation: 99, vineRouteState: -4, stationResearchStage: 99, insectPressure: -99, wetlandKnowledge: 99, luminousPlantStudies: -2, recurringEncounters: { muddyCrossing: 999, fakeEvent: 3 } } });
check("雨林长期状态具有边界且过滤未知事件", bounded.fogRainforest.trailSaturation === 3 && bounded.fogRainforest.vineRouteState === 0 && bounded.fogRainforest.stationResearchStage === 4 && bounded.fogRainforest.insectPressure === -2 && bounded.fogRainforest.wetlandKnowledge === 4 && bounded.fogRainforest.luminousPlantStudies === 0 && bounded.fogRainforest.recurringEncounters.muddyCrossing === 99 && !("fakeEvent" in bounded.fogRainforest.recurringEncounters), JSON.stringify(bounded.fogRainforest));

const oldSave = runtime.sanitizeAdventureProgress({ version: 5, storage: { fieldLantern: 1 }, stamina: { value: 73, updatedAt: Date.now() }, unlockedMaps: ["deepMountain"], mapStates: { deepMountain: { bridgeRepaired: true } }, adventureMemories: {}, unlockedRoutes: ["deepMountain"], discoveredKeyItems: [], discoveredClues: [], clueStages: {}, crossMapMysteryFlags: {}, pendingBackpack: {}, pendingLoot: {}, recentAdventureHistory: [] });
check("v5 旧档升级时补雨林状态且保留深山与库存", oldSave.version === 10 && oldSave.storage.fieldLantern === 1 && oldSave.mapStates.deepMountain.bridgeRepaired && oldSave.mapStates.fogRainforest.stationResearchStage === 0 && oldSave.adventureMemories.canopyCrossings === 0 && oldSave.adventureMemories.stationRecordsRecovered === 0 && oldSave.adventureMemories.sharedSymbolEncounters === 0 && oldSave.unlockedMaps.join("|") === "deepMountain", JSON.stringify({ version: oldSave.version, storage: oldSave.storage, maps: oldSave.mapStates, memories: oldSave.adventureMemories, unlockedMaps: oldSave.unlockedMaps }));

const interruptedProgress = runtime.createDefaultAdventureProgress(Date.now());
interruptedProgress.unlockedMaps.push("fogRainforest");
interruptedProgress.storage.ropeKit = 0;
interruptedProgress.pendingBackpack = { "item:ropeKit": 1 };
interruptedProgress.pendingLoot = { "item:luminousSpore": 2 };
interruptedProgress.pendingTripSnapshot = { mapId: "fogRainforest", routeId: "riverWetlands", adventureHook: { id: "recoverLostSupplies", title: "被水冲走的补给", intro: "河岸仍有绑带。", relatedEventIds: ["flashFloodDebris"], source: "recentHistory" } };
runtime.setProgress(interruptedProgress);
runtime.setTrip(null);
const recoveredFogTrip = runtime.recoverInterruptedAdventureBackpack();
const secondFogRecovery = runtime.recoverInterruptedAdventureBackpack();
check("雾雨林中断恢复返还 backpack、loot 与同一 hook 且不复制", recoveredFogTrip.mapId === "fogRainforest" && recoveredFogTrip.routeId === "riverWetlands" && recoveredFogTrip.adventureHook.id === "recoverLostSupplies" && interruptedProgress.storage.ropeKit === 1 && interruptedProgress.storage.luminousSpore === 2 && Object.keys(interruptedProgress.pendingBackpack).length === 0 && Object.keys(interruptedProgress.pendingLoot).length === 0 && secondFogRecovery === null && interruptedProgress.storage.ropeKit === 1 && interruptedProgress.storage.luminousSpore === 2, JSON.stringify({ recoveredFogTrip, storage: interruptedProgress.storage, secondFogRecovery }));

runtime.setProgress(progress);

const routeHookCounts = {};
routeIds.forEach((routeId) => {
  routeHookCounts[routeId] = {};
  for (let index = 0; index < 1200; index += 1) {
    const hook = runtime.chooseAdventureHook("fogRainforest", routeId, progress, {}, "");
    routeHookCounts[routeId][hook.id] = (routeHookCounts[routeId][hook.id] || 0) + 1;
  }
});
check("路线只抽取适合当前路线的自动契机", routeIds.every((routeId) => Object.keys(routeHookCounts[routeId]).every((hookId) => map.adventureHooks[hookId].routeIds.includes(routeId))), JSON.stringify(routeHookCounts));

const stationEnding = runtime.createAdventureHookEnding(trip, { status: "found", score: 5 });
check("日志使用有所发现而非任务成功失败", stationEnding.includes("终端") && !/成功|失败|任务|奖励/.test(stationEnding), stationEnding);
const disallowedMapBranches = (systemSource.match(/mapId\s*={2,3}\s*["'][^"']+["']/g) || []).filter((fragment) => fragment !== 'mapId === "fogRainforest"');
check("引擎没有新增雾雨林状态机分支", disallowedMapBranches.length === 0, disallowedMapBranches.join(", "));

const failed = checks.filter((entry) => !entry.passed);
console.table(checks);
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length, routeDistribution: distribution }, null, 2));
if (failed.length) {
  console.error("Failed checks", failed);
  process.exitCode = 1;
}
