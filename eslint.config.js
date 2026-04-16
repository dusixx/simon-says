import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

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
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.mjs', '.cjs', '.json'],
        },
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/no-unresolved': 'error',
      'import/order': 'warn',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '*.min.js', '**/*.config.js'],
  },
];
