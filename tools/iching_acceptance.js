const assert = require("assert");
const fs = require("fs");
const catalog = require("../js/config/ichingCatalog.js");
const manager = require("../js/systems/divinationManager.js");

function coinsForTotal(total) {
  const sides = {
    6: ["yin", "yin", "yin"],
    7: ["yang", "yin", "yin"],
    8: ["yang", "yang", "yin"],
    9: ["yang", "yang", "yang"]
  }[total];
  return { coins: sides.map(function(side) { return { side: side }; }) };
}

function resultForTotals(totals, questionId) {
  return manager.createResult({
    method: "turtle",
    questionId: questionId || "overall",
    lines: totals.map(coinsForTotal)
  });
}

function getSummaryIdentity(result) {
  return String(result && result.summary || "");
}

function assertCompactSummary(result, label) {
  const summary = String(result && result.summary || "");
  const sentenceCount = (summary.match(/[。！？]/g) || []).length;
  assert.ok(summary.length >= 40 && summary.length <= 60, label + " summary length: " + summary.length);
  assert.ok(sentenceCount <= 2, label + " summary sentence count");
  assert.ok(!/本卦|变卦|主辞|辅辞|\d+\s*个动爻|动爻使用|辞文/.test(summary), label + " summary has no technical wording");
}

const forbiddenActionCopy = /处理辞文指出|忽略辞文已经指出|结合现实情况|根据辞义|保持警惕并控制行动|结合爻位|脱离辞文|具体所指|具体矛盾/;
function assertShortActionPhrases(result, label) {
  [result.goodFor || [], result.avoid || []].forEach(function(items, sideIndex) {
    const side = sideIndex === 0 ? "good" : "avoid";
    assert.ok(items.length >= 2, label + " " + side + " has at least two phrases");
    assert.ok(items.length <= 3, label + " " + side + " has at most three phrases");
    items.forEach(function(item) {
      assert.ok(/^[\u3400-\u9fff]{2,8}$/.test(item), label + " " + side + " uses a 2-8 character phrase: " + item);
      assert.ok(!forbiddenActionCopy.test(item), label + " " + side + " has no placeholder copy: " + item);
    });
  });
}

const expectedRules = [
  "primaryJudgment", "oneMovingLine", "twoMovingLines", "bothJudgments",
  "twoChangedStaticLines", "oneChangedStaticLine", "changedJudgment"
];
const expectedSelectedCounts = [1, 1, 2, 2, 2, 1, 2];

for (let movingCount = 0; movingCount <= 6; movingCount += 1) {
  const totals = [7, 8, 7, 8, 7, 8].map(function(total, index) {
    return index < movingCount ? (total === 7 ? 9 : 6) : total;
  });
  const result = resultForTotals(totals);
  assert.strictEqual(result.readingBasis.ruleType, expectedRules[movingCount], "moving-count rule " + movingCount);
  assert.ok(Array.isArray(result.readingBasis.primaryTexts));
  assert.ok(Array.isArray(result.readingBasis.secondaryTexts));
  assert.strictEqual(result.readingBasis.items.length, expectedSelectedCounts[movingCount], "selected-text count " + movingCount);
  assert.ok(result.selectedTextSummary.includes("主辞"), "selected text names its primary role " + movingCount);
  assert.ok(result.selectedTextSummary.indexOf("主辞") === 0, "primary text displays first " + movingCount);
  assert.strictEqual(result.selectedTextSummary.includes("辅辞"), expectedSelectedCounts[movingCount] > 1, "secondary role " + movingCount);
  assertCompactSummary(result, "moving count " + movingCount);
  assertShortActionPhrases(result, "moving count " + movingCount);
  assert.ok(result.notices.length <= 2, "notice count " + movingCount);
}

const possibleCoinTotals = [6, 7, 8, 9];
for (let castCode = 0; castCode < 4096; castCode += 1) {
  let remainingCode = castCode;
  const totals = [];
  for (let position = 0; position < 6; position += 1) {
    totals.push(possibleCoinTotals[remainingCode % 4]);
    remainingCode = Math.floor(remainingCode / 4);
  }
  const result = resultForTotals(totals);
  assertCompactSummary(result, "cast " + totals.join(""));
  assertShortActionPhrases(result, "cast " + totals.join(""));
  assert.ok(result.notices.length <= 2, "cast notice count " + totals.join(""));
  assert.strictEqual(result.judgmentAnalysis.overallGrade, result.fortune, "public grade matches overallGrade " + totals.join(""));
  if (["大吉", "吉"].includes(result.fortune)) {
    assert.ok(!result.judgmentAnalysis.primaryVerdicts.some(function(verdict) {
      return ["danger", "doNotAct", "mustNot", "advanceBad", "bad", "difficulty", "regret", "unfavorable"].includes(verdict);
    }), "positive grade has no strong current warning " + totals.join(""));
  }
}

