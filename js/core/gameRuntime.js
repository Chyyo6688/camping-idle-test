// Mutable runtime state, DOM references, and scene scale helpers.

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
  currentActivityId: "",
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
let forcedCamperThoughtText = "";
let forcedCamperThoughtUntil = 0;
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
let activityZoneLayer = null;
let testWeatherOverride = "";
let dailyCampDrawerExpanded = false;
let testDivinationOverride = null;
let selectedDivinationQuestionId = "overall";
let selectedDivinationMethod = "";
let turtleCastLines = [];
let turtleHoldTimer = null;
let turtleHoldTriggered = false;
let turtleCastPending = false;
let turtleCastPhase = "idle";
let turtlePendingLine = null;
let activeInventoryFishMenuId = "";
let koiReleaseCinematicTimer = null;

// UI and onboarding state formerly colocated with static content data.

let activeShopFilter = "all";
let statusToastTimer = null;
let welcomeToastTimer = null;
let saveWasResetFromUrl = false;
let loadedExistingSaveWithoutCamperProfile = false;

let onboardingActive = false;
let onboardingManual = false;
let activeGuideType = "onboarding";
let activeStandaloneGuideId = "";
let onboardingStepIndex = 0;
let onboardingHighlightedElement = null;
let onboardingCardFocusElement = null;
let onboardingLayoutResizeObserver = null;
let onboardingLayoutFrame = 0;
let campfireUpgradeInFlight = false;
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

// These variables connect JavaScript to the HTML.
const cozyPointsAmount = document.getElementById("cozyPointsAmount");
const comfortAmount = document.getElementById("comfortAmount");
const warmthSecondsAmount = document.getElementById("warmthSecondsAmount");
const cozyPointStatus = document.getElementById("cozyPointStatus");
const comfortStatus = comfortAmount.closest(".resource-pill");
const warmthStatus = warmthSecondsAmount.closest(".resource-pill");
const cozyGainLayer = document.getElementById("cozyGainLayer");
const welcomeMessage = document.getElementById("welcomeMessage");
const gameShell = document.querySelector(".game-shell");
const gameViewport = document.querySelector(".game-viewport");
const campScene = document.getElementById("campScene");
const sceneBackground = document.getElementById("sceneBackground");
const treelineImage = document.getElementById("treelineImage");
const lakeImage = document.getElementById("lakeImage");
const weatherLayer = document.getElementById("weatherLayer");
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
const inventoryLayer = document.getElementById("inventoryLayer");
const inventoryPanel = document.getElementById("inventoryPanel");
const inventoryCloseButton = document.getElementById("inventoryCloseButton");
const inventoryFishList = document.getElementById("inventoryFishList");
const inventoryMealList = document.getElementById("inventoryMealList");
const inventoryIngredientList = document.getElementById("inventoryIngredientList");
const inventoryStatsLine = document.getElementById("inventoryStatsLine");
const inventoryFishMenu = document.getElementById("inventoryFishMenu");
const coolerFullHint = document.getElementById("coolerFullHint");
const koiReleaseCinematic = document.getElementById("koiReleaseCinematic");
const koiReleaseVideo = document.getElementById("koiReleaseVideo");
const soundJournalButton = document.getElementById("soundJournalButton");
const soundJournalLayer = document.getElementById("soundJournalLayer");
const soundJournalPanel = document.getElementById("soundJournalPanel");
const soundJournalCloseButton = document.getElementById("soundJournalCloseButton");
const soundJournalList = document.getElementById("soundJournalList");
const soundMasterToggle = document.getElementById("soundMasterToggle");
const soundVolumeSlider = document.getElementById("soundVolumeSlider");
const settingsLayer = document.getElementById("settingsLayer");
const settingsPanel = document.getElementById("settingsPanel");
const settingsCloseButton = document.getElementById("settingsCloseButton");
const settingsTutorialToggle = document.getElementById("settingsTutorialToggle");
const settingsTutorialList = document.getElementById("settingsTutorialList");
const settingsResetItem = document.getElementById("settingsResetItem");
const resetSaveButton = document.getElementById("resetSaveButton");
const campfireLevelAmount = document.getElementById("campfireLevelAmount");
const cozyRateAmount = document.getElementById("cozyRateAmount");
const offlineCapAmount = document.getElementById("offlineCapAmount");
const statusLine = document.getElementById("statusLine");
const dailyCampCard = document.getElementById("dailyCampCard");
const dailyCampBackdrop = document.getElementById("dailyCampBackdrop");
const dailyCampDrawerToggle = document.getElementById("dailyCampDrawerToggle");
const dailyCampDrawerPanel = document.getElementById("dailyCampDrawerPanel");
const dailyCampDrawerChevron = document.getElementById("dailyCampDrawerChevron");
const dailyWeatherTabIcon = document.getElementById("dailyWeatherTabIcon");
const dailyWeatherIcon = document.getElementById("dailyWeatherIcon");
const dailyWeatherLabel = document.getElementById("dailyWeatherLabel");
const dailyCampMood = document.getElementById("dailyCampMood");
const dailyCampActivities = document.getElementById("dailyCampActivities");
const dailySoundRecommendation = document.getElementById("dailySoundRecommendation");
const divinationButton = document.getElementById("divinationButton");
const divinationLayer = document.getElementById("divinationLayer");
const divinationPanel = document.getElementById("divinationPanel");
const divinationCloseButton = document.getElementById("divinationCloseButton");
const divinationIntro = document.getElementById("divinationIntro");
const divinationQuestionList = document.getElementById("divinationQuestionList");
const divinationMethodList = document.getElementById("divinationMethodList");
const divinationStage = document.getElementById("divinationStage");
const divinationCardVisual = document.getElementById("divinationCardVisual");
const divinationCardBack = document.getElementById("divinationCardBack");
const turtleCoinVisual = document.getElementById("turtleCoinVisual");
const turtleShellButton = document.getElementById("turtleShellButton");
const turtleShellImage = document.getElementById("turtleShellImage");
const turtleCoinTray = document.getElementById("turtleCoinTray");
const turtleCastReadout = document.getElementById("turtleCastReadout");
const turtleLineStack = document.getElementById("turtleLineStack");
const divinationActionButton = document.getElementById("divinationActionButton");
const divinationResult = document.getElementById("divinationResult");
const divinationResultQuestion = document.getElementById("divinationResultQuestion");
const divinationResultTop = document.getElementById("divinationResultTop");
const divinationResultTitle = document.getElementById("divinationResultTitle");
const divinationResultSubtitle = document.getElementById("divinationResultSubtitle");
const divinationTarotResultBody = document.getElementById("divinationTarotResultBody");
const divinationTurtleResultBody = document.getElementById("divinationTurtleResultBody");
const divinationResultImage = document.getElementById("divinationResultImage");
const divinationResultLines = document.getElementById("divinationResultLines");
const divinationResultKeywords = document.getElementById("divinationResultKeywords");
const divinationResultBasis = document.getElementById("divinationResultBasis");
const divinationResultReality = document.getElementById("divinationResultReality");
const divinationResultAdvice = document.getElementById("divinationResultAdvice");
const divinationResultCamp = document.getElementById("divinationResultCamp");
const divinationTurtleFortune = document.getElementById("divinationTurtleFortune");
const divinationTurtlePrimaryName = document.getElementById("divinationTurtlePrimaryName");
const divinationTurtleMovingCount = document.getElementById("divinationTurtleMovingCount");
const divinationTurtleKeywords = document.getElementById("divinationTurtleKeywords");
const divinationTurtleSummary = document.getElementById("divinationTurtleSummary");
const divinationTurtleInterpretation = document.getElementById("divinationTurtleInterpretation");
const divinationTurtleGoodFor = document.getElementById("divinationTurtleGoodFor");
const divinationTurtleAvoid = document.getElementById("divinationTurtleAvoid");
const divinationTurtleConclusion = document.getElementById("divinationTurtleConclusion");
const divinationTurtleDetails = document.getElementById("divinationTurtleDetails");
const divinationResultJudgments = document.getElementById("divinationResultJudgments");
const divinationResultCastDetails = document.getElementById("divinationResultCastDetails");
const divinationResultLineDetails = document.getElementById("divinationResultLineDetails");
const divinationResultDetailReading = document.getElementById("divinationResultDetailReading");

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

