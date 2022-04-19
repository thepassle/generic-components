import { BatchingElement } from '../utils/BatchingElement.js';
import { SelectedMixin } from '../utils/SelectedMixin.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    :host([vertical]) {
      display: flex;
    }

    :host([vertical]) div[role="tablist"] {
      flex-direction: column;
    }

    div[role="tablist"] {
      display: flex;
      gap: 0.5rem;
    }
  </style>
  
  <slot></slot>

  <div part="tablist" role="tablist">
    <slot name="tab"></slot>
  </div>

  <div part="panel">
    <slot name="panel"></slot>
  </div>
`;

/**
 * @attr label
 * @attr {boolean} vertical
 */
export class GenericTabs extends SelectedMixin(BatchingElement) {
  static is = 'generic-tabs';

  static get config() {
    return {
      selectors: {
        tabs: {
          selector: el =>
            Array.from(el.children).filter(node =>
              node.matches('h1, h2, h3, h4, h5, h6, [slot="tab"]'),
            ),
          focusTarget: true,
        },
        panels: {
          selector: el =>
            Array.from(el.children).filter(
              node =>
                node.matches('h1 ~ *, h2 ~ *, h3 ~ *, h4 ~ *, h5 ~ *, h6 ~ *, [slot="panel"]') &&
                !node.matches('h1, h2, h3, h4, h5, h6, [slot="tab"]'),
            ),
        },
      },
      multiDirectional: true,
      orientation: 'horizontal',
      shouldFocus: true,
      activateOnKeydown: true,
      disabled: false,
    };
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'vertical'];
  }

  attributeChangedCallback(name, old, val) {
    super.attributeChangedCallback(name, old, val);
    if (name === 'vertical') {
      this.requestUpdate(false);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector('[role="tablist"]')
      .setAttribute('aria-label', this.getAttribute('label') || 'tablist');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  update() {
    const { tabs, panels } = this.getElements();
    tabs.forEach((_, i) => {
      tabs[i].slot = 'tab';
      if (i === this.selected) {
        tabs[i].setAttribute('selected', '');
        tabs[i].setAttribute('aria-selected', 'true');
        tabs[i].setAttribute('tabindex', '0');
        panels[i].removeAttribute('hidden');
        this.value = tabs[i].textContent.trim();
      } else {
        tabs[i].removeAttribute('selected');
        tabs[i].setAttribute('aria-selected', 'false');
        tabs[i].setAttribute('tabindex', '-1');
        panels[i].setAttribute('hidden', '');
      }

      if (!tabs[i].id.startsWith('generic-tab-')) {
        tabs[i].setAttribute('role', 'tab');
        panels[i].setAttribute('role', 'tabpanel');

        tabs[i].id = `generic-tab-${this.__uuid}-${i}`;
        tabs[i].setAttribute('aria-controls', `generic-tab-${this.__uuid}-${i}`);
        panels[i].setAttribute('aria-labelledby', `generic-tab-${this.__uuid}-${i}`);
      }
    });
    panels.forEach((_, i) => {
      panels[i].slot = 'panel';
    });
  }
}