let distributionState = 0x5eed1234;
function distributionRandom() {
  distributionState = (Math.imul(distributionState, 1664525) + 1013904223) >>> 0;
  return distributionState / 4294967296;
}
function randomCoinTotal() {
  let total = 6;
  for (let coin = 0; coin < 3; coin += 1) {
    if (distributionRandom() < 0.5) total += 1;
  }
  return total;
}
const distributionSampleSize = 5000;
const gradeDistribution = { "大吉": 0, "吉": 0, "平": 0, "慎": 0, "凶": 0 };
for (let sample = 0; sample < distributionSampleSize; sample += 1) {
  const totals = Array.from({ length: 6 }, randomCoinTotal);
  gradeDistribution[resultForTotals(totals).fortune] += 1;
}
const dominantGradeCount = Math.max.apply(null, Object.values(gradeDistribution));
assert.ok(Object.values(gradeDistribution).every(function(count) { return count > 0; }), "all five grades appear in the distribution sample");
assert.ok(dominantGradeCount / distributionSampleSize < 0.75, "no grade dominates the distribution abnormally");

const twoMoving = resultForTotals([9, 8, 7, 8, 9, 8]);
assert.strictEqual(twoMoving.readingBasis.primaryTexts[0].position, 5, "two moving lines use the upper line as primary");
assert.strictEqual(twoMoving.readingBasis.secondaryTexts[0].position, 1);
const fourMoving = resultForTotals([9, 6, 7, 6, 9, 8]);
assert.strictEqual(fourMoving.readingBasis.primaryTexts[0].position, 3, "four moving lines use the lower unchanged line as primary");
assert.strictEqual(fourMoving.readingBasis.secondaryTexts[0].position, 6);

assert.strictEqual(resultForTotals([9, 9, 9, 9, 9, 9]).readingBasis.ruleType, "qianUseNine");
assert.strictEqual(resultForTotals([6, 6, 6, 6, 6, 6]).readingBasis.ruleType, "kunUseSix");

const originalQianFirst = catalog.hexagramsById[1].lines[0];
catalog.hexagramsById[1].lines[0] = {
  ...originalQianFirst,
  text: "征凶。",
  interpretation: "主动推进明确不利。",
  verdicts: ["advanceBad", "bad"],
  conditions: ["主动推进会招致不利。"],
  favorableActions: ["暂停"],
  unfavorableActions: ["强行推进"],
  severity: "high"
};
assert.strictEqual(resultForTotals([9, 7, 7, 7, 7, 7]).fortune, "凶", "line verdict must override Qian's name");
catalog.hexagramsById[1].lines[0] = originalQianFirst;

const dangerNoBlame = resultForTotals([7, 7, 9, 7, 7, 7]);
assert.strictEqual(dangerNoBlame.fortune, "慎");
assert.ok(dangerNoBlame.judgmentAnalysis.verdicts.includes("danger"));
assert.ok(dangerNoBlame.judgmentAnalysis.verdicts.includes("noBlame"));
assert.strictEqual(dangerNoBlame.fortuneTrend, "谨慎处理可避咎");
assert.deepStrictEqual(dangerNoBlame.notices, ["当前有风险，谨慎处理才可免咎。"]);

const correctGood = resultForTotals([8, 8, 8, 8, 8, 8]);
assert.strictEqual(correctGood.fortune, "吉");
assert.strictEqual(correctGood.fortuneTrend, "守正可成");
assert.deepStrictEqual(correctGood.notices, ["有利的前提是守正。"]);
assert.ok(correctGood.judgmentAnalysis.conditions.some(function(text) { return text.indexOf("守正") !== -1; }));

