const SAVE_KEY = "cozyCampfireSave";
const APP_VERSION = typeof window !== "undefined" && window.APP_VERSION ? window.APP_VERSION : "2.7.12";

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
const BUILD_MODE_UNLOCK_PURCHASE_COUNT = 5;
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
  lookingLakeBack: { ratioX: 0.3, ratioY: 0.14, ratioWidth: 0.4, ratioHeight: 0.78 }
};
const CAMPER_THOUGHT_RECTS = {
  default: { ratioX: 0.5, ratioY: 0.06 },
  walking: { ratioX: 0.5, ratioY: 0.04 },
  carryingWood: { ratioX: 0.5, ratioY: 0.04 },
  sittingGround: { ratioX: 0.5, ratioY: 0.28 },
  sittingChair: { ratioX: 0.5, ratioY: 0.24 },
  resting: { ratioX: 0.5, ratioY: 0.4 },
  tentRest: { ratioX: 0.5, ratioY: 0.4 },
  lookingLakeBack: { ratioX: 0.5, ratioY: 0.06 }
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
    camperProfileVersion: defaultGameState.camperProfileVersion,
    activeCamperIndex: defaultGameState.activeCamperIndex,
    campers: defaultGameState.campers.map(function(camperProfile) {
      return { ...camperProfile };
    }),
    vehiclePlacementMigrated: defaultGameState.vehiclePlacementMigrated,
    onboardingSeen: defaultGameState.onboardingSeen,
    interactionGuideSeen: defaultGameState.interactionGuideSeen,
    buildModeGuideSeen: defaultGameState.buildModeGuideSeen,
    lastSaveTime: Date.now()
  };
}

const campfireUpgradeCosts = {
  1: 45,
  2: 140
};

const campfireBaseRates = {
  1: 1,
  2: 2.2,
  3: 4
};

const campfireBurnRates = {
  1: 1,
  2: 0.85,
  3: 0.55
};

const baseOfflineSeconds = 1800;
const maxWoodItems = 5;
const camperFrameDurationMs = 120;
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
      rest: "camper_rest.png"
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

let gameState = createDefaultGameState();

// The camper is not saved. It is just the current animation state.
let camper = {
  x: 34,
  y: 75,
  state: "idle",
  pose: "idle",
  target: null,
  actionAfterArrival: null,
  currentAction: null,
  actionTimer: 0,
  targetWoodId: null,
  woodCollectionSource: null,
  carryingWood: false,
  facing: "right",
  animationStartedAt: Date.now(),
  pathPoints: [],
  pathSegmentLengths: [],
  pathStartedAt: 0,
  pathDurationMs: 0,
  pathLength: 0,
  interactionTargetId: ""
};

let woodItems = [];
let nextWoodId = 1;
let actionQueue = [];
let activeQueuedAction = null;
let nextActionQueueId = 1;
let uiDisplayMode = 0;
let selectedActionTargetElement = null;
let selectedActionTargetKey = "";
let selectedBuildItemKey = "";
let camperThoughtAction = "";
let camperThoughtText = "";
let camperMotionFrameId = null;
let sceneDepthControlLayer = null;
let sceneDepthControlPanel = null;
let depthControlHoverTargetId = "";
let depthControlPanelHovered = false;
let depthControlHideTimer = null;
let buildModeActive = false;
let buildDragState = null;
let buildHitCanvas = null;
let buildHitCanvasContext = null;
let suppressNextBuildClick = false;

// These variables connect JavaScript to the HTML.
const cozyPointsAmount = document.getElementById("cozyPointsAmount");
const comfortAmount = document.getElementById("comfortAmount");
const warmthSecondsAmount = document.getElementById("warmthSecondsAmount");
const cozyPointStatus = document.getElementById("cozyPointStatus");
const comfortStatus = comfortAmount.closest(".resource-pill");
const warmthStatus = warmthSecondsAmount.closest(".resource-pill");
const cozyGainLayer = document.getElementById("cozyGainLayer");
const welcomeMessage = document.getElementById("welcomeMessage");
const gameViewport = document.querySelector(".game-viewport");
const campScene = document.getElementById("campScene");
const sceneBackground = document.getElementById("sceneBackground");
const treelineImage = document.getElementById("treelineImage");
const lakeImage = document.getElementById("lakeImage");
const woodLayer = document.getElementById("woodLayer");
const sceneContent = document.getElementById("sceneContent");
const gearLayer = document.getElementById("gearLayer");
const campfire = document.getElementById("campfire");
const fireGlowImage = document.getElementById("fireGlowImage");
const campfireBaseImage = document.getElementById("campfireBaseImage");
const campfireFlameImage = document.getElementById("campfireFlameImage");
const camperElement = document.getElementById("camper");
const camperThoughtBubble = document.getElementById("camperThoughtBubble");
const camperStateText = document.getElementById("camperStateText");
const shopToggle = document.getElementById("shopToggle");
const shopDrawer = document.getElementById("shopDrawer");
const shopBackdrop = document.getElementById("shopBackdrop");
const closeShopButton = document.getElementById("closeShopButton");
const shopContent = document.getElementById("shopContent");
const shopTabsContainer = document.getElementById("shopTabs");
let shopTabs = [];
let shopSections = [];
let shopCards = {};
const gatherWoodToggle = document.getElementById("gatherWoodToggle");
const gatherModeLabel = document.getElementById("gatherModeLabel");
const dayNightToggle = document.getElementById("dayNightToggle");
const dayNightIcon = document.getElementById("dayNightIcon");
const dayNightLabel = document.getElementById("dayNightLabel");
const buildModeToggle = document.getElementById("buildModeToggle");
const buildModeLabel = document.getElementById("buildModeLabel");
const uiDisplayToggle = document.getElementById("uiDisplayToggle");
const uiDisplayLabel = document.getElementById("uiDisplayLabel");
const onboardingHelpButton = document.getElementById("onboardingHelpButton");
const camperProfileButton = document.getElementById("camperProfileButton");
const onboardingLayer = document.getElementById("onboardingLayer");
const onboardingPointer = document.getElementById("onboardingPointer");
const onboardingPanel = document.getElementById("onboardingPanel");
const onboardingStepLabel = document.getElementById("onboardingStepLabel");
const onboardingTitle = document.getElementById("onboardingTitle");
const onboardingBody = document.getElementById("onboardingBody");
const onboardingPrimaryButton = document.getElementById("onboardingPrimaryButton");
const onboardingSkipButton = document.getElementById("onboardingSkipButton");
const camperProfileLayer = document.getElementById("camperProfileLayer");
const camperProfilePanel = document.getElementById("camperProfilePanel");
const camperProfileStepLabel = document.getElementById("camperProfileStepLabel");
const camperProfileTitle = document.getElementById("camperProfileTitle");
const camperProfileBody = document.getElementById("camperProfileBody");
const camperNameStep = document.getElementById("camperNameStep");
const camperNameInput = document.getElementById("camperNameInput");
const camperAppearanceStep = document.getElementById("camperAppearanceStep");
const camperAppearancePreview = document.getElementById("camperAppearancePreview");
const camperAppearanceControls = document.getElementById("camperAppearanceControls");
const camperQuestionStep = document.getElementById("camperQuestionStep");
const camperQuestionText = document.getElementById("camperQuestionText");
const camperQuestionOptions = document.getElementById("camperQuestionOptions");
const camperResultStep = document.getElementById("camperResultStep");
const camperCardPortrait = document.getElementById("camperCardPortrait");
const camperCardBackground = document.getElementById("camperCardBackground");
const camperCardCamper = document.getElementById("camperCardCamper");
const camperCardCloseButton = document.getElementById("camperCardCloseButton");
const camperResultName = document.getElementById("camperResultName");
const camperResultTitle = document.getElementById("camperResultTitle");
const camperResultDescription = document.getElementById("camperResultDescription");
const camperCatchphraseText = document.getElementById("camperCatchphraseText");
const camperNameEditInput = document.getElementById("camperNameEditInput");
const camperNameEditButton = document.getElementById("camperNameEditButton");
const camperCatchphraseEditInput = document.getElementById("camperCatchphraseEditInput");
const camperCatchphraseEditButton = document.getElementById("camperCatchphraseEditButton");
const camperRetakeQuizButton = document.getElementById("camperRetakeQuizButton");
const camperRecustomizeButton = document.getElementById("camperRecustomizeButton");
const camperProfilePrimaryButton = document.getElementById("camperProfilePrimaryButton");
const camperProfileSecondaryButton = document.getElementById("camperProfileSecondaryButton");
const resetSaveButton = document.getElementById("resetSaveButton");
const campfireLevelAmount = document.getElementById("campfireLevelAmount");
const cozyRateAmount = document.getElementById("cozyRateAmount");
const offlineCapAmount = document.getElementById("offlineCapAmount");
const statusLine = document.getElementById("statusLine");

function setStyleValue(element, property, value) {
  if (!element) {
    return;
  }

  const nextValue = String(value);

  if (element.style[property] !== nextValue) {
    element.style[property] = nextValue;
  }
}

function setStyleProperty(element, property, value) {
  if (!element) {
    return;
  }

  const nextValue = String(value);

  if (element.style.getPropertyValue(property) !== nextValue) {
    element.style.setProperty(property, nextValue);
  }
}

function setDatasetValue(element, key, value) {
  if (!element || !element.dataset) {
    return;
  }

  const nextValue = String(value);

  if (element.dataset[key] !== nextValue) {
    element.dataset[key] = nextValue;
  }
}

function setElementClassName(element, className) {
  if (element && element.className !== className) {
    element.className = className;
  }
}

function syncSceneScale() {
  if (!campScene || !sceneContent) {
    return;
  }

  const sceneRect = campScene.getBoundingClientRect();
  const scale = Math.min(
    sceneRect.width / BASE_SCENE_WIDTH,
    sceneRect.height / BASE_SCENE_HEIGHT
  );

  setStyleProperty(sceneContent, "--scene-scale", Number.isFinite(scale) && scale > 0 ? scale : 1);
}

// These are points in the scene. The camper walks between them.
const campSpots = {
  fire: { x: 39, y: 79 },
  fireSeat: { x: 33, y: 80 },
  fireSeatRight: { x: 46, y: 80.5 },
  lake: { x: 50, y: 54 },
  tent: { x: 54, y: 69.5 },
  rest: { x: 24, y: 81 }
};

let activeShopFilter = "all";
let statusToastTimer = null;
let welcomeToastTimer = null;
let saveWasResetFromUrl = false;
let loadedExistingSaveWithoutCamperProfile = false;
const ONBOARDING_FIRST_GEAR_ID = "sealChair";
let onboardingActive = false;
let onboardingManual = false;
let activeGuideType = "onboarding";
let activeStandaloneGuideId = "";
let onboardingStepIndex = 0;
let onboardingHighlightedElement = null;
let onboardingCardFocusElement = null;
let camperProfileActive = false;
let camperProfileMode = "required";
let camperProfileStep = "name";
let camperProfileQuestionIndex = 0;
let camperProfileQuestions = [];
let camperProfileAnswers = [];
let camperProfileDraftName = "";
let camperProfileDraftResult = null;
let camperProfileDraftAppearance = null;
let camperCardEditingField = "";

const CAMPER_LAYER_SHEET_ROOT = "assets/characters";
const CAMPER_SHEET_COLUMNS = 7;
const CAMPER_SHEET_ROWS = 3;
const CAMPER_IDLE_FRAME_NAME = "camper_idle.png";
const CAMPER_SHEET_FRAME_NAMES = [
  "camper_idle.png",
  "camper_walk_01.png",
  "camper_walk_02.png",
  "camper_walk_03.png",
  "camper_walk_04.png",
  "camper_walk_05.png",
  "camper_walk_06.png",
  "camper_carry_wood _01.png",
  "camper_carry_wood _02.png",
  "camper_carry_wood _03.png",
  "camper_carry_wood _04.png",
  "camper_carry_wood _05.png",
  "camper_carry_wood _06.png",
  "camper_carry_wood.png",
  "camper_sit.png",
  "camper_sit_ground.png",
  "camper_sit_chair.png",
  "camper_look_lake_back.png",
  "camper_rest.png"
];
const CAMPER_LAYER_RENDER_ORDER = [
  { id: "bodyBase", sheet: "camper_body_base.png" },
  { id: "eyes", sheet: "camper_eye_bright.png", appearanceCategory: "eyes" },
  { id: "nose", sheet: "camper_nose_tiny.png", appearanceCategory: "nose" },
  { id: "mouth", sheet: "camper_mouth_smallsmile.png", appearanceCategory: "mouth" },
  { id: "clothes", sheet: "camper_top_1.png", appearanceCategory: "clothes" },
  { id: "hair", sheet: "camper_hair_short.png", appearanceCategory: "hair" },
  { id: "accessory", sheet: "", appearanceCategory: "accessory" }
];
const CAMPER_HAIR_COLOR_RANGE = { min: 0, max: 360, step: 1, defaultValue: 0 };
const CAMPER_APPEARANCE_LEGACY_FIELD_MAP = {
  clothes: "top"
};
const CAMPER_APPEARANCE_CATEGORIES = [
  { id: "hair", label: "发型", renderLayerId: "hair" },
  { id: "hairColor", label: "发色", renderLayerId: "hair", control: "range", min: CAMPER_HAIR_COLOR_RANGE.min, max: CAMPER_HAIR_COLOR_RANGE.max, step: CAMPER_HAIR_COLOR_RANGE.step, defaultValue: CAMPER_HAIR_COLOR_RANGE.defaultValue },
  { id: "eyes", label: "眼睛", renderLayerId: "eyes" },
  { id: "nose", label: "鼻子", renderLayerId: "nose" },
  { id: "mouth", label: "嘴巴", renderLayerId: "mouth" },
  { id: "clothes", label: "衣服", renderLayerId: "clothes" },
  { id: "accessory", label: "配饰", renderLayerId: "accessory" },
];
const CAMPER_APPEARANCE_OPTIONS = {
  hair: [
    { id: "bob", label: "短发", assetSheet: "camper_hair_bob.png" },
    { id: "short", label: "少年发", assetSheet: "camper_hair_short.png" },
    { id: "short-curl", label: "短卷发", assetSheet: "camper_hair_shortcurl.png" },
    { id: "longb-braided", label: "麻花辫", assetSheet: "camper_hair_longbraided.png" }
  ],
  accessory: [
    { id: "none", label: "无配饰", assetSheet: "" },
    { id: "hat", label: "帽子", assetSheet: "camper_accessory_hat.png" },
    { id: "hat2", label: "帽兜", assetSheet: "camper_accessory_hat2.png" }
  ],
  eyes: [
    { id: "watering", label: "水汪汪", assetSheet: "camper_eye_watering.png" },
    { id: "bright", label: "明亮眼睛", assetSheet: "camper_eye_bright.png" },
    { id: "smile", label: "眯眯眼", assetSheet: "camper_eye_smile.png" },
    { id: "determined", label: "坚毅眼神", assetSheet: "camper_eye_determined.png" }
  ],
  nose: [
    { id: "tiny", label: "小鼻子", assetSheet: "camper_nose_tiny.png" },
    { id: "button", label: "圆鼻子", assetSheet: "camper_nose_button.png" },
    { id: "determined", label: "利落鼻子", assetSheet: "camper_nose_determined.png" }
  ],
  mouth: [
    { id: "small-smile", label: "微笑", assetSheet: "camper_mouth_smallsmile.png" },
    { id: "laugh", label: "开朗", assetSheet: "camper_mouth_laugh.png" },
    { id: "determined", label: "坚定", assetSheet: "camper_mouth_determined.png" }
  ],
  clothes: [
    { id: "top-1", label: "秋野漫步", assetSheet: "camper_top_1.png" }, 
    { id: "top-2", label: "雨林夜行", assetSheet: "camper_top_2.png" },
    { id: "top-3", label: "森间茶歇", assetSheet: "camper_top_3.png" },
    { id: "top-4", label: "山径轻装", assetSheet: "camper_top_4.png" },
    { id: "top-5", label: "松影斗篷", assetSheet: "camper_top_5.png" }
  ]
};

const onboardingSteps = [
  {
    id: "gather",
    title: "Start with Gather"
  },
  {
    id: "fire",
    title: "Feed the fire"
  },
  {
    id: "warmth",
    title: "Watch Warmth"
  },
  {
    id: "cozy",
    title: "Earn Cozy Points"
  },
  {
    id: "shop",
    title: "Open Shop"
  },
  {
    id: "chair",
    title: "Buy the first chair"
  },
  {
    id: "comfort",
    title: "Comfort makes it faster"
  }
];

const standaloneGuides = {
  tapInteraction: {
    id: "tapInteraction",
    title: "Tap camp items",
    stepLabel: "Guide +",
    primaryLabel: "Got it",
    body: "Some camp items can be tapped to interact with. Try tapping this item."
  },
  buildMode: {
    id: "buildMode",
    title: "Build Mode Unlocked",
    stepLabel: "Build",
    primaryLabel: "Got it",
    body: "Tap the Build button to rearrange your camp. Drag items to move them, use the ↑ ↓ buttons to change front/back layering, then tap Done when you're finished."
  }
};

const camperActionLabels = {
  idle: "Pausing around camp",
  wandering: "Wandering around camp",
  movingToWood: "Walking over to fallen branches",
  pickupWood: "Picking up branches",
  carryingWoodToFire: "Carrying branches to the campfire",
  addingWoodToFire: "Adding branches to the fire",
  resting: "Resting in the quiet grass",
  lookingAtLake: "Looking across the lake",
  sittingByFire: "Sitting by the campfire",
  sittingOnFurniture: "Settling into camp seating",
  sittingOnChair: "Settling into the camp chair",
  observingGear: "Inspecting camp gear",
  tentRest: "Resting inside the tent"
};

const camperThoughtLines = {
  wandering: ["随便走走", "看看营地", "今天风不错", "找个舒服角落", "慢慢来就好"],
  lookingAtLake: ["看看湖吧", "水面好安静", "那边有光", "发会儿呆", "湖风刚刚好"],
  sittingByFire: ["烤会儿火吧", "火苗真暖", "添点柴更好", "这里最舒服", "听木柴噼啪"],
  sittingOnFurniture: ["坐一会儿", "这椅子不错", "休息一下", "舒服多了", "营地越来越像样"],
  sittingOnChair: ["坐一会儿", "这椅子不错", "休息一下", "舒服多了", "看看火光"],
  observingGear: ["看看这个", "这里好像不错", "检查一下小角落", "这个位置可以"],
  resting: ["小累一会儿", "闭眼休息", "草地很软", "先躺一下", "慢慢恢复"],
  tentRest: ["钻进帐篷", "帐篷里好安心", "小睡一会儿", "外面风声好轻", "今晚睡这里"]
};

const CAMPER_PROFILE_VERSION = 1;
const CAMPER_PROFILE_QUESTION_COUNT = 5;
const CAMPER_PERSONALITIES = {
  slowMood: {
    title: "慢半拍氛围型",
    description: "总是比世界慢一点点，但刚好慢到能听见风声。这个 Camper 会把营地过成一段软软的留白。",
    catchphrase: "不急，风会替我计时。",
    cardBackground: "assets/backgrounds/camper-card/slowMood.png",
    idleWeights: { wandering: 2, lookingAtLake: 5, sittingByFire: 3, resting: 4, tentRest: 2 },
    bubbles: {
      wandering: ["不急，路会自己出现", "先绕一下也不错"],
      lookingAtLake: ["湖面替我想事情", "这里适合慢慢发呆"],
      resting: ["暂停也算一种进度", "让我缓冲一下"],
      sittingByFire: ["火苗慢慢跳就好"]
    }
  },
  lampKeeper: {
    title: "小灯守护型",
    description: "会默默确认每个角落都有一点光。不是很大声，但营地一暗下来就会让人安心。",
    catchphrase: "亮一点，心就稳一点。",
    cardBackground: "assets/backgrounds/camper-card/lampKeeper.png",
    idleWeights: { wandering: 2, lookingAtLake: 2, sittingByFire: 4, resting: 2, tentRest: 3 },
    nightWeights: { tentRest: 3, sittingByFire: 2 },
    bubbles: {
      wandering: ["那边有点暗，我看看", "小灯应该够亮吧"],
      sittingByFire: ["守一下这团光", "亮着就安心"],
      tentRest: ["灯留一盏就好"],
      lookingAtLake: ["水上有一点光"]
    }
  },
  sitFirst: {
    title: "坐下再说型",
    description: "遇事先找一个能坐的地方。坐稳以后，连空气都会变得比较好商量。",
    catchphrase: "先坐下，其他事等会儿说。",
    cardBackground: "assets/backgrounds/camper-card/sitFirst.png",
    idleWeights: { sittingOnFurniture: 6, sittingByFire: 4, resting: 3, wandering: 1 },
    bubbles: {
      sittingOnFurniture: ["坐下再决定", "这个位置有前途", "先让膝盖同意"],
      sittingByFire: ["这边也能坐", "坐着看火比较对"],
      wandering: ["找找有没有能坐的"]
    }
  },
  gearHoarder: {
    title: "囤装备妖怪型",
    description: "看到空地就想象那里能放点什么。营地不是乱，是很多小心思暂时住在一起。",
    catchphrase: "这个以后肯定用得上。",
    cardBackground: "assets/backgrounds/camper-card/gearHoarder.png",
    idleWeights: { observingGear: 5, wandering: 3, sittingByFire: 2, sittingOnFurniture: 2 },
    bubbles: {
      observingGear: ["这个放这儿有道理", "再多一点点就完美", "我只是看看库存"],
      wandering: ["空地在召唤我", "那里好像还能摆点什么"],
      sittingOnFurniture: ["装备多了，心就稳了"]
    }
  },
  carefulArranger: {
    title: "认真摆放型",
    description: "会认真对齐看不见的线。别人看到的是营地，它看到的是刚刚好的位置。",
    catchphrase: "再挪一点点就刚好。",
    cardBackground: "assets/backgrounds/camper-card/carefulArranger.png",
    idleWeights: { observingGear: 6, wandering: 2, lookingAtLake: 2, sittingOnFurniture: 2 },
    bubbles: {
      observingGear: ["这里差半步", "角度好像可以更乖", "摆正一点点"],
      wandering: ["从这边看比较顺", "我检查一下动线"],
      lookingAtLake: ["湖边这条线很好"]
    }
  },
  vanishSoftly: {
    title: "消失一下型",
    description: "不是离开，只是需要把自己收进安静里。过一会儿会带着一点点电量回来。",
    catchphrase: "我在，只是先安静一下。",
    cardBackground: "assets/backgrounds/camper-card/vanishSoftly.png",
    idleWeights: { tentRest: 5, resting: 5, lookingAtLake: 3, wandering: 1 },
    nightWeights: { tentRest: 4, resting: 2 },
    bubbles: {
      tentRest: ["我离线一下", "帐篷里信号比较软"],
      resting: ["把自己放低一点", "安静充电中"],
      lookingAtLake: ["我在，但先不说话"]
    }
  },
  prettyFrame: {
    title: "精致摆拍型",
    description: "会在普通时刻里找到好看的角度。连一根树枝，都可能被它看成今日主角。",
    catchphrase: "等一下，这个角度很会。",
    cardBackground: "assets/backgrounds/camper-card/prettyFrame.png",
    idleWeights: { observingGear: 4, lookingAtLake: 4, wandering: 2, sittingOnFurniture: 3 },
    bubbles: {
      observingGear: ["这个角度很上镜", "先别动，画面刚好", "这里有点可爱"],
      lookingAtLake: ["湖面像滤镜", "这光线很会"],
      sittingOnFurniture: ["坐姿也要有构图"]
    }
  }
};

const CAMPER_PROFILE_QUESTIONS = [
  {
    text: "空出来的晚上突然很长，你通常会怎么浪费？",
    options: [
      { text: "开一盏小灯，假装自己在经营深夜小店", traits: { lampKeeper: 2, vanishSoftly: 1 } },
      { text: "坐着不动，等脑袋自己变安静", traits: { sitFirst: 2, slowMood: 1 } },
      { text: "把桌面上所有东西重新排一遍", traits: { carefulArranger: 2, prettyFrame: 1 } },
      { text: "翻出一个很久没用的小东西，并觉得它马上会派上用场", traits: { gearHoarder: 2 } }
    ]
  },
  {
    text: "朋友迟到二十分钟，你比较像哪一种？",
    options: [
      { text: "找个地方坐下，顺便把这二十分钟过得很完整", traits: { sitFirst: 2, slowMood: 1 } },
      { text: "沿着附近慢慢走一圈，像在检查地图边缘", traits: { slowMood: 2, prettyFrame: 1 } },
      { text: "去便利店买一个本来不需要的小玩意", traits: { gearHoarder: 2, lampKeeper: 1 } },
      { text: "回一句没事，然后短暂消失在自己的世界里", traits: { vanishSoftly: 2 } }
    ]
  },
  {
    text: "房间里最容易自己变多的东西是？",
    options: [
      { text: "收纳盒、袋子、备用袋子、备用备用袋子", traits: { gearHoarder: 2, carefulArranger: 1 } },
      { text: "小灯、香薰、杯垫这种不太必要但很安心的东西", traits: { lampKeeper: 2, prettyFrame: 1 } },
      { text: "椅子上临时放一下的衣服", traits: { sitFirst: 1, vanishSoftly: 2 } },
      { text: "空白本子和没有写完的清单", traits: { carefulArranger: 2, slowMood: 1 } }
    ]
  },
  {
    text: "你今天最像哪种天气？",
    options: [
      { text: "阴天，但云很柔软", traits: { slowMood: 2, vanishSoftly: 1 } },
      { text: "傍晚的小晴天，适合拍照", traits: { prettyFrame: 2, lampKeeper: 1 } },
      { text: "小雨，正好适合躲起来", traits: { vanishSoftly: 2 } },
      { text: "晴一阵忙一阵，还想整理阳台", traits: { carefulArranger: 2, gearHoarder: 1 } }
    ]
  },
  {
    text: "看到一个空角落，你第一反应是？",
    options: [
      { text: "这里可以放一张椅子", traits: { sitFirst: 2 } },
      { text: "这里需要一点点光", traits: { lampKeeper: 2 } },
      { text: "这里适合放一个不解释用途的箱子", traits: { gearHoarder: 2 } },
      { text: "先别放，空着也有构图", traits: { prettyFrame: 2, slowMood: 1 } }
    ]
  },
  {
    text: "朋友说“随便弄点吃的”，你会？",
    options: [
      { text: "认真把随便变成三种选择", traits: { carefulArranger: 2 } },
      { text: "先问能不能坐着等", traits: { sitFirst: 2 } },
      { text: "拿出一个刚好能用上的小工具", traits: { gearHoarder: 2 } },
      { text: "说好，然后做出一份很有氛围的简单东西", traits: { lampKeeper: 1, prettyFrame: 2 } }
    ]
  },
  {
    text: "哪句话最像你？",
    options: [
      { text: "等一下，我把这个角度摆好。", traits: { carefulArranger: 2, prettyFrame: 1 } },
      { text: "我先坐下，坐下以后什么都能谈。", traits: { sitFirst: 2 } },
      { text: "我有一个东西，虽然现在用不上。", traits: { gearHoarder: 2 } },
      { text: "我在听，只是看起来像没开机。", traits: { vanishSoftly: 2, slowMood: 1 } }
    ]
  },
  {
    text: "一张很普通的桌子，你会先注意什么？",
    options: [
      { text: "有没有刚好放杯子的地方", traits: { sitFirst: 1, carefulArranger: 1 } },
      { text: "桌面会不会反光，很适合拍东西", traits: { prettyFrame: 2 } },
      { text: "下面还能不能塞个篮子", traits: { gearHoarder: 2 } },
      { text: "旁边如果有小灯就好了", traits: { lampKeeper: 2 } }
    ]
  },
  {
    text: "突然有一小时没人找你，你会把它放在哪里？",
    options: [
      { text: "放在窗边，慢慢发呆", traits: { slowMood: 2, vanishSoftly: 1 } },
      { text: "放进被窝或帐篷这种地方", traits: { vanishSoftly: 2 } },
      { text: "放在要整理的小角落", traits: { carefulArranger: 2 } },
      { text: "放在一个新买但没拆的小东西旁边", traits: { gearHoarder: 2 } }
    ]
  },
  {
    text: "你的包里最可能多带什么？",
    options: [
      { text: "一盏小灯或备用电池", traits: { lampKeeper: 2 } },
      { text: "不一定用得上但很有安全感的工具", traits: { gearHoarder: 2 } },
      { text: "小本子，写两行又合上", traits: { slowMood: 1, carefulArranger: 1 } },
      { text: "一块布，因为也许能当背景", traits: { prettyFrame: 2 } }
    ]
  },
  {
    text: "别人来你房间前十分钟，你会？",
    options: [
      { text: "只整理他们看得到的那一面", traits: { prettyFrame: 2 } },
      { text: "突然进入认真摆放模式", traits: { carefulArranger: 2 } },
      { text: "把东西收到一个神秘袋子里", traits: { gearHoarder: 1, vanishSoftly: 1 } },
      { text: "先坐下来冷静，房间会理解我的", traits: { sitFirst: 2, slowMood: 1 } }
    ]
  },
  {
    text: "如果要给今天加一个背景音，你选？",
    options: [
      { text: "很远的水声", traits: { slowMood: 2 } },
      { text: "小灯泡轻轻亮起来的声音", traits: { lampKeeper: 2 } },
      { text: "拉链打开、盒子扣上的声音", traits: { gearHoarder: 2 } },
      { text: "椅子被拖到刚好位置的声音", traits: { sitFirst: 1, carefulArranger: 1 } }
    ]
  },
  {
    text: "走进一家很小的杂货店，你会先？",
    options: [
      { text: "看最角落那排奇怪但实用的东西", traits: { gearHoarder: 2 } },
      { text: "看灯和杯子摆得好不好", traits: { lampKeeper: 1, prettyFrame: 1 } },
      { text: "找店里有没有能坐一下的位置", traits: { sitFirst: 2 } },
      { text: "慢慢逛，不急着买", traits: { slowMood: 2 } }
    ]
  },
  {
    text: "大家都在聊天，你忽然安静下来是因为？",
    options: [
      { text: "在看窗外一块很好看的光", traits: { prettyFrame: 2, slowMood: 1 } },
      { text: "电量下降，需要藏一小会儿", traits: { vanishSoftly: 2 } },
      { text: "想到一个东西应该换个位置", traits: { carefulArranger: 2 } },
      { text: "椅子太舒服，语言系统暂停", traits: { sitFirst: 2 } }
    ]
  },
  {
    text: "如果周末只能完成一件小事，你选？",
    options: [
      { text: "把某个角落布置得像样一点", traits: { carefulArranger: 2, prettyFrame: 1 } },
      { text: "补齐一个缺了很久的小装备", traits: { gearHoarder: 2 } },
      { text: "找到一个新的固定休息点", traits: { sitFirst: 2 } },
      { text: "什么也不完成，但认真休息", traits: { vanishSoftly: 2, slowMood: 1 } }
    ]
  },
  {
    text: "你最能接受哪种混乱？",
    options: [
      { text: "看起来乱，但每样东西都有故事", traits: { gearHoarder: 2 } },
      { text: "桌面乱，但灯光必须温柔", traits: { lampKeeper: 2 } },
      { text: "过程乱，最后画面好看就行", traits: { prettyFrame: 2 } },
      { text: "外面乱，我躲一下就好了", traits: { vanishSoftly: 2 } }
    ]
  },
  {
    text: "有人问你想去哪儿，你脑中先出现的是？",
    options: [
      { text: "能看到水的地方", traits: { slowMood: 2 } },
      { text: "有舒服座位的地方", traits: { sitFirst: 2 } },
      { text: "有小灯和木头味道的地方", traits: { lampKeeper: 2 } },
      { text: "可以拍到自然光的地方", traits: { prettyFrame: 2 } }
    ]
  },
  {
    text: "你对“以后可能会用到”的态度是？",
    options: [
      { text: "这是宇宙给我的合理借口", traits: { gearHoarder: 2 } },
      { text: "可以，但要放在对的位置", traits: { carefulArranger: 2 } },
      { text: "如果能让我更安心，就留下", traits: { lampKeeper: 1, vanishSoftly: 1 } },
      { text: "先拍一张，之后再决定", traits: { prettyFrame: 2 } }
    ]
  }
];

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function formatNumber(number) {
  const safeNumber = Number.isFinite(number) ? number : 0;

  if (safeNumber < 100) {
    return safeNumber.toLocaleString(undefined, {
      maximumFractionDigits: 1
    });
  }

  return Math.floor(safeNumber).toLocaleString();
}

function formatShortTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) {
    return hours + "h " + minutes + "m";
  }

  if (safeSeconds < 60) {
    return safeSeconds + "s";
  }

  return minutes + " min";
}

function showToast(element, message, duration, timerName) {
  if (!element || !message) {
    return;
  }

  element.textContent = message;
  element.classList.add("show");

  if (timerName === "welcome") {
    clearTimeout(welcomeToastTimer);
    welcomeToastTimer = setTimeout(function() {
      element.classList.remove("show");
    }, duration);
    return;
  }

  clearTimeout(statusToastTimer);
  statusToastTimer = setTimeout(function() {
    element.classList.remove("show");
  }, duration);
}

function showWelcome(message) {
  showToast(welcomeMessage, message, 3600, "welcome");
}

function setStatus(message) {
  showToast(statusLine, message, 2400, "status");
}

function applyUiDisplayMode() {
  document.body.classList.toggle("queue-numbers-hidden", uiDisplayMode === 1);
  document.body.classList.toggle("ui-hidden", uiDisplayMode === 2);

  if (uiDisplayMode === 2 && isShopOpen()) {
    closeShop();
  }

  if (uiDisplayLabel) {
    uiDisplayLabel.textContent = uiDisplayMode === 0 ? "UI" : uiDisplayMode === 1 ? "#" : "Show";
  }

  if (uiDisplayToggle) {
    const label = uiDisplayMode === 0 ? "Hide queue numbers" : uiDisplayMode === 1 ? "Hide UI" : "Show UI";
    uiDisplayToggle.setAttribute("aria-label", label);
    uiDisplayToggle.setAttribute("title", label);
  }
}

function toggleUiDisplayMode() {
  uiDisplayMode = (uiDisplayMode + 1) % 3;
  applyUiDisplayMode();
}

function isCampfireUpgradeItem(item) {
  return Boolean(item && item.interactions && item.interactions.upgradeCampfire);
}

function getPurchasedNonCampfireGearCount(state) {
  const campState = state || gameState;

  return getOwnedGearItems(campState).filter(function(item) {
    return item && !item.defaultOwned && !isCampfireUpgradeItem(item);
  }).length;
}

function isBuildModeUnlocked(state) {
  return getPurchasedNonCampfireGearCount(state || gameState) >= BUILD_MODE_UNLOCK_PURCHASE_COUNT;
}

function isBuildModeActive() {
  return buildModeActive;
}

function updateBuildModeControls() {
  const unlocked = isBuildModeUnlocked();

  if (!unlocked && buildModeActive) {
    exitBuildMode();
    return;
  }

  document.body.classList.toggle("build-mode", buildModeActive);

  if (buildModeToggle) {
    buildModeToggle.classList.toggle("hidden", !unlocked);
    buildModeToggle.classList.toggle("active", buildModeActive);
    buildModeToggle.setAttribute("aria-pressed", buildModeActive ? "true" : "false");
    buildModeToggle.setAttribute("aria-label", buildModeActive ? "Exit Build Mode" : "Enter Build Mode");
    buildModeToggle.setAttribute("title", buildModeActive ? "Done" : "Build Mode");
  }

  if (buildModeLabel) {
    buildModeLabel.textContent = buildModeActive ? "Done" : "Build";
  }
}

function getDirectChildByClass(element, className) {
  if (!element) {
    return null;
  }

  for (let index = 0; index < element.children.length; index += 1) {
    const child = element.children[index];

    if (child.classList && child.classList.contains(className)) {
      return child;
    }
  }

  return null;
}

function getTargetOutlineElement(target) {
  let outlineImage = getDirectChildByClass(target, "target-outline-image");

  target.classList.add("target-outline-enabled");

  if (outlineImage && outlineImage.tagName !== "IMG") {
    const replacement = document.createElement("img");
    replacement.className = "target-outline-image";
    replacement.alt = "";
    replacement.setAttribute("aria-hidden", "true");
    outlineImage.replaceWith(replacement);
    outlineImage = replacement;
  }

  if (!outlineImage) {
    outlineImage = document.createElement("img");
    outlineImage.className = "target-outline-image";
    outlineImage.alt = "";
    outlineImage.setAttribute("aria-hidden", "true");
    target.insertBefore(outlineImage, target.firstChild);
  }

  return outlineImage;
}

function removeTargetOutlineElement(target) {
  const outlineImage = getDirectChildByClass(target, "target-outline-image");

  if (outlineImage) {
    outlineImage.remove();
  }

  target.classList.remove("target-outline-enabled");
}

function getGearOutlineBasePath(item) {
  if (!item || !item.image) {
    return "";
  }

  const imagePath = item.image.split("?")[0];

  if (!imagePath.startsWith("assets/gear/") || !imagePath.endsWith("/icon.png")) {
    return "";
  }

  return imagePath.replace(/\/icon\.png$/, "/icon_base.png");
}

function getTargetOutlineBaseAssetPath(target) {
  if (target && target.classList && target.classList.contains("wood-item")) {
    return assetPaths.resources.wood;
  }

  if (target === campfire) {
    return assetPaths.campfire.base[gameState.campfireLevel] || "";
  }

  const targetId = target && target.dataset ? target.dataset.actionTargetId : "";
  const item = getGearItem(targetId);

  return getGearOutlineBasePath(item);
}

function shouldUseTargetOutline(target) {
  return Boolean(getTargetOutlineBaseAssetPath(target));
}

function isOutlineSourceImage(image) {
  return Boolean(
    image &&
    image.classList &&
    image.classList.contains("object-image") &&
    !image.classList.contains("target-outline-image") &&
    !image.classList.contains("tent-glow") &&
    !image.classList.contains("lantern-glow") &&
    !image.classList.contains("string-lights-glow") &&
    !image.classList.contains("fire-glow-img") &&
    !image.classList.contains("campfire-flame-img")
  );
}

function getTargetOutlineSourceImage(target) {
  if (!target) {
    return null;
  }

  if (target.classList.contains("wood-item")) {
    return target.querySelector(".wood-image");
  }

  if (target === campfire) {
    return campfireBaseImage;
  }

  return target.querySelector(".gear-layer-base") || Array.from(target.querySelectorAll(".object-image")).find(isOutlineSourceImage);
}

function syncTargetOutlineLayout(outlineImage, sourceImage) {
  if (!outlineImage || !sourceImage) {
    return;
  }

  outlineImage.style.right = "auto";
  outlineImage.style.bottom = "auto";
  outlineImage.style.objectFit = "contain";

  if (!sourceImage.classList.contains("object-image") || typeof window === "undefined") {
    outlineImage.style.left = "0";
    outlineImage.style.top = "0";
    outlineImage.style.width = "100%";
    outlineImage.style.height = "100%";
    return;
  }

  const sourceStyles = window.getComputedStyle(sourceImage);

  outlineImage.style.left = sourceStyles.left === "auto" ? "0" : sourceStyles.left;
  outlineImage.style.top = sourceStyles.top === "auto" ? "0" : sourceStyles.top;
  outlineImage.style.width = sourceStyles.width && sourceStyles.width !== "auto" ? sourceStyles.width : "100%";
  outlineImage.style.height = sourceStyles.height && sourceStyles.height !== "auto" ? sourceStyles.height : "100%";
  outlineImage.style.objectFit = sourceStyles.objectFit || "contain";
}

function updateTargetOutline(target, sourceImage) {
  if (!target || !shouldUseTargetOutline(target)) {
    removeTargetOutlineElement(target);
    return;
  }

  const outlineImage = getTargetOutlineElement(target);
  const outlineBaseAssetPath = getTargetOutlineBaseAssetPath(target);

  if (sourceImage) {
    syncTargetOutlineLayout(outlineImage, sourceImage);
  }

  if (outlineBaseAssetPath) {
    const nextSrc = withVersion(outlineBaseAssetPath);

    if (outlineImage.getAttribute("src") !== nextSrc) {
      outlineImage.src = nextSrc;
    }
  } else {
    outlineImage.removeAttribute("src");
  }
}

function updateTargetOutlineForElement(target) {
  updateTargetOutline(target, getTargetOutlineSourceImage(target));
}

function refreshTargetOutlines() {
  document.querySelectorAll(".wood-item, .interactive-action-target").forEach(updateTargetOutlineForElement);
}

function clearSceneDepthControlHideTimer() {
  if (depthControlHideTimer !== null) {
    clearTimeout(depthControlHideTimer);
    depthControlHideTimer = null;
  }
}

function getSceneDepthControlLayer() {
  if (!sceneDepthControlLayer && sceneContent) {
    sceneDepthControlLayer = document.createElement("div");
    sceneDepthControlLayer.className = "scene-depth-control-layer";
    sceneDepthControlLayer.setAttribute("aria-hidden", "false");
    sceneContent.appendChild(sceneDepthControlLayer);
  }

  return sceneDepthControlLayer;
}

function createSceneDepthControlButton(action, label, ariaLabel) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "scene-depth-control-button";
  button.dataset.depthAction = action;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);

  return button;
}

function isSceneDepthControlEventTarget(event) {
  return Boolean(event && event.target && event.target.closest && event.target.closest(".scene-depth-controls"));
}

