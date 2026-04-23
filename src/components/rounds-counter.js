import { ClassName, isInt, ROUNDS_COUNT } from '@/common';
import { Element } from '@/components';

export class RoundsCounter {
  #element;
  #curRound;
  #max;
  #value;

  constructor({ start = 1, max = ROUNDS_COUNT } = {}) {
    if (!isInt(start) || !isInt(max) || start > max) {
      throw TypeError('integers expected (start <= max)');
    }
    const curRound = new Element({
      tag: 'span',
      text: start,
    });
    this.#element = new Element(
      { className: ClassName.RoundsCounter },
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