const regretGone = resultForTotals([7, 8, 7, 7, 7, 8]);
assert.strictEqual(regretGone.primaryHexagram.id, 49);
assert.ok(regretGone.judgmentAnalysis.verdicts.includes("regretGone"));
assert.ok(["平", "吉"].includes(regretGone.fortune));
assert.strictEqual(regretGone.fortuneTrend, "调整后转好");
assert.ok(regretGone.notices.includes("需要先作调整，问题才会逐步消退。"));
assert.ok(regretGone.judgmentAnalysis.conditions.some(function(text) { return text.indexOf("调整") !== -1; }));

const trappedToReform = resultForTotals([6, 9, 6, 7, 7, 8]);
assert.strictEqual(trappedToReform.primaryHexagram.id, 47);
assert.strictEqual(trappedToReform.changedHexagram.id, 49);
assert.strictEqual(trappedToReform.readingBasis.ruleType, "bothJudgments");
assert.strictEqual(trappedToReform.fortune, "平", "困 to 革 is mixed now rather than automatically cautious");
assert.strictEqual(trappedToReform.fortuneTrend, "守正待时可转吉");
assert.deepStrictEqual(trappedToReform.notices, [
  "此时言语未必能取信于人，空口解释作用有限。",
  "改变需等时机成熟，过早推动难获认同。"
]);
assert.ok(trappedToReform.interpretation.includes("以守正并妥善处理为前提，不表示当前已经顺遂"));
assert.ok(trappedToReform.interpretation.includes("辅辞的悔亡表示调整后才会转好，不能覆盖主辞所示的当前处境"));

const travelNineFour = resultForTotals([8, 8, 7, 9, 8, 7]);
assert.strictEqual(travelNineFour.primaryHexagram.id, 56);
assert.strictEqual(travelNineFour.readingBasis.primaryPosition, 4);
assert.ok(travelNineFour.summary.includes("已有暂时立足条件，但尚未真正安定"));
assert.ok(travelNineFour.summary.includes("关键是分清短暂落脚与长期归宿"));
assertCompactSummary(travelNineFour, "travel nine four");
assert.ok(travelNineFour.selectedTextSummary.includes("旅于處，得其資斧，我心不快"));
assert.ok(travelNineFour.interpretation.includes("暂得安处"));
assert.ok(travelNineFour.interpretation.includes("尚非归宿"));
assert.notStrictEqual(travelNineFour.summary, travelNineFour.interpretation, "summary and detailed explanation have distinct jobs");
assert.ok(!travelNineFour.interpretation.includes(travelNineFour.summary), "detail must not repeat the complete summary");
assert.ok(!/判断词|没有明确|为什么判|评分|ruleType/.test(travelNineFour.interpretation));
assert.ok(travelNineFour.goodFor.includes("稳住暂时落脚"));
assert.ok(travelNineFour.avoid.includes("误把落脚当归宿"));
assert.deepStrictEqual(travelNineFour.notices, [], "no material condition keeps notice section empty");
assert.ok(dangerNoBlame.notices.length > 0, "material warnings remain available");
const relationshipTravelNineFour = resultForTotals([8, 8, 7, 9, 8, 7], "relationship");
const relationshipQianFirst = resultForTotals([9, 7, 7, 7, 7, 7], "relationship");
assert.strictEqual(getSummaryIdentity(relationshipTravelNineFour), "眼下已有暂时立足条件，但尚未真正安定。就当前关系与沟通而言，关键是分清短暂落脚与长期归宿。");
assert.notStrictEqual(
  getSummaryIdentity(relationshipTravelNineFour),
  getSummaryIdentity(relationshipQianFirst),
  "different line texts in one topic must keep different core conflicts"
);

const kuiStaticTotals = catalog.hexagramsById[38].lineKey.split("").map(function(bit) { return bit === "1" ? 7 : 8; });
const kuiSummary = resultForTotals(kuiStaticTotals);
assert.strictEqual(kuiSummary.summary, "眼下火泽相背，差异明显，大事难合，小事可求同。关键是求小同并控制分歧，避免强求一致。");
assertCompactSummary(kuiSummary, "kui judgment");

