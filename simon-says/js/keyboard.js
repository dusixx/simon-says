import { isFunc, isInt, isIterable, isStr } from './helpers.js';
import { Element } from './element.js';

const MIN_HIGHLIGHT_TIO = 300;
const MAX_HIGHLIGHT_TIO = 500;
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

  #isValidKey = (key) => {
    return key.length === 1 && !/\s/.test(key);
  };

  #isActiveKey = (key) => {
    return key === this.#activeKey;
  };

  #handleKeydown = (e) => {
    if (this.#activeKey || e.repeat || !this.#isValidKey(e.key)) {
      return;
    }
    const key = this.findKey(e.code.slice(-1));
    if (!key) {
      return;
    }
    this.#activeKey = key;
    key.toggleClass(cls.keyActive);
  };

  #handleKeyup = (e) => {
    if (!this.#isValidKey(e.key)) {
      return;
    }
    const key = this.findKey(e.code.slice(-1));
    if (!key || !this.#isActiveKey(key)) {
      return;
    }
    this.#activeKey = null;
    key.toggleClass(cls.keyActive);
  };

  #handleMousedown = (e) => {
    if (!e.target.classList.contains(cls.key)) {
      return;
    }
    if (this.#activeKey) {
      return;
    }
  };

  #addInteractivity = () => {
    document.addEventListener('keydown', this.#handleKeydown);
    document.addEventListener('keyup', this.#handleKeyup);
    this.#element.ref.addEventListener('mousedown', this.#handleMousedown);
  };

  findKey(text) {
    return isStr(text) && text.length === 1
      ? this.keys.find((key) => key.text === text.toLocaleUpperCase())
      : null;
  }

  append(keys) {
    if (!isIterable(keys)) {
      console.debug('"keys" iterable expected');
      return;
    }
    const children = [...keys].map((v) => {
      const el = new Element({
        tag: 'li',
        text: v.toLocaleUpperCase(),
        className: cls.key,
      });

      return el;
    });
    this.#element.append(...children);
  }

  get keys() {
    return this.#element.children;
  }

  get ref() {
    return this.#element.ref;
  }

  get highlightTimeout() {
    return this.#highlightTimeout;
  }

  set highlightTimeout(v) {
    if (isInt(v) && v <= MAX_HIGHLIGHT_TIO && v >= MIN_HIGHLIGHT_TIO) {
      this.#highlightTimeout = v;
    }
  }

  set onHit(handler) {
    this.#onHit = isFunc(handler) ? handler : null;
  }
}
