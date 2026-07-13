# Cozy Camping Idle - Project Brief

## 当前状态

- 当前入口版本：V4.8，见 `index.html` 里的 `window.APP_VERSION = "4.8"`。
- 项目形态：纯静态浏览器游戏；没有 `package.json`、lockfile、bundler 配置、后端或安装步骤。
- 运行文件：`index.html`、`style.css`、`js/` 下的 catalog/manager 与游戏模块、`assets/`。
- 脚本加载顺序由 `index.html` 的 `gameScripts` 数组维护：先加载 catalog/manager，再按依赖加载游戏模块，最后加载入口 `game.js`。
- 发布时直接把当前根目录静态包上传到 GitHub。
- 游戏逻辑按职责拆分在 `js/config/`、`js/core/`、`js/systems/` 和 `js/camper/`；`js/core/game.js` 只保留主循环、事件绑定和初始化。

## 游戏方向

竖屏 cozy camping idle / management game。营地场景是主角，UI 只做轻量浮层。

核心循环：

1. 场景中生成 fallen branches。
2. Gather 模式或手动点击让 camper 去捡木头。
3. 木头增加 campfire 的 `warmthSeconds`。
4. campfire 燃烧时产出 Cozy Points。
5. Cozy Points 用来买装备或升级 campfire。
6. 装备增加 Comfort、解锁夜晚、改变营地视觉。

Wood 是场景物，不是顶部货币。

## 核心存档

- `cozyPoints`：可花费货币。
- `comfort`：装备带来的营地属性。
- `warmthSeconds`：篝火剩余燃烧时间。
- `ownedGear`：已购买装备。
- `placedGear`：当前放在场景里的装备。
- `equippedGear`：tent、tarp、vehicle 等 replacement 槽位。
- `userGearPositions`、`userDepthOffsetY`、`userGearMountOffsets`：Build Mode 的位置/层级/挂载调整。
- `onboardingSeen`、`interactionGuideSeen`、`buildModeGuideSeen`：引导状态。
- `soundJournal`：`{ discovered[], enabledAmbient[], masterVolume, muted }`，声音图鉴/白噪音状态；旧存档缺省安全迁移为空数组。
- `campers[]`：Camper 档案；保留稳定的 `personalityId`，并保存外观、问卷人格得分和 `baseTraits`。旧档缺少 `baseTraits` 时按现有人格 ID 自动补默认预设，不要求重新答题。
- Camper 档案内的 `habitStats` 保存玩家发起且真正完成的互动次数、受每日上限约束的成长次数；`habitModifiers` 是由成长次数按递减曲线计算出的 8 trait 长期修正，独立于 `baseTraits`。
- `dailyAdventureModifiers`：按日期保存 `generalLuck`、`treasureLuck`、`socialLuck`、`healthLuck`、`dangerSense`。由当天已有塔罗/龟壳记录稳定合并生成，缺失主题保持 0，不修改 `baseTraits` 或 `habitModifiers`。

新存档：Gather Off、Level 1 熄灭 campfire、散落木头、基础装饰、starter tent 已装备。

## 当前系统

