(function(global) {
  const catalog = global.GEAR_CATALOG || {};
  const seatableDefs = {};

  Object.keys(catalog).forEach(function(id) {
    const item = catalog[id];

    if (item && item.interactions && item.interactions.seatable) {
      seatableDefs[id] = item;
    }
  });

  global.SEATABLE_FURNITURE_DEFS = seatableDefs;
})(typeof window !== "undefined" ? window : globalThis);