const goodAnalysis = manager.assessSelectedTexts({
  primaryTexts: [{ source: "test", role: "primary", text: "元吉", interpretation: "条件成熟。", verdicts: ["supremeGood"], conditions: [], situationTags: [], favorableActions: [], unfavorableActions: [] }],
  secondaryTexts: []
});
const badAnalysis = manager.assessSelectedTexts({
  primaryTexts: [{ source: "test", role: "primary", text: "征凶", interpretation: "不可强进。", verdicts: ["advanceBad"], conditions: [], situationTags: [], favorableActions: [], unfavorableActions: [] }],
  secondaryTexts: []
});
assert.strictEqual(goodAnalysis.grade, "大吉", "unconditional supreme good remains great good");
assert.strictEqual(badAnalysis.grade, "凶");
const goodMoney = manager.getTopicGuidance("money", catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 0 }, goodAnalysis);
const badMoney = manager.getTopicGuidance("money", catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 0 }, badAnalysis);
assert.notDeepStrictEqual(goodMoney.goodFor, badMoney.goodFor);
assert.notDeepStrictEqual(goodMoney.avoid, badMoney.avoid);

const mergedNoticeAnalysis = manager.assessSelectedTexts({
  primaryTexts: [{
    source: "test", role: "primary", text: "厉，无咎，贞吉。", interpretation: "处境有风险，守正可以免咎。",
    verdicts: ["danger", "noBlame", "correctGood"],
    conditions: ["并非没有风险；处理得当，方可免于过失。", "处境有危险，必须保持警惕并控制行动。", "守正方吉。"],
    situationTags: ["风险"], favorableActions: ["保持警惕"], unfavorableActions: ["冒进"]
  }],
  secondaryTexts: []
});
const mergedNoticeGuidance = manager.getTopicGuidance("overall", catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 1 }, mergedNoticeAnalysis);
assert.deepStrictEqual(mergedNoticeGuidance.notices, [
  "当前有风险，谨慎处理才可免咎。",
  "有利的前提是守正。"
]);

function assessVerdictCase(verdicts, text, interpretation, secondaryTexts) {
  return manager.assessSelectedTexts({
    primaryTexts: [{
      source: "test", role: "primary", text: text, interpretation: interpretation,
      verdicts: verdicts, conditions: [], situationTags: [], favorableActions: [], unfavorableActions: []
    }],
    secondaryTexts: secondaryTexts || []
  });
}

const conditionalCorrect = assessVerdictCase(["correctGood"], "贞吉。", "守正才吉。");
const unconditionalSupremeGood = assessVerdictCase(["supremeGood"], "元吉。", "结果明确大好。");
const unconditionalGood = assessVerdictCase(["good"], "吉。", "条件明确，结果有利。");
const conditionalNoBlame = assessVerdictCase(["noBlame"], "无咎。", "妥善处理可以免咎。");
const conditionalRegretGone = assessVerdictCase(["regretGone"], "悔亡。", "调整后悔意消退。");
const conditionalDangerNoBlame = assessVerdictCase(["danger", "noBlame"], "厉，无咎。", "当前危险，谨慎才可免咎。");
const explicitAdvanceBad = assessVerdictCase(["advanceBad"], "征凶。", "主动推进明确不利。");
const explicitDoNotAct = assessVerdictCase(["doNotAct"], "勿用。", "时机未到，不宜行动。");
const explicitMustNot = assessVerdictCase(["mustNot"], "不可。", "此事不可强行实施。");
const badPrimaryGoodSecondary = assessVerdictCase(["bad"], "凶。", "当前结果明确不利。", [{
  source: "test secondary", role: "secondary", text: "元吉。", interpretation: "后续条件很好。",
  verdicts: ["supremeGood"], conditions: [], situationTags: [], favorableActions: [], unfavorableActions: []
}]);
const goodPrimaryBadSecondary = assessVerdictCase(["good"], "吉。", "当前结果明确有利。", [{
  source: "test secondary", role: "secondary", text: "厉。", interpretation: "后续仍有风险。",
  verdicts: ["danger"], conditions: [], situationTags: [], favorableActions: [], unfavorableActions: []
}]);
assert.strictEqual(conditionalCorrect.grade, "吉");
assert.strictEqual(conditionalCorrect.overallGrade, "吉");
assert.strictEqual(conditionalCorrect.trend, "守正可成");
assert.strictEqual(unconditionalSupremeGood.grade, "大吉");
assert.strictEqual(unconditionalGood.grade, "吉");
assert.strictEqual(conditionalNoBlame.grade, "平");
assert.strictEqual(conditionalNoBlame.trend, "处理得当可免咎");
assert.strictEqual(conditionalRegretGone.grade, "平");
assert.strictEqual(conditionalRegretGone.trend, "调整后转好");
assert.strictEqual(conditionalDangerNoBlame.grade, "慎");
assert.strictEqual(explicitAdvanceBad.grade, "凶");
assert.strictEqual(explicitDoNotAct.grade, "慎");
assert.strictEqual(explicitMustNot.grade, "慎");
assert.strictEqual(badPrimaryGoodSecondary.grade, "凶", "secondary good text cannot cover a bad primary text");
assert.strictEqual(goodPrimaryBadSecondary.grade, "吉", "secondary warning changes the trend, not a clearly good primary grade");
assert.strictEqual(goodPrimaryBadSecondary.trend, "后势转难，宜及时收束");

