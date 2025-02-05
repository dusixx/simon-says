import * as refs from './refs.js';
import { updateKeyboard, generateSequence, sleep } from '../utils/index.js';

const {
  difficulty,
  keyboard,
  userInput,
  btnStart,
  btnRepeat,
  controls,
  roundsCounter,
} = refs;

const caption = {
  REPEAT: btnRepeat.text,
  START: btnStart.text,
  NEXT: 'Next',
  NEW_GAME: 'New game',
};

let sequence = '';
let attemptsLeft = 1;
let repeatBtnMode = 'repeat'; // repeat|next
let startBtnMode = 'start'; // start|newgame

//
//------------------
// Helpers/handlers
//------------------
//

export const init = () => {
  attemptsLeft = 1;

  btnRepeat.hide();
  difficulty.disabled = false;

  roundsCounter.value = 1;
  roundsCounter.hide();

  userInput.clear();
  userInput.visible = false;

  keyboard.disabled = true;
  updateKeyboard(keyboard, difficulty.value);
};

const startNewRound = async () => {
  attemptsLeft = 1;

  repeatBtnMode = 'repeat';
  btnRepeat.text = caption.REPEAT;
  btnRepeat.disabled = false;
  btnRepeat.show();

  difficulty.disabled = true;
  keyboard.repaint();
  roundsCounter.show();

  userInput.visible = true;
  userInput.clear();

  await showSequence();
};

const showSequence = async ({ repeat = false, delayBefore = 700 } = {}) => {
  btnStart.disabled = true;
  btnRepeat.disabled = true;

  sequence = repeat
    ? sequence
    : generateSequence({
        round: roundsCounter.value,
        difficulty: difficulty.value,
      });

  console.clear();
  console.log('sequence:', [...sequence]);

  await sleep(delayBefore);
  await keyboard.highlight({ sequence, delay: 500, duration: 300 });

  btnStart.disabled = false;
  btnRepeat.disabled = !attemptsLeft;
};

const handleWrongSequenceInput = () => {
  if (!attemptsLeft) {
    userInput.error('You lost!🥴');
  } else {
    userInput.error('Wrong, try again!😟');
  }
  keyboard.disabled = true;
};

const handleRightSequenceInput = () => {
  if (roundsCounter.value === roundsCounter.max) {
    userInput.success('You won!🥳');
    btnRepeat.disabled = true;
  } else {
    userInput.success('Right, click Next!😎');

    btnRepeat.text = caption.NEXT;
    repeatBtnMode = 'next';
    btnRepeat.disabled = false;
  }
  keyboard.disabled = true;
};

const handleRepeatClick = async () => {
  userInput.clear();
  await showSequence({ repeat: true });
  btnRepeat.disabled = true;
  attemptsLeft -= 1;
};

const handleNextClick = async () => {
  btnRepeat.text = caption.REPEAT;
  repeatBtnMode = 'repeat';
  roundsCounter.value += 1;
  await startNewRound();
};

const handleStartClick = async () => {
  btnStart.text = caption.NEW_GAME;
  startBtnMode = 'newgame';
  await startNewRound();
};

const handleNewGameClick = () => {
  btnStart.text = caption.START;
  startBtnMode = 'start';
  init();
};

//
//------------------
// Listeners
//------------------
//

difficulty.onChange = (value) => {
  updateKeyboard(keyboard, value);
};

btnStart.onClick = async () => {
  if (startBtnMode === 'start') {
    await handleStartClick();
  } else {
    handleNewGameClick();
  }
};

btnRepeat.onClick = async () => {
  if (repeatBtnMode === 'repeat') {
    await handleRepeatClick();
  } else {
    await handleNextClick();
  }
};

keyboard.onClick = (char) => {
  userInput.value += char;
  const len = userInput.value.length;

  if (userInput.value === sequence) {
    handleRightSequenceInput();
  } else if (userInput.value !== sequence.slice(0, len)) {
    handleWrongSequenceInput();
  }
};
