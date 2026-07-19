(function () {
  const weatherIds = ["sunny", "cloudy", "breezy", "lightRain", "foggy"];

  const catalog = {
    version: 1,
    weatherIds: weatherIds,
    defaultWeatherId: "sunny",
    weathers: {
      sunny: {
        id: "sunny",
        label: "晴天",
        shortLabel: "晴",
        weight: 30,
        asset: "assets/weather/sunny_warm_overlay.png",
        layerClass: "weather-layer-sunny",
        moodLines: [
          "今天湖边亮得很温柔，适合慢慢来。",
          "阳光把营地晒得松松的，适合等一条鱼上钩。",
          "今天适合把椅子挪到有光的地方，假装时间很宽。"
        ],
        activityLabels: ["钓鱼", "观鸟", "看湖水"],
        activityWeights: {
          fish: 0.7,
          birdwatch: 0.6,
          lookingAtLake: 0.45
        },
        soundRecommendations: [
          { id: "lake_water_loop", label: "湖水" },
          { id: "birds_morning_loop", label: "鸟鸣" }
        ]
      },
      cloudy: {
        id: "cloudy",
        label: "多云",
        shortLabel: "云",
        weight: 25,
        asset: "assets/weather/cloudy_shadow_overlay.png",
        layerClass: "weather-layer-cloudy",
        moodLines: [
          "云影慢慢挪过营地，适合整理装备。",
          "今天光线软软的，适合坐下来想一会儿。",
          "云把太阳收得刚刚好，适合煮点热的。"
        ],
        activityLabels: ["坐一会儿", "整理装备", "做饭"],
        activityWeights: {
          sittingOnFurniture: 0.45,
          observingGear: 0.5,
          cook: 0.55
        },
        soundRecommendations: [
          { id: "lake_water_loop", label: "湖水" },
          { id: "cooking_sizzle_loop", label: "锅里滋滋声" }
        ]
      },
      breezy: {
        id: "breezy",
        label: "微风",
        shortLabel: "风",
        weight: 20,
        asset: "assets/weather/breezy_leaf_particles.png",
        layerClass: "weather-layer-breezy",
        moodLines: [
          "风有点轻，适合观鸟和听水声。",
          "树叶在很小声地路过，适合看湖面发呆。",
          "今天的风刚好够温柔，适合躲到天幕边休息。"
        ],
        activityLabels: ["观鸟", "看湖水", "天幕边休息"],
        activityWeights: {
          birdwatch: 0.7,
          lookingAtLake: 0.5,
          resting: 0.3,
          tentRest: 0.25
        },
        soundRecommendations: [
          { id: "lake_water_loop", label: "湖水" },
          { id: "birds_morning_loop", label: "鸟鸣" },
          { id: "wind_soft_loop", label: "轻风声", future: true }
        ]
      },
      lightRain: {
        id: "lightRain",
        label: "小雨",
        shortLabel: "雨",
        weight: 15,
        asset: "assets/weather/light_rain_overlay.png",
        layerClass: "weather-layer-light-rain",
        moodLines: [
          "今天适合煮点热的，听雨把营地放慢。",
          "小雨轻轻落下来，适合靠近火边暖一会儿。",
          "帐篷外面有细雨，今天不用太赶。"
        ],
        activityLabels: ["做饭", "围炉", "帐篷休息"],
        activityWeights: {
          cook: 0.85,
          sittingByFire: 0.55,
          tentRest: 0.75,
          resting: 0.25,
          fish: -0.35
        },
        soundRecommendations: [
          { id: "rain_soft_loop", label: "雨声（随帐篷内外切换）" },
          { id: "cooking_sizzle_loop", label: "锅里滋滋声" }
        ]
      },
      foggy: {
        id: "foggy",
        label: "薄雾",
        shortLabel: "雾",
        weight: 10,
        asset: "assets/weather/fog_overlay.png",
        layerClass: "weather-layer-foggy",
        moodLines: [
          "今天湖边很安静，适合慢慢来。",
          "薄雾把远处收轻了，适合看水面和发呆。",
          "营地像被调低了音量，适合安静待着。"
        ],
        activityLabels: ["静坐", "看湖水", "安静休息"],
        activityWeights: {
          sittingOnFurniture: 0.35,
          lookingAtLake: 0.65,
          resting: 0.55,
          wandering: -0.2
        },
        soundRecommendations: [
          { id: "lake_water_loop", label: "湖水" },
          { id: "soft_ambient_loop", label: "轻环境音", future: true }
        ]
      }
    },
    night: {
      activityWeights: {
        sittingByFire: 0.75,
        cook: 0.25,
        tentRest: 0.45,
        sittingOnFurniture: 0.25,
        observingGear: 0.15
      },
      soundRecommendations: [
        { id: "campfire_crackle_loop", label: "篝火声" },
        { id: "night_ambient_loop", label: "夜间环境音", future: true }
      ],
      moodLine: "夜晚适合围炉，但这是营地时间的心情，不是天气。"
    }
  };

  if (typeof window !== "undefined") {
    window.WEATHER_CATALOG = catalog;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = catalog;
  }
})();
