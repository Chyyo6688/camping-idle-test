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
const systemSource = fs.readFileSync(path.join(root, "js", "systems", "gameAdventurePrototype.js"), "utf8");
const partySource = fs.readFileSync(path.join(root, "js", "systems", "adventure", "adventureParty.js"), "utf8");
const checks = [];

function check(name, condition, detail) {
  checks.push({ name, passed: Boolean(condition), detail: detail || "" });
}

const configSandbox = {};
vm.runInNewContext(configSources + `
globalThis.__data = {
  capacity: ADVENTURE_BACKPACK_CAPACITY,
  catalog: ADVENTURE_ITEM_CATALOG,
  rules: ADVENTURE_ITEM_RULES,
  duplicatePool: ADVENTURE_DUPLICATE_REWARD_POOL,
  requirements: ADVENTURE_REACTION_ITEM_REQUIREMENTS,
  solutions: ADVENTURE_ITEM_SOLUTION_EFFECTS,
  consequences: ADVENTURE_EVENT_CONSEQUENCES,
  fogConsequences: FOG_RAINFOREST_ADVENTURE_MAP.eventConsequences,
  missing: ADVENTURE_MISSING_ITEM_FEEDBACK,
  events: DEEP_MOUNTAIN_ADVENTURE_EVENTS,
  deepRoutes: DEEP_MOUNTAIN_ADVENTURE_ROUTES,
  rainforestRoutes: FOG_RAINFOREST_ADVENTURE_MAP.routes,
  keyClues: ADVENTURE_KEY_CLUE_CATALOG,
  deepItemPool: DEEP_MOUNTAIN_ADVENTURE_MAP.itemPool,
  rainforestItemPool: FOG_RAINFOREST_ADVENTURE_MAP.itemPool,
  saveVersion: ADVENTURE_SAVE_VERSION,
  starterMigrationVersion: ADVENTURE_STARTER_KIT_MIGRATION_VERSION
};`, configSandbox);
const data = configSandbox.__data;

function solutionEventsFor(requirement) {
  const ids = [];
  Object.keys(data.requirements).forEach((eventId) => {
    Object.keys(data.requirements[eventId]).forEach((reactionId) => {
      if (data.requirements[eventId][reactionId].includes(requirement) && data.solutions[eventId + ":" + reactionId]) ids.push(eventId);
    });
  });
  return Array.from(new Set(ids));
}

check("背包容量严格为 5", data.capacity === 5, String(data.capacity));
check("12 种深山旧物品与 6 种雨林物品均完整", Object.keys(data.catalog).length === 18 && data.deepItemPool.length === 12 && data.rainforestItemPool.length === 6, Object.keys(data.catalog).join(", "));
check("冒险存档升级为 v9", data.saveVersion === 9, String(data.saveVersion));
check("启动装备迁移有独立版本", data.starterMigrationVersion === 1, String(data.starterMigrationVersion));
check("关键路线图线索声明完整", ["rangerLeafRouteMark", "southSupplyCode", "oldForestryCoordinate", "dampSurveyRouteMap"].every((clueId) => data.keyClues[clueId]), Object.keys(data.keyClues).join(", "));
const routeResources = JSON.stringify(data.deepRoutes) + JSON.stringify(data.rainforestRoutes);
const rewardEffects = JSON.stringify(data.consequences) + JSON.stringify(data.fogConsequences);
check("地图路线声明原料和菜谱资源池", ["wildMushroom", "wildOnion", "pineNut", "rainGinger", "sourBerry", "aromaticLeaf", "rainforestMushroom"].every((id) => routeResources.includes(id)) && ["wildMushroomFishSoup", "pineNutGrilledFish", "rainforestSourFishSoup", "aromaticLeafGrilledFish", "wildGingerMushroomSoup"].every((id) => routeResources.includes(id)), routeResources);
check("原料与菜谱来自事件效果配置", rewardEffects.includes('"type":"gainIngredient"') && rewardEffects.includes('"type":"unlockRecipe"') && ["wildMushroom", "pineNut", "rainGinger", "aromaticLeaf", "rainforestMushroom"].every((id) => rewardEffects.includes(id)), rewardEffects.slice(0, 300));

