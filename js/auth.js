const Auth = (() => {
  let students = [];

  const fetchStudents = async () => {
    if (!CONFIG.sheetsUrl) return;
    try {
      const res = await fetch(`${CONFIG.sheetsUrl}?action=students`);
      const data = await res.json();
      if (data.success) students = data.students;
    } catch (e) {
      console.error('Failed to fetch students:', e);
    }
  };

  const getClasses = () => [...new Set(students.map(s => s.class))].sort();

  const getNamesByClass = (cls) => students.filter(s => s.class === cls).map(s => s.name).sort();

  const verify = async (name, cls, password) => {
    if (!CONFIG.sheetsUrl) return true;
    try {
      const params = new URLSearchParams({ action: 'login', name, class: cls, password });
      const res = await fetch(`${CONFIG.sheetsUrl}?${params}`);
      const data = await res.json();
      return data.success === true;
    } catch (e) {
      console.error('Auth error:', e);
      return false;
    }
  };

  return { fetchStudents, getClasses, getNamesByClass, verify };
})();
