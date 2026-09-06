// Light/dark theme toggle, persisted in localStorage.

import { THEME_KEY } from "./constants.js";

function applyTheme(theme) {
  if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
  var btn = document.getElementById("themeToggle");
  if (btn) {
    var label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  }
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

// Wire the toggle button and apply any saved preference. Called once from main.
export function setupTheme() {
  var themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      applyTheme(isLight ? "dark" : "light");
    });
  }
  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (saved === "light") applyTheme("light");
}
