import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        app: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.min.js'],
  },
];
