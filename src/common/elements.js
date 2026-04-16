import { Element } from '../components/base/element.js';
import {
  Button,
  Difficulty,
  Keyboard,
  RoundsCounter,
  StatusBox,
} from '../components/index.js';
import { getColorMixCSS } from './utils.js';

export const keyboard = new Keyboard();
export const difficulty = new Difficulty();
export const roundsCounter = new RoundsCounter();

export const statusBox = new StatusBox({
  tabIndex: -1,
  readonly: '',
  placeholder: 'Your sequence',
  className: 'user-input',
});

export const btnStart = new Button({
  text: 'Start🚀',
  className: 'controls__start btn-primary',
});

export const btnRepeat = new Button({
  text: 'Repeat the sequence',
  className: 'controls__repeat btn-primary',
});

export const controls = new Element(
  { className: 'controls' },
  btnStart.underlyingElement,
  btnRepeat.underlyingElement
);

const stats = new Element(
  { className: 'stats' },
  roundsCounter.underlyingElement,
  difficulty.underlyingElement
);

const logo = new Element(
  { className: 'logo' },
  ...[...'🦜SimonSays'].map((text) => {
    const el = new Element({ tag: 'span', text });
    const mixed = getColorMixCSS({ baseColor: '#ff43f7' });
    el.ref.style.color = mixed;

    return el;
  })
);

export const header = new Element(
  { tag: 'header', className: 'header' },
  new Element({ className: 'header__wrapper' }, logo, stats)
);

export const main = new Element(
  { tag: 'main' },
  new Element(
    { className: 'main__wrapper' },
    statusBox.underlyingElement,
    keyboard.underlyingElement,
    controls
  )
);
