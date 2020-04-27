import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-tooltip.js';

describe('generic-tooltip', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <div aria-describedby="tooltipTarget"></div>
      <generic-tooltip id="test"></generic-tooltip>
    `);

    expect(el).to.be.accessible();
  });
});
