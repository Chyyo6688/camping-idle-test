# Privacy Checklist

## 当前运行行为

- 纯前端静态网页。
- 无 backend、login、cloud save、ads、analytics、tracking pixel 或第三方 script。
- 无 npm 依赖或外部 runtime package。
- 游戏不需要 API key 或 token。
- 进度只保存在浏览器 `localStorage`，key 是 `cozyCampfireSave`。

## 已检查

- 入口只加载本地 `style.css`、catalog/manager 脚本、`game*.js` 模块和本地 `assets/`。
- 源码中没有发现 `http://` 或 `https://` 的 runtime script/style import。
- 以后上传 GitHub 前按根目录静态包重新检查。

## 分享规则

上传/分享静态运行包：

- `index.html`
- `style.css`
- catalog/manager 脚本
- 全部 `game*.js` 模块（含入口 `game.js`）
- `assets/`

不要分享开发文件、隐藏文件、`.env`、token、generated sources、reference images、preview images 或 tmp folders。
