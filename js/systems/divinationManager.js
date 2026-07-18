(function () {
  const TURTLE_PRESENTATION_VERSION = 3;

  function getCatalog() {
    if (typeof window !== "undefined" && window.CAMP_DIVINATION_CATALOG) {
      return window.CAMP_DIVINATION_CATALOG;
    }

    if (typeof require === "function") {
      try {
        return require("../config/divinationCatalog.js");
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  function getIChingCatalog() {
    if (typeof window !== "undefined" && window.CAMP_ICHING_CATALOG) {
      return window.CAMP_ICHING_CATALOG;
    }

    if (typeof require === "function") {
      try {
        return require("../config/ichingCatalog.js");
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
    return [question.realityLens, text].filter(Boolean).join(" ");
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

    if (clean.method === "turtle" &&
        clean.result.primaryHexagram &&
        clean.result.changedHexagram &&
        Array.isArray(clean.result.lines) &&
        (clean.result.presentationVersion !== TURTLE_PRESENTATION_VERSION || !clean.result.judgmentAnalysis || !clean.result.summary || !clean.result.interpretation ||
          typeof clean.result.selectedTextSummary !== "string" || !Array.isArray(clean.result.notices))) {
      const upgradedResult = createTurtleResult({
        method: "turtle",
        questionId: clean.question,
        dateKey: clean.date,
        lines: clean.result.lines,
        salt: "saved"
      });
      if (upgradedResult) {
        clean.result = { ...clean.result, ...upgradedResult };
        clean.effects = cloneEffects(upgradedResult.effects);
      }
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

  function mixUint32(value) {
    let mixed = value >>> 0;
    mixed ^= mixed >>> 16;
    mixed = Math.imul(mixed, 0x7feb352d);
    mixed ^= mixed >>> 15;
    mixed = Math.imul(mixed, 0x846ca68b);
    mixed ^= mixed >>> 16;
    return mixed >>> 0;
  }

  function randomUnit() {
    if (typeof crypto !== "undefined" && crypto && typeof crypto.getRandomValues === "function") {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return values[0] / 4294967296;
    }
    return Math.random();
  }

  function createCoin(seed, index) {
    const yang = randomUnit() >= 0.5;
    return {
      index: index,
      side: yang ? "yang" : "yin",
      value: yang ? 3 : 2
    };
  }

  function buildTurtleLine(coins, index) {
    const normalizedCoins = coins.slice(0, 3).map(function(coin, coinIndex) {
      const side = coin && coin.side === "yang" ? "yang" : "yin";
      return {
        index: coinIndex,
        side: side,
        value: side === "yang" ? 3 : 2
      };
    });
    const total = normalizedCoins.reduce(function(sum, coin) {
      return sum + coin.value;
    }, 0);
    const typeByTotal = {
      6: "oldYin",
      7: "youngYang",
      8: "youngYin",
      9: "oldYang"
    };
    const yinYang = total === 7 || total === 9 ? "yang" : "yin";
    const moving = total === 6 || total === 9;

    return {
      index: index,
      position: index + 1,
      coins: normalizedCoins,
      total: total,
      type: typeByTotal[total],
      yinYang: yinYang,
      moving: moving,
      changedYinYang: moving ? yinYang === "yang" ? "yin" : "yang" : yinYang
    };
  }

  function createTurtleLine(options, lineIndex) {
    const dateKey = options && options.dateKey || getLocalDateKey();
    const userSeed = options && options.userSeed || "camp-divination";
    const questionId = normalizeQuestionId(options && options.questionId);
    const salt = options && options.salt || "daily";
    const index = Math.max(0, Math.min(5, Math.floor(Number(lineIndex) || 0)));
    const seedRoot = [userSeed, dateKey, questionId, salt, "turtle-line", index].join(":");
    const coins = [0, 1, 2].map(function(coinIndex) {
      return createCoin(seedRoot + ":coin:" + coinIndex, coinIndex);
    });

    return buildTurtleLine(coins, index);
  }

  function createTurtleLines(options) {
    const lines = [];

    for (let index = 0; index < 6; index += 1) {
      lines.push(createTurtleLine(options, index));
    }

    return lines;
  }

  function normalizeTurtleLines(lines, fallbackOptions) {
    if (!Array.isArray(lines) || lines.length !== 6) {
      return createTurtleLines(fallbackOptions);
    }

    return lines.slice(0, 6).map(function(line, index) {
      if (line && Array.isArray(line.coins) && line.coins.length === 3) {
        return buildTurtleLine(line.coins, index);
      }

      const legacyYang = line && (line.yinYang === "yang" || line.type === "yang") || line === "yang" || line === 1;
      const legacyCoins = legacyYang
        ? [{ side: "yang" }, { side: "yin" }, { side: "yin" }]
        : [{ side: "yang" }, { side: "yang" }, { side: "yin" }];
      return buildTurtleLine(legacyCoins, index);
    });
  }

  function getHexagramForLineValues(lineValues) {
    const iching = getIChingCatalog();
    const key = lineValues.map(function(value) {
      return value === "yang" || value === 1 ? "1" : "0";
    }).join("");
    return iching && iching.hexagramsByLineKey ? iching.hexagramsByLineKey[key] : null;
  }

  function getHexagramSummary(hexagram) {
    if (!hexagram) {
      return null;
    }

    const iching = getIChingCatalog();
    const upper = iching && iching.trigrams ? iching.trigrams[hexagram.upper] : null;
    const lower = iching && iching.trigrams ? iching.trigrams[hexagram.lower] : null;
    return {
      id: hexagram.id,
      name: hexagram.name,
      symbol: hexagram.symbol,
      upper: hexagram.upper,
      lower: hexagram.lower,
      upperTrigram: upper ? { id: upper.id, name: upper.name, symbol: upper.symbol, element: upper.element } : null,
      lowerTrigram: lower ? { id: lower.id, name: lower.name, symbol: lower.symbol, element: lower.element } : null,
      judgment: hexagram.judgment,
      judgmentMeaning: hexagram.judgmentMeaning ? { ...hexagram.judgmentMeaning } : null,
      keywords: hexagram.keywords.slice(),
      imageMeaning: hexagram.imageMeaning
    };
  }

  function getLineReading(hexagram, position) {
    const line = hexagram && Array.isArray(hexagram.lines) ? hexagram.lines[position - 1] : null;
    return line ? { ...line } : {
      position: position,
      label: "第" + position + "爻",
      keyword: "爻位",
      text: "",
      interpretation: "本次未取得对应爻辞，请依据卦象整体情境审慎判断。",
      verdicts: [],
      situationTags: [],
      favorableActions: [],
      unfavorableActions: [],
      conditions: ["本次未取得对应爻辞，不作强吉凶断语。"],
      severity: "neutral",
      dataStatus: "missingOriginal"
    };
  }

  function judgmentReading(hexagram) {
    const meaning = hexagram && hexagram.judgmentMeaning;
    return meaning ? { ...meaning } : {
      text: hexagram && hexagram.judgment || "",
      interpretation: hexagram && hexagram.imageMeaning || "",
      verdicts: [], situationTags: [], favorableActions: [], unfavorableActions: [], conditions: [], severity: "neutral"
    };
  }

  function selectedText(source, hexagram, reading, role, position) {
    return {
      source: source,
      role: role,
      hexagramId: hexagram && hexagram.id || 0,
      hexagramName: hexagram && hexagram.name || "",
      position: position || 0,
      ...reading
    };
  }

  function createReadingBasis(primary, changed, lines) {
    const movingPositions = lines.filter(function(line) {
      return line.moving;
    }).map(function(line) {
      return line.position;
    });
    const staticPositions = lines.filter(function(line) {
      return !line.moving;
    }).map(function(line) {
      return line.position;
    });
    const count = movingPositions.length;
    const basis = {
      movingCount: count,
      rule: "",
      ruleType: "",
      summary: "",
      primaryPosition: 0,
      items: [],
      primaryTexts: [],
      secondaryTexts: [],
      sourceHexagramId: 0,
      sourceLineIndexes: []
    };

    function add(source, hexagram, reading, role, position) {
      const item = selectedText(source, hexagram, reading, role, position);
      basis.items.push(item);
      (role === "primary" ? basis.primaryTexts : basis.secondaryTexts).push(item);
      return item;
    }

    if (count === 0) {
      basis.rule = "primaryJudgment";
      basis.ruleType = basis.rule;
      basis.summary = "0 个动爻：以本卦卦辞为主。";
      basis.sourceHexagramId = primary.id;
      add("本卦卦辞", primary, judgmentReading(primary), "primary");
    } else if (count === 1) {
      basis.rule = "oneMovingLine";
      basis.ruleType = basis.rule;
      basis.primaryPosition = movingPositions[0];
      basis.summary = "1 个动爻：以本卦" + getLineReading(primary, basis.primaryPosition).label + "为主。";
      basis.sourceHexagramId = primary.id;
      basis.sourceLineIndexes = [basis.primaryPosition];
      add("本卦动爻", primary, getLineReading(primary, basis.primaryPosition), "primary", basis.primaryPosition);
    } else if (count === 2) {
      basis.rule = "twoMovingLines";
      basis.ruleType = basis.rule;
      basis.primaryPosition = Math.max.apply(Math, movingPositions);
      basis.summary = "2 个动爻：看本卦两条动爻，以上爻为主。";
      basis.sourceHexagramId = primary.id;
      basis.sourceLineIndexes = movingPositions.slice();
      movingPositions.forEach(function(position) {
        add(position === basis.primaryPosition ? "本卦动爻·主" : "本卦动爻·辅", primary, getLineReading(primary, position), position === basis.primaryPosition ? "primary" : "secondary", position);
      });
    } else if (count === 3) {
      basis.rule = "bothJudgments";
      basis.ruleType = basis.rule;
      basis.summary = "3 个动爻：合看本卦卦辞与变卦卦辞。";
      basis.sourceHexagramId = primary.id;
      add("本卦卦辞·主", primary, judgmentReading(primary), "primary");
      add("变卦卦辞·辅", changed, judgmentReading(changed), "secondary");
    } else if (count === 4) {
      basis.rule = "twoChangedStaticLines";
      basis.ruleType = basis.rule;
      basis.primaryPosition = Math.min.apply(Math, staticPositions);
      basis.summary = "4 个动爻：看变卦两条静爻，以下爻为主。";
      basis.sourceHexagramId = changed.id;
      basis.sourceLineIndexes = staticPositions.slice();
      staticPositions.forEach(function(position) {
        add(position === basis.primaryPosition ? "变卦静爻·主" : "变卦静爻·辅", changed, getLineReading(changed, position), position === basis.primaryPosition ? "primary" : "secondary", position);
      });
    } else if (count === 5) {
      basis.rule = "oneChangedStaticLine";
      basis.ruleType = basis.rule;
      basis.primaryPosition = staticPositions[0];
      basis.summary = "5 个动爻：以变卦唯一静爻为主。";
      basis.sourceHexagramId = changed.id;
      basis.sourceLineIndexes = [basis.primaryPosition];
      add("变卦静爻", changed, getLineReading(changed, basis.primaryPosition), "primary", basis.primaryPosition);
    } else if (primary.id === 1) {
      basis.rule = "qianUseNine";
      basis.ruleType = basis.rule;
      basis.summary = "6 个动爻：乾卦用九。";
      basis.sourceHexagramId = primary.id;
      add("用九", primary, getIChingCatalog().specialTexts.qianUseNine, "primary");
    } else if (primary.id === 2) {
      basis.rule = "kunUseSix";
      basis.ruleType = basis.rule;
      basis.summary = "6 个动爻：坤卦用六。";
      basis.sourceHexagramId = primary.id;
      add("用六", primary, getIChingCatalog().specialTexts.kunUseSix, "primary");
    } else {
      basis.rule = "changedJudgment";
      basis.ruleType = basis.rule;
      basis.summary = "6 个动爻：以变卦卦辞为主，并参考本卦卦辞。";
      basis.sourceHexagramId = changed.id;
      add("变卦卦辞·主", changed, judgmentReading(changed), "primary");
      add("本卦卦辞·辅", primary, judgmentReading(primary), "secondary");
    }

    return basis;
  }

  function getMovementReading(basis) {
    const readings = [
      "局面暂时稳定，先把本卦的核心功课做扎实。",
      "变化集中在一个明确环节，抓住主爻即可，不必全面翻动。",
      "两处变化彼此牵动，先看较高爻位所指的外部结果，再照顾较低爻位的基础。",
      "新旧局面势均力敌，既要理解来处，也要看见正在形成的方向。",
      "多数位置正在变化，判断重心转到变卦中仍然稳定的两处。",
      "局面接近全面换挡，唯一静爻是此刻可以抓住的锚点。",
      "六爻皆变，旧结构已经走到极处，宜以变卦或乾坤用爻重新定向。"
    ];
    return readings[basis.movingCount] || readings[0];
  }

  const verdictLabels = {
    supremeGood: "元吉", greatGood: "大吉", good: "吉", correctGood: "贞吉",
    nothingUnfavorable: "无不利", favorable: "利", noBlame: "无咎", regretGone: "悔亡",
    regret: "悔", difficulty: "吝", danger: "厉", bad: "凶", doNotAct: "勿用",
    mustNot: "不可", advanceBad: "征凶", unfavorable: "不利"
  };

  function uniqueValues(items) {
    return (items || []).reduce(function(result, item) {
      if (item && result.indexOf(item) === -1) result.push(item);
      return result;
    }, []);
  }

  function collectField(items, field) {
    return uniqueValues((items || []).reduce(function(result, item) {
      return result.concat(Array.isArray(item && item[field]) ? item[field] : []);
    }, []));
  }

  function verdictPolarity(verdicts) {
    if (verdicts.some(function(item) { return ["bad", "advanceBad", "mustNot"].indexOf(item) !== -1; })) return "adverse";
    if (verdicts.some(function(item) { return ["danger", "doNotAct", "difficulty", "regret", "unfavorable"].indexOf(item) !== -1; })) return "cautious";
    if (verdicts.some(function(item) { return ["supremeGood", "greatGood", "good", "correctGood", "nothingUnfavorable", "favorable", "regretGone"].indexOf(item) !== -1; })) return "favorable";
    return "neutral";
  }

  function assessSelectedTexts(basis) {
    const primaryTexts = basis.primaryTexts || [];
    const secondaryTexts = basis.secondaryTexts || [];
    const primaryVerdicts = collectField(primaryTexts, "verdicts");
    const secondaryVerdicts = collectField(secondaryTexts, "verdicts");
    const allTexts = primaryTexts.concat(secondaryTexts);
    const verdicts = uniqueValues(primaryVerdicts.concat(secondaryVerdicts));
    const conditions = collectField(allTexts, "conditions");
    const primaryPolarity = verdictPolarity(primaryVerdicts);
    const secondaryPolarity = verdictPolarity(secondaryVerdicts);
    const has = function(values, candidates) { return values.some(function(item) { return candidates.indexOf(item) !== -1; }); };
    let grade = "平";

    if (has(primaryVerdicts, ["bad", "advanceBad", "mustNot"])) grade = "凶";
    else if (has(primaryVerdicts, ["danger", "doNotAct", "difficulty", "unfavorable"])) grade = "慎";
    else if (has(primaryVerdicts, ["supremeGood", "greatGood"]) && primaryPolarity === "favorable") grade = "大吉";
    else if (has(primaryVerdicts, ["good", "correctGood", "nothingUnfavorable", "favorable"])) grade = "吉";
    else if (has(primaryVerdicts, ["noBlame"]) && has(primaryVerdicts, ["danger"])) grade = "慎";
    else if (has(primaryVerdicts, ["regretGone"])) grade = "吉";
    else if (has(primaryVerdicts, ["regret"])) grade = "慎";

    if (grade === "大吉" && secondaryPolarity === "adverse") grade = "吉";
    else if (grade === "吉" && secondaryPolarity === "adverse") grade = "慎";
    else if (grade === "平" && secondaryPolarity === "adverse") grade = "慎";

    const missing = allTexts.some(function(item) { return item && item.dataStatus === "missingOriginal"; });
    if (missing) conditions.push("本次未取得完整辞文，结果仅作中性提示。");

    const trend = secondaryTexts.length === 0 ? "single" : primaryPolarity + "To" + secondaryPolarity;
    const reasoningParts = [];
    if (primaryVerdicts.length) reasoningParts.push("主要辞文见“" + primaryVerdicts.map(function(item) { return verdictLabels[item] || item; }).join("、") + "”");
    else reasoningParts.push("主要辞文没有明确的简单吉凶判断词");
    if (secondaryVerdicts.length) reasoningParts.push("辅助辞文见“" + secondaryVerdicts.map(function(item) { return verdictLabels[item] || item; }).join("、") + "”");
    if (conditions.length) reasoningParts.push("须保留辞文所附条件与警告");

    return {
      grade: grade,
      selectedTexts: allTexts.map(function(item) { return { source: item.source, role: item.role, text: item.text, interpretation: item.interpretation }; }),
      verdicts: verdicts,
      conditions: uniqueValues(conditions),
      trend: trend,
      reasoning: reasoningParts.join("；") + "。",
      situationTags: collectField(allTexts, "situationTags"),
      favorableActions: collectField(allTexts, "favorableActions"),
      unfavorableActions: collectField(allTexts, "unfavorableActions")
    };
  }

  function getOracleKeywords(primary, changed, basis) {
    const movementKeywords = ["守成", "转机", "权衡", "变动", "收束", "定锚", "更新"];
    const candidates = [
      primary.keywords[0],
      primary.keywords[1],
      changed.keywords[0],
      changed.keywords[1],
      movementKeywords[basis.movingCount]
    ].filter(Boolean);
    const keywords = [];

    candidates.forEach(function(keyword) {
      if (keywords.indexOf(keyword) === -1 && keywords.length < 4) {
        keywords.push(keyword);
      }
    });
    ["守中", "审势", "留余", "循序"].forEach(function(keyword) {
      if (keywords.indexOf(keyword) === -1 && keywords.length < 4) {
        keywords.push(keyword);
      }
    });
    return keywords;
  }

  const topicActionLanguage = {
    overall: {
      prepare: "完善准备并排好先后", observe: "观察局势再决定", protect: "保留退路和关键资源",
      correct: "守住原则并复核方向", advance: "按条件稳步推进", cooperate: "明确分工并寻求可靠协助",
      pause: "暂缓启动新的事项", review: "复盘风险与边界",
      avoidAdvance: "多线强推或仓促定局", avoidRisk: "忽视警告继续加码", avoidControl: "越位争先或强行主导"
    },
    relationship: {
      prepare: "整理辞文所指的关系位置与现实边界", observe: "核对互动事实是否符合辞文所示条件", protect: "按辞文警示收紧关系中的风险边界",
      correct: "按辞文要求守住承诺与分寸", advance: "仅在辞文所示条件成立时推进关系", cooperate: "围绕辞文指出的问题明确双方责任",
      pause: "暂停辞文明示不利的关系动作", review: "复核关系中的具体事实与风险信号",
      avoidAdvance: "突然表白、逼迫承诺", avoidRisk: "无视冷淡或冲突信号", avoidControl: "操控回应或投入全部情绪"
    },
    money: {
      prepare: "完善预算与交易准备", observe: "保留现金并继续观察", protect: "设置止损并保留流动性",
      correct: "核对用途、条款与承受能力", advance: "条件明确后分步投入", cooperate: "向可靠专业人士求证",
      pause: "暂停新增投入或高风险计划", review: "复核账目与潜在损失",
      avoidAdvance: "追加投入、仓促交易", avoidRisk: "忽略风险追涨加码", avoidControl: "以借贷或重仓强求结果"
    },
    bodyMind: {
      prepare: "安排恢复时间和基础照护", observe: "记录身心信号并观察变化", protect: "减少消耗并保留体力",
      correct: "恢复规律作息与适度活动", advance: "状态允许时循序增加负荷", cooperate: "需要时向可信赖的人求助",
      pause: "暂停额外负荷并优先休息", review: "检查压力来源和身体警讯",
      avoidAdvance: "勉强加量或连续透支", avoidRisk: "忽视疼痛、疲惫或情绪警讯", avoidControl: "用意志强压真实感受"
    }
  };

  function actionIntents(analysis) {
    const good = [];
    const bad = [];
    const favorableMeaning = (analysis.favorableActions || []).filter(function(item) {
      return item && !/按辞文|结合爻位|先辨明风险|谨慎处理/.test(item);
    }).concat(analysis.situationTags || []).join("|");
    const unfavorableMeaning = (analysis.unfavorableActions || []).filter(function(item) {
      return item && !/脱离辞文条件|忽视危险、困难|强行推进辞文/.test(item);
    }).concat(analysis.situationTags || []).join("|");
    function addWhen(text, pattern, target, value) { if (pattern.test(text)) target.push(value); }
    addWhen(favorableMeaning, /准备|等待|蓄|preparation/, good, "prepare");
    addWhen(favorableMeaning, /观察|征兆|审|observe|warning|trend/, good, "observe");
    addWhen(favorableMeaning, /守正|中正|正直|复核|steadiness|balance/, good, "correct");
    addWhen(favorableMeaning, /协作|合作|指导|联系|support|service|cooperation/, good, "cooperate");
    addWhen(favorableMeaning, /担当|推进|试行|advance|leadership|trial/, good, "advance");
    addWhen(favorableMeaning, /收束|退让|止争|保守|降温|danger|conflict|excess|restraint/, good, "protect");
    addWhen(favorableMeaning, /暂停|止争|收束|silence/, good, "pause");
    addWhen(favorableMeaning, /检查|警惕|复盘|warning|danger/, good, "review");
    addWhen(unfavorableMeaning, /强行|强进|启动|加码|硬碰|推进|冒进|advance/, bad, "avoidAdvance");
    addWhen(unfavorableMeaning, /冒险|忽视|松懈|风险|danger|warning/, bad, "avoidRisk");
    addWhen(unfavorableMeaning, /专断|争功|争夺|越位|操控|control|conflict/, bad, "avoidControl");
    return { good: uniqueValues(good), bad: uniqueValues(bad) };
  }

  function buildCoreConflict(selectedInterpretations, fallbackMeaning) {
    const meaning = selectedInterpretations.length
      ? selectedInterpretations.map(function(text) { return text.replace(/[。；]+$/, ""); }).join("；")
      : String(fallbackMeaning || "").replace(/[。；]+$/, "");
    if (/暂得安处|得到住处|暂时.*立足/.test(meaning) && /不安|不快|尚非归宿/.test(meaning)) {
      return "已有暂时立足条件，但尚未真正安定；需分清短暂落脚与长期归宿";
    }
    return meaning;
  }

  function getTopicSituationFocus(questionId, situationTags) {
    const tags = (situationTags || []).join("|");
    const focusMaps = {
      relationship: [
        [/诚信|孚|信任/, "信任是否落实为可兑现的行动"],
        [/关系|婚|女|夫|妹/, "双方的位置、承诺与责任是否相称"],
        [/风险|危险|冲突/, "关系中的风险是否被如实看见"],
        [/行动|推进|试行/, "推进方式是否符合眼下时机"],
        [/收束|止|退|节制/, "边界是否及时收紧"]
      ],
      money: [
        [/风险|危险|冲突/, "资源风险是否仍在承受范围内"],
        [/行动|推进|试行/, "投入方式是否符合眼下条件"],
        [/诚信|孚|信任/, "承诺、条款与实际兑现是否一致"],
        [/收束|止|退|节制/, "资金与风险边界是否及时收紧"]
      ],
      bodyMind: [
        [/风险|危险|冲突/, "不适与压力信号是否被正视"],
        [/收束|止|退|节制/, "负荷是否及时收束"],
        [/行动|推进|试行/, "当前状态是否足以承担下一步"]
      ],
      overall: [
        [/风险|危险|冲突/, "眼前风险是否已经辨明"],
        [/行动|推进|试行/, "行动与时机是否相称"],
        [/诚信|孚|信任/, "承诺与实际行动是否一致"],
        [/收束|止|退|节制/, "是否应当及时收束"]
      ]
    };
    const candidates = focusMaps[questionId] || focusMaps.overall;
    const matched = candidates.find(function(candidate) { return candidate[0].test(tags); });
    return matched ? matched[1] : "";
  }

  function getTopicGuidance(questionId, primary, changed, basis, analysis) {
    const language = topicActionLanguage[questionId] || topicActionLanguage.overall;
    const intents = actionIntents(analysis);
    const selectedInterpretations = analysis.selectedTexts.map(function(item) { return item.interpretation; }).filter(Boolean);
    const selectedMeaning = selectedInterpretations.length
      ? selectedInterpretations.map(function(text) { return text.replace(/[。；]+$/, ""); }).join("；") + "。"
      : "";
    const topicLabel = {
      overall: "今天的整体安排",
      relationship: "关系与沟通",
      money: "金钱与资源安排",
      bodyMind: "身心状态"
    }[questionId] || "今天的整体安排";
    const specificGood = [];
    const specificAvoid = [];
    function add(list, value) { if (value && list.indexOf(value) === -1) list.push(value); }

    if (/暂得安处|得到住处|暂得安|已有.*立足|暂时.*立足/.test(selectedMeaning)) {
      add(specificGood, "先稳住已有的暂时立足条件，再确认能否真正安定");
      add(specificAvoid, "把暂时落脚误当成已经找到归宿，或压下仍然不安的感受");
    }
    if (/等待|时机未|条件未|尚未|未熟|迟归有时/.test(selectedMeaning)) {
      add(specificGood, "给条件继续成熟的时间，并保留调整空间");
      add(specificAvoid, "在时机未明时抢先定局");
    }
    if (/守正|中道|中正|正道|本分/.test(selectedMeaning)) {
      add(specificGood, "把行动限制在正当边界内，并持续核对方向");
      add(specificAvoid, "为求结果而越过原本应守的边界");
    }
    if (/诚信|真诚|取信|信任|有孚/.test(selectedMeaning)) {
      add(specificGood, "先用真实、可兑现的行动建立信任");
      add(specificAvoid, "只靠承诺或表态催促结果");
    }
    if (/停止|止损|退回|返回|退避|收束|不可.*进|不宜.*进|冒进/.test(selectedMeaning)) {
      add(specificGood, "及时停下、收束风险，并保留退路");
      add(specificAvoid, "明知条件不足仍继续加码推进");
    }
    if (/相助|伙伴|合作|求见|协助|支持|同道|联结/.test(selectedMeaning)) {
      add(specificGood, "确认可靠的协助关系后再共同推进");
      add(specificAvoid, "在支持关系未稳时独自硬撑");
    }
    if (/危险|风险|受困|凶|灾|伤|不安/.test(selectedMeaning)) {
      add(specificGood, "正视已经出现的不安或风险信号");
      add(specificAvoid, "用表面的进展掩盖尚未解除的风险");
    }

    const semanticGood = (analysis.favorableActions || []).filter(function(item) {
      return item && !/按辞文|结合爻位|先辨明风险|谨慎处理/.test(item);
    });
    const semanticAvoid = (analysis.unfavorableActions || []).filter(function(item) {
      return item && !/脱离辞文条件|忽视危险、困难|强行推进辞文/.test(item);
    });
    semanticGood.slice(0, 1).forEach(function(item) { add(specificGood, item.replace(/[。；]$/, "")); });
    semanticAvoid.slice(0, 1).forEach(function(item) { add(specificAvoid, item.replace(/[。；]$/, "")); });

    const topicGood = intents.good.map(function(intent) { return language[intent]; }).filter(Boolean);
    const topicAvoid = intents.bad.map(function(intent) { return language[intent]; }).filter(Boolean);
    const coreConflict = buildCoreConflict(selectedInterpretations, primary.imageMeaning);
    if (!specificGood.length && !topicGood.length) add(specificGood, "处理辞文指出的具体矛盾：" + coreConflict);
    if (!specificAvoid.length && !topicAvoid.length) add(specificAvoid, "忽略辞文已经指出的限制：" + coreConflict);
    const goodFor = uniqueValues(specificGood.concat(topicGood)).slice(0, 3);
    const avoid = uniqueValues(specificAvoid.concat(topicAvoid)).slice(0, 3);
    const primarySituation = "本卦「" + primary.name + "」呈现的总体处境是：" + primary.imageMeaning;
    const trend = primary.id === changed.id
      ? "卦势没有转成另一卦，重点仍在「" + primary.keywords[0] + "」这一层逐步落实。"
      : "卦势由「" + primary.name + "」转向「" + changed.name + "」，关注点也会从「" + primary.keywords[0] + "」逐渐转向「" + changed.keywords[0] + "」。";
    const situationFocus = getTopicSituationFocus(questionId, analysis.situationTags);
    const materialConditions = uniqueValues(analysis.conditions || []).slice(0, 2);
    const conditionText = materialConditions.length ? "辞文所附的条件或警示是：" + materialConditions.join("；") + " " : "";
    const focusText = situationFocus ? "需要面对的是“" + situationFocus + "”；" : "";
    const interpretation = "本次所取辞文表示：" + (selectedMeaning || primary.imageMeaning) + " " + trend + " " + conditionText +
      "放在“" + topicLabel + "”上，" + focusText + "核心矛盾是：" + coreConflict + "。";
    const selectedTextSummary = (basis.primaryTexts || []).concat(basis.secondaryTexts || []).map(function(item) {
      const label = item.label ? item.label + " " : "";
      return item.source + "：" + label + "「" + item.text + "」";
    }).join("；");
    return {
      summary: primarySituation,
      selectedTextSummary: selectedTextSummary,
      interpretation: interpretation,
      goodFor: goodFor,
      avoid: avoid,
      notices: uniqueValues(analysis.conditions || []).slice(0, 3),
      trend: trend
    };
  }

  function getTurtleEffects(primary, changed, question, basis) {
    const profiles = {
      qian: { activityLabels: ["主动行动"], activityWeights: { fish: 0.22, cook: 0.18, birdwatch: 0.18 } },
      dui: { activityLabels: ["轻松交流"], activityWeights: { sittingOnFurniture: 0.2, birdwatch: 0.15 } },
      li: { activityLabels: ["看清细节"], activityWeights: { cook: 0.2, observingGear: 0.18 }, soundRecommendations: [{ id: "campfire_crackle_loop", label: "篝火声" }] },
      zhen: { activityLabels: ["起身行动"], activityWeights: { wandering: 0.24, birdwatch: 0.18 } },
      xun: { activityLabels: ["顺势观察"], activityWeights: { birdwatch: 0.18, lookingAtLake: 0.15 }, soundRecommendations: [{ id: "birds_morning_loop", label: "鸟鸣声" }] },
      kan: { activityLabels: ["临水静观"], activityWeights: { lookingAtLake: 0.24, fish: 0.12 }, soundRecommendations: [{ id: "lake_water_loop", label: "湖水声" }] },
      gen: { activityLabels: ["停下休整"], activityWeights: { tentRest: 0.22, resting: 0.2, sittingOnFurniture: 0.12 } },
      kun: { activityLabels: ["照料日常"], activityWeights: { cook: 0.18, resting: 0.18 } }
    };
    const lower = profiles[primary.lower];
    const upper = profiles[primary.upper];
    const changedProfile = profiles[changed.upper];
    const movementEffect = basis.movingCount >= 4
      ? { activityLabels: ["减少折腾"], activityWeights: { observingGear: -0.18, resting: 0.2 } }
      : {};
    const moodLine = "铜钱筮占：" + primary.symbol + primary.name + "变" + changed.symbol + changed.name + "。";
    const thoughtLines = [
      primary.keywords[0] + "，先看这一层。",
      basis.summary,
      "从" + primary.name + "走向" + changed.name + "。"
    ];

    return mergeEffects(question && question.effects, lower, upper, changedProfile, movementEffect, {
      moodLine: moodLine,
      thoughtLines: thoughtLines
    });
  }

  function createTurtleResult(options) {
    const dateKey = options && options.dateKey || getLocalDateKey();
    const userSeed = options && options.userSeed || "camp-divination";
    const salt = options && options.salt || "daily";
    const questionId = normalizeQuestionId(options && options.questionId);
    const question = getQuestion(questionId);
    const lines = normalizeTurtleLines(options && options.lines, { dateKey: dateKey, userSeed: userSeed, questionId: questionId, salt: salt });
    const primaryLineValues = lines.map(function(line) {
      return line.yinYang;
    });
    const changedLineValues = lines.map(function(line) {
      return line.changedYinYang;
    });
    const primary = getHexagramForLineValues(primaryLineValues);
    const changed = getHexagramForLineValues(changedLineValues);
    const iching = getIChingCatalog();

    if (!primary || !changed || !iching) {
      return null;
    }

    const basis = createReadingBasis(primary, changed, lines);
    const judgmentAnalysis = assessSelectedTexts(basis);
    const fortune = judgmentAnalysis.grade;
    const oracleKeywords = getOracleKeywords(primary, changed, basis);
    const guidance = getTopicGuidance(questionId, primary, changed, basis, judgmentAnalysis);
    const movementReading = getMovementReading(basis);
    const basisText = basis.items.map(function(item) {
      const label = item.label ? item.label + "·" : "";
      const keyword = item.keyword ? item.keyword + "：" : "";
      return item.source + " " + label + keyword + item.text;
    }).join(" ");
    const selectedMeanings = basis.items.map(function(item) {
      return item.interpretation ? item.source + "释义：" + item.interpretation : "";
    }).filter(Boolean).join(" ");
    const detailInterpretation = primary.imageMeaning + " " + selectedMeanings + " " + movementReading + " " + guidance.trend;
    const effects = getTurtleEffects(primary, changed, question, basis);

    return {
      type: "turtle",
      method: "turtle",
      presentationVersion: TURTLE_PRESENTATION_VERSION,
      question: questionId,
      questionLabel: question ? question.label : questionId,
      title: primary.symbol + " " + primary.name,
      subtitle: "本卦 " + primary.name + " · " + basis.movingCount + " 个动爻 · 变卦 " + changed.name,
      fortune: fortune,
      turtleResultId: primary.id + "-" + changed.id + "-" + lines.filter(function(line) { return line.moving; }).map(function(line) { return line.position; }).join("."),
      lines: lines,
      coinTosses: lines.map(function(line) {
        return {
          position: line.position,
          coins: line.coins.map(function(coin) { return { ...coin }; }),
          total: line.total,
          type: line.type
        };
      }),
      primaryLines: primaryLineValues.slice(),
      movingLines: lines.filter(function(line) { return line.moving; }).map(function(line) { return line.position; }),
      changedLines: changedLineValues.slice(),
      primaryHexagram: getHexagramSummary(primary),
      changedHexagram: getHexagramSummary(changed),
      readingBasis: basis,
      judgmentAnalysis: judgmentAnalysis,
      keywords: oracleKeywords,
      summary: guidance.summary,
      selectedTextSummary: guidance.selectedTextSummary,
      interpretation: guidance.interpretation,
      notices: guidance.notices,
      conclusion: guidance.notices.join("；"),
      goodFor: guidance.goodFor,
      avoid: guidance.avoid,
      reality: guidance.summary,
      advice: basis.summary + " " + basisText,
      detailInterpretation: detailInterpretation,
      campImpact: guidance.notices.join("；"),
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
    getIChingCatalog: getIChingCatalog,
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
    createTurtleLine: createTurtleLine,
    createTurtleLines: createTurtleLines,
    getHexagramForLineValues: getHexagramForLineValues,
    createReadingBasis: createReadingBasis,
    assessSelectedTexts: assessSelectedTexts,
    getTopicGuidance: getTopicGuidance,
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
