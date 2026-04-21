const Generator = (() => {
  const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randDecimal = (min, max, dp) => parseFloat((Math.random() * (max - min) + min).toFixed(dp));

  const simplify = (n, d) => {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(Math.abs(n), Math.abs(d));
    return { n: n / g, d: d / g };
  };

  const getRange = (op, nt) => ({ ...CONFIG.numberTypes[nt], ...(CONFIG.operations[op]?.[nt] || {}) });

  const genNumber = (range, nt) => {
    if (nt === 'fraction') return { n: randInt(range.minNum, range.maxNum), d: randInt(range.minDen, range.maxDen) };
    if (nt === 'decimal') return randDecimal(range.min, range.max, range.decimalPlaces || 2);
    return randInt(range.min, range.max);
  };

  const opSymbol = { addition: '+', subtraction: '−', multiplication: '×', division: '÷' };
  const formatNum = (v, nt) => nt === 'fraction' ? `${v.n}/${v.d}` : String(v);

  const computeFraction = (a, b, op) => {
    let rn, rd;
    if (op === 'addition')       { rn = a.n * b.d + b.n * a.d; rd = a.d * b.d; }
    else if (op === 'subtraction') { rn = a.n * b.d - b.n * a.d; rd = a.d * b.d; }
    else if (op === 'multiplication') { rn = a.n * b.n; rd = a.d * b.d; }
    else { rn = a.n * b.d; rd = a.d * b.n; }
    return simplify(rn, rd);
  };

  const generate = (operation, numberType) => {
    const range = getRange(operation, numberType);
    const problems = [];

    for (let i = 0; i < CONFIG.questionsPerSet; i++) {
      let a = genNumber(range, numberType);
      let b = genNumber(range, numberType);

      if (operation === 'division') {
        if (numberType === 'fraction') {
          while (b.n === 0) b = genNumber(range, numberType);
        } else {
          if (b === 0) b = 1;
          if (['whole', 'positive', 'negative'].includes(numberType)) {
            a = b * randInt(1, Math.floor(Math.abs(range.max / b)) || 2);
            if (numberType === 'negative' && a > 0) a = -a;
          }
        }
      }

      let answer;
      if (numberType === 'fraction') {
        answer = computeFraction(a, b, operation);
      } else if (operation === 'addition') answer = a + b;
      else if (operation === 'subtraction') answer = a - b;
      else if (operation === 'multiplication') answer = a * b;
      else answer = numberType === 'decimal'
        ? parseFloat((a / b).toFixed(range.decimalPlaces || 2))
        : a / b;

      problems.push({
        text: `${formatNum(a, numberType)} ${opSymbol[operation]} ${formatNum(b, numberType)}`,
        answer, numberType
      });
    }
    return problems;
  };

  return { generate, simplify, gcd };
})();
