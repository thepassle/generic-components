import { html, fixture, fixtureSync, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../radio.js';

const radioFixture = html`
  <generic-radio label="radiogroup">
    <div>foo</div>
    <div>bar</div>
    <div>baz</div>
  </generic-radio>
`;

const radioFixtureSelected = html`
  <generic-radio label="radiogroup" selected="1">
    <div>foo</div>
    <div>bar</div>
    <div>baz</div>
  </generic-radio>
`;

describe('generic-radio', () => {
  it('a11y', async () => {
    const el = await fixture(radioFixture);
    await expect(el).to.be.accessible();
  });

  it('has required aria attributes', async () => {
    const el = await fixture(radioFixture);

    const buttons = el.querySelectorAll('div');
    const group = el.shadowRoot.querySelector('.group');

    expect(group.getAttribute('aria-label')).to.equal('radiogroup');

    expect(buttons[0].hasAttribute('selected')).to.equal(true);
    expect(buttons[0].getAttribute('tabindex')).to.equal('0');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[1].hasAttribute('selected')).to.equal(false);
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('false');
  });

  it('reacts to slotchanged', async () => {
    const el = await fixture(radioFixture);

    let buttons = el.querySelectorAll('div');
    const group = el.shadowRoot.querySelector('.group');

    expect(group.getAttribute('aria-label')).to.equal('radiogroup');

    expect(buttons[0].hasAttribute('selected')).to.equal(true);
    expect(buttons[0].getAttribute('tabindex')).to.equal('0');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[1].hasAttribute('selected')).to.equal(false);
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('false');

    const div = document.createElement('div');
    el.append(div);

    await el.updateComplete;

    buttons = el.querySelectorAll('div');

    expect(buttons[3].hasAttribute('selected')).to.equal(false);
    expect(buttons[3].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[3].getAttribute('role')).to.equal('radio');
    expect(buttons[3].getAttribute('aria-checked')).to.equal('false');
  });

  it('activates first tab by default', async () => {
    const el = await fixture(radioFixture);
    const buttons = el.querySelectorAll('div');

    expect(buttons[0].hasAttribute('selected')).to.equal(true);
    expect(buttons[0].getAttribute('tabindex')).to.equal('0');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('true');
  });

  it('activates the tab if theres an selected attribute', async () => {
    const el = await fixture(radioFixtureSelected);

    const buttons = el.querySelectorAll('div');

    expect(buttons[1].hasAttribute('selected')).to.equal(true);
    expect(buttons[1].getAttribute('tabindex')).to.equal('0');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('false');
  });

  it('reacts to selected property changed', async () => {
    const el = await fixture(radioFixture);
    el.selected = 1;
    await el.updateComplete;

    const buttons = el.querySelectorAll('div');

    expect(buttons[1].hasAttribute('selected')).to.equal(true);
    expect(buttons[1].getAttribute('tabindex')).to.equal('0');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('false');
  });

  it('reacts to selected attribute changed', async () => {
    const el = await fixture(radioFixture);
    el.setAttribute('selected', '1');
    await el.updateComplete;

    const buttons = el.querySelectorAll('div');

    expect(buttons[1].hasAttribute('selected')).to.equal(true);
    expect(buttons[1].getAttribute('tabindex')).to.equal('0');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('false');
  });

  it('reacts to click', async () => {
    const el = await fixture(radioFixture);

    const buttons = el.querySelectorAll('div');

    buttons[1].click();
    await el.updateComplete;

    expect(buttons[1].hasAttribute('selected')).to.equal(true);
    expect(buttons[1].getAttribute('tabindex')).to.equal('0');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('false');

    buttons[0].click();
    await el.updateComplete;

    expect(buttons[0].hasAttribute('selected')).to.equal(true);
    expect(buttons[0].getAttribute('tabindex')).to.equal('0');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[1].hasAttribute('selected')).to.equal(false);
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('false');
  });

  it('still works when moved in the dom', async () => {
    const el = await fixture(radioFixture);

    const buttons = el.querySelectorAll('div');

    buttons[1].click();
    await el.updateComplete;

    expect(buttons[1].hasAttribute('selected')).to.equal(true);
    expect(buttons[1].getAttribute('tabindex')).to.equal('0');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('false');

    // still works after moving element around in the dom
    const wrapper = await fixture(
      html`
        <div></div>
      `,
    );
    wrapper.appendChild(el);

    buttons[0].click();
    await el.updateComplete;

    expect(buttons[0].hasAttribute('selected')).to.equal(true);
    expect(buttons[0].getAttribute('tabindex')).to.equal('0');
    expect(buttons[0].getAttribute('role')).to.equal('radio');
    expect(buttons[0].getAttribute('aria-checked')).to.equal('true');

    expect(buttons[1].hasAttribute('selected')).to.equal(false);
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[1].getAttribute('role')).to.equal('radio');
    expect(buttons[1].getAttribute('aria-checked')).to.equal('false');
  });

  describe('keycodes', () => {
    it('left', async () => {
      const el = await fixture(radioFixture);
      const buttons = el.querySelectorAll('div');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      await el.updateComplete;

      expect(buttons[2].hasAttribute('selected')).to.equal(true);
      expect(buttons[2].getAttribute('tabindex')).to.equal('0');
      expect(buttons[2].getAttribute('role')).to.equal('radio');
      expect(buttons[2].getAttribute('aria-checked')).to.equal('true');
    });

    it('double left', async () => {
      const el = await fixture(radioFixture);
      const buttons = el.querySelectorAll('div');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      await el.updateComplete;

      expect(buttons[1].hasAttribute('selected')).to.equal(true);
      expect(buttons[1].getAttribute('tabindex')).to.equal('0');
      expect(buttons[1].getAttribute('role')).to.equal('radio');
      expect(buttons[1].getAttribute('aria-checked')).to.equal('true');
    });

    it('right', async () => {
      const el = await fixture(radioFixture);
      const buttons = el.querySelectorAll('div');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 39 });
      await el.updateComplete;

      expect(buttons[1].hasAttribute('selected')).to.equal(true);
      expect(buttons[1].getAttribute('tabindex')).to.equal('0');
      expect(buttons[1].getAttribute('role')).to.equal('radio');
      expect(buttons[1].getAttribute('aria-checked')).to.equal('true');
    });

    it('double right', async () => {
      const el = await fixture(radioFixture);
      const buttons = el.querySelectorAll('div');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 39 });
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 39 });
      await el.updateComplete;

      expect(buttons[2].hasAttribute('selected')).to.equal(true);
      expect(buttons[2].getAttribute('tabindex')).to.equal('0');
      expect(buttons[2].getAttribute('role')).to.equal('radio');
      expect(buttons[2].getAttribute('aria-checked')).to.equal('true');
    });

    it('home', async () => {
      const el = await fixture(radioFixture);
      const buttons = el.querySelectorAll('div');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 36 });

      expect(buttons[0].hasAttribute('selected')).to.equal(true);
      expect(buttons[0].getAttribute('tabindex')).to.equal('0');
      expect(buttons[0].getAttribute('role')).to.equal('radio');
      expect(buttons[0].getAttribute('aria-checked')).to.equal('true');
    });

    it('end', async () => {
      const el = await fixture(radioFixture);
      const buttons = el.querySelectorAll('div');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 35 });
      await el.updateComplete;

      expect(buttons[2].hasAttribute('selected')).to.equal(true);
      expect(buttons[2].getAttribute('tabindex')).to.equal('0');
      expect(buttons[2].getAttribute('role')).to.equal('radio');
      expect(buttons[2].getAttribute('aria-checked')).to.equal('true');
    });
  });

  describe('events', () => {
    it('doesnt dispatch on first update', async () => {
      const el = fixtureSync(radioFixture);
      const dispatchStub = stub(el, '__dispatch');
      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('doesnt dispatch when the vertical attribute is set', async () => {
      const el = fixtureSync(radioFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.setAttribute('vertical', '');
      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('doesnt dispatch on slotchange', async () => {
      const el = await fixture(radioFixture);
      const dispatchStub = stub(el, '__dispatch');

      const div = document.createElement('div');
      el.append(div);

      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('fires event on attr change', async () => {
      const el = await fixture(radioFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.setAttribute('selected', '1');
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on prop change', async () => {
      const el = await fixture(radioFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.selected = 1;
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on keydown', async () => {
      const el = await fixture(radioFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on click', async () => {
      const el = await fixture(radioFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.querySelectorAll('div')[1].click();
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('doesnt dispatch when disabled', async () => {
      const el = fixtureSync(radioFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.setAttribute('disabled', '');
      el.setAttribute('selected', '1');
      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });
  });

  describe('vertical', () => {
    it('changes accepted keys in vertical mode', async () => {
      const el = await fixture(radioFixture);
      el.setAttribute('vertical', '');
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 40 });
      await el.updateComplete;

      const buttons = el.querySelectorAll('div');

      expect(buttons[1].hasAttribute('selected')).to.equal(true);
      expect(buttons[1].getAttribute('tabindex')).to.equal('0');
      expect(buttons[1].getAttribute('role')).to.equal('radio');
      expect(buttons[1].getAttribute('aria-checked')).to.equal('true');
    });
  });

  describe('disabled', () => {
    it('doesnt set tabindex when disabled', async () => {
      const el = await fixture(radioFixture);
      el.setAttribute('disabled', '');
      await el.updateComplete;

      const buttons = el.querySelectorAll('div');

      expect(buttons[0].hasAttribute('tabindex')).to.equal(false);
      expect(buttons[1].hasAttribute('tabindex')).to.equal(false);
      expect(buttons[2].hasAttribute('tabindex')).to.equal(false);
    });

    it('doesnt set selected attr on host when disabled', async () => {
      const el = await fixture(radioFixture);
      el.setAttribute('disabled', '');
      await el.updateComplete;

      expect(el.hasAttribute('selected')).to.equal(false);
    });

    it('doesnt set selected property on host when disabled', async () => {
      const el = await fixture(radioFixture);
      el.setAttribute('disabled', '');
      await el.updateComplete;

      expect(el.selected).to.equal(null);
    });

    it('doesnt respond to click when disabled', async () => {
      const el = await fixture(radioFixture);
      el.setAttribute('disabled', '');
      await el.updateComplete;

      const buttons = el.querySelectorAll('div');
      buttons[1].click();

      expect(buttons[0].hasAttribute('tabindex')).to.equal(false);
      expect(buttons[1].hasAttribute('tabindex')).to.equal(false);
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[2].hasAttribute('tabindex')).to.equal(false);
    });

    it('doesnt respond to keyboard nav when disabled', async () => {
      const el = await fixture(radioFixture);
      el.setAttribute('disabled', '');
      await el.updateComplete;

      const buttons = el.querySelectorAll('div');
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 39 });

      expect(buttons[0].hasAttribute('tabindex')).to.equal(false);
      expect(buttons[1].hasAttribute('tabindex')).to.equal(false);
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[2].hasAttribute('tabindex')).to.equal(false);
    });

    it('sets selected to null when disabled, and selects first radio when disabled is removed', async () => {
      const el = await fixture(radioFixture);
      el.setAttribute('disabled', '');
      await el.updateComplete;
      const buttons = el.querySelectorAll('div');

      expect(el.selected).to.equal(null);
      expect(buttons[0].hasAttribute('selected')).to.equal(false);
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[2].hasAttribute('selected')).to.equal(false);

      el.removeAttribute('disabled');
      await el.updateComplete;

      expect(el.selected).to.equal(0);
      expect(buttons[0].hasAttribute('selected')).to.equal(true);
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[2].hasAttribute('selected')).to.equal(false);
    });
  });
});
