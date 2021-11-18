import { html, fixture, expect } from '@open-wc/testing';
import '../../spinner.js';

describe('generic-spinner', () => {
  it('sets aria label when label attr is provided', async () => {
    const el = await fixture(html`
      <generic-spinner label="foo"></generic-spinner>
    `);

    expect(el.getAttribute('aria-label')).to.equal('foo');
  });

  it('a11y', async () => {
    const el = await fixture(html`
      <generic-spinner></generic-spinner>
    `);

    await expect(el).to.be.accessible();
  });
});
