# Adventure Mode Handoff

最后更新：2026-07-13
当前分支：`adventure-mode`
应用版本：V4.9
冒险存档：v8

## 工作树规则

- 当前所有修改都保留在 `adventure-mode`，尚未 commit、push 或 deploy。
- 不要切分支，不要 reset、clean、checkout 或覆盖用户现有修改。
- 项目仍是纯静态浏览器游戏；入口为根目录 `index.html`。
- 统一设计依据为 `project-info/ADVENTURE_SYSTEM.md`，阶段证据见 `project-info/ADVENTURE_GOAL_PROGRESS.md`。

## 当前玩法

```text
营地准备
→ 选择地图与路线
→ 查看系统自动生成的只读 adventureHook
→ 整理最多 5 件物品
→ 自动经历最多 5 个事件
→ 获得、消耗、丢失或解锁
→ 返回营地查看完整日志
→ backpack 与 loot 进入正确库存
```

玩家不手动选择传统任务目标。深山旧 `goals` 只作为 `adventureHooks` 兼容别名；准备页没有目标卡片、目标选中状态或目标校验。

## 两张地图

### 深山

- 4 条路线：溪谷、密林、山脊、废弃护林道。
- 5 个自动 Hook、22 个基础事件、6 条当地连续链。
- 当地状态：吊桥、三阶段木屋、护林员线索、动物/白影信任与相遇、逐事件重复次数。
- 12 种深山当地物品；唯一物品、路线解锁和替代奖励均有明确规则。

### 雾雨林

- 4 条路线：河岸湿地、藤蔓密径、树冠旧路、废弃调查区。
- 4 个自动 Hook、18 个基础事件、4 条当地连续链。
- 本趟湿润度只存 `eventFlags.rainforestMoisture`；长期保存藤蔓、调查站、虫群、湿地与植物研究状态。
- 6 种当地物品与独立场景/事件/物品图集。
- 普通完成 2 趟冒险或深山护林员线索达到 2 可解锁，不依赖跨地图暗线。

解锁雾雨林后仍可返回深山。地图场景、路线、事件、Hook、当地状态和物品池来自注册配置；通用引擎没有按地图 id 复制状态机。

## 三种数据生命周期

`trip.eventFlags` / `storyBeats`：只属于本趟，下一趟不继承。

`mapStates[mapId]`：属于地点。深山与雾雨林状态完全隔离。

`adventureMemories`：跟随 Camper 跨地图共享，包括救援、异常相遇、严重跌落、动物信任、树冠通行、调查站记录、共同符号和最近使用工具。

出发时 trip 保存 `mapStateSnapshot` 与 `adventureMemorySnapshot`；长期状态只在整趟结算时推进。

## 跨地图返场

- 深山跌落、救援、异常和动物经历会改变雨林树冠、信标、符号/错误记忆空地和蛙鸣气泡。
- 雨林树冠、调查站记录和共同符号经历会改变深山吊桥、护林笔记和菌环观察。
- 雨林藤切刀可处理深山废弃套索；苔纹雨披可保护深山暴雨中的背包。
- 这些内容只形成可忽略的相似细节，不揭示“回途”，不成为地图解锁门槛。

## 物品与恢复

- 出发背包严格 5 格；鱼、料理和冒险物品统一占格。
- `trip.backpack` 与 `trip.loot` 分离；loot 不占出发容量。
- 结束后鱼回鱼、料理回料理、冒险物品回 Adventure Storage。
- `pendingBackpack`、`pendingLoot` 和 `pendingTripSnapshot` 保护刷新/中断；恢复只返还一次，不提前结算奖励。
- 体力上限 100，每 14.4 分钟恢复 1；路线额外消耗来自配置。

## 本地队伍原型

`js/systems/adventure/adventureParty.js` 支持本地单人、2 人和最多 3 人模拟；长期数据上限保留 4 人。

- 行动者按事件与个人 traits 匹配，并平衡五事件镜头。
- 反应和结果读取行动者自己的快照，不叠加团队 traits。
- 协助者最多 2 人；物品所有者可以不同于行动者。
- 事件保存 `participants`、`actorCamperId`、`helperCamperIds`、`itemOwnerId`、`contributorIds`、`decisionSource` 和个人观察。
- 每位 Camper 生成行动、协助、物品和观察高光。
- `simulateLocalAdventurePartyTest({ size: 3 })` 不写存档、不结算物品。

当前页面仍只创建单人 trip。没有好友、邀请、队伍 UI、账号、聊天、网络房间或真实联机。未来 API 边界见 `project-info/ADVENTURE_MULTIPLAYER_API_REQUIREMENTS.md`。

## 主要文件

- `js/config/adventure/adventureItems.js`：共享常量、18 种物品、存档版本。
- `js/config/adventure/adventureMaps.js`：地图注册表。
- `js/config/adventure/maps/deepMountain.js`：深山内容与当地回调。
- `js/config/adventure/maps/fogRainforest.js`：雾雨林内容与当地回调。
- `js/systems/adventure/adventureParty.js`：本地队伍分工与日志数据。
- `js/systems/gameAdventurePrototype.js`：通用准备、事件、体力、结算、日志、恢复与 UI。
- `style.css`：两张地图、路线、事件与移动端表现。
- `project-info/ADVENTURE_SYSTEM.md`：长期设计依据。

## 验收入口

```bash
node tools/tmp_adventure_item_acceptance.js
node tools/tmp_adventure_story_acceptance.js
node tools/tmp_adventure_rainforest_acceptance.js
node tools/tmp_adventure_multiplayer_acceptance.js
node tools/tmp_adventure_final_acceptance.js
```

当前结果分别为 53/53、56/56、34/34、19/19、13/13。详细浏览器和命令步骤见 `project-info/TEST_BUILD_INSTRUCTIONS.md`。

## 已知边界

- 进行中刷新会安全返还物品并结束本趟，不恢复到事件动画中间。
- 本地 2–3 人只有数据/日志模拟，没有当前玩家可见队伍流程。
- 暗线没有完整进度树、白影身份或最终结局。
- 主游戏仍有一个既有缺失电影海报资源 404，与冒险系统无关。
- 下一次内容开发不应新增第三张地图或真实联机，除非先明确开启新阶段。
