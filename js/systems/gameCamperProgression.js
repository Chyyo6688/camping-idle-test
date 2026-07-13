// Persistence-only camper habits and daily adventure-ready modifier data.

function createCamperHabitCountMap() {
  return CAMPER_HABIT_IDS.reduce(function(counts, habitId) {
    counts[habitId] = 0;
    return counts;
  }, {});
}

function sanitizeCamperHabitCountMap(counts) {
  const source = counts && typeof counts === "object" && !Array.isArray(counts) ? counts : {};

  return CAMPER_HABIT_IDS.reduce(function(cleanCounts, habitId) {
    cleanCounts[habitId] = Math.max(0, Math.floor(Number(source[habitId]) || 0));
    return cleanCounts;
  }, {});
}

function createDefaultCamperHabitStats() {
  return {
    totals: createCamperHabitCountMap(),
    influenceTotals: createCamperHabitCountMap(),
    daily: {
      dateKey: "",
      influenceCounts: createCamperHabitCountMap()
    }
  };
}

function sanitizeCamperHabitStats(habitStats) {
  const source = habitStats && typeof habitStats === "object" && !Array.isArray(habitStats) ? habitStats : {};
  const daily = source.daily && typeof source.daily === "object" && !Array.isArray(source.daily) ? source.daily : {};

  return {
    totals: sanitizeCamperHabitCountMap(source.totals),
    influenceTotals: sanitizeCamperHabitCountMap(source.influenceTotals),
    daily: {
      dateKey: typeof daily.dateKey === "string" ? daily.dateKey : "",
      influenceCounts: sanitizeCamperHabitCountMap(daily.influenceCounts)
    }
  };
}

function getCamperHabitGrowthUnits(influenceCount) {
  return Math.log2(1 + Math.max(0, Number(influenceCount) || 0));
}

function calculateCamperHabitModifiers(habitStats) {
  const stats = sanitizeCamperHabitStats(habitStats);
  const modifiers = CAMPER_TRAIT_KEYS.reduce(function(values, traitId) {
    values[traitId] = 0;
    return values;
  }, {});

  CAMPER_HABIT_IDS.forEach(function(habitId) {
    const definition = CAMPER_HABIT_DEFINITIONS[habitId];
    const traitWeights = definition && definition.traitWeights || {};
    const growthUnits = getCamperHabitGrowthUnits(stats.influenceTotals[habitId]);

    Object.keys(traitWeights).forEach(function(traitId) {
      if (modifiers[traitId] === undefined) {
        return;
      }

      modifiers[traitId] += (Number(traitWeights[traitId]) || 0) * growthUnits;
    });
  });

  CAMPER_TRAIT_KEYS.forEach(function(traitId) {
    modifiers[traitId] = Number(clamp(
      modifiers[traitId],
      CAMPER_HABIT_MODIFIER_RANGE.min,
      CAMPER_HABIT_MODIFIER_RANGE.max
    ).toFixed(2));
  });

  return modifiers;
}

function ensureCamperHabitStatsForToday(profile, date) {
  const habitStats = sanitizeCamperHabitStats(profile && profile.habitStats);
  const dateKey = getLocalDateKey(date);

  if (habitStats.daily.dateKey !== dateKey) {
    habitStats.daily = {
      dateKey: dateKey,
      influenceCounts: createCamperHabitCountMap()
    };
  }

  if (profile) {
    profile.habitStats = habitStats;
  }

  return habitStats;
}

function recordCamperHabitCompletion(habitId, date) {
  if (CAMPER_HABIT_IDS.indexOf(habitId) === -1) {
    return null;
  }

  const profile = getActiveCamperProfile(gameState);

  if (!profile) {
    return null;
  }

  const habitStats = ensureCamperHabitStatsForToday(profile, date);
  const dailyCount = habitStats.daily.influenceCounts[habitId];
  const influencesTraits = dailyCount < CAMPER_HABIT_DAILY_INFLUENCE_LIMIT;

  habitStats.totals[habitId] += 1;

  if (influencesTraits) {
    habitStats.daily.influenceCounts[habitId] += 1;
    habitStats.influenceTotals[habitId] += 1;
  }

  profile.habitModifiers = calculateCamperHabitModifiers(habitStats);
  profile.updatedAt = Date.now();
  saveGame();

  return {
    total: habitStats.totals[habitId],
    influenceTotal: habitStats.influenceTotals[habitId],
    dailyInfluenceCount: habitStats.daily.influenceCounts[habitId],
    influencesTraits: influencesTraits
  };
}

function recordCamperActivityHabitCompletion(activityId) {
  const habitId = CAMPER_ACTIVITY_HABIT_MAP[activityId];
  const result = habitId ? recordCamperHabitCompletion(habitId) : null;

  if (CAMPER_EXPLORING_ACTIVITY_IDS.indexOf(activityId) !== -1) {
    recordCamperHabitCompletion("exploring");
  }

  return result;
}

