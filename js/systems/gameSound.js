// Sound journal persistence, playback coordination, ambience, and sound UI.

function getSoundCatalogIdSet() {
  const idSet = {};
  const catalog = typeof window !== "undefined" ? window.SOUND_JOURNAL_CATALOG : null;

  if (catalog && Array.isArray(catalog.sounds)) {
    catalog.sounds.forEach(function(entry) {
      if (entry && entry.id) {
        idSet[entry.id] = entry;
      }
    });
  }

  return idSet;
}

function getSoundCatalogEntry(id) {
  return getSoundCatalogIdSet()[id] || null;
}

function isLoopSoundId(id) {
  const entry = getSoundCatalogEntry(id);
  return Boolean(entry && entry.type === "loop");
}

function cloneSoundJournal(journal) {
  const source = journal && typeof journal === "object" && !Array.isArray(journal) ? journal : {};

  return {
    discovered: Array.isArray(source.discovered) ? source.discovered.slice() : [],
    enabledAmbient: Array.isArray(source.enabledAmbient) ? source.enabledAmbient.slice() : [],
    masterVolume: typeof source.masterVolume === "number" ? source.masterVolume : 0.7,
    muted: Boolean(source.muted)
  };
}

function sanitizeSoundJournal(journal) {
  // Old saves have no soundJournal at all: default to empty arrays / defaults.
  const source = journal && typeof journal === "object" && !Array.isArray(journal) ? journal : {};
  const knownIds = getSoundCatalogIdSet();
  const hasCatalog = Object.keys(knownIds).length > 0;

  function keepKnown(list, requireLoop) {
    if (!Array.isArray(list)) {
      return [];
    }
    const seen = {};
    return list.filter(function(id) {
      if (typeof id !== "string" || seen[id]) {
        return false;
      }
      seen[id] = true;
      // If the catalog failed to load, keep ids untouched rather than wiping the save.
      if (!hasCatalog) {
        return true;
      }
      if (!knownIds[id]) {
        return false;
      }
      return requireLoop ? knownIds[id].type === "loop" : true;
    });
  }

  const discovered = keepKnown(source.discovered, false);
  const enabledAmbient = keepKnown(source.enabledAmbient, true).filter(function(id) {
    // Only keep an ambient toggle if that sound has actually been discovered.
    return discovered.indexOf(id) !== -1;
  });

  const volume = Number(source.masterVolume);

  return {
    discovered: discovered,
    enabledAmbient: enabledAmbient,
    masterVolume: Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.7,
    muted: Boolean(source.muted)
  };
}

// ---------------------------------------------------------------------------
// Sound Journal + ambient white-noise system.
//
// Discovery happens when an interaction STARTS (see startActing / cooler open),
// so the player hears the sound during the activity rather than after it.
// soundManager.js owns the actual Web Audio playback; this layer owns the
// journal state, discovery notifications, temporary activity ambience and UI.
// ---------------------------------------------------------------------------

// Loops started for the duration of an activity that the player has NOT pinned
// as a persistent ambient track. They are stopped when the activity ends.
const temporaryAmbientLoops = new Set();
let soundSystemStarted = false;

// The campfire loop is "fire-linked": once discovered it defaults to on and
// plays continuously WHILE THE FIRE IS BURNING, unless the player turns it off
// in the Sound Journal. It is not a temporary activity loop.
const FIRE_LINKED_LOOP = "campfire_crackle_loop";
const RAIN_LINKED_LOOP = "rain_soft_loop";
const RAIN_TENT_LOOP = "tent_rain_loop";
const RAIN_WEATHER_LOOPS = [RAIN_LINKED_LOOP, RAIN_TENT_LOOP];
const RAIN_CROSSFADE_SECONDS = 0.55;
let rainAmbientTargetLoopId = "";
let rainAmbientStartingLoopId = "";
let rainAmbientTransitionToken = 0;
let rainAmbientPreloadRequested = false;

