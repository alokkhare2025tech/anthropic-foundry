// Shared, mutable application state and cached DOM references.
// Every module imports these objects and mutates them by reference,
// which reproduces the single-closure semantics of the original file.
// Module scripts are deferred, so the DOM is parsed before this evaluates.

export var state = {
  examId: null,
  examTitle: "",
  questions: [], // { num, domainNum, domainName, subtopic:{id,name}, scenario, scenarioBody, stem, choices:{A,B,C,D} }
  answers: {},   // num -> letter
  flags: {},     // num -> true (review-later marker, not scored)
  key: null,     // num -> { correct, explanation, why:{A,B,C,D}, sources:[] }
  finished: false,
  view: "empty", // empty | exam | results | review | saved-result
  current: 0,
  savedResultMd: null
};

export var els = {
  search: document.getElementById("examSearch"),
  list: document.getElementById("examList"),
  picker: document.querySelector(".exam-picker"),
  toggle: document.getElementById("examToggle"),
  main: document.getElementById("main"),
  sidebar: document.getElementById("sidebar")
};
