const App = (() => {
  let student = { name: '', class: '' };
  let currentOperation = '';
  let currentNumberType = '';
  let currentTopic = '';

  const screens = ['login', 'menu', 'quiz'];

  const showScreen = (id) => {
    screens.forEach(s => {
      document.getElementById(`screen-${s}`).classList.toggle('active', s === id);
    });
  };

  const init = async () => {
    const classSelect = document.getElementById('student-class');
    const nameSelect = document.getElementById('student-name');

    // Fetch student list and populate class dropdown
    await Auth.fetchStudents();
    Auth.getClasses().forEach(cls => {
      const opt = document.createElement('option');
      opt.value = cls;
      opt.textContent = `Grade ${cls}`;
      classSelect.appendChild(opt);
    });

    // On class change, populate name dropdown
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

    // Login
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

      student.name = name;
      student.class = cls;
      document.getElementById('welcome-name').textContent = student.name;
      buildMenu();
      showScreen('menu');
    });

    showScreen('login');
  };

  const operations = ['addition', 'subtraction', 'multiplication', 'division'];
  const numberTypes = ['whole', 'positive', 'negative', 'decimal', 'fraction'];
  const opLabels = { addition: 'Addition (+)', subtraction: 'Subtraction (−)', multiplication: 'Multiplication (×)', division: 'Division (÷)' };
  const typeLabels = { whole: 'Whole Numbers', positive: 'Positives', negative: 'Negatives', decimal: 'Decimals', fraction: 'Fractions' };

  const buildMenu = () => {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    operations.forEach(op => {
      const section = document.createElement('div');
      section.className = 'menu-section';
      section.innerHTML = `<h3>${opLabels[op]}</h3>`;
      const btns = document.createElement('div');
      btns.className = 'menu-buttons';
      numberTypes.forEach(nt => {
        const btn = document.createElement('button');
        btn.className = 'btn menu-btn';
        btn.textContent = typeLabels[nt];
        btn.addEventListener('click', () => startQuiz(op, nt));
        btns.appendChild(btn);
      });
      section.appendChild(btns);
      grid.appendChild(section);
    });
  };

  const startQuiz = (operation, numberType) => {
    currentOperation = operation;
    currentNumberType = numberType;
    currentTopic = `${opLabels[operation].split(' ')[0]} - ${typeLabels[numberType]}`;
    document.getElementById('quiz-title').textContent = currentTopic;
    showScreen('quiz');
    Quiz.start(operation, numberType);
  };

  const retryQuiz = () => startQuiz(currentOperation, currentNumberType);

  return { init, showScreen, retryQuiz, get student() { return student; }, get currentTopic() { return currentTopic; } };
})();

document.addEventListener('DOMContentLoaded', App.init);
