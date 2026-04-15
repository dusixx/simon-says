import globals from 'globals';
import pluginJs from '@eslint/js';
// import eslintConfigPrettier from 'eslint-config-prettier';
// sets up both eslint-plugin-prettier and eslint-config-prettier in one go.
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...compat.config({
    // extends: 'airbnb-base/legacy',
    extends: 'standard',
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  }),
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  // Any other config imports go at the top
  eslintPluginPrettierRecommended,
  // eslintConfigPrettier,
];
