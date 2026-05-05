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
  let b = randInt(range.min, Math.min(range.max, 50));
  if (b === 0) b = 1;
  const maxQ = Math.floor(range.max / b);
  const minQ = maxQ >= 2 ? 2 : 1;
  const quotient = randInt(minQ, maxQ);
  return { a: b * quotient, b, answer: quotient };
}

export function generate(category, subcategory) {
  const range = CONFIG.categories[category].subcategories[subcategory];
  const operation = category === 'decimal' ? subcategory : category;
  const isDecimal = category === 'decimal';
  const problems = [];

  for (let i = 0; i < CONFIG.questionsPerSet; i++) {
    let a, b, answer;

    if (operation === 'division' && !isDecimal) {
      ({ a, b, answer } = generateDivisionPair(range));
    } else {
      a = genNumber(range, isDecimal);
      b = genNumber(range, isDecimal);
      if (operation === 'division' && b === 0) b = genNumber(range, isDecimal) || 1;
      const raw = OPS[operation](a, b);
      answer = isDecimal ? parseFloat(raw.toFixed(2)) : raw;
    }

    problems.push({
      text: `${a} ${OP_SYMBOLS[operation]} ${b}`,
      answer,
    });
  }

  return problems;
}
