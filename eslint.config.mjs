import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-unused-vars': 'off',   // Disable unused variable warnings
    '@typescript-eslint/no-unused-vars': 'off',  // Disable unused variable warnings for TypeScript
    '@typescript-eslint/no-explicit-any': 'off', // Disable explicit 'any' type rule
    'react-hooks/exhaustive-deps': 'off', // Disable mi
    },
  }),
]




export default eslintConfig;
