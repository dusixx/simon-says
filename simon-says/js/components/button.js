import { Element, isFunc } from '../utils/index.js';

export class Button {
  #element;
  #onClick;

  constructor({ text = '', className = '', ...rest } = {}) {
    this.#element = new Element({
      tag: 'button',
      type: 'button',
      className,
      text,
      ...rest,
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

  hide() {
    this.#element.ref.style.display = 'none';
  }

  show() {
    this.#element.ref.style.display = '';
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
