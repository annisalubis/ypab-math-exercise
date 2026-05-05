import { Auth } from '../auth.js';
import { Router } from '../router.js';

export const LoginView = {
  render() {
    return `
      <div class="screen active login-screen">

      <div class="login-form-container">
        <div class="logo-container">
          <img src="images/ypab-logo.png" alt="YPAB Logo">
          <h2 id="login-title">MATH PRACTICE</h2>
        </div>
      
        <form id="login-form">
          <div class="form-group">
            <label for="student-class">Class</label>
            <select id="student-class" required>
              <option value="">-- Select Class --</option>
            </select>
          </div>
          <div class="form-group">
            <label for="student-name">Name</label>
            <select id="student-name" required disabled>
              <option value="">-- Select Name --</option>
            </select>
          </div>
          <div class="form-group">
            <label for="student-password">Password</label>
            <div class="password-wrapper">
              <input type="password" id="student-password" required autocomplete="off" />
              <button type="button" class="password-toggle" aria-label="Toggle password visibility">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>
          <div id="login-error" class="login-error"></div>
          <button type="submit" class="btn" style="width: 100%" id="login-btn">Start</button>
        </form>
      </div>
      </div>`;
  },
  async afterRender() {
    await Auth.fetchStudents();
    const classSelect = document.getElementById('student-class');
    const nameSelect = document.getElementById('student-name');

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
