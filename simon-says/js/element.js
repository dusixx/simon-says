export class Element {
  #ref;
  #children = [];

  constructor(props, ...children) {
    const { tag = 'div', className, text, ...rest } = props ?? '';

    const ref = document.createElement(tag);

    if (className) {
      ref.className = className;
    }
    ref.textContent = text;
    this.#ref = ref;
    this.append(...children);
    this.setAttribute(rest);
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

  removeAttribute(name) {
    this.#ref.removeAttribute(name);
  }

  addListener(event, listener, options = false) {
    this.#ref.addEventListener(event, listener, options);
  }

  removeListener(event, listener, options = false) {
    this.#ref.removeEventListener(event, listener, options);
  }

  toggleClass(name, force) {
    return this.#ref.classList.toggle(name, force);
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
