(function(global) {
  const GEAR_CATEGORIES = [
    "vehicle",
    "tent",
    "tarp",
    "chair",
    "table",
    "stove",
    "cooler",
    "light",
    "storage",
    "fire",
    "activity",
    "sleepingGear"
  ];

  const SHOP_GROUPS = {
    fire: {
      label: "Fire",
      icon: "assets/ui/icon_fire.png",
      categories: ["fire"],
      visible: true
    },
    shelter: {
      label: "Shelter",
      icon: "assets/ui/icon_tent.png",
      categories: ["vehicle", "tent", "tarp"],
      visible: true
    },
    living: {
      label: "Living",
      icon: "assets/ui/icon_furniture.png",
      categories: ["chair", "table", "storage"],
      visible: true
    },
    kitchen: {
      label: "Kitchen",
      icon: "assets/ui/icon_tools.png",
      categories: ["stove", "cooler"],
      visible: true
    },
    light: {
      label: "Light",
      icon: "assets/ui/icon_lighting.png",
      categories: ["light"],
      visible: true
    },
    activity: {
      label: "Activity",
      icon: "assets/ui/icon_tools.png",
      categories: ["activity"],
      visible: true
    },
    sleepingGear: {
      label: "Sleep",
      icon: "assets/ui/icon_tent.png",
      categories: ["sleepingGear"],
      visible: false
    }
  };

  const LEGACY_GEAR_ID_MAP = {
    basic: "starterInstantTent",
    backpacking: "starterInstantTent",
    dome: "smallDomeTent",
    lowDome: "smallDomeTent",
    vestibule: "LakeLockLivingShelter",
    chair: "sealChair",
    table: "checkerboardTable",
    kettle: "homeCampBurner",
    axe: "firewoodPile",
    stove: "homeCampBurner",
    lantern: "basicCampLantern",
    stringLights: "warmStringLights"
  };

  function imagePath(category, id, extension) {
    return "assets/gear/" + category + "/" + id + "/icon." + (extension || "svg");
  }

  function layerPath(category, id, name, extension) {
    return "assets/gear/" + category + "/" + id + "/" + name + "." + (extension || "svg");
  }

  const SPRITE_SIZES = {
    compactCampSuv: { width: 160, height: 96 },
    creamCampVan: { width: 176, height: 104 },
    campWagonCar: { width: 160, height: 96 },
    campPickupTruck: { width: 176, height: 104 },
    tinyCampVan: { width: 160, height: 96 },
    nokaVillageCabinTent: { width: 144, height: 104 },
    BetaBreezeTent: { width: 144, height: 104 },
    LakeNestDomeTent: { width: 128, height: 100 },
    LakeLockLivingShelter: { width: 176, height: 128 },
    starterInstantTent: { width: 128, height: 100 },
    rooftopTent: { width: 120, height: 72 },
    smallDomeTent: { width: 128, height: 100 },
    pentaMiniTarp: { width: 128, height: 96 },
    hexaCampTarp: { width: 144, height: 104 },
    largeLivingTarp: { width: 176, height: 120 },
    vehicleAwning: { width: 136, height: 96 },
    sealChair: { width: 80, height: 80 },
    nokaMoonChair: { width: 80, height: 80 },
    redDirectorChair: { width: 80, height: 80 },
    tripleCampSofa: { width: 128, height: 80 },
    inflatableLoungeChair: { width: 112, height: 96 },
    lowCampChair: { width: 80, height: 80 },
    checkerboardTable: { width: 96, height: 70 },
    entryIgtTable: { width: 96, height: 70 },
    igtSlimTable: { width: 96, height: 70 },
    igtFourUnitTable: { width: 128, height: 80 },
    igtCampKitchenSet: { width: 128, height: 96 },
    foldingPrepTable: { width: 96, height: 70 },
    homeCampBurner: { width: 76, height: 66 },
    flatBurner: { width: 76, height: 66 },
    gigaPowerStove: { width: 76, height: 66 },
    gigaPowerLiStove: { width: 76, height: 66 },
    grillBurner: { width: 96, height: 70 },
    smallSoftCooler: { width: 80, height: 64 },
    campCoolerBox: { width: 96, height: 70 },
    systemCoolerBag: { width: 80, height: 64 },
    basicCampLantern: { width: 64, height: 84 },
    starterHeadlamp: { width: 48, height: 40 },
    warmStringLights: { width: 160, height: 60 },
    hozukiLantern: { width: 64, height: 84 },
    miniHozukiLantern: { width: 64, height: 84 },
    lanternPoleLight: { width: 80, height: 120 },
    stackingShelfContainer25: { width: 80, height: 80 },
    stackingShelfContainer50: { width: 96, height: 70 },
    stackedShelfContainerSet: { width: 112, height: 96 },
    canvasGearBag: { width: 80, height: 64 },
    kitchenCarryCase: { width: 80, height: 64 },
    firewoodPile: { width: 110, height: 70 },
    fishingRod: { width: 96, height: 96 },
    campBoardGame: { width: 80, height: 64 },
    campGuitar: { width: 80, height: 96 },
    binoculars: { width: 64, height: 48 },
    cameraTripod: { width: 80, height: 100 }
  };

  function getSpriteSize(id) {
    return SPRITE_SIZES[id] || { width: 80, height: 80 };
  }

  function headlampPath(name) {
    return "assets/gear/light/starterHeadlamp/" + name + ".png";
  }

  function scene(position, widthPercent, zIndex, extra) {
    return Object.assign({
      position: position,
      widthPercent: widthPercent,
      zIndex: zIndex || 20,
      layers: { base: null }
    }, extra || {});
  }

  function gear(item) {
    const normalizedItem = Object.assign({
      cost: 0,
      comfort: 0,
      detail: "",
      image: imagePath(item.category, item.id),
      scene: null,
      unlocks: {},
      requires: {},
      interactions: {},
      anchors: {}
    }, item);
    normalizedItem.spriteSize = normalizedItem.spriteSize || getSpriteSize(normalizedItem.id);

    if (normalizedItem.scene) {
      const spriteSize = normalizedItem.scene.spriteSize || normalizedItem.spriteSize;
      const groundAnchor = normalizedItem.anchors && normalizedItem.anchors.ground;
      normalizedItem.scene.spriteSize = spriteSize;
      normalizedItem.scene.anchor = normalizedItem.scene.anchor || groundAnchor || { x: spriteSize.width / 2, y: spriteSize.height };
    }

    return normalizedItem;
  }

  const GEAR_ITEMS = [
    gear({
      id: "compactCampSuv",
      category: "vehicle",
      shopGroup: "shelter",
      displayName: "小型SUV",
      cost: 220,
      comfort: 6,
      detail: "+6 Comfort",
      image: imagePath("vehicle", "compactCampSuv", "png"),
      scene: scene({ x: 73, y: 78.5 }, 25, 14, {
        roofMount: { x: 82, y: 31, widthPercent: 18.6, zIndex: 16 }
      })
    }),
    gear({
      id: "creamCampVan",
      category: "vehicle",
      shopGroup: "shelter",
      displayName: "奶油露营Van",
      cost: 360,
      comfort: 10,
      detail: "+10 Comfort",
      image: imagePath("vehicle", "creamCampVan", "png"),
      scene: scene({ x: 74, y: 78 }, 28, 14, {
        roofMount: { x: 88, y: 32, widthPercent: 20.6, zIndex: 16 }
      })
    }),
    gear({
      id: "campWagonCar",
      category: "vehicle",
      shopGroup: "shelter",
      displayName: "旅行车",
      cost: 310,
      comfort: 8,
      detail: "+8 Comfort",
      image: imagePath("vehicle", "campWagonCar", "png"),
      scene: scene({ x: 74, y: 78 }, 27, 14, {
        roofMount: { x: 80, y: 30, widthPercent: 19.8, zIndex: 16 }
      })
    }),
    gear({
      id: "campPickupTruck",
      category: "vehicle",
      shopGroup: "shelter",
      displayName: "皮卡露营车",
      cost: 420,
      comfort: 12,
      detail: "+12 Comfort",
      image: imagePath("vehicle", "campPickupTruck", "png"),
      scene: scene({ x: 73, y: 78.4 }, 30, 14, {
        roofMount: { x: 93, y: 29, widthPercent: 20.8, zIndex: 16 }
      })
    }),
    gear({
      id: "tinyCampVan",
      category: "vehicle",
      shopGroup: "shelter",
      displayName: "小面包车",
      cost: 260,
      comfort: 7,
      detail: "+7 Comfort",
      image: imagePath("vehicle", "tinyCampVan", "png"),
      scene: scene({ x: 74, y: 78.2 }, 25, 14, {
        roofMount: { x: 82, y: 31, widthPercent: 19.2, zIndex: 16 }
      })
    }),

    gear({
      id: "nokaVillageCabinTent",
      category: "tent",
      shopGroup: "shelter",
      displayName: "那客小屋帐",
      cost: 170,
      comfort: 18,
      detail: "+18 Comfort",
      image: imagePath("tent", "nokaVillageCabinTent", "png"),
      offlineBonusSeconds: 14400,
      scene: scene({ x: 54, y: 69.5 }, 33, 18),
      interactions: { tentRest: { position: { x: 54, y: 69.5 } } }
    }),
    gear({
      id: "BetaBreezeTent",
      category: "tent",
      shopGroup: "shelter",
      displayName: "贝塔清风帐",
      cost: 140,
      comfort: 15,
      detail: "+15 Comfort",
      image: imagePath("tent", "BetaBreezeTent", "png"),
      offlineBonusSeconds: 10800,
      scene: scene({ x: 54, y: 69.5 }, 32, 18),
      interactions: { tentRest: { position: { x: 54, y: 69.5 } } }
    }),
    gear({
      id: "LakeNestDomeTent",
      category: "tent",
      shopGroup: "shelter",
      displayName: "湖巢穹顶帐",
      cost: 130,
      comfort: 14,
      detail: "+14 Comfort",
      image: imagePath("tent", "LakeNestDomeTent", "png"),
      offlineBonusSeconds: 10800,
      scene: scene({ x: 54, y: 69.5 }, 32, 18),
      interactions: { tentRest: { position: { x: 54, y: 69.5 } } }
    }),
    gear({
      id: "LakeLockLivingShelter",
      category: "tent",
      shopGroup: "shelter",
      displayName: "湖巢客厅帐",
      cost: 150,
      comfort: 18,
      detail: "+18 Comfort",
      image: imagePath("tent", "LakeLockLivingShelter", "png"),
      offlineBonusSeconds: 14400,
      scene: scene({ x: 54, y: 69.5 }, 34, 18),
      interactions: { tentRest: { position: { x: 54, y: 69.5 } } }
    }),
    gear({
      id: "starterInstantTent",
      category: "tent",
      shopGroup: "shelter",
      displayName: "新手快搭帐",
      cost: 0,
      comfort: 4,
      detail: "+4 Comfort",
      image: imagePath("tent", "starterInstantTent", "png"),
      defaultOwned: true,
      defaultEquipped: true,
      offlineBonusSeconds: 1800,
      scene: scene({ x: 54, y: 69.5 }, 31, 18),
      interactions: { tentRest: { position: { x: 54, y: 69.5 } } }
    }),
    gear({
      id: "rooftopTent",
      category: "tent",
      shopGroup: "shelter",
      displayName: "车顶帐篷",
      cost: 210,
      comfort: 14,
      detail: "Requires Vehicle",
      image: imagePath("tent", "rooftopTent", "png"),
      offlineBonusSeconds: 10800,
      requires: { anyOwnedCategory: ["vehicle"] },
      scene: scene({ x: 74, y: 70 }, 19, 16, {
        anchor: { x: 60, y: 66 },
        mountTo: "vehicleRoof"
      }),
      interactions: { tentRest: { position: { x: 74, y: 70 } } }
    }),
    gear({
      id: "smallDomeTent",
      category: "tent",
      shopGroup: "shelter",
      displayName: "小型 Dome 帐篷",
      cost: 80,
      comfort: 10,
      detail: "+10 Comfort",
      image: imagePath("tent", "smallDomeTent", "png"),
      offlineBonusSeconds: 7200,
      scene: scene({ x: 54, y: 69.5 }, 31, 18),
      interactions: { tentRest: { position: { x: 54, y: 69.5 } } }
    }),

    gear({ id: "pentaMiniTarp", category: "tarp", shopGroup: "shelter", displayName: "小型 Penta 天幕", cost: 70, comfort: 4, detail: "+4 Comfort", image: imagePath("tarp", "pentaMiniTarp", "png"), scene: scene({ x: 31, y: 66 }, 25, 16) }),
    gear({ id: "hexaCampTarp", category: "tarp", shopGroup: "shelter", displayName: "中型 Hexa 天幕", cost: 110, comfort: 7, detail: "+7 Comfort", image: imagePath("tarp", "hexaCampTarp", "png"), scene: scene({ x: 48, y: 65.2 }, 31, 17) }),
    gear({ id: "largeLivingTarp", category: "tarp", shopGroup: "shelter", displayName: "大型客厅天幕", cost: 160, comfort: 10, detail: "+10 Comfort", image: imagePath("tarp", "largeLivingTarp", "png"), scene: scene({ x: 65, y: 65.8 }, 34, 18) }),
    gear({ id: "vehicleAwning", category: "tarp", shopGroup: "shelter", displayName: "车边天幕", cost: 130, comfort: 8, detail: "Requires Vehicle", image: imagePath("tarp", "vehicleAwning", "png"), requires: { anyOwnedCategory: ["vehicle"] }, scene: scene({ x: 79, y: 67 }, 29, 19) }),

    gear({
      id: "sealChair",
      category: "chair",
      shopGroup: "living",
      displayName: "海狗椅",
      cost: 55,
      comfort: 5,
      detail: "+5 Comfort",
      image: imagePath("chair", "sealChair", "png"),
      scene: scene({ x: 57, y: 79 }, 13.3, 22, {
        spriteSize: { width: 80, height: 80 },
        layers: { base: imagePath("chair", "sealChair", "png"), front: null },
        facing: "left",
        mirrored: false,
        frontZIndex: 31
      }),
      interactions: {
        seatable: {
          camperFacingMode: "sameAsFurniture",
          seatOffsets: {
            left: { x: 30, y: 80 },
            right: { x: 50, y: 80 }
          }
        }
      },
      anchors: { ground: { x: 40, y: 72 } }
    }),
    gear({ id: "nokaMoonChair", category: "chair", shopGroup: "living", displayName: "月亮椅", cost: 75, comfort: 6, detail: "+6 Comfort", image: imagePath("chair", "nokaMoonChair", "png"), scene: scene({ x: 66, y: 80.5 }, 12.5, 22, { facing: "left" }), interactions: { seatable: { camperFacingMode: "sameAsFurniture", seatOffsets: { left: { x: 30, y: 80 }, right: { x: 50, y: 80 } } } }, anchors: { ground: { x: 40, y: 72 } } }),
    gear({ id: "redDirectorChair", category: "chair", shopGroup: "living", displayName: "导演椅", cost: 90, comfort: 7, detail: "+7 Comfort", image: imagePath("chair", "redDirectorChair", "png"), scene: scene({ x: 75, y: 81 }, 12.2, 22, { facing: "left" }), interactions: { seatable: { camperFacingMode: "sameAsFurniture", seatOffsets: { left: { x: 30, y: 80 }, right: { x: 50, y: 80 } } } }, anchors: { ground: { x: 40, y: 72 } } }),
    gear({ id: "tripleCampSofa", category: "chair", shopGroup: "living", displayName: "三人沙发椅", cost: 150, comfort: 12, detail: "+12 Comfort", image: imagePath("chair", "tripleCampSofa", "png"), scene: scene({ x: 63, y: 83 }, 18, 23, { facing: "left" }), interactions: { seatable: { camperFacingMode: "sameAsFurniture", seatOffsets: { left: { x: 52, y: 80 }, right: { x: 80, y: 80 } } } }, anchors: { ground: { x: 66, y: 72 } } }),
    gear({ id: "inflatableLoungeChair", category: "chair", shopGroup: "living", displayName: "充气沙发椅", cost: 135, comfort: 11, detail: "+11 Comfort", image: imagePath("chair", "inflatableLoungeChair", "png"), scene: scene({ x: 81, y: 82.4 }, 16, 23, { facing: "left" }), interactions: { seatable: { camperFacingMode: "sameAsFurniture", seatOffsets: { left: { x: 42, y: 80 }, right: { x: 62, y: 80 } } } }, anchors: { ground: { x: 52, y: 72 } } }),
    gear({ id: "lowCampChair", category: "chair", shopGroup: "living", displayName: "低矮休闲椅", cost: 70, comfort: 6, detail: "+6 Comfort", image: imagePath("chair", "lowCampChair", "png"), scene: scene({ x: 49, y: 81 }, 11.5, 22, { facing: "left" }), interactions: { seatable: { camperFacingMode: "sameAsFurniture", seatOffsets: { left: { x: 30, y: 80 }, right: { x: 50, y: 80 } } } }, anchors: { ground: { x: 40, y: 72 } } }),

    gear({ id: "checkerboardTable", category: "table", shopGroup: "living", displayName: "棋盘桌", cost: 60, comfort: 6, detail: "+6 Comfort", image: imagePath("table", "checkerboardTable", "png"), scene: scene({ x: 39, y: 81 }, 14, 17) }),
    gear({ id: "entryIgtTable", category: "table", shopGroup: "living", displayName: "Entry IGT 桌", cost: 90, comfort: 7, detail: "+7 Comfort", image: imagePath("table", "entryIgtTable", "png"), scene: scene({ x: 50, y: 80.8 }, 14.5, 17) }),
    gear({ id: "igtSlimTable", category: "table", shopGroup: "living", displayName: "IGT Slim 木桌", cost: 120, comfort: 9, detail: "+9 Comfort", image: imagePath("table", "igtSlimTable", "png"), scene: scene({ x: 59, y: 80.4 }, 15, 17) }),
    gear({ id: "igtFourUnitTable", category: "table", shopGroup: "living", displayName: "四单元 IGT 桌", cost: 150, comfort: 11, detail: "+11 Comfort", image: imagePath("table", "igtFourUnitTable", "png"), scene: scene({ x: 70, y: 81.2 }, 18, 17) }),
    gear({ id: "igtCampKitchenSet", category: "table", shopGroup: "living", displayName: "IGT 厨房套装", cost: 190, comfort: 14, detail: "+14 Comfort", image: imagePath("table", "igtCampKitchenSet", "png"), scene: scene({ x: 48, y: 84 }, 20, 18) }),
    gear({ id: "foldingPrepTable", category: "table", shopGroup: "living", displayName: "折叠料理桌", cost: 80, comfort: 7, detail: "+7 Comfort", image: imagePath("table", "foldingPrepTable", "png"), scene: scene({ x: 31, y: 81.2 }, 14, 17) }),

    gear({ id: "homeCampBurner", category: "stove", shopGroup: "kitchen", displayName: "Home Camp 卡式炉", cost: 110, comfort: 5, detail: "Requires Table", image: imagePath("stove", "homeCampBurner", "png"), requires: { anyOwnedCategory: ["table"] }, scene: scene({ x: 39, y: 77.2 }, 6.8, 25) }),
    gear({ id: "flatBurner", category: "stove", shopGroup: "kitchen", displayName: "Flat Burner", cost: 120, comfort: 6, detail: "Requires Table", image: imagePath("stove", "flatBurner", "png"), requires: { anyOwnedCategory: ["table"] }, scene: scene({ x: 50, y: 77 }, 7.2, 25) }),
    gear({ id: "gigaPowerStove", category: "stove", shopGroup: "kitchen", displayName: "GigaPower 小炉头", cost: 80, comfort: 4, detail: "Requires Table", image: imagePath("stove", "gigaPowerStove", "png"), requires: { anyOwnedCategory: ["table"] }, scene: scene({ x: 58.5, y: 76.9 }, 6.4, 25) }),
    gear({ id: "gigaPowerLiStove", category: "stove", shopGroup: "kitchen", displayName: "GigaPower 大炉", cost: 105, comfort: 5, detail: "Requires Table", image: imagePath("stove", "gigaPowerLiStove", "png"), requires: { anyOwnedCategory: ["table"] }, scene: scene({ x: 67, y: 77.1 }, 7.1, 25) }),
    gear({ id: "grillBurner", category: "stove", shopGroup: "kitchen", displayName: "烤炉组件", cost: 145, comfort: 7, detail: "Requires Table", image: imagePath("stove", "grillBurner", "png"), requires: { anyOwnedCategory: ["table"] }, scene: scene({ x: 75, y: 77.4 }, 8.4, 25) }),

    gear({ id: "smallSoftCooler", category: "cooler", shopGroup: "kitchen", displayName: "小软冷包", cost: 55, comfort: 3, detail: "+3 Comfort", image: imagePath("cooler", "smallSoftCooler", "png"), scene: scene({ x: 34, y: 83.2 }, 8.8, 18) }),
    gear({ id: "campCoolerBox", category: "cooler", shopGroup: "kitchen", displayName: "中型冷藏箱", cost: 95, comfort: 5, detail: "+5 Comfort", image: imagePath("cooler", "campCoolerBox", "png"), scene: scene({ x: 42, y: 83.2 }, 11, 18) }),
    gear({ id: "systemCoolerBag", category: "cooler", shopGroup: "kitchen", displayName: "系统冷藏包", cost: 115, comfort: 6, detail: "+6 Comfort", image: imagePath("cooler", "systemCoolerBag", "png"), scene: scene({ x: 51, y: 83.1 }, 10, 18) }),

    gear({ id: "basicCampLantern", category: "light", shopGroup: "light", displayName: "简单营地灯", cost: 90, comfort: 6, detail: "Unlock Night", image: imagePath("light", "basicCampLantern", "png"), unlocks: { nightMode: true }, scene: scene({ x: 13.5, y: 78 }, 7.5, 23, { layers: { base: imagePath("light", "basicCampLantern", "png"), glow: layerPath("light", "basicCampLantern", "glow", "png") } }) }),
    gear({ id: "starterHeadlamp", category: "light", shopGroup: "light", displayName: "新手头灯", cost: 45, comfort: 2, detail: "Unlock Night", image: imagePath("light", "starterHeadlamp", "png"), unlocks: { nightMode: true }, autoPlaceOnBuy: true, attachment: { target: "camperHead", widthPercent: 3.1, backWidthPercent: 2.8, coneWidthPercent: 17, zIndex: 32, backZIndex: 29, coneZIndex: 31, layers: { front: headlampPath("headlamp-front"), back: headlampPath("headlamp-back"), cone: headlampPath("flashlight-cone") }, offsets: { right: { x: 1.05, y: -6.45, rotate: -6 }, left: { x: -1.05, y: -6.45, rotate: 6 }, back: { x: 0, y: -6.35, rotate: 0 } }, coneOffsets: { right: { x: 7.8, y: -6.1, rotate: -6 }, left: { x: -7.8, y: -6.1, rotate: 6 }, back: { x: 0, y: -11.2, rotate: -90 } } } }),
    gear({ id: "warmStringLights", category: "light", shopGroup: "light", displayName: "暖光串灯", cost: 140, comfort: 8, detail: "+8 Comfort", image: imagePath("light", "warmStringLights", "png"), unlocks: { nightMode: true }, scene: scene({ x: 54, y: 62.8 }, 24, 21, { aspectRatio: "160 / 60", layers: { glow: layerPath("light", "warmStringLights", "glow", "png"), base: imagePath("light", "warmStringLights", "png") } }) }),
    gear({ id: "hozukiLantern", category: "light", shopGroup: "light", displayName: "Hozuki 灯笼", cost: 130, comfort: 7, detail: "Unlock Night", image: imagePath("light", "hozukiLantern", "png"), unlocks: { nightMode: true }, scene: scene({ x: 22, y: 78.2 }, 7.8, 24) }),
    gear({ id: "miniHozukiLantern", category: "light", shopGroup: "light", displayName: "Mini Hozuki", cost: 95, comfort: 5, detail: "Unlock Night", image: imagePath("light", "miniHozukiLantern", "png"), unlocks: { nightMode: true }, scene: scene({ x: 29.5, y: 77.8 }, 6.3, 24) }),
    gear({ id: "lanternPoleLight", category: "light", shopGroup: "light", displayName: "灯杆营地灯", cost: 150, comfort: 8, detail: "Unlock Night", image: imagePath("light", "lanternPoleLight", "png"), unlocks: { nightMode: true }, scene: scene({ x: 18, y: 79 }, 9.2, 25, { anchor: { x: 40, y: 118 } }) }),

    gear({ id: "stackingShelfContainer25", category: "storage", shopGroup: "living", displayName: "Stacking Shelf 25", cost: 65, comfort: 3, detail: "+3 Comfort", image: imagePath("storage", "stackingShelfContainer25", "png"), scene: scene({ x: 8.5, y: 79 }, 9.5, 15) }),
    gear({ id: "stackingShelfContainer50", category: "storage", shopGroup: "living", displayName: "Stacking Shelf 50", cost: 80, comfort: 4, detail: "+4 Comfort", image: imagePath("storage", "stackingShelfContainer50", "png"), scene: scene({ x: 15.5, y: 78.5 }, 11.5, 15) }),
    gear({ id: "stackedShelfContainerSet", category: "storage", shopGroup: "living", displayName: "Stacked Shelf Set", cost: 120, comfort: 6, detail: "+6 Comfort", image: imagePath("storage", "stackedShelfContainerSet", "png"), scene: scene({ x: 25, y: 78.2 }, 13, 16) }),
    gear({ id: "canvasGearBag", category: "storage", shopGroup: "living", displayName: "Canvas Gear Bag", cost: 45, comfort: 2, detail: "+2 Comfort", image: imagePath("storage", "canvasGearBag", "png"), scene: scene({ x: 25, y: 83.5 }, 8.2, 17) }),
    gear({ id: "kitchenCarryCase", category: "storage", shopGroup: "living", displayName: "Kitchen Carry Case", cost: 60, comfort: 3, detail: "+3 Comfort", image: imagePath("storage", "kitchenCarryCase", "png"), scene: scene({ x: 57, y: 83.4 }, 8.4, 18) }),
    gear({ id: "firewoodPile", category: "storage", shopGroup: "living", displayName: "Firewood Pile", cost: 35, comfort: 1, detail: "+1 Comfort", image: imagePath("storage", "firewoodPile", "png"), scene: scene({ x: 19, y: 84 }, 18, 10) }),

    gear({
      id: "campfire",
      category: "fire",
      shopGroup: "fire",
      displayName: "Campfire",
      cost: 45,
      comfort: 0,
      detail: "Upgrade fire",
      image: "assets/campfire/campfire_lv1_base.png",
      defaultOwned: true,
      scene: scene({ x: 39, y: 79 }, 23.7, 26, { renderMode: "campfire" }),
      interactions: { upgradeCampfire: true }
    }),

    gear({ id: "fishingRod", category: "activity", shopGroup: "activity", displayName: "Fishing Rod", cost: 75, comfort: 3, detail: "+3 Comfort", image: imagePath("activity", "fishingRod", "png"), scene: scene({ x: 30, y: 70.5 }, 10, 16) }),
    gear({ id: "campBoardGame", category: "activity", shopGroup: "activity", displayName: "Camp Board Game", cost: 70, comfort: 4, detail: "+4 Comfort", image: imagePath("activity", "campBoardGame", "png"), scene: scene({ x: 57, y: 82.5 }, 7.2, 21) }),
    gear({ id: "campGuitar", category: "activity", shopGroup: "activity", displayName: "Camp Guitar", cost: 120, comfort: 7, detail: "+7 Comfort", image: imagePath("activity", "campGuitar", "png"), scene: scene({ x: 69, y: 81.2 }, 8, 21) }),
    gear({ id: "binoculars", category: "activity", shopGroup: "activity", displayName: "Binoculars", cost: 55, comfort: 2, detail: "+2 Comfort", image: imagePath("activity", "binoculars", "png"), scene: scene({ x: 25, y: 72.2 }, 5.6, 16) }),
    gear({ id: "cameraTripod", category: "activity", shopGroup: "activity", displayName: "Camera Tripod", cost: 115, comfort: 5, detail: "+5 Comfort", image: imagePath("activity", "cameraTripod", "png"), scene: scene({ x: 36, y: 73.2 }, 8.2, 16) }),

    gear({ id: "sleepingBag", category: "sleepingGear", shopGroup: "sleepingGear", displayName: "Sleeping Bag", cost: 65, comfort: 5, detail: "+5 Comfort", image: imagePath("sleepingGear", "sleepingBag", "png") }),
    gear({ id: "airMattress", category: "sleepingGear", shopGroup: "sleepingGear", displayName: "Air Mattress", cost: 100, comfort: 7, detail: "+7 Comfort", image: imagePath("sleepingGear", "airMattress", "png") }),
    gear({ id: "campPillow", category: "sleepingGear", shopGroup: "sleepingGear", displayName: "Camp Pillow", cost: 35, comfort: 2, detail: "+2 Comfort", image: imagePath("sleepingGear", "campPillow", "png") }),
    gear({ id: "tentInteriorLight", category: "sleepingGear", shopGroup: "sleepingGear", displayName: "Tent Interior Light", cost: 75, comfort: 4, detail: "+4 Comfort", image: imagePath("sleepingGear", "tentInteriorLight", "png"), unlocks: { nightMode: true } })
  ];

  const GEAR_CATALOG = {};

  GEAR_ITEMS.forEach(function(item) {
    GEAR_CATALOG[item.id] = item;
  });

  global.GEAR_CATEGORIES = GEAR_CATEGORIES;
  global.SHOP_GROUPS = SHOP_GROUPS;
  global.LEGACY_GEAR_ID_MAP = LEGACY_GEAR_ID_MAP;
  global.GEAR_CATALOG = GEAR_CATALOG;
})(typeof window !== "undefined" ? window : globalThis);
