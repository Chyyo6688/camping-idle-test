# Adventure Goal Progress

最后更新：2026-07-13  
当前分支：`adventure-mode`  
总体状态：阶段 7 完成，阶段 8 进行中

本文件记录 `goal-objective.md` 中 8 个阶段的实际完成证据。阶段只有在代码、数据迁移、自动验收和真实页面回归均达到门槛后才标记完成。

## 阶段 1：深山路线差异与连续事件

状态：完成

### 完成内容

- 四条深山路线已有独立事件权重与配置化体力消耗。
- 四条路线新增配置化镜头位置、常驻环境层、开场文案、准备页取景、日志标题与日志插图取景。
- 动物链扩展为信任、普通追踪、受惊后食物失窃等分支。
- 白影链扩展为引路、旁观与误导分支，仍不确认白影身份。
- 连续事件结果继续只写入本趟 `eventFlags`；阶段 2 才完善长期 `mapState` 与跨地图记忆。

### 修改文件

- `js/config/adventure/maps/deepMountain.js`
- `js/systems/gameAdventurePrototype.js`
- `index.html`
- `style.css`
- `tools/tmp_adventure_story_acceptance.js`
- `project-info/ADVENTURE_GOAL_PROGRESS.md`

### 数据迁移

- 本阶段新增的路线表现均为配置，不新增存档字段。
- 新增动物与白影链字段只存在于当前 trip 的 `eventFlags`，不会污染长期存档或下一趟冒险。

### 验收结果

- `tools/tmp_adventure_story_acceptance.js`：25 / 25 通过，覆盖四路线表现配置、动物信任/失窃分支、白影引路/误导分支。
- `tools/tmp_adventure_item_acceptance.js`：44 / 44 通过，背包、loot、来源返还、唯一物品与中断保护保持正常。
- 真实页面完成密林 5 / 5 事件闭环；日志保留密林专属开场、标题、插图取景、真实获得/消耗/丢失明细。
- 刷新中断恢复：密林路线与“树林中的白影”契机快照保持；背包恢复为 0 / 5；攀登绳组只返还一份；旧 trip 安全清除。
- `390×844` 页面回归：页面 `clientWidth` 与 `scrollWidth` 均为 390；只读契机、背包与准备面板无横向溢出；路线列表保持预期横向滚动；手动目标 UI 数量为 0。
- 浏览器控制台脚本错误：0。
- `node --check`：冒险系统与深山地图配置通过。
- `git diff --check`：通过。

### 已知问题

- 阶段 2 的长期重复相遇阶段尚未接入，本阶段只保证单趟连续事件差异。

### 下一阶段入口

- 已进入阶段 2，并完成深山长期状态、Camper 记忆与近期防重复。

## 阶段 2：深山长期个性化

状态：完成

### 完成内容

- `mapStates.deepMountain` 现包含桥梁状态、三阶段木屋搜索、护林员线索、动物/白影信任与相遇次数、逐事件重复次数。
- `adventureMemories` 只保留可跨地图复用的救援、异常、严重跌落、动物信任、受白影惊吓和最近使用工具。
- 深山地图配置负责本地状态 sanitize、结算推进、未完经历契机权重和重复相遇文案；通用引擎只调用地图接口。
- 出发时保存 `mapStateSnapshot` 与 `adventureMemorySnapshot`，本趟 `eventFlags` 不污染长期状态，长期状态只在结算时更新。
- 吊桥、木屋、动物、白影具备再次和多次相遇的气泡/结果变化；修好的桥和熟悉的木屋还能降低旧危险结果。
- 自动契机会优先未结束的白影、木屋、护林员、动物或吊桥经历；同路线近期事件、相同事件位置和已经结束的契机都会降权。

### 修改文件

