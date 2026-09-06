// The exam catalog and the header combobox/picker. Loads manifest.json and each
// exam's title, and drives the searchable dropdown.

import { BASE } from "./constants.js";
import { els } from "./state.js";
import { fetchText, showFetchError, escapeHtml } from "./utils.js";
import { parseExam } from "./parse.js";
import { selectExam } from "./exam.js";

var catalog = []; // { id, title }

export function loadCatalog() {
  return fetchText(BASE + "manifest.json")
    .then(function (raw) { return JSON.parse(raw); })
    .then(function (ids) {
      return Promise.all(
        ids.map(function (id) {
          return fetchText(BASE + id + "/exam.md")
            .then(function (md) {
              var parsed = parseExam(md);
              return { id: id, title: parsed.title || ("Exam " + id) };
            })
            .catch(function () { return { id: id, title: id + " (couldn't load)" }; });
        })
      );
    })
    .then(function (entries) { catalog = entries; renderList(catalog); })
    .catch(showFetchError);
}

function renderList(entries) {
  els.list.innerHTML = "";
  if (entries.length === 0) {
    var empty = document.createElement("div");
    empty.className = "empty-note";
    empty.textContent = "No exams match.";
    els.list.appendChild(empty);
    return;
  }
  entries.forEach(function (entry) {
    var li = document.createElement("li");
    li.setAttribute("role", "option");
    li.dataset.id = entry.id;
    li.innerHTML = '<span class="id">' + escapeHtml(entry.id) + "</span>" + escapeHtml(entry.title);
    li.addEventListener("click", function () { selectExam(entry.id); closeList(); });
    els.list.appendChild(li);
  });
}

function openList() { els.list.hidden = false; els.picker.setAttribute("aria-expanded", "true"); }
function closeList() { els.list.hidden = true; els.picker.setAttribute("aria-expanded", "false"); }

export function titleForId(id) {
  var entry = catalog.filter(function (e) { return e.id === id; })[0];
  return entry ? entry.title : ("Exam " + id);
}

// Wire the combobox listeners. Called once from main.
export function initPicker() {
  els.search.addEventListener("focus", function () { renderList(catalog); openList(); });
  els.search.addEventListener("input", function () {
    var q = els.search.value.trim().toLowerCase();
    var filtered = catalog.filter(function (e) {
      return e.id.toLowerCase().indexOf(q) !== -1 || e.title.toLowerCase().indexOf(q) !== -1;
    });
    renderList(filtered);
    openList();
  });
  els.search.addEventListener("keydown", function (e) { if (e.key === "Escape") closeList(); });
  els.toggle.addEventListener("click", function () {
    if (els.list.hidden) { renderList(catalog); openList(); els.search.focus(); }
    else { closeList(); }
  });
  document.addEventListener("click", function (e) { if (!els.picker.contains(e.target)) closeList(); });
}
