# Cozy Camping Idle - Asset Manifest

最后核对：2026-07-13。V5.0 / adventure v9 新增受潮调查路线图运行时图像，用于雾雨林关键线索解锁演出。

## 当前资源包

- `assets/` 当前约 149 MB，共 378 个文件。
- `assets/gear/` 当前有 57 个 gear asset folder，覆盖 11 个分类。
- 开发/参考资源在 `assets/reference/`、`assets/generated_sources/`、`tmp/`；上传 GitHub runtime 包前应排除。

## 运行结构

```text
assets/
  backgrounds/
  adventure/
  campfire/
  characters/
  gear/
  resources/
  sounds/             白噪音循环 + 短音效 (WAV)
  ui/
  reference/          dev only
  generated_sources/  dev only
```

## 声音资源

- `assets/sounds/` 是程序生成的真实 WAV（mono 22050Hz 16-bit）。
- 循环（无缝）：`lake_water_loop`、`campfire_crackle_loop`、`birds_morning_loop`、`cooking_sizzle_loop`。
- 短音效：`cooler_open`、`fishing_line`。
- 由 `soundManager.js` 用 Web Audio (`AudioBufferSourceNode loop=true`) 无缝循环播放；替换时保持同名、无缝首尾。生成脚本见开发记录（非运行时依赖）。

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

## 深山冒险原型资源

- `assets/adventure/deep-mountain/deep-mountain-background.png`：新生成的 941×1672 深山竖屏场景底图，包含山路、溪流、吊桥、木屋和岔路地标。
- `assets/adventure/deep-mountain/event-props.png`：新生成并完成透明去色键的 4×3 事件物件图集，包含脚印、宝箱开合、鬼影、树枝、翻动食物、溪流闪光、求救者、灯、木屋变化、桥板和路标。
- `assets/adventure/deep-mountain/foreground.png`：新生成并完成透明去色键的 2×1 前景树木/岩石图集，用于遮挡 camper。
- `assets/adventure/deep-mountain/adventure-items.png`：新生成并完成透明去色键的 4×3 冒险物品图集，包含绳组、提灯、急救包、钥匙、信件、工具套组、草药、地图、指南针、护符、木章和干粮。
- `event-props-chroma.png`、`foreground-chroma.png` 与 `adventure-items-chroma.png` 保留为图集透明处理源文件，不由运行时加载。
- 原型复用 `assets/weather/light_rain_overlay.png`、`assets/weather/fog_overlay.png` 与现有 7×6 camper 分层动作 sheet。

## 雾雨林冒险资源

- `assets/adventure/fog-rainforest/fog-rainforest-background.png`：941×1672 竖屏雨林场景底图，包含河岸湿地、藤蔓旧路、树冠步道与废弃调查设施。
- `assets/adventure/fog-rainforest/foreground.png`：1774×887 透明 2×1 前景植被图，用于左右前景遮挡和场景深度。
- `assets/adventure/fog-rainforest/event-props.png`：1448×1086 透明 4×3 事件物件图集，包含足迹、发光植物、虫群、藤墙、调查终端、泡水补给箱、树冠步道、洪水漂流物、兰花、调查笔记、蛙与三叶石纹。
- `assets/adventure/fog-rainforest/rainforest-items.png`：1536×1024 透明 3×2 当地物品图集，包含藤切刀、驱虫叶露、微光孢子、压叶标本、调查站通行牌与苔纹雨披。
- `assets/adventure/fog-rainforest/damp-route-map.png`：1536×1024 受潮折叠调查路线图，用于“受潮的调查路线图”首次获得弹窗与复看。
- `foreground-chroma.png`、`event-props-chroma.png`、`rainforest-items-chroma.png` 保留为生成和透明去色键源文件，不由运行时加载。

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
