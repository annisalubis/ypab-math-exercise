import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { simplify } from '../generator.js';
import { Router } from '../router.js';

const formatProblemDisplay = (p) => {
  if (p.numberType !== 'fraction') return p.text;
  return p.text.replace(/(-?\d+)\/(\d+)/g, '<span class="frac"><span class="frac-num">$1</span><span class="frac-den">$2</span></span>');
};

export const QuizView = {
  render() {
    if (!state.problems.length) return '';
    const p = state.problems[state.current];
    const isFraction = p.numberType === 'fraction';
    return `
      <div class="screen active">
        <h2 id="quiz-title">${state.topic}</h2>
        <div id="quiz-content">
          <div class="progress">Question ${state.current + 1} / ${CONFIG.questionsPerSet}</div>
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
        </div>
      </div>`;
  },
  afterRender() {
    const p = state.problems[state.current];
    const isFraction = p.numberType === 'fraction';
    const firstInput = document.getElementById(isFraction ? 'ans-num' : 'ans-val');
    if (firstInput) firstInput.focus();
    document.getElementById('answer-form').addEventListener('submit', e => {
      e.preventDefault();
      checkAnswer(p, isFraction);
    });
  }
};

function checkAnswer(p, isFraction) {
  const fb = document.getElementById('feedback');
  const form = document.getElementById('answer-form');
  let correct, studentAnswerText, correctAnswerText;
  if (isFraction) {
    const sn = parseInt(document.getElementById('ans-num').value);
    const sd = parseInt(document.getElementById('ans-den').value);
    if (sd === 0) { fb.innerHTML = '<span class="wrong">Denominator cannot be 0</span>'; return; }
    const simplified = simplify(sn, sd);
    correct = simplified.n === p.answer.n && simplified.d === p.answer.d;
    studentAnswerText = `${sn}/${sd}`;
    correctAnswerText = `${p.answer.n}/${p.answer.d}`;
  } else {
    const val = parseFloat(document.getElementById('ans-val').value);
    correct = Math.abs(val - p.answer) < 0.005;
    studentAnswerText = String(val);
    correctAnswerText = String(p.answer);
  }
  state.results.push({ text: p.text, studentAnswer: studentAnswerText, correctAnswerText, correct });
  form.querySelectorAll('input, button').forEach(el => el.disabled = true);
  if (correct) {
    fb.innerHTML = '<span class="correct">✓ Correct!</span>';
  } else {
    fb.innerHTML = `<span class="wrong">✗ Wrong</span> — Answer: <strong>${correctAnswerText}</strong>`;
  }
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-next';
  nextBtn.textContent = state.current < state.problems.length - 1 ? 'Next' : 'See Score';
  nextBtn.addEventListener('click', () => {
    state.current++;
    if (state.current < state.problems.length) {
      const app = document.getElementById('app');
      app.innerHTML = QuizView.render();
      QuizView.afterRender();
    } else {
      Router.navigate('/score');
    }
  });
  fb.appendChild(nextBtn);
  nextBtn.focus();
}
