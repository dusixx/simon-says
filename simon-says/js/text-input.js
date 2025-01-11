import { Element } from './element.js';
import { isFunc } from './helpers.js';

const SUCCESS_CSS = `
  color: rgb(136 183 99);
  background-color: rgb(230 243 220);
  border-color: rgb(197 219 180);
`;

const ERROR_CSS = `
  color: rgb(233 127 180);
  background-color: rgb(255 235 254);
  border-color: rgb(241 203 222);
`;

export class TextInput {
  #element;
  #onInput;

  constructor({ className = '', ...rest } = {}) {
    this.#element = new Element({
      tag: 'input',
      type: 'text',
      className,
      ...rest,
    });
  }

  clear() {
    this.#element.ref.style = '';
    this.value = '';
  }

  success(msg) {
    if (!msg) {
      return;
    }
    const { style } = this.#element.ref;
    this.value = msg;
    style.cssText = SUCCESS_CSS;
  }

  error(msg) {
    if (!msg) {
      return;
    }
    const { style } = this.#element.ref;
    this.value = msg;
    style.cssText = ERROR_CSS;
  }

  set onInput(handler) {
    this.#onInput = isFunc(handler) ? (e) => handler(e.target.value, e) : null;
    if (this.#onInput) {
      this.#element.addListener('input', this.#onInput);
    } else {
      this.#element.removeListener('input', this.#onInput);
    }
  }

  hide() {
    this.#element.ref.style.display = 'none';
  }

  show() {
    this.#element.ref.style.display = '';
  }

  set visibile(v) {
    const { style } = this.#element.ref;
    if (v) {
      style.visibility = 'visible';
      style.pointerEvents = '';
      style.opacity = '';
    } else {
      style.visibility = 'hidden';
      style.pointerEvents = 'none';
      style.opacity = '0';
    }
  }

  get value() {
    return this.#element.ref.value;
  }

  set value(v) {
    this.#element.ref.value = `${v}`;
  }

  get ref() {
    return this.#element.ref;
  }

  get underlyingElement() {
    return this.#element;
  }
}
