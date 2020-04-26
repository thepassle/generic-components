const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    .alert {
      padding: 10px;
      border: 2px solid hsl(206, 74%, 54%);
      border-radius: 4px;
      background: hsl(206, 74%, 90%);
    }
  </style>
  <div class="alert" part="alert">
    <slot></slot>
  </div>
`;

export class GenericAlert extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'alert');
    }
    if (!this.hasAttribute('aria-live')) {
      this.setAttribute('aria-live', 'assertive');
    }
    if (!this.hasAttribute('aria-atomic')) {
      this.setAttribute('aria-atomic', 'true');
    }
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
