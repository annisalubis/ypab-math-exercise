import { Auth } from './auth.js';
import { state } from './state.js';
import { NavbarView } from './views/navbar.js';

let routes = {};

export const Router = {
  register(path, view) {
    routes[path] = view;
  },

  async navigate(path, replace = false) {
    if (path === '/') path = Auth.isLoggedIn() ? '/menu' : '/login';
    if (path !== '/login' && !Auth.isLoggedIn()) {
      path = '/login';
      replace = true;
    }
    if (path === '/login' && Auth.isLoggedIn()) {
      path = '/menu';
      replace = true;
    }
    if (path === '/quiz' && !state.problems.length) {
      path = '/menu';
      replace = true;
    }
    if (path === '/score' && !state.results.length) {
      path = '/menu';
      replace = true;
    }
    if (replace) history.replaceState(null, '', path);
    else history.pushState(null, '', path);
    await this.render();
  },

  async render() {
    const path = location.pathname;
    const view = routes[path];
    if (!view) {
      await this.navigate(Auth.isLoggedIn() ? '/menu' : '/login', true);
      this.showToast('Page not found');
      return;
    }
    const app = document.getElementById('app');
    app.innerHTML = (Auth.isLoggedIn() ? NavbarView.render() : '') + view.render();
    if (Auth.isLoggedIn() && NavbarView.afterRender) await NavbarView.afterRender();
    if (view.afterRender) await view.afterRender();
  },

  init() {
    window.addEventListener('popstate', () => this.navigate(location.pathname, true));
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-link]');
      if (a) {
        e.preventDefault();
        this.navigate(a.getAttribute('href'));
      }
    });
  },

  showToast(msg) {
    const el = document.createElement('div');
    el.className =
      'fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-fadeIn';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  },
};
