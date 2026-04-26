import { Element } from '@/components';
import { ERROR_CSS, SUCCESS_CSS } from './status-box.constants.js';

export class StatusBox {
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

  get visible() {
    const { style } = this.#element.ref;
    return style.visibility === 'visible';
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
