const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      height: auto;
      border-bottom: lightgrey solid 1px;
    }

    :host slot[name="detail"] {
      display: none;
    }

    :host([expanded]) slot[name="detail"] {
      display: block;
    }

    ::slotted(button) {
      text-align: left;
      width: 100%;
      display: flex;

      border: none;
      margin: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 0;
      padding-right: 0;
      overflow: visible;
      background: transparent;
      font-size: 16px;
    }

    ::slotted(button):hover {
      background-color: #dedede;
    }
  </style>

  <slot
    name="toggle"
    class="toggle"
  >
  </slot>

  <slot name="detail"></slot>
`;

export class GenericDisclosure extends HTMLElement {
  static is = 'generic-disclosure';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.__expanded = false;
  }

  connectedCallback() {
    this.__button = this.querySelector('button[slot="toggle"]');
    this.__detail = this.querySelector('[slot="detail"]');

    this.__button.addEventListener('click', () => {
      if (this.hasAttribute('expanded')) {
        this.removeAttribute('expanded');
        this.__expanded = false;
      } else {
        this.setAttribute('expanded', '');
        this.__expanded = true;
      }
    });

    if (this.hasAttribute('expanded')) {
      this.__open(false);
    }
  }

  static get observedAttributes() {
    return ['expanded'];
  }

  attributeChangedCallback(name, newVal, oldVal) {
    if (!this.__button) return;
    if (name === 'expanded') {
      if (newVal !== oldVal) {
        if (this.hasAttribute('expanded')) {
          this.__expanded = true;
          this.__open(true);
        } else {
          this.__expanded = false;
          this.__close(true);
        }
      }
    }
  }

  __open(dispatch) {
    if (dispatch) {
      this.dispatchEvent(
        new CustomEvent('opened-changed', {
          detail: true,
        }),
      );
    }
    this.__button.setAttribute('aria-expanded', 'true');
  }

  __close() {
    this.dispatchEvent(
      new CustomEvent('opened-changed', {
        detail: false,
      }),
    );
    this.__button.setAttribute('aria-expanded', 'false');
  }

  /**
   * @attr
   * @type {boolean}
   */
  get expanded() {
    return this.__expanded;
  }

  set expanded(val) {
    if (val) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }
  }
}
