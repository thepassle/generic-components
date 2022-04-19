import { BatchingElement } from '../utils/BatchingElement.js';
import { SelectedMixin } from '../utils/SelectedMixin.js';

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

export class GenericAccordion extends SelectedMixin(BatchingElement) {
  static is = 'generic-accordion';

  static get config() {
    return {
      selectors: {
        buttons: {
          selector: el => el.querySelectorAll('button'),
          focusTarget: true,
        },
        regions: {
          selector: el => el.querySelectorAll('generic-accordion > *:not(button)'),
        },
      },
      multiDirectional: false,
      orientation: 'vertical',
      shouldFocus: true,
      activateOnKeydown: false,
      disabled: false,
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  update() {
    const { buttons, regions } = this.getElements();

    buttons.forEach((_, i) => {
      if (i === this.selected) {
        this.requestUpdate(true);
        buttons[i].setAttribute('selected', '');
        buttons[i].setAttribute('aria-expanded', 'true');
        buttons[i].setAttribute('aria-disabled', 'true');
        regions[i].hidden = false;
        this.value = buttons[i].textContent.trim();
      } else {
        buttons[i].setAttribute('aria-expanded', 'false');
        buttons[i].removeAttribute('aria-disabled');
        buttons[i].removeAttribute('selected');
        regions[i].hidden = true;
      }

      if (!buttons[i].id.startsWith('generic-accordion-')) {
        buttons[i].id = `generic-accordion-${this.__uuid}-${i}`;
        regions[i].setAttribute('aria-labelledby', `generic-accordion-${this.__uuid}-${i}`);
        regions[i].setAttribute('role', 'region');
      }
    });
  }
}
