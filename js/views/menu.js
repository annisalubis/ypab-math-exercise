import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { state } from '../state.js';
import { generate } from '../generator.js';

const operations = ['addition', 'subtraction', 'multiplication', 'division'];
const numberTypes = ['whole', 'positive', 'negative', 'decimal', 'fraction'];
const opLabels = { addition: 'Addition (+)', subtraction: 'Subtraction (−)', multiplication: 'Multiplication (×)', division: 'Division (÷)' };
const typeLabels = { whole: 'Whole Numbers', positive: 'Positives', negative: 'Negatives', decimal: 'Decimals', fraction: 'Fractions' };

export const MenuView = {
  render() {
    const session = Auth.getSession();
    let grid = '';
    operations.forEach(op => {
      const btns = numberTypes.map(nt =>
        `<button class="btn menu-btn" data-op="${op}" data-nt="${nt}">${typeLabels[nt]}</button>`
      ).join('');
      grid += `<div class="menu-section"><h3>${opLabels[op]}</h3><div class="menu-buttons">${btns}</div></div>`;
    });
    return `
      <div class="screen active">
        <div class="menu-header">
          <h2>Hi <span>${session.name}</span>, pick a topic</h2>
          <button class="btn btn-logout" id="logout-btn">Logout</button>
        </div>
        <div id="menu-grid">${grid}</div>
      </div>`;
  },
  afterRender() {
    document.getElementById('logout-btn').addEventListener('click', () => {
      Auth.logout();
      Router.navigate('/login');
    });
    document.getElementById('menu-grid').addEventListener('click', e => {
      const btn = e.target.closest('[data-op]');
      if (!btn) return;
      const op = btn.dataset.op;
      const nt = btn.dataset.nt;
      state.operation = op;
      state.numberType = nt;
      state.topic = `${opLabels[op].split(' ')[0]} - ${typeLabels[nt]}`;
      state.problems = generate(op, nt);
      state.current = 0;
      state.results = [];
      Router.navigate('/quiz');
    });
  }
};