function isCampfireBurning() {
  return gameState.warmthSeconds > 0;
}

// Keep the campfire loop in sync with the fire: play while lit + discovered +
// not manually turned off; stop otherwise (e.g. the fire went out).
function syncCampfireAmbient() {
  const manager = getSoundManager();

  if (!manager) {
    return;
  }

  const shouldPlay = isSoundDiscovered(FIRE_LINKED_LOOP) &&
    isAmbientEnabled(FIRE_LINKED_LOOP) &&
    isCampfireBurning();

  if (shouldPlay) {
    manager.startLoop(FIRE_LINKED_LOOP);
  } else {
    manager.stopLoop(FIRE_LINKED_LOOP);
  }
}

function isRainWeatherActive() {
  const weather = typeof getCurrentWeatherDefinition === "function" ? getCurrentWeatherDefinition() : null;
  return Boolean(weather && weather.id === "lightRain");
}

function isCamperInsideTentForSound() {
  return typeof camper !== "undefined" && camper && camper.pose === "tentRest";
}

function getDesiredRainAmbientLoopId() {
  if (!soundSystemStarted || !isRainWeatherActive() || !isAmbientEnabled(RAIN_LINKED_LOOP)) {
    return "";
  }

  return isCamperInsideTentForSound() ? RAIN_TENT_LOOP : RAIN_LINKED_LOOP;
}

function stopRainWeatherLoops(manager, fadeSeconds) {
  RAIN_WEATHER_LOOPS.forEach(function(id) {
    manager.stopLoop(id, { fadeSeconds: fadeSeconds });
  });
}

// Rain is one weather-linked ambience with two acoustic variants. Start the
// new space first, then fade the old one out only after the new buffer is ready.
function syncWeatherAmbient() {
  const manager = getSoundManager();

  if (!manager) {
    return;
  }

  if (!soundSystemStarted) {
    if (!isRainWeatherActive()) {
      stopRainWeatherLoops(manager, 0.25);
    }
    return;
  }

  if (isRainWeatherActive() && !isSoundDiscovered(RAIN_LINKED_LOOP)) {
    discoverSound(RAIN_LINKED_LOOP);
  }

  if (isRainWeatherActive() && !rainAmbientPreloadRequested) {
    rainAmbientPreloadRequested = true;
    RAIN_WEATHER_LOOPS.forEach(function(id) {
      manager.preload(id);
    });
  }

  const desiredLoopId = getDesiredRainAmbientLoopId();
  const desiredIsReady = desiredLoopId && (
    rainAmbientStartingLoopId === desiredLoopId || manager.isLoopPlaying(desiredLoopId)
  );
  const hasRainLoop = RAIN_WEATHER_LOOPS.some(function(id) {
    return manager.isLoopPlaying(id);
  });

  if (desiredLoopId === rainAmbientTargetLoopId && (desiredIsReady || (!desiredLoopId && !hasRainLoop))) {
    return;
  }

  rainAmbientTargetLoopId = desiredLoopId;
  rainAmbientTransitionToken += 1;
  const transitionToken = rainAmbientTransitionToken;

  if (!desiredLoopId) {
    rainAmbientStartingLoopId = "";
    stopRainWeatherLoops(manager, RAIN_CROSSFADE_SECONDS);
    return;
  }

  rainAmbientStartingLoopId = desiredLoopId;
  manager.startLoop(desiredLoopId, { fadeSeconds: RAIN_CROSSFADE_SECONDS }).then(function(started) {
    if (transitionToken !== rainAmbientTransitionToken || desiredLoopId !== rainAmbientTargetLoopId) {
      if (desiredLoopId !== rainAmbientTargetLoopId) {
        manager.stopLoop(desiredLoopId, { fadeSeconds: 0.2 });
      }
      return;
    }

    rainAmbientStartingLoopId = "";

    if (!started) {
      return;
    }

    RAIN_WEATHER_LOOPS.forEach(function(id) {
      if (id !== desiredLoopId) {
        manager.stopLoop(id, { fadeSeconds: RAIN_CROSSFADE_SECONDS });
      }
    });
  });
}

