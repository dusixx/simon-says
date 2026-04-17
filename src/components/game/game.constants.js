import * as refs from '../ui/index.js';

export const {
  difficulty,
  keyboard,
  statusBox,
  btnStart,
  btnRepeat,
  roundsCounter,
} = refs;

export const SHOW_SEQUENCE_DELAY = 700;
export const HIGHLIGHT_DELAY = 500;
export const HIGHLIGHT_DURATION = 300;

export const StatusMessage = {
  Lost: 'You lost!🥴',
  Wrong: 'Wrong, try again!😟',
  Won: 'You won!🥳',
  Right: 'Right, click Next!😎',
};

export const ButtonCaption = {
  Repeat: btnRepeat.text,
  Start: btnStart.text,
  Next: 'Next',
  NewGame: 'New game',
};

export const ButtonMode = {
  Repeat: 'repeat',
  Start: 'start',
  Next: 'next',
  NewGame: 'newgame,',
};
