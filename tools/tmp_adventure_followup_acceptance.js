const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styleSource = fs.readFileSync(path.join(root, "style.css"), "utf8");
const adventureRuntimeSource = fs.readFileSync(path.join(root, "js/systems/gameAdventurePrototype.js"), "utf8");
const gearCatalogSource = fs.readFileSync(path.join(root, "js/config/gearCatalog.js"), "utf8");
const adventureStoryConfigSource = ["js/config/adventure/maps/deepMountain.js", "js/config/adventure/maps/fogRainforest.js"]
  .map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8"))
  .join("\n");
const sources = [
  "js/config/fishingCookingConfig.js",
  "js/config/adventure/adventureItems.js",
  "js/config/adventure/maps/deepMountain.js",
  "js/config/adventure/maps/fogRainforest.js",
  "js/config/adventure/adventureMaps.js",
  "js/systems/adventure/adventureParty.js",
  "js/systems/gameActivities.js",
  "js/systems/gameAdventurePrototype.js"
].map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8")).join("\n");

const checks = [];
function check(name, passed, detail) {
  checks.push({ name, passed: Boolean(passed), detail: detail || "" });
}

const mockAdventureUsedItemVisual = {
  innerHTML: "",
  className: "",
  style: {},
  appendChild() {}
};
const mockGearCatalog = {
  testStove: { id: "testStove", category: "stove", displayName: "测试炉具", scene: {} },
  mistTraceObservationBoard: { id: "mistTraceObservationBoard", category: "activity", displayName: "雾痕观察板", scene: {} },
  oldForestryRouteBoard: { id: "oldForestryRouteBoard", category: "activity", displayName: "旧林务路线板", scene: {} },
  luminousPlantLamp: { id: "luminousPlantLamp", category: "light", displayName: "微光植物灯", scene: {} }
};
function createMockElement() {
  return {
    className: "",
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    appendChild() {},
    setAttribute() {}
  };
}

