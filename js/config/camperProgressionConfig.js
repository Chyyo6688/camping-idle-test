// Persistence-only habit growth and daily adventure modifier tuning.

const CAMPER_HABIT_IDS = [
  "fishing",
  "cooking",
  "birdwatching",
  "resting",
  "campfireCare",
  "decorating",
  "exploring"
];

const CAMPER_HABIT_DAILY_INFLUENCE_LIMIT = 3;
const CAMPER_HABIT_MODIFIER_RANGE = { min: -15, max: 15 };
const CAMPER_HABIT_DEFINITIONS = {
  fishing: {
    traitWeights: { curiosity: 1, observation: 1.2, rationality: 0.4 }
  },
  cooking: {
    traitWeights: { preparedness: 1, responsibility: 1.2, comfortSeeking: 0.5 }
  },
  birdwatching: {
    traitWeights: { curiosity: 0.8, observation: 1.4, comfortSeeking: 0.2 }
  },
  resting: {
    traitWeights: { rationality: 0.5, sociability: -0.25, comfortSeeking: 1.1 }
  },
  campfireCare: {
    traitWeights: { sociability: 0.4, preparedness: 0.8, responsibility: 1.3 }
  },
  decorating: {
    traitWeights: { observation: 0.8, rationality: 0.7, comfortSeeking: 0.9 }
  },
  exploring: {
    traitWeights: { courage: 1.3, curiosity: 1.2, preparedness: -0.2 }
  }
};
const CAMPER_ACTIVITY_HABIT_MAP = {
  fish: "fishing",
  cook: "cooking",
  birdwatch: "birdwatching"
};
const CAMPER_COMPLETED_ACTION_HABIT_MAP = {
  resting: "resting",
  tentRest: "resting",
  sittingOnFurniture: "resting",
  sittingOnChair: "resting"
};
const CAMPER_EXPLORING_ACTIVITY_IDS = ["fish", "birdwatch"];

const DAILY_ADVENTURE_MODIFIER_KEYS = [
  "generalLuck",
  "treasureLuck",
  "socialLuck",
  "healthLuck",
  "dangerSense"
];
const DAILY_ADVENTURE_MODIFIER_RANGE = { min: -10, max: 10 };
const DAILY_ADVENTURE_QUESTION_MAP = {
  overall: "generalLuck",
  money: "treasureLuck",
  relationship: "socialLuck",
  bodyMind: "healthLuck"
};
const TURTLE_FORTUNE_ADVENTURE_SCORES = {
  "大吉": 6,
  "吉": 3,
  "平": 0,
  "慎": -3,
  "凶": -6
};
