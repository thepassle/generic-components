import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-skiplink.js';

describe('generic-skiplink', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-skiplink></generic-skiplink>
    `);

    expect(el).to.be.accessible();
  });
});
