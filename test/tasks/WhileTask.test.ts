import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { Task } from '../../src/Task';
import { TaskFactory } from '../../src/TaskFactory';

function createTask(counter: number, spyFunc: () => void): Task {
  let i = 0;
  const condition = (): boolean => i++ < counter;
  // prettier-ignore
  return new TaskFactory().while(condition)
    .do(spyFunc)
    .build()
}

describe('WhileTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks false condition', async function () {
    const task = createTask(0, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.notCalled);
  });

  it('checks once true condition', async function () {
    const task = createTask(1, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
  });

  it('checks few times true condition', async function () {
    const task = createTask(3, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledThrice);
  });
});
