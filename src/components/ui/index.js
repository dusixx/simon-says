import { ClassName, getColorMixCSS } from '../../common/index.js';
import { Element } from '../base/element.js';
import {
  Button,
  Difficulty,
  Keyboard,
  RoundsCounter,
  StatusBox,
} from '../index.js';

export const keyboard = new Keyboard();
export const difficulty = new Difficulty();
export const roundsCounter = new RoundsCounter();

export const statusBox = new StatusBox({
  tabIndex: -1,
  readonly: '',
  placeholder: 'Your sequence',
  className: ClassName.StatusBox,
  id: ClassName.StatusBox,
});

export const btnStart = new Button({
  text: 'Start🚀',
  className: ClassName.StartBtn,
});

export const btnRepeat = new Button({
  text: 'Repeat the sequence',
  className: ClassName.RepeatBtn,
});

export const controls = new Element(
  { className: ClassName.Controls },
  btnStart.underlyingElement,
  btnRepeat.underlyingElement
);

const stats = new Element(
  { className: ClassName.Stats },
  roundsCounter.underlyingElement,
  difficulty.underlyingElement
);

const logo = new Element(
  { className: ClassName.Logo },
  ...[...'🦜SimonSays'].map((text) => {
    const el = new Element({ tag: 'span', text });
    const mixed = getColorMixCSS({ baseColor: '#ff43f7' });
    el.ref.style.color = mixed;

    return el;
  })
);

export const header = new Element(
  { tag: 'header', className: ClassName.Header },
  new Element({ className: ClassName.HeaderWrapper }, logo, stats)
);

export const main = new Element(
  { tag: 'main', className: ClassName.Main },
  new Element(
    { className: ClassName.MainWrapper },
    statusBox.underlyingElement,
    keyboard.underlyingElement,
    controls
  )
);
