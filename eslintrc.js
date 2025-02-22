module.exports = {
    root: true,
    extends: ['next', 'next/core-web-vitals'],
    rules: {
      'no-unused-vars': 'off',   // Disable unused variable warnings
      '@typescript-eslint/no-unused-vars': 'off',  // Disable unused variable warnings for TypeScript
      '@typescript-eslint/no-explicit-any': 'off', // Disable explicit 'any' type rule
      'react-hooks/exhaustive-deps': 'off', // Disable missing dependency warnings for hooks
      // Add more rules as necessary
    },
  };
  