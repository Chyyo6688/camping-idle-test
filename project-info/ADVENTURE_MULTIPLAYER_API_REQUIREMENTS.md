# Adventure Multiplayer API Requirements

最后更新：2026-07-13  
状态：未来接入需求，不代表已选择后端或已实现联机

## 范围

当前阶段只实现本地 1–3 人事件分工。真实联机未来应支持异步组队，并最终容纳最多 4 名 Camper；本文件定义数据和 API 边界，不选择供应商，不实现好友账号、邀请通知、网络房间、实时同步、聊天或交易。

## 权威边界

服务端应成为以下内容的最终权威来源：

- 队伍成员、邀请状态、准备状态和 trip 状态。
- 每位成员提交的 Camper 快照版本与最多 5 格背包贡献。
- 事件顺序、随机种子、行动者/协助者分配和结果。
- 物品获得、消耗、丢失、返还和路线/地图解锁账本。
- 最终团队日志、个人高光和每位成员可见的观察差异。

客户端可以预测表现，但不能自行确认奖励、重复返还背包或改写别人的物品所有权。

## 核心数据

`Party`：`partyId`、`ownerPlayerId`、成员、邀请状态、容量、创建/过期时间、版本。

`PartyMember`：`playerId`、`camperId`、显示名、成员状态、Camper 快照版本、加入时间。

`AdventureTrip`：`tripId`、`partyId`、`mapId`、`routeId`、`adventureHook` 快照、地图状态版本、成员快照、状态、随机种子、事件索引、创建/结算时间。

`BackpackContribution`：`ownerPlayerId`、`ownerCamperId`、`itemKey`、数量、来源库存版本。鱼、料理和冒险物品继续使用现有统一 key 语义。

`AdventureEventResult`：

```js
{
  eventId,
  eventIndex,
  participants,
  actorCamperId,
  helperCamperIds,
  itemOwnerId,
  contributorIds,
  decisionSource,
  reactionId,
  outcomeTier,
  usedItemKey,
  participantObservations,
  effects,
  storyText
}
```

`InventoryLedgerEntry`：唯一 `ledgerEntryId`、`tripId`、`eventIndex`、玩家/物品所有者、item key、delta、原因、创建时间。所有结算必须能由账本重放并防止重复。

## 最低 API 能力

- 创建队伍、查询队伍、离开或解散未出发队伍。
- 邀请、接受、拒绝和让邀请过期。
- 提交 Camper 快照与背包贡献；服务端校验库存版本和容量。
- 锁定准备状态并创建 trip；返回不可变的地图、路线、Hook 和成员快照。
- 查询 trip 当前状态与增量事件结果，支持断线后从 `eventIndex` 继续获取。
- 取消未开始 trip，或按明确规则提前返回；两者都必须幂等返还物品。
- 获取最终团队日志与个人可见观察；确认客户端已接收结算。

推荐使用版本化资源与条件写入，例如 `partyVersion`、`tripVersion` 或 ETag。所有创建、准备、取消和结算请求都需要 `idempotencyKey`。

## 异步流程

```text
创建队伍
→ 邀请成员
→ 各成员提交 Camper 与背包贡献
→ 服务端锁定库存和队伍版本
→ 创建 trip 与随机种子
→ 服务端逐事件或一次性完成自动冒险
→ 客户端轮询/订阅增量结果
→ 服务端原子结算账本
→ 每位玩家领取同一版本日志
```

实时 WebSocket 不是第一版硬要求。短轮询、长轮询或推送通知都可以承载异步完成提示，但事件和库存仍必须由同一权威结算路径产生。

## 一致性与恢复

- 出发时原子锁定所有成员贡献，任何一人校验失败都不能形成半完成 trip。
- `tripId + eventIndex` 必须唯一；重复提交不能重复事件或奖励。
- backpack 与 loot 分账保存，物品归属跟随 `ownerPlayerId`，公共发现需有明确分配规则。
- 断线、超时和客户端重复打开日志不能重复返还或发放物品。
- 服务端保留足够的事件输入版本、随机种子和账本，以便审计或重放争议结果。
- 地图配置和规则需要 `contentVersion`；进行中的 trip 始终使用出发时版本。

## 权限与隐私

- 玩家只能提交自己的 Camper 和库存贡献，队长不能替成员转移物品。
- 队伍成员只能读取该 trip 中允许共享的快照字段；不上传无关营地或行为历史。
- `participantObservations` 可以按成员分别可见，团队日志只合并设计允许公开的内容。
- 显示名、好友关系和邀请 token 需要独立权限与过期策略。

## 当前本地映射

`js/systems/adventure/adventureParty.js` 已验证 `participants`、`actorCamperId`、`helperCamperIds`、`itemOwnerId`、`contributorIds`、`decisionSource`、`participantObservations` 和个人高光。它不包含网络协议、身份验证、数据库、推送、服务端随机或跨玩家库存结算。

接入真实联机前还需要确定：公共 loot 分配方式、离队/超时规则、服务端内容版本发布策略、作弊与重放审计、邀请隐私，以及 4 人队伍的最终 UI。暗线和地图解锁不得成为组队的强制条件。
