import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-switch.js';

describe('generic-switch', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-switch></generic-switch>
    `);

    expect(el).to.be.accessible();
  });
});
