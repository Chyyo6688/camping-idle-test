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
  },
  wildMushroomFishSoup: {
    id: "wildMushroomFishSoup",
    displayName: "山野菌鱼汤",
    detail: "深山菜谱",
    image: "assets/inventory/meals/grilled_fish.png"
  },
  pineNutGrilledFish: {
    id: "pineNutGrilledFish",
    displayName: "松仁烤鱼",
    detail: "深山菜谱",
    image: "assets/inventory/meals/grilled_fish.png"
  },
  rainforestSourFishSoup: {
    id: "rainforestSourFishSoup",
    displayName: "雨林酸汤鱼",
    detail: "雾雨林菜谱",
    image: "assets/inventory/meals/grilled_fish.png"
  },
  aromaticLeafGrilledFish: {
    id: "aromaticLeafGrilledFish",
    displayName: "香叶烤鱼",
    detail: "雾雨林菜谱",
    image: "assets/inventory/meals/grilled_fish.png"
  },
  wildGingerMushroomSoup: {
    id: "wildGingerMushroomSoup",
    displayName: "野姜菌汤",
    detail: "雾雨林菜谱",
    image: "assets/inventory/meals/grilled_fish.png"
  }
};

const ingredientCatalog = {
  wildMushroom: { id: "wildMushroom", displayName: "山野菌", detail: "深山原料", image: "assets/inventory/meals/grilled_fish.png" },
  wildOnion: { id: "wildOnion", displayName: "野葱", detail: "深山原料", image: "assets/inventory/meals/grilled_fish.png" },
  pineNut: { id: "pineNut", displayName: "松子", detail: "深山原料", image: "assets/inventory/meals/grilled_fish.png" },
  rainGinger: { id: "rainGinger", displayName: "雨姜", detail: "雾雨林原料", image: "assets/inventory/meals/grilled_fish.png" },
  sourBerry: { id: "sourBerry", displayName: "酸浆果", detail: "雾雨林原料", image: "assets/inventory/meals/grilled_fish.png" },
  aromaticLeaf: { id: "aromaticLeaf", displayName: "香叶", detail: "雾雨林原料", image: "assets/inventory/meals/grilled_fish.png" },
  rainforestMushroom: { id: "rainforestMushroom", displayName: "雨林菌", detail: "雾雨林原料", image: "assets/inventory/meals/grilled_fish.png" }
};

const cookingRecipeCatalog = {
  simpleGrilledFish: {
    id: "simpleGrilledFish",
    mealId: "simpleGrilledFish",
    displayName: "烤湖鱼",
    ingredientCosts: {},
    priority: 1,
    defaultUnlocked: true
  },
  wildMushroomFishSoup: {
    id: "wildMushroomFishSoup",
    mealId: "wildMushroomFishSoup",
    displayName: "山野菌鱼汤",
    ingredientCosts: { wildMushroom: 1, wildOnion: 1 },
    priority: 35
  },
  pineNutGrilledFish: {
    id: "pineNutGrilledFish",
    mealId: "pineNutGrilledFish",
    displayName: "松仁烤鱼",
    ingredientCosts: { pineNut: 1 },
    priority: 30
  },
  rainforestSourFishSoup: {
    id: "rainforestSourFishSoup",
    mealId: "rainforestSourFishSoup",
    displayName: "雨林酸汤鱼",
    ingredientCosts: { rainGinger: 1, sourBerry: 1 },
    priority: 45
  },
  aromaticLeafGrilledFish: {
    id: "aromaticLeafGrilledFish",
    mealId: "aromaticLeafGrilledFish",
    displayName: "香叶烤鱼",
    ingredientCosts: { aromaticLeaf: 1 },
    priority: 40
  },
  wildGingerMushroomSoup: {
    id: "wildGingerMushroomSoup",
    mealId: "wildGingerMushroomSoup",
    displayName: "野姜菌汤",
    ingredientCosts: { rainGinger: 1, rainforestMushroom: 1 },
    priority: 42
  }
};

const cookingComfortMealCap = 0;
const cookingCozyReward = 0;
const fishInventoryCapacity = 20;
const dailyAutoCookingLimit = 20;
const koiReleaseAnimationThreshold = 10;