- 装备数据集中在 `gearCatalog.js`，不要继续加大量 `hasX` 主字段。
- Tent、tarp、vehicle 使用 replacement / equipped 逻辑。
- Rooftop tent 和 vehicle awning 挂在当前 vehicle 上。
- 普通可放置 gear 使用 Buy / Place / Pack。
- Build Mode 在购买足够非 campfire 装备后解锁，可拖动物品并调整前后层级。
- 手动 action queue 支持树枝和可互动 gear；Gather On 仍走自动收集。
- Night Mode 由 light gear 解锁，只改变氛围，不改变布局。
- Camper 使用 `assets/characters/` 下的 7×6 分层角色 sheet，由外观配置选择各图层并通过背景位置切换动作帧。
- Camper 人格问卷固定回答 5 题：题库按「未知与风险、社交与团队、物资与秩序、休息与舒适、环境与探索」分为 5 类，每类随机抽 1 题。保留现有 10 个人格 ID；主要/次要人格统一按 3/1 分计分，最高分并列时从全部并列人格中随机选择。
- `baseTraits` 包含 `courage`、`curiosity`、`sociability`、`preparedness`、`observation`、`rationality`、`responsibility`、`comfortSeeking`。问卷结果先确定人格，再以该人格预设叠加答案的小幅修正并限制到 0–100；当前只存档，不影响行为、UI 或其他数值系统。
- 玩家互动习惯当前接入完成后的钓鱼、做饭、观鸟、帐篷/座椅休息、手动添柴、有效 Build Mode 拖动/层级调整；完成的钓鱼与观鸟同时作为探索经历。每行为每天最多 3 次影响成长，原始完成次数仍全部保存；成长使用 `log2(1+n)`，每个长期 trait 修正限制在 -15 到 +15。
- 每日冒险修正由占卜主题映射：整体→`generalLuck`，财运→`treasureLuck`，情感→`socialLuck`，身心→`healthLuck`；`dangerSense` 结合整体运势反向信号、负向活动权重和龟壳宜忌。塔罗与龟壳同题时等权平均、与完成顺序无关。主场景不读取这些值，深山冒险会用它们调整反应和结果。
- Help → 菜单中有独立的「深山冒险测试」开发入口。流程为准备背包 → 扣出 Storage 物品 → 自动经历最多 5 个事件 → 结算实质物品/体力/路线结果 → 返回剩余物品 → 展示单次插画日志。
- 深山原型包含 12 个事件，每个 4 种反应。反应读取 `baseTraits + habitModifiers + dailyAdventureModifiers` 后加权随机；物品准备会提高对应工具反应权重和结果。场景支持自动行走、事件物件、雨/雾/暗光、前景遮挡和位置深度排序。
- `adventure` 存档保存特殊物品 Storage、100 点冒险体力、恢复时间、已解锁路线、完成次数、最后一次日志与中断保护背包。鱼/料理继续保存在原 `inventory`；出发容量为 8 件，基础消耗 25 体力，每 14.4 分钟恢复 1 点。
- 深山结果可获得钥匙、信件、工具套组、草药、地图、指南针、护符和护林员木章；也可能丢失/消耗携带食物、工具或急救包。它不修改 Cozy Points、Comfort、Warmth、主场景装备和核心经济速率。
- Sound Journal / 白噪音系统：真实音频在 `assets/sounds/`（程序生成的无缝循环 WAV + 短音效）。声音数据在 `soundJournalCatalog.js`，播放引擎（Web Audio、循环叠加、master 音量/静音、autoplay 处理）在 `soundManager.js`，图鉴/发现/存档/UI 在 `gameSound.js`。解锁时机是“互动开始”（`startActing` 里的 fish/cook/birdwatch/campfire、`openInventoryPanel` 里的 cooler），不是活动完成。UI 入口是 utility 栏的 🔊 Sounds 按钮。

## 约束

- 保持固定 9:16 mobile-like viewport。
- UI 不要挡住 campfire、tent、camper 和新买的装备。
- 文档不要继续按轮次越写越长；有变化就替换当前状态。
- 替换正式 PNG 前先做 review sheet 并确认。
- 不要自动覆盖稳定的 campfire 资源或已冻结的 camper 动作资源。
- 深山冒险仍是单地点开发原型；物品和路线会真实存档，但不等同于正式市场、完整地图或最终奖励平衡。

## 下一步重点

- 真实手机浏览器 smoke test。
- Camper 问卷 fresh-save / 重答 / 旧档补 `baseTraits` smoke test。
- 复测最新 `gameScene.js` / `style.css` 下的 Build Mode 拖动和层级。
- GitHub 上传前确认根目录包含完整 `js/` 与 `assets/`，并排除开发参考/临时文件。
- 最终美术只使用干净的透明 PNG。
