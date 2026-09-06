// Domain-weighted scoring on a 1000-point scale (see README "Scoring").

import { state } from "./state.js";
import { DOMAIN_META, PASS_FRACTION } from "./constants.js";

export function computeResults() {
  var byDomain = {};
  var correctAll = 0;
  state.questions.forEach(function (q) {
    var d = q.domainNum;
    var k = state.key && state.key[q.num];
    var isCorrectQ = !!(k && state.answers[q.num] === k.correct);
    if (isCorrectQ) correctAll++;
    if (d && DOMAIN_META[d]) {
      if (!byDomain[d]) byDomain[d] = { correct: 0, total: 0 };
      byDomain[d].total++;
      if (isCorrectQ) byDomain[d].correct++;
    }
  });

  var present = Object.keys(byDomain).map(Number).sort(function (a, b) { return a - b; });
  var totalWeight = 0;
  present.forEach(function (d) { totalWeight += DOMAIN_META[d].weight; });
  if (!totalWeight) totalWeight = 1;

  var perDomain = {}, score = 0, total = 0;
  present.forEach(function (d) {
    var bd = byDomain[d];
    var acc = bd.total ? bd.correct / bd.total : 0;
    var maxPts = Math.round(1000 * DOMAIN_META[d].weight / totalWeight);
    var earnPts = Math.round(1000 * DOMAIN_META[d].weight / totalWeight * acc);
    perDomain[d] = { correct: bd.correct, total: bd.total, acc: acc, maxPts: maxPts, earnPts: earnPts };
    score += earnPts;
    total += maxPts;
  });

  var totalQ = state.questions.length;
  var pass = Math.round(PASS_FRACTION * total);
  var pct = totalQ ? Math.round(correctAll / totalQ * 100) : 0;

  return {
    perDomain: perDomain, present: present,
    score: score, total: total, pass: pass, passed: score >= pass,
    correctCount: correctAll, totalQ: totalQ, pct: pct
  };
}

export function isCorrect(q) {
  var k = state.key && state.key[q.num];
  return !!(k && state.answers[q.num] === k.correct);
}
