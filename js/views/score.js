import { CONFIG } from '../config.js';
import { Auth } from '../auth.js';
import { Sheets } from '../sheets.js';
import { state } from '../state.js';
import { generate } from '../generator.js';
import { Router } from '../router.js';

export const ScoreView = {
  render() {
    if (!state.results.length) return '';
    const score = state.results.filter(r => r.correct).length;
    const pct = Math.round((score / state.results.length) * 100);
    const rows = state.results.map((r, i) => `
      <tr class="${r.correct ? 'row-correct' : 'row-wrong'}">
        <td>${i + 1}</td>
        <td>${r.text}</td>
        <td>${r.studentAnswer}</td>
        <td>${r.correctAnswerText}</td>
        <td>${r.correct ? '✓' : '✗'}</td>
      </tr>
    `).join('');
    return `
      <div class="screen active">
        <h2 id="quiz-title">${state.topic}</h2>
        <div class="score-header">
          <div class="score-big">${score} / ${state.results.length}</div>
          <div class="score-pct">${pct}%</div>
        </div>
        <table class="score-table">
          <thead><tr><th>#</th><th>Problem</th><th>Your Answer</th><th>Correct</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div id="sheets-status" class="sheets-status"></div>
        <div class="score-actions">
          <button class="btn" id="retry-btn">Try Again</button>
          <button class="btn btn-secondary" id="back-menu-btn">Back to Menu</button>
        </div>
      </div>`;
  },
  afterRender() {
    document.getElementById('retry-btn').addEventListener('click', () => {
      state.problems = generate(state.operation, state.numberType);
      state.current = 0;
      state.results = [];
      Router.navigate('/quiz');
    });
    document.getElementById('back-menu-btn').addEventListener('click', () => {
      Router.navigate('/menu');
    });
    const session = Auth.getSession();
    const status = document.getElementById('sheets-status');
    if (CONFIG.sheetsUrl && session) {
      const score = state.results.filter(r => r.correct).length;
      status.textContent = 'Saving results...';
      Sheets.submitResults(session.name, session.class, state.topic, state.results, score)
        .then(r => { status.textContent = r.ok ? 'Results saved ✓' : 'Could not save results'; })
        .catch(() => { status.textContent = 'Could not save results'; });
    }
  }
};
