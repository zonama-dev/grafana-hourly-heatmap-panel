/*
 * In order to extend the configuration follow the steps in
 * https://grafana.com/developers/plugin-tools/get-started/set-up-development-environment#extend-the-eslint-config
 */
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

/**
 * @type {Array<import('eslint').Linter.Config>}
 */
module.exports = tseslint.config(
  {
    ignores: [
      '.github',
      '.yarn',
      '**/build/',
      '**/compiled/',
      '**/dist/',
      '.config/**/*',
      '*.config.[jt]s',
      '**/*.spec.ts',
      '.prettierrc.js',
      'jest-setup.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  // Shared configs
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // Prettier
  prettierRecommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-deprecated': 'error',
    },
  },
  {
    files: ['./tests/**/*'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'react/prop-types': 'off',
    },
  },
);
