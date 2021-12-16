import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { TaskFactory } from '../../src/TaskFactory';
import { Task, TaskContext } from '../../src/Task';

function createTask<T extends TaskContext = void>(
  repeatTimes: number,
  func: () => void,
  valueName?: keyof T
): Task<T> {
  // prettier-ignore
  return new TaskFactory()
    .repeat<T>(repeatTimes, valueName)
      .delay(0)
      .do(func)
    .build();
}

describe('RepeatTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks repeating 0 times', async () => {
    const task = createTask(0, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.notCalled);
  });

  it('checks repeating once', async () => {
    const task = createTask(1, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
  });

  it('checks repeating few times', async () => {
    const task = createTask(3, spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledThrice);
  });

  it('checks context passing', async () => {
    const task = createTask<{ someProp: string }>(1, spyFunc);

    await task.exec({ someProp: 'someValue' });

    assert.deepEqual(spyFunc.firstCall.firstArg, { someProp: 'someValue' });
  });

  it('checks repeat number passing', async () => {
    const task = createTask<{ repeatNum?: number }>(3, spyFunc, 'repeatNum');

    await task.exec({});

    assert.deepEqual(spyFunc.firstCall.firstArg, { repeatNum: 0 });
    assert.deepEqual(spyFunc.secondCall.firstArg, { repeatNum: 1 });
    assert.deepEqual(spyFunc.thirdCall.firstArg, { repeatNum: 2 });
  });
});
