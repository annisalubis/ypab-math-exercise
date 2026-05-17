import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { Router } from '../router.js';

export const QuizView = {
  render() {
    if (!state.problems.length) return '';
    const p = state.problems[state.current];
    return `
      <div class="block animate-fadeIn">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">${state.categoryLabel}</h2>
          <h3 class="text-sm text-gray-500">${state.subcategoryLabel}</h3>
        </div>
        <div id="quiz-content" class="bg-white rounded-xl p-6 shadow-sm">
          <div class="text-center text-gray-400 mb-2 text-sm">Question ${state.current + 1} / ${CONFIG.questionsPerSet}</div>
          <div class="text-center text-3xl font-bold mb-8">${p.text} = ?</div>
          <form id="answer-form" class="flex flex-col items-center gap-3">
            <input type="number" step="any" id="ans-val" placeholder="Your answer" required class="w-full max-w-[200px] p-3 border-2 border-gray-200 rounded-lg text-xl text-center focus:outline-none focus:border-primary">
            <button type="submit" class="w-full max-w-[200px] p-3 bg-light-blue text-white border-none rounded-lg text-base cursor-pointer hover:opacity-85">Submit</button>
          </form>
          <div id="feedback" class="text-center mt-6 text-lg"></div>
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
    ? '<span class="text-correct font-bold"><i class="fa-solid fa-check"></i> Correct!</span>'
    : `<span class="text-wrong font-bold"><i class="fa-solid fa-xmark"></i> Wrong</span> — Answer: <strong>${problem.answer}</strong>`;

  const nextBtn = document.createElement('button');
  nextBtn.className =
    'mt-4 p-3 px-6 bg-light-blue text-white border-none rounded-lg text-base cursor-pointer hover:opacity-85';
  nextBtn.innerHTML =
    state.current < state.problems.length - 1
      ? 'Next <i class="fa-solid fa-arrow-right ml-1"></i>'
      : 'See Score <i class="fa-solid fa-arrow-right ml-1"></i>';
  nextBtn.addEventListener('click', () => {
    state.current++;
    if (state.current < state.problems.length) {
      Router.render();
    } else {
      Router.navigate('/score');
    }
  });
  const wrapper = document.createElement('div');
  wrapper.className = 'flex justify-center mt-4';
  wrapper.appendChild(nextBtn);
  fb.parentElement.appendChild(wrapper);
  nextBtn.focus();
}
