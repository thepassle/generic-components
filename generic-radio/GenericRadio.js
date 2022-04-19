import { BatchingElement } from '../utils/BatchingElement.js';
import { SelectedMixin } from '../utils/SelectedMixin.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    :host .group {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }

    :host([vertical]) .group {
      flex-direction: column;
    }

    :host ::slotted(*) {
      margin-right: 10px;
      margin-bottom: 0px;
      position: relative;

      border: 2px solid transparent;
      display: inline-block;
      padding: 0.125em;
      padding-left: 1.5em;
      padding-right: 0.5em;
      cursor: default;
      outline: none;
    }

    :host([vertical]) ::slotted(*) {
      margin-right: 0px;
      margin-bottom: 10px;
    }

    ::slotted(*)::before {
      content: '';
      width: 14px;
      height: 14px;
      border: 1px solid hsl(0, 0%, 66%);
      border-radius: 100%;
      background-image: linear-gradient(to bottom, hsl(300, 3%, 93%), #fff 60%);
    }

    ::slotted(*)::before,::slotted(*)::after {
      position: absolute;
      top: 50%;
      left: 7px;
      transform: translate(-20%, -50%);
      content: '';
    }

    ::slotted([aria-checked="true"])::before  {
      border-color: var(--generic-radio-border, hsl(216, 80%, 50%));
      background: var(--generic-radio-fill, hsl(217, 95%, 68%));
    }
    
    ::slotted([aria-checked="true"])::after  {
      display: block;
      border: 0.1875em solid #fff;
      border-radius: 100%;
      transform: translate(25%, -50%);
    }

    :host([disabled]) {
      filter: brightness(0.7);
    }
  </style>

  <div part="group" role="radiogroup" class="group">
    <slot></slot>
  </div>
`;

/**
 * @attr {boolean} vertical
 * @attr {boolean} disabled
 */
export class GenericRadio extends SelectedMixin(BatchingElement) {
  static is = 'generic-radio';

  static get config() {
    return {
      selectors: {
        radios: {
          selector: el => el.querySelectorAll('*'),
          focusTarget: true,
        },
      },
      multiDirectional: true,
      orientation: 'horizontal',
      shouldFocus: true,
      activateOnKeydown: true,
      disabled: true,
    };
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'vertical', 'disabled'];
  }

  attributeChangedCallback(name, old, val) {
    super.attributeChangedCallback(name, old, val);
    if (name === 'vertical' || name === 'disabled') {
      this.requestUpdate(false);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector('.group')
      .setAttribute('aria-label', this.getAttribute('label') || 'radiogroup');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  update() {
    const { radios } = this.getElements();
    if (this.selected === null) {
      this.selected = 0;
    }

    radios.forEach((_, i) => {
      if (i === this.selected && !this.hasAttribute('disabled')) {
        radios[i].setAttribute('selected', '');
        radios[i].setAttribute('aria-checked', 'true');
        radios[i].setAttribute('tabindex', '0');
        this.value = radios[i].textContent.trim();
      } else {
        radios[i].removeAttribute('selected');
        radios[i].setAttribute('aria-checked', 'false');
        radios[i].setAttribute('tabindex', '-1');
      }

      if (this.hasAttribute('disabled')) {
        radios[i].removeAttribute('tabindex');
        this.removeAttribute('selected');
        this.selected = null;
      }

      if (!radios[i].id.startsWith('generic-radio-')) {
        radios[i].setAttribute('role', 'radio');
        radios[i].id = `generic-radio-${this.__uuid}-${i}`;
      }
    });
  }
}
