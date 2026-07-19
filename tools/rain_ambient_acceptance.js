const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function flushPromises() {
  return new Promise(function(resolve) {
    setImmediate(resolve);
  });
}

const soundCatalogApi = require(path.join(root, "js/config/soundJournalCatalog.js"));
const weatherCatalog = require(path.join(root, "js/config/weatherCatalog.js"));
const soundManagerSource = read("js/systems/soundManager.js");
const gameSoundSource = read("js/systems/gameSound.js");

const outdoorFile = path.join(root, "assets/sounds/rain_weather.mp3");
const tentFile = path.join(root, "assets/sounds/rain_in_tent.mp3");

assert.ok(fs.statSync(outdoorFile).size > 0, "Outdoor rain MP3 must be present.");
assert.ok(fs.statSync(tentFile).size > 0, "Tent rain MP3 must be present.");

const soundsById = Object.fromEntries(soundCatalogApi.catalog.sounds.map(function(entry) {
  return [entry.id, entry];
}));

assert.equal(soundsById.rain_soft_loop.file, "assets/sounds/rain_weather.mp3");
assert.equal(soundsById.tent_rain_loop.file, "assets/sounds/rain_in_tent.mp3");
assert.equal(soundsById.rain_soft_loop.weatherLinked, true);
assert.equal(soundsById.tent_rain_loop.journalHidden, true);
assert.equal(weatherCatalog.weathers.lightRain.soundRecommendations[0].future, undefined);
assert.match(soundManagerSource, /const requestedLoops = \{\}/);
assert.match(soundManagerSource, /SoundManager\.startLoop = function \(id, options\)/);
assert.match(soundManagerSource, /fadeHtmlLoop\(audio, 1, fadeSeconds\)/);

function createHarness(options) {
  const settings = options || {};
  const activeLoops = new Set();
  const calls = [];
  let weatherId = settings.weatherId || "lightRain";
  const manager = {
    muted: false,
    volume: 0.7,
    configure: function(config) {
      this.muted = Boolean(config.muted);
      this.volume = config.masterVolume;
    },
    resume: function() {
      calls.push("resume");
      return Promise.resolve(true);
    },
    preload: function(id) {
      calls.push("preload:" + id);
      return Promise.resolve(true);
    },
    startLoop: function(id) {
      calls.push("start:" + id);
      activeLoops.add(id);
      return Promise.resolve(true);
    },
    stopLoop: function(id) {
      calls.push("stop:" + id);
      activeLoops.delete(id);
      return true;
    },
    isLoopPlaying: function(id) {
      return activeLoops.has(id);
    },
    setMasterVolume: function(value) {
      this.volume = value;
    },
    setMuted: function(value) {
      this.muted = Boolean(value);
    }
  };
  const gameState = {
    soundJournal: {
      discovered: (settings.discovered || []).slice(),
      enabledAmbient: (settings.enabledAmbient || []).slice(),
      masterVolume: settings.masterVolume === undefined ? 0.7 : settings.masterVolume,
      muted: Boolean(settings.muted)
    }
  };
  const camper = { pose: settings.pose || "idle" };
  const context = {
    APP_VERSION: "test",
    console: console,
    camper: camper,
    defaultGameState: { soundJournal: gameState.soundJournal },
    gameState: gameState,
    saveGame: function() {},
    setStatus: function() {},
    updateDailyCampCard: function() {},
    getCurrentWeatherDefinition: function() {
      return { id: weatherId };
    },
    soundJournalLayer: null,
    soundJournalList: null,
    soundVolumeSlider: null,
    soundMasterToggle: null,
    document: {},
    window: {
      soundManager: manager,
      SOUND_JOURNAL_CATALOG: soundCatalogApi.catalog,
      SOUND_JOURNAL_TRIGGERS: soundCatalogApi.triggers,
      addEventListener: function() {}
    },
    Set: Set,
    Promise: Promise,
    Math: Math,
    Number: Number,
    Array: Array,
    Object: Object,
    String: String,
    Boolean: Boolean
  };

  vm.runInNewContext(
    gameSoundSource + ";globalThis.rainTestApi={initSoundSystem,startSoundSystem,syncWeatherAmbient,setAmbientEnabled,setSoundMasterVolume,setSoundMuted};",
    context
  );

  return {
    activeLoops: activeLoops,
    api: context.rainTestApi,
    calls: calls,
    camper: camper,
    gameState: gameState,
    manager: manager,
    setWeather: function(id) {
      weatherId = id;
    }
  };
}

