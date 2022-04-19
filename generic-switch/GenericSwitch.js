import { KEYCODES } from '../utils/keycodes.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      align-items: center;
    }

    :host([checked]) .thumb {
      right: 0px;
    }

    :host([disabled]) {
      opacity: 50%;
    }

    .button {
      display: inline-block;
      position: relative;
      height: 16px;
      width: 36px;
    }

    .track {
      height: 100%;
      background-color: lightgrey;
    }

    .thumb {
      right: 18px;
      transition: right .1s;
      top: 0;
      position: absolute;
      width: 50%;
      height: 100%;
      background-color: grey;
    }

    div[part="button"]:focus-visible,
    div[part="button"]:focus:not(:focus-visible) {
      outline: none;
    }

    div[part="button"]:focus .thumb {
      box-shadow: var(--generic-switch-focus, 0 0 0 2px #145dce);
    }

    div[part="button"]:focus:not(:focus-visible) .thumb {
      box-shadow: none;
    }

    label[part="label"] {
      user-select: none;
    }

  </style>
  <label part="label"><slot></slot></label>
  <div part="button" class="button">
    <div part="track" class="track"></div>
    <div part="thumb" class="thumb"></div>
  </div>
`;

let __count = 0;

/**
 * @element generic-switch
 *
 * @cssprop --generic-switch-focus - Customizes the focus styles of the thumb
 *
 * @csspart label
 * @csspart thumb
 * @csspart track
 * @csspart button
 *
 * @attr {boolean} disabled
 */
export class GenericSwitch extends HTMLElement {
  static is = 'generic-switch';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.__onClick = this.__onClick.bind(this);
    this.__onKeyDown = this.__onKeyDown.bind(this);
  }

  static get observedAttributes() {
    return ['disabled', 'checked', 'label'];
  }

  connectedCallback() {
    this.__label = this.shadowRoot.querySelector('[part="label"]');
    this.__button = this.shadowRoot.querySelector('[part="button"]');
    this.__track = this.shadowRoot.querySelector('[part="track"]');
    this.__thumb = this.shadowRoot.querySelector('[part="thumb"]');

    this.__label.id = `label-${__count}`;
    this.__button.id = `button-${__count}`;
    this.__track.id = `track-${__count}`;
    this.__thumb.id = `thumb-${__count}`;

    this.addEventListener('click', this.__onClick);
    this.addEventListener('keydown', this.__onKeyDown);
    this.__button.setAttribute('role', 'switch');

    if (!this.hasAttribute('label')) {
      this.__button.setAttribute('aria-labelledby', `label-${__count}`);
      this.__button.setAttribute('aria-describedby', `label-${__count}`);
      this.__label.style.marginRight = '10px';
    } else {
      this.__button.setAttribute('aria-label', this.getAttribute('label'));
    }

    this.__checked = this.hasAttribute('checked') || false;

    this.__update(false);
    this.__handleDisabled();
    __count++; // eslint-disable-line
  }

  disconnectedCallback() {
    this.__button.removeEventListener('click', this.__onClick);
    this.__button.removeEventListener('keydown', this.__onKeyDown);
  }

  __handleDisabled() {
    if (this.hasAttribute('disabled')) {
      this.setAttribute('disabled', '');
      this.__button.setAttribute('aria-disabled', 'true');
      this.__button.removeAttribute('tabindex');
    } else {
      this.removeAttribute('disabled');
      this.__button.removeAttribute('aria-disabled');
      this.__button.setAttribute('tabindex', '0');
    }
  }

  __onClick() {
    if (!this.hasAttribute('disabled')) {
      if (this.hasAttribute('checked')) {
        this.removeAttribute('checked');
      } else {
        this.setAttribute('checked', '');
      }
    }
  }

  __onKeyDown(event) {
    switch (event.keyCode) {
      case KEYCODES.SPACE:
      case KEYCODES.ENTER:
        event.preventDefault();
        if (this.hasAttribute('checked')) {
          this.removeAttribute('checked');
        } else {
          this.setAttribute('checked', '');
        }
        break;
      default:
        break;
    }
  }

  __update(dispatch) {
    if (this.__checked && !this.hasAttribute('disabled')) {
      this.__button.setAttribute('aria-checked', 'true');
      this.__button.setAttribute('checked', '');
    } else {
      this.__button.setAttribute('aria-checked', 'false');
      this.__button.removeAttribute('checked');
    }

    if (dispatch) {
      const { __checked } = this;
      this.dispatchEvent(new CustomEvent('checked-changed', { detail: __checked }));
    }
  }

  /**
   * @attr
   * @type {boolean}
   */
  set checked(val) {
    if (val) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get checked() {
    return this.__checked;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.__button) return;
    if (newVal !== oldVal) {
      switch (name) {
        case 'disabled':
          this.__disabled = !this.__disabled;
          this.__handleDisabled();
          break;
        case 'checked':
          this.__checked = !this.__checked;
          this.__update(true);
          break;
        case 'label':
          this.__button.setAttribute('aria-label', newVal);
          break;
        default:
          break;
      }
    }
  }
}
