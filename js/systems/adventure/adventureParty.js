// Local party assignment and log data. Networking and party UI live outside this module.

const ADVENTURE_LOCAL_PARTY_MAX = 3;
const ADVENTURE_FUTURE_PARTY_MAX = 4;
const ADVENTURE_PARTY_DECISION_SOURCES = ["auto", "player", "teammateSuggestion", "timeoutAuto"];

function cloneAdventurePartyData(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function clampAdventurePartyValue(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function sanitizeAdventurePartyStrings(source, limit) {
  return Array.from(new Set((Array.isArray(source) ? source : []).filter(function(value) {
    return typeof value === "string" && value.length > 0 && value.length <= 100;
  }))).slice(0, limit);
}

function createNeutralAdventurePartyTraits() {
  return CAMPER_TRAIT_KEYS.reduce(function(traits, traitId) {
    traits[traitId] = 50;
    return traits;
  }, {});
}

function sanitizeAdventurePartyTraits(source) {
  const values = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  return CAMPER_TRAIT_KEYS.reduce(function(traits, traitId) {
    traits[traitId] = clampAdventurePartyValue(values[traitId] === undefined ? 50 : values[traitId], 0, 100);
    return traits;
  }, {});
}

function sanitizeAdventurePartyLuck(source) {
  const values = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  return ["generalLuck", "treasureLuck", "socialLuck", "healthLuck", "dangerSense"].reduce(function(luck, key) {
    luck[key] = clampAdventurePartyValue(values[key], -20, 20);
    return luck;
  }, {});
}

function sanitizeAdventureParticipant(source, index) {
  const participant = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const fallbackId = index === 0 ? "localCamper" : "mockCamper" + (index + 1);
  const camperId = typeof participant.camperId === "string" && participant.camperId.trim()
    ? participant.camperId.trim().slice(0, 80)
    : fallbackId;
  const displayName = typeof participant.displayName === "string" && participant.displayName.trim()
    ? participant.displayName.trim().slice(0, 30)
    : (index === 0 ? "Camper" : "队友 " + (index + 1));
  const memorySource = participant.adventureMemories && typeof participant.adventureMemories === "object"
    ? participant.adventureMemories
    : {};
  const memories = typeof sanitizeAdventureMemories === "function"
    ? sanitizeAdventureMemories(memorySource)
    : cloneAdventurePartyData(memorySource);
  return {
    camperId: camperId,
    displayName: displayName,
    role: ["solo", "lead", "member"].indexOf(participant.role) !== -1 ? participant.role : (index === 0 ? "lead" : "member"),
    source: participant.source === "mock" ? "mock" : "local",
    personalityId: typeof participant.personalityId === "string" ? participant.personalityId.slice(0, 80) : "neutralPrototype",
    finalTraits: sanitizeAdventurePartyTraits(participant.finalTraits),
    dailyAdventureModifiers: sanitizeAdventurePartyLuck(participant.dailyAdventureModifiers),
    adventureMemories: memories,
    carriedItemKeys: sanitizeAdventurePartyStrings(participant.carriedItemKeys, 5)
  };
}

function sanitizeAdventureParticipants(source, limit) {
  const maxParticipants = Math.min(ADVENTURE_FUTURE_PARTY_MAX, Math.max(1, Number(limit) || ADVENTURE_FUTURE_PARTY_MAX));
  const seenIds = {};
  return (Array.isArray(source) ? source : []).slice(0, maxParticipants).map(function(participant, index) {
    const clean = sanitizeAdventureParticipant(participant, index);
    if (seenIds[clean.camperId]) clean.camperId += "-" + (index + 1);
    seenIds[clean.camperId] = true;
    return clean;
  });
}

function createAdventureParticipantFromSnapshot(snapshot, options) {
  const source = options && typeof options === "object" ? options : {};
  const profile = snapshot && snapshot.profile && typeof snapshot.profile === "object" ? snapshot.profile : {};
  return sanitizeAdventureParticipant({
    camperId: source.camperId || profile.id || profile.camperId || profile.createdAt || "localCamper",
    displayName: source.displayName || profile.name || profile.displayName || "Camper",
    role: source.role || "lead",
    source: source.source || "local",
    personalityId: source.personalityId || (snapshot && snapshot.personalityId),
    finalTraits: source.finalTraits || (snapshot && snapshot.finalTraits),
    dailyAdventureModifiers: source.dailyAdventureModifiers || (snapshot && snapshot.dailyAdventureModifiers),
    adventureMemories: source.adventureMemories || {},
    carriedItemKeys: source.carriedItemKeys || []
  }, 0);
}

function createLocalAdventureParty(size, leadSnapshot, options) {
  const partySize = Math.min(ADVENTURE_LOCAL_PARTY_MAX, Math.max(1, Math.floor(Number(size) || 1)));
  const settings = options && typeof options === "object" ? options : {};
  const lead = createAdventureParticipantFromSnapshot(leadSnapshot, Object.assign({
    role: partySize === 1 ? "solo" : "lead",
    carriedItemKeys: settings.leadItemKeys || [],
    adventureMemories: settings.leadMemories || {}
  }, settings.lead || {}));
  if (partySize === 1) return [lead];
  const templates = [
    { camperId: "mockScout", displayName: "岚", finalTraits: { observation: 84, rationality: 72, curiosity: 68, courage: 48, preparedness: 58, responsibility: 62, sociability: 46, comfortSeeking: 42 } },
    { camperId: "mockHelper", displayName: "晴", finalTraits: { responsibility: 84, sociability: 76, preparedness: 72, observation: 58, courage: 52, curiosity: 54, rationality: 60, comfortSeeking: 56 } }
  ];
  const members = [lead];
  for (let index = 1; index < partySize; index += 1) {
    const override = Array.isArray(settings.members) && settings.members[index - 1] ? settings.members[index - 1] : {};
    members.push(sanitizeAdventureParticipant(Object.assign({}, templates[index - 1], override, {
      role: "member",
      source: "mock"
    }), index));
  }
  return sanitizeAdventureParticipants(members, ADVENTURE_LOCAL_PARTY_MAX);
}

function getAdventureParticipantSnapshot(participant, fallbackSnapshot) {
  if (!participant) return fallbackSnapshot;
  return {
    profile: { id: participant.camperId, camperId: participant.camperId, name: participant.displayName },
    appearance: null,
    personalityId: participant.personalityId,
    baseTraits: cloneAdventurePartyData(participant.finalTraits),
    habitModifiers: {},
    finalTraits: cloneAdventurePartyData(participant.finalTraits),
    dailyAdventureModifiers: cloneAdventurePartyData(participant.dailyAdventureModifiers)
  };
}

function getAdventureParticipantCounts(trip) {
  const counts = {};
  sanitizeAdventureParticipants(trip && trip.participants, ADVENTURE_FUTURE_PARTY_MAX).forEach(function(participant) {
    counts[participant.camperId] = { actor: 0, helper: 0, item: 0, observation: 0 };
  });
  (trip && Array.isArray(trip.events) ? trip.events : []).forEach(function(entry) {
    if (counts[entry.actorCamperId]) counts[entry.actorCamperId].actor += 1;
    sanitizeAdventurePartyStrings(entry.helperCamperIds, 3).forEach(function(camperId) {
      if (counts[camperId]) counts[camperId].helper += 1;
    });
    if (counts[entry.itemOwnerId]) counts[entry.itemOwnerId].item += 1;
    (Array.isArray(entry.participantObservations) ? entry.participantObservations : []).forEach(function(observation) {
      if (observation && counts[observation.camperId]) counts[observation.camperId].observation += 1;
    });
  });
  return counts;
}

function getAdventureParticipantReactionAffinity(participant, reaction) {
  const weights = reaction && reaction.traitWeights && typeof reaction.traitWeights === "object" ? reaction.traitWeights : {};
  const traitIds = Object.keys(weights);
  const totalWeight = traitIds.reduce(function(total, traitId) { return total + Math.abs(Number(weights[traitId]) || 0); }, 0);
  if (!totalWeight) return 50;
  return traitIds.reduce(function(total, traitId) {
    return total + (Number(participant.finalTraits[traitId]) || 0) * Math.abs(Number(weights[traitId]) || 0);
  }, 0) / totalWeight;
}

function getAdventureParticipantEventAffinity(participant, eventDefinition) {
  const reactions = eventDefinition && Array.isArray(eventDefinition.reactions) ? eventDefinition.reactions : [];
  return reactions.length ? Math.max.apply(null, reactions.map(function(reaction) {
    return getAdventureParticipantReactionAffinity(participant, reaction);
  })) : 50;
}

function pickAdventurePartyWeighted(entries) {
  const total = entries.reduce(function(sum, entry) { return sum + Math.max(0, Number(entry.weight) || 0); }, 0);
  if (total <= 0) return entries[0];
  let roll = Math.random() * total;
  for (let index = 0; index < entries.length; index += 1) {
    roll -= Math.max(0, Number(entries[index].weight) || 0);
    if (roll <= 0) return entries[index];
  }
  return entries[entries.length - 1];
}

function prepareAdventureEventParticipation(trip, eventDefinition, fallbackSnapshot) {
  let participants = sanitizeAdventureParticipants(trip && trip.participants, ADVENTURE_FUTURE_PARTY_MAX);
  if (!participants.length) participants = [createAdventureParticipantFromSnapshot(fallbackSnapshot, { role: "solo" })];
  const counts = getAdventureParticipantCounts(Object.assign({}, trip, { participants: participants }));
  const minimumActorCount = Math.min.apply(null, participants.map(function(participant) {
    return counts[participant.camperId] ? counts[participant.camperId].actor : 0;
  }));
  const eligible = participants.filter(function(participant) {
    return (counts[participant.camperId] ? counts[participant.camperId].actor : 0) === minimumActorCount;
  });
  const lastActorId = trip && Array.isArray(trip.events) && trip.events.length ? trip.events[trip.events.length - 1].actorCamperId : "";
  const selected = pickAdventurePartyWeighted(eligible.map(function(participant) {
    const affinity = getAdventureParticipantEventAffinity(participant, eventDefinition);
    const repeatFactor = participant.camperId === lastActorId && eligible.length > 1 ? 0.3 : 1;
    return { participant: participant, weight: Math.pow(Math.max(8, affinity - 20), 2) * repeatFactor };
  })).participant;
  return {
    participants: participants,
    actor: selected,
    actorCamperId: selected.camperId,
    actorSnapshot: getAdventureParticipantSnapshot(selected, fallbackSnapshot)
  };
}

function findAdventurePartyItemOwners(participants, outcome) {
  if (!outcome || !outcome.itemSolution) return [];
  return sanitizeAdventurePartyStrings([outcome.itemSolution.itemKey, outcome.itemSolution.followUpItemKey], 2).map(function(itemKey) {
    return participants.find(function(participant) { return participant.carriedItemKeys.indexOf(itemKey) !== -1; });
  }).filter(Boolean);
}

function getAdventurePartyObservationRules(mapId, eventDefinition) {
  if (eventDefinition && Array.isArray(eventDefinition.participantObservations)) return eventDefinition.participantObservations;
  const map = typeof getAdventureMap === "function" ? getAdventureMap(mapId) : null;
  return map && map.participantObservations && Array.isArray(map.participantObservations[eventDefinition.id])
    ? map.participantObservations[eventDefinition.id]
    : [];
}

function createAdventureParticipantObservations(trip, eventDefinition, actorCamperId, participants) {
  if (participants.length <= 1) return [];
  const rules = getAdventurePartyObservationRules(trip.mapId, eventDefinition);
  const observations = [];
  participants.filter(function(participant) { return participant.camperId !== actorCamperId; }).forEach(function(participant) {
    const match = rules.find(function(rule) {
      if (rule.traitId) return (Number(participant.finalTraits[rule.traitId]) || 0) >= (Number(rule.min) || 0);
      if (rule.memoryKey) return (Number(participant.adventureMemories[rule.memoryKey]) || 0) >= (Number(rule.min) || 1);
      return false;
    });
    if (!match || typeof match.text !== "string") return;
    observations.push({
      camperId: participant.camperId,
      displayName: participant.displayName,
      source: match.memoryKey ? "memory" : "trait",
      detailKey: match.traitId || match.memoryKey,
      text: match.text.replace(/\{name\}/g, participant.displayName)
    });
  });
  return observations.slice(0, ADVENTURE_LOCAL_PARTY_MAX - 1);
}

function completeAdventureEventParticipation(trip, eventDefinition, reaction, outcome, plan) {
  const prepared = plan || prepareAdventureEventParticipation(trip, eventDefinition, null);
  const participants = prepared.participants;
  const actor = prepared.actor;
  const counts = getAdventureParticipantCounts(Object.assign({}, trip, { participants: participants }));
  const itemOwners = findAdventurePartyItemOwners(participants, outcome);
  const helpers = [];
  itemOwners.forEach(function(owner) {
    if (owner.camperId !== actor.camperId && !helpers.some(function(helper) { return helper.camperId === owner.camperId; })) helpers.push(owner);
  });
  const available = participants.filter(function(participant) {
    return participant.camperId !== actor.camperId && !helpers.some(function(helper) { return helper.camperId === participant.camperId; });
  });
  if (participants.length > 1 && helpers.length === 0 && available.length) {
    helpers.push(pickAdventurePartyWeighted(available.map(function(participant) {
      const affinity = getAdventureParticipantReactionAffinity(participant, reaction);
      const helperCount = counts[participant.camperId] ? counts[participant.camperId].helper : 0;
      return { participant: participant, weight: Math.max(1, affinity + 35 / (helperCount + 1)) };
    })).participant);
  }
  const shouldUseSecondHelper = participants.length === 3 && helpers.length < 2 && (
    (Number(eventDefinition && eventDefinition.risk) || 0) >= 2 ||
    Boolean(outcome && outcome.itemSolution && outcome.itemSolution.isCombined) ||
    participants.some(function(participant) {
      const participation = counts[participant.camperId];
      return participation && participation.actor + participation.helper === 0;
    })
  );
  if (shouldUseSecondHelper) {
    const second = participants.find(function(participant) {
      return participant.camperId !== actor.camperId && !helpers.some(function(helper) { return helper.camperId === participant.camperId; });
    });
    if (second) helpers.push(second);
  }
  const observations = createAdventureParticipantObservations(trip, eventDefinition, actor.camperId, participants);
  const contributorIds = sanitizeAdventurePartyStrings([actor.camperId]
    .concat(helpers.map(function(helper) { return helper.camperId; }))
    .concat(itemOwners.map(function(owner) { return owner.camperId; }))
    .concat(observations.map(function(observation) { return observation.camperId; })), ADVENTURE_FUTURE_PARTY_MAX);
  let participationText = "";
  if (participants.length > 1) {
    participationText = actor.displayName + "先" + (reaction && reaction.type ? reaction.type : "采取行动") + "。";
    if (itemOwners.length && outcome.itemSolution) {
      const descriptor = typeof getAdventureItemDescriptor === "function" ? getAdventureItemDescriptor(outcome.itemSolution.itemKey) : null;
      participationText += itemOwners[0].displayName + "取出自己带来的" + (descriptor ? descriptor.name : "装备") + "协助。";
    } else if (helpers.length) {
      participationText += helpers.map(function(helper) { return helper.displayName; }).join("、") + "在一旁补上观察和支援。";
    }
  }
  return {
    participants: participants.map(function(participant) {
      return { camperId: participant.camperId, displayName: participant.displayName, role: participant.role };
    }),
    actorCamperId: actor.camperId,
    helperCamperIds: helpers.map(function(helper) { return helper.camperId; }),
    itemOwnerId: itemOwners[0] ? itemOwners[0].camperId : (outcome && outcome.itemSolution ? actor.camperId : ""),
    contributorIds: contributorIds,
    decisionSource: "auto",
    participantObservations: observations,
    participationText: participationText
  };
}

function buildAdventureParticipantHighlights(trip) {
  const participants = sanitizeAdventureParticipants(trip && trip.participants, ADVENTURE_FUTURE_PARTY_MAX);
  const counts = getAdventureParticipantCounts(Object.assign({}, trip, { participants: participants }));
  return participants.map(function(participant) {
    const summary = counts[participant.camperId] || { actor: 0, helper: 0, item: 0, observation: 0 };
    const parts = [];
    if (summary.actor) parts.push("主导了 " + summary.actor + " 次行动");
    if (summary.helper) parts.push("协助了 " + summary.helper + " 次");
    if (summary.item) parts.push("贡献了自己携带的物品");
    if (summary.observation) parts.push("留下了 " + summary.observation + " 条个人观察");
    return {
      camperId: participant.camperId,
      displayName: participant.displayName,
      actorCount: summary.actor,
      helperCount: summary.helper,
      itemUseCount: summary.item,
      observationCount: summary.observation,
      text: participant.displayName + (parts.length ? parts.join("，") : "一路保持着队伍的节奏") + "。"
    };
  });
}

function sanitizeAdventureParticipantObservations(source) {
  return (Array.isArray(source) ? source : []).slice(0, ADVENTURE_FUTURE_PARTY_MAX - 1).map(function(observation) {
    const entry = observation && typeof observation === "object" ? observation : {};
    return {
      camperId: typeof entry.camperId === "string" ? entry.camperId.slice(0, 80) : "",
      displayName: typeof entry.displayName === "string" ? entry.displayName.slice(0, 30) : "Camper",
      source: entry.source === "memory" ? "memory" : "trait",
      detailKey: typeof entry.detailKey === "string" ? entry.detailKey.slice(0, 80) : "",
      text: typeof entry.text === "string" ? entry.text.slice(0, 240) : ""
    };
  }).filter(function(entry) { return entry.camperId && entry.text; });
}

function sanitizeAdventureParticipantHighlights(source) {
  return (Array.isArray(source) ? source : []).slice(0, ADVENTURE_FUTURE_PARTY_MAX).map(function(highlight) {
    const entry = highlight && typeof highlight === "object" ? highlight : {};
    return {
      camperId: typeof entry.camperId === "string" ? entry.camperId.slice(0, 80) : "",
      displayName: typeof entry.displayName === "string" ? entry.displayName.slice(0, 30) : "Camper",
      actorCount: Math.max(0, Math.floor(Number(entry.actorCount) || 0)),
      helperCount: Math.max(0, Math.floor(Number(entry.helperCount) || 0)),
      itemUseCount: Math.max(0, Math.floor(Number(entry.itemUseCount) || 0)),
      observationCount: Math.max(0, Math.floor(Number(entry.observationCount) || 0)),
      text: typeof entry.text === "string" ? entry.text.slice(0, 300) : ""
    };
  }).filter(function(entry) { return entry.camperId; });
}

function sanitizeAdventureEventParticipantRefs(source) {
  return (Array.isArray(source) ? source : []).slice(0, ADVENTURE_FUTURE_PARTY_MAX).map(function(participant, index) {
    const entry = participant && typeof participant === "object" ? participant : {};
    return {
      camperId: typeof entry.camperId === "string" && entry.camperId ? entry.camperId.slice(0, 80) : (index === 0 ? "localCamper" : "mockCamper" + (index + 1)),
      displayName: typeof entry.displayName === "string" && entry.displayName ? entry.displayName.slice(0, 30) : (index === 0 ? "Camper" : "队友 " + (index + 1)),
      role: ["solo", "lead", "member"].indexOf(entry.role) !== -1 ? entry.role : (index === 0 ? "lead" : "member")
    };
  });
}

function simulateLocalAdventurePartyTrip(mapId, size, eventIds, leadSnapshot, options) {
  const map = typeof getAdventureMap === "function" ? getAdventureMap(mapId) : null;
  if (!map || !Array.isArray(map.events) || !map.events.length) return null;
  const selectedEventIds = (Array.isArray(eventIds) && eventIds.length ? eventIds : map.events.slice(0, 5).map(function(entry) {
    return entry.id;
  })).slice(0, 5);
  const participants = createLocalAdventureParty(size, leadSnapshot, options);
  const trip = { mapId: map.id, participants: participants, events: [] };
  selectedEventIds.forEach(function(eventId) {
    const eventDefinition = map.events.find(function(entry) { return entry.id === eventId; });
    if (!eventDefinition) return;
    const plan = prepareAdventureEventParticipation(trip, eventDefinition, leadSnapshot);
    const reaction = eventDefinition.reactions.slice().sort(function(left, right) {
      return getAdventureParticipantReactionAffinity(plan.actor, right) - getAdventureParticipantReactionAffinity(plan.actor, left);
    })[0];
    const outcome = { tier: "mixed", itemSolution: null };
    const participation = completeAdventureEventParticipation(trip, eventDefinition, reaction, outcome, plan);
    trip.events.push(Object.assign({
      eventId: eventDefinition.id,
      title: eventDefinition.title,
      reactionType: reaction.type,
      outcomeTier: outcome.tier
    }, participation));
  });
  return {
    mapId: map.id,
    participants: participants,
    events: trip.events,
    participantHighlights: buildAdventureParticipantHighlights(trip)
  };
}
