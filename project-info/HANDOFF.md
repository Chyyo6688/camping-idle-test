# Adventure Mode Handoff

最后更新：2026-07-12  
当前分支：`adventure-mode`

## 交接状态

- 当前工作全部保留在 `adventure-mode` 工作树中，尚未 commit、push 或 deploy。
- 不要切换分支，不要 reset/checkout 覆盖现有修改；工作树中同时包含 Camper 问卷、trait 数据层和深山冒险原型的连续开发成果。
- 项目仍是纯静态浏览器游戏，没有 package、bundler 或后端。入口为根目录 `index.html`。
- 当前 app 显示版本仍为 V4.8；冒险子存档版本已经升级为 `4`。
- 深山仍是唯一冒险地图，本轮没有加入联机、多人、战斗、市场或第二地点。

## 当前已完成内容

### Camper 数据基础

- 问卷固定回答 5 题，从 5 个类别各随机抽 1 题。
- 保留原有 10 个人格 ID 和称号；并列最高分从全部并列人格中随机选择。
- Camper 保存 8 项 `baseTraits`：
  - `courage`
  - `curiosity`
  - `sociability`
  - `preparedness`
  - `observation`
  - `rationality`
  - `responsibility`
  - `comfortSeeking`
- 旧档缺少 `baseTraits` 时按现有人格 ID 自动补全，不强制重答。
- 玩家完成互动后累计 `habitStats`，由每日成长上限和递减曲线计算独立的 `habitModifiers`。
- 每日塔罗/龟壳结果生成独立 `dailyAdventureModifiers`，不写回 `baseTraits`。

未来冒险读取保持三层分离：

```text
baseTraits
+ habitModifiers
+ dailyAdventureModifiers
```

### 深山单人冒险

开发入口：

```text
主场景 → Help / 菜单 → 深山冒险测试
```

当前完整流程：

```text
选择本次目标
→ 选择已解锁路线
→ 从冒险仓库 / 鱼 / 料理中准备最多 5 件物品
→ 自动经历最多 5 个不重复事件
→ 显示气泡、动作、场景变化和结果
→ 结算背包、战利品、体力、线索和路线
→ 生成故事型冒险日志
```

冒险仍读取 Camper 的 trait、互动习惯和每日运势，以加权随机方式选择反应；玩家不手动回答事件。

## 目标系统

配置位于 `js/config/adventurePrototypeConfig.js` 的 `DEEP_MOUNTAIN_ADVENTURE_GOALS`。

现有 5 个目标：

1. `investigateWhiteShadow`：调查树林里的白影。
2. `findWatchtowerClue`：寻找旧瞭望塔的线索。
3. `findMissingRanger`：寻找失踪的护林员。
4. `investigateWildlife`：调查山中的野生动物。
5. `findSafeRoute`：寻找一条安全的新路线。

每个目标配置了相关事件、相关物品、进度 flag、完成/部分完成阈值、日志标题、四类结尾和奖励。结算类型为：

```text
complete
partial
incomplete
unexpected
```

`unexpected` 用于目标没有直接推进，但本趟出现稀有结果、物品或路线发现的情况。

目标奖励不全是普通物品：白影和瞭望塔目标写入收藏线索；护林员目标奖励急救包；动物目标奖励草药；安全路线目标解锁/补充路线勘察记录。

## 路线系统

配置位于 `DEEP_MOUNTAIN_ADVENTURE_ROUTES`。

| 路线 | 主要倾向 | 额外体力 | 解锁来源 |
| --- | --- | ---: | --- |
| 溪谷路线 `creekValley` | 溪流、动物、补给 | 0 | `deepMountain`，默认可用 |
| 密林路线 `denseForest` | 脚步声、白影、迷路、岔路 | 1 | `deepMountain`，默认可用 |
| 山脊路线 `mountainRidge` | 吊桥、暴雨、呼救、路线发现 | 3 | `ridgeTrail` |
| 废弃护林道 `abandonedRangerRoad` | 木屋、木箱、护林员、信件 | 2 | `watchtowerRoute` 或 `oldRangerStation` |

