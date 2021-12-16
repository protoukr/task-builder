import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { assert } from 'chai';
import { TaskFactory } from '../../src/TaskFactory';

describe('HookTask', () => {
  let taskFactory: TaskFactory;
  let spyFunc = spy();

  beforeEach(() => {
    taskFactory = new TaskFactory();
    spyFunc = spy();
  });

  it('checks execution without registered hooks', async () => {
    await taskFactory.queue().hook('test').build().exec();

    assert.isTrue(spyFunc.notCalled);
  });

  it('checks execution with one registered hook', async () => {
    taskFactory.hooks.registerHook({
      hookName: 'test',
      taskProvider: () => taskFactory.do(spyFunc),
    });

    await taskFactory.queue().hook('test').build().exec();

    assert.isTrue(spyFunc.calledOnce);
  });

  it('checks execution with few registered hooks', async () => {
    new Array(3).fill(0).forEach(() => {
      taskFactory.hooks.registerHook({
        hookName: 'test',
        taskProvider: () => taskFactory.do(spyFunc),
      });
    });

    await taskFactory.queue().hook('test').build().exec();

    assert.isTrue(spyFunc.calledThrice);
  });
});
