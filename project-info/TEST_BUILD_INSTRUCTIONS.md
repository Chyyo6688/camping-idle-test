# Test Build Instructions

当前源码版本：V3.4。

## 包状态

- 纯静态 app；没有 npm package、安装步骤、build command 或后端。
- 运行文件：`index.html`、`style.css`、`gearCatalog.js`、`soundJournalCatalog.js`、`soundManager.js`、`game.js`、`assets/`（含 `assets/sounds/`）。
- `index.html` 里的 `window.APP_VERSION` 控制 CSS、JS 和 asset URL 的 cache busting。
- 发布时直接上传当前根目录静态包到 GitHub。

## 本地测试（用 http，不要 file://）

一定要通过 http 打开，不要直接双击 `index.html`。`file://` 下浏览器会拦截音频文件的 `fetch()`，声音会用降级的 `<audio>` 播放（循环不无缝），画面/解锁仍正常。

本机没有 Python，用仓库自带的零依赖 Node 静态服务器（`tools/serve.js`，已 gitignore，纯本地开发工具）：

```powershell
node tools/serve.js
```

默认端口 8080，会打印 `http://localhost:8080/`。换端口：`node tools/serve.js 3000`。`Ctrl+C` 停止。

浏览器打开：

```text
http://localhost:8080/index.html?reset=1
```

`?reset=1` 只用于 fresh save 测试，因为会清掉这个游戏的 localStorage 存档。改动 JS/CSS 后如果没生效，先升 `APP_VERSION` 或用 `Ctrl+Shift+R` 硬刷新绕过缓存。

## GitHub 上传包

上传时保留这些 runtime 文件：

- `index.html`
- `style.css`
- `gearCatalog.js`
- `soundJournalCatalog.js`
- `soundManager.js`
- `game.js`
- `assets/`（含 `assets/sounds/`）

排除：

- `assets/reference/`
- `assets/generated_sources/`
- `assets/sounds/archive/`（音频替换备份，非 runtime）
- `tmp/`
- `tools/serve.js`（本地开发服务器，已 gitignore）
- `.git/`、隐藏文件、`.env`
- review sheet、preview image、office 临时文件

如果使用 GitHub Pages，发布源应指向包含 `index.html` 的根目录。

## 快速验收

- Fresh save 显示熄灭 Level 1 campfire、starter tent、散落树枝、基础装饰。
- Gather 能切换自动捡树枝。
- 手动点击能 queue 树枝、椅子、帐篷、篝火。
- Shop 打开/关闭时不挡住核心场景。
- 已购买装备能显示，支持 pack/place 的继续可用，依赖规则正常。
- Build Mode 解锁后可拖动、调层级，并在刷新后保持。
- Light gear 解锁 Day/Night。
- Reset（现在在 Help→菜单里）清档前有确认。
- 刷新保留进度；只有 `?reset=1` 会清进度。
- 声音：第一次钓鱼/做饭/观鸟/开冷藏箱时解锁并出声；篝火点燃后自动播放篝火声，可在声音图鉴里手动关。
- Help 菜单：Tutorial 展开可重播「新手指引」「建造模式」；Reset 在菜单内。
- 声音图鉴（🔊 图标，在 Help 下方）：勾选的循环声可叠加，刷新后保持。

## Mobile Viewports

- 390 x 844
- 393 x 852
- 402 x 874
- 430-440 x 932-956
