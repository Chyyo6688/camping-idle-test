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

const expectedRules = [
  "primaryJudgment", "oneMovingLine", "twoMovingLines", "bothJudgments",
  "twoChangedStaticLines", "oneChangedStaticLine", "changedJudgment"
];

for (let movingCount = 0; movingCount <= 6; movingCount += 1) {
  const totals = [7, 8, 7, 8, 7, 8].map(function(total, index) {
    return index < movingCount ? (total === 7 ? 9 : 6) : total;
  });
  const result = resultForTotals(totals);
  assert.strictEqual(result.readingBasis.ruleType, expectedRules[movingCount], "moving-count rule " + movingCount);
  assert.ok(Array.isArray(result.readingBasis.primaryTexts));
  assert.ok(Array.isArray(result.readingBasis.secondaryTexts));
}

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

const correctGood = resultForTotals([8, 8, 8, 8, 8, 8]);
assert.strictEqual(correctGood.fortune, "吉");
assert.ok(correctGood.judgmentAnalysis.conditions.some(function(text) { return text.indexOf("守正") !== -1; }));

const regretGone = resultForTotals([7, 8, 7, 7, 7, 8]);
assert.strictEqual(regretGone.primaryHexagram.id, 49);
assert.ok(regretGone.judgmentAnalysis.verdicts.includes("regretGone"));
assert.ok(regretGone.judgmentAnalysis.conditions.some(function(text) { return text.indexOf("调整") !== -1; }));

const travelNineFour = resultForTotals([8, 8, 7, 9, 8, 7]);
assert.strictEqual(travelNineFour.primaryHexagram.id, 56);
assert.strictEqual(travelNineFour.readingBasis.primaryPosition, 4);
assert.ok(travelNineFour.summary.includes("本卦「旅」呈现的总体处境"));
assert.ok(travelNineFour.selectedTextSummary.includes("旅于處，得其資斧，我心不快"));
assert.ok(travelNineFour.interpretation.includes("暂得安处"));
assert.ok(travelNineFour.interpretation.includes("尚非归宿"));
assert.ok(!/判断词|没有明确|为什么判|评分|ruleType/.test(travelNineFour.interpretation));
assert.ok(travelNineFour.goodFor.some(function(text) { return /暂时立足|真正安定/.test(text); }));
assert.ok(travelNineFour.avoid.some(function(text) { return /暂时落脚|不安/.test(text); }));
assert.deepStrictEqual(travelNineFour.notices, [], "no material condition keeps notice section empty");
assert.ok(dangerNoBlame.notices.length > 0, "material warnings remain available");
const relationshipTravelNineFour = resultForTotals([8, 8, 7, 9, 8, 7], "relationship");
const relationshipQianFirst = resultForTotals([9, 7, 7, 7, 7, 7], "relationship");
assert.ok(relationshipTravelNineFour.interpretation.endsWith("核心矛盾是：已有暂时立足条件，但尚未真正安定；需分清短暂落脚与长期归宿。"));
assert.notStrictEqual(
  relationshipTravelNineFour.interpretation.split("核心矛盾是：").pop(),
  relationshipQianFirst.interpretation.split("核心矛盾是：").pop(),
  "different line texts in one topic must keep different core conflicts"
);

const goodAnalysis = manager.assessSelectedTexts({
  primaryTexts: [{ source: "test", role: "primary", text: "元吉", interpretation: "条件成熟。", verdicts: ["supremeGood"], conditions: [], situationTags: [], favorableActions: [], unfavorableActions: [] }],
  secondaryTexts: []
});
const badAnalysis = manager.assessSelectedTexts({
  primaryTexts: [{ source: "test", role: "primary", text: "征凶", interpretation: "不可强进。", verdicts: ["advanceBad"], conditions: [], situationTags: [], favorableActions: [], unfavorableActions: [] }],
  secondaryTexts: []
});
const goodMoney = manager.getTopicGuidance("money", catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 0 }, goodAnalysis);
const badMoney = manager.getTopicGuidance("money", catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 0 }, badAnalysis);
assert.notDeepStrictEqual(goodMoney.goodFor, badMoney.goodFor);
assert.notDeepStrictEqual(goodMoney.avoid, badMoney.avoid);

const topicOutputs = ["overall", "relationship", "money", "bodyMind"].map(function(topic) {
  return manager.getTopicGuidance(topic, catalog.hexagramsById[1], catalog.hexagramsById[1], { movingCount: 0 }, badAnalysis).interpretation;
});
assert.strictEqual(new Set(topicOutputs).size, 4, "same semantics should have four topic expressions");

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
stalePresentation.presentationVersion = 2;
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
assert.strictEqual(upgradedPresentation.presentationVersion, 3);
assert.deepStrictEqual(upgradedPresentation.lines.map(function(line) { return line.total; }), staleTotals, "presentation upgrade preserves coin lines");
assert.ok(!upgradedPresentation.interpretation.includes("不必急着给结果定性"));
assert.ok(upgradedPresentation.interpretation.endsWith("核心矛盾是：已有暂时立足条件，但尚未真正安定；需分清短暂落脚与长期归宿。"));

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
    const relationshipResult = resultForTotals(oneMovingTotals, "relationship");
    const coreConflict = relationshipResult.interpretation.split("核心矛盾是：").pop();
    assert.ok(coreConflict && !relationshipCoreConflicts.has(coreConflict), hexagram.name + line.lineName + " unique relationship conflict");
    assert.ok(!/不必急着给结果定性|先观察回应|保持自然接触|给彼此一些时间|关注自己的真实感受/.test(
      relationshipResult.interpretation + relationshipResult.goodFor.join("|") + relationshipResult.avoid.join("|")
    ), hexagram.name + line.lineName + " no relationship boilerplate");
    relationshipCoreConflicts.add(coreConflict);
  });
});

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
const resultHtml = fs.readFileSync(require.resolve("../index.html"), "utf8");
const hierarchyLabels = ["卦象概括", "本次所取辞文", "解曰", ">宜<", ">忌<", "需留意", "查看详细卦象"];
let previousLabelIndex = -1;
hierarchyLabels.forEach(function(label) {
  const labelIndex = resultHtml.indexOf(label);
  assert.ok(labelIndex > previousLabelIndex, "result hierarchy order: " + label);
  previousLabelIndex = labelIndex;
});
assert.ok(/id="divinationTurtleNotice"[^>]*hidden/.test(resultHtml), "notice section starts hidden");

console.log("I Ching acceptance: all checks passed");
