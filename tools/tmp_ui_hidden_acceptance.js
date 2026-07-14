const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const gameUi = fs.readFileSync(path.join(root, "js/core/gameUi.js"), "utf8");
const activities = fs.readFileSync(path.join(root, "js/systems/gameActivities.js"), "utf8");
const scene = fs.readFileSync(path.join(root, "js/systems/gameScene.js"), "utf8");
const results = [];

function check(name, passed, detail) {
  results.push({ name, passed: Boolean(passed), detail: detail || "" });
}

function functionSource(source, name, nextName) {
  const start = source.indexOf("function " + name + "(");
  const end = nextName ? source.indexOf("function " + nextName + "(", start + 1) : -1;
  return start === -1 ? "" : source.slice(start, end === -1 ? source.length : end);
}

const applyUiDisplayMode = functionSource(gameUi, "applyUiDisplayMode", "toggleUiDisplayMode");
const openInventoryPanel = functionSource(activities, "openInventoryPanel", "closeInventoryPanel");
const hiddenHudRule = css.match(/body\.ui-hidden \.top-bar,[\s\S]*?pointer-events:\s*none;\s*}/);
const modalSelectors = [
  ".shop-backdrop",
  ".shop-drawer",
  ".inventory-layer",
  ".cooking-recipe-layer",
  ".divination-layer",
  ".settings-layer",
  ".sound-journal-layer",
  ".adventure-storage-layer",
  ".adventure-prototype-layer",
  ".adventure-route-map-layer",
  ".adventure-clue-sort-layer"
];

check(
  "隐藏 UI 仍只作用于常驻 HUD",
  hiddenHudRule && [".top-bar", ".mode-controls", ".floating-controls", ".daily-camp-card", ".toast-layer", ".utility-controls"].every(function(selector) {
    return hiddenHudRule[0].includes(selector);
  }),
  hiddenHudRule ? hiddenHudRule[0] : "missing rule"
);

check(
  "隐藏 UI 规则不包含任何弹窗层",
  modalSelectors.every(function(selector) {
    return !css.includes("body.ui-hidden " + selector);
  }),
  modalSelectors.filter(function(selector) { return css.includes("body.ui-hidden " + selector); }).join(", ")
);

check(
  "Build Mode 的层级调整层不受隐藏 UI 影响",
  !css.includes("body.ui-hidden .scene-depth-control-layer") && css.includes("body:not(.build-mode) .scene-depth-control-layer"),
  "scene depth visibility"
);

check(
  "Build Mode 选中轮廓在隐藏 UI 时仍可见",
  css.includes("body.ui-hidden:not(.build-mode) .target-outline-image") && !css.includes("body.ui-hidden .target-outline-image"),
  "target outline scope"
);

check(
  "切换隐藏 UI 不关闭 Shop 或退出 Build Mode",
  applyUiDisplayMode.includes('classList.toggle("ui-hidden"') && !applyUiDisplayMode.includes("closeShop") && !applyUiDisplayMode.includes("exitBuildMode"),
  applyUiDisplayMode
);

check(
  "Cooler Inventory 打开逻辑不受隐藏 UI 状态限制",
  openInventoryPanel.includes('inventoryLayer.classList.remove("hidden")') &&
    openInventoryPanel.includes('document.body.classList.add("inventory-open")') &&
    !openInventoryPanel.includes("ui-hidden"),
  openInventoryPanel
);

check(
  "Inventory 和烹饪弹层保留全屏点击拦截",
  /\.inventory-layer\s*{[\s\S]*?inset:\s*0;[\s\S]*?pointer-events:\s*auto;[\s\S]*?}/.test(css) &&
    /\.adventure-clue-sort-layer,\s*\n\.cooking-recipe-layer\s*{[\s\S]*?inset:\s*0;/.test(css),
  "modal overlays"
);

check(
  "场景拖拽逻辑只依赖 Build Mode 而不依赖 HUD 显示",
  functionSource(scene, "handleBuildScenePointerDown", "handleCampSceneClick").includes("isBuildModeActive") &&
    !functionSource(scene, "handleBuildScenePointerDown", "handleCampSceneClick").includes("ui-hidden"),
  "build pointer handler"
);

console.table(results);
const passed = results.filter(function(result) { return result.passed; }).length;
console.log(JSON.stringify({ total: results.length, passed, failed: results.length - passed }, null, 2));

if (passed !== results.length) {
  process.exitCode = 1;
}
