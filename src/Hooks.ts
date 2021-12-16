import { Task, TaskContext } from './Task';

type TaskProvider<T extends TaskContext> = () => Task<T>;

interface HookProps<T extends TaskContext> {
  hookName: string;
  taskProvider: TaskProvider<T>;
  owner?: unknown;
  cacheable?: boolean;
}

class Hook<T extends TaskContext> {
  private _task?: Task<T>;

  get task(): Task<T> {
    if (this._task != null) {
      return this._task;
    }
    const task = this.taskProvider();
    if (this.cacheable) {
      this._task = task;
    }
    return task;
  }

  constructor(
    public hookName: string,
    public taskProvider: TaskProvider<T>,
    public owner: unknown,
    public cacheable = true
  ) {}
}

export class Hooks {
  private hooks: Array<Hook<TaskContext>> = [];

  registerHook<T extends TaskContext>(info: HookProps<T>): void {
    this.ensureHookNotExists(info.hookName, info.taskProvider);
    const hook = new Hook(
      info.hookName,
      info.taskProvider,
      info.owner,
      info.cacheable
    );
    this.hooks.push(hook);
  }

  unregisterOwnerHooks(owner: unknown): void {
    this.hooks = this.hooks.filter((hook) => hook.owner !== owner);
  }

  unregisterHooks(hookName: string): void {
    this.hooks = this.hooks.filter((hook) => hook.hookName !== hookName);
  }

  unregisterHook(hookName: string, taskProvider: TaskProvider<any>): void {
    const index = this.hooks.findIndex(
      (hook) => hook.hookName === hookName && hook.taskProvider === taskProvider
    );
    if (index !== -1) {
      this.hooks.splice(index, 1);
    }
  }

  hookTasks<T extends TaskContext>(hookName: string): Array<Task<T>> {
    return this.hooks
      .filter((hook) => hook.hookName === hookName)
      .map((hook) => hook.task);
  }

  private ensureHookNotExists<T extends TaskContext>(
    hookName: string,
    taskProvider: TaskProvider<T>
  ): void {
    if (this.checkIfHookExists(hookName, taskProvider)) {
      throw new Error(`Hook ${hookName} already exists`);
    }
  }

  private checkIfHookExists(
    hookName: string,
    taskProvider: TaskProvider<any>
  ): boolean {
    return (
      this.hooks.find(
        (hook) =>
          hook.hookName === hookName && hook.taskProvider === taskProvider
      ) != null
    );
  }
}