function getSoundManager() {
  return typeof window !== "undefined" ? window.soundManager : null;
}

function getSoundTriggers() {
  return typeof window !== "undefined" && window.SOUND_JOURNAL_TRIGGERS ?
    window.SOUND_JOURNAL_TRIGGERS : {};
}

function getSoundCatalogSounds() {
  const catalog = typeof window !== "undefined" ? window.SOUND_JOURNAL_CATALOG : null;
  return catalog && Array.isArray(catalog.sounds) ? catalog.sounds.filter(function(entry) {
    return entry && !entry.journalHidden;
  }) : [];
}

function getSoundJournalState() {
  if (!gameState.soundJournal || typeof gameState.soundJournal !== "object" || Array.isArray(gameState.soundJournal)) {
    gameState.soundJournal = cloneSoundJournal(defaultGameState.soundJournal);
  }

  const journal = gameState.soundJournal;

  if (!Array.isArray(journal.discovered)) {
    journal.discovered = [];
  }
  if (!Array.isArray(journal.enabledAmbient)) {
    journal.enabledAmbient = [];
  }
  if (typeof journal.masterVolume !== "number") {
    journal.masterVolume = 0.7;
  }
  journal.muted = Boolean(journal.muted);

  return journal;
}

function isSoundDiscovered(id) {
  return getSoundJournalState().discovered.indexOf(id) !== -1;
}

function isAmbientEnabled(id) {
  return getSoundJournalState().enabledAmbient.indexOf(id) !== -1;
}

function initSoundSystem() {
  const manager = getSoundManager();

  if (!manager) {
    return;
  }

  const journal = getSoundJournalState();

  manager.configure({
    catalog: typeof window !== "undefined" ? window.SOUND_JOURNAL_CATALOG : null,
    version: APP_VERSION,
    masterVolume: journal.masterVolume,
    muted: journal.muted
  });

  // Resume the audio context on the first real user gesture anywhere on the
  // page (autoplay policy) and start any pinned ambient loops from the save.
  const wakeSound = function() {
    startSoundSystem();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("pointerdown", wakeSound, { passive: true });
    window.addEventListener("keydown", wakeSound);
  }

  syncSoundControls();
}

// Called from user gestures. Resumes audio and (re)starts enabled ambient loops.
function startSoundSystem() {
  const manager = getSoundManager();

  if (!manager) {
    return Promise.resolve(false);
  }

  return manager.resume().then(function(ready) {
    if (!ready) {
      return false;
    }

    if (!soundSystemStarted) {
      soundSystemStarted = true;
    }

    getSoundJournalState().enabledAmbient.forEach(function(id) {
      const entry = getSoundCatalogEntry(id);
      if (id === FIRE_LINKED_LOOP || (entry && entry.weatherLinked)) {
        return; // condition-linked loops are synchronized below
      }
      if (isLoopSoundId(id) && isSoundDiscovered(id)) {
        manager.startLoop(id);
      }
    });

    syncCampfireAmbient();
    syncWeatherAmbient();
    return true;
  });
}

function discoverSound(id) {
  const entry = getSoundCatalogEntry(id);

  if (!entry) {
    return false;
  }

  const journal = getSoundJournalState();

  if (journal.discovered.indexOf(id) !== -1) {
    return false; // already known: never re-show the unlock toast
  }

  journal.discovered.push(id);

  // Condition-linked ambience defaults on when first discovered; the player
  // can still turn it off in the Sound Journal.
  if ((id === FIRE_LINKED_LOOP || id === RAIN_LINKED_LOOP) && journal.enabledAmbient.indexOf(id) === -1) {
    journal.enabledAmbient.push(id);
  }

  saveGame();
  setStatus("🔊 发现新声音：" + entry.name);
  refreshSoundJournalView();
  updateDailyCampCard();
  return true;
}

