import { getColorMixCSS, getRandomColor, rndInt, sleep } from './helpers.js';
import { Keyboard } from './keyboard.js';
import { Element } from './element.js';

//
// User input
//

export const userInput = new Element({
  tag: 'input',
  type: 'text',
  className: 'user-input',
  tabIndex: -1,
  maxLength: 10,
  placeholder: 'And you repeat',
});

//
// Controls
//

export const btnStart = new Element({
  tag: 'button',
  type: 'button',
  text: 'Start',
  className: 'controls__start btn-primary',
});

export const btnRepeat = new Element({
  tag: 'button',
  type: 'button',
  text: 'Repeat',
  className: 'controls__repeat btn-primary',
});

export const controls = new Element(
  { className: 'controls' },
  btnStart,
  btnRepeat
);

//
// Difficulty
//

export const difficultySelect = new Element(
  { tag: 'select', className: 'difficulty__select' },
  ...['easy', 'medium', 'hard'].map(
    (value) => new Element({ tag: 'option', value, text: value })
  )
);

const difficulty = new Element(
  { className: 'difficulty' },
  new Element({
    tag: 'span',
    text: 'Difficulty:',
    className: 'difficulty__label',
  }),
  difficultySelect
);

//
// Round
//

export const curRound = new Element({
  tag: 'span',
  className: 'round__current',
  text: 1,
});

export const totalRounds = new Element({
  tag: 'span',
  className: 'round__total',
  text: 5,
});

const round = new Element({ className: 'round' }, curRound, totalRounds);
curRound.ref.before('Round: ');
curRound.ref.after('/');

const stats = new Element({ className: 'stats' }, difficulty, round);

// const pageTitle = new Element(
//   {
//     tag: 'h1',
//     className: 'page-title',
//   },
//   ...[...'simon☺says'].map((text) => {
//     const el = new Element({ tag: 'span', text });
//     const mixed = getColorMixCSS({ perecent: 100, baseColor: 'violet' });
//     el.ref.style.color = mixed;

//     return el;
//   })
// );

export const keyboard = new Keyboard();

const main = new Element(
  { tag: 'main' },
  new Element(
    { className: 'wrapper' },
    stats,
    userInput,
    keyboard.underlyingElement,
    controls
  )
);

document.body.append(main.ref);
