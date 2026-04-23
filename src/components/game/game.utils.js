import {
  DIFFICULTY_VALUES,
  difficultyLevel,
  getTypeName,
  KEY_CHARS,
  rndInt,
} from '@/common';

export const updateKeyboard = (keyboard, difficulty) => {
  if (getTypeName(keyboard) !== 'Keyboard') {
    return;
  }
  const pattern = difficultyLevel[difficulty.toLowerCase()]?.pattern;
  keyboard.showKeys(pattern);
};

export const generateSequence = ({
  round = 1,
  difficulty = DIFFICULTY_VALUES[0],
} = {}) => {
  return Array.from({ length: round * 2 }, (_) => {
    const { range } = difficultyLevel[difficulty.toLowerCase()];
    return KEY_CHARS[rndInt(...range)];
  }).join('');
};