function getSceneDepthControlPanel() {
  const layer = getSceneDepthControlLayer();

  if (!layer) {
    return null;
  }

  if (!sceneDepthControlPanel) {
    sceneDepthControlPanel = document.createElement("div");
    sceneDepthControlPanel.className = "scene-depth-controls hidden";
    sceneDepthControlPanel.setAttribute("role", "group");
    sceneDepthControlPanel.setAttribute("aria-label", "Layer order controls");

    sceneDepthControlPanel.appendChild(createSceneDepthControlButton("forward", "↑", "Bring selected gear forward"));
    sceneDepthControlPanel.appendChild(createSceneDepthControlButton("backward", "↓", "Send selected gear backward"));

    const resetRow = document.createElement("div");
    resetRow.className = "scene-depth-reset-row";

    const negativeOffsetLabel = document.createElement("span");
    negativeOffsetLabel.className = "scene-depth-control-value scene-depth-control-value-left";
    negativeOffsetLabel.dataset.depthOffsetSide = "negative";
    resetRow.appendChild(negativeOffsetLabel);

    const resetButton = createSceneDepthControlButton("reset", "Reset", "Reset selected gear layer order");
    resetButton.classList.add("scene-depth-control-reset");
    resetRow.appendChild(resetButton);

    const positiveOffsetLabel = document.createElement("span");
    positiveOffsetLabel.className = "scene-depth-control-value scene-depth-control-value-right";
    positiveOffsetLabel.dataset.depthOffsetSide = "positive";
    resetRow.appendChild(positiveOffsetLabel);

    sceneDepthControlPanel.appendChild(resetRow);

    const attachButton = createSceneDepthControlButton("attach", "Attach", "Attach selected gear to its default mount point");
    attachButton.classList.add("scene-depth-control-attach", "hidden");
    sceneDepthControlPanel.appendChild(attachButton);

    sceneDepthControlPanel.addEventListener("pointerenter", function() {
      depthControlPanelHovered = true;
      clearSceneDepthControlHideTimer();
    });

    sceneDepthControlPanel.addEventListener("pointerleave", function() {
      depthControlPanelHovered = false;
      scheduleHideSceneDepthControls();
    });

    sceneDepthControlPanel.addEventListener("pointerdown", function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    sceneDepthControlPanel.addEventListener("pointerup", function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    sceneDepthControlPanel.addEventListener("click", function(event) {
      const eventTarget = event.target && event.target.closest ? event.target : event.target && event.target.parentElement;
      const button = eventTarget ? eventTarget.closest("[data-depth-action]") : null;

      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handleSceneDepthControlAction(button.dataset.depthAction);
    });

    layer.appendChild(sceneDepthControlPanel);
  }

  return sceneDepthControlPanel;
}

function getSelectedActionTargetId() {
  return selectedActionTargetElement && selectedActionTargetElement.dataset ? selectedActionTargetElement.dataset.actionTargetId : "";
}

function getSelectedDepthControlTargetItem() {
  if (isBuildModeActive()) {
    return getSelectedBuildItem();
  }

  return getGearItem(getSelectedActionTargetId());
}

function getSelectedDepthControlTargetId() {
  const item = getSelectedDepthControlTargetItem();

  return item ? item.id : "";
}

function getActiveDepthControlTargetItem() {
  if (isBuildModeActive()) {
    return getSelectedBuildItem();
  }

  return getGearItem(getSelectedActionTargetId() || depthControlHoverTargetId);
}

function isSceneDepthAdjustableItem(item) {
  return Boolean(item && item.scene && item.scene.renderMode !== "campfire");
}

function getSceneAssetBounds(item) {
  if (!isSceneDepthAdjustableItem(item)) {
    return null;
  }

  const element = getGearSceneElement(item);
  const layoutOverride = getSceneLayoutOverride(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(item.scene || {}, layoutOverride);

  return {
    left: position.x - groundAnchor.x,
    top: position.y - groundAnchor.y,
    width: logicalSize.width,
    height: logicalSize.height
  };
}

function showSceneDepthControlsForItem(itemOrId) {
  const item = typeof itemOrId === "string" ? getGearItem(itemOrId) : itemOrId;

  if (!isBuildModeActive()) {
    return;
  }

  if (!isSceneDepthAdjustableItem(item) || !isGearVisibleInScene(item)) {
    return;
  }

  clearSceneDepthControlHideTimer();
  depthControlHoverTargetId = item.id;
  syncSceneDepthControls();
}

function scheduleHideSceneDepthControls() {
  clearSceneDepthControlHideTimer();

  depthControlHideTimer = setTimeout(function() {
    if (!depthControlPanelHovered && !getSelectedDepthControlTargetId()) {
      depthControlHoverTargetId = "";
      syncSceneDepthControls();
    }
  }, 320);
}

function formatDepthOffsetValue(value) {
  if (!value) {
    return "Auto";
  }

  return value > 0 ? "+" + value : String(value);
}

function shouldShowMountAttachControl(item) {
  return Boolean(
    item &&
    item.scene &&
    item.scene.mountTo &&
    isSelectedBuildItem(item)
  );
}

function getMountControlAction(item) {
  if (!shouldShowMountAttachControl(item)) {
    return "";
  }

  return isMountedGearDetached(item) ? "attach" : "detach";
}

function syncSceneDepthControls() {
  const panel = getSceneDepthControlPanel();
  const item = getActiveDepthControlTargetItem();
  const bounds = getSceneAssetBounds(item);

  if (!panel || !isBuildModeActive() || !item || !bounds || !isGearVisibleInScene(item)) {
    if (panel) {
      panel.classList.add("hidden");
    }

    return;
  }

  const mountControlAction = getMountControlAction(item);
  const shouldShowAttach = Boolean(mountControlAction);
  const negativeOffsetValue = panel.querySelector("[data-depth-offset-side='negative']");
  const positiveOffsetValue = panel.querySelector("[data-depth-offset-side='positive']");
  const attachButton = panel.querySelector(".scene-depth-control-attach");
  const depthOffsetY = getUserDepthOffsetY(item);

  if (attachButton) {
    attachButton.classList.toggle("hidden", !shouldShowAttach);
    attachButton.dataset.depthAction = mountControlAction || "attach";
    attachButton.textContent = mountControlAction === "detach" ? "Detach" : "Attach";
    attachButton.setAttribute(
      "aria-label",
      mountControlAction === "detach" ? "Detach selected gear from its mount point" : "Attach selected gear to its default mount point"
    );
  }

  panel.dataset.depthTargetId = item.id;
  panel.classList.toggle("scene-depth-controls-with-attach", shouldShowAttach);
  panel.classList.remove("hidden");

  if (negativeOffsetValue) {
    negativeOffsetValue.textContent = depthOffsetY < 0 ? formatDepthOffsetValue(depthOffsetY) : "";
  }

  if (positiveOffsetValue) {
    positiveOffsetValue.textContent = depthOffsetY >= 0 ? formatDepthOffsetValue(depthOffsetY) : "";
  }

  const sceneScale = parseFloat(sceneContent && sceneContent.style.getPropertyValue("--scene-scale")) || 1;
  const controlScale = clamp(1 / sceneScale, 1, 2.4);
  panel.style.setProperty("--depth-control-scale", String(controlScale));

  const panelWidth = (panel.offsetWidth || 50) * controlScale;
  const panelHeight = (panel.offsetHeight || (shouldShowAttach ? 120 : 93)) * controlScale;
  const left = clamp(bounds.left + bounds.width + 10, 8, BASE_SCENE_WIDTH - panelWidth - 8);
  const top = clamp(bounds.top + bounds.height * 0.34, 8, BASE_SCENE_HEIGHT - panelHeight - 8);

  panel.style.left = left + "px";
  panel.style.top = top + "px";
}

function getUserDepthOffsetMap() {
  if (!gameState.userDepthOffsetY || typeof gameState.userDepthOffsetY !== "object") {
    gameState.userDepthOffsetY = {};
  }

  return gameState.userDepthOffsetY;
}

function setUserDepthOffsetY(item, offsetY) {
  if (!isSceneDepthAdjustableItem(item)) {
    return;
  }

  const offsets = getUserDepthOffsetMap();
  const nextOffset = Number.isFinite(offsetY) ? offsetY : 0;

  if (nextOffset === 0) {
    delete offsets[item.id];
  } else {
    offsets[item.id] = nextOffset;
  }

  refreshGearSceneLayout(item);
  saveGame();
  setStatus(item.displayName + " layer " + formatDepthOffsetValue(nextOffset) + ".");
}

function handleSceneDepthControlAction(action) {
  const item = getActiveDepthControlTargetItem();

  if (!isBuildModeActive() || !isSceneDepthAdjustableItem(item)) {
    return;
  }

  if (action === "forward") {
    setUserDepthOffsetY(item, getUserDepthOffsetY(item) + USER_DEPTH_OFFSET_STEP);
    return;
  }

  if (action === "backward") {
    setUserDepthOffsetY(item, getUserDepthOffsetY(item) - USER_DEPTH_OFFSET_STEP);
    return;
  }

  if (action === "reset") {
    setUserDepthOffsetY(item, 0);
    return;
  }

  if (action === "attach" && isSelectedBuildItem(item)) {
    attachMountedGearItem(item);
    syncSceneDepthControls();
    return;
  }

  if (action === "detach" && isSelectedBuildItem(item)) {
    detachMountedGearItem(item);
    syncSceneDepthControls();
  }
}

function refreshGearSceneLayout(item) {
  if (!isSceneDepthAdjustableItem(item)) {
    return;
  }

  const scene = item.scene || {};
  const element = getGearSceneElement(item);
  const frontElement = document.getElementById(getGearFrontElementId(item));
  const layers = scene.layers || {};

  if (element) {
    applyGearSceneLayout(element, item, scene.zIndex || 20);
  }

  if (frontElement && layers.front) {
    applyGearSceneLayout(frontElement, item, scene.frontZIndex || 31, SCENE_FRONT_LAYER_OFFSET);
  }

  updateSceneOcclusion();
  syncSceneDepthControls();
}

function refreshMountedGearSceneLayouts() {
  getGearItems().forEach(function(item) {
    if (!item || !item.scene || !item.scene.mountTo || !isGearVisibleInScene(item)) {
      return;
    }

    refreshGearSceneLayout(item);
  });
}

function configureGearDepthAdjustTarget(element, item) {
  if (!element || !item || !item.scene || item.scene.renderMode === "campfire") {
    return;
  }

  element.dataset.depthTargetId = item.id;
  element.classList.add("depth-adjustable-target");

  if (element.dataset.depthAdjustHandlersBound === "true") {
    return;
  }

  element.dataset.depthAdjustHandlersBound = "true";
  element.addEventListener("pointerenter", function(event) {
    const targetItem = getGearItem(event.currentTarget.dataset.depthTargetId);
    showSceneDepthControlsForItem(targetItem);
  });
  element.addEventListener("pointerleave", scheduleHideSceneDepthControls);
  element.addEventListener("focusin", function(event) {
    const targetItem = getGearItem(event.currentTarget.dataset.depthTargetId);
    showSceneDepthControlsForItem(targetItem);
  });
  element.addEventListener("focusout", scheduleHideSceneDepthControls);
  element.addEventListener("pointerdown", function(event) {
    const targetItem = getGearItem(event.currentTarget.dataset.depthTargetId);
    showSceneDepthControlsForItem(targetItem);
  });
}

function getBuildSelectionKey(item) {
  if (!item || !item.id) {
    return "";
  }

  const explicitInstanceKey = item.instanceKey || item.instanceId || item.placementKey || item.placementId;
  const placedIndex = Array.isArray(gameState.placedGear) ? gameState.placedGear.indexOf(item.id) : -1;
  const instanceKey = explicitInstanceKey || item.id + "#" + (placedIndex >= 0 ? placedIndex : "catalog");

  return getActionTargetKey("build", String(instanceKey));
}

function getBuildItemBySelectionKey(selectionKey) {
  if (!selectionKey) {
    return null;
  }

  return getGearItems().find(function(item) {
    return getBuildSelectionKey(item) === selectionKey;
  }) || null;
}

function getSelectedBuildItem() {
  return getBuildItemBySelectionKey(selectedBuildItemKey);
}

function isSelectedBuildItem(item) {
  return Boolean(item && selectedBuildItemKey && getBuildSelectionKey(item) === selectedBuildItemKey);
}

function reconcileSelectedBuildTarget() {
  if (selectedBuildItemKey && !isBuildDraggableItem(getSelectedBuildItem())) {
    clearSelectedBuildTarget();
  }
}

function isBuildDraggableItem(item) {
  return Boolean(
    item &&
    item.scene &&
    item.scene.renderMode !== "campfire" &&
    isGearVisibleInScene(item)
  );
}

function selectBuildTarget(element, item) {
  const selectionKey = getBuildSelectionKey(item);

  if (!element || !item || !selectionKey) {
    return;
  }

  clearSelectedBuildTarget();
  clearSelectedActionTarget();
  selectedBuildItemKey = selectionKey;
  element.dataset.buildItemKey = selectionKey;
  updateTargetOutlineForElement(element);
  element.classList.add("build-selected-target");
  showSceneDepthControlsForItem(item);
}

function getScenePointFromPointerEvent(event) {
  if (!event || !sceneContent) {
    return null;
  }

  const contentRect = sceneContent.getBoundingClientRect();
  const scaleX = contentRect.width / BASE_SCENE_WIDTH;
  const scaleY = contentRect.height / BASE_SCENE_HEIGHT;

  if (scaleX <= 0 || scaleY <= 0) {
    return null;
  }

  return {
    x: clamp((event.clientX - contentRect.left) / scaleX, 0, BASE_SCENE_WIDTH),
    y: clamp((event.clientY - contentRect.top) / scaleY, 0, BASE_SCENE_HEIGHT)
  };
}

function isPointInViewportRect(clientX, clientY, rect) {
  return Boolean(
    rect &&
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function getBuildHitSourceImages(element) {
  if (!element) {
    return [];
  }

  return Array.from(element.querySelectorAll(".object-image")).filter(isOutlineSourceImage);
}

function getBuildHitCanvasContext(width, height) {
  if (typeof document === "undefined" || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  if (!buildHitCanvas) {
    buildHitCanvas = document.createElement("canvas");
  }

  if (!buildHitCanvasContext) {
    buildHitCanvasContext = buildHitCanvas.getContext("2d", { willReadFrequently: true }) || buildHitCanvas.getContext("2d");
  }

  if (!buildHitCanvasContext) {
    return null;
  }

  if (buildHitCanvas.width !== width || buildHitCanvas.height !== height) {
    buildHitCanvas.width = width;
    buildHitCanvas.height = height;
  } else {
    buildHitCanvasContext.clearRect(0, 0, width, height);
  }

  return buildHitCanvasContext;
}

function isBuildHitImageMirrored(image) {
  const objectElement = image && image.closest ? image.closest(".asset-object") : null;

  if (!objectElement || typeof window === "undefined") {
    return false;
  }

  return window.getComputedStyle(objectElement).getPropertyValue("--object-scale-x").trim() === "-1";
}

function isBuildHitElementMirrored(element) {
  if (!element || typeof window === "undefined") {
    return false;
  }

  return window.getComputedStyle(element).getPropertyValue("--object-scale-x").trim() === "-1";
}

function getBuildHitFallbackZones(item) {
  if (!item) {
    return [];
  }

  if (BUILD_HIT_FALLBACK_ZONES[item.id]) {
    return BUILD_HIT_FALLBACK_ZONES[item.id];
  }

  if (item.scene && item.scene.buildHitZones) {
    return item.scene.buildHitZones;
  }

  const occlusionFootprint = getOcclusionFootprint(item);

  if (occlusionFootprint) {
    return [occlusionFootprint];
  }

  const collisionFootprint = getCollisionFootprint(item);

  if (collisionFootprint) {
    return [collisionFootprint];
  }

  return [
    { ratioX: 0.16, ratioY: 0.22, ratioWidth: 0.68, ratioHeight: 0.62 }
  ];
}

function doesBuildHitFallbackZone(element, item, clientX, clientY) {
  const rect = element ? element.getBoundingClientRect() : null;

  if (!isPointInViewportRect(clientX, clientY, rect) || rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  const ratioX = clamp((clientX - rect.left) / rect.width, 0, 1);
  const ratioY = clamp((clientY - rect.top) / rect.height, 0, 1);
  const sampleRatioX = isBuildHitElementMirrored(element) ? 1 - ratioX : ratioX;

  return getBuildHitFallbackZones(item).some(function(zone) {
    return Boolean(
      zone &&
      sampleRatioX >= zone.ratioX &&
      sampleRatioX <= zone.ratioX + zone.ratioWidth &&
      ratioY >= zone.ratioY &&
      ratioY <= zone.ratioY + zone.ratioHeight
    );
  });
}

function isBuildHitVisibleImagePixel(image, clientX, clientY) {
  if (!image) {
    return false;
  }

  const rect = image.getBoundingClientRect();

  if (!isPointInViewportRect(clientX, clientY, rect) || rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  if (!naturalWidth || !naturalHeight || !image.complete) {
    return null;
  }

  const ratioX = clamp((clientX - rect.left) / rect.width, 0, 1);
  const ratioY = clamp((clientY - rect.top) / rect.height, 0, 1);
  const sampleRatioX = isBuildHitImageMirrored(image) ? 1 - ratioX : ratioX;
  const sampleX = clamp(Math.floor(sampleRatioX * naturalWidth), 0, naturalWidth - 1);
  const sampleY = clamp(Math.floor(ratioY * naturalHeight), 0, naturalHeight - 1);
  const context = getBuildHitCanvasContext(naturalWidth, naturalHeight);

  if (!context) {
    return null;
  }

  try {
    context.drawImage(image, 0, 0, naturalWidth, naturalHeight);
    return context.getImageData(sampleX, sampleY, 1, 1).data[3] >= BUILD_HIT_ALPHA_THRESHOLD;
  } catch (error) {
    return null;
  }
}

function doesBuildHitElementVisiblePixel(element, item, clientX, clientY) {
  const images = getBuildHitSourceImages(element);
  let hasUnreadableImage = images.length === 0;

  for (let index = 0; index < images.length; index += 1) {
    const hitResult = isBuildHitVisibleImagePixel(images[index], clientX, clientY);

    if (hitResult === true) {
      return true;
    }

    if (hitResult === null) {
      hasUnreadableImage = true;
    }
  }

  return hasUnreadableImage ? doesBuildHitFallbackZone(element, item, clientX, clientY) : false;
}

function getBuildHitElementZIndex(element) {
  if (!element) {
    return 0;
  }

  const inlineZIndex = parseInt(element.style.zIndex, 10);

  if (Number.isFinite(inlineZIndex)) {
    return inlineZIndex;
  }

  if (typeof window !== "undefined") {
    const computedZIndex = parseInt(window.getComputedStyle(element).zIndex, 10);

    if (Number.isFinite(computedZIndex)) {
      return computedZIndex;
    }
  }

  return Number(element.dataset && element.dataset.sceneDisplayDepthY) || 0;
}

function getBuildHitCandidates() {
  return Array.from(document.querySelectorAll(".gear-object, .gear-front-layer")).map(function(element, index) {
    const item = getOccluderItemForElement(element);

    return {
      element: element,
      dragElement: item ? getGearSceneElement(item) : null,
      item: item,
      zIndex: getBuildHitElementZIndex(element),
      sourceOrder: index
    };
  }).filter(function(candidate) {
    return Boolean(
      candidate.item &&
      candidate.dragElement &&
      isBuildDraggableItem(candidate.item) &&
      !candidate.element.classList.contains("hidden") &&
      !candidate.dragElement.classList.contains("hidden")
    );
  }).sort(function(first, second) {
    if (first.zIndex !== second.zIndex) {
      return second.zIndex - first.zIndex;
    }

    return second.sourceOrder - first.sourceOrder;
  });
}

function getBuildHitTarget(event) {
  if (!event) {
    return null;
  }

  const candidates = getBuildHitCandidates();

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const rect = candidate.element.getBoundingClientRect();

    if (
      isPointInViewportRect(event.clientX, event.clientY, rect) &&
      doesBuildHitElementVisiblePixel(candidate.element, candidate.item, event.clientX, event.clientY)
    ) {
      return {
        element: candidate.dragElement,
        item: candidate.item
      };
    }
  }

  return null;
}

function handleBuildScenePointerDown(event) {
  if (!isBuildModeActive()) {
    return;
  }

  if (event.button !== undefined && event.button !== 0) {
    return;
  }

  if (isSceneDepthControlEventTarget(event)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const hitTarget = getBuildHitTarget(event);

  if (!hitTarget) {
    clearSelectedBuildTarget();
    depthControlHoverTargetId = "";
    syncSceneDepthControls();
    return;
  }

  suppressNextBuildClick = true;
  startBuildDrag(event, hitTarget.element, hitTarget.item);
}

function handleCampSceneClick(event) {
  if (isSceneDepthControlEventTarget(event)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (isBuildModeActive() && suppressNextBuildClick) {
    suppressNextBuildClick = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (isBuildModeActive()) {
    clearSelectedBuildTarget();
  } else {
    clearSelectedActionTarget();
  }
}

function startBuildDrag(event, element, item) {
  const pointerPoint = getScenePointFromPointerEvent(event);
  const layoutOverride = getSceneLayoutOverride(item);
  const startPosition = getScenePixelPosition(item.scene || {}, layoutOverride);

  if (!pointerPoint || !isBuildDraggableItem(item)) {
    return;
  }

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  selectBuildTarget(element, item);

  if (isMountedGearItem(item) && !isMountedGearDetached(item)) {
    return;
  }

  element.classList.add("build-dragging");

  const captureElement = event && event.currentTarget && event.currentTarget.setPointerCapture ? event.currentTarget : element;

  buildDragState = {
    itemKey: getBuildSelectionKey(item),
    itemId: item.id,
    pointerId: event.pointerId,
    startPointer: pointerPoint,
    startPosition: startPosition,
    captureElement: captureElement,
    moved: false
  };

  if (captureElement && captureElement.setPointerCapture && event.pointerId !== undefined) {
    captureElement.setPointerCapture(event.pointerId);
  }
}

function updateBuildDrag(event) {
  if (!buildDragState || !isBuildModeActive()) {
    return;
  }

  if (event && buildDragState.pointerId !== undefined && event.pointerId !== buildDragState.pointerId) {
    return;
  }

  const item = getBuildItemBySelectionKey(buildDragState.itemKey) || getGearItem(buildDragState.itemId);
  const pointerPoint = getScenePointFromPointerEvent(event);

  if (!item || !pointerPoint) {
    return;
  }

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const delta = {
    x: pointerPoint.x - buildDragState.startPointer.x,
    y: pointerPoint.y - buildDragState.startPointer.y
  };
  const nextPoint = clampScenePoint({
    x: buildDragState.startPosition.x + delta.x,
    y: buildDragState.startPosition.y + delta.y
  });

  if (getScenePointDistance(nextPoint, buildDragState.startPosition) > 2) {
    buildDragState.moved = true;
  }

  if (isMountedGearItem(item) && !isMountedGearDetached(item)) {
    return;
  }

  setUserGearPosition(item, scenePointToPercent(nextPoint), false);

  refreshMountedGearSceneLayouts();
  syncSceneDepthControls();
}

function finishBuildDrag(event) {
  if (!buildDragState) {
    return;
  }

  if (event && buildDragState.pointerId !== undefined && event.pointerId !== buildDragState.pointerId) {
    return;
  }

  const endedDragState = buildDragState;
  const item = getBuildItemBySelectionKey(endedDragState.itemKey) || getGearItem(endedDragState.itemId);
  const element = getGearSceneElement(item);

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (element) {
    element.classList.remove("build-dragging");
  }

  if (endedDragState.captureElement && endedDragState.captureElement.releasePointerCapture && endedDragState.pointerId !== undefined) {
    try {
      endedDragState.captureElement.releasePointerCapture(endedDragState.pointerId);
    } catch (error) {
      // Pointer capture may already be released by the browser.
    }
  }

  buildDragState = null;

  if (item && element) {
    selectBuildTarget(element, item);
  }

  if (item) {
    refreshGearSceneLayout(item);
    refreshMountedGearSceneLayouts();
    saveGame();
  }
}

function configureGearBuildDragTarget(element, item) {
  if (!element || !item || !item.scene || item.scene.renderMode === "campfire") {
    return;
  }

  element.dataset.buildTargetId = item.id;
  element.dataset.buildItemKey = getBuildSelectionKey(item);

  if (element.dataset.buildDragHandlersBound === "true") {
    return;
  }

  element.dataset.buildDragHandlersBound = "true";
  element.addEventListener("click", function(event) {
    if (!isBuildModeActive()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  });
  element.addEventListener("pointerdown", function(event) {
    const targetItem = getBuildItemBySelectionKey(event.currentTarget.dataset.buildItemKey) || getGearItem(event.currentTarget.dataset.buildTargetId);

    if (!isBuildModeActive() || !isBuildDraggableItem(targetItem)) {
      return;
    }

    startBuildDrag(event, event.currentTarget, targetItem);
  });
}

function getActionTargetKey(type, targetId) {
  return type + ":" + targetId;
}

function getActionKey(action) {
  return action ? getActionTargetKey(action.type, action.targetId) : "";
}

function clearSelectedActionTarget() {
  if (selectedActionTargetElement) {
    selectedActionTargetElement.classList.remove("selected-action-target");
  }

  selectedActionTargetElement = null;
  selectedActionTargetKey = "";
  syncSceneDepthControls();
}

function clearSelectedBuildTarget() {
  if (selectedBuildItemKey) {
    document.querySelectorAll(".build-selected-target").forEach(function(element) {
      element.classList.remove("build-selected-target");
    });
  }

  selectedBuildItemKey = "";
  syncSceneDepthControls();
}

function getGearSelectionKey(item) {
  const actionType = getGearActionType(item);

  return actionType && item ? getActionTargetKey(actionType, item.id) : "";
}

function getGearTouchPrompt(item) {
  const actionType = getGearActionType(item);

  if (actionType === "chair") {
    return "Tap again to send the camper to sit at " + item.displayName + ".";
  }

  if (actionType === "tent") {
    return "Tap again to send the camper to rest in " + item.displayName + ".";
  }

  return "Tap again to send the camper to " + item.displayName + ".";
}

function isSelectedActionTarget(element, item) {
  return selectedActionTargetElement === element && selectedActionTargetKey === getGearSelectionKey(item);
}

function selectActionTarget(element, item) {
  const selectionKey = getGearSelectionKey(item);

  if (!element || !selectionKey) {
    return;
  }

  clearSelectedActionTarget();
  updateTargetOutlineForElement(element);
  element.classList.add("selected-action-target");
  selectedActionTargetElement = element;
  selectedActionTargetKey = selectionKey;
  showSceneDepthControlsForItem(item);
  setStatus(getGearTouchPrompt(item));
}

function isTouchLikeActionEvent(event, element) {
  const pointerType = (event && event.pointerType) || (element && element.dataset && element.dataset.lastPointerType) || "";

  return pointerType === "touch" || pointerType === "pen";
}

function rememberActionPointerType(event, element) {
  if (!element || !element.dataset) {
    return;
  }

  element.dataset.lastPointerType = (event && event.pointerType) || "";
}

function handleGearActionClick(event, element, item) {
  const actionType = getGearActionType(item);

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (isBuildModeActive()) {
    return;
  }

  if (!actionType || !isGearVisibleInScene(item)) {
    clearSelectedActionTarget();
    return;
  }

  if (hasQueuedAction(actionType, item.id)) {
    clearSelectedActionTarget();
    queueGearAction(item);
    return;
  }

  if (isTouchLikeActionEvent(event, element)) {
    if (isSelectedActionTarget(element, item)) {
      clearSelectedActionTarget();
      queueGearAction(item);
    } else {
      selectActionTarget(element, item);
    }

    return;
  }

  clearSelectedActionTarget();
  queueGearAction(item);
}

function getQueuedActionsInOrder() {
  const queuedActions = activeQueuedAction && activeQueuedAction.indicatorVisible !== false ? [activeQueuedAction] : [];

  return queuedActions.concat(actionQueue);
}

function getActionTargetElement(action) {
  if (!action) {
    return null;
  }

  if (action.type === "wood") {
    return document.getElementById("wood-" + action.targetId);
  }

  if (action.type === "fire") {
    return campfire;
  }

  const item = getGearItem(action.targetId);

  return getGearSceneElement(item);
}

function clearActionQueueIndicators() {
  document.querySelectorAll(".queue-order-badge").forEach(function(badge) {
    badge.remove();
  });

  document.querySelectorAll(".queued-action-target, .active-action-target").forEach(function(element) {
    element.classList.remove("queued-action-target", "active-action-target");
    element.removeAttribute("data-queue-order");
  });
}

function updateActionQueueIndicators() {
  clearActionQueueIndicators();

  if (isBuildModeActive()) {
    return;
  }

  getQueuedActionsInOrder().forEach(function(action, index) {
    const target = getActionTargetElement(action);

    if (!target || target.classList.contains("hidden")) {
      return;
    }

    const order = index + 1;
    const badge = document.createElement("span");

    updateTargetOutlineForElement(target);
    target.classList.add("queued-action-target");
    target.classList.toggle("active-action-target", index === 0);
    target.setAttribute("data-queue-order", String(order));

    badge.className = "queue-order-badge";
    badge.textContent = order;
    badge.setAttribute("aria-hidden", "true");
    target.appendChild(badge);
  });
}

function hasQueuedAction(type, targetId) {
  const key = getActionTargetKey(type, targetId);

  if (getActionKey(activeQueuedAction) === key) {
    return true;
  }

  return actionQueue.some(function(action) {
    return getActionKey(action) === key;
  });
}

function getQueuedActionLabel(type, targetId) {
  if (type === "wood") {
    return "fallen branches";
  }

  if (type === "fire") {
    return "campfire";
  }

  const item = getGearItem(targetId);

  return item ? item.displayName : "target";
}

function enqueueAction(type, targetId) {
  const label = getQueuedActionLabel(type, targetId);

  if (isBuildModeActive()) {
    return false;
  }

  if (hasQueuedAction(type, targetId)) {
    if (selectedActionTargetKey === getActionTargetKey(type, targetId)) {
      clearSelectedActionTarget();
    }

    setStatus(label + " is already in the queue.");
    return false;
  }

  actionQueue.push({
    id: nextActionQueueId,
    type: type,
    targetId: targetId
  });
  nextActionQueueId += 1;
  clearSelectedActionTarget();
  updateActionQueueIndicators();

  if (!beginNextQueuedAction()) {
    setStatus(label + " added to the queue.");
  }

  return true;
}

function clearActionQueue() {
  actionQueue = [];
  activeQueuedAction = null;
  updateActionQueueIndicators();
}

function canStartQueuedAction() {
  return !isBuildModeActive() && !activeQueuedAction && actionQueue.length > 0 && !camper.carryingWood;
}

function beginNextQueuedAction() {
  if (!canStartQueuedAction()) {
    return false;
  }

  activeQueuedAction = actionQueue.shift();
  activeQueuedAction.indicatorVisible = true;
  updateActionQueueIndicators();
  executeQueuedAction(activeQueuedAction);
  return true;
}

function hideActiveQueuedActionIndicator() {
  if (!activeQueuedAction || activeQueuedAction.indicatorVisible === false) {
    return;
  }

  activeQueuedAction.indicatorVisible = false;
  updateActionQueueIndicators();
}

function completeActiveQueuedAction() {
  activeQueuedAction = null;
  updateActionQueueIndicators();

  if (!beginNextQueuedAction()) {
    chooseNextCamperAction();
  }
}

function isGearQueueInteractive(item) {
  if (!item || !item.scene) {
    return false;
  }

  if (item.category === "chair" && item.interactions && item.interactions.seatable) {
    return true;
  }

  if (isTentItem(item) && item.interactions && item.interactions.tentRest) {
    return true;
  }

  return false;
}

function getGearActionType(item) {
  if (item && item.category === "chair" && item.interactions && item.interactions.seatable) {
    return "chair";
  }

  if (item && isTentItem(item) && item.interactions && item.interactions.tentRest) {
    return "tent";
  }

  return "";
}

function queueGearAction(item) {
  const actionType = getGearActionType(item);

  if (!actionType || !isGearVisibleInScene(item)) {
    return;
  }

  enqueueAction(actionType, item.id);
}

function executeQueuedAction(action) {
  if (!action) {
    return;
  }

  if (action.type === "wood") {
    executeQueuedWoodAction(action);
    return;
  }

  if (action.type === "chair") {
    executeQueuedChairAction(action);
    return;
  }

  if (action.type === "tent") {
    executeQueuedTentAction(action);
    return;
  }

  if (action.type === "fire") {
    executeQueuedFireAction();
    return;
  }

  completeActiveQueuedAction();
}

function getOnboardingFirstGearItem() {
  return getGearItem(ONBOARDING_FIRST_GEAR_ID);
}

function getOnboardingStep() {
  if (activeGuideType !== "onboarding") {
    return standaloneGuides[activeStandaloneGuideId] || null;
  }

  return onboardingSteps[onboardingStepIndex] || null;
}

function isShopOpen() {
  return document.body.classList.contains("shop-open");
}

function getOnboardingFirstGearCard() {
  return shopCards[ONBOARDING_FIRST_GEAR_ID] || null;
}

function getInteractionGuideTargetItem() {
  const firstGear = getGearItem(ONBOARDING_FIRST_GEAR_ID);

  if (firstGear && ownsGear(firstGear.id) && isGearVisibleInScene(firstGear)) {
    return firstGear;
  }

  const tentItem = getEquippedGearItem("tent");

  if (tentItem && isGearVisibleInScene(tentItem)) {
    return tentItem;
  }

  return null;
}

function getOnboardingTarget(step) {
  if (!step) {
    return null;
  }

  if (step.id === "tapInteraction") {
    const targetItem = getInteractionGuideTargetItem();
    return targetItem ? getGearSceneElement(targetItem) : null;
  }

  if (step.id === "buildMode") {
    return buildModeToggle;
  }

  if (step.id === "gather") {
    return gatherWoodToggle;
  }

  if (step.id === "fire") {
    return campfire;
  }

  if (step.id === "warmth") {
    return warmthStatus;
  }

  if (step.id === "cozy") {
    return cozyPointStatus;
  }

  if (step.id === "shop") {
    return shopToggle;
  }

  if (step.id === "chair") {
    const chairCard = getOnboardingFirstGearCard();
    return chairCard && chairCard.detailLabel || chairCard && chairCard.button || null;
  }

  if (step.id === "comfort") {
    return comfortStatus;
  }

  return null;
}

function getOnboardingStepBody(step) {
  const firstGear = getOnboardingFirstGearItem();
  const firstGearName = firstGear ? firstGear.displayName : "first chair";
  const firstGearComfort = firstGear ? Number(firstGear.comfort) || 0 : 0;
  const firstGearCost = firstGear ? Number(firstGear.cost) || 0 : 0;
  const missingPoints = Math.max(0, firstGearCost - gameState.cozyPoints);

  if (!step) {
    return "";
  }

  if (step.body) {
    return step.body;
  }

  if (step.id === "gather") {
    return gameState.gatherWoodMode ?
      "Gather is on, so the camper automatically collects fallen branches. You can still tap a branch to send the camper to that one." :
      "Tap Gather to turn on automatic branch collecting. Even with Gather Off, you can tap fallen branches to send the camper to feed the fire.";
  }

  if (step.id === "fire") {
    return gameState.warmthSeconds > 0 ?
      "The fire is lit. Branches add Warmth after the camper carries them back to the campfire." :
      "The camper is bringing branches to the fire. You can also tap any fallen branch to send the camper over.";
  }

  if (step.id === "warmth") {
    return "Warmth shows how cozy and alive your camp feels. Keep the fire going to maintain Warmth. If Warmth reaches 0, your camp stops earning Cozy Points.";
  }

  if (step.id === "cozy") {
    return "Cozy Points are the main progress points. Spend them on gear, upgrades, and later unlocks.";
  }

  if (step.id === "shop") {
    return "Open Shop once the fire has earned points. The first useful goal is " + firstGearName + ".";
  }

  if (step.id === "chair") {
    if (ownsGear(ONBOARDING_FIRST_GEAR_ID)) {
      return firstGearName + " is owned. Its +" + firstGearComfort + " Comfort now helps the camp earn faster.";
    }

    if (missingPoints > 0) {
      return firstGearName + " costs " + formatNumber(firstGearCost) + " CP and gives +" + firstGearComfort + " Comfort. You need " + formatNumber(missingPoints) + " more CP, so keep Gather on or tap fallen branches to feed the fire.";
    }

    return "Tap the " + firstGearName + " card. It gives +" + firstGearComfort + " Comfort, and Comfort raises Cozy Point production.";
  }

  if (step.id === "comfort") {
    return "Comfort is now part of the loop: Gather, Warmth, Cozy Points, gear, Comfort, faster Cozy Points.";
  }

  return "";
}

function getOnboardingPrimaryLabel(step) {
  const firstGear = getOnboardingFirstGearItem();
  const firstGearName = firstGear ? firstGear.displayName : "chair";
  const firstGearCost = firstGear ? Number(firstGear.cost) || 0 : 0;
  const missingPoints = Math.max(0, firstGearCost - gameState.cozyPoints);

  if (!step) {
    return "Next";
  }

  if (step.primaryLabel) {
    return step.primaryLabel;
  }

  if (step.id === "gather") {
    return gameState.gatherWoodMode ? "Next" : "Tap Gather";
  }

  if (step.id === "shop") {
    return isShopOpen() ? "Next" : "Tap Shop";
  }

  if (step.id === "fire") {
    return gameState.warmthSeconds > 0 ? "Next" : "Waiting for wood";
  }

  if (step.id === "chair") {
    if (ownsGear(ONBOARDING_FIRST_GEAR_ID)) {
      return "Next";
    }

    if (missingPoints > 0) {
      return "Need " + formatNumber(missingPoints) + " CP";
    }

    return "Tap " + firstGearName;
  }

  if (step.id === "comfort") {
    return "Finish";
  }

  return "Next";
}

function canAdvanceOnboarding(step) {
  if (!step) {
    return false;
  }

  if (activeGuideType !== "onboarding") {
    return true;
  }

  if (step.id === "gather") {
    return gameState.gatherWoodMode;
  }

  if (step.id === "shop") {
    return isShopOpen();
  }

  if (step.id === "fire") {
    return gameState.warmthSeconds > 0;
  }

  if (step.id === "chair") {
    return ownsGear(ONBOARDING_FIRST_GEAR_ID);
  }

  return true;
}

function clearOnboardingHighlight() {
  if (onboardingHighlightedElement) {
    onboardingHighlightedElement.classList.remove("onboarding-highlight");
  }

  if (onboardingCardFocusElement) {
    onboardingCardFocusElement.classList.remove("onboarding-card-focus");
  }

  onboardingHighlightedElement = null;
  onboardingCardFocusElement = null;
}

function focusOnboardingShopCard() {
  const chairCard = getOnboardingFirstGearCard();

  if (!chairCard || !chairCard.button) {
    return;
  }

  chairCard.button.scrollIntoView({ block: "center", inline: "nearest" });
}

function applyOnboardingStepSetup(step) {
  if (!step) {
    return;
  }

  if (step.id === "tapInteraction" || step.id === "buildMode") {
    if (isShopOpen()) {
      closeShop();
    }
    return;
  }

  if (step.id === "chair") {
    openShop();
    setShopFilter("living");
    requestAnimationFrame(function() {
      focusOnboardingShopCard();
      positionOnboardingLayer();
    });
    return;
  }

  if (step.id !== "shop" && isShopOpen()) {
    closeShop();
  }
}

function positionOnboardingLayer() {
  if (!onboardingActive || !onboardingLayer || !onboardingPanel || !onboardingPointer || !gameViewport) {
    return;
  }

  const target = onboardingHighlightedElement || getOnboardingTarget(getOnboardingStep());

  if (!target) {
    return;
  }

  const viewportRect = gameViewport.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  if (viewportRect.width <= 0 || viewportRect.height <= 0 || targetRect.width <= 0 || targetRect.height <= 0) {
    return;
  }

  const targetCenterX = targetRect.left - viewportRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top - viewportRect.top + targetRect.height / 2;
  const targetTop = targetRect.top - viewportRect.top;
  const targetBottom = targetRect.bottom - viewportRect.top;
  const margin = Math.max(8, Math.min(14, viewportRect.width * 0.035));
  const gap = 18;

  onboardingPanel.style.left = margin + "px";
  onboardingPanel.style.top = margin + "px";
  onboardingPanel.style.bottom = "auto";

  const panelRect = onboardingPanel.getBoundingClientRect();
  const panelWidth = Math.min(panelRect.width, viewportRect.width - margin * 2);
  const panelHeight = Math.min(panelRect.height, viewportRect.height - margin * 2);
  const maxLeft = Math.max(margin, viewportRect.width - panelWidth - margin);
  const maxTop = Math.max(margin, viewportRect.height - panelHeight - margin);
  const left = clamp(targetCenterX - panelWidth / 2, margin, maxLeft);
  const belowTop = targetBottom + gap;
  const aboveTop = targetTop - panelHeight - gap;
  const hasRoomBelow = belowTop + panelHeight <= viewportRect.height - margin;
  const hasRoomAbove = aboveTop >= margin;
  let top = belowTop;
  let pointsUp = true;

  if ((!hasRoomBelow && hasRoomAbove) || targetCenterY > viewportRect.height * 0.58) {
    top = aboveTop;
    pointsUp = false;
  }

  top = clamp(top, margin, maxTop);

  onboardingPanel.style.left = left + "px";
  onboardingPanel.style.top = top + "px";

  if (pointsUp) {
    onboardingPointer.classList.add("point-up");
    onboardingPointer.classList.remove("point-down");
    onboardingPointer.style.top = clamp(top - 10, margin, viewportRect.height - margin) + "px";
  } else {
    onboardingPointer.classList.add("point-down");
    onboardingPointer.classList.remove("point-up");
    onboardingPointer.style.top = clamp(top + panelHeight + 10, margin, viewportRect.height - margin) + "px";
  }

  onboardingPointer.style.left = clamp(targetCenterX, left + 16, left + panelWidth - 16) + "px";
}

function updateOnboardingView() {
  if (!onboardingActive || !onboardingLayer) {
    return;
  }

  const step = getOnboardingStep();
  const target = getOnboardingTarget(step);

  clearOnboardingHighlight();

  if (target) {
    target.classList.add("onboarding-highlight");
    onboardingHighlightedElement = target;
  }

  if (step && step.id === "chair") {
    const chairCard = getOnboardingFirstGearCard();

    if (chairCard && chairCard.button) {
      chairCard.button.classList.add("onboarding-card-focus");
      onboardingCardFocusElement = chairCard.button;
    }
  }

  onboardingStepLabel.textContent = activeGuideType === "onboarding" ?
    "Guide " + (onboardingStepIndex + 1) + " / " + onboardingSteps.length :
    (step && step.stepLabel || "Guide");
  onboardingTitle.textContent = step ? step.title : "";
  onboardingBody.textContent = getOnboardingStepBody(step);
  onboardingPrimaryButton.textContent = getOnboardingPrimaryLabel(step);
  onboardingPrimaryButton.disabled = !canAdvanceOnboarding(step);
  onboardingSkipButton.textContent = onboardingManual || activeGuideType !== "onboarding" ? "Close" : "Skip";

  requestAnimationFrame(positionOnboardingLayer);
}

function showOnboardingStep() {
  const step = getOnboardingStep();

  if (!step || !onboardingLayer) {
    return;
  }

  onboardingLayer.classList.remove("hidden");
  onboardingLayer.setAttribute("aria-hidden", "false");
  applyOnboardingStepSetup(step);
  updateOnboardingView();
}

function completeOnboarding(markSeen) {
  const completedGuideType = activeGuideType;
  const completedStandaloneGuideId = activeStandaloneGuideId;

  onboardingActive = false;
  clearOnboardingHighlight();

  if (onboardingLayer) {
    onboardingLayer.classList.add("hidden");
    onboardingLayer.setAttribute("aria-hidden", "true");
  }

  if (markSeen) {
    if (completedGuideType === "onboarding") {
      gameState.onboardingSeen = true;
    } else if (completedStandaloneGuideId === "tapInteraction") {
      gameState.interactionGuideSeen = true;
    } else if (completedStandaloneGuideId === "buildMode") {
      gameState.buildModeGuideSeen = true;
    }

    saveGame();
  }

  activeGuideType = "onboarding";
  activeStandaloneGuideId = "";
}

function advanceOnboarding() {
  if (!onboardingActive) {
    return;
  }

  const step = getOnboardingStep();

  if (!canAdvanceOnboarding(step)) {
    updateOnboardingView();
    return;
  }

  if (activeGuideType !== "onboarding") {
    completeOnboarding(true);
    return;
  }

  if (onboardingStepIndex >= onboardingSteps.length - 1) {
    completeOnboarding(true);
    setStatus("Guide complete. Keep the fire warm and make camp cozier.");
    maybeStartInteractionGuide();
    return;
  }

  onboardingStepIndex += 1;
  showOnboardingStep();
}

function startOnboarding(isManual) {
  if (!hasCamperProfile(gameState) || camperProfileActive) {
    return;
  }

  onboardingManual = Boolean(isManual);
  activeGuideType = "onboarding";
  activeStandaloneGuideId = "";
  onboardingActive = true;
  onboardingStepIndex = 0;
  showOnboardingStep();
}

function startStandaloneGuide(guideId) {
  if (!hasCamperProfile(gameState) || camperProfileActive || onboardingActive || !standaloneGuides[guideId]) {
    return;
  }

  onboardingManual = false;
  activeGuideType = "standalone";
  activeStandaloneGuideId = guideId;
  onboardingActive = true;
  onboardingStepIndex = 0;
  showOnboardingStep();
}

function sanitizeCamperName(name) {
  return String(name || "").trim().replace(/\s+/g, " ").slice(0, 18);
}

function sanitizeCamperCatchphrase(catchphrase) {
  return String(catchphrase || "").trim().replace(/\s+/g, " ").slice(0, 42);
}

function getCamperPersonality(personalityId) {
  return CAMPER_PERSONALITIES[personalityId] || CAMPER_PERSONALITIES.slowMood;
}

function getDefaultCamperCatchphrase(personalityId) {
  const personality = getCamperPersonality(personalityId);
  return personality && personality.catchphrase || "慢慢来，营地会等我。";
}

function getCamperCardBackgroundPath(personalityId) {
  const personality = getCamperPersonality(personalityId);
  return personality && personality.cardBackground || CAMPER_PERSONALITIES.slowMood.cardBackground;
}

function getRandomCamperName() {
  const names = ["Moss", "Juniper", "Pudding", "Nori", "Pebble", "Miso", "Bramble", "Sunny", "Pickle", "Maple", "Toast", "Kiki"];
  return names[Math.floor(Math.random() * names.length)];
}

function getCamperAppearanceOptions(categoryId) {
  return CAMPER_APPEARANCE_OPTIONS[categoryId] || [];
}

function getCamperAppearanceCategory(categoryId) {
  return CAMPER_APPEARANCE_CATEGORIES.find(function(category) {
    return category.id === categoryId;
  }) || null;
}

function isCamperAppearanceRangeCategory(category) {
  return Boolean(category && category.control === "range");
}

function getCamperAppearanceRangeValue(value, category) {
  const min = Number.isFinite(category && category.min) ? category.min : 0;
  const max = Number.isFinite(category && category.max) ? category.max : min;
  const step = Number.isFinite(category && category.step) && category.step > 0 ? category.step : 1;
  const defaultValue = Number.isFinite(category && category.defaultValue) ? category.defaultValue : min;
  const requestedValue = Number(value);
  const safeValue = Number.isFinite(requestedValue) ? requestedValue : defaultValue;
  const steppedValue = min + Math.round((clamp(safeValue, min, max) - min) / step) * step;

  return clamp(steppedValue, min, max);
}

function getRandomCamperAppearanceRangeValue(category) {
  const min = Number.isFinite(category && category.min) ? category.min : 0;
  const max = Number.isFinite(category && category.max) ? category.max : min;
  const step = Number.isFinite(category && category.step) && category.step > 0 ? category.step : 1;
  const stepCount = Math.max(0, Math.floor((max - min) / step));

  return clamp(min + Math.floor(Math.random() * (stepCount + 1)) * step, min, max);
}

function getCamperAppearanceInputValue(input, category) {
  if (!category) {
    return undefined;
  }

  if (input[category.id] !== undefined) {
    return input[category.id];
  }

  const legacyField = CAMPER_APPEARANCE_LEGACY_FIELD_MAP[category.id];
  return legacyField ? input[legacyField] : undefined;
}

function getDefaultCamperAppearance() {
  return CAMPER_APPEARANCE_CATEGORIES.reduce(function(appearance, category) {
    if (isCamperAppearanceRangeCategory(category)) {
      appearance[category.id] = getCamperAppearanceRangeValue(category.defaultValue, category);
      return appearance;
    }

    const options = getCamperAppearanceOptions(category.id);
    appearance[category.id] = options[0] ? options[0].id : "";
    return appearance;
  }, {});
}

function normalizeCamperAppearance(appearance) {
  const input = appearance && typeof appearance === "object" ? appearance : {};
  const fallback = getDefaultCamperAppearance();

  CAMPER_APPEARANCE_CATEGORIES.forEach(function(category) {
    if (isCamperAppearanceRangeCategory(category)) {
      fallback[category.id] = getCamperAppearanceRangeValue(getCamperAppearanceInputValue(input, category), category);
      return;
    }

    const options = getCamperAppearanceOptions(category.id);
    const requestedId = getCamperAppearanceInputValue(input, category);
    const validOption = options.find(function(option) {
      return option.id === requestedId;
    });

    fallback[category.id] = validOption ? validOption.id : fallback[category.id];
  });

  return fallback;
}

function getRandomCamperAppearance() {
  return CAMPER_APPEARANCE_CATEGORIES.reduce(function(appearance, category) {
    if (isCamperAppearanceRangeCategory(category)) {
      appearance[category.id] = getRandomCamperAppearanceRangeValue(category);
      return appearance;
    }

    const options = getCamperAppearanceOptions(category.id);
    const option = options[Math.floor(Math.random() * options.length)] || options[0];
    appearance[category.id] = option ? option.id : "";
    return appearance;
  }, {});
}

function getCamperAppearanceOption(categoryId, appearance) {
  const options = getCamperAppearanceOptions(categoryId);
  const normalizedAppearance = normalizeCamperAppearance(appearance);
  return options.find(function(option) {
    return option.id === normalizedAppearance[categoryId];
  }) || options[0] || null;
}

function getCamperAppearanceOptionIndex(categoryId, appearance) {
  const options = getCamperAppearanceOptions(categoryId);
  const normalizedAppearance = normalizeCamperAppearance(appearance);
  const index = options.findIndex(function(option) {
    return option.id === normalizedAppearance[categoryId];
  });

  return index === -1 ? 0 : index;
}

function getActiveCamperAppearance() {
  const profile = getActiveCamperProfile(gameState);
  return normalizeCamperAppearance(profile && profile.appearance);
}

function getCamperLayerAssetSheet(layer, appearance) {
  if (!layer.appearanceCategory) {
    return layer.sheet;
  }

  const option = getCamperAppearanceOption(layer.appearanceCategory, appearance);
  return option && Object.prototype.hasOwnProperty.call(option, "assetSheet") ? option.assetSheet : layer.sheet;
}

function getCamperLayerSheetPath(layer, appearance) {
  const assetSheet = getCamperLayerAssetSheet(layer, appearance);
  if (!assetSheet) {
    return "";
  }

  return withVersion(CAMPER_LAYER_SHEET_ROOT + "/" + assetSheet);
}

function getCamperHairColorFilter(appearance) {
  const hairColorCategory = getCamperAppearanceCategory("hairColor");
  const normalizedAppearance = normalizeCamperAppearance(appearance);
  const hue = getCamperAppearanceRangeValue(normalizedAppearance.hairColor, hairColorCategory);

  if (hue === CAMPER_HAIR_COLOR_RANGE.defaultValue) {
    return "";
  }

  return "hue-rotate(" + hue + "deg) saturate(1.08)";
}

function getCamperSheetFrameIndex(frameName) {
  const index = CAMPER_SHEET_FRAME_NAMES.indexOf(frameName);
  return index === -1 ? 0 : index;
}

function getCamperSheetPosition(frameName) {
  const frameIndex = getCamperSheetFrameIndex(frameName);
  const column = frameIndex % CAMPER_SHEET_COLUMNS;
  const row = Math.floor(frameIndex / CAMPER_SHEET_COLUMNS);
  const x = CAMPER_SHEET_COLUMNS <= 1 ? 0 : column / (CAMPER_SHEET_COLUMNS - 1) * 100;
  const y = CAMPER_SHEET_ROWS <= 1 ? 0 : row / (CAMPER_SHEET_ROWS - 1) * 100;

  return {
    x,
    y
  };
}

function ensureCamperLayerElement(container, layer) {
  if (!container) {
    return null;
  }

  let element = container.querySelector('[data-camper-layer="' + layer.id + '"]');

  if (element && element.tagName !== "DIV") {
    element.remove();
    element = null;
  }

  if (!element) {
    element = document.createElement("div");
    element.className = "camper-layer camper-layer-" + layer.id;
    element.dataset.camperLayer = layer.id;
    container.appendChild(element);
  }

  return element;
}

function removeUnusedCamperLayerElements(container) {
  const activeLayerIds = CAMPER_LAYER_RENDER_ORDER.map(function(layer) {
    return layer.id;
  });

  Array.from(container.querySelectorAll("[data-camper-layer]")).forEach(function(element) {
    if (activeLayerIds.indexOf(element.dataset.camperLayer) === -1) {
      element.remove();
    }
  });
}

function applyCamperLayerAppearance(element, layer, appearance) {
  if (!element) {
    return;
  }

  if (layer.id === "hair") {
    const nextFilter = getCamperHairColorFilter(appearance);

    if (element.dataset.camperHairColorFilter !== nextFilter) {
      element.style.filter = nextFilter;
      element.dataset.camperHairColorFilter = nextFilter;
    }

    return;
  }

  if (element.dataset.camperHairColorFilter !== undefined) {
    element.style.filter = "";
    delete element.dataset.camperHairColorFilter;
  }
}

function renderCamperLayerStack(container, appearance, frameName) {
  if (!container) {
    return;
  }

  const normalizedAppearance = normalizeCamperAppearance(appearance);
  const activeFrameName = frameName || CAMPER_IDLE_FRAME_NAME;
  const sheetPosition = getCamperSheetPosition(activeFrameName);
  const backgroundPosition = sheetPosition.x + "% " + sheetPosition.y + "%";

  removeUnusedCamperLayerElements(container);

  CAMPER_LAYER_RENDER_ORDER.forEach(function(layer) {
    const element = ensureCamperLayerElement(container, layer);
    const nextPath = getCamperLayerSheetPath(layer, normalizedAppearance);

    if (!element) {
      return;
    }

    if (!nextPath) {
      if (element.dataset.camperLayerSrc !== "") {
        element.style.backgroundImage = "";
        element.dataset.camperLayerSrc = "";
      }
      element.style.display = "none";
      return;
    }

    if (element.style.display === "none") {
      element.style.display = "";
    }

    if (element.dataset.camperLayerSrc !== nextPath) {
      element.style.backgroundImage = 'url("' + nextPath + '")';
      element.dataset.camperLayerSrc = nextPath;
    }

    if (element.dataset.camperFramePosition !== backgroundPosition) {
      element.style.backgroundPosition = backgroundPosition;
      element.dataset.camperFramePosition = backgroundPosition;
    }

    applyCamperLayerAppearance(element, layer, normalizedAppearance);
  });
}

function getCamperFrameNameForPose() {
  const frameNames = assetPaths.characters.frameNames;

  if (camper.pose === "walking") {
    return getCamperAnimationFrame(frameNames.walkFrames, frameNames.idle);
  }

  if (camper.pose === "carryingWood" || camper.pose === "addingWoodToFire") {
    return getCamperAnimationFrame(frameNames.carryFrames, frameNames.carry);
  }

  if (camper.pose === "sittingGround") {
    return frameNames.sitGround;
  }

  if (camper.pose === "sittingChair") {
    return frameNames.sitChair;
  }

  if (camper.pose === "lookingLakeBack") {
    return frameNames.lookLakeBack;
  }

  if (camper.pose === "resting" || camper.pose === "tentRest") {
    return frameNames.rest;
  }

  return frameNames.idle;
}

function renderCamperAppearanceControls() {
  if (!camperAppearanceControls) {
    return;
  }

  const appearance = normalizeCamperAppearance(camperProfileDraftAppearance);
  camperAppearanceControls.innerHTML = "";

  CAMPER_APPEARANCE_CATEGORIES.forEach(function(category) {
    const row = document.createElement("div");
    const label = document.createElement("span");

    row.className = "camper-appearance-row";
    label.className = "camper-appearance-label";
    label.textContent = category.label;

    if (isCamperAppearanceRangeCategory(category)) {
      const rangeValue = getCamperAppearanceRangeValue(appearance[category.id], category);
      const slider = document.createElement("input");
      const value = document.createElement("strong");

      row.className += " camper-appearance-range-row";
      slider.className = "camper-appearance-slider";
      slider.type = "range";
      slider.min = String(category.min);
      slider.max = String(category.max);
      slider.step = String(category.step);
      slider.value = String(rangeValue);
      slider.setAttribute("aria-label", category.label);
      slider.addEventListener("input", function(event) {
        const nextValue = changeCamperAppearanceRange(category.id, event.currentTarget.value);
        value.textContent = Math.round(nextValue) + "°";
      });

      value.className = "camper-appearance-value camper-appearance-color-value";
      value.textContent = Math.round(rangeValue) + "°";

      row.appendChild(label);
      row.appendChild(slider);
      row.appendChild(value);
      camperAppearanceControls.appendChild(row);
      return;
    }

    const options = getCamperAppearanceOptions(category.id);
    const optionIndex = getCamperAppearanceOptionIndex(category.id, appearance);
    const option = options[optionIndex] || options[0];
    const previousButton = document.createElement("button");
    const value = document.createElement("strong");
    const nextButton = document.createElement("button");

    previousButton.className = "camper-appearance-arrow";
    previousButton.type = "button";
    previousButton.textContent = "‹";
    previousButton.setAttribute("aria-label", "Previous " + category.label);
    previousButton.title = "Previous " + category.label;
    previousButton.addEventListener("click", function() {
      changeCamperAppearanceOption(category.id, -1);
    });

    value.className = "camper-appearance-value";
    value.textContent = option ? option.label : "Default";

    nextButton.className = "camper-appearance-arrow";
    nextButton.type = "button";
    nextButton.textContent = "›";
    nextButton.setAttribute("aria-label", "Next " + category.label);
    nextButton.title = "Next " + category.label;
    nextButton.addEventListener("click", function() {
      changeCamperAppearanceOption(category.id, 1);
    });

    row.appendChild(label);
    row.appendChild(previousButton);
    row.appendChild(value);
    row.appendChild(nextButton);
    camperAppearanceControls.appendChild(row);
  });
}

function updateCamperAppearancePreview() {
  renderCamperLayerStack(camperAppearancePreview, camperProfileDraftAppearance, CAMPER_IDLE_FRAME_NAME);
}

function changeCamperAppearanceOption(categoryId, direction) {
  const options = getCamperAppearanceOptions(categoryId);

  if (!options.length) {
    return;
  }

  const currentAppearance = normalizeCamperAppearance(camperProfileDraftAppearance);
  const currentIndex = getCamperAppearanceOptionIndex(categoryId, currentAppearance);
  const nextIndex = (currentIndex + direction + options.length) % options.length;

  currentAppearance[categoryId] = options[nextIndex].id;
  camperProfileDraftAppearance = currentAppearance;
  renderCamperAppearanceControls();
  updateCamperAppearancePreview();
  updateCamperSprite();
}

function changeCamperAppearanceRange(categoryId, value) {
  const category = getCamperAppearanceCategory(categoryId);

  if (!isCamperAppearanceRangeCategory(category)) {
    return 0;
  }

  const currentAppearance = normalizeCamperAppearance(camperProfileDraftAppearance);
  const nextValue = getCamperAppearanceRangeValue(value, category);

  currentAppearance[categoryId] = nextValue;
  camperProfileDraftAppearance = currentAppearance;
  updateCamperAppearancePreview();
  updateCamperSprite();

  return nextValue;
}

function getActiveCamperProfile(state) {
  const campState = state || gameState;
  const campers = Array.isArray(campState.campers) ? campState.campers : [];
  const index = Number.isInteger(campState.activeCamperIndex) ? campState.activeCamperIndex : 0;

  return campers[index] || campers[0] || null;
}

function hasCamperProfile(state) {
  const profile = getActiveCamperProfile(state);
  return Boolean(
    state &&
    Number(state.camperProfileVersion) >= CAMPER_PROFILE_VERSION &&
    profile &&
    sanitizeCamperName(profile.name) &&
    CAMPER_PERSONALITIES[profile.personalityId]
  );
}

function getActiveCamperPersonality() {
  const profile = getActiveCamperProfile(gameState);
  return profile && CAMPER_PERSONALITIES[profile.personalityId] ? CAMPER_PERSONALITIES[profile.personalityId] : null;
}

function sanitizeCamperProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  const personality = CAMPER_PERSONALITIES[profile.personalityId];
  const name = sanitizeCamperName(profile.name);

  if (!personality || !name) {
    return null;
  }

  const catchphrase = sanitizeCamperCatchphrase(profile.catchphrase) || getDefaultCamperCatchphrase(profile.personalityId);
  const catchphraseEdited = Boolean(profile.catchphraseEdited && sanitizeCamperCatchphrase(profile.catchphrase));

  return {
    id: profile.id || "camper-" + Date.now().toString(36),
    name: name,
    personalityId: profile.personalityId,
    title: personality.title,
    description: personality.description,
    catchphrase: catchphrase,
    catchphraseEdited: catchphraseEdited,
    appearance: normalizeCamperAppearance(profile.appearance),
    traits: profile.traits && typeof profile.traits === "object" ? { ...profile.traits } : {},
    quiz: profile.quiz && typeof profile.quiz === "object" ? { ...profile.quiz } : {},
    createdAt: Number(profile.createdAt) || Date.now(),
    updatedAt: Number(profile.updatedAt) || Date.now()
  };
}

function getShuffledCopy(items) {
  const result = items.slice();

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const item = result[index];
    result[index] = result[swapIndex];
    result[swapIndex] = item;
  }

  return result;
}

function pickCamperProfileQuestions() {
  return getShuffledCopy(CAMPER_PROFILE_QUESTIONS).slice(0, CAMPER_PROFILE_QUESTION_COUNT);
}

function buildCamperProfileResult(name, questions, answers, appearance) {
  const scores = {};

  Object.keys(CAMPER_PERSONALITIES).forEach(function(personalityId) {
    scores[personalityId] = 0;
  });

  answers.forEach(function(answer) {
    const traits = answer && answer.traits ? answer.traits : {};

    Object.keys(traits).forEach(function(personalityId) {
      if (scores[personalityId] === undefined) {
        scores[personalityId] = 0;
      }

      scores[personalityId] += Number(traits[personalityId]) || 0;
    });
  });

  const personalityId = Object.keys(CAMPER_PERSONALITIES).sort(function(firstId, secondId) {
    return scores[secondId] - scores[firstId];
  })[0] || "slowMood";
  const personality = CAMPER_PERSONALITIES[personalityId];
  const existingProfile = getActiveCamperProfile(gameState);
  const existingCatchphrase = existingProfile && sanitizeCamperCatchphrase(existingProfile.catchphrase);
  const catchphraseEdited = Boolean(existingProfile && existingProfile.catchphraseEdited && existingCatchphrase);

  return {
    id: existingProfile && existingProfile.id || "camper-" + Date.now().toString(36),
    name: sanitizeCamperName(name) || getRandomCamperName(),
    personalityId: personalityId,
    title: personality.title,
    description: personality.description,
    catchphrase: catchphraseEdited ? existingCatchphrase : getDefaultCamperCatchphrase(personalityId),
    catchphraseEdited: catchphraseEdited,
    appearance: normalizeCamperAppearance(appearance),
    traits: scores,
    quiz: {
      questionCount: questions.length,
      questions: questions.map(function(question) {
        return question.text;
      }),
      answers: answers.map(function(answer) {
        return answer && answer.text || "";
      })
    },
    createdAt: existingProfile && existingProfile.createdAt || Date.now(),
    updatedAt: Date.now()
  };
}

function getCamperProfileIntroBody() {
  if (camperProfileMode === "manual") {
    return "重新认识一下这位 Camper。只会更新名字、称号和小气泡，不会重置营地进度。";
  }

  if (loadedExistingSaveWithoutCamperProfile) {
    return "你的营地已经准备好了，现在来认识一下住在这里的 Camper 吧。原来的 Cozy Points、装备、摆放和引导进度都会保留。";
  }

  return "先认识一下住进营地的 Camper。答几个轻松的小问题，然后它就会带着自己的小性格开始生活。";
}

function setCamperProfileStep(step) {
  camperProfileStep = step;
  updateCamperProfileView();
}

function renderCamperQuestionOptions(question) {
  camperQuestionOptions.innerHTML = "";

  question.options.forEach(function(option, optionIndex) {
    const optionButton = document.createElement("button");
    const selectedAnswer = camperProfileAnswers[camperProfileQuestionIndex];

    optionButton.className = "camper-question-option" + (selectedAnswer === option ? " selected" : "");
    optionButton.type = "button";
    optionButton.textContent = option.text;
    optionButton.addEventListener("click", function() {
      camperProfileAnswers[camperProfileQuestionIndex] = option;
      renderCamperQuestionOptions(question);
      updateCamperProfileView();
    });

    camperQuestionOptions.appendChild(optionButton);
  });
}

function getCamperProfileForCard() {
  return camperProfileDraftResult || getActiveCamperProfile(gameState);
}

function syncCamperCardEditingUi(profile) {
  const cardProfile = profile || getCamperProfileForCard();
  const catchphrase = cardProfile ? sanitizeCamperCatchphrase(cardProfile.catchphrase) || getDefaultCamperCatchphrase(cardProfile.personalityId) : "";
  const editingName = camperCardEditingField === "name";
  const editingCatchphrase = camperCardEditingField === "catchphrase";

  if (camperResultName) {
    camperResultName.classList.toggle("hidden", editingName);
  }

  if (camperCatchphraseText) {
    camperCatchphraseText.classList.toggle("hidden", editingCatchphrase);
  }

  if (camperNameEditInput) {
    camperNameEditInput.classList.toggle("hidden", !editingName);
    if (!editingName && cardProfile) {
      camperNameEditInput.value = cardProfile.name;
    }
  }

  if (camperCatchphraseEditInput) {
    camperCatchphraseEditInput.classList.toggle("hidden", !editingCatchphrase);
    if (!editingCatchphrase) {
      camperCatchphraseEditInput.value = catchphrase;
    }
  }

  if (camperNameEditButton) {
    camperNameEditButton.textContent = editingName ? "✓" : "✎";
    camperNameEditButton.setAttribute("aria-label", editingName ? "Save nickname" : "Edit nickname");
    camperNameEditButton.title = editingName ? "Save nickname" : "Edit nickname";
  }

  if (camperCatchphraseEditButton) {
    camperCatchphraseEditButton.textContent = editingCatchphrase ? "✓" : "✎";
    camperCatchphraseEditButton.setAttribute("aria-label", editingCatchphrase ? "Save catchphrase" : "Edit catchphrase");
    camperCatchphraseEditButton.title = editingCatchphrase ? "Save catchphrase" : "Edit catchphrase";
  }
}

function setCamperCardEditingField(field) {
  camperCardEditingField = field || "";
  renderCamperCard();

  if (camperCardEditingField === "name" && camperNameEditInput) {
    requestAnimationFrame(function() {
      camperNameEditInput.focus();
      camperNameEditInput.select();
    });
  } else if (camperCardEditingField === "catchphrase" && camperCatchphraseEditInput) {
    requestAnimationFrame(function() {
      camperCatchphraseEditInput.focus();
      camperCatchphraseEditInput.select();
    });
  }
}

function renderCamperCard(profile) {
  const cardProfile = profile || getCamperProfileForCard();

  if (!cardProfile) {
    return;
  }

  const personality = getCamperPersonality(cardProfile.personalityId);
  const catchphrase = sanitizeCamperCatchphrase(cardProfile.catchphrase) || getDefaultCamperCatchphrase(cardProfile.personalityId);

  if (camperCardBackground) {
    camperCardBackground.src = withVersion(getCamperCardBackgroundPath(cardProfile.personalityId));
  }

  if (camperCardPortrait) {
    camperCardPortrait.setAttribute("aria-label", cardProfile.name + " camper portrait");
  }

  if (camperCardCamper) {
    renderCamperLayerStack(camperCardCamper, cardProfile.appearance, CAMPER_IDLE_FRAME_NAME);
  }

  if (camperResultName) {
    camperResultName.textContent = cardProfile.name;
  }

  if (camperResultTitle) {
    camperResultTitle.textContent = personality.title;
  }

  if (camperResultDescription) {
    camperResultDescription.textContent = personality.description;
  }

  if (camperCatchphraseText) {
    camperCatchphraseText.textContent = "“" + catchphrase + "”";
  }

  syncCamperCardEditingUi(cardProfile);
}

function updateCamperProfileView() {
  if (!camperProfileActive || !camperProfileLayer) {
    return;
  }

  const isNameStep = camperProfileStep === "name";
  const isAppearanceStep = camperProfileStep === "appearance";
  const isQuestionStep = camperProfileStep === "question";
  const isResultStep = camperProfileStep === "result";
  const currentQuestion = camperProfileQuestions[camperProfileQuestionIndex];

  if (camperProfilePanel) {
    camperProfilePanel.classList.toggle("camper-card-panel", isResultStep);
  }

  camperNameStep.classList.toggle("hidden", !isNameStep);
  camperAppearanceStep.classList.toggle("hidden", !isAppearanceStep);
  camperQuestionStep.classList.toggle("hidden", !isQuestionStep);
  camperResultStep.classList.toggle("hidden", !isResultStep);

  if (isNameStep) {
    camperProfileStepLabel.textContent = "Create Camper";
    camperProfileTitle.textContent = "Who lives here?";
    camperProfileBody.textContent = getCamperProfileIntroBody();
    camperProfilePrimaryButton.textContent = "Next: look";
    camperProfilePrimaryButton.disabled = !sanitizeCamperName(camperNameInput.value);
    camperProfileSecondaryButton.textContent = hasCamperProfile(gameState) ? "Close" : "Random camper";
  } else if (isAppearanceStep) {
    camperProfileStepLabel.textContent = camperProfileMode === "appearanceOnly" ? "Re-customize Camper" : "Customize Camper";
    camperProfileTitle.textContent = camperProfileDraftName;
    camperProfileBody.textContent = camperProfileMode === "appearanceOnly" ? "只会更新小人外观，昵称、性格、口头禅和背景都会保留。" : "先捏一下小人，再答几个轻松的小问题。";
    camperProfilePrimaryButton.textContent = camperProfileMode === "appearanceOnly" ? "保存外观" : "Start questions";
    camperProfilePrimaryButton.disabled = false;
    camperProfileSecondaryButton.textContent = "随机";
    renderCamperAppearanceControls();
    updateCamperAppearancePreview();
  } else if (isQuestionStep && currentQuestion) {
    camperProfileStepLabel.textContent = "Question " + (camperProfileQuestionIndex + 1) + " / " + camperProfileQuestions.length;
    camperProfileTitle.textContent = camperProfileDraftName;
    camperProfileBody.textContent = camperProfileMode === "retakeQuiz" ? "只会更新性格、描述和名片背景，不会重置昵称或外观。" : "选一个最像它今天状态的答案。";
    camperQuestionText.textContent = currentQuestion.text;
    renderCamperQuestionOptions(currentQuestion);
    camperProfilePrimaryButton.textContent = camperProfileQuestionIndex >= camperProfileQuestions.length - 1 ? "See card" : "Next";
    camperProfilePrimaryButton.disabled = !camperProfileAnswers[camperProfileQuestionIndex];
    camperProfileSecondaryButton.textContent = hasCamperProfile(gameState) ? "Cancel" : "Random camper";
  } else if (isResultStep && camperProfileDraftResult) {
    camperProfileStepLabel.textContent = "Camper Card";
    camperProfileTitle.textContent = "Camper Card";
    camperProfileBody.textContent = "";
    renderCamperCard(camperProfileDraftResult);
    camperProfilePrimaryButton.textContent = "Close";
    camperProfilePrimaryButton.disabled = false;
    camperProfileSecondaryButton.textContent = "Retake";
  }
}

function startCamperProfileFlow(mode) {
  if (!camperProfileLayer) {
    return;
  }

  if (onboardingActive) {
    completeOnboarding(false);
  }

  if (isShopOpen()) {
    closeShop();
  }

  if (isBuildModeActive()) {
    exitBuildMode();
  }

  const existingProfile = getActiveCamperProfile(gameState);
  const hasExistingProfile = hasCamperProfile(gameState);

  camperProfileActive = true;
  camperProfileMode = mode || "required";
  camperProfileStep = "name";
  camperProfileQuestionIndex = 0;
  camperProfileQuestions = pickCamperProfileQuestions();
  camperProfileAnswers = [];
  camperProfileDraftName = existingProfile && existingProfile.name || "";
  camperProfileDraftResult = null;
  camperProfileDraftAppearance = normalizeCamperAppearance(existingProfile && existingProfile.appearance);

  if (camperProfileMode === "card" && hasExistingProfile) {
    camperProfileStep = "result";
    camperProfileDraftResult = sanitizeCamperProfile(existingProfile);
  } else if (camperProfileMode === "retakeQuiz" && hasExistingProfile) {
    camperProfileStep = "question";
  } else if (camperProfileMode === "appearanceOnly" && hasExistingProfile) {
    camperProfileStep = "appearance";
  }

  camperNameInput.value = camperProfileDraftName;
  camperProfileLayer.classList.remove("hidden");
  camperProfileLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("camper-profile-open");
  updateCamperProfileView();

  if (camperProfileStep === "name") {
    requestAnimationFrame(function() {
      if (camperNameInput) {
        camperNameInput.focus();
        camperNameInput.select();
      }
    });
  }
}

function closeCamperProfileFlow() {
  camperProfileActive = false;
  camperCardEditingField = "";
  camperProfileLayer.classList.add("hidden");
  camperProfileLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("camper-profile-open");
  if (camperProfilePanel) {
    camperProfilePanel.classList.remove("camper-card-panel");
  }
  updateCamperSprite();
}

function randomizeCamperProfileDraft() {
  const name = sanitizeCamperName(camperNameInput.value) || getRandomCamperName();

  camperProfileQuestions = pickCamperProfileQuestions();
  camperProfileAnswers = camperProfileQuestions.map(function(question) {
    return question.options[Math.floor(Math.random() * question.options.length)];
  });
  camperProfileDraftName = name;
  camperProfileDraftAppearance = getRandomCamperAppearance();
  camperProfileDraftResult = buildCamperProfileResult(name, camperProfileQuestions, camperProfileAnswers, camperProfileDraftAppearance);
  saveCamperProfileResult(true);
  setCamperProfileStep("result");
}

function setActiveCamperProfile(profile) {
  const cleanProfile = sanitizeCamperProfile(profile);

  if (!cleanProfile) {
    return null;
  }

  const campers = Array.isArray(gameState.campers) ? gameState.campers.slice() : [];

  campers[0] = cleanProfile;
  gameState.campers = campers;
  gameState.activeCamperIndex = 0;
  gameState.camperProfileVersion = CAMPER_PROFILE_VERSION;
  saveGame();
  return cleanProfile;
}

function saveCamperProfileResult(keepOpen) {
  if (!camperProfileDraftResult) {
    return null;
  }

  const savedProfile = setActiveCamperProfile(camperProfileDraftResult);

  if (!savedProfile) {
    return null;
  }

  camperProfileDraftResult = savedProfile;
  renderCamperCard(savedProfile);
  setStatus(savedProfile.name + " is ready for camp.");
  updateCamperProfileControls();
  updateCamperSprite();
  chooseNextCamperAction();

  if (keepOpen) {
    return savedProfile;
  }

  closeCamperProfileFlow();
  maybeStartOnboarding();
  return savedProfile;
}

function advanceCamperProfileFlow() {
  if (!camperProfileActive) {
    return;
  }

  if (camperProfileStep === "name") {
    const name = sanitizeCamperName(camperNameInput.value);

    if (!name) {
      setStatus("Give your Camper a name first.");
      updateCamperProfileView();
      return;
    }

    camperProfileDraftName = name;
    setCamperProfileStep("appearance");
    return;
  }

  if (camperProfileStep === "appearance") {
    camperProfileDraftAppearance = normalizeCamperAppearance(camperProfileDraftAppearance);

    if (camperProfileMode === "appearanceOnly") {
      const existingProfile = getActiveCamperProfile(gameState);

      if (!existingProfile) {
        closeCamperProfileFlow();
        return;
      }

      camperProfileDraftResult = {
        ...existingProfile,
        appearance: camperProfileDraftAppearance,
        updatedAt: Date.now()
      };
      saveCamperProfileResult(true);
      setCamperProfileStep("result");
      return;
    }

    setCamperProfileStep("question");
    return;
  }

  if (camperProfileStep === "question") {
    if (!camperProfileAnswers[camperProfileQuestionIndex]) {
      updateCamperProfileView();
      return;
    }

    if (camperProfileQuestionIndex >= camperProfileQuestions.length - 1) {
      camperProfileDraftResult = buildCamperProfileResult(camperProfileDraftName, camperProfileQuestions, camperProfileAnswers, camperProfileDraftAppearance);
      saveCamperProfileResult(true);
      setCamperProfileStep("result");
    } else {
      camperProfileQuestionIndex += 1;
      setCamperProfileStep("question");
    }

    return;
  }

  if (camperProfileStep === "result") {
    closeCamperProfileFlow();
    maybeStartOnboarding();
  }
}

function handleCamperProfileSecondaryAction() {
  if (camperProfileStep === "result") {
    startCamperProfileFlow("retakeQuiz");
    return;
  }

  if (camperProfileStep === "appearance") {
    camperProfileDraftAppearance = getRandomCamperAppearance();
    renderCamperAppearanceControls();
    updateCamperAppearancePreview();
    updateCamperSprite();
    return;
  }

  if (hasCamperProfile(gameState)) {
    if (camperProfileMode === "retakeQuiz" || camperProfileMode === "appearanceOnly") {
      startCamperProfileFlow("card");
      return;
    }

    closeCamperProfileFlow();
    return;
  }

  randomizeCamperProfileDraft();
}

function closeCamperCardAndResume() {
  closeCamperProfileFlow();
  maybeStartOnboarding();
}

function editActiveCamperName() {
  const profile = getActiveCamperProfile(gameState);

  if (!profile) {
    return;
  }

  if (camperCardEditingField !== "name") {
    setCamperCardEditingField("name");
    return;
  }

  const nextName = sanitizeCamperName(camperNameEditInput && camperNameEditInput.value);

  if (!nextName) {
    setStatus("Give your Camper a name first.");
    return;
  }

  const savedProfile = setActiveCamperProfile({
    ...profile,
    name: nextName,
    updatedAt: Date.now()
  });

  if (savedProfile) {
    camperProfileDraftResult = savedProfile;
    camperCardEditingField = "";
    renderCamperCard(savedProfile);
    updateCamperProfileControls();
    setStatus("Camper name updated.");
  }
}

function editActiveCamperCatchphrase() {
  const profile = getActiveCamperProfile(gameState);

  if (!profile) {
    return;
  }

  if (camperCardEditingField !== "catchphrase") {
    setCamperCardEditingField("catchphrase");
    return;
  }

  const nextCatchphrase = sanitizeCamperCatchphrase(camperCatchphraseEditInput && camperCatchphraseEditInput.value);

  if (!nextCatchphrase) {
    setStatus("Catchphrase cannot be empty.");
    return;
  }

  const savedProfile = setActiveCamperProfile({
    ...profile,
    catchphrase: nextCatchphrase,
    catchphraseEdited: true,
    updatedAt: Date.now()
  });

  if (savedProfile) {
    camperProfileDraftResult = savedProfile;
    camperCardEditingField = "";
    renderCamperCard(savedProfile);
    setStatus("Catchphrase updated.");
  }
}

function handleCamperCardInlineInputKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (event.currentTarget === camperNameEditInput) {
      editActiveCamperName();
    } else if (event.currentTarget === camperCatchphraseEditInput) {
      editActiveCamperCatchphrase();
    }
  } else if (event.key === "Escape") {
    event.preventDefault();
    setCamperCardEditingField("");
  }
}

function updateCamperProfileControls() {
  const profile = getActiveCamperProfile(gameState);

  if (!camperProfileButton) {
    return;
  }

  camperProfileButton.setAttribute("title", profile ? profile.name + ": " + profile.title : "Create camper");
}

function maybeStartInteractionGuide() {
  if (!hasCamperProfile(gameState) || camperProfileActive || !gameState.onboardingSeen || gameState.interactionGuideSeen || onboardingActive) {
    return;
  }

  if (!getInteractionGuideTargetItem()) {
    return;
  }

  startStandaloneGuide("tapInteraction");
}

function maybeStartBuildModeGuide() {
  if (!hasCamperProfile(gameState) || camperProfileActive || gameState.buildModeGuideSeen || onboardingActive) {
    return;
  }

  // Prompt the player toward the Build button once it is unlocked and visible.
  // The button lives in the floating controls, which are hidden while the shop
  // is open, so wait until the shop is closed before pointing at it.
  if (!gameState.onboardingSeen || !isBuildModeUnlocked() || buildModeActive) {
    return;
  }

  if (document.body.classList.contains("shop-open")) {
    return;
  }

  startStandaloneGuide("buildMode");
}

function maybeStartOnboarding() {
  if (!hasCamperProfile(gameState)) {
    startCamperProfileFlow("required");
    return;
  }

  if (camperProfileActive) {
    return;
  }

  if (!gameState.onboardingSeen) {
    startOnboarding(false);
    return;
  }

  maybeStartInteractionGuide();
}

function resetSaveIfRequestedByUrl() {
  const query = new URLSearchParams(window.location.search);

  if (query.get("reset") === "1") {
    localStorage.removeItem(SAVE_KEY);
    saveWasResetFromUrl = true;
  }
}

function addUniqueGear(ownedGear, id) {
  const normalizedId = normalizeGearId(id);

  if (getGearItem(normalizedId) && ownedGear.indexOf(normalizedId) === -1) {
    ownedGear.push(normalizedId);
  }
}

function addUniquePlacedGear(placedGear, id) {
  const normalizedId = normalizeGearId(id);
  const item = getGearItem(normalizedId);

  if (item && isGearPlaceable(item) && placedGear.indexOf(normalizedId) === -1) {
    placedGear.push(normalizedId);
  }
}

function ownsGear(id, state) {
  const campState = state || gameState;
  const normalizedId = normalizeGearId(id);

  return Array.isArray(campState.ownedGear) && campState.ownedGear.indexOf(normalizedId) !== -1;
}

function isGearPlaced(id, state) {
  const campState = state || gameState;
  const normalizedId = normalizeGearId(id);

  return Array.isArray(campState.placedGear) && campState.placedGear.indexOf(normalizedId) !== -1;
}

function removePlacedGear(id) {
  const normalizedId = normalizeGearId(id);

  gameState.placedGear = (gameState.placedGear || []).filter(function(placedId) {
    return placedId !== normalizedId;
  });
}

function getOwnedGearItems(state) {
  const campState = state || gameState;

  return (campState.ownedGear || []).map(function(id) {
    return getGearItem(id);
  }).filter(Boolean);
}

function ownsAnyGearInCategory(category, state) {
  return getOwnedGearItems(state).some(function(item) {
    return item.category === category;
  });
}

function getEquippedGearId(category, state) {
  const campState = state || gameState;
  return campState.equippedGear && campState.equippedGear[category] ? campState.equippedGear[category] : null;
}

function getEquippedGearItem(category, state) {
  return getGearItem(getEquippedGearId(category, state));
}

function getRequirementLabel(requirement) {
  if (getGearItem(requirement)) {
    return getGearItem(requirement).displayName;
  }

  return String(requirement);
}

function getMissingGearRequirements(item, state) {
  const campState = state || gameState;
  const missing = [];
  const requires = item && item.requires ? item.requires : {};

  if (Array.isArray(requires)) {
    requires.forEach(function(requiredId) {
      if (!ownsGear(requiredId, campState)) {
        missing.push(getRequirementLabel(requiredId));
      }
    });
  }

  (requires.all || []).forEach(function(requiredId) {
    if (!ownsGear(requiredId, campState)) {
      missing.push(getRequirementLabel(requiredId));
    }
  });

  (requires.anyOwnedCategory || []).forEach(function(category) {
    if (!ownsAnyGearInCategory(category, campState)) {
      missing.push("Requires " + category);
    }
  });

  if (Array.isArray(requires.any) && requires.any.length > 0) {
    const hasAny = requires.any.some(function(requiredId) {
      return ownsGear(requiredId, campState);
    });

    if (!hasAny) {
      missing.push("Requires " + requires.any.map(getRequirementLabel).join(" or "));
    }
  }

  return missing;
}

function hasNightUnlock(state) {
  return getOwnedGearItems(state).some(function(item) {
    return item.unlocks && item.unlocks.nightMode;
  });
}

function isTentItem(item) {
  return Boolean(item && item.category === "tent");
}

function isTarpItem(item) {
  return Boolean(item && item.category === "tarp");
}

function isVehicleItem(item) {
  return Boolean(item && item.category === "vehicle");
}

function isRooftopTentItem(item) {
  return Boolean(item && item.id === "rooftopTent");
}

function isEquippableGear(item) {
  return Boolean(item && (isTentItem(item) || isTarpItem(item) || isVehicleItem(item)));
}

function isGearPlaceable(item) {
  if (!item || item.interactions && item.interactions.upgradeCampfire) {
    return false;
  }

  if (isVehicleItem(item)) {
    return Boolean(item.scene);
  }

  if (isTentItem(item) || isTarpItem(item)) {
    return false;
  }

  return Boolean(item.scene || item.attachment);
}

function isCurrentRooftopTentEquipped(state) {
  return getEquippedGearId("tent", state || gameState) === "rooftopTent";
}

function isGearVisibleInShop(item) {
  const group = item && shopGroupData[item.shopGroup];

  return Boolean(item && group && group.visible !== false);
}

function calculateComfort(state) {
  let comfort = 0;

  getOwnedGearItems(state).forEach(function(item) {
    if (isEquippableGear(item) && getEquippedGearId(item.category, state) !== item.id) {
      return;
    }

    comfort += Number(item.comfort) || 0;
  });

  return comfort;
}

function getComfortMultiplier() {
  return 1 + gameState.comfort * 0.025;
}

function getCozyPointsPerSecond() {
  return campfireBaseRates[gameState.campfireLevel] * getComfortMultiplier();
}

function getWarmthBurnRate() {
  return campfireBurnRates[gameState.campfireLevel];
}

function getWarmthAutoRestore() {
  if (gameState.campfireLevel >= 3) {
    return 0.15;
  }

  return 0;
}

function getNetWarmthBurnRate() {
  return Math.max(0.1, getWarmthBurnRate() - getWarmthAutoRestore());
}

function getWoodWarmthValue() {
  return 18 + gameState.campfireLevel * 6;
}

function getOfflineCapSeconds() {
  const tentItem = getEquippedGearItem("tent");
  return baseOfflineSeconds + (tentItem && Number(tentItem.offlineBonusSeconds) || 0);
}

function getCampfireUpgradeCost() {
  return campfireUpgradeCosts[gameState.campfireLevel] || 0;
}

function getCampfireShopImage() {
  const displayLevel = Math.min(gameState.campfireLevel + 1, 3);
  return assetPaths.campfire.base[displayLevel] || assetPaths.campfire.base[gameState.campfireLevel];
}

function getCurrentFlameImage() {
  const flameSet = Math.floor(Date.now() / 450) % 2 === 0 ? assetPaths.campfire.flame1 : assetPaths.campfire.flame2;
  return flameSet[gameState.campfireLevel];
}

function saveGame() {
  gameState.lastSaveTime = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function resetCamperForNewGame() {
  camper = {
    x: 34,
    y: 75,
    state: "idle",
    pose: "idle",
    target: null,
    actionAfterArrival: null,
    currentAction: null,
    actionTimer: 0,
    targetWoodId: null,
    woodCollectionSource: null,
    carryingWood: false,
    facing: "right",
    animationStartedAt: Date.now(),
    pathPoints: [],
    pathSegmentLengths: [],
    pathStartedAt: 0,
    pathDurationMs: 0,
    pathLength: 0,
    interactionTargetId: ""
  };
}

function resetGameToFreshStart(message) {
  localStorage.removeItem(SAVE_KEY);
  gameState = createDefaultGameState();
  gameState.comfort = calculateComfort();
  woodItems = [];
  nextWoodId = 1;
  woodLayer.innerHTML = "";
  clearActionQueue();

  resetCamperForNewGame();
  closeShop();
  spawnWood();
  spawnWood();
  setShopFilter(activeShopFilter);
  updateScreen();
  updateCamperView();
  chooseNextCamperAction();
  saveGame();
  showWelcome(message || "Save reset. Camp starts fresh.");
  maybeStartOnboarding();
}

function confirmResetSave() {
  const shouldReset = window.confirm("Reset this local save and start a fresh camp?");

  if (shouldReset) {
    resetGameToFreshStart("Save reset. Camp starts fresh.");
  }
}

function sanitizeSave(savedGame) {
  const cleanState = createDefaultGameState();

  // This gently migrates the Version 1 save shape if it exists.
  if (savedGame && savedGame.warmth !== undefined && savedGame.warmthSeconds === undefined) {
    cleanState.warmthSeconds = savedGame.warmth;
  }

  if (savedGame && savedGame.lastSavedTime !== undefined && savedGame.lastSaveTime === undefined) {
    cleanState.lastSaveTime = savedGame.lastSavedTime;
  }

  if (savedGame) {
    cleanState.cozyPoints = savedGame.cozyPoints;
    if (savedGame.warmthSeconds !== undefined) {
      cleanState.warmthSeconds = savedGame.warmthSeconds;
    }
    cleanState.campfireLevel = savedGame.campfireLevel;
    cleanState.nightUnlocked = savedGame.nightUnlocked;
    cleanState.isNight = savedGame.isNight;
    if (savedGame.gatherWoodMode !== undefined) {
      cleanState.gatherWoodMode = savedGame.gatherWoodMode;
    } else {
      cleanState.gatherWoodMode = true;
    }
    if (savedGame.onboardingSeen !== undefined) {
      cleanState.onboardingSeen = Boolean(savedGame.onboardingSeen);
    } else {
      cleanState.onboardingSeen = true;
    }
    if (savedGame.interactionGuideSeen !== undefined) {
      cleanState.interactionGuideSeen = Boolean(savedGame.interactionGuideSeen);
    } else {
      cleanState.interactionGuideSeen = Boolean(cleanState.onboardingSeen);
    }
    if (savedGame.buildModeGuideSeen !== undefined) {
      cleanState.buildModeGuideSeen = Boolean(savedGame.buildModeGuideSeen);
    }
    cleanState.vehiclePlacementMigrated = Boolean(savedGame.vehiclePlacementMigrated);
    if (savedGame.lastSaveTime !== undefined) {
      cleanState.lastSaveTime = savedGame.lastSaveTime;
    }
  }

  cleanState.camperProfileVersion = 0;
  cleanState.activeCamperIndex = 0;
  cleanState.campers = [];

  if (savedGame && Array.isArray(savedGame.campers)) {
    cleanState.campers = savedGame.campers.map(sanitizeCamperProfile).filter(Boolean);
  }

  if (savedGame && Number.isInteger(savedGame.activeCamperIndex)) {
    cleanState.activeCamperIndex = clamp(savedGame.activeCamperIndex, 0, Math.max(0, cleanState.campers.length - 1));
  }

  if (cleanState.campers.length > 0 && hasCamperProfile({
    camperProfileVersion: savedGame && Number(savedGame.camperProfileVersion) || CAMPER_PROFILE_VERSION,
    activeCamperIndex: cleanState.activeCamperIndex,
    campers: cleanState.campers
  })) {
    cleanState.camperProfileVersion = CAMPER_PROFILE_VERSION;
  }

  const ownedGear = getDefaultOwnedGearIds();

  if (savedGame && Array.isArray(savedGame.ownedGear)) {
    savedGame.ownedGear.forEach(function(id) {
      addUniqueGear(ownedGear, id);
    });
  }

  if (savedGame && Array.isArray(savedGame.ownedTentTypes)) {
    savedGame.ownedTentTypes.forEach(function(type) {
      addUniqueGear(ownedGear, type);
    });
  }

  if (savedGame && savedGame.tentType !== undefined) {
    addUniqueGear(ownedGear, savedGame.tentType);
  }

  if (savedGame && savedGame.currentTentType !== undefined) {
    addUniqueGear(ownedGear, savedGame.currentTentType);
  }

  if (savedGame && Array.isArray(savedGame.ownedEquipment)) {
    savedGame.ownedEquipment.forEach(function(type) {
      addUniqueGear(ownedGear, type);
    });
  }

  const oldEquipmentFields = {
    hasChair: "chair",
    hasLantern: "lantern",
    hasTable: "table",
    hasKettle: "kettle",
    hasAxe: "axe",
    hasStove: "stove",
    hasStringLights: "stringLights"
  };

  Object.keys(oldEquipmentFields).forEach(function(fieldName) {
    if (savedGame && savedGame[fieldName]) {
      addUniqueGear(ownedGear, oldEquipmentFields[fieldName]);
    }
  });

  const savedPlacedGear = savedGame && Array.isArray(savedGame.placedGear) ? savedGame.placedGear.map(normalizeGearId) : [];

  cleanState.ownedGear = ownedGear;
  cleanState.placedGear = [];

  if (savedPlacedGear.length > 0) {
    savedPlacedGear.forEach(function(normalizedId) {
      if (ownedGear.indexOf(normalizedId) !== -1) {
        addUniquePlacedGear(cleanState.placedGear, normalizedId);
      }
    });
  } else if (savedGame) {
    ownedGear.forEach(function(id) {
      const item = getGearItem(id);

      if (item && isGearPlaceable(item)) {
        addUniquePlacedGear(cleanState.placedGear, id);
      }
    });
  }

  cleanState.equippedGear = { ...getDefaultEquippedGear() };

  if (savedGame && savedGame.equippedGear) {
    Object.keys(savedGame.equippedGear).forEach(function(category) {
      const normalizedId = normalizeGearId(savedGame.equippedGear[category]);

      if (ownedGear.indexOf(normalizedId) !== -1 && getGearItem(normalizedId)) {
        cleanState.equippedGear[category] = normalizedId;
      }
    });
  }

  const savedTentId = savedGame && (savedGame.currentTentType || savedGame.tentType);

  if (savedTentId) {
    const normalizedTentId = normalizeGearId(savedTentId);

    if (ownedGear.indexOf(normalizedTentId) !== -1 && getGearItem(normalizedTentId)) {
      cleanState.equippedGear.tent = normalizedTentId;
    }
  }

  if (!getGearItem(cleanState.equippedGear.tent) || ownedGear.indexOf(cleanState.equippedGear.tent) === -1) {
    cleanState.equippedGear.tent = defaultGameState.equippedGear.tent;
  }

  if (cleanState.equippedGear.tarp) {
    const equippedTarp = getGearItem(cleanState.equippedGear.tarp);

    if (!equippedTarp || !isTarpItem(equippedTarp) || ownedGear.indexOf(equippedTarp.id) === -1) {
      delete cleanState.equippedGear.tarp;
    }
  }

  if (!cleanState.equippedGear.tarp) {
    const placedTarpId = savedPlacedGear.find(function(id) {
      const item = getGearItem(id);
      return item && isTarpItem(item) && ownedGear.indexOf(id) !== -1;
    });

    if (placedTarpId) {
      cleanState.equippedGear.tarp = placedTarpId;
    }
  }

  if (cleanState.equippedGear.vehicle) {
    const equippedVehicle = getGearItem(cleanState.equippedGear.vehicle);

    if (!equippedVehicle || !isVehicleItem(equippedVehicle) || ownedGear.indexOf(equippedVehicle.id) === -1) {
      delete cleanState.equippedGear.vehicle;
    }
  }

  if (!cleanState.vehiclePlacementMigrated && cleanState.equippedGear.vehicle) {
    addUniquePlacedGear(cleanState.placedGear, cleanState.equippedGear.vehicle);
    cleanState.vehiclePlacementMigrated = true;
  }

  if (cleanState.equippedGear.tent === "rooftopTent") {
    if (!cleanState.equippedGear.vehicle) {
      const ownedVehicle = ownedGear.find(function(id) {
        return isVehicleItem(getGearItem(id));
      });

      if (ownedVehicle) {
        cleanState.equippedGear.vehicle = ownedVehicle;
      }
    }

    if (cleanState.equippedGear.vehicle) {
      addUniquePlacedGear(cleanState.placedGear, cleanState.equippedGear.vehicle);
    }
  }

  cleanState.userDepthOffsetY = {};
  const savedUserDepthOffsetY = savedGame && savedGame.userDepthOffsetY && typeof savedGame.userDepthOffsetY === "object" ? savedGame.userDepthOffsetY : {};
  Object.keys(savedUserDepthOffsetY).forEach(function(id) {
    const normalizedId = normalizeGearId(id);
    const item = getGearItem(normalizedId);
    const offsetY = Number(savedUserDepthOffsetY[id]);

    if (item && item.scene && Number.isFinite(offsetY) && offsetY !== 0) {
      cleanState.userDepthOffsetY[normalizedId] = offsetY;
    }
  });

  cleanState.userGearPositions = {};
  const savedUserGearPositions = savedGame && savedGame.userGearPositions && typeof savedGame.userGearPositions === "object" ? savedGame.userGearPositions : {};
  Object.keys(savedUserGearPositions).forEach(function(id) {
    const normalizedId = normalizeGearId(id);
    const item = getGearItem(normalizedId);
    const savedPosition = savedUserGearPositions[id] || {};
    const x = Number(savedPosition.x);
    const y = Number(savedPosition.y);

    if (item && item.scene && Number.isFinite(x) && Number.isFinite(y)) {
      cleanState.userGearPositions[normalizedId] = {
        x: clamp(x, 0, 100),
        y: clamp(y, 0, 100)
      };
    }
  });

  cleanState.userGearMountOffsets = {};

  cleanState.cozyPoints = Math.max(0, Number(cleanState.cozyPoints) || 0);
  cleanState.warmthSeconds = Math.max(0, Number(cleanState.warmthSeconds) || 0);
  cleanState.campfireLevel = clamp(Number(cleanState.campfireLevel) || 1, 1, 3);
  cleanState.nightUnlocked = Boolean(cleanState.nightUnlocked || hasNightUnlock(cleanState));
  cleanState.isNight = Boolean(cleanState.isNight && cleanState.nightUnlocked);
  cleanState.gatherWoodMode = Boolean(cleanState.gatherWoodMode);
  cleanState.lastSaveTime = Number(cleanState.lastSaveTime) || Date.now();
  cleanState.comfort = calculateComfort(cleanState);

  return cleanState;
}

function loadGame() {
  const savedText = localStorage.getItem(SAVE_KEY);
  loadedExistingSaveWithoutCamperProfile = false;

  if (!savedText) {
    gameState.comfort = calculateComfort();
    if (saveWasResetFromUrl) {
      showWelcome("Save reset. A quiet day begins beside the lake.");
    } else {
      showWelcome("A quiet day begins beside the lake.");
    }
    return;
  }

  try {
    gameState = sanitizeSave(JSON.parse(savedText));
    loadedExistingSaveWithoutCamperProfile = !hasCamperProfile(gameState);
    applyOfflineEarnings();
    saveGame();
  } catch (error) {
    gameState = createDefaultGameState();
    gameState.comfort = calculateComfort();
    loadedExistingSaveWithoutCamperProfile = false;
    showWelcome("The save was reset, so camp starts fresh.");
  }
}

function applyOfflineEarnings() {
  const now = Date.now();
  const secondsAway = Math.max(0, Math.floor((now - gameState.lastSaveTime) / 1000));
  const offlineCap = getOfflineCapSeconds();
  const netBurnRate = getNetWarmthBurnRate();
  const possibleFireSeconds = gameState.warmthSeconds / netBurnRate;
  const activeSeconds = Math.min(secondsAway, offlineCap, possibleFireSeconds);

  if (activeSeconds > 0) {
    const earnedPoints = activeSeconds * getCozyPointsPerSecond();
    gameState.cozyPoints += earnedPoints;
    gameState.warmthSeconds = Math.max(0, gameState.warmthSeconds - activeSeconds * netBurnRate);
    showWelcome("Welcome back: +" + formatNumber(earnedPoints) + " Cozy Points from " + formatShortTime(activeSeconds) + " of firelight.");
  } else if (secondsAway > 60) {
    showWelcome("Welcome back. The campfire is waiting for more branches.");
  }

  gameState.lastSaveTime = now;
}

function updateScreen() {
  gameState.comfort = calculateComfort();

  cozyPointsAmount.textContent = formatNumber(gameState.cozyPoints);
  comfortAmount.textContent = formatNumber(gameState.comfort);
  warmthSecondsAmount.textContent = Math.floor(gameState.warmthSeconds).toLocaleString();
  campfireLevelAmount.textContent = gameState.campfireLevel;
  cozyRateAmount.textContent = formatNumber(getCozyPointsPerSecond());
  offlineCapAmount.textContent = formatShortTime(getOfflineCapSeconds());

  document.body.classList.toggle("night", gameState.isNight);
  document.body.classList.toggle("day", !gameState.isNight);

  gatherWoodToggle.classList.toggle("active", gameState.gatherWoodMode);
  gatherModeLabel.textContent = gameState.gatherWoodMode ? "On" : "Off";

  dayNightToggle.classList.toggle("hidden", !gameState.nightUnlocked);
  dayNightLabel.textContent = gameState.isNight ? "Day" : "Night";
  updateCamperProfileControls();
  updateBuildModeControls();

  updateShopCards();
  updateSceneEquipment();
  updateOnboardingView();
  maybeStartBuildModeGuide();
}

function getShopGroupsInOrder() {
  return Object.keys(shopGroupData).filter(function(groupId) {
    const group = shopGroupData[groupId];
    return group && group.visible !== false;
  });
}

function getShopItemsForGroup(groupId) {
  const group = shopGroupData[groupId];
  const categoryOrder = group && Array.isArray(group.categories) ? group.categories : [];

  return getGearItems()
    .filter(function(item) {
      return isGearVisibleInShop(item) && item.shopGroup === groupId;
    })
    .sort(function(a, b) {
      const categoryA = categoryOrder.indexOf(a.category);
      const categoryB = categoryOrder.indexOf(b.category);

      const orderA = categoryA === -1 ? 999 : categoryA;
      const orderB = categoryB === -1 ? 999 : categoryB;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return (Number(a.cost) || 0) - (Number(b.cost) || 0);
    });
}

function createShopIcon(src) {
  const image = document.createElement("img");
  image.src = withVersion(src);
  image.alt = "";
  return image;
}

function createShopTab(groupId, group) {
  const button = document.createElement("button");
  button.className = "shop-tab";
  button.type = "button";
  button.setAttribute("data-shop-filter", groupId);
  button.appendChild(createShopIcon(group.icon || "assets/ui/icon_tools.png"));

  const label = document.createElement("span");
  label.textContent = group.label;
  button.appendChild(label);

  button.addEventListener("click", function() {
    setShopFilter(groupId);
  });

  return button;
}

function createGearShopCard(item) {
  const button = document.createElement("button");
  button.className = item.interactions && item.interactions.upgradeCampfire ? "shop-card featured" : "shop-card";
  button.type = "button";
  button.setAttribute("data-gear-id", item.id);

  const image = document.createElement("img");
  image.className = "item-art";
  image.src = withVersion(item.image);
  image.alt = "";
  button.appendChild(image);

  const copy = document.createElement("span");
  copy.className = "item-copy";

  const name = document.createElement("span");
  name.className = "item-name";
  name.textContent = item.displayName;
  copy.appendChild(name);

  const detail = document.createElement("span");
  detail.className = "item-detail";
  detail.textContent = item.detail;
  copy.appendChild(detail);

  button.appendChild(copy);

  const action = document.createElement("strong");
  action.className = "item-action";
  action.textContent = "Buy";
  button.appendChild(action);

  button.addEventListener("click", function() {
    handleGearAction(item.id);
  });

  shopCards[item.id] = {
    button: button,
    actionLabel: action,
    detailLabel: detail,
    image: image
  };

  return button;
}

function createShopSection(groupId, group) {
  const section = document.createElement("section");
  section.className = "shop-section";
  section.setAttribute("data-shop-group", groupId);
  section.setAttribute("aria-label", group.label + " shop");

  const heading = document.createElement("h2");
  heading.appendChild(createShopIcon(group.icon || "assets/ui/icon_tools.png"));
  heading.appendChild(document.createTextNode(" " + group.label));
  section.appendChild(heading);

  getShopItemsForGroup(groupId).forEach(function(item) {
    section.appendChild(createGearShopCard(item));
  });

  return section;
}

function renderShopFromCatalog() {
  shopCards = {};
  shopTabsContainer.innerHTML = "";
  shopContent.innerHTML = "";

  const allTab = createShopTab("all", {
    label: "All",
    icon: "assets/ui/icon_tools.png"
  });
  allTab.classList.add("active");
  shopTabsContainer.appendChild(allTab);

  getShopGroupsInOrder().forEach(function(groupId) {
    const group = shopGroupData[groupId];
    shopTabsContainer.appendChild(createShopTab(groupId, group));
    shopContent.appendChild(createShopSection(groupId, group));
  });

  shopTabs = Array.prototype.slice.call(shopTabsContainer.querySelectorAll(".shop-tab"));
  shopSections = Array.prototype.slice.call(shopContent.querySelectorAll(".shop-section"));
}

function updateCampfireShopCard(item, card) {
  card.image.src = getCampfireShopImage();

  if (gameState.campfireLevel >= 3) {
    card.button.disabled = true;
    card.button.classList.add("owned", "action-equipped");
    card.button.classList.remove("locked", "equipped", "placed", "action-buy", "action-place", "action-pack", "action-equip", "action-locked");
    card.detailLabel.textContent = "Lv 3 complete";
    card.actionLabel.textContent = "MAX";
    card.button.setAttribute("data-price", "MAX");
    return;
  }

  const cost = getCampfireUpgradeCost();
  card.button.disabled = gameState.cozyPoints < cost;
  card.button.classList.add("action-buy");
  card.button.classList.remove("owned", "locked", "equipped", "placed", "action-place", "action-pack", "action-equip", "action-equipped", "action-locked");
  card.detailLabel.textContent = gameState.campfireLevel === 1 ? "Lv 2 fire pit" : "Lv 3 ember stove";
  card.actionLabel.textContent = "UPGRADE";
  card.button.setAttribute("data-price", cost + "CP");
}

function updateVehicleShopCard(item, card, isOwned, isEquipped, isPlaced, isLocked) {
  const rooftopMounted = isCurrentRooftopTentEquipped() && isEquipped && isPlaced;

  if (isEquipped && isPlaced) {
    if (rooftopMounted) {
      card.button.disabled = true;
      card.button.classList.add("action-equipped");
      card.actionLabel.textContent = "MOUNTED";
      card.button.setAttribute("data-price", "ROOF");
      card.detailLabel.textContent = "Rooftop tent mounted";
      return true;
    }

    card.button.disabled = false;
    card.button.classList.add("action-pack");
    card.actionLabel.textContent = "STOW";
    card.button.setAttribute("data-price", "PLACED");
    return true;
  }

  if (isEquipped && isOwned) {
    card.button.disabled = false;
    card.button.classList.add("action-place");
    card.actionLabel.textContent = "PLACE";
    card.button.setAttribute("data-price", "OWNED");
    return true;
  }

  if (isOwned) {
    card.button.disabled = false;
    card.button.classList.add("action-equip");
    card.actionLabel.textContent = "EQUIP";
    card.button.setAttribute("data-price", "0CP");
    return true;
  }

  if (isLocked) {
    card.button.disabled = true;
    card.button.classList.add("action-locked");
    card.actionLabel.textContent = "LOCKED";
    card.button.setAttribute("data-price", "?CP");
    return true;
  }

  card.button.disabled = gameState.cozyPoints < item.cost;
  card.button.classList.add("action-buy");
  card.actionLabel.textContent = "BUY";
  card.button.setAttribute("data-price", item.cost + "CP");
  return true;
}

function updateGearShopCard(item) {
  const card = shopCards[item.id];

  if (!card) {
    return;
  }

  card.image.src = withVersion(item.image);

  if (item.interactions && item.interactions.upgradeCampfire) {
    updateCampfireShopCard(item, card);
    return;
  }

  const isOwned = ownsGear(item.id);
  const isEquipped = isEquippableGear(item) && getEquippedGearId(item.category) === item.id;
  const isPlaceable = isGearPlaceable(item);
  const isPlaced = isPlaceable && isGearPlaced(item.id);
  const isTarpInScene = isTarpItem(item) && isEquipped;
  const missingRequirements = getMissingGearRequirements(item);
  const isLocked = missingRequirements.length > 0;

  // Tarps use the equip slot internally, but should carry the same visual
  // classes as placeable gear (placed, not equipped) so the PACK/PLACE button
  // colours match the rest of the shop.
  card.button.classList.toggle("owned", isOwned);
  card.button.classList.toggle("equipped", isEquipped && !isTarpItem(item));
  card.button.classList.toggle("placed", isPlaced || isTarpInScene);
  card.button.classList.toggle("locked", isLocked && !isOwned);
  card.button.classList.remove("action-buy", "action-place", "action-pack", "action-equip", "action-equipped", "action-locked");
  card.detailLabel.textContent = isLocked && !isOwned ? missingRequirements.join(", ") : item.detail;

  if (isVehicleItem(item) && updateVehicleShopCard(item, card, isOwned, isEquipped, isPlaced, isLocked)) {
    return;
  }

  if (isTarpItem(item) && isOwned) {
    // Tarps reuse the same PLACE / PACK button styling as other placeable gear.
    card.button.disabled = false;

    if (isEquipped) {
      card.button.classList.add("action-pack");
      card.actionLabel.textContent = "PACK";
      card.button.setAttribute("data-price", "PLACED");
    } else {
      card.button.classList.add("action-place");
      card.actionLabel.textContent = "PLACE";
      card.button.setAttribute("data-price", "OWNED");
    }
  } else if (isEquipped) {
    card.button.disabled = true;
    card.button.classList.add("action-equipped");
    card.actionLabel.textContent = "EQUIPPED";
    card.button.setAttribute("data-price", "0CP");
  } else if (isOwned && isEquippableGear(item)) {
    card.button.disabled = false;
    card.button.classList.add("action-equip");
    card.actionLabel.textContent = "EQUIP";
    card.button.setAttribute("data-price", "0CP");
  } else if (isOwned && isPlaceable && isPlaced) {
    card.button.disabled = false;
    card.button.classList.add("action-pack");
    card.actionLabel.textContent = "PACK";
    card.button.setAttribute("data-price", "PLACED");
  } else if (isOwned && isPlaceable) {
    card.button.disabled = false;
    card.button.classList.add("action-place");
    card.actionLabel.textContent = "PLACE";
    card.button.setAttribute("data-price", "OWNED");
  } else if (isOwned) {
    card.button.disabled = true;
    card.button.classList.add("action-equipped");
    card.actionLabel.textContent = "OWNED";
    card.button.setAttribute("data-price", "0CP");
  } else if (isLocked) {
    card.button.disabled = true;
    card.button.classList.add("action-locked");
    card.actionLabel.textContent = "LOCKED";
    card.button.setAttribute("data-price", "?CP");
  } else {
    card.button.disabled = gameState.cozyPoints < item.cost;
    card.button.classList.add("action-buy");
    card.actionLabel.textContent = "BUY";
    card.button.setAttribute("data-price", item.cost + "CP");
  }
}

function updateShopCards() {
  getGearItems().forEach(updateGearShopCard);
}

function setVersionedLayerSource(image, path) {
  if (image && path) {
    const nextSrc = withVersion(path);

    setDatasetValue(image, "assetPath", path);

    if (image.getAttribute("src") !== nextSrc) {
      setDatasetValue(image, "imageLoadError", "");
      image.src = nextSrc;
    }

    image.onerror = function() {
      image.dataset.imageLoadError = "true";
    };
  }
}

function reapplyGearSceneLayoutWhenImageReady(element, item, zIndex, depthOffset) {
  const sourceImage = getSceneAssetSourceImage(element);

  if (!sourceImage) {
    return;
  }

  const reapplyLayout = function() {
    applyGearSceneLayout(element, item, zIndex, depthOffset);
    updateTargetOutlineForElement(element);
    updateActionQueueIndicators();
    updateSceneOcclusion();
    syncSceneDepthControls();
  };

  if (sourceImage.naturalWidth && sourceImage.naturalHeight) {
    reapplyLayout();
    return;
  }

  sourceImage.addEventListener("load", reapplyLayout, { once: true });
  sourceImage.addEventListener("error", reapplyLayout, { once: true });
}

function ensureLayerImage(element, className) {
  let image = element.querySelector("." + className);

  if (!image) {
    image = document.createElement("img");
    image.className = "object-image gear-layer " + className;
    image.alt = "";
    element.appendChild(image);
  }

  return image;
}

function getGearSceneElementId(item) {
  return "gear-" + item.id;
}

function getGearFrontElementId(item) {
  return "gear-" + item.id + "-front";
}

function getGearSceneElement(item) {
  if (!item || !item.scene) {
    return null;
  }

  if (item.scene.renderMode === "campfire") {
    return campfire;
  }

  return document.getElementById(getGearSceneElementId(item));
}

function getOrCreateGearSceneElement(item) {
  let element = getGearSceneElement(item);

  if (!element && item.scene && gearLayer) {
    element = document.createElement("div");
    element.id = getGearSceneElementId(item);
    element.className = "gear-object asset-object hidden";
    element.setAttribute("aria-label", item.displayName);
    gearLayer.appendChild(element);
  }

  configureGearActionTarget(element, item);
  configureGearDepthAdjustTarget(element, item);
  configureGearBuildDragTarget(element, item);

  return element;
}

function configureGearActionTarget(element, item) {
  if (!element || !item) {
    return;
  }

  element.setAttribute("data-action-target-id", item.id);

  if (!isGearQueueInteractive(item)) {
    if (selectedActionTargetElement === element) {
      clearSelectedActionTarget();
    }

    element.onclick = null;
    element.onpointerdown = null;
    element.ontouchstart = null;
    element.onkeydown = null;
    element.removeAttribute("role");
    element.removeAttribute("tabindex");
    return;
  }

  element.setAttribute("role", "button");
  element.tabIndex = 0;
  element.onpointerdown = function(event) {
    rememberActionPointerType(event, element);
  };
  element.ontouchstart = function() {
    element.dataset.lastPointerType = "touch";
  };
  element.onclick = function(event) {
    handleGearActionClick(event, element, item);
  };
  element.onkeydown = function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isBuildModeActive()) {
        return;
      }
      clearSelectedActionTarget();
      queueGearAction(item);
    }
  };
}

function getOrCreateGearFrontElement(item) {
  const frontElementId = getGearFrontElementId(item);
  let frontElement = document.getElementById(frontElementId);

  if (!frontElement && gearLayer) {
    frontElement = document.createElement("div");
    frontElement.id = frontElementId;
    frontElement.className = "gear-front-layer asset-object hidden";
    frontElement.setAttribute("aria-hidden", "true");
    gearLayer.appendChild(frontElement);
  }

  return frontElement;
}

function getNaturalSceneAssetLogicalSize(image) {
  if (!image || !image.naturalWidth || !image.naturalHeight) {
    return null;
  }

  return {
    width: image.naturalWidth / SCENE_ASSET_SCALE,
    height: image.naturalHeight / SCENE_ASSET_SCALE,
    source: "natural"
  };
}

function getSceneAssetSourceImage(element) {
  if (!element) {
    return null;
  }

  return element.querySelector(".gear-layer-base") || Array.from(element.querySelectorAll(".object-image")).find(isOutlineSourceImage);
}

function getSceneAssetPathForLog(item, image) {
  return image && image.dataset && image.dataset.assetPath || item && item.image || "missing image path";
}

function reportSceneAssetSizeState(element, item, status, image) {
  const path = getSceneAssetPathForLog(item, image);
  const id = item && item.id ? item.id : element && element.id || "unknown";
  const key = status + ":" + id + ":" + path;

  if (element && element.dataset.sceneSizeLogKey === key) {
    return;
  }

  if (element) {
    element.dataset.sceneSizeLogKey = key;
  }

  const message = "[scene asset] " + status + " for gear " + id + ": " + path;

  if (status === "loading") {
    console.warn(message);
  } else {
    console.error(message);
  }
}

function getScenePlaceholderLogicalSize(source) {
  return {
    width: DEV_SCENE_PLACEHOLDER_SIZE,
    height: DEV_SCENE_PLACEHOLDER_SIZE,
    source: source
  };
}

function getElementSceneLogicalSize(element) {
  if (!element) {
    return null;
  }

  const width = element.offsetWidth || parseFloat(window.getComputedStyle(element).width);
  const height = element.offsetHeight || parseFloat(window.getComputedStyle(element).height);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return {
    width: width,
    height: height,
    source: "dom"
  };
}

function getSceneAssetLogicalSize(item, element, sourceImage) {
  if (item && item.scene && item.scene.renderMode === "campfire") {
    const elementSize = getElementSceneLogicalSize(element);

    if (elementSize) {
      return elementSize;
    }
  }

  const image = sourceImage || getSceneAssetSourceImage(element);
  const naturalSize = getNaturalSceneAssetLogicalSize(image);

  if (naturalSize) {
    if (element) {
      element.dataset.sceneSizeLogKey = "";
    }

    return naturalSize;
  }

  if (!image) {
    reportSceneAssetSizeState(element, item, "missing-image", image);
    return getScenePlaceholderLogicalSize("missing-image");
  }

  if (image.dataset && image.dataset.imageLoadError === "true") {
    reportSceneAssetSizeState(element, item, "error", image);
    return getScenePlaceholderLogicalSize("error");
  }

  if (!image.complete) {
    reportSceneAssetSizeState(element, item, "loading", image);
    return getScenePlaceholderLogicalSize("loading");
  }

  reportSceneAssetSizeState(element, item, "error", image);
  return getScenePlaceholderLogicalSize("error");
}

function getScenePixelPosition(scene, layoutOverride) {
  const override = layoutOverride || {};

  if (typeof override.sceneX === "number" && typeof override.sceneY === "number") {
    return { x: override.sceneX, y: override.sceneY };
  }

  if (override.position) {
    return percentPointToScenePoint(override.position);
  }

  if (scene && typeof scene.sceneX === "number" && typeof scene.sceneY === "number") {
    return { x: scene.sceneX, y: scene.sceneY };
  }

  if (scene && scene.position) {
    return percentPointToScenePoint(scene.position);
  }

  return { x: 0, y: 0 };
}

function getScenePercentPosition(scene, layoutOverride) {
  const override = layoutOverride || {};

  if (override.position) {
    return override.position;
  }

  if (typeof override.sceneX === "number" && typeof override.sceneY === "number") {
    return scenePointToPercent({ x: override.sceneX, y: override.sceneY });
  }

  if (scene && scene.position) {
    return scene.position;
  }

  if (scene && typeof scene.sceneX === "number" && typeof scene.sceneY === "number") {
    return scenePointToPercent({ x: scene.sceneX, y: scene.sceneY });
  }

  return { x: 0, y: 0 };
}

function getSceneAssetLogicalPoint(item, point, logicalSize) {
  if (!point) {
    return { x: 0, y: 0 };
  }

  if (typeof point.ratioX === "number" && typeof point.ratioY === "number") {
    return {
      x: point.ratioX * logicalSize.width,
      y: point.ratioY * logicalSize.height
    };
  }

  console.error("[scene asset] missing normalized point ratio for gear " + (item && item.id ? item.id : "unknown"));

  return {
    x: logicalSize.width / 2,
    y: logicalSize.height
  };
}

function getSceneGroundAnchor(item, logicalSize) {
  const assetSize = logicalSize || getScenePlaceholderLogicalSize("missing-image");
  const anchors = item && item.anchors ? item.anchors : {};
  const scene = item && item.scene ? item.scene : {};
  const anchor = scene.anchor || anchors.ground;

  if (anchor) {
    return getSceneAssetLogicalPoint(item, anchor, assetSize);
  }

  return { x: assetSize.width / 2, y: assetSize.height };
}

function getSceneDepthY(item, layoutOverride) {
  return getScenePixelPosition(item && item.scene ? item.scene : {}, layoutOverride).y;
}

function getScenePlacementLayer(item, layoutOverride) {
  const scene = item && item.scene ? item.scene : {};

  return layoutOverride && layoutOverride.placementLayer || scene.placementLayer || "ground";
}

function getAutoDepthOffsetY(item, layoutOverride) {
  const scene = item && item.scene ? item.scene : {};
  const placementLayer = getScenePlacementLayer(item, layoutOverride);

  if (layoutOverride && typeof layoutOverride.depthOffsetY === "number") {
    return layoutOverride.depthOffsetY;
  }

  if (typeof scene.depthOffsetY === "number") {
    return scene.depthOffsetY;
  }

  if (scene.mountTo || placementLayer === "mounted") {
    return DEFAULT_MOUNTED_DEPTH_OFFSET_Y;
  }

  if (placementLayer === "surface") {
    return DEFAULT_SURFACE_DEPTH_OFFSET_Y;
  }

  if (placementLayer === "stacked") {
    return DEFAULT_STACKED_DEPTH_OFFSET_Y;
  }

  return 0;
}

function getUserDepthOffsetY(item) {
  const offsets = gameState && gameState.userDepthOffsetY ? gameState.userDepthOffsetY : {};

  if (!item || !item.id || typeof offsets[item.id] !== "number" || !Number.isFinite(offsets[item.id])) {
    return 0;
  }

  return offsets[item.id];
}

function getUserGearPositionMap() {
  if (!gameState.userGearPositions || typeof gameState.userGearPositions !== "object") {
    gameState.userGearPositions = {};
  }

  return gameState.userGearPositions;
}

function getUserGearMountOffsetMap() {
  if (!gameState.userGearMountOffsets || typeof gameState.userGearMountOffsets !== "object") {
    gameState.userGearMountOffsets = {};
  }

  return gameState.userGearMountOffsets;
}

function getUserGearPosition(item) {
  const positions = gameState && gameState.userGearPositions ? gameState.userGearPositions : {};
  const position = item && item.id ? positions[item.id] : null;

  if (!position || typeof position.x !== "number" || typeof position.y !== "number") {
    return null;
  }

  return {
    x: clamp(position.x, 0, 100),
    y: clamp(position.y, 0, 100)
  };
}

function isMountedGearItem(item) {
  return Boolean(item && item.scene && item.scene.mountTo);
}

function isMountedGearDetached(item) {
  return Boolean(isMountedGearItem(item) && getUserGearPosition(item));
}

function setUserGearPosition(item, position, shouldSave) {
  if (!item || !item.scene || !position) {
    return;
  }

  const positions = getUserGearPositionMap();

  positions[item.id] = {
    x: clamp(position.x, 0, 100),
    y: clamp(position.y, 0, 100)
  };

  refreshGearSceneLayout(item);

  if (shouldSave) {
    saveGame();
  }
}

function clearUserGearPosition(item, shouldSave) {
  if (!item || !item.id) {
    return;
  }

  delete getUserGearPositionMap()[item.id];
  refreshGearSceneLayout(item);

  if (shouldSave) {
    saveGame();
  }
}

function clearLegacyGearMountOffset(item) {
  if (!item || !item.id) {
    return;
  }

  delete getUserGearMountOffsetMap()[item.id];
}

function getDisplayedGearLayoutOverride(item) {
  return getSceneLayoutOverride(item);
}

function getDisplayedGearScenePosition(item) {
  if (!item || !item.scene) {
    return null;
  }

  return getScenePixelPosition(item.scene || {}, getDisplayedGearLayoutOverride(item));
}

function getCurrentGearScenePosition(item) {
  return getDisplayedGearScenePosition(item);
}

function detachMountedGearItem(item) {
  if (!isMountedGearItem(item) || isMountedGearDetached(item)) {
    return;
  }

  const currentPosition = getCurrentGearScenePosition(item);

  if (!currentPosition) {
    return;
  }

  clearLegacyGearMountOffset(item);
  setUserGearPosition(item, scenePointToPercent(currentPosition), false);
  refreshMountedGearSceneLayouts();
  saveGame();
  setStatus(item.displayName + " detached from its mount point.");
}

function attachMountedGearItem(item) {
  if (!isMountedGearItem(item)) {
    return;
  }

  clearLegacyGearMountOffset(item);
  clearUserGearPosition(item, false);
  refreshMountedGearSceneLayouts();
  saveGame();
  setStatus(item.displayName + " attached to its mount point.");
}

function getSceneDepthOffsetY(item, layoutOverride, layerOffset) {
  return getAutoDepthOffsetY(item, layoutOverride) + getUserDepthOffsetY(item) + (layerOffset || 0);
}

function getSceneDisplayDepthY(item, layoutOverride, layerOffset) {
  return getSceneDepthY(item, layoutOverride) + getSceneDepthOffsetY(item, layoutOverride, layerOffset);
}

function getDepthZ(depthY, offset) {
  const safeDepthY = Number.isFinite(depthY) ? depthY : 0;
  return SCENE_DEPTH_Z_BASE + Math.round(safeDepthY) + (offset || 0);
}

function setSceneElementDepth(element, depthY, offset) {
  if (!element) {
    return;
  }

  const safeDepthY = Number.isFinite(depthY) ? depthY : 0;
  const depthOffset = Number.isFinite(offset) ? offset : 0;
  const displayDepthY = safeDepthY + depthOffset;

  setStyleValue(element, "zIndex", getDepthZ(displayDepthY, 0));
  setDatasetValue(element, "sceneDepthY", depthY);
  setDatasetValue(element, "sceneDisplayDepthY", displayDepthY);
  setDatasetValue(element, "sceneDepthOffsetY", depthOffset);
}

function getSceneMirrored(item, layoutOverride) {
  const scene = item && item.scene ? item.scene : {};
  return Boolean(layoutOverride && typeof layoutOverride.mirrored === "boolean" ? layoutOverride.mirrored : scene.mirrored);
}

function getCollisionConfig(item) {
  return item && item.scene && item.scene.collision ? item.scene.collision : {};
}

function isValidCollisionFootprint(footprint) {
  return Boolean(
    footprint &&
    typeof footprint.ratioX === "number" &&
    typeof footprint.ratioY === "number" &&
    typeof footprint.ratioWidth === "number" &&
    typeof footprint.ratioHeight === "number" &&
    footprint.ratioWidth > 0 &&
    footprint.ratioHeight > 0
  );
}

function getCollisionFootprint(item) {
  if (!item || !item.scene) {
    return null;
  }

  const collision = getCollisionConfig(item);

  if (collision.enabled === false) {
    return null;
  }

  if (item.scene.mountTo && collision.enabled !== true) {
    return null;
  }

  const footprint = collision.footprint || DEFAULT_COLLISION_FOOTPRINTS[item.category] || {
    ratioX: 0.25,
    ratioY: 0.74,
    ratioWidth: 0.5,
    ratioHeight: 0.2
  };

  return isValidCollisionFootprint(footprint) ? footprint : null;
}

function getMirroredCollisionFootprint(footprint) {
  return {
    ratioX: 1 - footprint.ratioX - footprint.ratioWidth,
    ratioY: footprint.ratioY,
    ratioWidth: footprint.ratioWidth,
    ratioHeight: footprint.ratioHeight
  };
}

function getSceneCollisionRect(item, layoutOverride) {
  const footprint = getCollisionFootprint(item);

  if (!footprint) {
    return null;
  }

  const element = getGearSceneElement(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(item.scene || {}, layoutOverride);
  const activeFootprint = getSceneMirrored(item, layoutOverride) ? getMirroredCollisionFootprint(footprint) : footprint;
  const assetLeft = position.x - groundAnchor.x;
  const assetTop = position.y - groundAnchor.y;

  return {
    id: item.id,
    x: assetLeft + activeFootprint.ratioX * logicalSize.width,
    y: assetTop + activeFootprint.ratioY * logicalSize.height,
    width: activeFootprint.ratioWidth * logicalSize.width,
    height: activeFootprint.ratioHeight * logicalSize.height,
    depthY: position.y
  };
}

function getOcclusionConfig(item) {
  return item && item.scene && item.scene.occlusion ? item.scene.occlusion : {};
}

function getOcclusionFootprint(item) {
  if (!item || !item.scene) {
    return null;
  }

  const occlusion = getOcclusionConfig(item);

  if (occlusion.enabled === false) {
    return null;
  }

  const footprint = occlusion.rect || occlusion.footprint || DEFAULT_OCCLUSION_RECTS[item.category] || getCollisionFootprint(item);
  return isValidCollisionFootprint(footprint) ? footprint : null;
}

function getSceneAssetRatioRect(item, footprint, layoutOverride) {
  if (!item || !item.scene || !footprint) {
    return null;
  }

  const element = getGearSceneElement(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(item.scene || {}, layoutOverride);
  const activeFootprint = getSceneMirrored(item, layoutOverride) ? getMirroredCollisionFootprint(footprint) : footprint;
  const assetLeft = position.x - groundAnchor.x;
  const assetTop = position.y - groundAnchor.y;

  return {
    id: item.id,
    x: assetLeft + activeFootprint.ratioX * logicalSize.width,
    y: assetTop + activeFootprint.ratioY * logicalSize.height,
    width: activeFootprint.ratioWidth * logicalSize.width,
    height: activeFootprint.ratioHeight * logicalSize.height,
    depthY: position.y
  };
}

function getSceneOcclusionRect(item, layoutOverride) {
  const rect = getSceneAssetRatioRect(item, getOcclusionFootprint(item), layoutOverride);

  if (rect) {
    rect.depthY = getSceneDisplayDepthY(item, layoutOverride);
  }

  return rect;
}

function sceneRectToViewportRect(sceneRect) {
  if (!sceneRect || !sceneContent) {
    return null;
  }

  const contentRect = sceneContent.getBoundingClientRect();
  const scaleX = contentRect.width / BASE_SCENE_WIDTH;
  const scaleY = contentRect.height / BASE_SCENE_HEIGHT;

  return {
    left: contentRect.left + sceneRect.x * scaleX,
    top: contentRect.top + sceneRect.y * scaleY,
    right: contentRect.left + (sceneRect.x + sceneRect.width) * scaleX,
    bottom: contentRect.top + (sceneRect.y + sceneRect.height) * scaleY
  };
}

function getViewportRatioRect(baseRect, ratioRect) {
  return {
    left: baseRect.left + baseRect.width * ratioRect.ratioX,
    top: baseRect.top + baseRect.height * ratioRect.ratioY,
    right: baseRect.left + baseRect.width * (ratioRect.ratioX + ratioRect.ratioWidth),
    bottom: baseRect.top + baseRect.height * (ratioRect.ratioY + ratioRect.ratioHeight)
  };
}

function getRectArea(rect) {
  return Math.max(0, rect.right - rect.left) * Math.max(0, rect.bottom - rect.top);
}

function getRectOverlapArea(firstRect, secondRect) {
  if (!rectsOverlap(firstRect, secondRect)) {
    return 0;
  }

  return Math.max(0, Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.left, secondRect.left)) *
    Math.max(0, Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.top, secondRect.top));
}

function getOverlapRatioAgainstCamper(overlapRect, camperBodyRect) {
  const camperArea = getRectArea(camperBodyRect);
  return camperArea > 0 ? getRectOverlapArea(overlapRect, camperBodyRect) / camperArea : 0;
}

function inflateRect(rect, amount) {
  return {
    id: rect.id,
    x: rect.x - amount,
    y: rect.y - amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
    depthY: rect.depthY
  };
}

function pointInRect(point, rect) {
  return Boolean(
    point &&
    rect &&
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function getCurrentVehicleItem(state) {
  return getEquippedGearItem("vehicle", state || gameState);
}

function isVehiclePlaced(item, state) {
  return Boolean(item && isVehicleItem(item) && getEquippedGearId("vehicle", state || gameState) === item.id && isGearPlaced(item.id, state));
}

function getScenePointFromAssetPoint(item, point, layoutOverride) {
  const scene = item.scene || {};
  const logicalSize = getSceneAssetLogicalSize(item, getGearSceneElement(item));
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const assetPoint = getSceneAssetLogicalPoint(item, point, logicalSize);
  const position = getScenePixelPosition(scene, layoutOverride);

  return {
    x: position.x + assetPoint.x - groundAnchor.x,
    y: position.y + assetPoint.y - groundAnchor.y
  };
}

function getVehicleRoofMount(vehicleItem) {
  const scene = vehicleItem && vehicleItem.scene ? vehicleItem.scene : {};

  return scene.roofMount || {
    ratioX: 0.5,
    ratioY: 0.34,
    zIndex: (scene.zIndex || 14) + 2
  };
}

function getRooftopTentLayout(item) {
  if (!isRooftopTentItem(item)) {
    return null;
  }

  const vehicleItem = getCurrentVehicleItem();

  if (!isVehiclePlaced(vehicleItem)) {
    return null;
  }

  const mount = getVehicleRoofMount(vehicleItem);
  const vehicleLayoutOverride = getSceneLayoutOverride(vehicleItem);
  const scenePoint = getScenePointFromAssetPoint(vehicleItem, mount, vehicleLayoutOverride);

  return {
    sceneX: scenePoint.x,
    sceneY: scenePoint.y,
    position: scenePointToPercent(scenePoint),
    zIndex: mount.zIndex || item.scene.zIndex || 16,
    placementLayer: "mounted"
  };
}
function getVehicleMountLayout(item, mountKey) {
  const vehicleItem = getCurrentVehicleItem();

  if (!isVehiclePlaced(vehicleItem)) {
    return null;
  }

  const vehicleScene = vehicleItem.scene || {};
  const mount = vehicleScene[mountKey];

  if (!mount) {
    return null;
  }

  const vehicleLayoutOverride = getSceneLayoutOverride(vehicleItem);
  const scenePoint = getScenePointFromAssetPoint(vehicleItem, mount, vehicleLayoutOverride);

  return {
    sceneX: scenePoint.x,
    sceneY: scenePoint.y,
    position: scenePointToPercent(scenePoint),
    zIndex: mount.zIndex || item.scene.zIndex || 20,
    placementLayer: "mounted",
    mirrored: typeof mount.mirrored === "boolean" ? mount.mirrored : item.scene.mirrored
  };
}
function getSceneLayoutOverride(item) {
  const userPosition = getUserGearPosition(item);

  if (item && item.scene && item.scene.mountTo && userPosition) {
    return {
      position: userPosition,
      placementLayer: "detached"
    };
  }

  if (item && item.scene && item.scene.mountTo === "vehicleRoof") {
    return getRooftopTentLayout(item);
  }

  if (item && item.scene && item.scene.mountTo === "vehicleAwning") {
    return getVehicleMountLayout(item, "awningMount");
  }

  if (userPosition) {
    return {
      position: userPosition
    };
  }

  return null;
}

function applyGearSceneLayout(element, item, zIndex, depthOffset) {
  const scene = item.scene || {};
  const layoutOverride = getSceneLayoutOverride(item);
  const logicalSize = getSceneAssetLogicalSize(item, element);
  const groundAnchor = getSceneGroundAnchor(item, logicalSize);
  const position = getScenePixelPosition(scene, layoutOverride);
  const mirrored = layoutOverride && typeof layoutOverride.mirrored === "boolean" ? layoutOverride.mirrored : scene.mirrored;
  const depthY = getSceneDepthY(item, layoutOverride);
  const sceneDepthOffsetY = getSceneDepthOffsetY(item, layoutOverride, depthOffset);

  setStyleValue(element, "left", position.x + "px");
  setStyleValue(element, "top", position.y + "px");
  setStyleValue(element, "width", logicalSize.width + "px");
  setStyleValue(element, "height", logicalSize.height + "px");
  setStyleValue(element, "aspectRatio", logicalSize.width + " / " + logicalSize.height);
  setSceneElementDepth(element, depthY, sceneDepthOffsetY);
  setStyleProperty(element, "--object-anchor-x", -groundAnchor.x / logicalSize.width * 100 + "%");
  setStyleProperty(element, "--object-anchor-y", -groundAnchor.y / logicalSize.height * 100 + "%");
  setStyleProperty(element, "--object-scale-x", mirrored ? "-1" : "1");
  element.classList.toggle("gear-mirrored", Boolean(mirrored));
  setDatasetValue(element, "sceneSizeSource", logicalSize.source);
  setDatasetValue(element, "scenePlacementLayer", getScenePlacementLayer(item, layoutOverride));
}

function updateGearSceneElement(item) {
  if (!item.scene || item.scene.renderMode === "campfire") {
    return;
  }

  const element = getOrCreateGearSceneElement(item);
  const scene = item.scene || {};
  const layers = scene.layers || { base: item.image };

  if (!element) {
    return;
  }

  setElementClassName(
    element,
    "gear-object asset-object category-" + item.category + (element.classList.contains("hidden") ? " hidden" : "")
  );
  configureGearDepthAdjustTarget(element, item);
  configureGearBuildDragTarget(element, item);

  Object.keys(layers).forEach(function(layerName) {
    if (layerName === "front" || !layers[layerName]) {
      return;
    }

    const layerClassName = "gear-layer-" + layerName;
    const image = ensureLayerImage(element, layerClassName);
    image.classList.toggle("tent-glow", layerName === "glow");
    image.classList.toggle("lantern-glow", layerName === "glow" && item.category === "light");
    image.classList.toggle("string-lights-glow", layerName === "glow" && item.id === "warmStringLights");
    setVersionedLayerSource(image, layers[layerName]);
  });

  if (!layers.base && item.image) {
    setVersionedLayerSource(ensureLayerImage(element, "gear-layer-base"), item.image);
  }

  applyGearSceneLayout(element, item, scene.zIndex || 20);
  reapplyGearSceneLayoutWhenImageReady(element, item, scene.zIndex || 20);

  const frontElement = layers.front ? getOrCreateGearFrontElement(item) : document.getElementById(getGearFrontElementId(item));

  if (frontElement) {
    if (layers.front) {
      setVersionedLayerSource(ensureLayerImage(frontElement, "gear-layer-front"), layers.front);
      applyGearSceneLayout(frontElement, item, scene.frontZIndex || 31, SCENE_FRONT_LAYER_OFFSET);
      reapplyGearSceneLayoutWhenImageReady(frontElement, item, scene.frontZIndex || 31, SCENE_FRONT_LAYER_OFFSET);
    }
  }
}

function updateCampfireDepth() {
  const campfireItem = getGearItem("campfire");
  const depthY = campfireItem && campfireItem.scene ? getSceneDepthY(campfireItem) : sceneYFromPercent(campSpots.fire.y);
  setSceneElementDepth(campfire, depthY, 0);
}

function getSceneOccluderElements() {
  const occluders = Array.from(document.querySelectorAll(".gear-object, .gear-front-layer"));

  if (campfire) {
    occluders.push(campfire);
  }

  return occluders;
}

function rectsOverlap(firstRect, secondRect) {
  return Boolean(
    firstRect &&
    secondRect &&
    firstRect.left < secondRect.right &&
    firstRect.right > secondRect.left &&
    firstRect.top < secondRect.bottom &&
    firstRect.bottom > secondRect.top
  );
}

function getCamperBodyViewportRect() {
  const camperRect = camperElement.getBoundingClientRect();
  const bodyRect = CAMPER_BODY_RECTS[camper.pose] || CAMPER_BODY_RECTS.default;
  return getViewportRatioRect(camperRect, bodyRect);
}

function getOccluderItemForElement(element) {
  if (!element) {
    return null;
  }

  if (element === campfire) {
    return getGearItem("campfire");
  }

  if (element.dataset && element.dataset.actionTargetId) {
    return getGearItem(element.dataset.actionTargetId);
  }

  if (element.id && element.id.indexOf("gear-") === 0 && element.id.endsWith("-front")) {
    return getGearItem(element.id.slice(5, -6));
  }

  return null;
}

function shouldIgnoreOccluderItem(item) {
  return Boolean(item && camper.interactionTargetId && item.id === camper.interactionTargetId);
}

function getCamperGearInteractionDepthItem(targetId) {
  const item = getGearItem(targetId);

  return (
    item &&
    item.scene &&
    item.scene.renderMode !== "campfire" &&
    isGearVisibleInScene(item)
  ) ? item : null;
}

function getGearInteractionDepthY(item) {
  if (!item || !item.scene) {
    return null;
  }

  const depthY = getSceneDepthY(item, getDisplayedGearLayoutOverride(item));
  return Number.isFinite(depthY) ? depthY : null;
}

function getCamperInteractionApproachDepthY(currentDepthY) {
  const targetItem = getCamperGearInteractionDepthItem(camper.interactionTargetId);

  if (
    camper.state !== "moving" ||
    !camper.target ||
    !targetItem ||
    !Number.isFinite(camper.target.x) ||
    !Number.isFinite(camper.target.y)
  ) {
    return currentDepthY;
  }

  const currentPoint = {
    x: sceneXFromPercent(camper.x),
    y: currentDepthY
  };
  const targetPoint = percentPointToScenePoint(camper.target);
  const targetDistance = getScenePointDistance(currentPoint, targetPoint);

  if (targetDistance > CAMPER_INTERACTION_DEPTH_APPROACH_DISTANCE) {
    return currentDepthY;
  }

  const targetDepthY = getGearInteractionDepthY(targetItem);

  return Math.max(currentDepthY, targetPoint.y, targetDepthY === null ? currentDepthY : targetDepthY);
}

function getCamperSeatedDepthY(currentDepthY) {
  if (
    camper.state !== "acting" ||
    (camper.currentAction !== "sittingOnFurniture" && camper.currentAction !== "sittingOnChair")
  ) {
    return currentDepthY;
  }

  const targetDepthY = getGearInteractionDepthY(getCamperGearInteractionDepthItem(camper.interactionTargetId));
  return Math.max(currentDepthY, targetDepthY === null ? currentDepthY : targetDepthY);
}

function getCamperDepthY() {
  const currentDepthY = sceneYFromPercent(camper.y);
  return getCamperSeatedDepthY(getCamperInteractionApproachDepthY(currentDepthY));
}

function updateCamperDepth() {
  setSceneElementDepth(camperElement, getCamperDepthY(), CAMPER_DEPTH_OFFSET);
}

function updateSceneOcclusion() {
  if (!camperElement) {
    return;
  }

  if (isBuildModeActive()) {
    getSceneOccluderElements().forEach(function(element) {
      element.classList.remove("camper-occluder");
    });
    return;
  }

  const camperDepthY = getCamperDepthY();
  const camperBodyRect = getCamperBodyViewportRect();

  getSceneOccluderElements().forEach(function(element) {
    const item = getOccluderItemForElement(element);
    const layoutOverride = item ? getDisplayedGearLayoutOverride(item) : null;
    const occlusionRect = item ? getSceneOcclusionRect(item, layoutOverride) : null;
    const viewportOcclusionRect = sceneRectToViewportRect(occlusionRect);
    const depthY = occlusionRect ? occlusionRect.depthY : Number(element.dataset.sceneDepthY);
    const isHidden = element.classList.contains("hidden");
    const isAlreadyFaded = element.classList.contains("camper-occluder");
    const overlapRatio = viewportOcclusionRect ? getOverlapRatioAgainstCamper(viewportOcclusionRect, camperBodyRect) : 0;
    const overlapThreshold = isAlreadyFaded ? OCCLUSION_HIDE_OVERLAP_RATIO : OCCLUSION_SHOW_OVERLAP_RATIO;
    const shouldFade = !isHidden &&
      item &&
      !shouldIgnoreOccluderItem(item) &&
      Number.isFinite(depthY) &&
      depthY > camperDepthY + OCCLUSION_DEPTH_GAP &&
      overlapRatio >= overlapThreshold;

    element.classList.toggle("camper-occluder", shouldFade);
  });
}

function isCamperAttachmentItem(item) {
  return Boolean(item && item.attachment && item.attachment.target === "camperHead");
}

function getOrCreateCamperAttachmentElement(item, layerName) {
  const normalizedLayerName = layerName || "base";
  let element = document.getElementById("gear-attachment-" + item.id + "-" + normalizedLayerName);

  if (!element && gearLayer) {
    element = document.createElement("img");
    element.id = "gear-attachment-" + item.id + "-" + normalizedLayerName;
    element.className = "camper-attachment camper-attachment-" + normalizedLayerName + " hidden";
    element.alt = "";
    gearLayer.appendChild(element);
  }

  return element;
}

function isCamperBackPose() {
  return camper.pose === "lookingLakeBack";
}

function getCamperAttachmentFacingKey() {
  return isCamperBackPose() ? "back" : normalizeFacing(camper.facing);
}

function getCamperAttachmentOffset(attachment, offsetGroupName, facingKey) {
  const group = attachment[offsetGroupName] || {};
  const poseOffsetGroupName = offsetGroupName === "coneOffsets" ? "conePoseOffsets" : "poseOffsets";
  const poseGroup = attachment[poseOffsetGroupName] && attachment[poseOffsetGroupName][camper.pose] ?
    attachment[poseOffsetGroupName][camper.pose] :
    null;

  if (poseGroup) {
    return poseGroup[facingKey] || poseGroup.right || group[facingKey] || group.right || { x: 0, y: 0, rotate: 0 };
  }

  return group[facingKey] || group.right || { x: 0, y: 0, rotate: 0 };
}

function isCamperAttachmentHiddenForPose(attachment) {
  const hiddenPoses = attachment.hiddenPoses || [];
  return hiddenPoses.indexOf(camper.pose) !== -1 || hiddenPoses.indexOf(camper.currentAction) !== -1;
}

function applyCamperAttachmentLayout(element, item, layerName, options) {
  const layerOptions = options || {};
  const attachment = item.attachment || {};
  const facingKey = getCamperAttachmentFacingKey();
  const offset = layerOptions.offset || getCamperAttachmentOffset(attachment, "offsets", facingKey);
  const facing = normalizeFacing(camper.facing);
  const logicalSize = getSceneAssetLogicalSize(item, element, element);

  setStyleValue(element, "left", sceneXFromPercent(camper.x + offset.x) + "px");
  setStyleValue(element, "top", sceneYFromPercent(camper.y + offset.y) + "px");
  setStyleValue(element, "width", logicalSize.width + "px");
  setStyleValue(element, "height", logicalSize.height + "px");
  setStyleValue(element, "aspectRatio", logicalSize.width + " / " + logicalSize.height);
  setStyleValue(element, "zIndex", getDepthZ(getCamperDepthY(), layerOptions.depthOffset || 3));
  setStyleProperty(element, "--attachment-scale-x", layerOptions.mirrorWithFacing === false ? "1" : facing === "left" ? "-1" : "1");
  setStyleProperty(element, "--attachment-rotate", (offset.rotate || 0) + "deg");
  element.classList.toggle("camper-attachment-back-pose", facingKey === "back");
  element.classList.toggle("camper-attachment-" + item.id, true);
  element.classList.toggle("camper-attachment-layer-" + layerName, true);
  setDatasetValue(element, "sceneSizeSource", logicalSize.source);

  if (!element.naturalWidth || !element.naturalHeight) {
    const relayout = function() {
      applyCamperAttachmentLayout(element, item, layerName, options);
    };

    element.addEventListener("load", relayout, { once: true });
    element.addEventListener("error", relayout, { once: true });
  }
}

function updateCamperAttachmentElement(item) {
  if (!isCamperAttachmentItem(item)) {
    return;
  }

  const attachment = item.attachment || {};
  const layers = attachment.layers || { front: item.image };
  const facingKey = getCamperAttachmentFacingKey();
  const shouldShow = ownsGear(item.id) && isGearPlaced(item.id) && !isCamperAttachmentHiddenForPose(attachment);
  const frontElement = getOrCreateCamperAttachmentElement(item, "front");
  const backElement = getOrCreateCamperAttachmentElement(item, "back");
  const coneElement = getOrCreateCamperAttachmentElement(item, "cone");

  if (frontElement && layers.front) {
    setVersionedLayerSource(frontElement, layers.front);
    setElementClassName(frontElement, "camper-attachment camper-attachment-front camper-attachment-" + item.id + (shouldShow && facingKey !== "back" ? "" : " hidden"));
    applyCamperAttachmentLayout(frontElement, item, "front", {
      depthOffset: 3
    });
  }

  if (backElement && layers.back) {
    setVersionedLayerSource(backElement, layers.back);
    setElementClassName(backElement, "camper-attachment camper-attachment-back camper-attachment-" + item.id + (shouldShow && facingKey === "back" ? "" : " hidden"));
    applyCamperAttachmentLayout(backElement, item, "back", {
      depthOffset: 1
    });
  }

  if (coneElement && layers.cone) {
    const coneOffset = getCamperAttachmentOffset(attachment, "coneOffsets", facingKey);

    setVersionedLayerSource(coneElement, layers.cone);
    setElementClassName(coneElement, "camper-attachment camper-attachment-cone camper-attachment-" + item.id + (shouldShow ? "" : " hidden"));
    applyCamperAttachmentLayout(coneElement, item, "cone", {
      offset: coneOffset,
      depthOffset: facingKey === "back" ? 0 : 4
    });
  }
}

function updateCamperAttachments() {
  getGearItems().forEach(function(item) {
    if (isCamperAttachmentItem(item)) {
      updateCamperAttachmentElement(item);
    }
  });
}

function isGearVisibleInScene(item) {
  if (!item.scene) {
    return false;
  }

  if (item.scene.renderMode === "campfire") {
    return true;
  }

  if (isRooftopTentItem(item)) {
    return getEquippedGearId("tent") === item.id && isVehiclePlaced(getCurrentVehicleItem());
  }

  if (isVehicleItem(item)) {
    return isVehiclePlaced(item);
  }

  if (isTentItem(item) || isTarpItem(item)) {
    return getEquippedGearId(item.category) === item.id;
  }

  return ownsGear(item.id) && isGearPlaced(item.id);
}

function updateSceneGearVisibility(item) {
  const element = getGearSceneElement(item);
  const frontElement = document.getElementById(getGearFrontElementId(item));
  const isVisible = isGearVisibleInScene(item);
  const layers = item.scene && item.scene.layers ? item.scene.layers : {};
  const isInteractive = isVisible && isGearQueueInteractive(item) && !isBuildModeActive();
  const isBuildDraggable = isBuildModeActive() && isVisible && isBuildDraggableItem(item);
  const isBuildSelected = isSelectedBuildItem(item);

  if (element && item.scene.renderMode !== "campfire") {
    element.classList.toggle("hidden", !isVisible);
    element.classList.toggle("interactive-action-target", isInteractive);
    element.classList.toggle("build-draggable-target", isBuildDraggable);
    element.classList.toggle("build-selected-target", isBuildSelected && isBuildDraggable);
    element.classList.toggle("build-dragging", buildDragState && buildDragState.itemKey === getBuildSelectionKey(item));
    element.tabIndex = isInteractive || isBuildDraggable ? 0 : -1;

    if (isBuildSelected && !isBuildDraggable) {
      clearSelectedBuildTarget();
    }

    if (!isInteractive && selectedActionTargetElement === element) {
      clearSelectedActionTarget();
    }

    if (isInteractive || isBuildDraggable) {
      updateTargetOutlineForElement(element);
    }
  }

  if (frontElement) {
    frontElement.classList.toggle("hidden", !isVisible || !layers.front);
  }

  if (!isVisible && depthControlHoverTargetId === item.id) {
    depthControlHoverTargetId = "";
    syncSceneDepthControls();
  }
}

function configureCampfireActionTarget() {
  campfire.classList.add("interactive-action-target", "campfire-action-target");
  campfire.setAttribute("role", "button");
  campfire.tabIndex = 0;
  campfire.onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (isBuildModeActive()) {
      return;
    }
    clearSelectedActionTarget();
    enqueueAction("fire", "campfire");
  };
  campfire.onkeydown = function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isBuildModeActive()) {
        return;
      }
      clearSelectedActionTarget();
      enqueueAction("fire", "campfire");
    }
  };
}

function updateSceneEquipment() {
  sceneBackground.src = gameState.isNight ? assetPaths.backgrounds.campsiteNight : assetPaths.backgrounds.campsiteDay;
  treelineImage.src = gameState.isNight ? assetPaths.backgrounds.treelineNight : assetPaths.backgrounds.treelineDay;
  lakeImage.src = gameState.isNight ? assetPaths.backgrounds.lakeNight : assetPaths.backgrounds.lakeDay;

  getGearItems().forEach(function(item) {
    updateGearSceneElement(item);
    updateSceneGearVisibility(item);
  });
  reconcileSelectedBuildTarget();
  updateCamperAttachments();

  campfire.className = "campfire asset-object level-" + gameState.campfireLevel;
  campfire.classList.toggle("lit", gameState.warmthSeconds > 0);
  configureCampfireActionTarget();
  fireGlowImage.src = assetPaths.campfire.glow;
  campfireBaseImage.src = assetPaths.campfire.base[gameState.campfireLevel];
  campfireFlameImage.src = getCurrentFlameImage();
  updateTargetOutline(campfire, campfireBaseImage);
  updateCampfireDepth();

  dayNightIcon.src = gameState.isNight ? assetPaths.ui.day : assetPaths.ui.night;
  updateActionQueueIndicators();
  updateSceneOcclusion();
  syncSceneDepthControls();
}

function spendCozyPoints(cost) {
  if (gameState.cozyPoints < cost) {
    return false;
  }

  gameState.cozyPoints -= cost;
  return true;
}

function upgradeCampfire() {
  const cost = getCampfireUpgradeCost();

  if (cost > 0 && spendCozyPoints(cost)) {
    gameState.campfireLevel += 1;
    setStatus("The campfire burns cleaner and warmer.");
    updateScreen();
    saveGame();
  }
}

function equipGear(item) {
  if (!isEquippableGear(item) || !ownsGear(item.id)) {
    return false;
  }

  gameState.equippedGear[item.category] = item.id;

  if (isRooftopTentItem(item)) {
    ensureVehicleForRooftopTent();
  }

  return true;
}

function ensureVehicleForRooftopTent() {
  let vehicleItem = getCurrentVehicleItem();

  if (!vehicleItem || !ownsGear(vehicleItem.id)) {
    vehicleItem = getOwnedGearItems().find(isVehicleItem);

    if (vehicleItem) {
      gameState.equippedGear.vehicle = vehicleItem.id;
    }
  }

  if (vehicleItem) {
    placeGear(vehicleItem);
  }
}

function placeGear(item) {
  if (!isGearPlaceable(item) || !ownsGear(item.id)) {
    return false;
  }

  addUniquePlacedGear(gameState.placedGear, item.id);
  return true;
}

function packGear(item) {
  if (!isGearPlaceable(item) || !ownsGear(item.id) || !isGearPlaced(item.id)) {
    return false;
  }

  removePlacedGear(item.id);
  return true;
}

function packTarp(item) {
  if (!isTarpItem(item) || getEquippedGearId(item.category) !== item.id) {
    return false;
  }

  delete gameState.equippedGear[item.category];
  return true;
}

function unlockGearRewards(item) {
  if (item.unlocks && item.unlocks.nightMode) {
    gameState.nightUnlocked = true;
  }
}

function buyGear(item) {
  if (!item || ownsGear(item.id) || getMissingGearRequirements(item).length > 0) {
    return false;
  }

  if (!spendCozyPoints(item.cost)) {
    return false;
  }

  addUniqueGear(gameState.ownedGear, item.id);
  unlockGearRewards(item);

  if (isEquippableGear(item)) {
    equipGear(item);
  }

  if (isGearPlaceable(item)) {
    placeGear(item);
  }

  return true;
}

function handleVehicleAction(item) {
  const isEquipped = getEquippedGearId("vehicle") === item.id;
  const isPlaced = isGearPlaced(item.id);

  if (!ownsGear(item.id)) {
    return false;
  }

  if (!isEquipped) {
    equipGear(item);
    placeGear(item);
    setStatus("The camper parks " + item.displayName + " at camp.");
  } else if (!isPlaced) {
    placeGear(item);
    setStatus(item.displayName + " returns to the campsite.");
  } else if (isCurrentRooftopTentEquipped()) {
    setStatus("The rooftop tent is mounted. Switch tents before stowing the vehicle.");
  } else {
    packGear(item);
    setStatus(item.displayName + " is stowed away.");
  }

  updateScreen();
  saveGame();
  return true;
}

function handleGearAction(id) {
  const item = getGearItem(id);

  if (!item) {
    return;
  }

  if (item.interactions && item.interactions.upgradeCampfire) {
    upgradeCampfire();
    return;
  }

  if (isVehicleItem(item) && handleVehicleAction(item)) {
    return;
  }

  if (ownsGear(item.id) && isTarpItem(item)) {
    // Tarps keep the single-slot equip behaviour, but present the same
    // place / pack flow (and button styling) as other placeable gear.
    if (getEquippedGearId(item.category) === item.id) {
      if (packTarp(item)) {
        setStatus(item.displayName + " is packed away.");
        updateScreen();
        saveGame();
      }
    } else if (equipGear(item)) {
      setStatus(item.displayName + " is placed in camp.");
      updateScreen();
      saveGame();
    }
    return;
  }

  if (ownsGear(item.id) && isEquippableGear(item)) {
    if (equipGear(item)) {
      setStatus("The camper switches to " + item.displayName + ".");
      updateScreen();
      saveGame();
    }
    return;
  }

  if (ownsGear(item.id) && isGearPlaceable(item)) {
    if (isGearPlaced(item.id)) {
      if (packGear(item)) {
        setStatus(item.displayName + " is packed away.");
        updateScreen();
        saveGame();
      }
    } else if (placeGear(item)) {
      setStatus(item.displayName + " is placed in camp.");
      updateScreen();
      saveGame();
    }
    return;
  }

  const wasBuildModeUnlocked = isBuildModeUnlocked();

  if (buyGear(item)) {
    const buildModeJustUnlocked = !wasBuildModeUnlocked && isBuildModeUnlocked();
    setStatus(buildModeJustUnlocked ? "Build Mode unlocked. Tap Build to move camp items." : isEquippableGear(item) || isGearPlaceable(item) ? item.displayName + " joins the campsite." : item.displayName + " is owned.");
    updateScreen();
    saveGame();

    if (onboardingActive && getOnboardingStep() && getOnboardingStep().id === "chair" && item.id === ONBOARDING_FIRST_GEAR_ID) {
      advanceOnboarding();
    }
  }
}

function openShop() {
  document.body.classList.add("shop-open");
  shopDrawer.setAttribute("aria-hidden", "false");
  setShopFilter(activeShopFilter);

  if (onboardingActive && getOnboardingStep() && getOnboardingStep().id === "shop") {
    advanceOnboarding();
  }
}

function closeShop() {
  document.body.classList.remove("shop-open");
  shopDrawer.setAttribute("aria-hidden", "true");
}

function toggleShop() {
  if (isBuildModeActive()) {
    setStatus("Tap Done before opening Shop.");
    return;
  }

  if (document.body.classList.contains("shop-open")) {
    closeShop();
  } else {
    openShop();
  }
}

function setShopFilter(filter) {
  activeShopFilter = filter || "all";

  shopTabs.forEach(function(tab) {
    tab.classList.toggle("active", tab.getAttribute("data-shop-filter") === activeShopFilter);
  });

  shopSections.forEach(function(section) {
    const group = section.getAttribute("data-shop-group");
    const shouldShow = activeShopFilter === "all" || group === activeShopFilter;
    section.classList.toggle("filtered-hidden", !shouldShow);
  });

  shopContent.classList.toggle("single-category", activeShopFilter !== "all");
  shopContent.scrollLeft = 0;
  shopContent.scrollTop = 0;
}

function toggleGatherWoodMode() {
  gameState.gatherWoodMode = !gameState.gatherWoodMode;
  const shouldChooseGatherAction = gameState.gatherWoodMode ? interruptRelaxingActionForGatherMode() : false;

  if (!gameState.gatherWoodMode || !shouldChooseGatherAction) {
    camper.actionTimer = 0;
  }

  setStatus(gameState.gatherWoodMode ? "The camper will automatically collect fallen branches." : "Gather is off. You can still tap branches by hand.");
  updateScreen();
  saveGame();

  if (shouldChooseGatherAction) {
    chooseNextCamperAction();
  }

  if (onboardingActive && getOnboardingStep() && getOnboardingStep().id === "gather" && gameState.gatherWoodMode) {
    advanceOnboarding();
  }
}

function interruptRelaxingActionForGatherMode() {
  if (activeQueuedAction || camper.carryingWood) {
    return false;
  }

  if (camperMotionFrameId !== null && typeof window !== "undefined" && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(camperMotionFrameId);
    camperMotionFrameId = null;
  }

  camper.state = "idle";
  camper.pose = "idle";
  camper.target = null;
  camper.actionAfterArrival = null;
  camper.currentAction = "idle";
  camper.actionTimer = 0;
  camper.targetWoodId = null;
  camper.woodCollectionSource = null;
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathStartedAt = 0;
  camper.pathDurationMs = 0;
  camper.pathLength = 0;
  camper.interactionTargetId = "";

  updateCamperView();
  return true;
}

function toggleDayNight() {
  if (!gameState.nightUnlocked) {
    return;
  }

  gameState.isNight = !gameState.isNight;
  setStatus(gameState.isNight ? "Night settles over the lake." : "Morning light returns to camp.");
  updateScreen();
  saveGame();
}

function pauseCamperForBuildMode() {
  if (camperMotionFrameId !== null && typeof window !== "undefined" && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(camperMotionFrameId);
    camperMotionFrameId = null;
  }

  if (activeQueuedAction) {
    actionQueue.unshift(activeQueuedAction);
    activeQueuedAction = null;
  }

  camper.state = "idle";
  camper.pose = "idle";
  camper.target = null;
  camper.actionAfterArrival = null;
  camper.currentAction = "idle";
  camper.actionTimer = Number.POSITIVE_INFINITY;
  camper.targetWoodId = null;
  camper.woodCollectionSource = null;
  camper.carryingWood = false;
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathStartedAt = 0;
  camper.pathDurationMs = 0;
  camper.pathLength = 0;
  camper.interactionTargetId = "";

  updateActionQueueIndicators();
  updateCamperView();
}

function refreshCamperBesideCampfire() {
  camper.x = campSpots.fireSeat.x;
  camper.y = campSpots.fireSeat.y;
  camper.state = "idle";
  camper.pose = "idle";
  camper.target = null;
  camper.actionAfterArrival = null;
  camper.currentAction = "idle";
  camper.actionTimer = Date.now() + 250;
  camper.targetWoodId = null;
  camper.woodCollectionSource = null;
  camper.carryingWood = false;
  camper.facing = "right";
  camper.animationStartedAt = Date.now();
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathStartedAt = 0;
  camper.pathDurationMs = 0;
  camper.pathLength = 0;
  camper.interactionTargetId = "";

  updateCamperView();
}

function enterBuildMode() {
  if (!isBuildModeUnlocked()) {
    setStatus("Buy more camp gear to unlock Build Mode.");
    return;
  }

  if (buildModeActive) {
    return;
  }

  closeShop();
  clearSelectedActionTarget();
  clearSelectedBuildTarget();
  buildModeActive = true;
  depthControlHoverTargetId = "";
  pauseCamperForBuildMode();
  updateBuildModeControls();
  updateSceneEquipment();
  setStatus("Build Mode: drag placed items, then tap Done.");
}

function exitBuildMode() {
  if (!buildModeActive) {
    updateBuildModeControls();
    return;
  }

  finishBuildDrag();
  depthControlHoverTargetId = "";
  clearSelectedBuildTarget();
  buildModeActive = false;
  clearSelectedActionTarget();
  refreshCamperBesideCampfire();
  updateBuildModeControls();
  updateSceneEquipment();
  updateActionQueueIndicators();
  saveGame();
  setStatus("Done. The camper returns to the fire.");
  chooseNextCamperAction();
}

function toggleBuildMode() {
  if (buildModeActive) {
    exitBuildMode();
  } else {
    enterBuildMode();
  }
}

function spawnWood() {
  if (woodItems.length >= maxWoodItems) {
    return;
  }

  const wood = {
    id: nextWoodId,
    x: randomBetween(14, 68),
    y: randomBetween(67, 82),
    rotate: randomBetween(-22, 22)
  };

  nextWoodId += 1;
  woodItems.push(wood);
  renderWoodItem(wood);
}

function renderWoodItem(wood) {
  const woodElement = document.createElement("button");
  const woodImage = document.createElement("img");

  woodElement.className = "wood-item";
  woodElement.id = "wood-" + wood.id;
  woodElement.type = "button";
  woodElement.setAttribute("aria-label", "Send camper to collect fallen branches");
  woodElement.style.left = sceneXFromPercent(wood.x) + "px";
  woodElement.style.top = sceneYFromPercent(wood.y) + "px";
  woodElement.style.setProperty("--wood-rotate", wood.rotate + "deg");
  updateWoodDepth(woodElement, wood);

  woodImage.className = "wood-image";
  woodImage.src = assetPaths.resources.wood;
  woodImage.alt = "";
  woodElement.appendChild(woodImage);

  woodElement.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    collectWoodManually(wood.id);
  });
  woodElement.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      collectWoodManually(wood.id);
    }
  });
  woodLayer.appendChild(woodElement);
  updateTargetOutline(woodElement, woodImage);
}

