import { skiplink } from './skiplink.js';

/**
 * @element generic-skiplink
 *
 * @csspart anchor
 */
export class GenericSkiplink extends HTMLElement {
  static is = 'generic-skiplink';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['for'];
  }

  attributeChangedCallback(name) {
    if (name === 'for') {
      this.render();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${skiplink}
      </style>

      <a
        skiplink
        part="anchor"
        class="skiplink"
        href="#${this.getAttribute('for')}">
          <slot>Continue to main</slot>
      </a>
    `;
  }
}
