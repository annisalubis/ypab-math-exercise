import { Auth } from './auth.js';
import { state } from './state.js';

let routes = {};

export const Router = {
  register(path, view) { routes[path] = view; },

  async navigate(path, replace = false) {
    if (path === '/') path = Auth.isLoggedIn() ? '/menu' : '/login';
    if (path !== '/login' && !Auth.isLoggedIn()) { path = '/login'; replace = true; }
    if (path === '/login' && Auth.isLoggedIn()) { path = '/menu'; replace = true; }
    if (path === '/quiz' && !state.problems.length) { path = '/menu'; replace = true; }
    if (path === '/score' && !state.results.length) { path = '/menu'; replace = true; }
    if (replace) history.replaceState(null, '', path);
    else history.pushState(null, '', path);
    await this.render();
  },

  async render() {
    const path = location.pathname;
    const view = routes[path];
    if (!view) return this.navigate('/login', true);
    const app = document.getElementById('app');
    app.innerHTML = view.render();
    if (view.afterRender) await view.afterRender();
  },

  init() {
    window.addEventListener('popstate', () => this.navigate(location.pathname, true));
    document.addEventListener('click', e => {
      const a = e.target.closest('a[data-link]');
      if (a) { e.preventDefault(); this.navigate(a.getAttribute('href')); }
    });
  }
};
