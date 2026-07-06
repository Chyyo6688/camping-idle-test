# Test Build Instructions

当前源码版本：V2.7。

## 包状态

- 纯静态 app；没有 npm package、安装步骤、build command 或后端。
- 运行文件：`index.html`、`style.css`、`gearCatalog.js`、`game.js`、`assets/`。
- `index.html` 里的 `window.APP_VERSION` 控制 CSS、JS 和 asset URL 的 cache busting。
- 发布时直接上传当前根目录静态包到 GitHub。

## 本地测试

从 repo root 启动静态服务器：

```text
python3 -m http.server 8000
```

打开：

```text
http://localhost:8000/index.html?reset=1
```

`?reset=1` 只用于 fresh save 测试，因为会清掉这个游戏的 localStorage 存档。

## GitHub 上传包

上传时保留这些 runtime 文件：

- `index.html`
- `style.css`
- `gearCatalog.js`
- `game.js`
- `assets/`

排除：

- `assets/reference/`
- `assets/generated_sources/`
- `tmp/`
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
- Reset 清档前有确认。
- 刷新保留进度；只有 `?reset=1` 会清进度。

## Mobile Viewports

- 390 x 844
- 393 x 852
- 402 x 874
- 430-440 x 932-956