const expectedLimits = {
  ropeKit: Infinity, fieldLantern: 1, firstAidPouch: Infinity, oldKey: 3,
  sealedLetter: 1, repairToolkit: 1, mountainHerb: Infinity, trailMap: 1,
  silverCompass: 1, forestCharm: 1, rangerToken: 1, trailRation: Infinity,
  vineCutter: 1, insectRepellent: Infinity, luminousSpore: Infinity,
  pressedFernSpecimen: 1, stationPass: 1, rainCape: 1
};
Object.keys(expectedLimits).forEach((itemId) => {
  check(itemId + " 持有上限", data.rules[itemId].maxOwned === expectedLimits[itemId], String(data.rules[itemId].maxOwned));
});

const watchtowerSources = [];
Object.keys(data.rules).forEach((itemId) => {
  if (data.rules[itemId].unlockLocationId === "watchtowerRoute") watchtowerSources.push("item:" + itemId);
});
Object.keys(data.solutions).forEach((solutionId) => {
  if (data.solutions[solutionId].unlockLocationId === "watchtowerRoute") watchtowerSources.push("solution:" + solutionId);
});
Object.keys(data.consequences).forEach((eventId) => {
  Object.keys(data.consequences[eventId]).forEach((tier) => {
    data.consequences[eventId][tier].forEach((effect) => {
      if (effect.type === "unlock" && effect.locationId === "watchtowerRoute") watchtowerSources.push("outcome:" + eventId + ":" + tier);
    });
  });
});
check("旧瞭望塔只由封蜡信件解锁", JSON.stringify(watchtowerSources) === JSON.stringify(["item:sealedLetter"]), watchtowerSources.join(", "));
check("木屋不再直接解锁旧瞭望塔", !JSON.stringify(data.consequences.abandonedCabin).includes("watchtowerRoute"), JSON.stringify(data.consequences.abandonedCabin));
check("木屋稳定来源包含急救包", ["rareGood", "good"].every((tier) => data.consequences.abandonedCabin[tier].some((effect) => effect.itemId === "firstAidPouch")), "rareGood + good");
check("呼救成功来源包含急救包", ["rareGood", "good"].every((tier) => data.consequences.distantCry[tier].some((effect) => effect.itemId === "firstAidPouch")), "rareGood + good");
check("重复奖励池多样且包含急救包", data.duplicatePool.length >= 6 && data.duplicatePool.some((entry) => entry.itemId === "firstAidPouch") && new Set(data.duplicatePool.map((entry) => entry.type)).size >= 3, JSON.stringify(data.duplicatePool));
check("钥匙具有明确开箱优先级", JSON.stringify(data.solutions["lockedChest:useTools"].requirementPriority) === JSON.stringify(["oldKey", "repairToolkit"]), JSON.stringify(data.solutions["lockedChest:useTools"]));
check("绳组与急救包属于救援不同阶段", data.requirements.distantCry.prepareAid[0] === "ropeKit" && data.solutions["distantCry:prepareAid"].followUpRequirements[0] === "firstAidPouch", JSON.stringify(data.requirements.distantCry));
check("木章不再承担路线解锁", !data.solutions["distantCry:showRangerToken"].unlockLocationId, JSON.stringify(data.solutions["distantCry:showRangerToken"]));
check("地图与指南针用途区分", solutionEventsFor("trailMap").includes("hiddenFork") && solutionEventsFor("silverCompass").includes("lostBeforeDark"), solutionEventsFor("trailMap") + " / " + solutionEventsFor("silverCompass"));
check("护符接入异常脚步和白影", ["forestFootsteps", "whiteShadow"].every((id) => solutionEventsFor("forestCharm").includes(id)), solutionEventsFor("forestCharm").join(", "));
check("途中获得使用 trip.loot", systemSource.includes("addAdventureLoot(trip") && systemSource.includes("progress.pendingLoot = cloneAdventureCountMap(trip.loot)"), "loot persistence hooks");
check("日志区分出发携带与发现", systemSource.includes("departedWith") && systemSource.includes("adventureLogDeparted"), "departedWith + gained");
check("隐藏岔路无地图不会被硬阻断", systemSource.includes('eventDefinition.id === "hiddenFork"') && systemSource.includes("return null"), "missing opportunity bypass");

