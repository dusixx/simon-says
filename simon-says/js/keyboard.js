import { fitIntoRange, isFunc, isInt, isIterable, isStr } from './helpers.js';
import { Element } from './element.js';

const MIN_HIGHLIGHT_TIO = 300;
const DEF_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const cls = {
  key: 'key',
  keyActive: 'key--active',
  keyboard: 'keyboard',
};

export class Keyboard {
  #element;
  #highlightTimeout = MIN_HIGHLIGHT_TIO;
  #activeKey;
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
    // there is already an active key
    // Avoid repeating same key
    if (this.#activeKey) {
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
  #handleMouseup = (e) => {
    if (this.#wasActivatedByKeyboard()) {
      return;
    }
    this.#activeKey = null;
  };

  #handleDocumentKeydown = (e) => {
    // disable all keyboard side effects
    if (this.#activeKey) {
      e.preventDefault();
    }
  };

  #addInteractivity = () => {
    document.addEventListener('keydown', this.#handleKeydown);
    document.addEventListener('keyup', this.#handleKeyup);
    document.addEventListener('mouseup', this.#handleMouseup);
    document.addEventListener('keydown', this.#handleDocumentKeydown);
    this.#element.ref.addEventListener('mousedown', this.#handleMousedown);
  };

  allowPointerEvents(v) {
    this.#element.ref.style.pointerEvents = v ? '' : 'none';
  }

  activateByText(text, timeout = MIN_HIGHLIGHT_TIO) {
    if (!isInt(timeout) || timeout < MIN_HIGHLIGHT_TIO) {
      return;
    }
    const key = this.findKeyByText(text);
    if (!key) {
      return;
    }
    this.#activeKey = key;
    this.allowPointerEvents(false);

    key.toggleClass(cls.keyActive);
    setTimeout(() => key.toggleClass(cls.keyActive), timeout);

    this.allowPointerEvents(true);
    this.#activeKey = null;
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
      return new Element({
        tag: 'li',
        text: v.toLocaleUpperCase(),
        className: cls.key,
      });
    });
    this.#element.append(...children);
  }

  get keys() {
    return this.#element.children;
  }

  get ref() {
    return this.#element.ref;
  }

  set onHit(handler) {
    this.#onHit = isFunc(handler) ? handler : null;
  }
}
