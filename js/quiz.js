const Quiz = (() => {
  let problems = [];
  let current = 0;
  let results = [];

  const start = (operation, numberType) => {
    problems = Generator.generate(operation, numberType);
    current = 0;
    results = [];
    showQuestion();
  };

  const showQuestion = () => {
    const p = problems[current];
    const isFraction = p.numberType === 'fraction';
    const container = document.getElementById('quiz-content');

    container.innerHTML = `
      <div class="progress">Question ${current + 1} / ${CONFIG.questionsPerSet}</div>
      <div class="problem">${formatProblemDisplay(p)} = ?</div>
      <form id="answer-form" class="answer-form">
        ${isFraction
          ? `<div class="fraction-input">
              <input type="number" id="ans-num" placeholder="numerator" required>
              <span class="fraction-bar">/</span>
              <input type="number" id="ans-den" placeholder="denominator" required>
            </div>`
          : `<input type="number" step="any" id="ans-val" placeholder="Your answer" required>`
        }
        <button type="submit" class="btn">Submit</button>
      </form>
      <div id="feedback" class="feedback"></div>
    `;

    document.getElementById('answer-form').addEventListener('submit', e => {
      e.preventDefault();
      checkAnswer(p, isFraction);
    });

    const firstInput = isFraction ? document.getElementById('ans-num') : document.getElementById('ans-val');
    firstInput.focus();
  };

  const formatProblemDisplay = (p) => {
    if (p.numberType !== 'fraction') return p.text;
    // Render fractions as styled spans
    const sym = p.text.split('/').length > 2
      ? p.text // fallback
      : p.text;
    return p.text
      .replace(/(-?\d+)\/(\d+)/g, '<span class="frac"><span class="frac-num">$1</span><span class="frac-den">$2</span></span>');
  };

  const checkAnswer = (p, isFraction) => {
    const fb = document.getElementById('feedback');
    const form = document.getElementById('answer-form');
    let studentAnswer, correct, studentAnswerText, correctAnswerText;

    if (isFraction) {
      const sn = parseInt(document.getElementById('ans-num').value);
      const sd = parseInt(document.getElementById('ans-den').value);
      if (sd === 0) { fb.innerHTML = '<span class="wrong">Denominator cannot be 0</span>'; return; }
      const simplified = Generator.simplify(sn, sd);
      correct = simplified.n === p.answer.n && simplified.d === p.answer.d;
      studentAnswerText = `${sn}/${sd}`;
      correctAnswerText = `${p.answer.n}/${p.answer.d}`;
    } else {
      const val = parseFloat(document.getElementById('ans-val').value);
      correct = Math.abs(val - p.answer) < 0.005;
      studentAnswerText = String(val);
      correctAnswerText = String(p.answer);
    }

    results.push({ text: p.text, studentAnswer: studentAnswerText, correctAnswerText, correct });

    // Disable form
    form.querySelectorAll('input, button').forEach(el => el.disabled = true);

    if (correct) {
      fb.innerHTML = '<span class="correct">✓ Correct!</span>';
    } else {
      fb.innerHTML = `<span class="wrong">✗ Wrong</span> — Answer: <strong>${correctAnswerText}</strong>`;
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-next';
    nextBtn.textContent = current < problems.length - 1 ? 'Next' : 'See Score';
    nextBtn.addEventListener('click', () => {
      current++;
      if (current < problems.length) showQuestion();
      else showScore();
    });
    fb.appendChild(nextBtn);
    nextBtn.focus();
  };

  const showScore = () => {
    const score = results.filter(r => r.correct).length;
    const pct = Math.round((score / results.length) * 100);
    const container = document.getElementById('quiz-content');

    const rows = results.map((r, i) => `
      <tr class="${r.correct ? 'row-correct' : 'row-wrong'}">
        <td>${i + 1}</td>
        <td>${r.text}</td>
        <td>${r.studentAnswer}</td>
        <td>${r.correctAnswerText}</td>
        <td>${r.correct ? '✓' : '✗'}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="score-header">
        <div class="score-big">${score} / ${results.length}</div>
        <div class="score-pct">${pct}%</div>
      </div>
      <table class="score-table">
        <thead><tr><th>#</th><th>Problem</th><th>Your Answer</th><th>Correct</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div id="sheets-status" class="sheets-status"></div>
      <div class="score-actions">
        <button class="btn" onclick="App.retryQuiz()">Try Again</button>
        <button class="btn btn-secondary" onclick="App.showScreen('menu')">Back to Menu</button>
      </div>
    `;

    // Submit to Google Sheets
    const status = document.getElementById('sheets-status');
    if (CONFIG.sheetsUrl) {
      status.textContent = 'Saving results...';
      Sheets.submitResults(App.student.name, App.student.class, App.currentTopic, results, score)
        .then(r => { status.textContent = r.ok ? 'Results saved ✓' : 'Could not save results'; })
        .catch(() => { status.textContent = 'Could not save results'; });
    }
  };

  return { start };
})();
