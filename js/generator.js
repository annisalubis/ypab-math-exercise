import { CONFIG } from './config.js';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randDecimal = (min, max, dp) => parseFloat((Math.random() * (max - min) + min).toFixed(dp));

const getRange = (cat, sub) => {
  return CONFIG.categories[cat][sub];
};

const genNumber = (range, cat) => {
  if (cat === 'decimal') return randDecimal(range.min, range.max, range.decimalPlaces || 2);
  return randInt(range.min, range.max);
};

const opSymbol = { addition: '+', subtraction: '−', multiplication: '×', division: '÷' };

export const generate = (category, subcategory) => {
  const range = getRange(category, subcategory);
  const actualOp = category === 'decimal' ? subcategory : category;
  const problems = [];
  const usedAnswers = new Set();

  for (let i = 0; i < CONFIG.questionsPerSet; i++) {
    let a = genNumber(range, category);
    let b = genNumber(range, category);
    let answer;

    // Handle division by zero and ensure whole number results for division category
    if (actualOp === 'division') {
      if (category === 'decimal') {
        while (b === 0) b = genNumber(range, category);
      } else if (category === 'division') {
        if (b === 0) b = 1;
        while (b > 50) b = randInt(range.min, 50);
        const maxQuotient = Math.floor(range.max / b);
        const minQuotient = maxQuotient >= 2 ? 2 : 1;
        let quotient = randInt(minQuotient, maxQuotient);
        a = b * quotient;
        answer = a / b;
        let attempts = 0;
        while (usedAnswers.has(answer) && attempts < 20) {
          b = randInt(range.min, 50);
          const newMaxQuotient = Math.floor(range.max / b);
          const newMinQuotient = newMaxQuotient >= 2 ? 2 : 1;
          quotient = randInt(newMinQuotient, newMaxQuotient);
          a = b * quotient;
          answer = a / b;
          attempts++;
        }
      }
    }

    if (!answer) {
      if (actualOp === 'addition')
        answer = category === 'decimal' ? parseFloat((a + b).toFixed(2)) : a + b;
      else if (actualOp === 'subtraction')
        answer = category === 'decimal' ? parseFloat((a - b).toFixed(2)) : a - b;
      else if (actualOp === 'multiplication')
        answer = category === 'decimal' ? parseFloat((a * b).toFixed(2)) : a * b;
      else answer = category === 'decimal' ? parseFloat((a / b).toFixed(2)) : a / b;
    }

    usedAnswers.add(answer);

    problems.push({
      text: `${a} ${opSymbol[actualOp]} ${b}`,
      answer,
      numberType: category,
    });
  }
  return problems;
};