let randomQueue = [];
const controlledMath = Object.create(Math);
controlledMath.random = function() { return randomQueue.length ? randomQueue.shift() : 0.72; };
const runtimeSandbox = {
  console: { log() {}, info() {}, warn() {}, error() {}, groupCollapsed() {}, groupEnd() {}, table() {} },
  document: {
    getElementById() { return null; }, addEventListener() {}, createElement() { return null; },
    body: { classList: { add() {}, remove() {} } }
  },
  CAMPER_IDLE_FRAME_NAME: "camper_idle.png",
  CAMPER_TRAIT_KEYS: ["courage", "curiosity", "sociability", "preparedness", "observation", "rationality", "responsibility", "comfortSeeking"],
  fishCatalog: { testFish: { displayName: "测试鱼", rarityLabel: "普通", image: "fish.png" } },
  mealCatalog: { testMeal: { displayName: "测试料理", detail: "热食", image: "meal.png" } },
  gameState: { inventory: { fish: {}, meals: {} }, adventure: null, dailyAdventureModifiers: {}, camperProfile: null },
  saveGame() {}, Date, Math: controlledMath, JSON, Object, Array, Number, String, Boolean, Infinity
};
runtimeSandbox.window = runtimeSandbox;
runtimeSandbox.window.setTimeout = function() { return 0; };
runtimeSandbox.window.clearTimeout = function() {};
runtimeSandbox.window.setInterval = function() { return 0; };
runtimeSandbox.window.clearInterval = function() {};
runtimeSandbox.window.requestAnimationFrame = function() {};
runtimeSandbox.window.addEventListener = function() {};

vm.runInNewContext(configSources + "\n" + partySource + "\n" + systemSource + `
globalThis.__runtime = {
  createDefaultAdventureProgress, sanitizeAdventureProgress, getAdventureReactionCandidates,
  getAdventureMissingItemOpportunity, getCarriedButUnusedItemNotes, resolveAdventureOutcome, applyAdventureConsequences,
  grantAdventureItem, getAdventureCountTotal, recoverInterruptedAdventureBackpack,
  eventById(id) { return DEEP_MOUNTAIN_ADVENTURE_EVENTS.find((eventDefinition) => eventDefinition.id === id); },
  setTrip(trip) { adventurePrototypeState.trip = trip; },
  getTrip() { return adventurePrototypeState.trip; },
  getRecoveredTripSnapshot() { return adventurePrototypeState.recoveredTripSnapshot; },
  setProgress(progress) { gameState.adventure = progress; },
  getProgress() { return gameState.adventure; }
};`, runtimeSandbox);
const runtime = runtimeSandbox.__runtime;
const neutralSnapshot = {
  finalTraits: Object.fromEntries(runtimeSandbox.CAMPER_TRAIT_KEYS.map((traitId) => [traitId, 50])),
  dailyAdventureModifiers: { generalLuck: 0, treasureLuck: 0, socialLuck: 0, healthLuck: 0, dangerSense: 0 }
};

function makeTrip(backpack) {
  return {
    backpack: { ...backpack }, departedWith: { ...backpack }, loot: {}, gained: {}, lost: {}, consumed: {},
    unlocked: [], statuses: [], events: [], staminaEventDelta: 0, staminaStart: 50
  };
}

function resetProgress(stamina) {
  const progress = runtime.createDefaultAdventureProgress(Date.now());
  progress.stamina.value = stamina === undefined ? 50 : stamina;
  runtime.setProgress(progress);
  return progress;
}

function eventReaction(eventId, reactionId) {
  return runtime.eventById(eventId).reactions.find((entry) => entry.id === reactionId);
}

