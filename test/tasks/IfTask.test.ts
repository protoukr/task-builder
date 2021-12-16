import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { Task } from '../../src/Task';
import { TaskFactory } from '../../src/TaskFactory';

function createTask(value: string, func: (value: string) => void): Task {
  // prettier-ignore
  return new TaskFactory()
    .if(() => value === 'if')
      .do(() => func('if'))
    .elseif(() => value === 'elseif')
      .do(() => func('elseif'))
    .else()
      .do(() => func('else'))
    .end()
    .build();
}

describe('IfTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks true condition', async () => {
    const task = createTask('if', spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
    assert.strictEqual(spyFunc.firstCall.firstArg, 'if');
  });

  it('checks elseif condition', async () => {
    const task = createTask('elseif', spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
    assert.strictEqual(spyFunc.firstCall.firstArg, 'elseif');
  });

  it('checks false condition', async () => {
    const task = createTask('else', spyFunc);

    await task.exec();

    assert.isTrue(spyFunc.calledOnce);
    assert.strictEqual(spyFunc.firstCall.firstArg, 'else');
  });
});
