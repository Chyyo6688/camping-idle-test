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
globalThis.__partyRuntime = {
  localMax: ADVENTURE_LOCAL_PARTY_MAX,
  futureMax: ADVENTURE_FUTURE_PARTY_MAX,
  maps: ADVENTURE_MAPS,
  createDefaultAdventureProgress,
  sanitizeAdventureLog,
  sanitizeAdventureParticipants,
  createAdventureParticipantFromSnapshot,
  createLocalAdventureParty,
  getAdventureParticipantSnapshot,
  prepareAdventureEventParticipation,
  completeAdventureEventParticipation,
  buildAdventureParticipantHighlights,
  simulateLocalAdventurePartyTrip,
  createSoloAdventureParticipants,
  setProgress(progress) { gameState.adventure = progress; },
  getProgress() { return gameState.adventure; }
};`, sandbox);

const runtime = sandbox.__partyRuntime;
const neutralTraits = Object.fromEntries(sandbox.CAMPER_TRAIT_KEYS.map((traitId) => [traitId, 50]));
const leadSnapshot = {
  profile: { id: "lead", name: "露" }, personalityId: "steady",
  finalTraits: Object.assign({}, neutralTraits, { preparedness: 70, responsibility: 66 }),
  dailyAdventureModifiers: { generalLuck: 1, treasureLuck: 0, socialLuck: 0, healthLuck: 0, dangerSense: 2 }
};

const solo = runtime.createLocalAdventureParty(1, leadSnapshot, { leadItemKeys: ["item:ropeKit"] });
const duo = runtime.createLocalAdventureParty(2, leadSnapshot);
const trio = runtime.createLocalAdventureParty(3, leadSnapshot);
check("本地原型支持 1、2、3 人且长期上限仍可扩至 4", runtime.localMax === 3 && runtime.futureMax === 4 && solo.length === 1 && duo.length === 2 && trio.length === 3, JSON.stringify({ solo: solo.length, duo: duo.length, trio: trio.length, future: runtime.futureMax }));
check("单人使用完整默认参与字段", solo[0].camperId === "lead" && solo[0].role === "solo" && solo[0].source === "local" && solo[0].carriedItemKeys[0] === "item:ropeKit" && solo[0].finalTraits.preparedness === 70, JSON.stringify(solo[0]));
const soloEvent = runtime.maps.deepMountain.events.find((entry) => entry.id === "unstableBridge");
const soloPlan = runtime.prepareAdventureEventParticipation({ mapId: "deepMountain", participants: solo, events: [] }, soloEvent, leadSnapshot);
const soloParticipation = runtime.completeAdventureEventParticipation({ mapId: "deepMountain", participants: solo, events: [] }, soloEvent, soloEvent.reactions[0], { tier: "good", itemSolution: { itemKey: "item:ropeKit", followUpItemKey: "", isCombined: false } }, soloPlan);
check("现有单人事件继续写默认分工且不增加队伍文案", soloParticipation.actorCamperId === "lead" && soloParticipation.helperCamperIds.length === 0 && soloParticipation.itemOwnerId === "lead" && soloParticipation.contributorIds.join("|") === "lead" && soloParticipation.participantObservations.length === 0 && soloParticipation.participationText === "", JSON.stringify(soloParticipation));

const duplicateParty = runtime.sanitizeAdventureParticipants([
  { camperId: "same", displayName: "A" }, { camperId: "same", displayName: "B" }, { camperId: "c", displayName: "C" }, { camperId: "d", displayName: "D" }, { camperId: "e", displayName: "E" }
], 4);
check("参与者 sanitize 去重并限制未来最多 4 人", duplicateParty.length === 4 && new Set(duplicateParty.map((entry) => entry.camperId)).size === 4, duplicateParty.map((entry) => entry.camperId).join(", "));

const affinityEvent = {
  id: "affinityTest", risk: 0,
  reactions: [{ id: "notice", type: "仔细观察", traitWeights: { observation: 1 } }]
};
const affinityParty = runtime.sanitizeAdventureParticipants([
  { camperId: "low", displayName: "低观察", finalTraits: Object.assign({}, neutralTraits, { observation: 15 }) },
  { camperId: "high", displayName: "高观察", finalTraits: Object.assign({}, neutralTraits, { observation: 95 }) },
  { camperId: "mid", displayName: "中观察", finalTraits: Object.assign({}, neutralTraits, { observation: 50 }) }
], 3);
const affinityCounts = { low: 0, high: 0, mid: 0 };
for (let index = 0; index < 1200; index += 1) {
  const plan = runtime.prepareAdventureEventParticipation({ mapId: "deepMountain", participants: affinityParty, events: [] }, affinityEvent, leadSnapshot);
  affinityCounts[plan.actorCamperId] += 1;
}
check("主行动者按事件匹配度与个人性格加权", affinityCounts.high > affinityCounts.mid * 3 && affinityCounts.high > affinityCounts.low * 8, JSON.stringify(affinityCounts));

const deepEvents = ["unstableBridge", "whiteShadow", "rangerNotebook", "snaredAnimal", "nightCampEcho"].map((eventId) => runtime.maps.deepMountain.events.find((entry) => entry.id === eventId));
const balancedTrip = { mapId: "deepMountain", participants: trio, events: [] };
deepEvents.forEach((eventDefinition) => {
  const plan = runtime.prepareAdventureEventParticipation(balancedTrip, eventDefinition, leadSnapshot);
  const reaction = eventDefinition.reactions[0];
  const participation = runtime.completeAdventureEventParticipation(balancedTrip, eventDefinition, reaction, { tier: "mixed", itemSolution: null }, plan);
  balancedTrip.events.push(Object.assign({ eventId: eventDefinition.id, reactionType: reaction.type }, participation));
});
const actorCounts = Object.fromEntries(trio.map((participant) => [participant.camperId, balancedTrip.events.filter((entry) => entry.actorCamperId === participant.camperId).length]));
check("五事件镜头平衡让三位 Camper 都主导至少一次", Object.values(actorCounts).every((count) => count >= 1) && Math.max(...Object.values(actorCounts)) - Math.min(...Object.values(actorCounts)) <= 1, JSON.stringify(actorCounts));
check("协助者不包含行动者且每事件最多两人", balancedTrip.events.every((entry) => entry.helperCamperIds.length <= 2 && !entry.helperCamperIds.includes(entry.actorCamperId)), JSON.stringify(balancedTrip.events.map((entry) => ({ actor: entry.actorCamperId, helpers: entry.helperCamperIds }))));

const ownedParty = runtime.sanitizeAdventureParticipants([
  { camperId: "actor", displayName: "行动者", finalTraits: neutralTraits },
  { camperId: "ropeOwner", displayName: "绳组主人", finalTraits: neutralTraits, carriedItemKeys: ["item:ropeKit"] },
  { camperId: "aidOwner", displayName: "急救包主人", finalTraits: neutralTraits, carriedItemKeys: ["item:firstAidPouch"] }
], 3);
const rescueEvent = runtime.maps.deepMountain.events.find((entry) => entry.id === "distantCry");
const rescueReaction = rescueEvent.reactions.find((entry) => entry.id === "prepareAid");
const rescuePlan = { participants: ownedParty, actor: ownedParty[0], actorCamperId: "actor", actorSnapshot: runtime.getAdventureParticipantSnapshot(ownedParty[0], leadSnapshot) };
const rescueParticipation = runtime.completeAdventureEventParticipation({ mapId: "deepMountain", participants: ownedParty, events: [] }, rescueEvent, rescueReaction, {
  tier: "rareGood",
  itemSolution: { itemKey: "item:ropeKit", followUpItemKey: "item:firstAidPouch", isCombined: true }
}, rescuePlan);
check("物品所有者、行动者与协助者可以不同", rescueParticipation.actorCamperId === "actor" && rescueParticipation.itemOwnerId === "ropeOwner" && rescueParticipation.helperCamperIds.includes("ropeOwner") && rescueParticipation.helperCamperIds.includes("aidOwner") && rescueParticipation.contributorIds.length === 3, JSON.stringify(rescueParticipation));
check("团队日志说明谁使用了自己的物品", rescueParticipation.participationText.includes("绳组主人") && rescueParticipation.participationText.includes("攀登绳组"), rescueParticipation.participationText);

const observationParty = runtime.sanitizeAdventureParticipants([
  { camperId: "actor", displayName: "行动者", finalTraits: neutralTraits },
  { camperId: "watcher", displayName: "观察者", finalTraits: Object.assign({}, neutralTraits, { observation: 92, sociability: 20 }) },
  { camperId: "listener", displayName: "记得异常的人", finalTraits: Object.assign({}, neutralTraits, { observation: 20, sociability: 20 }), adventureMemories: { supernaturalEncounters: 2 } }
], 3);
const shadowEvent = runtime.maps.deepMountain.events.find((entry) => entry.id === "whiteShadow");
const shadowReaction = shadowEvent.reactions[0];
const shadowParticipation = runtime.completeAdventureEventParticipation({ mapId: "deepMountain", participants: observationParty, events: [] }, shadowEvent, shadowReaction, { tier: "mixed", itemSolution: null }, {
  participants: observationParty, actor: observationParty[0], actorCamperId: "actor", actorSnapshot: runtime.getAdventureParticipantSnapshot(observationParty[0], leadSnapshot)
});
check("不同 Camper 根据 traits 或记忆看到不同细节", shadowParticipation.participantObservations.length === 2 && shadowParticipation.participantObservations.some((entry) => entry.camperId === "watcher" && entry.source === "trait" && entry.text.includes("背包束带")) && shadowParticipation.participantObservations.some((entry) => entry.camperId === "listener" && entry.source === "memory" && entry.text.includes("异常相遇")), JSON.stringify(shadowParticipation.participantObservations));
check("每次参与记录包含决策来源与贡献者", shadowParticipation.decisionSource === "auto" && shadowParticipation.contributorIds.includes("actor") && shadowParticipation.contributorIds.includes("watcher") && shadowParticipation.contributorIds.includes("listener"), JSON.stringify(shadowParticipation));

const highlights = runtime.buildAdventureParticipantHighlights(balancedTrip);
check("每位 Camper 获得个人高光总结", highlights.length === 3 && highlights.every((entry) => entry.actorCount >= 1 && entry.text.includes(entry.displayName)), JSON.stringify(highlights));

const soloSimulation = runtime.simulateLocalAdventurePartyTrip("deepMountain", 1, deepEvents.map((entry) => entry.id), leadSnapshot);
const duoSimulation = runtime.simulateLocalAdventurePartyTrip("fogRainforest", 2, ["symbolStone", "lostSupplyBeacon"], leadSnapshot);
const trioSimulation = runtime.simulateLocalAdventurePartyTrip("deepMountain", 3, deepEvents.map((entry) => entry.id), leadSnapshot);
check("本地模拟入口可运行单人、双人与三人事件", soloSimulation.participants.length === 1 && duoSimulation.participants.length === 2 && trioSimulation.participants.length === 3 && trioSimulation.events.length === 5 && trioSimulation.participantHighlights.length === 3, JSON.stringify({ solo: soloSimulation.events.length, duo: duoSimulation.events.length, trio: trioSimulation.events.length }));
check("本地模拟不写 adventure 存档或结算物品", runtime.getProgress() === null && sandbox.gameState.inventory.fish && Object.keys(sandbox.gameState.inventory.fish).length === 0, JSON.stringify(sandbox.gameState));

const sanitizedTeamLog = runtime.sanitizeAdventureLog({
  id: "team-log", mapId: "deepMountain", routeId: "mountainRidge", adventureHook: { id: "findSafeRoute", title: "安全路线", intro: "出发。", relatedEventIds: ["unstableBridge"], source: "fallback" },
  participants: ownedParty,
  participantHighlights: highlights,
  events: [{ eventId: "distantCry", title: "呼救", reactionType: "准备救援", result: "完成。", participants: rescueParticipation.participants, actorCamperId: rescueParticipation.actorCamperId, helperCamperIds: rescueParticipation.helperCamperIds, itemOwnerId: rescueParticipation.itemOwnerId, contributorIds: rescueParticipation.contributorIds, decisionSource: "invalid", participantObservations: shadowParticipation.participantObservations, participationText: rescueParticipation.participationText }],
  gained: {}, departedWith: {}, lost: {}, consumed: {}, unlocked: [], unlockedMaps: [], staminaStart: 100, staminaEnd: 75
});
check("团队日志 sanitize 保留分工、观察和个人高光", sanitizedTeamLog.participants.length === 3 && sanitizedTeamLog.participantHighlights.length === 3 && sanitizedTeamLog.events[0].actorCamperId === "actor" && sanitizedTeamLog.events[0].helperCamperIds.length === 2 && sanitizedTeamLog.events[0].itemOwnerId === "ropeOwner" && sanitizedTeamLog.events[0].participantObservations.length === 2 && sanitizedTeamLog.events[0].decisionSource === "auto", JSON.stringify(sanitizedTeamLog.events[0]));
const oldLog = runtime.sanitizeAdventureLog({ id: "old", mapId: "deepMountain", routeId: "creekValley", events: [{ eventId: "animalTracks", title: "脚印", result: "看过。" }], staminaStart: 100, staminaEnd: 75 });
check("旧单人日志缺少队伍字段仍可安全读取", oldLog.participants.length === 0 && oldLog.participantHighlights.length === 0 && oldLog.events[0].actorCamperId === "localCamper" && oldLog.events[0].decisionSource === "auto", JSON.stringify(oldLog.events[0]));

check("两张地图都提供少量个人观察配置", ["deepMountain", "fogRainforest"].every((mapId) => runtime.maps[mapId].participantObservations && Object.keys(runtime.maps[mapId].participantObservations).length >= 3), JSON.stringify(Object.fromEntries(Object.entries(runtime.maps).map(([mapId, map]) => [mapId, Object.keys(map.participantObservations || {})]))));
check("事件流程使用行动者快照而非 traits 简单相加", systemSource.includes("const snapshot = participationPlan.actorSnapshot") && !partySource.includes("teamTraits") && !partySource.includes("combinedTraits"), "actorSnapshot assignment");
check("本地原型没有网络、好友或多人 UI 代码", !/fetch\s*\(|WebSocket|RTCPeerConnection|EventSource|document\./.test(partySource), "pure local data module");

const failed = checks.filter((entry) => !entry.passed);
console.table(checks);
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length, actorAffinity: affinityCounts, balancedActors: actorCounts }, null, 2));
if (failed.length) {
  console.error("Failed checks", failed);
  process.exitCode = 1;
}
