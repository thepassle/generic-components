/**
 * https://lion-web-components.netlify.app/?path=/story/buttons-switch--checked
 */
import { randomId } from '../utils/randomId.js';

const random = randomId();

const KEYCODE = {
  SPACE: 32,
  ENTER: 13,
};

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
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

    #button-${random}:focus .thumb {
      box-shadow: 0 0 0 2px skyblue;
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
    this.checked = false;
  }

  static get observedAttributes() {
    return ['disabled', 'checked'];
  }

  /**
   * TODO:
   * attr/prop reflection
   */
  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.button = this.shadowRoot.getElementById(`button-${random}`);

    this.button.addEventListener('click', this.__onClick.bind(this));
    this.button.addEventListener('keydown', this.__onKeyDown.bind(this));

    this.button.setAttribute('aria-labelledby', `label-${random}`);
    this.button.setAttribute('aria-describedby', `label-${random}`);
    this.button.setAttribute('role', 'switch');

    this.__handleDisabled();
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
    this.checked = !this.checked;
    this.__update();
  }

  // eslint-disable-next-line
  __onKeyDown(event) {
    switch (event.keyCode) {
      case KEYCODE.SPACE:
      case KEYCODE.ENTER:
        this.checked = !this.checked;
        break;
      default:
        break;
    }
    this.__update();
  }

  __update() {
    if (this.checked && !this.hasAttribute('disabled')) {
      this.setAttribute('checked', '');
      this.button.setAttribute('aria-checked', 'true');
      this.button.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
      this.button.setAttribute('aria-checked', 'false');
      this.button.removeAttribute('checked');
    }

    this.dispatchEvent(new Event('checked-changed'));
  }

  // eslint-disable-next-line
  attributeChangedCallback(name, newVal, oldVal) {
    // eslint-disable-next-line
    switch (name) {
      case 'disabled':
        break;
      case 'checked':
        break;
    }
  }
}
