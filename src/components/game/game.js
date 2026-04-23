import { sleep } from '@/common';
import {
  ButtonCaption,
  ButtonMode,
  difficulty,
  HIGHLIGHT_DELAY,
  HIGHLIGHT_DURATION,
  keyboard,
  repeatBtn,
  roundsCounter,
  SHOW_SEQUENCE_DELAY,
  startBtn,
  statusBox,
  StatusMessage,
} from './game.constants.js';
import { generateSequence, updateKeyboard } from './game.utils.js';

export class Game {
  lastSequence = '';
  attemptsLeft = 1;
  repeatBtnMode = ButtonMode.Repeat;
  startBtnMode = ButtonMode.Start;

  constructor() {
    this.#init();
    this.reset();
  }

  #init() {
    difficulty.onChange = (value) => {
      updateKeyboard(keyboard, value);
    };

    startBtn.onClick = async () => {
      if (this.startBtnMode === ButtonMode.Start) {
        await this.handleStartClick();
      } else {
        this.handleNewGameClick();
      }
    };

    repeatBtn.onClick = async () => {
      if (this.repeatBtnMode === ButtonMode.Repeat) {
        await this.handleRepeatClick();
      } else {
        await this.handleNextClick();
      }
    };

    keyboard.onClick = (char) => {
      statusBox.value += char;
      const len = statusBox.value.length;

      if (statusBox.value === this.lastSequence) {
        this.handleRightSequenceInput();
      } else if (statusBox.value !== this.lastSequence.slice(0, len)) {
        this.handleWrongSequenceInput();
      }
    };
  }

  reset() {
    this.attemptsLeft = 1;

    repeatBtn.hide();
    difficulty.disabled = false;

    roundsCounter.value = 1;
    roundsCounter.hide();

    statusBox.clear();
    statusBox.visible = false;

    keyboard.disabled = true;
    updateKeyboard(keyboard, difficulty.value);
  }

  async start() {
    this.attemptsLeft = 1;

    this.repeatBtnMode = ButtonMode.Repeat;
    repeatBtn.text = ButtonCaption.Repeat;
    repeatBtn.disabled = false;
    repeatBtn.show();

    difficulty.disabled = true;
    keyboard.repaint();
    roundsCounter.show();

    statusBox.visible = true;
    statusBox.clear();

    await this.showSequence();
  }

  async showSequence({
    repeat = false,
    delayBefore = SHOW_SEQUENCE_DELAY,
  } = {}) {
    startBtn.disabled = true;
    repeatBtn.disabled = true;

    this.lastSequence = repeat
      ? this.lastSequence
      : generateSequence({
          round: roundsCounter.value,
          difficulty: difficulty.value,
        });

    console.debug('last sequence:', [...this.lastSequence]);

    await sleep(delayBefore);
    await keyboard.highlight({
      sequence: this.lastSequence,
      delay: HIGHLIGHT_DELAY,
      duration: HIGHLIGHT_DURATION,
    });

    startBtn.disabled = false;
    repeatBtn.disabled = !this.attemptsLeft;
  }

  handleWrongSequenceInput = () => {
    if (this.attemptsLeft <= 0) {
      statusBox.error(StatusMessage.Lost);
    } else {
      statusBox.error(StatusMessage.Wrong);
    }
    keyboard.disabled = true;
  };

  handleRightSequenceInput = () => {
    if (roundsCounter.value === roundsCounter.max) {
      statusBox.success(StatusMessage.Won);
      repeatBtn.disabled = true;
    } else {
      statusBox.success(StatusMessage.Right);

      repeatBtn.text = ButtonCaption.Next;
      this.repeatBtnMode = ButtonMode.Next;
      repeatBtn.disabled = false;
    }
    keyboard.disabled = true;
  };

  handleRepeatClick = async () => {
    if (this.attemptsLeft <= 0) {
      repeatBtn.disabled = true;
      return;
    }
    statusBox.clear();
    await this.showSequence({ repeat: true });
    repeatBtn.disabled = true;
    this.attemptsLeft -= 1;
  };

  handleNextClick = async () => {
    repeatBtn.text = ButtonCaption.Repeat;
    this.repeatBtnMode = ButtonMode.Repeat;
    roundsCounter.value += 1;
    await this.start();
  };

  handleStartClick = async () => {
    startBtn.text = ButtonCaption.NewGame;
    this.startBtnMode = ButtonMode.NewGame;
    await this.start();
  };

  handleNewGameClick = () => {
    startBtn.text = ButtonCaption.Start;
    this.startBtnMode = ButtonMode.Start;
    this.reset();
  };
}
