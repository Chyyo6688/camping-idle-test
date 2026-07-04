# Cozy Camping Idle - Task Log

## 当前 V2.6 状态

- `index.html` 和 `game.js` 已指向 app version `2.6`。
- 包检查：没有 npm package、lockfile、bundler、第三方 runtime script 或外部依赖。
- 当前运行包就是根目录静态 app：`index.html`、`style.css`、`gearCatalog.js`、`game.js`、`assets/`。
- 后续直接上传根目录静态包到 GitHub。
- 当前未提交代码改动在 `game.js` 和 `style.css`。

## 压缩里程碑

- V1：本地浏览器 idle clicker，使用 localStorage。
- V2：scene-first idle 循环，camper 自动捡木头，加入 Warmth、Cozy Points、Comfort、day/night、offline progress。
- V2.3：gear registry、购买后显示装备、新存档从熄灭篝火和 starter tent 开始。
- V2.4：Reset、`?reset=1`、toast、mobile shop、静态发布规则。
- V2.5：Shop UI polish、place/pack、tarp/vehicle replacement、rooftop mount、headlamp layers。
- V2.6：onboarding/help、手动 action queue、UI 显示切换、Build Mode 拖动/层级存档。

## 维护规则

- 不要给每一轮小修改追加长 handoff。
- 功能变化时，更新当前状态，不保留流水账。
- 新装备继续走 `gearCatalog.js`、`ownedGear`、`placedGear`、`equippedGear`。
- GitHub 上传前确认 runtime 文件齐全，尤其是 `gearCatalog.js`。

## 下一步检查

- `?reset=1` fresh save。
- 手动 queue：树枝、椅子、帐篷、篝火。
- Build Mode：解锁、拖动、层级、刷新后保持。
- Mobile：shop 打开、safe area、toast、核心物件可见。
