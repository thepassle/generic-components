import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-listbox.js';

const defaultFixture = html`
  <generic-listbox> </generic-listbox>
`;

describe('generic-listbox', () => {
  it('a11y', async () => {
    const el = await fixture(defaultFixture);

    expect(el).to.be.accessible();
  });
});
