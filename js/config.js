const CONFIG = {
  // Google Apps Script deployed web app URL — replace after deploying Code.gs
  sheetsUrl: '',

  // Difficulty ranges per number type
  // Each operation inherits these unless overridden
  numberTypes: {
    whole:    { min: 1, max: 100 },
    positive: { min: 1, max: 50 },
    negative: { min: -50, max: -1 },
    decimal:  { min: 1, max: 50, decimalPlaces: 2 },
    fraction: { minNum: 1, maxNum: 12, minDen: 2, maxDen: 12 }
  },

  // Per-operation overrides (merged with numberType defaults)
  operations: {
    addition:       {},
    subtraction:    {},
    multiplication: {
      whole:    { min: 1, max: 20 },
      positive: { min: 1, max: 20 },
      negative: { min: -20, max: -1 },
      decimal:  { min: 1, max: 20, decimalPlaces: 1 }
    },
    division: {
      whole:    { min: 1, max: 50 },
      positive: { min: 1, max: 30 },
      negative: { min: -30, max: -1 },
      decimal:  { min: 1, max: 20, decimalPlaces: 1 }
    }
  },

  questionsPerSet: 10
};