const sandbox = {
  console: { log() {}, info() {}, warn() {}, error() {}, groupCollapsed() {}, groupEnd() {}, table() {} },
  document: {
    getElementById(id) { return id === "adventureUsedItemVisual" ? mockAdventureUsedItemVisual : null; },
    addEventListener() {},
    createElement() { return createMockElement(); },
    body: { classList: { add() {}, remove() {} } }
  },
  CAMPER_IDLE_FRAME_NAME: "idle.png",
  CAMPER_TRAIT_KEYS: ["courage", "curiosity", "sociability", "preparedness", "observation", "rationality", "responsibility", "comfortSeeking"],
  gameState: {
    inventory: { fish: {}, meals: {}, ingredients: {} },
    cooking: { cooked: 0, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish"] },
    adventure: null,
    dailyAdventureModifiers: {},
    camperProfile: null,
    cozyPoints: 0,
    ownedGear: ["testStove"],
    placedGear: ["testStove"]
  },
  getGearItem(id) { return mockGearCatalog[id] || null; },
  getGearItems() { return Object.keys(mockGearCatalog).map((id) => mockGearCatalog[id]); },
  ownsGear(id, state) { return (state || sandbox.gameState).ownedGear.includes(id); },
  isGearPlaced(id, state) { return (state || sandbox.gameState).placedGear.includes(id); },
  addUniqueGear(ownedGear, id) { if (mockGearCatalog[id] && !ownedGear.includes(id)) ownedGear.push(id); },
  getLocalDateKey() { return "test"; },
  setStatus() {}, showCamperThought() {}, updateScreen() {}, saveGame() {}, closeShop() {}, triggerInteractionSounds() {}, renderShopFromCatalog() {}, setShopFilter() {},
  Date, Math, JSON, Object, Array, Number, String, Boolean, Infinity
};
sandbox.window = sandbox;
sandbox.window.setTimeout = function(callback) { if (typeof callback === "function") callback(); return 0; };
sandbox.window.clearTimeout = function() {};
sandbox.window.setInterval = function() { return 0; };
sandbox.window.clearInterval = function() {};
sandbox.window.requestAnimationFrame = function() {};
sandbox.window.addEventListener = function() {};

vm.runInNewContext(sources + `
globalThis.__followupRuntime = {
  recipes: cookingRecipeCatalog,
  ingredients: ingredientCatalog,
  meals: mealCatalog,
  fish: fishCatalog,
  createDefaultAdventureProgress,
  refreshAdventureStoryStates,
  getAdventureStoryDefinitions,
  getAdventureStoryDefinition,
  getAdventureStoryState,
  createAdventureStoryDefinition,
  getAdventureStoryCorrectOrder,
  isAdventureStoryOrderCorrect,
  getAdventureStoryProgressiveHint,
  shouldPinAdventureStoryFirstClue,
  archiveAdventureStory,
  cookRecipeFromInventory,
  sanitizeCookingProgress,
  chooseAutonomousCookingPlan,
  beginAutonomousCooking,
  completeAutonomousCooking,
  canAutonomouslyCook,
  calculateRecipeCraftableQuantity,
  getInventoryItemCount,
  getCookingProgress,
  getAdventureRecipeEventWeight,
  getGuaranteedAdventureRecipeEvent,
  getEligibleAdventureExplorationRecipes,
  sanitizeAdventureProgress,
  addAdventureInjury,
  getActiveAdventureInjuryIds,
  getAdventureInjuryType,
  consumeAdventureFirstAidForInjuries,
  injuryCatalog: ADVENTURE_INJURY_CATALOG,
  setProgress(progress) { gameState.adventure = progress; },
  setTrip(trip) { adventurePrototypeState.trip = trip; },
  setInventory(inventory) { gameState.inventory = inventory; },
  setCooking(cooking) { gameState.cooking = cooking; },
  getState() { return gameState; }
};`, sandbox);

const runtime = sandbox.__followupRuntime;
const now = Date.now();

runtime.setInventory({ fish: { minnow: 3 }, meals: {}, ingredients: { wildMushroom: 2, wildOnion: 2 } });
runtime.setCooking({ cooked: 0, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish", "wildMushroomFishSoup"] });
const craftable = runtime.calculateRecipeCraftableQuantity(runtime.recipes.wildMushroomFishSoup, "fish:minnow");
const cooked = runtime.cookRecipeFromInventory("wildMushroomFishSoup", "fish:minnow", 2, { skipStationCheck: true });
const cookedState = runtime.getState();
check("烹饪选择按数量扣除鱼与地图原料并生成料理", craftable === 2 && cooked && cookedState.inventory.fish.minnow === 1 && !cookedState.inventory.ingredients.wildMushroom && !cookedState.inventory.ingredients.wildOnion && cookedState.inventory.meals.wildMushroomFishSoup === 2 && cookedState.cooking.cooked === 2, JSON.stringify({ craftable, inventory: cookedState.inventory, cooking: cookedState.cooking }));
check("手动成功制作后永久记录 Camper 已学会菜谱", cookedState.cooking.manuallyCookedRecipes.includes("wildMushroomFishSoup"), JSON.stringify(cookedState.cooking));

const beforeFailedCook = JSON.stringify(cookedState.inventory);
const failedCook = runtime.cookRecipeFromInventory("wildMushroomFishSoup", "fish:minnow", 1, { skipStationCheck: true });
check("材料不足时烹饪不会部分扣除", !failedCook && JSON.stringify(cookedState.inventory) === beforeFailedCook, JSON.stringify(cookedState.inventory));

runtime.setInventory({ fish: {}, meals: {}, ingredients: { rainGinger: 1, rainforestMushroom: 2 } });
runtime.setCooking({ cooked: 0, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish", "wildGingerMushroomSoup"] });
const substituteCooked = runtime.cookRecipeFromInventory("wildGingerMushroomSoup", "ingredient:rainforestMushroom", 1, { skipStationCheck: true });
check("可替代原料能代替鱼且与固定原料一起正确扣除", substituteCooked && !runtime.getState().inventory.ingredients.rainGinger && !runtime.getState().inventory.ingredients.rainforestMushroom && runtime.getState().inventory.meals.wildGingerMushroomSoup === 1, JSON.stringify(runtime.getState().inventory));

runtime.setInventory({ fish: { minnow: 3 }, meals: {}, ingredients: { wildMushroom: 2, wildOnion: 2 } });
runtime.setCooking({ cooked: 1, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish", "wildMushroomFishSoup"], manuallyCookedRecipes: ["wildMushroomFishSoup"], recentAutoCookedRecipes: [] });
const autonomousPlan = runtime.chooseAutonomousCookingPlan();
const autonomousStarted = runtime.beginAutonomousCooking(autonomousPlan);
const autonomousCompleted = runtime.completeAutonomousCooking();
const inventoryAfterAuto = JSON.stringify(runtime.getState().inventory);
const repeatedAutoCompletion = runtime.completeAutonomousCooking();
check("自主做菜只选手动学会且材料足够的菜谱", autonomousPlan && autonomousPlan.recipeId === "wildMushroomFishSoup" && autonomousStarted && autonomousCompleted, JSON.stringify(autonomousPlan));
check("自主做菜一次性扣料产出且重复完成回调不再结算", runtime.getState().inventory.fish.minnow === 2 && runtime.getState().inventory.ingredients.wildMushroom === 1 && runtime.getState().inventory.ingredients.wildOnion === 1 && runtime.getState().inventory.meals.wildMushroomFishSoup === 1 && !repeatedAutoCompletion && JSON.stringify(runtime.getState().inventory) === inventoryAfterAuto, JSON.stringify(runtime.getState()));

runtime.setInventory({ fish: { minnow: 2 }, meals: {}, ingredients: { wildMushroom: 1, wildOnion: 1 } });
runtime.setCooking({ cooked: 0, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish", "wildMushroomFishSoup"], manuallyCookedRecipes: ["wildMushroomFishSoup"], recentAutoCookedRecipes: [] });
const preservedIngredientPlan = runtime.chooseAutonomousCookingPlan();
check("自主选菜不消耗最后一份地图原料并可退回基础烤鱼", preservedIngredientPlan && preservedIngredientPlan.recipeId === "simpleGrilledFish" && runtime.getState().inventory.ingredients.wildMushroom === 1 && runtime.getState().inventory.ingredients.wildOnion === 1, JSON.stringify(preservedIngredientPlan));

runtime.setInventory({ fish: { minnow: 2 }, meals: {}, ingredients: { wildMushroom: 4, wildOnion: 4 } });
runtime.setCooking({ cooked: 0, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish", "wildMushroomFishSoup"], manuallyCookedRecipes: ["simpleGrilledFish"], recentAutoCookedRecipes: [] });
const unlearnedRecipePlan = runtime.chooseAutonomousCookingPlan();
check("未手动制作过的已解锁菜谱不会被自主制作", unlearnedRecipePlan && unlearnedRecipePlan.recipeId === "simpleGrilledFish", JSON.stringify(unlearnedRecipePlan));

runtime.setInventory({ fish: {}, meals: {}, ingredients: {} });
check("完全无法制作时自主行为静默取消且不会生成计划", !runtime.canAutonomouslyCook() && !runtime.completeAutonomousCooking() && sources.includes('options && options.source === "auto"'), "no autonomous plan");
const legacyCooking = runtime.sanitizeCookingProgress({ cooked: 3, unlockedRecipes: ["simpleGrilledFish"] });
check("旧烹饪存档自动补 manuallyCookedRecipes", legacyCooking.manuallyCookedRecipes.join("|") === "simpleGrilledFish", JSON.stringify(legacyCooking));

const storyProgress = runtime.createDefaultAdventureProgress(now);
runtime.setProgress(storyProgress);
runtime.setCooking({ cooked: 0, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish"] });
const rangerStory = runtime.getAdventureStoryDefinition("deepMountain:findMissingRanger");
storyProgress.hookClues.deepMountain.findMissingRanger = rangerStory.clues.map((clue) => clue.id);
runtime.refreshAdventureStoryStates(storyProgress);
const rangerReady = runtime.getAdventureStoryState(storyProgress, rangerStory.id).status === "ready";
const rangerArchived = runtime.archiveAdventureStory(rangerStory.id, rangerStory.clues.map((clue) => clue.id));
check("护林员故事线索收齐后仍等待整理", rangerReady, JSON.stringify(storyProgress.storyStates[rangerStory.id]));
check("故事整理成功后必定解锁故事菜谱", rangerArchived && runtime.getState().cooking.unlockedRecipes.includes("wildMushroomFishSoup") && storyProgress.storyStates[rangerStory.id].status === "archived", JSON.stringify({ cooking: runtime.getState().cooking, story: storyProgress.storyStates[rangerStory.id] }));

const storyGearCases = [
  ["deepMountain:investigateWhiteShadow", "mistTraceObservationBoard", "雾痕观察板"],
  ["deepMountain:findWatchtowerClue", "oldForestryRouteBoard", "旧林务路线板"],
  ["fogRainforest:studyLuminousPlants", "luminousPlantLamp", "微光植物灯"]
];
storyGearCases.forEach(function(entry) {
  const story = runtime.getAdventureStoryDefinition(entry[0]);
  const progress = runtime.createDefaultAdventureProgress(now);
  runtime.setProgress(progress);
  progress.hookClues[story.mapId][story.hookId] = story.clues.map((clue) => clue.id);
  runtime.refreshAdventureStoryStates(progress);
  const archived = runtime.archiveAdventureStory(story.id, story.clues.map((clue) => clue.id));
  const ownedCount = runtime.getState().ownedGear.filter((gearId) => gearId === entry[1]).length;
  const labels = progress.storyStates[story.id].unlockLabels;
  check(entry[2] + "作为一次性 Gear 归档奖励", archived && ownedCount === 1 && labels.includes("Gear：" + entry[2]) && !Object.prototype.hasOwnProperty.call(progress.storage, entry[1]) && !runtime.archiveAdventureStory(story.id, story.clues.map((clue) => clue.id)) && runtime.getState().ownedGear.filter((gearId) => gearId === entry[1]).length === 1, JSON.stringify({ owned: runtime.getState().ownedGear, labels }));
});

const fakeRewardProgress = runtime.createDefaultAdventureProgress(now);
const whiteStory = runtime.getAdventureStoryDefinition("deepMountain:investigateWhiteShadow");
fakeRewardProgress.hookClues.deepMountain.investigateWhiteShadow = whiteStory.clues.map((clue) => clue.id);
fakeRewardProgress.storyStates[whiteStory.id] = { status: "archived", completedAt: now, clueOrder: whiteStory.clues.map((clue) => clue.id), storyText: whiteStory.archiveStory, unlockLabels: ["记录：白影留下的雾痕记录", "路线拓印", "旧瞭望塔路线拓印"] };
runtime.refreshAdventureStoryStates(fakeRewardProgress);
check("旧存档假记录奖励会从玩家可见归档中清理", fakeRewardProgress.storyStates[whiteStory.id].unlockLabels.join("|") === "Gear：雾痕观察板", JSON.stringify(fakeRewardProgress.storyStates[whiteStory.id]));
const storyGearAssetPaths = [
  "assets/gear/activity/mistTraceObservationBoard/icon.png",
  "assets/gear/activity/oldForestryRouteBoard/icon.png",
  "assets/gear/light/luminousPlantLamp/icon.png"
];
check("三个 Gear 使用正式透明 PNG 且旧假奖励不再留在故事配置", storyGearAssetPaths.every((relativePath) => {
  const png = fs.readFileSync(path.join(root, relativePath));
  return png.toString("ascii", 1, 4) === "PNG" && png[25] === 6;
}) && ["mistTraceObservationBoard", "oldForestryRouteBoard", "luminousPlantLamp"].every((id) => gearCatalogSource.includes(`id: "${id}"`)) && !adventureStoryConfigSource.includes("白影留下的雾痕记录") && !adventureStoryConfigSource.includes("旧瞭望塔路线拓印"), "gear catalog and story config");

const sortingStories = runtime.getAdventureStoryDefinitions();
const supportedRules = ["时间顺序", "因果顺序", "行动步骤", "路线连接顺序"];
const configuredStories = sortingStories.filter((story) => story.id !== "keyItem:dampRouteMap");
check("全部现有故事使用受支持且不完全相同的排序规则", configuredStories.every((story) => supportedRules.includes(story.sortingRule)) && new Set(configuredStories.map((story) => story.sortingRule)).size === 4, JSON.stringify(configuredStories.map((story) => ({ id: story.id, rule: story.sortingRule }))));
check("每条排序线索具备完整文本、顺序和关系提示", sortingStories.every((story) => story.clues.every((clue, index) => clue.title && clue.text.length >= 18 && clue.order === index + 1 && clue.relationHint) && story.instruction && story.failureHints.length >= 3 && story.completionExplanation), JSON.stringify(sortingStories.map((story) => ({ id: story.id, clues: story.clues.length, hints: story.failureHints.length }))));

const routeMapStory = runtime.getAdventureStoryDefinition("keyItem:dampRouteMap");
const routeMapOrder = runtime.getAdventureStoryCorrectOrder(routeMapStory);
check("路线图按叶片标记、R-03 补给编号、终点坐标推理", routeMapOrder.join("|") === "rangerLeafRouteMark|southSupplyCode|oldForestryCoordinate" && routeMapStory.clues[0].text.includes("最初") && routeMapStory.clues[1].text.includes("随后") && routeMapStory.clues[2].text.includes("最后一次通联"), JSON.stringify(routeMapStory.clues));
check("逐步提示每次只推进一小步且第三次才允许固定首条", runtime.getAdventureStoryProgressiveHint(routeMapStory, 1) !== runtime.getAdventureStoryProgressiveHint(routeMapStory, 2) && !runtime.shouldPinAdventureStoryFirstClue(1, 1) && !runtime.shouldPinAdventureStoryFirstClue(2, 2) && runtime.shouldPinAdventureStoryFirstClue(3, 0), JSON.stringify(routeMapStory.failureHints));

const fallbackStory = runtime.createAdventureStoryDefinition({
  id: "legacy:fallback",
  title: "旧故事",
  clues: [{ id: "legacyA", label: "旧线索甲" }, { id: "legacyB", label: "旧线索乙" }]
});
check("旧故事缺少排序字段时使用安全 fallback 且不会阻塞正确顺序", fallbackStory.sortingRule === "线索顺序" && fallbackStory.instruction && fallbackStory.clues.every((clue) => clue.text && clue.relationHint) && runtime.isAdventureStoryOrderCorrect(fallbackStory, ["legacyA", "legacyB"]), JSON.stringify(fallbackStory));
check("排序弹窗提供规则、明确位置、主动提示和完成解释区域", ["adventureClueSortRule", "adventureClueSortInstruction", "adventureClueSortSlots", "adventureClueSortHintButton", "adventureClueSortCompletion"].every((id) => indexSource.includes(`id="${id}"`)), "sorting UI ids");
check("移动端拖动使用文档级落点且成功解释先于归档奖励", adventureRuntimeSource.includes('document.addEventListener("pointerup"') && adventureRuntimeSource.includes('storySortSolved && archiveAdventureStory') && adventureRuntimeSource.includes('storySortSolved = true') && styleSource.includes("body.adventure-clue-sort-open") && styleSource.includes("position: fixed") && !adventureRuntimeSource.includes("TEMP_SORTER_BROWSER_FIXTURE"), "pointer and completion gate");

const pityProgress = runtime.createDefaultAdventureProgress(now);
runtime.setProgress(pityProgress);
runtime.setCooking({ cooked: 0, autoCookDate: "", autoCookedToday: 0, unlockedRecipes: ["simpleGrilledFish"] });
const pityTrip = { mapId: "deepMountain", routeId: "denseForest", recipeGuarantees: ["pineNutGrilledFish"], unlockedRecipes: [] };
pityProgress.recipeDiscoveryPity.pineNutGrilledFish = 2;
const raisedWeight = runtime.getAdventureRecipeEventWeight("abandonedCabin", pityTrip, pityProgress);
pityProgress.recipeDiscoveryPity.pineNutGrilledFish = 3;
const guaranteedEvent = runtime.getGuaranteedAdventureRecipeEvent([{ id: "animalTracks" }, { id: "abandonedCabin" }], pityTrip);
check("探索菜谱第 3 次起明显提高来源事件权重", raisedWeight >= 4, String(raisedWeight));
check("探索菜谱第 4 次符合条件的冒险保证来源事件出现", guaranteedEvent && guaranteedEvent.id === "abandonedCabin", JSON.stringify(guaranteedEvent));

const injuryProgress = runtime.createDefaultAdventureProgress(now);
injuryProgress.stamina.value = 40;
runtime.setProgress(injuryProgress);
const injuryTrip = { backpack: { "item:firstAidPouch": 1, "item:trailRation": 1 }, consumed: {}, injuries: {}, staminaEventDelta: 0 };
runtime.setTrip(injuryTrip);
runtime.addAdventureInjury(injuryTrip, "sprain", "unstableBridge");
const messages = [];
const feedback = [];
const notes = [];
const treatments = [];
const treated = runtime.consumeAdventureFirstAidForInjuries(injuryTrip, messages, feedback, notes, treatments);
check("急救包清除伤势、保留干粮并给出治疗反馈", treated && runtime.getActiveAdventureInjuryIds(injuryTrip).length === 0 && injuryTrip.consumed["item:firstAidPouch"] === 1 && injuryTrip.backpack["item:trailRation"] === 1 && messages[0].includes("避免伤势继续恶化"), JSON.stringify({ trip: injuryTrip, messages, treatments }));
check("Console 伤势没有当前事件物件时急救动画使用 Camper 回退坐标", treated && /%$/.test(mockAdventureUsedItemVisual.style.left || "") && /%$/.test(mockAdventureUsedItemVisual.style.top || ""), JSON.stringify(mockAdventureUsedItemVisual.style));

const rationOnlyTrip = { backpack: { "item:trailRation": 1 }, consumed: {}, injuries: {}, staminaEventDelta: 0 };
runtime.addAdventureInjury(rationOnlyTrip, "cut", "floodedSupplyCrate");
const rationDidNotTreat = runtime.consumeAdventureFirstAidForInjuries(rationOnlyTrip, [], [], [], []);
check("干粮不能治疗伤势", !rationDidNotTreat && runtime.getActiveAdventureInjuryIds(rationOnlyTrip).join("|") === "cut" && rationOnlyTrip.backpack["item:trailRation"] === 1, JSON.stringify(rationOnlyTrip));
check("事件到伤势类型映射完整且 Console 类型可用", runtime.getAdventureInjuryType({ id: "unstableBridge" }) === "sprain" && runtime.getAdventureInjuryType({ id: "floodedSupplyCrate" }) === "cut" && runtime.getAdventureInjuryType({ id: "snaredAnimal" }) === "scratch" && runtime.getAdventureInjuryType({ id: "insectSwarm" }) === "insectBite" && ["sprain", "cut", "scratch", "insectBite"].every((id) => runtime.injuryCatalog[id]), Object.keys(runtime.injuryCatalog).join(", "));

const oldUnlocked = runtime.sanitizeAdventureProgress({
  version: 9,
  storage: {},
  stamina: { value: 70, updatedAt: now },
  unlockedMaps: ["deepMountain", "fogRainforest"],
  unlockedRoutes: ["deepMountain"],
  keyClues: [],
  hookClues: {},
  pendingBackpack: {},
  pendingLoot: {},
  recentAdventureHistory: []
});
check("旧存档已解锁雨林会迁移为已归档且不重复弹演出", oldUnlocked.unlockedMaps.includes("fogRainforest") && oldUnlocked.storyStates["keyItem:dampRouteMap"].status === "archived" && oldUnlocked.revealedKeyItems.includes("dampRouteMap") && !oldUnlocked.pendingKeyItemReveal, JSON.stringify({ maps: oldUnlocked.unlockedMaps, story: oldUnlocked.storyStates["keyItem:dampRouteMap"], revealed: oldUnlocked.revealedKeyItems }));

const failed = checks.filter((entry) => !entry.passed);
console.table(checks);
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length }, null, 2));
if (failed.length) {
  console.error("Failed checks", failed);
  process.exitCode = 1;
}
