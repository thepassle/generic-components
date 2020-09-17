import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../disclosure.js';

describe('generic-disclosure', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-disclosure
        ><button slot="toggle">clicky</button><span slot="detail"></span
      ></generic-disclosure>
    `);

    await expect(el).to.be.accessible();
  });

  it('opens and closes on click', async () => {
    const el = await fixture(html`
      <generic-disclosure
        ><button slot="toggle"></button><span slot="detail"></span
      ></generic-disclosure>
    `);

    const btn = el.querySelector('button');
    btn.click();

    expect(el.hasAttribute('expanded')).to.equal(true);
    expect(btn.getAttribute('aria-expanded')).to.equal('true');

    btn.click();

    expect(el.hasAttribute('expanded')).to.equal(false);
    expect(btn.getAttribute('aria-expanded')).to.equal('false');
  });

  it('reacts to attribute changes', async () => {
    const el = await fixture(html`
      <generic-disclosure
        ><button slot="toggle"></button><span slot="detail"></span
      ></generic-disclosure>
    `);
    const btn = el.querySelector('button');

    el.setAttribute('expanded', '');

    expect(el.hasAttribute('expanded')).to.equal(true);
    expect(btn.getAttribute('aria-expanded')).to.equal('true');

    el.removeAttribute('expanded');

    expect(el.hasAttribute('expanded')).to.equal(false);
    expect(btn.getAttribute('aria-expanded')).to.equal('false');
  });

  it('reacts to property changes', async () => {
    const el = await fixture(html`
      <generic-disclosure
        ><button slot="toggle"></button><span slot="detail"></span
      ></generic-disclosure>
    `);
    const btn = el.querySelector('button');

    el.expanded = true;

    expect(el.hasAttribute('expanded')).to.equal(true);
    expect(btn.getAttribute('aria-expanded')).to.equal('true');

    el.expanded = false;

    expect(el.hasAttribute('expanded')).to.equal(false);
    expect(btn.getAttribute('aria-expanded')).to.equal('false');
  });

  it('fires a opened-changed event - on open', async () => {
    const el = await fixture(html`
      <generic-disclosure
        ><button slot="toggle"></button><span slot="detail"></span
      ></generic-disclosure>
    `);

    const listener = oneEvent(el, 'opened-changed');

    el.expanded = true;

    const { detail } = await listener;
    expect(detail).to.equal(true);
  });

  it('fires a opened-changed event - on close', async () => {
    const el = await fixture(html`
      <generic-disclosure expanded
        ><button slot="toggle"></button><span slot="detail"></span
      ></generic-disclosure>
    `);

    const listener = oneEvent(el, 'opened-changed');

    el.expanded = false;

    const { detail } = await listener;
    expect(detail).to.equal(false);
  });

  it('doesnt fire an event on first update', async () => {
    const el = await fixture(html`
      <generic-disclosure expanded>
        <button slot="toggle"></button><span slot="detail"></span>
      </generic-disclosure>
    `);
    const dispatchStub = stub(el, 'dispatchEvent');
    el.connectedCallback();
    expect(dispatchStub).callCount(0);
    dispatchStub.restore();
  });
});
