import { Element } from './element.js';
import { isFunc } from './helpers.js';

export class Button {
  #element;
  #onClick;
  #name;

  constructor({ text = '', className = '' } = {}) {
    this.#element = new Element({
      tag: 'button',
      type: 'button',
      className,
      text,
    });
  }

  set onClick(handler) {
    this.#onClick = isFunc(handler) ? handler : null;
    if (this.#onClick) {
      this.#element.addListener('click', this.#onClick);
    } else {
      this.#element.removeListener('click', this.#onClick);
    }
  }

  hide(f = true) {
    this.#element.ref.style.display = f ? 'none' : '';
  }

  get name() {
    return this.#name;
  }

  set name(v) {
    this.#name = `${v}`;
  }

  get text() {
    return this.#element.text;
  }

  set text(v) {
    this.#element.text = v;
  }

  get disabled() {
    return this.#element.ref.disabled;
  }

  set disabled(v) {
    this.#element.ref.disabled = Boolean(v);
  }

  get ref() {
    return this.#element.ref;
  }

  get underlyingElement() {
    return this.#element;
  }
}
