import { Element } from './element.js';
import {
  isFunc,
  isInt,
  isIterable,
  isStr,
  rndInt,
  getRandomColor,
  sleep,
  getColorMixCSS,
} from './helpers.js';

const MIN_HIGHLIGHT_TIO = 300;
const DEF_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const cls = {
  key: 'key',
  keyActive: 'key--active',
  keyboard: 'keyboard',
};

const setColor = ({ ref: { style } }) => {
  const mixed = getColorMixCSS();

  style.backgroundColor = mixed;
  style.border = `2px solid ${mixed}`;
};

//
// Keyboard
//

export class Keyboard {
  #element;
  #activeKey;
  #disabled;
  #onHit = null;

  constructor({ keys = DEF_KEYS } = {}) {
    this.#element = new Element({ tag: 'ul', className: cls.keyboard });
    this.append(keys);
    this.#addInteractivity();
  }

  #isActiveKey = (key) => {
    return key === this.#activeKey;
  };

  #isValidChar = (e) => {
    return e.key.length === 1 && /^key|digit|numpad/i.test(e.code);
  };

  #wasActivatedByKeyboard = () => {
    const { pointerEvents } = this.#element.ref.style;
    return this.#activeKey && pointerEvents === 'none';
  };

  #handleKeydown = (e) => {
    if (this.#disabled) {
      return;
    }
    // there is already an active key
    // Avoid repeating same key
    if (this.#activeKey) {
      // disable all keyboard side effects
      e.preventDefault();
      return;
    }
    // skip invalid chars
    if (!this.#isValidChar(e)) {
      return;
    }
    const key = this.findKeyByText(e.code.slice(-1));
    if (!key) {
      return;
    }
    this.#activeKey = key;
    key.toggleClass(cls.keyActive);
    this.allowPointerEvents(false);

    if (this.#onHit) {
      this.#onHit(key.text, key);
    }
  };

  #handleKeyup = (e) => {
    if (this.#disabled) {
      return;
    }
    // nothing to reset
    if (!this.#activeKey) {
      return;
    }
    if (!this.#isValidChar(e)) {
      return;
    }
    const key = this.findKeyByText(e.code.slice(-1));
    if (!this.#isActiveKey(key)) {
      return;
    }
    this.#activeKey = null;
    key.toggleClass(cls.keyActive);
    this.allowPointerEvents(true);
  };

  #handleMousedown = (e) => {
    if (!e.target.classList.contains(cls.key)) {
      return;
    }
    const key = this.findKeyByRef(e.target);
    this.#activeKey = key;

    if (this.#onHit) {
      this.#onHit(key.text, key);
    }
  };

  // active key should be cleared even if button was released outside the keyboard
  #handleDocumentMouseup = (e) => {
    if (this.#wasActivatedByKeyboard()) {
      return;
    }
    this.#activeKey = null;
  };

  #addInteractivity = () => {
    document.addEventListener('keydown', this.#handleKeydown);
    document.addEventListener('keyup', this.#handleKeyup);
    document.addEventListener('mouseup', this.#handleDocumentMouseup);
    this.#element.ref.addEventListener('mousedown', this.#handleMousedown);
  };

  allowPointerEvents(v) {
    this.#element.ref.style.pointerEvents = v ? '' : 'none';
  }

  #activate = async (str, timeout) => {
    if (!isInt(timeout) || timeout < MIN_HIGHLIGHT_TIO) {
      timeout = MIN_HIGHLIGHT_TIO;
    }
    const key = this.findKeyByText(str);
    if (!key) {
      return;
    }
    this.#activeKey = key;

    key.toggleClass(cls.keyActive);
    await sleep(timeout);
    key.toggleClass(cls.keyActive);

    this.#activeKey = null;
  };

  async activate({ sequence: seq, duration, delay } = {}) {
    if (!isStr(seq) || !seq) {
      return;
    }
    if (!isInt(delay) || delay < 0) {
      delay = 0;
    }
    this.disabled = true;

    for (let i = 0; i < seq.length; i += 1) {
      await this.#activate(seq[i], duration);
      if (i === seq.length - 1) {
        break;
      }
      await sleep(delay);
    }
    this.disabled = false;
  }

  show(regex) {
    if (!(regex instanceof RegExp)) {
      return;
    }
    this.keys.forEach((key) => {
      key.ref.style.display = regex.test(key.text) ? '' : 'none';
    });
  }

  findKeyByText(text) {
    return isStr(text) && text.length === 1
      ? this.keys.find((key) => key.text === text.toLocaleUpperCase())
      : null;
  }

  findKeyByRef(ref) {
    return ref ? this.keys.find((key) => key.ref === ref) : null;
  }

  append(keys) {
    if (!isIterable(keys)) {
      console.debug('"keys" iterable expected');
      return;
    }
    const children = [...keys].map((v) => {
      const key = new Element({
        tag: 'li',
        text: v.toLocaleUpperCase(),
        className: cls.key,
      });
      const mixed = getColorMixCSS();
      key.ref.style.backgroundColor = mixed;
      key.ref.style.border = `2px solid ${mixed}`;

      return key;
    });
    this.#element.append(...children);
  }

  get keys() {
    return this.#element.children;
  }

  get ref() {
    return this.#element.ref;
  }

  get underlyingElement() {
    return this.#element;
  }

  set onHit(handler) {
    this.#onHit = isFunc(handler) ? handler : null;
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(v) {
    this.allowPointerEvents(!Boolean(v));
    this.#disabled = Boolean(v);
    //this.#element.ref.style.opacity = v ? '0.5' : '';
  }
}
