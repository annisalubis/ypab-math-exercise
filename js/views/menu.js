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
              `<button class="bg-light-blue text-white border-none rounded-lg text-sm px-3 py-2 cursor-pointer hover:opacity-85" data-cat="${cat}" data-sub="${sub}">${subLabel}</button>`,
          )
          .join('');
        return `<div class="bg-white rounded-lg p-4 mb-4 shadow-sm"><h3 class="mb-2 text-base text-primary font-semibold">${label}</h3><div class="flex flex-wrap gap-2">${btns}</div></div>`;
      })
      .join('');

    return `
      <div class="block animate-fadeIn">
        <div class="mb-4">
          <h2 class="text-lg text-gray-500 text-center">Hi <span>${session.name}</span>, pick a topic</h2>
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
      state.categoryLabel = catConfig.label;
      state.subcategoryLabel = subConfig.label;
      state.topic = `${cat} (${subConfig.label})`;
      state.problems = generate(cat, sub);
      state.current = 0;
      state.results = [];
      Router.navigate('/quiz');
    });
  },
};