function recordCamperActionHabitCompletion(actionId) {
  const habitId = CAMPER_COMPLETED_ACTION_HABIT_MAP[actionId];
  return habitId ? recordCamperHabitCompletion(habitId) : null;
}

function createNeutralDailyAdventureModifiers(dateKey) {
  return {
    dateKey: typeof dateKey === "string" ? dateKey : "",
    generalLuck: 0,
    treasureLuck: 0,
    socialLuck: 0,
    healthLuck: 0,
    dangerSense: 0
  };
}

function clampDailyAdventureModifier(value) {
  return clamp(
    Math.round(Number(value) || 0),
    DAILY_ADVENTURE_MODIFIER_RANGE.min,
    DAILY_ADVENTURE_MODIFIER_RANGE.max
  );
}

function getDivinationActivityWeightValues(record) {
  const result = record && record.result;
  const effects = record && record.effects && typeof record.effects === "object" ? record.effects : result && result.effects;
  const activityWeights = effects && effects.activityWeights && typeof effects.activityWeights === "object" ? effects.activityWeights : {};

  return Object.keys(activityWeights).map(function(activityId) {
    return Number(activityWeights[activityId]);
  }).filter(Number.isFinite);
}

function getDivinationAdventureSignal(record) {
  const result = record && record.result;

  if (!result || typeof result !== "object") {
    return 0;
  }

  if (record.method === "turtle" || result.method === "turtle" || result.type === "turtle") {
    return TURTLE_FORTUNE_ADVENTURE_SCORES[result.fortune] || 0;
  }

  const orientationSignal = result.orientation === "reversed" ? -2 : result.orientation === "upright" ? 2 : 0;
  const activityWeights = getDivinationActivityWeightValues(record);
  const activitySignal = activityWeights.length > 0
    ? activityWeights.reduce(function(total, weight) { return total + clamp(weight, -1, 1); }, 0) / activityWeights.length * 4
    : 0;

  return clampDailyAdventureModifier(orientationSignal + activitySignal);
}

function getDivinationCautionSignal(record) {
  const result = record && record.result;
  const negativeWeightTotal = getDivinationActivityWeightValues(record).reduce(function(total, weight) {
    return total + (weight < 0 ? Math.min(1, Math.abs(weight)) : 0);
  }, 0);
  const avoidSignal = result && Array.isArray(result.avoid) && result.avoid.length > 0 ? 1 : 0;

  return negativeWeightTotal * 4 + avoidSignal;
}

function getDailyDivinationRecordsForQuestion(todayDivinations, questionId) {
  const records = todayDivinations && todayDivinations.records || {};

  return ["tarot", "turtle"].map(function(method) {
    const record = records[method] && records[method][questionId];
    return record && record.result ? record : null;
  }).filter(Boolean);
}

function mergeDailyDivinationSignals(records, signalGetter) {
  if (!records.length) {
    return 0;
  }

  const total = records.reduce(function(sum, record) {
    return sum + signalGetter(record);
  }, 0);

  return clampDailyAdventureModifier(total / records.length);
}

function buildDailyAdventureModifiers(todayDivinations, dateKey) {
  const modifiers = createNeutralDailyAdventureModifiers(dateKey);

  Object.keys(DAILY_ADVENTURE_QUESTION_MAP).forEach(function(questionId) {
    const modifierId = DAILY_ADVENTURE_QUESTION_MAP[questionId];
    const records = getDailyDivinationRecordsForQuestion(todayDivinations, questionId);
    modifiers[modifierId] = mergeDailyDivinationSignals(records, getDivinationAdventureSignal);
  });

  const overallRecords = getDailyDivinationRecordsForQuestion(todayDivinations, "overall");

  if (overallRecords.length > 0) {
    const cautionSignal = mergeDailyDivinationSignals(overallRecords, getDivinationCautionSignal);
    modifiers.dangerSense = clampDailyAdventureModifier(-modifiers.generalLuck * 0.75 + cautionSignal);
  }

  return modifiers;
}

function sanitizeDailyAdventureModifiers(dailyAdventureModifiers, dateKey, todayDivinations) {
  const expectedDateKey = typeof dateKey === "string" ? dateKey : "";
  return buildDailyAdventureModifiers(todayDivinations, expectedDateKey);
}

function ensureDailyAdventureModifiersForToday(date, state) {
  const campState = state || gameState;
  const dateKey = getDivinationDateKey(date);
  const todayDivinations = ensureTodayDivinationsForToday(date || new Date(), campState);

  campState.dailyAdventureModifiers = buildDailyAdventureModifiers(todayDivinations, dateKey);
  return campState.dailyAdventureModifiers;
}
