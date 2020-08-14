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
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  close() {
    this.content.forEach(element => {
      element.setAttribute('hidden', '');
      this.append(element);
    });
    dialog.close();
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const invoker = this.shadowRoot.querySelector('slot[name="invoker"]');
    this.content = this.shadowRoot.querySelector('slot[name="content"]').assignedNodes();

    invoker.addEventListener('click', e => {
      dialog.open({
        invokerNode: e.target,
        content: dialogNode => {
          this.content.forEach(element => {
            element.removeAttribute('hidden');
            dialogNode.append(element);
          });
        },
      });
    });
  }
}
