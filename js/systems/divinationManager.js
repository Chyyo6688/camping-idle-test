(function () {
  const TURTLE_PRESENTATION_VERSION = 10;

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
    if (verdicts.some(function(item) { return ["danger", "doNotAct", "difficulty", "regret", "unfavorable", "noBlame", "correctGood", "regretGone"].indexOf(item) !== -1; })) return "conditional";
    if (verdicts.some(function(item) { return ["supremeGood", "greatGood", "good", "nothingUnfavorable", "favorable"].indexOf(item) !== -1; })) return "favorable";
    return "neutral";
  }

  function assessSelectedTexts(basis, transition) {
    const primaryTexts = basis.primaryTexts || [];
    const secondaryTexts = basis.secondaryTexts || [];
    const primaryVerdicts = collectField(primaryTexts, "verdicts");
    const secondaryVerdicts = collectField(secondaryTexts, "verdicts");
    const allTexts = primaryTexts.concat(secondaryTexts);
    const verdicts = uniqueValues(primaryVerdicts.concat(secondaryVerdicts));
    const primaryConditions = collectField(primaryTexts, "conditions");
    const secondaryConditions = collectField(secondaryTexts, "conditions");
    const conditions = uniqueValues(primaryConditions.concat(secondaryConditions));
    const primaryPolarity = verdictPolarity(primaryVerdicts);
    const secondaryPolarity = verdictPolarity(secondaryVerdicts);
    const has = function(values, candidates) { return values.some(function(item) { return candidates.indexOf(item) !== -1; }); };
    const semanticText = function(items) {
      return items.map(function(item) {
        return [item && item.text, item && item.interpretation].concat(item && item.situationTags || []).filter(Boolean).join("|");
      }).join("|");
    };
    const primarySemantic = semanticText(primaryTexts);
    const secondarySemantic = semanticText(secondaryTexts);
    const primaryRawText = primaryTexts.map(function(item) { return item && item.text || ""; }).join("|");
    const secondaryRawText = secondaryTexts.map(function(item) { return item && item.text || ""; }).join("|");
    const primaryHasSevereAdverse = has(primaryVerdicts, ["bad", "advanceBad"]);
    const primaryHasRestriction = has(primaryVerdicts, ["mustNot", "doNotAct"]);
    const primaryHasExplicitDanger = has(primaryVerdicts, ["danger"]);
    const primaryHasOrdinaryCaution = has(primaryVerdicts, ["difficulty", "regret", "unfavorable"]);
    const primaryHasConditionalOutcome = has(primaryVerdicts, ["correctGood", "noBlame", "regretGone"]) || primaryConditions.length > 0;
    const primaryHasClearGood = has(primaryVerdicts, ["supremeGood", "greatGood", "good", "nothingUnfavorable", "correctGood"]);
    const primaryHasPositive = primaryHasClearGood || has(primaryVerdicts, ["favorable"]);
    const primaryHasGreatPositive = has(primaryVerdicts, ["supremeGood", "greatGood"]);
    const primaryHasNoBlame = has(primaryVerdicts, ["noBlame"]);
    const primaryHasRegretGone = has(primaryVerdicts, ["regretGone"]);
    const primaryHasBlockingSituation =
      /困顿|受困|资源有限|危险|风险|闭塞|阻碍|艰难|未完成|尚未|不安|冲突|失信|不信|难获|羞辱|吝|灾|受伤|失去|窘迫|无实/.test(primarySemantic);
    const primaryHasCurrentAdversity = primaryHasSevereAdverse || primaryHasRestriction || primaryHasExplicitDanger ||
      primaryHasOrdinaryCaution || primaryHasBlockingSituation;
    const primaryNeedsCorrectness = has(primaryVerdicts, ["correctGood"]) || /贞吉|守正|中正|正道/.test(primarySemantic) ||
      (/贞/.test(primaryRawText) && (primaryHasPositive || has(primaryVerdicts, ["noBlame"])));
    const timingCondition = /己日乃孚|等待|时机|成熟|未到|尚未|条件未/.test(primarySemantic + "|" + secondarySemantic + "|" + conditions.join("|"));
    const secondaryHasAdverse = has(secondaryVerdicts, ["bad", "advanceBad", "mustNot", "doNotAct", "danger", "difficulty", "unfavorable"]);
    const secondaryHasPositive = has(secondaryVerdicts, ["supremeGood", "greatGood", "good", "nothingUnfavorable", "favorable", "correctGood", "noBlame", "regretGone"]);
    const changed = transition && transition.changed;
    const primaryHexagram = transition && transition.primary;
    const transitionText = changed && primaryHexagram && changed.id !== primaryHexagram.id
      ? [changed.imageMeaning].concat(changed.keywords || []).filter(Boolean).join("|")
      : "";
    const transitionHasRisk = /危险|风险|未完成|闭塞|困顿|冲突|失序|受阻|过盛/.test(transitionText);
    const transitionHasRelief = /转机|复苏|完成|安定|和合|解脱|上升|更新|归位|通达/.test(transitionText);
    let overallGrade = "平";

    // 主辞描述当前等级；条件、辅辞和变卦主要说明怎样发展，不再自动把结果压成“慎”。
    if (primaryHasSevereAdverse) overallGrade = "凶";
    else if (primaryHasRestriction || primaryHasExplicitDanger) overallGrade = "慎";
    else if (primaryHasGreatPositive && !primaryHasOrdinaryCaution && !primaryHasBlockingSituation) overallGrade = "大吉";
    else if (has(primaryVerdicts, ["correctGood"]) && !primaryHasOrdinaryCaution) overallGrade = "吉";
    else if (has(primaryVerdicts, ["good", "nothingUnfavorable"]) && !primaryHasOrdinaryCaution && !primaryHasBlockingSituation) overallGrade = "吉";
    else if (primaryHasRegretGone) {
      overallGrade = primaryHasPositive && !primaryHasOrdinaryCaution && !primaryHasBlockingSituation ? "吉" : "平";
    } else if (primaryHasClearGood) {
      // 明确吉辞与现实阻力并存时按“平”看待；不是因为有条件而判“慎”。
      overallGrade = "平";
    } else if (primaryHasOrdinaryCaution || primaryHasBlockingSituation) {
      overallGrade = primaryHasNoBlame || primaryHasPositive ? "平" : "慎";
    } else if (primaryHasNoBlame || primaryHasPositive || primaryHasConditionalOutcome) {
      overallGrade = "平";
    }

    const missing = allTexts.some(function(item) { return item && item.dataStatus === "missingOriginal"; });
    if (missing) conditions.push("本次未取得完整辞文，结果仅作中性提示。");

    let trend = "局势尚待明朗";
    if (has(primaryVerdicts, ["bad", "advanceBad"])) trend = "主动推进易凶";
    else if (primaryHasRestriction) trend = "暂缓可避咎";
    else if (has(primaryVerdicts, ["danger"]) && has(primaryVerdicts, ["noBlame"])) trend = "谨慎处理可避咎";
    else if (primaryHasExplicitDanger) trend = "风险未解，宜先稳住";
    else if (primaryHasRegretGone) trend = "调整后转好";
    else if (primaryHasBlockingSituation && primaryNeedsCorrectness && timingCondition && secondaryHasPositive) trend = "守正待时可转吉";
    else if (has(primaryVerdicts, ["correctGood"])) trend = "守正可成";
    else if (primaryHasCurrentAdversity && secondaryHasPositive) {
      if (has(secondaryVerdicts, ["regretGone"])) trend = "当前受阻，调整后转好";
      else if (/己日乃孚|等待|时机|成熟/.test(secondaryRawText + "|" + secondarySemantic)) trend = "当前受阻，待时有转机";
      else trend = "当前受阻，后续有转机";
    } else if (primaryNeedsCorrectness && primaryHasPositive) trend = "守正可成";
    else if (primaryHasNoBlame) trend = "处理得当可免咎";
    else if (timingCondition) trend = "等待时机转好";
    else if (secondaryHasAdverse) trend = "后势转难，宜及时收束";
    else if (transitionHasRelief) trend = "后续有转机";
    else if (transitionHasRisk) trend = "后势仍需谨慎";
    else if (overallGrade === "大吉" || overallGrade === "吉") trend = "顺势可成";

    const trendCode = secondaryTexts.length === 0 ? "single" : primaryPolarity + "To" + secondaryPolarity;
    const reasoningParts = [];
    if (primaryVerdicts.length) reasoningParts.push("主辞判断为“" + primaryVerdicts.map(function(item) { return verdictLabels[item] || item; }).join("、") + "”");
    if (primaryHasCurrentAdversity) reasoningParts.push("主辞所示当前处境仍有阻力或风险");
    if (primaryHasConditionalOutcome) reasoningParts.push("有利或免咎依赖明确条件");
    if (secondaryVerdicts.length) reasoningParts.push("辅辞仅修正后续趋势为“" + trend + "”");
    if (transitionHasRisk) reasoningParts.push("变化方向仍含未解风险");

    return {
      overallGrade: overallGrade,
      grade: overallGrade,
      selectedTexts: allTexts.map(function(item) {
        return {
          source: item.source,
          role: item.role,
          text: item.text,
          interpretation: item.interpretation,
          verdicts: (item.verdicts || []).slice(),
          conditions: (item.conditions || []).slice(),
          situationTags: (item.situationTags || []).slice(),
          favorableActions: (item.favorableActions || []).slice(),
          unfavorableActions: (item.unfavorableActions || []).slice(),
          label: item.label || "",
          position: item.position || 0,
          hexagramName: item.hexagramName || ""
        };
      }),
      verdicts: verdicts,
      primaryVerdicts: primaryVerdicts,
      secondaryVerdicts: secondaryVerdicts,
      conditions: uniqueValues(conditions),
      primaryConditions: primaryConditions,
      secondaryConditions: secondaryConditions,
      trend: trend,
      trendCode: trendCode,
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
      prepare: "完善前期准备", observe: "核实当前征兆", protect: "保留必要退路",
      correct: "守住正当边界", advance: "分步稳健推进", cooperate: "寻求可靠协助",
      pause: "及时暂停收束", review: "复核具体风险",
      avoidAdvance: "勿逆势强行推进", avoidRisk: "勿忽视风险信号", avoidControl: "勿被冲突带偏"
    },
    relationship: {
      prepare: "厘清关系边界", observe: "核实真实回应", protect: "保留关系余地",
      correct: "守住承诺分寸", advance: "分步推进关系", cooperate: "坦诚协商责任",
      pause: "暂停关系推进", review: "复核冲突信号",
      avoidAdvance: "勿逼迫关系定性", avoidRisk: "勿无视冷淡冲突", avoidControl: "勿操控对方回应"
    },
    money: {
      prepare: "完善预算准备", observe: "核实资金动向", protect: "保留资金退路",
      correct: "核对用途条款", advance: "分步投入资金", cooperate: "寻求可靠求证",
      pause: "暂停新增投入", review: "复核账目风险",
      avoidAdvance: "勿仓促追加投入", avoidRisk: "勿忽视亏损风险", avoidControl: "勿借贷重仓强求"
    },
    bodyMind: {
      prepare: "安排基础照护", observe: "记录身心信号", protect: "减少额外消耗",
      correct: "恢复规律作息", advance: "循序增加负荷", cooperate: "寻求可信帮助",
      pause: "暂停额外负荷", review: "复核身心警讯",
      avoidAdvance: "勿勉强增加负荷", avoidRisk: "勿忽视身心警讯", avoidControl: "勿强压真实感受"
    }
  };

  const actionPlaceholderPattern = /辞文|爻位|具体所指|具体矛盾|结合现实|现实条件|根据辞义|谨慎行动|武断行动|保持警惕并控制行动/;

  function cleanActionPhrase(value) {
    const source = String(value || "").trim();
    if (/[，。；：、！？,.!?:;“”‘’（）()《》]/.test(source)) return "";
    const phrase = source.replace(/\s/g, "");
    if (!phrase || actionPlaceholderPattern.test(phrase)) return "";
    return /^[\u3400-\u9fff]{2,8}$/.test(phrase) ? phrase : "";
  }

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

  const semanticActionPairs = {
    start: {
      overall: ["核实起步条件", "勿在起步冒进"], relationship: ["确认关系起点", "勿仓促推进关系"],
      money: ["核对投入条件", "勿仓促投入资金"], bodyMind: ["确认身心承受", "勿仓促进加强度"]
    },
    stable: {
      overall: ["巩固当前基础", "勿在未稳时扩张"], relationship: ["稳住关系基础", "勿在未稳时承诺"],
      money: ["稳住资金基础", "勿在未稳时加码"], bodyMind: ["稳住恢复基础", "勿在未稳时加量"]
    },
    turn: {
      overall: ["调整当前方向", "勿固守原有做法"], relationship: ["调整沟通方式", "勿固守原有关系"],
      money: ["调整资金安排", "勿固守亏损方案"], bodyMind: ["调整恢复安排", "勿硬撑原有节奏"]
    },
    trial: {
      overall: ["保留进退余地", "勿作孤注一掷"], relationship: ["保留关系余地", "勿逼迫关系定性"],
      money: ["采用小额试行", "勿作孤注投入"], bodyMind: ["采用小量试行", "勿勉强增加负荷"]
    },
    lead: {
      overall: ["承担核心责任", "勿独断包办事务"], relationship: ["承担关系责任", "勿替对方做决定"],
      money: ["管好核心资源", "勿独断资金决策"], bodyMind: ["主动照护身心", "勿独自承担压力"]
    },
    close: {
      overall: ["完成必要收尾", "勿在极处加码"], relationship: ["收束关系冲突", "勿让冲突再升级"],
      money: ["及时收束风险", "勿在高位再加码"], bodyMind: ["及时休整回调", "勿在极限再透支"]
    },
    relation: {
      overall: ["厘清双方位置", "勿贸然绑定关系"], relationship: ["厘清关系责任", "勿逼迫关系定性"],
      money: ["厘清合作责任", "勿草率绑定合作"], bodyMind: ["厘清支持边界", "勿过度依赖他人"]
    },
    action: {
      overall: ["核实行动条件", "勿在条件未明行动"], relationship: ["核实推进条件", "勿在回应未明推进"],
      money: ["核实投入条件", "勿在风险未明投入"], bodyMind: ["核实承受能力", "勿在状态未明加量"]
    },
    responsibility: {
      overall: ["承担应尽责任", "勿推卸当前责任"], relationship: ["承担关系责任", "勿推卸沟通责任"],
      money: ["管好应负账责", "勿推卸资金责任"], bodyMind: ["承担照护责任", "勿忽视照护责任"]
    },
    support: {
      overall: ["寻求可靠协助", "勿拒绝可靠协助"], relationship: ["确认可靠支持", "勿拒绝坦诚协商"],
      money: ["寻求可靠求证", "勿独自承担风险"], bodyMind: ["寻求可信帮助", "勿独自承受压力"]
    }
  };

  const sharedSemanticActionPairs = {
    obstruction: ["化解当前阻力", "勿在受阻时强推"], learning: ["明确教养规则", "勿以严苛相逼"],
    waiting: ["静待时机成熟", "勿在未熟时抢先"], accumulate: ["积累必要条件", "勿跳过积累阶段"],
    conflict: ["化解当前冲突", "勿让冲突再升级"], order: ["明确规则边界", "勿破坏既定边界"],
    alliance: ["确认可靠同伴", "勿勉强求同结盟"], restraint: ["主动收敛锋芒", "勿逞强争先"],
    momentum: ["善用当前优势", "勿因顺势过度扩张"], change: ["顺势调整方向", "勿固守旧有做法"],
    displaced: ["稳住当前位置", "勿把暂时当长久"], form: ["保持形式合宜", "勿让形式遮实情"],
    resources: ["维护关键资源", "勿过度消耗资源"], overload: ["及时降低负荷", "勿让负荷继续累积"],
    durable: ["保持长期节奏", "勿因短期波动改向"], decision: ["明确取舍边界", "勿在犹疑中拖延"],
    small: ["先从小事推进", "勿贸然承接大事"], completed: ["做好完成后维护", "勿因完成而松懈"],
    incomplete: ["补齐未完环节", "勿在未成时松懈"], risk: ["先排除具体风险", "勿忽视风险信号"],
    adjust: ["及时修正偏差", "勿延续错误做法"], trust: ["以行动建立信任", "勿空口催促结果"],
    clarity: ["核实真实情况", "勿被表象误导"], care: ["做好持续养护", "勿透支长期基础"],
    openness: ["接纳不同意见", "勿拒绝必要沟通"], temporaryGain: ["看清暂得性质", "勿把胜诉当长久"],
    creator: ["主动创造条件", "勿逞强过度推进"], guard: ["守护既有成果", "勿因有成松懈"],
    conceal: ["保持内明外柔", "勿过早显露锋芒"], visible: ["善用公开机会", "勿为显露而冒进"],
    repair: ["修复既有弊端", "勿让旧弊延续"], discern: ["清除关键障碍", "勿在不明时决断"],
    transform: ["建立新的承载", "勿用旧器承新局"], reconnect: ["疏通阻塞联结", "勿任由关系涣散"],
    moderate: ["等待积累成形", "勿在未成时冒进"], communicate: ["保持反复沟通", "勿用强势求进入"],
    enter: ["顺势逐步深入", "勿以强硬求进入"], light: ["依附清晰原则", "勿被外在光明迷惑"],
    difference: ["聚焦可同之处", "勿强求全面一致"], teach: ["主动求教辨惑", "勿以无知自断"],
    speech: ["审慎言语取用", "勿只顾口腹之欲"], recovery: ["先稳住受惊状态", "勿在震动中失措"],
    balance: ["保持谦逊平衡", "勿因有终而自满"], earth: ["顺势承载事务", "勿争先强行主导"],
    temporaryStay: ["稳住暂居条件", "勿把暂居当归宿"], prosper: ["把握当前盛势", "勿让盛大转过度"]
  };

  const semanticActionPatterns = [
    ["start", /起步|preparation|emergence/], ["stable", /立稳|steadiness|balance/],
    ["turn", /转折|turningPoint/], ["trial", /试行|trial|flexibility/],
    ["lead", /主事|leadership|service/], ["close", /收束|excess/],
    ["obstruction", /初难|艰阻|困顿|重险|闭塞/], ["learning", /启蒙/],
    ["waiting", /等待|预备/], ["accumulate", /小积累|大积蓄|渐进/],
    ["conflict", /争议|咬合|分歧|震动/], ["order", /纪律|节制|家内秩序|整顿|止(?:\||$)/],
    ["alliance", /亲近|同道|靠近|聚集|相遇|感应|喜悦/], ["restraint", /谨慎践行|谦逊|退避|减损/],
    ["momentum", /通达|上升|前进|强盛|丰盛|增益/], ["change", /随时|返回|解除|变革|转化|涣散/],
    ["displaced", /剥落|光受伤|位置不当|旅行/], ["form", /修饰|礼仪/],
    ["resources", /共同资源/], ["overload", /过载/], ["durable", /恒久/], ["decision", /决断/],
    ["small", /小事可行/], ["completed", /已完成/], ["incomplete", /未完成/], ["care", /养护/],
    ["temporaryGain", /暂获|很快.*剥夺|不可把.*长久/],
    ["creator", /创造|自强/], ["guard", /防乱|守成/], ["conceal", /韬晦|内明外柔/],
    ["visible", /被看见|明出地上/], ["repair", /修复旧弊|前后复盘/], ["discern", /清障|明断|明辨/],
    ["transform", /养贤|建立新器/], ["reconnect", /疏通|重新凝聚/], ["moderate", /克制|将雨未雨/],
    ["communicate", /反复沟通|柔而有定/], ["enter", /顺入/], ["light", /依附|明辨/],
    ["difference", /求小同|异中见同/], ["teach", /求教|辨惑/], ["speech", /言语|自求口实/],
    ["recovery", /警醒|恢复镇定/], ["balance", /平衡|有终/], ["earth", /承载|厚德/],
    ["temporaryStay", /暂居|谨慎小成/], ["prosper", /盛大|把握当下/],
    ["clarity", /观察|真实|光明|warning|trend/], ["relation", /关系|婚|女|妇|夫|妹/],
    ["responsibility", /责任|担当|王事/], ["support", /support|相助|伙伴|合作|协助|同道/],
    ["trust", /诚信|有孚|取信|信任|真诚/], ["risk", /风险|危险|danger/],
    ["adjust", /调整|悔|纠正|改正/], ["action", /行动|推进|进取|往|征/], ["openness", /openness|包容|接纳|顺势/]
  ];

  function deriveSemanticActionPhrases(analysis, questionId) {
    const good = [];
    const avoid = [];
    const context = (analysis.selectedTexts || []).map(function(item) {
      return [item.text, item.interpretation]
        .concat(item.verdicts || [], item.situationTags || [], item.conditions || [], item.warnings || [], item.favorableActions || [], item.unfavorableActions || [])
        .filter(Boolean).join("|");
    }).join("|");
    semanticActionPatterns.forEach(function(rule) {
      if (!rule[1].test(context)) return;
      const topicPairs = semanticActionPairs[rule[0]];
      const pair = topicPairs ? (topicPairs[questionId] || topicPairs.overall) : sharedSemanticActionPairs[rule[0]];
      if (!pair) return;
      if (good.indexOf(pair[0]) === -1) good.push(pair[0]);
      if (avoid.indexOf(pair[1]) === -1) avoid.push(pair[1]);
    });
    return { good: good, avoid: avoid };
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

  function cleanDisplaySentence(text) {
    return String(text || "")
      .replace(/\s+/g, "")
      .replace(/(?:本卦|变卦|主辞|辅辞|\d+\s*个动爻|动爻使用)[：:]?/g, "")
      .replace(/^[，；。：]+|[，；。：]+$/g, "");
  }

  function compactDisplayFragment(text, maxLength) {
    const cleaned = cleanDisplaySentence(text);
    if (cleaned.length <= maxLength) return cleaned;
    let boundary = -1;
    ["；", "，", "、", "："].forEach(function(mark) {
      const index = cleaned.lastIndexOf(mark, maxLength);
      if (index > boundary) boundary = index;
    });
    if (boundary >= Math.min(12, Math.floor(maxLength * 0.55))) {
      return cleaned.slice(0, boundary);
    }
    return cleaned.slice(0, maxLength);
  }

  function getNoticeTheme(text) {
    if (/风险|危险|警惕|无咎|免于过失|过失|灾|厉|咎/.test(text)) return "risk";
    if (/守正|中正|正道|合宜|本分|贞|诚信|中道|守持.*条件|吉在最终结果/.test(text)) return "correctness";
    if (/时机|等待|成熟|尚未|未到|条件未/.test(text)) return "timing";
    if (/推进|强进|行动|征凶|勿用|不可|停止|收束|控制/.test(text)) return "action";
    if (/调整|悔亡|悔意|转好/.test(text)) return "adjustment";
    return "other";
  }

  function buildMaterialNotices(analysis) {
    const candidates = [];
    const selectedTexts = analysis.selectedTexts || [];
    function hasVerdict(verdicts, verdict) { return (verdicts || []).indexOf(verdict) !== -1; }
    function addCandidate(text, theme, priority, role, order) {
      if (!text) return;
      candidates.push({
        text: String(text).replace(/[。；]+$/, "") + "。",
        theme: theme,
        score: priority + (role === "primary" ? 8 : 0),
        order: order
      });
    }

    selectedTexts.forEach(function(item, itemIndex) {
      const verdicts = item.verdicts || [];
      const rawText = String(item.text || "");
      const meaning = [rawText, item.interpretation].concat(item.situationTags || []).filter(Boolean).join("|");
      const role = item.role || "secondary";
      const order = itemIndex * 20;

      if (/有言不信/.test(rawText)) addCandidate("此时言语未必能取信于人，空口解释作用有限", "trust", 150, role, order);
      if (/己日乃孚/.test(rawText)) addCandidate("改变需等时机成熟，过早推动难获认同", "timing", 145, role, order + 1);
      if (/征凶/.test(rawText) || hasVerdict(verdicts, "advanceBad")) addCandidate("主动推进会扩大风险", "advance", 140, role, order + 2);
      if (/勿用/.test(rawText) || hasVerdict(verdicts, "doNotAct")) addCandidate("时机未到，不宜行动", "doNotAct", 135, role, order + 3);
      if (/不可/.test(rawText) || hasVerdict(verdicts, "mustNot")) addCandidate("此事有明确限制，不可强行实施", "mustNot", 135, role, order + 4);
      if ((/厉/.test(rawText) || hasVerdict(verdicts, "danger")) && (/无咎/.test(rawText) || hasVerdict(verdicts, "noBlame"))) {
        addCandidate("当前有风险，谨慎处理才可免咎", "risk", 135, role, order + 5);
      }
      if (/贞吉/.test(rawText) || hasVerdict(verdicts, "correctGood")) addCandidate("有利的前提是守正", "correctness", 130, role, order + 6);
      if (/悔亡/.test(rawText) || hasVerdict(verdicts, "regretGone")) addCandidate("需要先作调整，问题才会逐步消退", "adjustment", 125, role, order + 7);
      if (hasVerdict(verdicts, "bad") && !hasVerdict(verdicts, "advanceBad")) addCandidate("当前结果明确不利，应先止损而非强求", "bad", 125, role, order + 8);
      if (hasVerdict(verdicts, "difficulty")) addCandidate("条件局促，勉强推进容易留下遗憾", "difficulty", 120, role, order + 9);
      if (hasVerdict(verdicts, "regret")) addCandidate("当前做法已有偏差，继续下去会加深悔意", "regret", 120, role, order + 10);
      if (hasVerdict(verdicts, "unfavorable")) addCandidate("当前方向存在不利，不宜照原计划推进", "unfavorable", 120, role, order + 11);
      if (hasVerdict(verdicts, "danger") && !hasVerdict(verdicts, "noBlame")) addCandidate("当前有明确风险，行动前须先化解危险", "risk", 115, role, order + 12);
      if (hasVerdict(verdicts, "noBlame") && !hasVerdict(verdicts, "danger")) addCandidate("只有妥善处理，才能免于过失；当前并非自然有利", "risk", 110, role, order + 13);
      if ((/贞/.test(rawText) || /守正|中正|正道/.test(meaning)) && !hasVerdict(verdicts, "correctGood")) {
        addCandidate("有利或免咎的前提是守正", "correctness", 105, role, order + 14);
      }

      (item.conditions || []).forEach(function(condition, conditionIndex) {
        const conditionText = String(condition || "").trim();
        if (!conditionText) return;
        const theme = getNoticeTheme(conditionText);
        let displayText = conditionText;
        if (theme === "timing") displayText = "需等待条件或时机成熟，再作推进";
        else if (theme === "correctness" && /守正|贞|中正|正道/.test(conditionText)) displayText = "有利的前提是守正";
        else if (theme === "adjustment") displayText = "需要先作调整，问题才会逐步消退";
        else if (theme === "risk" && hasVerdict(verdicts, "danger") && hasVerdict(verdicts, "noBlame")) displayText = "当前有风险，谨慎处理才可免咎";
        addCandidate(displayText, theme === "other" ? "otherCondition:" + conditionIndex : theme, 70, role, order + 15 + conditionIndex);
      });
    });

    candidates.sort(function(left, right) {
      if (right.score !== left.score) return right.score - left.score;
      return left.order - right.order;
    });
    return candidates.reduce(function(result, candidate) {
      const duplicateTheme = result.some(function(item) { return item.theme === candidate.theme; });
      const duplicateText = result.some(function(item) { return item.text === candidate.text; });
      if (!duplicateTheme && !duplicateText && result.length < 2) result.push(candidate);
      return result;
    }, []).map(function(item) { return item.text; });
  }

  function buildCompactSummary(options) {
    const core = cleanDisplaySentence(options.coreConflict || options.primaryMeaning);
    const clauses = core.split(/[；。]+/).map(cleanDisplaySentence).filter(Boolean);
    let situationSource = clauses[0] || cleanDisplaySentence(options.primaryMeaning);
    if (situationSource.length < 16 && options.primaryMeaning && cleanDisplaySentence(options.primaryMeaning).indexOf(situationSource) === -1) {
      situationSource = situationSource + "；整体上" + cleanDisplaySentence(options.primaryMeaning);
    }
    const semanticContext = [options.selectedMeaning, (options.situationTags || []).join("|")].join("|");
    const usableGood = (options.goodFor || []).find(function(item) { return item && !/辞文|具体矛盾/.test(item); });
    const usableAvoid = (options.avoid || []).find(function(item) { return item && !/辞文|具体矛盾/.test(item); });
    let reminder = "";
    if (/差异|分歧|相背|求小同/.test(semanticContext)) {
      reminder = /诚信|真诚|取信/.test(semanticContext) && /止损|停止|收束/.test(semanticContext)
        ? "关键是保持诚信并及时止损，避免让分歧继续扩大"
        : "关键是求小同并控制分歧，避免强求一致";
    } else if (/暂得安处|得到住处|暂时.*立足|尚非归宿/.test(semanticContext)) {
      reminder = "关键是分清短暂落脚与长期归宿";
    } else if (options.notices && options.notices.length) {
      reminder = cleanDisplaySentence(options.notices[0]);
      const trendConcept = {
        "守正可转吉": /守正|正道/,
        "调整后转稳": /调整|悔意|消退/,
        "等待时机转好": /等待|时机|成熟/,
        "谨慎处理可避咎": /风险|谨慎|免咎/,
        "处理得当可免咎": /妥善|处理|免咎/,
        "暂缓可避咎": /暂缓|勿用|不宜行动/,
        "主动推进有损": /主动推进|扩大风险|明确不利/
      }[options.fortuneTrend];
      if (options.fortuneTrend && (!trendConcept || !trendConcept.test(reminder))) {
        reminder = options.fortuneTrend + "；" + reminder;
      }
    } else if (clauses.length > 1) {
      reminder = "还要留意" + clauses[1].replace(/^需/, "");
    } else if (options.situationFocus) {
      reminder = "关键是" + options.situationFocus;
    } else if (usableGood) {
      reminder = "宜" + cleanDisplaySentence(usableGood);
      if (usableAvoid) reminder += "，避免" + cleanDisplaySentence(usableAvoid);
    } else if (usableAvoid) {
      reminder = "需要避免" + cleanDisplaySentence(usableAvoid);
    } else {
      reminder = "后续宜把重心放在" + String(options.changedKeyword || "稳妥应对") + "上";
    }
    function reminderEssence(text) {
      return cleanDisplaySentence(text).replace(/^(?:关键是|还要留意|宜|需要避免|后续宜|在[^，]{2,12}中，?)/, "").replace(/需要|必须|应当|仍可|只要|也须/g, "");
    }
    function coveredBySituation(text) {
      const essence = reminderEssence(text);
      const normalizedSituation = cleanDisplaySentence(situationSource).replace(/需要|必须|应当|仍可|只要|也须/g, "");
      return essence.length >= 3 && normalizedSituation.indexOf(essence) !== -1;
    }
    if (coveredBySituation(reminder)) {
      const alternatives = [
        options.situationFocus ? "关键是" + options.situationFocus : "",
        usableAvoid ? "需要避免" + cleanDisplaySentence(usableAvoid) : "",
        usableGood ? "宜" + cleanDisplaySentence(usableGood) : "",
        "后续宜把重心放在" + String(options.changedKeyword || "稳妥应对") + "上"
      ].filter(Boolean);
      reminder = alternatives.find(function(item) { return !coveredBySituation(item); }) || reminder;
    }
    const firstSentence = (/^(?:眼下|当前)/.test(situationSource) ? "" : "眼下") + compactDisplayFragment(situationSource, 28);
    let secondSentence = compactDisplayFragment(reminder, 28);
    if ((firstSentence + "。" + secondSentence + "。").length < 40) {
      const avoidText = usableAvoid;
      const goodText = usableGood;
      const hasSemanticReminder = /^关键是|^还要留意/.test(reminder);
      if (!hasSemanticReminder && avoidText && secondSentence.indexOf(cleanDisplaySentence(avoidText)) === -1) {
        secondSentence = compactDisplayFragment(reminder + "，避免" + cleanDisplaySentence(avoidText), 28);
      } else if (!hasSemanticReminder && goodText && secondSentence.indexOf(cleanDisplaySentence(goodText)) === -1) {
        secondSentence = compactDisplayFragment(reminder + "，宜" + cleanDisplaySentence(goodText), 28);
      }
    }
    if ((firstSentence + "。" + secondSentence + "。").length < 40 && options.topicPrefix) {
      secondSentence = compactDisplayFragment(options.topicPrefix + secondSentence, 28);
    }
    if ((firstSentence + "。" + secondSentence + "。").length < 40) {
      secondSentence = compactDisplayFragment(secondSentence + "，后续重心在" + String(options.changedKeyword || "稳妥应对"), 28);
    }
    if ((firstSentence + "。" + secondSentence + "。").length < 40) {
      const reminderContext = [reminder].concat(options.notices || []).join("|");
      let shortTail = "再作决定";
      if (/局促|条件不足|受限/.test(reminderContext)) shortTail = "勿强推";
      else if (/时机|等待|成熟/.test(reminderContext)) shortTail = "勿抢先";
      else if (/风险|危险|不利/.test(reminderContext)) shortTail = "先止险";
      else if (/守正|边界/.test(reminderContext)) shortTail = "勿越界";
      else if (/调整|悔意/.test(reminderContext)) shortTail = "先调整";
      secondSentence = compactDisplayFragment(secondSentence + "，" + shortTail, 28);
    }
    return firstSentence + "。" + secondSentence + "。";
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

    const selectedSemantic = (analysis.selectedTexts || []).map(function(item) {
      return [item.text, item.interpretation]
        .concat(item.verdicts || [], item.situationTags || [], item.conditions || [], item.warnings || [], item.favorableActions || [], item.unfavorableActions || [])
        .filter(Boolean).join("|");
    }).join("|");
    const isKuiSixThree = /车被拖.*牛被牵.*起初.*不顺.*最终/.test(selectedSemantic) || /見輿曳.*其牛掣.*无初有終/.test(selectedSemantic);
    const kuiSixThreeActions = {
      overall: {
        good: ["化解眼前牵制", "稳住当前节奏", "坚持完成收尾"],
        avoid: ["受阻仍强推进", "急于扭转局面", "因狼狈而放弃"]
      },
      relationship: {
        good: ["化解关系牵制", "稳住沟通节奏", "守住关系目标"],
        avoid: ["受阻仍逼承诺", "急于扭转关系", "因难堪而放弃"]
      },
      money: {
        good: ["化解资金牵制", "稳住交易节奏", "完成必要收尾"],
        avoid: ["受阻仍追加投入", "急于扭转亏损", "因浮亏而放弃"]
      },
      bodyMind: {
        good: ["缓解身心牵制", "稳住恢复节奏", "完成基础照护"],
        avoid: ["受阻仍强加量", "急于恢复状态", "因挫败而放弃"]
      }
    };

    if (isKuiSixThree) {
      (kuiSixThreeActions[questionId] || kuiSixThreeActions.overall).good.forEach(function(item) { add(specificGood, item); });
      (kuiSixThreeActions[questionId] || kuiSixThreeActions.overall).avoid.forEach(function(item) { add(specificAvoid, item); });
    }

    if (!isKuiSixThree && /暂得安处|得到住处|暂得安|已有.*立足|暂时.*立足/.test(selectedMeaning)) {
      add(specificGood, "稳住暂时落脚");
      add(specificAvoid, "误把落脚当归宿");
    }
    if (!isKuiSixThree && /等待|时机未|条件未|尚未|未熟|迟归有时/.test(selectedMeaning)) {
      add(specificGood, "静待条件成熟");
      add(specificAvoid, "勿抢先定局");
    }
    if (!isKuiSixThree && /守正|中道|中正|正道|本分/.test(selectedMeaning)) {
      add(specificGood, "守住正当边界");
      add(specificAvoid, "勿越界求结果");
    }
    if (!isKuiSixThree && /诚信|真诚|取信|信任|有孚/.test(selectedMeaning)) {
      add(specificGood, "以行动建立信任");
      add(specificAvoid, "勿空口催促结果");
    }
    if (!isKuiSixThree && /停止|止损|退回|返回|退避|收束|不可.*进|不宜.*进|冒进/.test(selectedMeaning)) {
      add(specificGood, "及时止损收束");
      add(specificAvoid, "勿逆势继续加码");
    }
    if (!isKuiSixThree && /相助|伙伴|合作|求见|协助|支持|同道|联结/.test(selectedMeaning)) {
      add(specificGood, "确认可靠协助");
      add(specificAvoid, "勿在无援时硬撑");
    }
    if (!isKuiSixThree && /危险|风险|受困|凶|灾|伤|不安/.test(selectedMeaning)) {
      add(specificGood, "先化解具体风险");
      add(specificAvoid, "勿掩盖未解风险");
    }
    if (!isKuiSixThree && /起初|开局|无初/.test(selectedMeaning) && /有终|最终|完成|归宿/.test(selectedMeaning)) {
      add(specificGood, "稳住开局节奏");
      add(specificGood, "坚持完成收尾");
      add(specificAvoid, "勿因受挫放弃");
      add(specificAvoid, "勿急于扭转局面");
    }

    const semanticGood = (analysis.favorableActions || []).filter(function(item) {
      return item && !/按辞文|结合爻位|先辨明风险|谨慎处理/.test(item);
    });
    const semanticAvoid = (analysis.unfavorableActions || []).filter(function(item) {
      return item && !/脱离辞文条件|忽视危险、困难|强行推进辞文/.test(item);
    });
    const existingGood = isKuiSixThree ? [] : semanticGood.map(cleanActionPhrase).filter(Boolean);
    const existingAvoid = isKuiSixThree ? [] : semanticAvoid.map(cleanActionPhrase).filter(Boolean);
    const derivedActions = isKuiSixThree ? { good: [], avoid: [] } : deriveSemanticActionPhrases(analysis, questionId);

    const topicGood = isKuiSixThree ? [] : intents.good.map(function(intent) { return cleanActionPhrase(language[intent]); }).filter(Boolean);
    const topicAvoid = isKuiSixThree ? [] : intents.bad.map(function(intent) { return cleanActionPhrase(language[intent]); }).filter(Boolean);
    const coreConflict = buildCoreConflict(selectedInterpretations, primary.imageMeaning);
    const goodFor = uniqueValues(existingGood.concat(specificGood, derivedActions.good, topicGood).map(cleanActionPhrase).filter(Boolean)).slice(0, 3);
    const avoid = uniqueValues(existingAvoid.concat(specificAvoid, derivedActions.avoid, topicAvoid).map(cleanActionPhrase).filter(Boolean)).slice(0, 3);
    const primaryMeaning = String(primary.imageMeaning || "").replace(/[。；]+$/, "");
    const trend = primary.id === changed.id
      ? "卦势没有转成另一卦，重点仍在「" + primary.keywords[0] + "」这一层逐步落实。"
      : "卦势由「" + primary.name + "」转向「" + changed.name + "」，关注点也会从「" + primary.keywords[0] + "」逐渐转向「" + changed.keywords[0] + "」。";
    const situationFocus = getTopicSituationFocus(questionId, analysis.situationTags);
    const notices = buildMaterialNotices(analysis);
    const summary = buildCompactSummary({
      coreConflict: coreConflict,
      primaryMeaning: primaryMeaning,
      selectedMeaning: selectedMeaning,
      situationTags: analysis.situationTags,
      notices: notices,
      situationFocus: situationFocus,
      goodFor: goodFor,
      avoid: avoid,
      fortuneTrend: analysis.trend,
      topicPrefix: {
        overall: "就今天的整体安排而言，",
        relationship: "就当前关系与沟通而言，",
        money: "就当前财务安排而言，",
        bodyMind: "就当前身心调适而言，"
      }[questionId] || "",
      changedKeyword: changed.keywords[0]
    });

    const basisSelectedItems = basis
      ? (basis.primaryTexts || []).concat(basis.secondaryTexts || [])
      : [];
    const selectedItems = basisSelectedItems.length ? basisSelectedItems : analysis.selectedTexts || [];
    function selectedItemTitle(item) {
      const source = String(item.source || "所取辞文").replace(/·(?:主|辅)$/, "");
      return [source, item.label].filter(Boolean).join("·");
    }
    const primaryItems = selectedItems.filter(function(item) { return item.role === "primary"; });
    const secondaryItems = selectedItems.filter(function(item) { return item.role !== "primary"; });
    const primaryNames = primaryItems.map(selectedItemTitle).join("、") || "主辞";
    const secondaryNames = secondaryItems.map(selectedItemTitle).join("、");
    const selectionRelation = secondaryNames
      ? "本次以" + primaryNames + "为主，以" + secondaryNames + "为辅；辅辞用于补充和校正主辞的方向。"
      : "本次只取" + primaryNames + "作为判断中心。";
    const meaningDetails = selectedItems.map(function(item) {
      const role = item.role === "primary" ? "主辞" : "辅辞";
      const meaning = String(item.interpretation || item.text || "").replace(/[。；]+$/, "");
      return role + "“" + selectedItemTitle(item) + "”意为：" + meaning;
    }).join("；");
    const primarySelectedRaw = primaryItems.map(function(item) { return item.text || ""; }).join("|");
    const conditionalExplanations = [];
    if ((analysis.primaryVerdicts || []).indexOf("noBlame") !== -1) {
      conditionalExplanations.push(/贞/.test(primarySelectedRaw)
        ? "主辞所说的有利与无咎，以守正并妥善处理为前提，不表示当前已经顺遂。"
        : "主辞的无咎表示处理得当可以避免过失，不等于当前为吉。");
    } else if ((analysis.primaryVerdicts || []).indexOf("correctGood") !== -1) {
      conditionalExplanations.push("主辞明确为吉，但有利建立在守正这一前提上。");
    }
    if ((analysis.secondaryVerdicts || []).indexOf("regretGone") !== -1) {
      conditionalExplanations.push("辅辞的悔亡表示调整后才会转好，不能覆盖主辞所示的当前处境。");
    }
    const conditionalExplanation = conditionalExplanations.join("");
    const conditionText = notices.length
      ? "这些判断须连同辞文所附的条件或警示理解：" + notices.map(function(item) {
        return String(item).replace(/[。；]+$/, "");
      }).join("；") + "。"
      : "";
    const focusText = situationFocus
      ? "因此在“" + topicLabel + "”中，判断重点具体落在" + situationFocus + "。"
      : "因此在“" + topicLabel + "”中，应直接以所取辞文指出的处境决定进退。";
    const interpretation = "本卦「" + primary.name + "」以“" + primaryMeaning + "”作为局面背景。" +
      (basis && basis.summary ? basis.summary : "依本次动爻数量取辞。") + selectionRelation + meaningDetails + "。" + trend +
      conditionalExplanation + "综合当前处境和主辅关系，本次趋势为“" + analysis.trend + "”。" + conditionText + focusText;
    const selectedTextSummary = selectedItems.map(function(item) {
      const role = item.role === "primary" ? "主辞" : "辅辞";
      return role + "（" + selectedItemTitle(item) + "）：「" + item.text + "」";
    }).join("；");
    return {
      summary: summary,
      selectedTextSummary: selectedTextSummary,
      interpretation: interpretation,
      goodFor: goodFor,
      avoid: avoid,
      notices: notices,
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
    const judgmentAnalysis = assessSelectedTexts(basis, { primary: primary, changed: changed });
    const fortune = judgmentAnalysis.overallGrade;
    const oracleKeywords = getOracleKeywords(primary, changed, basis);
    const guidance = getTopicGuidance(questionId, primary, changed, basis, judgmentAnalysis);
    const basisText = basis.items.map(function(item) {
      const label = item.label ? item.label + "·" : "";
      const keyword = item.keyword ? item.keyword + "：" : "";
      return item.source + " " + label + keyword + item.text;
    }).join(" ");
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
      overallGrade: fortune,
      fortuneTrend: judgmentAnalysis.trend,
      trend: judgmentAnalysis.trend,
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
