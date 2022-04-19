import { BatchingElement } from '../utils/BatchingElement.js';
import { SelectedMixin } from '../utils/SelectedMixin.js';

const template = document.createElement('template');
template.innerHTML = `
  <slot>
  </slot>
`;

/**
 * @attr label
 */
export class GenericListbox extends SelectedMixin(BatchingElement) {
  static is = 'generic-listbox';

  static get config() {
    return {
      selectors: {
        ul: {
          selector: el => el.querySelector('ul'),
        },
        li: {
          selector: el => el.querySelectorAll('ul li'),
          focusTarget: true,
        },
      },
      multiDirectional: false,
      orientation: 'vertical',
      shouldFocus: false,
      activateOnKeydown: true,
      disabled: false,
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    super.connectedCallback();
    const { ul } = this.getElements();

    ul.setAttribute('tabindex', '0');
    ul.setAttribute('role', 'listbox');
    ul.setAttribute('aria-label', this.getAttribute('label') || 'listbox');
  }

  update() {
    const { ul, li } = this.getElements();

    li.forEach((el, i) => {
      if (!li[i].id.startsWith('generic-listbox-')) {
        li[i].id = `generic-listbox-${this.__uuid}-${i}`;
        li[i].setAttribute('role', 'option');
      }

      if (i === this.selected) {
        this.requestUpdate(true);
        li[i].setAttribute('aria-selected', 'true');
        li[i].setAttribute('selected', '');
        ul.setAttribute('aria-activedescendant', li[i].id);
        this.__scrollIntoView(li[i]);
        this.value = li[i].textContent.trim();
      } else {
        li[i].removeAttribute('aria-selected');
        li[i].removeAttribute('selected');
      }
    });
  }

  __scrollIntoView(li) {
    const { ul } = this.getElements();
    if (ul.scrollHeight > ul.clientHeight) {
      const elOffsetBottom = li.offsetTop - ul.offsetTop + li.clientHeight;
      const elOffsetTop = li.offsetTop - ul.offsetTop;

      if (elOffsetTop < ul.scrollTop) {
        ul.scrollTop = elOffsetTop;
      }

      if (elOffsetBottom > ul.scrollTop + ul.clientHeight) {
        if (ul.clientHeight - elOffsetTop < 0) {
          ul.scrollTop = elOffsetBottom - ul.clientHeight;
        } else {
          ul.scrollTop = ul.clientHeight - elOffsetTop;
        }
      }
    }
  }
}
