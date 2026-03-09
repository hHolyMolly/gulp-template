import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
      'no-unused-vars': 'warn',
      'no-var': 'error',
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',
      'object-shorthand': 'warn',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  // Browser scripts
  {
    files: ['src/scripts/**/*.js'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Node / Gulp scripts
  {
    files: ['gulpfile.js', 'gulp/**/*.js', 'project.config.js', '.template/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        app: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.min.js', '*.d.ts'],
  },
];
