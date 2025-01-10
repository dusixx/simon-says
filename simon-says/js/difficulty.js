import { Element } from './element.js';
import { isFunc } from './helpers.js';

const DEF_VALUES = ['easy', 'medium', 'hard'];

export class Difficulty {
  #element;
  #onChange;

  constructor(values = DEF_VALUES) {
    if (!Array.isArray(values)) {
      return;
    }
    const el = new Element(
      { tag: 'select', className: 'difficulty' },
      ...values.map(
        (value) => new Element({ tag: 'option', value, text: value })
      )
    );
    this.#element = el;
  }

  set onChange(handler) {
    this.#onChange = isFunc(handler) ? (e) => handler(e.target.value, e) : null;
    if (this.#onChange) {
      this.#element.addListener('change', this.#onChange);
    } else {
      this.#element.removeListener('change', this.#onChange);
    }
  }

  get ref() {
    return this.#element.ref;
  }

  get underlyingElement() {
    return this.#element;
  }

  get disabled() {
    return this.#element.ref.disabled;
  }

  set disabled(v) {
    this.#element.ref.disabled = Boolean(v);
  }

  get value() {
    return this.ref.value;
  }

  set value(v) {
    this.ref.value = v;
  }
}
