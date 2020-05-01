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
    this.__initDone = false;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if (this.hasAttribute('active-item')) {
      this.__index = Number(this.getAttribute('active-item'));
    } else {
      this.__index = 0;
    }

    this.addEventListener('keydown', this.__onKeyDown.bind(this));
    this.addEventListener('click', this.__onClick.bind(this));
    this.addEventListener('focusin', this.__onFocus.bind(this));
    this.__buttons = [...this.querySelectorAll('button')];
    this.__regions = [...this.querySelectorAll('[role="region"]')];

    this.setAttribute('active-item', this.__index);
  }

  static get observedAttributes() {
    return ['active-item'];
  }

  attributeChangedCallback(name, newVal, oldVal) {
    if (name === 'active-item') {
      if (newVal !== oldVal) {
        this.__index = Number(this.getAttribute('active-item'));
        this.__updateActive();
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
    this.setAttribute('active-item', this.__index);
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

  __updateActive() {
    const buttons = this.__getButtons();
    const regions = this.__getRegions();

    if (!buttons || !regions) return;
    buttons.forEach((el, i) => {
      if (i === this.__index) {
        if (this.__initDone) {
          el.focus();
        }
        this.setAttribute('active-item', this.__index);
        buttons[i].setAttribute('active', '');
        buttons[i].setAttribute('aria-expanded', 'true');
        buttons[i].setAttribute('aria-disabled', 'true');
        regions[i].hidden = false;
        this.value = buttons[i].textContent.trim();
      } else {
        buttons[i].setAttribute('aria-expanded', 'false');
        buttons[i].removeAttribute('aria-disabled');
        buttons[i].removeAttribute('active');
        regions[i].hidden = true;
      }

      if (!buttons[i].id.startsWith('generic-accordion-')) {
        buttons[i].id = `generic-accordion-${i}`;
        regions[i].setAttribute('aria-labelledby', `generic-accordion-${i}`);
      }
    });

    const { __index } = this;
    this.dispatchEvent(
      new CustomEvent('active-changed', {
        detail: __index,
      }),
    );

    this.__initDone = true;
  }

  __getButtons() {
    return [...this.querySelectorAll('button')];
  }

  __getRegions() {
    return [...this.querySelectorAll('[role="region"]')];
  }
}
