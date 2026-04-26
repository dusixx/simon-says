import { getColorMixCSS } from '@/common';

export const setStyles = ({ ref: { style } }) => {
  const mixed = getColorMixCSS();
  style.backgroundColor = mixed;
  style.border = `2px solid ${mixed}`;
};
