import { html, fixture, fixtureSync, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../tabs.js';

const tabsFixture = html`
  <generic-tabs>
    <button slot="tab">
      Jim
    </button>
    <div slot="panel">
      My name is Jim.
    </div>

    <button slot="tab">
      Jack
    </button>
    <div slot="panel">
      And I am Jack.
    </div>
  </generic-tabs>
`;

const tabsWithHeadingsFixture = html`
  <generic-tabs>
    <h1>
      Jim
    </h1>
    <div>
      My name is Jim.
    </div>
    <h1>
      Jack
    </h1>
    <div>
      And I am Jack.
    </div>
  </generic-tabs>
`;

const tabsFixtureSelected = html`
  <generic-tabs selected="1">
    <button slot="tab">
      Jim
    </button>
    <div slot="panel">
      My name is Jim. Im not opened by default.
    </div>

    <button slot="tab">
      Jack
    </button>
    <div slot="panel">
      And I am Jack. I am opened by default.
    </div>
  </generic-tabs>
`;

describe('generic-tabs', () => {
  it('a11y', async () => {
    const el = await fixture(tabsFixture);
    await expect(el).to.be.accessible();
  });

  it('has required aria attributes', async () => {
    const el = await fixture(tabsFixture);

    const tablist = el.shadowRoot.querySelector('[role="tablist"]');
    const panel = el.querySelector('div[slot="panel"]');
    const button = el.querySelector('button[slot="tab"]');

    expect(tablist.getAttribute('role')).to.equal('tablist');
    expect(tablist.getAttribute('aria-label')).to.equal('tablist');

    expect(panel.getAttribute('role')).to.equal('tabpanel');
    expect(panel.hasAttribute('aria-labelledby')).to.equal(true);

    expect(button.getAttribute('role')).to.equal('tab');
    expect(button.getAttribute('aria-selected')).to.equal('true');
    expect(button.hasAttribute('aria-controls')).to.equal(true);
    expect(button.hasAttribute('selected')).to.equal(true);
  });

  it('reacts to slotchanged', async () => {
    const el = await fixture(tabsFixture);

    const tablist = el.shadowRoot.querySelector('[role="tablist"]');
    const panel = el.querySelector('div[slot="panel"]');
    const button = el.querySelector('button[slot="tab"]');

    expect(tablist.getAttribute('role')).to.equal('tablist');
    expect(tablist.getAttribute('aria-label')).to.equal('tablist');

    expect(panel.getAttribute('role')).to.equal('tabpanel');
    expect(panel.hasAttribute('aria-labelledby')).to.equal(true);

    expect(button.getAttribute('role')).to.equal('tab');
    expect(button.getAttribute('aria-selected')).to.equal('true');
    expect(button.hasAttribute('aria-controls')).to.equal(true);
    expect(button.hasAttribute('selected')).to.equal(true);

    const btn = document.createElement('button');
    btn.setAttribute('slot', 'tab');
    const div = document.createElement('div');
    div.setAttribute('slot', 'panel');
    el.append(btn);
    el.append(div);

    await el.updateComplete;

    const newpanel = el.querySelectorAll('div[slot="panel"]')[2];
    const newbutton = el.querySelectorAll('button[slot="tab"]')[2];

    expect(newpanel.getAttribute('role')).to.equal('tabpanel');
    expect(newpanel.hasAttribute('aria-labelledby')).to.equal(true);

    expect(newbutton.getAttribute('role')).to.equal('tab');
    expect(newbutton.getAttribute('aria-selected')).to.equal('false');
    expect(newbutton.hasAttribute('aria-controls')).to.equal(true);
    expect(newbutton.hasAttribute('selected')).to.equal(false);
  });

  it('activates first tab by default', async () => {
    const el = await fixture(tabsFixture);
    const buttons = el.querySelectorAll('button');

    expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[0].hasAttribute('selected')).to.equal(true);

    expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[1].hasAttribute('selected')).to.equal(false);
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
  });

  it('activates the tab if theres an selected attribute', async () => {
    const el = await fixture(tabsFixtureSelected);
    const buttons = el.querySelectorAll('button');

    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[1].hasAttribute('selected')).to.equal(true);

    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
  });

  it('reacts to selected property changed', async () => {
    const el = await fixture(tabsFixture);
    el.selected = 1;
    await el.updateComplete;
    const buttons = el.querySelectorAll('button');

    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[1].hasAttribute('selected')).to.equal(true);

    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
  });

  it('reacts to selected attribute changed', async () => {
    const el = await fixture(tabsFixture);
    el.setAttribute('selected', '1');
    await el.updateComplete;
    const buttons = el.querySelectorAll('button');

    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[1].hasAttribute('selected')).to.equal(true);

    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
  });

  it('reacts to click', async () => {
    const el = await fixture(tabsFixture);

    const buttons = el.querySelectorAll('button');

    buttons[1].click();
    await el.updateComplete;

    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[1].hasAttribute('selected')).to.equal(true);

    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');

    buttons[0].click();
    await el.updateComplete;

    expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[0].hasAttribute('selected')).to.equal(true);

    expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[1].hasAttribute('selected')).to.equal(false);
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
  });

  it('still works when moved in the dom', async () => {
    const el = await fixture(tabsFixture);

    const buttons = el.querySelectorAll('button');

    buttons[1].click();
    await el.updateComplete;

    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[1].hasAttribute('selected')).to.equal(true);

    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[0].hasAttribute('selected')).to.equal(false);
    expect(buttons[0].getAttribute('tabindex')).to.equal('-1');

    // still works after moving element around in the dom
    const wrapper = await fixture(
      html`
        <div></div>
      `,
    );
    wrapper.appendChild(el);

    buttons[0].click();
    await el.updateComplete;

    expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
    expect(buttons[0].hasAttribute('selected')).to.equal(true);

    expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[1].hasAttribute('selected')).to.equal(false);
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
  });

  describe('keycodes', () => {
    it('left', async () => {
      const el = await fixture(tabsFixture);
      const buttons = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      await el.updateComplete;

      expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[1].hasAttribute('selected')).to.equal(true);

      expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[0].hasAttribute('selected')).to.equal(false);
      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    });

    it('double left', async () => {
      const el = await fixture(tabsFixture);
      const buttons = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      await el.updateComplete;

      expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[0].hasAttribute('selected')).to.equal(true);

      expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    });

    it('right', async () => {
      const el = await fixture(tabsFixture);
      const buttons = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 39 });
      await el.updateComplete;

      expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[1].hasAttribute('selected')).to.equal(true);

      expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[0].hasAttribute('selected')).to.equal(false);
      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    });

    it('double right', async () => {
      const el = await fixture(tabsFixture);
      const buttons = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 39 });
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 39 });
      await el.updateComplete;

      expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[0].hasAttribute('selected')).to.equal(true);

      expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    });

    it('home', async () => {
      const el = await fixture(tabsFixture);
      const buttons = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 36 });

      expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[0].hasAttribute('selected')).to.equal(true);

      expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    });

    it('end', async () => {
      const el = await fixture(tabsFixture);
      const buttons = el.querySelectorAll('button');

      el.__onKeyDown({ preventDefault: () => {}, keyCode: 35 });
      await el.updateComplete;

      expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[1].hasAttribute('selected')).to.equal(true);

      expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[0].hasAttribute('selected')).to.equal(false);
      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('events', () => {
    it('doesnt dispatch on first update', async () => {
      const el = fixtureSync(tabsFixture);
      const dispatchStub = stub(el, '__dispatch');
      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('doesnt dispatch when the vertical attribute is set', async () => {
      const el = fixtureSync(tabsFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.setAttribute('vertical', '');
      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('doesnt dispatch on slotchange', async () => {
      const el = await fixture(tabsFixture);
      const dispatchStub = stub(el, '__dispatch');

      const btn = document.createElement('button');
      btn.setAttribute('slot', 'tab');
      const div = document.createElement('div');
      div.setAttribute('slot', 'panel');
      el.append(btn);
      el.append(div);

      await el.updateComplete;
      expect(dispatchStub).callCount(0);
      dispatchStub.restore();
    });

    it('fires event on attr change', async () => {
      const el = await fixture(tabsFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.setAttribute('selected', '1');
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on prop change', async () => {
      const el = await fixture(tabsFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.selected = 1;
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on keydown', async () => {
      const el = await fixture(tabsFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 37 });
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });

    it('fires event on click', async () => {
      const el = await fixture(tabsFixture);
      const dispatchStub = stub(el, '__dispatch');
      el.querySelectorAll('button')[1].click();
      await el.updateComplete;
      expect(dispatchStub).callCount(1);
      dispatchStub.restore();
    });
  });

  describe('vertical', () => {
    it('changes accepted keys in vertical mode', async () => {
      const el = await fixture(tabsFixture);
      el.setAttribute('vertical', '');
      el.__onKeyDown({ preventDefault: () => {}, keyCode: 40 });
      await el.updateComplete;

      const buttons = el.querySelectorAll('button');

      expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[1].hasAttribute('selected')).to.equal(true);

      expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[0].hasAttribute('selected')).to.equal(false);
      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('headings', () => {
    it('works with headings and no predefined slots', async () => {
      const el = await fixture(tabsWithHeadingsFixture);
      const buttons = el.querySelectorAll('[slot="tab"]');
      buttons[1].click();
      await el.updateComplete;
      expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[1].hasAttribute('selected')).to.equal(true);
      expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[0].hasAttribute('selected')).to.equal(false);
      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
      buttons[0].click();
      await el.updateComplete;
      expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
      expect(buttons[0].hasAttribute('selected')).to.equal(true);
      expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
      expect(buttons[1].hasAttribute('selected')).to.equal(false);
      expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    });
  });
});