// Fired when an interaction begins. Discovers + plays the mapped sounds.
function triggerInteractionSounds(triggerKey) {
  const trigger = getSoundTriggers()[triggerKey];

  if (!trigger) {
    return;
  }

  const manager = getSoundManager();

  startSoundSystem();

  (trigger.oneshot || []).forEach(function(id) {
    discoverSound(id);
    if (manager) {
      manager.playOneShot(id);
    }
  });

  (trigger.ambient || []).forEach(function(id) {
    discoverSound(id);
    startActivityAmbience(id);
  });
}

// Called at the start of every camper action. Ends the previous activity's
// temporary ambience and, if the new action is a sound-bearing interaction,
// discovers + plays its sounds.
function handleActivitySoundStart(action, activityId) {
  stopActivityAmbience();

  if (activityId && getSoundTriggers()[activityId]) {
    triggerInteractionSounds(activityId);
    return;
  }

  // Campfire is fire-linked, not a temporary activity loop: tending the fire
  // discovers it (which defaults it on), then it follows the burning state.
  if (action === "sittingByFire" || action === "addingWoodToFire") {
    startSoundSystem();
    discoverSound(FIRE_LINKED_LOOP);
    syncCampfireAmbient();
  }
}

// Start a loop just for the current activity. If the player has already pinned
// it as persistent ambient, leave that alone (it is already playing).
function startActivityAmbience(id) {
  const manager = getSoundManager();

  if (!manager || !isLoopSoundId(id)) {
    return;
  }

  if (isAmbientEnabled(id)) {
    manager.startLoop(id);
    return;
  }

  temporaryAmbientLoops.add(id);
  manager.startLoop(id);
}

// Stop any temporary activity loops that the player has not pinned.
function stopActivityAmbience() {
  if (temporaryAmbientLoops.size === 0) {
    return;
  }

  const manager = getSoundManager();

  temporaryAmbientLoops.forEach(function(id) {
    if (!isAmbientEnabled(id) && manager) {
      manager.stopLoop(id);
    }
  });

  temporaryAmbientLoops.clear();
}

// Player toggles a pinned ambient loop in the journal.
function setAmbientEnabled(id, enabled) {
  if (!isLoopSoundId(id) || !isSoundDiscovered(id)) {
    return;
  }

  const journal = getSoundJournalState();
  const manager = getSoundManager();
  const index = journal.enabledAmbient.indexOf(id);

  if (enabled) {
    if (index === -1) {
      journal.enabledAmbient.push(id);
    }
    temporaryAmbientLoops.delete(id); // now a persistent loop, not temporary
  } else if (index !== -1) {
    journal.enabledAmbient.splice(index, 1);
  }

  if (id === FIRE_LINKED_LOOP) {
    // campfire only plays while the fire burns, even when toggled on
    startSoundSystem().then(syncCampfireAmbient);
    syncCampfireAmbient();
  } else if (id === RAIN_LINKED_LOOP) {
    if (enabled) {
      startSoundSystem().then(syncWeatherAmbient);
    } else {
      syncWeatherAmbient();
    }
  } else if (enabled) {
    startSoundSystem().then(function() {
      if (manager) {
        manager.startLoop(id);
      }
    });
  } else if (manager) {
    manager.stopLoop(id);
  }

  saveGame();
  refreshSoundJournalView();
}

function setSoundMasterVolume(value) {
  const journal = getSoundJournalState();
  const manager = getSoundManager();
  const volume = Math.max(0, Math.min(1, Number(value) || 0));

  journal.masterVolume = volume;

  if (manager) {
    manager.setMasterVolume(volume);
  }

  saveGame();
}

function setSoundMuted(muted) {
  const journal = getSoundJournalState();
  const manager = getSoundManager();

  journal.muted = Boolean(muted);

  if (manager) {
    manager.setMuted(journal.muted);
  }

  saveGame();
  syncSoundControls();
}

