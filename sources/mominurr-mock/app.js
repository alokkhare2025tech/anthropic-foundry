/* ═══════════════════════════════════════════════════════════
   CCA-F Mock Exam — Application Logic
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Domain Config ──────────────────────────────────────────
const DOMAINS = [
  { name: 'Agentic Architecture & Orchestration', color: '#7C3AED', total: 16 },
  { name: 'Claude Code Configuration & Workflows', color: '#0891B2', total: 12 },
  { name: 'Prompt Engineering & Structured Output', color: '#059669', total: 12 },
  { name: 'Tool Design & MCP Integration', color: '#D97706', total: 11 },
  { name: 'Context Management & Reliability', color: '#DC2626', total: 9 },
];

const TOTAL_SECONDS = 120 * 60; // 120 minutes
const WARNING_SECONDS = 15 * 60; // 15 minutes
const STORAGE_KEY = 'ccaf_exam_state';

// ── Application State ──────────────────────────────────────
const AppState = {
  screen: 'welcome',
  questions: [],
  answers: {},
  flags: new Set(),
  currentIndex: 0,
  startTime: null,
  totalSeconds: TOTAL_SECONDS,
  remainingSeconds: TOTAL_SECONDS,
  timerInterval: null,
  submitted: false,
  score: null,
};

// ── DOM References ─────────────────────────────────────────
const DOM = {};

function cacheDOMRefs() {
  DOM.screenWelcome = document.getElementById('screen-welcome');
  DOM.screenExam    = document.getElementById('screen-exam');
  DOM.screenResults = document.getElementById('screen-results');

  DOM.btnStart       = document.getElementById('btn-start');
  DOM.btnPrev        = document.getElementById('btn-prev');
  DOM.btnNext        = document.getElementById('btn-next');
  DOM.btnFlag        = document.getElementById('btn-flag');
  DOM.btnSubmit      = document.getElementById('btn-submit');
  DOM.btnRestart     = document.getElementById('btn-restart');
  DOM.btnReviewToggle = document.getElementById('btn-review-toggle');
  DOM.themeToggle    = document.getElementById('theme-toggle');

  DOM.questionCard   = document.getElementById('question-card');
  DOM.progressFill   = document.getElementById('progress-fill');
  DOM.progressLabel  = document.getElementById('progress-label');
  DOM.paletteContainer = document.getElementById('palette-container');

  DOM.timerDisplay    = document.getElementById('timer-display');
  DOM.timerWarningMsg = document.getElementById('timer-warning-msg');
  DOM.statAnswered    = document.getElementById('stat-answered');
  DOM.statFlagged     = document.getElementById('stat-flagged');
  DOM.statUnanswered  = document.getElementById('stat-unanswered');

  DOM.scoreCard      = document.getElementById('score-card');
  DOM.resultBadge    = document.getElementById('result-badge');
  DOM.scaledScore    = document.getElementById('scaled-score');
  DOM.scoreRaw       = document.getElementById('score-raw');
  DOM.domainBreakdown = document.getElementById('domain-breakdown');

  DOM.reviewContainer  = document.getElementById('review-container');
  DOM.reviewList       = document.getElementById('review-list');

  DOM.modalOverlay  = document.getElementById('modal-overlay');
  DOM.modalOk       = document.getElementById('modal-ok');

  DOM.resumeModalOverlay = document.getElementById('resume-modal-overlay');
  DOM.resumeYes          = document.getElementById('resume-yes');
  DOM.resumeNo           = document.getElementById('resume-no');
}

// ── Utilities ──────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function showScreen(name) {
  [DOM.screenWelcome, DOM.screenExam, DOM.screenResults].forEach(el => el.classList.add('hidden'));
  if (name === 'welcome') DOM.screenWelcome.classList.remove('hidden');
  else if (name === 'exam') DOM.screenExam.classList.remove('hidden');
  else if (name === 'results') DOM.screenResults.classList.remove('hidden');
  AppState.screen = name;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── Theme ──────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('ccaf_theme') || 'light';
  document.documentElement.dataset.theme = saved;
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('ccaf_theme', next);
}

// ── LocalStorage Save/Load ─────────────────────────────────
function saveState() {
  if (AppState.submitted) return;
  const payload = {
    questions: AppState.questions,
    answers: AppState.answers,
    flags: [...AppState.flags],
    currentIndex: AppState.currentIndex,
    startTime: AppState.startTime,
    totalSeconds: AppState.totalSeconds,
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch(e) {}
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.questions || !data.startTime) return null;
    // Check if time has already expired
    const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
    if (elapsed >= data.totalSeconds) {
      clearSavedState();
      return null;
    }
    return data;
  } catch(e) { return null; }
}

function clearSavedState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
}

// ── Exam Lifecycle ─────────────────────────────────────────
function startExam(savedState = null) {
  if (savedState) {
    AppState.questions    = savedState.questions;
    AppState.answers      = savedState.answers || {};
    AppState.flags        = new Set(savedState.flags || []);
    AppState.currentIndex = savedState.currentIndex || 0;
    AppState.startTime    = savedState.startTime;
    AppState.totalSeconds = savedState.totalSeconds || TOTAL_SECONDS;
    const elapsed = Math.floor((Date.now() - AppState.startTime) / 1000);
    AppState.remainingSeconds = Math.max(0, AppState.totalSeconds - elapsed);
  } else {
    AppState.questions    = shuffleArray(QUESTION_BANK);
    AppState.answers      = {};
    AppState.flags        = new Set();
    AppState.currentIndex = 0;
    AppState.startTime    = Date.now();
    AppState.totalSeconds = TOTAL_SECONDS;
    AppState.remainingSeconds = TOTAL_SECONDS;
  }
  AppState.submitted = false;
  AppState.score = null;

  renderPalette();
  showScreen('exam');
  goToQuestion(AppState.currentIndex);
  startTimer();
  if (!savedState) saveState();
}

function submitExam(isAutoSubmit = false) {
  if (AppState.submitted) return;
  AppState.submitted = true;
  stopTimer();
  clearSavedState();

  AppState.score = computeScore();

  if (isAutoSubmit) {
    DOM.modalOverlay.classList.remove('hidden');
    DOM.modalOk.onclick = () => {
      DOM.modalOverlay.classList.add('hidden');
      renderResults();
      showScreen('results');
    };
  } else {
    renderResults();
    showScreen('results');
  }
}

function confirmSubmit() {
  const answered = Object.values(AppState.answers).filter(v => v !== null).length;
  const unanswered = AppState.questions.length - answered;
  const msg = unanswered > 0
    ? `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`
    : 'Are you sure you want to submit your exam?';
  if (confirm(msg)) submitExam(false);
}

// ── Timer ──────────────────────────────────────────────────
function startTimer() {
  stopTimer();
  updateTimerDisplay();
  AppState.timerInterval = setInterval(tickTimer, 1000);
}

function tickTimer() {
  const elapsed = Math.floor((Date.now() - AppState.startTime) / 1000);
  AppState.remainingSeconds = Math.max(0, AppState.totalSeconds - elapsed);
  updateTimerDisplay();

  if (AppState.remainingSeconds <= 0) {
    stopTimer();
    submitExam(true);
  }
}

function updateTimerDisplay() {
  const t = AppState.remainingSeconds;
  DOM.timerDisplay.textContent = formatTime(t);

  if (t <= WARNING_SECONDS && t > 0) {
    DOM.timerDisplay.classList.add('warning');
    DOM.timerWarningMsg.classList.remove('hidden');
  } else {
    DOM.timerDisplay.classList.remove('warning');
    DOM.timerWarningMsg.classList.add('hidden');
  }
}

function stopTimer() {
  if (AppState.timerInterval) {
    clearInterval(AppState.timerInterval);
    AppState.timerInterval = null;
  }
}

// ── Question Navigation ────────────────────────────────────
function goToQuestion(index) {
  AppState.currentIndex = index;
  renderQuestion(index);
  updatePalette();
  updateProgress();
  updateNavButtons();
  updateStats();
}

function renderQuestion(index) {
  const q = AppState.questions[index];
  const selectedAnswer = AppState.answers[q.id] || null;
  const isFlagged = AppState.flags.has(q.id);

  let html = `<div class="question-meta">
    <span class="q-number">Q${index + 1} of ${AppState.questions.length}</span>
    ${isFlagged ? '<span class="q-flagged-indicator">⚑ Flagged</span>' : ''}
  </div>`;

  if (q.scenario) {
    html += `<div class="scenario-block"><span class="scenario-label">Scenario</span>${escapeHtml(q.scenario)}</div>`;
  }

  html += `<p class="question-text" id="q-text-${index}">${escapeHtml(q.question)}</p>`;

  html += `<div class="options-group" role="radiogroup" aria-labelledby="q-text-${index}">`;
  q.options.forEach(opt => {
    const isSelected = selectedAnswer === opt.letter;
    html += `<label class="option-label${isSelected ? ' selected' : ''}" data-letter="${opt.letter}">
      <input type="radio" name="answer" value="${opt.letter}" ${isSelected ? 'checked' : ''} aria-label="Option ${opt.letter}">
      <span class="option-letter">${opt.letter}</span>
      <span class="option-text">${escapeHtml(opt.text)}</span>
    </label>`;
  });
  html += `</div>`;

  DOM.questionCard.innerHTML = html;
  DOM.questionCard.scrollTop = 0;

  // Update flag button state
  DOM.btnFlag.classList.toggle('active', isFlagged);
  DOM.btnFlag.setAttribute('aria-pressed', String(isFlagged));
}

function updateProgress() {
  const pct = ((AppState.currentIndex + 1) / AppState.questions.length) * 100;
  DOM.progressFill.style.width = pct + '%';
  DOM.progressFill.setAttribute('aria-valuenow', Math.round(pct));
  DOM.progressLabel.textContent = `Question ${AppState.currentIndex + 1} of ${AppState.questions.length}`;
}

function updateNavButtons() {
  DOM.btnPrev.disabled = AppState.currentIndex === 0;
  DOM.btnNext.textContent = AppState.currentIndex === AppState.questions.length - 1 ? 'Last Question' : 'Next';
  DOM.btnNext.innerHTML = AppState.currentIndex === AppState.questions.length - 1
    ? 'Last Question'
    : `Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
}

function updateStats() {
  const answered = Object.values(AppState.answers).filter(v => v !== null).length;
  const flagged = AppState.flags.size;
  const unanswered = AppState.questions.length - answered;
  DOM.statAnswered.textContent = answered;
  DOM.statFlagged.textContent = flagged;
  DOM.statUnanswered.textContent = unanswered;
}

// ── Answer Handling ────────────────────────────────────────
function handleAnswerSelect(questionId, letter) {
  AppState.answers[questionId] = letter;
  // Update UI for option labels
  document.querySelectorAll('.option-label').forEach(label => {
    const isSelected = label.dataset.letter === letter;
    label.classList.toggle('selected', isSelected);
  });
  updatePaletteCell(AppState.currentIndex);
  updateStats();
  saveState();
}

function handleFlagToggle() {
  const q = AppState.questions[AppState.currentIndex];
  if (AppState.flags.has(q.id)) {
    AppState.flags.delete(q.id);
    DOM.btnFlag.classList.remove('active');
    DOM.btnFlag.setAttribute('aria-pressed', 'false');
  } else {
    AppState.flags.add(q.id);
    DOM.btnFlag.classList.add('active');
    DOM.btnFlag.setAttribute('aria-pressed', 'true');
  }
  updatePaletteCell(AppState.currentIndex);
  updateStats();
  saveState();
  // Re-render the flagged indicator in the question meta
  const q2 = AppState.questions[AppState.currentIndex];
  const isFlagged = AppState.flags.has(q2.id);
  const metaEl = DOM.questionCard.querySelector('.question-meta');
  if (metaEl) {
    const existing = metaEl.querySelector('.q-flagged-indicator');
    if (isFlagged && !existing) {
      metaEl.insertAdjacentHTML('beforeend', '<span class="q-flagged-indicator">⚑ Flagged</span>');
    } else if (!isFlagged && existing) {
      existing.remove();
    }
  }
}

// ── Palette ────────────────────────────────────────────────
function renderPalette() {
  let html = '';
  AppState.questions.forEach((q, i) => {
    html += `<button class="palette-cell" data-index="${i}" role="listitem" aria-label="Question ${i+1}">${i+1}</button>`;
  });
  DOM.paletteContainer.innerHTML = html;
}

function updatePalette() {
  AppState.questions.forEach((q, i) => {
    updatePaletteCell(i);
  });
}

function updatePaletteCell(index) {
  const q = AppState.questions[index];
  const cell = DOM.paletteContainer.querySelector(`[data-index="${index}"]`);
  if (!cell) return;

  const isAnswered = AppState.answers[q.id] !== null && AppState.answers[q.id] !== undefined;
  const isFlagged  = AppState.flags.has(q.id);
  const isCurrent  = index === AppState.currentIndex;

  cell.className = 'palette-cell';
  if (isCurrent) cell.classList.add('current');
  if (isAnswered) cell.classList.add('answered');
  if (isFlagged) cell.classList.add('flagged');

  let ariaLabel = `Question ${index + 1}`;
  if (isAnswered) ariaLabel += ', answered';
  if (isFlagged) ariaLabel += ', flagged';
  if (isCurrent) ariaLabel += ', current';
  cell.setAttribute('aria-label', ariaLabel);
}

// ── Scoring ────────────────────────────────────────────────
function computeScore() {
  let rawCorrect = 0;
  const domainCorrect = new Array(DOMAINS.length).fill(0);
  const domainTotal = new Array(DOMAINS.length).fill(0);

  AppState.questions.forEach(q => {
    domainTotal[q.domainIndex]++;
    const userAnswer = AppState.answers[q.id];
    if (userAnswer === q.correctAnswer) {
      rawCorrect++;
      domainCorrect[q.domainIndex]++;
    }
  });

  const scaledScore = scaleScore(rawCorrect);
  const passed = scaledScore >= 720;

  const domainBreakdown = DOMAINS.map((d, i) => ({
    name: d.name,
    color: d.color,
    correct: domainCorrect[i],
    total: domainTotal[i],
    pct: domainTotal[i] > 0 ? Math.round((domainCorrect[i] / domainTotal[i]) * 100) : 0,
  }));

  return { rawCorrect, total: AppState.questions.length, scaledScore, passed, domainBreakdown };
}

function scaleScore(rawCorrect) {
  return Math.round(100 + (rawCorrect / 60) * 900);
}

// ── Results Rendering ──────────────────────────────────────
function renderResults() {
  const s = AppState.score;

  // Score card
  DOM.resultBadge.className = 'result-badge ' + (s.passed ? 'pass' : 'fail');
  DOM.resultBadge.textContent = s.passed ? '✓ PASSED' : '✗ NOT PASSED';
  DOM.scaledScore.textContent = s.scaledScore;
  DOM.scoreRaw.textContent = `You answered ${s.rawCorrect} of ${s.total} questions correctly.`;

  // Animate score
  animateNumber(DOM.scaledScore, 0, s.scaledScore, 1200);

  // Domain breakdown
  let breakdownHtml = '';
  s.domainBreakdown.forEach(d => {
    breakdownHtml += `
      <div class="domain-row">
        <div class="domain-row-header">
          <span class="domain-name">${escapeHtml(d.name)}</span>
          <span class="domain-score">${d.correct} / ${d.total} (${d.pct}%)</span>
        </div>
        <div class="domain-progress-track">
          <div class="domain-progress-fill" style="width:0%; background:${d.color}" data-target="${d.pct}"></div>
        </div>
      </div>`;
  });
  DOM.domainBreakdown.innerHTML = breakdownHtml;

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.domain-progress-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 100);
}

function renderReview() {
  let html = '';
  AppState.questions.forEach((q, index) => {
    const userAnswer = AppState.answers[q.id] || null;
    const isCorrect = userAnswer === q.correctAnswer;
    const isUnanswered = !userAnswer;

    let iconClass = 'unanswered';
    let iconText = '–';
    if (!isUnanswered) {
      iconClass = isCorrect ? 'correct' : 'incorrect';
      iconText = isCorrect ? '✓' : '✗';
    }

    let optionsHtml = '';
    q.options.forEach(opt => {
      let cls = 'neutral';
      let suffix = '';
      if (opt.letter === q.correctAnswer) {
        cls = 'correct-answer';
        suffix = '<span class="review-option-suffix" style="color:var(--color-correct)">✓ Correct</span>';
      }
      if (!isUnanswered && opt.letter === userAnswer && !isCorrect) {
        cls = 'user-wrong';
        suffix = '<span class="review-option-suffix" style="color:var(--color-incorrect)">✗ Your answer</span>';
      }
      if (opt.letter === q.correctAnswer && !isUnanswered && userAnswer === q.correctAnswer) {
        suffix = '<span class="review-option-suffix" style="color:var(--color-correct)">✓ Your answer</span>';
      }
      optionsHtml += `<div class="review-option ${cls}">
        <span class="review-option-letter">${opt.letter}</span>
        <span class="review-option-text">${escapeHtml(opt.text)}</span>
        ${suffix}
      </div>`;
    });

    // Wrong answer explanations (exclude correct answer)
    let wrongHtml = '';
    if (q.wrongAnswerExplanations) {
      const entries = Object.entries(q.wrongAnswerExplanations).filter(([l]) => l !== q.correctAnswer);
      if (entries.length) {
        wrongHtml = `<div class="wrong-explanations">${entries.map(([l, exp]) =>
          `<div class="wrong-exp-item"><strong>Why ${l} is incorrect:</strong> ${escapeHtml(exp)}</div>`
        ).join('')}</div>`;
      }
    }

    const unansweredNote = isUnanswered
      ? `<div class="wrong-exp-item" style="border-color:var(--color-text-muted)"><strong>Not answered.</strong> The correct answer is <strong>${q.correctAnswer}</strong>.</div>`
      : '';

    html += `
      <div class="review-item" data-index="${index}">
        <div class="review-item-header" role="button" tabindex="0" aria-expanded="false">
          <span class="review-icon ${iconClass}">${iconText}</span>
          <span class="review-q-text">${index+1}. ${escapeHtml(q.question)}</span>
          <svg class="review-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="review-item-body">
          ${q.scenario ? `<div class="review-scenario"><strong>Scenario:</strong> ${escapeHtml(q.scenario)}</div>` : ''}
          <div class="review-options">${optionsHtml}</div>
          <div class="explanation-box">
            <div class="explanation-label">Explanation</div>
            <div class="explanation-text">${escapeHtml(q.explanation)}</div>
          </div>
          ${unansweredNote}
          ${wrongHtml}
        </div>
      </div>`;
  });

  DOM.reviewList.innerHTML = html;
}

function animateNumber(el, start, end, duration) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── HTML Escaping ──────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Event Listeners ────────────────────────────────────────
function attachEventListeners() {
  // Theme toggle
  DOM.themeToggle.addEventListener('click', toggleTheme);

  // Welcome → start
  DOM.btnStart.addEventListener('click', () => {
    const saved = loadSavedState();
    if (saved) {
      DOM.resumeModalOverlay.classList.remove('hidden');
    } else {
      startExam(null);
    }
  });

  // Resume modal
  DOM.resumeYes.addEventListener('click', () => {
    DOM.resumeModalOverlay.classList.add('hidden');
    startExam(loadSavedState());
  });
  DOM.resumeNo.addEventListener('click', () => {
    clearSavedState();
    DOM.resumeModalOverlay.classList.add('hidden');
    startExam(null);
  });

  // Navigation
  DOM.btnPrev.addEventListener('click', () => {
    if (AppState.currentIndex > 0) goToQuestion(AppState.currentIndex - 1);
  });
  DOM.btnNext.addEventListener('click', () => {
    if (AppState.currentIndex < AppState.questions.length - 1) goToQuestion(AppState.currentIndex + 1);
  });

  // Flag
  DOM.btnFlag.addEventListener('click', handleFlagToggle);

  // Answer selection — event delegation on question card
  DOM.questionCard.addEventListener('change', e => {
    if (e.target.type === 'radio' && e.target.name === 'answer') {
      const q = AppState.questions[AppState.currentIndex];
      handleAnswerSelect(q.id, e.target.value);
    }
  });

  // Palette clicks — event delegation
  DOM.paletteContainer.addEventListener('click', e => {
    const cell = e.target.closest('.palette-cell');
    if (cell) {
      const idx = parseInt(cell.dataset.index, 10);
      goToQuestion(idx);
    }
  });

  // Submit
  DOM.btnSubmit.addEventListener('click', confirmSubmit);

  // Results
  DOM.btnRestart.addEventListener('click', () => {
    clearSavedState();
    showScreen('welcome');
    DOM.reviewContainer.classList.add('hidden');
    DOM.btnReviewToggle.innerHTML = 'Review All Questions <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  });

  DOM.btnReviewToggle.addEventListener('click', () => {
    const isHidden = DOM.reviewContainer.classList.contains('hidden');
    if (isHidden) {
      renderReview();
      DOM.reviewContainer.classList.remove('hidden');
      DOM.btnReviewToggle.innerHTML = 'Hide Review <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
      setTimeout(() => DOM.reviewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      DOM.reviewContainer.classList.add('hidden');
      DOM.btnReviewToggle.innerHTML = 'Review All Questions <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
    }
  });

  // Review accordion — event delegation
  DOM.reviewList.addEventListener('click', e => {
    const header = e.target.closest('.review-item-header');
    if (!header) return;
    const item = header.closest('.review-item');
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open', !isOpen);
    header.setAttribute('aria-expanded', String(!isOpen));
  });

  DOM.reviewList.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const header = e.target.closest('.review-item-header');
      if (header) { e.preventDefault(); header.click(); }
    }
  });

  // Keyboard navigation in exam
  document.addEventListener('keydown', e => {
    if (AppState.screen !== 'exam') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (AppState.currentIndex > 0) { e.preventDefault(); goToQuestion(AppState.currentIndex - 1); }
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (AppState.currentIndex < AppState.questions.length - 1) { e.preventDefault(); goToQuestion(AppState.currentIndex + 1); }
    }
    if (e.key === 'f' || e.key === 'F') { e.preventDefault(); handleFlagToggle(); }

    // Letter keys A-D to select options
    const letter = e.key.toUpperCase();
    if (['A','B','C','D'].includes(letter) && !e.ctrlKey && !e.metaKey) {
      const q = AppState.questions[AppState.currentIndex];
      const validLetters = q.options.map(o => o.letter);
      if (validLetters.includes(letter)) {
        handleAnswerSelect(q.id, letter);
        // Also update the radio input
        const radio = DOM.questionCard.querySelector(`input[value="${letter}"]`);
        if (radio) radio.checked = true;
      }
    }
  });
}

// ── Check for Saved Exam on Welcome Screen ─────────────────
function checkSavedExamOnLoad() {
  const saved = loadSavedState();
  if (saved) {
    // Show a subtle indicator that a resume is available
    const btn = DOM.btnStart;
    btn.textContent = 'Resume Exam';
    btn.insertAdjacentHTML('beforeend', ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>');
  }
}

// ── Init ───────────────────────────────────────────────────
function init() {
  cacheDOMRefs();
  initTheme();
  attachEventListeners();
  checkSavedExamOnLoad();
}

document.addEventListener('DOMContentLoaded', init);
