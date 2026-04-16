import { getColorMixCSS } from '../../common/utils.js';

export const ClassName = {
  Key: 'key',
  KeyActive: 'key--active',
  Keyboard: 'keyboard',
};

export const setStyles = ({ ref: { style } }) => {
  const mixed = getColorMixCSS();
  style.backgroundColor = mixed;
  style.border = `2px solid ${mixed}`;
};
