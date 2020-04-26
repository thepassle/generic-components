import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-dialog.js';

describe('generic-dialog', () => {
  it('a11y', async () => {
    const el = await fixture(html`
      <generic-dialog></generic-dialog>
    `);

    expect(el).to.be.accessible();
  });
});
