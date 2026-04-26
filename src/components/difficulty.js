import { ClassName, DIFFICULTY_VALUES, isFunc } from '@/common';
import { Element } from '@/components';

export class Difficulty {
  #element;
  #onChange;

  constructor(values = DIFFICULTY_VALUES) {
    if (!Array.isArray(values)) {
      throw TypeError('"values" array expected');
    }
    this.#element = new Element(
      {
        tag: 'select',
        className: ClassName.Difficulty,
        id: ClassName.Difficulty,
      },
      ...values.map(
        (value) => new Element({ tag: 'option', value, text: value })
      )
    );
    this.#addInteractivity();
  }

  hide() {
    this.#element.ref.style.display = 'none';
  }

  show() {
    this.#element.ref.style.display = '';
  }

  #addInteractivity = () => {
    this.#element.addListener('change', (e) =>
      this.#onChange?.(e.target.value, e)
    );
  };

  set onChange(handler) {
    this.#onChange = isFunc(handler) ? handler : null;
  }

  get onChange() {
    return this.#onChange;
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
