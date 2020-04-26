import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-focus-trap.js';

describe('generic-focus-trap', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-focus-trap></generic-focus-trap>
    `);

    expect(el).to.be.accessible();
  });
});
