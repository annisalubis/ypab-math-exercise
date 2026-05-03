export const CONFIG = {
  sheetsUrl: '',
  categories: {
    addition: {
      'basic': { min: 1, max: 100 }
    },
    subtraction: {
      'basic': { min: 1, max: 100 }
    },
    multiplication: {
      '1-10': { min: 1, max: 10 }
    },
    division: {
      '1-100': { min: 1, max: 100 }
    },
    decimal: {
      addition:       { min: 1, max: 50, decimalPlaces: 2 },
      subtraction:    { min: 1, max: 50, decimalPlaces: 2 },
      multiplication: { min: 1, max: 20, decimalPlaces: 1 },
      division:       { min: 1, max: 20, decimalPlaces: 1 }
    },
    fraction: {
      addition:       { minNum: 1, maxNum: 12, minDen: 2, maxDen: 12 },
      subtraction:    { minNum: 1, maxNum: 12, minDen: 2, maxDen: 12 },
      multiplication: { minNum: 1, maxNum: 12, minDen: 2, maxDen: 12 },
      division:       { minNum: 1, maxNum: 12, minDen: 2, maxDen: 12 }
    }
  },
  questionsPerSet: 10
};
