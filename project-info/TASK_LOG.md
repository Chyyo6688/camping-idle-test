# Cozy Camping Idle - Task Log

## 当前 V4.8 状态

- `index.html` 和 `js/core/gameConfig.js` 已指向 app version `4.8`。
- 包检查：没有 npm package、lockfile、bundler、第三方 runtime script 或外部依赖。
- 当前运行包是根目录静态 app：`index.html`、`style.css`、`js/` 和 `assets/`。
- Camper 外观、人格问卷与档案逻辑位于 `js/config/camperConfig.js` 和 `js/camper/gameCamperProfile.js`。
- 后续直接上传根目录静态包到 GitHub。
- 本地测试使用已 gitignore 的 `tools/serve.js`，通过 HTTP 打开，不使用 `file://`。

## 压缩里程碑

- V1：本地浏览器 idle clicker，使用 localStorage。
- V2：scene-first idle 循环，camper 自动捡木头，加入 Warmth、Cozy Points、Comfort、day/night、offline progress。
- V2.3：gear registry、购买后显示装备、新存档从熄灭篝火和 starter tent 开始。
- V2.4：Reset、`?reset=1`、toast、mobile shop、静态发布规则。
- V2.5：Shop UI polish、place/pack、tarp/vehicle replacement、rooftop mount、headlamp layers。
- V2.6：onboarding/help、手动 action queue、UI 显示切换、Build Mode 拖动/层级存档。
- V2.7：camper polished 角色帧接入运行素材。
- V3.x：钓鱼/做饭/冷藏箱/inventory、activity zone、camper 档案卡。
- V3.3：Sound Journal / 白噪音系统重做——真实可听音频（`assets/sounds/`）、`soundJournalCatalog.js` + `soundManager.js`、互动开始即解锁并播放、可勾选循环叠加、master 音量/静音、`soundJournal` 存档与旧档迁移。
- V4.x：模块迁入 `js/config/`、`js/core/`、`js/systems/`、`js/camper/`，并加入天气、占卜与后续营地系统。
- V4.8：Camper 问卷改为 5 类各抽 1 题；10 个人格保持原 ID 并重新平衡主要/次要得分；最高分并列随机。新增 8 项 `baseTraits` 人格预设与答案修正，旧档按人格 ID 自动补值，暂不影响行为或 UI。
- V4.8 数据层：新增玩家完成行为的 `habitStats` / `habitModifiers`，按每日上限与对数递减曲线生成长期 trait 修正；新增由当天塔罗和龟壳记录等权合并的 `dailyAdventureModifiers`。三层数据互相独立，尚未接入冒险判定、行为或 UI。
- V4.8 深山冒险原型：独立开发入口现已跑通准备背包、Storage 扣取、最多五事件自动行程、实际物品/体力/路线结算、剩余物品返还和插画日志。12 个事件各有 4 种 trait/习惯/运势加权反应；结果不会改主场景经济，但会保存冒险专用物品、体力与解锁路线。

## 维护规则

- 不要给每一轮小修改追加长 handoff。
- 功能变化时，更新当前状态，不保留流水账。
- 新装备继续走 `js/config/gearCatalog.js`、`ownedGear`、`placedGear`、`equippedGear`。
- GitHub 上传前确认 `js/` 和 `assets/` runtime 文件齐全。
- Camper 人格 ID 必须保持稳定；`baseTraits` 缺失由档案清洗自动补全，不通过强制重答迁移。
- 未来冒险读取数据时保持 `baseTraits + habitModifiers + dailyAdventureModifiers` 分层；不要把长期习惯或每日运势写回 `baseTraits`。

## 下一步检查

- `?reset=1` fresh save。
- 手动 queue：树枝、椅子、帐篷、篝火。
- Build Mode：解锁、拖动、层级、刷新后保持。
- Mobile：shop 打开、safe area、toast、核心物件可见。
- Adventure prototype：Help → 深山冒险测试；检查 Storage/背包数量流转、8 件容量、25 点出发体力、最多 5 个事件、四层场景反馈、日志四类账本、刷新保持和手机端滚动。
- Camper：问卷始终 5 题、重答正常、并列不偏向配置前排、旧档无需重答即可补全 `baseTraits`。