function updateWoodDepth(woodElement, wood) {
  if (!woodElement || !wood) {
    return;
  }

  setSceneElementDepth(woodElement, sceneYFromPercent(wood.y), -1);
}

function setTargetWood(woodId) {
  camper.targetWoodId = woodId;
}

function addWarmthFromBranches(source) {
  const warmthGain = getWoodWarmthValue();

  gameState.warmthSeconds += warmthGain;

  if (source === "manual") {
    setStatus("The camper adds your chosen branches. Warmth rises.");
  } else {
    setStatus("Branches become Warmth. The fire keeps working.");
  }

  updateScreen();
  saveGame();
  return warmthGain;
}

function collectWoodManually(woodId) {
  if (isBuildModeActive()) {
    return;
  }

  const wood = woodItems.find(function(item) {
    return item.id === woodId;
  });

  if (!wood) {
    return;
  }

  clearSelectedActionTarget();
  enqueueAction("wood", wood.id);
}

function executeQueuedWoodAction(action) {
  const wood = woodItems.find(function(item) {
    return item.id === action.targetId;
  });

  if (!wood) {
    completeActiveQueuedAction();
    return;
  }

  setTargetWood(wood.id);
  camper.woodCollectionSource = activeQueuedAction ? "manual" : "auto";
  if (!startMovingTo(
    { x: wood.x, y: wood.y },
    "pickupWood",
    { labelAction: "movingToWood" }
  )) {
    setStatus("No clear path to those fallen branches.");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads over to those fallen branches.");
}

function removeWoodItem(woodId) {
  woodItems = woodItems.filter(function(wood) {
    return wood.id !== woodId;
  });

  const woodElement = document.getElementById("wood-" + woodId);

  if (woodElement) {
    woodElement.remove();
  }
}

function getWoodDistanceFromCamper(wood) {
  if (!wood) {
    return Infinity;
  }

  return Math.abs(wood.x - camper.x) + Math.abs(wood.y - camper.y);
}

function getWoodItemsByDistance() {
  return woodItems.slice().filter(Boolean).sort(function(firstWood, secondWood) {
    return getWoodDistanceFromCamper(firstWood) - getWoodDistanceFromCamper(secondWood);
  });
}

function startAutoWoodCollection() {
  const candidates = getWoodItemsByDistance();

  for (let index = 0; index < candidates.length; index += 1) {
    const wood = candidates[index];

    if (!woodItems.some(function(currentWood) {
      return currentWood.id === wood.id;
    })) {
      continue;
    }

    if (startMovingTo(
      { x: wood.x, y: wood.y },
      "pickupWood",
      { labelAction: "movingToWood" }
    )) {
      setTargetWood(wood.id);
      camper.woodCollectionSource = "auto";
      setStatus("The camper spotted fallen branches.");
      return true;
    }
  }

  setTargetWood(null);
  camper.woodCollectionSource = null;
  return false;
}

function getTravelTime(targetX, targetY) {
  const distance = Math.abs(targetX - camper.x) + Math.abs(targetY - camper.y);
  return clamp(0.8 + distance / 24, 1.1, 3.4);
}

function getTravelTimeForPathLength(pathLength) {
  return clamp(pathLength / PATH_MOVE_SPEED_PX_PER_SECOND + 0.2, PATH_MIN_DURATION_MS / 1000, PATH_MAX_DURATION_MS / 1000);
}

function getScenePointDistance(firstPoint, secondPoint) {
  const dx = secondPoint.x - firstPoint.x;
  const dy = secondPoint.y - firstPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function clampScenePoint(point) {
  return {
    x: clamp(point.x, 0, BASE_SCENE_WIDTH),
    y: clamp(point.y, 0, BASE_SCENE_HEIGHT)
  };
}

function getSceneCollisionObstacles(options) {
  const pathOptions = options || {};
  const ignoreObstacleId = pathOptions.ignoreObstacleId || "";
  const startPoint = pathOptions.startPoint || null;
  const obstacles = [];

  getGearItems().forEach(function(item) {
    if (!item || !item.scene || item.id === ignoreObstacleId || !isGearVisibleInScene(item)) {
      return;
    }

    const rect = getSceneCollisionRect(item, getSceneLayoutOverride(item));

    if (!rect) {
      return;
    }

    const obstacle = inflateRect(rect, CAMPER_COLLISION_RADIUS);

    if (startPoint && pointInRect(startPoint, obstacle)) {
      return;
    }

    obstacles.push(obstacle);
  });

  return obstacles;
}

function pointToPathCell(point) {
  return {
    col: clamp(Math.floor(point.x / PATH_GRID_SIZE), 0, Math.ceil(BASE_SCENE_WIDTH / PATH_GRID_SIZE) - 1),
    row: clamp(Math.floor(point.y / PATH_GRID_SIZE), 0, Math.ceil(BASE_SCENE_HEIGHT / PATH_GRID_SIZE) - 1)
  };
}

function getPathCellKey(cell) {
  return cell.col + ":" + cell.row;
}

function pathCellToScenePoint(cell) {
  return {
    x: clamp(cell.col * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 0, BASE_SCENE_WIDTH),
    y: clamp(cell.row * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 0, BASE_SCENE_HEIGHT)
  };
}

function isScenePointBlocked(point, obstacles) {
  return obstacles.some(function(obstacle) {
    return pointInRect(point, obstacle);
  });
}

function isPathCellBlocked(cell, obstacles, startCell) {
  if (startCell && cell.col === startCell.col && cell.row === startCell.row) {
    return false;
  }

  return isScenePointBlocked(pathCellToScenePoint(cell), obstacles);
}

function createPathNode(cell, targetPoint, parent, gCost) {
  const point = pathCellToScenePoint(cell);
  const hCost = getScenePointDistance(point, targetPoint);

  return {
    cell: cell,
    key: getPathCellKey(cell),
    parent: parent || null,
    g: gCost || 0,
    h: hCost,
    f: (gCost || 0) + hCost
  };
}

function buildPathPointsFromNode(node, startPoint, targetPoint, useTargetPoint) {
  const cells = [];
  let currentNode = node;

  while (currentNode) {
    cells.push(currentNode.cell);
    currentNode = currentNode.parent;
  }

  cells.reverse();

  const points = [startPoint];

  cells.slice(1).forEach(function(cell) {
    points.push(pathCellToScenePoint(cell));
  });

  points.push(useTargetPoint ? targetPoint : pathCellToScenePoint(node.cell));

  return points.filter(function(point, index) {
    return index === 0 || getScenePointDistance(point, points[index - 1]) > 0.5;
  });
}

function getPathSegmentLengths(points) {
  const segmentLengths = [];

  for (let index = 1; index < points.length; index += 1) {
    segmentLengths.push(getScenePointDistance(points[index - 1], points[index]));
  }

  return segmentLengths;
}

function getPathLengthFromSegments(segmentLengths) {
  return segmentLengths.reduce(function(total, length) {
    return total + length;
  }, 0);
}

function findPathOnGrid(startPoint, targetPoint, obstacles) {
  const startCell = pointToPathCell(startPoint);
  const targetCell = pointToPathCell(targetPoint);
  const targetKey = getPathCellKey(targetCell);
  const targetBlocked = isScenePointBlocked(targetPoint, obstacles) || isPathCellBlocked(targetCell, obstacles, startCell);
  const openNodes = [];
  const nodesByKey = {};
  const closedKeys = {};
  const maxCol = Math.ceil(BASE_SCENE_WIDTH / PATH_GRID_SIZE) - 1;
  const maxRow = Math.ceil(BASE_SCENE_HEIGHT / PATH_GRID_SIZE) - 1;
  let bestNode = createPathNode(startCell, targetPoint, null, 0);
  let iterations = 0;

  openNodes.push(bestNode);
  nodesByKey[bestNode.key] = bestNode;

  while (openNodes.length > 0 && iterations < 6000) {
    iterations += 1;
    openNodes.sort(function(firstNode, secondNode) {
      return firstNode.f - secondNode.f;
    });

    const currentNode = openNodes.shift();

    if (closedKeys[currentNode.key]) {
      continue;
    }

    closedKeys[currentNode.key] = true;

    if (currentNode.h < bestNode.h) {
      bestNode = currentNode;
    }

    if (!targetBlocked && currentNode.key === targetKey) {
      const points = buildPathPointsFromNode(currentNode, startPoint, targetPoint, true);
      const segmentLengths = getPathSegmentLengths(points);

      return {
        points: points,
        segmentLengths: segmentLengths,
        length: getPathLengthFromSegments(segmentLengths),
        reachedTarget: true
      };
    }

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const nextCell = {
          col: currentNode.cell.col + colOffset,
          row: currentNode.cell.row + rowOffset
        };

        if (nextCell.col < 0 || nextCell.col > maxCol || nextCell.row < 0 || nextCell.row > maxRow) {
          continue;
        }

        if (closedKeys[getPathCellKey(nextCell)] || isPathCellBlocked(nextCell, obstacles, startCell)) {
          continue;
        }

        if (rowOffset !== 0 && colOffset !== 0) {
          const horizontalCell = { col: currentNode.cell.col + colOffset, row: currentNode.cell.row };
          const verticalCell = { col: currentNode.cell.col, row: currentNode.cell.row + rowOffset };

          if (isPathCellBlocked(horizontalCell, obstacles, startCell) || isPathCellBlocked(verticalCell, obstacles, startCell)) {
            continue;
          }
        }

        const nextKey = getPathCellKey(nextCell);
        const stepCost = rowOffset !== 0 && colOffset !== 0 ? Math.SQRT2 * PATH_GRID_SIZE : PATH_GRID_SIZE;
        const nextG = currentNode.g + stepCost;
        const existingNode = nodesByKey[nextKey];

        if (existingNode && existingNode.g <= nextG) {
          continue;
        }

        const nextNode = createPathNode(nextCell, targetPoint, currentNode, nextG);
        nodesByKey[nextKey] = nextNode;
        openNodes.push(nextNode);
      }
    }
  }

  if (!bestNode || bestNode.key === getPathCellKey(startCell)) {
    return null;
  }

  const points = buildPathPointsFromNode(bestNode, startPoint, targetPoint, false);
  const segmentLengths = getPathSegmentLengths(points);

  return {
    points: points,
    segmentLengths: segmentLengths,
    length: getPathLengthFromSegments(segmentLengths),
    reachedTarget: false
  };
}