// ---- Sound Journal panel ----
function isSoundJournalOpen() {
  return Boolean(soundJournalLayer && !soundJournalLayer.classList.contains("hidden"));
}

function openSoundJournal() {
  if (!soundJournalLayer) {
    return;
  }

  startSoundSystem();
  closeShop();
  closeInventoryPanel();
  renderSoundJournal();
  syncSoundControls();
  soundJournalLayer.classList.remove("hidden");
  soundJournalLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("sound-journal-open");
}

function closeSoundJournal() {
  if (!soundJournalLayer) {
    return;
  }

  soundJournalLayer.classList.add("hidden");
  soundJournalLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sound-journal-open");
}

function refreshSoundJournalView() {
  if (isSoundJournalOpen()) {
    renderSoundJournal();
  }
}

function syncSoundControls() {
  const journal = getSoundJournalState();

  if (soundVolumeSlider) {
    soundVolumeSlider.value = String(Math.round(journal.masterVolume * 100));
  }

  if (soundMasterToggle) {
    soundMasterToggle.classList.toggle("muted", journal.muted);
    soundMasterToggle.setAttribute("aria-pressed", journal.muted ? "true" : "false");
    soundMasterToggle.textContent = journal.muted ? "🔇 静音中" : "🔊 开启";
  }
}

function renderSoundJournal() {
  if (!soundJournalList) {
    return;
  }

  soundJournalList.textContent = "";

  const sounds = getSoundCatalogSounds();
  const discoveredCount = sounds.filter(function(entry) {
    return isSoundDiscovered(entry.id);
  }).length;

  sounds.forEach(function(entry) {
    soundJournalList.appendChild(createSoundJournalRow(entry));
  });

  const summary = document.createElement("p");
  summary.className = "sound-journal-summary";
  summary.textContent = "已发现 " + discoveredCount + " / " + sounds.length + " 种声音";
  soundJournalList.appendChild(summary);
}

function createSoundJournalRow(entry) {
  const discovered = isSoundDiscovered(entry.id);
  const isLoop = entry.type === "loop";

  const row = document.createElement("div");
  row.className = "sound-journal-row";
  row.classList.toggle("locked", !discovered);
  row.classList.toggle("is-loop", isLoop);

  const icon = document.createElement("span");
  icon.className = "sound-journal-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = discovered ? (isLoop ? "🎧" : "✨") : "🔒";
  row.appendChild(icon);

  const copy = document.createElement("div");
  copy.className = "sound-journal-copy";

  const title = document.createElement("h3");
  title.className = "sound-journal-name";
  title.textContent = discovered ? entry.name : "？？？";
  copy.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "sound-journal-desc";
  desc.textContent = discovered ? entry.description : (entry.lockedHint || "继续探索营地就能发现。");
  copy.appendChild(desc);

  row.appendChild(copy);

  const control = document.createElement("div");
  control.className = "sound-journal-control";

  if (!discovered) {
    const lockTag = document.createElement("span");
    lockTag.className = "sound-journal-tag locked-tag";
    lockTag.textContent = "未发现";
    control.appendChild(lockTag);
  } else if (isLoop) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "sound-journal-toggle";
    const on = isAmbientEnabled(entry.id);
    toggle.classList.toggle("on", on);
    toggle.setAttribute("aria-pressed", on ? "true" : "false");
    toggle.setAttribute("aria-label", (on ? "关闭" : "开启") + entry.name + "循环");
    const knob = document.createElement("span");
    knob.className = "sound-journal-knob";
    toggle.appendChild(knob);
    toggle.addEventListener("click", function() {
      setAmbientEnabled(entry.id, !isAmbientEnabled(entry.id));
    });
    control.appendChild(toggle);
  } else {
    const foundTag = document.createElement("span");
    foundTag.className = "sound-journal-tag found-tag";
    foundTag.textContent = "已发现";
    control.appendChild(foundTag);
  }

  row.appendChild(control);
  return row;
}
