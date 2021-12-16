import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { Task } from '../../src/Task';
import { TaskFactory } from '../../src/TaskFactory';

function createTask(value: string, func: (value: string) => void): Task {
  // prettier-ignore
  return new TaskFactory()
    .when(value)
    .isEqual('first')
      .do(() => func('first'))
    .isEqual('second')
      .do(() => func('second'))
    .otherwise()
      .do(() => func('default'))
    .build();
}

describe('WhenTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks first case execution', async () => {
    const task = createTask('first', spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
    assert.strictEqual(spyFunc.firstCall.firstArg, 'first');
  });

  it('checks second case execution', async () => {
    const task = createTask('second', spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
    assert.strictEqual(spyFunc.firstCall.firstArg, 'second');
  });

  it('checks default case execution', async () => {
    const task = createTask('default', spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
    assert.strictEqual(spyFunc.firstCall.firstArg, 'default');
  });
});
