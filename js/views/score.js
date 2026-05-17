import { Auth } from '../auth.js';
import { Sheets } from '../sheets.js';
import { state } from '../state.js';
import { generate } from '../generator.js';
import { Router } from '../router.js';

export const ScoreView = {
  render() {
    if (!state.results.length) return '';
    const total = state.results.length;
    const score = state.results.filter((r) => r.correct).length;
    const pct = Math.round((score / total) * 100);
    const rows = state.results
      .map(
        (r, i) => `
      <tr class="${r.correct ? 'bg-green-50' : 'bg-red-50'}">
        <td class="p-2 text-center border-b border-gray-200">${i + 1}</td>
        <td class="p-2 text-center border-b border-gray-200">${r.text}</td>
        <td class="p-2 text-center border-b border-gray-200">${r.studentAnswer}</td>
        <td class="p-2 text-center border-b border-gray-200">${r.correctAnswerText}</td>
        <td class="p-2 text-center border-b border-gray-200">${r.correct ? '<i class="fa-solid fa-check text-correct"></i>' : '<i class="fa-solid fa-xmark text-wrong"></i>'}</td>
      </tr>`,
      )
      .join('');

    return `
      <div class="block animate-fadeIn">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">${state.categoryLabel}</h2>
          <h3 class="text-sm text-gray-500">${state.subcategoryLabel}</h3>
          <div class="mt-5 inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 border-4 border-primary">
            <div>
              <div class="text-4xl font-extrabold text-primary">${score}/${total}</div>
            </div>
          </div>
        </div>
        <table class="w-full border-collapse mb-4 text-sm">
          <thead><tr class="bg-gray-100"><th class="p-2 text-center border-b border-gray-200 font-semibold">#</th><th class="p-2 text-center border-b border-gray-200 font-semibold">Problem</th><th class="p-2 text-center border-b border-gray-200 font-semibold">Your Answer</th><th class="p-2 text-center border-b border-gray-200 font-semibold">Correct</th><th class="p-2 text-center border-b border-gray-200 font-semibold"></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div id="sheets-status" class="text-center text-gray-500 text-sm mb-4"></div>
        <div class="flex gap-2 justify-center flex-wrap">
          <button class="p-3 px-6 bg-light-blue text-white border-none rounded-lg text-base cursor-pointer hover:opacity-85" id="retry-btn">Try Again</button>
          <button class="p-3 px-6 bg-gray-500 text-white border-none rounded-lg text-base cursor-pointer hover:opacity-85" id="back-menu-btn">Back to Menu</button>
        </div>
      </div>`;
  },

  afterRender() {
    document.getElementById('retry-btn').addEventListener('click', () => {
      state.problems = generate(state.category, state.subcategory);
      state.current = 0;
      state.results = [];
      Router.navigate('/quiz');
    });

    document.getElementById('back-menu-btn').addEventListener('click', () => {
      Router.navigate('/menu');
    });

    this.saveResults();
  },

  saveResults() {
    const session = Auth.getSession();
    const status = document.getElementById('sheets-status');
    if (!session) return;

    const score = state.results.filter((r) => r.correct).length;
    status.textContent = 'Saving results...';
    Sheets.submitResults(session.name, session.class, state.topic, state.results, score)
      .then((r) => {
        status.textContent = r.ok ? 'Results saved ' : 'Could not save results';
        if (r.ok) {
          const icon = document.createElement('i');
          icon.className = 'fa-solid fa-check';
          status.appendChild(icon);
        }
      })
      .catch(() => {
        status.textContent = 'Could not save results';
      });
  },
};
