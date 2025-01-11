import { Element } from './element.js';
import { isInt } from './helpers.js';

export class RoundsCounter {
  #element;
  #curRound;
  #max;
  #value;

  constructor({ start = 1, max = 5 } = {}) {
    if (!isInt(start) || !isInt(max) || start > max) {
      throw TypeError('integers expected (start <= max)');
    }
    const curRound = new Element({
      tag: 'span',
      text: start,
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

    this.#value = start;
    this.#curRound = curRound;
    this.#max = max;
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
    return this.#value;
  }

  set value(v) {
    if (!isInt(v) || v > this.#max) {
      return;
    }
    this.#value = v;
    this.#curRound.text = this.#value;
  }

  get max() {
    return this.#max;
  }

  get ref() {
    return this.#element.ref;
  }

  get underlyingElement() {
    return this.#element;
  }
}
