# Cozy Camping Idle - Asset Manifest

## 当前资源包

- `assets/` 约 50 MB，共 264 个文件。
- `assets/gear/` 当前有 57 个 gear asset folder，覆盖 11 个分类。
- 开发/参考资源在 `assets/reference/`、`assets/generated_sources/`、`tmp/`；上传 GitHub runtime 包前应排除。

## 运行结构

```text
assets/
  backgrounds/
  campfire/
  characters/
  gear/
  resources/
  ui/
  reference/          dev only
  generated_sources/  dev only
```

Gear 资源路径：

```text
assets/gear/<category>/<gearId>/icon.png
assets/gear/<category>/<gearId>/icon_base.png
```

部分装备还有 glow、headlamp front/back、flashlight cone 等 layer 文件。

## 替换规则

- 优先保持同名文件和接近的画布尺寸。
- Sprite 和 gear 必须是真透明 PNG。
- 锚点/脚底/物体底部位置尽量一致，避免场景位置漂移。
- 不要使用棋盘格、白/黑底、chroma-key 脏边或烘焙阴影。
- 如果只是替换同名 PNG，通常不需要改代码。

## 冻结资源

- `assets/campfire/*` 当前视为稳定资源；没有确认 review sheet 不要覆盖。
- Camper walk、sit、look lake、rest 动作资源先冻结。
- 替换正式 gameplay asset 前先做 review sheet。

## 关键运行资源

- Backgrounds：`campsite_day/night`、`lake_day/night`、`treeline_day/night`。
- Characters：idle、walk frames、carry wood、sit ground、sit chair、look lake back、rest。
- Campfire：level 1-3 base/flame、glow、spark。
- Resources：`wood_item.png`。
- UI：status icons、mode buttons、shop button、shop cards/tabs、close/lock/tools icons。

## Gear 分类

- vehicle
- tent
- tarp
- chair
- table
- stove
- cooler
- light
- storage
- activity
- sleepingGear
