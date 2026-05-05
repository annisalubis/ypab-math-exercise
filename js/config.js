export const CONFIG = {
  sheetsUrl: '',
  categories: {
    addition: {
      label: 'Addition (+)',
      subcategories: {
        '10-100': { label: '10 - 100', min: 10, max: 100 },
      },
    },
    subtraction: {
      label: 'Subtraction (−)',
      subcategories: {
        '10-100': { label: '10 - 100', min: 10, max: 100 },
      },
    },
    multiplication: {
      label: 'Multiplication (×)',
      subcategories: {
        '1-10': { label: '1 - 10', min: 1, max: 10 },
      },
    },
    division: {
      label: 'Division (÷)',
      subcategories: {
        '1-100': { label: '1 - 100', min: 1, max: 100 },
      },
    },
    decimal: {
      label: 'Decimals',
      subcategories: {
        addition: { label: 'Addition (+)', min: 1, max: 50, decimalPlaces: 2 },
        subtraction: { label: 'Subtraction (−)', min: 1, max: 50, decimalPlaces: 2 },
        multiplication: { label: 'Multiplication (×)', min: 1, max: 20, decimalPlaces: 1 },
      },
    },
  },
  questionsPerSet: 10,
};
