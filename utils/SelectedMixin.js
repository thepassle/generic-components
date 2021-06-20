import { KEYCODES } from './keycodes.js';

/**
 * @TODO
 * - getFocusableElements wont work for listbox, figure something out
 * actually it should work I think, because of the shouldFocus property in config
 */

export const SelectedMixin = superclass =>
  // eslint-disable-next-line
  class SelectedMixin extends superclass {
    constructor() {
      super();
      this.__onClick = this.__onClick.bind(this);
      this.__onKeyDown = this.__onKeyDown.bind(this);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (this.hasAttribute('selected')) {
        this.__index = Number(this.getAttribute('selected'));
      } else {
        this.__index = 0;
        this.requestUpdate(false);
      }

      this.shadowRoot.addEventListener('click', this.__onClick);
      this.shadowRoot.addEventListener('keydown', this.__onKeyDown);

      this.shadowRoot.addEventListener('slotchange', async () => {
        this.requestUpdate(false);
      });
    }

    static get observedAttributes() {
      return ['selected'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'selected') {
        if (newVal !== oldVal) {
          this.__index = Number(this.getAttribute('selected'));
          this.requestUpdate(true);
        }
      }
    }

    getElements() {
      const obj = {};
      Object.entries(this.constructor.config.selectors).forEach(([key, val]) => {
        obj[key] = val.selector(this);
      });
      return obj;
    }

    __getFocusableElements() {
      const focusableElements = Object.entries(this.constructor.config.selectors).find(
        ([, val]) => val.focusTarget,
      )[1];

      return [...focusableElements.selector(this)];
    }

    __dispatch() {
      const { selected } = this;
      this.dispatchEvent(
        new CustomEvent('selected-changed', {
          detail: selected,
        }),
      );
    }

    __focus() {
      this.__getFocusableElements()[this.__index].focus();
    }

    __onClick(e) {
      if (this.constructor.config.disabled && this.hasAttribute('disabled')) return;
      const focusableElements = this.__getFocusableElements();
      if (![...focusableElements].includes(e.target)) return;
      this.__index = focusableElements.indexOf(e.target);
      this.requestUpdate(true);
      if (this.constructor.config.shouldFocus) {
        this.__focus();
      }
    }

    __onKeyDown(event) {
      if (this.constructor.config.disabled && this.hasAttribute('disabled')) return;
      const elements = this.__getFocusableElements();
      // eslint-disable-next-line
      let { orientation, multiDirectional } = this.constructor.config;

      if (orientation === 'horizontal' && multiDirectional && this.hasAttribute('vertical')) {
        orientation = 'vertical';
      }

      switch (event.keyCode) {
        case orientation === 'horizontal' ? KEYCODES.LEFT : KEYCODES.UP:
          if (this.__index === 0) {
            this.__index = elements.length - 1;
          } else {
            this.__index--; // eslint-disable-line
          }
          break;

        case orientation === 'horizontal' ? KEYCODES.RIGHT : KEYCODES.DOWN:
          if (this.__index === elements.length - 1) {
            this.__index = 0;
          } else {
            this.__index++; // eslint-disable-line
          }
          break;

        case KEYCODES.HOME:
          this.__index = 0;
          break;

        case KEYCODES.END:
          this.__index = elements.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();

      if (this.constructor.config.activateOnKeydown) {
        this.requestUpdate(true);
      }

      if (this.constructor.config.shouldFocus) {
        this.__focus();
      }
    }

    /** 
     * @attr
     */
    get selected() {
      return this.__index;
    }

    set selected(val) {
      this.__index = val;
      if (val !== null) {
        this.requestUpdate(true);
      }
    }
  };
