(function () {
  function getCatalog() {
    if (typeof window !== "undefined" && window.CAMP_DIVINATION_CATALOG) {
      return window.CAMP_DIVINATION_CATALOG;
    }

    if (typeof require === "function") {
      try {
        return require("./divinationCatalog.js");
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  function getQuestionIds() {
    const catalog = getCatalog();
    return catalog && Array.isArray(catalog.questionIds) ? catalog.questionIds.slice() : ["overall", "relationship", "bodyMind", "money"];
  }

  function getQuestion(questionId) {
    const catalog = getCatalog();
    const questions = catalog && catalog.questions ? catalog.questions : {};
    return questions[questionId] || questions.overall || null;
  }

  function normalizeQuestionId(questionId) {
    return getQuestion(questionId) ? questionId : getQuestionIds()[0];
  }

  function normalizeMethod(method) {
    return method === "turtle" ? "turtle" : "tarot";
  }

  function getLocalDateKey(date) {
    const current = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function hashStringToUint32(value) {
    const text = String(value);
    let hash = 2166136261;

    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  function seededUnit(value) {
    return hashStringToUint32(value) / 4294967296;
  }

  function pickFromArray(items, seed) {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    return items[Math.floor(seededUnit(seed) * items.length) % items.length];
  }

  function cloneEffects(effects) {
    const source = effects && typeof effects === "object" && !Array.isArray(effects) ? effects : {};
    return {
      activityWeights: { ...(source.activityWeights || {}) },
      activityLabels: Array.isArray(source.activityLabels) ? source.activityLabels.slice() : [],
      soundRecommendations: Array.isArray(source.soundRecommendations) ? source.soundRecommendations.map(function(item) {
        return { ...item };
      }) : [],
      moodLine: typeof source.moodLine === "string" ? source.moodLine : "",
      thoughtLines: Array.isArray(source.thoughtLines) ? source.thoughtLines.slice() : []
    };
  }

  function addUnique(list, value) {
    if (value && list.indexOf(value) === -1) {
      list.push(value);
    }
  }

  function addUniqueRecommendation(list, recommendation) {
    if (!recommendation || !recommendation.id) {
      return;
    }

    const exists = list.some(function(item) {
      return item && item.id === recommendation.id;
    });

    if (!exists) {
      list.push({ ...recommendation });
    }
  }

  function mergeEffects() {
    const merged = cloneEffects();

    Array.prototype.slice.call(arguments).forEach(function(effects) {
      const next = cloneEffects(effects);

      Object.keys(next.activityWeights).forEach(function(activityId) {
        merged.activityWeights[activityId] = (Number(merged.activityWeights[activityId]) || 0) + (Number(next.activityWeights[activityId]) || 0);
      });
      next.activityLabels.forEach(function(label) {
        addUnique(merged.activityLabels, label);
      });
      next.soundRecommendations.forEach(function(recommendation) {
        addUniqueRecommendation(merged.soundRecommendations, recommendation);
      });
      if (next.moodLine) {
        merged.moodLine = next.moodLine;
      }
      next.thoughtLines.forEach(function(line) {
        addUnique(merged.thoughtLines, line);
      });
    });

    return merged;
  }

  function buildReality(question, text) {
    return [question.realityLens, text, question.boundary].filter(Boolean).join(" ");
  }

  function buildAdvice(question, text) {
    return [question.adviceLens, text].filter(Boolean).join(" ");
  }

  function buildCampImpact(question, text) {
    return [question.campLens, text].filter(Boolean).join(" ");
  }

  function createEmptyTodayDivination(dateKey) {
    return {
      date: dateKey || "",
      method: "",
      question: "",
      result: null,
      effects: cloneEffects()
    };
  }

  function sanitizeSavedDivination(saved, dateKey) {
    const source = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    const clean = createEmptyTodayDivination(dateKey || "");

    if (!source.date || dateKey && source.date !== dateKey) {
      return clean;
    }

    clean.date = source.date;
    clean.method = source.method === "turtle" ? "turtle" : source.method === "tarot" ? "tarot" : "";
    clean.question = getQuestion(source.question) ? source.question : "";
    clean.result = source.result && typeof source.result === "object" && !Array.isArray(source.result) ? { ...source.result } : null;
    clean.effects = cloneEffects(source.effects);

    if (!clean.method || !clean.question || !clean.result) {
      return createEmptyTodayDivination(dateKey || source.date || "");
    }

    return clean;
  }

  function createEmptyTodayDivinations(dateKey) {
    return {
      date: dateKey || "",
      active: {
        method: "",
        question: ""
      },
      records: {
        tarot: {},
        turtle: {}
      },
      rerollSalt: {
        tarot: {},
        turtle: {}
      }
    };
  }

  function getSavedDivination(dailyDivinations, method, questionId) {
    if (method !== "tarot" && method !== "turtle" || getQuestionIds().indexOf(questionId) === -1) {
      return null;
    }

    const records = dailyDivinations && dailyDivinations.records;
    const methodRecords = records && records[method];
    const record = methodRecords && methodRecords[questionId];
    return record && record.result ? record : null;
  }

  function sanitizeSavedDivinations(saved, dateKey, legacySaved) {
    const source = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    const clean = createEmptyTodayDivinations(dateKey || "");

    if (source.date && (!dateKey || source.date === dateKey)) {
      clean.date = source.date;
      ["tarot", "turtle"].forEach(function(method) {
        const methodRecords = source.records && source.records[method];
        if (methodRecords && typeof methodRecords === "object" && !Array.isArray(methodRecords)) {
          getQuestionIds().forEach(function(questionId) {
            const record = sanitizeSavedDivination(methodRecords[questionId], clean.date);
            if (record.method === method && record.question === questionId && record.result) {
              clean.records[method][questionId] = record;
            }
          });
        }

        const methodRerollSalt = source.rerollSalt && source.rerollSalt[method];
        if (methodRerollSalt && typeof methodRerollSalt === "object" && !Array.isArray(methodRerollSalt)) {
          getQuestionIds().forEach(function(questionId) {
            const rerollSalt = Math.max(0, Math.floor(Number(methodRerollSalt[questionId]) || 0));
            if (rerollSalt > 0) {
              clean.rerollSalt[method][questionId] = rerollSalt;
            }
          });
        }
      });

      const activeMethod = source.active && source.active.method;
      const activeQuestion = source.active && source.active.question;
      if (getSavedDivination(clean, activeMethod, activeQuestion)) {
        clean.active.method = activeMethod;
        clean.active.question = activeQuestion;
      }
    }

    const legacy = sanitizeSavedDivination(legacySaved, dateKey || "");
    if (legacy.result && !getSavedDivination(clean, legacy.method, legacy.question)) {
      clean.date = legacy.date;
      clean.records[legacy.method][legacy.question] = legacy;
      if (!clean.active.method) {
        clean.active.method = legacy.method;
        clean.active.question = legacy.question;
      }
    }

    if (!clean.date) {
      clean.date = dateKey || "";
    }

    if (!getSavedDivination(clean, clean.active.method, clean.active.question)) {
      const firstRecord = ["tarot", "turtle"].reduce(function(found, method) {
        if (found) {
          return found;
        }
        const questionId = getQuestionIds().find(function(id) {
          return Boolean(clean.records[method][id]);
        });
        return questionId ? { method: method, question: questionId } : null;
      }, null);

      clean.active = firstRecord || { method: "", question: "" };
    }

    return clean;
  }

  function getTarotCards() {
    const catalog = getCatalog();
    return catalog && Array.isArray(catalog.tarotCards) ? catalog.tarotCards : [];
  }

  function getTurtleResults() {
    const catalog = getCatalog();
    return catalog && Array.isArray(catalog.turtleResults) ? catalog.turtleResults : [];
  }

  function getMethodDefinition(method) {
    const catalog = getCatalog();
    return catalog && catalog.methods ? catalog.methods[normalizeMethod(method)] : null;
  }

  function createTarotResult(options) {
    const dateKey = options && options.dateKey || getLocalDateKey();
    const userSeed = options && options.userSeed || "camp-divination";
    const salt = options && options.salt || "daily";
    const questionId = normalizeQuestionId(options && options.questionId);
    const question = getQuestion(questionId);
    const cards = getTarotCards();
    const card = pickFromArray(cards, userSeed + ":" + dateKey + ":" + questionId + ":" + salt + ":tarot-card") || cards[0];
    const reversed = seededUnit(userSeed + ":" + dateKey + ":" + questionId + ":" + salt + ":tarot-reversed") < 0.35;
    const orientation = reversed ? "reversed" : "upright";
    const reading = card && card[orientation] ? card[orientation] : card && card.upright || {};
    const effects = mergeEffects(question && question.effects, card && card.baseEffects, reading.effects, {
      moodLine: reading.moodLine || "",
      thoughtLines: reading.thoughtLines || []
    });

    return {
      type: "tarot",
      method: "tarot",
      question: questionId,
      questionLabel: question ? question.label : questionId,
      title: card ? card.name : "Camping Tarot",
      subtitle: reversed ? "逆位" : "正位",
      cardId: card ? card.id : "",
      orientation: orientation,
      image: card ? card.image : "",
      keywords: Array.isArray(reading.keywords) ? reading.keywords.slice() : [],
      reality: question ? buildReality(question, reading.reality || "") : reading.reality || "",
      advice: question ? buildAdvice(question, reading.advice || "") : reading.advice || "",
      campImpact: question ? buildCampImpact(question, reading.campImpact || "") : reading.campImpact || "",
      effects: effects
    };
  }

  function createTurtleLines(options) {
    const dateKey = options && options.dateKey || getLocalDateKey();
    const userSeed = options && options.userSeed || "camp-divination";
    const questionId = normalizeQuestionId(options && options.questionId);
    const salt = options && options.salt || "daily";
    const lines = [];

    for (let index = 0; index < 6; index += 1) {
      const roll = seededUnit(userSeed + ":" + dateKey + ":" + questionId + ":" + salt + ":turtle-line:" + index);
      const yang = roll >= 0.5;
      lines.push({
        index: index,
        type: yang ? "yang" : "yin",
        value: yang ? 1 : 0
      });
    }

    return lines;
  }

  function normalizeTurtleLines(lines, fallbackOptions) {
    if (!Array.isArray(lines) || lines.length !== 6) {
      return createTurtleLines(fallbackOptions);
    }

    return lines.slice(0, 6).map(function(line, index) {
      const type = line && line.type === "yang" || line === "yang" || line === 1 ? "yang" : "yin";
      return {
        index: index,
        type: type,
        value: type === "yang" ? 1 : 0
      };
    });
  }

  function pickTurtleResult(lines, seed) {
    const results = getTurtleResults().slice().sort(function(a, b) {
      return Number(b.minScore) - Number(a.minScore);
    });
    const score = lines.reduce(function(total, line) {
      return total + (line && line.value ? 1 : 0);
    }, 0);
    const candidates = results.filter(function(result) {
      return score >= Number(result.minScore || 0);
    });
    const band = candidates.length > 0 ? candidates : results;
    return pickFromArray(band, seed + ":turtle-result:" + score) || band[0] || null;
  }

  function createTurtleResult(options) {
    const dateKey = options && options.dateKey || getLocalDateKey();
    const userSeed = options && options.userSeed || "camp-divination";
    const salt = options && options.salt || "daily";
    const questionId = normalizeQuestionId(options && options.questionId);
    const question = getQuestion(questionId);
    const lines = normalizeTurtleLines(options && options.lines, { dateKey: dateKey, userSeed: userSeed, questionId: questionId, salt: salt });
    const turtle = pickTurtleResult(lines, userSeed + ":" + dateKey + ":" + questionId + ":" + salt);
    const effects = mergeEffects(question && question.effects, turtle && turtle.effects);

    return {
      type: "turtle",
      method: "turtle",
      question: questionId,
      questionLabel: question ? question.label : questionId,
      title: turtle ? turtle.name : "龟壳",
      subtitle: turtle ? turtle.fortune : "平",
      turtleResultId: turtle ? turtle.id : "",
      fortune: turtle ? turtle.fortune : "平",
      lines: lines,
      goodFor: turtle && Array.isArray(turtle.goodFor) ? turtle.goodFor.slice() : [],
      avoid: turtle && Array.isArray(turtle.avoid) ? turtle.avoid.slice() : [],
      reality: question ? buildReality(question, turtle ? turtle.reality : "") : turtle && turtle.reality || "",
      advice: question ? buildAdvice(question, turtle ? turtle.advice : "") : turtle && turtle.advice || "",
      campImpact: question ? buildCampImpact(question, turtle ? turtle.campImpact : "") : turtle && turtle.campImpact || "",
      effects: effects
    };
  }

  function createResult(options) {
    const method = normalizeMethod(options && options.method);

    if (method === "turtle") {
      return createTurtleResult(options);
    }

    return createTarotResult(options);
  }

  const api = {
    getCatalog: getCatalog,
    getQuestionIds: getQuestionIds,
    getQuestion: getQuestion,
    normalizeQuestionId: normalizeQuestionId,
    normalizeMethod: normalizeMethod,
    getLocalDateKey: getLocalDateKey,
    createEmptyTodayDivination: createEmptyTodayDivination,
    sanitizeSavedDivination: sanitizeSavedDivination,
    createEmptyTodayDivinations: createEmptyTodayDivinations,
    sanitizeSavedDivinations: sanitizeSavedDivinations,
    getSavedDivination: getSavedDivination,
    getMethodDefinition: getMethodDefinition,
    createTurtleLines: createTurtleLines,
    createResult: createResult,
    cloneEffects: cloneEffects,
    mergeEffects: mergeEffects
  };

  if (typeof window !== "undefined") {
    window.CAMP_DIVINATION_MANAGER = api;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