function applyResolved(eventId, reactionId, backpack, stamina) {
  const progress = resetProgress(stamina);
  const trip = makeTrip(backpack);
  runtime.setTrip(trip);
  const event = runtime.eventById(eventId);
  const selectedReaction = eventReaction(eventId, reactionId);
  const outcome = runtime.resolveAdventureOutcome(event, selectedReaction, neutralSnapshot, trip.backpack);
  const consequence = runtime.applyAdventureConsequences(event, selectedReaction, outcome);
  return { progress, trip, event, outcome, consequence };
}

let scenario = applyResolved("abandonedCabin", "lightLantern", { "item:fieldLantern": 1 }, 50);
check("1 新档提灯探屋可正常获得工具套组", scenario.outcome.tier === "rareGood" && scenario.trip.loot["item:repairToolkit"] === 1 && scenario.trip.loot["item:firstAidPouch"] === 1, JSON.stringify({ tier: scenario.outcome.tier, loot: scenario.trip.loot }));
check("2 木屋结果未解锁旧瞭望塔", !scenario.progress.unlockedRoutes.includes("watchtowerRoute"), scenario.progress.unlockedRoutes.join(", "));

scenario = applyResolved("lockedChest", "useTools", { "item:oldKey": 1 }, 50);
check("3 钥匙完整开箱产出并归档信件", scenario.outcome.tier === "rareGood" && scenario.outcome.itemSolution.requirement === "oldKey" && scenario.trip.consumed["item:oldKey"] === 1 && scenario.progress.discoveredKeyItems.includes("sealedLetter") && scenario.progress.unlockedRoutes.includes("watchtowerRoute"), JSON.stringify({ tier: scenario.outcome.tier, consumed: scenario.trip.consumed, discovered: scenario.progress.discoveredKeyItems }));

let oldUnlocked = runtime.sanitizeAdventureProgress({
  version: 2, storage: { fieldLantern: 1 }, stamina: { value: 60, updatedAt: Date.now() },
  unlockedLocations: ["deepMountain", "watchtowerRoute"], pendingBackpack: {}, lastLog: null
});
runtime.setProgress(oldUnlocked);
let trip = makeTrip({ "item:oldKey": 1 });
runtime.setTrip(trip);
let messages = [], feedback = [], notes = [];
runtime.grantAdventureItem(trip, "sealedLetter", 1, messages, feedback, notes);
check("4 旧档路线已开仍可归档信件一次", oldUnlocked.discoveredKeyItems.includes("sealedLetter") && trip.gained["item:sealedLetter"] === 1 && oldUnlocked.unlockedRoutes.filter((id) => id === "watchtowerRoute").length === 1 && !messages.some((text) => text.startsWith("解锁")), notes.join(" | "));

scenario = applyResolved("abandonedCabin", "lightLantern", { "item:fieldLantern": 1 }, 50);
check("5 急救包消耗后可由木屋再生", scenario.trip.loot["item:firstAidPouch"] === 1, JSON.stringify(scenario.trip.loot));

const keyScenario = applyResolved("lockedChest", "useTools", { "item:oldKey": 1 }, 50);
const toolScenario = applyResolved("lockedChest", "useTools", { "item:repairToolkit": 1 }, 50);
check("6 钥匙与工具撬箱结果明显不同", keyScenario.outcome.tier === "rareGood" && toolScenario.outcome.tier === "good" && keyScenario.trip.consumed["item:oldKey"] === 1 && toolScenario.trip.backpack["item:repairToolkit"] === 1 && toolScenario.progress.stamina.value === 48, JSON.stringify({ key: keyScenario.outcome.tier, tool: toolScenario.outcome.tier, toolStamina: toolScenario.progress.stamina.value }));

scenario = applyResolved("lockedChest", "useTools", { "item:oldKey": 1, "item:repairToolkit": 1 }, 50);
check("7 同带钥匙和工具时显式优先钥匙", scenario.outcome.itemSolution.requirement === "oldKey" && scenario.trip.consumed["item:oldKey"] === 1 && scenario.trip.backpack["item:repairToolkit"] === 1 && scenario.consequence.itemNotes.some((note) => note.includes("没有受到损坏")), scenario.consequence.itemNotes.join(" | "));

