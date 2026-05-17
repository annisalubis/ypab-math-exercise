let students = [];

export const Auth = {
  async fetchStudents() {
    try {
      const res = await fetch('/api/sheets?action=students');
      const data = await res.json();
      if (data.success) {
        students = data.students;
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to fetch students:', e);
      return false;
    }
  },
  getClasses: () => [...new Set(students.map((s) => s.class))].sort(),
  getNamesByClass: (cls) =>
    students
      .filter((s) => s.class === cls)
      .map((s) => s.name)
      .sort(),
  async verify(name, cls, password) {
    try {
      const params = new URLSearchParams({ action: 'login', name, class: cls, password });
      const res = await fetch(`/api/sheets?${params}`);
      const data = await res.json();
      return data.success === true;
    } catch (e) {
      console.error('Auth error:', e);
      return false;
    }
  },
  login(name, cls) {
    localStorage.setItem('session', JSON.stringify({ name, class: cls }));
  },
  logout() {
    localStorage.removeItem('session');
  },
  getSession() {
    try {
      return JSON.parse(localStorage.getItem('session'));
    } catch {
      return null;
    }
  },
  isLoggedIn() {
    return !!this.getSession();
  },
};
