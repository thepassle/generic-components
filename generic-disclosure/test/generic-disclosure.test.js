import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-disclosure.js';

describe('generic-disclosure', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-disclosure></generic-disclosure>
    `);

    expect(el).to.be.accessible();
  });
});
