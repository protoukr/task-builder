import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { TaskContext, Task } from '../../src/Task';
import { TaskFactory } from '../../src/TaskFactory';

function createTask<T extends TaskContext>(
  count: number,
  spy: () => void
): Task<T> {
  const queueBuilder = new TaskFactory().queue<T>();
  new Array(count).fill(null).forEach(() => {
    queueBuilder.do(spy);
  });
  return queueBuilder.end().build();
}

describe('QueueTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks execution with no tasks', async () => {
    const task = createTask(0, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.notCalled);
  });

  it('checks execution with one task', async () => {
    const task = createTask(1, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
  });

  it('checks few items queue execution', async () => {
    const task = createTask(3, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledThrice);
  });

  it('checks context passing', async () => {
    const task = createTask<{ someProp: 'someValue' }>(1, spyFunc);

    await task.exec({ someProp: 'someValue' });

    assert.deepEqual(spyFunc.firstCall.firstArg, { someProp: 'someValue' });
  });
});
