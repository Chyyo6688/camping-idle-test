const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const configSource = fs.readFileSync(path.join(root, "js/config/adventurePrototypeConfig.js"), "utf8");
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

vm.runInNewContext(configSource + "\n" + systemSource + `
globalThis.__storyRuntime = {
  goals: DEEP_MOUNTAIN_ADVENTURE_GOALS,
  routes: DEEP_MOUNTAIN_ADVENTURE_ROUTES,
  events: DEEP_MOUNTAIN_ADVENTURE_EVENTS,
  createDefaultAdventureProgress,
  sanitizeAdventureProgress,
  chooseNextAdventureEvent,
  evaluateAdventureGoalProgress,
  applyAdventureStoryContext,
  updateAdventureEventFlags,
  resolveAdventureGoalResult,
  applyAdventureGoalReward,
  createAdventureStoryIntro,
  createAdventureGoalEnding,
  isDeepMountainRouteUnlocked,
  setTrip(trip) { adventurePrototypeState.trip = trip; },
  setSeen(ids) { adventurePrototypeState.seenEventIds = ids.slice(); },
  setProgress(progress) { gameState.adventure = progress; },
  getProgress() { return gameState.adventure; }
};`, sandbox);

const runtime = sandbox.__storyRuntime;
const neutralSnapshot = { dailyAdventureModifiers: { dangerSense: 0 } };
function makeTrip(goalId, routeId) {
  return {
    goalId, routeId, eventFlags: {}, goalProgress: { score: 0, status: "incomplete" }, storyBeats: [],
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

check("5 个目标完整定义", Object.keys(runtime.goals).length === 5 && Object.values(runtime.goals).every((goal) => goal.relatedEvents.length >= 4 && goal.endings.complete && goal.endings.partial && goal.endings.incomplete), Object.keys(runtime.goals).join(", "));
check("4 条路线完整定义", Object.keys(runtime.routes).length === 4 && Object.values(runtime.routes).every((route) => route.unlockAny.length && Object.keys(route.eventWeights).length >= 7), Object.keys(runtime.routes).join(", "));

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

trip = makeTrip("investigateWhiteShadow", "denseForest");
advance(trip, "forestFootsteps", "findCause", outcome("mixed"));
const shadowContext = advance(trip, "whiteShadow", "speakToGhost", outcome("good"));
const guidedContext = advance(trip, "lostBeforeDark", "retraceSteps", outcome("good"));
check("白影链改变后续气泡与结果", trip.eventFlags.sawWhiteShadow && trip.eventFlags.whiteShadowTrust > 0 && trip.eventFlags.whiteShadowGuided && shadowContext.context.bubble.includes("脚步声") && guidedContext.context.result.includes("引回"), guidedContext.context.bubble + " / " + guidedContext.context.result);

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

const whitePathA = makeTrip("investigateWhiteShadow", "denseForest");
whitePathA.eventFlags = { heardStrangeFootsteps: true, sawWhiteShadow: true, whiteShadowResolved: true };
const whitePathB = makeTrip("investigateWhiteShadow", "denseForest");
whitePathB.eventFlags = { sawWhiteShadow: true, whiteShadowGuided: true };
check("同一目标至少两条完成路径", runtime.evaluateAdventureGoalProgress(whitePathA).status === "complete" && runtime.evaluateAdventureGoalProgress(whitePathB).status === "complete", JSON.stringify([runtime.evaluateAdventureGoalProgress(whitePathA), runtime.evaluateAdventureGoalProgress(whitePathB)]));

const noToolTrip = makeTrip("findWatchtowerClue", "abandonedRangerRoad");
noToolTrip.eventFlags = { foundLockedChest: true };
check("缺关键物仍可部分推进", runtime.evaluateAdventureGoalProgress(noToolTrip).status === "partial", JSON.stringify(runtime.evaluateAdventureGoalProgress(noToolTrip)));

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
  progress.recentAdventureHistory.push({ goalId: trip.goalId, routeId: trip.routeId, eventIds: combo, outcomeType: "partial", createdAt: Date.now() + run });
  progress.recentAdventureHistory = progress.recentAdventureHistory.slice(-8);
}
let consecutiveDuplicates = 0;
for (let index = 1; index < combinations.length; index += 1) if (combinations[index] === combinations[index - 1]) consecutiveDuplicates += 1;
check("连续同目标组合不会完全重复", consecutiveDuplicates === 0 && new Set(combinations).size >= 20, JSON.stringify({ unique: new Set(combinations).size, consecutiveDuplicates }));

trip = makeTrip("investigateWildlife", "creekValley");
advance(trip, "animalTracks", "followTracks", outcome("good"));
advance(trip, "forestFootsteps", "readTracks", outcome("good"));
const intro = runtime.createAdventureStoryIntro(trip);
check("日志故事具备开头和连续叙述", intro.includes("溪谷路线") && intro.includes("调查山中的野生动物") && trip.storyBeats.length === 2 && trip.storyBeats[1].includes("继续深入后"), intro + " / " + trip.storyBeats.join(" "));
const contextualEnding = runtime.createAdventureGoalEnding(trip, { status: "complete", score: 3 });
check("目标结尾只引用本趟实际线索", contextualEnding.includes("脚印") && contextualEnding.includes("树林") && !contextualEnding.includes("食物"), contextualEnding);

progress = runtime.createDefaultAdventureProgress(Date.now());
runtime.setProgress(progress);
trip = makeTrip("investigateWildlife", "creekValley");
trip.eventFlags = { foundAnimalTracks: true, observedAnimal: true };
const goalResult = runtime.resolveAdventureGoalResult(trip);
const rewardNotes = runtime.applyAdventureGoalReward(trip, goalResult);
check("目标奖励进入独立 loot 并可安全结算", goalResult.status === "complete" && trip.loot["item:mountainHerb"] === 1 && trip.gained["item:mountainHerb"] === 1 && rewardNotes.length > 0, JSON.stringify({ goalResult, loot: trip.loot, rewardNotes }));

const migrated = runtime.sanitizeAdventureProgress({ version: 3, storage: { fieldLantern: 1 }, stamina: { value: 70, updatedAt: Date.now() }, unlockedRoutes: ["deepMountain"], discoveredKeyItems: [], pendingBackpack: {}, pendingLoot: {} });
check("旧存档补长期字段且不持久化 eventFlags", migrated.version === 4 && Array.isArray(migrated.discoveredClues) && Array.isArray(migrated.recentAdventureHistory) && !("eventFlags" in migrated), JSON.stringify({ version: migrated.version, clues: migrated.discoveredClues, history: migrated.recentAdventureHistory }));

const failed = checks.filter((entry) => !entry.passed);
console.table(checks);
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length, routeDistribution: distribution }, null, 2));
if (failed.length) {
  console.error("Failed checks", failed);
  process.exitCode = 1;
}
