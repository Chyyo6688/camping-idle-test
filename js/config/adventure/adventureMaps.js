// Adventure maps register here so adding a destination does not change the trip engine.

const ADVENTURE_DEFAULT_MAP_ID = "deepMountain";
const ADVENTURE_MAPS = [
  DEEP_MOUNTAIN_ADVENTURE_MAP,
  FOG_RAINFOREST_ADVENTURE_MAP
].reduce(function(maps, mapDefinition) {
  maps[mapDefinition.id] = mapDefinition;
  return maps;
}, {});
