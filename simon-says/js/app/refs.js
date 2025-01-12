import { Element, getColorMixCSS } from '../utils/index.js';

import {
  Keyboard,
  Difficulty,
  RoundsCounter,
  Button,
  TextInput,
} from '../components/index.js';

export const keyboard = new Keyboard();
export const difficulty = new Difficulty();
export const roundsCounter = new RoundsCounter();

export const userInput = new TextInput({
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
  {
    tag: 'div',
    className: 'logo',
  },
  ...[...'🦜SimonSays'].map((text) => {
    const el = new Element({ tag: 'span', text });
    const mixed = getColorMixCSS({ perecent: 50, baseColor: '#ff43f7' });
    el.ref.style.color = mixed;

    return el;
  })
);

const header = new Element({ tag: 'header', className: 'header' }, logo, stats);

const wrapper = new Element(
  { className: 'wrapper' },
  header,
  userInput.underlyingElement,
  keyboard.underlyingElement,
  controls
);

const main = new Element({ tag: 'main' }, wrapper);
document.body.append(main.ref);
