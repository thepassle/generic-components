/**
 * generic-tab should have a label attribute
 *
 * Tabs should be buttons
 * Tabs should have slot tab
 *
 * Panels should have slot panel
 */

const KEYCODE = {
  LEFT: 37,
  RIGHT: 39,
  HOME: 36,
  END: 35,
};

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    div[role="tablist"] {
      display: flex;
    }
  </style>

  <div role="tablist">
    <slot name="tab"></slot>
  </div>

  <div>
    <slot name="panel"></slot>
  </div>
`;

export class GenericTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.index = 0;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListener('keydown', this._onKeyDown.bind(this));

    this.tablist = this.shadowRoot.querySelector('div[role="tablist"]');

    this.tablist.setAttribute('aria-label', this.getAttribute('label') || 'tablist');
    this.tablist.addEventListener('click', this._onTabClicked.bind(this));

    this._updateActive(false);
  }

  _onKeyDown(event) {
    const tabs = this._getTabs();

    switch (event.keyCode) {
      case KEYCODE.LEFT:
        if (this.index - 1 < 0) {
          this.index = tabs.length - 1;
        } else {
          this.index = this.index - 1;
        }
        break;

      case KEYCODE.RIGHT:
        if (this.index + 1 >= tabs.length) {
          this.index = 0;
        } else {
          this.index = this.index + 1;
        }
        break;

      case KEYCODE.HOME:
        this.index = 0;
        break;

      case KEYCODE.END:
        this.index = tabs.length - 1;
        break;
      default:
        return;
    }
    this._updateActive(true);
  }

  _updateActive(focus) {
    const tabs = this._getTabs();
    const panels = this._getPanels();

    tabs.forEach((_, i) => {
      if (i === this.index) {
        if (focus) {
          tabs[i].focus();
        }
        tabs[i].setAttribute('active', '');
        tabs[i].setAttribute('aria-selected', 'true');
        tabs[i].removeAttribute('tabindex');
        panels[i].removeAttribute('hidden');
      } else {
        tabs[i].removeAttribute('active');
        tabs[i].setAttribute('aria-selected', 'false');
        tabs[i].setAttribute('tabindex', '-1');
        panels[i].setAttribute('hidden', '');
      }

      tabs[i].setAttribute('role', 'tab');
      panels[i].setAttribute('role', 'tabpanel');

      tabs[i].id = `generic-tab-${i}`;
      tabs[i].setAttribute('aria-controls', `generic-tab-${i}`);
      panels[i].setAttribute('aria-labelledby', `generic-tab-${i}`);
    });
  }

  _onTabClicked(e) {
    if (e.target.getAttribute('role') !== 'tab') return;
    this.index = this._getTabs().indexOf(e.target);
    this._updateActive(false);
  }

  _getTabs() {
    return [...this.querySelectorAll('[slot="tab"]')];
  }

  _getPanels() {
    return [...this.querySelectorAll('[slot="panel"]')];
  }
}
