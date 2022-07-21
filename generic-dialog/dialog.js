import { EventTargetShim } from '../utils/EventTargetShim.js';
import { KEYCODES } from '../utils/keycodes.js';
// eslint-disable-next-line
import './generic-dialog-overlay.js';

export class Dialog extends EventTargetShim {
  open({ closeOnEscape = true, closeOnOutsideClick = true, invokerNode, content }) {
    this.__dialogOpen = true;
    this.__invokerNode = invokerNode;
    this.__closeOnEscape = closeOnEscape;
    this.__closeOnOutsideClick = closeOnOutsideClick;

    if (this.__closeOnEscape) {
      window.addEventListener('keydown', this.__onKeyDown.bind(this), true);
    }

    [...document.body.children].forEach(node => {
      if (node.localName !== 'script') {
        if (!node.hasAttribute('aria-hidden')) {
          node.setAttribute('dialog-disabled', '');
          node.setAttribute('aria-hidden', 'true');
          node.setAttribute('inert', '');
        }
      }
    });

    const dialogOverlayNode = document.createElement('generic-dialog-overlay');
    const dialogNode = dialogOverlayNode.shadowRoot.querySelector('[role="dialog"]');

    this.__dialogOverlay = dialogOverlayNode;
    if (this.__closeOnOutsideClick) {
      dialogOverlayNode.setAttribute('close-on-outside-click', '');
    }
    document.body.appendChild(dialogOverlayNode);

    content(dialogOverlayNode, dialogNode);
    this.dispatchEvent(new Event('dialog-opened'));
  }

  // eslint-disable-next-line
  close() {
    this.__dialogOpen = false;

    [...document.body.children].forEach(node => {
      if (node.localName !== 'script') {
        if (node.hasAttribute('dialog-disabled')) {
          node.removeAttribute('dialog-disabled');
          node.removeAttribute('aria-hidden');
          node.removeAttribute('inert');
        }
      }
    });

    document.querySelector('generic-dialog-overlay').remove();

    this.__invokerNode.focus();
    this.__invokerNode = null;

    this.dispatchEvent(new Event('dialog-closed'));
  }

  __onKeyDown(e) {
    if (e.keyCode === KEYCODES.ESC && this.__dialogOpen && this.__closeOnEscape) {
      this.close();
      window.removeEventListener('keydown', this.__onKeyDown.bind(this), true);
    }
  }
}

export const dialog = new Dialog();
