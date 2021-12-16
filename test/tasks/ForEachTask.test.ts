import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { Task } from '../../src/Task';
import { TaskFactory } from '../../src/TaskFactory';

function createTask<T>(collection: Iterable<T>, spy: () => void): Task<any> {
  // prettier-ignore
  return new TaskFactory()
    .forEach<{ value?: T }>(collection, 'value')
      .do(spy)
    .build();
}

describe('ForEachTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks true condition', async () => {
    const task = createTask([], spyFunc);

    await task.exec({});

    assert.isTrue(spyFunc.notCalled);
  });

  it('checks elseif condition', async () => {
    const task = createTask([0], spyFunc);

    await task.exec({});

    assert.isTrue(spyFunc.calledOnce);
    assert.deepEqual(spyFunc.firstCall.firstArg, { value: 0 });
  });

  it('checks false condition', async () => {
    const task = createTask([0, 1, 2], spyFunc);

    await task.exec({});

    assert.isTrue(spyFunc.calledThrice);
    assert.deepEqual(spyFunc.firstCall.firstArg, { value: 0 });
    assert.deepEqual(spyFunc.secondCall.firstArg, { value: 1 });
    assert.deepEqual(spyFunc.thirdCall.firstArg, { value: 2 });
  });
});