路线只乘算事件权重，不固定事件组合。准备页会显示风险/内容弱提示；未解锁路线禁用，并显示模糊解锁线索。

## 单次连续故事

每个 `trip` 新建临时数据：

```js
{
  goalId,
  routeId,
  eventFlags,
  goalProgress,
  storyBeats,
  backpack,
  loot
}
```

`eventFlags` 不进入长期存档。当前主要连续链：

1. 动物链：动物脚印 → 林中脚步 → 食物减少。
2. 白影链：异常脚步 → 白影回应 → 迷路引路 / 隐藏岔路。
3. 护林员链：废弃木屋 → 旧木箱 → 呼救与身份确认。
4. 安全路线链：暴雨 → 吊桥 → 隐藏岔路 → 返程路线闭合。

后续事件会读取前序 flag，改变气泡和结果文字；白影链还会根据 `whiteShadowTrust` 决定引路或保持距离。事件没有前置 flag 时仍可独立运行。

目标相关事件会提高权重。如果剩余 1–2 个事件时目标仍为零进展，系统只提高相关机会的权重，不强制事件，更不强制成功。

## 短期防重复

长期存档保存最近 8 趟：

```js
recentAdventureHistory: [{
  goalId,
  routeId,
  eventIds,
  outcomeType,
  createdAt
}]
```

同一目标再次游玩时，最近出现过的事件、相同事件位置和相同组合会降低权重，但核心事件不会被完全排除。

自动测试连续运行同一目标 24 趟，产生 24 个不同的有序事件组合，相邻完全重复为 0。

## 背包、战利品与关键物品

- `trip.backpack`：只保存出发携带物，严格最多 5 件。
- 鱼、料理、冒险物品统一按单件占 1 格，同种多个分别占格。
- `trip.loot`：途中发现物，不占出发背包容量。
- 冒险结束后，剩余携带物和 `loot` 返回各自仓库；鱼/料理仍回原 inventory，冒险物品回 adventure storage。
- `pendingBackpack` 和 `pendingLoot` 用于刷新/中断恢复。中断不会结算目标奖励。
- 封蜡信件直接写入 `discoveredKeyItems`，不占可携带背包。

当前关键推进链：

```text
山行提灯
→ 探查废弃木屋
→ 获得旧工具套组
→ 用工具处理溪流取得山纹旧钥匙，或直接撬旧木箱
→ 打开旧木箱
→ 首次归档封蜡信件
→ 解锁旧瞭望塔路线
```

钥匙完整开箱并消耗 1 把；工具套组强行撬箱、不消耗、额外消耗体力且奖励略差。同时携带时显式优先钥匙。

呼救事件中，攀登绳组负责抵达/拉人，急救包负责到达后处理伤口；同时携带可以连续生效。急救包可从木屋、成功救援和唯一物品重复替代池再次获得。

旧档一次性防卡死迁移字段：

```js
adventureStarterKitMigrationVersion: 1
```

旧档完全没有基础推进物品时，只补一次山行提灯、攀登绳组和干粮包；以后清空仓库不会再次补发。

## 当前冒险存档 v4

长期字段重点：

```js
adventure: {
  version: 4,
  storage,
  stamina,
  unlockedRoutes,
  discoveredKeyItems,
  discoveredClues,
  itemSolutionKnowledge,
  completedTrips,
  pendingBackpack,
  pendingLoot,
  recentAdventureHistory,
  lastLog
}
```

旧存档清洗会自动补 `discoveredClues` 和 `recentAdventureHistory`，保留原有路线、线索、仓库、体力与 pending 数据。

## 日志界面

主日志现在优先显示：

- 本次目标与完成状态。
- 所选路线。
- 冒险开头。
- 带连接词的连续事件叙述。
- 根据本趟真实 `eventFlags` 生成的目标结尾。
- 目标奖励。
- 物品、体力和路线账本。
- 与关键事件对应的既有日志插图。

原始事件记录保留在“查看事件原始记录”折叠区。

