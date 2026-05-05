import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { Router } from '../router.js';

export const QuizView = {
  render() {
    if (!state.problems.length) return '';
    const p = state.problems[state.current];
    return `
      <div class="screen active">
        <h2 id="quiz-title">${state.topic}</h2>
        <div id="quiz-content">
          <div class="progress">Question ${state.current + 1} / ${CONFIG.questionsPerSet}</div>
          <div class="problem">${p.text} = ?</div>
          <form id="answer-form" class="answer-form">
            <input type="number" step="any" id="ans-val" placeholder="Your answer" required>
            <button type="submit" class="btn">Submit</button>
          </form>
          <div id="feedback" class="feedback"></div>
        </div>
      </div>`;
  },

  afterRender() {
    const input = document.getElementById('ans-val');
    if (input) input.focus();

    document.getElementById('answer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(state.problems[state.current]);
    });
  },
};

function handleSubmit(problem) {
  const fb = document.getElementById('feedback');
  const form = document.getElementById('answer-form');
  const val = parseFloat(document.getElementById('ans-val').value);
  const correct = Math.abs(val - problem.answer) < 0.005;

  state.results.push({
    text: problem.text,
    studentAnswer: String(val),
    correctAnswerText: String(problem.answer),
    correct,
  });

  form.querySelectorAll('input, button').forEach((el) => (el.disabled = true));

  fb.innerHTML = correct
    ? '<span class="correct">✓ Correct!</span>'
    : `<span class="wrong">✗ Wrong</span> — Answer: <strong>${problem.answer}</strong>`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-next';
  nextBtn.textContent = state.current < state.problems.length - 1 ? 'Next' : 'See Score';
  nextBtn.addEventListener('click', () => {
    state.current++;
    if (state.current < state.problems.length) {
      Router.render();
    } else {
      Router.navigate('/score');
    }
  });
  fb.appendChild(nextBtn);
  nextBtn.focus();
}
