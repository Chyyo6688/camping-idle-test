// Sound Manager: a small Web Audio engine for the Sound Journal.
//
// Responsibilities (kept out of game.js on purpose):
//   - lazily create / resume a single AudioContext, respecting the browser
//     autoplay policy (only starts after a user gesture),
//   - fetch + decode audio buffers on demand and cache them,
//   - play one-shot effects (overlapping is fine),
//   - start / stop seamless looping ambient tracks, each on its own gain node
//     so multiple loops layer without interrupting each other,
//   - a master gain with volume + mute.
//
// Fallback: when Web Audio cannot be used (e.g. the page is opened via the
// file:// protocol, where fetch() of local files is blocked, or decoding
// fails), it transparently falls back to HTMLAudioElement playback so sound
// still works. Loops via <audio loop> are not perfectly gapless but audible.
//
// It does NOT know about discovery, saves or UI. gameSound.js drives all of that.
(function () {
  const SoundManager = {};

  let audioContext = null;
  let masterGain = null;
  let masterVolume = 0.7;
  let muted = false;
  let basePath = "";
  let versionSuffix = "";
  let webAudioBroken = false;       // set once fetch/decode fails -> use <audio>
  let warnedFallback = false;

  const catalogById = {};          // id -> catalog entry
  const bufferCache = {};          // id -> AudioBuffer
  const bufferPromises = {};       // id -> Promise<AudioBuffer>
  const activeLoops = {};          // id -> { source, gain }   (Web Audio loops)
  const htmlLoops = {};            // id -> HTMLAudioElement    (fallback loops)
  const pendingLoops = {};         // id -> options, requested before the context was ready
  const requestedLoops = {};       // id -> true while playback is still desired
  const loopStartPromises = {};    // id -> in-flight cached-buffer start request

  function isSupported() {
    return typeof window !== "undefined" &&
      (window.AudioContext || window.webkitAudioContext);
  }

  function shouldUseHtmlFallback() {
    return webAudioBroken || !isSupported();
  }

  function noteFallback(reason) {
    if (!warnedFallback && typeof console !== "undefined") {
      warnedFallback = true;
      console.warn("[soundManager] Web Audio unavailable (" + reason +
        "); falling back to <audio> playback. If you opened the game via " +
        "file://, run it from a local http server for gapless loops.");
    }
  }

  function ensureContext() {
    if (audioContext) {
      return audioContext;
    }
    if (!isSupported()) {
      return null;
    }
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioContext = new Ctx();
      masterGain = audioContext.createGain();
      masterGain.gain.value = muted ? 0 : masterVolume;
      masterGain.connect(audioContext.destination);
    } catch (e) {
      audioContext = null;
      webAudioBroken = true;
      noteFallback("context-create-failed");
      return null;
    }
    return audioContext;
  }

  function versioned(path) {
    if (!path) {
      return path;
    }
    const full = basePath + path;
    if (!versionSuffix) {
      return full;
    }
    return full + (full.indexOf("?") === -1 ? "?" : "&") + versionSuffix;
  }

  function clamp01(value) {
    if (typeof value !== "number" || isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(1, value));
  }

  function effectiveVolume() {
    return muted ? 0 : masterVolume;
  }

  function getEntryFiles(entry) {
    const rawFiles = entry && Array.isArray(entry.files) && entry.files.length > 0
      ? entry.files
      : entry && entry.file
        ? [entry.file]
        : [];
  
    return rawFiles.map(function (item) {
      if (typeof item === "string") {
        return {
          file: item,
          weight: 1
        };
      }
  
      if (item && typeof item.file === "string" && item.file) {
        return {
          file: item.file,
          weight: typeof item.weight === "number" ? Math.max(0, item.weight) : 1
        };
      }
  
      return null;
    }).filter(function (item) {
      return item && item.file && item.weight > 0;
    });
  }
  
  function pickRandomFile(files, avoidFile) {
    if (!files.length) {
      return "";
    }
    if (files.length === 1) {
      return files[0].file;
    }
  
    let pool = files.filter(function (item) {
      return item.file !== avoidFile;
    });
    if (!pool.length) {
      pool = files;
    }
  
    const totalWeight = pool.reduce(function (sum, item) {
      return sum + item.weight;
    }, 0);
  
    let roll = Math.random() * totalWeight;
  
    for (let i = 0; i < pool.length; i += 1) {
      roll -= pool[i].weight;
      if (roll <= 0) {
        return pool[i].file;
      }
    }
  
    return pool[pool.length - 1].file;
  }
  

  // ---- public config -------------------------------------------------------
  SoundManager.configure = function (options) {
    const opts = options || {};
    if (opts.catalog && Array.isArray(opts.catalog.sounds)) {
      opts.catalog.sounds.forEach(function (entry) {
        if (entry && entry.id) {
          catalogById[entry.id] = entry;
        }
      });
    }
    if (typeof opts.basePath === "string") {
      basePath = opts.basePath;
    }
    if (typeof opts.version === "string" && opts.version) {
      versionSuffix = "v=" + opts.version;
    }
    if (typeof opts.masterVolume === "number") {
      masterVolume = clamp01(opts.masterVolume);
    }
    if (typeof opts.muted === "boolean") {
      muted = opts.muted;
    }
    return SoundManager;
  };

  SoundManager.isSupported = isSupported;

  SoundManager.isReady = function () {
    return Boolean(audioContext && audioContext.state === "running") ||
      shouldUseHtmlFallback();
  };

  // Call from a user gesture (click / activity trigger). Resumes the context
  // and flushes any loops that were requested while it was suspended.
  SoundManager.resume = function () {
    if (shouldUseHtmlFallback()) {
      flushPendingLoops();
      return Promise.resolve(true);
    }

    const ctx = ensureContext();
    if (!ctx) {
      flushPendingLoops();
      return Promise.resolve(true); // fallback path
    }

    const finish = function () {
      flushPendingLoops();
      return true;
    };

    if (ctx.state === "suspended" && typeof ctx.resume === "function") {
      return ctx.resume().then(finish).catch(function () {
        return finish();
      });
    }
    return Promise.resolve(finish());
  };

  function flushPendingLoops() {
    Object.keys(pendingLoops).forEach(function (id) {
      const options = pendingLoops[id];
      delete pendingLoops[id];
      if (requestedLoops[id]) {
        SoundManager.startLoop(id, options);
      }
    });
  }

  // ---- buffer loading (Web Audio) ------------------------------------------
function loadBufferForFile(id, file) {
  const cacheKey = id + "::" + file;

  if (bufferCache[cacheKey]) {
    return Promise.resolve(bufferCache[cacheKey]);
  }
  if (bufferPromises[cacheKey]) {
    return bufferPromises[cacheKey];
  }

  const ctx = ensureContext();
  if (!file || !ctx) {
    return Promise.reject(new Error("sound unavailable: " + id));
  }

  const promise = fetch(versioned(file))
    .then(function (response) {
      if (!response.ok) {
        throw new Error("http " + response.status + " for " + file);
      }
      return response.arrayBuffer();
    })
    .then(function (data) {
      return new Promise(function (resolve, reject) {
        // callback form for Safari compatibility
        ctx.decodeAudioData(data, resolve, reject);
      });
    })
    .then(function (buffer) {
      bufferCache[cacheKey] = buffer;
      delete bufferPromises[cacheKey];
      return buffer;
    })
    .catch(function (error) {
      delete bufferPromises[cacheKey];
      throw error;
    });

  bufferPromises[cacheKey] = promise;
  return promise;
}

function loadBuffer(id) {
  const entry = catalogById[id];
  const files = getEntryFiles(entry);
  return loadBufferForFile(id, files[0] && files[0].file);
}

  SoundManager.preload = function (id) {
    if (shouldUseHtmlFallback()) {
      return Promise.resolve(null);
    }
    return loadBuffer(id).catch(function () { return null; });
  };

  // ---- HTMLAudioElement fallback -------------------------------------------
  function playOneShotHtml(id, gain) {
    const entry = catalogById[id];
    if (!entry || !entry.file || typeof Audio === "undefined") {
      return;
    }
    try {
      const audio = new Audio(versioned(entry.file));
      audio.volume = clamp01(effectiveVolume() * (typeof gain === "number" ? gain : 1));
      const playback = audio.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {});
      }
    } catch (e) {}
  }

  function getLoopFadeSeconds(options, fallbackSeconds) {
    const seconds = options && Number(options.fadeSeconds);
    return Number.isFinite(seconds) ? Math.max(0, seconds) : fallbackSeconds;
  }

  function applyHtmlLoopVolume(audio) {
    if (!audio) {
      return;
    }

    const ratio = typeof audio._soundVolumeRatio === "number" ? audio._soundVolumeRatio : 1;
    try {
      audio.volume = clamp01(effectiveVolume() * ratio);
    } catch (e) {}
  }

  function fadeHtmlLoop(audio, targetRatio, durationSeconds, onComplete) {
    if (!audio) {
      return;
    }

    if (audio._soundFadeTimer) {
      clearInterval(audio._soundFadeTimer);
      audio._soundFadeTimer = null;
    }

    const startRatio = typeof audio._soundVolumeRatio === "number" ? audio._soundVolumeRatio : 1;
    const durationMs = Math.max(0, durationSeconds * 1000);

    if (durationMs === 0) {
      audio._soundVolumeRatio = targetRatio;
      applyHtmlLoopVolume(audio);
      if (onComplete) onComplete();
      return;
    }

    const startedAt = Date.now();
    audio._soundFadeTimer = setInterval(function () {
      const progress = Math.min(1, (Date.now() - startedAt) / durationMs);
      audio._soundVolumeRatio = startRatio + (targetRatio - startRatio) * progress;
      applyHtmlLoopVolume(audio);

      if (progress >= 1) {
        clearInterval(audio._soundFadeTimer);
        audio._soundFadeTimer = null;
        if (onComplete) onComplete();
      }
    }, 40);
  }

  function startLoopHtml(id, fadeSeconds) {
    if (htmlLoops[id]) {
      return true;
    }
  
    const entry = catalogById[id];
    const files = getEntryFiles(entry);
  
    if (!entry || !files.length || typeof Audio === "undefined") {
      return false;
    }
  
    try {
      const audio = new Audio();
      audio._soundVolumeRatio = fadeSeconds > 0 ? 0 : 1;
      applyHtmlLoopVolume(audio);
      htmlLoops[id] = audio;
  
      if (entry.randomizeLoop && files.length > 1) {
        let currentFile = "";
  
        const playNext = function () {
          if (htmlLoops[id] !== audio) {
            return;
          }
  
          currentFile = pickRandomFile(files, currentFile);
          audio.src = versioned(currentFile);
          audio.currentTime = 0;
  
          const playback = audio.play();
          if (playback && typeof playback.catch === "function") {
            playback.catch(function () {});
          }
        };
  
        audio.loop = false;
        audio.addEventListener("ended", playNext);
        playNext();
      } else {
        audio.src = versioned(files[0].file);
        audio.loop = true;
  
        const playback = audio.play();
        if (playback && typeof playback.catch === "function") {
          playback.catch(function () {});
        }
      }
      fadeHtmlLoop(audio, 1, fadeSeconds);
      return true;
    } catch (e) {
      delete htmlLoops[id];
      return false;
    }
  }

  function stopLoopHtml(id, fadeSeconds) {
    const audio = htmlLoops[id];
    if (!audio) {
      return false;
    }
    delete htmlLoops[id];
    fadeHtmlLoop(audio, 0, fadeSeconds, function () {
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch (e) {}
    });
    return true;
  }

  // ---- one-shots -----------------------------------------------------------
  SoundManager.playOneShot = function (id, gain) {
    if (shouldUseHtmlFallback()) {
      playOneShotHtml(id, gain);
      return;
    }

    const ctx = ensureContext();
    if (!ctx) {
      playOneShotHtml(id, gain);
      return;
    }

    const play = function () {
      loadBuffer(id).then(function (buffer) {
        if (ctx.state !== "running") {
          return;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const nodeGain = ctx.createGain();
        nodeGain.gain.value = typeof gain === "number" ? gain : 1;
        source.connect(nodeGain);
        nodeGain.connect(masterGain);
        source.start(0);
        source.onended = function () {
          try { source.disconnect(); nodeGain.disconnect(); } catch (e) {}
        };
      }).catch(function () {
        // fetch/decode failed (likely file://): fall back for good.
        webAudioBroken = true;
        noteFallback("oneshot-load-failed");
        playOneShotHtml(id, gain);
      });
    };

    if (ctx.state === "running") {
      play();
    } else if (typeof ctx.resume === "function") {
      ctx.resume().then(play).catch(function () {
        webAudioBroken = true;
        noteFallback("resume-failed");
        playOneShotHtml(id, gain);
      });
    } else {
      playOneShotHtml(id, gain);
    }
  };

  // ---- ambient loops -------------------------------------------------------
  SoundManager.isLoopPlaying = function (id) {
    return Boolean(activeLoops[id] || htmlLoops[id]);
  };
  function startRandomizedLoop(id, fadeSeconds) {
    const entry = catalogById[id];
    const files = getEntryFiles(entry);
    const ctx = ensureContext();
  
    if (!entry || !files.length || !ctx) {
      return false;
    }
  
    const nodeGain = ctx.createGain();
    nodeGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    nodeGain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + Math.max(0.01, fadeSeconds));
    nodeGain.connect(masterGain);
  
    activeLoops[id] = {
      source: null,
      gain: nodeGain,
      currentFile: ""
    };
  
    function playNext() {
      const loop = activeLoops[id];
  
      if (!loop || ctx.state !== "running") {
        return;
      }
  
      const file = pickRandomFile(files, loop.currentFile);
      loop.currentFile = file;
  
      loadBufferForFile(id, file).then(function (buffer) {
        const currentLoop = activeLoops[id];
  
        if (!currentLoop || !requestedLoops[id] || ctx.state !== "running") {
          return;
        }
  
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = false;
        source.connect(nodeGain);
  
        currentLoop.source = source;
  
        source.onended = function () {
          try {
            source.disconnect();
          } catch (e) {}
  
          playNext();
        };
  
        source.start(0);
      }).catch(function () {
        delete activeLoops[id];
  
        try {
          nodeGain.disconnect();
        } catch (e) {}
  
        if (requestedLoops[id]) {
          webAudioBroken = true;
          noteFallback("random-loop-load-failed");
          startLoopHtml(id, fadeSeconds);
        }
      });
    }
  
    playNext();
    return true;
  }
  SoundManager.startLoop = function (id, options) {
    const loopOptions = options || {};
    const fadeSeconds = getLoopFadeSeconds(loopOptions, 0.35);
    requestedLoops[id] = true;

    if (activeLoops[id] || htmlLoops[id]) {
      return Promise.resolve(true); // already playing, never restart
    }

    if (loopStartPromises[id]) {
      return loopStartPromises[id];
    }

    if (shouldUseHtmlFallback()) {
      return Promise.resolve(startLoopHtml(id, fadeSeconds));
    }

    const ctx = ensureContext();
    if (!ctx) {
      return Promise.resolve(startLoopHtml(id, fadeSeconds));
    }
    if (ctx.state !== "running") {
      pendingLoops[id] = { fadeSeconds: fadeSeconds }; // start once resume() runs
      if (typeof ctx.resume === "function") {
        ctx.resume().catch(function () {});
      }
      return Promise.resolve(false);
    }
    const entry = catalogById[id];
    const files = getEntryFiles(entry);
    
    if (entry && entry.randomizeLoop && files.length > 1) {
      return Promise.resolve(startRandomizedLoop(id, fadeSeconds));
    }

    const startPromise = loadBuffer(id).then(function (buffer) {
      if (!requestedLoops[id] || activeLoops[id] || ctx.state !== "running") {
        return false;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const nodeGain = ctx.createGain();
      // brief fade-in so toggling on is gentle, not a pop
      nodeGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      nodeGain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + Math.max(0.01, fadeSeconds));
      source.connect(nodeGain);
      nodeGain.connect(masterGain);
      source.start(0);
      activeLoops[id] = { source: source, gain: nodeGain };
      return true;
    }).catch(function () {
      if (!requestedLoops[id]) {
        return false;
      }
      // fetch/decode failed (likely file://): fall back for good.
      webAudioBroken = true;
      noteFallback("loop-load-failed");
      return startLoopHtml(id, fadeSeconds);
    }).then(function (started) {
      delete loopStartPromises[id];
      return started;
    });

    loopStartPromises[id] = startPromise;
    return startPromise;
  };

  SoundManager.stopLoop = function (id, options) {
    const fadeSeconds = getLoopFadeSeconds(options || {}, 0.25);
    delete requestedLoops[id];
    delete pendingLoops[id];

    if (htmlLoops[id]) {
      return stopLoopHtml(id, fadeSeconds);
    }

    const loop = activeLoops[id];
    if (!loop) {
      return false;
    }
    delete activeLoops[id];
    const ctx = audioContext;
    try {
      if (ctx && loop.gain) {
        const now = ctx.currentTime;
        loop.gain.gain.cancelScheduledValues(now);
        loop.gain.gain.setValueAtTime(Math.max(0.0001, loop.gain.gain.value), now);
        loop.gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.01, fadeSeconds));
      
        if (loop.source) {
          loop.source.stop(now + fadeSeconds + 0.05);
        }
      } else if (loop.source) {
        loop.source.stop();
      }
    } catch (e) {}
    setTimeout(function () {
      try {
        if (loop.source) {
          loop.source.disconnect();
        }
        if (loop.gain) {
          loop.gain.disconnect();
        }
      } catch (e) {}
    }, Math.max(150, fadeSeconds * 1000 + 120));
    return true;
  };

  SoundManager.stopAllLoops = function () {
    Object.keys(activeLoops).forEach(function (id) {
      SoundManager.stopLoop(id);
    });
    Object.keys(htmlLoops).forEach(function (id) {
      stopLoopHtml(id, 0.25);
    });
    Object.keys(pendingLoops).forEach(function (id) {
      delete pendingLoops[id];
    });
    Object.keys(requestedLoops).forEach(function (id) {
      delete requestedLoops[id];
    });
  };

  SoundManager.getActiveLoopIds = function () {
    const ids = Object.keys(activeLoops);
    Object.keys(htmlLoops).forEach(function (id) {
      if (ids.indexOf(id) === -1) {
        ids.push(id);
      }
    });
    return ids;
  };

  // ---- master volume / mute ------------------------------------------------
  function applyMasterGain() {
    if (masterGain && audioContext) {
      const target = effectiveVolume();
      const now = audioContext.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(target, now, 0.05);
    }
    // keep any fallback loops in sync too
    Object.keys(htmlLoops).forEach(function (id) {
      applyHtmlLoopVolume(htmlLoops[id]);
    });
  }

  SoundManager.setMasterVolume = function (value) {
    masterVolume = clamp01(value);
    applyMasterGain();
    return masterVolume;
  };

  SoundManager.getMasterVolume = function () {
    return masterVolume;
  };

  SoundManager.setMuted = function (value) {
    muted = Boolean(value);
    applyMasterGain();
    return muted;
  };

  SoundManager.isMuted = function () {
    return muted;
  };

  if (typeof window !== "undefined") {
    window.soundManager = SoundManager;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SoundManager;
  }
})();
