// Daily weather, camp summary, deterministic daily selection, and test hooks.

function getWeatherCatalog() {
  const catalog = typeof window !== "undefined" ? window.WEATHER_CATALOG : null;

  if (catalog && catalog.weathers && Array.isArray(catalog.weatherIds)) {
    return catalog;
  }

  return {
    defaultWeatherId: "sunny",
    weatherIds: ["sunny", "cloudy", "breezy", "lightRain", "foggy"],
    weathers: {
      sunny: {
        id: "sunny",
        label: "晴天",
        shortLabel: "晴",
        weight: 1,
        moodLines: ["今天湖边很安静，适合慢慢来。"],
        activityLabels: ["看湖水"],
        activityWeights: { lookingAtLake: 0.3 },
        soundRecommendations: [{ id: "lake_water_loop", label: "湖水" }]
      }
    },
    night: { activityWeights: {}, soundRecommendations: [] }
  };
}

function getWeatherIds() {
  return getWeatherCatalog().weatherIds.slice();
}

function getWeatherDefinition(weatherId) {
  const catalog = getWeatherCatalog();
  return weatherId && catalog.weathers[weatherId] ? catalog.weathers[weatherId] : null;
}

function getDefaultWeatherId() {
  const catalog = getWeatherCatalog();
  return getWeatherDefinition(catalog.defaultWeatherId) ? catalog.defaultWeatherId : "sunny";
}

function isWeatherId(weatherId) {
  return Boolean(getWeatherDefinition(weatherId));
}