- `js/config/adventure/adventureItems.js`
- `js/config/adventure/maps/deepMountain.js`
- `js/systems/gameAdventurePrototype.js`
- `tools/tmp_adventure_story_acceptance.js`
- `tools/tmp_adventure_item_acceptance.js`
- `project-info/ADVENTURE_SYSTEM.md`
- `project-info/HANDOFF.md`
- `project-info/ADVENTURE_GOAL_PROGRESS.md`

### 数据迁移

- adventure 存档升级为 v5，确保现有 v4 存档进入 sanitize。
- 旧 `cabinSearched: true` 迁移为搜索阶段 1；合法的桥梁、线索、信任、相遇和 Camper 记忆值保留。
- 所有长期计数和信任值设有上下限；未知重复事件 id 会被忽略，不重置仓库、体力、路线、pending backpack 或 pending loot。

### 验收结果

- 故事/长期状态自动验收：33 / 33 通过。
- 物品、backpack、loot、Storage 与中断自动验收：44 / 44 通过。
- 真实页面连续完成两趟密林冒险：第一趟留下未修吊桥，下一趟自动契机显示“那座旧吊桥仍在山风里摇晃”；第二趟遇见白影后，下一次准备页显示“白影已经不止一次出现在熟悉的路口”，来源为 `mapState`。
- 同一路线第二趟事件组合与第一趟不同，白影态度继续影响后续迷路事件。
- `390×844`：个性化长文案、准备面板和只读契机无横向溢出，页面宽度 390 / 390。
- 浏览器控制台脚本错误：0。
- JavaScript 语法与 `git diff --check` 在阶段收口检查中通过。

### 已知问题

- 当前只有 12 个基础事件；更多本地事件链、天气/时段变体与奖励平衡属于阶段 3。
- 现有跨地图记忆已能安全记录，但要到第二张地图接入后才能验证真正的跨地图反应。

### 下一阶段入口

- 将深山扩充为 20-25 个基础事件、4-6 条连续事件链，补天气/时段变体与当地奖励循环。

## 阶段 3：深山正式第一版内容

状态：完成

### 完成内容

- 深山由 12 个扩充到 22 个基础事件；每个事件都有 4 个加权反应和 `rareGood / good / mixed / bad / rareBad` 五档结果。
- 新增晨雾、山脊风、倒伏路标、巡查笔记、受困动物、发光菌环、溪边补给箱、旧水位尺、瞭望塔信号和夜间回声。
- 当地链达到 6 条：动物、白影、护林设施、安全路线、溪流旧设施、瞭望塔信号。
- 新增 `dawn`、`windy`、`night` 三种实际氛围层；继续复用深山既有场景图块，没有新增素材负担。
- 12 种既有物品全部保持原职责，并在新增事件中获得地图、提灯、绳组、工具、钥匙、指南针、护符、木章、鱼和料理等新用途。
- 保持封蜡信件作为旧瞭望塔路线的唯一正式解锁来源；高处信号只提供定位与故事，不越权解锁。

### 修改文件

- `js/config/adventure/maps/deepMountain.js`
- `js/systems/gameAdventurePrototype.js`
- `style.css`
- `tools/tmp_adventure_story_acceptance.js`
- `project-info/ADVENTURE_SYSTEM.md`
- `project-info/ADVENTURE_GOAL_PROGRESS.md`

### 数据迁移

- 本阶段没有新增长期存档字段；新增事件重复次数自动进入既有 `recurringEncounters`，v5 sanitize 会按当前地图事件表接受这些 id。
- 新增事件只写本趟 flags，仍在结束结算后才更新地图状态或少量 Camper 记忆。

### 验收结果

- 故事、路线分布、事件规模、五档结果、物品效果与 6 条链：44 / 44 通过。
- 物品、唯一奖励、backpack、loot、Storage、中断恢复：44 / 44 通过。
- 真实溪谷 5 / 5：命中晨雾和受困动物；提灯未消耗生效，动物脚印接入套索救援，日志结尾引用真实链结果。
- 真实山脊 5 / 5：命中山脊风与夜间回声；页面实际出现 `is-windy` 和 `is-night` 氛围类，绳组修桥和长期动物脚印文案保持正常。
- `390×844`：完整 5 事件日志、账本和按钮无横向溢出；页面宽度 390 / 390，事件列表宽 350 / 350。
- 浏览器控制台脚本错误：0。
- JavaScript 语法与 `git diff --check`：通过。

