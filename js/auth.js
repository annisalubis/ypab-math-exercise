import { CONFIG } from './config.js';

let students = [];

export const Auth = {
  async fetchStudents() {
    if (!CONFIG.sheetsUrl) return;
    try {
      const res = await fetch(`${CONFIG.sheetsUrl}?action=students`);
      const data = await res.json();
      if (data.success) students = data.students;
    } catch (e) { console.error('Failed to fetch students:', e); }
  },
  getClasses: () => [...new Set(students.map(s => s.class))].sort(),
  getNamesByClass: (cls) => students.filter(s => s.class === cls).map(s => s.name).sort(),
  async verify(name, cls, password) {
    if (!CONFIG.sheetsUrl) return true;
    try {
      const params = new URLSearchParams({ action: 'login', name, class: cls, password });
      const res = await fetch(`${CONFIG.sheetsUrl}?${params}`);
      const data = await res.json();
      return data.success === true;
    } catch (e) { console.error('Auth error:', e); return false; }
  },
  login(name, cls) {
    localStorage.setItem('session', JSON.stringify({ name, class: cls }));
  },
  logout() {
    localStorage.removeItem('session');
  },
  getSession() {
    try { return JSON.parse(localStorage.getItem('session')); } catch { return null; }
  },
  isLoggedIn() {
    return !!this.getSession();
  }
};