const noticeVerdictCases = [
  { verdicts: ["correctGood"], text: "贞吉。", interpretation: "守正才吉。" },
  { verdicts: ["noBlame"], text: "无咎。", interpretation: "妥善处理方可免咎。" },
  { verdicts: ["regretGone"], text: "悔亡。", interpretation: "调整后转好。" },
  { verdicts: ["danger"], text: "厉。", interpretation: "当前有危险。" },
  { verdicts: ["doNotAct"], text: "勿用。", interpretation: "时机未到。" },
  { verdicts: ["mustNot"], text: "不可。", interpretation: "不可强行实施。" },
  { verdicts: ["advanceBad"], text: "征凶。", interpretation: "主动推进不利。" },
  { verdicts: ["difficulty"], text: "吝。", interpretation: "条件局促。" },
  { verdicts: ["regret"], text: "悔。", interpretation: "已有悔意。" },
  { verdicts: ["unfavorable"], text: "不利。", interpretation: "当前方向不利。" },
  { verdicts: ["bad"], text: "凶。", interpretation: "结果明确不利。" }
];
const verdictNoticeTexts = noticeVerdictCases.map(function(testCase) {
  const analysis = assessVerdictCase(testCase.verdicts, testCase.text, testCase.interpretation);
  const guidance = manager.getTopicGuidance("overall", catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 1 }, analysis);
  assert.ok(guidance.notices[0], "notice exists for " + testCase.verdicts.join("+"));
  return guidance.notices[0];
});
assert.strictEqual(new Set(verdictNoticeTexts).size, noticeVerdictCases.length, "different verdict notices must not collapse to one template");
assert.ok(!verdictNoticeTexts.some(function(text) { return text.includes("保持警惕、控制行动"); }));

const topicGuidances = ["overall", "relationship", "money", "bodyMind"].map(function(topic) {
  return manager.getTopicGuidance(topic, catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 0 }, badAnalysis);
});
const topicOutputs = topicGuidances.map(function(guidance) { return guidance.interpretation; });
assert.strictEqual(new Set(topicOutputs).size, 4, "same semantics should have four topic expressions");
topicGuidances.forEach(function(guidance, index) {
  assertCompactSummary(guidance, "topic guidance " + index);
});
["overall", "relationship", "money", "bodyMind"].forEach(function(topic) {
  assertCompactSummary(resultForTotals([7, 9, 7, 6, 8, 7], topic), "short-condition cast " + topic);
});

const randomCasts = new Set();
for (let index = 0; index < 20; index += 1) {
  randomCasts.add(manager.createTurtleLines({ userSeed: "same", dateKey: "2026-01-01", salt: "same" }).map(function(line) { return line.total; }).join(""));
}
assert.ok(randomCasts.size > 1, "runtime casts must not reuse a fixed seed");

const legacyResult = resultForTotals([8, 8, 8, 8, 8, 8]);
delete legacyResult.judgmentAnalysis;
const legacy = manager.sanitizeSavedDivinations({}, "2026-01-01", {
  date: "2026-01-01", method: "turtle", question: "overall",
  result: legacyResult, effects: {}
});
assert.ok(legacy.records.turtle.overall.result, "legacy save remains loadable");
assert.ok(legacy.records.turtle.overall.result.judgmentAnalysis, "legacy turtle result is upgraded from its saved lines");

