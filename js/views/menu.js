import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { state } from '../state.js';
import { generate } from '../generator.js';
import { CONFIG } from '../config.js';

const categories = ['addition', 'subtraction', 'multiplication', 'division', 'decimal', 'fraction'];
const categoryLabels = { 
  addition: 'Addition (+)', 
  subtraction: 'Subtraction (−)', 
  multiplication: 'Multiplication (×)', 
  division: 'Division (÷)',
  decimal: 'Decimals',
  fraction: 'Fractions'
};
const subcategoryLabels = {
  'basic': 'Basic',
  '1-10': '1 - 10',
  '1-100': '1 - 100'
};

export const MenuView = {
  render() {
    const session = Auth.getSession();
    let grid = '';
    categories.forEach(cat => {
      if (cat === 'decimal' || cat === 'fraction') {
        grid += `<div class="menu-section"><h3>${categoryLabels[cat]}</h3><div class="menu-buttons">
          <button class="btn menu-btn" data-cat="${cat}" data-sub="${cat}">${categoryLabels[cat]}</button>
        </div></div>`;
      } else {
        const subcategories = Object.keys(CONFIG.categories[cat]);
        const btns = subcategories.map(sub =>
          `<button class="btn menu-btn" data-cat="${cat}" data-sub="${sub}">${subcategoryLabels[sub] || sub}</button>`
        ).join('');
        grid += `<div class="menu-section"><h3>${categoryLabels[cat]}</h3><div class="menu-buttons">${btns}</div></div>`;
      }
    });
    return `
      <div class="screen active">
        <div class="menu-header">
          <h2>Hi <span>${session.name}</span>, pick a topic</h2>
        </div>
        <div id="menu-grid">${grid}</div>
      </div>`;
  },
  afterRender() {
    document.getElementById('menu-grid').addEventListener('click', e => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      const cat = btn.dataset.cat;
      const sub = btn.dataset.sub;
      state.category = cat;
      state.subcategory = sub;
      state.topic = cat === 'decimal' || cat === 'fraction' ? categoryLabels[cat] : `${categoryLabels[cat].split(' ')[0]} - ${subcategoryLabels[sub] || sub}`;
      state.problems = generate(cat, sub);
      state.current = 0;
      state.results = [];
      Router.navigate('/quiz');
    });
  }
};
