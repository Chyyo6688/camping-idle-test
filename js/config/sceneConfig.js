// Editable scene points, walk restrictions, and activity target zones.

const campSpots = {
  fire: { x: 39, y: 79 },
  fireSeat: { x: 33, y: 80 },
  fireSeatRight: { x: 46, y: 80.5 },
  lake: { x: 50, y: 59 },
  tent: { x: 54, y: 69.5 },
  rest: { x: 24, y: 81 }
};

const SCENE_NO_WALK_ZONES = [
  {
    id: "lakeWater",
    padding: 14,
    points: [
      { x: 0, y: 0 },
      { x: 900, y: 0 },
      { x: 900, y: 740 },
      { x: 790, y: 742 },
      { x: 776, y: 679 },
      { x: 764, y: 651 },
      { x: 716, y: 625 },
      { x: 650, y: 618 },
      { x: 600, y: 636 },
      { x: 590, y: 662 },
      { x: 548, y: 695 },
      { x: 500, y: 750 },
      { x: 450, y: 800 },
      { x: 392, y: 875 },
      { x: 300, y: 885 },
      { x: 198, y: 865 },
      { x: 90, y: 825 },
      { x: 0, y: 790 }
    ]
  },
  {
    id: "leftTree",
    padding: 10,
    points: [
      { x: 0, y: 0 },
      { x: 150, y: 0 },
      { x: 150, y: 805 },
      { x: 210, y: 980 },
      { x: 300, y: 1120 },
      { x: 180, y: 1245 },
      { x: 0, y: 1205 }
    ]
  },
  {
    id: "rightShoreRocks",
    padding: 12,
    points: [
      { x: 620, y: 900 },
      { x: 710, y: 845 },
      { x: 900, y: 795 },
      { x: 900, y: 1000 },
      { x: 730, y: 1055 },
      { x: 660, y: 1020 }
    ]
  }
];

const ACTIVITY_ZONE_TARGET_PREFIX = "zone:";
const activityZones = {
  lakeFishing: {
    id: "lakeFishing",
    activityId: "fish",
    label: "Lake fishing spot",
    bounds: { x: 36, y: 43, width: 28, height: 16 },
    target: { x: 72, y: 43.5, activityFacing: "left" }
  },
  lakeBirdwatch: {
    id: "lakeBirdwatch",
    activityId: "birdwatch",
    label: "Lake birdwatching spot",
    bounds: { x: 58, y: 47, width: 22, height: 18 },
    target: { x: 62, y: 58, activityFacing: "left" }
  },
  treelineBirdwatch: {
    id: "treelineBirdwatch",
    activityId: "birdwatch",
    label: "Treeline birdwatching spot",
    bounds: { x: 15, y: 34, width: 28, height: 22 },
    target: { x: 32, y: 56, activityFacing: "left" }
  }
};