function syncGameDisplayScale() {
  if (!gameShell || !gameViewport) {
    return;
  }

  const shellStyle = window.getComputedStyle(gameShell);
  const safeAreaTop = Number.parseFloat(shellStyle.paddingTop) || 0;
  const safeAreaRight = Number.parseFloat(shellStyle.paddingRight) || 0;
  const safeAreaBottom = Number.parseFloat(shellStyle.paddingBottom) || 0;
  const safeAreaLeft = Number.parseFloat(shellStyle.paddingLeft) || 0;
  const safeAreaWidth = safeAreaLeft + safeAreaRight;
  const safeAreaHeight = safeAreaTop + safeAreaBottom;
  const visualWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const visualHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const availableWidth = Math.max(0, Math.min(gameShell.clientWidth, visualWidth) - safeAreaWidth);
  const availableHeight = Math.max(0, Math.min(gameShell.clientHeight, visualHeight) - safeAreaHeight);
  const scale = Math.min(availableWidth / 540, availableHeight / 960, 1);

  setStyleProperty(gameShell, "--game-display-offset-x", (safeAreaLeft - safeAreaRight) / 2 + "px");
  setStyleProperty(gameShell, "--game-display-offset-y", (safeAreaTop - safeAreaBottom) / 2 + "px");
  setStyleProperty(gameViewport, "--game-display-scale", Number.isFinite(scale) && scale > 0 ? scale : 1);
}

function syncSceneScale() {
  if (!campScene || !sceneContent) {
    return;
  }

  const scale = Math.min(
    campScene.clientWidth / BASE_SCENE_WIDTH,
    campScene.clientHeight / BASE_SCENE_HEIGHT
  );

  setStyleProperty(sceneContent, "--scene-scale", Number.isFinite(scale) && scale > 0 ? scale : 1);
}

// These are points in the scene. The camper walks between them.
