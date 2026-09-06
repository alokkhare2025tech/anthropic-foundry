// Parsers for the two hand-authored markdown files (exam.md, answer-key.md).
// Pure string processing — no DOM or state dependencies.

export function parseExam(md) {
  var lines = md.replace(/\r\n/g, "\n").split("\n");
  var firstQIdx = -1;
  for (var i = 0; i < lines.length; i++) {
    if (/^## Q\d+/.test(lines[i])) { firstQIdx = i; break; }
  }
  var header = firstQIdx === -1 ? lines : lines.slice(0, firstQIdx);
  var title = "";
  for (var h = 0; h < header.length; h++) {
    var m = header[h].match(/^Title:\s*(.*)$/);
    if (m) { title = m[1].trim(); break; }
  }

  var questions = [];
  if (firstQIdx !== -1) {
    var body = lines.slice(firstQIdx).join("\n");
    var blocks = body.split(/\n(?=## Q\d+)/g).filter(Boolean);
    blocks.forEach(function (block) {
      var bLines = block.split("\n");
      var qMatch = bLines[0].match(/^## Q(\d+)/);
      if (!qMatch) return;
      var num = parseInt(qMatch[1], 10);
      var idx = 1;
      while (idx < bLines.length && bLines[idx].trim() === "") idx++;

      var domainNum = null, domainName = "", subtopic = null, scenario = "";

      if (idx < bLines.length && /^Domain:/.test(bLines[idx])) {
        var dRaw = bLines[idx].replace(/^Domain:\s*/, "").trim();
        var dMatch = dRaw.match(/^(\d+)\.\s*(.*)$/);
        if (dMatch) { domainNum = parseInt(dMatch[1], 10); domainName = dMatch[2].trim(); }
        idx++;
      }
      if (idx < bLines.length && /^Subtopic:/.test(bLines[idx])) {
        var sRaw = bLines[idx].replace(/^Subtopic:\s*/, "").trim();
        var sMatch = sRaw.match(/^(\d+\.\d+)\s+(.*)$/);
        if (sMatch) subtopic = { id: sMatch[1], name: sMatch[2].trim() };
        else if (sRaw) subtopic = { id: "", name: sRaw };
        idx++;
      }
      if (idx < bLines.length && /^Scenario:/.test(bLines[idx])) {
        scenario = bLines[idx].replace(/^Scenario:\s*/, "").trim();
        idx++;
      }
      while (idx < bLines.length && bLines[idx].trim() === "") idx++;

      var stemLines = [];
      while (idx < bLines.length && !/^[A-D]\)\s?/.test(bLines[idx])) {
        stemLines.push(bLines[idx]);
        idx++;
      }

      // A blank line inside the block separates the scenario narrative
      // (first paragraph) from the actual question stem (the rest).
      var paragraphs = [];
      var cur = [];
      stemLines.forEach(function (line) {
        if (line.trim() === "") {
          if (cur.length) { paragraphs.push(cur.join("\n").trim()); cur = []; }
        } else cur.push(line);
      });
      if (cur.length) paragraphs.push(cur.join("\n").trim());
      paragraphs = paragraphs.filter(Boolean);

      var scenarioBody = "", stem = "";
      if (paragraphs.length >= 2) {
        scenarioBody = paragraphs[0];
        stem = paragraphs.slice(1).join("\n\n");
      } else {
        stem = paragraphs.join("\n\n");
      }

      var choices = {};
      while (idx < bLines.length) {
        var cMatch = bLines[idx].match(/^([A-D])\)\s*(.*)$/);
        if (cMatch) choices[cMatch[1]] = cMatch[2].trim();
        idx++;
      }

      questions.push({
        num: num, domainNum: domainNum, domainName: domainName,
        subtopic: subtopic, scenario: scenario, scenarioBody: scenarioBody,
        stem: stem, choices: choices
      });
    });
  }

  questions.sort(function (a, b) { return a.num - b.num; });
  return { title: title, questions: questions };
}

export function parseAnswerKey(md) {
  var lines = md.replace(/\r\n/g, "\n").split("\n");
  var blocks = lines.join("\n").split(/\n(?=## Q\d+)/g).filter(Boolean);
  var map = {};
  blocks.forEach(function (block) {
    var bLines = block.split("\n");
    var qMatch = bLines[0].match(/^## Q(\d+)/);
    if (!qMatch) return;
    var num = parseInt(qMatch[1], 10);
    var entry = { correct: "", explanation: "", why: {}, sources: [] };
    for (var i = 1; i < bLines.length; i++) {
      var line = bLines[i];
      var cMatch = line.match(/^Correct:\s*(.*)$/);
      var eMatch = line.match(/^Explanation:\s*(.*)$/);
      var wMatch = line.match(/^Why-([A-D]):\s*(.*)$/);
      var srcMatch = line.match(/^Source:\s*(.*)$/);
      if (cMatch) entry.correct = cMatch[1].trim();
      else if (eMatch) entry.explanation = eMatch[1].trim();
      else if (wMatch) entry.why[wMatch[1]] = wMatch[2].trim();
      else if (srcMatch && srcMatch[1].trim()) entry.sources.push(srcMatch[1].trim());
    }
    map[num] = entry;
  });
  return map;
}
