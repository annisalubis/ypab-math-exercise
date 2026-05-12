import { CONFIG } from './config.js';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randDecimal = (min, max, dp) => parseFloat((Math.random() * (max - min) + min).toFixed(dp));

const OPS = {
  addition: (a, b) => a + b,
  subtraction: (a, b) => a - b,
  multiplication: (a, b) => a * b,
  division: (a, b) => a / b,
};

const OP_SYMBOLS = { addition: '+', subtraction: '−', multiplication: '×', division: '÷' };

function genNumber(range, isDecimal) {
  return isDecimal
    ? randDecimal(range.min, range.max, range.decimalPlaces || 2)
    : randInt(range.min, range.max);
}

function generateDivisionPair(range) {
  const quotient = randInt(2, 12);
  const b = randInt(Math.max(range.min, 2), Math.floor(range.max / quotient) || 2);
  return { a: b * quotient, b, answer: quotient };
}

export function generate(category, subcategory) {
  const range = CONFIG.categories[category].subcategories[subcategory];
  const operation = category === 'decimal' ? subcategory : category;
  const isDecimal = category === 'decimal';
  const problems = [];
  const seenTexts = new Set();
  const seenAnswers = new Set();
  const numCount = {};

  const trackNum = (n) => {
    numCount[n] = (numCount[n] || 0) + 1;
  };
  const numOverused = (n) => (numCount[n] || 0) >= 2;

  for (let i = 0; i < CONFIG.questionsPerSet; i++) {
    let a, b, answer, text;
    let attempts = 0;

    do {
      if (operation === 'division' && !isDecimal) {
        ({ a, b, answer } = generateDivisionPair(range));
      } else {
        a = genNumber(range, isDecimal);
        b = genNumber(range, isDecimal);
        if (operation === 'division' && b === 0) b = genNumber(range, isDecimal) || 1;
        const raw = OPS[operation](a, b);
        answer = isDecimal ? parseFloat(raw.toFixed(2)) : raw;
      }
      text = `${a} ${OP_SYMBOLS[operation]} ${b}`;
      attempts++;
    } while (
      (seenTexts.has(text) || seenAnswers.has(answer) || numOverused(a) || numOverused(b)) &&
      attempts < 50
    );

    seenTexts.add(text);
    seenAnswers.add(answer);
    trackNum(a);
    trackNum(b);
    problems.push({ text, answer });
  }

  return problems;
}
