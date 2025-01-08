export class Elelement {
  #ref;
  #children = [];

  constructor({ tag = 'div', className = '', text = '' }, ...children) {
    const ref = document.createElement(tag);
    ref.className = className;
    ref.textContent = text;

    this.#ref = ref;
    this.append(...children);
  }

  append(...children) {
    this.#ref.append(...children);
  }

  setAttribute(map) {
    Object.entries(map).forEach(([name, value]) => {
      this.#ref.setAttribute(name, value);
    });
  }

  addListener(...args) {
    this.#ref.addEventListener(...args);
  }

  removeListener(...args) {
    this.#ref.removeEventListener(...args);
  }

  toggleClass(name) {
    this.#ref.classList.toggle(name);
  }

  remove() {
    this.#ref.remove();
  }

  set text(v) {
    this.#ref.textContent = v;
  }

  get text() {
    return this.#ref.textContent;
  }

  get ref() {
    return this.#ref;
  }
}
