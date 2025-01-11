import { getColorMixCSS } from './helpers.js';
import { Keyboard } from './keyboard.js';
import { Element } from './element.js';
import { Difficulty } from './difficulty.js';
import { RoundsCounter } from './rounds-counter.js';
import { Button } from './button.js';
import { TextInput } from './text-input.js';

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
  text: 'Repeat',
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

const main = new Element(
  { tag: 'main' },
  new Element(
    { className: 'wrapper' },
    header,
    userInput.underlyingElement,
    keyboard.underlyingElement,
    controls
  )
);

document.body.append(main.ref);
