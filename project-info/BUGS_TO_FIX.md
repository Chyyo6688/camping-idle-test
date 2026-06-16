# Cozy Camping Idle - Bugs / Known Issues

## 透明素材和红边

当前部分第一轮生成素材来自 chroma-key 去背景，边缘可能有红边或不干净 alpha。

V2.4 已按参考图再次使用 `$imagegen` 尝试生成透明 sprite sheet，并要求 true transparent background。检查结果显示输出是 RGB、没有 alpha 通道，棋盘格被画进图像中。因此没有导入该生成图，也没有继续使用 chroma-key 抠图。

仍需处理：

- 使用真正原生透明 PNG 资源替换 camper、chair、lantern、table、campfire、小道具和 UI icons。
- 替换时保持同名文件和相近画布尺寸。
- 不要使用带棋盘格、白底、黑底或 chroma-key 红/绿边的图片作为最终 gameplay asset。

## Camper 动画

已修复的语义：

- 移动中只使用 `walking` 或 `carryingWood`。
- `lookingAtLake` 使用 `camper_look_lake_back.png`。
- `sittingByFire` 使用 `camper_sit_ground.png`。
- `sittingOnChair` 使用 `camper_sit_chair.png`。

仍需观察：

- 最终角色动作帧仍需替换，尤其是 `camper_walk_01.png` / `camper_walk_02.png` 的左右腿交替。
- V2.5 后角色 walk / sit / look lake 动作资源暂时冻结，等待用户准备最终 PNG 后再替换。
- `addingWoodToFire` 仍复用 carrying wood 图，没有专门投柴 pose。
- 动画整体仍比较僵硬，后续可增加更多帧，但不要引入复杂动画系统。

## Equipment 显示和解锁

历史版本普通购买装备使用 `ownedEquipment`，当前代码已迁移为 `gearCatalog.js` + `ownedGear`，并在本轮加入轻量 `placedGear`：

- `chair`
- `table`
- `kettle`
- `axe`
- `stove`
- `lantern`
- `stringLights`

这些装备默认不显示，购买后才显示。`crate`、`woodpile`、`stump` 是基础环境装饰，可以开局显示。

仍需观察：

- table / kettle / stove 的视觉摆放是否足够自然。
- bottom sheet 打开时，购买后的桌面小物是否仍清晰可见。
- 新增装备必须走 `gearCatalog.js`，不要新增大量 `hasX` 主字段。
- 当前 `placedGear` 只负责固定点显示/隐藏；没有拖动、碰撞、自动避让或通用 replacement。
- Packed gear 仍按 owned 计入 Comfort，是否改成“放置才生效”留给下一轮设计决定。

## String Lights

V2.4 已将 `string_lights` 移到当前 tent 上方并缩小，只有购买后才显示。

未来建议：

- 增加 tarp，string lights 可以挂在 tarp 或树间。
- 增加可拖动装饰摆放系统，让玩家自己调整灯串位置。
- 这些都属于未来玩法/摆放系统，不属于 V2.4 修复范围。

## Toast / Safe Area

V2.4 将 welcome/status 文本改为 toast，避免长期遮挡底部营地。

仍需真实设备测试：

- iPhone 12 Pro: 390 x 844
- iPhone 15 Pro: 393 x 852
- iPhone 16 / 17 Pro: 402 x 874
- Pro Max-ish: 430-440 x 932-956

重点检查：

- toast 不与 status bar、刘海或 Dynamic Island 重叠。
- Shop bottom sheet 打开时不会完全遮住 campfire、camper、tent、table、chair。
- Reset 小按钮不干扰主要游玩。

## Resize / Mobile 风险

当前使用固定 9:16 `game-viewport`，对象按统一百分比坐标定位。窗口缩放后对象不应跑到湖或天空上。

仍需观察：

- 横屏或极矮浏览器窗口中的裁切情况。
- 真实手机浏览器地址栏展开/收起时的高度变化。
- day/night 切换后背景和对象是否仍保持一致。

## V2.5 Handoff Notes

- 部分非核心 asset 仍可能需要后续统一风格。
- Campfire asset 已手动恢复为稳定旧版本，不要在后续自动生图流程中覆盖。
- 后续资源替换前需要先生成并确认 review sheet，不要直接覆盖正式 `assets/` 文件。
- Shop UI 已做 V2.5 收尾，后续除非用户明确要求，不要继续改 Shop UI 或购买逻辑。

## WIP Handoff Notes - 2026-06-16

- Campfire scene 已通过 CSS 缩小并对 Level 3 做轻 tuning；shop upgrade icon 改为动态下一等级图标。
- 普通 gear shop 状态为 `BUY` / `PLACE` / `PACK`，购买后会自动 place；Campfire 仍特殊，不参与收纳。
- Tarp 已改为 replacement，使用 `equippedGear.tarp`，同一时间只显示当前 equipped tarp。
- Vehicle 支持当前车 `STOW` / `PLACE`，但 rooftop tent 装备中时当前车被锁为 `MOUNTED`，只能通过切换 tent 或 replace vehicle 解除。
- Rooftop tent 已改为读取当前 vehicle 的 `scene.roofMount`；每辆车的 anchor / width 仍可能需要真实视觉微调。
- `starterHeadlamp` 已改为 camper head attachment 的 front/back 两层，并新增 flashlight cone；购买后自动放置并解锁 night mode，pack 后隐藏头灯和光锥。
- `lanternPoleLight` 已按 80/120 比例和底部 anchor 调整，视觉上比普通营地灯更高。
- `share-build/` 已同步本轮 `game.js`、`gearCatalog.js`、`style.css` 和新增头灯 asset，但没有 deploy。

## 本轮需要人工复测

- 在真实手机浏览器看 rooftop tent 与所有 vehicle 的贴合度，尤其是 SUV / van / pickup 的车顶高度。
- 看 tent / tarp / rooftopTent 在不同 shop scroll / scene 位置下是否仍符合 cozy isometric 视角。
- 看 headlamp 在 walk、rest、look lake back 等 pose 上是否自然；当前是轻量 offset，不是逐帧手绘适配。

## localStorage 兼容

`sanitizeSave()` 已迁移：

- `warmth` -> `warmthSeconds`
- `lastSavedTime` -> `lastSaveTime`
- `tentType` -> `currentTentType`
- old `dome` -> `lowDome`
- `hasChair/hasLantern/hasTable/hasKettle/hasAxe/hasStove/hasStringLights` -> `ownedEquipment`

V2.4 新增：

- `Reset` 按钮清空本地存档。
- `?reset=1` 自动清空本地存档，方便测试新玩家开局。

本轮新增：

- `placedGear`: 普通 gear 的固定点放置/收纳状态。旧存档没有该字段时，会把已 owned 的可放置 gear 视作已放置，避免刷新后旧营地突然清空。
- `equippedGear.tarp`: 当前显示的 tarp replacement。
- `vehiclePlacementMigrated`: 旧存档兼容标记，确保已有 equipped vehicle 在新 stow/place 规则下首次打开仍默认显示。

后续新增存档字段时，必须同步更新 `defaultGameState` 和 `sanitizeSave()`。
