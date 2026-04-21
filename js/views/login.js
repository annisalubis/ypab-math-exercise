import { Auth } from '../auth.js';
import { Router } from '../router.js';

export const LoginView = {
  render() {
    return `
      <div class="screen active">
        <h2>Enter your info to start</h2>
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
            <input type="password" id="student-password" required autocomplete="off" />
          </div>
          <div id="login-error" class="login-error"></div>
          <button type="submit" class="btn" style="width: 100%" id="login-btn">Start</button>
        </form>
      </div>`;
  },
  async afterRender() {
    await Auth.fetchStudents();
    const classSelect = document.getElementById('student-class');
    const nameSelect = document.getElementById('student-name');
    Auth.getClasses().forEach(cls => {
      const opt = document.createElement('option');
      opt.value = cls;
      opt.textContent = `Grade ${cls}`;
      classSelect.appendChild(opt);
    });
    classSelect.addEventListener('change', () => {
      nameSelect.innerHTML = '<option value="">-- Select Name --</option>';
      nameSelect.disabled = !classSelect.value;
      if (!classSelect.value) return;
      Auth.getNamesByClass(classSelect.value).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        nameSelect.appendChild(opt);
      });
    });
    document.getElementById('login-form').addEventListener('submit', async e => {
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
      if (!ok) { err.textContent = 'Invalid credentials.'; return; }
      Auth.login(name, cls);
      Router.navigate('/menu');
    });
  }
};