async function run() {
  const harness = createHarness();
  harness.api.initSoundSystem();
  assert.equal(harness.activeLoops.size, 0, "Rain must wait for the existing audio resume gate.");
  await harness.api.startSoundSystem();
  await flushPromises();

  assert.ok(harness.calls.includes("resume"));
  assert.deepEqual(Array.from(harness.activeLoops), ["rain_soft_loop"]);
  assert.ok(harness.gameState.soundJournal.discovered.includes("rain_soft_loop"));
  assert.ok(harness.gameState.soundJournal.enabledAmbient.includes("rain_soft_loop"));

  const repeatedStartCount = harness.calls.filter(function(call) {
    return call === "start:rain_soft_loop";
  }).length;
  harness.api.syncWeatherAmbient();
  harness.api.syncWeatherAmbient();
  await flushPromises();
  assert.equal(harness.calls.filter(function(call) {
    return call === "start:rain_soft_loop";
  }).length, repeatedStartCount, "Repeated sync must not stack outdoor rain loops.");

  harness.camper.pose = "tentRest";
  const enterCallIndex = harness.calls.length;
  harness.api.syncWeatherAmbient();
  await flushPromises();
  const enterCalls = harness.calls.slice(enterCallIndex);
  assert.ok(enterCalls.indexOf("start:tent_rain_loop") < enterCalls.indexOf("stop:rain_soft_loop"));
  assert.deepEqual(Array.from(harness.activeLoops), ["tent_rain_loop"]);

  harness.camper.pose = "idle";
  harness.api.syncWeatherAmbient();
  await flushPromises();
  assert.deepEqual(Array.from(harness.activeLoops), ["rain_soft_loop"]);

  harness.camper.pose = "tentRest";
  harness.api.syncWeatherAmbient();
  harness.camper.pose = "idle";
  harness.api.syncWeatherAmbient();
  await flushPromises();
  assert.deepEqual(Array.from(harness.activeLoops), ["rain_soft_loop"], "Rapid tent transitions must leave one rain loop.");

  harness.setWeather("sunny");
  harness.api.syncWeatherAmbient();
  await flushPromises();
  assert.equal(harness.activeLoops.size, 0, "Leaving rainy weather must stop both rain loops.");

  harness.setWeather("lightRain");
  harness.api.syncWeatherAmbient();
  await flushPromises();
  harness.api.setAmbientEnabled("rain_soft_loop", false);
  await flushPromises();
  assert.equal(harness.activeLoops.size, 0, "Rain ambient toggle must stop both variants.");

  harness.api.setAmbientEnabled("rain_soft_loop", true);
  await flushPromises();
  assert.deepEqual(Array.from(harness.activeLoops), ["rain_soft_loop"]);
  harness.api.setSoundMasterVolume(0.25);
  assert.equal(harness.manager.volume, 0.25, "Rain must follow the existing master volume.");
  harness.api.setSoundMuted(true);
  assert.equal(harness.manager.muted, true, "Rain must follow the existing master mute setting.");

  const restored = createHarness({
    discovered: ["rain_soft_loop"],
    enabledAmbient: ["rain_soft_loop"],
    pose: "tentRest",
    weatherId: "lightRain"
  });
  restored.api.initSoundSystem();
  await restored.api.startSoundSystem();
  await flushPromises();
  assert.deepEqual(Array.from(restored.activeLoops), ["tent_rain_loop"], "Saved rain setting must restore the tent variant.");

  console.log("Rain ambient acceptance checks passed.");
}

run().catch(function(error) {
  console.error(error);
  process.exitCode = 1;
});
