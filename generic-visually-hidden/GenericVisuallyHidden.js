import { hostVisuallyHidden } from './visually-hidden.js';

export class GenericVisuallyHidden extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.removeAttribute('hidden');
    this.shadowRoot.innerHTML = `
      <style>
        ${hostVisuallyHidden}
      </style>

      <slot></slot>
    `;
  }
}