### 已知问题

- 当前地图入口仍直接进入深山准备页；阶段 4 需要加入地图选择与返回。
- 雾雨林尚未注册，地图选择阶段只建立可扩展流程和锁定预览，不提前制作第二张地图内容。

### 下一阶段入口

- 实现地图选择页、地图卡片状态、返回地图选择和注册驱动的准备流程。

## 阶段 4：多地图选择与返回

状态：完成

### 完成内容

- 新增注册表驱动的地图选择页，当前展示可进入的深山和不可进入的雾雨林低剧透预览。
- 玩家先选择地图，再进入该地图的路线与背包准备；准备页和日志页都可返回地图选择。
- 地图卡从配置读取名称、简介、提示、缩略图、路线数和事件数，不在通用引擎按地图 id 拼 UI。
- `isAdventureMapPlayable` 与 `isAdventureMapUnlocked` 分开判断内容是否可运行和玩家是否已经解锁。
- 新增通用 `unlockMap` 结算；新地图完成内容后可由普通地图条件、物品或事件解锁，不依赖跨地图暗线。
- 地图场景、路线、事件、Hook、地点、物品解法和本地状态均通过地图注册读取；深山仍可随时返回。
- 每张地图拥有独立 `mapStates[mapId]`；体力、背包、Storage、近期历史和 Camper 记忆继续属于共享 adventure 存档。

### 修改文件

- `index.html`
- `style.css`
- `js/config/adventure/adventureMaps.js`
- `js/config/adventure/maps/deepMountain.js`
- `js/config/adventure/maps/fogRainforest.js`
- `js/systems/gameAdventurePrototype.js`
- `tools/tmp_adventure_story_acceptance.js`
- `project-info/ADVENTURE_SYSTEM.md`
- `project-info/ADVENTURE_GOAL_PROGRESS.md`

### 数据迁移

- v5 存档已包含 `unlockedMaps`；sanitize 保留所有已注册地图 id，并确保默认深山始终存在。
- `mapStates` 按注册地图分别补默认值和 sanitize，不把深山字段复制到其他地图。
- pending trip 与旧日志中的未知或不可玩地图安全回落深山；backpack、loot 和已结算内容不重置。

### 验收结果

- 自动验收覆盖：注册表包含深山和雾雨林预览、两张地图状态对象互相隔离、共享体力/Storage/记忆存在、通用引擎无地图 id 分叉、临时注册第二张可玩地图后不复制状态机且仍可返回深山。
- 真实页面：地图选择页显示深山可进入、雾雨林禁用和模糊提示；选择深山后进入路线与 5 格背包准备；准备页可返回地图选择。
- 深山完整 5 / 5 后日志显示“再次前往此地图”“选择其他地图”和“返回营地”，结算仍保持正确。
- `390×844`：地图与准备流程页面宽度 390 / 390，无全局横向溢出；卡片长文案无截断或重叠。
- 浏览器控制台 JavaScript 错误：0。
- 故事/地图自动验收、物品与中断验收、全部 JavaScript 语法和 `git diff --check` 在阶段收口时通过。

### 已知问题

- 雾雨林在本阶段故意保持锁定注册壳；没有路线、事件或正式场景素材。
- 地图解锁通用结算已存在，但要在阶段 5 内容可玩后才能做真实的深山到雨林解锁与往返闭环。

### 下一阶段入口

- 使用现有地图注册和通用引擎实现雾雨林 3-4 条路线、15-20 个事件、3-4 条当地链、湿气机制与当地物品循环。

