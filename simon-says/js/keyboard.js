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
const DEF_KEYS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
  #onClick = null;
  #keysMap = {}; /* {char, key} */

  constructor({ keys = DEF_KEYS } = {}) {
    this.#element = new Element({ tag: 'ul', className: cls.keyboard });
    this.appendKeys(keys);
    this.#addInteractivity();
  }

  #isActiveKey = (key) => {
    return key === this.#activeKey;
  };

  #isValidChar = (e) => {
    return e.key.length === 1 && /^key|digit|numpad/i.test(e.code);
  };

  #isKeyHidden = (char) => {
    return this.#keysMap[char].hidden;
  };

  #wasActivatedByKeyboard = () => {
    const { pointerEvents } = this.#element.ref.style;
    return this.#activeKey && pointerEvents === 'none';
  };

  #handleKeydown = (e) => {
    if (this.#disabled) {
      return;
    }
    // there is already an active key (avoid repeating same key)
    if (this.#activeKey) {
      // disable all keyboard side effects
      e.preventDefault();
      return;
    }
    // skip invalid chars
    if (!this.#isValidChar(e)) {
      return;
    }
    const char = e.code.slice(-1);
    if (this.#isKeyHidden(char)) {
      return;
    }
    const key = this.findKeyByText(char);
    if (!key) {
      return;
    }
    this.#activeKey = key;
    key.toggleClass(cls.keyActive);
    this.allowPointerEvents(false);

    this.#onClick?.(key.text, key);
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
    const char = e.code.slice(-1);
    if (this.#isKeyHidden(char)) {
      return;
    }
    const key = this.findKeyByText(char);
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

    this.#onClick?.(key.text, key);
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

  showKeys(regex) {
    if (!(regex instanceof RegExp)) {
      return;
    }
    Object.entries(this.#keysMap).forEach(([char, keyData]) => {
      // show
      if (regex.test(char)) {
        keyData.key.ref.style.display = '';
        keyData.hidden = false;
      } else {
        keyData.key.ref.style.display = 'none';
        keyData.hidden = true;
      }
    });
    // this.keys.forEach((key) => {
    //   key.ref.style.display = regex.test(key.text) ? '' : 'none';
    // });
  }

  set difficulty(v) {
    if (/easy/i.test(v)) {
      this.showKeys(/[0-9]/);
    } else if (/medium/i.test(v)) {
      this.showKeys(/[a-z]/i);
    } else if (/hard/i.test(v)) {
      this.showKeys(/.*/);
    }
  }

  // findKeyByText(text) {
  //   return isStr(text) && text.length === 1
  //     ? this.keys.find((key) => key.text === text.toLocaleUpperCase())
  //     : null;
  // }

  findKeyByText(ch) {
    return this.#keysMap[ch]?.key;
  }

  findKeyByRef(ref) {
    return ref ? this.keys.find((key) => key.ref === ref) : null;
  }

  appendKeys(keys) {
    if (!isStr(keys)) {
      console.debug('"keys" string expected');
      return;
    }
    const children = [...keys].map((ch) => {
      const char = ch.toLocaleUpperCase();

      const key = new Element({
        tag: 'li',
        text: char,
        className: cls.key,
      });
      // set styles
      const mixed = getColorMixCSS();
      key.ref.style.backgroundColor = mixed;
      key.ref.style.border = `2px solid ${mixed}`;

      this.#keysMap[char] = { key, hidden: false };

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

  set onClick(handler) {
    this.#onClick = isFunc(handler) ? handler : null;
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
