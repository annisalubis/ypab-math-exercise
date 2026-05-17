import { Auth } from '../auth.js';
import { Router } from '../router.js';

export const LoginView = {
  render() {
    return `
      <div class="fixed inset-0 flex flex-col justify-center items-center bg-gray-100 p-8 animate-fadeIn">

      <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-[400px]">
        <div class="flex flex-col items-center justify-center gap-1 mb-6">
          <img src="images/ypab-logo.png" alt="YPAB Logo" class="h-16">
          <h2 class="text-2xl font-bold text-dark-blue m-0">MATH PRACTICE</h2>
        </div>
      
        <form id="login-form">
          <div class="mb-4">
            <label for="student-class" class="block mb-1 font-semibold text-sm">Class</label>
            <select id="student-class" required class="w-full p-3 border-2 border-gray-200 rounded-lg text-base bg-white focus:outline-none focus:border-primary transition-colors">
              <option value="">-- Select Class --</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="student-name" class="block mb-1 font-semibold text-sm">Name</label>
            <select id="student-name" required disabled class="w-full p-3 border-2 border-gray-200 rounded-lg text-base bg-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50">
              <option value="">-- Select Name --</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="student-password" class="block mb-1 font-semibold text-sm">Password</label>
            <div class="relative">
              <input type="password" id="student-password" required autocomplete="off" class="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-primary transition-colors" />
              <button type="button" class="password-toggle absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500" aria-label="Toggle password visibility">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>
          <div id="login-error" class="text-wrong text-sm text-center mb-2"></div>
          <button type="submit" class="w-full p-3 bg-light-blue text-white border-none rounded-lg text-base cursor-pointer hover:opacity-85" id="login-btn">Start</button>
        </form>
      </div>
      </div>`;
  },
  async afterRender() {
    const classSelect = document.getElementById('student-class');
    const nameSelect = document.getElementById('student-name');
    const form = document.getElementById('login-form');

    form.classList.add('opacity-50', 'pointer-events-none');
    classSelect.innerHTML = '<option value="">Loading...</option>';
    const ok = await Auth.fetchStudents();
    form.classList.remove('opacity-50', 'pointer-events-none');
    if (!ok) {
      classSelect.innerHTML = '<option value="">Failed to load</option>';
      document.getElementById('login-error').textContent =
        'Could not connect to server. Please check your internet and refresh.';
      return;
    }
    classSelect.innerHTML = '<option value="">-- Select Class --</option>';

    document.querySelector('.password-toggle').addEventListener('click', (e) => {
      const input = document.getElementById('student-password');
      const icon = e.currentTarget.querySelector('i');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !show);
      icon.classList.toggle('fa-eye-slash', show);
    });
    Auth.getClasses().forEach((cls) => {
      const opt = document.createElement('option');
      opt.value = cls;
      opt.textContent = `Grade ${cls}`;
      classSelect.appendChild(opt);
    });
    classSelect.addEventListener('change', () => {
      nameSelect.innerHTML = '<option value="">-- Select Name --</option>';
      nameSelect.disabled = !classSelect.value;
      if (!classSelect.value) return;
      Auth.getNamesByClass(classSelect.value).forEach((name) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        nameSelect.appendChild(opt);
      });
    });
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = nameSelect.value;
      const cls = classSelect.value;
      const pwd = document.getElementById('student-password').value.trim();
      const err = document.getElementById('login-error');
      const btn = document.getElementById('login-btn');
      err.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Checking...';
      const ok = await Auth.verify(name, cls, pwd);
      btn.disabled = false;
      btn.textContent = 'Start';
      if (!ok) {
        err.textContent = 'Invalid credentials!';
        return;
      }
      Auth.login(name, cls);
      Router.navigate('/menu');
    });
  },
};
