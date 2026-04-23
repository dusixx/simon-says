import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'path';

const __dirname = import.meta.dirname;

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '*.min.js', '**/*.config.js'],
  },
];
