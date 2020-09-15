import { html, fixture, expect, fixtureSync } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../accordion.js';

const defaultFixture = html`
  <generic-accordion>
    <button>One</button>
    <div role="region">
      <p>foo</p>
      <a href="/">asdfa</a>
      <p>foo</p>
    </div>

    <button>Two</button>
    <div role="region">Hi</div>

    <button>Three</button>
    <div role="region">Bar</div>
  </generic-accordion>
`;

describe('generic-accordion', () => {
  it('a11y', async () => {
    const el = await fixture(defaultFixture);

    await expect(el).to.be.accessible();
  });

  it('has the required aria attributes', async () => {
    const el = await fixture(defaultFixture);
    const btns = el.querySelectorAll('button');
    const regions = el.querySelectorAll('[role="region"]');

    expect(regions[0].hasAttribute('aria-labelledby')).to.equal(true);
    expect(btns[0].id.startsWith('generic')).to.equal(true);
    expect(btns[0].getAttribute('aria-expanded')).to.equal('true');
    expect(btns[0].getAttribute('aria-disabled')).to.equal('true');
    expect(btns[1].getAttribute('aria-expanded')).to.equal('false');
  });

  it('has the required aria attributes', async () => {
    const el = await fixture(defaultFixture);
    const btns = el.querySelectorAll('button');
    const regions = el.querySelectorAll('[role="region"]');

    expect(regions[0].hasAttribute('aria-labelledby')).to.equal(true);
    expect(regions[1].hasAttribute('hidden')).to.equal(true);
    expect(btns[0].getAttribute('aria-expanded')).to.equal('true');
    expect(btns[1].getAttribute('aria-expanded')).to.equal('false');
  });

  it('reacts to click', async () => {
    const el = await fixture(defaultFixture);
    const btns = el.querySelectorAll('button');
    const regions = el.querySelectorAll('[role="region"]');

    btns[1].click();
    await el.updateComplete;

    expect(btns[1].getAttribute('aria-expanded')).to.equal('true');
    expect(regions[1].hasAttribute('hidden')).to.equal(false);
  });

  it('still works if moved around in the dom', async () => {
    const el = await fixture(defaultFixture);
    const btns = el.querySelectorAll('button');
    const regions = el.querySelectorAll('[role="region"]');

    btns[1].click();
    await el.updateComplete;

    expect(btns[1].getAttribute('aria-expanded')).to.equal('true');
    expect(regions[1].hasAttribute('hidden')).to.equal(false);

    // still works after moving element around in the dom
    const wrapper = await fixture(
      html`
        <div></div>
      `,
    );
    wrapper.appendChild(el);

    btns[2].click();
    await el.updateComplete;

    expect(btns[2].getAttribute('aria-expanded')).to.equal('true');
    expect(regions[2].hasAttribute('hidden')).to.equal(false);
  });

  it('reacts to slotchanged', async () => {
    const el = await fixture(defaultFixture);
    const btns = el.querySelectorAll('button');
    const regions = el.querySelectorAll('[role="region"]');

    btns[1].click();
    await el.updateComplete;

    expect(btns[1].getAttribute('aria-expanded')).to.equal('true');
    expect(regions[1].hasAttribute('hidden')).to.equal(false);

    const div = document.createElement('div');
    const btn = document.createElement('button');
    div.setAttribute('role', 'region');
    el.append(btn);
    el.append(div);

    await el.updateComplete;

    expect(el.querySelectorAll('button')[3].getAttribute('aria-expanded')).to.equal('false');
    expect(el.querySelectorAll('[role="region"]')[3].hasAttribute('hidden')).to.equal(true);
  });

  it('reacts to selected property change', async () => {
    const el = await fixture(defaultFixture);
    const btns = el.querySelectorAll('button');
    const regions = el.querySelectorAll('[role="region"]');

    el.selected = 1;
    await el.updateComplete;

    expect(btns[1].getAttribute('aria-expanded')).to.equal('true');
    expect(regions[1].hasAttribute('hidden')).to.equal(false);
  });

  describe('keycodes', () => {
    it('down', async () => {
      const el = await fixture(defaultFixture);
      const btns = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 40 });

      expect(btns[1]).to.equal(document.activeElement);
    });

    it('double down', async () => {
      const el = await fixture(defaultFixture);
      const btns = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 40 });
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 40 });

      expect(btns[2]).to.equal(document.activeElement);
    });

    it('up', async () => {
      const el = await fixture(defaultFixture);
      const btns = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 38 });

      expect(btns[2]).to.equal(document.activeElement);
    });

    it('double up', async () => {
      const el = await fixture(defaultFixture);
      const btns = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 38 });
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 38 });

      expect(btns[1]).to.equal(document.activeElement);
    });

    it('home', async () => {
      const el = await fixture(defaultFixture);
      const btns = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 36 });

      expect(btns[0]).to.equal(document.activeElement);
    });

    it('end', async () => {
      const el = await fixture(defaultFixture);
      const btns = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 35 });

      expect(btns[2]).to.equal(document.activeElement);
    });
  });

  describe('events', () => {
    it('doesnt dispatch on first update', async () => {
      const el = fixtureSync(defaultFixture);
      const dispatchStub = stub(el, '__dispatch');
      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('doesnt dispatch on slotchange', async () => {
      const el = await fixture(defaultFixture);
      const dispatchStub = stub(el, '__dispatch');

      const div = document.createElement('div');
      const btn = document.createElement('button');
      div.setAttribute('role', 'region');
      el.append(btn);
      el.append(div);

      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('doesnt dispatch on keydown', async () => {
      const el = await fixture(defaultFixture);
      const dispatchStub = stub(el, '__dispatch');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 40 });
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('fires event on attr change', async () => {
      const el = await fixture(defaultFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.setAttribute('selected', '1');
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on prop change', async () => {
      const el = await fixture(defaultFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.selected = 1;
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on click', async () => {
      const el = await fixture(defaultFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.querySelectorAll('button')[1].click();
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });
  });
});
