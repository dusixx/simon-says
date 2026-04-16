import {
  DEF_DIFFICULTY_VALUES,
  DEF_KEY_CHARS,
  difficultyLevel,
} from '../../common/constants.js';
import { getTypeName, rndInt } from '../../common/utils.js';

export const updateKeyboard = (keyboard, difficulty) => {
  if (getTypeName(keyboard) !== 'Keyboard') {
    return;
  }
  const pattern = difficultyLevel[difficulty.toLowerCase()]?.pattern;
  keyboard.showKeys(pattern);
};

export const generateSequence = ({
  round = 1,
  difficulty = DEF_DIFFICULTY_VALUES[0],
} = {}) => {
  return Array.from({ length: round * 2 }, (_) => {
    const { range } = difficultyLevel[difficulty.toLowerCase()];
    return DEF_KEY_CHARS[rndInt(...range)];
  }).join('');
};
