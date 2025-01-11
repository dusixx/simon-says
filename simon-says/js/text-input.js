import { Element } from './element.js';
import { isFunc } from './helpers.js';

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

  set onInput(handler) {
    this.#onInput = isFunc(handler) ? (e) => handler(e.target.value, e) : null;
    if (this.#onInput) {
      this.#element.addListener('input', this.#onInput);
    } else {
      this.#element.removeListener('input', this.#onInput);
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
