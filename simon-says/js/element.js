export class Element {
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
    this.#children = [...this.#children, ...children];
    this.#ref.append(...children.map((v) => v.ref));
  }

  setAttribute(map) {
    Object.entries(map).forEach(([name, value]) => {
      this.#ref.setAttribute(name, value);
    });
  }

  addListener(event, listener, options = false) {
    this.#ref.addEventListener(event, listener, options);
  }

  removeListener(event, listener, options = false) {
    this.#ref.removeEventListener(event, listener, options);
  }

  toggleClass(name) {
    this.#ref.classList.toggle(name);
  }

  remove() {
    this.#ref.remove();
  }

  removeChildren() {
    this.#children.forEach((el) => el.remove());
    this.#children.length = 0;
  }

  set text(v) {
    this.#ref.textContent = v;
  }

  get text() {
    return this.#ref.textContent;
  }

  get children() {
    return [...this.#children];
  }

  get ref() {
    return this.#ref;
  }
}
