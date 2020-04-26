import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-menu-button.js';

describe('generic-menu-button', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-menu-button></generic-menu-button>
    `);

    expect(el).to.be.accessible();
  });
});
