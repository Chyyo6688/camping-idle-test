// Game tick, event binding, initialization, and recurring loops.

function gameTick() {
  if (camperProfileActive || !hasCamperProfile(gameState)) {
    updateScreen();
    return;
  }

  if (gameState.warmthSeconds > 0) {
    const cozyGain = getCozyPointsPerSecond();
    gameState.cozyPoints += cozyGain;
    gameState.warmthSeconds -= getWarmthBurnRate();
    gameState.warmthSeconds += getWarmthAutoRestore();
    gameState.warmthSeconds = Math.max(0, gameState.warmthSeconds);

    showCozyGain(cozyGain);
  }

  syncCampfireAmbient();
  updateScreen();
  saveGame();
}

shopToggle.addEventListener("click", toggleShop);
closeShopButton.addEventListener("click", closeShop);
shopBackdrop.addEventListener("click", closeShop);
if (inventoryCloseButton) {
  inventoryCloseButton.addEventListener("click", closeInventoryPanel);
}
if (coolerFullHint) {
  coolerFullHint.addEventListener("click", function(event) {
    event.preventDefault();
    showCamperThought(getCoolerFullMessage());
    setStatus(getCoolerFullMessage());
  });
  coolerFullHint.addEventListener("mouseenter", function() {
    showCamperThought(getCoolerFullMessage());
  });
  coolerFullHint.addEventListener("focus", function() {
    showCamperThought(getCoolerFullMessage());
  });
}
if (inventoryLayer) {
  inventoryLayer.addEventListener("click", function(event) {
    if (event.target === inventoryLayer) {
      closeInventoryPanel();
    }
  });
}
if (inventoryPanel) {
  inventoryPanel.addEventListener("click", function(event) {
    if (!event.target.closest(".inventory-item-actionable") && !event.target.closest(".inventory-fish-menu")) {
      closeFishActionMenu();
    }
    event.stopPropagation();
  });
}
if (inventoryFishMenu) {
  inventoryFishMenu.addEventListener("click", function(event) {
    event.stopPropagation();
  });
}
if (koiReleaseCinematic) {
  koiReleaseCinematic.addEventListener("click", closeKoiReleaseCinematic);
}
if (koiReleaseVideo) {
  koiReleaseVideo.addEventListener("ended", closeKoiReleaseCinematic);
}
if (soundJournalButton) {
  soundJournalButton.addEventListener("click", function() {
    if (isSoundJournalOpen()) {
      closeSoundJournal();
    } else {
      openSoundJournal();
    }
  });
}
if (soundJournalCloseButton) {
  soundJournalCloseButton.addEventListener("click", closeSoundJournal);
}
if (soundJournalLayer) {
  soundJournalLayer.addEventListener("click", function(event) {
    if (event.target === soundJournalLayer) {
      closeSoundJournal();
    }
  });
}
if (soundJournalPanel) {
  soundJournalPanel.addEventListener("click", function(event) {
    event.stopPropagation();
  });
}
if (soundMasterToggle) {
  soundMasterToggle.addEventListener("click", function() {
    setSoundMuted(!getSoundJournalState().muted);
  });
}
if (soundVolumeSlider) {
  soundVolumeSlider.addEventListener("input", function() {
    setSoundMasterVolume((Number(soundVolumeSlider.value) || 0) / 100);
  });
}
if (divinationButton) {
  divinationButton.addEventListener("click", openDivinationPanel);
}
if (divinationCloseButton) {
  divinationCloseButton.addEventListener("click", closeDivinationPanel);
}
if (divinationLayer) {
  divinationLayer.addEventListener("click", function(event) {
    if (event.target === divinationLayer) {
      closeDivinationPanel();
    }
  });
}
if (divinationPanel) {
  divinationPanel.addEventListener("click", function(event) {
    event.stopPropagation();
  });
}
if (divinationActionButton) {
  divinationActionButton.addEventListener("click", function() {
    if (turtleHoldTriggered) {
      turtleHoldTriggered = false;
      return;
    }
    handleDivinationAction();
  });
  divinationActionButton.addEventListener("pointerdown", startTurtleHold);
  divinationActionButton.addEventListener("pointerup", stopTurtleHold);
  divinationActionButton.addEventListener("pointercancel", stopTurtleHold);
  divinationActionButton.addEventListener("pointerleave", stopTurtleHold);
}
if (turtleShellButton) {
  turtleShellButton.addEventListener("click", function() {
    if (selectedDivinationMethod === "turtle" &&
        hasDivinationMethodUnlocked("turtle") &&
        !hasTodayDivinationResult("turtle", selectedDivinationQuestionId)) {
      castTurtleCoinsOnce();
    }
  });
}
if (dailyCampDrawerToggle) {
  dailyCampDrawerToggle.addEventListener("click", toggleDailyCampDrawer);
}

if (dailyCampBackdrop) {
  dailyCampBackdrop.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    setDailyCampDrawerExpanded(false);
  });
}