function getCamperMovePath(target, options) {
  const targetPoint = clampScenePoint(percentPointToScenePoint(target));
  const startPoint = clampScenePoint(percentPointToScenePoint({ x: camper.x, y: camper.y }));
  const obstacles = getSceneCollisionObstacles({
    ignoreObstacleId: options && options.ignoreObstacleId,
    startPoint: startPoint
  });

  if (getScenePointDistance(startPoint, targetPoint) <= 1) {
    return {
      points: [startPoint, targetPoint],
      segmentLengths: [0],
      length: 0,
      reachedTarget: true
    };
  }

  return findPathOnGrid(startPoint, targetPoint, obstacles);
}

const FIRE_APPROACH_SPOTS = [campSpots.fireSeat, campSpots.fireSeatRight];

function startMovingToFire(actionAfterArrival, moveOptions) {
  // Walk around the campfire to a spot beside it rather than straight through
  // the flames. Try each side approach (nearest first) with the fire treated
  // as a real obstacle; only if the fire is fully boxed in do we fall back to
  // a direct approach that ignores it.
  const orderedSpots = FIRE_APPROACH_SPOTS.slice().sort(function(firstSpot, secondSpot) {
    const firstDistance = Math.abs(firstSpot.x - camper.x) + Math.abs(firstSpot.y - camper.y);
    const secondDistance = Math.abs(secondSpot.x - camper.x) + Math.abs(secondSpot.y - camper.y);
    return firstDistance - secondDistance;
  });

  for (let index = 0; index < orderedSpots.length; index += 1) {
    const target = Object.assign({}, orderedSpots[index], { interactionTargetId: "campfire" });
    const path = getCamperMovePath(target);

    if (path && path.reachedTarget) {
      return startMovingTo(target, actionAfterArrival, moveOptions);
    }
  }

  return startMovingTo(
    Object.assign({}, campSpots.fireSeat, { interactionTargetId: "campfire", ignoreObstacleId: "campfire" }),
    actionAfterArrival,
    moveOptions
  );
}

