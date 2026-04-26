export * from './class-name.js';

export const KEY_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIFFICULTY_VALUES = ['easy', 'medium', 'hard'];
export const KEY_HIGHLIGHT_MIN_TIMEOUT = 300;
export const ROUNDS_COUNT = 5;

export const difficultyLevel = {
  easy: {
    pattern: /[0-9]/,
    range: [0, 9],
  },
  medium: {
    pattern: /[a-z]/i,
    range: [10, KEY_CHARS.length - 1],
  },
  hard: {
    pattern: /.*/,
    range: [0, KEY_CHARS.length - 1],
  },
};
