import { CONFIG } from './config.js';

const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randDecimal = (min, max, dp) => parseFloat((Math.random() * (max - min) + min).toFixed(dp));

export const simplify = (n, d) => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), Math.abs(d));
  return { n: n / g, d: d / g };
};

const getRange = (cat, sub) => {
  if (cat === 'decimal' || cat === 'fraction') {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'];
    const randomOp = ops[Math.floor(Math.random() * ops.length)];
    return { ...CONFIG.categories[cat][randomOp], _operation: randomOp };
  }
  return CONFIG.categories[cat][sub];
};

const genNumber = (range, cat) => {
  if (cat === 'fraction') return { n: randInt(range.minNum, range.maxNum), d: randInt(range.minDen, range.maxDen) };
  if (cat === 'decimal') return randDecimal(range.min, range.max, range.decimalPlaces || 2);
  return randInt(range.min, range.max);
};

const opSymbol = { addition: '+', subtraction: '−', multiplication: '×', division: '÷' };
const formatNum = (v, cat) => {
  if (cat === 'fraction') return `${v.n}/${v.d}`;
  return String(v);
};

const computeFraction = (a, b, op) => {
  let rn, rd;
  if (op === 'addition')       { rn = a.n * b.d + b.n * a.d; rd = a.d * b.d; }
  else if (op === 'subtraction') { rn = a.n * b.d - b.n * a.d; rd = a.d * b.d; }
  else if (op === 'multiplication') { rn = a.n * b.n; rd = a.d * b.d; }
  else { rn = a.n * b.d; rd = a.d * b.n; }
  return simplify(rn, rd);
};

export const generate = (category, subcategory) => {
  const range = getRange(category, subcategory);
  const actualOp = range._operation || category;
  const problems = [];
  const usedAnswers = new Set();
  
  for (let i = 0; i < CONFIG.questionsPerSet; i++) {
    let a = genNumber(range, category);
    let b = genNumber(range, category);
    let answer;
    
    // Handle division by zero and ensure whole number results for division category
    if (actualOp === 'division') {
      if (category === 'fraction') {
        while (b.n === 0) b = genNumber(range, category);
      } else {
        if (b === 0) b = 1;
        // For division category, ensure a is divisible by b (0 modulus)
        if (category === 'division') {
          // Limit b to smaller numbers to ensure we can have quotients > 1
          while (b > 50) {
            b = randInt(range.min, 50);
          }
          
          const maxQuotient = Math.floor(range.max / b);
          const minQuotient = maxQuotient >= 2 ? 2 : 1;
          let quotient = randInt(minQuotient, maxQuotient);
          a = b * quotient;
          answer = a / b;
          
          // Ensure answer is not already used
          let attempts = 0;
          while (usedAnswers.has(answer) && attempts < 20) {
            // Try different b if we can't find unique answer
            b = randInt(range.min, 50);
            const newMaxQuotient = Math.floor(range.max / b);
            const newMinQuotient = newMaxQuotient >= 2 ? 2 : 1;
            quotient = randInt(newMinQuotient, newMaxQuotient);
            a = b * quotient;
            answer = a / b;
            attempts++;
          }
        } else if (category !== 'decimal') {
          a = b * randInt(1, Math.floor(Math.abs(range.max / b)) || 2);
          answer = a / b;
        }
      }
    }
    
    if (!answer) {
      if (category === 'fraction') {
        answer = computeFraction(a, b, actualOp);
      } else if (actualOp === 'addition') answer = a + b;
      else if (actualOp === 'subtraction') answer = a - b;
      else if (actualOp === 'multiplication') answer = a * b;
      else answer = category === 'decimal'
        ? parseFloat((a / b).toFixed(range.decimalPlaces || 2))
        : a / b;
    }
    
    usedAnswers.add(answer);
    
    problems.push({ 
      text: `${formatNum(a, category)} ${opSymbol[actualOp]} ${formatNum(b, category)}`, 
      answer, 
      numberType: category 
    });
  }
  return problems;
};
