/**
 * https://lion-web-components.netlify.app/?path=/story/buttons-switch--checked
 */

export class GenericSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['disabled', 'checked'];
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

  /**
   * TODO:
   * on focus, only focus ring on the thumb
   * css styles on disabled
   * only add listeners if not disabled
   * keyboard nav (enter and space)
   *
   */
  connectedCallback() {
    // these need to be on the button
    this.setAttribute('role', 'switch');
    this.setAttribute('tabindex', '0');
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          height: 16px;
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
          top: 0;
          position: absolute;
          width: 50%;
          height: 100%;
          background-color: grey;
        }
      </style>
      <label>lol</label>
      <div class="button">
        <div class="track"></div>
        <div class="thumb"></div>
      </div>
    `;
  }
}
