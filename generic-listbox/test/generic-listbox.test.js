import { html, fixture, expect } from '@open-wc/testing';
import '../../generic-listbox.js';

const defaultFixture = html`
  <generic-listbox>
    <p slot="label">A list of items</p>
    <ul slot="listbox">
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
      <li>item 4</li>
      <li>item 5</li>
      <li>item 6</li>
      <li>item 7</li>
      <li>item 8</li>
      <li>item 9</li>
      <li>item 10</li>
      <li>item 11</li>
      <li>item 12</li>
      <li>item 13</li>
      <li>item 14</li>
      <li>item 15</li>
      <li>item 16</li>
      <li>item 17</li>
    </ul>
  </generic-listbox>
`;

describe('generic-listbox', () => {
  it('a11y', async () => {
    const el = await fixture(defaultFixture);

    expect(el).to.be.accessible();
  });
});
