// Editable activity definitions and their timing, weighting, and requirements.

const activityDefinitions = {
  cook: {
    id: "cook",
    label: "Cook",
    actionLabel: "Cooking at camp",
    targetLabel: "stove or camp kitchen",
    durationSeconds: 4.2,
    weight: 2.6,
    pose: "activityCook",
    targetOffset: { x: 0, y: 2.2 },
    targetPoint: { ratioX: 0.5, ratioY: 1 },
    requires: {
      anyGearCategory: ["stove"],
      anyGearId: ["igtCampKitchenSet", "kitchenCarryCase"]
    },
    gearCategories: ["stove"],
    gearIds: ["igtCampKitchenSet", "kitchenCarryCase"]
  },
  fish: {
    id: "fish",
    label: "Fish",
    actionLabel: "Fishing by the lake",
    targetLabel: "the lake",
    durationSeconds: 10,
    weight: 2.4,
    pose: "activityFish",
    targetOffset: { x: 0, y: 1.8 },
    targetPoint: { ratioX: 0.5, ratioY: 1 },
    requires: { area: "lake" },
    gearIds: ["fishingRod"],
    zoneIds: ["lakeFishing"],
    fixedTarget: true,
    fallbackTarget: { x: 78, y: 40.5, activityFacing: "left" }
  },
  birdwatch: {
    id: "birdwatch",
    label: "Birdwatch",
    actionLabel: "Birdwatching",
    targetLabel: "a quiet lookout",
    durationSeconds: 4.6,
    weight: 2,
    pose: "activityBirdwatch",
    targetOffset: { x: 0, y: 2 },
    targetPoint: { ratioX: 0.5, ratioY: 1 },
    requires: { area: "treelineOrLake" },
    gearIds: ["binoculars", "cameraTripod"],
    zoneIds: ["treelineBirdwatch", "lakeBirdwatch"],
    fallbackTarget: { x: 32, y: 56, activityFacing: "left" }
  }
};