## 阶段 5：雾雨林第一版

状态：完成

### 完成内容

- 雾雨林由注册壳升级为完整可玩地图，复用现有地图选择、路线准备、自动事件、结算、日志和刷新恢复流程。
- 4 条路线分别为河岸湿地、藤蔓密径、树冠旧路和废弃调查区；前两条随地图开放，后两条由当地路线发现解锁。
- 18 个基础事件全部具有 4 个加权反应、五档结果、实际后果、场景道具和缺少物品反馈。
- 4 条当地连续事件链可贯通：泥水/洪水漂流物/补给箱、发光植物/孢子云/树冠兰花、藤墙/变化藤蔓/树冠步道、调查站/天气终端/调查笔记或信标。
- `rainforestMoisture` 作为本趟湿润度机制保存在 `eventFlags`，改变水位、孢子和树冠事件权重及故事上下文，不进入 HUD 或长期地图状态。
- 当地长期状态独立保存路线潮湿、藤蔓路线阶段、调查站研究阶段、虫群压力、湿地知识、植物研究和重复事件次数。
- 新增藤切刀、驱虫叶露、微光孢子、压叶标本、调查站通行牌和苔纹雨披 6 种当地物品与独立图集。
- 普通完成 2 趟冒险或深山护林员线索达到 2 均可解锁雾雨林；不依赖暗线。地图开放后默认路线不需要额外伪造同名路线记录。
- 自动契机允许偏离，但雾雨林配置降低无关路线 Hook 初始权重，河岸不会频繁以树冠藤蔓作为出发主题。

### 修改文件

- `assets/adventure/fog-rainforest/*`
- `js/config/adventure/adventureItems.js`
- `js/config/adventure/maps/deepMountain.js`
- `js/config/adventure/maps/fogRainforest.js`
- `js/systems/gameAdventurePrototype.js`
- `style.css`
- `tools/tmp_adventure_item_acceptance.js`
- `tools/tmp_adventure_story_acceptance.js`
- `tools/tmp_adventure_rainforest_acceptance.js`
- `project-info/ADVENTURE_SYSTEM.md`
- `project-info/ASSET_MANIFEST.md`
- `project-info/ADVENTURE_GOAL_PROGRESS.md`

### 数据迁移

- adventure 存档升级为 v6；v5 存档补齐 `mapStates.fogRainforest` 和新增物品规则，保留深山状态、解锁、仓库、体力、近期历史、pending backpack 与 pending loot。
- 深山 `itemPool` 改为显式 12 项，避免 6 种雨林当地物品自动混入深山池。
- 雨林长期字段全部有上下限，未知重复事件 id 会被忽略；本趟湿润度不会写入长期地图状态。

### 验收结果

- 既有物品与中断验收：50 / 50 通过；深山故事与多地图验收：54 / 54 通过。
- 雾雨林专属验收：31 / 31 通过，四路线共完成 24,000 次事件首抽，并多轮重复运行验证分布稳定；全部 18 事件均被覆盖。
- 手动贯通 4 条雨林当地链；事件 flags、故事上下文、Hook 结尾和长期地图状态均接入同一通用引擎。
- 真实页面从深山完成普通冒险后解锁雾雨林，地图卡由“尚未开放”变为“4 条路线 · 18 种沿途事件”，深山仍可返回。
- 真实雾雨林河岸湿地进入、事件和体力耗尽日志闭环通过；背景、透明前景与泡水补给箱事件图块均实际加载，日志使用故事化“暂时没有找到/途中出现别的发现”语气。
- 刷新中断真实回归：雾雨林地图、河岸路线和 Hook 快照保持；攀登绳组安全回到仓库且仍为 `×1`；背包回到 0 / 5，没有吞掉或复制。
- `390×844`：页面宽度 390 / 390，无全局横向溢出；路线区域保持预期横向滑动，标题、契机、体力和背包没有重叠。跨地图进入准备页时滚动位置会归零。
- 浏览器控制台 JavaScript 错误：0。
- 新旧冒险 JavaScript 语法与 `git diff --check`：通过。

