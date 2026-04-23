import {
  ClassName,
  KEY_CHARS,
  KEY_HIGHLIGHT_MIN_TIMEOUT,
  isFunc,
  isInt,
  isRegex,
  isStr,
  sleep,
} from '@/common';
import { Element } from '@/components';
import { setStyles } from './keyboard.utils.js';

export class Keyboard {
  #element;
  #disabled;
  #onClick = null;
  #active = {}; /* {key, initiator} */
  #keysMap = {}; /* {char, {key, hidden}} */

  constructor({ keys = KEY_CHARS } = {}) {
    this.#element = new Element({ tag: 'ul', className: ClassName.Keyboard });
    this.appendKeys(keys);
    this.#addInteractivity();
  }

  get [Symbol.toStringTag]() {
    return 'Keyboard';
  }

  #isActive = (key) => {
    return key === this.#active?.key;
  };

  #isValidChar = (e) => {
    return e.key.length === 1 && /^key|digit|numpad/i.test(e.code);
  };

  #isKeyHidden = (char) => {
    return this.#keysMap[char].hidden;
  };

  #handleKeydown = (e) => {
    // there is already an active key (avoid repeating same key)
    if (this.#active) {
      // disable all keyboard side effects
      e.preventDefault();
      return;
    }
    if (this.#disabled || !this.#isValidChar(e)) {
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
    this.#active = { key, initiator: 'keydown' };

    key.toggleClass(ClassName.KeyActive);
    this.allowPointerEvents(false);

    this.#onClick?.(key.text, key);
  };

  #handleKeyup = (e) => {
    if (this.#disabled || !this.#active || !this.#isValidChar(e)) {
      return;
    }
    const char = e.code.slice(-1);
    if (this.#isKeyHidden(char)) {
      return;
    }
    const key = this.findKeyByText(char);
    if (!this.#isActive(key)) {
      return;
    }
    this.#active = null;

    key.toggleClass(ClassName.KeyActive);
    this.allowPointerEvents(true);
  };

  #handleMousedown = (e) => {
    if (this.#active) {
      return;
    }
    const key = this.findKeyByRef(e.target);
    this.#active = { key, initiator: 'mousedown' };

    this.#onClick?.(key.text, key);
  };

  // active key should be cleared even if button was released outside the keyboard
  #handleDocumentMouseup = (_) => {
    if (this.#active?.initiator === 'mousedown') {
      this.#active = null;
    }
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

  #highlightKeyByChar = async (ch, timeout) => {
    if (!isInt(timeout) || timeout < KEY_HIGHLIGHT_MIN_TIMEOUT) {
      timeout = KEY_HIGHLIGHT_MIN_TIMEOUT;
    }
    const key = this.findKeyByText(ch);
    if (!key) {
      return;
    }
    this.#active = { key };

    key.toggleClass(ClassName.KeyActive);
    await sleep(timeout);
    key.toggleClass(ClassName.KeyActive);

    this.#active = null;
  };

  async highlight({ sequence: seq, duration, delay } = {}) {
    if (!isStr(seq)) {
      return;
    }
    delay = !isInt(delay) || delay < 0 ? 0 : delay;

    this.disabled = true;

    for (let i = 0; i < seq.length; i += 1) {
      await this.#highlightKeyByChar(seq[i], duration);
      if (i === seq.length - 1) {
        break;
      }
      await sleep(delay);
    }
    this.disabled = false;
  }

  showKeys(regex) {
    if (!isRegex(regex)) {
      return;
    }
    Object.entries(this.#keysMap).forEach(([char, keyData]) => {
      const willBeShown = regex.test(char);

      keyData.key.ref.style.display = willBeShown ? '' : 'none';
      keyData.hidden = !willBeShown;
    });
  }

  findKeyByText(ch) {
    return this.#keysMap[ch]?.key;
  }

  findKeyByRef(ref) {
    return ref ? this.keys.find((key) => key.ref === ref) : null;
  }

  repaint() {
    this.keys.forEach(setStyles);
  }

  appendKeys(keys) {
    if (!isStr(keys)) {
      throw TypeError('"keys" string expected');
    }
    const children = [...keys].map((ch) => {
      const char = ch.toLocaleUpperCase();
      const key = new Element({
        tag: 'li',
        text: char,
        className: ClassName.Key,
      });
      setStyles(key);
      this.#keysMap[char] = { key, hidden: false };

      return key;
    });
    this.#element.append(...children);
  }

  clearActive() {
    this.#active?.key?.toggleClass(ClassName.KeyActive, false);
    this.#active = null;
  }

  get active() {
    return this.#active;
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(v) {
    this.allowPointerEvents(!v);
    this.#disabled = Boolean(v);
    if (v) {
      this.clearActive();
    }
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

  get onClick() {
    return this.#onClick;
  }
}
