import { html, fixture, expect } from '@open-wc/testing'; // eslint-disable-line
import { getFocusableElements } from './getFocusableElements.js';

describe('utils', () => {
  it('gets focusable elements', async () => {
    const el = await fixture(html`
      <div>
        <div tabindex="0"></div>
        <a href="/"></a>
        <button></button>
        <input></input>
        <select></select>
        <div></div>
      </div>
    `);

    expect(getFocusableElements(el).length).to.equal(5);
  });
});