function normalizeFacing(facing) {
  return facing === "left" || facing === "right" ? facing : "right";
}

function getOppositeFacing(facing) {
  return normalizeFacing(facing) === "left" ? "right" : "left";
}

function getMovementFacing(fromX, toX) {
  if (toX < fromX) {
    return "left";
  }

  if (toX > fromX) {
    return "right";
  }

  return "right";
}

function getSeatableFurnitureEntries() {
  return getGearItems().filter(function(item) {
    return item.category === "chair" && item.interactions && item.interactions.seatable;
  }).map(function(item) {
    return {
      id: item.id,
      def: item
    };
  }).filter(function(entry) {
    return Boolean(entry.def);
  });
}

function getSeatableFurnitureDef(id) {
  const item = getGearItem(id);

  if (item && item.interactions && item.interactions.seatable) {
    return item;
  }

  return null;
}

function getSeatableElement(def) {
  return getGearSceneElement(def);
}

function getSeatableLogicalSize(def) {
  return getSceneAssetLogicalSize(def, getSeatableElement(def));
}

function getSeatableGroundAnchor(def, logicalSize) {
  return getSceneGroundAnchor(def, logicalSize || getSeatableLogicalSize(def));
}

function getSeatableFacing(def) {
  const facing = normalizeFacing(def && def.scene && def.scene.facing);
  return isSeatableMirrored(def) ? getOppositeFacing(facing) : facing;
}

