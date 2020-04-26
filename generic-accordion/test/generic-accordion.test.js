import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-accordion.js';

describe('generic-accordion', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-accordion></generic-accordion>
    `);

    expect(el).to.be.accessible();
  });
});