campScene.addEventListener("click", handleCampSceneClick);
if (sceneContent) {
  sceneContent.addEventListener("pointerdown", handleBuildScenePointerDown);
}
gatherWoodToggle.addEventListener("click", toggleGatherWoodMode);
dayNightToggle.addEventListener("click", toggleDayNight);
if (buildModeToggle) {
  buildModeToggle.addEventListener("click", toggleBuildMode);
}
uiDisplayToggle.addEventListener("click", toggleUiDisplayMode);
if (camperProfileButton) {
  camperProfileButton.addEventListener("click", function() {
    if (hasCamperProfile(gameState)) {
      startCamperProfileFlow("card");
    } else {
      startCamperProfileFlow("required");
    }
  });
}
onboardingHelpButton.addEventListener("click", function() {
  if (isSettingsMenuOpen()) {
    closeSettingsMenu();
  } else {
    openSettingsMenu();
  }
});
if (settingsCloseButton) {
  settingsCloseButton.addEventListener("click", closeSettingsMenu);
}
if (settingsLayer) {
  settingsLayer.addEventListener("click", function(event) {
    if (event.target === settingsLayer) {
      closeSettingsMenu();
    }
  });
}
if (settingsPanel) {
  settingsPanel.addEventListener("click", function(event) {
    event.stopPropagation();
  });
}
if (settingsTutorialToggle) {
  settingsTutorialToggle.addEventListener("click", toggleTutorialList);
}
if (settingsTutorialList) {
  settingsTutorialList.addEventListener("click", function(event) {
    const button = event.target && event.target.closest ? event.target.closest("[data-guide]") : null;
    if (button) {
      playTutorialFromMenu(button.dataset.guide);
    }
  });
}
if (settingsResetItem) {
  settingsResetItem.addEventListener("click", function() {
    closeSettingsMenu();
    confirmResetSave();
  });
}
onboardingPrimaryButton.addEventListener("click", advanceOnboarding);
onboardingSkipButton.addEventListener("click", function() {
  completeOnboarding(true);
});
if (camperNameInput) {
  camperNameInput.addEventListener("input", updateCamperProfileView);
  camperNameInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      advanceCamperProfileFlow();
    }
  });
}
if (camperProfilePrimaryButton) {
  camperProfilePrimaryButton.addEventListener("click", advanceCamperProfileFlow);
}
if (camperProfileSecondaryButton) {
  camperProfileSecondaryButton.addEventListener("click", handleCamperProfileSecondaryAction);
}
if (camperCardCloseButton) {
  camperCardCloseButton.addEventListener("click", closeCamperCardAndResume);
}
if (camperProfileLayer) {
  camperProfileLayer.addEventListener("click", function(event) {
    if (
      event.target === camperProfileLayer &&
      camperProfileStep === "result"
    ) {
      closeCamperCardAndResume();
    }
  });
}
if (camperNameEditButton) {
  camperNameEditButton.addEventListener("click", editActiveCamperName);
}
if (camperNameEditInput) {
  camperNameEditInput.addEventListener("keydown", handleCamperCardInlineInputKeydown);
}
if (camperCatchphraseEditButton) {
  camperCatchphraseEditButton.addEventListener("click", editActiveCamperCatchphrase);
}
if (camperCatchphraseEditInput) {
  camperCatchphraseEditInput.addEventListener("keydown", handleCamperCardInlineInputKeydown);
}
if (camperRetakeQuizButton) {
  camperRetakeQuizButton.addEventListener("click", function() {
    startCamperProfileFlow("retakeQuiz");
  });
}
if (camperRecustomizeButton) {
  camperRecustomizeButton.addEventListener("click", function() {
    startCamperProfileFlow("appearanceOnly");
  });
}
if (resetSaveButton) {
  resetSaveButton.addEventListener("click", confirmResetSave);
}

if (typeof window !== "undefined") {
  window.setTestWeather = setTestWeather;
  window.clearTestWeather = clearTestWeather;
  window.setTestDivination = setTestDivination;
  window.clearTestDivination = clearTestDivination;
  window.resetTodayDivination = resetTodayDivination;
  window.resetAllTodayDivinations = resetAllTodayDivinations;
  window.addEventListener("beforeunload", saveGame);
  window.addEventListener("pointermove", updateBuildDrag);
  window.addEventListener("pointerup", finishBuildDrag);
  window.addEventListener("pointercancel", finishBuildDrag);
  window.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeFishActionMenu();
      closeKoiReleaseCinematic();
    }
    if (event.key === "Escape" && isInventoryPanelOpen()) {
      closeInventoryPanel();
    }
    if (event.key === "Escape" && isSoundJournalOpen()) {
      closeSoundJournal();
    }
    if (event.key === "Escape" && isSettingsMenuOpen()) {
      closeSettingsMenu();
    }
    if (event.key === "Escape" && isDivinationPanelOpen()) {
      closeDivinationPanel();
    }
    if (event.key === "Escape" && dailyCampDrawerExpanded) {
      setDailyCampDrawerExpanded(false);
    }
  });
  window.addEventListener("resize", function() {
    syncSceneScale();
    positionOnboardingLayer();
    refreshTargetOutlines();
    updateSceneOcclusion();
  });
}

syncSceneScale();
resetSaveIfRequestedByUrl();
loadGame();
renderShopFromCatalog();
spawnWood();
spawnWood();
setShopFilter("all");
applyUiDisplayMode();
initSoundSystem();
updateScreen();
updateCamperView();
chooseNextCamperAction();
maybeStartOnboarding();

setInterval(gameTick, 1000);
setInterval(updateCamperAI, 400);
setInterval(updateCamperSprite, camperSpriteRefreshMs);
setInterval(function() {
  if (Math.random() < 0.7) {
    spawnWood();
  }
}, 3500);
