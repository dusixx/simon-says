import { difficultyLevel, DEF_KEY_CHARS } from './data.js';

const toStr = Object.prototype.toString;
export const getTypeName = (v) => toStr.call(v).slice(8, -1);

export const isStr = (v) => typeof v === 'string';
export const isInt = (v) => Number.isInteger(Number(v));
export const isFunc = (v) => typeof v === 'function';
export const isRegex = (v) => v instanceof RegExp;

export const updateKeyboard = (keyboard, difficulty) => {
  if (getTypeName(keyboard) !== 'Keyboard') {
    return;
  }
  const pattern = difficultyLevel[difficulty.toLowerCase()]?.pattern;
  if (pattern) {
    keyboard.showKeys(pattern);
  }
};

export const generateSequence = ({ round = 1, difficulty = 'easy' } = {}) => {
  const chars = DEF_KEY_CHARS;

  return Array.from({ length: round * 2 }, (v) => {
    const { range } = difficultyLevel[difficulty.toLowerCase()];
    return chars[rndInt(...range)];
  }).join('');
};

// export const isIterable = (v) => {
//   if (isFunc(v?.[Symbol.iterator])) {
//     try {
//       for (let _ of v) {
//         return true;
//       }
//     } catch {}
//   }
//   return false;
// };

// export const fitIntoRange = (v, min, max) => {
//   const res = Math.max(min, Math.min(max, v));
//   return Number.isNaN(res) ? null : res;
// };

export const sleep = async (tio) => {
  await new Promise((resolve) => setTimeout(resolve, tio));
};

export const rndInt = (min, max) => {
  return Math.round(min + Math.random() * (max - min));
};

export const getRandomColor = ({ min = 0, max = 255 } = {}) => {
  const rgb = [0, 0, 0].map((v) => rndInt(min, max));
  const hex = rgb.map((v) => v.toString(16).padStart(2, 0));

  return { rgb, hex: `#${hex.join('')}` };
};

// export const applyColorAlpha = (hexColor, opacity = 1) => {
//   const alpha = fitIntoRange(opacity, 0, 1) ?? 1;
//   const alphaHex = Math.floor(alpha * 255)
//     .toString(16)
//     .padStart(2, 0);

//   return `${hexColor}${alphaHex}`;
// };

export const getColorMixCSS = ({
  min = 25,
  max = 30,
  perecent = 50,
  baseColor = '#ffcfcf',
} = {}) => {
  const rnd = rndInt(min, max);
  const co1 = getRandomColor().hex;

  return `color-mix(in oklab, ${co1} ${rnd}%, ${baseColor} ${perecent}%)`;
};