function isSeatableMirrored(def) {
  return Boolean(def && def.scene && def.scene.mirrored);
}

function mirrorSeatOffset(logicalSize, offset) {
  return {
    x: logicalSize.width - offset.x,
    y: offset.y
  };
}

function getSeatableSeatOffset(def, facing, logicalSize) {
  const assetLogicalSize = logicalSize || getSeatableLogicalSize(def);
  const seatable = def && def.interactions ? def.interactions.seatable : null;
  const seatOffsets = seatable && seatable.seatOffsets ? seatable.seatOffsets : {};
  const normalizedFacing = normalizeFacing(facing);
  const explicitOffset = seatOffsets[normalizedFacing];

  if (explicitOffset) {
    return getSceneAssetLogicalPoint(def, explicitOffset, assetLogicalSize);
  }

  const oppositeOffset = seatOffsets[getOppositeFacing(normalizedFacing)];

  if (oppositeOffset) {
    return mirrorSeatOffset(assetLogicalSize, getSceneAssetLogicalPoint(def, oppositeOffset, assetLogicalSize));
  }

  const defaultSeatOffset = seatOffsets.default ? getSceneAssetLogicalPoint(def, seatOffsets.default, assetLogicalSize) : getSeatableGroundAnchor(def, assetLogicalSize);
  return isSeatableMirrored(def) ? mirrorSeatOffset(assetLogicalSize, defaultSeatOffset) : defaultSeatOffset;
}

