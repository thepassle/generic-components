import { KEYCODES } from '../utils/keycodes.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ::slotted(button) {
      display: block;
      width: 100%;
    }

    :host {
      display: block;
    }
  </style>
  <slot>
  </slot>
`;

export class GenericAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.__index = 0;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListener('keydown', this.__onKeyDown.bind(this));
    this.addEventListener('click', this.__onClick.bind(this));
    this.addEventListener('focusin', this.__onFocus.bind(this));
    this.__buttons = [...this.querySelectorAll('button')];
    this.__regions = [...this.querySelectorAll('[role="region"]')];

    this.__updateActive(false);
  }

  static get observedAttributes() {
    return ['active-item'];
  }

  attributeChangedCallback(name, newVal, oldVal) {
    if (name === 'active-item') {
      if (newVal !== oldVal) {
        this.__index = Number(this.getAttribute('active-item'));
        if (!this.__buttons) return;
        this.__updateActive(true);
      }
    }
  }

  __onFocus(event) {
    if (!event.target.id.startsWith('generic-accordion-')) return;
    this.__index = this.__buttons.indexOf(event.target);
  }

  __onClick(event) {
    if (!event.target.id.startsWith('generic-accordion-')) return;
    this.__index = this.__buttons.indexOf(event.target);
    this.__updateActive(false);
  }

  __onKeyDown(event) {
    if (!event.target.id.startsWith('generic-accordion-')) return;
    switch (event.keyCode) {
      case KEYCODES.UP:
        if (this.__index === 0) {
          this.__index = this.__buttons.length - 1;
        } else {
          this.__index--; // eslint-disable-line
        }
        event.preventDefault();
        break;
      case KEYCODES.DOWN:
        if (this.__index === this.__buttons.length - 1) {
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
        this.__index = this.__buttons.length - 1;
        break;
      default:
        return;
    }

    this.__moveFocus();
  }

  __moveFocus() {
    this.__buttons[this.__index].focus();
  }

  __updateActive(focus) {
    if (!this.__buttons || !this.__regions) return;

    this.__buttons.forEach((el, i) => {
      if (i === this.__index) {
        if (focus) {
          el.focus();
        }
        this.__buttons[i].setAttribute('active', '');
        this.__buttons[i].setAttribute('aria-expanded', 'true');
        this.__buttons[i].setAttribute('aria-disabled', 'true');
        this.__regions[i].hidden = false;
      } else {
        this.__buttons[i].setAttribute('aria-expanded', 'false');
        this.__buttons[i].removeAttribute('aria-disabled');
        this.__buttons[i].removeAttribute('active');
        this.__regions[i].hidden = true;
      }

      if (!this.__buttons[i].id.startsWith('generic-accordion-')) {
        this.__buttons[i].id = `generic-accordion-${i}`;
        this.__regions[i].setAttribute('aria-labelledby', `generic-accordion-${i}`);
      }
    });
  }
}
