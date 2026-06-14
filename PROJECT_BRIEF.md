# Cozy Camping Idle - Project Brief

## 当前版本

当前测试版本为 V2.5。

V2.5 是一次收尾版本，重点是同步发布包和整理 handoff 状态，不新增玩法系统。当前 `share-build/` 应作为给朋友测试或上传静态托管的基准版本。

## 游戏定位

这是一个竖屏、scene-first 的 cozy camping idle / management game。玩家观看一个小人在湖边营地自动生活，不直接控制角色移动。玩家的主要操作是切换 `Gather Wood` 模式、购买装备、升级篝火，并观察营地慢慢变得更舒适。

目标不是网页 clicker，也不是角色探索游戏。campsite 场景是主角，UI 只作为轻量浮层。

## 当前玩法循环

1. 地面随机生成 `wood item`。
2. `Gather Wood` 开启时，camper 会自动走向木头、捡起木头、带到 campfire。
3. camper 把木头投入 campfire 后增加 `warmthSeconds`。
4. `warmthSeconds > 0` 时，campfire 每秒产生 Cozy Points。
5. 玩家用 Cozy Points 购买装备或升级 campfire。
6. 装备增加 Comfort、解锁 Night Mode，或改善营地视觉氛围。

Wood 不显示在顶部资源栏，也不是货币。它只是自动行为链路里的场景物。

## 新玩家开局

清空存档后，新玩家只应看到：

- Level 1 campfire，初始 `warmthSeconds = 0`，所以是熄灭状态。
- 散落的 `wood items`。
- 已拥有并装备的 Backpacking Tent。
- 基础环境装饰：`crate`、`woodpile`、`stump`。

其他购买型装备必须通过 shop 购买后才显示在 campsite。

## 资源系统

- `cozyPoints`: 主要货币，只在 campfire 燃烧时产生。
- `comfort`: 营地属性，不可花费，由 tent 和装备提供，并轻微提高 Cozy Points 产出倍率。
- `warmthSeconds`: campfire 剩余燃烧时间，由 camper 添加木头增加，随时间消耗。

## 装备数据结构

普通购买型装备使用通用数组保存：

```js
ownedEquipment = ["table", "chair", "lantern"];
```

不要继续给每个新装备添加 `hasX` 主字段。旧字段只在 `sanitizeSave()` 中迁移兼容。

装备配置集中在 `equipmentData` registry，包含：

- `name`
- `cost`
- `comfort`
- `detail`
- `button`
- `sceneElement`
- `requires`
- `unlocksNight`
- `status`

当前依赖规则：

- `kettle` requires `table`
- `stove` requires `table`
- `lantern` unlocks Night Mode

## Camper 自动行为

camper 使用简单 state machine：

- `state`: `idle` / `moving` / `acting`
- `pose`: 当前图片语义
- `target`: 移动目标
- `actionAfterArrival`: 到达后执行的行为
- `actionTimer`: 当前移动或行为结束时间

重要规则：移动中只能使用 `walking` 或 `carryingWood` pose。到达目标后才切换成 `lookingLakeBack`、`sittingGround`、`sittingChair`、`resting`、`tentRest` 等 activity pose。

## UI 方向

- 固定 9:16 mobile-like `game-viewport`。
- 顶部紧凑 status bar 显示 Cozy Points、Comfort、Warmth。
- `Gather Wood` 和 Day/Night 是右上角小模式按钮。
- Shop 是底部 floating action button。
- Mobile shop 使用 bottom sheet，打开时 `.scene-content` 上移，让 campfire、tent、camper 和购买后的装备仍可见。
- V2.4 后，系统提示改为自动淡出的 toast，不再长期占据底部或顶部空间。
- V2.5 后，Shop UI 更克制：`SHOP` 标题缩小，tabs 为内容自适应横向滚动，商品卡和 Campfire featured card 使用轻阴影，section title 与 card spacing 已整理。
- Reset Save 是小型 debug/settings 控件，不是核心游戏按钮。

## Day / Night

游戏从白天开始。Night Mode 默认锁定。购买 Lantern 后：

- `nightUnlocked = true`
- 显示 Day / Night 按钮
- 可切换 `isNight`
- day/night 只改变光影和背景氛围，不改变场景布局

## Asset-Driven 原则

核心物件通过独立 PNG asset 显示，代码只负责加载路径、显示/隐藏、切换状态、定位和动画状态。

不要把 tent、campfire、chair、lantern、camper 等核心对象烘焙进同一张背景图。它们应保持独立透明 PNG 文件，便于后续替换素材。

V2.4 尝试用内置 imagegen 生成透明 sprite sheet，但输出文件是 RGB，没有 alpha 通道，所以没有导入项目，避免再次引入不干净边缘。后续需要使用真正原生透明 PNG 资源替换当前临时或红边素材。

V2.5 状态：

- Campfire asset 已手动恢复为稳定旧版本，后续不要自动覆盖 `assets/campfire/*`。
- 角色 walk / sit / look lake 相关资源暂时冻结，等待用户准备最终 PNG 后再替换。
- 后续替换资源前，应先生成 review sheet 供用户确认，不要直接覆盖正式 gameplay asset。

## 分享测试

`share-build/` 是可部署的纯静态测试包。它只需要：

- `index.html`
- `style.css`
- `game.js`
- `assets/`

不需要后端、登录、API、云存档、analytics 或 tracking。游戏进度只保存在浏览器 `localStorage`。

V2.5 已将当前 dev 版本同步到 `share-build/`，并排除 reference、generated_sources、review sheet、preview 图和开发临时文件。
