import { isFunc } from '../utils/index.js';
import { Element } from './element.js';

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

export class UserInput {
  #element;

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

  #showMessage = (msg, css) => {
    if (!msg) {
      return;
    }
    const { style } = this.#element.ref;
    this.value = msg;
    style.cssText = css;
  };

  success(msg) {
    this.#showMessage(msg, SUCCESS_CSS);
  }

  error(msg) {
    this.#showMessage(msg, ERROR_CSS);
  }

  hide() {
    this.#element.ref.style.display = 'none';
  }

  show() {
    this.#element.ref.style.display = '';
  }

  set visible(v) {
    const { style } = this.#element.ref;
    style.visibility = v ? 'visible' : 'hidden';
    style.pointerEvents = v ? '' : 'none';
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
