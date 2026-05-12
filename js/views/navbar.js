import { Auth } from '../auth.js';
import { Router } from '../router.js';

export const NavbarView = {
  render() {
    return `
      <nav class="fixed top-0 left-0 right-0 z-50 bg-white p-4 shadow-md flex justify-between items-center">
        <div>
          <a href="/" data-link class="flex items-center gap-4 no-underline text-dark-blue font-bold text-lg">
            <img src="images/ypab-logo.png" alt="YPAB Logo" class="h-8">
            <span>Math Practice</span>
          </a>
        </div>
        <div class="flex gap-4 items-center">
          <button id="logout-btn" class="bg-wrong text-white border-none rounded-lg px-3 py-1 text-base cursor-pointer hover:opacity-85">Logout</button>
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
