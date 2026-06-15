# Cozy Camping Idle - Task Log

## V1 Prototype

- 初始版本是简单 browser idle clicker。
- 玩家点击 Gather Wood，使用 Wood / Warmth，并通过 `localStorage` 保存。

## V2 - Idle / Management Refactor

- Wood 不再是顶部资源。
- camper 自动捡 `wood item`、带到 campfire、增加 `warmthSeconds`。
- campfire 燃烧时产生 Cozy Points。
- 引入 Cozy Points、Comfort、Warmth / Fire Duration。
- 加入 tent、chair、lantern、campfire upgrade、day/night、offline progress。

## V2.1 - UI / Tent Logic

- 新增 `ownedTentTypes` 和 `currentTentType`。
- 修复 tent 买过后切换不应再次付费的问题。
- UI 改为 scene-first，shop 改为抽屉/面板。

## V2.15 - Asset Refactor

- 新增 `assets/` 文件夹结构。
- camper、campfire、tent、chair、lantern、wood item、UI icons 等改为 PNG asset。
- `game.js` 中新增 `assetPaths`。

## Mobile UI Fit

- mobile shop 改为 bottom sheet。
- Gather Wood / Day Night 改成右上角小按钮。
- Shop 改成底部 floating action button。
- shop 打开时 campsite 场景上移。

## Imagegen Asset Pass

- 按参考图方向生成第一轮背景、角色、装备、UI 图标和面板素材。
- 保持原有文件名和大致尺寸。
- 后续发现部分 cutout 有红边，需要用原生透明 PNG 重新制作最终素材。

## V2.3 - Equipment Unlock / Camper Pose / Share Build

- 新游戏开局改为 `warmthSeconds = 0`、Level 1 campfire 熄灭、已拥有 Backpacking Tent。
- 新增 `ownedEquipment` 作为普通装备主存档结构。
- 新增 `equipmentData` registry，统一管理 chair、table、kettle、axe、stove、lantern、stringLights。
- 迁移旧字段 `hasChair/hasLantern/hasTable/hasKettle/hasAxe/hasStove/hasStringLights` 到 `ownedEquipment`。
- table、kettle、axe、stove、string lights、chair、lantern 默认不显示，购买后才显示。
- kettle / stove 依赖 table，未买 table 前 shop 中显示 Locked。
- `lookingAtLake` 使用背对屏幕资源位。
- `sittingByFire` 与 `sittingOnChair` 分离为不同 pose。
- 移动中仍只使用 walking / carryingWood。
- 新增 `PRIVACY_CHECKLIST.md` 和 `TEST_BUILD_INSTRUCTIONS.md`。
- 创建 `share-build/` 静态测试包，不包含开发参考图和生成源图。

## V2.4 - Reset / Toast / Static Share Prep

- 标题更新为 V2.4。
- 新增小型 `Reset` 按钮，用于清空本地 `localStorage` 并回到新玩家状态。
- 新增 `?reset=1` 测试入口，打开页面时会自动清空当前本地存档。
- 将顶部/底部固定状态文字改为轻量 toast，自动淡出，避免遮挡 campfire、tent、table、chair 等主要物件。
- welcome/offline message 也改为 toast，并避开 status bar 和 safe area。
- `string_lights` 改为购买后显示在当前 tent 上方，尺寸更小。
- 用 `$imagegen` 参照用户给的图再次尝试生成透明 sprite sheet；检查发现输出是 RGB、无 alpha，因此没有导入项目，也没有使用 chroma-key。
- 重新生成 `share-build/`，只包含运行需要的最小静态文件。
- 更新 handoff 文档、隐私清单和静态部署说明。

## V2.5 - Shop UI Refine / Release Sync

- 标题更新为 V2.5。
- Shop UI refined：
  - `SHOP` 标题缩小为更克制的 mobile game panel 标题。
  - `Camp Gear` eyebrow 缩小，减少网页感。
  - Shop tabs 改为内容自适应宽度，并保持单独横向滚动、隐藏滚动条。
  - Tab 字体和 icon 尺寸微调，保持 24px 视觉高度。
  - 商品卡片和 Campfire featured card 增加 `4px 4px 4px rgba(0,0,0,0.28)` 阴影。
  - section title 对齐、card spacing、inner padding 已在前序 Shop UI refined 中改善。
- Shop 打开时 campsite 上移幅度已在前一轮下调约 7vh，避免把 campfire / tent / camper 推得太高。
- Campfire asset 已由用户/手动流程恢复为稳定旧版本，后续不要自动覆盖 campfire PNG。
- 角色 walk / sit / look lake 动作资源暂时冻结，后续由用户准备最终 PNG 后再替换。
- `share-build/` 已同步为当前 V2.5 测试版本，只包含静态运行文件。

## 当前还没做

- 最终高质量原生透明 PNG 素材仍未完成。
- camper 动画仍是简单两帧/单帧切换，动作比较僵硬。
- walking 左右腿交替仍需最终人工美术确认，当前资源先冻结，不要继续自动批量覆盖。
- `addingWoodToFire` 仍复用 carrying wood 素材，没有专门投柴动作。
- 真实手机浏览器仍需要人工验证。
- 后续可增加 tarp，并让 string lights 支持挂在 tarp 或树间。
- 后续可考虑可拖动装饰摆放系统，但不要在当前核心逻辑未稳定前加入复杂建造玩法。

## 下一步建议

1. 用真正原生透明 PNG 流程替换 gameplay sprites 和 UI icons。
2. 替换任何角色或装备资源前，先生成并确认 review sheet，不要直接覆盖正式资源。
3. 在真实 iPhone / Android 浏览器上测试 `share-build/` 或静态托管链接。
4. 精修 camper walk、sit、look lake、add wood 动作。
5. 后续新增装备继续走 `equipmentData`，不要扩展大量 `hasX` 字段。
