import { getColorMixCSS } from '../../common/utils.js';

export const cls = {
  key: 'key',
  keyActive: 'key--active',
  keyboard: 'keyboard',
};

export const setStyles = ({ ref: { style } }) => {
  const mixed = getColorMixCSS();
  style.backgroundColor = mixed;
  style.border = `2px solid ${mixed}`;
};