function getSceneWidthToHeightRatio() {
  return BASE_SCENE_WIDTH / BASE_SCENE_HEIGHT;
}

function getSeatableSceneTarget(id, def, facing) {
  const logicalSize = getSeatableLogicalSize(def);
  const groundAnchor = getSeatableGroundAnchor(def, logicalSize);
  const seatOffset = getSeatableSeatOffset(def, facing, logicalSize);
  const layoutOverride = getDisplayedGearLayoutOverride(def);
  const position = getScenePixelPosition(def.scene || {}, layoutOverride);
  const seatPoint = {
    x: position.x + seatOffset.x - groundAnchor.x,
    y: position.y + seatOffset.y - groundAnchor.y
  };
  const percentPoint = scenePointToPercent(seatPoint);

  return {
    x: percentPoint.x,
    y: percentPoint.y,
    seatableId: id,
    furnitureFacing: facing,
    ignoreObstacleId: id
  };
}

function getSeatableSeatTarget(id, def) {
  const facing = getSeatableFacing(def);

  return getSeatableSceneTarget(id, def, facing);
}

function isSeatableFurnitureAvailable(def) {
  return Boolean(def && ownsGear(def.id) && isGearPlaced(def.id));
}

function getAvailableSeatableFurnitureEntries() {
  return getSeatableFurnitureEntries().filter(function(entry) {
    return isSeatableFurnitureAvailable(entry.def);
  });
}

function getRandomSeatableSeatTarget() {
  const entries = getAvailableSeatableFurnitureEntries();

  if (entries.length === 0) {
    return null;
  }

  const entry = entries[Math.floor(Math.random() * entries.length)];
  return getSeatableSeatTarget(entry.id, entry.def);
}

function executeQueuedChairAction(action) {
  const item = getGearItem(action.targetId);

  if (!item || !isGearVisibleInScene(item) || !isGearQueueInteractive(item)) {
    completeActiveQueuedAction();
    return;
  }

  if (!startMovingTo(getSeatableSeatTarget(item.id, item), "sittingOnFurniture")) {
    setStatus("No clear path to " + item.displayName + ".");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads over to " + item.displayName + ".");
}

function getCamperFacingForSeatable(target) {
  const def = getSeatableFurnitureDef(target && target.seatableId);

  if (!def) {
    return "right";
  }

  const furnitureFacing = normalizeFacing(target.furnitureFacing || getSeatableFacing(def));

  const seatable = def.interactions && def.interactions.seatable ? def.interactions.seatable : {};

  if (seatable.camperFacingMode === "oppositeFurniture") {
    return getOppositeFacing(furnitureFacing);
  }

  if (seatable.camperFacingMode === "sameAsFurniture") {
    return furnitureFacing;
  }

  return "right";
}

function getFacingTowardPoint(point) {
  if (!point || typeof point.x !== "number") {
    return "right";
  }

  if (camper.x < point.x) {
    return "right";
  }

  if (camper.x > point.x) {
    return "left";
  }

  return "right";
}

function getRandomFacing() {
  return Math.random() < 0.5 ? "left" : "right";
}

function getFacingForAction(action, target) {
  if (action === "sittingOnFurniture" || action === "sittingOnChair") {
    return getCamperFacingForSeatable(target);
  }

  if (action === "sittingByFire") {
    return getFacingTowardPoint(campSpots.fire);
  }

  if (action === "observingGear") {
    return getFacingTowardPoint(target);
  }

  if (action === "lookingAtLake" || action === "resting") {
    return getRandomFacing();
  }

  return "right";
}

function getCamperAnimationFrameIndex(frameCount) {
  const animationStartedAt = camper.animationStartedAt || Date.now();
  const safeFrameCount = Math.max(1, frameCount || 1);

  return Math.floor((Date.now() - animationStartedAt) / camperFrameDurationMs) % safeFrameCount;
}

function getCamperAnimationFrame(frames, fallbackFrame) {
  if (!Array.isArray(frames) || frames.length === 0) {
    return fallbackFrame || "";
  }

  return frames[getCamperAnimationFrameIndex(frames.length)] || fallbackFrame || frames[0];
}

function updateCamperPathMotion(now) {
  if (camper.state !== "moving" || !camper.pathPoints || camper.pathPoints.length === 0) {
    return;
  }

  const durationMs = camper.pathDurationMs || 1;
  const elapsedMs = clamp(now - camper.pathStartedAt, 0, durationMs);
  const pathLength = camper.pathLength || 0;
  let remainingDistance = pathLength * (elapsedMs / durationMs);
  let nextPoint = camper.pathPoints[camper.pathPoints.length - 1];
  let previousPoint = camper.pathPoints[0];

  for (let index = 0; index < camper.pathSegmentLengths.length; index += 1) {
    const segmentLength = camper.pathSegmentLengths[index];
    const segmentStart = camper.pathPoints[index];
    const segmentEnd = camper.pathPoints[index + 1];

    if (remainingDistance <= segmentLength || index === camper.pathSegmentLengths.length - 1) {
      const progress = segmentLength > 0 ? clamp(remainingDistance / segmentLength, 0, 1) : 1;
      nextPoint = {
        x: segmentStart.x + (segmentEnd.x - segmentStart.x) * progress,
        y: segmentStart.y + (segmentEnd.y - segmentStart.y) * progress
      };
      previousPoint = segmentStart;
      break;
    }

    remainingDistance -= segmentLength;
  }

  if (Math.abs(nextPoint.x - previousPoint.x) > 0.5) {
    camper.facing = nextPoint.x < previousPoint.x ? "left" : "right";
  }

  camper.x = sceneXToPercent(nextPoint.x);
  camper.y = sceneYToPercent(nextPoint.y);
  updateCamperView();
}

function requestCamperMotionFrame() {
  if (camperMotionFrameId !== null || typeof window === "undefined" || !window.requestAnimationFrame) {
    return;
  }

  camperMotionFrameId = window.requestAnimationFrame(function() {
    camperMotionFrameId = null;
    updateCamperPathMotion(Date.now());

    if (camper.state === "moving" && Date.now() < camper.actionTimer) {
      requestCamperMotionFrame();
    }
  });
}

function getInteractionTargetId(target) {
  return target && (target.interactionTargetId || target.ignoreObstacleId || target.seatableId) || "";
}

function startMovingTo(target, actionAfterArrival, options) {
  const moveOptions = options || {};
  const actionName = moveOptions.labelAction || actionAfterArrival;
  const now = Date.now();
  const ignoreObstacleId = moveOptions.ignoreObstacleId || target.ignoreObstacleId || target.seatableId || "";
  const interactionTargetId = moveOptions.interactionTargetId || getInteractionTargetId(target) || "";
  const movePath = getCamperMovePath(target, { ignoreObstacleId: ignoreObstacleId });

  if (!movePath || movePath.points.length < 2) {
    camper.pathPoints = [];
    camper.pathSegmentLengths = [];
    camper.pathLength = 0;
    camper.pathDurationMs = 0;
    camper.pathStartedAt = 0;
    camper.state = "idle";
    camper.pose = "idle";
    camper.currentAction = "idle";
    camper.actionAfterArrival = null;
    camper.target = null;
    camper.interactionTargetId = "";
    camper.actionTimer = now + 600;
    updateCamperView();
    return false;
  }

  const travelTime = getTravelTimeForPathLength(movePath.length);
  const firstMovePoint = movePath.points[1] || movePath.points[0];

  camper.target = target;
  camper.actionAfterArrival = actionAfterArrival;
  camper.currentAction = actionName;
  camper.interactionTargetId = interactionTargetId;
  camper.state = "moving";
  camper.pose = moveOptions.carryingWood ? "carryingWood" : "walking";
  camper.facing = getMovementFacing(sceneXToPercent(movePath.points[0].x), sceneXToPercent(firstMovePoint.x));
  camper.animationStartedAt = now;
  camper.pathPoints = movePath.points;
  camper.pathSegmentLengths = movePath.segmentLengths;
  camper.pathLength = movePath.length;
  camper.pathDurationMs = travelTime * 1000;
  camper.pathStartedAt = now;
  camper.actionTimer = now + camper.pathDurationMs;

  updateCamperPathMotion(now);
  updateCamperView();
  requestCamperMotionFrame();
  return true;
}

function startActing(action, durationSeconds) {
  const now = Date.now();
  const actionTarget = camper.target;

  camper.state = "acting";
  camper.currentAction = action;
  camper.actionAfterArrival = null;
  camper.target = null;
  camper.interactionTargetId = getInteractionTargetId(actionTarget);
  camper.pose = getPoseForAction(action);
  camper.facing = getFacingForAction(action, actionTarget);
  camper.animationStartedAt = now;
  camper.actionTimer = now + durationSeconds * 1000;
  camper.pathPoints = [];
  camper.pathSegmentLengths = [];
  camper.pathLength = 0;
  camper.pathDurationMs = 0;
  camper.pathStartedAt = 0;

  updateCamperView();
}

function getPoseForAction(action) {
  if (action === "sittingByFire") {
    return "sittingGround";
  }

  if (action === "sittingOnFurniture" || action === "sittingOnChair") {
    return "sittingChair";
  }

  if (action === "resting") {
    return "resting";
  }

  if (action === "tentRest") {
    return "tentRest";
  }

  if (action === "lookingAtLake") {
    return "lookingLakeBack";
  }

  if (action === "addingWoodToFire") {
    return "addingWoodToFire";
  }

  return "idle";
}

function updateCamperView() {
  setStyleValue(camperElement, "left", sceneXFromPercent(camper.x) + "px");
  setStyleValue(camperElement, "top", sceneYFromPercent(camper.y) + "px");
  updateCamperDepth();
  updateCamperSprite();
  updateCamperAttachments();
  updateCamperThought();
  camperStateText.textContent = camperActionLabels[camper.currentAction] || camperActionLabels.idle;

  document.body.classList.toggle("camper-in-tent", camper.pose === "tentRest" && hasNightUnlock());
  updateSceneOcclusion();
}

function getRandomCamperThought(action) {
  const personality = getActiveCamperPersonality();
  const genericThoughts = camperThoughtLines[action] || [];
  const personalityThoughts = personality && personality.bubbles ? personality.bubbles[action] || [] : [];
  const shouldUsePersonalityThought = personalityThoughts.length > 0 && Math.random() < 0.65;
  const thoughts = shouldUsePersonalityThought ? personalityThoughts : genericThoughts;

  if (!Array.isArray(thoughts) || thoughts.length === 0) {
    return "";
  }

  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

function getCamperThoughtText(action) {
  if (camperThoughtAction !== action) {
    camperThoughtAction = action;
    camperThoughtText = getRandomCamperThought(action);
  }

  return camperThoughtText;
}

function updateCamperThoughtPosition() {
  if (!sceneContent || !camperThoughtBubble) {
    return;
  }

  const contentRect = sceneContent.getBoundingClientRect();
  const camperRect = camperElement.getBoundingClientRect();
  const scaleX = contentRect.width / BASE_SCENE_WIDTH;
  const scaleY = contentRect.height / BASE_SCENE_HEIGHT;
  const thoughtAnchor = CAMPER_THOUGHT_RECTS[camper.pose] || CAMPER_THOUGHT_RECTS.default;

  if (scaleX <= 0 || scaleY <= 0 || camperRect.width <= 0 || camperRect.height <= 0) {
    camperThoughtBubble.style.left = sceneXFromPercent(camper.x) + "px";
    camperThoughtBubble.style.top = sceneYFromPercent(Math.max(8, camper.y - 8)) + "px";
    return;
  }

  const bubbleGapPx = 14;
  const anchorClientX = camperRect.left + camperRect.width * thoughtAnchor.ratioX;
  const anchorClientY = camperRect.top + camperRect.height * thoughtAnchor.ratioY - bubbleGapPx;
  const sceneX = clamp((anchorClientX - contentRect.left) / scaleX, 24, BASE_SCENE_WIDTH - 24);
  const sceneY = clamp((anchorClientY - contentRect.top) / scaleY, 24, BASE_SCENE_HEIGHT - 24);

  camperThoughtBubble.style.left = sceneX + "px";
  camperThoughtBubble.style.top = sceneY + "px";
}

function updateCamperThought() {
  const thought = getCamperThoughtText(camper.currentAction);
  const shouldShowThought = !isBuildModeActive() && !gameState.gatherWoodMode && thought;

  camperThoughtBubble.textContent = shouldShowThought ? thought : "";
  updateCamperThoughtPosition();
  camperThoughtBubble.classList.toggle("show", Boolean(shouldShowThought));
}

function updateCamperSprite() {
  const frameName = getCamperFrameNameForPose();
  const appearance = camperProfileActive && camperProfileDraftAppearance ? camperProfileDraftAppearance : getActiveCamperAppearance();
  const className = "camper asset-object " + camper.state + " " + camper.pose;
  setStyleProperty(camperElement, "--object-scale-x", normalizeFacing(camper.facing) === "left" ? "-1" : "1");

  renderCamperLayerStack(camperElement, appearance, frameName);

  setElementClassName(camperElement, className);
}

function chooseNextCamperAction() {
  if (isBuildModeActive() || camperProfileActive || !hasCamperProfile(gameState)) {
    return;
  }

  if (beginNextQueuedAction()) {
    return;
  }

  if (gameState.gatherWoodMode && woodItems.length > 0) {
    if (startAutoWoodCollection()) {
      return;
    }
  }

  if (gameState.gatherWoodMode) {
    const wanderPoint = getRandomWanderPoint();
    startMovingTo(wanderPoint, "wandering", { labelAction: "wandering" });
    setStatus(woodItems.length > 0 ? "The camper is looking for a clear path to branches." : "The camper is searching for fallen branches.");
    return;
  }

  chooseRelaxingAction();
}

function chooseWeightedAction(actionEntries) {
  const totalWeight = actionEntries.reduce(function(total, entry) {
    return total + Math.max(0, Number(entry.weight) || 0);
  }, 0);
  let roll = Math.random() * Math.max(totalWeight, 1);

  for (let index = 0; index < actionEntries.length; index += 1) {
    roll -= Math.max(0, Number(actionEntries[index].weight) || 0);

    if (roll <= 0) {
      return actionEntries[index].id;
    }
  }

  return actionEntries.length > 0 ? actionEntries[actionEntries.length - 1].id : "wandering";
}

function getRandomObservableGearTarget() {
  const candidates = getGearItems().filter(function(item) {
    return item &&
      item.scene &&
      item.id !== "campfire" &&
      isGearVisibleInScene(item) &&
      (isGearPlaced(item.id) || isEquippableGear(item) && getEquippedGearId(item.category) === item.id);
  });

  if (candidates.length === 0) {
    return null;
  }

  const item = candidates[Math.floor(Math.random() * candidates.length)];
  const position = getDisplayedGearScenePosition(item);

  if (!position) {
    return null;
  }

  return {
    x: clamp(sceneXToPercent(position.x) + randomBetween(-4, 4), 16, 76),
    y: clamp(sceneYToPercent(position.y) + 2, 62, 86),
    interactionTargetId: item.id,
    ignoreObstacleId: item.id
  };
}

function getRelaxingActionEntries() {
  const personality = getActiveCamperPersonality();
  const bonuses = personality && personality.idleWeights ? personality.idleWeights : {};
  const nightBonuses = gameState.isNight && personality && personality.nightWeights ? personality.nightWeights : {};
  const entries = [
    { id: "wandering", weight: 4 },
    { id: "lookingAtLake", weight: 4 },
    { id: "sittingByFire", weight: 4 },
    { id: "resting", weight: 3 },
    { id: "tentRest", weight: 3 }
  ];

  if (getAvailableSeatableFurnitureEntries().length > 0) {
    entries.push({ id: "sittingOnFurniture", weight: 4 });
  }

  if (getRandomObservableGearTarget()) {
    entries.push({ id: "observingGear", weight: 2 });
  }

  return entries.map(function(entry) {
    return {
      id: entry.id,
      weight: entry.weight + (Number(bonuses[entry.id]) || 0) + (Number(nightBonuses[entry.id]) || 0)
    };
  });
}

function chooseRelaxingAction() {
  const action = chooseWeightedAction(getRelaxingActionEntries());

  if (action === "lookingAtLake") {
    startMovingTo(campSpots.lake, "lookingAtLake");
  } else if (action === "sittingByFire") {
    startMovingToFire("sittingByFire");
  } else if (action === "sittingOnFurniture") {
    const seatTarget = getRandomSeatableSeatTarget();

    if (seatTarget) {
      startMovingTo(seatTarget, "sittingOnFurniture");
    } else {
      startMovingTo(getRandomWanderPoint(), "wandering", { labelAction: "wandering" });
    }
  } else if (action === "observingGear") {
    const gearTarget = getRandomObservableGearTarget();

    if (gearTarget) {
      startMovingTo(gearTarget, "observingGear");
    } else {
      startMovingTo(getRandomWanderPoint(), "wandering", { labelAction: "wandering" });
    }
  } else if (action === "tentRest") {
    startMovingTo(getTentRestSpot(), "tentRest");
  } else if (action === "resting") {
    startMovingTo(campSpots.rest, "resting");
  } else {
    const wanderPoint = getRandomWanderPoint();
    startMovingTo(wanderPoint, "wandering", { labelAction: "wandering" });
  }

  updateCamperThought();
}

function getRandomWanderPoint() {
  return {
    x: randomBetween(18, 64),
    y: randomBetween(68, 80)
  };
}

function withIgnoredObstacle(point, item) {
  if (!point || !item) {
    return point;
  }

  return Object.assign({}, point, {
    ignoreObstacleId: item.id
  });
}

function getTentRestSpotForItem(tentItem) {
  const tentRest = tentItem && tentItem.interactions ? tentItem.interactions.tentRest : null;
  const layout = getDisplayedGearLayoutOverride(tentItem);

  if (tentItem && tentRest && tentRest.point) {
    return withIgnoredObstacle(scenePointToPercent(getScenePointFromAssetPoint(tentItem, tentRest.point, layout)), tentItem);
  }

  const displayedPosition = getDisplayedGearScenePosition(tentItem);

  if (displayedPosition) {
    return withIgnoredObstacle(scenePointToPercent(displayedPosition), tentItem);
  }

  if (tentRest && tentRest.position) {
    return withIgnoredObstacle(tentRest.position, tentItem);
  }

  if (tentItem && tentItem.scene) {
    return withIgnoredObstacle(getScenePercentPosition(tentItem.scene, layout), tentItem);
  }

  return campSpots.tent;
}

function getTentRestSpot() {
  return getTentRestSpotForItem(getEquippedGearItem("tent"));
}

function executeQueuedTentAction(action) {
  const item = getGearItem(action.targetId);

  if (!item || !isGearVisibleInScene(item) || !isGearQueueInteractive(item)) {
    completeActiveQueuedAction();
    return;
  }

  if (!startMovingTo(getTentRestSpotForItem(item), "tentRest")) {
    setStatus("No clear path to " + item.displayName + ".");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads into " + item.displayName + ".");
}

function executeQueuedFireAction() {
  if (!startMovingToFire("sittingByFire")) {
    setStatus("No clear path to the campfire.");
    completeActiveQueuedAction();
    return;
  }

  setStatus("The camper heads closer to the campfire.");
}

function updateCamperAI() {
  if (camperProfileActive || !hasCamperProfile(gameState)) {
    campfireFlameImage.src = getCurrentFlameImage();
    return;
  }

  if (isBuildModeActive()) {
    campfireFlameImage.src = getCurrentFlameImage();
    return;
  }

  updateCamperPathMotion(Date.now());
  updateCamperSprite();
  campfireFlameImage.src = getCurrentFlameImage();

  if (Date.now() < camper.actionTimer) {
    return;
  }

  if (camper.state === "moving") {
    arriveAtTarget();
    return;
  }

  if (camper.state === "acting") {
    finishCurrentAction();
    return;
  }

  if (beginNextQueuedAction()) {
    return;
  }

  chooseNextCamperAction();
}

function arriveAtTarget() {
  const action = camper.actionAfterArrival;

  hideActiveQueuedActionIndicator();

  if (action === "pickupWood") {
    pickupTargetWood();
    return;
  }

  if (action === "addingWoodToFire") {
    startActing("addingWoodToFire", 0.9);
    return;
  }

  if (action === "wandering") {
    startActing("wandering", 1.2);
    return;
  }

  if (action === "lookingAtLake") {
    startActing("lookingAtLake", 4);
    return;
  }

  if (action === "sittingByFire") {
    startActing("sittingByFire", 4);
    return;
  }

  if (action === "sittingOnFurniture" || action === "sittingOnChair") {
    startActing(action, 5);
    return;
  }

  if (action === "observingGear") {
    startActing("observingGear", 3.4);
    return;
  }

  if (action === "tentRest") {
    startActing("tentRest", 5);
    return;
  }

  if (action === "resting") {
    startActing("resting", 4);
    return;
  }

  startActing("idle", 1);
}

function finishCurrentAction() {
  if (camper.currentAction === "pickupWood") {
    if (!startMovingToFire(
      "addingWoodToFire",
      { carryingWood: true, labelAction: "carryingWoodToFire" }
    )) {
      camper.carryingWood = false;
      camper.woodCollectionSource = null;
      setStatus("No clear path to the campfire.");

      if (activeQueuedAction) {
        completeActiveQueuedAction();
      } else {
        chooseNextCamperAction();
      }
    }

    return;
  }

  if (camper.currentAction === "addingWoodToFire") {
    const source = camper.woodCollectionSource === "manual" ? "manual" : "auto";

    camper.carryingWood = false;
    camper.woodCollectionSource = null;
    addWarmthFromBranches(source);

    if (activeQueuedAction) {
      completeActiveQueuedAction();
    } else {
      chooseNextCamperAction();
    }

    return;
  }

  if (activeQueuedAction) {
    completeActiveQueuedAction();
    return;
  }

  chooseNextCamperAction();
}

function pickupTargetWood() {
  const wood = woodItems.find(function(item) {
    return item.id === camper.targetWoodId;
  });

  if (!wood) {
    if (activeQueuedAction) {
      completeActiveQueuedAction();
    } else {
      chooseNextCamperAction();
    }
    return;
  }

  removeWoodItem(wood.id);
  setTargetWood(null);
  camper.carryingWood = true;
  startActing("pickupWood", 0.55);
}

function gameTick() {
  if (camperProfileActive || !hasCamperProfile(gameState)) {
    updateScreen();
    return;
  }

  if (gameState.warmthSeconds > 0) {
    const cozyGain = getCozyPointsPerSecond();
    gameState.cozyPoints += cozyGain;
    gameState.warmthSeconds -= getWarmthBurnRate();
    gameState.warmthSeconds += getWarmthAutoRestore();
    gameState.warmthSeconds = Math.max(0, gameState.warmthSeconds);

    showCozyGain(cozyGain);
  }

  updateScreen();
  saveGame();
}

function showCozyGain(amount) {
  showFloatingGain(amount);
  createCozySpark();
}

function showFloatingGain(amount) {
  const gainText = document.createElement("span");
  gainText.className = "gain-pop";
  gainText.textContent = "+" + formatNumber(amount);
  cozyGainLayer.appendChild(gainText);

  setTimeout(function() {
    gainText.remove();
  }, 1000);
}

function createCozySpark() {
  const fireRect = campfire.getBoundingClientRect();
  const targetRect = cozyPointStatus.getBoundingClientRect();

  if (fireRect.width === 0 || targetRect.width === 0) {
    return;
  }

  const startX = fireRect.left + fireRect.width / 2;
  const startY = fireRect.top + fireRect.height / 3;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  const spark = document.createElement("img");

  spark.className = "cozy-spark";
  spark.src = assetPaths.campfire.spark;
  spark.alt = "";
  spark.style.setProperty("--spark-start-x", startX + "px");
  spark.style.setProperty("--spark-start-y", startY + "px");
  spark.style.setProperty("--spark-move-x", targetX - startX + "px");
  spark.style.setProperty("--spark-move-y", targetY - startY + "px");
  document.body.appendChild(spark);

  setTimeout(function() {
    spark.remove();
  }, 900);
}

shopToggle.addEventListener("click", toggleShop);
closeShopButton.addEventListener("click", closeShop);
shopBackdrop.addEventListener("click", closeShop);
campScene.addEventListener("click", handleCampSceneClick);
if (sceneContent) {
  sceneContent.addEventListener("pointerdown", handleBuildScenePointerDown);
}
gatherWoodToggle.addEventListener("click", toggleGatherWoodMode);
dayNightToggle.addEventListener("click", toggleDayNight);
if (buildModeToggle) {
  buildModeToggle.addEventListener("click", toggleBuildMode);
}
uiDisplayToggle.addEventListener("click", toggleUiDisplayMode);
if (camperProfileButton) {
  camperProfileButton.addEventListener("click", function() {
    if (hasCamperProfile(gameState)) {
      startCamperProfileFlow("card");
    } else {
      startCamperProfileFlow("required");
    }
  });
}
onboardingHelpButton.addEventListener("click", function() {
  startOnboarding(true);
});
onboardingPrimaryButton.addEventListener("click", advanceOnboarding);
onboardingSkipButton.addEventListener("click", function() {
  completeOnboarding(true);
});
if (camperNameInput) {
  camperNameInput.addEventListener("input", updateCamperProfileView);
  camperNameInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      advanceCamperProfileFlow();
    }
  });
}
if (camperProfilePrimaryButton) {
  camperProfilePrimaryButton.addEventListener("click", advanceCamperProfileFlow);
}
if (camperProfileSecondaryButton) {
  camperProfileSecondaryButton.addEventListener("click", handleCamperProfileSecondaryAction);
}
if (camperCardCloseButton) {
  camperCardCloseButton.addEventListener("click", closeCamperCardAndResume);
}
if (camperNameEditButton) {
  camperNameEditButton.addEventListener("click", editActiveCamperName);
}
if (camperNameEditInput) {
  camperNameEditInput.addEventListener("keydown", handleCamperCardInlineInputKeydown);
}
if (camperCatchphraseEditButton) {
  camperCatchphraseEditButton.addEventListener("click", editActiveCamperCatchphrase);
}
if (camperCatchphraseEditInput) {
  camperCatchphraseEditInput.addEventListener("keydown", handleCamperCardInlineInputKeydown);
}
if (camperRetakeQuizButton) {
  camperRetakeQuizButton.addEventListener("click", function() {
    startCamperProfileFlow("retakeQuiz");
  });
}
if (camperRecustomizeButton) {
  camperRecustomizeButton.addEventListener("click", function() {
    startCamperProfileFlow("appearanceOnly");
  });
}
resetSaveButton.addEventListener("click", confirmResetSave);

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", saveGame);
  window.addEventListener("pointermove", updateBuildDrag);
  window.addEventListener("pointerup", finishBuildDrag);
  window.addEventListener("pointercancel", finishBuildDrag);
  window.addEventListener("resize", function() {
    syncSceneScale();
    positionOnboardingLayer();
    refreshTargetOutlines();
    updateSceneOcclusion();
  });
}

syncSceneScale();
renderShopFromCatalog();
resetSaveIfRequestedByUrl();
loadGame();
spawnWood();
spawnWood();
setShopFilter("all");
applyUiDisplayMode();
updateScreen();
updateCamperView();
chooseNextCamperAction();
maybeStartOnboarding();

setInterval(gameTick, 1000);
setInterval(updateCamperAI, 400);
setInterval(updateCamperSprite, camperSpriteRefreshMs);
setInterval(function() {
  if (Math.random() < 0.7) {
    spawnWood();
  }
}, 3500);
