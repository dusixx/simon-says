import { Element } from './element.js';
import { isInt } from './helpers.js';

export class RoundsCounter {
  #element;
  #curRound;
  #max;
  #onMaxReaching;

  constructor({ min = 1, max = 5 } = {}) {
    if (!isInt(min) || !isInt(max) || min > max) {
      throw TypeError('integers expected (min <= max)');
    }
    const curRound = new Element({
      tag: 'span',
      text: min,
    });
    this.#element = new Element(
      { className: 'rounds-counter' },
      curRound,
      new Element({
        tag: 'span',
        text: max,
      })
    );
    curRound.ref.before('Round: ');
    curRound.ref.after('/');

    this.#curRound = curRound;
    this.#max = max;
  }

  set onMaxReaching(handler) {
    this.#onMaxReaching = isFunc(handler) ? handler : null;
  }

  get value() {
    return this.#curRound.ref.text;
  }

  set value(v) {
    if (!isInt(v) || v > this.#max) {
      return;
    }
    if (v === this.#max) {
      this.#onMaxReaching?.();
    }
    this.#curRound.ref.text = v;
  }

  get ref() {
    return this.#element.ref;
  }

  get underlyingElement() {
    return this.#element;
  }
}
