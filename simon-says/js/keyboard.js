import { isInt, isIterable, isStr } from './helpers.js';
import { Element } from './element.js';

const MIN_HIGHLIGHT_TIO = 300;
const MAX_HIGHLIGHT_TIO = 500;

const cls = {
  key: 'key',
  keyActive: 'key--active',
  keyboard: 'keyboard',
};

export class Keyboard {
  #element;
  #highlightTimeout = MIN_HIGHLIGHT_TIO;
  #hasActiveKey;

  constructor({ keys } = {}) {
    this.#element = new Element({ tag: 'ul', className: cls.keyboard });
    this.append(keys);
    this.#addInteractivity();
  }

  #handleKeydown = (e) => {
    if (e.repeat || this.#hasActiveKey || e.key.length > 1) {
      return;
    }
    const { code } = e;
    const key = this.findKey(code.slice(-1));

    if (key) {
      this.#hasActiveKey = true;
      key.toggleClass(cls.keyActive);

      setTimeout(() => {
        key.toggleClass(cls.keyActive);
        this.#hasActiveKey = false;
      }, this.highlightTimeout);
    }
  };

  #addInteractivity = () => {
    //document.addEventListener('keyup', () => (this.#hasActiveKey = false));
    document.addEventListener('keydown', this.#handleKeydown);
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
    const children = [...keys].map(
      (val) =>
        new Element({
          tag: 'li',
          text: val.toLocaleUpperCase(),
          className: cls.key,
        })
    );
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
}
