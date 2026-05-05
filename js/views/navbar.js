import { Auth } from '../auth.js';
import { Router } from '../router.js';

export const NavbarView = {
  render() {
    return `
      <nav class="navbar">
        <div class="navbar-brand">
          <a href="/" data-link>
            <img src="images/ypab-logo.png" alt="YPAB Logo">
            <span>Math Practice</span>
          </a>
        </div>
        <div class="navbar-menu">
          <button id="logout-btn" class="btn-logout">Logout</button>
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
  },
};
