# Cozy Camping Idle - Known Issues

## 最高优先级

- 仍需真实手机浏览器测试，重点是 shop 打开状态、safe area、Build Mode touch drag。
- 最新 `game.js` / `style.css` 改动后，manual action queue 需要完整 smoke test。
- 发布检查以根目录静态包为准。

## 视觉资源

- 部分旧生成 PNG 可能仍有边缘不干净或风格不统一。
- 最终 gameplay asset 只接受真正透明 PNG。
- 不要把棋盘格、白/黑底、chroma-key 边缘图当正式资源。
- `assets/campfire/*` 视为稳定资源，除非用户确认新的 review sheet，否则不要覆盖。
- Camper walk / sit / look / rest 动作资源先冻结，等最终图确认后再替换。

## Camper / Interaction

- `addingWoodToFire` 仍复用 carrying wood 图，没有专门投柴动作。
- Camper 动画仍偏简单。
- 需要复测 queue 编号、mobile gear 二次点击、Gather On 自动逻辑。

## Gear / Build Mode

- Packed gear 目前仍计入 Comfort；是否改为“放置才生效”以后再定。
- Build Mode 会保存位置、层级、挂载 offset；旧存档兼容需要继续观察。
- Vehicle、vehicle awning、rooftop tent 的贴合度可能还要按车型微调。

## Release 风险

- 没有 package manager，所以没有 install/build 检查步骤。
- 上传 GitHub 前排除 `assets/reference/`、`assets/generated_sources/`、`tmp/`、隐藏文件和 office 临时文件。
- 根目录 runtime 必须包含 `gearCatalog.js`；`index.html` 会先加载它再加载 `game.js`。
