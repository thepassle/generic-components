import { dialog } from './dialog.js';

const template = document.createElement('template');
template.innerHTML = `
  <slot name="invoker">
    <button>open dialog</button>
  </slot>

  <slot hidden name="content">
  </slot>
`;

export class GenericDialog extends HTMLElement {
  static is = 'generic-dialog';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._connected = false;
  }

  close() {
    this.content.forEach(element => {
      element.setAttribute('hidden', '');
      element.setAttribute('slot', 'content');
      this.append(element);
    });
    dialog.close();
  }

  connectedCallback() {
    if (this._connected) {
      return;
    }

    this._connected = true;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const invoker = this.shadowRoot.querySelector('slot[name="invoker"]');
    this.content = this.shadowRoot.querySelector('slot[name="content"]').assignedNodes();

    invoker.addEventListener('click', e => {
      dialog.open({
        invokerNode: e.target,
        closeOnEscape: this.hasAttribute('close-on-escape'),
        closeOnOutsideClick: this.hasAttribute('close-on-outside-click'),
        content: dialogNode => {
          this.content.forEach(element => {
            element.removeAttribute('hidden');
            element.removeAttribute('slot');
            dialogNode.append(element);
          });
        },
      });
    });

    dialog.addEventListener('dialog-opened', () => {
      this.dispatchEvent(new CustomEvent('dialog-opened', { detail: true }));
    });

    dialog.addEventListener('dialog-closed', () => {
      this.dispatchEvent(new CustomEvent('dialog-closed', { detail: true }));
    });
  }
}
