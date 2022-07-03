import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../../dialog.js';
import { dialog } from '../dialog.js';

const defaultFixture = html`
  <generic-dialog id="myDialog">
    <button slot="invoker">open</button>
    <div slot="content">
      <h1>Im used as a web component!</h1>
      <p>dialog content</p>
      <button id="closebtn">close</button>
    </div>
  </generic-dialog>
`;

describe('generic-dialog', () => {
  it('a11y', async () => {
    const el = await fixture(defaultFixture);

    await expect(el).to.be.accessible();
  });

  describe('Web Component API', () => {
    it('dialog has required role', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');
      button.click();

      const dialogNode = document.body.querySelector('generic-dialog-overlay');
      const dialogFrame = dialogNode.shadowRoot.querySelector('[part="dialog"]');
      expect(dialogFrame.getAttribute('role')).to.equal('dialog');
      el.close();
    });

    it('body children get disabled/aria-hidden/inert', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');
      button.click();

      [...document.body.children]
        .filter(({ localName }) => localName === 'div')
        .forEach(node => {
          expect(node.hasAttribute('dialog-disabled')).to.equal(true);
          expect(node.hasAttribute('aria-hidden')).to.equal(true);
          expect(node.hasAttribute('inert')).to.equal(true);
        });

      el.close();
    });

    it('puts the content in the dialogFrame', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');
      button.click();

      const dialogNode = document.body.querySelector('generic-dialog-overlay');

      expect(dialogNode.innerHTML.trim()).to.equal(
        `<div>
      <h1>Im used as a web component!</h1>
      <p>dialog content</p>
      <button id="closebtn">close</button>
    </div>`.trim(),
      );

      el.close();
    });

    it('opens the dialog', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');
      button.click();

      const dialogNode = document.body.querySelector('generic-dialog-overlay');
      expect(dialogNode).to.exist;
      expect(dialog.__dialogOpen).to.equal(true);

      el.close();
    });

    it('dialog closes', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');
      button.click();

      el.close();
      expect(dialog.__dialogOpen).to.equal(false);
      expect(document.body.querySelector('generic-dialog-overlay')).not.to.exist;
    });

    it('dialog closes on escape', async () => {
      const el = await fixture(defaultFixture);

      el.setAttribute('close-on-escape', '');
      const button = el.querySelector('button');
      button.click();

      document.body.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }));

      expect(dialog.__dialogOpen).to.equal(false);
      expect(document.body.querySelector('generic-dialog-overlay')).not.to.exist;
    });

    it('dialog closes on outside click', async () => {
      const el = await fixture(defaultFixture);

      el.setAttribute('close-on-outside-click', '');
      const button = el.querySelector('button');
      button.click();

      document.body.querySelector('generic-dialog-overlay').dispatchEvent(new Event('mousedown'));

      expect(dialog.__dialogOpen).to.equal(false);
      expect(document.body.querySelector('generic-dialog-overlay')).not.to.exist;
    });

    it('fires an event on open', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');

      const listener = oneEvent(dialog, 'dialog-opened');
      button.click();
      await listener;
      expect(listener).to.exist;

      el.close();
    });

    it('fires an event on close', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');
      button.click();

      const listener = oneEvent(dialog, 'dialog-closed');
      el.close();
      await listener;
      expect(listener).to.exist;
    });

    it('resets focus to the invoker', async () => {
      const el = await fixture(defaultFixture);
      const button = el.querySelector('button');
      button.click();

      el.close();

      expect(document.activeElement).to.equal(button);
    });

    it('calls connectedCallback once', async () => {
      const el = await fixture(defaultFixture);
      const container = el.parentElement;

      expect(el.shadowRoot.querySelectorAll('slot[name="invoker"]').length).to.equal(1);
      expect(el.shadowRoot.querySelectorAll('slot[name="content"]').length).to.equal(1);

      el.remove();
      container.append(el);

      expect(el.shadowRoot.querySelectorAll('slot[name="invoker"]').length).to.equal(1);
      expect(el.shadowRoot.querySelectorAll('slot[name="content"]').length).to.equal(1);
    });
  });

  describe('JavaScript API', () => {
    it('dialog has required role', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        content: () => {},
      });

      const dialogNode = document.body.querySelector('generic-dialog-overlay');
      const dialogFrame = dialogNode.shadowRoot.querySelector('[part="dialog"]');
      expect(dialogFrame.getAttribute('role')).to.equal('dialog');
      dialog.close();
    });

    it('body children get disabled/aria-hidden/inert', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        content: () => {},
      });

      [...document.body.children]
        .filter(({ localName }) => localName === 'div')
        .forEach(node => {
          expect(node.hasAttribute('dialog-disabled')).to.equal(true);
          expect(node.hasAttribute('aria-hidden')).to.equal(true);
          expect(node.hasAttribute('inert')).to.equal(true);
        });

      dialog.close();
    });

    it('puts the content in the dialogFrame', async () => {
      const button = await fixture(`<button></button>`);
      const content = `<h1>foo</h1>`;

      dialog.open({
        invokerNode: button,
        content: node => {
          node.innerHTML = content; // eslint-disable-line
        },
      });

      const dialogNode = document.body.querySelector('generic-dialog-overlay');
      expect(dialogNode.innerHTML).to.equal(content);
      dialog.close();
    });

    it('opens the dialog', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        content: () => {},
      });

      const dialogNode = document.body.querySelector('generic-dialog-overlay');
      expect(dialogNode).to.exist;
      expect(dialog.__dialogOpen).to.equal(true);
      dialog.close();
    });

    it('dialog closes', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        closeOnEscape: true,
        content: () => {},
      });

      dialog.close();
      expect(dialog.__dialogOpen).to.equal(false);
      expect(document.body.querySelector('generic-dialog-overlay')).not.to.exist;
    });

    it('dialog closes on escape', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        closeOnEscape: true,
        content: () => {},
      });

      dialog.__onKeyDown({ keyCode: 27 });
      expect(dialog.__dialogOpen).to.equal(false);
      expect(document.body.querySelector('generic-dialog-overlay')).not.to.exist;
    });

    it('dialog closes on outside click', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        closeOnOutsideClick: true,
        content: () => {},
      });

      document.body.querySelector('generic-dialog-overlay').dispatchEvent(new Event('mousedown'));

      expect(dialog.__dialogOpen).to.equal(false);
      expect(document.body.querySelector('generic-dialog-overlay')).not.to.exist;
    });

    it('fires an event on open', async () => {
      const button = await fixture(`<button></button>`);

      const listener = oneEvent(dialog, 'dialog-opened');

      dialog.open({
        invokerNode: button,
        closeOnOutsideClick: true,
        content: () => {},
      });
      await listener;

      expect(listener).to.exist;
      dialog.close();
    });

    it('fires an event on close', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        closeOnOutsideClick: true,
        content: () => {},
      });

      const listener = oneEvent(dialog, 'dialog-closed');
      dialog.close();
      await listener;
      expect(listener).to.exist;
    });

    it('resets focus to the invoker', async () => {
      const button = await fixture(`<button></button>`);

      dialog.open({
        invokerNode: button,
        closeOnOutsideClick: true,
        content: () => {},
      });

      dialog.close();
      expect(document.activeElement).to.equal(button);
    });
  });
});