const stalePresentation = resultForTotals([8, 8, 7, 9, 8, 7], "relationship");
const staleTotals = stalePresentation.lines.map(function(line) { return line.total; });
stalePresentation.presentationVersion = 9;
stalePresentation.interpretation = "旧模板：不必急着给结果定性。";
const upgradedPresentationSave = manager.sanitizeSavedDivinations({
  date: "2026-01-01",
  records: {
    turtle: {
      relationship: { date: "2026-01-01", method: "turtle", question: "relationship", result: stalePresentation, effects: {} }
    }
  }
}, "2026-01-01");
const upgradedPresentation = upgradedPresentationSave.records.turtle.relationship.result;
assert.strictEqual(upgradedPresentation.presentationVersion, 10);
assert.deepStrictEqual(upgradedPresentation.lines.map(function(line) { return line.total; }), staleTotals, "presentation upgrade preserves coin lines");
assert.ok(!upgradedPresentation.interpretation.includes("不必急着给结果定性"));
assertShortActionPhrases(upgradedPresentation, "upgraded version 9 presentation");
assert.strictEqual(getSummaryIdentity(upgradedPresentation), "眼下已有暂时立足条件，但尚未真正安定。就当前关系与沟通而言，关键是分清短暂落脚与长期归宿。");

const semanticReviewKeys = new Set([
  "3:2", "9:3", "24:1", "29:5", "38:3", "43:3", "47:5",
  "49:2", "53:6", "54:3", "56:4", "57:6", "59:2", "63:4"
]);
const seenInterpretations = new Set();
const relationshipCoreConflicts = new Set();

catalog.hexagrams.forEach(function(hexagram) {
  assert.strictEqual(hexagram.lines.length, 6, hexagram.name + " must have six lines");
  [hexagram.judgmentMeaning].concat(hexagram.lines).forEach(function(meaning) {
    ["text", "interpretation", "verdicts", "situationTags", "favorableActions", "unfavorableActions", "conditions", "severity"].forEach(function(field) {
      assert.ok(Object.prototype.hasOwnProperty.call(meaning, field), hexagram.name + " missing " + field);
    });
  });
  hexagram.lines.forEach(function(line, index) {
    const yinYang = hexagram.lineKey[index] === "1" ? "九" : "六";
    const expectedName = index === 0 ? "初" + yinYang : index === 5 ? "上" + yinYang : yinYang + ["", "二", "三", "四", "五"][index];
    assert.strictEqual(line.lineName, expectedName, hexagram.name + " line name " + (index + 1));
    assert.ok(line.text, hexagram.name + " line text " + (index + 1));
    assert.notStrictEqual(line.dataStatus, "missingOriginal", hexagram.name + " line status " + (index + 1));
    assert.ok(Array.isArray(line.situationTags) && line.situationTags.length > 0);
    assert.ok(Array.isArray(line.favorableActions) && line.favorableActions.length > 0);
    assert.ok(Array.isArray(line.unfavorableActions) && line.unfavorableActions.length > 0);
    assert.ok(!/人工复核|人工校对|待人工|尚待/.test(line.interpretation), hexagram.name + " player-facing review text");
    if (hexagram.id > 2) {
      const reviewKey = hexagram.id + ":" + (index + 1);
      assert.strictEqual(line.needsSemanticReview, semanticReviewKeys.has(reviewKey), reviewKey + " review status");
      assert.strictEqual(Boolean(line.semanticReviewReason), semanticReviewKeys.has(reviewKey), reviewKey + " review reason");
      assert.ok(!seenInterpretations.has(line.interpretation), reviewKey + " duplicated interpretation");
      seenInterpretations.add(line.interpretation);
    }

    const oneMoving = Array.from({ length: 6 }, function(_, position) { return { position: position + 1, moving: position === index }; });
    const basis = manager.createReadingBasis(hexagram, hexagram, oneMoving);
    assert.strictEqual(basis.primaryTexts[0].text, line.text, hexagram.name + " selected line " + (index + 1));

    const oneMovingTotals = hexagram.lineKey.split("").map(function(bit, position) {
      if (position === index) return bit === "1" ? 9 : 6;
      return bit === "1" ? 7 : 8;
    });
    const topicResults = ["overall", "relationship", "money", "bodyMind"].map(function(topicId) {
      const result = resultForTotals(oneMovingTotals, topicId);
      assertShortActionPhrases(result, hexagram.name + line.lineName + " " + topicId);
      return result;
    });
    const relationshipResult = topicResults[1];
    const coreConflict = getSummaryIdentity(relationshipResult);
    assert.ok(coreConflict && !relationshipCoreConflicts.has(coreConflict), hexagram.name + line.lineName + " unique relationship conflict");
    assertCompactSummary(relationshipResult, hexagram.name + line.lineName);
    assert.ok(relationshipResult.notices.length <= 2, hexagram.name + line.lineName + " notice count");
    assert.ok(!/不必急着给结果定性|先观察回应|保持自然接触|给彼此一些时间|关注自己的真实感受/.test(
      relationshipResult.interpretation + relationshipResult.goodFor.join("|") + relationshipResult.avoid.join("|")
    ), hexagram.name + line.lineName + " no relationship boilerplate");
    relationshipCoreConflicts.add(coreConflict);
  });
});

