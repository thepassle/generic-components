import { KEYCODES } from '../utils/keycodes.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>

  </style>
  <slot name="label">Default label</slot>
  <slot name="listbox">
  </slot>
`;

export class GenericListbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.__index = 0;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.__ul = this.querySelector('[slot="listbox"]');
    this.__li = [...this.querySelectorAll('[slot="listbox"] li')];
    this.__label = this.querySelector('[slot="label"]');

    this.__ul.setAttribute('tabindex', '0');
    this.__ul.setAttribute('role', 'listbox');
    this.__ul.setAttribute('aria-labelledby', 'generic-listbox-label');
    this.__label.id = 'generic-listbox-label';

    this.addEventListener('keydown', this.__onKeyDown.bind(this));
    this.addEventListener('click', this.__onClick.bind(this));

    this.__updateActive();
  }

  static get observedAttributes() {
    return ['active-item'];
  }

  attributeChangedCallback(name, newVal, oldVal) {
    if (name === 'active-item') {
      if (newVal !== oldVal) {
        this.__index = Number(this.getAttribute('active-item'));
        if (!this.__ul || !this.__li) return;
        this.__updateActive();
      }
    }
  }

  __onClick(event) {
    if (!event.target.localName.includes('li')) return;
    this.__index = this.__li.indexOf(event.target);
    this.__updateActive();
  }

  __onKeyDown(event) {
    if (!event.target.localName.includes('ul')) return;
    switch (event.keyCode) {
      case KEYCODES.UP:
        if (this.__index === 0) {
          this.__index = this.__li.length - 1;
        } else {
          this.__index--; // eslint-disable-line
        }
        event.preventDefault();
        break;
      case KEYCODES.DOWN:
        if (this.__index === this.__li.length - 1) {
          this.__index = 0;
        } else {
          this.__index++; // eslint-disable-line
        }
        event.preventDefault();
        break;

      case KEYCODES.HOME:
        this.__index = 0;
        break;

      case KEYCODES.END:
        this.__index = this.__li.length - 1;
        break;
      default:
        return;
    }

    this.__updateActive();
  }

  __updateActive() {
    if (!this.__ul || !this.__li) return;
    this.__li.forEach((el, i) => {
      this.__li[i].id = `generic-listbox-${i}`;
      this.__li[i].setAttribute('role', 'option');

      if (i === this.__index) {
        this.__li[i].setAttribute('aria-selected', 'true');
        this.__li[i].setAttribute('active', '');
        this.__ul.setAttribute('aria-activedescendant', this.__li[i].id);
        this.__scrollIntoView(this.__li[i]);
      } else {
        this.__li[i].removeAttribute('aria-selected');
        this.__li[i].removeAttribute('active');
      }
    });
  }

  __scrollIntoView(li) {
    const ul = this.__ul;

    if (ul.scrollHeight > ul.clientHeight) {
      const elOffsetBottom = li.offsetTop - ul.offsetTop + li.clientHeight;
      const elOffsetTop = li.offsetTop - ul.offsetTop;

      if (elOffsetTop < ul.scrollTop) {
        ul.scrollTop = elOffsetTop;
      }

      if (elOffsetBottom > ul.scrollTop + ul.clientHeight) {
        if (ul.clientHeight - elOffsetTop < 0) {
          ul.scrollTop = elOffsetBottom - ul.clientHeight;
        } else {
          ul.scrollTop = ul.clientHeight - elOffsetTop;
        }
      }
    }
  }
}
