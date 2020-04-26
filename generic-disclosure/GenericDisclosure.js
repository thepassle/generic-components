/**
 * TODO:
 * observe expanded attribute
 */

export class GenericDisclosure extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.expanded = false;
    this.random = Math.random()
      .toString(36)
      .substr(2, 9);
  }

  // static get observedAttributes() {
  //   return ['expanded'];
  // }

  // attributeChangedCallback(name, newVal, oldVal) {
  //   console.log(newVal, oldVal);
  //   if(name === 'expanded') {
  //     if(this.expanded) {
  //       this.__open();
  //     } else {
  //       this.__close();
  //     }
  //   }
  // }

  connectedCallback() {
    this.render();

    this.button = this.shadowRoot.getElementById(`toggle-${this.random}`);
    this.detail = this.shadowRoot.getElementById(`detail-${this.random}`);

    this.button.addEventListener('click', () => {
      this.expanded = !this.expanded;

      if (this.expanded) {
        this.__open();
      } else {
        this.__close();
      }
    });
  }

  __open() {
    this.setAttribute('expanded', '');
    this.button.setAttribute('aria-expanded', 'true');
    this.detail.classList.add('opened');
    this.detail.classList.remove('closed');
  }

  __close() {
    this.removeAttribute('expanded');
    this.button.removeAttribute('aria-expanded');
    this.detail.classList.add('closed');
    this.detail.classList.remove('opened');
  }

  render() {
    this.shadowRoot.innerHTML = `
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
          height: 60px;
        }
      
        button:hover {
          background-color: #dedede;
        }
      </style>

      <button 
        part="toggle"
        id="toggle-${this.random}" 
        class="toggle"
      >   
        <slot name="toggle"></slot>  
      </button>

      <div
        part="detail"
        id="detail-${this.random}"
        class="detail closed"
        role="region"
      >
        <slot name="detail"></slot>
      </div>
    `;
  }
}
