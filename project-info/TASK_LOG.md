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

## WIP - Camp Scene / Gear Placement Small Fix

- Campfire scene CSS 缩小到约 0.8，并对 Level 3 base/flame 做了轻量偏移，让火焰中心和其他等级保持一致；没有改 `assets/campfire/*` PNG，也不影响 shop icon。
- Campfire upgrade shop card 改为动态显示下一等级图标：Lv1 显示 Lv2，Lv2 显示 Lv3，Lv3 显示 `MAX` 且 disabled。
- `gearCatalog.js` 为可显示 gear 增加 sprite size / scene anchor 归一化，并分散普通 gear 的固定 scene 坐标、尺寸和 zIndex，避免多件已放置物品共用同一位置。
- 新增轻量 `placedGear` 存档数组：普通 gear 状态为 `BUY` / `PLACE` / `PACK`；`PLACE` 后显示，`PACK` 后隐藏但仍 owned。Campfire 不参与；tent 保持 equip/equipped；vehicle 临时按 tent 逻辑购买后自动装备并可切回已拥有车辆。
- `starterHeadlamp` 不再作为地面物品渲染，购买后自动挂到 camper 头部，并随 camper 移动和左右镜像调整 offset/scale；购买后解锁 night mode。
- `lanternPoleLight` 修正为 80/120 比例、底部 anchor 落地，比普通营地灯更高；购买后仍解锁 night mode。
- `share-build/game.js`、`share-build/gearCatalog.js`、`share-build/style.css` 已同步本轮运行文件，未 deploy。
- 本轮本地验证：root fresh save、shop campfire icon、buy/place/pack、多个 gear 不同固定位置、headlamp 跟随和镜像、lantern pole 比例、刷新无 console error、`share-build/?reset=1` smoke 均通过。

## WIP - Gear Auto Place / Replacement Follow-up

- Gear 购买成功后默认自动进入 scene：普通可放置 gear 直接加入 `placedGear`，tent/tarp/vehicle 走装备选择逻辑，Campfire 仍保持特殊 upgrade，不参与收纳。
- Tarp 改为 replacement：新增 `equippedGear.tarp`，同一时间只显示当前 equipped tarp；购买新 tarp 会自动装备并隐藏旧 tarp。
- Vehicle 支持 `STOW` / `PLACE`：当前 equipped vehicle 可收回并保留 owned；购买或切换 vehicle 会自动装备并显示。Rooftop tent 正在装备时，当前 vehicle 显示 `MOUNTED` 且不可 stow，但可通过装备其他 vehicle 来 replace。
- Rooftop tent 改为挂载到当前 vehicle 的 `scene.roofMount`，每辆车有独立 roof anchor / width / zIndex；切换不同 vehicle 时车顶帐篷会跟随重排。
- 按 imagegen skill 检查了 tent / tarp / rooftopTent / vehicle 资产视角。当前 PNG 视角可通过 scene size / anchor / zIndex 调整匹配 cozy isometric 视角，本轮没有替换正式 tent/tarp asset，也没有归档旧图。
- `starterHeadlamp` 拆为 `headlamp-front`、`headlamp-back` 和 `flashlight-cone` 三个 scene asset；购买后自动佩戴、解锁 night mode，收纳后隐藏头灯和光锥，背向湖面时切到 back layer 并隐藏 front layer。
- `share-build/` 已同步 `game.js`、`gearCatalog.js`、`style.css` 和新增头灯 asset，未 deploy。
- 本轮本地验证：购买自动 place、tarp replacement、vehicle stow/place、rooftop tent 随 SUV/Van roof anchor 对齐、headlamp pack/place 与背向 layer 切换、刷新后状态保持、console error 为空、source/share-build JS 语法检查通过。

## 当前还没做

- 最终高质量原生透明 PNG 素材仍未完成。
- camper 动画仍是简单两帧/单帧切换，动作比较僵硬。
- walking 左右腿交替仍需最终人工美术确认，当前资源先冻结，不要继续自动批量覆盖。
- `addingWoodToFire` 仍复用 carrying wood 素材，没有专门投柴动作。
- 真实手机浏览器仍需要人工验证。
- Tarp 已有 replacement 逻辑；后续可让 string lights 支持挂在 tarp 或树间。
- 后续可考虑可拖动装饰摆放系统，但不要在当前核心逻辑未稳定前加入复杂建造玩法。
- 当前 place/pack 只是固定点显示/隐藏，没有拖动、碰撞、自动避让或通用 replacement 系统。
- Packed gear 目前仍按 owned 计入 Comfort；下一轮如要更严格，可以再讨论是否改为“放置才生效”。
- Headlamp 已改为前/后层 overlay 和光锥，但后续仍可按最终角色美术继续微调不同 pose 的头部 offset、旋转和光锥形状。
- 已 owned 但非当前 equipped 的旧 vehicle 目前会保留在 `placedGear` 中，只是 scene 隐藏；下一轮如要严格语义，可在 vehicle replacement 时清理旧 vehicle placement 标记。

## 下一步建议

1. 用真正原生透明 PNG 流程替换 gameplay sprites 和 UI icons。
2. 替换任何角色或装备资源前，先生成并确认 review sheet，不要直接覆盖正式资源。
3. 在真实 iPhone / Android 浏览器上测试 `share-build/` 或静态托管链接。
4. 精修 camper walk、sit、look lake、add wood 动作。
5. 后续新增装备继续走 `gearCatalog.js` / `ownedGear` / `placedGear`，不要扩展大量 `hasX` 字段。
