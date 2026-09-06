// Timed-mode countdown: 2 minutes per question, auto-finishing at zero.

import { formatTime } from "./utils.js";
import { finishExam } from "./exam.js";

var timerIntervalId = null;
var timerTotalSec = 0;
var timerRemainingSec = 0;

// Live read of the remaining seconds, for the progress header in render.js.
export function remainingSec() { return timerRemainingSec; }

export function clearExamTimer() {
  if (timerIntervalId) { clearInterval(timerIntervalId); timerIntervalId = null; }
}

export function updateTimerDisplay() {
  var el = document.getElementById("examTimer");
  if (!el) return;
  el.textContent = formatTime(timerRemainingSec);
  el.classList.toggle("timer-warn", timerRemainingSec <= Math.ceil(timerTotalSec * 0.1));
}

export function startTimer(questionCount) {
  clearExamTimer();
  timerTotalSec = questionCount * 2 * 60;
  timerRemainingSec = timerTotalSec;
  timerIntervalId = setInterval(function () {
    timerRemainingSec--;
    if (timerRemainingSec <= 0) {
      timerRemainingSec = 0;
      updateTimerDisplay();
      clearExamTimer();
      finishExam(true);
      return;
    }
    updateTimerDisplay();
  }, 1000);
}