### 已知问题

- 雾雨林当前只消费自身当地状态；跨地图 Camper 记忆、深山物品新反应和雨林物品回到深山后的新用途属于阶段 6。
- 三叶石纹和错误记忆空地只作为可忽略气氛碎片，不写入完整暗线推进或揭示“回途”。

### 下一阶段入口

- 接入跨地图经历、少量旧物新用途和旧地图返场变化；不新增第三张地图，不让暗线成为解锁门槛。

## 阶段 6：跨地图经历与返场

状态：完成

### 完成内容

- 新增三个有边界的共享 Camper 经历：`canopyCrossings`、`stationRecordsRecovered` 和 `sharedSymbolEncounters`；雨林只在整趟结算时通过通用地图回调写入，不把普通事件明细永久化。
- 深山的严重跌落、救援经历、异常相遇和动物信任分别影响雨林树冠步道、遗失信标、三叶石纹/错误记忆空地和蛙鸣气泡；高处受伤经验还会让极坏结果收敛为谨慎处理中止。
- 雨林树冠、调查站记录和共同符号经历返场后，分别改变深山吊桥、护林笔记和发光菌环的气泡与故事结果。
- 苔纹雨披带回深山后可以保护暴雨中的背包；藤切刀可以安全割开深山废弃套索。两个分支都有专属结果和日志，并优先于旧通用工具。
- 两张地图的相似日期缺口、设施受力方式和符号只形成可关联细节；代码和玩家文案不揭示“回途”，不确认单一答案，也不参与地图解锁。
- 通用记忆结算通过地图可选 `applyTripMemories` 回调扩展；引擎没有新增雾雨林 id 特判。

### 修改文件

- `js/config/adventure/adventureItems.js`
- `js/config/adventure/maps/deepMountain.js`
- `js/config/adventure/maps/fogRainforest.js`
- `js/systems/gameAdventurePrototype.js`
- `tools/tmp_adventure_item_acceptance.js`
- `tools/tmp_adventure_story_acceptance.js`
- `tools/tmp_adventure_rainforest_acceptance.js`
- `project-info/ADVENTURE_SYSTEM.md`
- `project-info/ADVENTURE_GOAL_PROGRESS.md`

### 数据迁移

- adventure 存档升级为 v7；v6 及更早存档在 sanitize 时把三个新经历补为 0，已有 Camper 记忆、两张地图状态、仓库、体力、解锁、近期历史、pending backpack 与 pending loot 全部保留。
- 三个新经历统一限制在 0–99；地图回调写入后仍由通用 `sanitizeAdventureMemories` 收敛。
- `mapStates.deepMountain` 与 `mapStates.fogRainforest` 没有新增互相引用。跨地图影响只读取出发时的 `adventureMemorySnapshot`，本趟中途不会换故事上下文。

### 验收结果

- 物品、backpack、loot、Storage 与中断验收：53 / 53 通过；新增雨披和藤切刀返场解法实际命中，且两件物品不在深山掉落池。
- 深山故事、长期状态与多地图验收：56 / 56 通过；雨林三类经历返场命中吊桥、笔记和菌环，文案保留不确定性。
- 雾雨林专属验收：34 / 34 通过；深山四类经历影响雨林气泡，雨林结算写入共享记忆但不污染深山当地状态，v5 旧档迁移保持库存和两地图状态。
- 三套脚本均退出码 0；修改涉及的四个正式 JavaScript 文件通过 `node --check`。

### 已知问题

- 当前跨地图内容刻意保持少量，不建立完整暗线进度树，也没有让所有物品在每张地图都有用途。
- 跨地图变体仍使用单人 Camper 快照；成员分别观察异常与贡献物品属于阶段 7。

### 下一阶段入口

