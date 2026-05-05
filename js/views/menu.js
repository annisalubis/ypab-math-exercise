import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { state } from '../state.js';
import { generate } from '../generator.js';
import { CONFIG } from '../config.js';

export const MenuView = {
  render() {
    const session = Auth.getSession();
    const grid = Object.entries(CONFIG.categories)
      .map(([cat, { label, subcategories }]) => {
        const btns = Object.entries(subcategories)
          .map(
            ([sub, { label: subLabel }]) =>
              `<button class="btn menu-btn" data-cat="${cat}" data-sub="${sub}">${subLabel}</button>`,
          )
          .join('');
        return `<div class="menu-section"><h3>${label}</h3><div class="menu-buttons">${btns}</div></div>`;
      })
      .join('');

    return `
      <div class="screen active">
        <div class="menu-header">
          <h2>Hi <span>${session.name}</span>, pick a topic</h2>
        </div>
        <div id="menu-grid">${grid}</div>
      </div>`;
  },

  afterRender() {
    document.getElementById('menu-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      const { cat, sub } = btn.dataset;
      const catConfig = CONFIG.categories[cat];
      const subConfig = catConfig.subcategories[sub];

      state.category = cat;
      state.subcategory = sub;
      state.topic = `${catConfig.label} - ${subConfig.label}`;
      state.problems = generate(cat, sub);
      state.current = 0;
      state.results = [];
      Router.navigate('/quiz');
    });
  },
};