const kuiSixThreeTotals = catalog.hexagramsById[38].lineKey.split("").map(function(bit, index) {
  if (index === 2) return bit === "1" ? 9 : 6;
  return bit === "1" ? 7 : 8;
});
const kuiSixThreeOverall = resultForTotals(kuiSixThreeTotals, "overall");
assert.deepStrictEqual(kuiSixThreeOverall.goodFor, ["化解眼前牵制", "稳住当前节奏", "坚持完成收尾"]);
assert.deepStrictEqual(kuiSixThreeOverall.avoid, ["受阻仍强推进", "急于扭转局面", "因狼狈而放弃"]);

assert.strictEqual(catalog.hexagrams.length, 64);
assert.strictEqual(catalog.hexagrams.reduce(function(total, hexagram) { return total + hexagram.lines.length; }, 0), 384);
assert.strictEqual(seenInterpretations.size, 372);
assert.strictEqual(relationshipCoreConflicts.size, 384);
assert.strictEqual(catalog.semanticReviewEntries.length, semanticReviewKeys.size);
assert.deepStrictEqual(new Set(catalog.semanticReviewEntries.map(function(item) { return item.hexagramId + ":" + item.position; })), semanticReviewKeys);
["../js/systems/divinationManager.js", "../js/systems/gameDivination.js"].forEach(function(relativePath) {
  const playerCode = fs.readFileSync(require.resolve(relativePath), "utf8");
  assert.ok(!/待人工|人工校对|人工复核|尚待.*校/.test(playerCode), relativePath + " must not expose semantic review state");
});
const managerSource = fs.readFileSync(require.resolve("../js/systems/divinationManager.js"), "utf8");
["不必急着给结果定性", "先观察回应", "保持自然接触", "给彼此一些时间", "关注自己的真实感受"].forEach(function(boilerplate) {
  assert.ok(!managerSource.includes(boilerplate), "generic relationship boilerplate removed: " + boilerplate);
});
assert.ok(!managerSource.includes("处境虽有风险，但只要保持警惕、控制行动，仍可免于过失"), "generic risk notice template removed");
const resultHtml = fs.readFileSync(require.resolve("../index.html"), "utf8");
const hierarchyLabels = ["卦象概括", "本次所取辞文", "需留意", ">宜<", ">忌<", "查看详细卦象", "解曰", "取辞依据", "所取原文"];
let previousLabelIndex = -1;
hierarchyLabels.forEach(function(label) {
  const labelIndex = resultHtml.indexOf(label);
  assert.ok(labelIndex > previousLabelIndex, "result hierarchy order: " + label);
  previousLabelIndex = labelIndex;
});
assert.ok(/id="divinationTurtleNotice"[^>]*hidden/.test(resultHtml), "notice section starts hidden");
assert.ok(resultHtml.indexOf("id=\"divinationTurtleInterpretation\"") > resultHtml.indexOf("id=\"divinationTurtleDetails\""), "interpretation lives inside details");
assert.ok(!/divinationResultCastDetails|divinationResultLineDetails|divinationResultDetailReading/.test(resultHtml), "duplicate detail nodes removed");
const resultRendererSource = fs.readFileSync(require.resolve("../js/systems/gameDivination.js"), "utf8");
assert.ok(!/六次铜钱|爻位细目|divinationResultCastDetails|divinationResultLineDetails|divinationResultDetailReading/.test(resultRendererSource), "duplicate detail rendering removed");
assert.ok(/classList\.toggle\("hidden", notices\.length === 0\)/.test(resultRendererSource), "notice section hides when no material notice exists");

console.log("I Ching grade distribution (" + distributionSampleSize + "): " + Object.keys(gradeDistribution).map(function(grade) {
  const count = gradeDistribution[grade];
  return grade + " " + count + " (" + (count * 100 / distributionSampleSize).toFixed(1) + "%)";
}).join(" / "));
console.log("I Ching acceptance: all checks passed");
