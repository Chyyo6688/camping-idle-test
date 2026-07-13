const fs = require("fs");
const vm = require("vm");

const requestedRuns = Math.max(50000, Math.floor(Number(process.argv[2]) || 50000));
const sourceFiles = [
  "js/config/camperConfig.js",
  "js/config/camperProgressionConfig.js"
];
const configSource = sourceFiles.map(function(file) {
  return fs.readFileSync(file, "utf8");
}).join("\n");
const progressionSource = fs.readFileSync("js/systems/gameCamperProgression.js", "utf8");
const profileSource = fs.readFileSync("js/camper/gameCamperProfile.js", "utf8");
const context = {};

vm.createContext(context);
vm.runInContext(
  configSource +
  "\nfunction clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }" +
  "\nfunction getLocalDateKey() { return '2026-07-12'; }" +
  "\nfunction getDivinationDateKey() { return '2026-07-12'; }" +
  "\nfunction ensureTodayDivinationsForToday(date, state) { return state.todayDivinations; }" +
  "\nlet gameState = { activeCamperIndex: 0, campers: [], todayDivinations: { records: { tarot: {}, turtle: {} } } };" +
  "\nlet saveCount = 0; function saveGame() { saveCount += 1; }" +
  "\n" + progressionSource +
  "\n" + profileSource +
  `
  function assertSimulation(condition, message) {
    if (!condition) throw new Error(message);
  }

  const simulationRuns = ${requestedRuns};
  const personalityIds = Object.keys(CAMPER_PERSONALITIES);
  const occurrenceCounts = Object.fromEntries(personalityIds.map(function(id) { return [id, 0]; }));
  const tieParticipationCounts = Object.fromEntries(personalityIds.map(function(id) { return [id, 0]; }));
  const tieWinCounts = Object.fromEntries(personalityIds.map(function(id) { return [id, 0]; }));
  const tieSignatureCounts = {};
  const aggregateMainCoverage = Object.fromEntries(personalityIds.map(function(id) { return [id, 0]; }));
  const baseTraitStats = Object.fromEntries(personalityIds.map(function(id) {
    return [id, {
      count: 0,
      combinations: new Set(),
      traits: Object.fromEntries(CAMPER_TRAIT_KEYS.map(function(traitId) {
        return [traitId, { min: Infinity, max: -Infinity, sum: 0, unique: new Set(), nearBoundary: 0 }];
      }))
    }];
  }));

  let tieRounds = 0;
  let wrongQuestionCountRounds = 0;
  let categorySelectionViolations = 0;
  let mainCoverageViolations = 0;
  let minimumMainCoverage = Infinity;
  let maximumMainCoverage = -Infinity;

  function scoreAnswers(answers) {
    const scores = Object.fromEntries(personalityIds.map(function(id) { return [id, 0]; }));
    answers.forEach(function(answer) {
      const personalityScores = answer && (answer.personalityScores || answer.traits) || {};
      Object.keys(personalityScores).forEach(function(id) {
        scores[id] = (scores[id] || 0) + (Number(personalityScores[id]) || 0);
      });
    });
    return scores;
  }

  for (let runIndex = 0; runIndex < simulationRuns; runIndex += 1) {
    const questions = pickCamperProfileQuestions();
    if (questions.length !== 5) wrongQuestionCountRounds += 1;

    const categoryHits = CAMPER_PROFILE_QUESTION_CATEGORIES.map(function(category) {
      return questions.filter(function(question) { return category.questions.indexOf(question) !== -1; }).length;
    });
    if (categoryHits.some(function(count) { return count !== 1; })) categorySelectionViolations += 1;

    const roundMainCoverage = Object.fromEntries(personalityIds.map(function(id) { return [id, 0]; }));
    questions.forEach(function(question) {
      question.options.forEach(function(option) {
        Object.keys(option.personalityScores || {}).forEach(function(id) {
          if (option.personalityScores[id] === 3) {
            roundMainCoverage[id] += 1;
            aggregateMainCoverage[id] += 1;
          }
        });
      });
    });
    const roundCoverageValues = personalityIds.map(function(id) { return roundMainCoverage[id]; });
    const roundMinCoverage = Math.min.apply(null, roundCoverageValues);
    const roundMaxCoverage = Math.max.apply(null, roundCoverageValues);
    minimumMainCoverage = Math.min(minimumMainCoverage, roundMinCoverage);
    maximumMainCoverage = Math.max(maximumMainCoverage, roundMaxCoverage);
    if (roundMaxCoverage - roundMinCoverage > 1) mainCoverageViolations += 1;

    const answers = questions.map(function(question) {
      return question.options[Math.floor(Math.random() * question.options.length)];
    });
    const scores = scoreAnswers(answers);
    const highestScore = Math.max.apply(null, personalityIds.map(function(id) { return scores[id]; }));
    const tiedIds = personalityIds.filter(function(id) { return scores[id] === highestScore; });
    const result = buildCamperProfileResult("Simulation", questions, answers, {});

    assertSimulation(tiedIds.indexOf(result.personalityId) !== -1, "Winner was not in highest-score tie set");
    occurrenceCounts[result.personalityId] += 1;

    if (tiedIds.length > 1) {
      tieRounds += 1;
      const signature = tiedIds.slice().sort().join("+");
      tieSignatureCounts[signature] = (tieSignatureCounts[signature] || 0) + 1;
      tiedIds.forEach(function(id) { tieParticipationCounts[id] += 1; });
      tieWinCounts[result.personalityId] += 1;
    }

    const personalityTraitStats = baseTraitStats[result.personalityId];
    const combination = CAMPER_TRAIT_KEYS.map(function(traitId) { return result.baseTraits[traitId]; }).join("|");
    personalityTraitStats.count += 1;
    personalityTraitStats.combinations.add(combination);
    CAMPER_TRAIT_KEYS.forEach(function(traitId) {
      const value = result.baseTraits[traitId];
      const stats = personalityTraitStats.traits[traitId];
      stats.min = Math.min(stats.min, value);
      stats.max = Math.max(stats.max, value);
      stats.sum += value;
      stats.unique.add(value);
      if (value <= CAMPER_TRAIT_RANGE.min + 5 || value >= CAMPER_TRAIT_RANGE.max - 5) stats.nearBoundary += 1;
    });
  }

  const originalRandom = Math.random;
  const syntheticTieAnswers = Array.from({ length: 5 }, function() {
    return { personalityScores: { slowMood: 3, picnicFirst: 3 }, traitModifiers: {} };
  });
  Math.random = function() { return 0; };
  const lowTieWinner = buildCamperProfileResult("TieLow", [{}, {}, {}, {}, {}], syntheticTieAnswers, {}).personalityId;
  Math.random = function() { return 0.999999; };
  const highTieWinner = buildCamperProfileResult("TieHigh", [{}, {}, {}, {}, {}], syntheticTieAnswers, {}).personalityId;
  Math.random = originalRandom;
  assertSimulation(lowTieWinner === "slowMood" && highTieWinner === "picnicFirst", "Tie selection does not cover the full tied set");
  const syntheticTieTrials = 20000;
  const syntheticTieWins = { slowMood: 0, picnicFirst: 0 };
  for (let trial = 0; trial < syntheticTieTrials; trial += 1) {
    const winner = buildCamperProfileResult("TieRandom", [{}, {}, {}, {}, {}], syntheticTieAnswers, {}).personalityId;
    syntheticTieWins[winner] += 1;
  }
  const syntheticTieSlowRate = syntheticTieWins.slowMood / syntheticTieTrials;
  assertSimulation(syntheticTieSlowRate > 0.47 && syntheticTieSlowRate < 0.53, "Synthetic tie selection is not approximately uniform");

  const missingTraitsProfile = sanitizeCamperProfile({
    id: "legacy-missing-traits",
    name: "Legacy",
    personalityId: "forestWanderer",
    appearance: {}
  });
  const missingTraitsFilled = CAMPER_TRAIT_KEYS.every(function(traitId) {
    return missingTraitsProfile.baseTraits[traitId] === CAMPER_DEFAULT_TRAITS.forestWanderer[traitId];
  });

  const legalBaseTraits = Object.fromEntries(CAMPER_TRAIT_KEYS.map(function(traitId, index) {
    return [traitId, 20 + index * 7];
  }));
  const legalTraitsProfile = sanitizeCamperProfile({
    id: "legacy-legal-traits",
    name: "Legal",
    personalityId: "slowMood",
    appearance: {},
    baseTraits: legalBaseTraits
  });
  const legalTraitsPreserved = CAMPER_TRAIT_KEYS.every(function(traitId) {
    return legalTraitsProfile.baseTraits[traitId] === legalBaseTraits[traitId];
  });

  gameState.campers = [legalTraitsProfile];
  gameState.activeCamperIndex = 0;
  let retakeResult = null;
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const questions = pickCamperProfileQuestions();
    const answers = questions.map(function(question) {
      return question.options[Math.floor(Math.random() * question.options.length)];
    });
    const candidate = buildCamperProfileResult("Legal", questions, answers, legalTraitsProfile.appearance);
    if (candidate.personalityId !== legalTraitsProfile.personalityId && JSON.stringify(candidate.baseTraits) !== JSON.stringify(legalBaseTraits)) {
      retakeResult = candidate;
      break;
    }
  }
  assertSimulation(Boolean(retakeResult), "Could not generate a changed retake result");
  const savedRetake = setActiveCamperProfile(retakeResult);
  const retakeSavedTogether = Boolean(
    savedRetake &&
    savedRetake.personalityId === retakeResult.personalityId &&
    JSON.stringify(savedRetake.baseTraits) === JSON.stringify(retakeResult.baseTraits) &&
    gameState.campers[0].personalityId === retakeResult.personalityId &&
    JSON.stringify(gameState.campers[0].baseTraits) === JSON.stringify(retakeResult.baseTraits)
  );

  const effectSignatureGroups = {};
  CAMPER_PROFILE_QUESTION_CATEGORIES.forEach(function(category) {
    category.questions.forEach(function(question) {
      question.options.forEach(function(option) {
        const signature = JSON.stringify({
          personalityScores: option.personalityScores,
          traitModifiers: option.traitModifiers
        });
        if (!effectSignatureGroups[signature]) effectSignatureGroups[signature] = [];
        effectSignatureGroups[signature].push({ category: category.label, question: question.text, answer: option.text });
      });
    });
  });
  const duplicateEffectGroups = Object.values(effectSignatureGroups)
    .filter(function(group) { return group.length > 1; })
    .sort(function(a, b) { return b.length - a.length; });

  const personalityResults = Object.fromEntries(personalityIds.map(function(id) {
    const count = occurrenceCounts[id];
    return [id, { count: count, ratePercent: Number((count / simulationRuns * 100).toFixed(3)) }];
  }));
  const rates = personalityIds.map(function(id) { return personalityResults[id].ratePercent; });
  const traitResults = Object.fromEntries(personalityIds.map(function(id) {
    const stats = baseTraitStats[id];
    const traitSummary = Object.fromEntries(CAMPER_TRAIT_KEYS.map(function(traitId) {
      const trait = stats.traits[traitId];
      return [traitId, {
        min: trait.min,
        max: trait.max,
        average: Number((trait.sum / stats.count).toFixed(3)),
        uniqueValues: trait.unique.size,
        nearBoundaryRatePercent: Number((trait.nearBoundary / stats.count * 100).toFixed(3))
      }];
    }));
    const lowVariationTraits = CAMPER_TRAIT_KEYS.filter(function(traitId) {
      const trait = stats.traits[traitId];
      return trait.max - trait.min <= 1 || trait.unique.size <= 2;
    });
    const boundaryConcernTraits = CAMPER_TRAIT_KEYS.filter(function(traitId) {
      const trait = stats.traits[traitId];
      return trait.nearBoundary / stats.count >= 0.5;
    });
    return [id, {
      samples: stats.count,
      differentCombinations: stats.combinations.size,
      sufficientVariation: stats.combinations.size >= 20 && lowVariationTraits.length <= 2,
      lowVariationTraits: lowVariationTraits,
      boundaryConcernTraits: boundaryConcernTraits,
      traits: traitSummary
    }];
  }));

  this.__simulationReport = {
    runs: simulationRuns,
    personalities: personalityResults,
    appearanceRateGapPercentagePoints: Number((Math.max.apply(null, rates) - Math.min.apply(null, rates)).toFixed(3)),
    ties: {
      rounds: tieRounds,
      ratePercent: Number((tieRounds / simulationRuns * 100).toFixed(3)),
      participation: Object.fromEntries(personalityIds.map(function(id) {
        return [id, {
          rounds: tieParticipationCounts[id],
          rateAmongTieRoundsPercent: Number((tieParticipationCounts[id] / Math.max(1, tieRounds) * 100).toFixed(3)),
          selectedWins: tieWinCounts[id]
        }];
      })),
      signatures: Object.entries(tieSignatureCounts).map(function(entry) {
        return { personalities: entry[0], rounds: entry[1] };
      }).sort(function(a, b) { return b.rounds - a.rounds; }),
      syntheticBoundaryCheck: { lowRollWinner: lowTieWinner, highRollWinner: highTieWinner },
      syntheticRandomCheck: {
        trials: syntheticTieTrials,
        wins: syntheticTieWins,
        ratesPercent: {
          slowMood: Number((syntheticTieWins.slowMood / syntheticTieTrials * 100).toFixed(3)),
          picnicFirst: Number((syntheticTieWins.picnicFirst / syntheticTieTrials * 100).toFixed(3))
        }
      }
    },
    questionnaireValidation: {
      wrongQuestionCountRounds: wrongQuestionCountRounds,
      categorySelectionViolations: categorySelectionViolations,
      mainCoverageViolations: mainCoverageViolations,
      minimumMainCoveragePerPersonalityPerQuestionnaire: minimumMainCoverage,
      maximumMainCoveragePerPersonalityPerQuestionnaire: maximumMainCoverage,
      aggregateMainCoverage: aggregateMainCoverage
    },
    baseTraitsByPersonality: traitResults,
    compatibility: {
      missingBaseTraitsFilledFromPersonality: missingTraitsFilled,
      legalBaseTraitsPreserved: legalTraitsPreserved,
      retakeRegeneratedAndSavedTogether: retakeSavedTogether,
      retakeFromPersonality: legalTraitsProfile.personalityId,
      retakeToPersonality: retakeResult.personalityId,
      saveCalls: saveCount
    },
    duplicateEffectGroups: duplicateEffectGroups
  };
  `,
  context,
  { timeout: 120000 }
);

console.log(JSON.stringify(context.__simulationReport, null, 2));