- 在现有单人 trip 字段上实现本地 1–3 人事件分工、镜头参与平衡、物品所有者、个人观察和高光总结；不接网络、好友账号或多人 UI。

## 阶段 7：本地多人事件引擎原型

状态：完成

### 完成内容

- 新增纯数据模块 `adventureParty.js`，本地支持单人、2 人和最多 3 人；长期数据上限仍保留 4 人，不新增队伍 UI。
- 行动者先按事件反应与个人 traits 匹配，再按既有主导次数平衡；五事件三人模拟中每人至少主导一次，不会由同一 Camper 垄断镜头。
- 事件反应与结果读取行动者自己的 traits 和每日运势快照，不做团队 traits 相加。
- 协助者最多 2 人；物品所有者可以不同于行动者，组合物品可以来自两位队友，`contributorIds` 记录全部贡献者。
- 深山白影/护林笔记/吊桥与雨林错误记忆空地/三叶石纹/遗失信标提供个人观察配置；traits 与相关记忆可产生不同细节。
- 团队事件日志保存参与文案和个人观察，每位 Camper 获得行动、协助、物品贡献与观察高光。
- 新增不写存档、不结算物品的 `simulateLocalAdventurePartyTest()` Console 入口。
- 新增真实联机数据与 API 需求文档，但没有选择后端或实现网络能力。

### 修改文件

- `index.html`
- `js/config/adventure/adventureItems.js`
- `js/config/adventure/maps/deepMountain.js`
- `js/config/adventure/maps/fogRainforest.js`
- `js/systems/adventure/adventureParty.js`
- `js/systems/gameAdventurePrototype.js`
- `tools/tmp_adventure_item_acceptance.js`
- `tools/tmp_adventure_story_acceptance.js`
- `tools/tmp_adventure_rainforest_acceptance.js`
- `tools/tmp_adventure_multiplayer_acceptance.js`
- `project-info/ADVENTURE_SYSTEM.md`
- `project-info/ADVENTURE_GOAL_PROGRESS.md`
- `project-info/ADVENTURE_MULTIPLAYER_API_REQUIREMENTS.md`

### 数据迁移

- adventure 存档升级为 v8。旧日志缺少的 `participants`、`participantHighlights`、`participantObservations` 和参与分工字段安全补为空数组、空文本或 `localCamper` / `auto` 默认值。
- 当前 trip 的单人参与者现在也保存完整 traits、运势、记忆和携带物 key 快照；不新增 adventure 顶层队伍存档，也不改变 backpack、loot 或 Storage 所有权。
- 本地 mock 队伍只存在于模拟对象，`simulateLocalAdventurePartyTest()` 不写 `gameState`。

### 验收结果

- 阶段 7 专属验收：19 / 19 通过，覆盖单人兼容、1/2/3 人、性格匹配、五事件镜头平衡、双协助者、跨成员组合物品、traits/记忆独立观察、个人高光、旧日志兼容和纯本地边界。
- 三人五事件主导次数为 2 / 2 / 1；1,200 次单事件抽样中，高观察 Camper 显著高于中/低观察候选。
- 既有物品 53 / 53、深山故事 56 / 56、雾雨林 34 / 34 全部继续通过；四套脚本合计 162 / 162。
- 队伍模块不包含 `fetch`、WebSocket、WebRTC、EventSource 或 DOM 调用。

### 已知问题

- 当前页面仍只创建单人 trip；2–3 人由本地模拟函数或测试注入。没有好友、邀请、准备、队伍可视化、聊天或网络恢复。
- 公共 loot 分配、离队/超时和第 4 名成员的真实体验留给联机阶段，需求边界已记录但未实现。

### 下一阶段入口

- 执行新档、旧档、异常档、双地图往返、刷新中断、日志刷新、唯一物品、路线解锁、离线体力、本地 2–3 人和 390×844 的最终整体回归。

## 阶段 8：最终回归与文档

状态：完成

