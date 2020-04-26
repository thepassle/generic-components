import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-alert.js';

describe('generic-alert', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-alert></generic-alert>
    `);

    expect(el).to.be.accessible();
  });
});
