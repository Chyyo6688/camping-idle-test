// Tarot and turtle-shell divination state, rendering, and interactions.

function getDivinationManager() {
  return typeof window !== "undefined" && window.CAMP_DIVINATION_MANAGER ? window.CAMP_DIVINATION_MANAGER : null;
}

function getDivinationCatalog() {
  return typeof window !== "undefined" && window.CAMP_DIVINATION_CATALOG ? window.CAMP_DIVINATION_CATALOG : null;
}

function getDivinationDateKey(date) {
  const manager = getDivinationManager();
  return manager && manager.getLocalDateKey ? manager.getLocalDateKey(date) : getLocalDateKey(date);
}

function createEmptyTodayDivinations(dateKey) {
  const manager = getDivinationManager();

  if (manager && manager.createEmptyTodayDivinations) {
    return manager.createEmptyTodayDivinations(dateKey || "");
  }

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

function sanitizeTodayDivinations(todayDivinations, dateKey, legacyTodayDivination) {
  const manager = getDivinationManager();

  if (manager && manager.sanitizeSavedDivinations) {
    return manager.sanitizeSavedDivinations(todayDivinations, dateKey || "", legacyTodayDivination);
  }

  const source = todayDivinations && typeof todayDivinations === "object" && !Array.isArray(todayDivinations) ? todayDivinations : {};
  const clean = createEmptyTodayDivinations(dateKey || "");

  if (!source.date || dateKey && source.date !== dateKey) {
    return clean;
  }

  clean.date = source.date;
  ["tarot", "turtle"].forEach(function(method) {
    const methodRecords = source.records && source.records[method];
    if (methodRecords && typeof methodRecords === "object" && !Array.isArray(methodRecords)) {
      Object.keys(methodRecords).forEach(function(questionId) {
        const record = methodRecords[questionId];
        if (record && record.date === clean.date && record.method === method && record.question === questionId && record.result) {
          clean.records[method][questionId] = { ...record };
        }
      });
    }

    const methodRerollSalt = source.rerollSalt && source.rerollSalt[method];
    if (methodRerollSalt && typeof methodRerollSalt === "object" && !Array.isArray(methodRerollSalt)) {
      Object.keys(methodRerollSalt).forEach(function(questionId) {
        const rerollSalt = Math.max(0, Math.floor(Number(methodRerollSalt[questionId]) || 0));
        if (rerollSalt > 0) {
          clean.rerollSalt[method][questionId] = rerollSalt;
        }
      });
    }
  });

  const active = source.active && typeof source.active === "object" ? source.active : {};
  if (clean.records[active.method] && clean.records[active.method][active.question]) {
    clean.active = {
      method: active.method,
      question: active.question
    };
  }
  return clean;
}

function sanitizeDivinationUnlocks(unlocks) {
  const source = unlocks && typeof unlocks === "object" && !Array.isArray(unlocks) ? unlocks : {};

  return {
    turtleShell: Boolean(source.turtleShell)
  };
}

function ensureTodayDivinationsForToday(date, state) {
  const campState = state || gameState;
  const dateKey = getDivinationDateKey(date);
  campState.todayDivinations = sanitizeTodayDivinations(campState.todayDivinations, dateKey, campState.todayDivination);
  if (Object.prototype.hasOwnProperty.call(campState, "todayDivination")) {
    delete campState.todayDivination;
  }
  return campState.todayDivinations;
}

function getDivinationUserSeed() {
  const dailyWeather = ensureDailyWeatherForToday();
  return dailyWeather.userSeed || "camp-divination";
}

function getTodayDivinationSalt(method, questionId, state) {
  const dailyDivinations = ensureTodayDivinationsForToday(new Date(), state);
  const methodRerollSalt = dailyDivinations.rerollSalt && dailyDivinations.rerollSalt[method];
  const rerollSalt = Math.max(0, Math.floor(Number(methodRerollSalt && methodRerollSalt[questionId]) || 0));
  return rerollSalt > 0 ? "daily:" + rerollSalt : "daily";
}

function getTodayDivinationRecord(method, questionId, state) {
  const dailyDivinations = ensureTodayDivinationsForToday(new Date(), state);
  const manager = getDivinationManager();

  if (manager && manager.getSavedDivination) {
    return manager.getSavedDivination(dailyDivinations, method, questionId);
  }

  const methodRecords = dailyDivinations.records && dailyDivinations.records[method];
  const record = methodRecords && methodRecords[questionId];
  return record && record.result ? record : null;
}

function getActiveTodayDivination(state) {
  const dailyDivinations = ensureTodayDivinationsForToday(new Date(), state);
  const active = dailyDivinations.active || {};
  return getTodayDivinationRecord(active.method, active.question, state);
}

function hasTodayDivinationResult(method, questionId, state) {
  if (isDivinationMethod(method) && questionId) {
    return Boolean(getTodayDivinationRecord(method, questionId, state));
  }

  const dailyDivinations = ensureTodayDivinationsForToday(new Date(), state);
  return ["tarot", "turtle"].some(function(methodId) {
    const records = dailyDivinations.records && dailyDivinations.records[methodId];
    return records && Object.keys(records).some(function(id) {
      return Boolean(records[id] && records[id].result);
    });
  });
}

function getCurrentDivinationResult() {
  if (testDivinationOverride && testDivinationOverride.result) {
    return testDivinationOverride.result;
  }

  const active = getActiveTodayDivination();
  return active && active.result ? active.result : null;
}

function getCurrentDivinationEffects() {
  if (testDivinationOverride && testDivinationOverride.effects) {
    return testDivinationOverride.effects;
  }

  const active = getActiveTodayDivination();
  return active && active.effects && typeof active.effects === "object" ? active.effects : {};
}

function getCurrentDivinationActivityWeights() {
  const effects = getCurrentDivinationEffects();
  return effects && effects.activityWeights ? effects.activityWeights : {};
}

function getCurrentDivinationActivityLabels() {
  const effects = getCurrentDivinationEffects();
  return effects && Array.isArray(effects.activityLabels) ? effects.activityLabels : [];
}

function getCurrentDivinationSoundRecommendations() {
  const effects = getCurrentDivinationEffects();
  return effects && Array.isArray(effects.soundRecommendations) ? effects.soundRecommendations : [];
}

function getCurrentDivinationMoodLine() {
  const effects = getCurrentDivinationEffects();
  return effects && typeof effects.moodLine === "string" ? effects.moodLine : "";
}

function getCurrentDivinationThoughtLines() {
  const effects = getCurrentDivinationEffects();
  return effects && Array.isArray(effects.thoughtLines) ? effects.thoughtLines : [];
}

function addUniqueText(list, value) {
  if (value && list.indexOf(value) === -1) {
    list.push(value);
  }
}

function addUniqueSoundRecommendation(list, recommendation) {
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

function getCurrentCampActivityLabels() {
  const labels = [];
  getCurrentWeatherActivityLabels().forEach(function(label) {
    addUniqueText(labels, label);
  });
  getCurrentDivinationActivityLabels().forEach(function(label) {
    addUniqueText(labels, label);
  });
  return labels;
}

function getCurrentCampSoundRecommendations() {
  const recommendations = [];
  getCurrentWeatherSoundRecommendations().forEach(function(recommendation) {
    addUniqueSoundRecommendation(recommendations, recommendation);
  });
  getCurrentDivinationSoundRecommendations().forEach(function(recommendation) {
    addUniqueSoundRecommendation(recommendations, recommendation);
  });
  return recommendations;
}

function isDivinationPanelOpen() {
  return Boolean(divinationLayer && !divinationLayer.classList.contains("hidden"));
}

function getDivinationQuestionIds() {
  const manager = getDivinationManager();
  return manager && manager.getQuestionIds ? manager.getQuestionIds() : ["overall", "relationship", "bodyMind", "money"];
}

function getDivinationQuestion(questionId) {
  const manager = getDivinationManager();
  return manager && manager.getQuestion ? manager.getQuestion(questionId) : null;
}

function getDivinationMethodDefinition(method) {
  const manager = getDivinationManager();
  return manager && manager.getMethodDefinition ? manager.getMethodDefinition(method) : null;
}

function isDivinationMethod(method) {
  return method === "tarot" || method === "turtle";
}

function hasDivinationMethodUnlocked(method, state) {
  const campState = state || gameState;

  if (method === "tarot") {
    return ownsGear("campBoardGame", campState);
  }

  if (method === "turtle") {
    const unlocks = sanitizeDivinationUnlocks(campState.divinationUnlocks);
    return unlocks.turtleShell;
  }

  return false;
}

function getFirstUnlockedDivinationMethod() {
  if (hasDivinationMethodUnlocked("tarot")) {
    return "tarot";
  }
  if (hasDivinationMethodUnlocked("turtle")) {
    return "turtle";
  }
  return "";
}

function syncDivinationEntryState() {
  if (!divinationButton) {
    return;
  }

  divinationButton.classList.toggle("has-result", hasTodayDivinationResult());
  divinationButton.classList.toggle("locked", !hasDivinationMethodUnlocked("tarot") && !hasDivinationMethodUnlocked("turtle"));
}

function resetTurtleCastAnimationState() {
  turtleCastPending = false;
  turtleCastPhase = "idle";
  turtlePendingLine = null;
  if (turtleCoinVisual) {
    turtleCoinVisual.classList.remove("is-revealing");
  }
  if (turtleShellButton) {
    turtleShellButton.classList.remove("is-shaking");
  }
}

function resetDivinationDraft() {
  selectedDivinationQuestionId = "overall";
  selectedDivinationMethod = getFirstUnlockedDivinationMethod();
  turtleCastLines = [];
  resetTurtleCastAnimationState();
  turtleHoldTriggered = false;
  if (turtleHoldTimer) {
    clearInterval(turtleHoldTimer);
    turtleHoldTimer = null;
  }
}

function renderDivinationQuestions() {
  if (!divinationQuestionList) {
    return;
  }

  divinationQuestionList.textContent = "";
  getDivinationQuestionIds().forEach(function(questionId) {
    const question = getDivinationQuestion(questionId);
    const button = document.createElement("button");
    const label = document.createElement("span");
    const status = document.createElement("small");
    const hasResult = hasTodayDivinationResult(selectedDivinationMethod, questionId);
    button.type = "button";
    button.className = "divination-choice-button";
    button.classList.toggle("selected", selectedDivinationQuestionId === questionId);
    button.classList.toggle("has-result", hasResult);
    label.textContent = question ? question.label : questionId;
    status.textContent = hasResult ? "今日已占" : "";
    button.appendChild(label);
    button.appendChild(status);
    button.addEventListener("click", function() {
      selectedDivinationQuestionId = questionId;
      turtleCastLines = [];
      resetTurtleCastAnimationState();
      renderDivinationSetup();
    });
    divinationQuestionList.appendChild(button);
  });
}

function renderDivinationMethods() {
  if (!divinationMethodList) {
    return;
  }

  divinationMethodList.textContent = "";
  ["tarot", "turtle"].forEach(function(method) {
    const definition = getDivinationMethodDefinition(method) || { label: method, lockedHint: "" };
    const unlocked = hasDivinationMethodUnlocked(method);
    const hasResult = hasTodayDivinationResult(method, selectedDivinationQuestionId);
    const button = document.createElement("button");
    const title = document.createElement("span");
    const hint = document.createElement("small");

    button.type = "button";
    button.className = "divination-method-button";
    button.classList.toggle("selected", selectedDivinationMethod === method);
    button.classList.toggle("locked", !unlocked);
    button.classList.toggle("has-result", hasResult);
    button.disabled = !unlocked;
    title.textContent = (unlocked ? "" : "🔒 ") + definition.label;
    hint.textContent = unlocked ? hasResult ? "今日已占 · 查看结果" : "今日可占" : definition.lockedHint;
    button.appendChild(title);
    button.appendChild(hint);
    button.addEventListener("click", function() {
      selectedDivinationMethod = method;
      turtleCastLines = [];
      resetTurtleCastAnimationState();
      renderDivinationSetup();
    });
    divinationMethodList.appendChild(button);
  });
}

function renderTurtleLines(lines) {
  if (!turtleLineStack) {
    return;
  }

  turtleLineStack.textContent = "";
  (lines || []).slice().reverse().forEach(function(line) {
    const row = document.createElement("div");
    const mark = document.createElement("span");
    const label = document.createElement("small");
    const yinYang = line && (line.yinYang === "yang" || line.type === "yang") ? "yang" : "yin";
    row.className = "turtle-line-row";
    mark.className = "turtle-line turtle-line-" + yinYang;
    mark.classList.toggle("moving", Boolean(line && line.moving));
    mark.setAttribute("aria-label", yinYang === "yang" ? "阳爻" : "阴爻");
    label.textContent = getTurtleLineLabel(line);
    row.appendChild(mark);
    row.appendChild(label);
    turtleLineStack.appendChild(row);
  });
}

function getTurtleLineLabel(line) {
  if (!line) {
    return "";
  }

  const catalog = getDivinationCatalog();
  const labels = catalog && catalog.turtleLineLabels || {};
  if (labels[line.type]) {
    return "第" + line.position + "爻 · " + labels[line.type];
  }

  return "第" + (line.position || line.index + 1) + "爻 · " + (line.yinYang === "yang" || line.type === "yang" ? "阳" : "阴");
}

function renderTurtleCoins(line) {
  if (!turtleCoinTray) {
    return;
  }

  turtleCoinTray.textContent = "";
  turtleCoinTray.classList.toggle("hidden", !line);
  if (!line || !Array.isArray(line.coins)) {
    if (turtleCastReadout) {
      turtleCastReadout.textContent = turtleCastPhase === "shaking" ? "龟壳摇动中..." : "点击龟壳，一爻一掷";
    }
    return;
  }

  const coins = line.coins;
  coins.forEach(function(coin, index) {
    const holder = document.createElement("span");
    const image = document.createElement("img");
    const side = coin && coin.side === "yin" ? "yin" : "yang";
    holder.className = "turtle-coin turtle-coin-" + (index + 1);
    holder.classList.toggle("waiting", !line);
    image.alt = "";
    setVersionedImageSource(image, "assets/divination/coins/coin_" + side + ".png");
    holder.appendChild(image);
    turtleCoinTray.appendChild(holder);
  });

  if (turtleCastReadout) {
    turtleCastReadout.textContent = getTurtleLineLabel(line) + " · 合计 " + line.total;
  }
}

function getTurtleShellFramePath(castNumber) {
  const frame = Math.max(0, Math.min(6, Math.floor(Number(castNumber) || 0)));
  return frame > 0
    ? "assets/divination/turtle_shell/turtle_shell_shake_" + frame + ".png"
    : "assets/divination/turtle_shell/turtle_shell.png";
}

function renderTurtleShellFrame(castNumber) {
  if (turtleShellImage) {
    setVersionedImageSource(turtleShellImage, getTurtleShellFramePath(castNumber));
  }
}

function playTurtleShellShake(castNumber) {
  if (!turtleShellButton) {
    return;
  }

  renderTurtleShellFrame(castNumber);
  turtleShellButton.classList.remove("is-shaking");
  void turtleShellButton.offsetWidth;
  turtleShellButton.classList.add("is-shaking");
}

function playTurtleCoinReveal() {
  if (!turtleCoinVisual) {
    return;
  }

  turtleCoinVisual.classList.remove("is-revealing");
  void turtleCoinVisual.offsetWidth;
  turtleCoinVisual.classList.add("is-revealing");
}

function renderDivinationSetup() {
  const method = selectedDivinationMethod;
  const methodDefinition = getDivinationMethodDefinition(method);
  const methodUnlocked = method && hasDivinationMethodUnlocked(method);
  const savedRecord = getTodayDivinationRecord(method, selectedDivinationQuestionId);

  renderDivinationQuestions();
  renderDivinationMethods();

  if (savedRecord) {
    renderDivinationResult(savedRecord.result, true);
    return;
  }

  if (divinationIntro) {
    divinationIntro.textContent = "每种方式的每个类别每天各占一次；已占过的结果会保留到明天。";
  }

  if (divinationQuestionList) {
    divinationQuestionList.classList.remove("hidden");
  }
  if (divinationMethodList) {
    divinationMethodList.classList.remove("hidden");
  }
  if (divinationStage) {
    divinationStage.classList.remove("hidden");
  }
  if (divinationResult) {
    divinationResult.classList.add("hidden");
  }
  if (divinationActionButton) {
    divinationActionButton.classList.remove("hidden");
  }
  if (divinationCardVisual) {
    divinationCardVisual.classList.toggle("hidden", method === "turtle");
    divinationCardVisual.classList.remove("shuffling", "revealed");
    divinationCardVisual.style.backgroundImage = "";
  }
  if (turtleCoinVisual) {
    turtleCoinVisual.classList.toggle("hidden", method !== "turtle");
  }
  if (turtleShellButton) {
    turtleShellButton.disabled = method !== "turtle" || !methodUnlocked || turtleCastPending;
    if (turtleCastPhase !== "shaking") {
      turtleShellButton.classList.remove("is-shaking");
    }
  }

  renderTurtleShellFrame(turtleCastPhase === "shaking" ? turtleCastLines.length + 1 : 0);
  renderTurtleCoins(turtleCastPhase === "shaking" ? null : turtleCastLines[turtleCastLines.length - 1]);
  renderTurtleLines(turtleCastLines);

  if (divinationActionButton) {
    divinationActionButton.disabled = !method || !methodUnlocked || turtleCastPending;
    if (!method) {
      divinationActionButton.textContent = "先解锁占营方式";
    } else if (!methodUnlocked) {
      divinationActionButton.textContent = methodDefinition && methodDefinition.lockedHint || "还没解锁";
    } else if (method === "turtle") {
      divinationActionButton.textContent = turtleCastPending
        ? turtleCastPhase === "shaking" ? "龟壳摇动中..." : turtleCastLines.length >= 6 ? "六爻已成，解卦中..." : "铜钱落定..."
        : "摇动龟壳 · 第 " + (turtleCastLines.length + 1) + " / 6 爻";
    } else {
      divinationActionButton.textContent = methodDefinition && methodDefinition.actionLabel || "开始占营";
    }
  }
}

function setVersionedImageSource(image, path) {
  if (image && path) {
    image.src = withVersion(path);
  }
}

function appendIChingHexagramCard(container, label, hexagram, lineValues, movingPositions) {
  if (!container || !hexagram) {
    return;
  }

  const card = document.createElement("section");
  const kicker = document.createElement("small");
  const heading = document.createElement("strong");
  const lines = document.createElement("div");
  card.className = "iching-hexagram-card";
  kicker.textContent = label + (hexagram.upperTrigram && hexagram.lowerTrigram
    ? " · 上" + hexagram.upperTrigram.name + " 下" + hexagram.lowerTrigram.name
    : "");
  heading.textContent = hexagram.name;
  lines.className = "iching-hexagram-lines";

  (lineValues || []).map(function(value, index) {
    return { value: value, position: index + 1 };
  }).reverse().forEach(function(line) {
    const row = document.createElement("div");
    const mark = document.createElement("span");
    const position = document.createElement("small");
    const yinYang = line.value === "yang" || line.value === 1 ? "yang" : "yin";
    row.className = "turtle-line-row";
    mark.className = "turtle-line turtle-line-" + yinYang;
    if ((movingPositions || []).indexOf(line.position) !== -1) {
      mark.classList.add("moving");
    }
    position.textContent = String(line.position);
    row.appendChild(mark);
    row.appendChild(position);
    lines.appendChild(row);
  });

  card.appendChild(kicker);
  card.appendChild(heading);
  card.appendChild(lines);
  container.appendChild(card);
}

function renderIChingResultLines(result) {
  if (!divinationResultLines) {
    return;
  }

  divinationResultLines.textContent = "";
  divinationResultLines.classList.add("iching-result-hexagrams");
  appendIChingHexagramCard(
    divinationResultLines,
    "本卦",
    result.primaryHexagram,
    result.primaryLines,
    result.movingLines
  );

  const arrow = document.createElement("span");
  arrow.className = "iching-change-arrow";
  arrow.textContent = "→";
  divinationResultLines.appendChild(arrow);

  appendIChingHexagramCard(
    divinationResultLines,
    "变卦",
    result.changedHexagram,
    result.changedLines,
    []
  );
  divinationResultLines.classList.remove("hidden");
}

function renderOraclePhraseList(list, phrases) {
  if (!list) {
    return;
  }

  list.textContent = "";
  (phrases || []).slice(0, 3).forEach(function(phrase) {
    const item = document.createElement("li");
    item.textContent = phrase;
    list.appendChild(item);
  });
}

function renderModernIChingResult(result) {
  if (divinationTurtleFortune) {
    divinationTurtleFortune.textContent = result.fortune || "平";
    divinationTurtleFortune.dataset.fortune = result.fortune || "平";
  }
  if (divinationTurtlePrimaryName) {
    divinationTurtlePrimaryName.textContent = result.primaryHexagram.name;
  }
  if (divinationTurtleMovingCount) {
    const movingCount = Array.isArray(result.movingLines) ? result.movingLines.length : 0;
    divinationTurtleMovingCount.textContent = "本卦 " + result.primaryHexagram.name + " · " + movingCount + " 个动爻 · 变卦 " + result.changedHexagram.name;
  }
  if (divinationTurtleKeywords) {
    divinationTurtleKeywords.textContent = "";
    (result.keywords || []).slice(0, 4).forEach(function(keyword) {
      const word = document.createElement("span");
      word.textContent = keyword;
      divinationTurtleKeywords.appendChild(word);
    });
  }
  if (divinationTurtleSummary) {
    divinationTurtleSummary.textContent = result.summary || result.reality || "";
  }
  if (divinationTurtleSelectedText) {
    divinationTurtleSelectedText.textContent = result.selectedTextSummary || "";
  }
  if (divinationTurtleInterpretation) {
    divinationTurtleInterpretation.textContent = result.interpretation || "";
  }
  renderOraclePhraseList(divinationTurtleGoodFor, result.goodFor);
  renderOraclePhraseList(divinationTurtleAvoid, result.avoid);
  if (divinationTurtleNotice && divinationTurtleNoticeList) {
    const notices = Array.isArray(result.notices) ? result.notices.filter(Boolean) : [];
    renderOraclePhraseList(divinationTurtleNoticeList, notices);
    divinationTurtleNotice.classList.toggle("hidden", notices.length === 0);
  }
  if (divinationTurtleDetails) {
    divinationTurtleDetails.removeAttribute("open");
  }

  renderIChingResultLines(result);

  if (divinationResultBasis) {
    const readingBasis = result.readingBasis || {};
    function getSelectedTextName(item) {
      const source = String(item && item.source || "所取辞文").replace(/·(?:主|辅)$/, "");
      return [source, item && item.label].filter(Boolean).join("·");
    }
    const movingDetails = (result.lines || []).filter(function(line) {
      return line && line.moving;
    }).map(function(line) {
      return "第" + line.position + "爻";
    }).join("、");
    const primaryTexts = Array.isArray(readingBasis.primaryTexts) ? readingBasis.primaryTexts : [];
    const secondaryTexts = Array.isArray(readingBasis.secondaryTexts) ? readingBasis.secondaryTexts : [];
    const primaryNames = primaryTexts.map(getSelectedTextName).join("、") || "主辞";
    const secondaryNames = secondaryTexts.map(getSelectedTextName).join("、");
    const selectedRelation = secondaryNames
      ? "主辞：" + primaryNames + "；辅辞：" + secondaryNames + "。"
      : "主辞：" + primaryNames + "；无辅辞。";
    divinationResultBasis.textContent = "本卦：" + result.primaryHexagram.name + "；变卦：" + result.changedHexagram.name +
      "；动爻位置：" + (movingDetails || "无") + "。" + selectedRelation + "取辞原因：" + readingBasis.summary;
  }
  if (divinationResultJudgments) {
    const selectedTexts = result.readingBasis
      ? (result.readingBasis.primaryTexts || []).concat(result.readingBasis.secondaryTexts || [])
      : [];
    divinationResultJudgments.textContent = selectedTexts.map(function(item) {
      const role = item.role === "primary" ? "主辞" : "辅辞";
      const source = String(item.source || "所取辞文").replace(/·(?:主|辅)$/, "");
      const name = [source, item.label].filter(Boolean).join("·");
      return role + "（" + name + "）：「" + item.text + "」";
    }).join("；");
  }
}

function renderDivinationResult(result, fromSaved) {
  if (!result || !divinationResult) {
    return;
  }

  const methodDefinition = getDivinationMethodDefinition(result.method);

  const isModernIChingResult = result.method === "turtle" && result.primaryHexagram && result.changedHexagram && result.readingBasis;

  if (divinationIntro) {
    divinationIntro.textContent = result.method === "turtle"
      ? fromSaved ? "今日卦签已定。" : "六爻已成，卦签落定。"
      : fromSaved ? "今日牌面已定。" : "牌面已翻开，今日倾向已经落定。";
  }
  if (divinationQuestionList) {
    divinationQuestionList.classList.remove("hidden");
  }
  if (divinationMethodList) {
    divinationMethodList.classList.remove("hidden");
  }
  if (divinationStage) {
    divinationStage.classList.add("hidden");
  }
  if (divinationActionButton) {
    divinationActionButton.classList.add("hidden");
  }

  renderDivinationQuestions();
  renderDivinationMethods();
  divinationResult.classList.remove("hidden");
  divinationResult.classList.toggle("iching-result-active", isModernIChingResult);
  if (divinationResultQuestion) {
    divinationResultQuestion.textContent = (result.questionLabel || "") + " · " + (methodDefinition ? methodDefinition.label : result.method);
  }
  if (divinationResultTop) {
    divinationResultTop.classList.toggle("hidden", isModernIChingResult);
  }
  if (divinationTarotResultBody) {
    divinationTarotResultBody.classList.toggle("hidden", isModernIChingResult);
  }
  if (divinationTurtleResultBody) {
    divinationTurtleResultBody.classList.toggle("hidden", !isModernIChingResult);
  }

  if (isModernIChingResult) {
    renderModernIChingResult(result);
    return;
  }

  if (divinationResultTitle) {
    divinationResultTitle.textContent = result.title || "";
  }
  if (divinationResultSubtitle) {
    divinationResultSubtitle.textContent = result.subtitle || "";
  }
  if (divinationResultImage) {
    if (result.method === "tarot" && result.image) {
      setVersionedImageSource(divinationResultImage, result.image);
      divinationResultImage.classList.remove("hidden");
    } else {
      divinationResultImage.classList.add("hidden");
    }
  }
  if (divinationResultKeywords) {
    divinationResultKeywords.textContent = Array.isArray(result.keywords) ? result.keywords.join(" / ") : "";
  }
  if (divinationResultReality) {
    divinationResultReality.textContent = result.reality || "";
  }
  if (divinationResultAdvice) {
    divinationResultAdvice.textContent = result.advice || "";
  }
  if (divinationResultCamp) {
    divinationResultCamp.textContent = result.campImpact || "";
  }
}

function completeDivination(method, lines, options) {
  const manager = getDivinationManager();

  if (!manager || !manager.createResult) {
    setStatus("占营数据还没准备好。");
    return null;
  }

  const dateKey = getDivinationDateKey();
  const resultSalt = getTodayDivinationSalt(method, selectedDivinationQuestionId);
  const result = manager.createResult({
    method: method,
    questionId: selectedDivinationQuestionId,
    dateKey: dateKey,
    userSeed: getDivinationUserSeed(),
    lines: lines,
    salt: resultSalt
  });

  const record = {
    date: dateKey,
    method: method,
    question: selectedDivinationQuestionId,
    result: result,
    effects: result.effects || {}
  };
  const dailyDivinations = ensureTodayDivinationsForToday();
  dailyDivinations.records[method][selectedDivinationQuestionId] = record;
  dailyDivinations.active = {
    method: method,
    question: selectedDivinationQuestionId
  };
  turtleCastLines = [];
  resetTurtleCastAnimationState();
  camperThoughtAction = "";
  if (!options || !options.deferResult) {
    renderDivinationResult(result, false);
  }
  updateDailyCampCard();
  syncDivinationEntryState();
  if (result.effects && Array.isArray(result.effects.thoughtLines) && result.effects.thoughtLines.length > 0) {
    showCamperThought(result.effects.thoughtLines[0], 3600);
  }
  saveGame();
  return result;
}

function createFallbackTurtleLine(index) {
  const coins = [0, 1, 2].map(function(coinIndex) {
    const yang = Math.random() >= 0.5;
    return {
      index: coinIndex,
      side: yang ? "yang" : "yin",
      value: yang ? 3 : 2
    };
  });
  const total = coins.reduce(function(sum, coin) { return sum + coin.value; }, 0);
  const typeByTotal = { 6: "oldYin", 7: "youngYang", 8: "youngYin", 9: "oldYang" };
  const yinYang = total === 7 || total === 9 ? "yang" : "yin";
  const moving = total === 6 || total === 9;
  return {
    index: index,
    position: index + 1,
    coins: coins,
    total: total,
    type: typeByTotal[total],
    yinYang: yinYang,
    moving: moving,
    changedYinYang: moving ? yinYang === "yang" ? "yin" : "yang" : yinYang
  };
}

function castTurtleCoinsOnce() {
  if (turtleCastPending || turtleCastLines.length >= 6) {
    return;
  }

  const manager = getDivinationManager();
  const resultSalt = getTodayDivinationSalt("turtle", selectedDivinationQuestionId);
  const lineIndex = turtleCastLines.length;
  const line = manager && manager.createTurtleLine ? manager.createTurtleLine({
    questionId: selectedDivinationQuestionId,
    dateKey: getDivinationDateKey(),
    userSeed: getDivinationUserSeed(),
    salt: resultSalt
  }, lineIndex) : createFallbackTurtleLine(lineIndex);

  turtlePendingLine = line;
  turtleCastPending = true;
  turtleCastPhase = "shaking";
  renderDivinationSetup();
  playTurtleShellShake(lineIndex + 1);

  window.setTimeout(function() {
    if (!turtlePendingLine) {
      return;
    }

    turtleCastLines.push(turtlePendingLine);
    turtlePendingLine = null;
    turtleCastPhase = "revealing";
    if (turtleCastLines.length >= 6 && turtleHoldTimer) {
      clearInterval(turtleHoldTimer);
      turtleHoldTimer = null;
    }
    renderDivinationSetup();
    playTurtleCoinReveal();

    window.setTimeout(function() {
      turtleCastPending = false;
      turtleCastPhase = "idle";
      if (turtleCoinVisual) {
        turtleCoinVisual.classList.remove("is-revealing");
      }
      if (turtleCastLines.length >= 6) {
        completeDivination("turtle", turtleCastLines.slice());
      } else {
        renderDivinationSetup();
      }
    }, 520);
  }, 430);
}

function handleDivinationAction() {
  const savedRecord = getTodayDivinationRecord(selectedDivinationMethod, selectedDivinationQuestionId);

  if (savedRecord) {
    renderDivinationResult(savedRecord.result, true);
    return;
  }

  if (!selectedDivinationMethod || !hasDivinationMethodUnlocked(selectedDivinationMethod)) {
    setStatus("这个占营方式还没解锁。");
    return;
  }

  if (selectedDivinationMethod === "turtle") {
    castTurtleCoinsOnce();
    return;
  }

  if (divinationActionButton) {
    divinationActionButton.disabled = true;
    divinationActionButton.textContent = "洗牌中...";
  }
  if (divinationCardVisual) {
    divinationCardVisual.classList.add("shuffling");
  }

  window.setTimeout(function() {
    const result = completeDivination("tarot", null, { deferResult: true });
    if (divinationCardVisual && result && result.image) {
      divinationCardVisual.classList.remove("shuffling");
      divinationCardVisual.classList.add("revealed", "revealing");
      divinationCardVisual.style.backgroundImage = "url('" + withVersion(result.image) + "')";
    }
    if (divinationActionButton) {
      divinationActionButton.textContent = "翻牌中...";
    }
    window.setTimeout(function() {
      if (divinationCardVisual) {
        divinationCardVisual.classList.remove("revealing");
      }
      renderDivinationResult(result, false);
    }, 620);
  }, 520);
}

function startTurtleHold() {
  if (selectedDivinationMethod !== "turtle" || !hasDivinationMethodUnlocked("turtle") ||
      hasTodayDivinationResult("turtle", selectedDivinationQuestionId)) {
    return;
  }

  turtleHoldTriggered = false;
  if (turtleHoldTimer) {
    clearInterval(turtleHoldTimer);
  }
  turtleHoldTimer = window.setInterval(function() {
    turtleHoldTriggered = true;
    castTurtleCoinsOnce();
    if (turtleCastLines.length >= 6 && turtleHoldTimer) {
      clearInterval(turtleHoldTimer);
      turtleHoldTimer = null;
    }
  }, 1100);
}

function stopTurtleHold() {
  if (turtleHoldTimer) {
    clearInterval(turtleHoldTimer);
    turtleHoldTimer = null;
  }
}

function openDivinationPanel() {
  if (!divinationLayer) {
    return;
  }

  closeShop();
  closeInventoryPanel();
  closeSoundJournal();
  closeSettingsMenu();
  resetDivinationDraft();
  divinationLayer.classList.remove("hidden");
  divinationLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("divination-open");

  renderDivinationSetup();
}

function closeDivinationPanel() {
  if (!divinationLayer) {
    return;
  }

  stopTurtleHold();
  divinationLayer.classList.add("hidden");
  divinationLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("divination-open");
}

function setTestDivination(method) {
  const manager = getDivinationManager();

  if (!manager || !manager.createResult || !isDivinationMethod(method)) {
    if (typeof console !== "undefined") {
      console.warn("setTestDivination only accepts: tarot, turtle");
    }
    return false;
  }

  const dateKey = getDivinationDateKey();
  const result = manager.createResult({
    method: method,
    questionId: selectedDivinationQuestionId || "overall",
    dateKey: dateKey,
    userSeed: getDivinationUserSeed() + ":test:" + Date.now(),
    salt: "test"
  });

  testDivinationOverride = {
    result: result,
    effects: result.effects || {}
  };
  camperThoughtAction = "";
  updateDailyCampCard();
  if (result.effects && Array.isArray(result.effects.thoughtLines) && result.effects.thoughtLines.length > 0) {
    showCamperThought(result.effects.thoughtLines[0], 3200);
  }
  setStatus("Divination test: " + (result.title || method));
  return result;
}

function clearTestDivination() {
  testDivinationOverride = null;
  camperThoughtAction = "";
  updateDailyCampCard();
  setStatus("Divination test cleared.");
  return true;
}

function normalizeTestDivinationMethod(method) {
  if (method === undefined || method === null || method === "") {
    return selectedDivinationMethod || "";
  }

  const value = String(method).trim().toLowerCase();

  if (value === "tarot" || value === "card" || value === "cards" || value === "塔罗") {
    return "tarot";
  }
  if (value === "turtle" || value === "shell" || value === "turtleShell" || value === "turtleshell" || value === "龟壳") {
    return "turtle";
  }

  return "";
}

function normalizeTestDivinationQuestion(question) {
  if (question === undefined || question === null || question === "") {
    return selectedDivinationQuestionId || "overall";
  }

  const raw = String(question).trim();
  const value = raw.toLowerCase();
  const aliases = {
    overall: "overall",
    today: "overall",
    fortune: "overall",
    "今日整体": "overall",
    "今日运势": "overall",
    "今日運勢": "overall",
    "运势": "overall",
    "運勢": "overall",
    relationship: "relationship",
    love: "relationship",
    emotion: "relationship",
    "情感": "relationship",
    bodymind: "bodyMind",
    body: "bodyMind",
    mind: "bodyMind",
    health: "bodyMind",
    "身心": "bodyMind",
    money: "money",
    wealth: "money",
    finance: "money",
    "钱财": "money",
    "錢財": "money",
    "财运": "money",
    "財運": "money"
  };
  const questionId = aliases[value] || aliases[raw] || raw;

  return getDivinationQuestion(questionId) ? questionId : "";
}

function refreshAfterDivinationTestReset() {
  testDivinationOverride = null;
  camperThoughtAction = "";
  updateDailyCampCard();
  syncDivinationEntryState();

  if (isDivinationPanelOpen()) {
    renderDivinationSetup();
  }

  saveGame();
}

function repairActiveTodayDivination(dailyDivinations) {
  if (!dailyDivinations || !dailyDivinations.records) {
    return;
  }

  if (getTodayDivinationRecord(dailyDivinations.active && dailyDivinations.active.method, dailyDivinations.active && dailyDivinations.active.question)) {
    return;
  }

  dailyDivinations.active = { method: "", question: "" };
  ["tarot", "turtle"].some(function(method) {
    return getDivinationQuestionIds().some(function(questionId) {
      if (dailyDivinations.records[method] && dailyDivinations.records[method][questionId]) {
        dailyDivinations.active = { method: method, question: questionId };
        return true;
      }

      return false;
    });
  });
}

function getDivinationResultSignature(result) {
  if (!result || typeof result !== "object") {
    return "";
  }

  if (result.method === "turtle" || result.type === "turtle") {
    const lines = Array.isArray(result.lines) ? result.lines.map(function(line) {
      const coins = line && Array.isArray(line.coins) ? line.coins.map(function(coin) {
        return coin && coin.side === "yang" ? "Y" : "N";
      }).join("") : "";
      return String(line && line.total || "") + coins;
    }).join("") : "";
    return "turtle:" + (result.turtleResultId || result.title || "") + ":" + lines;
  }

  return "tarot:" + (result.cardId || result.title || "") + ":" + (result.orientation || "");
}

function findNextDivinationRerollSalt(method, questionId, currentSalt, previousResult) {
  const firstSalt = Math.max(0, Math.floor(Number(currentSalt) || 0)) + 1;
  const previousSignature = getDivinationResultSignature(previousResult);
  const manager = getDivinationManager();

  if (!previousSignature || !manager || !manager.createResult) {
    return firstSalt;
  }

  for (let rerollSalt = firstSalt; rerollSalt < firstSalt + 256; rerollSalt += 1) {
    const candidate = manager.createResult({
      method: method,
      questionId: questionId,
      dateKey: getDivinationDateKey(),
      userSeed: getDivinationUserSeed(),
      salt: "daily:" + rerollSalt
    });
    if (getDivinationResultSignature(candidate) !== previousSignature) {
      return rerollSalt;
    }
  }

  return firstSalt;
}

function resetTodayDivination(method, question) {
  const normalizedMethod = normalizeTestDivinationMethod(method);
  const normalizedQuestion = normalizeTestDivinationQuestion(question);

  if (!isDivinationMethod(normalizedMethod) || !normalizedQuestion) {
    if (typeof console !== "undefined") {
      console.warn('resetTodayDivination usage: resetTodayDivination("tarot", "money") or resetTodayDivination("turtle", "情感")');
    }
    return false;
  }

  const dailyDivinations = ensureTodayDivinationsForToday();
  if (!dailyDivinations.records[normalizedMethod]) {
    dailyDivinations.records[normalizedMethod] = {};
  }
  if (!dailyDivinations.rerollSalt) {
    dailyDivinations.rerollSalt = { tarot: {}, turtle: {} };
  }
  if (!dailyDivinations.rerollSalt[normalizedMethod]) {
    dailyDivinations.rerollSalt[normalizedMethod] = {};
  }

  const previousRecord = dailyDivinations.records[normalizedMethod][normalizedQuestion];
  delete dailyDivinations.records[normalizedMethod][normalizedQuestion];
  dailyDivinations.rerollSalt[normalizedMethod][normalizedQuestion] =
    findNextDivinationRerollSalt(
      normalizedMethod,
      normalizedQuestion,
      dailyDivinations.rerollSalt[normalizedMethod][normalizedQuestion],
      previousRecord && previousRecord.result
    );
  repairActiveTodayDivination(dailyDivinations);
  turtleCastLines = [];
  resetTurtleCastAnimationState();
  refreshAfterDivinationTestReset();
  setStatus("Divination reset: " + normalizedMethod + " / " + normalizedQuestion);
  return true;
}

function resetAllTodayDivinations() {
  const previous = ensureTodayDivinationsForToday();
  const reset = createEmptyTodayDivinations(getDivinationDateKey());
  ["tarot", "turtle"].forEach(function(method) {
    getDivinationQuestionIds().forEach(function(questionId) {
      const previousMethodSalt = previous.rerollSalt && previous.rerollSalt[method];
      const previousRecord = previous.records && previous.records[method] && previous.records[method][questionId];
      reset.rerollSalt[method][questionId] =
        findNextDivinationRerollSalt(
          method,
          questionId,
          previousMethodSalt && previousMethodSalt[questionId],
          previousRecord && previousRecord.result
        );
    });
  });
  gameState.todayDivinations = reset;
  turtleCastLines = [];
  resetTurtleCastAnimationState();
  refreshAfterDivinationTestReset();
  setStatus("All today divinations reset.");
  return true;
}
