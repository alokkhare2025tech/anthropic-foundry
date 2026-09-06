// Entry point. Wires the header shortcuts popover, the leave-page guard, and
// global keyboard paging, then boots the theme, picker, mode modal, and catalog.

import { els, state } from "./state.js";
import { setupTheme } from "./theme.js";
import { initPicker, loadCatalog } from "./catalog.js";
import { initModeModal } from "./exam.js";
import { goTo } from "./render.js";

// ---------- Keyboard shortcuts hint ----------

function initShortcuts() {
  var shortcutsBtn = document.getElementById("shortcutsBtn");
  var shortcutsPanel = document.getElementById("shortcutsPanel");

  function closeShortcuts() {
    if (!shortcutsPanel || shortcutsPanel.hidden) return;
    shortcutsPanel.hidden = true;
    shortcutsBtn.setAttribute("aria-expanded", "false");
  }

  if (shortcutsBtn && shortcutsPanel) {
    shortcutsBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = shortcutsPanel.hidden;
      shortcutsPanel.hidden = !willOpen;
      shortcutsBtn.setAttribute("aria-expanded", String(willOpen));
    });
    document.addEventListener("click", function (e) {
      if (!shortcutsPanel.hidden && e.target !== shortcutsBtn && !shortcutsPanel.contains(e.target)) closeShortcuts();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeShortcuts(); });
  }
}

// ---------- Leave-page guard ----------

function initLeaveGuard() {
  window.addEventListener("beforeunload", function (e) {
    if (state.view !== "exam" || state.finished) return;
    var message = "Your exam is still in progress. If you leave or reload this page now, your answers will not be saved and your progress will be lost. Are you sure you want to continue?";
    e.preventDefault();
    e.returnValue = message;
    return message;
  });
}

// ---------- Keyboard navigation ----------

function initKeyboardNav() {
  document.addEventListener("keydown", function (e) {
    if (state.view !== "exam" && state.view !== "review") return;
    if (document.activeElement === els.search) return;
    if (e.key === "ArrowLeft") goTo(state.current - 1);
    else if (e.key === "ArrowRight") goTo(state.current + 1);
  });
}

// ---------- Init ----------

setupTheme();
initShortcuts();
initPicker();
initModeModal();
initLeaveGuard();
initKeyboardNav();
loadCatalog();