### 已完成的自动回归

- 新增最终状态验收 13 / 13，覆盖新档、v2 旧档、已迁移空 Adventure Storage 异常档、非法数量清洗、离线体力余量与上限、旧 goal 日志刷新迁移、双地图解锁/返回、进阶路线锁定、地图状态隔离和中断幂等返还。
- 五套冒险验收当前合计 175 / 175，全部退出码 0。
- 所有正式 `js/**/*.js` 已通过 `node --check`。
- 统一设计、阶段进度、资源清单、测试说明、交接文档和未来联机 API 需求已更新到 V4.9 / adventure v8。

### 补充回归

- 2026-07-13 已通过 `http://localhost:5177` 完成新一轮真实页面回归；冒险中心、日志、路线图、线索整理、烹饪与伤势界面均在 `390×844` 下复核。
- 直接产品页宽度为 390 / 390，Browser Console error 为 0；阶段 8 的浏览器阻塞已解除。

## 阶段 9：冒险中心、故事归档、烹饪与伤势

状态：完成

### 完成内容

- 主界面收束为单一“冒险”入口；冒险中心统一提供地图出发、当前体力、Adventure Storage 和冒险日记。
- 冒险日记长期保存每趟旅程，并按地图、路线、Hook、事件、线索、得失、关键物品、菜谱、原料、伤势与治疗展示；故事档案只保存玩家已经整理完成的故事。
- Hook 与路线图故事均使用收集、待整理、已归档三态。线索收齐后不再自动完成，玩家可拖动或点击编号排序；错误顺序不扣除内容，正确后才生成完整故事、发放解锁并归档。
- 路线图首次生成改为结算页渲染完成后设置 `pendingKeyItemReveal` 并打开公共 `openAdventureKeyItem("dampRouteMap")`；成功打开或关闭后才记录已查看。日志与雾雨林地图卡复用同一入口。
- 料理改为选择已解锁菜谱、查看材料、选择鱼类或替代原料、调整数量后制作。地图配置声明菜谱来源，故事菜谱归档必得；探索菜谱第 3 次符合路线显著加权，第 4 次保证出现。
- 明确事件可以产生扭伤、割伤、抓伤、虫咬红肿和擦伤；伤势只存在于本趟，显示标签、影响与后续反馈。急救包处理伤势并防止恶化，干粮只恢复疲劳、饥饿和低体力。
- 新增 `testAdventureInjury(type)` Console 入口，以及覆盖路线图整理、故事菜谱、探索保底、烹饪扣除和伤势治疗的专项验收脚本。Console 注入伤势没有当前事件物件时，急救动画会使用 Camper 位置作为回退坐标。

### 数据迁移

- adventure 存档升级为 v10，sanitize 补齐 `storyStates`、`journeyLogs`、`pendingKeyItemReveal`、`revealedKeyItems` 和 `recipeDiscoveryPity`，旧旅程日志、背包、loot、Storage、地图、线索、原料与菜谱均保留。
- 已解锁雾雨林的旧档不会重新锁回；其路线图故事会幂等迁移为已归档，避免刷新后重复弹出关键物品或重复发放奖励。
- 菜谱解锁、故事归档、关键物品生成与 pending backpack/loot 继续使用唯一 id 和完整结算校验，刷新或中断不重复获得也不吞库存。

### 自动验收

- 物品 56 / 56、深山故事 56 / 56、雾雨林 36 / 36、最终状态 19 / 19、本地多人 19 / 19、本轮专项 12 / 12，六套脚本合计 198 / 198，均退出码 0。
- 仓库覆盖层、烹饪关闭按钮和无当前事件物件时的急救动画在真实页面回归中发现并修复。
- 全仓库 JavaScript 已通过 `node --check`，`git diff --check` 通过。
- `390×844` 下冒险中心、日记、线索排序、路线图和烹饪 UI 无全局横向溢出；直接产品页 Browser Console error 为 0。
