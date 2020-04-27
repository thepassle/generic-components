/**
 * Todo:
 * css parts
 *
 * DOCS:
 * generic-tab should have a label attribute
 *
 * Tabs should be buttons
 * Tabs should have slot tab
 *
 * Panels should have slot panel
 */

import { KEYCODES } from '../utils/keycodes.js';

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

  <div part="tablist" role="tablist">
    <slot name="tab"></slot>
  </div>

  <div part="panel">
    <slot name="panel"></slot>
  </div>
`;

export class GenericTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if (this.hasAttribute('active-item')) {
      this._activeItem = Number(this.getAttribute('active-item'));
    } else {
      this._activeItem = 0;
    }

    this.addEventListener('keydown', this._onKeyDown.bind(this));

    this.tablist = this.shadowRoot.querySelector('div[role="tablist"]');

    this.tablist.setAttribute('aria-label', this.getAttribute('label') || 'tablist');
    this.tablist.addEventListener('click', this._onTabClicked.bind(this));

    this._updateActive(false);
  }

  static get observedAttributes() {
    return ['active-item'];
  }

  // eslint-disable-next-line
  attributeChangedCallback(name, newVal, oldVal) {
    if (name === 'active-item') {
      if (newVal !== oldVal) {
        this._activeItem = Number(this.getAttribute('active-item'));
        this._updateActive(true);
      }
    }
  }

  get activeItem() {
    return this._activeItem;
  }

  set activeItem(val) {
    this._activeItem = val;
    this.setAttribute('active-item', this._activeItem);
  }

  _onKeyDown(event) {
    const tabs = this._getTabs();

    switch (event.keyCode) {
      case KEYCODES.LEFT:
        if (this._activeItem === 0) {
          this._activeItem = tabs.length - 1;
        } else {
          this._activeItem--; // eslint-disable-line
        }
        break;

      case KEYCODES.RIGHT:
        if (this._activeItem === tabs.length - 1) {
          this._activeItem = 0;
        } else {
          this._activeItem++; // eslint-disable-line
        }
        break;

      case KEYCODES.HOME:
        this._activeItem = 0;
        break;

      case KEYCODES.END:
        this._activeItem = tabs.length - 1;
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
      if (i === this._activeItem) {
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

    this.setAttribute('active-item', this._activeItem);

    const { _activeItem } = this;
    this.dispatchEvent(
      new CustomEvent('active-changed', {
        detail: _activeItem,
      }),
    );
  }

  _onTabClicked(e) {
    if (e.target.getAttribute('role') !== 'tab') return;
    this._activeItem = this._getTabs().indexOf(e.target);
    this._updateActive(false);
  }

  _getTabs() {
    return [...this.querySelectorAll('[slot="tab"]')];
  }

  _getPanels() {
    return [...this.querySelectorAll('[slot="panel"]')];
  }

  setActive(index) {
    this._activeItem = index;
    this._updateActive(true);
  }
}
