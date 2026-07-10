// Editable fishing outcomes, fish data, recipes, rewards, and inventory limits.

const fishCatalog = {
  minnow: {
    id: "minnow",
    displayName: "小银鱼",
    rarity: "common",
    rarityLabel: "普通鱼",
    image: "assets/inventory/fish/minnow.png"
  },
  bluegill: {
    id: "bluegill",
    displayName: "蓝鳃鱼",
    rarity: "common",
    rarityLabel: "普通鱼",
    image: "assets/inventory/fish/bluegill.png"
  },
  yellowPerch: {
    id: "yellowPerch",
    displayName: "黄鲈",
    rarity: "common",
    rarityLabel: "普通鱼",
    image: "assets/inventory/fish/yellow_perch.png"
  },
  pumpkinseed: {
    id: "pumpkinseed",
    displayName: "南瓜籽太阳鱼",
    rarity: "common",
    rarityLabel: "普通鱼",
    image: "assets/inventory/fish/pumpkinseed.png"
  },
  brookTrout: {
    id: "brookTrout",
    displayName: "溪鳟",
    rarity: "uncommon",
    rarityLabel: "稍稀有鱼",
    image: "assets/inventory/fish/brook_trout.png"
  },
  channelCatfish: {
    id: "channelCatfish",
    displayName: "沟鲶",
    rarity: "uncommon",
    rarityLabel: "稍稀有鱼",
    image: "assets/inventory/fish/channel_catfish.png"
  },
  goldenKoi: {
    id: "goldenKoi",
    displayName: "金色锦鲤",
    rarity: "rare",
    rarityLabel: "稀有鱼",
    image: "assets/inventory/fish/golden_koi.png"
  },
  moonCarp: {
    id: "moonCarp",
    displayName: "月光鲤",
    rarity: "rare",
    rarityLabel: "稀有鱼",
    image: "assets/inventory/fish/moon_carp.png"
  }
};

const fishIdsByRarity = {
  common: ["minnow", "bluegill", "yellowPerch", "pumpkinseed"],
  uncommon: ["brookTrout", "channelCatfish"],
  rare: ["goldenKoi", "moonCarp"]
};

const fishingOutcomeTable = [
  { id: "none", weight: 34 },
  { id: "common", weight: 46 },
  { id: "uncommon", weight: 15 },
  { id: "rare", weight: 5 },
  { id: "turtle", weight: 8 }
];

const mealCatalog = {
  simpleGrilledFish: {
    id: "simpleGrilledFish",
    displayName: "烤湖鱼",
    detail: "营地料理",
    image: "assets/inventory/meals/grilled_fish.png"
  }
};

const cookingComfortMealCap = 0;
const cookingCozyReward = 0;
const fishInventoryCapacity = 20;
const dailyAutoCookingLimit = 20;
const koiReleaseAnimationThreshold = 10;