const rescue = runtime.eventById("distantCry");
let candidates = runtime.getAdventureReactionCandidates(rescue, neutralSnapshot, { "item:firstAidPouch": 1 });
const aidOnly = candidates.find((entry) => entry.reaction.id === "treatInjury");
const ropeOnly = runtime.getAdventureReactionCandidates(rescue, neutralSnapshot, { "item:ropeKit": 1 }).find((entry) => entry.reaction.id === "prepareAid");
check("8 绳组负责抵达，急救包只负责伤口", aidOnly.weight > 0 && ropeOnly.weight > 0 && data.solutions["distantCry:treatInjury"].forcedTier === "mixed", JSON.stringify({ aid: aidOnly.weight, rope: ropeOnly.weight }));

scenario = applyResolved("distantCry", "prepareAid", { "item:ropeKit": 1, "item:firstAidPouch": 1 }, 50);
candidates = runtime.getAdventureReactionCandidates(rescue, neutralSnapshot, { "item:ropeKit": 1, "item:firstAidPouch": 1 });
const combinedUnusedNotes = runtime.getCarriedButUnusedItemNotes({ candidates }, eventReaction("distantCry", "prepareAid"), scenario.outcome);
check("9 绳组与急救包可连续发挥作用", scenario.outcome.itemSolution.isCombined && scenario.outcome.tier === "rareGood" && scenario.trip.backpack["item:ropeKit"] === 1 && scenario.trip.consumed["item:firstAidPouch"] === 1 && candidates.find((entry) => entry.reaction.id === "treatInjury").weight === 0 && !combinedUnusedNotes.some((note) => note.includes("急救包")), scenario.consequence.itemNotes.concat(combinedUnusedNotes).join(" | "));

const rainCapeScenario = applyResolved("suddenDownpour", "buildCover", { "item:rainCape": 1, "item:ropeKit": 1 }, 50);
check("雨林雨披带回深山后优先形成暴雨变体", rainCapeScenario.outcome.itemSolution.requirement === "rainCape" && rainCapeScenario.outcome.text.includes("雾雨林") && rainCapeScenario.trip.backpack["item:rainCape"] === 1 && rainCapeScenario.trip.backpack["item:ropeKit"] === 1, JSON.stringify({ solution: rainCapeScenario.outcome.itemSolution, text: rainCapeScenario.outcome.text }));

const vineCutterScenario = applyResolved("snaredAnimal", "cutSnare", { "item:vineCutter": 1, "item:repairToolkit": 1 }, 50);
check("雨林藤切刀带回深山后优先形成套索变体", vineCutterScenario.outcome.itemSolution.requirement === "vineCutter" && vineCutterScenario.outcome.text.includes("藤切刀") && vineCutterScenario.trip.backpack["item:vineCutter"] === 1 && vineCutterScenario.trip.backpack["item:repairToolkit"] === 1, JSON.stringify({ solution: vineCutterScenario.outcome.itemSolution, text: vineCutterScenario.outcome.text }));
check("返场物品不混入深山当地掉落池", !data.deepItemPool.includes("rainCape") && !data.deepItemPool.includes("vineCutter"), data.deepItemPool.join(", "));

let progress = resetProgress(50);
trip = makeTrip({ "item:trailRation": 5 });
runtime.setTrip(trip);
messages = []; feedback = []; notes = [];
runtime.grantAdventureItem(trip, "sealedLetter", 1, messages, feedback, notes);
runtime.grantAdventureItem(trip, "mountainHerb", 1, messages, feedback, notes);
check("10 出发背包 5/5 仍可获得线索和普通战利品", runtime.getAdventureCountTotal(trip.backpack) === 5 && progress.discoveredKeyItems.includes("sealedLetter") && trip.gained["item:sealedLetter"] === 1 && trip.loot["item:mountainHerb"] === 1, JSON.stringify({ backpack: trip.backpack, loot: trip.loot, discovered: progress.discoveredKeyItems }));

