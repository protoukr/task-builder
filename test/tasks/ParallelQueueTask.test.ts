import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { Task } from '../../src/Task';
import { TaskFactory } from '../../src/TaskFactory';

function createTask(count: number, spy: () => void): Task {
  const queueBuilder = new TaskFactory().parallelQueue();
  new Array(count).fill(null).forEach(() => {
    queueBuilder.do(spy);
  });
  return queueBuilder.build();
}

describe('ParallelQueueTask', () => {
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

  it('checks execution with few tasks', async () => {
    const task = createTask(3, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledThrice);
  });
});
