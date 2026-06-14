# Cozy Camping Idle - Asset Manifest

## 总原则

项目采用 asset-driven 结构。核心视觉对象使用独立 PNG 文件，代码通过 `assetPaths`、HTML `<img>` 和 CSS 坐标控制显示。

替换素材时优先保持：

- 文件名不变
- PNG 格式不变
- 画布尺寸接近当前文件
- 透明背景
- 角色脚底或物件底部锚点相近
- 不要带红边、白边、黑边、棋盘格背景或烘焙阴影

如果只替换同名 PNG，通常不需要改代码。

## 文件夹结构

```text
assets/
  backgrounds/
  characters/
  campfire/
  tents/
  furniture/
  lighting/
  resources/
  ui/
```

开发素材不应进入分享包：

- `assets/reference/`
- `assets/generated_sources/`
- `generated_*_preview.png`
- 其他只用于制作或对照的临时图片

## backgrounds

- `campsite_day.png`
- `campsite_night.png`
- `lake_day.png`
- `lake_night.png`
- `treeline_day.png`
- `treeline_night.png`

背景不需要透明。它们要匹配 9:16 竖屏构图，并与当前 lake / treeline 百分比位置兼容。

## characters

当前使用：

- `camper_idle.png`
- `camper_walk_01.png`
- `camper_walk_02.png`
- `camper_carry_wood.png`
- `camper_rest.png`
- `camper_look_lake_back.png`
- `camper_sit_ground.png`
- `camper_sit_chair.png`

`camper_sit.png` 可保留为旧资源，但 V2.3 之后不再作为主要坐姿入口。

语义要求：

- `camper_walk_01.png` 和 `camper_walk_02.png` 应左右脚交替。
- `camper_look_lake_back.png` 必须背对屏幕。
- `camper_sit_ground.png` 用于坐在篝火边地面。
- `camper_sit_chair.png` 用于坐在 chair 上。
- 移动中只能显示 walking 或 carrying wood 相关素材。

## campfire

- `campfire_lv1_base.png`
- `campfire_lv1_flame_01.png`
- `campfire_lv1_flame_02.png`
- `campfire_lv2_base.png`
- `campfire_lv2_flame_01.png`
- `campfire_lv2_flame_02.png`
- `campfire_lv3_base.png`
- `campfire_lv3_flame_01.png`
- `campfire_lv3_flame_02.png`
- `glow_fire.png`
- `spark.png`

`warmthSeconds = 0` 时只显示 base，不显示 flame / glow。

V2.5 注意：Campfire asset 已手动恢复为稳定旧版本。后续不要用自动生成流程覆盖 `assets/campfire/*`，除非用户先确认新的 review sheet。

## tents

- `tent_backpacking.png`
- `tent_low_dome.png`
- `tent_vestibule.png`
- `tent_glow_overlay.png`

新玩家默认拥有并装备 `backpacking`。低顶帐篷和 vestibule tent 只通过 shop 购买/装备。

## furniture

- `chair.png`
- `table.png`
- `kettle.png`
- `axe.png`
- `stove.png`
- `crate.png`
- `woodpile.png`
- `stump.png`

显示规则：

- `crate`、`woodpile`、`stump` 是基础环境装饰，可以开局显示。
- `chair`、`table`、`kettle`、`axe`、`stove` 必须购买后才显示。
- `kettle` 和 `stove` 依赖 `table`，购买后视觉上摆在 table 上。

## lighting

- `lantern.png`
- `lantern_glow.png`
- `string_lights.png`
- `string_lights_glow.png`

显示规则：

- `lantern` 购买后显示，并解锁 Night Mode。
- `string_lights` 购买后才显示。
- V2.4 中 `string_lights` 被放到当前 tent 上方，并缩小处理。后续可改为挂在 tarp 或树间。

## resources

- `wood_item.png`

Wood item 是自动收集流程中的场景物，不是顶部资源栏货币。

## ui

主要 UI 图标：

- `icon_cozy.png`
- `icon_comfort.png`
- `icon_warmth.png`
- `icon_shop.png`
- `icon_gather_wood.png`
- `icon_day.png`
- `icon_night.png`
- `icon_fire.png`
- `icon_tent.png`
- `icon_furniture.png`
- `icon_lighting.png`
- `icon_tools.png`
- `icon_close.png`
- `icon_lock.png`

主要 UI 面板：

- `status_chip_bg*.png`
- `button_*_bg*.png`
- `drawer_bg.png`
- `shop_tab_bg*.png`
- `shop_item_card*.png`
- `shop_button_*.png`

UI 图标需要在小尺寸下仍可读，尤其是 status bar 和 mobile button。

## V2.4 Imagegen 尝试

本次已使用 `$imagegen` 按参考图尝试生成一张包含 camper、tent、campfire、chair、lantern、table、kettle、axe、string lights、UI icons 的 sprite sheet，并明确要求 true transparent background。

检查结果：

- 输出图片是 `RGB` 模式。
- 没有 alpha 通道。
- 棋盘格被画进图像里，不是真透明。

因此 V2.4 没有把这张生成图导入 `assets/`，也没有继续使用 chroma-key 抠图。这样可以避免再次产生红边或脏边。

后续仍需替换：

- 所有风格不统一的 gameplay sprites。
- 红边明显的 furniture / lighting / UI icons。`assets/campfire/` 已恢复为稳定旧版，除非用户明确确认，不要覆盖。
- camper 正式动作帧，尤其是 walk、look lake back、sit ground、sit chair。

推荐后续流程：使用能直接输出 alpha channel 的原生透明 PNG 工具或人工绘制资源，然后以同名 PNG 替换当前文件。

## V2.5 Asset Freeze

- `assets/campfire/` 当前视为稳定旧版，不要自动覆盖。
- `assets/characters/camper_walk_01.png`
- `assets/characters/camper_walk_02.png`
- `assets/characters/camper_look_lake_back.png`
- `assets/characters/camper_sit_ground.png`
- `assets/characters/camper_sit_chair.png`
- `assets/characters/camper_rest.png`

以上角色动作资源暂时冻结。后续应由用户提供或确认最终 PNG，再替换进正式 `assets/`。替换前请先生成 review sheet，并确认画布尺寸、脚底基线、alpha 通道和动作语义。