function createWeatherUserSeed() {
  return "camp-weather-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1000000000).toString(36);
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

function getWeatherMoodLineCount(weatherId) {
  const weather = getWeatherDefinition(weatherId);
  return weather && Array.isArray(weather.moodLines) && weather.moodLines.length > 0 ? weather.moodLines.length : 1;
}

function getMoodIndexForWeather(weatherId, dateKey, userSeed, salt) {
  const lineCount = getWeatherMoodLineCount(weatherId);
  return Math.floor(seededUnit(userSeed + ":" + dateKey + ":" + weatherId + ":" + (salt || "mood")) * lineCount) % lineCount;
}

function chooseDailyWeatherId(userSeed, dateKey) {
  const entries = getWeatherIds().map(function(weatherId) {
    const weather = getWeatherDefinition(weatherId);
    return {
      id: weatherId,
      weight: Math.max(0, Number(weather && weather.weight) || 0)
    };
  }).filter(function(entry) {
    return entry.weight > 0;
  });

  if (entries.length === 0) {
    return getDefaultWeatherId();
  }

  const totalWeight = entries.reduce(function(total, entry) {
    return total + entry.weight;
  }, 0);
  let roll = seededUnit(userSeed + ":" + dateKey + ":weather") * Math.max(totalWeight, 1);

  for (let index = 0; index < entries.length; index += 1) {
    roll -= entries[index].weight;

    if (roll <= 0) {
      return entries[index].id;
    }
  }

  return entries[entries.length - 1].id;
}

function sanitizeDailyWeather(dailyWeather) {
  const source = dailyWeather && typeof dailyWeather === "object" && !Array.isArray(dailyWeather) ? dailyWeather : {};
  const userSeed = typeof source.userSeed === "string" && source.userSeed ? source.userSeed : createWeatherUserSeed();
  const id = isWeatherId(source.id) ? source.id : "";
  const moodIndex = Math.max(0, Math.floor(Number(source.moodIndex) || 0));

  return {
    userSeed: userSeed,
    dateKey: typeof source.dateKey === "string" ? source.dateKey : "",
    id: id,
    moodIndex: moodIndex
  };
}

function buildDailyWeatherForDate(dateKey, userSeed) {
  const weatherId = chooseDailyWeatherId(userSeed, dateKey);

  return {
    userSeed: userSeed,
    dateKey: dateKey,
    id: weatherId,
    moodIndex: getMoodIndexForWeather(weatherId, dateKey, userSeed)
  };
}

function ensureDailyWeatherForToday(date, state) {
  const campState = state || gameState;
  const dateKey = getLocalDateKey(date);
  const current = sanitizeDailyWeather(campState.dailyWeather);

  if (current.dateKey !== dateKey || !isWeatherId(current.id)) {
    campState.dailyWeather = buildDailyWeatherForDate(dateKey, current.userSeed);
  } else {
    current.moodIndex = current.moodIndex % getWeatherMoodLineCount(current.id);
    campState.dailyWeather = current;
  }

  return campState.dailyWeather;
}

function getCurrentDailyWeatherState() {
  const dailyWeather = ensureDailyWeatherForToday();

  if (isWeatherId(testWeatherOverride)) {
    return {
      userSeed: dailyWeather.userSeed,
      dateKey: dailyWeather.dateKey,
      id: testWeatherOverride,
      moodIndex: getMoodIndexForWeather(testWeatherOverride, dailyWeather.dateKey, dailyWeather.userSeed, "test")
    };
  }

  return dailyWeather;
}

function getCurrentWeatherDefinition() {
  return getWeatherDefinition(getCurrentDailyWeatherState().id) || getWeatherDefinition(getDefaultWeatherId());
}

function getCurrentWeatherMoodLine() {
  const state = getCurrentDailyWeatherState();
  const weather = getWeatherDefinition(state.id);
  const lines = weather && Array.isArray(weather.moodLines) ? weather.moodLines : [];

  if (lines.length === 0) {
    return "";
  }

  return lines[state.moodIndex % lines.length];
}

function getCurrentWeatherActivityWeights() {
  const weather = getCurrentWeatherDefinition();
  return weather && weather.activityWeights ? weather.activityWeights : {};
}

function getCurrentTimeActivityWeights() {
  const catalog = getWeatherCatalog();
  return gameState.isNight && catalog.night && catalog.night.activityWeights ? catalog.night.activityWeights : {};
}

function getCurrentWeatherActivityLabels() {
  const weather = getCurrentWeatherDefinition();
  return weather && Array.isArray(weather.activityLabels) ? weather.activityLabels : [];
}

function getCurrentWeatherSoundRecommendations() {
  const weather = getCurrentWeatherDefinition();
  const catalog = getWeatherCatalog();
  const recommendations = weather && Array.isArray(weather.soundRecommendations) ? weather.soundRecommendations.slice() : [];

  if (gameState.isNight && catalog.night && Array.isArray(catalog.night.soundRecommendations)) {
    catalog.night.soundRecommendations.forEach(function(recommendation) {
      recommendations.push(recommendation);
    });
  }

  return recommendations;
}

function getSoundRecommendationState(recommendation) {
  const entry = recommendation && recommendation.id ? getSoundCatalogEntry(recommendation.id) : null;
  const isKnownLoop = Boolean(entry && entry.type === "loop");
  const discovered = Boolean(isKnownLoop && isSoundDiscovered(recommendation.id));

  if (discovered) {
    return "已解锁";
  }

  if (recommendation && recommendation.future || !entry) {
    return "后续";
  }

  return "线索";
}

function formatWeatherSoundRecommendations() {
  const recommendations = getCurrentCampSoundRecommendations();

  if (recommendations.length === 0) {
    return "";
  }

  const unlocked = [];
  const clues = [];

  recommendations.forEach(function(recommendation) {
    const label = recommendation.label || recommendation.id || "";
    const state = getSoundRecommendationState(recommendation);

    if (!label) {
      return;
    }

    if (state === "已解锁") {
      unlocked.push(label);
    } else {
      clues.push(label + "（" + state + "）");
    }
  });

  if (unlocked.length > 0) {
    return "推荐声音：" + unlocked.join(" + ") + (clues.length > 0 ? " · 线索：" + clues.join(" / ") : "");
  }

  return "声音线索：" + clues.join(" / ");
}

function updateWeatherLayer() {
  if (!weatherLayer) {
    return;
  }

  const weather = getCurrentWeatherDefinition();
  const asset = weather && weather.asset;

  if (!weather || !asset) {
    weatherLayer.className = "weather-layer hidden";
    weatherLayer.textContent = "";
    return;
  }

  const layerClass = weather.layerClass || "weather-layer-" + weather.id;
  weatherLayer.className = "weather-layer " + layerClass;
  weatherLayer.classList.remove("hidden");

  if (weatherLayer.dataset.weatherId !== weather.id || weatherLayer.dataset.assetPath !== asset) {
    weatherLayer.textContent = "";
    const image = document.createElement("img");
    image.className = "weather-layer-image";
    image.alt = "";
    weatherLayer.appendChild(image);
    weatherLayer.dataset.weatherId = weather.id;
    weatherLayer.dataset.assetPath = asset;
    setVersionedLayerSource(image, asset);
  }
}

function syncDailyCampDrawerState() {
  if (!dailyCampCard) {
    return;
  }

  dailyCampCard.classList.toggle("open", dailyCampDrawerExpanded);
  dailyCampCard.classList.toggle("collapsed", !dailyCampDrawerExpanded);

  if (dailyCampDrawerToggle) {
    const expanded = dailyCampDrawerExpanded ? "true" : "false";
    const label = dailyCampDrawerExpanded ? "收起今日营地卡" : "展开今日营地卡";
    dailyCampDrawerToggle.setAttribute("aria-expanded", expanded);
    dailyCampDrawerToggle.setAttribute("aria-label", label);
    dailyCampDrawerToggle.setAttribute("title", label);
  }

  if (dailyCampDrawerPanel) {
    dailyCampDrawerPanel.setAttribute("aria-hidden", dailyCampDrawerExpanded ? "false" : "true");
  }

  if (dailyCampDrawerChevron) {
    dailyCampDrawerChevron.textContent = dailyCampDrawerExpanded ? "›" : "‹";
  }
}

function setDailyCampDrawerExpanded(expanded) {
  dailyCampDrawerExpanded = Boolean(expanded);

  if (dailyCampBackdrop) {
    dailyCampBackdrop.classList.toggle("hidden", !dailyCampDrawerExpanded);
  }

  syncDailyCampDrawerState();
}

function toggleDailyCampDrawer() {
  setDailyCampDrawerExpanded(!dailyCampDrawerExpanded);
}

function updateDailyCampCard() {
  if (!dailyCampCard) {
    return;
  }

  const weather = getCurrentWeatherDefinition();

  if (!weather) {
    dailyCampCard.classList.add("hidden");
    return;
  }

  dailyCampCard.classList.remove("hidden");
  dailyCampCard.dataset.weatherId = weather.id;

  if (dailyWeatherTabIcon) {
    dailyWeatherTabIcon.textContent = weather.shortLabel || weather.label || "?";
  }
  if (dailyWeatherIcon) {
    dailyWeatherIcon.textContent = weather.shortLabel || weather.label || "?";
  }
  if (dailyWeatherLabel) {
    dailyWeatherLabel.textContent = weather.label || weather.id;
  }
  if (dailyCampMood) {
    const nightMood = gameState.isNight && getWeatherCatalog().night ? getWeatherCatalog().night.moodLine : "";
    const divinationMood = getCurrentDivinationMoodLine();
    dailyCampMood.textContent = [getCurrentWeatherMoodLine(), nightMood, divinationMood].filter(Boolean).join(" ");
  }
  if (dailyCampActivities) {
    const activities = getCurrentCampActivityLabels();
    dailyCampActivities.textContent = activities.length > 0 ? "适合：" + activities.join(" / ") : "";
  }
  if (dailySoundRecommendation) {
    dailySoundRecommendation.textContent = formatWeatherSoundRecommendations();
  }

  syncDailyCampDrawerState();
}

function refreshWeatherPresentation() {
  updateWeatherLayer();
  updateDailyCampCard();
  syncWeatherAmbient();
}

function setTestWeather(weatherId) {
  if (!isWeatherId(weatherId)) {
    if (typeof console !== "undefined") {
      console.warn("setTestWeather only accepts: " + getWeatherIds().join(", "));
    }
    return false;
  }

  testWeatherOverride = weatherId;
  refreshWeatherPresentation();
  setStatus("Weather test: " + getWeatherDefinition(weatherId).label);
  return true;
}

function clearTestWeather() {
  testWeatherOverride = "";
  ensureDailyWeatherForToday();
  refreshWeatherPresentation();
  setStatus("Weather test cleared.");
  return true;
}
