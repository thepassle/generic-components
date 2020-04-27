import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-disclosure.js';

describe('generic-disclosure', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-disclosure></generic-disclosure>
    `);

    expect(el).to.be.accessible();
  });

  it('opens and closes on click', async () => {
    const el = await fixture(html`
      <generic-disclosure></generic-disclosure>
    `);

    const btn = el.shadowRoot.querySelector('button');
    btn.click();

    expect(el.hasAttribute('expanded')).to.equal(true);
    expect(btn.getAttribute('aria-expanded')).to.equal('true');

    btn.click();

    expect(el.hasAttribute('expanded')).to.equal(false);
    expect(btn.getAttribute('aria-expanded')).to.equal('false');
  });
});
