export const CONFIG = {
  sheetsUrl: '',
  categories: {
    addition: {
      '10-100': { min: 10, max: 100 }
    },
    subtraction: {
      '10-100': { min: 10, max: 100 }
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
      multiplication: { min: 1, max: 20, decimalPlaces: 1 }
    }
  },
  questionsPerSet: 10
};
