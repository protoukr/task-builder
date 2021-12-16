import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { TaskFactory } from '../../src/TaskFactory';

describe('DoTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks function calling', async () => {
    const task = new TaskFactory().do(spyFunc);

    await task.exec({});

    assert.isTrue(spyFunc.called);
  });

  it('checks context passing', async () => {
    const task = new TaskFactory().do(spyFunc);

    await task.exec({ someProp: 'someValue' });

    assert.deepEqual(spyFunc.firstCall.firstArg, { someProp: 'someValue' });
  });
});
