// Save schema, defaults, migration support, runtime constants, and asset paths.

const SAVE_KEY = "cozyCampfireSave";
const APP_VERSION = typeof window !== "undefined" && window.APP_VERSION ? window.APP_VERSION : "4.9";

function withVersion(path) {
  const separator = path.includes("?") ? "&" : "?";
  return path + separator + "v=" + APP_VERSION;
}

function versionAssetPaths(value) {
  if (typeof value === "string") {
    return value.startsWith("assets/") ? withVersion(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map(versionAssetPaths);
  }

  if (value && typeof value === "object") {
    const versionedObject = {};

    Object.keys(value).forEach(function(key) {
      versionedObject[key] = versionAssetPaths(value[key]);
    });

    return versionedObject;
  }

  return value;
}

const gearCatalog = typeof window !== "undefined" && window.GEAR_CATALOG ? window.GEAR_CATALOG : {};
const shopGroupData = typeof window !== "undefined" && window.SHOP_GROUPS ? window.SHOP_GROUPS : {};
const legacyGearIdMap = typeof window !== "undefined" && window.LEGACY_GEAR_ID_MAP ? window.LEGACY_GEAR_ID_MAP : {};
const BASE_SCENE_WIDTH = typeof window !== "undefined" && window.BASE_SCENE_WIDTH ? window.BASE_SCENE_WIDTH : 900;
const BASE_SCENE_HEIGHT = typeof window !== "undefined" && window.BASE_SCENE_HEIGHT ? window.BASE_SCENE_HEIGHT : 1600;
const SCENE_ASSET_SCALE = typeof window !== "undefined" && window.SCENE_ASSET_SCALE ? window.SCENE_ASSET_SCALE : 3;
const SCENE_DEPTH_Z_BASE = 100;
const SCENE_FRONT_LAYER_OFFSET = 6;
const CAMPER_DEPTH_OFFSET = 2;
const PATH_GRID_SIZE = 24;
const CAMPER_COLLISION_RADIUS = 18;
const PATH_MOVE_SPEED_PX_PER_SECOND = 235;
const PATH_MIN_DURATION_MS = 800;
const PATH_MAX_DURATION_MS = 6500;
const CAMPER_INTERACTION_DEPTH_APPROACH_DISTANCE = 180;
const OCCLUSION_DEPTH_GAP = 8;
const OCCLUSION_SHOW_OVERLAP_RATIO = 0.12;
const OCCLUSION_HIDE_OVERLAP_RATIO = 0.05;
const USER_DEPTH_OFFSET_STEP = 40;
const DEFAULT_SURFACE_DEPTH_OFFSET_Y = 90;
const DEFAULT_STACKED_DEPTH_OFFSET_Y = 60;
const DEFAULT_MOUNTED_DEPTH_OFFSET_Y = 220;

const BUILD_HIT_ALPHA_THRESHOLD = 16;
const BUILD_HIT_FALLBACK_ZONES = {
  tripleCampSofa: [
    { ratioX: 0.18, ratioY: 0.08, ratioWidth: 0.64, ratioHeight: 0.28 },
    { ratioX: 0.08, ratioY: 0.34, ratioWidth: 0.84, ratioHeight: 0.52 }
  ],
  vehicleAwning: [
    { ratioX: 0.04, ratioY: 0.04, ratioWidth: 0.9, ratioHeight: 0.36 },
    { ratioX: 0.04, ratioY: 0.36, ratioWidth: 0.1, ratioHeight: 0.58 },
    { ratioX: 0.82, ratioY: 0.36, ratioWidth: 0.1, ratioHeight: 0.58 }
  ]
};
const CAMPER_BODY_RECTS = {
  default: { ratioX: 0.31, ratioY: 0.14, ratioWidth: 0.38, ratioHeight: 0.78 },
  walking: { ratioX: 0.3, ratioY: 0.12, ratioWidth: 0.4, ratioHeight: 0.8 },
  carryingWood: { ratioX: 0.27, ratioY: 0.1, ratioWidth: 0.46, ratioHeight: 0.82 },
  sittingGround: { ratioX: 0.22, ratioY: 0.34, ratioWidth: 0.56, ratioHeight: 0.54 },
  sittingChair: { ratioX: 0.22, ratioY: 0.3, ratioWidth: 0.56, ratioHeight: 0.58 },
  resting: { ratioX: 0.16, ratioY: 0.45, ratioWidth: 0.68, ratioHeight: 0.38 },
  tentRest: { ratioX: 0.16, ratioY: 0.45, ratioWidth: 0.68, ratioHeight: 0.38 },
  lookingLakeBack: { ratioX: 0.3, ratioY: 0.14, ratioWidth: 0.4, ratioHeight: 0.78 },
  activityCook: { ratioX: 0.28, ratioY: 0.12, ratioWidth: 0.44, ratioHeight: 0.8 },
  activityFish: { ratioX: 0.22, ratioY: 0.12, ratioWidth: 0.56, ratioHeight: 0.8 },
  activityBirdwatch: { ratioX: 0.24, ratioY: 0.12, ratioWidth: 0.52, ratioHeight: 0.8 }
};
const CAMPER_THOUGHT_RECTS = {
  default: { ratioX: 0.5, ratioY: 0.06 },
  walking: { ratioX: 0.5, ratioY: 0.04 },
  carryingWood: { ratioX: 0.5, ratioY: 0.04 },
  sittingGround: { ratioX: 0.5, ratioY: 0.28 },
  sittingChair: { ratioX: 0.5, ratioY: 0.24 },
  resting: { ratioX: 0.5, ratioY: 0.4 },
  tentRest: { ratioX: 0.5, ratioY: 0.4 },
  lookingLakeBack: { ratioX: 0.5, ratioY: 0.06 },
  activityCook: { ratioX: 0.5, ratioY: 0.05 },
  activityFish: { ratioX: 0.5, ratioY: 0.05 },
  activityBirdwatch: { ratioX: 0.5, ratioY: 0.05 }
};
const DEFAULT_COLLISION_FOOTPRINTS = {
  vehicle: { ratioX: 0.14, ratioY: 0.62, ratioWidth: 0.72, ratioHeight: 0.28 },
  tent: { ratioX: 0.2, ratioY: 0.68, ratioWidth: 0.6, ratioHeight: 0.26 },
  tarp: { ratioX: 0.34, ratioY: 0.86, ratioWidth: 0.32, ratioHeight: 0.1 },
  chair: { ratioX: 0.24, ratioY: 0.72, ratioWidth: 0.52, ratioHeight: 0.22 },
  table: { ratioX: 0.18, ratioY: 0.68, ratioWidth: 0.64, ratioHeight: 0.22 },
  stove: { ratioX: 0.22, ratioY: 0.7, ratioWidth: 0.56, ratioHeight: 0.2 },
  cooler: { ratioX: 0.2, ratioY: 0.7, ratioWidth: 0.6, ratioHeight: 0.22 },
  light: { ratioX: 0.36, ratioY: 0.74, ratioWidth: 0.28, ratioHeight: 0.2 },
  storage: { ratioX: 0.18, ratioY: 0.7, ratioWidth: 0.64, ratioHeight: 0.22 },
  fire: { ratioX: 0.25, ratioY: 0.64, ratioWidth: 0.5, ratioHeight: 0.3 },
  activity: { ratioX: 0.22, ratioY: 0.72, ratioWidth: 0.56, ratioHeight: 0.2 }
};
const DEFAULT_OCCLUSION_RECTS = {
  vehicle: { ratioX: 0.08, ratioY: 0.2, ratioWidth: 0.84, ratioHeight: 0.56 },
  tent: { ratioX: 0.12, ratioY: 0.16, ratioWidth: 0.76, ratioHeight: 0.72 },
  tarp: { ratioX: 0.2, ratioY: 0.44, ratioWidth: 0.6, ratioHeight: 0.42 },
  chair: { ratioX: 0.2, ratioY: 0.34, ratioWidth: 0.6, ratioHeight: 0.5 },
  table: { ratioX: 0.16, ratioY: 0.48, ratioWidth: 0.68, ratioHeight: 0.38 },
  stove: { ratioX: 0.18, ratioY: 0.5, ratioWidth: 0.64, ratioHeight: 0.36 },
  cooler: { ratioX: 0.16, ratioY: 0.5, ratioWidth: 0.68, ratioHeight: 0.36 },
  light: { ratioX: 0.32, ratioY: 0.28, ratioWidth: 0.36, ratioHeight: 0.58 },
  storage: { ratioX: 0.16, ratioY: 0.44, ratioWidth: 0.68, ratioHeight: 0.44 },
  fire: { ratioX: 0.22, ratioY: 0.3, ratioWidth: 0.56, ratioHeight: 0.58 },
  activity: { ratioX: 0.2, ratioY: 0.4, ratioWidth: 0.6, ratioHeight: 0.5 }
};

function getGearItems() {
  return Object.keys(gearCatalog).map(function(id) {
    return gearCatalog[id];
  });
}

function getGearItem(id) {
  return id && gearCatalog[id] ? gearCatalog[id] : null;
}

function normalizeGearId(id) {
  return legacyGearIdMap[id] || id;
}

function sceneXFromPercent(xPercent) {
  return xPercent * BASE_SCENE_WIDTH / 100;
}

function sceneYFromPercent(yPercent) {
  return yPercent * BASE_SCENE_HEIGHT / 100;
}

function sceneXToPercent(sceneX) {
  return sceneX / BASE_SCENE_WIDTH * 100;
}

function sceneYToPercent(sceneY) {
  return sceneY / BASE_SCENE_HEIGHT * 100;
}

function scenePointToPercent(point) {
  return {
    x: sceneXToPercent(point.x),
    y: sceneYToPercent(point.y)
  };
}

function percentPointToScenePoint(point) {
  return {
    x: sceneXFromPercent(point.x),
    y: sceneYFromPercent(point.y)
  };
}

function getDefaultOwnedGearIds() {
  return getGearItems().filter(function(item) {
    return item.defaultOwned;
  }).map(function(item) {
    return item.id;
  });
}

function getDefaultEquippedGear() {
  const equipped = {};

  getGearItems().forEach(function(item) {
    if (item.defaultEquipped) {
      equipped[item.category] = item.id;
    }
  });

  return equipped;
}

// This object is the starting save file for a new player.
const defaultGameState = {
  cozyPoints: 0,
  comfort: 0,
  warmthSeconds: 0,
  campfireLevel: 1,
  ownedGear: getDefaultOwnedGearIds(),
  placedGear: [],
  equippedGear: getDefaultEquippedGear(),
  userDepthOffsetY: {},
  userGearPositions: {},
  userGearMountOffsets: {},
  activityStats: {},
  inventory: {
    fish: {},
    meals: {},
    ingredients: {}
  },
  adventure: {
    version: 4,
    storage: {
      ropeKit: 1,
      fieldLantern: 1,
      firstAidPouch: 1,
      trailRation: 2
    },
    stamina: {
      value: 100,
      updatedAt: Date.now()
    },
    unlockedMaps: ["deepMountain"],
    mapStates: {
      deepMountain: {
        bridgeRepaired: false,
        whiteShadowTrust: 0,
        cabinSearched: false,
        rangerCluesFound: 0,
        recurringEncounters: {}
      }
    },
    adventureMemories: {
      rescuedSomeone: 0,
      supernaturalEncounters: 0,
      seriousFalls: 0,
      animalTrust: 0,
      preferredTools: []
    },
    unlockedRoutes: ["deepMountain"],
    unlockedLocations: ["deepMountain"],
    discoveredKeyItems: [],
    discoveredClues: [],
    clueStages: {},
    crossMapMysteryFlags: {},
    collectedClues: [],
    itemSolutionKnowledge: [],
    adventureStarterKitMigrationVersion: 1,
    completedTrips: 0,
    pendingBackpack: {},
    pendingLoot: {},
    pendingTripSnapshot: null,
    recentAdventureHistory: [],
    lastLog: null
  },
  fishing: {
    attempts: 0,
    caught: 0,
    released: 0,
    releasedByPlayer: 0,
    koiReleaseAnimationSeen: false,
    firstStoredFishGuideSeen: false
  },
  cooking: {
    cooked: 0,
    autoCookDate: "",
    autoCookedToday: 0,
    unlockedRecipes: ["simpleGrilledFish"]
  },
  dailyWeather: {
    userSeed: "",
    dateKey: "",
    id: "",
    moodIndex: 0
  },
  todayDivinations: {
    date: "",
    active: {
      method: "",
      question: ""
    },
    records: {
      tarot: {},
      turtle: {}
    },
    rerollSalt: {
      tarot: {},
      turtle: {}
    }
  },
  dailyAdventureModifiers: {
    dateKey: "",
    generalLuck: 0,
    treasureLuck: 0,
    socialLuck: 0,
    healthLuck: 0,
    dangerSense: 0
  },
  divinationUnlocks: {
    turtleShell: false
  },
  soundJournal: {
    discovered: [],
    enabledAmbient: [],
    masterVolume: 0.7,
    muted: false
  },
  camperProfileVersion: 0,
  activeCamperIndex: 0,
  campers: [],
  vehiclePlacementMigrated: true,
  onboardingSeen: false,
  interactionGuideSeen: false,
  buildModeGuideSeen: false,
  nightUnlocked: false,
  isNight: false,
  gatherWoodMode: false,
  economyResetTo500Applied: true,
  fishingCookingResetV48Applied: true,
  lastSeen: Date.now(),
  lastSaveTime: Date.now()
};

function createDefaultGameState() {
  return {
    ...defaultGameState,
    ownedGear: defaultGameState.ownedGear.slice(),
    placedGear: defaultGameState.placedGear.slice(),
    equippedGear: { ...defaultGameState.equippedGear },
    userDepthOffsetY: { ...defaultGameState.userDepthOffsetY },
    userGearPositions: { ...defaultGameState.userGearPositions },
    userGearMountOffsets: { ...defaultGameState.userGearMountOffsets },
    activityStats: { ...defaultGameState.activityStats },
    inventory: cloneInventory(defaultGameState.inventory),
    adventure: {
      ...defaultGameState.adventure,
      storage: { ...defaultGameState.adventure.storage },
      stamina: {
        ...defaultGameState.adventure.stamina,
        updatedAt: Date.now()
      },
      unlockedMaps: defaultGameState.adventure.unlockedMaps.slice(),
      mapStates: {
        deepMountain: {
          ...defaultGameState.adventure.mapStates.deepMountain,
          recurringEncounters: { ...defaultGameState.adventure.mapStates.deepMountain.recurringEncounters }
        }
      },
      adventureMemories: {
        ...defaultGameState.adventure.adventureMemories,
        preferredTools: defaultGameState.adventure.adventureMemories.preferredTools.slice()
      },
      unlockedRoutes: defaultGameState.adventure.unlockedRoutes.slice(),
      unlockedLocations: defaultGameState.adventure.unlockedLocations.slice(),
      discoveredKeyItems: defaultGameState.adventure.discoveredKeyItems.slice(),
      discoveredClues: defaultGameState.adventure.discoveredClues.slice(),
      clueStages: { ...defaultGameState.adventure.clueStages },
      crossMapMysteryFlags: { ...defaultGameState.adventure.crossMapMysteryFlags },
      collectedClues: defaultGameState.adventure.collectedClues.slice(),
      itemSolutionKnowledge: defaultGameState.adventure.itemSolutionKnowledge.slice(),
      pendingBackpack: {},
      pendingLoot: {},
      pendingTripSnapshot: null,
      recentAdventureHistory: [],
      lastLog: null
    },
    fishing: { ...defaultGameState.fishing },
    cooking: {
      ...defaultGameState.cooking,
      unlockedRecipes: defaultGameState.cooking.unlockedRecipes.slice()
    },
    dailyWeather: { ...defaultGameState.dailyWeather },
    todayDivinations: {
      ...defaultGameState.todayDivinations,
      active: { ...defaultGameState.todayDivinations.active },
      records: {
        tarot: { ...defaultGameState.todayDivinations.records.tarot },
        turtle: { ...defaultGameState.todayDivinations.records.turtle }
      },
      rerollSalt: {
        tarot: { ...defaultGameState.todayDivinations.rerollSalt.tarot },
        turtle: { ...defaultGameState.todayDivinations.rerollSalt.turtle }
      }
    },
    dailyAdventureModifiers: { ...defaultGameState.dailyAdventureModifiers },
    divinationUnlocks: { ...defaultGameState.divinationUnlocks },
    soundJournal: cloneSoundJournal(defaultGameState.soundJournal),
    camperProfileVersion: defaultGameState.camperProfileVersion,
    activeCamperIndex: defaultGameState.activeCamperIndex,
    campers: defaultGameState.campers.map(function(camperProfile) {
      return { ...camperProfile };
    }),
    vehiclePlacementMigrated: defaultGameState.vehiclePlacementMigrated,
    onboardingSeen: defaultGameState.onboardingSeen,
    interactionGuideSeen: defaultGameState.interactionGuideSeen,
    buildModeGuideSeen: defaultGameState.buildModeGuideSeen,
    nightUnlocked: defaultGameState.nightUnlocked,
    isNight: defaultGameState.isNight,
    gatherWoodMode: defaultGameState.gatherWoodMode,
    economyResetTo500Applied: defaultGameState.economyResetTo500Applied,
    fishingCookingResetV48Applied: defaultGameState.fishingCookingResetV48Applied,
    lastSeen: Date.now(),
    lastSaveTime: Date.now()
  };
}


const economyResetCozyPoints = 500;

const camperFrameDurationMs = 120;
const camperActivityFrameDurationMs = 280;
const camperSpriteRefreshMs = 100;
const DEV_SCENE_PLACEHOLDER_SIZE = 64;

// All visual assets are listed here so art can be replaced without hunting
// through the game logic.
const assetPaths = versionAssetPaths({
  backgrounds: {
    campsiteDay: "assets/backgrounds/campsite_day.png",
    campsiteNight: "assets/backgrounds/campsite_night.png",
    lakeDay: "assets/backgrounds/lake_day.png",
    lakeNight: "assets/backgrounds/lake_night.png",
    treelineDay: "assets/backgrounds/treeline_day.png",
    treelineNight: "assets/backgrounds/treeline_night.png"
  },
  characters: {
    frameNames: {
      idle: "camper_idle.png",
      walkFrames: [
        "camper_walk_01.png",
        "camper_walk_02.png",
        "camper_walk_03.png",
        "camper_walk_04.png",
        "camper_walk_05.png",
        "camper_walk_06.png"
      ],
      carryFrames: [
        "camper_carry_wood _01.png",
        "camper_carry_wood _02.png",
        "camper_carry_wood _03.png",
        "camper_carry_wood _04.png",
        "camper_carry_wood _05.png",
        "camper_carry_wood _06.png"
      ],
      carry: "camper_carry_wood.png",
      sit: "camper_sit.png",
      sitGround: "camper_sit_ground.png",
      sitChair: "camper_sit_chair.png",
      lookLakeBack: "camper_look_lake_back.png",
      rest: "camper_rest.png",
      activityFrames: {
        cook: [
          "camper_activity_cook_01.png",
          "camper_activity_cook_02.png",
          "camper_activity_cook_03.png"
        ],
        fish: [
          "camper_activity_fish_01.png",
          "camper_activity_fish_02.png",
          "camper_activity_fish_03.png",
          "camper_activity_fish_04.png"
        ],
        birdwatch: [
          "camper_activity_birdwatch_01.png",
          "camper_activity_birdwatch_02.png",
          "camper_activity_birdwatch_03.png",
        ]
      }
    }
  },
  campfire: {
    glow: "assets/campfire/glow_fire.png",
    spark: "assets/campfire/spark.png",
    base: {
      1: "assets/campfire/campfire_lv1_base.png",
      2: "assets/campfire/campfire_lv2_base.png",
      3: "assets/campfire/campfire_lv3_base.png"
    },
    flame1: {
      1: "assets/campfire/campfire_lv1_flame_01.png",
      2: "assets/campfire/campfire_lv2_flame_01.png",
      3: "assets/campfire/campfire_lv3_flame_01.png"
    },
    flame2: {
      1: "assets/campfire/campfire_lv1_flame_02.png",
      2: "assets/campfire/campfire_lv2_flame_02.png",
      3: "assets/campfire/campfire_lv3_flame_02.png"
    }
  },
  resources: {
    wood: "assets/resources/wood_item.png"
  },
  ui: {
    day: "assets/ui/icon_day.png",
    night: "assets/ui/icon_night.png"
  }
});
