import { randomId } from '../utils/randomId.js';
import { KEYCODES } from '../utils/keycodes.js';

const random = randomId();

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      align-items: center;
      height: 16px;
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
      height: 100%;
      width: 36px;
    }

    .track {
      height: 100%;
      background-color: lightgrey;
    }

    .thumb {
      right: 20px;
      transition: right .1s;
      top: 0;
      position: absolute;
      width: 50%;
      height: 100%;
      background-color: grey;
    }

    div[part="button"]:focus .thumb {
      box-shadow: 0 0 0 2px var(--generic-switch-focus, skyblue);
    }

    #label-${random} {
      margin-right: 10px;
    }

  </style>
  <label part="label" id="label-${random}"><slot>Label</slot></label>
  <div part="button" id="button-${random}" class="button">
    <div part="track" id="track-${random}" class="track"></div>
    <div part="thumb" id="thumb-${random}" class="thumb"></div>
  </div>
`;

export class GenericSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['disabled', 'checked'];
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.button = this.shadowRoot.getElementById(`button-${random}`);
    this.thumb = this.shadowRoot.getElementById(`thumb-${random}`);
    this.track = this.shadowRoot.getElementById(`track-${random}`);
    this.button.addEventListener('click', this.__onClick.bind(this));
    this.button.addEventListener('keydown', this.__onKeyDown.bind(this));

    this.button.setAttribute('aria-labelledby', `label-${random}`);
    this.button.setAttribute('aria-describedby', `label-${random}`);
    this.button.setAttribute('role', 'switch');

    this.__checked = this.hasAttribute('checked') || false;

    this.__update();
    this.__handleDisabled();
    this.__domReady = true;
  }

  __handleDisabled() {
    if (this.hasAttribute('disabled')) {
      this.setAttribute('disabled', '');
      this.button.setAttribute('disabled', '');
      this.button.removeAttribute('tabindex');
    } else {
      this.removeAttribute('disabled');
      this.button.removeAttribute('disabled');
      this.button.setAttribute('tabindex', '0');
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

  __update() {
    if (this.__checked && !this.hasAttribute('disabled')) {
      this.button.setAttribute('aria-checked', 'true');
      this.button.setAttribute('checked', '');
    } else {
      this.button.setAttribute('aria-checked', 'false');
      this.button.removeAttribute('checked');
    }

    const { __checked } = this;
    this.dispatchEvent(new CustomEvent('checked-changed', { detail: __checked }));
  }

  attributeChangedCallback(name, newVal, oldVal) {
    if (!this.__domReady) return;
    if (newVal !== oldVal) {
      switch (name) {
        case 'disabled':
          this.__checked = !this.__checked;
          this.__handleDisabled();
          break;
        case 'checked':
          this.__checked = !this.__checked;
          this.__update();
          break;
        default:
          break;
      }
    }
  }
}
