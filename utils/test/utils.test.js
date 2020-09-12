import { fixtureSync, expect, defineCE } from '@open-wc/testing'; // eslint-disable-line
import { stub } from 'sinon';
import { BatchingElement } from '../BatchingElement.js';

describe('BatchingElement', () => {
  it('batches updates', async () => {
    const tag = defineCE(
      class TestClass extends BatchingElement {
        set foo(_) {
          this.requestUpdate(false);
        }
      },
    );
    const el = await fixtureSync(`<${tag}></${tag}>`);
    const updateStub = stub(el, 'update');
    el.foo = 1;
    el.foo = 2;
    el.foo = 3;
    await el.updateComplete;
    expect(updateStub).callCount(1);

    el.foo = 4;
    await el.updateComplete;
    expect(updateStub).callCount(2);

    updateStub.restore();
  });

  it('dispatches an event', async () => {
    const tag = defineCE(
      class TestClass extends BatchingElement {
        set foo(_) {
          this.requestUpdate(true);
        }

        static get config() {
          return {
            disabled: false,
          };
        }
      },
    );
    const el = await fixtureSync(`<${tag}></${tag}>`);
    const dispatchStub = stub(el, '__dispatch');
    el.foo = 1;
    await el.updateComplete;
    expect(dispatchStub).callCount(1);
    dispatchStub.restore();
  });

  it('increases the uuid', () => {
    expect(BatchingElement.uuid).to.equal(2);
  });
});
