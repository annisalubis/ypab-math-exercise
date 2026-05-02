import { Auth } from '../auth.js';
import { Router } from '../router.js';

export const NavbarView = {
  render() {
    const isLoggedIn = Auth.isLoggedIn();
    const currentPath = location.pathname;
    
    return `
      <nav class="navbar">
        <div class="navbar-brand">
          <a href="/" data-link>📐 Math Practice</a>
        </div>
        <div class="navbar-menu">
          ${isLoggedIn ? `
            <a href="/menu" data-link class="${currentPath === '/menu' ? 'active' : ''}">Menu</a>
            <a href="/quiz" data-link class="${currentPath === '/quiz' ? 'active' : ''}">Quiz</a>
            <a href="/score" data-link class="${currentPath === '/score' ? 'active' : ''}">Scores</a>
            <button id="logout-btn" class="btn-logout">Logout</button>
          ` : `
            <a href="/login" data-link class="${currentPath === '/login' ? 'active' : ''}">Login</a>
          `}
        </div>
      </nav>
    `;
  },

  afterRender() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
        Router.navigate('/login', true);
      });
    }
  }
};