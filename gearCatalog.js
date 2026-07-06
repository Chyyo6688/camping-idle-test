(function(global) {
  const BASE_SCENE_WIDTH = 900;
  const BASE_SCENE_HEIGHT = 1600;
  const SCENE_ASSET_SCALE = 3;

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
    living: {
      label: "Living",
      icon: "assets/ui/icon_furniture.png",
      categories: ["chair", "table", "storage"],
      visible: true
    },
    light: {
      label: "Light",
      icon: "assets/ui/icon_lighting.png",
      categories: ["light"],
      visible: true
    },
    kitchen: {
      label: "Kitchen",
      icon: "assets/ui/icon_tools.png",
      categories: ["stove", "cooler"],
      visible: true
    },
    activity: {
      label: "Activity",
      icon: "assets/ui/icon_tools.png",
      categories: ["activity"],
      visible: true
    },
    shelter: {
      label: "Shelter",
      icon: "assets/ui/icon_tent.png",
      categories: ["tent", "tarp", "vehicle"],
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

  const DEFAULT_TABLE_SURFACE_ZONE = {
    id: "tabletop",
    ratioX: 0.12,
    ratioY: 0.36,
    ratioWidth: 0.76,
    ratioHeight: 0.28,
    accepts: ["stove", "cooler", "storage"]
  };

  function cloneSurfaceZone(zone) {
    return Object.assign({}, zone, {
      accepts: Array.isArray(zone.accepts) ? zone.accepts.slice() : []
    });
  }

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
    nokaVillageCabinTent: { width: 334, height: 223 },
    BetaBreezeTent: { width: 128, height: 100 },
    LakeNestDomeTent: { width: 380, height: 240 },
    LakeLockLivingShelter: { width: 176, height: 128 },
    starterInstantTent: { width: 128, height: 100 },
    rooftopTent: { width: 120, height: 72 },
    smallDomeTent: { width: 128, height: 100 },
    pentaMiniTarp: { width: 128, height: 96 },
    hexaCampTarp: { width: 144, height: 104 },
    largeLivingTarp: { width: 176, height: 120 },
    vehicleAwning: { width: 136, height: 96 },
    sealChair: { width: 80, height: 80 },
    nokaMoonChair: { width: 150, height: 175 },
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
    hozukiLantern: { width: 66, height: 86 },
    miniHozukiLantern: { width: 66, height: 86 },
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

  function sceneXFromPercent(xPercent) {
    return xPercent * BASE_SCENE_WIDTH / 100;
  }

  function sceneYFromPercent(yPercent) {
    return yPercent * BASE_SCENE_HEIGHT / 100;
  }

  function addScenePosition(sceneDefinition) {
    if (!sceneDefinition || !sceneDefinition.position) {
      return;
    }

    if (typeof sceneDefinition.sceneX !== "number") {
      sceneDefinition.sceneX = sceneXFromPercent(sceneDefinition.position.x);
    }

    if (typeof sceneDefinition.sceneY !== "number") {
      sceneDefinition.sceneY = sceneYFromPercent(sceneDefinition.position.y);
    }
  }

  function scene(position, widthPercent, zIndex, extra) {
    const sceneDefinition = Object.assign({
      position: position,
      sceneX: sceneXFromPercent(position.x),
      sceneY: sceneYFromPercent(position.y),
      widthPercent: widthPercent,
      zIndex: zIndex || 20,
      layers: { base: null }
    }, extra || {});

    addScenePosition(sceneDefinition);

    return sceneDefinition;
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
      anchors: {},
      placeableOn: []
    }, item);
    normalizedItem.spriteSize = normalizedItem.spriteSize || getSpriteSize(normalizedItem.id);

    if (normalizedItem.scene) {
      const groundAnchor = normalizedItem.anchors && normalizedItem.anchors.ground;
      normalizedItem.scene.placementLayer = normalizedItem.scene.placementLayer || "ground";
      if (normalizedItem.scene.mountTo) {
        normalizedItem.scene.placementLayer = "mounted";
      }
      if (normalizedItem.category === "table" && !normalizedItem.scene.surfaceZone) {
        normalizedItem.scene.surfaceZone = cloneSurfaceZone(DEFAULT_TABLE_SURFACE_ZONE);
      }
      if (normalizedItem.category === "stove") {
        normalizedItem.scene.placementLayer = normalizedItem.scene.placementLayer === "ground" ? "surface" : normalizedItem.scene.placementLayer;
        if (typeof normalizedItem.scene.depthOffsetY !== "number") {
          normalizedItem.scene.depthOffsetY = 90;
        }
        if (!normalizedItem.placeableOn || normalizedItem.placeableOn.length === 0) {
          normalizedItem.placeableOn = ["table"];
        }
      }
      normalizedItem.scene.anchor = normalizedItem.scene.anchor || groundAnchor || { ratioX: 0.5, ratioY: 1 };
      addScenePosition(normalizedItem.scene);
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
      scene: scene({ x: 72, y: 75 }, 30, 19, {
        roofMount: { ratioX: 0.6, ratioY: 0.42, zIndex: 19 }, 
        awningMount: { ratioX: 0.55, ratioY: 0.13, zIndex: 19 }
      })
    }),
    gear({
      id: "creamCampVan",
      category: "vehicle",
      shopGroup: "shelter",
      displayName: "奶油露营车",
      cost: 360,
      comfort: 10,
      detail: "+10 Comfort",
      image: imagePath("vehicle", "creamCampVan", "png"),
      scene: scene({ x: 72, y: 75 }, 30, 19, {
        roofMount: { ratioX: 0.5, ratioY: 0.41, zIndex: 19 },
        awningMount: { ratioX: 0.5, ratioY: 0.2, zIndex: 19 }
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
      scene: scene({ x: 72, y: 75 }, 30, 19, {
        roofMount: { ratioX: 0.61, ratioY: 0.4, zIndex: 19 },
        awningMount: { ratioX: 0.5, ratioY: 0.16, zIndex: 19 }
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
      scene: scene({ x: 72, y: 75 }, 34, 19, {
        roofMount: { ratioX: 0.55, ratioY: 0.35, zIndex: 19 },
        awningMount: { ratioX: 0.55, ratioY: 0.06, zIndex: 19 }
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
      scene: scene({ x: 72, y: 75 }, 30, 19, {
        roofMount: { ratioX: 0.48, ratioY: 0.4, zIndex: 19 },
        awningMount: { ratioX: 0.55, ratioY: 0.2, zIndex: 19 }
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
      scene: scene({ x: 54, y: 69.5 }, 34, 18),
      interactions: { tentRest: { point: { ratioX: 0.25, ratioY: 0.9 } } }
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
      scene: scene({ x: 54, y: 69.5 }, 30, 18),
      interactions: { tentRest: { point: { ratioX: 0.5, ratioY: 1 } } }
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
      interactions: { tentRest: { point: { ratioX: 0.5, ratioY: 1 } } }
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
      interactions: { tentRest: { point: { ratioX: 0.5, ratioY: 1 } } }
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
      scene: scene({ x: 54, y: 69.5 }, 25, 18),
      interactions: { tentRest: { point: { ratioX: 0.5, ratioY: 1 } } }
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
      scene: scene({ x: 74, y: 70 }, 19, 19, {
        anchor: { ratioX: 0.5, ratioY: 1 },
        mountTo: "vehicleRoof"
      }),
      interactions: { tentRest: { point: { ratioX: 0.350877193, ratioY: 0.8 } } }
    }),
    gear({
      id: "smallDomeTent",
      category: "tent",
      shopGroup: "shelter",
      displayName: "小型穹顶帐",
      cost: 80,
      comfort: 10,
      detail: "+10 Comfort",
      image: imagePath("tent", "smallDomeTent", "png"),
      offlineBonusSeconds: 7200,
      scene: scene({ x: 54, y: 69.5 }, 28, 18),
      interactions: { tentRest: { point: { ratioX: 0.5, ratioY: 1 } } }
    }),

    gear({ id: "pentaMiniTarp", 
      category: "tarp", 
      shopGroup: "shelter", 
      displayName: "小型天幕", 
      cost: 70, comfort: 4, 
      detail: "+4 Comfort", 
      image: imagePath("tarp", "pentaMiniTarp", "png"), 
      scene: scene({ x: 31, y: 70 }, 30, 18) }),
    gear({ id: "hexaCampTarp", 
      category: "tarp", 
      shopGroup: "shelter", 
      displayName: "中型天幕", 
      cost: 110, comfort: 7, 
      detail: "+7 Comfort", 
      image: imagePath("tarp", "hexaCampTarp", "png"), 
      scene: scene({ x: 31, y: 68 }, 10, 18) }),
    gear({ id: "largeLivingTarp", 
      category: "tarp", 
      shopGroup: "shelter", 
      displayName: "大型天幕", 
      cost: 160, comfort: 10, 
      detail: "+10 Comfort", 
      image: imagePath("tarp", "largeLivingTarp", "png"), 
      scene: scene({ x: 28, y: 68 }, 35, 18) }),
    gear({ id: "vehicleAwning", 
      category: "tarp", 
      shopGroup: "shelter", 
      displayName: "车边天幕", 
      cost: 130, comfort: 8, 
      detail: "Requires Vehicle", 
      image: imagePath("tarp", "vehicleAwning", "png"), 
      requires: { anyOwnedCategory: ["vehicle"] }, 
      scene: scene({ x: 74, y: 80 }, 29, 19, 
        { mirrored: true, 
        anchor: { ratioX: 0, ratioY: 0 },
        mountTo: "vehicleAwning"}
      ) 
    }
  ),

    gear({
      id: "sealChair",
      category: "chair",
      shopGroup: "living",
      displayName: "海狗椅",
      cost: 55,
      comfort: 5,
      detail: "+5 Comfort",
      image: imagePath("chair", "sealChair", "png"),
      scene: scene({ x: 50, y: 74 }, 20, 22, {
        layers: { base: imagePath("chair", "sealChair", "png"), front: null },
        facing: "left",
        mirrored: false,
        frontZIndex: 31
      }),
      interactions: {
        seatable: {
          camperFacingMode: "sameAsFurniture",
          seatOffsets: {
            left: { ratioX: 0.4, ratioY: 0.99 }
          }
        }
      },
      anchors: { ground: { ratioX: 0.4166666667, ratioY: 1 } }
    }),
    gear({ id: "nokaMoonChair", 
      category: "chair", 
      shopGroup: "living", 
      displayName: "月亮椅", 
      cost: 75, comfort: 6, detail: "+6 Comfort", 
      image: imagePath("chair", "nokaMoonChair", "png"), 
      scene: scene({ x: 57, y: 79 }, 10, 22, { facing: "left", mirrored: false }),
      interactions: { seatable: { camperFacingMode: "sameAsFurniture", 
        seatOffsets: { left: { ratioX: 0.37, ratioY: 0.95 } } } },
        anchors: { ground: { ratioX: 0.5, ratioY: 0.9 } } }),
    gear({ id: "redDirectorChair", 
      category: "chair", 
      shopGroup: "living", 
      displayName: "导演椅", 
      cost: 90, comfort: 7, detail: "+7 Comfort", 
      image: imagePath("chair", "redDirectorChair", "png"), 
      scene: scene({ x: 75, y: 76 }, 11, 22, { facing: "left" }), 
      interactions: { seatable: { camperFacingMode: "sameAsFurniture", 
        seatOffsets: { left: { ratioX: 0.42, ratioY: 0.94 } } } }, 
        anchors: { ground: { ratioX: 0.4494382022, ratioY: 0.9 } } }),
    gear({ id: "tripleCampSofa", 
      category: "chair", 
      shopGroup: "living", 
      displayName: "三人沙发椅", 
      cost: 150, comfort: 12, detail: "+12 Comfort", 
      image: imagePath("chair", "tripleCampSofa", "png"), 
      scene: scene({ x: 26, y: 72 }, 18, 23, { facing: "left", mirrored: true }), 
      interactions: { seatable: { camperFacingMode: "sameAsFurniture", 
        seatOffsets: { left: { ratioX: 0.5, ratioY: 0.99 } } } }, 
        anchors: { ground: { ratioX: 0.4074074074, ratioY: 0.9 } } }),
    gear({ id: "inflatableLoungeChair", 
      category: "chair", 
      shopGroup: "living", 
      displayName: "充气沙发椅", 
      cost: 135, comfort: 11, detail: "+11 Comfort", 
      image: imagePath("chair", "inflatableLoungeChair", "png"), 
      scene: scene({ x: 37, y: 69 }, 14, 22, { facing: "left",mirrored: true }), 
      interactions: { seatable: { camperFacingMode: "sameAsFurniture", 
        seatOffsets: { left: { ratioX: 0.38, ratioY: 0.99 } } } }, 
        anchors: { ground: { ratioX: 0.4126984127, ratioY: 0.6687306502 } } }),
    gear({ id: "lowCampChair", 
      category: "chair", 
      shopGroup: "living", 
      displayName: "低矮休闲椅", 
      cost: 70, comfort: 6, detail: "+6 Comfort", 
      image: imagePath("chair", "lowCampChair", "png"), 
      scene: scene({ x: 55, y: 52 }, 11.5, 22, { facing: "left" }), 
      interactions: { seatable: { camperFacingMode: "sameAsFurniture", 
        seatOffsets: { left: { ratioX: 0.45, ratioY: 1.05 } } } }, 
        anchors: { ground: { ratioX: 0.38585209, ratioY: 0.9 } } }),

    gear({ id: "checkerboardTable", 
      category: "table", 
      shopGroup: "living", 
      displayName: "棋盘桌", 
      cost: 60, comfort: 6, detail: "+6 Comfort", 
      image: imagePath("table", "checkerboardTable", "png"), 
      scene: scene({ x: 65.5, y: 81.5 }, 14, 24) }),
    gear({ id: "entryIgtTable", 
      category: "table", 
      shopGroup: "living", 
      displayName: "Entry IGT 桌", 
      cost: 90, comfort: 7, detail: "+7 Comfort", 
      image: imagePath("table", "entryIgtTable", "png"), 
      scene: scene({ x: 50, y: 80.8 }, 14.5, 17) }),
    gear({ id: "igtSlimTable", 
      category: "table", 
      shopGroup: "living", 
      displayName: "IGT Slim 木桌", 
      cost: 120, comfort: 9, detail: "+9 Comfort", 
      image: imagePath("table", "igtSlimTable", "png"), 
      scene: scene({ x: 59, y: 80.4 }, 15, 17) }),
    gear({ id: "igtFourUnitTable", 
      category: "table", 
      shopGroup: "living", 
      displayName: "四单元 IGT 桌", 
      cost: 150, comfort: 11, detail: "+11 Comfort", 
      image: imagePath("table", "igtFourUnitTable", "png"), 
      scene: scene({ x: 70, y: 81.2 }, 18, 17) }),
    gear({ id: "igtCampKitchenSet", 
      category: "table", 
      shopGroup: "living", 
      displayName: "IGT 厨房套装", 
      cost: 190, comfort: 14, detail: "+14 Comfort", 
      image: imagePath("table", "igtCampKitchenSet", "png"), 
      scene: scene({ x: 17, y: 77 }, 20, 29, { mirrored: true }) }),
    gear({ id: "foldingPrepTable", 
      category: "table", 
      shopGroup: "living", 
      displayName: "折叠料理桌", 
      cost: 80, comfort: 7, detail: "+7 Comfort", 
      image: imagePath("table", "foldingPrepTable", "png"), 
      scene: scene({ x: 20, y:84 }, 14, 17) }),

    gear({ id: "homeCampBurner", 
      category: "stove", 
      shopGroup: "kitchen", 
      displayName: "Home Camp卡式炉", 
      cost: 110, comfort: 5, detail: "Requires Table", 
      image: imagePath("stove", "homeCampBurner", "png"), 
      requires: { anyOwnedCategory: ["table"] }, 
      scene: scene({ x: 20, y: 80 }, 9, 31) }),
    gear({ id: "flatBurner", 
      category: "stove", 
      shopGroup: "kitchen", 
      displayName: "Flat Burner", 
      cost: 120, comfort: 6, detail: "Requires Table", 
      image: imagePath("stove", "flatBurner", "png"), 
      requires: { anyOwnedCategory: ["table"] }, 
      scene: scene({ x: 60, y: 76.4 }, 7.2, 31, { mirrored: true }) }),
    gear({ id: "gigaPowerStove", 
      category: "stove", 
      shopGroup: "kitchen", 
      displayName: "GigaPower小炉头", 
      cost: 80, comfort: 4, detail: "Requires Table", 
      image: imagePath("stove", "gigaPowerStove", "png"), 
      requires: { anyOwnedCategory: ["table"] }, 
      scene: scene({ x: 63, y: 78 }, 6.4, 31) }),
    gear({ id: "gigaPowerLiStove", 
      category: "stove", 
      shopGroup: "kitchen", 
      displayName: "GigaPower大炉", 
      cost: 105, comfort: 5, detail: "Requires Table", 
      image: imagePath("stove", "gigaPowerLiStove", "png"), 
      requires: { anyOwnedCategory: ["table"] }, 
      scene: scene({ x: 67.5, y: 79 }, 7.1, 31) }),
    gear({ id: "grillBurner", 
      category: "stove", 
      shopGroup: "kitchen", 
      displayName: "烤炉组件", 
      cost: 145, comfort: 7, detail: "Requires Table", 
      image: imagePath("stove", "grillBurner", "png"), 
      requires: { anyOwnedCategory: ["table"] }, 
      scene: scene({ x: 11, y: 74 }, 8.4, 31, { mirrored: true }) }),

    gear({ id: "smallSoftCooler", 
      category: "cooler", 
      shopGroup: "kitchen", 
      displayName: "小软冷包", 
      cost: 55, comfort: 3, detail: "+3 Comfort", 
      image: imagePath("cooler", "smallSoftCooler", "png"), 
      scene: scene({ x: 30, y: 83.4 }, 8.8, 19) }),
    gear({ id: "campCoolerBox", 
      category: "cooler", 
      shopGroup: "kitchen", 
      displayName: "中型冷藏箱", 
      cost: 95, comfort: 5, detail: "+5 Comfort", 
      image: imagePath("cooler", "campCoolerBox", "png"), 
      scene: scene({ x: 28, y: 85 }, 9.5, 18) }),
    gear({ id: "systemCoolerBag", 
      category: "cooler", 
      shopGroup: "kitchen", 
      displayName: "系统冷藏包", 
      cost: 115, comfort: 6, detail: "+6 Comfort", 
      image: imagePath("cooler", "systemCoolerBag", "png"), 
      scene: scene({ x: 33, y: 86 }, 10, 18, { mirrored: true }) }),

    gear({ id: "basicCampLantern", 
      category: "light", 
      shopGroup: "light", 
      displayName: "简单营地灯", 
      cost: 90, comfort: 6, 
      detail: "Unlock Night", 
      image: imagePath("light", "basicCampLantern", "png"), 
      unlocks: { nightMode: true }, 
      scene: scene({ x: 6, y: 61.5 }, 7.5, 23, { layers: { base: imagePath("light", "basicCampLantern", "png"), glow: layerPath("light", "basicCampLantern", "glow", "png") } }) }),
    gear({ id: "starterHeadlamp", 
      category: "light", 
      shopGroup: "light", 
      displayName: "新手头灯", 
      cost: 45, comfort: 2, 
      detail: "Unlock Night", 
      image: imagePath("light", "starterHeadlamp", "png"), 
      unlocks: { nightMode: true }, 
      autoPlaceOnBuy: true, 
      attachment: { 
        target: "camperHead", 
        zIndex: 32, 
        backZIndex: 29, 
        coneZIndex: 31, 
        layers: { 
          front: headlampPath("headlamp-front"), 
          back: headlampPath("headlamp-back"), 
          cone: headlampPath("flashlight-cone") 
        }, 
        hiddenPoses: ["resting", "tentRest"],
        offsets: { 
          right: { x: 0.3, y: -6, rotate: -0, scaleX: -1 }, 
          left: { x: -0.3, y: -6, rotate: 0, scaleX: 1 }, 
          back: { x: 0, y: -6.35, rotate: 0 } 
        }, 
        poseOffsets: {
          sittingGround: {
            right: { x: -0.65, y: -5.15, rotate: -2, scaleX: -1 },
            left: { x: 0.65, y: -5.15, rotate: 2, scaleX: 1 }
          },
          sittingChair: {
            right: { x: -0.65, y: -6.35, rotate: -1, scaleX: -1 },
            left: { x: 0.65, y: -6.35, rotate: 1, scaleX: 1 }
          }
        },
        coneOffsets: {
          right: { x: 9.8, y: -5.8, rotate: 0 },
          left: { x: -9.8, y: -5.8, rotate: 0 },
          back: { x: 0, y: -11.2, rotate: -90 }
        },
        conePoseOffsets: {
          sittingGround: {
            right: { x: 8.7, y: -5.05, rotate: 0 },
            left: { x: -8.7, y: -5.05, rotate: 0 }
          },
          sittingChair: {
            right: { x: 9.45, y: -6.15, rotate: 0 },
            left: { x: -9.45, y: -6.15, rotate: 0 }
          }
        }
      }
    }
  ),
    gear({ id: "warmStringLights", 
      category: "light", 
      shopGroup: "light", 
      displayName: "暖光串灯", 
      cost: 140, comfort: 8, 
      detail: "+8 Comfort", 
      image: imagePath("light", "warmStringLights", "png"), 
      unlocks: { nightMode: true }, 
      scene: scene({ x: 55, y: 63}, 22, 21, { aspectRatio: "160 / 60", layers: { glow: layerPath("light", "warmStringLights", "glow", "png"), base: imagePath("light", "warmStringLights", "png") } }) }),
    gear({ id: "hozukiLantern", 
      category: "light", 
      shopGroup: "light", 
      displayName: "Hozuki灯笼", 
      cost: 130, comfort: 7, 
      detail: "Unlock Night", 
      image: imagePath("light", "hozukiLantern", "png"), 
      unlocks: { nightMode: true }, 
      scene: scene({ x: 13, y: 40 }, 8, 24) }),
    gear({ id: "miniHozukiLantern", 
      category: "light", 
      shopGroup: "light", 
      displayName: "Mini Hozuki", 
      cost: 95, comfort: 5, 
      detail: "Unlock Night", 
      image: imagePath("light", "miniHozukiLantern", "png"), 
      unlocks: { nightMode: true }, 
      scene: scene({ x: 10.5, y: 70.4 }, 5, 24) }),
    gear({ id: "lanternPoleLight", 
      category: "light", 
      shopGroup: "light", 
      displayName: "灯杆营地灯", 
      cost: 150, comfort: 8, 
      detail: "Unlock Night", 
      image: imagePath("light", "lanternPoleLight", "png"), 
      unlocks: { nightMode: true }, 
      scene: scene({ x: 13, y: 66 }, 18, 16, { anchor: { ratioX: 0.2469135802, ratioY: 0.4855967078 }, mirrored: true }) }),

    gear({ id: "stackingShelfContainer25", 
      category: "storage", 
      shopGroup: "living", 
      displayName: "Stacking Shelf 25", 
      cost: 65, comfort: 3, 
      detail: "+3 Comfort", 
      image: imagePath("storage", "stackingShelfContainer25", "png"), 
      placeableOn: ["storage"],
      scene: scene({ x: 86, y: 56 }, 9.5, 16, { mirrored: true, placementLayer: "stacked", depthOffsetY: 70 }) }),
    gear({ id: "stackingShelfContainer50", 
      category: "storage", 
      shopGroup: "living", 
      displayName: "Stacking Shelf 50", 
      cost: 80, comfort: 4, 
      detail: "+4 Comfort", 
      image: imagePath("storage", "stackingShelfContainer50", "png"), 
      scene: scene({ x: 86, y: 58 }, 11.5, 15, {
        surfaceZone: {
          id: "shelfTop",
          ratioX: 0.14,
          ratioY: 0.18,
          ratioWidth: 0.72,
          ratioHeight: 0.22,
          accepts: ["storage"]
        }
      }) }),
    gear({ id: "stackedShelfContainerSet", 
      category: "storage", 
      shopGroup: "living", 
      displayName: "Stacked Shelf Set", 
      cost: 120, comfort: 6, 
      detail: "+6 Comfort", 
      image: imagePath("storage", "stackedShelfContainerSet", "png"), 
      scene: scene({ x: 90, y: 74 }, 13, 16) }),
    gear({ id: "canvasGearBag", 
      category: "storage", 
      shopGroup: "living", 
      displayName: "Canvas Gear Bag", 
      cost: 45, comfort: 2, 
      detail: "+2 Comfort", 
      image: imagePath("storage", "canvasGearBag", "png"), 
      scene: scene({ x: 79.8, y: 77.5 }, 8.2, 25, { mirrored: true }) }),
    gear({ id: "kitchenCarryCase", 
      category: "storage", 
      shopGroup: "living", 
      displayName: "Kitchen Carry Case", 
      cost: 60, comfort: 3, 
      detail: "+3 Comfort", 
      image: imagePath("storage", "kitchenCarryCase", "png"), 
      scene: scene({ x: 60, y: 82 }, 8.4, 30) }),
    gear({ id: "firewoodPile", 
      category: "storage", 
      shopGroup: "living", 
      displayName: "Firewood Pile", 
      cost: 35, comfort: 1, 
      detail: "+1 Comfort", 
      image: imagePath("storage", "firewoodPile", "png"), 
      scene: scene({ x: 13, y: 82.8 }, 12, 10) }),

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
      scene: scene({ x: 39, y: 79 }, 23.7, 26, {
        renderMode: "campfire",
        collision: {
          footprint: { ratioX: 0.32, ratioY: 0.34, ratioWidth: 0.36, ratioHeight: 0.52 }
        }
      }),
      interactions: { upgradeCampfire: true }
    }),

    gear({ id: "fishingRod", 
      category: "activity", 
      shopGroup: "activity", 
      displayName: "新手钓鱼竿", 
      cost: 75, comfort: 3, 
      detail: "+3 Comfort", 
      image: imagePath("activity", "fishingRod", "png"), 
      scene: scene({ x: 45, y: 50 }, 15, 16, { mirrored: true }) }),
    gear({ id: "campBoardGame", 
      category: "activity", 
      shopGroup: "activity", 
      displayName: "桌游套装", 
      cost: 70, comfort: 4, 
      detail: "+4 Comfort", 
      image: imagePath("activity", "campBoardGame", "png"), 
      scene: scene({ x: 31, y: 71 }, 7.2, 31) }),
    gear({ id: "campGuitar", 
      category: "activity", 
      shopGroup: "activity", 
      displayName: "清风吉他", 
      cost: 120, comfort: 7, 
      detail: "+7 Comfort", 
      image: imagePath("activity", "campGuitar", "png"), 
      scene: scene({ x: 69, y: 54 }, 8, 21) }),
    gear({ id: "binoculars", 
      category: "activity", 
      shopGroup: "activity", 
      displayName: "双筒望远镜", 
      cost: 55, comfort: 2, 
      detail: "+2 Comfort", 
      image: imagePath("activity", "binoculars", "png"), 
      scene: scene({ x: 65.5, y: 71.5 }, 5.6, 31) }),
    gear({ id: "cameraTripod", 
      category: "activity", 
      shopGroup: "activity", 
      displayName: "相机三脚架", 
      cost: 115, comfort: 5, 
      detail: "+5 Comfort", 
      image: imagePath("activity", "cameraTripod", "png"), 
      scene: scene({ x: 35, y: 51 }, 10, 16, { mirrored: true }) }),

    gear({ id: "sleepingBag", 
      category: "sleepingGear", 
      shopGroup: "sleepingGear", 
      displayName: "Sleeping Bag", 
      cost: 65, comfort: 5, 
      detail: "+5 Comfort", 
      image: imagePath("sleepingGear", "sleepingBag", "png") }),
    gear({ id: "airMattress", 
      category: "sleepingGear", 
      shopGroup: "sleepingGear", 
      displayName: "Air Mattress", 
      cost: 100, comfort: 7, 
      detail: "+7 Comfort", 
      image: imagePath("sleepingGear", "airMattress", "png") }),
    gear({ id: "campPillow", 
      category: "sleepingGear", 
      shopGroup: "sleepingGear", 
      displayName: "Camp Pillow", 
      cost: 35, comfort: 2, 
      detail: "+2 Comfort", 
      image: imagePath("sleepingGear", "campPillow", "png") }),
    gear({ id: "tentInteriorLight", 
      category: "sleepingGear", 
      shopGroup: "sleepingGear", 
      displayName: "Tent Interior Light", 
      cost: 75, comfort: 4, 
      detail: "+4 Comfort", 
      image: imagePath("sleepingGear", "tentInteriorLight", "png"), 
      unlocks: { nightMode: true } })
  ];

  const GEAR_CATALOG = {};

  GEAR_ITEMS.forEach(function(item) {
    GEAR_CATALOG[item.id] = item;
  });

  global.GEAR_CATEGORIES = GEAR_CATEGORIES;
  global.SHOP_GROUPS = SHOP_GROUPS;
  global.LEGACY_GEAR_ID_MAP = LEGACY_GEAR_ID_MAP;
  global.GEAR_CATALOG = GEAR_CATALOG;
  global.BASE_SCENE_WIDTH = BASE_SCENE_WIDTH;
  global.BASE_SCENE_HEIGHT = BASE_SCENE_HEIGHT;
  global.SCENE_ASSET_SCALE = SCENE_ASSET_SCALE;
})(typeof window !== "undefined" ? window : globalThis);
