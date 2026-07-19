// Sound Journal catalog.
//
// This is pure data: the audio playback engine lives in soundManager.js and
// the discovery / UI logic lives in gameSound.js. Keeping the catalog separate
// means new ambient sounds can be added here without touching game logic.
//
// Fields:
//   id          stable key, also the audio file base name
//   type        "loop"    -> toggleable ambient white-noise track
//               "oneshot" -> short effect, discovered but not loopable
//   name        display name in the journal
//   description one-line flavour / what the player is hearing
//   file        path to the audio asset (versioned at load time)
//   lockedHint  clue shown while the sound is still "???"
//   category    grouping label for the journal ("ambient" / "effect")
(function () {
  const catalog = {
    version: 2,
    sounds: [
      {
        id: "rain_soft_loop",
        type: "loop",
        name: "雨天环境音",
        description: "雨落在营地里；进入帐篷后会自动切换为篷布上的雨声。",
        file: "assets/sounds/rain_weather.mp3",
        lockedHint: "遇到小雨天气时会听见。",
        category: "ambient",
        weatherLinked: true
      },
      {
        id: "tent_rain_loop",
        type: "loop",
        name: "帐篷内听雨",
        description: "雨点落在帐篷外层，声音更近也更沉。",
        file: "assets/sounds/rain_in_tent.mp3",
        category: "ambient",
        weatherLinked: true,
        journalHidden: true
      },
      {
        id: "lake_water_loop",
        type: "loop",
        name: "湖边水波",
        description: "湖面轻轻起伏，水流拍着岸边。",
        file: "assets/sounds/lake_water_loop.wav",
        lockedHint: "去湖边抛一次竿也许能听到。",
        category: "ambient"
      },
      {
        id: "campfire_crackle_loop",
        type: "loop",
        name: "篝火噼啪",
        description: "柴火燃烧，火星偶尔轻轻爆开。篝火点燃时会自动播放。",
        file: "assets/sounds/campfire_crackle_loop.wav",
        lockedHint: "围着篝火坐下或添柴时会响起。",
        category: "ambient"
      },
      {
        id: "birds_morning_loop",
        type: "loop",
        name: "清晨鸟鸣",
        description: "林间此起彼伏的鸟叫，带着晨雾的空气感。",
        file: "assets/sounds/birds_morning_loop.wav",
        files: [
          { file: "assets/sounds/birds_morning_loop.wav", weight: 1 },
          { file: "assets/sounds/birds_morning_loop_02.wav", weight: 0.04 },
          { file: "assets/sounds/birds_morning_loop_03.wav", weight: 1 },
          { file: "assets/sounds/birds_morning_loop_04.wav", weight: 0.01 }
        ],
        randomizeLoop: true,
        lockedHint: "拿起望远镜观鸟时会发现。",
        category: "ambient"
      },
      {
        id: "cooking_sizzle_loop",
        type: "loop",
        name: "煎鱼滋滋",
        description: "锅里油花翻腾，鱼皮慢慢煎香。",
        file: "assets/sounds/cooking_sizzle_loop.wav",
        lockedHint: "在炉子上做一次饭就能听到。",
        category: "ambient"
      },
      {
        id: "cooler_open",
        type: "oneshot",
        name: "冷藏箱开启",
        description: "扣扣一声，掀开箱盖漏出一点凉气。",
        file: "assets/sounds/cooler_open.wav",
        lockedHint: "打开冷藏箱查看库存时的声音。",
        category: "effect"
      },
      {
        id: "fishing_line",
        type: "oneshot",
        name: "抛竿收线",
        description: "鱼线破空的轻响，卷线器咔哒作声。",
        file: "assets/sounds/fishing_line.wav",
        lockedHint: "第一次抛竿钓鱼时的声音。",
        category: "effect"
      }
    ]
  };

  // Trigger map: which sounds an interaction discovers / plays.
  // Consumed by gameSound.js when an interaction *starts* (not when it finishes).
  //   ambient  -> loop id started as temporary activity ambience (+ discovered)
  //   oneshot  -> short effect played once (+ discovered)
  // Note: the campfire loop is NOT here — it is fire-linked and handled
  // specially in gameSound.js (plays while the fire burns, not per interaction).
  const triggers = {
    fish: { ambient: ["lake_water_loop"], oneshot: ["fishing_line"] },
    cook: { ambient: ["cooking_sizzle_loop"], oneshot: [] },
    birdwatch: { ambient: ["birds_morning_loop"], oneshot: [] },
    coolerOpen: { ambient: [], oneshot: ["cooler_open"] }
  };

  const api = { catalog: catalog, triggers: triggers };

  if (typeof window !== "undefined") {
    window.SOUND_JOURNAL_CATALOG = catalog;
    window.SOUND_JOURNAL_TRIGGERS = triggers;
    window.SOUND_JOURNAL = api;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
