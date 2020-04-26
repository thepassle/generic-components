import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-tabs.js';

describe('generic-tabs', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-tabs></generic-tabs>
    `);

    expect(el).to.be.accessible();
  });
});
