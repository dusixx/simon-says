import { Element, isFunc, DEF_DIFFICULTY_VALUES } from '../utils/index.js';

export class Difficulty {
  #element;
  #onChange;

  constructor(values = DEF_DIFFICULTY_VALUES) {
    if (!Array.isArray(values)) {
      throw TypeError('"values" array expected');
    }
    const el = new Element(
      { tag: 'select', className: 'difficulty' },
      ...values.map(
        (value) => new Element({ tag: 'option', value, text: value })
      )
    );
    this.#element = el;
  }

  hide() {
    this.#element.ref.style.display = 'none';
  }

  show() {
    this.#element.ref.style.display = '';
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