## 主要代码位置

- `index.html`：冒险入口、准备页和日志 DOM。
- `style.css`：深山场景、目标/路线卡片、日志、390×844 适配。
- `js/config/adventurePrototypeConfig.js`：物品、事件、目标、路线、结果和权重配置。
- `js/systems/gameAdventurePrototype.js`：存档清洗、准备、抽取、反应、连续链、结算、日志和中断恢复。
- `js/core/gameConfig.js`：默认游戏状态和 adventure v4 默认结构。
- `js/core/gameSave.js`：加载存档时调用 `sanitizeAdventureProgress`。
- `assets/adventure/deep-mountain/`：深山背景、前景、事件物件和物品图集。

## 验收脚本与结果

### 冒险目标/路线/故事

```powershell
node tools/tmp_adventure_story_acceptance.js
```

当前结果：18/18 通过。覆盖：

- 5 个目标与 4 条路线。
- 每路线 8,000 次首事件抽样。
- 每趟 5 个不重复事件。
- 4 条连续故事链。
- 同目标两种完成路径。
- 无关键物时部分推进。
- 24 趟同目标防重复。
- 故事开头、连续叙述和按实际 flag 生成结尾。
- 目标奖励进入 `trip.loot`。
- v3 → v4 旧档兼容。

### 冒险物品与中断回归

```powershell
node tools/tmp_adventure_item_acceptance.js
```

当前结果：44/44 通过。

### Camper 问卷模拟

```powershell
node tools/tmp_camper_quiz_simulation.js
```

该脚本用于 50,000 次问卷与 `baseTraits` 分布验收，未接入正式游戏加载。

### 语法检查

```powershell
Get-ChildItem js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

当前结果：32 个正式 JavaScript 文件全部通过。`git diff --check` 也通过。

## 本地运行与实际试玩

使用 HTTP，不要直接用 `file://`：

```powershell
node tools/serve.js 8080
```

打开：

```text
http://127.0.0.1:8080/index.html
```

已实际验证：

- 390×844 下目标和路线卡片可横向滚动。
- 未解锁路线禁用且提示可读。
- 目标、路线、5 格背包可以正常选择。
- 完整跑完 5 个不重复事件并生成故事日志。
- 原始事件记录默认折叠。
- 页面无 JavaScript error。
- 测试结束后已通过“重置测试”清理本地试玩状态。

控制台测试重置命令：

```js
resetDeepMountainAdventureTest()
```

## 工作树注意事项

当前 `git status` 包含多批尚未提交修改。尤其以下冒险 runtime 文件仍显示为 untracked，后续整理提交时不能漏掉：

- `assets/adventure/`
- `js/config/adventurePrototypeConfig.js`
- `js/systems/gameAdventurePrototype.js`
- `tools/tmp_adventure_item_acceptance.js`
- `tools/tmp_adventure_story_acceptance.js`

Camper 数据层文件和问卷模拟脚本也仍在同一工作树中。不要为了缩小冒险 diff 删除、reset 或覆盖这些内容。

## 已知限制与下一步建议

- 当前仍是深山单地点开发原型，12 个基础事件；路线是权重层，不是第二张场景地图。
- 路线/目标奖励平衡目前以可玩性验证为主，尚未经过长期玩家数据校准。
- 故事日志复用现有事件插图，没有为每个目标生成独立最终插画。
- 刷新中断会安全返还 `backpack` 与 `loot` 并结束本趟；不会恢复到事件中间。这是当前原型的预期行为。
- `PROJECT_BRIEF.md`、`TASK_LOG.md` 和 `TEST_BUILD_INSTRUCTIONS.md` 内仍有旧的“背包 8 件”等描述；本文件记录的是当前实现，后续应把这些文档同步为 5 件背包、目标/路线/故事系统和 adventure v4。
- 下一轮优先复测已有真实存档解锁 `ridgeTrail` / `watchtowerRoute` / `oldRangerStation` 后的路线按钮，并人工审阅所有故事链文案是否与物品结果一致。

