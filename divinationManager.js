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

  function getIChingCatalog() {
    if (typeof window !== "undefined" && window.CAMP_ICHING_CATALOG) {
      return window.CAMP_ICHING_CATALOG;
    }

    if (typeof require === "function") {
      try {
        return require("./ichingCatalog.js");
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
        (!clean.result.summary || !clean.result.interpretation || !clean.result.conclusion)) {
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

  function createCoin(seed, index) {
    const yang = mixUint32(hashStringToUint32(seed)) >= 0x80000000;
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
      keywords: hexagram.keywords.slice(),
      imageMeaning: hexagram.imageMeaning
    };
  }

  function getLineReading(hexagram, position) {
    const line = hexagram && Array.isArray(hexagram.lines) ? hexagram.lines[position - 1] : null;
    return line ? {
      position: position,
      label: line.label,
      keyword: line.keyword,
      text: line.text
    } : {
      position: position,
      label: "第" + position + "爻",
      keyword: "爻位",
      text: "观察这一爻所在阶段的进退与分寸。"
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
      summary: "",
      primaryPosition: 0,
      items: []
    };

    if (count === 0) {
      basis.rule = "primaryJudgment";
      basis.summary = "0 个动爻：以本卦卦辞为主。";
      basis.items.push({ source: "本卦卦辞", text: primary.judgment });
    } else if (count === 1) {
      basis.rule = "oneMovingLine";
      basis.primaryPosition = movingPositions[0];
      basis.summary = "1 个动爻：以本卦" + getLineReading(primary, basis.primaryPosition).label + "为主。";
      basis.items.push({ source: "本卦动爻", ...getLineReading(primary, basis.primaryPosition) });
    } else if (count === 2) {
      basis.rule = "twoMovingLines";
      basis.primaryPosition = Math.max.apply(Math, movingPositions);
      basis.summary = "2 个动爻：看本卦两条动爻，以上爻为主。";
      movingPositions.forEach(function(position) {
        basis.items.push({ source: position === basis.primaryPosition ? "本卦动爻·主" : "本卦动爻·辅", ...getLineReading(primary, position) });
      });
    } else if (count === 3) {
      basis.rule = "bothJudgments";
      basis.summary = "3 个动爻：合看本卦卦辞与变卦卦辞。";
      basis.items.push({ source: "本卦卦辞", text: primary.judgment });
      basis.items.push({ source: "变卦卦辞", text: changed.judgment });
    } else if (count === 4) {
      basis.rule = "twoChangedStaticLines";
      basis.primaryPosition = Math.min.apply(Math, staticPositions);
      basis.summary = "4 个动爻：看变卦两条静爻，以下爻为主。";
      staticPositions.forEach(function(position) {
        basis.items.push({ source: position === basis.primaryPosition ? "变卦静爻·主" : "变卦静爻·辅", ...getLineReading(changed, position) });
      });
    } else if (count === 5) {
      basis.rule = "oneChangedStaticLine";
      basis.primaryPosition = staticPositions[0];
      basis.summary = "5 个动爻：以变卦唯一静爻为主。";
      basis.items.push({ source: "变卦静爻", ...getLineReading(changed, basis.primaryPosition) });
    } else if (primary.id === 1) {
      basis.rule = "qianUseNine";
      basis.summary = "6 个动爻：乾卦用九。";
      basis.items.push({ source: "用九", text: "见群龙无首，吉。" });
    } else if (primary.id === 2) {
      basis.rule = "kunUseSix";
      basis.summary = "6 个动爻：坤卦用六。";
      basis.items.push({ source: "用六", text: "利永贞。" });
    } else {
      basis.rule = "changedJudgment";
      basis.summary = "6 个动爻：以变卦卦辞为主。";
      basis.items.push({ source: "变卦卦辞", text: changed.judgment });
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

  function getFortuneGrade(primary, changed, basis) {
    const favorable = [1, 2, 8, 11, 13, 14, 15, 17, 19, 24, 26, 30, 31, 32, 35, 40, 42, 46, 50, 53, 55, 58, 61, 63];
    const cautious = [6, 12, 23, 28, 29, 33, 36, 38, 39, 44, 47, 51, 54, 56, 62, 64];
    const scoreHexagram = function(hexagram) {
      if (favorable.indexOf(hexagram.id) !== -1) {
        return 1;
      }
      if (cautious.indexOf(hexagram.id) !== -1) {
        return -1;
      }
      return 0;
    };
    const changedWeight = Math.min(0.72, basis.movingCount * 0.12);
    const score = scoreHexagram(primary) * (1 - changedWeight) + scoreHexagram(changed) * changedWeight;

    if (score >= 0.8) {
      return "大吉";
    }
    if (score >= 0.25) {
      return "吉";
    }
    if (score <= -0.8) {
      return "凶";
    }
    if (score <= -0.25) {
      return "慎";
    }
    return "平";
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

  function getTopicGuidance(questionId, primary, changed, basis, fortune) {
    const topicPhrases = {
      overall: {
        goodFor: ["明确重点", "安排先后"],
        avoid: ["多线并进", "急于定局"],
        opening: "先定主次，再顺势推进。",
        conclusion: "此卦重在" + primary.keywords[0] + "，先稳后进。"
      },
      relationship: {
        goodFor: ["说明感受", "观察回应"],
        avoid: ["猜测对方想法", "用情绪逼出答案"],
        opening: "先说明感受，再观察回应。",
        conclusion: "今日宜整理关系，不宜急求回应。"
      },
      money: {
        goodFor: ["核对预算", "小额试探"],
        avoid: ["冲动购物", "追涨加码"],
        opening: "先核对用途，再决定投入。",
        conclusion: "今日宜守住预算，不宜冲动加码。"
      },
      bodyMind: {
        goodFor: ["减轻负荷", "规律休息"],
        avoid: ["硬撑消耗", "忽视疲惫"],
        opening: "先减轻负荷，再恢复节奏。",
        conclusion: "今日宜照顾节奏，不宜勉强硬撑。"
      }
    };
    const toneByFortune = {
      "大吉": "条件相应，可从容推进。",
      "吉": "势可小进，仍宜留有余地。",
      "平": "事势未定，宜先稳住节奏。",
      "慎": "承载过多时，先整顿边界。",
      "凶": "阻力正盛，宜收束而不宜强进。"
    };
    const topic = topicPhrases[questionId] || topicPhrases.overall;
    const goodFor = topic.goodFor.concat(["围绕" + primary.keywords[0] + "调整"]);
    const avoid = topic.avoid.concat(["背离" + changed.keywords[0] + "强推"]);
    const movementLine = basis.movingCount === 0
      ? "守住已有秩序，静待时机。"
      : basis.movingCount <= 2
        ? "变化初起，宜小步试行。"
        : basis.movingCount <= 4
          ? "先收后放，等关系与资源自然成形。"
          : "变动已深，先留退路再行动。";

    return {
      summary: primary.id === changed.id
        ? primary.name + "主" + primary.keywords[0] + "与" + primary.keywords[1] + "。" + movementLine
        : primary.name + "主" + primary.keywords[0] + "，" + changed.name + "见" + changed.keywords[0] + "。" + movementLine,
      interpretation: topic.opening + toneByFortune[fortune],
      goodFor: goodFor.slice(0, 3),
      avoid: avoid.slice(0, 3),
      conclusion: topic.conclusion
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
    const fortune = getFortuneGrade(primary, changed, basis);
    const oracleKeywords = getOracleKeywords(primary, changed, basis);
    const guidance = getTopicGuidance(questionId, primary, changed, basis, fortune);
    const movementReading = getMovementReading(basis);
    const basisText = basis.items.map(function(item) {
      const label = item.label ? item.label + "·" : "";
      const keyword = item.keyword ? item.keyword + "：" : "";
      return item.source + " " + label + keyword + item.text;
    }).join(" ");
    const detailInterpretation = primary.imageMeaning + " " + movementReading + " 本卦" + primary.name + "，变卦" + changed.name + "。";
    const effects = getTurtleEffects(primary, changed, question, basis);

    return {
      type: "turtle",
      method: "turtle",
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
      keywords: oracleKeywords,
      summary: guidance.summary,
      interpretation: guidance.interpretation,
      conclusion: guidance.conclusion,
      goodFor: guidance.goodFor,
      avoid: guidance.avoid,
      reality: guidance.summary,
      advice: basis.summary + " " + basisText,
      detailInterpretation: detailInterpretation,
      campImpact: guidance.conclusion,
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
