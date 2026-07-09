(function () {
  const questionIds = ["overall", "relationship", "money", "bodyMind"];

  const questions = {
    overall: {
      id: "overall",
      label: "今日运势",
      shortLabel: "运势",
      realityLens: "今天更适合看整体节奏：",
      adviceLens: "今天的建议是：",
      campLens: "营地里会更偏向：",
      boundary: "这只是今天的氛围提示，不是确定预测。",
      effects: {
        activityLabels: ["慢慢安排"],
        activityWeights: { wandering: 0.1, lookingAtLake: 0.1 }
      }
    },
    relationship: {
      id: "relationship",
      label: "情感",
      shortLabel: "情感",
      realityLens: "放到关系和沟通里看：",
      adviceLens: "今天适合把话说轻一点：",
      campLens: "营地里会更偏向：",
      boundary: "这不判断对方真实想法，只提示沟通和情绪上的象征性方向。",
      effects: {
        activityLabels: ["整理情绪"],
        activityWeights: { sittingOnFurniture: 0.15, lookingAtLake: 0.15 }
      }
    },
    bodyMind: {
      id: "bodyMind",
      label: "身心",
      shortLabel: "身心",
      realityLens: "放到休息和照顾自己里看：",
      adviceLens: "今天先照顾节奏：",
      campLens: "营地里会更偏向：",
      boundary: "这不是医疗诊断；如果真的不舒服，按现实需要寻求专业帮助。",
      effects: {
        activityLabels: ["休息补电"],
        activityWeights: { resting: 0.35, tentRest: 0.25 }
      }
    },
    money: {
      id: "money",
      label: "财运",
      shortLabel: "财运",
      realityLens: "放到消费节奏里看：",
      adviceLens: "今天先看清再花：",
      campLens: "营地里会更偏向：",
      boundary: "这不是投资预测；只提示观望、小额尝试或避免冲动购物的节奏。",
      effects: {
        activityLabels: ["看清预算"],
        activityWeights: { observingGear: -0.15, sittingOnFurniture: 0.15 }
      }
    }
  };

  const tarotCards = [
    {
      id: "ember",
      name: "The Ember / 余烬",
      image: "assets/divination/tarot/tarot_ember.png",
      baseEffects: {
        activityLabels: ["围炉", "煮点热的"],
        soundRecommendations: [{ id: "campfire_crackle_loop", label: "篝火声" }],
        activityWeights: { sittingByFire: 0.55, cook: 0.4 }
      },
      upright: {
        keywords: ["恢复", "慢慢重燃", "温暖"],
        reality: "有些事不需要立刻变旺，先保留一点火种就够。",
        advice: "把力气用在能恢复你的事情上，别急着证明自己状态很好。",
        campImpact: "小人会更想靠近火堆、做饭、把营地热起来。",
        moodLine: "占营说：余烬还在，今天适合慢慢回温。",
        thoughtLines: ["火还在，慢慢来", "先暖一下", "今天适合煮点热的"]
      },
      reversed: {
        keywords: ["过度消耗", "需要停火", "慢一点"],
        reality: "你可能已经烧得太久了，今天更该保留体力。",
        advice: "先暂停多余的消耗，别用忙碌掩盖疲惫。",
        campImpact: "小人会少折腾装备，多休息或围炉待着。",
        effects: { activityWeights: { observingGear: -0.35, resting: 0.35, tentRest: 0.25 } },
        moodLine: "占营说：火小一点也没关系，别把自己烧空。",
        thoughtLines: ["先别添太多柴", "休息也是正事", "火小一点就好"]
      }
    },
    {
      id: "mirror",
      name: "The Mirror / 镜水",
      image: "assets/divination/tarot/tarot_mirror.png",
      baseEffects: {
        activityLabels: ["看湖", "安静观察"],
        soundRecommendations: [{ id: "lake_water_loop", label: "湖水声" }],
        activityWeights: { lookingAtLake: 0.65, resting: 0.25 }
      },
      upright: {
        keywords: ["观察", "反思", "情绪倒影"],
        reality: "眼前的反应可能像湖面倒影，先看见情绪，再决定行动。",
        advice: "把判断延后一点，给自己一个不急着回应的空隙。",
        campImpact: "小人会更常去湖边发呆，声音推荐偏湖水。",
        moodLine: "占营说：湖面很像镜子，今天先看清自己的倒影。",
        thoughtLines: ["湖面在替我想", "先看一会儿水", "答案不用马上来"]
      },
      reversed: {
        keywords: ["误读", "情绪放大", "别急着定论"],
        reality: "有些感觉被放大了，不一定等于事实本身。",
        advice: "今天少做定论，多做记录；等水面平一点再说。",
        campImpact: "小人会更倾向安静待着，减少乱走。",
        effects: { activityWeights: { wandering: -0.25, sittingOnFurniture: 0.25 } },
        moodLine: "占营说：水面有波纹，今天别急着把影子当答案。",
        thoughtLines: ["先别下结论", "水还有点晃", "看清一点再动"]
      }
    },
    {
      id: "shelter",
      name: "The Shelter / 庇护",
      image: "assets/divination/tarot/tarot_shelter.png",
      baseEffects: {
        activityLabels: ["帐篷休息", "坐一会儿"],
        activityWeights: { tentRest: 0.6, sittingOnFurniture: 0.35, resting: 0.3 }
      },
      upright: {
        keywords: ["安全感", "边界", "退回自己"],
        reality: "今天适合先把边界搭好，安全感不是退缩，是补给。",
        advice: "减少让你分心的入口，给自己一块清楚的小空间。",
        campImpact: "小人更容易进帐篷或找地方坐下。",
        moodLine: "占营说：帐篷拉链一合，世界就小一点、稳一点。",
        thoughtLines: ["帐篷里很安心", "先回到自己的地方", "边界也很温柔"]
      },
      reversed: {
        keywords: ["躲太久", "闷住", "需要透气"],
        reality: "保护自己是对的，但别把所有空气都挡在外面。",
        advice: "给自己留一条小通道，可以只迈出很小一步。",
        campImpact: "小人会在休息和散步之间摆动。",
        effects: { activityWeights: { wandering: 0.25, tentRest: 0.2 } },
        moodLine: "占营说：庇护很好，但门帘也可以开一点缝。",
        thoughtLines: ["出去透口气也行", "不用躲太久", "门帘开一点"]
      }
    },
    {
      id: "lantern",
      name: "The Lantern / 提灯",
      image: "assets/divination/tarot/tarot_lantern.png",
      baseEffects: {
        activityLabels: ["整理装备", "小范围行动"],
        activityWeights: { observingGear: 0.55, wandering: 0.25, sittingByFire: 0.2 }
      },
      upright: {
        keywords: ["看清", "指引", "小行动"],
        reality: "今天不需要照亮整片森林，只要照亮脚边这一小步。",
        advice: "把大问题拆成能马上看见的一件小事。",
        campImpact: "小人会更常检查装备，夜晚时也更靠近亮处。",
        moodLine: "占营说：提灯只照一小圈，但这一小圈已经够走。",
        thoughtLines: ["先照亮这里", "整理一下就清楚了", "一步就好"]
      },
      reversed: {
        keywords: ["看不清", "过度寻找答案", "灯油不足"],
        reality: "越急着找方向，越容易把自己照得眼花。",
        advice: "今天先别追问全部答案，保留一点灯油。",
        campImpact: "小人会少整理，多停下来休息。",
        effects: { activityWeights: { observingGear: -0.25, resting: 0.3 } },
        moodLine: "占营说：灯有点暗，今天先别把路走得太满。",
        thoughtLines: ["灯油省着点", "先别找太远", "看不清也没事"]
      }
    },
    {
      id: "current",
      name: "The Current / 暗流",
      image: "assets/divination/tarot/tarot_current.png",
      baseEffects: {
        activityLabels: ["钓鱼", "看湖"],
        soundRecommendations: [{ id: "lake_water_loop", label: "湖水声" }],
        activityWeights: { fish: 0.45, lookingAtLake: 0.45 }
      },
      upright: {
        keywords: ["流动", "水下变化", "顺势"],
        reality: "事情表面安静，底下却已经在慢慢移动。",
        advice: "不用硬推，先顺着已经出现的线索走一点。",
        campImpact: "小人更容易去湖边钓鱼或观察水面。",
        moodLine: "占营说：水下有暗流，今天适合顺势等一等。",
        thoughtLines: ["水下好像有动静", "线索在慢慢来", "顺着水走"]
      },
      reversed: {
        keywords: ["被情绪带走", "暗处打转", "暂缓"],
        reality: "如果心里一直翻涌，今天不适合硬做决定。",
        advice: "先让情绪过一遍，不必马上顺着它行动。",
        campImpact: "小人会减少钓鱼冲动，多坐下看湖。",
        effects: { activityWeights: { fish: -0.25, sittingOnFurniture: 0.25, resting: 0.25 } },
        moodLine: "占营说：暗流有点乱，今天先不要急着下竿。",
        thoughtLines: ["水下有点乱", "先收一下线", "等等再说"]
      }
    },
    {
      id: "wing",
      name: "The Wing / 羽影",
      image: "assets/divination/tarot/tarot_wing.png",
      baseEffects: {
        activityLabels: ["观鸟", "听远处动静"],
        soundRecommendations: [{ id: "birds_morning_loop", label: "鸟鸣声" }],
        activityWeights: { birdwatch: 0.7, wandering: 0.2 }
      },
      upright: {
        keywords: ["消息", "轻盈", "远方动静"],
        reality: "轻一点的消息会先到，不一定完整，但能给你方向。",
        advice: "留意小信号，适合短沟通、轻确认。",
        campImpact: "小人更容易观鸟，声音推荐偏鸟鸣。",
        moodLine: "占营说：羽影掠过，今天留意轻轻来的消息。",
        thoughtLines: ["那边有动静", "轻一点就好", "有消息飞过来"]
      },
      reversed: {
        keywords: ["消息太多", "分心", "风声误判"],
        reality: "今天容易被零碎信息带走，不必每个动静都追。",
        advice: "挑重要的听，其余先让它飞过去。",
        campImpact: "小人会少乱逛，适合安静观察。",
        effects: { activityWeights: { wandering: -0.25, lookingAtLake: 0.25 } },
        moodLine: "占营说：风声有点多，今天别每一片羽影都追。",
        thoughtLines: ["声音有点多", "别追太远", "先听重点"]
      }
    },
    {
      id: "hearth",
      name: "The Hearth / 炉心",
      image: "assets/divination/tarot/tarot_hearth.png",
      baseEffects: {
        activityLabels: ["做饭", "补充体力"],
        soundRecommendations: [{ id: "cooking_sizzle_loop", label: "煎鱼声" }],
        activityWeights: { cook: 0.7, sittingByFire: 0.35, resting: 0.2 }
      },
      upright: {
        keywords: ["照顾", "日常", "身体需要"],
        reality: "今天的答案可能很朴素：吃好、坐稳、把日常照顾起来。",
        advice: "先满足身体和生活里的小需要，不要嫌它普通。",
        campImpact: "小人更想做饭和靠近热源。",
        moodLine: "占营说：炉心很稳，今天适合把自己照顾热乎。",
        thoughtLines: ["锅里会有答案", "先吃点热的", "日常也很重要"]
      },
      reversed: {
        keywords: ["忽略需要", "照顾过头", "空锅"],
        reality: "你可能在照顾别的事，却忘了自己也需要添一点热量。",
        advice: "别把小需求拖到最后；先补给，再安排。",
        campImpact: "小人会更倾向休息，再慢慢做饭。",
        effects: { activityWeights: { resting: 0.35, cook: 0.25 } },
        moodLine: "占营说：炉子还没灭，但今天要先照顾自己。",
        thoughtLines: ["先补一点力气", "别空着锅", "我也需要被照顾"]
      }
    },
    {
      id: "path",
      name: "The Path / 小径",
      image: "assets/divination/tarot/tarot_path.png",
      baseEffects: {
        activityLabels: ["散步", "探索"],
        activityWeights: { wandering: 0.65, birdwatch: 0.25, fish: 0.2 }
      },
      upright: {
        keywords: ["选择", "一步一步", "方向"],
        reality: "方向不是一次想清的，是一步一步踩出来的。",
        advice: "选一个可承受的小行动，今天先走第一段。",
        campImpact: "小人更愿意散步、探索湖边和林线。",
        moodLine: "占营说：小径已经露出来，今天走一小段就好。",
        thoughtLines: ["走一段看看", "路会慢慢出来", "第一步就够"]
      },
      reversed: {
        keywords: ["绕路", "犹豫", "方向太多"],
        reality: "路太多时，今天不必急着选最远那条。",
        advice: "先缩小范围，别把每个可能都背在身上。",
        campImpact: "小人会减少远走，更常坐下整理。",
        effects: { activityWeights: { wandering: -0.25, observingGear: 0.25 } },
        moodLine: "占营说：岔路很多，今天先把脚边这一段看清。",
        thoughtLines: ["先别走太远", "路有点多", "整理一下方向"]
      }
    },
    {
      id: "veil",
      name: "The Veil / 雾幕",
      image: "assets/divination/tarot/tarot_veil.png",
      baseEffects: {
        activityLabels: ["暂缓判断", "观察"],
        soundRecommendations: [{ id: "lake_water_loop", label: "湖水声" }],
        activityWeights: { resting: 0.45, lookingAtLake: 0.35, observingGear: 0.2 }
      },
      upright: {
        keywords: ["不清楚", "暂缓", "留白"],
        reality: "今天有些东西被雾遮着，暂时不清楚不是坏事。",
        advice: "别急着填满空白，等可见度自然变高。",
        campImpact: "小人会更安静，适合休息和观察。",
        moodLine: "占营说：雾幕还没散，今天适合暂缓判断。",
        thoughtLines: ["雾还没散", "先看着就好", "不清楚也没关系"]
      },
      reversed: {
        keywords: ["雾散一点", "别装看不见", "需要诚实"],
        reality: "其实你已经看见一点轮廓了，只是还没完全承认。",
        advice: "今天可以说出一个很小的真实感受。",
        campImpact: "小人会在安静和行动之间慢慢切换。",
        effects: { activityWeights: { lookingAtLake: 0.2, wandering: 0.2 } },
        moodLine: "占营说：雾散了一点，今天可以承认自己看见的轮廓。",
        thoughtLines: ["好像看见一点了", "慢慢说实话", "雾淡了一点"]
      }
    },
    {
      id: "drift",
      name: "The Drift / 浮云",
      image: "assets/divination/tarot/tarot_drift.png",
      baseEffects: {
        activityLabels: ["坐一会儿", "慢下来"],
        activityWeights: { sittingOnFurniture: 0.55, resting: 0.35, wandering: 0.15 }
      },
      upright: {
        keywords: ["松动", "变化", "不强求"],
        reality: "今天适合让事情自己松动一点，不必用力抓住。",
        advice: "给计划留一点弹性，变动未必是坏消息。",
        campImpact: "小人会更常坐下、慢慢晃到下一个地方。",
        moodLine: "占营说：云在慢慢飘，今天不必把一切钉死。",
        thoughtLines: ["云会自己走", "不强求", "慢慢飘过去"]
      },
      reversed: {
        keywords: ["飘太远", "拖延", "需要落地"],
        reality: "弹性很好，但今天也需要一个小小的落点。",
        advice: "选一件十分钟内能完成的事，把云拉回地面。",
        campImpact: "小人会更想整理装备或做一个小行动。",
        effects: { activityWeights: { observingGear: 0.3, wandering: 0.15 } },
        moodLine: "占营说：云飘得有点远，今天给自己一个落点。",
        thoughtLines: ["找个落点", "别飘太远", "做一点小事"]
      }
    },
    {
      id: "thorn",
      name: "The Thorn / 枝刺",
      image: "assets/divination/tarot/tarot_thorn.png",
      baseEffects: {
        activityLabels: ["避开冲动", "休息"],
        activityWeights: { resting: 0.45, tentRest: 0.25, observingGear: -0.35 }
      },
      upright: {
        keywords: ["摩擦", "边界", "小阻碍"],
        reality: "今天的小阻碍不是墙，更像提醒你别硬闯的枝刺。",
        advice: "绕开会划伤你的地方，尤其不要冲动消费或冲动回应。",
        campImpact: "小人会减少折腾装备，偏向休息和坐下。",
        moodLine: "占营说：枝刺提醒你，今天绕一下比硬闯舒服。",
        thoughtLines: ["别硬碰", "绕一下也可以", "今天少折腾"]
      },
      reversed: {
        keywords: ["刺已松动", "修补", "小心处理"],
        reality: "摩擦还在，但已经可以被温和处理。",
        advice: "先做修补，不做升级；小额尝试可以，大动作先缓缓。",
        campImpact: "小人会安静整理，但不太想大幅行动。",
        effects: { activityWeights: { observingGear: 0.1, sittingOnFurniture: 0.25 } },
        moodLine: "占营说：枝刺可以慢慢拔，不用急着扯开。",
        thoughtLines: ["小心一点就好", "慢慢修", "先别大动"]
      }
    },
    {
      id: "quiet",
      name: "The Quiet / 静处",
      image: "assets/divination/tarot/tarot_quiet.png",
      baseEffects: {
        activityLabels: ["独处", "看湖"],
        soundRecommendations: [{ id: "lake_water_loop", label: "湖水声" }],
        activityWeights: { resting: 0.55, lookingAtLake: 0.45, sittingOnFurniture: 0.25 }
      },
      upright: {
        keywords: ["停顿", "独处", "留白"],
        reality: "今天的力量在安静里，少一点输入反而会更清楚。",
        advice: "留一块不被安排的时间，不必向任何人解释。",
        campImpact: "小人会更偏 quiet idle、湖边和休息。",
        moodLine: "占营说：静处不是空白，是今天的补给点。",
        thoughtLines: ["安静一下", "这里刚刚好", "不说话也很好"]
      },
      reversed: {
        keywords: ["孤立", "闷住", "需要轻声连接"],
        reality: "安静很好，但别把自己关成完全听不见的状态。",
        advice: "可以只发出一点点信号，让可靠的人知道你在。",
        campImpact: "小人会从休息慢慢转向坐下或看湖。",
        effects: { activityWeights: { sittingOnFurniture: 0.35, lookingAtLake: 0.25 } },
        moodLine: "占营说：静处可以留门，今天不必完全消失。",
        thoughtLines: ["留一点声音", "我在这里", "安静但不消失"]
      }
    }
  ];

  const catalog = {
    version: 3,
    questionIds: questionIds,
    questions: questions,
    methods: {
      tarot: {
        id: "tarot",
        label: "塔罗",
        unlockedBy: "桌游套装",
        lockedHint: "买到并拥有桌游套装后解锁 Camping Tarot。",
        actionLabel: "抽一张卡"
      },
      turtle: {
        id: "turtle",
        label: "铜钱筮占",
        unlockedBy: "湖边乌龟",
        lockedHint: "钓鱼时遇到小乌龟后解锁。乌龟不会进冷藏箱，也不会成为食材。",
        actionLabel: "摇三枚铜钱"
      }
    },
    tarotCards: tarotCards,
    turtleLineLabels: {
      oldYin: "老阴 · 6 · 动",
      youngYang: "少阳 · 7",
      youngYin: "少阴 · 8",
      oldYang: "老阳 · 9 · 动"
    }
  };

  if (typeof window !== "undefined") {
    window.CAMP_DIVINATION_CATALOG = catalog;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = catalog;
  }
})();