progress = resetProgress(40);
progress.storage.fieldLantern = 1;
const replacementKinds = new Set();
[0.01, 0.2, 0.38, 0.55, 0.74, 0.95].forEach((roll) => {
  trip = makeTrip({}); runtime.setTrip(trip); messages = []; feedback = []; notes = []; randomQueue = [roll];
  const staminaBefore = progress.stamina.value;
  runtime.grantAdventureItem(trip, "fieldLantern", 1, messages, feedback, notes);
  if (Object.keys(trip.loot).length) replacementKinds.add("item:" + Object.keys(trip.loot)[0]);
  else if (progress.stamina.value > staminaBefore) replacementKinds.add("stamina");
  else replacementKinds.add("text");
});
check("11 唯一物品重复奖励实际覆盖多种结果", replacementKinds.size >= 5 && replacementKinds.has("item:item:firstAidPouch") && replacementKinds.has("stamina") && replacementKinds.has("text"), Array.from(replacementKinds).join(", "));

const migratedOnce = runtime.sanitizeAdventureProgress({
  version: 2, storage: {}, stamina: { value: 70, updatedAt: Date.now() }, unlockedLocations: ["deepMountain"], pendingBackpack: {}, lastLog: null
});
check("12 空仓库旧档一次性补最低启动装备", migratedOnce.storage.fieldLantern === 1 && migratedOnce.storage.ropeKit === 1 && migratedOnce.storage.trailRation === 1 && migratedOnce.adventureStarterKitMigrationVersion === 1, JSON.stringify(migratedOnce.storage));
const clearedAfterMigration = runtime.sanitizeAdventureProgress({ ...migratedOnce, storage: {}, pendingBackpack: {}, pendingLoot: {} });
check("13 后续清空仓库不会再次免费补充", Object.keys(clearedAfterMigration.storage).length === 0 && clearedAfterMigration.adventureStarterKitMigrationVersion === 1, JSON.stringify(clearedAfterMigration.storage));

progress = resetProgress(50);
progress.pendingBackpack = { "item:ropeKit": 1, "fish:testFish": 1 };
progress.pendingLoot = { "item:firstAidPouch": 1, "meal:testMeal": 1 };
progress.pendingTripSnapshot = {
  mapId: "deepMountain",
  routeId: "denseForest",
  adventureHook: { id: "investigateWhiteShadow", title: "树林中的白影", intro: "雾里还有痕迹。", relatedEventIds: ["whiteShadow"], source: "routeRumor" }
};
runtime.setTrip(null);
const recovered = runtime.recoverInterruptedAdventureBackpack();
check("14 刷新中断可恢复 backpack、loot 与 hook 且不复制", recovered && recovered.adventureHook.id === "investigateWhiteShadow" && runtime.getRecoveredTripSnapshot().adventureHook.title === "树林中的白影" && progress.storage.ropeKit === 2 && progress.storage.firstAidPouch === 2 && runtimeSandbox.gameState.inventory.fish.testFish === 1 && runtimeSandbox.gameState.inventory.meals.testMeal === 1 && Object.keys(progress.pendingBackpack).length === 0 && Object.keys(progress.pendingLoot).length === 0 && !progress.pendingTripSnapshot && !runtime.recoverInterruptedAdventureBackpack(), JSON.stringify({ recovered, storage: progress.storage, fish: runtimeSandbox.gameState.inventory.fish, meals: runtimeSandbox.gameState.inventory.meals }));

const hiddenFork = runtime.eventById("hiddenFork");
const noMapSelection = { candidates: runtime.getAdventureReactionCandidates(hiddenFork, neutralSnapshot, {}) };
check("15 无地图仍可偶然发现岔路，不形成自依赖", runtime.getAdventureMissingItemOpportunity(hiddenFork, noMapSelection, resetProgress()) === null && noMapSelection.candidates.some((entry) => !entry.requirements.length && entry.weight > 0), noMapSelection.candidates.map((entry) => entry.reaction.id + ":" + entry.weight).join(", "));

const failed = checks.filter((entry) => !entry.passed);
console.table(checks);
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length }, null, 2));
if (failed.length) {
  console.error("Failed checks:", failed);
  process.exitCode = 1;
}
