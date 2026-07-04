# Cozy Camping Idle - Project Brief

## 当前状态

- 当前入口版本：V2.6，见 `index.html` 里的 `window.APP_VERSION = "2.6"`。
- 项目形态：纯静态浏览器游戏；没有 `package.json`、lockfile、bundler 配置、后端或安装步骤。
- 运行文件：`index.html`、`style.css`、`gearCatalog.js`、`game.js`、`assets/`。
- 发布时直接把当前根目录静态包上传到 GitHub。
- 当前未提交的玩法代码改动在 `game.js` 和 `style.css`；整理文档时不要覆盖这些改动。

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

新存档：Gather Off、Level 1 熄灭 campfire、散落木头、基础装饰、starter tent 已装备。

## 当前系统

- 装备数据集中在 `gearCatalog.js`，不要继续加大量 `hasX` 主字段。
- Tent、tarp、vehicle 使用 replacement / equipped 逻辑。
- Rooftop tent 和 vehicle awning 挂在当前 vehicle 上。
- 普通可放置 gear 使用 Buy / Place / Pack。
- Build Mode 在购买足够非 campfire 装备后解锁，可拖动物品并调整前后层级。
- 手动 action queue 支持树枝和可互动 gear；Gather On 仍走自动收集。
- Night Mode 由 light gear 解锁，只改变氛围，不改变布局。

## 约束

- 保持固定 9:16 mobile-like viewport。
- UI 不要挡住 campfire、tent、camper 和新买的装备。
- 文档不要继续按轮次越写越长；有变化就替换当前状态。
- 替换正式 PNG 前先做 review sheet 并确认。
- 不要自动覆盖稳定的 campfire 资源或已冻结的 camper 动作资源。

## 下一步重点

- 真实手机浏览器 smoke test。
- 复测最新 `game.js` / `style.css` 下的 Build Mode 拖动和层级。
- GitHub 上传前确认根目录包含 `gearCatalog.js`，并排除开发参考/临时文件。
- 最终美术只使用干净的透明 PNG。
