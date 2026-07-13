# Test Build Instructions

当前源码版本：V4.9。
当前冒险子存档版本：v8。

## 包状态

- 纯静态 app，没有 npm package、build command 或后端。
- 运行包包含根目录 `index.html`、`style.css`、`js/` 和 `assets/`。
- `window.APP_VERSION` 同时为 CSS、JavaScript 和多数素材 URL 提供 cache busting。
- 本轮不要 deploy；后续发布仍是上传根目录静态包。

## 本地运行

必须通过 HTTP 打开，不要使用 `file://`。任选一种本地服务器：

```bash
python3 -m http.server 8080
```

```bash
node tools/serve.js 8080
```

浏览器地址：

```text
http://localhost:8080/index.html
```

Fresh save 测试可使用 `?reset=1`；它会清除本游戏 localStorage。普通刷新不要带该参数。

## 冒险完整流程

入口：营地 Help / 菜单 →「冒险测试」。

```text
选择地图
→ 选择路线
→ 查看系统自动生成的只读契机
→ 整理最多 5 件物品
→ 自动经历最多 5 个事件
→ 查看故事日志与真实账本
→ backpack 和 loot 返回对应 Storage
```

准备页不得出现可点击目标卡片或“必须选择目标”校验。`adventureHook` 只显示一条不可点击的挂心事/传闻；未推进不算失败。

深山应有 4 条路线和 22 个事件；雾雨林应有 4 条路线和 18 个事件。普通完成 2 趟冒险或深山护林员线索达到 2 可以解锁雾雨林，解锁后仍可返回深山。

## 自动验收

使用仓库可用的 Node 运行以下脚本：

```bash
node tools/tmp_adventure_item_acceptance.js
node tools/tmp_adventure_story_acceptance.js
node tools/tmp_adventure_rainforest_acceptance.js
node tools/tmp_adventure_multiplayer_acceptance.js
node tools/tmp_adventure_final_acceptance.js
```

当前期望：

- 物品、backpack、loot、唯一物品与中断：53 / 53。
- 深山故事、长期状态与多地图：56 / 56。
- 雾雨林事件、状态与分布：34 / 34。
- 本地 1–3 人事件分工：19 / 19。
- 最终新旧档、异常档、离线体力与双地图状态：13 / 13。

正式 JavaScript 语法：

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
git diff --check
```

## Console 入口

```js
resetDeepMountainAdventureTest()
configureDeepMountainAdventureTestState({
  mapState: { rangerCluesFound: 2 },
  adventureMemories: { rescuedSomeone: 2 }
})
getAdventureTestSnapshot()
simulateLocalAdventurePartyTest({ size: 3 })
```

`simulateLocalAdventurePartyTest()` 只返回本地模拟数据，不写存档、不结算物品、不进行网络请求。

## 浏览器回归

- 新档：深山可进入，雾雨林锁定提示不剧透暗线。
- 旧档：库存、体力、路线、地图状态和日志保留，自动迁移到 adventure v8。
- 深山和雾雨林往返；每张地图保持自己的路线、场景和 `mapState`。
- 冒险中刷新：pending backpack 与 loot 只返还一次，Hook、地图和路线恢复提示正确。
- 日志页刷新：最后一趟故事、事件、获得/丢失/消耗/解锁继续可读。
- 雨林藤切刀和苔纹雨披带回深山后分别命中套索与暴雨专属变体。
- 体力每 14.4 分钟恢复 1，上限 100；不同路线额外消耗保持配置化。
- `390×844`：地图选择、路线、只读 Hook、5 格背包、事件气泡与日志无全局横向溢出或重叠。
- 浏览器 Console 无新的 JavaScript error。已知主游戏仍会请求缺失的 `assets/cinematics/koi_release/lake_shore_portrait_v1.png`，该旧 404 与冒险无关。

## 上传包边界

未来上传时保留 `index.html`、`style.css`、`js/` 和运行时 `assets/`。排除 `.git/`、`tmp/`、`assets/reference/`、`assets/generated_sources/`、`assets/sounds/archive/`、本地临时服务器和验收输出。当前任务明确不 commit、push 或 deploy。
