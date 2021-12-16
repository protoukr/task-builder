import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Task } from '../src/Task';
import { Hooks } from '../src/Hooks';
import { DelayTask } from '../src/tasks/DelayTask';

describe('Hooks', () => {
  let hooks: Hooks;

  beforeEach(() => {
    hooks = new Hooks();
  });

  it('checks hook registering', () => {
    const task = new DelayTask(0);
    hooks.registerHook({
      hookName: 'hook',
      taskProvider: () => task,
    });

    const hookTasks = hooks.hookTasks('hook');

    assert.lengthOf(hookTasks, 1);
    assert.strictEqual(hookTasks[0], task);
  });

  it('checks special hook unregistering', () => {
    const taskProvider = (): Task => new DelayTask(0);
    hooks.registerHook({
      hookName: 'hook',
      taskProvider,
    });

    hooks.unregisterHook('hook', taskProvider);
    const hookTasks = hooks.hookTasks('hook');

    assert.lengthOf(hookTasks, 0);
  });

  it("checks special owner's hooks unregistering ", () => {
    const owner = {};
    hooks.registerHook({
      hookName: 'hook',
      taskProvider: () => new DelayTask(0),
      owner,
    });
    hooks.registerHook({
      hookName: 'hook',
      taskProvider: () => new DelayTask(0),
      owner,
    });

    hooks.unregisterOwnerHooks(owner);
    const hookTasks = hooks.hookTasks('hook');

    assert.lengthOf(hookTasks, 0);
  });

  it('checks all hooks unregistering by name', () => {
    hooks.registerHook({
      hookName: 'hook',
      taskProvider: () => new DelayTask(0),
    });
    hooks.registerHook({
      hookName: 'hook',
      taskProvider: () => new DelayTask(0),
    });

    hooks.unregisterHooks('hook');
    const hookTasks = hooks.hookTasks('hook');

    assert.lengthOf(hookTasks, 0);
  });

  it('checks registering the same hook twice', () => {
    const taskProvider = (): Task => new DelayTask(0);
    hooks.registerHook({
      hookName: 'hook',
      taskProvider,
    });

    assert.throws(() => {
      hooks.registerHook({
        hookName: 'hook',
        taskProvider,
      });
    });
  });

  it('checks tasks hooking', () => {
    const task = new DelayTask(0);
    hooks.registerHook({
      hookName: 'hook1',
      taskProvider: () => new DelayTask(0),
    });
    hooks.registerHook({ hookName: 'hook2', taskProvider: () => task });
    hooks.registerHook({ hookName: 'hook2', taskProvider: () => task });
    hooks.registerHook({
      hookName: 'hook3',
      taskProvider: () => new DelayTask(0),
    });

    const tasks = hooks.hookTasks('hook2');

    assert.lengthOf(tasks, 2);
    assert.strictEqual(tasks[0], task);
    assert.strictEqual(tasks[1], task);
  });
});
