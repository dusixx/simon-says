export const DEF_KEY_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const DEF_DIFFICULTY_VALUES = ['easy', 'medium', 'hard'];

export const KEY_HIGHLIGHT_MIN_TIMEOUT = 300;

export const difficultyLevel = {
  easy: {
    pattern: /[0-9]/,
    range: [0, 9],
  },
  medium: {
    pattern: /[a-z]/i,
    range: [10, DEF_KEY_CHARS.length - 1],
  },
  hard: {
    pattern: /.*/,
    range: [0, DEF_KEY_CHARS.length - 1],
  },
};
