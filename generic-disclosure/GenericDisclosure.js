import { randomId } from '../utils/randomId.js';

const random = randomId();

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      height: auto;
      border-bottom: lightgrey solid 1px;
    }

    .expanded {
      display: block;
      padding: 10px;
    }

    .closed {
      display: none;
    }

    button {
      text-align: left;
      width: 100%;
      display: flex;

      border: none;
      margin: 0;
      padding: 0;
      overflow: visible;
      background: transparent;
    }

    button:hover {
      background-color: #dedede;
    }
  </style>

  <button 
    part="toggle"
    class="toggle"
    id="toggle-${random}"
  >   
    <slot name="toggle"></slot>  
  </button>

  <div
    part="detail"
    class="detail closed"
    role="region"
    id="detail-${random}"
  >
    <slot name="detail"></slot>
  </div>
`;

export class GenericDisclosure extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._expanded = false;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.button = this.shadowRoot.getElementById(`toggle-${random}`);
    this.detail = this.shadowRoot.getElementById(`detail-${random}`);

    this.button.addEventListener('click', () => {
      if (this.hasAttribute('expanded')) {
        this.removeAttribute('expanded');
        this._expanded = false;
      } else {
        this.setAttribute('expanded', '');
        this._expanded = true;
      }
    });
  }

  static get observedAttributes() {
    return ['expanded'];
  }

  attributeChangedCallback(name, newVal, oldVal) {
    if (name === 'expanded') {
      if (newVal !== oldVal) {
        if (this.hasAttribute('expanded')) {
          this._expanded = true;
          this.__open();
        } else {
          this._expanded = false;
          this.__close();
        }
      }
    }
  }

  __open() {
    this.dispatchEvent(new Event('disclosure-opened'));
    this.button.setAttribute('aria-expanded', 'true');
    this.detail.classList.add('opened');
    this.detail.classList.remove('closed');
  }

  __close() {
    this.dispatchEvent(new Event('disclosure-closed'));
    this.button.removeAttribute('aria-expanded');
    this.detail.classList.add('closed');
    this.detail.classList.remove('opened');
  }

  get expanded() {
    return this._expanded;
  }

  set expanded(val) {
    if (val) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }
  }
}
